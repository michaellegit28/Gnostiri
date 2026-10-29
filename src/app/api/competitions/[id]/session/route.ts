import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { buildCupQuestionSet, SPEED_CUP_DURATION_MINUTES } from "../question-set";

export const dynamic = "force-dynamic";

// GET /api/competitions/[id]/session — the live Speed Cup paper.
//
// Auth + membership: a non-member gets 404 exactly like a missing cup, so a
// private cup's existence is never confirmed to a stranger. The paper is
// derived from the competition id on EVERY call (question-set.ts) — identical
// for every racer, never stored, and it never carries correctAnswer: grading
// happens server-side in /submit once the clock has started.
//
// Response: { startedAt, durationMinutes, questions[] }. startedAt is the
// server's own clock for this sit-down and is the timer anchor the play client
// measures against, so a tampered browser clock cannot buy more time.
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const competition = await prisma.competition.findUnique({ where: { id: params.id } });
  if (!competition) return NextResponse.json({ error: "Competition not found" }, { status: 404 });

  const member = await prisma.competitionMember.findUnique({
    where: { competitionId_userId: { competitionId: competition.id, userId: user.id } },
  });
  if (!member) return NextResponse.json({ error: "Competition not found" }, { status: 404 });

  if (competition.status === "cancelled" || competition.status === "finished") {
    return NextResponse.json({ error: "This cup is no longer live" }, { status: 400 });
  }
  // Endurance / mastery / bracket cups run on day-long clocks, not a 45-minute
  // paper. This endpoint serves the live Speed Cup play surface only.
  if (competition.format !== "speed") {
    return NextResponse.json({ error: "Live play is not available for this format" }, { status: 400 });
  }

  const startedAt = new Date();
  if (competition.status === "scheduled" && startedAt >= competition.startsAt) {
    // updateMany, not update: the where clause keeps the old status, so a cup
    // cancelled while this request was in flight is never resurrected as live.
    await prisma.competition.updateMany({
      where: { id: competition.id, status: "scheduled" },
      data: { status: "live" },
    });
  }

  const questions = await buildCupQuestionSet(competition);
  if (questions.length === 0) {
    return NextResponse.json({ error: "This cup has no questions available" }, { status: 404 });
  }

  return NextResponse.json({
    startedAt: startedAt.toISOString(),
    durationMinutes: SPEED_CUP_DURATION_MINUTES,
    questions,
  });
}
