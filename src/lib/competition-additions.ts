import { createHash } from "crypto";
import type { AppDomain, PrismaClient } from "@prisma/client";
import { createNotification } from "@/lib/notify";
import { buildCupQuestionSet } from "@/app/api/competitions/[id]/question-set";
import type { CompetitionFormat } from "@/lib/competition";

/**
 * competition-additions.ts — the Endurance, Mastery and Cohort Bracket cups.
 *
 * The Speed Cup lane landed the contract (src/lib/competition.ts + the
 * server-derived paper in api/competitions/[id]/question-set.ts); this module
 * is the other three ROADMAP.md §3 formats, built on the SAME integrity rule:
 * everything a player sees is derived server-side, the answer key is only read
 * after a submit, and no client-reported value ever becomes a score.
 *
 * It deliberately does NOT touch competition.ts, the schema or the Speed Cup
 * stack — everything the three formats need is derived here, or stored in the
 * two columns the schema already gives us:
 *
 *   CompetitionMember.score — FORMAT-SPECIFIC (see SCORE_LABEL):
 *     speed     best correct answers out of the 20-question set
 *     endurance days survived (one point per checked-in day)
 *     mastery   mastery percentage (0–100) against the MASTERY_TARGET
 *     bracket   the member's quickfire round score in their current match (0–5)
 *
 *   Two small per-member ledgers, kept as NAMESPACED Progress rows rather than
 *   new tables (a migration is out of scope for this lane, and inventing new
 *   columns is worse). Every other Progress consumer filters by entityType
 *   ("topic" / "courseLesson"), so these rows are invisible to the learning
 *   surfaces, and both are deleted with the cups they belong to:
 *     entityType "league-endurance" — one row per member per cup; lastStudied
 *       is the last check-in day, which makes "once per calendar day"
 *       enforceable and "streak lost on <date>" computable.
 *     entityType "league-bracket" — one row per member per MATCH, keyed
 *       "${cupId}:r{round}:m{matchIndex}" in entityId with the round score in
 *       accuracy, so bracket winners are REPLAYED from stored submissions
 *       instead of trusted from a client.
 *
 * KNOWN LIMITATION (honest, documented — the next iteration needs a
 * BracketMatch table): the bracket plays its ROUND-ONE quickfires and derives
 * the winner of each pairing; later rounds are shown as locked, projected
 * slots only. There is no per-round, per-match persistence beyond round one,
 * so a champion cannot be crowned without that table. See bracketRoundLabels.
 */

// ── Shared constants ─────────────────────────────────────────────────────────

/** The Mastery Cup target: mean ConceptMastery.masteryScore to reach. */
export const MASTERY_TARGET = 0.8;
export const MASTERY_TARGET_PERCENT = 80;
export const MASTERY_TARGET_LABEL = "80%";

/** A bracket match is a best-of-5 quickfire drawn from the cup's own set. */
export const BRACKET_QUICKFIRE_QUESTIONS = 5;

/** Endurance badge milestones — the 7/14/30 durability marks. */
export const ENDURANCE_MILESTONES = [7, 14, 30] as const;

/** Namespaced Progress entityTypes — see the module header. */
export const ENDURANCE_LEDGER_ENTITY_TYPE = "league-endurance";
export const BRACKET_LEDGER_ENTITY_TYPE = "league-bracket";
const LEDGER_STATUS = "completed";

/** What CompetitionMember.score MEANS on each format's ladder. */
export const SCORE_LABEL: Record<CompetitionFormat, string> = {
  speed: "best correct answers",
  endurance: "days practised",
  mastery: "mastery %",
  bracket: "current round score",
};

// ── The anonymous-handle convention (copied from the Speed Cup leaderboard) ──

/**
 * Deterministic 4-hex racer tag — md5 of the userId, computed server-side,
 * the exact convention of /league/[id] and /league/[id]/results: stable for
 * that racer across every surface without ever revealing them.
 */
export function anonHandle(userId: string): string {
  return `Racer · ${createHash("md5").update(userId).digest("hex").slice(0, 4)}`;
}

/** Any member row that can answer "who is this on screen". */
export interface HandleMember {
  userId: string;
  anonymous: boolean;
  user: { name: string | null } | null;
}

/** Anonymous racers race under the hashed handle; named ones under their name. */
export function displayHandle(member: HandleMember): string {
  if (member.anonymous) return anonHandle(member.userId);
  return member.user?.name ?? "Racer";
}

// ── The seeded-draw pattern (same as question-set.ts: FNV-1a → mulberry32 → FY) ──

/** FNV-1a: a tiny, deterministic string hash — every draw's seed. */
export function stableHash(value: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 — the seeded PRNG that drives every draw below. */
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
export function seededShuffle<T>(items: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

// ── Shapes shared by the routes and the helpers ──────────────────────────────

/** The slice of a cup these helpers need (a full Competition satisfies it). */
export interface CupRef {
  id: string;
  domain: AppDomain;
  subjectSlug: string | null;
  startsAt: Date;
  endsAt: Date;
}

/** A CompetitionMember row with the join the handle helper needs. */
export interface MemberRow {
  id: string;
  userId: string;
  anonymous: boolean;
  score: number;
  rank: number | null;
  joinedAt: Date;
  user: { name: string | null } | null;
}

/** The leak-proof client shape of a question (no correctAnswer/explanation). */
export interface QuickfireQuestion {
  id: string;
  questionText: string;
  options: string[];
  hint: string | null;
  difficulty: string;
}

/** A member row for a user the roster lookup missed — anonymous by default. */
const UNKNOWN_MEMBER: (userId: string) => MemberRow = (userId) => ({ id: "", userId, anonymous: true, score: 0, rank: null, joinedAt: new Date(0), user: null });

function memberFor(ordered: MemberRow[], userId: string): MemberRow {
  return ordered.find((m) => m.userId === userId) ?? UNKNOWN_MEMBER(userId);
}

// ── Cohort Bracket — seeding, pairings, the quickfire draw ───────────────────

/**
 * The bracket seed order: a deterministic shuffle of the member list, seeded
 * by hash(competitionId + the ordered member ids). The caller must pass the
 * members in a STABLE order (joinedAt asc, userId asc) so the same roster
 * always shuffles to the same bracket — same id in, same bracket out, on
 * every request, for every player.
 */
export function bracketSeedOrder(competitionId: string, memberIds: string[]): string[] {
  return seededShuffle(memberIds.slice(), stableHash(`${competitionId}:${memberIds.join(",")}`));
}

export interface BracketPairing {
  matchIndex: number;
  /** The higher seed; never null — a pairing always has an A side. */
  a: string;
  /** null = a bye (an odd bracket gives the last seed a free pass). */
  b: string | null;
}

/** Round-one pairings: seeds are paired 1v2, 3v4, … — a bye when odd. */
export function bracketRoundOnePairings(seeds: string[]): BracketPairing[] {
  const pairs: BracketPairing[] = [];
  for (let i = 0; i < seeds.length; i += 2) {
    pairs.push({ matchIndex: i / 2, a: seeds[i], b: seeds[i + 1] ?? null });
  }
  return pairs;
}

/** Round names for a bracket of this many racers — Final/Semi/Quarter sized. */
export function bracketRoundLabels(memberCount: number): string[] {
  const rounds = Math.max(1, Math.ceil(Math.log2(Math.max(2, memberCount))));
  return Array.from({ length: rounds }, (_, i) => {
    if (i === rounds - 1) return "Final";
    if (i === rounds - 2) return "Semi-finals";
    if (i === rounds - 3) return "Quarter-finals";
    return `Round ${i + 1}`;
  });
}

/** The ledger key of one match — also the seed of its quickfire draw. */
export function bracketMatchKey(competitionId: string, round: number, matchIndex: number): string {
  return `${competitionId}:r${round}:m${matchIndex}`;
}

export function bracketMatchSeed(competitionId: string, round: number, matchIndex: number): number {
  return stableHash(bracketMatchKey(competitionId, round, matchIndex));
}

/**
 * The match paper: the cup's own derived question set (already subject-scoped
 * and leak-proof), re-drawn per match with the match seed, so both racers in
 * a pairing get the SAME five questions and the grader can re-derive them.
 */
export function drawQuickfire(
  questions: QuickfireQuestion[],
  seed: number,
  count: number = BRACKET_QUICKFIRE_QUESTIONS,
): QuickfireQuestion[] {
  return seededShuffle(questions.slice(), seed).slice(0, Math.max(0, Math.min(count, questions.length)));
}

/** Both members' questions for one match — identical by construction. */
export async function buildMatchQuestions(
  cup: CupRef,
  round: number,
  matchIndex: number,
): Promise<QuickfireQuestion[]> {
  const cupSet = await buildCupQuestionSet(cup);
  return drawQuickfire(cupSet, bracketMatchSeed(cup.id, round, matchIndex));
}

// ── Mastery Cup ──────────────────────────────────────────────────────────────

/**
 * The subject scope of a Mastery Cup. Mastery lives on the university spine
 * (ConceptMastery → ConceptNode → Course), so the cup's subjectSlug matches a
 * course by slug ("gross-anatomy-i") or department ("Human Anatomy"). A cup
 * with no subject scopes the member's whole ConceptMastery table. A highschool
 * topic slug simply matches no course and reads as "no concepts tracked yet" —
 * honest, not an error.
 */
function masteryScope(subjectSlug: string | null): Record<string, unknown> {
  if (!subjectSlug) return {};
  return { concept: { course: { OR: [{ slug: subjectSlug }, { department: subjectSlug }] } } };
}

export interface MasteryStanding {
  handle: string;
  progress: number | null;
  concepts: number;
  crossed: boolean;
  isCaller: boolean;
}

export interface MasteryView {
  target: number;
  targetPercent: number;
  targetLabel: string;
  subjectSlug: string | null;
  rows: MasteryStanding[];
  me: { progress: number | null; concepts: number; crossed: boolean };
  /** Set when this GET recorded a crossing (the first read past the target). */
  recorded: { crossed: boolean; score: number; rank: number | null; first: boolean } | null;
}

/**
 * Everyone's live mastery progress, best-first (null progress last). One
 * query over the members' ConceptMastery rows scoped to the cup's subject;
 * nothing here is client-reported.
 */
export async function computeMasteryStandings(
  db: PrismaClient,
  cup: CupRef,
  members: MemberRow[],
  viewerId: string,
): Promise<Omit<MasteryView, "recorded">> {
  const perUser = new Map<string, { total: number; count: number }>();
  const userIds = members.map((m) => m.userId);
  if (userIds.length > 0) {
    const rows = await db.conceptMastery.findMany({
      where: { userId: { in: userIds }, ...masteryScope(cup.subjectSlug) },
      select: { userId: true, masteryScore: true },
    });
    for (const row of rows) {
      if (row.masteryScore == null) continue;
      const agg = perUser.get(row.userId) ?? { total: 0, count: 0 };
      agg.total += row.masteryScore;
      agg.count += 1;
      perUser.set(row.userId, agg);
    }
  }

  const progressOf = (userId: string) => {
    const agg = perUser.get(userId);
    return agg && agg.count > 0 ? agg.total / agg.count : null;
  };

  const rows: MasteryStanding[] = members
    .map((member) => {
      const progress = progressOf(member.userId);
      return {
        handle: displayHandle(member),
        progress,
        concepts: perUser.get(member.userId)?.count ?? 0,
        crossed: progress !== null && progress >= MASTERY_TARGET,
        isCaller: member.userId === viewerId,
      };
    })
    .sort((a, b) => {
      if (a.progress !== b.progress) return (b.progress ?? -1) - (a.progress ?? -1);
      return a.handle.localeCompare(b.handle);
    });

  const mine = progressOf(viewerId);
  return {
    target: MASTERY_TARGET,
    targetPercent: MASTERY_TARGET_PERCENT,
    targetLabel: MASTERY_TARGET_LABEL,
    subjectSlug: cup.subjectSlug,
    rows,
    me: {
      progress: mine,
      concepts: perUser.get(viewerId)?.count ?? 0,
      crossed: mine !== null && mine >= MASTERY_TARGET,
    },
  };
}

/**
 * Record a crossing. Called by the GET when the caller's live progress has
 * reached the target: the member's score becomes round(progress * 100), the
 * FIRST member past the target takes rank 1, and the crossing notifies
 * "milestone" (the only type that fits on the closed list — ROADMAP §2).
 *
 * The write is monotonic and idempotent: it only fires when the recomputed
 * score actually advances the member's recorded one, so re-reading the page
 * never re-notifies. Two simultaneous crossings resolve by whichever GET
 * lands first — a friendly cup, not an exam hall.
 */
export async function recordMasteryProgress(
  db: PrismaClient,
  cup: { id: string; title: string },
  member: MemberRow,
  progress: number,
): Promise<{ crossed: boolean; score: number; rank: number | null; first: boolean }> {
  const score = Math.round(progress * 100);
  const crossed = progress >= MASTERY_TARGET;
  const previousScore = member.score;
  const firstCrossing = crossed && previousScore < MASTERY_TARGET_PERCENT;

  // First crosser takes rank 1; a later crosser keeps their (null) rank.
  const alreadyWon = await db.competitionMember.findFirst({
    where: { competitionId: cup.id, rank: 1 },
    select: { id: true },
  });
  const rank = crossed && !alreadyWon ? 1 : member.rank;

  if (score > previousScore) {
    await db.competitionMember.update({ where: { id: member.id }, data: { score } });
    // The guarded updateMany keeps the where clause on the old rank so two
    // racing GETs cannot both claim the top spot.
    if (rank === 1) {
      await db.competitionMember.updateMany({ where: { id: member.id, rank: null }, data: { rank: 1 } });
    }
    if (crossed) {
      await createNotification(member.userId, {
        type: "milestone",
        title: firstCrossing ? `You crossed the ${MASTERY_TARGET_LABEL} mastery target` : "Mastery progress recorded",
        body: firstCrossing
          ? `Your subject mastery in "${cup.title}" is ${score}% — ${rank === 1 ? "first past the line." : "past the target."}`
          : `Your subject mastery in "${cup.title}" is now ${score}%.`,
        href: `/league/${cup.id}/mastery`,
      });
    }
  }

  return { crossed, score, rank: crossed ? rank : null, first: firstCrossing };
}

// ── Endurance Cup ────────────────────────────────────────────────────────────

/** The agreed cup length: 7, 14 or 30 days, derived from the window itself. */
export function enduranceWindowDays(startsAt: Date, endsAt: Date): number {
  const days = Math.round((endsAt.getTime() - startsAt.getTime()) / 864e5);
  return Math.max(1, Math.min(30, days));
}

/** Whole days left in the window (0 once it closes). */
export function enduranceDaysRemaining(endsAt: Date, now: Date): number {
  return Math.max(0, Math.ceil((endsAt.getTime() - now.getTime()) / 864e5));
}

/** The UTC calendar day — the check-in's "once per day" key (server clock). */
export function enduranceDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function enduranceAddDays(key: string, days: number): string {
  const date = new Date(`${key}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return enduranceDayKey(date);
}

/** The badge-style label for a check-in milestone, or null off-milestone. */
export function enduranceMilestoneLabel(streak: number): string | null {
  return streak === 7 || streak === 14 || streak === 30 ? `${streak}-day durability` : null;
}

export interface EnduranceVerdict {
  checkedInToday: boolean;
  /** Alive = checked in today, or yesterday (today is still open). */
  alive: boolean;
  /** The first missed day, when the streak froze — null while it never broke. */
  lostOn: string | null;
}

export function enduranceVerdict(lastCheckIn: Date | null, now: Date): EnduranceVerdict {
  const today = enduranceDayKey(now);
  if (!lastCheckIn) return { checkedInToday: false, alive: false, lostOn: null };
  const last = enduranceDayKey(lastCheckIn);
  if (last === today) return { checkedInToday: true, alive: true, lostOn: null };
  if (last === enduranceAddDays(today, -1)) return { checkedInToday: false, alive: true, lostOn: null };
  // Missing a day freezes the score — it never resets it — and the cup shows
  // the day the streak went quiet, kindly.
  return { checkedInToday: false, alive: false, lostOn: enduranceAddDays(last, 1) };
}

export interface EnduranceLeaderRow {
  handle: string;
  days: number;
  rank: number | null;
  isCaller: boolean;
}

export interface EnduranceView {
  windowDays: number;
  daysRemaining: number;
  streak: number;
  checkedInToday: boolean;
  alive: boolean;
  lostOn: string | null;
  started: boolean;
  leaderboard: EnduranceLeaderRow[];
}

async function enduranceLastCheckIn(
  db: PrismaClient,
  userId: string,
  cupId: string,
  domain: AppDomain,
): Promise<Date | null> {
  const row = await db.progress.findFirst({
    where: { userId, domain, entityType: ENDURANCE_LEDGER_ENTITY_TYPE, entityId: cupId },
    select: { lastStudied: true },
  });
  return row?.lastStudied ?? null;
}

/** The endurance read: the member's streak, the clock, and the survival board. */
export async function enduranceView(
  db: PrismaClient,
  cup: CupRef,
  members: MemberRow[],
  viewerId: string,
  now: Date = new Date(),
): Promise<EnduranceView> {
  const member = members.find((m) => m.userId === viewerId) ?? null;
  const lastCheckIn = member ? await enduranceLastCheckIn(db, viewerId, cup.id, cup.domain) : null;
  const verdict = enduranceVerdict(lastCheckIn, now);

  const leaderboard: EnduranceLeaderRow[] = members
    .map((m) => ({
      handle: displayHandle(m),
      days: m.score,
      rank: m.rank,
      isCaller: m.userId === viewerId,
    }))
    .sort((a, b) => b.days - a.days || a.handle.localeCompare(b.handle));

  return {
    windowDays: enduranceWindowDays(cup.startsAt, cup.endsAt),
    daysRemaining: enduranceDaysRemaining(cup.endsAt, now),
    streak: member?.score ?? 0,
    checkedInToday: verdict.checkedInToday,
    alive: verdict.alive,
    lostOn: verdict.lostOn,
    started: lastCheckIn !== null,
    leaderboard,
  };
}

export type EnduranceCheckInResult =
  | { ok: true; streak: number; milestone: string | null }
  | { ok: false; reason: "window_closed" | "already_checked_in"; streak: number };

/**
 * "I practised today." One honest check-in per UTC calendar day per member,
 * recorded two ways: the member's score rises by one (days survived — the
 * ladder value), and the namespaced ledger row's lastStudied becomes today
 * (which is what makes the second call of the day a no-op, and what lets the
 * cup show "streak lost on <date>" after a missed day).
 *
 * The check-in is the member's own attestation — the platform cannot see
 * inside a student's notebook. Reconciling it against real practice events
 * is a next-iteration item (see the module header).
 */
export async function enduranceCheckIn(
  db: PrismaClient,
  cup: CupRef & { title: string },
  member: MemberRow,
  now: Date = new Date(),
): Promise<EnduranceCheckInResult> {
  if (now < cup.startsAt || now > cup.endsAt) {
    return { ok: false, reason: "window_closed", streak: member.score };
  }

  const existing = await db.progress.findFirst({
    where: {
      userId: member.userId,
      domain: cup.domain,
      entityType: ENDURANCE_LEDGER_ENTITY_TYPE,
      entityId: cup.id,
    },
    select: { id: true, lastStudied: true },
  });
  if (enduranceVerdict(existing?.lastStudied ?? null, now).checkedInToday) {
    return { ok: false, reason: "already_checked_in", streak: member.score };
  }

  const streak = member.score + 1;
  await db.competitionMember.update({ where: { id: member.id }, data: { score: streak } });
  if (existing) {
    await db.progress.update({ where: { id: existing.id }, data: { lastStudied: now } });
  } else {
    await db.progress.create({
      data: {
        userId: member.userId,
        domain: cup.domain,
        entityType: ENDURANCE_LEDGER_ENTITY_TYPE,
        entityId: cup.id,
        status: LEDGER_STATUS,
        lastStudied: now,
      },
    });
  }

  const milestone = enduranceMilestoneLabel(streak);
  if (milestone) {
    await createNotification(member.userId, {
      type: "milestone",
      title: `Endurance Cup — ${milestone}`,
      body: `${streak} days practised in "${cup.title}" — the durability badge is yours.`,
      href: `/league/${cup.id}/endurance`,
    });
  }

  return { ok: true, streak, milestone };
}

// ── Cohort Bracket ───────────────────────────────────────────────────────────

export interface BracketSlot {
  seedIndex: number;
  handle: string;
  isCaller: boolean;
  submitted: boolean;
  score: number | null;
}

export type BracketMatchState = "open" | "awaiting_you" | "awaiting_opponent" | "decided";

export interface BracketMatch {
  matchIndex: number;
  a: BracketSlot | null;
  b: BracketSlot | null;
  /** A bye: the unpaired seed advances without a quickfire. */
  bye: boolean;
  state: BracketMatchState;
  winner: { handle: string; isCaller: boolean } | null;
}

export interface BracketMyMatch {
  round: number;
  matchIndex: number;
  seedIndex: number;
  opponent: { handle: string } | null;
  state: BracketMatchState;
  bye: boolean;
  myScore: number | null;
  opponentScore: number | null;
  /** Present while the match is live — the leak-proof 5-question paper. */
  questions: QuickfireQuestion[];
  decided: boolean;
  winnerIsMe: boolean | null;
}

export interface BracketView {
  size: number;
  roundLabels: string[];
  roundOne: { label: string; matches: BracketMatch[] };
  /** Later rounds exist as projected slots only — see the module header. */
  projectedRounds: string[];
  /** null when the cup is playable; otherwise why it cannot draw a tree. */
  reason: string | null;
  me: BracketMyMatch | null;
}

/**
 * Round-one submissions, keyed "${matchKey}:${userId}" — two racers share a
 * match key, so the compound key is what keeps both rows.
 */
async function bracketRoundScores(
  db: PrismaClient,
  cupId: string,
  pairings: BracketPairing[],
): Promise<Map<string, { userId: string; accuracy: number | null }>> {
  const keys = pairings.map((p) => bracketMatchKey(cupId, 1, p.matchIndex));
  if (keys.length === 0) return new Map();
  const rows = await db.progress.findMany({
    where: { entityType: BRACKET_LEDGER_ENTITY_TYPE, entityId: { in: keys } },
    select: { userId: true, entityId: true, accuracy: true },
  });
  const byKey = new Map<string, { userId: string; accuracy: number | null }>();
  for (const row of rows) {
    byKey.set(`${row.entityId}:${row.userId}`, { userId: row.userId, accuracy: row.accuracy });
  }
  return byKey;
}

function scoreOf(scores: Map<string, { userId: string; accuracy: number | null }>, matchKey: string, userId: string): number | null {
  const row = scores.get(`${matchKey}:${userId}`);
  return row ? Math.round(row.accuracy ?? 0) : null;
}

/**
 * The bracket read: the seeded tree, the caller's live match, and their five
 * questions (never the answer key). Round-one winners are derived from the
 * ledger — both racers' posted round scores — so nobody has to be trusted.
 * Ties advance the higher seed: deterministic, and decided before the match.
 */
export async function bracketView(
  db: PrismaClient,
  cup: CupRef,
  members: MemberRow[],
  viewerId: string,
): Promise<BracketView> {
  const ordered = [...members].sort((a, b) => a.joinedAt.getTime() - b.joinedAt.getTime() || a.userId.localeCompare(b.userId));
  const seeds = bracketSeedOrder(cup.id, ordered.map((m) => m.userId));
  const labels = bracketRoundLabels(seeds.length);
  const pairings = bracketRoundOnePairings(seeds);
  const scores = await bracketRoundScores(db, cup.id, pairings);

  const matches: BracketMatch[] = pairings.map((pairing) => {
    const matchKey = bracketMatchKey(cup.id, 1, pairing.matchIndex);
    const aSeed = seeds.indexOf(pairing.a);
    const bSeed = pairing.b ? seeds.indexOf(pairing.b) : -1;
    const slot = (userId: string, seedIndex: number): BracketSlot => {
      const score = scoreOf(scores, matchKey, userId);
      return {
        seedIndex,
        handle: displayHandle(memberFor(ordered, userId)),
        isCaller: userId === viewerId,
        submitted: score !== null,
        score,
      };
    };
    const a = slot(pairing.a, aSeed);
    const b = pairing.b ? slot(pairing.b, bSeed) : null;
    const bye = b === null;
    const state: BracketMatchState = bye
      ? "decided"
      : a.submitted && b.submitted
        ? "decided"
        : a.submitted
          ? "awaiting_opponent"
          : b.submitted
            ? "awaiting_you"
            : "open";
    let winner: BracketMatch["winner"] = null;
    if (state === "decided") {
      if (bye) winner = { handle: a.handle, isCaller: a.isCaller };
      else if (b) {
        const aScore = a.score ?? 0;
        const bScore = b.score ?? 0;
        // Ties advance the higher seed — no coin flip, no re-grind.
        const aWins = aScore === bScore ? a.seedIndex <= b.seedIndex : aScore > bScore;
        const side = aWins ? a : b;
        winner = { handle: side.handle, isCaller: side.isCaller };
      }
    }
    return { matchIndex: pairing.matchIndex, a, b, bye, state, winner };
  });

  const mySeedIndex = seeds.indexOf(viewerId);
  const myPairing = mySeedIndex >= 0 ? pairings[Math.floor(mySeedIndex / 2)] ?? null : null;
  const myMatch = myPairing ? matches[myPairing.matchIndex] ?? null : null;
  const mySlot = myMatch ? (myMatch.a?.isCaller ? myMatch.a : myMatch.b) : null;
  const opponentSlot = myMatch ? (myMatch.a?.isCaller ? myMatch.b : myMatch.a) : null;
  const decided = myMatch?.state === "decided";

  let questions: QuickfireQuestion[] = [];
  if (myMatch && !decided) {
    questions = await buildMatchQuestions(cup, 1, myMatch.matchIndex);
  }

  return {
    size: seeds.length,
    roundLabels: labels,
    roundOne: { label: labels[0] ?? "Round 1", matches },
    projectedRounds: labels.slice(1),
    reason:
      seeds.length < 2
        ? "A bracket needs at least two racers — the tree is drawn once the cup fills."
        : seeds.length < 4
          ? "This bracket runs with byes — the unpaired seed advances automatically."
          : null,
    me: myPairing && myMatch
      ? {
          round: 1,
          matchIndex: myPairing.matchIndex,
          seedIndex: mySeedIndex,
          opponent: myPairing.b ? { handle: displayHandle(memberFor(ordered, myPairing.a === viewerId ? myPairing.b : myPairing.a)) } : null,
          state: myMatch.state,
          bye: myPairing.b === null,
          myScore: mySlot?.score ?? null,
          opponentScore: opponentSlot?.score ?? null,
          questions,
          decided,
          winnerIsMe: decided && myMatch.winner ? myMatch.winner.isCaller : null,
        }
      : null,
  };
}

export interface BracketSubmitResult {
  score: number;
  match: {
    matchIndex: number;
    state: BracketMatchState;
    myScore: number;
    opponentScore: number | null;
    decided: boolean;
    winnerIsMe: boolean | null;
    opponentHandle: string | null;
  };
}

/**
 * Play the quickfire. The paper is re-derived from (cup, round, matchIndex) —
 * the same five questions the GET dealt — then graded server-side against
 * correctAnswer AFTER the answers exist. The posted score is best-of (a
 * retry can only improve it) until the opponent posts too, which freezes the
 * pairing: both racers' round scores live in CompetitionMember.score AND in
 * the namespaced ledger, so every screen replays the same match.
 */
export async function bracketSubmit(
  db: PrismaClient,
  cup: CupRef & { title: string },
  members: MemberRow[],
  member: MemberRow,
  answers: { questionId: string; selected: string }[],
  now: Date = new Date(),
): Promise<BracketSubmitResult> {
  const ordered = [...members].sort((a, b) => a.joinedAt.getTime() - b.joinedAt.getTime() || a.userId.localeCompare(b.userId));
  const seeds = bracketSeedOrder(cup.id, ordered.map((m) => m.userId));
  const mySeedIndex = seeds.indexOf(member.userId);
  if (mySeedIndex < 0) throw new Error("You are not on this bracket");
  const matchIndex = Math.floor(mySeedIndex / 2);
  const pairing = bracketRoundOnePairings(seeds)[matchIndex];
  if (!pairing) throw new Error("This cup has no bracket drawn yet");
  const opponentId = pairing.a === member.userId ? pairing.b : pairing.a;
  const matchKey = bracketMatchKey(cup.id, 1, matchIndex);

  const scores = await bracketRoundScores(db, cup.id, [pairing]);
  const myPrevious = scoreOf(scores, matchKey, member.userId);
  const opponentScore = opponentId ? scoreOf(scores, matchKey, opponentId) : null;

  // A decided pairing is frozen — re-grinding a match to flip a result is
  // exactly the client-trust hole this lane refuses to build.
  if (opponentId && opponentScore !== null && myPrevious !== null) {
    throw new Error("This match is already decided");
  }

  const questions = await buildMatchQuestions(cup, 1, matchIndex);
  if (questions.length === 0) throw new Error("This cup has no questions available");
  const byId = new Map(questions.map((q) => [q.id, q]));

  // Submit-side validation: only ids from THIS match's derived set, each once,
  // and only a served option — the same contract as the Speed Cup /submit.
  const seen = new Set<string>();
  for (const entry of answers) {
    const question = byId.get(entry.questionId);
    if (!question) throw new Error("Answer submitted for a question that is not part of this match");
    if (!question.options.includes(entry.selected)) throw new Error("Choose one of the listed options");
    if (seen.has(entry.questionId)) throw new Error("One answer per question");
    seen.add(entry.questionId);
  }

  // The answer key, read only now that the attempt exists. Unanswered
  // questions are simply wrong — the clock running out is not an error.
  const keyRows = await db.question.findMany({
    where: { id: { in: questions.map((q) => q.id) } },
    select: { id: true, correctAnswer: true },
  });
  const keyById = new Map(keyRows.map((row) => [row.id, row.correctAnswer]));
  const normalise = (value: string) => value.trim().toLowerCase();
  const correct = questions.filter((q) => {
    const selected = answers.find((a) => a.questionId === q.id)?.selected ?? null;
    return selected !== null && normalise(selected) === normalise(keyById.get(q.id) ?? "");
  }).length;

  const best = Math.max(myPrevious ?? 0, correct);
  const ledger = await db.progress.findFirst({
    where: { userId: member.userId, entityType: BRACKET_LEDGER_ENTITY_TYPE, entityId: matchKey },
    select: { id: true },
  });
  if (ledger) {
    await db.progress.update({ where: { id: ledger.id }, data: { accuracy: best, lastStudied: now, status: LEDGER_STATUS } });
  } else {
    await db.progress.create({
      data: {
        userId: member.userId,
        domain: cup.domain,
        entityType: BRACKET_LEDGER_ENTITY_TYPE,
        entityId: matchKey,
        status: LEDGER_STATUS,
        accuracy: best,
        lastStudied: now,
      },
    });
  }
  await db.competitionMember.update({ where: { id: member.id }, data: { score: best } });

  // Match state, replayed from the stored rounds.
  const decidedNow = opponentId !== null && opponentScore !== null;
  let winnerIsMe: boolean | null = null;
  if (decidedNow && opponentId) {
    const opponentSeed = seeds.indexOf(opponentId);
    winnerIsMe = best === opponentScore ? mySeedIndex <= opponentSeed : best > (opponentScore ?? 0);
    const opponentHandle = displayHandle(memberFor(ordered, opponentId));
    const tie = best === opponentScore;
    await createNotification(opponentId, {
      type: "milestone",
      title: "Bracket match decided",
      body: winnerIsMe
        ? `${displayHandle(memberFor(ordered, member.userId))} beat you ${best}–${opponentScore ?? 0} in "${cup.title}".`
        : tie
          ? `Tied ${best}–${opponentScore ?? 0} with ${displayHandle(memberFor(ordered, member.userId))} in "${cup.title}" — the higher seed advances, so you move on.`
          : `You beat ${displayHandle(memberFor(ordered, member.userId))} ${opponentScore ?? 0}–${best} in "${cup.title}".`,
      href: `/league/${cup.id}/bracket`,
    });
  } else if (opponentId) {
    // The opponent hears their round is waiting — "bracket_invite" is the one
    // type on the closed list that fits a match call-up (ROADMAP §2).
    await createNotification(opponentId, {
      type: "bracket_invite",
      title: "Your bracket round is open",
      body: `Your opponent in "${cup.title}" has played — your quickfire round decides the pairing.`,
      href: `/league/${cup.id}/bracket`,
    });
  }

  return {
    score: best,
    match: {
      matchIndex,
      state: decidedNow ? "decided" : "awaiting_opponent",
      myScore: best,
      opponentScore,
      decided: decidedNow,
      winnerIsMe,
      opponentHandle: opponentId ? displayHandle(memberFor(ordered, opponentId)) : null,
    },
  };
}
