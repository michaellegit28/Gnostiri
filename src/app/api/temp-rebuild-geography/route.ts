import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Humanities Topic 1: Geography at the no-exceptions bar:
// physical processes, climate drivers, rivers, population, settlement, hazards, maps and GIS.

const GEO_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. The four strands of geography" },
  { type: "definition", term: "Geography", text: "The study of the EARTH as the home of man, in four strands: PHYSICAL (landforms, climate, rivers — the natural stage), HUMAN (population, settlement, economic activity — the actors), ENVIRONMENTAL (hazards, conservation — the interaction), and SKILLS (maps, GIS, fieldwork — the tools). Geography is the bridge subject: it explains WHY human activity sits where it sits." },
  { type: "example", text: "Worked: a river (physical) decides where farms and towns cluster (human); deforestation on its banks (environmental interaction) raises flood risk, which a GIS flood-layer maps (skills). One landscape, all four strands — the definition question wants them linked, not listed in isolation." },
  { type: "heading", level: 2, text: "2. Physical — landforms are built and worn" },
  { type: "definition", term: "Endogenic and exogenic", text: "Landforms are BUILT by internal forces (endogenic: folding, faulting, volcanism — plate tectonics) and WORN by external forces (exogenic: weathering, erosion, deposition). Plate boundaries: CONVERGENT plates collide (fold mountains — Himalayas), DIVERGENT plates pull apart (rift valleys — East African Rift), TRANSFORM plates slide (earthquakes — San Andreas)." },
  { type: "example", text: "Worked: the East African Rift — divergent boundary, plates pull apart, the crust drops as a rift valley with block mountains on its shoulders and volcanoes (Kilimanjaro) along the seam. The landform question pays for the PROCESS and the boundary type, never just the name." },
  { type: "heading", level: 2, text: "3. Climate — the drivers and the belts" },
  { type: "definition", term: "Climate", text: "Climate is the AVERAGE weather over 30+ years (weather is the day; climate is the statistics). Drivers: LATITUDE (sun angle sets the belts: equatorial, tropical, temperate, polar), ALTITUDE (temperature falls ~6.5°C per km), CONTINENTALITY (inland extremes vs coastal moderation), ocean currents, prevailing winds. Rainfall types: CONVECTIONAL (heating → thunderstorms, equatorial afternoons), OROGRAPHIC/relief (air forced up a windward slope), FRONTAL (warm meets cold air, mid-latitudes)." },
  { type: "example", text: "Worked: Jos Plateau (~1,200 m) is cooler than sea-level Lagos — altitude. Lagos has convectional rain with double maxima (equatorial). Windward slopes stay wet while leeward slopes rain-shadow — relief rainfall. Match the FACTOR to the observation; the factor named is the mark." },
  { type: "heading", level: 2, text: "4. The water cycle and the river's course" },
  { type: "definition", term: "Hydrological cycle", text: "Evaporation → condensation → precipitation → runoff or infiltration → storage (the oceans hold ~97%). The DRAINAGE BASIN is the land feeding one river, divided by WATERSHEDS. The river's course: UPPER — vertical erosion (V-shaped valleys, gorges, waterfalls), MIDDLE — lateral erosion (meanders, wider valley), LOWER — deposition (floodplains, deltas)." },
  { type: "diagram", diagramId: "hydrological-cycle", caption: "Evaporation, condensation, precipitation, runoff — the cycle that feeds every river" },
  { type: "example", text: "Worked: the Niger rises in the Guinea highlands (upper: rapids and gorges), meanders through Nigeria (middle: lateral erosion, tributaries join), and builds the Niger delta at the sea (lower: deposition). The process CHANGES downstream — name it per course, that is the mark." },
  { type: "heading", level: 2, text: "5. Human — population: density, distribution, migration" },
  { type: "table", headers: ["Term", "Meaning", "Exam beat"], rows: [["Census", "Official count of a population", "Basis of all population data"], ["Density", "People per km² of land", "Arithmetic, not distribution"], ["Distribution", "WHERE people live and why", "Physical: water, soil, climate; human: jobs, transport, policy"], ["Migration", "Permanent move across a boundary", "Rural-urban, international; PUSH + PULL factors"]] },
  { type: "example", text: "Worked: Lagos is dense — port, capital history, jobs, services (human factors dominate). The Sahel is sparse — aridity, poor soils (physical factors dominate). Rural-urban migration: push (land shortage, few jobs) plus pull (wages, schools, clinics) — answer with BOTH sides or the mark is halved." },
  { type: "heading", level: 2, text: "6. Human — settlement: site vs situation" },
  { type: "paragraph", text: "Settlement PATTERNS: nucleated (clustered at a water point or for defence), linear (along a road or river), dispersed (scattered over farmland). SITE is what the land itself offers (dry point, bridging point, shelter); SITUATION is the settlement's relation to its SURROUNDINGS (routes, resources, neighbouring towns). Economic activity keeps the three levels: primary, secondary, tertiary." },
  { type: "example", text: "Worked: a town grows at a bridging point — the river is crossable THERE (site) — and on the trade route between two regions (situation). 'Describe the site' and 'explain the situation' are different questions: the land vs the links. Confusing them is the classic slip." },
  { type: "heading", level: 2, text: "7. Environmental — hazards: cause then management" },
  { type: "table", headers: ["Hazard", "Causes", "Management"], rows: [["Soil erosion (sheet, gully)", "Bare soil, steep slopes, heavy rain, overgrazing", "Terracing, cover crops, contour ploughing, afforestation"], ["Flooding", "Heavy rain, impermeable urban surfaces, deforestation", "Dams and levees, drainage planning, zoning"], ["Drought / desertification", "Climate variability, overgrazing, deforestation", "Drought-resistant crops, controlled grazing, shelter belts"]] },
  { type: "example", text: "Worked: gully erosion in SE Nigeria — high rainfall on loose soils on deforested slopes. Management must MATCH the causes: terracing slows runoff, cover crops protect bare soil, afforestation anchors it. The matched pair (cause → measure) is the mark; a generic list is not." },
  { type: "heading", level: 2, text: "8. Environmental — conservation and sustainability" },
  { type: "paragraph", text: "CONSERVATION is wise USE of resources; PRESERVATION is leaving them untouched — different words, different exams. Renewable resources (forests, water, soil) must be used SLOWER than they regenerate; non-renewable (oil, minerals) can only be conserved and rationed. Sustainability: meet present needs without robbing the future — the judgement question wants the trade-off named, not a slogan." },
  { type: "heading", level: 2, text: "9. Skills — maps, contours and GIS" },
  { type: "definition", term: "Map skills", text: "SCALE: 1:50,000 means 1 cm on the map = 500 m on the ground (convert before any distance answer). RELIEF: contours join equal heights — CLOSER contours = steeper ground; spot heights and trig points pin the summits. Cross-sections turn contour lines into a side profile. GIS stacks LAYERS of spatial data (soil, rainfall, roads) — query, analyse, model: flood risk, land-use change." },
  { type: "example", text: "Worked: on a 1:50,000 map, 4 cm = 2 km — convert FIRST, then answer. Contours 10 m apart over a centimetre = gentle slope; 100 m apart = cliff. The conversion is the marked arithmetic; forgetting it is the classic lost mark." },
  { type: "heading", level: 2, text: "10. Skills — fieldwork: hypothesis to evaluation" },
  { type: "paragraph", text: "Fieldwork runs: HYPOTHESIS → SAMPLING (random, systematic, stratified — justify the choice) → DATA COLLECTION → PRESENTATION (graph matched to data type: line for continuous, bar for discrete) → ANALYSIS → CONCLUSION → EVALUATION (sample size, bias, reliability, weather). The evaluation is where the marks hide: name what could have skewed the data and how you would fix it." },
  { type: "heading", level: 2, text: "11. Summary — the geography spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Landform", "Process + boundary type, not just the name", "Convergent ≠ divergent ≠ transform"], ["Climate", "Match the driver to the observation", "Weather is a day; climate is 30+ years"], ["River course", "Upper vertical, middle lateral, lower deposition", "The process changes downstream"], ["Population", "Push AND pull, physical AND human", "Density is arithmetic; distribution is WHY"], ["Settlement", "Site = the land; situation = the links", "Two different questions"], ["Hazards", "Cause → MATCHED management", "Generic lists earn half"], ["Map skills", "Convert the scale first", "Closer contours = steeper"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'describe' = what it is like, no reasons; 'explain' = the process or factor, named; 'compare' = both items, difference on each line; 'account for' = cause and effect in order. Geography papers pay for the process — a correct place-name without the reason earns half." },
];

const GEO_QS: Q[] = [
  { q: "Geography is best defined as", o: ["the study of landforms only", "the study of the earth as the home of man", "the study of weather only", "the study of map drawing"], a: "the study of the earth as the home of man", e: "Four strands: physical, human, environmental, skills.", d: "easy" },
  { q: "The East African Rift valley formed at a", o: ["convergent boundary", "divergent boundary — plates pulling apart", "transform boundary", "subduction zone"], a: "divergent boundary — plates pulling apart", e: "Divergent: crust drops as a rift, block mountains on the shoulders.", d: "medium" },
  { q: "Jos Plateau is cooler than coastal Lagos mainly because of", o: ["latitude", "altitude — temperature falls ~6.5°C per km", "distance from the sea", "ocean currents"], a: "altitude — temperature falls ~6.5°C per km", e: "Match the driver: height, not distance.", d: "easy" },
  { q: "Rain falling on the windward side of a mountain is", o: ["convectional", "orographic (relief) rainfall", "frontal", "cyclonic"], a: "orographic (relief) rainfall", e: "Air forced up cools and condenses; the leeward side rain-shadows.", d: "medium" },
  { q: "In its upper course a river mainly", o: ["deposits sediment", "erodes vertically — V-shaped valleys and waterfalls", "forms meanders", "builds a delta"], a: "erodes vertically — V-shaped valleys and waterfalls", e: "Upper: vertical; middle: lateral; lower: deposition.", d: "medium" },
  { q: "The Niger delta is built by", o: ["vertical erosion", "deposition at the river's mouth", "faulting", "convectional rainfall"], a: "deposition at the river's mouth", e: "The lower course drops its load — floodplains and deltas.", d: "easy" },
  { q: "Rural-urban migration is best explained by", o: ["pull factors alone", "push factors alone", "push AND pull factors together", "the census"], a: "push AND pull factors together", e: "Land shortage pushes; wages, schools, clinics pull.", d: "medium" },
  { q: "A town located where a river can be crossed — this describes its", o: ["situation", "site", "pattern", "function"], a: "site", e: "Site is the land itself; situation is the links to surroundings.", d: "medium" },
  { q: "On a 1:50,000 map, 4 cm on the map represents", o: ["4 km", "2 km", "500 m", "40 km"], a: "2 km", e: "1 cm = 500 m, so 4 cm = 2,000 m — convert first.", d: "hard" },
  { q: "Contours 100 m apart over a short map distance indicate", o: ["gentle slope", "steep ground or a cliff", "a plateau top", "flat land"], a: "steep ground or a cliff", e: "Closer contours = steeper ground.", d: "medium" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "geography" } });
    if (!topic) throw new Error("master geography topic missing");
    let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: { domain: "highschool", topicId: topic.id, title: "Standard lesson (auto-created)", orderIndex: 0, content: { blocks: [] } as object },
      });
    }
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Geography — Complete", content: { blocks: GEO_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < GEO_QS.length; i++) {
      const item = GEO_QS[i];
      await prisma.question.upsert({
        where: { id: `master-geography-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-geography-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "geography-rebuild", blocks: GEO_BLOCKS.length, questions: GEO_QS.length });
  } catch (e) {
    console.error("rebuild geography failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
