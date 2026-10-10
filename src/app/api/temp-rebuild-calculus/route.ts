import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Maths Topic 3: Calculus at the no-exceptions bar:
// limits, derivatives, tangents/normals, stationary points, optimization, chain/product/quotient rules, integration, areas, kinematics.

const CALC_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Limits — the derivative's foundation" },
  { type: "paragraph", text: "A limit asks what value a function APPROACHES as x gets close to a point — not necessarily what it equals there. The derivative is born from a limit: take the gradient of a chord between two points, then slide the points together (h → 0) — the chord becomes the tangent and the limit becomes the derivative. Some limits do not exist: 1/x blows up as x → 0 — saying so earns the mark." },
  { type: "example", text: "Worked: gradient of y = x² at x = 2: chord to (2 + h, (2+h)²): ((2+h)² − 4)/h = (4h + h²)/h = 4 + h. As h → 0 the gradient → 4. The h in the denominator is why we MUST take the limit — and why the algebra always factors the h away first." },
  { type: "heading", level: 2, text: "2. The derivative — rate of change" },
  { type: "definition", term: "Power rule", text: "dy/dx is the gradient of the curve at x — the instantaneous rate of change. Differentiate term by term: d/dx(x^n) = nx^(n−1) — MULTIPLY by the power, then REDUCE it by one. Constants differentiate to zero (their gradient is 0 — flat lines)." },
  { type: "example", text: "Worked: y = 3x⁴ − 2x² + 5 → dy/dx = 12x³ − 4x (the 5 vanishes). At x = 1 the gradient is 12 − 4 = 8; at x = 0 it is 0 — flat there. Reverse: the gradient 12x³ − 4x is itself a function — differentiating AGAIN gives the second derivative, section 8." },
  { type: "heading", level: 2, text: "3. Tangents and normals — two lines, one point" },
  { type: "paragraph", text: "The TANGENT at x = a has gradient f′(a) — it touches the curve. The NORMAL is perpendicular to the tangent, so its gradient is −1/f′(a) (flip and invert — geometry chapter 2, recycled). Both are straight-line equations: find the point y = f(a), find the gradient, then y − y₁ = m(x − x₁)." },
  { type: "example", text: "Worked: y = x² at x = 3 → point (3, 9), gradient 6 → tangent: y = 6x − 9. Normal: gradient −1/6 → y − 9 = −(x − 3)/6. The normal question is a tangent question with one extra flip — and the flip is the mark." },
  { type: "heading", level: 2, text: "4. Stationary points — find, then classify" },
  { type: "definition", term: "Stationary points", text: "Where dy/dx = 0 the tangent is horizontal: the curve is momentarily flat. Classify with the SECOND derivative: f″ > 0 → MINIMUM (concave up), f″ < 0 → MAXIMUM (concave down), f″ = 0 → inconclusive (test the gradient either side instead)." },
  { type: "example", text: "Worked: y = x³ − 3x → dy/dx = 3x² − 3 = 0 → x = ±1. Second derivative: 6x. At x = 1: +6 > 0 → minimum (y = −2). At x = −1: −6 < 0 → maximum (y = 2). Two stationary points, two classifications — the exam wants both, with the second-derivative test shown." },
  { type: "heading", level: 2, text: "5. Optimization — the exam's favourite application" },
  { type: "paragraph", text: "The recipe is always the same four beats: 1) translate the words into ONE variable (use the constraint to eliminate the other); 2) differentiate; 3) set dy/dx = 0 and solve; 4) classify (second derivative) AND answer the actual question asked — with units. Skipping the classification or answering the wrong quantity are the two ways candidates lose the final mark." },
  { type: "example", text: "Worked: 40 m of fence against a wall (no fence needed there): width x, length 40 − 2x → area A = x(40 − 2x) = 40x − 2x². dA/dx = 40 − 4x = 0 → x = 10. d²A/dx² = −4 < 0 → maximum ✓. Answer the QUESTION: dimensions 10 × 20, maximum area 200 m² — the area, not the width, is what was asked." },
  { type: "heading", level: 2, text: "6. The chain rule — outside × inside" },
  { type: "definition", term: "Chain rule", text: "For a function of a function: dy/dx = dy/du × du/dx — differentiate the outside (leaving the inside alone), then MULTIPLY by the derivative of the inside. In practice: d/dx[(ax + b)^n] = n(ax + b)^(n−1) × a. The ×a is the most-forgotten factor in the entire course." },
  { type: "example", text: "Worked: y = (2x + 1)⁵ → dy/dx = 5(2x + 1)⁴ × 2 = 10(2x + 1)⁴. Check against the expansion... or trust the rule. y = sin(3x) → 3cos(3x). Forgetting the ×2 (or ×3) turns a correct answer into a near-miss — examiners see it constantly." },
  { type: "heading", level: 2, text: "7. Product and quotient rules" },
  { type: "definition", term: "Product rule", text: "For y = uv: dy/dx = u′v + uv′ — first times the derivative of the second, plus second times the derivative of the first. For y = u/v: dy/dx = (u′v − uv′)/v² — the quotient rule, order matters in the numerator (the minus sign punishes a swap)." },
  { type: "example", text: "Worked: y = x² sin x → dy/dx = 2x sin x + x² cos x. Worked: y = x/(x + 1) → (1·(x+1) − x·1)/(x + 1)² = 1/(x + 1)². Spot the structure FIRST: a product → product rule; a quotient → quotient rule; a function of a function → chain rule. Choosing the rule IS the first mark." },
  { type: "heading", level: 2, text: "8. The second derivative — concavity and motion" },
  { type: "paragraph", text: "f″(x) is the rate of change of the gradient: f″ > 0 means the gradient is INCREASING (concave up — a smile), f″ < 0 decreasing (concave down — a frown). The kinematics bridge: displacement s, velocity v = ds/dt, ACCELERATION a = dv/dt = d²s/dt² — the second derivative is acceleration. One idea, two subjects, same marks." },
  { type: "example", text: "Worked: s = t³ − 6t² → v = 3t² − 12t, a = 6t − 12. At rest: v = 0 → t = 0 or 4. Acceleration at t = 4: a = 12 m/s². The chain differentiate-then-substitute is the whole method — units carried (m, m/s, m/s²) are the sanity check." },
  { type: "heading", level: 2, text: "9. Integration — differentiation in reverse" },
  { type: "definition", term: "The reverse power rule", text: "∫x^n dx = x^(n+1)/(n+1) + c — RAISE the power by one, divide by the new power. The +c is NOT optional: differentiation destroys constants, so integration must restore an unknown one. Check every integral by differentiating your answer back — the two operations undo each other." },
  { type: "example", text: "Worked: ∫(3x² + 2x) dx = x³ + x² + c. Definite integral: ∫₁³(3x² + 2x) dx = [x³ + x²]₁³ = (27 + 9) − (1 + 1) = 34 — the c drops out when you subtract. ∫1/x dx = ln|x| + c; ∫e^x dx = e^x + c — the two special cases worth memorising." },
  { type: "heading", level: 2, text: "10. Areas under curves — signed areas" },
  { type: "diagram", diagramId: "tangent-gradient", caption: "Tangent gradient = dy/dx · normal is perpendicular" },
  { type: "paragraph", text: "The definite integral measures SIGNED area: regions BELOW the x-axis count negative. Area questions: split the interval at the roots and integrate each piece separately, then make everything positive. Area BETWEEN two curves: ∫(top − bottom) dx — one integral, no subtraction of separate areas needed." },
  { type: "example", text: "Worked: area under y = x² from 0 to 3: [x³/3]₀³ = 9. Worked — the trap: y = sin x from 0 to 2π integrates to 0 (positive half cancels negative half) — but the AREA is 4 (2 + 2). 'Evaluate the integral' and 'find the area' are different questions — read which one is asked." },
  { type: "heading", level: 2, text: "11. Integration in kinematics — the bridge both ways" },
  { type: "paragraph", text: "Differentiation runs displacement → velocity → acceleration; integration runs back: v = ∫a dt, s = ∫v dt. Each integration introduces a +c — fixed by a boundary condition (initial position, initial velocity). The full kinematics chapter of physics is this one rule wearing different letters." },
  { type: "example", text: "Worked: v = 6t − 4 with s = 0 at t = 0 → s = 3t² − 4t + c, c = 0. Displacement after 2 s: 12 − 8 = 4 m. The exam may ask for DISTANCE travelled, not displacement: if v changes sign mid-journey, integrate |v| piecewise — split where v = 0." },
  { type: "heading", level: 2, text: "12. Differential equations — the exponential shortcut" },
  { type: "definition", term: "dy/dx = ky", text: "The rate of change proportional to the amount: the equation of growth and decay. Its solution is y = Ae^(kx) — exponentials are their own derivatives (up to a constant). Separate variables when it is more general: collect the y terms with dy, the x terms with dx, integrate both sides." },
  { type: "example", text: "Worked: dy/dx = 2y → y = Ae^(2x); boundary y(0) = 5 fixes A = 5 → y = 5e^(2x). Worked: dy/dx = x/y → y dy = x dx → y²/2 = x²/2 + c → y² = x² + C. Population growth, radioactive decay, Newton's cooling — one equation family, infinite applications." },
  { type: "heading", level: 2, text: "13. Summary — the calculus spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Derivatives", "Power rule term by term", "Constants vanish; coefficient × power"], ["Tangent/normal", "f′(a) then flip for the normal", "The flip is the mark"], ["Stationary", "f′ = 0, then f″ classifies", "f″ = 0 needs the sign test"], ["Optimization", "Constraint → one variable → f′ = 0", "Answer the question asked, with units"], ["Chain rule", "Outside × derivative of inside", "The forgotten ×a"], ["Integration", "Raise the power, divide; + c always", "The +c — never omit"], ["Areas", "Signed! Split at roots", "Integral ≠ area when the curve dips"], ["Kinematics", "Differentiate down, integrate up", "Distance vs displacement"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'differentiate' = the rule named, every term shown; 'find the equation of' = point + gradient + line form; 'show that' = full working to the target; 'hence' = use the previous result — starting over forfeits the method marks. Calculus papers are chains: every link shown, every link marked." },
];

const CALC_QS: Q[] = [
  { q: "y = 3x⁴ − 2x² + 5. dy/dx is", o: ["12x³ − 4x", "12x³ − 4x + 5", "3x³ − 2x", "7x³ − 2x"], a: "12x³ − 4x", e: "Multiply by the power, reduce it by one; the constant 5 differentiates to 0.", d: "easy" },
  { q: "The gradient of y = x² at x = 3 is", o: ["6", "9", "3", "2"], a: "6", e: "dy/dx = 2x → 2(3) = 6. The gradient is a function of x.", d: "easy" },
  { q: "The normal to y = x² at x = 3 has gradient", o: ["6", "−1/6", "1/6", "−6"], a: "−1/6", e: "Perpendicular: flip and invert 6 → −1/6.", d: "medium" },
  { q: "y = x³ − 3x has a minimum at", o: ["x = 1 — f″ = 6 > 0", "x = −1 — f″ = −6 < 0", "x = 0", "nowhere — it is always decreasing"], a: "x = 1 — f″ = 6 > 0", e: "dy/dx = 3x² − 3 = 0 → x = ±1; the second derivative classifies them.", d: "medium" },
  { q: "d/dx[(2x + 1)⁵] equals", o: ["5(2x + 1)⁴", "10(2x + 1)⁴", "5(2x + 1)⁵", "2(2x + 1)⁴"], a: "10(2x + 1)⁴", e: "Chain rule: 5(·)⁴ × 2 — the ×2 is the forgotten factor.", d: "medium" },
  { q: "d/dx[x² sin x] equals", o: ["2x cos x", "2x sin x + x² cos x", "x² cos x", "2x sin x − x² cos x"], a: "2x sin x + x² cos x", e: "Product rule: u′v + uv′ — both terms, plus sign.", d: "medium" },
  { q: "∫(3x² + 2x) dx is", o: ["x³ + x² + c", "6x + 2 + c", "x³ + x²", "3x³ + x² + c"], a: "x³ + x² + c", e: "Reverse power rule — raise, divide, and NEVER drop the +c.", d: "easy" },
  { q: "The area under y = x² from x = 0 to x = 3 is", o: ["9", "27", "3", "6"], a: "9", e: "[x³/3]₀³ = 27/3 = 9.", d: "easy" },
  { q: "s = t³ − 6t². The acceleration when t = 4 is", o: ["12 m/s²", "24 m/s²", "6 m/s²", "0 m/s²"], a: "12 m/s²", e: "a = d²s/dt² = 6t − 12 → 24 − 12 = 12. Second derivative = acceleration.", d: "medium" },
  { q: "40 m of fence encloses a rectangular plot against a wall. The maximum area is", o: ["200 m² with 10 × 20", "100 m² with 10 × 10", "400 m² with 20 × 20", "160 m² with 8 × 20"], a: "200 m² with 10 × 20", e: "A = x(40 − 2x), dA/dx = 40 − 4x = 0 → x = 10; d²A/dx² = −4 < 0 max.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "calculus" } });
    if (!topic) throw new Error("master calculus topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("calculus standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Calculus — Complete", content: { blocks: CALC_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < CALC_QS.length; i++) {
      const item = CALC_QS[i];
      await prisma.question.upsert({
        where: { id: `master-calculus-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-calculus-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "calculus-rebuild", blocks: CALC_BLOCKS.length, questions: CALC_QS.length });
  } catch (e) {
    console.error("rebuild calculus failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
