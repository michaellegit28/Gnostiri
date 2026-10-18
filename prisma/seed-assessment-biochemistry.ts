import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Assessment content — Medical Biochemistry I (MCB 101), cell chemistry & proteins.
 *
 * 10 original EMQ/SBA items at 5 marks each, tagged to the ConceptNodes that
 * already exist for this course (see prisma/seed-university.ts). Difficulty
 * spread: 3 easy, 4 medium, 3 hard.
 *
 * Idempotent: upserts on the item slug. Re-running updates content in place
 * and never duplicates rows.
 *
 * Governance: every item is reviewStatus "needs-human-review" — none are
 * marked verified by the seeder. needsCheck marks items whose numeric values
 * or distractor reasoning a biochemist should double-check.
 */

const COURSE_SLUG = "medical-biochemistry-i";

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
  // 1 — Water & pH (easy)
  {
    slug: "mcb101-henderson-hasselbalch-bicarbonate",
    concept: "water-ph-buffering",
    format: "sba",
    stem: "A patient hyperventilates and blows off carbon dioxide. Which immediate consequence does the bicarbonate buffer system produce?",
    options: [
      "Blood pH falls, because losing CO2 drives the equilibrium toward carbonic acid",
      "Blood pH rises, because removing CO2 pulls the bicarbonate-carbonic acid equilibrium toward CO2 and water, consuming hydrogen ions",
      "Blood pH is unchanged, because the buffer resists any change completely",
      "Blood pH rises, because hyperventilation directly generates new bicarbonate",
    ],
    correctAnswer: "Blood pH rises, because removing CO2 pulls the bicarbonate-carbonic acid equilibrium toward CO2 and water, consuming hydrogen ions",
    explanation: "The bicarbonate buffer interconverts CO2, water, carbonic acid, bicarbonate, and hydrogen ions. Removing CO2 by hyperventilation shifts the equilibrium to the left, consuming free hydrogen ions and raising pH — respiratory alkalosis. A buffer resists but does not abolish change, so pH does move. No new bicarbonate is generated on this timescale; the kidneys regulate that over hours to days.",
    difficulty: "easy",
    marks: 5,
  },

  // 2 — Water & pH (easy)
  {
    slug: "mcb101-ph-neutral-definition",
    concept: "water-ph-buffering",
    format: "sba",
    stem: "At 37 degrees Celsius, the ion product of water (Kw) is about 2.4 x 10^-14. What is the pH of pure water at body temperature, and what does 'neutral' mean there?",
    options: [
      "pH 7.0, because neutral always means pH 7 at any temperature",
      "pH about 6.8, because neutral means hydrogen and hydroxide ion concentrations are equal, and the autoionisation of water is temperature-dependent",
      "pH about 7.4, because physiological pH defines neutrality",
      "pH 14, because water is fully dissociated at body temperature",
    ],
    correctAnswer: "pH about 6.8, because neutral means hydrogen and hydroxide ion concentrations are equal, and the autoionisation of water is temperature-dependent",
    explanation: "Neutral means equal hydrogen and hydroxide concentrations. Water autoionisation is endothermic, so Kw rises with temperature (about 2.4 x 10^-14 at 37 degrees Celsius, versus 1.0 x 10^-14 at 25) and the neutral pH falls below 7 — [H+] = [OH-] = the square root of Kw, about 1.6 x 10^-7 mol/L, giving pH roughly 6.8 at body temperature. The value pH 7 is neutral only at 25 degrees Celsius, and physiological pH 7.4 is slightly alkaline relative to neutrality at body temperature, not the definition of it.",
    difficulty: "easy",
    marks: 5,
    // Verified by A1 content review 2026-10-12: Kw(37C) ≈ 2.4e-14 →
    // [H+] ≈ 1.6e-7 → pH ≈ 6.81. (Original draft conflated Kw with [H+].)
    needsCheck: false,
  },

  // 3 — Water & pH (medium)
  {
    slug: "mcb101-henderson-equation-ratio",
    concept: "water-ph-buffering",
    format: "emq",
    stem: "Using the Henderson-Hasselbalch equation with pKa 6.1 for the bicarbonate system, what is the normal arterial bicarbonate to dissolved CO2 ratio that yields pH 7.4?",
    options: [
      "About 1 to 1, because a buffer works best when acid and base forms are equal",
      "About 20 to 1, because pH 7.4 is 1.3 units above the pKa and the ratio is 10 raised to that difference",
      "About 100 to 1, because the buffer must overwhelmingly favour bicarbonate to work at all",
      "The ratio is irrelevant, because dissolved CO2 does not participate in the equilibrium",
    ],
    correctAnswer: "About 20 to 1, because pH 7.4 is 1.3 units above the pKa and the ratio is 10 raised to that difference",
    explanation: "Henderson-Hasselbalch gives pH = pKa + log of the base to acid ratio. With pH 7.4 and pKa 6.1 the difference is 1.3, and 10 to the power 1.3 is about 20, so bicarbonate exceeds dissolved CO2 by roughly twenty to one. A 1 to 1 ratio would give pH equal to pKa, which is why intracellular and blood pH sit well above 6.1 only because of this large ratio.",
    difficulty: "medium",
    marks: 5,
    needsCheck: false, // A1 review 2026-10-12: 10^(7.4-6.1) = 10^1.3 ~= 20:1 — arithmetic check,
  },

  // 4 — Amino acids (easy)
  {
    slug: "mcb101-peptide-bond-formation",
    concept: "amino-acids-peptide-bond",
    format: "sba",
    stem: "Which statement correctly describes the formation of a peptide bond between two amino acids?",
    options: [
      "The carboxyl group of one amino acid joins the side chain of the next, releasing water",
      "The amino group of one amino acid condenses with the carboxyl group of the next, eliminating water and forming an amide linkage",
      "The two amino groups join directly, releasing ammonia",
      "The bond forms by addition of water across the two carboxyl groups",
    ],
    correctAnswer: "The amino group of one amino acid condenses with the carboxyl group of the next, eliminating water and forming an amide linkage",
    explanation: "A peptide bond is an amide linkage formed when the alpha-amino group of one amino acid attacks the carboxyl carbon of another, eliminating a molecule of water. The bond always links the backbone amino and carboxyl groups, never side chains. Hydrolysis — the reverse reaction — adds water across the bond, which is what digestive proteases catalyse.",
    difficulty: "easy",
    marks: 5,
  },

  // 5 — Amino acids (medium)
  {
    slug: "mcb101-essential-amino-acids",
    concept: "amino-acids-peptide-bond",
    format: "sba",
    stem: "Why are the nine essential amino acids termed 'essential' in human nutrition?",
    options: [
      "Because they are chemically essential for forming peptide bonds, whereas the others cannot",
      "Because humans cannot synthesise their carbon skeletons in adequate amounts, so they must be supplied by the diet",
      "Because they are the only ones coded for by the genetic code",
      "Because they are broken down more slowly than the others, making them essential for energy",
    ],
    correctAnswer: "Because humans cannot synthesise their carbon skeletons in adequate amounts, so they must be supplied by the diet",
    explanation: "Essentiality is about biosynthesis, not chemistry or coding. Humans lack the complete metabolic pathways to build the carbon skeletons of the nine essential amino acids, so dietary intake is required. All twenty standard amino acids are encoded in the genetic code and all can form peptide bonds, and essentiality has nothing to do with the rate of catabolism.",
    difficulty: "medium",
    marks: 5,
  },

  // 6 — Protein structure (medium)
  {
    slug: "mcb101-secondary-structure-hydrogen",
    concept: "protein-structure-hierarchy",
    format: "sba",
    stem: "Which interaction is the primary stabiliser of an alpha helix?",
    options: [
      "Hydrogen bonds between the backbone carbonyl oxygen of one residue and the backbone amide hydrogen four residues later",
      "Disulphide bridges linking the side chains of two cysteine residues",
      "Hydrophobic interactions burying non-polar side chains away from water",
      "Ionic bonds between oppositely charged side chains on adjacent turns",
    ],
    correctAnswer: "Hydrogen bonds between the backbone carbonyl oxygen of one residue and the backbone amide hydrogen four residues later",
    explanation: "The alpha helix is stabilised by backbone hydrogen bonds, in which the carbonyl oxygen of residue i bonds the amide hydrogen of residue i+4, running roughly parallel to the helix axis. Disulphide bridges are a tertiary or quaternary feature, and hydrophobic and ionic side-chain interactions stabilise tertiary structure rather than the repeating helical fold itself.",
    difficulty: "medium",
    marks: 5,
  },

  // 7 — Protein structure (hard)
  {
    slug: "mcb101-denaturation-tertiary-loss",
    concept: "protein-structure-hierarchy",
    format: "emq",
    stem: "A globular enzyme is heated modestly and loses catalytic activity, but circular dichroism shows its alpha-helical content is largely unchanged. Which level of structure was primarily disrupted?",
    options: [
      "Primary structure, because the sequence was cleaved by the heat",
      "Secondary structure, because the helices must have unravelled for activity to fall",
      "Tertiary structure, because the three-dimensional arrangement of secondary elements was lost while the helices themselves survived",
      "Quaternary structure only, because a single-chain enzyme has no higher order to lose",
    ],
    correctAnswer: "Tertiary structure, because the three-dimensional arrangement of secondary elements was lost while the helices themselves survived",
    explanation: "Activity depends on the precise spatial arrangement of catalytic residues, which is tertiary structure. If helical content is preserved on circular dichroism, secondary structure survived while the packing of those helices — the tertiary fold — was disrupted. Primary structure is peptide-bond sequence and is not cleaved by modest heat. A single-chain enzyme still has tertiary structure worth losing.",
    difficulty: "hard",
    marks: 5,
  },

  // 8 — Enzyme kinetics (hard)
  {
    slug: "mcb101-km-substrate-affinity",
    concept: "enzyme-kinetics",
    format: "sba",
    stem: "An enzyme is engineered so that its Km for substrate doubles, with Vmax unchanged. Which statement is correct?",
    options: [
      "The enzyme's affinity for the substrate has halved, and the reaction rate at half-saturating substrate now requires twice the substrate concentration",
      "The enzyme's catalytic efficiency has doubled, because Km always rises with efficiency",
      "The enzyme can now reach a higher maximum rate at high substrate",
      "Km has no bearing on substrate affinity, so nothing about the enzyme has changed",
    ],
    correctAnswer: "The enzyme's affinity for the substrate has halved, and the reaction rate at half-saturating substrate now requires twice the substrate concentration",
    explanation: "Km is the substrate concentration at half Vmax, and for a simple Michaelis-Menten scheme it inversely reflects substrate affinity. Doubling Km means twice as much substrate is needed to reach half-maximal rate, signifying reduced affinity. Vmax is unchanged, so the maximum rate at saturating substrate is unchanged, and catalytic efficiency — the Vmax over Km ratio — has actually fallen, not risen.",
    difficulty: "hard",
    marks: 5,
    needsCheck: false, // A1 review 2026-10-12: Km inversely tracks affinity; [S] at half-Vmax = Km — definition,
  },

  // 9 — Enzyme kinetics (hard)
  {
    slug: "mcb101-competitive-inhibition-km",
    concept: "enzyme-kinetics",
    format: "emq",
    stem: "A competitive inhibitor is added to an enzyme reaction and its effect is studied. What happens to the apparent Km and Vmax on a Michaelis-Menten plot?",
    options: [
      "Km rises and Vmax is unchanged, because the inhibitor competes for the active site and can be outcompeted by enough substrate",
      "Km is unchanged and Vmax falls, because the inhibitor removes enzyme from the system irreversibly",
      "Both Km and Vmax fall, because the inhibitor stabilises the enzyme-substrate complex",
      "Km falls and Vmax rises, because the inhibitor increases substrate affinity",
    ],
    correctAnswer: "Km rises and Vmax is unchanged, because the inhibitor competes for the active site and can be outcompeted by enough substrate",
    explanation: "A competitive inhibitor binds the free enzyme's active site, so more substrate is required to reach half-maximal velocity — apparent Km rises. Because substrate at sufficiently high concentration displaces the inhibitor entirely, Vmax is unchanged. A falling Vmax with unchanged Km is the signature of non-competitive inhibition, where the inhibitor acts at a separate site and cannot be outcompeted.",
    difficulty: "hard",
    marks: 5,
  },

  // 10 — Clinical correlation: enzyme assays (medium)
  {
    slug: "mcb101-cardiac-troponin-specificity",
    concept: "clinical-enzyme-assays",
    format: "emq",
    stem: "A patient with suspected myocardial infarction has an elevated troponin but a normal total creatine kinase. Which property of troponin I makes it the preferred diagnostic marker in this scenario?",
    options: [
      "It rises earlier and is cleared faster than creatine kinase, making it more sensitive in the first hour",
      "It is cardiac-specific, so elevated levels indicate myocardial injury with far less confounding from skeletal muscle damage than creatine kinase",
      "It is an intracellular enzyme that leaks only from necrotic cells, whereas creatine kinase requires active transport",
      "It is more stable at room temperature, so assay precision is higher",
    ],
    correctAnswer: "It is cardiac-specific, so elevated levels indicate myocardial injury with far less confounding from skeletal muscle damage than creatine kinase",
    explanation: "Cardiac troponin I and T have isoforms essentially unique to myocardium, so elevation points specifically to cardiac injury. Total creatine kinase is dominated by the skeletal-muscle MM isoform, so it rises after intramuscular injection, exercise, or trauma and can mislead. Troponin is also more sensitive, but the decisive advantage in this scenario — normal CK with raised troponin — is specificity.",
    difficulty: "medium",
    marks: 5,
  },
];

/**
 * Idempotent: safe to run repeatedly. Upserts on the item slug.
 */
export async function seedAssessmentBiochemistry(): Promise<void> {
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

  console.log(`✓ MCB 101 assessment items: ${count} items (5 marks each)`);
}

// CLI usage: npx ts-node prisma/seed-assessment-biochemistry.ts
if (process.argv[1] && process.argv[1].includes("seed-assessment-biochemistry")) {
  seedAssessmentBiochemistry()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
