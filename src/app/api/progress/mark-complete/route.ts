import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { AppDomain } from "@prisma/client";
import { getCurrentUser } from "@/lib/server-auth";
import { recordLearningActivity } from "@/lib/activity";

export async function POST(req: NextRequest) {
  try {
    const { domain, topicId } = await req.json();
    const targetDomain: AppDomain | undefined = ["highschool", "university", "extras"].includes(domain) ? domain : undefined;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (!targetDomain) return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    if (!topicId) {
      return NextResponse.json({ error: "Topic ID required" }, { status: 400 });
    }
    const topic = await prisma.topic.findFirst({ where: { id: topicId, domain: targetDomain } });
    if (!topic) return NextResponse.json({ error: "Topic not found" }, { status: 404 });

    const existing = await prisma.progress.findFirst({
      where: {
        userId: user.id,
        domain: targetDomain,
        entityType: "topic",
        entityId: topicId,
      },
    });

    let progressRow;
    if (existing) {
      progressRow = await prisma.progress.update({
        where: { id: existing.id },
        data: {
          status: "completed",
          accuracy: existing.accuracy ?? 1.0,
          lastStudied: new Date(),
        },
      });
    } else {
      progressRow = await prisma.progress.create({
        data: {
          userId: user.id,
          domain: targetDomain,
          entityType: "topic",
          entityId: topicId,
          status: "completed",
          accuracy: 1.0,
          lastStudied: new Date(),
        },
      });
    }
    await recordLearningActivity(user.id);

    return NextResponse.json({ progress: progressRow, success: true }, { status: 200 });
  } catch (error) {
    console.error("Error marking topic complete:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
