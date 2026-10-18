import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
(async () => {
  const types = await prisma.question.groupBy({ by: ["type"], _count: { id: true }, where: { domain: "highschool" } });
  console.log("question types:", JSON.stringify(types));
  const qs = await prisma.question.findMany({ where: { domain: "highschool" }, select: { topicId: true } });
  const topicIds = Array.from(new Set(qs.map((q) => q.topicId)));
  const topics = await prisma.topic.findMany({ where: { id: { in: topicIds } }, select: { id: true, slug: true, title: true, parentId: true } });
  const byTopic = new Map<string, number>();
  qs.forEach((q) => byTopic.set(q.topicId, (byTopic.get(q.topicId) ?? 0) + 1));
  topics.sort((a, b) => (byTopic.get(b.id) ?? 0) - (byTopic.get(a.id) ?? 0));
  console.log("distinct topics with questions:", topics.length);
  topics.forEach((t) => console.log("  " + String(t.slug).padEnd(34) + String(byTopic.get(t.id)).padStart(4) + "  " + t.title));
  const tags = await prisma.questionBoardTag.count();
  console.log("existing QuestionBoardTag rows:", tags);
  prisma.$disconnect();
})();
