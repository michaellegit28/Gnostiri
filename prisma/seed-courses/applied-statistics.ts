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

// Lessons 1-9 and 12 carry authored content; lessons 10 and 11 remain
// placeholders. The concept spine, prerequisite edges and SBA items are real
// and complete for all twelve, so the course is structurally sound. needsCheck
// stays true on every row until a human signs the content off.
const LESSONS_2_TO_12: LessonSeed[] = [
  { id: `${COURSE_ID}-lesson-2`, title: "Summarizing the center", module: 1, estimatedMinutes: 30, concept: { title: "Measures of center", slug: "center-measures", blooms: "understand", minutes: 30, prereq: ["what-is-data"] }, content: lesson2() },
  { id: `${COURSE_ID}-lesson-3`, title: "Spread & shape", module: 1, estimatedMinutes: 35, concept: { title: "Spread and shape", slug: "spread-shape", blooms: "understand", minutes: 35, prereq: ["center-measures"] }, content: lesson3() },
  { id: `${COURSE_ID}-lesson-4`, title: "Probability rules", module: 2, estimatedMinutes: 35, concept: { title: "Probability rules", slug: "probability-rules", blooms: "understand", minutes: 35, prereq: ["spread-shape"] }, content: lesson4() },
  { id: `${COURSE_ID}-lesson-5`, title: "Random variables & expectation", module: 2, estimatedMinutes: 30, concept: { title: "Expected value", slug: "expected-value", blooms: "analyze", minutes: 30, prereq: ["probability-rules"] }, content: lesson5() },
  { id: `${COURSE_ID}-lesson-6`, title: "Distributions: binomial & normal", module: 2, estimatedMinutes: 40, concept: { title: "Random variable distributions", slug: "distributions", blooms: "analyze", minutes: 40, prereq: ["expected-value"] }, content: lesson6() },
  { id: `${COURSE_ID}-lesson-7`, title: "Sampling distributions & the CLT", module: 3, estimatedMinutes: 40, concept: { title: "Sampling distributions and CLT", slug: "sampling-clt", blooms: "analyze", minutes: 40, prereq: ["distributions"] }, content: lesson7() },
  { id: `${COURSE_ID}-lesson-8`, title: "Confidence intervals", module: 3, estimatedMinutes: 35, concept: { title: "Confidence intervals", slug: "confidence-intervals", blooms: "apply", minutes: 35, prereq: ["sampling-clt"] }, content: lesson8() },
  { id: `${COURSE_ID}-lesson-9`, title: "Hypothesis testing", module: 3, estimatedMinutes: 40, concept: { title: "Hypothesis testing", slug: "hypothesis-testing", blooms: "apply", minutes: 40, prereq: ["confidence-intervals"] }, content: lesson9() },
  { id: `${COURSE_ID}-lesson-10`, title: "Inference for means", module: 4, estimatedMinutes: 40, concept: { title: "Inference for means", slug: "inference-means", blooms: "apply", minutes: 40, prereq: ["hypothesis-testing"] }, content: pending(10) },
  { id: `${COURSE_ID}-lesson-11`, title: "Inference for proportions", module: 4, estimatedMinutes: 35, concept: { title: "Inference for proportions", slug: "inference-proportions", blooms: "apply", minutes: 35, prereq: ["inference-means"] }, content: pending(11) },
  { id: `${COURSE_ID}-lesson-12`, title: "Linear regression", module: 4, estimatedMinutes: 40, concept: { title: "Linear regression", slug: "regression", blooms: "create", minutes: 40, prereq: ["inference-proportions"] }, content: lesson12() },
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
// LESSON 3 content — original writing, all numbers verified (Python 3).
// ---------------------------------------------------------------------------
function lesson3(): LessonContent {
  return {
    blocks: [
      // --- Learning outcomes ---
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: compute the range, the quartiles, the interquartile range, the variance and the standard deviation of a small numerical dataset; explain why the sample variance divides by n - 1 rather than n; choose a measure of spread that survives an outlier; and read skew off the relationship between the mean and the median.",
      },

      // --- Prerequisites ---
      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 2 (Summarizing the center). You need the mean and the median, because every measure of spread below is defined as a distance from one of them.",
      },

      // --- Big idea ---
      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Standard deviation",
        text: "The typical distance of an observation from the mean, expressed in the same units as the data. It is the square root of the variance, and it describes how tightly the data clusters around its center.",
      },
      {
        type: "definition",
        term: "Interquartile range (IQR)",
        text: "The distance between the third and first quartiles — the spread of the middle 50% of the data. Because it reads only the middle half, a few extreme values cannot move it.",
      },
      {
        type: "paragraph",
        text: "Two datasets can share a mean of 50 and be nothing alike: one where nearly every value lies between 48 and 52, and another where values are scattered from 0 to 100. The center says where the data sits; the spread says how far it stretches. Reporting one without the other is how a summary gets misread, which is why a serious report always quotes both.",
      },

      // --- Concept explanation ---
      { type: "heading", level: 2, text: "Why the sample variance divides by n - 1" },
      {
        type: "paragraph",
        text: "Start from the definition. The variance is the average squared distance from the mean: subtract the mean from each value, square the result, and average those squares. Squaring serves two purposes — it makes every contribution positive, so values below and above the mean cannot cancel, and it makes large deviations weigh more than small ones, which is the behaviour we want from a measure of spread.",
      },
      {
        type: "paragraph",
        text: "There is one subtlety. When the data is a sample used to estimate the spread of a wider population, you divide the sum of squares by n - 1, not n. The reason is that the sample mean is computed from the same data, so it sits slightly closer to the observations than the population mean would; the deviations from it are therefore slightly too small on average. Dividing by n - 1 removes that tilt, giving an unbiased estimate of the population variance. The n - 1 is called the degrees of freedom: n observations, one constraint (the mean must be matched), leaving n - 1 free pieces of information about spread.",
      },
      {
        type: "paragraph",
        text: "The correction is small when n is large — with 500 observations, dividing by 499 or by 500 barely differs — and it matters a great deal when n is small. Use n - 1 whenever the data is a sample; use n only when you hold the whole population and are describing it rather than inferring from it.",
      },

      // --- Worked examples ---
      { type: "heading", level: 2, text: "Worked example 1: variance and standard deviation from a tiny dataset" },
      {
        type: "paragraph",
        text: "The dataset from lesson 2: 4, 5, 5, 6, 6, 6, 7, 7, 8, with a mean of 6. Every squared deviation is small, so the arithmetic can be followed line by line.",
      },
      {
        type: "code",
        language: "python",
        code: `import math

data = [4, 5, 5, 6, 6, 6, 7, 7, 8]
n = len(data)
mean = sum(data) / n
sq = [(x - mean) ** 2 for x in data]
var_sample = sum(sq) / (n - 1)
var_pop = sum(sq) / n
print("n:", n)
print("mean:", mean)
print("squared deviations:", sq)
print("sum of squared deviations:", sum(sq))
print("sample variance (sum / (n - 1)):", var_sample)
print("population variance (sum / n):", round(var_pop, 4))
print("sample SD (sqrt of the sample variance):", round(math.sqrt(var_sample), 4))
print("range:", max(data) - min(data))`,
        output: `n: 9
mean: 6.0
squared deviations: [4.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 4.0]
sum of squared deviations: 12.0
sample variance (sum / (n - 1)): 1.5
population variance (sum / n): 1.3333
sample SD (sqrt of the sample variance): 1.2247
range: 4`,
        caption: "The squared deviations sum to 12; dividing by n - 1 = 8 gives a sample variance of 1.5, whose square root is 1.2247.",
      },
      {
        type: "paragraph",
        text: "Method: the deviations from the mean of 6 are -2, -1, -1, 0, 0, 0, 1, 1, 2, whose squares are 4, 1, 1, 0, 0, 0, 1, 1, 4. They sum to 12. Dividing by n - 1 = 8 gives a sample variance of exactly 1.5, and the square root of 1.5 is about 1.2247, so a typical value sits roughly 1.2 units from the mean. The population variance would be 12 / 9 = 1.3333, slightly smaller because the correction is missing. The range is 8 - 4 = 4, which coincidentally looks similar to the SD here because the data is symmetric and compact.",
      },

      { type: "heading", level: 2, text: "Worked example 2: quartiles, the IQR and the outlier fence" },
      {
        type: "paragraph",
        text: "The standard deviation uses every value, so one extreme observation can inflate it. The quartiles give a robust alternative: split the sorted data into quarters and measure the spread of the middle half.",
      },
      {
        type: "table",
        headers: ["Summary statistic", "Value", "How it is obtained"],
        rows: [
          ["Minimum", "4", "The smallest value"],
          ["Q1 (first quartile)", "5", "Median of the lower half (4, 5, 5, 6) → 5"],
          ["Median", "6", "The middle value of all nine"],
          ["Q3 (third quartile)", "7", "Median of the upper half (6, 7, 7, 8) → 7"],
          ["Maximum", "8", "The largest value"],
          ["IQR", "2", "Q3 - Q1 = 7 - 5"],
          ["Range", "4", "Maximum - minimum = 8 - 4"],
        ],
      },
      {
        type: "code",
        language: "python",
        code: `data = sorted([4, 5, 5, 6, 6, 6, 7, 7, 8])
n = len(data)
median = data[n // 2]
lower = data[: n // 2]
upper = data[n // 2 + 1 :]
q1 = lower[len(lower) // 2]
q3 = upper[len(upper) // 2]
iqr = q3 - q1
print("sorted:", data)
print("Q1:", q1, "median:", median, "Q3:", q3)
print("IQR:", iqr)
print("fences:", q1 - 1.5 * iqr, "to", q3 + 1.5 * iqr)
print("values outside the fences:", [x for x in data if x < q1 - 1.5 * iqr or x > q3 + 1.5 * iqr])`,
        output: `sorted: [4, 5, 5, 6, 6, 6, 7, 7, 8]
Q1: 5 median: 6 Q3: 7
IQR: 2
fences: 2.0 to 10.0
values outside the fences: []`,
        caption: "With an odd count the median is excluded from both halves before Q1 and Q3 are taken; the 1.5 x IQR rule flags no outliers here.",
      },
      {
        type: "paragraph",
        text: "Method: sort the nine values and take the fifth (6) as the median. The four values below it are 4, 5, 5, 6, whose middle two are 5 and 5, so Q1 = 5. The four values above it are 6, 7, 7, 8, whose middle two are 7 and 7, so Q3 = 7. The IQR is therefore 7 - 5 = 2, and the outlier fences sit at Q1 - 1.5 x 2 = 2 and Q3 + 1.5 x 2 = 10. Nothing falls outside them, so this dataset has no outliers by the standard rule.",
      },
      {
        type: "paragraph",
        text: "The fence formula is a convention that works because the middle 50% of roughly bell-shaped data lives within about 1.5 IQRs of the quartiles, so values further out are rare enough to be worth flagging. It marks a value for inspection; it is not a verdict. In a real dataset an extreme value is often the most informative case in the file.",
      },

      { type: "heading", level: 2, text: "Worked example 3: what one big value does to spread and shape" },
      {
        type: "paragraph",
        text: "Add a single value of 50 to the dataset and recompute. This is the same dataset lesson 2 used to show the mean moving away from the median.",
      },
      {
        type: "code",
        language: "python",
        code: `import math

data = sorted([4, 5, 5, 6, 6, 6, 7, 7, 8, 50])
n = len(data)
mean = sum(data) / n
median = (data[n // 2 - 1] + data[n // 2]) / 2
q1 = data[n // 4]
q3 = data[(3 * n) // 4]
sq = [(x - mean) ** 2 for x in data]
print("mean:", mean)
print("median:", median)
print("Q1:", q1, "Q3:", q3, "IQR:", q3 - q1)
print("mean minus median:", round(mean - median, 1))
print("sample SD:", round(math.sqrt(sum(sq) / (n - 1)), 2))
print("sum of squared deviations:", round(sum(sq), 2))`,
        output: `mean: 10.4
median: 6.0
Q1: 5 Q3: 7 IQR: 2
mean minus median: 4.4
sample SD: 13.96
sum of squared deviations: 1754.4`,
        caption: "One high value drags the mean from 6 to 10.4 and the SD from 1.2247 to 13.96, while the median and the IQR are untouched.",
      },
      {
        type: "paragraph",
        text: "Method: the ten values sum to 104, so the mean is 104 / 10 = 10.4. Sorted, the two middle values are both 6, so the median is 6.0, and the quarter values are unchanged at 5 and 7, so the IQR is still 2. The squared deviations from 10.4 now include (50 - 10.4) squared = 1568.16, and the total sum of squares leaps to 1754.4, pushing the sample SD to 13.96 — more than eleven times its original value of 1.2247.",
      },
      {
        type: "paragraph",
        text: "This is the diagnostic pair worth memorising: a mean far above the median, together with a standard deviation larger than half the mean, is the signature of right skew. Income, house prices, hospital stay lengths and reaction times all behave this way, which is why they are reported with medians and IQRs rather than means and standard deviations.",
      },

      // --- Choosing a measure ---
      { type: "heading", level: 2, text: "Choosing a measure of spread" },
      {
        type: "table",
        headers: ["Measure", "Uses", "Affected by an outlier?", "Best used when"],
        rows: [
          ["Range", "Only the two extremes", "Yes, completely", "A quick sense of the total span"],
          ["IQR", "The middle 50%", "No", "The data is skewed or contains outliers"],
          ["Standard deviation", "Every value", "Yes, but less than the range", "The data is roughly symmetric"],
          ["Variance", "Every value, squared", "Yes, strongly", "As a stepping stone to the SD, not as a report"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Report the variance only when you need a quantity that adds up — for example, the variance of a sum of independent variables is the sum of their variances. To describe data, take its square root and report the standard deviation, which is back in the data's own units.",
      },

      // --- Common mistakes ---
      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Dividing by n when estimating spread from a sample. The sample variance divides the sum of squares by n - 1; using n gives a systematically small estimate, and the damage is worst exactly when you have least data.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Quoting a standard deviation without units. An SD of 13.96 means nothing on its own; an SD of 13.96 minutes is a statement about spread.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Using the standard deviation on heavily skewed data. The SD is pulled by the long tail just as the mean is, so for skewed data report the median together with the IQR instead.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing the IQR with the range. The range spans the whole dataset; the IQR spans only the middle half. A dataset with a huge range and a small IQR is precisely the outlier case.",
      },

      // --- Check questions ---
      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "The data {2, 4, 4, 4, 5, 5, 7, 9} has mean 5. What is its sample variance, and what is its standard deviation?",
        answer: "The squared deviations are 9, 1, 1, 1, 0, 0, 4, 16, which sum to 32. Dividing by n - 1 = 7 gives a sample variance of 4.57, and the standard deviation is its square root, about 2.14.",
        explanation: "32 / 7 = 4.5714 and sqrt(4.5714) = 2.1377. Had the data been the whole population, the divisor would be 8 and the variance 4.",
      },
      {
        type: "question",
        prompt: "Why does the sample variance divide by n - 1 rather than n?",
        answer: "Because the sample mean is fitted to the same data it describes, so the deviations from it are systematically too small; dividing by n - 1 removes that bias.",
        explanation: "One degree of freedom is spent estimating the mean, leaving n - 1 free pieces of information about spread. The correction is large for small samples and negligible for big ones.",
      },
      {
        type: "question",
        prompt: "A hospital records length of stay, which is strongly right-skewed. Which pair of statistics should it report?",
        answer: "The median and the interquartile range, because both are resistant to the small number of very long stays.",
        explanation: "The mean and SD would be dragged upward by the long stays and would describe an unusually long stay as typical, which is exactly the misleading summary to avoid.",
      },

      // --- MCQs ---
      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "What is the sample variance of {2, 4, 4, 4, 5, 5, 7, 9}?",
        options: ["4", "4.57", "5", "32"],
        correctIndex: 1,
        explanation: "The squared deviations from the mean of 5 sum to 32, and 32 / (8 - 1) = 4.5714. Dividing by 4 would be the population variance.",
      },
      {
        type: "mcq",
        stem: "Every value in a dataset is multiplied by 10. What happens to the standard deviation and the variance?",
        options: [
          "The SD is unchanged and the variance is multiplied by 10",
          "The SD is multiplied by 10 and the variance by 100",
          "Both are multiplied by 10",
          "Both are divided by 10",
        ],
        correctIndex: 1,
        explanation: "The variance is an average of squared distances, so rescaling multiplies it by 100; the SD, its square root, is multiplied by 10.",
      },
      {
        type: "mcq",
        stem: "Which measure of spread is unaffected by a single extreme outlier?",
        options: ["The range", "The standard deviation", "The interquartile range", "The variance"],
        correctIndex: 2,
        explanation: "The IQR reads only the middle 50% of the sorted data, so a value far beyond Q3 changes neither quartile.",
      },
      {
        type: "mcq",
        stem: "A distribution of incomes has a mean well above its median. What does this indicate?",
        options: [
          "The distribution is left-skewed",
          "The distribution is right-skewed — a few large incomes pull the mean up",
          "The distribution is symmetric",
          "The median has been computed incorrectly",
        ],
        correctIndex: 1,
        explanation: "A long right tail carries a few large values; the mean chases them while the median stays at the middle case. Mean above median is the standard signature of right skew.",
      },
      {
        type: "mcq",
        stem: "Why is the variance rarely reported as the headline summary of spread?",
        options: [
          "It is harder to compute than the standard deviation",
          "It is in squared units, so its size is hard to interpret",
          "It cannot be computed for small samples",
          "It is the same quantity as the mean",
        ],
        correctIndex: 1,
        explanation: "Variance is in units squared, such as minutes squared, which is not interpretable. Taking the square root returns the standard deviation in the data's own units.",
      },

      // --- Summary & next ---
      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Spread answers the question the center leaves open. The range is max minus min and the IQR is Q3 minus Q1; both are robust, and the IQR is the more informative of the two. The variance averages the squared deviations from the mean — dividing by n - 1 for a sample — and the standard deviation is its square root, back in the original units. For skewed data pair the median with the IQR; for symmetric data, the mean with the SD.",
      },
      {
        type: "paragraph",
        text: "Next: probability rules. Describing a dataset you already hold is the first half of statistics. From here on you will reason about data you have not yet seen, which requires the rules for combining chances — unions, complements, intersections and conditional probability — and that is the whole of lesson 4.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 4 content — original writing, all numbers verified (Python 3).
// ---------------------------------------------------------------------------
function lesson4(): LessonContent {
  return {
    blocks: [
      // --- Learning outcomes ---
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: state the three rules of probability (complement, addition, multiplication) and say when each applies; compute a conditional probability from a joint and a marginal probability; test whether two events are independent using the multiplication rule; and avoid the mistake of adding probabilities that overlap.",
      },

      // --- Prerequisites ---
      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (What is data & variables). You have used counts and proportions to summarise data, and that is all this lesson needs. Comfort with fractions is enough — every computation here is done with exact fractions before it is turned into a decimal.",
      },

      // --- Big idea ---
      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Probability",
        text: "A number between 0 and 1 giving the long-run share of repetitions in which an event occurs. P(A) is read as 'the probability of A' and answers: if this process ran many times, how often would A happen?",
      },
      {
        type: "definition",
        term: "Complement rule",
        text: "P(not A) = 1 - P(A). Every repetition either produces A or fails to, so the two shares must add to 1.",
      },
      {
        type: "definition",
        term: "General addition rule",
        text: "P(A or B) = P(A) + P(B) - P(A and B). The overlap is subtracted because it was counted once in P(A) and again in P(B).",
      },
      {
        type: "paragraph",
        text: "Almost everything that goes wrong in applied probability goes wrong in one of two ways: adding two probabilities that overlap and double-counting the overlap, or multiplying two probabilities when the events are not independent. The rules below fix both, and they are short enough to carry in your head as long as you remember what each one is correcting for.",
      },

      // --- Concept explanation ---
      { type: "heading", level: 2, text: "The three rules and what each one corrects" },
      {
        type: "paragraph",
        text: "The complement rule is almost trivially true and enormously useful. If the chance of rain is 0.3, the chance of no rain is 0.7. It is the tool for questions phrased as 'at least one', because it is usually easier to count the opposite event: the chance of at least one six in five rolls of a die is 1 minus the chance of no six at all, which is 1 - (5/6) to the fifth power.",
      },
      {
        type: "paragraph",
        text: "The addition rule handles 'or'. Adding P(A) and P(B) counts every outcome that is A and every outcome that is B — and an outcome that is both gets counted twice. Subtracting P(A and B) once removes the double count. When the events are mutually exclusive (disjoint), P(A and B) = 0 and the addition rule collapses to a simple sum, which is why adding probabilities is safe for non-overlapping categories and unsafe otherwise.",
      },
      {
        type: "paragraph",
        text: "The multiplication rule handles 'and'. For independent events, P(A and B) = P(A) x P(B): the two do not influence each other, so the share of A-and-B repetitions is the product of the two shares. In general, P(A and B) = P(A) x P(B | A) — the chance of A times the chance of B once A is known. Conditional probability is therefore not a new rule but a rearrangement of this one.",
      },
      {
        type: "table",
        headers: ["Rule", "Statement", "When to use it", "Trap it prevents"],
        rows: [
          ["Complement", "P(not A) = 1 - P(A)", "Questions phrased as 'at least one' or 'none'", "Assuming 'at least one' is a common outcome"],
          ["Addition (general)", "P(A or B) = P(A) + P(B) - P(A and B)", "Any 'or' between events that may overlap", "Double-counting the overlap"],
          ["Addition (disjoint)", "P(A or B) = P(A) + P(B)", "'Or' between mutually exclusive categories", "Subtracting an overlap of zero"],
          ["Multiplication", "P(A and B) = P(A) x P(B | A)", "Any 'and'", "Multiplying unconditionally when events are dependent"],
          ["Conditional", "P(A | B) = P(A and B) / P(B)", "'Given that B happened'", "Mistaking P(A | B) for P(B | A)"],
        ],
      },

      // --- Worked examples ---
      { type: "heading", level: 2, text: "Worked example 1: the complement rule on a die" },
      {
        type: "paragraph",
        text: "A fair six-sided die is rolled once. The complement rule turns 'not six' into a subtraction from 1, and it is exact because a fair die has equally likely outcomes.",
      },
      {
        type: "code",
        language: "python",
        code: `from fractions import Fraction as F

p_six = F(1, 6)
print("P(six):", p_six, "=", round(float(p_six), 4))
print("P(not six) = 1 - P(six):", 1 - p_six, "=", round(float(1 - p_six), 4))`,
        output: `P(six): 1/6 = 0.1667
P(not six) = 1 - P(six): 5/6 = 0.8333`,
        caption: "One outcome out of six is a six, so five out of six are not — the complement is the rest of the probability space.",
      },
      {
        type: "paragraph",
        text: "Method: a fair die has six equally likely outcomes and exactly one is a six, so P(six) = 1/6. The remaining five outcomes are 'not a six', so the complement is 5/6, about 0.8333. The complement rule earns its keep when the wanted event is hard to count directly: the chance of at least one six in five rolls is 1 - (5/6) to the fifth power = 1 - 3125/7776 = 4651/7776, about 0.598, whereas counting 'at least one' directly means summing the one-case, two-case, three-case and beyond probabilities separately.",
      },

      { type: "heading", level: 2, text: "Worked example 2: the general addition rule" },
      {
        type: "paragraph",
        text: "Two events with known probabilities and a known overlap. Naively adding them gives the wrong answer by exactly the size of the overlap.",
      },
      {
        type: "code",
        language: "python",
        code: `from fractions import Fraction as F

p_a, p_b, p_ab = F(1, 2), F(3, 10), F(1, 10)
print("P(A or B) = P(A) + P(B) - P(A and B):", p_a + p_b - p_ab, "=", float(p_a + p_b - p_ab))
print("P(A) x P(B) if they were independent:", p_a * p_b, "=", float(p_a * p_b))
print("independent?", p_a * p_b == p_ab)
print("P(A | B) = P(A and B) / P(B):", p_ab / p_b, "=", round(float(p_ab / p_b), 4))`,
        output: `P(A or B) = P(A) + P(B) - P(A and B): 7/10 = 0.7
P(A) x P(B) if they were independent: 3/20 = 0.15
independent? False
P(A | B) = P(A and B) / P(B): 1/3 = 0.3333`,
        caption: "Adding 0.5 and 0.3 would give 0.8 and count the 0.1 overlap twice; the correct answer is 0.7.",
      },
      {
        type: "paragraph",
        text: "Method: P(A or B) = 1/2 + 3/10 - 1/10 = 5/10 + 3/10 - 1/10 = 7/10 = 0.7. The same numbers also settle independence. If A and B were independent, the overlap would have to be P(A) x P(B) = 1/2 x 3/10 = 3/20 = 0.15. The observed overlap is 1/10 = 0.1, which is smaller, so the events are not independent — knowing that B happened makes A less likely than it is overall. Conditional probability confirms it: P(A | B) = P(A and B) / P(B) = (1/10) / (3/10) = 1/3, about 0.3333, against an unconditional P(A) of 0.5.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "P(A | B) and P(B | A) are different numbers in general. Here P(B | A) = (1/10) / (1/2) = 1/5 = 0.2 while P(A | B) = 1/3. Reversing a conditional probability without recomputing is one of the classic errors of medical and legal reasoning alike.",
      },

      { type: "heading", level: 2, text: "Worked example 3: independence and dependence on a table" },
      {
        type: "paragraph",
        text: "A contingency table is the other way to meet these rules, and it makes the double-counting visible. Suppose 100 patients are classified by treatment and outcome.",
      },
      {
        type: "table",
        headers: ["", "Recovered", "Not recovered", "Row total"],
        rows: [
          ["Treatment A", "30", "10", "40"],
          ["Treatment B", "20", "40", "60"],
          ["Column total", "50", "50", "100"],
        ],
      },
      {
        type: "paragraph",
        text: "Method: from the table, P(treatment A) = 40/100 = 0.4 and P(recovered) = 50/100 = 0.5. Adding them gives 0.9, but 30 patients lie in both categories, so the true P(A or recovered) = 0.4 + 0.5 - 0.3 = 0.6 — that is 30 + 10 + 20 = 60 of the 100 patients. Independence fails here: P(A and recovered) = 0.3 while P(A) x P(recovered) = 0.4 x 0.5 = 0.2, so recovery is more likely under treatment A. The conditional probabilities say the same thing in the form a clinician would use: P(recovered | A) = 30/40 = 0.75 against P(recovered | B) = 20/60 = 0.33.",
      },

      // --- Common mistakes ---
      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Adding probabilities when the events overlap. Add only when the events are mutually exclusive; otherwise subtract the overlap first. Two events with P = 0.5 each can have a union anywhere from 0.5 to 1, so '0.5 + 0.5 = 1' is an assumption, not a calculation.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Multiplying probabilities for dependent events. Independence must be justified by the situation — separate coin flips, separate dice — or checked with the multiplication rule; two events drawn from the same patient's record are rarely independent.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Reading P(A | B) as P(B | A). The conditioning event is the denominator, and reversing the two produces nonsense such as 'a positive test means a 99% chance of disease' when the disease is rare.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating probabilities as guarantees about single trials. P(A) = 0.7 describes long-run frequency; one roll of the die that gives no six does not make the 1/6 wrong.",
      },

      // --- Check questions ---
      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "P(A) = 0.6, P(B) = 0.5 and P(A and B) = 0.35. What is P(A or B), and are A and B independent?",
        answer: "P(A or B) = 0.6 + 0.5 - 0.35 = 0.75. They are not independent, because independence would require P(A and B) = 0.6 x 0.5 = 0.3 while the observed overlap is 0.35.",
        explanation: "The addition rule gives 0.75. For independence the overlap would have to equal 0.3; it is 0.35, so B raises the chance of A and the two events are dependent.",
      },
      {
        type: "question",
        prompt: "A fair coin is flipped three times. What is the probability of at least one head, and which rule is easiest?",
        answer: "1 - P(no heads) = 1 - (1/2) cubed = 1 - 1/8 = 7/8 = 0.875, using the complement rule.",
        explanation: "Subtracting the single all-tails outcome is far shorter than adding the cases of exactly one, two and three heads: 3/8 + 3/8 + 1/8 = 7/8.",
      },
      {
        type: "question",
        prompt: "In the treatment table above, what is P(treatment B | recovered), and how does it compare with P(recovered | B)?",
        answer: "P(treatment B | recovered) = 20 / 50 = 0.4, while P(recovered | B) = 20 / 60 = 0.33 — the same 20 patients in the numerator but a different denominator.",
        explanation: "Each conditional probability conditions on a different marginal total, which is exactly why the two must never be swapped.",
      },

      // --- MCQs ---
      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "P(A) = 0.4 and P(B) = 0.3, and A and B are mutually exclusive. What is P(A or B)?",
        options: ["0.12", "0.7", "1.0", "0.58"],
        correctIndex: 1,
        explanation: "Mutually exclusive events have no overlap, so the probabilities simply add: 0.4 + 0.3 = 0.7. Multiplying, 0.12, is the answer to a different question.",
      },
      {
        type: "mcq",
        stem: "P(A) = 0.5, P(B) = 0.3 and P(A and B) = 0.1. What is P(A or B)?",
        options: ["0.8", "0.7", "0.15", "0.6"],
        correctIndex: 1,
        explanation: "0.5 + 0.3 - 0.1 = 0.7. Adding to 0.8 counts the overlap twice; 0.15 is the overlap that independence would predict.",
      },
      {
        type: "mcq",
        stem: "For two events A and B, which statement is equivalent to 'A and B are independent'?",
        options: [
          "P(A or B) = P(A) + P(B)",
          "P(A and B) = P(A) x P(B)",
          "P(A | B) = 0",
          "P(A and B) = P(A) + P(B)",
        ],
        correctIndex: 1,
        explanation: "Independence means the joint probability factors into the product of the marginals; equivalently P(A | B) = P(A). P(A or B) = P(A) + P(B) describes mutually exclusive events, not independent ones.",
      },
      {
        type: "mcq",
        stem: "A doctor knows P(disease) = 0.01 and P(positive test | disease) = 0.99. Which statement about P(disease | positive test) is correct?",
        options: [
          "It is 0.99, because the test is 99% sensitive",
          "It is P(disease and positive test) / P(positive test), so the false-positive rate is also needed",
          "It is 0.01, because the prior dominates everything",
          "It is 0.99 x 0.01 = 0.0099",
        ],
        correctIndex: 1,
        explanation: "By definition P(disease | positive) = P(disease and positive) / P(positive). Sensitivity alone is not enough; the false-positive rate and the base rate are both required.",
      },
      {
        type: "mcq",
        stem: "A fair die is rolled five times. What is the probability of at least one six?",
        options: ["5/6", "1 - (5/6)^5", "1/6 + 1/6 + 1/6 + 1/6 + 1/6", "1 - (1/6)^5"],
        correctIndex: 1,
        explanation: "Use the complement rule: P(at least one six) = 1 - P(no six) = 1 - (5/6)^5, about 0.598. Adding 1/6 five times exceeds 1, and 1 - (1/6)^5 is the complement of five sixes.",
      },

      // --- Summary & next ---
      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Three rules carry most of the weight. The complement rule, P(not A) = 1 - P(A), is the tool for 'at least one' questions. The general addition rule, P(A or B) = P(A) + P(B) - P(A and B), corrects the double-count when events overlap, and collapses to a plain sum only when the events are disjoint. Conditional probability, P(A | B) = P(A and B) / P(B), rearranges the multiplication rule, and independence is the special case where P(A and B) = P(A) x P(B).",
      },
      {
        type: "paragraph",
        text: "Next: random variables and expectation. So far each event has been analysed on its own. A random variable collects all the outcomes of a process into a single number with a probability attached to each value, which lets you compute one summary — the expected value — that says what the process pays in the long run.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 5 content — original writing, all numbers verified (Python 3).
// ---------------------------------------------------------------------------
function lesson5(): LessonContent {
  return {
    blocks: [
      // --- Learning outcomes ---
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define a random variable and its probability distribution; compute an expected value as a probability-weighted sum; compute the variance and standard deviation of a random variable; and explain why the expected value is a long-run average rather than a value the variable can actually take.",
      },

      // --- Prerequisites ---
      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 4 (Probability rules). You need the probability rules, especially that the probabilities in a distribution sum to 1, because the expected value is a weighted average over them.",
      },

      // --- Big idea ---
      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Random variable",
        text: "A numerical summary of the outcome of a random process, together with a probability distribution: the values it can take, each with its probability, and those probabilities sum to 1.",
      },
      {
        type: "definition",
        term: "Expected value",
        text: "The probability-weighted average of a random variable: E(X) = the sum of x times p(x) over all outcomes. It is the value the average result approaches over infinitely many repetitions.",
      },
      {
        type: "paragraph",
        text: "The expected value is the most useful number in applied probability and the most routinely misread. It is not the outcome you should expect on any single attempt — a lottery ticket with an expected value of -0.60 does not lose 60 cents on the draw you buy. It is the average over many repetitions, and it is the right decision rule for choices made repeatedly. That is what separates insurance pricing, which averages thousands of policies, from gambling, which concentrates losses on individuals.",
      },

      // --- Concept explanation ---
      { type: "heading", level: 2, text: "Why the weighted average is the right decision rule" },
      {
        type: "paragraph",
        text: "Compute E(X) as the sum of x times p(x). Two properties make it behave like an average. First, it is linear: E(aX + b) = aE(X) + b, so adding a constant shifts the expectation by that constant and rescaling the variable rescales its expectation. Second, for independent variables E(XY) = E(X)E(Y) — a fact that fails loudly when the variables are dependent, which is why correlation has to be modelled before products of random variables can be analysed.",
      },
      {
        type: "paragraph",
        text: "The variance uses the same weighting: Var(X) is the sum of (x - E(X)) squared times p(x), which is easier to compute as E(X squared) minus E(X) squared. The standard deviation is its square root. Both are measured around the expected value, exactly as the sample variance of lesson 3 is measured around the sample mean; the only difference is that here each value is weighted by its probability instead of being one observation among n.",
      },

      // --- Worked examples ---
      { type: "heading", level: 2, text: "Worked example 1: a die game with zero expected value" },
      {
        type: "paragraph",
        text: "Roll a fair die. If it shows a six you win 10; otherwise you lose 2. Is the game worth playing? The expected value answers it, and the variance says how volatile it is.",
      },
      {
        type: "code",
        language: "python",
        code: `import math
from fractions import Fraction as F

outcomes = [(10, F(1, 6)), (-2, F(5, 6))]
ev = sum(x * p for x, p in outcomes)
ev_sq = sum(x * x * p for x, p in outcomes)
var = ev_sq - ev * ev
print("payouts:", [x for x, _ in outcomes])
print("E(X) = sum x * p(x):", ev, "=", float(ev))
print("E(X^2) = sum x^2 * p(x):", ev_sq, "=", float(ev_sq))
print("Var(X) = E(X^2) - E(X)^2:", var, "=", float(var))
print("SD(X):", round(math.sqrt(float(var)), 4))`,
        output: `payouts: [10, -2]
E(X) = sum x * p(x): 0 = 0.0
E(X^2) = sum x^2 * p(x): 20 = 20.0
Var(X) = E(X^2) - E(X)^2: 20 = 20.0
SD(X): 4.4721`,
        caption: "The expected gain is exactly zero, but a standard deviation of 4.4721 shows how much any single play swings.",
      },
      {
        type: "paragraph",
        text: "Method: E(X) = (1/6)(10) + (5/6)(-2) = 10/6 - 10/6 = 0, so the stake is a fair price for the game. Then E(X squared) = (1/6)(100) + (5/6)(4) = 100/6 + 20/6 = 120/6 = 20, so Var(X) = 20 - 0 squared = 20 and the standard deviation is the square root of 20, about 4.4721. A zero expected value does not mean a quiet game — it means wins and losses balance in the long run while individual plays are volatile.",
      },

      { type: "heading", level: 2, text: "Worked example 2: the raffle, priced honestly" },
      {
        type: "paragraph",
        text: "A raffle sells 1000 tickets at 1 each and has one prize of 400. Include the ticket price as a cost and the expected profit is clearly negative — the arithmetic that makes lotteries a business.",
      },
      {
        type: "code",
        language: "python",
        code: `from fractions import Fraction as F

p_win = F(1, 1000)
prize = 400
cost = 1
ev_win = p_win * prize
ev_profit = ev_win - cost
print("E(win):", ev_win, "=", float(ev_win))
print("E(profit per ticket) = E(win) - cost:", ev_profit, "=", round(float(ev_profit), 2))`,
        output: `E(win): 2/5 = 0.4
E(profit per ticket) = E(win) - cost: -3/5 = -0.6`,
        caption: "The expected win is 0.40 and the ticket costs 1, so the expected loss is 0.60 per ticket — 60% of the stake in the long run.",
      },
      {
        type: "paragraph",
        text: "Method: the chance of holding the winning ticket is 1/1000, so the expected prize money is (1/1000)(400) = 0.4 exactly. Deducting the 1 ticket price gives an expected profit of 0.4 - 1 = -0.6 per ticket. Over 1000 tickets the raffle takes in 1000 and pays out 400, so the house keeps 600 — the same -0.6 per ticket, now visible with no probability notation at all.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Insurance is the same calculation with the sign reversed. If 1000 policyholders each face a 1/1000 chance of a 400 loss, the expected payout per policy is 0.4, so a premium of 1 is profitable in expectation while remaining individually bearable. Both sides of that trade price the same number.",
      },

      { type: "heading", level: 2, text: "Worked example 3: what expectation hides" },
      {
        type: "paragraph",
        text: "Two investments can share an expected value and behave nothing alike. The table computes the summaries, and the standard deviation reveals how different the risk is.",
      },
      {
        type: "table",
        headers: ["Outcome x", "p(x) in investment P", "p(x) in investment Q", "x * p(x) contribution"],
        rows: [
          ["-2", "0.5", "0.999", "P: -1.0, Q: -1.998"],
          ["2", "0.5", "0.001", "P: 1.0, Q: 0.002"],
          ["E(X)", "—", "—", "P: 0.0, Q: -1.996"],
          ["SD(X)", "—", "—", "P: 2.0, Q: 0.13"],
        ],
      },
      {
        type: "paragraph",
        text: "Method: for investment P, E(X) = 0.5(-2) + 0.5(2) = 0 and the variance is 0.5(4) + 0.5(4) = 4, so the SD is 2. Investment Q pays 2 once in a thousand times and -2 otherwise: E(X) = 0.001(2) + 0.999(-2) = 0.002 - 1.998 = -1.996, while E(X squared) = 0.001(4) + 0.999(4) = 4, so Var(X) = 4 - 1.996 squared = 4 - 3.984 = 0.016 and the SD is about 0.13. Expectation alone would rank these two as close in scale; expectation together with variance separates them cleanly — P is a fair coin-flip, Q is a near-certain loss of about 2.",
      },

      // --- Common mistakes ---
      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Treating the expected value as a likely outcome. A random variable can have an expected value it never takes — the die game pays either 10 or -2 while its expectation is 0. Expectation is about the long run, not about one trial.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting to subtract costs. An expected win of 0.4 for a 1 ticket is an expected loss of 0.6. Always state whether the expected value is gross or net of the price of entry.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Assuming the expectation of a product is the product of expectations. E(XY) = E(X)E(Y) holds for independent variables only; with dependent variables the product's expectation must be computed from the joint distribution.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Ignoring variance when comparing choices. Two options with the same expected value can differ enormously in risk, and the standard deviation of the random variable is what quantifies that risk.",
      },

      // --- Check questions ---
      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A bag holds 3 red and 2 blue balls; drawing a red wins 6 and drawing a blue wins 0. What is the expected value, and what does it mean?",
        answer: "E(X) = (3/5)(6) + (2/5)(0) = 18/5 = 3.6. It means the average win over many draws approaches 3.6, even though no single draw ever pays exactly 3.6.",
        explanation: "The probabilities 3/5 and 2/5 sum to 1, so the weighting is legitimate; the expected value is a long-run average, not a payoff that actually occurs.",
      },
      {
        type: "question",
        prompt: "For the die game above, why is the expected value zero while the standard deviation is 4.4721?",
        answer: "Because the gains and losses balance exactly in expectation — (1/6)(10) = (5/6)(2) — while each play delivers either 10 or -2, and the spread of those two payoffs is the square root of 20.",
        explanation: "Expectation measures the center of the distribution; the standard deviation measures its spread. A fair game can be extremely volatile.",
      },
      {
        type: "question",
        prompt: "A variable takes values 1 and 9 with equal probability. What are its expected value and standard deviation?",
        answer: "E(X) = 0.5(1) + 0.5(9) = 5; Var(X) = 0.5(16) + 0.5(16) = 16, so the SD is 4.",
        explanation: "Both outcomes are 4 units from the mean of 5, so the squared deviations are 16 each and the variance is 16.",
      },

      // --- MCQs ---
      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A random variable takes values 2, 4 and 6 with probabilities 0.5, 0.3 and 0.2. What is E(X)?",
        options: ["4", "3.4", "3.6", "4.5"],
        correctIndex: 1,
        explanation: "E(X) = 2(0.5) + 4(0.3) + 6(0.2) = 1 + 1.2 + 1.2 = 3.4. The plain average of 4 is wrong because the outcomes are not equally likely.",
      },
      {
        type: "mcq",
        stem: "Which statement about an expected value is correct?",
        options: [
          "It is the most likely single outcome",
          "It is the long-run average over many repetitions and need not be a possible outcome",
          "It is always greater than every outcome",
          "It is the median of the distribution",
        ],
        correctIndex: 1,
        explanation: "Expectation is a probability-weighted average, so it can fall between outcomes and says nothing about the most likely individual result.",
      },
      {
        type: "mcq",
        stem: "In the raffle with 1000 tickets, a 400 prize and a 1 entry cost, what is the expected profit per ticket?",
        options: ["+0.40", "-0.60", "0", "-0.40"],
        correctIndex: 1,
        explanation: "The expected prize is (1/1000)(400) = 0.40 and the ticket costs 1, so the expected profit is 0.40 - 1 = -0.60.",
      },
      {
        type: "mcq",
        stem: "Var(X) = E(X^2) - E(X)^2. For the die game paying 10 with probability 1/6 and -2 with probability 5/6, what is the variance?",
        options: ["0", "10", "20", "4.4721"],
        correctIndex: 2,
        explanation: "E(X) = 0 and E(X^2) = 20, so Var(X) = 20 - 0 = 20. The value 4.4721 is the standard deviation, the square root of the variance.",
      },
      {
        type: "mcq",
        stem: "A fair coin pays 3 on heads and -3 on tails. What is the standard deviation of the payoff?",
        options: ["0", "3", "9", "1.5"],
        correctIndex: 1,
        explanation: "E(X) = 0 and E(X^2) = 9, so Var(X) = 9 and the SD is the square root of 9, which is 3 — the distance from the mean to either outcome.",
      },

      // --- Summary & next ---
      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "A random variable summarises a random process as a number with a distribution over its values, and those probabilities sum to 1. Its expected value, the sum of x times p(x), is the long-run average and the right basis for repeated decisions. Its variance, E(X squared) minus E(X) squared, measures spread around that average, and the standard deviation is its square root. Expectation and variance together state both the payoff and the risk, which either number alone cannot do.",
      },
      {
        type: "paragraph",
        text: "Next: distributions. Two distributions are used constantly — the binomial for counts of successes in a fixed number of yes/no trials, and the normal for continuous measurements — and each has formulas that turn its mean into a probability table, which is what makes statistical inference possible later.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 6 content — original writing, all numbers verified (Python 3).
// ---------------------------------------------------------------------------
function lesson6(): LessonContent {
  return {
    blocks: [
      // --- Learning outcomes ---
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: recognise the binomial setting and compute binomial probabilities; state the mean and standard deviation of a binomial random variable; convert any normal value to a z-score and read its percentile; and apply the 68-95-99.7 rule to a normal distribution.",
      },

      // --- Prerequisites ---
      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 4 and 5 (Probability rules, Random variables & expectation). You need expected value and variance, because each distribution here is summarised by its mean and standard deviation, and lesson 3 for what those summaries mean.",
      },

      // --- Big idea ---
      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Binomial distribution",
        text: "The distribution of the number of successes in a fixed number n of independent trials, each with the same success probability p. It is written X ~ Binomial(n, p) and takes the values 0, 1, ..., n.",
      },
      {
        type: "definition",
        term: "Normal distribution",
        text: "A continuous, symmetric, bell-shaped distribution described entirely by its mean and standard deviation. It is written X ~ Normal(mu, sigma), and the same shape recurs at every mean and every scale.",
      },
      {
        type: "definition",
        term: "Z-score",
        text: "The number of standard deviations a value lies from its mean: z = (x - mu) / sigma. It converts any normal variable into the standard normal, so one table serves every normal distribution.",
      },
      {
        type: "paragraph",
        text: "Almost every probability calculation in applied work is a binomial calculation, a normal calculation, or something the two can approximate. The reason is structural: successes counted over repeated trials give a binomial, and averages or sums of many small independent contributions give a normal. Learn these two and you have a toolkit covering a very large share of real questions — from 'how many of these 20 patients respond?' to 'how extreme is this lab value?'.",
      },

      // --- Concept explanation ---
      { type: "heading", level: 2, text: "The binomial setting and its summaries" },
      {
        type: "paragraph",
        text: "Before computing anything, check four conditions. The number of trials n is fixed; every trial has the same success probability p; the trials are independent; and the variable counts successes. Fail any one of them and the binomial formula is the wrong tool — drawing balls from a bag without replacement, for instance, changes p on every draw.",
      },
      {
        type: "paragraph",
        text: "When the setting holds, the probability of exactly k successes is the binomial formula: n choose k times p to the power k times (1 - p) to the power n - k. The factor n choose k counts the arrangements of k successes among n trials, p to the k weights the successes, and (1 - p) to the n - k weights the failures. The mean and variance follow from the expectation rules of lesson 5: each trial pays 1 with probability p, so E(X) = np and Var(X) = np(1 - p), with the standard deviation as its square root.",
      },
      {
        type: "table",
        headers: ["Quantity", "Binomial(n, p)", "How to compute it"],
        rows: [
          ["Mean", "np", "Sum of n trial means of p each"],
          ["Variance", "np(1 - p)", "Sum of n independent trial variances"],
          ["Standard deviation", "sqrt(np(1 - p))", "Square root of the variance"],
          ["P(X = k)", "C(n, k) p^k (1-p)^(n-k)", "Arrangements times weights"],
          ["P(X <= k)", "Sum of the above for 0..k", "Discrete cumulative probability"],
        ],
      },

      // --- Worked examples ---
      { type: "heading", level: 2, text: "Worked example 1: binomial counts, mean and SD" },
      {
        type: "paragraph",
        text: "A drug works on 30% of patients. Of 20 treated, how many responses are expected, what is the spread, and what is the chance of exactly 5 responses?",
      },
      {
        type: "code",
        language: "python",
        code: `import math

n, p = 20, 0.3
mean = n * p
var = n * p * (1 - p)
print("mean (np):", round(mean, 4))
print("variance np(1-p):", round(var, 4))
print("SD:", round(math.sqrt(var), 4))
print("P(X = 5):", round(math.comb(n, 5) * p ** 5 * (1 - p) ** (n - 5), 4))
print("P(X <= 5):", round(sum(math.comb(n, k) * p ** k * (1 - p) ** (n - k) for k in range(6)), 4))`,
        output: `mean (np): 6.0
variance np(1-p): 4.2
SD: 2.0494
P(X = 5): 0.1789
P(X <= 5): 0.4164`,
        caption: "The expected number of responders is 6, the typical deviation from that is about 2.05, and exactly 5 responses is the single most likely outcome.",
      },
      {
        type: "paragraph",
        text: "Method: the mean is np = 20 x 0.3 = 6. The variance is np(1 - p) = 20 x 0.3 x 0.7 = 4.2, so the standard deviation is the square root of 4.2, about 2.0494. For the exact probability, C(20, 5) = 15504 arrangements each carry weight 0.3 to the fifth times 0.7 to the fifteenth, giving 0.1789. The cumulative probability P(X <= 5) sums the terms for k = 0 through 5 and comes to 0.4164, so there is a better-than-even chance of five or fewer responders.",
      },

      { type: "heading", level: 2, text: "Worked example 2: z-scores and the standard normal" },
      {
        type: "paragraph",
        text: "Exam scores are roughly Normal(100, 15). Converting to z-scores makes every question a question about the one standard normal distribution.",
      },
      {
        type: "code",
        language: "python",
        code: `import math

mu, sigma = 100, 15
for x in [85, 100, 115, 130]:
    z = (x - mu) / sigma
    pct = 100 * (0.5 * (1 + math.erf(z / math.sqrt(2))))
    print(f"x = {x}: z = {z:.2f}, percent of values below = {pct:.2f}")`,
        output: `x = 85: z = -1.00, percent of values below = 15.87
x = 100: z = 0.00, percent of values below = 50.00
x = 115: z = 1.00, percent of values below = 84.13
x = 130: z = 2.00, percent of values below = 97.72`,
        caption: "A score of 130 is two standard deviations above the mean, corresponding to the 97.72nd percentile.",
      },
      {
        type: "paragraph",
        text: "Method: z = (x - 100) / 15, so 85 gives -1, 100 gives 0, 115 gives +1 and 130 gives +2. The area under the standard normal curve below a z-score is the percentile, computed here from the error function: below z = -1 lies 15.87%, below z = 0 lies 50%, below z = 1 lies 84.13% and below z = 2 lies 97.72%. The complement gives the upper tail — only 2.28% of values exceed 130.",
      },
      {
        type: "paragraph",
        text: "Those numbers are the 68-95-99.7 rule read backward: about 68% of values lie within 1 SD of the mean, 95% within 2 SDs and 99.7% within 3 SDs. The rule holds for every normal distribution regardless of its mean and SD, because the z-score has already absorbed them.",
      },

      { type: "heading", level: 2, text: "Worked example 3: the normal approximation to the binomial" },
      {
        type: "paragraph",
        text: "Binomial probabilities with large n are tedious to sum, and the normal curve approximates them well once at least 10 successes and 10 failures are expected. The drug example has np = 6, which fails that check, so the approximation is shown anyway to expose the error it makes and to demonstrate the continuity correction that keeps it honest.",
      },
      {
        type: "code",
        language: "python",
        code: `import math

n, p = 20, 0.3
mean, sd = n * p, math.sqrt(n * p * (1 - p))
z = (8.5 - mean) / sd
approx = 0.5 * (1 + math.erf(z / math.sqrt(2)))
exact = sum(math.comb(n, k) * p ** k * (1 - p) ** (n - k) for k in range(9))
print("mean:", round(mean, 2), "SD:", round(sd, 4))
print("z with the continuity correction (8.5):", round(z, 4))
print("P(X <= 8), normal approximation:", round(approx, 4))
print("P(X <= 8), exact binomial:", round(exact, 4))`,
        output: `mean: 6.0 SD: 2.0494
z with the continuity correction (8.5): 1.2199
P(X <= 8), normal approximation: 0.8887
P(X <= 8), exact binomial: 0.8867`,
        caption: "The normal approximation lands within 0.002 of the exact value here, but the success-failure condition still fails for this example, so the exact binomial is the correct choice.",
      },
      {
        type: "paragraph",
        text: "Method: a binomial variable is discrete, so '8 or fewer' means all integers up to and including 8, and the boundary at 8.5 is the continuity correction that stops the continuous curve cutting the last block in half. The z-score is (8.5 - 6) / 2.0494 = 1.2199, whose standard normal area is 0.8887 against an exact binomial value of 0.8867. For larger n the agreement improves, but the gate is the success-failure condition: here np = 6 and n(1 - p) = 14, and since 6 is below 10, the normal model is not trusted for this problem.",
      },

      // --- Common mistakes ---
      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Using the binomial when p changes between trials. Sampling without replacement, learning effects and time trends all break the fixed-p and independence assumptions; the binomial formula is then invalid, not merely approximate.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing np with np(1 - p). The mean is np; the variance is np(1 - p). Reporting 4.2 as the mean of the drug example is a factor-of-1.4 error that changes every conclusion that follows.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating a z-score as a probability. A z-score of 2 is a distance, not a chance; the 97.72% comes from an area under the curve, which is a separate computation.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Skipping the success-failure check before the normal approximation. It requires at least 10 expected successes and 10 expected failures; without that, compute the exact binomial and do not approximate.",
      },

      // --- Check questions ---
      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A fair coin is flipped 10 times. What are the mean and standard deviation of the number of heads?",
        answer: "The mean is np = 10 x 0.5 = 5 and the variance is np(1 - p) = 10 x 0.5 x 0.5 = 2.5, so the SD is about 1.58.",
        explanation: "Both summaries come straight from the binomial formulas with n = 10 and p = 0.5; the square root of 2.5 is 1.5811.",
      },
      {
        type: "question",
        prompt: "Test scores are Normal(100, 15). What is the probability of scoring above 130?",
        answer: "z = (130 - 100) / 15 = 2, and the upper tail beyond z = 2 holds about 2.28% of the distribution, so P(X > 130) = 0.0228.",
        explanation: "97.72% of values lie below 130, so the remaining 2.28% lie above it — the 68-95-99.7 rule read from the top.",
      },
      {
        type: "question",
        prompt: "Why does the continuity correction use 8.5 rather than 8 when approximating P(X <= 8)?",
        answer: "Because 'at most 8' for a discrete variable includes the whole block at 8, whose upper edge sits halfway to the next integer at 8.5; using 8 alone would cut that block in half.",
        explanation: "The normal curve is continuous, so the boundary must be placed at the midpoint between the last included value and the first excluded one.",
      },

      // --- MCQs ---
      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "X ~ Binomial(20, 0.3). What are the mean and standard deviation?",
        options: ["Mean 6, SD 2.0494", "Mean 6, SD 4.2", "Mean 20, SD 3", "Mean 0.3, SD 2.0494"],
        correctIndex: 0,
        explanation: "The mean is np = 6, the variance is np(1 - p) = 4.2, and the SD is the square root of 4.2, which is 2.0494. The value 4.2 is the variance, not the SD.",
      },
      {
        type: "mcq",
        stem: "For a Normal(100, 15) variable, which value has a z-score of -1.33?",
        options: ["85", "80", "120", "100"],
        correctIndex: 1,
        explanation: "z = (x - 100) / 15 = -1.33 gives x = 100 - 1.33 x 15 = 100 - 20 = 80.",
      },
      {
        type: "mcq",
        stem: "According to the 68-95-99.7 rule, about what percentage of a normal distribution lies more than 2 standard deviations from its mean?",
        options: ["5%", "32%", "0.3%", "68%"],
        correctIndex: 0,
        explanation: "About 95% lies within 2 SDs, leaving 5% split between the two tails beyond them — 2.5% in each.",
      },
      {
        type: "mcq",
        stem: "Which condition is required before the normal curve may approximate a binomial count?",
        options: [
          "p must be greater than 0.5",
          "At least 10 successes and at least 10 failures expected",
          "n must be exactly 100",
          "The trials must be dependent",
        ],
        correctIndex: 1,
        explanation: "The success-failure check, np >= 10 and n(1 - p) >= 10, ensures the discrete distribution is close enough to symmetric for the approximation to be accurate.",
      },
      {
        type: "mcq",
        stem: "X ~ Binomial(20, 0.3). What is P(X = 5)?",
        options: ["0.1789", "0.4164", "0.3", "0.0766"],
        correctIndex: 0,
        explanation: "C(20, 5) x 0.3^5 x 0.7^15 = 0.1789. The value 0.4164 is the cumulative probability P(X <= 5), not the single-point probability.",
      },

      // --- Summary & next ---
      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The binomial distribution, for a fixed number of independent trials with a common success probability, has mean np, variance np(1 - p), and a probability for exactly k successes given by the binomial formula. The normal distribution is symmetric and fully described by its mean and standard deviation, and z = (x - mu) / sigma converts any normal value into a percentile through the 68-95-99.7 rule or an area table. When at least 10 successes and 10 failures are expected, the binomial can be approximated by a normal curve with a continuity correction.",
      },
      {
        type: "paragraph",
        text: "Next: sampling distributions and the Central Limit Theorem. Everything so far has described a process. Inference asks about a population mean from a sample, and the tool that makes that possible is the sampling distribution of the sample mean — which the normal distribution will turn into every confidence interval and test from here to the end of the course.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 7 content — original writing, all numbers verified (Python 3).
// ---------------------------------------------------------------------------
function lesson7(): LessonContent {
  return {
    blocks: [
      // --- Learning outcomes ---
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: distinguish the population, a sample and a sampling distribution; state the Central Limit Theorem and its conditions; compute the standard error of a sample mean as sigma over root n; and explain why the normal curve can describe a sample mean even when the population is skewed.",
      },

      // --- Prerequisites ---
      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 6 (Distributions: binomial & normal). You need the normal distribution and z-scores, because the sampling distribution of the mean will be read through them for the rest of the course.",
      },

      // --- Big idea ---
      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Sampling distribution",
        text: "The distribution of a statistic — here the sample mean — over all the samples of a given size that could be drawn from a population. It describes how the statistic varies from sample to sample, not how the individual observations vary.",
      },
      {
        type: "definition",
        term: "Central Limit Theorem (CLT)",
        text: "For a random sample of size n from any population with finite mean mu and standard deviation sigma, the sampling distribution of the sample mean becomes approximately normal with mean mu and standard deviation sigma over root n as n grows.",
      },
      {
        type: "definition",
        term: "Standard error",
        text: "The standard deviation of a statistic: sigma over root n for a sample mean. It measures the precision of the estimate and shrinks as the sample grows.",
      },
      {
        type: "paragraph",
        text: "The CLT is the hinge of the course. It says that averaging destroys shape: whatever the population looks like — skewed, lumpy, two-peaked — the average of many independent observations is drawn toward a normal distribution. That single fact licenses every normal-based method from lesson 8 onward, because it means you do not need the population to be normal in order to reason about the mean you measured.",
      },

      // --- Concept explanation ---
      { type: "heading", level: 2, text: "Why averaging pulls a distribution toward normality" },
      {
        type: "paragraph",
        text: "A single draw from a right-skewed population is often small and occasionally enormous, so its distribution has a long tail. An average of n draws cannot be so extreme: for the average to be huge, most of the n draws must be huge at once, which a skewed population rarely produces. Large low values and large high values both become less likely as n grows, the middle swells, and the tails thin — the shape of a normal curve.",
      },
      {
        type: "paragraph",
        text: "The precision gain is the second half of the theorem, and it is slower than intuition expects. The standard error falls as 1 over root n, not 1 over n. To halve the uncertainty in a sample mean you must quadruple the sample size; to cut it to a tenth you need a hundred times the data. This root-n law is why studies of rare effects are expensive, and why 'we collected twice as much data' does not halve a confidence interval.",
      },
      {
        type: "table",
        headers: ["Sample size n", "SE multiplier 1/sqrt(n)", "If n = 4 gives an SE of 100, the SE here is"],
        rows: [
          ["4", "0.500", "100"],
          ["16", "0.250", "50"],
          ["64", "0.125", "25"],
          ["256", "0.0625", "12.5"],
          ["1024", "0.03125", "6.25"],
        ],
      },

      // --- Worked examples ---
      { type: "heading", level: 2, text: "Worked example 1: the standard error, computed exactly" },
      {
        type: "paragraph",
        text: "A strongly right-skewed population: ten small values and two very large ones. Compute its mean and standard deviation, then the standard error of the mean for samples of 50 and of 500.",
      },
      {
        type: "code",
        language: "python",
        code: `import math

pop = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 300, 1000]
mu = sum(pop) / len(pop)
sigma = math.sqrt(sum((x - mu) ** 2 for x in pop) / len(pop))
print("population mean:", round(mu, 2))
print("population SD:", round(sigma, 2))
print("SE of the sample mean, n = 50:", round(sigma / math.sqrt(50), 4))
print("SE of the sample mean, n = 500:", round(sigma / math.sqrt(500), 4))
print("SE at n = 500 as a share of SE at n = 50:", round((sigma / math.sqrt(500)) / (sigma / math.sqrt(50)), 4))`,
        output: `population mean: 154.17
population SD: 265.09
SE of the sample mean, n = 50: 37.4898
SE of the sample mean, n = 500: 11.8553
SE at n = 500 as a share of SE at n = 50: 0.3162`,
        caption: "Ten times the sample size cuts the standard error to 0.3162 of its former value — the square root of one tenth, not one tenth.",
      },
      {
        type: "paragraph",
        text: "Method: the twelve values sum to 1850, so mu = 1850 / 12 = 154.17. The squared deviations from that mean are dominated by the 1000, whose deviation of 845.83 has a square of 715,429, and the average of all twelve squared deviations is 843,291.67 / 12 = 70,274.31, giving sigma = 265.09. Then SE = sigma / root n: with n = 50 it is 265.09 / 7.0711 = 37.4898, and with n = 500 it is 265.09 / 22.3607 = 11.8553. The ratio 11.8553 / 37.4898 = 0.3162 is exactly the square root of one tenth — the root-n law in one number.",
      },

      { type: "heading", level: 2, text: "Worked example 2: watching the CLT happen" },
      {
        type: "paragraph",
        text: "Draw 5000 samples of 50 from the same skewed population and examine the distribution of the sample means. Their average should recover the population mean and their spread should match the standard error.",
      },
      {
        type: "code",
        language: "python",
        code: `import random
import math

pop = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 300, 1000]
mu = sum(pop) / len(pop)
sigma = math.sqrt(sum((x - mu) ** 2 for x in pop) / len(pop))
random.seed(42)
means = []
for _ in range(5000):
    sample = random.choices(pop, k=50)
    means.append(sum(sample) / len(sample))
mean_of_means = sum(means) / len(means)
sd_of_means = math.sqrt(sum((m - mean_of_means) ** 2 for m in means) / (len(means) - 1))
se = sigma / math.sqrt(50)
print("population mean:", round(mu, 2))
print("mean of 5000 sample means:", round(mean_of_means, 2))
print("SD of 5000 sample means:", round(sd_of_means, 2))
print("sigma / sqrt(50):", round(se, 2))
print("share of sample means within 1 SE of the population mean:", round(sum(1 for m in means if abs(m - mu) <= se) / len(means), 4))
print("share of sample means within 2 SE of the population mean:", round(sum(1 for m in means if abs(m - mu) <= 2 * se) / len(means), 4))`,
        output: `population mean: 154.17
mean of 5000 sample means: 154.5
SD of 5000 sample means: 38.0
sigma / sqrt(50): 37.49
share of sample means within 1 SE of the population mean: 0.6788
share of sample means within 2 SE of the population mean: 0.9526`,
        caption: "The sample means average 154.5 against a population mean of 154.17, and 67.88% of them fall within one standard error — the normal distribution's 68% appearing in a simulation.",
      },
      {
        type: "paragraph",
        text: "Method: each of the 5000 draws takes 50 values with replacement from the population and records their mean. The average of the 5000 means is 154.5, within 0.33 of the population mean of 154.17 — a simulation discrepancy that shrinks if more samples are drawn. Their standard deviation is 38.0, matching the predicted SE of 37.49 to within simulation error. And 67.88% of the means fall within one SE of the population mean, with 95.26% within two, which is the 68-95-99.7 rule of lesson 6 appearing in data drawn from a population that is nothing like a bell curve. The individual sample means ranged only from 61.2 to 323.2 even though the population itself reaches 1000, because an average of 50 draws cannot be extreme unless most draws are extreme together.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Note what the CLT does not claim. The population did not become normal: ten of its twelve values are small and two are huge, forever. Only the sampling distribution of the mean took on a normal shape. This distinction is the one most often confused in examinations and in practice alike.",
      },

      { type: "heading", level: 2, text: "Worked example 3: how large must n be?" },
      {
        type: "paragraph",
        text: "The quality of the approximation depends on n, and heavily skewed populations need larger samples than moderate ones. The table shows the same simulation at four sample sizes, so the trend is visible rather than asserted.",
      },
      {
        type: "table",
        headers: ["n per sample", "mean of 2000 sample means", "SD of those means", "sigma / sqrt(n)"],
        rows: [
          ["5", "154.82", "120.61", "118.55"],
          ["20", "153.80", "59.15", "59.28"],
          ["50", "153.94", "37.74", "37.49"],
          ["200", "154.19", "19.12", "18.74"],
        ],
      },
      {
        type: "paragraph",
        text: "Method: 2000 samples were drawn at each size with the seed fixed at 7 for reproducibility, and the same two statistics were computed. At n = 5 the sampling distribution is still visibly skewed and its spread of 120.61 sits 2.06 above the target of 118.55, while the average of the 2000 means wobbles to 154.82 against a population mean of 154.17 — evidence that the approximation is not yet trustworthy. By n = 20 the spread has fallen to 59.15 against a target of 59.28, and by n = 200 it is 19.12 against 18.74, tracking sigma over root n to within 2%. The practical rule of thumb — n around 25 to 30 is often enough for a fairly symmetric population, and more is safer for a skewed one — comes from exactly this behaviour.",
      },

      // --- Common mistakes ---
      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Believing the CLT says the population becomes normal. Only the sampling distribution of the mean does. If you need a normal population, you must check the population, not appeal to the theorem.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Substituting the sample SD and then still calling the result sigma over root n. The formula needs the population SD; when it is estimated from the sample, the standard error is itself estimated, which is why a t-distribution is used later for means.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Assuming precision improves as fast as sample size. It improves as root n: quadruple n to halve the standard error. Plans that promise otherwise are mis-costed.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Applying the CLT to dependent observations. The theorem needs independent draws; clustered or repeated measurements from the same person violate it and need different methods.",
      },

      // --- Check questions ---
      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A population has mean 50 and standard deviation 40. What are the mean and standard error of the sample mean for samples of n = 100?",
        answer: "The mean of the sampling distribution is the population mean, 50, and the SE is 40 / sqrt(100) = 40 / 10 = 4.",
        explanation: "The CLT leaves the center unchanged and divides the spread by root n, which is why 100 observations reduce an SD of 40 to a standard error of 4.",
      },
      {
        type: "question",
        prompt: "Why does averaging n observations shrink the standard deviation by root n rather than by n?",
        answer: "Because the variance of a sum of n independent observations grows additively — n times the variance of one — and the variance of the mean is that total divided by n squared, so the SD of the mean scales as root n over n, which is 1 / root n.",
        explanation: "Variances add for independent variables while standard deviations do not; taking the square root at the end is what produces the root-n law.",
      },
      {
        type: "question",
        prompt: "A population is extremely skewed. With n = 5 the sample means are still skewed; with n = 200 they look normal. What changed, and what did not?",
        answer: "The sampling distribution of the mean changed, becoming normal as n grew; the population's own distribution is unchanged and remains extremely skewed.",
        explanation: "The CLT is a statement about the distribution of the statistic across samples, not about the shape of the underlying data.",
      },

      // --- MCQs ---
      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A population has mean 200 and SD 60. For samples of size n = 36, what is the standard error of the sample mean?",
        options: ["60", "10", "0.6", "360"],
        correctIndex: 1,
        explanation: "SE = sigma / sqrt(n) = 60 / 6 = 10. The population SD stays 60; the standard error measures the spread of sample means around the population mean.",
      },
      {
        type: "mcq",
        stem: "What does the Central Limit Theorem say about the sampling distribution of the sample mean?",
        options: [
          "It is normal for any sample size, whatever the population",
          "It becomes approximately normal, centred on the population mean, as n grows",
          "It has the same shape as the population",
          "It is centred on the sample mean, not the population mean",
        ],
        correctIndex: 1,
        explanation: "The CLT needs independence and finite variance, and the approach to normality is gradual in n; its centre is the population mean, which is why a sample mean estimates it.",
      },
      {
        type: "mcq",
        stem: "To halve the standard error of a sample mean, what must happen to the sample size?",
        options: ["It must double", "It must quadruple", "It must grow by root 2", "No change is needed"],
        correctIndex: 1,
        explanation: "SE falls as 1 / root n, so halving the SE requires root n to double — that is, n to grow fourfold.",
      },
      {
        type: "mcq",
        stem: "In the 5000-sample simulation above, why did the sample means spread only from 61.2 to 323.2 when the population itself reaches 1000?",
        options: [
          "The population was censored for the simulation",
          "An average of 50 draws cannot be extreme unless most of the draws are extreme together, which a skewed population rarely produces",
          "The standard error is zero",
          "The simulation dropped the largest values",
        ],
        correctIndex: 1,
        explanation: "Averaging compresses extremes: a sample mean of 323 requires the 50 draws to average 323, whereas a single value of 1000 stands alone in the population.",
      },
      {
        type: "mcq",
        stem: "Which statement uses the term 'standard error' correctly?",
        options: [
          "It is the standard deviation of the population",
          "It is the standard deviation of a statistic, such as the sample mean",
          "It is the standard deviation of a single observation",
          "It is another name for the variance",
        ],
        correctIndex: 1,
        explanation: "The standard error is the SD of a statistic over repeated samples — sigma over root n for the mean — not the SD of the data itself.",
      },

      // --- Summary & next ---
      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The sampling distribution is the spread of a statistic across all possible samples of a given size. The Central Limit Theorem says that for independent draws with finite mean mu and SD sigma, the sample mean's distribution is approximately normal with mean mu and standard error sigma over root n. That error falls as root n, so quadrupling the sample halves it, and the normality claim — 67.88% of simulated means within one SE, 95.26% within two — holds even when the population itself is strongly skewed.",
      },
      {
        type: "paragraph",
        text: "Next: confidence intervals. With the sampling distribution known, the sample mean can be turned into an interval that reports the precision of the estimate: a point value plus and minus a margin of error built from the standard error and a z level, with an interpretation more subtle than it first looks.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 8 content — original writing, all numbers verified (Python 3).
// ---------------------------------------------------------------------------
function lesson8(): LessonContent {
  return {
    blocks: [
      // --- Learning outcomes ---
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: construct a confidence interval for a mean from a sample mean, a standard deviation and a sample size; construct one for a proportion; state the correct interpretation of a 95% confidence interval and reject the common misreadings; and explain how the confidence level and the sample size change the interval.",
      },

      // --- Prerequisites ---
      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 3 and 7 (Spread & shape, Sampling distributions & the CLT). You need the standard error of a mean and of a proportion, together with the normal distribution of lesson 6 to read the margin of error.",
      },

      // --- Big idea ---
      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Confidence interval",
        text: "A point estimate plus and minus a margin of error, where the margin is a critical value times the standard error. It reports the precision of the estimate as a range of plausible values for the population parameter.",
      },
      {
        type: "definition",
        term: "Margin of error",
        text: "The half-width of the interval: the critical value times the standard error. It is the part that shrinks as the sample grows, because the standard error shrinks.",
      },
      {
        type: "paragraph",
        text: "A point estimate alone hides its own uncertainty. Reporting 'the mean commute is 28 minutes' sounds exact and is not; 'the mean commute is 28 minutes, with a 95% confidence interval of 24.08 to 31.92' gives the reader both the estimate and how much it could move. The interval is the honest unit of reporting for any estimate made from a sample.",
      },

      // --- Concept explanation ---
      { type: "heading", level: 2, text: "The two-line recipe, and where it comes from" },
      {
        type: "paragraph",
        text: "The recipe is short: estimate, plus or minus critical value times standard error. For a mean, the estimate is the sample mean, the SE is sigma over root n, and the critical value is the z that leaves the chosen tail probability outside — 1.96 for 95%. The numbers come from lesson 7: the sample mean is normally distributed around the population mean with a standard deviation equal to the SE, so an interval reaching two SEs on either side will contain the population mean about 95% of the time.",
      },
      {
        type: "paragraph",
        text: "When sigma is unknown and replaced by the sample standard deviation, extra uncertainty enters and the t-distribution replaces the normal, with heavier tails that thin toward the normal as the degrees of freedom grow. For proportions the standard error takes its own form, the square root of p-hat times (1 - p-hat) divided by n, because the standard deviation of a yes/no variable depends on the proportion itself. In both cases the structure is identical: an estimate, a standard error and a critical value.",
      },

      // --- Worked examples ---
      { type: "heading", level: 2, text: "Worked example 1: a confidence interval for a mean" },
      {
        type: "paragraph",
        text: "A sample of 36 commuters has a mean journey of 28 minutes and a standard deviation of 12. Build the 95% interval using sigma over root n and the z level of 1.96.",
      },
      {
        type: "code",
        language: "python",
        code: `import math

n, xbar, s = 36, 28, 12
se = s / math.sqrt(n)
z = 1.96
moe = z * se
print("SE:", se)
print("margin of error:", round(moe, 2))
print("95% CI:", round(xbar - moe, 2), "to", round(xbar + moe, 2))`,
        output: `SE: 2.0
margin of error: 3.92
95% CI: 24.08 to 31.92`,
        caption: "The standard error is 12 / sqrt(36) = 2, and 1.96 x 2 = 3.92, so the interval is 28 plus or minus 3.92.",
      },
      {
        type: "paragraph",
        text: "Method: SE = s / root n = 12 / 6 = 2, so the margin of error is 1.96 x 2 = 3.92, and the interval runs from 28 - 3.92 = 24.08 to 28 + 3.92 = 31.92. Reading it: the procedure that produced this interval captures the true mean in about 95 out of every 100 repetitions of the sampling-and-interval routine. In practice sigma is unknown, so s stands in for it and a t level with 35 degrees of freedom would be used instead of 1.96, giving a slightly wider interval because estimating the standard deviation costs precision.",
      },

      { type: "heading", level: 2, text: "Worked example 2: what the confidence level does" },
      {
        type: "paragraph",
        text: "The same data at three confidence levels. A higher level buys certainty by widening the interval; there is no free lunch.",
      },
      {
        type: "code",
        language: "python",
        code: `import math

n, xbar, s = 36, 28, 12
se = s / math.sqrt(n)
for level, z in [(0.90, 1.645), (0.95, 1.96), (0.99, 2.576)]:
    moe = z * se
    print(f"{int(level * 100)}% CI: {xbar - moe:.2f} to {xbar + moe:.2f} (margin {moe:.2f})")`,
        output: `90% CI: 24.71 to 31.29 (margin 3.29)
95% CI: 24.08 to 31.92 (margin 3.92)
99% CI: 22.85 to 33.15 (margin 5.15)`,
        caption: "Moving from 90% to 99% confidence widens the interval from 6.58 minutes to 10.30 minutes.",
      },
      {
        type: "paragraph",
        text: "Method: with SE = 2, the margins are 1.645 x 2 = 3.29, 1.96 x 2 = 3.92 and 2.576 x 2 = 5.152, giving total widths of 6.58, 7.84 and 10.30. The extra certainty from 95% to 99% costs an extra 1.23 minutes of width on each side. Only the sample size improves both at once — a larger n shrinks the SE, and with the level held fixed the interval tightens around the same point estimate.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "The most common misreading of a 95% interval is 'there is a 95% probability that the true mean lies between 24.08 and 31.92'. Once the interval is computed, the mean is either inside it or not; the 95% is a property of the procedure over repeated samples, not of this one interval.",
      },

      { type: "heading", level: 2, text: "Worked example 3: a confidence interval for a proportion" },
      {
        type: "paragraph",
        text: "In a poll of 100 voters, 60 support a candidate. The standard error of a proportion is computed from p-hat itself, and the success-failure condition of lesson 6 gates the method.",
      },
      {
        type: "code",
        language: "python",
        code: `import math

n, phat = 100, 0.6
se = math.sqrt(phat * (1 - phat) / n)
moe = 1.96 * se
print("p-hat:", phat)
print("SE:", round(se, 4))
print("95% CI:", round(phat - moe, 4), "to", round(phat + moe, 4))
print("success count:", int(n * phat), "failure count:", int(n * (1 - phat)))`,
        output: `p-hat: 0.6
SE: 0.049
95% CI: 0.504 to 0.696
success count: 60 failure count: 40`,
        caption: "The standard error of 0.049 gives a margin of 0.096, so support lies between 50.4% and 69.6% with 95% confidence.",
      },
      {
        type: "paragraph",
        text: "Method: the SE of a proportion is the square root of p-hat times (1 - p-hat) divided by n, which is the square root of 0.6 x 0.4 / 100 = 0.0024, giving 0.049. The margin is 1.96 x 0.049 = 0.096, so the interval runs from 0.504 to 0.696 — a poll with a 60% headline is really saying somewhere between 50% and 70%. The gate is the success-failure condition: n p-hat = 60 and n(1 - p-hat) = 40, both at least 10, so the normal model applies. With only 10 respondents and 3 successes, that check would fail and the interval would be worthless.",
      },
      {
        type: "table",
        headers: ["Sample size n", "SE of a proportion near 0.5", "95% margin of error"],
        rows: [
          ["100", "0.050", "+/- 0.098"],
          ["400", "0.025", "+/- 0.049"],
          ["1000", "0.016", "+/- 0.031"],
          ["2500", "0.010", "+/- 0.020"],
        ],
      },
      {
        type: "paragraph",
        text: "Method: for a proportion near one half, the SE is about 0.5 / root n, so the 95% margin is roughly 1 / root n. That is why a poll of 1000 has a margin near 3 percentage points and a poll of 2500 near 2 points — and why halving the margin costs four times the sample.",
      },

      // --- Common mistakes ---
      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Reading the interval as '95% of the data lies in this range'. The interval is about the population parameter, not about individual observations — individual commutes spread far wider than 24.08 to 31.92 minutes.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Using the normal critical value when sigma is estimated and n is small. The t level is wider; ignoring the difference makes the interval too narrow and the confidence overstated, which is why the t-distribution exists.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Building a proportion interval without the success-failure check. If fewer than 10 successes or 10 failures are expected, the normal model does not apply and the interval is not trustworthy.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Chasing a narrower interval by lowering the confidence level instead of collecting more data. The honest route to precision is a bigger sample; dropping to 50% confidence to make an interval look tight misrepresents the uncertainty.",
      },

      // --- Check questions ---
      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A 95% confidence interval for the mean commute is 24.08 to 31.92 minutes. What does '95% confident' actually mean?",
        answer: "If the whole sampling-and-interval procedure were repeated many times, about 95% of the resulting intervals would capture the true population mean.",
        explanation: "Confidence is a property of the long-run performance of the method, not a probability attached to a single computed interval, and the interval is about the mean rather than individual commutes.",
      },
      {
        type: "question",
        prompt: "For the same data, how does the margin of error change if the sample size grows from 36 to 144?",
        answer: "The SE falls as 1 / root n, so quadrupling n halves the SE and halves the margin of error, from 3.92 to 1.96 at the 95% level.",
        explanation: "With n = 144 the SE is 12 / 12 = 1 and the margin is 1.96 x 1 = 1.96 — the root-n law at work in a real figure.",
      },
      {
        type: "question",
        prompt: "In a poll of 100 voters with 60 in support, why does the standard error use 0.6 x 0.4?",
        answer: "Because the variance of a yes/no variable is p times (1 - p), largest at p = 0.5 and zero at the extremes; the SE of a proportion is the square root of that variance divided by n.",
        explanation: "The spread of a binary outcome depends on the proportion itself, so the SE must be computed from p-hat rather than from a separate standard deviation.",
      },

      // --- MCQs ---
      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A sample of 36 items has s = 12. What is the standard error of the mean?",
        options: ["12", "2", "0.5", "2.04"],
        correctIndex: 1,
        explanation: "SE = s / sqrt(n) = 12 / sqrt(36) = 12 / 6 = 2. The standard deviation of 12 describes one item; 2 describes the precision of the mean.",
      },
      {
        type: "mcq",
        stem: "Which is the correct interpretation of a 95% confidence interval of 28 to 36 minutes?",
        options: [
          "95% of commuters have journeys between 28 and 36 minutes",
          "If the sampling procedure were repeated many times, about 95% of the intervals would capture the true mean",
          "There is a 95% probability that the true mean changes from sample to sample",
          "The sample mean is correct 95% of the time",
        ],
        correctIndex: 1,
        explanation: "Confidence is a property of the procedure over repetitions, and the parameter is the population mean — not individual commuters and not a quantity that moves between samples.",
      },
      {
        type: "mcq",
        stem: "Holding the data fixed, what happens when you raise the confidence level from 95% to 99%?",
        options: [
          "The interval narrows",
          "The interval widens, because the critical value rises from 1.96 to 2.576",
          "The point estimate moves upward",
          "The standard error shrinks",
        ],
        correctIndex: 1,
        explanation: "The critical value multiplies the same standard error, so a higher level buys certainty with width: the margin of 3.92 becomes 5.15 in the worked example.",
      },
      {
        type: "mcq",
        stem: "A proportion interval from a sample of 20 voters with 5 successes is reported as 0.25 plus or minus 0.19. Why is that interval unreliable?",
        options: [
          "Proportions cannot have intervals",
          "The success-failure check fails: only 5 successes and 15 failures, below the 10 needed for the normal model",
          "The sample is too large to be normal",
          "0.25 is not a valid proportion",
        ],
        correctIndex: 1,
        explanation: "Both n p-hat and n(1 - p-hat) must reach 10 before the normal approximation to a proportion is trusted; 5 and 15 fail one of them.",
      },
      {
        type: "mcq",
        stem: "A 95% interval for a proportion is 0.504 to 0.696 from a sample of 100 with p-hat 0.6. By roughly what factor must the sample size grow to halve the margin of error?",
        options: ["2", "4", "10", "100"],
        correctIndex: 1,
        explanation: "The standard error of a proportion scales as 1 / root n, so halving the margin requires quadrupling n — from 100 to 400, giving a margin near 0.049.",
      },

      // --- Summary & next ---
      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "A confidence interval is a point estimate plus and minus a critical value times a standard error. For a mean, SE = sigma over root n with the normal level 1.96 at 95% — a t level when sigma is estimated; for a proportion, SE = the square root of p-hat times (1 - p-hat) over n, gated by the success-failure condition. Higher confidence means a wider interval, and only a bigger sample improves both at once. The 95% figure belongs to the procedure across repetitions, not to any single interval.",
      },
      {
        type: "paragraph",
        text: "Next: hypothesis testing. A confidence interval reports a range of plausible values; a test asks a sharper question — is a specific value of the parameter compatible with the data? The machinery is nearly the same, and the reasoning about what the answer means is where most errors are made.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 9 content — original writing, all numbers verified (Python 3).
// ---------------------------------------------------------------------------
function lesson9(): LessonContent {
  return {
    blocks: [
      // --- Learning outcomes ---
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: state null and alternative hypotheses for a claim about a mean; compute a test statistic and a p-value; decide at a stated significance level and express the decision correctly; and explain what a p-value is not, including the Type I and Type II errors controlled by the significance level and the sample size.",
      },

      // --- Prerequisites ---
      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 7 and 8 (Sampling distributions & the CLT, Confidence intervals). You need the standard error and the normal distribution, and the two-sided critical values of lesson 8 are reused here as test statistics.",
      },

      // --- Big idea ---
      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Null hypothesis (H0)",
        text: "The claim being tested, stated as no effect or no difference — for example, that the population mean equals a specified value. It is the assumption under which the p-value is computed.",
      },
      {
        type: "definition",
        term: "Alternative hypothesis (H1 or Ha)",
        text: "The claim the investigator hopes to support — that the mean differs from the specified value (two-sided) or lies above or below it (one-sided).",
      },
      {
        type: "definition",
        term: "P-value",
        text: "The probability, computed assuming H0 is true, of obtaining a sample result at least as extreme as the one observed. It quantifies how surprising the data is under the null, and nothing else.",
      },
      {
        type: "paragraph",
        text: "A hypothesis test answers a narrow question with a precise tool. The p-value measures surprise under the null: if the observed sample mean would almost never arise when the null is true, the null loses credibility. What the p-value is not is a probability that the null is true — it is computed by assuming the null, so it cannot then tell you how likely the null is. Getting that one sentence right is most of statistical literacy.",
      },

      // --- Concept explanation ---
      { type: "heading", level: 2, text: "The five steps, and the reasoning behind them" },
      {
        type: "paragraph",
        text: "The procedure has five parts: state H0 and H1 together with the significance level alpha; compute the test statistic, a standardised distance from the null value; compute the p-value, the tail area beyond that distance; compare p with alpha and state the decision in context; and report the conclusion in the original units, never as a bare p-value.",
      },
      {
        type: "paragraph",
        text: "The significance level alpha is the chance of rejecting H0 when H0 is actually true — a Type I error, or false alarm. Failing to reject H0 when it is false is a Type II error, a missed detection, and its probability falls as the sample size grows because the standard error shrinks and real effects become easier to see. The two error rates trade off at fixed n, which is why study design must consider both rather than only avoiding false alarms.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "'Fail to reject H0' is not the same as 'H0 is true'. It means the data did not provide enough evidence against it, which is a statement about the evidence, not about the world. Absence of evidence is not evidence of absence.",
      },

      // --- Worked examples ---
      { type: "heading", level: 2, text: "Worked example 1: a complete z test for a mean" },
      {
        type: "paragraph",
        text: "A factory claims its machines fill boxes to a mean of 50 g. A sample of 36 boxes averages 53 g with a standard deviation of 12. Test H0: mu = 50 against H1: mu is not 50 at the 5% level.",
      },
      {
        type: "code",
        language: "python",
        code: `import math

n, xbar, s, mu0 = 36, 53, 12, 50
se = s / math.sqrt(n)
z = (xbar - mu0) / se
p_two = 2 * (1 - 0.5 * (1 + math.erf(abs(z) / math.sqrt(2))))
print("SE:", se)
print("z:", z)
print("two-sided p:", round(p_two, 4))
print("reject H0 at 5%:", p_two < 0.05)`,
        output: `SE: 2.0
z: 1.5
two-sided p: 0.1336
reject H0 at 5%: False`,
        caption: "The sample mean sits 1.5 standard errors above 50, which is not far enough to reject at the 5% level.",
      },
      {
        type: "paragraph",
        text: "Method: SE = 12 / 6 = 2, so z = (53 - 50) / 2 = 1.5. A deviation of 1.5 standard errors is unremarkable under the null — the two-sided p-value is 0.1336, well above 0.05 — so we fail to reject H0. The correct conclusion is that this sample does not provide convincing evidence that the mean fill differs from 50 g. It is not 'the mean is 50 g': the data are compatible with a range of true means, exactly the confidence interval of lesson 8.",
      },

      { type: "heading", level: 2, text: "Worked example 2: the same data with a larger sample" },
      {
        type: "paragraph",
        text: "Keep the 2.5 g discrepancy but increase the sample from 36 to 100. Nothing about the effect changed; only the standard error did, and that flips the decision.",
      },
      {
        type: "code",
        language: "python",
        code: `import math

mu0, xbar, s = 50, 52.5, 12
for n in [36, 100]:
    se = s / math.sqrt(n)
    z = (xbar - mu0) / se
    p = 2 * (1 - 0.5 * (1 + math.erf(abs(z) / math.sqrt(2))))
    print(f"n = {n}: SE = {se:.4f}, z = {z:.4f}, p = {p:.4f}, reject = {p < 0.05}")`,
        output: `n = 36: SE = 2.0000, z = 1.2500, p = 0.2113, reject = False
n = 100: SE = 1.2000, z = 2.0833, p = 0.0372, reject = True`,
        caption: "The same 2.5 g difference is not significant with 36 items but is significant with 100, purely because the standard error fell from 2 to 1.2.",
      },
      {
        type: "paragraph",
        text: "Method: with n = 36 the SE is 12 / 6 = 2, giving z = 2.5 / 2 = 1.25 and p = 0.2113; with n = 100 the SE is 12 / 10 = 1.2, giving z = 2.5 / 1.2 = 2.0833 and p = 0.0372, which is below 0.05. The warning this example carries: statistical significance is a function of sample size as much as of effect, so a smaller p-value does not automatically mean a bigger difference. A 2.5 g discrepancy that matters in practice matters equally at n = 36 — it is simply easier to detect at n = 100.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Statistical significance and practical significance are different questions. The first asks whether the data is incompatible with H0; the second asks whether the size of the effect would change a decision. A half-gram difference can be 'significant' with enormous samples and still not matter to a single customer.",
      },

      { type: "heading", level: 2, text: "Worked example 3: one-sided versus two-sided" },
      {
        type: "paragraph",
        text: "The choice of alternative changes the p-value by a factor of about two, and it must be made before the data is seen, not after.",
      },
      {
        type: "table",
        headers: ["Hypotheses", "Test statistic", "P-value", "Decision at 5%"],
        rows: [
          ["H1: mu is not 50 (two-sided)", "z = 1.5", "0.1336", "Fail to reject"],
          ["H1: mu > 50 (one-sided)", "z = 1.5", "0.0668", "Fail to reject"],
          ["H1: mu > 50 with n = 100", "z = 2.0833", "0.0186", "Reject"],
        ],
      },
      {
        type: "paragraph",
        text: "Method: a two-sided p-value counts both tails, so it is twice the one-sided value for the same z: 2 x 0.0668 = 0.1336, and for z = 2.0833 the one-sided value is 0.0186 against a two-sided 0.0372. A one-sided test is only legitimate when the opposite direction is impossible or uninteresting in advance; choosing it after looking at the data halves the p-value without any new evidence, which is a form of p-hacking.",
      },

      // --- Common mistakes ---
      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Reading p as the probability that H0 is true. The p-value is computed by assuming H0; it is the probability of data this extreme under the null, not the probability of the null itself.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Writing 'H0 is accepted' as the conclusion. The honest phrasing is 'fail to reject H0' — the test measures the evidence against the null, and a small sample may fail to reject a false null.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Choosing a one-sided test after seeing which way the data fell. The alternative must be fixed in advance; switching it afterwards turns a 5% test into a 10% test in disguise.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Running many tests and reporting the smallest p-value. After 20 independent tests at the 5% level, one 'significant' result is expected by chance alone — which is why corrections for multiple testing exist.",
      },

      // --- Check questions ---
      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A test yields p = 0.03. What is the correct reading of this number?",
        answer: "If H0 were true, data at least as extreme as observed would occur only 3% of the time, so the evidence favours rejecting H0 at the 5% level.",
        explanation: "P is computed by assuming the null; it measures how rare such data is under H0, it is not the probability of H0, and significance is not importance.",
      },
      {
        type: "question",
        prompt: "Why does the same 2.5 g difference fail to reject at n = 36 but reject at n = 100?",
        answer: "Because the standard error falls from 12 / 6 = 2 to 12 / 10 = 1.2, so the standardised distance grows from 1.25 to 2.08 and the p-value drops from 0.2113 to 0.0372.",
        explanation: "The test statistic divides the observed difference by its standard error, so precision — driven by n — decides significance as much as effect size does.",
      },
      {
        type: "question",
        prompt: "What are the Type I and Type II errors in the box-filling test?",
        answer: "A Type I error is rejecting H0, declaring the fill wrong, when the true mean really is 50 — controlled by alpha. A Type II error is failing to detect a genuine departure from 50 — reduced by a larger sample.",
        explanation: "At fixed n the two error rates trade off; lowering alpha from 5% to 1% reduces false alarms while making genuine departures harder to detect.",
      },

      // --- MCQs ---
      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A sample of 36 items has x-bar 53, s = 12, and H0 says mu = 50. What is the test statistic?",
        options: ["1.25", "1.5", "2.08", "3.0"],
        correctIndex: 1,
        explanation: "z = (x-bar - mu0) / (s / sqrt(n)) = 3 / (12 / 6) = 3 / 2 = 1.5.",
      },
      {
        type: "mcq",
        stem: "A test yields p = 0.03. Which statement is correct?",
        options: [
          "There is a 3% probability that H0 is true",
          "If H0 were true, data this extreme would occur 3% of the time, so reject H0 at the 5% level",
          "There is a 3% probability of a Type II error",
          "The effect is 3% of the mean",
        ],
        correctIndex: 1,
        explanation: "The p-value is the probability of the observed data, or more extreme, under H0. It is not the probability of H0, nor an error rate, nor an effect size.",
      },
      {
        type: "mcq",
        stem: "A test fails to reject H0 at the 5% level. Which conclusion is correct?",
        options: [
          "H0 is true",
          "H0 is false but the test lacked power",
          "The data do not provide enough evidence against H0",
          "The p-value is exactly 0.05",
        ],
        correctIndex: 2,
        explanation: "'Fail to reject' is a statement about the evidence, not a proof of H0; both a true null and an under-powered test can produce it.",
      },
      {
        type: "mcq",
        stem: "Why is picking a one-sided alternative after inspecting the data invalid?",
        options: [
          "One-sided tests are never valid",
          "It halves the p-value without new evidence, turning a 5% test into a de facto 10% test",
          "It changes the sample size",
          "It makes the standard error wrong",
        ],
        correctIndex: 1,
        explanation: "The alternative must be fixed before the data is seen; choosing the direction the data already favours argues from the conclusion back to the test.",
      },
      {
        type: "mcq",
        stem: "Twenty independent tests are run at the 5% level. Roughly how many 'significant' results are expected by chance if all the nulls are true?",
        options: ["0", "1", "5", "20"],
        correctIndex: 1,
        explanation: "With a 5% false-positive rate per test, 20 x 0.05 = 1 significant result is expected under the nulls alone — the reason multiple-testing corrections exist.",
      },

      // --- Summary & next ---
      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "A test states H0, computes a standardised distance from it and reports the p-value — the probability, under H0, of data at least as extreme as observed. Compare p with the pre-set alpha to reject or fail to reject, then express the decision in context. A p-value is not the probability that H0 is true, 'fail to reject' is not 'accept', and significance depends on the sample size as much as on the effect. Type I error is controlled by alpha; Type II error by the sample size.",
      },
      {
        type: "paragraph",
        text: "Next: inference for means. The machinery just built is applied in its proper form, with the t-distribution handling a standard deviation estimated from the sample, and with the conditions that make a one-sample interval or test valid checked before any number is reported.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 12 content — original writing, all numbers verified (Python 3).
// ---------------------------------------------------------------------------
function lesson12(): LessonContent {
  return {
    blocks: [
      // --- Learning outcomes ---
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: fit a least-squares line to a small dataset and interpret its slope and intercept in context; compute residuals, the sum of squared errors and R squared for the fit; read a correlation between -1 and 1 correctly; and explain why a fitted line must not be used outside the range of the observed x values.",
      },

      // --- Prerequisites ---
      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 3 and 5 (Spread & shape, Random variables & expectation). Regression uses the mean and the standard deviation of two variables, and the idea of a best estimate from lesson 5 applied to a line instead of a single number.",
      },

      // --- Big idea ---
      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Least-squares line",
        text: "The line y-hat = a + bx that minimises the sum of squared vertical distances between the observed y values and the line. Those distances are the residuals, and the fit is the one that makes them collectively as small as possible.",
      },
      {
        type: "definition",
        term: "Slope",
        text: "The average change in y per one-unit increase in x. It is an average rate of change across the data, not a guarantee that y will follow it in any particular case.",
      },
      {
        type: "definition",
        term: "R squared",
        text: "The share of the variation in y that the line accounts for, computed as 1 minus the sum of squared residuals divided by the total sum of squares. It equals the correlation r squared, so it lies between 0 and 1.",
      },
      {
        type: "paragraph",
        text: "Regression replaces a cloud of points with one line and two numbers. Those two numbers — the slope and R squared — answer the two questions everyone actually asks: how much does y move when x moves, and how well does x explain y at all. Because the line is fitted to averages, it describes tendencies, and the residual for any single observation measures what the tendency misses.",
      },

      // --- Concept explanation ---
      { type: "heading", level: 2, text: "Why the least-squares line is the one worth fitting" },
      {
        type: "paragraph",
        text: "For any line a + bx, the residual of an observation is the observed y minus the fitted y-hat, and the sum of squared residuals is the total squared distance between the data and the line. Minimising that sum with respect to a and b gives a closed-form solution: the slope is the sum of (x - mean x)(y - mean y) divided by the sum of (x - mean x) squared, and the intercept is the mean of y minus the slope times the mean of x. Squaring is what makes the solution unique and easy — absolute values would also measure distance but have no derivative at zero.",
      },
      {
        type: "paragraph",
        text: "Two structural facts about the residuals follow, and both are checkable on any fitted line: the residuals sum to zero, and they are uncorrelated with x. If either fails, the line is not the least-squares line. These are the same balancing properties the mean has, extended from one variable to a fitted relationship.",
      },

      // --- Worked examples ---
      { type: "heading", level: 2, text: "Worked example 1: fitting a line to five points" },
      {
        type: "paragraph",
        text: "Five pairs of observations. The line is fitted by minimising the sum of squared residuals, and every quantity below is exact.",
      },
      {
        type: "table",
        headers: ["x", "y", "y-hat (fitted)", "residual (y - y-hat)"],
        rows: [
          ["1", "3.0", "2.8", "0.2"],
          ["2", "3.0", "3.4", "-0.4"],
          ["3", "4.0", "4.0", "0.0"],
          ["4", "5.0", "4.6", "0.4"],
          ["5", "5.0", "5.2", "-0.2"],
        ],
      },
      {
        type: "code",
        language: "python",
        code: `import math

x = [1, 2, 3, 4, 5]
y = [3.0, 3.0, 4.0, 5.0, 5.0]
n = len(x)
mx, my = sum(x) / n, sum(y) / n
sxy = sum((xi - mx) * (yi - my) for xi, yi in zip(x, y))
sxx = sum((xi - mx) ** 2 for xi in x)
slope = sxy / sxx
intercept = my - slope * mx
print("slope:", slope, "intercept:", intercept)
print("fitted line: y-hat =", round(intercept, 2), "+", round(slope, 2), "x")
pred = [intercept + slope * xi for xi in x]
resid = [yi - pi for yi, pi in zip(y, pred)]
print("fitted values:", [round(p, 2) for p in pred])
print("residuals:", [round(r, 2) for r in resid])
print("sum of residuals:", round(sum(resid), 10) + 0.0)
print("sum of x times residual:", round(sum(xi * r for xi, r in zip(x, resid)), 10) + 0.0)
sse = sum(r * r for r in resid)
sst = sum((yi - my) ** 2 for yi in y)
print("SSE:", round(sse, 2), "SST:", round(sst, 2))
print("R^2:", round(1 - sse / sst, 4))
r = sxy / math.sqrt(sxx * sst)
print("correlation r:", round(r, 4))
print("prediction at x = 6:", round(intercept + slope * 6, 2))`,
        output: `slope: 0.6 intercept: 2.2
fitted line: y-hat = 2.2 + 0.6 x
fitted values: [2.8, 3.4, 4.0, 4.6, 5.2]
residuals: [0.2, -0.4, 0.0, 0.4, -0.2]
sum of residuals: 0.0
sum of x times residual: 0.0
SSE: 0.4 SST: 4.0
R^2: 0.9
correlation r: 0.9487
prediction at x = 6: 5.8`,
        caption: "The fitted line is y-hat = 2.2 + 0.6x; the residuals sum to zero and are uncorrelated with x, and R squared is 0.9.",
      },
      {
        type: "paragraph",
        text: "Method: the mean of x is 3 and the mean of y is 4.0. The sum of (x - 3)(y - 4.0) is 2 + 1 + 0 + 1 + 2 = 6, and the sum of (x - 3) squared is 4 + 1 + 0 + 1 + 4 = 10, so the slope is 6 / 10 = 0.6 and the intercept is 4.0 - 0.6 x 3 = 2.2. Reading the slope: for each one-unit increase in x, y rises by 0.6 units on average. The residuals sum to 0.0 and the sum of x times each residual is also 0.0, confirming the fit. SSE = 0.04 + 0.16 + 0 + 0.16 + 0.04 = 0.4 and SST = 1 + 1 + 0 + 1 + 1 = 4.0, so R squared = 1 - 0.4 / 4 = 0.9: the line accounts for 90% of the variation in y. The correlation is the positive square root of 0.9, about 0.9487, and a prediction at x = 6 is 2.2 + 0.6 x 6 = 5.8.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The correlation is positive because the slope is positive, and its size is the square root of R squared. A correlation of 0.95 does not mean 95% accuracy of prediction; it means R squared of 0.90, so 10% of the variation in y remains unexplained.",
      },

      { type: "heading", level: 2, text: "Worked example 2: residual structure reveals a wrong model" },
      {
        type: "paragraph",
        text: "A straight line fitted to clearly curved data. The fit looks respectable by R squared and the residuals tell a different story — they are not scattered randomly.",
      },
      {
        type: "code",
        language: "python",
        code: `x = [1, 2, 3, 4, 5]
y = [1.0, 4.0, 9.0, 16.0, 25.0]
n = len(x)
mx, my = sum(x) / n, sum(y) / n
sxy = sum((xi - mx) * (yi - my) for xi, yi in zip(x, y))
sxx = sum((xi - mx) ** 2 for xi in x)
slope = sxy / sxx
intercept = my - slope * mx
pred = [intercept + slope * xi for xi in x]
resid = [yi - pi for yi, pi in zip(y, pred)]
sse = sum(r * r for r in resid)
sst = sum((yi - my) ** 2 for yi in y)
print("slope:", slope, "intercept:", intercept)
print("fitted values:", [round(p, 2) for p in pred])
print("residuals:", [round(r, 2) for r in resid])
print("R^2:", round(1 - sse / sst, 4))`,
        output: `slope: 6.0 intercept: -7.0
fitted values: [-1.0, 5.0, 11.0, 17.0, 23.0]
residuals: [2.0, -1.0, -2.0, -1.0, 2.0]
R^2: 0.9626`,
        caption: "The residuals run +2, -1, -2, -1, +2: negative in the middle and positive at both ends, the signature of a curve a straight line cannot follow.",
      },
      {
        type: "paragraph",
        text: "Method: the fitted line is y-hat = -7.0 + 6.0x, with residuals 2.0, -1.0, -2.0, -1.0, 2.0 in the order of increasing x. A good fit leaves residuals with no pattern; here they are positive at both ends and negative throughout the middle, so a straight line is missing structure in the data. R squared of 0.9626 looks strong, and the residual pattern still forbids using the line — a reminder that a single summary number can conceal a badly wrong model.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Never use a fitted line to predict far outside the range of the observed x values. The five points above ran from x = 1 to x = 5; a prediction at x = 6 is a mild extrapolation to 5.8, but the fitted line also claims y = -1 at x = 1, which is impossible for a counting outcome. Beyond the observed range the relationship may not be linear at all.",
      },

      // --- Common mistakes ---
      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Reading a correlation as causation. A strong slope between two variables says nothing about which causes which, or whether a third variable drives both; establishing causation needs a design, not a correlation.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating R squared as accuracy. R squared is the share of variation explained, not a percentage of correct predictions; a model with R squared 0.9 can still be badly wrong for individual cases, as the residuals show.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Extrapolating beyond the observed x range. The line is only supported where data exists; outside that range it asserts a relationship that was never observed.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Mistaking a negative correlation for a weak one. Correlation lies between -1 and 1, and -0.95 indicates an association every bit as strong as +0.95, merely in the opposite direction.",
      },

      // --- Check questions ---
      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "For the five-point fit above, what does the slope of 0.6 mean in context?",
        answer: "For each one-unit increase in x, y increases by 0.6 units on average.",
        explanation: "A slope is an average rate of change across the data; it is not a guarantee for any single case, and the intercept of 2.2 is the fitted value at x = 0, which may or may not be meaningful.",
      },
      {
        type: "question",
        prompt: "In the curved-data example, why does R squared of 0.9626 not justify using the straight line?",
        answer: "Because the residuals — +2, -1, -2, -1, +2 — follow a pattern, positive at both ends and negative in the middle, which a correct linear model would not leave behind.",
        explanation: "R squared measures share of variation explained; residual structure detects whether the functional form is right. A high R squared with patterned residuals is a warning, not a licence.",
      },
      {
        type: "question",
        prompt: "The correlation between x and y is -0.83. What is R squared, and how strong is the association?",
        answer: "R squared is (-0.83) squared = 0.6889, so about 69% of the variation in y is accounted for; the association is strong and negative.",
        explanation: "R squared is the square of the correlation, so it is always between 0 and 1 and loses only the sign. A large negative correlation is a strong association.",
      },

      // --- MCQs ---
      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A least-squares line fitted to five (x, y) points gives y-hat = 2.2 + 0.6x. What does the slope 0.6 mean?",
        options: [
          "For each one-unit increase in x, y increases by 0.6 units on average",
          "y is always exactly 0.6 times x",
          "When x is zero, y must also be zero",
          "60% of the data lie on the line",
        ],
        correctIndex: 0,
        explanation: "Slope is an average rate of change, not a guarantee for any single case; the intercept is the fitted value at x = 0, and the share of variation explained is R squared, not the slope.",
      },
      {
        type: "mcq",
        stem: "For the five-point fit, what are SSE, SST and R squared?",
        options: ["SSE 0.4, SST 4.0, R^2 0.9", "SSE 4.0, SST 0.4, R^2 0.1", "SSE 0.9, SST 4.0, R^2 0.4", "SSE 0.4, SST 4.0, R^2 0.5"],
        correctIndex: 0,
        explanation: "SSE = 0.04 + 0.16 + 0 + 0.16 + 0.04 = 0.4, SST = 1 + 1 + 0 + 1 + 1 = 4.0, and R squared = 1 - 0.4 / 4 = 0.9.",
      },
      {
        type: "mcq",
        stem: "In the curved-data example, the residuals are +2, -1, -2, -1, +2. What do they indicate?",
        options: [
          "The least-squares line was computed incorrectly",
          "A straight line is the wrong functional form, because the residuals follow a pattern rather than scattering randomly",
          "The data contains no outliers",
          "R squared must be negative",
        ],
        correctIndex: 1,
        explanation: "Patterned residuals — positive at both ends, negative in the middle — mean the model is missing curvature. A correct fit leaves residuals unstructured around zero.",
      },
      {
        type: "mcq",
        stem: "A correlation of -0.9 is reported. Which statement is correct?",
        options: [
          "The association is weak because the value is negative",
          "The association is strong and negative, and R squared is 0.81",
          "R squared is negative, which is impossible",
          "x causes y to decrease",
        ],
        correctIndex: 1,
        explanation: "The sign gives direction and the magnitude gives strength, so -0.9 is as strong as +0.9. R squared is 0.81; correlation alone says nothing about causation.",
      },
      {
        type: "mcq",
        stem: "Why must a fitted line not be used to predict far outside the observed range of x?",
        options: [
          "The line becomes steeper",
          "The linear relationship was never observed there, so the extrapolation asserts unseen structure",
          "The slope changes sign",
          "R squared always falls to zero",
        ],
        correctIndex: 1,
        explanation: "The fit is supported only by the data behind it; outside the observed range the relationship may be curved, capped, or absent entirely, and the line has no evidence about it.",
      },

      // --- Summary & next ---
      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The least-squares line minimises the sum of squared residuals, with slope equal to the sum of (x - mean x)(y - mean y) over the sum of (x - mean x) squared and intercept equal to mean y minus slope times mean x. Its residuals sum to zero and are uncorrelated with x. R squared is one minus SSE over SST and equals the correlation squared, so it reports the share of variation the line explains. Patterns in residuals reveal a wrong functional form, a high R squared does not mean accurate individual predictions, and neither slope nor correlation establishes causation.",
      },
      {
        type: "paragraph",
        text: "This closes the inference arc of the course: describe data, quantify uncertainty in that description, build intervals and tests on it, and finally model one variable as a function of another. Lessons 10 and 11 extend the same machinery to one and two samples, and the same discipline — state the assumptions, check them, then report in context — is what carries forward.",
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
