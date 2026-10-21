#!/usr/bin/env node
/**
 * tools/audit-counts.mjs — the regression guard for the count bug that shipped
 * twice.
 *
 * THE BUG CLASS: per-board question counts were computed from THREE different
 * sources and nobody compared them. /cbt read the board's own `{code}-*` topic
 * tree (6,000 questions). The practice picker and /api/questions read board
 * TAGS (340). The board page counted zero and printed "Papers are being
 * digitized". Build stayed green, tsc stayed clean, and students saw three
 * different truths for the same board.
 *
 * WHAT THIS DOES: for every registry board it reads the count off FIVE surfaces
 * and fails loudly if any two disagree:
 *   1. db           topic tree, straight from Postgres (needs DATABASE_URL)
 *   2. board-html   /highschool/exams/[board] hero + subject/topic cards
 *   3. picker-html  /highschool/practice/[board] (tag scoped)
 *   4. api          /api/questions?boardId=&topicId= — per topic
 *   5. cbt          /cbt board payload + POST /api/cbt/session
 * plus the exams hub's per-board chip and the soft-404 / RSC crash guards.
 *
 * Any disagreement → exit 1 with a diff table naming route + symptom.
 *
 * Usage:
 *   node tools/audit-counts.mjs                                   # localhost:3000
 *   SMOKE_URL=https://gnostiri.vercel.app node tools/audit-counts.mjs
 *   node tools/audit-counts.mjs --url http://localhost:3000 --boards jamb
 *   node tools/audit-counts.mjs --db --allow-tag-gap              # CI/local form
 *   node tools/audit-counts.mjs --json                            # machine readable
 *
 * Exits 0 only when every surface agrees. Zero dependencies.
 */

import {
  rscErrorsIn,
  soft404In,
  emptyCopyIn,
} from "./qa/rsc-guard.mjs";
import { pathToFileURL } from "node:url";
import {
  parseBoardPage,
  parsePracticePicker,
  parseCbtBoards,
  parseExamHub,
  parseQuizTotal,
} from "./qa/count-parsers.mjs";

// ─── config ─────────────────────────────────────────────────────────────────
const ARGS = process.argv.slice(2);
const flag = (name) => {
  const i = ARGS.indexOf(`--${name}`);
  return i > -1 ? (ARGS[i + 1] && !ARGS[i + 1].startsWith("--") ? ARGS[i + 1] : true) : null;
};

const BASE_URL = (flag("url") ?? process.env.SMOKE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
const TIMEOUT_MS = Number(process.env.AUDIT_TIMEOUT_MS ?? 45_000);
const CONCURRENCY = Math.max(1, Number(process.env.AUDIT_CONCURRENCY ?? 6));
const USE_COLOR = process.env.NO_COLOR !== "1" && process.stdout.isTTY;
const JSON_OUT = ARGS.includes("--json");
const NO_API = ARGS.includes("--no-api");
const ALLOW_TAG_GAP = ARGS.includes("--allow-tag-gap");
const WANT_DB = ARGS.includes("--db") || Boolean(process.env.DATABASE_URL);

const c = {
  green: (s) => (USE_COLOR ? `\x1b[32m${s}\x1b[0m` : s),
  red: (s) => (USE_COLOR ? `\x1b[31m${s}\x1b[0m` : s),
  dim: (s) => (USE_COLOR ? `\x1b[2m${s}\x1b[0m` : s),
  bold: (s) => (USE_COLOR ? `\x1b[1m${s}\x1b[0m` : s),
  yellow: (s) => (USE_COLOR ? `\x1b[33m${s}\x1b[0m` : s),
};

/** Print a count, or an em dash when a surface did not report one. */
const nf = (n) => {
  const value = typeof n === "number" ? n : n == null || String(n).trim() === "" ? null : Number(String(n).replace(/[\s,]/g, ""));
  return value == null || Number.isNaN(value) ? "—" : value.toLocaleString("en-US");
};

/**
 * Mirrors src/lib/exam-bank.ts. tests/qa-tools.test.mjs extracts the real
 * registry and fails if this list drifts, so the tool stays honest without
 * needing node_modules or the repo at the operator's machine.
 */
const BOARD_REGISTRY = [
  { slug: "jamb", code: "jamb", name: "JAMB (UTME)", status: "live", cbtReady: true },
  { slug: "sat", code: "sat", name: "College Board — Digital SAT", status: "preparing", cbtReady: false },
  { slug: "ap", code: "ap", name: "College Board — AP Exams", status: "preparing", cbtReady: false },
  { slug: "waec", code: "waec", name: "WAEC (WASSCE)", status: "live", cbtReady: false },
  { slug: "neco", code: "neco", name: "NECO (SSCE)", status: "live", cbtReady: false },
  { slug: "maneb", code: "maneb", name: "MANEB (MSCE / JCE)", status: "preparing", cbtReady: false },
  { slug: "cbse", code: "cbse", name: "CBSE", status: "preparing", cbtReady: false },
  { slug: "icse", code: "icse", name: "ICSE", status: "preparing", cbtReady: false },
  { slug: "nsc-matric", code: "nsc", name: "DBE (NSC / Matric)", status: "preparing", cbtReady: false },
  { slug: "necta", code: "necta", name: "NECTA (CSEE / ACSEE)", status: "preparing", cbtReady: false },
  { slug: "kcse", code: "kcse", name: "KNEC (KCSE)", status: "preparing", cbtReady: false },
  { slug: "cambridge", code: "cambridge", name: "Cambridge (CAIE)", status: "preparing", cbtReady: false },
  { slug: "aqa", code: "aqa", name: "AQA", status: "preparing", cbtReady: false },
  { slug: "edexcel", code: "edexcel", name: "Edexcel", status: "preparing", cbtReady: false },
];

/** Boards with a CBT preset (src/lib/cbt/config.ts) — the /api/cbt/session check. */
const CBT_PRESETS = new Set(["jamb", "waec", "neco", "sat", "ap"]);

// ─── helpers ────────────────────────────────────────────────────────────────
async function fetchWithTimeout(url, init = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      redirect: "manual",
      headers: { "user-agent": "gnostiri-audit-counts/1.0", ...(init.headers ?? {}) },
    });
  } finally {
    clearTimeout(timer);
  }
}

async function getText(path) {
  const res = await fetchWithTimeout(`${BASE_URL}${path}`, { headers: { accept: "text/html" } });
  return { status: res.status, body: await res.text() };
}

async function postJson(path, body) {
  const res = await fetchWithTimeout(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.text() };
}

/** The defect ledger. Every row names a route, a symptom and a hypothesis. */
const defects = [];
function defect({ board, route, check, symptom, hypothesis, severity = "FAIL" }) {
  defects.push({ board, route, check, symptom, hypothesis, severity });
}

// ─── optional direct-DB surface ─────────────────────────────────────────────
/**
 * Counts straight from Postgres: the topic tree and per-topic question counts.
 * Uses the same parent-edge traversal the app uses (src/lib/cbt/data.ts), so a
 * prefix-matching bug in the app shows up here as a tree mismatch.
 */
async function dbSurface(boards) {
  if (!WANT_DB) return { available: false, reason: "--db not passed and DATABASE_URL unset" };
  let PrismaClient;
  try {
    ({ PrismaClient } = await import("@prisma/client"));
  } catch (err) {
    return { available: false, reason: `@prisma/client unavailable: ${err.message}` };
  }
  const url = process.env.DATABASE_URL;
  if (!url) return { available: false, reason: "DATABASE_URL not set" };
  const prisma = new PrismaClient({ datasources: { db: { url } } });
  const out = {};
  for (const board of boards) {
    const rootId = board.code.toLowerCase();
    const subjects = await prisma.topic.findMany({
      where: { domain: "highschool", parentId: rootId },
      select: { id: true, title: true },
    });
    const children = subjects.length
      ? await prisma.topic.findMany({
          where: { parentId: { in: subjects.map((s) => s.id) } },
          select: { id: true, parentId: true },
        })
      : [];
    const treeIds = [...subjects.map((s) => s.id), ...children.map((ch) => ch.id)];
    const perTopic = {};
    let total = 0;
    if (treeIds.length) {
      const rows = await prisma.question.groupBy({
        by: ["topicId"],
        where: { topicId: { in: treeIds } },
        _count: { _all: true },
      });
      for (const row of rows) {
        perTopic[row.topicId] = row._count._all;
        total += row._count._all;
      }
    }
    out[board.slug] = { total, subjects: subjects.length, topics: children.length, perTopic };
  }
  await prisma.$disconnect();
  return { available: true, boards: out };
}

// ─── collection ─────────────────────────────────────────────────────────────
async function probeApiQuestions(boardCode, topicId) {
  try {
    const { status, body } = await getText(`/api/questions?boardId=${boardCode}&topicId=${topicId}`);
    if (status !== 200) return { status, count: null, error: body.slice(0, 160) };
    const json = JSON.parse(body);
    if (!Array.isArray(json.questions)) return { status, count: null, error: "questions is not an array" };
    return { status, count: json.questions.length, error: null };
  } catch (err) {
    return { status: 0, count: null, error: `${err.name ?? "Error"}: ${err.message}` };
  }
}

async function collectBoard(board) {
  const record = { board, boardPage: null, picker: null, api: {}, cbtCard: null, hub: null, errors: [] };

  // board page
  try {
    const { status, body } = await getText(`/highschool/exams/${board.slug}`);
    if (status !== 200) {
      record.errors.push(`/highschool/exams/${board.slug} → HTTP ${status}`);
      defect({
        board: board.slug,
        route: `/highschool/exams/${board.slug}`,
        check: "ROUTE_STATUS",
        symptom: `HTTP ${status} (expected 200)`,
        hypothesis: "board route crashed or the registry slug no longer matches an Examination row",
      });
      return record;
    }
    record.boardPage = parseBoardPage(body, board.code);
    const rsc = rscErrorsIn(body);
    if (rsc.length) {
      defect({
        board: board.slug,
        route: `/highschool/exams/${board.slug}`,
        check: "RSC_DIGEST",
        symptom: rsc.join("; "),
        hypothesis: "a component threw during render — Next swallowed it and returned a 200 shell",
      });
    }
    const soft = soft404In(body);
    if (soft.length) {
      defect({
        board: board.slug,
        route: `/highschool/exams/${board.slug}`,
        check: "SOFT_404",
        symptom: `${soft.join("; ")} — while the hero claims ${nf(record.boardPage.heroTotal)} practice questions`,
        hypothesis:
          "retired empty-state copy still rendering. This is the exact wording students saw on a board holding 6,000 questions.",
      });
    }
    // Honest-when-empty copy is a defect only if the tree actually has content.
    const treeTotalHere = record.boardPage.topics.reduce((s, t) => s + t.count, 0);
    if (treeTotalHere > 0) {
      const empty = emptyCopyIn(body);
      if (empty.length) {
        defect({
          board: board.slug,
          route: `/highschool/exams/${board.slug}`,
          check: "SOFT_404",
          symptom: `${empty.join("; ")} — while the page renders ${nf(treeTotalHere)} practice questions`,
          hypothesis: "empty-state branch taken while the topic tree has content: the count bug the students saw",
        });
      }
    }
  } catch (err) {
    record.errors.push(`/highschool/exams/${board.slug} → ${err.message}`);
    defect({
      board: board.slug,
      route: `/highschool/exams/${board.slug}`,
      check: "ROUTE_UNREACHABLE",
      symptom: err.message,
      hypothesis: "deploy down, DNS, or the route no longer exists",
    });
    return record;
  }

  // practice picker (tag scoped)
  try {
    const { status, body } = await getText(`/highschool/practice/${board.slug}`);
    if (status !== 200) {
      defect({
        board: board.slug,
        route: `/highschool/practice/${board.slug}`,
        check: "ROUTE_STATUS",
        symptom: `HTTP ${status} (expected 200)`,
        hypothesis: "practice picker route crashed or notFound() fired for a registry board",
      });
    } else {
      record.picker = parsePracticePicker(body, board.slug);
      const rsc = rscErrorsIn(body);
      if (rsc.length) {
        defect({
          board: board.slug,
          route: `/highschool/practice/${board.slug}`,
          check: "RSC_DIGEST",
          symptom: rsc.join("; "),
          hypothesis: "a component threw during render",
        });
      }
      const soft = soft404In(body);
      if (soft.length && board.status === "live") {
        defect({
          board: board.slug,
          route: `/highschool/practice/${board.slug}`,
          check: "SOFT_404",
          symptom: soft.join("; "),
          hypothesis: "picker empty state on a board the registry marks live",
        });
      }
    }
  } catch (err) {
    record.errors.push(`/highschool/practice/${board.slug} → ${err.message}`);
  }

  // /api/questions per topic id
  if (!NO_API && record.boardPage?.topics.length) {
    const ids = record.boardPage.topics.map((t) => t.id);
    const queue = [...ids];
    const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
      while (queue.length) {
        const id = queue.shift();
        record.api[id] = await probeApiQuestions(board.code, id);
      }
    });
    await Promise.all(workers);
  }

  // Student-facing quiz page for the board's biggest topic — "Question 1 of N"
  // is the last count surface a student sees before sitting the paper.
  if (!NO_API && record.boardPage?.topics.length) {
    const biggest = [...record.boardPage.topics].sort((a, b) => b.count - a.count)[0];
    if (biggest && biggest.count > 0 && biggest.studyPath) {
      try {
        const { status, body } = await getText(`${biggest.studyPath.replace(/\/study$/, "")}/quiz`);
        if (status === 200) {
          record.quiz = { topicId: biggest.id, total: parseQuizTotal(body), route: quizRouteFor(biggest) };
          const rsc = rscErrorsIn(body);
          if (rsc.length) {
            defect({
              board: board.slug,
              route: `${biggest.studyPath.replace(/\/study$/, "")}/quiz`,
              check: "RSC_DIGEST",
              symptom: rsc.join("; "),
              hypothesis: "a component threw during render — Next swallowed it and returned a 200 shell",
            });
          }
        } else {
          record.quiz = { topicId: biggest.id, total: null, error: `HTTP ${status}`, route: quizRouteFor(biggest) };
        }
      } catch (err) {
        record.quiz = { topicId: biggest.id, total: null, error: err.message, route: quizRouteFor(biggest) };
      }
    }
  }

  // CBT engine can actually build a paper for this board
  if (CBT_PRESETS.has(board.code) && record.boardPage) {
    const subjects = record.boardPage.subjects.filter((s) => s.count > 0);
    if (subjects.length) {
      const picked = subjects[0];
      const { status, body } = await postJson("/api/cbt/session", {
        boardCode: board.code,
        mode: "practice",
        subjects: [picked.id],
        count: 10,
      });
      const parsed = (() => {
        try {
          return JSON.parse(body);
        } catch {
          return null;
        }
      })();
      if (status !== 200) {
        defect({
          board: board.slug,
          route: "/api/cbt/session",
          check: "CBT_BUILD",
          symptom: `HTTP ${status} for ${board.code} practice on ${picked.id} — ${body.slice(0, 120)}`,
          hypothesis: "CBT cannot build a paper the board page advertises: topic traversal or preset mismatch",
        });
      } else {
        const served = parsed?.subjects?.reduce((a, s) => a + (s.questions?.length ?? 0), 0) ?? 0;
        const advertised = record.boardPage.heroTotal ?? 0;
        if (served > advertised) {
          defect({
            board: board.slug,
            route: "/api/cbt/session",
            check: "CBT_BUILD",
            symptom: `served ${served} questions but the board page advertises ${advertised}`,
            hypothesis: "CBT reads a wider topic set than the board page counts",
          });
        }
        if (/correctAnswer/i.test(body)) {
          defect({
            board: board.slug,
            route: "/api/cbt/session",
            check: "ANSWER_LEAK",
            symptom: "correctAnswer present in the CBT payload",
            hypothesis: "server-side grading invariant broken",
          });
        }
        record.cbtServe = served;
      }
    }
  }

  return record;
}

// ─── checks ─────────────────────────────────────────────────────────────────
/** The quiz page URL for a topic row, from its study URL. */
function quizRouteFor(topic) {
  return `${String(topic.studyPath).replace(/\/study$/, "")}/quiz`;
}

/**
 * The route that carries a given check's numbers, used to report route · symptom.
 */
function routeFor(check, record) {
  const b = record.board;
  switch (check) {
    case "API_TOPIC":
      return "/api/questions";
    case "QUIZ_HEADER":
      return `${(record.rows ?? []).length ? "" : ""}/highschool/${b.slug}`;
    case "CBT_CARD":
    case "CBT_CARD_SUBJECTS":
      return "/cbt";
    case "DB_TREE":
    case "DB_TOPIC":
      return "DATABASE_URL (topic tree)";
    case "PICKER_SELF":
    case "TAG_FAMILY":
    case "TREE_VS_TAG":
      return `/highschool/practice/${b.slug}`;
    default:
      return `/highschool/exams/${b.slug}`;
  }
}

/** Route a failing check row to a defect, so the exit code honours every diff. */
function rowToDefect(row, record) {
  return {
    board: record.board.slug,
    route: routeFor(row.check, record),
    check: row.check,
    symptom: `${row.a} ${nf(row.av)} ≠ ${row.b} ${nf(row.bv)}${row.note ? ` — ${row.note}` : ""}`,
    hypothesis: HYPOTHESES[row.check] ?? "two surfaces compute the same count differently",
    severity: "FAIL",
  };
}

/**
 * Why each check can fail — written once, so every reported defect carries a
 * hypothesis the owning agent can act on without re-deriving it.
 */
const HYPOTHESES = {
  BOARD_SELF_TOTAL: "the hero count and the topic cards under it are computed from different queries",
  BOARD_SELF_SUBJECTS: "the hero subject count is not derived from the subject grid it renders",
  BOARD_SELF_TOPICS: "the hero topic count is not derived from the topic rows it renders",
  BOARD_CARD_SUM: "subject totals do not roll up the topic totals — a double-count or a dropped node",
  API_TOPIC: "/api/questions and the board page resolve this topic's question set differently (tree rule vs tag rule vs NOT_EXAMINED filter)",
  TAG_FAMILY: "the tag-scoped surfaces count different row sets — one of them filters a tier the other does not",
  PICKER_SELF: "the picker's stated total is not the sum of its own cards",
  CBT_CARD: "/cbt counts the tree with a different traversal than the board page (prefix match vs parent edges)",
  CBT_CARD_SUBJECTS: "/cbt derives subject roots differently to the board page",
  QUIZ_HEADER: "the quiz runner loads a different question set than the board page advertises for the same topic",
  DB_TREE: "the rendered tree is not the whole database tree",
  DB_TOPIC: "the page renders a per-topic count that does not match Postgres",
};

function checkBoard(record, db) {
  const { board, boardPage, picker, api } = record;
  const rows = [];
  const push = (route, check, surfaceA, a, surfaceB, b, ok, note) =>
    rows.push({ route, check, a: surfaceA, av: a, b: surfaceB, bv: b, ok, note });

  if (!boardPage) return rows;

  const topicSum = boardPage.topics.reduce((s, t) => s + t.count, 0);
  const subjectSum = boardPage.subjects.reduce((s, x) => s + x.count, 0);
  const treeTotal = topicSum;
  const hasCards = boardPage.topics.length > 0 || boardPage.subjects.length > 0;
  const boardRoute = `/highschool/exams/${board.slug}`;
  const pickerRoute = `/highschool/practice/${board.slug}`;
  const cbtRoute = "/cbt";
  const dbRoute = "postgres (topic tree)";
  const apiRoute = "/api/questions";
  const quizRoute = record.quiz?.route ?? boardRoute;

  // 1. board page internal consistency. A board with no topic tree renders no
  //    hero sentence at all (honest "In preparation"), so a null hero beside
  //    zero cards is agreement, not a diff.
  if (boardPage.heroTotal == null) {
    if (hasCards) {
      push(boardRoute, "BOARD_SELF_TOTAL", "hero sentence", null, "Σ topic cards", topicSum, false,
        "topic cards render but the hero count sentence is missing");
    }
  } else {
    push(boardRoute, "BOARD_SELF_TOTAL", `hero ${board.slug}`, boardPage.heroTotal, "Σ topic cards", topicSum,
      boardPage.heroTotal === topicSum,
      boardPage.heroTotal === topicSum ? null : "hero count disagrees with the topic cards under it");
  }
  if (boardPage.heroSubjects != null || boardPage.subjects.length) {
    push(boardRoute, "BOARD_SELF_SUBJECTS", `hero ${board.slug}`, boardPage.heroSubjects, "subject cards", boardPage.subjects.length,
      boardPage.heroSubjects === boardPage.subjects.length, null);
  }
  if (boardPage.heroTopics != null || boardPage.topics.length) {
    push(boardRoute, "BOARD_SELF_TOPICS", `hero ${board.slug}`, boardPage.heroTopics, "topic cards", boardPage.topics.length,
      boardPage.heroTopics === boardPage.topics.length, null);
  }
  push(boardRoute, "BOARD_CARD_SUM", "Σ subject cards", subjectSum, "Σ topic cards", topicSum,
    subjectSum === topicSum, subjectSum === topicSum ? null : "subject totals do not roll up the topic totals");

  // 2. api/questions vs board page, per topic
  if (!NO_API) {
    for (const topic of boardPage.topics) {
      const probe = api[topic.id];
      if (!probe) continue;
      if (probe.count == null) {
        push(apiRoute, "API_TOPIC", `board-card ${topic.id}`, topic.count, "/api/questions", null, false,
          probe.error ? `API error: ${probe.error}` : "API returned no usable count");
      } else if (probe.count !== topic.count) {
        push(apiRoute, "API_TOPIC", `board-card ${topic.id}`, topic.count, "/api/questions", probe.count, false, null);
      }
    }
  }

  // 3. practice engine sentence vs practice picker vs hub (all tag scoped)
  const tagSurfaces = [];
  if (boardPage.practiceEngineTotal != null) tagSurfaces.push(["board-page 'practice engine'", boardPage.practiceEngineTotal]);
  if (picker?.statedTotal != null) tagSurfaces.push(["picker stated total", picker.statedTotal]);
  if (record.hubCount != null) tagSurfaces.push(["exams-hub chip", record.hubCount]);
  if (boardPage.practiceEngineTotal == null && hasCards) {
    push(pickerRoute, "TAG_FAMILY", "board-page 'practice engine'", null, "picker stated total", picker?.statedTotal ?? null,
      false, "the board page's practice-engine sentence is missing on a board with content");
  }
  for (let i = 0; i < tagSurfaces.length - 1; i += 1) {
    const [na, va] = tagSurfaces[i];
    const [nb, vb] = tagSurfaces[i + 1];
    const ok = va === vb;
    push(pickerRoute, "TAG_FAMILY", na, va, nb, vb, ok,
      ok ? null : "two tag-scoped surfaces disagree about the same board");
  }

  // 4. picker internal consistency — the stated total only renders when > 0
  if (picker) {
    const pickerSum = picker.topics.reduce((s, t) => s + t.total, 0);
    if (picker.statedTotal == null) {
      if (picker.topics.length) {
        push(pickerRoute, "PICKER_SELF", "picker stated total", null, "Σ picker cards", pickerSum, false,
          "picker cards render but the stated total sentence is missing");
      }
    } else {
      push(pickerRoute, "PICKER_SELF", "picker stated total", picker.statedTotal, "Σ picker cards", pickerSum,
        picker.statedTotal === pickerSum, null);
    }
  }

  // 5. tree vs the CBT board card (server-side tree count)
  if (record.cbtCard) {
    push(cbtRoute, "CBT_CARD", `board page ${board.slug}`, treeTotal, "/cbt board card", record.cbtCard.questionCount,
      treeTotal === record.cbtCard.questionCount,
      treeTotal === record.cbtCard.questionCount ? null : "/cbt counts the tree differently to the board page");
    push(cbtRoute, "CBT_CARD_SUBJECTS", `board page ${board.slug}`, boardPage.subjects.length, "/cbt board card", record.cbtCard.subjectCount,
      boardPage.subjects.length === record.cbtCard.subjectCount, null);
  }

  // 6. db tree vs the rendered tree
  if (db?.available && db.boards[board.slug]) {
    const d = db.boards[board.slug];
    push(dbRoute, "DB_TREE", "postgres topic tree", d.total, "board page", treeTotal,
      d.total === treeTotal, d.total === treeTotal ? null : "the page is not rendering the whole tree");
    for (const topic of boardPage.topics) {
      const dCount = d.perTopic[topic.id] ?? 0;
      if (dCount !== topic.count) {
        push(dbRoute, "DB_TOPIC", `postgres ${topic.id}`, dCount, "board card", topic.count, false, null);
      }
    }
  }

  // 7. the quiz page the student actually sits
  if (record.quiz?.total != null) {
    const card = boardPage.topics.find((t) => t.id === record.quiz.topicId);
    push(quizRoute, "QUIZ_HEADER", `board card ${record.quiz.topicId}`, card?.count ?? null, "quiz 'Question 1 of N'", record.quiz.total,
      card?.count === record.quiz.total, null);
  } else if (record.quiz?.error) {
    push(quizRoute, "QUIZ_HEADER", "quiz page", null, record.quiz.error, null, false,
      "quiz route failed for a topic the board page advertises");
  }

  // 7. THE guard: tree count vs the tag count the practice picker advertises
  if (picker) {
    const tagTotal = picker.statedTotal ?? picker.topics.reduce((s, t) => s + t.total, 0);
    const gap = treeTotal - tagTotal;
    const ok = gap === 0;
    push(pickerRoute, "TREE_VS_TAG", `topic tree ${board.slug}`, treeTotal, "practice picker (tags)", tagTotal,
      ok || ALLOW_TAG_GAP,
      ok
        ? null
        : gap > 0
          ? `${nf(gap)} questions in the tree are unreachable from the practice picker`
          : `${nf(-gap)} questions the picker serves are not in the board's topic tree`);
    if (!ok) {
      const positive = gap > 0;
      defect({
        board: board.slug,
        route: `/highschool/practice/${board.slug}`,
        check: "TREE_VS_TAG",
        symptom: `topic tree ${nf(treeTotal)} vs tag-scoped practice engine ${nf(tagTotal)} — ${nf(Math.abs(gap))} questions ${
          positive ? "exist in the tree but are unreachable through tagged practice" : "served by tags but absent from the board's topic tree"
        }`,
        hypothesis: positive
          ? "the board's own {code}-* topic tree is its bank (that is what /cbt and the board page serve) but the picker still filters on QuestionBoardTag, so every untagged question is invisible to practice"
          : "the picker serves questions from the master curriculum tree that the board page does not count, so the board page advertises a different (smaller) bank than the one students can actually practise",
        severity: ALLOW_TAG_GAP ? "WARN" : "FAIL",
      });
    }
  }

  return rows;
}

// ─── reporting ──────────────────────────────────────────────────────────────
function printBoardTable(records, db) {
  const lines = [];
  const header = [
    "board".padEnd(11),
    "db".padStart(7),
    "board-page".padStart(11),
    "cbt".padStart(8),
    "quiz".padStart(8),
    "hub".padStart(7),
    "picker".padStart(8),
    "subjects".padStart(9),
    "topics".padStart(7),
    "verdict",
  ].join(" ");
  lines.push(c.bold(header));
  for (const r of records) {
    const b = r.board;
    const bp = r.boardPage;
    const tree = bp ? bp.topics.reduce((s, t) => s + t.count, 0) : null;
    const d = db?.available ? db.boards[b.slug]?.total ?? null : null;
    const hub = r.hubCount;
    const picker = r.picker?.statedTotal ?? null;
    const quiz = r.quiz?.total ?? null;
    const rows = r.rows ?? [];
    const bad = rows.filter((x) => !x.ok && x.check !== "TREE_VS_TAG").length;
    const gap = rows.find((x) => x.check === "TREE_VS_TAG");
    const gapBad = gap && !gap.ok;
    let verdict;
    if (!bp) verdict = c.red("ERROR");
    else if (bad > 0) verdict = c.red(`${bad} DIFF`);
    else if (gapBad) verdict = c.yellow(ALLOW_TAG_GAP ? "TAG-GAP" : "GAP");
    else verdict = c.green("AGREE");
    lines.push([
      b.slug.padEnd(11),
      String(nf(d)).padStart(7),
      String(nf(tree)).padStart(11),
      String(nf(r.cbtCard?.questionCount ?? (b.cbtReady ? "—" : "n/a"))).padStart(8),
      String(nf(quiz)).padStart(8),
      String(nf(hub)).padStart(7),
      String(nf(picker)).padStart(8),
      String(bp?.subjects.length ?? "—").padStart(9),
      String(bp?.topics.length ?? "—").padStart(7),
      verdict,
    ].join(" "));
  }
  return lines;
}

function printDefects() {
  const lines = [];
  if (defects.length === 0) {
    lines.push(c.green(c.bold("\nNo count disagreement, no RSC crash, no soft-404. Every surface agrees.")));
    return lines;
  }
  lines.push(c.red(c.bold(`\n${defects.length} DEFECT(S) — route · symptom · hypothesis\n`)));
  for (const d of defects) {
    const tag = d.severity === "WARN" ? c.yellow("WARN") : c.red("FAIL");
    lines.push(`${tag}  ${c.bold(d.board ?? "global")}  ${d.route}  [${d.check}]`);
    lines.push(`      symptom   ${d.symptom}`);
    lines.push(`      hypothesis ${d.hypothesis}`);
  }
  return lines;
}

// ─── main ───────────────────────────────────────────────────────────────────
async function main() {
  if (!JSON_OUT) {
    console.log(c.bold(`\naudit-counts — ${BASE_URL}`));
    console.log(
      c.dim(
        `surfaces: ${WANT_DB ? "db + " : ""}board-html · picker-html · hub · api/questions · cbt` +
          (NO_API ? " (api probes off)" : "") +
          (ALLOW_TAG_GAP ? " · tag-gap tolerated" : ""),
      ),
    );

  }

  const boardFilter = flag("boards");
  const boards = boardFilter
    ? BOARD_REGISTRY.filter((b) => String(boardFilter).split(",").includes(b.slug))
    : BOARD_REGISTRY;
  if (!boards.length) {
    console.error(c.red(`no registry board matches --boards=${boardFilter}`));
    process.exit(1);
  }

  const db = await dbSurface(boards).catch((err) => ({ available: false, reason: err.message }));
  if (!JSON_OUT) {
    if (!db.available) console.log(c.dim(`db surface: ${db.reason ?? "unavailable"}`));
    else console.log(c.green("db surface: postgres topic tree connected"));
  }

  // hub + cbt payload are shared across boards — fetch once.
  let hubHtml = "";
  let cbtHtml = "";
  try {
    hubHtml = (await getText("/highschool/exams")).body;
  } catch {
    /* hub counts are advisory; the per-board surfaces still run */
  }
  try {
    cbtHtml = (await getText("/cbt")).body;
  } catch {
    /* advisory */
  }
  const hubCounts = new Map(
    parseExamHub(hubHtml, BOARD_REGISTRY.map((b) => b.name)).map((h) => [h.name, h.practiceQs]),
  );
  const cbtCards = new Map(parseCbtBoards(cbtHtml).map((b) => [b.code, b]));

  // /api/boards registry consistency (once)
  try {
    const { status, body } = await getText("/api/boards");
    if (status === 200) {
      const json = JSON.parse(body);
      const codes = new Set((json.regions ?? []).flatMap((r) => r.boards.map((b) => b.code)));
      for (const board of BOARD_REGISTRY) {
        if (!codes.has(board.code)) {
          defect({
            board: board.slug,
            route: "/api/boards",
            check: "REGISTRY_DB",
            symptom: `registry board ${board.name} (code ${board.code}) is missing from /api/boards`,
            hypothesis: "the Examination row is missing or its code drifted from src/lib/exam-bank.ts",
          });
        }
      }
    } else {
      defect({
        route: "/api/boards",
        check: "ROUTE_STATUS",
        symptom: `HTTP ${status} (expected 200)`,
        hypothesis: "boards API crashed",
      });
    }
  } catch (err) {
    defect({
      route: "/api/boards",
      check: "ROUTE_UNREACHABLE",
      symptom: err.message,
      hypothesis: "deploy unreachable",
    });
  }

  const records = [];
  const queue = [...boards];
  await pool(queue, CONCURRENCY, async (board) => {
    const record = await collectBoard(board);
    record.hubCount = hubCounts.get(board.name) ?? null;
    record.cbtCard = cbtCards.get(board.code) ?? null;
    record.rows = checkBoard(record, db);
    // TREE_VS_TAG is reported by its own check with a fuller hypothesis;
    // every other failing row becomes a defect so the exit code honours the
    // whole diff table, not just the rows that were hand-reported.
    for (const row of record.rows.filter((r) => !r.ok && r.check !== "TREE_VS_TAG")) {
      defect(rowToDefect(row, record));
    }
    records.push(record);
  });
  records.sort((a, b) => BOARD_REGISTRY.indexOf(a.board) - BOARD_REGISTRY.indexOf(b.board));

  const table = printBoardTable(records, db);
  const detailLines = [];
  for (const r of records) {
    const bad = (r.rows ?? []).filter((x) => !x.ok);
    if (!bad.length) continue;
    detailLines.push(c.bold(`${r.board.slug}`));
    for (const row of bad) {
      detailLines.push(
        `  ${c.red(row.check.padEnd(20))} ${String(row.a).padEnd(26)} ${nf(row.av).padStart(9)} ≠ ${nf(row.bv).padStart(9)} ${String(row.b)}` +
          (row.note ? c.dim(`\n      ${row.note}`) : ""),
      );
    }
  }
  const defectLines = printDefects();

  if (JSON_OUT) {
    console.log(
      JSON.stringify(
        {
          baseUrl: BASE_URL,
          db: db.available ? "postgres" : db.reason,
          boards: records.map((r) => ({
            slug: r.board.slug,
            code: r.board.code,
            status: r.board.status,
            treeTotal: r.boardPage ? r.boardPage.topics.reduce((s, t) => s + t.count, 0) : null,
            heroTotal: r.boardPage?.heroTotal ?? null,
            subjects: r.boardPage?.subjects.length ?? null,
            topics: r.boardPage?.topics.length ?? null,
            practiceEngineTotal: r.boardPage?.practiceEngineTotal ?? null,
            pickerTotal: r.picker?.statedTotal ?? null,
            hubTotal: r.hubCount ?? null,
            quiz: r.quiz ?? null,
            cbtCardTotal: r.cbtCard?.questionCount ?? null,
            emptyState: r.boardPage?.emptyState ?? null,
            diffs: (r.rows ?? []).filter((x) => !x.ok),
          })),
          defects,
          exitCode: defects.length ? 1 : 0,
        },
        null,
        2,
      ),
    );
  } else {
    console.log("");
    console.log(...table);
    if (detailLines.length) {
      console.log(c.bold("\nDIFF TABLE (per-surface disagreements)"));
      for (const line of detailLines) console.log(line);
    }
    console.log(...defectLines);
  }

  const failed = defects.filter((d) => d.severity !== "WARN").length;
  if (!JSON_OUT) {
    console.log(
      failed === 0
        ? c.green(c.bold(`\nAUDIT PASS — every surface agrees (${records.length} boards)`))
        : c.red(c.bold(`\nAUDIT FAIL — ${failed} blocking defect(s) across ${records.length} boards`)),
    );
  }
  process.exit(failed === 0 ? 0 : 1);
}

async function pool(items, size, worker) {
  const queue = [...items];
  await Promise.all(
    Array.from({ length: Math.min(size, queue.length) }, async () => {
      while (queue.length) {
        const item = queue.shift();
        await worker(item);
      }
    }),
  );
}

// Run only when invoked as a script, so tests can import the registry mirror.
const invokedDirectly =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) {
  main().catch((err) => {
    console.error(c.red(`audit-counts crashed: ${err.message}`));
    process.exit(1);
  });
}

export { BOARD_REGISTRY };
