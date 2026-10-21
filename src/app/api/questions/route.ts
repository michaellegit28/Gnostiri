import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/questions?boardId=&topicId=&paperId=&type=
// Content endpoint for the practice UI: a board's own topic tree is its bank;
// topics outside that tree stay tag- and blueprint-paper-scoped. NOT_EXAMINED
// questions are never returned. Correct answers and marking schemes are never
// sent — grading happens server-side via the session APIs.
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

  // ONE taxonomy: a question inside the board's OWN topic tree ({code}-*) is
  // part of that board's bank by construction — that is the tree /cbt serves,
  // so this endpoint can never again under-report it because a tag is missing.
  // Topics outside the tree keep the tag contract (blueprint papers + tiers).
  // RULE 4 applies to both paths: NOT_EXAMINED never reaches the client.
  const boardCode = examination.code.toLowerCase();
  const inBoardTree = topic.id === boardCode || topic.id.startsWith(`${boardCode}-`);

  const questions = await prisma.question.findMany({
    where: {
      topicId: topic.id,
      ...(type ? { type: type.toLowerCase() } : {}),
      NOT: { boardTags: { some: { examinationId: examination.id, tier: "NOT_EXAMINED" } } },
      ...(inBoardTree
        ? {}
        : {
            boardTags: {
              some: {
                examinationId: examination.id,
                ...(paperId ? { paperIds: { array_contains: [paperId] } } : {}),
              },
            },
          }),
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
