import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Biology Topic 4: Human Physiology standard chapter at the
// no-exceptions bar: digestion, circulation, gas exchange, nerves, hormones,
// homeostasis, excretion — with practicals, calculations, exam-style items.

const PHYSIO_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Digestion — a canal of specialists" },
  { type: "paragraph", text: "Digestion is mechanical (teeth, churning, emulsification) plus chemical (hydrolysis by enzymes, each with its region and pH). The gut is a disassembly line: the exam answer names region → enzyme → substrate → product in that order." },
  { type: "table", headers: ["Region", "Enzyme (and optimum)", "Action"], rows: [["Mouth", "Salivary amylase (neutral pH)", "Starch → maltose; chewing adds surface"], ["Stomach", "Pepsin (pH ~2, from HCl)", "Protein → polypeptides; acid also kills microbes"], ["Duodenum", "Pancreatic amylase, trypsin, lipase + bile salts", "Starch→maltose; peptides→amino acids start; fat → fatty acids + glycerol (emulsified first)"], ["Ileum", "Maltase, peptidases, lipase (in membrane)", "Final breakdown to absorbable monomers"]] },
  { type: "paragraph", text: "Bile is not an enzyme — the mark-scheme favourite. Made in the liver, stored in the gall bladder, it emulsifies fat into droplets (multiplying lipase's working surface) and neutralises stomach acid to give duodenal enzymes their pH. The ileum then absorbs: villi and microvilli multiply surface ~x600, walls one cell thick shorten diffusion distance, dense capillaries plus lacteals maintain the gradient by sweeping products away — four adaptations, name all four." },
  { type: "example", text: "Required practical — the Visking tubing gut model: tubing filled with starch + enzyme solution, suspended in warm water, tested outside for starch (remains — too big to pass) and glucose (appears — crosses the pores). It models the gut precisely: digested products cross, polymers cannot. Controls: warm water (enzyme optimum), equal volumes, testing intervals. Explain WHY each result — the marks are in the reasoning, not the colours." },
  { type: "heading", level: 2, text: "2. Circulation — the double pump" },
  { type: "paragraph", text: "Humans run two circuits in series: the right heart sends deoxygenated blood to the lungs (pulmonary), the left heart pumps oxygenated blood to the body (systemic) at higher pressure. Four chambers and one-way valves (atrio-ventricular, plus semilunar at the exits) prevent backflow; the heart's own muscle is fed by coronary arteries — blockage there is the myocardial infarction." },
  { type: "diagram", diagramId: "double-circulation", caption: "Pulmonary and systemic loops" },
  { type: "table", headers: ["Vessel", "Wall structure", "Structure → function"], rows: [["Artery", "Thick muscle + elastic, narrow lumen", "Withstands and smooths the pulse; carries blood away at high pressure"], ["Capillary", "One cell thick, huge total cross-section", "Exchange zone: short distance, slow flow, maximum transfer"], ["Vein", "Thin wall, wide lumen, valves", "Low pressure return; muscle squeeze + valves defeat gravity"]] },
  { type: "paragraph", text: "Blood itself is tissue: plasma (transport medium — water, nutrients, hormones, wastes, heat), red cells (haemoglobin, biconcave, no nucleus — max O₂ carriage), white cells (phagocytes engulf, lymphocytes produce antibodies), platelets (clotting cascade — fibrin mesh seals wounds). Transfusion compatibility (ABO) links straight back to genetics." },
  { type: "example", text: "Worked calculation — cardiac output: CO = stroke volume × heart rate. At 70 mL per beat and 72 beats per minute: CO = 70 × 72 = 5,040 mL ≈ 5 litres per minute — the entire blood volume circulates roughly once a minute at rest, and can rise 4–5× in exercise. Show the formula, convert units, and state the resting fact." },
  { type: "callout", variant: "warning", text: "Exam trap: pulmonary vessels break the rule — the pulmonary ARTERY carries deoxygenated blood (to the lungs), the pulmonary VEIN carries oxygenated (back). Any answer mentioning pulmonary vessels must qualify oxygenation or it hands the examiner a correction." },
  { type: "heading", level: 2, text: "3. Breathing and gas exchange" },
  { type: "table", headers: ["", "Inhalation", "Exhalation"], rows: [["Diaphragm", "Contracts — flattens, moves down", "Relaxes — domes upward"], ["Ribs", "External intercostals raise them out/up", "Relax; ribs fall"], ["Thorax volume", "Increases", "Decreases"], ["Pressure", "Falls below atmospheric", "Rises above"], ["Result", "Air flows in", "Air flows out (passive at rest)"]] },
  { type: "paragraph", text: "Exchange happens at alveoli: ~300 million, each one cell thick, moist (gases dissolve first), wrapped in a dense capillary net, and ventilated so gradients never flatten. Blood arriving at ~CO₂-rich, O₂-poor equilibrates in a fraction of a second of contact. Compare inhaled air (21% O₂, 0.04% CO₂) with exhaled (16%, 4%) — the limewater practical's evidence." },
  { type: "example", text: "Required practical — exercise response: measure resting breathing/heart rate, then after stepping for 2 minutes. Both rise because respiration demand rises (more ATP for muscle, more O₂ delivery, more CO₂ to clear); recovery time measures fitness. State variables controlled (same person, same step height, same timing method) and the reason: to isolate the exercise variable." },
  { type: "heading", level: 2, text: "4. Nervous coordination — wiring and reflexes" },
  { type: "paragraph", text: "The nervous system splits CNS (brain, spinal cord) from PNS. Neurones are adapted to their jobs: dendrites collect, a long myelinated axon insulates and speeds the electrical impulse (saltatory conduction), and the cell body holds the nucleus. Sensory neurones carry receptor→CNS, relay neurones link inside the CNS, motor neurones carry CNS→effector." },
  { type: "definition", term: "The reflex arc", text: "Receptor detects (heat) → sensory neurone → relay neurone (spinal cord) → motor neurone → effector (muscle pulls hand away). The spinal reflex bypasses conscious processing — speed protects tissue. Reflexes are involuntary, rapid, and stereotyped; the exam wants the five-label pathway drawn with arrows." },
  { type: "paragraph", text: "At the synapse the electrical message becomes chemical: vesicles of neurotransmitter (e.g. acetylcholine) fuse with the presynaptic membrane, diffuse the ~20 nm gap, and bind receptors on the far side, regenerating the impulse. The one-way design (only the far side has receptors) plus enzyme clean-up (acetylcholinesterase) explains direction and reset — two classic explain-questions with one mechanism." },
  { type: "heading", level: 2, text: "5. Hormones — the postal service of control" },
  { type: "table", headers: ["Hormone", "Source", "Effect"], rows: [["Insulin", "Beta cells, pancreas", "Lowers blood glucose: liver + muscle take it in, stored as glycogen"], ["Glucagon", "Alpha cells, pancreas", "Raises blood glucose: glycogenolysis in the liver"], ["Adrenaline", "Adrenal glands", "Fight-or-flight: heart and breathing rates up, glucose released, pupils dilate"], ["ADH", "Pituitary", "Kidney collecting ducts reabsorb more water — concentrated urine"], ["Thyroxine", "Thyroid", "Sets metabolic rate — the basal-temperature dial"]] },
  { type: "definition", term: "Negative feedback", text: "A change triggers a response that reverses the change — the control loop that keeps conditions near a set point. Rising glucose triggers insulin; falling glucose triggers glucagon. Every homeostatic story is this loop with different actors." },
  { type: "paragraph", text: "Diabetes breaks the loop two ways: Type 1 — the immune destruction of beta cells means NO insulin (insulin injections, typically young onset); Type 2 — cells stop responding to insulin (managed by diet, exercise, medication; linked to obesity, adult onset). One is an absence, the other a resistance — the exam distinction, and why one is treated by replacement and the other by sensitivity." },
  { type: "heading", level: 2, text: "6. Homeostasis — the constancy that enzymes demand" },
  { type: "paragraph", text: "Enzymes work in narrow windows, so internal conditions are defended: temperature (37 °C — vasodilation and sweating shed heat; shivering and vasoconstriction conserve it; controlled by the hypothalamic thermostat), water and ion balance (ADH on the kidney), and glucose (insulin/glucagon). Homeostasis answers always name the receptor (where the change is sensed), the coordinator, and the effector — the three-part structure of the loop." },
  { type: "heading", level: 2, text: "7. Excretion — the kidney's million filters" },
  { type: "diagram", diagramId: "nephron", caption: "The nephron's journey" },
  { type: "paragraph", text: "Each kidney holds about a million nephrons. Ultrafiltration at the glomerulus: blood pressure forces water, glucose, salts, urea and small molecules out of the knot into the capsule — blood cells and proteins are too big. Along the tubule, selective reabsorption claws back ALL glucose, most salts, and water as needed; urea stays out — the waste the body actually wants gone. The loop of Henle builds a salt gradient in the medulla, and ADH tunes the collecting duct's permeability: dehydrated → more ADH → more water reabsorbed → small volumes of dark urine; over-hydrated → the reverse." },
  { type: "example", text: "Dialysis, reasoned like an exam question: dialysis fluid must match plasma in glucose and salt concentration (so those diffuse neither way) and contain NO urea (so urea leaves the blood down its steepest gradient). Answer 'why is there no glucose in dialysis fluid?' wrong on real machines and the patient dies of hypoglycaemia — which is exactly why the question keeps being asked." },
  { type: "heading", level: 2, text: "8. Nerves versus hormones — the comparison the exam always wants" },
  { type: "table", headers: ["", "Nervous", "Hormonal"], rows: [["Signal", "Electrical impulse + neurotransmitter", "Chemical in blood"], ["Speed", "Fast (ms–s)", "Slow (seconds–minutes)"], ["Duration", "Brief, precise", "Longer-lasting, widespread"], ["Reach", "Specific cells wired in", "Any cell with the receptor"], ["Example", "Hand from flame", "Adrenaline before an exam"]] },
  { type: "heading", level: 2, text: "9. Summary — systems that defend the internal sea" },
  { type: "table", headers: ["System", "Core job", "Signature structure"], rows: [["Digestive", "Breakdown + absorption", "Villi surface"], ["Circulatory", "Transport loop", "Capillary bed"], ["Respiratory", "Gas exchange", "Alveolus"], ["Nervous", "Fast control", "Myelinated axon + synapse"], ["Endocrine", "Slow control", "Receptor-specific hormones"], ["Excretory", "Waste + water balance", "Nephron + ADH"]] },
  { type: "callout", variant: "info", text: "Command-word discipline: 'explain' demands because-chains (adaptation → mechanism → outcome); 'compare' demands both columns named per point; 'calculate' demands formula, substitution, units. Physiology papers are structured-mark banks — the pattern is always anatomy → mechanism → consequence." },
];

const PHYSIO_QS: Q[] = [
  { q: "Pepsin works best at pH 2 because", o: ["all enzymes prefer acid", "its active-site shape is stable in stomach acid", "food is solid there", "it is made in the mouth"], a: "its active-site shape is stable in stomach acid", e: "Denaturation is pH-specific — shape is the answer, always.", d: "easy" },
  { q: "Bile's two jobs are", o: ["digesting starch and protein", "emulsifying fat and neutralising stomach acid", "absorbing glucose", "making urea"], a: "emulsifying fat and neutralising stomach acid", e: "No enzymes in bile — surface area + pH only.", d: "easy" },
  { q: "In the Visking tubing model, glucose reaches the surrounding water because", o: ["it is pushed out by pressure", "digested monomers are small enough to cross the pores", "starch converts to glucose outside", "the tubing dissolves"], a: "digested monomers are small enough to cross the pores", e: "Polymers stay in; products cross — the gut's logic in one model.", d: "medium" },
  { q: "Cardiac output at 70 mL stroke volume and 75 beats/min is about", o: ["1.5 L/min", "5.25 L/min", "75 L/min", "145 mL/min"], a: "5.25 L/min", e: "CO = SV × HR = 0.070 L × 75. Show the substitution.", d: "medium" },
  { q: "The pulmonary vein carries", o: ["deoxygenated blood to the lungs", "oxygenated blood to the heart — the exception to the rule", "blood to the body", "no blood"], a: "oxygenated blood to the heart — the exception to the rule", e: "Name it or lose it: pulmonary vessels reverse the usual oxygenation.", d: "easy" },
  { q: "During exhalation, the diaphragm", o: ["flattens downward", "relaxes upward and air leaves as pressure rises", "contracts to squeeze ribs", "stays fixed"], a: "relaxes upward and air leaves as pressure rises", e: "Volume falls → pressure exceeds atmospheric → outflow.", d: "easy" },
  { q: "The correct reflex arc order is", o: ["effector → motor → CNS", "receptor → sensory → relay → motor → effector", "receptor → motor → sensory", "CNS → receptor → effector"], a: "receptor → sensory → relay → motor → effector", e: "Draw it with arrows — sequence marks are literal.", d: "easy" },
  { q: "Type 1 versus Type 2 diabetes differs in that", o: ["Type 1 resists insulin; Type 2 lacks it", "Type 1 lacks insulin production; Type 2 is cellular resistance to it", "both lack insulin", "neither involves glucose"], a: "Type 1 lacks insulin production; Type 2 is cellular resistance to it", e: "Replacement therapy vs sensitivity management.", d: "medium" },
  { q: "Dialysis fluid lacks glucose because", o: ["glucose would poison the machine", "matching plasma glucose prevents its loss from blood — only urea must leave", "glucose cannot diffuse", "patients dislike sweetness"], a: "matching plasma glucose prevents its loss from blood — only urea must leave", e: "Dialysis is selective by concentration design.", d: "hard" },
  { q: "Dehydration triggers ADH release, which results in", o: ["more water reabsorbed in the collecting duct — small volumes of concentrated urine", "less reabsorption and pale urine", "the kidneys stopping work", "glucose in urine"], a: "more water reabsorbed in the collecting duct — small volumes of concentrated urine", e: "Negative feedback from osmoreceptors in the hypothalamus.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "human-physiology" } });
    if (!topic) throw new Error("master human-physiology topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("physiology standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Human Physiology — Complete", content: { blocks: PHYSIO_BLOCKS } as object, estimatedMinutes: 50 } });
    for (let i = 0; i < PHYSIO_QS.length; i++) {
      const item = PHYSIO_QS[i];
      await prisma.question.upsert({
        where: { id: `master-human-physiology-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-human-physiology-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "physiology-rebuild", blocks: PHYSIO_BLOCKS.length, questions: PHYSIO_QS.length });
  } catch (e) {
    console.error("rebuild physiology failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
