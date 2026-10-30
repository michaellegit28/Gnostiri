import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { scheduleTasks } from "@/lib/desk-pipeline";
import { createNotification } from "@/lib/notify";

/**
 * /api/library/[id]/adopt — put a shared artifact on your desk (ROADMAP Phase 4).
 *
 * Adoption is the SAME dedupe path the Desk pipeline already uses: identical
 * processed text is never stored twice, so adopting reuses the cohort's single
 * processed StudyDocument and copies its quiz items as the caller's OWN rows
 * (their userId), then schedules a fresh study plan. Artifacts only — the
 * source file is never stored, so there is nothing to copy but the processed
 * notes/quiz the pipeline already built. The copied rows carry document-derived
 * content only (stem/options/answer/explanation are the cohort's artifact, not
 * the uploader's private data), and their `userId` is set to the adopter.
 *
 * The reward is dual and always lands on the UPLOADER, never the adopter:
 *   - badges: first adoption ("artifact-first-adoption"), then every tenth
 *     adoption ("artifact-reused-N", keyed by the exact count reached)
 *   - credits: +10 per adoption, on the running-sum LeagueCredit ledger
 */

const ADOPT_CREDITS = 10;

interface RouteContext {
  params: { id: string };
}

export async function POST(_req: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const document = await prisma.studyDocument.findUnique({
    where: { id: params.id },
    select: { id: true, userId: true, title: true, contentHash: true, visibility: true, status: true },
  });
  if (!document || document.visibility !== "public") {
    return NextResponse.json({ error: "Artifact not found" }, { status: 404 });
  }

  // The caller must not already hold this contentHash. contentHash is globally
  // unique (one processed artifact per textbook), so this guards both the owner
  // and a prior desk/library adoption of the same artifact.
  const alreadyOwned = await prisma.studyDocument.findFirst({
    where: { userId: user.id, contentHash: document.contentHash },
    select: { id: true },
  });
  const alreadyAdopted = await prisma.documentQuizItem.count({ where: { documentId: document.id, userId: user.id } });
  if (document.userId === user.id || alreadyOwned || alreadyAdopted > 0) {
    return NextResponse.json({ error: "Already on your desk" }, { status: 409 });
  }

  // First adoption — reuse the Desk dedupe path: copy the cohort's quiz items
  // as the caller's own rows (linked to the same processed StudyDocument), with
  // `userId` set to the adopter so scoring runs against their own copy.
  const sourceItems = await prisma.documentQuizItem.findMany({ where: { documentId: document.id }, orderBy: { createdAt: "asc" } });
  if (sourceItems.length > 0) {
    await prisma.documentQuizItem.createMany({
      data: sourceItems.map((item) => ({
        documentId: document.id,
        userId: user.id,
        stem: item.stem,
        options: item.options as unknown as Prisma.InputJsonValue,
        correctAnswer: item.correctAnswer,
        explanation: item.explanation,
        difficulty: item.difficulty,
      })),
    });
  }

  // A fresh plan for the adopter (the same helper the Desk pipeline schedules with).
  const rows = scheduleTasks({
    minutesPerDay: 30,
    days: 7,
    startDate: new Date(),
    userId: user.id,
    documentId: document.id,
    title: document.title,
  });
  await prisma.studyTask.createMany({ data: rows });

  // ── The uploader's dual reward ──
  const updated = await prisma.studyDocument.update({
    where: { id: document.id },
    data: { reuseCount: { increment: 1 } },
    select: { reuseCount: true },
  });
  const reuseCount = updated.reuseCount;
  const awarded: Array<{ key: string; label: string }> = [];
  const awardBadge = async (key: string, label: string) => {
    await prisma.leagueBadge.upsert({
      where: { userId_key: { userId: document.userId, key } },
      update: {}, // already held — keep the original awardedAt
      create: { userId: document.userId, key, label },
    });
    awarded.push({ key, label });
  };

  // First adoption of this artifact.
  if (reuseCount === 1) await awardBadge("artifact-first-adoption", "First classmate adopted this");
  // Every tenth adoption crosses a milestone — keyed by the exact count reached.
  if (reuseCount % 10 === 0) await awardBadge(`artifact-reused-${reuseCount}`, `Reused by ${reuseCount} classmates`);

  // +10 credits on the running-sum ledger (balanceAfter from the user's sum).
  const balance = (await prisma.leagueCredit.aggregate({ where: { userId: document.userId }, _sum: { delta: true } }))._sum.delta ?? 0;
  await prisma.leagueCredit.create({
    data: { userId: document.userId, delta: ADOPT_CREDITS, reason: "artifact-adopted", balanceAfter: balance + ADOPT_CREDITS },
  });

  // Notify the uploader only (never the adopter). Best-effort: a notification
  // failure must never fail the adoption that already happened.
  const adopterName = user.name?.trim()?.split(/\s+/)[0] || "A classmate";
  try {
    await createNotification(document.userId, {
      type: "artifact_reward",
      title: `${adopterName} adopted your ${document.title}`,
      body: `Another student adopted your shared artifact "${document.title.slice(0, 80)}" — you earned ${ADOPT_CREDITS} Prime-day credits.`,
      href: `/library/${document.id}`,
    });
  } catch {
    // Notification is best-effort; the artifact is already on the adopter's desk.
  }

  return NextResponse.json({
    adopted: true,
    documentId: document.id,
    credits: ADOPT_CREDITS,
    uploaderId: document.userId,
    reuseCount,
    quizCopied: sourceItems.length,
    badges: awarded,
  });
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
