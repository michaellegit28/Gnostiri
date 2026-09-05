import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { AppDomain } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { firebaseUid, domain, topicId } = await req.json();

    const targetDomain: AppDomain = domain === "highschool" ? "highschool" : "highschool";

    if (!firebaseUid) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (!topicId) {
      return NextResponse.json({ error: "Topic ID required" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { firebaseUid },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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

    return NextResponse.json({ progress: progressRow, success: true }, { status: 200 });
  } catch (error) {
    console.error("Error marking topic complete:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
