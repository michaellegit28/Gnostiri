import { prisma } from "./spine";
import { seedAnatomy } from "./anatomy";
import { seedPhysiology } from "./physiology";
import { seedBiochemistry } from "./biochemistry";
import { seedPathology } from "./pathology";
import { seedPharmacology } from "./pharmacology";
import { seedMedicine } from "./medicine";
import { seedSurgery } from "./surgery";
import { seedObstetricsGynaecology } from "./obstetrics-gynecology";
import { seedPaediatrics } from "./pediatrics";
import { ALLIED_SUBJECTS, ALLIED_SEEDERS } from "./allied-specialities";
import {
  ANATOMY,
  PHYSIOLOGY,
  BIOCHEMISTRY,
  PATHOLOGY,
  PHARMACOLOGY,
  MEDICINE,
  SURGERY,
  OBSTETRICS_GYNAECOLOGY,
  PAEDIATRICS,
  type SubjectSeed,
} from "./subjects";

/**
 * MBBS degree spine — the single entry point that seeds all nine subjects.
 *
 * Order matters: each subject is self-contained (idempotent upserts on stable
 * keys), but the catalogue is written in teaching order, so the pre-clinical
 * sciences are written before the clinical specialties that depend on them,
 * and the subjects' CoursePrerequisite edges resolve on the same run.
 *
 * Run order in practice:
 *   npx ts-node prisma/seed-university.ts   # faculties, departments, programme
 *   npx ts-node prisma/seed-courses/mbbs/index.ts
 *
 * Every row is written reviewStatus "needs-human-review"; an authored lesson
 * carries needsCheck false and a tracked placeholder carries needsCheck true.
 * Nothing here is ever marked "verified".
 */

export const MBBS_SUBJECTS: SubjectSeed[] = [
  ANATOMY,
  PHYSIOLOGY,
  BIOCHEMISTRY,
  PATHOLOGY,
  PHARMACOLOGY,
  MEDICINE,
  SURGERY,
  OBSTETRICS_GYNAECOLOGY,
  PAEDIATRICS,
  ...ALLIED_SUBJECTS,
];

/** Each subject's idempotent seed function, matched by index to MBBS_SUBJECTS. */
const MBBS_SEEDERS: (() => Promise<unknown>)[] = [
  seedAnatomy,
  seedPhysiology,
  seedBiochemistry,
  seedPathology,
  seedPharmacology,
  seedMedicine,
  seedSurgery,
  seedObstetricsGynaecology,
  seedPaediatrics,
  ...ALLIED_SEEDERS,
];

export async function seedMbbs(): Promise<number> {
  if (MBBS_SUBJECTS.length !== MBBS_SEEDERS.length) {
    throw new Error(`subject/seeder mismatch: ${MBBS_SUBJECTS.length} subjects, ${MBBS_SEEDERS.length} seeders`);
  }
  for (const s of MBBS_SEEDERS) await s();
  return MBBS_SEEDERS.length;
}

/**
 * Idempotent: safe to run repeatedly. Seeding the whole MBBS spine is a series
 * of upserts, so re-running refreshes content in place and never duplicates
 * rows or edges.
 */
export default async function seedAllMbbs(): Promise<void> {
  const count = await seedMbbs();
  console.log(`✓ MBBS spine seeded — ${count} subjects, all rows needs-human-review`);
}

// CLI usage: npx ts-node prisma/seed-courses/mbbs/index.ts
// The guard keeps this auto-run out of bundlers (Next/webpack), so importing
// the module never triggers a seed on its own.
if (process.argv[1] && process.argv[1].includes("seed-courses/mbbs/index")) {
  seedAllMbbs()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
