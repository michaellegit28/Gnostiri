import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Phase 0 university seed.
 *
 * Establishes the academic taxonomy: the 13 founding Faculties, the medical
 * departments, and the flagship MBBS programme with its pre-clinical course
 * map and a concept-level prerequisite DAG for Anatomy (the proof that the
 * pedagogy engine works on real content, not placeholders).
 *
 * Idempotent: safe to run repeatedly. Uses upserts on stable slugs.
 */

const FACULTIES = [
  { slug: "clinical-medicine", name: "Clinical Medicine", accent: "#D4AF37", blurb: "The flagship — MBBS, BDS and the full clinical continuum." },
  { slug: "basic-medical-sciences", name: "Basic Medical Sciences", accent: "#14B8A6", blurb: "Anatomy, Physiology, Biochemistry, Pharmacology, Pathology." },
  { slug: "allied-health", name: "Allied Health & Pharmacy", accent: "#8B5CF6", blurb: "Nursing, Physiotherapy, Radiography, Medical Laboratory Science, PharmD." },
  { slug: "engineering", name: "Engineering", accent: "#F59E0B", blurb: "Civil, Mechanical, Electrical, Chemical, Petroleum, Mechatronics." },
  { slug: "computing", name: "Computing & AI", accent: "#3B82F6", blurb: "Computer Science, Software Engineering, Cybersecurity, Data Science." },
  { slug: "natural-sciences", name: "Natural Sciences", accent: "#22C55E", blurb: "Physics, Chemistry, Mathematics, Biology, Geology." },
  { slug: "law", name: "Law", accent: "#EF4444", blurb: "LL.B — corporate, criminal, international and public law." },
  { slug: "business", name: "Business & Management", accent: "#EC4899", blurb: "Accounting, Economics, Business Administration, Marketing." },
  { slug: "arts-humanities", name: "Arts & Humanities", accent: "#F97316", blurb: "English, History, Philosophy, Modern Languages." },
  { slug: "social-sciences", name: "Social Sciences", accent: "#06B6D4", blurb: "Psychology, Sociology, Political Science, Geography." },
  { slug: "environmental-sciences", name: "Environmental Sciences", accent: "#84CC16", blurb: "Architecture, Urban Planning, Estate Management, Surveying." },
  { slug: "agriculture-veterinary", name: "Agriculture & Veterinary", accent: "#A3A635", blurb: "Agronomy, Animal Science, Veterinary Medicine, Forestry." },
  { slug: "education", name: "Education", accent: "#64748B", blurb: "Educational foundations, curriculum, guidance & counselling." },
];

const MEDICAL_DEPARTMENTS = [
  { name: "Human Anatomy", iconSlug: "bone" },
  { name: "Physiology", iconSlug: "activity" },
  { name: "Medical Biochemistry", iconSlug: "flask-conical" },
  { name: "Pharmacology & Therapeutics", iconSlug: "pill" },
  { name: "Pathology", iconSlug: "microscope" },
  { name: "Medical Microbiology", iconSlug: "bug" },
  { name: "Internal Medicine", iconSlug: "stethoscope" },
  { name: "Surgery", iconSlug: "scissors" },
  { name: "Paediatrics", iconSlug: "baby" },
  { name: "Obstetrics & Gynaecology", iconSlug: "heart-pulse" },
];

// Pre-clinical year one (100 level), first semester — mapped to NUC BMAS codes.
const PRECLINICAL_COURSES = [
  { code: "ANA 101", slug: "gross-anatomy-i", title: "Gross Anatomy I — Upper Limb & Thorax", department: "Human Anatomy", level: 100, credits: 4, semester: "first", concepts: [
    { title: "Anatomical position & planes of reference", slug: "anatomical-position-planes", blooms: "remember", minutes: 20, prereq: [] },
    { title: "Skeletal framework of the upper limb", slug: "upper-limb-skeleton", blooms: "understand", minutes: 35, prereq: ["anatomical-position-planes"] },
    { title: "Muscles of the pectoral region", slug: "pectoral-muscles", blooms: "understand", minutes: 30, prereq: ["upper-limb-skeleton"] },
    { title: "Brachial plexus", slug: "brachial-plexus", blooms: "analyze", minutes: 45, prereq: ["pectoral-muscles"] },
    { title: "Axilla and its contents", slug: "axilla-contents", blooms: "analyze", minutes: 35, prereq: ["brachial-plexus"] },
    { title: "Thoracic wall and intercostal space", slug: "thoracic-wall", blooms: "understand", minutes: 30, prereq: ["anatomical-position-planes"] },
    { title: "Mediastinum and pericardium", slug: "mediastinum", blooms: "analyze", minutes: 40, prereq: ["thoracic-wall"] },
    { title: "Clinical correlation: pneumothorax & nerve injuries", slug: "clinical-pneumothorax-nerve-injuries", blooms: "apply", minutes: 30, prereq: ["mediastinum", "axilla-contents"] },
  ]},
  { code: "PHS 101", slug: "physiology-cell-and-general", title: "Human Physiology I — Cell & General Physiology", department: "Physiology", level: 100, credits: 3, semester: "first", concepts: [
    { title: "Homeostasis and negative feedback", slug: "homeostasis-negative-feedback", blooms: "understand", minutes: 30, prereq: [] },
    { title: "Transport across cell membranes", slug: "membrane-transport", blooms: "understand", minutes: 35, prereq: ["homeostasis-negative-feedback"] },
    { title: "Resting membrane potential", slug: "resting-membrane-potential", blooms: "analyze", minutes: 40, prereq: ["membrane-transport"] },
    { title: "Action potential and conduction", slug: "action-potential", blooms: "analyze", minutes: 45, prereq: ["resting-membrane-potential"] },
    { title: "Neuromuscular junction", slug: "neuromuscular-junction", blooms: "apply", minutes: 35, prereq: ["action-potential"] },
    { title: "Clinical correlation: myasthenia gravis & channelopathies", slug: "clinical-myasthenia-channelopathies", blooms: "apply", minutes: 30, prereq: ["neuromuscular-junction"] },
  ]},
  { code: "MCB 101", slug: "medical-biochemistry-i", title: "Medical Biochemistry I — Cell Chemistry & Proteins", department: "Medical Biochemistry", level: 100, credits: 3, semester: "first", concepts: [
    { title: "Water, pH and buffering in the body", slug: "water-ph-buffering", blooms: "understand", minutes: 30, prereq: [] },
    { title: "Amino acids and the peptide bond", slug: "amino-acids-peptide-bond", blooms: "understand", minutes: 35, prereq: ["water-ph-buffering"] },
    { title: "Protein structure hierarchy", slug: "protein-structure-hierarchy", blooms: "analyze", minutes: 40, prereq: ["amino-acids-peptide-bond"] },
    { title: "Enzymes and Michaelis-Menten kinetics", slug: "enzyme-kinetics", blooms: "analyze", minutes: 45, prereq: ["protein-structure-hierarchy"] },
    { title: "Clinical correlation: enzyme assays in diagnosis", slug: "clinical-enzyme-assays", blooms: "apply", minutes: 30, prereq: ["enzyme-kinetics"] },
  ]},
];

async function main() {
  console.log("Seeding Phase 0 university taxonomy…");

  // 1. Faculties
  for (let i = 0; i < FACULTIES.length; i++) {
    const f = FACULTIES[i];
    await prisma.faculty.upsert({
      where: { slug: f.slug },
      update: { name: f.name, blurb: f.blurb, accent: f.accent, orderIndex: i },
      create: { slug: f.slug, name: f.name, blurb: f.blurb, accent: f.accent, orderIndex: i, isPublished: true },
    });
  }
  console.log(`✓ ${FACULTIES.length} faculties`);

  // 2. Medical departments under Basic Medical Sciences + Clinical Medicine
  const basicMed = await prisma.faculty.findUnique({ where: { slug: "basic-medical-sciences" } });
  const clinicalMed = await prisma.faculty.findUnique({ where: { slug: "clinical-medicine" } });
  if (!basicMed || !clinicalMed) throw new Error("medical faculties missing");

  const clinicalDepts = new Set(["Internal Medicine", "Surgery", "Paediatrics", "Obstetrics & Gynaecology"]);
  for (const d of MEDICAL_DEPARTMENTS) {
    const facultyId = clinicalDepts.has(d.name) ? clinicalMed.id : basicMed.id;
    await prisma.department.upsert({
      where: { name: d.name },
      update: { iconSlug: d.iconSlug, facultyId },
      create: { name: d.name, iconSlug: d.iconSlug, facultyId },
    });
  }
  console.log(`✓ ${MEDICAL_DEPARTMENTS.length} medical departments`);

  // 3. Flagship programme: MBBS
  const medicineDept = await prisma.department.findUnique({ where: { name: "Human Anatomy" } });
  const programme = await prisma.programme.upsert({
    where: { slug: "medicine-surgery-mbbs" },
    update: {},
    create: {
      slug: "medicine-surgery-mbbs",
      name: "Medicine & Surgery",
      degreeAwarded: "MBBS",
      facultyId: clinicalMed.id,
      departmentId: medicineDept?.id,
      durationYears: 6,
      totalCredits: 240,
      description: "The flagship six-year medical programme — pre-clinical foundations through clinical rotations, mapped to NUC BMAS and MDCN standards.",
      iconSlug: "stethoscope",
      orderIndex: 0,
      isPublished: true,
    },
  });
  console.log("✓ MBBS programme");

  // 4. Curriculum standard (NUC BMAS)
  const standard = await prisma.curriculumStandard.upsert({
    where: { programmeId_authority_editionYear: { programmeId: programme.id, authority: "National Universities Commission", editionYear: 2024 } },
    update: {},
    create: {
      programmeId: programme.id,
      authority: "National Universities Commission",
      editionYear: 2024,
      officialUrl: "https://www.nuc.edu.ng",
      lastAuditedDate: new Date(),
    },
  });

  // 5. Pre-clinical courses with concept DAG + curriculum alignment
  let conceptCount = 0;
  let edgeCount = 0;
  for (const c of PRECLINICAL_COURSES) {
    const dept = await prisma.department.findUnique({ where: { name: c.department } });
    const course = await prisma.course.upsert({
      where: { domain_slug: { domain: "university", slug: c.slug } },
      update: { code: c.code, level: c.level, credits: c.credits, semester: c.semester, programmeId: programme.id, facultyId: clinicalMed.id, title: c.title },
      create: {
        domain: "university",
        slug: c.slug,
        title: c.title,
        department: c.department,
        code: c.code,
        level: c.level,
        credits: c.credits,
        semester: c.semester,
        programmeId: programme.id,
        facultyId: clinicalMed.id,
        isPublished: true,
      },
    });
    await prisma.curriculumAlignment.upsert({
      where: { courseId_standardId: { courseId: course.id, standardId: standard.id } },
      update: { moduleCode: c.code },
      create: { courseId: course.id, standardId: standard.id, moduleCode: c.code, mappingTier: "core", verifiedDate: new Date() },
    });

    // Concepts + prerequisite edges (the DAG)
    const slugToId = new Map<string, string>();
    for (let i = 0; i < c.concepts.length; i++) {
      const k = c.concepts[i];
      const node = await prisma.conceptNode.upsert({
        where: { courseId_slug: { courseId: course.id, slug: k.slug } },
        update: { title: k.title, bloomsLevel: k.blooms, estMinutes: k.minutes, orderIndex: i },
        create: { courseId: course.id, slug: k.slug, title: k.title, summary: null, bloomsLevel: k.blooms, estMinutes: k.minutes, orderIndex: i, isPublished: true },
      });
      slugToId.set(k.slug, node.id);
      conceptCount++;
    }
    for (const k of c.concepts) {
      for (const prereqSlug of k.prereq) {
        const conceptId = slugToId.get(k.slug)!;
        const prerequisiteId = slugToId.get(prereqSlug);
        if (!prerequisiteId) continue;
        await prisma.conceptPrerequisite.upsert({
          where: { conceptId_prerequisiteId: { conceptId, prerequisiteId } },
          update: {},
          create: { conceptId, prerequisiteId },
        });
        edgeCount++;
      }
    }
  }
  console.log(`✓ ${PRECLINICAL_COURSES.length} pre-clinical courses, ${conceptCount} concepts, ${edgeCount} prerequisite edges`);

  console.log("Phase 0 seed complete.");
}

// Exported for the one-shot temp seeder route (src/app/api/temp-seed-university).
export async function seedUniversity() {
  await main();
}

// CLI usage unchanged: npx ts-node prisma/seed-university.ts
// The guard keeps this auto-run out of bundlers (Next/webpack), so importing
// the module never triggers a seed on its own.
if (process.argv[1] && process.argv[1].includes("seed-university")) {
  main()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
