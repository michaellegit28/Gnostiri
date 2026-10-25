import { prisma, seedMbbsCourse, type SubjectSeed } from "./spine";
import type { LessonContent } from "@/types/lesson";

const PLACEHOLDER: LessonContent = { blocks: [] };

export const COMMUNITY_MEDICINE: SubjectSeed = {
  id: "mbbs-community-medicine",
  slug: "community-medicine",
  title: "Community Medicine",
  code: "CMED 301",
  department: "Community Medicine",
  level: 300,
  credits: 6,
  semester: "full",
  description:
    "Preventive and social medicine: epidemiology, biostatistics, environment, nutrition, maternal and child health, national health programmes and health administration, with urban and rural field postings (AIIMS semesters III–VIII plus rural internship).",
  faculty: "clinical-medicine",
  prereqCourses: ["physiology-cell-and-general", "paediatrics-child-health"],
  modules: [
    { slug: "foundations-health", title: "M1 — Foundations of health & behavioural sciences" },
    { slug: "environment-epidemiology", title: "M2 — Environment, biostatistics & epidemiology" },
    { slug: "nutrition-mch", title: "M3 — Nutrition, maternal & child health" },
    { slug: "disease-control-programmes", title: "M4 — Disease control & national health programmes" },
    { slug: "health-systems", title: "M5 — Health systems, economics & field practice" },
  ],
  lessons: [
    { title: "Concepts of health & disease", module: 1, estimatedMinutes: 35, authored: false, concept: { title: "Concepts of health and disease", slug: "concepts-health-disease", summary: "Definitions of health, the natural history and iceberg of disease, levels of prevention and the determinants of population health.", blooms: "understand", minutes: 35, prereq: [] }, content: PLACEHOLDER },
    { title: "Behavioural sciences & communication", module: 1, estimatedMinutes: 35, authored: false, concept: { title: "Behavioural sciences and communication", slug: "behavioural-sciences-communication", summary: "Doctor–patient communication, health beliefs, behaviour change models and counselling skills used in prevention.", blooms: "apply", minutes: 35, prereq: ["concepts-health-disease"] }, content: PLACEHOLDER },
    { title: "Health education & planning", module: 1, estimatedMinutes: 35, authored: false, concept: { title: "Health education and planning", slug: "health-education-planning", summary: "Methods and media of health education, and the steps of planning and evaluating a community health intervention.", blooms: "apply", minutes: 35, prereq: ["behavioural-sciences-communication"] }, content: PLACEHOLDER },
    { title: "Environmental health", module: 2, estimatedMinutes: 45, authored: false, concept: { title: "Environmental health", slug: "environmental-health", summary: "Water, air, noise, housing, ventilation, sanitation and pollution — their health effects and community-level control.", blooms: "analyze", minutes: 45, prereq: ["concepts-health-disease"] }, content: PLACEHOLDER },
    { title: "Biostatistics", module: 2, estimatedMinutes: 50, authored: false, concept: { title: "Biostatistics", slug: "biostatistics", summary: "Measures of central tendency and variation, probability, sampling, tests of significance, correlation and the presentation of health data.", blooms: "apply", minutes: 50, prereq: [] }, content: PLACEHOLDER },
    { title: "Epidemiological methods", module: 2, estimatedMinutes: 45, authored: false, concept: { title: "Epidemiological methods", slug: "epidemiology-methods", summary: "Measures of disease frequency, study designs, causality, bias, confounding, screening test performance and outbreak investigation.", blooms: "analyze", minutes: 45, prereq: ["biostatistics"] }, content: PLACEHOLDER },
    { title: "Screening & surveillance", module: 2, estimatedMinutes: 35, authored: false, concept: { title: "Screening and disease surveillance", slug: "screening-surveillance", summary: "Criteria and evaluation of screening programmes, and the systems that detect and report disease in populations.", blooms: "evaluate", minutes: 35, prereq: ["epidemiology-methods"] }, content: PLACEHOLDER },
    { title: "Nutrition assessment", module: 3, estimatedMinutes: 45, authored: false, concept: { title: "Nutrition assessment", slug: "nutrition-assessment", summary: "Macronutrients and micronutrients, dietary assessment, growth monitoring, protein-energy malnutrition and nutritional deficiency disorders.", blooms: "apply", minutes: 45, prereq: [] }, content: PLACEHOLDER },
    { title: "Maternal & child health", module: 3, estimatedMinutes: 45, authored: false, concept: { title: "Maternal and child health", slug: "maternal-child-health", summary: "Antenatal, intranatal and postnatal care, risk approach, low birth weight, breastfeeding and child survival programmes.", blooms: "apply", minutes: 45, prereq: ["nutrition-assessment"] }, content: PLACEHOLDER },
    { title: "Family welfare & contraception", module: 3, estimatedMinutes: 35, authored: false, concept: { title: "Family welfare and contraception", slug: "family-welfare-contraception", summary: "Demographic cycle, fertility indicators, contraceptive methods, spacing and the population policy context.", blooms: "apply", minutes: 35, prereq: ["maternal-child-health"] }, content: PLACEHOLDER },
    { title: "Communicable disease control", module: 4, estimatedMinutes: 50, authored: false, concept: { title: "Communicable disease control", slug: "communicable-disease-control", summary: "Chain of infection, contact tracing, quarantine, disinfection and the epidemiology and control of major epidemic-prone diseases.", blooms: "analyze", minutes: 50, prereq: ["epidemiology-methods"] }, content: PLACEHOLDER },
    { title: "Non-communicable disease", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Non-communicable disease", slug: "non-communicable-disease", summary: "Epidemiology and prevention of cardiovascular disease, diabetes, cancer, chronic respiratory disease and mental disorders.", blooms: "analyze", minutes: 40, prereq: ["communicable-disease-control"] }, content: PLACEHOLDER },
    { title: "National health programmes", module: 4, estimatedMinutes: 45, authored: false, concept: { title: "National health programmes", slug: "national-health-programs", summary: "Structure, target groups and delivery of the national programmes for immunisation, tuberculosis, HIV, malaria, reproductive health and disease elimination.", blooms: "understand", minutes: 45, prereq: ["communicable-disease-control"] }, content: PLACEHOLDER },
    { title: "Occupational health", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Occupational health", slug: "occupational-health", summary: "Workplace hazards, dust diseases, pneumoconioses, occupational infections, fitness certification and prevention at work.", blooms: "apply", minutes: 40, prereq: ["environmental-health"] }, content: PLACEHOLDER },
    { title: "Health administration & management", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Health administration and management", slug: "health-administration-management", summary: "Health system levels, primary health care, planning and management of materials, finance and human resources, and health information systems.", blooms: "apply", minutes: 40, prereq: [] }, content: PLACEHOLDER },
    { title: "Health economics & geriatrics", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Health economics and geriatrics", slug: "health-economics-geriatrics", summary: "Cost, cost-effectiveness and health financing, plus the health problems and care of ageing populations.", blooms: "understand", minutes: 35, prereq: ["health-administration-management"] }, content: PLACEHOLDER },
    { title: "Rehabilitation & counselling", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Rehabilitation and counselling", slug: "rehabilitation-counselling", summary: "Disability assessment, community-based rehabilitation, assistive devices and counselling in chronic and terminal illness.", blooms: "apply", minutes: 35, prereq: ["health-economics-geriatrics"] }, content: PLACEHOLDER },
    { title: "Rural posting & field project", module: 5, estimatedMinutes: 60, authored: false, concept: { title: "Rural posting and field project", slug: "rural-posting-field-project", summary: "The rural health centre posting: household surveys, water and sanitation assessment, programme delivery and the community field project report.", blooms: "evaluate", minutes: 60, prereq: ["screening-surveillance"] }, content: PLACEHOLDER },
  ],
  sbas: [],
}

export async function seedCommunityMedicine(): Promise<void> {
  const counts = await seedMbbsCourse(COMMUNITY_MEDICINE);
  console.log(`✓ ${COMMUNITY_MEDICINE.code} ${COMMUNITY_MEDICINE.title}: ${counts.modules} modules · ${counts.concepts} concepts · ${counts.lessons} lessons · ${counts.items} items`);
}

if (process.argv[1] && process.argv[1].includes("seed-assessment-community-medicine")) {
  seedCommunityMedicine()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
}
