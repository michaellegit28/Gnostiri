import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][] };

// TEMPORARY advanced bioenergetics guide seeder — DELETE after confirmed.
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const topic = await prisma.topic.findFirst({ where: { slug: "bioenergetics-biochemistry" } });
    if (!topic) throw new Error("master bioenergetics-biochemistry topic missing");
    const blocks: B[] = [
      { type: "heading", level: 2, text: "1. Water chemistry — the medium of life" },
      { type: "paragraph", text: "Water's polarity (unequal electron sharing in O–H bonds) lets molecules hydrogen-bond into a cohesive network. Consequences: high specific heat (temperature stability), high latent heat of vaporisation (sweating cools efficiently), cohesion–adhesion (capillary rise in xylem), and ice floating (density anomaly insulating lakes in winter)." },
      { type: "definition", term: "Water as solvent and reagent", text: "Universal solvent for ions and polar molecules; participant in hydrolysis (breaking bonds with water, e.g. digestion) and condensation (building polymers, releasing water)." },
      { type: "paragraph", text: "pH measures H⁺ concentration (0–14, logarithmic: each unit is tenfold). Blood pH 7.4 is guarded by bicarbonate (H₂CO₃/HCO₃⁻) and phosphate buffers, which absorb added acid or base — enzymes denature outside narrow ranges, so buffering is homeostasis itself." },
      { type: "definition", term: "Carbon skeletons", text: "Tetravalent carbon builds chains, branches, and rings. Functional groups set behaviour: hydroxyl (alcohols), carbonyl (aldehydes/ketones), carboxyl (acids), amino (bases/proteins), sulfhydryl (disulfide bridges), phosphate (energy transfer). Isomers share formulae but differ in arrangement: structural, cis–trans (e.g. fatty acids), and enantiomers (mirror images, e.g. L/D amino acids)." },
      { type: "heading", level: 2, text: "2. Macromolecules — structure is function" },
      { type: "table", headers: ["Class", "Building blocks", "Bonds", "Examples"], rows: [["Carbohydrates", "Monosaccharides (glucose, fructose, galactose)", "Glycosidic", "Sucrose, lactose, maltose; starch/glycogen (storage); cellulose/chitin (structural)"], ["Lipids", "Glycerol + fatty acids", "Ester", "Triglycerides; phospholipids (amphipathic bilayers); steroids (cholesterol, hormones)"], ["Proteins", "20 amino acids", "Peptide", "Enzymes, antibodies, haemoglobin"], ["Nucleic acids", "Nucleotides (pentose + phosphate + base)", "Phosphodiester", "DNA (deoxyribose, A–T) vs RNA (ribose, A–U)"]] },
      { type: "paragraph", text: "Saturated fatty acids pack straight (solid fats); cis-unsaturated kink (liquid oils); trans fats stack artificially — a cardiovascular risk. Proteins fold in four levels: primary sequence → secondary helices/sheets (H-bonds) → tertiary 3D shape (ionic, hydrophobic, disulfide) → quaternary subunits (haemoglobin's four chains). Heat, pH, and salinity denature by breaking these bonds — sequence survives, function dies." },
      { type: "paragraph", text: "Nucleotides pair purines (A, G — double ring) with pyrimidines (C, T, U — single ring). DNA's deoxyribose and thymine suit archival stability; RNA's ribose and uracil suit disposable messages." },
      { type: "heading", level: 2, text: "3. Enzymes and kinetics" },
      { type: "paragraph", text: "Enzymes cut activation energy by stabilising the transition state at the active site — lock-and-key refined to induced fit (the site moulds around the substrate). Inorganic cofactors (Mg²⁺, Zn²⁺) and organic coenzymes (NAD⁺, FAD, vitamins) complete many enzymes." },
      { type: "table", headers: ["Factor", "Effect on rate"], rows: [["Temperature", "Rises to optimum, then denaturation crash"], ["pH", "Sharp optimum per enzyme"], ["Substrate [S]", "Hyperbolic rise to Vmax (Michaelis–Menten); Km = [S] at Vmax/2"], ["Enzyme [E]", "Linear rise (more active sites)"]] },
      { type: "paragraph", text: "Regulation: competitive inhibitors mimic substrate (beaten by more substrate, Km rises); non-competitive/allosteric bind elsewhere (Vmax falls); uncompetitive bind enzyme–substrate complex; irreversible poisons (cyanide, nerve gases) kill permanently. Feedback inhibition caps pathways (e.g. ATP slowing glycolysis); cooperativity (haemoglobin's oxygen loading) sharpens responses." },
      { type: "heading", level: 2, text: "4. Bioenergetics — ΔG, ATP, redox" },
      { type: "paragraph", text: "First law: energy conserved. Second law: entropy rises — living open systems stay ordered only by importing energy. Gibbs free energy decides spontaneity: exergonic (ΔG negative, spontaneous) versus endergonic (ΔG positive, needs driving)." },
      { type: "definition", term: "ATP coupling", text: "Hydrolysis ATP → ADP + Pi releases ≈ −30.5 kJ/mol, dragging endergonic processes forward. Adenine + ribose + three mutually repelling phosphates make ATP spring-loaded; cells recycle their own weight in ATP daily." },
      { type: "paragraph", text: "Redox is electron (or hydrogen) bookkeeping: oxidation loses, reduction gains (OILRIG). NAD⁺, NADP⁺, and FAD are the cell's electron shuttles — reduced in breakdown pathways, oxidised in the electron transport chain." },
      { type: "heading", level: 2, text: "5. Cellular respiration in full" },
      { type: "table", headers: ["Stage", "Location", "Yield per glucose"], rows: [["Glycolysis", "Cytoplasm", "2 pyruvate + 2 net ATP + 2 NADH (investment then payoff, substrate-level)"], ["Link reaction", "Mitochondrial matrix", "2 acetyl-CoA + 2 CO₂ + 2 NADH"], ["Krebs cycle (×2 turns)", "Matrix", "4 CO₂ + 6 NADH + 2 FADH₂ + 2 ATP/GTP"], ["Oxidative phosphorylation", "Cristae membrane", "~26–28 ATP: ETC pumps protons, oxygen accepts electrons → water, ATP synthase spends the gradient (chemiosmosis)"]] },
      { type: "paragraph", text: "Without oxygen, NAD⁺ must be regenerated by fermentation alone: lactate in muscles (oxygen debt) or ethanol + CO₂ in yeast. Glycolysis continues, but at ~2 ATP per glucose — survival on crumbs." },
      { type: "heading", level: 2, text: "6. Photosynthesis in full" },
      { type: "paragraph", text: "Chlorophyll a (reaction centres), chlorophyll b, and carotenoids (accessory + photoprotection) sit in thylakoid grana; absorption peaks differ from action spectra, which reveal what actually drives photosynthesis." },
      { type: "table", headers: ["Process", "Location", "Products"], rows: [["PSII → photolysis → linear flow → PSI", "Thylakoid membrane", "O₂ + ATP (chemiosmosis) + NADPH"], ["Cyclic flow (PSI only)", "Thylakoid membrane", "ATP only (balances the budget)"], ["Calvin cycle", "Stroma", "Fixation (RuBisCO: CO₂ + RuBP) → reduction (ATP + NADPH → G3P) → RuBP regeneration"]] },
      { type: "paragraph", text: "RuBisCO also grabs oxygen (photorespiration — wasteful). C4 plants (maize, sugarcane) fix CO₂ in mesophyll then release it in bundle-sheath cells (spatial separation); CAM plants (cacti) fix at night and close stomata by day (temporal separation) — two engineering answers to hot, dry climates." },
      { type: "heading", level: 2, text: "7. Respiration vs photosynthesis" },
      { type: "table", headers: ["", "Cellular respiration", "Photosynthesis"], rows: [["Direction", "Breaks glucose, releases energy", "Builds glucose, stores energy"], ["Gas exchange", "O₂ in, CO₂ out", "CO₂ in, O₂ out"], ["Sites", "Cytoplasm + mitochondria", "Chloroplast (thylakoids + stroma)"], ["ATP role", "Made by chemiosmosis (ETC)", "Made by photophosphorylation, spent in Calvin"], ["Carriers", "NADH/FADH₂ → ETC", "NADPH from light reactions"], ["ΔG overall", "Exergonic", "Endergonic (sun-driven)"]] },
      { type: "callout", variant: "info", text: "One sentence carries both: photosynthesis stores sunlight as glucose and releases respiration's oxygen; respiration burns glucose and releases photosynthesis's CO₂ — ATP is the coin between them." },
    ];
    const existing = await prisma.lesson.findMany({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (existing.length > 1) {
      await prisma.lesson.update({ where: { id: existing[1].id }, data: { title: "Bioenergetics & Biochemistry — Advanced", content: { blocks } as object, estimatedMinutes: 60 } });
    } else {
      await prisma.lesson.create({ data: { domain: "highschool", topicId: topic.id, title: "Bioenergetics & Biochemistry — Advanced", content: { blocks } as object, orderIndex: 1, estimatedMinutes: 60 } });
    }
    return NextResponse.json({ ok: true, advancedBlocks: blocks.length });
  } catch (e) {
    console.error("temp advanced bio failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
