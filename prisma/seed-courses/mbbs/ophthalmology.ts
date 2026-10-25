import { prisma, seedMbbsCourse, type SubjectSeed } from "./spine";
import type { LessonContent } from "@/types/lesson";

const PLACEHOLDER: LessonContent = { blocks: [] };

export const OPHTHALMOLOGY: SubjectSeed = {
  id: "mbbs-ophthalmology",
  slug: "ophthalmology",
  title: "Ophthalmology",
  code: "OPHT 307",
  department: "Ophthalmology",
  level: 300,
  credits: 2,
  semester: "full",
  description:
    "Diseases of the eye: symptomatology and refraction, anterior and posterior segment disease, glaucoma and retinopathies, ocular emergencies, minor surgery, and the national programme for blindness (AIIMS semesters V, VI, VIII).",
  faculty: "clinical-medicine",
  prereqCourses: ["physiology-cell-and-general", "pathology-cell-injury-repair"],
  modules: [
    { slug: "eye-foundations", title: "M1 — Foundations, refraction & systemic disease" },
    { slug: "anterior-segment", title: "M2 — Anterior segment" },
    { slug: "posterior-segment-neuro", title: "M3 — Posterior segment & neuro-ophthalmology" },
    { slug: "emergencies-programme", title: "M4 — Emergencies, surgery & eye care programmes" },
  ],
  lessons: [
    { title: "Ocular microbiology & pathology", module: 1, estimatedMinutes: 35, authored: false, concept: { title: "Ocular microbiology and pathology", slug: "ocular-microbiology-pathology", summary: "The organisms that infect the eye, host defences, sterile technique and the pathology of common ocular disease.", blooms: "understand", minutes: 35, prereq: [] }, content: PLACEHOLDER },
    { title: "Symptomatology & refraction", module: 1, estimatedMinutes: 40, authored: false, concept: { title: "Symptomatology and refraction", slug: "symptomatology-refraction", summary: "Red eye, painful eye, gradual and sudden visual loss; refractive errors, accommodation and prescribing spectacles.", blooms: "apply", minutes: 40, prereq: ["ocular-microbiology-pathology"] }, content: PLACEHOLDER },
    { title: "Systemic disease & the eye", module: 1, estimatedMinutes: 40, authored: false, concept: { title: "Systemic disease and the eye", slug: "systemic-disease-eye", summary: "Diabetic, hypertensive, haematological and neurological manifestations in the eye, and ocular adverse effects of systemic drugs.", blooms: "analyze", minutes: 40, prereq: ["symptomatology-refraction"] }, content: PLACEHOLDER },
    { title: "Lids, lacrimal & conjunctiva", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Lids, lacrimal apparatus and conjunctiva", slug: "lids-lacrimal-conjunctiva", summary: "Blepharitis, chalazion, entropion, dacryocystitis and the conjunctivitides — allergic, bacterial, viral and neonatal.", blooms: "apply", minutes: 40, prereq: ["symptomatology-refraction"] }, content: PLACEHOLDER },
    { title: "Cornea, sclera & uveitis", module: 2, estimatedMinutes: 45, authored: false, concept: { title: "Cornea, sclera and uveitis", slug: "cornea-sclera-uveitis", summary: "Corneal ulcer and keratitis, abrasions, scleritis, and anterior, intermediate and posterior uveitis with systemic associations.", blooms: "analyze", minutes: 45, prereq: ["lids-lacrimal-conjunctiva"] }, content: PLACEHOLDER },
    { title: "Lens & cataract", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Lens and cataract", slug: "lens-cataract", summary: "Cataract types, age-related and metabolic causes, surgical indications, small-incision and IOL surgery and post-operative care.", blooms: "apply", minutes: 40, prereq: ["symptomatology-refraction"] }, content: PLACEHOLDER },
    { title: "Glaucoma", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Glaucoma", slug: "glaucoma", summary: "Aqueous dynamics, open- and angle-closure mechanisms, tonometry, field loss, medical and surgical control of intraocular pressure.", blooms: "analyze", minutes: 40, prereq: ["cornea-sclera-uveitis"] }, content: PLACEHOLDER },
    { title: "Retinopathies & retinal detachment", module: 3, estimatedMinutes: 45, authored: false, concept: { title: "Retinopathies and retinal detachment", slug: "retinopathies-retinal-detachment", summary: "Diabetic and hypertensive retinopathy, retinal vascular occlusion, macular degeneration, breaks, detachment and their management.", blooms: "analyze", minutes: 45, prereq: ["systemic-disease-eye"] }, content: PLACEHOLDER },
    { title: "Optic nerve & squint", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Optic nerve, squint and ocular neoplasms", slug: "optic-nerve-squint", summary: "Optic neuritis, atrophy and papilloedema; ocular motility disorders, amblyopia and retinoblastoma.", blooms: "analyze", minutes: 40, prereq: ["retinopathies-retinal-detachment"] }, content: PLACEHOLDER },
    { title: "Ocular emergencies & minor surgery", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Ocular emergencies and minor surgery", slug: "ocular-emergencies-minor-surgery", summary: "Chemical and physical injury, acute angle closure, hyphaema and the minor procedures — foreign body removal, syringing, cautery.", blooms: "apply", minutes: 40, prereq: ["cornea-sclera-uveitis"] }, content: PLACEHOLDER },
    { title: "Blindness programme & eye banking", module: 4, estimatedMinutes: 30, authored: false, concept: { title: "National blindness programme and eye banking", slug: "national-programme-eye-banking", summary: "Causes and magnitude of blindness, the national programme's delivery, cataract surgical outreach, and eye donation and banking.", blooms: "understand", minutes: 30, prereq: ["lens-cataract"] }, content: PLACEHOLDER },
  ],
  sbas: [],
}

export async function seedOphthalmology(): Promise<void> {
  const counts = await seedMbbsCourse(OPHTHALMOLOGY);
  console.log(`✓ ${OPHTHALMOLOGY.code} ${OPHTHALMOLOGY.title}: ${counts.modules} modules · ${counts.concepts} concepts · ${counts.lessons} lessons · ${counts.items} items`);
}

if (process.argv[1] && process.argv[1].includes("seed-assessment-ophthalmology")) {
  seedOphthalmology()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
}
