import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Physics Topic 1: Mechanics at the no-exceptions bar:
// kinematics, Newton, energy, momentum, circular motion, projectiles.

const MECH_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Kinematics — the vocabulary of motion" },
  { type: "table", headers: ["Quantity", "Definition", "Distinction"], rows: [["Distance (s)", "Total path length", "Scalar — no direction"], ["Displacement", "Straight-line change of position", "Vector — direction matters; a lap of a track has zero displacement"], ["Speed", "Distance per second", "Scalar"], ["Velocity (v)", "Displacement per second", "Vector — direction change at constant speed IS acceleration"], ["Acceleration (a)", "Velocity change per second", "Speeding up, braking, or turning — all accelerate"]] },
  { type: "example", text: "A car drives at a steady 60 km/h around a circular bend. Is it accelerating? YES — its direction is changing, and velocity includes direction. The trap every exam cycles: constant speed ≠ constant velocity." },
  { type: "heading", level: 2, text: "2. The equations of motion — three weapons" },
  { type: "table", headers: ["Equation", "Fits when", "Missing"], rows: [["v = u + at", "Uniform acceleration", "s (displacement)"], ["s = ut + ½at²", "Uniform acceleration from rest or motion", "v"], ["v² = u² + 2as", "Uniform acceleration, no time given", "t"]] },
  { type: "example", text: "Worked: a car accelerates from rest at 3 m/s² for 5 s. List first: u = 0, a = 3, t = 5 — the equation picks itself. v = u + at = 0 + 15 = 15 m/s. s = ut + ½at² = 0 + ½(3)(25) = 37.5 m. Check with v² = u² + 2as: 225 = 0 + 2(3)(37.5) ✓. List-then-solve is the method mark pattern: write u, v, a, s, t before choosing." },
  { type: "heading", level: 2, text: "3. Motion graphs — gradient and area" },
  { type: "paragraph", text: "Distance-time: the gradient IS the speed (steeper = faster; flat = stationary). Velocity-time: the gradient IS the acceleration, and the AREA under the graph is the distance travelled — the two facts that turn any graph into calculations." },
  { type: "example", text: "Worked: a velocity-time graph rises from 0 to 20 m/s over 8 s, then falls to 0 over 4 s. Acceleration phase: a = 20/8 = 2.5 m/s². Braking: a = −20/4 = −5 m/s² (negative = deceleration). Distance: triangle ½ × 12 × 20 = 120 m. Reading graphs is algebra in disguise — gradient and area, nothing else." },
  { type: "heading", level: 2, text: "4. Newton's three laws — the reasoning spine" },
  { type: "definition", term: "First law — inertia", text: "Objects keep their state of rest or uniform motion unless a RESULTANT force acts. No resultant force = no acceleration (not necessarily no motion). Seatbelts exist because passengers obey it: the car stops, they continue until something acts." },
  { type: "definition", term: "Second law — F = ma", text: "Resultant force = mass × acceleration. Force CAUSES acceleration, scaled by mass. Worked both ways: 12 N on 3 kg → a = 4 m/s²; doubling the mass halves the acceleration — inverse reasoning the exam loves." },
  { type: "definition", term: "Third law — pairs on different bodies", text: "Every action has an equal and opposite reaction ON THE OTHER BODY. Rocket pushes gas down; gas pushes rocket up. The pairs never act on the same object — the classic trap: 'if forces are equal, how does anything move?' Because they act on DIFFERENT bodies; only the resultant on ONE body matters." },
  { type: "heading", level: 2, text: "5. Mass and weight — different quantities" },
  { type: "example", text: "Mass is matter (kg, everywhere the same); weight is force (N, W = mg). Worked: 5 kg on Earth → W = 5 × 10 = 50 N; on the Moon (g ≈ 1.6) → 8 N. Same mass, different weight. Weightlessness is not 'no gravity': an astronaut falls WITH their spacecraft — no reaction force between them, so they feel weightless while gravity still acts. The orbit-vs-fall distinction earns the mark." },
  { type: "heading", level: 2, text: "6. Free fall and terminal velocity" },
  { type: "paragraph", text: "Free fall: all objects accelerate at g ≈ 10 m/s² near Earth — the hammer and feather land together in vacuum, not because air is light but because it is ABSENT (air resistance is the difference). A skydiver's story: weight exceeds drag (accelerate) → drag grows with speed → drag = weight (constant velocity — terminal) → parachute opens, drag jumps, new slower terminal. Two equilibrium points, one forces diagram — draw it for the mark." },
  { type: "heading", level: 2, text: "7. Work, energy, power — the audit" },
  { type: "table", headers: ["Quantity", "Formula", "Worked"], rows: [["Work (J)", "W = F × d (force's direction)", "50 N × 4 m = 200 J"], ["Kinetic energy", "KE = ½mv²", "2 kg at 3 m/s: ½ × 2 × 9 = 9 J"], ["Potential energy", "PE = mgh", "5 kg raised 10 m: 5 × 10 × 10 = 500 J"], ["Power (W)", "P = W ÷ t (or F × v)", "100 J in 4 s = 25 W"]] },
  { type: "paragraph", text: "Conservation rules all: energy transforms but the total never changes. A dropped 5 kg mass loses 500 J of PE and gains 500 J of KE — hitting the ground at v = √(2 × 10 × 10) ≈ 14 m/s. One conservation line replaces pages of kinematics; examiners award the shortcut when shown." },
  { type: "example", text: "Worked — efficiency: a motor takes 500 J and delivers 375 J of useful movement. Efficiency = 375/500 × 100 = 75%. The missing 125 J is heat and sound — wasted, never destroyed. Sankey diagrams show the split; 'lost' means transformed uselessly, never vanished." },
  { type: "heading", level: 2, text: "8. Momentum — conserved in every collision" },
  { type: "definition", term: "Momentum", text: "p = mv (vector). In any collision or explosion with no external forces, total momentum is CONSERVED: the total before equals the total after. Elastic collisions keep kinetic energy too; inelastic ones lose some to heat and sound (momentum still holds)." },
  { type: "example", text: "Worked: a 2 kg trolley at 5 m/s hits a stationary 3 kg trolley; they couple. Before: 2 × 5 = 10 kg m/s. After: (2 + 3) × v = 10 → v = 2 m/s. Momentum split the speed; kinetic energy fell (25 J → 10 J — inelastic, lost to heat at the coupling). The conservation equation IS the method: before = after, always." },
  { type: "heading", level: 2, text: "9. Impulse — the same equation, stretched" },
  { type: "paragraph", text: "Impulse = force × time = momentum change. Stretch the collision time and the force falls for the same momentum change: airbags, crash mats, and crumple zones extend t; boxers 'ride' punches; cricketers pull hands back on a catch. The physics is one equation read as safety engineering — F and t trade against each other." },
  { type: "heading", level: 2, text: "10. Circular motion — the inward pull" },
  { type: "paragraph", text: "Moving in a circle needs a centre-seeking (centripetal) force: F = mv²/r — provided by tension (whirlpool of a bucket), friction (tyres on a bend), gravity (orbits), or electromagnetism (particle accelerators). There is NO outward centrifugal force on the object in inertial frames — only the inward pull it needs. The Moon orbits because gravity supplies exactly mv²/r: too slow and it falls, too fast and it escapes — orbits ARE perpetual free fall." },
  { type: "heading", level: 2, text: "11. Projectiles — two motions, independently" },
  { type: "paragraph", text: "Horizontal and vertical motions are independent: horizontal velocity stays constant (no horizontal force), vertical acceleration is g. A ball thrown horizontally lands at the same time as one dropped — the horizontal motion does not slow the fall. Worked: thrown at 15 m/s from 20 m: time from vertical: 20 = ½(10)t² → t = 2 s; range = 15 × 2 = 30 m. Solve vertical for time, then horizontal for range — the two-beat projectile method." },
  { type: "heading", level: 2, text: "12. Summary — the mechanics spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Motion equations", "List u,v,a,s,t; pick the equation", "Signs (deceleration negative)"], ["Graphs", "Gradient / area", "Distance vs displacement"], ["Newton", "Resultant force on ONE body", "Third-law pairs on different bodies"], ["Energy", "Conservation line", "Efficiency: lost ≠ destroyed"], ["Momentum", "before = after", "Coupled masses share velocity"], ["Projectiles", "Vertical for time, horizontal for range", "Independent motions"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'calculate' = formula, substitution, units; 'explain' = because-chain with the named law; 'state' = the memorised fact. Mechanics papers pay method marks — show every line, and the examiner pays you for the working even if the arithmetic slips." },
];

const MECH_QS: Q[] = [
  { q: "A car accelerates from rest at 2 m/s² for 4 s. Its final velocity is", o: ["6 m/s", "8 m/s", "4 m/s", "16 m/s"], a: "8 m/s", e: "v = u + at = 0 + 8. List first, then solve.", d: "easy" },
  { q: "A car at constant speed turns a corner. It is", o: ["not accelerating — speed is constant", "accelerating — direction changes and velocity is a vector", "decelerating", "in equilibrium with no forces"], a: "accelerating — direction changes and velocity is a vector", e: "Velocity includes direction; turning counts.", d: "easy" },
  { q: "From a velocity-time graph, distance travelled is found from", o: ["the gradient", "the area under the graph", "the intercept", "the peak"], a: "the area under the graph", e: "Gradient gives acceleration; area gives distance.", d: "easy" },
  { q: "A rocket rises because", o: ["exhaust pushes air down", "expelled gas pushes the rocket up — Newton III on different bodies", "gravity decreases with height", "fuel is light"], a: "expelled gas pushes the rocket up — Newton III on different bodies", e: "Pairs act on DIFFERENT bodies; only one resultant matters per body.", d: "medium" },
  { q: "A 5 kg mass weighs on the Moon (g ≈ 1.6 N/kg) about", o: ["50 N", "8 N", "5 N", "0 N — weightless"], a: "8 N", e: "W = mg = 5 × 1.6. Mass unchanged; weight changes.", d: "medium" },
  { q: "A skydiver falls at terminal velocity when", o: ["weight = drag — resultant force zero", "drag = zero", "weight = 0", "gravity switches off"], a: "weight = drag — resultant force zero", e: "First law: no resultant force, no acceleration — constant velocity.", d: "medium" },
  { q: "A 2 kg trolley at 5 m/s couples with a stationary 3 kg trolley. Their speed is", o: ["2 m/s", "5 m/s", "3 m/s", "1 m/s"], a: "2 m/s", e: "Before 10 kg m/s = after 5 × v → v = 2. Momentum conserved.", d: "medium" },
  { q: "Airbags reduce injury by", o: ["reducing momentum change", "extending impact time so force falls", "absorbing all energy", "stopping the car faster"], a: "extending impact time so force falls", e: "Impulse: F × t = Δp — stretch t, shrink F.", d: "medium" },
  { q: "The Moon stays in orbit because", o: ["centrifugal force balances gravity", "gravity supplies the centripetal force mv²/r", "no forces act on it", "it is weightless"], a: "gravity supplies the centripetal force mv²/r", e: "Orbits are perpetual free fall — no outward force needed.", d: "medium" },
  { q: "A ball thrown horizontally at 15 m/s from 20 m (g = 10) lands after", o: ["1 s", "2 s — from the vertical motion alone", "4 s", "1.33 s"], a: "2 s — from the vertical motion alone", e: "Vertical: 20 = ½(10)t² → t = 2. Range = 30 m. Independent motions.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "mechanics" } });
    if (!topic) throw new Error("master mechanics topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("mechanics standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Mechanics — Complete", content: { blocks: MECH_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < MECH_QS.length; i++) {
      const item = MECH_QS[i];
      await prisma.question.upsert({
        where: { id: `master-mechanics-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-mechanics-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "mechanics-rebuild", blocks: MECH_BLOCKS.length, questions: MECH_QS.length });
  } catch (e) {
    console.error("rebuild mechanics failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
