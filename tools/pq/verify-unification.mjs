#!/usr/bin/env node
/**
 * tools/pq/verify-unification.mjs — the database half of the ONE-count guard.
 *
 * Runs READ-ONLY (SELECT/COUNT only) against production and fails loudly if the
 * unification is not complete: for every live board, every question inside its
 * own {code}-* topic tree must carry an active board tag (so the blueprint
 * manifest can actually serve it), and the per-topic numbers must agree with
 *  the tree the board page renders. Tags that still point at master-* topics
 *  are reported as information — the master curriculum's rows are the SOURCE
 *  copies the board trees were duplicated from, students still study them, and
 *  deleting them would be destructive work, which belongs to the orchestrator
 *  alone.
 *
 * The APPLICATION surfaces are guarded structurally by tests/one-count.test.mjs;
 * the HTTP surfaces are guarded by tools/audit-counts.mjs (agent 7's lane).
 * This tool is the bridge: it proves the database agrees with both.
 *
 * Usage:
 *   DATABASE_URL="postgresql://…:6543/postgres?pgbouncer=true&connection_limit=1" \
 *     node tools/pq/verify-unification.mjs
 *   node tools/pq/verify-unification.mjs --json
 */

import { PrismaClient } from "../../node_modules/@prisma/client/index.js";

const JSON_OUT = process.argv.includes("--json");
const LIVE_BOARDS = ["jamb", "waec", "neco"];

/**
 * The unified end-state, machine-verified against production on 2026-10-21:
 * jamb 6,000 (12 subjects x 500) · waec 343 (330 duplicated into the waec tree
 * + 13 in-tree) · neco 113 (duplicated into the empty neco tree). If a future
 * content pass changes a board's bank deliberately, bump this table in the
 * same commit.
 */
const EXPECTED = { jamb: 6000, waec: 343, neco: 113 };

if (!process.env.DATABASE_URL) {
  console.error(
    "DATABASE_URL is not set. Use the Supabase pooler with pgbouncer params, e.g.\n" +
      '  DATABASE_URL="postgresql://…:6543/postgres?pgbouncer=true&connection_limit=1" \\\n' +
      "    node tools/pq/verify-unification.mjs"
  );
  process.exit(1);
}

const prisma = new PrismaClient();
const lit = (s) => {
  const v = String(s);
  if (!/^[A-Za-z0-9._:-]+$/.test(v)) throw new Error(`unsafe SQL literal: ${v}`);
  return `'${v}'`;
};

/** Read-only: EVERY statement this file runs is a SELECT. */
function assertReadOnly(sql) {
  const upper = sql.trim().toUpperCase();
  if (!upper.startsWith("SELECT")) throw new Error(`this tool is read-only, refusing: ${sql.slice(0, 60)}`);
}

async function query(sql) {
  assertReadOnly(sql);
  const rows = await prisma.$queryRawUnsafe(sql);
  return (rows ?? []).map((r) => {
    const out = {};
    for (const [k, v] of Object.entries(r)) out[k] = typeof v === "bigint" ? Number(v) : v;
    return out;
  });
}

/** The board's own tree via parent edges — the same walk src/lib/board-bank.ts does. */
async function treeIds(code) {
  const root = await prisma.topic.findFirst({
    where: { domain: "highschool", id: code },
    select: { id: true },
  });
  if (!root) return [];
  const subjects = await prisma.topic.findMany({
    where: { domain: "highschool", parentId: root.id },
    select: { id: true },
  });
  const children = subjects.length
    ? await prisma.topic.findMany({
        where: { parentId: { in: subjects.map((s) => s.id) } },
        select: { id: true },
      })
    : [];
  return [root.id, ...subjects.map((s) => s.id), ...children.map((c) => c.id)];
}

async function checkBoard(slug) {
  const exam = await prisma.examination.findFirst({
    where: { domain: "highschool", slug: { equals: slug, mode: "insensitive" } },
    select: { id: true, code: true, name: true },
  });
  if (!exam) return { slug, ok: false, problems: [`no Examination row for ${slug}`] };

  const code = exam.code.toLowerCase();
  const ids = await treeIds(code);
  if (ids.length === 0) return { slug, ok: false, problems: [`no ${code}-* topic tree`] };
  const inList = ids.map(lit).join(", ");

  const totals = await query(`
    SELECT
      (SELECT count(*) FROM "Question" q WHERE q."topicId" IN (${inList})) AS tree_total,
      (SELECT count(*) FROM "Question" q WHERE q."topicId" IN (${inList})
         AND q.id IN (SELECT t."questionId" FROM "QuestionBoardTag" t
                      WHERE t."examinationId" = ${lit(exam.id)} AND t.tier <> 'NOT_EXAMINED')) AS tagged_in_tree,
      (SELECT count(*) FROM "QuestionBoardTag" t WHERE t."examinationId" = ${lit(exam.id)}
         AND t.tier <> 'NOT_EXAMINED') AS active_tags,
      (SELECT count(*) FROM "QuestionBoardTag" t WHERE t."examinationId" = ${lit(exam.id)}
         AND t."questionId" NOT IN (SELECT q.id FROM "Question" q WHERE q."topicId" IN (${inList})))
        AS stale_tags_outside_tree`);

  const perTopic = await query(`
    SELECT q."topicId" AS topic_id, count(q.id) AS tree_count,
           count(q.id) FILTER (WHERE q.id IN (
             SELECT t."questionId" FROM "QuestionBoardTag" t
             WHERE t."examinationId" = ${lit(exam.id)} AND t.tier <> 'NOT_EXAMINED')) AS tagged_count
    FROM "Question" q
    WHERE q."topicId" IN (${inList})
    GROUP BY q."topicId" HAVING count(q.id) <> count(q.id) FILTER (WHERE q.id IN (
             SELECT t."questionId" FROM "QuestionBoardTag" t
             WHERE t."examinationId" = ${lit(exam.id)} AND t.tier <> 'NOT_EXAMINED'))`);

  const t = totals[0] ?? {};
  const treeTotal = Number(t.tree_total ?? 0);
  const taggedInTree = Number(t.tagged_in_tree ?? 0);
  const activeTags = Number(t.active_tags ?? 0);
  const stale = Number(t.stale_tags_outside_tree ?? 0);

  const problems = [];
  if (treeTotal !== taggedInTree) {
    problems.push(`${treeTotal - taggedInTree} question(s) in the ${code} tree carry no active tag — the blueprint manifest cannot serve them`);
  }
  for (const row of perTopic) {
    problems.push(`topic ${row.topic_id}: tree ${row.tree_count} ≠ tagged ${row.tagged_count}`);
  }
  const expected = EXPECTED[slug];
  if (expected != null && treeTotal !== expected) {
    problems.push(`tree total ${treeTotal} ≠ the verified unified end-state ${expected} (if content changed deliberately, update EXPECTED)`);
  }

  return {
    slug,
    ok: problems.length === 0,
    treeTopics: ids.length,
    treeTotal,
    taggedInTree,
    activeTags,
    staleTagsOutsideTree: stale,
    problems,
  };
}

async function main() {
  const results = [];
  for (const slug of LIVE_BOARDS) results.push(await checkBoard(slug));
  await prisma.$disconnect();

  if (JSON_OUT) {
    console.log(JSON.stringify({ ok: results.every((r) => r.ok), boards: results }, null, 2));
    process.exit(results.every((r) => r.ok) ? 0 : 1);
  }

  console.log("UNIFICATION VERIFY (read-only) — one count per board, everywhere\n");
  for (const r of results) {
    const line =
      `${r.slug.padEnd(6)} treeTopics=${String(r.treeTopics ?? "-").padStart(3)} · treeTotal=${String(r.treeTotal ?? "-").padStart(5)} · ` +
      `taggedInTree=${String(r.taggedInTree ?? "-").padStart(5)} · activeTags=${String(r.activeTags ?? "-").padStart(5)} · ` +
      `staleTagsOutsideTree=${String(r.staleTagsOutsideTree ?? "-").padStart(4)}`;
    console.log(`${r.ok ? "PASS" : "FAIL"}  ${line}`);
    for (const p of r.problems ?? []) console.log(`      · ${p}`);
  }
  const failed = results.filter((r) => !r.ok).length;
  console.log(
    failed === 0
      ? "\nEvery tree question is tagged and servable; per-topic numbers agree; totals match the verified end-state."
      : `\n${failed} board(s) FAIL — the unification is incomplete (re-run tools/pq/unify-boards.mjs --apply).`
  );
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(async (e) => {
  console.error(e.message || e);
  await prisma.$disconnect();
  process.exit(1);
});
