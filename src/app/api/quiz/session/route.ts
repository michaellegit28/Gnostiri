import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import {
  createQuizAnswerSession,
  parseQuizAnswerSession,
} from "@/lib/quiz-answer-session";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as {
    previousSessionId?: unknown;
    questionIds?: unknown;
  } | null;
  const previousSessionId =
    typeof body?.previousSessionId === "string" ? body.previousSessionId : "";
  const requestedQuestionIds = Array.isArray(body?.questionIds)
    ? body.questionIds.filter((id): id is string => typeof id === "string")
    : [];
  if (!previousSessionId || requestedQuestionIds.length === 0) {
    return NextResponse.json({ error: "previousSessionId and questionIds are required" }, { status: 400 });
  }

  const previousRow = await prisma.quizAttempt.findUnique({ where: { id: previousSessionId } });
  if (!previousRow) return NextResponse.json({ error: "Quiz session not found" }, { status: 404 });
  if (previousRow.userId !== user.id) {
    return NextResponse.json({ error: "This quiz session belongs to another learner" }, { status: 403 });
  }
  const previous = parseQuizAnswerSession(previousRow.answers);
  if (!previous) return NextResponse.json({ error: "Quiz session is invalid" }, { status: 400 });
  if (!previous.completed) {
    return NextResponse.json({ error: "Finish the quiz before starting a retry" }, { status: 409 });
  }
  if (previous.parentSessionId) {
    return NextResponse.json({ error: "This quiz already used its retry session" }, { status: 409 });
  }
  if (!requestedQuestionIds.every((id) => previous.questionIds.includes(id))) {
    return NextResponse.json({ error: "Retry questions must come from the original quiz session" }, { status: 403 });
  }

  const session = await createQuizAnswerSession({
    userId: user.id,
    domain: previous.domain,
    topicId: previous.topicId,
    examCode: previous.examCode,
    questionIds: requestedQuestionIds,
    parentSessionId: previous.id,
  });
  return NextResponse.json({ sessionId: session.id });
}
