import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// TEMPORARY cell-biology finisher (quiz + exam links + verified) — DELETE after confirmed.
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const topic = await prisma.topic.findFirst({ where: { slug: "cell-biology" } });
    if (!topic) throw new Error("master cell-biology topic missing");
    const today = new Date();
    const QS: { q: string; o: string[]; a: string; e: string; d: string }[] = [
      { q: "Which organelle is responsible for the production of energy in the cell?", o: ["Nucleus", "Mitochondrion", "Ribosome", "Chloroplast"], a: "Mitochondrion", e: "Mitochondria carry out aerobic respiration, releasing ATP.", d: "easy" },
      { q: "The scientist who discovered the cell by observing dead cork tissue was", o: ["Robert Brown", "Robert Hooke", "Schleiden", "Virchow"], a: "Robert Hooke", e: "Hooke (1665) coined the term cell from cork compartments.", d: "easy" },
      { q: "Which structure is found in plant cells but NOT in animal cells?", o: ["Nucleus", "Mitochondrion", "Chloroplast", "Ribosome"], a: "Chloroplast", e: "Chloroplasts (photosynthesis) and cell walls are plant-only.", d: "easy" },
      { q: "Osmosis is best defined as the movement of", o: ["solute particles down a gradient", "water across a selectively permeable membrane", "ions against a gradient using ATP", "cytoplasm during division"], a: "water across a selectively permeable membrane", e: "Osmosis concerns water only, toward the stronger solution.", d: "medium" },
      { q: "A red blood cell placed in distilled water will", o: ["shrink by crenation", "swell and burst by haemolysis", "remain unchanged", "divide by mitosis"], a: "swell and burst by haemolysis", e: "Water enters by osmosis until the membrane ruptures.", d: "medium" },
      { q: "Which stage of mitosis is marked by chromosomes lining up at the equator?", o: ["Prophase", "Metaphase", "Anaphase", "Telophase"], a: "Metaphase", e: "Chromosomes attach by centromeres on the spindle equator.", d: "medium" },
      { q: "Crossing over of chromatids occurs during", o: ["Prophase of mitosis", "Prophase I of meiosis", "Anaphase II of meiosis", "Interphase"], a: "Prophase I of meiosis", e: "Homologous chromosomes exchange segments, creating variation.", d: "medium" },
      { q: "How many genetically different haploid cells result from one meiosis?", o: ["Two identical diploid", "Two different haploid", "Four identical haploid", "Four different haploid"], a: "Four different haploid", e: "Two divisions produce four varied gametes.", d: "medium" },
      { q: "Active transport differs from diffusion because it", o: ["needs no membrane", "moves substances against a gradient using ATP", "applies to water only", "is always faster"], a: "moves substances against a gradient using ATP", e: "e.g. root hairs absorbing ions from dilute soil.", d: "hard" },
      { q: "Which pair correctly matches an organelle to a cell that needs it most?", o: ["Chloroplasts — muscle cells", "Lysosomes — gland cells", "Mitochondria — sperm cells", "Cell wall — nerve cells"], a: "Mitochondria — sperm cells", e: "Sperm tails need abundant ATP for swimming.", d: "hard" },
    ];
    let n = 0;
    for (let i = 0; i < QS.length; i++) {
      const item = QS[i];
      await prisma.question.upsert({
        where: { id: `master-cell-biology-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-cell-biology-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
      n++;
    }
    // Exam links: Cell Biology is core WAEC/NECO syllabus (human-verified standard syllabus fact).
    const boards = await prisma.curriculumBoard.findMany({ where: { name: { in: ["WAEC Nigeria", "WAEC Ghana", "NECO"] } } });
    for (const board of boards) {
      const existing = await prisma.topicBoardAlignment.findFirst({ where: { topicId: topic.id, boardId: board.id, trackId: null } });
      if (existing) await prisma.topicBoardAlignment.update({ where: { id: existing.id }, data: { tier: "core", verifiedDate: today, weightNotes: "CORE WAEC/NECO biology syllabus: cells as unit of life." } });
      else await prisma.topicBoardAlignment.create({ data: { topicId: topic.id, boardId: board.id, trackId: null, tier: "core", verifiedDate: today, weightNotes: "CORE WAEC/NECO biology syllabus: cells as unit of life." } });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today, needsVerification: false } });
    return NextResponse.json({ ok: true, questions: n, examBoards: boards.length });
  } catch (e) {
    console.error("temp cell finish failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
