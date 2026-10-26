/**
 * tests/qa-tools.test.mjs — unit tests for the QA tools.
 *
 * Covers the three things that must never regress quietly:
 *   1. the RSC / soft-404 detectors, including false-positive traps
 *   2. the count parsers that read real page HTML (fixtures, not mocks of mocks)
 *   3. the smoke catalogue and the audit registry mirror — drift here silently
 *      stops the suite watching a route
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import {
  rscErrorsIn,
  soft404In,
  emptyCopyIn,
} from "../tools/qa/rsc-guard.mjs";
import {
  stripComments,
  unescapeFlight,
  parseBoardPage,
  parsePracticePicker,
  parseCbtBoards,
  parseExamHub,
  parseQuizTotal,
  deriveTopicId,
  flightTopicIds,
} from "../tools/qa/count-parsers.mjs";
import { buildSite, DEFAULT_BOARDS } from "./qa-fixtures.mjs";
import { CATALOGUE } from "../tools/smoke.mjs";
import { BOARD_REGISTRY } from "../tools/audit-counts.mjs";

// ─── RSC + soft-404 guards ──────────────────────────────────────────────────

test("rsc: detects an RSC error digest in the escaped flight payload", () => {
  const html = `<script>self.__next_f.push([1,"{\\"digest\\":\\"abc123\\",\\"message\\":\\"boom\\"}"])</script>`;
  const found = rscErrorsIn(html);
  assert.equal(found.length, 1);
  assert.match(found[0], /RSC\/error marker/);
});

test("rsc: does NOT flag topic ids that merely contain 'digestion'", () => {
  // `"li","jamb-biology-nutrition-and-digestion"` — a real topic id.
  const html = `<script>self.__next_f.push([1,"[\\"$\\",\\"li\\",\\"jamb-biology-nutrition-and-digestion\\",{}]"])</script>`;
  assert.deepEqual(rscErrorsIn(html), []);
});

test("rsc: detects NEXT_NOT_FOUND, NEXT_REDIRECT and rendered crash text", () => {
  assert.match(rscErrorsIn("NEXT_NOT_FOUND")[0], /NEXT_NOT_FOUND/);
  assert.match(rscErrorsIn("NEXT_REDIRECT")[0], /NEXT_REDIRECT/);
  assert.match(rscErrorsIn("<h1>Internal Server Error</h1>")[0], /Internal Server Error/);
});

test("rsc: a healthy page produces no errors", () => {
  const routes = buildSite();
  assert.deepEqual(rscErrorsIn(routes["/highschool/exams/jamb"]), []);
});

test("soft-404: catches the retired 'Papers are being digitized' copy", () => {
  const found = soft404In("<p>Papers are being digitized</p>");
  assert.equal(found.length, 1);
  // also when it arrives escaped inside the flight payload
  assert.equal(soft404In('<script>\\"Papers are being digitized\\"</script>').length, 1);
});

test("soft-404: an honest empty board produces no soft-404", () => {
  const routes = buildSite([EMPTY_BOARD]);
  assert.deepEqual(soft404In(routes["/highschool/exams/empty"]), []);
});

test("empty-state copy: honest on an empty board, fatal where content exists", () => {
  assert.match(emptyCopyIn("<h2>In preparation</h2>")[0], /In preparation/);
  assert.match(emptyCopyIn("<p>No topics are tagged for JAMB practice yet.</p>")[0], /No topics are tagged/);
  // the same copy is what made the JAMB board page a soft-404; the caller gates
  // on "the tree has content", which is what audit-counts does.
  const populated = buildSite()["/highschool/exams/jamb"];
  assert.deepEqual(emptyCopyIn(populated), [], "a populated fixture must not contain empty-state copy");
});

// ─── count parsers ──────────────────────────────────────────────────────────

test("parsers: stripComments collapses React's node delimiters", () => {
  const html = "6,000<!-- --> practice question<!-- -->s<!-- --> across<!-- --> 12";
  assert.equal(stripComments(html), "6,000 practice questions across 12");
});

test("parsers: unescapeFlight restores the payload's JSON", () => {
  assert.equal(unescapeFlight('{\\"a\\":1}'), '{"a":1}');
});

test("board page: hero, subjects and topics all roll up to the same total", () => {
  const board = DEFAULT_BOARDS.find((b) => b.slug === "jamb");
  const parsed = parseBoardPage(boardPageOf(board), board.code);
  assert.equal(parsed.heroTotal, 600);
  assert.equal(parsed.heroSubjects, 1);
  assert.equal(parsed.heroTopics, 3);
  assert.equal(parsed.subjects.length, 1);
  assert.equal(parsed.topics.length, 3);
  assert.equal(parsed.subjects.reduce((s, x) => s + x.count, 0), 600);
  assert.equal(parsed.topics.reduce((s, t) => s + t.count, 0), 600);
  assert.equal(parsed.practiceEngineTotal, 600);
  assert.equal(parsed.emptyState, false);
});

test("board page: topic ids come from the flight payload, not the URL", () => {
  const board = DEFAULT_BOARDS.find((b) => b.slug === "jamb");
  const html = boardPageOf(board);
  assert.equal(flightTopicIds(html).length, 3);
  const parsed = parseBoardPage(html, board.code);
  assert.deepEqual(parsed.topics.map((t) => t.id), board.topics.map((t) => t.id));
});

test("board page: a legacy id that does not extend its parent still resolves", () => {
  // jamb-agriculture-full-syllabus does NOT start with jamb-agricultural-science
  const board = DEFAULT_BOARDS.find((b) => b.slug === "jamb");
  const html = boardPageOf({
    ...board,
    slug: "jamb",
    subjects: [{ slug: "agricultural-science", title: "Agricultural Science" }],
    topics: [{ id: "jamb-agriculture-full-syllabus", subjectSlug: "agricultural-science", topicSlug: "full-syllabus", title: "Agriculture", count: 500 }],
    tree: { total: 500, subjects: 1, topics: 1 },
  });
  const parsed = parseBoardPage(html, "jamb");
  assert.equal(parsed.topics[0].id, "jamb-agriculture-full-syllabus");
  assert.equal(deriveTopicId("/highschool/jamb/agricultural-science/full-syllabus/study", "jamb"),
    "jamb-agricultural-science-full-syllabus", "URL convention differs from the real id — flight keys are required");
});

test("board page: an empty board renders no hero claim but reports the empty state", () => {
  const parsed = parseBoardPage(boardPageOf(EMPTY_BOARD), EMPTY_BOARD.code);
  assert.equal(parsed.heroTotal, null);
  assert.equal(parsed.subjects.length, 0);
  assert.equal(parsed.topics.length, 0);
  assert.equal(parsed.emptyState, true);
});

test("picker: per-topic type counts and the stated total agree", () => {
  const board = DEFAULT_BOARDS.find((b) => b.slug === "jamb");
  const parsed = parsePracticePicker(pickerPageOf(board), board.slug);
  assert.equal(parsed.statedTotal, 600);
  assert.equal(parsed.statedSubjects, 1);
  assert.equal(parsed.topics.length, 3);
  assert.equal(parsed.topics.reduce((s, t) => s + t.total, 0), 600);
  assert.equal(parsed.topics[0].mcq, 300);
});

test("cbt payload: the boards array is lifted intact", () => {
  const routes = buildSite();
  const boards = parseCbtBoards(routes["/cbt"]);
  const jamb = boards.find((b) => b.code === "jamb");
  assert.ok(jamb);
  assert.equal(jamb.questionCount, 600);
  assert.equal(jamb.subjectCount, 1);
  assert.equal(jamb.status, "live");
});

test("hub: a board name is paired with its own 'practice Qs' chip", () => {
  const routes = buildSite();
  const hub = parseExamHub(routes["/highschool/exams"], ["JAMB (UTME)"]);
  assert.deepEqual(
    hub.map((h) => [h.name, h.practiceQs]),
    [["JAMB (UTME)", 600]],
  );
});

test("quiz: 'Question 1 of N' is read as the count the student sits", () => {
  const board = DEFAULT_BOARDS.find((b) => b.slug === "jamb");
  const topic = board.topics[0];
  assert.equal(parseQuizTotal(quizPageOf(board, topic)), 300);
});

// ─── fixtures helpers (keep the fixture honest about its own shape) ─────────

/** A board with no tree, no tags and no card — the parser's empty state. */
const EMPTY_BOARD = {
  slug: "empty",
  code: "empty",
  name: "EMPTY",
  country: "Nowhere",
  class: "MCQ",
  status: "preparing",
  cbtReady: false,
  tagTotal: 0,
  hubTagTotal: 0,
  tree: { total: 0, subjects: 0, topics: [] },
  subjects: [],
  topics: [],
  tagTopics: [],
  cbtCard: null,
  quizTotal: 0,
};

function boardPageOf(board) {
  return buildSite([board])[`/highschool/exams/${board.slug}`];
}
function pickerPageOf(board) {
  return buildSite([board])[`/highschool/practice/${board.slug}`];
}
function quizPageOf(board, topic) {
  return buildSite([board])[`/highschool/${board.slug}/${topic.subjectSlug}/${topic.topicSlug}/quiz`];
}

// ─── smoke catalogue ────────────────────────────────────────────────────────

test("catalogue: every entry is well formed", () => {
  const seen = new Set();
  for (const entry of CATALOGUE) {
    assert.ok(entry.path?.startsWith("/"), `entry needs a path: ${JSON.stringify(entry)}`);
    assert.ok(!seen.has(entry.path), `duplicate catalogue path ${entry.path}`);
    seen.add(entry.path);
    for (const key of ["markers", "forbid"]) {
      for (const re of entry[key] ?? []) assert.ok(re instanceof RegExp, `${entry.path} ${key} must be regexes`);
    }
    if (entry.expectCount) {
      assert.ok(entry.expectCount.pattern instanceof RegExp, `${entry.path} expectCount needs a pattern`);
      // The pattern must capture the number out of the sentence the page prints.
      const probes = ["6,000 practice questions across 12 subjects", "0 practice questions across 5 subjects"];
      const captured = probes.map((s) => entry.expectCount.pattern.exec(s)).some((m) => m && Number(m[1].replace(/[\s,]/g, "")) >= 0);
      assert.ok(captured, `${entry.path} expectCount must capture the number in group 1`);
    }
    if (entry.api) {
      assert.ok(typeof entry.api.field === "string" && entry.api.field.length > 0, `${entry.path} api probe needs a field`);
      assert.equal(typeof entry.api.min, "number", `${entry.path} api probe needs a numeric min`);
    }
  }
});

test("catalogue: the full priority surface is covered", () => {
  const paths = new Set(CATALOGUE.map((e) => e.path));
  const required = [
    "/",
    "/highschool",
    "/highschool/exams",
    "/highschool/exams/jamb",
    "/highschool/practice/jamb",
    "/highschool/jamb/physics/motion-and-kinematics/study",
    "/highschool/jamb/physics/motion-and-kinematics/quiz",
    "/cbt",
    "/cbt/setup?board=jamb",
    "/cbt/session?board=jamb&mode=simulation",
    "/cbt/results",
    "/cbt/review",
    "/university",
    "/university/gross-anatomy-i",
    "/university/physiology-cell-and-general",
    "/login",
    "/api/questions?boardId=jamb&topicId=jamb-physics-motion-and-kinematics",
    "/api/boards",
  ];
  for (const path of required) {
    assert.ok(paths.has(path), `catalogue is missing ${path}`);
  }
});

test("catalogue: the JAMB kinematics API probe demands more than 100 questions", () => {
  const probe = CATALOGUE.find((e) => e.path.startsWith("/api/questions?boardId=jamb"));
  assert.ok(probe, "the flagship api/questions probe must exist");
  assert.ok(probe.api.min > 100, `expected min > 100, got ${probe.api.min}`);
  assert.equal(probe.api.field, "questions");
});

test("catalogue: every board with content must advertise a count and forbid the empty card", () => {
  for (const path of ["/highschool/exams/jamb"]) {
    const entry = CATALOGUE.find((e) => e.path === path);
    assert.ok(entry.expectContent, `${path} must declare expectContent`);
    assert.ok(entry.expectCount?.min >= 1, `${path} must require a real advertised count`);
    assert.ok(entry.forbid?.some((re) => /In preparation/i.test(re.source)), `${path} must forbid the empty card`);
  }
});

// ─── audit registry mirror ──────────────────────────────────────────────────

/** Evaluate the shipped EXAM_BANK registry (same technique as board-taxonomy.test.mjs). */
function loadExamBank() {
  const src = readFileSync(new URL("../src/lib/exam-bank.ts", import.meta.url), "utf8");
  const start = src.indexOf("export const EXAM_BANK");
  assert.ok(start > -1, "EXAM_BANK must exist in src/lib/exam-bank.ts");
  const end = src.indexOf("\n];", start);
  assert.ok(end > start, "EXAM_BANK must be an array literal");
  const arraySrc = src.slice(src.indexOf("[", start), end + 2);
  const js = ts.transpileModule(`const EXAM_BANK = ${arraySrc};`, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  return new Function(`${js}\nreturn EXAM_BANK;`)();
}

test("registry mirror: audit-counts mirrors src/lib/exam-bank.ts exactly", () => {
  const source = loadExamBank();
  assert.equal(BOARD_REGISTRY.length, source.length, "a board was added or retired without updating audit-counts");
  for (const board of source) {
    const mirrored = BOARD_REGISTRY.find((b) => b.slug === board.slug);
    assert.ok(mirrored, `registry board ${board.slug} is missing from tools/audit-counts.mjs`);
    assert.equal(mirrored.code, board.code, `${board.slug} code drifted`);
    assert.equal(mirrored.name, board.name, `${board.slug} name drifted`);
    assert.equal(mirrored.status, board.status, `${board.slug} status drifted`);
    assert.equal(mirrored.cbtReady, Boolean(board.cbtReady), `${board.slug} cbtReady drifted`);
  }
});
