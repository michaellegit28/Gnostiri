import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
(async () => {
  const exams = await prisma.examination.findMany({ where: { domain: "highschool" }, select: { id: true, code: true, name: true, country: true } });
  for (var _i = 0, exams_1 = exams; _i < exams_1.length; _i++) {
    var e = exams_1[_i];
    var bp = await prisma.examinationPaper.count({ where: { examinationId: e.id } });
    var pub = await prisma.examPaper.count({ where: { examinationId: e.id } });
    var topics = await prisma.topic.count({ where: { domain: "highschool", parentId: e.code.toLowerCase() } });
    console.log("  " + e.code.padEnd(10) + e.name.padEnd(22) + String(e.country).padEnd(14) + "blueprint=" + bp + " published=" + pub + " topics=" + topics);
  }
  prisma.$disconnect();
})();
