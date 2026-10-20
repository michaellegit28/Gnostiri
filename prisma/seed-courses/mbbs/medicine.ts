import { prisma, seedMbbsCourse, type LessonSeed, type SbaSeed, type SubjectSeed } from "./spine";

/**
 * MED 301 — Internal Medicine.
 *
 * Module 1 ("Foundations of clinical medicine") is authored in full: 6 lessons
 * in the pilot-report format with one SBA item per concept. Only established,
 * textbook clinical teaching is asserted — the physiological limits of the
 * vital signs, the Sepsis-3 definitions, the classifications of shock and of
 * acid-base disturbance. Every numeric range quoted is a standard reference
 * value.
 *
 * Modules 2-6 (cardiology, respiratory, gastroenterology and hepatology,
 * endocrinology and metabolism, nephrology/haematology/infectious disease)
 * ship as a real concept spine and prerequisite DAG with tracked-placeholder
 * lessons (needsCheck true).
 *
 * Requires prisma/seed-university.ts first (faculty, department, programme).
 */

const COURSE_SLUG = "internal-medicine-foundations";

const MODULES = [
  { slug: "clinical-method", title: "M1 — Foundations of clinical medicine" },
  { slug: "cardiology", title: "M2 — Cardiology" },
  { slug: "respiratory-medicine", title: "M3 — Respiratory medicine" },
  { slug: "gastroenterology-hepatology", title: "M4 — Gastroenterology & hepatology" },
  { slug: "endocrinology-metabolism", title: "M5 — Endocrinology & metabolic medicine" },
  { slug: "nephrology-haematology-infection", title: "M6 — Nephrology, haematology & infectious disease" },
];

// ---------------------------------------------------------------------------
// LESSON 1 — The clinical method (fully authored)
// ---------------------------------------------------------------------------
function lesson1() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: distinguish a symptom from a sign; take a structured history in which the presenting problem drives the order of the enquiry; describe what each part of the examination adds and the order in which it is performed; explain what clinical reasoning is and the difference between pattern recognition and a causal model; and recognise the point in a consultation at which information becomes sufficient to act.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "The pre-clinical courses — ANAT 101, PHYS 101, BCHM 101, PATH 201, PHRM 202 — because every step of the clinical method is an application of the anatomy and pathophysiology you have learned.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "The clinical method",
        text: "The process by which a history and an examination are taken, a differential diagnosis is formed, alternative hypotheses are tested, and a treatment is chosen and its effect monitored — the series of steps that converts a patient's report of illness into a decision.",
      },
      {
        type: "paragraph",
        text: "Medicine is not a body of facts recalled; it is a method of reasoning under uncertainty. The facts you learn in the pre-clinical years are the raw material, but the value of the method is that it lets you handle a patient whose presentation does not match any single textbook. A patient describes a set of complaints, and you must order them, weigh them, examine the relevant systems, form hypotheses, test them with investigations, and act.",
      },

      { type: "heading", level: 2, text: "History and examination" },
      {
        type: "table",
        headers: ["Element", "What it is", "What it contributes"],
        rows: [
          ["Symptom", "A report by the patient — subjective, and the starting point of the whole method", "The complaint that brings the patient, and the patient's own experience of it"],
          ["Sign", "An objective finding on examination — measurable, and independently checkable", "Confirmation or exclusion of a hypothesis, and a baseline against which to measure change"],
          ["Past history, drugs, allergies", "Previous illnesses, current medicines, reactions", "The context that changes the differential; an allergy changes the prescription"],
          ["Family and social history", "Illnesses in relatives, occupation, smoking, alcohol", "The risk factors and the constraints — including the ones that decide what treatment is acceptable"],
        ],
      },
      {
        type: "paragraph",
        text: "Two structural habits matter more than the order in textbooks. First, let the patient talk. A patient's uninterrupted account of an illness, if you let it run for the first minute or two, is usually the most information-dense period of the consultation. Second, ask the closing question: 'is there anything else you'd like to tell me, or anything you were expecting me to ask?' — because the reason the patient came is often not the reason they mention first.",
      },

      { type: "heading", level: 2, text: "Worked example: structuring the presenting complaint" },
      {
        type: "paragraph",
        text: "A patient says 'I have chest pain'. That is a symptom, and it is the beginning of your enquiry rather than a diagnosis. Characterise it with the pneumonic SOCRATES: site, onset, character, radiation, associations, timing, exacerbating and relieving factors, and severity.",
      },
      {
        type: "table",
        headers: ["Feature", "Asking", "What the answer towards"],
        rows: [
          ["Site", "Where exactly is the pain?", "Central chest pain suggests the heart, oesophagus or great vessels; pain on one side suggests the pleura"],
          ["Onset", "When did it start, and what were you doing?", "Sudden onset suggests a mechanical event — an embolus, a dissection, a rupture"],
          ["Character", "What does it feel like — tight, heavy, sharp, burning?", "Central and heavy suggests ischaemia; sharp and worse on breathing suggests pleurisy"],
          ["Radiation", "Does it go anywhere else?", "To the arm or jaw suggests cardiac; to the back suggests aortic dissection; to the shoulders suggests diaphragmatic"],
          ["Associations", "What else comes with it?", "Sweating, nausea and vomiting suggest cardiac; fever and cough suggest infection"],
          ["Timing", "Constant, or does it come and go?", "Constant, severe pain suggests dissection or infarction; intermittent suggests ischaemia"],
          ["Exacerbating and relieving", "What makes it worse or better?", "Worse on breathing or on movement suggests pleurisy or muscular; relieved by sitting forward suggests pericarditis; relieved by antacids suggests reflux"],
          ["Severity", "How bad out of ten?", "A numeric score that you can repeat and compare after treatment"],
        ],
      },
      {
        type: "paragraph",
        text: "The same structure works for a cough, breathlessness, abdominal pain, dizziness, or any other presenting complaint. The value of the structure is that it is exhaustive, so that a symptom is fully characterised before a hypothesis is formed, rather than a hypothesis being formed from a fragment and the history being read backwards to fit it.",
      },

      { type: "heading", level: 2, text: "Clinical reasoning" },
      {
        type: "paragraph",
        text: "Two mechanisms of reasoning coexist in an experienced clinician, and they produce different failures. Pattern recognition matches the patient in front of you to an exemplar and reads the answer directly out of the match. It is fast, and it is what expert clinicians use most of the time. Its failure mode is anchoring: once an early pattern is chosen, contradictory evidence is read as fitting it. A causal model, by contrast, reasons from the mechanism: if the presentation is this, then the pathology that explains it must be X, and X predicts findings that can be tested.",
      },
      {
        type: "paragraph",
        text: "The discipline that protects against anchoring is the differential. A differential is a deliberately ordered list of the conditions that can explain the presentation, ranked by probability and by consequence, and you always include the common and the dangerous — because you manage the first by treatment and the second by exclusion. It is worth asking whether a serious but rare explanation has been explicitly ruled out. The principle is the same one that underlies screening: the most dangerous mistake in medicine is missing a treatable disease.",
      },
      {
        type: "question",
        prompt: "A patient presents with chest pain and breathlessness. What belongs in your differential, and why is order not sufficient?",
        answer: "The list includes acute coronary syndrome, pulmonary embolism, pneumothorax, aortic dissection, pericarditis, oesophagitis, and musculoskeletal chest pain. Order is not sufficient because the dangerous diagnoses — dissection and massive embolism — are less common than the benign ones but are fatal within hours, so they must be actively excluded rather than discounted by probability.",
        explanation: "A differential is a set of working hypotheses, not a ranked list of answers, and it should include both what is probable and what would be catastrophic if missed.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Skipping the differential because a probable diagnosis is obvious. The probable diagnosis is what you treat first; the differential is what protects the patient when your first diagnosis is wrong.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Ordering an investigation that will not change your management. A test is only worth doing if the possible outcomes would change the decision. Ordering everything is as bad an error as ordering nothing, because an unexpected abnormality in an unplanned test cannot always be interpreted.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Recording only the abnormal findings. A complete record of the normal findings is as important as a record of the abnormal ones, because it demonstrates which hypotheses have already been excluded.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What is the difference between a symptom and a sign, and why does the distinction matter?",
        answer: "A symptom is subjective, reported by the patient; a sign is objective and can be measured. It matters because a sign can be verified and repeated by another clinician and can be tracked, whereas a symptom cannot.",
        explanation: "The distinction is the difference between a patient's report and an independently measurable finding that can be tracked over time.",
      },
      {
        type: "question",
        prompt: "What are the elements that characterise a presenting complaint, and what do they allow?",
        answer: "Site, onset, character, radiation, associations, timing, exacerbating and relieving factors, and severity. They allow the symptom to be fully characterised before being matched to a disease pattern.",
        explanation: "Characterising a symptom in full is the safety net that prevents a hasty match of a fragment to a diagnosis.",
      },
      {
        type: "question",
        prompt: "Why is 'what did you expect me to ask?' a valuable question at the end of a consultation?",
        answer: "Because it reveals the concern that brought the patient in, which often differs from the first symptom mentioned and changes both the differential and the reassurance you offer.",
        explanation: "The patient's agenda is usually the most important part of the consultation, and the question gives them permission to state it.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which of these is a symptom rather than a sign?",
        options: ["A temperature of 38.4 degrees C", "A report of chest tightness by the patient", "A blood pressure of 80/50", "A raised jugular venous pressure"],
        correctIndex: 1,
        explanation: "A symptom is subjective, reported by the patient. The others are objective measurements that another clinician can repeat and verify.",
      },
      {
        type: "mcq",
        stem: "A patient describes a sudden, tearing chest pain radiating to the back, with a blood pressure of 80/50. Which diagnosis must be actively excluded?",
        options: [
          "Musculoskeletal chest pain",
          "Aortic dissection",
          "Reflux oesophagitis",
          "Anxiety-related chest pain",
        ],
        correctIndex: 1,
        explanation: "Sudden tearing chest pain radiating to the back with a hypotensive presentation is the classic description of a dissecting aortic aneurysm. It is less common than the benign causes, but it is fatal within hours, so it must be actively excluded rather than discounted.",
      },
      {
        type: "mcq",
        stem: "Which of these best describes a differential diagnosis?",
        options: [
          "A ranked list of the conditions that can explain the presentation, including those that would be catastrophic if missed",
          "A single diagnosis selected by the consultant",
          "A list of investigations to order",
          "A list of drugs that could treat the condition",
        ],
        correctIndex: 0,
        explanation: "A differential is a set of working hypotheses, ordered by probability and by consequence, and it is what protects the patient when the first hypothesis is wrong.",
      },
      {
        type: "mcq",
        stem: "When is an investigation worth ordering?",
        options: [
          "When it is available and cheap", "When the possible outcomes would change your management", "Whenever the patient requests one", "Whenever a result is abnormal",
        ],
        correctIndex: 1,
        explanation: "A test is justified only if its result would change your next decision. A test that will not change management adds cost and risk without benefit.",
      },
      {
        type: "mcq",
        stem: "A patient reports chest discomfort that is relieved by antacids. What is the most important next step?",
        options: [
          "Assume it is reflux and discharge with a proton pump inhibitor",
          "Characterise the symptom fully, and actively exclude the life-threatening causes before attributing it to reflux",
          "Order a CT angiogram of the chest",
          "Discharge the patient with analgesia",
        ],
        correctIndex: 1,
        explanation: "Relief by antacid favours reflux but does not exclude cardiac or aortic causes, and treatment for the benign hypothesis before excluding the dangerous ones is the classic error.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The clinical method converts a patient's illness into a decision through a structured history, a systematic examination, a deliberately ordered differential, and a choice of investigation that is justified by the effect it will have on management. A symptom is the patient's report; a sign is independently measurable. Clinical reasoning uses both rapid pattern recognition and analytical causal models, and the differential is the discipline that prevents an early pattern from closing off alternative explanations.",
      },
      {
        type: "paragraph",
        text: "Next: vital signs. You will learn what each measurement tells you, the physiological limits within which it should be interpreted, and what a combination of abnormal measurements means as a whole.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 2 — Vital signs and what they mean (fully authored)
// ---------------------------------------------------------------------------
function lesson2() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: state the normal reference ranges for the vital signs in adults; calculate the pulse pressure and the mean arterial pressure and explain what each indicates; interpret a blood pressure according to the current classification of hypertension; explain why respiratory rate is the most frequently missed vital sign; and identify the combinations of vital signs that signal specific clinical states.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (The clinical method). You need to know that a sign is an objectively measurable finding, and that a vital sign is the series of signs that is measured at every encounter.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Vital signs",
        text: "The series of physiological measurements — temperature, heart rate, blood pressure, respiratory rate and oxygen saturation — that are taken at every clinical encounter to detect physiological deterioration and to measure the response to treatment.",
      },
      {
        type: "paragraph",
        text: "The vital signs are a monitor, not a set of target values. They are interpreted against a trend, against the patient's usual values, and against each other. A blood pressure of 95/60 is a normal value for a young woman with a pulse of 60, and a critical one for a previously hypertensive man of seventy with a pulse of 120: the number changes meaning entirely with the second measurement.",
      },

      { type: "heading", level: 2, text: "The reference ranges" },
      {
        type: "table",
        headers: ["Vital sign", "Normal range in an adult", "Note"],
        rows: [
          ["Temperature", "36.5 to 37.5 degrees Celsius (oral)", "Measured centrally in practice with tympanic or oral thermometers; a difference of more than about 0.5 degrees between core and periphery is a sign of shock"],
          ["Heart rate", "60 to 100 beats per minute", "Bradycardia below 60 and tachycardia above 100; trained athletes normally rest near 50, and febrile patients rise by roughly 10 beats per minute per degree"],
          ["Blood pressure", "Below 130/80 mmHg in current guidance, with an optimal below 120/80", "Measured with the correct cuff size and the patient seated and rested; the higher systolic values in elderly reflect stiffness of the arteries"],
          ["Respiratory rate", "12 to 20 breaths per minute", "The most commonly missed of the vital signs, and yet one of the earliest to change"],
          ["Oxygen saturation", "94 to 98 per cent, on room air", "Measured by pulse oximetry; values fall in lung disease, and a saturation of 97 per cent may be misleading in anaemia"],
        ],
      },
      {
        type: "paragraph",
        text: "Blood pressure is classified by the higher of the two values into normal, elevated, stage 1 hypertension and stage 2 hypertension, with a systolic pressure of 130 or a diastolic pressure of 80 taken as the threshold at which the diagnosis of hypertension is made. The classification is stage-based, and the stage determines both the urgency and the target; a systolic pressure of 180 is a hypertensive emergency if there is target-organ damage and a hypertensive urgency if there is not.",
      },

      { type: "heading", level: 2, text: "Worked example: pulse pressure and mean arterial pressure" },
      {
        type: "table",
        headers: ["Quantity", "Calculation", "What a change means"],
        rows: [
          ["Pulse pressure", "Systolic minus diastolic", "Wide in stiff arteries, aortic regurgitation, fever, pregnancy and thyrotoxicosis; narrow in aortic stenosis, hypovolaemia, tamponade and heart failure"],
          ["Mean arterial pressure (MAP)", "Diastolic plus one-third of the pulse pressure", "The perfusion pressure the organs actually see; a value above 65 mmHg is the target in sepsis and in the treatment of shock"],
        ],
      },
      {
        type: "paragraph",
        text: "The mean arterial pressure is what matters for perfusion, which is why the target in shock is expressed in those terms. A patient with a systolic pressure of 90 and a diastolic of 60 has a mean of 70 — adequate for now. A patient with a systolic of 90 and a diastolic of 40 has a mean of only 57 — the organs are not being perfused, even though the systolic is the same. The pulse pressure is the discriminator.",
      },

      { type: "heading", level: 2, text: "Worked example: respiratory rate" },
      {
        type: "paragraph",
        text: "Respiratory rate rises earlier in shock than any other vital sign, and it is the one most frequently estimated rather than measured — and therefore frequently recorded inaccurately. Count for a full minute, ideally without telling the patient, because a patient who is aware that their breathing is being counted will voluntarily slow it.",
      },
      {
        type: "table",
        headers: ["Pattern", "What it suggests"],
        rows: [
          ["Fast and shallow", "Pneumonia, pulmonary embolism, pain, shock"],
          ["Fast and deep, with a large tidal volume", "Kussmaul breathing — a metabolic acidosis such as diabetic ketoacidosis"],
          ["Slow and shallow", "Sedative overdose, opioid excess, a central lesion, or exhaustion of the respiratory muscles"],
          ["Fast, noisy and with accessory muscle use", "Airway obstruction or severe asthma — an emergency"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Rising respiratory rate with a falling blood pressure is the pattern of deteriorating shock, and it precedes the fall in blood pressure. A patient whose respiratory rate is rising is usually deteriorating, whatever the pressure currently reads.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Interpreting one vital sign in isolation. The measurement of a set is what identifies a clinical state: tachycardia with tachypnoea and hypotension is shock, while tachycardia with a normal respiratory rate may simply be anxiety or a beta-agonist.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Judging oxygenation by oxygen saturation alone. Saturation is the percentage of haemoglobin bound to oxygen, and a normal saturation is compatible with severe anaemia, in which the total oxygen content of the blood is low. Anaemia requires a haemoglobin measurement, not a saturation measurement.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Ignoring a disproportionately raised pulse pressure in an elderly patient. A wide pulse pressure in an elderly patient reflects stiff arteries and is a cardiovascular risk factor, even if the systolic pressure is not markedly raised.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What is the mean arterial pressure of a patient with a blood pressure of 90/50, and why is the value important?",
        answer: "The mean arterial pressure is 90 plus one-third of the pulse pressure: the pulse pressure is 40, so the mean is about 63 mmHg. It matters because the mean, not the systolic, is the pressure the organs see, and it is the value targeted in shock resuscitation.",
        explanation: "A patient with the same systolic pressure of 90 but a diastolic of 40 would have a mean of only 57 — the same systolic figure but inadequate perfusion.",
      },
      {
        type: "question",
        prompt: "Why should the respiratory rate be counted without the patient's awareness?",
        answer: "Because a patient who knows their breathing is being counted may slow it voluntarily, which makes the recorded rate an artefact. Count for a full minute, ideally under the pretence of examining the chest.",
        explanation: "The rate is the earliest vital sign to deteriorate and the one most often misrecorded, so the technique of measuring it is clinically decisive.",
      },
      {
        type: "question",
        prompt: "A patient has an oxygen saturation of 97 per cent but a haemoglobin of 6.0 grams per decilitre. What is wrong?",
        answer: "The haemoglobin is severely low, so although each available haemoglobin molecule is 97 per cent saturated, the total oxygen carried by the blood is far less than normal. The saturation is normal but the oxygen carriage is not.",
        explanation: "Saturation measures saturation, not content — which is why the haemoglobin is always needed before judging oxygenation.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "What is the mean arterial pressure of a patient with a blood pressure of 110/70?",
        options: ["70 mmHg", "83 mmHg", "90 mmHg", "40 mmHg"],
        correctIndex: 1,
        explanation: "The pulse pressure is 40, and the mean arterial pressure is the diastolic plus one third of the pulse pressure: 70 + (40 divided by 3), which is about 83 mmHg.",
      },
      {
        type: "mcq",
        stem: "Which vital sign rises earliest in the deterioration of shock?",
        options: ["Blood pressure", "Heart rate", "Respiratory rate", "Temperature"],
        correctIndex: 2,
        explanation: "Respiratory rate rises before either the heart rate or the blood pressure falls, and it is the most frequently under-recorded measurement at the bedside.",
      },
      {
        type: "mcq",
        stem: "A patient has a blood pressure of 80/60 with a heart rate of 120. Which state does this pattern indicate?",
        options: ["Hypertensive emergency", "Hypovolaemic shock, confirmed by the low pressure and the compensatory tachycardia", "Well-controlled hypertension", "Isolated hypertension"],
        correctIndex: 1,
        explanation: "A low pressure with a compensatory tachycardia is the pattern of reduced circulating volume, and the mean arterial pressure is low enough that perfusion is inadequate.",
      },
      {
        type: "mcq",
        stem: "Which is the commonest error in taking the vital signs?",
        options: [
          "Measuring the temperature before the blood pressure",
          "Estimating the respiratory rate rather than counting it",
          "Measuring the oxygen saturation on a cold finger",
          "Taking the pulse at the wrist rather than the carotid",
        ],
        correctIndex: 1,
        explanation: "The respiratory rate is the vital sign most often estimated rather than measured, and yet it is the one that changes earliest in deterioration.",
      },
      {
        type: "mcq",
        stem: "Which statement about oxygen saturation is correct?",
        options: [
          "It measures the total oxygen content of the blood",
          "It measures what fraction of the available haemoglobin is bound to oxygen, and is therefore normal in anaemia",
          "It falls in proportion to the haemoglobin",
          "It is the best measure of tissue oxygen delivery",
        ],
        correctIndex: 1,
        explanation: "Saturation is a fraction, not a quantity: a normal value is compatible with severe anaemia, in which the quantity of oxygen carried is low.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The vital signs are a monitor of physiological function, interpreted as a set and against a trend. Temperature, heart rate, blood pressure, respiratory rate and oxygen saturation each have reference ranges, and it is the combination that identifies clinical states. The mean arterial pressure — the diastolic plus a third of the pulse pressure — is the perfusion pressure the organs see, and it is the value targeted in the resuscitation of shock. Respiratory rate is the earliest to change and the one most commonly misrecorded, and oxygen saturation says nothing about how much oxygen the blood can carry.",
      },
      {
        type: "paragraph",
        text: "Next: fluid, electrolyte and acid-base disturbance — the disorders that underlie most of the abnormal numbers on an inpatient chart, and the ones whose correction has to be done in the right order.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 3 — Fluid, electrolyte & acid-base balance (fully authored)
// ---------------------------------------------------------------------------
function lesson3() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the water compartments and the daily requirement for water and electrolytes; calculate the maintenance fluid requirement for an adult from body weight; define and classify hypovolaemia, hyponatraemia, hypernatraemia, hypokalaemia and hyperkalaemia; classify the four primary acid-base disturbances and interpret a paired blood gas and electrolyte result; and state the order in which abnormalities must be corrected.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "PATH 201 module 1 (cell injury and shock), PHYS 101 module 1 (membrane transport), BCHM 101 module 1 (buffering and acid-base).",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Fluid and electrolyte balance",
        text: "The relationship between input, output and distribution of water and electrolytes, which determines the volume, the tonicity and the pH of the fluid in which the cells live.",
      },
      {
        type: "paragraph",
        text: "An admission chart that shows a sodium of 128, a potassium of 5.6, a bicarbonate of 18 and a blood gas with a pH of 7.28 is describing one event. Your job is not to correct a list of numbers in any order: it is to work out what the patient lost, gained and retained, and in what sequence the correction is safe. Correcting potassium in a patient who is also acidotic before addressing the acid can precipitate cardiac arrest, and correcting sodium too quickly can cause irreversible brain damage. The order matters as much as the target.",
      },

      { type: "heading", level: 2, text: "Worked example: calculating a maintenance regimen" },
      {
        type: "paragraph",
        text: "The daily water requirement of an average adult is between about 2 and 3 litres, most of it as free intake. In a patient who cannot drink, a maintenance regimen is calculated from body weight, with adjustments for fever, for losses (drains, vomiting, diarrhoea, burns), and for loss of concentrating ability.",
      },
      {
        type: "table",
        headers: ["Component", "Rule", "Example for a 70 kg adult"],
        rows: [
          ["Water", "2 to 3 litres per day, most as free intake", "About 2.5 litres per day"],
          ["Sodium", "About 1 to 2 millimoles per kilogram per day", "70 to 140 millimoles per day"],
          ["Potassium", "About 1 millimole per kilogram per day", "About 70 millimoles per day"],
          ["Hourly rate by weight", "4 ml/kg for the first 10 kg, 2 ml/kg for the next 10 kg, and 1 ml/kg for the remainder", "40 + 20 + 50 = about 110 ml per hour"],
        ],
      },
      {
        type: "paragraph",
        text: "The maintenance regimen is a starting point, not a prescription: it is adjusted on the basis of measured losses and of the response of the patient's bloods. Over-prescribing intravenous fluid in a patient whose kidneys are concentrating poorly produces pulmonary oedema, and under-prescribing in a patient with a drain produces acute kidney injury. Both are avoidable by asking what is being lost and at what rate.",
      },

      { type: "heading", level: 2, text: "The four acid-base disturbances" },
      {
        type: "table",
        headers: ["Disturbance", "pH", "Primary change", "Compensation", "Common causes"],
        rows: [
          ["Metabolic acidosis", "Low", "Low bicarbonate", "Respiratory: lowering of carbon dioxide by hyperventilation", "Diabetic ketoacidosis, lactic acidosis, renal failure, severe diarrhoea, toxins"],
          ["Metabolic alkalosis", "High", "High bicarbonate", "Respiratory: rising carbon dioxide by hypoventilation", "Protracted vomiting, nasogastric suction, diuretic use, mineralocorticoid excess"],
          ["Respiratory acidosis", "Low", "Raised carbon dioxide", "Renal: retention of bicarbonate", "Chronic obstructive pulmonary disease, sedative overdose, neuromuscular disease, chest trauma"],
          ["Respiratory alkalosis", "High", "Lowered carbon dioxide", "Renal: excretion of bicarbonate", "Hyperventilation from anxiety, hypoxaemia, salicylate poisoning, early sepsis, pregnancy"],
        ],
      },
      {
        type: "paragraph",
        text: "Interpreting a blood gas and a panel together follows a fixed order. Take the pH: acidosis or alkalosis. Take the bicarbonate and the carbon dioxide together: whichever matches the pH is the primary disturbance. Compute the anion gap as sodium minus chloride minus bicarbonate; a raised gap indicates that an added acid is being buffered by the bicarbonate. Then judge whether the compensation is appropriate: in a metabolic acidosis, the expected carbon dioxide is calculable from the bicarbonate, and if the measured value is far from the calculated one, a second disorder is present.",
      },
      {
        type: "table",
        headers: ["Anion gap", "Causes", "Example"],
        rows: [
          ["Raised", "An added acid has consumed bicarbonate", "Ketoacidosis, lactic acidosis, renal failure, salicylate, methanol, ethylene glycol"],
          ["Normal", "A loss of bicarbonate has occurred, with chloride retained", "Severe diarrhoea, renal tubular acidosis, acetazolamide, and Addisonian crisis"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Correcting a sodium of 128 too quickly. Rapid correction causes osmotic central pontine myelinolysis, so sodium is raised by no more than about 10 millimoles per litre in the first twenty-four hours in a chronic hyponatraemia.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Adding potassium to fluid in a patient who is acidotic and oliguric. In acidosis, potassium leaks out of cells, so the plasma potassium may be deceptively high; adding potassium in a patient who is not producing urine precipitates hyperkalaemic cardiac arrest. Correct the acid and the volume, and recheck.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Assuming a normal anion gap excludes ketoacidosis. In diabetic ketoacidosis with severe vomiting, a normal gap does not exclude the diagnosis, because the relationship changes with the rest of the arterial blood and the clinical picture.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A patient with severe diarrhoea has a pH of 7.28, a bicarbonate of 14, a carbon dioxide of 28 and an anion gap of 9. What is the disturbance?",
        answer: "A normal-anion-gap metabolic acidosis, from the loss of bicarbonate in the stool. The respiratory compensation (a lowered carbon dioxide) is appropriate.",
        explanation: "The normal gap indicates the acidosis is from a loss of bicarbonate rather than from an added acid, and a low bicarbonate with an appropriate fall in carbon dioxide confirms a metabolic acidosis.",
      },
      {
        type: "question",
        prompt: "Why is the risk of rapid sodium correction a reason to correct it slowly?",
        answer: "Because a rapid rise in a chronic hyponatraemia causes water to shift out of brain cells too fast, producing osmotic demyelination — irreversible neurological damage. So chronic hyponatraemia is corrected by no more than about 10 millimoles per litre in the first 24 hours.",
        explanation: "The brain adapts to the new sodium over days, and the correction must match the timescale of the adaptation.",
      },
      {
        type: "question",
        prompt: "What is the first priority in a patient with diabetic ketoacidosis?",
        answer: "The airway, the circulation and then the fluid resuscitation — the volume is depleted and the perfusion must be restored. Potassium is added to the fluid before insulin is given, because the potassium will fall when the acidosis is corrected and the insulin is started.",
        explanation: "The order is fluid, potassium, insulin: insulin drives potassium into cells, so giving insulin before the potassium has been established can precipitate a dangerous hypokalaemia.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A patient with diabetic ketoacidosis has a pH of 7.20, a bicarbonate of 9 and a markedly raised anion gap. What is the primary disturbance?",
        options: [
          "Respiratory alkalosis",
          "Metabolic acidosis with a raised anion gap",
          "Metabolic alkalosis with a raised gap",
          "Respiratory acidosis with a raised gap",
        ],
        correctIndex: 1,
        explanation: "A low pH with a low bicarbonate is a metabolic acidosis, and a raised anion gap indicates an added acid — ketoacids being consumed and not excreted.",
      },
      {
        type: "mcq",
        stem: "Which is the safest rate of sodium correction in chronic hyponatraemia?",
        options: [
          "As fast as possible to a normal value",
          "No more than about 10 millimoles per litre in the first 24 hours",
          "20 millimoles per litre in the first 24 hours",
          "Any rate, provided the patient is fluid restricted",
        ],
        correctIndex: 1,
        explanation: "Rapid correction of a chronic hyponatraemia causes osmotic demyelination, so the sodium is raised slowly and checked frequently.",
      },
      {
        type: "mcq",
        stem: "A patient with protracted vomiting has a pH of 7.52 and a bicarbonate of 34. What is the disturbance?",
        options: [
          "Metabolic alkalosis with a compensatory hypoventilation",
          "Respiratory alkalosis with a metabolic compensation",
          "Metabolic acidosis with a respiratory alkalosis",
          "Respiratory acidosis with a metabolic alkalosis",
        ],
        correctIndex: 0,
        explanation: "Vomiting loses gastric hydrogen ions, so the bicarbonate rises and the pH rises; the slow respiratory compensation retains carbon dioxide.",
      },
      {
        type: "mcq",
        stem: "Which is the correct order of treatment in diabetic ketoacidosis?",
        options: [
          "Insulin, potassium, fluid",
          "Fluid, potassium, insulin",
          "Potassium, insulin, fluid",
          "Fluid, insulin, bicarbonate",
        ],
        correctIndex: 1,
        explanation: "Fluid resuscitation first, then potassium replacement before insulin (because insulin drives potassium into cells), and bicarbonate is discouraged unless the acidosis is extreme. Correcting the pH may cause a catastrophic fall in extracellular potassium in a patient already depleted.",
      },
      {
        type: "mcq",
        stem: "What does the anion gap represent?",
        options: [
          "The difference between sodium and bicarbonate only",
          "The unmeasured anions that remain when bicarbonate has been consumed by an added acid",
          "The total protein in the plasma",
          "The rate of renal acid excretion",
        ],
        correctIndex: 1,
        explanation: "The anion gap (sodium minus chloride minus bicarbonate) reflects unmeasured anions; a raised gap means an added acid has consumed bicarbonate, and a normal gap means bicarbonate has been lost or chloride retained.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Fluid and electrolyte management is a calculation and a judgement: a weight-based maintenance regimen adjusted for measured losses, and an awareness of the water compartments it fills. The four acid-base disturbances are identified from the pH and the bicarbonate and carbon dioxide together, with the anion gap separating an added acid from a bicarbonate loss, and a compensation that is always judged. Correcting abnormalities has an order, and the order matters: potassium before insulin, and sodium slowly.",
      },
      {
        type: "paragraph",
        text: "Next: fever, inflammation and sepsis — where the cell and tissue pathology you learned meets the patient deteriorating on a general ward.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 4 — Fever, inflammation & sepsis (fully authored)
// ---------------------------------------------------------------------------
function lesson4() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the mechanism of fever and explain why a raising temperature produces chills; distinguish fever from hyperthermia and from heat stroke; define sepsis and septic shock under the Sepsis-3 definitions; describe the qSOFA and the SOFA instruments and their uses; and outline the first-hour management of septic shock.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "PATH 201 module 1 (inflammation), PHYS 101 module 1 (homeostasis and the thermal set point). Sepsis is inflammation and homeostasis gone systemic.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Sepsis",
        text: "Life-threatening organ dysfunction caused by a dysregulated host response to infection — not the infection alone, but the body's response to it becoming harmful to the host.",
      },
      {
        type: "paragraph",
        text: "That definition is a deliberate change from the old one, which relied on the systemic inflammatory response (a raised or lowered temperature, a raised heart rate, a raised respiratory rate, a raised or lowered white cell count). The modern definition deliberately drops the inflammatory markers, because they are neither sensitive nor specific, and defines sepsis by organ dysfunction instead — because it is the organ dysfunction that kills.",
      },

      { type: "heading", level: 2, text: "Worked example: how fever is produced" },
      {
        type: "table",
        headers: ["Step", "What happens", "Result"],
        rows: [
          ["1", "Bacterial products (such as lipopolysaccharide) or tissue injury release exogenous pyrogens", "The signal reaches the hypothalamus"],
          ["2", "Activated macrophages release interleukin-1, interleukin-6 and tumour necrosis factor", "The endogenous pyrogens reach the hypothalamus"],
          ["3", "Prostaglandin E2 is synthesised in the hypothalamus and raises the thermal set point", "The body now defends a higher temperature"],
          ["4", "Because the core temperature is below the new set point, the body generates heat", "Shivering and rigors, which are what the patient experiences on the way up"],
          ["5", "When the set point falls again, the temperature falls towards the lowered value", "Sweating and vasodilation — the patient 'breaks' the fever"],
        ],
      },
      {
        type: "paragraph",
        text: "The distinction from hyperthermia is important and examinated. Fever is a regulated elevation — the set point is raised and the body actively defends it. Hyperthermia is an unregulated rise: heat stroke, in which the body cannot lose heat fast enough, malignant hyperthermia caused by an anaesthetic, and severe thyroid storm. In hyperthermia the set point is normal and the body is trying and failing to cool itself; the treatment is physical cooling, whereas fever is treated by removing the cause and, when necessary, blocking prostaglandin synthesis.",
      },

      { type: "heading", level: 2, text: "Recognising sepsis" },
      {
        type: "paragraph",
        text: "The bedside instruments used in practice reflect the definition. The quick bedside screen, the qSOFA, asks three questions: is the respiratory rate 22 or more per minute, is there an altered mental state, and is the systolic pressure 100 or below? A positive screen raises the probability of sepsis, and prompts escalation and cultures, but it does not make the diagnosis.",
      },
      {
        type: "table",
        headers: ["Instrument", "What it is", "What it is for"],
        rows: [
          ["qSOFA (quick)", "Three bedside items — respiratory rate, mentation and systolic pressure", "Screening at the bedside for a patient who needs escalation"],
          ["SOFA", "A score across six organ systems — respiration, coagulation, liver, cardiovascular, renal and neurological", "Defining organ dysfunction: an increase of 2 or more from baseline defines sepsis"],
          ["Septic shock", "Sepsis plus a requirement for a vasopressor to keep the mean arterial pressure at or above 65 mmHg, plus a lactate above 2 mmol per litre after resuscitation", "The subgroup with the highest mortality, requiring intensive care"],
        ],
      },
      {
        type: "paragraph",
        text: "The organs most often failing first are the kidney (a rising creatinine and a falling urine output), the brain (confusion), the lung (oxygen requirement rising) and the circulation (blood pressure). A lactate above the level at which the body makes it under aerobic metabolism is the most direct evidence that the tissues are not being perfused, and a lactate that fails to fall after resuscitation is a marker of a poor outcome.",
      },

      { type: "heading", level: 2, text: "Clinical correlation: the first hour" },
      {
        type: "paragraph",
        text: "The management of a septic patient is time-based, and it is conventionally condensed into a one-hour bundle. Measure the lactate, take blood cultures before antibiotics, give broad-spectrum antibiotics within the first hour, and give rapid fluid resuscitation — about 30 millilitres per kilogram of crystalloid — for hypotension or a lactate above 4. Then assess the perfusion, and if it remains inadequate, start a vasopressor to maintain the mean arterial pressure.",
      },
      {
        type: "question",
        prompt: "Why is sepsis defined by organ dysfunction rather than by température, pulse and white cell count?",
        answer: "Because the inflammatory markers are neither sensitive nor specific — a raised temperature, pulse and respiratory rate also occur in pain, anxiety and many other conditions — and because it is the organ dysfunction, not the inflammatory markers, that determines survival.",
        explanation: "The definition deliberately concentrates on what kills, so that the diagnostic criteria and the treatment targets are the same.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a normal temperature excludes sepsis. Some patients — the elderly, the immunosuppressed, patients on antipyretics — do not mount a fever, and hypothermia in sepsis is a sign of a poor outcome.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Waiting for a full infection screen before starting antibiotics. In suspected sepsis, broad-spectrum antibiotics are given within the hour, and cultures are taken before the first dose rather than delaying it.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying fever is the temperature exceeding a particular number. Fever is a regulated elevation with a raised set point, so a temperature of 38.5 in a patient whose temperature is rising is a different event from the same number in a patient whose temperature is falling.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does a patient with a rising temperature get rigors while a patient with heat stroke does not?",
        answer: "Because in fever the set point is raised, so the body is defending a temperature higher than its own and generates heat by shivering. In heat stroke the set point is normal and the body is failing to lose heat, so it vasodilates and sweats — the opposite response.",
        explanation: "The two events are mechanistically opposite: fever is a regulated rise, heat stroke is a failed heat-loss response.",
      },
      {
        type: "question",
        prompt: "What are the first four actions in the first hour of septic shock?",
        answer: "Measure the lactate, take blood cultures before antibiotics, give broad-spectrum antibiotics within the hour, and give 30 millilitres per kilogram of crystalloid for hypotension or a lactate above 4.",
        explanation: "The bundle is deliberately short and time-based, because mortality rises with the delay in each of its elements.",
      },
      {
        type: "question",
        prompt: "Which organ systems are scored in the SOFA score?",
        answer: "Respiration, coagulation, liver, cardiovascular, renal and neurological.",
        explanation: "An increase of 2 or more from the patient's baseline indicates the organ dysfunction that defines sepsis.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which of these is part of the qSOFA bedside screen?",
        options: [
          "A respiratory rate of 22 or more, an altered mentation, and a systolic pressure of 100 or less",
          "A temperature of 38 degrees or more, a raised heart rate, and a raised white cell count",
          "A lactate above 4 millimoles",
          "A bicarbonate of 22 millimoles",
        ],
        correctIndex: 0,
        explanation: "qSOFA is three bedside items: respiratory rate, mentation and systolic blood pressure. The temperature-pulse-white cell count set belongs to the older criteria, which the Sepsis-3 definition deliberately dropped.",
      },
      {
        type: "mcq",
        stem: "What defines septic shock under Sepsis-3?",
        options: [
          "Sepsis plus a low blood pressure alone",
          "Sepsis plus a need for a vasopressor to keep the mean arterial pressure at or above 65 mmHg, and a lactate above 2 millimoles per litre after fluid",
          "Sepsis plus a temperature above 39 degrees",
          "Sepsis plus a raised white cell count",
        ],
        correctIndex: 1,
        explanation: "Septic shock requires a vasopressor requirement and a biochemical evidence of poor perfusion together, and it identifies the group requiring intensive care.",
      },
      {
        type: "mcq",
        stem: "A patient in a hot room has a core temperature of 40.5 degrees with hot dry skin and confusion. What is the diagnosis?",
        options: ["Fever from an infection", "Heat stroke — an unregulated rise with a normal set point", "Malignant hyperthermia", "Thyroid storm"],
        correctIndex: 1,
        explanation: "A normal set point with a failing heat-loss mechanism is heat stroke, treated by physical cooling. It is distinguished from fever, in which the set point is raised and the body is generating heat.",
      },
      {
        type: "mcq",
        stem: "Which of these does NOT characterise a rising fever?",
        options: ["Shivering and rigors", "Pallor from cutaneous vasoconstriction", "Sweating and flushing", "Cold peripheries"],
        correctIndex: 2,
        explanation: "Sweating and flushing indicate the set point is falling, so the body is losing heat. A rising fever produces rigors, pallor and cold peripheries, as the body generates and conserves heat.",
      },
      {
        type: "mcq",
        stem: "Which laboratory measurement best indicates that the tissues are not being perfused in septic shock?",
        options: ["Blood glucose", "Serum lactate", "Sodium", "Creatinine"],
        correctIndex: 1,
        explanation: "The lactate reflects anaerobic metabolism, and a lactate above 4 millimoles, or one that fails to fall after fluid resuscitation, is a marker of inadequate perfusion and of a poor outcome.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Fever is a regulated elevation of the thermal set point, driven by prostaglandin E2 in the hypothalamus, and the rigors of a rising fever are the body generating heat to reach the raised value. Heat stroke is the opposite — an unregulated rise with a normal set point. Sepsis is now defined by organ dysfunction from a dysregulated host response, with septic shock requiring vasopressor support and an elevated lactate, and its first hour of management is a short bundle of lactate, cultures, antibiotics and fluid.",
      },
      {
        type: "paragraph",
        text: "Next: the electrocardiogram, which is the single most useful test in internal medicine, and the one whose abnormalities you will meet daily on the wards.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 5 — The ECG & common arrhythmias (fully authored)
// ---------------------------------------------------------------------------
function lesson5() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe how the ECG is produced and label its waves and intervals; state the normal values of rate, PR interval and QRS duration; calculate the rate from the paper speed; distinguish a shockable from a non-shockable rhythm in a cardiac arrest; identify atrial fibrillation and complete heart block; and describe what changes in the ST segment mean in acute coronary syndrome.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "PHYS 101 (action potential and conduction), ANAT 101 (the mediastinum and the conducting system). The ECG is the extracellular record of a transmembrane event.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Electrocardiogram",
        text: "A recording, taken from electrodes on the body surface, of the electrical activity of the heart — a graph of the sum of the cardiac action potentials as a voltage against time.",
      },
      {
        type: "paragraph",
        text: "The ECG is extraordinary value for its cost, because it records what the muscle and the conducting system are doing electrically rather than what they are pumping. Its limitations are equally important: a normal ECG does not exclude coronary disease, and an abnormal one does not establish a diagnosis without the clinical picture. Learn to read it systematically, wave by wave and interval by interval, because a systematic reading finds the abnormality that a microsecond glance misses.",
      },

      { type: "heading", level: 2, text: "Worked example: reading an ECG systematically" },
      {
        type: "table",
        headers: ["Element", "Normal value", "What an abnormality means"],
        rows: [
          ["Rate", "60 to 100 per minute", "Below 60 is bradycardia; above 100 is tachycardia. At a standard paper speed of 25 mm per second, the number of large squares between beats divided into 300 gives the rate"],
          ["Rhythm", "Sinus: P before every QRS, with a regular interval", "An irregularly irregular rhythm with no P waves is atrial fibrillation; a regular rhythm with a rate under 50 may be a junctional rhythm"],
          ["P wave", "Upright and 0.12 seconds or less", "A prolonged P suggests atrial enlargement; absent P waves suggest atrial fibrillation"],
          ["PR interval", "0.12 to 0.20 seconds", "A prolonged interval is a conduction block between atrium and ventricle; a shortening suggests a pre-excitation"],
          ["QRS complex", "Under 0.12 seconds", "A widened complex suggests a conduction block in the ventricle, or a ventricular origin"],
          ["ST segment", "Isoelectric at baseline", "Elevation is the sign of current injury in an infarction; depression is ischaemia"],
          ["QT interval", "Under 440 milliseconds in men and 460 in women, corrected for rate", "Prolonged by electrolyte disturbance, drugs, and congenital disease; predisposes to arrhythmia"],
        ],
      },
      {
        type: "paragraph",
        text: "Calculate the rate simply: the standard paper runs at 25 mm per second, so one large square (five small squares) is 0.2 seconds, and a full second of recording is five large squares. The number of large squares between successive beats, divided into 300, gives the rate. This is a two-second skill to learn and it will be the arithmetic you use most.",
      },

      { type: "heading", level: 2, text: "Shockable and non-shockable rhythms" },
      {
        type: "table",
        headers: ["Rhythm", "Shockable?", "What to do"],
        rows: [
          ["Ventricular fibrillation (VF)", "Yes", "Immediate defibrillation, with cardiopulmonary resuscitation continued"],
          ["Ventricular tachycardia (pulseless)", "Yes", "Immediate defibrillation"],
          ["Asystole", "No", "Cardiopulmonary resuscitation, with adrenaline and reversible causes addressed"],
          ["Pulseless electrical activity (PEA)", "No", "Cardiopulmonary resuscitation, with adrenaline and reversible causes addressed"],
        ],
      },
      {
        type: "paragraph",
        text: "The distinction is the one decision made first in an arrest, and it is the reason a defibrillator is taken to a collapse before any other device. A shock stops the fibrillation and lets the heart re-organise; continuing chest compressions and adrenaline alone cannot. In the non-shockable rhythms the treatment is to find and fix the cause — hypoxia, hypovolaemia, hypo- or hyperkalaemia, hypothermia, tension pneumothorax, tamponade, thrombosis, toxins — which is the classic list of the reversible causes.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a normal ECG excludes a myocardial infarction. It does not, particularly early, and a normal trace taken during chest pain does not exclude an evolving infarction — the treatment decisions rest on the clinical picture and the troponin.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Reading the rhythm before the rate. Rate first, then rhythm, then the intervals, then the ST segments: a rate taken first is a two-second arithmetic check, and it prevents the common error of missing a bradycardic arrest while hunting for characteristic P waves.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying atrial fibrillation has P waves. There are no P waves, only irregular fibrillatory baseline activity — and the ventricular response is irregularly irregular.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "How do you calculate the heart rate from a rhythm strip?",
        answer: "At a paper speed of 25 millimetres per second, one large square is 0.2 seconds, so 300 divided by the number of large squares between beats gives the rate.",
        explanation: "The same arithmetic identifies the rate of any rhythm, and it is the fastest way to identify an arrest rhythm at first glance.",
      },
      {
        type: "question",
        prompt: "What is the difference between a shockable and a non-shockable rhythm, and why does it matter?",
        answer: "Ventricular fibrillation and pulseless ventricular tachycardia are shockable; asystole and pulseless electrical activity are not. The decision decides whether the first action is a shock or chest compressions and adrenaline, and it is made first in every arrest.",
        explanation: "In the non-shockable rhythms the priority is cardiopulmonary resuscitation and treating the reversible causes, not electricity.",
      },
      {
        type: "question",
        prompt: "What changes in the ST segment in acute coronary syndrome, and what does it mean?",
        answer: "ST elevation that is regional and persistent indicates acute transmural injury and the need for urgent reperfusion; ST depression and T-wave inversion indicate ischaemia without transmural injury.",
        explanation: "The distinction between an ST-elevation and a non-ST-elevation event determines the urgency of reperfusion, and the clinical picture and the troponin complete the diagnosis.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "What is the normal duration of the QRS complex?",
        options: ["Under 0.04 seconds", "Under 0.12 seconds", "0.12 to 0.20 seconds", "Under 0.30 seconds"],
        correctIndex: 1,
        explanation: "The QRS should be under 0.12 seconds (three small squares). A duration of 0.12 to 0.20 seconds is the normal range for the PR interval, and a value above it is a conduction delay.",
      },
      {
        type: "mcq",
        stem: "Which rhythm is shockable?",
        options: ["Asystole", "Pulseless electrical activity", "Ventricular fibrillation", "Complete heart block with a pulse"],
        correctIndex: 2,
        explanation: "Ventricular fibrillation and pulseless ventricular tachycardia are shockable; asystole and pulseless electrical activity are not.",
      },
      {
        type: "mcq",
        stem: "A patient has an irregularly irregular rhythm with no P waves and a ventricular rate of 130. What is the rhythm?",
        options: ["Sinus tachycardia", "Atrial fibrillation with a fast ventricular response", "Ventricular tachycardia", "Complete heart block"],
        correctIndex: 1,
        explanation: "Absent P waves with an irregularly irregular ventricular rhythm is atrial fibrillation; the ventricular rate is fast, so the response is fast as well.",
      },
      {
        type: "mcq",
        stem: "How many large squares on standard-speed ECG paper equal one second?",
        options: ["2", "5", "10", "25"],
        correctIndex: 1,
        explanation: "At 25 millimetres per second, five large squares (each 0.2 seconds) make one second, so 300 divided by the count of large squares between beats gives the rate.",
      },
      {
        type: "mcq",
        stem: "What is the normal range of the PR interval?",
        options: ["Under 0.08 seconds", "0.12 to 0.20 seconds", "0.20 to 0.30 seconds", "0.30 to 0.40 seconds"],
        correctIndex: 1,
        explanation: "The PR interval is measured from the beginning of P to the beginning of QRS and should be 0.12 to 0.20 seconds; a prolongation is atrioventricular conduction delay.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The ECG is a surface recording of the cardiac action potentials, read systematically as rate, rhythm, wave and interval, and interpreted with the clinical picture. A standard paper speed makes rate a simple arithmetic exercise, and the first decision in an arrest is whether the rhythm is shockable. ST elevation is injury and a signal for urgent reperfusion, and the abnormalities of the P wave, PR interval, QRS duration and QT interval indicate the conducting system, the electrolyte state and the drug exposure of the patient.",
      },
      {
        type: "paragraph",
        text: "Next: the approach to the acutely ill patient, where the skills of this module are combined into a single routine used for every deteriorating patient.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 6 — The approach to the acutely ill patient (fully authored)
// ---------------------------------------------------------------------------
function lesson6() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: recite the ABCDE approach in order and say what is assessed at each step; use the AVPU scale and the Glasgow Coma Scale to assess consciousness; identify the reversible causes of cardiac arrest and check for them in order; describe what an escalation call contains; and name the measurements to make on a deteriorating patient before, during and after treatment.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-5. This lesson combines the clinical method, the vital signs, the acid-base disciplines and the ECG into one routine for a deteriorating patient.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "ABCDE approach",
        text: "A structured assessment of a critically ill patient that follows the order in which the body fails — Airway, Breathing, Circulation, Disability and Exposure — because treating the earliest problem in that sequence makes every later one more survivable.",
      },
      {
        type: "paragraph",
        text: "The order is not arbitrary: it is the order in which the systems kill. A patient whose airway is obstructed will die in minutes of hypoxia before a blood pressure matters; a patient who is not breathing will die of hypoxia before a low blood pressure matters; a patient whose circulation has failed will die of organ hypoperfusion before a depressed level of consciousness matters. So the airway is treated first, always, and every other problem is deferred until the preceding one is at least temporarily corrected.",
      },

      { type: "heading", level: 2, text: "The sequence" },
      {
        type: "table",
        headers: ["Step", "What you look for", "What you do about it"],
        rows: [
          ["A — Airway", "Can the patient speak in full sentences? Is there snoring, gurgling, stridor, or blood or vomit in the airway? Is the neck protected if there is a possibility of cervical spine injury?", "Open the airway (head tilt and chin lift, or jaw thrust with c-spine control), clear obstruction, and call for an airway if it is not secure"],
          ["B — Breathing", "What is the respiratory rate, the oxygen saturation, and the chest movement? Are both sides present? Are there wheeze and crackles? Is tracheal deviation or asymmetry present?", "High-flow oxygen, chest drain for a tension pneumothorax, nebulisers for asthma, ventilatory support if exhaustion is imminent"],
          ["C — Circulation", "What is the pulse and the blood pressure? What is the capillary refill time? What is the jugular venous pressure? Is the heart rate regular?", "Intravenous access, fluid resuscitation of 30 millilitres per kilogram for hypotension or a raised lactate, blood transfusion for haemorrhage, a vasopressor if perfusion remains inadequate"],
          ["D — Disability", "What is the AVPU or Glasgow Coma Scale score? What are the pupils, the glucose and the temperature?", "Treat hypoglycaemia with glucose immediately; treat opioid toxicity with naloxone; look for a head injury, a seizure or an overdose"],
          ["E — Exposure", "Expose the whole patient, looking for rashes, wounds, bleeding, swelling and limb ischaemia — while keeping them warm", "Treat the cause once found — a purpuric rash in meningococcal sepsis, a pulsatile bleeding wound, a fractured limb"],
        ],
      },
      {
        type: "paragraph",
        text: "The routine is deliberately dynamic: you re-assess from the beginning whenever the patient's state changes, and you always re-check the airway after any intervention. The purpose of the fixed sequence is that it works under pressure, and that every member of the team knows what step is being addressed without a conversation.",
      },

      { type: "heading", level: 2, text: "Consciousness" },
      {
        type: "table",
        headers: ["Scale", "Levels", "Note"],
        rows: [
          ["AVPU", "Alert, responds to Voice, responds to Pain, Unresponsive", "A rapid bedside screen, usable by anyone, and the fastest to record"],
          ["Glasgow Coma Scale", "Eye opening (4), verbal response (5), and motor response (6), giving a maximum of 15", "The standard for recording and for trending, and the basis of the national early-warning scores"],
        ],
      },
      {
        type: "paragraph",
        text: "For both scales, the trend matters more than the absolute number, and a fall of two or more points is a reason to escalate. Hypoglycaemia is the one reversible cause that is checked first in any obtunded patient, because it is instantly treatable and because the diagnosis may be missed if attention is drawn to the trauma.",
      },

      { type: "heading", level: 2, text: "Reversible causes of cardiac arrest" },
      {
        type: "table",
        headers: ["Group", "Causes", "How they are excluded at the bedside"],
        rows: [
          ["Hypoxia", "Loss of airway or breathing", "Capnography and oxygen saturation, with airway management"],
          ["Hypovolaemia", "Haemorrhage, burns, vomiting, diarrhoea", "History and the signs of poor perfusion"],
          ["Hypo- or hyperkalaemia", "Electrolyte disturbance", "Immediate blood gas with electrolytes"],
          ["Hypothermia", "Exposure, immersion", "Measured temperature, and warmed resuscitation"],
          ["Tension pneumothorax", "Traumatic or spontaneous", "Examination of tracheal deviation and breath sounds, with immediate decompression"],
          ["Tamponade", "Traumatic, malignant, uraemic", "Ultrasound (FAST) or clinical suspicion with raised venous pressure"],
          ["Thrombosis", "Pulmonary embolism or myocardial infarction", "Clinical picture and, where relevant, immediate reperfusion"],
          ["Toxins", "Drug overdose, poisoning", "History, and the specific antidotes"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The list is a checklist to work through during arrest, not a list to memorise. It exists because most of the causes are treatable within minutes if they are thought of while the resuscitation continues.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Starting chest compressions before securing an airway in a patient whose airway is obstructed by vomit. Clearing the airway comes first in the sequence, because compressing a chest without oxygen in it only exhausts the rescuer.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating a full bladder or a fractured femur before the airway and breathing. E is not that late in the sequence for nothing, and the principle of the fixed order is that it is never reordered for convenience.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Escalating only when the patient is hypotensive. Deterioration is seen in the respiratory rate and in the level of consciousness and the trend, before the pressure falls — which is the whole purpose of an early-warning score.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why is airway assessed before circulation in a critically ill patient, even when the blood pressure is low?",
        answer: "Because a patient whose airway is obstructed cannot oxygenate whatever their blood pressure, and will die in minutes, whereas a patient with a failing circulation may survive for a period. The sequence is ordered by the time to death, not by the ease of treatment.",
        explanation: "The ABCDE order is a physiological order of failure, and it is why a c-spine-protecting jaw thrust comes before any cannula is inserted.",
      },
      {
        type: "question",
        prompt: "Name the reversible causes of cardiac arrest and say how you exclude hypoxia at the bedside.",
        answer: "Hypoxia, hypovolaemia, hypo- or hyperkalaemia, hypothermia, tension pneumothorax, tamponade, thrombosis and toxins. Hypoxia is excluded by managing the airway and observing the oxygen saturation and capnography with the patient's response.",
        explanation: "Excluding them during the arrest, not after it, is what makes resuscitation treatable rather than merely mechanical.",
      },
      {
        type: "question",
        prompt: "What is measured and recorded on a deteriorating patient?",
        answer: "The full set of vital signs, the level of consciousness, the temperature, the glucose if relevant, the urine output, and the response to each intervention — with the trend recorded and escalated.",
        explanation: "A trend is the point: a single set of measurements is less useful than the direction in which they are moving over time.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "What is the first step in the ABCDE assessment of a critically ill patient?",
        options: ["Circulation", "Airway", "Disability", "Exposure"],
        correctIndex: 1,
        explanation: "The airway is assessed first, because a patient whose airway is obstructed will die of hypoxia in minutes and cannot be resuscitated by any other intervention.",
      },
      {
        type: "mcq",
        stem: "Which is NOT one of the reversible causes of cardiac arrest?",
        options: ["Hypovolaemia", "Hyperkalaemia", "Hyponatraemia", "Tamponade"],
        correctIndex: 2,
        explanation: "The classic list covers hypo- and hyperkalaemia, not hyponatraemia. The correct list is hypoxia, hypovolaemia, hypo- or hyperkalaemia, hypothermia, tension pneumothorax, tamponade, thrombosis and toxins.",
      },
      {
        type: "mcq",
        stem: "A patient has a Glasgow Coma Scale of 11, falling from 15 the previous hour. What does that indicate?",
        options: [
          "Nothing in isolation", "A significant deterioration in the level of consciousness, requiring escalation", "Normal recovery", "The patient is sleeping",
        ],
        correctIndex: 1,
        explanation: "A fall of two or more points in the GCS is a deterioration, and the trend matters more than any single value — it indicates escalation and appropriate review.",
      },
      {
        type: "mcq",
        stem: "Which reversible cause is checked first in any patient with a depressed level of consciousness?",
        options: ["Hyperkalaemia", "Hypoglycaemia", "Tamponade", "Pulmonary embolism"],
        correctIndex: 1,
        explanation: "Hypoglycaemia is instantly reversible and easily overlooked, so a glucose measurement is taken at once in any obtunded patient.",
      },
      {
        type: "mcq",
        stem: "Which of the following indicates a raised lactate after volume resuscitation in septic shock?",
        options: [
          "It is an artefact of the resuscitation fluid",
          "It is evidence that the tissues are still not being perfused, and requires escalation",
          "It indicates the infection is controlled",
          "It indicates adequate perfusion",
        ],
        correctIndex: 1,
        explanation: "A failing-to-fall lactate indicates that cellular perfusion remains inadequate after resuscitation, and is a marker of a poor outcome.",
      },

      { type: "heading", level: 2, text: "Module summary and next" },
      {
        type: "paragraph",
        text: "This module has assembled the foundations of internal medicine: the clinical method, the vital signs and their physiology, the acid-base and electrolyte disciplines, fever and sepsis, the ECG, and the structured approach to a deteriorating patient. Every one of them is the same method — observe, characterise, form hypotheses, test, act — applied to a different object, and every one of them is now on the ward side of the bridge that the pre-clinical courses built.",
      },
      {
        type: "paragraph",
        text: "Next modules: cardiology, respiratory medicine, gastroenterology and hepatology, endocrinology, and nephrology, haematology and infectious disease, each of which takes the principles of this module into a body system.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Module 1 SBA items — one per concept, authored and machine-checked.
// ---------------------------------------------------------------------------
const MODULE_ONE_SBAS: SbaSeed[] = [
  {
    slug: "internal-medicine-foundations--clinical-method--sba",
    concept: "clinical-method",
    stem: "A patient reports sudden severe tearing chest pain radiating to the back, with a blood pressure of 82/50. Which diagnosis must be actively excluded?",
    options: [
      "Musculoskeletal chest pain, the commonest cause of these symptoms",
      "Aortic dissection, which is less common but rapidly fatal",
      "Anxiety-related chest pain",
      "Reflux oesophagitis, given the response to antacids",
    ],
    correctAnswer: "Aortic dissection, which is less common but rapidly fatal",
    explanation:
      "A differential must include the dangerous as well as the probable. Tearing chest pain radiating to the back with hypotension is the description of a dissecting aortic aneurysm — fatal within hours — so it is actively excluded rather than discounted by probability.",
    difficulty: "medium",
  },
  {
    slug: "internal-medicine-foundations--vital-signs--sba",
    concept: "vital-signs",
    stem: "What is the mean arterial pressure of a patient whose blood pressure is 100/50?",
    options: ["75 mmHg", "67 mmHg", "50 mmHg", "33 mmHg"],
    correctAnswer: "67 mmHg",
    explanation:
      "The pulse pressure is 50 mmHg, so the mean is the diastolic plus one third of the pulse pressure: 50 plus 17, which is about 67 mmHg. The mean, not the systolic, is the perfusion pressure of the organs, which is why a widened or narrowed pulse pressure changes the meaning of the same systolic figure.",
    difficulty: "medium",
  },
  {
    slug: "internal-medicine-foundations--fluid-acid-base--sba",
    concept: "fluid-acid-base",
    stem: "A patient with severe diarrhoea has a pH of 7.28, a bicarbonate of 14, a carbon dioxide of 28 and an anion gap of 9. What is the disturbance?",
    options: [
      "Metabolic acidosis with a raised anion gap",
      "Metabolic acidosis with a normal anion gap",
      "Respiratory acidosis with a normal gap",
      "Metabolic alkalosis with a normal gap",
    ],
    correctAnswer: "Metabolic acidosis with a normal anion gap",
    explanation:
      "The low pH with a low bicarbonate is a metabolic acidosis, and a normal anion gap (9) means the bicarbonate has been lost rather than consumed — the pattern of severe diarrhoea. The lowered carbon dioxide is the appropriate respiratory compensation.",
    difficulty: "hard",
  },
  {
    slug: "internal-medicine-foundations--fever-sepsis--sba",
    concept: "fever-sepsis",
    stem: "Which of these is part of the qSOFA bedside screen for sepsis?",
    options: [
      "A temperature of 38 degrees or more",
      "A respiratory rate of 22 or more, an altered mentation, and a systolic pressure of 100 or less",
      "A raised white cell count",
      "A positive blood culture",
    ],
    correctAnswer: "A respiratory rate of 22 or more, an altered mentation, and a systolic pressure of 100 or less",
    explanation:
      "qSOFA is three bedside items: respiratory rate, mentation and systolic blood pressure. Sepsis-3 deliberately dropped the inflammatory markers (temperature, pulse and white cell count), which are neither sensitive nor specific, in favour of organ dysfunction.",
    difficulty: "medium",
  },
  {
    slug: "internal-medicine-foundations--ecg-arrhythmias--sba",
    concept: "ecg-arrhythmias",
    stem: "Which rhythm is NOT shockable in a cardiac arrest?",
    options: ["Ventricular fibrillation", "Ventricular tachycardia without a pulse", "Asystole", "Ventricular tachycardia with a pulse"],
    correctAnswer: "Asystole",
    explanation:
      "Ventricular fibrillation and pulseless ventricular tachycardia are the shockable rhythms; asystole and pulseless electrical activity are treated by cardiopulmonary resuscitation plus adrenaline and the reversible causes.",
    difficulty: "easy",
  },
  {
    slug: "internal-medicine-foundations--assessment-of-the-ill-patient--sba",
    concept: "assessment-of-the-ill-patient",
    stem: "In a critically ill patient, why is the airway assessed before the circulation, even if the blood pressure is low?",
    options: [
      "Because the airway is simpler to assess than the circulation",
      "Because a patient whose airway is obstructed will die of hypoxia in minutes, whatever their pressure, so the sequence is ordered by the time to death",
      "Because intubation is painless",
      "Because the blood pressure is less reliable than the airway",
    ],
    correctAnswer:
      "Because a patient whose airway is obstructed will die of hypoxia in minutes, whatever their pressure, so the sequence is ordered by the time to death",
    explanation:
      "The ABCDE order is the physiological order in which systems kill: an obstructed airway cannot be bypassed, because no other intervention compensates for absent oxygenation.",
    difficulty: "medium",
  },
];

// ---------------------------------------------------------------------------
// Deeper modules 2-6: a real concept spine, tracked-placeholder lessons.
// ---------------------------------------------------------------------------
const DEEPER_LESSONS: LessonSeed[] = [
  // --- M2 Cardiology ---
  { title: "Approach to the cardiac patient", module: 2, estimatedMinutes: 30, authored: false, concept: { title: "Approach to the cardiac history and examination", slug: "cardiac-approach", summary: "Chest pain history, the cardiac examination including the murmur, and the interpretation of a syncopal episode.", blooms: "apply", minutes: 30, prereq: ["ecg-arrhythmias"] }, content: { blocks: [] } },
  { title: "Ischaemic heart disease", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Acute and chronic coronary syndromes", slug: "ischaemic-heart-disease", summary: "Atherosclerosis, stable and unstable angina, the acute coronary syndromes, and the treatment of the acute occlusion.", blooms: "apply", minutes: 40, prereq: ["cardiac-approach"] }, content: { blocks: [] } },
  { title: "Heart failure", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Heart failure", slug: "heart-failure", summary: "Systolic and diastolic failure, the compensatory mechanisms, the clinical picture of low and high output, and the treatment.", blooms: "apply", minutes: 40, prereq: ["ischaemic-heart-disease"] }, content: { blocks: [] } },
  { title: "Arrhythmias & conduction disease", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Arrhythmias and conduction disease", slug: "arrhythmias-conduction", summary: "The mechanisms of tachy- and bradyarrhythmias, the narrow and wide complex tachycardias, and the indications for pacing.", blooms: "apply", minutes: 40, prereq: ["ecg-arrhythmias"] }, content: { blocks: [] } },
  { title: "Valvular & structural heart disease", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Valvular and structural heart disease", slug: "valvular-disease", summary: "The murmurs of the principal valve lesions, their consequences, and the indications for surgical intervention.", blooms: "apply", minutes: 40, prereq: ["cardiac-approach"] }, content: { blocks: [] } },

  // --- M3 Respiratory medicine ---
  { title: "Approach to the respiratory patient", module: 3, estimatedMinutes: 30, authored: false, concept: { title: "Approach to the respiratory patient", slug: "respiratory-approach", summary: "The history and examination of the respiratory system, and the interpretation of a chest radiograph.", blooms: "apply", minutes: 30, prereq: ["vital-signs"] }, content: { blocks: [] } },
  { title: "Asthma & chronic obstructive pulmonary disease", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Asthma and chronic obstructive pulmonary disease", slug: "asthma-copd", summary: "The two obstructive diseases, their triggers, their acute decompensation and the stepwise treatment of each.", blooms: "apply", minutes: 40, prereq: ["respiratory-approach"] }, content: { blocks: [] } },
  { title: "Pneumonia & pleural disease", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Pneumonia and pleural disease", slug: "pneumonia-pleural", summary: "Community and hospital-acquired pneumonia, empyema and effusions, and the criteria for hospitalization.", blooms: "apply", minutes: 40, prereq: ["respiratory-approach"] }, content: { blocks: [] } },
  { title: "Thromboembolic disease & pulmonary hypertension", module: 3, estimatedMinutes: 35, authored: false, concept: { title: "Pulmonary embolism and pulmonary hypertension", slug: "pulmonary-embolism", summary: "The pathophysiology of pulmonary embolism, the diagnostic approach to it, and the treatment including thrombolysis.", blooms: "analyze", minutes: 35, prereq: ["fever-sepsis"] }, content: { blocks: [] } },
  { title: "Interstitial & neoplastic lung disease", module: 3, estimatedMinutes: 35, authored: false, concept: { title: "Interstitial and neoplastic lung disease", slug: "interstitial-lung-disease", summary: "The interstitial lung diseases, lung cancer by cell type, and the principles of palliative respiratory care.", blooms: "apply", minutes: 35, prereq: ["respiratory-approach"] }, content: { blocks: [] } },

  // --- M4 Gastroenterology & hepatology ---
  { title: "Approach to the GI & abdominal patient", module: 4, estimatedMinutes: 35, authored: false, concept: { title: "Approach to the gastrointestinal patient", slug: "gastroenterology-approach", summary: "Abdominal pain history, the examination of the abdomen, and the functional presentation of dysphagia.", blooms: "apply", minutes: 35, prereq: ["clinical-method"] }, content: { blocks: [] } },
  { title: "Peptic ulcer & upper GI disease", module: 4, estimatedMinutes: 35, authored: false, concept: { title: "Peptic ulcer and upper GI disease", slug: "peptic-ulcer", summary: "Gastric and duodenal ulceration, Helicobacter pylori, gastro-oesophageal reflux and the intestinal bleeding from the upper tract.", blooms: "apply", minutes: 35, prereq: ["gastroenterology-approach"] }, content: { blocks: [] } },
  { title: "Inflammatory bowel disease & the colon", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Inflammatory bowel disease and the colon", slug: "inflammatory-bowel-disease", summary: "Crohn's disease and ulcerative colitis, the small bowel, diverticular disease and colorectal cancer.", blooms: "apply", minutes: 40, prereq: ["gastroenterology-approach"] }, content: { blocks: [] } },
  { title: "Liver disease", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Liver disease", slug: "liver-disease", summary: "Acute liver failure, the chronic hepatitides, cirrhosis and its complications, and the management of ascites.", blooms: "apply", minutes: 40, prereq: ["gastroenterology-approach"] }, content: { blocks: [] } },
  { title: "Pancreas & biliary disease", module: 4, estimatedMinutes: 35, authored: false, concept: { title: "Pancreatic and biliary disease", slug: "pancreatic-biliary-disease", summary: "Acute and chronic pancreatitis, gallstone disease, cholangitis, and carcinoma of the pancreas and gallbladder.", blooms: "apply", minutes: 35, prereq: ["liver-disease"] }, content: { blocks: [] } },

  // --- M5 Endocrinology & metabolic medicine ---
  { title: "Endocrine assessment & the thyroid", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Endocrine assessment and the thyroid", slug: "endocrine-approach", summary: "The interpretation of thyroid function, hypothyroidism and thyrotoxicosis including Graves' disease, and the thyroid eye emergencies.", blooms: "apply", minutes: 35, prereq: ["clinical-method"] }, content: { blocks: [] } },
  { title: "Diabetes mellitus", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Diabetes mellitus", slug: "diabetes-mellitus", summary: "Type 1 and type 2 diabetes, their acute complication and chronic microvascular and macrovascular complications, and the insulin and oral treatments.", blooms: "apply", minutes: 40, prereq: ["fluid-acid-base"] }, content: { blocks: [] } },
  { title: "Adrenal, pituitary & gonadal disorders", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Adrenal, pituitary and gonadal disorders", slug: "adrenal-pituitary-gonadal", summary: "Adrenal failure and excess, the pituitary hormone disorders, the gonadal dysfunctions and the disorders of calcium and phosphate.", blooms: "analyze", minutes: 45, prereq: ["endocrine-approach"] }, content: { blocks: [] } },
  { title: "Lipid disorders & metabolic bone disease", module: 5, estimatedMinutes: 30, authored: false, concept: { title: "Lipids, obesity and bone metabolism", slug: "lipids-obesity-bone", summary: "The classification and management of lipid disorders, obesity and its complications, and the metabolic bone diseases.", blooms: "apply", minutes: 35, prereq: ["endocrine-approach"] }, content: { blocks: [] } },
  { title: "Endocrine emergencies", module: 5, estimatedMinutes: 30, authored: false, concept: { title: "Endocrine emergencies", slug: "endocrine-emergencies", summary: "The diabetic emergencies of DKA and HHS, thyroid storm, myxoedema coma and the Addisonian and adrenal crises.", blooms: "apply", minutes: 30, prereq: ["diabetes-mellitus"] }, content: { blocks: [] } },

  // --- M6 Nephrology, haematology & infectious disease ---
  { title: "Renal disease & acute kidney injury", module: 6, estimatedMinutes: 40, authored: false, concept: { title: "Renal disease and acute kidney injury", slug: "renal-disease-aki", summary: "Acute kidney injury, the glomerulonephritides, chronic kidney disease and its complications, and the indications for dialysis.", blooms: "apply", minutes: 40, prereq: ["fluid-acid-base"] }, content: { blocks: [] } },
  { title: "Urinary tract disease", module: 6, estimatedMinutes: 30, authored: false, concept: { title: "Urinary tract and prostate disease", slug: "urinary-tract-disease", summary: "Urinary infection, haematuria and its investigation, urinary tract stones, and the obstructive and prostatic diseases.", blooms: "apply", minutes: 30, prereq: ["renal-disease-aki"] }, content: { blocks: [] } },
  { title: "Haematology: anaemia & haemostasis", module: 6, estimatedMinutes: 40, authored: false, concept: { title: "Haematology: anaemia and haemostatic disorders", slug: "anaemia-haemostasis", summary: "The classification of anaemias, the clotting disorders, thrombosis and anticoagulation, and the transfusion practice.", blooms: "apply", minutes: 40, prereq: ["fluid-acid-base"] }, content: { blocks: [] } },
  { title: "Haematological malignancy", module: 6, estimatedMinutes: 35, authored: false, concept: { title: "Haematological malignancy", slug: "haematological-malignancy", summary: "The leukaemias, the lymphomas, myeloma and myelodysplasia, and the supportive care of the immunosuppressed.", blooms: "apply", minutes: 40, prereq: ["anaemia-haemostasis"] }, content: { blocks: [] } },
  { title: "Infectious disease & tropical medicine", module: 6, estimatedMinutes: 40, authored: false, concept: { title: "Infectious disease and tropical medicine", slug: "infectious-disease", summary: "The common tropical illnesses — malaria, typhoid, HIV, tuberculosis — and the approach to pyrexia of unknown origin.", blooms: "apply", minutes: 40, prereq: ["fever-sepsis"] }, content: { blocks: [] } },
  { title: "Rheumatology, neurology & dermatology in general medicine", module: 6, estimatedMinutes: 35, authored: false, concept: { title: "Rheumatology and general medicine", slug: "rheumatology-general", summary: "The inflammatory arthritides, connective tissue disease, vasculitis, and the chronic neurological and dermatological problems seen on medical take.", blooms: "analyze", minutes: 40, prereq: ["endocrine-emergencies"] }, content: { blocks: [] } },
];

export const MEDICINE: SubjectSeed = {
  id: "course-internal-medicine",
  slug: "internal-medicine-foundations",
  title: "Internal Medicine — Foundations & Systems",
  code: "MED 301",
  department: "Internal Medicine",
  level: 300,
  credits: 8,
  semester: "full",
  description:
    "Clinical medicine for the medical wards: the clinical method, the vital signs and their interpretation, fluid, electrolyte and acid-base management, fever, sepsis and the acutely ill patient, and then the cardiology, respiratory, gastrointestinal, endocrine, renal, haematological and infectious diseases that a general physician treats.",
  faculty: "clinical-medicine",
  modules: MODULES,
  lessons: [
    { title: "The clinical method", module: 1, estimatedMinutes: 35, authored: true, concept: { title: "The clinical method", slug: "clinical-method", summary: "The history, the examination, the differential, and the reasoning processes that convert an illness into a decision.", blooms: "understand", minutes: 35, prereq: [] }, content: lesson1() as never },
    { title: "Vital signs and what they mean", module: 1, estimatedMinutes: 30, authored: true, concept: { title: "Vital signs and what they mean", slug: "vital-signs", summary: "The reference ranges, pulse pressure and mean arterial pressure, the classification of blood pressure, and the combinations that signal shock.", blooms: "apply", minutes: 30, prereq: ["clinical-method"] }, content: lesson2() as never },
    { title: "Fluid, electrolyte & acid-base balance", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Fluid, electrolyte and acid-base balance", slug: "fluid-acid-base", summary: "The water compartments and maintenance fluid, the electrolyte disturbances, and the four primary acid-base disturbances with their compensation.", blooms: "apply", minutes: 40, prereq: ["vital-signs"] }, content: lesson3() as never },
    { title: "Fever, inflammation & sepsis", module: 1, estimatedMinutes: 35, authored: true, concept: { title: "Fever, inflammation and sepsis", slug: "fever-sepsis", summary: "The mechanism of fever, hyperthermia and heat stroke, the Sepsis-3 definitions, the qSOFA and SOFA instruments, and the first-hour bundle.", blooms: "apply", minutes: 35, prereq: ["clinical-method"] }, content: lesson4() as never },
    { title: "The ECG & common arrhythmias", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "The ECG and common arrhythmias", slug: "ecg-arrhythmias", summary: "A systematic reading of the ECG, the normal intervals, the shockable and non-shockable rhythms, atrial fibrillation and the ST changes of ischaemia.", blooms: "apply", minutes: 40, prereq: ["clinical-method"] }, content: lesson5() as never },
    { title: "The approach to the acutely ill patient", module: 1, estimatedMinutes: 35, authored: true, concept: { title: "The approach to the acutely ill patient", slug: "assessment-of-the-ill-patient", summary: "The ABCDE approach, the assessment of consciousness, the reversible causes of arrest, and the escalation of a deteriorating patient.", blooms: "apply", minutes: 35, prereq: ["fever-sepsis", "ecg-arrhythmias"] }, content: lesson6() as never },
    ...DEEPER_LESSONS,
  ],
  sbas: MODULE_ONE_SBAS,
  prereqCourses: [
    "gross-anatomy-i",
    "physiology-cell-and-general",
    "medical-biochemistry-i",
    "pathology-cell-injury-repair",
    "pharmacology-foundations",
  ],
};

export async function seedMbbsMedicine() {
  return seedMbbsCourse(MEDICINE);
}

/** Idempotent: safe to run repeatedly; upserts on stable keys. */
export async function seedMedicine(): Promise<void> {
  await seedMbbsMedicine();
}

export default MEDICINE;

// CLI usage: npx ts-node prisma/seed-courses/mbbs/medicine.ts
if (process.argv[1] && process.argv[1].includes("mbbs/medicine")) {
  seedMedicine()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
