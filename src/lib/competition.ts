import prisma from "@/lib/db";
import { hasPremiumAccess } from "@/lib/entitlements";

/**
 * Merit League — shared contract.
 *
 * Replaces Global Arena (route /league, redirect from /arena). Four cup
 * formats run solo or as group competitions; creation is gated on Prime
 * tenure + demonstrated performance (ROADMAP.md §3). Scores are ALWAYS
 * reconciled server-side — no client-trusted value ever enters a leaderboard.
 */

export const COMPETITION_FORMATS = ["speed", "endurance", "mastery", "bracket"] as const;
export type CompetitionFormat = (typeof COMPETITION_FORMATS)[number];

export const FORMAT_META: Record<CompetitionFormat, CompetitionFormatMeta> = {
  speed: {
    label: "Speed Cup",
    blurb: "Most correct answers inside the clock — accuracy under pressure.",
    duration: "30–120 minutes",
  },
  endurance: {
    label: "Endurance Cup",
    blurb: "Daily practice durability across 7, 14 or 30 consecutive days.",
    duration: "7–30 days",
  },
  mastery: {
    label: "Mastery Cup",
    blurb: "First to reach the subject mastery target wins.",
    duration: "7–21 days",
  },
  bracket: {
    label: "Cohort Bracket",
    blurb: "4, 8 or 16 teams, elimination rounds, finals week.",
    duration: "3–14 days",
  },
};

export interface CompetitionFormatMeta {
  label: string;
  blurb: string;
  duration: string;
}

/** Owner season calendar (ROADMAP.md locked decision 4). */
export const SEASONS = [
  { slug: "s1", label: "Season 1", window: "January–April" },
  { slug: "s2", label: "Season 2", window: "May–August" },
  { slug: "s3", label: "Season 3", window: "September–December" },
] as const;

export const CURRENT_SEASON = "s3"; // Dec 2026 — soft-launch season (ROADMAP.md)

export interface LeagueEligibility {
  eligible: boolean;
  reasons: string[];
  tenureMonths: number;
  mastery: number;
  accuracy: number;
}

/**
 * Create-cup eligibility: Prime for >= 4 consecutive months AND subject
 * mastery >= 60% AND demonstrated accuracy >= 85% AND no upheld content
 * reports in the last 90 days. All four conditions are checked server-side
 * at creation time — a client flag is never trusted.
 */
export async function evaluateLeagueEligibility(userId: string): Promise<LeagueEligibility> {
  const reasons: string[] = [];

  const premium = await hasPremiumAccess(userId, "highschool");
  const firstPremium = premium
    ? await prisma.subscription.findFirst({
        where: { userId, tier: "premium", status: "active" },
        orderBy: { createdAt: "asc" },
        select: { createdAt: true },
      })
    : null;
  const tenureMonths = firstPremium
    ? (Date.now() - new Date(firstPremium.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30.44)
    : 0;
  if (!premium) reasons.push("An active Prime subscription is required.");
  else if (tenureMonths < 4) reasons.push(`Prime tenure ${tenureMonths.toFixed(1)} months — 4 required.`);

  const masteryRows = await prisma.conceptMastery.findMany({
    where: { userId, masteryScore: { not: null } },
    select: { masteryScore: true },
    take: 200,
  });
  const mastery =
    masteryRows.length > 0
      ? masteryRows.reduce((a, r) => a + (r.masteryScore ?? 0), 0) / masteryRows.length
      : 0;
  if (mastery < 0.6) reasons.push(`Subject mastery ${Math.round(mastery * 100)}% — 60% required.`);

  const sessions = await prisma.assessmentSession.findMany({
    where: { userId, maxScore: { gt: 0 } },
    select: { score: true, maxScore: true },
    take: 200,
    orderBy: { createdAt: "desc" },
  });
  const accuracy =
    sessions.length > 0
      ? sessions.reduce((a, s) => a + s.score / Math.max(s.maxScore, 1), 0) / sessions.length
      : 0;
  if (sessions.length < 3) reasons.push("At least 3 completed assessments are required.");
  else if (accuracy < 0.85) reasons.push(`Assessment accuracy ${Math.round(accuracy * 100)}% — 85% required.`);

  const upheld = await prisma.contentReport.count({
    where: { reporterId: userId, status: "fixed", createdAt: { gte: new Date(Date.now() - 90 * 864e5) } },
  });
  if (upheld > 0) reasons.push("An upheld content report in the last 90 days blocks hosting.");

  return { eligible: reasons.length === 0, reasons, tenureMonths, mastery, accuracy };
}

/** Stable invite code for private competitions — unguessable, shareable. */
export function makeInviteCode(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 8; i += 1) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}
