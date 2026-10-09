import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Chemistry Topic 2: Chemical Bonding at the no-exceptions bar:
// ionic, covalent (simple + giant), metallic, shapes, polarity, intermolecular.

const BOND_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Why atoms bond — one drive, three routes" },
  { type: "paragraph", text: "Atoms bond to reach noble-gas stability: a full outer shell. Three routes get there — transfer electrons (metal + non-metal → ionic), share pairs (non-metal + non-metal → covalent), or pool electrons into a common sea (metal + metal → metallic). How the stability is reached decides every property of the substance: melting point, conductivity, solubility. The exam skill is reading properties backwards to structure." },
  { type: "heading", level: 2, text: "2. Ionic bonding — transfer and lattice" },
  { type: "example", text: "Worked transfers: Na (2,8,1) gives its one outer electron to Cl (2,8,7) → Na⁺ (2,8) and Cl⁻ (2,8,8). Mg (2,8,2) gives two to O (2,6) → Mg²⁺ and O²⁻. Charges write the formula by crossing: Mg²⁺ + O²⁻ → MgO; Al³⁺ + O²⁻ → Al₂O₃ (two aluminiums balance three oxides). Dot-and-cross diagrams show the movement — draw them for the method marks." },
  { type: "paragraph", text: "The ions lock into a giant 3D lattice: each Na⁺ gripped by six Cl⁻ and vice versa. Properties follow: high melting points (many strong electrostatic bonds to break), conduction only when molten or dissolved (ions free to move to electrodes — solid ions are locked), brittleness (a shifted layer puts like charges together and the lattice shatters). MgO melts near 2,800 °C against NaCl's 801 °C — doubly-charged ions grip harder than singly-charged; the exam wants that reasoning, not the temperatures alone." },
  { type: "heading", level: 2, text: "3. Covalent — simple molecules" },
  { type: "paragraph", text: "Non-metals share pairs: single (H₂, Cl₂, the two C–H bonds of methane's four), double (O₂, CO₂), triple (N₂ — the strongest common bond). Simple molecules melt and boil easily because between the molecules sit only weak intermolecular forces — the strong covalent bonds do NOT break when ice melts, only the weak attractions between molecules. No free electrons or ions means no conduction — except graphite's special case below." },
  { type: "heading", level: 2, text: "4. Giant covalent — three architectures of carbon and silicon" },
  { type: "table", headers: ["", "Diamond", "Graphite", "Silica (SiO₂)"], rows: [["Network", "Each C bonded to 4 others, 3D", "Hexagonal layers, weak forces between", "Si–O network, like a 3D lattice"], ["Properties", "Hardest natural solid; insulator; very high m.p.", "Soft, slippery; conducts along layers", "Hard, high m.p., insulator"], ["Because", "Strong bonds must break to melt/move", "Layers slide (weak between); one delocalised electron per C roams each layer", "Network covalent, no free electrons"], ["Uses", "Cutting, drilling", "Pencils, electrodes, lubricant", "Refractory linings, glass"]] },
  { type: "paragraph", text: "Graphite is the exam's favourite case study: SAME element as diamond, opposite properties — because the bonding arrangement differs. Its delocalised electrons conduct along layers; its sliding layers lubricate pencils; its strong in-layer bonds keep the high melting point. Both are allotropes of carbon — same atoms, different architecture." },
  { type: "heading", level: 2, text: "5. Molecular shapes — VSEPR" },
  { type: "paragraph", text: "Electron pairs repel and spread as far apart as possible — VSEPR (valence shell electron pair repulsion) predicts every shape. Bonding pairs and lone pairs both count; lone pairs repel MORE (they sit closer to the nucleus), squeezing bond angles down:" },
  { type: "table", headers: ["Molecule", "Pairs (bonding/lone)", "Shape", "Angle"], rows: [["CH₄", "4 / 0", "Tetrahedral", "109.5°"], ["NH₃", "3 / 1", "Pyramidal", "107°"], ["H₂O", "2 / 2", "Bent (V-shaped)", "104.5°"], ["CO₂", "2 double bonds / 0", "Linear", "180°"]] },
  { type: "diagram", diagramId: "molecular-shapes", caption: "Lone pairs squeeze the angles" },
  { type: "callout", variant: "warning", text: "Exam trap: the angle ladder is 109.5° → 107° → 104.5° as lone pairs squeeze. State WHY (lone pairs repel more) — the angle without the reason scores half." },
  { type: "heading", level: 2, text: "6. Polarity — electronegativity's tug of war" },
  { type: "paragraph", text: "Electronegativity is an atom's pull on shared electrons. A difference makes the bond polar: the bigger puller carries δ−, the other δ+ (O–H, N–H, C–Cl). But bond polarity ≠ molecule polarity: CO₂'s bonds are polar yet its linear symmetry cancels them — non-polar molecule; H₂O's bent shape leaves the dipoles unbalanced — strongly polar molecule. That one distinction explains water's solvent power (it clusters around ions and polar molecules), its high boiling point, and why oil (non-polar) refuses it." },
  { type: "heading", level: 2, text: "7. Metallic bonding — the electron sea" },
  { type: "paragraph", text: "Metal ions sit in a shared sea of delocalised outer electrons. The sea carries current and heat (conduction), lets layers slide without shattering (malleable, ductile), and holds the lattice together strongly (high melting points). Alloys disrupt the uniform layers with differently-sized atoms — steel's carbon jams the slip planes, making it harder and less malleable than iron: the exam wants the jammed-layers reasoning." },
  { type: "heading", level: 2, text: "8. Intermolecular forces — weak forces, big consequences" },
  { type: "paragraph", text: "Three strengths, in order: hydrogen bonding (H on N, O, F — the strongest), dipole-dipole (between polar molecules), dispersion/London forces (instantaneous dipoles — all molecules, stronger as molecules grow). Hydrogen bonding explains water's anomalies: boiling far above its group trend (H₂O liquid while H₂S is gas — O is more electronegative and bent), ice floating (open lattice), and DNA's base pairing. Melting ice breaks only these weak forces — never the covalent O–H bonds; examiners set that trap every year." },
  { type: "heading", level: 2, text: "9. Required practical — conductivity and melting" },
  { type: "example", text: "Test each substance as solid, molten, and aqueous with a lamp circuit: NaCl conducts when molten and dissolved (ions free), not solid (locked); wax never (covalent molecules, no charged particles); copper always (electron sea); graphite along its layers only. Each result traces to structure — the answer is never 'because it conducts' but WHICH particles move and WHY they can. Melting-point comparison alongside: MgO high (double charges), NaCl lower (single), wax low (weak forces), diamond extreme (network covalent)." },
  { type: "heading", level: 2, text: "10. Summary — read properties backwards to structure" },
  { type: "table", headers: ["Observation", "Structure conclusion", "Reasoning phrase"], rows: [["High m.p., conducts molten/aqueous", "Giant ionic lattice", "Strong electrostatic bonds; mobile ions"], ["Low m.p., never conducts", "Simple molecular", "Weak intermolecular forces break; no charged particles"], ["Conducts always, malleable", "Metallic", "Delocalised electron sea; sliding layers"], ["Extreme m.p., insulator", "Giant covalent", "Network bonds must break to melt"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'explain why MgO has a higher melting point than NaCl' needs BOTH charges compared (2+/2− vs 1+/1−) and the consequence (stronger attraction, more energy to break). Property comparisons are always relative reasoning, never lists." },
];

const BOND_QS: Q[] = [
  { q: "MgO melts near 2,800 °C while NaCl melts at 801 °C because", o: ["MgO is molecular", "Mg²⁺ and O²⁻ are doubly charged — stronger lattice attraction", "oxygen is heavier", "NaCl has more electrons"], a: "Mg²⁺ and O²⁻ are doubly charged — stronger lattice attraction", e: "Charge comparison is the reasoning, not the temperature.", d: "medium" },
  { q: "Graphite conducts electricity but diamond does not because graphite has", o: ["free ions", "one delocalised electron per carbon roaming between layers", "no bonds", "metallic bonds"], a: "one delocalised electron per carbon roaming between layers", e: "Diamond's four bonds lock every electron in place.", d: "easy" },
  { q: "The bond angle in H₂O (104.5°) is smaller than CH₄'s (109.5°) because", o: ["oxygen is heavier", "two lone pairs repel more than bonding pairs, squeezing the angle", "hydrogen is small", "water is polar"], a: "two lone pairs repel more than bonding pairs, squeezing the angle", e: "VSEPR: lone pairs sit closer and repel harder.", d: "medium" },
  { q: "CO₂'s bonds are polar yet the molecule is non-polar because", o: ["carbon cancels oxygen", "its linear symmetry cancels the bond dipoles", "it has no electrons", "oxygen is weak"], a: "its linear symmetry cancels the bond dipoles", e: "H₂O's bent shape leaves dipoles unbalanced — polar.", d: "hard" },
  { q: "NaCl conducts electricity when", o: ["solid only", "molten or dissolved — ions become mobile", "never", "in every state"], a: "molten or dissolved — ions become mobile", e: "Solid ions are locked in the lattice.", d: "easy" },
  { q: "Al₂O₃ is the formula for aluminium oxide because", o: ["aluminium is diatomic", "crossing charges: Al³⁺ × O²⁻ balances two aluminiums with three oxides", "oxygen comes in threes", "aluminium has 2 electrons"], a: "crossing charges: Al³⁺ × O²⁻ balances two aluminiums with three oxides", e: "6+ and 6− balance — the crossing rule.", d: "medium" },
  { q: "Ice melting breaks", o: ["covalent O–H bonds", "only weak intermolecular forces between molecules", "hydrogen nuclei", "nothing"], a: "only weak intermolecular forces between molecules", e: "The strong bonds survive; the weak attractions do not.", d: "medium" },
  { q: "Steel is harder than pure iron because carbon atoms", o: ["add electrons", "jam the sliding layers of the electron sea", "remove ions", "cool the lattice"], a: "jam the sliding layers of the electron sea", e: "Different-sized atoms disrupt the slip planes.", d: "medium" },
  { q: "A substance with a very high melting point that never conducts is likely", o: ["ionic", "giant covalent", "metallic", "simple molecular"], a: "giant covalent", e: "Network bonds must break to melt; no mobile charged particles.", d: "medium" },
  { q: "Water dissolves ionic compounds because it is", o: ["non-polar", "polar — its dipoles cluster around the ions", "hot", "hydrogen itself"], a: "polar — its dipoles cluster around the ions", e: "δ− oxygen faces cations; δ+ hydrogens face anions.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "chemical-bonding" } });
    if (!topic) throw new Error("master chemical-bonding topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("chemical-bonding standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Chemical Bonding — Complete", content: { blocks: BOND_BLOCKS } as object, estimatedMinutes: 50 } });
    for (let i = 0; i < BOND_QS.length; i++) {
      const item = BOND_QS[i];
      await prisma.question.upsert({
        where: { id: `master-chemical-bonding-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-chemical-bonding-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "bonding-rebuild", blocks: BOND_BLOCKS.length, questions: BOND_QS.length });
  } catch (e) {
    console.error("rebuild bonding failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
