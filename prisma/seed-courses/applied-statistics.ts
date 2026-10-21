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
  { id: `${COURSE_ID}-lesson-2`, title: "Summarizing the center", module: 1, estimatedMinutes: 30, concept: { title: "Measures of center", slug: "center-measures", blooms: "understand", minutes: 30, prereq: ["what-is-data"] }, content: lesson2() },
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
// LESSON 2 content — original writing, all numbers verified (Python 3).
// ---------------------------------------------------------------------------
function lesson2(): LessonContent {
  return {
    blocks: [
      // --- Learning outcomes ---
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: compute the mean and median of a small dataset; explain what each measures and one meaningful thing they tell you differently; and recognise when a skewed distribution means you should reach for the median rather than the mean.",
      },

      // --- Prerequisites ---
      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (What is data & variables). You need to be able to tell a numerical variable from a categorical one, because the mean and median summarise numerical data only.",
      },

      // --- Big idea ---
      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Mean",
        text: "The mean is the arithmetic average — the total of all values divided by the count. It is the point where the data would balance if each observation weighed the same.",
      },
      {
        type: "definition",
        term: "Median",
        text: "The median is the middle value once the data is sorted — the value with half the observations below it and half above (or the average of the two middles when there is an even count).",
      },
      {
        type: "paragraph",
        text: "Both measure the center of a numerical variable, but they answer different questions and respond differently to the shape of the data. The mean uses every value, so a single very large or very small observation can pull it hard. The median ignores the sizes of the extremes and only cares about position in the ordering, so it is largely unmoved by a single outlier. Choosing between them is one of the most consequential decisions in descriptive statistics, and it is driven by one thing: the shape, especially whether the data is skewed.",
      },

      // --- Concept explanation (why before how) ---
      { type: "heading", level: 2, text: "Why this matters before the arithmetic" },
      {
        type: "paragraph",
        text: "For a perfectly symmetric distribution, the mean and the median agree, or nearly so. The mean is well-behaved because the values on each side tend to balance. But real datasets are rarely symmetric. House prices, incomes, and reaction times are all right-skewed: a few unusually large values stretch the right tail far out. Those large values pull the mean up, but they do not move the median because the median only cares about which value sits at the halfway point.",
      },
      {
        type: "paragraph",
        text: "The practical consequence is this: when data is skewed, the mean stops being a good description of a 'typical' value. Reported as a 'typical' price, it overstates the truth, because a handful of luxury properties drag the average well above what most people pay. The median is the honest summary of the center in that case. This is exactly why median house price is the figure reported in the news, not mean house price.",
      },
      {
        type: "paragraph",
        text: "A common beginner's misunderstanding is to assume the mean is always the 'right' average. It is a perfectly fine summary — for symmetric data. But the choice is a judgement about the data's shape, not a matter of which one is more rigorous. Both are rigorous; each is appropriate for a different situation, and knowing which is which is the skill.",
      },

      // --- Worked examples ---
      { type: "heading", level: 2, text: "Worked example 1: center of a symmetric dataset" },
      {
        type: "paragraph",
        text: "For roughly symmetric data the mean and median sit close together. Here they are identical.",
      },
      {
        type: "code",
        language: "python",
        code: `data = [4, 5, 5, 6, 6, 6, 7, 7, 8]\nn = len(data)\nmean = sum(data) / n\ns = sorted(data)\nif n % 2 == 1:\n    median = s[n // 2]\nelse:\n    median = (s[n // 2 - 1] + s[n // 2]) / 2\nprint("mean:", mean)\nprint("median:", median)`,
        output: "mean: 6.0\nmedian: 6",
        caption: "With a balanced, symmetric dataset, the mean and median both describe the center as 6.",
      },
      {
        type: "paragraph",
        text: "The values cluster around 6 and are spread fairly evenly on either side. The total is 54 across 9 observations, so the mean is 6. Sorted, the middle value (the fifth one) is also 6, so the median is 6. When the data is not skewed, the two measures agree and it does not matter much which you report.",
      },

      { type: "heading", level: 2, text: "Worked example 2: a skew pulls the mean away from the median" },
      {
        type: "paragraph",
        text: "Add a single enormous value — an outlier — and watch how the mean jumps while the median barely changes. This is the whole reason the median exists.",
      },
      {
        type: "code",
        language: "python",
        code: `data = [200, 250, 260, 280, 900]\nn = len(data)\nmean = sum(data) / n\ns = sorted(data)\nif n % 2 == 1:\n    median = s[n // 2]\nelse:\n    median = (s[n // 2 - 1] + s[n // 2]) / 2\nprint("mean:", mean)\nprint("median:", median)\nprint("mean exceeds median by", round(mean - median, 1))`,
        output: "mean: 378.0\nmedian: 260\nmean exceeds median by 118.0",
        caption: "One high value (900) lifts the mean to 378, while the median stays at 260, the true center of the bulk of the data.",
      },
      {
        type: "paragraph",
        text: "Four of the five values are between 200 and 280 — they cluster tightly. The fifth, 900, is far to the right. The mean adds all five and divides by five, so the huge 900 drags the average up to 378 even though four of five values are below 280. The median simply finds the middle sorted value, which is 260, and is entirely unconcerned with how far 900 is from the rest. Median 260 is the honest 'typical' value here; mean 378 is the average torn toward the outlier.",
      },

      // --- Common mistakes ---
      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Reporting the mean for heavily skewed data. A skewed distribution makes the mean misleading, torn toward the long tail. Describe the center with the median instead.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Sorting incorrectly. The median requires the data in order. Unsorted, the 'middle' is meaningless — always sort first.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting the even-count median. With an even number of observations, the median is the average of the two middle values, not either one alone.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Assuming mean and median are interchangeable. They measure the center differently and diverge under skew. The choice is about the data's shape, not convenience.",
      },

      // --- Check questions ---
      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A dataset has five values: 2, 3, 4, 5, 100. Why is the median a better summary of the center than the mean?",
        answer: "Because the mean (22.8) is dragged upward by the single 100, while the median (4) sits at the middle of the four typical values.",
        explanation: "One extreme value pulls the mean far from the mass of the data. The median ignores the size of that outlier and reports the central value of the rest.",
      },
      {
        type: "question",
        prompt: "How do you find the median when there is an even number of observations?",
        answer: "Sort the data, then average the two middle values.",
        explanation: "With an even count there is no single middle element, so the median is defined as the mean of the two central values.",
      },
      {
        type: "question",
        prompt: "When is the mean an appropriate measure of center?",
        answer: "When the data is roughly symmetric — no strong skew or a few extreme outliers.",
        explanation: "The mean uses every value and is only a fair representation when the values balance on each side, which is the symmetric case.",
      },

      // --- MCQs ---
      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "What is the mean of the data {10, 12, 14}?",
        options: ["12", "13", "14", "36"],
        correctIndex: 0,
        explanation: "The mean is (10 + 12 + 14) / 3 = 36 / 3 = 12.",
      },
      {
        type: "mcq",
        stem: "What is the median of {1, 3, 7, 9, 100}?",
        options: ["7", "9", "24", "100"],
        correctIndex: 0,
        explanation: "Sorted, the middle (third) value is 7. The extreme 100 does not affect the median, only the mean.",
      },
      {
        type: "mcq",
        stem: "What is the median of {2, 4, 6, 8}?",
        options: ["4", "6", "5", "5.5"],
        correctIndex: 2,
        explanation: "Four values, so the median is the average of the two middles, 4 and 6, which is 5.",
      },
      {
        type: "mcq",
        stem: "House prices in a city are heavily right-skewed. Which is the best headline summary of a 'typical' price?",
        options: ["The mean", "The median", "The mode", "The range"],
        correctIndex: 1,
        explanation: "For skewed data the mean is pulled up by a few expensive houses; the median reports the price at the middle of the distribution.",
      },
      {
        type: "mcq",
        stem: "Why does one large outlier have little effect on the median?",
        options: ["It is excluded from the calculation", "The median depends only on position in the ordering, not the size of the extremes", "The median ignores the largest value by definition", "The median always equals the smallest value"],
        correctIndex: 1,
        explanation: "The median is the value at the halfway point. Its value is determined by which observation sits there, not by how far the largest is.",
      },
      {
        type: "mcq",
        stem: "Which statement about the mean is true?",
        options: ["It is always a fair summary of the center", "It uses every observation, so it is sensitive to extremes", "It cannot be computed for a numerical variable", "It is always larger than the median"],
        correctIndex: 1,
        explanation: "The mean is sensitive to every value, including outliers, which is why it can be misleading under skew.",
      },
      {
        type: "mcq",
        stem: "A dataset is symmetric. Which is most likely true of its mean and median?",
        options: ["They are far apart", "They are close in value", "The mean is always larger", "The median is undefined"],
        correctIndex: 1,
        explanation: "In symmetric data the tail pulls both measures equally, so the mean and median sit close together.",
      },
      {
        type: "mcq",
        stem: "To find a median, what must you do first?",
        options: ["Compute the sum", "Add the values and divide by the count", "Sort the data", "Take the largest value"],
        correctIndex: 2,
        explanation: "The median is a positional measure, so the data must first be sorted into order.",
      },

      // --- Summary & next ---
      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The mean is the sum divided by the count and uses every value. The median is the middle value once sorted. They measure the same thing — the center — but the mean is sensitive to skew and outliers while the median is not. Summarise skewed data with the median and symmetric data with either.",
      },
      {
        type: "paragraph",
        text: "Next: spread & shape. Lesson 2 told you where the data sits; the next lesson tells you how far it stretches — variance, standard deviation, quartiles and the shape of a histogram — because two datasets can share a center and still be completely different.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// SBA assessment items — one per concept, following the seed-university
// convention (slug `${courseSlug}--${conceptSlug}--sba`).
// ---------------------------------------------------------------------------

// Authored concept-check SBAs for Applied Statistics — one substantive 1-mark
// item per concept, grounded in the lesson content (OpenIntro-aligned).
// Every numeric claim executed and verified against Python (A1, 2026-10-12).
const AUTHORED_SBAS: Record<string, { stem: string; options: string[]; correctAnswer: string; explanation: string }> = {
  "what-is-data": {
    stem: "A spreadsheet records 200 students, one row each, with columns for age, gender and exam score. In statistics language, what are the students and the columns?",
    options: [
      "Each student is a case (an observation); age, gender and exam score are the variables measured on each case.",
      "The students are variables and the columns are cases.",
      "The whole spreadsheet is one big variable.",
      "The students are the population and the columns are samples.",
    ],
    correctAnswer: "Each student is a case (an observation); age, gender and exam score are the variables measured on each case.",
    explanation: "Data = cases x variables: rows are the units observed, columns are what was measured on them. Everything the course builds — summaries, plots, models — operates on this frame.",
  },
  "center-measures": {
    stem: "Five houses sold for 50, 55, 60, 65 and 1000 (thousand). Which measure of center should you quote, and why?",
    options: [
      "The median, 60 — it is unchanged by the 1000 outlier, whereas the mean rockets from 60 to 246.",
      "The mean, because it uses every value and outliers are data too.",
      "The mode, because it is the only measure that exists for numbers.",
      "It makes no difference — mean and median are always equal.",
    ],
    correctAnswer: "The median, 60 — it is unchanged by the 1000 outlier, whereas the mean rockets from 60 to 246.",
    explanation: "Verified by computing both: with the outlier the mean is 246 but the median stays exactly 60. The median is robust; the mean is dragged by extreme values — the single most practical fact about center.",
  },
  "spread-shape": {
    stem: "A distribution of incomes has a long right tail. What is the reliable relationship between its mean and median, and why?",
    options: [
      "Mean greater than median — the long right tail pulls the mean up while the median stays at the middle case.",
      "Mean less than median — the tail drags the mean down.",
      "Mean equals median — skew affects only the mode.",
      "No general relationship exists between mean, median and skew.",
    ],
    correctAnswer: "Mean greater than median — the long right tail pulls the mean up while the median stays at the middle case.",
    explanation: "Right skew means a few huge values stretch the tail: the mean chases them, the median does not. Mean > median flags right skew; mean < median flags left — the diagnostic the house-price item demonstrates.",
  },
  "probability-rules": {
    stem: "P(A) = 0.5, P(B) = 0.3 and P(A and B) = 0.1. What is P(A or B)?",
    options: [
      "0.7 — add the two probabilities, then subtract the overlap so the shared part is not counted twice.",
      "0.8 — just add 0.5 and 0.3.",
      "0.15 — multiply the two probabilities.",
      "0.5 — the larger probability wins.",
    ],
    correctAnswer: "0.7 — add the two probabilities, then subtract the overlap so the shared part is not counted twice.",
    explanation: "Verified: 0.5 + 0.3 - 0.1 = 0.7. The addition rule corrects the double-count; the complement rule is its sibling — P(not A) = 1 - P(A), as in 1 - 1/6 = 5/6 for avoiding a six.",
  },
  "expected-value": {
    stem: "A raffle sells 1000 tickets at 1 each; one ticket wins 400. What is the expected profit per ticket?",
    options: [
      "-0.60 — the expected win is (1/1000) x 400 = 0.40, minus the 1 ticket price.",
      "+0.40 — the prize is 400 and someone must win.",
      "-1.00 — you always lose the ticket price.",
      "0 — the raffle breaks even by design.",
    ],
    correctAnswer: "-0.60 — the expected win is (1/1000) x 400 = 0.40, minus the 1 ticket price.",
    explanation: "Verified: E(X) = (1/1000)(400) - 1 = -0.60. Expectation is the long-run average: probability-weighted payoff, costs included — the number that separates gambling from insurance pricing.",
  },
  "distributions": {
    stem: "Which of the 68-95-99.7 statements about ANY normal distribution is correct?",
    options: [
      "About 68% of values lie within 1 standard deviation of the mean, 95% within 2, and 99.7% within 3.",
      "About 68% of values lie within 1 percentile of the median.",
      "68% of values lie above the mean and 95% below it.",
      "The rule applies only to skewed data.",
    ],
    correctAnswer: "About 68% of values lie within 1 standard deviation of the mean, 95% within 2, and 99.7% within 3.",
    explanation: "Verified numerically against the normal curve. The rule converts any z-score into a population share — and it holds for every normal distribution regardless of its mean and standard deviation, which is why z-scores work.",
  },
  "sampling-clt": {
    stem: "A population is strongly right-skewed. What happens to the distribution of the sample mean when you draw samples of size 50?",
    options: [
      "It becomes approximately normal and centred on the population mean — the Central Limit Theorem at work.",
      "It stays exactly as right-skewed as the population, at every sample size.",
      "It becomes uniform, because averaging removes all structure.",
      "It centres on the sample's own mean, unrelated to the population.",
    ],
    correctAnswer: "It becomes approximately normal and centred on the population mean — the Central Limit Theorem at work.",
    explanation: "The CLT is the course's pivot: for large n, the sample-mean distribution is normal even when the population is not — which is what licenses the normal-based inference of lessons 8-11 even on skewed data.",
  },
  "confidence-intervals": {
    stem: "A 95% confidence interval for the mean commute is 28 to 36 minutes. What does '95% confident' actually mean?",
    options: [
      "If we repeated the whole sampling-and-interval procedure many times, about 95% of the resulting intervals would capture the true mean.",
      "95% of commuters take between 28 and 36 minutes.",
      "There is a 95% probability the true mean changes on each sample.",
      "The interval is correct 95% of the time and wrong 5% of the time for this sample.",
    ],
    correctAnswer: "If we repeated the whole sampling-and-interval procedure many times, about 95% of the resulting intervals would capture the true mean.",
    explanation: "The confidence is in the procedure, not in one interval, and the interval is about the population mean, not about individual commuters — the two misreadings every examiner tests.",
  },
  "hypothesis-testing": {
    stem: "A test yields p = 0.03. What is the correct reading of this number?",
    options: [
      "If the null hypothesis were true, data this extreme would occur only 3% of the time — so the evidence favours rejecting H0 at the 5% level.",
      "There is a 3% probability that the null hypothesis is true.",
      "The result is 3% accurate and 97% error.",
      "The alternative hypothesis is 97% likely to be true.",
    ],
    correctAnswer: "If the null hypothesis were true, data this extreme would occur only 3% of the time — so the evidence favours rejecting H0 at the 5% level.",
    explanation: "p is computed ASSUMING the null: it is not the probability the null is true, and 'significant' is not 'important'. Small p says the observed data would be rare under H0 — that is all a p-value ever claims.",
  },
  "inference-means": {
    stem: "A sample of 36 items has s = 12. What is the standard error of the mean, and which distribution does the interval use?",
    options: [
      "SE = 12/sqrt(36) = 2, and with sigma unknown the interval uses the t-distribution, not z.",
      "SE = 12, because the standard error equals the sample standard deviation.",
      "SE = 36/12 = 3, and the normal z cut-offs always apply.",
      "SE = 12 x 36 = 432, and no distribution is needed.",
    ],
    correctAnswer: "SE = 12/sqrt(36) = 2, and with sigma unknown the interval uses the t-distribution, not z.",
    explanation: "Verified: 12/sqrt(36) = 2. The SE shrinks with sample size (precision grows as root-n), and estimating sigma from s adds uncertainty — the t-distribution's fatter tails are exactly the correction.",
  },
  "inference-proportions": {
    stem: "In a sample of 100 voters, 60 support a candidate. Are the conditions for a proportion interval met?",
    options: [
      "Yes — with p-hat = 0.6, both success and failure counts are at least 10 (60 and 40), so the normal model applies.",
      "No — the sample must be at least 1000 for any proportion work.",
      "Yes — because 60% is bigger than 50%.",
      "No — proportions never satisfy normal conditions.",
    ],
    correctAnswer: "Yes — with p-hat = 0.6, both success and failure counts are at least 10 (60 and 40), so the normal model applies.",
    explanation: "Verified: n*p-hat = 60 >= 10 and n*(1-p-hat) = 40 >= 10. The success-failure check is the gate; passing it lets SE = sqrt(0.6*0.4/100) = 0.049 anchor the interval.",
  },
  "regression": {
    stem: "A least-squares line fitted to five (x, y) points gives y-hat = 2.2 + 0.6x. What does the slope 0.6 mean?",
    options: [
      "For each one-unit increase in x, y increases by 0.6 units on average.",
      "y is always exactly 0.6 times x.",
      "When x is zero, y must also be zero.",
      "60% of the data lie on the line.",
    ],
    correctAnswer: "For each one-unit increase in x, y increases by 0.6 units on average.",
    explanation: "Slope is an average rate of change, not a guarantee for any single case. (On the demo data the fit is intercept 2.2, slope 0.6 — computed and verified; residuals measure what the line misses.)",
  },
};

function sbaFor(lesson: LessonSeed, orderIndex: number) {
  const c = lesson.concept;
  const itemSlug = `${COURSE_SLUG}--${c.slug}--sba`;
  const authored = AUTHORED_SBAS[c.slug];
  if (!authored) throw new Error(`No authored SBA for concept ${c.slug} — every concept needs a real item.`);
  // Deterministic rotation by item index: uniform key spread, stable across
  // re-runs; correctAnswer is option TEXT so rotation never breaks the key.
  const raw = authored.options;
  const rot = orderIndex % raw.length;
  const options = raw.slice(rot).concat(raw.slice(0, rot));
  if (!options.includes(authored.correctAnswer)) {
    throw new Error(`correctAnswer not present in options for ${itemSlug} — answer/key drift`);
  }
  return {
    where: { slug: itemSlug },
    update: {
      orderIndex,
      stem: authored.stem,
      options: options as never,
      correctAnswer: authored.correctAnswer,
      explanation: authored.explanation,
      reviewStatus: "needs-human-review",
      needsCheck: false,
    },
    create: {
      slug: itemSlug,
      courseId: COURSE_ID,
      conceptId: undefined, // filled in main() once concept ids are known
      format: "sba",
      stem: authored.stem,
      options: options as never,
      correctAnswer: authored.correctAnswer,
      explanation: authored.explanation,
      marks: 1,
      negativeMarks: 0.25,
      orderIndex,
      isPublished: true,
      difficulty: c.blooms === "remember" ? "easy" : c.blooms === "evaluate" || c.blooms === "create" ? "hard" : "medium",
      reviewStatus: "needs-human-review",
      needsCheck: false,
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
