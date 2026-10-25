import { prisma, seedMbbsCourse, type SubjectSeed } from "./spine";
import type { LessonContent } from "@/types/lesson";

const PLACEHOLDER: LessonContent = { blocks: [] };

export const ANAESTHESIOLOGY: SubjectSeed = {
  id: "mbbs-anaesthesiology",
  slug: "anaesthesiology",
  title: "Anaesthesiology",
  code: "ANAES 307",
  department: "Anaesthesiology",
  level: 300,
  credits: 2,
  semester: "second",
  description:
    "Principles of acute medicine and anaesthesia: applied physiology and pharmacology, resuscitation, airway and ventilation, fluids and metabolic management, pain, pre-operative evaluation and core skills (AIIMS semester VII, two-week rotation).",
  faculty: "clinical-medicine",
  prereqCourses: ["pharmacology-foundations", "physiology-cell-and-general"],
  modules: [
    { slug: "principles", title: "M1 — Principles of acute medicine" },
    { slug: "airway-ventilation", title: "M2 — Airway & ventilation" },
    { slug: "fluids-metabolism-pain", title: "M3 — Fluids, metabolism & pain" },
    { slug: "perioperative-techniques", title: "M4 — Perioperative care & techniques" },
  ],
  lessons: [
    { title: "Acute medicine & applied physiology", module: 1, estimatedMinutes: 40, authored: false, concept: { title: "Acute medicine and applied physiology", slug: "acute-medicine-applied-physiology", summary: "The physiological basis of acute deterioration — oxygen delivery, shock physiology and the recognition of the crashing patient.", blooms: "understand", minutes: 40, prereq: [] }, content: PLACEHOLDER },
    { title: "Applied anaesthetic pharmacology", module: 1, estimatedMinutes: 45, authored: false, concept: { title: "Applied anaesthetic pharmacology", slug: "applied-pharmacology-anaesthesia", summary: "Intravenous and inhalational agents, opioids, neuromuscular blockers and reversal — pharmacokinetics applied to the anaesthetised patient.", blooms: "apply", minutes: 45, prereq: ["acute-medicine-applied-physiology"] }, content: PLACEHOLDER },
    { title: "Resuscitation", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Resuscitation", slug: "resuscitation", summary: "Basic and advanced life support algorithms, airway-breathing-circulation sequence, defibrillation and the reversible causes of arrest.", blooms: "apply", minutes: 40, prereq: ["acute-medicine-applied-physiology"] }, content: PLACEHOLDER },
    { title: "Airway assessment & ventilation", module: 2, estimatedMinutes: 45, authored: false, concept: { title: "Airway assessment and ventilation", slug: "airway-assessment-ventilation", summary: "Prediction of the difficult airway, mask ventilation, supraglottic devices, tracheal intubation and mechanical ventilation modes.", blooms: "apply", minutes: 45, prereq: ["resuscitation"] }, content: PLACEHOLDER },
    { title: "The unconscious patient", module: 2, estimatedMinutes: 35, authored: false, concept: { title: "The unconscious patient", slug: "unconscious-patient-care", summary: "AVPU and GCS assessment, airway protection, positioning and the differential diagnosis and immediate management of coma.", blooms: "apply", minutes: 35, prereq: ["airway-assessment-ventilation"] }, content: PLACEHOLDER },
    { title: "Fluids, electrolytes & metabolism", module: 3, estimatedMinutes: 45, authored: false, concept: { title: "Fluid, electrolyte and metabolic management", slug: "fluid-electrolyte-metabolic", summary: "Perioperative fluid compartments and deficits, electrolyte and acid-base correction, blood products and transfusion triggers.", blooms: "apply", minutes: 45, prereq: [] }, content: PLACEHOLDER },
    { title: "Pain management", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Pain management", slug: "pain-management", summary: "Assessment and the multimodal ladder — paracetamol, NSAIDs, opioids, regional blocks — and acute versus chronic pathways.", blooms: "apply", minutes: 40, prereq: ["applied-pharmacology-anaesthesia"] }, content: PLACEHOLDER },
    { title: "Pre-operative evaluation", module: 4, estimatedMinutes: 45, authored: false, concept: { title: "Pre-operative evaluation and monitoring", slug: "preop-evaluation-monitoring", summary: "Risk scoring, comorbidity optimisation, fasting rules, consent, and the standard monitoring used from induction to recovery.", blooms: "apply", minutes: 45, prereq: [] }, content: PLACEHOLDER },
    { title: "Anaesthetic techniques & muscle relaxants", module: 4, estimatedMinutes: 45, authored: false, concept: { title: "Anaesthetic techniques and muscle relaxants", slug: "techniques-muscle-relaxants", summary: "General, regional and combined techniques; depolarising and non-depolarising relaxants, sugammadex reversal and their complications.", blooms: "apply", minutes: 45, prereq: ["applied-pharmacology-anaesthesia"] }, content: PLACEHOLDER },
    { title: "Local anaesthesia & core skills", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Local anaesthesia and core skills", slug: "local-anaesthesia-skills", summary: "Local anaesthetic pharmacology, toxicity and maximum doses, infiltration and nerve blocks, and the logbook skills: IV access, bag-mask, CPR, lumbar puncture.", blooms: "apply", minutes: 40, prereq: ["techniques-muscle-relaxants"] }, content: PLACEHOLDER },
  ],
  sbas: [],
}

export async function seedAnaesthesiology(): Promise<void> {
  const counts = await seedMbbsCourse(ANAESTHESIOLOGY);
  console.log(`✓ ${ANAESTHESIOLOGY.code} ${ANAESTHESIOLOGY.title}: ${counts.modules} modules · ${counts.concepts} concepts · ${counts.lessons} lessons · ${counts.items} items`);
}

if (process.argv[1] && process.argv[1].includes("seed-assessment-anaesthesiology")) {
  seedAnaesthesiology()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
}
