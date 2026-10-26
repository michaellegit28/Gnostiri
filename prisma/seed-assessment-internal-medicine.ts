import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Assessment content — Internal Medicine Foundations (MED 201).
 *
 * 20 original SBA items deepening the Internal Medicine bank from 6 to 26,
 * tagged to the existing ConceptNodes (see prisma/seed-university.ts).
 * Covers M1 residual concepts plus M2-M6 (cardiology, respiratory, GI,
 * endocrine, nephrology/haematology/infectious disease).
 *
 * Idempotent: upserts on the item slug; safe to re-run. orderIndex starts at
 * 6 so the six pre-existing items (0-5) keep their slots.
 *
 * Governance: every item ships reviewStatus "needs-human-review" — the
 * 2026-10-20 repair established that production rows must never sit at
 * "draft" (42 draft rows drifted live before). needsCheck flags the numeric
 * or distractor reasoning a physician should double-check.
 */

const COURSE_SLUG = "internal-medicine-foundations";

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
  // 1 — Fluid, electrolyte and acid-base balance (easy)
  {
    slug: "med201-severe-symptomatic-hyponatraemia",
    concept: "fluid-acid-base",
    format: "sba",
    stem: "A 68-year-old woman presents with confusion and vomiting. Serum sodium is 112 mmol/L. What is the most appropriate immediate treatment?",
    options: [
      "Intravenous 3% hypertonic saline as a bolus, aiming to raise sodium by no more than 10 mmol/L in the first 24 hours",
      "Rapid fluid restriction alone, targeting a 20 mmol/L rise in the first 24 hours",
      "Intravenous 0.9% saline at 250 mL per hour until sodium normalises",
      "Oral salt tablets and observation, since correction is too dangerous in the elderly",
    ],
    correctAnswer: "Intravenous 3% hypertonic saline as a bolus, aiming to raise sodium by no more than 10 mmol/L in the first 24 hours",
    explanation: "Severe symptomatic hyponatraemia (confusion, vomiting, seizure risk) is treated with 3% hypertonic saline, typically 100-150 mL boluses, with a correction limit of about 10 mmol/L in 24 hours (18 mmol/L is the absolute ceiling). Over-rapid correction risks osmotic demyelination syndrome, so a slower rise — not a faster one — is the goal. Fluid restriction alone is for mild/asymptomatic chronic hyponatraemia, and isotonic saline can worsen dilutional hyponatraemia in SIADH.",
    difficulty: "easy",
    marks: 1,
    needsCheck: false, // limits per guidelines: ≤10 mmol/L/24h, ceiling 18
  },

  // 2 — Fever, inflammation and sepsis (medium)
  {
    slug: "med201-sepsis-hour-one-bundle",
    concept: "fever-sepsis",
    format: "sba",
    stem: "A patient with pyelonephritis has respiratory rate 26/min, new confusion, and blood pressure 88/54 mmHg. Lactate is 3.4 mmol/L. Which single best statement describes the required immediate response?",
    options: [
      "Complete the sepsis hour-one bundle: obtain cultures, give broad-spectrum antibiotics, measure serial lactate, and give 30 mL/kg crystalloid for hypotension or lactate at or above 4 mmol/L",
      "Give intravenous fluids only if lactate exceeds 4 mmol/L, and delay antibiotics until culture results return",
      "Start noradrenaline immediately and defer fluids until central access is established",
      "Prescribe oral antibiotics and observe for 24 hours because the patient is alert enough to swallow",
    ],
    correctAnswer: "Complete the sepsis hour-one bundle: obtain cultures, give broad-spectrum antibiotics, measure serial lactate, and give 30 mL/kg crystalloid for hypotension or lactate at or above 4 mmol/L",
    explanation: "This patient has sepsis (suspected infection with a qSOFA score of at least 2 — altered mentation and systolic pressure at or below 100) plus elevated lactate. The hour-one bundle is: blood cultures before antibiotics, broad-spectrum antimicrobials, lactate measurement and re-measurement, and 30 mL/kg crystalloid for hypotension or lactate 4 mmol/L or above. Antibiotics are never delayed for culture results, and vasopressors are added after fluid resuscitation, not instead of it.",
    difficulty: "medium",
    marks: 1,
  },

  // 3 — Acute and chronic coronary syndromes (easy)
  {
    slug: "med201-acs-troponin-kinetics",
    concept: "ischaemic-heart-disease",
    format: "sba",
    stem: "Which statement correctly describes the role of high-sensitivity cardiac troponin in diagnosing acute myocardial infarction?",
    options: [
      "A rise and/or fall in serial high-sensitivity troponin values, in the right clinical context, distinguishes myocardial injury of ischaemic origin from a chronically elevated baseline",
      "A single normal troponin at presentation excludes myocardial infarction and no repeat testing is required",
      "Troponin only rises 24 hours after infarction, so early sampling is useless",
      "Troponin elevation is specific to myocardial infarction and cannot occur in pulmonary embolism, sepsis, or chronic kidney disease",
    ],
    correctAnswer: "A rise and/or fall in serial high-sensitivity troponin values, in the right clinical context, distinguishes myocardial injury of ischaemic origin from a chronically elevated baseline",
    explanation: "Myocardial infarction is diagnosed by detection of a rise and/or fall in cardiac troponin with at least one value above the 99th percentile upper reference limit, plus supporting clinical/ECG/imaging evidence. The dynamic rise-and-fall pattern separates acute injury from chronically elevated baseline (renal failure, heart failure). A single troponin has limited rule-out value with high-sensitivity assays unless drawn well beyond symptom onset, and troponin is a marker of myocardial injury, not exclusively infarction — pulmonary embolism, sepsis, myocarditis and kidney disease also elevate it.",
    difficulty: "easy",
    marks: 1,
  },

  // 4 — Heart failure (medium)
  {
    slug: "med201-href-four-pillars",
    concept: "heart-failure",
    format: "sba",
    stem: "A 62-year-old man has HFrEF with left ventricular ejection fraction 30%. Which regimen best reflects the four foundational therapies shown to reduce mortality?",
    options: [
      "An angiotensin receptor-neprilysin inhibitor (or ACE inhibitor/ARB), an evidence-based beta-blocker, a mineralocorticoid receptor antagonist, and an SGLT2 inhibitor",
      "Digoxin, furosemide, and amlodipine",
      "Aspirin, atorvastatin, and ramipril alone",
      "A loop diuretic and an ACE inhibitor only, since the other classes lack mortality benefit",
    ],
    correctAnswer: "An angiotensin receptor-neprilysin inhibitor (or ACE inhibitor/ARB), an evidence-based beta-blocker, a mineralocorticoid receptor antagonist, and an SGLT2 inhibitor",
    explanation: "HFrEF management rests on four mortality-reducing pillars: renin-angiotensin blockade (ARNI or ACEi/ARB), an evidence-based beta-blocker (bisoprolol, carvedilol, metoprolol succinate), a mineralocorticoid receptor antagonist (spironolactone/eplerenone), and an SGLT2 inhibitor (dapagliflozin/empagliflozin). Diuretics relieve congestion but have no mortality benefit, and digoxin reduces admissions rather than death — both are symptom/add-on therapy, not pillars.",
    difficulty: "medium",
    marks: 1,
  },

  // 5 — Arrhythmias and conduction disease (medium)
  {
    slug: "med201-atrial-fibrillation-management",
    concept: "arrhythmias-conduction",
    format: "sba",
    stem: "A 74-year-old man has an irregularly irregular pulse; ECG confirms atrial fibrillation with rate 112/min and no haemodynamic instability. Which management principle is most correct?",
    options: [
      "Assess stroke risk with CHA2DS2-VASc and anticoagulate accordingly, while using rate control (beta-blocker or non-dihydropyridine calcium channel blocker) as the default strategy",
      "Immediate electrical cardioversion is mandatory in all new-onset atrial fibrillation regardless of duration or stability",
      "Aspirin monotherapy is sufficient stroke prevention for patients over 70",
      "Anticoagulation is only needed after a stroke has occurred",
    ],
    correctAnswer: "Assess stroke risk with CHA2DS2-VASc and anticoagulate accordingly, while using rate control (beta-blocker or non-dihydropyridine calcium channel blocker) as the default strategy",
    explanation: "Stable atrial fibrillation is managed by stroke prevention and rate control: CHA2DS2-VASc determines oral anticoagulation (DOAC preferred over warfarin in non-valvular AF), and rate control uses beta-blockers or non-dihydropyridine calcium channel blockers. Cardioversion is for unstable patients or selected stable early cases after anticoagulation/TOE assessment. Aspirin is inadequate stroke prevention, and anticoagulation is preventive, not post-stroke-only.",
    difficulty: "medium",
    marks: 1,
  },

  // 6 — Valvular and structural heart disease (medium)
  {
    slug: "med201-aortic-stenosis-murmur",
    concept: "valvular-disease",
    format: "sba",
    stem: "An elderly patient with exertional syncope has a systolic murmur that radiates to the carotids, with a slow-rising, diminished carotid pulse and narrow pulse pressure. Which diagnosis does this examination pattern indicate?",
    options: [
      "Severe aortic stenosis — a crescendo-decrescendo ejection systolic murmur with a delayed, diminished carotid upstroke",
      "Hypertrophic obstructive cardiomyopathy, which behaves identically with standing",
      "Aortic regurgitation, a diastolic murmur with a wide pulse pressure",
      "Mitral regurgitation, a pansystolic murmur radiating to the axilla",
    ],
    correctAnswer: "Severe aortic stenosis — a crescendo-decrescendo ejection systolic murmur with a delayed, diminished carotid upstroke",
    explanation: "The classic triad of severe aortic stenosis is exertional syncope, angina, and heart failure, with a crescendo-decrescendo ejection systolic murmur radiating to the carotids, pulsus parvus et tardus (small, delayed carotid upstroke), and a narrow pulse pressure. HOCM also gives an ejection systolic murmur but it increases with Valsalva and the carotid upstroke is brisk, not delayed. Aortic regurgitation is diastolic with a wide pulse pressure; mitral regurgitation is pansystolic and radiates to the axilla.",
    difficulty: "medium",
    marks: 1,
  },

  // 7 — Asthma and COPD (easy)
  {
    slug: "med201-spirometry-obstruction",
    concept: "asthma-copd",
    format: "sba",
    stem: "Which spirometry finding confirms persistent airflow obstruction in a patient being assessed for COPD?",
    options: [
      "A post-bronchodilator FEV1/FVC ratio below 0.7, measured after adequate bronchodilator",
      "A reduced FEV1 with a normal FEV1/FVC ratio, indicating restriction",
      "A reversible increase in FEV1 of more than 12% and 200 mL after bronchodilator, indicating purely reversible obstruction",
      "A total lung capacity above 80% predicted on plethysmography",
    ],
    correctAnswer: "A post-bronchodilator FEV1/FVC ratio below 0.7, measured after adequate bronchodilator",
    explanation: "COPD is defined by persistent airflow limitation: a post-bronchodilator FEV1/FVC ratio below 0.7 confirms obstruction that is not fully reversible. A reduced ratio is what separates obstruction from a restrictive pattern (low FEV1 with normal or high ratio). Bronchodilator reversibility of more than 12% and 200 mL favours asthma over COPD, though overlap exists. Elevated lung volumes can occur in hyperinflation but are not the defining spirometric criterion.",
    difficulty: "easy",
    marks: 1,
  },

  // 8 — Pneumonia and pleural disease (medium)
  {
    slug: "med201-curb65-severity",
    concept: "pneumonia-pleural",
    format: "sba",
    stem: "A patient with community-acquired pneumonia is confused, has urea 9 mmol/L, respiratory rate 32/min, and blood pressure 84/50 mmHg. Age 70. What does the CURB-65 score indicate?",
    options: [
      "Score of 5 — severe pneumonia requiring urgent hospital assessment with consideration of high-dependency or intensive care",
      "Score of 2 — mild pneumonia suitable for outpatient oral antibiotics",
      "Score of 1 — low mortality risk; treat at home",
      "CURB-65 cannot be scored until a chest radiograph is obtained",
    ],
    correctAnswer: "Score of 5 — severe pneumonia requiring urgent hospital assessment with consideration of high-dependency or intensive care",
    explanation: "CURB-65 awards one point each for Confusion, Urea above 7 mmol/L, Respiratory rate 30/min or more, Blood pressure (systolic below 90 or diastolic 60 or below), and age 65 or above. This patient scores 5 (all five), indicating severe pneumonia with high mortality requiring hospital admission and consideration of critical care. Scores of 0-1 suggest outpatient care; 2 warrants inpatient admission.",
    difficulty: "medium",
    marks: 1,
  },

  // 9 — Pulmonary embolism (easy)
  {
    slug: "med201-pe-diagnosis",
    concept: "pulmonary-embolism",
    format: "sba",
    stem: "A postoperative patient develops sudden dyspnoea with tachycardia, hypoxia, and a clear chest radiograph. Which investigation is the definitive diagnostic test for suspected pulmonary embolism?",
    options: [
      "CT pulmonary angiography",
      "Chest radiograph, which shows the Westermark sign in most cases",
      "D-dimer alone, which if elevated is diagnostic",
      "Spirometry with reversibility testing",
    ],
    correctAnswer: "CT pulmonary angiography",
    explanation: "CT pulmonary angiography is the definitive imaging test for pulmonary embolism, directly visualising filling defects in the pulmonary arteries. Clinical probability (Wells or revised Geneva) guides testing: D-dimer has high sensitivity but poor specificity, so it rules out PE only in low/intermediate probability and a positive result is never diagnostic. Chest radiographs are typically normal or show nonspecific changes and cannot confirm PE.",
    difficulty: "easy",
    marks: 1,
  },

  // 10 — Approach to the GI patient (medium)
  {
    slug: "med201-peritonitis-surgical",
    concept: "gastroenterology-approach",
    format: "sba",
    stem: "A patient with sudden severe abdominal pain has a rigid abdomen with guarding and rebound tenderness, absent bowel sounds, and tachycardia. What is the most appropriate immediate action?",
    options: [
      "Urgent surgical review with resuscitation — examination findings indicate peritonitis",
      "Trial of high-dose proton pump inhibitor and observation for 12 hours",
      "Barium contrast study before any surgical referral",
      "Discharge with analgesia and outpatient endoscopy",
    ],
    correctAnswer: "Urgent surgical review with resuscitation — examination findings indicate peritonitis",
    explanation: "Guarding, rigidity, and rebound tenderness constitute peritonism — peritoneal inflammation that demands urgent surgical assessment, IV fluids, antibiotics, and usually operative intervention (perforation, ischaemia, or severe inflammation). Analgesia, surgical referral, and resuscitation happen in parallel; observation or contrast studies delay definitive treatment and risk perforation-related deterioration.",
    difficulty: "medium",
    marks: 1,
  },

  // 11 — Peptic ulcer and upper GI disease (medium)
  {
    slug: "med201-h-pylori-test-and-treat",
    concept: "peptic-ulcer",
    format: "sba",
    stem: "A 45-year-old with a duodenal ulcer on endoscopy tests positive for Helicobacter pylori. Which strategy correctly treats the ulcer and eradicates the organism?",
    options: [
      "Triple therapy: a proton pump inhibitor plus two antibiotics (clarithromycin and amoxicillin or metronidazole) for 14 days",
      "A proton pump inhibitor alone, indefinitely",
      "Antacids as sole maintenance therapy",
      "H2-receptor antagonist monotherapy, which reliably eradicates H. pylori",
    ],
    correctAnswer: "Triple therapy: a proton pump inhibitor plus two antibiotics (clarithromycin and amoxicillin or metronidazole) for 14 days",
    explanation: "H. pylori-associated ulcers require eradication therapy: a PPI plus two antibiotics (clarithromycin with amoxicillin or metronidazole) for 14 days, followed by confirmation of eradication at least four weeks after antibiotics. Acid suppression alone allows relapse because the organism persists; antacids and H2 blockers do not eradicate it. First-line choices depend on local clarithromycin resistance.",
    difficulty: "medium",
    marks: 1,
  },

  // 12 — Inflammatory bowel disease (medium)
  {
    slug: "med201-crohns-vs-uc",
    concept: "inflammatory-bowel-disease",
    format: "sba",
    stem: "Which endoscopic and pathological pattern best distinguishes Crohn's disease from ulcerative colitis?",
    options: [
      "Transmural inflammation with skip lesions that can affect any part of the gastrointestinal tract, often sparing the rectum",
      "Continuous inflammation starting at the rectum and extending proximally without skip areas, limited to the mucosa and submucosa",
      "Continuous transmural inflammation of the small bowel only",
      "Discontinuous mucosal disease limited to the colon with rectal involvement",
    ],
    correctAnswer: "Transmural inflammation with skip lesions that can affect any part of the gastrointestinal tract, often sparing the rectum",
    explanation: "Crohn's disease is transmural, discontinuous (skip lesions), can occur anywhere from mouth to anus, and frequently spares the rectum; it causes strictures, fistulae, and cobblestoning. Ulcerative colitis is continuous, begins at the rectum and extends proximally, and is limited to mucosa and submucosa — hence pseudopolyps and toxic megacolon rather than strictures or fistulae.",
    difficulty: "medium",
    marks: 1,
  },

  // 13 — Liver disease (hard)
  {
    slug: "med201-ascites-saag",
    concept: "liver-disease",
    format: "sba",
    stem: "A diagnostic paracentesis in a patient with ascites returns fluid with a serum-ascites albumin gradient (SAAG) of 1.6 g/dL. What does this indicate, and what is the next step?",
    options: [
      "Portal hypertension as the cause of ascites — investigate for cirrhosis (hepatic and portal evaluation) and manage accordingly",
      "Peritoneal carcinomatosis or tuberculous ascites, since a high gradient excludes portal hypertension",
      "Normal physiology requiring no further investigation",
      "A bleeding source inside the peritoneal cavity",
    ],
    correctAnswer: "Portal hypertension as the cause of ascites — investigate for cirrhosis (hepatic and portal evaluation) and manage accordingly",
    explanation: "A SAAG of 1.1 g/dL or above indicates portal hypertension as the mechanism of ascites (cirrhosis, heart failure, Budd-Chiari). A gradient below 1.1 suggests peritoneal disease such as malignancy, tuberculosis, or pancreatitis. The SAAG must be paired with ascitic protein and, where infection is suspected, cell count and culture (spontaneous bacterial peritonitis is diagnosed with a neutrophil count of 250 cells/mm3 or above).",
    difficulty: "hard",
    marks: 1,
    needsCheck: false, // SAAG cutoff 1.1 g/dL, SBP neutrophil cutoff 250
  },

  // 14 — Pancreatic and biliary disease (medium)
  {
    slug: "med201-acute-pancreatitis-criteria",
    concept: "pancreatic-biliary-disease",
    format: "sba",
    stem: "Which combination establishes a diagnosis of acute pancreatitis?",
    options: [
      "Any two of: characteristic epigastric pain often radiating to the back, serum lipase or amylase at least three times the upper limit of normal, and imaging findings of pancreatic inflammation",
      "Amylase above the upper limit of normal alone, regardless of pain or imaging",
      "A single lipase value with normal imaging and no pain history",
      "Gallstones on ultrasound in any patient with abdominal pain",
    ],
    correctAnswer: "Any two of: characteristic epigastric pain often radiating to the back, serum lipase or amylase at least three times the upper limit of normal, and imaging findings of pancreatic inflammation",
    explanation: "Acute pancreatitis requires two of three criteria: typical abdominal pain, amylase or lipase greater than three times the upper limit of normal, and characteristic imaging. Lipase is preferred over amylase (more specific and longer elevation). Mild amylase elevations occur in many abdominal conditions and alone are not diagnostic; gallstones on ultrasound only explain aetiology, not the diagnosis.",
    difficulty: "medium",
    marks: 1,
  },

  // 15 — Endocrine assessment and the thyroid (medium)
  {
    slug: "med201-graves-vs-toxic-nodular",
    concept: "endocrine-approach",
    format: "sba",
    stem: "A 34-year-old woman has weight loss, heat intolerance, a diffuse goitre with a bruit, and new-onset orbitopathy. Which finding most specifically confirms Graves' disease as the cause of her thyrotoxicosis?",
    options: [
      "Positive TSH-receptor antibodies (TRAb/TSI), which drive the gland-stimulating autoimmunity of Graves' disease",
      "A suppressed TSH with elevated free T4, which is common to all causes of thyrotoxicosis",
      "A diffusely increased uptake on thyroid scintigraphy",
      "A family history of thyroid disease",
    ],
    correctAnswer: "Positive TSH-receptor antibodies (TRAb/TSI), which drive the gland-stimulating autoimmunity of Graves' disease",
    explanation: "TRAb (TSI) are the disease-specific antibodies of Graves' disease, stimulating the TSH receptor to produce a diffuse goitre with a bruit and orbitopathy. Suppressed TSH with elevated free T4 only confirms thyrotoxicosis, not its cause; diffuse uptake supports but does not prove Graves' (it is absent in destructive thyroiditis where uptake is low). Family history is a risk factor, not a diagnostic test.",
    difficulty: "medium",
    marks: 1,
  },

  // 16 — Diabetes mellitus (medium)
  {
    slug: "med201-dka-vs-hhs",
    concept: "diabetes-mellitus",
    format: "sba",
    stem: "Which profile distinguishes hyperosmolar hyperglycaemic state (HHS) from diabetic ketoacidosis (DKA)?",
    options: [
      "Marked hyperglycaemia (often above 33 mmol/L) with high serum osmolality and minimal or absent ketosis and acidosis, typically in older type 2 patients",
      "Severe acidosis with pH below 7.3, bicarbonate below 18 mmol/L, and significant ketonaemia",
      "Both states present identically; only glucose levels differ",
      "HHS requires the presence of ketonaemia to be diagnosed",
    ],
    correctAnswer: "Marked hyperglycaemia (often above 33 mmol/L) with high serum osmolality and minimal or absent ketosis and acidosis, typically in older type 2 patients",
    explanation: "HHS is defined by severe hyperglycaemia (often 33 mmol/L or above), hyperosmolality (above 320 mOsm/kg), and absent or minimal ketosis and acidosis, reflecting preserved endogenous insulin in type 2 diabetes. DKA features hyperglycaemia with metabolic acidosis (pH often below 7.3, bicarbonate below 18) and ketonaemia, and is the classic type 1 presentation. Both share dehydration and insulin deficiency, but the metabolic footprint differs.",
    difficulty: "medium",
    marks: 1,
  },

  // 17 — Endocrine emergencies (hard)
  {
    slug: "med201-addisonian-crisis",
    concept: "endocrine-emergencies",
    format: "sba",
    stem: "A patient on long-term glucocorticoids presents with hypotension refractory to fluids, hyponatraemia, hyperkalaemia, and hypoglycaemia after a febrile illness. What is the immediate priority?",
    options: [
      "Give intravenous hydrocortisone immediately — treatment must not wait for confirmatory cortisol testing",
      "Obtain a random cortisol and ACTH level and withhold steroids until results return",
      "Give intravenous dextrose alone and observe",
      "Start high-dose insulin to correct the hyperkalaemia first",
    ],
    correctAnswer: "Give intravenous hydrocortisone immediately — treatment must not wait for confirmatory cortisol testing",
    explanation: "This is an adrenal (addisonian) crisis — primary adrenal insufficiency or, here, secondary from chronic steroid suppression. The immediate treatment is parenteral hydrocortisone (e.g., 100 mg IV bolus then infusion) plus fluid resuscitation and dextrose; empirical steroids are started before biochemistry because delay is life-threatening. Cortisol can be drawn but steroids are never withheld. Insulin is contraindicated in hypoglycaemia and the hyperkalaemia corrects with rehydration and steroid.",
    difficulty: "hard",
    marks: 1,
  },

  // 18 — Renal disease and AKI (easy)
  {
    slug: "med201-akikdigo-staging",
    concept: "renal-disease-aki",
    format: "sba",
    stem: "Which definition of acute kidney injury follows KDIGO criteria?",
    options: [
      "An increase in serum creatinine by 0.3 mg/dL (26.5 micromol/L) or more within 48 hours, or to 1.5 times baseline or more within 7 days, or urine output below 0.5 mL/kg/h for 6 hours",
      "Any fall in urine output for 12 hours regardless of creatinine",
      "A creatinine rise above the laboratory reference range alone",
      "A glomerular filtration rate below 90 mL/min/1.73 m2",
    ],
    correctAnswer: "An increase in serum creatinine by 0.3 mg/dL (26.5 micromol/L) or more within 48 hours, or to 1.5 times baseline or more within 7 days, or urine output below 0.5 mL/kg/h for 6 hours",
    explanation: "KDIGO acute kidney injury is defined by creatinine rise of at least 0.3 mg/dL within 48 hours, or 1.5 times baseline or more within 7 days, or urine output below 0.5 mL/kg/h for 6 hours; staging then uses increasing creatinine multiples and oliguria duration. A single creatinine above the lab range is not AKI unless it meets baseline-relative criteria, and a low GFR alone defines chronic kidney disease when persistent for over 3 months.",
    difficulty: "easy",
    marks: 1,
  },

  // 19 — Haematology: anaemia (easy)
  {
    slug: "med201-iron-deficiency-ferritin",
    concept: "anaemia-haemostasis",
    format: "sba",
    stem: "A 40-year-old woman has microcytic anaemia. Which single laboratory finding most specifically confirms iron deficiency as the cause?",
    options: [
      "A low serum ferritin, the most specific marker of depleted iron stores",
      "A low mean corpuscular volume, which also occurs in anaemia of chronic disease and thalassaemia",
      "A high total iron-binding capacity, which can also rise in pregnancy and inflammation",
      "A low serum iron alone, which fluctuates with recent intake and inflammation",
    ],
    correctAnswer: "A low serum ferritin, the most specific marker of depleted iron stores",
    explanation: "Ferritin reflects stored iron and a low value confirms iron deficiency anaemia — though ferritin is also an acute-phase reactant, so inflammation can mask deficiency (a normal ferritin does not exclude iron deficiency in inflamed patients, hence the higher thresholds sometimes used). Microcytosis is shared with anaemia of chronic disease and thalassaemia trait, and serum iron alone is non-specific because it varies diurnally and with recent intake.",
    difficulty: "easy",
    marks: 1,
  },

  // 20 — Infectious disease and tropical medicine (medium)
  {
    slug: "med201-malaria-diagnosis",
    concept: "infectious-disease",
    format: "sba",
    stem: "A returned traveller from an endemic area has cyclical fevers, rigors, and thrombocytopenia. Which is the definitive confirmatory test for malaria?",
    options: [
      "Microscopy of thick and thin blood films (or a validated rapid diagnostic test) demonstrating Plasmodium parasites",
      "A single normal full blood count excluding the diagnosis",
      "Peripheral blood culture, which grows Plasmodium falciparum",
      "Serology for malaria IgG, which distinguishes current from past infection",
    ],
    correctAnswer: "Microscopy of thick and thin blood films (or a validated rapid diagnostic test) demonstrating Plasmodium parasites",
    explanation: "Malaria is confirmed by detecting parasites on thick and thin blood films (species identification and parasitaemia quantification) or a validated HRP2/pLDH rapid diagnostic test, repeated every 12-24 hours if initially negative and suspicion is high. Plasmodium cannot be cultured routinely, serology reflects past exposure rather than current infection, and a normal blood count never excludes malaria — thrombocytopenia is actually a common clue.",
    difficulty: "medium",
    marks: 1,
  },
];

async function seedAssessmentInternalMedicine() {
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
        orderIndex: 6 + i,
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
        orderIndex: 6 + i,
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

  console.log(`✓ MED 201 assessment items: ${count} items (marks 1, needs-human-review)`);
}

// CLI usage: npx ts-node prisma/seed-assessment-internal-medicine.ts
if (process.argv[1] && process.argv[1].includes("seed-assessment-internal-medicine")) {
  seedAssessmentInternalMedicine()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}

export { seedAssessmentInternalMedicine, ITEMS as INTERNAL_MEDICINE_ITEMS };
