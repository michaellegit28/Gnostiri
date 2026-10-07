import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

// TEMPORARY advanced ecology guide seeder — DELETE after confirmed.
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const topic = await prisma.topic.findFirst({ where: { slug: "ecology-evolution" }, include: { lessons: { orderBy: { orderIndex: "asc" } } } });
    if (!topic) throw new Error("ecology-evolution topic missing");
    const blocks = [
      { type: "heading", level: 2, text: "1. Evidence and the Lamarck–Darwin split" },
      { type: "paragraph", text: "Lamarck proposed inheritance of acquired traits (giraffes stretch, offspring inherit long necks) — wrong mechanism, right instinct that species change. Darwin and Wallace supplied selection: fossils and transitional forms (Archaeopteryx, Tiktaalik), homologous limbs (whale flipper, bat wing, human arm — same bones, different jobs) versus analogous wings (convergent evolution), vestigial structures (whale hips, human appendix), biogeography (marsupials in Australia), and molecular homologies — cytochrome c barely differs between humans and chimpanzees, increasingly so to yeast." },
      { type: "heading", level: 2, text: "2. Hardy–Weinberg and the forces of change" },
      { type: "paragraph", text: "p + q = 1 (alleles) and p² + 2pq + q² = 1 (genotypes) describe a population at rest — requiring large size, no migration, no mutation, random mating, and no selection. Any departure proves evolution is happening. Example: if q² (recessive disease) = 1/2500, q = 1/50 and carriers 2pq ≈ 1/25." },
      { type: "definition", term: "Five mechanisms", text: "Natural selection (differential reproduction), genetic drift (founder and bottleneck effects in small populations), gene flow (migration), mutation (raw novelty), non-random mating." },
      { type: "paragraph", text: "Selection modes move trait peaks: directional (one extreme wins — antibiotic resistance), stabilising (the average wins — human birth weight), disruptive (both extremes win — finch beak sizes splitting resources)." },
      { type: "diagram", diagramId: "selection-modes", caption: "Before/after peaks" },
      { type: "heading", level: 2, text: "3. Species, isolation, trees" },
      { type: "paragraph", text: "The biological species concept (can interbreed) fails for fossils and asexuals — morphological, ecological, and phylogenetic definitions fill in. Barriers come pre-zygotic (geographic, temporal, behavioural, mechanical, gametic) and post-zygotic (dead, sterile, or broken-down hybrids)." },
      { type: "paragraph", text: "Allopatric speciation splits populations geographically; sympatric splits them in place (plant polyploidy, habitat shifts, sexual selection). Cladograms group by shared derived characters: sister taxa share the newest node, outgroups root the tree, and only monophyletic groups (ancestor + ALL descendants) are valid clades." },
      { type: "diagram", diagramId: "phylogeny-speciation", caption: "Tree reading plus barrier split" },
      { type: "heading", level: 2, text: "4. Populations and behaviour" },
      { type: "paragraph", text: "Size changes via births, deaths, immigration, emigration — checked by density-dependent factors (competition, disease, predation) and density-independent ones (storms, frost). Unlimited resources give J-curve exponential growth; resistance bends it to the S-curve capped at carrying capacity K." },
      { type: "definition", term: "Life strategies", text: "r-selected: many small offspring, no care (fish, weeds) — Type III survivorship. K-selected: few large offspring, heavy care (elephants, humans) — Type I. Type II (birds) declines steadily between." },
      { type: "paragraph", text: "Behaviour ranges from innate reflexes to learning; social species signal, cooperate, and even sacrifice — altruism pays via kin selection and inclusive fitness (helping copies of your own genes)." },
      { type: "diagram", diagramId: "growth-survivorship", caption: "J vs S curves; I/II/III survival" },
      { type: "heading", level: 2, text: "5. Communities, niches, succession" },
      { type: "paragraph", text: "Interactions score (+/+ mutualism, +/0 commensalism, +/− parasitism, predation, herbivory). Competition excludes (one species per niche) unless resource partitioning or character displacement divides the prize; fundamental niches shrink to realised ones under rivals." },
      { type: "paragraph", text: "Keystone species (sea otters, wolves) hold communities together — remove them and trophic cascades collapse diversity top-down. Bare rock → pioneers → soil → climax is primary succession; disturbance recovery is secondary." },
      { type: "diagram", diagramId: "niche-cascade", caption: "Niches plus otter–urchin–kelp cascade" },
      { type: "heading", level: 2, text: "6. Energy, cycles, and the human wound" },
      { type: "paragraph", text: "Energy flows one way (10% rule; pyramids of energy, biomass, numbers); matter cycles. Carbon (photosynthesis↔respiration/combustion), nitrogen (fixation→nitrification→assimilation→ammonification→denitrification), phosphorus (weathering, sediment-bound), water (evaporation→precipitation). Productivity splits primary (makers) from secondary (eaters)." },
      { type: "diagram", diagramId: "nitrogen-pyramid", caption: "N cycle plus 10% pyramid" },
      { type: "paragraph", text: "HIPPCO drives loss: Habitat destruction, Invasives, Population growth, Pollution, Climate change, Overexploitation. Toxins biomagnify upward (DDT thinned eagle eggs; microplastics climb now); fertiliser runoff eutrophicates waters (bloom → decay → hypoxia → die-off). Warming acidifies oceans, fragments habitats, and shifts ranges poleward." },
      { type: "diagram", diagramId: "biomagnification", caption: "Toxins up; eutrophication steps" },
      { type: "heading", level: 2, text: "7. Summary tables" },
      { type: "table", headers: ["", "Allopatric", "Sympatric"], rows: [["Barrier", "Geographic", "None (same area)"], ["Mechanism", "Isolation then divergence", "Polyploidy, habitat, selection"], ["Example", "Darwin's finches", "Wheat polyploidy"]] },
      { type: "table", headers: ["", "r-selected", "K-selected"], rows: [["Offspring", "Many, small", "Few, large"], ["Care", "None", "Heavy"], ["Curve", "Type III", "Type I"], ["Example", "Fish, weeds", "Elephants, humans"]] },
    ];
    if (topic.lessons.length > 1) {
      await prisma.lesson.update({ where: { id: topic.lessons[1].id }, data: { title: "Ecology & Evolution — Advanced", content: { blocks } as object, estimatedMinutes: 60 } });
    } else {
      await prisma.lesson.create({ data: { domain: "highschool", topicId: topic.id, title: "Ecology & Evolution — Advanced", content: { blocks } as object, orderIndex: 1, estimatedMinutes: 60 } });
    }
    return NextResponse.json({ ok: true, advancedBlocks: blocks.length, diagrams: 6 });
  } catch (e) {
    console.error("temp adveco failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
