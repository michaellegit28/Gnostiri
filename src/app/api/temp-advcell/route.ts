import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

// TEMPORARY advanced cell-biology guide seeder — DELETE after confirmed.
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const topic = await prisma.topic.findFirst({ where: { slug: "cell-biology" }, include: { lessons: { orderBy: { orderIndex: "asc" } } } });
    if (!topic) throw new Error("cell-biology topic missing");
    const blocks = [
      { type: "heading", level: 2, text: "1. Microscopy and cell theory" },
      { type: "paragraph", text: "Cell theory: all living things are composed of cells; the cell is life's basic unit; all cells arise from pre-existing cells. Modern additions: energy flow passes through cells, hereditary information (DNA) passes cell to cell, and cells of similar type cooperate as tissues." },
      { type: "paragraph", text: "Light microscopes resolve ~200 nm — cells, nuclei, chloroplasts in stained sections. Transmission EM resolves ~1 nm — membranes, ribosomes, viruses (dead, vacuum-fixed specimens). Scanning EM renders 3D surfaces at ~10 nm. Stains add contrast: methylene blue for nuclei, iodine for starch." },
      { type: "definition", term: "Surface area to volume ratio", text: "Volume grows cubically, surface only quadratically — large cells starve at the centre. Hence small cells, flattened cells, folded membranes (villi, cristae), and multinucleate muscle fibres." },
      { type: "diagram", diagramId: "microscope-scale", caption: "Resolution ladder" },
      { type: "heading", level: 2, text: "2. Membrane structure and transport" },
      { type: "paragraph", text: "The fluid mosaic: phospholipid bilayer with drifting proteins — integral channels/carriers, peripheral enzymes, glycoproteins and glycolipids for recognition. Cholesterol buffers fluidity: stiffens in heat, loosens in cold." },
      { type: "paragraph", text: "Passive: simple diffusion down gradients; facilitated diffusion via channels (aquaporins for water) and carriers; osmosis with tonicity — animal cells haemolyse in hypotonic and crenate in hypertonic media, plant cells turn turgid or plasmolyse. Active: primary pumps (Na⁺/K⁺ ATPase: 3 Na⁺ out, 2 K⁺ in) and secondary cotransport (symport together, antiport opposed). Bulk: phagocytosis (solids), pinocytosis (fluids), receptor-mediated endocytosis, and exocytosis." },
      { type: "diagram", diagramId: "fluid-mosaic", caption: "Membrane plus transport overlay" },
      { type: "heading", level: 2, text: "3. Organelles, endosymbiosis, cytoskeleton" },
      { type: "paragraph", text: "Prokaryotes: no nucleus, 70S ribosomes, binary fission. Eukaryotes compartmentalise: nucleus (envelope, pores, nucleolus), rough ER (protein folding), smooth ER (lipids), Golgi (cis receives, trans ships), lysosomes and peroxisomes (digestion, detox), vacuoles. Mitochondria and chloroplasts carry their own DNA and double membranes — engulfed bacteria per endosymbiotic theory." },
      { type: "paragraph", text: "Cytoskeleton: actin microfilaments (movement, cytokinesis), intermediate filaments (strength), microtubules (spindle, cilia, flagella from centrosomes). Plant walls connect via plasmodesmata; animal cells join by tight junctions, desmosomes, and gap junctions." },
      { type: "diagram", diagramId: "endomembrane-path", caption: "Protein trafficking route" },
      { type: "heading", level: 2, text: "4. Cell signalling" },
      { type: "paragraph", text: "Reception (ligand meets receptor: GPCRs, receptor tyrosine kinases, ion channels, or intracellular receptors for hydrophobic signals), transduction (G-proteins, phosphorylation cascades of kinases balanced by phosphatases, second messengers cAMP, Ca²⁺, IP₃), response (nuclear or cytoplasmic). Each arrow amplifies — one adrenaline molecule mobilises millions of glucose." },
      { type: "diagram", diagramId: "gpcr-cascade", caption: "GPCR to protein kinase A" },
      { type: "heading", level: 2, text: "5. Cell cycle and its control" },
      { type: "paragraph", text: "Interphase (G1 growth, S replication, G2 checks) then M phase. Mitosis: prophase (condense), prometaphase (envelope gone, spindles attach), metaphase (equatorial line-up), anaphase (sister chromatids split), telophase plus cytokinesis (furrow vs cell plate). Checkpoints at G1, G2, and M — cyclins drive, CDKs execute, p53 halts or kills failures. Broken guards (mutant p53, hyperactive proto-oncogenes) mean cancer." },
      { type: "diagram", diagramId: "cell-cycle-clock", caption: "Cycle clock plus PMAT" },
      { type: "heading", level: 2, text: "6. Meiosis and variation" },
      { type: "paragraph", text: "Meiosis I is reductional (homologues part), meiosis II equational (chromatids part) — four unique haploid cells. Variation from crossing over at chiasmata (prophase I), independent assortment (metaphase I), and random fertilisation. Nondisjunction misdeals whole chromosomes: trisomy 21 (Down), single X (Turner)." },
      { type: "diagram", diagramId: "crossing-over", caption: "Crossover vs nondisjunction" },
      { type: "heading", level: 2, text: "7. Summary tables" },
      { type: "table", headers: ["", "Prokaryotes", "Eukaryotes"], rows: [["Nucleus", "None (nucleoid)", "Membrane-bound"], ["Size", "0.5–5 µm", "10–100 µm"], ["Division", "Binary fission", "Mitosis/meiosis"], ["Example", "Bacteria", "Plants, animals, fungi"]] },
      { type: "table", headers: ["", "Mitosis", "Meiosis"], rows: [["Divisions", "1", "2"], ["Products", "2 identical diploid", "4 unique haploid"], ["Purpose", "Growth, repair", "Gametes, variation"], ["Errors", "Cancer", "Aneuploidy"]] },
      { type: "callout", variant: "info", text: "Case studies to-play: neurons (long axons, no division), muscle fibres (multinucleate, packed mitochondria). Experimental toolkit: cell fractionation (ultracentrifuge organelles apart) and fluorescent tagging (GFP lights proteins live)." },
    ];
    if (topic.lessons.length > 1) {
      await prisma.lesson.update({ where: { id: topic.lessons[1].id }, data: { title: "Cell Biology — Advanced", content: { blocks } as object, estimatedMinutes: 60 } });
    } else {
      await prisma.lesson.create({ data: { domain: "highschool", topicId: topic.id, title: "Cell Biology — Advanced", content: { blocks } as object, orderIndex: 1, estimatedMinutes: 60 } });
    }
    return NextResponse.json({ ok: true, advancedBlocks: blocks.length, diagrams: 6 });
  } catch (e) {
    console.error("temp advcell failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
