import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Chemistry Topic 1: Atomic Structure & Periodic Table at the
// no-exceptions bar: models, particles, isotopes, configuration, trends, groups.

const ATOM_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. The atom's story — each model earned by evidence" },
  { type: "table", headers: ["Model", "Claim", "The evidence that forced it"], rows: [["Dalton (1803)", "Solid indivisible spheres", "Consistent mass ratios in compounds"], ["Thomson (1897)", "Plum pudding — electrons in positive dough", "Cathode rays deflected by charge: atoms contain negative particles"], ["Rutherford (1911)", "Tiny dense positive nucleus", "Alpha particles bounced back from gold foil — mostly empty space"], ["Bohr (1913)", "Electrons in fixed shells", "Elements emit line spectra, not smears — quantised levels only"], ["Chadwick (1932)", "Neutral neutrons in the nucleus", "Masses did not fit protons alone"]] },
  { type: "paragraph", text: "Learn the chain as argument, not trivia: each experiment exposed a flaw in the previous picture. The Bohr model is the working model for this level — shells of electrons at fixed energies, explaining both chemistry (outer shells) and spectra (jumps between levels)." },
  { type: "heading", level: 2, text: "2. Particles and notation" },
  { type: "table", headers: ["Particle", "Charge", "Relative mass", "Home"], rows: [["Proton", "+1", "1", "Nucleus"], ["Neutron", "0", "1", "Nucleus"], ["Electron", "−1", "1/1840 (negligible)", "Shells"]] },
  { type: "definition", term: "The two numbers", text: "Proton (atomic) number Z = protons = electrons in a neutral atom — it IS the element's identity. Nucleon (mass) number A = protons + neutrons. Neutrons = A − Z. Sodium-23: 11 p, 11 e, 12 n. Ions change only electrons: Na⁺ is 11 p, 10 e." },
  { type: "heading", level: 2, text: "3. Isotopes and relative atomic mass" },
  { type: "paragraph", text: "Isotopes share protons but differ in neutrons — same chemistry (electrons decide that), different mass. Relative atomic mass is the weighted mean against 1/12 of carbon-12:" },
  { type: "example", text: "Worked: chlorine is 75% Cl-35 and 25% Cl-37. RAM = (0.75 × 35) + (0.25 × 37) = 26.25 + 9.25 = 35.5. Show the sum — the method mark precedes the answer. Same logic for any abundance table: multiply, add, done. Why is RAM rarely a whole number? Because isotopic mixtures rarely average to one." },
  { type: "heading", level: 2, text: "4. Electron configuration — the periodic table's engine" },
  { type: "paragraph", text: "Shells fill inner-first: 2, then 8, then 8 (for the first twenty elements). Sodium 2,8,1; Chlorine 2,8,7; Argon 2,8,8 — full and satisfied. Chemistry is the outer shell: 1–3 electrons → metal, loses them; 5–7 → non-metal, gains or shares; 8 → noble, unreactive. Ions form precisely to reach noble-gas configurations: Na⁺ (2,8), Cl⁻ (2,8,8), O²⁻ (2,8)." },
  { type: "callout", variant: "warning", text: "Exam trap: an ion's electron count differs from its protons — Na⁺ has 10 electrons like neon, and its configuration proves it. 'Configuration of Na⁺ is 2,8,1' is the classic wrong answer; check the charge first." },
  { type: "heading", level: 2, text: "5. The map — Mendeleev's gamble, Moseley's correction" },
  { type: "paragraph", text: "Mendeleev ordered by atomic mass but left gaps for undiscovered elements and predicted their properties (gallium, germanium) — when they appeared as forecast, the table won. Moseley later showed the true ordering is proton number, which fixed the anomalies (tellurium/iodine). Groups are columns of shared outer electrons; periods add a shell per row. The table is not decoration — it is a compressed database of configurations." },
  { type: "heading", level: 2, text: "6. Trends — the reasoning that earns the marks" },
  { type: "diagram", diagramId: "periodic-trends", caption: "The saw-tooth of shell resets" },
  { type: "paragraph", text: "Across a period: radius shrinks because each added proton pulls the same shell harder (same shielding, more charge). First ionisation energy rises for the same reason — the electron is gripped more tightly. Down a group: radius grows (new shells dominate) and ionisation falls (outer electron sits farther out, shielded by full inner shells). EVERY trend question wants this two-factor reasoning: proton pull versus shell shielding — name both or lose the explanation mark." },
  { type: "example", text: "Applied: why is potassium MORE reactive than sodium? Both lose one outer electron; potassium's sits in shell 4, farther from the nucleus and shielded by three full shells — less grip, easier loss, faster reaction. Same logic reversed for halogens: fluorine's incoming electron enters shell 2, close and unshielded — the strongest grip of all, so Group VII reactivity FALLS down the group." },
  { type: "heading", level: 2, text: "7. Group I — the alkali metals" },
  { type: "paragraph", text: "Soft (cut with a knife), low density (lithium floats), stored under oil (they tarnish in air, react with water violently): 2Na + 2H₂O → 2NaOH + H₂. The demonstration ladder every exam quotes: lithium fizzes, sodium skates melting, potassium ignites with a lilac flame — reactivity stepping down the group for the shell-shielding reason above. The hydroxide formed makes the indicator alkaline; the test for hydrogen is the squeaky pop." },
  { type: "heading", level: 2, text: "8. Group VII — the halogens" },
  { type: "table", headers: ["Halogen", "State at room temp", "Colour"], rows: [["Fluorine F₂", "Gas", "Pale yellow"], ["Chlorine Cl₂", "Gas", "Pale green"], ["Bromine Br₂", "Liquid", "Red-brown"], ["Iodine I₂", "Solid (sublimes to violet vapour)", "Grey-black"]] },
  { type: "paragraph", text: "Reactivity falls down the group (harder to attract the seventh electron into a growing, shielded atom). Displacement proves it: bubble chlorine through potassium bromide solution and bromine forms — the more reactive halogen kicks the less reactive one out of its salt: Cl₂ + 2KBr → 2KCl + Br₂. Predicting displacement direction from group position is a guaranteed exam question." },
  { type: "heading", level: 2, text: "9. Group 0 and the transition metals" },
  { type: "paragraph", text: "Noble gases have full outer shells — they neither give nor take, so they stay monatomic gases: helium in balloons (lighter than air, non-flammable), argon shielding hot metal welds from oxidation, neon in discharge signs (line spectra again — Bohr's evidence in shop windows). Transition metals are the contrast set: dense, hard, high-melting, and they can use variable numbers of electrons — hence variable oxidation states (Fe²⁺ and Fe³⁺), coloured compounds (copper sulfate's blue), and catalytic behaviour (iron in the Haber process)." },
  { type: "heading", level: 2, text: "10. Required practical — flame tests and ion tests" },
  { type: "example", text: "Flame tests: clean a nichrome wire in concentrated HCl, dip the compound, hold in a hot blue flame. Lithium crimson-red; sodium golden-yellow (intense — it can mask others; view potassium's lilac through cobalt-blue glass to filter it); calcium orange-red; copper blue-green. The test works because excited electrons fall back to lower shells, emitting light of element-specific wavelengths — the Bohr model doing analytical chemistry." },
  { type: "example", text: "Halide test: acidify the solution with dilute nitric acid (to clear out carbonates that would falsely precipitate), add silver nitrate: AgCl white (darkens grey in light), AgBr cream, AgI pale yellow. Pair it with the flame test and one unknown solution becomes two forensic answers — a classic practical-exam pairing." },
  { type: "heading", level: 2, text: "11. Summary — the reasoning spine" },
  { type: "table", headers: ["Observation", "Because", "Key phrase"], rows: [["Radius ↓ across", "More protons, same shell", "Proton pull beats shielding"], ["Reactivity ↑ down Group I", "Outer electron easier to lose", "Shielding beats proton pull"], ["Reactivity ↓ down Group VII", "Incoming electron less attracted", "Grip weakens with distance"], ["Noble gases inert", "Full outer shell", "No give, no take"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'explain the trend' requires proton-pull AND shell-shielding in the same sentence. Data questions (a table of radii) want you to spot the period restart — the jump between rows is the new shell, not an anomaly." },
];

const ATOM_QS: Q[] = [
  { q: "Rutherford's nuclear model came from alpha particles that", o: ["passed straight through unaffected", "occasionally bounced back from a tiny dense centre", "turned into electrons", "split the gold"], a: "occasionally bounced back from a tiny dense centre", e: "Mostly empty space; rare recoils hit the nucleus.", d: "easy" },
  { q: "Bohr's shells were needed because", o: ["Rutherford's atom was too small", "elements emit line spectra — only fixed electron levels fit", "neutrons were missing", "masses were wrong"], a: "elements emit line spectra — only fixed electron levels fit", e: "Quantised jumps, quantised light.", d: "medium" },
  { q: "An atom has 12 protons and 12 neutrons. Its nucleon number is", o: ["12", "24", "36", "6"], a: "24", e: "A = p + n = 24 (magnesium).", d: "easy" },
  { q: "Chlorine's RAM is 35.5 because", o: ["half a neutron exists", "it is 75% Cl-35 and 25% Cl-37", "it loses electrons", "it has 17.5 protons"], a: "it is 75% Cl-35 and 25% Cl-37", e: "Weighted mean: 0.75×35 + 0.25×37.", d: "easy" },
  { q: "The electron configuration of Ca²⁺ (Z=20) is", o: ["2,8,8,2", "2,8,8", "2,8,10", "2,8,8,8"], a: "2,8,8", e: "Two electrons lost — argon's stable shell.", d: "medium" },
  { q: "Atomic radius decreases across a period because", o: ["electrons are lost", "each proton pulls the same shell harder", "shells merge", "neutrons push outward"], a: "each proton pulls the same shell harder", e: "Proton pull beats shielding — the two-factor answer.", d: "medium" },
  { q: "Potassium reacts faster than sodium with water because its outer electron", o: ["is closer to the nucleus", "sits farther out, shielded by full shells — easier to lose", "is heavier", "is a different element entirely"], a: "sits farther out, shielded by full shells — easier to lose", e: "Group I reactivity rises down the group.", d: "medium" },
  { q: "Cl₂ is bubbled through KBr solution. The result is", o: ["no reaction", "bromine forms — chlorine displaces it", "potassium forms", "KCl decomposes"], a: "bromine forms — chlorine displaces it", e: "More reactive halogen wins the salt.", d: "medium" },
  { q: "A flame test shows crimson-red. The compound contains", o: ["sodium", "lithium", "calcium", "copper"], a: "lithium", e: "The named colours are memorised marks.", d: "easy" },
  { q: "Transition metals differ from Group I by having", o: ["no metallic bonding", "variable oxidation states and coloured compounds", "one outer electron", "lower densities"], a: "variable oxidation states and coloured compounds", e: "Fe²⁺/Fe³⁺, copper-blue salts — plus catalytic duty (iron in Haber).", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "atomic-structure-periodic-table" } });
    if (!topic) throw new Error("master atomic-structure topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("atomic-structure standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Atomic Structure & Periodic Table — Complete", content: { blocks: ATOM_BLOCKS } as object, estimatedMinutes: 50 } });
    for (let i = 0; i < ATOM_QS.length; i++) {
      const item = ATOM_QS[i];
      await prisma.question.upsert({
        where: { id: `master-atomic-structure-periodic-table-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-atomic-structure-periodic-table-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "atomic-rebuild", blocks: ATOM_BLOCKS.length, questions: ATOM_QS.length });
  } catch (e) {
    console.error("rebuild atomic failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
