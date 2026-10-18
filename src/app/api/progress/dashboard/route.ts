import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getWeakTopics, getStrongTopics } from "@/lib/progress";
import { AppDomain } from "@prisma/client";
import { getCurrentUser } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const domainParam = searchParams.get("domain");
    const targetDomain: AppDomain | undefined = ["highschool", "university", "extras"].includes(domainParam || "") ? domainParam as AppDomain : undefined;
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    if (!targetDomain) return NextResponse.json({ error: "Invalid domain" }, { status: 404 });
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
    const [profile, plan] = await Promise.all([
      prisma.profile.findUnique({ where: { userId: user.id } }),
      prisma.studyPlan.findFirst({ where: { userId: user.id, domain: targetDomain, isActive: true }, orderBy: { updatedAt: "desc" } }),
    ]);
    const lastActiveDay = profile?.lastActive.toISOString().slice(0, 10);
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const streak = lastActiveDay === today || lastActiveDay === yesterday ? profile?.streak || 0 : 0;

    return NextResponse.json(
      {
        weakTopics,
        strongTopics,
        recentAttempts,
        streak,
        studyPlan: plan ? { id: plan.id, examDate: plan.examDate, items: plan.items, generatedBy: plan.generatedBy } : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching progress dashboard:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
