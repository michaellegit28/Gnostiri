import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Chemistry Topic 3: Stoichiometry & The Mole at the
// no-exceptions bar: the calculation topic, worked at every step.

const STOICH_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. The mole — chemistry's counting unit" },
  { type: "definition", term: "Mole", text: "6.02 × 10²³ particles (Avogadro's number). One mole of any substance weighs its relative formula mass in grams: 1 mol H₂O = 18 g; 1 mol NaOH = 40 g; 1 mol Mg = 24 g. The mole is the bridge between atoms you cannot count and powders you can weigh — every calculation in chemistry routes through it." },
  { type: "diagram", diagramId: "mole-triangle", caption: "All roads through n" },
  { type: "example", text: "Worked conversions: 80 g NaOH (Mr = 40) → moles = mass ÷ Mr = 80 ÷ 40 = 2 mol. 0.5 mol of carbon → particles = 0.5 × 6.02×10²³ = 3.01×10²³ atoms. 1.204×10²⁴ molecules of water → moles = 1.204×10²⁴ ÷ 6.02×10²³ = 2 mol → mass = 2 × 18 = 36 g. The triangle routes every direction: mass ↔ n ↔ particles, gas volume, solution concentration." },
  { type: "heading", level: 2, text: "2. Empirical and molecular formulae" },
  { type: "paragraph", text: "Empirical formula = the simplest whole-number ratio; molecular = the true count. Method: % composition → ÷ atomic masses → ÷ smallest → ratio (round if within 0.1). Then molecular = empirical × (Mr ÷ empirical mass)." },
  { type: "example", text: "Worked: a compound is 40.0% C, 6.7% H, 53.3% O. ÷ masses: C 40/12 = 3.33; H 6.7/1 = 6.7; O 53.3/16 = 3.33. ÷ smallest (3.33): C 1, H 2.01, O 1 → CH₂O. Given Mr = 180: empirical mass = 12+2+16 = 30; 180/30 = 6 → C₆H₁₂O₆ — glucose. Show both steps: the ratio AND the scale-up are separate method marks." },
  { type: "heading", level: 2, text: "3. Reacting masses — balance first, moles second" },
  { type: "paragraph", text: "Moles only work on BALANCED equations — the ratio is the recipe. Method: balance → convert given masses to moles → apply the equation ratio → convert back to grams." },
  { type: "example", text: "Worked: 2Mg + O₂ → 2MgO. What mass of O₂ reacts with 12 g of Mg (Ar = 24), and what mass of MgO forms? Moles Mg = 12/24 = 0.5 mol. Ratio 2:1 → O₂ needed = 0.25 mol = 0.25 × 32 = 8 g. Ratio 2:2 → MgO made = 0.5 mol = 0.5 × 40 = 20 g. Line by line: moles in, ratio, moles out, mass — the four-beat that answers every reacting-mass question." },
  { type: "definition", term: "Limiting reagent", text: "The reactant that runs out first caps the yield — the other is in excess. Find it: convert both to moles, divide each by its equation coefficient, the smaller result limits. Everything after is computed from the limiter." },
  { type: "example", text: "Worked: 4 g H₂ (Mr 2) + 32 g O₂ (Mr 32) → 2H₂O. Moles H₂ = 2, O₂ = 1. Divide by coefficients: H₂ 2/2 = 1, O₂ 1/1 = 1 — equal? No: ratio is 2H₂:1O₂, so 2 mol H₂ needs 1 mol O₂ exactly — neither is limiting, complete reaction makes 2 mol water = 36 g. Had we started with 6 g H₂: 3 mol ÷ 2 = 1.5 > 1 → O₂ limits; product = 2 × 18 = 36 g from 1 mol O₂ only." },
  { type: "heading", level: 2, text: "4. Gas volumes — Avogadro's law at work" },
  { type: "paragraph", text: "One mole of ANY gas occupies 24 dm³ at room temperature and pressure (rtp) — equal moles, equal volumes, whatever the gas. n = volume ÷ 24 (volume in dm³)." },
  { type: "example", text: "Worked: 0.25 mol O₂ occupies 0.25 × 24 = 6 dm³. Reacting gas volumes need no masses at all: in CH₄ + 2O₂ → CO₂ + 2H₂O, burning 100 cm³ of methane needs 200 cm³ of O₂ and makes 100 cm³ of CO₂ — the equation's ratio IS the volume ratio for gases (equal-mole law). State rtp for full marks: volumes change with temperature and pressure." },
  { type: "heading", level: 2, text: "5. Solutions — concentration bookkeeping" },
  { type: "definition", term: "Concentration", text: "mol/dm³. Moles = concentration × volume(dm³). The cm³ → dm³ conversion (÷1000) comes FIRST — the single most-dropped mark in titration maths. Grams per dm³ converts via Mr: mol/dm³ × Mr = g/dm³." },
  { type: "example", text: "Worked: 25 cm³ of 2 mol/dm³ NaOH → moles = 2 × (25/1000) = 0.05 mol. Mass = 0.05 × 40 = 2 g. Reverse: 0.05 mol in 250 cm³ → concentration = 0.05 ÷ 0.25 = 0.2 mol/dm³. Every solution question: convert volume, multiply or divide by moles — the triangle again." },
  { type: "heading", level: 2, text: "6. Titration — the required practical" },
  { type: "example", text: "Method: rinse the burette with the acid it will hold (residue would dilute yours); fill and read the meniscus at eye level. Pipette exactly 25.0 cm³ of alkali into a conical flask with 2–3 drops of indicator (phenolphthalein pink in alkali, colourless in acid; methyl orange red→yellow). Add acid from the burette, swirling, until the FIRST permanent colour change — near the endpoint add drop by drop. Repeat until concordant (within ±0.10 cm³) and average ONLY the concordant titres — an outlier poisons the mean. Why indicator choice matters: strong acid-weak alkali wants methyl orange; weak acid-strong alkali wants phenolphthalein." },
  { type: "example", text: "Worked titration calculation: 25.0 cm³ NaOH titrated against 0.100 mol/dm³ HCl; mean titre 20.0 cm³. Moles HCl = 0.100 × 0.0200 = 0.00200 mol. Equation HCl + NaOH → NaCl + H₂O, ratio 1:1 → moles NaOH = 0.00200 in 0.025 dm³ → concentration = 0.002 ÷ 0.025 = 0.080 mol/dm³. Six beats: moles acid, ratio, moles alkali, volume, concentration — and the concordant rule before any of it." },
  { type: "heading", level: 2, text: "7. Yield — what you got against what you should" },
  { type: "definition", term: "Percentage yield", text: "actual mass ÷ theoretical mass × 100. Theoretical comes from the reacting-mass method assuming complete reaction. Yields fall short: transfers lose product on glassware, side reactions waste reactants, reversible reactions never finish, purification discards impure fractions." },
  { type: "example", text: "Worked: the reacting-mass method says 20 g of MgO should form; you isolate 15 g. Percentage yield = 15/20 × 100 = 75%. A yield ABOVE 100% means the product is wet or impure — 'impossible yield' is itself an exam answer about experimental error." },
  { type: "heading", level: 2, text: "8. Atom economy — the green-chemistry score" },
  { type: "definition", term: "Atom economy", text: "mass of desired product ÷ total mass of reactants × 100 (from the equation's formula masses — no experiment needed). It measures how much of the reactant mass ends up in the useful product — high economy wastes less, costs less, pollutes less." },
  { type: "example", text: "Worked: fermentation C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂. Desired ethanol: 2 × 46 = 92. Total reactants: 180. Atom economy = 92/180 × 100 ≈ 51%. The CO₂ is waste mass. Compare routes: ethanol from ethene + water (C₂H₄ + H₂O → C₂H₅OH) has economy 46/46 = 100% — every atom lands in product. Green-chemistry essays weigh economy against renewable feedstock (fermentation is renewable; ethene is cracked crude)." },
  { type: "heading", level: 2, text: "9. Summary — the calculation spine" },
  { type: "table", headers: ["Question type", "Method beats", "Trap to dodge"], rows: [["Moles from mass", "mass ÷ Mr", "Wrong Mr (2 for H₂, 32 for O₂)"], ["Reacting masses", "balance → moles → ratio → mass", "Ratio misread from unbalanced equation"], ["Gas volumes", "n × 24 (rtp)", "cm³ not converted"], ["Titration", "moles → ratio → conc", "Averaging non-concordant titres"], ["Yield", "actual/theoretical × 100", "Theoretical from unbalanced equation"], ["Atom economy", "desired ÷ total × 100", "Using experimental masses instead of formula masses"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'calculate' shows working + units every line; 'determine the limiting reagent' shows both ÷coefficient comparisons; 'explain' names the trap (conversion, ratio, concordance). Stoichiometry is method-mark banking — the answer alone scores half." },
];

const STOICH_QS: Q[] = [
  { q: "80 g of NaOH (Mr = 40) contains", o: ["2 mol", "0.5 mol", "40 mol", "3200 mol"], a: "2 mol", e: "mass ÷ Mr = 80/40.", d: "easy" },
  { q: "A compound is 40.0% C, 6.7% H, 53.3% O (Mr = 180). Its molecular formula is", o: ["CH₂O", "C₂H₄O₂", "C₆H₁₂O₆", "C₃H₆O₃"], a: "C₆H₁₂O₆", e: "Ratio CH₂O (mass 30), scale-up 180/30 = 6.", d: "medium" },
  { q: "In 2Mg + O₂ → 2MgO, the O₂ mass reacting with 12 g Mg (Ar 24) is", o: ["4 g", "8 g", "16 g", "32 g"], a: "8 g", e: "0.5 mol Mg → 0.25 mol O₂ = 8 g. Ratio 2:1.", d: "medium" },
  { q: "6 g H₂ + 32 g O₂ react. The limiting reagent is", o: ["H₂", "O₂", "neither — complete reaction", "water"], a: "O₂", e: "3 mol H₂ (÷2 = 1.5) exceeds 1 mol O₂ (÷1 = 1) — O₂ caps the yield.", d: "hard" },
  { q: "0.25 mol of any gas at rtp occupies", o: ["6 dm³", "24 dm³", "12 dm³", "0.6 dm³"], a: "6 dm³", e: "n × 24 at room temperature and pressure.", d: "easy" },
  { q: "Burning 100 cm³ of methane (CH₄ + 2O₂ → CO₂ + 2H₂O) needs oxygen of", o: ["50 cm³", "100 cm³", "200 cm³", "400 cm³"], a: "200 cm³", e: "Gas ratio = equation ratio: 1:2 — Avogadro's law.", d: "medium" },
  { q: "25 cm³ of 2 mol/dm³ NaOH contains", o: ["0.05 mol", "50 mol", "0.5 mol", "2 mol"], a: "0.05 mol", e: "2 × 0.025 dm³. Convert cm³ FIRST — the classic trap.", d: "medium" },
  { q: "25.0 cm³ NaOH titrated against 0.100 M HCl, mean titre 20.0 cm³. NaOH concentration is", o: ["0.080 mol/dm³", "0.125 mol/dm³", "0.050 mol/dm³", "0.200 mol/dm³"], a: "0.080 mol/dm³", e: "0.002 mol HCl, 1:1 ratio, ÷ 0.025 dm³.", d: "hard" },
  { q: "A yield of 105% means", o: ["excellent technique", "the product is wet or impure — mass includes something extra", "the theoretical was miscalculated upward", "the reaction exceeded conservation"], a: "the product is wet or impure — mass includes something extra", e: "Actual cannot exceed theoretical — error, not success.", d: "medium" },
  { q: "Fermentation C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂ has atom economy", o: ["100%", "≈51%", "75%", "92%"], a: "≈51%", e: "92/180 — the CO₂ is waste mass; ethene route scores 100%.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "stoichiometry-mole" } });
    if (!topic) throw new Error("master stoichiometry topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("stoichiometry standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Stoichiometry & The Mole — Complete", content: { blocks: STOICH_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < STOICH_QS.length; i++) {
      const item = STOICH_QS[i];
      await prisma.question.upsert({
        where: { id: `master-stoichiometry-mole-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-stoichiometry-mole-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "stoichiometry-rebuild", blocks: STOICH_BLOCKS.length, questions: STOICH_QS.length });
  } catch (e) {
    console.error("rebuild stoich failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
