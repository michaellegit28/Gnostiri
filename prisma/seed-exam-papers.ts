// Demo data for the exam paper bank (Phase 1: board page).
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

  console.log(
    `Seeded examination slug=${exam.slug} with ${papersData.length} papers. Visit /highschool/exams/${exam.slug}`
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
