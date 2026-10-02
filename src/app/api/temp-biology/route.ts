import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][] };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// TEMPORARY full-biology batch seeder — DELETE after confirmed.
const GENETICS_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. DNA — the instruction manual" },
  { type: "paragraph", text: "Deoxyribonucleic acid carries every instruction for building and running you. Watson and Crick's double helix (1953, from Franklin's X-ray data): two sugar-phosphate backbones, paired bases inside — A with T, C with G — twisted into a ladder." },
  { type: "definition", term: "Gene", text: "A section of DNA coding for one protein (or one trait). Humans carry ~20,000; a single base change can remake a life." },
  { type: "example", text: "Sickle-cell anaemia comes from ONE base swap in the haemoglobin gene (GAG → GTG): red cells sickle, clog vessels, and resist malaria — one mutation, three consequences." },
  { type: "heading", level: 2, text: "2. Copying DNA — replication" },
  { type: "paragraph", text: "Before every division, DNA unzips and each strand templates a new partner (semi-conservative). Enzymes: helicase unzips, DNA polymerase builds, ligase joins. It happens in the S phase of interphase — errors here are mutations." },
  { type: "heading", level: 2, text: "3. From gene to protein" },
  { type: "table", headers: ["Step", "Where", "What"], rows: [["Transcription", "Nucleus", "Gene copied into messenger RNA (mRNA)"], ["Translation", "Ribosome", "mRNA read in triplets (codons); amino acids joined into protein"]] },
  { type: "paragraph", text: "Three bases = one amino acid. Change the triplet and the protein — and the trait — can change. This is why point mutations matter." },
  { type: "heading", level: 2, text: "4. Mendel's inheritance" },
  { type: "definition", term: "Key terms", text: "Allele: version of a gene. Dominant (shown with one copy, e.g. T). Recessive (needs two, tt). Homozygous (TT/tt). Heterozygous (Tt). Genotype (alleles). Phenotype (observed trait)." },
  { type: "example", text: "Tall (T) × dwarf (tt): all F1 are Tt (tall). Self the F1 → F2 ratio 3 tall : 1 dwarf, genotype ratio 1TT : 2Tt : 1tt. Draw the Punnett square every time — marks live in the working." },
  { type: "table", headers: ["Cross", "Phenotype ratio"], rows: [["Monohybrid (Tt × Tt)", "3 : 1"], ["Dihybrid (9:3:3:1)", "Round-yellow : round-green : wrinkled-yellow : wrinkled-green"], ["Test cross (T? × tt)", "1:1 means Tt; all tall means TT"]] },
  { type: "paragraph", text: "Beyond Mendel: incomplete dominance (pink snapdragons), codominance (AB blood group — both alleles shown), multiple alleles (ABO: IA, IB, iO), and sex linkage — haemophilia and colour blindness ride the X chromosome, so males show them more." },
  { type: "callout", variant: "warning", text: "Exam trap: use LETTERS consistently (T/t, never T/d), state gametes on the square's edges, and always give ratios with the phenotypes named — '3:1' alone scores nothing." },
  { type: "heading", level: 2, text: "5. Mutations" },
  { type: "paragraph", text: "Random changes from copying errors, radiation, or chemicals (mutagens): substitution, deletion, insertion. Most are neutral or harmful; rarely, one helps — the raw material of evolution. Down syndrome (extra chromosome 21, non-disjunction) and albinism are classic syllabus examples." },
  { type: "heading", level: 2, text: "6. Biotechnology" },
  { type: "paragraph", text: "Humans now edit the manual: human insulin grown in bacteria (no more pig insulin shortages), Bt crops making their own pesticide, gene therapy trials for sickle-cell. Every application brings the same exam question — benefit versus ethical risk — so learn one example deeply and argue both sides." },
];
const GENETICS_QS: Q[] = [
  { q: "In DNA, adenine always pairs with", o: ["guanine", "cytosine", "thymine", "uracil"], a: "thymine", e: "A–T (two hydrogen bonds), C–G (three).", d: "easy" },
  { q: "DNA replication is described as semi-conservative because", o: ["half the DNA is destroyed", "each new molecule keeps one old strand", "it happens twice per cycle", "only half the genes copy"], a: "each new molecule keeps one old strand", e: "Each daughter duplex has one parental, one new strand.", d: "medium" },
  { q: "A cross Tt × tt gives what phenotype ratio?", o: ["3 tall : 1 dwarf", "1 tall : 1 dwarf", "all tall", "all dwarf"], a: "1 tall : 1 dwarf", e: "Test cross: half Tt (tall), half tt (dwarf).", d: "medium" },
  { q: "The F2 genotype ratio of a monohybrid cross is", o: ["3:1", "1:2:1", "9:3:3:1", "1:1"], a: "1:2:1", e: "1TT : 2Tt : 1tt — phenotypes 3:1.", d: "medium" },
  { q: "Colour blindness is commoner in males because the gene is", o: ["dominant on Y", "recessive on X", "on an autosome", "in mitochondria"], a: "recessive on X", e: "Males have one X — a single recessive allele shows.", d: "medium" },
  { q: "Translation of mRNA into protein occurs in the", o: ["nucleus", "ribosome", "lysosome", "chloroplast"], a: "ribosome", e: "Codons are read and amino acids joined there.", d: "easy" },
  { q: "Sickle-cell anaemia is caused by", o: ["an extra chromosome", "a single base substitution", "a missing ribosome", "low iron intake"], a: "a single base substitution", e: "GAG→GTG swaps one amino acid in haemoglobin.", d: "medium" },
  { q: "An organism with genotype AaBb produces how many gamete types?", o: ["2", "4", "8", "16"], a: "4", e: "AB, Ab, aB, ab — independent assortment.", d: "hard" },
  { q: "Blood group AB is an example of", o: ["incomplete dominance", "codominance", "sex linkage", "mutation"], a: "codominance", e: "Both IA and IB are fully expressed.", d: "medium" },
  { q: "A valid benefit AND risk of Bt crops is", o: ["higher yield but gene escape to wild relatives", "no pesticide ever needed", "crops grow without water", "zero cost to farmers"], a: "higher yield but gene escape to wild relatives", e: "Benefit: less spray; risk: resistance and gene flow.", d: "hard" },
];

const PHYSIO_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Digestion — from bite to blood" },
  { type: "paragraph", text: "Food must be broken small enough to enter blood: mechanical chewing plus chemical enzymes, region by region." },
  { type: "table", headers: ["Region", "Enzyme(s)", "Action"], rows: [["Mouth", "Salivary amylase", "Starch → maltose; chewed, swallowed"], ["Stomach", "Pepsin (acid pH)", "Protein → peptides; churning"], ["Duodenum", "Pancreatic amylase, lipase, trypsin; bile emulsifies fats", "All food groups attacked"], ["Ileum", "Maltase, sucrase, lactase, peptidases", "Final breakdown to glucose, amino acids, fatty acids"]] },
  { type: "paragraph", text: "The ileum absorbs it all: kilometres of villi and microvilli (surface), one-cell walls (short distance), dense capillaries and lacteals (steep gradient, constant removal)." },
  { type: "example", text: "Visking tubing filled with starch in a water bath: test outside water — starch stays (too big), glucose appears. The classic gut model; learn the set-up cold." },
  { type: "heading", level: 2, text: "2. Circulation — the double pump" },
  { type: "paragraph", text: "Humans run a double circulation: pulmonary (heart → lungs → heart) oxygenates blood; systemic (heart → body → heart) delivers it. Four chambers, one-way valves, coronary arteries feeding the muscle itself." },
  { type: "table", headers: ["Vessel", "Wall", "Pressure"], rows: [["Artery", "Thick muscle + elastic", "High, pulsing"], ["Capillary", "One cell thick", "Low — exchange zone"], ["Vein", "Thin, valves", "Low — squeezed back by muscles"]] },
  { type: "definition", term: "Blood", text: "Plasma (water, nutrients, hormones) + red cells (haemoglobin, no nucleus) + white cells (defence) + platelets (clotting)." },
  { type: "callout", variant: "warning", text: "Exam trap: the pulmonary ARTERY carries deoxygenated blood and the pulmonary VEIN carries oxygenated — the only vessels that break the rule. Always qualify." },
  { type: "heading", level: 2, text: "3. Breathing and gas exchange" },
  { type: "paragraph", text: "Inhalation: ribs up/out, diaphragm flattens, volume up, pressure down — air in. Alveoli (millions, one cell thick, wrapped in capillaries) swap oxygen for carbon dioxide down diffusion gradients. Exhalation reverses it all." },
  { type: "example", text: "Limewater turns milky with exhaled air faster than inhaled air — exhaled air carries ~4% CO₂ versus 0.04% in. The bell-jar model demonstrates the pressure mechanism." },
  { type: "heading", level: 2, text: "4. Control — nerves and hormones" },
  { type: "paragraph", text: "Nerves are fast, electrical, short-lived and targeted (reflex arc: receptor → sensory → relay → motor → effector — e.g. jerking from heat). Hormones are slow, blood-borne, long-lasting and broad." },
  { type: "table", headers: ["Hormone", "Gland", "Job"], rows: [["Insulin", "Pancreas", "Lowers blood glucose (liver stores glycogen)"], ["Adrenaline", "Adrenal", "Fight-or-flight: heart, breathing, glucose up"], ["ADH", "Pituitary", "Kidney reabsorbs more water when dehydrated"]] },
  { type: "paragraph", text: "Blood glucose is the model negative-feedback loop: high → insulin → liver stores; low → glucagon → liver releases. Diabetes is this loop broken — Type 1 (no insulin) versus Type 2 (ignored insulin)." },
  { type: "heading", level: 2, text: "5. Excretion — the kidney" },
  { type: "paragraph", text: "Each nephron filters blood at the glomerulus, then reabsorbs all glucose, most water and salts along the tubule; ADH tunes the final water saved. Urine = urea + excess salts + water. Dialysis machines do this job artificially when kidneys fail." },
];
const PHYSIO_QS: Q[] = [
  { q: "Protein digestion begins in the", o: ["mouth", "stomach", "duodenum", "ileum"], a: "stomach", e: "Pepsin works in acid pH on proteins.", d: "easy" },
  { q: "Bile aids digestion by", o: ["containing lipase", "emulsifying fats", "neutralising acid only", "absorbing vitamins"], a: "emulsifying fats", e: "Bile has no enzymes; it raises surface area for lipase.", d: "medium" },
  { q: "The pulmonary vein carries blood that is", o: ["deoxygenated to the lungs", "oxygenated to the heart", "deoxygenated to the heart", "mixed"], a: "oxygenated to the heart", e: "The exception: a vein carrying oxygenated blood.", d: "medium" },
  { q: "During inhalation, the diaphragm", o: ["domes upward", "flattens downward", "relaxes fully", "stops moving"], a: "flattens downward", e: "Volume rises, pressure falls, air flows in.", d: "easy" },
  { q: "A reflex arc passes through neurones in the order", o: ["motor–relay–sensory", "sensory–relay–motor", "relay–sensory–motor", "sensory–motor–relay"], a: "sensory–relay–motor", e: "Receptor → sensory → CNS relay → motor → effector.", d: "medium" },
  { q: "Insulin lowers blood glucose by causing the liver to", o: ["release glucagon", "convert glucose to glycogen", "stop filtering blood", "secrete adrenaline"], a: "convert glucose to glycogen", e: "Glycogenesis stores the excess.", d: "medium" },
  { q: "ADH increases when the body is dehydrated so the kidney", o: ["excretes more urea", "reabsorbs more water", "filters faster", "stops working"], a: "reabsorbs more water", e: "Small volumes of concentrated urine result.", d: "medium" },
  { q: "Which vessel has valves to prevent backflow?", o: ["Aorta", "Renal artery", "Vena cava (veins)", "Pulmonary capillary"], a: "Vena cava (veins)", e: "Low-pressure veins need valves; arteries pulse.", d: "easy" },
  { q: "Limewater turns milky fastest with", o: ["inhaled air", "exhaled air", "pure oxygen", "nitrogen"], a: "exhaled air", e: "Exhaled air holds ~4% CO₂.", d: "easy" },
  { q: "Dialysis fluid must match blood plasma in", o: ["urea content", "glucose and salt concentration", "temperature only", "protein content"], a: "glucose and salt concentration", e: "Only wastes diffuse out down their gradients.", d: "hard" },
];

const ECOLOGY_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Ecosystems — the cast and the stage" },
  { type: "paragraph", text: "An ecosystem is a community plus its non-living setting: habitat (address), population (one species), community (all species). Biotic factors (competition, predation) and abiotic ones (light, water, pH, temperature) decide who thrives." },
  { type: "definition", term: "Feeding levels", text: "Producer (photosynthesiser) → primary consumer (herbivore) → secondary consumer (carnivore) → decomposer (bacteria, fungi — recycling everything)." },
  { type: "example", text: "Grass → grasshopper → frog → snake → hawk: one chain. Real habitats weave chains into webs — remove frogs and snakes starve while grasshoppers explode." },
  { type: "heading", level: 2, text: "2. Energy and pyramids" },
  { type: "paragraph", text: "Only ~10% of energy passes each level — the rest is lost as heat, movement, and uneaten parts. Hence pyramids of numbers and biomass narrow upward, and food chains rarely exceed five links: there is simply no energy left." },
  { type: "callout", variant: "info", text: "Why eating lower is efficient: a kilogram of grain feeds far more people directly than feeding it to cattle first — every level taxes 90%." },
  { type: "heading", level: 2, text: "3. Nutrient cycles" },
  { type: "table", headers: ["Cycle", "Key steps"], rows: [["Carbon", "Photosynthesis fixes CO₂; respiration, combustion, decay release it"], ["Nitrogen", "Fixation (lightning, Rhizobium) → nitrates → plants → denitrification back to N₂"], ["Water", "Evaporation, transpiration, condensation, precipitation, percolation"]] },
  { type: "example", text: "Legume root nodules house Rhizobium, which fixes nitrogen — the biological reason crop rotation with beans restores tired soil." },
  { type: "heading", level: 2, text: "4. Natural selection — Darwin's engine" },
  { type: "paragraph", text: "Variation exists in every population. The best-adapted survive and breed (survival of the fittest), passing their alleles on. Over generations the population shifts — antibiotic-resistant bacteria and pesticide-resistant pests are selection happening in our lifetime." },
  { type: "definition", term: "Speciation", text: "When populations isolate (mountains, rivers) and diverge until interbreeding fails — one species becomes two. Finch beaks on Galápagos islands are the textbook case." },
  { type: "heading", level: 2, text: "5. Humans and biodiversity" },
  { type: "paragraph", text: "Deforestation, pollution, and overharvesting shrink habitats; conservation answers with reserves, seed banks, quotas, and laws. Every past paper asks you to balance development against diversity — name one local example (e.g. mangrove loss, oil spills) and argue both sides." },
];
const ECOLOGY_QS: Q[] = [
  { q: "Decomposers are essential because they", o: ["eat producers", "recycle nutrients from dead matter", "pollinate flowers", "fix nitrogen only"], a: "recycle nutrients from dead matter", e: "Bacteria and fungi return locked nutrients to soil.", d: "easy" },
  { q: "In a food chain, the secondary consumer is a", o: ["producer", "herbivore", "carnivore eating herbivores", "decomposer"], a: "carnivore eating herbivores", e: "Trophic levels: producer → primary → secondary.", d: "easy" },
  { q: "Pyramids of biomass narrow upward mainly because", o: ["animals shrink", "energy is lost between levels", "producers die", "decomposers eat carnivores"], a: "energy is lost between levels", e: "~90% lost as heat, movement, waste.", d: "medium" },
  { q: "Nitrogen-fixing Rhizobium lives in", o: ["cereal leaves", "legume root nodules", "animal guts", "ocean water"], a: "legume root nodules", e: "The symbiosis behind crop rotation.", d: "medium" },
  { q: "Natural selection requires", o: ["identical offspring", "variation and differential survival", "no predators", "stable climate"], a: "variation and differential survival", e: "Variants best adapted pass on alleles.", d: "medium" },
  { q: "Antibiotic resistance in bacteria is best explained by", o: ["individual bacteria learning", "selection of resistant variants", "weaker antibiotics", "larger doses"], a: "selection of resistant variants", e: "Resistant mutants survive treatment and multiply.", d: "medium" },
  { q: "Which human activity directly causes eutrophication?", o: ["Planting trees", "Fertiliser runoff into lakes", "Recycling paper", "Using solar power"], a: "Fertiliser runoff into lakes", e: "Nutrient overload → algal blooms → oxygen crash.", d: "medium" },
  { q: "A new species forms when isolated populations", o: ["share food", "diverge until interbreeding fails", "migrate together", "eat more"], a: "diverge until interbreeding fails", e: "Reproductive isolation defines speciation.", d: "hard" },
  { q: "Carbon is returned to the atmosphere by", o: ["photosynthesis only", "respiration, combustion and decay", "rainfall", "nitrogen fixation"], a: "respiration, combustion and decay", e: "All three oxidise carbon compounds to CO₂.", d: "easy" },
  { q: "Conserving mangroves protects coastlines because they", o: ["absorb wave energy and nurse fisheries", "produce timber only", "block all fishing", "dry the soil"], a: "absorb wave energy and nurse fisheries", e: "Roots buffer storms; nurseries sustain stocks.", d: "hard" },
];

const PLANT_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Moving water up — transpiration pull" },
  { type: "paragraph", text: "A tall tree lifts hundreds of litres daily with no pump: roots absorb by osmosis, xylem vessels carry a continuous water column, and evaporation from leaves (transpiration) pulls it upward — cohesion-tension." },
  { type: "definition", term: "Transpiration factors", text: "Heat, wind, and low humidity speed loss; stomata close at night and in drought. The potometer measures uptake as a proxy for loss." },
  { type: "example", text: "A leafy shoot in a potometer absorbs water fastest in moving warm air — the classic required practical. Control: same shoot, still cold air, and compare." },
  { type: "heading", level: 2, text: "2. Food distribution — translocation" },
  { type: "paragraph", text: "Phloem sieves carry sugars from sources (leaves) to sinks (roots, fruits, growing tips), up or down as needed. Ringing a stem (removing phloem) starves roots while xylem keeps leaves watered — the girdling experiment." },
  { type: "heading", level: 2, text: "3. Sensing — tropisms and hormones" },
  { type: "table", headers: ["Response", "Stimulus", "Example"], rows: [["Phototropism", "Light", "Shoots bend toward light (auxin gathers on shaded side)"], ["Geotropism", "Gravity", "Roots grow down, shoots up"], ["Hydrotropism", "Water", "Roots toward moisture"]] },
  { type: "paragraph", text: "Auxins steer growth; gibberellins break dormancy and elongate stems (sprayed to grow seedless grapes); seed germination itself needs water, oxygen, and warmth — light only for some seeds." },
  { type: "heading", level: 2, text: "4. Reproduction — the flower" },
  { type: "paragraph", text: "Petals advertise, anthers release pollen, stigmas catch it. Pollination (transfer) precedes fertilisation (fusion): pollen tube grows down the style, male nucleus fuses the ovule → zygote; ovary wall becomes fruit, ovules become seeds." },
  { type: "table", headers: ["", "Wind-pollinated", "Insect-pollinated"], rows: [["Pollen", "Light, smooth, abundant", "Sticky, heavy"], ["Flowers", "Small, dull, no scent", "Large, bright, scented"], ["Stigma/anthers", "Exposed, feathery", "Inside, sticky"]] },
  { type: "example", text: "Maize tassels shed clouds of pollen onto feathery silks — wind doing openly what bees do privately for hibiscus." },
  { type: "heading", level: 2, text: "5. Spreading seeds" },
  { type: "paragraph", text: "Wind (parachutes, wings), water (floating fibres), animals (hooks, tasty fruits), explosion (peas) — each dispersal matches a structure. Test germination requirements with cotton-wool dishes: wet vs dry, warm vs cold, air vs oil-covered." },
  { type: "callout", variant: "warning", text: "Exam trap: pollination is TRANSFER of pollen; fertilisation is FUSION of gametes. Conflating them loses both marks." },
];
const PLANT_QS: Q[] = [
  { q: "Water rises in xylem mainly by", o: ["root pressure only", "transpiration pull", "phloem pumping", "leaf pressure"], a: "transpiration pull", e: "Evaporation pulls a cohesive water column upward.", d: "easy" },
  { q: "A potometer measures", o: ["photosynthesis rate", "water uptake by a shoot", "soil pH", "seed weight"], a: "water uptake by a shoot", e: "Uptake proxies transpiration under set conditions.", d: "easy" },
  { q: "Translocation of sugars occurs in the", o: ["xylem", "phloem", "cambium", "pith"], a: "phloem", e: "Sieve tubes move food source to sink.", d: "easy" },
  { q: "Shoots bending toward light is", o: ["geotropism", "phototropism", "hydrotropism", "chemotropism"], a: "phototropism", e: "Auxin on the shaded side elongates cells.", d: "easy" },
  { q: "After fertilisation, the ovary wall becomes the", o: ["seed", "fruit", "embryo", "flower"], a: "fruit", e: "Ovules become seeds inside the fruit.", d: "medium" },
  { q: "Wind-pollinated flowers typically have", o: ["large scented petals", "small dull flowers with feathery stigmas", "sticky heavy pollen", "nectar guides"], a: "small dull flowers with feathery stigmas", e: "Exposed structures catch drifting pollen.", d: "medium" },
  { q: "Gibberellins are used commercially to", o: ["kill weeds", "grow seedless grapes", "stop germination", "close stomata"], a: "grow seedless grapes", e: "They elongate stems and break dormancy.", d: "medium" },
  { q: "Seeds need water, oxygen and warmth to germinate; the experiment uses", o: ["soil only", "cotton wool with controlled conditions", "direct sun always", "fertiliser"], a: "cotton wool with controlled conditions", e: "Wet/dry × warm/cold × air/no-air dishes isolate factors.", d: "medium" },
  { q: "Girdling (removing phloem ring) starves the", o: ["leaves of water", "roots of food", "flowers of pollen", "stem of light"], a: "roots of food", e: "Xylem still waters leaves; sugars can't descend.", d: "hard" },
  { q: "Double fertilisation in flowering plants produces", o: ["two seeds", "zygote and endosperm", "two fruits", "twin embryos"], a: "zygote and endosperm", e: "One fusion makes the embryo, one the food store.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const boards = await prisma.curriculumBoard.findMany({ select: { id: true } });
    if (!boards.length) throw new Error("No boards found");
    const topics: { slug: string; title: string; blocks: B[]; qs: Q[] }[] = [
      { slug: "genetics-molecular-biology", title: "Genetics & Molecular Biology", blocks: GENETICS_BLOCKS, qs: GENETICS_QS },
      { slug: "human-physiology", title: "Human Physiology", blocks: PHYSIO_BLOCKS, qs: PHYSIO_QS },
      { slug: "ecology-evolution", title: "Ecology & Evolution", blocks: ECOLOGY_BLOCKS, qs: ECOLOGY_QS },
      { slug: "plant-biology", title: "Plant Biology", blocks: PLANT_BLOCKS, qs: PLANT_QS },
    ];
    const done: Record<string, number> = {};
    for (const t of topics) {
      const topic = await prisma.topic.findFirst({ where: { slug: t.slug } });
      if (!topic) throw new Error(`Topic missing: ${t.slug}`);
      const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id } });
      if (lesson) await prisma.lesson.update({ where: { id: lesson.id }, data: { title: `${t.title} — Complete`, content: { blocks: t.blocks } as object, estimatedMinutes: 45 } });
      else await prisma.lesson.create({ data: { domain: "highschool", topicId: topic.id, title: `${t.title} — Complete`, content: { blocks: t.blocks } as object, orderIndex: 0, estimatedMinutes: 45 } });
      for (let i = 0; i < t.qs.length; i++) {
        const item = t.qs[i];
        await prisma.question.upsert({
          where: { id: `master-${t.slug}-q${i + 1}` },
          update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
          create: { id: `master-${t.slug}-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        });
      }
      for (const board of boards) {
        const existing = await prisma.topicBoardAlignment.findFirst({ where: { topicId: topic.id, boardId: board.id, trackId: null } });
        if (existing) await prisma.topicBoardAlignment.update({ where: { id: existing.id }, data: { tier: "core", verifiedDate: today, weightNotes: `CORE: ${t.title} in all 20 regions.` } });
        else await prisma.topicBoardAlignment.create({ data: { topicId: topic.id, boardId: board.id, trackId: null, tier: "core", verifiedDate: today, weightNotes: `CORE: ${t.title} in all 20 regions.` } });
      }
      await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today, needsVerification: false } });
      done[t.slug] = t.blocks.length;
    }
    return NextResponse.json({ ok: true, topics: done, questionsPerTopic: 10, boards: boards.length });
  } catch (e) {
    console.error("temp biology batch failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
