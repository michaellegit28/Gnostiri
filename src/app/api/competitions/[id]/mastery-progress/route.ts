import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { computeMasteryStandings, recordMasteryProgress } from "@/lib/competition-additions";

export const dynamic = "force-dynamic";

// GET /api/competitions/[id]/mastery-progress — the Mastery Cup board.
//
// The Mastery Cup target is a constant (MASTERY_TARGET in
// competition-additions.ts) — no column, no migration: the page derives the
// target from the format, exactly like the Speed Cup derives its clock from
// question-set.ts. Progress is the mean of the member's ConceptMastery.masteryScore
// over the cup's subject (ConceptNode → Course), recomputed on every read —
// nothing about it is client-reported.
//
// This GET is also the recorder: the FIRST read after a member crosses the
// target writes their score (round(progress*100)), gives the first crosser
// rank 1, and notifies "milestone". The write is monotonic and idempotent,
// so refreshing the page never double-notifies.
//
// Visibility follows the Speed Cup contract: a non-member gets 404 exactly
// like a missing cup, so a private cup's existence is never confirmed.
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const competition = await prisma.competition.findUnique({ where: { id: params.id } });
  if (!competition) return NextResponse.json({ error: "Competition not found" }, { status: 404 });

  const member = await prisma.competitionMember.findUnique({
    where: { competitionId_userId: { competitionId: competition.id, userId: user.id } },
    include: { user: { select: { name: true } } },
  });
  if (!member) return NextResponse.json({ error: "Competition not found" }, { status: 404 });

  if (competition.format !== "mastery") {
    return NextResponse.json({ error: "This endpoint serves Mastery Cups only" }, { status: 400 });
  }
  if (competition.status === "cancelled" || competition.status === "finished") {
    return NextResponse.json({ error: "This cup is no longer live" }, { status: 400 });
  }
  if (competition.status === "scheduled" && Date.now() >= competition.startsAt.getTime()) {
    // updateMany, not update: the where clause keeps the old status, so a cup
    // cancelled while this request was in flight is never resurrected.
    await prisma.competition.updateMany({
      where: { id: competition.id, status: "scheduled" },
      data: { status: "live" },
    });
  }

  const members = await prisma.competitionMember.findMany({
    where: { competitionId: competition.id },
    include: { user: { select: { name: true } } },
    orderBy: [{ joinedAt: "asc" }, { userId: "asc" }],
  });

  const view = await computeMasteryStandings(prisma, competition, members, user.id);

  // The recorder: only when the caller's live progress is past the target.
  let recorded = null;
  if (view.me.crossed && view.me.progress !== null) {
    recorded = await recordMasteryProgress(prisma, competition, member, view.me.progress);
  }

  return NextResponse.json({ ...view, recorded });
}
