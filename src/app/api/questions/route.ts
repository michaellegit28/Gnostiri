import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { boardTreeTopicIds } from "@/lib/board-bank";

export const dynamic = "force-dynamic";

// GET /api/questions?boardId=&topicId=&paperId=&type=
// Content endpoint for the practice UI. A question is part of a board's bank
// ONLY because it sits inside that board's own {code}-* topic tree — board tags
// can never ADD one (they may only subtract, via the RULE 4 NOT_EXAMINED
// exclusion). boardTags is therefore consulted for the NOT_EXAMINED tier alone.
// The topic itself must also resolve INSIDE the board's tree (boardTreeTopicIds):
// a hand-typed master-* topicId that the board never adopted is 404, not served.
// NOT_EXAMINED questions are never returned. Correct answers and marking schemes
// are never sent — grading happens server-side via the session APIs.
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

  // ONE taxonomy: the board's own tree is the bank. boardTreeTopicIds returns
  // null only for a tree-less board (that case skips the gate); otherwise a
  // topic outside the {code}-* tree — e.g. a master-* topic the board never
  // adopted — is not this board's syllabus content and answers 404. There is no
  // tag-admission path in either direction; a tag may only REMOVE a question.
  // RULE 4 applies here: NOT_EXAMINED never reaches the client.
  const treeTopicIds = await boardTreeTopicIds(examination.code.toLowerCase());
  const topic = await prisma.topic.findFirst({ where: { OR: [{ id: topicId }, { slug: topicId }] } });
  if (!topic) return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  if (treeTopicIds && !treeTopicIds.includes(topic.id)) {
    return NextResponse.json({ error: "Topic is not part of this board's syllabus tree" }, { status: 404 });
  }

  const questions = await prisma.question.findMany({
    where: {
      topicId: topic.id,
      ...(type ? { type: type.toLowerCase() } : {}),
      NOT: { boardTags: { some: { examinationId: examination.id, tier: "NOT_EXAMINED" } } },
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
