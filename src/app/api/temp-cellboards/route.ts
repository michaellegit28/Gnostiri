import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// TEMPORARY: tag cell-biology CORE on every board (in every syllabus) — DELETE after confirmed.
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const topic = await prisma.topic.findFirst({ where: { slug: "cell-biology" } });
    if (!topic) throw new Error("master cell-biology topic missing");
    const today = new Date();
    const boards = await prisma.curriculumBoard.findMany({ select: { id: true, name: true } });
    if (!boards.length) throw new Error("No boards found");
    for (const board of boards) {
      const existing = await prisma.topicBoardAlignment.findFirst({ where: { topicId: topic.id, boardId: board.id, trackId: null } });
      if (existing) await prisma.topicBoardAlignment.update({ where: { id: existing.id }, data: { tier: "core", verifiedDate: today, weightNotes: "CORE: cells as unit of life in all 20 regions." } });
      else await prisma.topicBoardAlignment.create({ data: { topicId: topic.id, boardId: board.id, trackId: null, tier: "core", verifiedDate: today, weightNotes: "CORE: cells as unit of life in all 20 regions." } });
    }
    return NextResponse.json({ ok: true, boards: boards.length });
  } catch (e) {
    console.error("temp cellboards failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
