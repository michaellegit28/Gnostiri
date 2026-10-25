import { prisma, type SubjectSeed } from "./spine";
import { MICROBIOLOGY, seedMicrobiology } from "./microbiology";
import { COMMUNITY_MEDICINE, seedCommunityMedicine } from "./community-medicine";
import { FORENSIC_MEDICINE, seedForensicMedicine } from "./forensic-medicine";
import { PSYCHIATRY, seedPsychiatry } from "./psychiatry";
import { DERMATOLOGY, seedDermatology } from "./dermatology";
import { ANAESTHESIOLOGY, seedAnaesthesiology } from "./anaesthesiology";
import { OPHTHALMOLOGY, seedOphthalmology } from "./ophthalmology";
import { ORTHOPAEDICS, seedOrthopaedics } from "./orthopaedics";
import { OTORHINOLARYNGOLOGY, seedOtorhinolaryngology } from "./otorhinolaryngology";

/** The nine AIIMS allied/para-clinical subjects missing from the original spine. */
export const ALLIED_SUBJECTS: SubjectSeed[] = [
  MICROBIOLOGY, COMMUNITY_MEDICINE, FORENSIC_MEDICINE, PSYCHIATRY, DERMATOLOGY,
  ANAESTHESIOLOGY, OPHTHALMOLOGY, ORTHOPAEDICS, OTORHINOLARYNGOLOGY,
];

/** One idempotent seeder per allied subject, index-matched to ALLIED_SUBJECTS. */
export const ALLIED_SEEDERS: (() => Promise<unknown>)[] = [
  seedMicrobiology, seedCommunityMedicine, seedForensicMedicine, seedPsychiatry, seedDermatology,
  seedAnaesthesiology, seedOphthalmology, seedOrthopaedics, seedOtorhinolaryngology,
];

export async function seedAlliedSpecialities(only?: string[]): Promise<void> {
  const subjects = only && only.length > 0 ? ALLIED_SUBJECTS.filter((s) => only.includes(s.slug)) : ALLIED_SUBJECTS;
  for (const subject of subjects) {
    const i = ALLIED_SUBJECTS.indexOf(subject);
    await ALLIED_SEEDERS[i]();
  }
}

// CLI usage: npx ts-node prisma/seed-courses/mbbs/allied-specialities.ts
// Optional SUBJECTS env filter (comma-separated slugs) for resumable runs.
if (process.argv[1] && process.argv[1].includes("allied-specialities")) {
  const only = (process.env.SUBJECTS || "").split(",").map((s) => s.trim()).filter(Boolean);
  seedAlliedSpecialities(only.length > 0 ? only : undefined)
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
}
