import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Biology Topic 2: Bioenergetics & Biochemistry standard chapter
// upgraded to the no-exceptions bar with required practicals, calculations, exam style.

const BIOEN_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Water — the medium of metabolism" },
  { type: "paragraph", text: "Water's polarity — oxygen pulling electrons from two hydrogens — makes it biology's solvent: ions and polar molecules dissolve by clustering their charges against it, while long non-polar tails (fats, membrane interiors) are excluded. The same hydrogen bonding gives water a high specific heat (thermal buffer for cells and blood), high latent heat of vaporisation (sweating cools powerfully), strong cohesion–adhesion (the transpiration stream's continuous column, and capillary rise), and the density anomaly — ice floats, insulating the lake beneath so aquatic life survives winter." },
  { type: "definition", term: "Metabolic water roles", text: "Water is not just a venue: hydrolysis spends a water to break bonds (digestion of every polymer), condensation releases one to build them (every polymerisation). Dehydration stops enzymes within minutes because they need a hydration shell to hold shape — structure is function even at the solvent level." },
  { type: "paragraph", text: "pH is hydrogen-ion bookkeeping: pH = −log₁₀[H⁺], so each unit is tenfold. Blood's 7.4, guarded by the bicarbonate pair (H₂CO₃ ⇌ HCO₃⁻ + H⁺) and phosphate buffers inside cells, keeps enzymes within their narrow optima — pancreatic amylase dies in stomach acid; pepsin dies in the duodenum. Buffer questions are equilibrium questions: added acid is consumed by the conjugate base, added base by the weak acid." },
  { type: "heading", level: 2, text: "2. Macromolecules I — carbohydrates" },
  { type: "table", headers: ["Class", "Bond", "Examples and jobs"], rows: [["Monosaccharides", "—", "Glucose (fuel), fructose (fruit), galactose (milk)"], ["Disaccharides", "Glycosidic", "Maltose (germinating seed), sucrose (transport sugar), lactose (milk)"], ["Storage polysaccharides", "Glycosidic", "Starch (amylose helix + amylopectin branched; plants), glycogen (densely branched; animals' liver and muscle)"], ["Structural polysaccharides", "Glycosidic", "Cellulose (straight β-glucose chains, H-bonded bundles), chitin (insect exoskeletons, fungi walls)"]] },
  { type: "paragraph", text: "Benedict's test (reducing sugars → brick-red on heating) and iodine (starch → blue-black) are required-practical regulars. Structure explains function: glycogen branches at every 8–12 residues for instant glucose release; cellulose's alternately-flipped glucose makes straight, hydrogen-bonded microfibrils that resist tension — humans cannot digest the β-bond, which is exactly what 'dietary fibre' means." },
  { type: "heading", level: 2, text: "3. Macromolecules II — lipids, proteins, nucleic acids" },
  { type: "paragraph", text: "Lipids: one glycerol + three fatty acids joined by ester bonds. Saturated chains pack straight and solidify (butter); cis-unsaturated kink and stay fluid (oils) — membrane fluidity depends on the mix, and trans fats behave unnaturally like saturation. Phospholipids swap one fatty acid for a phosphate head: amphipathic, so they self-assemble into bilayers — the membrane from nothing but geometry. Steroids (cholesterol, hormones) are fused four-ring lipids." },
  { type: "paragraph", text: "Proteins are sequences of 20 amino acids joined by peptide bonds: primary (order — dictated by DNA), secondary (α-helix, β-pleated sheet — hydrogen bonds), tertiary (3D fold — ionic, hydrophobic, disulfide bridges), quaternary (subunits, as in haemoglobin's four chains). Denaturation breaks secondary and tertiary bonds: heat shakes them apart, extreme pH re-ionises them — the primary sequence survives but the function is gone, which is why a cooked egg never uncooks." },
  { type: "paragraph", text: "Nucleic acids: nucleotide = pentose + phosphate + nitrogenous base. Purines A and G (two rings) pair with pyrimidines T/U and C (one ring): DNA keeps deoxyribose and thymine for archival fidelity, RNA uses ribose and uracil for disposable messages; phosphodiester bonds chain the sugars into a directionality every exam requires." },
  { type: "heading", level: 2, text: "4. Enzymes — catalysis mastered" },
  { type: "definition", term: "Core model", text: "Enzymes lower activation energy by stabilising the transition state at an active site; the lock-and-key picture is refined by induced fit — the site moulds around the substrate, straining its bonds toward the change. Catalysts emerge unchanged, so few enzymes service thousands of reactions per second." },
  { type: "paragraph", text: "Kinetics: rate vs temperature doubles to an optimum then collapses as denaturation spreads; rate vs pH is a narrow peak; rate vs substrate rises hyperbolically to Vmax (all sites busy), and Michaelis–Menten's Km is the substrate concentration at half-Vmax — high Km means weak binding, low Km means strong (the Advanced chapter derives this fully). Competitive inhibitors raise Km only; non-competitive lower Vmax only — one graph, one diagnosis, a guaranteed exam item." },
  { type: "diagram", diagramId: "enzyme-optimum", caption: "Optimum and denaturation" },
  { type: "example", text: "Required practical — enzyme rate: amylase + starch at controlled temperatures, sampling with iodine until the blue-black fails. Controls: pH buffer (same every tube), volumes, enzyme concentration, timing method. Plot time-to-endpoint or rate = 1/t. State WHY each control: uncontrolled pH would confound temperature's effect — examiners award the reason, not the list." },
  { type: "diagram", diagramId: "michaelis-menten", caption: "Vmax and Km" },
  { type: "heading", level: 2, text: "5. Thermodynamics and the ATP economy" },
  { type: "paragraph", text: "First law: energy is conserved. Second law: every transfer sheds usable order (entropy rises) — so life's order is a loan, repaid by the sun through photosynthesis and burned by respiration. ΔG (Gibbs free energy) signs the direction: exergonic reactions (negative ΔG) proceed spontaneously, endergonic ones (positive ΔG) must be driven." },
  { type: "definition", term: "Energy coupling", text: "Cells pair an endergonic reaction with ATP hydrolysis (ΔG ≈ −30.5 kJ/mol): glucose phosphorylation, muscle contraction, and active transport all spend ATP. Adenine + ribose + three mutually-repelling phosphates make the terminal bond spring-loaded; ATP → ADP releases energy and the cell recharges it — humans recycle roughly their own body mass in ATP each day." },
  { type: "diagram", diagramId: "atp-cycle", caption: "The ATP cycle" },
  { type: "heading", level: 2, text: "6. Respiration — the complete ledger" },
  { type: "table", headers: ["Stage", "Location", "Per glucose"], rows: [["Glycolysis (investment + payoff)", "Cytoplasm", "2 ATP net, 2 NADH, 2 pyruvate"], ["Link reaction", "Matrix", "2 CO₂, 2 NADH"], ["Krebs cycle (2 turns)", "Matrix", "4 CO₂, 6 NADH, 2 FADH₂, 2 ATP"], ["Oxidative phosphorylation", "Cristae", "NADH ≈ 2.5 ATP each, FADH₂ ≈ 1.5 → ~26–28 ATP"], ["Total (aerobic)", "—", "30–32 ATP from one glucose"]] },
  { type: "paragraph", text: "Chemiosmosis is the heart to explain: NADH and FADH₂ donate high-energy electrons to the chain (complexes I–IV), pumped protons accumulate in the intermembrane space, and the proton-motive force drives ATP synthase's rotor as protons stream back. Oxygen is the terminal acceptor — binding the spent electrons to form water, keeping the chain open. Cyanide blocks complex IV: the chain dams, ATP collapses, and death follows in minutes — a mechanism examiners love because it proves the model." },
  { type: "diagram", diagramId: "respiration-map", caption: "Respiration roadmap" },
  { type: "paragraph", text: "Without oxygen, only glycolysis pays. To keep it running, NADH must offload its cargo: animal muscle reduces pyruvate to lactate (the oxygen debt, later reoxidised in the liver), yeast decarboxylates to acetaldehyde then reduces it to ethanol + CO₂ — brewing and baking. Two ATP per glucose is survival, not prosperity: the whole fermentation story is regenerating NAD⁺, not making product." },
  { type: "example", text: "Required practical — the respirometer: organisms in a sealed chamber with soda lime (absorbs the CO₂ they exhale), so the coloured droplet's slide measures oxygen uptake alone. Rate = distance × πr² ÷ time. Controls: same temperature (volume changes mimic uptake), mass of organism. Germinating vs boiled seeds make the comparison: dead seeds do not respire — the droplet is still." },
  { type: "diagram", diagramId: "mitochondrion", caption: "Where each stage lives" },
  { type: "heading", level: 2, text: "7. Photosynthesis — capturing light" },
  { type: "paragraph", text: "Chloroplast anatomy assigns the stages: thylakoid membranes carry the light reactions (chlorophyll a at reaction centres, chlorophyll b and carotenoids as accessory pigments broadening the spectrum and quenching excess energy). An absorption spectrum records what pigments take; an action spectrum records what actually drives photosynthesis — the near-match is evidence pigments are the machinery." },
  { type: "paragraph", text: "Light reactions: PSII photolyses water (electrons, protons, O₂ as waste), electrons pass the chain pumping protons into the lumen, PSI re-energises them for NADP⁺ → NADPH, and ATP synthase spends the gradient — non-cyclic flow makes both ATP and NADPH in the ratio Calvin needs; cyclic flow (PSI only) tops up ATP. The Calvin cycle in the stroma fixes CO₂ onto RuBP via RuBisCO (the world's most abundant protein — and slowest, 3 CO₂ per second), reduces the product with NADPH and ATP to G3P, and regenerates RuBP." },
  { type: "diagram", diagramId: "photosynthesis-map", caption: "Light reactions feed Calvin" },
  { type: "paragraph", text: "Limiting factors follow Blackman: rate rises with light, CO₂, or temperature only while another factor hasn't taken over — graph plateaus tell you which. C4 plants (maize) pre-pump CO₂ into bundle-sheath cells, spatially separating it from RuBisCO's oxygen mistake; CAM plants (cacti) fix CO₂ at night into acids, opening stomata when cool — two answers to the same drought problem. Explaining photorespiration as an oxygenase error is the differentiator mark." },
  { type: "example", text: "Required practical — photosynthesis evidence: destarch a plant in darkness (leaves consume stored starch), foil-cover half a leaf, illuminate, then iodine: only the uncovered half turns blue-black, proving light is required for starch production. The paired halves control every variable except light — the examiner's ideal design." },
  { type: "diagram", diagramId: "chloroplast", caption: "Grana and stroma" },
  { type: "heading", level: 2, text: "8. Summary — the two pathways compared" },
  { type: "table", headers: ["", "Respiration", "Photosynthesis"], rows: [["Direction", "Glucose broken, energy released (exergonic)", "Glucose built, light supplies the energy (endergonic)"], ["Electron carrier", "NAD⁺ → NADH", "NADP⁺ → NADPH"], ["Inputs", "Glucose + O₂", "CO₂ + H₂O + light"], ["Outputs", "CO₂ + H₂O + ~30 ATP", "Glucose + O₂"], ["Chemiosmosis site", "Mitochondrial cristae", "Thylakoid membrane"], ["Same trick both use", "Electron transport pumping protons through ATP synthase — chemiosmosis is life's one energy currency converter"]] },
  { type: "callout", variant: "warning", text: "Exam trap: ATP is made by chemiosmosis in BOTH pathways (photophosphorylation is chemiosmosis with light-charged electrons). And oxygen is photosynthesis's waste, not its goal — respiration's product is ATP, not CO₂. Keep the inputs/outputs straight on both sides." },
];

const BIOEN_QS: Q[] = [
  { q: "Water's high specific heat is caused by", o: ["its low mass", "hydrogen bonds resisting molecular motion", "dissolved salts", "its acidity"], a: "hydrogen bonds resisting molecular motion", e: "Thermal buffer for cells, blood, and habitats.", d: "easy" },
  { q: "In the reaction 2H₂O ⇌ H₃O⁺ + OH⁻ at pH 7, added acid is buffered by", o: ["more H₃O⁺ forming", "consumption of the conjugate base in the bicarbonate pair", "evaporation", "condensation"], a: "consumption of the conjugate base in the bicarbonate pair", e: "Buffers convert added H⁺ into the weak acid — equilibrium logic.", d: "medium" },
  { q: "Cellulose resists digestion in humans because", o: ["it is a protein", "its β-glycosidic bonds need cellulase we lack", "it contains chitin", "it is saturated"], a: "its β-glycosidic bonds need cellulase we lack", e: "Alternately-flipped glucose makes straight, unbreakable (for us) chains.", d: "medium" },
  { q: "Protein denaturation breaks which bonds first?", o: ["Peptide (primary)", "Hydrogen and ionic bonds holding secondary/tertiary shape", "Phosphodiester", "Glycosidic"], a: "Hydrogen and ionic bonds holding secondary/tertiary shape", e: "Sequence survives; the fold — and so function — is lost.", d: "easy" },
  { q: "A competitive inhibitor's signature on a Lineweaver or rate graph is", o: ["lower Vmax only", "higher Km only — beaten by more substrate", "no change at all", "denaturation"], a: "higher Km only — beaten by more substrate", e: "It contests the active site; non-competitive cuts Vmax instead.", d: "hard" },
  { q: "Per glucose, oxidative phosphorylation yields about", o: ["2 ATP", "4 ATP", "26–28 ATP", "38 ATP exactly"], a: "26–28 ATP", e: "NADH≈2.5, FADH₂≈1.5 via the chain; total with earlier stages 30–32.", d: "medium" },
  { q: "Cyanide kills by", o: ["blocking the Krebs cycle", "blocking complex IV so the chain dams and ATP synthesis stops", "lysing the membrane", "denaturing glycolysis enzymes"], a: "blocking complex IV so the chain dams and ATP synthesis stops", e: "No terminal acceptor → no proton pumping → no chemiosmosis.", d: "hard" },
  { q: "In a respirometer, soda lime is present to", o: ["feed the organisms", "absorb CO₂ so droplet movement reflects oxygen uptake only", "control temperature", "provide oxygen"], a: "absorb CO₂ so droplet movement reflects oxygen uptake only", e: "Otherwise released CO₂ would mask the volume change.", d: "medium" },
  { q: "C4 plants beat photorespiration by", o: ["opening stomata at night", "spatially concentrating CO₂ in bundle-sheath cells away from RuBisCO's oxygenase error", "using chlorophyll b only", "skipping the Calvin cycle"], a: "spatially concentrating CO₂ in bundle-sheath cells away from RuBisCO's oxygenase error", e: "CAM solves the same problem temporally instead.", d: "hard" },
  { q: "In the destarched-leaf practical, the foil-covered half serves as", o: ["the dependent variable", "a control identical except for light", "a source of starch", "the replicate"], a: "a control identical except for light", e: "Paired halves eliminate every other variable — design questions award this.", d: "medium" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "bioenergetics-biochemistry" } });
    if (!topic) throw new Error("master bioenergetics-biochemistry topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("bioenergetics standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Bioenergetics & Biochemistry — Complete", content: { blocks: BIOEN_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < BIOEN_QS.length; i++) {
      const item = BIOEN_QS[i];
      await prisma.question.upsert({
        where: { id: `master-bioenergetics-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-bioenergetics-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "bioenergetics-rebuild", blocks: BIOEN_BLOCKS.length, questions: BIOEN_QS.length });
  } catch (e) {
    console.error("rebuild bioenergetics failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
