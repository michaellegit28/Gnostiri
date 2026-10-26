import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Assessment content — Introduction to Programming (CSC 101).
 *
 * 14 original SBA items deepening the Intro to Programming bank from 12 to 26,
 * tagged to the existing ConceptNodes (see prisma/seed-university.ts).
 * orderIndex starts at 12 so the twelve pre-existing items (0-11) keep their
 * slots.
 *
 * Coverage: variables and types, control flow, loops, functions, data
 * structures, algorithms (binary search), debugging (logic and traceback
 * reading) and problem solving.
 *
 * Governance: every item ships reviewStatus "needs-human-review" — production
 * rows must never sit at "draft". marks 1, negativeMarks 0.25 per platform
 * convention. Each correctAnswer is copied verbatim from one option, so the
 * seed's option rotation cannot drift the answer key.
 */

const COURSE_SLUG = "introduction-to-programming";
const START_INDEX = 12;

interface ItemSeed {
  slug: string;
  concept: string;
  format: "sba" | "emq";
  stem: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  marks: number;
  difficulty: "easy" | "medium" | "hard";
  needsCheck?: boolean;
}

const ITEMS: ItemSeed[] = [
  // 1 — Variables and types: dynamic typing (easy)
  {
    slug: "introduction-to-programming--variables-and-types--dynamic-typing",
    concept: "variables-and-types",
    format: "sba",
    stem: "In Python, `age = input()` raises a TypeError when the next line is `age + 1`, but `age = int(input())` works. What does this tell you about Python variables?",
    options: [
      "Names carry no fixed type — the object does, so the string returned by input() must be converted before arithmetic",
      "Variables must be declared with a type, and int(input()) rewrites the declared type of the name age",
      "input() returns an int in Python 3 whenever the user types digits",
      "The TypeError comes from the + operator, which cannot add two user-supplied values",
    ],
    correctAnswer:
      "Names carry no fixed type — the object does, so the string returned by input() must be converted before arithmetic",
    explanation:
      "Python is dynamically typed: a name is a label bound to an object, and the object carries the type. input() always returns a string, so arithmetic requires an explicit int() or float() conversion. The practical rule is that input() text must be converted before it is used numerically.",
    difficulty: "easy",
    marks: 1,
    needsCheck: false,
  },

  // 2 — Variables and types: rebinding versus mutation (medium)
  {
    slug: "introduction-to-programming--variables-and-types--rebinding-vs-mutation",
    concept: "variables-and-types",
    format: "sba",
    stem: "a = [1, 2, 3], then b = a, then b.append(4). What are the values of a and b after this code runs?",
    options: [
      "Both hold the list 1, 2, 3, 4 — append mutates the single object both names point to",
      "a holds 1, 2, 3 and b holds 1, 2, 3, 4, because b is a copy of a",
      "Both still hold 1, 2, 3, because append cannot reach through another name",
      "a holds the longer list and b the shorter one, because mutation affects only the newest name",
    ],
    correctAnswer:
      "Both hold the list 1, 2, 3, 4 — append mutates the single object both names point to",
    explanation:
      "Assignment binds b to the same list object, so a is b evaluates True and mutating through either name is visible through the other. Copying requires an explicit call such as list(a) or a slice, for example a[:]. This aliasing is a common source of surprising bugs for beginners.",
    difficulty: "medium",
    marks: 1,
  },

  // 3 — Control flow: truthiness and short-circuit or (medium)
  {
    slug: "introduction-to-programming--conditionals--or-truthiness",
    concept: "conditionals",
    format: "sba",
    stem: "With x = 0 and s set to the string hello, what does print(x or s) output?",
    options: [
      "hello — or returns its first truthy operand, or the last operand if none is truthy",
      "True — or always converts its result to a boolean",
      "0 — or always returns its first operand",
      "A TypeError, because an int and a str cannot share one expression",
    ],
    correctAnswer:
      "hello — or returns its first truthy operand, or the last operand if none is truthy",
    explanation:
      "Python's or does not return a boolean; it returns one of the operands themselves, short-circuiting as soon as a truthy one is reached. Because 0 is falsy, evaluation continues to the string hello. This is the standard idiom for defaults, as in name or anonymous.",
    difficulty: "medium",
    marks: 1,
  },

  // 4 — Control flow: sentinel loop structure (easy)
  {
    slug: "introduction-to-programming--loops--sentinel-while",
    concept: "loops",
    format: "sba",
    stem: "You must read numbers from the user until 0 is entered and print their total. Which loop structure is correct?",
    options: [
      "Read one value before the loop, loop while the value is not 0, add it inside the body, then read the next value at the end of the body",
      "Use for i in range(count) and ask the user in advance how many numbers they will supply",
      "Use while True with the read placed only in the condition and never in the body",
      "Use for value in user_inputs, which knows when the user decides to stop typing",
    ],
    correctAnswer:
      "Read one value before the loop, loop while the value is not 0, add it inside the body, then read the next value at the end of the body",
    explanation:
      "A sentinel loop needs a priming read before the loop so the condition can be tested, and an identical read inside the body so the tested value can change. Missing either read produces an infinite loop, because the condition never advances past the sentinel value.",
    difficulty: "easy",
    marks: 1,
  },

  // 5 — Algorithms: nested loop trace (hard)
  {
    slug: "introduction-to-programming--loops--nested-range-trace",
    concept: "loops",
    format: "sba",
    stem: "How many lines does this print? for i in range(3): then for j in range(i): then print(i, j)",
    options: [
      "Three lines, because range(i) runs i times and 0 plus 1 plus 2 equals 3",
      "Six lines, because the outer loop runs three times and the inner loop runs twice per pass",
      "Nine lines, because the inner loop runs three times for each of the three outer passes",
      "Two lines, because the inner loop never executes",
    ],
    correctAnswer:
      "Three lines, because range(i) runs i times and 0 plus 1 plus 2 equals 3",
    explanation:
      "The inner body runs only when range(i) is non-empty, giving 0 iterations for i = 0, one for i = 1 and two for i = 2, a total of three. Nested loops give a simple multiple of the outer count only when the inner bound is constant; a varying bound has to be traced value by value.",
    difficulty: "hard",
    marks: 1,
  },

  // 6 — Functions: parameter scope and immutability (medium)
  {
    slug: "introduction-to-programming--functions--parameter-scope",
    concept: "functions",
    format: "sba",
    stem: "A function bump(x) contains the line x = x + 1. The caller sets a = 5 and calls bump(a). What is the value of a afterwards?",
    options: [
      "5 — the parameter is a local name rebound inside the function, and ints are immutable",
      "6 — numbers, like lists, are passed by reference and mutate in place",
      "6 — Python passes every argument as a direct reference to the caller's object",
      "0 — the function resets any global variable that shares the name",
    ],
    correctAnswer:
      "5 — the parameter is a local name rebound inside the function, and ints are immutable",
    explanation:
      "Calling a function creates a new local binding for x, so the assignment x = x + 1 never reaches the caller's variable. Reassigning a name differs from mutating a shared object, which is why appending to a list parameter is visible to the caller while this arithmetic is not.",
    difficulty: "medium",
    marks: 1,
  },

  // 7 — Functions: the mutable default argument pitfall (hard)
  {
    slug: "introduction-to-programming--functions--mutable-default",
    concept: "functions",
    format: "sba",
    stem: "A function collect(item, bucket=[]) appends item to bucket and returns bucket. After separate calls collect('a'), collect('b') and collect('c'), what does the third call return?",
    options: [
      "A list holding a, b and c — the default list is created once when the def runs and shared by every call that omits it",
      "A list holding only c — a default value is re-created fresh on each call",
      "An empty list — Python rejects mutable values used as defaults",
      "A tuple holding a, b and c — Python converts list defaults to tuples for safety",
    ],
    correctAnswer:
      "A list holding a, b and c — the default list is created once when the def runs and shared by every call that omits it",
    explanation:
      "Default argument values are evaluated exactly once, when the def statement executes, so the same list object persists and accumulates items across calls. The standard fix is to default to None and build a new list inside the function body, which makes each call independent.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false,
  },

  // 8 — Data structures: hashed lookup versus linear scan (medium)
  {
    slug: "introduction-to-programming--lists-dictionaries--hash-lookup",
    concept: "lists-dictionaries",
    format: "sba",
    stem: "A program must perform 10,000 membership checks against a fixed collection of 1,000 names. Which data structure choice is best, and why?",
    options: [
      "A set or dictionary — hashed lookup is roughly constant time while scanning a list grows with its size",
      "A list — lists preserve order, whereas dictionaries lose their order",
      "A list of tuples — linear scanning is always faster for collections of 1,000 items",
      "It makes no difference — Python makes every lookup equally fast internally",
    ],
    correctAnswer:
      "A set or dictionary — hashed lookup is roughly constant time while scanning a list grows with its size",
    explanation:
      "Sets and dictionaries use hashing, so average membership testing stays constant time whether the collection holds 1,000 or 1,000,000 entries, while the in operator on a list is linear in its length. Choose a list when order and duplicates matter, and a set or dict when fast lookup matters.",
    difficulty: "medium",
    marks: 1,
  },

  // 9 — Data structures: half-open slicing (easy)
  {
    slug: "introduction-to-programming--lists-dictionaries--slice-half-open",
    concept: "lists-dictionaries",
    format: "sba",
    stem: "nums holds the list 10, 20, 30, 40, 50. What is the value of nums[1:4]?",
    options: [
      "A list holding 20, 30 and 40 — the start index is included and the stop index is excluded",
      "A list holding 20, 30, 40 and 50 — the stop index counts as part of the slice",
      "A list holding 10, 20, 30 and 40 — Python list indices begin at 1",
      "A list holding 20 and 30 — a slice excludes both endpoints",
    ],
    correctAnswer:
      "A list holding 20, 30 and 40 — the start index is included and the stop index is excluded",
    explanation:
      "Python slices are half-open: the start index is included, the stop index is the first one excluded, so nums[1:4] yields indices 1, 2 and 3. The same rule explains why nums[:n] copies the first n items and why omitting a bound defaults to the corresponding end of the list.",
    difficulty: "easy",
    marks: 1,
  },

  // 10 — Python syntax: strings are immutable (easy)
  {
    slug: "introduction-to-programming--strings-files--string-immutability",
    concept: "strings-files",
    format: "sba",
    stem: "A variable s holds the string hello and the next line runs s[0] = 'H'. What happens?",
    options: [
      "A TypeError — strings are immutable, so the new value must be built, for example 'H' + s[1:]",
      "s becomes Hello, because item assignment works on every Python sequence",
      "Nothing at all — the assignment is silently ignored for strings",
      "A ValueError, because capital letters are not valid string characters",
    ],
    correctAnswer:
      "A TypeError — strings are immutable, so the new value must be built, for example 'H' + s[1:]",
    explanation:
      "Str objects do not support item assignment, so a changed string has to be constructed with concatenation and slicing, or with methods such as replace, upper and join. Lists do allow item assignment, and that contrast is what makes string immutability memorable.",
    difficulty: "easy",
    marks: 1,
  },

  // 11 — Algorithms: binary search trace (hard)
  {
    slug: "introduction-to-programming--decomposition--binary-search-trace",
    concept: "decomposition",
    format: "sba",
    stem: "A sorted list holds 10, 20, 30, 40, 50, 60 and 70. Binary search starts with low at index 0 and high at index 6, and computes the middle index as low plus high divided by 2 using floor division. When searching for 10, which value is examined first?",
    options: [
      "40 — the middle index is 3, and the value at index 3 is 40",
      "10 — binary search always begins by testing the first element",
      "40 — binary search averages the first and last values rather than the indices",
      "60 — a list of 7 items rounds its middle index up to 4",
    ],
    correctAnswer: "40 — the middle index is 3, and the value at index 3 is 40",
    explanation:
      "With low 0 and high 6, floor division gives a middle index of 3, which holds 40. Because the target 10 is smaller, high moves to 2; the next middle index is 1, holding 20; then high moves to 0 and the middle index 0 holds 10, so the search succeeds. Each probe halves the remaining range, which is the algorithm's advantage over a linear scan.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false,
  },

  // 12 — Debugging: reading a traceback (medium)
  {
    slug: "introduction-to-programming--testing-debugging--traceback-read",
    concept: "testing-debugging",
    format: "sba",
    stem: "A script stops with IndexError: list index out of range, and the traceback points at the line print(values[3]). What is the correct first response?",
    options: [
      "Check the length of values and the boundary: a 3-element list has indices 0 to 2, so index 3 is one past the end",
      "Wrap the print in a try/except that passes, and move on to the next task",
      "Report the interpreter as broken and reinstall Python before continuing",
      "Add a global len(values) call to fix the list itself",
    ],
    correctAnswer:
      "Check the length of values and the boundary: a 3-element list has indices 0 to 2, so index 3 is one past the end",
    explanation:
      "Tracebacks are read bottom-up: the last line names the exception and the frame below it names the statement that failed. Off-by-one boundary errors are the most common cause of IndexError, so the fix is to reproduce the input, inspect the loop bound, and correct the index or range.",
    difficulty: "medium",
    marks: 1,
  },

  // 13 — Debugging: off-by-one in an accumulator loop (easy)
  {
    slug: "introduction-to-programming--logic-debugging-basics--off-by-one",
    concept: "logic-debugging-basics",
    format: "sba",
    stem: "A program meant to average 5 test scores returns a total that is too high, and added print statements show the loop ran 6 times. What is the most likely bug?",
    options: [
      "The loop bound is off by one, for example range(n + 1) was written instead of range(n)",
      "The scores are floats, so addition is approximate and always overshoots",
      "The accumulator should be reset to 0 inside the loop on every pass",
      "The print statements themselves change the values being summed",
    ],
    correctAnswer:
      "The loop bound is off by one, for example range(n + 1) was written instead of range(n)",
    explanation:
      "Iteration counts are the classic off-by-one bug: range(n) yields exactly n items, while range(n + 1) adds one spurious pass. Printing the counter and the running total on each iteration localises the error immediately, because the last, unwanted pass becomes visible.",
    difficulty: "easy",
    marks: 1,
  },

  // 14 — Problem solving: specify and decompose first (medium)
  {
    slug: "introduction-to-programming--mini-project--spec-first-plan",
    concept: "mini-project",
    format: "sba",
    stem: "You are asked to write a program that reads a CSV of student marks and prints the top three. Which first step reflects good problem solving?",
    options: [
      "Restate the inputs and outputs in plain language, decompose the work into read-and-parse, rank, and print, then implement and test one piece at a time",
      "Write the entire program in one sitting and run it only when the whole file is complete",
      "Choose a GUI framework first so the interface is settled before any logic is written",
      "Find a complete solution online and paste it in, then change variable names so it fits",
    ],
    correctAnswer:
      "Restate the inputs and outputs in plain language, decompose the work into read-and-parse, rank, and print, then implement and test one piece at a time",
    explanation:
      "Decomposition starts by making the contract explicit — what goes in, what comes out — and then splits the problem into small pieces that can be tested independently. Writing everything before the first run removes the ability to localise a fault, and borrowed code that is not understood cannot be debugged or defended.",
    difficulty: "medium",
    marks: 1,
  },
];

async function seedAssessmentIntroductionToProgramming() {
  const course = await prisma.course.findFirst({
    where: { slug: COURSE_SLUG },
    select: { id: true },
  });
  if (!course)
    throw new Error(
      `Course ${COURSE_SLUG} not found. Run prisma/seed-university.ts first.`,
    );

  const concepts = await prisma.conceptNode.findMany({
    where: { courseId: course.id },
    select: { id: true, slug: true },
  });
  const conceptBySlug = new Map(concepts.map((c) => [c.slug, c.id]));

  let count = 0;
  for (let i = 0; i < ITEMS.length; i++) {
    const it = ITEMS[i];
    const conceptId = conceptBySlug.get(it.concept);
    if (!conceptId) throw new Error(`Concept ${it.concept} not found in ${COURSE_SLUG}`);
    // Deterministic rotation by item index: uniform key spread, stable
    // across re-runs; correctAnswer is option TEXT so rotation is safe.
    const rot = i % it.options.length;
    const opts = [...it.options.slice(rot), ...it.options.slice(0, rot)];
    if (!opts.includes(it.correctAnswer)) {
      throw new Error(`correctAnswer not present in options for ${it.slug} — answer/key drift`);
    }
    await prisma.assessmentItem.upsert({
      where: { slug: it.slug },
      update: {
        conceptId,
        stem: it.stem,
        options: opts,
        correctAnswer: it.correctAnswer,
        explanation: it.explanation,
        marks: it.marks,
        negativeMarks: 0.25,
        orderIndex: START_INDEX + i,
        difficulty: it.difficulty,
        reviewStatus: "needs-human-review",
        needsCheck: it.needsCheck ?? false,
      },
      create: {
        slug: it.slug,
        courseId: course.id,
        conceptId,
        format: it.format,
        stem: it.stem,
        options: opts,
        correctAnswer: it.correctAnswer,
        explanation: it.explanation,
        marks: it.marks,
        negativeMarks: 0.25,
        orderIndex: START_INDEX + i,
        isPublished: true,
        difficulty: it.difficulty,
        // Post-repair convention: production rows never sit at "draft".
        reviewStatus: "needs-human-review",
        needsCheck: it.needsCheck ?? false,
      },
    });
    count++;
  }

  console.log(`✓ CSC 101 assessment items: ${count} items (marks 1, needs-human-review)`);
}

// CLI usage: npx ts-node prisma/seed-assessment-introduction-to-programming.ts
if (process.argv[1] && process.argv[1].includes("seed-assessment-introduction-to-programming")) {
  seedAssessmentIntroductionToProgramming()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}

export { seedAssessmentIntroductionToProgramming, ITEMS as INTRODUCTION_TO_PROGRAMMING_ITEMS };
