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

// Each lesson is a { label, snippets, claims } group. Snippets assert the exact
// output the lesson shows; claims assert a numeric fact the lesson relies on.
const LESSONS = [
  {
    label: "lesson 1",
    snippets: [
      {
        name: "classifying the variables",
        code: `data = [\n    {"gender": "male", "gpa": 3.9, "has_pet": True},\n    {"gender": "female", "gpa": 3.7, "has_pet": True},\n    {"gender": "male", "gpa": 3.4, "has_pet": False},\n]\nprint("observations:", len(data))\nprint("numerical (gpa):", [d["gpa"] for d in data])\nprint("categorical (gender):", [d["gender"] for d in data])\nprint("categorical (has_pet):", [d["has_pet"] for d in data])`,
        expected: `observations: 3\nnumerical (gpa): [3.9, 3.7, 3.4]\ncategorical (gender): ['male', 'female', 'male']\ncategorical (has_pet): [True, True, False]`,
      },
    ],
    claims: [
      { name: "mean of a numerical variable is computable", code: `data = [3.9, 3.7, 3.4]\nprint(round(sum(data) / len(data), 3))`, expected: "3.667" },
    ],
  },
  {
    label: "lesson 2",
    snippets: [
      {
        name: "center of a symmetric dataset",
        code: `data = [4, 5, 5, 6, 6, 6, 7, 7, 8]\nn = len(data)\nmean = sum(data) / n\ns = sorted(data)\nif n % 2 == 1:\n    median = s[n // 2]\nelse:\n    median = (s[n // 2 - 1] + s[n // 2]) / 2\nprint("mean:", mean)\nprint("median:", median)`,
        expected: "mean: 6.0\nmedian: 6",
      },
      {
        name: "a skew pulls the mean away from the median",
        code: `data = [200, 250, 260, 280, 900]\nn = len(data)\nmean = sum(data) / n\ns = sorted(data)\nif n % 2 == 1:\n    median = s[n // 2]\nelse:\n    median = (s[n // 2 - 1] + s[n // 2]) / 2\nprint("mean:", mean)\nprint("median:", median)\nprint("mean exceeds median by", round(mean - median, 1))`,
        expected: "mean: 378.0\nmedian: 260\nmean exceeds median by 118.0",
      },
    ],
    claims: [
      { name: "median of an odd count is the middle value", code: `s = sorted([1, 3, 7, 9, 100])\nprint(s[2])`, expected: "7" },
      { name: "median of an even count averages the two middles", code: `s = sorted([2, 4, 6, 8])\nprint((s[1] + s[2]) / 2)`, expected: "5.0" },
    ],
  },
];

test("python3 is available for statistics verification", { skip: !existsSync("/usr/bin/python3") }, () => {
  assert.equal(run(`print("ok")`).stdout, "ok");
});

for (const { label, snippets, claims } of LESSONS) {
  for (const s of snippets) {
    test(`${label} snippet: ${s.name}`, { skip: !existsSync("/usr/bin/python3") }, () => {
      const r = run(s.code, s.stdin);
      assert.ok(r.ok, `snippet failed to run: ${r.stderr}`);
      assert.equal(r.stdout, s.expected, "lesson states this exact output");
    });
  }
  for (const c of claims) {
    test(`${label} claim: ${c.name}`, { skip: !existsSync("/usr/bin/python3") }, () => {
      const r = run(c.code, c.stdin);
      assert.ok(r.ok, `claim failed to run: ${r.stderr}`);
      assert.equal(r.stdout, c.expected);
    });
  }
}
