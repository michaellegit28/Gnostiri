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

    const body = await req.json();
    const { domain, topicId, score, maxScore, answers, durationSeconds } = body;

    // Fail safely: reject unknown/missing domains, never silently default.
    if (!domain || !VALID_DOMAINS.includes(domain)) {
      return NextResponse.json({ error: "Invalid domain" }, { status: 400 });
    }
    const targetDomain: AppDomain = domain;

    if (!topicId || score === undefined || maxScore === undefined) {
      return NextResponse.json(
        { error: "Missing required quiz attempt fields" },
        { status: 400 }
      );
    }

    // Persist QuizAttempt row scoped to domain
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: auth.dbUser.id,
        domain: targetDomain,
        topicId,
        score: Number(score),
        maxScore: Number(maxScore),
        answers: answers || [],
        durationSeconds: Number(durationSeconds) || 0,
      },
    });

    // Upsert Progress row scoped to domain
    const accuracy = maxScore > 0 ? Number(score) / Number(maxScore) : 0;
    const status = accuracy >= 0.7 ? "completed" : "in_progress";

    const existingProgress = await prisma.progress.findFirst({
      where: {
        userId: auth.dbUser.id,
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
          userId: auth.dbUser.id,
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
