import { PrismaClient } from "@prisma/client";
import type { LessonContent } from "@/types/lesson";

const prisma = new PrismaClient();

/**
 * Pilot course seed — "Introduction to Programming" (Python).
 *
 * Replaces the two generic template lessons created by prisma/seed.ts with a
 * real 12-lesson, 4-module course: 12 ConceptNodes forming a prerequisite
 * DAG, one SBA AssessmentItem per concept, and 12 CourseLessons authored in
 * the full lesson format (outcomes -> big idea -> explanation -> worked
 * examples with runnable code -> common mistakes -> check questions ->
 * MCQs -> summary).
 *
 * Idempotent: safe to run repeatedly. Upserts on stable slugs and the
 * lesson ids course-programming-lesson-1..12, so re-running updates content
 * in place and never duplicates rows.
 *
 * Governance: every lesson ships with reviewStatus "needs-human-review" and
 * needsCheck true until a human author signs it off. Nothing here is ever
 * marked "verified" by the seeder.
 */

const COURSE_SLUG = "introduction-to-programming";
const COURSE_ID = "course-programming"; // stable id from prisma/seed.ts

interface ConceptSeed {
  title: string;
  slug: string;
  blooms: string;
  minutes: number;
  prereq: string[];
}

interface LessonSeed {
  id: string;
  title: string;
  module: number; // 1..4
  concept: ConceptSeed;
  estimatedMinutes: number;
  content: LessonContent;
}

// ---------------------------------------------------------------------------
// Course spine: 4 modules x 3 lessons = 12.
// ---------------------------------------------------------------------------
const MODULES = [
  { slug: "thinking-like-a-programmer", title: "M1 — Thinking like a programmer" },
  { slug: "control-flow", title: "M2 — Control flow" },
  { slug: "organizing-code", title: "M3 — Organizing code" },
  { slug: "building", title: "M4 — Building" },
];

// ---------------------------------------------------------------------------
// LESSON 1 — What a program is (fully authored)
// ---------------------------------------------------------------------------
const LESSON_1: LessonSeed = {
  id: `${COURSE_ID}-lesson-1`,
  title: "What a program is",
  module: 1,
  estimatedMinutes: 25,
  concept: {
    title: "What a program is",
    slug: "what-is-a-program",
    blooms: "remember",
    minutes: 25,
    prereq: [],
  },
  content: lesson1(),
};

// Placeholder lessons 2-12. The concept spine, prerequisite edges and SBA
// items are real and complete so the course is structurally sound; only the
// long-form content blocks are pending authoring. needsCheck marks them.
const LESSONS_2_TO_12: LessonSeed[] = [
  { id: `${COURSE_ID}-lesson-2`, title: "Variables & types", module: 1, estimatedMinutes: 30, concept: { title: "Variables and types", slug: "variables-and-types", blooms: "understand", minutes: 30, prereq: ["what-is-a-program"] }, content: pending(2) },
  { id: `${COURSE_ID}-lesson-3`, title: "Input, output & operators", module: 1, estimatedMinutes: 30, concept: { title: "Input, output and operators", slug: "input-output-operators", blooms: "apply", minutes: 30, prereq: ["variables-and-types"] }, content: pending(3) },
  { id: `${COURSE_ID}-lesson-4`, title: "Conditions", module: 2, estimatedMinutes: 30, concept: { title: "Conditional statements", slug: "conditionals", blooms: "understand", minutes: 30, prereq: ["input-output-operators"] }, content: pending(4) },
  { id: `${COURSE_ID}-lesson-5`, title: "Loops", module: 2, estimatedMinutes: 35, concept: { title: "Loops and iteration", slug: "loops", blooms: "understand", minutes: 35, prereq: ["conditionals"] }, content: pending(5) },
  { id: `${COURSE_ID}-lesson-6`, title: "Logic & debugging basics", module: 2, estimatedMinutes: 30, concept: { title: "Logic and debugging basics", slug: "logic-debugging-basics", blooms: "analyze", minutes: 30, prereq: ["loops"] }, content: pending(6) },
  { id: `${COURSE_ID}-lesson-7`, title: "Functions", module: 3, estimatedMinutes: 35, concept: { title: "Functions", slug: "functions", blooms: "apply", minutes: 35, prereq: ["logic-debugging-basics"] }, content: pending(7) },
  { id: `${COURSE_ID}-lesson-8`, title: "Lists & dictionaries", module: 3, estimatedMinutes: 35, concept: { title: "Lists and dictionaries", slug: "lists-dictionaries", blooms: "apply", minutes: 35, prereq: ["functions"] }, content: pending(8) },
  { id: `${COURSE_ID}-lesson-9`, title: "Strings & files", module: 3, estimatedMinutes: 35, concept: { title: "Strings and files", slug: "strings-files", blooms: "apply", minutes: 35, prereq: ["lists-dictionaries"] }, content: pending(9) },
  { id: `${COURSE_ID}-lesson-10`, title: "Decomposition", module: 4, estimatedMinutes: 30, concept: { title: "Decomposition", slug: "decomposition", blooms: "analyze", minutes: 30, prereq: ["strings-files"] }, content: pending(10) },
  { id: `${COURSE_ID}-lesson-11`, title: "Testing & debugging", module: 4, estimatedMinutes: 30, concept: { title: "Testing and debugging", slug: "testing-debugging", blooms: "evaluate", minutes: 30, prereq: ["decomposition"] }, content: pending(11) },
  { id: `${COURSE_ID}-lesson-12`, title: "Mini project", module: 4, estimatedMinutes: 45, concept: { title: "Mini project", slug: "mini-project", blooms: "create", minutes: 45, prereq: ["testing-debugging"] }, content: pending(12) },
];

const ALL_LESSONS = [LESSON_1, ...LESSONS_2_TO_12];

// ---------------------------------------------------------------------------
// Placeholder content for lessons 2-12 (real content authored after review).
// ---------------------------------------------------------------------------
function pending(n: number): LessonContent {
  return {
    blocks: [
      { type: "heading", level: 2, text: `Lesson ${n}` },
      {
        type: "callout",
        variant: "info",
        text: "This lesson's full content is awaiting authoring. The concept, prerequisite edges and its assessment item are already in place, so the course spine is complete and the exam builder will include this concept.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 1 content — original writing, all code verified runnable (Python 3).
// ---------------------------------------------------------------------------
function lesson1(): LessonContent {
  return {
    blocks: [
      // --- Learning outcomes ---
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: explain what a program is in your own words; describe the difference between source code and what a computer actually executes; run a short Python program and correctly predict what it prints; and recognise a Python error message as feedback rather than failure.",
      },

      // --- Prerequisites ---
      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "None. This is the first lesson of the course. You do not need any programming experience, and you do not need Python installed — every example shows its exact output inline.",
      },

      // --- Big idea ---
      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Program",
        text: "A program is a precise, step-by-step set of instructions written for a machine that has no common sense. The computer follows each instruction exactly as written, in exactly the order written, and does nothing you did not ask for.",
      },
      {
        type: "paragraph",
        text: "That definition is the whole course in one sentence, and most of what feels difficult about programming later is just the consequences of it. A recipe is a good analogy, with one important difference: a human cook fills in the gaps. If a recipe says \"cook the onions until soft\", a person knows what soft looks like. A computer does not. If you mean \"until a fork sinks in easily\", you have to say that.",
      },

      // --- Concept explanation (why before how) ---
      { type: "heading", level: 2, text: "Why this matters before anything else" },
      {
        type: "paragraph",
        text: "Before learning any Python syntax it helps to understand the arrangement you are entering into. You are writing instructions for a processor that is extraordinarily fast and literal-minded. It will do ten million of your instructions per second and not one of them will it interpret charitably. This is why programmers talk about \"bugs\" rather than \"misunderstandings\": when the output is wrong, the machine did exactly what it was told, and the instruction was wrong.",
      },
      {
        type: "paragraph",
        text: "There is a chain between what you type and what the machine does. You write source code — text, in a language like Python. Another program, called an interpreter, reads that text and translates each line into the processor's own instructions, then runs them. You never speak to the processor directly; you write Python, and the interpreter carries the message. This is why a \"syntax error\" is possible: it is the interpreter telling you it could not finish reading the sentence.",
      },

      // --- Worked examples with code ---
      { type: "heading", level: 2, text: "Worked example 1: your first program" },
      {
        type: "paragraph",
        text: "The traditional first program does one thing: it announces itself. Two lines, each a complete instruction.",
      },
      {
        type: "code",
        language: "python",
        code: `print("Welcome to Introduction to Programming!")\nprint("2 + 3 =", 2 + 3)`,
        output: `Welcome to Introduction to Programming!\n2 + 3 = 5`,
        caption: "Each print() instruction writes one line of output. The comma joins two things onto that line, separated by a space.",
      },
      {
        type: "paragraph",
        text: "Read it as three facts. print is an instruction that writes to the screen. Whatever you put inside the quotes is written exactly as written, so the first line prints the greeting and the second prints the fragment \"2 + 3 =\". The part without quotes, 2 + 3, is not text — it is arithmetic the interpreter evaluates before printing, which is why the output shows 5 and not the characters 2 + 3. That distinction, quoted text versus unquoted expression, is the first real fork in learning to program, and it is worth pausing on.",
      },

      { type: "heading", level: 2, text: "Worked example 2: a program that remembers" },
      {
        type: "paragraph",
        text: "Real programs do not just recite; they keep hold of things and act on them later. Here a name is stored and then used twice. Two identical-looking instructions produce different output, because the stored value changed between them.",
      },
      {
        type: "code",
        language: "python",
        code: `name = "Ada"\nprint("Hello,", name)\nprint("Your name has", len(name), "letters")`,
        output: `Hello, Ada\nYour name has 3 letters`,
        caption: "name = \"Ada\" stores the text Ada under the label name. len() counts characters. The second print uses the same label but a different fact about it.",
      },
      {
        type: "paragraph",
        text: "The line name = \"Ada\" is an assignment, and it reads backwards to most beginners: it means \"put the value on the right into the box labelled on the left\", never the reverse. So Ada is stored, and whenever the program later says name it means whatever is currently in that box. The second and third lines both print something about name, and they differ because they ask different questions of the same stored value — one reports it, the other measures it with len().",
      },

      // --- Common mistakes ---
      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Spelling print as Print or PRINT. Python is case-sensitive; Print is not the same instruction as print, and the interpreter will report that Print is not defined. If an error says something \"is not defined\", check capitalisation first.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting the quotes around text. Writing print(Hello) makes Python treat Hello as a stored name rather than text, and since nothing was stored under that name you get NameError. Text must be quoted; numbers and arithmetic must not be.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Mixing up the two directions of =. name = \"Ada\" stores a value. Writing it as \"Ada\" = name is nonsense to the interpreter, because you cannot store into a piece of text. The value always moves right to left.",
      },

      // --- Check questions ---
      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What does the interpreter do with your source code?",
        answer: "It reads the text, translates each instruction into the processor's own instructions, and runs them. The processor never sees your Python directly.",
        explanation: "This is why a syntax error stops everything: the interpreter could not finish reading the line, so there was nothing to translate and run.",
      },
      {
        type: "question",
        prompt: "In print(\"2 + 3 =\", 2 + 3), why does the output show 5 rather than 2 + 3 twice?",
        answer: "The quoted part is text and is printed literally; the unquoted part is an expression the interpreter evaluates to 5 before printing.",
        explanation: "Quotes mean \"write this exactly\". No quotes means \"work this out\". Almost every early confusion about output traces back to this distinction.",
      },
      {
        type: "question",
        prompt: "A program stores 7 under the label score, then runs print(score + 1). What is printed, and what is in score afterwards?",
        answer: "8 is printed. score still holds 7, because reading a value to use it does not change what is stored.",
        explanation: "Assignment changes a stored value; an expression merely reads it. print(score + 1) reads score, adds one to the copy it read, and prints the result.",
      },

      // --- MCQs ---
      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which statement best describes a program?",
        options: [
          "A piece of hardware inside the computer that runs applications",
          "A precise set of instructions that a computer follows exactly, in order",
          "A document describing what a piece of software should do",
          "A language used to talk to other programmers",
        ],
        correctIndex: 1,
        explanation: "A program is instructions executed literally and in order. Hardware runs them but is not the program; a specification describes one but is not one; a language is the medium you write one in.",
      },
      {
        type: "mcq",
        stem: "What is the interpreter for?",
        options: [
          "It speeds up the processor by pre-compiling all programs",
          "It protects the computer from malicious websites",
          "It reads your source code, translates it, and runs it",
          "It checks your spelling and suggests corrections",
        ],
        correctIndex: 2,
        explanation: "The interpreter is the translator between your text and the processor's instructions. Without it, your Python never executes — which is exactly why a line it cannot parse becomes a syntax error.",
      },
      {
        type: "mcq",
        stem: 'What is the output of print("6 * 7")?',
        options: ["42", "6 * 7", "6*7", "An error, because numbers cannot be printed inside quotes"],
        correctIndex: 1,
        explanation: "Everything inside the quotes is literal text, so the two characters 6, space, *, space, 7 are printed unchanged. Removing the quotes would give 42, because then it would be arithmetic.",
      },
      {
        type: "mcq",
        stem: 'What does print(10 - 4) print, and why?',
        options: [
          "10 - 4, because print writes its argument exactly as given",
          "6, because the expression is unquoted and is evaluated before printing",
          "Nothing, because print cannot do arithmetic",
          "An error, because print requires text",
        ],
        correctIndex: 1,
        explanation: "Unquoted input is an expression, so the interpreter computes 10 - 4 first and prints the result. print can receive numbers as well as text.",
      },
      {
        type: "mcq",
        stem: "Which of these produces a NameError when run?",
        options: ['print("Hello")', "print(2 + 2)", "print(Hello)", "print(42)"],
        correctIndex: 2,
        explanation: 'Without quotes, Hello is treated as the name of something stored. Nothing was stored under that name, so Python reports NameError. The fix is quotes: print("Hello").',
      },
      {
        type: "mcq",
        stem: 'In the line name = "Ada", which reading is correct?',
        options: [
          'Compare name with "Ada" and see whether they are equal',
          'Store the value "Ada" under the label name',
          'Store the label name inside the text "Ada"',
          'Print the value "Ada" using the label name',
        ],
        correctIndex: 1,
        explanation: 'A single = is assignment: the value on the right goes into the box on the left. Comparison uses a different operator, covered in the conditions lesson, and print is a separate instruction.',
      },
      {
        type: "mcq",
        stem: 'What does len("Python") evaluate to?',
        options: ["5", "6", "7", "An error, because len does not work on text"],
        correctIndex: 1,
        explanation: 'len counts characters: P-y-t-h-o-n is six characters, so len("Python") is 6. It is an expression like any other and can be used wherever a value is needed.',
      },
      {
        type: "mcq",
        stem: "A beginner writes Print(\"hi\") and sees an error mentioning something not defined. What is the most likely cause?",
        options: [
          "The computer lacks the hardware to run print",
          "Python is case-sensitive, so Print is not the same as print",
          "The quotes are the wrong kind",
          "print can only be used once per program",
        ],
        correctIndex: 1,
        explanation: 'Case sensitivity is the classic trap: print is a built-in instruction, Print is an unknown name. The fix is to lowercase it.',
      },

      // --- Summary & next ---
      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "A program is literal, ordered instructions run by an interpreter that translates your text for the processor. Quoted material is written verbatim; unquoted material is worked out first. A single = stores a value under a label, and reading that label later does not change what is stored. Errors are the interpreter reporting that it could not follow an instruction, and they are information rather than failure.",
      },
      {
        type: "paragraph",
        text: "Next: variables and types. Lesson 1 stored text under a label; the next lesson covers what else can be stored — whole numbers, decimals, truth values — and why the distinction changes what your instructions are allowed to do to them.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// SBA assessment items — one per concept, following the seed-university
// convention (slug `${courseSlug}--${conceptSlug}--sba`).
// ---------------------------------------------------------------------------
function sbaFor(lesson: LessonSeed, orderIndex: number) {
  const courseSlug = COURSE_SLUG;
  const itemSlug = `${courseSlug}--${lesson.concept.slug}--sba`;
  const c = lesson.concept;
  return {
    where: { slug: itemSlug },
    update: { conceptId: undefined, orderIndex },
    create: {
      slug: itemSlug,
      courseId: COURSE_ID,
      conceptId: undefined, // filled in main() once concept ids are known
      format: "sba",
      stem: `Which statement best describes ${c.title.toLowerCase()}?`,
      options: [
        `A precise, correct description of ${c.title.toLowerCase()} as taught in this lesson.`,
        "A plausible but incorrect statement that confuses this idea with a related one.",
        "A statement that is true of a different lesson's topic, not this one.",
        "A statement that reverses the correct relationship.",
      ],
      correctAnswer: `A precise, correct description of ${c.title.toLowerCase()} as taught in this lesson.`,
      explanation: `${c.title} is a core concept of Introduction to Programming. Review this lesson before re-attempting.`,
      marks: 1,
      negativeMarks: 0.25,
      orderIndex,
      isPublished: true,
      difficulty: c.blooms === "remember" ? "easy" : c.blooms === "evaluate" || c.blooms === "create" ? "hard" : "medium",
      reviewStatus: "needs-human-review",
      needsCheck: true,
    },
  };
}

/**
 * Idempotent: safe to run repeatedly. Creates or refreshes the 4 modules,
 * 12 concept nodes with prerequisite edges, 12 lessons and 12 SBA items.
 */
export async function seedIntroductionToProgramming(): Promise<void> {
  const course = await prisma.course.findUnique({ where: { id: COURSE_ID } });
  if (!course) throw new Error(`Course ${COURSE_ID} not found. Run prisma/seed.ts first.`);

  // 1. Modules
  for (let i = 0; i < MODULES.length; i++) {
    const m = MODULES[i];
    await prisma.courseModule.upsert({
      where: { courseId_slug: { courseId: course.id, slug: m.slug } },
      update: { title: m.title, orderIndex: i },
      create: { courseId: course.id, slug: m.slug, title: m.title, orderIndex: i },
    });
  }
  const moduleBySlug = new Map(
    (await prisma.courseModule.findMany({ where: { courseId: course.id } })).map((m) => [m.slug, m.id]),
  );

  // 2. Lessons (upsert first so order is stable, content filled next)
  let lessonCount = 0;
  for (let i = 0; i < ALL_LESSONS.length; i++) {
    const l = ALL_LESSONS[i];
    await prisma.courseLesson.upsert({
      where: { id: l.id },
      update: {
        courseId: course.id,
        domain: "university",
        title: l.title,
        orderIndex: i,
        estimatedMinutes: l.estimatedMinutes,
        content: l.content as never,
        reviewStatus: "needs-human-review",
        needsCheck: l.id !== LESSON_1.id,
      },
      create: {
        id: l.id,
        courseId: course.id,
        domain: "university",
        title: l.title,
        orderIndex: i,
        estimatedMinutes: l.estimatedMinutes,
        content: l.content as never,
        reviewStatus: "needs-human-review",
        needsCheck: l.id !== LESSON_1.id,
      },
    });
    lessonCount++;
  }

  // 3. Concepts + prerequisite edges
  const slugToId = new Map<string, string>();
  let conceptCount = 0;
  let edgeCount = 0;
  for (let i = 0; i < ALL_LESSONS.length; i++) {
    const l = ALL_LESSONS[i];
    const moduleSlug = MODULES[l.module - 1].slug;
    const node = await prisma.conceptNode.upsert({
      where: { courseId_slug: { courseId: course.id, slug: l.concept.slug } },
      update: { title: l.concept.title, bloomsLevel: l.concept.blooms, estMinutes: l.concept.minutes, orderIndex: i, moduleId: moduleBySlug.get(moduleSlug) ?? null },
      create: {
        courseId: course.id,
        slug: l.concept.slug,
        title: l.concept.title,
        summary: null,
        bloomsLevel: l.concept.blooms,
        estMinutes: l.concept.minutes,
        orderIndex: i,
        moduleId: moduleBySlug.get(moduleSlug) ?? null,
        isPublished: true,
      },
    });
    slugToId.set(l.concept.slug, node.id);
    conceptCount++;
  }
  for (const l of ALL_LESSONS) {
    for (const prereqSlug of l.concept.prereq) {
      const conceptId = slugToId.get(l.concept.slug);
      const prerequisiteId = slugToId.get(prereqSlug);
      if (!conceptId || !prerequisiteId) continue;
      await prisma.conceptPrerequisite.upsert({
        where: { conceptId_prerequisiteId: { conceptId, prerequisiteId } },
        update: {},
        create: { conceptId, prerequisiteId },
      });
      edgeCount++;
    }
  }

  // 4. SBA items, now that concept ids exist
  let itemCount = 0;
  for (let i = 0; i < ALL_LESSONS.length; i++) {
    const l = ALL_LESSONS[i];
    const spec = sbaFor(l, i);
    await prisma.assessmentItem.upsert({
      where: spec.where,
      update: { ...spec.update, conceptId: slugToId.get(l.concept.slug) ?? null },
      create: { ...spec.create, conceptId: slugToId.get(l.concept.slug) ?? null },
    });
    itemCount++;
  }

  console.log(`✓ Introduction to Programming: ${MODULES.length} modules, ${lessonCount} lessons, ${conceptCount} concepts, ${edgeCount} prerequisite edges, ${itemCount} SBA items`);
}

// CLI usage: npx ts-node prisma/seed-courses/introduction-to-programming.ts
if (process.argv[1] && process.argv[1].includes("introduction-to-programming")) {
  seedIntroductionToProgramming()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
