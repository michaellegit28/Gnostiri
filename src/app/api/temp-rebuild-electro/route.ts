import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Chemistry Topic 6: Electrochemistry at the no-exceptions bar:
// redox, oxidation numbers, half-equations, electrolysis, cells, corrosion.

const ELEC_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Redox — OILRIG, the bookkeeping of electrons" },
  { type: "definition", term: "OILRIG", text: "Oxidation Is Loss (of electrons); Reduction Is Gain. Oxidising agents TAKE electrons (they get reduced); reducing agents GIVE electrons (they get oxidised). Track the electrons and every redox equation unravels: Mg + Cu²⁺ → Mg²⁺ + Cu means magnesium oxidised (lost 2e⁻), copper ions reduced (gained 2e⁻) — displacement is redox in disguise." },
  { type: "heading", level: 2, text: "2. Oxidation numbers — assigning the ledger" },
  { type: "table", headers: ["Rule", "Value", "Worked case"], rows: [["Uncombined element", "0", "O₂: O = 0; Fe: Fe = 0"], ["Monatomic ion", "Its charge", "Na⁺ = +1; Cl⁻ = −1; O²⁻ = −2"], ["Oxygen (usually)", "−2 (peroxides −1)", "H₂O: O = −2; H₂O₂: O = −1"], ["Hydrogen (usually)", "+1 (hydrides −1)", "HCl: H = +1; NaH: H = −1"], ["Sum of all", "0 (or the ion's charge)", "The rule that finds the hidden one"]] },
  { type: "example", text: "Worked: MnO₄⁻ — oxygen's four give −8, the ion totals −1, so Mn = +7. SO₄²⁻: O gives −8, ion is −2, so S = +6. HNO₃: H +1, O₃ −6, total 0 → N = +5. Oxidation numbers turn redox into arithmetic: in Cl₂ + 2KBr → 2KCl + Br₂, chlorine goes 0 → −1 (reduced, gain) and bromine −1 → 0 (oxidised, loss). The number change IS the evidence." },
  { type: "heading", level: 2, text: "3. Half-equations — splitting the story" },
  { type: "paragraph", text: "Every redox equation splits into two half-equations — one for oxidation, one for reduction. Electrons appear as products on the oxidation side, reactants on the reduction side: Mg → Mg²⁺ + 2e⁻; Cu²⁺ + 2e⁻ → Cu. Electrons must BALANCE between the halves (the same number lost and gained) — combine by multiplying where needed." },
  { type: "example", text: "Worked (with water and acid): MnO₄⁻ → Mn²⁺ in acid solution. Balance O with H₂O: MnO₄⁻ → Mn²⁺ + 4H₂O. Balance H with H⁺: MnO₄⁻ + 8H⁺ → Mn²⁺ + 4H₂O. Balance charge with electrons: left is +7, right is +2 → add 5e⁻ left: MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O. The O/H/charge order is the exam method — three balances, one half-equation." },
  { type: "heading", level: 2, text: "4. Electrolysis — splitting compounds with electricity" },
  { type: "paragraph", text: "Direct current through a molten or dissolved ionic compound forces its ions to move: positive cations march to the CATHODE (negative — they gain electrons, reduction), negative anions to the ANODE (positive — they lose electrons, oxidation). Label electrodes by electron flow, never by a memorised sign — in cells the signs flip, and the flow is the only reliable guide." },
  { type: "diagram", diagramId: "electrolysis-cell", caption: "Ions march to their electrodes" },
  { type: "example", text: "Worked — molten lead bromide: Pb²⁺ reaches the cathode, gains 2e⁻ → grey molten lead metal (Pb²⁺ + 2e⁻ → Pb); Br⁻ reaches the anode, loses e⁻ → pairs into brown bromine vapour (2Br⁻ → Br₂ + 2e⁻). Both observations named, both half-equations written — the full-mark electrolysis answer in one compound." },
  { type: "heading", level: 2, text: "5. Electrolysis rules — predicting the products" },
  { type: "table", headers: ["Solution", "Cathode product", "Anode product", "Because"], rows: [["Concentrated brine (NaCl)", "Hydrogen", "Chlorine", "Less-reactive sodium stays dissolved; concentrated halide beats oxygen"], ["Dilute NaCl / sulfate solutions", "Hydrogen", "Oxygen", "Water discharges both ways"], ["Copper sulfate (Cu electrodes)", "Copper deposits", "Anode dissolves", "Refining: impure anode feeds pure cathode"], ["CuSO₄ (inert electrodes)", "Copper", "Oxygen", "Cu²⁺ less reactive than H₂? no — more, so copper wins; sulfate stays"]] },
  { type: "example", text: "Required practical — brine observations: chlorine at the anode bleaches moist litmus (and smells sharp); hydrogen at the cathode gives the squeaky pop with a lit splint; the solution turns alkaline around the cathode (NaOH forms — sodium hydroxide is the third product of the chlor-alkali industry). Copper sulfate with copper electrodes: the anode visibly SHRINKS as it dissolves, the cathode GROWS pure copper, and the blue colour stays (Cu²⁺ consumed = Cu²⁺ released) — refining in a beaker." },
  { type: "heading", level: 2, text: "6. Industrial electrolysis — aluminium and brine" },
  { type: "paragraph", text: "Aluminium is extracted from molten alumina (Al₂O₃, bauxite) — but its melting point of 2,072 °C would bankrupt any plant, so it dissolves in molten cryolite at ~950 °C: the cryolite lowers the operating temperature, the energy-saving reason every exam wants. Al³⁺ + 3e⁻ → Al at the cathode; oxygen at the carbon anodes burns them away (they must be replaced — the anode reacts: C + O₂ → CO₂). The chlor-alkali industry electrolyses concentrated brine for three products at once: chlorine (water treatment, PVC), hydrogen (fuel, margarine), sodium hydroxide (soap, paper)." },
  { type: "heading", level: 2, text: "7. Electrochemical cells — electricity from chemistry" },
  { type: "paragraph", text: "Flip electrolysis around: a spontaneous redox reaction pushed through a wire IS a current. The zinc-copper cell: zinc (more reactive) oxidises — Zn → Zn²⁺ + 2e⁻ — electrons flow through the wire to the copper half-cell, where Cu²⁺ + 2e⁻ → Cu. A salt bridge completes the circuit by swapping ions between half-cells. The reactivity gap drives the voltage: bigger gap (Mg/Cu), bigger push; similar metals, barely a reading." },
  { type: "paragraph", text: "Batteries are cells in boxes: dry cells (zinc-carbon, then alkaline), button cells, and rechargeable lithium-ion — where the reaction runs FORWARD on discharge and BACKWARD on charge (electrolysis inside the battery). Fuel cells skip the metal entirely: hydrogen + oxygen → water, electricity as the direct product, water as the only emission — the clean-energy answer with its storage cost." },
  { type: "heading", level: 2, text: "8. Corrosion and protection — redox in the weather" },
  { type: "definition", term: "Rusting", text: "Iron + oxygen + water → hydrated iron(III) oxide. BOTH air and water are required — the classic three-test-tube experiment proves it: dry air (no rust), boiled water sealed with oil (no rust), open water (rusts). Rust is flaky and porous, so it flakes off and exposes fresh iron — unlike aluminium's oxide, which seals and protects." },
  { type: "paragraph", text: "Protection is redox management: barrier methods (paint, oil, grease — keeping air and water out), sacrificial protection (bolt a MORE reactive metal — magnesium or zinc — to the hull; it oxidises instead of the iron, and is replaced cheaply), and galvanising (zinc-coating — the zinc protects even when scratched, because it is the more reactive partner). Explaining sacrificial anodes is the mechanism question: the more reactive metal loses electrons preferentially — iron becomes the cathode and cannot rust." },
  { type: "heading", level: 2, text: "9. Summary — the redox spine" },
  { type: "table", headers: ["Setting", "Electron flow", "Energy"], rows: [["Electrolysis", "Forced by the supply: cations gain at cathode, anions lose at anode", "Electricity IN"], ["Cell / battery", "Spontaneous: reactive metal gives, less-reactive ion takes", "Electricity OUT"], ["Displacement", "More reactive metal kicks less from its salt", "Heat (often)"], ["Corrosion", "Iron oxidises with O₂ + H₂O", "Metal lost"]] },
  { type: "callout", variant: "warning", text: "Exam trap: in ELECTROLYSIS the anode is positive; in CELLS the signs flip. Never memorise — label by electron flow: loss at the anode ALWAYS (both settings), gain at the cathode ALWAYS. The sign is the variable; the flow is the rule." },
];

const ELEC_QS: Q[] = [
  { q: "The oxidation number of Mn in MnO₄⁻ is", o: ["+4", "+6", "+7", "−1"], a: "+7", e: "Four O give −8; ion totals −1; Mn = +7. Sum rule finds it.", d: "medium" },
  { q: "In Cl₂ + 2KBr → 2KCl + Br₂, the species oxidised is", o: ["chlorine", "bromide ions (−1 → 0, loss)", "potassium", "no one"], a: "bromide ions (−1 → 0, loss)", e: "OILRIG: loss of electrons = oxidation — displacement is redox.", d: "easy" },
  { q: "The balanced half-equation for MnO₄⁻ → Mn²⁺ in acid is", o: ["MnO₄⁻ + 4H⁺ + e⁻ → Mn²⁺ + 2H₂O", "MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O", "MnO₄⁻ + 5e⁻ → Mn²⁺", "MnO₄⁻ → Mn²⁺ + 2O₂"], a: "MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O", e: "O with water, H with acid, charge with electrons — in that order.", d: "hard" },
  { q: "Electrolysing molten lead bromide gives at the cathode", o: ["bromine vapour", "grey molten lead — Pb²⁺ + 2e⁻ → Pb", "hydrogen", "sodium"], a: "grey molten lead — Pb²⁺ + 2e⁻ → Pb", e: "Cations gain electrons (reduction) at the cathode.", d: "easy" },
  { q: "Concentrated brine electrolysis gives", o: ["Na at the cathode", "hydrogen + chlorine + sodium hydroxide", "oxygen at both electrodes", "chlorine only"], a: "hydrogen + chlorine + sodium hydroxide", e: "Chlor-alkali: three products — H₂, Cl₂, NaOH.", d: "medium" },
  { q: "Cryolite is added to aluminium extraction to", o: ["feed the aluminium", "dissolve alumina at ~950 °C instead of 2,072 °C — saving energy", "purify the product", "colour the metal"], a: "dissolve alumina at ~950 °C instead of 2,072 °C — saving energy", e: "The energy-saving reason every exam wants.", d: "medium" },
  { q: "In copper refining with copper electrodes, the blue colour", o: ["fades — Cu²⁺ consumed", "stays — Cu²⁺ consumed at the cathode equals Cu²⁺ released at the anode", "darkens steadily", "disappears instantly"], a: "stays — Cu²⁺ consumed at the cathode equals Cu²⁺ released at the anode", e: "The anode shrinks, the cathode grows — refining in a beaker.", d: "medium" },
  { q: "A zinc-copper cell's voltage comes from", o: ["the electrolyte's strength", "the reactivity gap driving electron flow through the wire", "the salt bridge's ions", "the electrodes' size"], a: "the reactivity gap driving electron flow through the wire", e: "Bigger gap, bigger push — Mg/Cu beats Zn/Cu.", d: "medium" },
  { q: "Rusting requires", o: ["water only", "oxygen only", "both oxygen and water", "carbon dioxide"], a: "both oxygen and water", e: "The three-test-tube experiment: each alone is not enough.", d: "easy" },
  { q: "A magnesium block bolted to a steel hull protects it because magnesium", o: ["is waterproof", "is more reactive — it oxidises preferentially, making iron the cathode", "is cheaper paint", "blocks salt water"], a: "is more reactive — it oxidises preferentially, making iron the cathode", e: "Sacrificial protection is redox management — replace the anode, save the hull.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "electrochemistry" } });
    if (!topic) throw new Error("master electrochemistry topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("electrochemistry standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Electrochemistry — Complete", content: { blocks: ELEC_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < ELEC_QS.length; i++) {
      const item = ELEC_QS[i];
      await prisma.question.upsert({
        where: { id: `master-electrochemistry-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-electrochemistry-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "electro-rebuild", blocks: ELEC_BLOCKS.length, questions: ELEC_QS.length });
  } catch (e) {
    console.error("rebuild electro failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
