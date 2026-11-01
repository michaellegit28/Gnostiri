import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import {
  MAX_TIER,
  POD_WINDOW_SECONDS,
  TIERS,
  displayHandle,
  starsForTier,
  starsToNextTier,
  tierFor,
  tierInfo,
} from "@/lib/ranking";
import { activeSeason, groupLeaderboard } from "@/lib/ranking-pool";

export const dynamic = "force-dynamic";

// GET /api/ranking/state — the member's standing on the Global Ranking ladder.
//
// One surface for everything the ladder UI needs: the member's stars and tier
// (with the progress to the next tier), their group and position in it, the
// group leaderboard with pod scores aggregated per member, and every pod they
// currently hold a seat in with the live window.
//
// This is also the endpoint the play surface polls every 15s while a window is
// open — it is the "live scoreboard" of an async-simultaneous pod, without a
// websocket in sight. Handles are display names only.

export async function GET(_req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const rankState =
    (await prisma.rankState.findUnique({ where: { userId: user.id } })) ??
    (await prisma.rankState.create({ data: { userId: user.id, stars: 0, tier: 1 } }));

  const stars = rankState.stars;
  const tier = tierFor(stars);
  const info = tierInfo(tier);
  const nextTier = tier < MAX_TIER ? tierInfo(tier + 1) : null;
  const floorOfTier = starsForTier(tier);
  const ceiling = nextTier ? nextTier.threshold - floorOfTier : 1;
  const progress = nextTier
    ? Math.max(0, Math.min(1, (stars - floorOfTier) / Math.max(1, ceiling)))
    : 1;

  // The member's seat in the season group assigned by the queue — scoped to
  // the running season, so a group from a closed season never resurfaces.
  const season = await activeSeason();
  const membership = await prisma.leagueGroupMember.findFirst({
    where: { userId: user.id, group: { seasonSlug: season.slug } },
    orderBy: { joinedAt: "desc" },
    include: { group: { select: { id: true, name: true, tier: true, capacity: true, seasonSlug: true } } },
  });

  let group: {
    groupId: string;
    groupName: string;
    tier: number;
    capacity: number;
    seasonSlug: string;
    position: number;
    size: number;
    leaderboard: {
      position: number;
      userId: string;
      handle: string;
      stars: number;
      podScore: number;
      isCaller: boolean;
    }[];
  } | null = null;

  if (membership) {
    const rows = await groupLeaderboard(membership.group.id);
    const handles = await prisma.user.findMany({
      where: { id: { in: rows.map((r) => r.userId) } },
      select: { id: true, name: true },
    });
    const nameOf = new Map(handles.map((u) => [u.id, u.name]));
    group = {
      groupId: membership.group.id,
      groupName: membership.group.name,
      tier: membership.group.tier,
      capacity: membership.group.capacity,
      seasonSlug: membership.group.seasonSlug,
      position: rows.find((r) => r.userId === user.id)?.position ?? rows.length,
      size: rows.length,
      leaderboard: rows.map((r) => ({
        position: r.position,
        userId: r.userId,
        handle: displayHandle(nameOf.get(r.userId) ?? null),
        stars: r.stars,
        podScore: r.podScore,
        isCaller: r.userId === user.id,
      })),
    };
  }

  // Open pods: windows that are still live, newest first.
  const seats = await prisma.podMember.findMany({
    where: { userId: user.id, match: { state: "open" } },
    include: {
      match: { select: { id: true, groupId: true, tier: true, round: true, windowClosesAt: true, windowOpensAt: true } },
    },
    orderBy: { matchId: "desc" },
  });
  const openPods = seats
    .filter((seat) => seat.match.windowClosesAt.getTime() > Date.now())
    .map((seat) => ({
      matchId: seat.match.id,
      groupId: seat.match.groupId,
      groupName: group?.groupId === seat.match.groupId ? group.groupName : null,
      tier: seat.match.tier,
      round: seat.match.round,
      windowOpensAt: seat.match.windowOpensAt.toISOString(),
      windowClosesAt: seat.match.windowClosesAt.toISOString(),
      windowSeconds: POD_WINDOW_SECONDS,
      remainingSeconds: Math.max(0, Math.floor((seat.match.windowClosesAt.getTime() - Date.now()) / 1000)),
      submitted: seat.submittedAt !== null,
      score: seat.score,
    }));

  return NextResponse.json({
    season: { slug: season.slug, name: season.name, status: season.status },
    stars,
    tier,
    tierLabel: info.label,
    tierThreshold: info.threshold,
    nextTier: nextTier ? { tier: nextTier.tier, label: nextTier.label, threshold: nextTier.threshold } : null,
    starsToNextTier: starsToNextTier(stars),
    progress,
    ladder: TIERS.map((t) => ({ tier: t.tier, label: t.label, threshold: t.threshold, isCurrent: t.tier === tier })),
    group,
    openPods,
    ready: rankState.podReadyAt !== null,
  });
}
