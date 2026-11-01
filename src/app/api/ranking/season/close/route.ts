import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createNotification } from "@/lib/notify";
import {
  MAX_TIER,
  MIN_TIER,
  displayHandle,
  nextSeasonSlug,
  promotionPlan,
  seasonDates,
  starsForTier,
  tierFor,
  tierInfo,
} from "@/lib/ranking";
import { findOrCreateGroup } from "@/lib/ranking-pool";

export const dynamic = "force-dynamic";

// POST /api/ranking/season/close?secret=<REVALIDATE_SECRET>[&season=<slug>]
//
// Close a season of the global ladder: rank each tier's groups by average
// member stars, engrave the top three per tier in the Hall of Fame, pay the
// winners (a season-winner badge and 30 Prime days), then run promotion and
// relegation and open the next season's groups.
//
// Owner tool, guarded by the same server secret as the launch-token mint
// route — the secret only ever lives in the environment, never in the repo.
//
// ── Idempotency ─────────────────────────────────────────────────────────────
// The Hall of Fame is the guard: a tier that already has HallOfFameEntry rows
// for this season is left exactly as it is, so a re-run never re-engraves,
// never re-pays and never double-extends a subscription. The remaining steps
// are idempotent by construction — setting a member's stars to a MAX against
// a tier floor, upserting the next season row, find-or-creating its groups.
//
// `reason` on every StarLedger row this route writes is stable, so the ledger
// reconciles exactly like the pods' (`pod:<matchId>:<userId>`); the season
// awards use "season-winner:<seasonSlug>:<tier>".

const PRIME_DAYS = 30;
const DAY_MS = 86_400_000;
const HALL_SIZE = 3;

async function authorized(req: NextRequest): Promise<boolean> {
  const secret = req.nextUrl.searchParams.get("secret");
  return Boolean(secret && process.env.REVALIDATE_SECRET && secret === process.env.REVALIDATE_SECRET);
}

interface TierSummary {
  tier: number;
  groups: number;
  engraving: { rank: number; groupName: string; avgStars: number; roster: string[] }[];
  rewards: { userId: string; handle: string; badge: string; primeDays: number }[];
  promotions: { groupName: string; toTier: number; members: number }[];
  relegations: { groupName: string; toTier: number }[];
  skippedAsAlreadyEngraved: boolean;
}

export async function POST(req: NextRequest) {
  if (!(await authorized(req))) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const requested = req.nextUrl.searchParams.get("season");
  const season = requested
    ? await prisma.season.findUnique({ where: { slug: requested } })
    : await prisma.season.findFirst({ where: { status: "active" }, orderBy: { startsAt: "desc" } });
  if (!season) return NextResponse.json({ error: "Season not found" }, { status: 404 });

  const groups = await prisma.leagueGroup.findMany({
    where: { seasonSlug: season.slug },
    include: { members: { select: { userId: true } } },
    orderBy: [{ tier: "asc" }, { createdAt: "asc" }],
  });

  // Average member stars per group — the season's ranking key, one query.
  const memberIds = Array.from(new Set(groups.flatMap((g) => g.members.map((m) => m.userId))));
  const states = await prisma.rankState.findMany({
    where: { userId: { in: memberIds } },
    select: { userId: true, stars: true },
  });
  const starsOf = new Map(states.map((s) => [s.userId, s.stars]));

  const avgOf = (group: (typeof groups)[number]) =>
    group.members.length > 0
      ? group.members.reduce((sum, m) => sum + (starsOf.get(m.userId) ?? 0), 0) / group.members.length
      : 0;

  const handles = await prisma.user.findMany({
    where: { id: { in: memberIds } },
    select: { id: true, name: true },
  });
  const nameOf = new Map(handles.map((u) => [u.id, u.name]));

  const tiersWithGroups = Array.from(new Set(groups.map((g) => g.tier))).sort((a, b) => a - b);
  const summaries: TierSummary[] = [];
  let badges = 0;
  let primeExtensions = 0;

  for (const tier of tiersWithGroups) {
    const tierGroups = groups.filter((g) => g.tier === tier).sort((a, b) => avgOf(b) - avgOf(a));
    const summary: TierSummary = {
      tier,
      groups: tierGroups.length,
      engraving: [],
      rewards: [],
      promotions: [],
      relegations: [],
      skippedAsAlreadyEngraved: false,
    };
    summaries.push(summary);

    const already = await prisma.hallOfFameEntry.findMany({ where: { seasonSlug: season.slug, tier } });
    if (already.length > 0) {
      // Engraved (and therefore paid) by an earlier run of this route.
      summary.skippedAsAlreadyEngraved = true;
      continue;
    }

    const winners = tierGroups.slice(0, HALL_SIZE);
    for (let i = 0; i < winners.length; i += 1) {
      const group = winners[i];
      const rank = i + 1;
      const roster = group.members.map((m) => displayHandle(nameOf.get(m.userId) ?? null));
      const avgStars = avgOf(group);

      await prisma.hallOfFameEntry.create({
        data: { seasonSlug: season.slug, tier, rank, groupName: group.name, rosterJson: roster, avgStars },
      });
      summary.engraving.push({ rank, groupName: group.name, avgStars, roster });

      for (const member of group.members) {
        const badgeKey = `season-winner-${tier}`;
        await prisma.leagueBadge.upsert({
          where: { userId_key: { userId: member.userId, key: badgeKey } },
          create: {
            userId: member.userId,
            key: badgeKey,
            label: `${tierInfo(tier).label} — ${season.name} champion`,
          },
          update: {},
        });
        badges += 1;
        primeExtensions += await grantPrimeDays(member.userId);
        summary.rewards.push({
          userId: member.userId,
          handle: displayHandle(nameOf.get(member.userId) ?? null),
          badge: badgeKey,
          primeDays: PRIME_DAYS,
        });
      }
    }
  }

  // Promotion / relegation across the whole season, then the star floor for
  // every member of a promoted group.
  const plan = promotionPlan(
    groups.map((g) => ({ tier: g.tier, groupId: g.id, groupName: g.name, avgStars: avgOf(g) })),
  );
  for (const move of plan) {
    const summary = summaries.find((s) => s.tier === move.fromTier);
    const group = groups.find((g) => g.id === move.groupId);
    if (!summary || !group) continue;

    if (move.direction === "promote") {
      summary.promotions.push({ groupName: move.groupName, toTier: move.toTier, members: group.members.length });
      // The next tier's floor — a promoted member can only go up.
      for (const member of group.members) {
        const floor = starsForTier(move.toTier);
        const now = Math.max(starsOf.get(member.userId) ?? 0, floor);
        starsOf.set(member.userId, now);
        await prisma.rankState.update({
          where: { userId: member.userId },
          data: { stars: now, tier: tierFor(now) },
        });
      }
    } else {
      summary.relegations.push({ groupName: move.groupName, toTier: move.toTier });
    }
  }

  const now = new Date();
  const closedMatches = await prisma.podMatch.updateMany({
    where: { seasonSlug: season.slug, state: "open" },
    data: { state: "closed" },
  });

  await prisma.season.update({ where: { slug: season.slug }, data: { status: "closed" } });

  // Next season, and its groups — one per tier, ready for the first queue
  // call of the new season. Members are placed there by the queue itself
  // (auto-assignment by tier), which is where promotion now puts them.
  const nextSlug = nextSeasonSlug(season.slug);
  const next = await prisma.season.upsert({
    where: { slug: nextSlug },
    create: { ...seasonDates(nextSlug), status: "active" },
    update: {},
  });
  const nextGroups: string[] = [];
  for (let tier = MIN_TIER; tier <= MAX_TIER; tier += 1) {
    const group = await findOrCreateGroup(next.slug, tier);
    nextGroups.push(group.name);
  }

  const winners = summaries.flatMap((s) => s.rewards.map((r) => r.userId));
  await Promise.allSettled(
    winners.map((userId) =>
      createNotification(userId, {
        type: "season_result",
        title: `${season.name} is closed`,
        body: `You finished in the Hall of Fame — your badge and ${PRIME_DAYS} Prime days are waiting.`,
        href: "/league/hall-of-fame",
      }),
    ),
  );

  return NextResponse.json({
    season: { slug: season.slug, name: season.name, status: "closed" },
    tiers: summaries,
    promotions: plan.filter((m) => m.direction === "promote").length,
    relegations: plan.filter((m) => m.direction === "relegate").length,
    podsClosed: closedMatches.count,
    rewards: { badges, primeDaysGranted: primeExtensions, holders: winners.length },
    nextSeason: { slug: next.slug, name: next.name, startsAt: next.startsAt.toISOString(), groups: nextGroups },
    closedAt: now.toISOString(),
  });
}

/**
 * Extend the member's live Prime subscription by 30 days, or start one when
 * they hold none: tier "premium", status "active", billing period "monthly",
 * expiring 30 days out. An expired subscription is re-based on today rather
 * than carrying dead credit forward.
 */
async function grantPrimeDays(userId: string): Promise<number> {
  const subscription = await prisma.subscription.findFirst({
    where: { userId, tier: "premium", status: "active" },
    orderBy: { updatedAt: "desc" },
  });

  const base = subscription?.expiresAt && subscription.expiresAt.getTime() > Date.now() ? subscription.expiresAt : new Date();
  const expiresAt = new Date(base.getTime() + PRIME_DAYS * DAY_MS);

  if (subscription) {
    await prisma.subscription.update({ where: { id: subscription.id }, data: { expiresAt } });
    return 1;
  }

  await prisma.subscription.create({
    data: {
      userId,
      tier: "premium",
      status: "active",
      billingPeriod: "monthly",
      expiresAt,
      domainAccess: ["highschool", "university"],
      provider: "ranking-season",
    },
  });
  return 1;
}
