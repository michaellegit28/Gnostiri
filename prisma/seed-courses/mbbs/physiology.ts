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
// ---------------------------------------------------------------------------
// MODULE 2 — LESSON 7 — Blood composition & plasma (fully authored)
// ---------------------------------------------------------------------------
function lesson7() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: state the approximate proportions of plasma and formed elements in whole blood and give the normal haematocrit range for men and for women; name the three plasma proteins with their approximate plasma concentrations and state what each one does; explain why albumin is the protein that governs the oncotic pressure; describe the composition of the formed elements by relative number; and explain why blood volume and plasma osmolarity are defended separately and by which hormone.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 3 (the resting membrane potential) and Lesson 2 (transport across cell membranes), because the osmotic behaviour of plasma depends on the membrane and pump mechanisms you have already learned, and Lesson 1 because both volume and osmolarity are homeostatically held variables.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Blood as a two-compartment fluid",
        text: "Blood is a connective tissue: about 55 per cent plasma and about 45 per cent formed elements, of which the erythrocytes dominate by volume and the platelets are the only other cellular fragment present. The plasma is the internal environment in which every cell of the body actually lives.",
      },
      {
        type: "paragraph",
        text: "The whole point of the module you are about to study is that blood is a transport medium with three separate cargoes — oxygen, nutrients and cells that defend and repair — carried in one fluid whose volume and saltiness are held as tightly as its oxygen content. Separate the cargoes in your mind and the physiology becomes a set of parallel problems rather than one long list.",
      },
      {
        type: "table",
        headers: ["Fraction", "Proportion of whole blood", "What it is", "Principal function"],
        rows: [
          ["Plasma", "About 55 per cent", "Water with dissolved protein, salts, glucose, urea, hormones and gases", "Transport, and the true internal environment"],
          ["Erythrocytes", "Most of the formed elements by volume", "Anucleate discs crammed with haemoglobin", "Oxygen and carbon dioxide carriage"],
          ["Leucocytes", "Fewer than one thousandth of the red cell number", "Nucleated defence cells of several kinds", "Immunity, covered later in this module"],
          ["Platelets", "Cell fragments, not true cells", "Anucleate fragments shed by megakaryocytes", "Haemostasis, covered later in this module"],
        ],
      },

      { type: "heading", level: 2, text: "The haematocrit" },
      {
        type: "definition",
        term: "Haematocrit (packed cell volume)",
        text: "The proportion of whole blood volume occupied by the erythrocytes, measured by centrifuging a sample. Normal range is about 40 to 50 per cent in men and about 36 to 44 per cent in women.",
      },
      {
        type: "paragraph",
        text: "The haematocrit is the single number that summarises the red cell compartment, and it appears in every full blood count report. Learn the ranges, because they tell you whether an anaemia or a polycythaemia is present and roughly how severe it is, and because the difference between the sexes is a real and regular finding rather than an error. The female value is lower because oestrogen modestly suppresses erythropoiesis, and the male value is higher partly for the same reason and partly because of androgenic drive on red cell production.",
      },
      {
        type: "callout",
        variant: "info",
        text: "A raised haematocrit is not automatically good. Thick blood is easier to clot and harder to pump: the viscosity of blood rises steeply above a haematocrit of about 50 per cent, which is why chronic mountain sickness and polycythaemia rubra vera both present with thrombosis, and why rheology is a subject in its own right.",
      },

      { type: "heading", level: 2, text: "The plasma proteins" },
      {
        type: "paragraph",
        text: "Three proteins make up almost all of the plasma protein, and they are produced overwhelmingly by the liver. Each has one dominant function and one number worth memorising.",
      },
      {
        type: "table",
        headers: ["Protein", "Approximate plasma concentration", "Made by", "Principal functions"],
        rows: [
          ["Albumin", "About 35 to 50 g/L", "The liver", "Oncotic pressure, and the transport of bilirubin, fatty acids, calcium and many drugs"],
          ["Globulins", "About 20 to 35 g/L in total", "The liver and plasma cells", "Transport, and immunity — the immunoglobulins are globulins"],
          ["Fibrinogen", "About 2 to 4 g/L", "The liver", "The precursor of the fibrin clot, covered in the haemostasis lesson"],
        ],
      },
      {
        type: "definition",
        term: "Oncotic (colloid osmotic) pressure",
        text: "The osmotic pressure exerted across a capillary wall by the plasma proteins, which are too large to leak through it. Albumin provides about 75 to 80 per cent of it, because it is both the most concentrated plasma protein and the smallest of the three, so it holds the greatest number of particles per gram.",
      },
      {
        type: "paragraph",
        text: "Albumin's size is the reason it dominates. Oncotic pressure counts particles, not grams, and albumin with its molecular mass of about 66,000 contributes far more particles per gram than the much larger globulins. It is also the reason a patient in liver failure or nephrotic syndrome, whose plasma albumin falls, develops peripheral oedema: without enough oncotic pressure, fluid filters into the tissues faster than the lymphatics can drain it.",
      },
      {
        type: "question",
        prompt: "A patient with nephrotic syndrome loses 4 g of protein in the urine a day and develops pitting ankle oedema. Which plasma fraction is depleted, and by what mechanism does the oedema arise?",
        answer: "Albumin is depleted in the urine, so the oncotic pressure falls, fluid filters out of the capillaries into the tissues, and the lymphatics cannot return it fast enough. The kidney simultaneously retains salt, which worsens the volume.",
        explanation: "This is the same mechanism as malignant malnutrition oedema: protein is lost faster than it is replaced, so the oncotic pressure that holds water in the vessels fails.",
      },

      { type: "heading", level: 2, text: "Worked example: two homeostasis problems, one fluid" },
      {
        type: "paragraph",
        text: "The body defends two independent properties of blood, and confusing them is the commonest error in this topic. Volume is how much fluid the circulation contains, and it is defended by the behaviour of sodium: where sodium goes, water follows, so volume control is sodium control. Osmolarity is how concentrated the solutes in that fluid are, and it is defended by water alone, through antidiuretic hormone.",
      },
      {
        type: "table",
        headers: ["Variable", "Sensed by", "Effector", "Hormone", "Corrects by"],
        rows: [
          ["Plasma volume", "Stretch receptors in the atria and the great veins", "The kidney, by changing sodium excretion", "Aldosterone and atrial natriuretic peptide", "Changing how much sodium and water are retained"],
          ["Plasma osmolarity", "Hypothalamic osmoreceptors", "The kidney, by changing water excretion", "Antidiuretic hormone (vasopressin)", "Changing how much water is reabsorbed"],
          ["Sodium concentration", "The same renal pathways as volume", "Aldosterone's action on the distal nephron", "Aldosterone", "Changing sodium excretion directly"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Antidiuretic hormone is the best example of a single hormone doing two things by two receptors: V2 receptors on the collecting duct insert aquaporins and concentrate the urine, and V1 receptors on arterioles constrict them and raise blood pressure. The two actions explain both water balance and the pharmacology of desmopressin.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying blood is about half plasma and half cells in both sexes. The proportions differ because the haematocrit does; the female haematocrit is roughly 10 percentage points lower than the male's. An adult woman with a haematocrit of 40 per cent is normal, not anaemic.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating platelets as cells. They are anucleate fragments shed from megakaryocytes in the marrow, with no nucleus and no DNA. That is why they can survive only about ten days and why a platelet transfusion shelf life is measured in a week.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing oncotic pressure with osmolarity. Plasma osmolarity of about 300 mOsm/L is generated mainly by sodium salts; oncotic pressure of about 25 mmHg is generated by albumin, which contributes almost nothing to osmolarity because it is so few molecules per litre. Haemorrhage with albumin loss and pure water loss are not the same problem.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Give the normal haematocrit range for men and for women, and state why they differ.",
        answer: "About 40 to 50 per cent in men and about 36 to 44 per cent in women. The female range is lower because oestrogen modestly suppresses erythropoiesis and the androgen drive on the marrow is absent.",
        explanation: "The difference is physiological, and reading a woman's 40 per cent as anaemia is a standard beginner error.",
      },
      {
        type: "question",
        prompt: "Which plasma protein generates most of the oncotic pressure and why?",
        answer: "Albumin, because it is both the most concentrated plasma protein and the smallest, so it contributes the greatest number of osmotically active particles per gram.",
        explanation: "Oncotic pressure counts particles, not mass. Fibrinogen is similar in size but is present at one tenth the concentration.",
      },
      {
        type: "question",
        prompt: "A patient is deprived of water for 48 hours. Which variable rises, which hormone is released, and what happens to the urine?",
        answer: "Plasma osmolarity rises, the hypothalamic osmoreceptors trigger antidiuretic hormone release from the posterior pituitary, and the collecting ducts become permeable to water, so the urine becomes small in volume and concentrated.",
        explanation: "The water loss raises osmolarity; the response defends osmolarity by retaining water, at the cost of volume that cannot be restored without drinking.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which proportion of whole blood is plasma?",
        options: ["About 40 per cent", "About 55 per cent", "About 70 per cent", "About 85 per cent"],
        correctIndex: 1,
        explanation: "About 55 per cent plasma and 45 per cent formed elements. The cellular fraction is what the haematocrit measures, and its range is sex-dependent.",
      },
      {
        type: "mcq",
        stem: "Which protein contributes most of the plasma oncotic pressure?",
        options: ["Fibrinogen, because it clots", "Albumin, because it is numerous and small", "Globulin, because it is immunologically active", "Haemoglobin, because it carries oxygen"],
        correctIndex: 1,
        explanation: "Albumin provides about three quarters of the oncotic pressure because it is the most concentrated and the smallest of the plasma proteins, giving the most particles per litre. Haemoglobin is inside the red cells, not in plasma.",
      },
      {
        type: "mcq",
        stem: "Which statement about platelets is correct?",
        options: [
          "They are nucleated cells that divide in the marrow",
          "They are anucleate fragments shed from megakaryocytes and survive roughly ten days",
          "They are produced by the spleen and live about a year",
          "They are modified erythrocytes with a nucleus",
        ],
        correctIndex: 1,
        explanation: "Platelets are anucleate fragments budded off megakaryocytes in the bone marrow, with a circulating life of about ten days, which sets the transfusion shelf life.",
      },
      {
        type: "mcq",
        stem: "A patient retains sodium because of aldosterone excess. Which variable is most directly affected?",
        options: [
          "Plasma osmolarity, because sodium is the dominant solute",
          "Blood volume, because water follows sodium",
          "Plasma oncotic pressure, because sodium binds albumin",
          "Haematocrit, because sodium is carried in the red cells",
        ],
        correctIndex: 1,
        explanation: "Where sodium goes water follows, so aldosterone alters volume. Osmolarity is defended separately by antidiuretic hormone acting on water alone, and this difference is the key to understanding the two hormone systems.",
      },
      {
        type: "mcq",
        stem: "Which mechanism explains the oedema of nephrotic syndrome?",
        options: [
          "Sodium is retained by the kidney so volume rises and blood pressure falls",
          "Albumin is lost in the urine, so plasma oncotic pressure falls and fluid filters into the tissues",
          "Antidiuretic hormone is suppressed so water is excreted into the tissues",
          "Fibrinogen is lost so the capillaries leak protein",
        ],
        correctIndex: 1,
        explanation: "The albumin loss lowers oncotic pressure, fluid leaves the capillaries at the arterial end faster than it is reclaimed, and the lymphatics cannot keep up. Fibrinogen loss would cause a bleeding tendency, not oedema.",
      },
      {
        type: "mcq",
        stem: "Which of these is generated mostly by plasma proteins rather than by dissolved ions?",
        options: ["Plasma osmolarity", "The plasma oncotic pressure", "Blood pH", "The plasma buffer capacity"],
        correctIndex: 1,
        explanation: "Oncotic pressure is the colloid osmotic pressure of the proteins. Osmolarity, pH and buffer capacity are dominated by the small ions and molecules, particularly bicarbonate.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Blood is about 55 per cent plasma and 45 per cent formed elements, and the haematocrit — 40 to 50 per cent in men, 36 to 44 in women — is the measure of the red cell fraction. Of the plasma proteins, albumin supplies most of the oncotic pressure because it is small as well as abundant, and its loss explains oedema. Volume is defended by sodium and the atrial stretch receptors; concentration is defended separately by antidiuretic hormone and the hypothalamic osmoreceptors.",
      },
      {
        type: "paragraph",
        text: "Next: the molecule that makes the whole system worth running. You will see how four haem groups in one protein give blood an oxygen capacity of about 200 mL per litre, and why the curve that describes loading and unloading is S-shaped rather than straight.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// MODULE 2 — LESSON 8 — Haemoglobin & oxygen carriage (fully authored)
// ---------------------------------------------------------------------------
function lesson8() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the structure of haemoglobin and state how many oxygen molecules it carries; state the oxygen content of arterial blood and how much of it is in solution; explain why the oxyhaemoglobin dissociation curve is sigmoid rather than rectangular; name the three factors that shift the curve to the right and the physiological reason each acts; calculate the direction of the shift from a given rise in carbon dioxide, temperature or 2,3-DPG; and explain the Bohr effect in terms of unloading rather than loading.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1, 2 and 7. You need negative feedback and the notion of a defensible variable for the transport set point, and the composition of blood for the haematocrit and haemoglobin concentration figures used here.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Haemoglobin",
        text: "A tetrameric protein of two alpha and two beta chains, each carrying a haem group whose ferrous iron binds one molecule of oxygen reversibly. Four binding sites per haemoglobin molecule, each able to load and unload without any need for oxygen to enter a chemical reaction.",
      },
      {
        type: "paragraph",
        text: "The problem haemoglobin solves is simple to state: blood cannot dissolve enough oxygen. At a partial pressure of 100 mmHg, only about 3 mL of oxygen per litre can be carried in physical solution, and the tissues need about 250 mL per minute at rest. Dissolution alone falls short by a factor of fifty. Haemoglobin is what closes the gap, because it can be packed into red cells until the blood carries about 200 mL of oxygen per litre — and, crucially, it can release that oxygen into a tissue that has a much lower partial pressure than the lung.",
      },
      {
        type: "table",
        headers: ["Feature", "Value or fact", "Why it matters"],
        rows: [
          ["Molecular mass", "About 64,500 daltons", "Small enough to circulate freely through every capillary"],
          ["Chains", "Two alpha and two beta (HbA, the adult form)", "Different chains make different haemoglobins, which is the basis of the haemoglobinopathies"],
          ["Haem groups", "Four, one per chain, each with one ferrous iron", "Oxygen binds to the iron without oxidising it, so the reaction is reversible"],
          ["Arterial oxygen content", "About 200 mL per litre of blood", "About 98 per cent of it is bound, only about 3 mL per litre is dissolved"],
          ["Tissue extraction at rest", "Venous content about 150 mL per litre", "A 25 per cent extraction, leaving a large reserve for exercise"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The dissolved fraction is small but decisive: it is the dissolved oxygen that partial pressures measure, and it is what the tissues see. Every percentage of saturation quoted on a pulse oximeter corresponds to a particular dissolved partial pressure, which is why the saturation figure alone can look reassuring while ventilation is failing.",
      },

      { type: "heading", level: 2, text: "Why the curve is S-shaped" },
      {
        type: "paragraph",
        text: "If each bound oxygen were independent, the curve would be a rectangular hyperbola: a flat bilayer where the first 90 per cent is taken up easily and the last 10 per cent is bought with an ever larger partial pressure. That shape would be a disaster at the tissues, because the last part would not release. What makes the curve useful is cooperativity.",
      },
      {
        type: "definition",
        term: "Cooperative binding",
        text: "The binding of the first oxygen molecule changes the shape of the haemoglobin tetramer so that the three remaining sites have a higher affinity for oxygen. Each molecule that loads increases the affinity for the next, so loading in the lung is fast once begun, and unloading in the tissues, once begun, accelerates.",
      },
      {
        type: "paragraph",
        text: "The result is the sigmoid curve, and its shape is exactly what the two sites need. In the lung, at a partial pressure of about 100 mmHg, haemoglobin is about 97 per cent saturated, so it is nearly full. In resting tissue, at about 40 mmHg, saturation is about 75 per cent — not a bare leakage but a substantial release of a quarter of the cargo. The steep part of the curve, between about 20 and 50 mmHg, means that a small fall in tissue partial pressure releases a lot of oxygen: the curve is built so active tissue, where the partial pressure is lowest, extracts most.",
      },
      {
        type: "table",
        headers: ["Partial pressure of oxygen (mmHg)", "Approximate saturation", "Where this occurs"],
        rows: [
          ["100", "About 97 per cent", "Arterial blood leaving the lung"],
          ["40", "About 75 per cent", "Mixed venous blood at rest"],
          ["30", "About 58 per cent", "Exercising muscle"],
          ["20", "About 35 per cent", "Vigorously exercising muscle, and the steepest part of the curve"],
        ],
      },

      { type: "heading", level: 2, text: "Worked example: reading the curve in both directions" },
      {
        type: "paragraph",
        text: "The commonest examination mistake is to treat the curve as if loading and unloading were the same event reversed. They are. If a point moves to the right, saturation falls at any given partial pressure, so the same lung can load less, but the same tissue unloads more. The right shift is not a loss of efficiency; it is a choice to prioritise delivery over storage.",
      },
      {
        type: "table",
        headers: ["Where the point sits", "At 100 mmHg (arterial)", "At 40 mmHg (resting tissue)", "Interpretation"],
        rows: [
          ["Normal curve", "About 98 per cent saturated, carrying about 200 mL per litre", "About 75 per cent saturated, releasing about 50 mL per litre", "Full loading, generous unloading"],
          ["Shifted to the right", "Loading slightly reduced", "Saturation lower, so more oxygen is released", "The trade of storage for delivery"],
          ["Shifted to the left", "Loading increased, so slightly higher saturation", "Saturation higher, so less oxygen is released", "The trade of delivery for storage — why carbon monoxide and alkalosis are dangerous"],
        ],
      },

      { type: "heading", level: 2, text: "The Bohr effect and the other shifts" },
      {
        type: "definition",
        term: "The Bohr effect",
        text: "The lowering of haemoglobin's affinity for oxygen by a rise in carbon dioxide and a fall in pH. In an active tissue, metabolism produces carbon dioxide, which dissolves to form carbonic acid and lowers the local pH; the fall in affinity shifts the curve to the right and releases more oxygen exactly where it is needed.",
      },
      {
        type: "paragraph",
        text: "This is the most elegant piece of matching in the whole of physiology, and it is worth spelling out step by step. A tissue at work produces carbon dioxide more quickly than the blood can remove it. The gas diffuses into the capillary, lowers the local pH, and — through the Bohr effect — displaces oxygen from haemoglobin. The very by-product that signals activity is what recruits the oxygen. Three shifts act together in a muscle, and all are local.",
      },
      {
        type: "table",
        headers: ["Factor", "Change", "Shift", "Mechanism and rationale"],
        rows: [
          ["Carbon dioxide", "Rises in active tissue", "Right", "Lowers pH; the Bohr effect, matching delivery to activity"],
          ["Temperature", "Rises with activity", "Right", "Heat favours the low-affinity state; releasing oxygen where the tissue is hot and working"],
          ["2,3-DPG", "Rises in chronic hypoxia and anaemia", "Right", "Binds deoxyhaemoglobin and stabilises it, so release is easier — an adaptation to living with less oxygen"],
          ["pH", "Falls", "Right", "The Bohr shift itself"],
          ["Fetal haemoglobin", "HbF present at birth", "Left", "HbF has a lower affinity for 2,3-DPG, so at the placenta the fetal blood loads oxygen from the maternal blood"],
        ],
      },

      { type: "heading", level: 2, text: "Worked example: the danger of a left shift" },
      {
        type: "paragraph",
        text: "Follow a patient who has inhaled carbon monoxide. The molecule binds haem at the same site as oxygen with about 240 times the affinity, so every molecule occupied cannot carry oxygen, and — worse — the binding to some sites shifts the remaining sites to the left, so they grip the oxygen they hold and will not release it. The patient is therefore poisoned twice: fewer sites are available, and the sites that are available will not let go. That is why carbon monoxide poisoning is treated with oxygen, and why a cherry-red skin colour is described: the carboxyhaemoglobin is a brighter red than oxyhaemoglobin, and the pulse oximeter, which reads colour, reports a normal saturation that is a lie.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a right shift is harmful because arterial saturation falls. It is helpful in the tissues: the same curve that loads less fully in the lung releases more oxygen in exercising muscle. Read the curve in both directions before labelling a shift good or bad.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting that only a tiny fraction of oxygen is dissolved. A patient breathing room air who has a normal haemoglobin has almost 200 mL per litre of oxygen, of which about 3 mL is dissolved. Hyperbaric oxygen raises the dissolved fraction and nothing else, which is why it helps in carbon monoxide poisoning and decompression sickness.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the steep part of the curve is the part where little oxygen is released. It is the opposite: between about 20 and 50 mmHg, a small drop in partial pressure releases a large quantity of oxygen, which is exactly what makes muscle blood flow self-limiting.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What is the approximate oxygen content of arterial blood, and what proportion of it is carried in solution?",
        answer: "About 200 mL per litre, of which only about 3 mL per litre is dissolved and the rest is bound to haemoglobin.",
        explanation: "The dissolved fraction is the one the partial pressures describe, and it is the only one that can be increased by breathing more oxygen.",
      },
      {
        type: "question",
        prompt: "Why does the oxyhaemoglobin dissociation curve flatten above about 60 mmHg and steepen between 20 and 50 mmHg?",
        answer: "Cooperative binding: at high partial pressures every site is filled or nearly filled, so loading saturates and the curve flattens. In the steep mid-range, unloading is also cooperative, so a small fall in partial pressure releases a large quantity of oxygen.",
        explanation: "This places the steep part where tissues actually operate, which is what lets active muscle extract almost four times as much oxygen as resting muscle from the same blood.",
      },
      {
        type: "question",
        prompt: "Name the three factors that shift the curve to the right, and describe the physiological situation in which all three act together.",
        answer: "Rising carbon dioxide, rising temperature and rising 2,3-DPG, together with any fall in pH. All three rise together in exercising muscle — carbon dioxide and heat from the metabolism, and 2,3-DPG in chronic adaptation to hypoxia.",
        explanation: "The local rise in carbon dioxide and the fall in pH are the Bohr effect, and they are the fastest-acting of the three.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which statement about haemoglobin is correct?",
        options: [
          "It carries one haem group per molecule, so it binds one oxygen molecule at a time",
          "It is a tetramer of two alpha and two beta chains with four haem groups and four oxygen-binding sites",
          "It oxidises the iron in the haem group when oxygen binds, and the reaction is irreversible",
          "It is a single chain of about 64 amino acids with a haem group attached",
        ],
        correctIndex: 1,
        explanation: "Adult haemoglobin has four subunits and therefore four binding sites, and the iron remains ferrous throughout because the binding is a reversible oxygenation rather than a reaction.",
      },
      {
        type: "mcq",
        stem: "What proportion of oxygen in blood is carried in physical solution?",
        options: ["About half", "About 25 per cent", "Only a few per cent", "None at all"],
        correctIndex: 2,
        explanation: "Only about 3 mL per litre of the roughly 200 mL per litre is dissolved; the rest is bound. That is why haemoglobin makes blood a viable oxygen transport medium at all.",
      },
      {
        type: "mcq",
        stem: "Which combination of changes shifts the oxyhaemoglobin dissociation curve to the right?",
        options: [
          "A fall in pH, a rise in carbon dioxide and a rise in temperature",
          "A rise in pH, a fall in carbon dioxide and a fall in temperature",
          "A rise in pH, a rise in 2,3-DPG and hypothermia",
          "A fall in carbon dioxide, a rise in temperature and a fall in pH",
        ],
        correctIndex: 0,
        explanation: "Acidity, carbon dioxide and heat all stabilise the low-affinity deoxyhaemoglobin state, so unloading is favoured — the combination found in an exercising muscle.",
      },
      {
        type: "mcq",
        stem: "What is the physiological consequence of a rise in 2,3-DPG in chronic anaemia?",
        options: [
          "Saturation rises in both the lung and the tissue",
          "Affinity falls, so more oxygen is released to the tissues at any given partial pressure",
          "Affinity rises, so oxygen is held more tightly and released less",
          "Oxygen capacity rises, because more haem is produced",
        ],
        correctIndex: 1,
        explanation: "2,3-DPG binds deoxyhaemoglobin and stabilises it, shifting the curve right. It does not change the oxygen capacity — only the affinity at which that capacity is made available.",
      },
      {
        type: "mcq",
        stem: "Why is carbon monoxide poisoning so dangerous?",
        options: [
          "It lowers the pH of blood and causes acidosis",
          "It binds haem with great affinity and shifts the remaining sites towards holding oxygen tightly, so the blood cannot release what it carries",
          "It prevents carbon dioxide being carried, and the patient asphyxiates on carbon dioxide retention",
          "It destroys the red cells, causing a rapid haemolytic anaemia",
        ],
        correctIndex: 1,
        explanation: "Carbon monoxide occupies binding sites and shifts the remaining ones to the left, so haemoglobin grips the oxygen it does carry. That is why 100 per cent oxygen, or hyperbaric oxygen, is the treatment.",
      },
      {
        type: "mcq",
        stem: "At a partial pressure of about 40 mmHg, what is the approximate saturation of adult haemoglobin?",
        options: ["About 25 per cent", "About 50 per cent", "About 75 per cent", "About 98 per cent"],
        correctIndex: 2,
        explanation: "Mixed venous blood at rest sits at about 75 per cent, which is how a 25 per cent extraction of the arterial 200 mL per litre gives a venous 150 mL per litre and leaves a large reserve for exercise.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Haemoglobin is a tetramer with four haem groups that raises the blood's oxygen capacity from a dissolved 3 mL per litre to about 200 mL per litre. Its cooperative binding produces the sigmoid curve, which loads almost fully in the lung at about 100 mmHg and unloads generously in resting tissue at about 40 mmHg, with a steep range between 20 and 50 mmHg where active tissue extracts most. The rightward shifts of rising carbon dioxide, temperature and 2,3-DPG — the Bohr effect above all — deliver oxygen where the tissue is working, and a leftward shift, whether from alkalosis, carbon monoxide or fetal haemoglobin, is the one that withholds it.",
      },
      {
        type: "paragraph",
        text: "Next: the red cell itself. You will see where erythrocytes are made, why they lose their nucleus, how iron is recycled rather than excreted, and how the anaemias are classified by the two questions a full blood count actually answers.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// MODULE 2 — LESSON 9 — Erythrocytes, iron & anaemia (fully authored)
// ---------------------------------------------------------------------------
function lesson9() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the production of erythrocytes in the marrow and the signals that regulate it; state the normal lifespan of a red cell and the bilirubin pathway by which it is broken down; explain iron absorption, transport and storage, and why the body cannot excrete a large iron load; state which two vitamins the marrow needs and where each is absorbed; and classify the anaemias by their mean corpuscular volume and by their reticulocyte count, saying what each indicates.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 7 and 8. You need the composition of blood, the haematocrit and the oxygen-carrying role that red cells exist to perform.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Erythrocyte",
        text: "A biconcave, anucleate disc produced in the bone marrow, which survives about 120 days and exists to carry haemoglobin. It sheds its nucleus at maturity precisely so that more of the cell's volume can be given to pigment rather than to machinery.",
      },
      {
        type: "paragraph",
        text: "The whole of red cell physiology is driven by a single constraint: the cell cannot divide, cannot synthesise new protein once mature, and cannot repair itself, so it has a fixed life span and must be replaced. The consequences run all the way through this lesson — why the marrow must work continuously, why iron is recycled rather than excreted, why a shortage of the raw materials shows up only after weeks, and why a haemolytic anaemia can be masked by a marrow that is working perfectly.",
      },
      {
        type: "table",
        headers: ["Property", "Value or fact", "Consequence"],
        rows: [
          ["Shape and size", "Biconcave disc, about 7.5 micrometres across", "Biconcavity gives surface area for diffusion and flexibility to squeeze through capillaries"],
          ["Nucleus", "Lost at maturity", "Cannot synthesise new protein or repair DNA, so it dies when its constituents run out"],
          ["Normal lifespan", "About 120 days", "About one per cent of the red cells are replaced each day, which is why the marrow must be constantly active"],
          ["Energy source", "Glucose, by anaerobic glycolysis alone", "No mitochondria, so no oxidative phosphorylation and no use for the oxygen being carried"],
          ["Membrane", "Flexible, with a spectrin cytoskeleton", "A cytoskeletal defect splinters the cell in the spleen, producing a haemolytic anaemia"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The red cell has no mitochondria, so it cannot use the oxygen it carries — a design that protects the cargo. It metabolises glucose anaerobically, and the 2,3-DPG that this generates is the same molecule that modulates haemoglobin's affinity, so the cell's own metabolism tunes the delivery it exists to perform.",
      },

      { type: "heading", level: 2, text: "Erythropoiesis and its control" },
      {
        type: "paragraph",
        text: "Red cells begin as a stem cell in the marrow, pass through committed progenitors, and mature in about a week. The last step is the extrusion of the nucleus, and the cell is then released into the circulation. Regeneration is almost entirely a question of raw material supply — iron, vitamins B12 and folate, and protein — plus a single hormonal signal.",
      },
      {
        type: "table",
        headers: ["Stimulus", "Sensed where", "Signal", "Effect"],
        rows: [
          ["Falling tissue oxygen", "In the kidney mostly, and the liver", "Erythropoietin", "Stimulates erythroid progenitors in the marrow, so more red cells are produced"],
          ["Adequate iron and protein", "The marrow itself", "None — availability", "Without iron, the cell grows but cannot fill itself with haemoglobin, so it becomes small and pale"],
          ["Vitamin B12 and folate", "Absorbed from the gut", "None — availability", "Defective DNA synthesis makes the cell grow without dividing, so it becomes large"],
        ],
      },
      {
        type: "paragraph",
        text: "The erythropoietin mechanism explains a fact that looks paradoxical on first reading. A patient at altitude, or one with chronic lung disease, has a raised haematocrit; the stimulus is not the number of red cells but the oxygen delivered to kidney, which manufactures erythropoietin in response. Kidney failure abolishes the signal, which is why chronic renal disease causes one of the commonest anaemias in internal medicine, and why recombinant erythropoietin is used to correct it.",
      },

      { type: "heading", level: 2, text: "Worked example: iron is recycled, not excreted" },
      {
        type: "paragraph",
        text: "Iron has one route of exit from the body: the shedding of cells. A little leaves in the skin, the gut lining and the urine, but there is no regulated excretory pathway at all, which is why the body defends iron so fiercely and why iron supplements can be fatal to a child.",
      },
      {
        type: "table",
        headers: ["Step", "What happens", "Key quantity or fact"],
        rows: [
          ["Absorption", "In the duodenum and upper jejunum, controlled by the mucosal cell and by liver-derived hepcidin", "A few milligrams a day, set by need"],
          ["Transport", "Bound to transferrin in the plasma", "Transferrin is about one third saturated normally"],
          ["Storage", "As ferritin in the marrow, liver and spleen", "Ferritin is the storage protein, and its plasma level is the standard index of stores"],
          ["Recycling", "Macrophages of the reticuloendothelial system break down old red cells and return iron to transferrin", "Nearly all the iron for red cell production comes from recycling, not from the diet"],
          ["Excretion", "Only by unregulated cell loss — skin, gut, urine", "Why iron overdose is so dangerous and why deficiency is so common in growth and pregnancy"],
        ],
      },
      {
        type: "paragraph",
        text: "The recycling fraction is the number to remember. A healthy adult has a few grams of iron in the body, of which the circulating haemoglobin is the great majority, and the daily loss is only about one to two milligrams. So almost all of the iron a day's production requires comes out of the macrophages that yesterday cleared the debris of yesterday's red cells. This is why an iron deficiency anaemia develops slowly, and why it cannot be corrected in a week: the store has to be refilled.",
      },
      {
        type: "question",
        prompt: "A patient loses blood from a peptic ulcer for three months and is anaemic. Which nutrient defect dominates, and why is the marrow's response not enough?",
        answer: "Iron deficiency, because the blood lost carries its iron with it and there is no regulated excretion to control the shortage. The marrow responds by producing red cells, but each is small and pale because it cannot fill itself with haemoglobin.",
        explanation: "This is the slow-acting deficiency: the store must be refilled before the marrow can make normal cells, which is why the haemoglobin continues to rise for weeks after treatment starts.",
      },

      { type: "heading", level: 2, text: "B12 and folate" },
      {
        type: "paragraph",
        text: "Vitamin B12 and folate are both needed for the synthesis of DNA, because both are cofactors in the pathway that regenerates tetrahydrofolate, the one-carbon donor used for thymidine synthesis. Without them the nucleus cannot divide normally even though the cytoplasm grows, so the cell enlarges and stays nucleated — a megaloblast.",
      },
      {
        type: "table",
        headers: ["Vitamin", "Absorbed where", "Why absorption fails", "Consequence"],
        rows: [
          ["Vitamin B12", "Terminal ileum only, and only after binding intrinsic factor from the gastric parietal cells", "Pernicious anaemia destroys the parietal cells; growth or surgery of the terminal ileum removes the site; a strict vegetarian diet deprives the supply", "Megaloblastic anaemia and, uniquely, subacute combined degeneration of the cord"],
          ["Folate", "Duodenum and jejunum", "Poor diet, alcohol excess, pregnancy, methotrexate, and the anticonvulsants", "Megaloblastic anaemia, with no neurological disease"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The reason B12 deficiency causes nerve damage and folate deficiency does not is a classic examination point: vitamin B12 is a coenzyme for methylmalonyl-CoA mutase as well as for the folate pathway, and methylmalonate accumulates and is toxic to myelin. Treating a B12 deficiency with folate alone can correct the anaemia while the neurological degeneration continues.",
      },

      { type: "heading", level: 2, text: "Classifying the anaemias" },
      {
        type: "paragraph",
        text: "A full blood count answers two questions, and the two answers classify almost every anaemia. The first is the size of the cells, given by the mean corpuscular volume. The second is how hard the marrow is working, given by the reticulocyte count.",
      },
      {
        type: "table",
        headers: ["MCV", "Name", "Usual causes"],
        rows: [
          ["Below 80 fL", "Microcytic", "Iron deficiency most commonly; thalassaemia; anaemia of chronic disease; sideroblastic anaemia"],
          ["80 to 100 fL", "Normocytic", "Blood loss, haemolysis, chronic renal disease, marrow failure"],
          ["Above 100 fL", "Macrocytic", "Vitamin B12 or folate deficiency; liver disease; alcohol; hypothyroidism; some drugs"],
        ],
      },
      {
        type: "paragraph",
        text: "The reticulocyte count divides the same list differently. Reticulocytes are the young red cells that still retain ribosomal RNA, and they are a direct measure of how many cells the marrow is releasing. A high count means the marrow is working and the problem is being met — loss or destruction. A low count means the marrow is failing — deficiency, suppression or disease of the marrow itself. So the same haemoglobin of 90 g/L means completely different things in a patient with a reticulocyte count of 8 per cent and in one with a count of 0.5 per cent.",
      },
      {
        type: "callout",
        variant: "info",
        text: "A haemolytic anaemia is the one that can hide behind a normal haemoglobin if the marrow is fast enough, because the marrow compensates perfectly by increasing production. The sign that gives it away is a raised reticulocyte count with an unexplained jaundice: the red cells are being destroyed faster than they are being made.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying iron is excreted in the urine. It is not; there is no regulated excretion, which is why the typical Western diet already contains more iron than the body needs. This is also why haemochromatosis is a disease of overload rather than of loss of regulation.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating folate as equivalent to B12 because both cause a macrocytic anaemia. Folate has no neurological consequences; B12 deficiency does. Giving folate to a B12-deficient patient fixes the blood count and leaves the spinal cord to deteriorate.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Reading a low reticulocyte count as a normal finding in anaemia. In an anaemic patient the reticulocyte count should be high: a marrow that is not increasing output in the face of anaemia is a failing marrow, whatever the cause.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What is the lifespan of a red cell, and what fraction of the total must be replaced each day?",
        answer: "About 120 days, so about one per cent of the circulating red cells must be produced each day, come what may.",
        explanation: "This is why the marrow is so sensitive to anaemia, chemotherapy and infection — it has no slack in the replacement schedule.",
      },
      {
        type: "question",
        prompt: "Which two measurements of a full blood count classify the anaemias, and what does each answer?",
        answer: "The mean corpuscular volume tells you the size of the cells and therefore the likely cause; the reticulocyte count tells you whether the marrow is responding, and therefore whether the problem is loss or failure of production.",
        explanation: "Together they classify almost every anaemia into a small-cell, production-failure or haemolysis or loss pattern.",
      },
      {
        type: "question",
        prompt: "Why does iron deficiency anaemia respond only slowly to oral iron, and why does the haemoglobin keep rising after the treatment starts?",
        answer: "Because the stores have been depleted as well as the circulating haemoglobin, so most of the ingested iron at first goes into refilling the store before it becomes haemoglobin. Once the store is refilled, the marrow's full response raises the haemoglobin.",
        explanation: "Treatment is continued for weeks after the haemoglobin normalises specifically to refill the store.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which statement about the mature erythrocyte is correct?",
        options: [
          "It contains a nucleus and mitochondria so it can repair itself",
          "It is anucleate, has no mitochondria, and metabolises glucose anaerobically",
          "It is anucleate but has mitochondria so it can use the oxygen it carries",
          "It contains a nucleus so it can synthesise new haemoglobin when needed",
        ],
        correctIndex: 1,
        explanation: "The mature red cell has lost its nucleus and has no mitochondria, so it cannot make new protein or use oxidative metabolism — which is what protects the cargo it carries.",
      },
      {
        type: "mcq",
        stem: "Which organ is the main source of erythropoietin?",
        options: ["The liver", "The kidney", "The spleen", "The bone marrow"],
        correctIndex: 1,
        explanation: "Erythropoietin is made largely in the kidney in response to tissue oxygen delivery, which is why chronic renal failure causes anaemia and why measuring erythropoietin is a test of renal function.",
      },
      {
        type: "mcq",
        stem: "Which statement about iron balance is correct?",
        options: [
          "Iron is excreted in the urine under homeostatic control",
          "There is no regulated excretion of iron, so the body cannot defend itself against an excess",
          "Iron is excreted in the bile as haem",
          "Iron absorption is independent of the body's stores",
        ],
        correctIndex: 1,
        explanation: "Iron leaves only by unregulated cell loss, which is why iron overload is a real risk and why deficiency develops when needs exceed intake rather than when excretion rises.",
      },
      {
        type: "mcq",
        stem: "In which part of the gut is vitamin B12 absorbed?",
        options: ["The duodenum, after binding to transferrin", "The terminal ileum, after binding to intrinsic factor", "The jejunum, freely by diffusion", "The stomach, along with intrinsic factor itself"],
        correctIndex: 1,
        explanation: "B12 binds intrinsic factor from the gastric parietal cells and the complex is taken up in the terminal ileum — which is why pernicious anaemia, terminal ileal disease and gastrectomy all cause deficiency.",
      },
      {
        type: "mcq",
        stem: "A patient has an anaemia with a raised reticulocyte count. Which interpretation is correct?",
        options: [
          "The marrow is failing to respond",
          "The marrow is responding, so the cause is loss or destruction of red cells",
          "The patient has iron deficiency",
          "The patient has a vitamin deficiency",
        ],
        correctIndex: 1,
        explanation: "A raised reticulocyte count means the marrow is working, so haemolysis or blood loss must be the mechanism. Deficiencies and marrow failure give a count that is inappropriately low.",
      },
      {
        type: "mcq",
        stem: "Which finding distinguishes vitamin B12 deficiency from folate deficiency?",
        options: [
          "B12 deficiency alone causes a macrocytic anaemia",
          "B12 deficiency alone can cause subacute combined degeneration of the cord, because methylmalonate accumulates",
          "Folate deficiency causes neurological disease and B12 deficiency does not",
          "Neither causes any abnormality beyond the anaemia",
        ],
        correctIndex: 1,
        explanation: "B12 is a coenzyme for methylmalonyl-CoA mutase as well as the folate pathway, so its deficiency causes the neurological degeneration. Giving folate to a B12-deficient patient masks the anaemia while the cord degenerates.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Erythrocytes are produced by the marrow under erythropoietin from the kidney, live about 120 days, and die because they were built without a nucleus or mitochondria. Iron is recycled by macrophages rather than excreted, which makes deficiency slow to correct and overload genuinely dangerous, and vitamin B12 and folate are both needed for DNA synthesis, with B12 uniquely able to damage the spinal cord. Anaemia is classified by the mean corpuscular volume into microcytic, normocytic and macrocytic, and by the reticulocyte count into production failure and loss or destruction.",
      },
      {
        type: "paragraph",
        text: "Next: stopping the leak. You will follow bleeding from a damaged vessel to a sealed one through three phases — vascular, platelet and coagulation — and see how every step is a site at which a drug can help or a genetic defect can harm.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// MODULE 2 — LESSON 10 — Haemostasis & coagulation (fully authored)
// ---------------------------------------------------------------------------
function lesson10() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the three phases of haemostasis — vascular, platelet and coagulation — in order; list the vitamin K dependent clotting factors and name the drug that blocks their production; state which factors belong to the intrinsic, extrinsic and common pathways; interpret the prothrombin time and the activated partial thromboplastin time and say which drug each monitors; explain why the coagulation cascade is an example of positive feedback and why it is not a runaway process; and name the two anticoagulant systems that keep a clot local.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1 and 2. You need negative and positive feedback from Lesson 1, and membrane structure and transport from Lesson 2 for the phospholipid surface on which the cascade assembles.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Haemostasis",
        text: "The sequence by which a damaged blood vessel is sealed: the vessel constricts, platelets adhere and aggregate to form a plug, and the coagulation cascade converts soluble fibrinogen into insoluble fibrin to reinforce the plug.",
      },
      {
        type: "paragraph",
        text: "One idea holds the whole lesson together: the system exists to plug a hole, and a plug is by definition local. Every step is confined to the wound — by the properties of the damaged surface, by the need for a surface for the reactions to occur on, and by the action of inhibitors in the flowing blood around it. Haemostasis is therefore far more a problem of spatial restriction than of speed, and every bleeding disorder is either a failure to seal or a failure to keep the seal local.",
      },

      { type: "heading", level: 2, text: "The three phases" },
      {
        type: "table",
        headers: ["Phase", "Timescale", "What happens", "Clinical test"],
        rows: [
          ["Vascular", "Immediate", "Endothelial damage exposes subendothelial collagen; the vessel constricts reflexly and locally", "Not measured directly"],
          ["Platelet", "Seconds", "Platelets adhere to the exposed collagen through von Willebrand factor, become activated, and aggregate to form a plug", "The bleeding time, or now the platelet function assay"],
          ["Coagulation", "Minutes", "The cascade generates thrombin, which converts fibrinogen to fibrin to stabilise the platelet plug", "Prothrombin time and activated partial thromboplastin time"],
        ],
      },
      {
        type: "definition",
        term: "Von Willebrand factor",
        text: "The protein that binds exposed collagen and then binds platelet surface receptors, bridging the two so platelets can adhere. It is made by the endothelium and the megakaryocyte, and its absence is the commonest inherited bleeding disorder.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The two halves of the plug are complementary and both are needed. Platelets are the bricks and fibrin is the mortar, which is why aspirin and clopidogrel give a mucosal pattern of bleeding — gums, nose, gut — while a coagulation factor failure such as haemophilia gives deep bleeding into joints and muscles.",
      },

      { type: "heading", level: 2, text: "The cascade" },
      {
        type: "paragraph",
        text: "The classical diagram of the cascade is an oversimplification, and you need both the classical version, because that is what examinations use, and the cell-based version, because that is what is true. In the classical view, two pathways converge on a common pathway.",
      },
      {
        type: "table",
        headers: ["Pathway", "Trigger", "Factors in sequence", "Function"],
        rows: [
          ["Intrinsic", "Contact with a negatively charged surface such as collagen", "XII, then XI, then IX acting with its cofactor VIII, converging on X", "The amplification arm, and the one measured by the APTT"],
          ["Extrinsic", "Tissue factor released from damaged tissue", "Tissue factor (factor III) binding factor VII, converging on X", "The initiator arm, and the one measured by the PT"],
          ["Common", "Activated factor X", "X with factor V, converting prothrombin (II) to thrombin, which converts fibrinogen (I) to fibrin", "The shared final sequence"],
        ],
      },
      {
        type: "paragraph",
        text: "The modern cell-based model makes one important correction to this scheme. Tissue factor and factor VII are not merely the initiating step — they do the bulk of the work. The contact factors (XII, and high-molecular-weight kininogen and prekallikrein) turn out to matter little for stopping bleeding: people deficient in factor XII have a hugely prolonged clotting time and do not bleed at all. That is a fact worth remembering, because it tells you how little the classical cascade has to do with real haemostasis.",
      },
      {
        type: "question",
        prompt: "A patient has a normal prothrombin time and a prolonged activated partial thromboplastin time. Which part of the cascade is likely deficient?",
        answer: "The intrinsic pathway — factors XII, XI, IX or VIII. The prothrombin time measures the extrinsic and the beginning of the common pathway, so a normal PT with a prolonged APTT localises the defect to the intrinsic arm, most commonly haemophilia A (factor VIII) or haemophilia B (factor IX).",
        explanation: "The two tests are read as a pair, and their pattern localises a defect better than either alone.",
      },

      { type: "heading", level: 2, text: "The vitamin K dependent factors" },
      {
        type: "definition",
        term: "Vitamin K dependent factors",
        text: "Factors II, VII, IX and X, together with the anticoagulant proteins C and S. Vitamin K is the cofactor for the enzyme that carboxylates the glutamate residues in these proteins, which is what lets them bind calcium and the phospholipid surface on which they function.",
      },
      {
        type: "paragraph",
        text: "The warfarin sensitivity of this group is the reason the drug works. Warfarin blocks the enzyme that recycles vitamin K to its reduced form, so newly synthesised factors II, VII, IX and X cannot be carboxylated and cannot function. But note carefully which factor runs out first: factor VII has by far the shortest half-life, about six hours, and the prothrombin time — which is very sensitive to factor VII — is the first to lengthen. The antithrombotic effect takes days to build, because factor II (prothrombin) has a half-life of about three days.",
      },
      {
        type: "table",
        headers: ["Factor", "Half-life", "Consequence for therapy"],
        rows: [
          ["Factor VII", "About six hours", "The first to disappear, which is why the PT lengthens first"],
          ["Factor IX", "About 24 hours", "Of intermediate importance in the initial response"],
          ["Factor X", "About 36 hours", "Of intermediate importance in the initial response"],
          ["Prothrombin (factor II)", "About three days", "The last to fall, and the source of the true anticoagulant effect"],
          ["Protein C", "About eight hours", "Falls early, so warfarin's early procoagulant state and the skin necrosis of protein C deficiency"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Warfarin's earliest effect is paradoxically prothrombotic, because protein C — a natural anticoagulant — falls before the procoagulant factors do. This is the basis of warfarin-induced skin necrosis in protein C deficiency, and the reason a patient with an acute clot is started on heparin until the warfarin effect is established.",
      },

      { type: "heading", level: 2, text: "Worked example: the tests" },
      {
        type: "paragraph",
        text: "Two clotting tests cover almost everything that goes wrong, and their names tell you what they measure.",
      },
      {
        type: "table",
        headers: ["Test", "What is added", "Pathway measured", "Used to monitor", "Typical reference"],
        rows: [
          ["Prothrombin time (PT)", "Tissue factor and calcium, which drives the extrinsic pathway", "Factors VII, X, V, II and I", "Warfarin, reported as the INR", "About 11 to 13.5 seconds, or INR 1"],
          ["Activated partial thromboplastin time (APTT)", "A contact activator plus calcium, which drives the intrinsic pathway", "Factors XII, XI, IX and VIII, then the common pathway", "Unfractionated heparin", "About 30 to 40 seconds"],
          ["Thrombin time", "Thrombin, which converts fibrinogen directly", "Fibrinogen and the presence of inhibitors", "Direct thrombin inhibitors; fibrinogen deficiency", "About 15 to 20 seconds"],
        ],
      },
      {
        type: "paragraph",
        text: "The international normalised ratio exists because the prothrombin time depends entirely on which thromboplastin reagent the laboratory uses. The INR is a mathematical correction: it multiplies the patient's PT ratio by the international sensitivity index of the reagent, so that a value means the same thing in every hospital. The therapeutic target for most anticoagulation is an INR of about 2 to 3.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Low molecular weight heparin does not need the APTT, because it mostly potentiates factor Xa rather than thrombin and cannot be measured by a clotting test: it is monitored by anti-Xa activity, and usually only by anti-Xa activity in renal impairment or pregnancy.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying factor VI exists. There is no factor VI: the numbering was left with a gap after a factor was renumbered. The assigned factors run I, II, III, IV, V, VII, VIII, IX, X, XI, XII and XIII, plus the unassigned four functional proteins of the anticoagulant and contact systems.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying heparin is monitored by the PT. Unfractionated heparin is monitored by the APTT; warfarin is monitored by the PT and reported as the INR. Reversing the two is a classic examination slip and a real-world medication error.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Calling the clotting cascade negative feedback. Thrombin activates more thrombin generation, so it is positive feedback — and it terminates only because the trigger is covered, the activated factors are diluted in flowing blood, and anticoagulant pathways oppose them.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Give the classical three arms of the coagulation cascade with their factors.",
        answer: "The intrinsic pathway — XII, XI, IX with VIII; the extrinsic pathway — tissue factor with VII; and the common pathway — X with V, converting prothrombin to thrombin, which converts fibrinogen to fibrin.",
        explanation: "Remember that factor VI does not exist, and that in reality the tissue factor pathway is the dominant initiator.",
      },
      {
        type: "question",
        prompt: "A patient on warfarin has an INR of 2.6. Which factors are suppressed, and which is the last to fall?",
        answer: "Factors II, VII, IX and X, plus proteins C and S. Prothrombin, factor II, which has a half-life of about three days, is the last to fall.",
        explanation: "The INR is prolonged mainly by the loss of factor VII, which is short lived, but the therapeutic anticoagulant effect depends on the loss of prothrombin.",
      },
      {
        type: "question",
        prompt: "Why does a haemophiliac bleed into joints rather than into the gums?",
        answer: "Because haemophilia is a coagulation factor failure, so the fibrin mortar that stabilises a platelet plug is missing; the small mucosal injuries of daily life are held by platelets and may bleed briefly, but deep injuries that need durable fibrin clot bleed for days. That is the deep bleeding pattern of a factor failure.",
        explanation: "This is the practical difference between a primary haemostatic disorder (platelets — purpura, mucosal bleeding) and a secondary one (coagulation — haemarthrosis, muscle haematoma).",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which set of factors is vitamin K dependent?",
        options: ["Factors I, V, VIII and XIII", "Factors II, VII, IX and X", "Factors III, IV, VI and XI", "Factors XI, XII, XIII and prekallikrein"],
        correctIndex: 1,
        explanation: "Factors II, VII, IX and X, together with proteins C and S, are the carboxylated, vitamin K dependent group. Factor I is fibrinogen and factor V is not vitamin K dependent; factor VI does not exist.",
      },
      {
        type: "mcq",
        stem: "Which test best monitors warfarin therapy?",
        options: ["The activated partial thromboplastin time", "The prothrombin time, expressed as the INR", "The thrombin time", "The bleeding time"],
        correctIndex: 1,
        explanation: "The prothrombin time, reported as the international normalised ratio, monitors warfarin. The APTT monitors unfractionated heparin, and the bleeding time measures platelet function, not coagulation.",
      },
      {
        type: "mcq",
        stem: "A patient has a prolonged activated partial thromboplastin time with a normal prothrombin time and a normal thrombin time. Which deficiency is most likely?",
        options: ["Factor VII deficiency", "Factor VIII or factor IX deficiency", "Fibrinogen deficiency", "Vitamin K deficiency"],
        correctIndex: 1,
        explanation: "A prolonged APTT with a normal PT and thrombin time points to the intrinsic pathway, and haemophilia A (factor VIII) or B (factor IX) are the common causes. A factor VII deficiency prolongs the PT alone.",
      },
      {
        type: "mcq",
        stem: "Which statement about the von Willebrand factor is correct?",
        options: [
          "It is a clotting factor synthesized by the liver, and its absence causes haemophilia",
          "It bridges exposed subendothelial collagen and platelet receptors, and its absence causes the commonest inherited bleeding disorder",
          "It is the same as factor VIII and carries factor VIII in the plasma",
          "It converts fibrinogen to fibrin and is the final step of haemostasis",
        ],
        correctIndex: 1,
        explanation: "von Willebrand factor is made by endothelium and megakaryocytes, and it bridges collagen and the platelet glycoprotein receptors. It also carries factor VIII, so its absence lowers factor VIII too — but haemophilia is an inherited defect of factor VIII itself.",
      },
      {
        type: "mcq",
        stem: "Which statement about heparin is correct?",
        options: [
          "It is monitored by the prothrombin time expressed as the INR",
          "It works by potentiating antithrombin, which inactivates thrombin and factor Xa, and it is monitored by the activated partial thromboplastin time",
          "It blocks the carboxylation of factors II, VII, IX and X",
          "It dissolves an established clot by activating plasmin",
        ],
        correctIndex: 1,
        explanation: "Heparin acts through antithrombin and is followed by the APTT. Warfarin blocks carboxylation, and the plasmin activators such as streptokinase and alteplase dissolve a clot.",
      },
      {
        type: "mcq",
        stem: "Which statement about platelets and clotting is correct?",
        options: [
          "Platelets form fibrin and the coagulation cascade forms the plug",
          "Platelets form the primary plug and the cascade supplies the fibrin mesh that stabilises it",
          "Platelets and the coagulation cascade do the same thing twice",
          "Platelets are required only for the von Willebrand factor they release",
        ],
        correctIndex: 1,
        explanation: "The primary plug of aggregated platelets is stabilised by the fibrin mesh. Loss of the first half gives a purpural, mucosal bleeding pattern and loss of the second gives deep bleeding — two recognisably different clinical syndromes.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Haemostasis runs in three phases — vascular constriction, a platelet plug bridged by von Willebrand factor, and a coagulation cascade that converts soluble fibrinogen into insoluble fibrin. The classical arms are intrinsic (XII, XI, IX with VIII), extrinsic (tissue factor with VII) and common (X with V, prothrombin to thrombin to fibrin), and the vitamin K dependent factors II, VII, IX and X are what warfarin blocks. The prothrombin time and its INR monitor warfarin; the activated partial thromboplastin time monitors heparin; and the cascade is positive feedback that is confined to the wound by dilution, by the need for a surface, and by the anticoagulant pathways.",
      },
      {
        type: "paragraph",
        text: "Next: the other defence carried by blood. You will meet the innate system that acts within minutes without regard for the identity of the invader, and the adaptive system that takes days but remembers the invader for life.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// MODULE 2 — LESSON 11 — Immunity: innate & adaptive (fully authored)
// ---------------------------------------------------------------------------
function lesson11() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: distinguish the innate from the adaptive immune system by speed, specificity and memory; list the innate mechanisms and name the cells that perform them; describe complement activation by the classical and the alternative pathway and its three outcomes; describe the antigen presentation pathway and the major histocompatibility complex class I and class II; state the clonal selection hypothesis and what makes it an elegant explanation of the adaptive response; explain central tolerance and how self-reactivity is normally prevented; and give the two defining properties that distinguish T cells from B cells.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 3 to 5. The adaptive immune system is a tissue of cells with surface receptors, each with its own specificity, whose development and function is a membrane and a signalling problem.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "The two-armed immune system",
        text: "Innate immunity is immediate, non-specific and has no memory; adaptive immunity is slow to start, exquisitely specific and retains a memory that makes re-encounter with the same invader faster and stronger. Every response is a combination of the two.",
      },
      {
        type: "paragraph",
        text: "The simplest way to keep these straight is to compare the response to a first infection with the response to a second. The first infection is met within minutes by barriers, phagocytes and complement — the innate system — which buys time; over the following days, the adaptive system selects and expands the few self-reactive cells that happen to recognise the invader. In a second infection with the same organism, the adaptive response starts in hours, not days, because it remembers. Vaccination is the exploitation of exactly that difference.",
      },
      {
        type: "table",
        headers: ["Property", "Innate", "Adaptive"],
        rows: [
          ["Speed", "Minutes", "Days on first exposure; hours on re-exposure, because of memory"],
          ["Specificity", "Non-specific, recognising classes of molecule rather than an individual one", "Extremely specific, for a single molecular shape"],
          ["Components", "Barriers, phagocytes, natural killer cells, complement, cytokines, the acute phase reaction", "B lymphocytes making antibody, and T lymphocytes of helper, cytotoxic and regulatory types"],
          ["Memory", "None", "Yes — the basis of vaccination and of its long duration"],
          ["Change with re-exposure", "No amplification", "Amplified, faster and more specific"],
        ],
      },

      { type: "heading", level: 2, text: "The innate system" },
      {
        type: "table",
        headers: ["Mechanism", "How it works", "Example"],
        rows: [
          ["Physical and chemical barriers", "Exclude the organism before it can enter", "Skin, mucus, ciliated epithelium, stomach acid, antimicrobial peptides"],
          ["Phagocytes", "Engulf and kill, and then present the antigen", "Neutrophils within minutes, then macrophages"],
          ["Natural killer cells", "Kill cells that have lost MHC class I", "Virus-infected cells and tumour cells"],
          ["Complement", "A plasma cascade that opsonises, recruits and lyses", "The classical and the alternative and the lectin pathways"],
          ["Cytokines", "Chemical signals that raise the alarm locally and systemically", "Interleukin 1 and 6 and tumour necrosis factor causing fever and the acute phase reaction"],
          ["The acute phase reaction", "Systemic response driven by the liver", "Fever, raised C-reactive protein and fall in plasma iron"],
        ],
      },
      {
        type: "definition",
        term: "Complement",
        text: "A plasma cascade of about thirty proteins that converges on the formation of a membrane attack complex. Three activation routes — the classical route triggered by antibody, the alternative route triggered directly by microbial surfaces, and the lectin route triggered by microbial sugars — all converge on the cleavage of C3.",
      },
      {
        type: "paragraph",
        text: "Complement has three jobs and each is worth naming separately. Opsonisation: C3b coats the microbial surface so the phagocyte's C3b receptor can grip it. Recruitment: the fragments C3a and C5a are anaphylatoxins, which attract and activate neutrophils. Killing: the membrane attack complex of C5b to C9 inserts a pore that lyses the target. The cascade is another example of a positive-feedback loop that operates on the pathogen's surface and nowhere else, which is why it is not a runaway process.",
      },
      {
        type: "question",
        prompt: "A patient with a deficiency of C3 has repeated infections with pyogenic bacteria. Which single function of complement is most directly lost, and why does it matter more than the lytic function?",
        answer: "Opsonisation, the coating of the bacterial surface with C3b so phagocytes can grip it. The lytic membrane attack complex is only effective against Neisseria, so a C3-deficient patient cannot be helped by it — what they have lost is the hand-hold for phagocytosis.",
        explanation: "This is why C3 deficiency gives a pyogenic infection pattern rather than a vulnerability to lysis-sensitive organisms.",
      },

      { type: "heading", level: 2, text: "Antigen presentation" },
      {
        type: "paragraph",
        text: "The adaptive response cannot recognise a whole bacterium; it recognises a peptide, and only a peptide shown to it on the surface of another cell. The molecule that does the showing is the major histocompatibility complex, and which of its two classes is used decides which kind of lymphocyte sees the fragment.",
      },
      {
        type: "table",
        headers: ["MHC class", "Where it is found", "What it shows", "Who sees it", "Meaning"],
        rows: [
          ["Class I", "On every nucleated cell and on platelets", "Peptides derived from proteins made inside the cell", "CD8 cytotoxic T cells", "The cell is making something abnormal — kill it"],
          ["Class II", "On antigen-presenting cells only: dendritic cells, macrophages and B cells", "Peptides derived from material taken up from outside the cell", "CD4 helper T cells", "There is something in the environment worth responding to — orchestrate the response"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The class I route is why a virally infected cell is doomed. It cannot hide: every peptide made by the virus is trimmed, loaded onto a class I molecule and displayed on the surface, where a patrolling cytotoxic T cell can read it and kill the cell before more virus is made.",
      },

      { type: "heading", level: 2, text: "Clonal selection" },
      {
        type: "definition",
        term: "Clonal selection",
        text: "The hypothesis that each lymphocyte carries a single, unique receptor before it ever meets its antigen; that the body maintains a library of such cells covering essentially every possible shape; and that an encounter with the matching antigen selects that cell, which then divides into a clone of effector cells and of memory cells.",
      },
      {
        type: "paragraph",
        text: "Clonal selection is worth understanding rather than merely memorising, because it answers the two central questions of immunology at once. How does the body respond to an organism it has never seen? Because the library already contains a cell that will recognise it, by chance. And how does it do so without being told in advance which cells matter? Because the antigen does the selecting: only the matching cell proliferates, so the response is automatically proportionate to what is actually present.",
      },
      {
        type: "table",
        headers: ["Step", "What happens", "Timescale"],
        rows: [
          ["Generation", "Random rearrangement of receptor genes produces a library of about 10 billion different specificities", "Lifelong, from the marrow and the thymus"],
          ["Selection", "An antigen selects the few lymphocytes whose receptors bind it", "Days"],
          ["Expansion", "The selected cell divides into a clone of effector cells", "Days"],
          ["Effector action", "B cells secrete antibody; helper T cells direct the response and cytotoxic T cells kill the infected cell", "Days to weeks"],
          ["Memory", "A subset of the clone persists as memory cells", "Years to life, and this is what a vaccine builds"],
        ],
      },

      { type: "heading", level: 2, text: "Tolerance and autoimmunity" },
      {
        type: "paragraph",
        text: "A system that generates receptors at random will inevitably produce some that bind self. Two mechanisms prune them out, and their failure produces autoimmune disease.",
      },
      {
        type: "table",
        headers: ["Mechanism", "Where it happens", "What it does", "Failure produces"],
        rows: [
          ["Central tolerance by negative selection", "The thymus for T cells; the marrow for B cells", "Deletes lymphocytes that recognise self antigen strongly, in the presence of the self antigen being displayed", "Escape of self-reactive clones, giving organ-specific and systemic autoimmunity"],
          ["Peripheral tolerance", "Everywhere in the body", "Inactivates or suppresses any self-reactive clone that escaped the central pruning", "Breakdown of tolerance, as in the association of HLA type with autoimmune disease"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The connection between the MHC type and autoimmune disease is one of the strongest genetic associations in medicine: the HLA-B27 type is powerfully associated with ankylosing spondylitis, and HLA-DR3 and HLA-DR4 with type 1 diabetes. The reason is straightforward — a class II molecule that presents a self peptide well will present it well to a self-reactive helper T cell.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the innate system has memory. It does not, and the second infection is met as briskly as the first, which is the difference in a sentence. The adaptive system remembers, which is why a vaccine works.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying B cells make antibody while T cells kill infected cells, as if each lymphocyte did only one thing. Helper T cells direct, cytotoxic T cells kill, regulatory T cells suppress; B cells secrete antibody and also present antigen. The CD4 and CD8 markers are the labels, not the whole story.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying class II MHC is on all cells. It is on antigen-presenting cells and on activated T cells. Put class I on the nucleated cells of the body and class II on the professional antigen-presenting cells, and the whole division is clear.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Distinguish the innate from the adaptive immune system by three features.",
        answer: "Speed, specificity and memory. Innate is immediate, non-specific and has no memory; adaptive takes days on first exposure, is specific for one shape, and retains a memory that speeds the second response.",
        explanation: "The memory is the property that vaccination is built on, and the specificity is what a serological test exploits.",
      },
      {
        type: "question",
        prompt: "State the clonal selection hypothesis and what it explains about a first infection.",
        answer: "Each lymphocyte carries a single unique receptor, generated at random, and the antigen selects the one that matches; that cell divides into a clone of effectors and memory cells. It explains how a first infection can be met at all, because the responding cell already exists by chance rather than being induced into existence.",
        explanation: "The response is also automatic in scale, because only the matching clones proliferate.",
      },
      {
        type: "question",
        prompt: "A virus infects a liver cell. How is the infection signalled to the immune system, and which cell type does the killing?",
        answer: "Viral peptides are synthesised inside the cell, trimmed, loaded onto MHC class I and displayed on the surface. A cytotoxic CD8 T cell with the matching receptor binds and kills the infected cell.",
        explanation: "The infected cell cannot be helped by antibody, which cannot cross cell membranes; it must be killed by a lymphocyte that reads the class I display.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which feature is unique to the adaptive immune system?",
        options: ["Speed of response", "An ability to distinguish self from non-self", "Immunological memory", "The use of phagocytosis"],
        correctIndex: 2,
        explanation: "Both systems distinguish self from non-self and both can engulf material. The adaptive system is set apart by its memory, which is also the property a vaccine is designed to build.",
      },
      {
        type: "mcq",
        stem: "Which molecule bridges exposed collagen and platelet receptors, allowing platelets to adhere in the first moments of haemostasis?",
        options: ["Fibrinogen", "Thrombin", "von Willebrand factor", "Complement C3b"],
        correctIndex: 2,
        explanation: "von Willebrand factor binds exposed collagen with one end and the platelet glycoprotein receptor with the other. Fibrinogen bridges platelets to each other in aggregation, which is a later step.",
      },
      {
        type: "mcq",
        stem: "Which combination describes MHC class I correctly?",
        options: [
          "Found on antigen-presenting cells only, showing peptides from outside the cell to CD4 cells",
          "Found on all nucleated cells, showing peptides made inside the cell, read by CD8 cells",
          "Found on T cells only, showing antigen to CD4 cells",
          "Found only on B cells, showing antigen for presentation to antibody",
        ],
        correctIndex: 1,
        explanation: "Class I is on every nucleated cell and shows the cell's own synthesis, which is what lets a cytotoxic T cell read a virus infection. Class II is on antigen-presenting cells and is read by CD4 helper cells.",
      },
      {
        type: "mcq",
        stem: "A patient lacks the ability to present antigen on MHC class II. Which cell population is most directly affected?",
        options: ["CD8 cytotoxic T cells", "CD4 helper T cells", "Natural killer cells", "Neutrophils"],
        correctIndex: 1,
        explanation: "Class II is read by the CD4 positive helper T cells, so a failure of class II presentation leaves the CD8 cytotoxic population and the innate cells largely intact but removes the orchestration of the response.",
      },
      {
        type: "mcq",
        stem: "Which outcome is NOT a function of complement activation?",
        options: ["Opsonisation of the microbial surface", "Recruitment of neutrophils by the C3a and C5a fragments", "Osmotic lysis through the membrane attack complex", "Clonal selection of lymphocytes"],
        correctIndex: 3,
        explanation: "Complement opsonises, recruits and lyses. Clonal selection is a property of the lymphocyte repertoire and belongs to the adaptive system.",
      },
      {
        type: "mcq",
        stem: "Which statement about T and B lymphocytes is correct?",
        options: [
          "Both mature in the thymus and both secrete antibody",
          "T cells mature in the thymus and B cells mature in the bone marrow, and B cells make antibody",
          "Both mature in the marrow, and T cells make antibody",
          "T cells mature in the marrow and B cells in the thymus",
        ],
        correctIndex: 1,
        explanation: "T for thymus and B for bone marrow, and antibody is made by B cells and their plasma cell descendants. The naming is the mnemonic.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The immune system has two arms. Innate immunity is immediate and non-specific: barriers, phagocytes, natural killer cells and a complement cascade that opsonises, recruits and lyses. Adaptive immunity is slow, specific and remembering: antigen is processed, displayed on MHC class I for CD8 cells and class II for CD4 cells, and the matching lymphocyte — already existing by chance — is selected to proliferate into effectors and memory. Tolerance is maintained centrally and peripherally, and its failure is autoimmune disease.",
      },
      {
        type: "paragraph",
        text: "That completes Module 2 of the physiology course. The next module turns to the heart and circulation, where the same principle of a defensible variable is applied to the pressure that drives everything you have just learned through the vessels.",
      },
    ],
  };
}

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
  { title: "Blood composition & plasma", module: 2, estimatedMinutes: 30, authored: true , concept: { title: "Blood composition and plasma proteins", slug: "blood-composition", summary: "Plasma and formed elements, the plasma proteins, haematocrit and the osmotic and transport functions of blood.", blooms: "remember", minutes: 30, prereq: ["clinical-myasthenia-channelopathies"] }, content: lesson7() as never },
  { title: "Haemoglobin & oxygen carriage", module: 2, estimatedMinutes: 45, authored: true , concept: { title: "Haemoglobin and oxygen transport", slug: "haemoglobin-oxygen", summary: "Haemoglobin's structure and cooperativity, the oxyhaemoglobin dissociation curve, and the factors that shift it.", blooms: "analyze", minutes: 45, prereq: ["blood-composition"] }, content: lesson8() as never },
  { title: "Erythrocytes, iron & anaemia", module: 2, estimatedMinutes: 35, authored: true , concept: { title: "Erythrocytes, iron and anaemia", slug: "erythrocytes-iron", summary: "Red cell production, iron metabolism and the classification of anaemias by size and production.", blooms: "apply", minutes: 35, prereq: ["blood-composition"] }, content: lesson9() as never },
  { title: "Haemostasis & coagulation", module: 2, estimatedMinutes: 45, authored: true , concept: { title: "Haemostasis and coagulation", slug: "haemostasis", summary: "Vascular, platelet and coagulation phases, the intrinsic and extrinsic pathways, and the positive-feedback role of thrombin.", blooms: "analyze", minutes: 45, prereq: ["blood-composition"] }, content: lesson10() as never },
  { title: "Immunity: innate & adaptive", module: 2, estimatedMinutes: 45, authored: true , concept: { title: "Innate and adaptive immunity", slug: "immunity", summary: "Barriers, phagocytes, complement, antigen presentation and the clonal selection of lymphocytes, with tolerance.", blooms: "understand", minutes: 45, prereq: ["membrane-transport"] }, content: lesson11() as never },

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

export // ---------------------------------------------------------------------------
// MODULE 2 — LESSON 19 — Blood groups & transfusion (fully authored)
// A new concept in the spine: blood-groups-transfusion.
// ---------------------------------------------------------------------------
function lesson19() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: state the ABO antigens and antibodies of the four blood groups and the crossmatching principle; explain why O negative is the universal donor for red cells and why AB is the universal recipient; state the Rh D antigen's role in haemolytic disease of the newborn and the action of anti-D prophylaxis; name the components of blood that can be stored and for how long; describe the features of an acute haemolytic transfusion reaction and the immediate management; and explain what a crossmatch is for and which reactions it prevents.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1 and 7, for the antigen-antibody principle and the composition of blood; and Lesson 8 for the consequences of haemolysis.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Compatibility",
        text: "A transfusion is compatible if the recipient's plasma contains no antibody that will destroy the donor's red cells. The donor's antigens matter to the recipient's plasma, and the donor's plasma matters far less, because it is diluted by the larger volume being transfused.",
      },
      {
        type: "paragraph",
        text: "Everything in transfusion medicine follows from one asymmetry: an antibody that reacts with a cell surface antigen destroys that cell, and it does so in the recipient's bloodstream. So the question is never what the donor's plasma can do, but what the recipient's plasma will do to the donor's cells. Keep that asymmetry and the ABO rules stop being a mnemonic and become a derivation.",
      },
      {
        type: "table",
        headers: ["Blood group", "Antigens on the red cell", "Antibodies in plasma", "Meaning"],
        rows: [
          ["O", "Neither A nor B", "Anti-A and anti-B", "Cells have no antigen to be attacked, hence the universal donor red cell"],
          ["A", "A antigen", "Anti-B", "Has one antigen, so it must avoid anti-B and can receive A or O"],
          ["B", "B antigen", "Anti-A", "Has the B antigen, so can receive B or O"],
          ["AB", "Both A and B", "Neither anti-A nor anti-B", "No antibody to attack anything, hence the universal recipient"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The ABO antibodies are naturally occurring: they are made without any transfusion or pregnancy, against the gut bacteria whose surface sugars resemble the A and B antigens. That is the crucial difference from the Rh D antibody, which only appears after exposure.",
      },

      { type: "heading", level: 2, text: "Worked example: why O negative is the universal donor" },
      {
        type: "paragraph",
        text: "Take an O negative unit and ask which recipient could be harmed by it. The cells carry neither A nor B and no D, so no plasma antibody anywhere can find a target on them: any ABO group and any Rh type can receive them. That is the entire reason O negative is the emergency stock and the reason it is reserved for emergencies — using it on a patient whose own group is known depletes a resource that is 6 per cent of the supply and needed by anyone.",
      },
      {
        type: "paragraph",
        text: "Now take an AB positive recipient and ask which donor cells could be destroyed by their plasma. AB recipient plasma has neither anti-A nor anti-B, so no ABO group's cells can be attacked; and being Rh positive, the D antigen is no longer foreign. An AB positive patient can therefore receive from any ABO and any Rh group, which is why AB positive is the universal recipient and why an AB positive patient should give blood platelets rather than red cells.",
      },

      { type: "heading", level: 2, text: "The Rh system and haemolytic disease of the newborn" },
      {
        type: "definition",
        term: "Rh D sensitisation",
        text: "The development of anti-D antibody in an Rh negative individual after exposure to Rh positive red cells, which occurs in pregnancy and delivery as well as in transfusion. Once formed, the antibody crosses the placenta and destroys the red cells of any subsequent Rh positive fetus.",
      },
      {
        type: "paragraph",
        text: "The sequence is worth stating in order, because it is the reason for a routine injection that has almost eliminated a disease. In a first pregnancy with an Rh positive fetus, fetal red cells enter the maternal circulation, chiefly at delivery. The mother makes anti-D. In a second pregnancy with an Rh positive fetus, her antibody crosses the placenta and destroys the fetal red cells, causing anaemia, oedema and hydrops fetalis. Anti-D prophylaxis gives passive anti-D at delivery that clears the fetal cells before the mother can mount her own response, and the sensitisation never happens.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Only Rh negative pregnant women need the injection, and it is given at 28 weeks and again after delivery, and after any potentially sensitising event — a miscarriage, an abortion, an amniocentesis or an abdominal trauma.",
      },

      { type: "heading", level: 2, text: "Blood components and storage" },
      {
        type: "table",
        headers: ["Component", "Storage", "Indication", "Note"],
        rows: [
          ["Packed red cells", "About 42 days at 1 to 6 degrees C", "Oxygen carrying capacity in anaemia or haemorrhage", "One unit raises haemoglobin about 10 g/L in an average adult"],
          ["Platelets", "About 5 to 7 days, at room temperature with agitation", "Bleeding with a low platelet count", "Needle size and the risk of bacterial growth set the short shelf life"],
          ["Fresh frozen plasma", "About one year frozen", "Multiple factor deficiencies, warfarin reversal when concentrate is unavailable", "Thawed and used within hours"],
          ["Cryoprecipitate", "About one year frozen", "Fibrinogen replacement, hypofibrinogenaemia", "Rich in fibrinogen, factor VIII and von Willebrand factor"],
        ],
      },

      { type: "heading", level: 2, text: "Worked example: the acute haemolytic transfusion reaction" },
      {
        type: "paragraph",
        text: "An acute haemolytic reaction is the obstruction of the renal tubules by free haemoglobin and free haem, plus the hypotension and the disseminated intravascular coagulation of massive complement activation. It begins minutes into the transfusion, and it is caused almost always by ABO incompatibility, which is a clerical error.",
      },
      {
        type: "table",
        headers: ["Feature", "Finding", "Mechanism"],
        rows: [
          ["Timing", "Within minutes of starting the transfusion", "Pre-formed antibody binds donor cells at once"],
          ["Signs", "Fever, loin pain, hypotension, oozing from puncture sites, and red or brown urine", "Complement activation, renal tubular obstruction by free haem, and disseminated intravascular coagulation"],
          ["Management", "Stop the transfusion immediately, keep the line open with saline, and send the unit and a fresh sample back to the laboratory", "The reaction must be separated from contamination and from a bacterial reaction"],
          ["Prevention", "The crossmatch, and the identity check at the bedside", "Most reactions are clerical errors in taking, labelling or administering the sample"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The first thing to do is stop the transfusion. Do not wait for a laboratory result, do not attempt to catch up with a second unit, and do not give a diuretic on the assumption that it is only a mild reaction. Every minute of contact with the mismatched blood adds to the free haemoglobin load.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying O negative plasma is the universal donor. For red cells O negative is universal because the cells lack the antigens; but O plasma contains both anti-A and anti-B, so for plasma it is AB plasma that is the universal donor and O plasma is group specific.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Believing anti-D is present from birth. It is not: it is acquired, which is why the first pregnancy can be Rh positive and unharmed while the second is the dangerous one.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a crossmatch is unnecessary when the group is known. The crossmatch is what detects antibodies to systems other than ABO and D — anti-Kell, anti-Duffy, anti-Kidd — and those antibodies, if unsuspected, are just as dangerous as an ABO one.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why is a group O patient described as the universal donor of red cells but not of plasma?",
        answer: "The O red cell has no A or B antigen for a recipient's antibody to attack, so its cells can go into any recipient. But O plasma contains both anti-A and anti-B, so it must not be given to a non-O recipient. For plasma the universal donor is AB, whose plasma has neither antibody.",
        explanation: "The asymmetry is central: what matters is the recipient's plasma attacking the donor's cells.",
      },
      {
        type: "question",
        prompt: "State the mechanism and the prevention of haemolytic disease of the newborn.",
        answer: "An Rh negative mother is sensitised by Rh positive fetal red cells at delivery and makes anti-D; in a later Rh positive pregnancy that antibody crosses the placenta and destroys fetal red cells. Anti-D given at 28 weeks and at delivery clears the fetal cells before the mother can be sensitised, and the disease is prevented.",
        explanation: "The disease is therefore one that only exists in a second or later pregnancy, and it is the reason the injection is given after the first delivery as well as in the third trimester.",
      },
      {
        type: "question",
        prompt: "A patient has fever, loin pain and a falling blood pressure ten minutes into a transfusion. What are the first three actions?",
        answer: "Stop the transfusion immediately, keep the vein open with saline, and send the unit, the giving set and a fresh blood sample from the patient back to the laboratory for checking.",
        explanation: "The combination suggests an acute haemolytic reaction, almost always from an ABO error, which is a medical emergency.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which statement about the ABO system is correct?",
        options: [
          "Group O individuals have both anti-A and anti-B antibodies and no A or B antigens on their cells",
          "Group AB individuals have both anti-A and anti-B antibodies",
          "Group A individuals have anti-A antibodies and the A antigen",
          "Group O individuals have no antibodies, which is why they are universal recipients",
        ],
        correctIndex: 0,
        explanation: "Group O carries neither A nor B antigen but does carry both antibodies. Group AB carries both antigens and neither antibody, so it is the universal recipient.",
      },
      {
        type: "mcq",
        stem: "Which blood group is described as the universal donor of red cells in an emergency?",
        options: ["O positive", "O negative", "AB positive", "AB negative"],
        correctIndex: 1,
        explanation: "O negative red cells have neither A nor B nor D antigen, so no recipient's plasma can destroy them. O positive is nearly as versatile but carries the D antigen.",
      },
      {
        type: "mcq",
        stem: "Why does haemolytic disease of the newborn affect a second pregnancy but rarely a first?",
        options: [
          "The fetus in a second pregnancy has a different blood group",
          "The mother must first be sensitised by fetal red cells, which happens at the first delivery, before she can make antibody in a later pregnancy",
          "Anti-A and anti-B antibody appears only after the first pregnancy",
          "The placenta becomes more permeable in a second pregnancy",
        ],
        correctIndex: 1,
        explanation: "Anti-D is an acquired antibody, so the immune response requires a previous exposure. Anti-D prophylaxis given after the first delivery prevents that exposure from ever being established.",
      },
      {
        type: "mcq",
        stem: "Which component of blood is stored for the shortest time, and why?",
        options: [
          "Packed red cells, because they metabolise glucose",
          "Fresh frozen plasma, because it has a short shelf life",
          "Platelets, because they must be kept at room temperature with agitation and support bacterial growth",
          "Cryoprecipitate, because the proteins denature",
        ],
        correctIndex: 2,
        explanation: "Platelets survive only about 5 to 7 days, because they are stored warm and agitated, so any contaminating bacteria can multiply. Red cells are kept cold and last 42 days.",
      },
      {
        type: "mcq",
        stem: "Which is the correct first step in managing a suspected acute haemolytic transfusion reaction?",
        options: [
          "Send the unit back for a clerical check while the transfusion continues",
          "Stop the transfusion immediately and keep the line open with saline",
          "Give a diuretic to protect the kidney",
          "Transfuse platelets to treat a possible factor deficiency",
        ],
        correctIndex: 1,
        explanation: "The transfusion must be stopped at the bedside before anything else, because continued contact adds to the free haemoglobin load; the rest follows afterwards.",
      },
      {
        type: "mcq",
        stem: "Which statement about anti-D prophylaxis is correct?",
        options: [
          "It is given to every pregnant woman regardless of her Rh group",
          "It is passive anti-D given to Rh negative mothers at about 28 weeks, after delivery, and after any sensitising event",
          "It is active immunisation of the fetus against the D antigen",
          "It is given only after a positive direct antiglobulin test",
        ],
        correctIndex: 1,
        explanation: "Anti-D is passive antibody given to the Rh negative mother, and it clears fetal cells before an immune response can be generated. It has almost eliminated haemolytic disease of the newborn.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Transfusion safety rests on one asymmetry: whether the recipient's plasma can destroy the donor's cells. Group O negative cells lack the antigens any plasma can attack, so they are the universal red cell donor, and AB recipient plasma lacks the antibodies, so an AB positive patient can receive from anyone. The Rh D antibody is acquired, not natural, so a first pregnancy is safe and a second is the dangerous one — which is why anti-D is given at 28 weeks and after delivery. A haemolytic reaction begins within minutes, and the first action is always to stop the transfusion.",
      },
      {
        type: "paragraph",
        text: "Next: how a clot is measured. You will name the tests that separate a platelet problem from a clotting factor problem, and the drugs that act on each.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// MODULE 2 — LESSON 20 — Coagulation tests & the drugs that act on them
// (fully authored). A new concept in the spine: coagulation-tests-anticoagulants.
// ---------------------------------------------------------------------------
function lesson20() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: state the two questions that separate a platelet bleeding disorder from a coagulation factor disorder and the bedside features of each; interpret a bleeding time, a prothrombin time and an activated partial thromboplastin time in combination; distinguish haemophilia A from haemophilia B from von Willebrand disease by the pattern of tests; explain why haemophilia A and von Willebrand disease overlap and why they are treated differently; name the four classes of anticoagulant and antiplatelet drug and their mechanism; and describe the features of disseminated intravascular coagulation.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 10 (haemostasis and coagulation), because the tests are named after the pathway they measure.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Primary against secondary haemostatic failure",
        text: "A primary haemostatic failure is of the platelet plug and gives a superficial, mucosal bleeding pattern — purpura, epistaxis, gum bleeding, menorrhagia. A secondary failure is of the fibrin clot and gives a deep pattern — haemarthroses, muscle haematomas, delayed bleeding after dental extraction. The first is a platelet disorder; the second is a coagulation disorder.",
      },
      {
        type: "paragraph",
        text: "The two patterns are the most useful distinction in the whole of haematology, and they come from the structure of the clot itself. Primary haemostasis is the bail of platelets, which holds the small vessels of the skin and the mucosa; when it fails, those vessels bleed, and the bleeding is immediate and superficial. Secondary haemostasis is the fibrin mesh, which is what holds a large injury sealed long enough to heal; when it fails, deep tissues bleed, and the bleeding is delayed and relentless.",
      },
      {
        type: "table",
        headers: ["Question", "Platelet (primary) disorder", "Coagulation (secondary) disorder"],
        rows: [
          ["Where does it bleed?", "Superficial — the skin and the mucosa", "Deep — joints, muscles and the retroperitoneum"],
          ["When after injury", "Immediately", "Delayed, hours later"],
          ["Classic presentation", "Purpura, epistaxis, gum bleeding, menorrhagia", "Haemarthrosis, muscle haematoma, bleeding days after dental extraction"],
          ["Typical disorders", "Thrombocytopenia, aspirin and clopidogrel, von Willebrand disease, uraemia", "Haemophilia A and B, warfarin and heparin, vitamin K deficiency, disseminated intravascular coagulation"],
          ["Clotting tests", "Normal PT and APTT", "Prolonged PT, APTT or both"],
        ],
      },

      { type: "heading", level: 2, text: "Worked example: reading the tests as a set" },
      {
        type: "paragraph",
        text: "No single test diagnoses anything on its own; the pattern does. The full set is a platelet count, a bleeding time or platelet function test, a prothrombin time, an activated partial thromboplastin time, a thrombin time and a fibrinogen level.",
      },
      {
        type: "table",
        headers: ["Disorder", "Platelet count", "Bleeding time", "PT", "APTT", "Interpretation"],
        rows: [
          ["Thrombocytopenia", "Low", "Prolonged", "Normal", "Normal", "A platelet problem: too few platelets to form a plug"],
          ["Aspirin effect", "Normal", "Prolonged", "Normal", "Normal", "The platelets are present but cannot aggregate"],
          ["Haemophilia A or B", "Normal", "Normal", "Normal", "Prolonged", "An intrinsic pathway factor deficiency"],
          ["von Willebrand disease", "Normal", "Prolonged", "Normal", "Prolonged", "The factor VIII carrier is missing, so factor VIII is short, and platelets cannot adhere"],
          ["Warfarin therapy", "Normal", "Normal", "Prolonged", "Prolonged", "The vitamin K dependent factors are suppressed"],
          ["Liver failure", "Low", "Prolonged", "Prolonged", "Prolonged", "A failure of synthesis and of clearance"],
          ["Disseminated intravascular coagulation", "Low", "Prolonged", "Prolonged", "Prolonged", "Consumption of platelets, factors and fibrinogen"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "von Willebrand disease is the interesting row, because it prolongs both the bleeding time and the APTT. It is a platelet adhesion defect, since von Willebrand factor is what bridges collagen to the platelet, and it also lowers factor VIII, since von Willebrand factor carries it. That double signature is what separates it from haemophilia, whose APTT is prolonged but whose platelet function is entirely normal.",
      },

      { type: "heading", level: 2, text: "Haemophilia A and B" },
      {
        type: "definition",
        term: "Haemophilia",
        text: "An X linked deficiency of factor VIII (haemophilia A) or factor IX (haemophilia B), both of which act in the intrinsic pathway. Because they are X linked recessive, the patients are almost all male and the gene is carried by females.",
      },
      {
        type: "paragraph",
        text: "Both haemophilias prolong the APTT and leave the prothrombin time normal, because the defect is on the intrinsic side of the cascade; the platelet count and the bleeding time are also normal, so the platelet plug forms — which is exactly why the bleeding is delayed until the day after a dental extraction rather than at the moment of injury. Treatment is replacement of the missing factor, given prophylactically in severe disease and on demand after injury, and the recombinant concentrates have removed the infection risk of pooled plasma.",
      },

      { type: "heading", level: 2, text: "The drugs" },
      {
        type: "table",
        headers: ["Drug", "Mechanism", "Monitored by", "Reversed by"],
        rows: [
          ["Unfractionated heparin", "Potentiates antithrombin, which inactivates thrombin and factor Xa", "The APTT, or the anti-Xa assay", "Protamine sulfate"],
          ["Low molecular weight heparin", "Mostly potentiates antithrombin against factor Xa only", "Anti-Xa activity, mainly in renal impairment or pregnancy", "Protamine, but only partially"],
          ["Warfarin", "Inhibits vitamin K epoxide reductase, blocking the carboxylation of factors II, VII, IX and X and proteins C and S", "The prothrombin time, reported as the INR", "Vitamin K, and fresh frozen plasma or prothrombin complex concentrate if urgent"],
          ["Direct oral anticoagulants", "Either thrombin inhibitors or factor Xa inhibitors", "No routine test; the anti-Xa assay for Xa inhibitors", "Andexanet alfa for the Xa inhibitors, and idarucizumab for the factor IIa inhibitor dabigatran"],
          ["Aspirin", "Irreversibly blocks the cyclooxygenase that makes thromboxane A2, inhibiting platelet aggregation", "Not monitored; risk of a platelet function problem", "New platelets, not a drug"],
          ["Clopidogrel", "Blocks the P2Y12 receptor, the final common pathway of platelet activation", "Not monitored", "New platelets, and time"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Aspirin's effect lasts seven to ten days because the inhibition is irreversible, and a platelet cannot make new cyclooxygenase — it has no nucleus. That is the reason for the seven-day gap before surgery in a patient taking it, and the same reasoning applies to any antiplatelet drug.",
      },

      { type: "heading", level: 2, text: "Worked example: disseminated intravascular coagulation" },
      {
        type: "paragraph",
        text: "Disseminated intravascular coagulation is the one condition in which everything is consumed at once. Widespread activation of coagulation generates microthrombi that obstruct small vessels, while the platelets and the clotting factors used to build them are used up, and the fibrinolysis that follows degrades the fibrin.",
      },
      {
        type: "table",
        headers: ["Feature", "Mechanism"],
        rows: [
          ["Bleeding from puncture sites and clinical bleeding", "Consumption of platelets, factors V and VIII and fibrinogen"],
          ["Schistocytes on the blood film", "Microangiopathic haemolysis as red cells are sheared across fibrin strands in small vessels"],
          ["Thrombosis of small vessels producing organ failure", "Fibrin deposition in the microcirculation"],
          ["Low platelets and a low fibrinogen with prolonged times", "Consumption, and the raised D-dimer from fibrin breakdown"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Disseminated intravascular coagulation is treated by treating the cause — usually sepsis, trauma, obstetric catastrophe or malignancy — and by replacing what has been consumed. It is not treated with an anticoagulant alone, and it is not treated with heparin except in very specific circumstances.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a normal platelet count excludes a bleeding disorder. Von Willebrand disease and a platelet function defect both give normal counts with a prolonged bleeding time. It is the function, not the number, that is at fault.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating disseminated intravascular coagulation with heparin. The bleeding of DIC comes from consumption, so the treatment is replacement of what is consumed and treatment of the underlying cause — not anticoagulation.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting that von Willebrand disease lowers factor VIII, so its treatment is desmopressin or von Willebrand factor concentrate rather than a pure factor VIII concentrate — and this is a difference of real clinical consequence.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "How do you distinguish a primary from a secondary haemostatic failure at the bedside, without a single laboratory result?",
        answer: "By the pattern of the bleeding. Primary failure bleeds immediately and superficially — purpura, epistaxis, gum bleeding, menorrhagia. Secondary failure bleeds deep and late — haemarthroses, muscle haematomas, bleeding the day after dental extraction.",
        explanation: "The pattern comes from the structure being lost: the platelet plug holds small vessels, and only the fibrin mesh holds a deep wound for long enough to heal.",
      },
      {
        type: "question",
        prompt: "Why does haemophilia A prolong the APTT and leave the prothrombin time normal, while warfarin prolongs both?",
        answer: "Because haemophilia A is a defect at factor VIII, on the intrinsic pathway only; the PT monitors the extrinsic and the start of the common pathway, so it is unaffected. Warfarin suppresses factors II, VII, IX and X, which straddles both test arms, so both times are prolonged.",
        explanation: "The tests are localising tools, and their pattern narrows the defect better than any single value.",
      },
      {
        type: "question",
        prompt: "State the mechanism and the monitoring test for each of unfractionated heparin, warfarin and aspirin.",
        answer: "Unfractionated heparin potentiates antithrombin and is monitored by the APTT; warfarin inhibits vitamin K recycling and is monitored by the PT, reported as the INR; aspirin irreversibly inhibits platelet cyclooxygenase and has no monitoring test at all.",
        explanation: "The three agents work at three different points of haemostasis — thrombin and factor Xa, the vitamin K dependent factors, and the platelet — and each has a different test or none.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which pattern of bleeding indicates a defect of the coagulation factors rather than of the platelets?",
        options: [
          "Spontaneous purpura on the forearm",
          "Bleeding into a knee joint after a fall that looked trivial",
          "Gum bleeding after brushing",
          "Epistaxis lasting twenty minutes",
        ],
        correctIndex: 1,
        explanation: "Haemarthrosis is the deep bleeding pattern of a factor failure. Purpura, gum bleeding and epistaxis are the mucosal pattern of a platelet or vessel disorder.",
      },
      {
        type: "mcq",
        stem: "Which finding is NOT part of disseminated intravascular coagulation?",
        options: [
          "A low platelet count and a low fibrinogen",
          "Schistocytes on the blood film",
          "A raised D-dimer from fibrin breakdown",
          "A normal prothrombin time and APTT with purpura only",
        ],
        correctIndex: 3,
        explanation: "DIC prolongs both the PT and the APTT, because factors are consumed. Purpura with entirely normal clotting times is a platelet or vessel disorder, not DIC.",
      },
      {
        type: "mcq",
        stem: "Which drug's effect can be reversed with protamine?",
        options: ["Warfarin", "Aspirin", "Unfractionated heparin", "Clopidogrel"],
        correctIndex: 2,
        explanation: "Protamine binds and neutralises unfractionated heparin; warfarin is reversed with vitamin K and plasma or concentrate, and the antiplatelet drugs need new platelets rather than an antidote.",
      },
      {
        type: "mcq",
        stem: "Which statement about haemophilia A is correct?",
        options: [
          "It prolongs the prothrombin time and leaves the APTT normal",
          "It is X linked recessive, prolongs the APTT, and leaves the platelet count and the bleeding time normal",
          "It is autosomal dominant and lowers the factor VIII level",
          "It gives a prolonged bleeding time with normal clotting times",
        ],
        correctIndex: 1,
        explanation: "Haemophilia A is an X linked recessive deficiency of factor VIII, so the APTT is long while the PT, platelet count and bleeding time are normal — which is exactly why the bleeding is deep and delayed rather than superficial and immediate.",
      },
      {
        type: "mcq",
        stem: "Which laboratory pattern characterises von Willebrand disease?",
        options: [
          "A prolonged APTT alone, with a normal bleeding time",
          "A prolonged bleeding time with a prolonged APTT",
          "A prolonged bleeding time alone",
          "A low platelet count alone",
        ],
        correctIndex: 1,
        explanation: "Von Willebrand disease prolongs the bleeding time because platelets cannot adhere, and the APTT because the von Willebrand factor that carries factor VIII is missing. This double signature distinguishes it from haemophilia.",
      },
      {
        type: "mcq",
        stem: "A patient taking an anticoagulant has a normal prothrombin time and a normal APTT. Which drug has this profile?",
        options: ["Warfarin", "Unfractionated heparin", "Aspirin", "A factor Xa inhibitor at a low dose"],
        correctIndex: 2,
        explanation: "Aspirin inhibits platelet function and does not distort the coagulation times, so both the PT and the APTT are normal. Warfarin prolongs the PT, and unfractionated heparin prolongs the APTT.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The tests are named after the pathway they measure, and the pattern they make together localises the defect: a prolonged APTT alone points to the intrinsic pathway, a prolonged PT alone to the extrinsic, and both to the common pathway or to a global loss of factors. Bleeding patterns predict the category — superficial and immediate for platelets, deep and delayed for factors — and the drugs map onto the same three points of haemostasis, heparin on antithrombin, warfarin on the vitamin K dependent factors, and the antiplatelet agents on platelet activation.",
      },
      {
        type: "paragraph",
        text: "Next: allergy, autoimmunity and immunodeficiency — the failures, rather than the successes, of the system you met in the last lesson.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// MODULE 2 — LESSON 21 — Hypersensitivity, autoimmunity & immunodeficiency
// (fully authored). A new concept in the spine: hypersensitivity-autoimmunity.
// ---------------------------------------------------------------------------
function lesson21() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define hypersensitivity and classify it into the four types of Gell and Coombs; state the mechanism, the timescale and a clinical example of each type; give the mechanism of anaphylaxis and its treatment; distinguish autoimmunity from immunodeficiency and give an example of each; and explain the laboratory findings in each type and how they are measured.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 11 (innate and adaptive immunity), because hypersensitivity is the immune system functioning normally against a target that causes harm, and Lesson 10 for the IgE-mast cell overlap with immediate reactions to drugs.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Hypersensitivity",
        text: "An immune response that is in itself a normal immune mechanism — antibody production, T cell activation, phagocytosis — directed against an antigen that either does not matter, as in an allergen, or is the body's own tissue.",
      },
      {
        type: "paragraph",
        text: "The entire classification rests on one question: which arm of the immune system does the damage? Types I to III are all mediated by antibody, and they differ in where the antibody is and what it activates. Type IV is the odd one out, because no antibody is involved at all — it is a T cell doing the damage directly. Learn the classification in that way and you can derive every example.",
      },
      {
        type: "table",
        headers: ["Type", "Mechanism", "Timescale", "Clinical example", "Laboratory finding"],
        rows: [
          ["I — anaphylactic (immediate)", "IgE bound to mast cells releases histamine and other mediators on re-exposure", "Minutes", "Anaphylaxis to penicillin or to peanuts; hay fever; asthma", "Raised total and specific IgE, and a positive skin prick test"],
          ["II — cytotoxic", "IgG or IgM fixes to antigen on the cell surface and kills by complement or by phagocyte opsonisation", "Hours to days", "Autoimmune haemolytic anaemia; Goodpasture syndrome; myasthenia gravis", "A positive direct antiglobulin (Coombs) test and tissue antibody"],
          ["III — immune complex", "Circulating antigen-antibody complexes deposit in tissue and activate complement there", "Days", "Serum sickness; systemic lupus erythematosus; farmer's lung", "Low complement, and a raised anti-streptolysin O titre or DNA antibody"],
          ["IV — delayed (cell mediated)", "T cells kill the target directly, or recruit macrophages to the site", "Days", "The tuberculin skin test; contact dermatitis from nickel; coeliac disease", "No antibody; a positive patch test or a positive intradermal test read at 48 to 72 hours"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The distinction between type I and type IV is the distinction between a skin prick test and a patch test. The prick test injects allergen into the dermis and looks for a weal at fifteen minutes, because the mast cell reaction is immediate; the patch test applies the allergen to intact skin and looks at 48 hours, because the T cell reaction takes days.",
      },

      { type: "heading", level: 2, text: "Worked example: anaphylaxis" },
      {
        type: "paragraph",
        text: "Anaphylaxis is the type I reaction at its most dangerous. A previously sensitised patient meets the allergen, and the IgE on mast cells and basophils cross-links, releasing histamine, tryptase and the leukotrienes. The same mediator release that produces a hay fever sneeze now happens systemically, and three vascular consequences follow: widespread vasodilation drops the blood pressure, bronchospasm narrows the airway, and mucosal oedema threatens the larynx.",
      },
      {
        type: "table",
        headers: ["Component", "What happens", "Treatment target"],
        rows: [
          ["Airway", "Tongue and laryngeal swelling obstructs", "Adrenaline, which reverses the oedema"],
          ["Breathing", "Bronchospasm and mucus plugging", "Adrenaline, then a bronchodilator"],
          ["Circulation", " Vasodilation and capillary leak drop the blood pressure", "Adrenaline, plus volume"],
          ["Tryptase", "Released by mast cells and measurable for hours", "A diagnostic test, not a treatment target"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Adrenaline is the drug that matters, and it is given as an intramuscular injection into the anterolateral thigh. Its actions address all four failure points at once — alpha constriction restores the blood pressure, beta 2 dilation opens the airway, and beta 1 stimulation supports the heart. An antihistamine and a steroid are slow and supplementary: they are not the treatment for anaphylaxis.",
      },

      { type: "heading", level: 2, text: "Autoimmunity" },
      {
        type: "paragraph",
        text: "Autoimmunity is a failure of tolerance, and it can act by any of the type II, III or IV mechanisms. Which mechanism is operating tells you what the disease looks like.",
      },
      {
        type: "table",
        headers: ["Disease", "Type", "Target", "Mechanism"],
        rows: [
          ["Autoimmune haemolytic anaemia", "II", "The red cell membrane", "Antibody coats the red cell, which is then removed in the spleen"],
          ["Myasthenia gravis", "II", "The acetylcholine receptor at the motor end plate", "Antibody blocks and destroys the receptor, so transmission fatigues"],
          ["Graves disease", "II", "The thyroid stimulating hormone receptor", "Antibody stimulates the receptor rather than blocking it, so the thyroid is overdriven"],
          ["Systemic lupus erythematosus", "III", "Nucleated material, most importantly double stranded DNA", "Immune complexes deposit in the kidney, the skin, the joints and the vessels"],
          ["Hashimoto thyroiditis", "IV", "Thyroid follicular cells", "T cells destroy the gland"],
          ["Type 1 diabetes mellitus", "IV", "Pancreatic beta cells", "T cells destroy the insulin producing cells"],
        ],
      },
      {
        type: "paragraph",
        text: "Note that Graves disease is the interesting one, because it is a type II mechanism that stimulates rather than destroys. This is a reminder that the classification is about which arm of the immune system is active, not about whether the outcome is damage — an antibody that blocks a receptor and an antibody that agonises it are both type II.",
      },

      { type: "heading", level: 2, text: "Immunodeficiency" },
      {
        type: "definition",
        term: "Immunodeficiency",
        text: "A failure of the immune system by which the body cannot mount an adequate defence, leaving the patient vulnerable to infection. It is primary when genetic and secondary when acquired, principally from drugs, infection or malnutrition.",
      },
      {
        type: "table",
        headers: ["Failure", "Vulnerability", "Example"],
        rows: [
          ["Antibody failure (B cell)", "Recurrent encapsulated bacterial infection", "Common variable immunodeficiency; X linked agammaglobulinaemia"],
          ["T cell failure", "Viral, fungal and intracellular infection", "Severe combined immunodeficiency; DiGeorge syndrome"],
          ["Phagocyte failure", "Catalase positive infection and abscesses", "Chronic granulomatous disease; neutropenia from chemotherapy"],
          ["Complement failure", "Recurrent pyogenic infection", "C3 deficiency, which is a pyogenic pattern rather than a lysis-sensitive one"],
          ["Acquired", "Opportunistic infection", "HIV, corticosteroids, biologics, malnutrition"],
        ],
      },
      {
        type: "question",
        prompt: "A patient with severe combined immunodeficiency has repeated oral thrush and Pneumocystis pneumonia but no purulent bacterial infection. Which arm of the immune system is failing, and why is the pattern not pyogenic?",
        answer: "The T cell arm is failing, which is why intracellular and fungal infection dominates. Neutrophils and antibody still work, so the pyogenic infections that a neutrophil or antibody failure gives are largely absent.",
        explanation: "This is the reverse of the pattern in complement or immunoglobulin deficiency, where recurrent pyogenic infection is dominant and intracellular organisms are rare.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying type IV hypersensitivity involves antibody. It does not: it is T cell mediated, and it is the only one of the four that has no immunoglobulin. The tuberculin test and contact dermatitis are the examples to remember.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying myasthenia gravis is a nerve disease. It is a type II hypersensitivity — antibody destroys the receptor at the motor end plate — and the lesion is at the neuromuscular junction, in a muscle that is itself perfectly normal.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating anaphylaxis with an antihistamine. Adrenaline is the treatment, given intramuscularly into the anterolateral thigh; antihistamines act on histamine only and act too slowly to matter in a life-threatening reaction.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Give the four Gell and Coombs types with one example each.",
        answer: "Type I immediate, IgE mediated — anaphylaxis. Type II cytotoxic — autoimmune haemolytic anaemia. Type III immune complex — systemic lupus erythematosus. Type IV delayed, T cell mediated — contact dermatitis and the tuberculin test.",
        explanation: "The classification is by which arm of the immune system acts, and type IV is the one that has no antibody in it at all.",
      },
      {
        type: "question",
        prompt: "Why is the tuberculin skin test read at 48 to 72 hours and the skin prick test at fifteen minutes?",
        answer: "Because the tuberculin test is a type IV response: T cells must be recruited to the site and activate, which takes days. The skin prick test is a type I response: pre-formed IgE on mast cells degranulates within minutes.",
        explanation: "The timescale of the reading is the clinical expression of the mechanism, and that is why the tests are separated in practice.",
      },
      {
        type: "question",
        prompt: "A patient with recurrent sinopulmonary infection and no memory response to vaccination is suspected of an antibody failure. Which population fails to respond, and what is the test?",
        answer: "B lymphocytes and their plasma cell descendants fail to produce opsonising antibody, and the test is a serum immunoglobulin level — typically low IgG, IgA and IgM — with an absent response to immunisation.",
        explanation: "The failure is of antibody, so the response to a vaccine, which builds precisely that, is the natural diagnostic.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which type of hypersensitivity is mediated by T cells rather than by antibody?",
        options: ["Type I, immediate", "Type II, cytotoxic", "Type III, immune complex", "Type IV, delayed"],
        correctIndex: 3,
        explanation: "Types I, II and III are all antibody mediated; type IV is the only T cell mediated one, which is why it is delayed and why no immunoglobulin is measurable.",
      },
      {
        type: "mcq",
        stem: "Which drug is the immediate treatment for anaphylaxis?",
        options: ["Intravenous hydrocortisone", "Intramuscular adrenaline into the anterolateral thigh", "Oral chlorphenamine", "Salbutamol nebuliser"],
        correctIndex: 1,
        explanation: "Adrenaline reverses the vasodilation, the bronchospasm and the mucosal oedema at once. Steroids and antihistamines are supplementary and act too slowly to be the primary treatment.",
      },
      {
        type: "mcq",
        stem: "Which disease is an example of type II hypersensitivity?",
        options: ["Systemic lupus erythematosus", "Myasthenia gravis", "Contact dermatitis to nickel", "Serum sickness"],
        correctIndex: 1,
        explanation: "Myasthenia gravis is an antibody against the acetylcholine receptor, a target on the cell surface, which is the definition of type II. Lupus is type III (immune complex) and contact dermatitis is type IV.",
      },
      {
        type: "mcq",
        stem: "Which mechanism causes the failure of tolerance in autoimmune haemolytic anaemia?",
        options: [
          "Immune complexes deposit in the spleen and activate complement",
          "Antibody coats the red cell and it is removed in the spleen",
          "T cells destroy the red cell precursors in the marrow",
          "IgE bound to mast cells in the marrow releases histamine",
        ],
        correctIndex: 1,
        explanation: "It is a type II mechanism: IgG coats the red cell, the spleen's macrophages recognise the antibody and remove the coated cell, and the result is a haemolytic anaemia with a positive direct antiglobulin test.",
      },
      {
        type: "mcq",
        stem: "A patient with severe combined immunodeficiency has repeated oral candidiasis and Pneumocystis pneumonia. Which arm of the immune system is failing?",
        options: ["The B cell arm", "The T cell arm", "The neutrophil arm", "The complement cascade"],
        correctIndex: 1,
        explanation: "T cell failure exposes the patient to intracellular and fungal infection. B cell and neutrophil failures give a pyogenic pattern, and complement failure gives recurrent pyogenic infection.",
      },
      {
        type: "mcq",
        stem: "Which statement about Gell and Coombs type III reactions is correct?",
        options: [
          "They are mediated by IgE on mast cells",
          "They involve circulating antigen-antibody complexes that deposit in tissue and activate complement there",
          "They are mediated by T cells and are read at 48 hours",
          "They involve antibody that fixes to antigen on a cell surface",
        ],
        correctIndex: 1,
        explanation: "Type III is immune complex disease: the complexes form in the circulation, deposit in kidney, skin and joints, and fix complement locally. Type I is the mast cell reaction and type IV is the T cell reaction.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Hypersensitivity is the normal immune machinery turned to a harmful target. Type I is IgE and mast cells, and its extreme is anaphylaxis, treated with intramuscular adrenaline. Type II is antibody against a cell surface, which can block as in myasthenia or stimulate as in Graves disease. Type III is circulating immune complex deposited in tissue, of which lupus is the prototype. Type IV is T cell mediated and has no antibody in it at all. Autoimmunity is tolerance failing and immunodeficiency is the immune system failing — the two are opposites.",
      },
      {
        type: "paragraph",
        text: "That completes Module 2 of the physiology course: blood and what it carries, how it stops leaking, and how it defends. The next module turns to the heart, and to the pressure that drives everything through the vessels.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// MODULE 2 — LESSON 22 — Clinical correlation: clots, bleeds & anaemias at
// the bedside (fully authored). A new concept in the spine: clinical-blood-disorders.
// ---------------------------------------------------------------------------
function lesson22() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: construct a differential for a patient presenting with anaemia from the history, the blood film and the three key indices; recognise the clinical pattern of a thrombotic microangiopathy and distinguish it from disseminated intravascular coagulation; state the features and immediate management of deep vein thrombosis and of pulmonary embolism; explain why malaria is the first diagnosis to consider in a traveller with haemolysis; and apply the six Ps and the venous thromboembolism risk assessment to a single patient.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 7 to 21, the whole of Module 2. This lesson consolidates the blood composition, the oxygen carriage, the red cell, haemostasis and immunity lessons into bedside reasoning.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "The three questions of anaemia",
        text: "Is the marrow producing enough cells? Are the cells being destroyed? Are the cells being lost? Every anaemia is answered by these three questions, and the blood count with the reticulocyte count is what lets you ask them.",
      },
      {
        type: "paragraph",
        text: "At the bedside, anaemia is not a laboratory value but a symptom complex, and the first question is not which number is low but how sick the patient is. The symptoms are those of oxygen delivery failing — fatigue, breathlessness, angina in a patient with coronary disease, syncope — and the signs are those of reduced blood volume or the compensatory response. Only after that do you look at the film.",
      },
      {
        type: "table",
        headers: ["Question", "What the blood count answers", "Classic disease"],
        rows: [
          ["Is the marrow producing enough?", "The reticulocyte count — low means the marrow is not responding", "Iron deficiency, B12 and folate deficiency, anaemia of chronic disease, marrow failure, renal disease"],
          ["Are the cells being destroyed?", "A raised reticulocyte with jaundice, a raised bilirubin and a low haptoglobin", "Haemolysis — hereditary spherocytosis, sickle cell disease, malaria, autoimmune haemolysis, a transfusion reaction"],
          ["Are the cells being lost?", "A raised reticulocyte with a history of bleeding, and a normal bilirubin", "Gastroestinal blood loss, menorrhagia, trauma"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Haptoglobin is the protein that scavenges free haemoglobin from haemolysed red cells. When haemolysis is brisk it is cleared from the plasma, so a low haptoglobin with a raised lactate dehydrogenase and a raised unconjugated bilirubin is the triad of a haemolytic anaemia.",
      },

      { type: "heading", level: 2, text: "Worked example: the blood film as a shortcut" },
      {
        type: "paragraph",
        text: "Before the indices, the film itself. The information below is readable without a single number, and it is what a haematology laboratory will send you as a comment before it sends the counts.",
      },
      {
        type: "table",
        headers: ["Finding on the film", "Meaning", "Condition"],
        rows: [
          ["Microcytic, hypochromic cells", "Too little haemoglobin inside the cells", "Iron deficiency, thalassaemia, anaemia of chronic disease"],
          ["Macroovalocytes and hypersegmented neutrophils", "A nuclear maturation defect", "B12 or folate deficiency"],
          ["Spherocytes", "Cells that have lost membrane and can be removed by the spleen", "Autoimmune haemolysis, hereditary spherocytosis"],
          ["Schistocytes with a low platelet count", "Mechanical destruction in small vessels", "Thrombotic thrombocytopenic purpura, haemolytic uraemic syndrome, disseminated intravascular coagulation"],
          ["Sickle cells and target cells", "A haemoglobinopathy", "Sickle cell disease, haemoglobin C disease"],
          ["Ring forms in a red cell", "Malaria", "Plasmodium infection"],
          ["Reticulocytosis with polychromasia", "The marrow is responding", "Any haemolysis or any recovery after treatment"],
        ],
      },
      {
        type: "question",
        prompt: "A patient with Plasmodium falciparum has a haemoglobin of 60 g/L, jaundice, dark urine and confusion. Which mechanisms are operating, and what is the urgency?",
        answer: "Red cells are destroyed by the parasite's replication cycle, so there is haemolysis with jaundice and haemoglobinuria; anaemia is compounded by the spleen; and the dark urine contains free haemoglobin. Confusion means cerebral malaria, which is fatal within hours, so the antimalarial is given intravenously without delay.",
        explanation: "This is the first thing to ask any traveller returning from an endemic area with a haemolytic anaemia: a travel history.",
      },

      { type: "heading", level: 2, text: "Thrombotic microangiopathy" },
      {
        type: "definition",
        term: "Thrombotic microangiopathy",
        text: "Microvascular thrombosis with a mechanical haemolytic anaemia and a consumptive thrombocytopenia, caused by platelet aggregates obstructing small vessels. The platelet count is low not because production fails but because the platelets have been consumed into aggregates.",
      },
      {
        type: "table",
        headers: ["Feature", "Thrombotic thrombocytopenic purpura", "Disseminated intravascular coagulation"],
        rows: [
          ["Mechanism", "Platelet and von Willebrand factor aggregation in the microcirculation", "Systemic activation of coagulation"],
          ["Clotting times", "Normal — the coagulation cascade is not activated", "Prolonged, because factors are consumed"],
          ["Fibrinogen", "Normal", "Low"],
          ["D-dimer", "Normal", "Raised"],
          ["Bleeding", "Unusual", "Common, because nothing is left to clot"],
          ["Treatment", "Plasma exchange, and corticosteroids", "Treat the cause and replace what is consumed"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The normal clotting profile in thrombotic thrombocytopenic purpura is the key distinction: the patient is clotting, not bleeding, and platelets are being consumed in the microcirculation. Platelet transfusion in this condition is actively harmful, because the transfused platelets are consumed into the aggregates that are causing the organ damage.",
      },

      { type: "heading", level: 2, text: "Venous thromboembolism" },
      {
        type: "paragraph",
        text: "Deep vein thrombosis and pulmonary embolism are one disease in two places, and the predisposition is the Virchow triad you met in the circulation lesson: stasis, hypercoagulability and vessel wall injury. The list of provoking factors is the list of bedside risk, and it is why risk assessment is mandatory on admission.",
      },
      {
        type: "table",
        headers: ["Risk factor", "Leg of Virchow's triad it activates"],
        rows: [
          ["Prolonged immobility, long haul flight, recent operation, limb paralysis", "Stasis"],
          ["Pregnancy, the puerperium, malignancy, oestrogen therapy, thrombophilia", "Hypercoagulability"],
          ["Trauma, surgery, central venous catheterisation, previous thrombosis", "Vessel wall injury"],
        ],
      },
      {
        type: "paragraph",
        text: "The presentation of a pulmonary embolism is protean — sudden dyspnoea, pleuritic chest pain, haemoptysis, syncope, or simply an unexplained tachycardia and hypoxia. The sign of a deep vein thrombosis is a swollen, warm calf with tenderness, and the danger of any of these is not local: the embolus that comes from the leg occludes the pulmonary circulation and causes obstructive shock when the thrombus burden is large enough.",
      },
      {
        type: "table",
        headers: ["Finding", "Deep vein thrombosis", "Pulmonary embolism"],
        rows: [
          ["Site", "The deep veins of the leg or the pelvis", "The pulmonary arterial tree"],
          ["Classic signs", "Unilateral calf swelling, warmth and tenderness", "Tachycardia, tachypnoea, hypoxia, and a raised D-dimer"],
          ["Complication", "Pulmonary embolism, and post thrombotic limb", "Obstructive shock, and infarction"],
          ["Definitive imaging", "Compression ultrasound", "CT pulmonary angiography"],
          ["Treatment", "Anticoagulation", "Anticoagulation; thrombolysis if unstable"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting the two-legged presumption. A single swollen leg with a normal clinical examination still needs a D-dimer or imaging if the pretest probability is non zero, and a Wells score or a revised Geneva score exists precisely to decide which patients need imaging.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Transfusing platelets in thrombotic thrombocytopenic purpura. The low platelet count is consumption, not a production failure, so giving more platelets feeds the aggregates and worsens the organ damage.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Missing malaria because the patient has not been asked about travel. Any unexplained fever and haemolysis in a patient who has been in an endemic area requires a thick and a thin film, and repeating them three times if the clinical suspicion is high.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A patient has anaemia with a raised reticulocyte count, a raised unconjugated bilirubin and a low haptoglobin. Which of the three questions does this answer, and what is the differential?",
        answer: "It answers the second question — the cells are being destroyed. The differential includes autoimmune haemolysis, hereditary spherocytosis, sickle cell disease, G6PD deficiency, malaria and a transfusion reaction, and the first step is the blood film and a direct antiglobulin test.",
        explanation: "A raised reticulocyte count excludes a production failure, and the bilirubin and haptoglobin findings confirm that the destruction is in the circulation.",
      },
      {
        type: "question",
        prompt: "How does the laboratory distinguish thrombotic thrombocytopenic purpura from disseminated intravascular coagulation?",
        answer: "In thrombotic thrombocytopenic purpura the coagulation times, the fibrinogen and the D-dimer are normal, because the cascade is not activated and the platelets are being consumed into aggregates. In disseminated intravascular coagulation the times are prolonged and the fibrinogen low with a raised D-dimer, because factors and fibrinogen are consumed.",
        explanation: "One is a platelet-consuming microangiopathy and the other is a global consumption of everything, and the coagulation profile is what tells them apart.",
      },
      {
        type: "question",
        prompt: "A patient is eight days after a total hip replacement and becomes acutely breathless with a heart rate of 120 and a saturation of 89 per cent. What is the diagnosis, what is the mechanism, and what is the first treatment?",
        answer: "A pulmonary embolism, almost certainly from the leg veins. The mechanism is thrombus from the deep veins of the leg travelling to the pulmonary arterial tree. The first treatment is empirical anticoagulation while imaging is arranged, because the risk of untreated embolism exceeds the risk of bleeding in almost every case.",
        explanation: "The risk assessment, the clinical signs and the D-dimer are used together, and a negative D-dimer in a low probability patient can exclude the diagnosis.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which combination of results indicates haemolysis?",
        options: [
          "A raised bilirubin, a low haptoglobin and a raised reticulocyte count",
          "A low bilirubin, a low haptoglobin and a normal reticulocyte count",
          "A raised bilirubin, a raised haptoglobin and a low reticulocyte count",
          "A low mean corpuscular volume with a serum iron of 3 micromol/L",
        ],
        correctIndex: 0,
        explanation: "Haemolysis consumes haptoglobin as it scavenges free haemoglobin, produces unconjugated bilirubin, and drives the reticulocyte count up as the marrow compensates. A low mean corpuscular volume with a low iron is iron deficiency, a production problem.",
      },
      {
        type: "mcq",
        stem: "Which finding distinguishes thrombotic thrombocytopenic purpura from disseminated intravascular coagulation?",
        options: [
          "A low platelet count",
          "Schistocytes on the film",
          "A normal coagulation profile, a normal fibrinogen and a normal D-dimer",
          "A raised lactate dehydrogenase",
        ],
        correctIndex: 2,
        explanation: "A low platelet count, schistocytes and a raised lactate dehydrogenase occur in both. The normal coagulation profile in thrombotic thrombocytopenic purpura, against the prolonged times and low fibrinogen of disseminated intravascular coagulation, is the discriminator.",
      },
      {
        type: "mcq",
        stem: "Which finding on a peripheral film points to microangiopathic haemolysis rather than to a production defect?",
        options: ["Microcytes and hypochromia", "Macroovalocytes", "Schistocytes and a raised lactate dehydrogenase", "Ring sideroblasts"],
        correctIndex: 2,
        explanation: "Schistocytes are the sheared red cell fragments of a microangiopathy, and they are accompanied by a raised lactate dehydrogenase from the cell breakdown. Microcytes suggest iron and macroovalocytes suggest a vitamin deficiency.",
      },
      {
        type: "mcq",
        stem: "Which component of Virchow's triad is activated by a total hip replacement?",
        options: [
          "Only stasis, because the patient is immobile",
          "Only hypercoagulability, because of the stress response",
          "Stasis from immobility, hypercoagulability from surgery, and vessel wall injury from the prosthesis",
          "Only vessel wall injury",
        ],
        correctIndex: 2,
        explanation: "Major surgery activates all three legs at once, which is why orthopaedic patients have the highest risk of venous thromboembolism and the strongest indication for prophylaxis.",
      },
      {
        type: "mcq",
        stem: "A traveller from Nigeria has jaundice, dark urine and a haemoglobin of 60 g/L with ring forms on the film. Which is the diagnosis?",
        options: ["Autoimmune haemolytic anaemia", "Malaria", "Sickle cell crisis", "Thrombotic thrombocytopenic purpura"],
        correctIndex: 1,
        explanation: "Ring forms on the film are the diagnosis, and they should be looked for first in any traveller returning from an endemic area with a fever and a haemolytic anaemia.",
      },
      {
        type: "mcq",
        stem: "Which is the correct management of a patient with a probable pulmonary embolism who is hypotensive?",
        options: [
          "Oral anticoagulation once the diagnosis is confirmed by CT",
          "Intravenous heparin or thrombolysis while the CT is arranged",
          "A filter is placed in the inferior vena cava as first line treatment",
          "Observation, because the embolus will resolve",
        ],
        correctIndex: 1,
        explanation: "A haemodynamically unstable pulmonary embolism is an emergency, and the risk of delaying anticoagulation for imaging exceeds the risk of an unconfirmed diagnosis. Inferior vena cava filtration is reserved for patients who cannot be anticoagulated.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Bedside haematology reduces to three questions — production, destruction or loss — and the reticulocyte count with the blood film answers them. Haemolysis is a raised unconjugated bilirubin with a low haptoglobin; thrombotic microangiopathy is a normal coagulation profile with schistocytes and a low platelet count; disseminated intravascular coagulation is the same film with prolonged times, low fibrinogen and a raised D-dimer; and malaria is the first diagnosis in a traveller from an endemic area. Venous thromboembolism is one disease in two places, and its risk is the Virchow triad made into a bedside score.",
      },
      {
        type: "paragraph",
        text: "That completes Module 2. The next module begins the cardiovascular system, where the same pressure and volume logic drives everything the blood carries.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// MODULE 2 — LESSON 23 — Vaccination & herd immunity (fully authored)
// A new concept in the spine: vaccination-herd-immunity.
// ---------------------------------------------------------------------------
function lesson23() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: explain what a vaccine does and which property of the adaptive immune system it exploits; distinguish the live attenuated, inactivated, subunit and conjugate vaccine classes with an example of each; state why the measles, mumps and rubella vaccine is given at twelve months rather than at birth; explain the relationship between antigenic drift and antigenic shift and the need for annual influenza immunisation; define the herd immunity threshold and how it is calculated from the basic reproduction number; and state the consequence of falling vaccination coverage for a population.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 11 (innate and adaptive immunity), because a vaccine is a controlled exposure that deliberately builds the memory that lesson described.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Vaccination",
        text: "The deliberate exposure of the immune system to an antigen — or to the material that carries it — so that a primary response and a memory are generated before any infection occurs. It is the exploitation of immunological memory, and it is the only medical intervention that permanently changes the response to a disease before the disease arrives.",
      },
      {
        type: "paragraph",
        text: "Everything about vaccine design follows from one fact: the memory cells of the adaptive system last for years, but the primary response takes days. So the problem is not how to make an immune response, which the body does naturally — it is how to make the response without causing the disease. Vaccines differ only in how they solve that trade between safety and the strength of the response.",
      },
      {
        type: "table",
        headers: ["Class", "How it is made", "Strength of response", "Principal risk", "Example"],
        rows: [
          ["Live attenuated", "The pathogen grown so that it has lost virulence but still replicates", "Strongest, closest to natural infection, and long lasting", "It can revert, so it is unsafe in severe immunodeficiency and in pregnancy", "Measles, mumps, rubella, the oral typhoid and the BCG vaccines"],
          ["Inactivated", "The pathogen killed physically or chemically", "Weaker, so several doses or a booster are needed", "It cannot cause disease at all", "The injectable polio vaccine, the hepatitis A and rabies vaccines"],
          ["Subunit or recombinant", "Only a single protein or polysaccharide of the pathogen, often made by recombinant technology", "Good for the protein chosen, narrower than the whole pathogen", "It cannot cause disease", "The hepatitis B, the human papillomavirus and the acellular pertussis vaccines"],
          ["Conjugate", "A bacterial polysaccharide chemically joined to a carrier protein", "Overcomes the poor infant response to pure polysaccharide", "None beyond those of any injected protein", "Haemophilus influenzae type b, meningococcal and pneumococcal conjugate vaccines"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The conjugate trick is worth understanding, because it solved a real paediatric problem. A pure bacterial polysaccharide produces a weak, T cell independent response in infants under two years old — the age group at greatest risk of the invasive disease. Linking the sugar to a protein recruits the T cell help that a polysaccharide alone cannot recruit, so the vaccine works from two months of age.",
      },

      { type: "heading", level: 2, text: "Worked example: why measles vaccine waits" },
      {
        type: "paragraph",
        text: "The reasoning is the same for measles and for the whole primary infant schedule. Maternal antibody crosses the placenta in the third trimester and gives the infant protection for the first months of life. It also, however, neutralises the live attenuated measles virus in the vaccine, so a dose given too early simply does not take. The dose is therefore timed to fall after the maternal antibody has waned but before the child is exposed to the wild virus.",
      },
      {
        type: "table",
        headers: ["Stage", "What is present", "Consequence for vaccination"],
        rows: [
          ["At birth", "Maternal IgG against measles", "The infant is protected, but the live vaccine does not work"],
          ["By about twelve months", "Maternal antibody has largely waned", "The live attenuated vaccine can replicate and immunise"],
          ["In an outbreak or in a high risk setting", "Maternal antibody may persist longer in a well immunised mother", "A dose is still given at nine to twelve months, accepting the reduced take"],
        ],
      },

      { type: "heading", level: 2, text: "Antigenic drift and shift" },
      {
        type: "definition",
        term: "Antigenic drift",
        text: "The gradual accumulation of point mutations in the genes encoding surface proteins, so that the virus changes shape a little every year. The immune system's memory is still partly effective, but not fully, which is why the seasonal influenza vaccine is reformulated annually.",
      },
      {
        type: "definition",
        term: "Antigenic shift",
        text: "A sudden, large change in the surface proteins, arising from the reassortment of gene segments when two different strains infect the same cell. The population has no memory of the new combination at all, so a shift is what produces a pandemic.",
      },
      {
        type: "paragraph",
        text: "Influenza is the host for both processes, and the difference between them is the difference between a seasonal epidemic and a pandemic. Drift gives the gradual year on year change that a reformed vaccine can chase. Shift gives an entirely new virus that no existing immunity recognises, which is why pandemics arise in animals that mix influenza strains, and why surveillance of the animal reservoir is a matter of international public health.",
      },

      { type: "heading", level: 2, text: "Herd immunity" },
      {
        type: "definition",
        term: "Herd immunity",
        text: "The protection of the susceptible minority that arises when a sufficient proportion of the population is immune, because chains of transmission are broken before they reach them. The threshold is calculated from the basic reproduction number of the organism.",
      },
      {
        type: "definition",
        term: "Basic reproduction number",
        text: "The average number of secondary cases produced by one infectious person in a fully susceptible population. For measles it is high — about 15 or 18 — and for erosion of transmission it must be reduced below 1.",
      },
      {
        type: "paragraph",
        text: "The arithmetic is simple and the consequence is severe. The threshold is one minus the inverse of the reproduction number, so an organism with a reproduction number of 18 needs about 95 per cent of the population immune, while one with a reproduction number of 3 needs about 67 per cent. Measles is the most contagious of the common vaccine preventable diseases, so its required coverage is the highest, and when coverage falls below the threshold the disease returns — which is what has happened repeatedly in Europe and in Africa in the last decade.",
      },
      {
        type: "table",
        headers: ["Reproduction number", "Herd immunity threshold", "Interpretation"],
        rows: [
          ["About 2", "About 50 per cent", "Moderately transmissible"],
          ["About 4 to 5", "About 75 to 80 per cent", "Smallpox and poliovirus sit in this range, which is what global eradication needed"],
          ["About 15 to 18", "About 93 to 95 per cent", "Measles, which is why its coverage requirement is so high"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The threshold is a population, not an individual, statistic. It is also a statement about transmission, not about personal risk: an individual who is unvaccinated in a well vaccinated population is still protected, but that protection disappears the moment enough others decide the same thing. This is the reason the coverage figure, not the individual's choice, is what determines whether a disease can circulate.",
      },
      {
        type: "question",
        prompt: "A measles outbreak occurs in a region where 85 per cent of children received the vaccine. Why did the outbreak happen when 85 per cent coverage would control a disease with a reproduction number of 4?",
        answer: "Because measles has a reproduction number of about 15 to 18, so the herd immunity threshold is about 93 to 95 per cent. At 85 per cent the population is below threshold, so each case produces more than one secondary case and transmission is sustained rather than extinguished.",
        explanation: "The same 85 per cent coverage would control a disease with a reproduction number under about 7 — which is why the required coverage is disease specific and not a single number.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a live attenuated vaccine can cause the disease in a healthy person. It can cause a mild, vaccine associated infection — vaccine associated paralytic poliomyelitis is the classic exception — but in a healthy recipient the response is controlled. The danger is confined to the severely immunocompromised, in whom the live organism can replicate uncontrolled.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing antigenic drift with antigenic shift. Drift is the gradual mutation that needs an annual vaccine; shift is the reassortment that produces a novel virus and a pandemic.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the herd immunity threshold is the same for every disease. It is one minus the reciprocal of the reproduction number, so it ranges from roughly half for a poorly transmissible organism to 95 per cent for measles.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Which class of vaccine is the measles, mumps and rubella vaccine, and what is its principal contraindication?",
        answer: "It is a live attenuated vaccine, and its principal contraindication is severe immunodeficiency, with avoidance in pregnancy as well — because a live organism can replicate uncontrolled in someone who cannot control it.",
        explanation: "The contraindication follows directly from the mechanism: a live vaccine must replicate to immunise, and only an intact immune system contains that replication.",
      },
      {
        type: "question",
        prompt: "How is a conjugate vaccine made, and what problem does it solve?",
        answer: "A bacterial polysaccharide is chemically coupled to a protein carrier, which recruits the T cell help that a polysaccharide alone cannot. It solves the problem of the poor and short lived response infants give to a pure polysaccharide, which left Haemophilus influenzae type b invasive disease uncontrolled in the under-twos.",
        explanation: "The age of the disease is the age of the weakest response to the sugar, and the conjugate is what moves protection down into the first years.",
      },
      {
        type: "question",
        prompt: "State the formula for the herd immunity threshold and the approximate value for measles.",
        answer: "One minus the reciprocal of the basic reproduction number. For measles, with a reproduction number of about 15 to 18, the threshold is about 93 to 95 per cent.",
        explanation: "The high threshold is why measles coverage targets are set at 95 per cent while a disease with a reproduction number of 4 can be controlled at 75 per cent.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which property of the adaptive immune system does a vaccine exploit?",
        options: ["The speed of the innate response", "Immunological memory", "Complement activation", "The inflammatory response"],
        correctIndex: 1,
        explanation: "A vaccine is a first exposure that generates memory cells, so that the real infection is met by a secondary rather than a primary response. Speed and inflammation are properties of the innate system.",
      },
      {
        type: "mcq",
        stem: "Which statement about live attenuated vaccines is correct?",
        options: [
          "They are safe in all patients because they are weakened",
          "They replicate in the recipient, so they are contraindicated in severe immunodeficiency",
          "They contain only a single protein of the pathogen",
          "They cannot produce an immune response at all",
        ],
        correctIndex: 1,
        explanation: "A live vaccine must replicate to immunise, which makes it unsafe in severe immunodeficiency — and it is this same replication that gives it the strongest and longest lasting response.",
      },
      {
        type: "mcq",
        stem: "Which vaccine class is the hepatitis B vaccine and why?",
        options: [
          "Live attenuated, because it needs strong replication",
          "Inactivated whole virus, because the virus can be killed safely",
          "Subunit recombinant, containing only the surface antigen made by recombinant technology",
          "Conjugate, because the polysaccharide needs a protein carrier",
        ],
        correctIndex: 2,
        explanation: "Hepatitis B vaccine is a subunit recombinant vaccine containing only the surface antigen, produced in yeast. It cannot cause the disease because no viral nucleic acid is present.",
      },
      {
        type: "mcq",
        stem: "Which change in influenza produces a pandemic rather than an annual epidemic?",
        options: ["Antigenic drift", "Antigenic shift", "Point mutations in the haemagglutinin gene alone", "A fall in herd immunity alone"],
        correctIndex: 1,
        explanation: "Antigenic shift is the reassortment that produces a virus nobody has immunity to. Drift is the gradual mutation that the annual vaccine is reformulated to chase.",
      },
      {
        type: "mcq",
        stem: "A disease has a basic reproduction number of about 18. What herd immunity threshold is required?",
        options: ["About 50 per cent", "About 67 per cent", "About 80 per cent", "About 93 to 95 per cent"],
        correctIndex: 3,
        explanation: "The threshold is one minus the reciprocal of the reproduction number, and 18 gives about 0.94. This is measles, which is why its coverage target is the highest of the common childhood programmes.",
      },
      {
        type: "mcq",
        stem: "Which disease is the prototype for a pandemic arising from antigenic shift in an animal reservoir?",
        options: ["Measles", "Mumps", "Influenza", "Rubella"],
        correctIndex: 2,
        explanation: "Influenza A has an animal reservoir in poultry and pigs, in which reassortment produces novel combinations; measles, mumps and rubella are human viruses with stable antigens and no animal reservoir.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "A vaccine is a controlled first exposure that generates the memory the adaptive system already possesses. The four classes trade safety against the strength of the response — live attenuated, inactivated, subunit and conjugate — and the timing of a dose is set by the presence of maternal antibody and by the risk of exposure. Drift gives influenza its annual reformulation and shift gives it its pandemics, and the herd immunity threshold of one minus the reciprocal of the reproduction number explains why measles needs about 95 per cent coverage while a reproduction number of 4 is controlled by 75 per cent.",
      },
      {
        type: "paragraph",
        text: "Next: the module closes with the clinical correlation, where the anaemias, the clots and the bleeds are brought together into bedside reasoning.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// MODULE 2 — SBA items, one per authored concept.
// ---------------------------------------------------------------------------
const MODULE_TWO_SBAS: SbaSeed[] = [
  {
    slug: "physiology-cell-and-general--blood-composition--sba",
    concept: "blood-composition",
    stem: "Which plasma protein provides most of the plasma oncotic pressure, and why?",
    options: [
      "Fibrinogen, because it is the most concentrated plasma protein",
      "Albumin, because it is both the most abundant and the smallest, giving the greatest number of particles per litre",
      "Globulin, because the immunoglobulins are large and exert more pressure",
      "Haemoglobin, because it is confined to the red cells",
    ],
    correctAnswer:
      "Albumin, because it is both the most abundant and the smallest, giving the greatest number of particles per litre",
    explanation:
      "Oncotic pressure counts particles rather than grams, so the abundant, small albumin dominates. This is why liver failure and nephrotic syndrome, which lower albumin, cause oedema, while fibrinogen, similar in size, contributes little because it is present at a tenth the concentration.",
    difficulty: "medium",
  },
  {
    slug: "physiology-cell-and-general--haemoglobin-oxygen--sba",
    concept: "haemoglobin-oxygen",
    stem: "What happens at a fixed tissue partial pressure when the oxyhaemoglobin dissociation curve shifts to the right?",
    options: [
      "Saturation rises, so more oxygen is held and less is released",
      "Saturation falls, so more oxygen is released to the tissue",
      "Nothing changes, because a shift only affects loading",
      "The oxygen capacity of blood rises as well",
    ],
    correctAnswer: "Saturation falls, so more oxygen is released to the tissue",
    explanation:
      "A right shift lowers affinity, so at any given partial pressure saturation is lower and unloading is favoured. Arterial loading in the lung is only slightly reduced, while releasing to the tissues is substantially increased — the Bohr effect trades a little storage for a lot of delivery.",
    difficulty: "medium",
  },
  {
    slug: "physiology-cell-and-general--erythrocytes-iron--sba",
    concept: "erythrocytes-iron",
    stem: "A patient with a raised reticulocyte count is anaemic. Which mechanism is most likely?",
    options: [
      "The marrow is failing to produce red cells",
      "Red cells are being destroyed or lost, and the marrow is responding normally",
      "A deficiency of iron is preventing haemoglobin synthesis",
      "Chronic renal disease is suppressing erythropoietin",
    ],
    correctAnswer: "Red cells are being destroyed or lost, and the marrow is responding normally",
    explanation:
      "A raised reticulocyte count means the marrow is working, so haemolysis or blood loss must be the mechanism. Iron deficiency, renal disease and marrow failure all give a reticulocyte count that is inappropriately low.",
    difficulty: "medium",
  },
  {
    slug: "physiology-cell-and-general--haemostasis--sba",
    concept: "haemostasis",
    stem: "Which combination of findings is produced by warfarin therapy?",
    options: [
      "A prolonged prothrombin time with a normal activated partial thromboplastin time",
      "A prolonged activated partial thromboplastin time with a normal prothrombin time",
      "Both the prothrombin time and the activated partial thromboplastin time prolonged",
      "Both times normal, with a prolonged bleeding time",
    ],
    correctAnswer: "Both the prothrombin time and the activated partial thromboplastin time prolonged",
    explanation:
      "Warfarin suppresses factors II, VII, IX and X, which straddle both the extrinsic and the intrinsic arms, so both times are prolonged. The PT prolongs first because factor VII is the shortest lived of the group, at about six hours.",
    difficulty: "hard",
  },
  {
    slug: "physiology-cell-and-general--immunity--sba",
    concept: "immunity",
    stem: "Which feature is unique to the adaptive immune system?",
    options: [
      "Its speed, which is within minutes of exposure",
      "Its specificity, which is for an individual molecular shape",
      "Its immunological memory, which shortens the response on re-exposure",
      "Its ability to engulf and destroy pathogens",
    ],
    correctAnswer: "Its immunological memory, which shortens the response on re-exposure",
    explanation:
      "The innate system is fast and non-specific and the adaptive system is slow and specific, but only the adaptive system remembers. That memory is the property a vaccine is designed to build, and it is what makes the second infection shorter than the first.",
    difficulty: "medium",
  },
  {
    slug: "physiology-cell-and-general--blood-groups-transfusion--sba",
    concept: "blood-groups-transfusion",
    stem: "A trauma patient needs red cells before the group is known. Which is given and why?",
    options: [
      "O negative, because those red cells carry no A, no B and no D antigen for the recipient's plasma to attack",
      "AB positive, because those red cells carry neither antibody",
      "O positive, because the D antigen is irrelevant in an emergency",
      "A negative, because anti-B is the commonest naturally occurring antibody",
    ],
    correctAnswer: "O negative, because those red cells carry no A, no B and no D antigen for the recipient's plasma to attack",
    explanation:
      "Compatibility turns on whether the recipient's plasma can destroy the donor's cells, so the universal red cell donor has no antigen to be destroyed. O positive is nearly as useful but carries the D antigen, which matters in a Rh negative female of childbearing age.",
    difficulty: "medium",
  },
  {
    slug: "physiology-cell-and-general--coagulation-tests-anticoagulants--sba",
    concept: "coagulation-tests-anticoagulants",
    stem: "A patient has a prolonged bleeding time and a prolonged activated partial thromboplastin time, with a normal platelet count and a normal prothrombin time. Which diagnosis fits?",
    options: [
      "Haemophilia A",
      "Von Willebrand disease",
      "Warfarin therapy",
      "Thrombotic thrombocytopenic purpura",
    ],
    correctAnswer: "Von Willebrand disease",
    explanation:
      "The prolonged bleeding time shows a platelet adhesion defect, since von Willebrand factor is what bridges collagen to the platelet, and the APTT is prolonged because von Willebrand factor also carries factor VIII. Haemophilia A prolongs the APTT alone; warfarin prolongs both clotting times; and thrombotic thrombocytopenic purpura gives a low platelet count.",
    difficulty: "hard",
  },
  {
    slug: "physiology-cell-and-general--hypersensitivity-autoimmunity--sba",
    concept: "hypersensitivity-autoimmunity",
    stem: "Which Gell and Coombs type is represented by the tuberculin skin test?",
    options: [
      "Type I, immediate and IgE mediated",
      "Type II, cytotoxic antibody against a cell surface",
      "Type III, circulating immune complex",
      "Type IV, delayed and T cell mediated",
    ],
    correctAnswer: "Type IV, delayed and T cell mediated",
    explanation:
      "The test is read at 48 to 72 hours because T cells must be recruited to the site and activate — the timescale of the reading is the mechanism. It involves no immunoglobulin at all, which distinguishes it from the other three types.",
    difficulty: "medium",
  },
  {
    slug: "physiology-cell-and-general--vaccination-herd-immunity--sba",
    concept: "vaccination-herd-immunity",
    stem: "A patient has anaemia with a raised reticulocyte count, a raised unconjugated bilirubin, a low haptoglobin and schistocytes on the film, but entirely normal clotting. Which diagnosis fits best?",
    options: [
      "Disseminated intravascular coagulation",
      "Thrombotic thrombocytopenic purpura",
      "Vitamin B12 deficiency",
      "Iron deficiency anaemia",
    ],
    correctAnswer: "Thrombotic thrombocytopenic purpura",
    explanation:
      "Schistocytes with a low platelet count and normal coagulation is a thrombotic microangiopathy: platelets are consumed into microvascular aggregates rather than clotting factors being consumed. In disseminated intravascular coagulation the clotting times are prolonged and the fibrinogen is low with a raised D-dimer.",
    difficulty: "hard",
  },
  {
    slug: "physiology-cell-and-general--clinical-blood-disorders--sba",
    concept: "clinical-blood-disorders",
    stem: "A patient is eight days after a total hip replacement and becomes acutely breathless, tachycardic and hypoxic. What is the mechanism and the first treatment?",
    options: [
      "A fat embolism, treated with supplemental oxygen only",
      "Thrombus from the leg veins reaching the pulmonary arterial tree, treated with immediate anticoagulation while imaging is arranged",
      "Bacterial pneumonia, treated with intravenous antibiotics and fluids",
      "A haemolytic transfusion reaction, treated by stopping the blood and supporting the circulation",
    ],
    correctAnswer:
      "Thrombus from the leg veins reaching the pulmonary arterial tree, treated with immediate anticoagulation while imaging is arranged",
    explanation:
      "Major orthopaedic surgery activates all three legs of Virchow's triad — stasis, hypercoagulability and vessel wall injury — so pulmonary embolism is the diagnosis. When clinical suspicion is high, empirical anticoagulation is started before imaging, because delay is the greater risk.",
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
  { title: "Blood groups & transfusion", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Blood groups and transfusion", slug: "blood-groups-transfusion", summary: "The ABO and Rh systems, the asymmetry that decides compatibility, crossmatching, blood components and storage, and the acute haemolytic transfusion reaction.", blooms: "apply", minutes: 40, prereq: ["blood-composition"] }, content: lesson19() as never },
  { title: "Coagulation tests & anticoagulants", module: 2, estimatedMinutes: 45, authored: true, concept: { title: "Coagulation tests and anticoagulant drugs", slug: "coagulation-tests-anticoagulants", summary: "Primary against secondary haemostatic failure, the pattern of the bleeding time, PT and APTT, the haemophilias and von Willebrand disease, the anticoagulant and antiplatelet drugs, and disseminated intravascular coagulation.", blooms: "apply", minutes: 45, prereq: ["haemostasis"] }, content: lesson20() as never },
  { title: "Hypersensitivity, autoimmunity & immunodeficiency", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Hypersensitivity, autoimmunity and immunodeficiency", slug: "hypersensitivity-autoimmunity", summary: "The four Gell and Coombs types with their mechanisms and examples, anaphylaxis and its treatment, tolerance failing in autoimmunity, and the primary and secondary immunodeficiencies.", blooms: "analyze", minutes: 40, prereq: ["immunity"] }, content: lesson21() as never },
  { title: "Vaccination & herd immunity", module: 2, estimatedMinutes: 30, authored: true, concept: { title: "Vaccination and herd immunity", slug: "vaccination-herd-immunity", summary: "The memory that a vaccine builds, the live, inactivated, subunit and conjugate vaccine classes, antigenic drift and shift, and the threshold proportion of immunity that stops transmission.", blooms: "apply", minutes: 30, prereq: ["immunity"] }, content: lesson23() as never },
  { title: "Clinical correlation: clots, bleeds & anaemias at the bedside", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Clinical correlation: clots, bleeds and anaemias", slug: "clinical-blood-disorders", summary: "The three questions of anaemia, the film as a shortcut, thrombotic microangiopathy against disseminated intravascular coagulation, and venous thromboembolism with the Virchow triad.", blooms: "apply", minutes: 40, prereq: ["erythrocytes-iron", "haemostasis"] }, content: lesson22() as never },
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
    ...MODULE_TWO_EXTRA_LESSONS,
  ],
  sbas: [...MODULE_ONE_SBAS, ...MODULE_TWO_SBAS],
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
