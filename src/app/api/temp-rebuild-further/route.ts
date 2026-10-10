import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Maths Topic 5: Further Mathematics at the no-exceptions bar:
// matrices, determinants/inverses, systems, complex numbers, Argand diagram, polar coordinates, advanced mechanics.

const FURTHER_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Matrices — grids that transform" },
  { type: "definition", term: "Dimensions and operations", text: "A matrix is m × n — ROWS × COLUMNS (the order). Addition requires IDENTICAL dimensions and works element by element. Scalar multiplication multiplies every entry. The zero matrix adds nothing; the identity matrix I (1s on the diagonal) multiplies nothing — the matrix '1'." },
  { type: "example", text: "Worked: [1 2; 3 4] + [5 6; 7 8] = [6 8; 10 12] — element-wise, order must match. 3 × [1 2; 3 4] = [3 6; 9 12]. Dimension check FIRST — (2×3) + (2×2) is undefined and the exam is testing whether you checked." },
  { type: "heading", level: 2, text: "2. Matrix multiplication — row × column" },
  { type: "definition", term: "The compatibility rule", text: "(m × n) × (n × p) = m × p: the INNER dimensions must match, the outer give the answer's shape. Multiply each ROW into each COLUMN and sum the products. And AB ≠ BA — order matters, matrices do not commute." },
  { type: "example", text: "Worked: [1 2; 3 4] × [5 6; 7 8]: entry (1,1) = 1×5 + 2×7 = 19; entry (1,2) = 1×6 + 2×8 = 22; (2,1) = 15 + 28 = 43; (2,2) = 18 + 32 = 50 → [19 22; 43 50]. Now reverse the order — a different matrix appears. Check dimensions BEFORE multiplying: (2×3)(3×2) works → 2×2; (3×2)(3×2) does not." },
  { type: "heading", level: 2, text: "3. Determinants and inverses — the 2×2 machinery" },
  { type: "definition", term: "Determinant and inverse", text: "For [a b; c d]: det = ad − bc. Inverse: 1/det × [d −b; −c a] — SWAP the diagonal, NEGATE the off-diagonal, divide by det. If det = 0 the matrix is SINGULAR: no inverse exists — the exam's trick question." },
  { type: "example", text: "Worked: [3 4; 1 2]: det = 6 − 4 = 2 → inverse = 1/2 × [2 −4; −1 3] = [1 −2; −0.5 1.5]. Verify: multiply the matrix by its inverse — the identity [1 0; 0 1] comes out, the proof the inverse is right. [2 4; 1 2]: det = 4 − 4 = 0 → singular, no inverse — state it and stop." },
  { type: "heading", level: 2, text: "4. Solving systems — matrices as machines" },
  { type: "paragraph", text: "A linear system AX = B solves as X = A⁻¹B — multiply BOTH sides by A⁻¹ on the LEFT (order matters: A⁻¹A = I, so X = A⁻¹B, never BA⁻¹). Unique solution exists iff det ≠ 0; det = 0 means the lines are parallel (no solution) or identical (infinitely many) — the geometry behind the algebra." },
  { type: "example", text: "Worked: 3x + 4y = 10 and x + 2y = 4 → A = [3 4; 1 2], B = [10; 4]; A⁻¹ = [1 −2; −0.5 1.5] → X = A⁻¹B = [1(10) − 2(4); −0.5(10) + 1.5(4)] = [2; 1] → x = 2, y = 1. Check in both equations: 3(2) + 4(1) = 10 ✓, 2 + 2 = 4 ✓." },
  { type: "heading", level: 2, text: "5. Complex numbers — the imaginary unit" },
  { type: "definition", term: "z = a + bi", text: "i² = −1 — the number that solves x² = −1. A complex number has a real part a and imaginary part b: z = a + bi. Powers of i cycle with period 4: i, −1, −i, 1 — divide the exponent by 4 and read the remainder. Arithmetic: add real to real, imaginary to imaginary; multiply with brackets (substitute i² = −1 the moment it appears)." },
  { type: "example", text: "Worked: i^2026 = i^(2026 mod 4) = i² = −1 (2026 = 4×506 + 2). (3 + 2i) + (1 − 5i) = 4 − 3i. (2 + 3i)(1 − i) = 2 − 2i + 3i − 3i² = 5 + i — the −3i² flipped to +3, the step half the class misses." },
  { type: "heading", level: 2, text: "6. Conjugates — dividing without fear" },
  { type: "definition", term: "The conjugate", text: "The conjugate of a + bi is a − bi (flip the imaginary sign). The magic: (a + bi)(a − bi) = a² + b² — a REAL number. Divide by multiplying top and bottom by the conjugate. Quadratics with negative discriminant have roots in CONJUGATE PAIRS: if 2 + 3i is a root, 2 − 3i is the other." },
  { type: "example", text: "Worked: (3 + 2i)/(1 − i) = (3 + 2i)(1 + i)/((1 − i)(1 + i)) = (3 + 3i + 2i + 2i²)/2 = (1 + 5i)/2. The bottom collapsed to a real 2 — that is the entire technique. Roots of x² − 4x + 13 = 0: discriminant −36 → x = 2 ± 3i — conjugate pairs, always." },
  { type: "heading", level: 2, text: "7. The Argand diagram — complex numbers as points" },
  { type: "definition", term: "Modulus and argument", text: "Plot z = a + bi as the point (a, b): real axis horizontal, imaginary vertical. Modulus |z| = √(a² + b²) — the distance from the origin (Pythagoras). Argument arg z = tan⁻¹(b/a) — the angle from the positive real axis. Modulus-argument (polar) form: z = r(cos θ + i sin θ)." },
  { type: "diagram", diagramId: "argand-diagram", caption: "z = a + bi as a point: modulus r, argument θ" },
  { type: "example", text: "Worked: z = 3 + 4i → |z| = √(9 + 16) = 5, arg = tan⁻¹(4/3) ≈ 53.1° → z = 5(cos 53.1° + i sin 53.1°). Multiplying complex numbers MULTIPLIES moduli and ADDS arguments — one sentence that explains why polar form exists." },
  { type: "heading", level: 2, text: "8. Polar coordinates — another address" },
  { type: "definition", term: "(r, θ)", text: "A point addressed by distance and direction instead of gridlines: (r, θ) with x = r cos θ, y = r sin θ; back-conversion r = √(x² + y²), θ = tan⁻¹(y/x). The QUADRANT trap: tan⁻¹ ignores quadrant — when x < 0, add 180° to the calculator's answer." },
  { type: "example", text: "Worked: (3, 4) → r = 5, θ ≈ 53.1°. (−1, 1): calculator gives tan⁻¹(−1) = −45°, but the point is in the SECOND quadrant → θ = 135°. The 180° correction is the mark. Curves: r = a is a circle of radius a; r = 2a cos θ is a circle offset along the x-axis." },
  { type: "heading", level: 2, text: "9. Advanced mechanics — circular and angular motion" },
  { type: "definition", term: "Angular speed", text: "ω (radians per second) measures rotation rate: v = ωr links linear and angular speed (bigger wheel, faster rim — same spin). Period T = 2π/ω. SHM revisited: a = −ω²x where ω = 2π/T — the angular frequency controls the oscillation's stiffness." },
  { type: "example", text: "Worked: a wheel of radius 0.5 m spinning at ω = 4 rad/s → rim speed v = ωr = 2 m/s; period T = 2π/4 ≈ 1.57 s. A mass-spring with period 2 s → ω = π ≈ 3.14 rad/s → a = −π²x — the acceleration constant the exam asks you to compute." },
  { type: "heading", level: 2, text: "10. Projectiles at angles — the full treatment" },
  { type: "paragraph", text: "Resolve the launch velocity: horizontal u cos θ (constant — no horizontal force), vertical u sin θ (decelerating at g). Time of flight = 2u sin θ ÷ g; maximum height = (u sin θ)² ÷ 2g; range = u² sin 2θ ÷ g — and range is MAXIMISED at 45° (sin 2θ peaks when 2θ = 90°), the exam's favourite fact." },
  { type: "example", text: "Worked: u = 20 m/s at 30° (g = 10): components 17.3 and 10 m/s. Flight = 2(10)/10 = 2 s. Height = 100/20 = 5 m. Range = 400 × sin 60°/10 = 34.6 m. Same speed at 45°: range = 400/10 = 40 m — the maximum. The vertical motion owns the time; the horizontal owns the range." },
  { type: "heading", level: 2, text: "11. Momentum in two dimensions — conserve components" },
  { type: "paragraph", text: "Momentum is a vector: conserve the x-components and y-components SEPARATELY. Oblique collisions: resolve each velocity into components before conserving; recombine after with Pythagoras. The physics chapter 1 momentum equation, applied twice — once per axis." },
  { type: "example", text: "Worked: 2 kg at 3 m/s east hits 1 kg at 4 m/s north; they couple. x: 6 = 3v_x → v_x = 2. y: 4 = 3v_y → v_y = 4/3. Speed = √(4 + 16/9) ≈ 2.4 m/s, direction tan⁻¹((4/3)/2) ≈ 33.7° north of east. Two conservations, one recombination — nothing more." },
  { type: "heading", level: 2, text: "12. Summary — the further maths spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Matrix product", "Check inner dimensions match", "AB ≠ BA — order matters"], ["Inverse 2×2", "det first; swap diagonal, negate off", "det = 0 → singular, stop"], ["Systems", "X = A⁻¹B (left multiply!)", "Unique only if det ≠ 0"], ["Powers of i", "Divide exponent by 4, read remainder", "i² = −1 the moment it appears"], ["Division", "Multiply by the conjugate", "Bottom becomes real — the point"], ["Argand", "r = √(a²+b²), θ = tan⁻¹(b/a)", "Quadrant: add 180° when a < 0"], ["Polar", "x = r cos θ, y = r sin θ", "The calculator's θ ignores quadrants"], ["Projectiles", "Vertical owns time, horizontal owns range", "45° maximises range"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'calculate' = formula, substitution, exact values where possible (leave √3 as √3); 'express in the form a + bi' = real parts and imaginary parts collected, fully simplified; 'show that' = every line to the target. Further maths papers reward precision: the exact form and the stated assumption are the final marks." },
];

const FURTHER_QS: Q[] = [
  { q: "Which matrix product is defined?", o: ["(2×3) × (3×2) → 2×2", "(2×3) × (2×3) → 2×3", "(3×2) × (2×3) × (3×2) → defined as written", "(2×2) × (2×1) → 1×2"], a: "(2×3) × (3×2) → 2×2", e: "Inner dimensions must match; outer give the shape.", d: "easy" },
  { q: "The determinant of [3 4; 1 2] is", o: ["2", "10", "−2", "6"], a: "2", e: "det = ad − bc = 6 − 4 = 2.", d: "easy" },
  { q: "The matrix [2 4; 1 2] is", o: ["invertible with det = 4", "singular — det = 0, no inverse", "the identity matrix", "invertible with det = 2"], a: "singular — det = 0, no inverse", e: "4 − 4 = 0. Singular matrices have no inverse — state it and stop.", d: "medium" },
  { q: "i^2026 equals", o: ["1", "i", "−1", "−i"], a: "−1", e: "2026 mod 4 = 2 → i² = −1. Powers of i cycle with period 4.", d: "medium" },
  { q: "(2 + 3i)(1 − i) equals", o: ["5 + i", "−1 + i", "5 − i", "2 − 3i²"], a: "5 + i", e: "2 − 2i + 3i − 3i² = 5 + i — the −3i² flipped to +3.", d: "medium" },
  { q: "Dividing by a complex number uses", o: ["the reciprocal matrix", "the conjugate — multiply top and bottom", "rationalising with i", "polar division only"], a: "the conjugate — multiply top and bottom", e: "(a + bi)(a − bi) = a² + b² — the bottom becomes real.", d: "medium" },
  { q: "z = 3 + 4i. Its modulus and argument are", o: ["5 and ≈53.1°", "7 and ≈53.1°", "5 and ≈36.9°", "25 and 53.1°"], a: "5 and ≈53.1°", e: "r = √(9+16) = 5; θ = tan⁻¹(4/3). Pythagoras on the components.", d: "medium" },
  { q: "The point (−1, 1) in polar coordinates is", o: ["(√2, −45°)", "(√2, 135°) — quadrant corrected", "(2, 135°)", "(√2, 45°)"], a: "(√2, 135°) — quadrant corrected", e: "tan⁻¹(−1) = −45°, but x < 0 means add 180° — the quadrant trap.", d: "hard" },
  { q: "A wheel of radius 0.5 m spins at ω = 4 rad/s. Its rim speed is", o: ["2 m/s — v = ωr", "8 m/s", "0.5 m/s", "4 m/s"], a: "2 m/s — v = ωr", e: "Linear and angular speed link through the radius.", d: "easy" },
  { q: "A projectile launched at 20 m/s and 45° has maximum range because", o: ["45° is a special angle", "sin 2θ peaks when 2θ = 90°", "the horizontal speed is largest there", "gravity acts at 45°"], a: "sin 2θ peaks when 2θ = 90°", e: "Range = u² sin 2θ/g — sin 90° = 1 is the maximum.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "further-mathematics" } });
    if (!topic) throw new Error("master further-mathematics topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("further-mathematics standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Further Mathematics — Complete", content: { blocks: FURTHER_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < FURTHER_QS.length; i++) {
      const item = FURTHER_QS[i];
      await prisma.question.upsert({
        where: { id: `master-further-mathematics-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-further-mathematics-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "further-rebuild", blocks: FURTHER_BLOCKS.length, questions: FURTHER_QS.length });
  } catch (e) {
    console.error("rebuild further failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
