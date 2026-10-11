import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Tech/Voc Topic 2: Agriculture at the no-exceptions bar:
// soil profile and fertility, crop science and propagation, rotation and NPK,
// pests and IPM, animal husbandry, records and gross margin, sustainability.

const AGR_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Agriculture — primary production under management" },
  { type: "definition", term: "Agriculture", text: "The managed production of CROPS and LIVESTOCK — primary industry feeding every other one. Branches: crop production, animal husbandry, forestry, fisheries, and agricultural economics (the records that turn farming into a business). Modern agriculture = biology + economics: every practice must be justified by yield, cost, or sustainability — preferably all three." },
  { type: "example", text: "Worked: a maize field is a biological system managed for grain — the agronomy (spacing, fertiliser, weeding) AND the account book (inputs vs output) both decide whether it succeeds. Name both sides; farming is a business is the exam's stance." },
  { type: "heading", level: 2, text: "2. Soil — the profile, texture, pH and fertility" },
  { type: "definition", term: "Soil profile", text: "Layers (horizons) from top: O (organic litter) → A (TOPSOIL — humus + roots, where fertility lives) → B (SUBSOIL — minerals leached from above, less organic) → C (weathered parent rock) → bedrock. EROSION attacks the A horizon first — losing topsoil loses the farm's fertility bank. Texture: SAND (drains fast, holds little), CLAY (holds water and nutrients, drains poorly, compacts), LOAM (the balanced ideal)." },
  { type: "diagram", diagramId: "soil-profile", caption: "O, A, B, C horizons — topsoil is the fertility bank erosion steals first" },
  { type: "example", text: "Worked: a sandy soil dries fast and leaks nutrients — manage with organic matter and split fertiliser doses; a clay soil waterlogs — manage with drainage and avoided compaction. 'Why is topsoil loss serious?' — the A horizon holds the humus and nutrients; erosion is a bank robbery of fertility." },
  { type: "heading", level: 2, text: "3. Plant needs and the NPK trio" },
  { type: "table", headers: ["Need", "Role", "Deficiency shows as"], rows: [["Nitrogen (N)", "Leafy vegetative growth — proteins", "Pale/yellow older leaves"], ["Phosphorus (P)", "Roots, flowers, energy transfer", "Purplish leaves, poor roots"], ["Potassium (K)", "Water regulation, disease resistance, fruit quality", "Scorched leaf margins"], ["+ light, water, CO₂, warmth", "Photosynthesis inputs", "Stunting, wilting, etiolation"]] },
  { type: "paragraph", text: "Fertiliser labels read N-P-K in order — '15-15-15' is balanced; 'high-N' feeds LEAVES ( maize early, lawns) but delays fruiting. Over-fertilising burns plants and pollutes waterways — rate and timing are part of the science." },
  { type: "heading", level: 2, text: "4. Propagation — sexual and asexual" },
  { type: "definition", term: "Propagation", text: "SEXUAL (seed): genetic mixing — vigorous, variable offspring, cheap storage; some crops take long to fruit. ASEXUAL (vegetative — cuttings, grafting, budding, layering, division): CLONES of the parent — identical fruit quality, faster to bearing, but no genetic diversity (one disease can take them all). Grafting joins a SCION (chosen fruit variety) onto a ROOTSTOCK (chosen roots — hardy, dwarfing)." },
  { type: "example", text: "Worked: mango seedlings vary wildly and fruit in 6–8 years; a grafted mango fruits in 3–4 and tastes exactly like the mother tree — but every orchard tree shares the same weaknesses. 'Why graft?' — combine the scion's fruit with the rootstock's roots; the division of labour is the mark." },
  { type: "heading", level: 2, text: "5. Crop rotation and legumes — the free nitrogen machine" },
  { type: "definition", term: "Rotation", text: "Changing the crop family on a plot each season. Why it works: (1) breaks PEST AND DISEASE cycles (the pest's host disappears), (2) balances NUTRIENT DRAINAGE (heavy feeders follow light feeders), (3) LEGUMES (beans, cowpea, groundnut) host nitrogen-FIXING bacteria in root nodules — they fertilise the NEXT crop for free. Monoculture year after year is why yields collapse and pests boom." },
  { type: "example", text: "Worked: maize (heavy feeder) → cowpea (legume — fixes N) → maize again thrives on the free nitrogen and the stem-borer cycle is broken. 'Why plant beans after maize?' — nitrogen fixation + pest-cycle break; both reasons, both marks." },
  { type: "heading", level: 2, text: "6. Pests, diseases and weeds — integrated management" },
  { type: "table", headers: ["Control type", "Method", "Example"], rows: [["Cultural", "Farming practice changes", "Rotation, timely planting, field sanitation"], ["Biological", "Living enemies of the pest", "Ladybirds eat aphids; Bacillus thuringiensis"], ["Chemical", "Pesticides/herbicides — labelled dose, protective gear", "Last line, not first reflex"], ["Physical/mechanical", "Barriers, hand-picking, traps", "Row covers, sticky traps"]] },
  { type: "paragraph", text: "INTEGRATED PEST MANAGEMENT (IPM) stacks all four, chemical LAST: spray only at threshold, rotate actives to dodge resistance. The trap: blanket spraying kills the pest's natural enemies too — the aphids return faster than the ladybirds. Weeds compete for the same NPK, light and water — control is yield protection." },
  { type: "heading", level: 2, text: "7. Animal husbandry — feed, house, breed, protect" },
  { type: "definition", term: "Livestock management", text: "NUTRITION: ROUGHAGE (bulk fibrous feed — grass, hay) vs CONCENTRATES (energy/protein dense — grain, cake); ruminants (cattle, goats) digest roughage via rumen microbes, poultry and pigs cannot — they need concentrates. HOUSING: ventilation, dry bedding, space, predator and disease protection. HEALTH: vaccination schedules, hygiene, quarantine of new stock, prompt treatment. BREEDING: select for the traits that pay — growth rate, fertility, milk or egg yield." },
  { type: "example", text: "Worked: a goat (ruminant) thrives on brush and hay; a broiler chicken on the same diet starves — the rumen unlocks roughage, the chicken's gut cannot. Match the digestive system to the diet; 'why can cattle live on grass?' is a rumen-microbes answer." },
  { type: "heading", level: 2, text: "8. Records and gross margin — farming as a business" },
  { type: "definition", term: "Gross margin", text: "GROSS MARGIN = output (revenue) − variable costs (seed, feed, fertiliser, labour hired for the crop). It ranks enterprises: the crop with the best gross margin per hectare wins the land. Fixed costs (land, machinery, buildings) sit above gross margins — a positive gross margin does not yet mean profit, but a NEGATIVE one guarantees loss. Records: inputs, dates, yields, prices, deaths/births — without records there is no management, only guessing." },
  { type: "example", text: "Worked: maize — revenue 400,000; variable costs 250,000 → gross margin 150,000/ha. Beans — 300,000 − 100,000 = 200,000/ha: beans win the hectare this season. Compute, compare, decide — the arithmetic IS the management." },
  { type: "heading", level: 2, text: "9. Sustainability — farming for the next generation" },
  { type: "paragraph", text: "Threats: OVERGRAZING (stock above carrying capacity strips cover → erosion), DEFORESTATION, monoculture soil exhaustion, chemical misuse. Conservation answers: CONTOUR PLOUGHING and TERRACES (slow runoff), COVER CROPS and MULCHING (protect bare soil), ROTATION + LEGUMES (rebuild fertility), agroforestry, correct stocking rates. Sustainability is not a slogan — it is yield MAINTAINED over decades, the only definition that survives the exam and the farm alike." },
  { type: "heading", level: 2, text: "10. Summary — the agriculture spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Soil", "Horizon + texture + pH matched to fix", "Topsoil loss = permanent fertility loss"], ["NPK", "N leaves, P roots/flowers, K quality", "High-N delays fruiting"], ["Propagation", "Seed varies; clones repeat the parent", "Grafting = scion fruit + rootstock roots"], ["Rotation", "Pest break + nutrient balance + legumes", "Legumes FIX nitrogen — they do not just save it"], ["Pests", "IPM: cultural, biological, then chemical", "Blanket spray kills the helpers too"], ["Livestock", "Ruminant vs monogastric digestion", "Roughage for ruminants only"], ["Economics", "Gross margin ranks enterprises", "Positive GM ≠ profit — fixed costs still pending"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'state' = the fact; 'explain' = the mechanism (nodules, rumen, rotation break); 'calculate the gross margin' = output minus variable costs, with units; 'suggest' = a practice tied to the problem in the scenario. Agriculture papers pay for MECHANISM and NUMBERS — 'it improves the soil' earns nothing; 'legumes fix atmospheric nitrogen in root nodules' earns the mark." },
];

const AGR_QS: Q[] = [
  { q: "The soil horizon holding most fertility and organic matter is", o: ["the C horizon", "the A horizon (topsoil)", "bedrock", "the B horizon"], a: "the A horizon (topsoil)", e: "Humus, roots, life — the fertility bank erosion steals first.", d: "easy" },
  { q: "Yellowing older leaves in maize point to a deficiency of", o: ["potassium", "nitrogen — needed for leafy growth", "phosphorus", "calcium"], a: "nitrogen — needed for leafy growth", e: "N feeds leaves; P roots; K margins and quality.", d: "medium" },
  { q: "Legumes improve the following crop because they", o: ["use less water", "host nitrogen-fixing bacteria in root nodules", "attract rain", "kill all weeds"], a: "host nitrogen-fixing bacteria in root nodules", e: "Free nitrogen + a broken pest cycle — two reasons, both marks.", d: "easy" },
  { q: "Grafting a mango scion onto hardy rootstock gives you", o: ["seedling vigour", "the scion's fruit quality on the rootstock's roots", "a new hybrid species", "immunity to all pests"], a: "the scion's fruit quality on the rootstock's roots", e: "Asexual propagation clones the parent — plus chosen roots.", d: "medium" },
  { q: "A clay soil's main management problem is", o: ["drying too fast", "waterlogging and compaction — poor drainage", "low nutrients always", "no structure"], a: "waterlogging and compaction — poor drainage", e: "Sandy drains fast and holds little; clay holds but waterlogs.", d: "medium" },
  { q: "In IPM, chemical control is", o: ["the first reflex", "the last line, at threshold, with rotated actives", "banned", "used weekly"], a: "the last line, at threshold, with rotated actives", e: "Blanket spraying kills natural enemies and breeds resistance.", d: "medium" },
  { q: "A broiler chicken fed only grass hay will", o: ["thrive", "starve — monogastrics cannot digest roughage", "grow faster", "lay more eggs"], a: "starve — monogastrics cannot digest roughage", e: "Only ruminants' rumen microbes unlock fibrous feed.", d: "medium" },
  { q: "Revenue 400,000; variable costs 250,000. The gross margin is", o: ["650,000", "150,000", "400,000", "250,000"], a: "150,000", e: "Output − variable costs — fixed costs are NOT subtracted here.", d: "easy" },
  { q: "A positive gross margin guarantees", o: ["profit", "nothing yet — fixed costs still have to be covered", "loss", "a subsidy"], a: "nothing yet — fixed costs still have to be covered", e: "GM ranks enterprises; profit needs fixed costs too.", d: "hard" },
  { q: "Contour ploughing and terracing control erosion by", o: ["adding nutrients", "slowing runoff so water cannot carry topsoil away", "killing weeds", "raising pH"], a: "slowing runoff so water cannot carry topsoil away", e: "Manage the water, keep the A horizon — that is the mechanism.", d: "easy" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "agriculture" } });
    if (!topic) throw new Error("master agriculture topic missing");
    let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: { domain: "highschool", topicId: topic.id, title: "Standard lesson (auto-created)", orderIndex: 0, content: { blocks: [] } as object },
      });
    }
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Agriculture — Complete", content: { blocks: AGR_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < AGR_QS.length; i++) {
      const item = AGR_QS[i];
      await prisma.question.upsert({
        where: { id: `master-agriculture-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-agriculture-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "agriculture-rebuild", blocks: AGR_BLOCKS.length, questions: AGR_QS.length });
  } catch (e) {
    console.error("rebuild agriculture failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
