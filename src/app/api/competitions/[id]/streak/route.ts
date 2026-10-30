import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { enduranceCheckIn, enduranceView, type EnduranceView } from "@/lib/competition-additions";

export const dynamic = "force-dynamic";

// GET /api/competitions/[id]/streak — the Endurance Cup board.
//
// Returns the caller's streak (days survived), the days left in the cup's
// window, whether today is still open, the kind "streak lost on <date>" when
// a day was missed (frozen, never reset), and the survival leaderboard.
// The streak is the member's own daily check-ins — the honest rule is one
// per UTC calendar day, and the member's score is the days survived.

const CLOSED_COPY: Record<string, string> = {
  window_closed: "The cup window is closed — check in while the clock runs.",
  already_checked_in: "You've already checked in today — your streak is safe.",
};

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

  if (competition.format !== "endurance") {
    return NextResponse.json({ error: "This endpoint serves Endurance Cups only" }, { status: 400 });
  }

  const members = await prisma.competitionMember.findMany({
    where: { competitionId: competition.id },
    include: { user: { select: { name: true } } },
    orderBy: [{ joinedAt: "asc" }, { userId: "asc" }],
  });

  const view = await enduranceView(prisma, competition, members, user.id);
  return NextResponse.json(view satisfies EnduranceView);
}

// POST /api/competitions/[id]/streak — "I practised today."
//
// One check-in per UTC calendar day per member. The write raises the member's
// CompetitionMember.score by one (days survived — the ladder value) and stamps
// the namespaced ledger row, which is what makes the second call of the day a
// no-op (409) and what lets the cup show the day a streak froze. 7/14/30-day
// check-ins notify "milestone" with the badge-style label ("7-day durability"
// …). Missing a day never resets the score.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const competition = await prisma.competition.findUnique({ where: { id: params.id } });
  if (!competition) return NextResponse.json({ error: "Competition not found" }, { status: 404 });

  const member = await prisma.competitionMember.findUnique({
    where: { competitionId_userId: { competitionId: competition.id, userId: user.id } },
    include: { user: { select: { name: true } } },
  });
  if (!member) return NextResponse.json({ error: "Competition not found" }, { status: 404 });

  if (competition.format !== "endurance") {
    return NextResponse.json({ error: "This endpoint serves Endurance Cups only" }, { status: 400 });
  }
  if (competition.status === "cancelled" || competition.status === "finished") {
    return NextResponse.json({ error: "This cup is no longer live" }, { status: 400 });
  }

  const result = await enduranceCheckIn(prisma, competition, member);
  if (!result.ok) {
    return NextResponse.json(
      { error: CLOSED_COPY[result.reason], reason: result.reason, streak: result.streak },
      { status: result.reason === "already_checked_in" ? 409 : 400 },
    );
  }

  return NextResponse.json(
    { checkedIn: true, streak: result.streak, milestone: result.milestone },
    { status: 201 },
  );
}
