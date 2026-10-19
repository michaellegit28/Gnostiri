import { PrismaClient } from "@prisma/client";
import { seedAppliedStatistics } from "./applied-statistics";
import { seedIntroductionToProgramming } from "./introduction-to-programming";

const prisma = new PrismaClient();

/**
 * Core courses runner — seeds both flagship courses in one pass.
 * Idempotent: each seed upserts on stable slugs/ids, safe to re-run.
 *
 * CLI usage: npx ts-node prisma/seed-courses/seed-core-courses.ts
 */
async function main() {
  console.log("Seeding Applied Statistics...");
  await seedAppliedStatistics();
  console.log("Seeding Introduction to Programming...");
  await seedIntroductionToProgramming();
  console.log("✓ Core courses seeded.");
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });