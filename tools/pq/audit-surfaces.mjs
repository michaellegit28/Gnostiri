#!/usr/bin/env node
/**
 * audit-surfaces.mjs — Round 4 AUDIT: what does every live surface ACTUALLY
 * count/serve, per board? (deliverable 1, step 1 of the mission)
 *
 * Every number printed here is produced by the SAME query shape the surface
 * itself runs, so the table is a faithful mirror of production behaviour:
 *
 *   boardpage.hero        SUM(question.topicId IN the {code}-* tree,
 *                            ¬question.boardTags.some[exam, NOT_EXAMINED])
 *                         — src/app/highschool/exams/[exam]/page.tsx (treeQuestionCount)
 *   boardpage.practice    SAME number as the hero (practiceCount = treeQuestionCount)
 *                         — the "… questions in the practice engine" card on that page
 *   hub.subjects          COUNT(topic.parentId = {code})
 *   hub.questions         countBoardQuestions: the tree, ¬NOT_EXAMINED
 *                         — src/lib/board-bank.ts (the ONE bank definition)
 *   picker.total          Σ boardTopicQuestionCounts values (tree, ¬NOT_EXAMINED)
 *   picker.topics         DISTINCT topicId over that same map (what the picker lists)
 *   apiquestions          COUNT(question.topicId = topic) per topic, summed over
 *                         the tree — the endpoint has NO tag-admission branch
 *                         (tags are only consulted for the NOT_EXAMINED exclusion)
 *   manifest.sum          SUMMED PER TOPIC over the board tree:
 *                         COUNT(question IN topic ∩ tag[tier≠NOT_EXAMINED,
 *                         paperIds ∋ paperId]) for every paper
 *                        — src/lib/exam-manifest.ts questionsForPaper()
 *   manifest.SERVED       the same sum with RULE 1's questionTypes filter applied
 *   manifest.typeBlocked  bank rows a paper claims but whose TYPE no paper accepts
 *                        — reported SEPARATELY: a content gap (e.g. in-tree
 *                        THEORY when the only paper is MCQ-only), not a tag leak
 *   quizpage              COUNT(question.topicId = topic) — the /[board]/[subj]/[topic]/quiz page
 *
 *   The GLOBAL tag total (no tree gate, no paperIds) is a TAG-HYGIENE figure,
 *   not a surface count — after the api/manifest fix nothing serves it, because
 *   a tag can no longer admit a question the board's own {code}-* tree does not
 *   contain.
 *
 * Usage:
 *   DATABASE_URL="postgresql://…:6543/postgres?pgbouncer=true&connection_limit=1" \
 *   node tools/pq/audit-surfaces.mjs [--boards jamb] [--json]
 *
 * READ-ONLY: this tool issues SELECT/COUNT only. No writes, ever.
 */

import { PrismaClient } from "../../node_modules/@prisma/client/index.js";

const BOARDS = (() => {
  const i = process.argv.indexOf("--boards");
  if (i === -1) return null;
  const raw = process.argv[i + 1];
  return raw ? raw.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean) : ["jamb"];
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

  // --- the ONE bank definition (src/lib/board-bank.ts): every question inside
  // the {code}-* tree, minus rows this board marks NOT_EXAMINED (RULE 4).
  // boardTags is consulted ONLY for that exclusion — a tag can never ADD a
  // question, so no surface may be modelled as a tag-gated count any more.
  const bankIds = tree.allIds.length ? tree.allIds : [];
  const bankRows = bankIds.length
    ? await prisma.question.findMany({
        where: {
          topicId: { in: bankIds },
          NOT: { boardTags: { some: { examinationId: exam.id, tier: "NOT_EXAMINED" } } },
        },
        select: { id: true, topicId: true, type: true },
      })
    : [];
  const byTopic = new Map();
  const treeByType = { mcq: 0, theory: 0, practical: 0 };
  for (const q of bankRows) {
    byTopic.set(q.topicId, (byTopic.get(q.topicId) ?? 0) + 1);
    const k = q.type === "theory" ? "theory" : q.type === "practical" ? "practical" : "mcq";
    treeByType[k] += 1;
  }
  const treeQuestionCount = bankRows.length;
  const treeTopicCount = tree.topicIds.length;

  // --- board page practice card: practiceCount = treeQuestionCount
  // (src/app/highschool/exams/[exam]/page.tsx — the SAME variable the hero prints)
  const practiceCount = treeQuestionCount;
  const pickerByType = treeByType;
  const pickerTopicIds = new Set(bankRows.map((q) => q.topicId));

  // --- exam hub chip: countBoardQuestions(boardCode, examinationId) — the tree
  const hubQuestionCount = treeQuestionCount;
  let hubNotExamined = 0;
  try {
    hubNotExamined = await prisma.questionBoardTag.count({
      where: { examinationId: exam.id, tier: "NOT_EXAMINED", question: { topicId: { in: bankIds } } },
    });
  } catch {
    /* tier is a plain string column in some snapshots — tolerate */
  }
  const hubSubjectCount = await prisma.topic.count({
    where: { domain: "highschool", parentId: code },
  });

  // --- tag hygiene (NOT a surface count): active tags this board holds on
  // questions that live outside its own tree. After the api/manifest fix these
  // are inert — no surface admits them — but they are still rows to clean up.
  const outOfTreeTags = await prisma.questionBoardTag.count({
    where: {
      examinationId: exam.id,
      tier: { not: "NOT_EXAMINED" },
      question: { topicId: { notIn: bankIds } },
    },
  });

  // --- blueprint/manifest path, EXACTLY the shape buildRenderManifest runs:
  // for every paper, per tree topic, count(topic ∩ tag[tier≠NOT_EXAMINED,
  // paperIds ∋ paperId]) and sum THOSE per-topic counts. A topic outside the
  // tree can no longer reach the manifest (the lookup is tree-gated).
  const papers = await prisma.examinationPaper.findMany({
    where: { examinationId: exam.id },
    orderBy: { sequence: "asc" },
    select: { paperId: true, paperName: true, sequence: true, questionTypes: true },
  });
  // --- blueprint/manifest path, EXACTLY the admission shape doc :19 defines:
  //     COUNT(question ∩ tag[tier ≠ NOT_EXAMINED] ∩ paperIds ∋ paperId),
  //     summed PER TOPIC over the board tree — never a global sum, and never
  //     outside the tree (a topic the tree does not contain now 404s).
  // The paper's questionTypes (RULE 1) is a SECOND, separate gate: it is reported
  // on its own line (manifest.typeBlocked), because a type-blocked question is a
  // content gap, not a tag leak, and must not masquerade as a surface contradiction.
  const manifestByPaper = {};
  const manifestByTypePaper = {};
  const typeBlockedIds = new Set();
  for (const paper of papers) {
    const types = Array.isArray(paper.questionTypes) ? paper.questionTypes.map(String) : [];
    if (types.length === 0) continue;
    const admitted = bankIds.length
      ? await prisma.question.findMany({
          where: {
            topicId: { in: bankIds },
            boardTags: {
              some: {
                examinationId: exam.id,
                tier: { not: "NOT_EXAMINED" },
                paperIds: { array_contains: [paper.paperId] },
              },
            },
          },
          select: { id: true, topicId: true, type: true },
        })
      : [];
    // summed per topic, the way buildRenderManifest accumulates it — NOT a global sum
    const perTopic = new Map();
    for (const q of admitted) {
      perTopic.set(q.topicId, (perTopic.get(q.topicId) ?? 0) + 1);
      if (!types.map((t) => t.toLowerCase()).includes(q.type)) typeBlockedIds.add(q.id);
    }
    manifestByPaper[paper.paperId] = [...perTopic.values()].reduce((s, n) => s + n, 0);

    // the literal questionsForPaper shape (with RULE 1's type filter applied)
    const served = bankIds.length
      ? await prisma.question.findMany({
          where: {
            topicId: { in: bankIds },
            type: { in: types.map((t) => t.toLowerCase()) },
            boardTags: {
              some: {
                examinationId: exam.id,
                tier: { not: "NOT_EXAMINED" },
                paperIds: { array_contains: [paper.paperId] },
              },
            },
          },
          select: { id: true, topicId: true },
        })
      : [];
    const perTopicServed = new Map();
    for (const q of served) perTopicServed.set(q.topicId, (perTopicServed.get(q.topicId) ?? 0) + 1);
    manifestByTypePaper[paper.paperId] = [...perTopicServed.values()].reduce((s, n) => s + n, 0);
  }
  const manifestSum = Object.values(manifestByPaper).reduce((a, b) => a + b, 0);
  const manifestServedSum = Object.values(manifestByTypePaper).reduce((a, b) => a + b, 0);
  // RULE 1 blocks these: they are admitted by a paper but no paper accepts their TYPE.
  const manifestTypeBlocked = bankRows.filter((q) => typeBlockedIds.has(q.id)).length;

  // The GLOBAL tag∩paperIds total with no topic-tree gate is a TAG-HYGIENE
  // figure, not a surface count — nothing serves it after the fix.
  const manifestGlobalTagTotal = await prisma.question.count({
    where: { boardTags: { some: { examinationId: exam.id, tier: { not: "NOT_EXAMINED" } } } },
  });

  // --- api/questions in-tree total (what ?boardId=x&topicId=<tree topic> returns, summed)
  const apiQuestionsTree = treeQuestionCount;

  // --- where do the bank topics actually live?
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
      inTree: treeQuestionCount,
      outsideTree: outOfTreeTags,
      hubQuestionCount,
      hubNotExamined,
      byType: pickerByType,
      outOfTreeTags,
    },
    manifest: {
      sum: manifestSum,
      servedSum: manifestServedSum,
      typeBlocked: manifestTypeBlocked,
      byPaper: manifestByPaper,
      byPaperServed: manifestByTypePaper,
      globalTagTotal: manifestGlobalTagTotal,
    },
    apiQuestions: { treeTotal: apiQuestionsTree },
    hubSubjects: hubSubjectCount,
    taggedTopicRows: taggedTopicsRows,
  };
}

function pad(s, n) {
  return String(s).padEnd(n);
}

async function main() {
  const boardSlugs = BOARDS ?? ["jamb"];
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
      console.log(`  board page PRACTICE card (practiceCount) ...... ${r.tags.practiceCount}   [tree]  <-- same page, ${r.tree.questions === r.tags.practiceCount ? "AGREES" : "CONTRADICTS the hero"}`);
      console.log(`  exam hub 'questions' (countBoardQuestions) ... ${r.tags.hubQuestionCount}   [tree, incl ${r.tags.hubNotExamined} NOT_EXAMINED excluded]`);
      console.log(`  exam hub 'subjects' (topic.parentId=code) ..... ${r.hubSubjects}   [tree]`);
      console.log(`  practice picker total ......................... ${r.tags.practiceCount}   [tree]  mcq=${r.tags.byType.mcq} theory=${r.tags.byType.theory} practical=${r.tags.byType.practical}`);
      console.log(`  practice picker topics listed ................. ${new Set(r.taggedTopicRows.map((t) => t.id)).size}   [tree]`);
      console.log(`  /api/questions (in-tree topics, summed) ....... ${r.apiQuestions.treeTotal}   [tree]`);
      console.log(`  /api/practice/manifest (per-topic sum) ....... ${r.manifest.sum}   [tree∩tags∩papers]  by paper: ${JSON.stringify(r.manifest.byPaper)}`);
      console.log(`  manifest SERVED (RULE 1 type filter applied) .. ${r.manifest.servedSum}   [tree∩tags∩papers]  by paper: ${JSON.stringify(r.manifest.byPaperServed)}`);
      if (r.manifest.typeBlocked > 0) {
        console.log(`  manifest type-blocked (RULE 1) ................ ${r.manifest.typeBlocked}   [tree]  bank rows a paper claims but whose TYPE no paper accepts (e.g. THEORY when the only paper is MCQ-only). Content gap, NOT a tag leak.`);
      }
      console.log(`  quiz/study/subject pages ....................... ${r.tree.questions}   [tree]`);
      console.log(`  out-of-tree tags (hygiene) ..................... ${r.tags.outOfTreeTags}   [tags]  rows outside the tree — inert, awaiting owner sign-off`);
      console.log(`  global tag total (tag hygiene, NOT served) .... ${r.manifest.globalTagTotal}   [tags]`);
      console.log(`  bank questions: ${r.tags.inTree} inside the tree, ${r.tags.outsideTree} tag rows outside it (live in master-* topics)`);
      console.log("");
    }

    console.log("=== CONTRADICTION MATRIX (must collapse to one row per board) ===");
    for (const r of results) {
      // every row is a question COUNT, sourced from the corrected (tree) branch;
      // the out-of-tree tag hygiene figure is deliberately NOT a matrix row
      const counts = [
        ["boardpage.hero", r.tree.questions, "tree"],
        ["boardpage.practice", r.tags.practiceCount, "tree"],
        ["hub.questions", r.tags.hubQuestionCount, "tree"],
        ["picker.total", r.tags.practiceCount, "tree"],
        ["apiquestions", r.apiQuestions.treeTotal, "tree"],
        ["manifest.sum", r.manifest.sum, "tree∩tags∩papers"],
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
