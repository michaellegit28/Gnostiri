import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
(async () => {
  const exams = ["waec", "jamb", "neco"];
  for (const examId of exams) {
    const qs = await prisma.question.findMany({
      where: { boardTags: { some: { examinationId: examId, tier: { not: "NOT_EXAMINED" } } } },
      select: { topicId: true },
    });
    const topicIds: string[] = [];
    qs.forEach((q) => { if (topicIds.indexOf(q.topicId) < 0) topicIds.push(q.topicId); });
    const topics = await prisma.topic.findMany({ where: { id: { in: topicIds } }, select: { id: true, slug: true, parentId: true } });
    const byTopic = new Map<string, number>();
    qs.forEach((q) => byTopic.set(q.topicId, (byTopic.get(q.topicId) ?? 0) + 1));
    const idToSlug = new Map<string, string>();
    topics.forEach((t) => idToSlug.set(t.id, t.slug ?? t.id));
    const bySubject = new Map<string, number>();
    topics.forEach((t) => {
      const key = t.parentId ? idToSlug.get(t.parentId) ?? t.parentId : (t.slug ?? t.id);
      bySubject.set(key, (bySubject.get(key) ?? 0) + (byTopic.get(t.id) ?? 0));
    });
    const sorted = Array.from(bySubject.entries()).sort((a, b) => b[1] - a[1]);
    console.log("=== " + examId.toUpperCase() + " (" + qs.length + " tagged) ===");
    sorted.forEach((e) => console.log("   " + e[0] + " " + e[1]));
  }
  const engTopics = ["grammar-foundations","concord","tenses-and-aspect","punctuation-mechanics","lexis-structure","reading-comprehension","summary-writing","continuous-writing","oral-english"];
  const engRows = await prisma.topic.findMany({ where: { slug: { in: engTopics } }, select: { id: true, slug: true } });
  console.log("=== English topic tagging ===");
  for (const t of engRows) {
    const c = await prisma.question.count({ where: { topicId: t.id } });
    const tagged = await prisma.question.count({ where: { topicId: t.id, boardTags: { some: {} } } });
    console.log("   " + t.slug + " q=" + c + " tagged=" + tagged);
  }
  const untagged = await prisma.question.count({ where: { domain: "highschool", boardTags: { none: {} } } });
  console.log("=== untagged: " + untagged + " ===");
  prisma.$disconnect();
})();
