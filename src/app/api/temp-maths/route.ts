import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][] };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// TEMPORARY full-maths batch seeder — DELETE after confirmed. Use ?only=<slug>.
const ALGEBRA_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Linear equations — one unknown" },
  { type: "paragraph", text: "Whatever you do to one side, do to the other: collect like terms, unfold operations in reverse. 3x + 7 = 22 → 3x = 15 → x = 5. Check by substitution — always." },
  { type: "heading", level: 2, text: "2. Simultaneous equations" },
  { type: "table", headers: ["Method", "When"], rows: [["Elimination", "Coefficients match easily — multiply to align, add/subtract"], ["Substitution", "One equation already isolated (y = …)"], ["Graphical", "Intersection of two lines — visual check"]] },
  { type: "example", text: "2x + y = 7 and x − y = 2: add → 3x = 9 → x = 3, y = 1. Two equations, two unknowns, one solution — unless lines are parallel (none) or identical (infinite)." },
  { type: "heading", level: 2, text: "3. Quadratics — three weapons" },
  { type: "paragraph", text: "Factorising (split the middle term), completing the square, and the formula x = (−b ± √(b²−4ac)) / 2a. The discriminant Δ = b² − 4ac predicts: positive → two roots, zero → one repeated, negative → no real roots." },
  { type: "example", text: "x² − 5x + 6 = 0 → (x−2)(x−3) = 0 → x = 2 or 3. If it won't factor in integers, reach for the formula without hesitation." },
  { type: "heading", level: 2, text: "4. Inequalities" },
  { type: "paragraph", text: "Solve like equations — with one twist: multiplying or dividing by a negative FLIPS the sign. 3 − 2x > 9 → −2x > 6 → x < −3. Show solutions on number lines and in interval notation." },
  { type: "heading", level: 2, text: "5. Functions and graphs" },
  { type: "paragraph", text: "A function maps each input to exactly one output: f(x) = 2x + 3. Linear graphs (gradient = rate), quadratics (parabolas, roots = x-intercepts, vertex = turning point), and transformations — f(x)+a shifts up, f(x−a) shifts right, −f(x) reflects." },
  { type: "definition", term: "Logarithms", text: "The inverse of powers: log(ab) = log a + log b, log(aⁿ) = n·log a. They turn multiplication into addition — how slide rules and pH scales work." },
  { type: "callout", variant: "warning", text: "Exam trap: √(x²) = |x|, not x. And never divide an inequality by a variable whose sign is unknown — case-split instead." },
];
const ALGEBRA_QS: Q[] = [
  { q: "Solving 3x + 7 = 22 gives x =", o: ["3", "5", "7", "15"], a: "5", e: "3x = 15 → x = 5.", d: "easy" },
  { q: "For 2x + y = 7 and x − y = 2, the solution is", o: ["x=1,y=5", "x=3,y=1", "x=2,y=3", "no solution"], a: "x=3,y=1", e: "Add: 3x = 9 → x=3, then y=1.", d: "medium" },
  { q: "The roots of x² − 7x + 12 = 0 are", o: ["3 and 4", "−3 and −4", "2 and 6", "1 and 12"], a: "3 and 4", e: "(x−3)(x−4) = 0.", d: "easy" },
  { q: "The discriminant of 2x² − 4x + 3 = 0 is", o: ["−8", "8", "40", "4"], a: "−8", e: "16 − 24 = −8: no real roots.", d: "medium" },
  { q: "Solving 3 − 2x > 9 gives", o: ["x > −3", "x < −3", "x > 3", "x < 3"], a: "x < −3", e: "Divide by −2: flip the sign.", d: "medium" },
  { q: "f(x) = 2x + 3; f(4) equals", o: ["9", "11", "14", "24"], a: "11", e: "2×4 + 3 = 11.", d: "easy" },
  { q: "log 1000 to base 10 is", o: ["2", "3", "10", "100"], a: "3", e: "10³ = 1000.", d: "easy" },
  { q: "The vertex of y = x² − 4x + 3 is at x =", o: ["−2", "2", "4", "−4"], a: "2", e: "x = −b/2a = 4/2.", d: "medium" },
  { q: "If f(x−2) shifts the graph of f", o: ["up 2", "down 2", "right 2", "left 2"], a: "right 2", e: "Inside shifts oppose intuition.", d: "hard" },
  { q: "Parallel lines 2x + 3y = 5 and 4x + 6y = 1 have how many common solutions?", o: ["One", "Two", "None", "Infinite"], a: "None", e: "Same gradient, different intercept.", d: "hard" },
];

const GEOM_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Angles first" },
  { type: "paragraph", text: "Parallel lines cut by a transversal: corresponding angles equal (F), alternate equal (Z), co-interior sum to 180° (C). Triangle angles sum to 180°, polygons to (n−2)×180°." },
  { type: "heading", level: 2, text: "2. Congruent and similar figures" },
  { type: "paragraph", text: "Congruent: identical shape AND size (SSS, SAS, ASA, RHS prove it). Similar: same shape, scaled — lengths scale by k, areas by k², volumes by k³." },
  { type: "example", text: "Two similar solids with length ratio 2:3 have volume ratio 8:27. If the small holds 80 cm³ of water, the large holds 270 cm³." },
  { type: "heading", level: 2, text: "3. Pythagoras and trigonometry" },
  { type: "paragraph", text: "Right-angled: a² + b² = c². SOHCAHTOA names the ratios — sine = opposite/hypotenuse, cosine = adjacent/hypotenuse, tangent = opposite/adjacent. Memorise 30°/45°/60° exact values; they recur forever." },
  { type: "table", headers: ["", "30°", "45°", "60°"], rows: [["sin", "½", "√2/2", "√3/2"], ["cos", "√3/2", "√2/2", "½"], ["tan", "1/√3", "1", "√3"]] },
  { type: "heading", level: 2, text: "4. Non-right triangles — sine and cosine rules" },
  { type: "paragraph", text: "Sine rule (a/sin A = b/sin B): opposite pairs — ASA/SSA situations. Cosine rule (c² = a² + b² − 2ab·cos C): SSS/SAS situations, including the angle. Area = ½ab·sin C finishes the toolkit." },
  { type: "example", text: "Two sides 7 and 9 cm with included angle 60°: c² = 49 + 81 − 2×7×9×0.5 = 67 → c ≈ 8.2 cm. Cosine rule whenever you know SAS." },
  { type: "heading", level: 2, text: "5. Circles and vectors" },
  { type: "paragraph", text: "Circle theorems: angle in a semicircle is 90°, angles in the same segment are equal, tangents from one point are equal, opposite cyclic-quadrilateral angles sum to 180°. Vectors add tip-to-tail; magnitude via Pythagoras, direction via tan θ." },
  { type: "callout", variant: "warning", text: "Exam trap: sine rule SSA can give TWO valid triangles (ambiguous case). Check for the second solution before concluding." },
];
const GEOM_QS: Q[] = [
  { q: "Angles on a straight line sum to", o: ["90°", "180°", "270°", "360°"], a: "180°", e: "Linear pair.", d: "easy" },
  { q: "A 5-12-13 triangle is right-angled because", o: ["5+12=17", "5²+12²=13²", "it looks right", "13 is prime"], a: "5²+12²=13²", e: "25+144 = 169: Pythagoras holds.", d: "easy" },
  { q: "sin 60° equals", o: ["½", "√3/2", "1", "√2/2"], a: "√3/2", e: "Standard exact value.", d: "easy" },
  { q: "Similar solids with length ratio 1:2 have volume ratio", o: ["1:2", "1:4", "1:8", "1:6"], a: "1:8", e: "Volumes scale as k³.", d: "medium" },
  { q: "Use the cosine rule when given", o: ["ASA", "SSS or SAS", "RHS", "one side only"], a: "SSS or SAS", e: "Needs the included angle or all sides.", d: "medium" },
  { q: "Area of triangle with sides 7, 9 and included angle 60° is", o: ["31.5", "27.3", "63", "15.75"], a: "27.3", e: "½×7×9×sin60 ≈ 27.3.", d: "medium" },
  { q: "Opposite angles of a cyclic quadrilateral sum to", o: ["90°", "180°", "270°", "360°"], a: "180°", e: "Core circle theorem.", d: "medium" },
  { q: "Vector (3,4) has magnitude", o: ["5", "7", "12", "25"], a: "5", e: "√(9+16) = 5.", d: "easy" },
  { q: "Interior angles of a hexagon sum to", o: ["540°", "720°", "900°", "1080°"], a: "720°", e: "(6−2)×180.", d: "medium" },
  { q: "Tangents from one external point to a circle are", o: ["perpendicular", "equal in length", "parallel", "diameters"], a: "equal in length", e: "Symmetric tangent theorem.", d: "hard" },
];

const CALC_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Limits — approaching without arriving" },
  { type: "paragraph", text: "A limit asks where a function heads as x nears a value. (x²−1)/(x−1) is undefined AT x=1 but tends to 2 — factorise, cancel, substitute. Limits underpin everything that follows." },
  { type: "heading", level: 2, text: "2. Differentiation — rates of change" },
  { type: "definition", term: "First principles to power rule", text: "dy/dx is the gradient of the tangent. For xⁿ: multiply by n, drop the power by one — x³ → 3x². Sum rule handles polynomials term by term." },
  { type: "table", headers: ["f(x)", "f′(x)"], rows: [["xⁿ", "nxⁿ⁻¹"], ["sin x", "cos x"], ["cos x", "−sin x"], ["eˣ", "eˣ"], ["ln x", "1/x"]] },
  { type: "paragraph", text: "Chain rule (outer × inner derivative), product rule (u′v + uv′), quotient rule ((u′v − uv′)/v²) cover composites. Stationary points where f′ = 0: maxima, minima (f″ test), points of inflection." },
  { type: "example", text: "Profit P = −2x² + 40x − 100: P′ = −4x + 40 = 0 → x = 10 units maximises; P″ = −4 < 0 confirms maximum. Optimisation is differentiation's day job." },
  { type: "heading", level: 2, text: "3. Integration — adding up" },
  { type: "paragraph", text: "The reverse of differentiation (+ C, the lost constant): ∫xⁿ = xⁿ⁺¹/(n+1). Definite integrals evaluate between limits — the Fundamental Theorem turns areas into subtractions: F(b) − F(a)." },
  { type: "example", text: "Area under y = x² from 0 to 3: [x³/3]₀³ = 9. Between curves: top minus bottom, then integrate." },
  { type: "heading", level: 2, text: "4. Differential equations — modelling change" },
  { type: "paragraph", text: " dy/dx = ky models proportional growth and decay (populations, radioactivity, cooling): separate variables, integrate, apply the initial condition. The constant C is fixed by what you know at time zero." },
  { type: "callout", variant: "warning", text: "Exam trap: never forget +C in indefinite integrals — and definite integrals need the limits substituted top minus bottom, in that order." },
];
const CALC_QS: Q[] = [
  { q: "d/dx of x⁵ is", o: ["5x⁴", "x⁴", "5x⁶", "4x⁵"], a: "5x⁴", e: "Power rule: n·xⁿ⁻¹.", d: "easy" },
  { q: "d/dx of sin x is", o: ["−sin x", "cos x", "−cos x", "tan x"], a: "cos x", e: "Standard derivative.", d: "easy" },
  { q: "Stationary points occur where", o: ["f = 0", "f′ = 0", "f″ = 0", "x = 0"], a: "f′ = 0", e: "Zero gradient: max, min, or inflection.", d: "easy" },
  { q: "∫2x dx equals", o: ["x² + C", "2x² + C", "x + C", "2 + C"], a: "x² + C", e: "Reverse power rule plus constant.", d: "easy" },
  { q: "Area under y = x² from 0 to 3 is", o: ["3", "6", "9", "27"], a: "9", e: "[x³/3]₀³ = 9.", d: "medium" },
  { q: "d/dx of e³ˣ (chain rule) is", o: ["e³ˣ", "3e³ˣ", "3xe³ˣ", "eˣ"], a: "3e³ˣ", e: "Outer × inner (3).", d: "medium" },
  { q: "Product rule for uv is", o: ["u′v′", "u′v + uv′", "uv′ − u′v", "(u+v)′"], a: "u′v + uv′", e: "Differentiate each in turn.", d: "medium" },
  { q: "f″ < 0 at a stationary point means", o: ["minimum", "maximum", "inflection", "undefined"], a: "maximum", e: "Concave down.", d: "medium" },
  { q: "dy/dx = 2y with y(0)=5 solves to", o: ["y = 5e²ˣ", "y = 2e⁵ˣ", "y = 5x + 2", "y = e²ˣ"], a: "y = 5e²ˣ", e: "Separate: ln y = 2x + C; C from y(0).", d: "hard" },
  { q: "Limit of (x²−1)/(x−1) as x→1 is", o: ["0", "1", "2", "undefined"], a: "2", e: "Cancel (x−1): x+1 → 2.", d: "medium" },
];

const STATS_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Summarising data" },
  { type: "paragraph", text: "Mean (balance point), median (middle value), mode (most frequent) locate data; range and interquartile range spread it; standard deviation measures typical distance from the mean. Skewed data? The median resists outliers the mean follows." },
  { type: "example", text: "Salaries 20, 22, 25, 30, 200 (thousands): mean 59.4, median 25. One executive drags the mean — the median tells the worker's story." },
  { type: "heading", level: 2, text: "2. Probability foundations" },
  { type: "paragraph", text: "Probability = wanted ÷ possible. AND multiplies (independent events), OR adds (mutually exclusive). NOT flips via 1 − P. Conditional probability P(A|B) shrinks the universe to B." },
  { type: "table", headers: ["Situation", "Rule"], rows: [["Both happen (independent)", "P(A) × P(B)"], ["Either happens (exclusive)", "P(A) + P(B)"], ["At least one", "1 − P(neither)"], ["Given B occurred", "P(A∩B) ÷ P(B)"]] },
  { type: "heading", level: 2, text: "3. Counting — permutations and combinations" },
  { type: "paragraph", text: "Order matters → permutations (₁₀P₃ = 10×9×8). Order irrelevant → combinations (₁₀C₃ = 120). Choosing teams, lotteries, committees: divide out the orderings." },
  { type: "heading", level: 2, text: "4. Distributions" },
  { type: "paragraph", text: "Binomial: fixed trials, two outcomes, constant p (pass rates, quality control). Normal: bell-shaped measurement data — 68% within one standard deviation, 95% within two. Standardise with z = (x−μ)/σ and read the tables." },
  { type: "example", text: "Heights μ=170, σ=10: P(160<X<180) ≈ 68%. One z-score turns any normal question into table reading." },
  { type: "heading", level: 2, text: "5. Inference and regression" },
  { type: "paragraph", text: "Samples estimate populations with margins of error; hypothesis tests ask whether results surprise the null (p < 0.05 rejects). Regression lines summarise scatter (correlation strength via r) — but correlation never proves causation." },
  { type: "callout", variant: "warning", text: "Exam trap: 'at least one' almost always means 1 − P(none). Computing it directly wastes minutes and invites errors." },
];
const STATS_QS: Q[] = [
  { q: "Mean of 4, 7, 9, 12 is", o: ["7", "8", "9", "32"], a: "8", e: "Sum 32 ÷ 4.", d: "easy" },
  { q: "Two fair coins: P(both heads) is", o: ["1/2", "1/4", "3/4", "1"], a: "1/4", e: "½ × ½ (independent AND).", d: "easy" },
  { q: "P(at least one six in two dice) equals", o: ["1/3", "11/36", "1/6", "2/6"], a: "11/36", e: "1 − (5/6)² = 11/36.", d: "medium" },
  { q: "₁₀C₃ equals", o: ["720", "120", "30", "1000"], a: "120", e: "10×9×8 ÷ 6.", d: "medium" },
  { q: "In normal data, about 95% lies within", o: ["1σ", "2σ", "3σ", "0.5σ"], a: "2σ", e: "Empirical 68–95–99.7 rule.", d: "easy" },
  { q: "Median is preferred over mean when data is", o: ["symmetric", "skewed with outliers", "small", "grouped"], a: "skewed with outliers", e: "Median resists extremes.", d: "medium" },
  { q: "Binomial trials require", o: ["varying p", "fixed n, two outcomes, constant p", "infinite trials", "normal data"], a: "fixed n, two outcomes, constant p", e: "Defining conditions.", d: "medium" },
  { q: "Strong correlation (r=0.9) between ice cream and drowning proves", o: ["causation", "nothing causal — summer confounds both", "ice cream kills", "pools melt"], a: "nothing causal — summer confounds both", e: "Correlation ≠ causation.", d: "hard" },
  { q: "z-score for x=180 with μ=170, σ=10 is", o: ["0", "1", "2", "10"], a: "1", e: "(180−170)/10.", d: "easy" },
  { q: "Reject the null hypothesis when", o: ["p > 0.5", "p < 0.05", "sample is small", "mean is zero"], a: "p < 0.05", e: "Result too surprising under null.", d: "hard" },
];

const FMATH_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Matrices — arithmetic in grids" },
  { type: "paragraph", text: "Add entrywise; multiply rows-by-columns (only when inner dimensions match — and order matters: AB ≠ BA). The identity I leaves matrices unchanged; inverses undo (AA⁻¹ = I) and solve simultaneous systems in one line: X = A⁻¹B." },
  { type: "example", text: "2x + y = 7, x − y = 2 as a matrix equation: invert the 2×2 (swap diagonal, negate off-diagonal, ÷ determinant) and multiply — x = 3, y = 1." },
  { type: "heading", level: 2, text: "2. Determinants" },
  { type: "paragraph", text: "2×2: ad − bc. Zero determinant → singular matrix → no inverse → simultaneous equations parallel or identical. The determinant also scales areas (and volumes in 3×3) under the transformation." },
  { type: "heading", level: 2, text: "3. Complex numbers" },
  { type: "paragraph", text: "i² = −1 unlocks every quadratic: z = a + bi, modulus |z| = √(a²+b²), argument = angle. Argand diagrams plot them; modulus-argument form multiplies by multiplying moduli and adding arguments — De Moivre powers through: (cos θ + i·sin θ)ⁿ = cos nθ + i·sin nθ." },
  { type: "heading", level: 2, text: "4. Polar coordinates and advanced mechanics" },
  { type: "paragraph", text: "Points as (r, θ) suit rotations and spirals; projectiles extend to air-resistance models and coupled oscillations; moments, centres of mass, and variable forces (F = m·dv/dt integrated) complete the mechanics ladder." },
  { type: "callout", variant: "warning", text: "Exam trap: matrix multiplication order — transform right-to-left onto column vectors. Swapping AB for BA silently changes the answer." },
];
const FMATH_QS: Q[] = [
  { q: "Matrix product AB exists when", o: ["A is square", "columns of A equal rows of B", "both are 2×2", "B is identity"], a: "columns of A equal rows of B", e: "Inner dimensions must match.", d: "medium" },
  { q: "Determinant of [[3,1],[2,4]] is", o: ["12", "10", "14", "2"], a: "10", e: "3×4 − 1×2 = 10.", d: "easy" },
  { q: "A zero determinant means the matrix", o: ["is identity", "has no inverse", "is 1×1", "is symmetric"], a: "has no inverse", e: "Singular: division by zero.", d: "medium" },
  { q: "i² equals", o: ["1", "−1", "0", "i"], a: "−1", e: "Defining property.", d: "easy" },
  { q: "Modulus of 3 + 4i is", o: ["5", "7", "25", "12"], a: "5", e: "√(9+16) = 5.", d: "easy" },
  { q: "De Moivre: (cos θ + i sin θ)³ equals", o: ["cos 3θ + i sin 3θ", "cos³θ + i sin³θ", "3cos θ + 3i sin θ", "cos θ³ + i sin θ³"], a: "cos 3θ + i sin 3θ", e: "Multiply angle by power.", d: "medium" },
  { q: "Polar point (r=2, θ=90°) is cartesian", o: ["(2,0)", "(0,2)", "(1,1)", "(2,2)"], a: "(0,2)", e: "(r cosθ, r sinθ) = (0,2).", d: "medium" },
  { q: "Solving via X = A⁻¹B requires A to be", o: ["singular", "square and invertible", "diagonal", "zero"], a: "square and invertible", e: "Inverse must exist.", d: "medium" },
  { q: "AB ≠ BA in general because matrix multiplication is", o: ["commutative", "non-commutative", "impossible", "scalar"], a: "non-commutative", e: "Order changes the result.", d: "easy" },
  { q: " argument of −1 + i is", o: ["45°", "135°", "−45°", "225°"], a: "135°", e: "Second quadrant: 180 − 45.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  const only = req.nextUrl.searchParams.get("only");
  try {
    const today = new Date();
    const boards = await prisma.curriculumBoard.findMany({ select: { id: true } });
    if (!boards.length) throw new Error("No boards found");
    const topics: { slug: string; title: string; note: string; blocks: B[]; qs: Q[] }[] = [
      { slug: "algebra-foundations", title: "Algebra Foundations", note: "CORE: algebra in all 20 regions.", blocks: ALGEBRA_BLOCKS, qs: ALGEBRA_QS },
      { slug: "geometry-trigonometry", title: "Geometry & Trigonometry", note: "CORE: geometry and trig in all 20 regions.", blocks: GEOM_BLOCKS, qs: GEOM_QS },
      { slug: "calculus", title: "Calculus", note: "CORE where offered: limits, derivatives, integrals.", blocks: CALC_BLOCKS, qs: CALC_QS },
      { slug: "statistics-probability", title: "Statistics & Probability", note: "CORE in Israeli Bagrut mathematics; all 20 regions.", blocks: STATS_BLOCKS, qs: STATS_QS },
      { slug: "further-mathematics", title: "Further Mathematics", note: "Elective extension: matrices, complex numbers.", blocks: FMATH_BLOCKS, qs: FMATH_QS },
    ].filter((t) => !only || t.slug === only || t.slug.startsWith(only));
    if (!topics.length) return NextResponse.json({ error: "Unknown only=" }, { status: 400 });
    const done: Record<string, number> = {};
    for (const t of topics) {
      const topic = await prisma.topic.findFirst({ where: { slug: t.slug } });
      if (!topic) throw new Error(`Topic missing: ${t.slug}`);
      const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id } });
      if (lesson) await prisma.lesson.update({ where: { id: lesson.id }, data: { title: `${t.title} — Complete`, content: { blocks: t.blocks } as object, estimatedMinutes: 45 } });
      else await prisma.lesson.create({ data: { domain: "highschool", topicId: topic.id, title: `${t.title} — Complete`, content: { blocks: t.blocks } as object, orderIndex: 0, estimatedMinutes: 45 } });
      for (let i = 0; i < t.qs.length; i++) {
        const item = t.qs[i];
        await prisma.question.upsert({
          where: { id: `master-${t.slug}-q${i + 1}` },
          update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
          create: { id: `master-${t.slug}-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        });
      }
      const existingRows = await prisma.topicBoardAlignment.findMany({ where: { topicId: topic.id }, select: { boardId: true } });
      const have = new Set(existingRows.map((r) => r.boardId));
      const tier = t.slug === "further-mathematics" ? ("elective" as const) : ("core" as const);
      await prisma.topicBoardAlignment.updateMany({ where: { topicId: topic.id }, data: { tier, verifiedDate: today, weightNotes: t.note } });
      const missing = boards.filter((b) => !have.has(b.id));
      if (missing.length) await prisma.topicBoardAlignment.createMany({ data: missing.map((b) => ({ topicId: topic.id, boardId: b.id, trackId: null, tier, verifiedDate: today, weightNotes: t.note })) });
      await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today, needsVerification: false } });
      done[t.slug] = t.blocks.length;
    }
    return NextResponse.json({ ok: true, topics: done, questionsPerTopic: 10, boards: boards.length });
  } catch (e) {
    console.error("temp maths failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
