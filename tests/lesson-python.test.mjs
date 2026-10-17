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

// Lesson 2 (Variables & types) worked examples.
const SNIPPETS_L2 = [
  {
    name: "a variable that changes",
    code: `age = 19\nprint("Age:", age)\nage = 20\nprint("Age now:", age)`,
    expected: "Age: 19\nAge now: 20",
  },
  {
    name: "telling the types apart",
    code: `print(type(5))\nprint(type(3.14))\nprint(type("hello"))\nprint(type(True))`,
    expected: "<class 'int'>\n<class 'float'>\n<class 'str'>\n<class 'bool'>",
  },
  {
    name: "division is surprising",
    code: `print(10 / 4)\nprint(10 // 4)\nprint(10 % 4)`,
    expected: "2.5\n2\n2",
  },
  {
    name: "converting between types",
    code: `print("The number is " + str(42))\nprint(int("7") + 1)`,
    expected: "The number is 42\n8",
  },
];

// Lesson 2 MCQ/explanation claims.
const CLAIMS_L2 = [
  { name: "modulo remainder", code: `print(10 % 3)`, expected: "1" },
  { name: "floor division rounds down", code: `print(7 // 2)`, expected: "3" },
  { name: "type of a decimal", code: `print(type(3.14) is float)`, expected: "True" },
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

for (const s of [...SNIPPETS, ...SNIPPETS_L2]) {
  const lesson = SNIPPETS_L2.includes(s) ? "lesson 2" : "lesson 1";
  test(`${lesson} snippet: ${s.name}`, { skip: !existsSync("/usr/bin/python3") }, () => {
    const r = run(s.code);
    assert.ok(r.ok, `snippet failed to run: ${r.stderr}`);
    assert.equal(r.stdout, s.expected, "lesson states this exact output");
  });
}

for (const c of [...CLAIMS, ...CLAIMS_L2]) {
  const lesson = CLAIMS_L2.includes(c) ? "lesson 2" : "lesson 1";
  test(`${lesson} claim: ${c.name}`, { skip: !existsSync("/usr/bin/python3") }, () => {
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
