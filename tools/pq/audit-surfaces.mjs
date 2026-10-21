#!/usr/bin/env node
/**
 * audit-surfaces.mjs — Round 4 AUDIT: what does every live surface ACTUALLY
 * count/serve, per board? (deliverable 1, step 1 of the mission)
 *
 * Every number printed here is produced by the SAME query shape the surface
 * itself runs, so the table is a faithful mirror of production behaviour:
 *
 *   boardpage.hero        SUM(question.topicId IN {board}-{subj} ∪ {board}-{subj}-{topic})
 *                         — src/app/highschool/exams/[exam]/page.tsx (treeQuestionCount)
 *   boardpage.practice    COUNT(question.boardTags.some[exam, tier != NOT_EXAMINED])
 *                         — the "… questions in the practice engine" card on that page
 *   hub.subjects          COUNT(topic.parentId = {code})
 *   hub.questions         COUNT(QuestionBoardTag.examinationId = exam)   ← ALL tags
 *   picker.total          COUNT(question.boardTags.some[exam, tier != NOT_EXAMINED])
 *   picker.topics         same, grouped by topicId (what the picker lists)
 *   apiquestions          in-tree topic: COUNT(question.topicId = topic) (tree rule);
 *                         out-of-tree: tag rule. Rows = the sum over the tree.
 *   manifest.sum          COUNT(question ∩ tags ∩ paperIds array_contains paperId)
 *                         src/lib/exam-manifest.ts questionsForPaper()
 *   quizpage              COUNT(question.topicId = topic) — the /[board]/[subj]/[topic]/quiz page
 *
 * Usage:
 *   DATABASE_URL="postgresql://…:6543/postgres?pgbouncer=true&connection_limit=1" \
 *     node tools/pq/audit-surfaces.mjs [--boards jamb,waec,neco] [--json]
 *
 * READ-ONLY: this tool issues SELECT/COUNT only. No writes, ever.
 */

import { PrismaClient } from "../../node_modules/@prisma/client/index.js";

const BOARDS = (() => {
  const i = process.argv.indexOf("--boards");
  if (i === -1) return null;
  const raw = process.argv[i + 1];
  return raw ? raw.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean) : ["jamb", "waec", "neco"];
})();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set (Supabase pooler :6543 + ?pgbouncer=true&connection_limit=1).");
  process.exit(1);
}

const prisma = new PrismaClient();

/** The board's {code}-* topic tree: root -> subjects -> topics (as the app walks it). */
async function boardTree(code) {
  const root = await prisma.topic.findFirst({
    where: { domain: "highschool", id: code },
    select: { id: true },
  });
  if (!root) return { rootId: null, subjectIds: [], topicIds: [], allIds: [] };
  const subjects = await prisma.topic.findMany({
    where: { domain: "highschool", parentId: root.id },
    orderBy: { orderIndex: "asc" },
    select: { id: true, title: true },
  });
  const childTopics = await prisma.topic.findMany({
    where: { parentId: { in: subjects.map((s) => s.id) } },
    orderBy: { orderIndex: "asc" },
    select: { id: true, title: true, parentId: true },
  });
  const subjectIds = subjects.map((s) => s.id);
  const topicIds = childTopics.map((t) => t.id);
  return { rootId: root.id, subjects, childTopics, subjectIds, topicIds, allIds: [...subjectIds, ...topicIds] };
}

async function auditBoard(slug) {
  const exam = await prisma.examination.findFirst({
    where: { domain: "highschool", slug: { equals: slug, mode: "insensitive" } },
    select: { id: true, slug: true, code: true, name: true },
  });
  if (!exam) return null;
  const code = exam.code.toLowerCase();

  const tree = await boardTree(code);

  // --- tree-based counts (board page hero, subject page, quiz pages, /api/questions in-tree)
  const treeCounts = tree.allIds.length
    ? await prisma.question.groupBy({
        by: ["topicId"],
        where: { topicId: { in: tree.allIds } },
        _count: { _all: true },
      })
    : [];
  const byTopic = new Map(treeCounts.map((r) => [r.topicId, r._count._all]));
  const treeQuestionCount = treeCounts.reduce((s, r) => s + r._count._all, 0);
  const treeTopicCount = tree.topicIds.length;

  // --- tag-based counts (board page practice card, practice picker, api/questions out-of-tree)
  const tagged = await prisma.question.findMany({
    where: { boardTags: { some: { examinationId: exam.id, tier: { not: "NOT_EXAMINED" } } } },
    select: { id: true, topicId: true, type: true },
  });
  const practiceCount = tagged.length;
  const pickerTopicIds = new Set(tagged.map((q) => q.topicId));
  const pickerByType = tagged.reduce(
    (acc, q) => {
      const k = q.type === "theory" ? "theory" : q.type === "practical" ? "practical" : "mcq";
      acc[k] += 1;
      return acc;
    },
    { mcq: 0, theory: 0, practical: 0 }
  );

  // --- hub card: ALL QuestionBoardTag rows for this board (tier filter NOT applied)
  const hubQuestionCount = await prisma.questionBoardTag.count({ where: { examinationId: exam.id } });
  let hubNotExamined = 0;
  try {
    hubNotExamined = await prisma.questionBoardTag.count({ where: { examinationId: exam.id, tier: "NOT_EXAMINED" } });
  } catch {
    /* tier is a plain string column in some snapshots — tolerate */
  }
  const hubSubjectCount = await prisma.topic.count({
    where: { domain: "highschool", parentId: code },
  });

  // --- hard contradictions: same question counted as the board's on one surface, absent on another
  const taggedOutsideTree = tagged.filter((q) => !tree.allIds.includes(q.topicId)).length;
  const taggedInsideTree = practiceCount - taggedOutsideTree;

  // --- blueprint/manifest path: tag ∩ paperIds (src/lib/exam-manifest.ts)
  const papers = await prisma.examinationPaper.findMany({
    where: { examinationId: exam.id },
    orderBy: { sequence: "asc" },
    select: { paperId: true, paperName: true, sequence: true, questionTypes: true },
  });
  const manifestByPaper = {};
  for (const paper of papers) {
    const types = Array.isArray(paper.questionTypes) ? paper.questionTypes.map(String) : [];
    if (types.length === 0) continue;
    const n = await prisma.question.count({
      where: {
        type: { in: types.map((t) => t.toLowerCase()) },
        boardTags: { some: { examinationId: exam.id, tier: { not: "NOT_EXAMINED" }, paperIds: { array_contains: [paper.paperId] } } },
      },
    });
    manifestByPaper[paper.paperId] = n;
  }
  const manifestSum = Object.values(manifestByPaper).reduce((a, b) => a + b, 0);

  // --- api/questions in-tree total (what ?boardId=x&topicId=<tree topic> returns, summed)
  const apiQuestionsTree = treeQuestionCount;

  // --- where do the tagged questions actually live?
  const taggedTopicsRows = await prisma.topic.findMany({
    where: { id: { in: Array.from(pickerTopicIds) } },
    select: { id: true, title: true, parentId: true, slug: true },
  });

  return {
    board: slug,
    examId: exam.id,
    code,
    tree: {
      rootId: tree.rootId,
      subjects: tree.subjectIds.length,
      topics: treeTopicCount,
      questions: treeQuestionCount,
      emptyTopics: tree.topicIds.filter((id) => !(byTopic.get(id) > 0)).length,
    },
    tags: {
      practiceCount,
      inTree: taggedInsideTree,
      outsideTree: taggedOutsideTree,
      hubQuestionCount,
      hubNotExamined,
      byType: pickerByType,
    },
    manifest: { sum: manifestSum, byPaper: manifestByPaper },
    apiQuestions: { treeTotal: apiQuestionsTree },
    hubSubjects: hubSubjectCount,
    taggedTopicRows: taggedTopicsRows,
  };
}

function pad(s, n) {
  return String(s).padEnd(n);
}

async function main() {
  const boardSlugs = BOARDS ?? ["jamb", "waec", "neco"];
  const results = [];
  for (const slug of boardSlugs) {
    const r = await auditBoard(slug);
    if (r) results.push(r);
  }

  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log("\n=== SURFACE x BOARD AUDIT — live production numbers (read-only) ===\n");
    for (const r of results) {
      console.log(`${r.board.toUpperCase()}  (Examination.id=${r.examId}, code=${r.code})`);
      console.log(`  topic tree   : ${r.tree.subjects} subjects / ${r.tree.topics} topics (root ${r.tree.rootId}), ${r.tree.emptyTopics} empty topics`);
      console.log(`  tree questions total .......................... ${r.tree.questions}`);
      console.log(`  board page HERO count (treeQuestionCount) ..... ${r.tree.questions}   [tree]`);
      console.log(`  board page PRACTICE card (practiceCount) ...... ${r.tags.practiceCount}   [tags]  <-- same page, ${r.tree.questions === r.tags.practiceCount ? "AGREES" : "CONTRADICTS the hero"}`);
      console.log(`  exam hub 'questions' (all QuestionBoardTag) ... ${r.tags.hubQuestionCount}   [tags, incl ${r.tags.hubNotExamined} NOT_EXAMINED]`);
      console.log(`  exam hub 'subjects' (topic.parentId=code) ..... ${r.hubSubjects}   [tree]`);
      console.log(`  practice picker total ......................... ${r.tags.practiceCount}   [tags]  mcq=${r.tags.byType.mcq} theory=${r.tags.byType.theory} practical=${r.tags.byType.practical}`);
      console.log(`  practice picker topics listed ................. ${new Set(r.taggedTopicRows.map((t) => t.id)).size}`);
      console.log(`  /api/questions (in-tree topics, summed) ....... ${r.apiQuestions.treeTotal}   [tree]`);
      console.log(`  /api/practice/manifest (tag ∩ paperIds, sum) .. ${r.manifest.sum}   [tags∩papers]  by paper: ${JSON.stringify(r.manifest.byPaper)}`);
      console.log(`  quiz/study/subject pages ....................... ${r.tree.questions}   [tree]`);
      console.log(`  tagged questions: ${r.tags.inTree} inside the tree, ${r.tags.outsideTree} OUTSIDE it (live in master-* topics)`);
      console.log("");
    }

    console.log("=== CONTRADICTION MATRIX (must collapse to one row per board) ===");
    for (const r of results) {
      const counts = [
        ["boardpage.hero", r.tree.questions, "tree"],
        ["boardpage.practice", r.tags.practiceCount, "tags"],
        ["picker.total", r.tags.practiceCount, "tags"],
        ["apiquestions", r.apiQuestions.treeTotal, "tree"],
        ["manifest.sum", r.manifest.sum, "tags∩papers"],
        ["quizpages", r.tree.questions, "tree"],
      ];
      const distinct = new Set(counts.map((c) => c[1]));
      const verdict = distinct.size === 1 ? "ONE COUNT" : `${distinct.size} DIFFERENT COUNTS`;
      console.log(`${r.board.toUpperCase().padEnd(6)} ${verdict}`);
      if (distinct.size > 1) {
        for (const [name, n, src] of counts) console.log(`   ${pad(name + " = " + n, 34)} [${src}]`);
      }
    }
    console.log("");
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e.message || e);
  await prisma.$disconnect();
  process.exit(1);
});
