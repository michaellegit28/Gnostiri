import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Physics Topic 3: Electricity & Magnetism at the no-exceptions bar:
// current, voltage, Ohm's law, circuits, power, electromagnetism, induction, transformers.

const ELEC_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Current — charge in motion" },
  { type: "definition", term: "Current", text: "Charge flowing per second: I = Q/t, measured in amperes (A) — one ampere is one coulomb of charge per second. CONVENTIONAL current flows + to − (the arrow on circuit diagrams); electrons actually drift − to +. In a SERIES loop the current is the SAME at every point — charge is conserved, and there is nowhere for current to be 'used up'." },
  { type: "example", text: "Worked: 12 C of charge flows in 4 s → I = Q/t = 12 ÷ 4 = 3 A. Reverse: a 0.5 A torch bulb runs for 60 s → Q = I × t = 30 C. The triangle has three entries — charge, current, time — and any two give the third. Show the substitution: method marks precede answers." },
  { type: "heading", level: 2, text: "2. Voltage — the push per charge" },
  { type: "definition", term: "Potential difference", text: "One volt is one joule per coulomb: V = W/Q — the ENERGY transferred per unit of charge crossing the component. Voltage is not 'used-up current'; it is the push that drives current, and the energy bill each coulomb pays crossing every component." },
  { type: "example", text: "Worked: 6 C crosses a lamp and transfers 72 J → V = 72 ÷ 6 = 12 V. EMF vs p.d.: the battery's EMF is the total energy per charge it supplies; the p.d. across each component is that energy's share — and in series the shares add back to the EMF exactly." },
  { type: "heading", level: 2, text: "3. Ohm's law and the I–V graphs" },
  { type: "definition", term: "Ohm's law", text: "V = IR for an ohmic conductor at constant temperature — current proportional to voltage, so the I–V graph is a straight line through the origin. Resistance (Ω) measures how hard a component opposes the flow of current." },
  { type: "paragraph", text: "Non-ohmic components bend the graphs: a FILAMENT LAMP heats as current flows, so its resistance RISES and the curve flattens — the same extra voltage drives less extra current. A DIODE conducts one way only — nothing until the forward threshold, then steep. Matching graph to component is a guaranteed exam item: straight line = fixed resistor, flattening curve = lamp, one-way = diode." },
  { type: "example", text: "Worked: 12 V across 4 Ω → I = V/R = 3 A. Reverse: a lamp takes 0.25 A at 12 V → R = V/I = 48 Ω. Triangulate: V, I, R — any two give the third, units carried on every line." },
  { type: "heading", level: 2, text: "4. What changes resistance" },
  { type: "paragraph", text: "Resistance grows with LENGTH (twice the wire, twice the resistance) and falls with cross-sectional AREA (twice the thickness, half the resistance) — a long thin wire resists most. MATERIAL matters (resistivity: copper conducts, nichrome resists — which is why heaters use nichrome), and TEMPERATURE raises a metal's resistance: a hotter lattice shakes more, colliding with the drifting electrons." },
  { type: "example", text: "Worked: a wire's diameter doubles → its area QUADRUPLES (A = πr²) → resistance falls to a quarter. The area-squared step is the trap: diameter ×2 is area ×4, and the examiner checks whether you squared it." },
  { type: "heading", level: 2, text: "5. Series circuits — one loop" },
  { type: "paragraph", text: "One loop only: the SAME current everywhere; the supply voltage SHARES across the components (V = V₁ + V₂ + ...); resistances ADD (R = R₁ + R₂). One break — a loose bulb, an open switch — kills the entire loop, which is why old Christmas lights died together." },
  { type: "example", text: "Worked: 3 Ω and 5 Ω in series on a 12 V battery → R = 8 Ω, I = 12 ÷ 8 = 1.5 A, then V₁ = IR₁ = 4.5 V and V₂ = 7.5 V — the shares sum to 12 ✓. Solve the loop in three beats: total R, then the current, then each voltage share." },
  { type: "heading", level: 2, text: "6. Parallel circuits — branches" },
  { type: "paragraph", text: "Every branch receives the FULL supply voltage; the supply current SHARES between branches (I = I₁ + I₂); and total resistance FALLS below the smallest branch: 1/R = 1/R₁ + 1/R₂. More branches means more total current and LESS total resistance — the counter-intuitive result every exam tests." },
  { type: "diagram", diagramId: "series-parallel", caption: "Series shares the current; parallel shares the supply voltage" },
  { type: "example", text: "Worked: 6 Ω and 3 Ω in parallel → 1/R = 1/6 + 1/3 = 1/2 → R = 2 Ω (below the smallest, 3 Ω ✓). Houses wire in parallel: every appliance gets full voltage and switches independently — series wiring would dim everything and kill the lot at one fault." },
  { type: "heading", level: 2, text: "7. Power, energy, and the bills" },
  { type: "table", headers: ["Quantity", "Formula", "Worked"], rows: [["Power (W)", "P = VI", "230 V × 2 A kettle = 460 W"], ["Power (W)", "P = I²R", "3 A through 4 Ω = 36 W"], ["Energy (J)", "E = Pt", "460 W for 60 s = 27,600 J"], ["Energy (kWh)", "1 kWh = 3.6 MJ", "2 kW heater for 3 h = 6 kWh"]] },
  { type: "paragraph", text: "Fuses are rated from the current drawn: a 460 W kettle on 230 V draws 2 A, so a 3 A or 5 A fuse protects it; a 13 A fuse on a 0.5 A lamp never blows and protects nothing. P = VI connects the circuits to the bills — energy = power × time, priced in kilowatt-hours." },
  { type: "heading", level: 2, text: "8. Magnetism — fields and poles" },
  { type: "paragraph", text: "Field lines run N to S OUTSIDE a magnet, never cross, and bunch where the field is strongest; like poles repel, unlike attract. A plotting compass maps the field line by line. Iron and steel are the magnetic workhorses: iron magnetises temporarily (soft — core material), steel keeps its magnetism (permanent magnets). Induced magnetism: a paperclip touching a magnet becomes a magnet and chains more clips — the field acts at a distance and converts." },
  { type: "heading", level: 2, text: "9. Electromagnets — fields we switch" },
  { type: "definition", term: "Solenoid", text: "A coil of wire: current flows and the field inside is strong and UNIFORM (parallel lines); the coil behaves like a bar magnet with a N and a S end. The right-hand grip rule: grip the coil with your fingers following the current — the thumb points to the N end." },
  { type: "paragraph", text: "Strength rises with CURRENT, number of TURNS, and a soft-iron CORE — all three in a scrapyard crane. The electromagnetic superpower is switching OFF (a bar magnet cannot): relays, electric bells, circuit breakers, MRI scanners — every one is a switched field doing work." },
  { type: "heading", level: 2, text: "10. The motor effect — force on a current in a field" },
  { type: "definition", term: "Fleming's left hand", text: "A current-carrying wire in a magnetic field feels a FORCE (the motor effect): F = BIL — magnetic flux density (tesla) × current × length of wire in the field. Fleming's LEFT hand: thuMb = Motion (force), First finger = Field (N to S), seCond finger = Current (+ to −). Three perpendicular fingers, one force." },
  { type: "paragraph", text: "The DC motor: a current-carrying coil in a field turns because opposite sides feel opposite forces — a turning couple. The split-ring COMMUTATOR reverses the current every half turn so the coil keeps spinning the same way; carbon brushes carry the supply in. Speed rises with current, field strength, number of turns, and coil area — the four dials the exam lists." },
  { type: "heading", level: 2, text: "11. Induction — the generator's law" },
  { type: "definition", term: "Electromagnetic induction", text: "Move a wire ACROSS field lines (or a magnet past a coil) and an EMF is induced — cut the lines, induce the push. Fleming's RIGHT hand for generators: Motion, Field, Current. Bigger induction from faster motion, stronger field, and more turns — and the induced EMF reverses when the motion reverses, which is exactly how alternating current is born." },
  { type: "paragraph", text: "A bicycle dynamo: the coil spins in a field, inducing an alternating EMF — AC unless a commutator rectifies it to DC. The motor and the generator are the same machine read backwards: current in → motion out (motor); motion in → current out (generator). Lenz's direction rule: the induced current OPPOSES the change producing it — conservation of energy wearing a coat." },
  { type: "heading", level: 2, text: "12. Transformers and the national grid" },
  { type: "definition", term: "Transformer", text: "Two coils sharing an iron core: AC in the primary makes a CHANGING magnetic field, which induces a voltage in the secondary — AC only (steady DC gives a steady field: no induction, no output). Vs/Vp = Ns/Np: the turns ratio sets the voltage ratio. Step-up (more secondary turns) for transmission; step-down for the home." },
  { type: "example", text: "Worked: 230 V on a 1000-turn primary, 100-turn secondary → Vs = 230 × 100/1000 = 23 V (step-down). Assuming 100% efficiency, power in = power out: IpVp = IsVs — the secondary's higher voltage carries proportionally LESS current. Assume the efficiency, state the assumption." },
  { type: "paragraph", text: "The national grid transmits at very high voltage (hundreds of kV) precisely to make the current SMALL — cable loss is I²R, so quartering the current cuts the losses sixteenfold. Step up to send, step down to sell: the transformer is the reason the grid wastes so little." },
  { type: "heading", level: 2, text: "13. Summary — the electricity spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Current, charge", "I = Q/t triangle", "Conventional + to −; electrons the other way"], ["Ohm's law", "V = IR with units carried", "Lamp curves flatten — non-ohmic"], ["Series", "Total R → current → shares", "One break kills the loop"], ["Parallel", "1/R = 1/R₁ + 1/R₂", "Total R falls below the smallest branch"], ["Power", "P = VI = I²R", "Fuse rating follows the current drawn"], ["Motor / generator", "Left hand motor, right hand generator", "Commutator reverses current each half turn"], ["Transformer", "Vs/Vp = Ns/Np", "AC only — steady DC never induces"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'calculate' = formula, substitution, units; 'explain' = the because-chain (energy per charge, I²R loss, a changing field induces); 'state' = the memorised rule (same current in series, full voltage in parallel). Circuit papers pay method marks — total R first, then current, then shares, and every line shown." },
];

const ELEC_QS: Q[] = [
  { q: "12 C of charge flows in 4 s. The current is", o: ["3 A", "48 A", "0.33 A", "8 A"], a: "3 A", e: "I = Q/t = 12 ÷ 4. Show the substitution.", d: "easy" },
  { q: "12 V drives a current through 4 Ω. The current is", o: ["3 A", "48 A", "0.33 A", "16 A"], a: "3 A", e: "I = V/R = 12 ÷ 4 = 3 A.", d: "easy" },
  { q: "3 Ω and 5 Ω in series across a 12 V battery. The current is", o: ["1.5 A", "2.5 A", "6.7 A", "4 A"], a: "1.5 A", e: "R = 3 + 5 = 8 Ω; I = 12/8 = 1.5 A.", d: "easy" },
  { q: "6 Ω and 3 Ω connected in parallel. The total resistance is", o: ["9 Ω", "2 Ω — below the smallest branch", "4.5 Ω", "3 Ω"], a: "2 Ω — below the smallest branch", e: "1/R = 1/6 + 1/3 = 1/2 → R = 2 Ω.", d: "medium" },
  { q: "A 230 V kettle draws 2 A. Its power is", o: ["460 W", "115 W", "232 W", "920 W"], a: "460 W", e: "P = VI = 230 × 2. Fuse: 3 A or 5 A protects it.", d: "easy" },
  { q: "A filament lamp's I–V curve flattens because", o: ["the wire melts", "it heats up and its resistance rises", "the voltage runs out", "the current falls to zero"], a: "it heats up and its resistance rises", e: "Non-ohmic: hotter lattice, more collisions, higher R.", d: "medium" },
  { q: "The force on a current-carrying wire in a magnetic field is found with", o: ["Fleming's left hand", "Fleming's right hand", "the right-hand grip rule", "Ohm's law"], a: "Fleming's left hand", e: "Left = motor; right = generator. F = BIL.", d: "medium" },
  { q: "A DC motor keeps spinning in one direction because the split-ring commutator", o: ["reverses the current every half turn", "increases the current steadily", "reverses the magnetic field", "stops the coil heating"], a: "reverses the current every half turn", e: "The forces on each side must flip to keep the couple turning.", d: "medium" },
  { q: "A transformer has 1000 primary turns on 230 V and 100 secondary turns. The secondary voltage is", o: ["23 V", "2300 V", "2.3 V", "230 V"], a: "23 V", e: "Vs = Vp × Ns/Np = 230 × 0.1 — step-down.", d: "medium" },
  { q: "The national grid transmits at very high voltage in order to", o: ["make the current small and cut I²R cable losses", "increase the current delivered", "make transformers unnecessary", "store energy in the cables"], a: "make the current small and cut I²R cable losses", e: "Loss = I²R — small current, big saving. Step up to send, step down to sell.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "electricity-magnetism" } });
    if (!topic) throw new Error("master electricity-magnetism topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("electricity-magnetism standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Electricity & Magnetism — Complete", content: { blocks: ELEC_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < ELEC_QS.length; i++) {
      const item = ELEC_QS[i];
      await prisma.question.upsert({
        where: { id: `master-electricity-magnetism-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-electricity-magnetism-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "electricity-rebuild", blocks: ELEC_BLOCKS.length, questions: ELEC_QS.length });
  } catch (e) {
    console.error("rebuild electricity failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
