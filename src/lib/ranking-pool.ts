import prisma from "@/lib/db";
import {
  GROUP_CAPACITY,
  type ChampionshipPoolEntry,
  groupName,
  seasonDates,
} from "@/lib/ranking";

/**
 * src/lib/ranking-pool.ts — the ladder's store: pools, seasons, groups (Phase 7).
 *
 * The pools the ladder draws its papers from. They are CATEGORY-AGNOSTIC by
 * design: a pod in tier 4 plays the same pool whatever subject its members
 * study, drawn from the deepest banks the platform already has — the
 * highschool exam bank (JAMB/WAEC and the wider question bank) for the lower
 * tiers, hardening into university assessment-equivalent items for tiers 4–6
 * (AssessmentItem, reached through its course / ConceptNode spine).
 *
 * Two invariants, both deliberate:
 *
 * 1. NO ANSWER KEY LEAVES THIS MODULE. Every query selects the safe columns
 *    only — questionText, options, difficulty — so a pool entry has no answer
 *    field to leak. Grading reads the key separately (resolveChampionshipKey)
 *    after the window has started, exactly as the Speed Cup does.
 * 2. Entries are prefixed by bank ("q:" Question, "a:" AssessmentItem) so an
 *    id is unique across both banks and the grader knows where to read the
 *    key from. The prefix is an opaque handle: nothing about the question is
 *    revealed by it.
 *
 * The pool is cached in-process per tier for POOL_TTL_MS and spread
 * cross-subject by a deterministic round-robin, so two members in the same
 * pod draw from the same tier pool — each then re-draws it under their own
 * seed (buildChampionshipPaper) for a personal question AND option order.
 *
 * This module also owns the ladder's other store accessors that both the
 * queue and the season-close route need — the active season and
 * find-or-create group assignment — because the ranking lane's file budget
 * covers only ranking.ts and ranking-pool.ts in src/lib.
 */

/** Questions held in one tier's pool. */
export const POOL_TARGET = 60;

/** In-process cache lifetime per tier — 10 minutes, no schema, no store. */
export const POOL_TTL_MS = 10 * 60 * 1000;

/**
 * Deterministic window the cross-subject spread runs over. Ordered by
 * bucket (topicId / courseId) then id, so the window is stable across
 * restarts and the spread never depends on row arrival order.
 */
const SPREAD_ROWS = 400;

type BankKind = "question" | "assessment";

interface BankSlice {
  kind: BankKind;
  difficulty: string | null;
  take: number;
}

/**
 * The tier's recipe: difficulty hardens with the tier, and tiers 4–6 mix in
 * university assessment-equivalent items (AssessmentItem), which is what makes
 * the upper ladder genuinely harder rather than merely longer.
 */
function bankSlices(tier: number): BankSlice[] {
  const university: BankSlice = { kind: "assessment", difficulty: null, take: 0 };
  switch (tier) {
    case 1:
      return [{ kind: "question", difficulty: "easy", take: POOL_TARGET }];
    case 2:
      return [
        { kind: "question", difficulty: "easy", take: 45 },
        { kind: "question", difficulty: "medium", take: 15 },
      ];
    case 3:
      return [{ kind: "question", difficulty: "medium", take: POOL_TARGET }];
    case 4:
      return [
        { kind: "question", difficulty: "medium", take: 36 },
        { ...university, take: 24 },
      ];
    case 5:
      return [
        { kind: "question", difficulty: "hard", take: 30 },
        { ...university, take: 30 },
      ];
    default:
      return [
        { kind: "question", difficulty: "hard", take: 24 },
        { ...university, take: 36 },
      ];
  }
}

interface Bucketed {
  bucket: string;
  entry: ChampionshipPoolEntry;
}

/**
 * Round-robin across buckets (topic / course) so the pool is cross-subject by
 * construction, not by luck: pass one takes the first entry of every bucket,
 * pass two the second, and so on until the quota is filled.
 */
function spreadCrossSubject(rows: readonly Bucketed[], take: number): ChampionshipPoolEntry[] {
  const buckets = new Map<string, ChampionshipPoolEntry[]>();
  for (const row of rows) {
    const bucket = buckets.get(row.bucket);
    if (bucket) bucket.push(row.entry);
    else buckets.set(row.bucket, [row.entry]);
  }

  const out: ChampionshipPoolEntry[] = [];
  const keys = Array.from(buckets.keys());
  let depth = 0;
  while (out.length < take) {
    let added = 0;
    for (const key of keys) {
      const bucket = buckets.get(key);
      if (bucket && depth < bucket.length) {
        out.push(bucket[depth]);
        added += 1;
        if (out.length >= take) break;
      }
    }
    if (added === 0) break;
    depth += 1;
  }
  return out;
}

function toOptions(value: unknown): string[] {
  return Array.isArray(value) ? value.map((v) => (typeof v === "string" ? v : String(v))) : [];
}

/** Highschool mcq rows from the question bank, safe columns only. */
async function questionBank(difficulty: string | null): Promise<Bucketed[]> {
  const rows = await prisma.question.findMany({
    where: {
      domain: "highschool",
      type: "mcq",
      ...(difficulty ? { difficulty } : {}),
    },
    select: { id: true, topicId: true, questionText: true, options: true, difficulty: true },
    orderBy: [{ topicId: "asc" }, { id: "asc" }],
    take: SPREAD_ROWS,
  });
  return rows.map((q) => ({
    bucket: q.topicId,
    entry: {
      id: `q:${q.id}`,
      questionText: q.questionText,
      options: toOptions(q.options),
      difficulty: q.difficulty,
    },
  }));
}

/**
 * University assessment-equivalent items, reached through the course /
 * ConceptNode spine. Only published, answerable MCQs are eligible; a
 * university assessment is the upper ladder's hardest source.
 */
async function assessmentBank(): Promise<Bucketed[]> {
  const rows = await prisma.assessmentItem.findMany({
    where: {
      isPublished: true,
      correctAnswer: { not: null },
      format: "sba",
    },
    select: {
      id: true,
      stem: true,
      options: true,
      difficulty: true,
      correctAnswer: true,
      concept: { select: { courseId: true } },
      course: { select: { id: true, domain: true, isPublished: true } },
    },
    orderBy: [{ courseId: "asc" }, { id: "asc" }],
    take: SPREAD_ROWS,
  });

  return rows
    .filter((item) => {
      // No answer key or fewer than two options means an item that cannot be
      // graded or played — it must never reach a pool.
      return toOptions(item.options).length >= 2 && item.correctAnswer !== null;
    })
    .map((item) => ({
      // Bucket by the course the item belongs to, so the pool spreads across
      // the university curriculum rather than clustering in one course.
      bucket: item.concept?.courseId ?? item.course.id,
      entry: {
        id: `a:${item.id}`,
        questionText: item.stem,
        options: toOptions(item.options),
        difficulty: item.difficulty,
      },
    }));
}

interface PoolCacheEntry {
  at: number;
  entries: ChampionshipPoolEntry[];
}

const poolCache = new Map<number, PoolCacheEntry>();

/**
 * The championship pool for a tier, ~60 cross-subject entries, cached in this
 * process per tier for 10 minutes (no schema, no external store — the pool is
 * a pure function of the bank, so a warm process and a cold one agree).
 */
export async function championshipPool(tier: number): Promise<ChampionshipPoolEntry[]> {
  const cached = poolCache.get(tier);
  if (cached && Date.now() - cached.at < POOL_TTL_MS) return cached.entries.slice();

  const entries: ChampionshipPoolEntry[] = [];
  for (const slice of bankSlices(tier)) {
    const rows = slice.kind === "question" ? await questionBank(slice.difficulty) : await assessmentBank();
    entries.push(...spreadCrossSubject(rows, slice.take));
  }

  // A tier must always be playable: if its recipe produced a thin pool (a stub
  // bank, or a slice with no items), top it up from the widest easy source so
  // a pod paper is never empty.
  if (entries.length < POOL_TARGET) {
    const fallback = await questionBank("easy");
    entries.push(...spreadCrossSubject(fallback, POOL_TARGET - entries.length));
  }

  const deduped: ChampionshipPoolEntry[] = [];
  const seen = new Set<string>();
  for (const entry of entries) {
    if (seen.has(entry.id)) continue;
    seen.add(entry.id);
    deduped.push(entry);
  }

  poolCache.set(tier, { at: Date.now(), entries: deduped });
  return deduped.slice();
}

export interface ChampionshipKey {
  id: string;
  correctAnswer: string | null;
}

/**
 * The answer key for a set of pool ids, read SERVER-SIDE only. Called by the
 * grading path after a submit — never by a session, never by a client.
 */
export async function resolveChampionshipKey(poolIds: readonly string[]): Promise<Map<string, string>> {
  const questionIds: string[] = [];
  const assessmentIds: string[] = [];
  for (const poolId of poolIds) {
    if (typeof poolId !== "string" || !poolId.includes(":")) continue;
    const [kind, id] = [poolId.slice(0, poolId.indexOf(":")), poolId.slice(poolId.indexOf(":") + 1)];
    if (kind === "q") questionIds.push(id);
    else if (kind === "a") assessmentIds.push(id);
  }

  const key = new Map<string, string>();
  if (questionIds.length > 0) {
    const rows = await prisma.question.findMany({
      where: { id: { in: questionIds } },
      select: { id: true, correctAnswer: true },
    });
    for (const row of rows) key.set(`q:${row.id}`, row.correctAnswer ?? "");
  }
  if (assessmentIds.length > 0) {
    const rows = await prisma.assessmentItem.findMany({
      where: { id: { in: assessmentIds } },
      select: { id: true, correctAnswer: true },
    });
    for (const row of rows) if (row.correctAnswer !== null) key.set(`a:${row.id}`, row.correctAnswer);
  }
  return key;
}

/** Drop the in-process cache — used by tests and after a bank import. */
export function clearChampionshipPoolCache(): void {
  poolCache.clear();
}

// ── Seasons and group assignment ────────────────────────────────────────────

/**
 * The soft-launch season (ROADMAP.md locked decision 4). Mid-season entry is
 * open, so a member arriving today joins this one rather than waiting for the
 * next full season.
 */
export const CURRENT_SEASON_SLUG = "s3-2026";

/**
 * The season the ladder runs in: the row flagged active, or the soft-launch
 * season if none is flagged yet. Idempotent, so the first queue call after a
 * deploy creates the season row rather than failing.
 */
export async function activeSeason() {
  const existing = await prisma.season.findFirst({
    where: { status: "active" },
    orderBy: { startsAt: "desc" },
  });
  if (existing) return existing;

  const dates = seasonDates(CURRENT_SEASON_SLUG);
  return prisma.season.upsert({
    where: { slug: dates.slug },
    create: { ...dates, status: "active" },
    update: {},
  });
}

/** Every group of a season and tier, with its live member count. */
export function groupsOf(seasonSlug: string, tier: number) {
  return prisma.leagueGroup.findMany({
    where: { seasonSlug, tier },
    include: { _count: { select: { members: true } } },
    orderBy: { createdAt: "asc" },
  });
}

/**
 * A group with room, creating the next one when every existing group of this
 * season+tier is full. Groups are capped at GROUP_CAPACITY (20) and numbered
 * by tier + roman index, so a tier filling up reads "Initiate I", "Initiate
 * II", … on the ladder.
 *
 * The create is retried on a name collision: two members queueing into an
 * empty season can race to create the same-named group, and the unique
 * constraint (seasonSlug, tier, name) rejects the loser — it then re-reads
 * whatever capacity the race produced instead of failing the join.
 */
export async function findOrCreateGroup(seasonSlug: string, tier: number) {
  const groups = await groupsOf(seasonSlug, tier);
  const withRoom = groups.find((g) => g._count.members < g.capacity);
  if (withRoom) return withRoom;

  try {
    return await prisma.leagueGroup.create({
      data: {
        seasonSlug,
        tier,
        name: groupName(tier, groups.length),
        capacity: GROUP_CAPACITY,
      },
      include: { _count: { select: { members: true } } },
    });
  } catch {
    const retry = await groupsOf(seasonSlug, tier);
    return retry.find((g) => g._count.members < g.capacity) ?? retry[retry.length - 1];
  }
}

export interface GroupLeaderRow {
  userId: string;
  stars: number;
  podScore: number;
  position: number;
  joinedAtMs: number;
}

/**
 * A group's leaderboard — the same ordering the queue's positionInGroup uses,
 * so a member's position never disagrees between the two surfaces: stars
 * desc, ties broken by join order.
 *
 * podScore aggregates a member's pod scores across every match in this group,
 * which is the running group competition the pods feed.
 */
export async function groupLeaderboard(groupId: string): Promise<GroupLeaderRow[]> {
  const [members, states, podSums] = await Promise.all([
    prisma.leagueGroupMember.findMany({
      where: { groupId },
      orderBy: { joinedAt: "asc" },
      select: { userId: true, joinedAt: true },
    }),
    prisma.rankState.findMany({
      where: { groupId },
      select: { userId: true, stars: true },
    }),
    prisma.podMember.groupBy({
      by: ["userId"],
      where: { match: { groupId } },
      _sum: { score: true },
    }),
  ]);

  const starsOf = new Map(states.map((s) => [s.userId, s.stars]));
  const podOf = new Map(podSums.map((p) => [p.userId, p._sum.score ?? 0]));

  const ordered = members
    .map((m) => ({
      userId: m.userId,
      stars: starsOf.get(m.userId) ?? 0,
      podScore: podOf.get(m.userId) ?? 0,
      joinedAtMs: m.joinedAt.getTime(),
    }))
    .sort((a, b) => (b.stars !== a.stars ? b.stars - a.stars : a.joinedAtMs - b.joinedAtMs));

  return ordered.map((row, i) => ({ ...row, position: i + 1 }));
}
