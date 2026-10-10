import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/questions?boardId=&topicId=&paperId=&type=
// Content endpoint for the practice UI: questions filtered by board tag and
// blueprint paper. Correct answers and marking schemes are never sent —
// grading happens server-side via the session APIs.
export async function GET(req: NextRequest) {
  const boardId = req.nextUrl.searchParams.get("boardId");
  const topicId = req.nextUrl.searchParams.get("topicId");
  const paperId = req.nextUrl.searchParams.get("paperId");
  const type = req.nextUrl.searchParams.get("type");
  if (!boardId || !topicId) {
    return NextResponse.json({ error: "boardId and topicId are required" }, { status: 400 });
  }

  const examination = await prisma.examination.findFirst({
    where: { domain: "highschool", slug: { equals: boardId.toLowerCase(), mode: "insensitive" } },
  });
  if (!examination) return NextResponse.json({ error: "Board not found" }, { status: 404 });

  const topic = await prisma.topic.findFirst({ where: { OR: [{ id: topicId }, { slug: topicId }] } });
  if (!topic) return NextResponse.json({ error: "Topic not found" }, { status: 404 });

  const questions = await prisma.question.findMany({
    where: {
      topicId: topic.id,
      ...(type ? { type: type.toLowerCase() } : {}),
      boardTags: {
        some: {
          examinationId: examination.id,
          tier: { not: "NOT_EXAMINED" },
          ...(paperId ? { paperIds: { array_contains: [paperId] } } : {}),
        },
      },
    },
    orderBy: { id: "asc" },
    select: { id: true, type: true, questionText: true, options: true, hint: true, difficulty: true },
  });

  return NextResponse.json({
    questions: questions.map((q) => ({
      id: q.id,
      type: q.type,
      questionText: q.questionText,
      options: Array.isArray(q.options) ? q.options.map(String) : [],
      hint: q.hint,
      difficulty: q.difficulty,
    })),
  });
}
