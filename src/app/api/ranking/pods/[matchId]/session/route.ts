import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { POD_WINDOW_SECONDS, buildChampionshipPaper, type ChampionshipPaper } from "@/lib/ranking";
import { championshipPool } from "@/lib/ranking-pool";

export const dynamic = "force-dynamic";

// GET /api/ranking/pods/[matchId]/session — the member's pod paper.
//
// The paper is DERIVED, never stored: buildChampionshipPaper re-computes it
// from (tier, the member's own PodMember.seed) on every request, so the paper
// this serves and the grade /submit derives cannot drift apart — and there is
// no answer key at rest to leak.
//
// The response carries the tier pool's safe fields only: id, questionText,
// options, difficulty. correctAnswer is read server-side inside /submit, AFTER
// the clock has started.
//
// The clock is SERVER-ANCHORED to the window the pod opened, not to this
// request: startedAt is the window's opening instant, so a member joining
// mid-window sees the remaining time and a tampered browser clock cannot buy
// more. A member outside the pod gets 404 exactly like a missing pod — a
// live pod's roster is never confirmed to a stranger.

export async function GET(_req: NextRequest, { params }: { params: { matchId: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const seat = await prisma.podMember.findUnique({
    where: { matchId_userId: { matchId: params.matchId, userId: user.id } },
    include: { match: { include: { group: { select: { name: true } } } } },
  });
  if (!seat) return NextResponse.json({ error: "Pod not found" }, { status: 404 });

  const match = seat.match;
  const nowMs = Date.now();
  if (nowMs >= match.windowClosesAt.getTime()) {
    return NextResponse.json({ error: "This pod's window has closed" }, { status: 400 });
  }
  if (match.state !== "open") {
    return NextResponse.json({ error: "This pod has settled" }, { status: 400 });
  }

  const pool = await championshipPool(match.tier);
  const paper: ChampionshipPaper = buildChampionshipPaper({ tier: match.tier, seed: seat.seed, pool });
  if (paper.questions.length === 0) {
    return NextResponse.json({ error: "The championship pool for this tier is unavailable" }, { status: 503 });
  }

  return NextResponse.json({
    matchId: match.id,
    groupName: match.group.name,
    tier: match.tier,
    startedAt: match.windowOpensAt.toISOString(),
    windowClosesAt: match.windowClosesAt.toISOString(),
    windowSeconds: POD_WINDOW_SECONDS,
    remainingSeconds: Math.max(0, Math.floor((match.windowClosesAt.getTime() - nowMs) / 1000)),
    submitted: seat.submittedAt !== null,
    questions: paper.questions,
  });
}
