import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

// Fresh-fetch endpoint for widget — bypasses ISR, always returns live DB state.
// GET /api/alignment?topic=[slug]&board=[id]&track=[id?]
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = (searchParams.get("topic") || "").trim();
  const boardId = (searchParams.get("board") || "").trim();
  const trackId = (searchParams.get("track") || "").trim() || null;
  if (!slug || !boardId) return NextResponse.json({ error: "topic + board required" }, { status: 400 });

  // Resolve exam-specific slugs to master topics: exact → master-<slug> → title match.
  // Existing WAEC-style topics (waec-*-thermodynamics) have slug=id fallback, not master slugs.
  let topic = await prisma.topic.findFirst({ where: { slug }, select: { id: true, title: true, slug: true, lastAuditedDate: true } });
  if (!topic && !slug.startsWith("master-")) {
    topic = await prisma.topic.findFirst({ where: { slug: `master-${slug}` }, select: { id: true, title: true, slug: true, lastAuditedDate: true } });
  }
  if (!topic) {
    const tail = slug.split("-").slice(-2).join(" ");
    const byTitle = await prisma.topic.findMany({ where: { slug: { not: null } }, select: { id: true, title: true, slug: true, lastAuditedDate: true }, take: 100 });
    topic = byTitle.find((t) => t.title.toLowerCase().includes(tail) || slug.includes((t.slug || "").replace("master-", ""))) || null;
  }
  if (!topic) return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  const board = await prisma.curriculumBoard.findUnique({ where: { id: boardId }, include: { region: true } });
  if (!board) return NextResponse.json({ error: "Board not found" }, { status: 404 });

  // Track-specific first, then fall back to all-tracks (NULL) row
  let alignment = trackId
    ? await prisma.topicBoardAlignment.findFirst({ where: { topicId: topic.id, boardId, trackId } })
    : null;
  if (!alignment) {
    alignment = await prisma.topicBoardAlignment.findFirst({ where: { topicId: topic.id, boardId, trackId: null } });
  }

  // Defensive default: uncertain → elective (hard constraint 4). Missing row = pending, never fake core.
  if (!alignment) {
    return NextResponse.json(
      { tier: "elective", pending: true, verifiedDate: null, topic: { title: topic.title, slug }, board: { id: board.id, name: board.name, region: board.region.name } },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
  return NextResponse.json(
    {
      tier: alignment.tier,
      pending: false,
      verifiedDate: alignment.verifiedDate,
      weightNotes: alignment.weightNotes,
      board: { id: board.id, name: board.name, syllabusUrl: board.officialSyllabusUrl, year: board.syllabusVersionYear, region: board.region.name },
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
