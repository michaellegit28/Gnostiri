import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Concept summaries — 2-sentence summaries for the 19 pre-clinical ConceptNodes.
 *
 * seed-university.ts creates every ConceptNode with summary null, so the
 * concept spine and concept map render titles and structure but no prose.
 * This script fills those summaries with a concise orientation for each
 * concept: what it is, and why it matters clinically.
 *
 * Idempotent: upserts on the existing ConceptNode slugs, setting summary in
 * the update branch only. Re-running refreshes prose without touching any
 * other field (bloomsLevel, estMinutes, orderIndex, moduleId all stay as
 * seed-university set them).
 */

const COURSES = ["gross-anatomy-i", "physiology-cell-and-general", "medical-biochemistry-i"];

interface SummarySeed {
  slug: string;
  summary: string;
}

const SUMMARIES: SummarySeed[] = [
  // --- Gross Anatomy I (ANA 101) ---
  {
    slug: "anatomical-position-planes",
    summary: "The anatomical position is the standard reference stance — standing erect, palms facing forward — from which every directional term is defined. Mastering it is what makes descriptions like 'medial to the humerus' unambiguous, because without a shared reference plane no anatomical description can be interpreted consistently.",
  },
  {
    slug: "upper-limb-skeleton",
    summary: "The upper limb hangs from the pectoral girdle, which connects to the trunk only at the sternoclavicular joint, giving the arm its extraordinary mobility at the cost of bony stability. Understanding which bones articulate where is the foundation for examining shoulder injuries and understanding why the upper limb is the most commonly dislocated major joint.",
  },
  {
    slug: "pectoral-muscles",
    summary: "Pectoralis major adducts and medially rotates the arm, while the deeper pectoralis minor anchors the scapula to the ribs and acts as an accessory inspiratory muscle. Their relations matter clinically because the cords of the brachial plexus and the axillary artery run deep to pectoralis minor, dividing the axilla into the parts surgeons navigate.",
  },
  {
    slug: "brachial-plexus",
    summary: "The brachial plexus is the network of nerves that carries the entire motor and sensory supply of the upper limb, formed by the ventral rami of C5 to T1. Its predictable segmental organisation is what lets you localise a nerve lesion from a bedside examination, and why upper-trunk and lower-trunk injuries produce recognisable, opposite clinical pictures.",
  },
  {
    slug: "axilla-contents",
    summary: "The axilla is a pyramidal space between the arm and the thoracic wall whose contents — the axillary artery and vein, the brachial plexus cords, and the axillary lymph nodes — are the reason it is the surgical gateway to the upper limb. Its lymphatic drainage of the breast and anterior thoracic wall is the anatomical basis of cancer staging and axillary clearance.",
  },
  {
    slug: "thoracic-wall",
    summary: "The thoracic wall is a flexible cage of ribs, costal cartilages, and intercostal muscles that protects the viscera while expanding and contracting to drive ventilation. Each intercostal space carries its vein, artery and nerve in a groove on the inferior surface of the rib above, the single fact that makes chest-drain insertion safe when angled correctly.",
  },
  {
    slug: "mediastinum",
    summary: "The mediastinum is the central compartment of the thorax between the two pleural cavities, containing the heart, great vessels, trachea, oesophagus and thymus. Its subdivisions are how a clinician reads a chest radiograph and localises disease, because each compartment has a characteristic set of structures and therefore a characteristic set of pathologies.",
  },
  {
    slug: "clinical-pneumothorax-nerve-injuries",
    summary: "This concept joins the thoracic wall and the brachial plexus at their clinical endpoint: how breached anatomy produces recognisable disease. A pneumothorax is air in the pleural space collapsing the lung, and nerve injuries of the plexus trace back to which trunk or cord was torn — both are exams of structural understanding, not memorisation.",
  },

  // --- Human Physiology I (PHS 101) ---
  {
    slug: "homeostasis-negative-feedback",
    summary: "Homeostasis is the maintenance of a stable internal environment, achieved overwhelmingly by negative feedback loops that oppose any deviation from a set point. Understanding the loop structure — sensor, integrator, effector — is the framework that makes every later physiological system intelligible rather than a list of unrelated facts.",
  },
  {
    slug: "membrane-transport",
    summary: "Every cell controls its internal composition by selectively moving substances across its membrane, by simple diffusion, facilitated diffusion, or active transport. The distinction is not academic: whether a drug, ion or nutrient crosses passively or requires a carrier determines how cells are targeted by treatments and how gradients are maintained.",
  },
  {
    slug: "resting-membrane-potential",
    summary: "The resting membrane potential is the voltage difference across a cell's membrane at rest, set chiefly by potassium's concentration gradient and the membrane's selective permeability to it. It is the stored energy that makes excitable tissue possible, because signalling is simply the controlled, transient collapse of this potential.",
  },
  {
    slug: "action-potential",
    summary: "An action potential is the regenerative all-or-nothing electrical impulse that carries information along excitable membranes, driven by the sequential opening of voltage-gated sodium and potassium channels. Its threshold behaviour and refractory period explain not just how nerves fire, but why conduction is unidirectional and how demyelination blocks it.",
  },
  {
    slug: "neuromuscular-junction",
    summary: "The neuromuscular junction is the chemical relay converting a motor nerve impulse into muscle contraction, using acetylcholine on nicotinic receptors. It is clinically pivotal because it is a discrete, accessible synapse where diseases like myasthenia gravis act, and where drugs from anaesthetics to nerve agents produce their effects.",
  },
  {
    slug: "clinical-myasthenia-channelopathies",
    summary: "Myasthenia gravis and the channelopathies are diseases where the molecules of excitation fail — antibodies strip receptors, or mutant ion channels misfire. Studied together they prove the clinical value of the preceding physiology: each symptom can be predicted from which step in the excitation pathway has broken down.",
  },

  // --- Medical Biochemistry I (MCB 101) ---
  {
    slug: "water-ph-buffering",
    summary: "Water's polarity and its autoionisation set the stage for all of biochemistry, governing how molecules dissolve and how pH is regulated. The bicarbonate buffer and the Henderson-Hasselbalch relationship explain how the body defends its narrow physiological pH, and why respiratory and renal failure produce acid-base disturbances with distinct signatures.",
  },
  {
    slug: "amino-acids-peptide-bond",
    summary: "Amino acids are the building blocks of every protein, joined by peptide bonds formed between an amino group and a carboxyl group with the loss of water. Their side-chain chemistry is what gives proteins their diversity of function, and the essential amino acids are those whose carbon skeletons humans cannot synthesise, making them a dietary requirement.",
  },
  {
    slug: "protein-structure-hierarchy",
    summary: "Protein function follows directly from a hierarchy of structure — sequence, local folds like the alpha helix, three-dimensional shape, and subunit assembly. This hierarchy is predictive medicine: misfolding diseases, denaturation, and the design of drugs that fit a binding pocket all reason about proteins in these same terms.",
  },
  {
    slug: "enzyme-kinetics",
    summary: "Enzymes accelerate reactions by lowering activation energy, and Michaelis-Menten kinetics describes how their rate depends on substrate concentration through the parameters Km and Vmax. These parameters are how clinicians reason about drug inhibition, enzyme deficiency, and diagnostic assays, because they quantify affinity and capacity in a measurable way.",
  },
  {
    slug: "clinical-enzyme-assays",
    summary: "Measuring enzyme and protein levels in blood is medicine's window onto tissue damage, because intracellular molecules leak from injured cells into the circulation. Choosing the right marker is a question of specificity — cardiac troponin over creatine kinase for myocardial injury — and illustrates how biochemistry directly shapes everyday diagnosis.",
  },
];

/**
 * Idempotent: safe to run repeatedly. Sets summary on existing concepts.
 */
export async function seedConceptSummaries(): Promise<void> {
  const courses = await prisma.course.findMany({
    where: { domain: "university", slug: { in: COURSES } },
    select: { id: true, slug: true },
  });
  if (courses.length === 0) throw new Error(`No courses found for ${COURSES.join(", ")}. Run prisma/seed-university.ts first.`);

  const courseIds = new Set(courses.map((c) => c.id));
  const bySlug = new Map(SUMMARIES.map((s) => [s.slug, s.summary]));

  const concepts = await prisma.conceptNode.findMany({
    where: { courseId: { in: Array.from(courseIds) } },
    select: { id: true, slug: true, courseId: true },
  });

  let updated = 0;
  let skipped = 0;
  for (const concept of concepts) {
    const summary = bySlug.get(concept.slug);
    if (!summary) {
      skipped++;
      continue;
    }
    await prisma.conceptNode.update({
      where: { id: concept.id },
      data: { summary },
    });
    updated++;
  }

  const missing = SUMMARIES.filter((s) => !concepts.some((c) => c.slug === s.slug));
  if (missing.length > 0) {
    console.warn(`⚠ ${missing.length} summaries had no matching concept: ${missing.map((m) => m.slug).join(", ")}`);
  }

  console.log(`✓ Concept summaries: ${updated} updated, ${skipped} concepts already had prose or no summary provided`);
}

// CLI usage: npx ts-node prisma/seed-concept-summaries.ts
if (process.argv[1] && process.argv[1].includes("seed-concept-summaries")) {
  seedConceptSummaries()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
