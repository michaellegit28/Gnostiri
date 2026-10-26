import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Assessment content — Anaesthesiology (ANA 301).
 *
 * 14 original SBA items establishing the anaesthesiology bank from zero,
 * tagged to the existing ConceptNodes (see prisma/seed-university.ts).
 * Covers all ten AIIMS-spine concepts: acute medicine/applied physiology,
 * applied anaesthetic pharmacology, resuscitation, airway assessment and
 * ventilation, the unconscious patient, fluid/electrolyte/metabolic
 * management, pain management, pre-operative evaluation and monitoring,
 * anaesthetic techniques and muscle relaxants, and local anaesthesia/core
 * skills.
 *
 * Idempotent: upserts on the item slug; safe to re-run. orderIndex starts at
 * 0 because this is the first assessment bank for the course.
 *
 * Governance: every item ships reviewStatus "needs-human-review" — the
 * 2026-10-20 repair established that production rows must never sit at
 * "draft" (42 draft rows drifted live before). needsCheck flags the numeric
 * or distractor reasoning a physician should double-check.
 */

const COURSE_SLUG = "anaesthesiology";

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
  // 1 — Resuscitation: reversible causes of arrest (hard)
  {
    slug: "ana301-reversible-causes-arrest",
    concept: "resuscitation",
    format: "sba",
    stem: "During adult cardiac arrest of uncertain cause, which list contains the correct reversible causes that must be actively sought and corrected?",
    options: [
      "Hypoxia, hypovolaemia, hypo-/hyperkalaemia and metabolic disorders, hypothermia (the 4 Hs), plus thrombosis (coronary or pulmonary), tension pneumothorax, tamponade and toxins (the 4 Ts)",
      "Hypertension, hypervolaemia, hyperkalaemia, hyperglycaemia, and the four Ts: tachycardia, tremor, tetany and thyroid storm",
      "Only hypoxia, hypothermia, and toxins, because the other causes cannot be corrected during arrest",
      "Hypoxia, hypoglycaemia, hypocalcaemia, hypernatraemia, head injury, heart failure, hypertension and drugs",
    ],
    correctAnswer:
      "Hypoxia, hypovolaemia, hypo-/hyperkalaemia and metabolic disorders, hypothermia (the 4 Hs), plus thrombosis (coronary or pulmonary), tension pneumothorax, tamponade and toxins (the 4 Ts)",
    explanation: "The reversible causes of cardiac arrest are the 4 Hs — hypoxia, hypovolaemia, hypo-/hyperkalaemia and other metabolic derangements, and hypothermia — and the 4 Ts — thrombosis (coronary or pulmonary), tension pneumothorax, cardiac tamponade, and toxins. Each is treatable during arrest (e.g. needle decompression of tension pneumothorax, pericardiocentesis of tamponade, reperfusion of PE or STEMI), which is why they are actively sought rather than assumed away. Several are invisible without targeted investigation — ultrasound for tamponade, 12-lead ECG, blood gases and temperature — so the team must look for them rather than wait for them to declare themselves.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false, // 4H/4T per RC(UK) ALS guidance
  },

  // 2 — Resuscitation: ACLS drug therapy in non-shockable arrest (medium)
  {
    slug: "ana301-acls-adrenaline-asystole",
    concept: "resuscitation",
    format: "sba",
    stem: "An adult in asystolic cardiac arrest has high-quality CPR under way, the airway is secured, and intravenous access is established. What is the correct adrenaline administration strategy?",
    options: [
      "Give 1 mg adrenaline (epinephrine) intravenously as soon as access is available, then repeat 1 mg every 3–5 minutes (alternate compression cycles) without interrupting CPR",
      "Give a single 1 mg adrenaline dose and then stop, since repeated doses cause refractory hypertension",
      "Withhold adrenaline until after the third defibrillation attempt, as it is only used in shockable rhythms",
      "Give 1 mg atropine every 3 minutes as the first-line drug in asystole",
    ],
    correctAnswer:
      "Give 1 mg adrenaline (epinephrine) intravenously as soon as access is available, then repeat 1 mg every 3–5 minutes (alternate compression cycles) without interrupting CPR",
    explanation: "Adrenaline 1 mg IV/IO is given as soon as feasible in non-shockable rhythms (asystole, PEA) and after the third shock in shockable rhythms, repeated every 3–5 minutes thereafter. Its alpha-adrenergic vasoconstriction raises coronary and cerebral perfusion pressure during CPR, which is why dosing continues throughout the arrest. Defibrillation has no role in asystole, and atropine is no longer recommended for routine asystolic or slow PEA arrest.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // 1 mg every 3–5 min per ALS
  },

  // 3 — Airway assessment: predictors of difficult intubation (medium)
  {
    slug: "ana301-difficult-airway-predictors",
    concept: "airway-assessment-ventilation",
    format: "sba",
    stem: "Which set of findings is the most reliable predictor of a difficult direct laryngoscopy and intubation during pre-operative airway assessment?",
    options: [
      "Reduced neck extension, a short thyromental distance, and limited mouth opening — these are the core independent predictors in validated bedside scores",
      "A high body mass index combined with a beard, in the absence of any other neck or mouth finding",
      "Normal mouth opening and normal dentition, which reliably excludes a difficult airway in all patients",
      "Short stature, female sex, and a small jaw circumference measured on a radiograph",
    ],
    correctAnswer:
      "Reduced neck extension, a short thyromental distance, and limited mouth opening — these are the core independent predictors in validated bedside scores",
    explanation: "Difficult direct laryngoscopy is predicted by reduced atlanto-occipital extension, a short thyromental distance (typically under 6.5 cm), reduced mouth opening (under about 3 finger breadths), and abnormal dentition; these are combined in scores such as LEMON and the Wilson score with good practical utility. Obesity and a beard raise the difficulty of mask ventilation and of visualising the glottis, but neither alone predicts a difficult intubation. Normal mouth opening lowers the probability substantially but no single bedside finding has perfect sensitivity, so a failed airway plan must always be available.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // thyromental <6.5 cm, mouth opening <3 finger breadths
  },

  // 4 — Airway and ventilation: confirming tube placement (medium)
  {
    slug: "ana301-capnography-tube-confirmation",
    concept: "airway-assessment-ventilation",
    format: "sba",
    stem: "Immediately after intubation, which assessment is the most reliable single confirmation that the tracheal tube is in the trachea rather than the oesophagus?",
    options: [
      "Waveform capnography showing a sustained, repeatable end-tidal CO2 trace over at least six consecutive ventilations",
      "Auscultation of both axillae and the epigastrium by two clinicians independently",
      "Chest radiography reported as satisfactory by a radiologist",
      "Symmetric bilateral chest rise observed clinically, with normal oxygen saturation",
    ],
    correctAnswer:
      "Waveform capnography showing a sustained, repeatable end-tidal CO2 trace over at least six consecutive ventilations",
    explanation: "Continuous waveform capnography is the gold standard for confirming tracheal tube placement and monitoring it thereafter; oesophageal intubation may produce a transient small CO2 trace from gastric gas that decays within a few breaths, hence the need for a sustained trace over six or more ventilations. Clinical signs alone — chest movement, auscultation, condensation — are unreliable, with a significant miss rate even in experienced hands. A chest radiograph confirms tube depth and excludes mainstem intubation but is too slow to exclude an oesophageal tube, and saturation may remain acceptable for minutes after a very low cardiac output state.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // ≥6 ventilations per RC(UK)
  },

  // 5 — Applied anaesthetic pharmacology: malignant hyperthermia (hard)
  {
    slug: "ana301-malignant-hyperthermia-dantrolene",
    concept: "applied-pharmacology-anaesthesia",
    format: "sba",
    stem: "Twenty minutes after induction with a volatile agent, a patient develops a rising end-tidal CO2, masseter then generalised muscle rigidity, tachycardia, and temperature climbing to 40.1°C. What is the definitive treatment?",
    options: [
      "Intravenous dantrolene repeated titrated to response (2.5 mg/kg boluses up to about 10 mg/kg), with the trigger withdrawn, maximal oxygen, aggressive cooling and serial CK and potassium monitoring",
      "A cumulative maximum of 4 mg/kg IV, given only once, regardless of response",
      "Intravenous paracetamol and active cooling alone, since the hyperthermia is the primary problem",
      "Propranolol, calcium gluconate and observation on the intensive care unit",
    ],
    correctAnswer:
      "Intravenous dantrolene repeated titrated to response (2.5 mg/kg boluses up to about 10 mg/kg), with the trigger withdrawn, maximal oxygen, aggressive cooling and serial CK and potassium monitoring",
    explanation: "This is malignant hyperthermia, a pharmacogenetic disorder of skeletal muscle calcium release triggered by volatile agents and suxamethonium. Treatment is immediate dantrolene (2.5 mg/kg IV repeated to response, total doses sometimes exceeding 10 mg/kg), discontinuation of the trigger, hyperventilation with 100% oxygen, active cooling, and aggressive correction of hyperkalaemia, acidosis, arrhythmias and myoglobinuric acute kidney injury. Dantrolene is given as repeated titrated boluses rather than a single dose, because the rigidity recurs as the drug is redistributed; creatine kinase, potassium, arterial blood gases and temperature are monitored until the reaction resolves.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false, // dantrolene 2.5 mg/kg boluses, ~10 mg/kg cumulative ceiling
  },

  // 6 — Applied anaesthetic pharmacology: neuromuscular reversal (medium)
  {
    slug: "ana301-sugammadex-reversal",
    concept: "applied-pharmacology-anaesthesia",
    format: "sba",
    stem: "A 70 kg patient received rocuronium and, at the end of surgery, has residual neuromuscular blockade. Which statement about sugammadex reversal is correct?",
    options: [
      "Sugammadex reverses neostigmine-based reversal and is therefore given after neostigmine to augment it",
      "Sugammadex encapsulates rocuronium (and vecuronium) directly, allowing 2 mg/kg if objective recovery is present and 16 mg/kg for immediate reversal of a deep block, with no effect on opioids or benzodiazepines",
      "Sugammadex reverses suxamethonium and should be given before the block is assessed",
      "Sugammadex acts by increasing acetylcholine release and is contraindicated in the elderly",
    ],
    correctAnswer:
      "Sugammadex encapsulates rocuronium (and vecuronium) directly, allowing 2 mg/kg if objective recovery is present and 16 mg/kg for immediate reversal of a deep block, with no effect on opioids or benzodiazepines",
    explanation: "Sugammadex is a modified gamma-cyclodextrin that binds aminosteroid relaxants (rocuronium, vecuronium) in plasma, forming an inactive complex excreted in urine — it reverses the relaxant itself rather than inhibiting acetylcholinesterase. Dose depends on depth of block: 16 mg/kg for immediate reversal after a full rocuronium intubating dose, 4 mg/kg for a deep block with a post-tetanic count present, and 2 mg/kg when two twitches are detectable. Because it has no anticholinesterase action it is an alternative to neostigmine rather than something added after it, and it has no effect on opioids, benzodiazepines or other drug classes.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // 16/4/2 mg/kg per depth of block
  },

  // 7 — Acute medicine and applied physiology: shock classification (medium)
  {
    slug: "ana301-shock-classification",
    concept: "acute-medicine-applied-physiology",
    format: "sba",
    stem: "A patient with pneumonia is hypotensive, tachycardic, warm and flushed with bounding pulses and a wide pulse pressure, and has a raised cardiac output haemodynamic profile. Which shock mechanism does this pattern indicate?",
    options: [
      "Distributive (vasodilated) shock — markedly reduced systemic vascular resistance with a hyperdynamic circulation, as in sepsis, anaphylaxis and neurogenic shock",
      "Cardiogenic shock — a cold, vasoconstricted, oliguric patient with a low cardiac output profile",
      "Hypovolaemic shock — a cold, tachycardic patient with low filling pressures and low cardiac output",
      "Obstructive shock — a distended-neck-vein picture from tension pneumothorax, tamponade or massive pulmonary embolism",
    ],
    correctAnswer:
      "Distributive (vasodilated) shock — markedly reduced systemic vascular resistance with a hyperdynamic circulation, as in sepsis, anaphylaxis and neurogenic shock",
    explanation: "Shock is tissue hypoperfusion and is classified by the primary haemodynamic abnormality. Distributive shock — sepsis being the commonest — is warm and hyperdynamic because systemic vascular resistance collapses while cardiac output is initially preserved or high. Cardiogenic and hypovolaemic/obstructive shock are cold, vasoconstricted, low-output states; neurogenic shock, a distributive leak, is distinguished by bradycardia with the loss of sympathetic tone after cord injury. The distinction matters because distributive shock requires vasopressors once preload is corrected, whereas obstructive shock requires definitive decompression.",
    difficulty: "medium",
    marks: 1,
  },

  // 8 — Acute medicine and applied physiology: shunt hypoxaemia (hard)
  {
    slug: "ana301-shunt-refractory-hypoxaemia",
    concept: "acute-medicine-applied-physiology",
    format: "sba",
    stem: "A patient with severe pneumonia has a PaO2 of 55 mmHg on 60% oxygen that improves only marginally on 100% oxygen. Which physiological mechanism best explains the hypoxaemia?",
    options: [
      "Intrapulmonary shunt — blood perfusing non-ventilated alveoli bypasses gas exchange entirely, so raising FiO2 alone cannot oxygenate it",
      "Pure hypoventilation, which raises PaCO2, so the fix is ventilatory support alone",
      "Anaemia and reduced oxygen-carrying capacity, which lowers PaO2 in proportion to haemoglobin",
      "A V/Q mismatch of the low-V/Q type, which does correct almost completely on 100% oxygen",
    ],
    correctAnswer:
      "Intrapulmonary shunt — blood perfusing non-ventilated alveoli bypasses gas exchange entirely, so raising FiO2 alone cannot oxygenate it",
    explanation: "Shunt describes alveoli that are perfused but not ventilated (consolidation, atelectasis, complete lobar collapse), so the blood traversing them never contacts fresh gas and returns desaturated. Because that blood is not exposed to the inspired gas at all, the PaO2 response to increasing FiO2 is poor — the hallmark that distinguishes shunt from low-V/Q mismatch, which corrects substantially on 100% oxygen. Hypoventilation lowers PaO2 by reducing alveolar PO2 but keeps the A-a gradient normal and responds fully to increased ventilation, and anaemia reduces oxygen content while leaving PaO2 essentially unchanged. Shunt is treated by re-opening alveoli (PEEP, recruitment, drainage, physiotherapy), not by simply raising FiO2.",
    difficulty: "hard",
    marks: 1,
  },

  // 9 — The unconscious patient: GCS (easy)
  {
    slug: "ana301-gcs-components",
    concept: "unconscious-patient-care",
    format: "sba",
    stem: "A patient opens eyes only to a painful stimulus, is fully oriented and conversant, and localises to pain. What is the Glasgow Coma Scale score?",
    options: [
      "E2 V5 M6 = 13",
      "E1 V5 M6 = 12",
      "E2 V4 M5 = 11",
      "E4 V5 M6 = 15",
    ],
    correctAnswer: "E2 V5 M6 = 13",
    explanation: "The Glasgow Coma Scale is eye (E1–E4), verbal (V1–V5) and motor (M1–M6). Eyes opening to pain scores 2, being fully oriented scores 5 on the verbal scale, and localising to a painful stimulus scores 6 on the motor scale, giving 13. A score of 8 or below defines coma and mandates airway protection; the motor component is the single most useful prognostic part because localising (M6) and obeying commands (M6/M5 distinctions aside) reflect much better function than flexion or extension.",
    difficulty: "easy",
    marks: 1,
    needsCheck: false, // E2 + V5 + M6 = 13
  },

  // 10 — Fluid, electrolyte and metabolic management (medium)
  {
    slug: "ana301-crystalloid-hyperchloraemic-acidosis",
    concept: "fluid-electrolyte-metabolic",
    format: "sba",
    stem: "Why are balanced crystalloids generally preferred to 0.9% sodium chloride for large-volume resuscitation and perioperative fluid replacement?",
    options: [
      "0.9% saline has a supraphysiological chloride load that produces a hyperchloraemic metabolic acidosis and is associated with reduced renal perfusion and hyperkalaemia at volume",
      "0.9% saline contains substantially less sodium than balanced crystalloids and therefore under-resuscitates septic patients",
      "Balanced crystalloids contain albumin and therefore expand the plasma volume more effectively per litre",
      "0.9% saline is contraindicated in every perioperative patient regardless of the volume given",
    ],
    correctAnswer:
      "0.9% saline has a supraphysiological chloride load that produces a hyperchloraemic metabolic acidosis and is associated with reduced renal perfusion and hyperkalaemia at volume",
    explanation: "Normal saline has a chloride concentration of 154 mmol/L, markedly above plasma, so large-volume infusion lowers the strong ion difference and produces a hyperchloraemic (normal anion gap) metabolic acidosis, with reductions in renal cortical perfusion and higher rates of hyperkalaemia and acute kidney injury. Balanced solutions such as Hartmann's or Plasma-Lyte have a chloride concentration near plasma and much lower risk, which is why they are the default maintenance and resuscitation fluid. Small-volume boluses of saline are of course harmless, and balanced crystalloids contain no albumin or colloid — they come in isotonic and hypotonic variants with differing potassium content that matters in renal failure.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // saline chloride 154 mmol/L
  },

  // 11 — Pre-operative evaluation and monitoring: fasting (easy)
  {
    slug: "ana301-preop-fasting-guidelines",
    concept: "preop-evaluation-monitoring",
    format: "sba",
    stem: "A 55-year-old listed for elective inguinal hernia repair drinks 200 mL of black coffee at 06:30 for a 10:30 list. What is the correct fasting instruction?",
    options: [
      "Clear fluids are permitted up to 2 hours before induction, so this patient may be anaesthetised at 10:30",
      "All patients must be fasted from midnight regardless of the fluid",
      "Solid food is permitted up to 4 hours before induction, so breakfast is also safe",
      "Clear fluids must be withheld for 6 hours and breast milk for 4 hours",
    ],
    correctAnswer:
      "Clear fluids are permitted up to 2 hours before induction, so this patient may be anaesthetised at 10:30",
    explanation: "Modern fasting guidance allows clear fluids (water, black tea or coffee without milk, clear juices) up to 2 hours before induction because they empty rapidly; breast milk is allowed to 4 hours and light meals or infant formula to 6 hours, with fatty or fried food and meat requiring 6 hours. The aim is to keep patients hydrated and reduce gastric volume and anxiety, rather than the blanket overnight fast that was once standard and which causes thirst, irritability and relative hypovolaemia. This patient drank 4 hours before anaesthesia and is well within the clear-fluid window.",
    difficulty: "easy",
    marks: 1,
    needsCheck: false, // 2h clear / 4h breast milk / 6h light meal
  },

  // 12 — Pain management: WHO analgesic ladder (easy)
  {
    slug: "ana301-who-analgesic-ladder",
    concept: "pain-management",
    format: "sba",
    stem: "A postoperative patient has moderate pain despite regular paracetamol. Which step of the WHO analgesic ladder correctly escalates analgesic therapy?",
    options: [
      "Add an opioid for moderate to severe pain (step 2: codeine or tramadol; step 3: morphine), alongside an NSAID and paracetamol as multimodal background therapy",
      "Move directly to opioids and stop all non-opioid analgesics, since one drug is easier to titrate",
      "Continue paracetamol alone and add reassurance, because opioids are never used for postoperative pain",
      "Replace paracetamol with a higher dose of NSAID and add a benzodiazepine for the pain-related anxiety",
    ],
    correctAnswer:
      "Add an opioid for moderate to severe pain (step 2: codeine or tramadol; step 3: morphine), alongside an NSAID and paracetamol as multimodal background therapy",
    explanation: "The WHO ladder steps up from non-opioids (step 1) through weak opioids (step 2) to strong opioids (step 3), with adjuvant drugs at each step — but its key modern interpretation is that analgesics are combined rather than replaced, so paracetamol and an NSAID continue as background multimodal therapy and spare the opioid requirement (an opioid-sparing effect that lowers respiratory depression, ileus and nausea). Weak opioids are used for moderate pain and strong opioids such as morphine for severe pain, titrated to effect with antiemetic and constipation cover. Benzodiazepines treat anxiety but have no analgesic action and will confuse pain.",
    difficulty: "easy",
    marks: 1,
  },

  // 13 — Anaesthetic techniques and muscle relaxants (medium)
  {
    slug: "ana301-suxamethonium-contraindications",
    concept: "techniques-muscle-relaxants",
    format: "sba",
    stem: "Which statement correctly describes suxamethonium (succinylcholine), a depolarising muscle relaxant used at induction for rapid-sequence intubation?",
    options: [
      "It produces fasciculations followed by a brief depolarising block with very rapid onset and offset, and is contraindicated in hyperkalaemia, burns over 24–48 hours old, and denervation injury because of exaggerated potassium release",
      "It is a non-depolarising blocker that requires reversal with neostigmine and takes 3–5 minutes to onset",
      "Its action is prolonged by pseudocholinesterase excess, and it is the safest choice in a patient with a plasma potassium of 6.2 mmol/L",
      "It causes no potassium release and is therefore the drug of choice in extensive burns and spinal cord injury",
    ],
    correctAnswer:
      "It produces fasciculations followed by a brief depolarising block with very rapid onset and offset, and is contraindicated in hyperkalaemia, burns over 24–48 hours old, and denervation injury because of exaggerated potassium release",
    explanation: "Suxamethonium is the only depolarising relaxant in routine use: it mimics acetylcholine, causing initial fasciculations and a block that lasts only 5–10 minutes because it is hydrolysed by plasma pseudocholinesterase — which is precisely why it gives the fastest onset and offset of any relaxant and is the classic rapid-sequence intubation agent. Its upregulation of extra-junctional acetylcholine receptors makes potassium release dangerous after 24–48 hours post burn, after denervation (spinal cord injury, stroke), in prolonged immobility, and in pre-existing hyperkalaemia — rocuronium is the safer alternative. Pseudocholinesterase deficiency (not excess) prolongs the block, and suxamethonium also triggers malignant hyperthermia.",
    difficulty: "medium",
    marks: 1,
  },

  // 14 — Local anaesthesia and core skills: maximum doses (hard)
  {
    slug: "ana301-local-anaesthetic-toxicity",
    concept: "local-anaesthesia-skills",
    format: "sba",
    stem: "A few minutes after an axillary brachial plexus block, a patient becomes agitated, reports perioral tingling, then has a generalised tonic-clonic seizure and a broad-complex tachycardia. Which management is correct?",
    options: [
      "Recognise LAST (local anaesthetic systemic toxicity), stop the injection, give oxygen and hyperventilation, control the seizure with a benzodiazepine, and give 20% Intralipid 1.5 mL/kg bolus followed by infusion",
      "Treat as anaphylaxis with 1 mg intramuscular adrenaline and chlorphenamine only",
      "Treat as hyperventilation with rebreathing into a paper bag and observation",
      "Treat as vasovagal syncope with atropine and leg elevation only",
    ],
    correctAnswer:
      "Recognise LAST (local anaesthetic systemic toxicity), stop the injection, give oxygen and hyperventilation, control the seizure with a benzodiazepine, and give 20% Intralipid 1.5 mL/kg bolus followed by infusion",
    explanation: "Local anaesthetic systemic toxicity classically begins with CNS excitation (perioral tingling, agitation, metallic taste, then seizures) followed by cardiovascular collapse with arrhythmias and refractory cardiac arrest. Management follows the LAST protocol: stop injecting, secure the airway and ventilate with 100% oxygen, treat seizures with a benzodiazepine (avoiding large propofol doses that worsen hypotension), and give intravenous lipid emulsion 20% at an initial bolus of 1.5 mL/kg followed by an infusion, with CPR potentially prolonged for more than an hour. Toxicity is dose-related and is prevented by respecting maximum doses (for example lignocaine about 3 mg/kg plain and 7 mg/kg with adrenaline, and bupivacaine about 2 mg/kg), aspirating before injection and using incremental doses with frequent aspiration.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false, // Intralipid 20% 1.5 mL/kg bolus then 0.25 mL/kg/min
  },
];

async function seedAssessmentAnaesthesiology() {
  const course = await prisma.course.findFirst({
    where: { slug: COURSE_SLUG },
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
    // Deterministic rotation by item index: uniform key spread, stable
    // across re-runs; correctAnswer is option TEXT so rotation is safe.
    const rot = i % it.options.length;
    const opts = [...it.options.slice(rot), ...it.options.slice(0, rot)];
    if (!opts.includes(it.correctAnswer)) {
      throw new Error(`correctAnswer not present in options for ${it.slug} — answer/key drift`);
    }
    await prisma.assessmentItem.upsert({
      where: { slug: it.slug },
      update: {
        conceptId,
        stem: it.stem,
        options: opts,
        correctAnswer: it.correctAnswer,
        explanation: it.explanation,
        marks: it.marks,
        negativeMarks: 0.25,
        orderIndex: 0 + i,
        difficulty: it.difficulty,
        reviewStatus: "needs-human-review",
        needsCheck: it.needsCheck ?? false,
      },
      create: {
        slug: it.slug,
        courseId: course.id,
        conceptId,
        format: it.format,
        stem: it.stem,
        options: opts,
        correctAnswer: it.correctAnswer,
        explanation: it.explanation,
        marks: it.marks,
        negativeMarks: 0.25,
        orderIndex: 0 + i,
        isPublished: true,
        difficulty: it.difficulty,
        // Post-repair convention (2026-10-20): production rows never sit at
        // "draft" — 42 draft rows drifted live before this rule was enforced.
        reviewStatus: "needs-human-review",
        needsCheck: it.needsCheck ?? false,
      },
    });
    count++;
  }

  console.log(`✓ ANA 301 assessment items: ${count} items (marks 1, needs-human-review)`);
}

// CLI usage: npx ts-node prisma/seed-assessment-anaesthesiology.ts
if (process.argv[1] && process.argv[1].includes("seed-assessment-anaesthesiology")) {
  seedAssessmentAnaesthesiology()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}

export { seedAssessmentAnaesthesiology, ITEMS as ANAESTHESIOLOGY_ITEMS };
