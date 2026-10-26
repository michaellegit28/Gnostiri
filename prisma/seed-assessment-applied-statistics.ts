import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Assessment content — Applied Statistics (STA 102).
 *
 * 14 original SBA items deepening the Applied Statistics bank to the 26-item
 * house standard, tagged to the existing ConceptNodes (see
 * prisma/seed-university.ts). New rows are laid down from orderIndex 1
 * (orderIndex is presentation order, not unique); the bank's original item
 * keeps its slot.
 *
 * Coverage: descriptive statistics, probability, distributions, sampling,
 * hypothesis testing, correlation and regression, and data presentation.
 *
 * Calculation items carry exact arithmetic, and the explanation states the
 * method so a reviewer can re-derive every number. Governance: every item
 * ships reviewStatus "needs-human-review", marks 1, negativeMarks 0.25 per
 * platform convention, and each correctAnswer is copied verbatim from one
 * option so the seed's option rotation cannot drift the answer key.
 */

const COURSE_SLUG = "applied-statistics";
const START_INDEX = 1;

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
  // 1 — Data presentation: quantitative versus qualitative data (easy)
  {
    slug: "applied-statistics--what-is-data--qualitative-vs-quantitative",
    concept: "what-is-data",
    format: "sba",
    stem: "A survey records each participant's eye colour and their reaction time in milliseconds. Which statement is correct, and how should each be presented?",
    options: [
      "Eye colour is categorical, so use a bar chart of counts; reaction time is quantitative, so use a histogram or boxplot",
      "Both variables are quantitative because the survey collects numbers",
      "Eye colour is quantitative and reaction time is categorical",
      "A pie chart is the correct presentation for both variables",
    ],
    correctAnswer:
      "Eye colour is categorical, so use a bar chart of counts; reaction time is quantitative, so use a histogram or boxplot",
    explanation:
      "Categorical data record group membership, so they are summarised as counts or proportions and drawn with bar charts; measuring a number gives quantitative data, summarised by center and spread and drawn with histograms or boxplots. Reaction time also reveals its shape — skewed data favour a median and IQR, symmetric data a mean and SD. Bars show categories, histograms show continuous bins, which is why they are never interchangeable.",
    difficulty: "easy",
    marks: 1,
    needsCheck: false,
  },

  // 2 — Descriptive statistics: effect of correcting one value on the mean (medium)
  {
    slug: "applied-statistics--center-measures--corrected-mean",
    concept: "center-measures",
    format: "sba",
    stem: "Four observations are 5, 7, 9 and 11, giving a mean of 8. One entry is then corrected from 11 to 15. What is the new mean?",
    options: [
      "9 — the corrected total is 5 + 7 + 9 + 15 = 36, and 36 / 4 = 9",
      "10.25 — the correction adds 4, so 4 is added to the old mean",
      "8 — the mean is unchanged when only one of four values changes",
      "11.5 — the old total is divided by the new value 15",
    ],
    correctAnswer:
      "9 — the corrected total is 5 + 7 + 9 + 15 = 36, and 36 / 4 = 9",
    explanation:
      "Method: sum the corrected values (5 + 7 + 9 + 15 = 36) and divide by the count (4), giving 36 / 4 = 9. Equivalently, the total rises by 4 while n stays 4, so the mean rises by 4 / 4 = 1, from 8 to 9. The mean moves by (change in one value) / n, which is why a single extreme correction shifts it so little here.",
    difficulty: "medium",
    marks: 1,
  },

  // 3 — Descriptive statistics: computing a standard deviation exactly (medium)
  {
    slug: "applied-statistics--spread-shape--exact-sd",
    concept: "spread-shape",
    format: "sba",
    stem: "For the data 2, 4, 4, 4, 5, 5, 7, 9, what is the standard deviation?",
    options: [
      "2 — the mean is 5, the squared deviations sum to 32, and 32 / 8 = 4, whose square root is 2",
      "4 — the mean is 5, the squared deviations sum to 32, and 32 / 8 = 4",
      "About 2.14 — the mean is 5, and 32 / 7 gives a sample variance of about 4.571",
      "About 18 — squaring the deviations and summing them, then dividing by the mean",
    ],
    correctAnswer:
      "2 — the mean is 5, the squared deviations sum to 32, and 32 / 8 = 4, whose square root is 2",
    explanation:
      "Method: mean = (2+4+4+4+5+5+7+9) / 8 = 40 / 8 = 5; deviations are -3, -1, -1, -1, 0, 0, 2, 4; their squares are 9, 1, 1, 1, 0, 0, 4, 16, summing to 32. Treating the eight values as the whole population gives variance 32 / 8 = 4 and SD sqrt(4) = 2. Were these a sample, dividing by n-1 = 7 would give about 4.571 and an SD of about 2.14 — so the divisor is part of the answer, not a detail.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false,
  },

  // 4 — Probability: the addition rule (easy)
  {
    slug: "applied-statistics--probability-rules--addition-rule",
    concept: "probability-rules",
    format: "sba",
    stem: "For two events, P(A) = 0.5, P(B) = 0.4 and P(A and B) = 0.1. What is P(A or B)?",
    options: [
      "0.8 — because P(A or B) = P(A) + P(B) - P(A and B)",
      "0.9 — because P(A or B) = P(A) + P(B)",
      "0.0 — because P(A and B) is the probability of neither",
      "0.2 — because the overlap is all that remains after subtracting",
    ],
    correctAnswer: "0.8 — because P(A or B) = P(A) + P(B) - P(A and B)",
    explanation:
      "Method: the general addition rule is P(A or B) = P(A) + P(B) - P(A and B) = 0.5 + 0.4 - 0.1 = 0.8. Subtracting the overlap stops the intersection being counted twice. Adding to 0.9 is the mutually exclusive shortcut, which does not apply once the events overlap with probability 0.1.",
    difficulty: "easy",
    marks: 1,
  },

  // 5 — Probability: conditional probability in screening (hard)
  {
    slug: "applied-statistics--probability-rules--screening-bayes",
    concept: "probability-rules",
    format: "sba",
    stem: "A condition affects 1% of a population. A test is positive for 95% of those who have it and for 5% of those who do not. Given a positive result, what is the probability the person actually has the condition?",
    options: [
      "About 0.16 — the posterior is 0.0095 / 0.059, so roughly 16 in 100 positive results are true cases",
      "0.95 — the sensitivity of the test is the chance of a correct result",
      "0.01 — the prevalence is unchanged by the test outcome",
      "About 0.50 — half of all results are positive",
    ],
    correctAnswer:
      "About 0.16 — the posterior is 0.0095 / 0.059, so roughly 16 in 100 positive results are true cases",
    explanation:
      "Method (Bayes' rule): P(positive and condition) = 0.95 x 0.01 = 0.0095, and P(positive) = 0.0095 + (0.05 x 0.99) = 0.0095 + 0.0495 = 0.059, so the posterior is 0.0095 / 0.059 = 0.161, about 16%. The 95% figure is the sensitivity, which is not the same question: with a low prevalence, false positives from the unaffected 99% outnumber true positives.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false,
  },

  // 6 — Expected value of a game (easy)
  {
    slug: "applied-statistics--expected-value--game-value",
    concept: "expected-value",
    format: "sba",
    stem: "A game pays +5 with probability 0.4 and costs 2 with probability 0.6. What is the expected value of a single play?",
    options: [
      "0.8 — because 5 x 0.4 + (-2) x 0.6 = 2 - 1.2",
      "1.5 — because (5 + (-2)) / 2 averages the two outcomes",
      "3 — because 5 x 0.4 = 2 and 2 is added to the cost",
      "-0.8 — because a loss outweighs a win on average",
    ],
    correctAnswer: "0.8 — because 5 x 0.4 + (-2) x 0.6 = 2 - 1.2",
    explanation:
      "Method: the expected value of a discrete variable is the sum of each outcome multiplied by its probability, giving 5 x 0.4 + (-2) x 0.6 = 2 - 1.2 = 0.8. It is a long-run average, not a value that can occur on any single play: most plays win 5 or lose 2, never 0.8.",
    difficulty: "easy",
    marks: 1,
  },

  // 7 — Distributions: binomial moments (medium)
  {
    slug: "applied-statistics--distributions--binomial-moments",
    concept: "distributions",
    format: "sba",
    stem: "A binomially distributed count has n = 10 and p = 0.3. What are its mean and variance?",
    options: [
      "Mean 3 and variance 2.1 — because 10 x 0.3 = 3 and 10 x 0.3 x 0.7 = 2.1",
      "Mean 3 and variance 3 — because the variance of a binomial equals its mean",
      "Mean 7 and variance 2.1 — because n x (1 - p) is the mean",
      "Mean 3 and variance 0.09 — because 0.3 squared is the variance",
    ],
    correctAnswer:
      "Mean 3 and variance 2.1 — because 10 x 0.3 = 3 and 10 x 0.3 x 0.7 = 2.1",
    explanation:
      "Method: for a binomial the mean is np = 10 x 0.3 = 3 and the variance is np(1-p) = 10 x 0.3 x 0.7 = 2.1, so the standard deviation is the square root of 2.1, about 1.45. Variance and mean coincide only for the Poisson distribution, not the binomial — a common mix-up.",
    difficulty: "medium",
    marks: 1,
  },

  // 8 — Distributions: standardising with a z-score (medium)
  {
    slug: "applied-statistics--distributions--z-score-standardising",
    concept: "distributions",
    format: "sba",
    stem: "A measurement is normally distributed with mean 70 and standard deviation 10. What is the z-score of a value of 85?",
    options: [
      "1.5 — because (85 - 70) / 10 = 1.5",
      "15 — because the value is 15 units above the mean",
      "-1.5 — because the value lies above the mean, so the sign is negative",
      "0.5 — because 85 is half of the way to the upper reference limit",
    ],
    correctAnswer: "1.5 — because (85 - 70) / 10 = 1.5",
    explanation:
      "Method: z = (x - mean) / SD = (85 - 70) / 10 = 1.5, so the value sits 1.5 standard deviations above the mean. On the standard normal scale that corresponds to roughly the 93rd percentile, since about 93% of the area lies below z = 1.5.",
    difficulty: "medium",
    marks: 1,
  },

  // 9 — Sampling: the standard error of the mean (medium)
  {
    slug: "applied-statistics--sampling-clt--standard-error",
    concept: "sampling-clt",
    format: "sba",
    stem: "A population has standard deviation 12. Samples of size 36 are drawn. What is the standard deviation of the sample mean?",
    options: [
      "2 — because 12 / 6 = 2, using the square root of the sample size",
      "12 — the standard deviation of the mean equals the population standard deviation",
      "1/3 — because 6 / 12 divides the standard deviation by the sample size",
      "4 — because 12 / 3, using the sample standard deviation divisor",
    ],
    correctAnswer: "2 — because 12 / 6 = 2, using the square root of the sample size",
    explanation:
      "Method: the standard error of the mean is sigma over the square root of n, so 12 / sqrt(36) = 12 / 6 = 2. The Central Limit Theorem also tells us that with n = 36 this sampling distribution is approximately normal regardless of the population shape, provided the samples are independent and the population variance is finite.",
    difficulty: "medium",
    marks: 1,
  },

  // 10 — Sampling: the unbiased sample variance (hard)
  {
    slug: "applied-statistics--sampling-clt--unbiased-variance",
    concept: "sampling-clt",
    format: "sba",
    stem: "A sample of three values, 3, 5 and 7, is drawn from a larger population. Which divisor gives the unbiased estimate of the population variance?",
    options: [
      "Divide 8 by 2 — the sample variance uses n - 1 so that the estimate is unbiased",
      "Divide 8 by 3 — the divisor is always the sample size n",
      "Divide 45 by 3 — variance is the sum of the values divided by n",
      "Divide 8 by 6 — both the sample size and its square root are used as divisors",
    ],
    correctAnswer:
      "Divide 8 by 2 — the sample variance uses n - 1 so that the estimate is unbiased",
    explanation:
      "Method: the mean is 5, so the squared deviations are 4, 0 and 4, summing to 8; dividing by n - 1 = 2 gives a sample variance of 4. Dividing by n = 3 gives 8/3 and systematically understates the population variance, because the deviation of each point is measured from the sample's own mean, which is fitted to the data.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false,
  },

  // 11 — Hypothesis testing: what a p-value means (medium)
  {
    slug: "applied-statistics--hypothesis-testing--p-value-meaning",
    concept: "hypothesis-testing",
    format: "sba",
    stem: "A test at the 5% level returns a p-value of 0.03. Which statement is correct?",
    options: [
      "If the null hypothesis were true, a result at least this extreme would occur about 3 times in 100; it is a conditional statement about the data, not about the hypothesis",
      "The null hypothesis is true with probability 0.03",
      "The alternative hypothesis has been proved correct with 97% confidence",
      "The p-value is the probability that the result would replicate in a repeat experiment",
    ],
    correctAnswer:
      "If the null hypothesis were true, a result at least this extreme would occur about 3 times in 100; it is a conditional statement about the data, not about the hypothesis",
    explanation:
      "The p-value is P(data as extreme as observed, or worse, if H0 is true), so 0.03 measures surprise relative to the null hypothesis only. It is neither the probability that H0 is true nor the probability of replication, and a small value does not prove the alternative — it only shows the data are unlikely under the null. Since 0.03 is below the 0.05 threshold, the conventional decision is to reject H0.",
    difficulty: "medium",
    marks: 1,
  },

  // 12 — Hypothesis testing: type I error and alpha (easy)
  {
    slug: "applied-statistics--hypothesis-testing--type-i-error",
    concept: "hypothesis-testing",
    format: "sba",
    stem: "A test is conducted at the 0.05 significance level and the null hypothesis is in fact true. What is the probability of a type I error?",
    options: [
      "0.05 — rejecting a true null is a type I error, and its rate is alpha",
      "0.95 — the test finds significance 95% of the time",
      "0.05 — a type I error is failing to reject a false null",
      "Zero — a correctly designed test never rejects a true null",
    ],
    correctAnswer:
      "0.05 — rejecting a true null is a type I error, and its rate is alpha",
    explanation:
      "A type I error is rejecting a null hypothesis that is actually true, and alpha is the maximum tolerable rate of exactly that, here 5%. Failing to reject a false null is the complementary type II error, whose rate beta rises whenever alpha is tightened. No finite test can make either rate zero, since sampling always leaves some chance of a misleading result.",
    difficulty: "easy",
    marks: 1,
  },

  // 13 — Inference: exact confidence interval for a mean (medium)
  {
    slug: "applied-statistics--confidence-intervals--exact-interval",
    concept: "confidence-intervals",
    format: "sba",
    stem: "A sample of 81 observations has mean 50 and standard error 2. What is the 95% confidence interval for the mean?",
    options: [
      "46.08 to 53.92 — because 1.96 x 2 = 3.92 either side of 50",
      "48 to 52 — because two standard errors are added and subtracted",
      "46 to 54 — because the margin rounds to the nearest whole unit",
      "46.08 to 53.92 is wrong, because the interval must contain the standard error itself",
    ],
    correctAnswer:
      "46.08 to 53.92 — because 1.96 x 2 = 3.92 either side of 50",
    explanation:
      "Method: interval = estimate ± z* x standard error = 50 ± 1.96 x 2 = 50 ± 3.92, giving 46.08 to 53.92. The correct interpretation is procedural: under repeated sampling, about 95% of intervals built this way contain the true mean, so 95% is a property of the method rather than a probability attached to this one calculated interval.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false,
  },

  // 14 — Correlation and regression: interpreting r and the slope (medium)
  {
    slug: "applied-statistics--regression--correlation-and-slope",
    concept: "regression",
    format: "sba",
    stem: "For the three points (1, 2), (2, 4) and (3, 5), what is the least-squares slope, and what does r squared tell you about it?",
    options: [
      "Slope 1.5, because 3 / 2 = 1.5; r squared is the share of the variance in y explained by the line",
      "Slope 1.5, because the mean of y divided by the mean of x is 1.5",
      "Slope 3, because the changes in y total 3",
      "Slope 0, because three points cannot define a line",
    ],
    correctAnswer:
      "Slope 1.5, because 3 / 2 = 1.5; r squared is the share of the variance in y explained by the line",
    explanation:
      "Method: the mean of x is 2 and the mean of y is 11/3, so the cross-product sum is (-1)(-5/3) + 0 + (1)(4/3) = 3 and the sum of squared x-deviations is 1 + 0 + 1 = 2, giving slope 3 / 2 = 1.5 with intercept 11/3 - 1.5(2) = 2/3. The intercept is the fitted value at x = 0, not the mean of y divided by the mean of x. r squared, the squared correlation, is the proportion of variability in y accounted for by the line, so r = 0.85 explains about 72% of it.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false,
  },
];

async function seedAssessmentAppliedStatistics() {
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

  console.log(`✓ STA 102 assessment items: ${count} items (marks 1, needs-human-review)`);
}

// CLI usage: npx ts-node prisma/seed-assessment-applied-statistics.ts
if (process.argv[1] && process.argv[1].includes("seed-assessment-applied-statistics")) {
  seedAssessmentAppliedStatistics()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}

export { seedAssessmentAppliedStatistics, ITEMS as APPLIED_STATISTICS_ITEMS };
