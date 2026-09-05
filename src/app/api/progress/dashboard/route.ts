import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getWeakTopics, getStrongTopics } from "@/lib/progress";
import { AppDomain } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const firebaseUid = searchParams.get("firebaseUid");
    const domainParam = searchParams.get("domain") || "highschool";

    const targetDomain: AppDomain = domainParam === "highschool" ? "highschool" : "highschool";

    if (!firebaseUid) {
      return NextResponse.json({ error: "firebaseUid required" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { firebaseUid },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const weakTopics = await getWeakTopics(user.id, targetDomain);
    const strongTopics = await getStrongTopics(user.id, targetDomain);

    const recentAttemptsData = await prisma.quizAttempt.findMany({
      where: {
        userId: user.id,
        domain: targetDomain,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      include: {
        topic: true,
      },
    });

    const recentAttempts = recentAttemptsData.map((attempt) => ({
      id: attempt.id,
      topicId: attempt.topicId,
      topicTitle: attempt.topic?.title || attempt.topicId,
      score: attempt.score,
      maxScore: attempt.maxScore,
      accuracy: attempt.maxScore > 0 ? Math.round((attempt.score / attempt.maxScore) * 100) : 0,
      durationSeconds: attempt.durationSeconds,
      createdAt: attempt.createdAt,
    }));

    return NextResponse.json(
      {
        weakTopics,
        strongTopics,
        recentAttempts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching progress dashboard:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
