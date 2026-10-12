import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Assessment content — Human Physiology I (PHS 101), cell & general physiology.
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
 * or distractor reasoning a physiologist should double-check.
 */

const COURSE_SLUG = "physiology-cell-and-general";

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
  // 1 — Homeostasis / negative feedback (easy)
  {
    slug: "phs101-negative-feedback-thermostat",
    concept: "homeostasis-negative-feedback",
    format: "sba",
    stem: "A healthy person's core temperature rises after vigorous exercise. Which mechanism illustrates negative feedback restoring it?",
    options: [
      "Sweating increases and cutaneous blood vessels dilate, transferring heat to the environment until temperature returns toward its set point",
      "Shivering begins and cutaneous blood vessels constrict, generating and conserving heat",
      "Core temperature continues to climb until the muscles fatigue and movement stops",
      "The hypothalamus raises its set point so the new temperature becomes the regulated target",
    ],
    correctAnswer: "Sweating increases and cutaneous blood vessels dilate, transferring heat to the environment until temperature returns toward its set point",
    explanation: "Negative feedback opposes a deviation from a set point. A rise in core temperature is detected by the hypothalamus, which drives heat-loss responses — sweating and cutaneous vasodilation — until temperature returns toward 37 degrees Celsius. Shivering and vasoconstriction are the cold-response limbs, which would worsen the deviation, and a healthy set point does not reset upward during exercise.",
    difficulty: "easy",
    marks: 5,
  },

  // 2 — Homeostasis (easy)
  {
    slug: "phs101-positive-feedback-definition",
    concept: "homeostasis-negative-feedback",
    format: "sba",
    stem: "Which feature distinguishes positive feedback from negative feedback in a physiological control system?",
    options: [
      "Positive feedback is always harmful, whereas negative feedback is always beneficial",
      "Positive feedback amplifies the initial change, moving the system further from its starting value, whereas negative feedback opposes the change",
      "Positive feedback uses hormones, whereas negative feedback uses neural signals only",
      "Positive feedback maintains a constant internal environment, whereas negative feedback allows it to drift",
    ],
    correctAnswer: "Positive feedback amplifies the initial change, moving the system further from its starting value, whereas negative feedback opposes the change",
    explanation: "The defining feature is the direction of the response, not the messenger. Positive feedback reinforces the stimulus — the classic example being oxytocin-driven uterine contraction intensifying as cervical stretch increases during labour. Negative feedback is the common homeostatic pattern that returns a variable toward its set point. Positive feedback is not inherently harmful; it is simply uncommon and usually must be terminated by an external event.",
    difficulty: "easy",
    marks: 5,
  },

  // 3 — Membrane transport (easy)
  {
    slug: "phs101-facilitated-diffusion-glucose",
    concept: "membrane-transport",
    format: "sba",
    stem: "Glucose crosses the membrane of a red blood cell via the GLUT1 transporter, down its concentration gradient, without using ATP. Which transport mechanism is this?",
    options: [
      "Primary active transport, because a carrier protein is required",
      "Facilitated diffusion, because a protein mediates movement down the gradient without metabolic energy",
      "Simple diffusion, because no metabolic energy is required",
      "Secondary active transport, because glucose movement is coupled to sodium movement",
    ],
    correctAnswer: "Facilitated diffusion, because a protein mediates movement down the gradient without metabolic energy",
    explanation: "Facilitated diffusion is protein-mediated, saturable, and driven solely by the electrochemical gradient — it requires no ATP. GLUT1 is a uniporter that fits this description. Simple diffusion also needs no ATP but passes directly through the lipid bilayer, which glucose's polarity forbids. Sodium-linked glucose uptake in the gut and kidney is secondary active transport, but the red cell GLUT1 transporter is not sodium-coupled.",
    difficulty: "easy",
    marks: 5,
  },

  // 4 — Membrane transport (medium)
  {
    slug: "phs101-na-k-atpase-stoichiometry",
    concept: "membrane-transport",
    format: "emq",
    stem: "A cell is treated with ouabain, which inhibits the sodium-potassium ATPase. What is the immediate consequence for the gradients maintained by that pump?",
    options: [
      "Sodium accumulates intracellularly and potassium accumulates extracellularly, because the pump moves 3 Na+ out and 2 K+ in per ATP",
      "Sodium accumulates extracellularly and potassium accumulates intracellularly, because the pump moves 3 Na+ in and 2 K+ out per ATP",
      "Both ions accumulate intracellularly, because the pump moves both into the cell",
      "No gradient changes, because the pump contributes nothing to the resting potential",
    ],
    correctAnswer: "Sodium accumulates intracellularly and potassium accumulates extracellularly, because the pump moves 3 Na+ out and 2 K+ in per ATP",
    explanation: "The sodium-potassium ATPase extrudes three sodium ions and imports two potassium ions per ATP hydrolysed, so inhibition lets sodium leak in and potassium leak out down their gradients, collapsing them over time. Because the cycle is electrogenic — three positive charges out for two in — the pump also contributes a few millivolts directly to the resting potential, though the gradient collapse is the dominant effect.",
    difficulty: "medium",
    marks: 5,
  },

  // 5 — Resting membrane potential (medium)
  {
    slug: "phs101-resting-potential-potassium",
    concept: "resting-membrane-potential",
    format: "sba",
    stem: "Why is the resting membrane potential of a neuron close to, but not equal to, the potassium equilibrium potential?",
    options: [
      "Because potassium is actively pumped out until the membrane potential exactly matches the potassium equilibrium potential",
      "Because the resting membrane is predominantly permeable to potassium, but a small sodium permeability and the electrogenic pump shift the potential slightly positive to the potassium value",
      "Because sodium and potassium contribute equally to the resting potential, averaging their equilibrium potentials",
      "Because chloride movement dominates the resting potential and potassium plays a negligible role",
    ],
    correctAnswer: "Because the resting membrane is predominantly permeable to potassium, but a small sodium permeability and the electrogenic pump shift the potential slightly positive to the potassium value",
    explanation: "At rest, leak potassium channels dominate the membrane's permeability, so the resting potential tracks the potassium equilibrium potential of about -90 mV. Two things pull it positive of that value: a small resting sodium permeability, whose equilibrium potential is about +60 mV, drags the membrane toward a weighted mean, and the electrogenic Na-K pump contributes a few millivolts. The result is a resting potential near -70 mV.",
    difficulty: "medium",
    marks: 5,
  },

  // 6 — Resting membrane potential (medium, numeric)
  {
    slug: "phs101-nernst-potassium-equality",
    concept: "resting-membrane-potential",
    format: "emq",
    stem: "The potassium equilibrium potential of a cell is -90 mV. If the membrane potential is experimentally clamped to exactly -90 mV, what is the net driving force on potassium?",
    options: [
      "Potassium still flows outward, because concentration gradient always dominates",
      "The net flux is zero, because the electrical force exactly balances the concentration gradient at that potential",
      "Potassium flows inward, because the negative membrane repels the cation",
      "The pump reverses direction to maintain the gradient",
    ],
    correctAnswer: "The net flux is zero, because the electrical force exactly balances the concentration gradient at that potential",
    explanation: "The equilibrium potential is by definition the membrane voltage at which the electrical and chemical driving forces on an ion cancel, giving zero net flux. At -90 mV potassium has no net movement, though individual ions still cross in both directions at equal rates. At any other voltage the ion moves down the resulting electrochemical gradient. The pump does not reverse; it continues to maintain the gradients that make the calculation possible.",
    difficulty: "medium",
    marks: 5,
    needsCheck: true,
  },

  // 7 — Action potential (hard)
  {
    slug: "phs101-refractory-period-sodium",
    concept: "action-potential",
    format: "sba",
    stem: "Why can a second action potential not be triggered in a nerve fibre immediately after the first, no matter how strong the stimulus?",
    options: [
      "Because the membrane is hyperpolarised and no sodium channel can open at negative potentials",
      "Because most voltage-gated sodium channels are inactivated and cannot reopen until the membrane repolarises, which defines the absolute refractory period",
      "Because potassium channels are closed and the membrane cannot depolarise further",
      "Because the sodium-potassium pump has not yet restored ion gradients, so no sodium is available to carry current",
    ],
    correctAnswer: "Because most voltage-gated sodium channels are inactivated and cannot reopen until the membrane repolarises, which defines the absolute refractory period",
    explanation: "The absolute refractory period results from sodium channel inactivation. After opening, each channel's inactivation gate closes and cannot be reset until the membrane returns to a negative potential. With no activatable sodium channels available, no stimulus can raise the membrane to threshold. Pump-mediated gradient restoration does occur, but on a slower timescale and is not what sets the absolute refractory period.",
    difficulty: "hard",
    marks: 5,
  },

  // 8 — Action potential / conduction (hard)
  {
    slug: "phs101-saltatory-conduction-myelin",
    concept: "action-potential",
    format: "emq",
    stem: "Demyelination in a peripheral nerve most directly impairs conduction by which mechanism?",
    options: [
      "It destroys the neuronal cell body, so no action potential can be generated",
      "It removes the myelin that insulates internodes, abolishing saltatory conduction so the action potential must propagate continuously and loses amplitude over distance",
      "It increases the membrane capacitance, which speeds conduction but exhausts the sodium channels",
      "It blocks the sodium-potassium pump directly at the nodes of Ranvier",
    ],
    correctAnswer: "It removes the myelin that insulates internodes, abolishing saltatory conduction so the action potential must propagate continuously and loses amplitude over distance",
    explanation: "Myelin wraps internodes, raising membrane resistance and lowering capacitance so that current generated at one node flows with little loss to the next, regenerating at the nodes of Ranvier — saltatory conduction. Without myelin, current leaks across the internodal membrane and the depolarisation reaching the next node falls below threshold, causing conduction block or severe slowing. The cell body and the pump are not the primary site of the failure.",
    difficulty: "hard",
    marks: 5,
  },

  // 9 — Neuromuscular junction (hard)
  {
    slug: "phs101-nmj-acetylcholine-receptor",
    concept: "neuromuscular-junction",
    format: "sba",
    stem: "Which statement correctly describes the postsynaptic event at the neuromuscular junction following a motor nerve action potential?",
    options: [
      "Voltage-gated calcium channels on the muscle fibre open in response to the arriving action potential",
      "Acetylcholine binds nicotinic receptors, opening non-selective cation channels that depolarise the end plate toward threshold",
      "Acetylcholine binds muscarinic receptors, which via a second messenger hyperpolarises the end plate",
      "Acetylcholinesterase releases acetylcholine into the synaptic cleft in a calcium-dependent step",
    ],
    correctAnswer: "Acetylcholine binds nicotinic receptors, opening non-selective cation channels that depolarise the end plate toward threshold",
    explanation: "The motor nerve terminal's voltage-gated calcium channels drive vesicle fusion and acetylcholine release. The postsynaptic event is acetylcholine binding to nicotinic ACh receptors — ligand-gated, non-selective cation channels whose opening depolarises the end plate. This end-plate potential activates nearby voltage-gated sodium channels to fire the muscle action potential. Muscarinic receptors are not present at the adult neuromuscular junction, and acetylcholinesterase degrades rather than releases transmitter.",
    difficulty: "hard",
    marks: 5,
  },

  // 10 — Clinical correlation: myasthenia gravis (medium)
  {
    slug: "phs101-myasthenia-gravis-antibody",
    concept: "clinical-myasthenia-channelopathies",
    format: "emq",
    stem: "A patient with myasthenia gravis reports worsening diplopia as the day progresses, and a neostigmine infusion produces marked improvement. Which mechanism best explains both findings?",
    options: [
      "Antibodies block acetylcholine release from the presynaptic terminal, and neostigmine enhances that release",
      "Antibodies reduce the number of functional postsynaptic acetylcholine receptors, and neostigmine inhibits acetylcholinesterase so more transmitter survives to stimulate the remaining receptors",
      "Antibodies destroy the muscle sodium channels, and neostigmine directly opens them",
      "Antibodies demyelinate the motor nerve, and neostigmine restores the myelin",
    ],
    correctAnswer: "Antibodies reduce the number of functional postsynaptic acetylcholine receptors, and neostigmine inhibits acetylcholinesterase so more transmitter survives to stimulate the remaining receptors",
    explanation: "Myasthenia gravis is an antibody-mediated attack on postsynaptic nicotinic acetylcholine receptors, reducing the safety margin for neuromuscular transmission. Repeated use fatigues the remaining receptors, which is why symptoms worsen through the day. Neostigmine is an acetylcholinesterase inhibitor, so it raises synaptic acetylcholine concentration and improves transmission at the reduced receptor population. The defect is postsynaptic, not presynaptic, demyelinating, or a channelopathy.",
    difficulty: "medium",
    marks: 5,
  },
];

/**
 * Idempotent: safe to run repeatedly. Upserts on the item slug.
 */
export async function seedAssessmentPhysiology(): Promise<void> {
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

  console.log(`✓ PHS 101 assessment items: ${count} items (5 marks each)`);
}

// CLI usage: npx ts-node prisma/seed-assessment-physiology.ts
if (process.argv[1] && process.argv[1].includes("seed-assessment-physiology")) {
  seedAssessmentPhysiology()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
