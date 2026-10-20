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
  { title: "Drugs for hypertension", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Antihypertensive drugs", slug: "antihypertensives", summary: "The main drug classes, their mechanisms, the fixed-dose combinations, and the management of a hypertensive emergency.", blooms: "apply", minutes: 40, prereq: ["beta-blockers"] }, content: { blocks: [] } },
  { title: "Drugs for heart failure & arrhythmias", module: 3, estimatedMinutes: 35, authored: false, concept: { title: "Drugs for heart failure and arrhythmia", slug: "heart-failure-arrhythmias", summary: "Digoxin, diuretics, ACE inhibitors and beta-blockers in failure, and the Vaughan Williams classification of antiarrhythmics.", blooms: "apply", minutes: 35, prereq: ["antihypertensives"] }, content: { blocks: [] } },
  { title: "Lipid-lowering drugs", module: 3, estimatedMinutes: 30, authored: false, concept: { title: "Lipid-lowering agents", slug: "lipid-lowering", summary: "Statins, ezetimibe, fibrates and PCSK9 inhibitors, their mechanisms, and their monitoring.", blooms: "understand", minutes: 30, prereq: [] }, content: { blocks: [] } },
  { title: "Diuretics", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Diuretic drugs", slug: "diuretics", summary: "Loop, thiazide and potassium-sparing diuretics, their site of action, and the electrolyte consequences.", blooms: "apply", minutes: 40, prereq: ["heart-failure-arrhythmias"] }, content: { blocks: [] } },
  { title: "Anticoagulants & thrombolytics", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Anticoagulants and thrombolytics", slug: "anticoagulants-thrombolytics", summary: "Heparin, warfarin, the direct oral anticoagulants, antiplatelet drugs, and the reversal agents.", blooms: "apply", minutes: 40, prereq: [] }, content: { blocks: [] } },
  { title: "Drugs for angina, shock & resuscitation", module: 3, estimatedMinutes: 35, authored: false, concept: { title: "Drugs for angina, shock and resuscitation", slug: "antianginal-resuscitation", summary: "Nitrates, calcium-channel blockers, beta-blockers in angina, and the drug sequence in an arrest algorithm.", blooms: "apply", minutes: 35, prereq: ["heart-failure-arrhythmias"] }, content: { blocks: [] } },

  // --- M4 Antimicrobial & anti-infective pharmacology ---
  { title: "Principles of antimicrobial chemotherapy", module: 4, estimatedMinutes: 45, authored: false, concept: { title: "Principles of antimicrobial therapy", slug: "antimicrobial-principles", summary: "Bactericidal versus bacteriostatic action, spectrum, empiric versus targeted therapy, the prevention of resistance and antibiotic stewardship.", blooms: "apply", minutes: 45, prereq: ["drugs-receptors-response"] }, content: { blocks: [] } },
  { title: "Cell wall and protein synthesis inhibitors", module: 4, estimatedMinutes: 45, authored: false, concept: { title: "Cell wall and protein synthesis inhibitors", slug: "cell-wall-protein-inhibitors", summary: "Penicillins, beta-lactamase inhibitors, cephalosporins, glycopeptides, macrolides, tetracyclines and aminoglycosides and their toxicities.", blooms: "apply", minutes: 45, prereq: ["antimicrobial-principles"] }, content: { blocks: [] } },
  { title: "DNA synthesis & folate antagonists", module: 4, estimatedMinutes: 30, authored: false, concept: { title: "Nucleic acid and folate antagonists", slug: "nucleic-acid-antagonists", summary: "Trimethoprim, sulfonamides, quinolones and rifamycins, and their interactions with folate metabolism and DNA synthesis.", blooms: "understand", minutes: 30, prereq: ["antimicrobial-principles"] }, content: { blocks: [] } },
  { title: "Antifungal, antiviral & antiparasitic drugs", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Antifungal, antiviral and antiparasitic drugs", slug: "antifungal-antiviral-antiparasitic", summary: "Polyenes, azoles and echinocandins; the antiretrovirals and the antimalarials; and the reasons antimalarial regimens are combination-based.", blooms: "apply", minutes: 40, prereq: ["antimicrobial-principles"] }, content: { blocks: [] } },
  { title: "Antituberculous therapy & leprosy", module: 4, estimatedMinutes: 30, authored: false, concept: { title: "Antituberculous therapy", slug: "antituberculous", summary: "The four first-line drugs, the rationale for combination therapy and drug resistance, and their individual toxicities.", blooms: "apply", minutes: 30, prereq: ["antimicrobial-principles"] }, content: { blocks: [] } },
  { title: "Antimicrobial resistance & stewardship", module: 4, estimatedMinutes: 35, authored: false, concept: { title: "Antimicrobial resistance and stewardship", slug: "antimicrobial-resistance", summary: "Mechanisms of resistance, the global problem of multi-resistant organisms, and how stewardship programmes reduce it.", blooms: "analyze", minutes: 35, prereq: ["antimicrobial-principles"] }, content: { blocks: [] } },

  // --- M5 CNS, endocrine & special systems ---
  { title: "General anaesthesia", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "General anaesthesia", slug: "general-anaesthesia", summary: "Induction agents, volatile agents, opioids and muscle relaxants in anaesthesia, and the stages of anaesthesia.", blooms: "apply", minutes: 40, prereq: ["beta-blockers"] }, content: { blocks: [] } },
  { title: "Analgesics: opioids and non-opioids", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Analgesic drugs", slug: "analgesics", summary: "Opioids and their receptors, the non-opioid analgesics including paracetamol and NSAIDs, and the WHO analgesic ladder.", blooms: "apply", minutes: 40, prereq: ["general-anaesthesia"] }, content: { blocks: [] } },
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
