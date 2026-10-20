// Verifies that every Python snippet embedded in the Introduction to
// Programming seed produces exactly the output the lesson claims.
//
// Three things are checked:
//   1. Every worked-example snippet runs and prints the stated output.
//   2. Every claim made in a check-question answer or MCQ explanation holds.
//   3. Every python code block in the seed is actually exercised here — so a
//      lesson snippet cannot silently drift away from its stated output.
//
// Guarded by python3 being available; skipped otherwise so CI on machines
// without python does not fail. File-reading snippets run in a scratch
// directory, so the suite never writes words.txt into the checkout.

import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const PYTHON = "python3";
// The two files the lessons ask the reader to create (printed in the lesson as
// a table), and the capstone program as the lesson writes it.
const L9_FILE = "the cat sat\nthe dog ran\nthe cat\n";
const L12_FILE = "the cat sat on the mat\nthe dog chased the cat\nthe cat ran home\n";
const L12_CAPSTONE = `counts = {}\nfor line in open("words.txt", "r"):\n    for w in line.split():\n        counts[w] = counts.get(w, 0) + 1\n\ntop_word = None\ntop_count = None\nfor w, c in counts.items():\n    if top_count is None or c > top_count:\n        top_word = w\n        top_count = c\n\nprint("Total distinct words:", len(counts))\nprint("Most common word:", top_word, "appears", top_count, "times")`;
const HAS_PYTHON = existsSync("/usr/bin/python3");
const ROOT = path.resolve(import.meta.dirname, "..");
const SEED_FILE = path.join(ROOT, "prisma", "seed-courses", "introduction-to-programming.ts");

// Snippets that read words.txt write it into whatever directory the suite runs
// in, so run the whole suite inside a scratch directory and clean up after.
const WORKDIR = mkdtempSync(path.join(tmpdir(), "gnostiri-lesson-python-"));
const ORIGINAL_CWD = process.cwd();
process.chdir(WORKDIR);
process.on("exit", () => {
  try {
    process.chdir(ORIGINAL_CWD);
    rmSync(WORKDIR, { recursive: true, force: true });
  } catch {
    /* best effort — a scratch dir under the OS temp folder */
  }
});

/**
 * Each lesson carries the snippets that run and the claims that are asserted
 * in prose. `viaStdin` pipes the program to python (so tracebacks report
 * `File "<stdin>"`), `expectedError` asserts the exact interpreter message a
 * lesson quotes.
 */
const LESSONS = [
  {
    id: "lesson 1",
    snippets: [
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
    ],
    claims: [
      { name: "quoted arithmetic prints literally", code: `print("6 * 7")`, expected: "6 * 7" },
      { name: "unquoted arithmetic is evaluated", code: `print(10 - 4)`, expected: "6" },
      { name: "len counts characters", code: `print(len("Python"))`, expected: "6" },
      {
        name: "capitalised print is undefined",
        code: `Print("hi")`,
        expectedError: `Traceback (most recent call last):\n  File "<string>", line 1, in <module>\nNameError: name 'Print' is not defined. Did you mean: 'print'?`,
      },
      {
        name: "unquoted text is an unknown name",
        code: `print(Hello)`,
        expectedError: `Traceback (most recent call last):\n  File "<string>", line 1, in <module>\nNameError: name 'Hello' is not defined`,
      },
    ],
  },
  {
    id: "lesson 2",
    snippets: [
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
    ],
    claims: [
      { name: "modulo remainder", code: `print(10 % 3)`, expected: "1" },
      { name: "floor division rounds down", code: `print(7 // 2)`, expected: "3" },
      { name: "type of a decimal", code: `print(type(3.14) is float)`, expected: "True" },
    ],
  },
  {
    id: "lesson 3",
    snippets: [
      {
        name: "a program that listens",
        code: `name = input()\nprint("Hello, " + name + "!")`,
        expected: "Hello, Ada!",
        stdin: "Ada\n",
      },
      {
        // The exact seed snippet, prompt and all. The lesson shows the output as
        // an interactive session ("What is your name? Ada" then "Hello, Ada!")
        // because the terminal echoes the typed characters; the program itself
        // writes only the prompt (no newline) and the greeting — asserted here.
        name: "a program that listens (exact seed snippet, raw stdout)",
        code: `name = input("What is your name? ")\nprint("Hello, " + name + "!")`,
        expected: "What is your name? Hello, Ada!",
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
    ],
    claims: [
      { name: "input type is a string", code: `x = input()\nprint(type(x) is str)`, expected: "True", stdin: "7\n" },
      { name: "string times int repeats", code: `x = input()\nprint(x * 3)`, expected: "777", stdin: "7\n" },
      { name: "int conversion enables arithmetic", code: `print(int("7") + 3)`, expected: "10" },
      { name: "single equals is invalid assignment to a literal", code: `10 = 10`, expectedError: `  File "<string>", line 1\n    10 = 10\n    ^^\nSyntaxError: cannot assign to literal here. Maybe you meant '==' instead of '='?` },
    ],
  },
  {
    id: "lesson 4",
    snippets: [
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
    ],
    claims: [
      { name: "not inverts a condition", code: `print(not (5 > 3))`, expected: "False" },
      { name: "exactly one branch runs in a chain", code: `x = 90\nif x >= 70:\n    print("loose")\nelif x >= 85:\n    print("strict")`, expected: "loose" },
      { name: "and requires both true", code: `print(True and False)`, expected: "False" },
      { name: "or requires one true", code: `print(True or False)`, expected: "True" },
    ],
  },
  {
    id: "lesson 5",
    snippets: [
      { name: "the while loop", code: `n = 0\nwhile n < 5:\n    print(n)\n    n = n + 1`, expected: "0\n1\n2\n3\n4" },
      { name: "the for loop", code: `for i in range(3):\n    print(i)`, expected: "0\n1\n2" },
      { name: "stopping early with break", code: `for i in range(10):\n    if i == 3:\n        break\n    print(i)`, expected: "0\n1\n2" },
      { name: "skipping one with continue", code: `for i in range(5):\n    if i == 2:\n        continue\n    print(i)`, expected: "0\n1\n3\n4" },
      { name: "the accumulate pattern", code: `total = 0\nfor i in range(1, 6):\n    total = total + i\nprint("sum:", total)`, expected: "sum: 15" },
    ],
    claims: [
      { name: "range excludes the stop value", code: `print(list(range(3)))`, expected: "[0, 1, 2]" },
      { name: "missing update causes an infinite loop (so we bound it)", code: `n = 0\ncount = 0\nwhile n < 5 and count < 3:\n    print(n)\n    count = count + 1`, expected: "0\n0\n0" },
    ],
  },
  {
    id: "lesson 6",
    snippets: [
      { name: "tracing a loop by hand", code: `total = 0\nfor i in range(1, 4):\n    total = total + i\nprint("total =", total)`, expected: "total = 6" },
      {
        // The lesson's worked example 2, verbatim: the colon is missing, so this
        // cannot run. Piped to python on stdin so the message the lesson quotes
        // (`File "<stdin>"`) is what a learner actually sees.
        name: "a syntax error and its message",
        code: `# This is a syntax error — the colon is missing.\nfor i in range(3)\n    print(i)`,
        expectedError: `  File "<stdin>", line 2\n    for i in range(3)\n                     ^\nSyntaxError: expected ':'`,
        viaStdin: true,
      },
      { name: "a logic error with no message", code: `# Bug: the drink is taken before the lid is opened.\nstep = "put the lid on"\nprint("step 1:", "take a drink")\nprint("step 2:", step)`, expected: "step 1: take a drink\nstep 2: put the lid on" },
      { name: "semantic error — wrong unit", code: `# Bug: recorded seconds, but meant minutes.\nduration_seconds = 120\nprint("Duration in minutes:", duration_seconds // 60)`, expected: "Duration in minutes: 2" },
    ],
    claims: [
      { name: "missing colon is a SyntaxError", code: `for i in range(3)\n    print(i)`, expectedError: /SyntaxError/ },
      { name: "trace total prediction", code: `total = 0\nfor i in range(1, 4):\n    total = total + i\nprint(total)`, expected: "6" },
    ],
  },
  {
    id: "lesson 7",
    snippets: [
      { name: "define and call", code: `def greet():\n    print("Hello!")\n\ngreet()\ngreet()`, expected: "Hello!\nHello!" },
      { name: "parameters", code: `def add(a, b):\n    result = a + b\n    return result\n\nprint(add(3, 4))\nprint(add(10, 20))`, expected: "7\n30" },
      { name: "return vs print", code: `def describe(name, age):\n    return name + " is " + str(age)\n\nprint(describe("Ada", 19))`, expected: "Ada is 19" },
      { name: "a default argument", code: `def power(base, exp=2):\n    return base ** exp\n\nprint(power(3))\nprint(power(2, 5))`, expected: "9\n32" },
    ],
    claims: [
      { name: "a function without return hands back None", code: `def f():\n    x = 1\nprint(f() is None)`, expected: "True" },
      { name: "def does not run the body until called", code: `x = 0\ndef f():\n    global x\n    x = 42\nprint(x)`, expected: "0" },
    ],
  },
  {
    id: "lesson 8",
    snippets: [
      { name: "lists — build and index", code: `fruits = ["apple", "banana", "cherry"]\nprint(len(fruits))\nprint(fruits[0])\nprint(fruits[1])`, expected: "3\napple\nbanana" },
      { name: "adding to a list and looping", code: `fruits = ["apple", "banana", "cherry"]\nfruits.append("mango")\nprint(len(fruits))\nfor f in fruits:\n    print(f)`, expected: "4\napple\nbanana\ncherry\nmango" },
      { name: "dictionaries — look up by key and update", code: `ages = {"Ada": 19, "Gustav": 34}\nprint(ages["Ada"])\nages["Ada"] = 20\nprint(ages["Ada"])`, expected: "19\n20" },
      { name: "the counting idiom", code: `counts = {}\nfor w in ["the", "cat", "the", "dog"]:\n    counts[w] = counts.get(w, 0) + 1\nprint(counts)`, expected: "{'the': 2, 'cat': 1, 'dog': 1}" },
    ],
    claims: [
      { name: "list indexing starts at zero", code: `print(["a", "b", "c"][0])`, expected: "a" },
      { name: "get returns the default for a missing key", code: `print({}.get("x", 99))`, expected: "99" },
      { name: "bracket lookup of a missing key raises KeyError", code: `print({"a": 1}["b"])`, expectedError: /KeyError/ },
      { name: "append modifies in place", code: `x = [1, 2]\nx.append(3)\nprint(len(x))`, expected: "3" },
    ],
  },
  {
    id: "lesson 9",
    snippets: [
      { name: "indexing and slicing a string", code: `s = "Python"\nprint(s[0])\nprint(s[-1])\nprint(s[1:4])`, expected: "P\nn\nyth" },
      { name: "splitting a line and stripping", code: `line = "the cat sat"\nwords = line.split()\nprint(len(words))\nprint(words[0])\nprint(repr("  hi \\n".strip()))`, expected: "3\nthe\n'hi'" },
      // Verbatim from the seed. The lesson shows words.txt as a table the reader
      // creates, so the harness writes the same three lines before running.
      { name: "reading a file line by line", code: `f = open("words.txt", "r")\nfor line in f:\n    print(line.strip())\nf.close()`, fixture: L9_FILE, expected: "the cat sat\nthe dog ran\nthe cat" },
      { name: "the capstone — count words from a file", code: `counts = {}\nfor line in open("words.txt", "r"):\n    for w in line.split():\n        counts[w] = counts.get(w, 0) + 1\nprint(counts)`, fixture: L9_FILE, expected: "{'the': 3, 'cat': 2, 'sat': 1, 'dog': 1, 'ran': 1}" },
    ],
    claims: [
      { name: "negative index counts from the end", code: `print("Python"[-1])`, expected: "n" },
      { name: "split on whitespace returns a list", code: `print(type("a b".split()) is list)`, expected: "True" },
      { name: "strip trims a newline", code: `print(repr("hi\\n".strip()))`, expected: "'hi'" },
    ],
  },
  {
    id: "lesson 10",
    snippets: [
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
    ],
    claims: [{ name: "functions compose by passing results", code: `def square(x):\n    return x * x\nprint(square(square(2)))`, expected: "16" }],
  },
  {
    id: "lesson 11",
    snippets: [
      {
        name: "a passing test",
        code: `def add(a, b):\n    return a + b\n\nassert add(2, 3) == 5, "add(2, 3) should be 5"\nassert add(-1, 1) == 0, "add(-1, 1) should be 0"\nprint("all tests passed")`,
        expected: "all tests passed",
      },
      {
        // The seed snippet includes the def, so the AssertionError it quotes is
        // the one a reader actually gets running it.
        name: "a failing test surfaces the bug",
        code: `def add(a, b):\n    return a + b\n\ntry:\n    assert add(2, 3) == 6, "expected 6"\nexcept AssertionError as e:\n    print("caught:", e)`,
        expected: "caught: expected 6",
      },
      {
        name: "print-instrumentation",
        code: `def find(words, target):\n    for i, w in enumerate(words):\n        print("checking", i, w)\n        if w == target:\n            return i\n    return -1\n\nprint("found at", find(["a", "b", "c"], "b"))`,
        expected: "checking 0 a\nchecking 1 b\nfound at 1",
      },
    ],
    claims: [
      { name: "assert passes silently when true", code: `assert 1 + 1 == 2\nprint("ok")`, expected: "ok" },
      { name: "assert fails and raises when false (caught)", code: `try:\n    assert 1 + 1 == 3\nexcept AssertionError:\n    print("fails")`, expected: "fails" },
    ],
  },
  {
    id: "lesson 12",
    snippets: [
      { name: "capstone stage 1 — read the file", code: `for line in open("words.txt", "r"):\n    print(line.strip())`, fixture: L12_FILE, expected: "the cat sat on the mat\nthe dog chased the cat\nthe cat ran home" },
      { name: "capstone stage 2 — split into words", code: `for line in open("words.txt", "r"):\n    print(line.split())`, fixture: L12_FILE, expected: "['the', 'cat', 'sat', 'on', 'the', 'mat']\n['the', 'dog', 'chased', 'the', 'cat']\n['the', 'cat', 'ran', 'home']" },
      { name: "capstone stage 3 — count the words", code: `counts = {}\nfor line in open("words.txt", "r"):\n    for w in line.split():\n        counts[w] = counts.get(w, 0) + 1\nprint(counts)`, fixture: L12_FILE, expected: "{'the': 5, 'cat': 3, 'sat': 1, 'on': 1, 'mat': 1, 'dog': 1, 'chased': 1, 'ran': 1, 'home': 1}" },
      { name: "capstone stage 4 — find the most common word", code: `counts = {}\nfor line in open("words.txt", "r"):\n    for w in line.split():\n        counts[w] = counts.get(w, 0) + 1\n\ntop_word = None\ntop_count = None\nfor w, c in counts.items():\n    if top_count is None or c > top_count:\n        top_word = w\n        top_count = c\n\nprint("Total distinct words:", len(counts))\nprint("Most common word:", top_word, "appears", top_count, "times")`, fixture: L12_FILE, expected: "Total distinct words: 9\nMost common word: the appears 5 times" },
    ],
    claims: [
      { name: "capstone reports the correct tally", code: L12_CAPSTONE, fixture: L12_FILE, expected: "Total distinct words: 9\nMost common word: the appears 5 times" },
      { name: "empty file yields no most-common word gracefully", code: `open("words.txt", "w").write("")\ncounts = {}\nfor line in open("words.txt", "r"):\n    for w in line.split():\n        counts[w] = counts.get(w, 0) + 1\nprint("distinct:", len(counts))`, expected: "distinct: 0" },
      // The lesson warns about forgetting the empty-file case: the capstone as
      // written must at least not crash on an empty dictionary.
      { name: "the capstone survives an empty file", code: L12_CAPSTONE, fixture: "", expected: "Total distinct words: 0\nMost common word: None appears None times" },
    ],
  },
];

function run(code, options = {}) {
  const { stdin = "", viaStdin = false, fixture = null } = options;
  const args = viaStdin ? ["-"] : ["-c", code];
  // The lesson prints the words.txt contents as a table the reader creates, so
  // the harness creates the same file in the scratch directory before running.
  if (fixture != null) writeFileSync("words.txt", fixture);
  try {
    const stdout = execFileSync(PYTHON, args, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"], input: viaStdin ? code : stdin });
    return { ok: true, stdout: stdout.replace(/\n$/, ""), stderr: "" };
  } catch (e) {
    return { ok: false, stdout: ((e && e.stdout) || "").toString().replace(/\n$/, ""), stderr: ((e && e.stderr) || e.message || "").toString().replace(/\n$/, "") };
  }
}

// One assertion shape for both snippets and claims: `expected` is the exact
// stdout, `expectedError` is the exact interpreter message (or a pattern).
function assertMatches(actual, wanted, { ok, stderr, what }) {
  if (wanted instanceof RegExp) {
    assert.ok(wanted.test(stderr), `unexpected interpreter message for ${what}:\n${stderr}`);
    return;
  }
  if (ok) {
    assert.equal(actual, wanted, `stated output for ${what}`);
  } else {
    assert.equal(stderr, wanted, `stated interpreter message for ${what}`);
  }
}

function assertExpectation(entry, what) {
  const r = run(entry.code, { stdin: entry.stdin, viaStdin: entry.viaStdin, fixture: entry.fixture });
  if (!entry.expectedError) {
    assert.ok(r.ok, `${what} failed to run: ${r.stderr}`);
    assertMatches(r.stdout, entry.expected, { ok: r.ok, stderr: r.stderr, what });
    return;
  }
  assert.ok(!r.ok, `${what} is stated to fail, but it ran cleanly`);
  assertMatches(r.stdout, entry.expectedError, { ok: r.ok, stderr: r.stderr, what });
}

test("python3 is available for lesson verification", { skip: !HAS_PYTHON }, () => {
  assert.equal(run(`print("ok")`).stdout, "ok");
});

test("python3 is Python 3", { skip: !HAS_PYTHON }, () => {
  const version = execFileSync(PYTHON, ["--version"], { encoding: "utf8" }).trim();
  assert.match(version, /^Python 3\./, `expected Python 3.x, got ${version}`);
});

let snippetCount = 0;
let claimCount = 0;

for (const lesson of LESSONS) {
  for (const s of lesson.snippets) {
    snippetCount += 1;
    test(`${lesson.id} snippet: ${s.name}`, { skip: !HAS_PYTHON }, () => {
      assertExpectation(s, `snippet "${s.name}"`);
    });
  }

  for (const c of lesson.claims) {
    claimCount += 1;
    test(`${lesson.id} claim: ${c.name}`, { skip: !HAS_PYTHON }, () => {
      assertExpectation(c, `claim "${c.name}"`);
    });
  }
}

// --- Seed coverage: nothing in the course escapes this suite -------------
// A lesson claim is only trustworthy if machine-checked, so the snippets the
// suite runs must cover every python code block the seed ships.

function unescape(source) {
  return source.replace(/\\(.)/g, (_match, ch) => (ch === "n" ? "\n" : ch === "t" ? "\t" : ch));
}

function parseLiteral(raw) {
  const body = raw.trim();
  if (body.startsWith("`")) return unescape(body.slice(1, body.lastIndexOf("`")));
  const quote = body[0];
  return unescape(body.slice(1, body.lastIndexOf(quote)));
}

// The lessonN() content functions, split into [{ id, body }].
function lessonBodies() {
  const source = readFileSync(SEED_FILE, "utf8");
  const boundaries = [...source.matchAll(/^function (lesson\d+)\(\): LessonContent \{/gm)].map((m) => ({ id: m[1], at: m.index }));
  return boundaries.map((boundary, i) => ({
    id: boundary.id,
    body: source.slice(boundary.at, i + 1 < boundaries.length ? boundaries[i + 1].at : source.length),
  }));
}

function seedPythonBlocks() {
  const blocks = [];
  for (const lesson of lessonBodies()) {
    for (const m of lesson.body.matchAll(/type: "code",\s*\n\s*language: "python",\s*\n\s*code: (`(?:[^`]|\\`)*`|"(?:[^"\\]|\\.)*")/g)) {
      blocks.push({ lesson: lesson.id, code: parseLiteral(m[1]) });
    }
  }
  return blocks;
}

const RUN_CODES = new Set(LESSONS.flatMap((l) => [...l.snippets, ...l.claims]).map((entry) => (entry.code || "").trim()));

test("the suite runs every python code block the seed ships", { skip: !HAS_PYTHON || !existsSync(SEED_FILE) }, () => {
  const blocks = seedPythonBlocks();
  assert.ok(blocks.length >= 40, `expected 12 authored lessons to carry many code blocks, found ${blocks.length}`);
  const untested = blocks.filter((b) => !RUN_CODES.has(b.code.trim()));
  assert.deepEqual(
    untested.map((b) => `${b.lesson}: ${b.code.split("\n")[0]}…`),
    [],
    "every code block in the seed must be run and asserted by this suite"
  );
});

test("each lesson carries its full format", { skip: !existsSync(SEED_FILE) }, () => {
  const bodies = lessonBodies();
  assert.equal(bodies.length, 12, "12 authored lessons");
  for (const lesson of bodies) {
    const count = (re) => (lesson.body.match(re) || []).length;
    assert.equal(count(/type: "mcq"/g), 8, `${lesson.id} should carry 8 MCQs`);
    assert.equal(count(/type: "question"/g), 3, `${lesson.id} should carry 3 inline checks`);
    assert.ok(count(/type: "callout"/g) >= 3, `${lesson.id} should carry at least 3 mistake callouts`);
    assert.ok(count(/type: "code"/g) >= 2, `${lesson.id} should carry worked examples`);
    assert.ok(count(/type: "heading", level: 2, text: "Learning outcomes"/g) === 1, `${lesson.id} needs learning outcomes`);
    assert.ok(count(/type: "heading", level: 2, text: "Prerequisites"/g) === 1, `${lesson.id} needs prerequisites`);
    assert.ok(count(/type: "heading", level: 2, text: "The big idea"/g) === 1, `${lesson.id} needs a big idea`);
    assert.ok(count(/type: "heading", level: 2, text: "Common mistakes"/g) === 1, `${lesson.id} needs common mistakes`);
    assert.ok(count(/type: "heading", level: 2, text: "Check your understanding"/g) === 1, `${lesson.id} needs inline checks`);
    assert.ok(count(/type: "heading", level: 2, text: "Multiple choice"/g) === 1, `${lesson.id} needs MCQs`);
    assert.ok(count(/type: "heading", level: 2, text: "Summary and next"/g) === 1, `${lesson.id} needs a summary`);
  }
});

test("the suite runs every claim and snippet it declares", { skip: !HAS_PYTHON }, () => {
  assert.ok(snippetCount >= 44, `expected every worked example to be run, got ${snippetCount}`);
  assert.ok(claimCount >= 30, `expected the prose claims to be checked, got ${claimCount}`);
});
