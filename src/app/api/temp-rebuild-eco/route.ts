import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Biology Topic 5: Ecology & Evolution standard chapter at the
// no-exceptions bar. Advanced guide + appendix remain as the deeper layer.

const ECO_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. The evidence — five independent witnesses" },
  { type: "table", headers: ["Evidence", "What it shows", "Landmark example"], rows: [["Fossil record", "Change through time; transitional forms bridge groups", "Archaeopteryx (reptile→bird), Tiktaalik (fish→land vertebrate)"], ["Homologous structures", "Same bones, different jobs — common ancestor reshaping one plan", "Human arm, whale flipper, bat wing"], ["Analogous structures", "Same job, different build — convergent evolution", "Insect vs bird wing"], ["Vestigial structures", "Organs past usefulness, kept by inheritance", "Human appendix, whale hip bones"], ["Molecular homology", "DNA/protein similarity tracks relatedness", "Cytochrome c nearly identical human vs chimp; yeast much further"]] },
  { type: "paragraph", text: "Biogeography adds the map: marsupials radiated across an isolated Australia, and island species resemble near-mainland ancestors. The argument's power is CONVERGENCE of independent lines — any one witness could be mistaken; five agreeing is why evolution is the framework of biology." },
  { type: "heading", level: 2, text: "2. Darwin's mechanism — and Lamarck's mistake" },
  { type: "paragraph", text: "Lamarck proposed acquired characteristics inherited (giraffe stretches, offspring inherit longer necks): wrong mechanism — somatic changes do not reach gametes — but correct that species change. Darwin and Wallace supplied natural selection: variation exists, is heritable; resources are limited; the best-adapted leave more offspring; the population shifts generation by generation. Selection acts on individuals; evolution happens to populations — the sentence examiners keep testing." },
  { type: "example", text: "Evolution observed live: expose Staphylococcus to incomplete penicillin courses. The rare resistant mutant (already present — not 'created' by the drug) survives and multiplies; the population becomes resistant within weeks. The mutation was random; the selection was directional — this is the experiment that settles the 'only a theory' objection, and a guaranteed source of application questions." },
  { type: "heading", level: 2, text: "3. Three modes of selection" },
  { type: "paragraph", text: "Directional selection shifts a trait's peak toward one extreme (antibiotic resistance, industrial melanism in peppered moths); stabilising selection culls both extremes and narrows the distribution (human birth weight — too small and too large both die more); disruptive selection favours BOTH extremes over the mean, splitting the population (finch beaks exploiting large vs small seeds, mid-sized inefficient at both)." },
  { type: "diagram", diagramId: "selection-modes", caption: "Before and after peaks" },
  { type: "heading", level: 2, text: "4. Hardy–Weinberg — the equilibrium that proves change" },
  { type: "definition", term: "The equations", text: "p + q = 1 (allele frequencies); p² + 2pq + q² = 1 (genotype frequencies). Five criteria keep a population at equilibrium: huge size, no migration, no mutation, random mating, no selection. Any departure from expected frequencies means one criterion broke — which IS evolution happening." },
  { type: "example", text: "Worked: a recessive disease appears in 1/2,500 births. q² = 1/2500 → q = 1/50 = 0.02. p = 0.98. Carriers 2pq = 2 × 0.98 × 0.02 ≈ 0.039 — about 1 in 26 people carry the allele silently, 20× more than those affected. The exam trick: squares and square roots, allele first, carriers second, always showing the substitution." },
  { type: "heading", level: 2, text: "5. The other engines — drift, flow, mutation, mating" },
  { type: "table", headers: ["Mechanism", "Definition", "Signature case"], rows: [["Genetic drift", "Chance allele changes in small populations", "Founder effect: Amish polydactyly from one couple; bottleneck: cheetahs' near-zero variation after ice ages"], ["Gene flow", "Migration moving alleles between populations", "Wolves dispersing between packs"], ["Mutation", "New alleles — the only novel source", "Rate ~10⁻⁵–10⁻⁶ per gene; slow alone, raw material for selection"], ["Non-random mating", "Assortative mating shifts genotype frequencies", "Inbreeding exposing recessive disorders"]] },
  { type: "heading", level: 2, text: "6. Speciation — one species becomes two" },
  { type: "paragraph", text: "The biological species concept says species interbreed fertile offspring in nature; fossils and asexuals force morphological/ecological/phylogenetic alternatives. Barriers are pre-zygotic (geographic, temporal, behavioural, mechanical, gametic — mating fails) and post-zygotic (hybrids inviable, sterile like mules, or breakdown in later generations). Allopatric speciation splits populations geographically (a river, a valley — Darwin's finches on separate islands); sympatric happens in the same place — plant polyploidy in one generation, habitat shifts, or sexual selection." },
  { type: "diagram", diagramId: "phylogeny-speciation", caption: "Tree reading and the barrier split" },
  { type: "paragraph", text: "Cladograms group by shared DERIVED characters: sister taxa share the newest node, the outgroup roots the direction, and only monophyletic groups (ancestor plus ALL its descendants) are valid clades — 'reptiles' excluding birds is paraphyletic, a favourite exam example of a broken group." },
  { type: "heading", level: 2, text: "7. Population dynamics — counting the wild" },
  { type: "paragraph", text: "Population size = births + immigration − deaths − emigration. Density-dependent checks (competition, disease, predation — stronger as crowds grow) meet density-independent ones (frost, floods — blind to density). Unlimited resources give exponential J-growth; environmental resistance bends it to logistic S-growth levelling at carrying capacity K." },
  { type: "diagram", diagramId: "growth-survivorship", caption: "J vs S; survivorship I, II, III" },
  { type: "table", headers: ["Strategy", "r-selected", "K-selected"], rows: [["Offspring", "Many, small, no care", "Few, large, heavy care"], ["Survivorship", "Type III — most die young", "Type I — most die old"], ["Habitat", "Unstable, opportunistic", "Stable, competitive"], ["Examples", "Fish, insects, weeds", "Elephants, whales, humans"]] },
  { type: "example", text: "Required practical — sampling: random quadrats estimate sessile density (random coordinates remove observer bias); belt transects read zonation across a gradient (shore to dune). For mobile animals, mark-release-recapture: population = (marked₁ × total₂) ÷ recaptured. Worked: 40 marked, later 50 caught with 10 marked → (40 × 50)/10 = 200. Assumptions to state: no births/deaths/migration between samples, marks persist — each is a named mark-scheme point." },
  { type: "heading", level: 2, text: "8. Communities — interactions, niches, cascades" },
  { type: "table", headers: ["Interaction", "Score", "Cases"], rows: [["Mutualism", "+/+", "Mycorrhizae, cleaner wrasse, lichen"], ["Commensalism", "+/0", "Barnacles on whales, epiphytes on branches"], ["Parasitism", "+/−", "Tapeworm, mistletoe"], ["Predation / herbivory", "+/−", "The eat-or-be-eaten pair"]] },
  { type: "paragraph", text: "Competitive exclusion says two species cannot share one niche; the loser goes extinct, migrates, or evolves — resource partitioning (different seed sizes) or character displacement (Galápagos finches' beaks diverging where they co-occur). Fundamental niche is the full range alone; realised niche is what competition leaves. Keystone species punch above their weight: remove sea otters and urchins mow down kelp forests — the trophic cascade every exam cycles back to." },
  { type: "diagram", diagramId: "niche-cascade", caption: "Realised niche; otter-urchin-kelp" },
  { type: "heading", level: 2, text: "9. Energy and matter — flow versus cycle" },
  { type: "paragraph", text: "Energy flows once: producers fix ~1% of sunlight; herbivores bank ~10% of that; each level taxes 90% to heat, movement, and uneaten parts. Worked: 10,000 J of producer energy funds ~1,000 J of herbivore growth, ~100 J of primary carnivore, ~10 J of top predator — why chains rarely pass five links and why pyramids narrow. Matter, by contrast, cycles." },
  { type: "table", headers: ["Cycle", "Key steps (name them in order)"], rows: [["Carbon", "Photosynthesis fixes CO₂; respiration/combustion/decay return it; oceans dissolve vast reserves"], ["Nitrogen", "Fixation (N₂ → nitrate: lightning, Rhizobium in legume nodules) → assimilation into plant protein → feeding chains → ammonification (decay) → nitrification → denitrification closes to N₂"], ["Phosphorus", "No gaseous phase: weathering of rock → soil → organisms → sedimentation — the slow, leaky cycle"], ["Water", "Evaporation + transpiration → condensation → precipitation → percolation"]] },
  { type: "diagram", diagramId: "nitrogen-pyramid", caption: "N-fixers and the 10% pyramid" },
  { type: "heading", level: 2, text: "10. Measuring diversity — Simpson's index" },
  { type: "example", text: "Simpson's D = Σ(n/N)²: counts 10, 5, 5 (N=20) → (0.5)² + (0.25)² + (0.25)² = 0.25 + 0.0625 + 0.0625 = 0.375. LOWER D means MORE diverse (D is the chance two random individuals are the same species). Two habitats with identical species counts can differ entirely in evenness — the calculation separates them, which is why examiners ask it." },
  { type: "heading", level: 2, text: "11. Human impact — HIPPCO and the poisoned chain" },
  { type: "definition", term: "HIPPCO", text: "Habitat destruction, Invasive species, Population growth, Pollution, Climate change, Overexploitation — the six drivers of biodiversity loss, in rough order of damage. Name the driver in every case study; 'human activity' alone never earns the mark." },
  { type: "paragraph", text: "Eutrophication runs a causal chain examiners expect link by link: fertiliser runoff → algal bloom (excess N/P) → algae die, bacteria decompose the bloom → aerobic bacteria strip the water's O₂ → hypoxia kills fish. Toxins climb the opposite way: biomagnification concentrates stable, fat-soluble chemicals up each trophic step — DDT thinned raptors' eggs; microplastics now ride the same ladder. Climate change acidifies oceans (CO₂ + H₂O → carbonic acid) and shifts ranges poleward — answers must name the mechanism, not just the trend." },
  { type: "diagram", diagramId: "biomagnification", caption: "Toxins up, oxygen down" },
  { type: "heading", level: 2, text: "12. Conservation and summary" },
  { type: "table", headers: ["", "Allopatric", "Sympatric"], rows: [["Barrier", "Geographic", "None — same area"], ["Mechanism", "Isolation → divergence", "Polyploidy, habitat, sexual selection"], ["Example", "Darwin's finches", "Wheat polyploidy"]] },
  { type: "callout", variant: "info", text: "Essay rule for ecology: every claim needs its mechanism (WHY) plus one named example (WHERE). 'Deforestation reduces biodiversity' earns one mark; 'it removes habitat and fragments populations, isolating gene pools — as in Atlantic forest fragments' earns three." },
];

const ECO_QS: Q[] = [
  { q: "Homologous structures such as the human arm and whale flipper indicate", o: ["convergent evolution", "common ancestry modifying one plan", "identical function", "random mutation"], a: "common ancestry modifying one plan", e: "Same bones, different jobs — descent with modification.", d: "easy" },
  { q: "In natural selection, antibiotics", o: ["create resistant mutants", "select for resistant variants already present", "weaken bacteria directly", "cause mutation in all cells"], a: "select for resistant variants already present", e: "Mutation is random; selection is directional.", d: "medium" },
  { q: "Human birth weight, where extremes die more, illustrates", o: ["directional selection", "stabilising selection", "disruptive selection", "genetic drift"], a: "stabilising selection", e: "The mean wins; both tails lose.", d: "medium" },
  { q: "With q² = 1/2,500, the carrier frequency is about", o: ["1/2,500", "1/50", "1/26", "1/100"], a: "1/26", e: "q=0.02, p=0.98, 2pq≈0.039. Carriers far outnumber the affected.", d: "hard" },
  { q: "The founder effect is a form of", o: ["gene flow", "genetic drift", "mutation", "selection"], a: "genetic drift", e: "Chance allele shifts in small populations — Amish polydactyly.", d: "easy" },
  { q: "A mule (horse × donkey, sterile) shows which barrier?", o: ["Pre-zygotic, gametic", "Post-zygotic — reduced hybrid fertility", "Temporal", "Mechanical"], a: "Post-zygotic — reduced hybrid fertility", e: "Mating succeeded; development betrayed the mismatch.", d: "medium" },
  { q: "In mark-release-recapture, 40 marked, 60 caught, 12 recaptured: population ≈", o: ["200", "120", "48", "600"], a: "200", e: "(40 × 60)/12 = 200 — show the substitution.", d: "medium" },
  { q: "10,000 J at producer level funds about how much secondary-carnivore production?", o: ["1,000 J", "100 J", "10 J", "5,000 J"], a: "10 J", e: "10% per level: 10,000 → 1,000 → 100 → 10.", d: "medium" },
  { q: "Eutrophication kills fish mainly because", o: ["fertiliser is toxic", "decomposers of the algal bloom exhaust the oxygen", "algae clog gills only", "water gets too warm"], a: "decomposers of the algal bloom exhaust the oxygen", e: "Bloom → decay → hypoxia — the causal chain earns the marks.", d: "hard" },
  { q: "Simpson's D for counts 10, 5, 5 is", o: ["0.375 — less diverse", "0.625 — more diverse", "0.500", "1.000"], a: "0.375 — less diverse", e: "D = chance of a same-species pair: (0.5²+0.25²+0.25²)=0.375. Lower D = richer.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "ecology-evolution" } });
    if (!topic) throw new Error("master ecology-evolution topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("ecology standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Ecology & Evolution — Complete", content: { blocks: ECO_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < ECO_QS.length; i++) {
      const item = ECO_QS[i];
      await prisma.question.upsert({
        where: { id: `master-ecology-evolution-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-ecology-evolution-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "ecology-rebuild", blocks: ECO_BLOCKS.length, questions: ECO_QS.length });
  } catch (e) {
    console.error("rebuild ecology failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
