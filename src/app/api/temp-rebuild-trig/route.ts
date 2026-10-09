import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Maths Topic 2: Geometry & Trigonometry at the no-exceptions bar:
// angle rules, triangles, Pythagoras, similarity, circle theorems, coordinate geometry, trig, sine/cosine laws, vectors, transformations.

const TRIG_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Angle rules — name the rule, earn the mark" },
  { type: "paragraph", text: "Angles on a straight line sum to 180°; angles round a point sum to 360°; vertically opposite angles are EQUAL. Parallel lines cut by a transversal: alternate angles equal (Z shape), corresponding angles equal (F shape), co-interior angles sum to 180° (C shape). The NUMBER alone scores nothing — the examiner pays for the RULE named beside it." },
  { type: "example", text: "Worked: parallel lines with a transversal; one angle is 65°. Alternate (Z): 65°. Co-interior (C): 115°. Corresponding (F): 65°. Write the reason on every line: 'alternate angles are equal' — that phrase is the method mark." },
  { type: "heading", level: 2, text: "2. Triangles — the family and the sum" },
  { type: "definition", term: "Angle sum 180°", text: "Every triangle's interior angles sum to 180°. Equilateral: all 60°. Isosceles: two equal sides facing two equal BASE angles. Scalene: no equals. The exterior angle equals the sum of the two opposite interior angles — one line that replaces two steps." },
  { type: "example", text: "Worked: isosceles with vertex angle 40° → base angles = (180 − 40) ÷ 2 = 70°. Exterior angle: an exterior 110° means the two opposite interiors sum to 110° — no need to find the third interior angle first." },
  { type: "heading", level: 2, text: "3. Pythagoras — the right-angle test" },
  { type: "definition", term: "a² + b² = c²", text: "In a RIGHT-ANGLED triangle: the squares of the two shorter sides sum to the square of the hypotenuse (the side OPPOSITE the right angle — the longest). It also runs in reverse: test whether a triangle is right-angled by checking the squares." },
  { type: "example", text: "Worked: legs 6 and 8 → hypotenuse = √(36 + 64) = 10 (the 3-4-5 family ×2). Reverse: sides 5, 12, 13 → 25 + 144 = 169 = 13² ✓ right-angled. Sides 4, 5, 6 → 16 + 25 = 41 ≠ 36 — not right-angled. The square-test is the two-mark question in disguise." },
  { type: "heading", level: 2, text: "4. Congruence and similarity — scale factors" },
  { type: "definition", term: "Similar shapes", text: "Congruent = identical (tests: SSS, SAS, ASA, RHS). Similar = same shape, different size: angles EQUAL, sides in the same RATIO. Find the scale factor k from one pair of matching sides, then scale everything. The trap: AREA scales as k², VOLUME as k³ — never as k." },
  { type: "example", text: "Worked: similar triangles with a side 3 growing to 6 (k = 2): all sides double, areas ×4, volumes ×8. A cuboid enlarged by k = 3 → volume ×27. The cubed-area question is where marks bleed — quote k² or k³ explicitly." },
  { type: "heading", level: 2, text: "5. Circle theorems — seven rules, name each" },
  { type: "table", headers: ["Theorem", "Rule"], rows: [["Centre vs circumference", "Angle at the centre = 2 × angle at the circumference (same arc)"], ["Same segment", "Angles in the same segment are equal"], ["Semicircle", "Angle in a semicircle = 90° (Thales)"], ["Cyclic quadrilateral", "Opposite angles sum to 180°"], ["Tangent", "Tangent meets the radius at 90°"], ["Alternate segment", "Angle between tangent and chord = angle in the alternate segment"], ["Chord bisector", "Perpendicular from the centre bisects a chord"]] },
  { type: "example", text: "Worked: a triangle inscribed with one side as the diameter → the angle opposite the diameter is 90° (semicircle theorem). A cyclic quadrilateral with angles 95° and x → x = 85° (opposites sum to 180°). Draw the radius or diameter in — the added line is what unlocks the theorem." },
  { type: "heading", level: 2, text: "6. Coordinate geometry — the straight line" },
  { type: "definition", term: "y = mx + c", text: "Gradient m = (y₂ − y₁)/(x₂ − x₁) — rise over run; c = the y-intercept. Parallel lines share the gradient. PERPENDICULAR lines multiply to −1: m⊥ = −1/m (the negative reciprocal — flip and invert). Midpoint = average the coordinates." },
  { type: "example", text: "Worked: line through (1, 2) and (3, 8): m = (8−2)/(3−1) = 3 → y = 3x + c; sub (1,2): c = −1 → y = 3x − 1. Perpendicular through (1,2): m = −1/3 → y = −x/3 + 7/3. Two lines with gradients 2 and −1/2 are perpendicular: 2 × (−1/2) = −1 ✓." },
  { type: "heading", level: 2, text: "7. SOH CAH TOA — label the sides FIRST" },
  { type: "definition", term: "The three ratios", text: "sin θ = opposite/hypotenuse; cos θ = adjacent/hypotenuse; tan θ = opposite/adjacent. Label the sides relative to the GIVEN angle BEFORE choosing the ratio — the labelling IS the method. Invert (sin⁻¹, cos⁻¹, tan⁻¹) to find angles." },
  { type: "example", text: "Worked: angle 30°, hypotenuse 10, find the opposite: x = 10 × sin 30° = 10 × 0.5 = 5. Find the angle: tan θ = 3/4 → θ = tan⁻¹(0.75) ≈ 36.9°. Right-angled triangles only — for anything else, the next section takes over." },
  { type: "heading", level: 2, text: "8. The sine and cosine laws — any triangle" },
  { type: "table", headers: ["Law", "Equation", "Use when"], rows: [["Sine law", "a/sinA = b/sinB = c/sinC", "Two angles + a side, or two sides + a NON-included angle"], ["Cosine law", "a² = b² + c² − 2bc·cosA", "Two sides + the INCLUDED angle, or all three sides (find an angle)"]] },
  { type: "example", text: "Worked — cosine law: b = 5, c = 7, A = 60° → a² = 25 + 49 − 2(5)(7)(0.5) = 39 → a ≈ 6.24. Worked — sine law: a = 6, A = 40°, B = 65° → b = 6 sin 65°/sin 40° ≈ 8.5. Right-angled? The laws fall back to Pythagoras and SOH CAH TOA — cos 90° = 0 kills the cross term." },
  { type: "diagram", diagramId: "trig-circle", caption: "The unit circle: sin and cos are coordinates — exact values on the right" },
  { type: "heading", level: 2, text: "9. The unit circle — exact values" },
  { type: "definition", term: "Coordinates as trig", text: "On the unit circle, a point at angle θ has coordinates (cos θ, sin θ) — trigonometry is geometry on a circle. The exact values are exam currency: sin 30° = 1/2, sin 45° = √2/2, sin 60° = √3/2; cos mirrors them; tan 30° = 1/√3, tan 45° = 1, tan 60° = √3." },
  { type: "example", text: "Worked: sin 150° = sin 30° = 1/2 — the second quadrant keeps sine positive (ASTC: All-Sine-Tan-Cos going anticlockwise). cos 120° = −1/2 (cosine negative in the second quadrant). The quadrant sign is the trap — the CAST diagram decides it." },
  { type: "heading", level: 2, text: "10. Areas — every formula, one table" },
  { type: "table", headers: ["Shape", "Area", "Worked"], rows: [["Triangle", "½ × base × height (or ½ab sinC)", "b = 8, h = 5 → 20"], ["Trapezium", "½(a + b)h", "a = 4, b = 8, h = 5 → 30"], ["Circle", "πr²", "r = 6 → 36π ≈ 113.1"], ["Sector", "(θ/360) × πr²", "θ = 60°, r = 6 → 6π ≈ 18.8"], ["Arc length", "(θ/360) × 2πr", "θ = 60°, r = 6 → 2π ≈ 6.28"]] },
  { type: "paragraph", text: "½ab sin C is the angle-between-two-sides formula — no height needed, the sine supplies it. Sector and arc are fractions of the circle: the angle over 360 scales both." },
  { type: "heading", level: 2, text: "11. Vectors — magnitude, direction, proof" },
  { type: "definition", term: "Vector basics", text: "A vector is a displacement: magnitude AND direction (column form (x, y) or i + j notation). Magnitude |a| = √(x² + y²) — Pythagoras on the components. Add nose-to-tail (components add); parallel vectors are SCALAR MULTIPLES of each other — that is the proof of collinearity." },
  { type: "example", text: "Worked: a = (3, 4) → |a| = √(9 + 16) = 5 (the 3-4-5 triangle again — it is everywhere). Prove A, B, C are collinear: show AB = k·BC for some scalar k — same direction, same line. Vectors (2, 3) and (−4, −6): multiples (× −2) — parallel, opposite direction." },
  { type: "heading", level: 2, text: "12. Transformations — describe them precisely" },
  { type: "paragraph", text: "The four transformations: REFLECTION (mirror line), ROTATION (centre + angle + direction), TRANSLATION (a vector), ENLARGEMENT (centre + scale factor). A complete description is the mark: 'rotation of 90° anticlockwise about (0,0)' — all three parts. Enlargement with a NEGATIVE factor flips AND scales (k = −1 is a 180° rotation) — the trap that catches half the class." },
  { type: "example", text: "Worked: reflect (3, 5) in the line y = x → swap the coordinates: (5, 3). Translate by (2, −1) → add the vector: (5, 4). Enlarge (1, 1) by k = 3 about the origin → (3, 3); by k = −1 → (−1, −1). Invariant points stay fixed (the centre of rotation, points on the mirror line)." },
  { type: "heading", level: 2, text: "13. Summary — the geometry spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Angles", "Name the rule on every line", "The number alone scores nothing"], ["Pythagoras", "Square-test both directions", "Hypotenuse is opposite the right angle"], ["Similarity", "k for sides, k² area, k³ volume", "The squared/cubed factor"], ["Circle theorems", "Draw the radius/diameter in", "Name the theorem"], ["Perpendicular", "m × m⊥ = −1", "Flip AND invert"], ["Trig", "Label sides first, then the ratio", "Right-angled only — SOH CAH TOA"], ["Sine/cosine laws", "Included angle → cosine law", "Sine law's ambiguous case"], ["Vectors", "Scalar multiple = collinear proof", "Magnitude is Pythagoras"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'calculate' = formula, substitution, units; 'prove' = the named theorem or the scalar-multiple line, stated as such; 'describe' = every part (centre, angle, direction / centre, factor). Geometry papers pay the reasons — an unexplained angle is a wrong angle." },
];

const TRIG_QS: Q[] = [
  { q: "An isosceles triangle has vertex angle 40°. Each base angle is", o: ["70°", "50°", "40°", "140°"], a: "70°", e: "(180 − 40) ÷ 2 — base angles are equal.", d: "easy" },
  { q: "A triangle has sides 5, 12, 13. It is", o: ["right-angled — 25 + 144 = 169", "equilateral", "not right-angled", "isosceles only"], a: "right-angled — 25 + 144 = 169", e: "The square-test runs Pythagoras in reverse.", d: "easy" },
  { q: "Similar shapes are enlarged by scale factor 3. Their volumes scale by", o: ["3", "6", "9", "27"], a: "27", e: "Volume scales as k³ — the cubed factor is the trap.", d: "medium" },
  { q: "A triangle inscribed in a semicircle (one side = diameter) has the opposite angle", o: ["60°", "90° — the semicircle theorem", "45°", "180°"], a: "90° — the semicircle theorem", e: "Thales: the angle in a semicircle is always a right angle.", d: "easy" },
  { q: "Lines with gradients 2 and −1/2 are", o: ["parallel", "perpendicular — gradients multiply to −1", "the same line", "neither"], a: "perpendicular — gradients multiply to −1", e: "2 × (−1/2) = −1 ✓ — flip and invert.", d: "medium" },
  { q: "A ramp rises 3 m over a 4 m horizontal run. The angle of elevation is", o: ["36.9° — tan⁻¹(3/4)", "48.6°", "53.1°", "45°"], a: "36.9° — tan⁻¹(3/4)", e: "tan θ = opp/adj = 3/4; invert for the angle.", d: "medium" },
  { q: "b = 5, c = 7, included angle A = 60°. Side a is", o: ["≈ 6.24 — cosine law", "≈ 8.60 — sine law", "12 — Pythagoras", "≈ 5.74"], a: "≈ 6.24 — cosine law", e: "a² = 25 + 49 − 2(5)(7)(0.5) = 39.", d: "medium" },
  { q: "sin 150° equals", o: ["−1/2", "1/2 — sine is positive in the second quadrant", "√3/2", "−√3/2"], a: "1/2 — sine is positive in the second quadrant", e: "ASTC: sin 150° = sin 30°. The quadrant sign is the trap.", d: "medium" },
  { q: "A sector has angle 60° and radius 6. Its area is", o: ["6π ≈ 18.8", "36π ≈ 113", "2π ≈ 6.3", "3π ≈ 9.4"], a: "6π ≈ 18.8", e: "(60/360) × π × 36 — the angle over 360 scales the circle.", d: "medium" },
  { q: "Position vectors a = (3, 4) and b = (6, 8). The line through their endpoints", o: ["passes through the origin — b = 2a, parallel vectors", "is perpendicular to a", "has magnitude 10", "cannot be determined"], a: "passes through the origin — b = 2a, parallel vectors", e: "Parallel vectors are scalar multiples — collinear points.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "geometry-trigonometry" } });
    if (!topic) throw new Error("master geometry-trigonometry topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("geometry-trigonometry standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Geometry & Trigonometry — Complete", content: { blocks: TRIG_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < TRIG_QS.length; i++) {
      const item = TRIG_QS[i];
      await prisma.question.upsert({
        where: { id: `master-geometry-trigonometry-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-geometry-trigonometry-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "trig-rebuild", blocks: TRIG_BLOCKS.length, questions: TRIG_QS.length });
  } catch (e) {
    console.error("rebuild trig failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
