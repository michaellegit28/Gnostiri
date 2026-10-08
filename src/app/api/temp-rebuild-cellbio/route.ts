import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Biology Topic 1: Cell Biology standard chapter upgraded to
// the no-exceptions bar: every registry subtopic covered with mechanisms,
// required practicals, worked calculations, and exam-styled questions.

const CELL_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Cell theory — and its modern additions" },
  { type: "definition", term: "The three tenets", text: "1) All living organisms are composed of one or more cells. 2) The cell is the basic unit of structure, function and heredity. 3) All cells arise from pre-existing cells by division (Virchow: omnis cellula e cellula)." },
  { type: "paragraph", text: "Modern additions complete the theory: energy flow (photosynthesis → respiration) happens inside cells; DNA passes from cell to cell during division; and cells of the same type aggregate into tissues that cooperate. Exceptions that test the theory — viruses (not cells, not alive alone), mitochondria and chloroplasts (semi-autonomous, own DNA) — are exam favourites: know why each bends the rule." },
  { type: "diagram", diagramId: "microscope-scale", caption: "Resolution ladder" },
  { type: "heading", level: 2, text: "2. Microscopy — magnification is not resolution" },
  { type: "paragraph", text: "Magnification makes images larger; resolution separates two close points into distinct images. A blurry giant image is magnified but useless — examiners award the distinction. Light microscopes resolve ~200 nm (cells, nuclei, stained chloroplasts); transmission EM ~1 nm (membranes, ribosomes); scanning EM ~10 nm but renders 3D surfaces. Electron beams need dead, dehydrated, vacuum-held specimens — trade-offs exam answers must weigh." },
  { type: "paragraph", text: "Required practical: prepare and view stained cells. Onion epidermis (iodine stains starch-containing plastids) for plants; methylene blue for animal cheek cells. Method: thin layer → mount in stain → coverslip at 45° (no air bubbles) → observe low then high power. Drawing rules earn marks: title, stated magnification, smooth continuous lines, no shading." },
  { type: "example", text: "Scale calculation (memorise the triangle): magnification = image size ÷ real size. A mitochondrion drawn 20 mm long that is really 2 µm gives magnification = 20,000 µm ÷ 2 µm = ×10,000. Convert first (1 mm = 1000 µm; 1 µm = 1000 nm), then divide — unit errors are the most common lost mark in Paper 1 calculations." },
  { type: "heading", level: 2, text: "3. Surface area : volume ratio — why cells stay small" },
  { type: "paragraph", text: "As a cell grows, volume (needs: metabolism, waste) rises cubically while surface (supply: exchange) rises only quadratically — big cells starve at the centre and choke on waste. The SA:V ratio therefore sets the size limit, and life beats it by folding, flattening, and dividing." },
  { type: "example", text: "Worked comparison: a 2 mm cube has SA 24 mm² and V 8 mm³ → ratio 3 : 1. A 4 mm cube: SA 96 mm², V 64 mm³ → ratio 1.5 : 1. Doubling the edge halved the ratio — exchange efficiency fell by half. Hence red blood cells stay tiny, root hairs stay thin, and alveoli fold enormous surface into small space." },
  { type: "table", headers: ["Exchange surface", "Adaptation", "SA:V strategy"], rows: [["Alveolus", "Millions of thin-walled sacs", "Fold surface up"], ["Root hair", "Long extension", "Make cell long and thin"], ["Villus", "Microvilli brush border", "Fold the folding"], ["Mitochondrion", "Cristae", "Internal folds pack enzyme surface"]] },
  { type: "callout", variant: "warning", text: "Exam trap: 'cells are small because of diffusion distance' is half an answer. Full credit needs BOTH exchange capacity (SA:V falls with size) and distance (diffusion time rises with the square of distance)." },
  { type: "heading", level: 2, text: "4. Two designs — prokaryote vs eukaryote" },
  { type: "table", headers: ["Feature", "Prokaryote (bacteria)", "Eukaryote (plants, animals, fungi)"], rows: [["Genetic material", "Naked DNA loop in nucleoid, plasmids too", "Linear chromosomes in membrane-bound nucleus"], ["Ribosomes", "70S (smaller)", "80S"], ["Organelles", "None membrane-bound", "Full membrane-bound set"], ["Size", "0.5–5 µm", "10–100 µm"], ["Cell wall", "Murein/peptidoglycan always", "Cellulose (plants), chitin (fungi)"], ["Division", "Binary fission", "Mitosis (and meiosis for sex)"]] },
  { type: "paragraph", text: "Endosymbiosis explains the exceptions: mitochondria and chloroplasts have their own circular DNA, 70S ribosomes, double membranes, and binary-fission-like division — all bacterial signatures. Margulis's theory: an ancestral eukaryote engulfed an aerobic bacterium (→ mitochondrion) and, in the plant line, a photosynthetic one (→ chloroplast). The evidence list is the exam answer." },
  { type: "heading", level: 2, text: "5. Organelles — the deep tour" },
  { type: "table", headers: ["Organelle", "Structure adapted to function", "Where abundant and why"], rows: [["Nucleus", "Pore-perforated double envelope; nucleolus builds ribosomes", "All cells making protein"], ["Mitochondrion", "Cristae fold inner membrane for ETC enzymes", "Muscle, sperm midpiece, liver"], ["Chloroplast", "Grana stacks + stroma", "Palisade mesophyll"], ["Rough ER", "Ribosome-studded cisternae", "Antibody-secreting plasma cells"], ["Smooth ER", "No ribosomes — lipid and steroid synthesis", "Liver, gonads"], ["Golgi", "Cis–trans cisternae modify, tag, package", "Secretory cells"], ["Lysosome", "Acid hydrolases", "Phagocytes, tip of sperm acrosome"], ["Ribosome", "Two subunits of rRNA + protein", "Fast-growing cells"]] },
  { type: "paragraph", text: "Structure→function→location is the three-beat answer format: e.g. 'mitochondria are numerous in muscle cells (location) because cristae (structure) pack electron-transport enzymes for ATP supply to contraction (function).' Learn each organelle in this shape and every 'explain why X has many Y' question is pre-answered." },
  { type: "diagram", diagramId: "endomembrane-path", caption: "Protein trafficking route" },
  { type: "heading", level: 2, text: "6. The endomembrane system — one journey, four organelles" },
  { type: "paragraph", text: "Follow a secreted protein: translation begins on a RER ribosome → the chain threads into the RER lumen, folding and gaining disulfides → transport vesicles bud to the Golgi's cis face → sugars added, sorted, addressed → vesicles from the trans face fuse with the plasma membrane (exocytosis) or become lysosomes. Enzymes for digestion route to lysosomes; membrane proteins to the membrane. The pathway explains why Golgi is the 'post office' and lysosomes the 'recycling centre' — and why disrupting it (in I-cell disease, missing tagging enzyme) dumps digestive enzymes outside the cell instead." },
  { type: "heading", level: 2, text: "7. The membrane — fluid mosaic mastery" },
  { type: "paragraph", text: "Phospholipids self-assemble into a bilayer (hydrophilic heads out, fatty tails in); cholesterol buffers fluidity — restraining at heat, preventing rigidity at cold; integral proteins span the bilayer (channels, carriers, pumps, receptors); peripheral proteins sit on surfaces as enzymes; glycoproteins and glycolipids form the cell's ID for recognition. 'Fluid' = components drift laterally; 'mosaic' = scattered protein variety. Singer–Nicolson's evidence: freeze-fracture EM showed bumps IN the membrane, not on it." },
  { type: "diagram", diagramId: "fluid-mosaic", caption: "Membrane and transport overlay" },
  { type: "heading", level: 2, text: "8. Passive transport — gradients do the work" },
  { type: "definition", term: "Simple diffusion", text: "Net movement of small/lipid-soluble molecules down a concentration gradient until equilibrium. No membrane contact, no energy. Rate rises with gradient, temperature, surface, and falls with distance — Fick's facts that explain alveoli and villi." },
  { type: "definition", term: "Facilitated diffusion", text: "Polar/charged molecules need help: channel proteins (aquaporins for water, gated ion channels) and carrier proteins that shape-change (glucose via GLUT). Still passive — down gradients only, ATP never spent." },
  { type: "definition", term: "Osmosis", text: "Water's diffusion across a selectively permeable membrane, from hypotonic (weaker) to hypertonic (stronger) solution. Water potential (Ψ) quantifies it: water moves from higher Ψ to lower Ψ; pure water's Ψ = 0." },
  { type: "example", text: "Required practical — osmosis in potato: cylinders in sucrose of varying concentration. Mass gain in dilute solutions (hypotonic → water in), loss in concentrated (hypertonic → water out); the concentration giving no change is isotonic with the tissue. Plot % mass change vs concentration; the x-intercept finds the cell sap's water potential. State every control: volume, time, temperature, blotting consistency." },
  { type: "table", headers: ["Tonicity", "Animal cell", "Plant cell"], rows: [["Hypotonic", "Swells → haemolysis (no wall)", "Turgid — wall resists, protoplast presses"], ["Isotonic", "No net change", "Flaccid"], ["Hypertonic", "Crenates (shrivels)", "Plasmolysis — membrane tears from wall"]] },
  { type: "callout", variant: "warning", text: "Exam trap: osmosis involves water only, and requires a membrane; diffusion needs neither. Also: plant cells do not 'burst' — the wall prevents it. Misusing 'burst' for turgid plant cells loses the mark." },
  { type: "heading", level: 2, text: "9. Active transport and bulk — spending energy to defy gradients" },
  { type: "paragraph", text: "The Na⁺/K⁺ pump moves 3 Na⁺ out for every 2 K⁺ in, one ATP per cycle — the model answer: carrier protein, phosphorylated by ATP, shape change, ion selectivity, against gradient. In roots it charges the cell negative for mineral uptake; in nerves it maintains the resting potential; in kidneys it reabsorbs glucose. Secondary cotransport then surfs the gradient it builds (the SGLT glucose pump rides Na⁺ back in)." },
  { type: "paragraph", text: "Bulk transport handles the too-big-to-cross: endocytosis (phagocytosis for solids — a phagocyte engulfing a bacterium; pinocytosis sips fluid; receptor-mediated catches specific ligands), exocytosis exports packaged products (digestive enzymes, neurotransmitters). Both spend ATP, both use vesicles, both move membrane around — the cell recycles its own surface." },
  { type: "heading", level: 2, text: "10. Cell signalling — reception, transduction, response" },
  { type: "paragraph", text: "Cells talk in molecules: a ligand (hormone, neurotransmitter) binds a receptor with complementary shape (reception). Transduction relays and amplifies — G-protein cascades (see the Advanced chapter for GPCR→cAMP→PKA detail), phosphorylation relays where kinases pass phosphates onward like batons, second messengers (cAMP, Ca²⁺, IP₃) spreading the signal inside. Response: an enzyme activated, a gene expressed, a channel opened. One adrenaline molecule → ~10⁸ glucose mobilised: amplification is the point." },
  { type: "heading", level: 2, text: "11. Cell cycle and mitosis — regulated growth" },
  { type: "paragraph", text: "Interphase does the living: G1 growth and organelle duplication, S replication (each chromosome → two sister chromatids), G2 final checks. Mitosis then partitions chromatids: prophase condense, prometaphase spindle attach, metaphase equator line-up, anaphase sister split, telophase plus cytokinesis (furrow in animals, cell plate in plants)." },
  { type: "diagram", diagramId: "cell-cycle-clock", caption: "Cycle clock and PMAT" },
  { type: "paragraph", text: "Checkpoints at G1, G2, M are staffed by cyclins rising and falling in step, driving cyclin-dependent kinases (CDKs) that phosphorylate targets. p53 — guardian of the genome — halts the cycle for repair or triggers apoptosis when repair fails. Mutation that removes p53 (or over-activates a proto-oncogene like ras) removes the brakes: cancer is the cell cycle with its regulation broken, which is why 'uncontrolled mitosis' is the one-mark definition and the full story is the checkpoint logic." },
  { type: "heading", level: 2, text: "12. Meiosis — variation by design" },
  { type: "paragraph", text: "One duplication, two divisions: meiosis I separates homologues (reductional), meiosis II separates chromatids (equational) → four genetically different haploid cells. Crossing over at chiasmata in prophase I swaps homologous segments; independent assortment at metaphase I deals each homologue pair's orientation at random (2²³ combinations in humans before crossing over); fertilisation multiplies variety again. Nondisjunction — homologues or chromatids mis-segregating — makes aneuploid gametes: trisomy 21 (Down), X monosomy (Turner)." },
  { type: "diagram", diagramId: "crossing-over", caption: "Crossover and nondisjunction" },
  { type: "callout", variant: "warning", text: "Mitosis vs meiosis in three beats: divisions (1 vs 2), products (2 identical diploid vs 4 different haploid), purpose (growth/repair vs variation/gametes). Every exam board asks it; answer in a table, not prose." },
  { type: "heading", level: 2, text: "13. Command words and summary" },
  { type: "table", headers: ["Command word", "What the examiner wants"], rows: [["Define", "The memorised one-to-two-line statement"], ["Explain", "Because-chains: mechanism, then consequence"], ["Compare", "Both items named in every point — table earns full marks"], ["Calculate", "Method shown + units — answer alone scores half"], ["Suggest", "Apply a principle to an unfamiliar case — justify it"]] },
  { type: "table", headers: ["", "Mitosis", "Meiosis"], rows: [["Divisions", "1", "2"], ["Products", "2 identical diploid", "4 unique haploid"], ["Crossing over", "No", "Yes (prophase I)"], ["Role", "Growth, repair, asexual", "Gametes, variation"]] },
];

const CELL_QS: Q[] = [
  { q: "A mitochondrion 2 µm long is drawn 20 mm. The magnification is", o: ["×100", "×1,000", "×10,000", "×2,000"], a: "×10,000", e: "20 mm = 20,000 µm ÷ 2 µm. Convert first, then divide.", d: "easy" },
  { q: "A 2 mm cube has SA 24 mm², V 8 mm³. A 4 mm cube has", o: ["ratio 3:1 again", "ratio 1.5:1 — efficiency halved", "ratio 4:1", "no change in ratio"], a: "ratio 1.5:1 — efficiency halved", e: "SA:V falls as size rises — why cells stay small.", d: "medium" },
  { q: "Electron microscopes resolve more than light microscopes because", o: ["electrons are bigger", "electron wavelengths are far shorter than light's", "they magnify more", "vacuums add contrast"], a: "electron wavelengths are far shorter than light's", e: "Resolution, not magnification, is set by wavelength.", d: "medium" },
  { q: "Mitochondria and chloroplasts support endosymbiosis because they", o: ["are made by nuclei", "have their own circular DNA and 70S ribosomes", "lack membranes", "are found in bacteria too"], a: "have their own circular DNA and 70S ribosomes", e: "Bacterial signatures, plus double membranes and fission.", d: "easy" },
  { q: "In the potato osmosis practical, % mass change is plotted against sucrose concentration because", o: ["mass alone removes size differences between cylinders", "it looks better", "concentration is the dependent variable", "time is controlled by it"], a: "mass alone removes size differences between cylinders", e: "% change normalises cylinder-to-cylinder variation; intercept finds isotonic point.", d: "medium" },
  { q: "A plant cell placed in a hypertonic solution undergoes", o: ["haemolysis", "plasmolysis — membrane pulls from the wall", "turgor", "binary fission"], a: "plasmolysis — membrane pulls from the wall", e: "Water exits; the wall holds shape, the protoplast shrinks.", d: "easy" },
  { q: "The Na⁺/K⁺ pump moves", o: ["3 Na⁺ in for 2 K⁺ out", "3 Na⁺ out for 2 K⁺ in, using one ATP", "2 Na⁺ out for 3 K⁺ in, passively", "only Na⁺"], a: "3 Na⁺ out for 2 K⁺ in, using one ATP", e: "Antiport, ATP-phosphorylated carrier, against gradients.", d: "medium" },
  { q: "p53 earns the name 'guardian of the genome' by", o: ["repairing DNA itself", "halting the cycle at G1/G2 for repair or triggering apoptosis", "spinning the spindle", "building cyclins"], a: "halting the cycle at G1/G2 for repair or triggering apoptosis", e: "Lost p53 → checkpoints gone → cancer's engine.", d: "hard" },
  { q: "Independent assortment at metaphase I produces chromosome combinations in a human cell of about", o: ["2²³ (over 8 million)", "23", "4", "2 × 2"], a: "2²³ (over 8 million)", e: "Each of 23 homologue pairs orients independently — before crossing over.", d: "hard" },
  { q: "An examiner says 'Explain why phagocytes contain many lysosomes.' The full-mark shape is", o: ["they just do", "phagocytes engulf bacteria (function); lysosomes carry hydrolytic enzymes (structure); digesting the engulfed pathogen (link)", "lysosomes are large", "enzymes are proteins"], a: "phagocytes engulf bacteria (function); lysosomes carry hydrolytic enzymes (structure); digesting the engulfed pathogen (link)", e: "Function → structure → link: the three-beat answer pattern.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "cell-biology" } });
    if (!topic) throw new Error("master cell-biology topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("cell-biology standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Cell Biology — Complete", content: { blocks: CELL_BLOCKS } as object, estimatedMinutes: 50 } });
    for (let i = 0; i < CELL_QS.length; i++) {
      const item = CELL_QS[i];
      await prisma.question.upsert({
        where: { id: `master-cell-biology-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-cell-biology-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "cell-biology-rebuild", blocks: CELL_BLOCKS.length, questions: CELL_QS.length });
  } catch (e) {
    console.error("rebuild cellbio failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
