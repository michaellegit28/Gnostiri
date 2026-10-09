import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Maths Topic 1: Algebra Foundations at the no-exceptions bar:
// linear equations, inequalities, simultaneous equations, quadratics, functions, sequences, logarithms.

const ALG_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Linear equations — keep the balance" },
  { type: "definition", term: "The balance rule", text: "An equation is a balanced scale: whatever you do to one side you do to the OTHER. Solve by undoing in reverse order — the +5 first, then the ×3. Always check by substitution: put your answer back into the ORIGINAL equation and confirm it balances." },
  { type: "example", text: "Worked: 3x + 5 = 20 → subtract 5: 3x = 15 → divide by 3: x = 5. Check: 3(5) + 5 = 20 ✓. With x on both sides: 5x − 2 = 2x + 10 → collect: 3x = 12 → x = 4. Show every line — method marks live in the working, not the answer." },
  { type: "heading", level: 2, text: "2. Inequalities — the one rule exams test" },
  { type: "definition", term: "The flip rule", text: "Solve inequalities exactly like equations EXCEPT: multiplying or dividing by a NEGATIVE number flips the sign (> becomes <). The flip is the single most-tested algebra fact in inequality questions — forget it and every subsequent mark is gone." },
  { type: "example", text: "Worked: −2x + 3 > 7 → −2x > 4 → x < −2 (the sign FLIPPED). Check: x = −3 satisfies −2(−3)+3 = 9 > 7 ✓. On the number line: < and > get open circles, ≤ and ≥ get closed — and ≤ −2 shades LEFT. Test one value from your region to verify." },
  { type: "heading", level: 2, text: "3. Simultaneous equations — eliminate or substitute" },
  { type: "paragraph", text: "Two equations, two unknowns: ELIMINATE by making one variable's coefficients match, then add or subtract the equations. SUBSTITUTE when one equation is already solved for a variable. Always check the answer in BOTH original equations — one satisfied and one not means an arithmetic slip." },
  { type: "example", text: "Worked: 2x + y = 7 and x − y = 2 → ADD (y cancels): 3x = 9 → x = 3, then y = 2 − 3 = −1. Check: 2(3) + (−1) = 5... wait — 2(3) + (−1) = 5 ≠ 7. Recompute: from x − y = 2 → y = x − 2 = 1. Check: 2(3) + 1 = 7 ✓ and 3 − 1 = 2 ✓. The check CAUGHT the slip — that is exactly why the check is worth marks." },
  { type: "heading", level: 2, text: "4. Quadratics — factorising" },
  { type: "definition", term: "Zero-product", text: "If (x − 2)(x − 3) = 0 then x = 2 or x = 3 — a product is zero only when a FACTOR is zero. So rearrange to = 0 FIRST (the trap: x² − 5x = −6 must become x² − 5x + 6 = 0 before factorising), factorise into two brackets, and each bracket gives a root." },
  { type: "example", text: "Worked: x² − 5x + 6 = 0 → two numbers multiplying to +6 and adding to −5: −2 and −3 → (x − 2)(x − 3) = 0 → x = 2 or x = 3. Verify with the sum-product identity: roots sum to −b/a = 5 ✓, product c/a = 6 ✓." },
  { type: "heading", level: 2, text: "5. Quadratics — completing the square and the formula" },
  { type: "definition", term: "Completing the square", text: "x² + bx → (x + b/2)² − (b/2)²: halve the middle coefficient, square it, subtract it. The form (x + p)² + q hands you the vertex directly at (−p, −q) — no sketching from scratch." },
  { type: "example", text: "Worked: x² + 4x + 1 = 0 → (x + 2)² − 4 + 1 = (x + 2)² − 3 = 0 → x = −2 ± √3 ≈ 0.73 or −3.73. Formula check: x = (−4 ± √(16 − 4))/2 = (−4 ± √12)/2 = −2 ± √3 ✓ — same answer, two routes; the exam accepts either when the working is shown." },
  { type: "definition", term: "The discriminant", text: "b² − 4ac decides the roots before you solve: positive → two distinct real roots; zero → one repeated root; negative → no real roots. Computing it FIRST is the smart move — it tells you whether factorising is even possible." },
  { type: "heading", level: 2, text: "6. The parabola — sketch from three facts" },
  { type: "paragraph", text: "y = ax² + bx + c: a > 0 opens UP (a smile), a < 0 opens DOWN (a frown). Three facts sketch it completely: the y-intercept (0, c), the roots (from factorising or the formula), and the vertex at x = −b/2a (substitute back for y). The axis of symmetry runs through the vertex — the parabola mirrors across it." },
  { type: "diagram", diagramId: "quadratic-parabola", caption: "Roots, vertex, and the axis of symmetry — the three-fact sketch" },
  { type: "example", text: "Worked: y = x² − 4x + 3 → a = 1 (up), y-int 3, roots 1 and 3 (factorised above), vertex x = −(−4)/2 = 2, y = 4 − 8 + 3 = −1 → (2, −1). Five seconds of algebra, a complete sketch — and the minimum-value question is already answered: minimum y = −1." },
  { type: "heading", level: 2, text: "7. Functions — notation, composites, inverses" },
  { type: "definition", term: "Function notation", text: "f(x) means 'the function of x' — NOT f times x. Domain = allowed inputs, range = resulting outputs. Composite f(g(x)) applies g FIRST (inside-out). The inverse f⁻¹ swaps x and y and undoes f — its graph is f reflected in the line y = x." },
  { type: "example", text: "Worked: f(x) = 2x + 3, g(x) = x² → f(g(2)) = f(4) = 11, but g(f(2)) = g(7) = 49. Order matters — f∘g ≠ g∘f (the composite trap). Inverse: f⁻¹(x) = (x − 3)/2 — check: f⁻¹(f(2)) = f⁻¹(7) = 2 ✓, back where we started." },
  { type: "heading", level: 2, text: "8. Sequences — arithmetic and geometric" },
  { type: "table", headers: ["Type", "Pattern", "nth term", "Worked"], rows: [["Arithmetic", "ADD the same d each time", "Tn = a + (n − 1)d", "3, 7, 11: d = 4 → Tn = 4n − 1 → T20 = 39"], ["Geometric", "MULTIPLY by the same r", "Tn = ar^(n−1)", "2, 6, 18: r = 3 → Tn = 2·3^(n−1) → T5 = 162"]] },
  { type: "paragraph", text: "Identify the OPERATION first: differences constant → arithmetic; ratios constant → geometric. Find the nth term from ANY two terms: build two equations in a and d (or a and r) and solve them simultaneously — chapter 3, recycled." },
  { type: "heading", level: 2, text: "9. Logarithms — the inverse of powers" },
  { type: "definition", term: "Log laws", text: "log_a b = c means a^c = b — a logarithm ASKS the question: 'what power of a gives b?'. The three laws: log(xy) = log x + log y; log(x/y) = log x − log y; log(x^n) = n·log x. Log 1 = 0 and log_a a = 1 for every base." },
  { type: "example", text: "Worked: log₂ 8 = 3 because 2³ = 8. Solve 2^x = 10: take log of both sides → x = log 10 ÷ log 2 ≈ 3.32 (any base, as long as both match — the calculator's log button works). Logs turn multiplication into addition and powers into coefficients — that is their entire superpower." },
  { type: "heading", level: 2, text: "10. Exponential growth and decay" },
  { type: "paragraph", text: "y = a·k^x compounds: k > 1 grows (interest, population), 0 < k < 1 decays (depreciation, half-life — physics chapter 5, recycled). Compound interest is pure exponential: amount = P(1 + r/100)^n." },
  { type: "example", text: "Worked: 500 at 8% compound for 3 years → 500 × (1.08)³ = 629.86. Doubling: a population doubling every 20 years grows as 2^(t/20) — in 60 years, 2³ = 8 times bigger. Reverse with logs: to find WHEN the population triples, solve 2^(t/20) = 3 → t = 20 × log 3 ÷ log 2 ≈ 31.7 years." },
  { type: "heading", level: 2, text: "11. Algebraic fractions — factorise, then cancel FACTORS" },
  { type: "paragraph", text: "Simplify by factorising top and bottom completely, then cancelling common FACTORS. You may never cancel a TERM that is part of a sum: (x² − 9)/(x² + 7x + 12) simplifies, but x + 3 over x + 7 cannot — the brackets are the boundary between legal and illegal cancellation." },
  { type: "example", text: "Worked: (x² − 9)/(x² + 7x + 12) = (x − 3)(x + 3)/((x + 3)(x + 4)) = (x − 3)/(x + 4). The (x + 3) cancelled because it was a whole FACTOR in both. To solve equations with fractions, multiply EVERY term by the common denominator — every term, including the constant." },
  { type: "heading", level: 2, text: "12. Summary — the algebra spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Linear", "Undo in reverse order; check", "Sign slips when collecting"], ["Inequalities", "Flip when dividing by a negative", "The flip — always"], ["Simultaneous", "Eliminate or substitute; check BOTH", "Adding when you should subtract"], ["Quadratics", "= 0 first, then factorise", "Forgetting the rearrange"], ["Discriminant", "b² − 4ac decides the roots", "Negative → no real roots"], ["Sketches", "y-int, roots, vertex", "Vertex x = −b/2a (sign!)"], ["Composites", "Inside-out; f∘g ≠ g∘f", "Order of composition"], ["Logs", "Laws turn × into +, powers into ×", "log(xy) ≠ log x · log y"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'solve' = every line shown, finish with the check; 'simplify' = factorise completely, cancel factors only; 'sketch' = the three facts labelled; 'show that' = start from the given, arrive at the target — never work backwards silently. Algebra papers pay the working: the answer alone buys almost nothing." },
];

const ALG_QS: Q[] = [
  { q: "Solve 3x + 5 = 20", o: ["x = 5", "x = 8.33", "x = 15", "x = −5"], a: "x = 5", e: "Subtract 5, divide by 3. Check: 3(5)+5 = 20 ✓.", d: "easy" },
  { q: "Solve −2x > 8", o: ["x > −4", "x < −4", "x > 4", "x < 4"], a: "x < −4", e: "Divide by −2 — the sign FLIPS. The most-tested rule in inequalities.", d: "easy" },
  { q: "2x + y = 7 and x − y = 2. The solution is", o: ["x = 3, y = 1", "x = 1, y = 3", "x = 3, y = −1", "x = 5, y = −3"], a: "x = 3, y = 1", e: "Add: 3x = 9 → x = 3, y = 1. Check both equations ✓.", d: "easy" },
  { q: "The roots of x² − 5x + 6 = 0 are", o: ["1 and 6", "−2 and −3", "2 and 3", "5 and 6"], a: "2 and 3", e: "Factors of +6 summing to −5: −2, −3 → (x−2)(x−3) = 0.", d: "easy" },
  { q: "The discriminant of 2x² + 3x + 5 = 0 is", o: ["49 — two roots", "−31 — no real roots", "9 — one root", "0 — repeated root"], a: "−31 — no real roots", e: "b² − 4ac = 9 − 40 = −31 < 0: no real roots.", d: "medium" },
  { q: "The vertex of y = x² − 6x + 5 is at", o: ["x = 3", "x = −3", "x = 6", "x = 5"], a: "x = 3", e: "x = −b/2a = 6/2 = 3 (y = −4 there). Sign trap: −(−6).", d: "medium" },
  { q: "f(x) = 2x + 3, g(x) = x². f(g(2)) equals", o: ["11", "49", "7", "10"], a: "11", e: "g(2) = 4 first (inside-out), then f(4) = 11.", d: "medium" },
  { q: "The nth term of 5, 8, 11, 14, ... is", o: ["3n + 2", "3n − 2", "5n", "n + 4"], a: "3n + 2", e: "d = 3, a = 5: Tn = 3n + 2. Check n = 1: 5 ✓.", d: "easy" },
  { q: "log₂ 32 equals", o: ["5", "16", "6", "2.5"], a: "5", e: "2⁵ = 32. A logarithm asks: what power of 2 gives 32?", d: "easy" },
  { q: "500 grows at 8% compound interest. After 3 years it is closest to", o: ["629.86", "620.00", "540.00", "515.00"], a: "629.86", e: "500 × 1.08³ — compound multiplies, it never adds.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "algebra-foundations" } });
    if (!topic) throw new Error("master algebra-foundations topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("algebra-foundations standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Algebra Foundations — Complete", content: { blocks: ALG_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < ALG_QS.length; i++) {
      const item = ALG_QS[i];
      await prisma.question.upsert({
        where: { id: `master-algebra-foundations-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-algebra-foundations-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "algebra-rebuild", blocks: ALG_BLOCKS.length, questions: ALG_QS.length });
  } catch (e) {
    console.error("rebuild algebra failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
