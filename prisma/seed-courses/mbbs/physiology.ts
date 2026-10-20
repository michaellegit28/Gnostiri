import {
  pendingLesson,
  prisma,
  seedMbbsCourse,
  type LessonSeed,
  type SbaSeed,
  type SubjectSeed,
} from "./spine";

/**
 * PHYS 101 — Human Physiology.
 *
 * Module 1 ("Cell & general physiology") is authored in full: 6 lessons in the
 * pilot-report format with one SBA item per concept. The facts are the ones
 * every pre-clinical course teaches and that are measured on USMLE Step 1 —
 * the -70 mV resting potential, the 300 mOsm plasma, the three-sodium/two-
 * potassium pump stoichiometry, the -55 mV threshold, the calcium-triggered
 * acetylcholine release at the neuromuscular junction — and no number appears
 * that is not a standard textbook value.
 *
 * Modules 2-6 (blood, cardiovascular, respiratory, renal, gastrointestinal/
 * endocrine/reproductive) ship as a real concept spine and prerequisite DAG
 * with tracked-placeholder lessons (needsCheck true).
 *
 * The course row created by prisma/seed-university.ts is adopted rather than
 * duplicated, so the authored 5-mark EMQ items in
 * prisma/seed-assessment-physiology.ts stay attached to it.
 */

const COURSE_SLUG = "physiology-cell-and-general";

const MODULES = [
  { slug: "cell-general-physiology", title: "M1 — Cell & general physiology" },
  { slug: "blood-haemostasis-immunity", title: "M2 — Blood, haemostasis & immunity" },
  { slug: "cardiovascular-physiology", title: "M3 — Cardiovascular physiology" },
  { slug: "respiratory-physiology", title: "M4 — Respiratory physiology" },
  { slug: "renal-body-fluids", title: "M5 — Renal & body fluids" },
  { slug: "gi-endocrine-reproduction", title: "M6 — Gastrointestinal, endocrine & reproductive physiology" },
];

// ---------------------------------------------------------------------------
// LESSON 1 — Homeostasis and negative feedback (fully authored)
// ---------------------------------------------------------------------------
function lesson1() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define homeostasis and explain why it is the organising idea of physiology; describe the four components of a feedback loop and arrange them in order; distinguish negative from positive feedback and give a physiological example of each; explain what a set point is and how feedforward control differs from feedback; and predict what a clinician measures to decide whether a feedback loop is intact.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "None. This is the first lesson of the physiology course. No prior biology is assumed.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Homeostasis",
        text: "The maintenance of a relatively stable internal environment — of temperature, pH, blood glucose, and the concentrations of ions and water — in the face of an external environment that changes constantly.",
      },
      {
        type: "paragraph",
        text: "The nineteenth-century physiologist Claude Bernard put it simply: the constancy of the internal environment is the condition for a free and independent life. Your cells live in a fluid whose composition is being held steady while you run, sleep, eat, drink, fast and shiver. Physiology is the study of the machinery doing the holding — and almost all of that machinery is built from the same reusable pattern, the feedback loop. If you learn one pattern in this course, learn this one, because you will meet it in every system.",
      },

      { type: "heading", level: 2, text: "The four components of a loop" },
      {
        type: "paragraph",
        text: "A feedback loop has four parts, and the order is fixed: a sensor detects the variable, a control centre compares what was detected with the set point and calculates the difference, an effector acts to change the variable, and the sensor then detects the result. That last step is what closes the loop — which is why it is called feedback rather than simply control.",
      },
      {
        type: "table",
        headers: ["Component", "Job", "Example: body temperature"],
        rows: [
          ["Sensor", "Detects the current value of the variable", "Thermoreceptors in the skin and in the hypothalamus"],
          ["Control centre", "Compares the value with the set point and computes the error", "The preoptic area of the hypothalamus (set point about 37 degrees C)"],
          ["Effector", "Changes the variable to reduce the error", "Sweat glands, skin blood vessels, skeletal muscle (shivering)"],
          ["Feedback", "Reports the new value back to the sensor", "Sweating cools the skin, the thermoreceptors report a falling temperature, and sweating stops"],
        ],
      },
      {
        type: "paragraph",
        text: "Work through a cold morning. Your skin thermoreceptors report a fall in temperature; the hypothalamus compares it with the set point and detects a negative error; the effectors respond — skin arterioles constrict, reducing blood flow and heat loss, and if the fall continues, skeletal muscle contracts in shivering to generate heat. As temperature returns towards the set point the error shrinks and the response weakens. The response is switched off by the very thing it is correcting.",
      },

      { type: "heading", level: 2, text: "Negative and positive feedback" },
      {
        type: "definition",
        term: "Negative feedback",
        text: "A response that opposes the change that triggered it, so the variable is pushed back towards its set point. It is stabilising, and it accounts for almost all of physiology.",
      },
      {
        type: "definition",
        term: "Positive feedback",
        text: "A response that amplifies the change that triggered it, driving the variable further from its starting point. It is rare, and it is always used to drive a process to completion rather than to hold a variable steady.",
      },
      {
        type: "table",
        headers: ["Feedback type", "Physiological examples", "Why the body uses it"],
        rows: [
          ["Negative", "Temperature, arterial blood pressure (baroreceptor reflex), blood glucose (insulin and glucagon), blood oxygen, plasma calcium (parathyroid hormone)", "To hold a variable at a steady value indefinitely"],
          ["Positive", "The upstroke of the action potential (sodium influx opens more sodium channels); the Ferguson reflex in labour (oxytocin, stronger contractions, more oxytocin); the clotting cascade (thrombin activates more thrombin)", "To drive a one-way event to a definite end point: a nerve fires, or a baby is delivered"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Positive feedback in physiology is not a runaway process: it always terminates when the task is complete and the trigger is removed. Oxytocin surges until delivery ends the stimulus, then stops. The word 'positive' describes the sign of the response, not its desirability.",
      },

      { type: "heading", level: 2, text: "Set points and feedforward control" },
      {
        type: "paragraph",
        text: "The set point is the value the control centre is defending, and it can be changed. In fever, bacterial products cause the hypothalamus to release prostaglandin E2, which raises the thermal set point; the body then defends the higher temperature by shivering (you feel cold and get chills) until it reaches the new value. That is why fever responds to drugs that block prostaglandin synthesis, and why the chills of a rising temperature stop abruptly when the temperature breaks.",
      },
      {
        type: "paragraph",
        text: "Feedforward control is the other pattern worth knowing: the body acts before the variable changes, using information that predicts the change rather than measuring the error. The sight and smell of food triggers salivation and a anticipatory insulin release before any glucose has entered the blood. Feedback corrects an error after it happens; feedforward anticipates it. Physiology uses both, and the two are easy to confuse in an examination.",
      },

      { type: "heading", level: 2, text: "Clinical correlation: what a clinician measures" },
      {
        type: "paragraph",
        text: "The bedside value of this idea is that a measurement tells you about a loop, not just a number. A blood pressure of 80/40 with a heart rate of 130 is the baroreceptor reflex doing exactly what it should: sensors in the carotid sinus and aortic arch detect the fall in pressure, activate sympathetic outflow, and raise heart rate and contractility in an attempt to restore it. The number is wrong; the loop is working. A patient in a diabetic autonomic neuropathy may have neither the tachycardia nor the pallor — a normal pulse in the face of shock is a sign of a broken loop, and it is far more worrying than a fast one.",
      },
      {
        type: "question",
        prompt: "A patient has a fever of 39 degrees C. Does that mean thermoregulation has failed?",
        answer: "No. The set point has been raised, and the body is now defending the higher temperature — which is why the patient shivers on the way up and sweats on the way down. Failure of thermoregulation is a different thing: a body that cannot generate heat (hypothyroid, severe old age) or cannot lose it (heat stroke, anticholinergic poisoning).",
        explanation: "Fever is a regulated elevation of the set point, not a loss of control — which is why the temperature oscillates around the higher value rather than drifting.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Describing the response as 'negative' because it feels unpleasant. The sign is mathematical: a response that opposes the change is negative. Shivering in response to cold is negative feedback, even though it is the response you feel.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying feedback is the same as feedforward. Feedback requires a measured change in the variable; feedforward anticipates it. Insulin released after a glucose rise is feedback; insulin released by the sight of food is feedforward.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Using 'homeostasis' to mean equilibrium. A corpse is at equilibrium. Homeostasis is the active, energy-consuming maintenance of a steady state far from equilibrium — which is why it fails when energy supply fails.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Name the four components of a feedback loop, in order.",
        answer: "Sensor, control centre (or integrator), effector, and the feedback return that reports the new value to the sensor.",
        explanation: "Order matters in an answer: the error is detected, compared, corrected and re-planned on the next cycle.",
      },
      {
        type: "question",
        prompt: "Which sequence correctly describes a negative-feedback loop, using body temperature as the example?",
        answer: "A sensor detects the deviation, a control centre compares it to the set point, and effectors reverse the deviation — skin thermoreceptors, the hypothalamus, then sweating or shivering.",
        explanation: "Negative feedback opposes the change that triggered it: sensor, control centre, effector, in that order. Amplifying loops (like childbirth) are positive feedback — the exception, not the rule.",
      },
      {
        type: "question",
        prompt: "Why is the clotting cascade described as positive feedback, and why is that not dangerous runaway amplification?",
        answer: "Because each activated clotting factor generates more of the next, which amplifies the original signal; and because the cascade is spatially limited to the wound surface and is opposed by anticoagulant pathways and by dilution in flowing blood.",
        explanation: "Positive feedback in physiology always terminates when its trigger is consumed — the burst of thrombin stops when the vessel is sealed and the exposed tissue factor is covered.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which statement best defines homeostasis?",
        options: [
          "A state in which all internal variables are equal to the external environment",
          "The active maintenance of a relatively stable internal environment in a changing external one",
          "The tendency of any system to move towards thermal equilibrium",
          "The process by which the body stores energy for later use",
        ],
        correctIndex: 1,
        explanation: "Homeostasis is the active, energy-requiring maintenance of a steady internal state. Equilibrium with the environment would mean death, and energy storage is a separate process.",
      },
      {
        type: "mcq",
        stem: "During a marathon, a runner's core temperature begins to rise. Which sequence correctly describes the response?",
        options: [
          "Skin thermoreceptors sense the rise; the hypothalamus compares it with the set point; sweat glands increase secretion and skin arterioles dilate, increasing heat loss",
          "Sweating begins before temperature changes, so no sensor is involved",
          "The set point is raised, so sweating is inhibited until the higher temperature is reached",
          "Shivering is triggered to generate heat and bring the temperature back down",
        ],
        correctIndex: 0,
        explanation: "This is negative feedback: sensor, control centre, effector. Shivering would add heat, and a raised set point describes fever, not exercise — though exercise can raise the defended level slightly.",
      },
      {
        type: "mcq",
        stem: "Which of these is an example of positive feedback in physiology?",
        options: [
          "The baroreceptor response to a fall in arterial pressure", "The release of oxytocin during labour", "Insulin secretion in response to a rise in blood glucose", "Vasoconstriction in response to cold",
        ],
        correctIndex: 1,
        explanation: "Oxytocin drives stronger contractions, which cause more oxytocin release — amplifying until delivery ends the stimulus. The other three oppose the change that triggered them, so they are negative feedback.",
      },
      {
        type: "mcq",
        stem: "In a patient with fever, why do chills typically stop once the temperature plateaus at its peak?",
        options: [
          "Because the infection has been cleared at that moment",
          "Because the hypothalamus has returned to its original set point",
          "Because the new, higher temperature now matches the raised set point, so there is no error to correct",
          "Because shivering is limited by muscle fatigue",
        ],
        correctIndex: 2,
        explanation: "Fever is a regulated elevation: the body defends the new set point, so once it is reached the heat-generating response stops and the patient instead feels hot.",
      },
      {
        type: "mcq",
        stem: "A patient whose blood pressure is 70/50 has a pulse of 130 per minute. What does the tachycardia indicate?",
        options: [
          "That the heart has been damaged and will soon fail", "That the baroreceptor reflex is intact and is compensating for the fall in pressure", "That the patient is not hypovolaemic", "That the sympathetic nervous system is inactive",
        ],
        correctIndex: 1,
        explanation: "A fast pulse in shock is the compensatory reflex working. A normal pulse with shock — as in diabetic autonomic neuropathy or after beta-blockade — suggests the loop itself has failed.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Homeostasis is the active maintenance of a stable internal environment, and the machinery that does it is almost always a feedback loop: sensor, control centre, effector, and a return signal that reports the result. Negative feedback opposes the change that triggered it and holds a variable steady; positive feedback amplifies it and drives a process to a definite end. Set points can be shifted — as in fever — and feedforward control anticipates change rather than correcting it.",
      },
      {
        type: "paragraph",
        text: "Next: transport across cell membranes. Before any feedback loop can work, material has to cross a barrier, and the cell membrane solves that with four distinct mechanisms whose energy costs are the subject of the next lesson.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 2 — Transport across cell membranes (fully authored)
// ---------------------------------------------------------------------------
function lesson2() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the lipid bilayer and explain why it is selectively permeable; distinguish passive transport (simple diffusion, facilitated diffusion, osmosis) from active transport (primary and secondary) and name which mechanisms consume ATP; state the stoichiometry of the sodium-potassium pump and explain why it matters so much; trace the mechanism of sodium-linked glucose transport and predict the effect of removing sodium; and predict what happens to a cell placed in a hypo-, iso- or hypertonic solution.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (Homeostasis and negative feedback). You need the idea that the internal environment has a defended composition, because transport is how that composition is defended.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Selective permeability",
        text: "The property of a membrane that lets some substances cross freely and others only with help, and still others not at all — because the lipid bilayer is a fatty barrier that dissolves small uncharged molecules but repels ions and polar solutes.",
      },
      {
        type: "paragraph",
        text: "The membrane is a layer of fat two molecules thick. Everything about transport follows from that one fact. Things that dissolve in fat — oxygen, carbon dioxide, nitrogen, ethanol — slip straight through without any assistance. Things that do not — sodium, potassium, calcium, chloride, glucose, amino acids, and water itself to a surprising degree — are confronted by a barrier that will not let them pass by themselves. The cell must therefore build specific protein machines, and each of those machines has a cost, a direction, and a mechanism.",
      },

      { type: "heading", level: 2, text: "The passive mechanisms" },
      {
        type: "table",
        headers: ["Mechanism", "What crosses", "Energy source", "Direction"],
        rows: [
          ["Simple diffusion", "O2, CO2, N2, lipophilic molecules, some water", "The concentration gradient itself", "Down the gradient, towards equilibrium"],
          ["Facilitated diffusion", "Glucose (GLUT transporters), ions through channels (Na+, K+, Cl-, Ca2+)", "The electrochemical gradient itself — no ATP", "Down the electrochemical gradient, through a specific protein"],
          ["Osmosis", "Water", "A difference in water concentration — a difference in osmolarity", "Towards the side with the higher concentration of impermeant solute"],
          ["Bulk flow", "Water and everything dissolved in it", "Hydrostatic pressure differences", "Along the pressure gradient — the basis of capillary exchange"],
        ],
      },
      {
        type: "paragraph",
        text: "Two clarifications that are constantly examined. First, facilitated diffusion needs a protein but no energy: the glucose transporter GLUT1 is a door that swings open when glucose is bound on the side where glucose is more abundant, and shuts when it is bound on the other — it never moves glucose uphill against a gradient. Second, osmosis is not the transport of water by the water so much as the movement of water away from solute: water moves towards whichever solution has more impermeant particles, so to say 'water moves towards the higher solute concentration' is correct, and 'water moves down its own concentration gradient' is the same statement from the water's point of view.",
      },

      { type: "heading", level: 2, text: "Worked example 1: the sodium-potassium pump" },
      {
        type: "paragraph",
        text: "The sodium-potassium ATPase is the most important machine in the cell, and it is worth being precise about what it does. For every molecule of ATP it hydrolyses, it pumps three sodium ions out of the cell and two potassium ions in — both against their concentration gradients.",
      },
      {
        type: "table",
        headers: ["Fact", "Value", "Why it matters"],
        rows: [
          ["Stoichiometry", "3 Na+ out : 2 K+ in : 1 ATP", "It is electrogenic: one net charge leaves the cell per cycle, so it makes the inside a few millivolts more negative directly"],
          ["Share of the cell's energy", "A large fraction of basal metabolism — up to a quarter in some cells", "Most of your resting calories are spent maintaining gradients, not moving or growing"],
          ["Gradient it builds", "High Na+ outside, high K+ inside", "This sodium gradient is stored energy used by secondary transport, by nerve and muscle excitation, and by the kidney"],
        ],
      },
      {
        type: "paragraph",
        text: "The pump is therefore doing three jobs at once, and each is examined separately. It keeps cell volume stable, because without it sodium would leak in and water would follow by osmosis, swelling the cell until it burst. It is electrogenic, contributing a small direct share of the membrane potential. And most importantly it stores energy in the sodium gradient, which is then spent by every secondary transporter in the body — the kidney reabsorbing glucose from the tubular fluid, the gut absorbing amino acids, the heart cell extruding calcium.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Cardiac glycosides such as digoxin and ouabain inhibit this pump. They are therapeutic in heart failure precisely because blocking the pump raises intracellular sodium in heart muscle, which reduces the sodium gradient, which reduces calcium extrusion by the sodium-calcium exchanger, so more calcium stays inside the cell and contraction strengthens.",
      },

      { type: "heading", level: 2, text: "Worked example 2: secondary active transport and SGLT" },
      {
        type: "paragraph",
        text: "Secondary active transport spends the sodium gradient instead of ATP. Sodium-linked glucose transporter 1 (SGLT1) in the intestinal mucosa and in the renal proximal tubule binds two sodium ions and one glucose molecule, and lets sodium flow down its gradient while dragging glucose with it — so glucose can be absorbed from the gut even when its concentration in the lumen exceeds that in the blood.",
      },
      {
        type: "paragraph",
        text: "This is the mechanism behind oral rehydration therapy, one of the most effective public-health measures in history: glucose in the solution is absorbed along with sodium, and water follows osmotically. It is also the mechanism targeted by SGLT2 inhibitors in diabetes — blocking glucose reabsorption in the proximal tubule makes the kidney excrete glucose in the urine.",
      },
      {
        type: "table",
        headers: ["Transporter", "Location", "What it moves", "Note"],
        rows: [
          ["SGLT1", "Small intestine, renal proximal tubule (S3)", "2 Na+ : 1 glucose", "The high-affinity, high-capacity glucose transporter in the gut"],
          ["SGLT2", "Renal proximal tubule (S1/S2)", "1 Na+ : 1 glucose", "The target of the diabetes drugs dapagliflozin and empagliflozin"],
          ["Sodium-calcium exchanger (NCX)", "Cardiac and other excitable cells", "3 Na+ in : 1 Ca2+ out", "Forward or reverse depending on the membrane potential and gradients"],
          ["Sodium-hydrogen exchanger", "Renal proximal tubule", "1 Na+ in : 1 H+ out", "How the kidney excretes acid and reclaims sodium and bicarbonate"],
        ],
      },

      { type: "heading", level: 2, text: "Tonicity: what happens when you put a cell in a solution" },
      {
        type: "table",
        headers: ["Solution", "What is outside", "What happens to the cell", "Clinical example"],
        rows: [
          ["Hypotonic", "Lower osmolarity than the cell (distilled water, 0.45% saline)", "Water moves in, the cell swells, red cells burst (haemolysis)", "Water intoxication; excessive hyponatraemic fluid"],
          ["Isotonic", "Same osmolarity as the cell (0.9% saline, about 300 mOsm/L)", "No net water movement; the cell keeps its shape", "The fluid given intravenously to replace plasma volume"],
          ["Hypertonic", "Higher osmolarity than the cell (3% saline, concentrated glucose)", "Water moves out, the cell shrinks and crenates", "Mannitol used to draw water out of a swollen brain"],
        ],
      },
      {
        type: "paragraph",
        text: "One distinction is worth making carefully, because it is a favourite examination question. Osmolarity counts all solute particles in a solution. Tonicity counts only the particles that cannot cross the membrane — the effective osmolarity. A solution of urea at the same osmolarity as plasma is hypotonic in effect, because urea crosses cell membranes freely and therefore does not hold water on its side of the membrane at all. Glucose is not freely permeable and is therefore an effective osmole, until insulin lets it into a cell — which is why a saline solution of 5% glucose behaves as isotonic initially and then as hypotonic once the glucose has been metabolised.",
      },
      {
        type: "question",
        prompt: "Why is 0.9% saline given to a bleeding patient, rather than distilled water?",
        answer: "Because distilled water is strongly hypotonic to plasma: water would rush into the red cells by osmosis and they would haemolyse. 0.9% saline has about the same osmolarity as plasma (about 300 mOsm/L), so it can expand the circulating volume without destroying the cells in it.",
        explanation: "Intravenous fluids are designed around tonicity, not just osmolarity: the goal is to add volume without changing the effective osmotic balance of the blood.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying facilitated diffusion uses ATP because it needs a protein. The protein is a catalyst or a pore; the energy comes entirely from the gradient. It is passive transport.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing SGLT1 and SGLT2 stoichiometry. SGLT1 takes two sodium ions with one glucose and is the high-affinity transporter of the intestine; SGLT2 takes one sodium with one glucose and is the low-affinity, high-capacity transporter of the proximal tubule — and the drug target.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying water diffuses freely through the lipid bilayer. Some water crosses directly, but most crosses through dedicated water channels (aquaporins), which is why the kidney and the red cell can move water so quickly.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Which of these transport processes directly consumes ATP?",
        answer: "The sodium-potassium pump moving Na+ out of and K+ into the cell against their gradients.",
        explanation: "Only active transport against a gradient needs ATP directly. Diffusion, osmosis and facilitated carriers all ride the gradient — the pump is what builds and holds that gradient in the first place.",
      },
      {
        type: "question",
        prompt: "How does removing sodium from the intestinal lumen affect glucose absorption?",
        answer: "It stops it. SGLT1 couples glucose transport to sodium moving down its gradient; without the sodium gradient, glucose cannot be driven uphill against its own gradient.",
        explanation: "This is the basis of oral rehydration solution: glucose and sodium must be present together for absorption to occur, and the water follows.",
      },
      {
        type: "question",
        prompt: "What is the difference between osmolarity and tonicity?",
        answer: "Osmolarity counts all dissolved solute particles. Tonicity counts only those that cannot cross the membrane and therefore determine water movement — the effective osmolarity.",
        explanation: "Urea is an osmole but not an effective osmole, which is why an iso-osmolar urea solution is hypotonic in practice.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which process is NOT passive transport?",
        options: [
          "Oxygen diffusing across the pulmonary capillary endothelium",
          "Glucose crossing a muscle cell membrane through GLUT4",
          "The renal tubular reabsorption of glucose from the tubular fluid into the cell",
          "Water moving into a red cell placed in distilled water",
        ],
        correctIndex: 2,
        explanation: "Renal glucose reabsorption is secondary active transport: SGLT2 uses the sodium gradient to drive glucose uphill. The other three are all passive — diffusion, facilitated diffusion and osmosis respectively.",
      },
      {
        type: "mcq",
        stem: "What is the stoichiometry of the sodium-potassium ATPase per molecule of ATP hydrolysed?",
        options: [
          "2 Na+ out, 3 K+ in", "3 Na+ out, 2 K+ in", "1 Na+ out, 1 K+ in", "3 Na+ in, 2 K+ out",
        ],
        correctIndex: 1,
        explanation: "Three sodium ions out and two potassium ions in per ATP — electrogenic, because one net positive charge leaves the cell each cycle. The direction is out against sodium's gradient, not in.",
      },
      {
        type: "mcq",
        stem: "A red blood cell is placed in a solution with a higher solute concentration than its interior. What happens?",
        options: [
          "The cell swells and bursts", "Water leaves the cell and it shrinks (crenates)", "Sodium enters the cell until the concentrations equalise", "Nothing, because red cells have no transport proteins",
        ],
        correctIndex: 1,
        explanation: "Water moves towards the higher concentration of impermeant solute, so it leaves the cell and the cell shrinks. A cell placed in a hypotonic solution would swell and haemolyse.",
      },
      {
        type: "mcq",
        stem: "Why is the sodium gradient described as stored energy?",
        options: [
          "Because sodium ions carry more energy than potassium ions",
          "Because secondary active transporters use sodium moving down its gradient to drive other solutes uphill",
          "Because sodium stores energy in the form of ATP",
          "Because the sodium gradient generates the resting membrane potential on its own",
        ],
        correctIndex: 1,
        explanation: "The gradient is a reservoir: the pump spends ATP to build it and secondary transporters spend it — SGLT1, SGLT2, the sodium-calcium exchanger, the sodium-hydrogen exchanger, and the neurotransmitter transporters.",
      },
      {
        type: "mcq",
        stem: "Which statement about facilitated diffusion is correct?",
        options: [
          "It requires ATP hydrolysis", "It moves solutes against their electrochemical gradient", "It is saturable and specific, and moves solutes down their gradient", "It can occur across any lipid bilayer, so no protein is needed",
        ],
        correctIndex: 2,
        explanation: "Facilitated diffusion is specific, saturable (it has a transport maximum) and passive: the driving force is the electrochemical gradient, not ATP.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The membrane is a fatty barrier, so what crosses is decided by chemistry: small uncharged molecules diffuse through the lipid, ions and polar solutes need proteins. Passive transport — simple diffusion, facilitated diffusion, osmosis — rides gradients and costs no ATP; active transport moves solutes uphill and pays for it. The sodium-potassium ATPase, at three sodium out and two potassium in per ATP, is both electrogenic and the builder of the sodium gradient that every secondary transporter spends. Tonicity, not osmolarity alone, decides which way water moves.",
      },
      {
        type: "paragraph",
        text: "Next: the resting membrane potential. You will find out why the inside of a nerve cell sits at about minus seventy millivolts, and how a membrane permeable to a charged ion turns a concentration difference into a voltage.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 3 — Resting membrane potential (fully authored)
// ---------------------------------------------------------------------------
function lesson3() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the ionic concentration differences across the cell membrane and say which ions are in the majority inside and outside; explain how the potassium leak channels and the Goldman equation produce a resting potential of about minus seventy millivolts; state the Nernst equilibrium potentials for potassium and sodium; explain the direct electrogenic contribution of the sodium-potassium ATPase; and predict how changing extracellular potassium changes the resting potential, and why that is clinically dangerous.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 2 (Transport across cell membranes). You need the sodium-potassium pump, the idea of a concentration gradient, and the existence of ion channels.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Resting membrane potential",
        text: "The voltage difference across the membrane of an unstimulated excitable cell — about minus 70 millivolts in a neuron, with the inside negative relative to the outside.",
      },
      {
        type: "paragraph",
        text: "Here is the puzzle. Inside a nerve cell potassium is concentrated about fortyfold over the outside, and the cell membrane at rest is far more permeable to potassium than to anything else. So potassium leaks out. But potassium leaving carries positive charge away, so the inside becomes negative. That electrical negativity pulls potassium back in. The two effects balance, and the balance voltage — the point at which the outward chemical push is exactly cancelled by the inward electrical pull — is the potassium equilibrium potential, about minus ninety millivolts. The resting potential is close to it but slightly less negative, because a small amount of sodium leaks in and pulls it up towards the sodium equilibrium potential of about plus sixty.",
      },

      { type: "heading", level: 2, text: "The ionic landscape" },
      {
        type: "table",
        headers: ["Ion", "Intracellular (approx.)", "Extracellular (approx.)", "Equilibrium potential (approx.)"],
        rows: [
          ["Potassium (K+)", "150 mmol/L", "4.5 mmol/L", "About -90 mV"],
          ["Sodium (Na+)", "10-15 mmol/L", "145 mmol/L", "About +60 to +66 mV"],
          ["Chloride (Cl-)", "Low", "110 mmol/L", "Close to the resting potential"],
          ["Calcium (Ca2+)", "Extremely low in the cytosol", "About 1.2 mmol/L ionised", "Very positive, well over +100 mV"],
        ],
      },
      {
        type: "paragraph",
        text: "Read the table as a set of stored gradients. Potassium is almost at equilibrium at rest, because the membrane is permeable to it. Sodium is massively out of equilibrium, because the membrane is not very permeable to it — and that non-equilibrium is the stored energy that drives the action potential and secondary transport. Calcium is a thousandfold from equilibrium, which is why cells have evolved so many ways to keep it out and why its rapid entry can be used as a signal, as in cardiac muscle contraction.",
      },

      { type: "heading", level: 2, text: "Worked example: how a concentration gradient becomes a voltage" },
      {
        type: "paragraph",
        text: "Follow the logic step by step, because it is the single most important chain of reasoning in excitable-tissue physiology.",
      },
      {
        type: "paragraph",
        text: "Step one: at rest, most of the open channels in a nerve membrane are potassium leak channels, so potassium permeability is roughly fifty to a hundred times greater than sodium permeability. Step two: potassium, at high concentration inside, diffuses out through those channels. Step three: each potassium ion that leaves takes one positive charge out of the cell, so the inside becomes negative with respect to the outside. Step four: that negative interior attracts positive potassium ions back, and at some voltage the electrical pull exactly balances the chemical push out. That voltage is the potassium equilibrium potential, and for the concentrations above the Nernst equation gives about minus ninety millivolts.",
      },
      {
        type: "paragraph",
        text: "Step five, and this is the part that is usually forgotten: a few sodium ions leak in, and because sodium's equilibrium potential is very positive, its small permeability pulls the membrane potential towards plus sixty. The actual resting potential is the weighted average of the equilibrium potentials, weighted by permeability — which is what the Goldman-Hodgkin-Katz equation formalises. Because potassium dominates the weights, the answer lands at about minus seventy, close to potassium's value but not equal to it. Step six: the sodium-potassium pump adds a small direct contribution, a few millivolts, purely because it moves three positive charges out for every two it moves in.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Concentration differences alone do not make a voltage. A gradient across an impermeable membrane has no electrical consequence. It is the combination of a gradient and an open channel that produces a voltage — and only for the ion that can pass.",
      },

      { type: "heading", level: 2, text: "Clinical correlation: potassium and the heart" },
      {
        type: "paragraph",
        text: "The resting potential of cardiac muscle depends on the potassium gradient, and the gradient depends on plasma potassium. In hyperkalaemia — a raised plasma potassium, seen in renal failure, in potassium-sparing diuretic use, and in the breakdown of large amounts of tissue — the gradient is reduced, so the resting potential becomes less negative: the cell moves closer to the threshold for firing.",
      },
      {
        type: "paragraph",
        text: "The consequence is paradoxical and clinically crucial. The resting membrane is excitably closer to threshold, which initially seems harmless, but the voltage-gated sodium channels are still in their closed state and the inactivation process that follows firing is now abnormal: the cells cannot generate proper action potentials, so conduction slows, the ECG shows peaked T waves and widened QRS complexes, and the heart can stop in diastole. Hypokalaemia is the opposite problem: the resting potential becomes more negative, the cell is further from threshold, and the ECG shows flattened T waves and prominent U waves, with a risk of dangerous arrhythmias.",
      },
      {
        type: "table",
        headers: ["Disturbance", "Effect on the resting potential", "ECG signature"],
        rows: [
          ["Hyperkalaemia (high extracellular K+)", "Less negative — closer to threshold, but sodium channel inactivation is disturbed", "Tall, peaked T waves; widened QRS; risk of asystole"],
          ["Hypokalaemia (low extracellular K+)", "More negative — further from threshold", "Flattened T waves, prominent U waves, prolonged QT; risk of torsades de pointes"],
          ["Hypocalcaemia", "Threshold effects rather than resting potential: sodium channels open more easily at a given voltage", "Prolonged QT interval (the ST segment is lengthened), tetany"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the resting potential is caused by the sodium-potassium pump. The pump builds and maintains the gradients, but the potential itself is produced by potassium diffusing out through leak channels. Inhibiting the pump abolishes the gradients and the cell gradually becomes depolarised — over hours, not immediately, which is exactly how dying tissue behaves.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Describing the inside as positive at rest. It is negative, about minus seventy millivolts in a typical neuron — and in skeletal muscle about minus eighty to minus ninety. If you find yourself writing plus seventy, you have inverted the sign convention.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying sodium leaks out. Sodium leaks IN, down its steep inward gradient, and its inward leak is what makes the resting potential slightly less negative than the potassium equilibrium potential.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What sets a neuron's resting membrane potential at about -70 mV?",
        answer: "Potassium leaking out through open K+ channels, with the membrane far more permeable to K+ than Na+ at rest.",
        explanation: "Leak K+ channels dominate at rest; K+ diffuses out, leaving fixed negative charges behind, until the electrical pull balances the chemical gradient — the Nernst balance the potassium equilibrium potential formalises.",
      },
      {
        type: "question",
        prompt: "Why is the resting potential not exactly the potassium equilibrium potential?",
        answer: "Because the membrane is slightly permeable to sodium too, and sodium's equilibrium potential is very positive, so its inward leak pulls the membrane potential to about minus seventy rather than the potassium value of about minus ninety. The pump's three-to-two stoichiometry adds a few millivolts more.",
        explanation: "The resting potential is a permeability-weighted compromise among the equilibrium potentials, not a single Nernst value.",
      },
      {
        type: "question",
        prompt: "A patient with chronic kidney disease has a plasma potassium of 7.5 mmol/L. What does that do to ventricular muscle, and why is it lethal?",
        answer: "The reduced potassium gradient makes the resting potential less negative. Cardiac cells cannot then inactivate and recover their sodium channels normally, so conduction becomes blocked, the ECG widens, and the heart may arrest in diastole.",
        explanation: "This is why hyperkalaemia is treated as an emergency — with calcium to stabilise the membrane, insulin and glucose to drive potassium into cells, and definitive potassium removal.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which ion's permeability dominates the resting membrane potential?",
        options: ["Sodium", "Potassium", "Chloride", "Calcium"],
        correctIndex: 1,
        explanation: "Potassium permeability at rest is roughly fifty to a hundred times sodium permeability, because the leak channels that are open at rest are mostly potassium channels. The resting potential therefore lies close to the potassium equilibrium potential.",
      },
      {
        type: "mcq",
        stem: "The potassium equilibrium potential is approximately:",
        options: ["-70 mV", "-90 mV", "+60 mV", "0 mV"],
        correctIndex: 1,
        explanation: "With potassium at about 150 mmol/L inside and 4.5 mmol/L outside, the Nernst equation gives about -90 mV. The resting potential of about -70 mV is the permeability-weighted compromise with sodium.",
      },
      {
        type: "mcq",
        stem: "Why does the sodium-potassium pump contribute directly to the membrane potential?",
        options: [
          "Because it opens sodium channels as it works",
          "Because it is electrogenic: three sodium ions out for every two potassium ions in, leaving one net negative charge inside per cycle",
          "Because it hydrolyses ATP and generates electricity directly",
          "Because it pumps chloride out of the cell",
        ],
        correctIndex: 1,
        explanation: "The 3:2 stoichiometry moves one net positive charge out per cycle, so it makes the interior a few millivolts more negative directly — in addition to building the gradients on which the potential really depends.",
      },
      {
        type: "mcq",
        stem: "In hyperkalaemia, what happens to the resting potential of cardiac muscle?",
        options: [
          "It becomes more negative, so the cells are harder to excite",
          "It becomes less negative, but normal sodium channel inactivation cannot occur, so conduction fails",
          "It is unchanged, because potassium cannot cross the membrane",
          "It becomes more negative and the QT interval shortens",
        ],
        correctIndex: 1,
        explanation: "A reduced potassium gradient brings the resting potential closer to threshold, but the sodium channels cannot cycle properly, so conduction deteriorates — the mechanism behind the peaked T waves, wide QRS and cardiac arrest of hyperkalaemia.",
      },
      {
        type: "mcq",
        stem: "Which statement correctly explains why a concentration gradient alone does not create a voltage?",
        options: [
          "Because ions are too heavy to move", "Because an electrical potential requires charge separation, which requires movement across the membrane through an open channel", "Because concentration and voltage are unrelated quantities", "Because the membrane is charged on both sides already",
        ],
        correctIndex: 1,
        explanation: "A gradient across an impermeable membrane produces no charge separation. The voltage appears only when an ion moves through a channel, taking its charge across.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "At rest the membrane is a biased potassium leak: potassium diffuses out down its steep gradient until the negative interior balances the chemical push, giving an equilibrium potential near minus ninety millivolts. Sodium's small inward leak pulls the value to about minus seventy, and the pump's three-for-two exchange adds a few millivolts directly. Changing extracellular potassium therefore changes the resting potential — which is why potassium disturbances produce the ECG changes and arrhythmias they do.",
      },
      {
        type: "paragraph",
        text: "Next: the action potential. You will see what happens when a voltage-gated sodium channel opens, why the response is all-or-none, and why a nerve cannot fire twice in quick succession.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 4 — Action potential and conduction (fully authored)
// ---------------------------------------------------------------------------
function lesson4() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: name the voltage-gated channels responsible for each phase of the action potential and the order in which they open; state the threshold potential and explain what 'all-or-none' means; describe the absolute and relative refractory periods and the channel states that cause them; explain how local current spread propagates an impulse and why myelination makes conduction faster; and distinguish conduction block from demyelination in a clinical nerve disorder.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 3 (Resting membrane potential). You need the resting potential, the ionic gradients, and the idea of a voltage-gated channel.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Action potential",
        text: "A self-propagating wave of depolarisation and repolarisation that travels along the membrane of an excitable cell, produced by the sequential opening of voltage-gated sodium and then voltage-gated potassium channels.",
      },
      {
        type: "paragraph",
        text: "The nerve at rest holds sodium out by building a large gradient and keeping the membrane nearly impermeable to it. That is a battery waiting to be used. The action potential is what using it looks like: at a threshold voltage, sodium channels open en masse, sodium rushes in down its steep gradient, and the inside of the cell swings to about plus thirty millivolts in less than a millisecond. The channels then inactivate, potassium channels open, and the membrane returns to rest — overshooting slightly on the way. The whole event is a brief, stereotyped spike of about one to two milliseconds, and it is identical in size every time it happens.",
      },

      { type: "heading", level: 2, text: "The phases, and what causes each one" },
      {
        type: "table",
        headers: ["Phase", "Membrane potential", "Channels responsible", "Mechanism"],
        rows: [
          ["Rest", "About -70 mV", "Potassium leak channels open; voltage-gated channels shut", "Potassium outward leak against a small inward sodium leak"],
          ["Depolarisation to threshold", "Rising to about -55 mV", "A few voltage-gated sodium channels open", "A local stimulus opens a small number of sodium channels; if the depolarisation reaches threshold, the rest follows"],
          ["Upstroke", "Rapid rise to about +30 mV", "Voltage-gated sodium channels open in large numbers (activation)", "Positive feedback: sodium influx depolarises, which opens more sodium channels"],
          ["Repolarisation", "Fall back towards rest", "Sodium channels inactivate; voltage-gated potassium channels open", "The delayed potassium channels let potassium out, restoring the negative interior"],
          ["Hyperpolarisation (undershoot)", "Briefly below -70 mV, towards -90 mV", "Potassium channels slow to close", "Potassium efflux continues after the sodium channels have already shut"],
        ],
      },
      {
        type: "paragraph",
        text: "Two details in that table carry the explanation for everything else. First, the sodium channel has two gates: an activation gate that opens on depolarisation and an inactivation gate that closes a moment later. A channel is conductive only while the activation gate is open and the inactivation gate is not closed. Second, the potassium channels are slower, which is why the return to rest is delayed and why the membrane undershoots.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The upstroke is a positive feedback loop: sodium in, more depolarisation, more sodium channels open, more sodium in. It is the same mathematical structure as the clotting cascade — an amplifying loop that runs until its substrate is exhausted or a negative term intervenes.",
      },

      { type: "heading", level: 2, text: "Worked example 1: all-or-none" },
      {
        type: "paragraph",
        text: "Push the membrane a little below threshold and nothing happens: a few sodium channels open, sodium enters, but not enough to trigger the rest, and the potassium leak simply cancels the depolarisation. Push to threshold — about minus fifty-five millivolts — and the same input opens enough channels to reach the point where depolarisation itself opens more channels faster than they close. The upstroke is then unstoppable and reaches the same peak every time.",
      },
      {
        type: "paragraph",
        text: "So an action potential has no half-size. A stimulus either reaches threshold or it does not. The consequence is that information cannot be encoded in the size of the spike: a loud sound, a bright light, a painful pinch all produce spikes of the same amplitude. What differs is the frequency — how many impulses per second — and the number of fibres recruited. The nervous system encodes intensity in numbers, not in sizes.",
      },

      { type: "heading", level: 2, text: "Worked example 2: the refractory periods" },
      {
        type: "table",
        headers: ["Period", "Channel state", "Can a second action potential be triggered?", "What ensures"],
        rows: [
          ["Absolute refractory period", "Sodium channels are open or inactivated and cannot be reopened", "No, whatever the stimulus", "The impulse travels one way only; the fibre cannot fire again until it has recovered"],
          ["Relative refractory period", "Sodium channels have recovered but the delayed potassium channels are still open", "Only with a stronger-than-normal stimulus", "The potassium efflux opposes the next depolarisation, raising the effective threshold"],
        ],
      },
      {
        type: "paragraph",
        text: "Both periods are essential. The absolute refractory period guarantees that an impulse travels in one direction only: the membrane it has just left is inexcitable, so it cannot be re-excited by the current spreading backwards. It also sets an upper limit on firing frequency, because the fibre must recover before it can fire again — a few hundred impulses per second at most, and slower in most fibres. The relative refractory period sets a lower limit on the interval between a pair of impulses.",
      },

      { type: "heading", level: 2, text: "Worked example 3: how conduction works" },
      {
        type: "paragraph",
        text: "An action potential does not physically travel down the fibre like a train. It re-ignites at successive positions along the membrane. At the site of the spike, positive charge has entered the cell, so the adjacent resting membrane is slightly depolarised; if that local current reaches threshold at the next patch of membrane, a new spike is generated there, and the impulse advances.",
      },
      {
        type: "paragraph",
        text: "That mechanism explains why myelination accelerates conduction so dramatically. Myelin, formed by Schwann cells in the periphery and oligodendrocytes centrally, is a fatty insulator wrapped around the axon in segments; current can only leave or enter the axon at the nodes of Ranvier, the small gaps between segments, where voltage-gated sodium channels are concentrated. The impulse effectively jumps from node to node — saltatory conduction — and conduction velocity in a myelinated fibre can be tens of metres per second, compared with about half a metre to a few metres per second in an unmyelinated one. Larger diameter helps too, because thicker axons have lower axial resistance.",
      },
      {
        type: "table",
        headers: ["Fibre property", "Effect on conduction velocity", "Reason"],
        rows: [
          ["Myelination", "Large increase — up to 120 m/s in the largest A-alpha fibres", "Saltatory conduction: current jumps between nodes, skipping insulated internodal membrane"],
          ["Axon diameter", "Increase, roughly proportional to diameter in myelinated fibres", "Lower axial resistance to the flow of current along the inside"],
          ["Temperature", "Increase with temperature up to a limit", "Faster channel kinetics — part of why cold limbs conduct more slowly"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Clinical correlation: multiple sclerosis is a demyelinating disease. The affected internodal membrane loses its insulation, current leaks away, and conduction fails — which is why symptoms improve with cooling and worsen with fever (the Uhthoff phenomenon), since a warmer axon has a shorter action potential and less reserve for a leaky membrane.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying potassium causes the rising phase. Sodium influx causes the rising phase; potassium efflux causes the falling phase. The potassium channels are slow to open and are the reason the spike has any width at all.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Thinking a bigger stimulus produces a bigger action potential. It cannot: the spike is all-or-none. A bigger stimulus produces more spikes (frequency) in more fibres, not larger ones.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the fibre can fire during the absolute refractory period if the stimulus is strong enough. It cannot — the sodium channels are inactivated, so no stimulus however large can reopen them. Strength of stimulus matters only in the relative refractory period.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What causes the rising (depolarising) phase of an action potential?",
        answer: "Rapid sodium influx through voltage-gated Na+ channels that open at threshold.",
        explanation: "Threshold opens Na+ channels; Na+ rushes in down its gradient and the inside swings toward +30 mV. K+ efflux then repolarises — the phase order is depolarise (Na+ in), repolarise (K+ out), hyperpolarise (K+ slow to close).",
      },
      {
        type: "question",
        prompt: "Why can an action potential not travel backwards along the membrane it has just crossed?",
        answer: "Because the membrane behind the impulse is in its absolute refractory period: the sodium channels there are inactivated and cannot be reopened until the membrane has repolarised.",
        explanation: "This is the same channel state that limits firing frequency — one mechanism, two consequences.",
      },
      {
        type: "question",
        prompt: "Why does demyelination slow or block conduction rather than merely slowing it?",
        answer: "Because myelin normally insulates the internodal membrane, so current is forced to jump from node to node. Without it, the current leaks away across the membrane instead of reaching the next node at threshold, so the impulse stalls.",
        explanation: "This is why multiple sclerosis produces discrete neurological deficits in the territory of the damaged tract rather than a uniform slowing of everything.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which ion influx causes the rising phase of the action potential?",
        options: ["Potassium", "Sodium", "Calcium", "Chloride"],
        correctIndex: 1,
        explanation: "Voltage-gated sodium channels open at threshold and sodium rushes in down its steep gradient. Potassium efflux follows and causes repolarisation.",
      },
      {
        type: "mcq",
        stem: "What is the threshold potential of a typical neuron?",
        options: ["About -90 mV", "About -55 mV", "About 0 mV", "About +30 mV"],
        correctIndex: 1,
        explanation: "About -55 mV: the voltage at which enough sodium channels open that the depolarising feedback becomes self-sustaining. Up to that point the response is electrotonic and dies out; beyond it, the spike fires.",
      },
      {
        type: "mcq",
        stem: "During which period can a second action potential be generated only by a stronger-than-normal stimulus?",
        options: ["The absolute refractory period", "The relative refractory period", "The undershoot only", "The resting period"],
        correctIndex: 1,
        explanation: "In the relative refractory period the sodium channels have recovered but the delayed potassium channels are still open, opposing depolarisation — so a stronger stimulus is needed.",
      },
      {
        type: "mcq",
        stem: "Which statement about saltatory conduction is correct?",
        options: [
          "It occurs in unmyelinated fibres where sodium channels are dense",
          "It occurs in myelinated fibres, where current jumps between the nodes of Ranvier",
          "It is slower than continuous conduction because the impulse must jump",
          "It requires calcium rather than sodium",
        ],
        correctIndex: 1,
        explanation: "Myelin insulates the internodal membrane and sodium channels cluster at the nodes, so the impulse jumps node to node — much faster than continuous conduction along unmyelinated membrane.",
      },
      {
        type: "mcq",
        stem: "A patient with multiple sclerosis notices symptoms worsen in a hot bath. What is the physiological explanation?",
        options: [
          "Heat opens potassium channels and hyperpolarises the axon",
          "Heat shortens the action potential, so a demyelinated axon with reduced safety factor fails to reach threshold at the next node",
          "Heat blocks sodium channels directly",
          "Heat increases myelin thickness and slows ion flow",
        ],
        correctIndex: 1,
        explanation: "The Uhthoff phenomenon: higher temperature shortens the action potential, reducing the charge available to depolarise the next node. A demyelinated axon has already lost its safety margin, so conduction fails.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "A stimulus that reaches threshold triggers a stereotyped spike: sodium channels open and sodium rushes in (depolarisation to about plus thirty), they then inactivate while slow potassium channels open (repolarisation), and the potassium channels are slow to close (a brief undershoot). The response is all-or-none, so intensity is encoded by frequency and recruitment rather than by size. The absolute refractory period makes conduction unidirectional and caps firing frequency; myelin accelerates conduction by forcing the impulse to jump between nodes of Ranvier, and losing that insulation is what blocks conduction in demyelinating disease.",
      },
      {
        type: "paragraph",
        text: "Next: the neuromuscular junction — the synapse at which the nerve's electrical signal is converted into a chemical message, and then back into an electrical one in the muscle.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 5 — Neuromuscular junction (fully authored)
// ---------------------------------------------------------------------------
function lesson5() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the structure of the neuromuscular junction and the sequence of events from nerve impulse to muscle contraction; state the quantal nature of neurotransmitter release and why calcium is the trigger; name the receptor type on the motor end plate and the ion that flows through it; explain how the transmitter is removed from the cleft; and identify three points in this chain where drugs or toxins act.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 4 (Action potential and conduction). You need the concept of a voltage-gated channel and of an all-or-none impulse arriving at the nerve terminal.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Neuromuscular junction",
        text: "The chemical synapse between a motor nerve terminal and a skeletal muscle fibre, separated by a gap of about fifty nanometres — the synaptic cleft — where the electrical signal is converted to a chemical one and back again.",
      },
      {
        type: "paragraph",
        text: "A nerve impulse and a muscle contraction are both electrical events, and they are separated by a gap the electricity cannot cross. So the nerve terminal converts its electrical signal into a chemical one: it releases a transmitter into the cleft, the transmitter diffuses across and binds to receptors on the muscle membrane, and those receptors let sodium into the muscle, starting a fresh action potential in the muscle fibre. Every stage of that chain is a drug target, which is the reason this one synapse is worth its own lesson.",
      },

      { type: "heading", level: 2, text: "The sequence of events" },
      {
        type: "table",
        headers: ["Step", "What happens", "Structure involved"],
        rows: [
          ["1", "An action potential arrives at the presynaptic nerve terminal", "The motor axon"],
          ["2", "The depolarisation opens voltage-gated calcium channels in the terminal membrane", "CaV2 channels, concentrated at the active zone"],
          ["3", "Calcium enters the terminal down its steep gradient", "The cytosol calcium concentration rises many-fold locally"],
          ["4", "Synaptic vesicles fuse with the terminal membrane and release acetylcholine by exocytosis", "SNARE proteins linking vesicle to membrane"],
          ["5", "Acetylcholine diffuses across the 50 nm cleft", "The synaptic cleft"],
          ["6", "Acetylcholine binds nicotinic receptors on the motor end plate", "Ligand-gated channels, concentrated at the folds of the end plate"],
          ["7", "The receptors open, letting sodium in and some potassium out — net depolarisation, the end-plate potential", "Nicotinic ACh receptors, non-selective cation channels"],
          ["8", "The end-plate potential exceeds the muscle threshold, triggering a muscle action potential that spreads along the fibre and into the T-tubules", "The sarcolemma and T-tubule system"],
          ["9", "Acetylcholine is broken down and its products are reclaimed", "Acetylcholinesterase in the cleft; choline reuptake into the nerve"],
        ],
      },
      {
        type: "paragraph",
        text: "Note which direction the chemical runs. The nerve talks to the muscle; the muscle never releases acetylcholine. Note also that the receptor on the muscle is itself an ion channel, so the chemical message is converted back into an electrical one without any intervening enzyme — a ligand-gated channel is a receptor and a pore in the same protein.",
      },

      { type: "heading", level: 2, text: "Worked example 1: quantal release" },
      {
        type: "paragraph",
        text: "Transmitter is released in packets. Each synaptic vesicle holds roughly ten thousand molecules of acetylcholine, and the release of one vesicle produces a tiny depolarisation called a miniature end-plate potential of well under a millivolt. An arriving action potential releases on the order of a hundred or more vesicles together, and the sum of those packets — the end-plate potential — is about fifty millivolts, comfortably above the threshold needed to fire a muscle action potential.",
      },
      {
        type: "paragraph",
        text: "That is the meaning of the safety factor. The nerve would need to fail by roughly two-thirds before the muscle did not contract, which is why neuromuscular transmission is so reliable, and also why the earliest symptoms of a transmission disorder appear in the muscles that are used most continuously — the eye and eyelid muscles — long before a muscle at rest is affected.",
      },

      { type: "heading", level: 2, text: "Worked example 2: why calcium is the trigger" },
      {
        type: "paragraph",
        text: "Calcium is used as the trigger in every chemical synapse in the body, for one reason: it is the one ion whose intracellular concentration is kept a thousandfold below the extracellular. A brief influx can therefore raise the local concentration enormously and quickly, and the machinery that docks the vesicles is exquisitely sensitive to it. When a nerve fires without calcium — as in the absence of extracellular calcium, or in the presence of magnesium which competes for entry — no transmitter is released at all, and the muscle stays silent despite the nerve conducting normally.",
      },

      { type: "heading", level: 2, text: "Clinical correlation: toxins and drugs on this one synapse" },
      {
        type: "table",
        headers: ["Agent", "Point of action", "Effect"],
        rows: [
          ["Botulinum toxin (Clostridium botulinum)", "Cleaves the SNARE proteins that dock vesicles, so vesicles cannot fuse", "No acetylcholine released; flaccid paralysis — the basis of both botulism and therapeutic Botox"],
          ["Curare, alpha-bungarotoxin, pancuronium", "Competitively block the nicotinic receptors on the end plate", "No end-plate potential; paralysis — historically the muscle relaxant, now the basis of safe anaesthesia"],
          ["Acetylcholinesterase inhibitors (neostigmine, pyridostigmine)", "Prevent breakdown of acetylcholine in the cleft, prolonging its action", "Improved transmission in myasthenia gravis; excess causes bradycardia and hyperstimulation"],
          ["Black widow spider venom", "Causes explosive vesicle release, then depletes the terminal", "Massive contraction followed by paralysis"],
        ],
      },
      {
        type: "question",
        prompt: "A muscle poisoned with curare still contracts when stimulated by an electrical impulse applied directly to the muscle fibre. Why?",
        answer: "Because the block is at the receptor, not in the muscle. The end-plate potential never forms, but the contractile machinery and the muscle action potential are intact — direct stimulation bypasses the failed synapse.",
        explanation: "This is the logic behind using nerve-versus-muscle stimulation to distinguish a postsynaptic block from a muscle disease or a neuropathy.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the nerve terminal releases sodium or calcium into the cleft. It releases acetylcholine; calcium enters the cell but is not released. Confusing intracellular calcium entry with extracellular transmitter release loses the whole mechanism.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying acetylcholine is removed from the cleft by reuptake into the nerve. It is broken down by acetylcholinesterase in the cleft into choline and acetate, and it is the choline that is taken back up.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Calling the end-plate receptor a voltage-gated channel. It is ligand-gated: it opens when acetylcholine binds, not when the membrane depolarises. The voltage-gated channels in this story belong to the nerve terminal and to the muscle sarcolemma.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What is the correct order of events at the neuromuscular junction?",
        answer: "Ca2+ entry into the nerve terminal triggers acetylcholine release into the cleft; ACh opens receptors on the motor end plate; an action potential fires in the muscle.",
        explanation: "Chemical transmission, not electrical: calcium in, ACh out, cleft crossing, end-plate receptor opening, end-plate potential, muscle action potential — every link in the chain is a drug target, from botulinum to curare.",
      },
      {
        type: "question",
        prompt: "Why does removing calcium from the solution bathing a neuromuscular preparation block contraction without blocking the nerve's action potential?",
        answer: "Because calcium entry at the terminal is the trigger for vesicle fusion. Without it, vesicles are not released, no end-plate potential forms, and the muscle never receives a signal — even though the nerve fires normally along its length.",
        explanation: "This is the classic demonstration separating conduction (electrical, sodium-dependent) from transmission (chemical, calcium-dependent).",
      },
      {
        type: "question",
        prompt: "What is the safety factor at the neuromuscular junction, and what does it explain clinically?",
        answer: "The end-plate potential is about fifty millivolts, well above the threshold needed to fire the muscle fibre, so the nerve would have to fail by a large margin before transmission failed. That is why patients with myasthenia gravis first notice weakness in eye and eyelid muscles rather than in resting muscles.",
        explanation: "A large safety factor means the synapse is reliable — and that its failure is a disease of the margins, felt first where transmission is used constantly.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which event directly triggers acetylcholine release from the motor nerve terminal?",
        options: [
          "Sodium entering the terminal", "Calcium entering the terminal through voltage-gated channels", "Potassium leaving the terminal", "Acetylcholine binding to the terminal's own receptors",
        ],
        correctIndex: 1,
        explanation: "Calcium influx is the trigger: vesicles are docked by SNARE proteins and fusion is calcium-sensitive. Sodium and potassium carry the action potential; they do not release transmitter directly.",
      },
      {
        type: "mcq",
        stem: "What type of channel is the nicotinic acetylcholine receptor on the motor end plate?",
        options: [
          "A voltage-gated sodium channel", "A ligand-gated non-selective cation channel", "A ligand-gated chloride channel", "A GPCR that works through a second messenger",
        ],
        correctIndex: 1,
        explanation: "It is a ligand-gated channel: binding two acetylcholine molecules opens a pore that passes sodium in and some potassium out, giving a net depolarising end-plate potential.",
      },
      {
        type: "mcq",
        stem: "How is acetylcholine removed from the synaptic cleft?",
        options: [
          "Reuptake into the presynaptic terminal", "Diffusion away into the bloodstream", "Enzymatic breakdown by acetylcholinesterase, with choline reuptake", "Degradation by monoamine oxidase",
        ],
        correctIndex: 2,
        explanation: "Acetylcholinesterase in the cleft hydrolyses it into choline and acetate; the choline is reclaimed by the nerve terminal for re-synthesis. Monoamine oxidase degrades catecholamines, not acetylcholine.",
      },
      {
        type: "mcq",
        stem: "What is the effect of botulinum toxin at the neuromuscular junction?",
        options: [
          "It blocks the nicotinic receptors on the end plate", "It prevents vesicle fusion by cleaving SNARE proteins, so no acetylcholine is released", "It inhibits acetylcholinesterase in the cleft", "It opens calcium channels at the terminal",
        ],
        correctIndex: 1,
        explanation: "Botulinum toxin cleaves the SNARE docking machinery, so vesicles cannot fuse — flaccid paralysis, and the basis of therapeutic Botox at low dose.",
      },
      {
        type: "mcq",
        stem: "Which statement about the end-plate potential is correct?",
        options: [
          "It is smaller than the muscle threshold, so several must summate", "It is much larger than the muscle threshold, giving transmission a safety factor", "It is an action potential identical to the muscle action potential", "It is produced by chloride efflux",
        ],
        correctIndex: 1,
        explanation: "The end-plate potential of roughly 50 mV far exceeds threshold, which is why transmission is normally reliable — and why the first symptoms of failure appear in continuously used muscles.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "At the neuromuscular junction, an arriving action potential opens voltage-gated calcium channels in the nerve terminal, calcium enters, and synaptic vesicles fuse and release acetylcholine into the fifty-nanometre cleft. Acetylcholine binds nicotinic receptors on the motor end plate, opening cation channels that depolarise the muscle fibre above threshold, and the transmitter is then destroyed by acetylcholinesterase. Each step of the chain — vesicle fusion, receptor binding, transmitter breakdown — is a drug target, which is why this synapse is so heavily exploited by both toxins and therapeutic drugs.",
      },
      {
        type: "paragraph",
        text: "Next: the clinical correlation lesson, where myasthenia gravis and the channelopathies show what happens when this machinery is attacked by antibodies or by a genetic fault in the channels themselves.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 6 — Clinical correlation: myasthenia gravis & channelopathies (fully authored)
// ---------------------------------------------------------------------------
function lesson6() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the autoimmune lesion in myasthenia gravis and explain why weakness worsens with use; distinguish it from Lambert-Eaton syndrome by the effect of repeated use; define a channelopathy and give two examples with their mechanism; explain why malignant hyperothermia is a channel disease of the muscle calcium-release channel; and predict the effect of an acetylcholinesterase inhibitor in myasthenia gravis and in Lambert-Eaton syndrome.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-5. You need the safety factor at the neuromuscular junction, the quantal release of acetylcholine, and the channel states of the action potential.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Neuromuscular transmission",
        text: "The conversion of a nerve impulse into a muscle contraction at the neuromuscular junction, which depends on a large safety factor: the end-plate potential is normally far above the threshold needed to fire the muscle.",
      },
      {
        type: "paragraph",
        text: "Transmission failure is a disease of margins, and the two autoimmune neuromuscular disorders fail in opposite directions. In myasthenia gravis the antibodies destroy the receptors themselves, so transmission fails with repeated use — a muscle works, gets tired, and stops working. In Lambert-Eaton syndrome the antibodies attack the calcium channels on the nerve terminal, so less transmitter is released at first, but repeated firing allows calcium to accumulate in the terminal and the response improves with use. Opposite clinical patterns, both from an antibody against a protein in the same synapse.",
      },

      { type: "heading", level: 2, text: "Myasthenia gravis" },
      {
        type: "paragraph",
        text: "Myasthenia gravis is an auto-antibody disease directed against the postsynaptic nicotinic acetylcholine receptors. Antibodies cross-link the receptors, accelerating their removal from the membrane and blocking the binding site, so the number of functional receptors on the end plate falls. Transmitter is still released normally, but with fewer receptors to bind it, the end-plate potential shrinks — and when it no longer reaches threshold, the muscle fibre fails to contract.",
      },
      {
        type: "table",
        headers: ["Feature", "Myasthenia gravis", "Lambert-Eaton myasthenic syndrome"],
        rows: [
          ["Site of the lesion", "Postsynaptic — nicotinic ACh receptors", "Presynaptic — voltage-gated calcium channels on the nerve terminal"],
          ["Effect on the end-plate potential", "Reduced, because fewer receptors", "Reduced at first, because less transmitter released"],
          ["Effect of repeated use", "Weakness worsens (fatigability)", "Strength improves transiently as calcium accumulates in the terminal"],
          ["Typical muscles first", "Extraocular and eyelid muscles — drooping eyelids, double vision, difficulty swallowing and speaking", "Proximal limb muscles — difficulty rising from a chair, climbing stairs"],
          ["Common associations", "Thymoma or thymic hyperplasia; other autoimmune disease", "Small-cell lung cancer in many cases"],
          ["Treatment", "Acetylcholinesterase inhibitors (pyridostigmine), immunosuppression, thymectomy", "Treating the tumour; amifampridine to prolong calcium channel opening; immunosuppression"],
        ],
      },
      {
        type: "paragraph",
        text: "The fatigability has a precise explanation, and it is worth understanding rather than memorising. Normal release declines slightly with each successive impulse, a normal physiological decrement. With a healthy safety factor, the end-plate potential remains above threshold despite the decline. In myasthenia the margin is already narrow, so a small normal decline takes it below threshold — and the muscle fails. That is why a patient can rise from a chair but not repeat the rise, and why the drooping eyelid is worse in the evening.",
      },
      {
        type: "question",
        prompt: "Why does an acetylcholinesterase inhibitor improve strength in myasthenia gravis but worsen symptoms in Lambert-Eaton syndrome?",
        answer: "In myasthenia the problem is a shortage of receptors, so prolonging the presence of acetylcholine in the cleft compensates. In Lambert-Eaton the problem is presynaptic — too little transmitter released — so allowing each molecule of transmitter to linger for longer adds little, and at high dose the receptors desensitise, making weakness worse.",
        explanation: "Both disorders weaken transmission, but the mechanism decides which intervention helps: a postsynaptic deficit is helped by more transmitter in the cleft, a presynaptic deficit is helped by more transmitter released.",
      },

      { type: "heading", level: 2, text: "Channelopathies" },
      {
        type: "definition",
        term: "Channelopathy",
        text: "A disease caused by a mutation or autoimmune attack on an ion channel, producing either a gain of channel function or a loss of it.",
      },
      {
        type: "table",
        headers: ["Disorder", "Channel affected", "Mechanism", "Clinical picture"],
        rows: [
          ["Myasthenia gravis", "Nicotinic ACh receptor (ligand-gated)", "Auto-antibodies destroy and remove the receptors", "Fluctuating weakness, ptosis, diplopia, dysphagia; worse with use"],
          ["Lambert-Eaton syndrome", "Presynaptic voltage-gated calcium channels", "Auto-antibodies reduce transmitter release", "Proximal weakness that improves with use; areflexia; autonomic symptoms"],
          ["Malignant hyperthermia", "Ryanodine receptor, the calcium-release channel of the sarcoplasmic reticulum", "Volatile anaesthetics trigger uncontrolled calcium release into the muscle cytosol", "Rigidity, hyperthermia, acidosis, tachycardia after triggering anaesthetics — treated with dantrolene"],
          ["Myotonia (chloride channelopathy)", "Muscle chloride channels", "Reduced chloride conductance leaves the muscle membrane hyperexcitable", "Delayed relaxation after contraction — difficulty letting go of a handshake"],
          ["Periodic paralysis", "Sodium, calcium or potassium channels of muscle", "Altered resting excitability", "Attacks of flaccid paralysis lasting hours, often triggered by carbohydrate meals or by rest after exercise"],
          ["Long QT syndrome", "Cardiac potassium or sodium channels", "Prolonged cardiac repolarisation", "Syncope or sudden death from torsades de pointes"],
        ],
      },
      {
        type: "paragraph",
        text: "Read the table as a general rule: whether a channelopathy causes too much or too little activity depends on the channel and on the direction of the fault. A myasthenia gravis antibody removes receptors, so transmission is too weak; a myotonia mutation leaves the muscle too excitable, so it cannot relax. The same organ — muscle — gives two opposite pictures, because the faulty channel sits at different points in the same chain.",
      },

      { type: "heading", level: 2, text: "Clinical correlation: malignant hyperthermia" },
      {
        type: "paragraph",
        text: "A patient with a susceptibility to malignant hyperthermia receives a volatile anaesthetic and, within minutes of the operation beginning, becomes rigid, their temperature climbs steeply, the carbon dioxide rises, and the heart rate accelerates. The ryanodine receptor of the sarcoplasmic reticulum — the channel that normally releases calcium into the muscle cytosol only in response to a depolarisation signal — has been forced open by the anaesthetic, so calcium floods the cytosol continuously. Sustained contraction, ATP consumption and heat production escalate without limit.",
      },
      {
        type: "paragraph",
        text: "Treatment is dantrolene, which blocks calcium release from the sarcoplasmic reticulum, together with stopping the triggering agent, cooling, and correcting the acidosis and hyperkalaemia that follow the massive calcium release. It is a medical emergency and it is inherited, so a positive family history of an anaesthetic problem is a contraindication to the standard agents.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying myasthenia gravis attacks the nerve terminal. It attacks the postsynaptic receptor — that is the whole distinction from Lambert-Eaton, and it is what makes the weakness fatigable rather than improving with use.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the weakness of myasthenia gravis is constant. It fluctuates, characteristically worsens through the day with continued use, and is worst in the continuously active eye and bulbar muscles. Constant weakness from the first symptom suggests a primary muscle disease instead.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Attributing malignant hyperthermia to an acetylcholinesterase problem or to a defect in the acetylcholine receptor. It is a defect in the sarcoplasmic reticulum calcium release channel, triggered by specific anaesthetics — and it is treated with dantrolene, not an anticholinesterase.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does muscle weakness in myasthenia gravis worsen with repeated use of a muscle?",
        answer: "Antibodies destroy acetylcholine receptors, so with each contraction fewer receptors remain available and the end-plate potential fails to reach threshold.",
        explanation: "Myasthenia is an anti-ACh-receptor disease: transmission fails progressively through a working day. Lambert-Eaton (anti-Ca2+-channel) improves with use; ACh excess would cause cramping, not fatigable weakness.",
      },
      {
        type: "question",
        prompt: "A patient with proximal limb weakness and absent reflexes reports that their strength improves after a few attempts. Which muscle group is most likely affected first, and what is the likely diagnosis?",
        answer: "The proximal limb muscles — rising from a chair, climbing stairs — and the likely diagnosis is Lambert-Eaton myasthenic syndrome, in which presynaptic calcium channel antibodies initially reduce transmitter release, then calcium accumulates in the terminal with repeated firing so strength transiently improves.",
        explanation: "The direction of the change with use is the discriminator: worsening with use is myasthenia gravis; improving with use is Lambert-Eaton. Both need a search for an associated tumour.",
      },
      {
        type: "question",
        prompt: "What is the mechanism and the specific treatment of malignant hyperthermia?",
        answer: "A volatile anaesthetic opens the ryanodine calcium-release channel of the sarcoplasmic reticulum, flooding the cytosol with calcium and producing sustained contraction, rigidity and explosive heat production. Treatment is dantrolene, which blocks that calcium release, plus removal of the trigger, cooling and correction of acidosis and hyperkalaemia.",
        explanation: "It is a channelopathy inherited in many cases, which is why the family history of an anaesthetic problem changes anaesthetic management before surgery.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which of these correctly characterises myasthenia gravis?",
        options: [
          "An autoimmune attack on presynaptic calcium channels, with weakness that improves with use",
          "An autoimmune destruction of postsynaptic acetylcholine receptors, with weakness that worsens with use",
          "An autoimmune destruction of the muscle fibre's sodium channels",
          "An autoimmune attack on the sarcoplasmic reticulum calcium-release channel",
        ],
        correctIndex: 1,
        explanation: "Postsynaptic receptor loss with fatigable weakness. Presynaptic calcium channel attack with improving weakness is Lambert-Eaton; sarcoplasmic reticulum channel faults are the periodic paralyses and malignant hyperthermia.",
      },
      {
        type: "mcq",
        stem: "Which muscle group is usually affected first in myasthenia gravis?",
        options: [
          "The distal hand muscles", "The extraocular and eyelid muscles", "The muscles of the lower leg", "The pelvic floor muscles",
        ],
        correctIndex: 1,
        explanation: "The continuously active extraocular and eyelid muscles fatigue first — drooping eyelids and double vision are the classic presenting complaints, and they are often absent in generalized myopathies.",
      },
      {
        type: "mcq",
        stem: "A patient's strength improves as they repeat a movement. What is the most likely diagnosis?",
        options: [
          "Myasthenia gravis", "Lambert-Eaton myasthenic syndrome", "A primary myopathy such as muscular dystrophy", "Amyotrophic lateral sclerosis",
        ],
        correctIndex: 1,
        explanation: "In Lambert-Eaton the presynaptic calcium channels are reduced, but repeated firing allows calcium to accumulate in the nerve terminal, transiently increasing transmitter release. Myasthenia worsens with use; the others do not show this facilitation.",
      },
      {
        type: "mcq",
        stem: "Which drug is given for malignant hyperthermia?",
        options: ["Pyridostigmine", "Dantrolene", "Pyridoxine", "Digitalis"],
        correctIndex: 1,
        explanation: "Dantrolene blocks calcium release from the sarcoplasmic reticulum, the mechanism of the hypermetabolic storm. Pyridostigmine (an acetylcholinesterase inhibitor) treats myasthenia — a different synapse, a different fault.",
      },
      {
        type: "mcq",
        stem: "Which is an example of a channelopathy caused by a chloride channel defect?",
        options: ["Myasthenia gravis", "Lambert-Eaton syndrome", "Myotonia", "Long QT syndrome"],
        correctIndex: 2,
        explanation: "Myotonia congenita is a chloride channelopathy: reduced chloride conductance leaves the muscle membrane hyperexcitable, so contraction is followed by delayed relaxation. Long QT is a cardiac potassium or sodium channel defect.",
      },

      { type: "heading", level: 2, text: "Module summary and next" },
      {
        type: "paragraph",
        text: "This module has covered one continuous chain: how the internal environment is held steady, how the membrane protects a potassium gradient, how that gradient becomes a voltage, how the voltage becomes a spike, and how the spike becomes a chemical message that contracts a muscle. Every failure in that chain is a disease: hyperkalaemia disturbs the gradient, demyelination blocks the spike, botulinum toxin stops the release, and myasthenia gravis destroys the receptors that read the message.",
      },
      {
        type: "paragraph",
        text: "Next module: blood, haemostasis and immunity — where the same themes acquire a tissue-level dimension, from the oxygen-carrying capacity of haemoglobin to the clotting cascade that is itself a positive feedback loop.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Module 1 SBA items — one per concept, authored and machine-checked.
// ---------------------------------------------------------------------------
const MODULE_ONE_SBAS: SbaSeed[] = [
  {
    slug: "physiology-cell-and-general--homeostasis-negative-feedback--sba",
    concept: "homeostasis-negative-feedback",
    stem: "A patient's blood pressure falls to 80/50 and the heart rate rises to 130 per minute. Which sequence correctly describes the events?",
    options: [
      "Sensors in the carotid sinus and aortic arch detect the fall, the medullary control centre activates sympathetic outflow, and heart rate and contractility rise in an attempt to restore pressure",
      "The fall in pressure directly relaxes the heart muscle, so the rate rises passively",
      "The set point for pressure is lowered, so the body no longer defends it",
      "The baroreceptors detect the fall and inhibit sympathetic outflow, slowing the heart",
    ],
    correctAnswer:
      "Sensors in the carotid sinus and aortic arch detect the fall, the medullary control centre activates sympathetic outflow, and heart rate and contractility rise in an attempt to restore pressure",
    explanation:
      "The baroreceptor reflex is negative feedback: sensors detect the deviation, a control centre computes the error, and effectors (sympathetic outflow) oppose the deviation. A fast pulse in shock is the loop working; a normal pulse in shock suggests the loop has failed.",
    difficulty: "medium",
  },
  {
    slug: "physiology-cell-and-general--membrane-transport--sba",
    concept: "membrane-transport",
    stem: "Which of these transport processes directly consumes ATP?",
    options: [
      "Oxygen diffusing across the pulmonary capillary wall",
      "Water moving into a red cell placed in an iso-osmolar urea solution",
      "The sodium-potassium pump moving three Na+ out and two K+ in",
      "Glucose crossing a muscle cell membrane through GLUT4",
    ],
    correctAnswer: "The sodium-potassium pump moving three Na+ out and two K+ in",
    explanation:
      "Only primary active transport against a gradient consumes ATP directly. Diffusion and facilitated diffusion ride gradients; urea crosses membranes freely so it does not hold water on its side, and the pump is the machine that builds the gradients everyone else uses.",
    difficulty: "easy",
  },
  {
    slug: "physiology-cell-and-general--resting-membrane-potential--sba",
    concept: "resting-membrane-potential",
    stem: "What sets a neuron's resting membrane potential at about -70 mV?",
    options: [
      "Potassium leaking out through open K+ channels, with the membrane far more permeable to K+ than Na+ at rest",
      "Sodium flooding in through open Na+ channels, making the inside positive",
      "Chloride pumping out until the inside is negative",
      "Nothing — the membrane is electrically neutral at rest",
    ],
    correctAnswer: "Potassium leaking out through open K+ channels, with the membrane far more permeable to K+ than Na+ at rest",
    explanation:
      "Leak K+ channels dominate at rest; K+ diffuses out, leaving fixed negative charges behind, until the electrical pull balances the chemical gradient — the Nernst balance the potassium equilibrium potential of about -90 mV formalises. Sodium's small inward leak pulls the value to about -70 mV.",
    difficulty: "medium",
  },
  {
    slug: "physiology-cell-and-general--action-potential--sba",
    concept: "action-potential",
    stem: "What causes the rising (depolarising) phase of an action potential?",
    options: [
      "Rapid sodium influx through voltage-gated Na+ channels that open at threshold",
      "Potassium efflux through voltage-gated K+ channels",
      "Chloride influx hyperpolarising the membrane",
      "Slow leakage with no gated channels involved",
    ],
    correctAnswer: "Rapid sodium influx through voltage-gated Na+ channels that open at threshold",
    explanation:
      "Threshold opens Na+ channels; Na+ rushes in down its gradient and the inside swings toward +30 mV. K+ efflux then repolarises — the phase order is depolarise (Na+ in), repolarise (K+ out), hyperpolarise (K+ slow to close).",
    difficulty: "easy",
  },
  {
    slug: "physiology-cell-and-general--neuromuscular-junction--sba",
    concept: "neuromuscular-junction",
    stem: "What is the correct order of events at the neuromuscular junction?",
    options: [
      "Ca2+ entry into the nerve terminal triggers acetylcholine release into the cleft; ACh opens receptors on the motor end plate; an action potential fires in the muscle",
      "The nerve fires electricity directly into the muscle with no chemical step",
      "The muscle releases acetylcholine to tell the nerve to fire",
      "Norepinephrine crosses the cleft and opens chloride channels",
    ],
    correctAnswer:
      "Ca2+ entry into the nerve terminal triggers acetylcholine release into the cleft; ACh opens receptors on the motor end plate; an action potential fires in the muscle",
    explanation:
      "Chemical transmission, not electrical: calcium in, ACh out, cleft crossing, end-plate receptor opening, end-plate potential, muscle action potential — every link in the chain is a drug target, from botulinum to curare.",
    difficulty: "medium",
  },
  {
    slug: "physiology-cell-and-general--clinical-myasthenia-channelopathies--sba",
    concept: "clinical-myasthenia-channelopathies",
    stem: "Why does muscle weakness in myasthenia gravis worsen with repeated use of a muscle?",
    options: [
      "Antibodies destroy acetylcholine receptors, so with each contraction fewer receptors remain available and the end-plate potential fails to reach threshold",
      "Antibodies attack presynaptic calcium channels, as in Lambert-Eaton syndrome",
      "There is excess acetylcholine in the cleft, overstimulating the muscle to fatigue",
      "The motor nerves themselves degenerate, as in a peripheral neuropathy",
    ],
    correctAnswer:
      "Antibodies destroy acetylcholine receptors, so with each contraction fewer receptors remain available and the end-plate potential fails to reach threshold",
    explanation:
      "Myasthenia is an anti-ACh-receptor disease: transmission fails progressively through a working day. Lambert-Eaton (anti-Ca2+-channel) improves with use; ACh excess would cause cramping, not fatigable weakness.",
    difficulty: "hard",
  },
];

// ---------------------------------------------------------------------------
// Deeper modules 2-6: a real concept spine, tracked-placeholder lessons.
// ---------------------------------------------------------------------------
const DEEPER_LESSONS: LessonSeed[] = [
  // --- M2 Blood, haemostasis & immunity ---
  { title: "Blood composition & plasma", module: 2, estimatedMinutes: 30, authored: false, concept: { title: "Blood composition and plasma proteins", slug: "blood-composition", summary: "Plasma and formed elements, the plasma proteins, haematocrit and the osmotic and transport functions of blood.", blooms: "remember", minutes: 30, prereq: [] }, content: { blocks: [] } },
  { title: "Haemoglobin & oxygen carriage", module: 2, estimatedMinutes: 45, authored: false, concept: { title: "Haemoglobin and oxygen transport", slug: "haemoglobin-oxygen", summary: "Haemoglobin's structure and cooperativity, the oxyhaemoglobin dissociation curve, and the factors that shift it.", blooms: "analyze", minutes: 45, prereq: [] }, content: { blocks: [] } },
  { title: "Erythrocytes, iron & anaemia", module: 2, estimatedMinutes: 35, authored: false, concept: { title: "Erythrocytes, iron and anaemia", slug: "erythrocytes-iron", summary: "Red cell production, iron metabolism and the classification of anaemias by size and production.", blooms: "apply", minutes: 35, prereq: [] }, content: { blocks: [] } },
  { title: "Haemostasis & coagulation", module: 2, estimatedMinutes: 45, authored: false, concept: { title: "Haemostasis and coagulation", slug: "haemostasis", summary: "Vascular, platelet and coagulation phases, the intrinsic and extrinsic pathways, and the positive-feedback role of thrombin.", blooms: "analyze", minutes: 45, prereq: [] }, content: { blocks: [] } },
  { title: "Immunity: innate & adaptive", module: 2, estimatedMinutes: 45, authored: false, concept: { title: "Innate and adaptive immunity", slug: "immunity", summary: "Barriers, phagocytes, complement, antigen presentation and the clonal selection of lymphocytes, with tolerance.", blooms: "understand", minutes: 45, prereq: [] }, content: { blocks: [] } },

  // --- M3 Cardiovascular physiology ---
  { title: "Cardiac cycle & heart sounds", module: 3, estimatedMinutes: 45, authored: false, concept: { title: "Cardiac cycle and heart sounds", slug: "cardiac-cycle", summary: "Pressure and volume changes through systole and diastole, and the correspondence to the first and second heart sounds.", blooms: "understand", minutes: 45, prereq: [] }, content: { blocks: [] } },
  { title: "Excitation-contraction coupling in the heart", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Cardiac excitation-contraction coupling", slug: "cardiac-ecc", summary: "The cardiac action potential, calcium entry and release, and the length-dependence of force.", blooms: "analyze", minutes: 40, prereq: [] }, content: { blocks: [] } },
  { title: "The ECG", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "The electrocardiogram", slug: "electrocardiography", summary: "Leads, the waveform, the intervals, and the ECG signatures of ischaemia, arrhythmia and electrolyte disturbance.", blooms: "apply", minutes: 40, prereq: [] }, content: { blocks: [] } },
  { title: "Haemodynamics: pressure, flow & resistance", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Haemodynamics", slug: "haemodynamics", summary: "Ohm's law applied to vessels, Poiseuille's law, compliance, and the determinants of mean arterial pressure.", blooms: "analyze", minutes: 40, prereq: [] }, content: { blocks: [] } },
  { title: "Regulation of arterial pressure", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Regulation of arterial pressure", slug: "blood-pressure-regulation", summary: "Baroreceptors, the renin-angiotensin-aldosterone system, and the hormonal control of blood volume.", blooms: "apply", minutes: 40, prereq: [] }, content: { blocks: [] } },
  { title: "Microcirculation, capillaries & lymphatics", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Microcirculation and capillary exchange", slug: "microcirculation", summary: "Starling forces across the capillary wall, diffusion distances, and the formation and return of lymph.", blooms: "analyze", minutes: 40, prereq: [] }, content: { blocks: [] } },
  { title: "Special circulations", module: 3, estimatedMinutes: 30, authored: false, concept: { title: "Special circulations", slug: "special-circulations", summary: "Coronary, cerebral, cutaneous, splanchnic, pulmonary and fetal circulations and their particular controls.", blooms: "apply", minutes: 30, prereq: [] }, content: { blocks: [] } },

  // --- M4 Respiratory physiology ---
  { title: "Ventilation & mechanics of breathing", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Ventilation and mechanics of breathing", slug: "ventilation-mechanics", summary: "Pressures, compliance, resistance, lung volumes and capacities, and the work of breathing.", blooms: "apply", minutes: 40, prereq: [] }, content: { blocks: [] } },
  { title: "Gas exchange & diffusion", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Gas exchange in the lung", slug: "gas-exchange", summary: "Alveolar-capillary diffusion, ventilation-perfusion matching, and the causes of hypoxaemia.", blooms: "analyze", minutes: 40, prereq: [] }, content: { blocks: [] } },
  { title: "Gas transport & acid-base in blood", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Gas transport and acid-base balance", slug: "gas-transport-acid-base", summary: "Carbon dioxide carriage, the bicarbonate buffer, and the respiratory compensation of metabolic disturbance.", blooms: "analyze", minutes: 40, prereq: [] }, content: { blocks: [] } },
  { title: "Control of breathing", module: 4, estimatedMinutes: 35, authored: false, concept: { title: "Control of breathing", slug: "control-of-breathing", summary: "Central and peripheral chemoreceptors, the effect of oxygen and carbon dioxide, and the pattern generators of the brainstem.", blooms: "understand", minutes: 35, prereq: [] }, content: { blocks: [] } },
  { title: "Non-respiratory lung functions", module: 4, estimatedMinutes: 25, authored: false, concept: { title: "Non-respiratory functions of the lung", slug: "lung-non-respiratory", summary: "Surfactant, defence, filtration, and the lung's role in acid-base and drug metabolism.", blooms: "understand", minutes: 25, prereq: [] }, content: { blocks: [] } },
  { title: "Clinical: hypoxia & respiratory failure", module: 4, estimatedMinutes: 35, authored: false, concept: { title: "Hypoxia and respiratory failure", slug: "hypoxia-respiratory-failure", summary: "Types of hypoxia, the interpretation of arterial blood gases, and oxygen therapy.", blooms: "apply", minutes: 35, prereq: [] }, content: { blocks: [] } },

  // --- M5 Renal & body fluids ---
  { title: "Renal blood flow & filtration", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Renal blood flow and glomerular filtration", slug: "renal-filtration", summary: "Glomerular structure, filtration fraction, autoregulation, and the measurement of filtration rate.", blooms: "analyze", minutes: 40, prereq: [] }, content: { blocks: [] } },
  { title: "Tubular reabsorption & secretion", module: 5, estimatedMinutes: 45, authored: false, concept: { title: "Tubular reabsorption and secretion", slug: "tubular-function", summary: "Segmental function of the nephron, and the transporters that reclaim sodium, glucose, water and electrolytes.", blooms: "analyze", minutes: 45, prereq: [] }, content: { blocks: [] } },
  { title: "Water balance & urine concentration", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Water balance and urine concentration", slug: "water-balance", summary: "Antidiuretic hormone, the countercurrent multiplier, and the dilution and concentration of urine.", blooms: "apply", minutes: 35, prereq: [] }, content: { blocks: [] } },
  { title: "Acid-base regulation by the kidney", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Renal acid-base regulation", slug: "renal-acid-base", summary: "Net acid excretion, bicarbonate regeneration, and the four big acid-base disturbances.", blooms: "apply", minutes: 40, prereq: [] }, content: { blocks: [] } },
  { title: "Electrolyte regulation", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Electrolyte regulation", slug: "electrolyte-regulation", summary: "Sodium, potassium, calcium, phosphate and magnesium balance, and their hormonal controls.", blooms: "apply", minutes: 35, prereq: [] }, content: { blocks: [] } },
  { title: "Clinical: acute & chronic kidney injury", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Acute and chronic kidney injury", slug: "kidney-injury", summary: "Classification, mechanisms, laboratory interpretation and the consequences of lost nephron mass.", blooms: "apply", minutes: 35, prereq: [] }, content: { blocks: [] } },

  // --- M6 GI, endocrine & reproduction ---
  { title: "GI motility & secretion", module: 6, estimatedMinutes: 40, authored: false, concept: { title: "Gastrointestinal motility and secretion", slug: "gi-motility-secretion", summary: "Swallowing, peristalsis, the migrating motor complex, and the control of gastric, pancreatic and biliary secretion.", blooms: "understand", minutes: 40, prereq: [] }, content: { blocks: [] } },
  { title: "Digestion & absorption", module: 6, estimatedMinutes: 40, authored: false, concept: { title: "Digestion and absorption", slug: "digestion-absorption", summary: "Enzymatic digestion of carbohydrate, protein and fat, and the segmental absorption of the products.", blooms: "understand", minutes: 40, prereq: [] }, content: { blocks: [] } },
  { title: "Hepatic physiology", module: 6, estimatedMinutes: 35, authored: false, concept: { title: "Hepatic physiology", slug: "liver-function", summary: "Synthesis, metabolism, detoxification, bile formation, and the handling of bilirubin.", blooms: "apply", minutes: 35, prereq: [] }, content: { blocks: [] } },
  { title: "Endocrine control & the hypothalamus-pituitary axis", module: 6, estimatedMinutes: 45, authored: false, concept: { title: "Hypothalamic-pituitary axes", slug: "hypothalamic-pituitary", summary: "Tropic and releasing hormones, feedback loops, and the adrenal, thyroid and gonadal axes.", blooms: "analyze", minutes: 45, prereq: [] }, content: { blocks: [] } },
  { title: "Metabolic regulation & diabetes", module: 6, estimatedMinutes: 40, authored: false, concept: { title: "Metabolic regulation and diabetes mellitus", slug: "metabolic-regulation-diabetes", summary: "Insulin, glucagon and the fuels of the fed, fasting and starved states, and the two types of diabetes.", blooms: "apply", minutes: 40, prereq: [] }, content: { blocks: [] } },
  { title: "Reproductive physiology", module: 6, estimatedMinutes: 40, authored: false, concept: { title: "Reproductive physiology", slug: "reproductive-physiology", summary: "Gametogenesis, the menstrual cycle, the physiology of pregnancy, parturition and lactation.", blooms: "understand", minutes: 40, prereq: [] }, content: { blocks: [] } },
];

export const PHYSIOLOGY: SubjectSeed = {
  id: "course-physiology",
  existingSlug: "physiology-cell-and-general",
  slug: "physiology-cell-and-general",
  title: "Human Physiology I — Cell, Blood & Systems",
  code: "PHYS 101",
  department: "Physiology",
  level: 100,
  credits: 4,
  semester: "first",
  description:
    "How the body works, taught from the single cell outwards: the mechanisms that hold the internal environment steady, then the systems that extend them — blood, circulation, breathing, kidney, gut, endocrine and reproductive physiology.",
  faculty: "basic-medical-sciences",
  modules: MODULES,
  lessons: [
    { title: "Homeostasis and negative feedback", module: 1, estimatedMinutes: 30, authored: true, concept: { title: "Homeostasis and negative feedback", slug: "homeostasis-negative-feedback", summary: "The maintenance of a stable internal environment via feedback loops: sensors, control centres, effectors, and the distinction between negative and positive feedback and feedforward control.", blooms: "understand", minutes: 30, prereq: [] }, content: lesson1() as never },
    { title: "Transport across cell membranes", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Transport across cell membranes", slug: "membrane-transport", summary: "Simple diffusion, facilitated diffusion, osmosis, primary and secondary active transport, the stoichiometry of the sodium-potassium ATPase, and the meaning of tonicity.", blooms: "understand", minutes: 40, prereq: ["homeostasis-negative-feedback"] }, content: lesson2() as never },
    { title: "Resting membrane potential", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Resting membrane potential", slug: "resting-membrane-potential", summary: "How the ionic gradients and selective potassium permeability produce a voltage of about minus seventy millivolts, and how potassium disturbance changes it.", blooms: "analyze", minutes: 40, prereq: ["membrane-transport"] }, content: lesson3() as never },
    { title: "Action potential and conduction", module: 1, estimatedMinutes: 45, authored: true, concept: { title: "Action potential and conduction", slug: "action-potential", summary: "Threshold and the all-or-none spike, the channel states behind each phase, the refractory periods, and propagation including saltatory conduction.", blooms: "analyze", minutes: 45, prereq: ["resting-membrane-potential"] }, content: lesson4() as never },
    { title: "Neuromuscular junction", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Neuromuscular junction", slug: "neuromuscular-junction", summary: "Chemical transmission from nerve to muscle: calcium-triggered acetylcholine release, quantal release, the nicotinic end-plate receptor, and the safety factor.", blooms: "apply", minutes: 40, prereq: ["action-potential"] }, content: lesson5() as never },
    { title: "Clinical correlation: myasthenia gravis & channelopathies", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Clinical correlation: myasthenia gravis and channelopathies", slug: "clinical-myasthenia-channelopathies", summary: "Postsynaptic receptor destruction in myasthenia gravis, presynaptic calcium channel loss in Lambert-Eaton, and channelopathies including malignant hyperthermia.", blooms: "apply", minutes: 40, prereq: ["neuromuscular-junction"] }, content: lesson6() as never },
    ...DEEPER_LESSONS,
  ],
  sbas: MODULE_ONE_SBAS,
  prereqCourses: [],
};

export async function seedMbbsPhysiology() {
  return seedMbbsCourse(PHYSIOLOGY);
}

/** Idempotent: safe to run repeatedly; upserts on stable keys. */
export async function seedPhysiology(): Promise<void> {
  await seedMbbsPhysiology();
}

export default PHYSIOLOGY;

// CLI usage: npx ts-node prisma/seed-courses/mbbs/physiology.ts
if (process.argv[1] && process.argv[1].includes("mbbs/physiology")) {
  seedPhysiology()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
