import { prisma, seedMbbsCourse, type LessonSeed, type SbaSeed, type SubjectSeed } from "./spine";

/**
 * PEDS 302 — Paediatrics.
 *
 * The course is authored to depth, in the pilot-report format with one SBA item
 * per concept: 14 authored lessons. Module 1 ("The child, growth and
 * development") states the physiology of growth and its charts, the newborn
 * examination and transitional circulation, infant feeding and failure to
 * thrive, the childhood immunisation programmes, the assessment of the febrile
 * child, and developmental assessment, neurodisability and safeguarding. The
 * highest-yield concepts of modules 2-5 are then taught in full: neonatal
 * resuscitation and neonatal hyperbilirubinaemia (module 2), paediatric fluid
 * therapy, acute airway infections and paediatric gastroenterology (module 3),
 * and childhood infectious disease, paediatric neurology and paediatric
 * emergencies (module 5).
 *
 * The remaining concepts of modules 2-5 (neonatal respiratory distress and
 * prematurity, congenital disease and infection, congenital heart disease and
 * paediatric cardiology, renal, endocrine, haematology and oncology,
 * neurodisability, adolescent health and palliative care) still ship as a real
 * concept spine and prerequisite DAG with tracked-placeholder lessons
 * (needsCheck true) — the authoring queue, not student-facing rows.
 *
 * Requires prisma/seed-university.ts first (faculty, department, programme),
 * and the pre-clinical and clinical subjects this course builds on.
 */

const COURSE_SLUG = "paediatrics-child-health";

const MODULES = [
  { slug: "growth-development-foundations", title: "M1 — The child, growth & development" },
  { slug: "neonatal-medicine", title: "M2 — Neonatal medicine & congenital disease" },
  { slug: "respiratory-cardiac-gastrointestinal", title: "M3 — Respiratory, cardiac & gastrointestinal" },
  { slug: "renal-endocrine-haematology-oncology", title: "M4 — Renal, endocrine, haematology & oncology" },
  { slug: "neurology-infection-adolescent-health", title: "M5 — Neurology, infection & adolescent health" },
];

// ---------------------------------------------------------------------------
// LESSON 1 — Growth, growth charts & development (fully authored)
// ---------------------------------------------------------------------------
function lesson1() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: distinguish growth from development and say what each depends on; measure weight, length or height and head circumference correctly and plot them on the right chart; describe the normal pattern and velocity of growth from birth to adulthood; state the milestones of gross motor, fine motor, language and social development and their age ranges; say when a measurement or a milestone is a red flag for investigation; and name the commonest causes of short and tall stature and of growth faltering.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "ANAT 101, PHYS 101 and OBGY 302 module 1. Growth is the integral of nutrition, endocrine function and health, and it is interpreted against the physiology you have already studied.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Growth",
        text: "The increase in size of the body and its parts, measured as weight, length or height, and head circumference. Growth is a rate, not a single measurement — it is the direction a child travels across a chart over time that carries the information, not the centile of one appointment.",
      },
      {
        type: "definition",
        term: "Development",
        text: "The acquisition of function and of skills: gross motor, fine motor and vision, hearing and language, and social and self-care behaviour. Development is a sequence with a direction — each skill is built on the one before it — and it is only interpreted against a child's corrected age after premature birth.",
      },
      {
        type: "paragraph",
        text: "Growth and development are the two measures of a child's health, because a child cannot report symptoms as an adult does. A child who is not growing is either not eating, not absorbing, not using what it absorbs, or working too hard — and each of those has a short, examinable list of causes. The growth chart is the single most informative investigation in paediatrics precisely because it is a record of months of physiology.",
      },
      {
        type: "paragraph",
        text: "The measurement technique matters more than the chart. Length is measured lying down to two years of age, and height standing after that; the same child measured by length and by height will appear to have lost 1 to 2 cm of growth at the changeover, which is an artefact and not disease. Weight should be on a calibrated scale, ideally in the same clothing and at the same time of day.",
      },

      { type: "heading", level: 2, text: "Worked example 1: the normal growth curve" },
      {
        type: "table",
        headers: ["Age", "Weight (approx.)", "Length or height (approx.)", "What is happening"],
        rows: [
          ["Birth", "3.5 kg", "50 cm", "Weight is usually lost in the first week and regained by 10 to 14 days; the head circumference is about 35 cm"],
          ["1 year", "10 kg", "75 cm", "Rapid decelerating growth — roughly 25 cm is added in the first year"],
          ["2 years", "12.5 kg", "87 cm", "About 12 cm is added in the second year, then growth settles to roughly 6 cm per year"],
          ["4 years", "16 kg", "100 cm", "Height has roughly doubled the birth length"],
          ["8 years", "25 kg", "128 cm", "Steady mid-childhood growth, governed by growth hormone and thyroid hormone"],
          ["Puberty", "—", "About 8 cm of pubertal growth spurt", "Oestrogen and testosterone accelerate growth and then close the epiphyses"],
        ],
      },
      {
        type: "paragraph",
        text: "A useful rule for the viva and the ward: a term newborn doubles its birth weight by about 4 to 5 months and triples it by a year, gains about 25 g a day in the first three months, and adds 2.5 cm of head circumference in the first year. Any child whose weight crosses down two centile spaces is faltering whatever the absolute value says.",
      },

      { type: "heading", level: 2, text: "Worked example 2: the developmental milestones" },
      {
        type: "table",
        headers: ["Age", "Gross motor", "Fine motor and vision", "Language and social"],
        rows: [
          ["6 weeks", "Smiles responsively", "Fixes and follows a face through 180 degrees", "Coos"],
          ["6 months", "Sits with support, rolls both ways", "Palmar grasp, transfers hand to hand", "Babbles, laughs, takes objects to the mouth"],
          ["9 months", "Sits unsupported, is mobile by rolling or crawling", "Immature pincer grasp", "Understands 'no', stranger awareness begins"],
          ["12 months", "Walks with one hand held or alone", "Mature pincer grasp", "One or two words with meaning, waves bye-bye"],
          ["18 months", "Runs stiffly, walks upstairs with a hand held", "Scribbles, towers two or three bricks", "Ten to twenty words, points to what it wants"],
          ["2 years", "Runs, kicks a ball, walks up and down stairs", "Towers six bricks, uses a spoon", "Joins two words, follows a two-step instruction"],
          ["4 years", "Hops, stands on one leg briefly", "Draws a person with three parts", "Tells a story, plays cooperatively"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The ages above are the ages by which a milestone should be present. Walking alone later than 18 months, no single words by 18 months, or no sitting by 9 months are red flags that require hearing assessment and developmental evaluation — and a child with no babbling by 12 months must have its hearing tested.",
      },
      {
        type: "paragraph",
        text: "Prematurity must be corrected for until at least two years of age: a child born at 28 weeks is by twelve weeks behind a term infant, so its milestones are judged against the age from the expected date of delivery, not the date of birth. Development is not evenly distributed across domains either — a child with a motor impairment may have normal language, and the domains must be assessed separately.",
      },

      { type: "heading", level: 2, text: "Worked example 3: short and tall stature" },
      {
        type: "table",
        headers: ["Category", "Typical mechanism", "Examples"],
        rows: [
          ["Normal variants", "The child is growing at a normal rate, on or parallel to a centile", "Familial short stature — a short parent; constitutional delay of growth and puberty"],
          ["Growth faltering", "A normal child crossing down centiles — nutrition or disease", "Coeliac disease, inflammatory bowel disease, anorexia, hypothyroidism, chronic kidney disease, psychosocial deprivation"],
          ["Intrinsic short stature", "The growth potential itself is reduced", "Turner syndrome (45,X), skeletal dysplasias, Russell-Silver syndrome, history of radiotherapy to the spine"],
          ["Endocrine", "The growth hormone axis or the thyroid axis has failed", "Growth hormone deficiency, hypothyroidism, excess glucocorticoid"],
          ["Tall stature", "Advanced growth or a growth signal that will not switch off", "Constitutional tall stature, early puberty, Marfan syndrome, growth hormone excess"],
        ],
      },
      {
        type: "definition",
        term: "Mid-parental height",
        text: "The target a child is expected to reach: the mean of the parents' heights, plus 7 cm for a boy and minus 7 cm for a girl (a range of about 10 cm either side). A child growing consistently outside their mid-parental range is a child to be investigated even if they are on a normal centile.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The child who stops growing across centiles is the child who needs a diagnosis, and the child who is small but tracking along a centile and is in proportion is usually a variant. The questions that separate them are the velocity, the mid-parental height, the weight-to-height relationship, and the timing of puberty.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Plotting the head circumference but not measuring it properly, around the occiput and the supraorbital ridges. Squeezing the tape gives a falsely small head; a measurement taken at the wrong level is the commonest spurious finding on a growth chart.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Diagnosing failure to thrive on one low weight. A single weight is a snapshot; the diagnosis belongs to the direction of travel across at least two, preferably three, measurements separated in time.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting to correct for prematurity when judging milestones, or judging an infant of one diabetic mother or a growth-restricted infant against a term child's chart.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Sending every child who is a heavy user of a word list for a scan. Red flags for imaging are a raised intracranial pressure, a progressive neurological sign, an asymmetry, or a regression — not delay alone.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does the direction of travel across a growth chart matter more than the absolute centile?",
        answer: "Because growth is a rate: a healthy child tracks along a centile, so a child on the 2nd centile who is following that line is normal, whereas a child who has crossed down two centile spaces is faltering and needs a cause found.",
        explanation: "Weight and height are interpreted against time and against the child's own previous measurements, never in isolation.",
      },
      {
        type: "question",
        prompt: "State three red flags in growth or development that would prompt investigation.",
        answer: "A fall of two major centile spaces for weight or height, no sitting unsupported by 9 months, no single words by 18 months, and any loss of a previously acquired skill (regression).",
        explanation: "These are the thresholds at which a general assessment stops and a structured investigation begins.",
      },
      {
        type: "question",
        prompt: "How is the expected adult height of a child calculated from the parents?",
        answer: "Take the mean of the mother's and the father's heights, add 7 cm for a boy and subtract 7 cm for a girl, with a normal range of about 10 cm either side.",
        explanation: "This is the mid-parental height, and it is the comparison against which a child's own trajectory is judged.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A 9-month-old child has crossed down two centile spaces for weight while length has tracked along its centile. What is the single most useful next question?",
        options: [
          "Which chromosome abnormality does the child have?",
          "What is the child actually eating and drinking, and how much?",
          "Has the growth hormone level been measured?",
          "What is the height of the father?",
        ],
        correctIndex: 1,
        explanation: "A weight that falls while length is maintained is the classic pattern of inadequate intake, and the first assessment is a feeding history, not an endocrine or genetic test.",
      },
      {
        type: "mcq",
        stem: "A child born at 28 weeks' gestation is reviewed at 12 months of age. How should the milestones be judged?",
        options: [
          "Against 12 months, because chronological age is what the family uses",
          "Against about 9 months, correcting for the 12 weeks of prematurity until at least 2 years of age",
          "Against 14 months, adding the gestation shortfall to the age",
          "Milestones cannot be judged in a premature infant at all",
        ],
        correctIndex: 1,
        explanation: "Development is assessed against the corrected age — the age from the expected date of delivery — and the correction is applied until at least two years of age.",
      },
      {
        type: "mcq",
        stem: "Which of the following is a red flag for short stature requiring investigation?",
        options: [
          "A child on the 2nd centile, tracking along that centile, with short parents",
          "A child whose height has crossed down two centile spaces over 18 months",
          "A child who is short for their mid-parental height but is gaining weight normally",
          "A child with an advanced bone age",
        ],
        correctIndex: 1,
        explanation: "Falling across centile spaces is growth faltering by definition and needs investigation; tracking along a centile, even a low one, with short parents is familial short stature.",
      },
      {
        type: "mcq",
        stem: "A mother is worried that her 18-month-old has not yet walked alone and says only a few words. What is the most appropriate first action?",
        options: [
          "Reassure and review in six months",
          "Arrange a developmental assessment and a formal hearing test",
          "Order a cranial MRI scan",
          "Start growth hormone therapy",
        ],
        correctIndex: 1,
        explanation: "Not walking by 18 months and a very small vocabulary are red flags; both a developmental evaluation and a hearing assessment are indicated before any reassurance.",
      },
      {
        type: "mcq",
        stem: "Why must length and height be interpreted separately on a growth chart?",
        options: [
          "Because length is always measured to the nearest centimetre",
          "Because measuring the same child lying and then standing gives a spurious fall of 1 to 2 cm",
          "Because height cannot be measured before 5 years",
          "Because the two measure different bones",
        ],
        correctIndex: 1,
        explanation: "Length is measured recumbent to 2 years and height standing afterwards; the changeover produces an apparent centile fall that is an artefact of technique.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Growth is the rate at which a child gets bigger and development is the sequence of skills it acquires; both are judged against charts and corrected ages, and both are read as trajectories. A weight that falls while length is maintained points to intake; a height that falls points to endocrine, absorptive or genetic disease; and a delay or a regression of milestones demands a hearing test and a developmental assessment. Growth, once measured, is how paediatrics sees inside a child who cannot describe its own illness.",
      },
      {
        type: "paragraph",
        text: "Next: the newborn — the physiology of transition, the first examination, and the screening that is performed in the first days of life.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 2 — The newborn: adaptation, examination & screening (fully authored)
// ---------------------------------------------------------------------------
function lesson2() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the transition from fetal to neonatal circulation and name the structures that close; state the components and interpretation of the APGAR score; perform a systematic newborn examination and say what each part excludes; distinguish physiological from pathological jaundice; list the screening tests offered in the first weeks of life and the timing of each; and name the congenital infections that must be excluded in an affected infant.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1, PHYS 101 module 1 and OBGY 302 module 1. The fetal circulation, the positive and negative feedback loops, and the physiology of pregnancy are all assumed here.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "paragraph",
        text: "Birth is a respiratory event. In the fetus the lungs are fluid-filled and the placenta is the organ of gas exchange; the first breath aerates the lungs, pulmonary vascular resistance falls, venous return to the left atrium rises and the right-to-left shunts close. Everything that follows — the closure of the ductus arteriosus, the clamping of the cord, the onset of feeding, the first void of urine — is the body re-plumbing itself from a placental circulation to its own.",
      },
      {
        type: "definition",
        term: "Transitional circulation",
        text: "The hours after birth during which the fetal shunts close. Functional closure of the foramen ovale occurs within minutes as left atrial pressure rises; the ductus arteriosus closes functionally within 24 to 72 hours under the influence of a rise in oxygen tension and a fall in prostaglandins, and anatomically over the following 2 to 3 weeks.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "A fetus that has been chronically hypoxic in utero keeps its pulmonary arterioles muscularised, so a persistently raised pulmonary vascular resistance after birth re-opens the right-to-left shunt — persistent pulmonary hypertension of the newborn, which requires intensive care and is a leading cause of early neonatal collapse.",
      },

      { type: "heading", level: 2, text: "Worked example 1: the APGAR score" },
      {
        type: "table",
        headers: ["Component", "0", "1", "2"],
        rows: [
          ["Appearance (colour)", "Blue or pale all over", "Pink body, blue extremities (acrocyanosis)", "Completely pink"],
          ["Pulse (heart rate)", "Absent", "Below 100 beats per minute", "Above 100 beats per minute"],
          ["Grimace (reflex irritability)", "No response", "Grimace or weak cry on stimulation", "Cough, sneeze, pulls away"],
          ["Activity (muscle tone)", "Limp", "Some flexion of the limbs", "Active movement"],
          ["Respiration (respiratory effort)", "Absent", "Slow, irregular, weak cry", "Good, strong cry"],
        ],
      },
      {
        type: "paragraph",
        text: "The score is recorded at one minute and again at five minutes, and it describes how the baby tolerated the birth and how it has responded, not a diagnosis. A score of 7 or less at five minutes means the score is repeated every five minutes until it is above 7; a score of 3 or less at five minutes is a severely depressed baby requiring resuscitation and support. A persistently low score is not a reason to stop resuscitating — the neonatal resuscitation algorithm is driven by the heart rate and the respiratory effort.",
      },

      { type: "heading", level: 2, text: "Worked example 2: the first examination" },
      {
        type: "table",
        headers: ["System", "What is examined", "What it excludes"],
        rows: [
          ["General", "Colour, posture, tone, activity, maturity, dysmorphic features", "Sepsis, encephalopathy, syndrome, chromosomal abnormality"],
          ["Head and fontanelles", "Shape and moulding, anterior and posterior fontanelle, sutures", "Premature fusion of the sutures, raised intracranial pressure, birth injury"],
          ["Face", "Palate, ears (position and form), eye size and red reflex", "Cleft palate, anotia or microtia, congenital cataract, retinoblastoma"],
          ["Chest", "Respiratory rate and work of breathing, symmetry, auscultation", "Respiratory distress syndrome, pneumothorax, pneumonia, diaphragmatic hernia"],
          ["Cardiovascular", "Femoral pulses, heart sounds, murmurs, saturation", "Coarctation of the aorta, patent ductus arteriosus, critical congenital heart disease"],
          ["Abdomen", "Umbilical cord, scaphoid abdomen, masses, bowel sounds, liver and spleen", "Umbilical hernia, intestinal obstruction, renal or pelvic mass, exomphalos"],
          ["Genitalia and anus", "Testes in boys, genital folds in girls, patency of the anus", "Undescended testes, ambiguous genitalia, imperforate anus"],
          ["Spine, hips and limbs", "Spinal dimples or hairy patches, developmental dysplasia of the hips, limb pulses", "Neural tube defect, hip dislocation, limb reduction"],
          ["Skin", "Jaundice, naevi, rashes, perfusion", "Haemangioma, congenital infection, capillary refill"],
          ["Neurology", "Primitive reflexes, tone, spontaneous movement", "Hypoxic-ischaemic encephalopathy, neuromuscular disorder, brachial plexus injury"],
        ],
      },
      {
        type: "paragraph",
        text: "The examination is performed in the first hours of life and repeated in full before discharge. Two components are time-critical and are checked on every examination: the femoral pulses (a weak or absent femoral pulse in an unwell baby is coarctation until proven otherwise) and the red reflex (an absent or white reflex is a congenital cataract or a retinoblastoma, and needs same-week ophthalmology).",
      },
      {
        type: "definition",
        term: "Primitive reflexes",
        text: "The reflexes of the newborn that disappear as the cortex matures: rooting and sucking, the grasp, the Moro response, the asymmetric tonic neck reflex and the placing and stepping reflexes. The Moro disappears by 4 to 6 months and persistence beyond about 6 months, or asymmetry of a unilateral reflex, is abnormal.",
      },

      { type: "heading", level: 2, text: "Worked example 3: jaundice and neonatal screening" },
      {
        type: "table",
        headers: ["Feature", "Physiological jaundice", "Pathological jaundice — investigate"],
        rows: [
          ["Onset", "After the first 24 hours of life", "Within the first 24 hours — always pathological"],
          ["Peak", "Day 3 to 5, then falling", "Rising after day 5, or rising by more than about 8 µmol/L per hour (5 mg/dL per day)"],
          ["Duration", "Settles by 2 weeks in a term infant, 3 weeks preterm", "Persists beyond those limits, or becomes conjugated"],
          ["Conjugated bilirubin", "Always below the conjugated threshold", "Any conjugated bilirubin over about 20 µmol/L (2 mg/dL) — biliary obstruction, e.g. biliary atresia"],
          ["Associated features", "A well, alert, feeding infant", "Poor feeding, lethargy, high-pitched cry, hypotonia, fever, hepatosplenomegaly, dark urine, pale stools"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Pale stools and dark urine in a jaundiced infant of 2 to 8 weeks is biliary atresia until proven otherwise, and the surgical window is short: Kasai portoenterostomy is far more successful before 8 weeks of age. Never reassure a family that a prolonged jaundice will settle.",
      },
      {
        type: "paragraph",
        text: "All infants are treated against age-specific bilirubin thresholds rather than against a single number, and phototherapy or exchange transfusion is used to prevent kernicterus — the bilirubin encephalopathy of acute and then chronic neurological injury. Unconjugated hyperbilirubinaemia in the first day suggests haemolysis: rhesus or ABO incompatibility, or glucose-6-phosphate dehydrogenase deficiency.",
      },
      {
        type: "table",
        headers: ["Screening test", "Timing", "What it detects"],
        rows: [
          ["Newborn hearing screening", "Within the first days to weeks of life", "Permanent childhood hearing impairment"],
          ["Newborn blood spot", "Day 5 to 7 of life on a heel-prick sample", "Phenylketonuria, congenital hypothyroidism, sickle cell disease, cystic fibrosis, medium-chain acyl-CoA dehydrogenase deficiency, and a widening panel of inherited metabolic disease"],
          ["Newborn pulse oximetry", "After 24 hours of age", "Critical congenital heart disease with a duct-dependent circulation"],
          ["Newborn physical examination", "First 72 hours, and repeated before discharge", "The structural and developmental abnormalities the examination can find"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Vitamin K given as a single intramuscular dose at birth prevents vitamin K deficiency bleeding of the newborn — the early, classical and late forms, the last of which presents with intracranial haemorrhage in an exclusively breastfed infant at 2 to 8 weeks. A single dose is the most effective, cheapest intervention in the whole of paediatrics, and oral regimens require repeat doses because of the low vitamin K content of breast milk.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Treating the APGAR score as the resuscitation algorithm. The heart rate at 30 seconds and 60 seconds of effective ventilation is what drives resuscitation, and the APGAR score is scored afterwards and is not used to decide anything.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Accepting a single breastfed infant's rapid weight loss of more than about 10 per cent as normal. A greater loss, or a failure to regain birth weight by 10 to 14 days, is a feeding problem that must be assessed before it becomes hypernatraemic dehydration.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Labelling a jaundice that started at 30 hours of age as physiological. Clinical observation and a bilirubin measurement, not a judgement from memory, decide whether the jaundice is physiological.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What are the features that make neonatal jaundice pathological?",
        answer: "Jaundice starting in the first 24 hours, a rapid rise (more than about 8 µmol/L or 5 mg/dL per hour), a prolonged course beyond 2 weeks in a term or 3 weeks in a preterm infant, any conjugated bilirubin, or a baby who is unwell, febrile, lethargic or feeding poorly.",
        explanation: "These features trigger investigation for haemolysis, infection, metabolic disease or biliary obstruction.",
      },
      {
        type: "question",
        prompt: "Why is the femoral pulse palpated in every newborn examination?",
        answer: "Because coarctation of the aorta produces weak or absent femoral pulses with upper-body hypertension, and it is the commonest serious structural heart disease that would otherwise be missed on examination.",
        explanation: "A duct-dependent coarctation can present after discharge with collapse and acidosis, so the pulse check at screening is the safety net.",
      },
      {
        type: "question",
        prompt: "Name three congenital infections that can produce a detectable, treatable neonatal picture.",
        answer: "Cytomegalovirus (sensorineural deafness, thrombocytopenia, hepatosplenomegaly, intracranial calcification), toxoplasmosis (hydrocephalus, chorioretinitis, intracranial calcification), and syphilis (maculopapular rash, snuffles, hepatomegaly, osteochondritis).",
        explanation: "Each is treatable or at least modifiable, which is why maternal screening and neonatal detection matter.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "An infant of 30 hours of age is visibly jaundiced. What is the correct interpretation?",
        options: [
          "Physiological jaundice, reassure the parents",
          "Jaundice in the first 24 hours is always pathological and requires urgent investigation",
          "Test the stool colour and review in a week",
          "Start phototherapy without measuring the bilirubin",
        ],
        correctIndex: 1,
        explanation: "Jaundice appearing before 24 hours of age is never physiological; it points to haemolysis, infection or sepsis, and demands a same-day bilirubin and blood-group workup.",
      },
      {
        type: "mcq",
        stem: "A newborn has a white reflex on fundoscopy at the six-week check. What is the priority?",
        options: [
          "Review in the routine 8-month check",
          "Same-week ophthalmology referral, because congenital cataract and retinoblastoma both present as an absent red reflex",
          "Reassure, because a white reflex is common in newborns",
          "Start antibiotic eye drops",
        ],
        correctIndex: 1,
        explanation: "The red reflex is tested at every newborn examination precisely to catch cataract and retinoblastoma, and both need urgent referral.",
      },
      {
        type: "mcq",
        stem: "Which statement about the APGAR score is correct?",
        options: [
          "It determines whether resuscitation is started",
          "It is a record of how the birth was tolerated and of the response, and is not the resuscitation algorithm",
          "It is scored only at one minute",
          "A score of 7 at five minutes is normal and requires no further assessment",
        ],
        correctIndex: 1,
        explanation: "Resuscitation is driven by heart rate and respiratory effort from 30 seconds; the APGAR score is scored afterwards for documentation and prognosis.",
      },
      {
        type: "mcq",
        stem: "A breastfed infant has lost 11 per cent of birth weight by day 5 and has not regained it by 2 weeks. What is the first step?",
        options: [
          "Reassure, because breastfed babies lose weight",
          "Assess the feeding — attachment, frequency, volume transferred — and the infant's hydration and output",
          "Change to formula without assessment",
          "Send a growth hormone level",
        ],
        correctIndex: 1,
        explanation: "Weight loss beyond about 10 per cent or failure to regain weight by 10 to 14 days is a feeding problem that must be diagnosed before it becomes hypernatraemic dehydration.",
      },
      {
        type: "mcq",
        stem: "Which sequence best describes the transition from fetal to neonatal circulation?",
        options: [
          "The ductus arteriosus opens, pulmonary blood flow falls",
          "The lungs aerate, pulmonary vascular resistance falls, left atrial pressure rises and the right-to-left shunts close",
          "The foramen ovale opens permanently, and the ductus venosus closes first",
          "The placenta takes over gas exchange after birth",
        ],
        correctIndex: 1,
        explanation: "Aeration of the lungs drops pulmonary vascular resistance, which raises left-sided pressure and closes the foramen ovale; the ductus then constricts under rising oxygen tension.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Birth changes the site of gas exchange and the newborn must re-plumb its circulation within hours; the APGAR score records how that transition went, and a persistently low score is managed by the resuscitation algorithm rather than by the score. The newborn examination is a systematic screen for the structural abnormalities that are treatable only if they are found — the femoral pulses, the red reflex, the hips, the palate and the anus — and the first weeks add hearing, blood spot and pulse-oximetry screening. Jaundice is physiological only after 24 hours, only if it settles in time, and only in a well baby.",
      },
      {
        type: "paragraph",
        text: "Next: feeding — breast milk, formula, weaning, and the child who is not putting on weight.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 3 — Infant feeding & failure to thrive (fully authored)
// ---------------------------------------------------------------------------
function lesson3() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: state the recommendation for exclusive milk feeding and the advantages and disadvantages of breast milk; calculate the fluid and energy requirement of an infant and a young child; describe the sequence and principles of weaning; define failure to thrive and organise its causes into inadequate intake, malabsorption, increased losses and increased requirements; take a feeding history that separates a feeding problem from an organic disease; and recognise the presentation of severe acute malnutrition.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-2, PHYS 101 and BCHM 101 module 1 (macronutrients and energy metabolism). Feeding is the physiology of previous lessons applied to the one thing a child does every few hours.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "paragraph",
        text: "An infant's requirement is enormous: a term newborn takes roughly 150 mL of milk per kilogram per day, which is a seventh of its body weight, and burns energy at nearly three times the adult rate per kilogram. Everything else in infant feeding follows from that arithmetic — the frequent small feeds, the need for a calorie-dense milk, the short fasting intervals before surgery, and the speed with which dehydration develops.",
      },
      {
        type: "definition",
        term: "Exclusive breastfeeding",
        text: "Feeding an infant breast milk alone, with no other fluid or food, for the first six months of life. This is the recommendation of the World Health Organization and of national bodies, because breast milk meets the infant's requirement, changes composition with the feed and with the infant's age, and reduces gastrointestinal and respiratory infection, otitis media and sudden infant death syndrome.",
      },
      {
        type: "paragraph",
        text: "Colostrum, the secretion of the first days, is low in volume and rich in immunoglobulin A, lactoferrin and growth factors; it is not 'weak milk' but the immunisation and the priming of the gut that the newborn receives before the milk comes in on day 3 to 5. Mature milk is roughly 70 kcal per 100 mL, of which about half the energy is fat.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Infant formula is a safe substitute and is built from modified cows' milk: the protein is reduced and altered, the fat and the carbohydrate are adjusted, and formula is fortified with iron and vitamins. It should not be concentrated or diluted beyond instruction, and a formula-fed infant does not need any other fluid in the first six months.",
      },

      { type: "heading", level: 2, text: "Worked example 1: how much, and what" },
      {
        type: "table",
        headers: ["Requirement", "Amount", "Comment"],
        rows: [
          ["Fluid", "About 150 mL/kg/day in the first months, falling to about 100 mL/kg/day by one year", "Maintenance fluid for a 6 kg infant is about 900 mL/day; more is needed with fever, diarrhoea or a hot environment"],
          ["Energy", "About 100 to 110 kcal/kg/day in infancy, falling to about 80 kcal/kg/day by one year", "Requirement per kilogram falls as growth decelerates"],
          ["Feeds", "8 to 12 in the first 24 hours for a newborn; by 3 months, 6 to 8", "Feeding on demand, including at night, is what establishes supply and intake"],
          ["Vitamin D", "400 IU (10 µg) daily for the exclusively or partly breastfed infant", "Maternal deficiency, limited sun exposure, and the low vitamin D content of breast milk are the reasons"],
          ["Solids", "Introduced at about 6 months, and never before 17 weeks", "The extrusion reflex has faded, the gut and the kidneys are mature, and the infant can sit with support"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Do not give honey to an infant under 12 months, and do not add salt or sugar to an infant's food: honey may contain Clostridium botulinum spores, the immature gut permits colonisation, and the result is infant botulism. Whole nuts are a choking hazard and should be given only ground or as a smooth paste.",
      },
      {
        type: "table",
        headers: ["Stage of weaning", "Texture", "Purpose"],
        rows: [
          ["Around 6 months", "Smooth purée or mashed food, from a spoon", "Teaches swallowing from a spoon and the taste of new foods"],
          ["7 to 9 months", "Mashed with soft lumps, soft finger foods", "Teaches chewing and the tongue-to-palate manipulation that speech also uses"],
          ["10 to 12 months", "Chopped family food, finger foods, self-feeding", "Builds the jaw, the pincer grasp and the autonomy of eating"],
        ],
      },
      {
        type: "paragraph",
        text: "Weaning is a staged introduction, not a substitution: milk remains the main source of nutrition through the first year while the quantity and the texture of food increase. The commonest errors are starting too early (before the gut and kidneys are ready, and displacing milk), delaying too long (the window for accepting lumps closes at about 9 months and late weaning is associated with later feeding difficulty), and continuing on smooth purée into the second year.",
      },

      { type: "heading", level: 2, text: "Worked example 2: failure to thrive" },
      {
        type: "definition",
        term: "Failure to thrive",
        text: "A weight that falls across two centile spaces, or a weight below the 2nd centile that has failed to rise, or a weight for height below the expected range. In most cases the length is preserved while the weight falls — which tells you immediately that the problem is intake, not absorption of calories or a disease of growth.",
      },
      {
        type: "table",
        headers: ["Mechanism", "Diseases", "The clue in the history"],
        rows: [
          ["Not enough taken in", "Breastfeeding difficulty, overdiluted formula, food aversion, neglect, anorexia of any illness", "The feeding history — how long the feed takes, how much is swallowed, how the bottle is mixed"],
          ["Not absorbed", "Coeliac disease, cystic fibrosis, short bowel, post-infective enteropathy, cows' milk protein intolerance", "Steatorrhoea, loose or greasy stools, abdominal distension, anaemia, failure to gain weight from about 6 months"],
          ["Lost", "Protracted diarrhoea, vomiting with gastro-oesophageal reflux or pyloric stenosis, protein-losing enteropathy", "Stool and vomit frequency, volume, and content"],
          ["Used too fast", "Congenital heart disease, chronic lung disease, chronic kidney disease, malignancy, thyrotoxicosis", "Breathlessness or sweating on feeding, recurrent chest infections, polyuria, pallor, irritability"],
          ["Genetic", "Turner syndrome, primordial growth failure, skeletal dysplasia", "Dysmorphic features, webbed neck, lymphoedema of the hands and feet, proportional shortness"],
        ],
      },
      {
        type: "paragraph",
        text: "The single most productive investigation is a full feeding and stool history taken with a feeding diary kept for a week. A three-day diary of everything the child actually takes, with the weight before and after feeds, resolves the majority of cases without a single test. Bloods are for the cases in which the history and examination leave a question: coeliac serology, full blood count, renal and liver function, and a sweat test where cystic fibrosis is plausible.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Severe acute malnutrition — weight-for-height below minus 3 standard deviations, a mid-upper-arm circumference below 11.5 cm, or bilateral nutritional oedema — is managed by a refeeding protocol, not by a rapid correction of weight. Refeeding syndrome is the lethal danger: phosphate, potassium and magnesium fall within hours of the first feeds, and energy must be introduced cautiously with the electrolytes monitored.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Blaming the mother for every failure to thrive. The diagnosis is a feeding and stool history; using a pejorative frame closes the history and mislabels the majority of cases that have an organic cause.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Advising a 'top-up' of formula for every breastfed infant whose weight is slightly low, without first watching a feed. Most apparent low supply is an attachment or frequency problem that is solved by support, not by supplementing.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Giving cows' milk as a main drink before 12 months of age, or as the main drink in large volume in the second year: it is low in iron, folate, vitamin C and fat, and excessive intake causes iron-deficiency anaemia and protein load.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does the relationship between weight and height distinguish a feeding problem from a disease of growth?",
        answer: "Because energy deprivation reduces weight first while length is preserved, whereas disorders of growth hormone, the thyroid or the bones reduce height and length, so a low weight for height is intake and a low height with preserved weight is growth.",
        explanation: "Body proportions are the first clue to which mechanism is in play.",
      },
      {
        type: "question",
        prompt: "State the maintenance fluid volume for a 6 kg infant and the reasoning.",
        answer: "About 150 mL/kg/day, which is 900 mL a day, since a young infant's requirement per kilogram is about 150 mL and this falls to roughly 100 mL/kg by one year as growth decelerates.",
        explanation: "The same per-kilogram rule underlies the fluid prescription for a child before surgery and for rehydration.",
      },
      {
        type: "question",
        prompt: "Which infants should receive vitamin D supplementation, and how much?",
        answer: "Exclusively and predominantly breastfed infants should receive 400 IU (10 µg) daily, as should older children and adolescents at risk of deficiency, because breast milk contains little vitamin D and the infant cannot sunbathe safely.",
        explanation: "Deficiency causes rickets, hypocalcaemic seizures in infancy, and in the long term reduced bone mass.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A 5-month-old infant has a weight that has crossed two centile spaces down while length has tracked its centile. What is the most likely mechanism?",
        options: [
          "Growth hormone deficiency",
          "Inadequate intake",
          "Coeliac disease",
          "Turner syndrome",
        ],
        correctIndex: 1,
        explanation: "Weight falling with height preserved is the classic pattern of insufficient intake, and the diagnosis is made in the feeding history.",
      },
      {
        type: "mcq",
        stem: "What is the recommended volume of milk for a 6 kg newborn?",
        options: ["600 mL a day", "About 900 mL a day (150 mL/kg/day)", "1500 mL a day", "300 mL a day"],
        correctIndex: 1,
        explanation: "A young infant needs roughly 150 mL/kg/day, so a 6 kg infant takes about 900 mL, which is why feeds are frequent and small.",
      },
      {
        type: "mcq",
        stem: "At what age should complementary food be introduced, and why not earlier?",
        options: [
          "At 3 months, to help sleep through the night",
          "At about 6 months, when the gut and kidneys are mature and the infant can sit with support",
          "At 2 months, to start the weaning window",
          "At 12 months, when the first teeth appear",
        ],
        correctIndex: 1,
        explanation: "Solids are introduced at about 6 months and never before 17 weeks; earlier feeding displaces milk and gives a load the immature gut and kidneys handle badly.",
      },
      {
        type: "mcq",
        stem: "A severely malnourished child is admitted and started on a therapeutic feed. Which complication must be anticipated in the first days?",
        options: [
          "Hyperkalaemia",
          "Refeeding syndrome — phosphate, potassium and magnesium fall as feeding begins",
          "Iron overload",
          "Vitamin D toxicity",
        ],
        correctIndex: 1,
        explanation: "Refeeding syndrome follows the insulin-driven cellular uptake of electrolytes, and can cause arrhythmia, cardiac failure and death.",
      },
      {
        type: "mcq",
        stem: "Which of the following must never be given to an infant under 12 months?",
        options: [
          "Breast milk",
          "Honey",
          "Strained vegetables",
          "Fortified infant formula",
        ],
        correctIndex: 1,
        explanation: "Honey may contain Clostridium botulinum spores, and the immature gut permits colonisation with infant botulism.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "An infant needs about 150 mL and 100 to 110 kcal per kilogram a day, which is why it feeds every two to three hours and why fasting and illness are so poorly tolerated. Exclusive breast milk for six months is the recommended standard; formula is a safe, adjusted substitute; weaning begins at about six months and progresses in texture from smooth to lumpy to family food. Failure to thrive is defined by the trajectory across centiles, and its commonest cause is inadequate intake — diagnosed by a feeding and stool diary, not by a panel of blood tests.",
      },
      {
        type: "paragraph",
        text: "Next: immunisation — the one intervention in paediatrics that has saved more lives than every drug combined.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 4 — Immunisation (fully authored)
// ---------------------------------------------------------------------------
function lesson4() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: classify vaccines as live-attenuated, inactivated, subunit or toxoid, and say how each produces protection; state the clinical response that protection depends on and its timing; distinguish a true contraindication from a false one; interpret the routine childhood immunisation schedule; describe the schedules for premature infants, the immunosuppressed, and children who have missed doses; and counsel a hesitant parent factually.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 3 and PHRM 202 and PATH 201 module 1 (inflammation and the adaptive immune response). Vaccination is applied immunology: the vaccine is a rehearsal of the disease without the disease.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Immunisation",
        text: "The induction of active immunity by exposing the immune system to an antigen — a killed or attenuated organism, a purified component, or a toxoid — so that memory B and T cells can respond quickly on later exposure to the pathogen itself.",
      },
      {
        type: "table",
        headers: ["Class", "Mechanism", "Examples", "Key property"],
        rows: [
          ["Live attenuated", "A weakened organism replicates in the host without disease", "Measles, mumps and rubella vaccine; rotavirus; chickenpox; BCG", "Strong, durable immunity but contraindicated in severe immunosuppression and pregnancy"],
          ["Inactivated whole organism", "A killed organism that cannot replicate", "Inactivated polio vaccine; hepatitis A", "Needs several doses and adjuvants; cannot cause disease"],
          ["Subunit or conjugate", "A purified surface antigen, or an antigen conjugated to a carrier protein", "Acellular pertussis, pneumococcal conjugate, Haemophilus influenzae type b, meningococcal", "Safer, but the carrier conjugation is needed for a T-cell response in infants"],
          ["Toxoid", "An inactivated toxin that raises antibodies to the toxin rather than the bacterium", "Diphtheria and tetanus", "Protects against the disease caused by the toxin, not against colonisation"],
          ["mRNA", "A nucleic acid message encoding an antigen", "Certain newer vaccines", "Rapid to develop, non-infectious, and it degrades after translation"],
        ],
      },
      {
        type: "paragraph",
        text: "The clinical meaning of this classification is the cold chain, the schedule and the contraindications. Live vaccines replicate, so they are fragile (they must be kept cold and used soon after reconstitution), they take longer to produce an immune response, and they must not be given to a child with severe immunosuppression. Inactivated vaccines cannot cause the disease but require multiple doses and regular boosting, because there is no replication to keep the antigen present.",
      },
      {
        type: "paragraph",
        text: "Herd immunity is the other half of the argument: when a sufficient proportion of the population is immune, transmission cannot be sustained, so the disease cannot reach those who cannot be vaccinated — the newborn, the immunosuppressed, and the child who has had a genuine allergic reaction. Herd immunity is also the reason that a disease that has become rare is not thereby harmless: the moment coverage falls, the unvaccinated pool refills and the outbreak follows.",
      },

      { type: "heading", level: 2, text: "Worked example 1: the routine schedule" },
      {
        type: "table",
        headers: ["Age", "UK routine programme (illustrative)", "US routine programme (illustrative)"],
        rows: [
          ["Birth", "—", "Hepatitis B"],
          ["2 and 3 months", "6-in-1 (diphtheria, tetanus, acellular pertussis, polio, Hib, hepatitis B), rotavirus", "DTaP, IPV, Hib, pneumococcal conjugate, rotavirus"],
          ["4 months", "Third 6-in-1, third rotavirus, third meningococcal B", "DTaP, IPV, Hib, pneumococcal conjugate, rotavirus"],
          ["About 12 months", "Hib and meningococcal C, MMR, pneumococcal booster", "MMR, varicella, hepatitis A, Hib, pneumococcal"],
          ["About 3 years 4 months", "Pre-school booster (diphtheria, tetanus, pertussis and polio), second MMR", "Fourth DTaP, fourth IPV, second MMR, second varicella"],
          ["12 to 13 years", "HPV (two doses), adolescent tetanus and polio booster, meningococcal ACWY", "HPV, Tdap, meningococcal ACWY"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Both programmes are childhood-illness-prevention systems rather than lists of vaccinations: the same diseases are covered by different combinations at different ages, and every national schedule is chosen for the ages at which the disease is most dangerous and at which the immune response matures. Learn one schedule properly and understand the principles, rather than memorising both.",
      },
      {
        type: "paragraph",
        text: "Rotavirus has a strict window: the first dose must be given before 15 weeks of age and the course completed before 24 weeks, because there is a small, age-related risk of intussusception that rises with age at first dose. BCG is given at birth to infants in populations with a high tuberculosis incidence, and to unvaccinated older children and travellers on the basis of risk.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Premature infants are immunised at the same chronological age as term infants — they are not delayed — because they have the least of the protection that maternal antibodies and their own immature immunity provide. The same rule applies to infants with chronic disease, who are the very children in whom these infections are most dangerous.",
      },

      { type: "heading", level: 2, text: "Worked example 2: contraindications and false contraindications" },
      {
        type: "table",
        headers: ["True contraindication", "Explanation"],
        rows: [
          ["Confirmed anaphylaxis to a previous dose or to a component", "The one absolute contraindication that applies to every vaccine"],
          ["Live vaccines in severe immunosuppression", "For example after high-dose systemic steroids, in chemotherapy, in severe primary immunodeficiency, or in untreated HIV with severe immunosuppression"],
          ["Live vaccines in pregnancy", "A theoretical risk to the fetus"],
          ["Previous intussusception or an uncorrected gastrointestinal malformation", "Contraindication to the rotavirus vaccine"],
          ["Guillain-Barré syndrome within 6 weeks of a previous tetanus-containing vaccine", "A precaution for further tetanus-containing doses"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "None of the following is a contraindication: a minor illness without fever, a low-grade fever, a runny nose, current antibiotic treatment, prematurity, a stable neurological condition such as cerebral palsy or well-controlled epilepsy, a family history of an adverse event, or contact with an infectious disease. Postponing vaccination for a minor illness is the commonest way that a child is left unprotected.",
      },
      {
        type: "paragraph",
        text: "A child receiving chemotherapy or a bone-marrow transplant, or with a congenital immunodeficiency, is protected by an altered schedule rather than by omission: live vaccines are withheld during and after immunosuppression, and an accelerated or additional schedule is used for the inactivated vaccines, because the response wanes with the loss of lymphocytes. Passive immunisation is the bridge — immunoglobulin gives immediate but short-lived protection, for example varicella-zoster immunoglobulin to a susceptible pregnant contact or a neonate exposed to varicella.",
      },
      {
        type: "table",
        headers: ["Situation", "Action"],
        rows: [
          ["Dose missed", "Continue the schedule where it stopped — the course is resumed, not restarted"],
          ["Dose given early, outside the minimum interval", "Count the dose as valid and continue"],
          ["Live vaccines required together", "Give them on the same day in different sites, or separate by at least four weeks"],
          ["Live vaccine required after an immunoglobulin", "Delay, because immunoglobulin neutralises the live vaccine"],
          ["A child with no records", "Treat as unimmunised and restart the primary course"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Turning a child away for a minor cold. The cost of a postponed vaccine is a second appointment that may never happen, and the risk of vaccinating a well child with a cold is essentially nil.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Giving BCG or MMR to a child who has had a bone-marrow transplant or is on high-dose systemic steroids. Live vaccines in severe immunosuppression cause disseminated disease and must be deferred and discussed with an immunologist.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Reporting 'my child had a fever after the vaccine' as a contraindication. Local redness, soreness, a low fever and a day of being unsettled are the expected immune response, not allergy; anaphylaxis is immediate, generalised, and needs adrenaline.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What distinguishes a live-attenuated vaccine from an inactivated one, and what follows from it?",
        answer: "A live vaccine contains a weakened organism that replicates and produces a strong, durable immune response, but needs careful cold-chain storage and must not be given in severe immunosuppression or pregnancy. An inactivated vaccine cannot replicate, needs several doses and adjuvants, but can be given safely.",
        explanation: "The classification determines both the schedule and the contraindication list.",
      },
      {
        type: "question",
        prompt: "List three conditions that are NOT contraindications to vaccination.",
        answer: "A minor illness without fever, a low-grade fever, a runny nose, current antibiotic treatment, prematurity, or a stable neurological condition such as cerebral palsy or well-controlled epilepsy.",
        explanation: "Only anaphylaxis to a previous dose or a component, and the specific precautions for live vaccines and pregnancy, are true contraindications.",
      },
      {
        type: "question",
        prompt: "What is herd immunity and who does it protect?",
        answer: "Herd immunity is the protection of the population when a sufficient proportion is immune that transmission cannot be sustained; it protects those who cannot be vaccinated — the newborn, the immunosuppressed and the child who has had a confirmed reaction.",
        explanation: "The threshold is disease-specific, and falling below it produces outbreaks in the unvaccinated pool.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which of the following is an absolute contraindication to routine childhood vaccination?",
        options: [
          "A runny nose",
          "A confirmed anaphylactic reaction to a previous dose of the same vaccine",
          "A child with cerebral palsy on antiepileptic drugs",
          "A low-grade fever of 37.7°C",
        ],
        correctIndex: 1,
        explanation: "Anaphylaxis to a previous dose or to a component is the one absolute contraindication; minor illness, stable neurological disease and low-grade fever are not.",
      },
      {
        type: "mcq",
        stem: "A child on high-dose systemic steroids for nephrotic syndrome is due for a measles, mumps and rubella vaccine. What should happen?",
        options: [
          "Give it on schedule",
          "Withhold the live vaccine and refer for an individualised schedule, because severe immunosuppression contraindicates live vaccines",
          "Give half a dose",
          "Give immunoglobulin instead and carry on",
        ],
        correctIndex: 1,
        explanation: "Severe immunosuppression from high-dose steroids is a contraindication to live vaccines; the child needs a planned schedule agreed with an immunologist.",
      },
      {
        type: "mcq",
        stem: "A child missed the third dose of its primary course at 4 months and is now 7 months old. What is the correct action?",
        options: [
          "Restart the primary course from the beginning",
          "Resume the schedule where it left off — the course is continued, not restarted",
          "Wait for the pre-school booster to cover the gap",
          "Give the remaining doses at double the interval",
        ],
        correctIndex: 1,
        explanation: "Interrupted schedules are simply resumed; a missed dose is never a reason to restart, and the child is protected progressively.",
      },
      {
        type: "mcq",
        stem: "Why must the rotavirus course be completed by 24 weeks of age?",
        options: [
          "Because the vaccine does not work after that age",
          "Because the risk of intussusception rises with the age at the first dose",
          "Because the maternal antibodies interfere after 24 weeks",
          "Because the gut has closed by then",
        ],
        correctIndex: 1,
        explanation: "There is a small, age-related excess risk of intussusception, so the first dose is given before 15 weeks and the course completed by 24 weeks.",
      },
      {
        type: "mcq",
        stem: "Which statement about premature infants and immunisation is correct?",
        options: [
          "They are immunised two months after their due date",
          "They are immunised at the same chronological age as term infants, because they are the most vulnerable to these infections",
          "They should not be immunised until 6 months",
          "They need only the inactivated vaccines, never a live one",
        ],
        correctIndex: 1,
        explanation: "Premature infants follow the same schedule at chronological age; they have the least protection and the greatest risk from the diseases.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Vaccination rehearses an infection so that memory B and T cells can respond when the pathogen actually arrives; live-attenuated vaccines are durable but fragile and contraindicated in severe immunosuppression and pregnancy, while inactivated, subunit and toxoid vaccines are safe but need several doses. Schedules are built around the ages at which each disease is most dangerous, are interrupted and resumed rather than restarted, and are given to premature infants at their chronological age. The only absolute contraindication is anaphylaxis to a previous dose — a cold, a low fever, or cerebral palsy are not.",
      },
      {
        type: "paragraph",
        text: "Next: the febrile child — the commonest presentation in paediatrics and the one where a correct assessment prevents a death.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 5 — The febrile child & serious infection (fully authored)
// ---------------------------------------------------------------------------
function lesson5() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: state what temperature is measured and how; recognise a seriously ill child on the initial assessment; apply a traffic-light framework for the under-fives; name the red features of meningococcal septicaemia and meningitis; describe the features and the management of a febrile convulsion; list the common viral exanthems with their distinguishing features; and apply the principles of antibiotic stewardship to childhood fever.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-4, MED 301 module 1 and PATH 201 module 1. Fever is the inflammatory and immune response of the previous courses, and the recognition of sepsis is a clinical skill.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "paragraph",
        text: "Fever is a symptom, not a diagnosis, and in the great majority of febrile children the cause is a self-limiting virus. The task in assessing a febrile child is therefore not to find the cause but to find the child: to decide, in the first minutes, whether this child is well and febrile, or whether the child is in early shock. That decision is made on respiratory rate, heart rate, capillary refill, peripheral temperature and colour, mental status and activity, skin turgor, and whether the child looks at you, follows you and engages with you.",
      },
      {
        type: "definition",
        term: "Febrile convulsion",
        text: "A generalised seizure in a child of 6 months to 6 years, occurring with a fever, in a child without a central nervous system infection or a defined epilepsy. A simple febrile convulsion lasts under 15 minutes, is generalised, does not recur within 24 hours, and is followed by a full recovery.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "A non-blanching petechial rash in a febrile child is meningococcal septicaemia until proven otherwise. Management begins before the diagnosis: parenteral benzylpenicillin or ceftriaxone in the community, intravenous fluids, and an immediate transfer to hospital, with no time spent waiting for a rash to spread or for a blood result.",
      },

      { type: "heading", level: 2, text: "Worked example 1: assessing the febrile child" },
      {
        type: "table",
        headers: ["Domain", "Green — low risk", "Amber — intermediate risk", "Red — high risk"],
        rows: [
          ["Colour", "Normal colour of face, lips and tongue", "Pallor, or reported colour change by a parent", "Pale, mottled, ashen or blue"],
          ["Activity", "Responds normally to social cues, smiles, reaches for objects", "Not responding normally, reduced activity, wakes only with prolonged stimulation", "Does not respond, appears ill to the healthcare worker, weak or continuous cry"],
          ["Respiratory", "Normal rate and effort, no recession", "Tachypnoea, nasal flaring, recession, grunting", "Apnoea, grunting, severe recession, oxygen saturation below a threshold"],
          ["Circulation and hydration", "Normal skin and eyes, moist mucous membranes", "Tachycardia, dry mucous membranes, reduced skin turgor, reduced urine output", "Capillary refill over 2 seconds, reduced or absent urine output, non-blanching rash, hypotension"],
          ["Other", "None of the amber or red features", "Fever lasting 5 days or longer, rigors, limb swelling or non-weight-bearing, parental concern", "Neck stiffness, bulging fontanelle, focal neurological signs, status epilepticus, focal seizures"],
        ],
      },
      {
        type: "paragraph",
        text: "The traffic light is a triage of the child, not of the temperature: a child with a temperature of 39°C who is pink, playing and drinking is at low risk, whereas a child of 38.3°C who is mottled, drowsy and has a capillary refill of 3 seconds is a resuscitation. Temperatures below 38°C in an infant under 3 months of age can still be serious, because a young infant mounts a poor febrile response — a temperature below 36.5°C (hypothermia) in a neonate is as worrying as a fever.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Fever is managed for comfort rather than for the number: antipyretics (paracetamol or ibuprofen) are given if the child is distressed, not routinely to normalise the temperature. Tepid sponging is no longer advised; over-wrapping and sponge baths cause shivering and raise the core temperature. Neither antipyretic prevents febrile convulsions.",
      },

      { type: "heading", level: 2, text: "Worked example 2: meningitis and septicaemia" },
      {
        type: "table",
        headers: ["Disease", "Molecular event", "Clinical features"],
        rows: [
          ["Meningococcal septicaemia", "Gram-negative diplococci in the bloodstream, endotoxin shock, purpura fulminans", "Fever, malaise, limb pain, rapid progression to mottling and a non-blanching petechial rash, cold peripheries, prolonged capillary refill, drowsiness, collapse"],
          ["Bacterial meningitis", "Bacterial infection of the meninges, raised intracranial pressure", "Fever, headache, photophobia, neck stiffness, Kernig and Brudzinski signs in the older child; irritability, high-pitched cry, vomiting, bulging fontanelle and apnoea in the infant"],
          ["Viral (aseptic) meningitis", "Non-pyogenic infection of the meninges, usually enteroviral", "Milder illness, headache, photophobia, no systemic toxicity, no purpura"],
          ["Encephalitis", "Infection of the brain parenchyma", "Altered consciousness, seizures, focal neurological signs, behavioural change"],
        ],
      },
      {
        type: "paragraph",
        text: "The younger the child, the less reliable the meningeal signs: an infant under 18 months rarely has neck stiffness, and bulging of the anterior fontanelle, a high-pitched cry, and irritability that cannot be settled are the signs to palpate and listen for. A lumbar puncture is deferred only where there are specific dangers — signs of raised intracranial pressure, focal neurology, cardiovascular instability, coagulopathy or infection at the puncture site — and antibiotics are given first.",
      },

      { type: "heading", level: 2, text: "Worked example 3: the common exanthems" },
      {
        type: "table",
        headers: ["Illness", "Agent", "Distinguishing features"],
        rows: [
          ["Roseola infantum (exanthem subitum)", "Human herpesvirus 6", "Three to five days of high fever in a well child, then the fever settles and a maculopapular rash appears as the fever leaves — a well child with a fever and a rash"],
          ["Chickenpox", "Varicella-zoster virus", "Crops of vesicles in successive stages with clear fluid, intensely itchy, appearing in crops on the trunk and the face"],
          ["Measles", "Measles virus", "Prodrome of cough, coryza, conjunctivitis and Koplik spots, then a maculopapular rash spreading from the head down, with high fever"],
          ["Rubella (German measles)", "Rubella virus", "Low-grade fever, tender occipital and post-auricular lymphadenopathy, and a rash that spreads in about three days"],
          ["Scarlet fever", "Group A streptococcus", "Sandpaper rash, circumoral pallor, strawberry tongue, Pastia lines, treated with penicillin"],
          ["Slapped cheek (fifth disease)", "Parvovirus B19", "Erythema of the cheeks, then a reticular rash on the limbs — important in pregnancy and in haemolysis"],
          ["Hand, foot and mouth disease", "Coxsackievirus", "Vesicles on the hands, the feet and in the mouth, with a mild systemic illness"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Prescribing an antibiotic for every febrile child. Most childhood fever is viral and resolves without antibiotics; the diagnoses that do need them are specific — otitis media with an inflamed bulging drum, pneumonia, urinary tract infection, tonsillitis with a Centor score, and meningitis or sepsis.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Not counting the respiratory rate yourself. The respiratory rate is the most sensitive and most frequently neglected vital sign in a child, and it must be counted for a full minute in an undressed, settled child.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Labelling a febrile convulsion as epilepsy. Febrile convulsions are an age-limited, fever-triggered phenomenon with a low recurrence risk and a very low subsequent epilepsy risk, and they must never be treated with antiepileptic drugs.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Missing the diagnosis behind a febrile infant under 3 months. Any febrile infant of this age needs a full septic screen and parenteral antibiotics, and hypothermia in a neonate is as much a red flag as a fever.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What are the red features of meningococcal septicaemia?",
        answer: "A non-blanching petechial or purpuric rash, mottled or ashen skin, cold peripheries, capillary refill over two seconds, rapid progression with limb pain, rigors, and drowsiness or altered mental status. Management starts immediately with parenteral antibiotics.",
        explanation: "This is the one presentation in paediatrics in which the physician is expected to act before the diagnosis is confirmed.",
      },
      {
        type: "question",
        prompt: "Define a simple febrile convulsion and state what it is not.",
        answer: "A generalised seizure lasting under 15 minutes in a child of 6 months to 6 years, with fever, not recurring within 24 hours, followed by full recovery. A focal, prolonged or repeated seizure, or an incomplete recovery, is a complex febrile seizure and requires investigation for meningitis and other causes.",
        explanation: "The distinction determines whether a child is investigated and admitted or discharged with advice.",
      },
      {
        type: "question",
        prompt: "Why is a temperature below 38°C not reassuring in a neonate?",
        answer: "Because young infants mount a poor febrile response, and hypothermia or a normal temperature may accompany serious bacterial infection; the assessment must rely on the clinical state, the respiratory rate, feeding and tone.",
        explanation: "A well-appearing, feeding, normally-toned infant is assessed differently from one who is lethargic, mottled and feeding poorly.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A 3-year-old has a fever of 39°C and a purple, non-blanching rash on the trunk. What is the immediate action?",
        options: [
          "Give oral antibiotics and review in the morning",
          "Give parenteral benzylpenicillin or ceftriaxone and transfer urgently to hospital",
          "Reassure, because the rash will fade",
          "Apply a cool compress and wait for the rash to spread",
        ],
        correctIndex: 1,
        explanation: "A non-blanching petechial rash with fever is meningococcal septicaemia until proven otherwise, and parenteral antibiotics are given before transfer.",
      },
      {
        type: "mcq",
        stem: "A 20-month-old has a generalised tonic-clonic seizure of 10 minutes with a fever, and is alert and playing an hour later. What is the correct management?",
        options: [
          "Admit for parenteral antibiotics and imaging",
          "Investigate for a central nervous system infection if the seizure was prolonged, focal or repeated, and otherwise manage as a simple febrile convulsion with parental advice and safety-netting",
          "Start an antiepileptic drug",
          "Perform a lumbar puncture in every case regardless of recovery",
        ],
        correctIndex: 1,
        explanation: "This is a simple febrile convulsion; only complex features or clinical uncertainty justify the invasive and the antimicrobial pathway.",
      },
      {
        type: "mcq",
        stem: "Which feature most reliably identifies a seriously ill febrile child rather than a self-limiting viral illness?",
        options: [
          "A temperature of 39.5°C",
          "A capillary refill time of over 2 seconds with mottled skin and reduced response to social cues",
          "A crouching, irritable child with coryza",
          "A parent who is anxious about the fever",
        ],
        correctIndex: 1,
        explanation: "Perfusion, colour and level of response are the signs of systemic illness; the height of the temperature is not.",
      },
      {
        type: "mcq",
        stem: "An 11-month-old has had five days of high fever but has been playing and feeding normally, and today the fever has settled and a maculopapular rash has appeared. What is the most likely diagnosis?",
        options: [
          "Measles",
          "Roseola infantum (human herpesvirus 6)",
          "Scarlet fever",
          "Rubella",
        ],
        correctIndex: 1,
        explanation: "Several days of high fever in a well infant, with the rash appearing as the fever settles, is the classic picture of roseola.",
      },
      {
        type: "mcq",
        stem: "In an infant under 18 months with meningitis, which sign is most likely to be present?",
        options: [
          "Neck stiffness with a positive Kernig sign",
          "A bulging anterior fontanelle with irritability and a high-pitched cry",
          "Photophobia",
          "Brudzinski's sign",
        ],
        correctIndex: 1,
        explanation: "Meningeal signs are unreliable under 18 months; a bulging fontanelle, a high-pitched cry and inconsolable irritability are the signs to look for.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The assessment of a febrile child is the assessment of the child and not of the number: colour, activity, respiratory rate, circulation and hydration, and the presence of red features decide whether the child is seriously ill, and a traffic-light framework for the under-fives makes that decision explicit and repeatable. Meningococcal septicaemia with a non-blanching rash requires antibiotics before the diagnosis; a simple febrile convulsion requires reassurance and not an antiepileptic; and the commonest exanthems are all distinguishable by the timing of the rash and the systemic state. Antibiotics are for the specific diagnoses — otitis media, pneumonia, urinary tract infection, sepsis — and not for fever.",
      },
      {
        type: "paragraph",
        text: "Next: development in its narrow sense — the child who is not developing as expected, the disorders of development and behaviour, and the duty to safeguard.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 6 — Development, behaviour, neurodisability & safeguarding
// (fully authored)
// ---------------------------------------------------------------------------
function lesson6() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define cerebral palsy and name its types and risk factors; state the diagnostic criteria for autism spectrum disorder and for attention deficit hyperactivity disorder; distinguish developmental delay from regression and name the causes of each; define safeguarding and name the injuries and patterns that raise the suspicion of abuse; describe what to do when a child presents with a suspicious injury, and the consent rules for children and young people.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 and lesson 5. Both are applications of the growth and fever assessments to the two duties that cannot be delegated: recognising the child who is not developing, and protecting the child who is being harmed.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Cerebral palsy",
        text: "A group of permanent, non-progressive disorders of movement and of posture caused by an injury to the developing brain before, during or shortly after birth. The lesion is fixed; the clinical picture evolves as the child grows, and the motor disorder may be accompanied by epilepsy, visual, hearing, speech, feeding and intellectual impairment.",
      },
      {
        type: "paragraph",
        text: "Cerebral palsy is a description, not a diagnosis of timing: the commonest type is spastic diplegia after premature birth (periventricular leukomalacia of the white matter around the ventricles), spastic hemiplegia after a middle cerebral artery infarction in a term infant, and dyskinetic types after acute profound hypoxia-ischaemia. Management is functional — physiotherapy, orthoses, selective dorsal rhizotomy or botulinum toxin for spasticity, and orthopaedic surgery for the contractures that develop — and intelligence is often normal, which is the trap of a low expectation.",
      },
      {
        type: "paragraph",
        text: "Regression is the single most important distinction in developmental paediatrics. A child who is late in acquiring a skill is delayed; a child who has lost an acquired skill is regressing, and regression is a neurological emergency with a different and shorter differential — it suggests a neurodegenerative or metabolic disease, a seizure disorder such as Landau-Kleffner syndrome or an epileptic encephalopathy, hearing loss, or autism with language loss, and it must be investigated rather than observed.",
      },

      { type: "heading", level: 2, text: "Worked example 1: autism spectrum disorder" },
      {
        type: "table",
        headers: ["Domain", "What is impaired", "What to ask and observe"],
        rows: [
          ["Social communication and social interaction", "Reciprocal conversation, eye contact, shared enjoyment and interest, and the ability to read another person's mental state", "Does the child point to share interest (not just to request)? Does it show you a toy? Does it respond to its name?"],
          ["Restricted and repetitive patterns", "Stereotyped movements, insistence on sameness, intensely restricted interests, and abnormal sensory responses to sound, texture or light", "Lining up toys, hand-flicking, distress at a change of routine, covering the ears at everyday sounds"],
          ["Onset", "Present in the early developmental period, even if the diagnosis is made later when demands exceed capacity", "Look at the early history — the 2-year health record, the nursery report, and the family's account of the first words"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Autism spectrum disorder is diagnosed by history and observation against criteria, not by a scan, a blood test or a single instrument. A hearing test is done first, because deafness mimics the language delay, and an EEG and imaging are reserved for the child with a regression, seizures or an asymmetric or progressive sign.",
      },
      {
        type: "paragraph",
        text: "Attention deficit hyperactivity disorder is the other common neurodevelopmental condition: a persistent pattern of inattention and/or hyperactivity and impulsivity that is present before the age of 12 years, in two or more settings, and that impairs function. Management is behavioural first — parenting programmes, school support, and a structured environment — with stimulant medication for the child whose functioning remains impaired. It is not caused by bad parenting, and it is not a synonym for a lively child.",
      },

      { type: "heading", level: 2, text: "Worked example 2: safeguarding" },
      {
        type: "definition",
        term: "Safeguarding",
        text: "The action taken to protect a child from abuse or neglect, which includes physical, emotional and sexual abuse and neglect. The duty is on every clinician who sees the child, and it is discharged by recording, reporting to the safeguarding lead and referring to children's social care — never by a single clinician carrying the concern alone.",
      },
      {
        type: "table",
        headers: ["Red flag", "Why it matters"],
        rows: [
          ["Bruises in a non-mobile infant, or in a pattern or shape of an object", "Any bruise on a child who is not yet mobile is unexplained until examined; a bruise of the shape of a hand, belt or cord is an implement"],
          ["Injuries at sites unusual for the age (ears, neck, torso, buttocks, frenulum)", "Accidental bruises in a mobile child are on the shins, knees and the bony prominences, not on the ears, the neck or the frenulum"],
          ["A history that changes, is vague, is inconsistent with the injury or with the developmental stage, or a delay in seeking help", "The reliability of the history is assessed, not taken for granted"],
          ["Metaphyseal corner fractures, posterior rib fractures, subdural haemorrhage, retinal haemorrhages", "Highly specific injury patterns for inflicted injury in infancy"],
          ["Failure to thrive, poor hygiene, or a child who is constantly hungry", "Neglect is the commonest form of maltreatment and the deadliest, and it is a safeguarding and not just a nutritional diagnosis"],
          ["Fabricated or induced illness", "A child presented repeatedly with symptoms that are produced or reported by the carer, with the child harmed by the investigations and the treatment"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The threshold for referral is a concern, not proof. A clinician who waits for certainty before referring leaves a child at risk; the safeguarding structure exists precisely so that the assessment is not done by one person in one clinic room. Document the history in the child's and carer's own words, the examination findings, and the reasoning.",
      },

      { type: "heading", level: 2, text: "Worked example 3: consent and confidentiality" },
      {
        type: "table",
        headers: ["Age", "Consent position", "Practical consequence"],
        rows: [
          ["A child judged Gillick competent", "May consent to treatment independently if they understand the nature, purpose, risks and alternatives", "Competence is task-specific, and the younger the child the higher the burden of showing it"],
          ["A child refusing life-saving treatment", "May be overridden by a parent or by a court", "The child's refusal is documented, and refusal of an emergency is met by the emergency provisions"],
          ["16 and 17 years", "Treated as an adult for the purposes of consent in most jurisdictions", "Consent should still be sought with the family where the young person agrees"],
          ["Any child", "Confidentiality is respected but is not absolute where there is a risk to the child or to others", "The limits of confidentiality are explained at the start of the consultation"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Expecting little of a child with cerebral palsy. The motor disorder is fixed and non-progressive; intellectual ability is often normal, and the assumption of impairment is the commonest harm done to these children.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Waiting for a child to 'catch up' after a regression. Loss of a skill is a red flag with a defined differential, and it is investigated rather than observed.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Recording a history as 'the mother says' without quoting it. The exact words, the sequence and the delay are the evidence, and paraphrasing them loses them.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing a delay with a disorder: children develop unevenly, a single delayed milestone may be a variant, and the diagnosis belongs to a pattern across domains acquired over time.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What is the difference between developmental delay and regression, and why does the difference matter?",
        answer: "Delay is the late acquisition of a skill; regression is the loss of a skill that had been acquired. Regression is a red flag for a neurodegenerative, metabolic, epileptic or auditory cause and requires investigation; delay is assessed for a pattern and for risk factors before investigation.",
        explanation: "The distinction changes the urgency and the differential diagnosis completely.",
      },
      {
        type: "question",
        prompt: "Which clinical features are highly specific for inflicted injury in infancy?",
        answer: "Metaphyseal corner fractures, posterior rib fractures, subdural haemorrhage, retinal haemorrhages, and bruising in a non-mobile infant or in the shape of an implement.",
        explanation: "These patterns, with an inconsistent history, prompt immediate safeguarding referral and a skeletal survey.",
      },
      {
        type: "question",
        prompt: "What is the consent position for a child under 16 who asks for confidential medical care?",
        answer: "If the child is Gillick competent — understands the nature, purpose, risks and alternatives of the treatment — they may consent independently, and confidentiality applies but is not absolute where there is a risk to the child or to others, which must be explained.",
        explanation: "Competence is task-specific, and the discussion must be documented with the child's own words.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which of the following is the definition of cerebral palsy?",
        options: [
          "A progressive degeneration of motor neurons presenting in adolescence",
          "A permanent, non-progressive disorder of movement and posture caused by injury to the developing brain",
          "A seizure disorder of infancy",
          "A learning disability with motor signs",
        ],
        correctIndex: 1,
        explanation: "Cerebral palsy is by definition non-progressive, because the lesion is fixed even though the clinical evolution continues as the child grows.",
      },
      {
        type: "mcq",
        stem: "A 2-year-old has lost the 20 words that it had at 18 months and no longer responds to its name. What is the first priority?",
        options: [
          "Arrange a speech therapy appointment",
          "Perform a formal hearing test and a developmental assessment, because regression is a neurological red flag",
          "Reassure the parents that some children regress",
          "Order an electroencephalogram without any history",
        ],
        correctIndex: 1,
        explanation: "Regression demands a hearing assessment and a developmental and neurological evaluation; hearing loss mimics language regression and is treatable.",
      },
      {
        type: "mcq",
        stem: "Which injury is most specific for inflicted injury in an infant?",
        options: [
          "A bruise on the forehead from a fall",
          "A metaphyseal corner fracture of the distal femur",
          "A cut on the chin",
          "A grazed knee",
        ],
        correctIndex: 1,
        explanation: "Metaphyseal corner fractures are a highly specific pattern for non-accidental injury, as are posterior rib fractures and subdural haemorrhage.",
      },
      {
        type: "mcq",
        stem: "A 4-month-old infant is brought in with two bruises behind the ears. The infant cannot roll. What is the correct action?",
        options: [
          "Advise the parents that bruising is normal in infants",
          "Document the history and examination verbatim, consult the safeguarding lead and refer to children's social care, with a skeletal survey as advised",
          "Repeat the blood count and review in a week",
          "Discharge with a police caution",
        ],
        correctIndex: 1,
        explanation: "Bruising in a non-mobile infant is unexplained, and the response is to record, refer to the safeguarding lead and involve social care — never to carry the concern alone.",
      },
      {
        type: "mcq",
        stem: "Which statement about attention deficit hyperactivity disorder is correct?",
        options: [
          "It is diagnosed by a brain scan",
          "It requires onset before 12 years, symptoms in two or more settings, and impairment of function, and it is managed behaviourally first",
          "It is diagnosed only after the age of 12",
          "It is treated with an antipsychotic as first-line therapy",
        ],
        correctIndex: 1,
        explanation: "The diagnosis is clinical against criteria of onset, pervasiveness and impairment; behavioural intervention comes first, with stimulant medication when function remains impaired.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Cerebral palsy is a fixed motor disorder of the developing brain whose motor impairment is often accompanied by preserved intelligence; autism spectrum disorder is diagnosed against criteria of social communication and restricted behaviour, by history and observation; and attention deficit hyperactivity disorder is a clinical diagnosis of onset, pervasiveness and impairment. Regression is the red flag that separates observation from investigation, and the injuries that are specific for inflicted injury — metaphyseal corner fractures, posterior rib fractures, subdural haemorrhage, retinal haemorrhages — trigger a safeguarding referral that is the responsibility of the clinician who sees the child.",
      },
      {
        type: "paragraph",
        text: "Next: the wider degree — neonatal medicine, respiratory and cardiac disease, renal, endocrine, haematology and oncology, neurology, infectious disease and adolescent health — all of which apply these principles to organ systems.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 7 — Dehydration & fluid management (fully authored)
// ---------------------------------------------------------------------------
function lesson7() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: assess dehydration clinically and grade its severity in an infant and in a child; state the composition of oral rehydration solution and explain why glucose must be present for sodium and water to be absorbed; calculate a deficit, a maintenance prescription and the replacement of ongoing losses; choose between oral, nasogastric and intravenous rehydration; correct hypernatraemic and hyponatraemic dehydration safely; and prescribe fluid for a child before and after surgery.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 3, lesson 5 and PHYS 101 module 1 — the water compartments, the electrolytes and the Starling forces. A child's fluid prescription is the adult physiology of those lessons applied to a body that is 70 to 75 per cent water, with an immature kidney and no reserve.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "paragraph",
        text: "Water is the medium of every reaction in the body, and the child has proportionally more of it than the adult: a term newborn is about 75 per cent water by weight, against about 60 per cent at one year and 50 to 60 per cent in an adult. The infant's kidney also cannot concentrate urine well, so its obligatory water loss is higher, and its insensible loss is higher because its surface area is large relative to its mass. Together these make the infant the patient who dehydrates fastest and the patient in whom a fluid error does the most harm.",
      },
      {
        type: "definition",
        term: "Maintenance fluid",
        text: "The volume that replaces the normal daily losses of water and electrolytes from the skin, the lungs, the urine and the stool in a child who is not eating or drinking. It is calculated by the Holliday-Segar 4-2-1 rule: 4 mL/kg/hour for the first 10 kg, 2 mL/kg/hour for the next 10 kg, and 1 mL/kg/hour for each kilogram above 20 kg — which is 100 mL of water per 100 kcal metabolised.",
      },
      {
        type: "definition",
        term: "Deficit",
        text: "The volume of water and electrolyte that has already been lost. A 5 per cent deficit is 50 mL/kg and a 10 per cent deficit is 100 mL/kg. The most accurate measure of a deficit is the difference between the child's weight now and its weight before the illness, because the clinical signs alone misclassify about a third of children.",
      },
      {
        type: "definition",
        term: "Ongoing losses",
        text: "The fluid that continues to be lost while the child is being rehydrated — watery stool, vomit, nasogastric aspirate, burns — replaced millilitre for millilitre in addition to maintenance and deficit. This is why a child with gastroenteritis needs a fluid prescription that is larger than the textbook arithmetic suggests.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Total body water is about 80 per cent of a 24-week preterm infant, 75 per cent of a term newborn, 60 per cent of a one-year-old and 50 to 60 per cent of an adult. The proportion falls because the fat content rises, and the fat is what insulates a patient from the consequences of a fluid loss.",
      },

      { type: "heading", level: 2, text: "Worked example 1: how dehydration is actually assessed" },
      {
        type: "paragraph",
        text: "The clinical signs are the first assessment and they are the assessment available in any clinic. The skill is to grade the signs rather than to count them, and to grade the child's perfusion and mental state above all.",
      },
      {
        type: "table",
        headers: ["Feature", "Mild (under 5 per cent)", "Moderate (5 to 10 per cent)", "Severe (over 10 per cent)"],
        rows: [
          ["Weight lost", "Under 5 per cent of body weight", "5 to 10 per cent", "More than 10 per cent"],
          ["Mouth and eyes", "Slightly dry mucous membranes", "Dry mucous membranes, sunken eyes, absent tears", "Very dry mucous membranes, deeply sunken eyes"],
          ["Skin", "Normal turgor", "Reduced skin turgor, cold peripheries", "Mottled, cold, prolonged capillary refill"],
          ["Circulation", "Normal heart rate and perfusion", "Tachycardia, weak pulses", "Tachycardia then bradycardia, hypotension — a late sign"],
          ["Urine", "Normal", "Reduced and dark", "Absent for hours"],
          ["Mental state", "Alert, active, playing", "Irritable or lethargic but rousable", "Lethargic, hypotonic, unresponsive"],
        ],
      },
      {
        type: "paragraph",
        text: "The signs follow the physiology: sodium and water loss contracts the extracellular fluid first, so the tachycardia precedes the sunken eyes, and the intracellular and interstitial water follows, so a severely dehydrated child is a child with a low circulating volume before it is a child with dry skin. Hypernatraemic dehydration is the exception to be alert for — the osmolar shift preserves the plasma volume and the skin feels doughy rather than loose, so a profoundly hypernatraemic child can look deceptively well until it collapses.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "A single clinical assessment misclassifies the degree of dehydration in about a third of children, and the error is always towards underestimation. The most useful number in the whole assessment is the child's weight against its weight before the illness: a 10 kg child who now weighs 9 kg has lost 10 per cent of body water and needs a deficit of 100 mL/kg.",
      },

      { type: "heading", level: 2, text: "Worked example 2: oral rehydration solution" },
      {
        type: "definition",
        term: "Oral rehydration solution",
        text: "A solution of glucose and sodium in water in a fixed ratio, absorbed by the sodium-glucose cotransporter SGLT1 in the small intestine. Glucose carries sodium and water into the enterocyte even when the epithelium is damaged, which is why ORS works in cholera and in viral gastroenteritis, when neither water nor electrolyte is being absorbed by itself.",
      },
      {
        type: "table",
        headers: ["Solute", "Low-osmolarity ORS", "Conventional ORS", "For comparison — serum"],
        rows: [
          ["Sodium", "75 mmol/L", "90 mmol/L", "140 mmol/L"],
          ["Chloride", "65 mmol/L", "80 mmol/L", "100 mmol/L"],
          ["Potassium", "20 mmol/L", "20 mmol/L", "4.5 mmol/L"],
          ["Citrate", "10 mmol/L", "10 mmol/L", "—"],
          ["Glucose", "75 mmol/L", "111 mmol/L", "5 mmol/L"],
          ["Osmolarity", "245 mOsm/L", "311 mOsm/L", "about 285 to 295 mOsm/L"],
        ],
      },
      {
        type: "paragraph",
        text: "The low-osmolarity formulation reduced stool output, vomiting and the need for intravenous fluid in randomised trials, and it is the standard. The concentrations are fixed: the solution is not to be diluted or strengthened, and adding sugar to it increases the osmolarity and pulls water into the lumen, worsening the diarrhoea.",
      },
      {
        type: "paragraph",
        text: "Oral rehydration is given by teaspoon or by syringe — about 5 mL every minute or two — so that a vomiting child still absorbs more than it loses. Moderate dehydration is rehydrated orally with 75 mL/kg over four hours, with the deficit subtracted and the normal feeds and maintenance continued; a child too ill to drink is rehydrated through a nasogastric tube with the same solution; and intravenous fluid is reserved for shock, for an ileus or suspected peritonitis, or for failure of the other two routes.",
      },
      {
        type: "callout",
        variant: "info",
        text: "ORS works because glucose keeps sodium moving, and the corollary explains the failure of the commercial alternative. A sugary soft drink contains a great deal of sugar and almost no sodium: it raises the luminal osmolality, draws water into the gut, and worsens the diarrhoea. It must never be substituted for ORS.",
      },

      { type: "heading", level: 2, text: "Worked example 3: the intravenous fluid, and the sodium" },
      {
        type: "paragraph",
        text: "A child with shock receives an isotonic bolus of 10 to 20 mL/kg of 0.9 per cent saline or Hartmann's solution, and is reassessed between boluses. The remaining deficit is given over 24 to 48 hours as a glucose-containing isotonic solution. Hypotonic fluid is no longer used for maintenance in children, because of the excess of hospital-acquired hyponatraemia and the severe neurological injury that followed the historical use of 0.18 per cent saline.",
      },
      {
        type: "table",
        headers: ["Prescription", "Rule", "Worked example — a 15 kg child"],
        rows: [
          ["Maintenance", "4 mL/kg/h for the first 10 kg, then 2 mL/kg/h", "40 + 20 = 60 mL/hour"],
          ["Deficit of 5 per cent", "50 mL/kg, replaced over 24 to 48 hours", "750 mL, in addition to maintenance"],
          ["Ongoing losses", "Replaced mL for mL, 10 mL/kg per watery stool or vomit", "Added to the hourly rate"],
          ["Resuscitation bolus", "10 to 20 mL/kg isotonic crystalloid, then reassess", "150 to 300 mL, deducted from the deficit"],
        ],
      },
      {
        type: "paragraph",
        text: "Sodium is managed to a rate and not to a number. In hypernatraemic dehydration the serum sodium must fall no faster than about 10 to 12 mmol/L in 24 hours, because a rapid fall draws water into the cells and produces cerebral oedema; the deficit is therefore replaced over at least 48 hours and the sodium is checked every few hours. In hyponatraemic dehydration the sodium must rise no faster than about 8 mmol/L in 24 hours, and a child seizing from hyponatraemia needs 3 per cent saline at 4 mL/kg.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Fluid prescriptions are the commonest source of avoidable harm to children in hospital. Four checks before signing a paediatric fluid chart: is the child euvolaemic; is the fluid isotonic; is glucose included; and are the sodium and the urine output being monitored.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Prescribing a hypotonic fluid for maintenance in a child post-operatively. Non-osmotic secretion of antidiuretic hormone is common in any ill or post-operative child, and a hypotonic infusion produces hyponatraemia, which can cause seizures and brainstem injury. Isotonic, glucose-containing fluid is the default.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Relying on skin turgor and mucous membranes alone, and missing the shock. The signs of perfusion — capillary refill, peripheral temperature, colour and mental state — come before the signs of interstitial depletion, and hypotension is the last thing to happen, not the first.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Correcting a hypernatraemic child over 12 hours. Rapid correction of a chronic hypernatraemia causes cerebral oedema and seizures; the sodium should fall over at least 48 hours, at no more than about 0.5 mmol/L per hour.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting the glucose. A small child given saline and water alone for 12 hours will deplete its glycogen and become hypoglycaemic; every maintenance fluid for a young child should contain glucose, unless the child is significantly hyperglycaemic.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does oral rehydration solution contain glucose when the child is already losing glucose in the stool?",
        answer: "Because glucose opens the SGLT1 cotransporter in the intestinal epithelium, which drags sodium and therefore water across the mucosa. Without glucose the sodium and the water are not absorbed even in an intact gut; with glucose the mechanism continues to work in a gut damaged by a virus.",
        explanation: "This is the reason ORS treats cholera and rotavirus, and the reason a glucose-free or very sugary drink does not.",
      },
      {
        type: "question",
        prompt: "State the maintenance fluid prescription for a 24 kg child and show the arithmetic.",
        answer: "4 mL/kg/h for the first 10 kg is 40, 2 mL/kg/h for the next 10 kg is 20, and 1 mL/kg/h for the remaining 4 kg is 4, giving 64 mL/hour. This equals 100 mL per 100 kcal metabolised.",
        explanation: "The 4-2-1 rule and the Holliday-Segar calorie rule are the same statement in different units.",
      },
      {
        type: "question",
        prompt: "A child with gastroenteritis has a 10 per cent deficit. How much fluid is needed to replace it, and over what period?",
        answer: "A 10 per cent deficit is 100 mL/kg, so a 10 kg child needs about 1000 mL, given over 24 to 48 hours in addition to maintenance and to the ongoing losses from stool and vomit; any resuscitation bolus is deducted from the total.",
        explanation: "Replacing a deficit over 24 to 48 hours rather than over 6 hours is what prevents the osmotic injury of a rapid shift.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A 9 kg infant with gastroenteritis now weighs 8.2 kg and has dry mucous membranes with reduced skin turgor but a normal capillary refill and is alert. What is the deficit?",
        options: [
          "About 2 per cent, so no fluid replacement is needed",
          "About 9 per cent — roughly 90 mL/kg, given over 24 to 48 hours in addition to maintenance",
          "About 50 per cent, so the infant needs immediate exchange transfusion",
          "The weight is enough evidence that the infant is euvolaemic",
        ],
        correctIndex: 1,
        explanation: "0.8 kg lost from 9 kg is about 9 per cent, which is about 90 mL/kg of deficit; the child is not shocked, so the deficit is replaced slowly rather than with boluses.",
      },
      {
        type: "mcq",
        stem: "Which composition best describes low-osmolarity oral rehydration solution?",
        options: [
          "Sodium 75 mmol/L with glucose 75 mmol/L, osmolarity 245 mOsm/L",
          "Sodium 20 mmol/L with glucose 200 mmol/L, osmolarity 245 mOsm/L",
          "Pure glucose 50 mmol/L in water, with no sodium at all",
          "Sodium 140 mmol/L with glucose 5 mmol/L, matching plasma exactly",
        ],
        correctIndex: 0,
        explanation: "The low-osmolarity ORS has sodium 75 and glucose 75 mmol/L with an osmolarity of 245 mOsm/L; the glucose concentration is matched to the sodium to keep the cotransport working.",
      },
      {
        type: "mcq",
        stem: "A 7 kg infant is in shock from gastroenteritis. What is the first fluid step?",
        options: [
          "Oral rehydration solution 75 mL/kg over four hours",
          "An isotonic bolus of 10 to 20 mL/kg of 0.9 per cent saline, then reassessment",
          "A hypotonic maintenance fluid at the 4-2-1 rate",
          "One litre of 5 per cent dextrose over four hours",
        ],
        correctIndex: 1,
        explanation: "Shock is treated with a rapid isotonic bolus and reassessment; oral rehydration and slow rates are for the child who is not shocked, and hypotonic fluid must not be used.",
      },
      {
        type: "mcq",
        stem: "A severely dehydrated child has a sodium of 168 mmol/L. Which statement about the correction is correct?",
        options: [
          "The sodium should be brought into the normal range within 12 hours",
          "The sodium should fall no faster than about 10 to 12 mmol/L in 24 hours, replacing the deficit over at least 48 hours",
          "The sodium should be ignored because it corrects itself as water is given",
          "A rapid fall is harmless because it only draws water into the cells",
        ],
        correctIndex: 1,
        explanation: "Rapid correction of chronic hypernatraemia causes cerebral oedema, so the deficit is replaced over at least 48 hours with frequent sodium measurement.",
      },
      {
        type: "mcq",
        stem: "Why is hypotonic fluid no longer used for maintenance in children?",
        options: [
          "It is too expensive to manufacture",
          "Because ill and post-operative children have non-osmotic antidiuretic hormone secretion, and a hypotonic infusion produces hyponatraemic injury",
          "Because it causes hypernatraemia",
          "Because it contains too much glucose",
        ],
        correctIndex: 1,
        explanation: "Hospital-acquired hyponatraemia from hypotonic maintenance fluid caused seizures and brainstem injury, so isotonic glucose-containing fluid is now the default.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "A child is 60 to 80 per cent water and cannot concentrate urine well, so dehydration is fast and unforgiving; it is graded on perfusion first and on interstitial signs second, and the honest measure is the weight against the premorbid weight. Oral rehydration solution of sodium 75 and glucose 75 mmol/L works because glucose keeps the cotransporter open, and oral or nasogastric rehydration treats the moderate child while intravenous isotonic boluses are reserved for shock. Sodium and water are corrected to a rate rather than to a number, and isotonic glucose-containing fluid is the maintenance of choice.",
      },
      {
        type: "paragraph",
        text: "Next: the newborn who needs help in the first minutes of life — the neonatal resuscitation algorithm, driven by the heart rate rather than by the APGAR score.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 8 — Neonatal resuscitation (fully authored)
// ---------------------------------------------------------------------------
function lesson8() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: recite the neonatal resuscitation algorithm in order, from birth to the decision to stop; state the physiological endpoint that every step is judged against; list the preparation and the questions asked before the baby is born; describe the technique, the pressure and the rate of the inflation breaths, the chest compressions and the drugs; explain why the APGAR score is not used to drive resuscitation; and describe the immediate care of the baby who has been resuscitated, including therapeutic hypothermia.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 2 and PHYS 101 module 1 — the fetal circulation, the transition at birth and the control of breathing. Resuscitation is the support of the physiological transition while the baby's own lungs and circulation take over.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "paragraph",
        text: "Almost no newborn needs a drug, an intubation or a compressor. The newborn is born with fluid in its lungs, not air, and the single most effective intervention in newborn resuscitation is to aerate those lungs with inflation breaths. The whole algorithm is built on one number: the heart rate. If the heart rate is above 100 beats per minute after the inflation breaths, the baby is establishing its own circulation; if it is rising, continue ventilation; if it is below 60 after 30 seconds of effective ventilation and compressions, give a drug.",
      },
      {
        type: "definition",
        term: "Inflation breath",
        text: "The first assisted breath given to a newborn, held for two to three seconds at a pressure of about 30 cmH2O, to move the lung fluid out of the way and open the functional residual capacity for the first time. Five inflation breaths are given before any reassessment, because a lung that has never been aerated takes longer to open than a collapsed adult lung.",
      },
      {
        type: "definition",
        term: "Ventilation breath",
        text: "The shorter breaths given after the inflation breaths, at 30 to 60 per minute, at whatever pressure achieves a visible chest rise. A visible chest rise is the only reliable sign that the lungs have been inflated; a mask that leaks, a blocked airway or a displaced tongue will produce no rise and no rise in heart rate.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "The commonest reason for a newborn failing to respond to resuscitation is not a cardiac cause but an airway that was never opened. The neutral position of the head in a newborn — neither flexed nor extended — a clear airway, and a mask that fits, will resolve the majority of apparent arrests.",
      },

      { type: "heading", level: 2, text: "Worked example 1: the algorithm, step by step" },
      {
        type: "paragraph",
        text: "Before the birth, the team asks four questions — what is the gestation, is the liquor clear, how many babies are expected, and are there additional risk factors — because those answers determine whether a full team with a trolley is needed at the resuscitation table or whether the baby will need only drying and skin-to-skin.",
      },
      {
        type: "table",
        headers: ["Step", "Time", "Action", "Judged by"],
        rows: [
          ["Warm, dry, position, assess", "Birth", "Baby to a warm table, dried with a warm towel, head in the neutral position, airway opened; the baby is wrapped to keep it warm", "Breathing or crying, tone, term or preterm"],
          ["Stimulate", "First 30 seconds", "Dry and stimulate; do not slap or shake; a baby in primary apnoea breathes with stimulation", "Respiratory effort and heart rate"],
          ["Airway and inflate", "First 30 seconds", "If the baby is not breathing, is gasping, or the heart rate is below 100: position the head, clear the airway if obstructed, and give five inflation breaths", "Chest rise; heart rate re-checked at 30 seconds"],
          ["Ventilate", "30 to 60 seconds", "Continue ventilation at 30 to 60 breaths per minute; a second person applies monitoring if the heart rate stays low", "Response of the heart rate; an assistant confirms the chest movement"],
          ["Compressions", "After 30 s of effective ventilation", "If the heart rate is still below 60 and not rising: chest compressions in a three-to-one ratio with ventilation, 90 compressions and 30 breaths per minute", "Heart rate above 100, or a rising trend"],
          ["Drugs", "If no response", "Adrenaline intravenously or intraosseously; volume expansion if there has been blood loss; sodium bicarbonate is no longer routine", "Return of a spontaneous heart rate above 60"],
          ["Stop or hand over", "After 10 minutes", "If there is no heart rate after 10 minutes of effective, well-delivered resuscitation, the team may stop; otherwise the baby goes to neonatal intensive care", "The decision is a team decision and is documented"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The first 30 seconds of newborn life are spent drying, warming and stimulating — the baby is not separated from its mother for an electronic monitor. Colour alone is not a reason to intervene, and a blue baby with a heart rate over 100 that is breathing normally is a baby that is transitioning, not a baby that needs a drug.",
      },

      { type: "heading", level: 2, text: "Worked example 2: technique and the numbers" },
      {
        type: "table",
        headers: ["Intervention", "Technique", "Numbers"],
        rows: [
          ["Inflation breaths", "Mask and T-piece or bag, five breaths of two to three seconds each, with the head in the neutral position", "Pressure about 30 cmH2O; reassess the heart rate after five breaths"],
          ["Ventilation breaths", "Mask, or a laryngeal mask, or a tracheal tube once the heart rate stays under 100", "30 to 60 breaths per minute, at the lowest pressure that moves the chest"],
          ["Chest compressions", "Two thumbs on the lower third of the sternum with the hands encircling the chest, so the fingers compress the spine rather than the abdomen", "Depth one third of the anteroposterior diameter; three compressions to one ventilation, ninety compressions and thirty breaths a minute"],
          ["Adrenaline", "Intravenous or intraosseous route preferred, at 0.02 mg/kg; the endotracheal route is reserved for while access is being obtained", "0.01 to 0.03 mg/kg of 1 in 10 000 (0.1 to 0.3 mL/kg)"],
          ["Volume expansion", "10 mL/kg of group O negative blood or 0.9 per cent saline, slowly, if there is a history of blood loss or a poor response to ventilation", "10 mL/kg over five to ten minutes, then reassess"],
          ["Glucose", "Checked in the baby who required resuscitation, and the baby who was born with growth restriction or to a diabetic mother", "2 mL/kg of 10 per cent glucose intravenously if the glucose is low"],
        ],
      },
      {
        type: "paragraph",
        text: "Oxygen is another place where newborn resuscitation diverges from the adult: a term baby is resuscitated in air, and preterm babies need 21 to 30 per cent oxygen initially. There is no evidence that starting with 100 per cent oxygen improves the outcome, and excess oxygen is a vasoconstrictor in the newborn. Meconium-stained liquor is likewise no longer an indication for routine suction at the perineum or on the cord; only a depressed infant with an obstructed airway is suctioned.",
      },
      {
        type: "definition",
        term: "Hypoxic-ischaemic encephalopathy",
        text: "The encephalopathy that follows perinatal hypoxia and acidosis, graded as mild, moderate or severe on the EEG, the examination and the seizure pattern. A baby with moderate or severe encephalopathy who is at least 36 weeks of gestation is cooled to 33.5 to 34.5°C within six hours of birth, for 72 hours, which reduces death and disability.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The baby who needs resuscitation is born to an identifiable group: meconium-stained liquor, foetal bradycardia, a scalp pH below 7.2, a caesarean for foetal distress, a vaginal breech, a prolapsed cord, an antepartum haemorrhage, a shoulder dystocia, a preterm birth, or an intrapartum maternal fever. Recognising them before the birth is the whole of the preparation.",
      },

      { type: "heading", level: 2, text: "Worked example 3: after the resuscitation" },
      {
        type: "paragraph",
        text: "A resuscitated baby is transferred to the neonatal unit, is observed for apnoea and suction, is kept warm, and has its glucose, its gases and its respiratory rate monitored. Babies who required more than the initial steps are at risk of hypoglycaemia from depleted glycogen, of hypocalcaemia, of seizures, and of pulmonary hypertension, and of meconium aspiration if the liquor was stained.",
      },
      {
        type: "paragraph",
        text: "The baby with hypoxic-ischaemic encephalopathy needs a saturation of 94 to 98 per cent, normocapnia, a normal blood pressure and glucose, and a lactate and a base deficit trend; the encephalopathy is graded so that the family can be given an honest prognosis. Cooling is time-critical, and it is one of the very few interventions in neonatology with a clear effect on survival without disability.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Using the APGAR score to decide what to do. The APGAR is scored at one minute, at five, and after any resuscitation, to document how the baby tolerated the birth; the algorithm is driven entirely by the respiratory effort and the heart rate from 30 seconds.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Suctioning every meconium-stained baby. Routine nasopharyngeal or tracheal suctioning does not improve outcome and causes trauma and bradycardia; only the depressed infant with an obstructed airway is suctioned.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Starting chest compressions before the lungs have been aerated, or giving adrenaline before effective ventilation has been established. Ventilation is the treatment for the newborn bradycardia; compressions and drugs follow only when ventilation has failed.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting the temperature and the glucose. A resuscitated newborn loses heat rapidly, and hypothermia worsens the metabolic acidosis; and the baby with meconium aspiration or growth restriction should have its glucose measured within the first hour.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What is the physiological endpoint that every step of neonatal resuscitation is judged against?",
        answer: "The heart rate. It is checked after the initial steps, again at 30 seconds, after the inflation breaths, after 30 seconds of ventilation and compressions, and again after drugs; a rising heart rate above 100 means the resuscitation is working.",
        explanation: "Ventilation is the intervention that makes the heart rate rise in the newborn, and the response of the heart rate is the only measure of whether it is being delivered.",
      },
      {
        type: "question",
        prompt: "State the dose and the route for adrenaline in a newborn that remains bradycardic after 30 seconds of effective ventilation and compressions.",
        answer: "Adrenaline 0.01 to 0.03 mg/kg intravenously or intraosseously — 0.1 to 0.3 mL/kg of the 1 in 10 000 solution — repeated every three to five minutes if there is no response; the endotracheal route is a stopgap while venous access is obtained.",
        explanation: "The intravenous route is preferred because the endotracheal absorption is unreliable.",
      },
      {
        type: "question",
        prompt: "Which infant should be cooled, and by when?",
        answer: "An infant of at least 36 weeks of gestation with moderate or severe hypoxic-ischaemic encephalopathy should be cooled to 33.5 to 34.5°C, started within six hours of birth and continued for 72 hours.",
        explanation: "Therapeutic hypothermia after perinatal hypoxia reduces death and disability, and the window is short.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A term newborn is apnoeic and floppy five seconds after birth. What is the correct first action?",
        options: [
          "Give five inflation breaths with a mask and reassess the heart rate at 30 seconds",
          "Give chest compressions at a three-to-one ratio immediately",
          "Give adrenaline 0.1 mL/kg intravenously",
          "Intubate and give 100 per cent oxygen through a tube",
        ],
        correctIndex: 0,
        explanation: "The first intervention in the apnoeic newborn is five inflation breaths to aerate the lung, with the heart rate reassessed at 30 seconds.",
      },
      {
        type: "mcq",
        stem: "A newborn has received five inflation breaths and 30 seconds of effective mask ventilation, and the heart rate is 50 with no chest rise. What is the most likely problem and the next step?",
        options: [
          "The baby has congenital heart disease, so give adrenaline",
          "The airway is obstructed or the mask is leaking, so reposition the head, reseat the mask, and confirm a chest rise before escalating",
          "The baby needs sodium bicarbonate",
          "The baby needs atropine intravenously",
        ],
        correctIndex: 1,
        explanation: "Failure of the heart rate to rise with ventilation is almost always failure of ventilation — no chest rise means no aeration — and the airway is corrected before drugs.",
      },
      {
        type: "mcq",
        stem: "What is the correct compression technique and ratio in newborn resuscitation?",
        options: [
          "One-thumb compressions at a five-to-one ratio",
          "Two thumbs on the lower third of the sternum, depth one third of the chest, three compressions to one ventilation",
          "Two-finger compressions at a fifteen-to-two ratio",
          "Compressions only, with ventilation added after the heart rate recovers",
        ],
        correctIndex: 1,
        explanation: "The two-thumb encircling technique gives a depth of about one third of the chest, at three compressions to one ventilation — ninety compressions and thirty breaths per minute.",
      },
      {
        type: "mcq",
        stem: "A baby born through meconium-stained liquor is vigorous at birth. What should be done about the meconium?",
        options: [
          "Suction the nose and oropharynx routinely before drying",
          "No routine suction — the baby is dried and stimulated as normal, because routine aspiration does not improve outcome",
          "Intubate and suction the trachea prophylactically",
          "Wash the stomach and give an antacid",
        ],
        correctIndex: 1,
        explanation: "Routine intrapartum or neonatal suctioning of meconium no longer improves outcome and causes trauma; only the depressed, obstructed infant is suctioned.",
      },
      {
        type: "mcq",
        stem: "Which statement about the APGAR score is correct?",
        options: [
          "It is calculated at 30 seconds to decide whether to start ventilation",
          "It is a documentation tool at one and five minutes that describes the tolerance of birth, and resuscitation decisions use the heart rate and respiratory effort",
          "It is a measure of the severity of hypoxic-ischaemic encephalopathy",
          "A five-minute score of 5 means the baby must be cooled",
        ],
        correctIndex: 1,
        explanation: "The APGAR score documents how the birth was tolerated; the resuscitation algorithm is driven by the heart rate and the respiratory effort.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Newborn resuscitation is a sequence of air before drugs: warm, dry, position and stimulate; five inflation breaths of two to three seconds; then ventilation at 30 to 60 breaths per minute; then three-to-one compressions; then adrenaline, and volume for blood loss. The endpoint is the heart rate, the measure of good ventilation is a visible chest rise, and the APGAR score documents the birth rather than directing the algorithm. Ten minutes without a heart rate after effective resuscitation is the point at which the team discusses stopping, and the baby who responds is watched for hypoglycaemia, hypothermia, seizures and apnoea — with cooling for moderate or severe encephalopathy begun within six hours.",
      },
      {
        type: "paragraph",
        text: "Next: the baby that turns yellow — bilirubin, its thresholds, and the injury that uncontrolled jaundice causes.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 9 — Neonatal jaundice & haemolytic disease (fully authored)
// ---------------------------------------------------------------------------
function lesson9() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the metabolism of bilirubin and say what is different about the newborn; distinguish physiological jaundice from jaundice that must be investigated, on the timing, the rate of rise and the baby's state; separate unconjugated from conjugated hyperbilirubinaemia and name the causes of each; apply the age- and gestation-specific thresholds for phototherapy and exchange transfusion; describe the features and the management of rhesus and ABO haemolytic disease; and state the acute and chronic neurological injury that uncontrolled bilirubin causes.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 2 and BCHM 101 module 2 — haem catabolism, the hepatic conjugation of xenobiotics and the biliary tree. Jaundice is a biochemical disturbance that is clinically invisible until it becomes a poisoning of the brain.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "paragraph",
        text: "Bilirubin is the waste product of haem breakdown: red cells, myoglobin and cytochromes are catabolised by haem oxygenase and biliverdin reductase to unconjugated bilirubin, which is insoluble in water and therefore carried in the plasma bound to albumin. The liver conjugates it with glucuronic acid through UDP-glucuronosyltransferase 1A1 to make water-soluble bilirubin diglucuronide, which is excreted in bile, converted by gut bacteria to stercobilinogen, and passed in the stool; a fraction is reabsorbed and appears in the urine as urobilinogen.",
      },
      {
        type: "definition",
        term: "Unconjugated (indirect) hyperbilirubinaemia",
        text: "An excess of lipid-soluble bilirubin, which is albumin-bound and harmless until it exceeds the binding capacity and crosses the blood-brain barrier. It results from increased production (haemolysis, bruising, polycythaemia), reduced hepatic uptake or conjugation (the immature enzyme of the newborn, breast milk jaundice, Crigler-Najjar, Gilbert), or increased enterohepatic reabsorption.",
      },
      {
        type: "definition",
        term: "Conjugated (direct) hyperbilirubinaemia",
        text: "A conjugated fraction over about 20 µmol/L or more than 20 per cent of the total. Conjugated bilirubin is water soluble and excreted in the urine, so the child has dark urine and, when the biliary tree is obstructed, pale stools. This is always pathological in the newborn and means biliary atresia, neonatal hepatitis, choledochal cyst, metabolic disease or total parenteral nutrition cholestasis until proven otherwise.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "The newborn's bilirubin load is enormous for its liver: a term infant makes about 8 to 10 mg of bilirubin per kilogram a day, about twice the adult rate per kilogram, with an immature conjugation pathway and an almost sterile gut that cannot break the reabsorbed bilirubin down. That is why the bilirubin normally rises to a peak on the third to fourth day and falls again over the following week.",
      },

      { type: "heading", level: 2, text: "Worked example 1: physiological versus pathological jaundice" },
      {
        type: "table",
        headers: ["Feature", "Physiological jaundice", "Pathological jaundice — investigate"],
        rows: [
          ["Onset", "After the first 24 hours of life", "Within the first 24 hours — always pathological"],
          ["Rate of rise", "Below about 8 µmol/L per hour", "Above 5 mg/dL a day (8 µmol/L an hour)"],
          ["Peak", "Day 3 to 5, then falling", "Rising after day 5, or continuing to rise after the expected peak"],
          ["Duration", "Settles by 2 weeks in a term infant and 3 weeks in a preterm infant", "Persists beyond those limits, or is conjugated from the start"],
          ["Conjugated fraction", "Always below the conjugated threshold", "Any conjugated fraction over about 20 µmol/L"],
          ["The baby", "Well, alert, feeding, gaining weight", "Poor feeding, lethargy, hypotonia, high-pitched cry, fever, hepatosplenomegaly, sepsis"],
          ["Commonest causes", "Newborn erythrocyte turnover, immature UDP-glucuronosyltransferase, breast milk and enterohepatic reabsorption", "Haemolysis, infection, sepsis, metabolic disease, biliary obstruction"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Jaundice in the first 24 hours of life is never physiological. It is haemolysis until proven otherwise — rhesus or ABO incompatibility, glucose-6-phosphate dehydrogenase deficiency, pyruvate kinase deficiency or spherocytosis — and it demands a same-day bilirubin, a blood group and a direct antiglobulin (Coombs) test, a full blood count and a smear.",
      },

      { type: "heading", level: 2, text: "Worked example 2: the causes, by mechanism" },
      {
        type: "table",
        headers: ["Timing", "Mechanism", "Causes"],
        rows: [
          ["First 24 hours", "Haemolysis", "Rhesus haemolytic disease, ABO incompatibility, glucose-6-phosphate dehydrogenase deficiency, hereditary spherocytosis, pyruvate kinase deficiency"],
          ["Day 2 to 7", "Increased bilirubin load and immature conjugation", "Physiological jaundice, breastfeeding failure jaundice, cephalohaematoma, polycythaemia, sepsis"],
          ["Day 7 onward", "Prolonged unconjugated", "Breast milk jaundice, ongoing sepsis, hypothyroidism, upper intestinal obstruction, cholestasis"],
          ["Any time", "Conjugated — biliary obstruction or hepatocellular", "Biliary atresia, choledochal cyst, neonatal hepatitis, galactosaemia, alpha-1-antitrypsin deficiency, total parenteral nutrition cholestasis, cystic fibrosis"],
        ],
      },
      {
        type: "definition",
        term: "Rhesus haemolytic disease",
        text: "Haemolysis of a rhesus-positive infant's cells by maternal anti-D immunoglobulin G, which crossed the placenta from a previously sensitised mother. The infant is anaemic, jaundiced in the first hours, has hepatosplenomegaly, a positive direct antiglobulin test and a high reticulocyte count, and may already be hydropic in utero; it is prevented by anti-D immunoglobulin given to the rhesus-negative mother at 28 weeks and within 72 hours of any sensitising event.",
      },
      {
        type: "definition",
        term: "Breast milk jaundice",
        text: "A benign, unconjugated jaundice that persists from the second week into the third month of life in a thriving, breastfed infant. It is distinguished from the jaundice of inadequate intake — which occurs in the first week and is a feeding problem — by the well, gaining infant, the prolonged course and the unconjugated fraction, and it is never a reason to stop breastfeeding.",
      },

      { type: "heading", level: 2, text: "Worked example 3: thresholds, treatment and kernicterus" },
      {
        type: "paragraph",
        text: "Every jaundiced baby is treated against an age- and gestation-specific threshold chart rather than against a single number, because the risk rises with the bilirubin concentration, the duration of the exposure, and the infant's albumin, acidosis, sepsis and gestational age. The values below are approximations for a well infant of 38 weeks or more without risk factors, given to show the shape of the chart; the real chart is used, with a lower threshold at 35 to 37 weeks and in any infant with a lower threshold risk score. Multiply micromoles by 0.058 to convert to mg/dL.",
      },
      {
        type: "table",
        headers: ["Age", "Phototherapy threshold — well term infant (approx.)", "Exchange transfusion threshold (approx.)"],
        rows: [
          ["24 hours", "about 100 µmol/L (6 mg/dL)", "about 300 µmol/L (17 mg/dL)"],
          ["48 hours", "about 140 µmol/L (8 mg/dL)", "about 360 µmol/L (21 mg/dL)"],
          ["72 hours", "about 180 µmol/L (10 to 11 mg/dL)", "about 420 µmol/L (24 to 25 mg/dL)"],
          ["96 hours and later", "about 200 µmol/L (12 mg/dL)", "about 450 µmol/L (26 mg/dL)"],
        ],
      },
      {
        type: "table",
        headers: ["Treatment", "How it works", "Practical points"],
        rows: [
          ["Phototherapy", "Blue light of 425 to 475 nm converts bilirubin in the skin to water-soluble lumirubin, which is excreted without conjugation", "Intensive means maximal irradiance, maximal skin exposed, a warm cot, eye protection, and frequent feeding; therapeutic efficiency falls once the threshold is crossed"],
          ["Exchange transfusion", "A double-volume exchange (2 x 60 to 80 mL/kg) removes bilirubin and antibodies and corrects anaemia", "Reserved for a bilirubin at or above the exchange threshold despite intensive phototherapy; risks are catheter injury, thrombosis, hypocalcaemia, hypoglycaemia and transfusion reaction"],
          ["Intravenous immunoglobulin", "Blocks the Fc receptor and reduces haemolysis in immune haemolysis", "0.5 g/kg in rhesus or ABO disease with a rising bilirubin despite phototherapy"],
          ["Treat the cause", "Antibiotics for sepsis, thyroxine for hypothyroidism, surgically created biliary drainage for biliary atresia", "A conjugated jaundice is a surgical referral, and the window for a successful Kasai is before 8 weeks of age"],
        ],
      },
      {
        type: "definition",
        term: "Kernicterus",
        text: "The neurological injury caused by unconjugated bilirubin crossing the blood-brain barrier. Acute bilirubin encephalopathy passes from lethargy and hypotonia with a high-pitched cry, through hypertonia with retrocollis and opisthotonus, to fever, apnoea, seizures and death. Chronic bilirubin encephalopathy leaves athetoid cerebral palsy, a sensorineural deafness, an upward-gaze palsy and dental enamel dysplasia.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "There is no safe bilirubin concentration. The risk is determined by the interaction between the concentration and the albumin, the pH, the albumin-binding drugs and the sepsis, which is why a septic or acidotic infant is treated at a lower threshold than a thriving one.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Waiting for a visual assessment to decide. Clinical jaundice is not reliably seen until the bilirubin is high and is invisible under artificial light, so every baby who looks jaundiced in the first 24 hours, or who looks significantly jaundiced at any age, has a transcutaneous measurement or a serum bilirubin taken.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Reassuring a family that prolonged jaundice will settle. Any jaundice beyond 2 weeks in a term infant or 3 weeks in a preterm infant needs the stool colour inspected and a conjugated fraction measured, because biliary atresia is best treated surgically before 8 weeks of age.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Stopping breastfeeding to treat jaundice. Breast milk jaundice is benign, breastfeeding failure jaundice is treated by increasing the milk the baby receives, and the interruption of breastfeeding is a harm without a benefit.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating a conjugated jaundice with phototherapy alone. Conjugated bilirubin is already water soluble and is not a substrate for phototherapy; the child needs a diagnosis of the obstruction.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "List the six features that make neonatal jaundice pathological rather than physiological.",
        answer: "Onset within the first 24 hours, a rate of rise above about 8 µmol/L (5 mg/dL) per hour, a prolonged course beyond 2 weeks in a term or 3 weeks in a preterm infant, a bilirubin rising after the expected peak, any conjugated fraction, and a baby who is unwell, lethargic, hypotonic, feeding poorly or febrile.",
        explanation: "Each feature is an indication for a same-day measurement and a defined workup.",
      },
      {
        type: "question",
        prompt: "What investigations are needed in an infant who is jaundiced within the first 24 hours of life?",
        answer: "A serum bilirubin, a blood group and a direct antiglobulin (Coombs) test on mother and baby, a full blood count with a reticulocyte count and a smear, and a glucose-6-phosphate dehydrogenase assay; the infant also needs a septic screen if the history suggests infection.",
        explanation: "Jaundice in the first day is haemolysis until proven otherwise, and the Coombs test distinguishes immune from non-immune haemolysis.",
      },
      {
        type: "question",
        prompt: "What is the danger of bilirubin crossing the blood-brain barrier, and which infants are at the greatest risk?",
        answer: "It produces acute bilirubin encephalopathy and then chronic kernicterus — athetoid cerebral palsy, sensorineural deafness and upward-gaze palsy. The risk is greatest at high concentrations and with low albumin, acidosis, sepsis, hypoalbuminaemia and prematurity.",
        explanation: "The threshold chart accounts for the interaction, which is why the risk factors lower the treatment threshold.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A 12-hour-old infant is visibly jaundiced. Which statement is correct?",
        options: [
          "It is physiological jaundice, and the parents can be reassured",
          "Jaundice in the first 24 hours is always pathological and requires urgent investigation for haemolysis",
          "The bilirubin should be measured only if the infant becomes sleepy",
          "Phototherapy should start before any blood test is taken",
        ],
        correctIndex: 1,
        explanation: "Before 24 hours of age jaundice is haemolysis until proven otherwise, and a same-day bilirubin, blood groups and a Coombs test are needed.",
      },
      {
        type: "mcq",
        stem: "A 3-week-old infant has yellow sclera, dark urine and pale chalky stools. What is the priority?",
        options: [
          "Reassure the parents — this is common breast milk jaundice",
          "Measure the conjugated fraction and refer urgently for biliary atresia, because the surgical window closes at about 8 weeks of age",
          "Start a course of phototherapy",
          "Advise that the infant stop breastfeeding",
        ],
        correctIndex: 1,
        explanation: "Conjugated hyperbilirubinaemia with pale stools and dark urine is biliary obstruction until proven otherwise, and the Kasai procedure is far more effective before 8 weeks.",
      },
      {
        type: "mcq",
        stem: "How does phototherapy lower the bilirubin concentration?",
        options: [
          "It conjugates the bilirubin in the skin",
          "Blue light converts bilirubin to water-soluble photoisomers that are excreted without conjugation",
          "It binds bilirubin to albumin in the plasma",
          "It increases hepatic UDP-glucuronosyltransferase activity",
        ],
        correctIndex: 1,
        explanation: "Light of 425 to 475 nm produces configurational and structural isomers — lumirubin — which are water soluble and excreted in bile and urine.",
      },
      {
        type: "mcq",
        stem: "A rhesus-negative mother has a rhesus-positive infant and had no anti-D prophylaxis. What is the mechanism of the neonatal haemolysis?",
        options: [
          "The infant's cells are attacked by its own antibodies",
          "Maternal immunoglobulin G anti-D crossed the placenta after a previous sensitising event and coats the infant's rhesus-positive cells",
          "An ABO incompatibility between mother and infant",
          "A deficiency of glucose-6-phosphate dehydrogenase in the infant",
        ],
        correctIndex: 1,
        explanation: "Rhesus haemolytic disease is immune haemolysis by maternal anti-D that crossed the placenta; ABO incompatibility is a different and usually milder mechanism.",
      },
      {
        type: "mcq",
        stem: "Which finding is most consistent with breast milk jaundice?",
        options: [
          "Jaundice on the first day of life with a positive Coombs test",
          "A thriving, gaining, alert infant jaundiced from the second week into the third month, with an unconjugated fraction",
          "Pale stools with dark urine and a raised conjugated fraction",
          "A lethargic infant with hepatosplenomegaly and fever",
        ],
        correctIndex: 1,
        explanation: "Breast milk jaundice is a benign unconjugated jaundice of the second week onward in a well infant, and it is never a reason to stop breastfeeding.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The newborn carries a large bilirubin load through an immature conjugation pathway, so a rising unconjugated bilirubin is expected, and jaundice becomes pathological when it starts before 24 hours, rises faster than about 8 µmol/L an hour, persists beyond the second or third week, becomes conjugated, or is accompanied by an unwell infant. Treatment is against an age- and gestation-specific threshold chart — phototherapy at the phototherapy threshold, an exchange transfusion at or above the exchange threshold — and the risk is not the number alone but the number against the albumin, the pH and the sepsis, because the injury is kernicterus. Conjugated jaundice is a different disease: biliary atresia is the one diagnosis that must not be missed, and the surgical window closes before 8 weeks of age.",
      },
      {
        type: "paragraph",
        text: "Next: the two commonest causes of a noisy, distressed child — bronchiolitis and croup — and the airway emergencies that must never be confused with them.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 10 — Bronchiolitis, croup & the noisy airway (fully authored)
// ---------------------------------------------------------------------------
function lesson10() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: explain why a small amount of oedema in a child's airway produces so much obstruction; define bronchiolitis and grade its severity; describe the supportive management of bronchiolitis and the evidence against the drugs commonly used; define croup, score its severity and give the treatment; recognise epiglottitis and bacterial tracheitis and state what not to do in a suspected epiglottitis; and take a history that distinguishes a stridulous child from one with an inhaled foreign body.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-2, lesson 5 and PHYS 101 module 1 — the respiratory mechanics, airway resistance and the volumes. Everything in this lesson is the physics of flow applied to a very small tube.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "paragraph",
        text: "A child's airway is narrow, and flow through a tube in laminar conditions is proportional to the fourth power of its radius. Halve the radius and the resistance rises sixteenfold. The subglottis of a young child is also the narrowest part of the whole airway, because the cricoid is a complete ring with no compliance to expand: one millimetre of circumferential oedema reduces the cross-sectional area of a newborn's subglottis by roughly three quarters, and of an adult's by only about a quarter. That single piece of physics explains why a croupy child of two can obstruct in hours, why obstruction sounds as stridor, and why the child must never be laid flat.",
      },
      {
        type: "definition",
        term: "Stridor",
        text: "A harsh, vibrating noise on inspiration, produced by narrowed extrathoracic airways — the larynx and the pharynx. It is inspiratory when the obstruction is above the thoracic inlet, expiratory when it is below, and biphasic when it is at or near the vocal cords. It is the sound of a narrowed larynx, not of bronchospasm.",
      },
      {
        type: "definition",
        term: "Bronchiolitis",
        text: "A viral lower respiratory tract infection of the small infants, with respiratory syncytial virus causing most cases, presenting with coryza, a dry cough, tachypnoea, recession and widespread wheeze in the first year of life. It is a clinical diagnosis; the symptoms peak around the third to fifth day and the cough may continue for three weeks or more.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "The child with airway obstruction must not be forced to lie flat, must not be examined with a spatula, and must not be separated from its parent. Distress increases air trapping and oxygen consumption; a child left calm may be in far less danger than the same child who has been upset by a needless examination.",
      },

      { type: "heading", level: 2, text: "Worked example 1: bronchiolitis — assessment and admission" },
      {
        type: "paragraph",
        text: "Infants are assessed on what they take in and on their effort of breathing, because the disease is a self-limiting viral infection in which the danger is exhaustion, apnoea and hypoxia. The respiratory rate is counted for a full minute in a settled child, and the saturation is taken in a settled, crying-free infant.",
      },
      {
        type: "table",
        headers: ["Feature", "Manage at home", "Admit and support"],
        rows: [
          ["Feeding", "Taking more than about 75 per cent of the usual volume", "Taking less than 50 to 75 per cent of usual, or sustained by frequent small vomiting feeds"],
          ["Work of breathing", "Mild recession, grunting that settles", "Severe recession, grunting, nasal flaring, head bobbing"],
          ["Respiratory rate", "Below about 60", "Above 60 to 70, or rising"],
          ["Oxygen saturation", "Above 92 per cent in air", "A saturation persistently at or below 92 per cent, or a falling trend"],
          ["Apnoea", "None", "A history of apnoea, cyanosis or an apparent life-threatening event, particularly in a very young infant"],
          ["Risk factors", "Term, previously well, mature feeding history", "Under 3 months or under 2.5 kg, prematurity, chronic lung disease, congenital heart disease, immunodeficiency, significant comorbidities"],
          ["Social factors", "A carer who can cope and return", "Distance from hospital, no transport, carer unable to recognise deterioration"],
        ],
      },
      {
        type: "paragraph",
        text: "The management is supportive and is the same whichever the cause: clear the nose, give oxygen only if the saturation is at or below 92 per cent, support the feeding by nasogastric tube or by intravenous fluid, and watch for apnoea and a rising respiratory rate. Hand hygiene, a mask for the staff and isolation from other infants interrupt the transmission of respiratory syncytial virus, which is the single most effective intervention on a paediatric ward.",
      },
      {
        type: "table",
        headers: ["Intervention", "Evidence and role"],
        rows: [
          ["Bronchodilators (salbutamol, ipratropium)", "No routine role: trials show a small, transient change in the clinical score with no effect on admission, length of stay or oxygenation"],
          ["Nebulised adrenaline", "Not recommended for bronchiolitis; its benefit in the outpatient or inpatient setting has not been shown"],
          ["Systemic or nebulised corticosteroids", "No benefit shown in trials and not recommended"],
          ["Antibiotics", "No role in uncomplicated bronchiolitis; reserved for a documented bacterial co-infection or an infant under 3 months at risk of sepsis"],
          ["Hypertonic saline", "Not for routine use; some units use it for an infant still admitted after several days, and the effect is small"],
          ["Palivizumab", "A monoclonal antibody given monthly during the season to infants at the highest risk of severe disease — severe prematurity, chronic lung disease, significant congenital heart disease"],
        ],
      },

      { type: "heading", level: 2, text: "Worked example 2: croup and its spectrum" },
      {
        type: "paragraph",
        text: "Croup is viral laryngotracheobronchitis, most often parainfluenza, presenting in the second year of life with a barking seal-like cough, hoarseness and an inspiratory stridor that comes on over two to three days after a coryzal prodrome and is characteristically worse at night. The severity is scored, and the score decides the treatment.",
      },
      {
        type: "table",
        headers: ["Severity", "Stridor", "Recession", "Air entry and colour", "Behaviour"],
        rows: [
          ["Mild", "Only when agitated or crying", "None or minimal", "Normal, no cyanosis", "Normal, settled"],
          ["Moderate", "Present at rest but quiet", "Moderate", "Normal air entry", "Settled but may be agitated on examination"],
          ["Severe", "Marked and continuous", "Severe", "Reduced air entry, cyanosis or desaturation", "Agitated, distressed, tiring"],
          ["Impending failure", "Reduced or absent as air movement falls", "Severe", "Hypoxia, cyanosis", "Fatigue, drowsiness"],
        ],
      },
      {
        type: "paragraph",
        text: "A single dose of oral dexamethasone at 0.15 to 0.3 mg/kg is the treatment that shortens the illness and reduces the need for hospitalisation, whatever the severity, and it works by shrinking the subglottic oedema. Nebulised adrenaline at about 0.4 mg/kg (maximum 5 mg) buys 30 to 60 minutes in the severe child, and any child who needs adrenaline is admitted and observed, because the effect wears off while the inflammation continues. Antibiotics have no role in viral croup.",
      },
      {
        type: "table",
        headers: ["Diagnosis", "Age", "Onset", "Distinguishing features", "Management"],
        rows: [
          ["Croup", "6 months to 3 years", "Over 1 to 3 days, worse at night", "Barking cough, hoarse cry, low fever, no drool, no toxic state", "Dexamethasone, nebulised adrenaline if severe, oxygen"],
          ["Epiglottitis", "2 to 6 years", "Rapid, over hours", "High fever, toxic, drooling, leaning forward in the tripod position, low-pitched stridor, muffled voice, no cough", "Do not examine the throat: senior anaesthetist and a controlled airway in theatre, blood cultures, parenteral ceftriaxone"],
          ["Bacterial tracheitis", "Any, average 5 to 8 years", "Acute, over days", "Toxic with high fever, brassy cough, stridor and thick purulent secretions that obstruct; does not respond to croup treatment", "Airway, suction, intravenous antibiotics, often intensive care"],
          ["Inhaled foreign body", "6 months to 3 years", "Instantaneous, with a choking episode", "Unilateral wheeze, reduced or monophasic breath sounds on one side, a normal chest radiograph in most cases", "Rigid bronchoscopy; a bilateral or laryngeal foreign body is an emergency"],
          ["Spasmodic croup", "1 to 3 years, often atopic", "Sudden, at night, no coryza", "Afebrile, recurrent, resolves by morning without treatment", "Reassurance, dexamethasone if severe, look for atopy"],
          ["Anaphylaxis or a retro-pharyngeal abscess", "Any", "Variable", "Sudden with an urticaria or a swollen neck and stiffness, torticollis, high fever", "Adrenaline for anaphylaxis; drainage and antibiotics for the abscess"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "A sudden onset with a witnessed choking, a unilateral wheeze, or an unequal chest is a foreign body until a bronchoscope proves otherwise. The chest radiograph is normal in most inhaled foreign bodies, and an inspiratory film, an expiratory film and a lateral decubitus film are used to demonstrate air trapping rather than the object itself.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Giving salbutamol, steroids, antibiotics or nebulised adrenaline to an infant with bronchiolitis. The infants are not helped by any of these, and the treatment delays the supportive care that is needed — oxygen, nasal clearance and feeding support.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Laying a stridulous child down, or examining the throat of a drooling child. Both precipitate a complete obstruction: the child is examined sitting up on the parent's lap, and a suspected epiglottitis is examined only in an operating theatre by an anaesthetist.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Discharging from an emergency department an infant who has had an apnoea. An apnoea, a cyanotic episode, or an apparent life-threatening event requires admission and continuous monitoring for at least 24 hours, because the next apnoea may be prolonged and fatal.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Accepting a saturation of 93 per cent in a baby with bronchiolitis as normal. A well infant's saturation is 95 to 100 per cent; a persistently lower saturation in bronchiolitis is a reason to give oxygen and to consider admission.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does 1 mm of oedema obstruct a child's airway so much more than an adult's?",
        answer: "Because the subglottis of the young child is the narrowest part of the airway and is bounded by the inelastic cricoid ring; a 1 mm circumferential narrowing removes about three quarters of the cross-sectional area in a newborn compared with about a quarter in an adult, and laminar resistance is proportional to the fourth power of the radius.",
        explanation: "The physics of flow in a small tube is the reason a small amount of inflammation is enough to obstruct.",
      },
      {
        type: "question",
        prompt: "List three interventions that have no place in the routine management of bronchiolitis, with the reason.",
        answer: "Bronchodilators — no effect on admission, length of stay or oxygenation; systemic corticosteroids — no benefit shown; antibiotics — no effect unless there is a documented bacterial co-infection.",
        explanation: "The treatment of bronchiolitis is oxygen, nasal clearance, feeding support and isolation.",
      },
      {
        type: "question",
        prompt: "How is the severity of croup assessed and what is the treatment of a moderate croup?",
        answer: "Severity is scored on the stridor at rest, the recession, the air entry, the cyanosis and the agitation; the treatment of a moderate croup is a single oral dose of dexamethasone 0.15 to 0.3 mg/kg, with nebulised adrenaline and admission if the child has a continuous stridor, severe recession or reduced air entry.",
        explanation: "The steroid treats the oedema, the adrenaline buys time, and the child who needs adrenaline is observed.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A 4-month-old infant with a three-day coryza now has tachypnoea, moderate recession, a respiratory rate of 64 and a saturation of 93 per cent, and is taking about half of the usual feeds. What is the correct management?",
        options: [
          "Nebulised salbutamol and oral amoxicillin, then discharge",
          "Admit for supportive care: oxygen if the saturation stays at or below 92 per cent, feeding support and monitoring for apnoea, with no routine drug treatment",
          "Oral dexamethasone and immediate discharge",
          "Intravenous antibiotics and a chest radiograph for every infant",
        ],
        correctIndex: 1,
        explanation: "This is bronchiolitis: the treatment is supportive, and bronchodilators, steroids and antibiotics have no place in routine management.",
      },
      {
        type: "mcq",
        stem: "A 3-year-old has a two-day barking cough with stridor at rest, moderate recession and a normal pharynx. What is the single most useful treatment?",
        options: [
          "Nebulised adrenaline alone",
          "Oral dexamethasone 0.15 to 0.3 mg/kg, with nebulised adrenaline and admission if the child is severe",
          "Intravenous ceftriaxone",
          "A throat examination under general anaesthesia",
        ],
        correctIndex: 1,
        explanation: "Croup is treated with a single dose of oral dexamethasone whatever the severity; adrenaline is added for the severe child, who is then admitted and observed.",
      },
      {
        type: "mcq",
        stem: "A 4-year-old is toxic with a fever, drooling, sitting forward in a tripod position, with a quiet stridor and no cough. What is the immediate management?",
        options: [
          "Examine the throat with a tongue depressor to look for the epiglottis",
          "Do not examine the throat: sit the child up with an anaesthetist and an ENT surgeon present, secure the airway in theatre, take blood cultures and give parenteral ceftriaxone",
          "Give oral dexamethasone 0.6 mg/kg",
          "Give nebulised salbutamol",
        ],
        correctIndex: 1,
        explanation: "Suspected epiglottitis is an airway emergency; examining the throat may precipitate a complete obstruction and must never be done.",
      },
      {
        type: "mcq",
        stem: "A 2-year-old has a sudden onset of unilateral wheeze and reduced breath sounds at the left base after a witnessed choking episode. The chest radiograph is reported as normal. What is the correct interpretation?",
        options: [
          "No foreign body, because the radiograph is normal",
          "The radiograph is normal in most inhaled foreign bodies, and the history and the unilateral signs mandate rigid bronchoscopy",
          "The child has asthma and needs salbutamol",
          "The child needs a course of physiotherapy alone",
        ],
        correctIndex: 1,
        explanation: "Most inhaled foreign bodies are not radio-opaque; expiratory and lateral decubitus films look for air trapping, and an asymmetric chest is an emergency.",
      },
      {
        type: "mcq",
        stem: "Which infant with bronchiolitis is most likely to be admitted?",
        options: [
          "A 6-month-old, previously well, taking 80 per cent of feeds with a saturation of 95 per cent",
          "A 6-week-old with a history of an apnoea, born at 29 weeks, taking 40 per cent of feeds",
          "An 18-month-old with a mild cough and a saturation of 97 per cent",
          "A term 9-month-old with a two-day coryza and a saturation of 96 per cent",
        ],
        correctIndex: 1,
        explanation: "Apnoea, prematurity, age under 3 months and an intake of less than half of normal are the features that make admission necessary.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The child's airway is narrow and inelastic, so one millimetre of oedema is an obstruction; stridor is the sound of a narrowed larynx and wheeze is the sound of narrowed small airways, and the two call for different treatments. Bronchiolitis is a self-limiting viral infection of infants whose treatment is oxygen at or below 92 per cent, feeding support, isolation and watch for apnoea — with no place for bronchodilators, steroids, adrenaline or antibiotics in routine care. Croup is scored by the stridor at rest and the recession and is treated with a single dose of dexamethasone, adrenaline as a temporary measure in the severe child; and the drooling, toxic, forward-leaning child is an epiglottitis that must never have a spatula put near its throat.",
      },
      {
        type: "paragraph",
        text: "Next: the infections of childhood as a system — notification, incubation, tuberculosis in the child, and the fever in the returned traveller.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 11 — Childhood infectious disease & imported infection (fully authored)
// ---------------------------------------------------------------------------
function lesson11() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: state which childhood infections must be notified and when; give the incubation period and the period of infectivity of the common exanthems; describe the treatment of measles, chickenpox, scarlet fever and pertussis; recognise and manage the contact of an infected child; take a history from a child with tuberculosis and interpret a tuberculin test in a BCG-vaccinated child; and apply a structured approach to the fever in the returned traveller, including the diagnosis that must be excluded first.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 5 and lessons 4 and 10, with PATH 201 module 1 — the adaptive immune response and the organism-specific pathology. The control of an infectious disease is a public health activity built on the individual case.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "paragraph",
        text: "Every childhood infection has three clocks: the incubation, the prodrome and the infective period, and they are not the same clock. The infective period usually begins before the diagnosis can be made, which is why a child in a classroom or on a ward is a public health event and not just a clinical one. The public health action — exclusion from school, chemoprophylaxis of the household, isolation on a ward, notification to the local health protection team — follows from those clocks and is a doctor's duty.",
      },
      {
        type: "definition",
        term: "Notification",
        text: "The statutory duty on the diagnosing physician to inform the local public health authority of a specified disease, so that it can be investigated and controlled. Notifiable diseases in most jurisdictions include measles, meningococcal septicaemia and meningitis, pertussis, scarlet fever, tuberculosis, mumps, rubella and invasive group A streptococcal infection. Duty is on the diagnosis, not on the confirmation.",
      },
      {
        type: "definition",
        term: "Incubation period",
        text: "The interval between infection and the onset of symptoms, which fixes the period that a contact is being watched: measles 8 to 12 days, chickenpox 10 to 21 days, rubella 14 to 21 days, and roseola about 9 days. The child who has been exposed can be actively managed — immunised, given immunoglobulin or watched — during that window.",
      },
      {
        type: "callout",
        variant: "info",
        text: "A contact is followed for the incubation period of the organism, while an infected child is isolated for the infective period. The two are different numbers and are frequently confused in examination answers.",
      },

      { type: "heading", level: 2, text: "Worked example 1: the exanthems, timed and treated" },
      {
        type: "table",
        headers: ["Illness", "Incubation", "Infective period", "Treatment and public health action"],
        rows: [
          ["Measles", "About 10 days (8 to 12)", "From 4 days before the rash to 4 days after it", "Supportive care and vitamin A per World Health Organization dosing; MMR within 72 hours to the susceptible contact; human normal immunoglobulin for the immunosuppressed; notify"],
          ["Rubella", "14 to 21 days", "From about 7 days before to 4 days after the rash", "Supportive; the risk is the infected pregnant contact, who is tested for susceptibility; notify"],
          ["Chickenpox", "10 to 21 days, usually 14", "From 1 to 2 days before the rash until all the lesions are crusted", "Supportive; aciclovir for the neonate, the immunosuppressed and the severe; varicella-zoster immunoglobulin for the significant contact at risk; isolate until crusted"],
          ["Parvovirus B19", "4 to 14 days", "From before the rash until the rash appears", "Supportive; the pregnant and the haemolytic contacts matter; exclude until the rash appears"],
          ["Scarlet fever", "2 to 4 days", "Until 24 hours of antibiotics", "Oral penicillin V or amoxicillin for 10 days; notify"],
          ["Pertussis", "7 to 10 days (up to 21)", "From the coryzal stage to 21 days of cough, or 5 days of a macrolide", "Azithromycin or clarithromycin treats and eradicates the carrier state; prophylaxis of the household; notify"],
          ["Hand, foot and mouth disease", "3 to 7 days", "While the lesions are present and in the stool for weeks", "Supportive; exclude from school as local policy directs; strict hand hygiene"],
          ["Roseola", "About 9 days", "Unknown, but lifelong shedding follows", "Supportive; no exclusion needed in most policies"],
        ],
      },
      {
        type: "paragraph",
        text: "The management of the contact is as important as the management of the case. A susceptible pregnant contact of rubella or varicella, an immunosuppressed contact of measles or chickenpox, and an unimmunised infant in contact with pertussis are all emergencies of prophylaxis, and the intervention — immunoglobulin, a vaccine given within its window, or a macrolide — is time-limited.",
      },

      { type: "heading", level: 2, text: "Worked example 2: tuberculosis in the child" },
      {
        type: "paragraph",
        text: "Childhood tuberculosis is a disease of recent infection, of crowding and of a young immune system. The primary complex — the Ghon focus in the lung with the draining lymph nodes of the hilum — is usually asymptomatic and heals; a small proportion of children progress within the first year to primary tuberculosis of the lung, miliary disease, tuberculous meningitis, cervical lymphadenitis or bone and joint disease.",
      },
      {
        type: "table",
        headers: ["Assessment", "Findings", "Interpretation"],
        rows: [
          ["History", "Cough for more than two to three weeks, fever and night sweats, faltering growth, contact with a smear-positive adult, birth in or travel to a high-incidence country", "Contact with a case is the commonest route of the diagnosis"],
          ["Chest radiograph", "A peripheral focus with hilar or mediastinal lymphadenopathy; miliary mottling; a pleural effusion; a cavitating disease in the adolescent", "Primary disease is lymphadenopathy, not cavitation"],
          ["Tuberculin skin test or IGRA", "Induration of 5 mm or more in an immunocompromised child or a close contact; 10 mm or more in all others", "A positive test means infection, not disease; the interferom-gamma assay is not confounded by BCG"],
          ["Microbiology", "Sputum or gastric aspirate culture; the infant swallows rather than expectorates", "Children are paucibacillary and culture is negative in most, so the diagnosis is often clinical"],
          ["Site-specific tests", "Cerebrospinal fluid for meningitis, ultrasound for abdominal disease, imaging for spinal disease", "TB meningitis is the most serious and the most easily missed"],
        ],
      },
      {
        type: "paragraph",
        text: "The standard treatment for drug-susceptible disease in a child is two months of four drugs (isoniazid, rifampicin, pyrazinamide and ethambutol) followed by four months of isoniazid and rifampicin — six months in total, extended to twelve months for tuberculous meningitis and bone disease, where a corticosteroid is added. The whole household is screened, an unvaccinated infant under five who is exposed receives isoniazid prophylaxis, and contact tracing is coordinated by the public health team, not by the ward.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "A positive tuberculin test in a BCG-vaccinated child is not proof of disease. BCG produces a small induration of a few millimetres that fades, whereas an interferon-gamma release assay is not affected; the diagnosis needs the symptoms or a compatible radiograph or a culture.",
      },

      { type: "heading", level: 2, text: "Worked example 3: fever in the returned traveller" },
      {
        type: "paragraph",
        text: "Fever within three months of a return from the tropics is treated as malaria until the films say otherwise, because Plasmodium falciparum can kill within 24 hours of the first rigors and is the commonest serious infection in this group. The history is structured by four questions: where, when, what were you doing, and were you taking your prophylaxis.",
      },
      {
        type: "table",
        headers: ["Diagnosis", "Where", "When", "The discriminating feature"],
        rows: [
          ["Malaria", "Sub-Saharan Africa, South Asia, South America", "7 days to 3 months after return", "Cyclical fever, rigors, headache, splenomegaly, thrombocytopenia, anaemia; three negative thick and thin films taken 12 to 24 hours apart do not exclude it"],
          ["Dengue", "Tropics and subtropics", "4 to 14 days", "Severe headache, retro-orbital pain, myalgia, a maculopapular rash, a falling platelet count with a rising haematocrit"],
          ["Enteric fever", "South Asia, sub-Saharan Africa", "7 to 21 days", "A slowly rising fever, relative bradycardia, abdominal pain, rose spots, a normal white count; it is diagnosed by blood culture"],
          ["Rickettsial infection", "Sub-Saharan Africa, the Mediterranean", "3 to 14 days", "An eschar at a tick bite with a fever, headache and a maculopapular rash"],
          ["Viral haemorrhagic fever", "Sub-Saharan Africa", "2 to 21 days", "Recent contact with a case, with a fever, sore throat, gastrointestinal bleeding and shock — an isolation and referral emergency"],
          ["Acute HIV", "Worldwide", "2 to 6 weeks", "A glandular-fever-like illness after a risk exposure, with a rash and mucocutaneous ulcers"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The four questions in the travel history are: where exactly, when was the return, what exposures (freshwater, animals, bites, food, insect bites), and was chemoprophylaxis taken and finished. A febrile child who took prophylaxis is not protected from the diagnosis — it is protected from the drugs having worked if it was stopped early.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Not notifying. Notification is the physician's duty on the clinical diagnosis, and failing to notify leaves the classroom, the nursery and the ward exposed while the case is being confirmed.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Missing the contact who needs the prophylaxis. The pregnant contact of rubella, the immunosuppressed contact of varicella and the neonate of a mother with chickenpox are the emergencies that arrive after the case, and the windows for immunoglobulin are measured in days.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating a BCG-vaccinated child's positive tuberculin test as tuberculosis without the disease. Infection is not disease, and unnecessary treatment exposes a child to hepatotoxic drugs for months.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Not asking about travel in a febrile child. Malaria is easily missed in the child who went to a low-endemic region in August and presented in February, and the first film is negative in a third of cases.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What is the difference between the incubation period and the infective period, and why does it matter?",
        answer: "The incubation period is the time from infection to symptoms, during which a contact is watched for disease; the infective period is the time during which a case can transmit, and it usually begins before the diagnosis can be made. It matters because the control measures — exclusion, isolation, prophylaxis — are timed from those two different clocks.",
        explanation: "The measles case is infective four days before the rash and excluded until four days after it.",
      },
      {
        type: "question",
        prompt: "How is a tuberculin test interpreted in a child who has had BCG, and why is an interferon-gamma release assay preferred?",
        answer: "An induration of 5 mm in an immunocompromised child or a close contact, and of 10 mm in all others, is positive; BCG produces only a small induration that fades, so a strongly positive test is usually infection. The interferon-gamma release assay is preferred because it is not confounded by prior BCG or by most environmental non-tuberculous mycobacteria.",
        explanation: "A positive test is evidence of infection and requires symptoms or a radiograph or a culture before a diagnosis of disease is made.",
      },
      {
        type: "question",
        prompt: "State the investigation of choice in a child with a fever three weeks after returning from sub-Saharan Africa.",
        answer: "Three thick and thin blood films for malaria, taken 12 to 24 hours apart, plus a full blood count for a platelet and haemoglobin fall, glucose, urea, creatinine and lactate for severe malaria, and blood cultures; if falciparum malaria is suspected or the child is unwell, intravenous artesunate is started without waiting.",
        explanation: "Fever within three months of a return from the tropics is malaria until three negative films say otherwise.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A child with a confirmed case of measles attended a class party two days before the rash appeared. Which statement about the classmates is correct?",
        options: [
          "They are at risk only after the child's rash appeared",
          "They are at risk because measles is infective from 4 days before the rash, and susceptible contacts should be offered MMR within 72 hours",
          "They are at risk only after the child's rash appeared and disappeared",
          "They need no action because the child is no longer infectious",
        ],
        correctIndex: 1,
        explanation: "Measles is infective from four days before to four days after the rash; the MMR given within 72 hours of contact protects a susceptible child, and immunoglobulin has a limited window.",
      },
      {
        type: "mcq",
        stem: "A 4-year-old with a cough for six weeks, which paroxysms and ends in a whoop, has a sibling of 5 weeks. What is the management of the sibling?",
        options: [
          "Nothing — the sibling is protected by maternal antibody",
          "A macrolide prophylaxis and the case treated with azithromycin or clarithromycin, with the case notified",
          "Intravenous ceftriaxone",
          "Isolation of the sibling only",
        ],
        correctIndex: 1,
        explanation: "Pertussis is treated with a macrolide, which also eradicates carriage, and the household — particularly the unimmunised infant — is given prophylaxis.",
      },
      {
        type: "mcq",
        stem: "A 2-year-old has a positive 12 mm tuberculin test after BCG, a normal examination and a normal radiograph. What is the correct interpretation?",
        options: [
          "Active pulmonary tuberculosis requiring four-drug therapy",
          "Infection without disease: the child needs a risk assessment, a history and an interval assessment rather than immediate treatment",
          "No infection — the test is a false positive from the BCG",
          "Tuberculous meningitis requiring twelve months of therapy",
        ],
        correctIndex: 1,
        explanation: "A positive test means infection; disease requires symptoms, a compatible radiograph or a culture, so the decision is a risk assessment, not reflex treatment.",
      },
      {
        type: "mcq",
        stem: "A 3-year-old has a fever of 39°C with rigors three weeks after returning from Nigeria and a platelet count of 40. What is the immediate management?",
        options: [
          "Three thick and thin films over the next two days, and oral antimalarials when the film is positive",
          "Malaria is assumed: films are sent, but intravenous artesunate is started if the child is unwell or falciparum malaria is suspected, with a glucose and a lactate",
          "Oral doxycycline and discharge",
          "Oral amoxicillin and review in a week",
        ],
        correctIndex: 1,
        explanation: "Severe malaria is treated with intravenous artesunate on suspicion, because the first film is negative in a third of cases and falciparum can kill within a day.",
      },
      {
        type: "mcq",
        stem: "Which exposure in a febrile traveller most strongly suggests dengue rather than malaria?",
        options: [
          "Splenomegaly with a normal platelet count",
          "Severe retro-orbital headache with a falling platelet count and a rising haematocrit",
          "A cyclical rigour pattern with a positive thick film",
          "An eschar with a maculopapular rash",
        ],
        correctIndex: 1,
        explanation: "Dengue produces capillary leak, which shows as a rising haematocrit with a falling platelet count and intense headache; cyclical rigors are malaria.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Infectious disease in childhood is managed on three clocks — incubation, prodrome and infectivity — and the physician's duties are to treat the child, to protect the susceptible contact and to notify the specified diseases. The exanthems are distinguished by the timing of the rash and the period of infectivity, and the contacts who matter are the pregnant, the immunosuppressed and the unimmunised infant. Tuberculosis in the child is a disease of recent infection that is lymphadenopathic rather than cavitating, often paucibacillary and culture-negative, and treated as a six-month four-drug regimen with household screening. And fever within three months of a return from the tropics is malaria until three negative films say otherwise.",
      },
      {
        type: "paragraph",
        text: "Next: the gut — gastroenteritis and its oral rehydration, and the chronic disease of the intestines, liver and pancreas of childhood.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 12 — Paediatric gastroenterology (fully authored)
// ---------------------------------------------------------------------------
function lesson12() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: manage acute gastroenteritis with oral rehydration and decide when a stool culture is needed; recognise the red flags of bilious vomiting, rectal bleeding and abdominal distension in the newborn and the infant; diagnose and manage cows' milk protein intolerance and coeliac disease; define constipation, separate idiopathic constipation from Hirschsprung disease, and manage soiling; distinguish ulcerative colitis from Crohn's disease in the young child; and recognise the four surgical emergencies that present with vomiting in the first eight weeks of life.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 3, 5 and 7, with PHYS 101 module 2 and PATH 201 module 2 — the gut physiology, the enzymes and the absorptive surface. The commonest symptoms of childhood are produced by the mechanisms of those lessons.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "paragraph",
        text: "The young infant's gut is an organ still under construction: the secretory IgA is naive, the small intestinal epithelium is still acquiring its enzymes, and the motility is immature. Add to that the enormous requirement per kilogram of lesson 3 and the child has a bowel that produces the same two symptoms — vomiting and diarrhoea — for three very different reasons: an organism that has damaged the epithelium, an immune reaction to a food protein, and an obstruction of the lumen. The first two are common and are treated by the mouth; the third is rare and is treated in theatre.",
      },
      {
        type: "definition",
        term: "Gastroenteritis",
        text: "A reduction in the consistency of stools and an increase in their frequency, with or without vomiting, fever and abdominal pain, caused by an infection of the gut — rotavirus and norovirus in the very young, Campylobacter and Salmonella in the older child, and Shigella or Giardia where appropriate. The illness is self-limiting and the danger is the water and electrolyte loss of lesson 7, not the number of stools.",
      },
      {
        type: "definition",
        term: "Coeliac disease",
        text: "An immune reaction to the gliadin fraction of gluten in a genetically predisposed child (HLA-DQ2 or DQ8), producing villous atrophy, crypt hyperplasia and lymphocytic infiltration of the small bowel, with malabsorption, faltering growth, iron-deficiency anaemia and irritability. It is the commonest cause of malabsorption in children in populations with a high wheat intake.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Bilious vomiting in a newborn is a surgical emergency until proven otherwise. It is the presentation of malrotation with a midgut volvulus, which is the one cause of bilious vomiting that can destroy the entire small intestine in hours, so it is never attributed to 'slight gastro-enteritis' in the first weeks of life.",
      },

      { type: "heading", level: 2, text: "Worked example 1: acute gastroenteritis" },
      {
        type: "table",
        headers: ["Assessment", "Findings", "Consequence"],
        rows: [
          ["Dehydration", "Graded as in lesson 7 — perfusion first, then the dry mucous membranes and the turgor", "Oral rehydration for the moderate, intravenous for the shocked, and nothing for the mild"],
          ["Stool character", "Watery and odourless (viral), bloody and mucoid (invasive bacterial), rice-water (cholera)", "Blood or mucus is an indication for a stool culture"],
          ["Stool culture", "Indicated for blood in the stool, a persistent diarrhoea, an immunocompromised child, a suspected outbreak, or a recent return from travel", "Campylobacter, Salmonella, Shigella and Escherichia coli O157 are cultured and reported to public health"],
          ["Antiemetic", "Ondansetron as a single oral dose in a child who is vomiting enough to prevent oral rehydration", "Increases the proportion rehydrated orally and reduces admission, with no effect on the course"],
          ["Antibiotics", "For cholera, for a systemic Shigella or Salmonella in the infant or the immunocompromised, for traveller's diarrhoea and for Giardia", "Antibiotics are withheld in suspected Escherichia coli O157 because they increase the risk of haemolytic uraemic syndrome"],
          ["Feeds", "Continues through the diarrhoea: breast milk, the normal formula, the normal diet", "Starvation and the historical 'clear fluids for 24 hours' slow recovery and prolong the diarrhoea"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "No drug should be given to a child to stop the diarrhoea. Loperamide and similar antimotility agents are not used in young children, because they retain the organism and toxin in the lumen and have caused ileus and death. The treatment is fluid, glucose and time.",
      },
      {
        type: "paragraph",
        text: "The follow-up after gastroenteritis is part of the management: a lactose intolerance of the damaged brush border settles in one to three weeks; a post-enteritis syndrome may persist; and a cows' milk protein intolerance may be unmasked. A diarrhoea that persists beyond two weeks is protracted, and requires the assessment of malabsorption and an invasion by a parasite.",
      },

      { type: "heading", level: 2, text: "Worked example 2: the chronic gut — allergy, coeliac and inflammatory disease" },
      {
        type: "table",
        headers: ["Condition", "Presentation", "Diagnosis and management"],
        rows: [
          ["Cows' milk protein intolerance", "A formula-fed infant from the first weeks, with blood or mucus in the stool, colic, eczema, vomiting and faltering growth", "Non-immunoglobulin E mediated, so skin-prick tests are negative; an elimination diet of an extensively hydrolysed or amino acid formula for two to four weeks, then a rechallenge; it is a diagnosis of exclusion"],
          ["Coeliac disease", "A child from 6 months with faltering growth, a distended abdomen, pale loose stool, irritability and iron-deficiency anaemia", "Total immunoglobulin A and tissue transglutaminase immunoglobulin A while on a normal gluten-containing diet; the diagnosis is confirmed by a duodenal biopsy, and the treatment is a lifelong gluten-free diet with a dietitian and a screening of first-degree relatives"],
          ["Chronic diarrhoea of toddlerhood", "A thriving 1 to 3 year old with two to six loose stools a day containing visible vegetable matter", "No investigation and no treatment; a reassurance of the family and normal growth are the diagnosis"],
          ["Lactose intolerance", "Bloating and watery diarrhoea after a gastroenteritis or in the adolescent", "Usually post-infectious and transient; a lactose-free diet for a few weeks and a breath hydrogen test where persistent"],
          ["Ulcerative colitis", "Bloody diarrhoea with mucus, urgency, tenesmus, abdominal pain, faltering growth, anaemia", "Continuous colonic disease with a crypt abscess; colonoscopy and biopsy; stool culture to exclude infection; 5-aminosalicylates, steroids, azathioprine, surgery"],
          ["Crohn's disease", "Right iliac fossa pain, weight loss, anorexia, delayed puberty, perianal disease, mouth ulcers, non-bloody diarrhoea", "Discontinuous transmural disease, skip lesions, granulomas, terminal ileal on endoscopy; magnetic resonance enterography; enteral nutrition, steroids, immunomodulators, biologics"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Rectal bleeding is not always cows' milk protein intolerance. An anal fissure is a small amount of bright blood with a painful stool; a polyp is a small amount with a hard stool; Meckel's diverticulum presents with painless maroon or dark red bleeding in a well child; and intussusception presents with the redcurrant jelly stool of a distressed infant.",
      },

      { type: "heading", level: 2, text: "Worked example 3: constipation, soiling and the surgical abdomen" },
      {
        type: "definition",
        term: "Idiopathic constipation",
        text: "Fewer than three complete stools a week with straining, pain or a hard stool, or a liquid stool leaking around a rectal mass of faeces — overflow soiling — in a child whose growth and examination are normal. The rectum has been stretched rather than obstructed, and the treatment is a disimpaction of the faecal mass followed by a maintenance stimulant.",
      },
      {
        type: "table",
        headers: ["Step", "What is done", "Practical points"],
        rows: [
          ["Disimpaction", "An escalating dose of a polyethylene glycol (macrogol 3350) with electrolytes, one to four days, until the mass is passed", "A softener alone will not empty a loaded rectum; senna is second-line; a suppository or enema is a step for the child who fails"],
          ["Maintenance", "Macrogol continued at a dose that produces one to two soft stools a day, for months rather than weeks", "Stopping early is the commonest cause of relapse; the dose is not reduced because the child is continent"],
          ["Behaviour and toilet training", "A toilet sitting after meals for five minutes, a footstool, a star chart, a bowel diary, and no punishment for a soiling", "Soiling is involuntary and a punishment makes it worse"],
          ["Diet", "Fluid, fibre and fruit; the evidence that fibre alone treats constipation is weak", "Fibre without a sufficient fluid worsens the stool"],
        ],
      },
      {
        type: "table",
        headers: ["Condition", "Age and presentation", "The finding that gives it away"],
        rows: [
          ["Malrotation with volvulus", "Newborn, sudden bilious vomiting and abdominal distension, often with blood in the stool", "A bilious vomiting in the first weeks; an upper gastrointestinal contrast is diagnostic, surgery is immediate"],
          ["Duodenal atresia", "Newborn, bilious vomiting with a scaphoid abdomen, and polyhydramnios antenatally", "A double bubble on the abdominal radiograph; associated with Down syndrome"],
          ["Meconium ileus", "Newborn, no meconium, distension, bilious vomiting", "The first stool is impacted meconium; the sweat test for cystic fibrosis is diagnostic"],
          ["Hypertrophic pyloric stenosis", "Three to six weeks, a first-born boy, projectile non-bilious vomiting after each feed", "A hypochloraemic, hypokalaemic metabolic alkalosis, a palpable olive, and a thickened pylorus on ultrasound"],
          ["Intussusception", "Three months to three years, paroxysmal colicky episodes of crying with pallor", "A sausage mass in the right upper quadrant, redcurrant jelly stool, and a target sign on ultrasound"],
          ["Hirschsprung disease", "Newborn who did not pass meconium in the first 48 hours, with distension and bilious vomiting", "A tight empty rectum, an explosive stool on the gloved finger, and an absent ganglion cells on a rectal suction biopsy"],
          ["Appendicitis", "The school-age child, with a central pain migrating to the right iliac fossa, anorexia and vomiting", "The pain precedes the vomiting; the younger the child the more atypical and the greater the perforation rate"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Calling bilious vomiting in a newborn simple gastro-enteritis. A volvulus in the first weeks is the one diagnosis whose delay is measured in hours and whose consequence is the loss of the entire small bowel, so it is a surgical review, not a fluid trial.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Giving antimotility agents, or starving the child during gastro-enteritis. The first retains the organism and the toxin in the lumen; the second prolongs the diarrhoea, because an unstimulated gut heals more slowly.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Punishing a child for soiling, or treating the constipation with a stool softener alone without disimpacting the loaded rectum. Both make the child worse and the family angry.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Missing coeliac disease in the child with growth faltering and iron deficiency. Tissue transglutaminase immunoglobulin A should be measured while the child is still eating gluten, and the biopsy taken before the gluten-free diet begins.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Which children with gastroenteritis need a stool culture taken?",
        answer: "A child with blood or mucus in the stool, a child whose diarrhoea persists beyond two weeks, an immunocompromised child, a suspected outbreak, or a child recently returned from travel.",
        explanation: "The culture identifies the organism that changes management or requires a public health action, and it excludes the invasive bacteria in which antibiotics may be withheld.",
      },
      {
        type: "question",
        prompt: "How is coeliac disease diagnosed in a child with growth faltering, anaemia and a distended abdomen?",
        answer: "By measuring the total immunoglobulin A and the tissue transglutaminase immunoglobulin A while the child is on a normal gluten-containing diet, and confirming with a duodenal biopsy; treatment is a lifelong gluten-free diet with a dietitian and screening of the first-degree relatives.",
        explanation: "Serology is negative if the child has started a gluten-free diet, so the diagnosis belongs before the diet.",
      },
      {
        type: "question",
        prompt: "A newborn did not pass meconium until day 4 and now has a distended abdomen with bilious vomiting and a tight, empty rectum. What is the likely diagnosis and the key test?",
        answer: "Hirschsprung disease — an aganglionic distal segment with a tight, empty rectum that is passed without difficulty by the examining finger. The diagnosis is with anorectal manometry and a rectal suction biopsy showing an absence of ganglion cells.",
        explanation: "Delayed meconium, distension and bilious vomiting in a newborn with a tight rectum is the presentation of the aganglionic segment.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A 9-month-old infant has had three days of watery diarrhoea and vomiting, is alert but has dry mucous membranes and reduced skin turgor. What is the correct management?",
        options: [
          "Intravenous fluids and a stool culture",
          "Oral rehydration solution 75 mL/kg over four hours with continued feeding and the maintenance fluid",
          "Stop all feeds for 24 hours and give water only",
          "Loperamide and oral antibiotics",
        ],
        correctIndex: 1,
        explanation: "Moderate dehydration in an alert infant is treated orally, over four hours, with the feeds continued; starving and antimotility agents are both harmful.",
      },
      {
        type: "mcq",
        stem: "A 6-week-old boy vomits projectile non-bilious feeds after every meal. What is the most likely metabolic disturbance?",
        options: [
          "A hyperchloraemic metabolic acidosis",
          "A hypochloraemic, hypokalaemic metabolic alkalosis from the loss of gastric acid",
          "A respiratory alkalosis",
          "A normal blood gas with a raised ammonia",
        ],
        correctIndex: 1,
        explanation: "Hypertrophic pyloric stenosis loses gastric hydrochloric acid, producing a hypochloraemic, hypokalaemic metabolic alkalosis with paradoxical aciduria.",
      },
      {
        type: "mcq",
        stem: "An 8-month-old infant has paroxysmal episodes of crying with pallor, a sausage mass in the right upper quadrant and a redcurrant jelly stool. What is the initial management?",
        options: [
          "Oral rehydration and observation on the ward for 24 hours",
          "An ultrasound to confirm, and an air or contrast enema reduction with surgical back-up",
          "Immediate laparotomy without imaging",
          "Antibiotics and intravenous fluids",
        ],
        correctIndex: 1,
        explanation: "Intussusception is diagnosed on ultrasound with the target sign, and is reduced with an air or contrast enema; surgery is reserved for a failed reduction, peritonitis or perforation.",
      },
      {
        type: "mcq",
        stem: "A 2-year-old has three loose stools a day containing peas, and is thriving at the 50th centile. What is the management?",
        options: [
          "Start a gluten-free diet",
          "Reassure the parents, explain the normal variation of toddler diarrhoea and review the growth",
          "Start a lactose-free diet for three months",
          "Send for a duodenal biopsy",
        ],
        correctIndex: 1,
        explanation: "A thriving toddler with loose stools containing visible vegetables has chronic diarrhoea of toddlerhood, which needs no investigation and no treatment.",
      },
      {
        type: "mcq",
        stem: "A 4-year-old with bloody mucous diarrhoea, weight loss and perianal skin tags is most likely to have which diagnosis?",
        options: [
          "Ulcerative colitis, because the blood means the disease is continuous colonic",
          "Crohn's disease, because the perianal disease and weight loss point to a transmural, discontinuous disease",
          "Cows' milk protein intolerance, because blood in the stool is always an allergy",
          "Anal fissures, because the blood is bright",
        ],
        correctIndex: 1,
        explanation: "Perianal disease, weight loss and delayed growth point to Crohn's disease; ulcerative colitis is continuous colonic with no transmural or perianal disease.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The two commonest paediatric symptoms — vomiting and diarrhoea — arise from infection, from an immune reaction to a food protein and from obstruction, and the first two are treated by the mouth while the third is treated in theatre. Gastroenteritis is rehydrated orally with 75 mL/kg over four hours with the feeds continued and no drug to stop the diarrhoea; the diseases that persist are coeliac, cows' milk protein intolerance and the inflammatory bowel diseases, all of which are diagnosed by a test rather than by an exclusion in the end. Constipation is a stretched rectum treated by disimpaction then maintenance with a softener, and soiling is involuntary overflow, not a behaviour problem — while bilious vomiting in a newborn, and the paroxysmal pain of an infant with a mass, are surgical emergencies.",
      },
      {
        type: "paragraph",
        text: "Next: the brain — the seizures of childhood, the child with headache, and the tumours that present with a squint.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 13 — Paediatric neurology & seizures (fully authored)
// ---------------------------------------------------------------------------
function lesson13() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: distinguish a seizure from epilepsy and classify a seizure as focal or generalised; name the epilepsy syndromes of childhood with their age, their semiology, their electroencephalogram and their prognosis; manage status epilepticus in the correct order with weight-based doses; recognise a child with a raised intracranial pressure and localise a posterior fossa tumour; distinguish migraine in a child from a tumour and state the red flags of a headache; assess the weak or floppy child and separate the central from the neuromuscular causes; and recognise the common movement disorders.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1, 2, 5, 6, with PHYS 101 module 1 and ANAT 101 module 5 — the neurone, the synapse, the reflex arc and the anatomy of the brain stem and cerebellum. A seizure is a paroxysmal discharge of cortical neurons, and a syndrome is a pattern of discharges with an age and an outcome.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "paragraph",
        text: "A seizure is a single event; epilepsy is a tendency, defined as two or more unprovoked seizures more than 24 hours apart, or one seizure with a predisposition to recur. In childhood the diagnosis is almost always a syndrome and not a single seizure, because the cortex of a child of one year, of ten and of fifteen discharge differently, mature in a sequence, and are vulnerable to different pathology at each stage. The syndrome — its age, its seizure type, its electroencephalogram and its developmental effect — determines both the treatment and the prognosis, which is why the correct action on a first seizure is a careful description, not a scan.",
      },
      {
        type: "definition",
        term: "Focal seizure",
        text: "A seizure that begins in one hemisphere: a focal aware seizure preserves consciousness and a focal impaired-awareness seizure does not. The symptoms localise — twitching of one hand, tingling of one lip, a rising epigastric sensation, a stereotyped automatism, or an unexplained taste or smell.",
      },
      {
        type: "definition",
        term: "Generalised seizure",
        text: "A seizure that begins in both hemispheres: absence (an abrupt arrest with an impairment of awareness lasting seconds), myoclonic (a brief jerk), tonic, clonic, tonic-clonic, and atonic. Loss of consciousness, a symmetrical motor event and an abrupt onset are the features.",
      },
      {
        type: "callout",
        variant: "info",
        text: "First aid for a seizure: note the time and the features, protect the head and the airway, leave the child to recover on their side, and do not restrain, do not insert anything into the mouth and do not give anything by mouth. A seizure lasting more than five minutes is status and needs treatment now.",
      },

      { type: "heading", level: 2, text: "Worked example 1: the syndromes of childhood epilepsy" },
      {
        type: "table",
        headers: ["Syndrome", "Age of onset", "Semiology", "Electroencephalogram", "Prognosis and treatment"],
        rows: [
          ["Childhood absence epilepsy", "3 to 10 years", "Staring spells of 5 to 20 seconds, dozens a day, no aura, no fall, complete recovery and no memory", "Generalised 3 per second spike and wave, provoked by hyperventilation", "Good prognosis, most remit by adolescence; ethosuximide, valproate or lamotrigine"],
          ["Benign childhood epilepsy with centrotemporal spikes", "4 to 10 years", "Facial sensorimotor seizures in sleep, hemifacial twitch, speech arrest", "Centrotemporal spikes in sleep", "Usually a single drug, often no drug; it resolves by adolescence"],
          ["Juvenile myoclonic epilepsy", "Adolescence", "Morning myoclonus, generalised tonic-clonic seizures after a late night and absent sleep", "Fast 4 to 6 per second polyspike and wave", "Lifelong; valproate or lamotrigine; sleep and alcohol trigger it"],
          ["Infantile spasms (West syndrome)", "3 to 9 months", "Spasms in clusters on waking, salaam or jackknife, regression of the smile and of tone", "Hypsarrhythmia — a chaotic, high-amplitude disorganised tracing", "Never benign: urgent treatment with vigabatrin or a corticosteroid and a magnetic resonance imaging"],
          ["Dravet syndrome", "First year", "Prolonged febrile seizures, then multiple seizure types with a slow development", "Generalised and focal abnormalities", "Poor prognosis; sodium channel-blocking antiepileptics worsen it; care is multidisciplinary"],
          ["Lennox-Gastaut syndrome", "2 to 5 years", "Tonic, atonic, myoclonic, absence, head drops and frequent injury", "Slow 2 per second spike and wave", "Difficult to control; ketogenic diet, vagal nerve stimulator and multiple drugs"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Infantile spasms are the most easily missed diagnosis in paediatrics, and the delay that matters is measured in weeks. A parent who says 'she goes rigid and drops her head, in bursts, after she wakes', with a loss of the smile, is describing spasms, and the response is an urgent electroencephalogram and referral, not reassurance.",
      },

      { type: "heading", level: 2, text: "Worked example 2: status epilepticus" },
      {
        type: "paragraph",
        text: "Status epilepticus is a seizure lasting beyond five minutes, or beyond thirty minutes as a time point beyond which the risk of neuronal injury and the difficulty of termination both rise. Management is a time-based sequence, with the clock started at the onset.",
      },
      {
        type: "table",
        headers: ["Time from onset", "Action", "Drug and dose"],
        rows: [
          ["Immediately", "Airway, breathing, circulation; oxygen; glucose on a finger-prick test; temperature; a pulse oximeter; a designated timekeeper", "Treat a hypoglycaemia with 2 mL/kg of 10 per cent dextrose intravenously"],
          ["0 to 10 minutes", "First-line benzodiazepine; repeat once at 10 minutes", "Buccal midazolam 0.5 mg/kg up to 10 mg, or intravenous lorazepam 0.1 mg/kg up to 4 mg"],
          ["10 to 30 minutes", "Second-line antiepileptic, given once the benzodiazepine has failed", "Intravenous levetiracetam 40 to 60 mg/kg up to 4.5 g, or fosphenytoin 20 mg phenytoin equivalents/kg, or phenytoin 20 mg/kg"],
          ["30 to 60 minutes", "Rapid sequence induction and admission to intensive care; the intubation itself may terminate the seizure", "Midazolam infusion or thiopentone, with continuous electroencephalogram monitoring"],
          ["Investigations", "Every child: glucose, electrolytes, calcium and magnesium, a full blood count, cultures; and a lumbar puncture where infection is possible", "Neuroimaging for a focal first seizure, a persistent focal deficit, a head injury, or a suspected raised intracranial pressure"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The child who stops fitting at the side of the road after two doses of benzodiazepine is still a child in status. Always take the child to hospital, always exclude hypoglycaemia and meningitis, and always ask a parent whether the event was focal, how long it lasted, and what the child did afterwards.",
      },

      { type: "heading", level: 2, text: "Worked example 3: the brain tumour, the headache and the weak child" },
      {
        type: "paragraph",
        text: "The central nervous system tumours of childhood are predominantly posterior fossa and glial, unlike the adult glioblastoma and metastasis, so the presentation is a mechanical and not an epileptic one. A raised intracranial pressure in a child is signalled by a headache that is worst on waking, vomiting in the morning, irritability, a new squint, a progressive head circumference crossing centiles, a sunset sign of the eyes, or a bradycardia with a rising blood pressure.",
      },
      {
        type: "table",
        headers: ["Location", "Frequency", "Presenting features"],
        rows: [
          ["Cerebellar vermis (medulloblastoma)", "Commonest", "Truncal ataxia, a child who cannot sit or walk straight, vomiting and signs of raised pressure"],
          ["Cerebellar hemisphere (astrocytoma)", "Common", "Limb ataxia of one side, nystagmus, then pressure signs"],
          ["Brain stem (glioma)", "Frequent", "Cranial nerve palsies with a squint and an abnormal gait, pyramidal tract signs, an ataxia; the mass is often silent until it is large"],
          ["Supratentorial (craniopharyngioma, ependymoma)", "Less frequent", "Seizures, a visual field loss and endocrine failure — the bitemporal hemianopia of the chiasm"],
        ],
      },
      {
        type: "table",
        headers: ["Red flag in a headache", "Why it matters"],
        rows: [
          ["Worst on waking, or waking the child from sleep", "The raised intracranial pressure of the recumbent position"],
          ["Vomiting in the morning without abdominal pain", "A pressure effect on the floor of the fourth ventricle"],
          ["Progressive, over weeks", "A mass or a chronic disease, not a migraine"],
          ["A squint, a visual field loss, a blurred disc or a sunset sign", "A third nerve, an optic pathway or a pressure sign"],
          ["Focal neurology, a change in behaviour or personality, or a seizure", "Cortical involvement"],
          ["A fever, a stiff neck or a rash", "Meningitis and encephalitis, not a primary headache"],
        ],
      },
      {
        type: "paragraph",
        text: "Migraine in a child is bilateral, short (one to two hours rather than four), accompanied by pallor, nausea and irritability, relieved by sleep, and often accompanied by a periodic syndrome such as cyclical vomiting, abdominal migraine or benign paroxysmal vertigo. Tension-type headache is band-like, later in the day, and associated with stress and screen use. Neither is diagnosed in the presence of any red flag, and the child with any red flag has an ophthalmic and neurological examination, an imaging where indicated, and a measurement of the blood pressure.",
      },
      {
        type: "paragraph",
        text: "The weak child is separated by the pattern: a central cause gives a diffuse hypotonia with a delay and often a normal or brisk peripheral reflex, while a neuromuscular cause gives a proximal weakness with a delayed or absent reflex, a Gowers' sign, a tongue fasciculation or a myopathic face. A post-infectious ascending weakness with an absent reflex is Guillain-Barré syndrome, and its respiratory function is measured with the vital capacity, admitted, and treated with intravenous immunoglobulin.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Diagnosing absence seizures as daydreaming or inattention. The clue is the frequency and the completeness: dozens of short staring spells a day, each terminated by a call to the child, with no memory of the episode, and provoked by hyperventilation.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Reassuring a child with a progressive morning headache and a squint. The combination is a posterior fossa mass until a scan says otherwise, and the examination includes the fundi, the visual fields and the blood pressure.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Giving a benzodiazepine but not timing the seizure or checking the glucose. The three things most often forgotten in a seizure are the time, the glucose and the temperature, and a prolonged seizure in an unrecognised hypoglycaemia is a common and avoidable sequence.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Using valproate in a girl who is fertile, or sodium channel blockers in Dravet syndrome. Valproate is teratogenic and is avoided in pregnancy-capable patients where an alternative works; lamotrigine, carbamazepine and phenytoin worsen Dravet.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What is the definition of epilepsy and of status epilepticus, and why does the distinction matter?",
        answer: "Epilepsy is two or more unprovoked seizures more than 24 hours apart, or one seizure with a propensity to recur. Status epilepticus is a seizure of more than five minutes, and the distinction matters because the probability of spontaneous termination falls and the risk of injury, aspiration and neuronal injury rises the longer the seizure persists.",
        explanation: "The clock in status is what drives the treatment sequence.",
      },
      {
        type: "question",
        prompt: "Describe the semiology, the electroencephalogram and the prognosis of infantile spasms.",
        answer: "Spasms in clusters on waking between 3 and 9 months, of salaam or jackknife type, with regression of the smile and of motor skills, and a hypsarrhythmic electroencephalogram; it is never benign, needs urgent treatment with vigabatrin or a corticosteroid, and requires a magnetic resonance imaging for the underlying cause.",
        explanation: "The mistake is to treat the spasms as a normal infant movement or as benign myoclonus.",
      },
      {
        type: "question",
        prompt: "Which six features in a child's headache require investigation rather than reassurance?",
        answer: "A headache worst on waking or waking the child from sleep, morning vomiting, a progressive course, a squint or a visual field loss or a blurred disc, focal neurology or a change in personality, and a fever with neck stiffness.",
        explanation: "These are the features of a raised intracranial pressure or an infection, and each mandates an examination of the fundi and imaging where indicated.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A 6-year-old has dozens of episodes a day of staring, each lasting about 10 seconds, with no aura, no fall and no memory of the episode. What is the likely diagnosis?",
        options: [
          "Temporal lobe focal seizures",
          "Childhood absence epilepsy with a generalised 3 per second spike and wave",
          "Daydreaming and inattention",
          "Juvenile myoclonic epilepsy",
        ],
        correctIndex: 1,
        explanation: "Frequent short staring spells with no memory and no aura are typical absences, and hyperventilation on electroencephalogram will provoke the spike and wave.",
      },
      {
        type: "mcq",
        stem: "A convulsing child has been fitting for eight minutes and has received two adequate doses of buccal midazolam. What is the next step?",
        options: [
          "A further dose of the same benzodiazepine",
          "Intravenous levetiracetam 40 to 60 mg/kg, with the airway protected and the glucose checked",
          "Oral phenytoin",
          "Wait a further 20 minutes before the next drug",
        ],
        correctIndex: 1,
        explanation: "Benzodiazepine-resistant status moves to a second-line antiepileptic — levetiracetam, fosphenytoin or phenytoin — while the airway, breathing and circulation are supported.",
      },
      {
        type: "mcq",
        stem: "A 3-year-old has a two-month history of a morning headache with vomiting, a new squint and a head circumference that has crossed two centiles. What is the most likely anatomical site?",
        options: [
          "The cerebral cortex",
          "The posterior fossa, where a medulloblastoma or an astrocytoma raises the intracranial pressure early",
          "The spinal cord",
          "The pituitary stalk",
        ],
        correctIndex: 1,
        explanation: "The posterior fossa tumours of childhood obstruct the fourth ventricle and raise the pressure early, giving morning headache, vomiting, a squint and, in the infant, a rising head circumference.",
      },
      {
        type: "mcq",
        stem: "A 4-year-old has three weeks of a progressive headache, a drifting right eye and a reduced right visual field. Which examination is most likely to localise the disease?",
        options: [
          "A measurement of the deep tendon reflexes",
          "Fundoscopy for a blurred optic disc and visual field testing, because the lesion is on the optic pathway or the third nerve",
          "A Romberg's test",
          "A cutaneous light reflex",
        ],
        correctIndex: 1,
        explanation: "A squint and a field loss point to the optic pathway and the third nerve, and both are localising findings that demand an urgent scan.",
      },
      {
        type: "mcq",
        stem: "A 5-year-old has a three-week ascending weakness with absent knee and ankle reflexes, after a recent diarrhoeal illness. What is the risk that must be monitored?",
        options: [
          "A spinal cord compression",
          "Respiratory failure — the vital capacity and the respiratory rate are monitored and intravenous immunoglobulin is given",
          "A demyelinating optic neuritis",
          "A risk of status epilepticus",
        ],
        correctIndex: 1,
        explanation: "Guillain-Barré syndrome in a child is a post-infective ascending weakness with areflexia; the danger is the respiratory muscle weakness, managed with monitoring, immunoglobulin and intensive care if the vital capacity falls.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "A seizure is an event and epilepsy is a tendency, and in childhood the useful diagnosis is the syndrome: absence epilepsy with its three-per-second spike and wave, centrotemporal spikes in a child with sensorimotor seizures in sleep, juvenile myoclonic epilepsy in a teenager who seizes after a late night, and infantile spasms, which are never benign and need a same-week electroencephalogram. Status epilepticus is a time-based sequence — benzodiazepine, then a second-line antiepileptic, then intensive care — and hypoglycaemia and meningitis are excluded in every case. The headache of a child is migraine when it is bilateral, short and relieved by sleep, and it is a tumour when it wakes the child, is progressive, or is accompanied by a squint or a field loss.",
      },
      {
        type: "paragraph",
        text: "Next: the emergencies that arrive in the ambulance — anaphylaxis, choking, poisoning and burns.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 14 — Paediatric emergencies (fully authored)
// ---------------------------------------------------------------------------
function lesson14() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: apply the airway-breathing-circulation-disability-exposure sequence and the paediatric triangle to any acutely ill child; estimate a child's weight and give the commonest emergency drugs by weight; manage anaphylaxis with adrenaline by intramuscular injection; relieve an obstructed airway in an infant and in a child; take a structured approach to the poisoned child; resuscitate a burn, including the fluid prescription that a child's maintenance adds; and manage the near-drowning and the polytrauma of Waddell's triad without secondary injury.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 5, 6 and 7, with PHYS 101 module 1 and SURG 301 module 1 — the shock physiology, the respiratory mechanics and the resuscitation of the adult. Every principle in this lesson is the adult emergency rescale to a weight.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "paragraph",
        text: "A child compensates. A blood pressure that is normal or high in a child who is grey, mottled and tachycardic is not reassuring — it is a compensated shock, and the decompensation from compensation to hypotension is abrupt and late. The child is also proportionally larger in surface area, so it cools rapidly, and its head is proportionally larger, so its liver is vulnerable and its brain is the commonest site of the injury. The paediatric triangle is the tool that makes this visible at the door: the appearance, the work of breathing and the circulation to the skin, before the vital signs are taken.",
      },
      {
        type: "definition",
        term: "Weight estimation",
        text: "The length-based or formula-based estimate that drives every paediatric dose. The Advanced Paediatric Life Support formula for a child of 1 to 10 years is (age in years + 4) x 2 kg, and the anchors are about 3.5 kg at birth, 10 kg at one year, 15 kg at three years and 20 kg at six years. The Broselow tape is preferred in a resuscitation area because it also gives the equipment and the drug volumes.",
      },
      {
        type: "table",
        headers: ["Drug", "Indication", "Dose in a child"],
        rows: [
          ["Adrenaline", "Anaphylaxis, cardiac arrest", "0.01 mg/kg of the 1 in 1000 solution intramuscularly (0.01 mL/kg), up to 0.5 mg; 0.01 mg/kg of 1 in 10 000 intravenously in arrest"],
          ["Isotonic crystalloid", "Shock, sepsis, anaphylaxis", "10 to 20 mL/kg boluses, with reassessment after each"],
          ["Glucose 10 per cent", "Hypoglycaemia", "2 mL/kg (0.2 g/kg) intravenously"],
          ["Naloxone", "Opioid poisoning", "10 micrograms/kg intravenously, titrated, repeated to a total of 2 mg"],
          ["Amiodarone", "Refractory shockable arrest rhythm", "5 mg/kg intravenously"],
          ["Defibrillation", "Ventricular fibrillation or pulseless ventricular tachycardia", "4 J/kg, then 4 J/kg again, increasing to a maximum of 10 J/kg or the adult dose"],
          ["Hydrocortisone", "Second-line in anaphylaxis, and in adrenal insufficiency", "4 mg/kg intravenously"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Never quibble over an exact weight in a resuscitation. Use the tape, estimate and go. A dose that is slightly too large is a far smaller risk than a child with a shockable arrhythmia to whom no adrenaline was given because the calculation was not finished.",
      },

      { type: "heading", level: 2, text: "Worked example 1: anaphylaxis" },
      {
        type: "paragraph",
        text: "Anaphylaxis is an acute, rapid, life-threatening hypersensitivity reaction with an airway, a breathing or a circulation compromise, usually with a skin or mucosal manifestation. The diagnosis is clinical: a sudden onset with an exposure — a peanut, a bee sting, a drug, latex — and a wheeze, a stridor, an angio-oedema, a urticaria, a hypotension, or an unexplained persistent vomiting and abdominal pain. It is not necessary to have every feature, and it is not necessary to have skin findings.",
      },
      {
        type: "table",
        headers: ["Action", "Detail"],
        rows: [
          ["Call for help and remove the trigger", "Stop any infusion or the sting is scraped, never squeezed; keep the child flat with the legs raised"],
          ["Adrenaline", "0.01 mg/kg of the 1 in 1000 solution intramuscularly into the lateral thigh, up to 0.5 mg, repeated every five minutes as needed; it is the first and the only first-line drug"],
          ["Airway and oxygen", "A high-flow oxygen through a mask, and a clinician experienced in the paediatric airway is called before the swelling arrives"],
          ["Fluid", "20 mL/kg of an isotonic crystalloid bolus, repeated, for the child with a poor perfusion"],
          ["Adjuncts", "An antihistamine and hydrocortisone after the adrenaline, for the cutaneous or the prolonged features — not instead of it"],
          ["Observation", "A biphasic reaction in up to a fifth of children, so at least 6 to 12 hours of observation before discharge, and a prescription, a training session and an allergy referral for every child who needed adrenaline"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Standing or sitting a child with anaphylaxis up, or walking them into a coffee room, has preceded sudden deaths. The child lies flat with the legs raised, is not left alone, is not sat in a chair, and does not walk to the toilet. Adrenaline is given when the diagnosis is suspected, not when the family has finished describing the food.",
      },

      { type: "heading", level: 2, text: "Worked example 2: the obstructed airway" },
      {
        type: "paragraph",
        text: "A choking child who is coughing effectively is left to cough — a bystander does nothing but encourage. A child who cannot cough, who cannot vocalise, or who has a silent chest is treated immediately.",
      },
      {
        type: "table",
        headers: ["Age", "Conscious", "If the child becomes unresponsive"],
        rows: [
          ["Infant under 1 year", "Five back blows between the shoulder blades with the head lower than the chest, then five chest thrusts with two fingers on the lower sternum; alternate five and five", "Start chest compressions in the two-finger or two-thumb technique; open the airway and look for the object at each ventilation, and remove a visible object with a single finger sweep"],
          ["Child over 1 year", "Five back blows, then five abdominal thrusts with a fist above the navel and below the xiphisternum; alternate five and five", "Start cardiopulmonary resuscitation, and the sequence is identical to the adult; the airway is opened and inspected at each ventilation"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "A blind finger sweep is forbidden, an abdominal thrust is used in the older child only, and a chest thrust is used in the infant rather than an abdominal thrust, because the infant's liver is large and unprotected and an abdominal thrust would rupture it.",
      },

      { type: "heading", level: 2, text: "Worked example 3: poisoning" },
      {
        type: "paragraph",
        text: "The approach to the poisoned child is the airway, the breathing, the circulation, the glucose and the electrocardiogram before the toxidrome and the poison, and is protected by the duty of the doctor to consult a poison centre for every significant ingestion. The commonest poisons in a child are iron tablets, paracetamol, tricyclic antidepressants, household cleaning products and the parent's medicines, and the history from a teenager may be deliberately incomplete.",
      },
      {
        type: "table",
        headers: ["Poison", "Features", "Antidote or action"],
        rows: [
          ["Paracetamol", "Nothing for 24 hours, then a nausea, a right upper quadrant pain, an encephalopathy and a coagulopathy", "N-acetylcysteine, effective within 8 hours of the ingestion whatever the reported dose; check the level at 4 hours"],
          ["Iron", "Nausea, vomiting, haematemesis, a shock, a metabolic acidosis and a late intestinal stricture", "Decontamination, desferrioxamine for the severe case, an abdominal radiograph for unabsorbed tablets"],
          ["Salicylate", "Tinnitus, a tachypnoea, a respiratory alkalosis with a metabolic acidosis, a hypoglycaemia and a fever", "Urinary alkalinisation and haemodialysis for the severe case"],
          ["Tricyclic antidepressants", "A dry mouth, a dilated pupil, an anticholinergic delirium and a wide QRS on the electrocardiogram", "Sodium bicarbonate 8.4 per cent for a QRS wider than 100 milliseconds"],
          ["Opioids", "A pin-point pupil, a respiratory depression and a coma", "Naloxone in small titrated boluses of 10 micrograms/kg, with the risk of precipitation of an acute withdrawal"],
          ["Alcohols and glycols", "An inebriation, an osmolar gap, a metabolic acidosis, oxalate crystals in urine", "Fomepizole and haemodialysis for the glycols"],
          ["Button battery", "A brown discharge, chest pain, a cough after an oesophageal impaction", "A time-critical emergency: a radiograph, an urgent removal within two hours, and honey 10 mL every 10 minutes on the way if the child is over one year"],
          ["Corrosives", "An oropharyngeal burn with drooling and an airway risk", "No emetic and no charcoal; endoscopy for the significant ingestion"],
        ],
      },
      {
        type: "paragraph",
        text: "Activated charcoal is used for a poisonous ingestion that is carbon-containing, that is recent and that is within one hour, only in a child with a protected airway, and it does not bind metals, alcohols or corrosives. Gastric lavage, syrup of ipecac and salt-water induction have no place in paediatric poisoning. The psychiatric assessment of the adolescent, and the safeguarding assessment of the pre-school child whose ingestion repeated, are part of the treatment.",
      },

      { type: "heading", level: 2, text: "Worked example 4: burns, near-drowning and major trauma" },
      {
        type: "table",
        headers: ["Emergency", "Key assessment", "Key management"],
        rows: [
          ["Burns", "Lund and Browder body surface area — the child's head is proportionally much larger and the Wallace rule of nines overestimates it; exclude the simple erythema", "Twenty minutes of running water within three hours; 4 mL/kg per per cent of body surface area for a burn over 10 per cent, half in the eight hours from the time of burn; add a maintenance fluid with dextrose in a child under 30 kg; a burn with singed nasal hair, hoarseness or soot is an airway burn"],
          ["Near-drowning", "The submersion time and the neurological state predict the outcome more than the water", "Rescue with the cervical spine protected; rescue breaths before compressions in the drowned child, because the asphyxia is the arrest; the water is aspirated, not drunk, and the lung is managed for an acute respiratory distress syndrome; hypothermia is rewarmed actively"],
          ["Major trauma", "Waddell's triad — the head injury, the intra-abdominal injury and the femoral fracture — because a small child's liver and spleen are unprotected", "Airway with the cervical spine immobilised, oxygen, control the haemorrhage, blood 10 mL/kg and tranexamic acid; prevent the secondary injury — hypoxia, hypotension, hypothermia — and do not hyperventilate the head-injured child"],
          ["Scald and inflicted injury", "A splash with a well-demarcated border in a mobile child is accidental; a stocking or glove distribution, a sharply demarcated immersion, a cigarette or an iron burn, or a delayed presentation is inflicted", "The same safeguarding duty as elsewhere: document, refer and consult, and never let a burn be treated without the history being written in the carer's own words"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "A child who needs emergency care has a safeguarding assessment, not because the accident is disbelieved but because the alternative is that a child is harmed again with a better story. The most commonly missed inflicted injuries are the scald and the head injury in a pre-mobile infant.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Withholding or delaying adrenaline in anaphylaxis until the child is hypotensive. Hypotension is the last event in the cascade of an anaphylaxis, and the mortality is almost entirely in the delays; adrenaline is given intramuscularly into the thigh on suspicion.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Resuscitating a burn with the adult Parkland figure alone. A young child needs the burn fluid plus a maintenance fluid containing glucose, because its glycogen stores are small and a saline-only resuscitation produces a hypoglycaemia within hours.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Giving rescue breaths last in the drowned child, or using abdominal thrusts to expel water from the lungs. The arrest in a near-drowning is hypoxic from aspiration, so the breaths come first, abdominal thrusts are contraindicated, and aspiration of a gastric content is the complication of the vomiting.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Giving insulin, epinephrine, naloxone or an antiarrhythmic for a child whose arrest is a hypoxic bradycardia. The commonest paediatric arrest is a respiratory arrest, and the treatment is ventilation, oxygenation and then the rhythm-specific drug.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why is a normal blood pressure not reassuring in an acutely ill child?",
        answer: "Because a child maintains the blood pressure by vasoconstriction and tachycardia until the compensation fails, so the hypotension is a late and terminal sign; the signs that matter earlier are the appearance, the work of breathing and the circulation to the skin — the capillary refill, the peripheral temperature and the colour.",
        explanation: "Waiting for the hypotension before giving fluid is waiting for the collapse.",
      },
      {
        type: "question",
        prompt: "State the dose and the route of adrenaline for a 20 kg child with anaphylaxis, and the immediate position.",
        answer: "Adrenaline 0.2 mg (0.2 mL of the 1 in 1000 solution, which is 0.01 mg/kg) intramuscularly into the lateral thigh, repeated every five minutes as needed, with the child lying flat and the legs raised, high-flow oxygen and a 20 mL/kg crystalloid bolus for a poor perfusion.",
        explanation: "The intramuscular thigh route is faster and safer than an intravenous route in the community or the emergency department.",
      },
      {
        type: "question",
        prompt: "How is the fluid for a 12 kg child with a 20 per cent burn calculated?",
        answer: "Total burn fluid is 4 mL x 12 kg x 20 = 960 mL, of which half is given in the first eight hours from the time of the burn and half over the next 16 hours, and — because the child is under 30 kg — a maintenance fluid containing dextrose is added, at 4 mL/kg/hour for the first 10 kg plus 2 mL/kg/hour for the next 2 kg, which is 44 mL/hour.",
        explanation: "The child needs both the burn replacement and the maintenance fluid, and the clock starts at the time of the burn, not the time of arrival.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A 25 kg child has eaten a biscuit containing peanut and has a stridor, a wheeze and a urticarial rash. What is the first treatment?",
        options: [
          "Intravenous adrenaline 0.01 mg/kg",
          "Intramuscular adrenaline 0.01 mg/kg of the 1 in 1000 solution into the thigh, lying flat with the legs raised",
          "An intravenous antihistamine and oral prednisolone",
          "Nebulised salbutamol and observation for an hour",
        ],
        correctIndex: 1,
        explanation: "Anaphylaxis is treated with intramuscular adrenaline into the thigh as the first-line drug, with the child lying flat, and antihistamines and steroids are adjuncts rather than first-line.",
      },
      {
        type: "mcq",
        stem: "A 9-month-old is choking on a grape and cannot cry or cough. What is the correct first action?",
        options: [
          "A blind finger sweep of the mouth",
          "Five back blows then five chest thrusts, alternating, with the infant's head lower than the chest",
          "Five abdominal thrusts",
          "Cardiopulmonary resuscitation immediately",
        ],
        correctIndex: 1,
        explanation: "For an infant under one year the sequence is five back blows then five chest thrusts; abdominal thrusts risk a liver injury, and a blind finger sweep may push the object further.",
      },
      {
        type: "mcq",
        stem: "A 3-year-old has taken 12 paracetamol tablets from a grandmother's handbag four hours ago and is asymptomatic. What is the correct management?",
        options: [
          "Induce vomiting at home and observe",
          "Take the child to hospital for a four-hour plasma paracetamol concentration, and give N-acetylcysteine if the level is above the treatment line",
          "Observe for 24 hours since the child is asymptomatic",
          "Give activated charcoal only, regardless of the airway",
        ],
        correctIndex: 1,
        explanation: "Paracetamol is asymptomatic for the first hours and the antidote is effective if given within eight hours of the ingestion; the level at four hours against the treatment line determines the treatment.",
      },
      {
        type: "mcq",
        stem: "A 14 kg child has a scald to the whole of the anterior trunk and the whole of the left upper limb, and is otherwise well. Which statement about the fluid resuscitation is correct?",
        options: [
          "The Wallace rule of nines is accurate for a child and the fluid is 4 mL x 14 x 18",
          "The Lund and Browder chart is used because a child's head is proportionally larger, and the fluid is 4 mL x 14 kg x the calculated percentage, half in the first eight hours",
          "A burn under 10 per cent needs no fluid and no analgesia",
          "The whole body surface is used for the calculation",
        ],
        correctIndex: 1,
        explanation: "Children are measured on Lund and Browder, and the burn fluid is 4 mL per kilogram per per cent with half in the first eight hours; a maintenance fluid with dextrose is added in a small child.",
      },
      {
        type: "mcq",
        stem: "A 4-year-old has a scalded, sharply demarcated stocking distribution to one foot and a delayed presentation with no explanation. What is the appropriate action?",
        options: [
          "Treat the burn and discharge with an outpatient dressing",
          "Document the history in the carer's own words, examine the child fully, and consult the safeguarding lead and refer to children's social care",
          "Ask the parents to sign a statement that the burn was accidental",
          "Discharge, because a burn is a burn whichever the cause",
        ],
        correctIndex: 1,
        explanation: "A stocking or immersion pattern and a delayed presentation raise the suspicion of inflicted injury, and the response is documentation, safeguarding referral and an examination — not a discharge.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The acutely ill child is assessed by the triangle, resuscitated by the weight, and treated on the assumption that compensation will fail without warning: hypotension is late, hypothermia is rapid and a hypoglycaemia is one small child's ambulance ride away. Anaphylaxis is adrenaline into the thigh and the child lying flat; an obstructed airway is back blows and chest thrusts in the infant and abdominal thrusts in the child; a poisoned child is an airway, an electrocardiogram and a glucose before a toxidrome, with the specific antidote; and a burn is a Lund and Browder calculation with a maintenance fluid added, a burn with a mismatching history is a safeguarding referral, and a drowned child's resuscitation begins with breaths.",
      },
      {
        type: "paragraph",
        text: "The rest of the paediatric spine — renal, endocrine, haematology and oncology, neurodisability, adolescent health and palliative care — follows the same pattern: a real concept, a prerequisite chain and a tracked placeholder awaiting its author.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Module 1 SBA items — one per concept, authored and machine-checked.
// ---------------------------------------------------------------------------
const MODULE_ONE_SBAS: SbaSeed[] = [
  {
    slug: "paediatrics-child-health--growth-and-development--sba",
    concept: "growth-and-development",
    stem: "A child's weight has crossed two centile spaces downwards over a year while the height has tracked along its centile. Which mechanism does this pattern indicate?",
    options: [
      "A disorder of the growth hormone axis",
      "Inadequate intake, because weight falls first while length is preserved in nutritional failure",
      "A skeletal dysplasia",
      "Constitutional tall stature",
    ],
    correctAnswer: "Inadequate intake, because weight falls first while length is preserved in nutritional failure",
    explanation:
      "Energy deprivation reduces weight while linear growth is preserved; disorders of growth hormone, the thyroid or the bones reduce height. The immediate assessment is a feeding and stool history.",
    difficulty: "easy",
  },
  {
    slug: "paediatrics-child-health--newborn-assessment--sba",
    concept: "newborn-assessment",
    stem: "A 6-day-old infant is jaundiced, has pale stools and dark urine. What is the diagnosis that must be excluded first?",
    options: [
      "Physiological jaundice of the newborn",
      "Biliary atresia, which needs an early Kasai procedure",
      "Breast milk jaundice",
      "Gilbert syndrome",
    ],
    correctAnswer: "Biliary atresia, which needs an early Kasai procedure",
    explanation:
      "Conjugated or prolonged jaundice with pale stools and dark urine in the first weeks is biliary obstruction until proven otherwise, and the Kasai portoenterostomy is far more successful before 8 weeks of age.",
    difficulty: "medium",
  },
  {
    slug: "paediatrics-child-health--infant-nutrition-ftt--sba",
    concept: "infant-nutrition-ftt",
    stem: "Which combination of findings defines failure to thrive in an infant?",
    options: [
      "A single weight below the 50th centile",
      "A weight falling across two centile spaces, or a weight for height below the expected range, with length preserved",
      "A height below the 2nd centile alone",
      "A head circumference below the 25th centile",
    ],
    correctAnswer: "A weight falling across two centile spaces, or a weight for height below the expected range, with length preserved",
    explanation:
      "Failure to thrive is diagnosed on the trajectory across centiles, and a weight that falls while the length tracks its centile points to intake rather than to growth or absorption.",
    difficulty: "easy",
  },
  {
    slug: "paediatrics-child-health--immunisation-childhood--sba",
    concept: "immunisation-childhood",
    stem: "A child is brought for a routine vaccination with a runny nose and a temperature of 37.5°C. What is the correct management?",
    options: [
      "Postpone the vaccination until the child is completely well",
      "Vaccinate — a minor illness without fever and a low-grade temperature are not contraindications",
      "Give only the inactivated vaccines on this visit",
      "Refer to a paediatrician for advice",
    ],
    correctAnswer: "Vaccinate — a minor illness without fever and a low-grade temperature are not contraindications",
    explanation:
      "The only absolute contraindication is anaphylaxis to a previous dose or a component. Postponing for a minor illness is the commonest way a child is left unprotected.",
    difficulty: "easy",
  },
  {
    slug: "paediatrics-child-health--febrile-child-infections--sba",
    concept: "febrile-child-infections",
    stem: "A 3-year-old has a fever of 39°C, cold peripheries, a capillary refill time of 3 seconds and a spreading purpuric rash. What is the immediate management?",
    options: [
      "Oral antibiotics and a review in the morning",
      "Parenteral benzylpenicillin or ceftriaxone and urgent transfer to hospital for meningococcal septicaemia",
      "An antipyretic and cool sponging",
      "A throat swab and watchful waiting",
    ],
    correctAnswer: "Parenteral benzylpenicillin or ceftriaxone and urgent transfer to hospital for meningococcal septicaemia",
    explanation:
      "A fever with a non-blanching purpuric rash, cold peripheries and a prolonged capillary refill is meningococcal septicaemia until proven otherwise, and antibiotics are given before the diagnosis is confirmed.",
    difficulty: "medium",
  },
  {
    slug: "paediatrics-child-health--development-behaviour-safeguarding--sba",
    concept: "development-behaviour-safeguarding",
    stem: "An 18-month-old who had a vocabulary of 15 words at 18 months has lost them and no longer responds to name. What is the first investigation?",
    options: [
      "A cranial MRI scan",
      "A formal hearing test",
      "A blood lead level",
      "An electroencephalogram as the first test",
    ],
    correctAnswer: "A formal hearing test",
    explanation:
      "Regression of language is a neurological red flag, and the first test is a hearing assessment because deafness both mimics and causes language regression; imaging and EEG follow if the assessment demands them.",
    difficulty: "medium",
  },
];

// ---------------------------------------------------------------------------
// Deeper modules 2-5: a real concept spine, tracked-placeholder lessons.
// ---------------------------------------------------------------------------
const DEEPER_LESSONS: LessonSeed[] = [
  // --- M2 Neonatal medicine & congenital disease ---
  { title: "Neonatal resuscitation & transitional problems", module: 2, estimatedMinutes: 35, authored: true, concept: { title: "Neonatal resuscitation", slug: "neonatal-resuscitation", summary: "The newborn resuscitation algorithm driven by the heart rate, airway positioning and inflation breaths, chest compressions and drugs, and the common neonatal presentations that follow poor transition.", blooms: "apply", minutes: 35, prereq: ["newborn-assessment"] }, content: lesson8() as never },
  { title: "Respiratory distress in the newborn", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Respiratory distress of the newborn", slug: "neonatal-respiratory-distress", summary: "Surfactant deficiency and its treatment, transient tachypnoea of the newborn, meconium aspiration, diaphragmatic hernia and persistent pulmonary hypertension.", blooms: "analyze", minutes: 40, prereq: ["neonatal-resuscitation"] }, content: { blocks: [] } },
  { title: "Neonatal jaundice & haemolytic disease", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Neonatal hyperbilirubinaemia", slug: "neonatal-jaundice", summary: "The causes of unconjugated and conjugated hyperbilirubinaemia, rhesus and ABO haemolytic disease, threshold charts, phototherapy and exchange transfusion, and kernicterus.", blooms: "analyze", minutes: 40, prereq: ["newborn-assessment"] }, content: lesson9() as never },
  { title: "Prematurity & neonatal intensive care", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "The preterm infant", slug: "prematurity-neonatal-care", summary: "The problems of immaturity — thermoregulation, feeding, apnoea of prematurity, intraventricular haemorrhage and retinopathy of prematurity — and the supportive care of the preterm infant.", blooms: "apply", minutes: 40, prereq: ["neonatal-respiratory-distress"] }, content: { blocks: [] } },
  { title: "Congenital anomalies & syndromes", module: 2, estimatedMinutes: 35, authored: false, concept: { title: "Congenital anomalies and syndromes", slug: "congenital-anomalies-syndromes", summary: "The embryology of the common malformations, their prenatal detection, and the recognition of the syndromes with immediate neonatal consequences.", blooms: "understand", minutes: 35, prereq: ["neonatal-resuscitation"] }, content: { blocks: [] } },
  { title: "Neonatal infection & sepsis", module: 2, estimatedMinutes: 35, authored: false, concept: { title: "Neonatal infection", slug: "neonatal-infection-sepsis", summary: "Early and late onset neonatal sepsis, the group B streptococcus and the other neonatal pathogens, maternal risk factors, and the indications for empirical antibiotics.", blooms: "apply", minutes: 35, prereq: ["neonatal-jaundice", "immunisation-childhood"] }, content: { blocks: [] } },

  // --- M3 Respiratory, cardiac & gastrointestinal ---
  { title: "Asthma & wheezing disorders", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Childhood asthma", slug: "asthma-childhood", summary: "The presentation of preschool and school-age wheeze, the diagnosis of asthma in a child, the stepwise treatment by inhaler and spacer, and acute severe asthma.", blooms: "apply", minutes: 40, prereq: ["febrile-child-infections"] }, content: { blocks: [] } },
  { title: "Bronchiolitis, croup & upper airway", module: 3, estimatedMinutes: 35, authored: true, concept: { title: "Acute airway infections", slug: "bronchiolitis-croup", summary: "Respiratory syncytial virus bronchiolitis and the criteria for admission, croup and its severity, stridor, epiglottitis and inhaled foreign body.", blooms: "apply", minutes: 35, prereq: ["immunisation-childhood"] }, content: lesson10() as never },
  { title: "Congenital heart disease", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Congenital heart disease", slug: "congenital-heart-disease", summary: "The left-to-right shunts and the cyanotic lesions, the duct-dependent circulations, presentation by age, and the indications for prostaglandin and for surgery.", blooms: "analyze", minutes: 40, prereq: ["newborn-assessment"] }, content: { blocks: [] } },
  { title: "Heart murmurs, myocarditis & arrhythmias", module: 3, estimatedMinutes: 35, authored: false, concept: { title: "Paediatric cardiology", slug: "paediatric-cardiology", summary: "The innocent murmurs and the features that make a murmur pathological, Kawasaki disease and its coronary complications, myocarditis and syncope in the child.", blooms: "analyze", minutes: 35, prereq: ["congenital-heart-disease"] }, content: { blocks: [] } },
  { title: "Gastroenterology of childhood", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "Paediatric gastroenterology", slug: "paediatric-gastroenterology", summary: "Gastroenteritis and oral rehydration, cows' milk protein intolerance and coeliac disease, inflammatory bowel disease, constipation and soiling, and helicobacter in the child.", blooms: "apply", minutes: 40, prereq: ["infant-nutrition-ftt"] }, content: lesson12() as never },
  { title: "Dehydration & fluid management", module: 3, estimatedMinutes: 35, authored: true, concept: { title: "Fluid therapy in children", slug: "paediatric-fluids-dehydration", summary: "The assessment of dehydration severity, oral rehydration solution and the composition of maintenance fluid, the correction of hypernatraemic and hyponatraemic dehydration, and fluid before surgery.", blooms: "apply", minutes: 35, prereq: ["paediatric-gastroenterology"] }, content: lesson7() as never },

  // --- M4 Renal, endocrine, haematology & oncology ---
  { title: "Urinary tract infection, nephrotic & nephritic syndromes", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Paediatric nephrology", slug: "paediatric-nephrology", summary: "Urinary tract infection and vesicoureteric reflux, nephrotic and acute nephritic syndromes, haemolytic uraemic syndrome, IgA vasculitis and chronic kidney disease.", blooms: "analyze", minutes: 40, prereq: ["febrile-child-infections"] }, content: { blocks: [] } },
  { title: "Diabetes mellitus in childhood", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Childhood diabetes", slug: "childhood-diabetes", summary: "The presentation of type 1 diabetes and diabetic ketoacidosis, insulin regimens, hypoglycaemia in the young child, and the transition to self-management in adolescence.", blooms: "apply", minutes: 40, prereq: ["infant-nutrition-ftt"] }, content: { blocks: [] } },
  { title: "Growth, thyroid & adrenal disorders", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Paediatric endocrinology", slug: "paediatric-endocrinology", summary: "Congenital hypothyroidism, disorders of puberty and of sexual differentiation, congenital adrenal hyperplasia, rickets and disorders of calcium, and growth hormone deficiency.", blooms: "analyze", minutes: 40, prereq: ["growth-and-development"] }, content: { blocks: [] } },
  { title: "Anaemia, bleeding & haemoglobinopathies", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Paediatric haematology", slug: "paediatric-haematology", summary: "Iron deficiency and other anaemias, neonatal haemostasis, immune thrombocytopenia, sickle cell disease, thalassaemia and the management of transfusion in the young child.", blooms: "analyze", minutes: 40, prereq: ["newborn-assessment"] }, content: { blocks: [] } },
  { title: "Childhood cancer & oncological emergencies", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Childhood cancer", slug: "childhood-cancer-leukaemia", summary: "Acute lymphoblastic leukaemia and the solid tumours of childhood, febrile neutropenia and tumour lysis, the late effects of treatment, and palliation.", blooms: "apply", minutes: 45, prereq: ["paediatric-haematology"] }, content: { blocks: [] } },

  // --- M5 Neurology, infection & adolescent health ---
  { title: "Paediatric neurology & seizures", module: 5, estimatedMinutes: 40, authored: true, concept: { title: "Paediatric neurology", slug: "paediatric-neurology", summary: "The classification and management of childhood seizures, headache and migraine, meningitis's aftermath, hypotonia and weakness, and movement disorders.", blooms: "analyze", minutes: 40, prereq: ["development-behaviour-safeguarding"] }, content: lesson13() as never },
  { title: "Infectious disease, tuberculosis & imported disease", module: 5, estimatedMinutes: 40, authored: true, concept: { title: "Childhood infectious disease", slug: "childhood-infectious-disease", summary: "The exanthems and their notification, tuberculosis in children and contact tracing, malaria and other imported infection, and fever in the returned traveller.", blooms: "apply", minutes: 40, prereq: ["immunisation-childhood"] }, content: lesson11() as never },
  { title: "Neurodisability, rehabilitation & the multidisciplinary team", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Neurodisability and rehabilitation", slug: "neurodisability-care", summary: "The multidisciplinary management of cerebral palsy and complex disability, feeding and communication support, orthopaedic and tone management, and the transition to adult services.", blooms: "apply", minutes: 35, prereq: ["development-behaviour-safeguarding"] }, content: { blocks: [] } },
  { title: "Paediatric emergencies", module: 5, estimatedMinutes: 40, authored: true, concept: { title: "Paediatric emergencies", slug: "paediatric-emergencies", summary: "Anaphylaxis and its adrenaline dosing, choking and the airway, poisoning and the role of toxicology, burns and the Parkland-type estimation in a child, and drowning.", blooms: "apply", minutes: 40, prereq: ["febrile-child-infections"] }, content: lesson14() as never },
  { title: "Adolescent medicine & mental health", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Adolescent medicine", slug: "adolescent-medicine", summary: "The adolescent consultation and consent, depression, self-harm and eating disorders, substance use, sexual health and contraception in the young person, and the transition of chronic illness.", blooms: "apply", minutes: 35, prereq: ["development-behaviour-safeguarding"] }, content: { blocks: [] } },
  { title: "Chronic illness, palliative care & the family", module: 5, estimatedMinutes: 30, authored: false, concept: { title: "Palliative and family-centred care", slug: "palliative-care-family", summary: "The principles of paediatric palliative care, symptom control, the care of the family and siblings, and breaking bad news to a child and a family.", blooms: "apply", minutes: 30, prereq: ["adolescent-medicine"] }, content: { blocks: [] } },
];

export const PAEDIATRICS: SubjectSeed = {
  id: "course-paediatrics",
  slug: "paediatrics-child-health",
  title: "Paediatrics — Child Health",
  code: "PEDS 302",
  department: "Paediatrics",
  level: 300,
  credits: 8,
  semester: "full",
  description:
    "The medicine of children: growth and development measured over time, the newborn and its first days, infant feeding and failure to thrive, immunisation, the assessment of the febrile child, and developmental, behavioural and safeguarding paediatrics — followed by neonatal medicine, respiratory, cardiac and gastrointestinal disease, renal, endocrine, haematology and oncology, neurology, infectious disease and adolescent health.",
  faculty: "clinical-medicine",
  modules: MODULES,
  lessons: [
    { title: "Growth, growth charts & development", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Growth and development", slug: "growth-and-development", summary: "The measurement of weight, height and head circumference, the velocity of growth, the milestones of motor, language and social development, the mid-parental height, and the red flags for faltering growth and delay.", blooms: "understand", minutes: 40, prereq: [] }, content: lesson1() as never },
    { title: "The newborn: adaptation, examination & screening", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "The newborn: adaptation and examination", slug: "newborn-assessment", summary: "The transition from fetal to neonatal circulation, the APGAR score, the systematic newborn examination, physiological and pathological jaundice, and the screening of the first weeks.", blooms: "understand", minutes: 40, prereq: ["growth-and-development"] }, content: lesson2() as never },
    { title: "Infant feeding & failure to thrive", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Infant feeding and failure to thrive", slug: "infant-nutrition-ftt", summary: "Breastfeeding and formula, the fluid and energy requirement of an infant, the stages of weaning, the definition and mechanisms of failure to thrive, and severe acute malnutrition.", blooms: "apply", minutes: 40, prereq: ["newborn-assessment"] }, content: lesson3() as never },
    { title: "Immunisation", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Childhood immunisation", slug: "immunisation-childhood", summary: "Live-attenuated, inactivated, subunit and toxoid vaccines; the routine childhood schedule; herd immunity; the true and false contraindications; and the schedules for the immunosuppressed, the premature and the interrupted course.", blooms: "apply", minutes: 40, prereq: ["infant-nutrition-ftt"] }, content: lesson4() as never },
    { title: "The febrile child & serious infection", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "The febrile child", slug: "febrile-child-infections", summary: "The assessment of the seriously ill child, the traffic-light framework for the under-fives, meningitis and meningococcal septicaemia, febrile convulsions, the exanthems and antibiotic stewardship.", blooms: "apply", minutes: 40, prereq: ["immunisation-childhood"] }, content: lesson5() as never },
    { title: "Development, behaviour, neurodisability & safeguarding", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Developmental and behavioural paediatrics, and safeguarding", slug: "development-behaviour-safeguarding", summary: "Cerebral palsy, autism spectrum disorder, attention deficit hyperactivity disorder, delay against regression, the injuries specific to inflicted injury, and consent and confidentiality in the young person.", blooms: "apply", minutes: 40, prereq: ["febrile-child-infections", "growth-and-development"] }, content: lesson6() as never },
    ...DEEPER_LESSONS,
  ],
  sbas: MODULE_ONE_SBAS,
  prereqCourses: [
    "gross-anatomy-i",
    "physiology-cell-and-general",
    "pathology-cell-injury-repair",
    "internal-medicine-foundations",
    "obstetrics-gynaecology",
  ],
};

export async function seedMbbsPaediatrics() {
  return seedMbbsCourse(PAEDIATRICS);
}

/** Idempotent: safe to run repeatedly; upserts on stable keys. */
export async function seedPaediatrics(): Promise<void> {
  await seedMbbsPaediatrics();
}

export default PAEDIATRICS;

// CLI usage: npx ts-node prisma/seed-courses/mbbs/pediatrics.ts
if (process.argv[1] && process.argv[1].includes("mbbs/pediatrics")) {
  seedPaediatrics()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
