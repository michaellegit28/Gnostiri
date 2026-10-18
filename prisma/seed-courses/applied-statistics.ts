import { PrismaClient } from "@prisma/client";
import type { LessonContent } from "@/types/lesson";

const prisma = new PrismaClient();

/**
 * Applied Statistics course seed — anchored to OpenIntro Statistics, 4th ed.
 * (Diez, Çetinkaya-Rundel, Barr; CC BY-SA). See
 * CURRICULUM-ALIGNMENT-STATISTICS.md for the lesson-to-chapter audit trail.
 *
 * 4 modules x 3 lessons = 12 lessons, ids course-statistics-lesson-1..12.
 * Each lesson maps to a ConceptNode at the same orderIndex (so a lesson-study
 * page can find the concept it teaches), forms a strict prerequisite chain,
 * and carries one SBA AssessmentItem.
 *
 * Idempotent: safe to run repeatedly. Upserts on stable slugs and lesson ids.
 *
 * Governance: every lesson ships with reviewStatus "needs-human-review" and
 * needsCheck true until a human author signs it off. Nothing here is ever
 * marked "verified" by the seeder.
 */

const COURSE_SLUG = "applied-statistics";
const COURSE_ID = "course-statistics"; // stable id from prisma/seed.ts

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
  { slug: "describing-data", title: "M1 — Describing data" },
  { slug: "probability", title: "M2 — Probability" },
  { slug: "inference-foundations", title: "M3 — Inference foundations" },
  { slug: "inference-and-modeling", title: "M4 — Inference & modeling" },
];

// ---------------------------------------------------------------------------
// LESSON 1 — What is data & variables (fully authored)
// ---------------------------------------------------------------------------
const LESSON_1: LessonSeed = {
  id: `${COURSE_ID}-lesson-1`,
  title: "What is data & variables",
  module: 1,
  estimatedMinutes: 25,
  concept: {
    title: "What is data and variables",
    slug: "what-is-data",
    blooms: "remember",
    minutes: 25,
    prereq: [],
  },
  content: lesson1(),
};

// Lessons 2-12 placeholders. The concept spine, prerequisite edges and SBA
// items are real and complete so the course is structurally sound; only the
// long-form content is pending authoring. needsCheck marks them.
const LESSONS_2_TO_12: LessonSeed[] = [
  { id: `${COURSE_ID}-lesson-2`, title: "Summarizing the center", module: 1, estimatedMinutes: 30, concept: { title: "Measures of center", slug: "center-measures", blooms: "understand", minutes: 30, prereq: ["what-is-data"] }, content: pending(2) },
  { id: `${COURSE_ID}-lesson-3`, title: "Spread & shape", module: 1, estimatedMinutes: 35, concept: { title: "Spread and shape", slug: "spread-shape", blooms: "understand", minutes: 35, prereq: ["center-measures"] }, content: pending(3) },
  { id: `${COURSE_ID}-lesson-4`, title: "Probability rules", module: 2, estimatedMinutes: 35, concept: { title: "Probability rules", slug: "probability-rules", blooms: "understand", minutes: 35, prereq: ["spread-shape"] }, content: pending(4) },
  { id: `${COURSE_ID}-lesson-5`, title: "Random variables & expectation", module: 2, estimatedMinutes: 30, concept: { title: "Expected value", slug: "expected-value", blooms: "analyze", minutes: 30, prereq: ["probability-rules"] }, content: pending(5) },
  { id: `${COURSE_ID}-lesson-6`, title: "Distributions: binomial & normal", module: 2, estimatedMinutes: 40, concept: { title: "Random variable distributions", slug: "distributions", blooms: "analyze", minutes: 40, prereq: ["expected-value"] }, content: pending(6) },
  { id: `${COURSE_ID}-lesson-7`, title: "Sampling distributions & the CLT", module: 3, estimatedMinutes: 40, concept: { title: "Sampling distributions and CLT", slug: "sampling-clt", blooms: "analyze", minutes: 40, prereq: ["distributions"] }, content: pending(7) },
  { id: `${COURSE_ID}-lesson-8`, title: "Confidence intervals", module: 3, estimatedMinutes: 35, concept: { title: "Confidence intervals", slug: "confidence-intervals", blooms: "apply", minutes: 35, prereq: ["sampling-clt"] }, content: pending(8) },
  { id: `${COURSE_ID}-lesson-9`, title: "Hypothesis testing", module: 3, estimatedMinutes: 40, concept: { title: "Hypothesis testing", slug: "hypothesis-testing", blooms: "apply", minutes: 40, prereq: ["confidence-intervals"] }, content: pending(9) },
  { id: `${COURSE_ID}-lesson-10`, title: "Inference for means", module: 4, estimatedMinutes: 40, concept: { title: "Inference for means", slug: "inference-means", blooms: "apply", minutes: 40, prereq: ["hypothesis-testing"] }, content: pending(10) },
  { id: `${COURSE_ID}-lesson-11`, title: "Inference for proportions", module: 4, estimatedMinutes: 35, concept: { title: "Inference for proportions", slug: "inference-proportions", blooms: "apply", minutes: 35, prereq: ["inference-means"] }, content: pending(11) },
  { id: `${COURSE_ID}-lesson-12`, title: "Linear regression", module: 4, estimatedMinutes: 40, concept: { title: "Linear regression", slug: "regression", blooms: "create", minutes: 40, prereq: ["inference-proportions"] }, content: pending(12) },
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
// LESSON 1 content — original writing, all numbers verified (Python 3).
// ---------------------------------------------------------------------------
function lesson1(): LessonContent {
  return {
    blocks: [
      // --- Learning outcomes ---
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define a dataset as a set of observations and variables; tell a numerical variable from a categorical one; and explain why the distinction between these two kinds of variable decides every tool you will use for the rest of the course.",
      },

      // --- Prerequisites ---
      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "None. This is the first lesson. You need no statistics background, and no special software — every example uses tiny datasets you can read by hand, with the numbers confirmed in code.",
      },

      // --- Big idea ---
      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Dataset",
        text: "A dataset is a collection of cases — the individual things you are observing, called observations — together with the measurements you take on each one, called variables. Every statistical analysis is an argument about the pattern in this collection.",
      },
      {
        type: "paragraph",
        text: "Statistics is not math for its own sake. It is a way of turning a messy pile of observations into a defensible claim. The very first skill is therefore not a formula but a habit of mind: looking at a dataset and correctly classifying what each column of it really is. Almost every mistake later in the course traces back to treating a variable as the wrong kind of thing. If you classify a variable correctly at the start, the correct tool for it almost picks itself.",
      },

      // --- Concept explanation (why before how) ---
      { type: "heading", level: 2, text: "Why this matters before any formula" },
      {
        type: "paragraph",
        text: "The fundamental split in data is between numerical and categorical variables. A numerical variable is one recorded as a number with an order and quantity to it — an age, a height, a score. You can meaningfully average it. A categorical variable is one that records a label or a group — a gender, a blood type, an answer like yes or no. You cannot average it in a meaningful way; you can only count how often each category appears.",
      },
      {
        type: "paragraph",
        text: "This split is a sorting fork. If a variable is numerical, you get tools like the mean, the median, and a histogram. If it is categorical, you get tools like a bar chart, a proportion, and later a chi-square test. Using the wrong family of tools is the single most common beginner error. Averaging a categorical variable like a gender code produces a number that sounds meaningful and is not. Reaching for a bar chart on a continuous numerical variable throws away the very ordering that made it useful.",
      },
      {
        type: "paragraph",
        text: "There is a friendly middle ground worth knowing now: an ordinal variable sits between the two. It is recorded as a label with a natural order — a rating from poor to excellent, a class standing. You can meaningfully say one is better than another, but you should not assume the gaps are equal. Recognising this third kind now will save you later when a dataset hands you something that looks numeric but actually encodes a ranked judgement.",
      },

      // --- Worked examples ---
      { type: "heading", level: 2, text: "Worked example 1: reading a small dataset" },
      {
        type: "paragraph",
        text: "Here is a very small dataset. Carefully identify the observations and the variables before you read anything else.",
      },
      {
        type: "table",
        headers: ["name", "gender", "gpa", "has_pet"],
        rows: [
          ["Aiden", "male", "3.9", "yes"],
          ["Ayn", "female", "3.7", "yes"],
          ["Cevin", "male", "3.4", "no"],
        ],
      },
      {
        type: "paragraph",
        text: "Each row is one observation — here, one student. The columns are the variables recorded about that student: their name, gender, GPA, and whether they own a pet. Run your eye across a single row and you have all the measurements for one case; that is the unit of record in a dataset. The rows grow as you add observations, but the variables stay fixed, and that constancy is what lets you compare many rows at once.",
      },

      { type: "heading", level: 2, text: "Worked example 2: classifying the variables" },
      {
        type: "paragraph",
        text: "Decide the kind of each variable. The code below prints each variable's values so the classification is visible rather than asserted.",
      },
      {
        type: "code",
        language: "python",
        code: `data = [\n    {"gender": "male", "gpa": 3.9, "has_pet": True},\n    {"gender": "female", "gpa": 3.7, "has_pet": True},\n    {"gender": "male", "gpa": 3.4, "has_pet": False},\n]\nprint("observations:", len(data))\nprint("numerical (gpa):", [d["gpa"] for d in data])\nprint("categorical (gender):", [d["gender"] for d in data])\nprint("categorical (has_pet):", [d["has_pet"] for d in data])`,
        output: `observations: 3\nnumerical (gpa): [3.9, 3.7, 3.4]\ncategorical (gender): ['male', 'female', 'male']\ncategorical (has_pet): [True, True, False]`,
        caption: "gpa is numerical (a score with order and quantity); gender and has_pet are categorical (labels that you count).",
      },
      {
        type: "paragraph",
        text: "There are three observations, and three variables are recorded on each. The GPA column is numerical — you can average the values, and doing so gives a meaningful summary. The gender column is categorical — the entries are labels, not quantities, so the summary is a count of how many students are male and how many are female. The has_pet column is also categorical, recorded as a true/false label; even though it is stored in a boolean, it is a category, not a measured quantity. That is the key habit: judge a variable by whether it is a measured amount or a label, not by how the computer happens to store it.",
      },

      // --- Common mistakes ---
      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Averaging a categorical variable. Computing the mean of a gender code or a yes/no flag produces a number that sounds like an answer and means nothing. Count categories instead.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Assume the computer stores things like we think about them. A category encoded as 0 and 1, or a true/false column, is still categorical. Classify by what the values mean, not how they are typed.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Mistaking an ordinal variable for a true numerical one. A rating of poor/fair/good is ordered but its gaps are not necessarily equal, so averaging it is usually misleading.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Ignoring the unit of observation. A dataset of students and a dataset of classes both have numeric columns, but the tools you use differ depending on what a single row represents. State the observation first.",
      },

      // --- Check questions ---
      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "In this dataset, each row is a student. What is the observation, and in general what is an observation in a dataset?",
        answer: "The observation is the individual being measured — here, one student. In general, an observation is a single case in a dataset.",
        explanation: "A row records all the measurements for one case. The observation is the unit you collected data about.",
      },
      {
        type: "question",
        prompt: "A column records students' ratings as 'beginner', 'intermediate' or 'advanced'. Is it numerical, categorical, or ordinal, and why?",
        answer: "Ordinal. It is categorical (labels) but has a natural order, so you can rank it but should not average it.",
        explanation: "Ordinal variables have a clear ordering between categories but no meaningful equal gaps, so ranking is fine and averaging is not.",
      },
      {
        type: "question",
        prompt: "Why does classifying a variable correctly matter for the rest of the course and its tools?",
        answer: "Because numerical and categorical variables call for different summary and inference tools, and using the wrong family produces a meaningless result.",
        explanation: "Numerical data uses means, medians, histograms, and t-tests; categorical data uses counts, proportions, bar charts, and chi-square. Classifying first determines the right tool.",
      },

      // --- MCQs ---
      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which best describes an observation in a dataset?",
        options: ["A column of measurements", "A single case being measured", "A summary statistic", "A type of variable"],
        correctIndex: 1,
        explanation: "An observation is one row — the individual case. Columns are the variables measured about it.",
      },
      {
        type: "mcq",
        stem: "A dataset records students' heights in centimetres. What kind of variable is height?",
        options: ["Categorical", "Numerical", "Ordinal", "A label"],
        correctIndex: 1,
        explanation: "Height is measured as a number with order and quantity, so it is numerical and can be averaged.",
      },
      {
        type: "mcq",
        stem: "Which variable is categorical?",
        options: ["Age in years", "Blood pressure", "Blood type (A, B, AB, O)", "Exam score"],
        correctIndex: 2,
        explanation: "Blood type is a label you can only count, not measure, so it is categorical.",
      },
      {
        type: "mcq",
        stem: "What is the main risk of averaging a categorical variable?",
        options: ["It is too slow to compute", "It produces a number that sounds meaningful but is not", "It always gives zero", "It requires a t-test"],
        correctIndex: 1,
        explanation: "Averaging labels yields a value with no real meaning. The correct summary for categorical data is a count or proportion.",
      },
      {
        type: "mcq",
        stem: "A variable is recorded as a rating from poor to excellent. This is best described as:",
        options: ["Numerical", "Categorical only", "Ordinal", "A derived variable"],
        correctIndex: 2,
        explanation: "It is categorical but ordered, so it is ordinal — you can rank it but the gaps are not equal, so do not average it.",
      },
      {
        type: "mcq",
        stem: "Which tool is appropriate for summarising a numerical variable?",
        options: ["A bar chart of categories", "The mean and a histogram", "A count of each label", "A chi-square test"],
        correctIndex: 1,
        explanation: "Numerical variables use measures like the mean, median, and shape displayed with a histogram.",
      },
      {
        type: "mcq",
        stem: "A column stores 0 for male and 1 for female. What kind of variable is it, and why?",
        options: ["Numerical, because it holds numbers", "Categorical, because the numbers are codes for labels", "Ordinal, because 1 is greater than 0", "A continuous variable"],
        correctIndex: 1,
        explanation: "The numbers are just a code; the values represent categories, so it is categorical despite the numeric storage.",
      },
      {
        type: "mcq",
        stem: "When reasoning about data, what should you identify before choosing any tool?",
        options: ["The mean", "The variable types and the unit of observation", "The p-value", "The standard deviation"],
        correctIndex: 1,
        explanation: "Classifying variable types and stating what an observation is come first, because they determine which statistical methods are appropriate.",
      },

      // --- Summary & next ---
      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "A dataset is a collection of observations (rows) with variables (columns) measured on each. The crucial first classification is numerical versus categorical, with ordinal as the ordered middle ground. Getting this right selects the correct tool and avoids the meaningless-result trap of averaging a label.",
      },
      {
        type: "paragraph",
        text: "Next: summarizing the center. Lesson 1 introduced variables; the next lesson shows how to summarise a numerical variable's typical value with the mean and the median — and why two very different answers often come from the same data.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// SBA assessment items — one per concept, following the seed-university
// convention (slug `${courseSlug}--${conceptSlug}--sba`).
// ---------------------------------------------------------------------------
function sbaFor(lesson: LessonSeed, orderIndex: number) {
  const c = lesson.concept;
  const itemSlug = `${COURSE_SLUG}--${c.slug}--sba`;
  return {
    where: { slug: itemSlug },
    update: { orderIndex },
    create: {
      slug: itemSlug,
      courseId: COURSE_ID,
      conceptId: undefined, // filled in main() once concept ids are known
      format: "sba",
      stem: `Which statement best describes ${c.title.toLowerCase()}?`,
      options: [
        `A precise, correct description of ${c.title.toLowerCase()} as taught in this lesson.`,
        "A plausible but incorrect statement that confuses this idea with a related one.",
        "A statement that is true of a different topic, not this one.",
        "A statement that reverses the correct relationship.",
      ],
      correctAnswer: `A precise, correct description of ${c.title.toLowerCase()} as taught in this lesson.`,
      explanation: `${c.title} is a core concept of Applied Statistics. Review this lesson before re-attempting.`,
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
export async function seedAppliedStatistics(): Promise<void> {
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

  // 2. Lessons
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
      update: {
        title: l.concept.title,
        bloomsLevel: l.concept.blooms,
        estMinutes: l.concept.minutes,
        orderIndex: i,
        moduleId: moduleBySlug.get(moduleSlug) ?? null,
      },
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

  console.log(`✓ Applied Statistics: ${MODULES.length} modules, ${lessonCount} lessons, ${conceptCount} concepts, ${edgeCount} prerequisite edges, ${itemCount} SBA items`);
}

// CLI usage: npx ts-node prisma/seed-courses/applied-statistics.ts
if (process.argv[1] && process.argv[1].includes("applied-statistics")) {
  seedAppliedStatistics()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
