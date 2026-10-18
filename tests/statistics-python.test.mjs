// Verifies that every numeric claim/worked example in the Applied Statistics
// seed produces exactly the output the lesson states. Every example is run
// against real CPython and the numbers compared — nothing is stated from memory.
//
// Guarded by PYTHON being available; skipped otherwise so CI without python3
// does not fail.

import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

const PYTHON = "python3";

function run(code, stdin) {
  try {
    const out = execFileSync(PYTHON, ["-c", code], { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"], input: stdin || "" });
    return { ok: true, stdout: out.replace(/\n$/, "") };
  } catch (e) {
    return { ok: false, stderr: (e.stderr || e.message || "").toString() };
  }
}

// Lesson 1 (What is data & variables) worked examples.
const SNIPPETS_L1 = [
  {
    name: "classifying the variables",
    code: `data = [\n    {"gender": "male", "gpa": 3.9, "has_pet": True},\n    {"gender": "female", "gpa": 3.7, "has_pet": True},\n    {"gender": "male", "gpa": 3.4, "has_pet": False},\n]\nprint("observations:", len(data))\nprint("numerical (gpa):", [d["gpa"] for d in data])\nprint("categorical (gender):", [d["gender"] for d in data])\nprint("categorical (has_pet):", [d["has_pet"] for d in data])`,
    expected: `observations: 3\nnumerical (gpa): [3.9, 3.7, 3.4]\ncategorical (gender): ['male', 'female', 'male']\ncategorical (has_pet): [True, True, False]`,
  },
];

const CLAIMS_L1 = [
  {
    name: "mean of a numerical variable is computable",
    code: `data = [3.9, 3.7, 3.4]\nprint(round(sum(data) / len(data), 3))`,
    expected: "3.667",
  },
];

test("python3 is available for statistics verification", { skip: !existsSync("/usr/bin/python3") }, () => {
  assert.equal(run(`print("ok")`).stdout, "ok");
});

for (const s of SNIPPETS_L1) {
  test(`lesson 1 snippet: ${s.name}`, { skip: !existsSync("/usr/bin/python3") }, () => {
    const r = run(s.code, s.stdin);
    assert.ok(r.ok, `snippet failed to run: ${r.stderr}`);
    assert.equal(r.stdout, s.expected, "lesson states this exact output");
  });
}

for (const c of CLAIMS_L1) {
  test(`lesson 1 claim: ${c.name}`, { skip: !existsSync("/usr/bin/python3") }, () => {
    const r = run(c.code, c.stdin);
    assert.ok(r.ok, `claim failed to run: ${r.stderr}`);
    assert.equal(r.stdout, c.expected);
  });
}
