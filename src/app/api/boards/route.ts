import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/boards — all exam boards grouped by region, with verification
// badge data (lastVerified + syllabusUrl) for the UI.
export async function GET() {
  const boards = await prisma.examination.findMany({
    where: { domain: "highschool" },
    orderBy: { name: "asc" },
    include: { _count: { select: { blueprint: true, papers: true } } },
  });

  const regions = new Map<string, {
    region: string;
    boards: {
      id: string;
      name: string;
      code: string;
      lastVerified: string | null;
      syllabusUrl: string | null;
      notes: string | null;
      papers: { paperId: string; paperName: string; sequence: number; questionTypes: string[] }[];
    }[];
  }>();

  for (const board of boards) {
    const blueprint = await prisma.examinationPaper.findMany({
      where: { examinationId: board.id },
      orderBy: { sequence: "asc" },
      select: { paperId: true, paperName: true, sequence: true, questionTypes: true },
    });
    const regionName = board.country?.trim() || "International";
    if (!regions.has(regionName)) regions.set(regionName, { region: regionName, boards: [] });
    regions.get(regionName)!.boards.push({
      id: board.slug,
      name: board.name,
      code: board.code,
      lastVerified: board.lastVerified ? board.lastVerified.toISOString() : null,
      syllabusUrl: board.syllabusUrl,
      notes: board.notes,
      papers: blueprint.map((p) => ({
        paperId: p.paperId,
        paperName: p.paperName,
        sequence: p.sequence,
        questionTypes: Array.isArray(p.questionTypes) ? p.questionTypes.map(String) : [],
      })),
    });
  }

  return NextResponse.json({ regions: Array.from(regions.values()) });
}
