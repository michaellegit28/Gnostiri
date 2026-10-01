// Curriculum Alignment Engine — Phase 2 seed (hybrid per approval)
// - Seeds 20 regions, boards, 11 departments, master topics (needsVerification=TRUE, lastAuditedDate=NULL)
// - Seeds ONLY 3 hard-correction alignments as CORE across all boards (verified)
// - Run after migration: npx ts-node prisma/seed-curriculum-alignment.ts
// DO NOT auto-generate other alignments — human verification via /admin/alignments.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const REGIONS: { name: string; isoCode: string; rtl: boolean }[] = [
  { name: "United States", isoCode: "US", rtl: false },
  { name: "United Kingdom", isoCode: "GB", rtl: false },
  { name: "Canada", isoCode: "CA", rtl: false },
  { name: "Ireland", isoCode: "IE", rtl: false },
  { name: "France", isoCode: "FR", rtl: false },
  { name: "Germany", isoCode: "DE", rtl: false },
  { name: "Nigeria", isoCode: "NG", rtl: false },
  { name: "Ghana", isoCode: "GH", rtl: false },
  { name: "Kenya", isoCode: "KE", rtl: false },
  { name: "South Africa", isoCode: "ZA", rtl: false },
  { name: "Egypt", isoCode: "EG", rtl: true },
  { name: "India", isoCode: "IN", rtl: false },
  { name: "Pakistan", isoCode: "PK", rtl: false },
  { name: "China", isoCode: "CN", rtl: false },
  { name: "Japan", isoCode: "JP", rtl: false },
  { name: "Australia", isoCode: "AU", rtl: false },
  { name: "Singapore", isoCode: "SG", rtl: false },
  { name: "United Arab Emirates", isoCode: "AE", rtl: true },
  { name: "Israel", isoCode: "IL", rtl: true },
  { name: "Brazil", isoCode: "BR", rtl: false },
];

// Boards per ISO — at least 1 per region; multi-board where spec calls out (UK, IN, SG)
const BOARDS: { iso: string; name: string; year: number; url?: string }[] = [
  { iso: "US", name: "US Common Core", year: 2024 },
  { iso: "US", name: "US Advanced Placement (AP)", year: 2024 },
  { iso: "US", name: "International Baccalaureate (IB)", year: 2024 },
  { iso: "GB", name: "AQA A-Level", year: 2024 },
  { iso: "GB", name: "OCR A-Level", year: 2024 },
  { iso: "GB", name: "Edexcel A-Level", year: 2024 },
  { iso: "GB", name: "Cambridge International A-Level 9700/9702", year: 2024 },
  { iso: "CA", name: "Ontario Curriculum", year: 2024 },
  { iso: "IE", name: "Leaving Certificate", year: 2024 },
  { iso: "FR", name: "Baccalauréat", year: 2024 },
  { iso: "DE", name: "Abitur (KMK)", year: 2024 },
  { iso: "NG", name: "WAEC Nigeria", year: 2024 },
  { iso: "NG", name: "NECO", year: 2024 },
  { iso: "GH", name: "WAEC Ghana", year: 2024 },
  { iso: "KE", name: "KCSE Kenya", year: 2024 },
  { iso: "ZA", name: "CAPS (DBE)", year: 2024 },
  { iso: "EG", name: "Thanaweya Amma", year: 2024 },
  { iso: "IN", name: "CBSE", year: 2024 },
  { iso: "IN", name: "ISC/ICSE", year: 2024 },
  { iso: "PK", name: "FBISE Pakistan", year: 2024 },
  { iso: "CN", name: "Gaokao National Curriculum", year: 2024 },
  { iso: "JP", name: "Japan Common Test", year: 2024 },
  { iso: "AU", name: "Australian Curriculum", year: 2024 },
  { iso: "SG", name: "Singapore-Cambridge GCE A-Level (H2 9744)", year: 2024 },
  { iso: "AE", name: "UAE MOE Curriculum", year: 2024 },
  { iso: "IL", name: "Bagrut", year: 2024 },
  { iso: "BR", name: "BNCC / ENEM", year: 2024 },
];

const DEPARTMENTS: { name: string; icon: string }[] = [
  { name: "Mathematics", icon: "sigma" },
  { name: "Biology", icon: "dna" },
  { name: "Chemistry", icon: "flask" },
  { name: "Physics", icon: "atom" },
  { name: "History", icon: "scroll" },
  { name: "Business, Economics & Accounting", icon: "briefcase" },
  { name: "Humanities & Social Sciences", icon: "globe" },
  { name: "Computer Science & ICT", icon: "cpu" },
  { name: "Arts & Design", icon: "palette" },
  { name: "Technical & Vocational", icon: "wrench" },
  { name: "Physical Education & Health", icon: "heart-pulse" },
];

const MASTER_TOPICS: { dept: string; title: string; slug: string; desc: string }[] = [
  { dept: "Mathematics", title: "Algebra Foundations", slug: "algebra-foundations", desc: "Linear equations, inequalities, quadratics, functions, graphs, sequences, logarithms" },
  { dept: "Mathematics", title: "Geometry & Trigonometry", slug: "geometry-trigonometry", desc: "Coordinate geometry, theorems, triangles, circles, sine/cosine laws, vectors" },
  { dept: "Mathematics", title: "Calculus", slug: "calculus", desc: "Limits, derivatives, integrals, optimization, differential equations" },
  { dept: "Mathematics", title: "Statistics & Probability", slug: "statistics-probability", desc: "Data analysis, distributions, permutations, combinations, hypothesis testing, regression" },
  { dept: "Mathematics", title: "Further Mathematics", slug: "further-mathematics", desc: "Matrices, complex numbers, polar coordinates, advanced mechanics" },
  { dept: "Biology", title: "Cell Biology", slug: "cell-biology", desc: "Structure, organelles, membrane transport, mitosis/meiosis" },
  { dept: "Biology", title: "Bioenergetics & Biochemistry", slug: "bioenergetics-biochemistry", desc: "Cellular respiration, photosynthesis, enzymes, ATP" },
  { dept: "Biology", title: "Genetics & Molecular Biology", slug: "genetics-molecular-biology", desc: "DNA replication, protein synthesis, inheritance, mutations, biotechnology" },
  { dept: "Biology", title: "Human Physiology", slug: "human-physiology", desc: "Digestive, circulatory, respiratory, nervous, endocrine systems" },
  { dept: "Biology", title: "Ecology & Evolution", slug: "ecology-evolution", desc: "Natural selection, ecosystems, nutrient cycles, biodiversity" },
  { dept: "Biology", title: "Plant Biology", slug: "plant-biology", desc: "Transport in plants, plant hormones, tropisms, reproduction" },
  { dept: "Chemistry", title: "Atomic Structure & Periodic Table", slug: "atomic-structure-periodic-table", desc: "Atomic models, electron configuration, periodicity" },
  { dept: "Chemistry", title: "Chemical Bonding", slug: "chemical-bonding", desc: "Ionic, covalent, metallic, intermolecular forces, molecular shapes" },
  { dept: "Chemistry", title: "Stoichiometry & The Mole", slug: "stoichiometry-mole", desc: "Mole concept, empirical formulae, titration calculations" },
  { dept: "Chemistry", title: "Thermodynamics & Kinetics", slug: "thermodynamics-kinetics", desc: "Enthalpy, entropy, reaction rates, catalysts, equilibrium" },
  { dept: "Chemistry", title: "Organic Chemistry", slug: "organic-chemistry", desc: "Hydrocarbons, functional groups, isomerism, polymerization, mechanisms" },
  { dept: "Chemistry", title: "Electrochemistry", slug: "electrochemistry", desc: "Redox, electrolysis, electrochemical cells, standard electrode potentials" },
  { dept: "Physics", title: "Mechanics", slug: "mechanics", desc: "Kinematics, Newton's laws, work/energy/power, momentum, circular motion" },
  { dept: "Physics", title: "Waves & Optics", slug: "waves-optics", desc: "Reflection, refraction, diffraction, sound, electromagnetic spectrum" },
  { dept: "Physics", title: "Electricity & Magnetism", slug: "electricity-magnetism", desc: "Electric fields, current, circuits, magnetic fields, induction" },
  { dept: "Physics", title: "Thermodynamics", slug: "thermodynamics", desc: "Heat transfer, ideal gases, laws of thermodynamics" },
  { dept: "Physics", title: "Nuclear & Quantum Physics", slug: "nuclear-quantum-physics", desc: "Radioactivity, half-life, fission/fusion, photoelectric effect" },
  { dept: "Physics", title: "Further Mechanics & Fields", slug: "further-mechanics-fields", desc: "SHM, gravitational/electric fields, capacitance" },
  { dept: "History", title: "World Wars I & II", slug: "world-wars", desc: "Causes, course, consequences of the world wars" },
  { dept: "History", title: "Cold War Era", slug: "cold-war-era", desc: "Bipolar rivalry, decolonization pressures, proxy conflicts" },
  { dept: "History", title: "Decolonization & Independence", slug: "decolonization-independence", desc: "Independence movements across Africa and Asia" },
  { dept: "History", title: "Regional Compulsory History", slug: "regional-compulsory-history", desc: "Nigerian History (WAEC), Israeli History (Bagrut), Egyptian History (Thanaweya)" },
  { dept: "History", title: "IB World History", slug: "ib-world-history", desc: "IB prescribed and world history topics" },
  { dept: "Business, Economics & Accounting", title: "Microeconomics", slug: "microeconomics", desc: "Supply, demand, market structures, consumer behaviour" },
  { dept: "Business, Economics & Accounting", title: "Macroeconomics", slug: "macroeconomics", desc: "GDP, inflation, fiscal and monetary policy" },
  { dept: "Business, Economics & Accounting", title: "Business Studies", slug: "business-studies", desc: "Management, marketing, operations, finance" },
  { dept: "Business, Economics & Accounting", title: "Accounting", slug: "accounting", desc: "Double entry, financial statements, costing" },
  { dept: "Business, Economics & Accounting", title: "Commerce", slug: "commerce", desc: "Trade, commerce systems, business environment" },
  { dept: "Humanities & Social Sciences", title: "Geography", slug: "geography", desc: "Physical, human, environmental geography, GIS" },
  { dept: "Humanities & Social Sciences", title: "Political Science / Government", slug: "political-science-government", desc: "Political systems, governance, constitutions" },
  { dept: "Humanities & Social Sciences", title: "Sociology", slug: "sociology", desc: "Social structures, institutions, research methods" },
  { dept: "Humanities & Social Sciences", title: "Psychology", slug: "psychology", desc: "Biological, cognitive, developmental, social, clinical" },
  { dept: "Humanities & Social Sciences", title: "Philosophy", slug: "philosophy", desc: "Ethics, logic, epistemology, key thinkers" },
  { dept: "Humanities & Social Sciences", title: "Religious Studies", slug: "religious-studies", desc: "World religions, ethics, sacred texts" },
  { dept: "Computer Science & ICT", title: "Programming Fundamentals", slug: "programming-fundamentals", desc: "Variables, control flow, functions, basic I/O" },
  { dept: "Computer Science & ICT", title: "Data Structures & Algorithms", slug: "data-structures-algorithms", desc: "Arrays, trees, graphs, sorting, complexity" },
  { dept: "Computer Science & ICT", title: "Computer Systems", slug: "computer-systems", desc: "Hardware, OS, networks, cybersecurity" },
  { dept: "Computer Science & ICT", title: "Databases", slug: "databases", desc: "SQL, relational design, normalization" },
  { dept: "Computer Science & ICT", title: "AI & Emerging Tech", slug: "ai-emerging-tech", desc: "Machine learning concepts, ethics, emerging platforms" },
  { dept: "Arts & Design", title: "Visual Arts", slug: "visual-arts", desc: "Drawing, painting, art history basics" },
  { dept: "Arts & Design", title: "Music", slug: "music", desc: "Theory, performance, appreciation" },
  { dept: "Arts & Design", title: "Drama & Theatre", slug: "drama-theatre", desc: "Acting, stagecraft, dramatic texts" },
  { dept: "Arts & Design", title: "Design & Technology", slug: "design-technology", desc: "Design process, materials, prototyping" },
  { dept: "Technical & Vocational", title: "Engineering", slug: "engineering", desc: "Applied mechanics, materials, workshop practice" },
  { dept: "Technical & Vocational", title: "Agriculture", slug: "agriculture", desc: "Crop science, animal husbandry, soil" },
  { dept: "Technical & Vocational", title: "Home Economics / Food & Nutrition", slug: "home-economics-food-nutrition", desc: "Nutrition, meal planning, home management" },
  { dept: "Technical & Vocational", title: "Technical Drawing / EGD", slug: "technical-drawing-egd", desc: "Orthographic projection, dimensioning, CAD basics" },
  { dept: "Physical Education & Health", title: "Physical Education", slug: "physical-education", desc: "Fitness, sports skills, training principles" },
  { dept: "Physical Education & Health", title: "Health Education", slug: "health-education", desc: "Hygiene, disease prevention, wellbeing" },
  { dept: "Physical Education & Health", title: "Life Orientation", slug: "life-orientation", desc: "ZA compulsory life skills and citizenship" },
];

// ONLY pre-verified alignments at launch (hard constraints)
const VERIFIED_CORE_SLUGS = ["human-physiology", "thermodynamics", "statistics-probability"];

async function main() {
  const today = new Date();

  for (const r of REGIONS) {
    await prisma.region.upsert({
      where: { isoCode: r.isoCode },
      update: { name: r.name, rtlLanguage: r.rtl },
      create: { name: r.name, isoCode: r.isoCode, rtlLanguage: r.rtl },
    });
  }

  const regionMap = new Map(
    (await prisma.region.findMany()).map((r) => [r.isoCode, r.id])
  );

  for (const b of BOARDS) {
    const regionId = regionMap.get(b.iso)!;
    await prisma.curriculumBoard.upsert({
      where: { id: `${b.iso}-${b.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` },
      update: { name: b.name, regionId, syllabusVersionYear: b.year, lastAuditedDate: today },
      create: {
        id: `${b.iso}-${b.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        name: b.name,
        regionId,
        officialSyllabusUrl: b.url ?? null,
        syllabusVersionYear: b.year,
        lastAuditedDate: today,
      },
    });
  }

  // Tracks only where boards have streams (progressive disclosure needs them)
  const cbse = await prisma.curriculumBoard.findFirst({ where: { name: "CBSE" } });
  if (cbse) {
    for (const t of [
      { name: "Science Stream", desc: "Physics/Chemistry/Maths/Biology focus" },
      { name: "Commerce Stream", desc: "Accounts/Economics/Business focus" },
      { name: "Humanities Stream", desc: "History/PolSci/Sociology focus" },
    ]) {
      await prisma.studyTrack.upsert({
        where: { id: `${cbse.id}-${t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` },
        update: { name: t.name, description: t.desc },
        create: { id: `${cbse.id}-${t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, boardId: cbse.id, name: t.name, description: t.desc },
      });
    }
  }

  for (const d of DEPARTMENTS) {
    await prisma.department.upsert({
      where: { name: d.name },
      update: { iconSlug: d.icon },
      create: { name: d.name, iconSlug: d.icon },
    });
  }
  const deptMap = new Map((await prisma.department.findMany()).map((d) => [d.name, d.id]));

  for (const t of MASTER_TOPICS) {
    const isVerifiedTopic = VERIFIED_CORE_SLUGS.includes(t.slug);
    await prisma.topic.upsert({
      where: { id: `master-${t.slug}` },
      update: {
        title: t.title,
        description: t.desc,
        slug: t.slug,
        departmentId: deptMap.get(t.dept)!,
        lastAuditedDate: isVerifiedTopic ? today : null,
        needsVerification: !isVerifiedTopic,
      },
      create: {
        id: `master-${t.slug}`,
        domain: "highschool",
        title: t.title,
        description: t.desc,
        slug: t.slug,
        departmentId: deptMap.get(t.dept)!,
        isPublished: true,
        orderIndex: 0,
        // Hybrid: NULL + needsVerification TRUE for pending; verified 3 get date + FALSE
        lastAuditedDate: isVerifiedTopic ? today : null,
        needsVerification: !isVerifiedTopic,
      },
    });
  }

  const boards = await prisma.curriculumBoard.findMany();
  for (const slug of VERIFIED_CORE_SLUGS) {
    const topic = await prisma.topic.findFirst({ where: { slug } });
    if (!topic) continue;
    for (const board of boards) {
      // NOTE: (topicId, boardId, NULL trackId) cannot use upsert — Postgres treats
      // NULLs as distinct and Prisma rejects null in compound-unique where.
      // Enforce single NULL-track row in app logic; seed uses findFirst + create/update.
      const existing = await prisma.topicBoardAlignment.findFirst({
        where: { topicId: topic.id, boardId: board.id, trackId: null },
      });
      const note =
        slug === "human-physiology"
          ? "CORE in UK A-Levels (AQA/OCR/Edexcel/Cambridge 9700) and SG H2 Biology 9744; CORE in all 20 regions."
          : slug === "thermodynamics"
            ? "CORE in Cambridge 9702 Sec III, AQA/OCR/Edexcel and SG H2 Physics; CORE in all 20 regions."
            : "CORE in Israeli Bagrut mathematics; CORE in all 20 regions.";
      if (existing) {
        await prisma.topicBoardAlignment.update({
          where: { id: existing.id },
          data: { tier: "core", verifiedDate: today, weightNotes: note },
        });
      } else {
        await prisma.topicBoardAlignment.create({
          data: {
            topicId: topic.id,
            boardId: board.id,
            trackId: null,
            tier: "core",
            verifiedDate: today,
            weightNotes: note,
          },
        });
      }
    }
  }

  console.log("Curriculum seed complete: 20 regions, boards, 11 departments, master topics pending + 3 CORE verified.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
