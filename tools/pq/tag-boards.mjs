#!/usr/bin/env node
/**
 * tag-boards.mjs — ONE taxonomy for the live exam boards (round 3 unification).
 *
 * The JAMB experience previously ran on three inconsistent sources:
 *   /api/questions + /highschool/practice/[exam]  → board-TAGGED questions only
 *   /cbt                                          → the {board}-* TOPIC TREE (6,000)
 *   /highschool/exams/[board]                     → counted 0, "papers being digitized"
 *
 * This pass makes them ONE question bank: every Question whose topicId sits in
 * a live board's topic tree gets a QuestionBoardTag row
 *   { examinationId: <board>, tier: "CORE", paperIds: [<first MCQ paper>] }
 * which is exactly how the cross-board CORE pass in prisma/seed-exam-boards.ts
 * (and its resume guard) tagged the legacy curriculum questions.
 *
 * Boards covered: jamb, waec, neco (the three LIVE boards in src/lib/exam-bank.ts).
 * Preparing boards are never touched — they have no verified blueprint papers.
 *
 * SAFETY (repo rules: additive + idempotent only, never destructive):
 *   - A question that ALREADY carries a tag for this board is left exactly as it
 *     is (tier and paperIds included). The NOT_EXAMINED exclusion sample and the
 *     cross-board CORE tags therefore survive untouched.
 *   - Questions outside the board's own {code}-* topic tree are never touched.
 *   - No UPDATE/DELETE statements exist in this file. Re-runs converge to zero.
 *
 * Usage:
 *   DATABASE_URL="postgresql://…:6543/postgres?pgbouncer=true&connection_limit=1" \
 *     node tools/pq/tag-boards.mjs                 # dry-run first, always
 *     node tools/pq/tag-boards.mjs --dry-run
 *     node tools/pq/tag-boards.mjs --apply
 *     node tools/pq/tag-boards.mjs --apply --boards jamb
 */

import { randomUUID } from "node:crypto";
import { PrismaClient } from "../../node_modules/@prisma/client/index.js";

const DRY_RUN = !process.argv.includes("--apply");
const onlyBoards = (() => {
  const i = process.argv.indexOf("--boards");
  if (i === -1) return null;
  const raw = process.argv[i + 1];
  return raw ? raw.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean) : null;
})();

/** The live boards, in registry order (src/lib/exam-bank.ts). */
const LIVE_BOARDS = ["jamb", "waec", "neco"];

const lit = (s) => {
  const v = String(s);
  if (!/^[A-Za-z0-9._:-]+$/.test(v)) throw new Error(`unsafe SQL literal: ${v}`);
  return `'${v}'`;
};
const prefix = (code) => `${code}-`;

if (!process.env.DATABASE_URL) {
  console.error(
    "DATABASE_URL is not set. Use the Supabase pooler with pgbouncer params, e.g.\n" +
      '  DATABASE_URL="postgresql://…:6543/postgres?pgbouncer=true&connection_limit=1" \\\n' +
      "    node tools/pq/tag-boards.mjs --apply"
  );
  process.exit(1);
}

const prisma = new PrismaClient();

/** First paper (by sequence) that admits MCQs — every objective question serves it. */
function firstMcqPaper(papers) {
  return (
    papers
      .slice()
      .sort((a, b) => a.sequence - b.sequence)
      .find((p) => Array.isArray(p.questionTypes) && p.questionTypes.map(String).includes("MCQ")) ?? null
  );
}

async function boardReport(slug) {
  const rows = await prisma.$queryRawUnsafe(
    `SELECT e.id, e.slug, e.code,
            (SELECT count(*) FROM "QuestionBoardTag" t WHERE t."examinationId" = e.id) AS tags,
            (SELECT count(DISTINCT q."topicId") FROM "Question" q
              JOIN "QuestionBoardTag" t2 ON t2."questionId" = q.id
              WHERE t2."examinationId" = e.id) AS tagged_topics,
            (SELECT count(*) FROM "Topic" tp WHERE tp.id LIKE ${lit(prefix(slug) + "%")}) AS tree_topics`
  );
  return rows[0] ?? null;
}

async function tagBoard(slug) {
  const exam = await prisma.examination.findFirst({
    where: { domain: "highschool", slug: { equals: slug, mode: "insensitive" } },
    select: { id: true, slug: true, code: true, name: true },
  });
  if (!exam) {
    console.log(`${slug.padEnd(8)} SKIPPED — no Examination row`);
    return;
  }

  const treePrefix = prefix(exam.code);
  const papers = await prisma.examinationPaper.findMany({
    where: { examinationId: exam.id },
    orderBy: { sequence: "asc" },
    select: { paperId: true, sequence: true, questionTypes: true },
  });
  const paper = firstMcqPaper(papers);
  if (!paper) {
    console.log(`${slug.padEnd(8)} SKIPPED — no blueprint paper carries MCQs`);
    return;
  }

  // The board's own topic tree, and every question sitting inside it.
  const treeTopics = await prisma.topic.findMany({
    where: { id: { startsWith: treePrefix } },
    select: { id: true },
  });
  const topicIds = treeTopics.map((t) => t.id);
  if (topicIds.length === 0) {
    console.log(`${slug.padEnd(8)} SKIPPED — no ${treePrefix}* topic tree`);
    return;
  }

  const treeQuestionIds = await prisma.question.findMany({
    where: { topicId: { in: topicIds } },
    select: { id: true },
  });

  const alreadyTagged = new Set(
    (
      await prisma.questionBoardTag.findMany({
        where: { examinationId: exam.id, questionId: { in: treeQuestionIds.map((q) => q.id) } },
        select: { questionId: true, tier: true },
      })
    ).map((t) => t.questionId)
  );
  const notExamined = new Set(
    (
      await prisma.questionBoardTag.findMany({
        where: { examinationId: exam.id, tier: "NOT_EXAMINED", questionId: { in: treeQuestionIds.map((q) => q.id) } },
        select: { questionId: true },
      })
    ).map((t) => t.questionId)
  );

  const toCreate = treeQuestionIds.filter((q) => !alreadyTagged.has(q.id)).map((q) => q.id);

  console.log(
    `${slug.padEnd(8)} tree=${topicIds.length} topics · treeQuestions=${treeQuestionIds.length}` +
      ` · alreadyTagged=${alreadyTagged.size} · toTag=${toCreate.length}` +
      ` · paper=${paper.paperId} (${papers.length} blueprint papers)`
  );
  if (notExamined.size > 0) console.log(`          preserving ${notExamined.size} NOT_EXAMINED exclusion sample(s) — untouched`);

  if (DRY_RUN || toCreate.length === 0) return;

  let inserted = 0;
  // paperIds is a Json column — cast to whatever this database actually uses.
  const colRows = await prisma.$queryRawUnsafe(
    `SELECT data_type FROM information_schema.columns
      WHERE table_name = 'QuestionBoardTag' AND column_name = 'paperIds'`
  );
  const dataType = String(colRows[0]?.data_type ?? "jsonb").toLowerCase();
  if (dataType !== "json" && dataType !== "jsonb") throw new Error(`unexpected paperIds column type: ${dataType}`);
  const paperIdsCast = `${JSON.stringify([paper.paperId])}::${dataType}`;
  for (let i = 0; i < toCreate.length; i += 500) {
    const chunk = toCreate.slice(i, i + 500);
    const rows = chunk
      .map((qid) => `(${lit(randomUUID())}, ${lit(qid)}, ${lit(exam.id)}, 'CORE', ${paperIdsCast}, now())`)
      .join(",");
    const res = await prisma.$executeRawUnsafe(
      `INSERT INTO "QuestionBoardTag" (id, "questionId", "examinationId", tier, "paperIds", "createdAt")
       VALUES ${rows}
       ON CONFLICT ("questionId", "examinationId") DO NOTHING`
    );
    inserted += res;
  }
  console.log(`          inserted ${inserted} CORE tags → ${paper.paperId}`);

  const after = await boardReport(slug);
  if (after) {
    console.log(
      `          now: tags=${after.tags} across ${after.tagged_topics} topics` +
        ` (tree has ${after.tree_topics} topics)`
    );
  }
}

async function main() {
  const boards = onlyBoards ?? LIVE_BOARDS;
  console.log(DRY_RUN ? "DRY RUN — no writes (pass --apply to write)" : "APPLY — additive tagging pass");
  for (const slug of boards) {
    if (!LIVE_BOARDS.includes(slug)) {
      console.log(`${slug.padEnd(8)} SKIPPED — not a live board (preparing boards are never tagged)`);
      continue;
    }
    await tagBoard(slug);
  }
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e.message || e);
  await prisma.$disconnect();
  process.exit(1);
});
