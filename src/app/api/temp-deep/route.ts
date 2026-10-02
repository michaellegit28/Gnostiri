import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// TEMPORARY deep-chapter seeder (Cell Biology) — DELETE after confirmed.
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const topic = await prisma.topic.findFirst({ where: { slug: "cell-biology" } });
    if (!topic) throw new Error("master cell-biology topic missing");
    const blocks = [
      { type: "heading", level: 2, text: "1. The cell theory — biology's foundation" },
      { type: "paragraph", text: "Every living thing you will ever study — bacteria, mushrooms, maize, malaria parasites, humans — is built from cells. Three ideas, confirmed over 200 years of microscopy, hold the whole subject together." },
      { type: "definition", term: "Cell theory", text: "1) All living organisms are composed of cells. 2) The cell is the basic unit of structure and function. 3) All cells arise from pre-existing cells (Virchow — omnis cellula e cellula)." },
      { type: "example", text: "Robert Hooke (1665) saw dead cork compartments and named them cells. Brown found the nucleus (1831). Schleiden and Schwann extended the theory to plants and animals (1838–39)." },
      { type: "heading", level: 2, text: "2. Seeing cells — microscopy" },
      { type: "paragraph", text: "Light microscopes magnify up to ~1500× and show nuclei and chloroplasts in stained cells. Electron microscopes resolve ultrastructure — ribosomes, membranes, viruses — at millions of times magnification, but specimens must be dead, dehydrated, and in vacuum." },
      { type: "callout", variant: "info", text: "Magnification makes things bigger; resolution separates two close points. A blurry giant image is magnified but unresolved — examiners love this distinction." },
      { type: "heading", level: 2, text: "3. Two great cell designs" },
      { type: "table", headers: ["Feature", "Prokaryotic (bacteria)", "Eukaryotic (plants, animals, fungi)"], rows: [["Nucleus", "No true nucleus; DNA loop in cytoplasm", "Membrane-bound nucleus with chromosomes"], ["Size", "0.5–5 micrometres", "10–100 micrometres"], ["Organelles", "Few; no mitochondria/chloroplasts", "Many membrane-bound organelles"], ["Division", "Binary fission", "Mitosis / meiosis"]] },
      { type: "table", headers: ["Feature", "Animal cell", "Plant cell"], rows: [["Cell wall", "Absent", "Cellulose wall for strength"], ["Chloroplasts", "Absent", "Present — photosynthesis"], ["Vacuole", "Small or absent", "Large central sap vacuole"], ["Centrioles", "Present", "Absent (mostly)"]] },
      { type: "heading", level: 2, text: "4. Organelles — deep tour" },
      { type: "definition", term: "Nucleus", text: "Houses chromosomes (DNA + protein). The nucleolus builds ribosomes. Nuclear pores control traffic. It is the control centre — remove it and the cell dies." },
      { type: "definition", term: "Mitochondrion", text: "Site of aerobic respiration: glucose + oxygen → carbon dioxide + water + ATP. Folded inner membranes (cristae) pack in enzymes. Active cells — muscle, sperm tails, root meristems — carry thousands." },
      { type: "definition", term: "Chloroplast", text: "Photosynthesis: carbon dioxide + water → glucose + oxygen in chlorophyll. Stacked thylakoids (grana) trap light. Only in green plant parts." },
      { type: "definition", term: "Endoplasmic reticulum", text: "Rough ER (ribosome-studded) folds and ships proteins; smooth ER makes lipids and detoxifies. A membrane highway connected to the nucleus." },
      { type: "definition", term: "Golgi body", text: "Modifies, packages, and addresses proteins in vesicles — the cell's post office. Well developed in secretory cells like glands." },
      { type: "definition", term: "Lysosome", text: "Suicide sacs of digestive enzymes: destroy worn organelles, digest food, and — in metamorphosis or autolysis — the whole cell." },
      { type: "paragraph", text: "Ribosomes (protein synthesis, free or on rough ER), the large central vacuole (turgor, storage), the cellulose wall (fully permeable support), and the cytoskeleton (movement, shape, transport tracks) complete the cast. Learn each organelle as structure → function → cell that needs it most." },
      { type: "heading", level: 2, text: "5. The membrane — fluid mosaic" },
      { type: "paragraph", text: "Singer and Nicolson's fluid mosaic model: a phospholipid bilayer with proteins drifting like icebergs — channel and carrier proteins for transport, receptors for signals, cholesterol for stability. Selectively permeable: small uncharged molecules pass; ions and large molecules need help." },
      { type: "heading", level: 2, text: "6. Transport across membranes" },
      { type: "definition", term: "Diffusion", text: "Net movement of particles down a concentration gradient. Faster with steep gradients, heat, and large surface areas — hence alveoli, villi, and root hairs." },
      { type: "definition", term: "Osmosis", text: "Diffusion of water across a selectively permeable membrane, toward the stronger solution. Animal cells haemolyse in pure water and crenate in strong salt; plant cells become turgid or plasmolysed." },
      { type: "definition", term: "Active transport", text: "Movement against the gradient using ATP and carrier proteins — e.g. root hairs absorbing mineral ions from dilute soil, or the kidney reabsorbing glucose." },
      { type: "example", text: "Red blood cells in distilled water burst (haemolysis) as water rushes in; in concentrated salt they shrivel (crenation). IV fluids are therefore isotonic with blood." },
      { type: "callout", variant: "warning", text: "Exam trap: osmosis involves WATER ONLY across a selectively permeable membrane. Diffusion is any substance, no membrane required." },
      { type: "heading", level: 2, text: "7. The cell cycle and mitosis" },
      { type: "paragraph", text: "Most of a cell's life is interphase — G1 (growth), S (DNA replicated — chromosomes double to sister chromatids), G2 (energy stores, checks). Mitosis then divides the nucleus in four stages." },
      { type: "table", headers: ["Stage", "What happens"], rows: [["Prophase", "Chromosomes condense and become visible; nuclear membrane breaks down; spindle forms"], ["Metaphase", "Chromosomes line up on the equator, attached by centromeres"], ["Anaphase", "Sister chromatids pulled to opposite poles"], ["Telophase", "Two nuclei reform; cytokinesis splits animal cells by furrow, plant cells by cell plate"]] },
      { type: "paragraph", text: "Result: two genetically IDENTICAL diploid cells. Uses: growth, repair, replacement, asexual reproduction. Uncontrolled mitosis is cancer." },
      { type: "heading", level: 2, text: "8. Meiosis — variation by design" },
      { type: "paragraph", text: "One duplication followed by TWO divisions. In Prophase I, homologous chromosomes pair and swap segments (crossing over); in Anaphase I whole homologues — randomly assorted — move apart. Meiosis II separates chromatids like mitosis." },
      { type: "definition", term: "Meiosis outcome", text: "Four genetically DIFFERENT haploid gametes. Crossing over plus independent assortment shuffles every generation — the engine of variation and evolution." },
      { type: "table", headers: ["", "Mitosis", "Meiosis"], rows: [["Divisions", "1", "2"], ["Cells produced", "2 identical diploid", "4 different haploid"], ["Purpose", "Growth, repair, asexual reproduction", "Gametes, variation"], ["Crossing over", "No", "Yes (Prophase I)"]] },
      { type: "heading", level: 2, text: "9. Specialised cells" },
      { type: "table", headers: ["Cell", "Adaptation", "Why"], rows: [["Root hair cell", "Long extension, huge surface", "Absorb water and ions fast"], ["Sperm", "Tail, many mitochondria, enzymes", "Swim and penetrate the egg"], ["Red blood cell", "No nucleus, biconcave disc", "Maximum haemoglobin, squeezes through capillaries"], ["Palisade mesophyll", "Tall, packed with chloroplasts", "Maximum light capture"]] },
      { type: "callout", variant: "info", text: "Answer every adaptation question in three beats: feature → how it helps → the job. Examiners award function marks, not lists." },
    ];
    const existing = await prisma.lesson.findFirst({ where: { topicId: topic.id } });
    if (existing) {
      await prisma.lesson.update({ where: { id: existing.id }, data: { title: "Cell Biology — Complete", content: { blocks } as object, estimatedMinutes: 45 } });
    } else {
      await prisma.lesson.create({ data: { domain: "highschool", topicId: topic.id, title: "Cell Biology — Complete", content: { blocks } as object, orderIndex: 0, estimatedMinutes: 45 } });
    }
    return NextResponse.json({ ok: true, topic: "cell-biology", blocks: blocks.length });
  } catch (e) {
    console.error("temp deep chapter failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
