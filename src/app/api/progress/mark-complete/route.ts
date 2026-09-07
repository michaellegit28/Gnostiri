import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-server";
import { AppDomain } from "@prisma/client";

const VALID_DOMAINS: AppDomain[] = ["highschool", "university", "extras"];

export async function POST(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { domain, topicId } = await req.json();

    // Fail safely: reject unknown/missing domains, never silently default.
    if (!domain || !VALID_DOMAINS.includes(domain)) {
      return NextResponse.json({ error: "Invalid domain" }, { status: 400 });
    }
    const targetDomain: AppDomain = domain;

    if (!topicId) {
      return NextResponse.json({ error: "Topic ID required" }, { status: 400 });
    }

    const existing = await prisma.progress.findFirst({
      where: {
        userId: auth.dbUser.id,
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
          userId: auth.dbUser.id,
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
