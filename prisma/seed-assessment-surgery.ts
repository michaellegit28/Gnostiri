import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Assessment content — Surgery: Principles & General Operation.
 *
 * 20 original SBA items deepening the surgery bank from 6 to 26, tagged to the
 * existing ConceptNodes (see prisma/seed-university.ts). Covers the general
 * surgical core: wounds, shock/fluids, sepsis and asepsis, the acute abdomen,
 * GI/hepatobiliary/colorectal, urology, genitalia, trauma/ATLS, vascular,
 * limb orthopaedics, consent and post-operative care.
 *
 * Idempotent: upserts on the item slug; safe to re-run. orderIndex starts at
 * 6 so the six pre-existing items (0-5) keep their slots.
 *
 * Governance: every item ships reviewStatus "needs-human-review" — the
 * 2026-10-20 repair established that production rows must never sit at
 * "draft" (42 draft rows drifted live before). needsCheck flags the numeric
 * or distractor reasoning a surgeon should double-check.
 */

const COURSE_SLUG = "surgery-principles";

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
  // 1 — Wound healing and wound care (easy)
  {
    slug: "surgery-principles--wound-care-healing--phases-sba",
    concept: "wound-care-healing",
    format: "sba",
    stem: "Which sequence correctly describes the phases of normal wound healing after a clean incision?",
    options: [
      "Haemostasis, then inflammation (days 0-3), then proliferation with granulation and epithelialisation (day 3 to ~3 weeks), then remodelling over up to a year",
      "Inflammation, then haemostasis, then proliferation, then remodelling",
      "Proliferation, then haemostasis, then inflammation, then remodelling",
      "Remodelling, then proliferation, then inflammation, then haemostasis",
    ],
    correctAnswer: "Haemostasis, then inflammation (days 0-3), then proliferation with granulation and epithelialisation (day 3 to ~3 weeks), then remodelling over up to a year",
    explanation: "Wound healing begins with haemostasis (vasoconstriction and clot) and inflammation (neutrophil then macrophage influx), overlapping into the proliferative phase where angiogenesis, granulation tissue and epithelialisation bridge the defect. The remodelling phase matures collagen from type III towards type I and increases tensile strength over many months, although scar tissue never exceeds ~80% of original skin strength. Factors such as infection, poor perfusion, diabetes and malnutrition delay these phases and can convert a healing wound into a chronic one.",
    difficulty: "easy",
    marks: 1,
  },

  // 2 — Appendicitis and appendicectomy (easy)
  {
    slug: "surgery-principles--appendix--migrating-pain-sba",
    concept: "appendix",
    format: "sba",
    stem: "A 19-year-old man with right iliac fossa pain also reports vague periumbilical discomfort that began earlier, plus anorexia and nausea. Which pathophysiological description best explains this pain pattern of acute appendicitis?",
    options: [
      "Early visceral pain from appendiceal distension is referred to the periumbilical region via T10 afferents, before somatic parietal pain localises to the right iliac fossa as inflammation reaches the peritoneum",
      "The periumbilical pain is produced first and the right iliac fossa pain is a later visceral manifestation, so localisation follows the same pathway",
      "Both phases are somatic from the outset because the appendix lies retroperitoneally and cannot refer pain",
      "The pattern reflects ureteric colic radiating from loin to groin, and the inflammatory signs are coincidental",
    ],
    correctAnswer: "Early visceral pain from appendiceal distension is referred to the periumbilical region via T10 afferents, before somatic parietal pain localises to the right iliac fossa as inflammation reaches the peritoneum",
    explanation: "Appendiceal obstruction and distension produce poorly localised visceral pain referred to the periumbilical area because the midgut shares T10 innervation. Once inflammation irritates the adjacent parietal peritoneum, pain becomes sharp, constant and localised to the right iliac fossa, with guarding, rebound and Rovsing's sign. This migration of periumbilical to right iliac fossa pain is the single most discriminating feature of acute appendicitis, and scoring systems such as Alvarado use it alongside migration, anorexia, nausea, tenderness, rebound, fever and leucocytosis.",
    difficulty: "easy",
    marks: 1,
    needsCheck: false, // T10 periumbilical referral; Alvarado MANTRELS scoring
  },

  // 3 — Approach to the urological patient (easy)
  {
    slug: "surgery-principles--urological-approach--haematuria-sba",
    concept: "urological-approach",
    format: "sba",
    stem: "A     62-year-old smoker reports a single episode of painless visible haematuria with no clots and normal renal function. What is the most appropriate next step?",

    options: [
      "Urgent cystoscopy and upper urinary tract imaging with a CT urogram to exclude urothelial malignancy",
      "Empiric antibiotics and a repeat urine dipstick in three months",
      "Reassurance, since painless haematuria in older men is usually benign prostatic enlargement",
      "Ultrasound of the kidneys alone, which reliably excludes bladder tumours",
    ],
    correctAnswer: "Urgent cystoscopy and upper urinary tract imaging with a CT urogram to exclude urothelial malignancy",
    explanation: "Painless visible haematuria at any age must be treated as suspected urothelial cancer until excluded — bladder cancer commonly presents exactly this way, and smoking is the dominant risk factor. Evaluation requires cystoscopy (the only reliable way to inspect the bladder mucosa) plus upper tract imaging, preferentially a CT urogram. Ultrasound alone can miss urothelial lesions and small tumours, and empiric antibiotics or reassurance without investigation delays the diagnosis of curable disease.",
    difficulty: "easy",
    marks: 1,
  },

  // 4 — Assessment, consent and the safe surgical patient (easy)
  {
    slug: "surgery-principles--assessment-consent--refusal-sba",
    concept: "assessment-consent",
    format: "sba",
    stem: "A 45-year-old with capacity refuses a life-saving blood transfusion on religious grounds, having understood the risks. Which statement is correct?",
    options: [
      "A competent adult may refuse any treatment, including one that is life-saving, and the refusal must be documented and respected",
      "Next of kin may override the refusal and consent on the patient's behalf once the risk is fatal",
      "The team may transfuse in an emergency without consent because preserving life takes priority over autonomy",
      "Consent is invalid unless the patient accepts the recommended treatment, so refusal ends the need for further discussion",
    ],
    correctAnswer: "A competent adult may refuse any treatment, including one that is life-saving, and the refusal must be documented and respected",
    explanation: "Valid consent requires capacity, information and voluntariness, and a competent adult's refusal is ethically and legally as binding as their consent — autonomy includes the right to decline life-saving care. Capacity is decision-specific and assessed against the particular choice; relatives cannot override an adult with capacity, and emergency exceptions apply only where the patient lacks capacity and no advance directive exists. The refusal, the discussion and the information given must be carefully documented.",
    difficulty: "easy",
    marks: 1,
  },

  // 5 — Urinary stones and obstruction (easy)
  {
    slug: "surgery-principles--urinary-stones--ct-kub-sba",
    concept: "urinary-stones",
    format: "sba",
    stem: "A 35-year-old has sudden severe left loin-to-groin pain with microscopic haematuria. Which investigation is the gold standard for confirming a ureteric stone?",
    options: [
      "Non-contrast CT of the kidneys, ureters and bladder (CT KUB)",
      "Plain abdominal radiograph as the sole first-line imaging test",
      "Intravenous urography, the historical reference standard",
      "Renal ultrasound, which has the highest sensitivity for ureteric stones",
    ],
    correctAnswer: "Non-contrast CT of the kidneys, ureters and bladder (CT KUB)",
    explanation: "Non-contrast CT KUB detects virtually all urinary calculi (including uric acid and matrix stones radiolucent on plain film), quantifies stone size and hydration status, and can reveal alternative diagnoses such as aortic aneurysm or diverticulitis. Most stones below 5 mm pass spontaneously with analgesia and alpha-blockers; larger or infected obstructing systems need urological drainage (stent or nephrostomy) or lithotripsy. Ultrasound is preferred in pregnancy and children to avoid radiation, but its sensitivity for ureteric stones is inferior.",
    difficulty: "easy",
    marks: 1,
    needsCheck: false, // 5 mm spontaneous passage threshold; CT KUB sensitivity >95%
  },

  // 6 — Haemostasis, shock and fluids (medium)
  {
    slug: "surgery-principles--haemostasis-shock-fluids--class-iii-sba",
    concept: "haemostasis-shock-fluids",
    format: "sba",
    stem: "According to the ATLS haemorrhagic shock classification, which profile defines class III haemorrhage?",
    options: [
      "Loss of 30-40% of blood volume with tachycardia, hypotension (falling systolic pressure) and confused, anxious mental status",
      "Loss of up to 15% of blood volume with anxiety only and normal vital signs",
      "Loss of 15-30% of blood volume with tachycardia but a preserved systolic blood pressure",
      "Loss of over 40% of blood volume with lethargy and no palpable radial pulse",
    ],
    correctAnswer: "Loss of 30-40% of blood volume with tachycardia, hypotension (falling systolic pressure) and confused, anxious mental status",
    explanation: "ATLS classes I-II (up to 30% loss) usually maintain blood pressure through compensation, whereas class III (30-40%, roughly 1500-2000 mL) is the first class in which the systolic pressure falls and mental status changes — the classic 'decompensated' shock that demands blood transfusion alongside haemostasis. Class IV is over 40% with lethargy, marked hypotension and absent pulses, and requires immediate transfusion and surgical control. Recognising the transition to decompensation is essential because compensatory tachycardia alone underestimates major haemorrhage, particularly in young patients and those on beta-blockers.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // ATLS class thresholds: I <15%, II 15-30%, III 30-40%, IV >40%
  },

  // 7 — Asepsis and surgical site infection (medium)
  {
    slug: "surgery-principles--asepsis-ssi--prophylaxis-timing-sba",
    concept: "asepsis-ssi",
    format: "sba",
    stem: "Which practice best reduces the risk of surgical site infection in elective colorectal surgery?",
    options: [
      "A single intravenous dose of a gram-negative and anaerobic cover (e.g. co-amoxiclav) given within 60 minutes before skin incision, with intra-operative re-dosing for prolonged or bloody surgery",
      "Oral antibiotics for three days before admission to sterilise the bowel",
      "Prophylaxis started 24 hours after surgery once contamination is confirmed by cultures",
      "No antibiotics if the patient is already on topical antiseptic wash, since antisepsis is equivalent",
    ],
    correctAnswer: "A single intravenous dose of a gram-negative and anaerobic cover (e.g. co-amoxiclav) given within 60 minutes before skin incision, with intra-operative re-dosing for prolonged or bloody surgery",
    explanation: "Surgical antibiotic prophylaxis works by ensuring adequate tissue concentration at the time of incision, so it must be given within 60 minutes before surgery; colorectal procedures need cover against gram-negative rods and anaerobes, typically a single IV peri-operative dose. Additional intra-operative doses follow if the operation is long or blood loss exceeds roughly 1500 mL, and prophylaxis beyond 24 hours does not reduce infection while promoting resistance and Clostridioides difficile. Mechanical bowel preparation combined with oral antibiotics also reduces SSI and ileus in left-sided colorectal surgery.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // within 60 min of incision; re-dose for long surgery/large blood loss
  },

  // 8 — The acute abdomen and gastrointestinal bleeding (medium)
  {
    slug: "surgery-principles--acute-abdomen-gi-bleeding--perforation-sba",
    concept: "acute-abdomen-gi-bleeding",
    format: "sba",
    stem: "A 70-year-old on NSAIDs develops sudden generalised abdominal pain. He is tachycardic, has a board-like rigid abdomen and an erect chest radiograph shows free air under both hemidiaphragms. What is the most appropriate immediate management?",
    options: [
      "Nil by mouth with nasogastric decompression, intravenous fluids, broad-spectrum antibiotics and urgent laparotomy for a perforated viscus",
      "Oral gastrograffin and observation for 12 hours to see whether the perforation seals",
      "Immediate CT abdomen and intravenous proton pump inhibitor, reserving surgery for failure to settle",
      "Barium enema therapy, which is the definitive non-operative treatment for free intraperitoneal air",
    ],
    correctAnswer: "Nil by mouth with nasogastric decompression, intravenous fluids, broad-spectrum antibiotics and urgent laparotomy for a perforated viscus",
    explanation: "Free subdiaphragmatic air with generalised peritonism indicates perforation of a hollow viscus, commonly a duodenal ulcer in NSAID users; the standard of care is resuscitation, NG decompression, antibiotics and prompt surgical repair or resection. Resuscitation and surgery are not alternatives — antibiotics and fluids proceed in parallel while theatre is prepared. Barium and gastrograffin studies are contraindicated in suspected perforation with peritonitis, and PPIs are adjunctive rather than definitive.",
    difficulty: "medium",
    marks: 1,
  },

  // 9 — Oesophageal, gastric and duodenal surgery (medium)
  {
    slug: "surgery-principles--oesophagogastric-surgery--dysphagia-sba",
    concept: "oesophagogastric-surgery",
    format: "sba",
    stem: "A 68-year-old smoker has progressive dysphagia — solids first, then liquids — with weight loss and cervical lymphadenopathy. Which investigation provides the definitive diagnosis?",
    options: [
      "Upper GI endoscopy (oesophagogastroduodenoscopy) with biopsy for histology",
      "Barium swallow, which is the most sensitive test for early mucosal carcinoma",
      "Oesophageal manometry, which grades the severity of the stricture",
      "CT chest as the first test, since it both stages and diagnoses the tumour",
    ],
    correctAnswer: "Upper GI endoscopy (oesophagogastroduodenoscopy) with biopsy for histology",
    explanation: "Progressive dysphagia with weight loss is malignant obstruction until proven otherwise, and oesophagogastroduodenoscopy allows direct visualisation and biopsy for tissue diagnosis, which is mandatory before treatment. Barium swallow shows the anatomy and stricture level but cannot biopsy and is reserved for suspected motility disorders; manometry assesses motility and CT stages rather than diagnoses. Once carcinoma is confirmed, staging with CT chest/abdomen and endoscopic ultrasound guides resectability.",
    difficulty: "medium",
    marks: 1,
  },

  // 10 — Hepatobiliary and pancreatic surgery (hard)
  {
    slug: "surgery-principles--hepatobiliary-surgery--painless-jaundice-sba",
    concept: "hepatobiliary-surgery",
    format: "sba",
    stem: "A 74-year-old has painless progressive jaundice, dark urine, pale stools, pruritus and a palpable non-tender gallbladder. What is the most appropriate diagnostic pathway?",
    options: [
      "Cross-sectional imaging with CT and MRCP to assess a suspected malignant distal biliary obstruction, with ERCP-guided biliary drainage where required for cholangitis or palliation",
      "Immediate laparoscopic cholecystectomy, since Courvoisier's sign is diagnostic of gallstone disease",
      "Oral ursodeoxycholic acid and observation with six-monthly liver function tests",
      "Empiric antibiotics alone for presumed acute cholangitis without further imaging",
    ],
    correctAnswer: "Cross-sectional imaging with CT and MRCP to assess a suspected malignant distal biliary obstruction, with ERCP-guided biliary drainage where required for cholangitis or palliation",
    explanation: "Painless obstructive jaundice with a palpable gallbladder (Courvoisier's law) suggests malignant compression of the common bile duct — pancreatic head carcinoma, distal cholangiocarcinoma or ampullary disease — rather than stones, which usually produce a small scarred gallbladder after chronic cholecystitis. Management is staging with CT and MRCP, drainage via ERCP stenting for cholangitis or bilirubin reduction before surgery, and assessment for pancreaticoduodenectomy. Ursodeoxycholic acid treats cholestatic pruritus in some benign diseases but has no role in malignant obstruction, and antibiotics alone cannot relieve an obstructed duct.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false, // Courvoisier's law: painless jaundice + palpable GB implies malignancy not stones
  },

  // 11 — Colorectal surgery (medium)
  {
    slug: "surgery-principles--colorectal-surgery--uncomplicated-diverticulitis-sba",
    concept: "colorectal-surgery",
    format: "sba",
    stem: "A 68-year-old with left lower quadrant pain and low-grade fever has CT showing pericolic fat stranding and small pericolic air bubbles around diverticula, without free fluid or abscess. What is the most appropriate initial treatment?",
    options: [
      "Outpatient or inpatient non-operative management: clear fluids or low-residue diet and oral or intravenous antibiotics, with surgery reserved for complications",
      "Immediate Hartmann's procedure (sigmoid resection with end colostomy), which is mandatory for any CT evidence of diverticulitis",
      "Therapeutic colonoscopy to stent the affected diverticulum",
      "Colonoscopy with biopsy to exclude cancer before any treatment, performed urgently regardless of acute inflammation",
    ],
    correctAnswer: "Outpatient or inpatient non-operative management: clear fluids or low-residue diet and oral or intravenous antibiotics, with surgery reserved for complications",
    explanation: "Uncomplicated acute diverticulitis (Hinchey stage Ia/Ib — phlegmon or small contained abscess without generalised peritonitis) is managed non-operatively with bowel rest and antibiotics, because most episodes resolve and recurrence does not mandate elective resection. Surgery is indicated for generalised peritonitis, uncontrolled sepsis, large abscess (drainable percutaneously) or recurrent disease impairing quality of life. Colonoscopy is deferred until inflammation settles (typically 6-8 weeks later) to exclude an underlying carcinoma mimic, and is never urgent in the acute setting.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // Hinchey staging drives operative vs non-operative management
  },

  // 12 — Small bowel and emergency surgery (medium)
  {
    slug: "surgery-principles--small-bowel-surgery--sbo-vs-ileus-sba",
    concept: "small-bowel-surgery",
    format: "sba",
    stem: "Twelve days after an appendicectomy, a patient has colicky central abdominal pain, vomiting, distension and constipation. Which CT finding best distinguishes adhesive small bowel obstruction from a post-operative paralytic ileus?",
    options: [
      "Dilated small bowel loops with a discrete transition point to collapsed distal bowel, implying a mechanical obstruction",
      "Uniformly dilated small and large bowel without any transition point, which instead indicates adynamic ileus",
      "Absent bowel sounds on auscultation, a feature that is unique to mechanical obstruction",
      "Air-fluid levels within dilated loops, which occur only in mechanical obstruction",
    ],
    correctAnswer: "Dilated small bowel loops with a discrete transition point to collapsed distal bowel, implying a mechanical obstruction",
    explanation: "Mechanical obstruction is defined by a transition point between dilated and collapsed bowel, usually at an adhesive band after previous surgery; management begins with 'drip and suck' — nil by mouth, NG decompression and IV fluids — with a trial of conservative resolution and surgery for peritonitis, strangulation, or failure to settle. Paralytic ileus shows diffuse gaseous distension without a transition point and resolves with correction of electrolytes (especially potassium), sepsis control and mobilisation. Air-fluid levels and absent bowel sounds are common to both and cannot discriminate between them.",
    difficulty: "medium",
    marks: 1,
  },

  // 13 — Prostatic and bladder disease (medium)
  {
    slug: "surgery-principles--prostate-bladder--acute-retention-sba",
    concept: "prostate-bladder",
    format: "sba",
    stem: "A 72-year-old with a history of benign prostatic enlargement presents with a painful distended bladder, inability to pass urine and a post-void residual of 900 mL on bladder scan. What is the immediate management?",
    options: [
      "Urethral catheterisation to decompress the bladder, followed by an alpha-blocker and a planned trial without catheter",
      "Intravenous furosemide to stimulate diuresis and restart spontaneous micturition",
      "Suprapubic catheterisation as the mandatory first-line drainage route in all cases of acute retention",
      "Manual suprapubic compression to express urine, then discharge without further follow-up",
    ],
    correctAnswer: "Urethral catheterisation to decompress the bladder, followed by an alpha-blocker and a planned trial without catheter",
    explanation: "Acute urinary retention is a urological emergency requiring immediate catheter drainage; urethral catheterisation is first-line, with suprapubic drainage reserved for failed urethral passage (e.g. false passage or urethral stricture). An alpha-blocker such as tamsulosin increases the chance of a successful trial without catheter about two- to three-fold, and men who fail are considered for transurethral resection of the prostate. Diuretics are contraindicated — they worsen bladder stretch — and manual expression risks reflux and damage.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // alpha-blocker doubles trial-without-catheter success
  },

  // 14 — External genitalia and the scrotum (medium)
  {
    slug: "surgery-principles--genital-scrotal-surgery--torsion-sba",
    concept: "genital-scrotal-surgery",
    format: "sba",
    stem: "A 16-year-old is woken by sudden severe left scrotal pain; the testis lies horizontally and high, the cremasteric reflex is absent, and the overlying skin is not red. Which management is correct?",
    options: [
      "Immediate scrotal exploration — this is a surgical emergency, with detorsion, bilateral orchidopexy and orchidectomy for unsalvageable testis",
      "Doppler ultrasound to confirm absent intratesticular blood flow before any surgery, since epididymo-orchitis is the commoner cause",
      "Empiric oral antibiotics and scrotal support, with review in 48 hours",
      "Manual detorsion alone (open the book) and outpatient follow-up, as elective fixation is unnecessary",
    ],
    correctAnswer: "Immediate scrotal exploration — this is a surgical emergency, with detorsion, bilateral orchidopexy and orchidectomy for unsalvageable testis",
    explanation: "Sudden onset, an abnormal lie, absent cremasteric reflex and pain out of proportion to skin changes indicate testicular torsion until proven otherwise; salvage depends on time, with intervention within roughly 6 hours of symptom onset offering the best viability. Exploration must not be delayed by imaging — colour Doppler is used only when presentation is atypical and the diagnosis is genuinely uncertain. Manual detorsion (typically rotating the affected testis outward, 'opening the book') can relieve ischaemia en route to theatre, but bilateral orchidopexy is always required because the bell-clapper deformity is bilateral.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // ~6-hour window for testicular salvage; bell-clapper deformity bilateral
  },

  // 15 — Trauma principles (medium)
  {
    slug: "surgery-principles--trauma-principles--primary-survey-sba",
    concept: "trauma-principles",
    format: "sba",
    stem: "In the ATLS primary survey of a multiply injured patient, which sequence best describes the correct order of assessment and intervention?",
    options: [
      "Airway with cervical spine protection, breathing, circulation with control of external haemorrhage, disability (neurological status), then exposure with temperature control",
      "Circulation first with crystalloid boluses, because hypotension kills faster than an obstructed airway",
      "Complete CT imaging of the whole body before any clinical assessment, so injuries are prioritised in advance",
      "Disability first, as the Glasgow Coma Scale determines whether the patient can protect their own airway",
    ],
    correctAnswer: "Airway with cervical spine protection, breathing, circulation with control of external haemorrhage, disability (neurological status), then exposure with temperature control",
    explanation: "The ATLS primary survey follows ABCDE with in-line cervical spine protection throughout, because an obstructed airway causes death within minutes and life-threatening conditions (tension pneumothorax, open pneumothorax, massive haemothorax, flail chest, cardiac tamponade) are treated as they are identified. Circulation now emphasises early haemorrhage control — direct pressure, pelvic binders, tournquets — and balanced blood-product resuscitation, not litres of crystalloid. Disability (AVPU/GCS, pupils, glucose) follows, then exposure with warming; imaging (chest, pelvis, eFAST and CT) is an adjunct that does not precede resuscitation.",
    difficulty: "medium",
    marks: 1,
  },

  // 16 — Venous disease and lymphatics (medium)
  {
    slug: "surgery-principles--venous-disease--dvt-wells-sba",
    concept: "venous-disease",
    format: "sba",
    stem: "Four days after a knee replacement, a patient has unilateral calf swelling and pitting oedema; Wells score is 1 ('low probability') and D-dimer is negative. What is the most appropriate next step?",
    options: [
      "No further imaging — a low clinical probability with a negative D-dimer excludes deep vein thrombosis; reassure and manage risk factors",
      "Compression ultrasonography anyway, because D-dimer is always falsely negative after orthopaedic surgery",
      "Therapeutic anticoagulation immediately, since postoperative swelling is deep vein thrombosis until excluded",
      "Repeat the D-dimer in one week, because a single negative result is non-diagnostic in post-surgical patients",
    ],
    correctAnswer: "No further imaging — a low clinical probability with a negative D-dimer excludes deep vein thrombosis; reassure and manage risk factors",
    explanation: "Diagnostic algorithms such as Wells combine clinical probability with D-dimer: in low-probability patients a negative D-dimer safely excludes deep vein thrombosis and compression ultrasound is unnecessary, sparing radiation and cost. D-dimer is sensitive but non-specific and rises after surgery, trauma, cancer and pregnancy — in those settings a positive result warrants imaging, not treatment. Therapeutic anticoagulation is only started once imaging confirms thrombosis or, in high suspicion, empirically while awaiting it.",
    difficulty: "medium",
    marks: 1,
  },

  // 17 — Limb orthopaedics (medium)
  {
    slug: "surgery-principles--limb-orthopaedics--neck-of-femur-sba",
    concept: "limb-orthopaedics",
    format: "sba",
    stem: "An 82-year-old falls at home and cannot weight-bear; the right leg is shortened and externally rotated. Radiographs confirm an intracapsular femoral neck fracture. Which management principle is most correct?",
    options: [
      "Analgesia, pressure-area care and prompt surgical fixation or arthroplasty (typically within 36-48 hours), unless medical unfitness precludes it",
      "Skin traction applied for six weeks, the definitive treatment for intracapsular fractures in the elderly",
      "Immediate total hip replacement is contraindicated and the patient must be managed with bed rest alone",
      "Physiotherapy and a walker alone, since intracapsular fractures are treated non-operatively regardless of displacement",
    ],
    correctAnswer: "Analgesia, pressure-area care and prompt surgical fixation or arthroplasty (typically within 36-48 hours), unless medical unfitness precludes it",
    explanation: "Displaced intracapsular femoral neck fractures disrupt the retinacular blood supply and carry high risks of non-union and avascular necrosis, so they are treated surgically with either internal fixation in fitter patients or hemiarthroplasty/total hip replacement in older or less active patients. Non-operative care is reserved only for patients who are non-ambulant, analgesic-resistant or unfit for anaesthesia, because prolonged immobility causes pressure sores, pneumonia, delirium, VTE and death. Comfortable analgesia, skin protection and early optimisation are essential while theatre is arranged.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // 36-48 h operative window per NICE hip fracture standard
  },

  // 18 — Paediatric surgery (hard)
  {
    slug: "surgery-principles--paediatric-surgery--pyloric-stenosis-sba",
    concept: "paediatric-surgery",
    format: "sba",
    stem: "A 4-week-old boy has progressive projectile non-bilious vomiting after feeds, visible gastric peristalsis and an olive-shaped right upper quadrant mass. Bloods show hypochloraemic, hypokalaemic metabolic alkalosis. What is the correct management?",
    options: [
      "Correct dehydration, chloride and potassium deficits first, then perform Ramstedt's pyloromyotomy after biochemical normalisation",
      "Proceed directly to laparotomy without fluid correction, because the alkalosis is irrelevant to outcome",
      "Treat with prokinetics and thickened feeds, because this is a self-limiting motility disorder of infancy",
      "Perform an upper GI contrast study with gastrograffin, the definitive first-line therapy for the obstruction",
    ],
    correctAnswer: "Correct dehydration, chloride and potassium deficits first, then perform Ramstedt's pyloromyotomy after biochemical normalisation",
    explanation: "Hypertrophic pyloric stenosis causes gastric outlet obstruction with loss of hydrochloric acid, producing the characteristic hypochloraemic hypokalaemic metabolic alkalosis; surgery is never undertaken until fluids and electrolytes (especially chloride and potassium) are corrected, otherwise anaesthesia risks apnoea, arrhythmia and sudden death. Ramstedt's pyloromyotomy — splitting the hypertrophied muscle down to the mucosa — is curative, and the diagnosis is clinical, confirmed with ultrasound when needed, so contrast studies have no therapeutic role. Prokinetics would worsen vomiting and delay definitive treatment.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false, // correct chloride/potassium pre-op; Ramstedt procedure curative
  },

  // 19 — Approach to the vascular patient (hard)
  {
    slug: "surgery-principles--vascular-approach--claudication-abi-sba",
    concept: "vascular-approach",
    format: "sba",
    stem: "A 66-year-old smoker has reproducibly provoked calf claudication with an ankle-brachial pressure index of 0.65 and palpable pedal pulses. The foot is warm, intact and neurologically normal. What is the most appropriate initial management?",
    options: [
      "Risk-factor modification and a supervised exercise programme: smoking cessation, antiplatelet and statin therapy, exercise rehabilitation, with intervention reserved for lifestyle-limiting or progressive disease",
      "Immediate angioplasty or bypass, as any claudication indicates the need for urgent revascularisation",
      "Codeine-based analgesia and reassurance, with exercise therapy deliberately avoided",
      "Primary amputation, because claudication inevitably progresses to critical limb ischaemia in most patients",
    ],
    correctAnswer: "Risk-factor modification and a supervised exercise programme: smoking cessation, antiplatelet and statin therapy, exercise rehabilitation, with intervention reserved for lifestyle-limiting or progressive disease",
    explanation: "Intermittent claudication is usually chronic — only about 1-5% per year progress to critical limb ischaemia or amputation — and the limb is not threatened (warm, intact skin, palpable pulses, ABPI above 0.4), so best medical therapy and supervised exercise, which improves walking distance by two to three times observation alone, are first-line. Smoking cessation is the single most effective intervention to reduce progression and cardiovascular events, and secondary prevention comprises antiplatelet, high-intensity statin and diabetes/hypertension control. Angioplasty or bypass is considered for disabling or progressive symptoms, or if the patient develops rest pain, ulceration or tissue loss.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false, // supervised exercise doubles/triples pain-free walking distance; ~1-5% annual progression
  },

  // 20 — Post-operative care and complications (hard)
  {
    slug: "surgery-principles--postoperative-care--anastomotic-leak-sba",
    concept: "postoperative-care",
    format: "sba",
    stem: "On day 6 after an anterior resection, a patient who was progressing develops new tachycardia (118/min), fever (38.4 C), atrial fibrillation, a distended tender abdomen and faeculent output from the pelvic drain. Which complication and immediate action best fit?",
    options: [
      "Anastomotic leak with pelvic sepsis — resuscitate, give broad-spectrum antibiotics, obtain urgent CT imaging, and proceed to percutaneous drainage or laparotomy with washout, diverting stoma or resection as indicated",
      "Expected post-operative inflammatory response — continue observation and delay all intervention until day 10",
      "Superficial surgical site infection alone — swab the wound and treat the ileus with metoclopramide",
      "Pulmonary embolism, given the tachycardia and atrial fibrillation, with therapeutic anticoagulation as the sole priority",
    ],
    correctAnswer: "Anastomotic leak with pelvic sepsis — resuscitate, give broad-spectrum antibiotics, obtain urgent CT imaging, and proceed to percutaneous drainage or laparotomy with washout, diverting stoma or resection as indicated",
    explanation: "New tachycardia, fever, new atrial fibrillation, ileus and faeculent or purulent drain output days after bowel anastomosis are classic signs of anastomotic leak with intra-abdominal sepsis — 'a failure to progress that is not explained' — and demand resuscitation, antibiotics and urgent imaging. Localised collections are usually managed by radiologically guided drainage plus antibiotics, whereas generalised peritonitis or uncontrolled sepsis requires return to theatre for washout and either intra-abdominal resection with stoma or defunctioning. Unexplained post-operative tachycardia is never attributed to pain or inflammation alone until sepsis and leak have been actively excluded.",
    difficulty: "hard",
    marks: 1,
  },
];

async function seedAssessmentSurgery() {
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

  console.log(`✓ Surgery — Principles & General Operation assessment items: ${count} items (marks 1, needs-human-review)`);
}

// CLI usage: npx ts-node prisma/seed-assessment-surgery.ts
if (process.argv[1] && process.argv[1].includes("seed-assessment-surgery")) {
  seedAssessmentSurgery()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}

export { seedAssessmentSurgery, ITEMS as SURGERY_ITEMS };
