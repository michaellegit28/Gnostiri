import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { AppDomain } from "@prisma/client";
import { getCurrentUser } from "@/lib/server-auth";
import { recordLearningActivity } from "@/lib/activity";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { domain, topicId, score, maxScore, answers, durationSeconds } = body;
    const targetDomain: AppDomain | undefined = ["highschool", "university", "extras"].includes(domain) ? domain : undefined;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (!targetDomain) return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    if (!topicId || score === undefined || maxScore === undefined || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Missing required quiz attempt fields" }, { status: 400 });
    }
    const topic = await prisma.topic.findFirst({ where: { id: topicId, domain: targetDomain } });
    if (!topic) return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    const safeAnswers = answers.map((answer: { questionId?: string; selectedAnswer?: string }) => ({
      questionId: answer.questionId,
      selectedAnswer: String(answer.selectedAnswer || "").slice(0, 500),
    }));
    if (!safeAnswers.length || new Set(safeAnswers.map((answer) => answer.questionId)).size !== safeAnswers.length) return NextResponse.json({ error: "Invalid answer set" }, { status: 400 });
    const questions = await prisma.question.findMany({ where: { id: { in: safeAnswers.map((a) => a.questionId || "") }, topicId, domain: targetDomain } });
    if (questions.length !== safeAnswers.length) return NextResponse.json({ error: "Invalid answers" }, { status: 400 });
    const scoreCount = questions.reduce((count, question) => count + (question.correctAnswer.trim().toLowerCase() === String(safeAnswers.find((a) => a.questionId === question.id)?.selectedAnswer || "").trim().toLowerCase() ? 1 : 0), 0);

    // Persist QuizAttempt row scoped to domain
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        domain: targetDomain,
        topicId,
        score: scoreCount,
        maxScore: questions.length,
        answers: safeAnswers,
        durationSeconds: Number(durationSeconds) || 0,
      },
    });

    // Upsert Progress row scoped to domain: 'highschool'
    const accuracy = questions.length > 0 ? scoreCount / questions.length : 0;
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
        data: {
          status,
          accuracy,
          lastStudied: new Date(),
        },
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
