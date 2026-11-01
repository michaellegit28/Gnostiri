import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import {
  POD_MAX_MEMBERS,
  POD_MIN_MEMBERS,
  POD_WINDOW_SECONDS,
  displayHandle,
  matchSeed,
  podMemberSeed,
  podWindow,
} from "@/lib/ranking";

export const dynamic = "force-dynamic";

// POST /api/ranking/pods/open — open an async-simultaneous pod.
//
// A pod is 2–4 members of the same group playing the SAME paper inside a
// shared 20-minute window, each at their own pace; the scoreboard fills as
// they submit. There is no websocket and no live session — the window plus
// polled state is the whole delivery mechanism.
//
// A caller who already holds an open window gets that window back (opening is
// idempotent, so a double click cannot spawn a second pod). Readiness is
// consumed by the draw: selected members are un-readied so they cannot be
// pooled into two pods at once, and re-queue when they want the next one.
//
// Seats are filled deterministically (join order) — no randomness — and the
// caller always has a seat, because they initiated the draw.

export async function POST(_req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const rankState = await prisma.rankState.findUnique({ where: { userId: user.id } });
  if (!rankState?.groupId) {
    return NextResponse.json({ error: "Join the queue before opening a pod" }, { status: 409 });
  }
  const groupId = rankState.groupId;

  // Already in a live window: hand it back rather than opening a second pod.
  const heldSeat = await prisma.podMember.findFirst({
    where: { userId: user.id, match: { groupId, state: "open" } },
    select: {
      matchId: true,
      match: { select: { tier: true, round: true, windowOpensAt: true, windowClosesAt: true } },
    },
  });
  if (heldSeat && heldSeat.match.windowClosesAt.getTime() > Date.now()) {
    const seats = await seatsOf(heldSeat.matchId, user.id);
    return NextResponse.json({
      matchId: heldSeat.matchId,
      members: seats,
      tier: heldSeat.match.tier,
      round: heldSeat.match.round,
      windowOpensAt: heldSeat.match.windowOpensAt.toISOString(),
      windowClosesAt: heldSeat.match.windowClosesAt.toISOString(),
      windowSeconds: POD_WINDOW_SECONDS,
      reopened: false,
    });
  }

  // Readiness is the pool we draw from. The caller counts as ready even if
  // their ready flag was cleared by an earlier pod — they are asking now.
  const members = await prisma.leagueGroupMember.findMany({
    where: { groupId },
    orderBy: { joinedAt: "asc" },
    select: { userId: true },
  });
  if (members.length < POD_MIN_MEMBERS) {
    return NextResponse.json(
      { error: `A pod needs ${POD_MIN_MEMBERS} members — this group has ${members.length}.`, readyCount: members.length },
      { status: 409 },
    );
  }

  const states = await prisma.rankState.findMany({
    where: { userId: { in: members.map((m) => m.userId) } },
    select: { userId: true, podReadyAt: true },
  });
  const ready = new Set(states.filter((s) => s.podReadyAt).map((s) => s.userId));
  ready.add(user.id);

  const ordered = members.map((m) => m.userId).filter((id) => ready.has(id));
  if (ordered.length < POD_MIN_MEMBERS) {
    return NextResponse.json(
      {
        error: `A pod needs ${POD_MIN_MEMBERS} ready members — ${ordered.length} are ready right now.`,
        readyCount: ordered.length,
      },
      { status: 409 },
    );
  }

  // Deterministic: join order, up to 4 seats, caller guaranteed a seat.
  let selected = ordered.slice(0, POD_MAX_MEMBERS);
  if (!selected.includes(user.id)) {
    selected = [user.id, ...ordered.filter((id) => id !== user.id)].slice(0, POD_MAX_MEMBERS);
  }

  const group = await prisma.leagueGroup.findUnique({ where: { id: groupId } });
  if (!group) return NextResponse.json({ error: "Group not found" }, { status: 404 });

  const window = podWindow(new Date());
  const matchId = crypto.randomUUID();

  await prisma.podMatch.create({
    data: {
      id: matchId,
      groupId,
      seasonSlug: group.seasonSlug,
      tier: group.tier,
      round: 1,
      windowOpensAt: window.opensAt,
      windowClosesAt: window.closesAt,
      state: "open",
      seed: matchSeed(groupId, group.tier, window.opensAt),
    },
  });

  await prisma.podMember.createMany({
    data: selected.map((userId) => ({
      matchId,
      userId,
      seed: podMemberSeed(matchId, userId),
      score: 0,
    })),
  });

  // Readiness is consumed: a seated member cannot be drawn into two pods.
  await prisma.rankState.updateMany({
    where: { userId: { in: selected } },
    data: { podReadyAt: null },
  });

  const seats = await seatsOf(matchId, user.id);
  return NextResponse.json(
    {
      matchId,
      members: seats,
      tier: group.tier,
      groupName: group.name,
      round: 1,
      windowOpensAt: window.opensAt.toISOString(),
      windowClosesAt: window.closesAt.toISOString(),
      windowSeconds: POD_WINDOW_SECONDS,
    },
    { status: 201 },
  );
}

/**
 * The pod's seats as handles.
 *
 * Order is re-derived from the group's join order — the same deterministic
 * order the seats were drawn in — so a pod that is re-opened (the member
 * already holds a live window) lists its members identically to the one that
 * was just created. Handles are display names only: no email, no user id.
 */
async function seatsOf(matchId: string, callerId: string): Promise<{ handle: string; isCaller: boolean }[]> {
  const seats = await prisma.podMember.findMany({ where: { matchId }, select: { userId: true } });
  const [joins, users] = await Promise.all([
    prisma.leagueGroupMember.findMany({
      where: { group: { matches: { some: { id: matchId } } } },
      orderBy: { joinedAt: "asc" },
      select: { userId: true },
    }),
    prisma.user.findMany({ where: { id: { in: seats.map((s) => s.userId) } }, select: { id: true, name: true } }),
  ]);

  const joinOrder = new Map(joins.map((m, i) => [m.userId, i]));
  const nameOf = new Map(users.map((u) => [u.id, u.name]));
  const ordered = [...seats].sort(
    (a, b) => (joinOrder.get(a.userId) ?? 0) - (joinOrder.get(b.userId) ?? 0) || (a.userId < b.userId ? -1 : 1),
  );
  return ordered.map((s) => ({ handle: displayHandle(nameOf.get(s.userId) ?? null), isCaller: s.userId === callerId }));
}
