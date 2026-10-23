// WAEC authored paper bank seed — Wave 1 (Mathematics, English Language, Biology).
//
// Authors REAL practice papers in WAEC (WASSCE) style: an objective paper
// (50 one-mark MCQs, keys + explanations) and a theory paper (5 questions of
// 20 marks, each with a model answer and marking points that sum to the marks).
// Provenance is honest everywhere: provenance "original" + disclaimer, never
// labelled an official WAEC past paper (WAEC asserts copyright over its papers
// — see content/exams/BOARD-GOVERNANCE.md).
//
// Idempotent: safe to re-run. Papers upsert on the (examination, subject, year,
// paperNumber) unique key with stable authored ids; questions upsert on their
// stable ids.
//
// Run standalone:
//   DATABASE_URL="...?pgbouncer=true&connection_limit=1" npx ts-node prisma/seed-papers/waec.ts

import { PrismaClient } from "@prisma/client";
import mathematics from "../../content/papers/waec-mathematics.json";
import englishLanguage from "../../content/papers/waec-english-language.json";
import biology from "../../content/papers/waec-biology.json";

const prisma = new PrismaClient();

interface QuestionSeed {
  orderIndex: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
  marks: number;
  explanation: string;
}

interface PaperSeed {
  id: string;
  subject: string;
  year: number;
  paperNumber: string;
  durationMinutes: number;
  totalMarks: number;
  questions: QuestionSeed[];
}

interface PaperFile {
  papers: PaperSeed[];
}

const PAPER_FILES: PaperFile[] = [mathematics, englishLanguage, biology];

export async function seedWaecPapers(): Promise<void> {
  // Resolve the WAEC board row; never rename an existing board (additive only).
  const examination = await prisma.examination.upsert({
    where: { slug: "waec" },
    update: {},
    create: {
      slug: "waec",
      name: "WAEC (WASSCE)",
      code: "waec",
      domain: "highschool",
      country: "Nigeria & Ghana",
    },
  });

  let paperCount = 0;
  let questionCount = 0;

  for (const file of PAPER_FILES) {
    for (const paper of file.papers) {
      const dbPaper = await prisma.examPaper.upsert({
        where: {
          examinationId_subject_year_paperNumber: {
            examinationId: examination.id,
            subject: paper.subject,
            year: paper.year,
            paperNumber: paper.paperNumber,
          },
        },
        update: {
          subject: paper.subject,
          year: paper.year,
          paperNumber: paper.paperNumber,
          durationMinutes: paper.durationMinutes,
          totalMarks: paper.totalMarks,
          isPublished: true,
        },
        create: {
          id: paper.id,
          examinationId: examination.id,
          subject: paper.subject,
          year: paper.year,
          paperNumber: paper.paperNumber,
          durationMinutes: paper.durationMinutes,
          totalMarks: paper.totalMarks,
          isPublished: true,
        },
      });
      paperCount++;

      for (const question of paper.questions) {
        await prisma.paperQuestion.upsert({
          where: { id: `${paper.id}-q${question.orderIndex}` },
          update: {
            paperId: dbPaper.id,
            orderIndex: question.orderIndex,
            questionText: question.questionText,
            options: question.options,
            correctAnswer: question.correctAnswer,
            marks: question.marks,
            explanation: question.explanation,
          },
          create: {
            id: `${paper.id}-q${question.orderIndex}`,
            paperId: dbPaper.id,
            orderIndex: question.orderIndex,
            questionText: question.questionText,
            options: question.options,
            correctAnswer: question.correctAnswer,
            marks: question.marks,
            explanation: question.explanation,
          },
        });
        questionCount++;
      }
    }
  }

  console.log(
    `✓ WAEC authored paper bank: ${paperCount} papers, ${questionCount} questions (examination ${examination.slug})`
  );
  console.log("  Visit /highschool/exams/waec — papers are authored practice items, not official past papers.");
}

// CLI usage: npx ts-node prisma/seed-papers/waec.ts
if (process.argv[1] && process.argv[1].includes("seed-papers/waec")) {
  seedWaecPapers()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
