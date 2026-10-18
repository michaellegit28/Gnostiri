// Demo data for the exam paper bank (Phase 2: questions + attempts).
// Run manually after migrations: npx ts-node prisma/seed-exam-papers.ts
// Idempotent: safe to re-run; upserts by fixed ids.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const exam = await prisma.examination.upsert({
    where: { id: "demo-exam" },
    update: { slug: "demo" },
    create: {
      id: "demo-exam",
      domain: "highschool",
      name: "Demo Board",
      code: "demo",
      slug: "demo",
      country: "International",
    },
  });

  const papersData = [
    {
      id: "demo-exam-biology-2024-p2",
      subject: "Biology",
      year: 2024,
      paperNumber: "Paper 2 (Theory)",
      durationMinutes: 150,
      totalMarks: 100,
    },
    {
      id: "demo-exam-biology-2023-p1",
      subject: "Biology",
      year: 2023,
      paperNumber: "Paper 1 (Objective)",
      durationMinutes: 60,
      totalMarks: 60,
    },
    {
      id: "demo-exam-mathematics-2024-p2",
      subject: "Mathematics",
      year: 2024,
      paperNumber: "Paper 2 (Theory)",
      durationMinutes: 150,
      totalMarks: 100,
    },
  ];

  for (const paper of papersData) {
    await prisma.examPaper.upsert({
      where: { id: paper.id },
      update: { ...paper, examinationId: exam.id },
      create: { ...paper, examinationId: exam.id },
    });
  }

  const questionsData = [
    {
      id: "demo-exam-biology-2024-p2-q1",
      paperId: "demo-exam-biology-2024-p2",
      orderIndex: 1,
      questionText: "Which structure is the site of aerobic respiration in a eukaryotic cell?",
      options: ["Nucleus", "Mitochondrion", "Ribosome", "Chloroplast"],
      correctAnswer: "Mitochondrion",
      marks: 5,
      explanation: "Aerobic respiration (glycolysis link, Krebs cycle, oxidative phosphorylation) happens in the mitochondrion; the nucleus stores genetic material, ribosomes build proteins, and chloroplasts carry out photosynthesis.",
    },
    {
      id: "demo-exam-biology-2024-p2-q2",
      paperId: "demo-exam-biology-2024-p2",
      orderIndex: 2,
      questionText: "State the number of chromosomes present in a normal human gamete.",
      options: ["23", "46", "44", "48"],
      correctAnswer: "23",
      marks: 5,
      explanation: "Human body cells are diploid (46 chromosomes); gametes are haploid — 23 chromosomes, one of each pair.",
    },
    {
      id: "demo-exam-biology-2023-p1-q1",
      paperId: "demo-exam-biology-2023-p1",
      orderIndex: 1,
      questionText: "Which of the following is a characteristic of all living things?",
      options: ["Respiration", "Evaporation", "Diffusion", "Condensation"],
      correctAnswer: "Respiration",
      marks: 1,
      explanation: "Respiration — releasing energy from food — is one of the life processes shared by all living organisms; the others are physical processes, not life characteristics.",
    },
    {
      id: "demo-exam-biology-2023-p1-q2",
      paperId: "demo-exam-biology-2023-p1",
      orderIndex: 2,
      questionText: "The basic structural and functional unit of life is the:",
      options: ["Cell", "Tissue", "Organ", "Organ system"],
      correctAnswer: "Cell",
      marks: 1,
      explanation: "The cell is the smallest unit that carries out all life processes; tissues, organs, and systems are built from cells.",
    },
    {
      id: "demo-exam-mathematics-2024-p2-q1",
      paperId: "demo-exam-mathematics-2024-p2",
      orderIndex: 1,
      questionText: "Solve for x: 2x + 5 = 13.",
      options: ["4", "9", "6", "3"],
      correctAnswer: "4",
      marks: 5,
      explanation: "Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4.",
    },
    {
      id: "demo-exam-mathematics-2024-p2-q2",
      paperId: "demo-exam-mathematics-2024-p2",
      orderIndex: 2,
      questionText: "If sin θ = 0.5 and θ is acute, then θ equals:",
      options: ["30°", "45°", "60°", "90°"],
      correctAnswer: "30°",
      marks: 5,
      explanation: "sin 30° = 0.5 — a standard exact value worth memorising alongside sin 45° ≈ 0.707 and sin 60° ≈ 0.866.",
    },
  ];

  for (const question of questionsData) {
    await prisma.paperQuestion.upsert({
      where: { id: question.id },
      update: {
        orderIndex: question.orderIndex,
        questionText: question.questionText,
        options: question.options,
        correctAnswer: question.correctAnswer,
        marks: question.marks,
        explanation: question.explanation,
        paperId: question.paperId,
      },
      create: {
        id: question.id,
        paperId: question.paperId,
        orderIndex: question.orderIndex,
        questionText: question.questionText,
        options: question.options,
        correctAnswer: question.correctAnswer,
        marks: question.marks,
        explanation: question.explanation,
      },
    });
  }

  console.log(
    `Seeded examination slug=${exam.slug}: ${papersData.length} papers, ${questionsData.length} questions. Visit /highschool/exams/${exam.slug}`
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
