import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-server";
import { getWeakTopics, getStrongTopics } from "@/lib/progress";
import { AppDomain } from "@prisma/client";

export const dynamic = "force-dynamic";

const VALID_DOMAINS: AppDomain[] = ["highschool", "university", "extras"];

export async function GET(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const domainParam = searchParams.get("domain") || "highschool";

    // Fail safely: reject unknown domains, never silently default.
    if (!VALID_DOMAINS.includes(domainParam as AppDomain)) {
      return NextResponse.json({ error: "Invalid domain" }, { status: 400 });
    }
    const targetDomain: AppDomain = domainParam as AppDomain;

    const weakTopics = await getWeakTopics(auth.dbUser.id, targetDomain);
    const strongTopics = await getStrongTopics(auth.dbUser.id, targetDomain);

    const recentAttemptsData = await prisma.quizAttempt.findMany({
      where: {
        userId: auth.dbUser.id,
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
      accuracy:
        attempt.maxScore > 0
          ? Math.round((attempt.score / attempt.maxScore) * 100)
          : 0,
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
