import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
(async () => {
  const tags = await prisma.questionBoardTag.findMany({ select: { examinationId: true, tier: true } });
  const byExam = new Map<string, Map<string, number>>();
  tags.forEach((t) => {
    if (!byExam.has(t.examinationId)) byExam.set(t.examinationId, new Map());
    const m = byExam.get(t.examinationId)!;
    m.set(t.tier, (m.get(t.tier) ?? 0) + 1);
  });
  byExam.forEach((tiers, exam) => {
    console.log(exam + ":");
    tiers.forEach((count, tier) => console.log("   " + tier + ": " + count));
  });
  const sample = await prisma.questionBoardTag.findFirst({ select: { questionId: true, examinationId: true, tier: true, paperIds: true } });
  console.log("sample tag:", JSON.stringify(sample));
  prisma.$disconnect();
})();
