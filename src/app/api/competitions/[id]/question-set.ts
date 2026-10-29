import prisma from "@/lib/db";
import type { AppDomain } from "@prisma/client";

/**
 * src/app/api/competitions/[id]/question-set.ts — the Speed Cup paper.
 *
 * The set is DERIVED, never stored: every call re-computes the identical list
 * from the competition id, so the session racers play and the grader marks
 * cannot drift apart, and there is no answer key at rest to leak. A seeded
 * shuffle (FNV-1a hash of the id → mulberry32 → Fisher-Yates) makes the draw
 * byte-identical on every request, restart and deployment.
 *
 * The client-facing shape is safe by construction — options and hint only.
 * correctAnswer / explanation are read server-side inside /submit, AFTER the
 * clock has started: the answer key never crosses the wire before a submit.
 */

/** Cups run 20 questions; a thin bank simply runs shorter (min(20, available)). */
export const SPEED_CUP_QUESTIONS = 20;

/** Speed Cup clock: 45 minutes (FORMAT_META advertises the 30–120 range). */
export const SPEED_CUP_DURATION_MINUTES = 45;

export interface CupQuestion {
  id: string;
  questionText: string;
  options: string[];
  hint: string | null;
  difficulty: string;
}

/** The slice of a Competition this module needs — keeps callers simple. */
export interface CupBankRef {
  id: string;
  domain: AppDomain;
  subjectSlug: string | null;
}

/** FNV-1a: a tiny, deterministic string hash — the draw's seed. */
function hashId(value: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 — the seeded PRNG that drives the cup draw. */
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

/**
 * The topic and every descendant id — the same tree walk /api/questions relies
 * on, looped per level so any depth works. A subject slug may point at a board
 * root ("jamb"), a subject ("jamb-biology") or a leaf topic; a cup scoped to a
 * subject draws its questions from that subject's whole subtree.
 */
async function topicTreeIds(rootId: string, domain: AppDomain): Promise<string[]> {
  const ids = [rootId];
  let frontier = [rootId];
  while (frontier.length > 0) {
    const children = await prisma.topic.findMany({
      where: { domain, parentId: { in: frontier } },
      select: { id: true },
    });
    const next = children.map((c) => c.id).filter((id) => !ids.includes(id));
    if (next.length === 0) break;
    ids.push(...next);
    frontier = next;
  }
  return ids;
}

/**
 * The deterministic cup question set for a competition.
 *
 * Scoped by subjectSlug when set (topic by slug, then its tree descendants);
 * otherwise the whole highschool mcq bank. Same id in → same set out, on every
 * call, for every racer — nothing about the draw depends on request order,
 * request count or wall-clock time.
 */
export async function buildCupQuestionSet(cup: CupBankRef): Promise<CupQuestion[]> {
  let topicIds: string[] | null = null;
  if (cup.subjectSlug) {
    const topic = await prisma.topic.findFirst({
      where: { domain: cup.domain, slug: cup.subjectSlug },
      select: { id: true },
    });
    if (topic) topicIds = await topicTreeIds(topic.id, cup.domain);
  }

  // Candidate ids are pulled ordered by id, so the pool is itself stable; the
  // seeded draw then picks from it. Ids only at this stage keeps the scan cheap.
  let pool: string[] | null = null;
  if (topicIds && topicIds.length > 0) {
    pool = (
      await prisma.question.findMany({
        where: { domain: cup.domain, type: "mcq", topicId: { in: topicIds } },
        select: { id: true },
        orderBy: { id: "asc" },
      })
    ).map((q) => q.id);
  }
  if (!pool || pool.length === 0) {
    // No subject scope, or a subject with no bank: fall back to the whole
    // domain so the cup is playable rather than empty.
    pool = (
      await prisma.question.findMany({
        where: { domain: cup.domain, type: "mcq" },
        select: { id: true },
        orderBy: { id: "asc" },
      })
    ).map((q) => q.id);
  }

  const count = Math.min(SPEED_CUP_QUESTIONS, pool.length);
  if (count === 0) return [];

  const drawn = shuffle(pool.slice(), mulberry32(hashId(cup.id))).slice(0, count);

  const rows = await prisma.question.findMany({
    where: { id: { in: drawn } },
    select: {
      id: true,
      questionText: true,
      options: true,
      hint: true,
      difficulty: true,
    },
  });

  // Preserve the drawn order regardless of how the database returns rows.
  const byId = new Map(rows.map((q) => [q.id, q]));
  return drawn
    .map((id) => byId.get(id))
    .filter((q): q is (typeof rows)[number] => Boolean(q))
    .map((q) => ({
      id: q.id,
      questionText: q.questionText,
      options: Array.isArray(q.options) ? q.options.map(String) : [],
      hint: q.hint,
      difficulty: q.difficulty,
    }));
}
