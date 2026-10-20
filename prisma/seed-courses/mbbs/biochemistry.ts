import { prisma, seedMbbsCourse, type LessonSeed, type SbaSeed, type SubjectSeed } from "./spine";

/**
 * BCHM 101 — Medical Biochemistry.
 *
 * Module 1 ("Cell chemistry & proteins") is authored in full: 5 lessons in the
 * pilot-report format with one SBA item per concept. The facts are the standard
 * pre-clinical ones — the water compartments, Henderson-Hasselbalch applied to
 * the bicarbonate buffer, the peptide bond, the four levels of protein
 * structure, and Michaelis-Menten kinetics — and every value quoted is a
 * textbook figure (plasma osmolarity about 300 mOsm/L, the bicarbonate buffer
 * at pKa 6.1 with a 20:1 base-to-acid ratio).
 *
 * Modules 2-5 (carbohydrates and lipids, metabolism, molecular biology,
 * clinical biochemistry) ship as a real concept spine and prerequisite DAG
 * with tracked-placeholder lessons (needsCheck true).
 *
 * The course row created by prisma/seed-university.ts is adopted rather than
 * duplicated, so the authored 5-mark EMQ items in
 * prisma/seed-assessment-biochemistry.ts stay attached to it.
 */

const COURSE_SLUG = "medical-biochemistry-i";

const MODULES = [
  { slug: "cell-chemistry-proteins", title: "M1 — Cell chemistry & proteins" },
  { slug: "carbohydrates-lipids-membranes", title: "M2 — Carbohydrates, lipids & membranes" },
  { slug: "metabolism-energy", title: "M3 — Metabolism & energy" },
  { slug: "molecular-biology-genetics", title: "M4 — Molecular biology & genetics" },
  { slug: "clinical-biochemistry-nutrition", title: "M5 — Clinical biochemistry & nutrition" },
];

// ---------------------------------------------------------------------------
// LESSON 1 — Water, pH and buffering in the body (fully authored)
// ---------------------------------------------------------------------------
function lesson1() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: state how much water the body contains and how it is divided between the intracellular and extracellular compartments; define the unit of osmotic concentration and give the normal plasma value; explain what a physiological buffer does and why it does not hold pH still; apply the Henderson-Hasselbalch equation to the bicarbonate buffer and check the arithmetic of normal blood pH; distinguish chemical from physiological buffering; and predict which organs are responsible for the two limbs of the acid-base response.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "None. This is the first lesson of the biochemistry course.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Buffer",
        text: "A mixture of a weak acid and its conjugate base that resists changes in pH, because the base limb soaks up added acid and the acid limb soaks up added base.",
      },
      {
        type: "paragraph",
        text: "Life happens in water, and it happens within about a tenth of a pH unit. The enzymes in a cell stop working if the hydrogen ion concentration shifts too far — which is remarkable, because metabolism produces acid continuously: a normal day's metabolism generates on the order of fifteen to twenty thousand millimoles of acid. The blood pH moves only a little. That stability is not a chemical trick but a partnership between three organs: buffers resist in the first instance, the lungs blow off carbonic acid as carbon dioxide, and the kidneys regenerate the base and excrete the excess acid.",
      },

      { type: "heading", level: 2, text: "The water compartments" },
      {
        type: "paragraph",
        text: "Water is the medium, so knowing where it lives is the starting point. Roughly sixty per cent of an adult's body weight is water, and it is concentrated inside the cells: about two-thirds of the total is intracellular, one-third extracellular, and the extracellular share is itself split between the fluid between cells and the fluid in the blood.",
      },
      {
        type: "table",
        headers: ["Compartment", "Volume in a 70 kg adult", "What it is", "What crosses freely"],
        rows: [
          ["Total body water", "About 42 litres", "About 60 per cent of body weight", "Water moves freely between all compartments"],
          ["Intracellular fluid", "About 28 litres", "Fluid inside the cells", "Water crosses the cell membrane, but not ions and not large molecules"],
          ["Extracellular fluid", "About 14 litres", "Interstitial fluid (about 11 L) plus plasma (about 3 L)", "Water crosses the capillary wall; it is restricted by proteins, which stay in the plasma"],
          ["Blood volume", "About 5 litres", "Plasma plus the red cells", "Only at the capillary wall, selectively"],
        ],
      },
      {
        type: "paragraph",
        text: "Two practical consequences follow. First, plasma volume is small: five litres carries everything the tissues need, which is why losing two litres of blood is dangerous and why intravenous fluid has to go into the plasma to be useful. Second, the proportions differ between people: adipose tissue holds less water than muscle, so the same body weight in a very lean man and in an obese man contains different amounts of it, and the elderly hold less again. That is why fluid prescription is calculated on body weight and clinical condition rather than on a single universal figure.",
      },

      { type: "heading", level: 2, text: "What a buffer actually does" },
      {
        type: "paragraph",
        text: "Add a strong acid to water and every hydrogen ion you add stays in the water: the pH falls sharply. Add the same acid to a buffer and much of the hydrogen is removed, because the buffer's base limb binds it and converts it into the weak-acid form. Add a strong base instead, and the buffer's acid limb neutralises it, converting into the weak-base form. Either way, the pH changes far less than it would in pure water.",
      },
      {
        type: "table",
        headers: ["Buffer pair", "Where it acts", "Relative importance"],
        rows: [
          ["Carbonic acid / bicarbonate (H2CO3 / HCO3-)", "Extracellular: plasma", "The most important extracellular buffer, because its acid limb is volatile and can be exhaled"],
          ["Haemoglobin", "Inside red cells and in plasma", "The most important buffer of the blood in total terms, because there is so much of it"],
          ["Plasma proteins", "Plasma", "Moderate, through the imidazole groups of histidine"],
          ["Dihydrogen phosphate / monohydrogen phosphate", "Intracellular fluid and urine", "The most important intracellular buffer, and the one that makes urine acidifiable"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "A buffer does not hold the pH still and does not destroy acid — it converts it. The acid is still there; it is just in the weak form, and it must eventually be excreted. Buffers buy time, not immunity.",
      },

      { type: "heading", level: 2, text: "Worked example: Henderson-Hasselbalch on blood" },
      {
        type: "paragraph",
        text: "The Henderson-Hasselbalch equation describes any buffer system: pH equals the pKa of the weak acid plus the logarithm of the ratio of base to acid concentrations. For the bicarbonate system the pKa is 6.1, and the concentration of bicarbonate in arterial blood is about 24 milliequivalents per litre against a dissolved carbonic acid of about 1.2.",
      },
      {
        type: "paragraph",
        text: "Put those numbers in: 6.1 + log(24 / 1.2) = 6.1 + log(20), and log(20) is 1.3. The answer is 7.4 — exactly the arterial pH. Two features of that calculation are worth noticing, because they explain everything else about acid-base physiology. The ratio is twenty to one: the system is deliberately loaded towards the base form, so that a normal day's acid load can be absorbed. And the pKa is 6.1, far from the pH of 7.4, which would make a flask-based buffer nearly useless at this pH — but the body does not behave like a flask.",
      },
      {
        type: "paragraph",
        text: "The reason is the open system. The carbonic acid limb is in equilibrium with dissolved carbon dioxide, which the lungs exhale, and the bicarbonate limb is regenerated by the kidney. Add acid and two things happen: bicarbonate falls by a small amount, and the lungs breathe faster and blow off carbon dioxide, reducing the acid limb. Add base, and the lungs retain carbon dioxide to make more of the acid limb. A closed flask could do neither, which is why physiological buffering is far more effective than the chemical buffer alone.",
      },
      {
        type: "question",
        prompt: "Why is arterial pH 7.4 rather than the pKa of the bicarbonate buffer, 6.1?",
        answer: "Because in a living, open system the ratio of base to acid is held at about twenty to one by the lungs and kidneys, and the pH is whatever that ratio gives — 6.1 + log(20) = 7.4. A buffer only defends a pH near its pKa when it is a closed flask.",
        explanation: "The distinction between a closed and an open buffer is the single most useful fact in acid-base physiology: it is why the body can survive with a buffer loaded far from its pKa.",
      },

      { type: "heading", level: 2, text: "Clinical correlation" },
      {
        type: "paragraph",
        text: "Every acid-base disorder is a disturbance of one limb of this system, and the compensation is always the other two. In diabetic ketoacidosis, acid accumulates rapidly: the bicarbonate limb is consumed, the pH falls, and the patient breathes deep and fast to blow off carbon dioxide — Kussmaul breathing — because the lungs are trying to raise the pH by driving down the acid limb. In chronic lung disease the opposite is true: carbon dioxide accumulates, the acid limb rises, and the kidney is left as the only regulator, so bicarbonate rises as it regenerates base. Respiratory failure is therefore a renal problem eventually, and renal failure becomes a respiratory one, because the two limbs of one system are shared between two organs.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the buffer holds the pH at exactly 7.0 whatever is added. A buffer resists change over a range, it does not pin the value. Blood at 7.4 is the set point that the respiratory and renal controllers are defending, and both can be overridden.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing the bicarbonate pair with the phosphate pair's roles. Bicarbonate is the extracellular and plasma buffer; the phosphate pair is the intracellular buffer and the one that makes urine acid. Both are acid/base pairs; they live in different compartments.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Thinking that because the pKa of carbonic acid is 6.1, the bicarbonate system is ineffective at pH 7.4. In a closed system it would be. In the body the lungs and kidneys keep the limbs in a ratio that the pKa does not need to predict.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What does a physiological buffer actually do?",
        answer: "A weak acid and its conjugate base absorb added H+ or OH-, resisting pH change in either direction.",
        explanation: "The pair (H2CO3 / HCO3- in blood) works in both directions: the base limb soaks up acid, the acid limb soaks up base. That is why arterial pH barely moves despite constant metabolic acid production — the Henderson-Hasselbalch item quantifies it.",
      },
      {
        type: "question",
        prompt: "Approximately how much of an adult's body weight is water, and how is it divided?",
        answer: "About sixty per cent, of which roughly two-thirds is intracellular and one-third extracellular; the extracellular third is mostly interstitial fluid, with about three litres of it as plasma.",
        explanation: "The distinction matters clinically: a given volume of intravenous fluid reaches the plasma compartment directly, while water burden is judged against total body water.",
      },
      {
        type: "question",
        prompt: "In diabetic ketoacidosis, why does the patient breathe deeply and rapidly?",
        answer: "Because acid has accumulated and consumed bicarbonate; breathing harder blows off carbon dioxide, reducing the carbonic acid limb of the buffer pair, which raises the pH.",
        explanation: "This is Kussmaul breathing — the respiratory compensation for a metabolic acidosis, and the fastest of the three limbs of the acid-base response.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "What does a buffer do when a strong acid is added to it?",
        options: [
          "It holds the pH completely unchanged",
          "Its base limb binds the added H+, converting it into the weak-acid form, so the pH falls far less than it would in water",
          "It destroys the acid chemically",
          "It releases H+ to match the acid",
        ],
        correctIndex: 1,
        explanation: "A buffer converts and absorbs; it does not annihilate, and it does not hold the value exactly. The acid is still present, in the weak form, to be excreted later.",
      },
      {
        type: "mcq",
        stem: "Which buffer pair is the most important in the extracellular fluid, and why?",
        options: [
          "The phosphate pair, because it is the most abundant in plasma",
          "The bicarbonate pair, because its acid limb is volatile and can be blown off by the lungs",
          "The protein pair, because it cannot be excreted",
          "The haemoglobin pair, because it is inside the red cells",
        ],
        correctIndex: 1,
        explanation: "Carbonic acid/bicarbonate is the principal extracellular buffer, and it is uniquely controllable: carbonic acid is in equilibrium with CO2, which the lungs exhale, while haemoglobin and proteins are important but not directly ventilated.",
      },
      {
        type: "mcq",
        stem: "Using the Henderson-Hasselbalch equation with pKa 6.1, bicarbonate 24 mM and carbonic acid 1.2 mM, what pH is predicted?",
        options: ["6.1", "7.4", "7.0", "8.2"],
        correctIndex: 1,
        explanation: "6.1 + log(24/1.2) = 6.1 + log(20) = 6.1 + 1.3 = 7.4. The ratio, not the absolute concentrations, sets the pH.",
      },
      {
        type: "mcq",
        stem: "The pH of a buffer system is 7.4 with a pKa of 6.1. What is the ratio of base to acid?",
        options: ["20:1", "2:1", "1:20", "1:1"],
        correctIndex: 0,
        explanation: "7.4 - 6.1 = 1.3, and 10 to the power 1.3 is about 20. The system is loaded towards the base limb, which is what buys capacity to absorb acid.",
      },
      {
        type: "mcq",
        stem: "Which statement about intracellular water is correct?",
        options: [
          "About one-third of total body water is intracellular",
          "About two-thirds of total body water is intracellular",
          "Intracellular water is mostly in the bloodstream",
          "Extracellular fluid is larger than intracellular fluid in a lean adult",
        ],
        correctIndex: 1,
        explanation: "Roughly two-thirds of the body's water is inside the cells (about 28 litres of 42), and one-third is outside. Only about three litres of the extracellular share is plasma.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The body is water: about sixty per cent of an adult's weight, two-thirds of it inside the cells. That water is held at a pH of 7.4 by buffers — a weak acid and its conjugate base that convert rather than destroy added acid or base — with bicarbonate dominating outside the cell and phosphate inside it. The Henderson-Hasselbalch equation gives 7.4 from the normal bicarbonate and carbonic acid concentrations, and the reason the system works so far from its pKa is that the lungs control one limb and the kidney the other.",
      },
      {
        type: "paragraph",
        text: "Next: amino acids and the peptide bond. You will meet the twenty building blocks of protein, their side chains, and the reaction that links them into a chain.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 2 — Amino acids and the peptide bond (fully authored)
// ---------------------------------------------------------------------------
function lesson2() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the general structure of an amino acid and name the four variable groups attached to the central carbon; classify the side chains into the four chemical families and give an example of each; explain what a zwitterion is and how pH changes a molecule's charge; state which amino acids are essential and why that matters clinically; and describe the chemistry of the peptide bond, including what is released and what its rigidity implies for protein shape.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (Water, pH and buffering). You need the Henderson-Hasselbalch equation, because the charge on an amino acid depends on the pH of its surroundings.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Amino acid",
        text: "A molecule with a central carbon joined to an amino group (NH2), a carboxyl group (COOH), a hydrogen atom, and a variable side chain (the R group). It is the R group that differs between the twenty standard amino acids, and it is the R group that decides everything about how the molecule behaves.",
      },
      {
        type: "paragraph",
        text: "Proteins are strings of amino acids, and the twenty available letters are surprisingly limited: same backbone, twenty different side chains. Once you have read the side chain you can predict most of the protein's behaviour — whether a segment is hydrophilic or hydrophobic, whether it can carry a charge, whether two residues can link covalently. Everything else in this module is a consequence of the twenty side chains and the link that joins them.",
      },

      { type: "heading", level: 2, text: "The four families of side chain" },
      {
        type: "table",
        headers: ["Family", "Character of the R group", "Examples", "Consequence for a protein"],
        rows: [
          ["Nonpolar (hydrophobic)", "Hydrocarbon-like, no charge", "Glycine, alanine, valine, leucine, isoleucine, methionine, proline, phenylalanine, tryptophan", "Drives folding: these residues bury themselves away from water, forming the core of a folded protein"],
          ["Polar, uncharged", "Carries no net charge but hydrogen-bonds freely", "Serine, threonine, cysteine, tyrosine, asparagine, glutamine", "Lines binding pockets and surfaces where water-soluble molecules interact"],
          ["Acidic", "A carboxyl group that ionises, giving a net negative charge", "Aspartate, glutamate", "Provides negative charge; binds positively charged partners such as calcium"],
          ["Basic", "An amino-containing group that ionises, giving a net positive charge", "Arginine, lysine, histidine", "Provides positive charge; histidine's pKa near neutrality makes it the workhorse of enzyme active sites"],
        ],
      },
      {
        type: "paragraph",
        text: "One entry in that table deserves special attention: cysteine is the only standard amino acid with a sulfur atom in a form that can join to another cysteine, forming a disulfide bridge — a covalent cross-link that can staple two parts of a chain, or two chains, together. That is the strongest of the interactions folding a protein, and it is why oxidizing and reducing environments matter: antibodies released into the oxidative extracellular space are locked into shape by disulfides, while the reducing chemical environment inside the cell keeps cysteines reduced and prevents them from forming bridges there.",
      },

      { type: "heading", level: 2, text: "Zwitterions and the isoelectric point" },
      {
        type: "paragraph",
        text: "An amino acid in solution is not a neutral molecule. Both of its terminal groups ionise: the carboxyl group loses a hydrogen ion and becomes negatively charged, and the amino group gains one and becomes positively charged. At a physiological pH of 7.4 the molecule exists as a zwitterion — a dipolar ion carrying both charges at once, with a net charge of zero but a strong separation of charge within it.",
      },
      {
        type: "paragraph",
        text: "That is why every amino acid has an isoelectric point: the pH at which the positive and negative charges exactly cancel and the molecule carries no net charge, and therefore does not move in an electric field. At a pH below the isoelectric point the molecule is net positive, and above it net negative. This is the basis of electrophoresis, of the separation of serum proteins in diagnosis, and of the different solubilities of proteins in different salt conditions.",
      },
      {
        type: "callout",
        variant: "info",
        text: "As a rule for finding the isoelectric point: for acidic amino acids take the average of the two lowest pKa values, for basic amino acids the average of the two highest. The reason is that the charge balance is reached at the transition that falls between the zwitterionic state and the next ionisation.",
      },

      { type: "heading", level: 2, text: "Essential amino acids" },
      {
        type: "paragraph",
        text: "The body can build most amino acids from carbon skeletons that come from central metabolism, but a set of ten cannot be made at all — or not in sufficient quantity — and must come from the diet. These are the essential amino acids, and they are conventionally remembered as PVT TIM HALL: phenylalanine, valine, threonine, tryptophan, isoleucine, methionine, histidine, arginine, leucine, lysine. Two others, cysteine and tyrosine, can be made only if methionine and phenylalanine are available in the first place — they are conditionally essential.",
      },
      {
        type: "paragraph",
        text: "The clinical importance is protein quality. Cereals such as wheat and rice are relatively poor in lysine; legumes such as beans and peas are relatively poor in methionine. A diet built on one of them alone delivers protein that cannot be fully used, and a diet combining cereals with legumes delivers a complete set. This is the biochemical reason for the traditional pairing of a grain and a legume in cultures around the world, and the reason kwashiorkor — protein deficiency in a child with adequate calories from carbohydrate — happens when a child is weaned onto a starchy gruel.",
      },
      {
        type: "table",
        headers: ["Dietary source", "Limiting amino acid", "Traditional complement"],
        rows: [
          ["Wheat, rice, maize (cereal protein)", "Limited lysine", "Legumes — beans, peas, lentils"],
          ["Beans, peas, lentils (legume protein)", "Limited methionine", "Cereals — and seeds such as sesame"],
          ["Maize (especially poor source)", "Limited lysine and tryptophan", "Beans, as in the traditional dishes of Latin American cuisines"],
        ],
      },

      { type: "heading", level: 2, text: "Worked example: the peptide bond" },
      {
        type: "definition",
        term: "Peptide bond",
        text: "The covalent link formed when the carboxyl group of one amino acid condenses with the amino group of the next, releasing a molecule of water.",
      },
      {
        type: "paragraph",
        text: "The reaction is a condensation. The carboxyl of one residue and the amino of the next join, and water leaves. What is made is an amide link — CO-NH — and the resulting chain has a direction, because the two ends are not identical: the free amino end is the N-terminus and the free carboxyl end is the C-terminus. By convention every sequence is written from the N-terminus to the C-terminus, and it is the direction in which the cell reads its own instructions.",
      },
      {
        type: "table",
        headers: ["Bond", "Between", "Strength", "Role"],
        rows: [
          ["Peptide (covalent)", "Carboxyl of one residue and amino of the next", "Strong, and stable to pH changes that do not hydrolyse it", "Defines the primary structure — the sequence itself"],
          ["Disulfide (covalent)", "Two cysteine side chains", "Strong, and oxidatively formed", "Staples the tertiary structure, mostly in extracellular proteins"],
          ["Hydrogen bond (non-covalent)", "Backbone or side-chain polar groups", "Weak individually, very strong in number", "The principal stabiliser of helices and sheets, and of protein-DNA recognition"],
          ["Hydrophobic interaction", "Nonpolar side chains and water", "Not a bond so much as the exclusion of water", "The main force driving folding, clustering the hydrophobics in the core"],
        ],
      },
      {
        type: "paragraph",
        text: "One further property deserves emphasis because it constrains every folding model. The peptide bond has partial double-bond character: resonance spreads electrons over the three atoms of the link, so it is planar and rigid, and rotation about it is essentially blocked. Rotation happens only at the two bonds flanking it, one to the alpha carbon and one away from it. A protein is therefore a chain of rigid plates connected by swivels, and the possible shapes of that chain follow from the two torsional angles rather than from free rotation at every link." ,
      },
      {
        type: "question",
        prompt: "Where exactly does the peptide bond form when two amino acids join?",
        answer: "Between the carboxyl (-COOH) group of one amino acid and the amino (-NH2) group of the next, releasing a molecule of water.",
        explanation: "Condensation: carboxyl + amino, minus water, gives -CO-NH-. The N-terminus and C-terminus of the chain follow from this direction, and the R groups stay free to build the higher structures.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the bond forms between the two amino groups, or between the two R groups. It is specifically carboxyl to amino; the R groups are never in the backbone, which is why they stay free to mediate the protein's chemistry.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying an amino acid is neutral at pH 7 because its net charge is zero. It is a zwitterion carrying both charges, and it has a strong internal dipole — this is why amino acids raise the boiling point and absorb ultraviolet light at high concentration.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing denaturation with hydrolysis. Denaturation loses the three-dimensional structure without breaking the peptide bonds, which is reversible in principle; hydrolysis breaks the covalent backbone and is not.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What makes the twenty standard amino acids different from one another?",
        answer: "Only the R group — the side chain attached to the central carbon. The amino group, the carboxyl group, and the hydrogen attached to that same carbon are common to all twenty.",
        explanation: "This is the foundation of everything: because the backbone is identical, the side chains alone determine charge, solubility, and the interactions that fold a protein.",
      },
      {
        type: "question",
        prompt: "Which amino acid can form a covalent cross-link with another residue, and what is the link called?",
        answer: "Cysteine, forming a disulfide bridge with another cysteine.",
        explanation: "It is the strongest interaction stabilising tertiary structure, and it is why extracellular proteins — antibodies, albumin, insulin — are locked into shape by the oxidizing environment outside the cell.",
      },
      {
        type: "question",
        prompt: "Why is a diet of maize alone a poor source of protein for a growing child?",
        answer: "Because maize protein is deficient in lysine and tryptophan, so the amino acid supply cannot meet the requirement for building new protein no matter how many grams are eaten.",
        explanation: "This is the biochemical basis of protein quality, and of the complementation of cereals with legumes.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Where exactly does the peptide bond form when two amino acids join?",
        options: [
          "Between the two amino (-NH2) groups of both amino acids",
          "Between the carboxyl (-COOH) group of one amino acid and the amino (-NH2) group of the next, releasing a molecule of water",
          "Between the R groups, which carry the side-chain chemistry",
          "Between the carboxyl groups of both amino acids",
        ],
        correctIndex: 1,
        explanation: "Condensation: carboxyl + amino, minus water, gives -CO-NH-. The N-terminus and C-terminus of the chain follow from this direction, and the R groups stay free to build the higher structures.",
      },
      {
        type: "mcq",
        stem: "Which side chain is hydrophobic?",
        options: ["Serine", "Leucine", "Aspartate", "Lysine"],
        correctIndex: 1,
        explanation: "Leucine has a hydrocarbon side chain with no polar or charged group, so it is hydrophobic. Serine is polar uncharged, aspartate is acidic, and lysine is basic.",
      },
      {
        type: "mcq",
        stem: "A patient's urine contains an amino acid with a net positive charge at physiological pH. Which family is most likely involved?",
        options: ["A hydrophobic amino acid", "A basic amino acid, with a protonated side chain", "An acidic amino acid, with a deprotonated side chain", "A polar uncharged amino acid"],
        correctIndex: 1,
        explanation: "Basic side chains (arginine, lysine, histidine) carry a positive charge at pH 7.4, so residues in this family can make the whole molecule net positive. Acidic residues carry a negative charge under the same conditions.",
      },
      {
        type: "mcq",
        stem: "Which statement about the peptide bond is correct?",
        options: [
          "It allows free rotation at every position along the chain",
          "It is planar and rigid because of partial double-bond character, so rotation is restricted",
          "It is a non-covalent interaction like a hydrogen bond",
          "It breaks spontaneously at body temperature",
        ],
        correctIndex: 1,
        explanation: "Resonance gives the peptide bond partial double-bond character: it is planar, rigid and trans, with rotation permitted only at the bonds flanking the alpha carbon.",
      },
      {
        type: "mcq",
        stem: "Why do the side chains stay free to determine a protein's chemistry?",
        options: [
          "Because they are cleaved from the chain",
          "Because they are not part of the backbone: the peptide link joins carboxyl to amino, leaving every R group projecting from the chain",
          "Because they become part of the backbone instead",
          "Because they are the only charged part of the chain",
        ],
        correctIndex: 1,
        explanation: "The repeating backbone is a combination of alpha carbon, C and N atoms only. Every R group hangs off the alpha carbon, which is why protein surfaces, substrates and disulfide bridges are all R-group chemistry.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Twenty amino acids share a backbone and differ only in side chain, and those side chains sort into four families — hydrophobic, polar uncharged, acidic and basic — which largely predicts where each residue ends up in a folded protein. In solution they are zwitterions, and their charge depends on pH, which is why each has an isoelectric point. Ten are essential in the human diet, and cereal proteins are limited by lysine while legumes are limited by methionine. The peptide bond is a condensation between carboxyl and amino, releasing water, and its partial double-bond character makes it planar and rigid, so rotation in a protein is restricted to the bonds flanking each alpha carbon.",
      },
      {
        type: "paragraph",
        text: "Next: protein structure hierarchy. You will take the same amino acid sequence and see how it becomes a helix, a sheet, a folded domain and finally a multi-subunit machine.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 3 — Protein structure hierarchy (fully authored)
// ---------------------------------------------------------------------------
function lesson3() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: name the four levels of protein structure and describe what stabilises each; distinguish secondary structure (the helix and the sheet) from tertiary and quaternary structure; state which levels are lost in denaturation and which are not; explain how a chaperone assists folding and why aggregation is possible; and relate a structural change to loss of function, with two disease examples.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-2. You need the four families of side chains, the peptide bond, and the fact that the R groups stay free to interact.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Primary structure",
        text: "The amino acid sequence of a protein, written from the N-terminus to the C-terminus. It is the only level of structure carried directly by the gene, and every higher level follows from it.",
      },
      {
        type: "paragraph",
        text: "Anfinsen's classic experiment settled the question of where the folding information lives: unfold a protein completely so that all its higher structure is destroyed, then let the conditions come back to normal, and the protein refolds into its original active shape by itself. The sequence contains the instructions for the shape. So structure is not an extra thing you have to learn — it is the sequence plus chemistry, and every level is the application of a small number of interactions in a particular order.",
      },

      { type: "heading", level: 2, text: "The four levels" },
      {
        type: "table",
        headers: ["Level", "What it is", "What stabilises it", "What destroys it"],
        rows: [
          ["Primary", "The amino acid sequence", "Peptide bonds", "Hydrolysis (strong acid, or a protease), not by denaturation"],
          ["Secondary", "Regular local shapes along the chain: the alpha helix and the beta pleated sheet", "Hydrogen bonds between backbone atoms only — N-H to C=O — with no side-chain chemistry involved", "Denaturation, which unfolds the chain"],
          ["Tertiary", "The overall three-dimensional folding of the single chain into a domain, with hydrophobic residues buried", "Interactions between side chains: hydrophobic clustering, hydrogen bonds, ionic pairs, disulfide bridges, and van der Waals packing", "Denaturation, or a single mutation that introduces a destabilising charge"],
          ["Quaternary", "The assembly of two or more polypeptide chains into one functional protein", "The same forces between subunits, plus sometimes disulfide bridges", "Dissociating agents, or a mutation in a subunit interface"],
        ],
      },
      {
        type: "paragraph",
        text: "Two corrections to the way this is often said. Secondary structure uses backbone atoms only, so it is independent of side-chain chemistry — which is why the helix and the sheet are general, repeating patterns found in every protein. Tertiary structure, by contrast, is side-chain chemistry. And the tertiary level is where the active site is formed: an enzyme's catalytic residues may be far apart in the sequence and adjacent only after folding, and a substitution anywhere that misfolds the domain can therefore disable an active site it is not part of.",
      },

      { type: "heading", level: 2, text: "Worked example: why the secondary level is hydrogen bonds" },
      {
        type: "paragraph",
        text: "Along a polypeptide backbone there is one hydrogen-bond donor (the N-H of every peptide link) and one acceptor (the C=O oxygen of every peptide link) per residue. There are more donors and acceptors than hydrogen bonds can pair, so the chain has a combinatorial problem. The helix solves it in one way: each carbonyl hydrogen-bonds the amide four residues further along, giving a right-handed spiral with about 3.6 residues per turn. The beta sheet solves it in another: neighbouring strands line up side by side, and their backbones hydrogen-bond to one another — adjacent strands may run in the same direction (parallel) or in opposite directions (antiparallel).",
      },
      {
        type: "paragraph",
        text: "Both mechanisms need no side chain at all, which is why the carbonyl and amide groups of the backbone are called 'every residue's second option'. A point mutation that changes a side chain can abolish tertiary structure without disturbing an alpha helix at all, and this is often observed: a substitution in the core can stop folding while leaving the local secondary structure intact.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Collagen, the most abundant protein in the body, is not an alpha helix: it is a left-handed helix of three intertwined chains, held together by hydrogen bonds and by hydroxylation of proline and lysine residues that requires vitamin C. Without vitamin C the collagen triple helix fails, giving the capillary fragility and bleeding gums of scurvy.",
      },

      { type: "heading", level: 2, text: "Chaperones and aggregation" },
      {
        type: "paragraph",
        text: "Folding happens in a very crowded environment, and hydrophobic residues are sticky: an unfolded chain exposing its hydrophobic regions can associate with another chain instead of with itself, producing a clump. Cells therefore keep special proteins called molecular chaperones, which bind hydrophobic surfaces and give a folding protein time and a protected space to find its own correct conformation. A chaperone does not itself dictate the shape — the sequence does — it simply prevents the mistakes.",
      },
      {
        type: "paragraph",
        text: "When the system fails, proteins aggregate, and aggregation can be toxic as well as wasteful. In sickle cell disease a single substitution in the beta chain of haemoglobin (valine for glutamate at position six) removes a negative charge and creates a hydrophobic patch that fits a complementary pocket on the deoxygenated haemoglobin of another molecule. Haemoglobin S polymerises into long fibres that distort the red cell into a sickle, and the clinical syndrome follows directly: the rigid cells block capillaries (pain, infarction), and the spleen that clears them loses function (infection risk).",
      },

      { type: "heading", level: 2, text: "Clinical correlation: loss of structure, loss of function" },
      {
        type: "table",
        headers: ["Disease", "Structural fault", "Clinical consequence"],
        rows: [
          ["Sickle cell disease", "A single substitution (E to V at position 6 of the beta chain) creates a hydrophobic patch", "Haemoglobin polymerises when deoxygenated; the red cell sickles, blocking capillaries; haemolytic anaemia"],
          ["Cystic fibrosis (the commonest mutation)", "F508del removes a single phenylalanine from the CFTR protein", "Misfolding: the protein is recognised as defective and degraded, so it never reaches the cell surface, and the chloride channel is absent"],
          ["Marfan syndrome", "A mutation in the fibrillin gene, a glycoprotein of the connective-tissue microfibrils", "Weakened connective tissue, aortic dilation and lens dislocation"],
          ["Scurvy", "Vitamin C is required to hydroxylate proline and lysine in collagen", "The collagen triple helix is unstable, giving poor wound healing, bleeding gums and capillary fragility"],
        ],
      },
      {
        type: "paragraph",
        text: "The CFTR example is worth pausing on because it is counter-intuitive: the commonest cystic fibrosis mutation does not damage the channel's pore, it makes the protein fold badly enough that the quality-control machinery in the cell destroys it. The disease is caused by absence, not by a broken channel. That insight has shaped the search for drugs that can rescue the folding rather than patch the pore.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying disulfide bridges stabilise the alpha helix. They do not appear in regular secondary structure at all — secondary structure is backbone hydrogen bonds; disulfides are a tertiary interaction, and mostly in extracellular proteins.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Believing a protein's shape is imposed from outside, for instance by another protein, once synthesis is complete. The sequence specifies the shape; chaperones only prevent misfolding. Put an unfolded chain into a plain buffer and it refolds by itself, which is the classic experimental proof.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Conflating denaturation with degradation. Denaturation loses higher structure but the chain remains whole and renaturable in principle; hydrolysis of the backbone is a different process entirely.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What mainly stabilises a protein's tertiary (3D) structure?",
        answer: "Interactions between amino acid side chains (R groups): hydrophobic clustering, hydrogen bonds, ionic pairs and disulfide bridges.",
        explanation: "Primary is the sequence, secondary (helix, sheet) uses backbone H-bonds, but tertiary is R-group chemistry: hydrophobics bury themselves, cysteines cross-link, and the shape that emerges is the function.",
      },
      {
        type: "question",
        prompt: "Which atoms form the hydrogen bonds of an alpha helix?",
        answer: "Backbone atoms only: the N-H of one peptide bond and the C=O oxygen of a peptide bond four residues further along the chain.",
        explanation: "Because the secondary structure is stabilised by backbone atoms only, it is independent of the side chains — which is why helices recur in every protein regardless of sequence.",
      },
      {
        type: "question",
        prompt: "Why does the commonest cystic fibrosis mutation prevent the protein reaching the cell surface?",
        answer: "Because F508del removes one phenylalanine and the resulting misfolded protein is recognised by the cell's quality-control machinery and degraded before it can be inserted into the membrane.",
        explanation: "The channel is absent rather than broken — so the therapeutic strategy is to rescue folding, not to patch the pore.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "What mainly stabilises a protein's tertiary structure?",
        options: [
          "Hydrogen bonds between adjacent residues in the backbone, as in a helix",
          "Interactions between R groups: hydrophobic clustering, hydrogen bonds, ionic pairs and disulfide bridges",
          "The peptide bonds",
          "Nothing — tertiary structure is covalent only",
        ],
        correctIndex: 1,
        explanation: "Tertiary structure is side-chain chemistry. Backbone hydrogen bonds are the secondary level, and the peptide bond defines the primary level.",
      },
      {
        type: "mcq",
        stem: "Which statement distinguishes secondary from tertiary structure?",
        options: [
          "Secondary structure involves side chains, tertiary does not",
          "Secondary structure is stabilised by hydrogen bonds between backbone atoms; tertiary structure by side-chain interactions",
          "Secondary structure is covalently bonded; tertiary is not",
          "They differ only in size",
        ],
        correctIndex: 1,
        explanation: "Secondary structure — helix and beta sheet — is stabilised by backbone N-H to C=O hydrogen bonds and is independent of side chains. Tertiary structure is the side-chain-driven folding of the whole chain.",
      },
      {
        type: "mcq",
        stem: "What happens during denaturation?",
        options: [
          "Peptide bonds are hydrolysed",
          "Secondary, tertiary and quaternary structure are lost, but the primary sequence remains",
          "The amino acid sequence is rearranged",
          "The protein becomes a better catalyst",
        ],
        correctIndex: 1,
        explanation: "Denaturation unfolds the chain and destroys higher structure, and is reversible in principle. Peptide bond cleavage is hydrolysis, a different and irreversible chemical process.",
      },
      {
        type: "mcq",
        stem: "How does sickle cell disease arise from a single mutation?",
        options: [
          "The mutation cleaves the haemoglobin chain",
          "The mutation replaces a charged glutamate with a hydrophobic valine, creating a patch that polymerises deoxygenated haemoglobin into fibres",
          "The mutation deletes the whole beta chain",
          "The mutation changes the iron binding site",
        ],
        correctIndex: 1,
        explanation: "The E to V substitution at position six of the beta chain creates a hydrophobic patch, and the deoxygenated haemoglobin S polymerises into rigid fibres that distort the red cell.",
      },
      {
        type: "mcq",
        stem: "What is the job of a molecular chaperone?",
        options: [
          "It specifies the final three-dimensional shape of the protein",
          "It binds hydrophobic surfaces, preventing aggregation and giving the folding chain time to find its correct shape",
          "It hydrolyses peptide bonds",
          "It disassembles multi-subunit proteins",
        ],
        correctIndex: 1,
        explanation: "Chaperones prevent the mistakes of a crowded fold; they do not dictate the shape, which is specified by the sequence itself.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Protein structure has four levels. Primary is the sequence, written from the N-terminus, and it is the only level specified directly by the gene. Secondary structure — the alpha helix and beta sheet — is stabilised by hydrogen bonds between backbone atoms alone. Tertiary structure is the whole chain folded by its side chains, burying hydrophobics, forming ionic pairs and disulfide bridges, and this is the level at which the active site appears. Quaternary structure is the assembly of subunits. Denaturation destroys the higher levels but leaves the sequence intact, and a single residue substitution can destroy function by destroying folding rather than by damaging an active site directly.",
      },
      {
        type: "paragraph",
        text: "Next: enzymes and Michaelis-Menten kinetics — where one specific folded shape gets a chapter of its own, because catalysis is what most proteins are for.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 4 — Enzymes and Michaelis-Menten kinetics (fully authored)
// ---------------------------------------------------------------------------
function lesson4() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: explain what an enzyme does and what it does not change; draw the Michaelis-Menten curve and explain the meaning of Vmax and of Km; state the factors that affect reaction rate and distinguish competitive from non-competitive inhibition; recognise the shape of a Lineweaver-Burk plot and say what it is used for; and apply Km as an inverse measure of affinity in a clinical or experimental context.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 3 (Protein structure hierarchy). You need the idea that a protein's folded shape creates a specific binding site.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Enzyme",
        text: "A catalyst — almost always a protein — that accelerates a chemical reaction by lowering the activation energy needed to reach the transition state, without being consumed in the reaction and without altering the reaction's equilibrium.",
      },
      {
        type: "paragraph",
        text: "The two properties in that definition come as a pair and are conventionally examined together. An enzyme does not make an unfavourable reaction favourable: it only gets there faster, and the final equilibrium is the same as it would be without it. And it is not consumed: each enzyme molecule can process its substrate millions of times over, which is why the concentrations that matter inside a cell are micromolar rather than molar.",
      },

      { type: "heading", level: 2, text: "How catalysis works" },
      {
        type: "paragraph",
        text: "An enzyme has an active site — a pocket on its surface lined by specific side chains — that binds a substrate, holds it in a precise orientation, and participates directly in the chemical step, often by donating or accepting a proton or by stabilising a charged intermediate. Two pictures of binding have been used historically: lock and key, in which the site is perfectly pre-formed, and induced fit, in which binding itself changes the shape of the protein so that catalysis can only occur in the bound state. Induced fit is the current understanding, and it explains why enzymes discriminate so sharply between chemically similar substrates.",
      },
      {
        type: "table",
        headers: ["Property", "Effect on rate", "Why"],
        rows: [
          ["Enzyme concentration", "Proportional — doubling the enzyme doubles Vmax", "More catalytic sites are available; the enzyme is not consumed"],
          ["Substrate concentration", "First-order then zero-order — the curve plateaus at Vmax", "At low substrate the sites are mostly empty; at saturation, all sites are occupied"],
          ["Temperature", "Rises to an optimum, then falls steeply", "Kinetic energy helps until the protein begins to denature"],
          ["pH", "Rises to an optimum, then falls", "The state of the ionisable side chains at the active site changes"],
          ["Inhibitors", "Reduce the rate, by mechanisms described below", "They either compete for the site or act elsewhere on the molecule"],
        ],
      },

      { type: "heading", level: 2, text: "Worked example: Michaelis-Menten kinetics" },
      {
        type: "paragraph",
        text: "The relationship between substrate concentration and rate is a rectangular hyperbola. At low substrate, doubling the substrate roughly doubles the rate. As substrate rises, the slope flattens, and above a certain point the rate stops responding to substrate entirely. That plateau is Vmax, and the substrate concentration at which the rate is exactly half of Vmax is Km — the Michaelis constant.",
      },
      {
        type: "table",
        headers: ["Quantity", "Meaning", "What changes it"],
        rows: [
          ["Vmax", "The maximum rate, when every active site is occupied at all times", "Only the enzyme concentration: Vmax = kcat x [E]. Adding substrate cannot exceed it"],
          ["Km", "The substrate concentration at which the rate is half of Vmax, and therefore a measure of affinity: small Km, high affinity", "A change in the enzyme itself — a mutation in the active site, or a competitive inhibitor"],
          ["kcat (turnover number)", "How many substrate molecules one enzyme converts per second when saturated", "The chemical step at the active site; can be slowed by a mutation at the catalytic residue"],
          ["kcat / Km", "The specificity constant, which allows comparison of two substrates for the same enzyme", "Anything that affects either constant"],
        ],
      },
      {
        type: "paragraph",
        text: "The plateau has a molecular explanation that is worth stating explicitly, because it is the question most often asked in an oral examination. At saturation, every enzyme molecule has a substrate bound at every moment. Adding more substrate cannot create more enzyme. The rate therefore depends only on how fast each molecule can convert what it holds and release the products — so Vmax = kcat x [E], which is why increasing enzyme concentration is the only way to raise a saturated rate.",
      },

      { type: "heading", level: 2, text: "Inhibition" },
      {
        type: "table",
        headers: ["Type", "Mechanism", "Effect on Km", "Effect on Vmax", "Classic example"],
        rows: [
          ["Competitive", "The inhibitor binds the active site, competing with the substrate", "Increases (less apparent affinity)", "Unchanged — a high enough substrate concentration can out-compete it", "Malonate against succinate dehydrogenase; statins against HMG-CoA reductase; methotrexate against dihydrofolate reductase"],
          ["Non-competitive", "The inhibitor binds elsewhere, changing the shape of the enzyme", "Unchanged", "Reduced — adding substrate cannot restore the rate", "Heavy-metal ions binding cysteines; allosteric inhibitors"],
          ["Uncompetitive", "The inhibitor binds only the enzyme-substrate complex", "Reduced", "Reduced", "Rare in practice, but part of the standard curriculum"],
        ],
      },
      {
        type: "paragraph",
        text: "For a competitive inhibitor, the key clinical observation is that the inhibition can be overcome by raising the substrate concentration, because the two are competing for the same site. That is exactly why methotrexate — a structural analogue of the folic acid precursor dihydrofolate — is given in high doses to shut down DNA synthesis in leukaemia, and why leucovorin (folinic acid) is used to rescue the healthy cells by supplying a bypass.",
      },

      { type: "heading", level: 2, text: "Clinical correlation: enzymes in diagnosis" },
      {
        type: "paragraph",
        text: "Blood is a convenient place to look for intracellular enzymes, because when a tissue is damaged its cells leak. A serum enzyme level is therefore a measure of how much of that tissue is dying, and of how recently. The interpretation relies on two properties: which tissue contains the enzyme in quantity, and how fast it is cleared from plasma.",
      },
      {
        type: "table",
        headers: ["Enzyme", "Principal source", "Timing after myocardial infarction", "Note"],
        rows: [
          ["Troponin I and T", "Cardiac muscle", "Rises within about 3 to 6 hours, peaks at about 24 hours, and remains elevated for days", "Cardiac-specific, and the test of choice"],
          ["Creatine kinase MB (CK-MB)", "Cardiac muscle, with a small contribution from skeletal muscle", "Rises within about 3 to 6 hours and returns to baseline within about 48 to 72 hours", "Used to detect re-infarction, because it clears fast enough to rise again"],
          ["Aspartate aminotransferase (AST)", "Liver, heart, skeletal muscle, red cells", "Rises within 6 to 8 hours, peaks at 24 to 48 hours", "Not liver-specific; also rises in muscle injury and haemolysis"],
          ["Alanine aminotransferase (ALT)", "Liver", "Rises and falls over days", "More liver-specific than AST"],
          ["Alkaline phosphatase", "Bile canaliculi, bone, placenta", "Rises over days", "Raised in bile duct obstruction and in bone disease; distinguishes with a gamma-glutamyl transferase"],
        ],
      },
      {
        type: "question",
        prompt: "An enzyme-catalysed reaction is running at Vmax. What is happening at the molecular level?",
        answer: "Every active site is occupied by substrate, so the rate depends only on how fast each enzyme molecule converts its bound substrate.",
        explanation: "Vmax is saturation: adding more substrate cannot help because there are no free active sites. Vmax = kcat x [E], which is why it rises with enzyme concentration — the mirror image of Km, which reports affinity.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying an enzyme changes the equilibrium position in favour of products. It accelerates both forward and reverse reactions; the ratio at equilibrium is the same as it would be uncatalysed. Enzymes are rate accelerators, not equilibrium movers.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating Km as a substrate concentration that is 'optimal'. It is the concentration at half-maximal rate, not the best concentration. It is an inverse measure of affinity, not a threshold.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a competitive inhibitor lowers Vmax. It does not — at high enough substrate concentration the substrate wins and Vmax is restored. A lowered Vmax with unchanged Km is non-competitive inhibition.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What is the difference between Vmax and Km?",
        answer: "Vmax is the maximum rate achievable at saturation, determined by enzyme concentration and the turnover number. Km is the substrate concentration at half that rate, and is inversely related to the enzyme's affinity for its substrate.",
        explanation: "Vmax says how fast the enzyme can work when it is fully loaded; Km says how easily it gets loaded.",
      },
      {
        type: "question",
        prompt: "Why can adding substrate overcome the effect of a competitive inhibitor but not of a non-competitive one?",
        answer: "Because a competitive inhibitor occupies the active site, which the substrate can out-compete at high concentration. A non-competitive inhibitor changes the enzyme's shape, so no amount of substrate restores the reaction rate.",
        explanation: "This distinction is the basis of much pharmacological design: a competitive interaction can be overcome, while a conformational one cannot.",
      },
      {
        type: "question",
        prompt: "Why is CK-MB useful for detecting a second myocardial infarction after the first?",
        answer: "Because it rises within a few hours and clears within about two to three days, so a new rise after it has fallen indicates new damage. Troponin stays elevated for days, so a second rise is harder to attribute.",
        explanation: "The kinetics of a marker decide what it is used for: slow-clearing markers diagnose, fast-clearing markers re-diagnose.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which statement about Vmax is correct?",
        options: [
          "It increases if substrate concentration is increased further",
          "It is proportional to enzyme concentration and to the turnover number",
          "It is the substrate concentration at half the maximum rate",
          "It falls in the presence of a competitive inhibitor",
        ],
        correctIndex: 1,
        explanation: "Vmax = kcat x [E]. Only enzyme concentration and turnover number set it. Km is the half-saturation concentration, and competitive inhibitors affect Km rather than Vmax.",
      },
      {
        type: "mcq",
        stem: "A drug lowers the Km of an enzyme for its substrate and slightly reduces Vmax. Which is the most likely mechanism?",
        options: [
          "Competitive inhibition at the active site", "Competitive inhibition with a structural analogue of the substrate", "Non-competitive inhibition binding elsewhere", "Uncompetitive inhibition of the enzyme-substrate complex",
        ],
        correctIndex: 3,
        explanation: "Uncompetitive inhibition reduces both Km and Vmax, because the inhibitor only binds the enzyme-substrate complex and traps it. Competitive inhibition raises Km alone; non-competitive reduces Vmax alone.",
      },
      {
        type: "mcq",
        stem: "Which of the following correctly distinguishes competitive from non-competitive inhibition?",
        options: [
          "Both reduce Vmax, but only competitive inhibition is overcome by raising the substrate concentration",
          "Competitive inhibition increases Km and leaves Vmax unchanged; non-competitive inhibition leaves Km unchanged and reduces Vmax",
          "Non-competitive inhibition binds the active site; competitive inhibition binds elsewhere",
          "They are both identical in effect",
        ],
        correctIndex: 1,
        explanation: "Competitive inhibition displaces the substrate from the active site, so apparent affinity falls (higher Km) but the saturated rate is unchanged. Non-competitive inhibition is not displaced, so the saturated rate falls but Km is unchanged.",
      },
      {
        type: "mcq",
        stem: "An enzyme-catalysed reaction is running at Vmax. What is happening at the molecular level?",
        options: [
          "Every active site is occupied by substrate, so the rate depends only on how fast each enzyme molecule converts its bound substrate",
          "The enzyme is being denatured by the high substrate concentration",
          "The substrate has been used up and the reaction is ending",
          "The inhibitor has been destroyed and the reaction runs away",
        ],
        correctIndex: 0,
        explanation: "Vmax is saturation: adding more substrate cannot help because there are no free active sites. Vmax = kcat x [E], which is why it rises with enzyme concentration — the mirror image of Km, which reports affinity.",
      },
      {
        type: "mcq",
        stem: "Which statement about enzymes is correct?",
        options: [
          "An enzyme shifts the equilibrium of the reaction towards products",
          "An enzyme lowers the activation energy and is unchanged at the end of the reaction",
          "An enzyme is consumed in stoichiometric amounts as it works",
          "An enzyme only works in the forward direction",
        ],
        correctIndex: 1,
        explanation: "The two defining properties are acceleration by lowering activation energy, and emerging from the reaction unaltered. Enzymes accelerate both directions and leave the equilibrium constant untouched.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Enzymes are protein catalysts: they lower the activation energy without being consumed and without moving the equilibrium. Their kinetics are described by Michaelis-Menten: a rate that rises with substrate and plateaus at Vmax, which is proportional to enzyme concentration, with Km — the substrate concentration at half-maximal rate — as an inverse measure of affinity. Competitive inhibitors raise Km without lowering Vmax, because substrate can out-compete them; non-competitive inhibitors lower Vmax without changing Km. Because damaged cells leak intracellular enzymes, serum enzyme measurements report the site, the size and the timing of tissue injury.",
      },
      {
        type: "paragraph",
        text: "Next: module two, where carbohydrates, lipids and membranes take the chemistry into the fuel and the barrier — and where the same structural principles, applied to membranes rather than proteins, become the biochemist's main subject.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 5 — Clinical correlation: enzyme assays in diagnosis (fully authored)
// ---------------------------------------------------------------------------
function lesson5() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: explain the principle behind a serum enzyme assay; state the timing rules that govern the interpretation of cardiac and hepatic markers; distinguish a liver enzyme pattern from a biliary one using a paired test; identify the clinical questions a serial assay can answer; and explain what a laboratory's reference range actually means and how to interpret a result that falls just outside it.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 4 (Enzymes and Michaelis-Menten kinetics). You need Km, Vmax and the concept of enzyme specificity, because an assay measures a rate and that rate is interpreted through the enzyme's kinetic properties.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Serum enzyme assay",
        text: "The measurement of an intracellular enzyme in a blood sample, where its presence and its rise and fall over time report the site, the size and the timing of cell damage.",
      },
      {
        type: "paragraph",
        text: "The logic is simple and it works everywhere in clinical medicine. A healthy cell keeps its enzymes inside. A damaged cell leaks them. The blood that drains the damaged organ therefore carries a sample of what that organ was made of. An assay is not measuring the disease itself; it is measuring the wreckage, and like all wreckage it takes time to appear, time to peak and time to clear.",
      },

      { type: "heading", level: 2, text: "The principle behind the assay" },
      {
        type: "paragraph",
        text: "The laboratory adds the patient's serum to a controlled reaction mixture and watches a product appear or a substrate disappear, usually by following the change in absorbance of a coenzyme with a spectrophotometer. The measurement is a rate — enzyme units per litre — and that rate is only meaningful if the assay conditions are fixed: substrate concentration, pH, temperature, and the presence of any required cofactors. That is why results are reported against a reference range measured in the same conditions, and why a result from a different laboratory with a different method is not directly comparable.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Because the assay measures a rate, 'high enzyme' means either more enzyme molecules or a more active enzyme. In tissue injury the mechanism is always more enzyme molecules, released by damaged cells.",
      },

      { type: "heading", level: 2, text: "Worked example: reading a cardiac marker series" },
      {
        type: "paragraph",
        text: "A 58-year-old man presents to the emergency department with an hour of central chest pain. Serial measurements of troponin are taken on arrival and again at intervals afterwards. The first value is normal, and the second is eight times the upper limit of normal.",
      },
      {
        type: "table",
        headers: ["Marker", "Rises", "Peaks", "Returns to baseline", "What it is best for"],
        rows: [
          ["Troponin I and T", "About 3 to 6 hours", "About 24 hours", "About 5 to 14 days", "Diagnosing a first infarction, and detecting any myocardial necrosis"],
          ["CK-MB", "About 3 to 6 hours", "About 24 hours", "About 48 to 72 hours", "Detecting a new infarction in a patient whose troponin is still elevated"],
          ["Myoglobin", "Within about 1 to 2 hours", "About 8 hours", "About 24 hours", "Early screening — it rises first, but is not specific to cardiac muscle"],
        ],
      },
      {
        type: "paragraph",
        text: "The first normal troponin teaches the most important lesson of the series: a normal value early does not exclude a myocardial infarction, because the enzyme has not yet leaked out and been cleared. This is why the diagnosis is built on the pattern of change — a rise and then a fall — rather than on any single value, and why a mandatory delay exists between the two measurements. The one exception is a troponin that rises and then falls again in a patient whose first infarction was several days ago: that pattern can only be a second event, and CK-MB is the marker that is used, because it clears fast enough to rise again.",
      },
      {
        type: "question",
        prompt: "A patient's troponin is 0.8 units per litre on arrival at one hour after the onset of chest pain. Does that exclude a myocardial infarction?",
        answer: "No. Troponin takes about three to six hours to rise after necrosis, so an early value is expected to be normal in an infarct that is only an hour old. The test is repeated.",
        explanation: "The diagnosis rests on a rise-and-fall pattern, which is why serial measurement is mandatory after a normal early result.",
      },

      { type: "heading", level: 2, text: "Worked example: liver versus biliary" },
      {
        type: "paragraph",
        text: "A patient is jaundiced. The laboratories return a raised aspartate aminotransferase and alanine aminotransferase, together with a markedly raised alkaline phosphatase and a raised gamma-glutamyl transferase. What distinguishes the patterns?",
      },
      {
        type: "table",
        headers: ["Pattern", "Dominant enzymes", "Site of the problem"],
        rows: [
          ["Hepatocellular", "AST and ALT raised much more than alkaline phosphatase", "The liver cells themselves — viral hepatitis, paracetamol overdose, ischaemia, alcohol"],
          ["Cholestatic (obstructive)", "Alkaline phosphatase and gamma-glutamyl transferase raised much more than AST and ALT", "The bile ducts — a stone in the common bile duct, a tumour, primary biliary cirrhosis"],
        ],
      },
      {
        type: "paragraph",
        text: "The reason the two tests are used together is that alkaline phosphatase is not specific to the liver: it is also abundant in bone, in placenta, and in kidney. A pregnant woman, a growing adolescent with active bone, and a patient with Paget's disease can all have a raised alkaline phosphatase. The gamma-glutamyl transferase is the hepatic confirmatory test, so a parallel rise localises the alkaline phosphatase to the liver.",
      },
      {
        type: "paragraph",
        text: "Two further points of technique. First, an AST that is twice the ALT or more suggests an alcoholic origin, because alcohol damages the mitochondria and depletes the cofactor required to synthesise ALT. Second, in extremely severe hepatitis the enzyme levels can paradoxically fall, because the liver has run out of cells to leak — the 'burning out' hepatitis, in which a falling AST with a rising bilirubin and a rising prothrombin time is a prognostic warning rather than reassurance.",
      },

      { type: "heading", level: 2, text: "Reference ranges and clinical judgment" },
      {
        type: "paragraph",
        text: "A reference range is conventionally defined as the interval containing 95 per cent of healthy people, which means about 2.5 per cent of perfectly well individuals fall outside it at either end by construction. A mildly abnormal result is therefore a probability statement, not a diagnosis, and it must be read with the clinical picture. A creatine kinase of twice the upper limit in a marathon runner the day after a race is the expected effect of muscle strain; the same value in a patient at rest is a reason to question the urine output and check for rhabdomyolysis.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "The commonest interpretive error is to act on a single value without a timeline. Many assays are only interpretable as a series: cardiac markers, transaminases, and renal function all need the direction and rate of change, not just the magnitude.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Attributing a raised ALT to the heart. ALT is more liver-specific; the cardiac markers are troponin and CK-MB. AST is shared between liver and muscle, which is why ALT is the more specific liver enzyme.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Reporting an enzyme value as a concentration of 'harmful enzyme' in the blood. The enzyme is a normal intracellular constituent; the number reports the amount of damage, not toxicity.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Using a jaundiced patient's raised alkaline phosphatase to diagnose biliary obstruction without checking gamma-glutamyl transferase and a liver ultrasound. Bone disease and pregnancy also raise the alkaline phosphatase.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why do plasma enzyme and protein assays help after a suspected heart attack?",
        answer: "Damaged heart muscle cells spill their intracellular contents into the blood, so rising troponin or CK-MB reports the occurrence, timing and extent of injury.",
        explanation: "Dead cells leak: each marker rises and clears on its own time curve (CK-MB within hours, troponin over days), so serial assays time the infarct — and organ-specific isoforms point to the tissue, the diagnostic principle behind every enzyme assay in the course.",
      },
      {
        type: "question",
        prompt: "In a jaundiced patient, which pair of enzymes distinguishes a hepatocellular pattern from an obstructive one?",
        answer: "Transaminases (AST and ALT) raised disproportionately indicate hepatocellular damage; alkaline phosphatase and gamma-glutamyl transferase raised disproportionately indicate obstruction of the bile ducts.",
        explanation: "The two sets are raised in different ratios, and the ratio is the diagnostic information.",
      },
      {
        type: "question",
        prompt: "Why does the CK-MB fall faster than troponin after a myocardial infarction?",
        answer: "Because CK-MB is cleared from plasma more rapidly than cardiac troponin, so it returns to baseline within about two to three days while troponin remains elevated for up to two weeks.",
        explanation: "The difference in clearance is exactly why CK-MB is used for detecting re-infarction: it can fall and rise again, which troponin cannot.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Why do plasma enzyme assays help after a suspected myocardial infarction?",
        options: [
          "Damaged heart muscle cells spill their intracellular contents into the blood, so rising troponin or CK-MB reports the occurrence, timing and extent of injury",
          "The blood manufactures new enzymes to repair the heart",
          "They measure how much oxygen the heart is consuming",
          "They detect any infection that caused the attack",
        ],
        correctIndex: 0,
        explanation: "Dead cells leak: each marker rises and clears on its own time curve, so serial assays time the infarct — and organ-specific isoforms point to the tissue.",
      },
      {
        type: "mcq",
        stem: "A jaundiced patient has AST 320 units per litre, ALT 410 units per litre, alkaline phosphatase 220 units per litre. Which pattern is this?",
        options: [
          "Cholestatic, because the alkaline phosphatase is raised",
          "Hepatocellular, because the transaminases dominate",
          "Normal liver function",
          "An isolated haemolytic pattern",
        ],
        correctIndex: 1,
        explanation: "The transaminases are raised far more than the alkaline phosphatase, so the site of damage is the liver cell, not the bile duct. A stone in the common duct would raise the alkaline phosphatase and gamma-glutamyl transferase disproportionately.",
      },
      {
        type: "mcq",
        stem: "Which test is added to a raised alkaline phosphatase to confirm a hepatic origin?",
        options: ["Aspartate aminotransferase", "Alanine aminotransferase", "Gamma-glutamyl transferase", "Creatine kinase"],
        correctIndex: 2,
        explanation: "Alkaline phosphatase comes from bone, bile, placenta and kidney; gamma-glutamyl transferase confirms that the source is the liver.",
      },
      {
        type: "mcq",
        stem: "Which marker is best for detecting a second myocardial infarction several days after the first?",
        options: ["Troponin", "CK-MB", "Myoglobin", "Alanine aminotransferase"],
        correctIndex: 1,
        explanation: "Troponin stays elevated for up to two weeks, so it cannot rise again usefully. CK-MB clears in about two to three days, so a new rise after it has fallen is attributable to new damage.",
      },
      {
        type: "mcq",
        stem: "A patient's alkaline phosphatase is raised and gamma-glutamyl transferase is normal. What is an important possible explanation?",
        options: [
          "Obstruction of the common bile duct",
          "Bone disease, or normal growth in an adolescent, or pregnancy",
          "Viral hepatitis",
          "Myocardial infarction",
        ],
        correctIndex: 1,
        explanation: "Alkaline phosphatase is abundant in bone and placenta, so a raised value with a normal confirmatory test should prompt a search for a bone or placental source before a hepatic one.",
      },

      { type: "heading", level: 2, text: "Module summary and next" },
      {
        type: "paragraph",
        text: "The clinical biochemistry of enzymes rests on one idea: cells leak when they die, and the leak has a characteristic size, tissue and time course. Cardiac markers report timing — a rise and then a fall — which is why serial measurement replaces a single value. Liver enzymes report the site of damage, through the ratio between transaminases and the biliary pair. And every value is measured against a reference range defined statistically across healthy people, so a mildly abnormal number is a probability to be interpreted, not a diagnosis.",
      },
      {
        type: "paragraph",
        text: "Next module: carbohydrates, lipids and membranes — where the chemistry becomes the fuel and the barrier, and where the molecules you have met as enzyme inhibitors (such as the statins) become the drugs.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Module 1 SBA items — one per concept, authored and machine-checked.
// ---------------------------------------------------------------------------
const MODULE_ONE_SBAS: SbaSeed[] = [
  {
    slug: "medical-biochemistry-i--water-ph-buffering--sba",
    concept: "water-ph-buffering",
    stem: "In the bicarbonate buffer system of blood, what is the ratio of base to acid at arterial pH 7.4, and why does the ratio set the pH?",
    options: [
      "About 1:1, because pH equals pKa when the ratio is one",
      "About 20:1, because pH 7.4 = 6.1 + log(20)",
      "About 20:1, because the buffer holds the pH at exactly 7.0",
      "About 1:7.4, because pH is the logarithm of the hydrogen ion concentration",
    ],
    correctAnswer: "About 20:1, because pH 7.4 = 6.1 + log(20)",
    explanation:
      "Henderson-Hasselbalch: 6.1 + log(24/1.2) = 6.1 + log(20) = 7.4. The ratio of base to acid, not the absolute concentrations, sets the pH — and the lungs and kidneys defend that ratio in the open system.",
    difficulty: "medium",
  },
  {
    slug: "medical-biochemistry-i--amino-acids-peptide-bond--sba",
    concept: "amino-acids-peptide-bond",
    stem: "Where exactly does the peptide bond form when two amino acids join?",
    options: [
      "Between the two amino (-NH2) groups of both amino acids",
      "Between the carboxyl (-COOH) group of one amino acid and the amino (-NH2) group of the next, releasing a molecule of water",
      "Between the R groups, which carry the side-chain chemistry",
      "Between the carboxyl groups of both amino acids",
    ],
    correctAnswer:
      "Between the carboxyl (-COOH) group of one amino acid and the amino (-NH2) group of the next, releasing a molecule of water",
    explanation:
      "Condensation: carboxyl + amino, minus water, gives -CO-NH-. The N-terminus and C-terminus of the chain follow from this direction, and the R groups stay free to build the higher structures.",
    difficulty: "easy",
  },
  {
    slug: "medical-biochemistry-i--protein-structure-hierarchy--sba",
    concept: "protein-structure-hierarchy",
    stem: "What mainly stabilises a protein's tertiary structure?",
    options: [
      "Hydrogen bonds between the peptide-bond backbone atoms, as in an alpha helix",
      "Interactions between amino acid side chains (R groups): hydrophobic clustering, hydrogen bonds, ionic pairs and disulfide bridges",
      "The primary sequence alone, with no folding involved",
      "Only the chaperone proteins that surround it",
    ],
    correctAnswer:
      "Interactions between amino acid side chains (R groups): hydrophobic clustering, hydrogen bonds, ionic pairs and disulfide bridges",
    explanation:
      "Primary is the sequence, secondary (helix, sheet) uses backbone hydrogen bonds, but tertiary is R-group chemistry: hydrophobics bury themselves, cysteines cross-link, and the shape that emerges is the function.",
    difficulty: "medium",
  },
  {
    slug: "medical-biochemistry-i--enzyme-kinetics--sba",
    concept: "enzyme-kinetics",
    stem: "A competitive inhibitor is added to an enzyme assay. What happens to the apparent Km and to Vmax?",
    options: [
      "Km rises and Vmax is unchanged",
      "Km falls and Vmax is unchanged",
      "Km is unchanged and Vmax falls",
      "Both Km and Vmax fall",
    ],
    correctAnswer: "Km rises and Vmax is unchanged",
    explanation:
      "A competitive inhibitor binds the active site, so more substrate is needed to reach half saturation (Km appears to rise). Given enough substrate the inhibitor is out-competed, so Vmax is restored. Km unchanged with reduced Vmax is non-competitive inhibition; a fall in both is uncompetitive.",
    difficulty: "medium",
  },
  {
    slug: "medical-biochemistry-i--clinical-enzyme-assays--sba",
    concept: "clinical-enzyme-assays",
    stem: "Why do plasma enzyme and protein assays help after a suspected heart attack?",
    options: [
      "Damaged heart muscle cells spill their intracellular contents into the blood, so rising troponin or CK-MB reports the occurrence, timing and extent of injury",
      "The blood manufactures new enzymes to repair the heart",
      "They measure how much oxygen the heart is consuming",
      "They detect any infection that caused the attack",
    ],
    correctAnswer:
      "Damaged heart muscle cells spill their intracellular contents into the blood, so rising troponin or CK-MB reports the occurrence, timing and extent of injury",
    explanation:
      "Dead cells leak: each marker rises and clears on its own time curve (CK-MB within hours, troponin over days), so serial assays time the infarct — and organ-specific isoforms point to the tissue, the diagnostic principle behind every enzyme assay in the course.",
    difficulty: "medium",
  },
];

// ---------------------------------------------------------------------------
// Deeper modules 2-5: a real concept spine, tracked-placeholder lessons.
// ---------------------------------------------------------------------------
const DEEPER_LESSONS: LessonSeed[] = [
  // --- M2 Carbohydrates, lipids & membranes ---
  { title: "Monosaccharides, disaccharides & polysaccharides", module: 2, estimatedMinutes: 35, authored: false, concept: { title: "Monosaccharides and glycosidic bonds", slug: "monosaccharides", summary: "The monosaccharide ring structures, the alpha and beta linkages of disaccharides and polysaccharides, and the role of glycoproteins.", blooms: "understand", minutes: 35, prereq: [] }, content: { blocks: [] } },
  { title: "Lipids: fatty acids, glycerol & sterols", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Lipids and fatty acids", slug: "lipids", summary: "Triacylglycerols, phospholipids, glycolipids and cholesterol, saturated and unsaturated fatty acids, and the essential fatty acids.", blooms: "understand", minutes: 40, prereq: [] }, content: { blocks: [] } },
  { title: "Cell membranes & membrane transport", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "The cell membrane", slug: "cell-membranes", summary: "The lipid bilayer and its proteins, membrane fluidity, and the membrane as a transport surface.", blooms: "understand", minutes: 40, prereq: ["lipids"] }, content: { blocks: [] } },
  { title: "Vitamins & trace elements", module: 2, estimatedMinutes: 35, authored: false, concept: { title: "Vitamins and trace elements", slug: "vitamins-trace-elements", summary: "Water- and fat-soluble vitamins with their coenzyme roles, and the roles of iron, iodine, zinc, selenium and magnesium.", blooms: "remember", minutes: 35, prereq: [] }, content: { blocks: [] } },
  { title: "Chemical messengers & signal transduction", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Signalling molecules and second messengers", slug: "signal-transduction", summary: "Hormones, second messengers, G-proteins and kinase cascades, and the receptors that transduce them.", blooms: "apply", minutes: 40, prereq: [] }, content: { blocks: [] } },

  // --- M3 Metabolism & energy ---
  { title: "Bioenergetics & high-energy phosphates", module: 3, estimatedMinutes: 35, authored: false, concept: { title: "Bioenergetics and ATP", slug: "bioenergetics-atp", summary: "Free energy, ATP as the energy currency, and the reduction potential behind oxidative metabolism.", blooms: "understand", minutes: 35, prereq: [] }, content: { blocks: [] } },
  { title: "Glycolysis & its control", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Glycolysis", slug: "glycolysis", summary: "The ten reactions of glycolysis, its ATP yield, its anaerobic fate, and its hormonal control by insulin and glucagon.", blooms: "analyze", minutes: 40, prereq: [] }, content: { blocks: [] } },
  { title: "Citric acid cycle & oxidative phosphorylation", module: 3, estimatedMinutes: 45, authored: false, concept: { title: "The citric acid cycle and oxidative phosphorylation", slug: "citric-acid-cycle", summary: "The cycle that oxidises acetyl-CoA, the electron transport chain, and the chemiosmotic synthesis of ATP.", blooms: "analyze", minutes: 45, prereq: [] }, content: { blocks: [] } },
  { title: "Gluconeogenesis, glycogen & the pentose phosphate pathway", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Gluconeogenesis, glycogen and the pentose phosphate pathway", slug: "gluconeogenesis-glycogen", summary: "Synthesis of glucose from non-carbohydrate sources, storage and release of glycogen, and production of NADPH and ribose.", blooms: "analyze", minutes: 40, prereq: [] }, content: { blocks: [] } },
  { title: "Fatty acid oxidation & ketogenesis", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Fatty acid oxidation and ketogenesis", slug: "fatty-acid-oxidation", summary: "Activation, entry into the mitochondrion and beta-oxidation, the ATP yield, and the formation of ketone bodies in starvation.", blooms: "analyze", minutes: 40, prereq: [] }, content: { blocks: [] } },
  { title: "Fatty acid synthesis & cholesterol", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Fatty acid and cholesterol metabolism", slug: "lipid-synthesis-cholesterol", summary: "Cytoplasmic fatty acid synthesis, cholesterol synthesis and its feedback regulation, and the lipoproteins.", blooms: "analyze", minutes: 40, prereq: [] }, content: { blocks: [] } },
  { title: "Amino acid metabolism & the urea cycle", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Amino acid metabolism and the urea cycle", slug: "amino-acid-metabolism", summary: "Transamination and deamination, the glucogenic and ketogenic amino acids, and the disposal of ammonia.", blooms: "analyze", minutes: 40, prereq: [] }, content: { blocks: [] } },

  // --- M4 Molecular biology & genetics ---
  { title: "DNA structure, replication & repair", module: 4, estimatedMinutes: 45, authored: false, concept: { title: "DNA structure, replication and repair", slug: "dna-structure-replication", summary: "The double helix, the mechanism of semi-conservative DNA replication, and the principal DNA repair pathways.", blooms: "understand", minutes: 45, prereq: [] }, content: { blocks: [] } },
  { title: "Transcription & RNA processing", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Transcription and RNA processing", slug: "transcription-rna-processing", summary: "RNA synthesis, capping, polyadenylation and splicing, and the roles of the RNA polymerases.", blooms: "understand", minutes: 40, prereq: [] }, content: { blocks: [] } },
  { title: "Translation & the genetic code", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Translation and the genetic code", slug: "translation-genetic-code", summary: "Ribosomes, transfer RNAs, the genetic code and its degeneracy, and the post-translational modifications.", blooms: "apply", minutes: 40, prereq: [] }, content: { blocks: [] } },
  { title: "Regulation of gene expression", module: 4, estimatedMinutes: 45, authored: false, concept: { title: "Regulation of gene expression", slug: "gene-expression-regulation", summary: "Transcriptional and post-transcriptional control, epigenetics, and the regulatory molecules such as transcription factors and microRNAs.", blooms: "analyze", minutes: 45, prereq: [] }, content: { blocks: [] } },
  { title: "Molecular genetic techniques & PCR", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Molecular techniques and PCR", slug: "molecular-techniques-pcr", summary: "Electrophoresis, blotting, DNA sequencing, PCR, and their diagnostic and research uses.", blooms: "apply", minutes: 40, prereq: [] }, content: { blocks: [] } },
  { title: "Recombinant DNA, cloning & gene therapy", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Recombinant DNA, cloning and gene therapy", slug: "recombinant-dna-gene-therapy", summary: "Vectors, gene cloning, the production of recombinant proteins, and the principles and risks of gene therapy.", blooms: "analyze", minutes: 40, prereq: [] }, content: { blocks: [] } },

  // --- M5 Clinical biochemistry & nutrition ---
  { title: "Liver function tests & jaundice", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Liver function tests and jaundice", slug: "liver-function-jaundice", summary: "Bilirubin metabolism, the pre-hepatic, hepatocellular and obstructive jaundices, and the interpretation and synthesis of synthetic liver function.", blooms: "apply", minutes: 40, prereq: [] }, content: { blocks: [] } },
  { title: "Renal tests & the plasma acid-base disturbances", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Renal tests and acid-base disturbances", slug: "renal-tests-acid-base", summary: "Urea, creatinine and the filtration estimate, and the four big acid-base disturbances with their compensations.", blooms: "apply", minutes: 40, prereq: [] }, content: { blocks: [] } },
  { title: "Endocrine biochemistry", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Endocrine biochemistry", slug: "endocrine-biochemistry", summary: "Thyroid, adrenal and glycaemic panels, the interpretation of raised prolactin and of the dexamethasone suppression test.", blooms: "apply", minutes: 40, prereq: [] }, content: { blocks: [] } },
  { title: "Inherited metabolic disease & nutrition", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Inherited metabolic disease and nutrition", slug: "inherited-metabolic-disease-nutrition", summary: "Inborn errors of metabolism, newborn screening, dietary reference values, and the management of obesity and undernutrition.", blooms: "apply", minutes: 35, prereq: [] }, content: { blocks: [] } },
  { title: "Tumour markers & cancer biochemistry", module: 5, estimatedMinutes: 30, authored: false, concept: { title: "Tumour markers and cancer biochemistry", slug: "tumour-markers", summary: "The use and limitations of tumour markers, and the altered metabolism of proliferating tissue.", blooms: "apply", minutes: 30, prereq: [] }, content: { blocks: [] } },
];

export const BIOCHEMISTRY: SubjectSeed = {
  id: "course-biochemistry",
  existingSlug: "medical-biochemistry-i",
  slug: "medical-biochemistry-i",
  title: "Medical Biochemistry I — Chemistry of Cells & Proteins",
  code: "BCHM 101",
  department: "Medical Biochemistry",
  level: 100,
  credits: 3,
  semester: "first",
  description:
    "The chemistry that makes the body work: water and pH, amino acids and protein structure, enzyme kinetics and regulation, and the clinical biochemistry that reads tissue damage in a blood sample.",
  faculty: "basic-medical-sciences",
  modules: MODULES,
  lessons: [
    { title: "Water, pH and buffering in the body", module: 1, estimatedMinutes: 35, authored: true, concept: { title: "Water, pH and buffering in the body", slug: "water-ph-buffering", summary: "The water compartments of the body, what a buffer does, and the Henderson-Hasselbalch arithmetic of blood pH.", blooms: "understand", minutes: 35, prereq: [] }, content: lesson1() as never },
    { title: "Amino acids and the peptide bond", module: 1, estimatedMinutes: 35, authored: true, concept: { title: "Amino acids and the peptide bond", slug: "amino-acids-peptide-bond", summary: "The twenty standard amino acids by side-chain family, zwitterions, the essential amino acids, and the chemistry of the peptide bond.", blooms: "understand", minutes: 35, prereq: ["water-ph-buffering"] }, content: lesson2() as never },
    { title: "Protein structure hierarchy", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Protein structure hierarchy", slug: "protein-structure-hierarchy", summary: "Primary, secondary, tertiary and quaternary structure, what stabilises each, and the diseases caused by misfolding.", blooms: "analyze", minutes: 40, prereq: ["amino-acids-peptide-bond"] }, content: lesson3() as never },
    { title: "Enzymes and Michaelis-Menten kinetics", module: 1, estimatedMinutes: 45, authored: true, concept: { title: "Enzymes and Michaelis-Menten kinetics", slug: "enzyme-kinetics", summary: "How enzymes catalyse, the meaning of Vmax, Km and kcat, and competitive versus non-competitive inhibition.", blooms: "analyze", minutes: 45, prereq: ["protein-structure-hierarchy"] }, content: lesson4() as never },
    { title: "Clinical correlation: enzyme assays in diagnosis", module: 1, estimatedMinutes: 35, authored: true, concept: { title: "Clinical correlation: enzyme assays in diagnosis", slug: "clinical-enzyme-assays", summary: "The principle of serum enzyme assays, cardiac and hepatic marker series, and how to interpret a reference range.", blooms: "apply", minutes: 35, prereq: ["enzyme-kinetics"] }, content: lesson5() as never },
    ...DEEPER_LESSONS,
  ],
  sbas: MODULE_ONE_SBAS,
  prereqCourses: [],
};

export async function seedMbbsBiochemistry() {
  return seedMbbsCourse(BIOCHEMISTRY);
}

/** Idempotent: safe to run repeatedly; upserts on stable keys. */
export async function seedBiochemistry(): Promise<void> {
  await seedMbbsBiochemistry();
}

export default BIOCHEMISTRY;

// CLI usage: npx ts-node prisma/seed-courses/mbbs/biochemistry.ts
if (process.argv[1] && process.argv[1].includes("mbbs/biochemistry")) {
  seedBiochemistry()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
