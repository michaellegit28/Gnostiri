import { prisma, seedMbbsCourse, type SubjectSeed } from "./spine";
import type { LessonContent } from "@/types/lesson";

const PLACEHOLDER: LessonContent = { blocks: [] };

export const OTORHINOLARYNGOLOGY: SubjectSeed = {
  id: "mbbs-otorhinolaryngology",
  slug: "otorhinolaryngology",
  title: "Otorhinolaryngology (ENT)",
  code: "OTOR 308",
  department: "Otorhinolaryngology",
  level: 300,
  credits: 2,
  semester: "second",
  description:
    "Ear, nose, throat and head & neck disease: otitis and mastoid disease, rhinosinusitis, epistaxis, laryngeal disorders, oral cavity and pharynx, vertigo, neck space infection, emergencies and operative basics (AIIMS semesters VI and VIII).",
  faculty: "clinical-medicine",
  prereqCourses: ["gross-anatomy-i", "pathology-cell-injury-repair"],
  modules: [
    { slug: "otology", title: "M1 — Otology" },
    { slug: "rhinology", title: "M2 — Rhinology & the nose" },
    { slug: "larynx-pharynx", title: "M3 — Larynx, pharynx & oral cavity" },
    { slug: "head-neck-practice", title: "M4 — Head & neck, vertigo & practice" },
  ],
  lessons: [
    { title: "External & middle ear disease", module: 1, estimatedMinutes: 40, authored: false, concept: { title: "External and middle ear disease", slug: "otology-external-middle-ear", summary: "Otitis externa, wax, foreign bodies, acute and chronic suppurative otitis media, otitis media with effusion and otalgia differentials.", blooms: "apply", minutes: 40, prereq: [] }, content: PLACEHOLDER },
    { title: "Mastoid disease & complications", module: 1, estimatedMinutes: 40, authored: false, concept: { title: "Mastoid disease and complications", slug: "otospongiosis-mastoid-complications", summary: "Mastoiditis, facial palsy, labyrinthitis and intracranial spread; otosclerosis and stapes surgery.", blooms: "analyze", minutes: 40, prereq: ["otology-external-middle-ear"] }, content: PLACEHOLDER },
    { title: "Rhinosinusitis & nasal polyps", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Rhinosinusitis and nasal polyps", slug: "rhinosinusitis-nasal-polyp", summary: "Acute and chronic rhinosinusitis, allergic rhinitis and polyps — medical therapy and the indications for endoscopic surgery.", blooms: "apply", minutes: 40, prereq: [] }, content: PLACEHOLDER },
    { title: "Epistaxis, septum & tumours", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Epistaxis, septal lesions and sinonasal tumours", slug: "epistaxis-septal-tumours", summary: "Epistaxis sites and control, septal deviation and perforation, and benign and malignant sinonasal tumours.", blooms: "analyze", minutes: 40, prereq: ["rhinosinusitis-nasal-polyp"] }, content: PLACEHOLDER },
    { title: "Larynx & voice disorders", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Laryngeal disorders and voice", slug: "laryngeal-disorders-voice", summary: "Acute and chronic laryngitis, nodules, palsy, stridor and airway obstruction — assessment and emergency airway decisions.", blooms: "analyze", minutes: 40, prereq: [] }, content: PLACEHOLDER },
    { title: "Pharynx & oral cavity", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Pharynx and oral cavity", slug: "pharynx-oral-cavity", summary: "Tonsillitis and its complications, peritonsillar abscess, adenoids, oralulcers and leukoplakia, and dysphagia differentials.", blooms: "apply", minutes: 40, prereq: [] }, content: PLACEHOLDER },
    { title: "Neck spaces & facial paralysis", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Neck spaces and facial paralysis", slug: "neck-spaces-facial-paralysis", summary: "Deep neck space infection, neck masses and cysts in children and adults, and the level localisation of facial palsy.", blooms: "analyze", minutes: 40, prereq: [] }, content: PLACEHOLDER },
    { title: "Vertigo & audiological assessment", module: 4, estimatedMinutes: 35, authored: false, concept: { title: "Vertigo and audiological assessment", slug: "vertigo-audiological-assessment", summary: "BPPV, Meniere's, vestibular neuritis and central causes; audiometry, tuning-fork tests and vestibular testing.", blooms: "apply", minutes: 35, prereq: ["otology-external-middle-ear"] }, content: PLACEHOLDER },
    { title: "ENT emergencies & radiology", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "ENT emergencies and radiology", slug: "ent-emergencies-radiology", summary: "Airway foreign bodies, nasal and aural foreign bodies, trauma and the plain films, CT and MRI used in ENT diagnosis.", blooms: "apply", minutes: 40, prereq: ["epistaxis-septal-tumours", "laryngeal-disorders-voice"] }, content: PLACEHOLDER },
  ],
  sbas: [],
}

export async function seedOtorhinolaryngology(): Promise<void> {
  const counts = await seedMbbsCourse(OTORHINOLARYNGOLOGY);
  console.log(`✓ ${OTORHINOLARYNGOLOGY.code} ${OTORHINOLARYNGOLOGY.title}: ${counts.modules} modules · ${counts.concepts} concepts · ${counts.lessons} lessons · ${counts.items} items`);
}

if (process.argv[1] && process.argv[1].includes("seed-assessment-otorhinolaryngology")) {
  seedOtorhinolaryngology()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
}
