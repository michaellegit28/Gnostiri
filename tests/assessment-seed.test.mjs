// Structural validation for the assessment seed scripts.
//
// Every SBA/EMQ item must satisfy invariants the exam scorer relies on:
//   - correctAnswer is present in options exactly once (scoring compares the
//     learner's selection against it verbatim)
//   - 4 options, no duplicates, none empty
//   - stem/options/explanation non-empty
//   - marks positive, negativeMarks non-negative and below marks
//
// This catches the two real classes of bug that broke items before: an answer
// string that drifts from its option, and duplicate options that make the
// correct answer ambiguous.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const SEEDS = [
  "prisma/seed-assessment-anatomy.ts",
  "prisma/seed-assessment-physiology.ts",
  "prisma/seed-assessment-biochemistry.ts",
];

/** Extract the ITEMS array from a seed file as evaluable source. */
function loadItems(path) {
  const src = readFileSync(path, "utf8");
  const decl = src.indexOf("const ITEMS");
  if (decl === -1) throw new Error(`no ITEMS array in ${path}`);
  // Start at the '[' that follows '=' — skip the TS type annotation,
  // which itself contains brackets (e.g. ItemSeed[]).
  const eq = src.indexOf("=", decl);
  if (eq === -1) throw new Error(`malformed ITEMS declaration in ${path}`);
  const open = src.indexOf("[", eq);
  if (open === -1) throw new Error(`no array literal in ${path}`);
  // Balance brackets from the opening '[' to find the true end of the array.
  let depth = 0;
  let i = open;
  for (; i < src.length; i++) {
    if (src[i] === "[") depth++;
    else if (src[i] === "]") {
      depth--;
      if (depth === 0) break;
    }
  }
  if (depth !== 0) throw new Error(`unterminated ITEMS array in ${path}`);
  const body = src.slice(open, i + 1);
  return new Function(`"use strict"; return (${body});`)();
}

for (const seed of SEEDS) {
  // Skip seeds that are not authored yet (later queue tasks add them).
  test(`${seed}: every item is structurally valid`, { skip: !existsSync(seed) }, () => {
    const items = loadItems(seed);    assert.ok(Array.isArray(items) && items.length > 0, "ITEMS must be a non-empty array");

    const slugs = new Set();
    for (const it of items) {
      assert.ok(it.slug, "item must have a slug");
      assert.ok(!slugs.has(it.slug), `duplicate slug ${it.slug}`);
      slugs.add(it.slug);

      assert.ok(it.stem && it.stem.length > 20, `stem too short: ${it.slug}`);
      assert.ok(it.explanation && it.explanation.length > 20, `explanation too short: ${it.slug}`);

      assert.ok(Array.isArray(it.options), `options must be an array: ${it.slug}`);
      assert.equal(it.options.length, 4, `expected 4 options, got ${it.options.length} (${it.slug})`);

      const seen = new Set();
      for (const opt of it.options) {
        assert.ok(typeof opt === "string" && opt.trim().length > 0, `empty option in ${it.slug}`);
        assert.ok(!seen.has(opt), `duplicate option in ${it.slug}: ${opt}`);
        seen.add(opt);
      }

      const hits = it.options.filter((o) => o === it.correctAnswer);
      assert.equal(hits.length, 1, `correctAnswer must match exactly one option in ${it.slug} (found ${hits.length})`);

      assert.ok(it.marks > 0, `marks must be positive: ${it.slug}`);
      assert.ok(it.negativeMarks === undefined || it.negativeMarks >= 0, `negativeMarks must not be negative: ${it.slug}`);
      assert.ok(it.negativeMarks === undefined || it.negativeMarks < it.marks, `negativeMarks must be below marks: ${it.slug}`);

      assert.ok(["easy", "medium", "hard"].includes(it.difficulty), `bad difficulty: ${it.slug}`);
      assert.ok(["sba", "emq"].includes(it.format), `bad format: ${it.slug}`);
    }

    // Difficulty spread must be present so an exam can be blueprint-balanced.
    const difficulties = new Set(items.map((i) => i.difficulty));
    assert.ok(difficulties.size >= 2, `${seed}: expected a difficulty spread, got ${[...difficulties].join(", ")}`);
  });
}
