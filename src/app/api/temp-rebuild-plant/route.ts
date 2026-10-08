import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Biology Topic 6: Plant Biology standard chapter at the
// no-exceptions bar: transport, tropisms, reproduction, germination, dispersal.

const PLANT_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Two vessels, two jobs" },
  { type: "table", headers: ["", "Xylem", "Phloem"], rows: [["Carries", "Water + mineral ions, UP only", "Sucrose + amino acids, BOTH ways"], ["Cells", "Dead, hollow, lignin-thickened walls", "Living sieve tubes + companion cells"], ["Driver", "Transpiration pull (passive)", "Active loading at sources (energy spent)"], ["Evidence", "Dye climbs and stops where xylem is cut", "Girdling: phloem ring cut → sugars pool above the cut, roots starve"]] },
  { type: "paragraph", text: "Root hairs load water by osmosis (soil's water potential higher than cell sap) and minerals by active transport; the endodermis's Casparian strip forces everything through living cytoplasm — quality control before the xylem. From there the stream is one-way: up the hollow vessels, out the leaf's stomata." },
  { type: "heading", level: 2, text: "2. The transpiration stream — tension, not pumping" },
  { type: "paragraph", text: "Water evaporates from mesophyll walls into the air spaces and diffuses out through stomata. That loss pulls on the water column beneath — and because hydrogen-bonded water molecules are cohesive and adhere to lignified walls, the column holds from leaf to root without breaking, under genuine negative pressure. Transpiration is a consequence, not a purpose: the plant trades water loss for the CO₂ that enters through the same open stomata." },
  { type: "diagram", diagramId: "transpiration-stream", caption: "Evaporation pulls the column" },
  { type: "table", headers: ["Factor", "Effect on rate", "Because"], rows: [["Light", "↑", "Stomata open for photosynthesis"], ["Temperature", "↑", "Evaporation and diffusion speed up"], ["Wind / airflow", "↑", "Humid shell around the leaf swept away — gradient stays steep"], ["Humidity", "↓", "Smaller water-vapour gradient out of the leaf"], ["Soil water", "limiting", "Dry soil starves the column; stomata close"]] },
  { type: "example", text: "Required practical — the potometer: a leafy shoot sealed in a water-filled capillary. As the shoot transpires, an air bubble slides along the tube. Rate = distance × πr² ÷ time (a volume per second). Worked: bubble moves 40 mm in 10 min in a tube of radius 0.5 mm → volume = 40 × π × 0.25 ≈ 31.4 mm³ → ≈ 3.14 mm³/min. Controls: same shoot, sealed joints (Vaseline), same light and temperature, cut stem under water (no air lock in the xylem). It measures uptake — a proxy for transpiration — and saying why earns the evaluation mark." },
  { type: "heading", level: 2, text: "3. Translocation — the phloem's delivery service" },
  { type: "definition", term: "Source to sink", text: "Sources make sugar (mature leaves); sinks spend it (roots, fruits, growing shoots). Sucrose is actively loaded into sieve tubes by companion cells; water follows by osmosis; pressure pushes the sap toward the lower-pressure sink, where sucrose is unloaded. Direction changes with the season — a root is a sink in summer and a source in spring." },
  { type: "paragraph", text: "The pressure-flow mechanism explains aphid evidence: stylets tap sieve tubes and sap flows out under pressure; analysing the exudate shows sucrose at sink-bound concentrations. Girdling (removing a phloem ring) starves everything below the ring while xylem keeps the leaves watered — the two-vessel division of labour in one experiment." },
  { type: "heading", level: 2, text: "4. Tropisms — growth guided by the environment" },
  { type: "paragraph", text: "Phototropism bends shoots toward light: auxin, produced at the tip, migrates to the shaded side and elongates those cells more — the shoot curves sunward. Geotropism roots earthward by the same hormone acting oppositely: auxin inhibits root-cell elongation on the lower side, curving the root down. The classic evidence chain (Darwin's coleoptile caps → Boysen-Jensen's gel block → Went's agar diffusion) showed a chemical messenger moving from tip to bending zone — the exam loves the logic of each step." },
  { type: "table", headers: ["Hormone", "Effect", "Commercial use"], rows: [["Auxin", "Cell elongation; apical dominance", "Rooting powder on cuttings; selective weedkillers (dicots overproduce and die)"], ["Gibberellin", "Stem elongation; germination trigger", "Seedless grapes; synchronised malting"], ["Cytokinin", "Cell division; delays ageing", "Tissue culture media"], ["Ethylene", "Fruit ripening gas", "Controlled ripening in storage and transport"]] },
  { type: "heading", level: 2, text: "5. Flowers and pollination" },
  { type: "diagram", diagramId: "flower-parts", caption: "Anther, stigma, ovary" },
  { type: "paragraph", text: "Pollination is TRANSFER of pollen from anther to stigma — by the wind or by animal couriers bribed with nectar. Cross-pollination mixes genotypes (variation, but costs advertising); self-pollination guarantees seed but inbreeds. The structure reads the strategy:" },
  { type: "table", headers: ["", "Wind-pollinated", "Insect-pollinated"], rows: [["Petals", "Small, dull, no scent", "Large, bright, scented, nectar guides"], ["Pollen", "Light, smooth, produced in huge quantities", "Sticky, sculptured, protein-rich"], ["Stigma", "Feathery, exposed to airflow", "Sticky, held inside the flower"], ["Timing", "Long season, open before leaves shade", "Coordinated with pollinator activity"]] },
  { type: "heading", level: 2, text: "6. Fertilisation — one journey, two fusions" },
  { type: "paragraph", text: "On a compatible stigma the pollen grain germinates: a pollen tube digests its way down the style, guided by chemicals, carrying two male nuclei. In the ovule, double fertilisation happens — one nucleus fuses the egg cell (zygote → embryo), the second fuses two polar nuclei (triploid endosperm, the seed's food store). The ovule becomes the seed; the ovary wall becomes the fruit; petals wither. Explain a fruit's structure (fleshy attractive tissues, hooked wings, exploding pods) and you explain its dispersal strategy." },
  { type: "callout", variant: "warning", text: "Exam trap: pollination ≠ fertilisation. Pollination is transport (anther → stigma); fertilisation is fusion (nuclei in the ovule), which may follow hours or days later — or never. Sequence questions punish the shortcut." },
  { type: "heading", level: 2, text: "7. Germination — the seed's three needs" },
  { type: "paragraph", text: "A dormant seed needs water (rehydrates enzymes and the stored food), oxygen (aerobic respiration powers growth until leaves can photosynthesise), and warmth (enzyme kinetics — though some seeds, like some temperate species, additionally need chilling). Light is NOT generally required — the trick option every exam cycle." },
  { type: "example", text: "Required practical — germination conditions: cress seeds on cotton wool in paired dishes — wet vs dry, warm vs cold, air vs oil-sealed. Worked: 40 seeds sown, 34 sprout → germination percentage = 34/40 × 100 = 85%. Controls: same seed number, same light, same time; change ONE condition per pair. The oil-sealed dish's zero germination is the oxygen evidence." },
  { type: "paragraph", text: "Dormancy itself is adaptive: a seed that waits survives winter and germinates when conditions favour its seedling — staggered germination also spreads sibling competition. Dispersal then matches structure to distance:" },
  { type: "table", headers: ["Method", "Structural clue", "Examples"], rows: [["Wind", "Wings, parachutes, light", "Sycamore, dandelion"], ["Water", "Buoyant, fibrous coat", "Coconut"], ["Animals", "Hooks, or tasty flesh around a tough seed", "Burdock, tomato"], ["Explosive", "Pods under tension", "Pea pods"]] },
  { type: "heading", level: 2, text: "8. Summary — the plant's economy" },
  { type: "table", headers: ["Process", "Route", "Driver"], rows: [["Transpiration", "Root → leaf → air (xylem)", "Evaporation tension"], ["Translocation", "Source ⇌ sink (phloem)", "Active loading → pressure flow"], ["Tropisms", "Tip → growth zone", "Auxin redistribution"], ["Reproduction", "Anther → stigma → ovule", "Pollinator or wind; pollen tube"]] },
  { type: "callout", variant: "info", text: "Essay pattern for plants: name the tissue (xylem/phloem), the mechanism (tension/pressure-flow), the evidence (dye/girdling/potometer), and one adaptation — four beats that fit every transport question." },
];

const PLANT_QS: Q[] = [
  { q: "Xylem differs from phloem because it", o: ["carries sugar both ways", "carries water upward through dead lignified cells", "uses active transport", "is made of companion cells"], a: "carries water upward through dead lignified cells", e: "Hollow vessels, one direction, tension-driven.", d: "easy" },
  { q: "Transpiration pulls water up a plant because", o: ["roots pump it", "evaporation creates tension in a cohesive water column", "leaves suck actively", "phloem pushes from below"], a: "evaporation creates tension in a cohesive water column", e: "Cohesion-tension: hydrogen bonds hold the column together.", d: "medium" },
  { q: "In a potometer with capillary radius 0.5 mm, the bubble moves 40 mm in 10 min. The uptake rate is about", o: ["0.31 mm³/min", "3.14 mm³/min", "31.4 mm³/min", "314 mm³/min"], a: "3.14 mm³/min", e: "40 × π × 0.25 ≈ 31.4 mm³ over 10 min.", d: "hard" },
  { q: "Girdling a stem (cutting the phloem ring) causes", o: ["immediate wilting", "sugars pooling above the cut while roots starve", "faster growth", "xylem blockage"], a: "sugars pooling above the cut while roots starve", e: "Xylem still waters the leaves; only food transport is severed.", d: "medium" },
  { q: "Shoots bend toward light because auxin", o: ["moves to the lit side", "redistributes to the shaded side, elongating those cells more", "is destroyed by light", "makes cells shorter"], a: "redistributes to the shaded side, elongating those cells more", e: "Unequal elongation curves the tip sunward.", d: "easy" },
  { q: "Rooting powder works because it supplies", o: ["ethylene", "auxin — inducing root growth in cuttings", "gibberellin", "sugar"], a: "auxin — inducing root growth in cuttings", e: "One commercial hormone application named.", d: "easy" },
  { q: "A wind-pollinated flower would have", o: ["big scented petals", "small dull flowers, light pollen, feathery stigmas", "sticky pollen", "nectar guides"], a: "small dull flowers, light pollen, feathery stigmas", e: "Quantity and exposure replace advertising.", d: "medium" },
  { q: "Double fertilisation produces", o: ["two embryos", "a diploid zygote and a triploid endosperm", "twin seeds", "a fruit and nothing else"], a: "a diploid zygote and a triploid endosperm", e: "One fusion makes the plant; the other makes its packed lunch.", d: "medium" },
  { q: "Which is NOT required for most seeds' germination?", o: ["Water", "Oxygen", "Warmth", "Light"], a: "Light", e: "The trick option — three needs, not four.", d: "easy" },
  { q: "In germination testing, 34 of 40 sown seeds sprout. The germination percentage is", o: ["75%", "80%", "85%", "95%"], a: "85%", e: "34/40 × 100. Show the substitution.", d: "medium" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "plant-biology" } });
    if (!topic) throw new Error("master plant-biology topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("plant-biology standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Plant Biology — Complete", content: { blocks: PLANT_BLOCKS } as object, estimatedMinutes: 50 } });
    for (let i = 0; i < PLANT_QS.length; i++) {
      const item = PLANT_QS[i];
      await prisma.question.upsert({
        where: { id: `master-plant-biology-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-plant-biology-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "plant-rebuild", blocks: PLANT_BLOCKS.length, questions: PLANT_QS.length });
  } catch (e) {
    console.error("rebuild plant failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
