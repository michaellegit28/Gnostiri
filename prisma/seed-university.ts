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

// Pre-clinical year one (100 level), first semester — mapped to WFME global baseline codes.

// Authored concept-check SBAs — one substantive 1-mark item per concept,
// replacing the former generic placeholders. Authored by A1 (2026-10-12) at
// pre-clinical level, cross-checked against the course's 5-mark scenario items
// in seed-assessment-*.ts; awaiting the medical-educator pass for 'verified'.
const AUTHORED_CONCEPT_CHECKS: Record<string, { stem: string; options: string[]; correctAnswer: string; explanation: string }> = {
  "anatomical-position-planes": {
    stem: "Why do anatomists describe every structure as if the body stood in one standard pose — and what is that pose?",
    options: [
      "Standing erect, head and eyes facing forward, arms at the sides with palms and feet directed forward — the agreed reference that makes all descriptions unambiguous.",
      "Lying face down, arms above the head, because the prone position is the most relaxed.",
      "Seated upright with hands on the knees, because that is how patients are examined.",
      "Any pose the individual finds natural, because left and right change with the person.",
    ],
    correctAnswer: "Standing erect, head and eyes facing forward, arms at the sides with palms and feet directed forward — the agreed reference that makes all descriptions unambiguous.",
    explanation: "The anatomical position is the universal convention: with the body in it, 'anterior', 'lateral' and every plane (sagittal, coronal, transverse) have one fixed meaning for every patient and every examiner.",
  },
  "upper-limb-skeleton": {
    stem: "Which set correctly lists the bones of the upper limb in proximal-to-distal order?",
    options: [
      "Clavicle and scapula, humerus, radius and ulna, carpals, metacarpals, phalanges.",
      "Clavicle and scapula, humerus, tibia and fibula, tarsals, metatarsals, phalanges.",
      "Scapula only, humerus, one forearm bone, carpals, metatarsals, phalanges.",
      "Clavicle, femur, patella, tibia, tarsals, metatarsals.",
    ],
    correctAnswer: "Clavicle and scapula, humerus, radius and ulna, carpals, metacarpals, phalanges.",
    explanation: "The pectoral girdle (clavicle + scapula) carries the arm (humerus), which carries the two-bone forearm (radius and ulna) and then the hand. Tibia, fibula, femur, patella and tarsals belong to the lower limb.",
  },
  "pectoral-muscles": {
    stem: "Which statement correctly separates the actions of pectoralis major and pectoralis minor?",
    options: [
      "Pectoralis major moves the arm (flexion, adduction, medial rotation) from its ribs-to-humerus pull, while pectoralis minor pulls the scapula forward and downward onto the chest wall.",
      "Both muscles move the arm, and the difference is only their size.",
      "Pectoralis major rotates the scapula and pectoralis minor abducts the arm.",
      "Neither moves a joint — they both tense the chest skin.",
    ],
    correctAnswer: "Pectoralis major moves the arm (flexion, adduction, medial rotation) from its ribs-to-humerus pull, while pectoralis minor pulls the scapula forward and downward onto the chest wall.",
    explanation: "Insertion decides the action: major inserts on the humerus so it moves the arm; minor inserts on the coracoid process of the scapula so it moves (and stabilises) the scapula.",
  },
  "brachial-plexus": {
    stem: "Which spinal nerve roots form the brachial plexus?",
    options: [
      "C5, C6, C7, C8 and T1.",
      "C1, C2, C3 and C4.",
      "C5 through T5, including five thoracic roots.",
      "Only C6, C7 and C8.",
    ],
    correctAnswer: "C5, C6, C7, C8 and T1.",
    explanation: "The five roots C5-T1 join into upper, middle and lower trunks, which split into divisions, recombine as the lateral, posterior and medial cords, and finish as the branches to the limb — the root-trunk-division-cord-branch order the course follows.",
  },
  "axilla-contents": {
    stem: "A surgeon enters the axilla. Which structures must she be aware of among its contents?",
    options: [
      "The axillary artery, the axillary vein, the cords of the brachial plexus, lymph nodes and fat.",
      "Only the axillary artery — nothing else of importance lies there.",
      "The heart and the great vessels.",
      "The intercostal nerves running along the ribs.",
    ],
    correctAnswer: "The axillary artery, the axillary vein, the cords of the brachial plexus, lymph nodes and fat.",
    explanation: "The axilla is the gateway to the upper limb: artery, vein and the three cords of the plexus travel through it wrapped in its sheath, together with the axillary lymph nodes that drain the breast and chest wall — the reason axillary node status matters in breast cancer.",
  },
  "thoracic-wall": {
    stem: "Where does a typical rib articulate with the vertebral column?",
    options: [
      "Its head with the demifacets of its own vertebra and the one above, and its tubercle with the transverse process of its own vertebra.",
      "Its head only with the body of a single vertebra.",
      "Its shaft directly with the spinous processes.",
      "It does not articulate with vertebrae — only with the sternum.",
    ],
    correctAnswer: "Its head with the demifacets of its own vertebra and the one above, and its tubercle with the transverse process of its own vertebra.",
    explanation: "Two synovial joints per rib: the costovertebral (head, sharing the disc above via demifacets) and the costotransverse (tubercle) — together they let the rib swing up and out in breathing.",
  },
  "mediastinum": {
    stem: "Which plane divides the mediastinum into superior and inferior parts, and what landmark marks it in the living patient?",
    options: [
      "A horizontal plane through the sternal angle (the manubriosternal joint), level with the T4/T5 intervertebral disc.",
      "A vertical plane through the xiphoid process.",
      "A coronal plane through the midclavicular lines.",
      "The diaphragm itself, with no surface landmark.",
    ],
    correctAnswer: "A horizontal plane through the sternal angle (the manubriosternal joint), level with the T4/T5 intervertebral disc.",
    explanation: "The sternal angle is the palpable landmark of the transverse thoracic plane: above it lies the superior mediastinum (aortic arch, trachea, oesophagus); below, the anterior, middle and posterior compartments — the map the widened-mediastinum item builds on.",
  },
  "clinical-pneumothorax-nerve-injuries": {
    stem: "In a tension pneumothorax, why does the patient deteriorate so fast?",
    options: [
      "Air enters the pleural cavity through a one-way wound but cannot escape, so rising pressure collapses the lung, shifts the mediastinum and blocks venous return.",
      "Air slowly leaks in over days and the lung collapses by scarring.",
      "Blood fills the pleural cavity and clots around the heart.",
      "The injury severs only the phrenic nerve and breathing stops.",
    ],
    correctAnswer: "Air enters the pleural cavity through a one-way wound but cannot escape, so rising pressure collapses the lung, shifts the mediastinum and blocks venous return.",
    explanation: "The one-way valve is the danger: each breath adds air, pressure pushes the mediastinum across, kinking the great veins — it is the obstructive-shock emergency decompressed on the spot, not at imaging.",
  },
  "homeostasis-negative-feedback": {
    stem: "Which sequence correctly describes a negative-feedback loop, using body temperature as the example?",
    options: [
      "A sensor detects the deviation, a control centre compares it to the set point, and effectors reverse the deviation — skin thermoreceptors, the hypothalamus, then sweating or shivering.",
      "A hormone amplifies the deviation further and further until the variable is used up.",
      "The variable drifts freely and the body repairs the damage afterwards.",
      "The control centre acts once, permanently resetting the set point.",
    ],
    correctAnswer: "A sensor detects the deviation, a control centre compares it to the set point, and effectors reverse the deviation — skin thermoreceptors, the hypothalamus, then sweating or shivering.",
    explanation: "Negative feedback opposes the change that triggered it: sensor, control centre, effector, in that order. Amplifying loops (like childbirth) are positive feedback — the exception, not the rule.",
  },
  "membrane-transport": {
    stem: "Which of these transport processes directly consumes ATP?",
    options: [
      "The sodium-potassium pump moving Na+ out of and K+ into the cell against their gradients.",
      "Simple diffusion of oxygen across the lipid bilayer.",
      "Osmosis of water across a semipermeable membrane.",
      "Facilitated diffusion of glucose through a GLUT carrier.",
    ],
    correctAnswer: "The sodium-potassium pump moving Na+ out of and K+ into the cell against their gradients.",
    explanation: "Only active transport against a gradient needs ATP directly. Diffusion, osmosis and facilitated carriers all ride the concentration gradient — the pump is what builds and holds that gradient in the first place.",
  },
  "resting-membrane-potential": {
    stem: "What sets a neuron's resting membrane potential at about -70 mV?",
    options: [
      "Potassium leaking out through open K+ channels, with the membrane far more permeable to K+ than Na+ at rest.",
      "Sodium flooding in through open Na+ channels, making the inside positive.",
      "Chloride pumping out until the inside is negative.",
      "Nothing — the membrane is electrically neutral at rest.",
    ],
    correctAnswer: "Potassium leaking out through open K+ channels, with the membrane far more permeable to K+ than Na+ at rest.",
    explanation: "Leak K+ channels dominate at rest; K+ diffuses out, leaving fixed negative charges behind, until the electrical pull balances the chemical gradient — the Nernst balance the course's potassium item examines.",
  },
  "action-potential": {
    stem: "What causes the rising (depolarising) phase of an action potential?",
    options: [
      "Rapid sodium influx through voltage-gated Na+ channels that open at threshold.",
      "Potassium efflux through voltage-gated K+ channels.",
      "Chloride influx hyperpolarising the membrane.",
      "Slow leakage with no gated channels involved.",
    ],
    correctAnswer: "Rapid sodium influx through voltage-gated Na+ channels that open at threshold.",
    explanation: "Threshold opens Na+ channels; Na+ rushes in down its gradient and the inside swings toward +30 mV. K+ efflux then repolarises — the phase order is depolarise (Na+ in), repolarise (K+ out), hyperpolarise (K+ slow to close).",
  },
  "neuromuscular-junction": {
    stem: "What is the correct order of events at the neuromuscular junction?",
    options: [
      "Ca2+ entry into the nerve terminal triggers acetylcholine release into the cleft; ACh opens receptors on the motor end plate; an action potential fires in the muscle.",
      "The nerve fires electricity directly into the muscle with no chemical step.",
      "The muscle releases acetylcholine to tell the nerve to fire.",
      "Norepinephrine crosses the cleft and opens chloride channels.",
    ],
    correctAnswer: "Ca2+ entry into the nerve terminal triggers acetylcholine release into the cleft; ACh opens receptors on the motor end plate; an action potential fires in the muscle.",
    explanation: "Chemical transmission, not electrical: calcium in, ACh out, cleft crossing, end-plate receptor opening, end-plate potential, muscle action potential — every link in the chain is a drug target, from botulinum to curare.",
  },
  "clinical-myasthenia-channelopathies": {
    stem: "Why does muscle weakness in myasthenia gravis worsen with repeated use of a muscle?",
    options: [
      "Antibodies destroy acetylcholine receptors, so with each contraction fewer receptors remain available and the end-plate potential fails to reach threshold.",
      "Antibodies attack presynaptic calcium channels, as in Lambert-Eaton syndrome.",
      "There is excess acetylcholine in the cleft, overstimulating the muscle to fatigue.",
      "The motor nerves themselves degenerate, as in a peripheral neuropathy.",
    ],
    correctAnswer: "Antibodies destroy acetylcholine receptors, so with each contraction fewer receptors remain available and the end-plate potential fails to reach threshold.",
    explanation: "Myasthenia is an anti-ACh-receptor disease: transmission fails progressively through a working day. Lambert-Eaton (anti-Ca2+-channel) improves with use; ACh excess would cause cramping, not fatigable weakness.",
  },
  "water-ph-buffering": {
    stem: "What does a physiological buffer actually do?",
    options: [
      "A weak acid and its conjugate base absorb added H+ or OH-, resisting pH change in either direction.",
      "It holds the pH at exactly 7.0 whatever is added.",
      "It destroys any acid or base added to the blood.",
      "It permanently converts strong acids into strong bases.",
    ],
    correctAnswer: "A weak acid and its conjugate base absorb added H+ or OH-, resisting pH change in either direction.",
    explanation: "The pair (H2CO3 / HCO3- in blood) works in both directions: the base limb soaks up acid, the acid limb soaks up base. That is why arterial pH barely moves despite constant metabolic acid production — the Henderson-Hasselbalch item quantifies it.",
  },
  "amino-acids-peptide-bond": {
    stem: "Where exactly does the peptide bond form when two amino acids join?",
    options: [
      "Between the carboxyl (-COOH) group of one amino acid and the amino (-NH2) group of the next, releasing a molecule of water.",
      "Between the two amino (-NH2) groups of both amino acids.",
      "Between the R groups, which carry the side-chain chemistry.",
      "Between the carboxyl groups of both amino acids.",
    ],
    correctAnswer: "Between the carboxyl (-COOH) group of one amino acid and the amino (-NH2) group of the next, releasing a molecule of water.",
    explanation: "Condensation: carboxyl + amino, minus water, gives -CO-NH-. The N-terminus and C-terminus of the chain follow from this direction, and the R groups stay free to build the higher structures.",
  },
  "protein-structure-hierarchy": {
    stem: "What mainly stabilises a protein's tertiary (3D) structure?",
    options: [
      "Interactions between amino acid side chains (R groups): hydrophobic clustering, hydrogen bonds, ionic pairs and disulfide bridges.",
      "The sequence of amino acids alone, with no folding involved.",
      "Hydrogen bonds between backbone atoms only, as in an alpha helix.",
      "Only the chaperone proteins that surround it.",
    ],
    correctAnswer: "Interactions between amino acid side chains (R groups): hydrophobic clustering, hydrogen bonds, ionic pairs and disulfide bridges.",
    explanation: "Primary is the sequence, secondary (helix, sheet) uses backbone H-bonds, but tertiary is R-group chemistry: hydrophobics bury themselves, cysteines cross-link, and the shape that emerges is the function.",
  },
  "enzyme-kinetics": {
    stem: "An enzyme-catalysed reaction is running at Vmax. What is happening at the molecular level?",
    options: [
      "Every active site is occupied by substrate, so the rate depends only on how fast each enzyme molecule converts its bound substrate.",
      "The enzyme is being denatured by the high substrate concentration.",
      "The substrate has been used up and the reaction is ending.",
      "The inhibitor has been destroyed and the reaction runs away.",
    ],
    correctAnswer: "Every active site is occupied by substrate, so the rate depends only on how fast each enzyme molecule converts its bound substrate.",
    explanation: "Vmax is saturation: adding more substrate cannot help because there are no free active sites. Vmax = kcat x [E], which is why it rises with enzyme concentration — the mirror image of Km, which reports affinity (the Km item).",
  },
  "clinical-enzyme-assays": {
    stem: "Why do plasma enzyme and protein assays help after a suspected heart attack?",
    options: [
      "Damaged heart muscle cells spill their intracellular contents into the blood, so rising troponin or CK-MB reports the occurrence, timing and extent of injury.",
      "The blood manufactures new enzymes to repair the heart.",
      "They measure how much oxygen the heart is consuming.",
      "They detect the bacterial infection that caused the attack.",
    ],
    correctAnswer: "Damaged heart muscle cells spill their intracellular contents into the blood, so rising troponin or CK-MB reports the occurrence, timing and extent of injury.",
    explanation: "Dead cells leak: each marker rises and clears on its own time curve (CK-MB within hours, troponin over days), so serial assays time the infarct — and organ-specific isoforms point to the tissue, the diagnostic principle behind every enzyme assay in the course.",
  },
};

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
      description: "The flagship medical programme — pre-clinical foundations through clinical rotations, mapped to the WFME global baseline with regional accreditation overlays (GMC, LCME, MDCN, NUC).",
      iconSlug: "stethoscope",
      orderIndex: 0,
      isPublished: true,
    },
  });
  console.log("✓ MBBS programme");

  // 4. Curriculum standards — international framework.
  // WFME is the global baseline for medical education (recognized by WHO);
  // regional authorities overlay it so a student's transcript maps anywhere.
  const authorities = [
    { authority: "World Federation for Medical Education", editionYear: 2024, officialUrl: "https://wfme.org" },
    { authority: "General Medical Council", editionYear: 2024, officialUrl: "https://www.gmc-uk.org" },
    { authority: "Liaison Committee on Medical Education", editionYear: 2024, officialUrl: "https://lcme.org" },
    { authority: "Medical and Dental Council of Nigeria", editionYear: 2024, officialUrl: "https://mdcn.gov.ng" },
    { authority: "National Universities Commission", editionYear: 2024, officialUrl: "https://www.nuc.edu.ng" },
  ];
  const standard = await prisma.curriculumStandard.upsert({
    where: { programmeId_authority_editionYear: { programmeId: programme.id, authority: "World Federation for Medical Education", editionYear: 2024 } },
    update: {},
    create: {
      programmeId: programme.id,
      authority: "World Federation for Medical Education",
      editionYear: 2024,
      officialUrl: "https://wfme.org",
      lastAuditedDate: new Date(),
    },
  });
  for (const a of authorities.slice(1)) {
    await prisma.curriculumStandard.upsert({
      where: { programmeId_authority_editionYear: { programmeId: programme.id, authority: a.authority, editionYear: a.editionYear } },
      update: {},
      create: { programmeId: programme.id, authority: a.authority, editionYear: a.editionYear, officialUrl: a.officialUrl, lastAuditedDate: new Date() },
    });
  }

  // 5. Pre-clinical courses with concept DAG + curriculum alignment
  let conceptCount = 0;
  let edgeCount = 0;
  let itemCount = 0;
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

    // Assessment items — one SBA per concept, blueprint-anchored so an exam
    // drawn from this course always covers its concept DAG.
    for (let i = 0; i < c.concepts.length; i++) {
      const k = c.concepts[i];
      const conceptId = slugToId.get(k.slug)!;
      const itemSlug = `${c.slug}--${k.slug}--sba`;
      const authored = AUTHORED_CONCEPT_CHECKS[k.slug];
      if (!authored) throw new Error(`No authored concept check for ${k.slug} of ${c.code} — placeholders are retired.`);
      // Deterministic rotation seeded by the item slug: kills the correct-
      // answer-first bias; correctAnswer is option TEXT so it stays valid.
      const rawOpts = authored.options;
      const rot = i % rawOpts.length; // uniform, index-stable spread
      const shuffledOpts = rawOpts.slice(rot).concat(rawOpts.slice(0, rot));
      if (!shuffledOpts.includes(authored.correctAnswer)) {
        throw new Error(`correctAnswer not present in options for ${itemSlug} — answer/key drift`);
      }
      await prisma.assessmentItem.upsert({
        where: { slug: itemSlug },
        update: {
          conceptId, orderIndex: i,
          stem: authored.stem,
          options: shuffledOpts as never,
          correctAnswer: authored.correctAnswer,
          explanation: authored.explanation,
          reviewStatus: "draft",
          needsCheck: false,
        },
        create: {
          slug: itemSlug,
          courseId: course.id,
          conceptId,
          format: "sba",
          stem: authored.stem,
          options: shuffledOpts as never,
          correctAnswer: authored.correctAnswer,
          explanation: authored.explanation,
          marks: 1,
          negativeMarks: 0.25,
          orderIndex: i,
          isPublished: true,
          difficulty: k.blooms === "Remember" ? "easy" : k.blooms === "Evaluate" ? "hard" : "medium",
          reviewStatus: "draft",
          needsCheck: false,
        },
      });
      itemCount++;
    }
  }
  console.log(`✓ ${PRECLINICAL_COURSES.length} pre-clinical courses, ${conceptCount} concepts, ${edgeCount} prerequisite edges, ${itemCount} assessment items`);

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
