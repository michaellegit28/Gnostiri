import { prisma, seedMbbsCourse, type LessonSeed, type SbaSeed, type SubjectSeed } from "./spine";

/**
 * PEDS 302 — Paediatrics.
 *
 * Module 1 ("The child, growth and development") is authored in full: 6 lessons
 * in the pilot-report format with one SBA item per concept. Only established
 * paediatric teaching is asserted — the physiology of growth and its charts,
 * the newborn examination and transitional circulation, infant feeding and
 * failure to thrive, the childhood immunisation programmes, the assessment of
 * the febrile child, and developmental assessment, neurodisability and
 * safeguarding.
 *
 * Modules 2-5 (neonatal medicine, respiratory/cardiac/gastrointestinal, renal/
 * endocrine/haemato-oncology, neurology and adolescent health) ship as a real
 * concept spine and prerequisite DAG with tracked-placeholder lessons
 * (needsCheck true).
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
  { title: "Neonatal resuscitation & transitional problems", module: 2, estimatedMinutes: 35, authored: false, concept: { title: "Neonatal resuscitation", slug: "neonatal-resuscitation", summary: "The newborn resuscitation algorithm driven by the heart rate, airway positioning and inflation breaths, chest compressions and drugs, and the common neonatal presentations that follow poor transition.", blooms: "apply", minutes: 35, prereq: ["newborn-assessment"] }, content: { blocks: [] } },
  { title: "Respiratory distress in the newborn", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Respiratory distress of the newborn", slug: "neonatal-respiratory-distress", summary: "Surfactant deficiency and its treatment, transient tachypnoea of the newborn, meconium aspiration, diaphragmatic hernia and persistent pulmonary hypertension.", blooms: "analyze", minutes: 40, prereq: ["neonatal-resuscitation"] }, content: { blocks: [] } },
  { title: "Neonatal jaundice & haemolytic disease", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Neonatal hyperbilirubinaemia", slug: "neonatal-jaundice", summary: "The causes of unconjugated and conjugated hyperbilirubinaemia, rhesus and ABO haemolytic disease, threshold charts, phototherapy and exchange transfusion, and kernicterus.", blooms: "analyze", minutes: 40, prereq: ["newborn-assessment"] }, content: { blocks: [] } },
  { title: "Prematurity & neonatal intensive care", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "The preterm infant", slug: "prematurity-neonatal-care", summary: "The problems of immaturity — thermoregulation, feeding, apnoea of prematurity, intraventricular haemorrhage and retinopathy of prematurity — and the supportive care of the preterm infant.", blooms: "apply", minutes: 40, prereq: ["neonatal-respiratory-distress"] }, content: { blocks: [] } },
  { title: "Congenital anomalies & syndromes", module: 2, estimatedMinutes: 35, authored: false, concept: { title: "Congenital anomalies and syndromes", slug: "congenital-anomalies-syndromes", summary: "The embryology of the common malformations, their prenatal detection, and the recognition of the syndromes with immediate neonatal consequences.", blooms: "understand", minutes: 35, prereq: ["neonatal-resuscitation"] }, content: { blocks: [] } },
  { title: "Neonatal infection & sepsis", module: 2, estimatedMinutes: 35, authored: false, concept: { title: "Neonatal infection", slug: "neonatal-infection-sepsis", summary: "Early and late onset neonatal sepsis, the group B streptococcus and the other neonatal pathogens, maternal risk factors, and the indications for empirical antibiotics.", blooms: "apply", minutes: 35, prereq: ["neonatal-jaundice", "immunisation-childhood"] }, content: { blocks: [] } },

  // --- M3 Respiratory, cardiac & gastrointestinal ---
  { title: "Asthma & wheezing disorders", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Childhood asthma", slug: "asthma-childhood", summary: "The presentation of preschool and school-age wheeze, the diagnosis of asthma in a child, the stepwise treatment by inhaler and spacer, and acute severe asthma.", blooms: "apply", minutes: 40, prereq: ["febrile-child-infections"] }, content: { blocks: [] } },
  { title: "Bronchiolitis, croup & upper airway", module: 3, estimatedMinutes: 35, authored: false, concept: { title: "Acute airway infections", slug: "bronchiolitis-croup", summary: "Respiratory syncytial virus bronchiolitis and the criteria for admission, croup and its severity, stridor, epiglottitis and inhaled foreign body.", blooms: "apply", minutes: 35, prereq: ["immunisation-childhood"] }, content: { blocks: [] } },
  { title: "Congenital heart disease", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Congenital heart disease", slug: "congenital-heart-disease", summary: "The left-to-right shunts and the cyanotic lesions, the duct-dependent circulations, presentation by age, and the indications for prostaglandin and for surgery.", blooms: "analyze", minutes: 40, prereq: ["newborn-assessment"] }, content: { blocks: [] } },
  { title: "Heart murmurs, myocarditis & arrhythmias", module: 3, estimatedMinutes: 35, authored: false, concept: { title: "Paediatric cardiology", slug: "paediatric-cardiology", summary: "The innocent murmurs and the features that make a murmur pathological, Kawasaki disease and its coronary complications, myocarditis and syncope in the child.", blooms: "analyze", minutes: 35, prereq: ["congenital-heart-disease"] }, content: { blocks: [] } },
  { title: "Gastroenterology of childhood", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Paediatric gastroenterology", slug: "paediatric-gastroenterology", summary: "Gastroenteritis and oral rehydration, cows' milk protein intolerance and coeliac disease, inflammatory bowel disease, constipation and soiling, and helicobacter in the child.", blooms: "apply", minutes: 40, prereq: ["infant-nutrition-ftt"] }, content: { blocks: [] } },
  { title: "Dehydration & fluid management", module: 3, estimatedMinutes: 35, authored: false, concept: { title: "Fluid therapy in children", slug: "paediatric-fluids-dehydration", summary: "The assessment of dehydration severity, oral rehydration solution and the composition of maintenance fluid, the correction of hypernatraemic and hyponatraemic dehydration, and fluid before surgery.", blooms: "apply", minutes: 35, prereq: ["paediatric-gastroenterology"] }, content: { blocks: [] } },

  // --- M4 Renal, endocrine, haematology & oncology ---
  { title: "Urinary tract infection, nephrotic & nephritic syndromes", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Paediatric nephrology", slug: "paediatric-nephrology", summary: "Urinary tract infection and vesicoureteric reflux, nephrotic and acute nephritic syndromes, haemolytic uraemic syndrome, IgA vasculitis and chronic kidney disease.", blooms: "analyze", minutes: 40, prereq: ["febrile-child-infections"] }, content: { blocks: [] } },
  { title: "Diabetes mellitus in childhood", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Childhood diabetes", slug: "childhood-diabetes", summary: "The presentation of type 1 diabetes and diabetic ketoacidosis, insulin regimens, hypoglycaemia in the young child, and the transition to self-management in adolescence.", blooms: "apply", minutes: 40, prereq: ["infant-nutrition-ftt"] }, content: { blocks: [] } },
  { title: "Growth, thyroid & adrenal disorders", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Paediatric endocrinology", slug: "paediatric-endocrinology", summary: "Congenital hypothyroidism, disorders of puberty and of sexual differentiation, congenital adrenal hyperplasia, rickets and disorders of calcium, and growth hormone deficiency.", blooms: "analyze", minutes: 40, prereq: ["growth-and-development"] }, content: { blocks: [] } },
  { title: "Anaemia, bleeding & haemoglobinopathies", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Paediatric haematology", slug: "paediatric-haematology", summary: "Iron deficiency and other anaemias, neonatal haemostasis, immune thrombocytopenia, sickle cell disease, thalassaemia and the management of transfusion in the young child.", blooms: "analyze", minutes: 40, prereq: ["newborn-assessment"] }, content: { blocks: [] } },
  { title: "Childhood cancer & oncological emergencies", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Childhood cancer", slug: "childhood-cancer-leukaemia", summary: "Acute lymphoblastic leukaemia and the solid tumours of childhood, febrile neutropenia and tumour lysis, the late effects of treatment, and palliation.", blooms: "apply", minutes: 45, prereq: ["paediatric-haematology"] }, content: { blocks: [] } },

  // --- M5 Neurology, infection & adolescent health ---
  { title: "Paediatric neurology & seizures", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Paediatric neurology", slug: "paediatric-neurology", summary: "The classification and management of childhood seizures, headache and migraine, meningitis's aftermath, hypotonia and weakness, and movement disorders.", blooms: "analyze", minutes: 40, prereq: ["development-behaviour-safeguarding"] }, content: { blocks: [] } },
  { title: "Infectious disease, tuberculosis & imported disease", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Childhood infectious disease", slug: "childhood-infectious-disease", summary: "The exanthems and their notification, tuberculosis in children and contact tracing, malaria and other imported infection, and fever in the returned traveller.", blooms: "apply", minutes: 40, prereq: ["immunisation-childhood"] }, content: { blocks: [] } },
  { title: "Neurodisability, rehabilitation & the multidisciplinary team", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Neurodisability and rehabilitation", slug: "neurodisability-care", summary: "The multidisciplinary management of cerebral palsy and complex disability, feeding and communication support, orthopaedic and tone management, and the transition to adult services.", blooms: "apply", minutes: 35, prereq: ["development-behaviour-safeguarding"] }, content: { blocks: [] } },
  { title: "Paediatric emergencies", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Paediatric emergencies", slug: "paediatric-emergencies", summary: "Anaphylaxis and its adrenaline dosing, choking and the airway, poisoning and the role of toxicology, burns and the Parkland-type estimation in a child, and drowning.", blooms: "apply", minutes: 40, prereq: ["febrile-child-infections"] }, content: { blocks: [] } },
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
