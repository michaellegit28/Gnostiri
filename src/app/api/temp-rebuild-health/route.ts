import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — PE & Health Topic 2: Health Education at the no-exceptions bar:
// health dimensions, hygiene, the chain of infection, major diseases,
// non-communicable disease, first aid, community health.

const HL_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Health — three dimensions, not just the body" },
  { type: "definition", term: "Health", text: "The WHO definition: complete physical, MENTAL and social well-being — not merely the absence of disease. PHYSICAL (body works — fitness, nutrition, sleep), MENTAL (copING with stress, emotions, thoughts), SOCIAL (relationships, community, respect). The three interact: chronic illness drains mood; isolation harms body as surely as smoking. 'Define health' = the WHO triad, all three dimensions named — one dimension is half the definition." },
  { type: "example", text: "Worked: a student with good nutrition but chronic exam anxiety and no friends is not healthy — one dimension down, all three compromised. Health is a balance maintained, not a body scanned." },
  { type: "heading", level: 2, text: "2. Personal hygiene — the daily defence" },
  { type: "table", headers: ["Practice", "Defends against", "Why it works"], rows: [["Handwashing (soap, 20 s)", "Diarrhoea, colds, eye infections", "Removes pathogens before they reach mouth/face"], ["Daily bathing", "Skin infections, body odour", "Washes sweat + microbes off the skin"], ["Dental care (2×/day)", "Cavities, gum disease", "Removes plaque before it hardens"], ["Clean clothes/feet", "Fungal infections (athlete's foot)", "Denies microbes warm moisture"], ["Food/water hygiene", "Typhoid, cholera, worms", "Breaks ingestion of pathogens"]] },
  { type: "paragraph", text: "Handwashing is the single highest-value health behaviour in the world: cheap, fast, and it breaks more transmission chains than any drug. The exam line: hygiene PREVENTS — treatment repairs; prevention is always the cheaper strategy." },
  { type: "heading", level: 2, text: "3. Disease types — communicable versus non-communicable" },
  { type: "definition", term: "Classification", text: "COMMUNICABLE (infectious): spread from person/person or environment — malaria, cholera, TB, flu, HIV. Cause: PATHOGENS (bacteria, viruses, fungi, protozoa) or their vectors. NON-COMMUNICABLE (NCDs): not caught — developed, usually over years: hypertension, type-2 diabetes, obesity, most cancers. Causes: lifestyle and genetics — diet, inactivity, tobacco, alcohol. The fork: caused by a PATHOGEN (communicable) or a LIFESTYLE (NCD) — the cause decides the prevention strategy entirely." },
  { type: "example", text: "Worked: cholera spreads through contaminated water (communicable — fix the water); type-2 diabetes builds through years of sugary drinks and inactivity (NCD — fix the habits). One is caught; the other is grown. Prevention differs completely — that is why the classification matters." },
  { type: "heading", level: 2, text: "4. The chain of infection — six links, break any one" },
  { type: "definition", term: "Chain of infection", text: "PATHOGEN → RESERVOIR (where it lives: person, animal, water, soil) → EXIT (sneeze, faeces, blood) → TRANSMISSION (air, water, food, vector, contact) → ENTRY (mouth, cut, bite) → SUSCEPTIBLE HOST (low immunity). Break ANY link and transmission stops: hygiene breaks entry, clean water breaks transmission, vaccination reduces susceptibility, treatment clears reservoirs. The chain model is why public health works — you never need to break all six." },
  { type: "diagram", diagramId: "disease-chain", caption: "Pathogen to host in six links — break any one and the disease stops" },
  { type: "example", text: "Worked: malaria — pathogen (Plasmodium), reservoir (infected people), exit (mosquito bite takes blood), transmission (Anopheles mosquito — the VECTOR), entry (next bite), susceptible host. Bed nets break TRANSMISSION; draining stagnant water breaks the reservoir of the vector; prophylaxis shields the host. 'How do nets help?' — they break the transmission link; name the link, not just the net." },
  { type: "heading", level: 2, text: "5. The major diseases — cause, route, prevention" },
  { type: "table", headers: ["Disease", "Cause + route", "Prevention"], rows: [["Malaria", "Protozoan via Anopheles mosquito (night-biting)", "Bed nets, draining stagnant water, prophylaxis, prompt treatment"], ["Cholera", "Bacteria in contaminated water/food", "Safe water, sanitation, handwashing, oral rehydration on onset"], ["TB", "Airborne bacteria — coughs", "Ventilation, cover coughs, complete the FULL treatment course"], ["HIV", "Virus via blood/sexual fluids — NOT saliva, hugs, mosquitoes", "Condoms, testing, no needle sharing, ART prevents transmission"], ["Measles", "Airborne virus — highly contagious", "VACCINATION (the MMR/measles dose) — the definitive tool"]] },
  { type: "paragraph", text: "Two exam certainties: (1) immunisation is the most cost-effective prevention in history — smallpox eradicated, polio nearly; (2) HIV is NOT transmitted by mosquitoes, hugs, sharing cups, or swimming pools — the stigma myths are themselves a health hazard because they punish testing." },
  { type: "heading", level: 2, text: "6. Non-communicable disease — the slow epidemic" },
  { type: "definition", term: "NCDs", text: "HYPOTENSION'S evil twin hypertension (high blood pressure — silent until stroke/heart attack; causes: salt, stress, inactivity, obesity), TYPE-2 DIABETES (insulin resistance — sugar-heavy diets, inactivity), OBESITY (energy surplus chronic), CANCERS (tobacco, alcohol, diet, some infections). Prevention is the same prescription every time: balanced diet, regular activity, no tobacco, limited alcohol, sleep — the boring list that outperforms every drug for prevention." },
  { type: "example", text: "Worked: hypertension is 'silent' — you feel nothing while it damages vessels; that is why CHECKS (BP, glucose) matter before symptoms. 'Why screen for silent diseases?' — damage precedes symptoms by years; detection is the only early defence." },
  { type: "heading", level: 2, text: "7. Malnutrition — both ends of the scale" },
  { type: "paragraph", text: "UNDER-nutrition: KWASHIORKOR (protein deficiency despite some calories — swollen belly, oedema, patchy skin), MARASMUS (total calorie deficiency — severe wasting, skeletal), micronutrient deficiencies (anaemia, goitre, night blindness). OVER-nutrition: obesity and its NCD train. Both ends are MALNUTRITION — the word means bad nourishment, not thin. Prevention: the balanced diet, breastfeeding in infancy, and food security at the community scale." },
  { type: "heading", level: 2, text: "8. First aid — the first minutes belong to you" },
  { type: "definition", term: "Primary survey", text: "D.R.A.B.C: Danger (scene safe for YOU first) → Response (shake and shout) → Airway (open, clear) → Breathing (look, listen, feel — 10 s) → Circulation/CPR (if no breathing: compressions — 30:2, hard and fast centre-chest). Bleeding: direct PRESSURE with a clean pad, elevate. Burns: cool RUNNING water 20 minutes — never ice, never ointment on fresh burns. The first aider's contract: do no further harm, get help, stay until relieved." },
  { type: "example", text: "Worked: a collapsed cyclist on a road — Danger: traffic first (you becoming the second casualty helps nobody), then Response, Airway, Breathing. 'Why DRABC in order?' — each step protects the next; skipping danger defeats everything after it." },
  { type: "heading", level: 2, text: "9. Community health — sanitation is the silent hero" },
  { type: "paragraph", text: "SAFE WATER (protected wells, treatment — the cholera killer), SANITATION (latrines, sewage separated from water), WASTE management (drains, refuse disposal — mosquitoes and rats breed in litter), FOOD inspection, and IMMUNISATION programmes. Community health does quietly what hospitals do dramatically: a protected well prevents more disease than a ward cures. Health education is the multiplier — knowledge spreads prevention faster than any campaign builds clinics." },
  { type: "heading", level: 2, text: "10. Summary — the health spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Define health", "WHO triad: physical + mental + social", "Absence of disease is one-third of it"], ["Classify disease", "Pathogen (communicable) vs lifestyle (NCD)", "The cause decides the prevention"], ["Chain of infection", "Six links — break ANY one", "Name the LINK your control breaks"], ["Major diseases", "Route → matched prevention", "HIV: fluids only — myth-busting is part of care"], ["NCDs", "Silent damage → screen early", "You cannot feel hypertension"], ["First aid", "DRABC in order; burns = running water", "Danger to the helper first — scene safety"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'define' = the full triad; 'explain' = the mechanism (why nets, why soap); 'prevent' = the strategy matched to the transmission route; 'list' = complete items. Health papers pay for the LINK between cause and control — 'bed nets prevent malaria' earns half; 'bed nets break the mosquito transmission link' earns the mark." },
];

const HL_QS: Q[] = [
  { q: "The WHO definition of health includes", o: ["physical well-being only", "physical, mental and social well-being", "the absence of disease only", "fitness test scores"], a: "physical, mental and social well-being", e: "The triad — one dimension is a third of the definition.", d: "easy" },
  { q: "The single most cost-effective daily health behaviour is", o: ["daily gym sessions", "handwashing with soap", "vitamin supplements", "annual check-ups"], a: "handwashing with soap", e: "Breaks more transmission chains than any single drug.", d: "easy" },
  { q: "Type-2 diabetes is classified as", o: ["communicable", "non-communicable — lifestyle-developed", "a vector disease", "an injury"], a: "non-communicable — lifestyle-developed", e: "NCDs are grown, not caught — diet, inactivity, genetics.", d: "easy" },
  { q: "In the chain of infection, a mosquito carrying malaria is the", o: ["pathogen", "reservoir", "transmission vector", "portal of entry"], a: "transmission vector", e: "The Plasmodium parasite is the pathogen; the mosquito carries it — the vector.", d: "medium" },
  { q: "Bed nets protect against malaria by", o: ["killing the parasite", "breaking the transmission link — blocking the vector's bite", "improving immunity", "cleaning the water"], a: "breaking the transmission link — blocking the vector's bite", e: "Name the LINK broken — the chain model is the reasoning.", d: "medium" },
  { q: "The definitive prevention tool against measles is", o: ["antibiotics", "vaccination", "handwashing only", "isolation after infection"], a: "vaccination", e: "Immunisation — smallpox eradicated, polio nearly.", d: "easy" },
  { q: "HIV is NOT transmitted by", o: ["unprotected sex", "sharing needles", "mosquito bites, hugs or shared cups", "mother to child"], a: "mosquito bites, hugs or shared cups", e: "Blood/sexual fluids only — the myths feed stigma and punish testing.", d: "medium" },
  { q: "Hypertension is called 'silent' because", o: ["it is rare", "damage proceeds for years without symptoms — screening matters", "it only affects the quiet", "it cannot be treated"], a: "damage proceeds for years without symptoms — screening matters", e: "You cannot feel high blood pressure — detection is the defence.", d: "medium" },
  { q: "A swollen belly with patchy skin despite some food intake indicates", o: ["marasmus", "kwashiorkor — protein deficiency", "obesity", "goitre"], a: "kwashiorkor — protein deficiency", e: "Marasmus = total calorie wasting; kwashiorkor = protein despite calories.", d: "medium" },
  { q: "The correct first action for a fresh burn is", o: ["ice directly on it", "cool RUNNING water for ~20 minutes", "butter or ointment", "burst any blisters"], a: "cool RUNNING water for ~20 minutes", e: "Remove the heat; ice damages tissue, ointments trap it.", d: "medium" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "health-education" } });
    if (!topic) throw new Error("master health-education topic missing");
    let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: { domain: "highschool", topicId: topic.id, title: "Standard lesson (auto-created)", orderIndex: 0, content: { blocks: [] } as object },
      });
    }
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Health Education — Complete", content: { blocks: HL_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < HL_QS.length; i++) {
      const item = HL_QS[i];
      await prisma.question.upsert({
        where: { id: `master-health-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-health-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "health-rebuild", blocks: HL_BLOCKS.length, questions: HL_QS.length });
  } catch (e) {
    console.error("rebuild health failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
