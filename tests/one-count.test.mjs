// ONE-count regression guard (round 4, agent 5's lane).
//
// The defect class this test kills: a board's practice count and its board-page
// count were computed from TWO different sources (board tags vs the topic tree),
// so live production printed 6,000 on one surface and 339 on another for the
// same board, and the exams hub disagreed with the practice picker about the
// same board (340 vs 339 — a missing NOT_EXAMINED tier filter).
//
// The fix defines a board's bank in exactly ONE place — src/lib/board-bank.ts —
// as "every question inside the board's own {code}-* topic tree, minus rows the
// board marks NOT_EXAMINED", and every counting surface derives from it. These
// tests assert that structurally, on the SHIPPED source (no DB needed).
//
// The live, database-backed half of the same guard is tools/pq/verify-unification.mjs.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ROOT = new URL("../", import.meta.url).pathname;
const read = (p) => readFileSync(`${ROOT}${p}`, "utf8");

const BOARD_BANK = read("src/lib/board-bank.ts");
const HUB = read("src/app/highschool/exams/page.tsx");
const BOARD_PAGE = read("src/app/highschool/exams/[exam]/page.tsx");
const PICKER = read("src/app/highschool/practice/[exam]/page.tsx");
const QUIZ = read("src/app/highschool/[exam]/[subject]/[topic]/quiz/page.tsx");

// ─── 1. the ONE bank definition ──────────────────────────────────────────────

test("the bank definition exists and is tree-based", () => {
  assert.match(BOARD_BANK, /interface TopicTypeCounts/, "the shared count shape must exist");
  assert.match(BOARD_BANK, /export async function boardTreeTopicIds/, "the tree walk must be shared");
  assert.match(BOARD_BANK, /export async function boardTopicQuestionCounts/, "per-topic counts must be shared");
  assert.match(BOARD_BANK, /export async function countBoardQuestions/, "the total must be shared");
  // the tree is the board's own {code}-* namespace, resolved by parent edges
  assert.match(BOARD_BANK, /where: \{ domain: "highschool", id: code \}/, "the tree root is the board code");
  assert.match(BOARD_BANK, /parentId: root\.id/, "subjects hang off the root");
  assert.match(BOARD_BANK, /parentId: \{ in: subjectIds \}/, "topics hang off the subjects");
  // RULE 4 travels with the definition itself
  assert.match(
    BOARD_BANK,
    /NOT: \{ boardTags: \{ some: \{ examinationId, tier: "NOT_EXAMINED" \} \} \}/,
    "NOT_EXAMINED must be excluded inside the shared definition, not per surface"
  );
});

// ─── 2. every counting surface derives from that ONE definition ──────────────

test("the exams hub counts the topic tree, never tags", () => {
  assert.match(HUB, /import \{ countBoardQuestions \} from "@\/lib\/board-bank"/, "hub must import the shared helper");
  assert.match(HUB, /countBoardQuestions\(board\.code\.toLowerCase\(\), exam\.id\)/, "hub chip must come from the tree");
  assert.doesNotMatch(
    HUB,
    /questionBoardTag\.count/,
    "the hub's 340-vs-339 defect was a bare tag count with no tier filter — tags must never be the hub's source"
  );
});

test("the board page's practice-engine count is the tree count", () => {
  assert.match(BOARD_PAGE, /boardTopicQuestionCounts\(boardCode, examination\.id\)/, "board page reads the shared per-topic map");
  // the hero count and the practice card print the SAME variable
  assert.match(BOARD_PAGE, /const practiceCount = treeQuestionCount;/, "the practice-engine sentence must print the tree total");
  assert.doesNotMatch(
    BOARD_PAGE,
    /prisma\.question\.count\(/,
    "a standalone question.count over boardTags is how the board page disagreed with the picker"
  );
});

test("the practice picker serves the tree, not the tag subset", () => {
  assert.match(
    PICKER,
    /const countsByTopic = await boardTopicQuestionCounts\(boardCode, examination\.id\);/,
    "the picker's counts must come from the shared tree helper"
  );
  assert.doesNotMatch(
    PICKER,
    /boardTags: \{ some: \{ examinationId: examination\.id, tier: \{ not: "NOT_EXAMINED" \} \} \}/,
    "the picker must no longer filter on board tags — that was the 339-vs-6,000 defect"
  );
  // its stated total is the sum of its own cards, so PICKER_SELF can never fail
  assert.match(PICKER, /totalQuestions \+= totalOf\(counts\)/, "the stated total accumulates the same map the cards render");
  // resolveSubject (the tree-first subject grouping) must survive untouched —
  // tests/board-taxonomy.test.mjs evaluates the shipped function
  assert.match(PICKER, /function resolveSubject\(/, "resolveSubject must remain the subject resolver");
  // the parent edge must win over id-prefix matching, or legacy ids that do not
  // extend their parent (jamb-agriculture-full-syllabus) drop out of their group
  assert.match(PICKER, /select: \{ id: true, title: true, slug: true, parentId: true \}/, "the picker must read the parent edge");
  assert.match(PICKER, /subjectRoots\.find\(\(root\) => root\.id === topic\.parentId\)/, "the parent edge must resolve the subject root");
  assert.match(PICKER, /totalQuestions \+= totalOf\(counts\);\s*\n\s*\}/, "the stated total must accumulate exactly the rendered cards");
});

test("the quiz page applies the same NOT_EXAMINED rule as the bank definition", () => {
  assert.match(
    QUIZ,
    /NOT: \{ boardTags: \{ some: \{ examinationId: examination\.id, tier: "NOT_EXAMINED" \} \} \}/,
    "the quiz's 'Question 1 of N' must count the same set the board page advertises"
  );
});

// ─── 3. the parser-visible render formats are unchanged ──────────────────────
// tools/qa/count-parsers.mjs (agent 7's lane) reads these exact sentences; if a
// page reworded them the audit would lose its numbers instead of the bug.

test("render formats stay machine-readable", () => {
  // board page hero: "N practice questions across S subjects and T topics"
  assert.match(BOARD_PAGE, /\{treeQuestionCount\.toLocaleString\(\)\} practice question\{treeQuestionCount === 1 \? "" : "s"\}/);
  // board page practice card: "N questions in the practice engine" — always
  // rendered, zero included, so the sentence never vanishes from a board page
  // (the audit reads it on every board with cards)
  assert.match(
    BOARD_PAGE,
    /\$\{practiceCount\.toLocaleString\(\)\} question\$\{practiceCount === 1 \? "" : "s"\} in the practice engine\./
  );
  assert.doesNotMatch(
    BOARD_PAGE,
    /Topic practice for this board is still being loaded/i,
    "the practice-engine sentence must be unconditional — its absence on a zero-count board is itself an audit defect"
  );
  // picker stated total: "N questions tagged to this board's papers across M subjects"
  assert.match(PICKER, /\{totalQuestions\.toLocaleString\(\)\} question\{totalQuestions === 1 \? "" : "s"\} tagged to this board&apos;s papers across/);
  // hub chip: "N practice Qs"
  assert.match(HUB, /\{stats\.questions\} practice Qs/);
});

// ─── 4. what must NOT come back ──────────────────────────────────────────────

test("no tag-scoped count remains on a student-facing surface", () => {
  for (const [name, src] of [
    ["hub", HUB],
    ["board page", BOARD_PAGE],
    ["picker", PICKER],
  ]) {
    assert.doesNotMatch(src, /questionBoardTag\.count/, `${name} must not count tags`);
    assert.doesNotMatch(
      src,
      /question\.count\(\{\s*where: \{ boardTags/,
      `${name} must not count questions through boardTags`
    );
  }
});

// ─── 6. the honest-empty copy must not trip the QA suite's empty-state guard ─
// tools/qa/rsc-guard.mjs flags "No topics are tagged … yet" / "Content lands
// here as topics are rebuilt" / "still being loaded" / "In preparation" on
// routes where content is mandatory. A board with an empty tree must render an
// honest empty state that is NOT one of those flagged phrases (an empty-tree
// picker renders exactly this, before its bank lands).

test("the picker's empty state is honest but unflagged", () => {
  const guarded = [
    /No topics are tagged for [^<.]{0,80}practice yet/i,
    /Content lands here as topics are rebuilt and tagged/i,
    /Topic practice for this board is still being loaded/i,
    /In preparation/,
  ];
  for (const re of guarded) {
    assert.doesNotMatch(PICKER, re, `picker copy must not read as the flagged empty-state phrase ${re}`);
  }
  assert.match(PICKER, /no practice questions in its topic tree yet/i, "the empty state must stay honest");
});
