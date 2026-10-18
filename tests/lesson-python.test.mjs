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

// Lesson 3 (Input, output & operators) worked examples + claims.
const SNIPPETS_L3 = [
  {
    name: "a program that listens",
    code: `name = input()\nprint("Hello, " + name + "!")`,
    expected: "Hello, Ada!",
    stdin: "Ada\n",
  },
  {
    name: "operator precedence",
    code: `print(2 + 3 * 4)\nprint((2 + 3) * 4)`,
    expected: "14\n20",
  },
  {
    name: "operators on strings",
    code: `print("Py" + "thon")\nprint("ha" * 3)`,
    expected: "Python\nhahaha",
  },
  {
    name: "comparison yields bool",
    code: `print(10 > 5)\nprint(10 < 5)\nprint(10 == 10)`,
    expected: "True\nFalse\nTrue",
  },
];

const CLAIMS_L2 = [
  { name: "modulo remainder", code: `print(10 % 3)`, expected: "1" },
  { name: "floor division rounds down", code: `print(7 // 2)`, expected: "3" },
  { name: "type of a decimal", code: `print(type(3.14) is float)`, expected: "True" },
];

// Lesson 4 (Conditions) worked examples.
const SNIPPETS_L4 = [
  {
    name: "the first fork",
    code: `x = 15\nif x > 10:\n    print("big")\nelse:\n    print("small")`,
    expected: "big",
  },
  {
    name: "choosing from many with elif",
    code: `score = 72\nif score >= 85:\n    print("A")\nelif score >= 70:\n    print("B")\nelse:\n    print("C")`,
    expected: "B",
  },
  {
    name: "combining conditions",
    code: `age = 20\nhas_id = True\nif age >= 18 and has_id:\n    print("Welcome")\nelse:\n    print("Entry denied")`,
    expected: "Welcome",
  },
  {
    name: "three outcomes from a sign",
    code: `n = -3\nif n > 0:\n    print("positive")\nelif n < 0:\n    print("negative")\nelse:\n    print("zero")`,
    expected: "negative",
  },
];

// Lesson 5 (Loops) worked examples.
const SNIPPETS_L5 = [
  { name: "the while loop", code: `n = 0\nwhile n < 5:\n    print(n)\n    n = n + 1`, expected: "0\n1\n2\n3\n4" },
  { name: "the for loop", code: `for i in range(3):\n    print(i)`, expected: "0\n1\n2" },
  { name: "stopping early with break", code: `for i in range(10):\n    if i == 3:\n        break\n    print(i)`, expected: "0\n1\n2" },
  { name: "skipping one with continue", code: `for i in range(5):\n    if i == 2:\n        continue\n    print(i)`, expected: "0\n1\n3\n4" },
  { name: "the accumulate pattern", code: `total = 0\nfor i in range(1, 6):\n    total = total + i\nprint("sum:", total)`, expected: "sum: 15" },
];

const CLAIMS_L4 = [
  { name: "not inverts a condition", code: `print(not (5 > 3))`, expected: "False" },
  { name: "exactly one branch runs in a chain", code: `x = 90\nif x >= 70:\n    print("loose")\nelif x >= 85:\n    print("strict")`, expected: "loose" },
  { name: "and requires both true", code: `print(True and False)`, expected: "False" },
  { name: "or requires one true", code: `print(True or False)`, expected: "True" },
];

// Lesson 6 (Logic & debugging basics) worked examples.
const SNIPPETS_L6 = [
  { name: "tracing a loop by hand", code: `total = 0\nfor i in range(1, 4):\n    total = total + i\nprint("total =", total)`, expected: "total = 6" },
  { name: "a logic error with no message", code: `step = "put the lid on"\nprint("step 1:", "take a drink")\nprint("step 2:", step)`, expected: "step 1: take a drink\nstep 2: put the lid on" },
  { name: "semantic error — wrong unit", code: `duration_seconds = 120\nprint("Duration in minutes:", duration_seconds // 60)`, expected: "Duration in minutes: 2" },
];

const CLAIMS_L5 = [
  { name: "range excludes the stop value", code: `print(list(range(3)))`, expected: "[0, 1, 2]" },
  { name: "missing update causes an infinite loop (so we bound it)", code: `n = 0\ncount = 0\nwhile n < 5 and count < 3:\n    print(n)\n    count = count + 1`, expected: "0\n0\n0" },
];

const CLAIMS_L6 = [
  { name: "missing colon is a SyntaxError", code: `for i in range(3)\n    print(i)`, expectedError: /SyntaxError/ },
  { name: "trace total prediction", code: `total = 0\nfor i in range(1, 4):\n    total = total + i\nprint(total)`, expected: "6" },
];

// Lesson 7 (Functions) worked examples.
const SNIPPETS_L7 = [
  { name: "define and call", code: `def greet():\n    print("Hello!")\n\ngreet()\ngreet()`, expected: "Hello!\nHello!" },
  { name: "parameters", code: `def add(a, b):\n    result = a + b\n    return result\n\nprint(add(3, 4))\nprint(add(10, 20))`, expected: "7\n30" },
  { name: "return vs print", code: `def describe(name, age):\n    return name + " is " + str(age)\n\nprint(describe("Ada", 19))`, expected: "Ada is 19" },
  { name: "a default argument", code: `def power(base, exp=2):\n    return base ** exp\n\nprint(power(3))\nprint(power(2, 5))`, expected: "9\n32" },
];

const CLAIMS_L7 = [
  { name: "a function without return hands back None", code: `def f():\n    x = 1\nprint(f() is None)`, expected: "True" },
  { name: "def does not run the body until called", code: `x = 0\ndef f():\n    global x\n    x = 42\nprint(x)`, expected: "0" },
];

// Lesson 8 (Lists & dictionaries) worked examples.
const SNIPPETS_L8 = [
  { name: "lists — build and index", code: `fruits = ["apple", "banana", "cherry"]\nprint(len(fruits))\nprint(fruits[0])\nprint(fruits[1])`, expected: "3\napple\nbanana" },
  { name: "adding to a list and looping", code: `fruits = ["apple", "banana", "cherry"]\nfruits.append("mango")\nprint(len(fruits))\nfor f in fruits:\n    print(f)`, expected: "4\napple\nbanana\ncherry\nmango" },
  { name: "dictionaries — look up by key and update", code: `ages = {"Ada": 19, "Gustav": 34}\nprint(ages["Ada"])\nages["Ada"] = 20\nprint(ages["Ada"])`, expected: "19\n20" },
  { name: "the counting idiom", code: `counts = {}\nfor w in ["the", "cat", "the", "dog"]:\n    counts[w] = counts.get(w, 0) + 1\nprint(counts)`, expected: "{'the': 2, 'cat': 1, 'dog': 1}" },
];

const CLAIMS_L8 = [
  { name: "list indexing starts at zero", code: `print(["a", "b", "c"][0])`, expected: "a" },
  { name: "get returns the default for a missing key", code: `print({}.get("x", 99))`, expected: "99" },
  { name: "bracket lookup of a missing key raises KeyError", code: `print({"a": 1}["b"])`, expectedError: /KeyError/ },
  { name: "append modifies in place", code: `x = [1, 2]\nx.append(3)\nprint(len(x))`, expected: "3" },
];

// Lesson 9 (Strings & files). File-reading snippets create words.txt first
// so they are self-contained and runnable without a fixture on disk.
const WORDS_FILE = `open("words.txt", "w").write("the cat sat\\nthe dog ran\\nthe cat\\n")`;

const SNIPPETS_L9 = [
  { name: "indexing and slicing a string", code: `s = "Python"\nprint(s[0])\nprint(s[-1])\nprint(s[1:4])`, expected: "P\nn\nyth" },
  { name: "splitting a line and stripping", code: `line = "the cat sat"\nwords = line.split()\nprint(len(words))\nprint(words[0])\nprint(repr("  hi \\n".strip()))`, expected: "3\nthe\n'hi'" },
  { name: "reading a file line by line", code: `${WORDS_FILE}\nf = open("words.txt", "r")\nfor line in f:\n    print(line.strip())\nf.close()`, expected: "the cat sat\nthe dog ran\nthe cat" },
  { name: "the capstone — count words from a file", code: `${WORDS_FILE}\ncounts = {}\nfor line in open("words.txt", "r"):\n    for w in line.split():\n        counts[w] = counts.get(w, 0) + 1\nprint(counts)`, expected: "{'the': 3, 'cat': 2, 'sat': 1, 'dog': 1, 'ran': 1}" },
];

const CLAIMS_L9 = [
  { name: "negative index counts from the end", code: `print("Python"[-1])`, expected: "n" },
  { name: "split on whitespace returns a list", code: `print(type("a b".split()) is list)`, expected: "True" },
  { name: "strip trims a newline", code: `print(repr("hi\\n".strip()))`, expected: "'hi'" },
];

// Lesson 10 (Decomposition) worked examples.
const SNIPPETS_L10 = [
  {
    name: "a problem split into three small functions",
    code: `def get_name():\n    return "Ada"\n\ndef make_greeting(name):\n    return "Hello, " + name + "!"\n\ndef print_greeting(greeting):\n    print(greeting)\n\nprint_greeting(make_greeting(get_name()))`,
    expected: "Hello, Ada!",
  },
  {
    name: "a more realistic decomposition",
    code: `def letter_grade(score):\n    if score >= 85:\n        return "A"\n    elif score >= 70:\n        return "B"\n    return "C"\n\ndef summarize(name, score):\n    return name + ": " + letter_grade(score)\n\nprint(summarize("Ada", 92))\nprint(summarize("Ben", 74))`,
    expected: "Ada: A\nBen: B",
  },
];

const CLAIMS_L10 = [
  { name: "functions compose by passing results", code: `def square(x):\n    return x * x\nprint(square(square(2)))`, expected: "16" },
];

// Lesson 11 (Testing & debugging) worked examples.
const SNIPPETS_L11 = [
  {
    name: "a passing test",
    code: `def add(a, b):\n    return a + b\n\nassert add(2, 3) == 5, "add(2, 3) should be 5"\nassert add(-1, 1) == 0, "add(-1, 1) should be 0"\nprint("all tests passed")`,
    expected: "all tests passed",
  },
  {
    name: "a failing test surfaces the bug",
    code: `def add(a, b):\n    return a + b\ntry:\n    assert add(2, 3) == 6, "expected 6"\nexcept AssertionError as e:\n    print("caught:", e)`,
    expected: "caught: expected 6",
  },
  {
    name: "print-instrumentation",
    code: `def find(words, target):\n    for i, w in enumerate(words):\n        print("checking", i, w)\n        if w == target:\n            return i\n    return -1\n\nprint("found at", find(["a", "b", "c"], "b"))`,
    expected: "checking 0 a\nchecking 1 b\nfound at 1",
  },
];

const CLAIMS_L11 = [
  { name: "assert passes silently when true", code: `assert 1 + 1 == 2\nprint("ok")`, expected: "ok" },
  { name: "assert fails and raises when false (caught)", code: `try:\n    assert 1 + 1 == 3\nexcept AssertionError:\n    print("fails")`, expected: "fails" },
];

// Lesson 12 (Mini project / capstone) — the complete word-count program.
const CAPSTONE_FILE = `open("words.txt", "w").write("the cat sat on the mat\\nthe dog chased the cat\\nthe cat ran home\\n")`;
const CAPSTONE = `${CAPSTONE_FILE}\ncounts = {}\nfor line in open("words.txt", "r"):\n    for w in line.split():\n        counts[w] = counts.get(w, 0) + 1\n\ntop_word = None\ntop_count = None\nfor w, c in counts.items():\n    if top_count is None or c > top_count:\n        top_word = w\n        top_count = c\n\nprint("Total distinct words:", len(counts))\nprint("Most common word:", top_word, "appears", top_count, "times")`;

const SNIPPETS_L12 = [
  { name: "capstone stage 1 — read the file", code: `${CAPSTONE_FILE}\nfor line in open("words.txt", "r"):\n    print(line.strip())`, expected: "the cat sat on the mat\nthe dog chased the cat\nthe cat ran home" },
  { name: "capstone stage 2 — split into words", code: `${CAPSTONE_FILE}\nfor line in open("words.txt", "r"):\n    print(line.split())`, expected: "['the', 'cat', 'sat', 'on', 'the', 'mat']\n['the', 'dog', 'chased', 'the', 'cat']\n['the', 'cat', 'ran', 'home']" },
  { name: "capstone stage 3 — count the words", code: `${CAPSTONE_FILE}\ncounts = {}\nfor line in open("words.txt", "r"):\n    for w in line.split():\n        counts[w] = counts.get(w, 0) + 1\nprint(counts)`, expected: "{'the': 5, 'cat': 3, 'sat': 1, 'on': 1, 'mat': 1, 'dog': 1, 'chased': 1, 'ran': 1, 'home': 1}" },
  { name: "capstone stage 4 — find the most common word", code: CAPSTONE, expected: "Total distinct words: 9\nMost common word: the appears 5 times" },
];

const CLAIMS_L12 = [
  { name: "capstone reports the correct tally", code: CAPSTONE, expected: "Total distinct words: 9\nMost common word: the appears 5 times" },
  { name: "empty file yields no most-common word gracefully", code: `open("words.txt", "w").write("")\ncounts = {}\nfor line in open("words.txt", "r"):\n    for w in line.split():\n        counts[w] = counts.get(w, 0) + 1\nprint("distinct:", len(counts))`, expected: "distinct: 0" },
];

const CLAIMS_L3 = [
  { name: "input type is a string", code: `x = input()\nprint(type(x) is str)`, expected: "True", stdin: "7\n" },
  { name: "string times int repeats", code: `x = input()\nprint(x * 3)`, expected: "777", stdin: "7\n" },
  { name: "int conversion enables arithmetic", code: `print(int("7") + 3)`, expected: "10" },
  { name: "single equals is invalid assignment to a literal", code: `10 = 10`, expectedError: /SyntaxError/ },
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

function run(code, stdin) {
  try {
    const out = execFileSync(PYTHON, ["-c", code], { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"], input: stdin || "" });
    return { ok: true, stdout: out.replace(/\n$/, "") };
  } catch (e) {
    return { ok: false, stderr: (e.stderr || e.message || "").toString() };
  }
}

test("python3 is available for lesson verification", { skip: !existsSync("/usr/bin/python3") }, () => {
  assert.equal(run(`print("ok")`).stdout, "ok");
});

const ALL_SNIPPETS = [...SNIPPETS, ...SNIPPETS_L2, ...SNIPPETS_L3, ...SNIPPETS_L4, ...SNIPPETS_L5, ...SNIPPETS_L6, ...SNIPPETS_L7, ...SNIPPETS_L8, ...SNIPPETS_L9, ...SNIPPETS_L10, ...SNIPPETS_L11, ...SNIPPETS_L12];
for (const s of ALL_SNIPPETS) {
  const lesson = SNIPPETS_L2.includes(s) ? "lesson 2" : SNIPPETS_L3.includes(s) ? "lesson 3" : SNIPPETS_L4.includes(s) ? "lesson 4" : SNIPPETS_L5.includes(s) ? "lesson 5" : SNIPPETS_L6.includes(s) ? "lesson 6" : SNIPPETS_L7.includes(s) ? "lesson 7" : SNIPPETS_L8.includes(s) ? "lesson 8" : SNIPPETS_L9.includes(s) ? "lesson 9" : SNIPPETS_L10.includes(s) ? "lesson 10" : SNIPPETS_L11.includes(s) ? "lesson 11" : SNIPPETS_L12.includes(s) ? "lesson 12" : "lesson 1";
  test(`${lesson} snippet: ${s.name}`, { skip: !existsSync("/usr/bin/python3") }, () => {
    const r = run(s.code, s.stdin);
    assert.ok(r.ok, `snippet failed to run: ${r.stderr}`);
    assert.equal(r.stdout, s.expected, "lesson states this exact output");
  });
}

const ALL_CLAIMS = [...CLAIMS, ...CLAIMS_L2, ...CLAIMS_L3, ...CLAIMS_L4, ...CLAIMS_L5, ...CLAIMS_L6, ...CLAIMS_L7, ...CLAIMS_L8, ...CLAIMS_L9, ...CLAIMS_L10, ...CLAIMS_L11, ...CLAIMS_L12];
for (const c of ALL_CLAIMS) {
  const lesson = CLAIMS_L2.includes(c) ? "lesson 2" : CLAIMS_L3.includes(c) ? "lesson 3" : CLAIMS_L4.includes(c) ? "lesson 4" : CLAIMS_L5.includes(c) ? "lesson 5" : CLAIMS_L6.includes(c) ? "lesson 6" : CLAIMS_L7.includes(c) ? "lesson 7" : CLAIMS_L8.includes(c) ? "lesson 8" : CLAIMS_L9.includes(c) ? "lesson 9" : CLAIMS_L10.includes(c) ? "lesson 10" : CLAIMS_L11.includes(c) ? "lesson 11" : CLAIMS_L12.includes(c) ? "lesson 12" : "lesson 1";
  test(`${lesson} claim: ${c.name}`, { skip: !existsSync("/usr/bin/python3") }, () => {
    const r = run(c.code, c.stdin);
    if (c.expectedError) {
      assert.ok(!r.ok, "expected this to raise, but it ran");
      assert.ok(c.expectedError.test(r.stderr), `unexpected error: ${r.stderr}`);
    } else {
      assert.ok(r.ok, `claim failed to run: ${r.stderr}`);
      assert.equal(r.stdout, c.expected);
    }
  });
}
