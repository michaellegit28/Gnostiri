// Exam Blueprint Engine — board profile seed.
// Verification source: the owner's Brief 2 "Verified Exam Board Profiles".
// Idempotent: safe to run repeatedly; upserts on stable keys.
//
// 2026-10-24 board clearance (owner directive): WAEC/NECO + all foreign
// boards retired from production and content. The bank is JAMB-only until
// the owner returns to board expansion. This seed therefore creates ONLY the
// JAMB profile and actively retires every other board slug (with dependents
// cascading) so a re-seed can never resurrect a cleared board.

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
];

// Boards retired in the 2026-10-24 clearance. deleteMany cascades to papers,
// tags, sessions and alignments; running this seed after a partial restore
// re-enforces the JAMB-only bank.
const RETIRED_BOARDS = [
  "demo", "wassce-ghana",
  "waec", "neco", "kcse", "nsc-matric",
  "sat", "ap", "maneb", "cbse", "icse", "necta", "cambridge", "aqa", "edexcel",
];

async function main() {
  const verified = new Date();
  console.log("Seeding exam board blueprint profiles (JAMB-only bank)…");

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
  console.log(`✓ ${boardIds.length} board profile(s): ${boardIds.map((b) => b.slug).join(", ")}`);

  // Retirement — boards outside the JAMB-only bank are removed with all
  // dependents (papers, blueprints, tags, practice sessions cascade).
  for (const retired of RETIRED_BOARDS) {
    const gone = await prisma.examination.deleteMany({ where: { slug: retired } });
    if (gone.count > 0) console.log(`✓ retired board: ${retired}`);
  }

  // Cross-board CORE tagging: every curriculum MCQ question serves the JAMB
  // first MCQ paper. Curriculum content is board-agnostic; JAMB packages it.
  // RESUME GUARD: serverless functions can hit execution limits mid-seed —
  // if tags already exist, skip the bulk pass.
  const existingTagCount = await prisma.questionBoardTag.count({
    where: { examinationId: { in: boardIds.map((b) => b.id) } },
  });
  let tagCount = 0;
  if (existingTagCount > 0) {
    console.log(`↷ skip CORE tag pass (${existingTagCount} tags already present)`);
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
  console.log(`✓ ${tagCount} CORE question tags`);

  // NOT_EXAMINED validation sample: one quadratic MCQ excluded from the JAMB
  // manifest, so the manifest path (count minus exclusions) stays provable.
  const firstQuadratic = await prisma.question.findFirst({
    where: { topicId: { startsWith: "jamb-mathematics" }, type: "mcq" },
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

  console.log("Exam board seed complete (JAMB-only bank).");
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
