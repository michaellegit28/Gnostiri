import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { createNotification } from "@/lib/notify";
import { buildChampionshipPaper, podAwardKey, podStars, rankPodMembers, tierFor, tierInfo } from "@/lib/ranking";
import { championshipPool, resolveChampionshipKey } from "@/lib/ranking-pool";

export const dynamic = "force-dynamic";

// POST /api/ranking/pods/[matchId]/submit — grade a member's pod paper.
//
// The paper is RE-DERIVED from the member's own seat seed, exactly as the
// session served it, so the questions a member answers and the questions the
// marker grades are the same list. Grading reads the answer key here, after
// the clock has started (+1 correct / 0 wrong, no negative marking — a pod is
// a race against the field, not a trap).
//
// ── Idempotency, and why the ledger cannot double-pay ───────────────────────
// The award for a member in a pod is written under the idempotency key
// `${matchId}:${userId}` — the StarLedger `reason` for every adjustment row
// that pod writes. The sum of the deltas carrying that key IS the member's
// award for that pod, so a recomputation is a difference, not a duplicate:
//
//     delta = podStars(placement) - sum(previous deltas for this key)
//
// A row is written only when that difference is non-zero. Because placements
// are recomputed from the current scores on every submit, a late submit (or a
// re-run) settles the pod correctly: members who were provisionally paid as
// leaders are corrected, members who never submitted receive their
// participation star, and a submit that changes nothing writes nothing.
//
// A submit is accepted while the pod is open — including after the window has
// closed — so the "compute after all members submitted OR the window closed"
// case is reachable: the first submit after the window settles everyone.
// The /session route is the one that refuses a closed window.

interface SubmittedAnswer {
  questionId: unknown;
  selected: unknown;
}

/** Grading comparison — the same convention as the cups and course quizzes. */
function normalise(value: string): string {
  return value.trim().toLowerCase();
}

export async function POST(req: NextRequest, { params }: { params: { matchId: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const seat = await prisma.podMember.findUnique({
    where: { matchId_userId: { matchId: params.matchId, userId: user.id } },
    include: { match: { select: { id: true, state: true, tier: true, windowClosesAt: true } } },
  });
  if (!seat) return NextResponse.json({ error: "Pod not found" }, { status: 404 });

  if (seat.match.state !== "open") {
    return NextResponse.json({ error: "This pod has settled" }, { status: 400 });
  }

  const body = (await req.json().catch(() => null)) as { answers?: SubmittedAnswer[] } | null;
  const answers = body?.answers;
  if (!Array.isArray(answers) || answers.length === 0) {
    return NextResponse.json({ error: "Answers required" }, { status: 400 });
  }

  const pool = await championshipPool(seat.match.tier);
  const paper = buildChampionshipPaper({ tier: seat.match.tier, seed: seat.seed, pool });
  if (paper.questions.length === 0) {
    return NextResponse.json({ error: "No questions are available for this tier" }, { status: 503 });
  }
  const served = new Map(paper.questions.map((q) => [q.id, q]));

  // Submit-side validation: only ids from THIS member's derived paper, each
  // once, and only a served option as the selection. A selection outside the
  // served options is a tampered client, not a wrong answer.
  const submitted = new Map<string, string>();
  for (const entry of answers) {
    const questionId = typeof entry?.questionId === "string" ? entry.questionId : null;
    const selected = typeof entry?.selected === "string" ? entry.selected : null;
    if (!questionId || selected === null) {
      return NextResponse.json({ error: "Each answer needs a questionId and a selected option" }, { status: 400 });
    }
    const question = served.get(questionId);
    if (!question) {
      return NextResponse.json({ error: "Answer submitted for a question that is not in your paper" }, { status: 400 });
    }
    if (!question.options.includes(selected)) {
      return NextResponse.json({ error: "Choose one of the listed options" }, { status: 400 });
    }
    if (submitted.has(questionId)) {
      return NextResponse.json({ error: "One answer per question" }, { status: 400 });
    }
    submitted.set(questionId, selected);
  }

  // The answer key, read only now the paper exists. Unanswered questions are
  // simply wrong — the clock running out is not an error.
  const key = await resolveChampionshipKey(paper.questions.map((q) => q.id));
  const score = paper.questions.filter((q) => {
    const selected = submitted.get(q.id);
    return selected !== undefined && normalise(selected) === normalise(key.get(q.id) ?? "");
  }).length;

  // Best-of keeps the higher score, so a re-submit can only help a member.
  const submittedAt = new Date();
  if (score > seat.score || seat.submittedAt === null) {
    await prisma.podMember.update({
      where: { id: seat.id },
      data: { score: Math.max(seat.score, score), submittedAt },
    });
  }

  // ── ONE settlement pass over every seat in the pod ────────────────────────
  const allSeats = await prisma.podMember.findMany({
    where: { matchId: params.matchId },
    select: { userId: true, score: true, submittedAt: true },
  });
  const standings = rankPodMembers(allSeats);
  const placementOf = new Map(standings.map((s) => [s.userId, s.placement]));

  const awards = new Map<string, number>();
  for (const standing of standings) awards.set(standing.userId, podStars(standing.placement));

  const userIds = allSeats.map((s) => s.userId);
  const states = await prisma.rankState.findMany({ where: { userId: { in: userIds } } });
  const stateOf = new Map(states.map((s) => [s.userId, s]));
  const missing = userIds.filter((id) => !stateOf.has(id));
  if (missing.length > 0) {
    await prisma.rankState.createMany({ data: missing.map((userId) => ({ userId, stars: 0, tier: 1 })) });
    for (const userId of missing) stateOf.set(userId, { userId, stars: 0, tier: 1, podReadyAt: null, groupId: null, updatedAt: new Date() });
  }

  // Previously awarded stars for this pod, per member — the idempotency side
  // of the ledger: everything carrying that key was written by this pod.
  const ledger = await prisma.starLedger.findMany({
    where: { userId: { in: userIds }, reason: { in: userIds.map((id) => podAwardKey(params.matchId, id)) } },
    select: { userId: true, delta: true },
  });
  const paidOf = new Map<string, number>();
  for (const row of ledger) paidOf.set(row.userId, (paidOf.get(row.userId) ?? 0) + row.delta);

  const tierUps: { userId: string; to: number }[] = [];
  for (const [userId, award] of Array.from(awards.entries())) {
    const state = stateOf.get(userId);
    if (!state) continue;
    const delta = award - (paidOf.get(userId) ?? 0);
    if (delta === 0) continue; // this placement is already paid: nothing to write

    const balanceAfter = state.stars + delta;
    await prisma.starLedger.create({
      data: { userId, delta, reason: podAwardKey(params.matchId, userId), balanceAfter },
    });

    const newTier = tierFor(balanceAfter);
    if (newTier > state.tier) tierUps.push({ userId, to: newTier });

    stateOf.set(userId, { ...state, stars: balanceAfter, tier: newTier });
    await prisma.rankState.update({ where: { userId }, data: { stars: balanceAfter, tier: newTier } });
  }

  const notifications = tierUps.map((up) =>
    createNotification(up.userId, {
      type: "milestone",
      title: `You reached ${tierInfo(up.to).label}`,
      body: `Your star tally carried you up to ${tierInfo(up.to).label} on the Global Ranking ladder.`,
      href: "/league/ladder",
    }),
  );
  // A notification is a side effect: it must never fail a member's submit.
  await Promise.allSettled(notifications);

  const myState = stateOf.get(user.id)!;
  return NextResponse.json({
    score: Math.max(seat.score, score),
    placement: placementOf.get(user.id) ?? standings.length,
    starsAwarded: awards.get(user.id) ?? 0,
    starsDelta: (awards.get(user.id) ?? 0) - (paidOf.get(user.id) ?? 0),
    totalStars: myState.stars,
    tier: myState.tier,
    tierLabel: tierInfo(myState.tier).label,
    tierUp: tierUps.some((up) => up.userId === user.id),
  });
}
