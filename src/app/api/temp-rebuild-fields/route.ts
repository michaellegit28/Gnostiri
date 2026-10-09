import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Physics Topic 6: Further Mechanics & Fields at the no-exceptions bar:
// SHM, pendulum practical, springs, damping/resonance, gravitational & electric fields, orbits, capacitance.

const FIELDS_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Simple harmonic motion — the defining condition" },
  { type: "definition", term: "SHM", text: "Oscillation where the acceleration is PROPORTIONAL to the displacement and always directed toward the equilibrium position: a = −ω²x. Pull the oscillator further and it accelerates back harder; at equilibrium the acceleration is zero but the SPEED is maximum. The mass-spring and the pendulum (small angles) are the two standard examples." },
  { type: "paragraph", text: "Every SHM question starts from the condition: acceleration ∝ −displacement. The minus sign carries the meaning — the acceleration opposes the displacement, pulling the system home. Lose the sign and the physics is lost: the oscillator would run away, not oscillate." },
  { type: "heading", level: 2, text: "2. SHM graphs — the quarter-cycle offsets" },
  { type: "table", headers: ["Graph", "Shape", "Key facts"], rows: [["Displacement–time", "Sine wave (starting at amplitude or equilibrium)", "Amplitude and period constant"], ["Velocity–time", "Sine wave leading displacement by a QUARTER period", "Maximum at equilibrium, zero at amplitude"], ["Acceleration–time", "Sine wave in ANTIPHASE with displacement", "a = −ω²x — peak opposite to x"]] },
  { type: "paragraph", text: "The offsets are the exam's graph test: velocity peaks where displacement crosses zero (fastest through equilibrium); acceleration peaks where displacement peaks (pulled hardest at the amplitude). Antiphase acceleration-displacement is the definition drawn as a graph — quote it as such." },
  { type: "heading", level: 2, text: "3. The pendulum practical — measuring g" },
  { type: "definition", term: "Pendulum equation", text: "T = 2π√(L/g) — period depends only on LENGTH and g, not on mass or amplitude (small angles). Squaring: T² = (4π²/g)L — a straight line through the origin when T² is plotted against L." },
  { type: "example", text: "Worked practical: measure the period over 10+ oscillations and divide (timing reaction error ÷ 10 — the precision trick); vary L from 0.2 m to 1.0 m; plot T² against L; the gradient = 4π²/g → g = 4π² ÷ gradient. A gradient of 4.0 s²/m gives g = 39.5 ÷ 4.0 ≈ 9.9 m/s² ✓. The gradient-to-g step is the marked line — never average single readings." },
  { type: "heading", level: 2, text: "4. Springs — Hooke's law and combinations" },
  { type: "definition", term: "Hooke's law", text: "F = kx — extension is proportional to the stretching force, up to the LIMIT OF PROPORTIONALITY (the point where the graph bends; stretch beyond it and the spring is permanently deformed). k (N/m) is the spring constant: stiff spring, big k." },
  { type: "paragraph", text: "Spring combinations flip against each other: springs in SERIES share the force, so extensions add and the combined k FALLS (1/k = 1/k₁ + 1/k₂); springs in PARALLEL share the extension, so the forces add and the combined k RISES (k = k₁ + k₂). Compare with resistors — the same maths, opposite direction: series softens springs, series resists current." },
  { type: "example", text: "Worked: a 2 kg mass on a spring (k = 50 N/m) oscillates with T = 2π√(m/k) = 2π√(2/50) = 2π × 0.2 = 1.26 s. Quadruple the mass and the period only doubles (√4 = 2) — the square root is the exam's favourite ratio question." },
  { type: "heading", level: 2, text: "5. Energy in SHM — the exchange" },
  { type: "paragraph", text: "Energy swaps between kinetic and potential every cycle, the total staying constant (undamped): maximum KE at equilibrium (fastest), maximum PE at the amplitude (momentarily still). Half a cycle later the positions swap; the sum never changes. Damping bleeds the total away — amplitude decays until the oscillator stops." },
  { type: "heading", level: 2, text: "6. Damping and resonance — the driven oscillator" },
  { type: "definition", term: "Damping", text: "Friction and drag remove energy, so the amplitude DECAYS cycle by cycle. Light damping oscillates for a long time; critical damping returns the system to equilibrium fastest WITHOUT oscillating (car shock absorbers, door closers); heavy damping returns slowly." },
  { type: "definition", term: "Resonance", text: "Drive an oscillator at its NATURAL FREQUENCY and the amplitude peaks dramatically — energy pumped in at exactly the rate it can absorb. The wine glass shatters, the swing soars when pushed in rhythm, and bridges fail when wind matches their natural frequency (Tacoma Narrows). Dampers and detuning are the protections the exam wants named." },
  { type: "heading", level: 2, text: "7. Gravitational fields — the inverse square" },
  { type: "definition", term: "Field strength", text: "A gravitational field is a region where masses feel a force; field strength g = F/m (N/kg) — at Earth's surface, 9.8 N/kg. Around a point mass the field is RADIAL (lines point inward, denser near the mass) and follows the inverse square law: g = GM/r² — double the distance from the CENTRE and the field strength falls to a QUARTER." },
  { type: "paragraph", text: "Near the surface the radial field flattens to UNIFORM (parallel, evenly-spaced lines) — which is why g is treated as constant in school mechanics. The centre-vs-surface distinction is the trap: distance is measured from the CENTRE of the planet, not the surface." },
  { type: "diagram", diagramId: "field-lines", caption: "Radial fields bend inward or outward; the field between plates is uniform" },
  { type: "heading", level: 2, text: "8. Orbits and satellites — perpetual free fall" },
  { type: "paragraph", text: "An orbit is gravity supplying exactly the centripetal force: GMm/r² = mv²/r → v = √(GM/r). LOWER orbits move FASTER (smaller r, bigger v) — the counter-intuitive result the exam tests. Geostationary satellites: 24-hour period, equatorial plane, same spot in the sky (communications); low polar orbits scan the whole planet (weather, mapping). Escape velocity: the launch speed that lets kinetic energy exactly pay the gravitational debt — 11.2 km/s from Earth." },
  { type: "heading", level: 2, text: "9. Electric fields — Coulomb and the plates" },
  { type: "definition", term: "Coulomb's law", text: "F = kQq/r² — the force between two charges follows the SAME inverse square law as gravity, but can attract or repel. Field lines: radial outward from a positive charge, radially inward to a negative; the same line-density-means-strength rule as gravity." },
  { type: "definition", term: "Uniform field between plates", text: "Two parallel plates with a voltage between them make a UNIFORM field: E = V/d (V/m) — field strength = voltage ÷ separation. A charge between the plates feels a constant force F = EQ — the basis of inkjet printers, oscilloscopes, and Millikan's oil-drop experiment." },
  { type: "example", text: "Worked — inverse-square ratio: a charge's distance from another DOUBLES → the force falls to a QUARTER (2² = 4). Trebles → a ninth. The squared ratio is the trap: 'twice the distance, half the force' loses the mark — it is half SQUARED, a quarter." },
  { type: "heading", level: 2, text: "10. Gravitational vs electric — same maths, different charge" },
  { type: "table", headers: ["", "Gravitational", "Electric"], rows: [["Law", "g = GM/r²", "E = kQ/r² (or V/d uniform)"], ["Force on a test object", "F = mg", "F = EQ"], ["Direction", "ALWAYS attracts", "Attracts or repels — charge decides"], ["Shielding", "Impossible — nothing blocks gravity", "Faraday cage / conductors rearrange charge"], ["Scale", "Dominates planets and stars", "Dominates atoms — 10³⁶ times stronger for two protons"]] },
  { type: "paragraph", text: "The comparison question is a guaranteed essay: same inverse-square mathematics, same field-line conventions — but gravity only attracts (nothing shields it) while electric force goes both ways (and conductors shield it). Atoms exist because electric force overwhelms gravity at small scales; planets exist because gravity overwhelms electric force (matter is neutral) at large scales." },
  { type: "heading", level: 2, text: "11. Capacitance — storing charge" },
  { type: "definition", term: "Capacitor", text: "Two plates storing opposite charge: C = Q/V (farads) — the charge stored per volt. Energy stored: E = ½QV = ½CV². Capacitance rises with plate AREA and falls with SEPARATION; a dielectric (insulator) between the plates raises it further. Cameras flash and defibrillators fire from a capacitor's stored charge." },
  { type: "paragraph", text: "Charging and discharging follow exponential curves: the charge builds quickly at first, then slows (fewer electrons pushed against more repulsion); discharge halves per time constant — the RC decay echoing the half-life curve. Reading exponential curves is the shared skill of nuclear and capacitor physics." },
  { type: "heading", level: 2, text: "12. Summary — the fields spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["SHM", "a = −ω²x — sign carries the meaning", "Max speed at equilibrium, not amplitude"], ["Pendulum", "T² vs L gradient → g = 4π²/gradient", "Time 10+ oscillations, divide"], ["Springs", "Series: k falls; parallel: k rises", "Beyond the limit of proportionality"], ["Resonance", "Drive at the natural frequency", "Damping controls the peak"], ["Inverse square", "Double distance → quarter force", "Measured from the centre"], ["Fields compared", "Same maths; gravity attracts only", "Nothing shields gravity"], ["Capacitor", "C = Q/V; E = ½QV", "Exponential charge/decay curves"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'calculate' = formula, substitution, units (the squared ratio in inverse-square questions); 'explain' = the because-chain (acceleration opposes displacement, gravity supplies the centripetal force, charge decides the direction); 'describe' = read the graph's shape and offsets. Field papers pay the method marks — state the law, substitute, and carry the units to the end." },
];

const FIELDS_QS: Q[] = [
  { q: "In simple harmonic motion, the acceleration is", o: ["constant throughout", "proportional to displacement and directed toward equilibrium", "always zero at the amplitude", "independent of displacement"], a: "proportional to displacement and directed toward equilibrium", e: "a = −ω²x — the minus sign pulls the system home.", d: "medium" },
  { q: "The period of a pendulum depends on", o: ["mass and length", "length and g only", "amplitude and mass", "mass only"], a: "length and g only", e: "T = 2π√(L/g) — mass and (small) amplitude never enter.", d: "easy" },
  { q: "Plotting T² against L for a pendulum gives a straight line. g is found from", o: ["the intercept", "4π² ÷ gradient", "the gradient ÷ 4π²", "the maximum period"], a: "4π² ÷ gradient", e: "T² = (4π²/g)L — gradient = 4π²/g, so g = 4π²/gradient.", d: "medium" },
  { q: "Two identical springs in series have a combined stiffness that is", o: ["double a single spring", "half a single spring", "unchanged", "zero"], a: "half a single spring", e: "Series springs share the force — extensions add, k falls (1/k = 1/k₁ + 1/k₂).", d: "medium" },
  { q: "Resonance occurs when the driving frequency", o: ["is zero", "matches the oscillator's natural frequency — amplitude peaks", "is very high", "is exactly half the natural frequency"], a: "matches the oscillator's natural frequency — amplitude peaks", e: "Energy pumped in at the rate it can absorb.", d: "medium" },
  { q: "The distance between two charges doubles. The force between them", o: ["halves", "falls to a quarter", "doubles", "is unchanged"], a: "falls to a quarter", e: "Inverse square: (½)² = ¼ — the squared ratio is the trap.", d: "medium" },
  { q: "A geostationary satellite", o: ["orbits in 24 hours above the equator, staying over one spot", "orbits pole to pole", "orbits faster than low satellites", "needs no gravity"], a: "orbits in 24 hours above the equator, staying over one spot", e: "Period, plane, position — the three-part answer.", d: "medium" },
  { q: "The electric field between parallel plates 0.02 m apart with 100 V across them is", o: ["2000 V/m", "2 V/m", "5000 V/m", "0.0002 V/m"], a: "5000 V/m", e: "E = V/d = 100 ÷ 0.02. Uniform between plates.", d: "medium" },
  { q: "Gravity differs from the electric force because gravity", o: ["can repel", "only attracts — and nothing shields it", "is stronger between protons", "does not follow an inverse square law"], a: "only attracts — and nothing shields it", e: "Same inverse-square maths; charge decides the electric direction.", d: "hard" },
  { q: "A capacitor stores 0.01 C at 100 V. The energy stored is", o: ["1 J", "0.5 J", "2 J", "100 J"], a: "0.5 J", e: "E = ½QV = ½ × 0.01 × 100. The half is the trap.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "further-mechanics-fields" } });
    if (!topic) throw new Error("master further-mechanics-fields topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("further-mechanics-fields standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Further Mechanics & Fields — Complete", content: { blocks: FIELDS_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < FIELDS_QS.length; i++) {
      const item = FIELDS_QS[i];
      await prisma.question.upsert({
        where: { id: `master-further-mechanics-fields-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-further-mechanics-fields-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "fields-rebuild", blocks: FIELDS_BLOCKS.length, questions: FIELDS_QS.length });
  } catch (e) {
    console.error("rebuild fields failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
