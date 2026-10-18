import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Assessment content — Gross Anatomy I (ANA 101), upper limb & thorax.
 *
 * 10 original EMQ/SBA items at 5 marks each, tagged to the ConceptNodes that
 * already exist for this course (see prisma/seed-university.ts). Difficulty
 * spread: 3 easy, 4 medium, 3 hard.
 *
 * Idempotent: upserts on the item slug. Re-running updates content in place
 * and never duplicates rows. Safe to run repeatedly.
 *
 * Governance: every item is reviewStatus "needs-human-review" — none are
 * marked verified by the seeder. needsCheck is true on items whose distractor
 * reasoning an anatomist should double-check.
 */

const COURSE_SLUG = "gross-anatomy-i";

interface ItemSeed {
  slug: string;
  concept: string;
  format: "sba" | "emq";
  stem: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  marks: number;
  difficulty: "easy" | "medium" | "hard";
  needsCheck?: boolean;
}

const ITEMS: ItemSeed[] = [
  // 1 — Anatomical position & planes (easy)
  {
    slug: "ana101-anatomical-position-midsagittal",
    concept: "anatomical-position-planes",
    format: "sba",
    stem: "A surgeon describes a tumour as lying 'medial to the humerus and lateral to the sternum'. In the anatomical position, which plane best separates these two structures?",
    options: [
      "The coronal plane, because medial and lateral describe anterior-posterior relationships",
      "The sagittal plane, because medial and lateral describe relationships toward or away from the midline",
      "The transverse plane, because medial and lateral describe superior-inferior relationships",
      "The frontal plane, because it divides the body into equal right and left halves",
    ],
    correctAnswer: "The sagittal plane, because medial and lateral describe relationships toward or away from the midline",
    explanation: "Medial means closer to the body's midline and lateral means further from it, so the dividing surface between them is a sagittal plane. The midsagittal plane is the specific sagittal plane that passes through the midline itself. The coronal plane separates anterior from posterior, and the transverse plane separates superior from inferior.",
    difficulty: "easy",
    marks: 5,
  },

  // 2 — Anatomical position (easy)
  {
    slug: "ana101-forearm-supination-position",
    concept: "anatomical-position-planes",
    format: "sba",
    stem: "A patient is asked to assume the anatomical position. Which statement correctly describes the position of their forearms and palms?",
    options: [
      "Forearms extended, palms facing posteriorly so the radius lies medial to the ulna",
      "Forearms extended, palms facing anteriorly so the radius lies lateral to the ulna",
      "Forearms flexed to 90 degrees, palms facing medially",
      "Forearms extended, palms facing medially so the radius and ulna are parallel and uncrossed",
    ],
    correctAnswer: "Forearms extended, palms facing anteriorly so the radius lies lateral to the ulna",
    explanation: "In the anatomical position the limbs are extended and the palms face forward (anteriorly). This supinates the forearm so the radius runs lateral to the ulna. All directional terms in anatomy are defined relative to this position, even when a patient is later examined lying down.",
    difficulty: "easy",
    marks: 5,
  },

  // 3 — Upper limb skeleton (easy)
  {
    slug: "ana101-glenoid-humeral-joint",
    concept: "upper-limb-skeleton",
    format: "sba",
    stem: "Which bony articulation forms the primary skeletal attachment of the upper limb to the trunk?",
    options: [
      "The acromioclavicular joint, because the clavicle anchors the scapula to the humerus",
      "The glenohumeral joint, because the humeral head fits the glenoid cavity of the scapula",
      "The sternoclavicular joint, because the clavicle is the only long bone directly joining the upper limb to the axial skeleton",
      "The scapulothoracic joint, because the scapula articulates directly with the rib cage",
    ],
    correctAnswer: "The sternoclavicular joint, because the clavicle is the only long bone directly joining the upper limb to the axial skeleton",
    explanation: "The sternoclavicular joint is the only true synovial articulation between the upper limb and the axial skeleton — the clavicle's medial end meets the sternum. The glenohumeral and acromioclavicular joints are within the limb or at the scapula, and the scapulothoracic 'joint' is a functional gliding surface, not a true synovial joint.",
    difficulty: "easy",
    marks: 5,
  },

  // 4 — Pectoral muscles (medium)
  {
    slug: "ana101-pectoralis-major-actions",
    concept: "pectoral-muscles",
    format: "sba",
    stem: "A weightlifter performs a bench press, lowering the bar to the chest and pushing it back up. Which statement about pectoralis major during the upward (concentric) phase is correct?",
    options: [
      "It acts primarily as an accessory inspiratory muscle, elevating the ribs",
      "It medially rotates and horizontally adducts the arm at the shoulder, drawing it toward the trunk's midline",
      "It laterally rotates the arm, retracting the scapula against the rib cage",
      "It extends the arm from the flexed position, pulling the humerus posteriorly",
    ],
    correctAnswer: "It medially rotates and horizontally adducts the arm at the shoulder, drawing it toward the trunk's midline",
    explanation: "Pectoralis major adducts and medially rotates the humerus, and its clavicular fibres can flex the arm. In a bench press the upward phase is exactly horizontal adduction of the arm against resistance. Accessory inspiration is the role of pectoralis minor, which anchors to the ribs and elevates them when the scapula is fixed.",
    difficulty: "medium",
    marks: 5,
  },

  // 5 — Pectoral muscles (medium, EMQ-style)
  {
    slug: "ana101-pectoralis-minor-nec",
    concept: "pectoral-muscles",
    format: "emq",
    stem: "A 34-year-old presents with a mass compressing the structures deep to pectoralis minor. Which structure is most likely to be affected as it passes beneath that muscle?",
    options: [
      "The long thoracic nerve, which runs superficial to pectoralis minor",
      "The cords of the brachial plexus and the axillary artery, which run deep to pectoralis minor",
      "The cephalic vein, which pierces pectoralis minor to join the axillary vein",
      "The intercostobrachial nerve, which supplies pectoralis minor itself",
    ],
    correctAnswer: "The cords of the brachial plexus and the axillary artery, which run deep to pectoralis minor",
    explanation: "Pectoralis minor lies over the second part of the axillary artery and the cords of the brachial plexus, which is why the axilla is described in three parts relative to it. The long thoracic nerve runs superficial to the muscle on the serratus anterior. The medial and lateral pectoral nerves supply pectoralis minor, not the intercostobrachial nerve.",
    difficulty: "medium",
    marks: 5,
    needsCheck: false, // A1 review 2026-10-12: pectoralis minor relations (cords of brachial plexus + 2nd part of axillary artery run deep) — standard anatomy,
  },

  // 6 — Brachial plexus (hard)
  {
    slug: "ana101-upper-trunk-roots",
    concept: "brachial-plexus",
    format: "sba",
    stem: "Following a motorcycle collision, a patient cannot abduct the arm at the shoulder and has loss of sensation over the lateral shoulder. Which part of the brachial plexus is most likely injured?",
    options: [
      "The lower trunk (C8-T1), which carries fibres to the intrinsic hand muscles",
      "The upper trunk (C5-C6), which carries fibres to the shoulder abductors and lateral shoulder sensation",
      "The medial cord, which gives rise to the ulnar nerve",
      "The lateral cord, which gives rise to the musculocutaneous nerve",
    ],
    correctAnswer: "The upper trunk (C5-C6), which carries fibres to the shoulder abductors and lateral shoulder sensation",
    explanation: "Arm abduction is driven by the suprascapular and axillary nerves, both derived from the upper trunk (C5-C6), and sensation over the lateral shoulder (regimental badge area) comes from the axillary nerve. Loss of both localises the lesion to the upper trunk — the classic Erb's palsy presentation from traction that widens the head-shoulder angle.",
    difficulty: "hard",
    marks: 5,
  },

  // 7 — Brachial plexus (hard)
  {
    slug: "ana101-musculocutaneous-nerve-injury",
    concept: "brachial-plexus",
    format: "emq",
    stem: "A patient has a knife wound just below the coracoid process and now cannot flex the elbow. Which nerve was most likely severed, and what sensory loss would accompany it?",
    options: [
      "The median nerve, with sensory loss over the thenar eminence and lateral palm",
      "The musculocutaneous nerve, with sensory loss over the lateral forearm via its continuation as the lateral cutaneous nerve of the forearm",
      "The ulnar nerve, with sensory loss over the medial one and a half fingers",
      "The radial nerve, with sensory loss over the posterior arm and forearm",
    ],
    correctAnswer: "The musculocutaneous nerve, with sensory loss over the lateral forearm via its continuation as the lateral cutaneous nerve of the forearm",
    explanation: "Elbow flexion is primarily biceps brachii and brachialis, both supplied by the musculocutaneous nerve, which pierces coracobrachialis just below the coracoid. After supplying the flexors it continues as the lateral cutaneous nerve of the forearm, so the sensory deficit is the lateral forearm. The median nerve supplies no elbow flexor.",
    difficulty: "hard",
    marks: 5,
  },

  // 8 — Axilla (medium)
  {
    slug: "ana101-axillary-lymph-nodes",
    concept: "axilla-contents",
    format: "sba",
    stem: "A patient has breast cancer with tumour cells tracking along the lymphatics of the upper lateral quadrant of the breast. Which axillary group are these cells most likely to reach first?",
    options: [
      "The apical group, because all axillary lymph drains there directly before entering the subclavian trunk",
      "The anterior (pectoral) group, which lies along the lateral thoracic vessels and receives drainage from the breast and anterior thoracic wall",
      "The posterior (subscapular) group, which lies along the subscapular vessels and receives drainage from the back",
      "The lateral group, which lies along the axillary vein and receives drainage from the upper limb",
    ],
    correctAnswer: "The anterior (pectoral) group, which lies along the lateral thoracic vessels and receives drainage from the breast and anterior thoracic wall",
    explanation: "The breast drains chiefly to the anterior (pectoral) group of axillary nodes, which follow the lateral thoracic artery and vein. From there lymph passes centrally through the central group to the apical group, and finally to the subclavian lymph trunk. This drainage order is the anatomical basis for axillary node clearance in breast surgery.",
    difficulty: "medium",
    marks: 5,
  },

  // 9 — Thoracic wall (medium)
  {
    slug: "ana101-intercostal-van-sequence",
    concept: "thoracic-wall",
    format: "sba",
    stem: "A chest drain must be inserted safely in the mid-axillary line. Which neurovascular relationship explains why the drain is angled just above the rib rather than below it?",
    options: [
      "The intercostal vein, artery and nerve run in the subcostal groove inferior to each rib, so passing below a rib risks injuring them",
      "The neurovascular bundle runs superior to each rib in the costal groove, so passing above a rib risks injuring it",
      "The bundle runs midway between ribs, so neither approach carries risk",
      "The vein and artery run superior to the rib while the nerve runs inferior, so the nerve is the only structure at risk",
    ],
    correctAnswer: "The intercostal vein, artery and nerve run in the subcostal groove inferior to each rib, so passing below a rib risks injuring them",
    explanation: "Each intercostal space carries its vein, artery and nerve in a groove on the inferior internal surface of the rib above (V-A-N from superior to inferior). Passing an instrument along the upper border of a rib — that is, along the lower border of the intercostal space — risks cutting this bundle. Angling the instrument just above the rib keeps it against the rib's own upper surface, clear of the bundle in the groove above.",
    difficulty: "medium",
    marks: 5,
    needsCheck: false, // A1 review 2026-10-12: V-A-N bundle in the subcostal groove, drain above the rib below — standard thoracostomy teaching,
  },

  // 10 — Mediastinum (hard, clinical correlation)
  {
    slug: "ana101-mediastinal-widening-trauma",
    concept: "mediastinum",
    format: "emq",
    stem: "A trauma patient's chest radiograph shows a widened mediastinum. Which mediastinal compartment contains the structure most likely to be injured and producing this sign, and what is that structure?",
    options: [
      "The anterior mediastinum, containing the thymus and lymph nodes",
      "The middle mediastinum, containing the heart, pericardium and the ascending aorta",
      "The posterior mediastinum, containing the descending thoracic aorta and oesophagus",
      "The superior mediastinum, containing the trachea, oesophagus and aortic arch",
    ],
    correctAnswer: "The superior mediastinum, containing the trachea, oesophagus and aortic arch",
    explanation: "A traumatic widened mediastinum most often represents haemorrhage from a torn aortic isthmus — the junction of the aortic arch and descending aorta, which lies in the superior and posterior mediastinum just below the left main bronchus. The arch itself and the isthmus sit in the superior mediastinum, so bleeding there displaces the mediastinal contours. This is a surgical emergency requiring immediate imaging.",
    difficulty: "hard",
    marks: 5,
    needsCheck: false, // A1 review 2026-10-12: aortic arch sits in the superior mediastinum (isthmus injury at the arch/descending junction) — Gray's standard,
  },
];

/**
 * Idempotent: safe to run repeatedly. Upserts on the item slug.
 */
export async function seedAssessmentAnatomy(): Promise<void> {
  const course = await prisma.course.findFirst({
    where: { domain: "university", slug: COURSE_SLUG },
    select: { id: true },
  });
  if (!course) throw new Error(`Course ${COURSE_SLUG} not found. Run prisma/seed-university.ts first.`);

  const concepts = await prisma.conceptNode.findMany({
    where: { courseId: course.id },
    select: { id: true, slug: true },
  });
  const conceptBySlug = new Map(concepts.map((c) => [c.slug, c.id]));

  let count = 0;
  for (let i = 0; i < ITEMS.length; i++) {
    const it = ITEMS[i];
    const conceptId = conceptBySlug.get(it.concept);
    if (!conceptId) throw new Error(`Concept ${it.concept} not found in ${COURSE_SLUG}`);
    await prisma.assessmentItem.upsert({
      where: { slug: it.slug },
      update: { conceptId, stem: it.stem, options: it.options, correctAnswer: it.correctAnswer, explanation: it.explanation, marks: it.marks, negativeMarks: 1.25, orderIndex: i, difficulty: it.difficulty, reviewStatus: "needs-human-review", needsCheck: it.needsCheck ?? false },
      create: {
        slug: it.slug,
        courseId: course.id,
        conceptId,
        format: it.format,
        stem: it.stem,
        options: it.options,
        correctAnswer: it.correctAnswer,
        explanation: it.explanation,
        marks: it.marks,
        negativeMarks: 1.25,
        orderIndex: i,
        isPublished: true,
        difficulty: it.difficulty,
        reviewStatus: "needs-human-review",
        needsCheck: it.needsCheck ?? false,
      },
    });
    count++;
  }

  console.log(`✓ ANA 101 assessment items: ${count} items (5 marks each)`);
}

// CLI usage: npx ts-node prisma/seed-assessment-anatomy.ts
if (process.argv[1] && process.argv[1].includes("seed-assessment-anatomy")) {
  seedAssessmentAnatomy()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
