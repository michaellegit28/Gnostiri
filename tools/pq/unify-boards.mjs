#!/usr/bin/env node
/**
 * tools/pq/unify-boards.mjs — ONE taxonomy, ONE count, everywhere (round 4).
 *
 * The unification tool. Each live board's question bank is defined in exactly
 * one place — src/lib/board-bank.ts — as "every question inside the board's
 * own `{code}-*` topic tree". The application surfaces were switched onto that
 * definition in code; this tool makes the DATABASE agree, so no surface can
 * contradict another (the round-4 defect class: board page + /cbt + quiz +
 * /api/questions read the tree, the practice picker + manifest + hub read tags).
 *
 * WHAT IT DOES, per board:
 *
 *   jamb — the board page already serves 6,000 tree questions, but the jamb
 *          tree carries NO tags, so the blueprint/manifest practice path could
 *          not serve them. ONE bulk statement tags all 6,000 tree questions
 *          CORE with paperIds ["P1"] (INSERT … SELECT … ON CONFLICT DO NOTHING).
 *          The 1 NOT_EXAMINED tag survives untouched via DO NOTHING.
 *
 *   waec — its real content is 343 questions: 330 of them parked on master-*
 *          curriculum topics with no waec-* home, 13 already in the waec tree.
 *          Per the owner's round-4 decision (duplication, masters untouched):
 *          create the missing waec-* nodes (additive, titles copied from
 *          existing nodes — see createNodes), then ONE bulk INSERT … SELECT per
 *          (master source → waec target) mapping duplicating the 330 waec-tagged
 *          rows into the waec tree with deterministic ids (`<id>-waec`). The
 *          master curriculum keeps its rows; every correctness column is copied
 *          verbatim; one final statement copies the board tags onto the copies
 *          so the blueprint manifest serves them paper by paper.
 *
 *   neco — its 113 questions are the SAME PHYSICAL ROWS as 113 of WAEC's 343
 *          (verified in production: all 113 neco-tagged rows also carry a waec
 *          tag), and a question has ONE topicId — an UPDATE would remove them
 *          from WAEC's tree and break the ordered end-state (WAEC 343 / NECO
 *          113). So NECO's bank is duplicated into the empty neco-* tree the
 *          same way: ONE INSERT … SELECT per mapping, ids `<id>-neco`, plus one
 *          statement copying their board tags. Original rows and tags are left
 *          exactly as they are.
 *
 * SAFETY (repo rules: additive + idempotent only, destructive DB work is the
 * orchestrator's alone):
 *   - dry-run by default; --apply writes. Every statement is printed before it
 *     runs, so a human can read exactly what will happen.
 *   - ONE statement per mapping, each bulk over all rows: no per-row loops
 *     (a per-row script once hung a whole environment overnight).
 *   - No DELETE / DROP / TRUNCATE / ALTER / UPDATE appears anywhere — the
 *     whole pass is INSERT … ON CONFLICT DO NOTHING. Nothing is ever moved or
 *     modified, so no other agent's surface can regress (the master curriculum
 *     keeps all 330 rows students study from).
 *   - Idempotent by construction: duplicate ids are deterministic
 *     (`<id>-<board>`), so a second run matches zero rows and converges.
 *   - No invented text: every new node's title is copied from an existing node
 *     (jamb sibling → waec sibling → master source), verified at runtime.
 *
 * Usage:
 *   DATABASE_URL="postgresql://…:6543/postgres?pgbouncer=true&connection_limit=1" \
 *     node tools/pq/unify-boards.mjs                 # dry-run first, always
 *     node tools/pq/unify-boards.mjs --apply
 *     node tools/pq/unify-boards.mjs --apply --boards jamb
 */

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
/** Quoted SQL string for free text (titles copied from the curriculum). */
const sq = (s) => {
  const v = String(s);
  if (/[\0\n\r]/.test(v)) throw new Error(`unsafe SQL string literal: ${JSON.stringify(v)}`);
  return `'${v.replace(/'/g, "''")}'`;
};
const jsonLit = (arr) => `'${JSON.stringify(arr)}'::jsonb`;

if (!process.env.DATABASE_URL) {
  console.error(
    "DATABASE_URL is not set. Use the Supabase pooler with pgbouncer params, e.g.\n" +
      '  DATABASE_URL="postgresql://…:6543/postgres?pgbouncer=true&connection_limit=1" \\\n' +
      "    node tools/pq/unify-boards.mjs --apply"
  );
  process.exit(1);
}

const prisma = new PrismaClient();

// ─── topic tree (parent edges — the same walk src/lib/board-bank.ts does) ────

async function treeIds(code) {
  const root = await prisma.topic.findFirst({
    where: { domain: "highschool", id: code },
    select: { id: true },
  });
  if (!root) return {};
  const subjects = await prisma.topic.findMany({
    where: { domain: "highschool", parentId: root.id },
    orderBy: { orderIndex: "asc" },
    select: { id: true, title: true, orderIndex: true },
  });
  const children = subjects.length
    ? await prisma.topic.findMany({
        where: { parentId: { in: subjects.map((s) => s.id) } },
        select: { id: true, title: true, parentId: true, orderIndex: true },
      })
    : [];
  const ids = [root.id, ...subjects.map((s) => s.id), ...children.map((c) => c.id)];
  return { root, subjects, children, ids };
}

/**
 * New nodes per board: subject slug → { title (new subjects only),
 * topics: [{ slug, title }] }. Titles are copied from existing nodes and
 * RE-VERIFIED against the database by createNodes before anything is written:
 * jamb sibling → (neco: waec sibling) → the master source topic. "Full
 * syllabus practice" is the repo's own single-bucket convention (verified
 * against jamb-accounting-full-syllabus). The one text that exists nowhere
 * else — the waec-history subject label — is flagged verbatim in WAIVERS.
 * Subtitle-level detail: existing waec-* nodes keep their titles untouched;
 * the map reuses them, never renames them.
 */
const NEW_NODES = {
  waec: {
    mathematics: {
      topics: [
        { slug: "algebra-foundations", title: "Algebra Foundations" },
        { slug: "calculus", title: "Calculus" },
        { slug: "further-mathematics", title: "Further Mathematics" },
      ],
    },
    physics: {
      topics: [
        { slug: "fields-and-further-mechanics", title: "Fields and Further Mechanics" },
        { slug: "nuclear-and-quantum-physics", title: "Nuclear and Quantum Physics" },
      ],
    },
    chemistry: {
      topics: [
        { slug: "electrochemistry", title: "Electrochemistry" },
        { slug: "thermodynamics-and-kinetics", title: "Thermodynamics and Kinetics" },
      ],
    },
    biology: {
      topics: [
        { slug: "bioenergetics-and-biochemistry", title: "Bioenergetics & Biochemistry" },
        { slug: "human-physiology", title: "Human Physiology" },
        { slug: "plant-biology", title: "Plant Biology" },
      ],
    },
    accounting: { title: "Accounting", topics: [{ slug: "full-syllabus", title: "Full syllabus practice" }] },
    "business-studies": { title: "Business Studies", topics: [{ slug: "full-syllabus", title: "Full syllabus practice" }] },
    commerce: { title: "Commerce", topics: [{ slug: "full-syllabus", title: "Full syllabus practice" }] },
    economics: {
      title: "Economics",
      topics: [
        { slug: "macroeconomics", title: "Macroeconomics" },
        { slug: "microeconomics", title: "Microeconomics" },
      ],
    },
    history: {
      // WAIVER: "History" is the WASSCE subject label — History is not a JAMB
      // subject, so no sibling node carries the name. The five topics beneath
      // it are copied verbatim from the master curriculum titles.
      title: "History",
      topics: [
        { slug: "cold-war-era", title: "Cold War Era" },
        { slug: "decolonization-independence", title: "Decolonization & Independence" },
        { slug: "ib-world-history", title: "IB World History" },
        { slug: "regional-compulsory-history", title: "Regional Compulsory History" },
        { slug: "world-wars", title: "World Wars I & II" },
      ],
    },
  },
  neco: {
    biology: {
      topics: [
        { slug: "bioenergetics-and-biochemistry", title: "Bioenergetics & Biochemistry" },
        { slug: "human-physiology", title: "Human Physiology" },
        { slug: "plant-biology", title: "Plant Biology" },
      ],
    },
    chemistry: {
      topics: [
        { slug: "electrochemistry", title: "Electrochemistry" },
        { slug: "thermodynamics-and-kinetics", title: "Thermodynamics and Kinetics" },
      ],
    },
  },
};

const WAIVERS = new Set(["History"]);
const SINGLE_BUCKET_TITLE = "Full syllabus practice";

/** waec: master-* source topic → its waec-* target (existing or new node). */
const WAEC_MAP = [
  ["master-algebra-foundations", "waec-mathematics-algebra-foundations"],
  ["master-calculus", "waec-mathematics-calculus"],
  ["master-further-mathematics", "waec-mathematics-further-mathematics"],
  ["master-geometry-trigonometry", "waec-mathematics-trigonometry"],
  ["master-statistics-probability", "waec-mathematics-probability-and-statistics"],
  ["master-electricity-magnetism", "waec-physics-electric-circuits"],
  ["master-further-mechanics-fields", "waec-physics-fields-and-further-mechanics"],
  ["master-mechanics", "waec-physics-motion-and-kinematics"],
  ["master-nuclear-quantum-physics", "waec-physics-nuclear-and-quantum-physics"],
  ["master-thermodynamics", "waec-physics-thermodynamics"],
  ["master-waves-optics", "waec-physics-waves-and-sound"],
  ["master-atomic-structure-periodic-table", "waec-chemistry-atomic-structure"],
  ["master-chemical-bonding", "waec-chemistry-chemical-bonding"],
  ["master-electrochemistry", "waec-chemistry-electrochemistry"],
  ["master-organic-chemistry", "waec-chemistry-organic-chemistry"],
  ["master-stoichiometry-mole", "waec-chemistry-stoichiometry"],
  ["master-thermodynamics-kinetics", "waec-chemistry-thermodynamics-and-kinetics"],
  ["master-bioenergetics-biochemistry", "waec-biology-bioenergetics-and-biochemistry"],
  ["master-cell-biology", "waec-biology-cell-structure"],
  ["master-ecology-evolution", "waec-biology-ecology"],
  ["master-genetics-molecular-biology", "waec-biology-genetics-and-heredity"],
  ["master-human-physiology", "waec-biology-human-physiology"],
  ["master-plant-biology", "waec-biology-plant-biology"],
  ["master-accounting", "waec-accounting-full-syllabus"],
  ["master-business-studies", "waec-business-studies-full-syllabus"],
  ["master-commerce", "waec-commerce-full-syllabus"],
  ["master-macroeconomics", "waec-economics-macroeconomics"],
  ["master-microeconomics", "waec-economics-microeconomics"],
  ["master-cold-war-era", "waec-history-cold-war-era"],
  ["master-decolonization-independence", "waec-history-decolonization-independence"],
  ["master-ib-world-history", "waec-history-ib-world-history"],
  ["master-regional-compulsory-history", "waec-history-regional-compulsory-history"],
  ["master-world-wars", "waec-history-world-wars"],
];

/** neco: source → neco-* target. The 10 on waec-mathematics-quadratic-equations
 *  are WAEC's tree rows; NECO receives its own copies (see file header). */
const NECO_MAP = [
  ["waec-mathematics-quadratic-equations", "neco-mathematics-quadratic-equations"],
  ["master-ecology-evolution", "neco-biology-ecology"],
  ["master-bioenergetics-biochemistry", "neco-biology-bioenergetics-and-biochemistry"],
  ["master-organic-chemistry", "neco-chemistry-organic-chemistry"],
  ["master-plant-biology", "neco-biology-plant-biology"],
  ["master-chemical-bonding", "neco-chemistry-chemical-bonding"],
  ["master-stoichiometry-mole", "neco-chemistry-stoichiometry"],
  ["master-genetics-molecular-biology", "neco-biology-genetics-and-heredity"],
  ["master-human-physiology", "neco-biology-human-physiology"],
  ["master-electrochemistry", "neco-chemistry-electrochemistry"],
  ["master-cell-biology", "neco-biology-cell-structure"],
  ["master-mechanics", "neco-physics-motion-and-kinematics"],
  ["master-atomic-structure-periodic-table", "neco-chemistry-atomic-structure"],
  ["master-thermodynamics-kinetics", "neco-chemistry-thermodynamics-and-kinetics"],
];

const MAPS = { waec: WAEC_MAP, neco: NECO_MAP };

/** Per-board title sources, loaded once by createNodes (one query per board). */
let titleSources = new Map();

// ─── statement emitters (one bulk statement each) ────────────────────────────

function assertSafe(sql, label) {
  const upper = sql.toUpperCase();
  for (const banned of ["DELETE ", "DROP ", "TRUNCATE", "ALTER ", "UPDATE "]) {
    if (upper.includes(banned)) throw new Error(`refusing to run destructive SQL (${banned}) in: ${label}`);
  }
}

async function run(sql, label) {
  assertSafe(sql, label);
  if (DRY_RUN) {
    console.log(`    ${label}\n      ${sql}`);
    return 0;
  }
  const res = await prisma.$executeRawUnsafe(sql);
  console.log(`    ${label} → ${res} row(s)`);
  return res;
}

/** Read the existence + titles of every node a title could legitimately come
 *  from, in ONE query — the jamb siblings, (neco) the waec siblings, the
 *  master sources and the single-bucket convention exemplar. */
async function loadTitleSources(code) {
  const map = MAPS[code] ?? [];
  const ids = new Set(map.map(([source]) => source));
  for (const [, target] of map) {
    ids.add(`jamb-${target.slice(code.length + 1)}`);
    if (code === "neco") ids.add(`waec-${target.slice(code.length + 1)}`);
  }
  // new subject node labels resolve from the sibling board's subject node
  for (const slug of Object.keys(NEW_NODES[code] ?? {})) {
    ids.add(`jamb-${slug}`);
    if (code === "neco") ids.add(`waec-${slug}`);
  }
  ids.add("jamb-accounting-full-syllabus");
  const rows = await prisma.topic.findMany({
    where: { id: { in: [...ids] } },
    select: { id: true, title: true },
  });
  return new Map(rows.map((r) => [r.id, r.title]));
}

/** Every new node's title must equal a node that already exists with that name
 *  (waivers carry the one label that lives nowhere else). Refuses to write
 *  invented text. */
function verifyNewTitles(code, planned) {
  for (const [topicId, text] of planned) {
    if (WAIVERS.has(text)) continue;
    if (text === SINGLE_BUCKET_TITLE) {
      if (titleSources.get("jamb-accounting-full-syllabus") !== SINGLE_BUCKET_TITLE) {
        throw new Error("the single-bucket title convention changed in jamb-accounting-full-syllabus");
      }
      continue;
    }
    const candidates = [`jamb-${topicId.slice(code.length + 1)}`];
    if (code === "neco") candidates.push(`waec-${topicId.slice(code.length + 1)}`);
    for (const [source] of MAPS[code] ?? []) candidates.push(source);
    if (!candidates.some((id) => titleSources.get(id) === text)) {
      throw new Error(`refusing to invent a title: ${topicId} → "${text}" has no existing node with that title`);
    }
  }
}

/** Create the missing {board}-* nodes: subjects first, then their topics. */
async function createNodes(code) {
  const plan = NEW_NODES[code];
  if (!plan || Object.keys(plan).length === 0) return;

  const tree = await treeIds(code);
  if (!tree.root) throw new Error(`no ${code} topic tree root — refusing to invent a board tree`);

  // every title this board's new nodes will use, one read
  titleSources = await loadTitleSources(code);

  const maxOrder = (rows) => rows.reduce((m, r) => Math.max(m, Number(r.orderIndex ?? 0)), 0);

  // new subject nodes (existing subjects gain only the topic nodes they need)
  const existingSubjectSlugs = new Set(tree.subjects.map((s) => s.id.slice(code.length + 1)));
  let subjectOrder = maxOrder(tree.subjects);
  const newSubjects = [];
  for (const [slug, spec] of Object.entries(plan)) {
    if (existingSubjectSlugs.has(slug) || !spec.title) continue;
    subjectOrder += 1;
    newSubjects.push({ id: `${code}-${slug}`, parent: code, title: spec.title, order: subjectOrder });
  }
  if (newSubjects.length) {
    verifyNewTitles(code, newSubjects.map((s) => [s.id, s.title]));
    const rows = newSubjects.map(
      (s) => `(${lit(s.id)}, 'highschool', ${lit(s.parent)}, ${sq(s.title)}, ${s.order}, ${lit(s.id)})`
    );
    const sql =
      `INSERT INTO "Topic" (id, domain, "parentId", title, "orderIndex", slug) VALUES ${rows.join(",")} ` +
      `ON CONFLICT (id) DO NOTHING`;
    await run(sql, `create ${rows.length} missing ${code} subject node(s)`);
  }

  // new topic nodes per subject
  const refreshed = await treeIds(code);
  for (const [slug, spec] of Object.entries(plan)) {
    const subjectId = `${code}-${slug}`;
    const siblings = refreshed.subjects.find((s) => s.id === subjectId)
      ? refreshed.children.filter((c) => c.parentId === subjectId)
      : [];
    const existing = new Set(siblings.map((s) => s.id));
    let order = maxOrder(siblings);
    const newTopics = [];
    for (const topic of spec.topics) {
      const id = `${subjectId}-${topic.slug}`;
      if (existing.has(id)) continue;
      order += 1;
      newTopics.push({ id, parent: subjectId, title: topic.title, order });
    }
    if (newTopics.length) {
      verifyNewTitles(code, newTopics.map((t) => [t.id, t.title]));
      const rows = newTopics.map(
        (t) => `(${lit(t.id)}, 'highschool', ${lit(t.parent)}, ${sq(t.title)}, ${t.order}, ${lit(t.id)})`
      );
      const sql =
        `INSERT INTO "Topic" (id, domain, "parentId", title, "orderIndex", slug) VALUES ${rows.join(",")} ` +
        `ON CONFLICT (id) DO NOTHING`;
      await run(sql, `create ${rows.length} topic node(s) under ${subjectId}`);
    }
  }
}

/** JAMB: ONE bulk statement — tag every question in the jamb tree, CORE → P1. */
async function tagJambTree(examId) {
  const tree = await treeIds("jamb");
  if (!tree.root) throw new Error("no jamb topic tree root");
  const inList = tree.ids.map(lit).join(", ");
  const sql =
    `INSERT INTO "QuestionBoardTag" (id, "questionId", "examinationId", tier, "paperIds") ` +
    `SELECT gen_random_uuid(), q.id, ${lit(examId)}, 'CORE', ${jsonLit(["P1"])} ` +
    `FROM "Question" q WHERE q."topicId" IN (${inList}) ` +
    `ON CONFLICT ("questionId", "examinationId") DO NOTHING`;
  await run(sql, `jamb: tag every tree question CORE → P1 (one statement, ${tree.ids.length} tree topics)`);
}

/** WAEC and NECO: ONE bulk INSERT … SELECT per mapping — duplicate this
 *  board's tagged questions into its own tree (the owner's ordered mechanism:
 *  duplication, masters untouched). Deterministic ids (`<id>-<board>`) make
 *  re-runs converge; one final statement carries the board tags along, so the
 *  blueprint manifest keeps serving mcq → P1 / theory → P2 / practical → P3. */
async function duplicateBoard(code, examId) {
  const map = MAPS[code];
  if (!map) throw new Error(`no duplication map for ${code}`);
  const suffix = `-${code}`;
  for (const [source, target] of map) {
    const sql =
      `INSERT INTO "Question" (id, domain, "topicId", type, "questionText", options, "correctAnswer", ` +
      `explanation, difficulty, "sourceExam", hint, "markingPoints", paper, "markingGuide", marks, "sourceYear") ` +
      `SELECT q.id || ${lit(suffix)}, q.domain, ${lit(target)}, q.type, q."questionText", q.options, q."correctAnswer", ` +
      `q.explanation, q.difficulty, q."sourceExam", q.hint, q."markingPoints", ` +
      `q.paper, q."markingGuide", q.marks, q."sourceYear" ` +
      `FROM "Question" q ` +
      `WHERE q."topicId" = ${lit(source)} ` +
      `AND q.id IN (SELECT t."questionId" FROM "QuestionBoardTag" t ` +
      `JOIN "Examination" e ON e.id = t."examinationId" WHERE e.code = ${lit(code)}) ` +
      `ON CONFLICT (id) DO NOTHING`;
    await run(sql, `${code}: duplicate ${source} → ${target}`);
  }
  // the copies carry the same board tags (tier + paperIds verbatim) — the
  // board tag table has no createdAt column (production schema, verified)
  const sql =
    `INSERT INTO "QuestionBoardTag" (id, "questionId", "examinationId", tier, "paperIds") ` +
    `SELECT t.id || ${lit(suffix)}, t."questionId" || ${lit(suffix)}, t."examinationId", t.tier, t."paperIds" ` +
    `FROM "QuestionBoardTag" t ` +
    `WHERE t."examinationId" = ${lit(examId)} ` +
    `AND EXISTS (SELECT 1 FROM "Question" c WHERE c.id = t."questionId" || ${lit(suffix)}) ` +
    `ON CONFLICT DO NOTHING`;
  await run(sql, `${code}: copy the board tags onto the duplicates`);
}

// ─── verification (read-only, always runs) ───────────────────────────────────

async function report() {
  console.log(DRY_RUN ? "\nDRY RUN — no writes (pass --apply to write)" : "\nAPPLY — additive unification pass");
  for (const slug of LIVE_BOARDS) {
    const exam = await prisma.examination.findFirst({
      where: { domain: "highschool", slug: { equals: slug, mode: "insensitive" } },
      select: { id: true, code: true, name: true },
    });
    if (!exam) {
      console.log(`${slug.padEnd(6)} SKIPPED — no Examination row`);
      continue;
    }
    const tree = await treeIds(exam.code.toLowerCase());
    const ids = tree.ids ?? [];
    const inList = ids.map(lit).join(", ") || "''";
    const rows = await prisma.$queryRawUnsafe(`
      SELECT
        (SELECT count(*) FROM "Question" q WHERE q."topicId" IN (${inList})) AS tree_total,
        (SELECT count(*) FROM "Question" q WHERE q."topicId" IN (${inList})
           AND q.id IN (SELECT t."questionId" FROM "QuestionBoardTag" t
                        WHERE t."examinationId" = ${lit(exam.id)} AND t.tier <> 'NOT_EXAMINED')) AS tagged_active,
        (SELECT count(*) FROM "Question" q WHERE q."topicId" IN (${inList})
           AND q.id NOT IN (SELECT t."questionId" FROM "QuestionBoardTag" t
                             WHERE t."examinationId" = ${lit(exam.id)} AND t.tier <> 'NOT_EXAMINED')) AS untagged_in_tree,
        (SELECT count(*) FROM "QuestionBoardTag" t WHERE t."examinationId" = ${lit(exam.id)}
           AND t.tier <> 'NOT_EXAMINED') AS active_tags`);
    const r = rows[0] ?? {};
    const n = (v) => Number(v ?? 0);
    console.log(
      `${slug.padEnd(6)} treeTopics=${String(ids.length).padStart(3)} · treeQuestions=${String(n(r.tree_total)).padStart(5)} · ` +
        `activeTags=${String(n(r.active_tags)).padStart(5)} · taggedInTree=${String(n(r.tagged_active)).padStart(5)} · ` +
        `untaggedInTree=${String(n(r.untagged_in_tree)).padStart(5)}`
    );
  }
}

async function main() {
  const boards = onlyBoards ?? LIVE_BOARDS;
  for (const slug of boards) {
    if (!LIVE_BOARDS.includes(slug)) {
      console.log(`${slug.padEnd(8)} SKIPPED — not a live board (preparing boards are never touched)`);
      continue;
    }
    const exam = await prisma.examination.findFirst({
      where: { domain: "highschool", slug: { equals: slug, mode: "insensitive" } },
      select: { id: true, code: true, name: true },
    });
    if (!exam) {
      console.log(`${slug.padEnd(8)} SKIPPED — no Examination row`);
      continue;
    }
    console.log(`\n== ${slug} (${exam.name}) ==`);
    const code = exam.code.toLowerCase();
    await createNodes(code);
    if (code === "jamb") await tagJambTree(exam.id);
    if (code === "waec" || code === "neco") await duplicateBoard(code, exam.id);
  }
  await report();
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e.message || e);
  await prisma.$disconnect();
  process.exit(1);
});
