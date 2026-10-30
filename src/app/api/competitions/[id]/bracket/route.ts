import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { bracketView, type BracketView } from "@/lib/competition-additions";

export const dynamic = "force-dynamic";

// GET /api/competitions/[id]/bracket — the Cohort Bracket tree.
//
// Returns the seeded round-one pairings (the shuffle is a pure function of
// the cup id + the stably-ordered roster, so every player sees the same
// tree), the caller's current match, and — while their match is live — their
// five quickfire questions with NO answer key: the paper is re-derived from
// (cup, round, matchIndex) exactly like the Speed Cup's, and both racers of a
// pairing are dealt the same five.
//
// KNOWN LIMITATION (documented, not hacked): the bracket plays round one and
// derives each pairing's winner from both racers' STORED round scores. Later
// rounds are returned as projected labels only — a full persistent tree (and
// a crowned champion) needs a BracketMatch table, which is a schema change
// and therefore next iteration's work.
//
// A non-member gets 404 exactly like a missing cup, so a private cup's
// existence is never confirmed to a stranger.
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const competition = await prisma.competition.findUnique({ where: { id: params.id } });
  if (!competition) return NextResponse.json({ error: "Competition not found" }, { status: 404 });

  const member = await prisma.competitionMember.findUnique({
    where: { competitionId_userId: { competitionId: competition.id, userId: user.id } },
  });
  if (!member) return NextResponse.json({ error: "Competition not found" }, { status: 404 });

  if (competition.format !== "bracket") {
    return NextResponse.json({ error: "This endpoint serves Cohort Brackets only" }, { status: 400 });
  }
  if (competition.status === "cancelled" || competition.status === "finished") {
    return NextResponse.json({ error: "This cup is no longer live" }, { status: 400 });
  }

  const members = await prisma.competitionMember.findMany({
    where: { competitionId: competition.id },
    include: { user: { select: { name: true } } },
    orderBy: [{ joinedAt: "asc" }, { userId: "asc" }],
  });

  const view = await bracketView(prisma, competition, members, user.id);
  return NextResponse.json(view satisfies BracketView);
}
