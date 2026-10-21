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
// ---------------------------------------------------------------------------
// MODULE 2 — LESSON 6 — Monosaccharides, disaccharides & polysaccharides
// (fully authored)
// ---------------------------------------------------------------------------
function lesson6() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: state the general formula of a monosaccharide and name the common hexoses and pentoses; describe the ring structures of glucose, fructose and galactose and explain the anomeric carbon; describe the glycosidic bond, including the difference between an alpha and a beta linkage and what it does to the shape of the resulting polymer; state the composition of the common dietary disaccharides; name the storage and structural polysaccharides with their linkages; and explain why cellulose is indigestible to humans but starch is not.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (water, pH and buffering) for the hydrophilic chemistry of the hydroxyl group, and Lessons 2 and 3 (amino acids, the peptide bond and the four levels of protein structure), because the polysaccharides described here are built by exactly the condensation logic you have already applied to proteins.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Monosaccharide",
        text: "A single sugar unit with the general formula (CH2O)n, which cannot be hydrolysed into a smaller carbohydrate. The name of the class is the formula: the carbon is hydrated, one water per carbon, which is why the molecules are so soluble.",
      },
      {
        type: "paragraph",
        text: "Carbohydrates are the most abundant organic molecules on the planet, and almost all of them exist for one of two jobs: to store energy or to build structure. One clever twist of geometry is what makes a sugar a store rather than a wall, and it is the whole of this lesson. The alpha linkage makes a helix that an enzyme can approach; the beta linkage makes a straight cable that no enzyme can unbind.",
      },
      {
        type: "table",
        headers: ["Class", "Example", "Formula", "Role"],
        rows: [
          ["Triose", "Glyceraldehyde", "C3H6O3", "Metabolic intermediate, in glycolysis"],
          ["Pentose", "Ribose and deoxyribose", "C5H10O5", "The sugar in RNA and in DNA"],
          ["Hexose", "Glucose, fructose, galactose", "C6H12O6", "The energy currency of the body and the main dietary sugar"],
          ["Hexose derivative", "Glucosamine and galactosamine", "C6H13NO5", "The sugar of cartilage and of the bacterial cell wall"],
        ],
      },

      { type: "heading", level: 2, text: "The ring structures" },
      {
        type: "paragraph",
        text: "In solution, glucose is not an open chain. The aldehyde carbon at one end reacts with a hydroxyl on the other and the molecule closes into a ring — a six-membered ring for glucose and fructose (a pyranose) and a five-membered ring for fructose's keto form (a furanose). The carbon that was the aldehyde becomes the anomeric carbon, and it is the only carbon attached to two oxygens.",
      },
      {
        type: "definition",
        term: "Anomeric carbon",
        text: "The carbon derived from the aldehyde or ketone of the open chain, which in the ring form carries a hydroxyl whose position decides whether the sugar is alpha or beta. It is the carbon through which every glycosidic bond is formed.",
      },
      {
        type: "paragraph",
        text: "Because the ring can open and close, the hydroxyl on the anomeric carbon can flip between two configurations. Alpha means the hydroxyl points in one direction and beta means it points the other, and that single difference changes everything downstream. The same monosaccharide, the same formula and the same everything, with only one hydroxyl flipped, gives either a digestible storage polymer or an undigestible structural cable.",
      },

      { type: "heading", level: 2, text: "Worked example: alpha and beta linkages" },
      {
        type: "paragraph",
        text: "Two glucose molecules join by a glycosidic bond: the anomeric carbon of one condenses with a hydroxyl of the other, releasing water, exactly as a peptide bond forms between a carboxyl and an amino group. What the bond means depends entirely on the configuration at the anomeric carbon and on which hydroxyl of the partner reacts.",
      },
      {
        type: "table",
        headers: ["Linkage", "Between", "Resulting shape", "What it is used for"],
        rows: [
          ["Alpha 1,4", "The anomeric C1 of one glucose to the C4 of the next, both alpha", "A loose helix that turns back on itself every six units", "Starch and glycogen — the storage forms of glucose"],
          ["Beta 1,4", "The anomeric C1 of one glucose to the C4 of the next, both beta", "A straight, unbranched cable", "Cellulose, the structurally strongest polymer in nature and the fibre of the diet"],
          ["Alpha 1,6", "The anomeric C1 to the C6 of another unit", "A branch point every eight to twelve residues", "The glycogen and amylopectin branch points that let many enzymes attack the polymer at once"],
          ["Beta 1,4 (acetylated)", "Two N-acetylglucosamine units", "A long chain with alternating units", "Chitin, the shell of crustaceans and the wall of fungi"],
        ],
      },
      {
        type: "question",
        prompt: "Explain why a human can digest a potato but not a blade of grass, given that both are made of glucose.",
        answer: "The glucose units of starch are joined by alpha 1,4 linkages, which human amylase can hydrolyse. The glucose units of cellulose are joined by beta 1,4 linkages, and human enzymes cannot break that bond — the beta geometry puts the residues in a straight chain that the enzyme's active site does not fit. Only gut bacteria make cellulase.",
        explanation: "The energy in grass is not unavailable because it is small; it is unavailable because it is locked in a bond shape that our enzymes were never built to break.",
      },

      { type: "heading", level: 2, text: "The common disaccharides" },
      {
        type: "table",
        headers: ["Disaccharide", "Monosaccharides", "Linkage", "Source", "Clinical note"],
        rows: [
          ["Sucrose", "Glucose + fructose", "Alpha 1,2", "Table sugar and sugar cane", "The commonest dietary sugar"],
          ["Lactose", "Glucose + galactose", "Beta 1,4", "Milk", "Intolerance when the brush border lactase is lost in adulthood"],
          ["Maltose", "Glucose + glucose", "Alpha 1,4", "Sprouted barley and starch breakdown", "The product of partial starch digestion"],
          ["Trehalose", "Glucose + glucose", "Alpha 1,1", "Fungi and insects", "Structurally unusual, and used in organ preservation"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Lactose intolerance is the textbook example of a brush border enzyme deficiency. The enzyme lactase sits on the surface of the small bowel enterocytes and hydrolyses lactose into glucose and galactose, which are then absorbed. Without it, the disaccharide reaches the colon, where bacteria ferment it, producing gas and drawing water osmotically — hence the bloating, cramping and diarrhoea.",
      },

      { type: "heading", level: 2, text: "The polysaccharides" },
      {
        type: "table",
        headers: ["Polysaccharide", "Monomer and linkage", "Function", "Notes"],
        rows: [
          ["Starch (plant)", "Glucose, alpha 1,4 with alpha 1,6 branches in amylopectin", "The plant's glucose store", "Amylose is unbranched; amylopectin is the branched component"],
          ["Glycogen (animal)", "Glucose, alpha 1,4 with alpha 1,6 branches every eight to twelve residues", "The liver and muscle glucose store", "The branch frequency is what makes it rapidly mobilisable, unlike starch"],
          ["Cellulose (plant)", "Glucose, beta 1,4", "The structural wall of the plant cell", "The most abundant organic polymer on earth, and dietary fibre"],
          ["Chitin", "N-acetylglucosamine, beta 1,4", "The shell of crustaceans and the wall of fungi", "Chemically a modified cellulose"],
        ],
      },
      {
        type: "paragraph",
        text: "Note the design logic of glycogen: it is heavily branched, so there are many ends from which enzymes can cleave glucose, which is why a mobilised glycogen molecule can release glucose far faster than a starch granule. Muscle glycogen is used only by the muscle that stores it; liver glycogen maintains the blood glucose of the whole body.",
      },

      { type: "heading", level: 2, text: "Glycoproteins" },
      {
        type: "paragraph",
        text: "Sugars are also attached to proteins, and the resulting glycoproteins use the sugar chains as an address label rather than as an energy store. The carbohydrate can signal where a protein should go, how long it should last, and how it should be recognised by other cells. Albumin, the clotting factors and the ABO blood group antigens are all glycoproteins, and in the last case the sugars are exactly the difference between groups A, B and O.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The ABO blood group antigens are carbohydrate, not protein. They are built by glycosyltransferases that add the last terminal sugar to a precursor chain on the red cell surface. The gene that makes the A enzyme differs from the B gene by a few nucleotides, and the O allele encodes an inactive enzyme — so the antigen itself is a sugar.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying starch and cellulose differ in their monomer. Both are polymers of glucose. They differ only in the configuration of the linkage, and that is the entire lesson of this topic.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing which polysaccharide is branched. Starch is partly branched (amylopectin) and glycogen is heavily branched; cellulose is completely unbranched, because it is a structural cable.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting that lactose intolerance is an enzyme deficiency rather than an allergy. Allergy is an immune response; intolerance is a missing enzyme and it causes no immune reaction, so it cannot cause hives or anaphylaxis.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Give the general formula of a monosaccharide and explain where the name of the class comes from.",
        answer: "(CH2O)n — one carbon and one water per sugar unit. The name means hydrated carbon, and it is the reason these molecules are so soluble.",
        explanation: "The abundance of hydroxyl groups is also what lets sugars hydrogen bond with water freely, which is why sweet sugar dissolves and the fats do not.",
      },
      {
        type: "question",
        prompt: "Which carbon of glucose is the anomeric carbon, and why does it matter?",
        answer: "The carbon derived from the aldehyde of the open chain — C1 in glucose — because it is the carbon whose hydroxyl points up or down to make the alpha or beta form, and it is therefore the carbon through which every glycosidic bond is made.",
        explanation: "Every difference between starch and cellulose is a difference in the configuration at this carbon.",
      },
      {
        type: "question",
        prompt: "Why does lactose reach the colon in an adult with lactase deficiency?",
        answer: "Because the enzyme that hydrolyses lactose is on the brush border of the small bowel enterocytes; if it is absent or reduced after weaning, the disaccharide is not split into glucose and galactose and cannot be absorbed, so it reaches the bacteria of the colon, which ferment it.",
        explanation: "The treatment is to avoid the sugar or to supply the enzyme, and the diagnosis can be made with a breath hydrogen test.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which statement correctly distinguishes starch from cellulose?",
        options: [
          "Starch is a polymer of glucose with alpha linkages, and cellulose is a polymer of glucose with beta linkages",
          "Starch is a polymer of fructose, and cellulose is a polymer of glucose",
          "Both are polymers of glucose, but starch is unbranched and cellulose is heavily branched",
          "Cellulose is a polymer of N-acetylglucosamine and starch is a polymer of ribose",
        ],
        correctIndex: 0,
        explanation: "Both are glucose polymers; the difference is the alpha against beta configuration at the anomeric carbon, which changes the shape from a digestible helix to an undigestible cable.",
      },
      {
        type: "mcq",
        stem: "Which disaccharide is composed of glucose and galactose, and which enzyme is required to split it?",
        options: ["Sucrose, split by sucrase", "Maltose, split by maltase", "Lactose, split by lactase", "Trehalose, split by trehalase"],
        correctIndex: 2,
        explanation: "Lactose is galactose beta 1,4 glucose, and it is hydrolysed by the brush border enzyme lactase. Its absence in adulthood is the cause of lactose intolerance.",
      },
      {
        type: "mcq",
        stem: "Which linkage creates a branch point in glycogen?",
        options: ["Alpha 1,4", "Beta 1,4", "Alpha 1,6", "Beta 1,6"],
        correctIndex: 2,
        explanation: "The alpha 1,6 linkage to the C6 hydroxyl is the branch point, occurring every eight to twelve residues in glycogen and giving the many enzyme-accessible ends that make rapid mobilisation possible.",
      },
      {
        type: "mcq",
        stem: "Which statement about the anomeric carbon is correct?",
        options: [
          "It is the last carbon of the chain and carries three hydroxyls",
          "It is the carbon derived from the aldehyde or ketone, carries a hydroxyl that sets the alpha or beta form, and participates in every glycosidic bond",
          "It is the carbon that decides whether the sugar is an aldehyde or a ketone",
          "It is absent from the ring form of glucose",
        ],
        correctIndex: 1,
        explanation: "The anomeric carbon is the former carbonyl carbon, and the orientation of its single hydroxyl defines alpha and beta — and therefore every property the polymer will have.",
      },
      {
        type: "mcq",
        stem: "Which polysaccharide is the animal storage form of glucose, and where is it found?",
        options: ["Starch, in the liver", "Glycogen, in the liver and in muscle", "Cellulose, in the gut", "Chitin, in the bone"],
        correctIndex: 1,
        explanation: "Glycogen is heavily branched and stored in the liver, where it maintains blood glucose for the whole body, and in muscle, where it is used only by the muscle itself.",
      },
      {
        type: "mcq",
        stem: "Which statement about the ABO blood group antigens is correct?",
        options: [
          "They are proteins whose amino acid sequence differs between the groups",
          "They are carbohydrate chains on the red cell surface whose terminal sugars differ, built by glycosyltransferases",
          "They are antibodies carried on the red cell surface",
          "They are phospholipids synthesised in the liver",
        ],
        correctIndex: 1,
        explanation: "The ABO antigens are carbohydrate: the A and B alleles encode glycosyltransferases that add different terminal sugars, and the O allele encodes an inactive enzyme so the precursor chain remains unmodified.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "A monosaccharide has the formula (CH2O)n and cyclises into a ring whose anomeric carbon becomes the point of attachment for a glycosidic bond. The configuration at that carbon decides whether a glucose polymer is a digestible helix of alpha 1,4 units, as in starch and glycogen, or an undigestible straight cable of beta 1,4 units, as in cellulose — which is the entire reason a human can digest a potato and not a blade of grass. Sugars also decorate proteins as glycoproteins, and it is one such decoration that makes the ABO blood groups.",
      },
      {
        type: "paragraph",
        text: "Next: the lipids. You will meet the fatty acids and their esters, the phospholipids that make the membrane, and the steroid that is both structural and hormonal — and see why none of them can dissolve in the medium they travel through.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// MODULE 2 — LESSON 7 — Lipids: fatty acids, glycerol & sterols (fully authored)
// ---------------------------------------------------------------------------
function lesson7() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: state the general structure of a fatty acid and define saturated and unsaturated; describe how chain length and degree of unsaturation determine melting point and therefore the physical state of a fat; explain the cis and trans configurations of a double bond and their very different effects on shape; name the roles of the essential fatty acids and give two dietary sources; describe the structure of a triacylglycerol and a phospholipid and say which two reactions build them; and describe the ring structure of cholesterol and give its four metabolic fates.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (water, pH and buffering) for the hydrophilic and hydrophobic division that makes lipids behave as they do, and Lesson 6 for the condensation chemistry, which is exactly the same reaction with a different partner.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "The amphipathic molecule",
        text: "A molecule with one water soluble end and one water fearing end. Fatty acids, phospholipids and the bile salts are all amphipathic, and that single property is what makes digestion, membrane structure and cholesterol transport possible.",
      },
      {
        type: "paragraph",
        text: "Lipids are defined negatively: they are the molecules that dissolve in organic solvents and not in water. That is not a minor property — it is what dictates every function they can perform. It is why they cannot travel free in the blood, why they cannot diffuse across the watery spaces of the body, and why a fat molecule stores about twice as much energy per gram as a carbohydrate: it is already reduced, already nearly the state carbon is in when it is fully burned to carbon dioxide.",
      },
      {
        type: "table",
        headers: ["Property", "Fat (triacylglycerol)", "Carbohydrate (glycogen)"],
        rows: [
          ["Energy per gram", "About 9 kcal per gram", "About 4 kcal per gram"],
          ["Water required for storage", "Almost none, so it is stored anhydrously", "About 2 g of water per gram of glycogen, so storage is bulky"],
          ["Use by the brain", "Cannot be used directly", "Glucose is the preferred fuel"],
          ["Long term reserve", "The main reserve, in adipose tissue", "A day or less, in liver and muscle"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The fat reserve is not simply an energy store. Adipose tissue is an endocrine organ: it synthesises leptin, which signals the size of the reserve to the hypothalamus, and it carries out the final step of steroid hormone conversion. It is also the body's thermal and mechanical insulation.",
      },

      { type: "heading", level: 2, text: "Fatty acids" },
      {
        type: "paragraph",
        text: "A fatty acid is a hydrocarbon chain with a carboxyl at one end. The chain is usually 14 to 22 carbons long, and the carboxyl is the part that chemistry builds on. Both ends differ in character: the methyl end is the tail and the carboxyl end is the head, and the two are numbered separately — from the carboxyl (as C1) or from the methyl end, as the omega system.",
      },
      {
        type: "table",
        headers: ["Fatty acid", "Formula", "Saturation", "Occurrence", "Note"],
        rows: [
          ["Palmitate", "C16:0", "Saturated", "Common in palm oil and in endogenous synthesis", "The main product of the fatty acid synthase"],
          ["Stearate", "C18:0", "Saturated", "In animal fat", "Dehydrogenated to oleate by delta-9 desaturase"],
          ["Oleate", "C18:1, cis 9", "Monounsaturated", "Olive oil, the commonest fatty acid in the diet", "The one double bond gives the classic kink"],
          ["Linoleate", "C18:2, cis 9,12", "Polyunsaturated, omega-6", "Corn oil, sunflower oil, nuts", "Essential — the body cannot make it"],
          ["Alpha-linolenate", "C18:3, cis 9,12,15", "Polyunsaturated, omega-3", "Flaxseed, walnut oil, fish oil", "Essential — the second one mammals cannot make"],
          ["Arachidonate", "C20:4", "Polyunsaturated, omega-6", "Made from linoleate", "The precursor of the prostaglandins"],
        ],
      },
      {
        type: "definition",
        term: "Saturated and unsaturated",
        text: "A saturated fatty acid has no carbon-carbon double bond in its chain, so it carries the maximum possible number of hydrogens. An unsaturated fatty acid contains one (monounsaturated) or more (polyunsaturated) carbon-carbon double bonds, each of which removes two hydrogens.",
      },
      {
        type: "paragraph",
        text: "Saturation sets the melting point, and the melting point sets whether a fat is solid or liquid at room temperature. A saturated chain is fully extended and straight, so the molecules pack together tightly and are held by many weak van der Waals contacts — the fat is solid. A cis double bond puts a permanent kink in the chain, the molecules cannot pack, and the fat is liquid. This is why butter is solid and olive oil is liquid, and why tropical oils, which are highly saturated, are solid at room temperature.",
      },
      {
        type: "question",
        prompt: "Explain why a cis double bond makes an oil liquid while removing it, by hydrogenation, makes the same fat solid.",
        answer: "The cis double bond holds a rigid kink in the chain, so the molecules cannot lie alongside each other and they are held by weaker and fewer contacts, giving a low melting point and a liquid. Hydrogenation removes the double bond, the chain becomes fully extended and straight, and the molecules pack tightly and melt at a higher temperature.",
        explanation: "The hydrogenation also makes the trans by-product, which has a straight chain but is metabolically like a saturated one — the reason partially hydrogenated oils are banned in many jurisdictions.",
      },

      { type: "heading", level: 2, text: "Worked example: cis against trans" },
      {
        type: "paragraph",
        text: "The geometry of the double bond matters as much as its presence. In the cis form the two hydrogens are on the same side, so the chain bends sharply. In the trans form they are on opposite sides, so the chain stays almost straight and behaves like a saturated fatty acid, while keeping the same number of double bonds.",
      },
      {
        type: "table",
        headers: ["Configuration", "Shape", "Effect on the membrane", "Health consequence"],
        rows: [
          ["Cis", "A kink in the chain", "Fluidity is increased, because the fatty acid tails cannot pack", "The natural form of almost all dietary unsaturated fat"],
          ["Trans", "Almost straight", "The membrane is less fluid, as it is with saturation", "Raises LDL and lowers HDL, so it is treated as a saturated fat"],
        ],
      },

      { type: "heading", level: 2, text: "The essential fatty acids" },
      {
        type: "definition",
        term: "Essential fatty acids",
        text: "Linoleic acid (omega-6) and alpha-linolenic acid (omega-3), which mammals cannot synthesise because they can only introduce double bonds up to the omega-9 position. They must come from the diet, and from them the body makes the longer and more highly unsaturated derivatives.",
      },
      {
        type: "paragraph",
        text: "The pathway is the reason the omega-3 and omega-6 fats matter. Arachidonate, the precursor of the prostaglandins that mediate inflammation, is made from linoleate; and the eicosapentaenoate that makes the anti-inflammatory mediators is made from alpha-linolenate. So the ratio of omega-6 to omega-3 in the diet changes which family of mediators a cell can make, which is the biochemical basis of the dietary recommendation to eat more fish.",
      },

      { type: "heading", level: 2, text: "Triacylglycerols and phospholipids" },
      {
        type: "paragraph",
        text: "Two reactions build both classes of molecule, and both are condensations. A hydroxyl of glycerol is esterified with the carboxyl of a fatty acid, releasing water, exactly as in the peptide bond.",
      },
      {
        type: "table",
        headers: ["Molecule", "Built from", "Purpose"],
        rows: [
          ["Triacylglycerol", "Glycerol plus three fatty acids, by three ester bonds", "The storage fat, hydrophobic and anhydrous, with about 9 kcal per gram"],
          ["Phospholipid", "Glycerol plus two fatty acids, a phosphate and a polar head such as choline or inositol", "The amphipathic molecule of every membrane"],
          ["Sphingolipid", "Sphingosine instead of glycerol, plus one fatty acid and a head group", "The myelin of the nervous system, and the ABO blood group antigens"],
          ["Cholesteryl ester", "Cholesterol esterified with a fatty acid", "The storage and transport form of cholesterol"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The phospholipid is the amphipathic molecule in its purest form: a tail of two fatty acids, one usually saturated and one unsaturated, and a head of phosphate with a polar group such as choline or an inositol. In water the heads face out and the tails hide in, and the resulting double layer is the membrane.",
      },

      { type: "heading", level: 2, text: "Cholesterol" },
      {
        type: "definition",
        term: "Cholesterol",
        text: "A sterol: four fused carbon rings with a hydrophobic tail of eight carbons. It is the most abundant sterol in animal tissues and the parent compound of every other steroid.",
      },
      {
        type: "table",
        headers: ["Fate", "Product", "Why it matters"],
        rows: [
          ["Modified to bile acids", "Cholic acid and chenodeoxycholic acid", "The bile salts that emulsify dietary fat in the gut"],
          ["Reduced to vitamin D", "Cholecalciferol in the skin", "The only vitamin the body synthesises itself, in a reaction needing ultraviolet light"],
          ["Converted to steroid hormones", "Cortisol, aldosterone, progesterone, oestrogen, testosterone", "All five adrenal and gonadal steroid hormones come from this one precursor"],
          ["Built into the membrane", "Cholesterol itself", "Sits between the phospholipid tails and moderates fluidity in both directions"],
        ],
      },
      {
        type: "paragraph",
        text: "Cholesterol is both synthesised by the body and taken in the diet, and the synthesis is tightly regulated: the enzyme that makes it is itself reduced by a cholesterol-rich diet. That is why the advice to cut dietary saturated fat can lower blood cholesterol — the body simply makes less of its own. It is also why the cholesterol lowering statins are so effective: they block the committed step of synthesis, and the liver compensates by taking cholesterol out of the blood to make more.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying bile acids are synthesised from fatty acids. They are made from cholesterol, by hydroxylation, ring opening and conjugation with glycine or taurine, and the products are the most abundant solute in bile.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Believing all cholesterol is bad. It is the substrate of every steroid hormone, of vitamin D, of the bile acids, and a structural component of every membrane. Only the LDL fraction, and only in excess, is the problem.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the omega number counts from the carboxyl end. It counts from the methyl end: omega-3 means the first double bond is three carbons from the methyl end. The carboxyl-derived number is the delta system, and the two give different numbers for the same double bond.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does saturation determine the melting point of a fat?",
        answer: "Because a saturated chain is straight, so neighbouring molecules can lie against each other and are held by many weak contacts, so a lot of thermal energy is needed to melt them. A cis double bond puts a kink in the chain, so the molecules cannot pack and the melting point is low.",
        explanation: "The same principle explains why tropical oils are solid and why hydrogenating an oil raises its melting point.",
      },
      {
        type: "question",
        prompt: "Name the two essential fatty acids and say why they are described as essential.",
        answer: "Linoleic acid (omega-6) and alpha-linolenic acid (omega-3). They are essential because mammalian desaturases can only introduce double bonds up to the omega-9 position, so a double bond cannot be placed at the omega-6 or omega-3 position from a saturated chain — it must come from the diet.",
        explanation: "Both are the precursors of the longer-chain polyunsaturated fatty acids, so their dietary absence limits every downstream product.",
      },
      {
        type: "question",
        prompt: "Give the four fates of cholesterol.",
        answer: "It is converted to bile acids, to vitamin D in the skin, to the adrenal and gonadal steroid hormones, and it remains in the cell membrane where it moderates fluidity.",
        explanation: "These are the reasons a cholesterol free diet does not lower serum cholesterol much — the body is busy making its own for all four purposes.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which statement correctly describes the omega numbering of a fatty acid?",
        options: [
          "It counts carbons from the carboxyl group, which is position one",
          "It counts carbons from the methyl end, so omega-3 means the first double bond is three carbons from that end",
          "It counts double bonds rather than carbons",
          "It counts from the anomeric carbon, as in carbohydrates",
        ],
        correctIndex: 1,
        explanation: "The omega number is counted from the methyl end, and the carboxyl-derived system is the delta system. The same bond therefore has two different numbers in the two systems, which is why the naming must be specified.",
      },
      {
        type: "mcq",
        stem: "Which fatty acid is essential in the human diet?",
        options: ["Palmitate", "Stearate", "Linoleate", "Oleate"],
        correctIndex: 2,
        explanation: "Linoleate (omega-6) and alpha-linolenate (omega-3) are the two that cannot be synthesised. Palmitate, stearate and oleate are all synthesized endogenously.",
      },
      {
        type: "mcq",
        stem: "Which statement explains the difference between fat and carbohydrate as an energy reserve?",
        options: [
          "Fat stores more energy per gram, is stored without water, and so is dense",
          "Carbohydrate stores more energy per gram and is preferable for long reserves",
          "Both store about the same energy per gram, but fat is stored with more water",
          "Carbohydrate is used only by the brain and fat is used only by muscle",
        ],
        correctIndex: 0,
        explanation: "Fat is anhydrous, reduced and gives about 9 kcal per gram against the 4 kcal per gram of glycogen, so it is the only practical long term reserve.",
      },
      {
        type: "mcq",
        stem: "What is the principal product of partial hydrogenation of a vegetable oil, and why is it undesirable?",
        options: [
          "Cis double bonds, which raise the HDL",
          "Trans fatty acids, which raise LDL and lower HDL",
          "Saturated fatty acids, which are harmless",
          "Essential fatty acids, which are beneficial",
        ],
        correctIndex: 1,
        explanation: "Partial hydrogenation leaves trans double bonds, whose chains are straight like saturated ones but which behave metabolically as saturated fats, lowering HDL and raising LDL — which is why they have been removed from the food supply in many countries.",
      },
      {
        type: "mcq",
        stem: "Which of these is NOT a fate of cholesterol?",
        options: [
          "Conversion to bile acids",
          "Synthesis of vitamin D in the skin",
          "Synthesis of the adrenal and gonadal steroid hormones",
          "Conversion to glucose by gluconeogenesis",
        ],
        correctIndex: 3,
        explanation: "Glucose cannot be made from cholesterol because the ring structure cannot be broken by any mammalian pathway — fat can supply glycerol but not a net glucose in humans.",
      },
      {
        type: "mcq",
        stem: "Which pair of molecules is built by esterifying a hydroxyl of glycerol with the carboxyl of a fatty acid?",
        options: ["A peptide bond and a disaccharide", "A triacylglycerol and a phospholipid", "A steroid and a prostaglandin", "A nucleoside and a nucleotide"],
        correctIndex: 1,
        explanation: "Both the triacylglycerol and the phospholipid are formed by the esterification of glycerol's three hydroxyls with fatty acid carboxyls, losing a molecule of water for each bond.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Lipids are defined by what they will not dissolve in: water. Fatty acids are hydrocarbon chains with a carboxyl, whose saturation sets the melting point and whose cis double bonds are the kinks that make an oil liquid. Two ester bonds with glycerol make a triacylglycerol, and two esters plus a phosphate and a polar head make the amphipathic phospholipid that forms every membrane. Linoleate and alpha-linolenate are the essential fatty acids, and cholesterol — a sterol with four fused rings — is the common substrate of the bile acids, vitamin D, every steroid hormone and the membrane itself.",
      },
      {
        type: "paragraph",
        text: "Next: the membrane those phospholipids form. You will see how the same amphipathic molecule gives a barrier that is selectively permeable, and how that same barrier is what every transport mechanism in the body is fighting.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// MODULE 2 — LESSON 8 — Cell membranes & membrane transport (fully authored)
// ---------------------------------------------------------------------------
function lesson8() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the fluid mosaic model and state what the two words mean; explain how temperature, cholesterol and fatty acid composition control membrane fluidity; list the five principal membrane proteins and say what each contributes to; state which small molecules cross the membrane alone and which cannot; explain the mechanism and the energetics of the sodium-potassium ATPase; distinguish simple from facilitated diffusion and give a specific example of each; and predict what happens to a cell placed in a hypertonic, hypotonic or iso-tonic solution.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 2 (transport across cell membranes) from Module 1 for the transport categories, and Lesson 7 for the phospholipid whose amphipathic character makes the membrane possible.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Fluid mosaic model",
        text: "The membrane is a double layer of phospholipids with proteins embedded in it, which is fluid, meaning its lipids and proteins move sideways within the plane of the layer, and a mosaic, meaning the proteins are scattered through the lipid rather than lying in a separate sheet.",
      },
      {
        type: "paragraph",
        text: "One image holds the whole of the model: a thin sea of fat with icebergs in it. The sea is the double layer of phospholipid, the icebergs are the proteins, and the sea can flow, so the icebergs can drift and meet. That is why insulin receptors cluster, why a vesicle can fuse with the membrane, and why a cell can change shape without tearing itself apart.",
      },
      {
        type: "table",
        headers: ["Component", "Proportion", "Contribution"],
        rows: [
          ["Phospholipids", "The majority by mass", "The double layer itself, which forms the barrier"],
          ["Cholesterol", "About one molecule for every two phospholipids", "Moderates the fluidity in both directions, stiffening a warm membrane and loosening a cold one"],
          ["Proteins", "About half the mass in most membranes", "Transport, receptors, enzymes, cell identity and anchors"],
          ["Glycolipids and glycoproteins", "A small fraction on the outer surface only", "Cell recognition, and the ABO blood group antigens"],
        ],
      },

      { type: "heading", level: 2, text: "Worked example: fluidity is a controlled variable" },
      {
        type: "paragraph",
        text: "The fluidity of the membrane is not a happy accident; it is actively regulated, and the reasons are the ones you have already learned. A membrane that is too rigid stops its proteins from moving, so receptors cannot cluster and transport slows. A membrane that is too fluid leaks its gradients, so the cell cannot hold its contents.",
      },
      {
        type: "table",
        headers: ["Factor", "Effect on fluidity", "Mechanism"],
        rows: [
          ["Temperature", "A rise increases fluidity, a fall decreases it", "Heat gives the fatty acid tails energy to move; cold makes them settle in order"],
          ["Unsaturation", "More cis double bonds increase fluidity", "The kink in the chain prevents orderly packing of the tails"],
          ["Chain length", "Shorter chains increase fluidity", "Fewer van der Waals contacts hold the bilayer together"],
          ["Cholesterol", "Reduces fluidity when warm, increases it when cold", "The rigid ring sits between the tails and restrains them, while its bulk stops the tails packing when cold"],
          ["Sphingolipids", "Decrease fluidity", "Their straighter saturated chains pack tightly, forming lipid rafts"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The double action of cholesterol is the part worth pausing on: it is a fluidity buffer, not simply a stiffener. It keeps the membrane from becoming either too fluid at body temperature or too rigid at a lower one, which is part of why the cholesterol concentration of the membrane is so tightly controlled.",
      },

      { type: "heading", level: 2, text: "The membrane proteins" },
      {
        type: "table",
        headers: ["Class", "Example", "Function"],
        rows: [
          ["Channel", "The potassium leak channel, the aquaporin", "Allows one solute or water to move passively down a gradient"],
          ["Carrier (transporter)", "The glucose transporter GLUT1, the chloride bicarbonate exchanger", "Binds a solute on one side, changes shape and releases it on the other"],
          ["Pump", "The sodium-potassium ATPase, the calcium ATPase", "Uses ATP directly to move a solute against its gradient"],
          ["Receptor", "The insulin receptor, the beta adrenergic receptor", "Binds a messenger on the outside and signals on the inside"],
          ["Enzyme", "Adenylate cyclase, the sodium hydrogen exchanger", "Catalyses a reaction at the membrane surface"],
          ["Structural and junctional", "Integrins and cadherins, the tight junction proteins", "Attach the cell to its neighbours and to the matrix, and seal the space between cells"],
        ],
      },

      { type: "heading", level: 2, text: "What crosses, and what cannot" },
      {
        type: "paragraph",
        text: "The double layer is a barrier to everything charged and to most things large, and that is exactly why a cell is a cell. Test the rule against the small molecules of the body.",
      },
      {
        type: "table",
        headers: ["Solute", "Crosses freely?", "Reason", "Consequence"],
        rows: [
          ["Oxygen and carbon dioxide", "Yes", "Small and non-polar, so they dissolve in the lipid", "Gas exchange across the alveolar and placental barrier needs no transporter"],
          ["Water", "Yes, slowly, and rapidly through aquaporins", "Small and uncharged", "Cells are always near osmotic equilibrium with their surroundings"],
          ["Ethanol and urea", "Yes", "Small and uncharged", "Urea equilibrates across membranes, which is why it is an ineffective osmole"],
          ["Glucose", "No", "Large and polar, and its hydroxyls hydrogen bond with water", "Needs a specific transporter, which is why diabetes is a transporter defect as well as a hormonal one"],
          ["Sodium and potassium", "No", "Charged", "The gradient is what every action potential and every pump depends on"],
          ["Proteins", "No", "Very large", "Plasma proteins give the oncotic pressure, because they are trapped on one side"],
          ["Hydrogen ions", "No", "Charged", "pH can be held different in two compartments, which is the basis of the bicarbonate buffer's open system"],
        ],
      },

      { type: "heading", level: 2, text: "Worked example: the pump that builds the gradients" },
      {
        type: "paragraph",
        text: "The sodium-potassium ATPase is the most important protein in this whole module, and worth a worked example. It cycles through two conformations and, in each full cycle, moves three sodium out and two potassium in, using one ATP. The stoichiometry is fixed and fixed for a reason.",
      },
      {
        type: "table",
        headers: ["Step", "What happens", "Energy or consequence"],
        rows: [
          ["Binding from inside", "It binds three sodium ions on the cytoplasmic side", "Sets the stoichiometry"],
          ["Phosphorylation", "ATP donates a phosphate to an aspartate on the pump, changing its shape", "One ATP per cycle"],
          ["Release outside", "The shape change opens the exterior face and releases the three sodium", "Moves sodium against a steep gradient"],
          ["Binding from outside", "It now binds two potassium ions on the exterior side", "Sets the counter stoichiometry"],
          ["Dephosphorylation", "The phosphate is lost, the shape reverts, and the potassium is released inside", "The two ions enter against their gradient"],
        ],
      },
      {
        type: "paragraph",
        text: "Because three positive charges leave and only two enter, the pump is electrogenic: it drives a net positive charge out of the cell, contributing a few millivolts to the inside-negative resting potential. That contribution is small, but it is not zero, which is worth remembering when you add up the contributions to the minus seventy millivolts you learned in Module 1.",
      },

      { type: "heading", level: 2, text: "Simple and facilitated diffusion" },
      {
        type: "table",
        headers: ["Class", "Driving force", "Specificity", "Saturable", "Example"],
        rows: [
          ["Simple diffusion", "The concentration gradient alone", "No, any small non-polar solute", "No, rate rises linearly with concentration", "Oxygen into the tissues"],
          ["Facilitated diffusion", "The concentration gradient alone", "Yes, the channel or carrier only accepts one solute", "Yes, all binding sites occupied gives a maximum rate", "GLUT1 moving glucose into a resting muscle cell"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Saturation is the feature that separates facilitated from simple diffusion, and it is what makes a transporter a drug target. The glucose transporter is saturated at high blood glucose, which is the reason kidney reabsorption of glucose has a transport maximum, and the reason glucose appears in the urine once it is exceeded.",
      },
      {
        type: "question",
        prompt: "A patient with a transport maximum defect reabsorbs no glucose in the kidney. What is the direct consequence, and which cellular mechanism is at fault?",
        answer: "Glucose appears in the urine because the proximal tubule's sodium-glucose linked transporter is missing, so the filtered glucose is not reclaimed. It is a secondary active transport defect, in which the sodium gradient built by the pump drives glucose in against its own gradient.",
        explanation: "The transport maximum is the rate at which every binding site on those transporters is occupied; above it, glucose spills into the urine unchanged.",
      },

      { type: "heading", level: 2, text: "Tonicity" },
      {
        type: "definition",
        term: "Tonicity",
        text: "The property of a solution that determines whether a cell placed in it will gain or lose water. It counts only the solutes that cannot cross the membrane, because only a non-penetrating solute can create a lasting osmotic difference.",
      },
      {
        type: "paragraph",
        text: "Tonicity is a word that catches almost everyone out, and the reason is worth spelling out. Osmolarity counts every dissolved particle; tonicity counts only the ones that cannot cross. A saline solution and a urea solution at the same osmolarity will not have the same tonicity, because urea crosses a cell membrane freely and settles on both sides, so it holds no water on either side.",
      },
      {
        type: "table",
        headers: ["Solution", "Osmolarity versus the cell", "What happens", "Example"],
        rows: [
          ["Isotonic", "Equal effective osmolarity", "The cell keeps its volume and its shape", "0.9 per cent saline, 5 per cent glucose"],
          ["Hypotonic", "Fewer non-penetrating solutes than the cell", "Water enters and the cell swells, and may lyse", "Distilled water"],
          ["Hypertonic", "More non-penetrating solutes than the cell", "Water leaves and the cell shrinks and crenates", "3 per cent saline"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The normal saline solution given intravenously is 0.9 per cent, and the figure is not arbitrary: it is the concentration that is isotonic to human plasma. Giving water intravenously instead would lyse red cells; giving 3 per cent saline is a deliberate treatment for cerebral oedema.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a cell placed in isotonic urea swells and bursts. It does not, because urea is freely penetrating, so it equilibrates across the membrane and exerts no lasting osmotic force. A solution can be iso-osmotic and still be hypo- or hypertonic.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting that the pump is not the only thing that makes the resting potential. It contributes a few millivolts directly; the minus seventy millivolts comes mostly from the potassium leak through open channels, as Lesson 3 set out.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying facilitated diffusion saturates but simple diffusion does not. That is right, but the saturation is why the rate of a facilitated process reaches a maximum that a simple one never does — which is what makes a carrier the rate limiting step of a pathway.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Explain the two words in the fluid mosaic model.",
        answer: "Fluid means that the phospholipids and the proteins move laterally within the plane of the layer, so the membrane flows rather than sitting as a fixed sheet. Mosaic means that the proteins are scattered as discrete units through the lipid, rather than forming separate layers of their own.",
        explanation: "The fluidity is what allows vesicle fusion, receptor clustering and cell movement; the mosaic is what allows the membrane to carry out many functions at once.",
      },
      {
        type: "question",
        prompt: "State the stoichiometry of the sodium-potassium ATPase and explain why the third positive charge matters.",
        answer: "Three sodium out and two potassium in per ATP. Because three positive charges leave and only two enter, the cycle makes the outside of the cell more positive, so the pump is directly electrogenic and contributes a few millivolts to the resting potential.",
        explanation: "The overall effect is inward, not zero: a net one positive charge leaves the cell per cycle.",
      },
      {
        type: "question",
        prompt: "A red cell is placed in iso-osmolar urea and bursts. Explain, using the concept of penetrating and non-penetrating solutes.",
        answer: "Urea crosses the red cell membrane freely, so it distributes equally on both sides and exerts no lasting osmotic force. The cell's own non-penetrating solutes remain trapped inside, so water enters down the gradient the cell creates for itself and the cell swells and bursts.",
        explanation: "An iso-osmotic solution is not necessarily isotonic, and the difference lies entirely in whether the solute can cross.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which statement correctly describes the effect of cholesterol on a cell membrane?",
        options: [
          "It always increases fluidity, whatever the temperature",
          "It always decreases fluidity, whatever the temperature",
          "It reduces fluidity when the membrane is warm and increases fluidity when it is cold",
          "It has no effect on fluidity, only on transport",
        ],
        correctIndex: 2,
        explanation: "The rigid steroid ring restrains the fatty acid tails in a warm membrane, but its bulk stops those tails settling into order when it is cold. Cholesterol is a fluidity buffer, not a one-way stiffener.",
      },
      {
        type: "mcq",
        stem: "Which solute cannot cross the plasma membrane by simple diffusion?",
        options: ["Oxygen", "Carbon dioxide", "Ethanol", "Glucose"],
        correctIndex: 3,
        explanation: "Glucose is large, polar and heavily hydrogen bonded to water, so it needs a specific transporter. Oxygen, carbon dioxide and ethanol are small and non-polar, so they dissolve in the lipid and cross.",
      },
      {
        type: "mcq",
        stem: "What is the stoichiometry of the sodium-potassium ATPase per cycle?",
        options: [
          "Two sodium out and three potassium in",
          "Three sodium out and two potassium in, using one ATP",
          "One sodium out and one potassium in, using one ATP",
          "Three potassium out and two sodium in, using one ATP",
        ],
        correctIndex: 1,
        explanation: "Three sodium out and two potassium in, per ATP hydrolysed. The outward excess of positive charge is what makes the pump electrogenic.",
      },
      {
        type: "mcq",
        stem: "Which feature distinguishes facilitated diffusion from simple diffusion?",
        options: [
          "Facilitated diffusion requires ATP while simple diffusion does not",
          "Facilitated diffusion is specific and saturable, and moves solute only down its gradient",
          "Facilitated diffusion can move solute up its gradient",
          "Simple diffusion is specific but not saturable",
        ],
        correctIndex: 1,
        explanation: "Facilitated diffusion uses a channel or carrier and is therefore both specific and saturable, but it is still passive — it requires no ATP and only moves down a gradient.",
      },
      {
        type: "mcq",
        stem: "A red cell is placed in a solution that is iso-osmotic but contains only urea, which crosses the membrane freely. What happens?",
        options: [
          "Nothing, because the solution is iso-osmotic",
          "The cell swells and bursts, because urea is penetrating and holds no water on either side",
          "The cell shrinks, because urea draws water out",
          "The cell fills with urea but keeps its volume",
        ],
        correctIndex: 1,
        explanation: "Iso-osmotic is not the same as isotonic. A penetrating solute distributes across the membrane and exerts no lasting force, so the cell's own trapped solutes draw water in and it swells.",
      },
      {
        type: "mcq",
        stem: "Which statement about the membrane is correct?",
        options: [
          "Cholesterol and phospholipids occur in equal numbers, so cholesterol dominates the membrane by mass",
          "The glycolipids and glycoproteins are on the outer surface only, and they carry out cell recognition",
          "Integral proteins sit in a separate sheet over the lipid bilayer",
          "Peripheral proteins span the bilayer from side to side",
        ],
        correctIndex: 1,
        explanation: "The carbohydrate chains are on the outer leaflet only, and they are the molecules of cell recognition, which is why the ABO blood group antigens are carbohydrate. Integral proteins span the bilayer; peripheral proteins sit on one surface.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The membrane is a fluid mosaic of phospholipid with proteins scattered through it, and its fluidity is controlled by three things at once — temperature, chain unsaturation and cholesterol, which is a buffer rather than a simple stiffener. The double layer excludes every charged and every large molecule, so nothing the cell needs can cross freely except oxygen, carbon dioxide and water, and everything else depends on the membrane's proteins. The sodium-potassium ATPase builds the sodium and potassium gradients with a fixed three-out, two-in stoichiometry, and everything else in physiology rides on gradients it made.",
      },
      {
        type: "paragraph",
        text: "Next: the other organic compounds of the body. You will meet the vitamins and the trace elements, which are the smallest quantities of material in the whole of nutrition and the ones whose absence is most disabling.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// MODULE 2 — LESSON 9 — Vitamins & trace elements (fully authored)
// ---------------------------------------------------------------------------
function lesson9() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define a vitamin and state thirteen of them by name with their solubility class; give the coenzyme role of each of the B vitamins and the main clinical consequence of each deficiency; state why the fat-soluble vitamins accumulate in the body and the water-soluble do not; explain why fat malabsorption produces the fat-soluble deficiencies first; state which vitamin is made by the body and which two are largely made by gut bacteria; name the trace elements with their principal enzymatic roles; and explain why iron is both essential and toxic.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 4 of Module 1 (enzymes and kinetics), because coenzymes are what most vitamins actually are in the body, and Lesson 7 for the fat in which the fat-soluble vitamins travel.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Vitamin",
        text: "An organic compound that the body cannot make in sufficient quantity and that must therefore be supplied by the diet, and that is required in small amounts for normal metabolism. Almost all of them are not nutrients at all in the ordinary sense — they are enzyme cofactors.",
      },
      {
        type: "paragraph",
        text: "The single idea that reorganises this topic is that a vitamin is not a fuel and not a building block. It is a part of the enzyme's machinery: a coenzyme or a prosthetic group that the enzyme must have to work at all. Once you hold that, every deficiency disease stops being a list to memorise and becomes a consequence of one enzyme pathway failing — and every vitamin's toxicity stops being arbitrary.",
      },
      {
        type: "table",
        headers: ["Class", "Members", "Absorption", "Storage", "Toxicity"],
        rows: [
          ["Fat-soluble", "Vitamins A, D, E and K", "With dietary fat, via micelles and chylomicrons", "Stored in the liver and in adipose tissue, so a deficiency takes months or years", "Real, because they accumulate"],
          ["Water-soluble", "Vitamin C and the B complex — B1, B2, B3, B5, B6, B7, B9 and B12", "Directly across the gut and by specific transporters", "Little stored, so a deficiency takes weeks or months", "Rare, because the excess is excreted in the urine"],
        ],
      },

      { type: "heading", level: 2, text: "The fat-soluble vitamins" },
      {
        type: "table",
        headers: ["Vitamin", "Role", "Deficiency", "Note"],
        rows: [
          ["A (retinol)", "Rhodopsin in the rod cells; epithelial differentiation", "Night blindness, then xerophthalmia and keratomalacia leading to blindness", "The commonest nutritional cause of blindness worldwide"],
          ["D (cholecalciferol)", "Ca2+ and phosphate absorption from the gut; mineralisation of bone", "Rickets in the child and osteomalacia in the adult", "Synthesised in the skin from 7-dehydrocholesterol by ultraviolet light, then hydroxylated in the liver and the kidney"],
          ["E (tocopherol)", "An antioxidant in membranes, protecting the PUFA from peroxidation", "Haemolysis in the premature infant and a spinocerebellar ataxia", "Given as a supplement in fat malabsorption and in the premature"],
          ["K", "Cofactor for the carboxylase that gamma-carboxylates factors II, VII, IX and X and proteins C and S", "Bleeding, presenting with a prolonged prothrombin time", "Made largely by gut bacteria; the newborn dose prevents haemorrhagic disease"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Fat malabsorption produces the fat-soluble deficiencies first, because these vitamins depend on the same bile salt micelle system as dietary fat. A patient with coeliac disease, cystic fibrosis or an obstructed bile duct is deficient in A, D, E and K before any B vitamin is short — and the bleeding that follows is just the factors failing.",
      },

      { type: "heading", level: 2, text: "The B vitamins: all coenzymes" },
      {
        type: "paragraph",
        text: "The B complex are all water-soluble cofactors, and the pattern of each deficiency disease is a map of the one pathway it serves. Take them in order, and the disease names become derivations rather than facts to be learned.",
      },
      {
        type: "table",
        headers: ["Vitamin", "Coenzyme made", "Principal reaction", "Deficiency disease"],
        rows: [
          ["B1, thiamine", "Thiamine pyrophosphate", "Decarboxylates alpha-keto acids: pyruvate dehydrogenase and alpha-ketoglutarate dehydrogenase", "Beriberi, and Wernicke encephalopathy with Korsakoff psychosis"],
          ["B2, riboflavin", "Flavin adenine dinucleotide and flavin mononucleotide", "The redox flavoproteins of oxidative phosphorylation", "Angular stomatitis, glossitis and cheilosis"],
          ["B3, niacin", "Nicotinamide adenine dinucleotide", "The hydride acceptor of the dehydrogenases", "Pellagra — dermatitis, diarrhoea, dementia"],
          ["B5, pantothenate", "Coenzyme A", "Carries two-carbon units as acetyl-CoA", "Rare, and only experimentally induced"],
          ["B6, pyridoxine", "Pyridoxal phosphate", "Transamination, decarboxylation and glycogen phosphorylase", "Sideroblastic anaemia, and neuropathy from isoniazid"],
          ["B7, biotin", "A covalently bound prosthetic group", "The carboxylases, adding carbon dioxide", "Dermatitis and alopecia, from raw egg white"],
          ["B9, folate", "Tetrahydrofolate, the one-carbon donor", "Thymidine and purine synthesis", "Megaloblastic anaemia and neural tube defect"],
          ["B12, cobalamin", "Methylcobalamin and adenosylcobalamin", "Methionine synthase and methylmalonyl-CoA mutase", "Pernicious anaemia and subacute combined degeneration of the cord"],
        ],
      },
      {
        type: "question",
        prompt: "Why is pellagra called the disease of the three Ds, and what does that have to do with niacin's role?",
        answer: "Because its triad is dermatitis, diarrhoea and dementia (and, untreated, death), and the reason is that niacin is the NAD precursor. Without it the dehydrogenases of glycolysis, the citric acid cycle and oxidative phosphorylation cannot pass hydride, so the tissues with the highest metabolic rate — the gut, the skin and the brain — are the first to fail.",
        explanation: "This is why tryptophan can partly substitute for niacin: it is the dietary precursor of the vitamin, which is also why a maize-only diet, low in tryptophan, produces it.",
      },

      { type: "heading", level: 2, text: "Worked example: why Wernicke appears in the alcoholic patient" },
      {
        type: "paragraph",
        text: "Three mechanisms converge in the same patient and they are worth separating. First, alcohol displaces food, so the thiamine intake falls. Second, alcohol damages the intestinal mucosa, so absorption falls. Third, and most important, the metabolism of ethanol pulls thiamine into the pyruvate dehydrogenase step, so the requirement rises at the very moment the supply is falling. The triad of classic encephalopathy — confusion, ataxia and ophthalmoplegia — follows.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Glucose must never be given to a malnourished alcoholic patient before thiamine. The glucose load consumes the tiny remaining thiamine in the pyruvate dehydrogenase step and can precipitate Wernicke encephalopathy. Thiamine is given first, then the glucose — a single rule of order that is one of the most important in emergency medicine.",
      },

      { type: "heading", level: 2, text: "Vitamin C and vitamin D" },
      {
        type: "definition",
        term: "Ascorbate (vitamin C)",
        text: "A water-soluble antioxidant that is the required cofactor for the hydroxylases that modify collagen — prolyl and lysyl hydroxylase in particular — and for the hydroxylase of carnitine and of dopamine.",
      },
      {
        type: "paragraph",
        text: "Scurvy is the pathology of unmodified collagen, and that makes it a disease of every collagen dependent structure in the body. The enzyme cannot hydroxylate its proline residues, so the triple helix cannot be cross-linked into a tensile fibre, and the tissues that depend on tensile collagen fall apart first: the gums swell and bleed, the hairs corkscrew, old wounds reopen and the bleeding is from a capillary wall with no collagen to support it. The other value of ascorbate is the one that explains why it is included in every wound healing advice: it is a reductant that keeps the iron of the prolyl hydroxylase in its ferrous state.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The guinea pig, like the human, cannot make vitamin C, because the last enzyme of the synthetic pathway is non-functional in both species. That is why it was the experimental model for scurvy, and why the requirement for ascorbate in humans is the result of an ancient mutation that has been selected against nowhere.",
      },
      {
        type: "paragraph",
        text: "Vitamin D is the exception in the whole of this lesson, because it is both taken in the diet and made in the body. It is synthesised in the skin from 7-dehydrocholesterol by a reaction requiring ultraviolet light, hydroxylated in the liver to 25-hydroxyvitamin D, and hydroxylated again in the kidney to the active 1,25-dihydroxyvitamin D. That last step is regulated by parathyroid hormone and by phosphate, and it is the step of the drug vitamin D analogues.",
      },

      { type: "heading", level: 2, text: "Trace elements" },
      {
        type: "table",
        headers: ["Element", "Principal role", "Deficiency consequence", "Note"],
        rows: [
          ["Iron", "Haem and other haemoproteins, and the iron-sulphur clusters", "Microcytic hypochromic anaemia", "The only metal whose excess is also toxic, which is why overload is a disease"],
          ["Iodine", "The thyroid hormones T3 and T4", "Goitre, and cretinism in the infant", "The reason for universal salt iodisation"],
          ["Zinc", "A catalytic or structural metal in over a hundred enzymes, and the DNA binding finger of transcription factors", "Growth retardation, poor wound healing, acrodermatitis enteropathica, hypogonadism", "The commonest trace element deficiency in the developing world"],
          ["Selenium", "Glutathione peroxidase and the deiodinases that activate T4 to T3", "Keshan cardiomyopathy", "Defined by soil, and by one or two endemic areas"],
          ["Magnesium", "A cofactor for every ATP requiring enzyme, and the stabiliser of the ribosome", "Tremor, seizures and arrhythmia", "Deficiency is common and is the first thing to look for in unexplained hypokalaemia"],
          ["Fluoride", "The hydroxyapatite of enamel and bone", "Dental caries", "Added to water and toothpaste, and the target of a WHO campaign"],
          ["Cu", "Cytochrome oxidase, lysyl oxidase and NADPH-dependent enzymes", "Menkes disease, and myelopathy in the deficient adult", "Deficiency damages the collagen cross-linking"],
          ["Iodine", "Thyroid hormone synthesis", "Goitre", "The same element appears also as part of selenium metabolism"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying thiamine is only a nerve vitamin. Its coenzyme is required by three central dehydrogenases, and its deficiency damages the most metabolically active tissues, which is why both beriberi and Wernicke appear.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying vitamin B12 is made in the body. It is made by bacteria, largely in the colon, which is too far down for the terminal ileum to absorb the vitamin made there — so it must be taken in the diet, which is why strict vegans need a supplement.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting that copper is also required for collagen. The lysyl oxidase that makes cross-links between collagen molecules is a copper enzyme, so copper deficiency is a connective tissue disease too.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why must thiamine be given before glucose to a malnourished alcoholic patient?",
        answer: "Because thiamine pyrophosphate is the cofactor for pyruvate dehydrogenase, so the metabolism of a glucose load falls on the one step needing thiamine. Giving the glucose first consumes the small remaining supply and can precipitate Wernicke encephalopathy.",
        explanation: "The rule is thiamine, then glucose. It is one of the few places in medicine where the order of two intravenous drugs is a matter of permanent brain damage.",
      },
      {
        type: "question",
        prompt: "Name the coenzyme formed from each of B2, B3, B5 and B9, and the deficiency disease of B3.",
        answer: "Riboflavin forms FAD and FMN; niacin forms NAD and NADP; pantothenate forms coenzyme A; folate forms tetrahydrofolate. The deficiency disease of niacin is pellagra — dermatitis, diarrhoea and dementia.",
        explanation: "The pattern is that all four are the vitamin precursors of the coenzymes that move hydride and acyl groups, which is why their deficiencies hit the gut, the skin and the brain.",
      },
      {
        type: "question",
        prompt: "Why does fat malabsorption produce deficiency of A, D, E and K before any of the B vitamins?",
        answer: "Because the fat-soluble vitamins depend on the bile salt micelle system and chylomicron transport that also carries dietary fat, so a patient with any disorder of fat absorption loses them first. The water-soluble vitamins are absorbed directly and by specific transporters.",
        explanation: "This is why a patient with obstructive jaundice or coeliac disease is checked for prothrombin time and for the fat-soluble vitamins before the B complex.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which set of vitamins is fat-soluble?",
        options: ["A, B and C", "C, D and E", "A, D, E and K", "B1, B2 and B12"],
        correctIndex: 2,
        explanation: "A, D, E and K are the fat-soluble group, which is why a fat malabsorber becomes deficient in exactly these four and why vitamin K is given to the newborn.",
      },
      {
        type: "mcq",
        stem: "Which coenzyme is formed from a B vitamin?",
        options: [
          "Rhodopsin from vitamin A",
          "Flavin adenine dinucleotide from riboflavin",
          "Insulin from zinc",
          "Thyroid hormone from iodine",
        ],
        correctIndex: 1,
        explanation: "Riboflavin is the precursor of both FAD and FMN, which are the redox prosthetic groups of the flavoproteins. Rhodopsin is not an enzyme cofactor, and zinc and iodine are metals, not vitamins.",
      },
      {
        type: "mcq",
        stem: "Which statement about vitamin C is correct?",
        options: [
          "It is fat-soluble and accumulates in the liver",
          "It is water-soluble and is the reductant cofactor for the prolyl and lysyl hydroxylases of collagen",
          "It is made by the human liver from glucose",
          "It is the precursor of NAD and is therefore required for glycolysis",
        ],
        correctIndex: 1,
        explanation: "Ascorbate is water-soluble and is required to keep the iron of prolyl hydroxylase ferrous, which is why its absence, scurvy, is a disease of collagen.",
      },
      {
        type: "mcq",
        stem: "Which statement about vitamin D is correct?",
        options: [
          "It is made entirely in the kidney from 7-dehydrocholesterol",
          "It is synthesised in the skin from 7-dehydrocholesterol by ultraviolet light and is activated by hydroxylation in the liver and the kidney",
          "It is absorbed with fat and is never made in the body",
          "It is the cofactor for clotting factors II, VII, IX and X",
        ],
        correctIndex: 1,
        explanation: "Vitamin D is the one vitamin humans can make, and only when the skin sees ultraviolet light. The calcium and phosphate absorption is the job of the doubly hydroxylated 1,25-dihydroxyvitamin D.",
      },
      {
        type: "mcq",
        stem: "Which trace element is required for the glutathione peroxidase that protects cells from oxidative damage?",
        options: ["Iodine", "Selenium", "Copper", "Fluoride"],
        correctIndex: 1,
        explanation: "Selenium is the cofactor for glutathione peroxidase and for the deiodinases that activate T4 to T3. Iodine is in the thyroid hormones and copper in lysyl oxidase.",
      },
      {
        type: "mcq",
        stem: "A patient on isoniazid develops sideroblastic anaemia and neuropathy. Which vitamin is deficient?",
        options: ["Thiamine", "Riboflavin", "Pyridoxine", "Cobalamin"],
        correctIndex: 2,
        explanation: "Isoniazid binds and inactivates pyridoxal phosphate, so aminolaevulinate synthase in haem synthesis fails and the anaemia is sideroblastic. Pyridoxine prophylaxis is given with isoniazid treatment.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Vitamins are coenzymes, not fuels and not building blocks. The four fat-soluble ones — A, D, E and K — travel with dietary fat, are stored, and therefore fail first in fat malabsorption. The water-soluble ones are the B complex and vitamin C, each of whose deficiency disease is a map of a single enzyme pathway failing: the flavins for the redox, the NAD for the hydride, the pyridoxal phosphate for the amino acid reactions, the tetrahydrofolate for DNA, and the cobalamin for the two reactions that the pathway cannot substitute. The trace elements are the metals and the selenium of the same enzymes, and iron remains the only one whose excess is as dangerous as its deficiency.",
      },
      {
        type: "paragraph",
        text: "Next: chemical messengers. You will see how a message is carried, received and translated into an effect inside the cell — and why the same messenger produces entirely different effects in different tissues.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// MODULE 2 — LESSON 10 — Chemical messengers & signal transduction
// (fully authored)
// ---------------------------------------------------------------------------
function lesson10() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: distinguish the endocrine, paracrine, autocrine, neuroendocrine and synaptic modes of signalling by distance and by route; classify the chemical messengers into three classes with examples of each and explain the difference in their receptor site; describe the mechanism of a G-protein coupled receptor and the two principal second messengers; describe the mechanism of a receptor tyrosine kinase and one pathway downstream of it; explain how one messenger produces different effects in different tissues; and distinguish the amplification of a second messenger from the speed of a directly gated channel.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 4 of Module 1 (enzymes and kinetics), because the effectors here are enzymes whose kinetics determine how fast the response can be, and Lesson 8 for the receptor as a membrane protein.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Signal transduction",
        text: "The set of processes by which a message arriving at the cell surface is recognised by a receptor and converted into an intracellular response — the translation of one chemical event into a functional change in the cell's behaviour.",
      },
      {
        type: "paragraph",
        text: "The central problem of signal transduction is speed against strength. A ligand-gated channel opens in a quarter of a millisecond and can do nothing else. A G-protein coupled receptor takes hundreds of milliseconds but each receptor can generate thousands of second messenger molecules, so the response is enormous. Evolution solved the problem by using both, in different places for different purposes — direct gating in the brain and at the neuromuscular junction, second messengers in the endocrine system where a single hormone must reach a whole tissue at once.",
      },
      {
        type: "table",
        headers: ["Class of messenger", "Route", "Speed", "Examples"],
        rows: [
          ["Endocrine", "Through the blood, to distant cells", "Seconds to hours", "Insulin, cortisol, thyroid hormone, oestrogen"],
          ["Paracrine", "By diffusion to a neighbouring cell", "Milliseconds to seconds", "Histamine, the prostaglandins, nitric oxide"],
          ["Autocrine", "Acts on the cell that made it", "Variable", "Many growth factors, and some interleukin actions"],
          ["Neuroendocrine", "A specialised neuron releasing into the blood", "Seconds to minutes", "Antidiuretic hormone, oxytocin, the hypothalamic releasing hormones"],
          ["Synaptic", "Across a narrow junction to a target cell", "Milliseconds", "Acetylcholine at the motor end plate, glutamate, GABA"],
        ],
      },

      { type: "heading", level: 2, text: "The three classes of chemical messenger" },
      {
        type: "table",
        headers: ["Class", "Example", "Receptor site", "Mechanism"],
        rows: [
          ["Polar and protein messengers", "All the peptide and amine hormones, the cytokines", "On the cell surface", "Cannot cross the lipid, so the receptor is the transducer"],
          ["Steroid and thyroid hormones", "Cortisol, aldosterone, oestrogen, testosterone, thyroxine", "Inside the cell", "Cross the membrane freely and bind a nuclear receptor"],
          ["Gaseous", "Nitric oxide", "Inside the target cell", "Diffuses across and directly activates guanylate cyclase"],
        ],
      },
      {
        type: "paragraph",
        text: "This table is the most useful distinction in the whole of endocrinology, because it explains two fundamental differences between the hormones. A peptide hormone acts in seconds, because it only needs to find a receptor on the outside; a steroid hormone acts over hours, because it must first cross the membrane, then the nuclear membrane, then change gene transcription, and wait for the protein to be made. A peptide hormone's effects fade in minutes as it is cleared; a steroid hormone's effects persist as long as the proteins it induced.",
      },
      {
        type: "question",
        prompt: "Why does a patient given hydrocortisone intravenously not improve for hours, while one given intravenous adrenaline is altered within seconds?",
        answer: "Adrenaline is a peptide amine that binds a surface receptor, so the response is gated in seconds. Cortisol is a steroid that crosses the membrane, binds a nuclear receptor, changes transcription, and the effect takes hours to build and hours to wear off.",
        explanation: "This is also why a steroid cannot be used to reverse anaphylaxis and why adrenaline cannot substitute for the long term anti-inflammatory action.",
      },

      { type: "heading", level: 2, text: "Worked example: the G-protein coupled receptor" },
      {
        type: "paragraph",
        text: "The G-protein coupled receptor is the largest single family of receptors in the body, and the mechanism is worth following step by step because nearly all of pharmacology meets it.",
      },
      {
        type: "table",
        headers: ["Step", "What happens", "Consequence"],
        rows: [
          ["Ligand binds", "The messenger binds the extracellular face of the receptor", "The receptor changes shape"],
          ["G-protein exchanges", "A G-protein bound to the intracellular face exchanges its GDP for GTP", "The G-protein dissociates from the receptor"],
          ["Effector activation", "The alpha subunit activates adenylate cyclase, or phospholipase C, or an ion channel", "The second messenger is generated"],
          ["Second messenger", "Cyclic AMP, or diacylglycerol and inositol trisphosphate, or cGMP, accumulates", "A protein kinase is activated"],
          ["Protein kinase", "Phosphate is transferred to a target protein, changing its activity", "The cellular response is produced"],
          ["Termination", "A phosphodiesterase, or a phosphatase, or the GTP hydrolysis of the G-protein", "The response stops"],
        ],
      },
      {
        type: "definition",
        term: "Cyclic AMP",
        text: "The commonest second messenger, made by adenylate cyclase from ATP and destroyed by phosphodiesterase. It works entirely by activating protein kinase A, which then phosphorylates target proteins.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Caffeine works at the phosphodiesterase step. By inhibiting the enzyme that destroys cyclic AMP, it raises the concentration of the messenger and prolongs every response that uses the adenylate cyclase pathway — which is why it increases heart rate and alertness at the same time.",
      },
      {
        type: "paragraph",
        text: "The alternative G-protein pathway is equally important. Phospholipase C splits the membrane lipid PIP2 into two products: inositol trisphosphate, which releases calcium from the endoplasmic reticulum, and diacylglycerol, which activates protein kinase C. The calcium route is the one that links a surface event to the universal intracellular signal.",
      },

      { type: "heading", level: 2, text: "The receptor tyrosine kinase" },
      {
        type: "paragraph",
        text: "Insulin and the growth factors use a different mechanism: the receptor is itself the enzyme. A single transmembrane protein with an extracellular ligand binding site and an intracellular kinase domain; ligand binding brings two receptor molecules together, and the dimer is the active enzyme.",
      },
      {
        type: "table",
        headers: ["Step", "What happens"],
        rows: [
          ["Ligand binds", "Insulin binds the extracellular alpha subunits"],
          ["Dimerisation", "Two receptor beta subunits come together"],
          ["Autophosphorylation", "Each receptor phosphorylates tyrosines on the other"],
          ["Adaptor binding", "Insulin receptor substrate proteins bind the phosphorylated tyrosines"],
          ["Kinase cascade", "Phosphoinositide 3-kinase, and the MAP kinase cascade, are activated"],
          ["Response", "GLUT4 is moved to the membrane, glycogen and protein synthesis begin, and genes are transcribed"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "A step-change in diabetes came from understanding exactly this pathway. The consequence of the insulin receptor failing is not that glucose stays out because the carrier is missing — it is that the GLUT4 vesicle is not recruited to the membrane, because the signal that moves it never arrived.",
      },

      { type: "heading", level: 2, text: "Worked example: one messenger, two tissues" },
      {
        type: "paragraph",
        text: "Adrenaline binds the same receptor in liver, in the heart and in the arteries, and produces different effects in each, because the effector and the downstream targets differ by tissue. This is why the drug is so useful: one molecule, several effects, all desirable in an anaphylactic emergency.",
      },
      {
        type: "table",
        headers: ["Tissue", "Adrenaline's action", "Value in anaphylaxis"],
        rows: [
          ["The sinoatrial and atrioventricular nodes", "Increases heart rate and conduction velocity through a Gs pathway", "Restores cardiac output as the pressure falls"],
          ["The bronchiolar smooth muscle", "Relaxes it, because beta 2 receptors dominate there", "Reverses bronchospasm and the wheeze"],
          ["The mast cell itself", "Stabilises it, reducing further mediator release through a different pathway", "Reduces the ongoing cascade"],
          ["The arterioles of the skin and gut", "Constricts them, through alpha 1 receptors", "Redirects the remaining volume to the heart and brain"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a steroid hormone binds a surface receptor. It does not — it crosses the membrane freely and binds an intracellular or nuclear receptor, which is why it acts in hours and a peptide hormone acts in seconds.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a second messenger makes a response faster. It makes it bigger, because one receptor can generate thousands of messenger molecules. The direct gating of a channel is what makes a response faster.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying calcium is a second messenger on its own. It is, but it is also the trigger for secretion, for contraction and for the fusion of vesicles, so it doubles as the universal final common signal in exocrine, muscular and neuronal cells.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "State the steps from ligand binding to response at a G-protein coupled receptor.",
        answer: "Ligand binds the extracellular face; the receptor changes shape; a G-protein exchanges GDP for GTP; the alpha subunit activates an effector such as adenylate cyclase; a second messenger such as cyclic AMP accumulates; a protein kinase is activated and phosphorylates its target; the response follows, and terminates as the messenger is degraded and the G-protein hydrolyses its GTP.",
        explanation: "The steps are a single chain of activations, and each is a site at which a drug, a toxin or a mutation can intervene.",
      },
      {
        type: "question",
        prompt: "Why does the same adrenaline produce different effects in the heart and in the lung?",
        answer: "Because the receptor subtype, the effector and the downstream targets differ between tissues. In the heart a beta 1 Gs pathway increases rate and force; in the bronchiole a beta 2 pathway relaxes smooth muscle. The ligand is the same; the tissue decides the response.",
        explanation: "This is the principle of tissue specificity, and it is why a single drug has a predictable pattern of effects across the body.",
      },
      {
        type: "question",
        prompt: "How does a second messenger amplify a signal, and why does that not make it faster?",
        answer: "Because one activated receptor can generate thousands of messenger molecules, each of which activates a kinase that phosphorylates many target proteins, so one ligand event becomes an enormous response. Speed is a separate matter: a directly gated channel opens in a quarter of a millisecond, whereas a second messenger cascade needs the enzyme reactions to run, so it is slower.",
        explanation: "Evolution uses the direct gating where milliseconds matter, such as in the brain, and the cascade where magnitude matters, such as in the endocrine response.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which class of messenger must have its receptor on the cell surface?",
        options: ["Steroid hormones", "Thyroid hormone", "Peptide hormones and most amine hormones", "Nitric oxide"],
        correctIndex: 2,
        explanation: "Peptide and amine hormones are polar and cannot cross the lipid bilayer, so their receptors are on the surface. Steroids, thyroid hormone and nitric oxide all cross the membrane directly.",
      },
      {
        type: "mcq",
        stem: "Which is the correct sequence at a G-protein coupled receptor?",
        options: [
          "Ligand binding, G-protein GDP to GTP exchange, effector activation, second messenger generation, protein kinase activation",
          "Ligand binding, protein kinase activation, second messenger generation, G-protein exchange, effector activation",
          "Effector activation, ligand binding, second messenger generation, protein kinase activation",
          "Second messenger generation, protein kinase activation, ligand binding, G-protein exchange",
        ],
        correctIndex: 0,
        explanation: "The order is fixed: ligand, G-protein exchange, effector, messenger, kinase. Everything else in the list is the order reversed or scrambled.",
      },
      {
        type: "mcq",
        stem: "Which messenger is the commonest second messenger of the adenylate cyclase pathway?",
        options: ["Inositol trisphosphate", "Diacylglycerol", "Cyclic AMP", "Calcium"],
        correctIndex: 2,
        explanation: "Cyclic AMP is made by adenylate cyclase and activates protein kinase A. Inositol trisphosphate and diacylglycerol are the products of the other G-protein pathway, and calcium is released by the first of those.",
      },
      {
        type: "mcq",
        stem: "Which statement about the insulin receptor is correct?",
        options: [
          "It is a G-protein coupled receptor that activates protein kinase A",
          "It is a receptor tyrosine kinase that autophosphorylates on ligand binding",
          "It is a ligand-gated ion channel that admits calcium",
          "It is an intracellular receptor that changes gene transcription directly",
        ],
        correctIndex: 1,
        explanation: "The insulin receptor is itself an enzyme: ligand binding causes dimerisation and autophosphorylation, and the phosphotyrosines then recruit the adaptor proteins that start the cascade.",
      },
      {
        type: "mcq",
        stem: "Which statement correctly describes the difference between a steroid and a peptide hormone action?",
        options: [
          "A steroid acts in seconds and a peptide in hours",
          "A steroid acts over hours because it changes gene transcription, and a peptide acts in seconds because it only needs a surface receptor",
          "Both act in the same time, and only their receptors differ",
          "A steroid never acts inside a cell and a peptide never acts on the surface",
        ],
        correctIndex: 1,
        explanation: "The peptide hormone needs only to reach a surface receptor, so the response is gated within seconds; the steroid must cross the membrane and nucleus and build new protein, so the response takes hours and lasts for days.",
      },
      {
        type: "mcq",
        stem: "Which statement about signal amplification is correct?",
        options: [
          "A second messenger makes a response faster than a directly gated channel",
          "A single activated receptor can generate thousands of messenger molecules, so the magnitude of the response is amplified",
          "Amplification shortens the time to the response",
          "A directly gated channel amplifies a signal more than a cascade",
        ],
        correctIndex: 1,
        explanation: "The cascade amplifies magnitude, not speed. One receptor drives many messenger molecules, each of which drives many kinase substrates, so the total response is far larger than a single channel opening.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Messengers carry information in three chemical forms, and where each must have its receptor is decided by whether it can cross the membrane. Peptide and amine hormones cannot, and their receptors are transducers on the surface — a G-protein coupled receptor that generates cyclic AMP or the inositol and calcium messengers, or a receptor tyrosine kinase that phosphorylates itself and recruits a cascade. Steroids, thyroid hormone and nitric oxide cross directly, and their receptors are inside. The same messenger produces different effects in different tissues, because the receptor and the effector differ, and a second messenger buys magnitude while a directly gated channel buys speed.",
      },
      {
        type: "paragraph",
        text: "That completes Module 2 of the biochemistry course. The next module turns to metabolism and energy, where the sugar and the fat you have just learned are burned to make the ATP that every reaction of this one requires.",
      },
    ],
  };
}

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
  { title: "Monosaccharides, disaccharides & polysaccharides", module: 2, estimatedMinutes: 35, authored: true , concept: { title: "Monosaccharides and glycosidic bonds", slug: "monosaccharides", summary: "The monosaccharide ring structures, the alpha and beta linkages of disaccharides and polysaccharides, and the role of glycoproteins.", blooms: "understand", minutes: 35, prereq: ["water-ph-buffering"] }, content: lesson6() as never },
  { title: "Lipids: fatty acids, glycerol & sterols", module: 2, estimatedMinutes: 40, authored: true , concept: { title: "Lipids and fatty acids", slug: "lipids", summary: "Triacylglycerols, phospholipids, glycolipids and cholesterol, saturated and unsaturated fatty acids, and the essential fatty acids.", blooms: "understand", minutes: 40, prereq: ["water-ph-buffering"] }, content: lesson7() as never },
  { title: "Cell membranes & membrane transport", module: 2, estimatedMinutes: 40, authored: true , concept: { title: "The cell membrane", slug: "cell-membranes", summary: "The lipid bilayer and its proteins, membrane fluidity, and the membrane as a transport surface.", blooms: "understand", minutes: 40, prereq: ["lipids"] }, content: lesson8() as never },
  { title: "Vitamins & trace elements", module: 2, estimatedMinutes: 35, authored: true , concept: { title: "Vitamins and trace elements", slug: "vitamins-trace-elements", summary: "Water- and fat-soluble vitamins with their coenzyme roles, and the roles of iron, iodine, zinc, selenium and magnesium.", blooms: "remember", minutes: 35, prereq: ["enzyme-kinetics"] }, content: lesson9() as never },
  { title: "Chemical messengers & signal transduction", module: 2, estimatedMinutes: 40, authored: true , concept: { title: "Signalling molecules and second messengers", slug: "signal-transduction", summary: "Hormones, second messengers, G-proteins and kinase cascades, and the receptors that transduce them.", blooms: "apply", minutes: 40, prereq: ["enzyme-kinetics"] }, content: lesson10() as never },

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

export // ---------------------------------------------------------------------------
// MODULE 2 — LESSON 11 — Glycoproteins, proteoglycans & the extracellular matrix
// (fully authored). A new concept in the spine: glycoproteins-proteoglycans.
// ---------------------------------------------------------------------------
function lesson11() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: distinguish a glycoprotein from a proteoglycan by the size and the number of the carbohydrate chains; state the two kinds of protein glycosylation and say where each occurs; name the principal components of the extracellular matrix and say what each contributes; describe the structure and the function of collagen and of elastin; explain the glycosaminoglycan chain and why it holds water; and explain the mechanism of scurvy in terms of hydroxylation and cross-linking.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 3 of Module 1 (protein structure hierarchy) for the fibrous proteins described here, and Lesson 6 for the monosaccharides from which every chain is built.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Extracellular matrix",
        text: "The material secreted by a cell into the space around it, composed of fibrous proteins — collagen and elastin — embedded in a hydrated gel of proteoglycans. It is what makes a tissue more than a bag of cells: it carries the mechanical load and holds the tissue water.",
      },
      {
        type: "paragraph",
        text: "The whole of this lesson is about why tissue has the properties it does, and it all reduces to two molecules. Collagen gives a tissue its tensile strength — it resists being pulled apart — and elastin gives it its recoil, so it returns to shape after being stretched. Between them, the glycosaminoglycan gel resists compression and holds the tissue water, which is why cartilage is a shock absorber and why it fails with age.",
      },
      {
        type: "table",
        headers: ["Component", "Structure", "Function", "Where it dominates"],
        rows: [
          ["Collagen", "A triple helix of three polypeptide chains, rich in glycine and proline", "Tensile strength", "Tendon, ligament, bone, skin, dentin, the cornea"],
          ["Elastin", "An amorphous protein with cross-linked lysine residues", "Recoil after stretch", "Arterial wall, lung, ligamentum nuchae, skin"],
          ["Proteoglycans", "A core protein with long glycosaminoglycan chains", "Resist compression and hold water", "Cartilage, the nucleus pulposus, synovial fluid"],
          ["Adhesive proteins", "Fibronectin and laminin", "Attach cells to the matrix", "The basement membrane of every epithelium"],
        ],
      },

      { type: "heading", level: 2, text: "Collagen" },
      {
        type: "paragraph",
        text: "Collagen is the most abundant protein in the animal kingdom, and its structure is the reason. Three chains are wound around a common axis in a triple helix, and every third residue in each chain is glycine, the only amino acid small enough to fit in the crowded centre of the helix. The chains are rich in proline and in hydroxyproline, which holds the helix in its extended form.",
      },
      {
        type: "table",
        headers: ["Type", "Chain composition", "Where it is found", "Disease of the defect"],
        rows: [
          ["I", "Two alpha 1 and one alpha 2", "Bone, tendon, ligament, skin, dentin, the scar", "Osteogenesis imperfecta — the brittle bones"],
          ["II", "Three alpha 1 chains", "Cartilage, the nucleus pulposus, the vitreous", "An early onset osteoarthritis"],
          ["III", "Three alpha 1 chains", "Blood vessel wall, gut wall, granulation tissue", "The vascular type of Ehlers-Danlos"],
          ["IV", "Three alpha 1 chains", "The basement membrane, in a network rather than a fibril", "Alport syndrome, which is collagen IV of the glomerular basement membrane"],
        ],
      },
      {
        type: "paragraph",
        text: "The synthesis of collagen is worth following, because three of its steps are points at which a disease or a drug intervenes. Inside the cell three chains are assembled and hydroxylated, and the hydroxylation is the step that needs vitamin C. Outside the cell the propeptides are cleaved, which is what allows the molecules to assemble into fibrils, and the lysine residues are oxidised by lysyl oxidase, which makes the cross-links that give the fibre its real strength.",
      },

      { type: "heading", level: 2, text: "Worked example: scurvy is a cross-linking disease" },
      {
        type: "paragraph",
        text: "The step that needs vitamin C is the step that hydroxylates the proline and the lysine residues of the procollagen chain. Without it the triple helix cannot hold its stable extended conformation, and the newly made collagen is so weak it cannot support any tissue that relies on tensile strength. The clinical picture follows exactly.",
      },
      {
        type: "table",
        headers: ["Deficit", "Consequence", "Clinical sign"],
        rows: [
          ["No hydroxylation of proline", "The triple helix cannot be stabilised", "Every collagen dependent structure weakens"],
          ["Weak capillary walls", "Vessels leak under normal pressure", "Perifollicular haemorrhages and bruising"],
          ["Weak dentin and periodontal ligament", "Teeth loosen in their sockets", "Gingival swelling and haemorrhage"],
          ["Weak scar and tendon", "Old wounds reopen", "Poor wound healing and a gaping old scar"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Lysyl oxidase is a copper enzyme, so copper deficiency is a collagen cross-linking disease too. It is the reminder that the cross-link step is separate from the hydroxylation step, and that a failure in either produces a connective tissue problem.",
      },

      { type: "heading", level: 2, text: "Elastin and the arterial wall" },
      {
        type: "paragraph",
        text: "Elastin is built on the same logic as collagen but with a different intent. Lysine residues are oxidised and then condense with each other to form cross-links called desmosines, which tie the elastin molecules into a rubbery network that can be stretched and then recoil. This is what makes an artery expand with each pulse and then push the blood back, which is the Windkessel effect that smooths the arterial pressure wave.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Marfan syndrome is the inherited disease of a structural glycoprotein, fibrillin, that is required for the elastin network. The mutation gives a tall habitus with long limbs and a arachnodactyly, and the dangerous lesion is an aortic aneurysm that dissects — a connective tissue disease that presents as a cardiovascular emergency.",
      },

      { type: "heading", level: 2, text: "Proteoglycans and the glycosaminoglycans" },
      {
        type: "definition",
        term: "Glycosaminoglycan",
        text: "A long chain of repeating disaccharide made of an amino sugar (galactosamine or glucosamine) and a uronic acid, with a carboxyl and often a sulfate on each unit. The negative charges draw water, and the resulting hydrated gel resists compression.",
      },
      {
        type: "table",
        headers: ["Glycosaminoglycan", "Composition", "Function"],
        rows: [
          ["Hyaluronan", "Glucuronic acid and N-acetylglucosamine", "The largest, and free rather than bound to a protein; lubricates the joint and forms the vitreous"],
          ["Chondroitin sulfate", "Glucuronic acid and N-acetylgalactosamine", "The main one of cartilage, tendon and bone"],
          ["Dermatan sulfate", "L-iduronic acid and N-acetylgalactosamine", "Skin, blood vessel wall and heart valve"],
          ["Heparan sulfate", "Glucuronic acid or iduronic acid and N-acetylglucosamine", "Anticoagulant and cell adhesion, on cell surfaces and in the basement membrane"],
          ["Keratan sulfate", "Galactose and N-acetylglucosamine sulfated", "Cartilage, the cornea and the nucleus pulposus"],
        ],
      },
      {
        type: "paragraph",
        text: "The proteoglycan aggregate is the largest structure in the matrix, and it is what makes cartilage work. A single filament of hyaluronan carries a hundred core proteins, each with several glycosaminoglycan chains, so the complex carries thousands of negative charges. Its volume is mostly water, and it is packed so tightly that it cannot be compressed without forcing water out — which is exactly what a cartilage joint must resist.",
      },
      {
        type: "question",
        prompt: "A patient with osteoarthritis has lost the proteoglycan of articular cartilage. Which mechanical property of the joint is lost first, and why?",
        answer: "The resistance to compression, because the glycosaminoglycan chains with their dense negative charges hold the water that gives cartilage its ability to resist being squeezed. Once the proteoglycan is gone, the collagen fibrils are loaded directly and the joint is damaged.",
        explanation: "This is why the first change in osteoarthritis is loss of proteoglycan, and why the pain begins only when the underlying bone is loaded abnormally.",
      },

      { type: "heading", level: 2, text: "Glycoproteins against proteoglycans" },
      {
        type: "table",
        headers: ["Property", "Glycoprotein", "Proteoglycan"],
        rows: [
          ["Carbohydrate content", "A few per cent up to about 80", "Up to 95 per cent"],
          ["Chain length", "Short, one to fifteen residues", "Very long, up to dozens of thousands of residues"],
          ["Number of chains", "Usually one or two, precisely branched", "Usually dozens of long glycosaminoglycan chains"],
          ["Shape", "Globular, folded like a protein", "Extended and filamentous"],
          ["Examples", "Haemoglobin, albumin, the clotting factors, the immunoglobulins", "Aggrecan, syndecan, perlecan"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The distinction matters for one common misapprehension. Haemoglobin is sometimes thought of as a glycoprotein; it is not. Its prosthetic groups are haem, not sugar. Albumin, by contrast, is a glycoprotein with a single glycosylation site.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying proteoglycans are proteins. They are mostly carbohydrate by weight, and their defining property is that the glycosaminoglycan chains carry the function.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying elastin and collagen serve the same function. Collagen resists being pulled and is inextensible; elastin recoils after stretch. A tendon is nearly all collagen and an artery is collagen with elastin.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Attributing all of scurvy to vitamin C alone. Copper deficiency also damages the cross-link step, through lysyl oxidase. Both deficiencies give a connective tissue disease.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "How does a glycoprotein differ from a proteoglycan?",
        answer: "A glycoprotein has a short carbohydrate chain, or two, of a few to fifteen residues on an otherwise globular protein; a proteoglycan is mostly carbohydrate by weight, with dozens of very long glycosaminoglycan chains attached to a core protein.",
        explanation: "The distinction is one of proportion and of chain length, and it reflects two entirely different functional purposes.",
      },
      {
        type: "question",
        prompt: "Which step of collagen synthesis requires vitamin C, and what is the consequence of failing it?",
        answer: "The hydroxylation of the proline and lysine residues of the procollagen chain, catalysed by prolyl and lysyl hydroxylase. Without it the triple helix cannot stabilise, so all collagen dependent structures weaken — hence the capillary fragility, the bleeding gums and the poor healing of scurvy.",
        explanation: "The enzyme needs ascorbate to keep the iron in its ferrous state, which is why the vitamin is consumed in the reaction rather than merely needed for it.",
      },
      {
        type: "question",
        prompt: "Which property of the glycosaminoglycan gives cartilage its resistance to compression, and what happens when it is lost in osteoarthritis?",
        answer: "The dense array of negative charges on each disaccharide unit draws and holds water, forming a hydrated gel that cannot be squeezed without forcing the water out. Losing the proteoglycan takes away that gel, so the collagen fibrils are loaded directly and the joint is damaged.",
        explanation: "The loss of proteoglycan is the first change in osteoarthritis and is what determines the symptoms, because the proteoglycan is the shock absorber.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which correctly distinguishes a proteoglycan from a glycoprotein?",
        options: [
          "A proteoglycan is a protein with a single short sugar chain, and a glycoprotein has dozens of long chains",
          "A proteoglycan is mostly carbohydrate by weight with very long chains, and a glycoprotein is mostly protein with a short sugar chain",
          "The terms are synonyms and either may be used",
          "A proteoglycan is a lipid, and a glycoprotein is a carbohydrate",
        ],
        correctIndex: 1,
        explanation: "The proteoglycan's glycosaminoglycan chains are long and numerous, so the carbohydrate dominates the weight; the glycoprotein's chains are short and few.",
      },
      {
        type: "mcq",
        stem: "Which is the commonest amino acid in every third position of a collagen chain, and why?",
        options: [
          "Proline, because it bends the chain into a turn",
          "Glycine, because it is the only residue small enough to fit in the crowded centre of the triple helix",
          "Hydroxyproline, because it carries the hydroxyl for the cross-link",
          "Lysine, because it is the site of oxidation by lysyl oxidase",
        ],
        correctIndex: 1,
        explanation: "Every third residue in a collagen chain is glycine, because the centre of the triple helix is too crowded for any larger side chain — the repeating Gly-X-Y motif is the signature of collagen.",
      },
      {
        type: "mcq",
        stem: "Which enzyme requires copper and makes the cross-links between collagen molecules?",
        options: ["Prolyl hydroxylase", "Lysyl hydroxylase", "Lysyl oxidase", "Not collagen but elastin synthesis"],
        correctIndex: 2,
        explanation: "Lysyl oxidase oxidises the lysine residues so that they can form the covalent cross-links that give the fibril its tensile strength. Prolyl and lysyl hydroxylase are the vitamin C dependent step that precedes it.",
      },
      {
        type: "mcq",
        stem: "Which statement about elastin is correct?",
        options: [
          "It is inextensible and resists being pulled",
          "It recoils after stretch, because its lysine residues are cross-linked into desmosines",
          "It is a glycosaminoglycan that holds water in the cartilage",
          "It forms the tensile fibre of tendon and ligament",
        ],
        correctIndex: 1,
        explanation: "Elastin's cross-links are the desmosines formed from oxidised lysine, and the resulting network stretches and recoils. Collagen is the inextensible tensile fibre.",
      },
      {
        type: "mcq",
        stem: "Which component gives cartilage its resistance to compression?",
        options: ["The collagen fibrils", "The elastin network", "The hydrated gel of glycosaminoglycan chains", "The calcium salts"],
        correctIndex: 2,
        explanation: "The dense negative charges of the glycosaminoglycans draw water into a gel that cannot be compressed without forcing the water out. Collagen and elastin resist tension and recoil, not compression.",
      },
      {
        type: "mcq",
        stem: "Which protein of the extracellular matrix is defective in Marfan syndrome?",
        options: ["Collagen type I", "Elastin", "Fibrillin", "Fibronectin"],
        correctIndex: 2,
        explanation: "Marfan syndrome is a mutation in fibrillin 1, the glycoprotein that scaffolds the elastin network, and its manifestation is the aortic aneurysm that dissects.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The extracellular matrix is collagen for tensile strength and elastin for recoil, embedded in a hydrated gel of proteoglycans whose glycosaminoglycan chains resist compression. Collagen is a triple helix stabilised by hydroxylation, which is the step vitamin C is required for, and its strength comes from the cross-links that lysyl oxidase makes — so scurvy is a cross-linking disease. The proteoglycan aggregate, mostly carbohydrate by weight, is what makes cartilage a shock absorber, and its loss is the first event in osteoarthritis.",
      },
      {
        type: "paragraph",
        text: "Next: the lipid membrane again, from the other direction. You will examine the dynamics of its lipids — fluidity, rafts and the cholesterol that modulates both — and see why the structure you met in the last lesson is never static.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// MODULE 2 — LESSON 12 — Membrane dynamics: fluidity, rafts & cholesterol
// (fully authored). A new concept in the spine: membrane-dynamics.
// ---------------------------------------------------------------------------
function lesson12() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: explain the lateral and the flip-flop movement of a phospholipid and say which is fast and which is slow; state how temperature, cholesterol, unsaturation and chain length together set fluidity; define a lipid raft and say why it is useful to a cell; describe how a membrane protein is anchored and how glycosylphosphatidylinositol anchoring works; explain the asymmetric composition of the two leaflets and why it is maintained; and describe membrane fusion, exocytosis and endocytosis as the mechanics of moving material across a sealed barrier.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 7 (lipids) for the amphipathic molecule and Lesson 8 (the cell membrane) for the fluid mosaic model, whose second half this lesson continues.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Asymmetric and dynamic membrane",
        text: "The membrane is a sealed barrier that is never static: its lipids move laterally at high speed and are actively distributed unequally between the two leaflets. The properties a cell can exploit — signalling, recognition, fusion and transport — depend on that dynamism and on that asymmetry.",
      },
      {
        type: "paragraph",
        text: "One fact opens this lesson: a lipid in the membrane moves sideways about ten thousand times per second, and across the membrane about once a week. That enormous ratio is what makes the membrane a two dimensional fluid, and it is what clustering requires. A receptor that must meet its second molecule to signal does not need to be pushed; the fluidity does it.",
      },
      {
        type: "table",
        headers: ["Movement", "Rate", "Requires energy", "Consequence"],
        rows: [
          ["Lateral, within one leaflet", "Fast — the molecule moves about a micrometre per second", "No", "Lateral diffusion, clustering, receptor dimerisation"],
          ["Flip-flop, from one leaflet to the other", "Very slow for a phospholipid without help", "No, but rarely happens", "Keeps the two leaflets different, because they cannot mix"],
          ["Flippase driven flip-flop", "Fast when catalysed", "Yes, ATP", "Maintains the asymmetric composition of the two leaflets"],
          ["Vesicular transport", "Minutes", "Yes", "Moves whole areas of membrane from one compartment to another"],
        ],
      },

      { type: "heading", level: 2, text: "Fluidity as a controlled variable" },
      {
        type: "paragraph",
        text: "You met the four factors that set fluidity in the last lesson. This one is about what the cell does with them, because the cell actively regulates its own fatty acid composition in response to temperature.",
      },
      {
        type: "table",
        headers: ["Factor", "Warmer membrane", "Colder membrane", "Cellular response"],
        rows: [
          ["Unsaturation", "More double bonds, so more fluid", "Fewer, so less fluid", "Bacteria and yeast make more saturated fats in the heat and more unsaturated in the cold"],
          ["Chain length", "Shorter, so more fluid", "Longer, so less fluid", "The desaturase is activated by cold"],
          ["Cholesterol", "Reduces fluidity", "Increases fluidity", "The concentration is regulated, not fixed"],
          ["Temperature", "Raises fluidity", "Lowers it", "Hibernating mammals increase the unsaturation of their membrane lipids before winter"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The cell's capacity to regulate its own fluidity is the reason fever is tolerated. The membranes of a febrile patient are more fluid than normal, and the response is reflexive — the fatty acid desaturases are activated by temperature, so the cell turns the dial back itself.",
      },

      { type: "heading", level: 2, text: "Lipid rafts" },
      {
        type: "definition",
        term: "Lipid raft",
        text: "A small, ordered island within the more fluid membrane, enriched in cholesterol and in sphingolipids, in which certain proteins are gathered. It is a floating platform that concentrates a signalling pathway in one place.",
      },
      {
        type: "paragraph",
        text: "The sphingolipid of a raft differs from the ordinary phospholipid in two ways that matter. Its tail is a long saturated amide linked hydrocarbon, so it packs tightly; and it has an extensive hydrogen bonding between headgroups, which further stabilises the island. The result is a region that is more ordered than its surroundings, and the cholesterol that concentrates with it keeps the edges sharp.",
      },
      {
        type: "table",
        headers: ["Property", "Raft", "Ordinary membrane"],
        rows: [
          ["Lipid composition", "Cholesterol and sphingolipid enriched", "Phospholipid with mixed chains"],
          ["Ordering", "More ordered, tightly packed", "Fluid and disordered"],
          ["Thickness", "Slightly greater", "Standard"],
          ["Proteins found", "Certain receptors and signalling proteins", "Most membrane proteins"],
          ["Function", "Signal transduction, sorting, viral entry, immune synapse formation", "General barrier and transport"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Many viruses enter a cell through a raft, because that is where the receptors they bind are concentrated. The beta amyloid protein of Alzheimer disease is also enriched in caveolae, a special form of raft, which is one of the lines of evidence linking membrane cholesterol handling to neurodegeneration.",
      },

      { type: "heading", level: 2, text: "Worked example: how proteins are held in place" },
      {
        type: "paragraph",
        text: "Proteins are attached to the membrane in four ways, and the way of attachment decides whether the protein can be removed by a change in the medium.",
      },
      {
        type: "table",
        headers: ["Attachment", "Mechanism", "Removed by", "Example"],
        rows: [
          ["Transmembrane", "The protein spans the bilayer, with hydrophobic segments that cross the lipid", "Only by detergents that dissolve the lipid", "Most transporters and receptors"],
          ["Peripheral", "The protein binds the surface by ionic and hydrogen bonds", "By a change in pH or salt, no detergent needed", "Cytochrome c on the inner surface"],
          ["Lipid anchored", "A fatty acid such as myristate or palmitate is covalently attached to a residue and inserted in the lipid", "By disrupting the lipid insertion", "The Src family kinases, and the HIV Gag protein"],
          ["GPI anchored", "A glycosylphosphatidylinositol lipid is attached to the protein C terminus in the endoplasmic reticulum", "By a phospholipase that cleaves the inositol", "Alkaline phosphatase and the folate receptor"],
        ],
      },
      {
        type: "definition",
        term: "Glycosylphosphatidylinositol anchor",
        text: "A lipid anchor of phosphatidylinositol, with a glycan core, that is attached to the C terminus of a protein in the endoplasmic reticulum. It holds the protein in the outer leaflet only, so it is lost completely if the anchor is cleaved.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The GPI anchor is the reason alkaline phosphatase and the folate receptor can be released from a cell by adding a phospholipase to the medium. It is also why paroxysmal nocturnal haemoglobinuria is a disease: the defect is in the enzymatic step that assembles the anchor, so a whole family of proteins is missing from the surface of the red cell and of the platelets.",
      },

      { type: "heading", level: 2, text: "Asymmetry of the two leaflets" },
      {
        type: "paragraph",
        text: "The two leaflets are not the same, and the difference is not a small detail: it is a signal. The phosphatidylserine that is normally confined to the inner leaflet appears on the outer surface during apoptosis, and the appearance is a phagocytic eat-me signal. That is the most important use of the asymmetry.",
      },
      {
        type: "table",
        headers: ["Lipid", "Normal leaflet", "Role when found elsewhere"],
        rows: [
          ["Phosphatidylcholine", "The outer leaflet", "The commonest phospholipid of the outer surface"],
          ["Sphingomyelin", "The outer leaflet", "Where it forms the rafts"],
          ["Phosphatidylserine", "The inner leaflet", "On the outer surface it is the apoptosis signal"],
          ["Phosphatidylethanolamine", "The inner leaflet", "Its flip is part of the apoptotic programme"],
          ["Cholesterol", "Both, in both layers", "Moderates fluidity everywhere"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The asymmetry is maintained by a flippase that consumes ATP, and it is deliberately collapsed during programmed cell death. That is why phosphatidylserine exposure is used as a laboratory test for apoptosis.",
      },

      { type: "heading", level: 2, text: "Fusion, exocytosis and endocytosis" },
      {
        type: "paragraph",
        text: "The membrane cannot be cut, because cutting it destroys the barrier it exists to provide. Every process that takes material into a cell or out of one therefore works by making an opening and then sealing it again, using the same lipid that made it.",
      },
      {
        type: "table",
        headers: ["Process", "What is moved", "Mechanism", "Example"],
        rows: [
          ["Exocytosis", "Out of the cell", "A vesicle fuses with the plasma membrane, the content is released and the membrane is added to the surface", "Neurotransmitter release, insulin secretion, mucus secretion"],
          ["Endocytosis, clathrin coated", "Into the cell", "A pit invaginates, coated with clathrin, and pinches off as a vesicle", "LDL uptake; influenza entry"],
          ["Endocytosis, caveolae", "Into the cell", "A cave-shaped invagination that forms a caveolar vesicle", "Transcytosis, folate uptake"],
          ["Phagocytosis", "A particle into a cell", "The plasma membrane extends around the particle and engulfs it", "The macrophage clearing a microbe"],
          ["Recycling", "Membrane is returned", "The vesicle membrane fuses back with the plasma membrane", "The GLUT4 vesicle returning to the membrane"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Exocytosis is not just a route out: it is how a membrane grows. Every exocytic event adds a patch of vesicle membrane to the plasma membrane, and an equal patch must be taken back in, or the cell would grow without limit. The two are balanced in a cell of a fixed size.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a phospholipid flips from one leaflet to the other as readily as it moves sideways. It does not — the flip-flop is rare and slow, and it is ATP-driven by flippase when it happens at all. That rarity is exactly what keeps the two leaflets different.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the membrane is cut to let contents out. It is not; the vesicle fuses with the membrane, and the vesicle membrane becomes plasma membrane. The opening seals behind it, by the same lipid.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying phosphatidylserine is on the outer leaflet of a healthy cell. It is not; its presence there is an apoptosis signal.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why is the lateral diffusion of a lipid so fast while its flip-flop is so slow?",
        answer: "Because the lateral move only requires the lipid to slide past its neighbours within the leaflet, whereas the flip-flop requires the charged phosphate head to be dragged through the hydrophobic core of the bilayer, which is energetically prohibitive. The flip-flop is therefore catalysed by a flippase that uses ATP when it does occur.",
        explanation: "The asymmetry of the membrane depends on that slowness, because it stops the two leaflets from mixing.",
      },
      {
        type: "question",
        prompt: "Give the four ways a protein is attached to a membrane, with an example of each.",
        answer: "It spans the bilayer as a transmembrane protein, as in every receptor; it binds the surface as a peripheral protein, as in cytochrome c; it is covalently attached to a fatty acid inserted in the leaflet, as in the Src kinases; or it is held by a glycosylphosphatidylinositol anchor, as in alkaline phosphatase.",
        explanation: "The mode of attachment determines what removes it, and a lipid anchored or a GPI anchored protein can be released by removing the anchor rather than by dissolving the membrane.",
      },
      {
        type: "question",
        prompt: "What happens to the plasma membrane during exocytosis, and why must endocytosis balance it?",
        answer: "The vesicle fuses with the membrane, so its content is released and its own membrane becomes plasma membrane, increasing the surface area. An equal area must be retrieved by endocytosis, or the cell would grow without limit and would lose control of its composition.",
        explanation: "The two processes run continuously and are balanced in a cell of a fixed size, which is why the terms coupling and recycling are used together.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which movement of a phospholipid is fast, and which is slow?",
        options: [
          "Lateral movement is fast, and flip-flop from one leaflet to the other is slow",
          "Flip-flop is fast and lateral is slow",
          "Both are equally fast and equally spontaneous",
          "Lateral movement is slow and flip-flop is fast",
        ],
        correctIndex: 0,
        explanation: "Lateral diffusion is rapid because it only needs the lipid to slide past its neighbours; the flip-flop must drag the charged head through the hydrophobic core, so it is rare, slow and ATP driven when it happens.",
      },
      {
        type: "mcq",
        stem: "Which lipid is normally confined to the inner leaflet of the plasma membrane?",
        options: ["Phosphatidylcholine", "Sphingomyelin", "Phosphatidylserine", "Cholesterol"],
        correctIndex: 2,
        explanation: "Phosphatidylserine is kept inside by an ATP-driven flippase, and its appearance on the outer surface is the phagocytic eat-me signal of apoptosis.",
      },
      {
        type: "mcq",
        stem: "What is a lipid raft?",
        options: [
          "A gap in the membrane through which water passes",
          "An ordered island enriched in cholesterol and sphingolipids that concentrates signalling proteins",
          "A protein that spans the membrane and transports a ligand",
          "A vesicle that budded off from the plasma membrane",
        ],
        correctIndex: 1,
        explanation: "A raft is a more ordered domain of the bilayer, enriched in cholesterol and sphingolipid, that acts as a floating platform concentrating the proteins of one pathway — which is why viruses use it as an entry port.",
      },
      {
        type: "mcq",
        stem: "Which protein attachment is a glycosylphosphatidylinositol anchor?",
        options: [
          "A protein that spans the bilayer with hydrophobic segments",
          "A protein bound to the surface by ionic bonds, releasable by a change in pH",
          "A protein whose C terminus carries a phosphatidylinositol lipid that anchors it in the outer leaflet",
          "A protein with a fatty acid covalently inserted in the inner leaflet",
        ],
        correctIndex: 2,
        explanation: "The GPI anchor is added to the C terminus in the endoplasmic reticulum and holds the protein in the outer leaflet only; paroxysmal nocturnal haemoglobinuria is the disease of failing to build it.",
      },
      {
        type: "mcq",
        stem: "What happens to the plasma membrane during exocytosis?",
        options: [
          "The membrane is cut and heals with a lipid patch",
          "A vesicle fuses with it, releasing content and adding the vesicle's membrane to the cell surface",
          "The vesicle is engulfed and transported to the lysosome",
          "The membrane invaginates and pinches off as a vesicle",
        ],
        correctIndex: 1,
        explanation: "The vesicle and the plasma membrane fuse, so the vesicle membrane becomes plasma membrane; fusion is how a sealed barrier grows without ever being cut.",
      },
      {
        type: "mcq",
        stem: "Which statement about cholesterol in the membrane is correct?",
        options: [
          "It is confined to the outer leaflet, like the phosphatidylcholine",
          "It is found in both leaflets and moderates fluidity in both directions",
          "It anchors the proteins to the inner leaflet",
          "It is the second messenger of the adenylate cyclase pathway",
        ],
        correctIndex: 1,
        explanation: "Cholesterol is in both leaflets, and it buffers fluidity — reducing it when warm and raising it when cold — which is why its membrane concentration is regulated rather than fixed.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The membrane is a two dimensional fluid whose lipids move laterally fast and flip-flop slowly, so its two leaflets are different and can stay different. Fluidity is regulated by temperature, by chain unsaturation, by length and by cholesterol, which moderates in both directions. Cholesterol and sphingolipid form ordered rafts that concentrate the machinery of one pathway, and the proteins are held in place in four ways, of which the glycosylphosphatidylinositol anchor holds them in the outer leaflet alone. Phosphatidylserine on the inner leaflet is the eat-me signal of apoptosis, and fusion, exocytosis and endocytosis are how a sealed barrier moves material across it.",
      },
      {
        type: "paragraph",
        text: "Next: cholesterol leaves the cell. You will follow it in the lipoproteins, and see why the size of a particle determines whether it carries cholesterol into a tissue or out of it.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// MODULE 2 — LESSON 13 — Lipoproteins & cholesterol transport (fully authored)
// A new concept in the spine: lipoproteins.
// ---------------------------------------------------------------------------
function lesson13() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: name the five major lipoprotein classes and say where each is made and where each goes; explain how triacylglycerol versus cholesterol content sets the density of a particle; describe the two pathways — the exogenous from the gut and the endogenous from the liver — and the tissue to which each delivers; explain how a chylomicron remnant is cleared and why the pathway matters clinically; state the role of apolipoproteins B-48 and B-100, the E receptor and the LDL receptor; and name the enzyme that unloads a lipoprotein particle and the drug that inhibits its action.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 7 (lipids) for the cholesterol, the phospholipid and the triacylglycerol cargo, and Lesson 8 for the surface of the particle, which is a monolayer rather than a bilayer.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Lipoprotein",
        text: "A spherical particle of a phospholipid monolayer with embedded proteins, whose core carries the hydrophobic cargo of triacylglycerol and cholesteryl ester. It is not a molecule but a particle, and it exists only because cholesterol and fat cannot travel in water.",
      },
      {
        type: "paragraph",
        text: "One sentence sets up the whole topic. Blood is water, so it cannot carry fat; it therefore carries fat in droplets, and the droplet is the lipoprotein. The physics of the droplet decides its density: dense particles are small and rich in protein, while light particles are big and rich in lipid. Learn the density classes and you have the transport system.",
      },
      {
        type: "table",
        headers: ["Class", "Density", "Triacylglycerol", "Cholesterol", "Apolipoprotein", "Made by", "Goes to"],
        rows: [
          ["Chylomicron", "Lowest", "Highest", "Low", "B-48, C-II, E", "The gut", "Muscle and adipose tissue"],
          ["Chylomicron remnant", "Intermediate", "Low", "High", "E only", "From the chylomicron", "The liver"],
          ["VLDL", "Low", "High", "Low", "B-100, E", "The liver", "Adipose and muscle tissue"],
          ["IDL", "Intermediate", "Moderate", "Moderate", "B-100, E", "From VLDL", "The liver or the tissues"],
          ["LDL", "High", "Low", "Highest", "B-100 only", "From IDL", "Nearly every tissue"],
          ["HDL", "Highest", "Low", "High", "A-I, A-II", "The liver and the gut", "The liver, in reverse cholesterol transport"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The less dense a particle, the more triacylglycerol it holds and the bigger it is. The densest, HDL, is the smallest and the most protein rich; the chylomicron is the largest and the least dense. That is the whole basis of the clinical classification.",
      },

      { type: "heading", level: 2, text: "Worked example: the exogenous pathway" },
      {
        type: "paragraph",
        text: "Dietary fat is absorbed and reassembled into triacylglycerol inside the mucosal cells of the small bowel, and is packaged into chylomicrons, which are secreted into the lymph rather than into the blood. Follow them to the tissues.",
      },
      {
        type: "table",
        headers: ["Step", "What happens", "Consequence"],
        rows: [
          ["Assembly", "The enterocyte reassembles absorbed fat into triacylglycerol and coats it with a B-48 apolipoprotein", "A chylomicron is formed, the largest and least dense of the lipoproteins"],
          ["Release", "The particle enters the lacteal, the lymphatic of the villus, and reaches the blood via the thoracic duct", "This is why a milky lymph and a milky plasma appear after a fatty meal"],
          ["Unloading", "Lipoprotein lipase on the capillary wall hydrolyses the triacylglycerol, and the free fatty acids enter muscle or adipose tissue", "The particle shrinks and becomes denser, so it is now a remnant"],
          ["Clearance", "The remnant, coated only with apolipoprotein E, is taken up by the liver through the E receptor", "The fat journey ends and the cholesterol reaches the organ that processes it"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The B-48 and B-100 distinction is the key to the whole classification: B-48 is made by the gut and B-100 by the liver. The particle is named by where its single apolipoprotein was made, and each has only one, because each is one assembly.",
      },
      {
        type: "question",
        prompt: "A patient with a defective B-100 cannot unload the endogenous triacylglycerol. Which lipoprotein accumulates and which tissue fails first?",
        answer: "Very low density lipoprotein accumulates, because it is the liver made particle with B-100. The tissue that fails first is adipose and muscle, because their lipoprotein lipase cannot unload a particle whose activating apolipoprotein is absent — so the fat stays in the blood and the tissues starve of it.",
        explanation: "The B-100 variant is the cause of familial defective apolipoprotein B-100, which behaves clinically like a hyperlipidaemia of the LDL pathway.",
      },

      { type: "heading", level: 2, text: "Worked example: the endogenous pathway" },
      {
        type: "paragraph",
        text: "The liver handles the fat that the diet did not, and the pathway it uses is the circulating one that LDL comes from.",
      },
      {
        type: "table",
        headers: ["Step", "What happens"],
        rows: [
          ["Secretion", "The liver secretes VLDL, a particle with a B-100 apolipoprotein and a high triacylglycerol content"],
          ["Remodelling", "In the capillaries, lipoprotein lipase unloads the triacylglycerol, and the particle becomes smaller, denser and cholesterol richer, so it is now IDL"],
          ["Fate one", "The IDL is taken up by the liver, which completes the cycle"],
          ["Fate two", "The IDL loses its E apolipoprotein and becomes LDL, which circulates for days and delivers cholesterol to the tissues"],
          ["End", "LDL is cleared by the LDL receptor, which binds the B-100 apolipoprotein — the receptor whose absence causes familial hypercholesterolaemia"],
        ],
      },

      { type: "heading", level: 2, text: "HDL and reverse cholesterol transport" },
      {
        type: "definition",
        term: "Reverse cholesterol transport",
        text: "The process by which excess cholesterol is taken from the peripheral tissues, carried in HDL back to the liver, and either reused or excreted in the bile. HDL is the vehicle, and its apolipoprotein A-I is what lets it pick up cholesterol.",
      },
      {
        type: "paragraph",
        text: "The HDL particle is built in the liver and the gut as a small disc, and it scavenges cholesterol from extrahepatic tissues, including from the macrophages of an artery wall where it has done damage. It esterifies the cholesterol with lecithin cholesterol acyltransferase, which lets the particle hold a hydrophobic core, and it returns the cholesteryl ester to the liver. That reverse direction is why HDL is called the protective lipoprotein, and why the ratio of total cholesterol to HDL cholesterol is a better predictor of coronary risk than either alone.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The macrophages of an artery wall make the HDL pathway look like a garbage collection, and the reason a low HDL is dangerous is that the garbage stops being collected: cholesterol accumulates in the foam cell, which becomes the fatty streak and then the atherosclerotic plaque.",
      },

      { type: "heading", level: 2, text: "Clinical relevance" },
      {
        type: "table",
        headers: ["Disorder", "Mechanism", "Cardiovascular risk"],
        rows: [
          ["Familial hypercholesterolaemia", "The LDL receptor is absent or defective, so LDL cannot be cleared", "Very high LDL and very early coronary disease"],
          ["Familial defective apolipoprotein B-100", "B-100 cannot bind the receptor, so the LDL is not cleared", "Similar to the receptor defect"],
          ["Lipoprotein lipase deficiency", "The chylomicrons cannot unload, so they accumulate", "Eruptive xanthomas, pancreatitis, and little coronary disease"],
          ["Low HDL", "The reverse cholesterol transport particle is deficient", "A risk factor that is partly inherited and partly lifestyle"],
          ["Tangier disease", "A rare defect of the apolipoprotein A-I synthesis of HDL", "Orange tonsils, neuropathy and a very low HDL cholesterol"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The statins lower cholesterol by blocking the committed enzyme of synthesis in the liver, and the liver compensates by expressing more LDL receptors on its surface, which pulls LDL out of the blood. The mechanism is therefore receptor dependent, which is why a patient with no LDL receptor cannot be helped by a statin alone.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying HDL is a molecule. It is a particle, with a surface of phospholipid and protein and a core of cholesteryl ester, and its size and density change as it works.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the chylomicron is made in the liver. It is made in the enterocyte of the gut and reaches the blood through the lymph; the liver makes VLDL.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the chylomicron remnant goes to the tissues. It goes to the liver, cleared by the E receptor, which is the end of the exogenous pathway.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does a VLDL particle become an LDL particle, and what does it gain or lose?",
        answer: "Because in the capillaries its triacylglycerol is unloaded by lipoprotein lipase, so it loses its light lipid load and its remaining cholesterol becomes the dominant constituent. It also loses its E apolipoprotein. A smaller, denser particle with one apolipoprotein, B-100, is an LDL.",
        explanation: "The renaming is purely a consequence of the change in composition, not of a new particle being made.",
      },
      {
        type: "question",
        prompt: "How does reverse cholesterol transport protect the artery wall?",
        answer: "HDL picks up the cholesterol that has been deposited in the macrophages of the intima, esterifies it, and returns it to the liver for reuse or excretion. Without that process the macrophage keeps accumulating cholesterol, becoming a foam cell, and the plaque grows.",
        explanation: "It is the reverse circulation of cholesterol, and its efficiency explains why a high HDL is protective.",
      },
      {
        type: "question",
        prompt: "Which lipoprotein is elevated in lipoprotein lipase deficiency, and in which disorder is the LDL receptor absent?",
        answer: "Chylomicrons accumulate in lipoprotein lipase deficiency, because they cannot be unloaded. The LDL receptor is absent in familial hypercholesterolaemia, so LDL is not cleared.",
        explanation: "One is a failure to unload a particle, and the other a failure to clear it — two different steps that give two different clinical pictures.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which lipoprotein is produced by the intestine and carries dietary triacylglycerol?",
        options: ["VLDL", "LDL", "Chylomicron", "HDL"],
        correctIndex: 2,
        explanation: "The chylomicron is made by the enterocyte and carries dietary triacylglycerol, and it reaches the blood through the lymph. VLDL is the liver's particle and LDL is the cholesterol rich remnant of it.",
      },
      {
        type: "mcq",
        stem: "Which lipoprotein particle is the richest in cholesterol?",
        options: ["Chylomicrons", "VLDL", "LDL", "HDL"],
        correctIndex: 2,
        explanation: "LDL is the cholesterol rich end product of the VLDL remodelling, which is why it is called the 'bad' cholesterol carrier. HDL carries cholesterol but in a smaller, denser particle.",
      },
      {
        type: "mcq",
        stem: "Which apolipoprotein is carried only by the lipoproteins made in the intestine?",
        options: ["B-100", "E", "B-48", "A-I"],
        correctIndex: 2,
        explanation: "B-48 is the gut's apolipoprotein and B-100 is the liver's, and the presence of one or the other is the label that says which organ assembled the particle.",
      },
      {
        type: "mcq",
        stem: "Which receptor clears the chylomicron remnant from the circulation?",
        options: ["The LDL receptor", "The B-48 receptor", "The E receptor in the liver", "The HDL receptor"],
        correctIndex: 2,
        explanation: "The remnant carries only apolipoprotein E, which is recognised by the hepatic E receptor, and that is the last step of the exogenous pathway.",
      },
      {
        type: "mcq",
        stem: "What is the mechanism by which the statins lower plasma LDL cholesterol?",
        options: [
          "They block the LDL receptor so LDL is retained",
          "They block the committed step of cholesterol synthesis in the liver, and the liver compensates by expressing more LDL receptors",
          "They dissolve the LDL particle so the cholesterol is released",
          "They inhibit lipoprotein lipase, so LDL is not formed",
        ],
        correctIndex: 1,
        explanation: "The fall in hepatic synthesis causes the liver to express more LDL receptors, which pull LDL out of the blood. That is why a patient with a defective LDL receptor cannot respond to a statin.",
      },
      {
        type: "mcq",
        stem: "Which statement about reverse cholesterol transport is correct?",
        options: [
          "It carries cholesterol from the liver to the peripheral tissues",
          "It carries cholesterol from the peripheral tissues to the liver, in HDL",
          "It carries triacylglycerol from the gut to adipose tissue",
          "It carries cholesterol from the arteries to the kidney for excretion in the urine",
        ],
        correctIndex: 1,
        explanation: "Reverse cholesterol transport moves cholesterol from the tissues back to the liver, and the particle is HDL. The cholesterol is then reused or excreted in the bile, not in the urine.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Blood is water, so blood carries fat in particles, and a lipoprotein is a drop of phospholipid with a hydrophobic core. The gut makes the triacylglycerol rich chylomicron that unloads its fat in the capillaries and leaves a cholesterol rich remnant for the liver; the liver makes VLDL, which is remodelled into the cholesterol rich LDL that delivers to the whole body and is cleared by the LDL receptor; and the liver and gut also make HDL, which collects the cholesterol that the tissues and the artery wall have too much of and carries it back in reverse transport.",
      },
      {
        type: "paragraph",
        text: "Next: the last of the lipid-derived messengers. You will meet the prostaglandins and the leukotrienes, and the steroid hormones, all of which are made from the very lipids whose transport you have just learned.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// MODULE 2 — LESSON 14 — Lipid-derived signalling: prostaglandins, leukotrienes
// & steroid hormones (fully authored). A new concept in the spine:
// prostaglandins-steroids.
// ---------------------------------------------------------------------------
function lesson14() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the naming of an eicosanoid and say which fatty acid it comes from; state the enzyme by which arachidonate is released from the membrane and the two enzymes that act on it next; distinguish the prostaglandins from the thromboxanes from the leukotrienes by their source, structure and function; name the three principal drug classes that inhibit the pathway and say which step each targets; describe why an eicosanoid is a local rather than a circulating messenger and why its pharmacology follows from that; and describe the synthesis of the adrenal and gonadal steroid hormones from cholesterol and say where each is hydroxylated and secreted.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 7 (lipids) for the fatty acid substrate and the cholesterol, and Lesson 10 for the enzymes and their inhibition.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Eicosanoid",
        text: "A local signalling molecule derived from a twenty-carbon polyunsaturated fatty acid, released from the membrane and metabolised on the spot. It acts on the cells that made it and on their neighbours, and it is destroyed before it can travel.",
      },
      {
        type: "paragraph",
        text: "One property explains the entire pharmacology of this topic. The eicosanoids are not stored and not secreted; they are made the moment they are needed, they act on the cells that made them and their neighbours, and they are inactivated within seconds. That is why they have no plasma half life and no circulating concentration, and why the drugs that block them act on enzymes rather than on receptors.",
      },

      { type: "heading", level: 2, text: "The pathway from membrane to mediator" },
      {
        type: "paragraph",
        text: "The whole sequence follows from one fact: arachidonate is not free in the cell. It is esterified at the second carbon of the membrane phospholipids, and it must be released by a phospholipase before anything can happen. The released arachidonate then goes down one of two routes.",
      },
      {
        type: "table",
        headers: ["Step", "Enzyme", "Substrate", "Products"],
        rows: [
          ["Release", "Phospholipase A2, activated by injury, cytokines and calcium", "The membrane phospholipid", "Free arachidonate plus a lysophospholipid"],
          ["The cyclooxygenase route", "Cyclooxygenase 1 and 2, then a specific synthase for each product", "Arachidonate", "Prostaglandin H2, converted to PGE2, PGI2, PGD2 or thromboxane A2"],
          ["The lipoxygenase route", "5-lipoxygenase with its activating protein", "Arachidonate", "Leukotrienes, including the slow reacting substance of anaphylaxis"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The two cyclooxygenase isoforms explain two different drugs. COX-1 is constitutive and makes the prostaglandins that protect the gastric mucosa and maintain renal flow, so blocking it causes the ulcer and the renal impairment. COX-2 is induced at sites of inflammation, so blocking it gives the analgesia and the anti-inflammatory effect.",
      },

      { type: "heading", level: 2, text: "The three classes of eicosanoid" },
      {
        type: "table",
        headers: ["Class", "Structure", "Source", "Principal action"],
        rows: [
          ["Prostaglandins", "A twenty-carbon ring with two side chains", "Almost every nucleated cell", "Vasodilation, fever, pain sensitisation, gastric mucus and bicarbonate secretion, uterine contraction"],
          ["Thromboxanes", "A six-membered oxane ring", "The platelet", "Vasoconstriction and platelet aggregation"],
          ["Leukotrienes", "Linear, with conjugated double bonds", "Leucocytes and mast cells", "Bronchoconstriction, chemotaxis and vascular permeability"],
        ],
      },
      {
        type: "paragraph",
        text: "The balance between prostacyclin and thromboxane is the most elegant pair in the whole system. Prostacyclin, made by the endothelium of the vessel wall, is a vasodilator and an inhibitor of platelet aggregation, so it keeps the vessel open. Thromboxane A2, made by the platelet, is a vasoconstrictor and an agonist of aggregation, so it seals the hole. Both are made from the same arachidonate by the same enzyme, and which wins decides whether blood flows or clots.",
      },
      {
        type: "question",
        prompt: "Explain, using the two cyclooxygenase products, why aspirin is used both as an analgesic and as a lifetime low dose therapy after a heart attack.",
        answer: "Aspirin acetylates cyclooxygenase and so blocks both isoforms, so the prostaglandins that mediate pain and fever are not made. The same inhibition blocks the thromboxane A2 that platelets need to aggregate, and because the platelet has no nucleus it cannot make new cyclooxygenase, so the effect lasts the life of the platelet. The therapeutic dose is deliberately low, to spare the gastric prostaglandins as much as possible.",
        explanation: "The platelet's lack of a nucleus is what makes a low, once daily dose work for the whole platelet lifespan of about ten days.",
      },

      { type: "heading", level: 2, text: "Worked example: the drugs of the pathway" },
      {
        type: "table",
        headers: ["Drug", "Target", "Effect", "Adverse effect"],
        rows: [
          ["Aspirin", "Irreversibly acetylates COX-1 and COX-2", "Analgesia, antipyresis, anti-inflammation, and inhibition of thromboxane A2 so platelets cannot aggregate", "Gastric ulceration, because mucus and bicarbonate production is blocked"],
          ["Ibuprofen and other NSAIDs", "Competitively and reversibly inhibit COX", "Analgesia and anti-inflammation", "Renal impairment, because the prostaglandins that maintain afferent flow are blocked"],
          ["Paracetamol", "Acts centrally, and is thought to inhibit a COX variant", "Analgesia and antipyresis, with little anti-inflammatory action", "Hepatotoxicity in overdose from the reactive metabolite depleting glutathione"],
          ["Corticosteroids", "Block phospholipase A2, so arachidonate is never released", "Potent anti-inflammatory and immunosuppressive action, because both the cyclooxygenase and the lipoxygenase routes are blocked", "A broad range through the steroid hormone actions"],
          ["Zileuton", "Inhibits 5-lipoxygenase", "Blocks the leukotrienes, so it treats asthma", "Hepatotoxicity, which limits its use"],
          ["Montelukast", "The leukotriene receptor", "Blocks the effect of the leukotrienes in asthma", "Fewer, and it is an oral asthma drug"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The corticosteroid's effect is upstream of the NSAID's. Because it blocks phospholipase A2, no arachidonium is released at all, so neither the prostaglandins nor the leukotrienes can be made. That is why a steroid is more broadly anti-inflammatory than aspirin, and why it is the drug of an acute asthma attack rather than of mild joint pain.",
      },

      { type: "heading", level: 2, text: "The steroid hormones" },
      {
        type: "paragraph",
        text: "The second major use of a lipid in signalling is the steroid hormone, and the story begins at cholesterol. The first and rate-limiting step is the cleavage of the side chain to give pregnenolone, after which a series of tissue specific hydroxylases makes the final products.",
      },
      {
        type: "table",
        headers: ["Hormone", "Made where", "From", "Principal action"],
        rows: [
          ["Cortisol", "The zona fasciculata of the adrenal cortex", "Cholesterol", "Raises blood glucose, suppresses the immune system and mediates the stress response"],
          ["Aldosterone", "The zona glomerulosa of the adrenal cortex", "Cholesterol", "Retains sodium and water, and excretes potassium, thereby raising blood pressure"],
          ["Testosterone", "The Leydig cells of the testis", "Cholesterol", "Spermatogenesis, and the male secondary sexual characteristics"],
          ["Oestradiol and progesterone", "The ovarian follicle and the corpus luteum", "Cholesterol", "The menstrual cycle, and the maintenance of pregnancy"],
          ["Vitamin D", "The skin, then the liver and the kidney", "Cholesterol", "Calcium and phosphate absorption, and bone mineralisation"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The adrenal cortex is arranged in three zones and each makes its own product from the same precursor. The glomerulosa makes aldosterone because it alone has the enzyme for the final 18-hydroxylation; the fasciculata makes cortisol; and the reticularis makes the adrenal androgens. A disease of one zone is therefore a deficiency of one hormone.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the eicosanoids are stored in vesicles like the peptide hormones. They are not — they are synthesised on demand from a membrane precursor, and inactivated within seconds. That is why their action is local rather than hormonal.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying aspirin blocks thromboxane A2 only. It blocks cyclooxygenase itself, so it blocks all the products of both isoforms, including the protective gastric and renal prostaglandins. The low dose limits that damage.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a corticosteroid works by blocking a receptor. It does not: it blocks the release of the substrate, phospholipase A2, so the whole pathway is silenced. Its genomic effects take hours, which is why it is useless for anaphylaxis and so useful for an asthma attack.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "State the release step and the two routes by which arachidonate is metabolised, with the products of each.",
        answer: "Arachidonate is released from the membrane phospholipid by phospholipase A2, and then either cyclooxygenase makes prostaglandin H2, which is converted to the prostaglandins and to thromboxane A2, or lipoxygenase makes the leukotrienes.",
        explanation: "The release step is the one the corticosteroids block, and the two enzymic routes are the ones aspirin and zileuton block respectively.",
      },
      {
        type: "question",
        prompt: "Why does the effect of aspirin on a platelet last the life of the platelet, while its effect on the gastric mucosa recovers quickly?",
        answer: "Because the platelet has no nucleus and cannot synthesise new cyclooxygenase, so the inhibition persists until the platelet is replaced after about ten days. The mucosal cell is nucleated, so it makes new enzyme and recovers in hours.",
        explanation: "This difference in recovery is the reason a once daily low dose of aspirin is enough to suppress platelet function for the whole platelet lifespan.",
      },
      {
        type: "question",
        prompt: "Name the five steroid hormones derived from cholesterol and the one immediately preceding step in each.",
        answer: "Cortisol and aldosterone from the adrenal cortex, testosterone from the testis, oestradiol and progesterone from the ovary, and vitamin D from the skin, liver and kidney. The first and rate-limiting step in every case is the cleavage of the cholesterol side chain to pregnenolone, catalysed by the side chain cleavage enzyme.",
        explanation: "The tissue specificity lies entirely in the enzymes downstream of that one shared first step, which is why a defect of one zone gives one hormonal deficiency.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which enzyme releases arachidonate from the membrane phospholipid?",
        options: ["Cyclooxygenase", "5-lipoxygenase", "Phospholipase A2", "Phospholipase C"],
        correctIndex: 2,
        explanation: "Phospholipase A2 cleaves the ester bond at the second carbon of the phospholipid, releasing arachidonate. It is also the enzyme that corticosteroids block, which is why they silence the whole pathway.",
      },
      {
        type: "mcq",
        stem: "Which eicosanoid is made by the platelet and promotes aggregation?",
        options: ["Prostacyclin", "Prostaglandin E2", "Thromboxane A2", "Leukotriene B4"],
        correctIndex: 2,
        explanation: "Thromboxane A2 is made by the platelet, is a vasoconstrictor and promotes aggregation. Prostacyclin, made by the endothelium, is its antagonist and prevents clotting in a normal vessel.",
      },
      {
        type: "mcq",
        stem: "Which drug irreversibly inhibits cyclooxygenase by acetylating a serine in its active site?",
        options: ["Ibuprofen", "Paracetamol", "Aspirin", "Montelukast"],
        correctIndex: 2,
        explanation: "Aspirin acetylates the enzyme, so the inhibition is irreversible and lasts until new enzyme is made. Ibuprofen is competitive and reversible, and paracetamol acts centrally on a COX variant.",
      },
      {
        type: "mcq",
        stem: "Which is the immediate precursor of cortisol and aldosterone?",
        options: ["Arachidonate", "Pregnenolone", "Acetyl coenzyme A", "HMG coenzyme A"],
        correctIndex: 1,
        explanation: "The cholesterol side chain is cleaved to pregnenolone by the side chain cleavage enzyme, and every adrenal and gonadal steroid derives from that one intermediate. Acetyl coenzyme A and HMG coenzyme A are the earlier steps of cholesterol synthesis.",
      },
      {
        type: "mcq",
        stem: "Which statement about the leukotrienes is correct?",
        options: [
          "They are made by cyclooxygenase and are vasodilators",
          "They are made by 5-lipoxygenase and are bronchoconstrictors that recruit leucocytes",
          "They are made by the platelet and promote aggregation",
          "They are cyclooxygenase products that protect the gastric mucosa",
        ],
        correctIndex: 1,
        explanation: "The leukotrienes come from the lipoxygenase route and they constrict the bronchi and recruit leucocytes, which is why their blockade treats asthma. The COX products are the prostaglandins and thromboxanes.",
      },
      {
        type: "mcq",
        stem: "Why does aspirin produce a low dose that lasts a day's worth of effect on platelets?",
        options: [
          "Because aspirin is stored in the platelet for a day",
          "Because the platelet has no nucleus and cannot make new cyclooxygenase, so the inhibition persists for the platelet's lifespan of about ten days",
          "Because thromboxane A2 has a half life of twenty four hours",
          "Because the gastric mucosa compensates by making extra cyclooxygenase",
        ],
        correctIndex: 1,
        explanation: "The anucleate platelet cannot replace the acetylated enzyme, so one exposure suppresses its function for the rest of its life. The mucosal cell, which is nucleated, recovers within hours.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The eicosanoids are made from arachidonate released by phospholipase A2, and they then take either the cyclooxygenase route to the prostaglandins and thromboxanes or the lipoxygenase route to the leukotrienes. Because they are made on demand and destroyed within seconds, they act locally, and the drugs that block them act on enzymes: aspirin on the cyclooxygenase irreversibly, the other NSAIDs competitively, the corticosteroids on the release step, and zileuton and montelukast on the leukotriene route. The other lipid messengers, the steroid hormones, are all made from cholesterol, whose side chain is first cleaved to pregnenolone, after which tissue specific hydroxylases make cortisol, aldosterone, testosterone, oestradiol and progesterone.",
      },
      {
        type: "paragraph",
        text: "Next: the module closes with the clinical correlation, where the membrane receptors, the lipid transporters and the ester chemistry come together into metabolic disease and into the drugs used to treat it.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// MODULE 2 — LESSON 15 — Clinical correlation: membrane receptors, lipid
// disorders & the drugs that act on them (fully authored). A new concept in
// the spine: clinical-membrane-lipids.
// ---------------------------------------------------------------------------
function lesson15() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: explain the biochemical basis of lactose intolerance and its diagnosis; describe the mechanism of the glucose-galactose malabsorption and why it is present from birth; state the mechanism and the presentation of the lipid storage diseases; interpret a plasma lipid panel and name the disorders it reveals; explain the mechanism of the lipid lowering drugs and where each acts; and connect one inherited membrane receptor defect to the disease it produces.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 6 to 14, the whole of Module 2, because this lesson consolidates the whole carbohydrate, lipid and membrane content into bedside reasoning.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "The brush border deficiency",
        text: "A clinical syndrome produced by the loss of one enzyme on the surface of the small bowel enterocyte, so that the corresponding disaccharide or dipeptide cannot be split into absorbable units.",
      },
      {
        type: "paragraph",
        text: "The brush border of the small bowel is a biochemical machine on a surface, and every one of its enzymes can be missing. The three that produce recognisable disease are the ones whose substrates arrive in quantity every day, and the symptoms in each case are the same three: fermentation by the gut bacteria produces gas, the undigested solute draws water osmotically, and the result is bloating, cramping and diarrhoea.",
      },
      {
        type: "table",
        headers: ["Deficiency", "Enzyme lost", "Substrate that accumulates", "Diagnostic test"],
        rows: [
          ["Lactose intolerance", "Lactase, lost after weaning in most of the world's population", "Lactose", "The hydrogen breath test, or a therapeutic trial of lactose withdrawal"],
          ["Sucrase-isomaltase deficiency", "Sucrase and isomaltase, a genetic defect", "Sucrose and the alpha 1,6 of starch", "A sucrose breath test"],
          ["Glucose-galactose malabsorption", "The SGLT1 sodium-glucose cotransporter itself", "Glucose and galactose", "A stool reducing substance test in the infant"],
        ],
      },
      {
        type: "question",
        prompt: "A new onset lactose intolerance in an adult after gastroenteritis is usually temporary, while the same symptom in a middle aged adult of African or Asian ancestry is lifelong. Explain the two mechanisms.",
        answer: "The post gastroenteritis case is an acquired loss of the brush border lactase, because the virus or the bacteria damaged the enterocyte and the enzyme has not yet been replaced as the mucosa regenerates; it recovers over weeks. The lifelong case is the normal adult pattern: lactase expression is genetically downregulated after weaning in most of the world's population, so the enzyme is absent by design rather than by injury.",
        explanation: "This is why the two have different prognoses and why the breath hydrogen test is positive in both but the history tells you which one you are dealing with.",
      },

      { type: "heading", level: 2, text: "The lipid storage diseases" },
      {
        type: "definition",
        term: "Lysosomal storage disease",
        text: "An inherited deficiency of a single lysosomal hydrolytic enzyme, so that its normal substrate cannot be degraded and accumulates in the lysosome, most damagingly in the cells that turn over the substrate fastest.",
      },
      {
        type: "table",
        headers: ["Disease", "Missing enzyme", "Substrate accumulated", "Clinical fingerprint"],
        rows: [
          ["Tay-Sachs disease", "Hexosaminidase A", "GM2 ganglioside", "A startle response and a cherry red macular spot in the infant, with neurodegeneration and death by four years"],
          ["Gaucher disease", "Glucocerebrosidase", "Glucocerebroside", "A storage cell full of crumpled tissue paper, hepatosplenomegaly and bone pain"],
          ["Fabry disease", "Alpha-galactosidase A", "Globotriaosylceramide", "Angiokeratomas, acroparaesthesia and renal failure in adulthood"],
          ["Niemann-Pick disease", "Sphingomyelinase", "Sphingomyelin", "A hepatosplenomegaly and a neurodegenerative course in the infant"],
          ["Hurler syndrome", "Alpha-L-iduronidase", "Dermatan and heparan sulfate", "Coarse features, corneal clouding, joint contractures"],
          ["Hunter syndrome", "Iduronate sulfatase", "Dermatan and heparan sulfate", "Similar but without corneal clouding, and a milder course"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The pattern of these diseases is the most powerful argument in biochemistry: a single gene, a single missing enzyme, and a recognisable disease. Enzyme replacement therapy now exists for Gaucher and Fabry, and the principle — supply the missing enzyme — is the direct application of understanding the pathway.",
      },

      { type: "heading", level: 2, text: "The plasma lipid panel" },
      {
        type: "paragraph",
        text: "The lipid panel is the single commonest investigation in cardiovascular medicine, and every figure it reports is a lipoprotein fraction. Read it in four parts.",
      },
      {
        type: "table",
        headers: ["Measurement", "What it is", "Target or range"],
        rows: [
          ["Total cholesterol", "All the cholesterol in every lipoprotein combined", "Below about 5 mmol/L in a low risk patient"],
          ["HDL cholesterol", "The cholesterol of the reverse transport particles", "Above about 1 mmol/L in a man and 1.2 in a woman"],
          ["LDL cholesterol", "The cholesterol of the delivery particles, usually calculated rather than measured", "Depends on risk; below about 2.6 mmol/L in low risk and 1.8 in established disease"],
          ["Triglyceride", "The triacylglycerol of VLDL and of chylomicrons", "Below about 1.7 mmol/L fasting"],
        ],
      },
      {
        type: "paragraph",
        text: "The panel is drawn fasting for one reason only: a recent fatty meal loads the blood with chylomicrons, and the triacylglycerol figure becomes meaningless. Fasting for about twelve hours lets the chylomicrons clear, so that what is left is the fasting profile of endogenous production.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "A triglyceride over about 10 mmol/L carries an acute risk of pancreatitis, not just of coronary disease, and it is the one lipid abnormality that is an emergency in its own right. It is also the one that responds dramatically to a very low fat diet, because the substrate is the load the lipoprotein lipase must unload.",
      },

      { type: "heading", level: 2, text: "The lipid lowering drugs" },
      {
        type: "table",
        headers: ["Drug", "Target", "Effect on the panel", "Principal adverse effect"],
        rows: [
          ["Statins", "The committed enzyme of cholesterol synthesis in the liver", "LDL falls, sometimes by over half; HDL may rise slightly", "Myopathy, and a transaminitis; they are the drugs with the strongest outcome evidence"],
          ["Ezetimibe", "The intestinal cholesterol transporter", "A small additional LDL fall, by blocking absorption", "Few, and it is used when a statin alone is insufficient"],
          ["Bile acid sequestrants", "Bind bile acids in the gut and interrupt their reabsorption", "The liver diverts cholesterol into new bile acids synthesis, and LDL falls", "Constipation, and impaired absorption of fat-soluble vitamins and of other drugs"],
          ["PCSK9 inhibitors", "Antibody against the protein that degrades the LDL receptor", "A very large LDL fall, because the receptors are not destroyed", "Injection site reactions"],
          ["Fibrates", "The peroxisome proliferator activated receptor alpha", "Triglyceride falls substantially and HDL rises", "Myopathy, particularly with a statin"],
          ["Omega-3 fatty acids", "Reduce hepatic triacylglycerol secretion", "Triglyceride falls", "Few"],
        ],
      },
      {
        type: "question",
        prompt: "A patient's LDL cholesterol falls by 55 per cent on a statin and a further 20 per cent when ezetimibe is added. Explain the two mechanisms, and why the addition works even though the statin is already maximal.",
        answer: "The statin blocks synthesis in the liver, which responds by expressing more LDL receptors and so clearing more LDL from the blood; ezetimibe blocks intestinal absorption, which lowers the amount of cholesterol the liver receives and forces it to draw still more from the circulation. The two mechanisms are at different points, so the second works even when the first is at its maximum.",
        explanation: "Every combination of lipid drugs is built by pairing drugs that act at different points of the same cholesterol balance.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the HDL cholesterol in the panel is the cholesterol carried in the HDL of the blood only. HDL is the smallest and densest particle, so its cholesterol is a small fraction of the total — which is why a very high total cholesterol with a high HDL can still be a low risk patient.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a lipid panel is valid after a meal. It is drawn fasting, because a recent meal loads chylomicrons and distorts the triglyceride figure entirely.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing lactose intolerance with a milk allergy. Intolerance is an enzyme deficiency with no immune involvement and cannot cause hives or anaphylaxis; allergy is an IgE mediated reaction that can be life threatening.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does a lactase deficient patient's diarrhoea improve after avoiding dairy, and why is a yoghurt better tolerated than milk?",
        answer: "Because yoghurt has already had some of its lactose fermented by the bacteria used in its production, so there is less lactose to reach the colon. Its live bacteria may also help, but the main effect is that about a quarter to a half of the lactose has already been consumed during fermentation.",
        explanation: "This is also why hard cheese, which is nearly lactose free, is well tolerated and fresh milk is not.",
      },
      {
        type: "question",
        prompt: "Give the mechanism of Tay-Sachs disease and the organelle in which the substrate accumulates.",
        answer: "The lysosomal enzyme hexosaminidase A is absent, so the ganglioside GM2 cannot be degraded and accumulates in the lysosomes of the neurons. The accumulation kills the neurons and gives the neurodegeneration, the startle response and the cherry red macular spot.",
        explanation: "The same principle underlies every lysosomal storage disorder: one missing lysosomal enzyme and its normal substrate filling the organelle that should have degraded it.",
      },
      {
        type: "question",
        prompt: "How does a bile acid sequestrant lower LDL cholesterol, and why does it interfere with the absorption of fat-soluble vitamins?",
        answer: "The resin binds bile acids in the gut so they cannot be reabsorbed, so the liver must make new bile acids from cholesterol and draws the cholesterol out of the blood to do it. Because bile acids are needed for micelle formation, the resin also blocks the absorption of the fat-soluble vitamins that travel in the same micelles.",
        explanation: "This is the classic trade of a lipid drug: it lowers one lipid risk and creates another, which is why the fat-soluble vitamins are supplemented.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which enzyme is deficient in the commonest form of lactose intolerance?",
        options: ["Sucrase", "Isomaltase", "Lactase at the brush border of the enterocyte", "Pancreatic amylase"],
        correctIndex: 2,
        explanation: "Lactase, the brush border enzyme of the small bowel, is reduced or absent after weaning in most of the world's population. Pancreatic amylase digests starch, not milk sugar.",
      },
      {
        type: "mcq",
        stem: "Which organelle accumulates the undegraded substrate in a lysosomal storage disease?",
        options: ["The mitochondrion", "The lysosome", "The peroxisome", "The smooth endoplasmic reticulum"],
        correctIndex: 1,
        explanation: "Lysosomal enzymes are the hydrolytic machinery of the cell, and the substrate of a missing one accumulates in the lysosome itself. This is the reason enzyme replacement therapy can help, by supplying the missing enzyme to the right compartment.",
      },
      {
        type: "mcq",
        stem: "Which statement about a fasting lipid panel is correct?",
        options: [
          "It is valid after a normal meal",
          "It is drawn fasting, so that the chylomicrons have cleared and the panel reflects endogenous production",
          "It measures the cholesterol stored in adipose tissue",
          "It is drawn after a high fat meal to maximise the signal",
        ],
        correctIndex: 1,
        explanation: "A recent fatty meal loads chylomicrons and makes the triglyceride figure meaningless. Twelve hours of fasting lets them clear, so the panel shows the endogenous particles.",
      },
      {
        type: "mcq",
        stem: "How do the statins lower LDL cholesterol?",
        options: [
          "By blocking intestinal cholesterol absorption",
          "By blocking the committed step of hepatic cholesterol synthesis, so the liver expresses more LDL receptors and clears more LDL from the blood",
          "By blocking the LDL receptor so LDL is retained in the liver",
          "By binding bile acids and interrupting their reabsorption",
        ],
        correctIndex: 1,
        explanation: "The fall in hepatic synthesis causes receptor upregulation, and the increased receptor clearance is what actually lowers the plasma LDL. That is also why a patient with a defective receptor cannot respond.",
      },
      {
        type: "mcq",
        stem: "Which lipid abnormality is an acute risk of pancreatitis?",
        options: [
          "A triglyceride of about 12 mmol/L",
          "An LDL cholesterol of 5 mmol/L",
          "An HDL cholesterol of 0.8 mmol/L",
          "A total cholesterol of 6 mmol/L",
        ],
        correctIndex: 0,
        explanation: "A triglyceride over about 10 mmol/L carries a risk of acute pancreatitis, and it responds to a very low fat diet and to fibrate therapy. The cholesterol values carry a coronary risk, not a pancreatic one.",
      },
      {
        type: "mcq",
        stem: "Which statement about the two lipid disorders is correct?",
        options: [
          "Tay-Sachs is a deficiency of a lysosomal enzyme and Gaucher of a peroxisomal one",
          "Tay-Sachs is a lysosomal hexosaminidase deficiency and Gaucher a lysosomal glucocerebrosidase deficiency",
          "Both are deficiencies of plasma enzymes and neither affects an organelle",
          "Both are defects of a membrane receptor rather than of an enzyme",
        ],
        correctIndex: 1,
        explanation: "Both are lysosomal storage disorders, differing only in which enzyme is missing. One missing gene, one missing lysosomal enzyme and its substrate accumulating in the lysosome.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The brush border of the small bowel is a surface on which the terminal steps of digestion occur, and losing one of its enzymes gives a recognisable syndrome of fermentation and osmotic diarrhoea. The lysosomal storage diseases are the same principle one organelle away: a single missing lysosomal enzyme and its substrate accumulating, and they can now be treated by supplying the enzyme that should have been there. The plasma lipid panel reports four lipoprotein fractions, it is drawn fasting because chylomicrons invalidate it, and the lipid lowering drugs pair agents that act at different points of the body's cholesterol balance.",
      },
      {
        type: "paragraph",
        text: "That completes Module 2 of the biochemistry course: the carbohydrates, the lipids, the membranes they build, the vitamins and trace elements the enzymes of metabolism require, and the messengers derived from the lipids themselves. The next module turns to metabolism and energy, where the same molecules are finally burned.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// MODULE 2 — SBA items, one per authored concept.
// ---------------------------------------------------------------------------
const MODULE_TWO_SBAS: SbaSeed[] = [
  {
    slug: "medical-biochemistry-i--monosaccharides--sba",
    concept: "monosaccharides",
    stem: "Two polysaccharides are both polymers of glucose. Which distinction explains why one is digestible and the other is dietary fibre?",
    options: [
      "One is a polymer of glucose and the other of galactose",
      "One has alpha 1,4 linkages that human amylase hydrolyses and the other has beta 1,4 linkages that human enzymes cannot break",
      "One is branched and the other is a linear chain, and branching alone determines digestibility",
      "One is a hexose and the other a pentose polymer",
    ],
    correctAnswer:
      "One has alpha 1,4 linkages that human amylase hydrolyses and the other has beta 1,4 linkages that human enzymes cannot break",
    explanation:
      "Starch and cellulose are both glucose polymers; the configuration at the anomeric carbon, alpha in starch and beta in cellulose, gives a loose helix against a straight cable. Human enzymes bind the helix and not the cable, so only gut bacteria can break cellulose down.",
    difficulty: "medium",
  },
  {
    slug: "medical-biochemistry-i--lipids--sba",
    concept: "lipids",
    stem: "Which statement explains why a cis unsaturated fatty acid gives an oil but a saturated one of the same chain length gives a solid fat?",
    options: [
      "The cis double bond makes the chain longer, so it dissolves differently",
      "The cis double bond puts a kink in the chain, so neighbouring molecules cannot pack and the melting point falls",
      "The saturated chain has more oxygens and so forms stronger hydrogen bonds",
      "The cis double bond makes the fatty acid amphipathic, so it dissolves in water",
    ],
    correctAnswer: "The cis double bond puts a kink in the chain, so neighbouring molecules cannot pack and the melting point falls",
    explanation:
      "The kink prevents ordered packing, so the molecules are held by fewer van der Waals contacts and melt at a low temperature. Saturation leaves the chain straight and packable, hence a high melting point and a solid at room temperature.",
    difficulty: "medium",
  },
  {
    slug: "medical-biochemistry-i--cell-membranes--sba",
    concept: "cell-membranes",
    stem: "What is the stoichiometry of the sodium-potassium ATPase per cycle, and why is it described as electrogenic?",
    options: [
      "Two sodium out and two potassium in, so it is electrically neutral",
      "Three sodium out and two potassium in, using one ATP, so a net positive charge leaves the cell",
      "Three sodium in and two potassium out, so a net positive charge enters the cell",
      "One sodium out and one potassium in, using one ATP, so it is electrically neutral",
    ],
    correctAnswer: "Three sodium out and two potassium in, using one ATP, so a net positive charge leaves the cell",
    explanation:
      "Three positive charges leave and only two enter, so the cycle makes the outside of the cell more positive. That direct contribution is a few millivolts of the resting potential, most of which comes from the potassium leak described in Module 1.",
    difficulty: "medium",
  },
  {
    slug: "medical-biochemistry-i--vitamins-trace-elements--sba",
    concept: "vitamins-trace-elements",
    stem: "Why must thiamine be given before glucose to a malnourished alcoholic patient?",
    options: [
      "Because glucose requires a vitamin for its absorption, and thiamine is that vitamin",
      "Because thiamine pyrophosphate is the cofactor for pyruvate dehydrogenase, so a glucose load consumes the small remaining thiamine and can precipitate Wernicke encephalopathy",
      "Because glucose and thiamine form a complex that is not absorbed",
      "Because thiamine is required for the synthesis of glucose in the liver",
    ],
    correctAnswer:
      "Because thiamine pyrophosphate is the cofactor for pyruvate dehydrogenase, so a glucose load consumes the small remaining thiamine and can precipitate Wernicke encephalopathy",
    explanation:
      "Thiamine pyrophosphate is required by three central dehydrogenases and the metabolism of a glucose load falls on the first of them. Giving glucose before thiamine consumes the last of the supply, so the rule is thiamine then glucose.",
    difficulty: "hard",
  },
  {
    slug: "medical-biochemistry-i--signal-transduction--sba",
    concept: "signal-transduction",
    stem: "Which class of messenger must have its receptor on the cell surface?",
    options: [
      "The steroid hormones",
      "Thyroid hormone",
      "The peptide hormones and most amines",
      "Nitric oxide",
    ],
    correctAnswer: "The peptide hormones and most amines",
    explanation:
      "Peptide and amine hormones are polar and cannot cross the lipid bilayer, so their receptors are on the surface and act as the transducer. Steroids, thyroid hormone and the gaseous nitric oxide all cross the membrane directly.",
    difficulty: "medium",
  },
  {
    slug: "medical-biochemistry-i--glycoproteins-proteoglycans--sba",
    concept: "glycoproteins-proteoglycans",
    stem: "Which correctly distinguishes a proteoglycan from a glycoprotein?",
    options: [
      "A proteoglycan is a protein with one short sugar chain, and a glycoprotein has dozens of long chains",
      "A proteoglycan is mostly carbohydrate by weight, with very long glycosaminoglycan chains, and a glycoprotein is mostly protein with a short sugar chain",
      "The two terms are synonyms and either may be used",
      "A proteoglycan is a lipid, and a glycoprotein is a carbohydrate",
    ],
    correctAnswer:
      "A proteoglycan is mostly carbohydrate by weight, with very long glycosaminoglycan chains, and a glycoprotein is mostly protein with a short sugar chain",
    explanation:
      "The proteoglycan is up to 95 per cent carbohydrate, with dozens of long glycosaminoglycan chains attached to a core protein; the glycoprotein is a folded protein with a short branched chain. Aggrecan is the proteoglycan that makes cartilage resist compression.",
    difficulty: "medium",
  },
  {
    slug: "medical-biochemistry-i--membrane-dynamics--sba",
    concept: "membrane-dynamics",
    stem: "Which phospholipid is normally confined to the inner leaflet of the plasma membrane, and what does its exposure on the outer surface signify?",
    options: [
      "Phosphatidylcholine, which signifies a membrane raft when external",
      "Phosphatidylserine, which signifies apoptosis when external",
      "Sphingomyelin, which signifies an apoptosis signal when external",
      "Cholesterol, which is confined to the inner leaflet only",
    ],
    correctAnswer: "Phosphatidylserine, which signifies apoptosis when external",
    explanation:
      "Phosphatidylserine is held inside by an ATP-driven flippase, and the collapse of that asymmetry during apoptosis puts it on the outer surface, where it is the phagocytic eat-me signal. Phosphatidylcholine and sphingomyelin dominate the outer leaflet.",
    difficulty: "hard",
  },
  {
    slug: "medical-biochemistry-i--lipoproteins--sba",
    concept: "lipoproteins",
    stem: "Which apolipoprotein is carried only by particles assembled in the intestine?",
    options: ["B-100", "B-48", "A-I", "E"],
    correctAnswer: "B-48",
    explanation:
      "B-48 is synthesised by the enterocyte and is the apolipoprotein of the chylomicron, while B-100 is made by the liver and is the apolipoprotein of VLDL and therefore of LDL. Apolipoprotein A-I belongs to HDL.",
    difficulty: "medium",
  },
  {
    slug: "medical-biochemistry-i--prostaglandins-steroids--sba",
    concept: "prostaglandins-steroids",
    stem: "Which enzyme releases arachidonate from the membrane phospholipid and is therefore the target of the corticosteroids?",
    options: ["Cyclooxygenase", "5-lipoxygenase", "Phospholipase A2", "Phospholipase C"],
    correctAnswer: "Phospholipase A2",
    explanation:
      "Phospholipase A2 cleaves the ester bond at the second carbon of the membrane phospholipid. Because corticosteroids block it, no arachidonate is released at all, so both the cyclooxygenase and the lipoxygenase routes are silenced — which is why a steroid is broader than an NSAID.",
    difficulty: "medium",
  },
  {
    slug: "medical-biochemistry-i--clinical-membrane-lipids--sba",
    concept: "clinical-membrane-lipids",
    stem: "Which enzyme is missing in Tay-Sachs disease, and in which organelle does the substrate accumulate?",
    options: [
      "Glucocerebrosidase, accumulating in the mitochondrion",
      "Hexosaminidase A, accumulating in the lysosome",
      "Sphingomyelinase, accumulating in the peroxisome",
      "Alpha-L-iduronidase, accumulating in the smooth endoplasmic reticulum",
    ],
    correctAnswer: "Hexosaminidase A, accumulating in the lysosome",
    explanation:
      "Tay-Sachs is a deficiency of the lysosomal hexosaminidase A, so the ganglioside GM2 cannot be degraded and accumulates in the neuronal lysosomes. Enzyme replacement therapy works because the missing enzyme can be delivered to the correct compartment.",
    difficulty: "medium",
  },
];

// ---------------------------------------------------------------------------
// MODULE 2 — five further concepts authored in this round.
//
// They are listed LAST in the lessons array on purpose: CourseLesson ids are
// positional (${courseId}-lesson-N), so inserting among existing rows would
// re-point ids that already exist in the live database. Module membership is
// carried by ConceptNode.moduleId, and the lesson page groups by that field,
// so these concepts still teach in correct order inside Module 2.
// ---------------------------------------------------------------------------
const MODULE_TWO_EXTRA_LESSONS: LessonSeed[] = [
  { title: "Glycoproteins, proteoglycans & the extracellular matrix", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Glycoproteins, proteoglycans and the extracellular matrix", slug: "glycoproteins-proteoglycans", summary: "Collagen and elastin as the fibrous matrix, the glycosaminoglycan gel that resists compression, the hydroxylation and cross-linking that make collagen strong, and the storage diseases of that machinery.", blooms: "analyze", minutes: 40, prereq: ["monosaccharides"] }, content: lesson11() as never },
  { title: "Membrane dynamics: fluidity, rafts & cholesterol", module: 2, estimatedMinutes: 35, authored: true, concept: { title: "Membrane dynamics: fluidity, lipid rafts and protein anchoring", slug: "membrane-dynamics", summary: "Lateral against flip-flop movement, the regulation of fluidity, the ordered lipid raft, the four ways a protein is anchored, the asymmetric leaflets and the phosphatidylserine apoptosis signal, and the mechanics of fusion and endocytosis.", blooms: "analyze", minutes: 35, prereq: ["cell-membranes"] }, content: lesson12() as never },
  { title: "Lipoproteins & cholesterol transport", module: 2, estimatedMinutes: 45, authored: true, concept: { title: "Lipoproteins and cholesterol transport", slug: "lipoproteins", summary: "The six lipoprotein classes by density and composition, the exogenous and endogenous pathways, the apolipoproteins B-48, B-100 and E, HDL reverse cholesterol transport, and the inherited defects of clearance.", blooms: "analyze", minutes: 45, prereq: ["lipids", "cell-membranes"] }, content: lesson13() as never },
  { title: "Lipid-derived signalling: prostaglandins & steroid hormones", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Prostaglandins, leukotrienes and steroid hormones", slug: "prostaglandins-steroids", summary: "Arachidonate released by phospholipase A2, the cyclooxygenase and lipoxygenase routes, the three classes of eicosanoid, the drugs that inhibit the pathway, and the steroid hormones derived from cholesterol.", blooms: "analyze", minutes: 40, prereq: ["lipids"] }, content: lesson14() as never },
  { title: "Clinical correlation: membrane receptors & lipid disorders", module: 2, estimatedMinutes: 35, authored: true, concept: { title: "Clinical correlation: membrane receptors and lipid disorders", slug: "clinical-membrane-lipids", summary: "Brush border enzyme deficiencies and lactose intolerance, the lysosomal storage diseases, the interpretation of a fasting lipid panel, and the mechanism of the lipid lowering drugs.", blooms: "apply", minutes: 35, prereq: ["lipoproteins", "membrane-dynamics"] }, content: lesson15() as never },
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
    ...MODULE_TWO_EXTRA_LESSONS,
  ],
  sbas: [...MODULE_ONE_SBAS, ...MODULE_TWO_SBAS],
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
