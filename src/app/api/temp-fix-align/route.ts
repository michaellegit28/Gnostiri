import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// TEMPORARY align fix — DELETE after confirmed. Loud: throws if topic missing (no silent skip).
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  const today = new Date();
  const slugs = ["human-physiology", "thermodynamics", "statistics-probability"];
  const report: Record<string, number | string> = {};
  try {
    const boards = await prisma.curriculumBoard.findMany({ select: { id: true, name: true } });
    if (boards.length === 0) throw new Error("No boards found — run ?step=init seed first");
    for (const slug of slugs) {
      const topic = await prisma.topic.findFirst({ where: { slug } });
      if (!topic) throw new Error(`Topic missing for slug=${slug} — run topics seed first`);
      let n = 0;
      for (const board of boards) {
        const existing = await prisma.topicBoardAlignment.findFirst({ where: { topicId: topic.id, boardId: board.id, trackId: null } });
        const note = slug === "human-physiology" ? "CORE UK A-Levels + SG H2 9744; all regions." : slug === "thermodynamics" ? "CORE Cambridge 9702 + SG H2 Physics; all regions." : "CORE IL Bagrut; all regions.";
        if (existing) await prisma.topicBoardAlignment.update({ where: { id: existing.id }, data: { tier: "core", verifiedDate: today, weightNotes: note } });
        else await prisma.topicBoardAlignment.create({ data: { topicId: topic.id, boardId: board.id, trackId: null, tier: "core", verifiedDate: today, weightNotes: note } });
        n++;
      }
      report[slug] = n;
    }
    return NextResponse.json({ ok: true, boards: boards.length, report });
  } catch (e) {
    console.error("temp-fix-align failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
