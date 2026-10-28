import { prisma, seedMbbsCourse, type LessonSeed, type SbaSeed, type SubjectSeed } from "./spine";

/**
 * PHRM 202 — Pharmacology & Therapeutics.
 *
 * Module 1 ("Foundations of pharmacology") is authored in full: 6 lessons in
 * the pilot-report format with one SBA item per concept. Only established,
 * textbook pharmacology is asserted — the four classes of receptor, the
 * meaning of Km/Vmax of distribution, half-life and steady state, the CYP450
 * induction and inhibition interactions, and the four phases of drug
 * development with their conventionally quoted sizes.
 *
 * Modules 2-5 (autonomic, cardiovascular and renal, antimicrobial, CNS and
 * special systems) ship as a real concept spine and prerequisite DAG with
 * tracked-placeholder lessons (needsCheck true).
 *
 * Requires prisma/seed-university.ts first (faculty, department, programme).
 */

const COURSE_SLUG = "pharmacology-foundations";

const MODULES = [
  { slug: "pharmacology-foundations", title: "M1 — Foundations of pharmacology" },
  { slug: "autonomic-pharmacology", title: "M2 — Autonomic pharmacology" },
  { slug: "cardiovascular-renal-pharmacology", title: "M3 — Cardiovascular & renal pharmacology" },
  { slug: "antimicrobial-pharmacology", title: "M4 — Antimicrobial & anti-infective pharmacology" },
  { slug: "cns-endocrine-special", title: "M5 — CNS, endocrine & special systems" },
];

// ---------------------------------------------------------------------------
// LESSON 1 — What pharmacology is: drugs, receptors & the body's response (fully authored)
// ---------------------------------------------------------------------------
function lesson1() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define a drug and distinguish it from a placebo, a poison and a general anaesthetic; state what a receptor is and name the four receptor families; explain the principle that the receptor determines the response and the drug only triggers it; describe how a drug's site of action gives rise to its therapeutic and toxic effects; and predict from a receptor's tissue distribution which side effects a drug would be expected to produce.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "PHYS 101 module 1 (transport, membranes, membrane potential) and PATH 201 module 1 (cell injury and inflammation), because a drug's toxicity is understood as a cell injury and its action as a molecular event at a membrane protein.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Pharmacology",
        text: "The study of what a drug does to the body (pharmacodynamics) and what the body does to a drug (pharmacokinetics) — two halves of one interaction whose purpose is to predict, explain and improve a therapeutic effect.",
      },
      {
        type: "paragraph",
        text: "Every drug prescription is a prediction. 'Take this drug at this dose and it will produce that effect with this risk.' Pharmacology is the discipline that makes that prediction reliable: it tells you where the drug acts, how it reaches that site, how fast it acts, how long it lasts, and what else happens on the way. A clinician who can reason through a drug's action and its disposition does not have to memorise a toxicity — it follows from the mechanism.",
      },

      { type: "heading", level: 2, text: "Drugs and receptors" },
      {
        type: "paragraph",
        text: "Most drug effects begin with a drug binding to a target molecule — almost always a protein. The target is usually a receptor, but targets also include enzymes, ion channels, transporter molecules, and in the case of the anticancer and antibiotic drugs, structural features unique to the target cell. The crucial consequence of this: a drug does not have a pharmacological identity of its own. Its effect is determined by the receptor it binds and by which tissue expresses that receptor.",
      },
      {
        type: "table",
        headers: ["Receptor family", "Mechanism", "Example"],
        rows: [
          ["Ligand-gated ion channel", "Binding opens a pore, changing the membrane potential directly", "The nicotinic acetylcholine receptor at the neuromuscular junction"],
          ["G-protein-coupled receptor", "Binding activates a pathway through a G-protein and a second messenger", "The beta-adrenoceptor, raising cyclic AMP in cardiac muscle"],
          ["Enzyme-linked receptor", "Binding either activates an intrinsic enzyme activity or recruits one", "The insulin receptor, a receptor tyrosine kinase"],
          ["Intracellular (nuclear) receptor", "The ligand crosses the cell membrane and binds a receptor that regulates transcription", "The steroid hormone receptors for cortisol, oestrogen and vitamin D"],
        ],
      },
      {
        type: "paragraph",
        text: "Put the receptor distribution and the receptor together, and the whole drug profile falls out. A drug that stimulates beta-two adrenoceptors dilates the bronchi but also causes tremor in skeletal muscle, because both tissues express that receptor. A drug that stimulates muscarinic receptors increases gut motility, salivation and bronchial smooth muscle tone, and slows the heart — because all of these are cholinergically innervated tissues. The side-effect profile is not a list to memorise; it is a map of the receptor's organs.",
      },

      { type: "heading", level: 2, text: "Worked example: the receptor determines everything" },
      {
        type: "paragraph",
        text: "Consider a drug that blocks the beta-adrenoceptor. In a patient with angina it reduces heart rate and contractility, lowering myocardial oxygen demand, and the same action relieves tremor in an anxious patient. But in a patient with asthma, the same drug may block the beta-two receptors in the airways, removing the bronchodilator drive and worsening the wheeze. And in an insulin-dependent diabetic it blocks a limb of the sympathetic response to hypoglycaemia, masking the warning tremor and tachycardia that tell the patient to eat.",
      },
      {
        type: "paragraph",
        text: "Nothing about the drug changed between the three patients. The receptor is in every one of them; the clinical context differs, and so the effect is therapeutic in one and harmful in another. This is the single most useful habit of thinking in pharmacology: predict the effect from the receptor, then ask what else that receptor is doing in a patient who happens to also have other conditions.",
      },
      {
        type: "question",
        prompt: "A drug blocks the beta-one adrenoceptor. Predict three clinical effects and state where the receptor is located.",
        answer: "It slows the heart rate and reduces contractility (beta-one receptors in cardiac muscle and the conducting system), reduces renin release from the kidney, and blocks the sympathetic warning signs of hypoglycaemia. These follow from the receptor's tissue distribution.",
        explanation: "The receptor is the identity of the drug's action; the tissue distribution of the receptor gives the whole effect profile, therapeutic and toxic.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a drug has one predetermined effect. The effect is a property of the receptor and the tissue. The same molecule is a therapeutic in one patient and a hazard in another, and the profile follows the receptor's distribution.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating antibiotics as an exception in which the target is the organism. The target is still a protein in a cell — the bacterial cell wall, the ribosome, the DNA gyrase — and it is the difference between that bacterial protein and the human equivalent that makes the drug selective.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a receptor is a molecule inside the cell only. Many are membrane proteins, and the four receptor families differ in whether their ligand can cross the membrane — which is what decides whether an intracellular receptor is used.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What are the two halves of pharmacology, and why is each necessary?",
        answer: "Pharmacodynamics, what the drug does to the body, and pharmacokinetics, what the body does to the drug. You need both: the former predicts the effect, and the latter predicts whether the drug will arrive at the right concentration at the right site for the right time.",
        explanation: "A perfect action at the wrong concentration in the wrong cell is useless, and perfect delivery of the wrong action is worse. The two halves are inseparable in practice.",
      },
      {
        type: "question",
        prompt: "Name the four receptor families in pharmacology.",
        answer: "Ligand-gated ion channels, G-protein-coupled receptors, enzyme-linked (or tyrosine kinase) receptors, and intracellular (nuclear) receptors regulating gene transcription.",
        explanation: "Each represents a different mechanism of converting the binding event into a cellular response — and a different kinetic signature.",
      },
      {
        type: "question",
        prompt: "Where do the side effects of a beta-blocker come from, mechanistically?",
        answer: "From the distribution of the beta receptor outside the heart: in skeletal muscle (tremor), in bronchi (bronchoconstriction from beta-two blockade), in the kidney (reduced renin), and in the sympathetic response to hypoglycaemia (masked warnings).",
        explanation: "The side-effect profile is the receptor map. This is the reason cardioselective beta-one blockers were developed.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which receptor family has the fastest response, and why?",
        options: [
          "The nuclear receptor, because it operates directly on the genome",
          "The ligand-gated ion channel, because binding opens a pore and changes the membrane potential immediately",
          "The G-protein-coupled receptor, because G-proteins act instantly",
          "The enzyme-linked receptor, because phosphorylation is immediate",
        ],
        correctIndex: 1,
        explanation: "A ligand-gated channel is a receptor and a pore in one protein, so the effect of binding is an instant change in membrane potential. The other families act through pathways, so they are slower.",
      },
      {
        type: "mcq",
        stem: "A patient with asthma is given a non-selective beta-blocker for palpitations and wheezes. What is the mechanism?",
        options: [
          "The drug directly irritates the airways",
          "Beta-two adrenoceptors in the bronchi are blocked, removing the sympathetic bronchodilator drive",
          "The drug causes histamine release from mast cells",
          "The drug acts as a partial agonist only at cardiac receptors",
        ],
        correctIndex: 1,
        explanation: "Beta-two receptors dilate the bronchi under sympathetic stimulation; blocking them removes that drive, which is why a cardioselective beta-one antagonist is preferred in a patient with airway disease.",
      },
      {
        type: "mcq",
        stem: "Which of these is the correct reason for a drug's selectivity between bacterial and human cells?",
        options: [
          "The bacterial receptor is more abundant", "The target protein has a different structure in the organism than in the human host", "The drug is more lipophilic in bacteria", "Drugs cannot cross the human cell membrane",
        ],
        correctIndex: 1,
        explanation: "Selective toxicity in chemotherapy and infectology relies on a difference between the target in the organism and its human equivalent, such as the bacterial ribosome, cell-wall synthesis enzymes, or DNA gyrase.",
      },
      {
        type: "mcq",
        stem: "Which statement about receptor-mediated drug effects is correct?",
        options: [
          "The drug determines its own effect, regardless of the receptor",
          "The receptor and the tissue determine the effect; the drug only initiates it",
          "Only the dose determines the effect",
          "An antagonist produces a response by binding to the receptor",
        ],
        correctIndex: 1,
        explanation: "The receptor defines which cellular response is possible and where; the drug is merely an initiator or a blocker of that response.",
      },
      {
        type: "mcq",
        stem: "Where do the cardiovascular effects of a non-selective beta-blocker arise?",
        options: [
          "From blockade of beta-one receptors in the heart and conducting system",
          "From blockade of alpha receptors in blood vessels",
          "From blockade of muscarinic receptors in the heart only",
          "From blockade of beta-three receptors in adipose tissue",
        ],
        correctIndex: 0,
        explanation: "Beta-one receptors in the sino-atrial node, the myocardium and the conducting system mediate the reductions in rate and contractility. Beta-three receptors are in adipose tissue and have no direct cardiovascular role.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Pharmacology has two inseparable halves: pharmacodynamics, what the drug does to the body, and pharmacokinetics, what the body does to the drug. Almost every drug acts by binding a target protein — most often a receptor of one of the four families — and the effect is determined not by the drug but by which receptor, in which tissue. That principle means a drug's entire side-effect profile can be derived from the receptor's distribution, which is the first of the habits of thinking this course builds.",
      },
      {
        type: "paragraph",
        text: "Next: pharmacodynamics proper — agonists, partial agonists, antagonists, the dose-response curve and the therapeutic index, and why a drug that occupies a receptor does not necessarily do what its natural transmitter does.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 2 — Pharmacodynamics: receptors, agonists & antagonists (fully authored)
// ---------------------------------------------------------------------------
function lesson2() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define affinity and intrinsic activity and distinguish an agonist, a partial agonist, a competitive antagonist and a non-competitive (insurmountable) antagonist; interpret a log dose-response curve and explain the meaning of EC50 and of Emax; state why antagonists shift agonist curves to the right and why some antagonists lower the maximum; explain the meaning of spare receptors; and predict the outcome of combining two drugs acting on the same receptor.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (What pharmacology is). You need the four receptor families and the principle that the receptor determines the effect.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Intrinsic activity",
        text: "The ability of a drug, once bound to its receptor, to produce a response. A full agonist has high intrinsic activity, a partial agonist less, and an antagonist none at all — it occupies the receptor without activating it.",
      },
      {
        type: "paragraph",
        text: "Binding a receptor and activating a receptor are two separate properties, and keeping them apart is the whole of this lesson. Affinity is how tightly a drug binds. Intrinsic activity is what happens when it does. Any combination of the two is possible, and the four combinations are the four drug classes: full agonist, partial agonist, antagonist, and the inverse agonist, which reduces the receptor's spontaneous activity.",
      },

      { type: "heading", level: 2, text: "The four classes of drug at a receptor" },
      {
        type: "table",
        headers: ["Drug class", "Affinity", "Intrinsic activity", "Effect on the receptor's own response"],
        rows: [
          ["Full agonist", "High", "Full", "Produces the maximal response of the system"],
          ["Partial agonist", "High", "Partial", "Produces a submaximal response — and can reduce the response to a full agonist"],
          ["Antagonist (competitive)", "High", "None", "Blocks the receptor; the agonist's curve shifts right, with the same maximum at high enough agonist"],
          ["Antagonist (non-competitive, insurmountable)", "High", "None", "Blocks the receptor in a way that more agonist cannot overcome, so the maximum response falls"],
        ],
      },
      {
        type: "paragraph",
        text: "A partial agonist in the presence of a full agonist reduces the response — which seems paradoxical, and is the reason the distinction is examinated. A partial agonist occupies the receptor and produces only a sub-maximal response. Add a full agonist and the full agonist competes with the partial agonist for the same site; at high concentrations of the full agonist its maximal response is restored. So a partial agonist can be an agonist on its own and an antagonist in the presence of a full agonist — the behaviour that carved its niche in prescribing, as in the partial opioid agonist buprenorphine, which relieves pain but has a ceiling on respiratory depression.",
      },

      { type: "heading", level: 2, text: "Worked example: the log dose-response curve" },
      {
        type: "paragraph",
        text: "The dose-response curve is plotted as the logarithm of dose against the response, and its three parameters are used in every drug comparison. The concentration that gives half the maximum effect is EC50, the smaller the concentration the more potent the drug. The maximum response is Emax, which is the measurement of efficacy — not how much drug was needed, but how much effect the system can achieve. And the slope reports cooperativity of binding, which can distinguish an allosteric interaction.",
      },
      {
        type: "table",
        headers: ["Parameter", "What it measures", "Why it matters clinically"],
        rows: [
          ["EC50", "The concentration producing half of Emax — the inverse of potency", "The more potent drug needs a lower dose; a shift to the right after a competitive antagonist means more is needed for the same effect"],
          ["Emax", "The maximum response the system can produce", "The measure of efficacy: a drug with a lower EC50 but a higher Emax may still be the better drug for a severe illness"],
          ["Therapeutic index", "The ratio TD50 to ED50 — toxic dose over effective dose", "The safety margin: a wide index (penicillin) permits confident dosing; a narrow one (digoxin, lithium, phenytoin) requires monitoring"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Potency and efficacy are routinely confused and they are different. Potency is the dose needed; efficacy is the size of the response. A drug may be more potent but less efficacious, and if the illness needs a large response, efficacy wins.",
      },

      { type: "heading", level: 2, text: "Worked example: spare receptors" },
      {
        type: "paragraph",
        text: "A maximal response in some tissues is achieved when only a fraction of the receptors are occupied. The remaining unoccupied receptors are the spare receptors. This explains how a tissue can respond to a tiny concentration of a drug when the receptor's affinity alone cannot account for it: the concentration at which half the receptors are occupied is not the same as the concentration at which the response is half-maximal.",
      },
      {
        type: "paragraph",
        text: "The clinical consequence is the phenomenon of desensitisation. Remove some receptors from the membrane — by prolonged agonist exposure, by an autoimmune attack, or by a drug that down-regulates them — and a maximal response can still be produced if enough spare receptors remain. Tolerance, and the worsening response to repeated dosing in a patient with myasthenia gravis, both have the same molecular basis here.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying competitive antagonism lowers the maximum response. It does not: adding enough agonist out-competes the antagonist and the maximum is restored. A fall in the maximum is non-competitive antagonism — or receptor down-regulation, which is a different mechanism.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the therapeutic index is the ratio of the ED50 to the LD50. It is the TD50 to the ED50, with toxicity not mortality, and for the therapeutic window it describes the concentration range, not a dose ratio.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Calling an 'antagonist' a drug that has no effect. An antagonist can have a profound effect simply by blocking the receptor: naloxone in an opiate overdose, or flumazenil in a benzodiazepine overdose, both reverse otherwise fatal effects.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What is the difference between a competitive and a non-competitive antagonist on a dose-response curve?",
        answer: "A competitive antagonist shifts the agonist curve to the right, raising the apparent EC50 but leaving Emax unchanged. A non-competitive antagonist shifts the curve downwards, so Emax falls with EC50 unchanged.",
        explanation: "Whether or not raising the agonist concentration can restore the response is the discriminator, and it tells you whether the antagonist acts at the same site as the agonist.",
      },
      {
        type: "question",
        prompt: "How can a partial agonist behave as an antagonist?",
        answer: "By occupying the receptor and producing only a submaximal response, it reduces the effect of a full agonist at the same receptor. At high enough full-agonist concentration the maximum response is restored.",
        explanation: "Buprenorphine is a partial opioid agonist, and its ceiling effect is what limits respiratory depression — an advantage in addiction management.",
      },
      {
        type: "question",
        prompt: "What is the therapeutic index of digoxin, and what does it mean for prescribing?",
        answer: "Digoxin has a narrow therapeutic index: the toxic dose is close to the effective dose, so levels are monitored in blood, and the dose is adjusted for renal function and for drugs that interact with its transport.",
        explanation: "A narrow therapeutic index requires monitoring, dose adjustment and awareness of interactions — the practical reason for therapeutic drug monitoring services.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "What happens to the dose-response curve of a full agonist when a competitive antagonist is added?",
        options: [
          "It shifts to the left and the maximum rises",
          "It shifts to the right, and the maximum is unchanged",
          "It shifts downwards, with the maximum reduced",
          "It is unchanged if the antagonist has any affinity",
        ],
        correctIndex: 1,
        explanation: "Competitive antagonism raises the apparent EC50, since more agonist is needed to occupy the same fraction of receptors, but a sufficiently high agonist concentration still achieves the same Emax.",
      },
      {
        type: "mcq",
        stem: "Which of these describes a partial agonist?",
        options: [
          "High affinity, no intrinsic activity", "High affinity, partial intrinsic activity", "Low affinity, full intrinsic activity", "No affinity, high intrinsic activity",
        ],
        correctIndex: 1,
        explanation: "A partial agonist binds the receptor (high affinity) but produces a submaximal response; an antagonist has no intrinsic activity at all.",
      },
      {
        type: "mcq",
        stem: "Which statement about Emax is correct?",
        options: [
          "It measures how potent a drug is", "It measures the maximum response the system can achieve — the drug's efficacy", "It is half of the effect achieved at the EC50", "It is the therapeutic index expressed as a percentage",
        ],
        correctIndex: 1,
        explanation: "Emax is the measure of efficacy — how big the response can be. EC50 is the inverse measure of potency — how much drug is needed.",
      },
      {
        type: "mcq",
        stem: "A drug has a therapeutic index of 2. How should it be prescribed relative to a drug with an index of 100?",
        options: [
          "At a lower dose, because it is more potent", "With therapeutic drug monitoring and attention to interactions, because the toxic and effective doses are close", "At a higher dose, because it is more efficacious", "By mouth only, because it is safer",
        ],
        correctIndex: 1,
        explanation: "A narrow therapeutic index means the toxic concentration is close to the therapeutic one, so drugs like digoxin, lithium and phenytoin are monitored and their doses adjusted for organ function and interacting drugs.",
      },
      {
        type: "mcq",
        stem: "Why is loss of spare receptors a clinical problem in disease?",
        options: [
          "Because spare receptors mean the response is unaffected by desensitisation",
          "Because loss of receptors — from desensitisation, from an autoimmune attack, or down-regulation — reduces the maximum response once the spare receptors are exhausted",
          "Because it increases affinity for the agonist",
          "Because it converts agonists into antagonists",
        ],
        correctIndex: 1,
        explanation: "Spare receptors buffer partial loss; once they are exhausted the maximal response falls. In myasthenia gravis, the receptors themselves are destroyed, and the effect is fatigable weakness.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "At a receptor, a drug can be an agonist, a partial agonist or an antagonist depending on its intrinsic activity rather than its affinity, and a further split separates competitive antagonism — which shifts the curve right without lowering the maximum — from non-competitive antagonism, which lowers the maximum. Dose-response curves are compared by their EC50, a measure of potency, and by their Emax, a measure of efficacy. The therapeutic index, the ratio of toxic to effective dose, decides how carefully a drug must be monitored, and spare receptors buffer the consequences of receptor loss — until they are gone.",
      },
      {
        type: "paragraph",
        text: "Next: pharmacokinetics, the other half. Once a drug is in the body, how does it get to the receptor, how much of it actually arrives, how long does it last, and how does the body get rid of it.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 3 — Pharmacokinetics I: absorption & distribution (fully authored)
// ---------------------------------------------------------------------------
function lesson3() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: distinguish absorption, distribution, metabolism and excretion; define bioavailability and explain the first-pass effect and why it changes with route; describe the factors that determine the volume of distribution and what a large or small volume implies about a drug; explain protein binding, the blood-brain barrier and placental transfer; and predict how a drug's physical properties determine where it ends up in the body.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-2, and from PHYS 101 the mechanisms of membrane transport. Pharmacokinetics is physiology applied to a foreign molecule: it crosses membranes by the same rules.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Pharmacokinetics",
        text: "The four processes that decide how much of a drug reaches its site of action: absorption into the blood, distribution to the tissues, metabolism (biotransformation) in the body, and excretion from it.",
      },
      {
        type: "paragraph",
        text: "A useful abbreviation is ADME: absorption, distribution, metabolism, excretion. Each stage is a fate — a point at which the drug may be slowed, diverted or destroyed — and a drug's clinical behaviour is the net result of all four. A drug given into the gut must survive the stomach, cross the gut wall, cross the liver, survive metabolism, and then distribute to the tissue where it acts; only then can it bind the receptor you studied in the last lesson.",
      },

      { type: "heading", level: 2, text: "Absorption and routes" },
      {
        type: "table",
        headers: ["Route", "Absorption characteristics", "Clinical note"],
        rows: [
          ["Intravenous", "Complete, immediate, and every molecule reaches the circulation", "Required when a fast and predictable effect is needed, or when the gut cannot be used"],
          ["Oral", "Through the gut wall, then through the liver before the general circulation", "The default: easy, but the first-pass effect and the gut's absorption limit both apply"],
          ["Subcutaneous, intramuscular", "Absorbed from the tissue, slowly and predictably", "Depot preparations (insulin, depot antipsychotics, hormonal implants) rely on this"],
          ["Sublingual, buccal", "Absorbed directly into the venous drainage of the head, bypassing the liver", "Nitrate spray, sublingual buprenorphine — where rapid effect or first-pass avoidance matters"],
          ["Rectal", "Partly absorbed directly, partly through the portal circulation", "Useful when vomiting or swallowing is not possible, and in children"],
          ["Topical, inhaled, transdermal", "Local delivery, with limited systemic absorption unless designed otherwise", "Transdermal patches produce a steady plasma concentration without peaks"],
        ],
      },
      {
        type: "paragraph",
        text: "Bioavailability is the fraction of the administered dose that reaches the systemic circulation unchanged, and it is the parameter that differs most between routes. It is 100 per cent by the intravenous route and lower by the others. The oral route has two sources of loss: incomplete absorption from the gut, and metabolism in the gut wall and the liver before the drug reaches the general circulation. Once first-pass metabolism is saturated — which is why oral and intravenous doses of a propranolol, for instance, differ by a factor of several — the relationship between dose and blood level becomes non-linear and increasingly difficult to predict.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The first-pass effect is why some drugs cannot be given orally at all: nitroglycerin and lignocaine are metabolised so extensively in the liver that the oral route delivers almost nothing to the general circulation. Sublingual nitroglycerin bypasses it and works within minutes.",
      },

      { type: "heading", level: 2, text: "Worked example: what a volume of distribution tells you" },
      {
        type: "definition",
        term: "Volume of distribution",
        text: "The volume in which a drug appears to be distributed, calculated as the amount in the body divided by the plasma concentration. It is a conceptual volume, not necessarily a physical one.",
      },
      {
        type: "paragraph",
        text: "If a 70 kg adult has 5 litres of blood and a drug distributes only into the blood, its volume of distribution is about 5 litres — the volume of the blood itself. If it also distributes into the extracellular fluid of 14 litres, its volume is about 14 litres. If it is lipophilic and distributes into total body water of about 42 litres, its volume is about 42 litres. And a drug that binds fat, such as a benzodiazepine or digoxin, may have a volume of 200 to 500 litres — larger than the body — because the plasma concentration is low relative to the total amount in the body.",
      },
      {
        type: "table",
        headers: ["Volume of distribution", "Interpretation", "Clinical example"],
        rows: [
          ["Small (about 3-5 litres)", "Confined to the blood and the extracellular fluid", "Heparin, which is a large molecule that stays in the circulation"],
          ["Moderate (about 15-40 litres)", "Distributes to body water", "Lithium, alcohol, aminoglycosides such as gentamicin"],
          ["Very large (hundreds of litres)", "Distributes into fat or is heavily protein-bound, so plasma concentration is low", "Amiodarone, digoxin, the benzodiazepines"],
        ],
      },
      {
        type: "paragraph",
        text: "The value is used for one purpose clinically: calculating a loading dose. If a drug distributes into a very large volume, a large loading dose is needed to fill it — which is why digoxin needs a loading dose of about 500 to 1000 micrograms to fill its enormous volume, while a maintenance dose is small because elimination is slow. And a drug with a very large volume is removed by dialysis poorly, because the drug is not in the blood where the machine can reach it.",
      },
      {
        type: "question",
        prompt: "A lipophilic drug is ingested by a patient with a large body fat mass. Would you expect its volume of distribution to be large or small, and why?",
        answer: "Large, because the drug would distribute into the fat tissue, which greatly increases the apparent volume of distribution and lowers the plasma concentration relative to the total amount in the body.",
        explanation: "The volume of distribution is a physical idea: fat is a reservoir, and the larger it is, the larger the volume. This matters when the drug's target is not fat — as in prolonged sedation after a lipid-soluble anaesthetic in an obese patient.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying bioavailability is different by the intravenous route because of the gut. It is 100 per cent intravenously by definition — the whole dose enters the circulation. The gut wall and liver only matter for the enteral routes.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the volume of distribution is always a real anatomical compartment. It is a ratio, and for a drug bound to fat it can be many hundreds of litres — a real number, but not a real volume.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a drug must cross the blood-brain barrier to act in the brain. It must, if its site of action is neural — but some central effects come from peripheral receptors (for instance, hypotension from a peripheral vasodilator causing a synchronised reflex).",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What is the first-pass effect, and why does it change the oral dose needed?",
        answer: "Drug absorbed from the gut passes through the portal vein to the liver, where a fraction is metabolised before reaching the general circulation. A large first-pass effect means only a small fraction of the oral dose reaches the circulation, so the oral dose must be larger — once the enzymes saturate, the relationship becomes non-linear.",
        explanation: "The first-pass effect is the reason for the differences between intravenous and oral dosing of the same drug, and the reason some drugs cannot be given orally at all.",
      },
      {
        type: "question",
        prompt: "Why is digoxin given with a loading dose and a maintenance dose, and how does the volume of distribution decide the loading dose?",
        answer: "Because digoxin has a very large volume of distribution, so the loading dose must be large enough to fill the body's apparent reservoir before the maintenance dose is enough to keep it full. The maintenance dose is then governed by clearance, not by volume.",
        explanation: "Loading dose is volume; maintenance dose is clearance. Confusing them is why digoxin toxicity from an unnecessary loading dose is a classic hospital error.",
      },
      {
        type: "question",
        prompt: "What limits drug transfer across the blood-brain barrier?",
        answer: "Tight junctions between the capillary endothelial cells and active efflux transporters, so only lipid-soluble, unbound and small molecules cross readily. Protein-bound, ionised and large molecules do not.",
        explanation: "The barrier is selective rather than absolute, and breaking it is how some antimicrobials are chosen for meningitis and how some penicillins are combined for synergy in difficult infections.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "What is the defining characteristic of a sublingual dose of nitroglycerin?",
        options: [
          "It avoids the first-pass effect by entering the venous drainage of the head directly",
          "It is more completely absorbed because it passes through the liver",
          "It acts only locally on the tongue",
          "It bypasses the circulation entirely",
        ],
        correctIndex: 0,
        explanation: "The sublingual veins drain into the systemic circulation without passing through the portal vein, so the first-pass effect is avoided and the effect is within minutes. Oral nitroglycerin is extensively destroyed by first-pass metabolism.",
      },
      {
        type: "mcq",
        stem: "A drug has a volume of distribution of about 400 litres in a 70 kg adult. What does that imply?",
        options: [
          "The drug is confined to the blood vessel pool",
          "The drug is extensively bound to fat or to tissue protein, so its plasma concentration is low relative to the total amount in the body",
          "The drug is not absorbed",
          "The drug is not protein-bound",
        ],
        correctIndex: 1,
        explanation: "A volume larger than total body water means the drug has left the plasma for tissues — usually fat or a large binding reservoir. It also means a large loading dose, and poor removal by dialysis.",
      },
      {
        type: "mcq",
        stem: "Which statement about protein binding of drugs is correct?",
        options: [
          "Only the bound fraction is active, so the bound fraction is the important one",
          "Only the free (unbound) fraction can cross membranes, act on receptors and be metabolised or excreted — so it is the active fraction",
          "Protein binding has no effect on distribution",
          "Bound drug is excreted more rapidly by the kidney",
        ],
        correctIndex: 1,
        explanation: "The unbound, free fraction is what crosses membranes, acts on receptors and is cleared. Protein binding is a reservoir, and displacement of a drug from albumin by another (as in warfarin and aspirin) can transiently increase the free fraction.",
      },
      {
        type: "mcq",
        stem: "Which is correct about the first-pass effect?",
        options: [
          "It is the only reason that drugs are given intravenously",
          "It is the metabolism of drug in the gut wall and liver after oral absorption, so bioavailability is reduced",
          "It is the same as hepatic metabolism after the drug reaches the general circulation",
          "It affects the intravenous route more than the oral route",
        ],
        correctIndex: 1,
        explanation: "First-pass metabolism occurs between absorption and reaching the systemic circulation. Intravenous drugs bypass it entirely, which is why an oral and an intravenous dose of the same drug may differ several-fold.",
      },
      {
        type: "mcq",
        stem: "Which factor most favours passage of a drug across the blood-brain barrier?",
        options: [
          "Being strongly protein-bound",
          "High lipid solubility and low ionisation",
          "Large molecular size",
          "An ionic charge",
        ],
        correctIndex: 1,
        explanation: "The tight junctions and efflux transporters of the barrier restrict passage, so lipid-soluble, unbound, small molecules cross most readily. Ionised and bound drugs do not cross easily, which is a design principle for centrally acting drugs.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Pharmacokinetics has four stages: absorption, distribution, metabolism and excretion. The route decides bioavailability, and the oral route suffers a first-pass loss in the gut wall and liver. The volume of distribution is a conceptual volume that tells you where a drug lives and therefore how big a loading dose it needs. Protein binding restricts a drug to the free fraction, and the blood-brain barrier restricts the drugs that reach the brain to the small, lipid-soluble and unbound. Each of these stages is a point at which the body can reduce or redirect the drug — and each is exploited in drug design to make the receptor you want see the drug you want.",
      },
      {
        type: "paragraph",
        text: "Next: metabolism and excretion. You will meet the cytochrome P450 enzymes that make drugs soluble and eliminate them, the induction and inhibition interactions that make prescribing complicated, and the principle of half-life and steady state.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 4 — Pharmacokinetics II: metabolism & excretion (fully authored)
// ---------------------------------------------------------------------------
function lesson4() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe phase I and phase II metabolism and give examples of each; explain the meaning of half-life and steady state; state the rule of thumb that steady state is reached after four to five half-lives; describe the kinetic difference between first-order and zero-order elimination and its clinical importance; explain how renal and hepatic impairment and aging change drug handling; and explain why some drugs have active metabolites.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 3 (Absorption and distribution). Metabolism is the third of the four ADME stages and depends on the same membrane and distribution concepts.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Metabolism",
        text: "The enzymatic transformation of a drug, usually in the liver, into a more water-soluble molecule that can be excreted — and sometimes into an active, inactive, or even more toxic molecule.",
      },
      {
        type: "paragraph",
        text: "Metabolism makes a drug easier to excrete, because the kidney excretes water-soluble molecules and the liver excretes them into bile. What matters clinically is that this is not always the end of the story: some drugs are activated by metabolism (prodrugs), some form metabolites that are themselves active (and whose elimination becomes the limiting factor for the drug's duration), and some form metabolites that are toxic.",
      },

      { type: "heading", level: 2, text: "Phase I and phase II" },
      {
        type: "table",
        headers: ["Phase", "Reaction", "Consequence", "Examples"],
        rows: [
          ["Phase I", "Oxidation, reduction or hydrolysis, exposing a functional group", "Makes the molecule more water-soluble and often changes its activity", "The cytochrome P450 enzymes of the liver (CYP3A4, CYP2D6, CYP2C9), and alcohol dehydrogenase for ethanol"],
          ["Phase II", "Conjugation — glucuronidation, sulfation, acetylation, glycine conjugation", "Produces a highly water-soluble and usually inactive molecule for excretion", "Glucuronidation of morphine, acetylation of isoniazid, sulfation of paracetamol"],
        ],
      },
      {
        type: "paragraph",
        text: "The cytochrome P450 system is the centre of this lesson because of what it does to other drugs. It is a family of enzymes whose synthesis can be increased (induced) by exposure to some drugs, and whose function can be blocked (inhibited) by others. Both actions change the plasma concentration of the second drug. One drug changes another drug's metabolism, and the interaction changes the dose that is needed.",
      },
      {
        type: "table",
        headers: ["Interaction", "Mechanism", "Clinical examples"],
        rows: [
          ["Induction", "A drug increases the synthesis of CYP450, so the other drug is metabolised faster and its concentration falls", "Rifampicin reduces the effectiveness of the oral contraceptive; carbamazepine, phenytoin and chronic alcohol intake do the same; dexamethasone is used to accelerate it"],
          ["Inhibition", "A drug blocks CYP450, so the other drug is metabolised slower and its concentration rises", "Erythromycin and clarithromycin inhibit CYP3A4 and increase the toxicity of drugs like simvastatin and of carbamazepine; ketoconazole, cimetidine, amiodarone and fluconazole have similar effects; grapefruit juice inhibits CYP3A4"],
          ["Genetic variability", "Individuals differ in their CYP enzymes, so the same dose produces different concentrations", "CYP2D6 poor metabolisers have exaggerated responses to codeine and to some beta-blockers; ultra-rapid metabolisers fail to respond to codeine at all"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Induction is slow (days, because new enzyme must be synthesised) while inhibition is immediate, and induction persists for a comparable period after the inducing drug is stopped — which is why the oral contraceptive can fail for weeks after rifampicin is discontinued.",
      },

      { type: "heading", level: 2, text: "Worked example: half-life and steady state" },
      {
        type: "paragraph",
        text: "At a constant rate of elimination the plasma concentration falls exponentially: after one half-life, half remains; after two, a quarter; after three, an eighth. This gives the most useful rule in prescribing: a drug reaches ninety-five per cent of its steady-state concentration after about four to five half-lives, and is effectively eliminated over the same interval. Everything about dosing interval and the delay before a drug becomes effective follows from this.",
      },
      {
        type: "table",
        headers: ["Concept", "Value", "Practical consequence"],
        rows: [
          ["Half-life of phenytoin", "About 20 to 40 hours", "It takes over a week to reach steady state and over a week to leave the system, which is why a low starting dose is essential"],
          ["Half-life of digoxin", "About 36 to 48 hours", "Therapeutic effect requires days to emerge fully, so the loading dose accelerates onset"],
          ["Half-life of amiodarone", "Weeks", "The drug persists for months after the last dose, which is why its dose is reduced and why monitoring continues"],
          ["Half-life of codeine's active metabolite", "About 2 to 4 hours", "A short interval between doses, and a rapid onset and offset of analgesia"],
        ],
      },
      {
        type: "paragraph",
        text: "The maintenance dose needed at steady state is determined by two parameters: the rate of elimination (clearance) and the target concentration. Clearance is reduced by liver disease, by kidney disease for renally cleared drugs, and by the drugs that inhibit the enzyme. That is why a small dose of digoxin is used in a patient with a low creatinine clearance and why the same dose in the same patient weeks later may be toxic.",
      },
      {
        type: "paragraph",
        text: "Zero-order kinetics, the exception, occurs when the eliminating enzyme or transporter is saturated, and the rate becomes constant rather than proportional to concentration. Alcohol, paracetamol in overdose and phenytoin at high concentrations are the classic examples, and the clinical importance is that a small increase in dose can cause a large and disproportionate rise in concentration — the reason paracetamol is dangerous in overdose, and why phenytoin dose increases must be small.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying metabolites are always inactive. Many are active: morphine 6-glucuronide is analgesic; diazepam's desmethyldiazepam is active and long-lived, so sedation accumulates; the active metabolite of the antiplatelet clopidogrel is an active metabolite whose formation depends on a CYP enzyme.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying inducing a drug metabolises it into something more toxic. Usually induction lowers the concentration of the drug and therefore the effect. The exceptions are the drugs whose metabolite is the active form, where induction increases the effect.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying steady state is reached in one half-life. It takes about four to five. This is why lithium takes a week after each dose change before the level can be interpreted, and why phenytoin must be introduced slowly.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why do patients taking rifampicin need a different contraceptive plan?",
        answer: "Because rifampicin induces CYP450, which accelerates the metabolism of oestrogen and progestogen, so the contraceptive blood level falls and the contraceptive can fail. Induction persists for weeks after rifampicin is stopped.",
        explanation: "This is the single commonest drug-induced contraceptive failure, and the reason patients are warned rather than merely monitored.",
      },
      {
        type: "question",
        prompt: "How many half-lives does a drug need to reach steady state, and how long does elimination take?",
        answer: "About four to five half-lives to reach 95 per cent of steady state, and the same interval to eliminate the drug effectively.",
        explanation: "This single rule governs how quickly a drug works on repeated dosing, how long before its effect is fully present, and how long a drug persists after the last dose.",
      },
      {
        type: "question",
        prompt: "Why is paracetamol dangerous in overdose but rarely dangerous in therapeutic doses?",
        answer: "Because its metabolism changes with dose: at therapeutic doses a glucuronide and a sulfate pathway clear it, but in overdose those pathways saturate and a larger fraction is metabolised by CYP2E1 to the toxic N-acetyl-p-benzoquinone imine. Glutathione normally detoxifies it, so once the glutathione is depleted, the metabolite binds liver proteins and causes necrosis.",
        explanation: "The antidote N-acetylcysteine replenishes glutathione stores, which is why it must be given early.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A patient taking rifampicin for tuberculosis loses the effect of their oral contraceptive. What is the mechanism?",
        options: [
          "Inhibition of the metabolism of the contraceptive hormones",
          "Induction of CYP450 enzymes, which accelerates metabolism of the hormones and lowers their blood level",
          "Reduced absorption of the contraceptive from the gut",
          "Displacement of the hormones from plasma proteins",
        ],
        correctIndex: 1,
        explanation: "Rifampicin is a classic enzyme inducer: it increases the synthesis of CYP enzymes so that contraceptive hormones are metabolised faster and their concentration falls. Induction takes days and lasts days to weeks after the drug is stopped.",
      },
      {
        type: "mcq",
        stem: "Approximately how many half-lives are needed to reach steady state after repeated dosing?",
        options: ["1", "2", "4 to 5", "10"],
        correctIndex: 2,
        explanation: "About four to five half-lives are needed to reach about 95 per cent of steady state, and the same interval governs effective elimination.",
      },
      {
        type: "mcq",
        stem: "Which of these is a phase II conjugation reaction?",
        options: ["Oxidation by CYP450", "Hydrolysis by esterases", "Glucuronidation", "Reduction by liver reductases"],
        correctIndex: 2,
        explanation: "Glucuronidation is conjugation (phase II): a glucuronic acid group is transferred onto a functional group, producing a highly water-soluble and usually inactive conjugate for excretion. Oxidation, reduction and hydrolysis are phase I reactions.",
      },
      {
        type: "mcq",
        stem: "Why is paracetamol hepatotoxic in overdose but not at therapeutic doses?",
        options: [
          "Because the liver is unable to conjugate it when it is damaged",
          "Because the glucuronidation and sulfation pathways saturate in overdose, so more of the drug is converted by CYP2E1 into a toxic metabolite that depletes glutathione",
          "Because paracetamol induces its own destruction",
          "Because the kidney is damaged by paracetamol",
        ],
        correctIndex: 1,
        explanation: "At high doses the safe conjugating pathways saturate, so a toxic intermediate forms and is normally inactivated by glutathione. Once glutathione is depleted the intermediate binds hepatocellular proteins and causes necrosis, which is what acetylcysteine treats.",
      },
      {
        type: "mcq",
        stem: "Which is the correct description of zero-order elimination?",
        options: [
          "The rate is proportional to concentration, so it reduces over time",
          "The rate is constant and independent of concentration, because the eliminating system is saturated",
          "The drug is eliminated by the kidney only",
          "The drug is excreted unchanged in bile",
        ],
        correctIndex: 1,
        explanation: "Zero-order kinetics is the behaviour of a saturated enzyme or transporter, and it is dangerous because a small increase in dose produces a disproportionate rise in concentration — the case for phenytoin at high doses and for alcohol.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Metabolism in the liver converts drugs to more water-soluble molecules through phase I reactions, above all the cytochrome P450 enzymes, and phase II conjugations. Because the P450 system can be induced or inhibited by other drugs, changing one drug can change another's concentration, and genetic variation changes it further. Steady state after repeated dosing comes after four to five half-lives, and a drug persists for the same interval after stopping. Zero-order elimination appears when a pathway saturates, and then small dose increases produce large concentration rises.",
      },
      {
        type: "paragraph",
        text: "Next: drug development, prescribing and safety — how a drug reaches a patient, how it is tested, and how its toxic effects are minimised.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 5 — Therapeutics: therapeutic index, drug development & prescribing (fully authored)
// ---------------------------------------------------------------------------
function lesson5() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define the therapeutic window and relate it to monitoring; outline the phases of drug development and what each is designed to answer; identify the point in the sequence at which a drug becomes available to patients; describe how generic substitution differs from brand prescribing; state the requirements for safe prescribing — indication, dose, route, duration, monitoring, and the review of interactions; and define an adverse drug reaction and give the four categories.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-4, and the concept of therapeutic drug monitoring. This lesson applies the preceding principles to prescribing practice.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Therapeutic window",
        text: "The range of concentration between a drug's minimum effective concentration and its first signs of toxicity — a margin inside which most patients lie and outside which a majority suffer harm.",
      },
      {
        type: "paragraph",
        text: "Therapeutic index is the ratio of the dose that produces toxicity to the dose that produces the desired effect in half the population. Most drugs have a wide index, and they can be given with confidence. A few — digoxin, lithium, phenytoin, warfarin, aminoglycosides, and the anticancer drugs — have a narrow index, and they are monitored by blood concentration because the consequence of exceeding the window is severe.",
      },

      { type: "heading", level: 2, text: "Worked example: therapeutic drug monitoring" },
      {
        type: "table",
        headers: ["Drug", "Why it is monitored", "Target range", "Timing of the sample"],
        rows: [
          ["Digoxin", "Narrow index, and toxicity is additive with a low potassium", "About 0.5 to 2.0 micrograms per litre", "At least 6 to 12 hours after the last dose, because of the distribution phase"],
          ["Lithium", "Narrow index, with tinnitus and tremor as early toxicity", "About 0.6 to 1.0 millimoles per litre", "12 hours after the last dose, the trough, at steady state"],
          ["Phenytoin", "Zero-order kinetics, and enzyme induction changes it", "About 10 to 20 milligrams per litre", "Any time after the distribution phase, but interpreted with the dose and other drugs"],
          ["Aminoglycosides (gentamicin)", "Toxicity to the ear and kidney, and clearance depends on renal function", "Peak and trough targets quoted by the laboratory", "Trough immediately before the next dose"],
        ],
      },
      {
        type: "paragraph",
        text: "Two rules apply to every monitoring decision. The blood level is meaningless before the drug has reached steady state — at least four to five half-lives after the last dose change. And it is meaningless unless the timing of the sample is known: a peak level taken at the wrong time will be interpreted wrongly. For this reason a trough sample is usually preferred, taken immediately before the next dose.",
      },

      { type: "heading", level: 2, text: "The phases of drug development" },
      {
        type: "table",
        headers: ["Phase", "Who participates", "What the phase answers"],
        rows: [
          ["Preclinical", "Laboratory and animal studies", "The biological activity and the early toxicity profile — but animal results predict human outcomes poorly"],
          ["Phase I", "20 to 100 healthy volunteers", "Safety, tolerability and the pharmacokinetic profile in humans, including the effect of food and dose proportionality"],
          ["Phase II", "100 to 300 patients with the target disease", "Efficacy at a defined dose range, and the identification of dose-limiting toxicities"],
          ["Phase III", "1000 to 3000 patients, in randomised controlled trials against placebo or an established treatment", "Comparative efficacy and safety, and the safety profile at a scale that might detect uncommon reactions"],
          ["Phase IV (post-marketing)", "All users after marketing approval", "The detection of rare adverse effects, long-term safety, and unusual use — an active role, not a passive one"],
        ],
      },
      {
        type: "paragraph",
        text: "A drug is approved on the basis of demonstrated efficacy, the demonstrated safety profile, and the quality of its manufacture, judged against the balance of benefit and risk. Approval means that the manufacturer may market it for a defined indication, at defined doses, in a defined population. It does not mean the drug is free of all risk, and it does not mean a new indication is covered — which is why prescribing outside the approved indication (off-label use) is common, and explicitly documented, in paediatrics and in psychiatry.",
      },
      {
        type: "question",
        prompt: "Why is a rare but serious adverse effect often discovered only after a drug is marketed?",
        answer: "Because the pre-marketing trials include thousands of patients at most, which is not enough to detect a reaction that occurs in fewer than one in a thousand. Post-marketing reporting systems — pharmacovigilance — collect adverse effects from the whole prescribing population, which is how such effects are found.",
        explanation: "The rarity is the point: no randomised trial can be designed to detect a one-in-tenth-thousand reaction reliably, which is why pharmacovigilance is a separate and mandatory part of a drug's life.",
      },

      { type: "heading", level: 2, text: "Prescribing and safety" },
      {
        type: "paragraph",
        text: "A prescription carries a minimum set of information: the patient, the drug by generic name, the dose and its units, the route, the frequency, the duration, and the indication. A safe prescription also records the monitoring that is needed and the reason for any deviation from a standard choice.",
      },
      {
        type: "table",
        headers: ["Category", "Definition", "Example"],
        rows: [
          ["Type A (predictable)", "A drug's known pharmacology, exaggerated by dose or by individual sensitivity", "Hypotension from an antihypertensive; hypoglycaemia from insulin"],
          ["Type B (idiosyncratic)", "An unpredictable reaction, often immune-mediated and not dose-related", "Anaphylaxis to penicillin; agranulocytosis with clozapine"],
          ["Type C (chronic)", "The effect of long-term exposure", "Peptic ulceration from long-course NSAID use; osteoporosis from long-course corticosteroids"],
          ["Type D (delayed)", "A delayed consequence, including teratogenicity and carcinogenicity", "Vaginal adenocarcinoma with diethylstilboestrol; teratogenicity with thalidomide"],
        ],
      },
      {
        type: "paragraph",
        text: "The value of the classification is that it predicts what you should do about a reaction. Type A reactions stop when the dose stops, and a lower dose often suffices — they are the commonest. Type B reactions cannot be predicted, so the only safe advice is to avoid re-exposure and to report them, so that the pattern becomes visible. Types C and D need long-term monitoring and a programme of follow-up, because their consequences only emerge later.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a drug level can be taken any time after starting. A level is only interpretable at steady state, at least four to five half-lives after the last dose change, and at a properly defined point in the dosing interval.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying Phase III trials detect all adverse effects. They detect common ones; rare and long-term effects are found in Phase IV pharmacovigilance after marketing.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a generic drug is a different drug. Generic drugs contain the same active ingredient as the brand, and they are approved by demonstrating bioequivalence — they differ in inactive ingredients, excipients and appearance.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What does therapeutic drug monitoring of digoxin mean, and why is the timing of the sample important?",
        answer: "It means measuring the plasma concentration, because digoxin has a narrow therapeutic index. The sample is taken at least six to twelve hours after the last dose, so the distribution phase has finished and the level reflects the tissue effect rather than the distribution to tissue still in progress.",
        explanation: "An early sample after a dose reads high because the drug has not yet distributed, and would wrongly suggest toxicity.",
      },
      {
        type: "question",
        prompt: "Why is a post-marketing safety study needed after a randomised, controlled trial?",
        answer: "Because the trial is too small to detect uncommon reactions, and its follow-up too short for delayed ones; post-marketing data come from a much larger and more varied prescribing population, and from long-term exposure.",
        explanation: "Phase IV is a continuing obligation rather than a final formality, and it is informed by spontaneous reports as well as formal study.",
      },
      {
        type: "question",
        prompt: "Which category of adverse drug reaction does not depend on the dose, and what is the practical consequence?",
        answer: "Type B (idiosyncratic) reactions do not depend on dose, so the consequence is that the patient must not be re-exposed, the drug is not necessarily unsafe in others, and the reaction must be reported so the pattern is detected.",
        explanation: "Type A reactions are dose-related and can be managed by dose reduction; type B reactions are not, which changes both the individual management and the wider pharmacovigilance.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which drug class requires therapeutic drug monitoring because of a narrow therapeutic index?",
        options: [
          "Penicillins, because of a narrow index",
          "Digoxin, lithium, phenytoin, warfarin and aminoglycosides",
          "Statins, because of a narrow index",
          "Proton-pump inhibitors, because of a narrow index",
        ],
        correctIndex: 1,
        explanation: "These drugs usually have a narrow therapeutic index, and their toxicity is severe. Penicillins, statins and proton-pump inhibitors have wide indices and are not routinely monitored.",
      },
      {
        type: "mcq",
        stem: "What is the primary purpose of a Phase I clinical trial?",
        options: [
          "To establish efficacy against a placebo",
          "To establish safety and pharmacokinetics in a small number of healthy volunteers",
          "To compare the new drug with the current standard treatment",
          "To detect rare adverse reactions",
        ],
        correctIndex: 1,
        explanation: "Phase I trials use 20 to 100 healthy volunteers to determine safety, tolerability and the pharmacokinetic profile. Efficacy answers come in Phase II and III, and rare reactions in Phase IV.",
      },
      {
        type: "mcq",
        stem: "Which of these is an example of a type B (idiosyncratic) adverse drug reaction?",
        options: [
          "Hypotension from an antihypertensive",
          "Anaphylaxis to penicillin",
          "Peptic ulceration from chronic NSAID use",
          "Osteoporosis from long-course corticosteroids",
        ],
        correctIndex: 1,
        explanation: "Anaphylaxis is unpredictable, immune-mediated and not dose-related. The others are type A (drug pharmacology) or type C (chronic use) respectively.",
      },
      {
        type: "mcq",
        stem: "A patient's lithium level is taken two days after starting treatment. What is wrong with that plan?",
        options: [
          "Nothing — lithium levels are useful within days",
          "The level is not yet at steady state, because lithium requires about five days to reach it, so the result cannot be interpreted",
          "The level should be taken at the peak after the dose",
          "Lithium levels cannot be measured in blood",
        ],
        correctIndex: 1,
        explanation: "A lithium concentration is only interpretable at steady state — about four to five half-lives after the last dose change — and at a defined trough, twelve hours after the last dose.",
      },
      {
        type: "mcq",
        stem: "Which describes the difference between a generic and a brand-name version of the same drug?",
        options: [
          "The generic with a different active ingredient",
          "The generic contains the same active ingredient, and must demonstrate bioequivalence, differing in the inactive ingredients only",
          "The generic is less effective because it is cheaper",
          "The generic has a different route of administration",
        ],
        correctIndex: 1,
        explanation: "Generic approval requires demonstrated bioequivalence to the brand; differences lie in the excipients, not in the active pharmaceutical ingredient.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The therapeutic window decides whether a drug is monitored, and a narrow index is the reason for therapeutic drug monitoring, whose result is only interpretable at steady state and at a defined point in the dosing interval. Drug development proceeds through preclinical studies and four clinical phases, each answering a different question, with the detection of rare adverse reactions left to the post-marketing phase. Safe prescribing records the indication, dose, route, duration and monitoring, and adverse drug reactions are classified as type A, B, C and D, because the classification dictates the response.",
      },
      {
        type: "paragraph",
        text: "Next module: autonomic pharmacology, where the two branches of the autonomic nervous system are examined through their receptors and the drugs that act on them — and where almost every class you will meet in later systems has already made its first appearance.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 6 — Autonomic pharmacology (fully authored)
// ---------------------------------------------------------------------------
function lesson6() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: identify which is sympathetic and which is parasympathetic, and what neurotransmitters they release; name the receptor subclasses (alpha-1, alpha-2, beta-1, beta-2, beta-3, muscarinic M1 to M5, nicotinic) and the main effect of each on smooth muscle, cardiac muscle, glands and metabolism; explain the difference between a directly- and an indirectly-acting sympathomimetic; give the cardiovascular actions of adrenaline and of noradrenaline and state the indication for each; list the autonomic side-effects to anticipate in a patient on a cholinergic or an antimuscarinic drug; and predict the effect of a beta-blocker in a patient with asthma.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-5, and the physiology course's module on membrane transport and the neuromuscular junction.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Autonomic pharmacology",
        text: "The study of the drugs that act on the sympathetic and parasympathetic nervous systems, by either mimicking or blocking the neurotransmitters acetylcholine and norepinephrine at their receptors.",
      },
      {
        type: "paragraph",
        text: "The autonomic nervous system is the body's background control: it regulates heart rate, blood pressure, gut motility, secretion, bronchi and the size of the pupil without any conscious input. It has two branches with opposing actions — sympathetic preparing the body for action, parasympathetic maintaining and conserving. Both release acetylcholine at the ganglion; the difference is what they release at the end organ, and that difference is the key to everything in this lesson.",
      },

      { type: "heading", level: 2, text: "Sympathetic versus parasympathetic" },
      {
        type: "table",
        headers: ["Feature", "Sympathetic", "Parasympathetic"],
        rows: [
          ["Preganglionic fibre length", "Short (the ganglion is near the cord)", "Long (the ganglion is near the target organ)"],
          ["Preganglionic neurotransmitter", "Acetylcholine, acting on nicotinic receptors", "Acetylcholine, acting on nicotinic receptors"],
          ["Postganglionic neurotransmitter", "Norepinephrine, at adrenergic receptors", "Acetylcholine, at muscarinic receptors"],
          ["Exception", "Sweat glands and some vessels are sympathetically cholinergic", "None — the distinction is a division by transmitter"],
          ["Overall theme", "Fight, flight or freeze", "Rest, digest and repair"],
        ],
      },
      {
        type: "paragraph",
        text: "Remember that the postganglionic sympathetic transmitter is not always norepinephrine: sweat glands, for instance, are innervated by a sympathetic cholinergic fibre that releases acetylcholine. That is why a patient taking an anticholinergic drug, such as oxybutynin for the bladder, stops sweating, and why a cholinergic reaction, as in an acetylcholinesterase inhibitor overdose, produces profuse sweating.",
      },

      { type: "heading", level: 2, text: "Adrenergic receptors" },
      {
        type: "table",
        headers: ["Receptor", "Main tissue effect", "Agonist", "Antagonist"],
        rows: [
          ["Alpha-1", "Vasoconstriction, contraction of the pupillary dilator and the bladder sphincter, and smooth muscle contraction in the prostate", "Phenylephrine, methoxamine", "Prazosin, doxazosin, tamsulosin"],
          ["Alpha-2", "Presynaptic inhibition of transmitter release, sedation, and central sympathetic inhibition", "Clonidine", "Some antidepressants and opioid withdrawal agents"],
          ["Beta-1", "Increases heart rate, contractility and conduction, and stimulates renin release", "Dobutamine", "Atenolol, metoprolol, bisoprolol"],
          ["Beta-2", "Dilates bronchi, vasodilator in skeletal muscle, relaxes the uterus, and promotes hepatic glucose release", "Salbutamol, salmeterol", "Propranolol, but not a cardioselective blocker"],
          ["Beta-3", "Stimulates lipolysis and detrusor relaxation", "Mirabegron", "Beta-blockers broadly"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The selectivity of a beta-agonist for the airway is the reason salbutamol works in asthma and the reason a beta-blocker is dangerous there: the same receptor mediates the dilation, so blocking it removes the therapeutic effect the patient may need.",
      },

      { type: "heading", level: 2, text: "Muscarinic and nicotinic receptors" },
      {
        type: "table",
        headers: ["Receptor", "Main tissue effect", "Agonist", "Antagonist"],
        rows: [
          ["M1", "Cerebral, gastric parietal cells", "Bethanechol (difficult to obtain)", "Pirenzepine (limited availability)"],
          ["M2", "Slows the heart and reduces contractility", "Methacholine, acetylcholine", "Atropine, glycopyrronium"],
          ["M3", "Stimulates glandular secretion, contracts smooth muscle of the gut and bronchi, and constricts the pupil", "Pilocarpine, bethanechol", "Ipratropium, oxybutynin, atropine"],
          ["Nicotinic (ganglionic)", "Transmission at every autonomic ganglion", "Nicotine", "Hexamethonium-type ganglion blockers (historical)"],
          ["Nicotinic (muscle)", "Transmission at the neuromuscular junction", "Suxamethonium, acetylcholine", "Curare, pancuronium, rocuronium"],
        ],
      },
      {
        type: "paragraph",
        text: "The clinical value of this table is that a patient on an antimuscarinic drug develops a predictable pattern of effects: dry mouth, blurred vision and dilated pupils, constipation and urinary retention, tachycardia, and confusion in older people. Conversely a patient on a cholinergic drug develops salivation, lacrimation, urination, diarrhoea, bradycardia, bronchoconstriction and constricted pupils — the opposite set.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "The exception that decides dosing is sweat. The sympathetic innervation of the eccrine sweat gland is cholinergic, so a cholinergic drug produces sweating and an anticholinergic drug stops it — the only situation where the two branches' actions coincide.",
      },

      { type: "heading", level: 2, text: "Worked example: the two catecholamines" },
      {
        type: "paragraph",
        text: "Adrenaline and noradrenaline stimulate the same receptors, but they differ in relative potency, and that difference decides their clinical use. Noradrenaline acts predominantly on alpha and therefore vasoconstricts, raising blood pressure; the consequent rise in pressure increases the heart rate reflexively, and the effect is a net vasoconstrictor with a little reflex tachycardia.",
      },
      {
        type: "table",
        headers: ["Drug", "Dominant effect", "Clinical indication"],
        rows: [
          ["Adrenaline", "Alpha and beta, with beta effects dominant at low doses: heart rate and force rise, and the bronchi and some vessels dilate", "Anaphylaxis, cardiac arrest, and the addition to local anaesthetics"],
          ["Noradrenaline", "Predominantly alpha: vasoconstriction and a rise in pressure with reflex slowing", "Septic shock, where peripheral vasodilation must be reversed"],
          ["Isoprenaline", "Beta-1 and beta-2: raises heart rate and dilates bronchi, but may lower the blood pressure by beta-2 vasodilation", "Temporary pacing, rarely now"],
          ["Dopamine", "Dose-dependent, from dopaminergic renal vasodilation to beta and finally alpha at higher doses", "Rarely now, because of the vasoconstriction to kidney and risk of arrhythmia"],
        ],
      },
      {
        type: "question",
        prompt: "Why does adrenaline relieve both the vasodilation and the bronchospasm of anaphylaxis?",
        answer: "Because it acts on both alpha receptors (reversing the vasodilation and laryngeal oedema) and on beta receptors (relaxing the bronchial smooth muscle, and increasing cardiac output). Adrenaline is the common pathway that treats all the elements of the syndrome at once.",
        explanation: "The dual receptor action is the reason adrenaline is the drug of choice in anaphylaxis, and why it must be given intramuscularly for a fast onset.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying noradrenaline acts on beta receptors primarily. It is predominantly an alpha agonist — which is why it is a vasopressor. Adrenaline is the drug with both.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying salbutamol will dilate the heart vessels. It is beta-2 selective and dilates bronchi and the uterus; cardiac effects come from beta-1, and salbutamol's tremor and palpitations come from activation of beta-2 in skeletal muscle rather than beta-1 at high dose.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying antidiuretic hormone and alpha-agonists do the same thing. They both raise the pressure, but alpha-agonists do so by direct vasoconstriction while antidiuretic hormone acts through its own receptor — and at high doses can also act at the platelet receptor.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Where does the sympathetic system release acetylcholine, and why does it matter?",
        answer: "At the preganglionic synapse at the autonomic ganglion, and at the postganglionic synapse with the sweat gland and with some vasodilator nerves. It matters because an anticholinergic drug therefore blocks sweating, and a cholinergic one increases it.",
        explanation: "Autonomic nomenclature is based on the postganglionic transmitter, but the exception in the sweat gland explains the sweating seen in both cholinergic and anticholinergic drug effects.",
      },
      {
        type: "question",
        prompt: "What would be the effect of a non-selective beta-blocker given during an anaphylactic reaction?",
        answer: "It would block the beta effects of the treatment and of the body's own response: it would prevent bronchodilation, reduce cardiac output, and could worsen the shock — which is why a cardioselective blocker is also approached cautiously and why beta-blockade complicates the management of anaphylaxis.",
        explanation: "This is a pharmacology question rather than a pharmacology answer: it predicts an outcome from a receptor distribution, and it explains the warnings in the literature.",
      },
      {
        type: "question",
        prompt: "Why is noradrenaline used in septic shock while adrenaline is used in anaphylaxis?",
        answer: "Because septic shock is a vasodilated state requiring a pure vasopressor, and noradrenaline's alpha action raises the pressure without adding much beta stimulation. In anaphylaxis, alpha-mediated vasoconstriction (against the vasodilation and laryngeal oedema) and beta-mediated bronchodilation and cardiac support are all needed, so adrenaline is the right drug.",
        explanation: "The drug choice follows the receptor distribution of the pathology: vasodilation alone needs alpha; a multisystem anaphylactic reaction needs both.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which receptor is responsible for the bronchodilator effect of salbutamol?",
        options: ["Alpha-1", "Beta-1", "Beta-2", "Muscarinic M3"],
        correctIndex: 2,
        explanation: "Salbutamol is a selective beta-2 agonist, and beta-2 receptors mediate bronchodilation. Beta-1 receptors act on the heart, and blocking M3 would cause bronchoconstriction instead.",
      },
      {
        type: "mcq",
        stem: "A patient develops dry mouth, constipation, urinary retention and dilated pupils after starting a drug. What class is it?",
        options: [
          "A beta-agonist", "An antimuscarinic (anticholinergic) drug", "A beta-blocker", "An alpha-2 agonist",
        ],
        correctIndex: 1,
        explanation: "The entire set is the antimuscarinic effect profile: dry mouth from blocked salivary glands, constipation and retention from blocked gut and bladder, and dilated pupils from blocked M3 sphincter. A beta-agonist would produce tremor and tachycardia instead.",
      },
      {
        type: "mcq",
        stem: "Which is correct about the pharmacology of noradrenaline?",
        options: [
          "It acts predominantly on beta-1 receptors",
          "It acts predominantly on alpha receptors, so it is a vasopressor used in septic shock",
          "It is the drug of choice in anaphylaxis",
          "It dilates the bronchi",
        ],
        correctIndex: 1,
        explanation: "Noradrenaline is predominantly an alpha agonist and raises the blood pressure by vasoconstriction; adrenaline covers both alpha and beta and is the drug of choice in anaphylaxis.",
      },
      {
        type: "mcq",
        stem: "Which statement about the autonomic parasympathetic division is correct?",
        options: [
          "Its postganglionic fibres are short and release norepinephrine",
          "Its postganglionic fibres are long and release acetylcholine onto muscarinic receptors",
          "Its preganglionic fibres are long and release norepinephrine",
          "It supplies no organs of the chest",
        ],
        correctIndex: 1,
        explanation: "The parasympathetic division is craniosacral and long postganglionically, with acetylcholine acting on muscarinic receptors at the end organ. Sympathetic postganglionic fibres are short and release norepinephrine.",
      },
      {
        type: "mcq",
        stem: "Why is a beta-blocker hazardous in a patient with asthma?",
        options: [
          "Because it blocks the beta-2 receptors that mediate bronchodilation, removing the sympathetic bronchodilator drive",
          "Because it stimulates beta-2 receptors and causes bronchoconstriction",
          "Because it blocks the muscarinic receptors responsible for bronchoconstriction",
          "Because it induces histamine release from mast cells",
        ],
        correctIndex: 0,
        explanation: "Beta-2 receptors dilate the bronchi; blocking them removes that drive and can precipitate bronchospasm, which is why a cardioselective agent is preferred where beta-blockade is needed.",
      },

      { type: "heading", level: 2, text: "Module summary and next" },
      {
        type: "paragraph",
        text: "The autonomic nervous system is described by its two branches — sympathetic and parasympathetic — and their neurotransmitters, which define their receptors. Adrenergic pharmacology is organised by the alpha and beta receptor subtypes, whose distribution decides their effects and their antagonists' hazards. Muscarinic receptors mediate the parasympathetic effects on target organs, with the sweat gland as the cholinergic exception on the sympathetic side. From this framework everything else follows: which drug to use in shock, which to avoid in asthma, and the entire side-effect profile of an anticholinergic prescription.",
      },
      {
        type: "paragraph",
        text: "Next modules: the cardiovascular, renal, antimicrobial, and central nervous system pharmacologies, each of which is an application of the receptor framework you have now learned.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 13 — Analgesic drugs (fully authored)
// ---------------------------------------------------------------------------
function lesson13() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the four stages of nociception and the peripheral and central sites at which analgesics act; distinguish the opioid receptors and the strong from the weak opioids, with their adverse effects and their management in overdose; explain the mechanism and limits of NSAIDs and paracetamol and the adverse-effect profiles that separate them; describe the WHO analgesic ladder and its application; and construct an adjuvant regimen for neuropathic and cancer-related pain.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1 to 6, and the pain module of the physiology course — nociceptors, the spinothalamic tract and the descending inhibitory pathways.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Analgesic",
        text: "A drug that relieves pain without abolishing sensation. The classes differ by the stage of nociception at which they intervene: the NSAIDs act at the sensitised peripheral nociceptor, the opioids act on the central transmission and descending inhibition of the signal, and the adjuvants act on the mechanisms that amplify the signal into chronic pain.",
      },
      {
        type: "paragraph",
        text: "Nociception has four stages — transduction at the nociceptor, transmission along the afferent fibre and the spinothalamic tract, modulation by the descending pathways, and perception in the cortex. Injury releases prostaglandins, bradykinin and cytokines that sensitise the nociceptors (transduction), so a drug that stops prostaglandin synthesis stops the sensitisation at its source, which is why an NSAID is more effective against inflammatory pain than against phantom or neuropathic pain. Opioids work centrally, on the mu receptors of the ascending inhibitory system and on the descending pain-control pathways, which is why a dose of morphine reaches pain of any cause but pays for it with respiratory depression and sedation. The distinction between inflammatory and neuropathic pain is the one that determines the whole regimen.",
      },

      { type: "heading", level: 2, text: "Opioid receptors and the opioid drugs" },
      {
        type: "table",
        headers: ["Receptor", "Effect", "Agonist use"],
        rows: [
          ["Mu (morphine)", "Supraspinal analgesia, euphoria, respiratory depression, miosis, physical dependence, slowing of the gut", "The principal therapeutic target of all strong opioids"],
          ["Kappa", "Spinal analgesia and miosis, with dysphoria and hallucinations, less respiratory depression", "Partial contribution of the mixed agents; dynorphins"],
          ["Delta", "Spinal and supraspinal analgesia with a smaller respiratory effect", "The endogenous enkephalins and experimental derivatives"],
        ],
      },
      {
        type: "table",
        headers: ["Agent", "Relative potency and duration", "Particular use and adverse effects"],
        rows: [
          ["Morphine", "The reference strong opioid, 4 to 6 hours", "Severe pain of any cause, acute pulmonary oedema, myocardial infarction; active metabolites accumulate in renal failure causing myoclonus and sedation"],
          ["Fentanyl", "About 100 times more potent, short duration when intravenous", "Procedural sedation, anaesthetic adjunct, transdermal patches in chronic pain; chest wall rigidity at fast injection"],
          ["Oxycodone", "Oral strong opioid with good bioavailability", "Step three of the WHO ladder and post-operative pain; the same sedation and constipation profile"],
          ["Codeine and dihydrocodeine", "Weak opioids requiring metabolism to morphine (codeine by CYP2D6)", "Mild to moderate pain; poor metabolisers get no analgesia and ultrarapid metaboliser mothers risk neonatal toxicity"],
          ["Tramadol", "Weak mu agonism plus serotonin and noradrenaline reuptake inhibition", "Moderate pain; seizures and serotonin syndrome at high dose or with interacting antidepressants"],
          ["Methadone", "Long half-life (days) with a complex kinetics", "Opioid substitution in addiction, and specialist chronic pain; QT prolongation and accumulation deaths in inexperienced hands"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The two opioid adverse effects that matter most separate themselves by tolerance. Respiratory depression and sedation are dose-related and the patient develops tolerance to them, but constipation never develops tolerance — it is a guaranteed effect that needs a laxative prescribed with the very first prescription, not added when the patient stops opening their bowels. Miosis, nausea and itch are the other early effects.",
      },
      {
        type: "paragraph",
        text: "Opioid overdose produces the triad of coma, pinpoint pupils and respiratory depression, and the antidote is naloxone, a short-acting mu antagonist given in titrated doses to restore breathing without precipitating full withdrawal. Because naloxone's half-life is shorter than most opioids, a dependent patient or a long-acting overdose must be observed and infused, not discharged after a single response. Patient-controlled analgesia solves the pharmacological problem of titration: small intravenous boluses on demand, letting the patient keep the plasma concentration just above the point where pain beats sedation, with the risk of programmable error from programmer and pump alike.",
      },

      { type: "heading", level: 2, text: "Non-opioid analgesics" },
      {
        type: "paragraph",
        text: "NSAIDs inhibit cyclo-oxygenase and so reduce prostaglandin synthesis — analgesia, antipyoresis and anti-inflammation from one mechanism — but the same prostaglandin inhibition produces their characteristic adverse effects: gastric and duodenal ulceration with bleeding, renal impairment from unopposed afferent vasoconstriction, bronchospasm in aspirin-sensitive asthma, fluid retention and hypertension, and platelet dysfunction that prolongs bleeding.",
      },
      {
        type: "table",
        headers: ["Drug", "Selectivity", "Notes and adverse effects"],
        rows: [
          ["Aspirin", "Non-selective COX inhibitor, irreversible at low dose", "Low dose for antiplatelet prophylaxis; at analgesic doses it can cause Reye's syndrome in children, tinnitus and salicylate toxicity"],
          ["Ibuprofen, naproxen", "Non-selective, short and longer acting", "The commonest prescription NSAIDs; ulceration risk rises with dose, prior ulcer, concurrent corticosteroid, anticoagulant and age"],
          ["Celecoxib", "Selective COX-2 inhibitor", "Less gastrointestinal ulceration and no antiplatelet effect, but cardiovascular thrombotic risk and the sulfonamide allergy caveat"],
          ["Paracetamol", "Central COX inhibition and endocannabinoid reuptake, with weak anti-inflammatory action", "No gastric, renal or platelet effect at therapeutic doses, safe in asthma and in pregnancy; hepatic necrosis in overdose"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The triple whammy is the renal emergency of analgesia: an ACE inhibitor (efferent vasodilation) plus a diuretic (volume depletion) plus an NSAID (afferent vasoconstriction) drop the glomerular filtration suddenly, precipitating renal failure and hyperkalaemia. It happens most often in exactly the heart failure patient for whom all three drugs were separately appropriate, and the NSAID is the one that stops.",
      },
      {
        type: "paragraph",
        text: "Paracetamol overdose is the commonest deliberate self-poisoning admission and one of the few pharmacological emergencies with a clean antidote. The toxic metabolite NAPQI accumulates when glutathione is exhausted and binds hepatic proteins, and N-acetylcysteine replenishes the glutamate for glutathione synthesis and substitutes directly for the depleted reserves. It is almost completely protective if given within eight hours of the ingestion, useful for a long time after, and the plasma level taken four hours post-overdose against the nomogram decides the level of certainty. Therapeutics: overdose, the first-line treatment is measurement and NAC — not a wait for symptoms.",
      },

      { type: "heading", level: 2, text: "Adjuvants and the WHO ladder" },
      {
        type: "paragraph",
        text: "An adjuvant analgesic is not an analgesic at standard doses but treats a particular pain mechanism. The stepwise World Health Organization ladder organises the whole into three steps and is validated for cancer pain but generalises: at step one, a non-opioid with or without an adjuvant; at step two, a weak opioid; at step three, a strong opioid, with the non-opioid continued for its mechanism and the adjuvant continued for the biology of the pain.",
      },
      {
        type: "table",
        headers: ["Step", "Pain", "Prescription", "Notes"],
        rows: [
          ["1", "Mild", "Paracetamol or an NSAID (plus adjuvant)", "Regular dosing beats demand dosing for persistent pain"],
          ["2", "Moderate", "Add codeine or tramadol to step one", "Combination preparations hide dose escalation and slow therapeutic adjustment"],
          ["3", "Severe", "Replace the weak opioid with morphine (or an equivalent) with paracetamol and adjuvant retained", "Titrate by trough effect; breakthrough doses are extra immediate-release doses of a fraction of the total daily"],
        ],
      },
      {
        type: "table",
        headers: ["Adjuvant", "Mechanism", "When used"],
        rows: [
          ["Amitriptyline, nortriptyline, duloxetine", "Serotonin and noradrenaline reuptake inhibition in the descending pain pathways", "First-line for neuropathic pain: post-herpetic neuralgia, diabetic neuropathy"],
          ["Gabapentin, pregabalin", "Bind the alpha-2-delta subunit of the voltage-gated calcium channel, reducing excitatory transmitter release", "Neuropathic pain; sedation and weight gain limit the dose"],
          ["Dexamethasone", "Reduces peritumoural inflammatory oedema", "Metastatic bone pain, headache from raised intracranial pressure, spinal cord compression during definitive treatment"],
          ["Lidocaine patch, capsaicin", "Local sodium channel and vanilloid desensitization", "Localised neuropathic and post-herpetic pain with few systemic effects"],
          ["Baclofen, diazepam", "Central muscle-relaxing actions", "Muscle spasm in spasticity; sedation limits their utility"],
        ],
      },
      {
        type: "question",
        prompt: "Why is morphine used for the pain of acute myocardial infarction while NSAIDs are avoided?",
        answer: "Morphine relieves pain centrally and reduces oxygen demand — anxiety, catecholamine drive and preload (venodilation) all fall — whereas NSAIDs impair the post-infarction healing of the myocardium, raise blood pressure and risk renal failure, and interact with anticoagulant therapy.",
        explanation: "The drug is chosen for more than the pain: in acute coronary syndromes the analgesic must also lower the sympathetic load, which opioids do and NSAIDs do not.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting to prescribe a laxative with a strong opioid. Constipation is the one opioid effect to which no tolerance develops, so prophylaxis is part of the prescription rather than a response to the symptom.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Doubling a manufacturer's ceiling dose of a co-codamol combination to get a stronger opioid effect. Paracetamol overdose from unsuspected accumulation in combination products is the classic adverse drug event; prescribe the opioid and the paracetamol separately so each can be titrated safely.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating neuropathic pain with escalating NSAIDs. The sensitised nociceptor is not the mechanism in nerve injury; the evidence is for the antidepressants and gabapentinoids, and NSAIDs add only adverse effects.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Giving naloxone once and discharging. Naloxone is shorter acting than most opioids, so respiratory depression returns when it wears off; the dependent patient develops withdrawal while the overdose reasserts itself.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Which opioid adverse effect does not develop tolerance, and what does that dictate?",
        answer: "Constipation — the opioid receptors in the gut wall slow motility and the constipation persists for as long as the drug is given. It dictates a laxative regimen prescribed from the start of the opioid, rather than rescue treatment once the patient has stopped moving their bowels.",
        explanation: "Tolerance develops to respiratory depression, sedation, nausea and euphoria, but not to constipation or miosis; the two persistent effects are the two that need routine management.",
      },
      {
        type: "question",
        prompt: "How do NSAIDs and paracetamol differ in their adverse-effect profile?",
        answer: "NSAIDs cause gastric ulceration, renal impairment, bronchospasm in sensitive patients and platelet inhibition, because they block peripheral prostaglandin synthesis; paracetamol has no antiplatelet, gastric or renal effect at therapeutic doses and is safe in asthma and pregnancy, but is hepatotoxic in overdose.",
        explanation: "Paracetamol's central action and lack of peripheral anti-inflammatory effect is why it relieves pain and fever without the organ costs, and why it is the analgesic base in the weak-pain steps.",
      },
      {
        type: "question",
        prompt: "A patient with diabetic neuropathy is on increasing doses of ibuprofen with no relief. What class of drug is indicated?",
        answer: "An antidepressant acting on the descending pain pathways — amitriptyline or duloxetine — or a gabapentinoid such as pregabalin, which reduce the excitatory drive in sensitised central pathways. NSAIDs address inflammatory nociception and do not touch the neuropathic mechanism.",
        explanation: "The mechanism determines the drug: prostaglandin sensitisation of a nociceptor, versus ectopic discharge and central sensitisation in nerve injury.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which opioid adverse effect does NOT develop tolerance with continued use?",
        options: ["Respiratory depression", "Sedation", "Constipation", "Nausea"],
        correctIndex: 2,
        explanation: "Constipation persists as long as the opioid continues, because the gut opioid receptors keep slowing motility, so a laxative is prescribed from the start. Tolerance develops to respiratory depression, sedation and nausea.",
      },
      {
        type: "mcq",
        stem: "Which is the antidote for opioid overdose?",
        options: ["Naloxone", "Atropine", "Flumazenil", "N-acetylcysteine"],
        correctIndex: 0,
        explanation: "Naloxone is a short-acting competitive mu antagonist titrated to restore breathing; because its half-life is shorter than most opioids, the patient is observed for returning sedation. Flumazenil reverses benzodiazepines and N-acetylcysteine treats paracetamol overdose.",
      },
      {
        type: "mcq",
        stem: "Which is the mechanism of paracetamol toxicity in overdose?",
        options: [
          "Direct gastric mucosal erosion",
          "Accumulation of the toxic metabolite NAPQI depleting hepatic glutathione",
          "Inhibition of platelet cyclo-oxygenase",
          "Renal afferent vasoconstriction",
        ],
        correctIndex: 1,
        explanation: "In overdose the glucuronide pathway saturates and NAPQI accumulates, exhausting glutathione and binding hepatic proteins to cause necrosis; N-acetylcysteine replenishes the glutathione precursor and is most effective within eight hours.",
      },
      {
        type: "mcq",
        stem: "Which group of drugs is first-line for neuropathic pain?",
        options: [
          "NSAIDs", "Opioids alone", "Amitriptyline, duloxetine or gabapentinoids", "Paracetamol and codeine",
        ],
        correctIndex: 2,
        explanation: "Neuropathic pain is driven by ectopic discharge and central sensitisation, so the effective agents are the serotonin-noradrenaline reuptake inhibitors and the calcium-channel alpha-2-delta ligands, not the prostaglandin inhibitors.",
      },
      {
        type: "mcq",
        stem: "Which consequences follow from combining an ACE inhibitor, a diuretic and an NSAID?",
        options: [
          "Bradycardia and heart block",
          "Hyperglycaemia and gout",
          "Acute renal impairment and hyperkalaemia",
          "Bronchospasm and bleeding",
        ],
        correctIndex: 2,
        explanation: "The diuretic depletes volume, the ACE inhibitor dilates the efferent arteriole, and the NSAID constricts the afferent arteriole: the filtration pressure collapses and the potassium rises. This triple whammy is the commonest iatrogenic renal emergency in heart failure care.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 14 — General anaesthesia (fully authored)
// ---------------------------------------------------------------------------
function lesson14() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: name the five components of general anaesthesia and state which drug provides each; compare the intravenous induction agents and match them to a patient; describe the volatile agents and the meaning of minimum alveolar concentration; explain the use of opioids, neuromuscular blocking agents and their reversal in a general anaesthetic; outline the stages of anaesthesia and how depth is monitored; and anticipate the major complications — aspiration, hypotension, malignant hyperthermia, awareness — and how they are minimised and treated.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1 to 6 and the autonomic and CNS modules of the physiology course — respiratory control, the neuromuscular junction and the reticular activating system.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "General anaesthesia",
        text: "A drug-induced, reversible state of unconsciousness, amnesia, analgesia, muscle relaxation and suppression of autonomic responses to surgery, from which the patient recovers completely.",
      },
      {
        type: "paragraph",
        text: "General anaesthesia is not one drug; it is a combination that satisfies five separate targets. Unconsciousness and amnesia come from an induction and a volatile agent; analgesia from a pre-emptively given opioid; muscle relaxation for the surgeon from a neuromuscular blocker; and suppression of the sympathetic reflex from all three together. A so-called balanced anaesthetic is therefore always a stack: give the minimum of each drug that achieves its own component, so no single target has to be driven hard enough to cause its characteristic toxicity. The art is that the components must be timed — induction for the airway, the opioid before the incision, the blocker before the laryngoscopy — and the whole is monitored by pulse, pressure, oxygenation and depth.",
      },

      { type: "heading", level: 2, text: "Induction agents" },
      {
        type: "table",
        headers: ["Agent", "Mechanism and character", "Best patient", "Cautions"],
        rows: [
          ["Propofol", "GABA-A receptor agonist; rapid onset, quick offset, antiemetic", "The default induction agent for most patients, and for day-case anaesthesia", "Pain on injection, hypotension from vasodilation and myocardial depression, apnoea for the minute after the dose; a lipid emulsion that supports bacterial growth if left standing"],
          ["Thiopental sodium", "A barbiturate GABA-A agonist with a fast redistribution and a slow terminal phase", "The classic induction agent, and the drug of choice for raised intracranial pressure", "Cumulative sedation as the peripheral compartment fills, no analgesia, and marked arteriolar dilation to hypotension"],
          ["Ketamine", "NMDA receptor antagonist giving dissociative anaesthesia with profound analgesia", "Burns dressing, the shocked or hypotensive patient where haemodynamics must be kept, and pre-hospital trauma", "Sympathomimetic rise in heart rate and blood pressure, emergence delirium, salivation, and raised intracranial pressure concern"],
          ["Etomidate", "A GABA-like agent with almost no cardiovascular effect", "The patient with ischaemic heart disease or severe hypotension needing induction", "Adrenal suppression of steroid synthesis (fallen from favour for that), myoclonus at induction and thrombophlebitic pain on injection"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Ketamine is the induction agent for the shocked patient because, uniquely, it preserves the blood pressure through sympathetic stimulation — propofol and thiopental drop the pressure by vasodilation at the very moment the circulation can least afford it. That same sympathomimetic action is why it is avoided in the head-injured or hypertensive patient, and why emergence phenomena are pre-empted with a benzodiazepine.",
      },

      { type: "heading", level: 2, text: "Volatile agents and depth of anaesthesia" },
      {
        type: "table",
        headers: ["Agent", "Minimum alveolar concentration", "Characteristics"],
        rows: [
          ["Sevoflurane", "About 2.0 per cent", "The commonest induction and maintenance volatile — non-pungent, low blood-gas solubility gives a rapid emergence, and it is the inhalational induction agent of choice in children"],
          ["Isoflurane", "About 1.15 per cent", "Vasodilates with a fall in peripheral resistance, pungent, cheap; slower emergence than sevoflurane"],
          ["Desflurane", "About 6.0 per cent", "Very rapid emergence through very low blood-gas solubility; a sympathetically stimulating airway irritant and a greenhouse concern"],
          ["Nitrous oxide", "Above 100 per cent", "A weak agent with analgesia and amnesia but no muscle relaxation, used at half-strength with oxygen as Entonox in labour and as a vehicle in the second-gas effect; contraindicated with a trapped air space"],
        ],
      },
      {
        type: "definition",
        term: "Minimum alveolar concentration",
        text: "The concentration of a volatile agent that prevents movement in response to a standard surgical stimulus in half of patients — the potency index, so a lower number means a more potent drug.",
      },
      {
        type: "paragraph",
        text: "The alveolar concentration at the origin of the name is not simply the dial setting: the patient's age, the concurrent opioid, the temperature and other agents all move the dose-response. An 80-year-old needs far less than a 20-year-old, and an anaesthetic potentiated by a large pre-operative fentanyl dose wakes catastrophically if the volatile is cut for the recovery bay. The value of the index is the discipline it gives: each volatile agent is best known by its MAC, because a patient at about 1.3 MAC is usually unaware, and going below 0.7 MAC on a volatile alone invites awareness.",
      },

      { type: "heading", level: 2, text: "Opioids, blockers and reversal" },
      {
        type: "paragraph",
        text: "Opioids in anaesthesia blunt the surgical stimulus so the volatile and the hypnotic can be lower: fentanyl and alfentanil for short cases, remifentanil as a continuously titrated infusion metabolised by blood and tissue esterases (so the effect vanishes within minutes of stopping it), and longer-acting morphine when post-operative cover is the aim. The adverse effects are respiratory depression, chest-wall rigidity after rapid intravenous injection, and post-operative nausea, and in recovery the patient on a remifentanil infusion has no analgesia left once it stops — the analgesic must be given before the infusion does.",
      },
      {
        type: "table",
        headers: ["Blocker", "Mechanism and course", "Reversal or danger"],
        rows: [
          ["Suxamethonium", "A depolarising blocker — an acetylcholine agonist that holds the end-plate depolarised so it cannot repolarise; the fastest onset at 30 to 60 seconds and a duration of minutes", "Metabolised by plasma cholinesterase, prolonged by pseudocholinesterase deficiency; causes hyperkalaemia in burns, denervation and myopathy, fasciculation with myalgia, and it is the trigger of malignant hyperthermia"],
          ["Rocuronium", "A non-depolarising competitive antagonist at the nicotinic receptor with an onset of about a minute", "Reversed by neostigmine (an acetylcholinesterase inhibitor, given with glycopyrronium to prevent the muscarinic effect) or specifically by sugammadex, which encapsulates the rocuronium molecule"],
          ["Vecuronium, atracurium, cisatracurium", "Longer-acting non-depolarising agents", "Atracurium and cisatracurium clear by tissue ester hydrolysis (Hofmann elimination), so they work at any renal function; atracurium's laudanosine and histamine release are the costs"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Malignant hyperthermia is the anaesthetic catastrophe: a ryanodine receptor mutation, triggered by suxamethonium or a volatile agent, causes uncontrolled muscle contraction with a climbing carbon dioxide, a soaring temperature, a stiff jaw, acidosis and dark urine. The treatment is immediate dantrolene, stopping the trigger, cooling and treating the hyperkalaemia — and the mortality still justifies pre-empting it with a family history and a caffeine-halothane assessment when the history suggests.",
      },

      { type: "heading", level: 2, text: "Stages of anaesthesia" },
      {
        type: "table",
        headers: ["Stage (Guedel)", "Character", "Practical reading"],
        rows: [
          ["Stage I — analgesia", "Conscious but drowsy with analgesia beginning", "The stage the dentist or obstetrician works at with Entonox"],
          ["Stage II — excitement", "Unconscious but struggling, with breath-holding, vomiting and laryngospasm risk", "Passed through as fast as possible, because the airway is at its most dangerous"],
          ["Stage III — surgical", "No movement, regular breathing, no eyelash reflex — divided into four planes", "The target plane for the operation; depth monitored by pulse, pressure, end-tidal volatile and processed EEG"],
          ["Stage IV — medullary depression", "Gasping, then apnoea and vasomotor collapse", "Overdose — immediate plan is to stop the volatile, ventilate and support the circulation"],
        ],
      },
      {
        type: "paragraph",
        text: "Depth of anaesthesia is now monitored, not estimated: the processed EEG (bispectral index and its equivalents) gives a dimensionless number, the end-tidal volatile concentration gives the delivered dose, and the cardiovascular reflexes give the autonomic state. Awareness — the patient's being conscious during surgery with recall — is prevented by adequate depth and generous analgesia, and is recollected most often after obstetric and trauma anaesthesia, where the blood pressure is deliberately accepted as low as possible.",
      },

      { type: "heading", level: 2, text: "Complications and safety" },
      {
        type: "paragraph",
        text: "The safety net of a general anaesthetic is mostly planning: nil by mouth for six hours of food and two hours of clear fluid so the stomach is empty; a rapid-sequence induction with cricoid pressure for the patient with a full stomach or obstruction; patient warming against hypothermia; and the pre-operative assessment (American Society of Anaesthesiologists grade, comorbidities, the airway, and the consent). The immediate complications of emergence include hypotension (from the residual volatile and the positive pressure), hypothermia, shivering, airway obstruction and laryngospasm, breath-holding and hypoxaemia, and post-operative nausea, each with its own management.",
      },
      {
        type: "table",
        headers: ["Physical status", "Description", "Example"],
        rows: [
          ["ASA I", "A normal healthy patient", "The patient for an elective knee arthroscopy"],
          ["ASA II", "Mild systemic disease with no functional limitation", "Well-controlled hypertension or diabetes"],
          ["ASA III", "Severe systemic disease with functional limitation", "Stable angina, chronic kidney disease, chronic obstructive airway disease"],
          ["ASA IV", "Severe systemic disease that is a constant threat to life", "Recent infarction, advanced failure requiring escalation"],
          ["ASA V", "Moribund, not expected to survive without the operation", "Ruptured aneurysm with profound shock"],
          ["ASA VI", "Brain dead, awaiting organ retrieval", "Declared brain death with ventilation and perfusion maintained"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Inducing a shocked patient with propofol. Vasodilation plus myocardial suppression drops the pressure further, and the sequence turns hypovolaemia into cardiac arrest. Ketamine, or a reduced dose with adrenaline ready, preserves the circulation.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Giving suxamethonium to the burned or paraplegic patient without thinking about potassium. From about a day to a year after the injury the up-regulated receptors flood the plasma with potassium when the depolarising blocker opens them, and hyperkalaemic arrest can follow.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting to start the volatile titration at the age, not the dial. MAC falls with age in almost proportion to it, so an 80-year-old given the same concentration as a 20-year-old is dangerously deep, and the observed pink, warm, bradycardic emergence is the overdose.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating malignant hyperthermia as a fever from sepsis and carry on. The trigger persists, so the volatile and the suxamethonium are stopped, dantrolene is given, and the team calls for help — the diagnosis is a rising end-tidal carbon dioxide with a stiff jaw and a climbing temperature under anaesthesia itself.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why is a general anaesthetic described as a balanced combination rather than one drug?",
        answer: "Because five separate targets need separate drugs: hypnosis and amnesia from the induction and volatile agents, analgesia from the opioid, relaxation from the blocker, and reflex suppression from all together. Each drug is used at the lowest dose that achieves its own component, so no single target absorbs a dose high enough to cause toxicity.",
        explanation: "The balanced technique exists because the dose-response relationships of the five components are different, and the avoidance of the high-dose toxicity of each component is the whole point.",
      },
      {
        type: "question",
        prompt: "Which induction agent is chosen for the hypotensive trauma patient, and why?",
        answer: "Ketamine. As an NMDA antagonist it provides dissociative anaesthesia with profound analgesia, and its sympathomimetic activity maintains the blood pressure and heart rate, whereas propofol and thiopental would vasodilate and depress the myocardium further in a volume-depleted circulation.",
        explanation: "The haemodynamic profile is the deciding factor in the shocked patient, and ketamine is the one induction agent that supports the circulation.",
      },
      {
        type: "question",
        prompt: "How does reversing a non-depolarising block differ from waiting for a suxamethonium block to wear off?",
        answer: "A non-depolarising block is competitive, so it is reversed by raising acetylcholine at the end-plate with neostigmine, or by specifically encapsulating rocuronium with sugammadex; the residual block is titrated against a nerve stimulator. Suxamethonium is depolarising and metabolised by plasma cholinesterase within minutes, so there is nothing to reverse — and with a deficiency the block is prolonged until the patient can breathe again or until plasma is given.",
        explanation: "The depolarising-versus-competitive distinction is the same one that explains suxamethonium's fasciculations and its hyperkalaemic hazard in denervated muscle.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which induction agent is preferred for the shocked trauma patient?",
        options: ["Propofol", "Thiopental", "Ketamine", "Etomidate"],
        correctIndex: 2,
        explanation: "Ketamine's sympathomimetic action preserves blood pressure and its analgesia reduces the opioid requirement. Propofol and thiopental cause vasodilation with myocardial depression and are hazardous in hypovolaemia.",
      },
      {
        type: "mcq",
        stem: "What does the minimum alveolar concentration of a volatile agent measure?",
        options: [
          "The concentration that produces apnoea in half of patients",
          "The concentration that prevents movement to a standard stimulus in half of patients",
          "The concentration that eliminates awareness in all patients",
          "The concentration used for inhalational induction in children",
        ],
        correctIndex: 1,
        explanation: "MAC is the potency index: the alveolar concentration preventing movement to a standard surgical stimulus in half of patients. A low MAC therefore means a potent agent, and awareness risk rises as the concentration falls well below it.",
      },
      {
        type: "mcq",
        stem: "Which is the specific reversal agent for rocuronium?",
        options: ["Neostigmine", "Glycopyrronium", "Sugammadex", "Naloxone"],
        correctIndex: 2,
        explanation: "Sugammadex is a modified cyclodextrin that encapsulates rocuronium, reversing the block completely within minutes. Neostigmine with glycopyrronium is the non-selective reversal, and naloxone reverses opioids.",
      },
      {
        type: "mcq",
        stem: "A patient develops jaw stiffness, a rising end-tidal carbon dioxide and a soaring temperature minutes after induction with suxamethonium and a volatile agent. What is the treatment?",
        options: [
          "Intravenous paracetamol and cooling blankets",
          "Immediate dantrolene with cessation of the trigger",
          "Neostigmine and glycopyrronium",
          "A bolus of propofol and continued surgery",
        ],
        correctIndex: 1,
        explanation: "This is malignant hyperthermia, treated by stopping the volatile and the suxamethonium, giving dantrolene, cooling and correcting the hyperkalaemia and acidosis. Antipyretics and antipyretic cover do nothing against the uncontrolled muscle heat production.",
      },
      {
        type: "mcq",
        stem: "Which patient situation is an indication to avoid suxamethonium because of hyperkalaemia risk?",
        options: [
          "A two-day-old burn with twenty per cent body surface involvement",
          "A child having a tonsillectomy",
          "A three-month-old burn patient",
          "A patient with a full stomach",
        ],
        correctIndex: 0,
        explanation: "Days after a burn (and from about a day to a year after denervation) the up-regulated extra-junctional receptors open under the depolarising blocker and release potassium, risking arrest. A three-month-old burn has not yet up-regulated the receptors, so suxamethonium is acceptable.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 10 — Drugs for heart failure & arrhythmia (fully authored)
// ---------------------------------------------------------------------------
function lesson10() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the four pillars of disease-modifying therapy in heart failure with reduced ejection fraction and separate them from the drugs that only relieve symptoms; classify the antiarrhythmics by the Vaughan Williams scheme and name the key agent in each class with its signature toxicity; explain the role of amiodarone, its extraordinary adverse-effect profile and its interactions; list the features of digoxin toxicity and its specific antidote; and outline the drug management of atrial fibrillation with rate control, rhythm control and anticoagulation by the stroke risk score.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 7, 8 and 9, plus the cardiac electrophysiology module of the physiology course — the cardiac action potential, ion channels and the phases of depolarisation.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Heart failure",
        text: "The syndrome in which the heart cannot fill or empty adequately for the body's needs: backward failure produces congestion (pulmonary oedema, peripheral oedema), and forward failure produces the low-output state (fatigue, cool peripheries, oliguria and pre-renal azotaemia).",
      },
      {
        type: "paragraph",
        text: "The heart failure prescription splits into two shelves. One shelf relieves symptomrs — loop diuretics decongest the patient, digoxin slows the rate — but changes the natural history little. The other shelf is disease-modifying: it blocks the maladaptive neurohormonal cascade (renin-angiotensin-aldosterone and the sympathetic surge) that is the disease progression, and those are the four pillars that reduce mortality. A prescriber who confuses the two shelves gives a diuretic, feels pleased, and stops before reaching the pillars that keep the patient alive.",
      },

      { type: "heading", level: 2, text: "The four pillars of heart failure" },
      {
        type: "table",
        headers: ["Pillar", "Agents", "Symptom or survival", "Practical notes"],
        rows: [
          ["Renin-angiotensin-aldosterone blockade", "Ramipril, valsartan, or sacubitril-valsartan (the ARNI)", "Survival; also reduces congestion over weeks", "Start low, go slow; only titrate the dose once the patient is euvolaemic, and never combine an ACE inhibitor with a neprilysin inhibitor without a washout"],
          ["Beta-blockade", "Bisoprolol, carvedilol, nebivolol", "Survival; symptom benefit over months", "Started when the patient is stable and not overloaded, because in the acute decompensation a beta-blocker can worsen the failure; titrate at two-week intervals"],
          ["Mineralocorticoid receptor antagonism", "Spironolactone, eplerenone", "Survival", "Watch the potassium with the RAS blocker above it; spironolactone's gynaecomastia favours eplerenone"],
          ["SGLT2 inhibition", "Dapagliflozin, empagliflozin", "Survival, with and without diabetes", "Originally glucose-lowering drugs, the benefit in failure is independent of diabetes; diuretic with them and expect genital mycotic infection"],
          ["Loop diuretic", "Furosemide, bumetanide", "Symptom relief only", "The dose is titrated to weight and congestion, and adjusted as the kidney function changes, but it never substitutes for the pillars above"],
          ["Digoxin", "Digoxin", "Symptom and rate control", "Adds little to the mortality pillars; reserved with atrial fibrillation for rate control when the others fail, and toxic easily"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The order matters as much as the drugs. A newly diagnosed patient starts with a loop diuretic to decongest, then the RAS blocker and the beta-blocker are introduced in small doses at fortnightly intervals, then the mineralocorticoid antagonist and the SGLT2 inhibitor complete the structure. Each up-titration waits on the blood pressure and renal function, because the barriers to the right doses are hypotension, hyperkalaemia and bradycardia, not reluctance.",
      },

      { type: "heading", level: 2, text: "Digoxin" },
      {
        type: "paragraph",
        text: "Digoxin inhibits the sodium-potassium ATPase of the cardiac membrane, so intracellular calcium rises through the sodium-calcium exchanger and the contractile force increases; in the AV node the same inhibition slows conduction through vagal and direct effects, giving a ventricular rate that suits the fibrillating patient. It has a narrow therapeutic index, a long half-life of about thirty-six hours accumulating in renal impairment, and a therapeutic range of roughly 0.5 to 0.8 nanograms per millilitre, above which the vomiting and the arrhythmias begin.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Digoxin toxicity is the classic viva question. Non-cardiac features are nausea, vomiting, anorexia, xanthopsia (yellow-green vision) and confusion; cardiac features are almost any arrhythmia, including bradycardia and bidirectional ventricular tachycardia. Toxicity is potentiated by hypokalaemia (which any diuretic produces) and by transporters: amiodarone, quinidine and verapamil raise digoxin levels. The antidote is digoxin-specific antibody fragments, given when there are arrhythmias, hyperkalaemia or a level above about ten; hyperkalaemia is itself a marker of severe toxicity.",
      },

      { type: "heading", level: 2, text: "Antiarrhythmics" },
      {
        type: "table",
        headers: ["Vaughan Williams class", "Channel target", "Key agents", "Signature toxicity and caveat"],
        rows: [
          ["Class I — fast sodium channel blockers", "Phase 0 depolarisation", "Ia quinidine, procainamide; Ib lidocaine, mexiletine; Ic flecainide, propafenone", "Flecainide and propafenone must be avoided in structural heart disease, where the trial of their use in post-infarction patients gave excess arrhythmic death"],
          ["Class II — beta-blockers", "Sympathetic beta-1 drive", "Bisoprolol, metoprolol, atenolol", "Bradycardia, exacerbation of asthma, fatigue; the safest and most widely used class"],
          ["Class III — potassium channel blockers", "Phase 3 repolarisation", "Amiodarone, dronedarone, sotalol", "Prolong the QT and risk torsades de pointes; sotalol adds beta-blockade, dronedarone worsens outcomes in permanent atrial fibrillation and in heart failure"],
          ["Class IV — calcium-channel blockers", "Nodal calcium current", "Verapamil, diltiazem", "Avoid in reduced ejection fraction for their negative inotropy, and never with a beta-blocker for their nodal effect"],
          ["Class V — others", "Miscellaneous mechanisms", "Digoxin (AV node, contractility), adenosine (transient AV block), magnesium", "Adenosine causes flushing, chest tightness and bronchospasm, and is contraindicated in asthma as it is given"],
        ],
      },
      {
        type: "paragraph",
        text: "Amiodarone deserves its own paragraph because it is effective, heavily used and unique among drugs in the number of organs it can damage. It prolongs the action potential like a class III agent but in fact blocks sodium, calcium and beta channels as well — the pattern of a broad-spectrum antiarrhythmic. It accumulates in fat and the thyroid, taking weeks to reach a steady state and months to leave, and it is a potent cytochrome P450 inhibitor that raises the levels of digoxin, warfarin and statins. Its adverse effects span pulmonary fibrosis (the dose-limiting one), hypothyroidism or hyperthyroidism through its iodine load, corneal microdeposits, hepatotoxicity, slate-grey skin photosensitivity and peripheral neuropathy, so it is started only when the arrhythmia is dangerous or refractory and then with scheduled pulmonary, thyroid, liver and ophthalmic surveillance.",
      },

      { type: "heading", level: 2, text: "Managing atrial fibrillation" },
      {
        type: "paragraph",
        text: "Atrial fibrillation is managed on three fronts simultaneously. Rate control uses a beta-blocker or digoxin (verapamil or diltiazem if a beta-blocker is unsuitable and the ventricular function is preserved). Rhythm control restores and maintains sinus rhythm with amiodarone, or flecainide in a structurally normal heart, and is chosen when the patient is symptomatic, young, or in heart failure. Anticoagulation is decided by the stroke risk score — age, hypertension and other vascular factors, diabetes, and prior stroke or embolism — not by the pulse, and is unaffected by whether the rhythm is regular again. Recent-onset atrial fibrillation undergoing cardioversion needs either a defined period of anticoagulation or exclusion of atrial thrombus first, because restoring coordinated contraction can eject an embolus.",
      },
      {
        type: "question",
        prompt: "Why does a rate-limited atrial fibrillation still need anticoagulation after a successful rhythm control?",
        answer: "Because the stroke risk arises from the fibrillating atria as a substrate for stasis and thrombus, and the score is computed from durable risk factors. Paroxysms recur, and a cardioversion does not remove the substrate or the score's indication, so the anticoagulation is by the score, not by the rhythm on the day.",
        explanation: "This is the single most common error in arrhythmia practice: stopping anticoagulation once the rhythm is controlled.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Starting a beta-blocker in a patient with acute decompensated, fluid-overloaded heart failure. The failing ventricle at high filling pressure depends on sympathetic drive, and removing it precipitates cardiogenic shock. Beta-blockers are introduced when the patient is stable, euvolaemic and on a ward dose — that is why the first dose is a fraction of the target dose.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Prescribing flecainide for atrial fibrillation in someone with ischaemic heart disease or reduced ejection fraction. The CAST trial showed excess arrhythmic death, so the class Ic agents are restricted to structurally normal hearts.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Missing the potassium in digoxin toxicity. A diuretic-driven hypokalaemia potentiates toxicity at a therapeutic digoxin level, and the correct response is to stop the digoxin, replace potassium (carefully in failure) and give the antibody fragments if arrhythmia or hyperkalaemia is present.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying adenosine treats atrial fibrillation. Adenosine transiently blocks the AV node and so terminates or reveals a junctional re-entry tachycardia — it has no role in fibrillation and will not restore sinus rhythm there.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Which heart failure drugs reduce mortality, and which merely relieve symptoms?",
        answer: "The four pillars reduce mortality: RAS blockade (ACE inhibitor, ARB or ARNI), beta-blockade, mineralocorticoid receptor antagonism and SGLT2 inhibition. Loop diuretics and digoxin relieve symptoms and control rate without changing survival, which is why the pillars are titrated to evidence-based target doses and the diuretic is adjusted to the weight.",
        explanation: "Separating the two shelves is the organising principle of the modern heart failure prescription.",
      },
      {
        type: "question",
        prompt: "Why does sotalol prolong the QT and risk torsades de pointes?",
        answer: "Sotalol blocks the potassium channels that carry repolarisation, so the action potential and the QT interval lengthen; a long QT permits the early afterdepolarisations that trigger torsades, and the risk rises with hypokalaemia, hypomagnesaemia, bradycardia and renal impairment.",
        explanation: "Class III potassium channel blockade is the mechanism of both the antiarrhythmic action and the proarrhythmic hazard, and the electrolytes govern whether it tips into torsades.",
      },
      {
        type: "question",
        prompt: "Which two drugs commonly raise digoxin levels through a transporter, and why does that matter?",
        answer: "Amiodarone and verapamil (also quinidine) inhibit the renal clearance of digoxin and displace its binding, so levels rise on a previously stable dose. The matter is the narrow therapeutic index: the patient converts from therapeutic to toxic on the same tablet count, and the dose is reduced by up to half with rechecking.",
        explanation: "Interaction detection is a routine part of prescribing in the elderly, who are most likely to be on both drugs and to have the renal impairment that slows the clearance further.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which drug group in heart failure has a demonstrated mortality benefit?",
        options: [
          "Loop diuretics", "Digoxin", "ACE inhibitors", "Aspirin",
        ],
        correctIndex: 2,
        explanation: "ACE inhibitors reduce mortality and hospitalisation in heart failure with reduced ejection fraction, as do beta-blockers, mineralocorticoid antagonists and SGLT2 inhibitors. Loop diuretics and digoxin control symptoms without changing survival.",
      },
      {
        type: "mcq",
        stem: "Which pair of findings is most characteristic of digoxin toxicity?",
        options: [
          "Dry cough and angioedema",
          "Xanthopsia with bradycardia or bidirectional ventricular tachycardia",
          "Slate-grey pigmentation with hypothyroidism",
          "Chest tightness with flushing",
        ],
        correctIndex: 1,
        explanation: "Yellow-green vision (xanthopsia), nausea and confusion, with arrhythmias including bradycardia and bidirectional tachycardia, are the digoxin-toxicity signature; hypokalaemia potentiates it and antibody fragments treat it. Slate-grey skin belongs to amiodarone; flushing and chest tightness to adenosine.",
      },
      {
        type: "mcq",
        stem: "Which antiarrhythmic is contraindicated in a patient with ischaemic heart disease?",
        options: ["Sotalol", "Flecainide", "Amiodarone", "Bisoprolol"],
        correctIndex: 1,
        explanation: "Flecainide (class Ic) increased arrhythmic death in post-myocardial infarction patients, so it is restricted to structurally normal hearts. Amiodarone has the widest safety margin for structural disease, at the price of its organ toxicities.",
      },
      {
        type: "mcq",
        stem: "Which drug prolongs the QT interval and risks torsades de pointes in hypokalaemia?",
        options: ["Flecainide", "Lidocaine", "Sotalol", "Verapamil"],
        correctIndex: 2,
        explanation: "Sotalol blocks the repolarising potassium current (class III) and is renally cleared, so hypokalaemia and renal impairment raise the torsades risk. Flecainide and lidocaine are class I agents and verapamil is class IV with no QT effect.",
      },
      {
        type: "mcq",
        stem: "Which drug is used to terminate a junctional re-entry (atrioventricular nodal) tachycardia?",
        options: ["Digoxin", "Adenosine", "Amiodarone", "Verapamil"],
        correctIndex: 1,
        explanation: "Adenosine transiently blocks the atrioventricular node with a seconds-long effect, terminating re-entry through the node and unmasking atrial activity. Its contraindications are asthma (bronchospasm) and it must be given with the heart monitored.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 11 — Principles of antimicrobial therapy (fully authored)
// ---------------------------------------------------------------------------
function lesson11() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define selective toxicity and explain how the differences between bacterial and human cells make it possible; distinguish bactericidal from bacteriostatic action and say when a static agent will not do; describe spectrum and how it guides empiric and then targeted therapy; construct an empiric regimen for a common infection from the site, severity and likely pathogens, and de-escalate it on cultures; list the reasons for combining antibiotics; and describe antimicrobial stewardship and the mechanisms by which resistance arises and spreads.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1 to 6, plus the microbiology module of the medical microbiology course — Gram staining, the common pathogens and the principles of culture.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Selective toxicity",
        text: "The principle on which all chemotherapy rests: exploiting a structure or process that the microbe has and the human cell does not, so the drug injures the parasite while leaving the host intact.",
      },
      {
        type: "paragraph",
        text: "Bacteria are prokaryotes and humans are eukaryotes, and the gaps between us are the drug targets. Bacteria build a peptidoglycan cell wall that we do not have, which is what penicillin attacks. Bacteria read their messenger RNA on a 70S ribosome built from 30S and 50S subunits, while we use an 80S ribosome, which is what macrolides, tetracyclines and aminoglycosides attack. Bacteria synthesise their own folate, while we take it from the diet, which is what trimethoprim and the sulfonamides attack. Later lessons are the catalogue of these targets; this one is the strategy that decides how the catalogue is used — the right drug, the right dose, the right route, the shortest effective duration.",
      },

      { type: "heading", level: 2, text: "Bactericidal versus bacteriostatic" },
      {
        type: "table",
        headers: ["Action", "Meaning", "Examples", "Where the distinction decides"],
        rows: [
          ["Bactericidal", "Kills the organism outright, so the effect survives after the concentration falls", "Penicillins, cephalosporins, aminoglycosides, quinolones", "Endocarditis (the valve has no immune access), meningitis, neutropenic sepsis, and infective endocarditis — where the host immune system cannot finish the job"],
          ["Bacteriostatic", "Halts multiplication, relying on the host's immune system to clear the arrested organisms", "Macrolides, tetracyclines, chloramphenicol, clindamycin, linezolid", "Adequate for most soft-tissue infections in a patient with intact immunity, insufficient where immune clearance is impaired"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The bactericidal need is not absolute pharmacology but a compromise with immunity: antibiotics alone cannot sterilise a vegetation, a purulent collection or a prosthetic device, because immune cells and antibodies penetrate poorly and the drug kills only growing organisms. That is why the endocarditis regimen is combination and prolonged, and why an abscess is drained before the antibiotic works.",
      },

      { type: "heading", level: 2, text: "Spectrum and the empiric decision" },
      {
        type: "paragraph",
        text: "Spectrum is the range of organisms a drug covers, and it cuts both ways: a broad-spectrum agent covers the likely pathogen before identification but also the gut flora, selecting resistance and causing clostridioides difficile infection. Empiric therapy is prescribed before the organism is known, guided by the site, the patient and the local antibiogram — the hospital's map of which organisms respond to which drugs, which varies ward to ward and country to country. Definite or targeted therapy follows cultures and sensitivities, narrowing the cover. The formal narrowing step is called de-escalation and is a stewardship obligation, not a review suggestion.",
      },
      {
        type: "table",
        headers: ["Presentation", "Common empiric regimen (a local example)", "Rationale"],
        rows: [
          ["Community-acquired pneumonia", "Amoxicillin (or doxycycline); a beta-lactam with a macrolide if severe", "Covers Streptococcus pneumoniae and atypicals such as Mycoplasma and Legionella"],
          ["Cellulitis", "Flucloxacillin; clindamycin in penicillin allergy", "Covers streptococci and staphylococci, the skin organisms"],
          ["Urinary tract infection", "Nitrofurantoin or trimethoprim by local sensitivity", "Concentrated in urine; nitrofurantoin spares the bowel flora"],
          ["Meningitis", "Ceftriaxone (plus amoxicillin and aciclovir if listerial or herpetic risk)", "Must cover the likely organisms and cross the inflamed blood-brain barrier"],
          ["Neutropenic sepsis", "Piperacillin-tazobactam (an antipseudomonal beta-lactam)", "The patient's own neutrophils are absent, so bactericidal cover for a wide range is mandatory"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Cultures before antibiotics is the rule, but not when the rule kills. In septic shock antibiotics are given within the hour, cultures or not, because each hour of delay raises mortality; the cultures are then drawn as soon as they can be obtained without the delay. The protocol is the same in meningitis.",
      },

      { type: "heading", level: 2, text: "Choosing by site, dose and host" },
      {
        type: "paragraph",
        text: "Four questions decide the prescription. Which organisms, given the site — the ones listed in the table above. Whether the drug gets there: the inflamed meninges admit ceftriaxone, metronidazole and rifampicin, but an aminoglycoside does not cross the blood-brain barrier and the abscess cavity has no vasculature. What dose — bactericidal effect can be time-dependent (beta-lactams, where the time above the minimum concentration is what kills) or concentration-dependent (aminoglycosides and quinolones, where the peak-to-minimum ratio is what kills, allowing once-daily dosing); and the duration — the shortest course that eradicates, since every extra day buys resistance and adverse effects without buying cure.",
      },
      {
        type: "table",
        headers: ["Host factor", "How it changes the choice", "Example"],
        rows: [
          ["Renal impairment", "Renally cleared drugs accumulate and need dose or interval adjustment", "Gentamicin and vancomycin levels are monitored; a quinolone dose drops in chronic kidney disease"],
          ["Hepatic impairment", "Metabolised drugs accumulate; narrow-index agents widen", "Isoniazid and rifampicin hepatotoxicity is additive rather than just additive"],
          ["Pregnancy and lactation", "Avoid drugs that cross the placenta or enter milk", "Tetracyclines stain fetal teeth; trimethoprim is a folate antagonist in the first trimester"],
          ["Allergy", "The prescription changes class, not brand", "Penicillin anaphylaxis precludes penicillins but permits aztreonam or a non-beta-lactam"],
          ["Age", "The extremes of age alter clearance and flora", "The neonate's immature liver cannot clear chloramphenicol, causing the grey baby syndrome"],
        ],
      },

      { type: "heading", level: 2, text: "Why and when to combine" },
      {
        type: "table",
        headers: ["Reason", "Mechanism of benefit", "Example"],
        rows: [
          ["Synergy", "The two drugs together kill far more than either alone", "A penicillin plus gentamicin in enterococcal endocarditis; the penicillin opens the wall for the aminoglycoside"],
          ["Preventing resistance", "A single mutation cannot defeat two mechanisms", "Tuberculous therapy with four drugs; combination antiretroviral therapy"],
          ["Empiric breadth", "A single agent cannot cover all likely organisms", "Piperacillin-tazobactam in neutropenic sepsis"],
          ["Toxicity reduction", "Two smaller doses match one large dose", "Rifampicin, isoniazid, pyrazinamide and ethambutol for tuberculosis, each at a tolerable dose"],
        ],
      },

      { type: "heading", level: 2, text: "Prophylaxis" },
      {
        type: "paragraph",
        text: "Prophylaxis is prescribed only where the risk of infection, or its consequence, justifies it: surgical prophylaxis is a single perioperative dose (cefazolin plus metronidazole for bowel or gynaecological work) timed to the incision, continued past twenty-four hours only for an ongoing risk; endocarditis prophylaxis is now reserved for the highest-risk cardiac states (prosthetic valve, previous endocarditis, certain congenital lesions) undergoing the procedures that cause bacteraemia — the gums; rheumatic fever prophylaxis follows a streptococcal episode for years; and contacts of meningococcal disease or invasively meningococcal contacts receive a clearing course of ciprofloxacin or rifampicin. Ordinary toothbrushing causes as much bacteraemia as a dental extraction, which is the reason prophylaxis is selective rather than routine.",
      },

      { type: "heading", level: 2, text: "Resistance and stewardship" },
      {
        type: "paragraph",
        text: "Bacteria acquire resistance by mutation and plasmid exchange, and the principal mechanisms are enzymatic inactivation of the drug (the beta-lactamases, extended-spectrum and carba), alteration of the target so the drug no longer binds (methicillin-resistant staphylococcus, with its altered penicillin-binding protein), reduced uptake through a lost porin or thickened wall, and efflux pumps that expel it. Each unnecessary prescription selects these organisms in the flora and in the ward, and each partially treated infection lets them emerge — which is why stewardship is a prescribing duty: right drug, dose, route and duration; de-escalation on cultures; shortest effective course; avoidance of broad-spectrum agents where narrow will do; source control by drainage; and converting intravenous to oral therapy once the patient takes oral medicines and is improving. The resistance that crosses hospital boundaries is the direct arithmetic of those decisions.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Using a bacteriostatic drug to treat bacterial meningitis or infective endocarditis. The drug arrests the organism but cannot sterilise the site, where the immune system cannot reach, and the infection relapses when the antibiotic stops. These two conditions demand bactericidal therapy.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Continuing surgical prophylaxis until the drain comes out. Beyond a single perioperative dose, prophylaxis stops preventing surgical site infection — it switches to selecting resistant flora and clostridioides difficile.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Switching to a fluoroquinolone for simple cystitis. Quinolones reserve (clostridioides difficile, tendon rupture, aneurysm and QT risks, widespread collateral damage) mean nitrofurantoin or trimethoprim by local sensitivity is preferred.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Waiting days for cultures in septic shock while the patient deteriorates. The delay of cultures must not delay antibiotics — blood cultures are taken as part of the same resuscitation, and the first dose goes in within the hour.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What makes selective toxicity possible in antibacterial chemotherapy, and which three targets exploit it?",
        answer: "Bacteria are prokaryotes and humans are eukaryotes, so targets that the bacterium has and we lack can be attacked: the peptidoglycan cell wall (penicillins, which we do not build), the 70S ribosome and its 30S and 50S subunits (macrolides, tetracyclines, aminoglycosides — ours is 80S), and folate synthesis (trimethoprim and sulfonamides — we take folate from the diet).",
        explanation: "Every target in the next two lessons is one of these structural differences, which is why antifungal therapy is harder: fungi are eukaryotes like us.",
      },
      {
        type: "question",
        prompt: "Why is a bacteriostatic agent insufficient in infective endocarditis?",
        answer: "Because the vegetation has no blood supply and no immune access: the antibiotic must kill the organisms outright, since the host cannot clear an arrested organism from an avascular mass. The regimen is bactericidal, combination and prolonged.",
        explanation: "Static agents arrest growth and let the immune system do the rest — which is possible in most tissues and impossible on a valve.",
      },
      {
        type: "question",
        prompt: "How do time-dependent and concentration-dependent killing change the dosing of two common classes?",
        answer: "Beta-lactams are time-dependent: the effect tracks the time the concentration stays above the minimum inhibitory concentration, so frequent doses or an extended infusion help. Aminoglycosides are concentration-dependent: the effect tracks the peak above that minimum, so a single large daily dose is effective and no more nephrotoxic than divided doses.",
        explanation: "The killing kinetics — pharmacokinetic and pharmacodynamic — dictate regimen design, which is why once-daily gentamicin is safe where thrice-daily dosing was not.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which statement about bactericidal drugs is correct?",
        options: [
          "They kill but do not depend on the growth phase of the organism",
          "They are preferred where the immune system cannot reach the infection",
          "They include erythromycin and doxycycline",
          "They are bacteriostatic in endocarditis",
        ],
        correctIndex: 1,
        explanation: "Bactericidal agents kill outright, so they are the choice where immune clearance is unavailable: endocarditis, meningitis and neutropenia. Beta-lactams, aminoglycosides and quinolones are the examples; erythromycin and doxycycline are static.",
      },
      {
        type: "mcq",
        stem: "Which mechanism explains aminoglycoside selectivity?",
        options: [
          "They block the 70S bacterial ribosome while sparing the 80S human ribosome",
          "They block the human 50S subunit",
          "They inhibit folate synthesis uniquely in bacteria",
          "They dissolve the fungal cell membrane",
        ],
        correctIndex: 0,
        explanation: "Aminoglycosides bind the 30S subunit of the bacterial 70S ribosome and misread the message, causing lethal mistranslation; our 80S ribosome is structurally different and spared. The 50S subunit is the macrolide target.",
      },
      {
        type: "mcq",
        stem: "Which regimen choice best demonstrates empiric therapy guided by the local antibiogram?",
        options: [
          "Prescribing every culture-positive result the same broad agent",
          "Starting an agent chosen by the likely organisms and local sensitivities, then narrowing on cultures",
          "Waiting indefinitely for sensitivities before treating sepsis",
          "Choosing the narrowest drug for every possible organism",
        ],
        correctIndex: 1,
        explanation: "Empiric therapy is chosen from the likely pathogens and the local resistance map, and the mandated next step is de-escalation once cultures narrow the picture. Waiting in sepsis kills; a single broad agent for all results invites resistance.",
      },
      {
        type: "mcq",
        stem: "Which combination is synergistic for enterococcal endocarditis?",
        options: [
          "Penicillin plus gentamicin",
          "Trimethoprim plus sulfamethoxazole plus penicillin",
          "Penicillin plus tetracycline",
          "Nitrofurantoin plus ceftriaxone",
        ],
        correctIndex: 0,
        explanation: "The penicillin (or ampicillin) damages the enterococcal wall so the aminoglycoside reaches the ribosome, producing far greater killing in combination than a beta-lactam alone; tetracyclines are static and antagonise the bactericidal effect.",
      },
      {
        type: "mcq",
        stem: "Which action is NOT part of antimicrobial stewardship?",
        options: [
          "De-escalating therapy once cultures identify the organism",
          "Switching intravenous to oral antibiotics when the patient can absorb",
          "Shortening the course to the shortest effective duration",
          "Continuing broad-spectrum cover until every symptom has resolved",
        ],
        correctIndex: 3,
        explanation: "Extending broad-spectrum cover beyond the shortest effective duration buys resistance and adverse effects, not cure — the opposite of stewardship, which requires the shortest effective course and timely narrowing.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 12 — Cell wall & protein synthesis inhibitors (fully authored)
// ---------------------------------------------------------------------------
function lesson12() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: explain how beta-lactams block peptidoglycan cross-linking and why human cells are spared; organise the penicillins, beta-lactamase inhibitors, cephalosporins and carbapenems by their spectrum; state the main adverse effects of the classes and the cross-reactivity rules of beta-lactam allergy; explain why vancomycin is reserved for resistant Gram-positive organisms and what red man syndrome is; and describe the sites (30S and 50S), mechanisms and signature toxicities of the macrolides, tetracyclines, aminoglycosides and the other protein synthesis inhibitors.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 11 (antimicrobial principles), and the bacteriology module of the microbiology course — Gram-positive and Gram-negative walls, and the beta-lactamases.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Beta-lactam",
        text: "Any antibiotic containing the strained four-membered beta-lactam ring, which mimics the terminal di-alanine of the peptidoglycan precursor, acylates and inactivates the transpeptidase (penicillin-binding protein) that cross-links the wall, and so kills a growing bacterium by osmotic lysis.",
      },
      {
        type: "paragraph",
        text: "The beta-lactam ring is loaded: its four-membered structure is eager to open and acylates the transpeptidase. Human cells have no peptidoglycan and no penicillin-binding protein, so the drug is harmless until it meets the bacterial wall — the template selective-toxicity story. Beta-lactams are bactericidal (they trigger lysis), time-dependent killers (efficacy tracks the time above the minimum inhibitory concentration), and destroyed by beta-lactamase enzymes — which is why every resistance strategy in this lesson is either a ring that has been chemically protected, an inhibitor that sacrifices itself to the enzyme, or an alternative target entirely.",
      },

      { type: "heading", level: 2, text: "The penicillins" },
      {
        type: "table",
        headers: ["Agent", "Spectrum and use", "Notes and adverse effects"],
        rows: [
          ["Benzylpenicillin", "Narrow: streptococci, meningococcus, pneumococcus, syphilis (Treponema pallidum), clostridia", "Given intravenously; destroyed by penicillinase so not for staphylococci; intracapsular rashes in Epstein-Barr and HIV"],
          ["Amoxicillin", "Broader: adds many Gram-negatives, plus Respiratory pathogens: Haemophilus, and the inner cover for listeria", "First-line for pneumonia, otitis media and the triple therapy for Helicobacter pylori; rash in infectious mononucleosis"],
          ["Flucloxacillin", "Narrow but beta-lactamase stable: the anti-staphylococcal penicillin", "The drug for methicillin-sensitive staphylococcus and cellulitis; cholestatic hepatitis after prolonged courses"],
          ["Piperacillin-tazobactam", "Very broad: Gram-positive and Gram-negative cover, including Pseudomonas and anaerobes", "The empiric workhorse for neutropenic sepsis and hospital-acquired infection; needs a beta-lactamase inhibitor on board"],
        ],
      },
      {
        type: "table",
        headers: ["Beta-lactamase inhibitor", "Mechanism", "Combined with"],
        rows: [
          ["Clavulanate", "A suicide inhibitor: binds and is hydrolyed by the enzyme, sparing the partner beta-lactam in the process", "Amoxicillin as co-amoxiclav; ticarcillin historically"],
          ["Tazobactam", "Broader inhibitor, including some extended-spectrum beta-lactamases", "Piperacillin as piperacillin-tazobactam; ceftolozane"],
          ["Avibactam, vaborbactam", "Inhibitors of serine carbapenemases (KPC-type) and OXA enzymes", "Ceftazidime-avibactam; meropenem-vaborbactam"],
        ],
      },
      {
        type: "paragraph",
        text: "Penicillin allergy is reported by about a tenth of patients and true anaphylaxis in far fewer. The cross-reactivity stories are: cephalosporin side chains cause a small true cross-risk (about one to two per cent) that is side-chain-specific rather than a firewall of allergy, and carbapenems cross-react similarly rarely. In documented penicillin anaphylaxis the safest tools are a non-beta-lactam agent — or a monitored challenge to a cephalosporin with a dissimilar side chain — and the choice is a conversation, not a label copy.",
      },

      { type: "heading", level: 2, text: "Cephalosporins" },
      {
        type: "table",
        headers: ["Generation", "Examples", "Spectrum", "Notes"],
        rows: [
          ["First", "Cefalexin", "Good Gram-positive, modest Gram-negative", "Urinary, skin and soft-tissue work; oral agent"],
          ["Second", "Cefuroxime", "Better Gram-negative cover with retained Gram-positive activity", "Respiratory tract infections; cefuroxime is the borderline agent for meningitis in children"],
          ["Third", "Cefotaxime, ceftriaxone", "Strong Gram-negative including the meningitic organisms; ceftriaxone crosses the inflamed blood-brain barrier and is once daily", "The meningitis drug and the gonococcal drug; ceftriaxone biliary precipitation (sludging in neonates), and vitamin K antagonism bleeding with cefoperazone-type agents"],
          ["Fourth", "Cefepime", "Gram-negative including Pseudomonas with gram-positive cover", "Hospital-acquired serious infection"],
          ["Fifth (anti-MRSA)", "Ceftaroline, ceftobiprole", "Like fourth generation plus methicillin-sensitive spectrum extension to MRSA", "Newer option for resistant staphylococcal infection"],
        ],
      },
      {
        type: "paragraph",
        text: "Two cephalosporin caveats matter. The third-generation agents have no useful anaerobic or staphylococcal cover, so they are paired for the abdominal infections where those organisms live — ceftriaxone with metronidazole. And they do not treat Pseudomonas, which is why ceftazidime, then ceftolozane, then the carbapenems come next in that escalation.",
      },

      { type: "heading", level: 2, text: "Carbapenems and glycopeptides" },
      {
        type: "paragraph",
        text: "Carbapenems (meropenem, imipenem, ertapenem) are the broadest beta-lactams: Gram-positive, Gram-negative, anaerobes and Pseudomonas, and stable to most beta-lactamases including extended-spectrum ones. Meropenem crosses the meninges and is the seizure-sparing choice where imipenem (a convulsant at high levels in renal failure) is not acceptable; ertapenem has no Pseudomonas cover and is not a meningitis drug. They are the reserve for the most resistant Gram-negative infection, so carbapenem-sparing stewardship is a real objective, and each unnecessary course builds carbapenem-resistant organisms that leave very few options.",
      },
      {
        type: "paragraph",
        text: "Vancomycin and teicoplanin are glycopeptides: huge molecules that bind the di-alanine of peptidoglycan and block transpeptidation without a beta-lactam ring, so they kill the methicillin-resistant staphylococcus that the beta-lactams cannot touch (vancomycin also clears intestinal clostridioides difficile orally). They are time-dependent killers like the beta-lactams, are given intravenously for systemic Gram-positive infection, and are monitored by trough or area-under-the-curve levels because of nephrotoxicity and ototoxicity. Teicoplanin has a longer half-life that allows once-daily dosing and less nephrotoxicity.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Red man syndrome from vancomycin is direct histamine release from a rapid infusion — flushing, itch and hypotension — not an allergy, and it is managed by slowing the infusion and premedicating with an antihistamine, not by declaring vancomycin allergy. Azithromycin also prolongs the QT, and telavancin carries additional teratogenic and renal cautions, so true glycopeptide allergy is rare and the label often undeserved.",
      },

      { type: "heading", level: 2, text: "Protein synthesis inhibitors" },
      {
        type: "table",
        headers: ["Target site", "Class", "Key agents", "Signature toxicities and notes"],
        rows: [
          ["30S subunit", "Aminoglycosides", "Gentamicin, tobramycin, amikacin", "Concentration-dependent killing (once-daily dosing); irreversible cochlear and vestibular toxicity, dose-related nephrotoxicity, neuromuscular blockade; no anaerobic activity, useless without some oxygen-dependent uptake"],
          ["30S subunit", "Tetracyclines", "Doxycycline, tigecycline, minocycline", "Chelate calcium, so they stain developing teeth and are contraindicated in pregnancy and under twelve; photosensitivity, oesophagitis (take with water, sit up); doxycycline for atypical pneumonia and malaria prophylaxis"],
          ["50S subunit", "Macrolides", "Erythromycin, clarithromycin, azithromycin", "Motilin agonism gives diarrhoea (used to advantage in gastroparesis); QT prolongation; potent cytochrome P450 inhibition (erythromycin, clarithromycin but not azithromycin); azithromycin is the prolonged-intracellular option for atypical pneumonia"],
          ["50S subunit", "Lincosamides", "Clindamycin", "Excellent for streptococcal and staphylococcal soft tissue and anaerobic cover; the classic cause of clostridioides difficile through toxin production, neutralised with oral vancomycin"],
          ["50S subunit", "Oxazolidinones", "Linezolid", "Reserve for resistant Gram-positive organisms; mitochondrial toxicity gives thrombocytopenia and lactic acidosis, serotonin syndrome with serotonergic drugs because it inhibits monoamine oxidase, and neuropathy with prolonged use"],
          ["Mixed", "Phenicols", "Chloramphenicol", "Topical for the eye because systemically it causes dose-related reversible anaemia and idiosyncratic irreversible aplastic anaemia, and the grey baby syndrome in neonates with immature glucuronidation"],
          ["50S accessory", "Streptogramins", "Quinupristin-dalfopristin", "Reserve for resistant enterococcus and staphylococcus; arthralgia and myalgia, infusion-site pain"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Erythromycin and clarithromycin inhibit cytochrome P450 3A4, so a patient on clopidogrel, simvastatin or a calcium-channel blocker can have levels climb dangerously — statin-induced myopathy is the commonest presentation. Azithromycin lacks that inhibition and is the safer macrolide when interactions loom, though it still prolongs the QT.",
      },

      { type: "heading", level: 2, text: "Worked example: how the classes assemble into an infection" },
      {
        type: "paragraph",
        text: "Take the severe aspiration pneumonia after a seizure. The chemistry: Streptococcus species from the mouth, anaerobes from the gums, and the aspiration itself. Co-amoxiclav (amoxicillin with clavulanate) covers the streptococci and the anaerobes and is a bactericidal first choice; a macrolide is added if atypicals are feared; a carbapenem covers the aspiration-associated Gram-negatives if the patient has been in hospital. If the organism turns out to be methicillin-resistant, vancomycin replaces the beta-lactam, and if the patient's renal function is poor the vancomycin level is watched instead of the dose being cut. The point is that each addition has a target, and the choice of the addition answers the microbiology, not the fashion.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a cephalosporin cannot be used in a penicillin allergy. A minority of true cross-reactivity exists and depends on the side chain, so in urgent infection a cephalosporin with a dissimilar side chain is often given under observation, while in documented anaphylaxis a non-beta-lactam is usually cleanest.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Attributing vancomycin's red man syndrome to allergy. It is rate-related histamine release, and the treatment is to slow the infusion; declaring vancomycin allergy unnecessarily removes one of the few tools against resistant staphylococci.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Giving doxycycline to a pregnant woman or a child. Tetracyclines chelate calcium in developing bone and teeth, staining the dentition permanently, so they are contraindicated in pregnancy and in the under-twelves.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Combining linezolid with an antidepressant. Linezolid inhibits monoamine oxidase, so serotonergic agents can produce serotonin syndrome — agitation, clonus, hyperthermia — and this is a real and avoidable interaction.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "How do beta-lactam antibiotics kill bacteria, and why are humans spared?",
        answer: "The strained beta-lactam ring acylates the transpeptidase (penicillin-binding protein) that cross-links peptidoglycan, so the wall fails and the growing bacterium lyses. Humans make no peptidoglycan and have no penicillin-binding proteins, so the drug has no target — which is the selective-toxicity principle in action.",
        explanation: "Killing requires growth and wall synthesis, which is why beta-lactams work best on rapidly dividing organisms and not at all on cell-wall-deficient forms such as the L-forms.",
      },
      {
        type: "question",
        prompt: "Why is clindamycin a cause of clostridioides difficile, and how is that treated?",
        answer: "Clindamycin's anaerobic cover includes clostridioides when it is given orally at mucosal doses, and it suppresses the competing flora, so a resistant strain overgrows and produces toxin. Treatment is to stop the offending agent and treat with oral vancomycin or fidaxomicin — with a second course and bezlotoxumab in the recurrent case.",
        explanation: "Antibiotic-associated colitis is the direct cost of an agent whose spectrum includes the bowel anaerobes, and targeted therapy avoids it while the offending agent is stopped.",
      },
      {
        type: "question",
        prompt: "What distinguishes the aminoglycosides pharmacokinetically from the beta-lactams, and how does it shape dosing?",
        answer: "Aminoglycosides kill concentration-dependently (the peak above the minimum inhibitory concentration is what kills) and show a post-antibiotic effect, so a single large daily dose is effective and less nephrotoxic; beta-lactams are time-dependent, so the effect tracks the time above the minimum and frequent dosing or extended infusion is used.",
        explanation: "The different killing kinetics are the reason gentamicin became a once-daily drug while the penicillins were re-infused over longer periods, at equal efficacy and different toxicity.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which bacterial structure do beta-lactam antibiotics attack?",
        options: [
          "The 70S ribosome", "The peptidoglycan cell wall", "Folate synthesis", "The cytoplasmic membrane",
        ],
        correctIndex: 1,
        explanation: "Beta-lactams acylate the transpeptidase that cross-links peptidoglycan, so the wall fails and the bacterium lyses. The 70S ribosome belongs to the protein synthesis inhibitors and folate to the antifolates.",
      },
      {
        type: "mcq",
        stem: "Which drug is combined with amoxicillin to protect it from beta-lactamase?",
        options: ["Tazobactam", "Clavulanate", "Sulbactam", "Avibactam"],
        correctIndex: 1,
        explanation: "Clavulanate is the suicide inhibitor paired with amoxicillin as co-amoxiclav; tazobactam and sulbactam are paired with piperacillin and ampicillin, and avibactam with ceftazidime.",
      },
      {
        type: "mcq",
        stem: "Which statement about vancomycin is correct?",
        options: [
          "It is a first-line agent for methicillin-sensitive staphylococcus",
          "The red man syndrome is an immunoglobulin-mediated allergy",
          "It is a glycopeptide used for methicillin-resistant Gram-positive infection, with red man syndrome from histamine release on rapid infusion",
          "It has excellent anaerobic cover",
        ],
        correctIndex: 2,
        explanation: "Vancomycin is a large glycopeptide reserved for resistant Gram-positive organisms; red man syndrome is direct histamine release managed by slowing the infusion, and it has no anaerobic activity.",
      },
      {
        type: "mcq",
        stem: "Which adverse effect is characteristic of aminoglycosides?",
        options: [
          "Permanent staining of the teeth",
          "Irreversible cochlear and vestibular damage with dose-related nephrotoxicity",
          "Serotonin syndrome through monoamine oxidase inhibition",
          "Thrombocytopenia from mitochondrial toxicity",
        ],
        correctIndex: 1,
        explanation: "Aminoglycosides accumulate in the inner ear and the renal cortex, giving dose-related cochlear vestibular toxicity and nephrotoxicity. Teeth staining belongs to tetracyclines, serotonin syndrome to linezolid, and thrombocytopenia also to linezolid.",
      },
      {
        type: "mcq",
        stem: "Which pair of toxicities belongs to linezolid?",
        options: [
          "Ototoxicity and nephrotoxicity",
          "Photosensitivity and oesophagitis",
          "Thrombocytopenia and serotonin syndrome",
          "Cholestasis and hepatitis",
        ],
        correctIndex: 2,
        explanation: "Linezolid inhibits mitochondrial protein synthesis (thrombocytopenia, neuropathy, lactic acidosis) and monoamine oxidase (serotonin syndrome with serotonergic drugs). Ototoxicity and nephrotoxicity are aminoglycoside, photosensitivity tetracycline, and flucloxacillin hepatitis the penicillin profile.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 7 — Antihypertensive drugs (fully authored)
// ---------------------------------------------------------------------------
function lesson7() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: explain blood pressure as cardiac output multiplied by total peripheral resistance and identify which term of that equation each antihypertensive class lowers; name the first-line classes — thiazide-like diuretics, calcium-channel blockers, ACE inhibitors and ARBs — and explain when a beta-blocker is added for a compelling indication; state the mechanism, principal indication and characteristic adverse effects of each class; predict the drug interactions that make combinations safe or unsafe, such as verapamil with a beta-blocker; and outline the management of a hypertensive emergency with titratable intravenous agents.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1 to 6, above all autonomic pharmacology (beta-blockers, alpha-blockers) and the cardiovascular module of the physiology course.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Antihypertensive",
        text: "A drug that lowers elevated arterial blood pressure. Because pressure equals cardiac output multiplied by total peripheral resistance, every antihypertensive works by reducing one or both terms of that equation, and the classes are best remembered by which one they attack.",
      },
      {
        type: "paragraph",
        text: "Hypertension damages the body silently through pressure itself: left ventricular hypertrophy progressing to heart failure, stroke and small-vessel cerebral disease, atherothrombosis and aneurysm formation, chronic kidney disease with proteinuria, and hypertensive retinopathy. The trial benefit of treating it is large, and most classes lower the pressure by a similar modest amount, so the choice of first drug is driven less by efficacy at the pressure alone and more by comorbidity, age, ethnicity, tolerability and cost. Two agents used together, each from a different pathway, lower the pressure far more than doubling the dose of one.",
      },

      { type: "heading", level: 2, text: "The classes at a glance" },
      {
        type: "table",
        headers: ["Class", "Example drugs", "Mechanism", "Term of the equation lowered"],
        rows: [
          ["Thiazide and thiazide-like diuretics", "Indapamide, chlortalidone, bendroflumethiazide", "Inhibit the sodium-chloride cotransporter in the distal convoluted tubule, reducing sodium reabsorption and, with time, peripheral resistance", "Output at first, resistance with chronic use"],
          ["Dihydropyridine calcium-channel blockers", "Amlodipine, lercanidipine, nifedipine", "Block L-type calcium channels in vascular smooth muscle, dilating arterioles", "Resistance"],
          ["Non-dihydropyridine calcium-channel blockers", "Verapamil, diltiazem", "Block calcium channels in the SA and AV nodes and myocardium, slowing rate and contractility", "Output"],
          ["ACE inhibitors", "Ramipril, lisinopril, enalapril", "Block angiotensin-converting enzyme, lowering angiotensin II and raising bradykinin", "Resistance (afterload and aldosterone)"],
          ["Angiotensin receptor blockers", "Losartan, valsartan, candesartan", "Block the angiotensin II AT1 receptor directly, leaving bradykinin untouched", "Resistance"],
          ["Beta-blockers", "Bisoprolol, atenolol, carvedilol", "Block beta-1 receptors, reducing heart rate, contractility and renin release", "Output (and renin-driven resistance)"],
          ["Alpha-1 blockers", "Doxazosin, prazosin", "Block alpha-1 mediated vasoconstriction", "Resistance"],
        ],
      },

      { type: "heading", level: 2, text: "ACE inhibitors and ARBs" },
      {
        type: "table",
        headers: ["Agent", "Mechanism detail", "Characteristic adverse effects"],
        rows: [
          ["Ramipril, lisinopril", "Reduce angiotensin II, so vasoconstriction and aldosterone-driven sodium retention fall; bradykinin accumulates because the same enzyme degrades it", "Persistent dry cough, angioedema, hyperkalaemia, first-dose hypotension, modest creatinine rise, teratogenic"],
          ["Valsartan, losartan, candesartan", "Block the AT1 receptor for angiotensin II without interfering with bradykinin", "Hyperkalaemia, renal impairment, teratogenic, but no cough or angioedema from bradykinin"],
        ],
      },
      {
        type: "paragraph",
        text: "Both classes raise creatinine modestly and predictably at initiation, because they dilate the efferent arteriole of the glomerulus; a rise of up to about thirty per cent is expected and is not a reason to stop. They are dangerous in bilateral renal artery stenosis, where the whole filtration pressure depends on angiotensin-mediated efferent tone. The combination of an ACE inhibitor with an ARB adds renal risk without benefit, so it is not prescribed, and both classes are contraindicated in pregnancy.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The dry cough of an ACE inhibitor is bradykinin-mediated, and it is the reason an ARB is substituted: the ARB keeps the angiotensin blockade but spares the bradykinin, so the cough resolves. Angioedema is rare but life-threatening by the same mechanism, and once it has occurred every ACE inhibitor is contraindicated thereafter, not merely the one that caused it.",
      },

      { type: "heading", level: 2, text: "Calcium-channel blockers" },
      {
        type: "table",
        headers: ["Agent", "Cardiac effect", "Vascular effect", "Typical adverse effect"],
        rows: [
          ["Amlodipine (dihydropyridine)", "Reflex tachycardia", "Powerful arteriolar dilation", "Ankle oedema from capillary leak, flushing, headache, gingival hyperplasia"],
          ["Verapamil (non-dihydropyridine)", "Slows the SA and AV nodes, reduces contractility", "Milder dilation", "Constipation, bradycardia, precipitation of heart block"],
          ["Diltiazem (non-dihydropyridine)", "Slows nodal conduction", "Moderate dilation", "Bradycardia, conduction disturbances"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Ankle oedema from amlodipine is leakage from the raised pressure in the dilated precapillary arteriole — not sodium and water retention. It does not respond to a diuretic, which wastes electrolyte without touching the swelling; reduce the dose or pair with a RAS blocker, whose venodilation offsets the leak. Verapamil plus a beta-blocker is the opposite trap: both slow the AV node and together risk complete heart block and profound bradycardia.",
      },

      { type: "heading", level: 2, text: "Beta-blockers and resistant hypertension" },
      {
        type: "paragraph",
        text: "Beta-blockers are less effective as monotherapy in older patients and in those of African or Caribbean family origin, and they carry metabolic and quality-of-life costs (fatigue, erectile dysfunction, masking of hypoglycaemia, worsening of insulin sensitivity). They earn their place with a compelling indication: angina, post-myocardial-infarction, heart failure with reduced ejection fraction, rate control in atrial fibrillation, or thyrotoxicosis. Spironolactone is the evidence-based fourth-line agent for resistant hypertension on three drugs, because aldosterone-driven sodium retention and hypertension are now recognised as common; it is added with careful potassium monitoring.",
      },

      { type: "heading", level: 2, text: "Hypertensive emergency and urgency" },
      {
        type: "paragraph",
        text: "A hypertensive emergency is a very high blood pressure with acute target-organ damage — pulmonary oedema, stroke, aortic dissection, myocardial ischaemia, acute kidney injury or eclampsia. It demands admission and a titratable intravenous agent monitored against an arterial line, because the organs have autoregulated to the elevated pressure and an abrupt fall produces watershed infarction. A severe elevation without target-organ damage is an urgency: it is treated with oral agents and rapid outpatient review, not by an emergency department infusion.",
      },
      {
        type: "table",
        headers: ["Intravenous drug", "Action", "Preferred when"],
        rows: [
          ["Labetalol", "Combined alpha and beta blockade, lowering resistance and heart rate together", "The usual first choice in most emergencies, and specifically aortic dissection after beta-blockade"],
          ["Hydralazine", "Direct arteriolar dilation with reflex tachycardia", "Eclampsia (after magnesium sulfate) or pregnancy-associated hypertension"],
          ["Glyceryl trinitrate", "Predominantly venodilation with coronary dilation", "Pulmonary oedema with associated ischaemia"],
          ["Nicardipine, clevidipine", "Short-acting dihydropyridine infusions", "Where smooth, predictable titration is required"],
          ["Nitroprusside", "Arterial and venous dilation with cyanide accumulation risk", "Rarely now, and only for brief use in refractory crises"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Treating amlodipine-induced ankle oedema with furosemide. The oedema is capillary leakage from arteriolar dilation, not sodium retention, so the diuretic makes the patient hypokalaemic without reducing the swelling. Lower the dose or pair with a RAS blocker.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Combining an ACE inhibitor with an ARB. Alone each has outcome benefit; together they compound hyperkalaemia and renal impairment, and the trials of dual renin-angiotensin blockade were stopped early for harm.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Calling beta-blockade first-line for uncomplicated hypertension. Current guidelines reserve first place for a calcium-channel blocker, a thiazide-like diuretic or an ACE inhibitor or ARB; older atenolol-based regimens showed inferior outcomes.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting pregnancy. Both ACE inhibitors and ARBs are teratogenic — oligohydramnios and fetal renal failure — so they are stopped and replaced in any woman of childbearing potential who might conceive. Methyldopa and labetalol are the traditional alternatives.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does an ACE inhibitor raise creatinine at first, and is that a reason to stop the drug?",
        answer: "It dilates the efferent arteriole of the glomerulus by removing angiotensin II tone, so glomerular filtration pressure falls and creatinine rises. A rise up to about thirty per cent is an expected haemodynamic effect, not toxicity: continue the drug and monitor the potassium.",
        explanation: "The same reduction in intraglomerular pressure is why RAS blockade protects the kidney in diabetic proteinuric nephropathy, even while creatinine rises modestly.",
      },
      {
        type: "question",
        prompt: "A patient on amlodipine has new ankle swelling. What is the mechanism and what are the options?",
        answer: "Precapillary arteriolar dilation raises capillary hydrostatic pressure and leaks fluid into the interstitium — a pressure effect, not sodium retention. Reduce the amlodipine dose, or add an ACE inhibitor or ARB, whose post-capillary venodilation reduces the leak.",
        explanation: "Pairing a dihydropyridine with a RAS blocker is the evidence-based answer to the oedema, because the venous and arteriolar effects offset each other.",
      },
      {
        type: "question",
        prompt: "Why is labetalol the usual first-line in a hypertensive emergency?",
        answer: "It blocks both alpha and beta receptors, lowering resistance without the reflex tachycardia a pure vasodilator provokes, and it can be titrated intravenously against the pressure. Its beta-blockade also suits aortic dissection, where shear stress on the aorta must fall.",
        explanation: "Predictable, balanced and titratable action is the requirement of a hypertensive emergency, and labetalol meets all three.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which class lowers blood pressure mainly by dilating arterioles through blockade of L-type calcium channels?",
        options: ["ACE inhibitors", "Dihydropyridine calcium-channel blockers", "Thiazide-like diuretics", "Beta-1 antagonists"],
        correctIndex: 1,
        explanation: "Dihydropyridines such as amlodipine act on vascular smooth muscle calcium channels to dilate arterioles. ACE inhibitors act on angiotensin, diuretics on the distal nephron and beta-blockers on cardiac output.",
      },
      {
        type: "mcq",
        stem: "A patient on an ACE inhibitor has a persistent dry cough. What mechanism explains it, and what is the appropriate response?",
        options: [
          "Accumulation of bradykinin; switch to an angiotensin receptor blocker",
          "Accumulation of angiotensin II; reduce the dose",
          "Aldosterone excess; add spironolactone",
          "Pulmonary oedema; add furosemide",
        ],
        correctIndex: 0,
        explanation: "ACE normally degrades bradykinin, so the inhibitor lets it irritate the airway. An ARB blocks the receptor and leaves bradykinin untouched, so the cough resolves on switching.",
      },
      {
        type: "mcq",
        stem: "Which laboratory change is expected and tolerated shortly after starting an ACE inhibitor?",
        options: [
          "A fall in creatinine of more than fifty per cent",
          "A rise in creatinine of up to about thirty per cent",
          "A rise in potassium above seven millimoles per litre",
          "A fall in sodium of more than fifteen millimoles per litre",
        ],
        correctIndex: 1,
        explanation: "Efferent arteriolar dilation reduces intraglomerular pressure, so creatinine rises modestly; up to about thirty per cent is acceptable. A potassium above seven, or a large sodium fall, demands investigation and withdrawal.",
      },
      {
        type: "mcq",
        stem: "A patient has a hypertensive emergency with acute pulmonary oedema. Which initial treatment is most appropriate?",
        options: ["Oral ramipril", "Intravenous glyceryl trinitrate", "Sublingual nifedipine", "Oral spironolactone"],
        correctIndex: 1,
        explanation: "Intravenous glyceryl trinitrate venodilates and dilates the coronaries, treating the pulmonary oedema and any ischaemia, and is titratable against the pressure. Sublingual nifedipine has caused precipitous falls with stroke and ischaemia.",
      },
      {
        type: "mcq",
        stem: "Which combination should be avoided because the two drugs together risk complete heart block?",
        options: [
          "Amlodipine with ramipril", "Verapamil with bisoprolol", "Losartan with indapamide", "Doxazosin with furosemide",
        ],
        correctIndex: 1,
        explanation: "Verapamil and beta-blockers both slow sinoatrial and atrioventricular conduction, so together they can precipitate bradycardia and atrioventricular block. The other pairings act on separate mechanisms and are standard practice.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 8 — Anticoagulants & thrombolytics (fully authored)
// ---------------------------------------------------------------------------
function lesson8() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: distinguish the three drug groups of thrombosis — antiplatelet agents, anticoagulants and thrombolytics — and say what each does to the evolving clot; describe the mechanism, monitoring, onset and reversal agent for heparin, low-molecular-weight heparin, warfarin and the direct oral anticoagulants; state the principal indications, including non-valvular atrial fibrillation and venous thromboembolism; recognise heparin-induced thrombocytopenia and its management; and weigh the contraindications that decide whether a thrombolytic can be given in an acute coronary occlusion or an ischaemic stroke.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1 to 6, and the coagulation cascade from the physiology course — platelets, thrombin, fibrin and the vitamin-K-dependent clotting factors II, VII, IX and X.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Anticoagulant",
        text: "A drug that inhibits the coagulation cascade and so prevents the formation and propagation of fibrin. It does not dissolve clot that has already formed, and it does nothing to platelets: an artery clot is a platelet-rich plug requiring an antiplatelet drug, while a vein clot is fibrin-rich and requires an anticoagulant.",
      },
      {
        type: "paragraph",
        text: "Haemostasis has two arms. Platelets aggregate at the site of injury to form the primary plug, and the coagulation cascade lays fibrin on that plug to stabilise it as a thrombus. Antiplatelet drugs weaken the first arm and are arterial drugs; anticoagulants weaken the second and are venous and stasis drugs; thrombolytics dissolve the fibrin of an already-established clot and are emergency rescue agents. Choosing the wrong arm is a classic prescribing error: warfarin prevents stent thrombosis poorly, and clopidogrel prevents pulmonary embolism not at all.",
      },

      { type: "heading", level: 2, text: "Antiplatelet drugs" },
      {
        type: "table",
        headers: ["Drug", "Mechanism", "Reversibility", "Clinical use"],
        rows: [
          ["Aspirin", "Irreversibly inhibits platelet COX-1, so thromboxane A2 falls and the platelet cannot aggregate; the anucleate platelet cannot replace the enzyme", "Lasts the life of each platelet (7 to 10 days of turnover)", "Secondary prevention of vascular events; low-dose for thrombosis prophylaxis after stents"],
          ["Clopidogrel", "Irreversibly blocks the P2Y12 ADP receptor on the platelet", "Waits for new platelets (about a week)", "With aspirin as dual antiplatelet therapy after acute coronary syndromes and stenting"],
          ["Ticagrelor", "Reversibly blocks the same P2Y12 receptor, so offset is faster and not dependent on turnover", "Reverses as the drug is cleared", "Alternative to clopidogrel where thrombotic risk is highest"],
          ["Dipyridamole", "Raises platelet cyclic AMP; commonly combined with aspirin", "Short", "Secondary prevention after ischaemic stroke"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The irreversibility of aspirin explains two clinical facts: a single dose affects platelets for the whole week it takes to replace them, and aspirin is stopped about a week before elective surgery, not the day before. Clopidogrel has the same recovery time course.",
      },

      { type: "heading", level: 2, text: "Anticoagulants" },
      {
        type: "table",
        headers: ["Drug", "Mechanism", "Monitoring and onset", "Reversal"],
        rows: [
          ["Unfractionated heparin", "Binds antithrombin III and accelerates its inhibition of thrombin and factor Xa; the large molecule does not cross the placenta", "Intravenous, monitored by APTT ratio, half-life about an hour, immediate action", "Protamine sulfate, given as a titrated dose"],
          ["Low-molecular-weight heparin", "The same antithrombin acceleration, but predominantly anti-factor-Xa activity", "Subcutaneous, weight-based dosing, no routine monitoring outside pregnancy and renal failure", "Protamine only partially reverses it"],
          ["Warfarin", "Inhibits vitamin K epoxide reductase, so the functional clotting factors II, VII, IX and X fall, and proteins C and S fall too", "Oral, onset over days, monitored by INR with a target of 2.0 to 3.0 (2.5 to 3.5 for mechanical valves)", "Vitamin K restores synthesis; four-factor prothrombin complex concentrate or FFP replaces immediately"],
          ["Dabigatran", "Direct thrombin inhibitor", "Oral, fixed dose, no routine monitoring, partly renally cleared", "Idarucizumab, an antibody fragment that neutralises dabigatran"],
          ["Apixaban, rivaroxaban, edoxaban", "Direct factor Xa inhibitors", "Oral, fixed dose, no routine monitoring, largely hepatically cleared", "Andexanet alfa where available, otherwise prothrombin complex concentrate"],
        ],
      },
      {
        type: "paragraph",
        text: "Warfarin is the awkward survivor: it needs INR monitoring, it interacts with every cytochrome P450 inducer and inhibitor (rifampicin, amiodarone, many antibiotics) and with dietary vitamin K, it is teratogenic and causes skin necrosis in the first weeks through the protein C paradox, and it is the only oral agent licensed for a mechanical heart valve. The direct oral anticoagulants avoid all of that and at least halve intracranial haemorrhage, which is why they have displaced warfarin for non-valvular atrial fibrillation and venous thromboembolism — but they are renally cleared, so renal function and age decide the dose.",
      },

      { type: "heading", level: 2, text: "Worked example: two patients with the same atrial fibrillation" },
      {
        type: "paragraph",
        text: "Two patients present with atrial fibrillation at a ventricular rate of 120 and both feel breathless. The patient with non-valvular fibrillation is given apixaban, because stroke prevention matches warfarin with fewer intracranial haemorrhages; the patient with a mechanical mitral valve is given warfarin to a target INR of 2.5 to 3.5, because the direct oral anticoagulants failed their trial in mechanical valves and warfarin remains the only licensed choice. Rate control is identical — a beta-blocker or digoxin — but the anticoagulant is not interchangeable, and the decision turns on the valve.",
      },

      { type: "heading", level: 2, text: "Heparin-induced thrombocytopenia" },
      {
        type: "paragraph",
        text: "Heparin-induced thrombocytopenia is an immune reaction: antibodies against the complex of platelet factor 4 with heparin activate the platelets, so the platelet count falls by more than half from baseline even as the patient forms new venous and arterial thromboses. It typically begins days five to ten after heparin starts. The management is to stop every heparin product including line flushes, never to transfuse platelets into a prothrombotic storm, and to anticoagulate with a non-heparin agent such as argatroban, danaparoid or a direct oral anticoagulant. Low-molecular-weight heparin is less prone to the reaction but still causes it, so both heparins are stopped.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The clinical signature is a falling platelet count with clotting, not bleeding — a paradoxical thrombosis. A heparin-treated patient whose platelet count halves on day six, or who develops a new thrombosis while anticoagulated, has the diagnosis until the antibody assay confirms it.",
      },

      { type: "heading", level: 2, text: "Thrombolytics" },
      {
        type: "paragraph",
        text: "Thrombolytics convert plasminogen to plasmin and dissolve fibrin. Alteplase, reteplase and tenecteplase are recombinant tissue plasminogen activators given as weight-based doses; streptokinase is the older streptococcal derivative, is antigenic, and should not be repeated after the first exposure. The indications are time-critical: occlusion of a coronary artery in ST-elevation myocardial infarction within twelve hours of symptom onset, acute ischaemic stroke with a disabling deficit within the treatment window once haemorrhage is excluded by scan, and massive pulmonary embolism with haemodynamic collapse. Where primary percutaneous coronary intervention is available within twelve hours it is superior to lysis for the myocardial infarction.",
      },
      {
        type: "table",
        headers: ["Indication", "Agent and route", "Essential precondition"],
        rows: [
          ["ST-elevation myocardial infarction", "Tenecteplase or alteplase intravenously", "No haemorrhage risk that outweighs the benefit; PCI within the time window is the superior option"],
          ["Acute ischaemic stroke", "Alteplase intravenously", "Computed tomography excluding haemorrhage, onset within the treatment window, blood pressure controlled"],
          ["Massive pulmonary embolism", "Alteplase with heparin", "Sustained hypotension or cardiac arrest attributable to the embolus"],
          ["Selected extensive deep venous thrombosis", "Alteplase, catheter-directed or systemic", "Limb-threatening iliofemoral clot in a patient with low bleeding risk"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The contraindications to thrombolysis are absolute: active internal bleeding, recent haemorrhagic stroke or any stroke within three months, recent major surgery or head injury, suspected aortic dissection, and a bleeding diathesis. Miss one and the lytic kills by the intracranial haemorrhage it causes — which is why the stroke protocol scans before the needle and the consent conversation happens at the same time.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying heparin and warfarin are interchangeable because both stop clotting. Heparin acts immediately through antithrombin and is titrated; warfarin takes days to work through reduced synthesis of protein-based factors, and its first days can be prothrombotic as protein C falls before the factors do — which is why heparin bridges the start of warfarin in acute thrombosis.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Prescribing a direct oral anticoagulant for a mechanical heart valve. The dabigatran trial in mechanical valves was stopped early for excess thrombosis and bleeding; warfarin to a higher INR target is the standard of care.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting reversal for the bleeding patient going to theatre. Warfarin is replaced immediately by four-factor prothrombin complex concentrate and restored by vitamin K; dabigatran is neutralised by idarucizumab. For the factor Xa inhibitors, the timing of the last dose decides most bleeds in practice.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Stopping aspirin too early after coronary stenting, or too late before surgery. Immediate stent thrombosis is lethal, so the surgeon's demand to stop antiplatelets is weighed against the interval since the stent was placed and the kind of stent.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why is heparin rather than warfarin used on day one of an acute deep vein thrombosis?",
        answer: "Heparin acts immediately by potentiating antithrombin III, whereas warfarin takes several days to deplete the existing clotting factors and can be briefly prothrombotic at first as protein C falls. Heparin covers those dangerous first days while the warfarin takes hold, and it stops once the INR is therapeutic.",
        explanation: "The pharmacology of onset — immediate antithrombin amplification versus slow depletion of synthesised factors — dictates the overlap, called bridging.",
      },
      {
        type: "question",
        prompt: "A heparin-treated patient's platelet count halves on day six and a new clot appears in the other leg. What has happened and what is the management?",
        answer: "Heparin-induced thrombocytopenia: antibodies to the platelet factor 4-heparin complex activate the platelets, so thrombosis occurs despite the falling count. Stop all heparin including line flushes, do not transfuse platelets, and anticoagulate with a non-heparin agent such as argatroban.",
        explanation: "The reaction is immune, so rechallenge is dangerous, and its signature is thrombotic rather than bleeding.",
      },
      {
        type: "question",
        prompt: "Which patient receives apixaban rather than warfarin, and why?",
        answer: "The patient with non-valvular atrial fibrillation: the direct oral anticoagulants give equivalent stroke prevention with fewer intracranial haemorrhages and need no INR monitoring. A mechanical valve, by contrast, still mandates warfarin, because the trial of dabigatran in that setting was stopped early for excess thrombosis.",
        explanation: "The valve is the branch point — biological and rheumatic mitral valves aside, a mechanical valve is the one place warfarin remains unchallenged.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which anticoagulant is the drug of choice for a patient with a mechanical mitral valve?",
        options: ["Dabigatran", "Apixaban", "Warfarin", "Rivaroxaban"],
        correctIndex: 2,
        explanation: "Only warfarin is licensed and tested in mechanical valves; the dabigatran trial was stopped early for excess thrombosis. Such patients need a target INR of 2.5 to 3.5.",
      },
      {
        type: "mcq",
        stem: "Which is the reversal agent for dabigatran?",
        options: ["Protamine sulfate", "Vitamin K", "Idarucizumab", "Andexanet alfa"],
        correctIndex: 2,
        explanation: "Idarucizumab is a monoclonal antibody fragment that neutralises dabigatran rapidly. Protamine reverses heparins, vitamin K restores warfarin's synthesis, and andexanet alfa reverses the factor Xa inhibitors.",
      },
      {
        type: "mcq",
        stem: "Which finding suggests heparin-induced thrombocytopenia?",
        options: [
          "Bleeding with a normal platelet count",
          "A rising platelet count with fever",
          "A platelet count that has fallen by more than half, with a new thrombosis",
          "Bruising with a prolonged APTT ratio",
        ],
        correctIndex: 2,
        explanation: "Heparin-induced thrombocytopenia is an immune prothrombotic state — the count falls as activated platelets are consumed while new arterial and venous thrombi form. Heparin is stopped and a non-heparin anticoagulant substituted.",
      },
      {
        type: "mcq",
        stem: "Which is an absolute contraindication to thrombolysis for an acute ischaemic stroke?",
        options: [
          "A systolic pressure of 180 millimetres of mercury",
          "Haemorrhage shown on the computed tomography scan",
          "Onset four hours before presentation",
          "Age over eighty years",
        ],
        correctIndex: 1,
        explanation: "Visible haemorrhage excludes lysis outright, because the drug will cause it to expand. Elevated pressure must be controlled below the threshold first; age and onset within the window are not contraindications.",
      },
      {
        type: "mcq",
        stem: "Which statement about aspirin is correct?",
        options: [
          "Its antiplatelet effect lasts only while the drug circulates",
          "It irreversibly inhibits platelet COX-1 for the life of the platelet",
          "It is reversed by protamine sulfate",
          "It blocks the P2Y12 receptor",
        ],
        correctIndex: 1,
        explanation: "Aspirin irreversibly acetylates platelet COX-1, and the anucleate platelet cannot synthesise new enzyme, so the effect persists for the 7 to 10 days of platelet turnover. Protamine reverses heparin; clopidogrel blocks P2Y12.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 9 — Diuretic drugs (fully authored)
// ---------------------------------------------------------------------------
function lesson9() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: locate each diuretic class at its site in the nephron and state the transporter it inhibits; compare loop, thiazide and potassium-sparing diuretics by efficacy of sodium excretion, onset and duration; predict the electrolyte and metabolic consequences of each class; describe the roles of osmotic and carbonic anhydrase inhibitors; and construct a rational combination regimen for resistant oedema while spotting the traps (hypokalaemia, hyponatraemia, gout, oedema, potentiated toxicity).",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1 to 6, and the renal module of the physiology course — the nephron segments, the loop of Henle and the countercurrent mechanism.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Diuretic",
        text: "A drug that increases the renal excretion of sodium and water. Each class blocks a sodium transporter in one nephron segment, and the fraction of filtered sodium that segment reabsorbs determines the ceiling of the diuresis — the more proximal the blockade, the more sodium is delivered downstream and reabsorbed by a later transporter instead.",
      },
      {
        type: "paragraph",
        text: "The nephron is a sequence of reabsorptive sites, and the classes map onto them: around 65 per cent of filtered sodium is reabsorbed in the proximal tubule, 25 per cent in the loop of Henle, 5 to 10 per cent in the distal convoluted tubule, and a final 1 to 2 per cent in the collecting duct. A drug cannot exceed its segment's share, so a loop diuretic has the largest ceiling (20 to 25 per cent of filtered sodium) and a potassium-sparing agent the smallest (about 2 per cent). That single fact explains why a loop diuretic is chosen for pulmonary oedema while a thiazide serves hypertension, and why adding a thiazide to a loop — sequential nephron blockade — produces a diuresis greater than either drug alone.",
      },

      { type: "heading", level: 2, text: "The nephron and its drugs" },
      {
        type: "table",
        headers: ["Nephron segment", "Sodium reabsorbed", "Transporter", "Drug acting there"],
        rows: [
          ["Proximal convoluted tubule", "About 65 per cent (bicarbonate and glucose with it)", "Sodium-hydrogen exchanger, sodium-phosphate cotransporter", "Carbonic anhydrase inhibitors (acetazolamide)"],
          ["Thick ascending limb of the loop of Henle", "About 25 per cent", "Sodium-potassium-2 chloride cotransporter", "Loop diuretics (furosemide, bumetanide)"],
          ["Distal convoluted tubule", "About 5 to 10 per cent", "Sodium-chloride cotransporter", "Thiazides and thiazide-like diuretics (indapamide)"],
          ["Collecting duct (principal cells)", "The final 1 to 2 per cent", "Epithelial sodium channel (ENaC) driven by aldosterone", "Amiloride, triamterene; spironolactone and eplerenone block the aldosterone receptor above it"],
          ["Descending limb and collecting duct", "Water follows solute", "Aquaporins under antidiuretic hormone influence", "Osmotic agents (mannitol); antagonists treat nephrogenic diabetes insipidus by a different route"],
        ],
      },

      { type: "heading", level: 2, text: "The three workhorse classes" },
      {
        type: "table",
        headers: ["Class", "Example drugs", "Site and mechanism", "Main indications"],
        rows: [
          ["Loop diuretics", "Furosemide, bumetanide, torasemide", "Inhibit the sodium-potassium-2 chloride cotransporter of the thick ascending limb; collapse of the medullary gradient abolishes the kidney's concentrating ability, giving a profuse diuresis", "Acute pulmonary oedema, chronic heart failure, cirrhosis with ascites, chronic kidney disease, hypercalcaemia (with saline)"],
          ["Thiazide and thiazide-like diuretics", "Indapamide, chlortalidone, bendroflumethiazide", "Inhibit the sodium-chloride cotransporter of the distal convoluted tubule; a modest diuresis with long-term fall in peripheral resistance", "Hypertension, mild heart failure with a loop agent, kidney stones from hypercalciuria, nephrogenic diabetes insipidus"],
          ["Potassium-sparing diuretics", "Spironolactone, eplerenone, amiloride, triamterene", "Block the epithelial sodium channel directly or the aldosterone mineralocorticoid receptor that drives it, so potassium is retained while a little sodium is lost", "Heart failure (mortality benefit), resistant hypertension, cirrhosis with ascites, primary hyperaldosteronism"],
        ],
      },
      {
        type: "paragraph",
        text: "Furosemide is the loop diuretic in most formularies: intravenous it acts within five minutes, oral within an hour, and it is the drug of choice for the acute drowning sensation of pulmonary oedema. Bumetanide is better absorbed orally and is preferred when gut oedema blunts furosemide uptake in decompensated failure. Spironolactone is the only diuretic with survival benefit in heart failure, which is why it sits alongside the RAS blocker and beta-blocker rather than being a mere symptom drug.",
      },

      { type: "heading", level: 2, text: "Electrolyte and metabolic consequences" },
      {
        type: "table",
        headers: ["Class", "Potassium", "Sodium", "Other predictable effects"],
        rows: [
          ["Loop diuretics", "Low (hypokalaemia) — more sodium delivered to the collecting duct wastes potassium", "Low, with volume depletion", "Hypomagnesaemia, metabolic alkalosis, hypocalcaemia, hyperuricaemia, ototoxicity (dose-related and additive with aminoglycosides)"],
          ["Thiazide and thiazide-like diuretics", "Low (hypokalaemia)", "Low — the classic cause of diuretic-induced hyponatraemia, especially in older women", "Hyperuricaemia precipitating gout, hyperglycaemia, hypercholesterolaemia, hypercalcaemia, erectile dysfunction"],
          ["Potassium-sparing diuretics", "High (hyperkalaemia), dangerous with an ACE inhibitor or ARB", "No direct fall", "Spironolactone gives gynaecomastia and menstrual irregularity through progesterone activity; eplerenone is the progesterone-clean alternative"],
          ["Osmotic diuretics", "Initial rise then fall", "Transient rise then fall", "Expansion of plasma volume before the diuresis, risking pulmonary oedema in heart failure"],
          ["Carbonic anhydrase inhibitors", "Low", "Variable", "Metabolic acidosis (bicarbonate wasting), paraesthesiae, sedation, and renal stone risk from hypocitraturia"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Two interactions are the exam favourites. Non-steroidal anti-inflammatory drugs oppose every diuretic by inhibiting renal prostaglandins that maintain the afferent perfusion, so a patient on indapamide plus ibuprofen for back pain loses the diuresis and gains renal risk. And a loop diuretic with an aminoglycoside adds cochlear and renal toxicity, because both are accumulated in the tubular fluid and the hair cells.",
      },

      { type: "heading", level: 2, text: "Osmotic and carbonic anhydrase inhibitors" },
      {
        type: "paragraph",
        text: "Mannitol is an osmotic diuretic: filtered but not reabsorbed, it holds water in the tubule and draws fluid out of the tissues. Its modern uses are few — to lower intracranial pressure and intraocular volume before ophthalmological surgery, and to flush myoglobin in early rhabdomyolysis — and its expansion of plasma volume before the diuresis makes it unsafe in established heart failure. Acetazolamide inhibits carbonic anhydrase, causing bicarbonate wasting and a metabolic acidosis that is exploited in three niches: glaucoma (reducing aqueous humour formation), altitude sickness (the acidosis drives ventilation before acclimatisation), and alkalinisation of the urine, for example alongside cystinuria stones or salicylate poisoning.",
      },

      { type: "heading", level: 2, text: "Clinical practice: why diuresis fails" },
      {
        type: "paragraph",
        text: "When oedema becomes resistant, the causes are pharmacodynamic and adherence-related before they are exotic: salt and fluid intake exceed the prescribed ceiling, renal perfusion is poor so the drug never reaches its segment, non-steroidal drugs are being taken, or the downstream nephron has hypertrophied and reabsorbs the sodium the loop leaves behind. The answers follow the pharmacology — restrict salt, add an agent that acts downstream (a thiazide to the loop), check the adherence, review the interacting drugs, and only then escalate doses. Daily weights are the most reliable bedside measure of the response, and a rising creatinine during diuresis demands the fluid balance be reconsidered before the next dose.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Prescribing a loop diuretic for ankle oedema from amlodipine. That oedema is capillary leakage from arteriolar dilation, not sodium retention; the diuretic depletes potassium and volume while doing nothing for the swelling.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Stacking an ACE inhibitor, spironolactone and trimethoprim and being surprised by hyperkalaemia. Each blocks potassium loss — the RAS blockade, the mineralocorticoid receptor, and the epithelial sodium channel that trimethoprim inhibits as an amiloride-like side effect — and an elderly patient with renal impairment can arrive at seven without any single drug being misused.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Running the thiazide dose up to chase oedema. Thiazides plateau: beyond the equivalent of a small dose of bendroflumethiazide the blood-pressure effect stops growing while hyponatraemia and gout risk climb.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting that a potassium-sparing diuretic merely balances loss elsewhere. Amiloride's hyperkalaemia is a predictable intention in the fixed combination with furosemide, not an allergic accident — but in a patient on a RAS blocker and with chronic kidney disease it is the one addition that must be potassium-checked first.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does adding a thiazide to a loop diuretic produce a diuresis greater than either drug alone?",
        answer: "Blocking the loop leaves 20 to 25 per cent of filtered sodium delivered to the distal convoluted tubule, which compensates by reabsorbing more through the sodium-chloride cotransporter. Blocking that transporter with a thiazide closes the escape route, so the diuresis is sequential nephron blockade rather than an additive effect of two similar drugs.",
        explanation: "The escape of downstream segments is why high-dose monotherapy plateaus, and why combination targets different segments rather than the same one harder.",
      },
      {
        type: "question",
        prompt: "Why is furosemide the drug of choice for acute pulmonary oedema rather than a thiazide?",
        answer: "The loop of Henle reabsorbs 25 per cent of filtered sodium against a thiazide's 5 to 10 per cent, so a loop diuretic has by far the larger ceiling, and given intravenously it acts within five minutes. Pulmonary oedema needs a rapid, large natriuresis that a thiazide cannot deliver.",
        explanation: "Ceiling and onset are the two pharmacology facts that pick the class in an emergency; chronic blood pressure control trades them for tolerability with a thiazide.",
      },
      {
        type: "question",
        prompt: "A patient on furosemide for heart failure suddenly loses the diuresis and her weight rises. Which common drugs blunt the effect?",
        answer: "Non-steroidal anti-inflammatory drugs. They inhibit renal prostaglandins that maintain afferent arteriolar perfusion, so less drug is delivered to the tubule and sodium retention follows — the same drugs also risk the triple whammy of renal impairment with an ACE inhibitor and a diuretic.",
        explanation: "Asking about over-the-counter analgesia is the highest-yield question in a diuretic that has stopped working.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which transporter is inhibited by furosemide?",
        options: [
          "The sodium-chloride cotransporter of the distal convoluted tubule",
          "The sodium-potassium-2 chloride cotransporter of the thick ascending limb",
          "The epithelial sodium channel of the collecting duct",
          "Carbonic anhydrase of the proximal tubule",
        ],
        correctIndex: 1,
        explanation: "Loop diuretics block the sodium-potassium-2 chloride cotransporter in the thick ascending limb, where 25 per cent of filtered sodium is reabsorbed — the largest ceiling of any diuretic class. The sodium-chloride cotransporter is the thiazide target and the epithelial sodium channel the amiloride target.",
      },
      {
        type: "mcq",
        stem: "Which metabolic disturbance is characteristic of thiazide diuretics rather than loop diuretics?",
        options: ["Hypocalcaemia", "Hypomagnesaemia", "Hypercalcaemia", "Metabolic acidosis"],
        correctIndex: 2,
        explanation: "Thiazides retain calcium, causing hypercalcaemia (which is exploited in stone prevention) whereas loops waste calcium and magnesium. Metabolic alkalosis accompanies both classes.",
      },
      {
        type: "mcq",
        stem: "A patient with heart failure takes furosemide, ramipril and spironolactone. Which electrolyte must be monitored most carefully?",
        options: ["Sodium", "Potassium", "Calcium", "Chloride"],
        correctIndex: 1,
        explanation: "All three raise or waste potassium: the loop drives it down, while the RAS blockade and mineralocorticoid antagonism push it up. The combination is deliberately used, so the potassium defines the monitoring interval.",
      },
      {
        type: "mcq",
        stem: "Which diuretic has a demonstrated mortality benefit in heart failure?",
        options: ["Furosemide", "Bendroflumethiazide", "Spironolactone", "Acetazolamide"],
        correctIndex: 2,
        explanation: "Spironolactone (and eplerenone) reduced mortality and hospitalisation in severe heart failure by blocking aldosterone's fibrotic and potassium-wasting effects. The other three relieve congestion or pressure without changing survival.",
      },
      {
        type: "mcq",
        stem: "Which adverse effect is characteristic of spironolactone but not eplerenone?",
        options: ["Hyperkalaemia", "Gynaecomastia", "Hyponatraemia", "Hypercalcaemia"],
        correctIndex: 1,
        explanation: "Spironolactone antagonises the progesterone receptor as well as the mineralocorticoid receptor, producing painful gynaecomastia and menstrual irregularity; eplerenone is selective and shares only the shared hyperkalaemia risk. Hypercalcaemia belongs to thiazides.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Module 1 SBA items — one per concept, authored and machine-checked.
// ---------------------------------------------------------------------------
const MODULE_ONE_SBAS: SbaSeed[] = [
  {
    slug: "pharmacology-foundations--drugs-receptors-response--sba",
    concept: "drugs-receptors-response",
    stem: "A patient with asthma is given a non-selective beta-blocker for palpitations and wheezes. What is the mechanism?",
    options: [
      "The drug directly irritates the airways",
      "Beta-two adrenoceptors in the bronchi are blocked, removing the sympathetic bronchodilator drive",
      "The drug causes histamine release from mast cells",
      "The drug acts as a partial agonist only at cardiac receptors",
    ],
    correctAnswer: "Beta-two adrenoceptors in the bronchi are blocked, removing the sympathetic bronchodilator drive",
    explanation:
      "The effect is determined by the receptor and its tissue distribution, not by the drug: beta-2 receptors dilate the bronchi under sympathetic stimulation, so blocking them removes that drive — the reason a cardioselective beta-one antagonist is preferred in airway disease.",
    difficulty: "medium",
  },
  {
    slug: "pharmacology-foundations--pharmacodynamics-receptors--sba",
    concept: "pharmacodynamics-receptors",
    stem: "What happens to the dose-response curve of a full agonist when a competitive antagonist is added?",
    options: [
      "It shifts to the left and the maximum rises",
      "It shifts to the right, and the maximum is unchanged",
      "It shifts downwards, with the maximum reduced",
      "It is unchanged if the antagonist has any affinity",
    ],
    correctAnswer: "It shifts to the right, and the maximum is unchanged",
    explanation:
      "Competitive antagonism raises the apparent EC50 because more agonist is needed to occupy the same fraction of receptors, but a sufficiently high agonist concentration still achieves the same Emax. A fall in the maximum is non-competitive antagonism.",
    difficulty: "easy",
  },
  {
    slug: "pharmacology-foundations--absorption-distribution--sba",
    concept: "absorption-distribution",
    stem: "A drug has a volume of distribution of about 400 litres in a 70 kg adult. What does that imply?",
    options: [
      "The drug is confined to the blood and extracellular fluid",
      "The drug is extensively bound to fat or tissue protein, so its plasma concentration is low relative to the total amount in the body",
      "The drug is not absorbed after oral administration",
      "The drug is not protein-bound",
    ],
    correctAnswer:
      "The drug is extensively bound to fat or tissue protein, so its plasma concentration is low relative to the total amount in the body",
    explanation:
      "The volume of distribution is a ratio (amount in the body divided by plasma concentration) and can exceed any anatomical compartment. A very large volume implies a tissue reservoir — and therefore a large loading dose, and poor removal by dialysis.",
    difficulty: "medium",
  },
  {
    slug: "pharmacology-foundations--metabolism-excretion--sba",
    concept: "metabolism-excretion",
    stem: "A patient taking rifampicin for tuberculosis loses the effect of their oral contraceptive. What is the mechanism?",
    options: [
      "The contraceptive is not absorbed from the gut",
      "Enzyme induction by rifampicin accelerates the metabolism of the contraceptive hormones, lowering their blood level",
      "Inhibition of CYP450 by rifampicin raises the hormone level too far",
      "The contraceptive is displaced from albumin by rifampicin",
    ],
    correctAnswer: "Enzyme induction by rifampicin accelerates the metabolism of the contraceptive hormones, lowering their blood level",
    explanation:
      "Rifampicin induces cytochrome P450 synthesis, so contraceptive hormones are metabolised faster and their concentration falls. Induction takes days to act and persists for weeks after the drug stops, so contraceptive failure can occur even after the rifampicin has finished.",
    difficulty: "medium",
  },
  {
    slug: "pharmacology-foundations--therapeutics-index-development--sba",
    concept: "therapeutics-index-development",
    stem: "What is the primary purpose of a Phase I clinical trial?",
    options: [
      "To establish efficacy against a placebo",
      "To establish safety, tolerability and pharmacokinetics in 20 to 100 healthy volunteers",
      "To compare the new drug with the current standard treatment",
      "To detect rare adverse reactions",
    ],
    correctAnswer: "To establish safety, tolerability and pharmacokinetics in 20 to 100 healthy volunteers",
    explanation:
      "Phase I trials use small numbers of healthy volunteers to answer the safety and pharmacokinetic questions. Efficacy answers come in Phase II and III, and rare reactions are detected in the post-marketing Phase IV pharmacovigilance phase.",
    difficulty: "easy",
  },
  {
    slug: "pharmacology-foundations--autonomic-pharmacology--sba",
    concept: "autonomic-pharmacology",
    stem: "A patient develops dry mouth, constipation, urinary retention, blurred vision and a fast pulse after starting a new drug. Which class is most likely responsible?",
    options: [
      "A beta-agonist such as salbutamol",
      "An antimuscarinic drug blocking muscarinic M2 and M3 receptors",
      "A non-selective alpha-blocker",
      "An acetylcholinesterase inhibitor",
    ],
    correctAnswer: "An antimuscarinic drug blocking muscarinic M2 and M3 receptors",
    explanation:
      "The whole set is the antimuscarinic profile: dry mouth (blocked salivary glands), constipation and urinary retention (blocked gut and bladder M3), blurred vision and dilated pupils, and tachycardia from cardiac M2 blockade. An acetylcholinesterase inhibitor produces the opposite set — salivation, diarrhoea, bradycardia and sweating.",
    difficulty: "medium",
  },
];

// ---------------------------------------------------------------------------
// Deeper modules 2-5: a real concept spine, tracked-placeholder lessons.
// ---------------------------------------------------------------------------
const DEEPER_LESSONS: LessonSeed[] = [
  // --- M2 Autonomic pharmacology ---
  { title: "Cholinergic drugs & cholinesterase inhibitors", module: 2, estimatedMinutes: 35, authored: false, concept: { title: "Cholinergic drugs and cholinesterase inhibitors", slug: "cholinergic-drugs", summary: "Direct muscarinic agonists, the short and long-acting cholinesterase inhibitors, the irreversible organophosphate poisoning and its specific antidotes.", blooms: "apply", minutes: 35, prereq: ["autonomic-pharmacology"] }, content: { blocks: [] } },
  { title: "Anticholinergic drugs", module: 2, estimatedMinutes: 30, authored: false, concept: { title: "Anticholinergic drugs", slug: "anticholinergic-drugs", summary: "Atropine, ipratropium, oxybutynin and hyoscine, their indications, and the acute anticholinergic syndrome.", blooms: "apply", minutes: 35, prereq: ["autonomic-pharmacology"] }, content: { blocks: [] } },
  { title: "Sympathomimetics in detail", module: 2, estimatedMinutes: 35, authored: false, concept: { title: "Sympathomimetics", slug: "sympathomimetics", summary: "The distinction between direct, indirect and mixed-acting sympathomimetics, and the pharmacology of the decongestants and the drugs of abuse.", blooms: "apply", minutes: 35, prereq: ["autonomic-pharmacology"] }, content: { blocks: [] } },
  { title: "Beta-blockers in detail", module: 2, estimatedMinutes: 35, authored: false, concept: { title: "Beta-adrenoceptor antagonists", slug: "beta-blockers", summary: "Cardioselectivity, the first- through third-generation agents, partial agonism, and the pharmacology of beta-blocker withdrawal.", blooms: "analyze", minutes: 35, prereq: ["autonomic-pharmacology"] }, content: { blocks: [] } },
  { title: "Skeletal muscle relaxants & neuromuscular blockers", module: 2, estimatedMinutes: 35, authored: false, concept: { title: "Neuromuscular blocking agents", slug: "neuromuscular-blockers", summary: "Depolarising and non-depolarising blockers, their use in anaesthesia, and the reversal of non-depolarising block.", blooms: "apply", minutes: 35, prereq: ["autonomic-pharmacology"] }, content: { blocks: [] } },

  // --- M3 Cardiovascular & renal pharmacology ---
  { title: "Drugs for hypertension", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "Antihypertensive drugs", slug: "antihypertensives", summary: "The main drug classes, their mechanisms, the fixed-dose combinations, and the management of a hypertensive emergency.", blooms: "apply", minutes: 40, prereq: ["beta-blockers"] }, content: lesson7() as never },
  { title: "Drugs for heart failure & arrhythmias", module: 3, estimatedMinutes: 35, authored: true, concept: { title: "Drugs for heart failure and arrhythmia", slug: "heart-failure-arrhythmias", summary: "Digoxin, diuretics, ACE inhibitors and beta-blockers in failure, and the Vaughan Williams classification of antiarrhythmics.", blooms: "apply", minutes: 35, prereq: ["antihypertensives"] }, content: lesson10() as never },
  { title: "Lipid-lowering drugs", module: 3, estimatedMinutes: 30, authored: false, concept: { title: "Lipid-lowering agents", slug: "lipid-lowering", summary: "Statins, ezetimibe, fibrates and PCSK9 inhibitors, their mechanisms, and their monitoring.", blooms: "understand", minutes: 30, prereq: [] }, content: { blocks: [] } },
  { title: "Diuretics", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "Diuretic drugs", slug: "diuretics", summary: "Loop, thiazide and potassium-sparing diuretics, their site of action, and the electrolyte consequences.", blooms: "apply", minutes: 40, prereq: ["heart-failure-arrhythmias"] }, content: lesson9() as never },
  { title: "Anticoagulants & thrombolytics", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "Anticoagulants and thrombolytics", slug: "anticoagulants-thrombolytics", summary: "Heparin, warfarin, the direct oral anticoagulants, antiplatelet drugs, and the reversal agents.", blooms: "apply", minutes: 40, prereq: [] }, content: lesson8() as never },
  { title: "Drugs for angina, shock & resuscitation", module: 3, estimatedMinutes: 35, authored: false, concept: { title: "Drugs for angina, shock and resuscitation", slug: "antianginal-resuscitation", summary: "Nitrates, calcium-channel blockers, beta-blockers in angina, and the drug sequence in an arrest algorithm.", blooms: "apply", minutes: 35, prereq: ["heart-failure-arrhythmias"] }, content: { blocks: [] } },

  // --- M4 Antimicrobial & anti-infective pharmacology ---
  { title: "Principles of antimicrobial chemotherapy", module: 4, estimatedMinutes: 45, authored: true, concept: { title: "Principles of antimicrobial therapy", slug: "antimicrobial-principles", summary: "Bactericidal versus bacteriostatic action, spectrum, empiric versus targeted therapy, the prevention of resistance and antibiotic stewardship.", blooms: "apply", minutes: 45, prereq: ["drugs-receptors-response"] }, content: lesson11() as never },
  { title: "Cell wall and protein synthesis inhibitors", module: 4, estimatedMinutes: 45, authored: true, concept: { title: "Cell wall and protein synthesis inhibitors", slug: "cell-wall-protein-inhibitors", summary: "Penicillins, beta-lactamase inhibitors, cephalosporins, glycopeptides, macrolides, tetracyclines and aminoglycosides and their toxicities.", blooms: "apply", minutes: 45, prereq: ["antimicrobial-principles"] }, content: lesson12() as never },
  { title: "DNA synthesis & folate antagonists", module: 4, estimatedMinutes: 30, authored: false, concept: { title: "Nucleic acid and folate antagonists", slug: "nucleic-acid-antagonists", summary: "Trimethoprim, sulfonamides, quinolones and rifamycins, and their interactions with folate metabolism and DNA synthesis.", blooms: "understand", minutes: 30, prereq: ["antimicrobial-principles"] }, content: { blocks: [] } },
  { title: "Antifungal, antiviral & antiparasitic drugs", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Antifungal, antiviral and antiparasitic drugs", slug: "antifungal-antiviral-antiparasitic", summary: "Polyenes, azoles and echinocandins; the antiretrovirals and the antimalarials; and the reasons antimalarial regimens are combination-based.", blooms: "apply", minutes: 40, prereq: ["antimicrobial-principles"] }, content: { blocks: [] } },
  { title: "Antituberculous therapy & leprosy", module: 4, estimatedMinutes: 30, authored: false, concept: { title: "Antituberculous therapy", slug: "antituberculous", summary: "The four first-line drugs, the rationale for combination therapy and drug resistance, and their individual toxicities.", blooms: "apply", minutes: 30, prereq: ["antimicrobial-principles"] }, content: { blocks: [] } },
  { title: "Antimicrobial resistance & stewardship", module: 4, estimatedMinutes: 35, authored: false, concept: { title: "Antimicrobial resistance and stewardship", slug: "antimicrobial-resistance", summary: "Mechanisms of resistance, the global problem of multi-resistant organisms, and how stewardship programmes reduce it.", blooms: "analyze", minutes: 35, prereq: ["antimicrobial-principles"] }, content: { blocks: [] } },

  // --- M5 CNS, endocrine & special systems ---
  { title: "General anaesthesia", module: 5, estimatedMinutes: 40, authored: true, concept: { title: "General anaesthesia", slug: "general-anaesthesia", summary: "Induction agents, volatile agents, opioids and muscle relaxants in anaesthesia, and the stages of anaesthesia.", blooms: "apply", minutes: 40, prereq: ["beta-blockers"] }, content: lesson14() as never },
  { title: "Analgesics: opioids and non-opioids", module: 5, estimatedMinutes: 40, authored: true, concept: { title: "Analgesic drugs", slug: "analgesics", summary: "Opioids and their receptors, the non-opioid analgesics including paracetamol and NSAIDs, and the WHO analgesic ladder.", blooms: "apply", minutes: 40, prereq: ["general-anaesthesia"] }, content: lesson13() as never },
  { title: "Epilepsy, neurodegeneration, migraine", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Drugs for epilepsy and neurodegenerative disease", slug: "antiepileptics-neurodegeneration", summary: "The antiepileptic drugs, their mechanisms, teratogenicity and interactions; and the drugs used in Parkinson's disease, dementia and myasthenia.", blooms: "apply", minutes: 40, prereq: ["general-anaesthesia"] }, content: { blocks: [] } },
  { title: "Psychiatric drugs", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Psychiatric drugs", slug: "psychiatric-drugs", summary: "Antidepressants, antipsychotics, mood stabilisers and anxiolytics, their mechanisms and their characteristic toxicities.", blooms: "apply", minutes: 35, prereq: ["antiepileptics-neurodegeneration"] }, content: { blocks: [] } },
  { title: "Endocrine pharmacology", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Endocrine pharmacology", slug: "endocrine-pharmacology", summary: "Insulin and oral hypoglycaemics, corticosteroid therapy, thyroid and calcium homeostasis, and hormonal therapy in cancer.", blooms: "apply", minutes: 40, prereq: [] }, content: { blocks: [] } },
  { title: "Chemotherapy, special systems & biopharmaceuticals", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Chemotherapy, immunosuppression and biopharmaceuticals", slug: "chemotherapy-immunotherapy", summary: "Cytotoxic and targeted anticancer therapy, immunosuppressants including calcineurin inhibitors, and monoclonal antibodies.", blooms: "analyze", minutes: 40, prereq: ["endocrine-pharmacology"] }, content: { blocks: [] } },
];

export const PHARMACOLOGY: SubjectSeed = {
  id: "course-pharmacology",
  slug: "pharmacology-foundations",
  title: "Pharmacology & Therapeutics — From Receptor to Prescription",
  code: "PHRM 202",
  department: "Pharmacology & Therapeutics",
  level: 200,
  credits: 3,
  semester: "second",
  description:
    "How a drug works and how the body works on it: receptor theory, pharmacokinetics and metabolism, drug development and safe prescribing, and then the autonomic nervous system as the proving ground for the whole field.",
  faculty: "basic-medical-sciences",
  modules: MODULES,
  lessons: [
    { title: "What pharmacology is: drugs, receptors & the body's response", module: 1, estimatedMinutes: 30, authored: true, concept: { title: "Drugs, receptors and the body's response", slug: "drugs-receptors-response", summary: "The two halves of pharmacology, the four receptor families, and the principle that the receptor and its tissue distribution determine a drug's effect and side effects.", blooms: "remember", minutes: 30, prereq: [] }, content: lesson1() as never },
    { title: "Pharmacodynamics: receptors, agonists & antagonists", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Pharmacodynamics: agonists and antagonists", slug: "pharmacodynamics-receptors", summary: "Affinity and intrinsic activity, the four classes of drug at a receptor, the log dose-response curve, spare receptors and the therapeutic index.", blooms: "understand", minutes: 40, prereq: ["drugs-receptors-response"] }, content: lesson2() as never },
    { title: "Pharmacokinetics I: absorption & distribution", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Pharmacokinetics I: absorption and distribution", slug: "absorption-distribution", summary: "Routes and bioavailability, the first-pass effect, the volume of distribution as a tool for calculating the loading dose, protein binding and the blood-brain barrier.", blooms: "understand", minutes: 40, prereq: ["drugs-receptors-response"] }, content: lesson3() as never },
    { title: "Pharmacokinetics II: metabolism & excretion", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Pharmacokinetics II: metabolism and excretion", slug: "metabolism-excretion", summary: "Phase I and phase II metabolism, the cytochrome P450 system with its induction and inhibition, half-life and steady state, and zero-order elimination.", blooms: "apply", minutes: 40, prereq: ["absorption-distribution"] }, content: lesson4() as never },
    { title: "Therapeutics: therapeutic index, drug development & prescribing", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Therapeutics: index, development and prescribing", slug: "therapeutics-index-development", summary: "The therapeutic window and therapeutic drug monitoring, the four phases of drug development and their questions, and the prescription that is safe.", blooms: "apply", minutes: 40, prereq: ["metabolism-excretion"] }, content: lesson5() as never },
    { title: "Autonomic pharmacology", module: 1, estimatedMinutes: 45, authored: true, concept: { title: "Autonomic pharmacology", slug: "autonomic-pharmacology", summary: "The sympathetic and parasympathetic divisions and their receptors, the adrenergic and muscarinic drug classes, and the two catecholamines in clinical use.", blooms: "apply", minutes: 45, prereq: ["pharmacodynamics-receptors"] }, content: lesson6() as never },
    ...DEEPER_LESSONS,
  ],
  sbas: MODULE_ONE_SBAS,
  prereqCourses: ["physiology-cell-and-general"],
};

export async function seedMbbsPharmacology() {
  return seedMbbsCourse(PHARMACOLOGY);
}

/** Idempotent: safe to run repeatedly; upserts on stable keys. */
export async function seedPharmacology(): Promise<void> {
  await seedMbbsPharmacology();
}

export default PHARMACOLOGY;

// CLI usage: npx ts-node prisma/seed-courses/mbbs/pharmacology.ts
if (process.argv[1] && process.argv[1].includes("mbbs/pharmacology")) {
  seedPharmacology()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
