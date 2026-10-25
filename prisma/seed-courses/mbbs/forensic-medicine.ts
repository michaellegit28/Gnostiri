import { prisma, seedMbbsCourse, type SubjectSeed } from "./spine";
import type { LessonContent } from "@/types/lesson";

const PLACEHOLDER: LessonContent = { blocks: [] };

export const FORENSIC_MEDICINE: SubjectSeed = {
  id: "mbbs-forensic-medicine",
  slug: "forensic-medicine",
  title: "Forensic Medicine & Toxicology",
  code: "FOR 202",
  department: "Forensic Medicine & Toxicology",
  level: 200,
  credits: 3,
  semester: "second",
  description:
    "Forensic pathology, clinical forensic medicine, medical jurisprudence, forensic sciences and toxicology — general, clinical, environmental and analytical (AIIMS semesters II, IV, V).",
  faculty: "clinical-medicine",
  prereqCourses: ["pathology-cell-injury-repair"],
  modules: [
    { slug: "foundations-jurisprudence", title: "M1 — Foundations & medical jurisprudence" },
    { slug: "forensic-pathology-death", title: "M2 — Forensic pathology, death & postmortem" },
    { slug: "clinical-forensic-medicine", title: "M3 — Clinical forensic medicine" },
    { slug: "forensic-sciences", title: "M4 — Forensic sciences & procedures" },
    { slug: "toxicology", title: "M5 — Toxicology" },
  ],
  lessons: [
    { title: "Medical jurisprudence", module: 1, estimatedMinutes: 35, authored: false, concept: { title: "Medical jurisprudence", slug: "medical-jurisprudence", summary: "Law and medicine interface: courts, legal procedure, evidence, medical records, certificates and the doctor's legal duties.", blooms: "understand", minutes: 35, prereq: [] }, content: PLACEHOLDER },
    { title: "Inquests & legal procedures", module: 1, estimatedMinutes: 35, authored: false, concept: { title: "Inquests and legal procedures", slug: "inquests-legal-procedure", summary: "Police inquest, magistrate inquest, summons, witness examination and the doctor's role in court proceedings.", blooms: "understand", minutes: 35, prereq: ["medical-jurisprudence"] }, content: PLACEHOLDER },
    { title: "Death & postmortem changes", module: 2, estimatedMinutes: 45, authored: false, concept: { title: "Death and postmortem changes", slug: "death-postmortem-changes", summary: "Modes of death, somatic and molecular death, cooling, rigor, lividity and decomposition used to estimate time since death.", blooms: "understand", minutes: 45, prereq: [] }, content: PLACEHOLDER },
    { title: "Injuries & wounds", module: 2, estimatedMinutes: 50, authored: false, concept: { title: "Injuries and wounds", slug: "injuries-wounds", summary: "Abrasion, contusion, laceration, incised and stab wounds; firearm injuries, burns and the interpretation of wound age and causation.", blooms: "analyze", minutes: 50, prereq: ["death-postmortem-changes"] }, content: PLACEHOLDER },
    { title: "Postmortem examination & reports", module: 2, estimatedMinutes: 45, authored: false, concept: { title: "Postmortem examination and reporting", slug: "postmortem-report-writing", summary: "Objectives, procedure, viscera preservation, chain of custody and the structure of a defensible postmortem report.", blooms: "apply", minutes: 45, prereq: ["injuries-wounds"] }, content: PLACEHOLDER },
    { title: "Clinical forensic medicine", module: 3, estimatedMinutes: 45, authored: false, concept: { title: "Clinical forensic medicine", slug: "clinical-forensic-medicine", summary: "Examination and documentation of the living victim and accused, age estimation, and the medico-legal aspects of injury in practice.", blooms: "apply", minutes: 45, prereq: ["medical-jurisprudence"] }, content: PLACEHOLDER },
    { title: "Sexual offences examination", module: 3, estimatedMinutes: 45, authored: false, concept: { title: "Sexual offences examination", slug: "sexual-offences-examination", summary: "Consent law, examination and evidence preservation in sexual offences, and virginity and pregnancy allegations.", blooms: "apply", minutes: 45, prereq: ["clinical-forensic-medicine"] }, content: PLACEHOLDER },
    { title: "Forensic psychiatry", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Forensic psychiatry", slug: "forensic-psychiatry", summary: "Capacity, responsibility, fitness to stand trial, testamentary capacity and the psychiatric assessment in legal contexts.", blooms: "analyze", minutes: 40, prereq: ["clinical-forensic-medicine"] }, content: PLACEHOLDER },
    { title: "DNA, serology & stains", module: 4, estimatedMinutes: 45, authored: false, concept: { title: "DNA, serology and stains", slug: "dna-serology-stains", summary: "Blood grouping, DNA profiling, semen and other biological stains, and their collection and evidential value.", blooms: "apply", minutes: 45, prereq: [] }, content: PLACEHOLDER },
    { title: "Weapons & trace evidence", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Weapons and trace evidence", slug: "weapons-examination", summary: "Classification and examination of weapons, tool marks, glass, fibres, hair and other trace evidence linking scene and suspect.", blooms: "understand", minutes: 40, prereq: ["dna-serology-stains"] }, content: PLACEHOLDER },
    { title: "Ethics, consent & negligence", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Ethics, consent and negligence", slug: "ethics-consent-negligence", summary: "Informed consent, confidentiality, medical negligence standards, consumer protection and the duties of care owed to patients.", blooms: "evaluate", minutes: 40, prereq: ["medical-jurisprudence"] }, content: PLACEHOLDER },
    { title: "General toxicology", module: 5, estimatedMinutes: 45, authored: false, concept: { title: "General toxicology", slug: "toxicology-general", summary: "Toxicokinetics, dose-response, mechanisms of toxicity, decontamination and the general management of the poisoned patient.", blooms: "apply", minutes: 45, prereq: [] }, content: PLACEHOLDER },
    { title: "Clinical toxicology & poisoning", module: 5, estimatedMinutes: 50, authored: false, concept: { title: "Clinical toxicology and poisoning", slug: "clinical-toxicology-poisoning", summary: "Common poisonings — organophosphates, corrosives, heavy metals, alcohols, drugs of abuse, snake and insect venom — recognition and treatment.", blooms: "analyze", minutes: 50, prereq: ["toxicology-general"] }, content: PLACEHOLDER },
    { title: "Environmental & analytical toxicology", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Environmental and analytical toxicology", slug: "environmental-analytical-toxicology", summary: "Pesticide and pollutant exposure in the community, and laboratory methods that detect and quantify poisons.", blooms: "understand", minutes: 40, prereq: ["toxicology-general"] }, content: PLACEHOLDER },
  ],
  sbas: [],
}

export async function seedForensicMedicine(): Promise<void> {
  const counts = await seedMbbsCourse(FORENSIC_MEDICINE);
  console.log(`✓ ${FORENSIC_MEDICINE.code} ${FORENSIC_MEDICINE.title}: ${counts.modules} modules · ${counts.concepts} concepts · ${counts.lessons} lessons · ${counts.items} items`);
}

if (process.argv[1] && process.argv[1].includes("seed-assessment-forensic-medicine")) {
  seedForensicMedicine()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
}
