import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { POD_WINDOW_SECONDS, tierFor, tierInfo } from "@/lib/ranking";
import { activeSeason, findOrCreateGroup, groupLeaderboard } from "@/lib/ranking-pool";

export const dynamic = "force-dynamic";

// POST /api/ranking/queue — join global matchmaking.
//
// Get-or-create the member's RankState (0 stars on a first visit), take their
// tier from those stars, then find-or-create a LeagueGroup for (season, tier)
// with room — groups hold 20 of a tier, so a filling tier simply opens the
// next group. The member is marked READY for pod matchmaking on the way in:
// pods form inside a group as members become ready, so readiness is the
// default state of a newly queued member.
//
// A member holds at most ONE group per season, at their current tier: when
// stars have carried them up a tier, the queue call moves them rather than
// leaving them straddling two tiers' groups.

export async function POST(_req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const season = await activeSeason();

  // First visit: 0 stars, tier 1, no group. Never trusting a client-supplied
  // — stars only ever change on the server (see /pods/[matchId]/submit).
  const rankState =
    (await prisma.rankState.findUnique({ where: { userId: user.id } })) ??
    (await prisma.rankState.create({ data: { userId: user.id, stars: 0, tier: 1 } }));

  const stars = rankState.stars;
  const tier = tierFor(stars);

  const membership = await prisma.leagueGroupMember.findFirst({
    where: { userId: user.id, group: { seasonSlug: season.slug, tier } },
    include: { group: true },
  });

  const group = membership?.group ?? (await findOrCreateGroup(season.slug, tier));

  if (membership?.groupId !== group.id) {
    if (membership) {
      // Tier changed since the last queue call: leave the old tier's group,
      // so one member maps to one group per season.
      await prisma.leagueGroupMember.deleteMany({
        where: { userId: user.id, group: { seasonSlug: season.slug } },
      });
    }
    await prisma.leagueGroupMember.create({ data: { groupId: group.id, userId: user.id } });
  }

  await prisma.rankState.update({
    where: { userId: user.id },
    data: { tier, groupId: group.id, podReadyAt: new Date() },
  });

  // Position in the group: the ladder order (stars desc, then join order) —
  // the exact ordering /api/ranking/state renders the leaderboard with.
  const [leaderboard, groupSize] = await Promise.all([
    groupLeaderboard(group.id),
    prisma.leagueGroupMember.count({ where: { groupId: group.id } }),
  ]);
  const positionInGroup = leaderboard.find((row) => row.userId === user.id)?.position ?? groupSize;

  return NextResponse.json(
    {
      seasonSlug: season.slug,
      stars,
      tier,
      tierLabel: tierInfo(tier).label,
      groupId: group.id,
      groupName: group.name,
      positionInGroup,
      groupSize,
      groupCapacity: group.capacity,
      windowSeconds: POD_WINDOW_SECONDS,
      ready: true,
    },
    { status: 201 },
  );
}
