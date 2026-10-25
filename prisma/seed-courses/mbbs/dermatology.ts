import { prisma, seedMbbsCourse, type SubjectSeed } from "./spine";
import type { LessonContent } from "@/types/lesson";

const PLACEHOLDER: LessonContent = { blocks: [] };

export const DERMATOLOGY: SubjectSeed = {
  id: "mbbs-dermatology",
  slug: "dermatology",
  title: "Dermatology & Venereology",
  code: "DERM 307",
  department: "Dermatology & Venereology",
  level: 300,
  credits: 3,
  semester: "full",
  description:
    "Skin and venereal disease: morphology and examination, infective dermatoses and infestations, allergic and immune dermatoses, papulosquamous and vesicobullous disorders, leprosy, STDs, HIV skin signs, hereditary disorders and emergencies (AIIMS semesters III, VI–VIII).",
  faculty: "clinical-medicine",
  prereqCourses: ["pathology-cell-injury-repair"],
  modules: [
    { slug: "skin-foundations", title: "M1 — Skin structure, examination & morphology" },
    { slug: "infective-dermatoses", title: "M2 — Infective dermatoses & infestations" },
    { slug: "immune-inflammatory", title: "M3 — Allergic, immune & inflammatory dermatoses" },
    { slug: "specific-emergencies", title: "M4 — Specific disorders & emergencies" },
  ],
  lessons: [
    { title: "Skin structure & function", module: 1, estimatedMinutes: 35, authored: false, concept: { title: "Skin structure and function", slug: "skin-structure-function", summary: "Epidermal differentiation, dermal matrix, appendages and the barrier, thermoregulatory and immune functions of skin.", blooms: "understand", minutes: 35, prereq: [] }, content: PLACEHOLDER },
    { title: "Examination & morphology", module: 1, estimatedMinutes: 40, authored: false, concept: { title: "Dermatological examination and morphology", slug: "dermatological-examination-morphology", summary: "Primary and secondary lesions, configuration and distribution, and the descriptive language that drives dermatological diagnosis.", blooms: "apply", minutes: 40, prereq: ["skin-structure-function"] }, content: PLACEHOLDER },
    { title: "Bacterial & fungal infections", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Bacterial and fungal skin infections", slug: "bacterial-fungal-infections", summary: "Impetigo, folliculitis, cellulitis, dermatophytes and candidiasis — recognition, microscopy and treatment.", blooms: "apply", minutes: 40, prereq: ["dermatological-examination-morphology"] }, content: PLACEHOLDER },
    { title: "Viral infections & infestations", module: 2, estimatedMinutes: 35, authored: false, concept: { title: "Viral skin infections and infestations", slug: "viral-infections-infestations", summary: "Molluscum, warts, herpes zoster and exanthems; scabies, pediculosis and other infestations.", blooms: "understand", minutes: 35, prereq: ["bacterial-fungal-infections"] }, content: PLACEHOLDER },
    { title: "Leprosy & STDs", module: 2, estimatedMinutes: 45, authored: false, concept: { title: "Leprosy and sexually transmitted diseases", slug: "leprosy-std", summary: "Ridley-Jopling classification, reactions and nerve involvement in leprosy; syphilis, chancroid, gonorrhoea and warts.", blooms: "analyze", minutes: 45, prereq: ["bacterial-fungal-infections"] }, content: PLACEHOLDER },
    { title: "Eczema & dermatitis", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Eczema and dermatitis", slug: "eczema-dermatitis", summary: "Atopic, contact, seborrhoeic and stasis dermatitis — distribution patterns, trigger identification and topical management.", blooms: "apply", minutes: 40, prereq: ["dermatological-examination-morphology"] }, content: PLACEHOLDER },
    { title: "Papulosquamous disorders", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Papulosquamous disorders", slug: "papulosquamous-disorders", summary: "Psoriasis, pityriasis, lichen planus and pityriasis rosea — scale morphology, systemic associations and stepwise therapy.", blooms: "analyze", minutes: 40, prereq: ["eczema-dermatitis"] }, content: PLACEHOLDER },
    { title: "Vesicobullous & drug eruptions", module: 3, estimatedMinutes: 45, authored: false, concept: { title: "Vesicobullous disease and drug eruptions", slug: "vesicobullous-drug-eruptions", summary: "Pemphigus, pemphigoid, dermatitis herpetiformis, erythema multiforme, SJS and TEN — immunopathology, biopsy and urgent management.", blooms: "analyze", minutes: 45, prereq: ["papulosquamous-disorders"] }, content: PLACEHOLDER },
    { title: "Pigmentation disorders", module: 3, estimatedMinutes: 30, authored: false, concept: { title: "Pigmentation disorders", slug: "pigmentation-disorders", summary: "Vitiligo, melasma, post-inflammatory pigment change and photoaging — mechanisms and management options.", blooms: "understand", minutes: 30, prereq: ["eczema-dermatitis"] }, content: PLACEHOLDER },
    { title: "Hereditary & HIV skin disease", module: 4, estimatedMinutes: 35, authored: false, concept: { title: "Hereditary disorders and HIV skin manifestations", slug: "hereditary-hiv-skin", summary: "Ichthyoses, epidermolysis bullosa and neurocutaneous syndromes; the cutaneous markers of HIV infection.", blooms: "understand", minutes: 35, prereq: ["papulosquamous-disorders"] }, content: PLACEHOLDER },
    { title: "Dermatological emergencies", module: 4, estimatedMinutes: 35, authored: false, concept: { title: "Dermatological emergencies", slug: "dermatological-emergencies", summary: "Toxic epidermal necrolysis, erythroderma, angio-oedema and rapidly spreading infection — recognition and emergency care.", blooms: "apply", minutes: 35, prereq: ["vesicobullous-drug-eruptions"] }, content: PLACEHOLDER },
  ],
  sbas: [],
}

export async function seedDermatology(): Promise<void> {
  const counts = await seedMbbsCourse(DERMATOLOGY);
  console.log(`✓ ${DERMATOLOGY.code} ${DERMATOLOGY.title}: ${counts.modules} modules · ${counts.concepts} concepts · ${counts.lessons} lessons · ${counts.items} items`);
}

if (process.argv[1] && process.argv[1].includes("seed-assessment-dermatology")) {
  seedDermatology()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
}
