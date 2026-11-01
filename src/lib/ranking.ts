/**
 * src/lib/ranking.ts — the Global Ranking engine (Phase 7).
 *
 * ONE currency (Stars), six cumulative tiers, season-scoped groups of 20 that
 * auto-assign by tier, async-simultaneous pods (2–4 members, one shared
 * 20-minute window, each plays at their own pace), and a Hall of Fame at
 * season close. This module is the PURE half of the engine: no I/O, no
 * Prisma, no clock reads unless passed in — every function is deterministic
 * given its arguments, so tests/ranking.test.mjs runs it with no database.
 *
 * The answer key NEVER lives here and is never returned by anything in this
 * file. buildChampionshipPaper takes a pool that carries only
 * {id, questionText, options, difficulty} and builds its response objects
 * field by field (never a spread), so a paper cannot leak a correct answer
 * even if a buggy pool entry carries one.
 *
 * The draw is the same seeded primitive the Speed Cup uses (FNV-1a →
 * mulberry32 → Fisher-Yates), so a member's paper is byte-identical on every
 * request, and the grade derived on /submit can never disagree with the paper
 * served on /session.
 */

// ── Tiers: one currency, six cumulative thresholds ──────────────────────────

export interface TierInfo {
  tier: number;
  label: string;
  threshold: number;
}

/** 1 Initiate → 6 Paragon. Thresholds are CUMULATIVE star totals. */
export const TIERS: readonly TierInfo[] = [
  { tier: 1, label: "Initiate", threshold: 0 },
  { tier: 2, label: "Scholar", threshold: 50 },
  { tier: 3, label: "Adept", threshold: 150 },
  { tier: 4, label: "Vanguard", threshold: 400 },
  { tier: 5, label: "Luminary", threshold: 900 },
  { tier: 6, label: "Paragon", threshold: 2000 },
];

export const MIN_TIER = 1;
export const MAX_TIER = TIERS.length;

/**
 * Tier info for a tier, clamped into the ladder: a request below Initiate
 * returns Initiate, above Paragon returns Paragon, so no caller can ever be
 * handed a tier with no threshold.
 */
export function tierInfo(tier: number): TierInfo {
  const found = TIERS.find((t) => t.tier === tier);
  if (found) return found;
  return tier < MIN_TIER ? TIERS[0] : TIERS[TIERS.length - 1];
}

/** The tier a star total belongs to — thresholds are cumulative. */
export function tierFor(stars: number): number {
  let tier = MIN_TIER;
  for (const t of TIERS) {
    if (stars >= t.threshold) tier = t.tier;
  }
  return tier;
}

/** The star total that admits a member to a tier (its cumulative floor). */
export function starsForTier(tier: number): number {
  return tierInfo(tier).threshold;
}

/** Stars still needed to reach the next tier; 0 at the top of the ladder. */
export function starsToNextTier(stars: number): number {
  const tier = tierFor(stars);
  if (tier >= MAX_TIER) return 0;
  return Math.max(0, starsForTier(tier + 1) - stars);
}

// ── The seeded draw (identical primitive to the Speed Cup paper) ────────────

/** FNV-1a: a tiny, deterministic string hash — the draw's seed. */
function hashId(value: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 — the seeded PRNG that drives every shuffle. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** In-place Fisher-Yates — unbiased, and reproducible for a given seed. */
function shuffle<T>(items: T[], rand: () => number): T[] {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

// ── The championship paper ──────────────────────────────────────────────────

/** A pool entry: safe by construction — there is no answer field to leak. */
export interface ChampionshipPoolEntry {
  id: string;
  questionText: string;
  options: string[];
  difficulty: string;
}

export interface PaperQuestion {
  id: string;
  questionText: string;
  options: string[];
  difficulty: string;
}

export interface ChampionshipPaper {
  tier: number;
  seed: number;
  questions: PaperQuestion[];
}

/** Questions in one pod paper. ~60 questions sit in a tier pool. */
export const PAPER_QUESTIONS = 15;

/**
 * The paper for one member of one pod: the tier's pool drawn and re-ordered by
 * the member's own seed, with each question's options shuffled under a
 * per-question seed derived from that same member seed.
 *
 * Same (tier, seed, pool) in → same paper out, always: the session the member
 * plays and the grade /submit derives are the same draw. Different members of
 * one pod therefore sit the same questions in a different order with shuffled
 * options — the paper is category-agnostic and personal at once.
 */
export function buildChampionshipPaper({
  tier,
  seed,
  pool,
}: {
  tier: number;
  seed: number;
  pool: readonly ChampionshipPoolEntry[];
}): ChampionshipPaper {
  const questions: PaperQuestion[] = [];
  if (pool.length === 0) return { tier, seed, questions };

  const rand = mulberry32(Number.isFinite(seed) ? seed : 0);
  const drawn = shuffle(pool.slice(), rand).slice(0, Math.min(PAPER_QUESTIONS, pool.length));

  for (const entry of drawn) {
    const options = shuffle(
      (Array.isArray(entry.options) ? entry.options : []).slice(),
      mulberry32(hashId(`options:${seed}:${entry.id}`)),
    );
    // Field-by-field construction: the pool's answer fields (if any bug ever
    // put them there) cannot ride along into a served paper.
    questions.push({
      id: entry.id,
      questionText: entry.questionText,
      options,
      difficulty: entry.difficulty,
    });
  }

  return { tier, seed, questions };
}

/** Is this payload free of any answer key? The no-leak guard, in one call. */
export function paperHasNoAnswers(paper: ChampionshipPaper): boolean {
  return paper.questions.every((q) => !("correctAnswer" in q) && !("explanation" in q));
}

// ── Pods: the 20-minute async window ────────────────────────────────────────

export const POD_WINDOW_MINUTES = 20;
export const POD_WINDOW_SECONDS = POD_WINDOW_MINUTES * 60;

export const POD_MIN_MEMBERS = 2;
export const POD_MAX_MEMBERS = 4;

export interface PodWindow {
  opensAt: Date;
  closesAt: Date;
  seconds: number;
}

/** The shared window for a pod: now → now + 20 minutes. */
export function podWindow(now: Date | number = new Date()): PodWindow {
  const opensAt = now instanceof Date ? now : new Date(now);
  return {
    opensAt,
    closesAt: new Date(opensAt.getTime() + POD_WINDOW_SECONDS * 1000),
    seconds: POD_WINDOW_SECONDS,
  };
}

/**
 * Per-member draw seed: hash(matchId + userId), as the owner specified.
 *
 * The hash is folded into a SIGNED 32-bit integer because the column is a
 * Postgres INT4 — an unsigned FNV-1a tail (up to 4294967295) would be
 * rejected by the database, which is exactly what the smoke test caught.
 */
export function podMemberSeed(matchId: string, userId: string): number {
  return hashId(`pod:${matchId}:${userId}`) | 0;
}

/** Match-level fingerprint seed — an audit draw, not the paper seed. */
export function matchSeed(groupId: string, tier: number, openedAt: Date | number): number {
  const at = openedAt instanceof Date ? openedAt.getTime() : openedAt;
  return hashId(`match:${groupId}:${tier}:${at}`) | 0;
}

/**
 * The idempotency key for a member's award in a pod: `${matchId}:${userId}`.
 *
 * It is the StarLedger `reason` for every adjustment row that pod writes, so
 * the sum of the deltas carrying this key is exactly the member's award for
 * that pod — and recomputing a placement (a late submit, a re-run) writes a
 * row only when that total changes.
 */
export function podAwardKey(matchId: string, userId: string): string {
  return `${matchId}:${userId}`;
}

// ── Pod scores, placements and stars ────────────────────────────────────────

export interface PodStandingInput {
  userId: string;
  score: number;
  submittedAt: Date | null;
}

export interface PodStanding {
  userId: string;
  score: number;
  placement: number;
}

/**
 * One ranking pass over every member of a pod: score desc, then the earlier
 * submit first (an unanswered paper never outranks a finished one), then
 * userId for a fully deterministic order. Placement is positional (1..n).
 */
export function rankPodMembers(members: readonly PodStandingInput[]): PodStanding[] {
  const ordered = members
    .map((m) => ({
      userId: m.userId,
      score: Number.isFinite(m.score) ? m.score : 0,
      submittedMs: m.submittedAt ? m.submittedAt.getTime() : Number.POSITIVE_INFINITY,
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.submittedMs !== b.submittedMs) return a.submittedMs - b.submittedMs;
      return a.userId < b.userId ? -1 : a.userId > b.userId ? 1 : 0;
    });

  return ordered.map((m, i) => ({ userId: m.userId, score: m.score, placement: i + 1 }));
}

/** Stars for a pod placement: 1st +3, 2nd +2, 3rd +1, everyone else +1. */
export function podStars(placement: number): number {
  if (placement <= 1) return 3;
  if (placement === 2) return 2;
  if (placement === 3) return 1;
  return 1;
}

// ── Groups: names, sizes, promotion and relegation ──────────────────────────

export const GROUP_CAPACITY = 20;

const ROMAN: readonly string[] = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

/** Roman numeral for a 0-based group index ("Vanguard III" for index 2). */
function roman(n: number): string {
  return ROMAN[n] ?? String(n + 1);
}

/** A group's ladder name: the tier's label plus its roman index. */
export function groupName(tier: number, index: number): string {
  return `${tierInfo(tier).label} ${roman(Math.max(0, Math.trunc(index)))}`;
}

export interface PromotionGroupInput {
  tier: number;
  groupId: string;
  groupName: string;
  avgStars: number;
}

export interface PromotionMove {
  groupId: string;
  groupName: string;
  fromTier: number;
  toTier: number;
  direction: "promote" | "relegate";
  avgStars: number;
}

/**
 * Promotion and relegation for a whole season — deterministic by construction:
 * groups are ordered by average stars, ties broken by group name, so the same
 * input always produces the same moves whatever order the rows arrive in.
 *
 * Per tier: the TOP two groups promote to the tier above, the BOTTOM two
 * relegate to the tier below. The ladder is closed at both ends — nothing
 * leaves the Initiates or is promoted out of Paragon — and a group can never
 * move both ways at once (that can only happen in a two-group tier, where
 * every group is both top and bottom: promotion wins and the relegation slot
 * is dropped, rather than moving the same roster twice).
 */
export function promotionPlan(groups: readonly PromotionGroupInput[]): PromotionMove[] {
  const byTier = new Map<number, PromotionGroupInput[]>();
  for (const group of groups) {
    if (!Number.isInteger(group.tier) || group.tier < MIN_TIER || group.tier > MAX_TIER) continue;
    const bucket = byTier.get(group.tier);
    if (bucket) bucket.push(group);
    else byTier.set(group.tier, [group]);
  }

  const moves: PromotionMove[] = [];
  const tiers = Array.from(byTier.keys()).sort((a, b) => a - b);

  for (const tier of tiers) {
    const ordered = [...(byTier.get(tier) ?? [])].sort((a, b) => {
      if (b.avgStars !== a.avgStars) return b.avgStars - a.avgStars;
      return a.groupName < b.groupName ? -1 : a.groupName > b.groupName ? 1 : 0;
    });

    const promoters = new Set(ordered.slice(0, 2).map((g) => g.groupId));
    const relegators = new Set(ordered.slice(-2).map((g) => g.groupId));

    for (const group of ordered) {
      if (promoters.has(group.groupId) && tier < MAX_TIER) {
        moves.push({
          groupId: group.groupId,
          groupName: group.groupName,
          fromTier: tier,
          toTier: tier + 1,
          direction: "promote",
          avgStars: group.avgStars,
        });
        continue;
      }
      if (relegators.has(group.groupId) && tier > MIN_TIER) {
        moves.push({
          groupId: group.groupId,
          groupName: group.groupName,
          fromTier: tier,
          toTier: tier - 1,
          direction: "relegate",
          avgStars: group.avgStars,
        });
      }
    }
  }

  return moves;
}

/** True when this group is moving members into the next season. */
export function isPromotion(move: PromotionMove): boolean {
  return move.direction === "promote";
}

// ── The ledger ──────────────────────────────────────────────────────────────

export interface LedgerEntryLike {
  delta: number;
  balanceAfter?: number | null;
}

/**
 * The balance a member holds after replaying a ledger: the running total of
 * its deltas. nextBalance of the ledger in creation order is the same number
 * as the last row's balanceAfter, which is what makes the ledger an audit
 * trail rather than a parallel copy of RankState.stars.
 */
export function nextBalance(ledger: readonly LedgerEntryLike[]): number {
  return ledger.reduce((total, entry) => total + (Number.isFinite(entry.delta) ? entry.delta : 0), 0);
}

/** Does every row's balanceAfter agree with its own running total? */
export function isLedgerConsistent(ledger: readonly LedgerEntryLike[]): boolean {
  let running = 0;
  for (const entry of ledger) {
    running += Number.isFinite(entry.delta) ? entry.delta : 0;
    if (entry.balanceAfter !== null && entry.balanceAfter !== undefined && entry.balanceAfter !== running) {
      return false;
    }
  }
  return true;
}

// ── Display handles and the season calendar ─────────────────────────────────

/** A member's ladder handle. No email, no id — display names only. */
export function displayHandle(name: string | null | undefined): string {
  const trimmed = typeof name === "string" ? name.trim() : "";
  return trimmed.length > 0 ? trimmed : "Anonymous Scholar";
}

/**
 * The owner's season calendar (ROADMAP.md locked decision 4):
 * Season 1 = January–April · Season 2 = May–August · Season 3 = September–December.
 */
export interface SeasonDates {
  slug: string;
  name: string;
  startsAt: Date;
  endsAt: Date;
}

export function seasonDates(slug: string): SeasonDates {
  const match = /^s([1-6])-(\d{4})$/.exec(slug);
  if (!match) {
    // Unknown slug: a one-year window from now, so a season is always playable.
    const now = new Date();
    return {
      slug,
      name: slug,
      startsAt: now,
      endsAt: new Date(now.getTime() + 365 * 864e5),
    };
  }

  const n = Number(match[1]);
  const year = Number(match[2]);
  const lastDay = (y: number, monthIndex0: number) =>
    new Date(Date.UTC(y, monthIndex0 + 1, 0, 23, 59, 59, 999));

  if (n === 1) return { slug, name: "Season 1", startsAt: new Date(Date.UTC(year, 0, 1)), endsAt: lastDay(year, 3) };
  if (n === 2) return { slug, name: "Season 2", startsAt: new Date(Date.UTC(year, 4, 1)), endsAt: lastDay(year, 7) };
  return { slug, name: "Season 3", startsAt: new Date(Date.UTC(year, 8, 1)), endsAt: lastDay(year, 11) };
}

/** The season after this one: "s3-2026" → "s1-2027" (the owner's numbering). */
export function nextSeasonSlug(slug: string): string {
  const match = /^s([1-6])-(\d{4})$/.exec(slug);
  if (!match) return slug;
  const n = Number(match[1]);
  const year = Number(match[2]);
  if (n >= 3) return `s1-${year + 1}`;
  return `s${n + 1}-${year}`;
}
