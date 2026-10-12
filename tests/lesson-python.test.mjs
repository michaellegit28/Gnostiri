// Verifies that every Python snippet embedded in lesson 1 of the
// Introduction to Programming seed produces exactly the output the lesson
// claims. Guarded by PYTHON being available; skipped otherwise so CI on
// machines without python3 does not fail.

import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

const PYTHON = "python3";

// The two worked examples, transcribed from
// prisma/seed-courses/introduction-to-programming.ts (lesson1()).
const SNIPPETS = [
  {
    name: "Example 1 — your first program",
    code: `print("Welcome to Introduction to Programming!")\nprint("2 + 3 =", 2 + 3)`,
    expected: `Welcome to Introduction to Programming!\n2 + 3 = 5`,
  },
  {
    name: "Example 2 — a program that remembers",
    code: `name = "Ada"\nprint("Hello,", name)\nprint("Your name has", len(name), "letters")`,
    expected: `Hello, Ada\nYour name has 3 letters`,
  },
];

// Claims made in the lesson's MCQ explanations; each must hold in real Python.
const CLAIMS = [
  { name: "quoted arithmetic prints literally", code: `print("6 * 7")`, expected: "6 * 7" },
  { name: "unquoted arithmetic is evaluated", code: `print(10 - 4)`, expected: "6" },
  { name: "len counts characters", code: `print(len("Python"))`, expected: "6" },
  {
    name: "capitalised print is undefined",
    code: `Print("hi")`,
    expectedError: /NameError: name 'Print' is not defined/,
  },
  {
    name: "unquoted text is an unknown name",
    code: `print(Hello)`,
    expectedError: /NameError: name 'Hello' is not defined/,
  },
];

function run(code) {
  try {
    const out = execFileSync(PYTHON, ["-c", code], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    return { ok: true, stdout: out.replace(/\n$/, "") };
  } catch (e) {
    return { ok: false, stderr: (e.stderr || e.message || "").toString() };
  }
}

test("python3 is available for lesson verification", { skip: !existsSync("/usr/bin/python3") }, () => {
  assert.equal(run(`print("ok")`).stdout, "ok");
});

for (const s of SNIPPETS) {
  test(`lesson 1 snippet: ${s.name}`, { skip: !existsSync("/usr/bin/python3") }, () => {
    const r = run(s.code);
    assert.ok(r.ok, `snippet failed to run: ${r.stderr}`);
    assert.equal(r.stdout, s.expected, "lesson states this exact output");
  });
}

for (const c of CLAIMS) {
  test(`lesson 1 claim: ${c.name}`, { skip: !existsSync("/usr/bin/python3") }, () => {
    const r = run(c.code);
    if (c.expectedError) {
      assert.ok(!r.ok, "expected this to raise, but it ran");
      assert.ok(c.expectedError.test(r.stderr), `unexpected error: ${r.stderr}`);
    } else {
      assert.ok(r.ok, `claim failed to run: ${r.stderr}`);
      assert.equal(r.stdout, c.expected);
    }
  });
}
