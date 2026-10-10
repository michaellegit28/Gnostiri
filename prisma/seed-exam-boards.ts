// Exam Blueprint Engine — board profile seed.
// Verification source: the owner's Brief 2 "Verified Exam Board Profiles".
// Boards whose full format data (durations/marks per paper) is NOT in the
// verified profiles are deliberately NOT seeded here — see the flag note in
// the handoff. Idempotent: safe to run repeatedly; upserts on stable keys.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SeedPaper {
  paperId: string;
  paperName: string;
  sequence: number;
  delivery: "CBT" | "PAPER" | "HYBRID" | "ORAL";
  questionTypes: string[];
  durationMinutes: number;
  marks: number;
  applicability: string[];
  required: boolean;
  instructions?: string;
}

const WAEC_FORMAT: SeedPaper[] = [
  { paperId: "P1", paperName: "Objective", sequence: 1, delivery: "CBT", questionTypes: ["MCQ"], durationMinutes: 60, marks: 50, applicability: ["all"], required: true, instructions: "Answer ALL questions. Each question carries equal marks." },
  { paperId: "P2", paperName: "Theory/Essay", sequence: 2, delivery: "HYBRID", questionTypes: ["THEORY"], durationMinutes: 140, marks: 100, applicability: ["all"], required: true, instructions: "Answer any FOUR questions. Write clearly in the answer booklet." },
  { paperId: "P3", paperName: "Practical / Alt to Practical", sequence: 3, delivery: "HYBRID", questionTypes: ["PRACTICAL"], durationMinutes: 120, marks: 50, applicability: ["sciences", "technical"], required: false, instructions: "For school candidates: practical. Private candidates: Alternative to Practical." },
];

const BOARD_PROFILES: {
  slug: string;
  name: string;
  code: string;
  country: string;
  notes?: string;
  formatConfig: SeedPaper[];
}[] = [
  {
    slug: "jamb",
    name: "JAMB (UTME)",
    code: "jamb",
    country: "Nigeria",
    formatConfig: [
      { paperId: "P1", paperName: "UTME", sequence: 1, delivery: "CBT", questionTypes: ["MCQ"], durationMinutes: 120, marks: 400, applicability: ["all"], required: true, instructions: "Computer-based: answer ALL questions. No negative marking." },
    ],
  },
  { slug: "waec", name: "WAEC (WASSCE)", code: "waec", country: "Nigeria", notes: "Transitioning to hybrid CBT: MCQs on-screen, theory answers in booklets.", formatConfig: WAEC_FORMAT },
  { slug: "neco", name: "NECO (SSCE)", code: "neco", country: "Nigeria", formatConfig: WAEC_FORMAT },
  {
    slug: "wassce-ghana",
    name: "WASSCE (Ghana)",
    code: "wassce-gh",
    country: "Ghana",
    formatConfig: [
      { paperId: "P1", paperName: "Objective", sequence: 1, delivery: "PAPER", questionTypes: ["MCQ"], durationMinutes: 40, marks: 40, applicability: ["all"], required: true, instructions: "Answer ALL questions in this section." },
      { paperId: "P2", paperName: "Essay/Theory", sequence: 2, delivery: "PAPER", questionTypes: ["THEORY"], durationMinutes: 140, marks: 100, applicability: ["all"], required: true },
      { paperId: "P3", paperName: "Practical", sequence: 3, delivery: "PAPER", questionTypes: ["PRACTICAL"], durationMinutes: 180, marks: 40, applicability: ["sciences"], required: false },
    ],
  },
  {
    slug: "kcse",
    name: "KCSE",
    code: "kcse",
    country: "Kenya",
    formatConfig: [
      { paperId: "P1", paperName: "Paper 1 — Theory", sequence: 1, delivery: "PAPER", questionTypes: ["THEORY", "MCQ"], durationMinutes: 150, marks: 80, applicability: ["all"], required: true },
      { paperId: "P2", paperName: "Paper 2 — Theory", sequence: 2, delivery: "PAPER", questionTypes: ["THEORY"], durationMinutes: 150, marks: 80, applicability: ["all"], required: true },
      { paperId: "P3", paperName: "Paper 3 — Practical", sequence: 3, delivery: "PAPER", questionTypes: ["PRACTICAL"], durationMinutes: 120, marks: 40, applicability: ["sciences"], required: false },
    ],
  },
  {
    slug: "nsc-matric",
    name: "NSC (Matric)",
    code: "nsc",
    country: "South Africa",
    formatConfig: [
      { paperId: "P1", paperName: "Paper 1", sequence: 1, delivery: "PAPER", questionTypes: ["MCQ", "THEORY"], durationMinutes: 180, marks: 150, applicability: ["all"], required: true },
      { paperId: "P2", paperName: "Paper 2", sequence: 2, delivery: "PAPER", questionTypes: ["THEORY"], durationMinutes: 180, marks: 150, applicability: ["all"], required: true },
    ],
  },
];

async function main() {
  const verified = new Date();
  console.log("Seeding exam board blueprint profiles…");

  // 1. Board profiles + blueprint papers
  const boardIds: { slug: string; id: string }[] = [];
  for (const profile of BOARD_PROFILES) {
    const board = await prisma.examination.upsert({
      where: { slug: profile.slug },
      update: { name: profile.name, country: profile.country, lastVerified: verified, notes: profile.notes ?? null },
      create: {
        slug: profile.slug,
        name: profile.name,
        code: profile.code,
        country: profile.country,
        domain: "highschool",
        lastVerified: verified,
        notes: profile.notes ?? null,
      },
    });
    boardIds.push({ slug: board.slug, id: board.id });
    for (const paper of profile.formatConfig) {
      await prisma.examinationPaper.upsert({
        where: { examinationId_paperId: { examinationId: board.id, paperId: paper.paperId } },
        update: {
          paperName: paper.paperName,
          sequence: paper.sequence,
          delivery: paper.delivery,
          questionTypes: paper.questionTypes,
          durationMinutes: paper.durationMinutes,
          marks: paper.marks,
          applicability: paper.applicability,
          required: paper.required,
          instructions: paper.instructions ?? null,
        },
        create: { examinationId: board.id, ...paper },
      });
    }
  }
  console.log(`✓ ${boardIds.length} board profiles (JAMB, WAEC, NECO, WASSCE-Ghana, KCSE, NSC)`);

  // 2. Cross-board CORE tagging: curriculum MCQ questions serve every board's
  // first MCQ paper. Curriculum content is board-agnostic; boards package it.
  // RESUME GUARD: serverless functions can hit execution limits mid-seed —
  // if tags already exist, skip the bulk pass and continue with the samples.
  const existingTagCount = await prisma.questionBoardTag.count({
    where: { examinationId: { in: boardIds.map((b) => b.id) } },
  });
  let tagCount = 0;
  if (existingTagCount > 0) {
    console.log(`↷ skip cross-board tag pass (${existingTagCount} tags already present)`);
  } else {
    const mcqQuestions = await prisma.question.findMany({
      where: { type: "mcq" },
      select: { id: true },
    });
    for (const board of boardIds) {
      const firstMcqPaper = (
        await prisma.examinationPaper.findMany({ where: { examinationId: board.id }, orderBy: { sequence: "asc" } })
      ).find((p) => Array.isArray(p.questionTypes) && (p.questionTypes as string[]).includes("MCQ"));
      if (!firstMcqPaper) continue;
      for (const question of mcqQuestions) {
        await prisma.questionBoardTag.upsert({
          where: { questionId_examinationId: { questionId: question.id, examinationId: board.id } },
          update: { tier: "CORE", paperIds: [firstMcqPaper.paperId] },
          create: { questionId: question.id, examinationId: board.id, tier: "CORE", paperIds: [firstMcqPaper.paperId] },
        });
        tagCount++;
      }
    }
  }
  console.log(`✓ ${tagCount} CORE question tags across boards`);

  // 3. Validation samples: theory + practical questions on the biology cell
  // topic, tagged to WAEC P2/P3, so the multi-type manifest path is provable
  // end-to-end. Clearly id-marked as blueprint samples.
  const cellTopic = await prisma.topic.findFirst({ where: { id: "waec-biology-cell-structure" } });
  const waec = boardIds.find((b) => b.slug === "waec");
  if (cellTopic && waec) {
    const sampleMcq = {
      id: "blueprint-sample-bio-mcq-1",
      domain: "highschool" as const,
      topicId: cellTopic.id,
      type: "mcq",
      questionText: "Which structure is present in a plant cell but absent from an animal cell?",
      options: ["Mitochondrion", "Chloroplast", "Nucleus", "Ribosome"],
      correctAnswer: "Chloroplast",
      explanation: "Chloroplasts carry out photosynthesis; mitochondria, nuclei and ribosomes are shared by both cell types.",
      difficulty: "easy",
      hint: "Think photosynthesis.",
      sourceExam: "WAEC",
    };
    await prisma.question.upsert({
      where: { id: sampleMcq.id },
      update: { questionText: sampleMcq.questionText, options: sampleMcq.options, correctAnswer: sampleMcq.correctAnswer, hint: sampleMcq.hint },
      create: sampleMcq,
    });
    await prisma.questionBoardTag.upsert({
      where: { questionId_examinationId: { questionId: sampleMcq.id, examinationId: waec.id } },
      update: { tier: "CORE", paperIds: ["P1"] },
      create: { questionId: sampleMcq.id, examinationId: waec.id, tier: "CORE", paperIds: ["P1"] },
    });

    const theoryQ = {
      id: "blueprint-sample-bio-theory-1",
      domain: "highschool" as const,
      topicId: cellTopic.id,
      type: "theory",
      questionText: "(a) Define the cell theory. [4 marks] (b) List THREE organelles found in a plant cell but absent from an animal cell and state one function of each. [6 marks]",
      options: [],
      correctAnswer:
        "(a) Cell theory: (i) the cell is the basic unit of life; (ii) all living things are made of one or more cells; (iii) all cells arise from pre-existing cells. (b) Chloroplast — site of photosynthesis; large permanent vacuole — stores cell sap and keeps the cell turgid; cellulose cell wall — provides structural support and rigidity.",
      markingPoints: [
        { point: "Cell = basic unit of life", marks: 2 },
        { point: "All living things made of cell(s)", marks: 1 },
        { point: "Cells arise from pre-existing cells", marks: 1 },
        { point: "Three plant-only organelles named", marks: 3 },
        { point: "One function per organelle stated", marks: 3 },
      ],
      explanation: "Cell theory and plant-vs-animal cell differences are core WAEC P2 territory.",
      difficulty: "medium",
      hint: "Think: what does a plant do that an animal cannot — and which structures make that possible?",
    };
    await prisma.question.upsert({
      where: { id: theoryQ.id },
      update: { questionText: theoryQ.questionText, correctAnswer: theoryQ.correctAnswer, markingPoints: theoryQ.markingPoints, hint: theoryQ.hint },
      create: theoryQ,
    });
    await prisma.questionBoardTag.upsert({
      where: { questionId_examinationId: { questionId: theoryQ.id, examinationId: waec.id } },
      update: { tier: "CORE", paperIds: ["P2"] },
      create: { questionId: theoryQ.id, examinationId: waec.id, tier: "CORE", paperIds: ["P2"] },
    });

    const practicalQ = {
      id: "blueprint-sample-bio-practical-1",
      domain: "highschool" as const,
      topicId: cellTopic.id,
      type: "practical",
      questionText: "You are provided with a piece of onion epidermis. Describe how you would prepare and observe a stained temporary mount of it under the light microscope. [8 marks]",
      options: [],
      correctAnswer:
        "Peel a thin epidermal layer with forceps; place on a clean slide with a drop of water; add a drop of iodine stain; lower the coverslip at an angle to avoid air bubbles; observe first under low power, then high power; draw and label what you see.",
      markingPoints: [
        { point: "Thin epidermal peel obtained", marks: 1 },
        { point: "Water drop on clean slide", marks: 1 },
        { point: "Iodine stain applied", marks: 2 },
        { point: "Coverslip lowered without bubbles", marks: 2 },
        { point: "Low power then high power observation", marks: 1 },
        { point: "Labeled drawing", marks: 1 },
      ],
      explanation: "Classic Alternative-to-Practical wording: method + apparatus + observation.",
      difficulty: "hard",
      hint: "Structure your answer as: peel → stain → mount → observe.",
    };
    await prisma.question.upsert({
      where: { id: practicalQ.id },
      update: { questionText: practicalQ.questionText, correctAnswer: practicalQ.correctAnswer, markingPoints: practicalQ.markingPoints, hint: practicalQ.hint },
      create: practicalQ,
    });
    await prisma.questionBoardTag.upsert({
      where: { questionId_examinationId: { questionId: practicalQ.id, examinationId: waec.id } },
      update: { tier: "CORE", paperIds: ["P3"] },
      create: { questionId: practicalQ.id, examinationId: waec.id, tier: "CORE", paperIds: ["P3"] },
    });
    console.log("✓ blueprint sample theory + practical questions (WAEC P2/P3)");

    // RULE 4 validation: mark one quadratic MCQ NOT_EXAMINED for JAMB — the
    // JAMB manifest for that topic must show one fewer question than WAEC's.
    const firstQuadratic = await prisma.question.findFirst({
      where: { topicId: "waec-mathematics-quadratic-equations", type: "mcq" },
      orderBy: { id: "asc" },
    });
    const jamb = boardIds.find((b) => b.slug === "jamb");
    if (firstQuadratic && jamb) {
      await prisma.questionBoardTag.upsert({
        where: { questionId_examinationId: { questionId: firstQuadratic.id, examinationId: jamb.id } },
        update: { tier: "NOT_EXAMINED", paperIds: ["P1"] },
        create: { questionId: firstQuadratic.id, examinationId: jamb.id, tier: "NOT_EXAMINED", paperIds: ["P1"] },
      });
      console.log(`✓ NOT_EXAMINED exclusion sample (${firstQuadratic.id} → JAMB)`);
    }
  }

  console.log("Exam board seed complete.");
}

// Exported for the one-shot temp seeder route. Guarded so bundlers never
// auto-run this on import — CLI behaviour is unchanged.
export async function seedExamBoards() {
  await main();
}

if (process.argv[1] && process.argv[1].includes("seed-exam-boards")) {
  main()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
