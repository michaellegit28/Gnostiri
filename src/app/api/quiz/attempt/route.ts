import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { AppDomain } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firebaseUid, domain, topicId, score, maxScore, answers, durationSeconds } = body;

    const targetDomain: AppDomain = domain === "highschool" ? "highschool" : "highschool";

    if (!firebaseUid) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (!topicId || score === undefined || maxScore === undefined) {
      return NextResponse.json({ error: "Missing required quiz attempt fields" }, { status: 400 });
    }

    // Find database user
    const dbUser = await prisma.user.findFirst({
      where: { firebaseUid },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Persist QuizAttempt row scoped to domain
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: dbUser.id,
        domain: targetDomain,
        topicId,
        score: Number(score),
        maxScore: Number(maxScore),
        answers: answers || [],
        durationSeconds: Number(durationSeconds) || 0,
      },
    });

    // Upsert Progress row scoped to domain: 'highschool'
    const accuracy = maxScore > 0 ? Number(score) / Number(maxScore) : 0;
    const status = accuracy >= 0.7 ? "completed" : "in_progress";

    const existingProgress = await prisma.progress.findFirst({
      where: {
        userId: dbUser.id,
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
          userId: dbUser.id,
          domain: targetDomain,
          entityType: "topic",
          entityId: topicId,
          status,
          accuracy,
          lastStudied: new Date(),
        },
      });
    }

    return NextResponse.json({ attempt, success: true }, { status: 200 });
  } catch (error) {
    console.error("Error creating quiz attempt:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
