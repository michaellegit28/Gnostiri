# Curriculum Alignment — Applied Statistics

## The anchor

This course is anchored to **OpenIntro Statistics, 4th edition**, by David M.
Diez (Harvard), Mine Çetinkaya-Rundel, and Christopher D. Barr — a named,
free, openly-licensed (CC BY-SA) public curriculum available at
https://www.openintro.org/book/os/. The 12-lesson structure maps to the book's
chapter sequence so a student following it — or being taught from it — can see
exactly where each lesson sits. Alignment is **stated, not claimed**: every
lesson cites the OpenIntro chapter and topic it covers, so it can be audited.

This is an *applied* introduction: the emphasis is on using statistics to
reason about real data and uncertainty, which suits the "what students
actually need" goal — they learn to summarise data, quantify uncertainty, and
make defensible conclusions rather than mechanically plug into formulas.

OpenIntro Statistics is CC BY-SA 3.0 (4th ed. is released under the same
open terms with a free digital edition). Our lessons are original writing in
our own words, but the **topic sequence is the curriculum** we are
deliberately following, and the chapter citations below make that explicit.

## Lesson → OpenIntro Statistics chapter mapping

| Lesson | Title | OpenIntro chapter | Topic |
|---|---|---|---|
| 1 | What is data & variables | 1: Introduction to data | Observations, variables, types of data |
| 2 | Summarizing center | 1: Introduction to data | Mean, median, robust center |
| 3 | Spread & shape | 1: Introduction to data | Variance, SD, quartiles, IQR, outliers, histograms |
| 4 | Probability rules | 3: Probability | Sample space, addition & complement rules, independence |
| 5 | Random variables & expectation | 3-4: Probability / Distributions | Expected value, variance of a random variable |
| 6 | Distributions: binomial & normal | 4: Distributions of random variables | Shape of discrete & continuous distributions |
| 7 | Sampling distributions & CLT | 4-5: Distributions | Sampling distributions, the Central Limit Theorem |
| 8 | Confidence intervals | 5: Foundations for inference | Point estimates, margin of error, intervals |
| 9 | Hypothesis testing | 5: Foundations for inference | Null & alt hypotheses, p-value, significance |
| 10 | Inference for means | 7: Inference for numerical data | One-sample & two-sample t, paired data |
| 11 | Inference for proportions | 6: Inference for categorical data | Proportion inference, chi-square idea |
| 12 | Linear regression | 8: Introduction to linear regression | Least squares, correlation, interpreting the line |

## Module structure

| Module | Lessons | OpenIntro domain |
|---|---|---|
| M1 — Describing data | 1, 2, 3 | Ch 1 (descriptive statistics) |
| M2 — Probability | 4, 5, 6 | Ch 3-4 (risk & distributions) |
| M3 — Inference foundations | 7, 8, 9 | Ch 5 (uncertainty & inference) |
| M4 — Inference & modeling | 10, 11, 12 | Ch 6-8 (applied inference + regression) |

## Prerequisite DAG (seeded)

The 12 ConceptNodes form a strict chain mirroring the book's build order:
what-is-data → center-measures → spread-shape → probability-rules →
expected-value → distributions → sampling-clt → confidence-intervals →
hypothesis-testing → inference-means → inference-proportions → regression.
Each lesson genuinely needs the one before it, so the DAG is a chain.

## Authoring discipline

Identical to the Python course:

- Every lesson follows the same ritual: **learning outcomes → prerequisites →
  big idea → concept explanation (why before how) → worked examples with
  runnable Python and its exact numeric output → common mistakes (callout) →
  3 inline check questions → 8 MCQs with explanations → summary & next.**
- Every worked example's numbers are **computable and verified** by running
  Python (via `tests/statistics-python.test.mjs`), not stated from memory.
- This is an applied course, so the examples use small datasets you can
  reproduce by hand and verify, keeping the reasoning transparent.

## Governance

- Every row is `reviewStatus: "needs-human-review"`; the seeder never marks
  anything `verified`.
- `needsCheck: true` marks anything the author is not certain of.
- This document is the audit trail for "what are we actually teaching and why".
