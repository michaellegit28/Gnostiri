import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
function optList(o: unknown): string[] {
  return Array.isArray(o) ? o.map(String) : [];
}
(async () => {
  const lessons = await prisma.courseLesson.findMany({ where: { needsCheck: true }, select: { id: true, title: true, reviewStatus: true } });
  console.log("=== LESSONS flagged (" + lessons.length + ") ===");
  lessons.forEach((l) => console.log("   " + l.id + "  " + l.title));
  const items = await prisma.assessmentItem.findMany({ where: { needsCheck: true }, select: { id: true, slug: true, courseId: true, options: true, correctAnswer: true } });
  console.log("=== ITEMS flagged (" + items.length + ") ===");
  items.forEach((i) => {
    const opts = optList(i.options);
    const pos = opts.indexOf(String(i.correctAnswer));
    console.log("   " + String(i.slug).slice(0, 40) + "  correctPos=" + pos + " opts=" + opts.length + " [" + String(i.courseId).slice(0, 14) + "]");
  });
  const allItems = await prisma.assessmentItem.findMany({ select: { options: true, correctAnswer: true } });
  let bias = 0;
  allItems.forEach((i) => {
    const opts = optList(i.options);
    if (opts.length > 0 && opts.indexOf(String(i.correctAnswer)) === 0) bias++;
  });
  console.log("=== POSITION BIAS: " + bias + "/" + allItems.length + " items have correct answer at position A ===");
  prisma.$disconnect();
})();
