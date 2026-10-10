import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Maths Topic 4: Statistics & Probability at the no-exceptions bar:
// averages, spread, probability laws, trees, conditional, combinations, binomial, normal distribution, sampling, correlation.

const STATS_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Averages — which one, and why" },
  { type: "definition", term: "The three averages", text: "Mean = sum ÷ count (every value matters — outliers DRAG it). Median = the middle value (ORDER the data first — the step candidates skip). Mode = the most frequent value. The exam's question is never 'calculate all three' — it is 'WHICH average best represents this data, and why'." },
  { type: "example", text: "Worked: wages 2, 3, 3, 5, 27 (thousand) → mean 8 (misleading — the outlier drags it), median 3 (the middle), mode 3. Skewed data with outliers → quote the MEDIAN and say why: the mean is pulled by the extreme value. Ungrouped median with an even count: average the middle two." },
  { type: "heading", level: 2, text: "2. Spread — range, IQR, standard deviation" },
  { type: "definition", term: "Measures of spread", text: "Range = max − min (one outlier distorts it). Interquartile range IQR = Q3 − Q1 — the spread of the middle 50%, robust to outliers. Standard deviation = the average distance from the mean (small σ = clustered tight). Box plots display all five numbers: min, Q1, median, Q3, max." },
  { type: "example", text: "Worked: 1, 3, 5, 7, 9 → median 5, Q1 = 2, Q3 = 8 → IQR = 6. Two classes, same mean 60: one clustered (σ = 4), one spread (σ = 15) — same average, completely different consistency. Comparing CONSISTENCY is an IQR or σ question, never a range question." },
  { type: "heading", level: 2, text: "3. Averages from tables — grouped data" },
  { type: "paragraph", text: "Grouped data hides exact values — use the MIDPOINT of each class × its frequency. Estimated mean = Σfx ÷ Σf; the modal class is the one with the highest frequency. The exam word is ESTIMATED: grouped data can only approximate — call it that for the precision mark." },
  { type: "example", text: "Worked: classes 0–10 (f = 4, midpoint 5), 10–20 (f = 6, midpoint 15) → estimated mean = (4×5 + 6×15) ÷ 10 = 110 ÷ 10 = 11. Every class contributes midpoint × frequency — add the column, divide by Σf. Writing the fx column IS the method mark." },
  { type: "heading", level: 2, text: "4. Probability — the scale and the complement" },
  { type: "definition", term: "Probability", text: "P(event) = favourable outcomes ÷ total outcomes — always between 0 (impossible) and 1 (certain). P(not A) = 1 − P(A): the complement rule — often the fastest route to an answer. Probabilities of all possible outcomes sum to exactly 1. Experimental probability (relative frequency) ESTIMATES the theoretical value and converges with more trials." },
  { type: "example", text: "Worked: a fair die: P(prime) = 3/6 = 1/2 (2, 3, 5); P(not even) = 1 − 1/2 = 1/2. A die rolls a six 87 times in 600 throws → 87/600 = 0.145 vs theoretical 1/6 ≈ 0.167 — close, converging. 'Estimate the probability' means divide the counts — 'theoretical' means use the fractions." },
  { type: "heading", level: 2, text: "5. AND and OR — the two laws" },
  { type: "definition", term: "The laws", text: "INDEPENDENT events joined by AND: MULTIPLY — P(A and B) = P(A) × P(B). MUTUALLY EXCLUSIVE events joined by OR: ADD — P(A or B) = P(A) + P(B) (they cannot both happen). The general OR with overlap: P(A ∪ B) = P(A) + P(B) − P(A ∩ B) — SUBTRACT the overlap once (the double-count is the classic trap)." },
  { type: "example", text: "Worked: two coins: P(two heads) = 1/2 × 1/2 = 1/4. Die and coin: P(six AND heads) = 1/6 × 1/2 = 1/12. A card: P(even OR prime) on a die = 1/2 + 1/2 − 1/6(only 2 is both... 2 is even and prime — P = 1/6) = 5/6? Check: even = {2,4,6}, prime = {2,3,5}, union = {2,3,4,5,6} → 5/6 ✓." },
  { type: "heading", level: 2, text: "6. Tree diagrams — multiply along, add across" },
  { type: "paragraph", text: "A tree diagram maps every outcome: probabilities MULTIPLY along a single path (the branches are sequential ANDs) and ADD across different paths leading to the same event. First-branch probabilities always sum to 1; SECOND-branch probabilities CHANGE when events are not independent — without replacement, the bag shrinks (the trap: forgetting the denominator changed)." },
  { type: "example", text: "Worked: bag with 5 red, 3 blue; two drawn WITHOUT replacement: P(RR) = 5/8 × 4/7 = 20/56 = 5/14. P(one of each) = (5/8 × 3/7) + (3/8 × 5/7) = 15/56 + 15/56 = 30/56 = 15/28 — two paths, added. The 4/7 on the second branch is the whole question: the bag has one fewer red." },
  { type: "heading", level: 2, text: "7. Conditional probability — given that" },
  { type: "definition", term: "P(B | A)", text: "The probability of B GIVEN A has already happened: P(B|A) = P(A and B) ÷ P(A) — the sample space has SHRUNK to A. Read it straight off a tree's second branch, or off a Venn's overlap ÷ the A circle. Independence test: P(B|A) = P(B) means A tells you nothing about B." },
  { type: "example", text: "Worked: from the bag above: P(blue | first was red) = 3/7 — direct from the reduced bag (8 − 1 = 7 left, 3 blue unchanged). Venn: P(both) ÷ P(first) = (5/8 × 3/7) ÷ (5/8) = 3/7 ✓ — the formula and the tree agree, as they must." },
  { type: "heading", level: 2, text: "8. Combinations and permutations — order or not" },
  { type: "table", headers: ["Tool", "Order?", "Formula", "Worked"], rows: [["Permutation nPr", "YES — arrangements", "n!/(n − r)!", "Arrange 4 of 7 books: 7P4 = 840"], ["Combination nCr", "NO — selections", "n!/(r!(n − r)!)", "Choose 2 of 5: 5C2 = 10"], ["Committee", "NO", "nCr", "Committee of 3 from 8: 8C3 = 56"]] },
  { type: "paragraph", text: "The exam's one-line discriminator: does REARRANGING the chosen items make a different outcome? Arranging books on a shelf — yes (permutation). Choosing a committee — no (combination). nCr = nPr ÷ r!: every combination is a permutation divided by its own internal orderings." },
  { type: "heading", level: 2, text: "9. The binomial distribution — fixed trials, two outcomes" },
  { type: "definition", term: "Binomial", text: "n independent trials, constant success probability p, two outcomes (success/failure): P(X = r) = nCr × p^r × (1 − p)^(n−r). The expected value is simply E(X) = np — the average you would see over many repetitions." },
  { type: "example", text: "Worked: 10 coin flips, p = 1/2: P(exactly 6 heads) = 10C6 × (1/2)⁶ × (1/2)⁴ = 210 × (1/2)¹⁰ = 210/1024 ≈ 0.205. Expected heads in 10 flips: E(X) = 10 × 1/2 = 5. The three conditions (fixed n, constant p, two outcomes) must be stated — they are the mark before the formula." },
  { type: "heading", level: 2, text: "10. The normal distribution — the bell curve" },
  { type: "definition", term: "68–95–99.7", text: "The normal distribution is symmetric about the mean μ, bell-shaped, defined by μ and σ. The rule that answers most questions without tables: 68% of data within ±1σ, 95% within ±2σ, 99.7% within ±3σ. Standardise with z = (x − μ)/σ to use tables or a calculator." },
  { type: "diagram", diagramId: "normal-distribution", caption: "68% within ±1σ, 95% within ±2σ, 99.7% within ±3σ" },
  { type: "example", text: "Worked: heights with μ = 60 kg, σ = 8: P(heavier than 76) = P(z > 2) ≈ 2.5% (the tail beyond 95%). P(between 52 and 68) = 68%. The symmetry trick: P(X > μ) = 0.5 always — half the bell, no calculation needed." },
  { type: "heading", level: 2, text: "11. Sampling — estimates and bias" },
  { type: "paragraph", text: "A RANDOM sample (every member equally likely) estimates the population fairly; a biased sample does not — the exam wants the bias NAMED and its effect explained: 'only morning shoppers' misses evening habits. Capture-recapture: marked/total = recaptured marked/second sample — proportional reasoning in one line." },
  { type: "example", text: "Worked: 40 fish tagged and released; a second catch of 60 contains 8 tagged → population ≈ 40 × 60 ÷ 8 = 300. The assumption: mixing is complete and the proportion holds — state it for the mark. Biased sampling question: 'a survey of a smartphone app' misses offline users — name who is excluded and why the estimate skews." },
  { type: "heading", level: 2, text: "12. Correlation and regression — the eternal trap" },
  { type: "definition", term: "Correlation ≠ causation", text: "Scatter graphs show correlation: positive (both rise), negative (one falls), none. A line of best fit y = mx + c predicts — INTERPOLATION (inside the data) is reliable, EXTRAPOLATION (outside) is not. And correlation never PROVES causation: ice-cream sales correlate with drownings — summer causes both, ice cream causes neither." },
  { type: "example", text: "Worked: regression y = 2x + 10 from data spanning x = 1 to 10: predict at x = 5 → 20 (interpolating — reliable); at x = 50 → 110 (extrapolating — the model is untested there, say so). The confounder explanation is the essay mark: name the hidden third variable." },
  { type: "heading", level: 2, text: "13. Summary — the statistics spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Averages", "Order data first; which one and why", "Outliers drag the mean"], ["Spread", "IQR for consistency, σ for clustering", "Range distorts with outliers"], ["Probability", "P = favourable/total; complement shortcut", "Probabilities never exceed 1"], ["AND / OR", "Multiply independent ANDs; add exclusive ORs", "Subtract the overlap once"], ["Trees", "Multiply along, add across", "Without replacement changes denominators"], ["Counting", "Rearranging matters? nPr : nCr", "Committees are combinations"], ["Normal", "68–95–99.7; z = (x − μ)/σ", "P(X > μ) = 0.5 by symmetry"], ["Correlation", "Interpolate yes, extrapolate no", "Correlation is not causation"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'calculate' = formula, substitution, sensible rounding; 'estimate' = counts divided or midpoints × frequency; 'comment on' = name the outlier/bias/confounder and its effect — the comment IS the mark. Statistics papers reward the reasoning sentence as much as the number." },
];

const STATS_QS: Q[] = [
  { q: "Wages: 2, 3, 3, 5, 27 (thousand). The best average to quote is", o: ["the mean — it uses all data", "the median — the outlier drags the mean", "the mode — it appears most", "the range"], a: "the median — the outlier drags the mean", e: "Mean 8 is misleading; median 3 represents the typical wage.", d: "easy" },
  { q: "Data: 1, 3, 5, 7, 9. The interquartile range is", o: ["6", "8", "4", "5"], a: "6", e: "Q1 = 2, Q3 = 8, IQR = 8 − 2 = 6 — the middle 50%.", d: "medium" },
  { q: "A fair die is rolled once. P(prime number) is", o: ["1/2", "1/3", "1/6", "2/3"], a: "1/2", e: "Primes {2,3,5} — 3 of 6 outcomes.", d: "easy" },
  { q: "P(A) = 0.4, P(B) = 0.3, P(A and B) = 0.1. P(A or B) is", o: ["0.6 — subtract the overlap", "0.7", "0.12", "0.5"], a: "0.6 — subtract the overlap", e: "0.4 + 0.3 − 0.1 — the general OR subtracts the double-count.", d: "medium" },
  { q: "Bag: 5 red, 3 blue. Two drawn WITHOUT replacement. P(both red) is", o: ["25/64", "5/14", "10/28", "1/2"], a: "5/14", e: "5/8 × 4/7 — the second branch's denominator changed.", d: "medium" },
  { q: "P(blue | first was red) for the same bag is", o: ["3/8", "3/7 — the bag shrinks", "5/14", "1/2"], a: "3/7 — the bag shrinks", e: "Conditional: 7 sweets left, 3 blue unchanged.", d: "medium" },
  { q: "Choosing a committee of 3 from 8 people is", o: ["8P3 = 336", "8C3 = 56 — order doesn't matter", "8 × 3 = 24", "8C2 = 28"], a: "8C3 = 56 — order doesn't matter", e: "Rearranging committee members changes nothing → combination.", d: "medium" },
  { q: "A fair coin is flipped 10 times. The expected number of heads is", o: ["5 — E(X) = np", "10", "2.5", "6"], a: "5 — E(X) = np", e: "10 trials × 1/2 — the binomial mean is the simplest formula in the course.", d: "easy" },
  { q: "Weights are normal with μ = 60, σ = 8. P(weight > 76) is about", o: ["2.5% — two σ above the mean", "5%", "16%", "32%"], a: "2.5% — two σ above the mean", e: "95% within ±2σ → 2.5% in each tail beyond 76.", d: "medium" },
  { q: "Ice-cream sales correlate with drowning deaths. The correct conclusion is", o: ["ice cream causes drowning", "summer causes both — correlation is not causation", "drowning causes ice-cream sales", "the data is wrong"], a: "summer causes both — correlation is not causation", e: "Name the confounder — the essay mark is the reasoning sentence.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "statistics-probability" } });
    if (!topic) throw new Error("master statistics-probability topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("statistics-probability standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Statistics & Probability — Complete", content: { blocks: STATS_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < STATS_QS.length; i++) {
      const item = STATS_QS[i];
      await prisma.question.upsert({
        where: { id: `master-statistics-probability-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-statistics-probability-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "stats-rebuild", blocks: STATS_BLOCKS.length, questions: STATS_QS.length });
  } catch (e) {
    console.error("rebuild stats failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
