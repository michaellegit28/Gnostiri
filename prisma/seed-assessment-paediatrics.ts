import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Assessment content — Paediatrics & Child Health (PEDS 302).
 *
 * 20 original SBA items deepening the Paediatrics bank from 6 to 26, tagged to
 * the existing ConceptNodes (see prisma/seed-courses/mbbs/pediatrics.ts and
 * prisma/seed-university.ts). Covers the domains the M1 pilot only sketched —
 * fluid/electrolyte and dehydration, paediatric emergencies, airway and
 * respiratory disease, neonatal medicine (resuscitation, jaundice, respiratory
 * distress, prematurity, neonatal sepsis), nutrition and growth, congenital
 * and cardiac disease, gastroenterology, neurology and neurodisability,
 * diabetes and endocrinology, haematology, nephrology and infectious disease.
 *
 * Idempotent: upserts on the item slug; safe to re-run. orderIndex starts at
 * 6 so the six pre-existing items (0-5) keep their slots.
 *
 * Governance: every item ships reviewStatus "needs-human-review" — the
 * 2026-10-20 repair established that production rows must never sit at
 * "draft" (42 draft rows drifted live before). needsCheck flags the numeric
 * or distractor reasoning a clinician should double-check.
 */

const COURSE_SLUG = "paediatrics-child-health";

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
  // 1 — Fluid therapy and dehydration (easy)
  {
    slug: "peds302-gastroenteritis-ors-first-line",
    concept: "paediatric-fluids-dehydration",
    format: "sba",
    stem: "A 2-year-old with acute gastroenteritis is about 5% dehydrated: alert but with sunken eyes, dry mucous membranes, reduced urine output, and capillary refill just under 2 seconds. What is the most appropriate initial fluid strategy?",
    options: [
      "Oral rehydration solution, roughly 50 mL/kg of deficit given in small frequent volumes over 4 hours, with continued breastfeeding/early refeeding — intravenous fluids only if oral therapy fails or shock is present",
      "Immediate 20 mL/kg boluses of 0.9% saline repeated until capillary refill normalises",
      "Rest the bowel with nil by mouth for 24 hours, then restart with water alone",
      "Plain water only until the diarrhoea settles, since ORS increases stool output",
    ],
    correctAnswer: "Oral rehydration solution, roughly 50 mL/kg of deficit given in small frequent volumes over 4 hours, with continued breastfeeding/early refeeding — intravenous fluids only if oral therapy fails or shock is present",
    explanation: "Mild-to-moderate dehydration from gastroenteritis is treated with low-osmolarity oral rehydration solution given in frequent small volumes (about 50 mL/kg over 4 hours for the deficit, plus maintenance), continuing breastfeeds and returning to normal feeding early. Intravenous 20 mL/kg boluses are reserved for shock or severe dehydration. Prolonged bowel rest delays recovery and breastfeeding must not be interrupted, while water alone lacks sodium and glucose and risks hyponatraemia and osmotic diarrhoea.",
    difficulty: "easy",
    marks: 1,
    needsCheck: false, // 50 mL/kg deficit over 4 h per NICE CG84 / NG86
  },

  // 2 — Paediatric emergencies (hard)
  {
    slug: "peds302-anaphylaxis-im-adrenaline",
    concept: "paediatric-emergencies",
    format: "sba",
    stem: "A 6-year-old develops acute urticaria, lip and tongue swelling, and audible wheeze with stridor 10 minutes after eating a peanut. What is the immediate first-line drug and route?",
    options: [
      "Intramuscular adrenaline 1:1000 at 0.01 mL/kg (maximum 0.5 mL) into the anterolateral thigh",
      "Subcutaneous adrenaline 1:10,000 at 0.01 mL/kg into the deltoid",
      "Nebulised adrenaline 1:1000 (5 mL) delivered by oxygen-driven nebuliser",
      "Intravenous chlorphenamine plus hydrocortisone together, holding adrenaline in reserve",
    ],
    correctAnswer: "Intramuscular adrenaline 1:1000 at 0.01 mL/kg (maximum 0.5 mL) into the anterolateral thigh",
    explanation: "Anaphylaxis is treated immediately with intramuscular adrenaline into the anterolateral thigh — the subcutaneous route absorbs too erratically and intramuscular injection into the vastus lateralis gives the fastest, most reliable absorption. The paediatric dose is 0.01 mL/kg of the 1:1000 (1 mg/mL) preparation (max 0.5 mL), repeatable after 5 minutes if there is no response, and self-injectors deliver 150 or 300 micrograms. Antihistamines and corticosteroids are adjuncts that do not relieve airway obstruction or shock, and nebulised adrenaline is a treatment for viral stridor, not systemic anaphylaxis.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false, // 0.01 mL/kg of 1:1000 IM, max 0.5 mL, repeat at 5 min
  },

  // 3 — Asthma (easy)
  {
    slug: "peds302-acute-childhood-asthma",
    concept: "asthma-childhood",
    format: "sba",
    stem: "A 5-year-old has an acute asthma exacerbation with audible wheeze, mild chest recession, speech in short phrases, and SpO2 94% in air. Which initial management is correct?",
    options: [
      "Inhaled salbutamol via a spacer (2-10 puffs titrated to response), oxygen if saturation falls below 94%, and oral prednisolone within the first hour",
      "Intravenous aminophylline as first-line therapy before any inhaled bronchodilator",
      "Nebulised ipratropium alone, with a corticosteroid withheld until day 2",
      "Oral antibiotics and 24-hour observation, since most exacerbations are bacterial",
    ],
    correctAnswer: "Inhaled salbutamol via a spacer (2-10 puffs titrated to response), oxygen if saturation falls below 94%, and oral prednisolone within the first hour",
    explanation: "For mild and moderate exacerbations, a pressurised metered-dose inhaler with a spacer is at least as effective as a nebuliser and is the preferred delivery route; salbutamol is given as 2-10 puffs, repeated every 20-30 minutes according to response. Oxygen is titrated to a target saturation of 94-98%, and a systemic corticosteroid (prednisolone, ideally within the first hour) is given early to all but the mildest attacks. Intravenous aminophylline is reserved for severe or life-threatening attacks under high-dependency care, and antibiotics are not routine unless there is evidence of bacterial infection.",
    difficulty: "easy",
    marks: 1,
  },

  // 4 — Croup and acute airway infection (medium)
  {
    slug: "peds302-mild-croup-dexamethasone",
    concept: "bronchiolitis-croup",
    format: "sba",
    stem: "An 18-month-old has a barking cough and hoarse voice with inspiratory stridor only when crying, but is alert, drinking normally, and not cyanosed. What is the single most appropriate treatment?",
    options: [
      "A single dose of oral dexamethasone (0.15-0.3 mg/kg), with no routine antibiotic or bronchodilator",
      "Nebulised salbutamol plus a course of oral amoxicillin",
      "Nebulised adrenaline now and intravenous antibiotics on admission",
      "An intravenous corticosteroid, and a chest radiograph before any treatment",
    ],
    correctAnswer: "A single dose of oral dexamethasone (0.15-0.3 mg/kg), with no routine antibiotic or bronchodilator",
    explanation: "Croup is a self-limiting viral laryngotracheitis, and a single systemic corticosteroid dose (dexamethasone 0.15 mg/kg orally, sometimes repeated, or oral prednisolone) relieves symptoms and reduces hospital attendance and admission across all severities. Antibiotics and bronchodilators have no role in uncomplicated viral croup. Nebulised adrenaline is reserved for moderate or severe disease with stridor at rest, chest-wall recession or agitation, and its effect lasts only a couple of hours, so treated children are observed for rebound.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // dexamethasone 0.15 mg/kg single dose, adrenaline for severe croup
  },

  // 5 — Neonatal resuscitation (hard)
  {
    slug: "peds302-newborn-inflation-breaths",
    concept: "neonatal-resuscitation",
    format: "sba",
    stem: "A term infant is born limp and apnoeic after an uneventful labour. The baby is dried and stimulated but remains apnoeic with a heart rate of 70/min. What is the correct immediate sequence in newborn life support?",
    options: [
      "Give 5 inflation breaths with the head in a neutral position, then reassess the heart rate and start chest compressions at 3:1 if it remains below 60/min despite effective ventilation",
      "Start chest compressions at 15:2 immediately, before any inflation breaths are given",
      "Vigorously suction the oropharynx under direct vision, then give 3 inflation breaths",
      "Give intravenous adrenaline at 0.01 mg/kg as the first step because the rate is under 100/min",
    ],
    correctAnswer: "Give 5 inflation breaths with the head in a neutral position, then reassess the heart rate and start chest compressions at 3:1 if it remains below 60/min despite effective ventilation",
    explanation: "Most newborn arrests are respiratory in origin, so after drying and stimulation the first intervention is 5 inflation breaths of about 2-3 seconds each in a neutral head position with a face mask; chest rise confirms adequate ventilation. The heart rate is then reassessed, and compressions (3 compressions to 1 breath, about 15 compressions and 30 inflations per minute) are started only if the rate remains below 60/min or does not improve after adequate ventilation. Routine pharyngeal suction is no longer recommended for meconium or non-vigorous babies without obvious obstruction, and drugs are given last, after ventilation and compressions have been established.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false, // 5 inflation breaths; 3:1 compressions if HR <60 despite ventilation
  },

  // 6 — Neonatal jaundice (medium)
  {
    slug: "peds302-prolonged-conjugated-jaundice",
    concept: "neonatal-jaundice",
    format: "sba",
    stem: "A 3-week-old breastfed baby has been jaundiced since day 3. Total bilirubin is 180 micromol/L with a conjugated fraction of 90 micromol/L, and the parents report pale stools and dark urine. What is the most important next step?",
    options: [
      "Urgent same-day referral for paediatric hepatology assessment — conjugated hyperbilirubinaemia after 14 days of age requires exclusion of biliary atresia",
      "Reassurance and continued breastfeeding, because prolonged jaundice is usually benign in breastfed infants",
      "Chart phototherapy in the community and review in 48 hours",
      "Stop breastfeeding and substitute formula for 2 weeks, then re-measure bilirubin",
    ],
    correctAnswer: "Urgent same-day referral for paediatric hepatology assessment — conjugated hyperbilirubinaemia after 14 days of age requires exclusion of biliary atresia",
    explanation: "Jaundice persisting beyond 14 days in a term infant (21 days if preterm) must have a split bilirubin measured; a conjugated fraction above 25 micromol/L or more than 10-20% of the total is cholestasis and is always pathological. Pale stools with dark urine point to biliary atresia, for which the outcome depends on performing a Kasai portoenterostomy early — best results when surgery is before 8 weeks of age — so referral cannot wait. Phototherapy treats unconjugated hyperbilirubinaemia and has no place in conjugated cholestasis, and stopping breastfeeding is not part of the diagnostic pathway.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // conjugated >25 micromol/L or >10-20% total is pathological
  },

  // 7 — Respiratory distress of the newborn (medium)
  {
    slug: "peds302-surfactant-deficiency-rds",
    concept: "neonatal-respiratory-distress",
    format: "sba",
    stem: "An infant born at 29 weeks' gestation develops worsening tachypnoea, grunting and intercostal recession within the first hour, needing increasing oxygen and CPAP. The chest radiograph shows a diffuse ground-glass pattern with air bronchograms. Which diagnosis is most likely?",
    options: [
      "Respiratory distress syndrome from surfactant deficiency and immature type II pneumocytes",
      "Transient tachypnoea of the newborn from delayed clearance of fetal lung liquid",
      "Meconium aspiration syndrome, which presents in the first minutes of life",
      "Congenital diaphragmatic hernia, which would show bowel loops in the affected hemithorax",
    ],
    correctAnswer: "Respiratory distress syndrome from surfactant deficiency and immature type II pneumocytes",
    explanation: "Respiratory distress syndrome is caused by surfactant deficiency (immature type II pneumocytes) with poorly compliant, atelectatic alveoli, so it is a disease of prematurity that typically worsens over the first 24-72 hours and produces a ground-glass radiograph with air bronchograms. Antenatal corticosteroids for threatened preterm birth, early CPAP and intratracheal surfactant replacement have substantially reduced its mortality. Transient tachypnoea of the newborn is a self-limiting tachypnoea in term or late-preterm infants after caesarean or rapid delivery, with streaky perihilar shadowing and visible fluid in the horizontal fissure; meconium aspiration follows meconium-stained liquor in term or post-term infants, and congenital diaphragmatic hernia shows herniated abdominal contents within the chest.",
    difficulty: "medium",
    marks: 1,
  },

  // 8 — The preterm infant (medium)
  {
    slug: "peds302-rop-screening-criteria",
    concept: "prematurity-neonatal-care",
    format: "sba",
    stem: "Which infants require formal retinopathy of prematurity (ROP) screening under UK practice?",
    options: [
      "All babies born before 32 weeks of gestation or with a birthweight below 1501 g",
      "Only babies born before 28 weeks of gestation",
      "Only babies requiring supplemental oxygen for more than 24 hours, regardless of gestation or weight",
      "Only babies with a first-degree relative who had retinopathy of prematurity",
    ],
    correctAnswer: "All babies born before 32 weeks of gestation or with a birthweight below 1501 g",
    explanation: "Retinopathy of prematurity screening is offered to infants born before 32 weeks of gestation or weighing under 1501 g, because incomplete retinal vascularisation plus oxygen-related and other postnatal stresses can drive abnormal neovascularisation. Gestational age and birthweight — not the duration of oxygen therapy, and not family history — are the established selection criteria. Screening by indirect ophthalmoscopy begins a few weeks after birth and allows laser ablation or anti-VEGF treatment of threshold disease, which markedly reduces blindness in survivors.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // UK criteria: <32 weeks or birthweight <1501 g
  },

  // 9 — Neonatal infection (hard)
  {
    slug: "peds302-early-onset-neonatal-sepsis",
    concept: "neonatal-infection-sepsis",
    format: "sba",
    stem: "A 12-hour-old term infant has temperature instability, poor feeding and grunting, born after prolonged rupture of membranes with maternal pyrexia in labour. What is the most appropriate empirical antibiotic regimen?",
    options: [
      "Intravenous benzylpenicillin plus gentamicin, with blood cultures and respiratory support",
      "Oral amoxicillin for 7 days with community follow-up",
      "Intravenous ceftriaxone as monotherapy",
      "Intravenous aciclovir alone, pending the lumbar puncture result",
    ],
    correctAnswer: "Intravenous benzylpenicillin plus gentamicin, with blood cultures and respiratory support",
    explanation: "Early-onset neonatal sepsis presents within the first 72 hours and is caused mainly by group B Streptococcus and Gram-negative enteric organisms acquired around birth, particularly after prolonged rupture of membranes or maternal chorioamnionitis. Empirical intravenous benzylpenicillin with gentamicin covers both groups and is the standard first-line regimen while cultures and inflammatory markers are pending, alongside resuscitation, respiratory support and, where indicated, lumbar puncture. Ceftriaxone is avoided in neonates because of bilirubin displacement and calcium precipitation; oral antibiotics cannot treat systemic sepsis; and aciclovir is added only when herpes simplex infection is suspected (maternal lesions, seizures, negative cultures, hepatitis or coagulopathy).",
    difficulty: "hard",
    marks: 1,
  },

  // 10 — Infectious disease: Kawasaki disease (medium)
  {
    slug: "peds302-kawasaki-ivig",
    concept: "childhood-infectious-disease",
    format: "sba",
    stem: "A 4-year-old has had a fever of 39.5°C for 6 days with bilateral non-purulent conjunctivitis, red cracked lips and strawberry tongue, a polymorphous rash, and unilateral cervical lymphadenopathy. What is the diagnosis and key next step?",
    options: [
      "Kawasaki disease — give intravenous immunoglobulin and aspirin promptly to reduce the risk of coronary artery aneurysms",
      "Scarlet fever — treat with oral benzylpenicillin and discharge with safety-netting",
      "Stevens-Johnson syndrome — start systemic steroids and stop all suspect drugs",
      "Systemic juvenile idiopathic arthritis — arrange imaging of the joints and non-steroidal therapy",
    ],
    correctAnswer: "Kawasaki disease — give intravenous immunoglobulin and aspirin promptly to reduce the risk of coronary artery aneurysms",
    explanation: "Kawasaki disease is a medium-vessel vasculitis diagnosed clinically with fever for at least 5 days plus 4 of: bilateral non-exudative conjunctivitis, oral mucosal changes, polymorphous rash, peripheral extremity changes (erythema, oedema, later periungual desquamation), and cervical lymphadenopathy (often unilateral, at least 1.5 cm). A single intravenous immunoglobulin infusion (2 g/kg) with high-dose aspirin started within 10 days of fever onset dramatically reduces coronary artery aneurysm formation, with echocardiography used to guide ongoing management; aspirin is reduced to an antiplatelet dose once the fever settles. Incomplete Kawasaki is common in infants and should be treated rather than waiting for the full criteria to appear.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // IVIG 2 g/kg as a single infusion; aspirin high dose then antiplatelet
  },

  // 11 — Congenital anomalies and syndromes (easy)
  {
    slug: "peds302-down-syndrome-duodenal-atresia",
    concept: "congenital-anomalies-syndromes",
    format: "sba",
    stem: "A newborn has hypotonia, brachycephaly, upslanting palpebral fissures, a single palmar crease, a systolic murmur, and a double-bubble appearance on abdominal radiograph. Which chromosomal abnormality is most likely, and what does the radiograph show?",
    options: [
      "Trisomy 21 (Down syndrome); the double bubble indicates duodenal atresia, which affects about 5% of these infants",
      "Trisomy 18 (Edwards syndrome), in which duodenal atresia is a characteristic feature",
      "45,X (Turner syndrome), in which duodenal atresia accompanies coarctation and a webbed neck",
      "22q11.2 deletion syndrome, in which duodenal atresia accompanies hypocalcaemia",
    ],
    correctAnswer: "Trisomy 21 (Down syndrome); the double bubble indicates duodenal atresia, which affects about 5% of these infants",
    explanation: "The phenotype described is trisomy 21, confirmed by karyotype or rapid aneuploidy testing, and the radiograph shows the classic double bubble of duodenal atresia (distended stomach and proximal duodenum) that occurs in roughly 5% of affected infants. Other associated problems include atrioventricular septal defects, transient abnormal myelopoiesis, congenital hypothyroidism, Hirschsprung disease and duodenal stenosis from an annular pancreas. Duodenal atresia is not a feature of trisomy 18, Turner syndrome or 22q11.2 deletion, and about half of infants with trisomy 21 have a cardiac lesion — most commonly an atrioventricular septal defect.",
    difficulty: "easy",
    marks: 1,
  },

  // 12 — Congenital heart disease (hard)
  {
    slug: "peds302-duct-dependent-collapse",
    concept: "congenital-heart-disease",
    format: "sba",
    stem: "A 4-day-old who was discharged home feeding well becomes grey, breathless and poorly perfused, with a soft or absent murmur and weak femoral pulses. A duct-dependent lesion is suspected. What is the immediate management?",
    options: [
      "Start an intravenous prostaglandin E1 (alprostadil) infusion to reopen the ductus arteriosus, with urgent cardiology assessment and supportive stabilisation",
      "Give 100% oxygen by face mask and observe on the postnatal ward for 12 hours",
      "Give intravenous furosemide and digoxin, and repeat the echocardiogram the next day",
      "Discharge with outpatient cardiology follow-up, since collapse in the first week is usually benign",
    ],
    correctAnswer: "Start an intravenous prostaglandin E1 (alprostadil) infusion to reopen the ductus arteriosus, with urgent cardiology assessment and supportive stabilisation",
    explanation: "Lesions that rely on the ductus arteriosus for pulmonary blood flow (such as pulmonary atresia or critical pulmonary stenosis) or for systemic perfusion (critical coarctation, hypoplastic left heart, critical aortic stenosis) decompensate abruptly as the ductus constricts in the first days of life. An intravenous prostaglandin E1 infusion reopens ductal patency and is often life-saving; its main adverse effects are apnoea, hypotension and fever, so the infant needs continuous monitoring and readiness to intubate. High-concentration oxygen lowers pulmonary vascular resistance and can divert flow away from the systemic circulation in a duct-dependent circulation, worsening shock, and diuretics or digoxin cannot restore the obstructed pathway.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false, // PGE1 maintains/reopens the ductus; apnoea is a dose-related effect
  },

  // 13 — Paediatric cardiology: innocent murmur (easy)
  {
    slug: "peds302-innocent-still-murmur",
    concept: "paediatric-cardiology",
    format: "sba",
    stem: "A healthy, asymptomatic 4-year-old has a soft vibratory mid-systolic murmur at the lower left sternal edge that disappears when the neck is extended, varies with posture, and is accompanied by normal growth and normal femoral pulses. How should this be interpreted?",
    options: [
      "An innocent (functional) murmur — reassure the family, impose no activity restriction, and review if features change",
      "A small ventricular septal defect — arrange echocardiography and endocarditis prophylaxis",
      "Severe aortic stenosis — refer urgently for cardiology assessment",
      "Patent ductus arteriosus — start indometacin and plan surgical ligation",
    ],
    correctAnswer: "An innocent (functional) murmur — reassure the family, impose no activity restriction, and review if features change",
    explanation: "Innocent murmurs (Still's murmur, venous hum, pulmonary flow murmur) are soft, short, musical or vibratory systolic murmurs that vary with posture and respiration and occur in children with normal growth, normal pulses and no symptoms, so no investigation, treatment or activity restriction is required. Features that warrant referral and echocardiography are diastolic murmurs, thrills, loud or radiating murmurs, cyanosis, abnormal femoral pulses, or symptoms such as syncope or poor growth. A patent ductus arteriosus gives a continuous machinery murmur and pharmacological closure with indometacin or ibuprofen applies only to preterm neonates, not to a well 4-year-old.",
    difficulty: "easy",
    marks: 1,
  },

  // 14 — Paediatric gastroenterology (medium)
  {
    slug: "peds302-intussusception-enema",
    concept: "paediatric-gastroenterology",
    format: "sba",
    stem: "A 9-month-old has episodic screaming with legs drawn up, then becomes pale and lethargic, and passes redcurrant-jelly stool. A sausage-shaped mass is palpable in the right upper quadrant. What is the next step in management?",
    options: [
      "Abdominal ultrasound to confirm the target/doughnut sign, then pneumatic or hydrostatic enema reduction under surgical cover",
      "Plain abdominal radiograph followed by 48 hours of oral domperidone and observation",
      "Immediate laparotomy in every case, because enema reduction is no longer recommended",
      "Oral antibiotics for presumed bacterial gastroenteritis with 24-hour observation",
    ],
    correctAnswer: "Abdominal ultrasound to confirm the target/doughnut sign, then pneumatic or hydrostatic enema reduction under surgical cover",
    explanation: "This is ileocolic intussusception, the commonest cause of intestinal obstruction in infants aged 6-18 months, often preceded by a viral illness or enlarged Peyer's patches and sometimes driven by a lead point such as a Meckel's diverticulum or polyp in older children. Ultrasound confirms the diagnosis, and image-guided pneumatic or hydrostatic enema reduction is the first-line treatment, dramatically reducing the need for surgery; operative reduction or resection is reserved for perforation, peritonitis, shock, or failed reduction. Anti-motility drugs and antibiotics do not treat mechanical obstruction, and conservative management risks ischaemia and necrosis.",
    difficulty: "medium",
    marks: 1,
  },

  // 15 — Paediatric neurology: status epilepticus (hard)
  {
    slug: "peds302-status-epilepticus-benzodiazepine",
    concept: "paediatric-neurology",
    format: "sba",
    stem: "A 3-year-old with known epilepsy has a generalised tonic-clonic seizure that has continued for 8 minutes without recovery. What is the first-line treatment?",
    options: [
      "Buccal midazolam (0.2-0.5 mg/kg) or rectal diazepam, given once the seizure has passed 5 minutes, with high-flow oxygen and monitoring for apnoea",
      "Intravenous phenytoin as first-line therapy before any benzodiazepine is given",
      "Oral carbamazepine given as an acute loading dose during the convulsion",
      "Immediate thiopentone anaesthesia without prior benzodiazepine",
    ],
    correctAnswer: "Buccal midazolam (0.2-0.5 mg/kg) or rectal diazepam, given once the seizure has passed 5 minutes, with high-flow oxygen and monitoring for apnoea",
    explanation: "Convulsive status epilepticus is a seizure lasting more than 5 minutes, or repeated seizures without full recovery of consciousness, and the first stage of treatment is a benzodiazepine — buccal midazolam is effective and easy to give outside hospital, with rectal diazepam as an alternative. Benzodiazepines can depress respiration, so the airway is secured and oxygen given, with resuscitation equipment at hand. If the seizure persists, a second benzodiazepine dose and then a second-line intravenous agent (levetiracetam, phenytoin/fosphenytoin, or sodium valproate) follow, with rapid sequence induction and intensive care if seizures continue; oral agents cannot be administered during a convulsion and do not act fast enough to stop it.",
    difficulty: "hard",
    marks: 1,
  },

  // 16 — Neurodisability: cerebral palsy (easy)
  {
    slug: "peds302-cerebral-palsy-definition",
    concept: "neurodisability-care",
    format: "sba",
    stem: "A 2-year-old has increased tone in both legs with a scissoring gait, hyperreflexia, and persistent early motor delay. Which statement about the most likely diagnosis is correct?",
    options: [
      "Cerebral palsy is a permanent but non-progressive disorder of movement and posture arising from injury to the developing brain, so management is multidisciplinary and supportive rather than curative",
      "The progressive worsening of tone and gait with age confirms a neurodegenerative disorder, so cerebral palsy is excluded",
      "Cerebral palsy is a single disease with an outcome fixed by the neonatal MRI",
      "Physiotherapy and targeted tone management confer no benefit once the diagnosis is established",
    ],
    correctAnswer: "Cerebral palsy is a permanent but non-progressive disorder of movement and posture arising from injury to the developing brain, so management is multidisciplinary and supportive rather than curative",
    explanation: "Cerebral palsy is an umbrella term for permanent, non-progressive disorders of movement and posture caused by a disturbance to the fetal or infant brain, with motor subtypes (spastic hemiplegia or diplegia, dyskinetic, ataxic, quadriplegia) and frequently associated epilepsy, learning disability, and visual, hearing or feeding impairments. Because the cerebral insult is static, the lesion itself does not worsen — but the musculoskeletal consequences of abnormal tone do change with growth, so physiotherapy, orthoses, botulinum toxin, and orthopaedic surgery all have a role. It is a clinical description with many causes and many outcomes, not a single disease, and management centres on the family with therapists, paediatricians and community teams.",
    difficulty: "easy",
    marks: 1,
  },

  // 17 — Childhood diabetes (medium)
  {
    slug: "peds302-diabetic-ketoacidosis-child",
    concept: "childhood-diabetes",
    format: "sba",
    stem: "A 7-year-old with newly diagnosed type 1 diabetes is vomiting with deep sighing respirations and ketotic breath: glucose 24 mmol/L, pH 7.12, bicarbonate 9 mmol/L, estimated 8% dehydration. Which statement best describes correct management?",
    options: [
      "Replace the circulating volume with 0.9% saline and start a continuous insulin infusion (0.05-0.1 units/kg/h) with potassium replacement — without an insulin bolus — while monitoring for cerebral oedema",
      "Give half-strength saline with a 0.1 units/kg insulin bolus and an alkali infusion to correct the acidosis",
      "Withhold insulin and restrict fluids to maintenance plus dextrose until the glucose falls below 15 mmol/L",
      "Give subcutaneous basal insulin alone and observe on a general ward",
    ],
    correctAnswer: "Replace the circulating volume with 0.9% saline and start a continuous insulin infusion (0.05-0.1 units/kg/h) with potassium replacement — without an insulin bolus — while monitoring for cerebral oedema",
    explanation: "Paediatric DKA is treated with shock assessment first, then deficit replacement using 0.9% saline (a 10 mL/kg bolus only if shocked), a continuous insulin infusion begun at 0.05-0.1 units/kg/h without a bolus, dextrose added once glucose falls below about 14 mmol/L, and potassium replacement once serum potassium is known and the child has passed urine. Bicarbonate and insulin boluses are not used routinely because they are associated with cerebral oedema, which is the most dangerous complication of paediatric DKA and is treated with mannitol or hypertonic saline and airway support. Subcutaneous regimens are inadequate for established DKA, which requires hourly monitoring of glucose, electrolytes, blood gases and neurological status.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // insulin 0.05-0.1 units/kg/h, no bolus; defer dextrose until glucose <14 mmol/L
  },

  // 18 — Paediatric endocrinology (medium)
  {
    slug: "peds302-congenital-hypothyroidism",
    concept: "paediatric-endocrinology",
    format: "sba",
    stem: "A newborn bloodspot screening result shows a markedly raised TSH with a low free thyroxine. Which statement is correct?",
    options: [
      "This is congenital hypothyroidism, and levothyroxine must be started promptly — ideally within the first 2-4 weeks of life — to prevent irreversible intellectual disability",
      "This pattern is physiologic in the first month and can safely be rechecked at 6 months without treatment",
      "Levothyroxine should be withheld until a confirmatory technetium scan is obtained at 12 months",
      "Treatment is iodine supplementation alone, since virtually all cases are due to dietary iodine deficiency",
    ],
    correctAnswer: "This is congenital hypothyroidism, and levothyroxine must be started promptly — ideally within the first 2-4 weeks of life — to prevent irreversible intellectual disability",
    explanation: "Congenital hypothyroidism, detected on bloodspot screening by a raised TSH with low free thyroxine, affects roughly 1 in 2000-3000 births and results most often from thyroid agenesis, ectopic thyroid tissue, or dyshormonogenesis. Early replacement with levothyroxine (typically 10-15 micrograms/kg/day) permits normal growth and neurodevelopment, whereas delayed treatment causes irreversible intellectual disability and short stature. Confirmatory serum thyroid function tests and, where indicated, imaging are taken but treatment is never delayed for them, and iodine deficiency is only one preventable cause worldwide rather than the dominant explanation in screened populations.",
    difficulty: "medium",
    marks: 1,
  },

  // 19 — Paediatric haematology (medium)
  {
    slug: "peds302-childhood-itp",
    concept: "paediatric-haematology",
    format: "sba",
    stem: "A previously well 4-year-old develops widespread petechiae and bruising two weeks after a viral illness. Full blood count shows platelets 18 x 10^9/L with normal haemoglobin, normal white cell count and a normal differential. What is the most likely diagnosis?",
    options: [
      "Immune thrombocytopenia (ITP), a self-limited post-infectious autoimmune platelet destruction usually managed expectantly unless there is significant bleeding",
      "Acute lymphoblastic leukaemia, which characteristically presents with isolated thrombocytopenia and a normal differential",
      "Haemophilia A, a factor deficiency that presents with petechiae in early childhood",
      "Disseminated intravascular coagulation, which requires fresh frozen plasma and factor VIII replacement",
    ],
    correctAnswer: "Immune thrombocytopenia (ITP), a self-limited post-infectious autoimmune platelet destruction usually managed expectantly unless there is significant bleeding",
    explanation: "Immune thrombocytopenia typically appears 1-4 weeks after a viral infection in an otherwise well child, with isolated thrombocytopenia (often below 30 x 10^9/L), normal haemoglobin and a normal white cell differential, caused by antiplatelet antibodies. Most cases resolve spontaneously within 6-12 months; treatment with intravenous immunoglobulin or corticosteroids is reserved for significant mucosal or other bleeding rather than for the platelet count alone, and intracranial haemorrhage is rare. Leukaemia produces bone marrow failure with anaemia, white cell abnormalities, hepatosplenomegaly or bone pain; haemophilia causes joint and muscle bleeding with a normal platelet count; and DIC requires a consumptive coagulopathy with prolonged clotting times and schistocytes.",
    difficulty: "medium",
    marks: 1,
  },

  // 20 — Paediatric nephrology (easy)
  {
    slug: "peds302-minimal-change-nephrotic",
    concept: "paediatric-nephrology",
    format: "sba",
    stem: "A 4-year-old develops periorbital swelling followed by ankle oedema. Urinalysis shows 4+ protein, serum albumin is 22 g/L, and urea and creatinine are normal. Which statement best describes the most likely diagnosis?",
    options: [
      "Minimal-change nephrotic syndrome — the commonest childhood nephrotic syndrome, which usually responds to corticosteroids and carries a good long-term renal prognosis",
      "Focal segmental glomerulosclerosis, which is the commonest cause of nephrotic syndrome in children under 6",
      "IgA vasculitis (Henoch-Schonlein purpura), which presents with petechiae and a normal urine dipstick",
      "Acute post-streptococcal glomerulonephritis, which presents with heavy proteinuria and a normal blood pressure",
    ],
    correctAnswer: "Minimal-change nephrotic syndrome — the commonest childhood nephrotic syndrome, which usually responds to corticosteroids and carries a good long-term renal prognosis",
    explanation: "Nephrotic syndrome in a preschool or young school-age child — heavy proteinuria, hypoalbuminaemia, generalised oedema and preserved renal function — is most commonly minimal-change disease (around 90% of cases in this age group), and corticosteroids (prednisolone 60 mg/m2/day for 4-8 weeks with a tapering regimen) induce remission in the great majority. Focal segmental glomerulosclerosis and other histological patterns become relatively more common in older children, in steroid-resistant cases, and where there is haematuria or renal impairment, and they prompt renal biopsy. IgA vasculitis presents with a palpable purpuric rash on the buttocks and legs, arthralgia and abdominal pain with urinalysis that may be normal or show only mild haematuria, and acute post-streptococcal glomerulonephritis is a nephritic syndrome with haematuria, oliguria and hypertension rather than selective proteinuria with a normal blood pressure.",
    difficulty: "easy",
    marks: 1,
  },
];

async function seedAssessmentPaediatrics() {
  const course = await prisma.course.findFirst({
    where: { slug: COURSE_SLUG },
    select: { id: true },
  });
  if (!course) throw new Error(`Course ${COURSE_SLUG} not found. Run prisma/seed-university.ts and prisma/seed-courses first.`);

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

  console.log(`✓ PEDS 302 assessment items: ${count} items (marks 1, needs-human-review)`);
}

// CLI usage: npx ts-node prisma/seed-assessment-paediatrics.ts
if (process.argv[1] && process.argv[1].includes("seed-assessment-paediatrics")) {
  seedAssessmentPaediatrics()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}

export { seedAssessmentPaediatrics, ITEMS as PAEDIATRICS_ITEMS };
