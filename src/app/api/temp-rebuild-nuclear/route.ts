import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Physics Topic 5: Nuclear & Quantum Physics at the no-exceptions bar:
// the nucleus, radioactivity, nuclear equations, half-life, uses, fission/fusion, photoelectric effect.

const NUCLEAR_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. The nucleus — protons, neutrons, isotopes" },
  { type: "definition", term: "Nuclear notation", text: "Atoms have a tiny dense nucleus of PROTONS (+) and NEUTRONS (0) — the nucleons — with electrons orbiting far outside. Notation reads: mass number A on top (protons + neutrons), atomic number Z below (protons). Carbon-14 written ¹⁴₆C: 14 nucleons, 6 protons, 8 neutrons. The proton count IS the element — change it and the element changes." },
  { type: "definition", term: "Isotopes", text: "Same number of protons, DIFFERENT number of neutrons: carbon-12 and carbon-14 are both carbon (6 protons) but behave differently in the nucleus — carbon-14 is unstable and radioactive, carbon-12 is stable. Chemistry cares about electrons (isotopes react identically); the nucleus keeps the difference that matters here." },
  { type: "heading", level: 2, text: "2. Radioactivity — unstable nuclei decay" },
  { type: "paragraph", text: "Unstable nuclei throw out radiation to become stable: the decay is RANDOM (you cannot predict which nucleus decays next) and SPONTANEOUS (nothing you do — temperature, pressure, chemistry — changes it). Three radiations, three personalities:" },
  { type: "table", headers: ["Radiation", "What it is", "Stopped by", "Ionising power"], rows: [["Alpha (α)", "A helium nucleus: 2 protons + 2 neutrons, charge +2", "Paper, a few cm of air", "Most ionising"], ["Beta (β)", "A fast electron from the nucleus, charge −1", "A few mm of aluminium", "Moderate"], ["Gamma (γ)", "An electromagnetic wave, no charge, no mass", "Thick lead or concrete (never fully stopped)", "Least ionising, most penetrating"]] },
  { type: "paragraph", text: "The trade-off runs through everything: alpha is heavy and slow — it rips atoms apart (most ionising) but cannot travel; gamma is light and fast — it slips through but rarely hits. The absorbing material identifies the radiation: paper, aluminium, lead — that order is the exam's alphabet." },
  { type: "heading", level: 2, text: "3. Deflection in fields — the charge test" },
  { type: "paragraph", text: "In electric or magnetic fields, alpha and beta deflect in OPPOSITE directions (opposite charges) and gamma sails straight through (no charge). Beta deflects MORE than alpha despite the smaller charge: it is ~7000 times lighter, so the same force bends it far more. Which way is which: alpha (positive) bends toward the negative plate; beta (negative) toward the positive plate — the deflection pattern is the fingerprint the exam shows." },
  { type: "heading", level: 2, text: "4. Nuclear equations — balance both numbers" },
  { type: "paragraph", text: "Nuclear equations must balance for BOTH the mass number (top) and the atomic number (bottom). Alpha decay: the nucleus loses 2 protons and 2 neutrons → mass falls by 4, atomic number by 2, and a helium nucleus (⁴₂He) flies out. Beta decay: a NEUTRON turns into a proton + electron → the electron (⁰₋₁e) leaves, the atomic number RISES by 1, the mass number is unchanged." },
  { type: "example", text: "Worked: uranium-238 (²³⁸₉₂U) alpha-decays → mass 238 − 4 = 234, atomic 92 − 2 = 90 → thorium-234 (²³⁴₉₀Th) + ⁴₂He. Worked: carbon-14 (¹⁴₆C) beta-decays → mass 14, atomic 6 + 1 = 7 → nitrogen-14 (¹⁴₇N) + ⁰₋₁e. Write the two totals as a sum line — the balancing IS the method mark." },
  { type: "heading", level: 2, text: "5. Half-life — random atoms, predictable statistics" },
  { type: "definition", term: "Half-life", text: "The time for HALF the unstable nuclei in a sample to decay. Individual decays are random — the sample's behaviour is not: halve, halve, halve again, forever approaching zero but never reaching it. The decay curve is exponential: the same fraction falls in each half-life." },
  { type: "diagram", diagramId: "half-life-curve", caption: "800 g → 400 → 200 → 100: halve every half-life, never reach zero" },
  { type: "example", text: "Worked: 800 g of a isotope with half-life 3 days → 3 days: 400 g; 6 days: 200 g; 9 days: 100 g. The method: halvings = elapsed time ÷ half-life, then divide by 2 that many times. Reverse: a sample fell from 400 g to 50 g → 50/400 = 1/8 = ½ × ½ × ½ → three half-lives elapsed. Count the halvings — never a straight-line ratio." },
  { type: "heading", level: 2, text: "6. Background radiation — always there" },
  { type: "paragraph", text: "A Geiger counter clicks everywhere: COSMIC RAYS from space, RADON gas from rocks, radiation in food and building materials, and medical sources. Background radiation is the floor every measurement stands on: measure it first, SUBTRACT it from every reading — a source reading of 90 counts/s over a background of 10 counts/s means the source contributes 80. The subtraction step is the marked difference between a pass and a fail in practical questions." },
  { type: "heading", level: 2, text: "7. Uses — each radiation earns its job" },
  { type: "table", headers: ["Use", "Radiation", "Why it fits"], rows: [["Medical tracers", "Gamma (technetium)", "Penetrates the body to the detector; short half-life limits the dose"], ["Radiotherapy", "Gamma (cobalt-60)", "Highly penetrating — kills tumours through healthy tissue"], ["Sterilising equipment", "Gamma", "Kills bacteria through sealed packaging"], ["Thickness gauges (foil, paper)", "Beta", "Absorbed proportionally — too thin lets more through"], ["Carbon dating", "Carbon-14 (beta)", "Half-life 5730 years — dates once-living material"], ["Smoke alarms", "Alpha (americium)", "Alpha ionises air in the chamber; smoke cuts the current — alarm"]] },
  { type: "paragraph", text: "The why-chain is the exam's real question: the radiation's penetration and half-life must FIT the job. A tracer needs a short half-life (gone by tomorrow); a dating isotope needs a long one (lasting millennia); a gauge needs steady absorption (beta). Match the property to the purpose, in words." },
  { type: "heading", level: 2, text: "8. Dangers and safety — ionisation damages cells" },
  { type: "paragraph", text: "All three radiations IONISE — they strip electrons from atoms, damaging cells and DNA; alpha is the most ionising (most dangerous inside the body — swallowed or inhaled it cannot escape), gamma the most penetrating (most dangerous outside). Safety is three moves: TIME (short exposure), DISTANCE (tongs, remote handling — inverse-square falloff), SHIELDING (lead-lined containers, lead aprons). Stored in lead, handled with tongs, exposed briefly — the three-part answer." },
  { type: "heading", level: 2, text: "9. Fission and fusion — mass becomes energy" },
  { type: "definition", term: "Fission", text: "A HEAVY nucleus splits: a neutron hits uranium-235, it wobbles and splits into two smaller nuclei + 2 or 3 neutrons + energy. The released neutrons hit more uranium-235 — a CHAIN REACTION, controlled in reactors (control rods absorb the spare neutrons) and uncontrolled in weapons." },
  { type: "definition", term: "Fusion", text: "LIGHT nuclei join: hydrogen nuclei fuse into helium — the Sun's engine. Fusion releases MORE energy per kilogram than fission, but needs enormous temperature and pressure to force the positive nuclei together against their electric repulsion. Stars fuse; reactors dream of it (the fuel is seawater, the waste is helium)." },
  { type: "paragraph", text: "Both release energy because the products weigh LESS than the ingredients: the missing mass (the mass defect) converts to energy by E = mc² — a tiny mass is an enormous energy. The conservation line reads mass AND energy together now: mass-energy is conserved, not mass alone." },
  { type: "heading", level: 2, text: "10. The photoelectric effect — light as particles" },
  { type: "definition", term: "Photoelectric effect", text: "Shine light on a metal and ELECTRONS are ejected — but only if the light's frequency exceeds a THRESHOLD frequency for that metal. Below the threshold, NOTHING is ejected no matter how bright the light; above it, electrons leave instantly. Brightness (intensity) sets HOW MANY electrons; frequency sets WHETHER any leave at all." },
  { type: "example", text: "Light is quantised into photons of energy E = hf (h = Planck's constant, f = frequency). One photon, one electron: a photon below the threshold carries too little energy to free an electron, however many arrive — dim red light ejects nothing from a metal that bright blue light empties instantly. The experiment that forced wave-thinkers to accept particles is the exam's favourite history-of-physics item — and the same Young's-slits evidence cuts the other way: light behaves as BOTH wave and particle depending on the experiment." },
  { type: "heading", level: 2, text: "11. Summary — the nuclear spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Identify radiation", "Paper → aluminium → lead", "Gamma never fully stopped"], ["Nuclear equations", "Balance mass AND atomic numbers", "Beta: atomic number RISES by 1"], ["Half-life", "Count the halvings", "Never a straight-line ratio"], ["Measurements", "Subtract background first", "Background is the floor of every reading"], ["Uses", "Match penetration + half-life to the job", "Alpha inside the body is the worst case"], ["Fission / fusion", "Heavy splits; light joins", "Mass defect → E = mc²"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'calculate' = halvings or E = hf with units; 'explain' = the because-chain (ionisation, chain reaction, threshold frequency); 'state' = the memorised properties (penetration order, stopping materials, three safety moves). Nuclear papers reward the balanced equation and the counted half-life — show both, every time." },
];

const NUCLEAR_QS: Q[] = [
  { q: "Alpha radiation is stopped by", o: ["a sheet of paper", "a few mm of aluminium", "thick lead only", "nothing — it penetrates everything"], a: "a sheet of paper", e: "Penetration order: paper → aluminium → lead.", d: "easy" },
  { q: "Beta decay of a nucleus", o: ["lowers the atomic number by 2", "raises the atomic number by 1 — a neutron becomes a proton + electron", "leaves the nucleus unchanged", "doubles the mass number"], a: "raises the atomic number by 1 — a neutron becomes a proton + electron", e: "Balance both numbers: mass unchanged, atomic +1.", d: "medium" },
  { q: "800 g of an isotope (half-life 3 days) after 9 days is", o: ["100 g", "200 g", "266 g", "50 g"], a: "100 g", e: "Three half-lives: 800 → 400 → 200 → 100. Count the halvings.", d: "easy" },
  { q: "In an electric field, gamma radiation", o: ["deflects toward the positive plate", "deflects toward the negative plate", "passes straight through — it has no charge", "stops immediately"], a: "passes straight through — it has no charge", e: "No charge, no mass — no deflection.", d: "easy" },
  { q: "A source reads 90 counts/s; the background is 10 counts/s. The source contributes", o: ["90 counts/s", "80 counts/s — subtract the background", "9 counts/s", "100 counts/s"], a: "80 counts/s — subtract the background", e: "Background is the floor of every measurement.", d: "easy" },
  { q: "A medical tracer uses gamma with a SHORT half-life because", o: ["short half-life is cheaper", "the activity falls quickly — limiting the patient's dose", "gamma cannot penetrate otherwise", "short half-life makes it more ionising"], a: "the activity falls quickly — limiting the patient's dose", e: "Match the half-life to the job — gone by tomorrow.", d: "medium" },
  { q: "Nuclear fusion", o: ["splits heavy nuclei", "joins light nuclei — the Sun's engine", "only happens in reactors", "absorbs energy overall"], a: "joins light nuclei — the Sun's engine", e: "Fission splits heavy; fusion joins light — both release energy from the mass defect.", d: "medium" },
  { q: "Below the threshold frequency, bright light on a metal ejects", o: ["many electrons", "no electrons — each photon lacks the energy", "slow electrons", "protons"], a: "no electrons — each photon lacks the energy", e: "One photon, one electron: frequency decides, not brightness.", d: "medium" },
  { q: "In beta decay the emitted electron comes from", o: ["the outer electron shells", "the nucleus — a neutron turns into a proton + electron", "the detector", "another atom's orbit"], a: "the nucleus — a neutron turns into a proton + electron", e: "Beta is a nuclear electron, not an orbital one — the trap.", d: "hard" },
  { q: "Fission and fusion both release energy because", o: ["neutrons carry energy away", "the products weigh less than the reactants — the mass defect becomes E = mc²", "electrons are stripped", "the nucleus cools"], a: "the products weigh less than the reactants — the mass defect becomes E = mc²", e: "Mass-energy is conserved together — a tiny mass is an enormous energy.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "nuclear-quantum-physics" } });
    if (!topic) throw new Error("master nuclear-quantum-physics topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("nuclear-quantum-physics standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Nuclear & Quantum Physics — Complete", content: { blocks: NUCLEAR_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < NUCLEAR_QS.length; i++) {
      const item = NUCLEAR_QS[i];
      await prisma.question.upsert({
        where: { id: `master-nuclear-quantum-physics-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-nuclear-quantum-physics-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "nuclear-rebuild", blocks: NUCLEAR_BLOCKS.length, questions: NUCLEAR_QS.length });
  } catch (e) {
    console.error("rebuild nuclear failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
