import { prisma, seedMbbsCourse, type SubjectSeed } from "./spine";
import type { LessonContent } from "@/types/lesson";

const PLACEHOLDER: LessonContent = { blocks: [] };

export const PSYCHIATRY: SubjectSeed = {
  id: "mbbs-psychiatry",
  slug: "psychiatry",
  title: "Psychiatry",
  code: "PSYT 306",
  department: "Psychiatry",
  level: 300,
  credits: 3,
  semester: "second",
  description:
    "Behavioural sciences and clinical psychiatry: classification, aetiology, psychotic, mood, anxiety and related disorders, substance use, child and adolescent disorders, therapies and psychological testing (AIIMS behavioural sciences in semester II, clinical psychiatry in semester VI).",
  faculty: "clinical-medicine",
  prereqCourses: ["physiology-cell-and-general", "pathology-cell-injury-repair"],
  modules: [
    { slug: "behavioural-sciences", title: "M1 — Behavioural sciences" },
    { slug: "psychiatry-foundations", title: "M2 — Foundations of psychiatry" },
    { slug: "psychotic-mood-disorders", title: "M3 — Psychotic & mood disorders" },
    { slug: "anxiety-trauma-related", title: "M4 — Anxiety, trauma & related disorders" },
    { slug: "substance-special-populations", title: "M5 — Substance use & special populations" },
  ],
  lessons: [
    { title: "Motivation & emotion", module: 1, estimatedMinutes: 30, authored: false, concept: { title: "Motivation and emotion", slug: "motivation-emotion", summary: "Drives, homeostasis of motivation, theories of emotion and their expression — the substrate of normal mental functioning.", blooms: "understand", minutes: 30, prereq: [] }, content: PLACEHOLDER },
    { title: "Learning & cognition", module: 1, estimatedMinutes: 35, authored: false, concept: { title: "Learning and cognition", slug: "learning-cognition", summary: "Conditioning, observational learning, attention, language and problem-solving as the basis of behaviour and its modification.", blooms: "understand", minutes: 35, prereq: ["motivation-emotion"] }, content: PLACEHOLDER },
    { title: "Memory & thinking", module: 1, estimatedMinutes: 35, authored: false, concept: { title: "Memory and thinking", slug: "memory-thinking", summary: "Stages and systems of memory, forgetting, concept formation, reasoning and the common errors of thinking.", blooms: "understand", minutes: 35, prereq: ["learning-cognition"] }, content: PLACEHOLDER },
    { title: "Intelligence & personality", module: 1, estimatedMinutes: 35, authored: false, concept: { title: "Intelligence and personality", slug: "intelligence-personality", summary: "Theories and measurement of intelligence, personality development, and the traits that shape vulnerability to disorder.", blooms: "understand", minutes: 35, prereq: ["memory-thinking"] }, content: PLACEHOLDER },
    { title: "Classification & assessment", module: 2, estimatedMinutes: 35, authored: false, concept: { title: "Classification and assessment", slug: "classification-assessment", summary: "ICD and DSM classification, the mental status examination, history taking and risk assessment in the psychiatric interview.", blooms: "apply", minutes: 35, prereq: [] }, content: PLACEHOLDER },
    { title: "Aetiology & the biopsychosocial model", module: 2, estimatedMinutes: 35, authored: false, concept: { title: "Aetiology and biopsychosocial model", slug: "aetiology-biopsychosocial", summary: "Genetic, neurobiological, psychological and social contributions to mental disorder, and the stress-vulnerability framework.", blooms: "analyze", minutes: 35, prereq: ["classification-assessment"] }, content: PLACEHOLDER },
    { title: "Schizophrenia spectrum", module: 3, estimatedMinutes: 45, authored: false, concept: { title: "Schizophrenia spectrum disorders", slug: "schizophrenia-spectrum", summary: "Phenomenology of delusions, hallucinations and thought disorder; positive and negative symptoms, course and subtypes.", blooms: "understand", minutes: 45, prereq: ["classification-assessment"] }, content: PLACEHOLDER },
    { title: "Bipolar disorder", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Bipolar disorder", slug: "bipolar-disorder", summary: "Manic, hypomanic and depressive episodes, mixed states, cyclothymia and the longitudinal diagnosis that separates bipolar from unipolar illness.", blooms: "understand", minutes: 40, prereq: ["classification-assessment"] }, content: PLACEHOLDER },
    { title: "Depressive disorders", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Depressive disorders", slug: "depressive-disorders", summary: "Core and somatic symptoms, grief and adjustment, dysthymia, screening questions and suicide risk assessment.", blooms: "analyze", minutes: 40, prereq: ["bipolar-disorder"] }, content: PLACEHOLDER },
    { title: "Anxiety, phobia & OCD", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Anxiety, phobia and OCD", slug: "anxiety-phobia-ocd", summary: "Generalised anxiety, panic, phobias and obsessive-compulsive phenomena — recognition, differentials and first-line management.", blooms: "understand", minutes: 40, prereq: ["classification-assessment"] }, content: PLACEHOLDER },
    { title: "Somatoform & dissociative disorders", module: 4, estimatedMinutes: 35, authored: false, concept: { title: "Somatoform and dissociative disorders", slug: "somatoform-dissociative", summary: "Conversion and dissociative presentations, medically unexplained symptoms, and the empathetic management that avoids reinforcement.", blooms: "apply", minutes: 35, prereq: ["anxiety-phobia-ocd"] }, content: PLACEHOLDER },
    { title: "Stress-related & personality disorders", module: 4, estimatedMinutes: 35, authored: false, concept: { title: "Stress-related and personality disorders", slug: "stress-personality-disorders", summary: "Acute stress and PTSD, and the clusters of personality disorder with their assessment and management implications.", blooms: "understand", minutes: 35, prereq: ["somatoform-dissociative"] }, content: PLACEHOLDER },
    { title: "Alcohol & drug dependence", module: 5, estimatedMinutes: 45, authored: false, concept: { title: "Alcohol and drug dependence", slug: "alcohol-drug-dependence", summary: "Intoxication, withdrawal and dependence syndromes for alcohol, opioids, stimulants and sedatives; screening tools and treatment pathways.", blooms: "apply", minutes: 45, prereq: [] }, content: PLACEHOLDER },
    { title: "Child & adolescent disorders", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Child and adolescent disorders", slug: "child-adolescent-disorders", summary: "Neurodevelopmental disorders, ADHD, autism, conduct problems and adolescent emotional disorders across development.", blooms: "understand", minutes: 40, prereq: ["classification-assessment"] }, content: PLACEHOLDER },
    { title: "Therapies & counselling", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Psychological therapies and counselling", slug: "therapies-counselling", summary: "CBT and other psychotherapies, counselling technique, motivational interviewing and the indications for each modality.", blooms: "apply", minutes: 40, prereq: ["anxiety-phobia-ocd"] }, content: PLACEHOLDER },
    { title: "Psychological testing & emergencies", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Psychological testing and emergencies", slug: "psychological-testing-emergencies", summary: "Rating scales and neuropsychological tests, and the acute management of agitation, self-harm and psychiatric emergency.", blooms: "apply", minutes: 35, prereq: ["therapies-counselling"] }, content: PLACEHOLDER },
  ],
  sbas: [],
}

export async function seedPsychiatry(): Promise<void> {
  const counts = await seedMbbsCourse(PSYCHIATRY);
  console.log(`✓ ${PSYCHIATRY.code} ${PSYCHIATRY.title}: ${counts.modules} modules · ${counts.concepts} concepts · ${counts.lessons} lessons · ${counts.items} items`);
}

if (process.argv[1] && process.argv[1].includes("seed-assessment-psychiatry")) {
  seedPsychiatry()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
}
