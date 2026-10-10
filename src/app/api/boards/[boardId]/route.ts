import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/boards/[boardId] — BoardBlueprint DTO: the board profile with its
// ordered paper blueprint. This is the shape Agent-4's components bind to.
export async function GET(_req: NextRequest, { params }: { params: { boardId: string } }) {
  const board = await prisma.examination.findFirst({
    where: {
      domain: "highschool",
      slug: { equals: params.boardId.toLowerCase(), mode: "insensitive" },
    },
  });
  if (!board) return NextResponse.json({ error: "Board not found" }, { status: 404 });

  const papers = await prisma.examinationPaper.findMany({
    where: { examinationId: board.id },
    orderBy: { sequence: "asc" },
  });

  return NextResponse.json({
    id: board.slug,
    name: board.name,
    code: board.code,
    region: board.country,
    lastVerified: board.lastVerified ? board.lastVerified.toISOString() : null,
    syllabusUrl: board.syllabusUrl,
    notes: board.notes,
    formatConfig: papers.map((p) => ({
      paperId: p.paperId,
      paperName: p.paperName,
      sequence: p.sequence,
      delivery: p.delivery,
      questionTypes: Array.isArray(p.questionTypes) ? p.questionTypes.map(String) : [],
      durationMinutes: p.durationMinutes,
      marks: p.marks,
      applicability: Array.isArray(p.applicability) ? p.applicability.map(String) : [],
      required: p.required,
      instructions: p.instructions,
    })),
  });
}
