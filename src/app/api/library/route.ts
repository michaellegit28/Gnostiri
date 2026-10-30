import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";

/**
 * /api/library — the Public Library (ROADMAP.md Phase 4).
 *
 * GET browses shared, processed artifacts. Only metadata is listed: the count
 * of quiz items (never their stems/options/answers — a preview is the notes'
 * section headings only) and the uploader's display name. The integrity of
 * every quiz item stays server-side until the learner is scored on their own
 * desk, exactly as /api/documents enforces.
 *
 * POST publishes one of the caller's own "ready" documents. Artifacts only —
 * the source file is never stored, so publishing stores nothing new: it only
 * flips `visibility` and records `sharedAt`, then awards the first-platform
 * badge and +25 Prime-day credits. Publishing is not a notification event, so
 * nothing is pushed to the bell here.
 */

const TAKE_CAP = 24;
const DEFAULT_TAKE = 12;
const PUBLISH_CREDITS = 25;

/** Display handle for a shared artifact — a first name, never an email. */
function uploaderName(name: string | null | undefined): string {
  if (!name || !name.trim()) return "A Gnostiri student";
  const first = name.trim().split(/\s+/)[0];
  return first || "A Gnostiri student";
}

/** First heading block of each notes section, up to `limit` — headings only. */
function notesPreviewOf(notes: unknown, limit = 3): string[] {
  if (!Array.isArray(notes)) return [];
  const headings: string[] = [];
  for (const section of notes) {
    const blocks = (section as { blocks?: unknown }).blocks;
    if (!Array.isArray(blocks)) continue;
    const heading = blocks.find(
      (block): block is { type: string; text: string } =>
        (block as { type?: unknown })?.type === "heading" &&
        typeof (block as { text?: unknown }).text === "string",
    );
    if (heading) {
      const text = heading.text.trim();
      if (text) headings.push(text);
      if (headings.length >= limit) break;
    }
  }
  return headings;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  const subject = (searchParams.get("subject") ?? "").trim();
  const parsedTake = Number.parseInt(searchParams.get("take") ?? "", 10);
  const parsedSkip = Number.parseInt(searchParams.get("skip") ?? "", 10);
  const take = Number.isFinite(parsedTake) ? Math.min(Math.max(parsedTake, 1), TAKE_CAP) : DEFAULT_TAKE;
  const skip = Number.isFinite(parsedSkip) ? Math.max(parsedSkip, 0) : 0;

  const where = {
    visibility: "public",
    status: "ready",
    ...(q ? { title: { contains: q, mode: "insensitive" as const } } : {}),
    ...(subject ? { subjectSlug: subject } : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.studyDocument.findMany({
      where,
      orderBy: [{ reuseCount: "desc" }, { createdAt: "desc" }],
      // No quiz item rows are selected here — only a count. Stems and answers
      // stay off the public list; a preview is the notes' headings.
      select: {
        id: true,
        title: true,
        subjectSlug: true,
        pageCount: true,
        reuseCount: true,
        createdAt: true,
        notes: true,
        user: { select: { name: true } },
        _count: { select: { quizItems: true } },
      },
      skip,
      take,
    }),
    prisma.studyDocument.count({ where }),
  ]);

  return NextResponse.json({
    items: rows.map((doc) => ({
      id: doc.id,
      title: doc.title,
      subjectSlug: doc.subjectSlug,
      pageCount: doc.pageCount,
      quizItemCount: doc._count.quizItems,
      reuseCount: doc.reuseCount,
      uploader: uploaderName(doc.user?.name),
      notesPreview: notesPreviewOf(doc.notes),
      createdAt: doc.createdAt,
    })),
    total,
    skip,
    take,
  });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  let body: { id?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Send the document id in {id}" }, { status: 400 });
  }
  const id = typeof body.id === "string" ? body.id.trim() : "";
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const document = await prisma.studyDocument.findUnique({ where: { id } });
  if (!document) return NextResponse.json({ error: "Document not found" }, { status: 404 });
  if (document.userId !== user.id) return NextResponse.json({ error: "Only the owner can share this document" }, { status: 403 });
  // Only fully-processed artifacts are shareable: needs-ai/failed carry no
  // quiz, and a failed one has no honest notes to stand behind.
  if (document.status !== "ready") {
    return NextResponse.json({ error: "Only a ready document can be shared", status: document.status }, { status: 400 });
  }

  if (document.visibility === "public") {
    // Idempotent: already shared — no second badge, no second credit bundle.
    return NextResponse.json({
      document: { id: document.id, title: document.title, visibility: document.visibility, reuseCount: document.reuseCount },
      alreadyShared: true,
    });
  }

  const shared = await prisma.studyDocument.update({
    where: { id },
    data: { visibility: "public", sharedAt: new Date() },
  });

  // Dual reward for the first platform share: the deterministic badge (kept if
  // already held) and the +25 credit whose ledger balanceAfter runs from the
  // user's running credit sum. No notification — publishing is not an event.
  await prisma.leagueBadge.upsert({
    where: { userId_key: { userId: user.id, key: "first-artifact" } },
    update: {},
    create: { userId: user.id, key: "first-artifact", label: "First shared artifact" },
  });
  const balance = (await prisma.leagueCredit.aggregate({ where: { userId: user.id }, _sum: { delta: true } }))._sum.delta ?? 0;
  await prisma.leagueCredit.create({
    data: { userId: user.id, delta: PUBLISH_CREDITS, reason: "artifact-published", balanceAfter: balance + PUBLISH_CREDITS },
  });

  return NextResponse.json({
    document: { id: shared.id, title: shared.title, visibility: shared.visibility, reuseCount: shared.reuseCount },
    credits: PUBLISH_CREDITS,
    badge: "first-artifact",
  });
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
