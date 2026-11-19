import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { buildRenderManifest } from "@/lib/exam-manifest";
import {
  isQuizAnswerSessionActive,
  parseQuizAnswerSession,
  type QuizAnswerSession,
} from "@/lib/quiz-answer-session";

export const dynamic = "force-dynamic";

function optionMatches(options: unknown, answer: string) {
  return Array.isArray(options) && options.some((option) => String(option) === answer);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as {
    domain?: unknown;
    topicId?: unknown;
    questionId?: unknown;
    answer?: unknown;
    sessionId?: unknown;
    practiceSessionId?: unknown;
    sectionId?: unknown;
  } | null;
  const domain = typeof body?.domain === "string" ? body.domain : "";
  const topicId = typeof body?.topicId === "string" ? body.topicId : "";
  const questionId = typeof body?.questionId === "string" ? body.questionId : "";
  const answer = typeof body?.answer === "string" ? body.answer : "";
  const sessionId = typeof body?.sessionId === "string" ? body.sessionId : "";
  const practiceSessionId = typeof body?.practiceSessionId === "string" ? body.practiceSessionId : "";
  const sectionId = typeof body?.sectionId === "string" ? body.sectionId : "";

  if (!["highschool", "university", "extras"].includes(domain)) {
    return NextResponse.json({ error: "Domain not found" }, { status: 404 });
  }
  if (!topicId || !questionId || !answer) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  if (practiceSessionId) {
    const session = await prisma.practiceSession.findUnique({
      where: { id: practiceSessionId },
      include: { examination: { select: { slug: true } } },
    });
    if (!session) return NextResponse.json({ error: "Practice session not found" }, { status: 404 });
    if (session.userId !== user.id) {
      return NextResponse.json({ error: "This practice session belongs to another learner" }, { status: 403 });
    }
    if (session.status !== "active") {
      return NextResponse.json({ error: "Practice session already submitted" }, { status: 409 });
    }
    if (session.expiresAt && session.expiresAt < new Date()) {
      return NextResponse.json({ error: "Practice session expired" }, { status: 410 });
    }
    if (session.topicId !== topicId) {
      return NextResponse.json({ error: "Question is not part of this practice session" }, { status: 403 });
    }

    const manifest = await buildRenderManifest(session.examination.slug, session.subjectSlug, session.topicId);
    const manifestSection = manifest?.sections.find((candidate) => candidate.sectionId === sectionId);
    if (!manifestSection?.questions.some((candidate) => candidate.id === questionId)) {
      return NextResponse.json({ error: "Question is not part of this practice section" }, { status: 403 });
    }
    if (manifestSection.order !== session.currentSectionIndex) {
      return NextResponse.json({ error: "This practice section is locked" }, { status: 409 });
    }

    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question || question.topicId !== topicId || question.domain !== domain) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }
    if (!optionMatches(question.options, answer)) {
      return NextResponse.json({ error: "Choose one of the listed options" }, { status: 400 });
    }

    const isCorrect = answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
    const stored = (session.answers as unknown as Record<string, { questionId: string; selectedAnswer: string | null; source?: "reveal" | "draft" }[]>) ?? {};
    const sectionAnswers = stored[sectionId] ?? [];
    if (sectionAnswers.some((entry) => entry.questionId === questionId)) {
      return NextResponse.json({ error: "Question already answered in this practice section" }, { status: 409 });
    }
    const nextAnswers = [...sectionAnswers, { questionId, selectedAnswer: answer, source: "reveal" as const }];
    await prisma.practiceSession.update({
      where: { id: session.id },
      data: { answers: { ...stored, [sectionId]: nextAnswers } },
    });

    return NextResponse.json({
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      sessionId: session.id,
    });
  }

  if (!sessionId) {
    return NextResponse.json({ error: "Quiz session is required" }, { status: 400 });
  }

  const attemptRow = await prisma.quizAttempt.findUnique({ where: { id: sessionId } });
  if (!attemptRow) return NextResponse.json({ error: "Quiz session not found" }, { status: 404 });
  if (attemptRow.userId !== user.id) {
    return NextResponse.json({ error: "This quiz session belongs to another learner" }, { status: 403 });
  }
  const quizSession = parseQuizAnswerSession(attemptRow.answers);
  if (!quizSession) return NextResponse.json({ error: "Quiz session is invalid" }, { status: 400 });
  if (!isQuizAnswerSessionActive(quizSession)) {
    return NextResponse.json({ error: "Quiz session expired" }, { status: 410 });
  }
  if (quizSession.domain !== domain || quizSession.topicId !== topicId) {
    return NextResponse.json({ error: "Question is not part of this quiz session" }, { status: 403 });
  }
  if (!quizSession.questionIds.includes(questionId)) {
    return NextResponse.json({ error: "Question is not part of this quiz session" }, { status: 403 });
  }
  if (quizSession.entries.some((entry) => entry.questionId === questionId)) {
    return NextResponse.json({ error: "Question already answered in this quiz session" }, { status: 409 });
  }

  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question || question.topicId !== topicId || question.domain !== domain) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }
  if (!optionMatches(question.options, answer)) {
    return NextResponse.json({ error: "Choose one of the listed options" }, { status: 400 });
  }

  const isCorrect = answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
  const answeredAt = new Date().toISOString();
  await prisma.$transaction(
    async (tx) => {
      const currentRow = await tx.quizAttempt.findUnique({ where: { id: sessionId } });
      const current = currentRow ? parseQuizAnswerSession(currentRow.answers) : null;
      if (!current || !isQuizAnswerSessionActive(current) || current.userId !== user.id) {
        throw new Error("Quiz session expired");
      }
      if (current.entries.some((entry) => entry.questionId === questionId)) {
        throw new Error("Question already answered");
      }
      const next: QuizAnswerSession = {
        ...current,
        entries: [
          ...current.entries,
          { questionId, selectedAnswer: answer, isCorrect, answeredAt },
        ],
      };
      await tx.quizAttempt.update({
        where: { id: sessionId },
        data: { answers: next as unknown as Prisma.InputJsonValue },
      });
    },
    { isolationLevel: "Serializable" },
  );

  return NextResponse.json({
    isCorrect,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    sessionId,
  });
}
