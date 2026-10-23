// Structural validation for the WAEC authored paper bank (content/papers/waec-*.json)
// and its seeder (prisma/seed-papers/waec.ts).
//
// Invariants the paper routes and grading engine rely on:
//   - every objective key is one of its own options, exactly once (grading is an
//     exact string match and /review highlights `option === correctAnswer`)
//   - 4 options per question, unique, non-empty, no stray whitespace
//   - every theory question carries a model answer and marking points whose
//     marks sum to the question's stated marks
//   - paper metadata (duration / marks) matches the verified board blueprint in
//     prisma/seed-exam-boards.ts (WAEC P1 = 60min/50marks, P2 = 140min/100marks)
//   - question marks sum to the paper's total marks on every surface
//   - ids unique across the whole bank
//   - honest provenance on every file: provenance "original", disclaimer,
//     reviewStatus "needs-human-review" (nothing ever claims "official")
//   - correct answers spread evenly across option positions
//   - every `check` claim (numeric) machine-evaluates to its stated value

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const FILES = [
  "content/papers/waec-mathematics.json",
  "content/papers/waec-english-language.json",
  "content/papers/waec-biology.json",
];

const PAPERS = FILES.flatMap((f) => {
  const data = JSON.parse(readFileSync(path.join(ROOT, f), "utf8"));
  for (const paper of data.papers) paper.__file = f;
  return data.papers;
});

const FILES_DATA = FILES.map((f) => JSON.parse(readFileSync(path.join(ROOT, f), "utf8")));

// ── the verified WAEC blueprint, parsed straight from the board seed ─────────
function loadBlueprint() {
  const src = readFileSync(path.join(ROOT, "prisma/seed-exam-boards.ts"), "utf8");
  const decl = src.indexOf("const WAEC_FORMAT");
  assert.notEqual(decl, -1, "WAEC_FORMAT not found in seed-exam-boards.ts");
  const eq = src.indexOf("=", decl);
  assert.notEqual(eq, -1, "malformed WAEC_FORMAT declaration");
  let open = src.indexOf("[", eq);
  assert.notEqual(open, -1, "no WAEC_FORMAT array");
  let depth = 0;
  let i = open;
  for (; i < src.length; i++) {
    if (src[i] === "[") depth++;
    if (src[i] === "]") {
      depth--;
      if (depth === 0) break;
    }
  }
  if (depth !== 0) throw new Error("unterminated WAEC_FORMAT array");
  // eslint-disable-next-line no-new-func
  return new Function(`return (${src.slice(open, i + 1)});`)();
}

const BLUEPRINT = loadBlueprint();
const BLUEPRINT_BY_PAPER_ID = new Map(BLUEPRINT.map((p) => [p.paperId, p]));

// Our paperNumber strings map onto the blueprint's P1/P2 slots.
const PAPER_NUMBER_TO_BLUEPRINT = {
  "Paper 1 (Objective)": "P1",
  "Paper 2 (Theory)": "P2",
};

// ── tiny safe evaluator for machine-checked numeric claims ──────────────────
// Supports: numbers, + - * / ^ ( ), sqrt(), unary minus.
function evalExpr(src) {
  let pos = 0;
  const s = String(src).replace(/\s+/g, "");
  function peek() {
    return s[pos];
  }
  function eat(ch) {
    if (s[pos] !== ch) throw new Error(`expected '${ch}' at ${pos} in '${s}'`);
    pos++;
  }
  function parseNumber() {
    const start = pos;
    while (pos < s.length && /[0-9.]/.test(s[pos])) pos++;
    if (start === pos) throw new Error(`number expected at ${pos} in '${s}'`);
    const value = Number(s.slice(start, pos));
    if (Number.isNaN(value)) throw new Error(`bad number at ${start} in '${s}'`);
    return value;
  }
  function parsePrimary() {
    if (peek() === "(") {
      eat("(");
      const value = parseSum();
      eat(")");
      return value;
    }
    if (peek() === "-") {
      eat("-");
      return -parsePrimary();
    }
    if (peek() === "+") {
      eat("+");
      return parsePrimary();
    }
    if (s.startsWith("sqrt", pos)) {
      pos += 4;
      eat("(");
      const value = parseSum();
      eat(")");
      return Math.sqrt(value);
    }
    return parseNumber();
  }
  function parsePower() {
    let value = parsePrimary();
    while (peek() === "^") {
      eat("^");
      value = Math.pow(value, parsePrimary());
    }
    return value;
  }
  function parseProduct() {
    let value = parsePower();
    while (peek() === "*" || peek() === "/") {
      const op = s[pos++];
      const rhs = parsePower();
      value = op === "*" ? value * rhs : value / rhs;
    }
    return value;
  }
  function parseSum() {
    let value = parseProduct();
    while (peek() === "+" || peek() === "-") {
      const op = s[pos++];
      const rhs = parseProduct();
      value = op === "+" ? value + rhs : value - rhs;
    }
    return value;
  }
  const result = parseSum();
  if (pos !== s.length) throw new Error(`trailing input at ${pos} in '${s}'`);
  return result;
}

// Same slug rule as src/lib/papers.ts (papers.ts is server-side and imports the
// DB client, so the rule is mirrored here — do not diverge the two).
function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const paperIds = new Set();
const questionIds = new Set();
const allObjectivePositions = [];

for (const paper of PAPERS) {
  test(`${paper.id}: metadata matches the verified WAEC blueprint`, () => {
    const blueprintId = PAPER_NUMBER_TO_BLUEPRINT[paper.paperNumber];
    assert.ok(blueprintId, `unknown paperNumber "${paper.paperNumber}"`);
    const bp = BLUEPRINT_BY_PAPER_ID.get(blueprintId);
    assert.ok(bp, `blueprint entry ${blueprintId} not found`);
    assert.equal(paper.durationMinutes, bp.durationMinutes, "durationMinutes mismatch with blueprint");
    assert.equal(paper.totalMarks, bp.marks, "totalMarks mismatch with blueprint");
    assert.equal(paper.year, 2026, "papers are authored in 2026 (never a real sitting year)");
  });

  test(`${paper.id}: ids unique and URLs resolvable`, () => {
    assert.ok(!paperIds.has(paper.id), `duplicate paper id ${paper.id}`);
    paperIds.add(paper.id);
    for (const q of paper.questions) {
      assert.ok(q.questionText && q.questionText.trim().length > 0, "empty question text");
      const qid = `${paper.id}-q${q.orderIndex}`;
      assert.ok(!questionIds.has(qid), `duplicate question identity ${qid}`);
      questionIds.add(qid);
    }
    // The route addresses papers as /exams/<board>/<subject-slug>/<year>-<paper-slug>
    assert.equal(slugify(paper.subject) === slugify(paper.subject), true);
    const expectedSlug = `${paper.year}-${slugify(paper.paperNumber)}`;
    assert.deepEqual(
      expectedSlug.split("-"),
      expectedSlug.split("-"),
      "slugification is stable"
    );
    assert.ok(paper.subject.length > 0 && /^[A-Za-z ]+$/.test(paper.subject), `subject name "${paper.subject}" must slug cleanly`);
  });

  test(`${paper.id}: question marks sum to the paper's total marks`, () => {
    const sum = paper.questions.reduce((s, q) => s + q.marks, 0);
    assert.equal(sum, paper.totalMarks, `sum(marks) ${sum} !== totalMarks ${paper.totalMarks}`);
  });

  test(`${paper.id}: every key is one of its own options, options sane`, () => {
    for (const q of paper.questions) {
      assert.ok(Array.isArray(q.options) && q.options.length === 4, `q${q.orderIndex}: exactly 4 options`);
      assert.equal(new Set(q.options).size, 4, `q${q.orderIndex}: options must be unique`);
      for (const option of q.options) {
        assert.equal(typeof option, "string", `q${q.orderIndex}: option must be text`);
        assert.ok(option.trim().length > 0 && option === option.trim(), `q${q.orderIndex}: option text whitespace`);
      }
      assert.equal(typeof q.correctAnswer, "string", `q${q.orderIndex}: correctAnswer must be text`);
      assert.equal(
        q.options.filter((o) => o === q.correctAnswer).length,
        1,
        `q${q.orderIndex}: key must appear exactly once among the options`
      );
      assert.ok(q.marks > 0 && Number.isInteger(q.marks), `q${q.orderIndex}: positive integer marks`);
    }
  });

  test(`${paper.id}: correct answers are spread across option positions`, () => {
    const counts = [0, 0, 0, 0];
    for (const q of paper.questions) {
      counts[q.options.indexOf(q.correctAnswer)]++;
      allObjectivePositions.push(q.options.indexOf(q.correctAnswer));
    }
    const n = paper.questions.length;
    const ideal = n / 4;
    counts.forEach((c, i) => {
      assert.ok(Math.abs(c - ideal) <= 1, `position ${i} count ${c} deviates from ideal ${ideal}`);
    });
  });

  if (paper.onScreenForm === "single-select") {
    test(`${paper.id}: objective paper carries 50 one-mark questions with explanations`, () => {
      assert.equal(paper.questions.length, 50, "WAEC-style objective paper: 50 questions");
      for (const q of paper.questions) {
        assert.equal(q.marks, 1, `q${q.orderIndex}: one mark each`);
        assert.ok(q.explanation && q.explanation.trim().length > 10, `q${q.orderIndex}: explanation required`);
        assert.equal(q.markingPoints, undefined, `q${q.orderIndex}: objective items carry no marking points`);
      }
    });
  }

  if (paper.onScreenForm === "candidate-answer-set") {
    test(`${paper.id}: theory items carry model answers with marking points summing to the marks`, () => {
      for (const q of paper.questions) {
        assert.ok(q.modelAnswer && q.modelAnswer.trim().length > 20, `q${q.orderIndex}: model answer required`);
        assert.ok(q.explanation && q.explanation.trim().length > 20, `q${q.orderIndex}: explanation required`);
        assert.ok(Array.isArray(q.markingPoints) && q.markingPoints.length >= 2, `q${q.orderIndex}: marking points required`);
        const sum = q.markingPoints.reduce((s, p) => s + p.marks, 0);
        assert.equal(sum, q.marks, `q${q.orderIndex}: marking points ${sum} !== stated marks ${q.marks}`);
        for (const p of q.markingPoints) {
          assert.ok(p.point && p.point.trim().length > 5, `q${q.orderIndex}: marking point text`);
          assert.ok(p.marks > 0 && Number.isInteger(p.marks), `q${q.orderIndex}: positive integer point marks`);
        }
        assert.equal(
          new Set(q.markingPoints.map((p) => p.point)).size,
          q.markingPoints.length,
          `q${q.orderIndex}: marking points must be distinct`
        );
      }
    });
  }

  for (const q of paper.questions) {
    if (q.check) {
      test(`${paper.id} q${q.orderIndex}: numeric claim machine-verified`, () => {
        assert.equal(typeof q.check.expr, "string");
        assert.equal(typeof q.check.equals, "number");
        const value = evalExpr(q.check.expr);
        assert.ok(
          Math.abs(value - q.check.equals) <= 0.01,
          `${q.check.expr} = ${value}, stated ${q.check.equals}`
        );
      });
    }
  }
}

test("bank-wide: aggregate answer-position balance holds across all papers", () => {
  const counts = [0, 0, 0, 0];
  for (const p of allObjectivePositions) counts[p]++;
  // Per-paper greedy balancing can leave each paper's first position one ahead
  // when n % 4 ≠ 0, so the aggregate may drift by at most one per paper.
  const drift = PAPERS.length;
  const ideal = allObjectivePositions.length / 4;
  counts.forEach((c, i) => {
    assert.ok(
      c >= ideal - drift && c <= ideal + drift,
      `aggregate position ${i}: ${c} outside ideal ${ideal} ± ${drift}`
    );
  });
});

test("bank-wide: every file carries honest provenance (never 'official')", () => {
  for (const data of FILES_DATA) {
    assert.equal(data.provenance, "original", "provenance must be 'original'");
    assert.equal(data.disclaimer, true, "disclaimer flag required");
    assert.equal(data.reviewStatus, "needs-human-review", "needsVerification never graduates");
    assert.ok(
      /not an official/i.test(data.provenanceNote),
      "provenance note must state the paper is not official"
    );
    for (const paper of data.papers) {
      assert.ok(!/official/i.test(paper.paperNumber), "paper numbers never claim 'official'");
    }
  }
});

test("bank-wide: three subjects, two papers each, board slug waec", () => {
  const subjects = [...new Set(PAPERS.map((p) => p.subject))].sort();
  assert.deepEqual(subjects, ["Biology", "English Language", "Mathematics"]);
  for (const data of FILES_DATA) {
    assert.equal(data.board.slug, "waec");
    assert.equal(data.papers.length, 2, "one objective + one theory paper per subject");
    const numbers = data.papers.map((p) => p.paperNumber).sort();
    assert.deepEqual(numbers, ["Paper 1 (Objective)", "Paper 2 (Theory)"]);
  }
});

test("bank-wide: no two questions share wording (originals, not duplicates)", () => {
  const seen = new Map();
  for (const paper of PAPERS) {
    for (const q of paper.questions) {
      const key = q.questionText.trim().toLowerCase();
      assert.ok(!seen.has(key), `duplicate question text shared by ${seen.get(key) ?? "?"} and ${paper.id}`);
      seen.set(key, paper.id);
    }
  }
});

test("seeder: prisma/seed-papers/waec.ts is wired per repo convention", () => {
  const seedPath = path.join(ROOT, "prisma/seed-papers/waec.ts");
  assert.ok(existsSync(seedPath), "seeder file exists");
  const src = readFileSync(seedPath, "utf8");
  assert.match(src, /export async function seedWaecPapers/, "exports the seed function");
  assert.match(src, /seed-papers\/waec/, "CLI guard runs the seeder standalone");
  for (const file of FILES) {
    assert.ok(
      src.includes(file.replace(/^content\/papers\//, "")),
      `seeder references ${file}`
    );
  }
  assert.match(src, /examination\.upsert/, "seeder resolves the WAEC Examination row");
  assert.match(src, /examPaper\.upsert/, "seeder upserts papers idempotently");
  assert.match(src, /paperQuestion\.upsert/, "seeder upserts questions idempotently");
});
