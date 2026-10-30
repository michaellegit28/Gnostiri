import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";

/**
 * /api/library/[id] — one shared artifact.
 *
 * GET returns the processed notes (the LessonBlocks JSON, as-is) plus the
 * quiz-item count. Artifacts only — the source file is never stored, so the
 * only thing that exists to share is exactly what ships here: document-derived
 * notes that carry no user-identifying data. A leaked-existence is avoided by
 * the 404 for anything not `visibility = "public"`.
 *
 * DELETE unpublishes (owner only): it flips back to private and clears
 * sharedAt, removing the artifact from the library. The reward ledger is
 * deliberately NOT reversed — see the note below.
 */

interface RouteContext {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const document = await prisma.studyDocument.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      title: true,
      subjectSlug: true,
      pageCount: true,
      status: true,
      reuseCount: true,
      sharedAt: true,
      createdAt: true,
      visibility: true,
      notes: true,
      user: { select: { name: true } },
      _count: { select: { quizItems: true } },
    },
  });
  if (!document || document.visibility !== "public") {
    return NextResponse.json({ error: "Artifact not found" }, { status: 404 });
  }

  const uploader = document.user?.name?.trim()?.split(/\s+/)[0] || "A Gnostiri student";

  return NextResponse.json({
    document: {
      id: document.id,
      title: document.title,
      subjectSlug: document.subjectSlug,
      pageCount: document.pageCount,
      status: document.status,
      reuseCount: document.reuseCount,
      sharedAt: document.sharedAt,
      createdAt: document.createdAt,
      uploader,
      notes: document.notes,
      quizItemCount: document._count.quizItems,
    },
  });
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const document = await prisma.studyDocument.findUnique({
    where: { id: params.id },
    select: { id: true, userId: true, visibility: true },
  });
  if (!document || document.userId !== user.id) {
    return NextResponse.json({ error: "Artifact not found" }, { status: 404 });
  }

  await prisma.studyDocument.update({
    where: { id: params.id },
    data: { visibility: "private", sharedAt: null },
  });

  // The LeagueCredit/LeagueBadge rows are NOT reversed on unpublish. The ledger
  // is an append-only record of honour already earned while the artifact was
  // public and being reused; the credits an uploader banked (and the badges
  // they still hold) belong to that history. Reversing them would let an
  // uploader farm credits/badges by publishing, then claw them back by
  // hiding the artifact — and would silently rewrite the running balances shown
  // to classmates. Unpublishing removes future visibility, not past credit.
  return NextResponse.json({ unpublished: document.id });
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
