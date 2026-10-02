import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// TEMPORARY bioenergetics finisher (chapter + quiz + all-boards core) — DELETE after confirmed.
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const topic = await prisma.topic.findFirst({ where: { slug: "bioenergetics-biochemistry" } });
    if (!topic) throw new Error("master bioenergetics-biochemistry topic missing");
    const today = new Date();
    const blocks = [
      { type: "heading", level: 2, text: "1. Energy runs life" },
      { type: "paragraph", text: "Every heartbeat, root-hair pump, and thought burns energy. Cells handle energy in two great pathways: releasing it (respiration) and capturing it (photosynthesis) — linked by a single currency, ATP." },
      { type: "definition", term: "ATP", text: "Adenosine triphosphate — the energy currency. Breaking its terminal phosphate releases usable energy; rebuilding it stores energy. Made in respiration, spent everywhere." },
      { type: "heading", level: 2, text: "2. Aerobic respiration — the full audit" },
      { type: "paragraph", text: "Glucose is dismantled in stages so energy is captured gradually, not wasted as heat. It starts in the cytoplasm and finishes inside mitochondria." },
      { type: "table", headers: ["Stage", "Where", "What happens"], rows: [["Glycolysis", "Cytoplasm", "Glucose (6C) split into 2 pyruvate (3C); small ATP gain, no oxygen needed"], ["Link reaction + Krebs cycle", "Mitochondrial matrix", "Pyruvate oxidised to carbon dioxide; carriers loaded with hydrogen"], ["Electron transport chain", "Cristae membranes", "Hydrogen split; energy pumps protons, oxygen accepts electrons → water; flood of ATP"]] },
      { type: "definition", term: "Word equation", text: "Glucose + oxygen → carbon dioxide + water (+ energy). Learn it both directions — respiration releases, photosynthesis captures." },
      { type: "example", text: "Germinating seeds in a respirometer absorb oxygen and release carbon dioxide — soda lime absorbs the CO₂ so the capillary shows oxygen uptake alone." },
      { type: "heading", level: 2, text: "3. When oxygen runs out — anaerobic respiration" },
      { type: "paragraph", text: "Without oxygen only glycolysis pays out, so cells regenerate carriers by dumping pyruvate into lactate (animals) or ethanol + carbon dioxide (plants, yeast). Two ATP per glucose instead of ~30 — expensive, and lactate causes muscle fatigue (repaid as oxygen debt)." },
      { type: "example", text: "Yeast fermenting dough releases carbon dioxide that raises bread; the same pathway brews beer and wine — controlled anaerobic respiration at industrial scale." },
      { type: "callout", variant: "warning", text: "Exam trap: anaerobic in ANIMALS makes lactic acid; in PLANTS/YEAST makes ethanol + CO₂. Naming the wrong product loses the mark." },
      { type: "heading", level: 2, text: "4. Photosynthesis — capturing light" },
      { type: "paragraph", text: "Green plants convert light into chemistry in two linked stages inside the chloroplast." },
      { type: "table", headers: ["Stage", "Where", "Needs"], rows: [["Light-dependent", "Thylakoid membranes", "Light + water → oxygen + energy carriers"], ["Light-independent (Calvin cycle)", "Stroma", "Carbon dioxide fixed into glucose using those carriers"]] },
      { type: "definition", term: "Limiting factors", text: "Light intensity, carbon dioxide concentration, temperature — and chlorophyll. Raising any other factor changes nothing while one limits (Blackman's principle)." },
      { type: "example", text: "A destarched plant with one foil-covered leaf, tested with iodine after sunlight: only the uncovered leaf turns blue-black — proving light is necessary for starch formation." },
      { type: "paragraph", text: "Leaves are engineered for this job: broad thin blades (light + diffusion), palisade packing of chloroplasts, stomata with guard cells for gas exchange, veins for water in and sugar out." },
      { type: "heading", level: 2, text: "5. Enzymes — biology's catalysts" },
      { type: "definition", term: "Enzyme", text: "A protein catalyst: specific (one substrate, one active site — lock-and-key, refined by induced fit), reusable, and destroyed by extremes." },
      { type: "table", headers: ["Factor", "Effect"], rows: [["Temperature", "Rate doubles per ~10°C rise; denatured above optimum (~40°C human enzymes)"], ["pH", "Each enzyme has an optimum (pepsin acid, trypsin alkaline); wrong pH denatures"], ["Substrate concentration", "Rate rises then plateaus — all active sites busy"], ["Inhibitors", "Competitive blockers fit the site; non-competitive deform it"]] },
      { type: "example", text: "Salivary amylase works best near neutral pH in the mouth, then is denatured by stomach acid — which is exactly why pepsin, not amylase, digests in the stomach." },
      { type: "callout", variant: "info", text: "Denaturation is structural, not chemical death: heat or pH breaks the bonds holding the active site's shape. Cooling cannot rebuild it." },
      { type: "heading", level: 2, text: "6. The grand link" },
      { type: "paragraph", text: "Photosynthesis stores light as glucose and releases the oxygen respiration demands; respiration burns glucose and releases the carbon dioxide photosynthesis fixes. Mitochondria and chloroplasts are two halves of one planetary cycle — and ATP is the coin between them." },
    ];
    const existing = await prisma.lesson.findFirst({ where: { topicId: topic.id } });
    if (existing) await prisma.lesson.update({ where: { id: existing.id }, data: { title: "Bioenergetics & Biochemistry — Complete", content: { blocks } as object, estimatedMinutes: 45 } });
    else await prisma.lesson.create({ data: { domain: "highschool", topicId: topic.id, title: "Bioenergetics & Biochemistry — Complete", content: { blocks } as object, orderIndex: 0, estimatedMinutes: 45 } });
    const QS: { q: string; o: string[]; a: string; e: string; d: string }[] = [
      { q: "The end products of aerobic respiration in living cells are", o: ["glucose and oxygen", "carbon dioxide, water and energy", "lactic acid and energy", "ethanol and carbon dioxide"], a: "carbon dioxide, water and energy", e: "Complete oxidation of glucose releases CO₂, H₂O and ~30 ATP.", d: "easy" },
      { q: "Glycolysis occurs in the", o: ["mitochondrial matrix", "cytoplasm", "chloroplast stroma", "nucleus"], a: "cytoplasm", e: "Glucose is split to pyruvate in the cytoplasm, no oxygen needed.", d: "easy" },
      { q: "In plants, anaerobic respiration produces", o: ["lactic acid", "ethanol and carbon dioxide", "water and oxygen", "amino acids"], a: "ethanol and carbon dioxide", e: "Yeast/plants ferment to ethanol + CO₂; animals make lactate.", d: "medium" },
      { q: "The light-independent stage of photosynthesis takes place in the", o: ["thylakoid membranes", "stroma", "cytoplasm", "mitochondrial matrix"], a: "stroma", e: "The Calvin cycle fixes CO₂ in the stroma using light-stage products.", d: "medium" },
      { q: "A destarched leaf partially covered with foil, then tested with iodine after sunlight, proves that", o: ["chlorophyll is necessary", "carbon dioxide is necessary", "light is necessary for starch formation", "oxygen is released"], a: "light is necessary for starch formation", e: "Only the uncovered part turns blue-black with iodine.", d: "medium" },
      { q: "Enzymes are denatured at high temperature because", o: ["the substrate evaporates", "bonds holding the active site break", "they dissolve in water", "pH always rises"], a: "bonds holding the active site break", e: "Shape loss is irreversible; cooling cannot restore it.", d: "medium" },
      { q: "Salivary amylase stops working in the stomach mainly because of", o: ["lack of substrate", "low pH denaturing it", "excess ATP", "absence of light"], a: "low pH denaturing it", e: "Stomach acid destroys amylase's shape; pepsin takes over.", d: "medium" },
      { q: "Which factor does NOT affect the rate of photosynthesis?", o: ["Light intensity", "Carbon dioxide concentration", "Oxygen concentration", "Temperature"], a: "Oxygen concentration", e: "Limiting factors are light, CO₂, temperature (and chlorophyll).", d: "hard" },
      { q: "Oxygen debt after vigorous exercise is repaid to", o: ["make more lactate", "break down lactate in the liver", "cool the muscles", "absorb glucose"], a: "break down lactate in the liver", e: "Extra post-exercise oxygen oxidises accumulated lactate.", d: "hard" },
      { q: "The link reaction and Krebs cycle occur in the", o: ["cytoplasm", "mitochondrial matrix", "cristae", "thylakoids"], a: "mitochondrial matrix", e: "Pyruvate is oxidised to CO₂ there; ATP floods from the cristae chain.", d: "hard" },
    ];
    for (let i = 0; i < QS.length; i++) {
      const item = QS[i];
      await prisma.question.upsert({
        where: { id: `master-bioenergetics-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-bioenergetics-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    const boards = await prisma.curriculumBoard.findMany({ select: { id: true } });
    for (const board of boards) {
      const existing2 = await prisma.topicBoardAlignment.findFirst({ where: { topicId: topic.id, boardId: board.id, trackId: null } });
      if (existing2) await prisma.topicBoardAlignment.update({ where: { id: existing2.id }, data: { tier: "core", verifiedDate: today, weightNotes: "CORE: respiration, photosynthesis, enzymes in all 20 regions." } });
      else await prisma.topicBoardAlignment.create({ data: { topicId: topic.id, boardId: board.id, trackId: null, tier: "core", verifiedDate: today, weightNotes: "CORE: respiration, photosynthesis, enzymes in all 20 regions." } });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today, needsVerification: false } });
    return NextResponse.json({ ok: true, blocks: blocks.length, questions: QS.length, boards: boards.length });
  } catch (e) {
    console.error("temp bioenergetics failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
