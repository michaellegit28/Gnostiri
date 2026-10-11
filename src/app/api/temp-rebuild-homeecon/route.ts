import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Tech/Voc Topic 3: Home Economics / Food & Nutrition at the no-exceptions bar:
// nutrients and the balanced plate, energy balance, meal planning across groups,
// cooking methods, food safety and preservation, kitchen and home management.

const HE_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. The nutrients — seven, each with a job" },
  { type: "definition", term: "Nutrients", text: "CARBOHYDRATES (energy — rice, yam, bread), PROTEINS (growth and repair — beans, fish, egg, meat), FATS (concentrated energy, warmth, vitamin absorption — oil, nuts), VITAMINS (regulate processes), MINERALS (structure and regulation — calcium bones, iron blood), WATER (transport, temperature), FIBRE (digestion, bulk — vegetables, whole grains). Macronutrients are needed in grams; micronutrients (vitamins, minerals) in tiny amounts — but a tiny-amount deficiency is a large-amount disease." },
  { type: "example", text: "Worked: no vitamin C → scurvy (bleeding gums); no vitamin D → rickets (soft bones); no iron → anaemia (weak, pale, tired); no iodine → goitre (swollen neck). Match the deficiency disease to the nutrient — the pairing table is the exam's gift; learn it cold." },
  { type: "heading", level: 2, text: "2. The balanced plate — proportions, not perfection" },
  { type: "definition", term: "Balanced diet", text: "A balanced diet supplies ALL nutrients in the right PROPORTIONS for the person's age, sex, size and activity. Plate guide: roughly HALF vegetables and fruit, a QUARTER carbohydrates, a QUARTER protein foods, plus water — with fats used sparingly. Balance is built over the DAY, not the single meal: no single food contains everything, which is why VARIETY is the mechanism, not a virtue slogan." },
  { type: "diagram", diagramId: "balanced-plate", caption: "Half protective foods, quarter energy, quarter body-building — balance over the day" },
  { type: "example", text: "Worked: rice alone fills but does not nourish — add beans (protein) and greens (vitamins, fibre, iron) and the meal becomes balanced. 'Why variety?' — different foods carry different nutrients; the plate proportions operationalise it. Name food GROUPS, not branded dishes." },
  { type: "heading", level: 2, text: "3. Energy balance — intake versus expenditure" },
  { type: "definition", term: "Energy balance", text: "Energy IN (food) versus energy OUT (BMR + activity). BMR = the energy to stay alive at rest — the biggest slice even before you move. SURPLUS (in exceeds out, repeatedly) → stored as fat, weight gain. DEFICIT → weight loss. Matching intake to need is why a manual labourer and an office worker eat differently — energy need is personal, not universal." },
  { type: "example", text: "Worked: the same meal of 800 kcal is a third of a labourer's day but half of a sedentary teen's — requirements scale with ACTIVITY. 'Why does a growing teenager need more protein per kg than an adult?' — growth and repair demand; life stage changes the ratio." },
  { type: "heading", level: 2, text: "4. Meal planning — matching meals to people and purses" },
  { type: "table", headers: ["Group", "Priority", "Watch-outs"], rows: [["Children", "Protein, calcium, iron for growth", "Small frequent meals; limit sugary drinks"], ["Adolescents", "Energy + iron (girls), calcium", "Skipping breakfast — the classic failure"], ["Pregnant women", "Extra protein, iron, folate, calcium", "Folate early — neural tube prevention"], ["Elderly", "Nutrient-dense, easy to chew, fibre, water", "Appetite falls — density must rise"], ["Illness", "Modified texture/hydration per condition", "Follow medical advice, not habit"]] },
  { type: "paragraph", text: "Budgeting skill: plan the WEEK's menu first, buy to the menu (never shop hungry), use seasonal foods (cheaper and fresher), cook once and use leftovers deliberately. The meal plan is the control document of both nutrition and money — 'plan before you buy' is the management answer." },
  { type: "heading", level: 2, text: "5. Cooking methods — what heat does to food" },
  { type: "table", headers: ["Method", "Effect", "Best for / watch-out"], rows: [["Boiling", "Water at 100°C — water-soluble vitamins LEACH out", "Use minimal water, or use the cooking water"], ["Steaming", "Food above the water — nutrients largely retained", "Vegetables, fish — the retention method"], ["Frying", "Hot fat — crisp, fast, calorie-dense", "Oil quality, temperature control, drain well"], ["Baking/roasting", "Dry oven heat — even, browning", "Dishes, roots, meat; watch drying"], ["Stewing", "Long, moist, gentle — flavours merge", "Cheap tough cuts become tender"]] },
  { type: "paragraph", text: "The exam pairing: cooking method → nutrient effect. Vitamin C and B are water-soluble and heat-sensitive — long boiling in lots of water destroys or leaches them; steaming and stir-frying briefly retain them. 'Which method preserves vitamins?' — the mechanism (less water, less time) is the mark, not the method name alone." },
  { type: "heading", level: 2, text: "6. Food safety — the chain of contamination and how to break it" },
  { type: "definition", term: "Food hygiene", text: "Contamination routes: biological (bacteria, moulds, viruses — the big killer), chemical (cleaners, pesticides), physical (glass, hair). The danger zone: 5–60°C — bacteria multiply fastest there; keep cold food BELOW 5°C, hot food ABOVE 60°C. CROSS-CONTAMINATION: raw meat touching ready-to-eat food (or the board that touched it) — separate boards, wash hands between stages. Cook high-risk foods (poultry, eggs, minced meat) RIGHT THROUGH." },
  { type: "example", text: "Worked: chicken on the chopping board, then salad on the same board — cross-contamination, Salmonella travels to food eaten raw. The fix: two boards or a hot wash between. 'Why is the danger zone dangerous?' — bacterial multiplication doubles every ~20 minutes at room temperature; the maths is the mark." },
  { type: "heading", level: 2, text: "7. Food preservation — stopping the spoilage machine" },
  { type: "table", headers: ["Method", "Principle", "Examples"], rows: [["Freezing", "Halts bacterial growth (does not kill all)", "Meat, fish, vegetables — weeks to months"], ["Drying", "Removes water — microbes need it", "Grains, pepper, fish, fruit leather"], ["Canning/bottling", "Heat + sealed container kills and seals out", "Tomatoes, juices"], ["Salting/sugaring", "Draws water out by osmosis", "Salted fish, jam"], ["Pickling/fermenting", "Acid or fermentation suppresses spoilage", "Locust beans, yoghurt, pickles"]] },
  { type: "paragraph", text: "All preservation is ONE principle wearing different clothes: deny microbes what they need — water, warmth, or access. Say the principle and the example; a method list without principles is half the answer." },
  { type: "heading", level: 2, text: "8. Kitchen management — the work triangle and time plans" },
  { type: "paragraph", text: "Layout: sink, cooker and refrigerator form the WORK TRIANGLE — steps between them decide efficiency; long legs waste time and heat. Equipment care: sharp knives (safer), clean filters, correct utensil for the pan (metal on non-stick ruins it). TIME PLANS for practical work: list tasks → sequence by dependency (oven on first, dough proving while you prepare filling) → clean as you go. The time plan is to the kitchen exam what the trace table is to programming: free marks for structure." },
  { type: "heading", level: 2, text: "9. Home management — resources, budgets and consumers" },
  { type: "definition", term: "Management", text: "Home management = using limited RESOURCES (time, money, energy, space, skills) to meet family goals: plan → implement → evaluate — the same cycle as design, applied to a household. BUDGETING: income − essentials (food, rent, utilities) − savings → wants; an emergency fund is a planned expense, not a leftover. CONSUMER rights: safety, information (labels — read them), choice, redress (complaint and refund paths); consumer RESPONSIBILITY: honest claims, correct use." },
  { type: "example", text: "Worked: a monthly plan that caps food spending by menu planning, tracks actual spend weekly, and moves the surplus to savings — management, not luck. 'Why read labels?' — information is a consumer right AND a decision input (expiry, allergens, ingredients order). Name right + responsibility together." },
  { type: "heading", level: 2, text: "10. Summary — the home economics spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Nutrients", "Function + source + deficiency", "The deficiency table, learned cold"], ["Balanced diet", "Proportions over the DAY", "One perfect meal does not balance a week"], ["Cooking", "Method → nutrient effect", "Water-soluble vitamins die in long boiling"], ["Safety", "Danger zone + cross-contamination", "Bacteria multiply fastest at room temperature"], ["Preservation", "Deny water/warmth/access", "Freezing halts growth — it does not sterilise"], ["Management", "Plan → implement → evaluate", "The menu plan controls both nutrition and money"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'list' = the items, complete; 'explain' = the mechanism (why steam retains vitamins, why osmosis preserves); 'plan' = a structured document (menu, time plan, budget) not a paragraph; 'justify' = the group's need matched to the choice. Home economics papers pay for REASONS ATTACHED TO PRACTICES — a habit without its reason earns half." },
];

const HE_QS: Q[] = [
  { q: "Bleeding gums, slow wound healing — the deficiency is", o: ["vitamin A", "vitamin C — scurvy", "iron", "calcium"], a: "vitamin C — scurvy", e: "Deficiency pairings: C scurvy, D rickets, iron anaemia, iodine goitre.", d: "easy" },
  { q: "The main function of protein in the diet is", o: ["instant energy", "growth and repair of body tissue", "insulation only", "vitamin storage"], a: "growth and repair of body tissue", e: "Energy first comes from carbohydrate; protein builds and repairs.", d: "easy" },
  { q: "A balanced plate is roughly", o: ["half carbohydrate", "half vegetables/fruit, quarter carbohydrate, quarter protein", "all protein", "equal quarters of everything"], a: "half vegetables/fruit, quarter carbohydrate, quarter protein", e: "Proportions over the day — variety is the mechanism.", d: "medium" },
  { q: "Water-soluble vitamins are lost most by", o: ["steaming briefly", "long boiling in plenty of water", "freezing", "baking whole"], a: "long boiling in plenty of water", e: "Heat + water leach C and B vitamins — less water, less time.", d: "medium" },
  { q: "The temperature danger zone for bacterial multiplication is", o: ["below 0°C", "5–60°C", "above 100°C", "exactly 37°C only"], a: "5–60°C", e: "Keep cold below 5, hot above 60 — the zone in between is their nursery.", d: "medium" },
  { q: "Cutting raw chicken then salad on the same board is", o: ["efficient", "cross-contamination — a food-poisoning chain", "marinating", "fine if rinsed briefly"], a: "cross-contamination — a food-poisoning chain", e: "Separate boards or a hot wash between stages.", d: "easy" },
  { q: "Freezing preserves food by", o: ["killing every microbe", "halting bacterial growth — it does not sterilise", "removing all water", "adding salt"], a: "halting bacterial growth — it does not sterilise", e: "Growth stops below freezing; cooking still needed for safety.", d: "medium" },
  { q: "Drying preserves food because", o: ["cold kills bacteria", "microbes need water — removing it stops spoilage", "salt is added", "light destroys nutrients"], a: "microbes need water — removing it stops spoilage", e: "One principle, many methods: deny water, warmth, or access.", d: "medium" },
  { q: "The kitchen work triangle links", o: ["table, chairs, door", "sink, cooker, refrigerator — the efficiency path", "pantry, window, bin", "any three appliances"], a: "sink, cooker, refrigerator — the efficiency path", e: "Step counts between the three work centres decide layout quality.", d: "medium" },
  { q: "A weekly menu plan written before shopping chiefly controls", o: ["nothing — it is decoration", "both nutrition quality and food spending", "only taste", "cooking speed only"], a: "both nutrition quality and food spending", e: "Plan before you buy — the management cycle in one habit.", d: "easy" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "home-economics-food-nutrition" } });
    if (!topic) throw new Error("master home-economics-food-nutrition topic missing");
    let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: { domain: "highschool", topicId: topic.id, title: "Standard lesson (auto-created)", orderIndex: 0, content: { blocks: [] } as object },
      });
    }
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Home Economics / Food & Nutrition — Complete", content: { blocks: HE_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < HE_QS.length; i++) {
      const item = HE_QS[i];
      await prisma.question.upsert({
        where: { id: `master-homeecon-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-homeecon-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "homeecon-rebuild", blocks: HE_BLOCKS.length, questions: HE_QS.length });
  } catch (e) {
    console.error("rebuild homeecon failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
