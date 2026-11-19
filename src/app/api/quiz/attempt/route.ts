import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { AppDomain, type Prisma, type QuizAttempt } from "@prisma/client";
import { getCurrentUser } from "@/lib/server-auth";
import { recordLearningActivity } from "@/lib/activity";
import {
  isQuizAnswerSessionActive,
  parseQuizAnswerSession,
} from "@/lib/quiz-answer-session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { domain, topicId, score, maxScore, answers, durationSeconds, sessionId } = body;
    const targetDomain: AppDomain | undefined = ["highschool", "university", "extras"].includes(domain)
      ? domain
      : undefined;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (!targetDomain) return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    if (
      !topicId ||
      score === undefined ||
      maxScore === undefined ||
      !Array.isArray(answers) ||
      typeof sessionId !== "string" ||
      !sessionId
    ) {
      return NextResponse.json({ error: "Missing required quiz attempt fields" }, { status: 400 });
    }
    const topic = await prisma.topic.findFirst({ where: { id: topicId, domain: targetDomain } });
    if (!topic) return NextResponse.json({ error: "Topic not found" }, { status: 404 });

    let attempt: QuizAttempt | null = null;
    let safeAnswers: { questionId: string; selectedAnswer: string }[];

    if (typeof sessionId === "string" && sessionId) {
      const sessionRow = await prisma.quizAttempt.findUnique({ where: { id: sessionId } });
      if (!sessionRow) return NextResponse.json({ error: "Quiz session not found" }, { status: 404 });
      if (sessionRow.userId !== user.id) {
        return NextResponse.json({ error: "This quiz session belongs to another learner" }, { status: 403 });
      }
      if (sessionRow.domain !== targetDomain || sessionRow.topicId !== topicId) {
        return NextResponse.json({ error: "Quiz session does not match this topic" }, { status: 403 });
      }
      const quizSession = parseQuizAnswerSession(sessionRow.answers);
      if (!quizSession) return NextResponse.json({ error: "Quiz session is invalid" }, { status: 400 });
      if (quizSession.completed && quizSession.attemptId) {
        const existing = await prisma.quizAttempt.findUnique({ where: { id: quizSession.attemptId } });
        if (existing) return NextResponse.json({ attempt: existing, success: true }, { status: 200 });
      }
      if (!isQuizAnswerSessionActive(quizSession)) {
        return NextResponse.json({ error: "Quiz session expired" }, { status: 410 });
      }
      if (quizSession.entries.length === 0) {
        return NextResponse.json({ error: "No server-recorded answers to submit" }, { status: 400 });
      }

      safeAnswers = quizSession.entries.map((entry) => ({
        questionId: entry.questionId,
        selectedAnswer: entry.selectedAnswer,
      }));
      const questions = await prisma.question.findMany({
        where: {
          id: { in: safeAnswers.map((answer) => answer.questionId) },
          topicId,
          domain: targetDomain,
        },
      });
      if (questions.length !== safeAnswers.length) {
        return NextResponse.json({ error: "Invalid answers" }, { status: 400 });
      }
      const scoreCount = quizSession.entries.filter((entry) => entry.isCorrect).length;

      attempt = await prisma.$transaction(
        async (tx) => {
          const currentRow = await tx.quizAttempt.findUnique({ where: { id: sessionId } });
          const current = currentRow ? parseQuizAnswerSession(currentRow.answers) : null;
          if (!current || !isQuizAnswerSessionActive(current) || current.userId !== user.id) {
            throw new Error("Quiz session expired");
          }
          const completedAttempt = await tx.quizAttempt.create({
            data: {
              userId: user.id,
              domain: targetDomain,
              topicId,
              score: scoreCount,
              maxScore: questions.length,
              answers: safeAnswers as unknown as Prisma.InputJsonValue,
              durationSeconds: Number(durationSeconds) || 0,
            },
          });
          await tx.quizAttempt.update({
            where: { id: sessionId },
            data: {
              answers: {
                ...current,
                completed: true,
                attemptId: completedAttempt.id,
              } as unknown as Prisma.InputJsonValue,
            },
          });
          return completedAttempt;
        },
        { isolationLevel: "Serializable" },
      );
    }

    if (!attempt) return NextResponse.json({ error: "Quiz attempt could not be created" }, { status: 500 });
    const accuracy = attempt.maxScore > 0 ? attempt.score / attempt.maxScore : 0;
    const status = accuracy >= 0.7 ? "completed" : "in_progress";
    const existingProgress = await prisma.progress.findFirst({
      where: {
        userId: user.id,
        domain: targetDomain,
        entityType: "topic",
        entityId: topicId,
      },
    });

    if (existingProgress) {
      await prisma.progress.update({
        where: { id: existingProgress.id },
        data: { status, accuracy, lastStudied: new Date() },
      });
    } else {
      await prisma.progress.create({
        data: {
          userId: user.id,
          domain: targetDomain,
          entityType: "topic",
          entityId: topicId,
          status,
          accuracy,
          lastStudied: new Date(),
        },
      });
    }
    await recordLearningActivity(user.id);

    return NextResponse.json({ attempt, success: true }, { status: 200 });
  } catch (error) {
    console.error("Error creating quiz attempt:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
