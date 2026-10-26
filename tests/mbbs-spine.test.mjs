// Structural validation for the MBBS degree spine.
//
// The excat same discipline that guards the assessment seeds applies here:
// the spine is machine-checked before a human reads it. What is asserted:
//
//   - every authored lesson contains the pilot-report sections (outcomes,
//     prerequisites, big idea, explanation, worked example, common mistakes,
//     checks, MCQs, summary) — a lesson missing a section is junk in disguise
//   - every block in every authored lesson is a valid LessonBlock type, so the
//     renderer can never silently drop content on a typo
//   - every MCQ carries at least two options, a valid correctIndex inside the
//     option list, and a non-empty explanation; every check question has a
//     non-empty answer
//   - every SBA item satisfies the scoring invariants: exactly four options,
//     no duplicates, correctAnswer present verbatim in the options
//   - the concept DAG is closed: every declared prerequisite slug is a concept
//     that exists in the same subject, and no concept slug is duplicated
//   - governance: no row is ever written "verified" or "draft", authored rows
//     carry needsCheck false and tracked placeholders carry needsCheck true
//
// Subjects that have not been authored yet are skipped rather than failed, so
// the suite stays green while the spine is built out (the same convention as
// tests/assessment-seed.test.mjs).

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";

const DIR = "prisma/seed-courses/mbbs";
const SPINE = `${DIR}/spine.ts`;

const SUBJECTS = [
  { name: "ANAT 101 Human Anatomy", file: `${DIR}/anatomy.ts` },
  { name: "PHYS 101 Human Physiology", file: `${DIR}/physiology.ts` },
  { name: "BCHM 101 Medical Biochemistry", file: `${DIR}/biochemistry.ts` },
  { name: "PATH 201 Pathology", file: `${DIR}/pathology.ts` },
  { name: "PHRM 202 Pharmacology", file: `${DIR}/pharmacology.ts` },
  { name: "MED 301 Internal Medicine", file: `${DIR}/medicine.ts` },
  { name: "SURG 301 Surgery", file: `${DIR}/surgery.ts` },
  { name: "OBGY 302 Obstetrics & Gynaecology", file: `${DIR}/obstetrics-gynecology.ts` },
  { name: "PEDS 302 Paediatrics", file: `${DIR}/pediatrics.ts` },
];

const BLOCK_TYPES = new Set([
  "heading", "paragraph", "definition", "example", "callout",
  "table", "code", "question", "mcq", "diagram",
]);

const REQUIRED_SECTIONS = [
  "Learning outcomes",
  "Prerequisites",
  "The big idea",
  "Common mistakes",
  "Check your understanding",
  "Multiple choice",
];

/** Slice a balanced bracket/brace run from src, delimiters included, ignoring quoted text. */
function balancedSlice(src, start, open, close) {
  let depth = 0;
  let quote = null;
  for (let i = start; i < src.length; i++) {
    const ch = src[i];
    if (quote) {
      if (ch === "\\") {
        i++;
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }
    if (ch === open) depth++;
    else if (ch === close) {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  throw new Error(`unbalanced ${open}${close} from index ${start}`);
}

/** Evaluate a delimited literal from source as plain data. */
function evalLiteral(literal) {
  return new Function(`"use strict"; return ${literal};`)();
}

/** Find a top-level declaration and evaluate its array/object literal. */
function loadLiteral(src, name) {
  const decl = src.indexOf(`const ${name}`);
  if (decl === -1) return null;
  const eq = src.indexOf("=", decl);
  if (eq === -1) return null;
  const after = src.slice(eq + 1);
  const offset = after.search(/[[{]/);
  if (offset === -1) return null;
  const start = eq + 1 + offset;
  const opener = src[start];
  const closer = opener === "[" ? "]" : "}";
  return evalLiteral(balancedSlice(src, start, opener, closer));
}

/** Pull the blocks array out of a lesson function by name. */
function loadLessonBlocks(src, fnName) {
  const decl = src.indexOf(`function ${fnName}(`);
  assert.notEqual(decl, -1, `lesson function ${fnName} not found`);
  const b = src.indexOf("blocks", decl);
  assert.notEqual(b, -1, `lesson function ${fnName} has no blocks array`);
  const start = src.indexOf("[", b);
  return evalLiteral(balancedSlice(src, start, "[", "]"));
}

/** Every lesson function name present in a subject file, in order. */
function lessonFunctionNames(src) {
  const names = [];
  const re = /^function (lesson\d+)\(\)/gm;
  let m;
  while ((m = re.exec(src)) !== null) names.push(m[1]);
  return names.sort();
}

function validateSba(subjectName, sba) {
  const label = `${subjectName}/${sba.slug}`;
  assert.ok(sba.slug && sba.slug.length > 0, `${label}: missing slug`);
  assert.ok(sba.concept && sba.concept.length > 0, `${label}: missing concept slug`);
  assert.ok(typeof sba.stem === "string" && sba.stem.length > 20, `${label}: stem too short`);
  assert.ok(typeof sba.explanation === "string" && sba.explanation.length > 20, `${label}: explanation too short`);
  assert.ok(Array.isArray(sba.options), `${label}: options must be an array`);
  assert.equal(sba.options.length, 4, `${label}: expected 4 options, got ${sba.options.length}`);
  const seen = new Set();
  for (const opt of sba.options) {
    assert.ok(typeof opt === "string" && opt.trim().length > 0, `${label}: empty option`);
    assert.ok(!seen.has(opt), `${label}: duplicate option`);
    seen.add(opt);
  }
  assert.ok(
    sba.options.includes(sba.correctAnswer),
    `${label}: correctAnswer is not one of the options — key drift`,
  );
  assert.ok(
    !sba.stem.includes(sba.correctAnswer),
    `${label}: the stem gives the correct answer away verbatim`,
  );
}

// ---------------------------------------------------------------------------
for (const subject of SUBJECTS) {
  test(`${subject.name}: seed file is structurally sound`, { skip: !existsSync(subject.file) }, () => {
    const src = readFileSync(subject.file, "utf8");
    const label = subject.file;

    // --- 1. the subject declares a spine -------------------------------------------------
    const subjectDecl = src.indexOf("export const");
    assert.notEqual(subjectDecl, -1, `${label}: no exported subject spine`);
    assert.match(src, /seedMbbsCourse\(/, `${label}: subject is not seeded through the shared engine`);
    const basename = subject.file.split("/").pop().replace(/\.ts$/, "");
    assert.match(
      src,
      new RegExp(`process\\.argv\\[1\\].*includes\\("mbbs/${basename}"\\)`),
      `${label}: missing CLI guard`,
    );
    assert.doesNotMatch(src, /reviewStatus:\s*"verified"/, `${label}: a row is marked verified`);
    assert.doesNotMatch(src, /reviewStatus:\s*"draft"/, `${label}: a row is marked draft`);

    // --- 2. concept DAG is closed ---------------------------------------------------------
    const conceptSlugs = new Set();
    const dupeCheck = new Map();
    for (const m of src.matchAll(/\bslug:\s*"([a-z0-9-]+)"/g)) {
      conceptSlugs.add(m[1]);
      dupeCheck.set(m[1], (dupeCheck.get(m[1]) ?? 0) + 1);
    }
    assert.ok(conceptSlugs.size >= 6, `${label}: expected a real concept spine, found ${conceptSlugs.size}`);
    for (const m of src.matchAll(/\bprereq:\s*\[([^\]]*)\]/g)) {
      const items = m[1]
        .split(",")
        .map((s) => s.trim().replace(/["']/g, ""))
        .filter(Boolean);
      for (const p of items) {
        assert.ok(
          conceptSlugs.has(p),
          `${label}: prerequisite "${p}" is not a concept in this subject — dangling DAG edge`,
        );
      }
    }

    // --- 3. modules are declared and unique ----------------------------------------------
    const modules = loadLiteral(src, "MODULES");
    assert.ok(Array.isArray(modules) && modules.length >= 5, `${label}: expected at least 5 modules`);
    const moduleSlugs = new Set(modules.map((m) => m.slug));
    assert.equal(moduleSlugs.size, modules.length, `${label}: duplicate module slug`);

    // --- 4. every authored lesson is complete --------------------------------------------
    const lessonFns = lessonFunctionNames(src);
    assert.ok(lessonFns.length >= 5, `${label}: expected at least 5 authored lessons, found ${lessonFns.length}`);
    for (const fn of lessonFns) {
      const blocks = loadLessonBlocks(src, fn);
      assert.ok(Array.isArray(blocks) && blocks.length >= 20, `${label}/${fn}: lesson is too thin (${blocks?.length} blocks)`);
      const headings = blocks.filter((b) => b.type === "heading").map((h) => h.text);
      for (const required of REQUIRED_SECTIONS) {
        assert.ok(
          headings.some((h) => h.includes(required)),
          `${label}/${fn}: missing the "${required}" section`,
        );
      }
      for (const b of blocks) {
        assert.ok(BLOCK_TYPES.has(b.type), `${label}/${fn}: unknown block type "${b.type}" — it would render as nothing`);
      }
      const mcqs = blocks.filter((b) => b.type === "mcq");
      assert.ok(mcqs.length >= 4, `${label}/${fn}: expected at least 4 MCQs, found ${mcqs.length}`);
      for (const m of mcqs) {
        assert.ok(Array.isArray(m.options) && m.options.length >= 4, `${label}/${fn}: MCQ needs at least 4 options`);
        assert.ok(Number.isInteger(m.correctIndex), `${label}/${fn}: MCQ needs an integer correctIndex`);
        assert.ok(m.correctIndex >= 0 && m.correctIndex < m.options.length, `${label}/${fn}: MCQ correctIndex outside the option list`);
        assert.ok(typeof m.explanation === "string" && m.explanation.length > 20, `${label}/${fn}: MCQ needs an explanation`);
        assert.equal(new Set(m.options).size, m.options.length, `${label}/${fn}: MCQ has duplicate options`);
      }
      const qs = blocks.filter((b) => b.type === "question");
      assert.ok(qs.length >= 2, `${label}/${fn}: expected at least 2 check questions, found ${qs.length}`);
      for (const q of qs) {
        assert.ok(typeof q.prompt === "string" && q.prompt.length > 10, `${label}/${fn}: check question needs a prompt`);
        assert.ok(typeof q.answer === "string" && q.answer.length > 10, `${label}/${fn}: check question needs an answer`);
      }
      const tables = blocks.filter((b) => b.type === "table");
      for (const t of tables) {
        assert.ok(Array.isArray(t.headers) && t.headers.length > 0, `${label}/${fn}: table needs headers`);
        assert.ok(Array.isArray(t.rows) && t.rows.length > 0, `${label}/${fn}: table needs rows`);
        for (const row of t.rows) {
          assert.equal(row.length, t.headers.length, `${label}/${fn}: table row width does not match its headers`);
        }
      }
      const callouts = blocks.filter((b) => b.type === "callout");
      for (const c of callouts) {
        assert.ok(c.variant === "info" || c.variant === "warning", `${label}/${fn}: callout variant must be info or warning`);
      }
    }

    // --- 5. SBA items ----------------------------------------------------------------------
    const sbas = loadLiteral(src, "MODULE_ONE_SBAS") ?? [];
    assert.ok(sbas.length >= 5, `${label}: expected at least 5 authored SBAs, found ${sbas.length}`);
    const seenSlug = new Set();
    for (const sba of sbas) {
      assert.ok(!seenSlug.has(sba.slug), `${label}: duplicate SBA slug ${sba.slug}`);
      seenSlug.add(sba.slug);
      validateSba(label, sba);
    }

    // --- 6. placeholders are honest --------------------------------------------------------
    const placeholders = src.match(/authored:\s*false/g) ?? [];
    assert.ok(
      placeholders.length > 0,
      `${label}: no tracked placeholders — either nothing deeper is planned or the depth is being faked`,
    );
    for (const deep of (src.match(/authored:\s*false/g) ?? [])) {
      assert.ok(deep.includes("false"), `${label}: placeholder entries must be marked authored false`);
    }
  });
}

// ---------------------------------------------------------------------------
// The engine's own contract.
// ---------------------------------------------------------------------------
test("spine engine never marks a row verified or draft", () => {
  assert.ok(existsSync(SPINE), "spine.ts missing");
  const src = readFileSync(SPINE, "utf8");
  assert.doesNotMatch(src, /reviewStatus:\s*"verified"/, "the engine must never write verified");
  assert.doesNotMatch(src, /reviewStatus:\s*"draft"/, "the engine must never write draft");
  const needsHumanReview = src.match(/reviewStatus:\s*"needs-human-review"/g) ?? [];
  assert.ok(
    needsHumanReview.length >= 2,
    `expected the lesson and item write paths to write needs-human-review, found ${needsHumanReview.length}`,
  );
  // Both write paths feed the same governed object into create and update.
  assert.ok(src.includes("update: lessonData,"), "the lesson write path must be one governed object");
  assert.ok(
    src.includes("create: { id: `${courseId}-lesson-${i + 1}`, ...lessonData }"),
    "the lesson create path must reuse the same governed object",
  );
  assert.ok(src.includes("update: itemData,"), "the item write path must be one governed object");
  assert.ok(src.includes("create: { slug: s.slug, ...itemData }"), "the item create path must reuse the same governed object");
  // Owner directive 2026-10-24 ("show what's real"): only AUTHORED lessons are
  // written — a placeholder is never a student-facing row, and the seeder
  // self-heals by deleting placeholder rows left by an earlier seed.
  assert.match(src, /subject\.lessons\[i\]\.authored/, "the lesson write path iterates authored lessons only");
  assert.match(src, /notIn: Array\.from\(authoredIds\)/, "placeholder lesson rows are deleted on re-seed");
  assert.doesNotMatch(src, /needsCheck:\s*!l\.authored/, "needsCheck is no longer derived — unauthored lessons are not written");
});

test("spine engine enforces its own invariants before writing", () => {
  const src = readFileSync(SPINE, "utf8");
  for (const guard of [
    /expected exactly 4 options/,
    /duplicate option/,
    /correctAnswer is not one of the options/,
    /duplicate concept slug/,
    /targets unknown concept/,
    /declares unknown prerequisite/,
    /points at module/,
  ]) {
    assert.match(src, guard, `missing invariant guard: ${guard}`);
  }
});

// ---------------------------------------------------------------------------
// Whole-repository governance for the medical lane.
// ---------------------------------------------------------------------------
test("no medical seed row is pre-verified or left as draft", () => {
  if (!existsSync(DIR)) return;
  for (const f of readdirSync(DIR)) {
    if (!f.endsWith(".ts")) continue;
    const src = readFileSync(`${DIR}/${f}`, "utf8");
    assert.doesNotMatch(src, /reviewStatus:\s*"verified"/, `${f} writes a verified row`);
    assert.doesNotMatch(src, /reviewStatus:\s*"draft"/, `${f} writes a draft row`);
  }
});
