import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// TEMPORARY mobile-friendly seed runner — DELETE after confirmed.
// Guarded by ?secret= (must equal REVALIDATE_SECRET env). Steps to stay under serverless limits:
//   ?secret=..&step=status  → counts only (safe to visit first)
//   ?secret=..&step=init    → regions + boards + tracks + departments
//   ?secret=..&step=topics  → 56 master topics (pending except 3 verified)
//   ?secret=..&step=align   → 3 hard-correction topics × every board as CORE
function guard(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  return !!secret && !!process.env.REVALIDATE_SECRET && secret === process.env.REVALIDATE_SECRET;
}

const REGIONS = [
  ["United States", "US", false], ["United Kingdom", "GB", false], ["Canada", "CA", false],
  ["Ireland", "IE", false], ["France", "FR", false], ["Germany", "DE", false],
  ["Nigeria", "NG", false], ["Ghana", "GH", false], ["Kenya", "KE", false],
  ["South Africa", "ZA", false], ["Egypt", "EG", true], ["India", "IN", false],
  ["Pakistan", "PK", false], ["China", "CN", false], ["Japan", "JP", false],
  ["Australia", "AU", false], ["Singapore", "SG", false], ["United Arab Emirates", "AE", true],
  ["Israel", "IL", true], ["Brazil", "BR", false],
] as const;

const BOARDS: [string, string][] = [
  ["US", "US Common Core"], ["US", "US Advanced Placement (AP)"], ["US", "International Baccalaureate (IB)"],
  ["GB", "AQA A-Level"], ["GB", "OCR A-Level"], ["GB", "Edexcel A-Level"], ["GB", "Cambridge International A-Level 9700/9702"],
  ["CA", "Ontario Curriculum"], ["IE", "Leaving Certificate"], ["FR", "Baccalauréat"], ["DE", "Abitur (KMK)"],
  ["NG", "WAEC Nigeria"], ["NG", "NECO"], ["GH", "WAEC Ghana"], ["KE", "KCSE Kenya"], ["ZA", "CAPS (DBE)"],
  ["EG", "Thanaweya Amma"], ["IN", "CBSE"], ["IN", "ISC/ICSE"], ["PK", "FBISE Pakistan"],
  ["CN", "Gaokao National Curriculum"], ["JP", "Japan Common Test"], ["AU", "Australian Curriculum"],
  ["SG", "Singapore-Cambridge GCE A-Level (H2 9744)"], ["AE", "UAE MOE Curriculum"], ["IL", "Bagrut"], ["BR", "BNCC / ENEM"],
];

const DEPARTMENTS: [string, string][] = [
  ["Mathematics", "sigma"], ["Biology", "dna"], ["Chemistry", "flask"], ["Physics", "atom"],
  ["History", "scroll"], ["Business, Economics & Accounting", "briefcase"], ["Humanities & Social Sciences", "globe"],
  ["Computer Science & ICT", "cpu"], ["Arts & Design", "palette"], ["Technical & Vocational", "wrench"],
  ["Physical Education & Health", "heart-pulse"],
];

const TOPICS: [string, string, string, string][] = [
  ["Mathematics", "Algebra Foundations", "algebra-foundations", "Linear equations, inequalities, quadratics, functions, graphs, sequences, logarithms"],
  ["Mathematics", "Geometry & Trigonometry", "geometry-trigonometry", "Coordinate geometry, theorems, triangles, circles, sine/cosine laws, vectors"],
  ["Mathematics", "Calculus", "calculus", "Limits, derivatives, integrals, optimization, differential equations"],
  ["Mathematics", "Statistics & Probability", "statistics-probability", "Data analysis, distributions, permutations, combinations, hypothesis testing, regression"],
  ["Mathematics", "Further Mathematics", "further-mathematics", "Matrices, complex numbers, polar coordinates, advanced mechanics"],
  ["Biology", "Cell Biology", "cell-biology", "Structure, organelles, membrane transport, mitosis/meiosis"],
  ["Biology", "Bioenergetics & Biochemistry", "bioenergetics-biochemistry", "Cellular respiration, photosynthesis, enzymes, ATP"],
  ["Biology", "Genetics & Molecular Biology", "genetics-molecular-biology", "DNA replication, protein synthesis, inheritance, mutations, biotechnology"],
  ["Biology", "Human Physiology", "human-physiology", "Digestive, circulatory, respiratory, nervous, endocrine systems"],
  ["Biology", "Ecology & Evolution", "ecology-evolution", "Natural selection, ecosystems, nutrient cycles, biodiversity"],
  ["Biology", "Plant Biology", "plant-biology", "Transport in plants, plant hormones, tropisms, reproduction"],
  ["Chemistry", "Atomic Structure & Periodic Table", "atomic-structure-periodic-table", "Atomic models, electron configuration, periodicity"],
  ["Chemistry", "Chemical Bonding", "chemical-bonding", "Ionic, covalent, metallic, intermolecular forces, molecular shapes"],
  ["Chemistry", "Stoichiometry & The Mole", "stoichiometry-mole", "Mole concept, empirical formulae, titration calculations"],
  ["Chemistry", "Thermodynamics & Kinetics", "thermodynamics-kinetics", "Enthalpy, entropy, reaction rates, catalysts, equilibrium"],
  ["Chemistry", "Organic Chemistry", "organic-chemistry", "Hydrocarbons, functional groups, isomerism, polymerization, mechanisms"],
  ["Chemistry", "Electrochemistry", "electrochemistry", "Redox, electrolysis, electrochemical cells, standard electrode potentials"],
  ["Physics", "Mechanics", "mechanics", "Kinematics, Newton's laws, work/energy/power, momentum, circular motion"],
  ["Physics", "Waves & Optics", "waves-optics", "Reflection, refraction, diffraction, sound, electromagnetic spectrum"],
  ["Physics", "Electricity & Magnetism", "electricity-magnetism", "Electric fields, current, circuits, magnetic fields, induction"],
  ["Physics", "Thermodynamics", "thermodynamics", "Heat transfer, ideal gases, laws of thermodynamics"],
  ["Physics", "Nuclear & Quantum Physics", "nuclear-quantum-physics", "Radioactivity, half-life, fission/fusion, photoelectric effect"],
  ["Physics", "Further Mechanics & Fields", "further-mechanics-fields", "SHM, gravitational/electric fields, capacitance"],
  ["History", "World Wars I & II", "world-wars", "Causes, course, consequences of the world wars"],
  ["History", "Cold War Era", "cold-war-era", "Bipolar rivalry, proxy conflicts"],
  ["History", "Decolonization & Independence", "decolonization-independence", "Independence movements across Africa and Asia"],
  ["History", "Regional Compulsory History", "regional-compulsory-history", "Nigerian History (WAEC), Israeli History (Bagrut), Egyptian History (Thanaweya)"],
  ["History", "IB World History", "ib-world-history", "IB prescribed and world history topics"],
  ["Business, Economics & Accounting", "Microeconomics", "microeconomics", "Supply, demand, market structures"],
  ["Business, Economics & Accounting", "Macroeconomics", "macroeconomics", "GDP, inflation, fiscal and monetary policy"],
  ["Business, Economics & Accounting", "Business Studies", "business-studies", "Management, marketing, operations, finance"],
  ["Business, Economics & Accounting", "Accounting", "accounting", "Double entry, financial statements, costing"],
  ["Business, Economics & Accounting", "Commerce", "commerce", "Trade, commerce systems"],
  ["Humanities & Social Sciences", "Geography", "geography", "Physical, human, environmental geography, GIS"],
  ["Humanities & Social Sciences", "Political Science / Government", "political-science-government", "Political systems, governance"],
  ["Humanities & Social Sciences", "Sociology", "sociology", "Social structures, institutions"],
  ["Humanities & Social Sciences", "Psychology", "psychology", "Biological, cognitive, developmental, social, clinical"],
  ["Humanities & Social Sciences", "Philosophy", "philosophy", "Ethics, logic, epistemology"],
  ["Humanities & Social Sciences", "Religious Studies", "religious-studies", "World religions, ethics"],
  ["Computer Science & ICT", "Programming Fundamentals", "programming-fundamentals", "Variables, control flow, functions"],
  ["Computer Science & ICT", "Data Structures & Algorithms", "data-structures-algorithms", "Arrays, trees, graphs, complexity"],
  ["Computer Science & ICT", "Computer Systems", "computer-systems", "Hardware, OS, networks, cybersecurity"],
  ["Computer Science & ICT", "Databases", "databases", "SQL, relational design, normalization"],
  ["Computer Science & ICT", "AI & Emerging Tech", "ai-emerging-tech", "ML concepts, ethics"],
  ["Arts & Design", "Visual Arts", "visual-arts", "Drawing, painting, art history"],
  ["Arts & Design", "Music", "music", "Theory, performance"],
  ["Arts & Design", "Drama & Theatre", "drama-theatre", "Acting, stagecraft"],
  ["Arts & Design", "Design & Technology", "design-technology", "Design process, prototyping"],
  ["Technical & Vocational", "Engineering", "engineering", "Applied mechanics, materials"],
  ["Technical & Vocational", "Agriculture", "agriculture", "Crop science, animal husbandry"],
  ["Technical & Vocational", "Home Economics / Food & Nutrition", "home-economics-food-nutrition", "Nutrition, meal planning"],
  ["Technical & Vocational", "Technical Drawing / EGD", "technical-drawing-egd", "Orthographic projection, CAD"],
  ["Physical Education & Health", "Physical Education", "physical-education", "Fitness, sports skills"],
  ["Physical Education & Health", "Health Education", "health-education", "Hygiene, wellbeing"],
  ["Physical Education & Health", "Life Orientation", "life-orientation", "ZA compulsory life skills"],
];

const VERIFIED = ["human-physiology", "thermodynamics", "statistics-probability"];

export async function GET(req: NextRequest) {
  if (!guard(req)) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  const step = req.nextUrl.searchParams.get("step") || "status";
  const today = new Date();
  try {
    if (step === "status") {
      const [regions, boards, depts, topics, aligns] = await Promise.all([
        prisma.region.count(), prisma.curriculumBoard.count(), prisma.department.count(),
        prisma.topic.count({ where: { id: { startsWith: "master-" } } }),
        prisma.topicBoardAlignment.count(),
      ]);
      return NextResponse.json({ regions, boards, depts, masterTopics: topics, alignments: aligns });
    }
    if (step === "init") {
      for (const [name, iso, rtl] of REGIONS) {
        await prisma.region.upsert({ where: { isoCode: iso }, update: { name, rtlLanguage: rtl }, create: { name, isoCode: iso, rtlLanguage: rtl } });
      }
      const regionMap = new Map((await prisma.region.findMany()).map((r) => [r.isoCode, r.id]));
      for (const [iso, name] of BOARDS) {
        const id = `${iso}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        await prisma.curriculumBoard.upsert({
          where: { id }, update: { name, regionId: regionMap.get(iso)!, syllabusVersionYear: 2024, lastAuditedDate: today },
          create: { id, name, regionId: regionMap.get(iso)!, syllabusVersionYear: 2024, lastAuditedDate: today },
        });
      }
      const cbse = await prisma.curriculumBoard.findFirst({ where: { name: "CBSE" } });
      if (cbse) for (const [n, d] of [["Science Stream", "PCM/Bio focus"], ["Commerce Stream", "Accounts/Econ focus"], ["Humanities Stream", "History/PolSci focus"]] as const) {
        const id = `${cbse.id}-${n.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        await prisma.studyTrack.upsert({ where: { id }, update: { name: n }, create: { id, boardId: cbse.id, name: n, description: d } });
      }
      for (const [name, icon] of DEPARTMENTS) {
        await prisma.department.upsert({ where: { name }, update: { iconSlug: icon }, create: { name, iconSlug: icon } });
      }
      return NextResponse.json({ ok: true, step: "init" });
    }
    if (step === "topics") {
      const deptMap = new Map((await prisma.department.findMany()).map((d) => [d.name, d.id]));
      let n = 0;
      for (const [dept, title, slug, desc] of TOPICS) {
        const verified = VERIFIED.includes(slug);
        await prisma.topic.upsert({
          where: { id: `master-${slug}` },
          update: { title, description: desc, slug, departmentId: deptMap.get(dept)!, lastAuditedDate: verified ? today : null, needsVerification: !verified },
          create: { id: `master-${slug}`, domain: "highschool", title, description: desc, slug, departmentId: deptMap.get(dept)!, isPublished: true, lastAuditedDate: verified ? today : null, needsVerification: !verified },
        });
        n++;
      }
      return NextResponse.json({ ok: true, step: "topics", count: n });
    }
    if (step === "align") {
      const boards = await prisma.curriculumBoard.findMany({ select: { id: true } });
      let n = 0;
      for (const slug of VERIFIED) {
        const topic = await prisma.topic.findFirst({ where: { slug } });
        if (!topic) continue;
        for (const board of boards) {
          const existing = await prisma.topicBoardAlignment.findFirst({ where: { topicId: topic.id, boardId: board.id, trackId: null } });
          const note = slug === "human-physiology" ? "CORE UK A-Levels + SG H2 9744; all regions." : slug === "thermodynamics" ? "CORE Cambridge 9702 + SG H2 Physics; all regions." : "CORE IL Bagrut; all regions.";
          if (existing) await prisma.topicBoardAlignment.update({ where: { id: existing.id }, data: { tier: "core", verifiedDate: today, weightNotes: note } });
          else await prisma.topicBoardAlignment.create({ data: { topicId: topic.id, boardId: board.id, trackId: null, tier: "core", verifiedDate: today, weightNotes: note } });
          n++;
        }
      }
      return NextResponse.json({ ok: true, step: "align", count: n });
    }
    return NextResponse.json({ error: "Unknown step. Use status|init|topics|align" }, { status: 400 });
  } catch (e) {
    console.error("temp-run-seed failed", e);
    return NextResponse.json({ error: "Seed step failed — did you run the SQL migration in Supabase first?" }, { status: 500 });
  }
}
