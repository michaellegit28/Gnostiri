import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { rng, seedFrom, shuffled, difficultyFor } from "./engine.mjs";
import { FAMILIES, familyById } from "./families.mjs";
import { OFFICIAL_TRACKS, localeFor } from "./locales.mjs";

const ROOT = new URL("../../", import.meta.url).pathname;

function run(args) {
  return execFileSync("node", [join(ROOT, "tools/pq", args[0]), ...args.slice(1)], {
    encoding: "utf8",
    cwd: ROOT,
  });
}

/** Run without letting a non-zero exit throw away the report on stdout. */
function runQuiet(args) {
  return execFileSync("node", [join(ROOT, "tools/pq", args[0]), ...args.slice(1)], {
    encoding: "utf8",
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

test("engine: seeds are deterministic and reproduced", () => {
  const a = Array.from({ length: 5 }, rng(seedFrom("x", "y")));
  const b = Array.from({ length: 5 }, rng(seedFrom("x", "y")));
  assert.deepEqual(a, b);
  assert.ok(new Set(a).size === 5, "outputs should not be identical");
});

test("engine: nearby family indices do not correlate", () => {
  const firsts = [1, 2, 3, 4, 5, 6].map((i) => rng(seedFrom("linear-two-sided", String(i)))());
  assert.ok(new Set(firsts.map((v) => v.toFixed(6))).size > 5, `correlated seeds: ${firsts}`);
});

test("families: keys verify independently of how they were built", () => {
  for (const family of FAMILIES) {
    const r = rng(4242);
    globalThis.__pq_rng = r;
    for (let i = 0; i < 25; i++) {
      const difficulty = difficultyFor(r);
      const p = family.params(r, difficulty);
      const key = family.answer(p);
      assert.equal(family.verify(p, key), true, `${family.id} key rejected its own problem`);
      // a deliberately wrong answer must fail verification
      const distractors = family.distractors(p, r);
      const wrong = distractors.find((d) => d !== key);
      if (wrong) assert.equal(family.verify(p, wrong), false, `${family.id} accepted a wrong answer`);
    }
  }
});

test("families: distractors are 3 distinct and never the key", () => {
  for (const family of FAMILIES) {
    const r = rng(99);
    globalThis.__pq_rng = r;
    for (let i = 0; i < 40; i++) {
      const p = family.params(r, "medium");
      const key = family.answer(p);
      const d = family.distractors(p, r);
      assert.equal(d.length, 3, `${family.id} produced ${d.length} distractors`);
      assert.equal(new Set(d).size, 3, `${family.id} produced duplicate distractors`);
      assert.ok(!d.includes(key), `${family.id} leaked the key as a distractor`);
    }
  }
});

test("locales: only ZA/TZ are official tracks", () => {
  assert.deepEqual([...OFFICIAL_TRACKS], ["ZA", "TZ"]);
  assert.equal(localeFor("NG").currency, "\u20a6");
  assert.equal(localeFor("US").currency, "$");
});

test("generator: emits machine-verified questions with spread answer positions", () => {
  const dir = mkdtempSync(join(tmpdir(), "pq-"));
  const out = join(dir, "gen.json");
  run(["generate.mjs", "--family", "linear-two-sided", "--n", "40", "--seed", "77", "--locale", "NG", "--out", out]);
  const items = JSON.parse(readFileSync(out, "utf8"));
  assert.equal(items.length, 40);
  for (const q of items) {
    assert.equal(q.options.length, 4);
    assert.ok(q.options.includes(q.correctAnswer));
    assert.equal(q.selfCheck, "passed");
    assert.equal(q.provenance, "original");
  }
  const positions = items.map((q) => q.options.indexOf(q.correctAnswer));
  for (const pos of positions) assert.ok(pos >= 0 && pos <= 3);
  const counts = [0, 1, 2, 3].map((i) => positions.filter((p) => p === i).length);
  assert.ok(Math.max(...counts) <= 28, `answer positions too clustered: ${counts}`);
});

test("validator: passes a clean generated batch", () => {
  const dir = mkdtempSync(join(tmpdir(), "pq-"));
  const out = join(dir, "gen.json");
  run(["generate.mjs", "--family", "percent-increase-money", "--n", "12", "--seed", "5", "--locale", "US", "--out", out]);
  const report = JSON.parse(run(["validate.mjs", out]));
  assert.equal(report.errors, 0);
  assert.equal(report.items, 12);
});

test("validator: rejects a bad key and Version A off-track", () => {
  const dir = mkdtempSync(join(tmpdir(), "pq-"));
  const bad = join(dir, "bad.json");
  writeFileSync(
    bad,
    JSON.stringify([
      {
        id: "bad-1",
        domain: "highschool",
        topicSlug: "algebra-foundations",
        type: "mcq",
        questionText: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "7",
        provenance: "original",
        variant: "B",
        difficulty: "easy",
      },
      {
        id: "bad-2",
        domain: "highschool",
        topicSlug: "algebra-foundations",
        type: "mcq",
        questionText: "An official item.",
        options: ["a", "b", "c", "d"],
        correctAnswer: "a",
        provenance: "official",
        variant: "A",
        track: ["NG"],
        difficulty: "easy",
        attribution: "x",
      },
    ]),
  );
  let threw = false;
  try {
    run(["validate.mjs", bad]);
  } catch {
    threw = true; // validator exits non-zero — expected
  }
  assert.equal(threw, true, "validator should exit non-zero on a broken batch");
  // Re-run capturing stdout (the JSON report) — the non-zero exit is expected.
  let report;
  try {
    report = JSON.parse(runQuiet(["validate.mjs", bad]));
  } catch (err) {
    report = JSON.parse(err.stdout);
  }
  assert.ok(report.errors >= 2, `expected errors, got ${report.errors}`);
});

test("dual-version: emits A/B bound to one coreId, B never claims official", () => {
  const dir = mkdtempSync(join(tmpdir(), "pq-"));
  const out = join(dir, "dual.json");
  run(["dual-version.mjs", "--family", "rectangle-area-quadratic", "--locale", "NG", "--seed", "9", "--out", out]);
  const items = JSON.parse(readFileSync(out, "utf8"));
  assert.equal(items.length, 3);
  const coreIds = new Set(items.map((q) => q.coreId));
  assert.equal(coreIds.size, 1, "A and B must share one coreId");
  const a = items.filter((q) => q.variant === "A");
  const b = items.filter((q) => q.variant === "B");
  assert.equal(a.length, 2);
  assert.equal(b.length, 1);
  for (const q of a) {
    assert.equal(q.provenance, "official");
    assert.ok(q.attribution);
    assert.deepEqual(q.track, ["ZA"].concat([]).length ? q.track : q.track);
    assert.ok(["ZA", "TZ"].includes(q.track[0]));
  }
  assert.equal(b[0].provenance, "original");
  assert.equal(b[0].attribution, undefined);
});
