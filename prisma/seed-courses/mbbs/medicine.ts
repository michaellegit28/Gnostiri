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
// LESSON 7 — Heart failure (fully authored)
// ---------------------------------------------------------------------------
function lesson7() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define heart failure in terms of cardiac output and filling pressures; distinguish reduced, mildly reduced and preserved ejection fraction and name the commonest cause of each; explain how the sympathetic, renin-angiotensin-aldosterone and natriuretic peptide responses compensate and then become harmful; separate the clinical picture of left-sided from right-sided failure; list the investigations that establish the diagnosis and its cause; and outline the four disease-modifying drug classes and the management of acute decompensation.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "PHYS 101 (the Frank-Starling mechanism, the determinants of cardiac output and the vasomotor reflexes), MED 301 lesson 2 (the vital signs and the interpretation of blood pressure), lesson 5 (the ECG), and the pathology of myocardial infarction and of hypertrophy from PATH 201.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Heart failure",
        text: "A clinical syndrome in which the heart cannot deliver the cardiac output the tissues require at normal filling pressures, or can do so only when those filling pressures are raised — so the patient is limited or congested (or both) at rest or on exercise.",
      },
      {
        type: "paragraph",
        text: "The definition is deliberately about function rather than about the ejection fraction, because a patient whose ventricle ejects a normal fraction may still be breathless and oedematous, and a patient with a badly damaged ventricle may have no symptoms yet. Two facts follow from the definition and drive everything else. First, the heart is a pump with a limited output, so when it fails the body defends the output rather than the filling pressure. Second, the defence — sympathetic activation and salt and water retention — improves output for days and then destroys the myocardium and floods the lungs over years. Heart failure is therefore a disease of compensation as much as of the muscle.",
      },
      {
        type: "definition",
        term: "Congestion",
        text: "The accumulation of fluid behind the failing ventricle: pulmonary congestion when the left side fails and systemic congestion when the right side fails. Congestion is the symptom-generating part of the syndrome and the part that diuretics relieve.",
      },
      {
        type: "paragraph",
        text: "Heart failure is also a terminal common pathway rather than a single disease. It is what ischaemic heart disease, hypertension, valve disease, atrial fibrillation, alcohol, chemotherapy and cardiomyopathy all converge on, which is why establishing the cause is part of the diagnosis rather than an optional extra: the cause determines whether the failure is reversible and which additional treatment is indicated.",
      },

      { type: "heading", level: 2, text: "The phenotypes" },
      {
        type: "table",
        headers: ["Phenotype", "Ejection fraction", "What is wrong", "Commonest causes"],
        rows: [
          ["Reduced (HFrEF)", "Below 40 percent", "The ventricle is dilated and weak: a systolic problem, in which the muscle cannot generate enough pressure to empty the chamber", "Coronary disease and myocardial infarction, dilated cardiomyopathy, alcohol, valvular regurgitation, chemotherapy"],
          ["Mildly reduced (HFmrEF)", "41 to 49 percent", "A mixed systolic and filling problem, previously called mid-range failure", "Coronary disease, hypertension, and the overlap of both mechanisms"],
          ["Preserved (HFpEF)", "50 percent or more", "The ventricle is stiff and cannot relax: a diastolic problem, in which filling requires a higher pressure", "Hypertensive heart disease, ageing, diabetes, obesity, atrial fibrillation"],
          ["High output", "Preserved and often hyperdynamic", "The pump is normal but the demand is excessive or the systemic resistance has fallen", "Severe anaemia, thyrotoxicosis, arteriovenous fistula, Paget's disease, beriberi"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The distinction matters for treatment. The evidence that ACE inhibitors, beta-blockers, mineralocorticoid receptor antagonists and SGLT2 inhibitors save lives was established in reduced ejection fraction; in preserved ejection fraction only the SGLT2 inhibitors have proven benefit on top of treating the cause. Around half of all heart failure admissions are HFpEF, and they are the group in which the correct diagnosis is most often missed.",
      },
      {
        type: "paragraph",
        text: "Preserved failure is worth understanding rather than merely labelling, because it explains the patient. The stiff ventricle empties normally, so resting cardiac output may be normal; but the ventricle cannot fill without an elevated atrial pressure, and that pressure is transmitted backwards into the lungs. Breathlessness is therefore produced by exertion (which shortens diastole) and by lying flat (which increases venous return), while the ejection fraction is measured as normal.",
      },

      { type: "heading", level: 2, text: "Compensation, and how it becomes the disease" },
      {
        type: "table",
        headers: ["Mechanism", "What it does at first", "What it costs later"],
        rows: [
          ["Sympathetic activation", "Raises heart rate and contractility and constricts the arterioles, defending blood pressure and output", "Increases myocardial oxygen demand, promotes arrhythmia, and down-regulates beta receptors so the failing heart becomes less responsive"],
          ["Renin-angiotensin-aldosterone activation", "Retains sodium and water, expanding preload and maintaining stroke volume by the Frank-Starling mechanism", "Raises filling pressures into the lungs and periphery, causes vasoconstriction, and drives fibrosis and remodelling of the myocardium"],
          ["Ventricular remodelling", "The chamber dilates and hypertrophies, which raises wall stress and output", "Wall stress is itself the signal for further remodelling, so the ventricle becomes progressively more dilated and less efficient"],
          ["Natriuretic peptides", "Released by the stretched atria and ventricles: promote sodium and water loss and oppose the renin system", "Overwhelmed by the neurohormonal response, and degraded by neprilysin — which is why the peptides can be measured to make the diagnosis and protected by drugs to treat it"],
        ],
      },
      {
        type: "paragraph",
        text: "This is the single most important idea in the subject, and it explains the paradox of therapy: every drug that most improves survival works by blocking a compensatory mechanism. Blocking the sympathetic drive, blocking angiotensin and aldosterone, and protecting the natriuretic peptides all worsen the measured ejection fraction for a few weeks while extending life for years.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "A drug that improves symptoms may not improve survival, and a drug that improves survival may make the patient feel worse for a fortnight. Loop diuretics relieve congestion faster than anything else and have never been shown to prolong life; the four pillars below prolong life and may not make the patient feel better on the day they are started.",
      },

      { type: "heading", level: 2, text: "Left-sided and right-sided failure" },
      {
        type: "table",
        headers: ["", "Left-sided failure", "Right-sided failure"],
        rows: [
          ["Where pressure rises", "Left atrium and pulmonary veins", "Right atrium and systemic veins"],
          ["Cardinal symptom", "Breathlessness, worse on exertion and on lying flat, with waking at night gasping", "Ankle swelling, abdominal bloating and early satiety, and fatigue"],
          ["Positional feature", "Orthopnoea (the number of pillows used to sleep) and paroxysmal nocturnal dyspnoea", "Swelling that accumulates through the day and settles overnight"],
          ["Examination", "Bilateral basal crackles, a pleural effusion, a displaced apex beat, a third heart sound, tachypnoea", "Raised jugular venous pressure with systolic v waves, pitting oedema, hepatomegaly, ascites, a raised venous pressure in the limbs"],
          ["Associated findings", "Nocturia, cough, frothy sputum in pulmonary oedema", "Nausea, jaundice of congestion, weight gain from fluid"],
          ["Commonest cause", "Ischaemia, hypertension, aortic and mitral valve disease, atrial fibrillation", "Left-sided failure; or intrinsic right disease — cor pulmonale from lung disease, pulmonary embolism, pulmonary hypertension, right infarction"],
        ],
      },
      {
        type: "paragraph",
        text: "The two sides are commonly combined, because the failure of one raises the pressure on the other and because the causes overlap. What matters is that the dominant direction of congestion determines which symptom the patient reports. A patient who complains of swelling rather than of breath may still have a ventricle that ejects only 25 percent, and the temptation to treat the oedema as hepatic or venous disease is a real diagnostic trap.",
      },

      { type: "heading", level: 2, text: "Recognising it at the bedside" },
      {
        type: "table",
        headers: ["Domain", "What is assessed", "Interpretation"],
        rows: [
          ["Symptoms", "Breathlessness at rest and on exertion, orthopnoea, paroxysmal nocturnal dyspnoea, fatigue, exercise intolerance", "The symptoms are sensitive but not specific: they overlap with lung disease, obesity, anaemia and anxiety"],
          ["Congestive signs", "Raised jugular venous pressure, crackles at the bases, peripheral pitting oedema, weight gain of more than 2 kilograms in days", "The combination of a raised venous pressure with either crackles or oedema is the most useful bedside pattern"],
          ["Hypoperfusion", "Cool peripheries, a narrow pulse pressure, confusion, oliguria, narrow pulse pressure with a raised venous pressure", "Congestion plus hypoperfusion is the pattern of the lowest output and the highest acute risk"],
          ["Daily weights and fluid balance", "Weight measured each morning at the same time; a chart of intake and urine output", "The earliest and most reliable detector of decompensation, and the number that guides diuretic titration at home"],
        ],
      },

      { type: "heading", level: 2, text: "Diagnosis, severity of function, and the cause" },
      {
        type: "table",
        headers: ["Investigation", "Finding", "What it contributes"],
        rows: [
          ["Natriuretic peptide (BNP or NT-proBNP)", "A level below the rule-out threshold (BNP under 100, NT-proBNP under 300 nanograms per litre) makes untreated heart failure very unlikely; a very high level makes it very likely", "The best single test for excluding the diagnosis in a breathless patient, and the best prognostic marker"],
          ["Echocardiography", "Ejection fraction, chamber size, wall thickness, valve function, regional wall motion, diastolic filling", "The investigation that classifies the phenotype and identifies a treatable cause such as valve disease"],
          ["Chest radiograph", "Cardiomegaly, upper-lobe diversion, Kerley B lines, pleural effusions, alveolar shadowing", "Distinguishes pulmonary oedema from pneumonia and hyperinflation in a breathless patient"],
          ["Electrocardiogram", "Q waves, left ventricular hypertrophy, atrial fibrillation, bundle branch block, broad complexes", "A completely normal ECG makes a reduced ejection fraction unlikely and points towards a preserved phenotype"],
          ["Bloods", "Renal function, electrolytes, haemoglobin, thyroid function, ferritin and transferrin saturation, glucose and lipids", "Detects a precipitant (anaemia, renal impairment), a cause (thyroid disease, iron deficiency) and guides safe titration"],
          ["Further testing", "Coronary angiography or CT angiography, cardiac MRI, an exercise test, a myocardial biopsy in selected cases", "Establishes the aetiology — ischaemia, infiltrative disease, inflammation, or cardiomyopathy"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Natriuretic peptides are raised by age, renal impairment and atrial fibrillation, and are lowered by obesity — so an intermediate result in a patient with more than one of these is interpreted against the clinical picture rather than on its own.",
      },
      { type: "heading", level: 2, text: "The NYHA functional classification" },
      {
        type: "table",
        headers: ["Class", "Limitation", "Typical activity"],
        rows: [
          ["I", "No limitation of ordinary physical activity", "Climbs stairs and walks on the flat without symptoms"],
          ["II", "Slight limitation: comfortable at rest, symptomatic on ordinary exertion", "Breathless climbing one flight of stairs or walking uphill"],
          ["III", "Marked limitation: comfortable at rest, symptomatic on less than ordinary exertion", "Breathless walking on the flat or dressing"],
          ["IV", "Unable to carry out any activity without symptoms, or symptomatic at rest", "Breathless sitting in a chair"],
        ],
      },

      { type: "heading", level: 2, text: "Treatment: the four pillars" },
      {
        type: "table",
        headers: ["Class", "Examples", "What it does", "Cautions"],
        rows: [
          ["Angiotensin receptor neprilysin inhibitor, or an ACE inhibitor or an angiotensin receptor blocker", "Sacubitril-valsartan, enalapril or ramipril, losartan or valsartan", "Reduces preload and afterload, blocks the maladaptive neurohormonal response and reduces mortality and hospitalisation", "Monitor renal function and potassium, start low and titrate; a cough on an ACE inhibitor (bradykinin) prompts a switch to an angiotensin blocker; a rise in creatinine of more than 30 percent prompts review"],
          ["Beta-blocker", "Bisoprolol, carvedilol, metoprolol succinate (nebivolol where carvedilol is not tolerated)", "Blocks the sympathetic drive, improves ejection fraction, reduces sudden death and mortality", "Only three agents have evidence; start low and double at intervals of at least two weeks once the patient is stable; do not start while the patient is congested or decompensated; a transient worsening of symptoms is common"],
          ["Mineralocorticoid receptor antagonist", "Spironolactone, eplerenone", "Blocks aldosterone, prevents fibrosis, reduces mortality in symptomatic reduced failure and in post-infarction failure", "Monitor potassium and renal function; gynaecomastia with spironolactone; avoid in renal impairment with a rising potassium"],
          ["SGLT2 inhibitor", "Dapagliflozin, empagliflozin", "Originally glucose-lowering drugs: reduce hospitalisation and mortality in reduced and in preserved failure, and also slow renal decline", "Genital and urinary infections, euglycaemic ketoacidosis rarely, and a small initial diuresis; benefit within weeks and independent of diabetes status"],
        ],
      },
      {
        type: "paragraph",
        text: "The four classes are complementary rather than alternatives, and the target is all four unless one is contraindicated or not tolerated. Therapy is titrated: a low starting dose, then reassessment of renal function, potassium, blood pressure and symptoms within one to two weeks, and then a step upward. Devices sit alongside: an implantable defibrillator in a ventricular ejection fraction below 35 percent despite optimal medical therapy, and cardiac resynchronisation therapy when the QRS is broad with left bundle branch block morphology.",
      },
      {
        type: "paragraph",
        text: "Loop diuretics — furosemide, bumetanide, torsemide — are the congestion drugs, and are adjusted to the patient's weight and fluid balance rather than to a fixed dose. Digoxin has a narrow role: it reduces hospitalisation in patients who remain symptomatic despite other therapy, particularly with atrial fibrillation. Ivabradine slows the sinus rate and helps patients in sinus rhythm with a heart rate above 70 who cannot take a beta-blocker.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Do not start a beta-blocker during acute decompensation, and do not stop it reflexively on admission unless the patient is shocked or inotrope-dependent. Withdrawal of chronic beta-blocker therapy in the acutely decompensated patient is associated with worse survival, so the dose is reduced or continued rather than stopped.",
      },

      { type: "heading", level: 2, text: "Acute decompensated heart failure" },
      {
        type: "table",
        headers: ["Picture", "Physiology", "Acute management"],
        rows: [
          ["Warm and wet (most common)", "Congested with an adequate blood pressure — pulmonary oedema and peripheral oedema with preserved perfusion", "Intravenous loop diuretic, oxygen for hypoxaemia, vasodilator to reduce preload, and treatment of the precipitant"],
          ["Cold and wet (worst prognosis)", "Congested and hypoperfused — cool peripheries, oliguria, confusion, narrowed pulse pressure", "Inotropic support, urgent review for mechanical support, and intensive care referral; diuresis alone will not rescue a failing perfusion"],
          ["Warm and dry", "Compensated failure on treatment", "Continue and optimise the oral regimen, treat the precipitant, and arrange follow-up"],
          ["Cold and dry", "Low output without congestion, usually from over-diuresis", "Careful fluid replacement and review of the diuretic dose before escalating inotropes"],
        ],
      },
      {
        type: "paragraph",
        text: "The precipitant is found in almost every admission and is often more urgent than the failure itself: infection, myocardial infarction, arrhythmia (particularly atrial fibrillation with a fast rate), anaemia, thyroid disease, renal impairment, a missed dose or a dietary salt and water load, a new drug (a non-steroidal anti-inflammatory, a thiazolidinedione, a negative inotrope), and pregnancy.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Non-invasive ventilation is reserved for respiratory failure that persists despite medical therapy in cardiogenic pulmonary oedema: it improves oxygenation and reduces the work of breathing while the diuresis takes effect, and reduces the need for intubation in the sickest patients.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Diagnosing chronic lung disease in a patient with breathlessness because the lungs are the obvious focus. Heart failure presents with exactly the same symptom, so a raised jugular venous pressure, displaced apex beat and natriuretic peptide are checked in every breathless patient.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating a normal ejection fraction as excluding heart failure. Preserved failure is diagnosed on the combination of symptoms, raised filling pressures and a normal ejection fraction, and it is the commonest presentation in elderly women and in hypertensive patients.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Titrating diuretics alone. Diuretics are essential for congestion but do not modify the disease: a patient admitted repeatedly with congestion who is not on an angiotensin blocker, a beta-blocker, a mineralocorticoid receptor antagonist and an SGLT2 inhibitor has not received disease-modifying treatment.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Prescribing a non-steroidal anti-inflammatory drug to a patient with heart failure. These drugs cause sodium retention, blunt diuretic response and worsen renal function, and are among the commonest precipitating drugs in an admission.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why do the drugs that prolong life in heart failure initially make some patients feel worse, and how does that fit with the definition of the syndrome?",
        answer: "Because they block the compensatory mechanisms that are temporarily maintaining cardiac output: sympathetic drive and the renin-angiotensin-aldosterone system. Blocking them lowers blood pressure and can transiently worsen fatigue for a fortnight or two, which is why the dose is started low and titrated; the benefit comes from halting remodelling, and appears over months.",
        explanation: "Symptom relief and disease modification are separate targets, and the diuretics treat the first while the four pillars treat the second.",
      },
      {
        type: "question",
        prompt: "A patient reports breathlessness on climbing one flight of stairs and sleeping on two pillows rather than one. Which features of heart failure are described, and what would you expect to find on examination?",
        answer: "Effort breathlessness with orthopnoea — left-sided failure. On examination: a raised jugular venous pressure, bilateral basal crackles, a displaced apex beat, a third heart sound, and possibly a pleural effusion and ankle oedema if biventricular.",
        explanation: "Orthopnoea is a specific symptom because it reflects the elevation of left atrial pressure that appears on recumbency.",
      },
      {
        type: "question",
        prompt: "How is acute decompensated heart failure classified at the bedside, and why does the classification matter?",
        answer: "By perfusion (warm or cold) and congestion (wet or dry). Warm and wet is congested with an adequate perfusion and needs diuresis; cold and wet is congested with hypoperfusion, which carries the worst prognosis and needs inotropic support and intensive care rather than diuresis alone.",
        explanation: "The profile determines whether the failing output is the limiting problem or the congestion is.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A patient with an ejection fraction of 28 percent is admitted with pulmonary oedema. Which class of drug has the strongest evidence for reducing mortality in this patient?",
        options: ["Loop diuretics", "Digoxin", "A mineralocorticoid receptor antagonist", "Calcium channel blockers"],
        correctIndex: 2,
        explanation: "In reduced ejection fraction, the angiotensin axis blockade, a beta-blocker, a mineralocorticoid receptor antagonist and an SGLT2 inhibitor all reduce mortality. Loop diuretics relieve congestion and digoxin reduces hospitalisation, but neither has been shown to prolong life.",
      },
      {
        type: "mcq",
        stem: "Which finding is most characteristic of heart failure with preserved ejection fraction?",
        options: [
          "A dilated left ventricle with a markedly reduced ejection fraction",
          "A stiff, hypertrophied ventricle with breathlessness, a raised filling pressure and a normal ejection fraction",
          "A high output state with warm peripheries and a bounding pulse",
          "An ejection fraction below 35 percent with a raised pulmonary artery pressure",
        ],
        correctIndex: 1,
        explanation: "Preserved failure is a filling problem: the ventricle is stiff and needs a higher pressure to fill, so the patient is congested and breathless while the measured ejection fraction remains normal.",
      },
      {
        type: "mcq",
        stem: "A patient with chronic heart failure on full oral therapy is admitted with a weight gain of 4 kilograms, pulmonary crackles and cool peripheries. What does the cold, wet profile indicate?",
        options: [
          "Over-diuresis and a need for intravenous fluids",
          "Congestion with hypoperfusion, carrying the worst prognosis and requiring inotropic support",
          "A stable regimen that needs only an increased oral dose of furosemide",
          "A profile in which diuresis alone is sufficient",
        ],
        correctIndex: 1,
        explanation: "The cold and wet profile is congested and hypoperfused: the cardiac output is insufficient, so inotropic support and intensive care review are indicated rather than diuresis alone.",
      },
      {
        type: "mcq",
        stem: "Which investigation is the most useful for excluding heart failure in a patient with undifferentiated breathlessness?",
        options: ["Troponin", "Chest radiograph", "D-dimer", "NT-proBNP below the rule-out threshold"],
        correctIndex: 3,
        explanation: "An NT-proBNP below 300 nanograms per litre (or BNP below 100) makes untreated heart failure very unlikely, which is its principal role: excluding the diagnosis. Troponin, chest radiography and D-dimer answer different questions.",
      },
      {
        type: "mcq",
        stem: "A patient admitted with decompensated heart failure has been taking bisoprolol for two years and is not shocked. What is the correct management of the beta-blocker?",
        options: [
          "Stop it immediately on admission and restart before discharge",
          "Continue it unless there is shock or inotrope dependence, reducing the dose if the patient is unstable",
          "Double the dose to improve the ejection fraction",
          "Switch to a calcium channel blocker for rate control",
        ],
        correctIndex: 1,
        explanation: "Withdrawal of chronic beta-blocker therapy is associated with worse survival in acute decompensation, so it is continued or reduced rather than stopped, unless the patient is shocked or requires inotropes.",
      },

      { type: "heading", level: 2, text: "Module summary and next" },
      {
        type: "paragraph",
        text: "Heart failure is the terminal common pathway of cardiac disease, and its teaching divides cleanly into three parts: the phenotype (what the ejection fraction is doing), the congestion (where the fluid is accumulating and how to remove it) and the neurohormonal response (which the four disease-modifying drug classes exist to block). The same patient will be described in all three languages, and keeping them separate keeps the treatment rational.",
      },
      {
        type: "paragraph",
        text: "Next: ischaemic heart disease, which is the commonest single cause of the syndrome you have just studied, and the acute coronary syndromes, which are its commonest precipitant.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 8 — Ischaemic heart disease (fully authored)
// ---------------------------------------------------------------------------
function lesson8() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the natural history of the coronary atherosclerotic plaque and the event that converts a stable plaque into an acute occlusion; differentiate stable angina from unstable angina and the acute coronary syndromes using the history, the ECG and the troponin; interpret the distribution of ST changes against the coronary territories; state the immediate treatment of an acute coronary syndrome and the reperfusion strategy for an ST-elevation infarction; and list the components of secondary prevention.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "PATH 201 (atherosclerosis, thrombosis and infarction), PHYS 101 (the coronary circulation, myocardial oxygen supply and demand), MED 301 lesson 5 (the ECG, including the ST segment), and lesson 6 (ABCDE).",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Ischaemic heart disease",
        text: "The group of syndromes produced by an imbalance between the supply of blood to the myocardium and its demand for it — arising, in the great majority of patients, from atherosclerotic narrowing of the coronary arteries.",
      },
      {
        type: "paragraph",
        text: "The single unifying idea is that the myocardium extracts nearly as much oxygen from the blood it receives as is possible at rest, so any increase in demand must be met by an increase in flow. A normal coronary artery can increase flow roughly five-fold; a narrowed one cannot. At rest the narrowed artery may still suffice, which is why the patient is well until effort raises demand, and why the pain stops on rest. Ischaemia is therefore a demand-supply mismatch, and everything the disease does follows from that arithmetic.",
      },
      {
        type: "definition",
        term: "Acute coronary syndrome",
        text: "The spectrum of presentations caused by an abrupt reduction in coronary flow — unstable angina, non-ST-elevation myocardial infarction and ST-elevation myocardial infarction — differentiated by the ECG and by whether cardiac biomarkers rise.",
      },

      { type: "heading", level: 2, text: "Atherosclerosis: from fatty streak to rupture" },
      {
        type: "table",
        headers: ["Stage", "What happens", "Clinical consequence"],
        rows: [
          ["Endothelial injury", "Hypertension, smoking, hyperglycaemia and hyperlipidaemia damage the endothelium and increase its permeability", "Silent; this is the modifiable stage and the reason for risk-factor treatment"],
          ["Fatty streak", "Low-density lipoproteins enter the intima, oxidise, and are taken up by macrophages, which become foam cells", "Silent, and present in the autopsies of young adults"],
          ["Fibrous plaque", "Smooth muscle cells migrate and lay down a collagen cap over a lipid-rich core", "Luminal narrowing, so exertional angina appears when the stenosis exceeds about 70 percent"],
          ["Plaque rupture or erosion", "The thin cap tears, exposing collagen and tissue factor, so platelets aggregate and the coagulation cascade activates to form a thrombus", "The acute coronary syndrome: an occlusive thrombus produces infarction, a non-occlusive one produces unstable angina or a non-ST-elevation infarction"],
          ["Healing and remodelling", "Organisation of the thrombus and further cap formation", "A new stable stenosis, progressive symptoms and heart failure"],
        ],
      },
      {
        type: "paragraph",
        text: "The clinically important point is that the dangerous plaque is not necessarily the most narrow one. A lipid-rich plaque with a thin cap and active inflammation is more likely to rupture than a small, calcified, heavily narrowed lesion, which is why a patient can have a first myocardial infarction with no history of angina, and why risk-factor treatment is aimed at the plaque rather than at the stenosis.",
      },
      {
        type: "callout",
        variant: "info",
        text: "An atheromatous plaque is said to be vulnerable when its lipid core is large, its cap is thin and inflamed, and it is composed of foam cells with few smooth muscle cells. That composition — not the diameter of the lumen — is what determines rupture risk.",
      },

      { type: "heading", level: 2, text: "The clinical syndromes" },
      {
        type: "table",
        headers: ["Syndrome", "History", "ECG", "Troponin"],
        rows: [
          ["Stable angina", "Predictable exertional central chest tightness, relieved by rest or by sublingual nitrate within minutes, unchanged for months", "Normal at rest, or unchanged Q waves; ST depression may appear during pain", "Normal"],
          ["Unstable angina", "Angina at rest or with minimal exertion, new-onset severe angina, angina that is more frequent, more severe or longer than before (crescendo)", "ST depression or T wave inversion, or normal; no ST elevation", "Normal"],
          ["Non-ST-elevation myocardial infarction (NSTEMI)", "Pain at rest lasting more than 20 minutes with the same character as stable angina, often with sweating, nausea and vomiting", "ST depression or transient elevation, deep T inversion, or non-specific; absence of ST elevation", "Raised, with a rise and fall pattern"],
          ["ST-elevation myocardial infarction (STEMI)", "Severe, sustained, crushing central chest pain with sweating, nausea, vomiting and a sense of impending death, unrelieved by nitrate", "Persistent ST elevation of at least 1 millimetre in two contiguous limb leads or 2 millimetres in two contiguous chest leads, or a new left bundle branch block", "Raised, with a rise and fall pattern"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "A patient with crescendo pain, pain at rest, or pain lasting more than 20 minutes has an acute coronary syndrome until proven otherwise, whatever the ECG shows. A normal ECG does not exclude an evolving infarction, which is why the troponin and the serial ECG are taken.",
      },

      { type: "heading", level: 2, text: "The ECG and the coronary territories" },
      {
        type: "table",
        headers: ["Leads", "Wall supplied", "Artery", "Signs of infarction"],
        rows: [
          ["II, III and aVF", "Inferior wall of the left ventricle", "Right coronary artery in most people, the circumflex in others", "ST elevation in those leads; reciprocal ST depression in I and aVL; also check the right-sided leads for a right ventricular infarction, because nitrates are dangerous in that setting"],
          ["V1 to V4", "Anterior wall and septum", "Left anterior descending artery", "ST elevation, often with Q waves; the territory with the largest muscle mass and the highest mortality"],
          ["V5, V6, I and aVL", "Lateral wall", "Left anterior descending or the circumflex", "ST elevation in the lateral leads; may accompany an inferior or anterior infarction"],
          ["V1 to V3 (posterior)", "Posterior wall", "Right coronary artery or circumflex", "ST depression with tall R waves in V1 to V3, which is reciprocal to posterior ST elevation — recorded by adding posterior leads V7 to V9"],
        ],
      },
      {
        type: "paragraph",
        text: "The ST segment should be read against the T wave and the Q wave together. Transmural infarction produces Q waves that persist for life, because the necrosed segment cannot depolarise; subendocardial ischaemia produces ST depression without Q waves. The distinction explains the vocabulary of the syndromes and is directly visible in the tracing.",
      },

      { type: "heading", level: 2, text: "Diagnosis" },
      {
        type: "table",
        headers: ["Element", "Standard", "Note"],
        rows: [
          ["Cardiac troponin I or T", "A high-sensitivity assay at presentation and repeated at 3 hours; a rise and fall pattern identifies myocardial necrosis", "Troponin is a marker of necrosis, not of ischaemia: it is also raised in pulmonary embolism, myocarditis, sepsis, renal failure and heart failure"],
          ["Electrocardiogram", "Taken within 10 minutes of first contact, and repeated when the pain changes or an infarct is suspected", "Look specifically for ST elevation, new left bundle branch block, ST depression and reciprocal change"],
          ["Chest radiograph", "Widened mediastinum, pulmonary oedema, cardiomegaly", "Excludes dissection, pneumonia and pneumothorax; the widened mediastinum changes the whole management"],
          ["Other investigations", "Full blood count, renal function, electrolytes, glucose, lipids, echocardiography within the admission, coronary angiography", "Echocardiography shows the regional wall motion abnormality and any mechanical complication; angiography is both diagnostic and therapeutic"],
        ],
      },
      {
        type: "definition",
        term: "Universal definition of myocardial infarction",
        text: "Detection of a rise and fall in cardiac biomarkers with at least one value above the 99th percentile of the upper reference limit, together with evidence of ischaemia — symptoms, ECG changes, new imaging loss of viable myocardium or a thrombus on angiography.",
      },

      { type: "heading", level: 2, text: "Immediate treatment of the acute coronary syndrome" },
      {
        type: "table",
        headers: ["Drug", "Action", "Cautions"],
        rows: [
          ["Aspirin 300 milligrams chewed", "Given immediately to every patient with a suspected acute coronary syndrome unless allergic", "The single most beneficial and cheapest intervention; the dose is then continued at 75 to 100 milligrams daily"],
          ["P2Y12 inhibitor (ticagrelor or clopidogrel)", "A second antiplatelet agent for dual antiplatelet therapy, continued for 12 months after an acute syndrome", "Ticagrelor is more effective but causes dyspnoea and is twice daily; bleeding risk with both; avoid in the presence of intracerebral disease"],
          ["Anticoagulant (fondaparinux or unfractionated heparin)", "Antithrombin therapy during the acute phase, particularly when an invasive strategy is planned", "Dose-adjusted to renal function; monitor if heparin is used"],
          ["Sublingual or intravenous nitrate", "Relieves ischaemic pain and reduces preload", "Contraindicated with a systolic below 90, with right ventricular infarction, or with recent phosphodiesterase inhibitor use"],
          ["Oxygen", "Reserved for hypoxaemia, breathlessness or heart failure", "Routine high-flow oxygen in a patient with a normal saturation provides no benefit and may be harmful"],
          ["Beta-blocker", "Started orally within 24 hours when the patient is haemodynamically stable", "Avoid in heart failure, bradycardia, asthma or shock; reduces mortality after infarction"],
          ["High-intensity statin", "Started immediately and continued lifelong", "An anti-inflammatory and plaque-stabilising action as well as lipid lowering"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Morphine is not routine in the acute coronary syndrome: it delays the absorption of antiplatelet drugs and is associated with worse outcomes, so it is used only for pain that resists nitrates and when no other option exists.",
      },

      { type: "heading", level: 2, text: "Reperfusion" },
      {
        type: "table",
        headers: ["Situation", "Strategy", "Target time"],
        rows: [
          ["ST-elevation infarction with pain of less than 12 hours", "Primary percutaneous coronary intervention with stenting", "Balloon or device time within 120 minutes of the diagnosis, or within 60 minutes when the patient arrives directly at a centre that performs the procedure"],
          ["ST-elevation infarction where percutaneous intervention cannot be delivered in time", "Fibrinolytic (thrombolytic) therapy, ideally within 12 hours of symptom onset and pre-hospital if possible", "Door to needle within 30 minutes, with rescue percutaneous intervention if the trace does not settle"],
          ["Non-ST-elevation acute coronary syndrome at high risk", "Invasive coronary angiography within 24 hours for a raised troponin, dynamic ST change, haemodynamic instability or a high risk score", "Urgent (beats the window for serial troponins) for very high risk; within 72 hours for the remainder"],
          ["Stable angina for revascularisation assessment", "Elective angiography for symptoms refractory to therapy, for a large ischaemic burden on functional testing, or for a high risk of an event", "After risk stratification, and after the introduction of medical therapy"],
        ],
      },
      {
        type: "paragraph",
        text: "Percutaneous intervention opens the artery mechanically and is superior to thrombolysis when it can be delivered in time, because the risk of intracerebral haemorrhage is avoided and the stenosis is stented. Where a patient presents to a hospital that cannot deliver it, the choice is between thrombolysis and transfer, and the decision is arithmetic: if the door-to-device estimate exceeds 120 minutes, thrombolyse. Reperfusion arrhythmias — accelerated idioventricular rhythm, bradycardia in an inferior infarction, and ventricular tachycardia — are common in the first hours and are treated only when they compromise the circulation.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Time is the currency of reperfusion: the proportion of myocardium salvaged falls with every minute of occlusion, so the diagnosis, the ECG and the reperfusion decision are made in parallel rather than in sequence.",
      },

      { type: "heading", level: 2, text: "Secondary prevention" },
      {
        type: "table",
        headers: ["Component", "Specifics", "Purpose"],
        rows: [
          ["Antiplatelet therapy", "Aspirin lifelong; a second antiplatelet agent for 12 months after an acute syndrome", "Reduces recurrent infarction and stent thrombosis"],
          ["Lipid lowering", "High-intensity statin (atorvastatin 80 milligrams or equivalent), with an ezetimibe or a PCSK9 inhibitor added if the target is not met", "Lowers low-density lipoprotein, stabilises plaque, and reduces events by about a quarter"],
          ["Angiotensin blockade", "An ACE inhibitor, particularly after an anterior infarction or with reduced ejection fraction or diabetes", "Reduces remodelling, heart failure and mortality"],
          ["Beta-blocker", "Continued long term after infarction or in angina", "Reduces demand, arrhythmia and mortality"],
          ["Risk factor control", "Blood pressure below 130/80 where tolerated, glycaemic control, complete smoking cessation, weight, activity", "Slows the disease in every territory, not only the coronary one"],
          ["Cardiac rehabilitation", "A structured exercise, education and psychological programme, begun in hospital", "Reduces mortality and readmission; one of the most effective and least delivered interventions"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Calling a normal ECG reassuring in a patient with chest pain. The trace may be normal in the first hour of an infarction and in unstable angina, so the decision rests on the history and the troponin, not on the absence of ST elevation.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Attributing pleuritic or positional pain to a musculoskeletal cause without excluding the dangerous alternatives. Worse-on-breathing pain suggests pleurisy, but a pulmonary embolism and a pericarditis produce the same character, and a dissection produces a tearing pain that radiates to the back.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Giving nitrates to a hypotensive patient or to one with an inferior infarction and a raised jugular venous pressure, in whom a right ventricular infarction may be present. Nitrates reduce preload and can precipitate collapse in that setting.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating the troponin as a test for ischaemia. It is a test for myocardial necrosis, and it is raised in pulmonary embolism, myocarditis, sepsis, renal failure and heart failure — so a positive result must be interpreted with the ECG and the clinical picture.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does a patient with stable angina have no pain at rest and pain on climbing stairs?",
        answer: "Because a stenosis of about 70 percent still permits the resting flow, but it cannot dilate further, so the increase in demand on exertion cannot be met and ischaemia follows. Rest lowers demand, and the sublingual nitrate reduces preload and dilates the coronaries, so the pain settles.",
        explanation: "The mismatch between a fixed supply and a variable demand is the whole mechanism of exertional angina.",
      },
      {
        type: "question",
        prompt: "Which three items separate stable angina from an acute coronary syndrome in the history?",
        answer: "Pain at rest, an increasing frequency or severity or duration of pain (crescendo angina), and a failure to respond to rest or a nitrate within minutes. Pain lasting more than 20 minutes is particularly ominous.",
        explanation: "Any of the three makes the presentation an acute coronary syndrome, which requires an immediate ECG, a troponin and admission.",
      },
      {
        type: "question",
        prompt: "A patient has ST elevation in leads II, III and aVF with ST depression in I and aVL. Which territory and artery, and which electrocardiographic lead set should be added?",
        answer: "An inferior infarction, usually from the right coronary artery, with reciprocal change in the lateral leads. Right-sided chest leads (V3R to V5R) should be added to look for right ventricular involvement, which changes the management of fluids and of nitrates.",
        explanation: "Right ventricular infarction raises the right atrial pressure and makes the patient preload dependent, so nitrates and diuretics can cause collapse.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A 58-year-old man has 40 minutes of central chest pain with sweating, and the ECG shows 3 millimetres of ST elevation in V2 to V5. What is the immediate priority?",
        options: [
          "Thrombolysis and observation on the ward",
          "Activation of the primary percutaneous coronary intervention pathway",
          "Serial troponins in 6 hours before deciding",
          "A transthoracic echocardiogram before any reperfusion",
        ],
        correctIndex: 1,
        explanation: "Persistent ST elevation is an ST-elevation myocardial infarction, which requires immediate reperfusion by primary percutaneous intervention within 120 minutes of diagnosis. Waiting for troponins or an echo wastes the myocardium.",
      },
      {
        type: "mcq",
        stem: "Which pattern of ST elevation changes indicates an inferior myocardial infarction?",
        options: ["V1 to V3", "I, aVL, V5 and V6", "II, III and aVF", "V1 to V4 with a new right bundle branch block"],
        correctIndex: 2,
        explanation: "Leads II, III and aVF view the inferior wall of the left ventricle, supplied by the right coronary artery in most people; reciprocal ST depression in I and aVL is often present.",
      },
      {
        type: "mcq",
        stem: "A patient presents with 30 minutes of chest pain at rest, an ECG with ST depression in the lateral leads, and a raised troponin. Which is the most likely diagnosis?",
        options: ["Stable angina", "Unstable angina", "Non-ST-elevation myocardial infarction", "Pulmonary embolism"],
        correctIndex: 2,
        explanation: "Pain at rest with ST depression and a raised troponin is a non-ST-elevation myocardial infarction. The raised troponin is what separates infarction from unstable angina.",
      },
      {
        type: "mcq",
        stem: "A patient is admitted with a non-ST-elevation acute coronary syndrome. Which drug is given immediately to every such patient unless contraindicated?",
        options: ["300 milligrams of aspirin, chewed or dispersed", "50 milligrams of atenolol orally", "Frusemide 40 milligrams intravenously", "A statin only after lipids return"],
        correctIndex: 0,
        explanation: "Aspirin is given at once to every patient with a suspected acute coronary syndrome unless allergic, and is then continued lifelong at 75 to 100 milligrams daily. Beta-blockers, diuretics and statins have their own indications.",
      },
      {
        type: "mcq",
        stem: "Which finding in a patient with an inferior infarction and a raised jugular venous pressure most changes the immediate management?",
        options: [
          "A pleural rub",
          "ST elevation in the right-sided lead V4R, indicating right ventricular infarction, in which nitrates must be avoided and fluids given",
          "A raised troponin alone",
          "A mildly raised white cell count",
        ],
        correctIndex: 1,
        explanation: "ST elevation in the right-sided leads identifies right ventricular infarction: the ventricle is preload dependent, so nitrates and diuretics can cause profound hypotension, and fluids are given instead.",
      },

      { type: "heading", level: 2, text: "Module summary and next" },
      {
        type: "paragraph",
        text: "Ischaemic heart disease is a demand-supply mismatch produced by atherosclerosis. Stable plaques narrow the artery and cause exertional angina; rupture converts a stable lesion into an occlusive thrombus, and the resulting acute coronary syndrome is classified by the ECG and the troponin. The therapeutic consequence is a division of labour: reperfusion for the occlusion, drugs for the demand, and aggressive secondary prevention for the disease that produced the plaque.",
      },
      {
        type: "paragraph",
        text: "Next: arrhythmias and conduction disease — the electrical consequence of the infarction, ischaemia and scar that this lesson has described, and the group of disorders in which the ECG is the diagnosis.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 9 — Arrhythmias & conduction disease (fully authored)
// ---------------------------------------------------------------------------
function lesson9() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the three cellular mechanisms of arrhythmia — automaticity, triggered activity and re-entry; classify bradyarrhythmias by the level of the conducting system and state the indications for permanent pacing; separate a narrow complex tachycardia from a wide complex one and generate a differential for each; name the features that distinguish ventricular from supraventricular tachycardias with a broad QRS; apply the stable-versus-unstable rule to the acute management of a tachyarrhythmia; and outline the rate and rhythm control of atrial fibrillation with its anticoagulation rules.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "PHYS 101 (the cardiac action potential, the refractory period and pacemaker tissue), MED 301 lesson 5 (systematic ECG reading and the normal intervals), and PATH 201 (scar tissue and fibrosis), plus the pharmacology of the antiarrhythmic drugs from PHRM 202.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Arrhythmia",
        text: "Any cardiac rhythm other than the normal sinus rhythm, produced either by an abnormality in the formation of the impulse or by an abnormality in its conduction — tachycardia for fast rhythms, bradycardia for slow ones.",
      },
      {
        type: "paragraph",
        text: "The heart normally beats because the sinoatrial node fires, the impulse spreads through atria and waits at the atrioventricular node, and then descends the His-Purkinje system to depolarise the ventricles in a coordinated wave. Every arrhythmia is a departure from one of those facts: an impulse that starts somewhere other than the sinoatrial node, an impulse that returns where it has already been, or an impulse that is delayed or blocked on its way down. Reduce any rhythm to where it starts and where it travels, and it becomes recognisable on the tracing.",
      },
      {
        type: "definition",
        term: "Re-entry",
        text: "The mechanism of most clinically important tachycardias: an impulse that returns to tissue it has already depolarised after that tissue has recovered, so it circulates indefinitely. It requires a circuit, in which two conducting paths with different refractory periods meet.",
      },
      {
        type: "paragraph",
        text: "Re-entry explains why a premature beat starts a tachycardia, why a short-coupled extra beat can precipitate ventricular fibrillation in ischaemic myocardium, and why the drugs that work by slowing conduction and prolonging refractoriness can terminate and also can start an arrhythmia. It is also the reason a narrow complex tachycardia can be terminated by a manoeuvre that blocks the atrioventricular node: breaking the circuit stops the impulse, and the ventricle then shows what the atria are doing on their own.",
      },

      { type: "heading", level: 2, text: "The three cellular mechanisms" },
      {
        type: "table",
        headers: ["Mechanism", "What happens", "Typical rhythms"],
        rows: [
          ["Abnormal automaticity", "Ectopic pacemaker tissue accelerates and takes over the rhythm, or pacemaker cells develop where none should", "Atrial ectopics, idioventricular rhythm, some atrial and ventricular tachycardias"],
          ["Triggered activity", "Abnormal depolarisations during or after repolarisation — early or delayed after-depolarisations — fire an impulse", "Torsades de pointes in a prolonged QT interval, digitalis toxicity, reperfusion arrhythmias"],
          ["Re-entry", "An impulse re-enters tissue that has recovered, producing a self-sustaining circuit", "Atrioventricular nodal re-entrant tachycardia, atrial flutter, the atrioventricular re-entrant tachycardia of Wolff-Parkinson-White, scar-related ventricular tachycardia after infarction"],
          ["Conduction block", "An impulse is delayed or fails to conduct, and the rhythms above and below the block are independent", "Sinoatrial block, atrioventricular block, bundle branch block"],
        ],
      },

      { type: "heading", level: 2, text: "Bradyarrhythmias and conduction disease" },
      {
        type: "table",
        headers: ["Site", "Rhythm", "ECG", "Significance"],
        rows: [
          ["Sinoatrial node", "Sinus bradycardia; sinoatrial block, in which an impulse fails to leave the node", "A slow regular rhythm with P waves before every QRS; in block, a dropped beat without a P wave", "A physiological response in athletes; pathological with syncope or with drugs such as beta-blockers and digoxin"],
          ["Sinoatrial node (sick sinus syndrome)", "Bradycardia alternating with tachycardia, and pauses when the tachycardia terminates", "Tachy-brady syndrome: atrial fibrillation or flutter alternating with long sinus pauses", "A cause of syncope, and an indication for pacing when symptomatic or when pauses exceed about 3 seconds"],
          ["Atrioventricular node, first degree", "First-degree atrioventricular block", "A PR interval above 0.20 seconds with every P wave conducted", "Benign and usually needs no treatment, but it may progress"],
          ["Atrioventricular node, second degree, Mobitz I (Wenckebach)", "Progressive PR lengthening until a QRS is dropped", "Grouped beating with a lengthening PR interval and a dropped QRS", "Usually benign, from increased vagal tone or an inferior infarction; treated only if symptomatic"],
          ["Atrioventricular node, second degree, Mobitz II", "Sudden failure of conduction without warning", "A dropped QRS with a constant PR interval, often a wide QRS as well", "Infranodal disease that progresses unpredictably to complete block, so it is an indication for pacing"],
          ["Below the atrioventricular node, third degree", "Complete atrioventricular block: atrial and ventricular activity are independent", "P waves and QRS complexes march through independently, with a slow ventricular escape rate", "A pacing indication, and a cause of Stokes-Adams attacks; a temporary wire first if the rate is slow"],
          ["Bundle branches", "Left or right bundle branch block; bifascicular or trifascicular disease", "A QRS above 0.12 seconds with the characteristic morphology in V1 and V6", "Block alone is not an indication for pacing; it is a sign of infranodal disease that is watched for syncope and prolonged PR"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The ventricular escape rate tells you where the block is. A narrow QRS at 45 to 60 per minute means the escape is arising in the atrioventricular junction and the block is nodal; a broad QRS at under 40 per minute means the escape is ventricular and the block is infranodal, which is far less reliable and far more dangerous.",
      },
      {
        type: "definition",
        term: "Indications for permanent pacing",
        text: "Symptomatic bradycardia from sinus node disease or atrioventricular block; complete heart block; Mobitz II block; symptomatic pauses; and bradycardia that is unavoidable because the drugs the patient needs cannot be stopped. Pacing is indicated by symptoms and by the risk of the block, never by the ECG alone.",
      },

      { type: "heading", level: 2, text: "Tachycardia: the first split" },
      {
        type: "paragraph",
        text: "The first question of any tachycardia is whether the QRS is narrow (under 0.12 seconds) or broad. A narrow complex means the impulse travelled down the His-Purkinje system, so it arose in the atria or in the atrioventricular node, and the differential is short. A broad complex means either the impulse arose in the ventricle, or it arose above the ventricle but conducted abnormally — and the two cannot always be separated, which is why the broad complex tachycardia is assumed to be ventricular until proven otherwise.",
      },
      {
        type: "table",
        headers: ["Feature", "Supraventricular tachycardia with aberrancy", "Ventricular tachycardia"],
        rows: [
          ["Origin", "Atrial or junctional, conducting abnormally through the ventricles", "A re-entrant or automatic focus within the ventricular myocardium, usually in scar"],
          ["Frequency", "Any", "Usually above 100, and often above 150"],
          ["Atrial activity", "Visible P waves, flutter waves or fibrillatory waves, related to the QRS", "Atrioventricular dissociation with independent P waves is diagnostic"],
          ["Capture and fusion beats", "Absent", "Occasional conducted beats interrupting the tachycardia — diagnostic of a ventricular origin"],
          ["QRS width", "Broad, often with a typical bundle branch block morphology", "Broad, over 0.16 seconds in some studies; concordance across V1 to V6 is suggestive"],
          ["Classic pattern", "Right bundle branch block morphology with a rate that stops with adenosine", "An extreme axis, or an RS complex in V1 with an interval from R to the deepest S above 100 milliseconds"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "A broad complex tachycardia in a patient with a history of myocardial infarction is ventricular tachycardia until proven otherwise. Treating it as a supraventricular tachycardia with aberrancy and giving verapamil or adenosine carries a real risk of collapse in the damaged ventricle.",
      },

      { type: "heading", level: 2, text: "The narrow complex tachycardias" },
      {
        type: "table",
        headers: ["Rhythm", "Mechanism", "ECG", "Note"],
        rows: [
          ["Sinus tachycardia", "An appropriate response to demand, fever, pain, hypovolaemia, anaemia or thyrotoxicosis", "A P wave before every QRS, a rate above 100, and slow variation with respiration", "Always find the cause: it is a sign, not a diagnosis"],
          ["Atrial fibrillation", "Chaotic atrial depolarisation with re-entrant circuits in the atria and variable conduction", "An irregularly irregular rhythm with no P waves and a fibrillatory baseline", "The commonest sustained tachycardia; rate control, rhythm control and anticoagulation by stroke risk"],
          ["Atrial flutter", "A re-entrant circuit around the tricuspid annulus, typically at 300 per minute", "Sawtooth flutter waves, often with 2:1 conduction giving a ventricular rate of 150", "Atrial rate and conduction fraction are the two numbers to read; carotid sinus massage increases the block and reveals the flutter"],
          ["Atrial tachycardia", "An ectopic atrial focus, sometimes multifocal", "An abnormal P morphology at a rate of 150 to 250 with a normal or prolonged PR", "Common in cor pulmonale and digoxin toxicity"],
          ["Atrioventricular nodal re-entrant tachycardia", "Re-entry within the atrioventricular node using a slow and a fast pathway", "A regular narrow complex tachycardia at 140 to 220 with P waves buried in or just after the QRS", "The commonest paroxysmal regular tachycardia in young adults, and it terminates abruptly with adenosine"],
          ["Atrioventricular re-entrant tachycardia", "Re-entry using an accessory pathway, as in Wolff-Parkinson-White", "A regular narrow complex tachycardia at 150 to 250, with a short PR and delta wave in sinus rhythm", "Patients with pre-excitation must not receive atrioventricular nodal blocking drugs if they develop atrial fibrillation, because conduction then goes down the accessory pathway"],
        ],
      },
      {
        type: "paragraph",
        text: "The regular narrow complex tachycardias are separated by the position of the P wave and the response to adenosine. A regular rhythm at exactly 150 per minute with sawtooth waves is atrial flutter with 2:1 block; an abrupt termination with adenosine is an atrioventricular nodal re-entrant tachycardia; and an irregularly irregular rhythm with no P waves is atrial fibrillation.",
      },

      { type: "heading", level: 2, text: "Acute management: the stable-versus-unstable rule" },
      {
        type: "table",
        headers: ["State", "Signs", "Action"],
        rows: [
          ["Unstable", "Hypotension, heart failure with pulmonary oedema, myocardial ischaemia with chest pain, or a depressed level of consciousness attributable to the rhythm", "Synchronised direct current cardioversion under sedation, with the shock delivered on the R wave"],
          ["Stable, regular, narrow complex", "A preserved blood pressure and perfusion", "Vagal manoeuvres (carotid sinus massage or a Valsalva), then adenosine 6 milligrams then 12 milligrams as a rapid bolus; if it recurs, a calcium channel blocker or a beta-blocker"],
          ["Stable, irregular, narrow complex", "A preserved blood pressure, with an irregularly irregular rhythm", "Rate control with a beta-blocker or a calcium channel blocker (digoxin if the patient is sedentary); correct reversible causes; anticoagulate by risk score"],
          ["Stable, broad complex", "A preserved blood pressure with a broad QRS", "Treat as ventricular tachycardia: amiodarone or procainamide; cardioversion if it fails or the patient deteriorates"],
          ["Torsades de pointes", "Polymorphic ventricular tachycardia with a twisting axis in a prolonged QT interval", "Intravenous magnesium sulphate, stop the offending drug, correct potassium, and overdrive pacing or isoprenaline if bradycardia-dependent"],
        ],
      },
      {
        type: "paragraph",
        text: "The rule comes before the differential in every case, because a patient with a rate of 210 and a systolic of 70 is not a pharmacological problem. Where the patient is stable there is time to record a 12-lead tracing with a rhythm strip, to look for P waves and for the width and regularity of the QRS, and to establish the diagnosis before treatment.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Never cardiovert a patient with atrial fibrillation of more than 48 hours duration without either anticoagulating for at least three weeks or excluding an atrial thrombus on transoesophageal echo. The risk is embolic stroke, which is the reason the rule exists.",
      },

      { type: "heading", level: 2, text: "Atrial fibrillation: rate, rhythm and anticoagulation" },
      {
        type: "table",
        headers: ["Decision", "Options", "How the choice is made"],
        rows: [
          ["Rate control or rhythm control", "Rate control with a beta-blocker, a calcium channel blocker or digoxin; rhythm control by cardioversion, by ablation, or with an antiarrhythmic drug", "Either strategy is acceptable for rate outcomes in most patients; rhythm control is preferred for symptoms refractory to rate control, for a first presentation, for heart failure, and for younger patients"],
          ["Anticoagulation", "A direct oral anticoagulant (apixaban, rivaroxaban, dabigatran, edoxaban) in preference to warfarin unless there is mechanical valve disease or severe mitral stenosis", "Started if the CHA2DS2-VASc score is 2 or more in men or 3 or more in women, and the score is not modified by whether the fibrillation is paroxysmal or permanent"],
          ["Bleeding risk", "Assessed alongside the stroke score; modifiable risks — blood pressure control, alcohol, concurrent antiplatelet therapy — are corrected before starting", "A high HAS-BLED score is a reason to review and monitor, not a reason to withhold anticoagulation in a patient at high stroke risk"],
          ["Bleeding from anticoagulation", "Stop the drug, give a specific reversal agent where one exists, and transfuse as indicated", "Bleeding does not change the indication for anticoagulation; the underlying atrial fibrillation still needs treating"],
        ],
      },
      {
        type: "definition",
        term: "CHA2DS2-VASc",
        text: "A stroke risk score in atrial fibrillation, one point each for congestive heart failure, hypertension, age 65 to 74, diabetes and female sex, one point for vascular disease, and two points each for a previous stroke or transient ischaemic attack and for age 75 or over.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Treating a broad complex tachycardia as a supraventricular tachycardia with aberrancy. The majority of broad complex tachycardias are ventricular in origin, and the error is treated by assuming ventricular origin and following the algorithm for it.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Reading a normal QT interval on a rate-corrected basis and ignoring the drug list. A prolonged interval from a drug — a macrolide, an antipsychotic, an antiarrhythmic, an antiemetic — or from a low potassium, magnesium or calcium is the substrate of torsades, and it is the first thing to check in a polymorphic tachycardia.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing a first-degree atrioventricular block that needs no treatment with a Mobitz II or complete block that needs a pacemaker. The progressive PR lengthening of Wenckebach is benign; the constant PR with dropped QRS complexes is not.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Starting rhythm control with cardioversion in a patient with atrial fibrillation of unknown duration. The stroke risk is addressed first — either by anticoagulation for three weeks, a transoesophageal echo, or by treating the patient as high risk.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What are the three requirements for a re-entrant arrhythmia, and why does blocking the atrioventricular node terminate an atrioventricular nodal re-entrant tachycardia?",
        answer: "A circular circuit, two conducting paths with different refractory periods and conduction velocities, and a premature impulse that finds one path still refractory. Blocking the atrioventricular node interrupts the circle, so the impulse cannot return; the ventricular rhythm then resumes and the atria show their own, slower rhythm.",
        explanation: "This is also why adenosine, which blocks the atrioventricular node transiently, is both diagnostic and therapeutic.",
      },
      {
        type: "question",
        prompt: "How does a second-degree atrioventricular block of Mobitz II differ from Mobitz I, and why does only one of them require a pacemaker?",
        answer: "In Mobitz I (Wenckebach) the PR interval lengthens until a QRS is dropped, the site is the atrioventricular node and the prognosis is benign. In Mobitz II the PR interval is constant and QRS complexes drop without warning; the block is usually infranodal (His-Purkinje), with a wide QRS and a risk of sudden progression to complete block, so pacing is indicated.",
        explanation: "The distinction is read directly from the PR intervals, not from the rate.",
      },
      {
        type: "question",
        prompt: "A patient with a rate of 180 and a systolic pressure of 80, confused, is in a regular broad complex tachycardia. What is the first action and what is the second?",
        answer: "The patient is unstable, so the first action is synchronised direct current cardioversion under sedation. The second is to look for and treat the reversible causes, and to proceed to a rhythm diagnosis once the perfusion is restored.",
        explanation: "The unstable rule overrides the arrhythmia differential, because a rate that is causing a shock state is not a diagnostic problem.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A young adult has a sudden regular narrow complex tachycardia at 190 per minute with no visible P waves. It terminates abruptly after 6 milligrams of adenosine. What is the most likely mechanism?",
        options: ["Atrial flutter with 2:1 block", "An atrial ectopic focus", "Re-entry within the atrioventricular node", "Ventricular tachycardia"],
        correctIndex: 2,
        explanation: "An abrupt termination with adenosine indicates a circuit that depends on atrioventricular nodal conduction, so the mechanism is atrioventricular nodal re-entrant tachycardia. Atrial flutter continues with a visible block, and ventricular tachycardia has a broad QRS.",
      },
      {
        type: "mcq",
        stem: "Which finding is most suggestive that a broad complex tachycardia is ventricular in origin?",
        options: [
          "A rate of exactly 150 per minute",
          "Sawtooth flutter waves at 300 per minute",
          "Atrioventricular dissociation with capture beats",
          "A short PR interval with a delta wave in sinus rhythm",
        ],
        correctIndex: 2,
        explanation: "Atrioventricular dissociation with occasional capture or fusion beats is diagnostic of ventricular tachycardia, because the ventricles are depolarising independently of the atria. The other options suggest atrial flutter or pre-excitation.",
      },
      {
        type: "mcq",
        stem: "A 74-year-old man has atrial fibrillation, congestive heart failure and a previous stroke. What is his CHA2DS2-VASc score?",
        options: ["3", "4", "5", "6"],
        correctIndex: 1,
        explanation: "One point for congestive heart failure, one for age 65 to 74, two for the stroke, and one for age 75 or over: a total of 4, at which a direct oral anticoagulant is indicated.",
      },
      {
        type: "mcq",
        stem: "A patient on sotalol develops a polymorphic tachycardia with a QT interval of 560 milliseconds and a twisting axis. What is the immediate treatment?",
        options: [
          "Intravenous magnesium sulphate, stop the drug, and correct potassium",
          "Adenosine 12 milligrams intravenously",
          "Verapamil 5 to 10 milligrams intravenously",
          "Atropine 0.5 milligrams intravenously",
        ],
        correctIndex: 0,
        explanation: "This is torsades de pointes in a drug-prolonged QT interval: intravenous magnesium, withdrawal of the drug and correction of potassium. Adenosine and verapamil do not treat it, and atropine is for bradycardia.",
      },
      {
        type: "mcq",
        stem: "Which bradycardia is an indication for permanent pacing?",
        options: [
          "A first-degree atrioventricular block in an athlete at rest",
          "A Mobitz II atrioventricular block with a wide QRS complex",
          "Sinus bradycardia at 45 per minute during sleep",
          "A junctional rhythm after an inferior infarction with no symptoms",
        ],
        correctIndex: 1,
        explanation: "Mobitz II block is usually infranodal and can progress abruptly to complete block, so pacing is indicated. First-degree block, physiological sinus bradycardia and asymptomatic junctional rhythms are not pacing indications.",
      },

      { type: "heading", level: 2, text: "Module summary and next" },
      {
        type: "paragraph",
        text: "Arrhythmia is a disorder of impulse formation or of conduction, and the ECG is the diagnosis. The first classification is by rate, the second by the width of the QRS, and the third by whether the rhythm threatens the circulation. From there the differential narrows by the position of the P wave, the regularity of the rhythm and the response to adenosine or to vagal manoeuvres, and the treatment follows the single rule that an unstable rhythm is cardioverted and a stable one is diagnosed.",
      },
      {
        type: "paragraph",
        text: "The next module changes the organ but not the method: respiratory medicine, in which breathlessness is characterised by its onset, its relation to effort and position, and the obstructive or restrictive pattern on the spirometer.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 10 — Asthma & chronic obstructive pulmonary disease (fully authored)
// ---------------------------------------------------------------------------
function lesson10() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: contrast the pathology, reversibility and natural history of asthma and of chronic obstructive pulmonary disease; interpret spirometry including the post-bronchodilator ratio and the reversibility criterion; explain the physiology of air trapping and hyperinflation in obstructive disease; describe the stepwise treatment of asthma and the grouped assessment of chronic obstructive pulmonary disease; recognise the features of a life-threatening asthma attack and the place of oxygen, bronchodilators, steroids and magnesium; and list the indications for long-term oxygen therapy and non-invasive ventilation.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "PHYS 101 (airway resistance, lung volumes, the control of breathing and gas exchange), MED 301 lesson 2 (respiratory rate and oxygen saturation), lesson 6 (ABCDE and escalation), and PHRM 202 (beta-agonists, antimuscarinics and corticosteroids).",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Asthma",
        text: "A chronic inflammatory disease of the airways in which the airflow limitation is variable, both spontaneously and with treatment, and in which the inflammation is typically driven by allergic or eosinophilic mechanisms.",
      },
      {
        type: "definition",
        term: "Chronic obstructive pulmonary disease",
        text: "A preventable and treatable disease, usually caused by tobacco smoke, in which the airflow limitation is persistent and progressive and is not fully reversible — arising from a combination of small airway obstruction (obstructive bronchiolitis) and parenchymal destruction (emphysema).",
      },
      {
        type: "paragraph",
        text: "Both diseases narrow the airways, but the narrowing is produced by different tissues and it behaves differently. In asthma the obstruction is largely within the lumen and the wall — smooth muscle contraction, mucus and mucosal oedema — and it reverses, both under treatment and between attacks. In chronic obstructive pulmonary disease the small airways are narrowed and destroyed, elastic recoil is lost, the bronchioles collapse on expiration, and the obstruction is fixed at least in part. That single distinction — variable versus fixed — is what the spirometer measures, and it is what the whole diagnostic vocabulary records.",
      },
      {
        type: "paragraph",
        text: "The consequence of fixed obstruction is hyperinflation. If the airways collapse early on expiration, each breath leaves air behind, so the residual volume and total lung capacity rise and the diaphragm is flattened and mechanically disadvantaged. The patient breathes at a higher lung volume, with a smaller reserve for the next breath, which is why breathlessness in chronic obstructive pulmonary disease is effort-dependent and fixed, and why pursed-lip breathing — which raises airway pressure and keeps the bronchioles open — genuinely helps.",
      },

      { type: "heading", level: 2, text: "Comparing the two diseases" },
      {
        type: "table",
        headers: ["Feature", "Asthma", "Chronic obstructive pulmonary disease"],
        rows: [
          ["Typical onset", "Childhood or young adulthood, often with a family history of atopy", "Middle age or later, after 20 pack-years of smoking"],
          ["Reversibility", "Complete or near complete, variable from day to day, with diurnal variation", "Partial or absent; some improvement with bronchodilator but a persistent obstruction"],
          ["Symptoms", "Episodic wheeze, cough and breathlessness, worse at night and in the early morning, with triggers (exercise, cold air, allergens, infection, aspirin)", "Chronic cough and sputum, exertional breathlessness that progresses year on year, with wheeze"],
          ["Airway inflammation", "Eosinophilic and type 2 inflammation, with mast cell and lymphocyte involvement", "Neutrophilic and macrophage inflammation, with mucosal gland hypertrophy and goblet cell hyperplasia"],
          ["Parenchyma", "Normal, unless coexisting disease", "Emphysema: loss of alveolar walls, of surface area and of elastic recoil"],
          ["Course", "Variable with periods of remission; lung function normal between attacks", "Progressive, with an accelerated decline unless smoking stops"],
          ["Response to treatment", "Marked, so that inhaled corticosteroids plus bronchodilators can normalise the airflow", "Partial: bronchodilators and anti-inflammatory therapy modify symptoms and exacerbations rather than normalise the flow"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Asthma and chronic obstructive pulmonary disease coexist in the same patient more often than textbooks imply, and the combination carries worse airflow limitation and more exacerbations than either alone. The diagnostic phrase 'asthma-COPD overlap' describes that reality, and its management leans toward the asthma side: always inhaled corticosteroids.",
      },

      { type: "heading", level: 2, text: "Diagnosis by spirometry" },
      {
        type: "table",
        headers: ["Test", "What it measures", "Interpretation"],
        rows: [
          ["FEV1 divided by FVC after a bronchodilator", "The proportion of the vital capacity that can be exhaled in one second", "A ratio below 0.70 confirms persistent airflow limitation in chronic obstructive pulmonary disease; in asthma the ratio is normal between attacks"],
          ["Reversibility in asthma", "The change in FEV1 15 minutes after a short-acting beta-agonist", "A rise in FEV1 of at least 12 percent and at least 200 millilitres is significant reversibility, supporting asthma"],
          ["Peak expiratory flow variability", "Serial readings at home over two weeks", "Diurnal variability above 20 percent in adults (or above 10 percent amplitude) supports a diagnosis of asthma"],
          ["Carbon monoxide transfer factor", "The efficiency of gas transfer across the alveoli", "A reduced transfer factor indicates emphysema and loss of surface area, and helps separate emphysema from airway-predominant disease"],
          ["Fractional exhaled nitric oxide", "A marker of eosinophilic airway inflammation", "A raised value supports type 2 asthma and predicts a response to inhaled corticosteroids"],
          ["Response to a trial of treatment", "Symptoms and spirometry after inhaled corticosteroids", "In asthma, a therapeutic trial is both diagnostic and therapeutic; response confirms the diagnosis"],
        ],
      },
      {
        type: "paragraph",
        text: "Two cautions belong beside the numbers. Spirometry performed during a severe acute attack is often poor quality and may be dangerous, so it is not used to grade severity in an emergency; and a normal resting ratio does not exclude asthma, because the obstruction is variable by definition. The patient with classic symptoms and a normal trace needs a peak flow diary or a provocation test rather than reassurance.",
      },

      { type: "heading", level: 2, text: "Asthma: stepwise treatment" },
      {
        type: "table",
        headers: ["Step", "Regimen", "Situation"],
        rows: [
          ["1", "An inhaled short-acting beta-agonist used as required (or an as-needed inhaled corticosteroid-formoterol)", "Intermittent symptoms, fewer than twice a week and no night waking"],
          ["2", "A daily low-dose inhaled corticosteroid (or a low-dose corticosteroid-formoterol used as both reliever and maintenance)", "Any patient using a reliever more than twice a week, waking with symptoms, or with an exacerbation in the past two years"],
          ["3", "A low-dose inhaled corticosteroid plus a long-acting beta-agonist (or a medium-dose corticosteroid-formoterol as maintenance and reliever)", "Symptoms persist on step 2, or an exacerbation despite adherence"],
          ["4", "A medium-dose inhaled corticosteroid plus a long-acting beta-agonist, with consideration of a leukotriene receptor antagonist or a long-acting muscarinic antagonist", "Persistent symptoms, or repeated exacerbations"],
          ["5", "A high-dose inhaled corticosteroid plus a long-acting beta-agonist, with a referral for add-on therapy — a monoclonal antibody against IgE or interleukin 5, or a maintenance oral corticosteroid at the lowest dose", "Severe asthma with continuing symptoms or exacerbations despite adherence at step 4"],
        ],
      },
      {
        type: "paragraph",
        text: "Two principles run through the ladder. First, the inhaled corticosteroid is the drug that changes the disease: it reduces symptoms, exacerbations and death, and it is never withdrawn from an asthmatic whose disease is not trivial. Second, adherence and technique are checked and corrected before any step is added, because a reliever used more than twice a week is a marker of uncontrolled disease and of poor inhaler technique far more often than of drug failure.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Never add a long-acting beta-agonist without an inhaled corticosteroid in asthma. Used alone, long-acting bronchodilators mask the inflammation, and the combination without a corticosteroid is associated with an increased risk of severe and fatal attacks.",
      },

      { type: "heading", level: 2, text: "Chronic obstructive pulmonary disease: assessment and treatment" },
      {
        type: "table",
        headers: ["Domain", "Assessment", "Treatment"],
        rows: [
          ["Symptoms", "Modified Medical Research Council dyspnoea scale and the COPD Assessment Test, plus the number of exacerbations in the past year", "Group A: a bronchodilator. Group B: two bronchodilators. Group E: two bronchodilators, with more exacerbation prevention, in anyone admitted with an exacerbation"],
          ["Bronchodilation", "A long-acting muscarinic antagonist (tiotropium) or a long-acting beta-agonist, alone or in combination", "A long-acting muscarinic antagonist plus a long-acting beta-agonist reduces exacerbations more than either alone"],
          ["Inhaled corticosteroid", "Considered when the blood eosinophil count is raised (300 cells per microlitre or more) or when there are frequent exacerbations despite dual bronchodilation", "Added to a long-acting beta-agonist and a muscarinic antagonist; raises the risk of pneumonia, so it is not given to everyone"],
          ["Inhaled short-acting therapy", "Used for relief and in acute exacerbations", "Prescribed to every patient as a rescue, and reviewed for over-use which signals poor control"],
          ["Non-pharmacological", "Smoking cessation, vaccination (influenza, pneumococcal, COVID-19), pulmonary rehabilitation, weight and nutrition, occupational exposure", "Smoking cessation is the only intervention that changes the rate of decline in lung function; pulmonary rehabilitation reduces breathlessness and readmission more effectively than any drug"],
          ["Oxygen", "Long-term home oxygen when the arterial oxygen tension is at or below 55 millimetres of mercury (7.3 kilopascals), or 59 or below with complications — oedema, polycythaemia or pulmonary hypertension", "Given for at least 15 hours a day, and it improves survival in that group; the decision rests on blood gases, not on oxygen saturation"],
          ["Ventilation", "Non-invasive ventilation for persistent hypercapnic respiratory failure with an arterial pH of 7.35 or below and a carbon dioxide tension above 45 millimetres of mercury, two to four weeks after an exacerbation", "Reduces mortality and readmission, and is started after recovery and after excluding obstruction as the cause of the carbon dioxide retention"],
        ],
      },
      {
        type: "paragraph",
        text: "The inhaled corticosteroid question in chronic obstructive pulmonary disease is the mirror image of asthma: it is not the drug that changes the disease, and it is given to the subgroups in whom exacerbations are frequent or the eosinophil count is high, because in everyone else the pneumonia risk outweighs the benefit.",
      },

      { type: "heading", level: 2, text: "Acute exacerbations" },
      {
        type: "table",
        headers: ["", "Life-threatening and severe asthma", "Acute exacerbation of COPD"],
        rows: [
          ["First measures", "High-flow oxygen to a saturation of 94 to 98 percent, and a nebulised short-acting beta-agonist driven by oxygen", "Controlled or titrated oxygen to a target of 88 to 92 percent while arterial gases are obtained, plus nebulised bronchodilators"],
          ["Bronchodilator", "Repeated, or a continuous nebulised beta-agonist; add ipratropium bromide in severe attacks", "A short-acting beta-agonist with a short-acting muscarinic antagonist, repeated as needed"],
          ["Corticosteroid", "Oral prednisolone 40 to 50 milligrams for at least 5 to 7 days, started within the first hour", "Oral prednisolone 30 to 40 milligrams for 5 days"],
          ["Additional measures", "Intravenous magnesium sulphate in severe or refractory bronchospasm; consider parenteral beta-agonist, and ventilatory support when exhaustion develops", "Antibiotics for increased sputum purulence with increased volume or dyspnoea; non-invasive ventilation when the pH is below 7.35 with a raised carbon dioxide"],
          ["Features of life threat", "A silent chest, a respiratory rate above 25, a pulse above 110, a peak flow below a third of the best, exhaustion, cyanosis, confusion, and a normal or rising arterial carbon dioxide", "A silent chest, exhaustion with small tidal volumes, a rising carbon dioxide, a falling pH, oxygen saturation that cannot be corrected, and drowsiness"],
          ["Disposition", "A patient with any life-threatening feature is admitted, with the extreme cases admitted to intensive care", "Admission for any life-threatening feature, for hypercapnia, or where home support is inadequate"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "A normal or rising arterial carbon dioxide in an asthma attack is a sign of impending respiratory failure, because the tiring patient can no longer sustain the compensatory hyperventilation. It is one of the gravest findings on the blood gas and it mandates immediate ventilation support and intensive care review.",
      },
      {
        type: "paragraph",
        text: "In chronic obstructive pulmonary disease the oxygen paradox deserves a clear statement, because the traditional warning has become muddled. Hypoxaemia kills, so oxygen is never withheld; but a patient with a chronically raised carbon dioxide may lose their hypoxic drive and develop carbon dioxide narcosis if given too much oxygen, so the target saturation of 88 to 92 percent is observed and the blood gases are checked. The correct response to a rising carbon dioxide in a COPD patient is ventilation support, not withdrawal of the oxygen they need.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Antibiotics are not routine in an asthma exacerbation, but they are indicated in chronic obstructive pulmonary disease when sputum becomes purulent with increased volume or breathlessness, and in any exacerbation where ventilation support is needed.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Diagnosing chronic obstructive pulmonary disease in a young wheezy patient, or asthma in a 70-year-old smoker, on the basis of a single symptom. The discriminator is spirometry, and the history is what decides whether the test is performed at all.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Escalating the drug step without checking adherence and inhaler technique. Poor inhaler technique is the commonest reason for uncontrolled asthma, and a reliever over-use tells you so.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Withholding oxygen from a COPD patient because of the carbon dioxide retention. The patient is titrated onto controlled oxygen to a target saturation of 88 to 92 percent, with arterial gases measured, and ventilation is used for the carbon dioxide.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Reassurance from a normal peak flow at a clinic visit in a patient with episodic breathlessness. Spirometry between attacks may be normal in asthma, so a two-week peak flow diary or a provocation test is what establishes the diagnosis.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why is a high bicarbonate in a patient with chronic obstructive pulmonary disease a sign of chronic carbon dioxide retention rather than of a metabolic alkalosis?",
        answer: "Because the kidney compensates for a chronic respiratory acidosis by retaining bicarbonate, and that compensation takes days to weeks. A raised bicarbonate with a normal pH therefore indicates a long-standing raised carbon dioxide tension, which predicts carbon dioxide narcosis if the patient is over-oxygenated or sedated.",
        explanation: "The compensation disappears over days, so a patient who has been ventilated will drop their bicarbonate and may then lose the buffering that protects them.",
      },
      {
        type: "question",
        prompt: "A spirometer shows a post-bronchodilator FEV1 of 1.2 litres, an FVC of 3.0 litres and an FEV1 that rises 15 percent and by 250 millilitres after a bronchodilator. What does each number tell you?",
        answer: "The ratio of 0.40 confirms persistent airflow limitation. The rise of more than 12 percent and more than 200 millilitres shows significant reversibility, which supports asthma or asthma-COPD overlap rather than a purely fixed obstruction.",
        explanation: "Both numbers are needed: the ratio confirms the obstruction, the reversibility tells you how much of it is a reversible, muscular component.",
      },
      {
        type: "question",
        prompt: "Which features of an asthma attack indicate that the patient is tiring?",
        answer: "A falling respiratory rate with small tidal volumes and a silent chest, an inability to speak in sentences, exhaustion and a rising pulse, a normal or rising arterial carbon dioxide with a falling pH, and drowsiness or confusion. Any of these requires immediate ventilatory support and intensive care referral.",
        explanation: "The transition from a loud wheeze to a quiet chest is the transition from high airflow obstruction to airflow that is nearly absent, and it is the most feared sign.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which spirometric finding confirms a diagnosis of chronic obstructive pulmonary disease?",
        options: [
          "A raised FEV1 with a normal FVC at rest",
          "A post-bronchodilator FEV1 divided by FVC below 0.70",
          "A 15 percent rise in FEV1 after a bronchodilator",
          "A normal ratio with a reduced carbon monoxide transfer factor",
        ],
        correctIndex: 1,
        explanation: "Persistent airflow limitation is defined by a post-bronchodilator FEV1/FVC below 0.70, with symptoms, in a patient with an appropriate exposure. The rising-FEV1 option describes asthma reversibility.",
      },
      {
        type: "mcq",
        stem: "Which finding in an acute asthma attack indicates a life-threatening episode?",
        options: [
          "A peak expiratory flow at 60 percent of the patient's best",
          "A quiet chest with a normal or rising arterial carbon dioxide tension",
          "A respiratory rate of 24 with a pulse of 105",
          "Wheeze audible without a stethoscope",
        ],
        correctIndex: 1,
        explanation: "A silent chest means airflow is now too low to generate wheeze, and a normal or rising carbon dioxide means respiratory muscles are fatiguing and the compensatory hyperventilation can no longer be sustained — a life-threatening pattern.",
      },
      {
        type: "mcq",
        stem: "Which is an indication for long-term home oxygen therapy in chronic obstructive pulmonary disease?",
        options: [
          "A resting oxygen saturation below 94 percent on air",
          "An arterial oxygen tension of 7.0 kilopascals with peripheral oedema",
          "A raised arterial carbon dioxide tension alone",
          "A haemoglobin of 15 grams per decilitre",
        ],
        correctIndex: 1,
        explanation: "Long-term oxygen therapy improves survival when the arterial oxygen tension is at or below 7.3 kilopascals (55 millimetres of mercury), or 7.3 to 8.0 kilopascals with oedema, polycythaemia or pulmonary hypertension — assessed on blood gases, not on saturation alone.",
      },
      {
        type: "mcq",
        stem: "Which is the single most effective intervention to slow the decline in lung function in a patient with chronic obstructive pulmonary disease?",
        options: ["An inhaled corticosteroid", "Smoking cessation", "Pulmonary rehabilitation", "A tiotropium inhaler"],
        correctIndex: 1,
        explanation: "Smoking cessation is the only intervention that alters the accelerated decline in lung function; the other measures reduce symptoms and exacerbations, and rehabilitation improves exercise capacity and breathlessness.",
      },
      {
        type: "mcq",
        stem: "A patient with severe chronic obstructive pulmonary disease has an arterial pH of 7.28 with a carbon dioxide tension of 9.5 kilopascals, persisting after nebulised bronchodilators. What is the next treatment?",
        options: [
          "High-flow oxygen at 15 litres per minute",
          "Non-invasive ventilation with controlled oxygen targeting 88 to 92 percent",
          "Intravenous hydrocortisone 100 milligrams",
          "A short-acting beta-agonist alone at hourly intervals",
        ],
        correctIndex: 1,
        explanation: "A persistent respiratory acidosis with a raised carbon dioxide despite medical therapy is the indication for non-invasive ventilation, which reduces mortality and the need for intubation in this setting.",
      },

      { type: "heading", level: 2, text: "Module summary and next" },
      {
        type: "paragraph",
        text: "Asthma and chronic obstructive pulmonary disease are the two obstructive lung diseases, separated by the variable versus fixed nature of the obstruction and by the tissue that produces it. Asthma is treated by anti-inflammatory therapy with a bronchodilator for relief; chronic obstructive pulmonary disease is treated by bronchodilation, risk-factor removal and rehabilitation, with inhaled corticosteroids reserved for exacerbating and eosinophilic phenotypes. Both are dangerous in their acute decompensations, and in both the danger is seen in the silent chest and in the failing blood gas.",
      },
      {
        type: "paragraph",
        text: "Next: pneumonia and pleural disease — infection, effusion and air where they should not be, in which the severity score, the site of care and the pleural fluid are the three decisions that matter.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 11 — Pneumonia & pleural disease (fully authored)
// ---------------------------------------------------------------------------
function lesson11() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define pneumonia and classify it by site of acquisition and by severity; use the CURB-65 score to decide where a patient is treated; predict the likely organism from the setting and the comorbidity; interpret a chest radiograph for consolidation, effusion and cavitation; apply Light's criteria to a pleural fluid sample; recognise a complicated parapneumonic effusion and an empyema and state their management; and manage a pneumothorax, including the immediate treatment of a tension pneumothorax.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "PHYS 101 (the alveolar-capillary interface, ventilation and perfusion), MED 301 lesson 4 (fever and sepsis, and the first-hour bundle), lesson 3 (acid-base and the hypoxaemia of shunt), and the microbiology of the respiratory pathogens from MICR 201.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Pneumonia",
        text: "An acute infection of the lung parenchyma in which the alveoli fill with fluid, pus and inflammatory cells, so that the affected segments are perfused but not ventilated — a shunt, which is why hypoxaemia is resistant to oxygen alone.",
      },
      {
        type: "paragraph",
        text: "Consolidation is the pathological word and it explains everything clinical. The alveoli that are normally an air-filled interface with the capillary blood become a tissue-like mass, so oxygen cannot reach the blood passing through the affected segments. Blood then flows past an alveolus it cannot oxygenate, and the hypoxaemia that results is said to be refractory: raising the inspired oxygen does not fully correct it because the shunt fraction is unchanged. Fever, sputum, pleuritic pain and crackles are the visible consequences of the same alveolar flooding.",
      },
      {
        type: "definition",
        term: "Consolidation",
        text: "The state in which the normally air-filled alveoli are filled with inflammatory exudate, so that percussion is dull, breath sounds are bronchial and crackles are heard, and the chest radiograph shows a dense, airless area.",
      },

      { type: "heading", level: 2, text: "Classification" },
      {
        type: "table",
        headers: ["Category", "Definition", "Typical pathogens", "Treatment implication"],
        rows: [
          ["Community-acquired (mild)", "Acquired outside a healthcare facility, treated at home", "Streptococcus pneumoniae, Haemophilus influenzae, Moraxella catarrhalis, respiratory viruses including influenza and SARS-CoV-2", "Oral amoxicillin, or a macrolide or doxycycline when a penicillin allergy or a local pattern favours it"],
          ["Community-acquired (severe)", "Community-acquired pneumonia requiring admission, usually to a monitored bed", "Pneumococcus, but also Staphylococcus aureus after influenza, Legionella, Gram-negative bacilli, and atypicals", "Intravenous beta-lactam plus a macrolide, and consideration of atypical and viral cover with intensive care involvement"],
          ["Hospital-acquired (HAP)", "Onset more than 48 hours after admission, and not incubating on arrival", "Staphylococcus aureus including methicillin-resistant strains, Pseudomonas aeruginosa, Enterobacterales, Klebsiella", "Broader Gram-negative and resistant cover, guided by local cultures and prior antibiotics"],
          ["Ventilator-associated", "Onset more than 48 hours after endotracheal intubation", "The same as hospital-acquired pneumonia, with a higher burden of resistant organisms", "Cultures before changing antibiotics, and the narrowest effective regimen"],
          ["Aspiration", "Inhaled gastric or oropharyngeal contents, often with a depressed swallow or consciousness", "Anaerobes, Gram-negative bacilli, oral streptococci", "Cover anaerobes when the aspiration is of gastric content or there is periodontal disease, abscess or putrid sputum"],
          ["Immunocompromised host", "Any pneumonia in a patient with neutropenia, HIV, transplantation or steroid therapy", "Pneumocystis jirovecii, cytomegalovirus, fungi, Nocardia, tuberculosis", "Wider differential, earlier empirical cover, and treatment for Pneumocystis with co-trimoxazole when suspected"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Recurrent pneumonia in the same segment, or one that fails to resolve, implies an obstruction — an endobronchial tumour, a foreign body or a narrowing — and requires bronchoscopy rather than simply a second course of antibiotics.",
      },

      { type: "heading", level: 2, text: "Severity and the place of care" },
      {
        type: "table",
        headers: ["Score", "Components", "Interpretation"],
        rows: [
          ["CURB-65", "Confusion, urea above 7 millimoles per litre, respiratory rate 30 or more, blood pressure below 90 systolic or 60 diastolic, age 65 or over — one point each", "0 to 1: low risk, treat at home. 2: consider hospital admission. 3 to 5: admit, and treat 4 or more as severe, with urgent review for critical care"],
          ["CRB-65 (community version)", "Confusion, respiratory rate, blood pressure and age, without urea", "The same interpretation in general practice, where a blood urea result is not immediately available"],
          ["Pneumonia severity index", "Demographics, comorbidity, examination and laboratory values, giving low to high risk classes", "A more discriminating score for the moderate-risk patient, but more complex at the bedside"],
          ["Clinical judgement at the bedside", "Oxygen saturation, respiratory rate, exhaustion, comorbidity, social support", "Overrides any score: a patient with a low score and no support at home is still admitted"],
        ],
      },
      {
        type: "paragraph",
        text: "The score exists to keep mild pneumonia at home and severe pneumonia in hospital, because both errors carry a risk: treating a severe pneumonia at home is fatal, and admitting a mild one exposes the patient to hospital organisms and restraints. The score does not include the patient's ability to manage at home, which is why the last row is part of the tool.",
      },

      { type: "heading", level: 2, text: "Organism clues in the history" },
      {
        type: "table",
        headers: ["Clue", "Likely organism", "Why"],
        rows: [
          ["Influenza followed by a second deterioration after a few days", "Staphylococcus aureus", "The influenza-damaged airway is colonised, and the organism produces toxins and cavitation"],
          ["Age, alcohol dependence, smoking", "Klebsiella pneumoniae, Haemophilus", "Alcohol dependence and smoking alter the airway's defences and favour the Gram-negative flora"],
          ["Water systems, hotel stays, travel, hyponatraemia, high fever and diarrhoea", "Legionella pneumophila", "It replicates in warm water, and it causes a systemic illness with hyponatraemia and deranged liver tests"],
          ["A younger patient with a slow-onset cough, headache and malaise, with fewer chest signs than expected", "Mycoplasma pneumoniae, Chlamydia", "The atypical organisms cause an interstitial rather than an alveolar pattern, and a walking pneumonia"],
          ["A bird exposure, immunocompromise, or granulomatous disease", "Chlamydia psittaci, fungi, tuberculosis", "The exposure history suggests the pathogen"],
          ["A recent dental extraction, a seizure or alcohol intoxication with putrid sputum", "Anaererobic infection, and an abscess or empyema", "The anaerobes are the flora of the mouth and they destroy tissue"],
          ["A high CD4 count fall, a dry cough and marked desaturation on exertion", "Pneumocystis jirovecii", "A fungal organism that produces an interstitial shadow with profound desaturation out of proportion to the appearances"],
        ],
      },

      { type: "heading", level: 2, text: "Investigations in the management of pneumonia" },
      {
        type: "table",
        headers: ["Test", "Finding", "Use"],
        rows: [
          ["Chest radiograph", "Lobar or segmental consolidation, a lower-zone or perihilar pattern, cavitation, effusion, or diffuse interstitial change", "The definitive investigation, and the one that classifies the radiographic pattern; may lag behind the clinical picture"],
          ["Blood cultures", "Positive in a minority of severe cases", "Drawn before antibiotics in severe disease, and the reason to give antibiotics immediately after rather than before"],
          ["Sputum and throat swab", "A Gram stain and culture, plus a respiratory viral panel and atypical serology or urine antigens", "Guides a change of therapy in the patient who fails to respond"],
          ["Arterial blood gases", "Hypoxaemia with a widened alveolar-arterial gradient, and a respiratory alkalosis that becomes an acidosis if the patient tires", "Determines the need for oxygen and ventilatory support, and is essential in severe disease"],
          ["Bloods", "White cell count, CRP, procalcitonin, renal function, liver tests, electrolytes", "Establishes a baseline and detects the hyponatraemia and renal impairment of Legionella, and the sepsis that accompanies the disease"],
          ["Severity markers", "Lactate, procalcitonin, and the sepsis criteria of lesson 4", "Identifies the septic patient, and the need to look for a source or complication"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Give antibiotics immediately after blood cultures have been drawn, not after they are processed. The mortality of severe community-acquired pneumonia rises with every hour of delay, and no diagnostic test justifies withholding the first dose.",
      },

      { type: "heading", level: 2, text: "Failure to improve and the complications" },
      {
        type: "table",
        headers: ["Reason", "What to check", "Action"],
        rows: [
          ["Wrong diagnosis", "Is there heart failure, pulmonary embolism, malignancy or a pulmonary infarct? A patient with COVID-19 or an atypical infection has a slower radiographic resolution than the clinical course", "Re-examine, re-image, and reconsider the differential rather than simply extending the antibiotic course"],
          ["Resistant or unusual organism", "Culture results, prior antibiotics, immunosuppression, travel and animal exposure", "Change therapy guided by culture, and cover Staphylococcus aureus, Legionella, Pneumocystis and tuberculosis as the history indicates"],
          ["Complication", "Parapneumonic effusion, empyema, lung abscess, necrotising pneumonia, deep vein thrombosis of the legs, and cerebral or pulmonary metastases of the original infection", "Imaging, drainage for collections, and the treatment of the complication as the priority"],
          ["Host factor", "Immunosuppression, neutropenia, uncontrolled diabetes, malnutrition, alcohol dependence, obstructing lesion", "Address the host: glucose control, nutrition, reversal of obstruction, and reconsideration of the organism"],
        ],
      },
      {
        type: "table",
        headers: ["Complication", "Recognition", "Management"],
        rows: [
          ["Parapneumonic effusion", "A homogenous opacity in the costophrenic angle with a meniscus, and dullness with absent breath sounds and reduced tactile fremitus", "Aspirate for biochemistry, microscopy and culture, and drain if the fluid is an exudate with a low pH, positive Gram stain or frank pus"],
          ["Empyema", "Frank pus in the pleural space, a raised neutrophil count and protein, and loculation on ultrasound or CT", "Antibiotics plus intercostal drainage, with intrapleural fibrinolytics and surgical decortication if it fails to resolve"],
          ["Lung abscess", "Cavitation with an air-fluid level, a swinging fever, and foul sputum", "Prolonged antibiotics (usually 4 to 6 weeks), drainage for a large or non-resolving abscess, and treatment of the underlying aspiration risk"],
          ["Necrotising pneumonia", "Multiple thin-walled cavities that appear within days", "Antibiotics with a prolonged course, and drainage for a complicated collection"],
          ["Acute respiratory distress syndrome", "Refractory hypoxaemia with bilateral infiltrates arising within a week of the infection", "Lung-protective ventilation and supportive care, and the underlying infection is the only specific treatment"],
        ],
      },

      { type: "heading", level: 2, text: "Pleural effusion: transudate or exudate" },
      {
        type: "paragraph",
        text: "The first question of any pleural fluid is where it came from, because a transudate means the pleura is normal and the fluid has been forced out of the capillaries by hydrostatic or oncotic pressure, while an exudate means the pleura itself is diseased. Light's criteria distinguish them in three measurements, and the diagnosis then proceeds to the cause.",
      },
      {
        type: "table",
        headers: ["Light's criterion", "Value that makes the fluid an exudate"],
        rows: [
          ["Pleural fluid protein divided by serum protein", "Above 0.5"],
          ["Pleural fluid lactate dehydrogenase divided by serum lactate dehydrogenase", "Above 0.6"],
          ["Pleural fluid lactate dehydrogenase", "Above two thirds of the upper limit of the laboratory's normal serum value"],
        ],
      },
      {
        type: "paragraph",
        text: "One criterion is enough to make the fluid an exudate; none of the three being met makes it a transudate. In the special case of a patient on diuretics for heart failure, the protein gradient may be artificially high — so a pleural fluid protein above that of the serum, or an elevated protein gradient above 3.1 grams per decilitre, supports a transudate rather than the diagnosis the Light's criteria would suggest.",
      },
      {
        type: "table",
        headers: ["", "Transudate", "Exudate"],
        rows: [
          ["Commonest cause", "Left heart failure", "Pneumonia (parapneumonic), malignancy, pulmonary embolism, tuberculosis, pancreatitis, and connective tissue disease"],
          ["Differential list", "Heart failure, cirrhosis with ascites, nephrotic syndrome, hypoalbuminaemia, constrictive pericarditis, superior vena cava obstruction", "Malignancy (lung, breast, lymphoma, mesothelioma), pneumonia and empyema, pulmonary embolism, tuberculosis, rheumatoid disease, pancreatitis"],
          ["pH", "Normal at about 7.6", "Below 7.2 suggests infection or malignancy; below 7.2 with fibrinopurulent fluid is a complicated parapneumonic effusion"],
          ["Glucose", "Similar to serum", "Low in empyema, rheumatoid disease, tuberculosis and malignancy"],
          ["Cytology", "Scant cells", "Malignant cells are diagnostic, and are found in about 60 percent of malignant effusions"],
          ["Management", "Treat the cause; the effusion resolves with the underlying disease", "Drain if symptomatic or if it is an effusion complicating infection; investigate with cytology and biopsy"],
        ],
      },

      { type: "heading", level: 2, text: "Pneumothorax" },
      {
        type: "table",
        headers: ["Type", "Mechanism", "Management"],
        rows: [
          ["Primary, spontaneous", "Rupture of a subpleural bleb in a young, tall, thin patient with normal lungs", "Needle aspiration if the rim is 2 centimetres or more or the patient is breathless; discharge with advice to avoid flying and diving to follow"],
          ["Secondary, spontaneous", "Rupture through diseased lung in chronic obstructive pulmonary disease or asthma", "Always admitted, and more likely to need an intercostal drain because the underlying lung cannot tolerate the collapse"],
          ["Traumatic", "Rib fracture, penetrating injury, or barotrauma from ventilation", "Chest drain for any traumatic pneumothorax; do not use positive pressure ventilation before the drain"],
          ["Tension", "A one-way valve effect so that air accumulates and collapses the lung and shifts the mediastinum", "Immediate needle decompression in the second intercostal space in the midclavicular line (or the fifth space in the anterior axillary line), then a formal chest drain — it is a clinical diagnosis made before the radiograph"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The signs of a tension pneumothorax are absent breath sounds on the affected side, tracheal deviation away from it, hyper-resonance, respiratory distress and hypotension — and the treatment is needle decompression, not a radiograph. Waiting for imaging is the classic and fatal error.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Guidelines differ in their size thresholds and equipment, and local protocols govern the detail; the invariant principles are that any symptomatic or secondary pneumothorax is admitted, that a drain is inserted for signs of tension or failure, and that breathlessness with a raised venous pressure and deviation is decompressed first and filmed afterwards.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Waiting for a chest radiograph before treating a suspected tension pneumothorax, or before giving oxygen to a hypoxaemic patient. The clinical signs are sufficient, and the delay of minutes is what determines the outcome.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Diagnosing heart failure in a patient with an effusion without checking whether the fluid is a transudate. An exudate in an elderly patient with breathlessness may be a malignancy or an embolic effusion rather than the failure it was assumed to be.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Attributing a failure to improve to antibiotic resistance alone. The commonest reasons are a wrong diagnosis, an unrecognised complication, or the presence of an obstruction — so the patient is re-examined and re-imaged rather than simply re-treated.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Missing a pneumothorax on a supine chest radiograph, where the air collects in the anterior and basal positions rather than at the apex. Look at the deep sulcus sign and the costophrenic angle on any supine trauma film.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why is the hypoxaemia of consolidation only partly corrected by a high inspired oxygen?",
        answer: "Because blood continues to perfuse the fluid-filled, unventilated alveoli — a shunt — so that blood passes the lung without taking up oxygen, whatever the inspired fraction. The shunt fraction determines the ceiling, and correcting it requires recruitment of the alveoli (or reduced perfusion to them), not more oxygen.",
        explanation: "The physiology of the shunt explains why consolidation makes the patient more breathless than the pneumonic fever alone would predict.",
      },
      {
        type: "question",
        prompt: "A 70-year-old with pneumonia has a confusion score of 10 out of 10, a urea of 9 millimoles per litre, a respiratory rate of 32, a blood pressure of 88/58 and an age of 70. What is the CURB-65 score and the disposition?",
        answer: "Five points. A score of 3 or more requires hospital admission, and 4 to 5 indicates severe pneumonia requiring urgent review for critical care, with antibiotics and supportive treatment started immediately.",
        explanation: "The score converts five bedside items into a decision about the level of care, which is the part of the assessment that most changes outcome.",
      },
      {
        type: "question",
        prompt: "How do Light's criteria distinguish a transudate from an exudate, and what are the commonest causes of each?",
        answer: "A pleural fluid to serum protein ratio above 0.5, a fluid to serum lactate dehydrogenase ratio above 0.6, or a fluid lactate dehydrogenase above two thirds of the upper normal serum limit, any one of which makes the fluid an exudate. Transudates are usually from heart failure, cirrhosis or nephrotic syndrome; exudates from pneumonia, malignancy, pulmonary embolism and tuberculosis.",
        explanation: "The classification is the first step because it determines which further investigations are needed and which treatments are effective.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A 68-year-old with community-acquired pneumonia has a CURB-65 score of 3. Which disposition is appropriate?",
        options: [
          "Treat at home with oral amoxicillin",
          "Admit to hospital with early review, treating the score as severe pneumonia",
          "Admit directly to intensive care only if the score reaches 5",
          "Discharge with a review in 48 hours",
        ],
        correctIndex: 1,
        explanation: "A CURB-65 of 3 or more indicates severe community-acquired pneumonia requiring hospital admission and urgent review; scores of 4 to 5 mandate consideration of critical care.",
      },
      {
        type: "mcq",
        stem: "A patient on the ward has become suddenly breathless with absent breath sounds on the right, tracheal deviation to the left and a blood pressure of 78/50. What is the immediate action?",
        options: [
          "Arrange an urgent chest radiograph",
          "Perform immediate needle decompression on the right",
          "Give high-flow oxygen and repeat the examination in 10 minutes",
          "Start a fluid bolus and obtain arterial blood gases",
        ],
        correctIndex: 1,
        explanation: "These are the signs of a tension pneumothorax, which is a clinical diagnosis: immediate needle decompression in the second intercostal space anteriorly precedes the radiograph and any other investigation.",
      },
      {
        type: "mcq",
        stem: "A pleural fluid sample has a fluid to serum protein ratio of 0.65 and a low pH of 7.0 with abundant neutrophils. What is the diagnosis and the management?",
        options: [
          "A transudate from heart failure, treated with diuretics",
          "An empyema, treated with antibiotics and chest drainage",
          "A malignant effusion, treated with pleurodesis",
          "A chylothorax, treated with a fat-restricted diet",
        ],
        correctIndex: 1,
        explanation: "The protein ratio confirms an exudate; a low pH with abundant neutrophils is a complicated parapneumonic effusion or empyema, and it requires antibiotics plus drainage rather than diuretics.",
      },
      {
        type: "mcq",
        stem: "Which organism is classically associated with pneumonia that develops after influenza?",
        options: ["Streptococcus pneumoniae", "Legionella pneumophila", "Staphylococcus aureus", "Mycoplasma pneumoniae"],
        correctIndex: 2,
        explanation: "Post-influenza pneumonia with a second deterioration, cavitation or a rapid course suggests Staphylococcus aureus, which colonises the damaged airway and produces toxin-mediated disease.",
      },
      {
        type: "mcq",
        stem: "A patient admitted with pneumonia has been treated for 48 hours and is not improving. Which action is most appropriate?",
        options: [
          "Continue the same antibiotics for a further 48 hours without review",
          "Re-examine, re-image, and look for a wrong diagnosis or a complication such as an effusion or an obstruction",
          "Escalate the antibiotics to a broad-spectrum regimen without cultures",
          "Discharge the patient to recover at home",
        ],
        correctIndex: 1,
        explanation: "Failure to improve is most often due to a wrong diagnosis or an unrecognised complication, so the patient is re-assessed and re-imaged rather than simply re-treated with broader antibiotics.",
      },

      { type: "heading", level: 2, text: "Module summary and next" },
      {
        type: "paragraph",
        text: "Pneumonia is a shunt disease: the alveoli are flooded, so hypoxaemia is the life-threatening consequence and the organism is the cause. The bedside task is threefold — to score the severity and so choose the site of care, to predict the organism from the setting, and to detect the complications of effusion, empyema and abscess. The pleural space is governed by the same principle: the fluid's chemistry tells you whether it is a transudate to be treated by its cause or an exudate to be investigated and drained.",
      },
      {
        type: "paragraph",
        text: "Next: pulmonary embolism — the other cause of pleuritic pain and breathlessness, in which the diagnosis rests on a probability score and the danger is in the delay.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 12 — Pulmonary embolism & pulmonary hypertension (fully authored)
// ---------------------------------------------------------------------------
function lesson12() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the pathophysiology of a pulmonary embolus and relate it to Virchow's triad; calculate a Wells or Geneva pre-test probability for a suspected embolus; apply the diagnostic algorithm, including the correct use and misuse of the D-dimer; recognise the clinical features of a high-risk embolus with right heart strain; state the immediate anticoagulation and reperfusion decisions; and define pulmonary hypertension and outline its causes and treatment.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "PHYS 101 (the pulmonary circulation, right ventricular function and gas exchange), MED 301 lesson 5 (the ECG, including right heart strain), lesson 4 (sepsis) and lesson 3 (shunt physiology), and PHRM 202 (anticoagulants and thrombolytics).",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Pulmonary embolism",
        text: "The obstruction of a branch of the pulmonary artery, usually by a thrombus that has detached from a deep vein of the leg or the pelvis, producing a sudden increase in pulmonary vascular resistance and in right ventricular afterload.",
      },
      {
        type: "paragraph",
        text: "The embolus does two things, and the clinical picture is the sum of both. It occludes a pulmonary artery branch, which deprives a segment of the lung of blood flow: that segment is now ventilated but not perfused, which is alveolar dead space, so carbon dioxide rises and hypoxaemia follows because blood is redistributed to alveoli that were already poorly ventilated. More importantly, it obstructs the outflow of the right ventricle, which must generate a pressure it was not built to withstand; that ventricle fails, its filling pressure rises, the septum shifts, and the cardiac output falls. The patient who dies of a pulmonary embolus dies of right ventricular failure, not of hypoxaemia.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The most common electrocardiographic finding in pulmonary embolism is sinus tachycardia. The classic S1Q3T3 pattern — an S wave in lead I, a Q wave in lead III and an inverted T wave in lead III — with right axis deviation, a right bundle branch block or T wave inversion in V1 to V4 indicates right heart strain and points to the size of the clot rather than to the diagnosis.",
      },

      { type: "heading", level: 2, text: "Virchow's triad: where the thrombus forms" },
      {
        type: "table",
        headers: ["Limb of the triad", "Mechanism", "Clinical examples"],
        rows: [
          ["Stasis of blood flow", "Flow in the valve pockets of the calf veins slows, so activated clotting factors accumulate locally rather than being diluted", "Immobility, long-haul travel, long operations, casts and splints, obesity, pregnancy, paralysis, heart failure"],
          ["Injury to the vessel wall", "Damaged endothelium activates coagulation and provides a surface for platelet adhesion", "Trauma, surgery (particularly orthopaedic and pelvic), central venous catheters, previous deep vein thrombosis"],
          ["Hypercoagulability of the blood", "A constitutional or acquired tendency so that clot forms more readily", "Malignancy, pregnancy and the puerperium, oestrogen therapy, antiphospholipid syndrome, inflammatory disease, nephrotic syndrome, thrombophilia, dehydration, smoking"],
        ],
      },
      {
        type: "paragraph",
        text: "Nearly three quarters of patients with a pulmonary embolus have a demonstrable deep vein thrombosis, and the majority of patients with a proximal deep vein thrombosis have an asymptomatic embolus. The two are one disease, so a patient with a swollen, tender calf and breathlessness has both, and a patient with a pulmonary embolus needs their legs examined and imaged.",
      },

      { type: "heading", level: 2, text: "The clinical presentation and the pre-test probability" },
      {
        type: "table",
        headers: ["","Finding"],
        rows: [
          ["Symptoms", "Sudden pleuritic chest pain, breathlessness, haemoptysis (from a pulmonary infarct), cough, syncope or a sense of impending collapse, and anxiety"],
          ["Signs", "Tachypnoea, tachycardia, a raised jugular venous pressure, a loud pulmonary component of the second heart sound, a low-grade fever, calf swelling or tenderness, and in the extreme a collapse with a raised venous pressure and a low arterial pressure"],
          ["Effects that look like something else", "A patient with pleuritic pain after surgery, a patient with breathlessness after a flight, a postoperative patient who desaturates, and a breathless patient with a clear chest radiograph"],
        ],
      },
      {
        type: "table",
        headers: ["Wells score item", "Points"],
        rows: [
          ["Clinical signs of deep vein thrombosis (swelling, tenderness)", "3"],
          ["Pulmonary embolism is the most likely diagnosis, or an alternative is unlikely", "3"],
          ["Previous deep vein thrombosis or pulmonary embolism", "1.5"],
          ["Heart rate above 100", "1.5"],
          ["Immobilisation for at least 3 days, or surgery within 4 weeks", "1.5"],
          ["Active cancer", "1"],
          ["Haemoptysis", "1"],
        ],
      },
      {
        type: "paragraph",
        text: "A two-level version of the same score is what most protocols use: a score of 4 or less makes the embolism unlikely, and a score above 4 makes it likely. That binary divides the pathway — the unlikely arm goes to a D-dimer, and the likely arm goes straight to definitive imaging, because in that group a negative D-dimer would not be safe enough to act on.",
      },
      {
        type: "definition",
        term: "Pre-test probability",
        text: "The likelihood of disease before any investigation is performed, estimated from the history and examination. It sets the interpretation of every subsequent test, because the same D-dimer result means different things in a patient at low and at high risk.",
      },

      { type: "heading", level: 2, text: "D-dimer: what it can and cannot do" },
      {
        type: "paragraph",
        text: "D-dimer is a fibrin degradation product, and it is raised whenever there is clot formation and breakdown somewhere in the body. It is therefore sensitive but entirely non-specific: it is raised in infection, malignancy, pregnancy, the postoperative state, trauma, aneurysmal disease and old age. Its value is a negative result in a patient whose pre-test probability is low, where it can safely exclude the diagnosis. A positive D-dimer never diagnoses anything, and a negative D-dimer in a patient in whom the embolism is likely does not mean it is absent.",
      },
      {
        type: "table",
        headers: ["Use", "Rule", "Reason"],
        rows: [
          ["Excluding the diagnosis", "Only when the pre-test probability is low or the score makes the embolism unlikely", "The sensitivity in that setting is high enough that a negative result reduces the post-test probability below the threshold for investigation"],
          ["Age adjustment", "In patients over 50, the threshold is age multiplied by 10 nanograms per millilitre (for example 700 in a 70-year-old)", "Age alone raises the D-dimer, so an unadjusted threshold generates many unnecessary scans in the elderly"],
          ["Diagnosing the diagnosis", "Never: a positive result is followed by imaging", "The test is raised in a third of all medical inpatients without any thrombotic disease"],
          ["When the probability is high", "Do not order it: go to imaging and treat while waiting", "The post-test probability after a negative D-dimer in a high-probability patient is still too high to act on"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The single commonest error in the pathway is ordering a D-dimer in a patient in whom the embolism is clinically likely and then standing down when it returns negative. The test was never capable of answering the question in that patient.",
      },

      { type: "heading", level: 2, text: "The diagnostic pathway" },
      {
        type: "table",
        headers: ["Probability", "Next step", "If positive", "If negative"],
        rows: [
          ["Unlikely (Wells 4 or less)", "D-dimer", "CT pulmonary angiography", "No further investigation; consider another diagnosis and repeat if symptoms persist"],
          ["Likely (Wells above 4)", "Immediate CT pulmonary angiography; start therapeutic anticoagulation while awaiting it if the delay is anticipated", "Treat and assess the risk of the clot", "Consider an alternative diagnosis and further imaging, including a bilateral leg ultrasound or ventilation-perfusion scan"],
          ["Unstable or peri-arrest", "Bedside echocardiography looking for right ventricular dilatation and dysfunction, with immediate reperfusion if positive", "High-risk embolism: thrombolysis", "Continue resuscitation and address the reversible causes"],
          ["Pregnancy or renal impairment or contrast contraindication", "Bilateral leg compression ultrasound first, and a ventilation-perfusion scan or perfusion-only scanning if the legs are clear", "Treat", "Consider CTPA with fetal risk assessment or a normogram-guided pathway"],
        ],
      },
      {
        type: "definition",
        term: "CT pulmonary angiography",
        text: "The definitive investigation for pulmonary embolism: a computed tomographic scan timed to the arterial phase, which shows the pulmonary arteries and the filling defect produced by the clot, and also visualises the right ventricle and any alternative diagnosis in the same study.",
      },
      {
        type: "paragraph",
        text: "Ventilation-perfusion scanning remains useful where iodinated contrast is contraindicated — renal impairment, pregnancy, severe allergy — because the isotope scan shows a ventilated but unperfused segment. The trade-off is that a normal chest radiograph is required for the result to be interpretable, and a third of scans are non-diagnostic.",
      },

      { type: "heading", level: 2, text: "Risk stratification and treatment" },
      {
        type: "table",
        headers: ["Risk", "Haemodynamics", "Right ventricle", "Treatment"],
        rows: [
          ["High risk (massive)", "Hypotension — a systolic below 90 millimetres of mercury for 15 minutes or more, or a fall of 40 or more, or cardiac arrest, or shock requiring inotropes", "Dilated and hypokinetic on echo or CT", "Systemic thrombolysis (alteplase) unless absolutely contraindicated; percutaneous catheter-directed therapy or surgical embolectomy when lysis fails or is contraindicated"],
          ["Intermediate high risk", "Normotensive, but with right ventricular dysfunction on imaging and a raised troponin or natriuretic peptide", "Dilated and/or hypokinetic, with biomarkers positive", "Therapeutic anticoagulation and monitored admission; thrombolysis for rescue if the patient deteriorates"],
          ["Intermediate low risk", "Normotensive with right ventricular dysfunction or biomarkers alone", "One positive, one negative", "Therapeutic anticoagulation, usually on a ward with early mobilisation"],
          ["Low risk", "Normotensive with no right ventricular dysfunction and negative biomarkers", "Normal", "Outpatient management may be appropriate with a direct oral anticoagulant and a structured follow-up, in a patient without another reason for admission"],
        ],
      },
      {
        type: "paragraph",
        text: "Anticoagulation is the therapy in every case, because it stops propagation and recurrence while the body lyses what is already there. The usual course is an initial parenteral agent — low molecular weight heparin or fondaparinux — followed by a direct oral anticoagulant (apixaban or rivaroxaban) for at least three months; then a decision on extended therapy driven by whether the embolus was provoked, and by the bleeding risk. Warfarin is used where a direct oral anticoagulant is contraindicated, and it is overlapped with heparin until the international normalised ratio is therapeutic.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "An inferior vena cava filter is not an alternative to anticoagulation: its only accepted role is in a patient with an acute proximal deep vein thrombosis or pulmonary embolism in whom anticoagulation is absolutely contraindicated, or in whom it fails. Once anticoagulation becomes possible, the filter is removed or the anticoagulant is restarted.",
      },
      {
        type: "table",
        headers: ["Contraindication to thrombolysis", "Note"],
        rows: [
          ["Absolute (roughly)", "Any prior intracranial haemorrhage, a known intracranial neoplasm, an ischaemic stroke within three months, a suspected aortic dissection, active bleeding or a bleeding diathesis, recent significant head or facial trauma, recent intracranial or spinal surgery"],
          ["Relative", "Current anticoagulation with controlled levels, a transient ischaemic attack within six months, uncontrolled hypertension above 180/110, pregnancy, recent internal bleeding, a recent major operation or prolonged cardiopulmonary resuscitation"],
        ],
      },

      { type: "heading", level: 2, text: "Pulmonary hypertension" },
      {
        type: "definition",
        term: "Pulmonary hypertension",
        text: "A resting mean pulmonary arterial pressure above 20 millimetres of mercury, with a pulmonary vascular resistance above 2 Wood units and a pulmonary artery wedge pressure of 15 or below — an elevated pressure that arises either from increased flow, from increased resistance in the pulmonary arteries, or from a raised pressure transmitted backwards from the left heart or the pulmonary veins.",
      },
      {
        type: "table",
        headers: ["Group", "Mechanism", "Examples"],
        rows: [
          ["1 — Pulmonary arterial hypertension", "Remodelling of the small pulmonary arterioles with a raised resistance", "Idiopathic, heritable, connective tissue disease (scleroderma), HIV, portal hypertension, congenital shunts, drug-induced (anorexigens, methamphetamine)"],
          ["2 — Left heart disease", "A raised left atrial and pulmonary venous pressure transmitted backwards", "Heart failure with reduced or preserved ejection fraction, valve disease"],
          ["3 — Lung disease and hypoxia", "Chronic hypoxia causes vasoconstriction and remodelling", "Chronic obstructive pulmonary disease, interstitial lung disease, obstructive sleep apnoea, high altitude"],
          ["4 — Chronic thromboembolic", "Organised, fibrotic emboli that fail to resolve", "Proximal disease after a pulmonary embolism, which is potentially curable by surgery"],
          ["5 — Unclear and multifactorial", "Haematological, systemic and metabolic mechanisms", "Chronic haemolytic anaemia, sarcoid, chronic renal failure"],
        ],
      },
      {
        type: "paragraph",
        text: "The presentation is the same whichever the group: exertional breathlessness, fatigue, chest pain, syncope, and a raised jugular venous pressure with a loud pulmonary second sound and a left parasternal heave, with a low cardiac output in the late stage. The management is to treat the underlying cause — anticoagulation and surgical endarterectomy for the chronic thromboembolic group, oxygen and treatment of lung disease for group 3, and optimisation of the left heart for group 2 — with specific vasodilator therapy (an endothelin receptor antagonist, a phosphodiesterase 5 inhibitor, a soluble guanylate cyclase stimulant, or a prostacyclin analogue) reserved for the specialist management of pulmonary arterial hypertension.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Never give a non-selective vasodilator or a calcium channel blocker to a patient with pulmonary hypertension from left heart disease or lung disease, and never treat pulmonary hypertension from chronic lung disease with oxygen as though it were a primary vascular disease. The right heart needs its preload and its oxygenation, not a vasodilator.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Ordering a D-dimer in a high-probability patient and taking a negative result as exclusion. In that setting the correct action is imaging, with anticoagulation started if the imaging will be delayed.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Withholding anticoagulation while waiting for the CT pulmonary angiogram in a patient with a likely pulmonary embolism. The risk of death in the hours before the scan exceeds the risk of bleeding in a patient without a contraindication, so the drug is given and the scan follows.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Deferring treatment in a normotensive patient with an intermediate-risk embolism and right ventricular dysfunction. These patients can deteriorate abruptly, so they are monitored and the rescue thrombolysis decision is planned rather than improvised.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Attributing pleuritic chest pain to a musculoskeletal cause in a patient who has had recent surgery, is pregnant, has cancer, or has a swollen calf. The pre-test probability is set by the context, and the context in those patients is high.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does a patient with a large pulmonary embolus collapse rather than simply become breathless?",
        answer: "Because the embolus obstructs the outflow of the right ventricle, which was not built to generate a high pressure. The right ventricle dilates and fails, the septum shifts into the left ventricle, the left ventricular filling falls, and the cardiac output collapses — so the patient develops a raised venous pressure with a low arterial pressure and syncopes or arrests.",
        explanation: "This is why the critical decision in a suspected embolus with a shock state is echocardiography and reperfusion, not the D-dimer or the scan.",
      },
      {
        type: "question",
        prompt: "In which patients is a D-dimer useful for excluding a pulmonary embolism, and in which is it actively unsafe to rely on?",
        answer: "It is useful where the pre-test probability is low or the Wells score makes the embolism unlikely, where a negative result reduces the post-test probability below the threshold for investigating. It is unsafe to rely on when the clinical probability is high, and it is useless in pregnancy, postoperative states, sepsis, malignancy and old age, where it is raised by other causes.",
        explanation: "The pre-test probability determines the value of the test, and the error is always in the direction of ordering a test to reassure rather than to answer.",
      },
      {
        type: "question",
        prompt: "A patient with a confirmed submassive pulmonary embolism has a raised troponin and a dilated right ventricle on CT. How does that change the management?",
        answer: "It makes the embolism intermediate-high risk: normotensive now, but with evidence of right ventricular strain. The patient is anticoagulated therapeutically, admitted to a monitored bed, and watched closely, because the risk of decompensation is real and thrombolysis may be needed as rescue.",
        explanation: "Risk stratification is about the potential for haemodynamic collapse, not only about the pressure measured on arrival.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A patient has pleuritic chest pain, a heart rate of 112 and a haematemesis-free Wells score of 5, making a pulmonary embolism likely. What is the correct next step?",
        options: [
          "A D-dimer, and no treatment if it is negative",
          "Immediate CT pulmonary angiography, with therapeutic anticoagulation started while it is arranged",
          "A ventilation-perfusion scan as the first investigation",
          "Discharge with advice and a review in a week",
        ],
        correctIndex: 1,
        explanation: "When the embolism is clinically likely, the D-dimer cannot exclude it, so the pathway goes directly to CT pulmonary angiography and anticoagulation is not delayed while the scan is arranged.",
      },
      {
        type: "mcq",
        stem: "Which patient is most appropriate for D-dimer testing to exclude pulmonary embolism?",
        options: [
          "A 34-year-old with mild breathlessness and a recent flight, with no comorbidity and a Wells score of 1",
          "A patient with a heart rate of 130 and a mass in the pelvis",
          "A postoperative patient with a heart rate of 120 and a raised jugular venous pressure",
          "A patient whose chest radiograph shows a large pleural effusion",
        ],
        correctIndex: 0,
        explanation: "D-dimer is useful only where the pre-test probability is low or the score makes an embolism unlikely. Postoperative states, malignancy and a raised venous pressure all raise the D-dimer and make the result uninterpretable.",
      },
      {
        type: "mcq",
        stem: "A patient with a pulmonary embolism is hypotensive, with a systolic blood pressure of 80 and signs of right heart strain on the bedside echocardiogram. Which treatment is indicated?",
        options: [
          "Low molecular weight heparin alone",
          "Systemic thrombolysis with alteplase",
          "Oral anticoagulation started immediately",
          "An inferior vena cava filter",
        ],
        correctIndex: 1,
        explanation: "Hypotension from a pulmonary embolism defines the high-risk group, in which systemic thrombolysis is indicated unless absolutely contraindicated; unfractionated heparin is used alongside in the unstable patient.",
      },
      {
        type: "mcq",
        stem: "Which of the following is NOT one of the limbs of Virchow's triad?",
        options: ["Stasis of blood flow", "Endothelial injury", "Hypercoagulability of the blood", "Pulmonary vasoconstriction"],
        correctIndex: 3,
        explanation: "Virchow's triad is stasis, vessel wall injury and hypercoagulability. Pulmonary vasoconstriction is the mechanism by which hypoxia damages the lung, not a cause of venous thrombosis.",
      },
      {
        type: "mcq",
        stem: "A patient with an obstructive sleep apnoea and a chronically raised carbon dioxide tension has exertional breathlessness, a raised jugular venous pressure and echo evidence of pulmonary hypertension. Which mechanism is most likely?",
        options: [
          "Chronic thromboembolic disease (group 4)",
          "Pulmonary arterial hypertension (group 1)",
          "Lung disease with chronic hypoxia (group 3)",
          "Transmitted left heart pressure (group 2)",
        ],
        correctIndex: 2,
        explanation: "Chronic hypoxia from obstructive sleep apnoea, chronic obstructive pulmonary disease or interstitial lung disease produces hypoxic pulmonary vasoconstriction and vascular remodelling, which is the group 3 mechanism.",
      },

      { type: "heading", level: 2, text: "Module summary and next" },
      {
        type: "paragraph",
        text: "Pulmonary embolism is a disease of the deep veins and the pulmonary arterial tree, and it is deadly for one reason: the right ventricle cannot pump against an abruptly obstructed outflow. The clinical pathway is built from a pre-test probability, a test whose value depends entirely on that probability, and a risk stratification that decides whether the patient needs anticoagulation, monitoring, or thrombolysis. Pulmonary hypertension is the chronic consequence of an obstructed, constricted or overloaded pulmonary circulation, and its management begins with the group the disease belongs to.",
      },
      {
        type: "paragraph",
        text: "Next module: gastroenterology and hepatology. Method 5: endocrinology and metabolism, in which the endocrine assessment is followed by diabetes mellitus, adrenal and pituitary disease, and the metabolic emergencies.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 13 — Diabetes mellitus (fully authored)
// ---------------------------------------------------------------------------
function lesson13() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: state the diagnostic thresholds for diabetes and the categories of impaired glucose regulation; distinguish type 1, type 2 and the rarer causes at a clinical encounter; explain the natural history of type 2 diabetes as an insulin resistance with a progressive beta-cell failure; select the first-line and second-line treatments for type 2 diabetes given the comorbidity; describe the principles of the basal-bolus insulin regimen and of insulin titration; recognise hypoglycaemia, diabetic ketoacidosis and the hyperosmolar hyperglycaemic state; and list the microvascular and macrovascular complications and the surveillance that detects them.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "PHYS 101 and BCHM 101 (insulin, glucagon, carbohydrate and lipid metabolism), MED 301 lesson 3 (fluid, electrolyte and acid-base balance, and the anion gap) and lesson 4 (sepsis), plus PHRM 202 (insulin preparations and the oral agents).",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Diabetes mellitus",
        text: "A group of metabolic diseases characterised by hyperglycaemia arising from defects in insulin secretion, in insulin action, or in both — with the commonest two forms being type 1, in which the pancreatic beta cells are destroyed and the insulin deficiency is absolute, and type 2, in which the resistance is to insulin and the deficiency is relative and progressive.",
      },
      {
        type: "paragraph",
        text: "Insulin is the single hormone of the fed state: it moves glucose into muscle and fat, it stops the liver producing glucose, it stores fat and it builds protein. Remove it entirely and the body cannot use glucose for energy even though the blood is full of it, so it breaks down fat instead and produces ketones, and the patient loses weight and ketones while hyperglycaemic. Resist it and the tissues still take up glucose, but only when the insulin level is driven high enough, so the pancreas is overworked for years before it fails. That difference — absolute versus relative deficiency — is the boundary between the two commonest types, and it explains almost every difference in the presentation.",
      },
      {
        type: "definition",
        term: "Hyperglycaemia without ketones",
        text: "A state in which insulin is present in sufficient quantity to suppress lipolysis and ketogenesis, but not sufficient to control the glucose — the biochemical situation of type 2 diabetes, which is why its emergency is a hyperosmolar state without significant ketonaemia.",
      },

      { type: "heading", level: 2, text: "Diagnosis and classification" },
      {
        type: "table",
        headers: ["Category", "Diagnostic criteria", "Note"],
        rows: [
          ["Diabetes mellitus", "A fasting plasma glucose of 7.0 millimoles per litre or more on two occasions; or a random glucose of 11.1 or more with symptoms; or a glycated haemoglobin (HbA1c) of 48 millimoles per mole (6.5 percent) or more; or a two-hour glucose of 11.1 or more on an oral glucose tolerance test", "Any one criterion, confirmed on a second sample unless the patient is symptomatic — hyperglycaemia is not diagnosed on a single laboratory result"],
          ["Impaired fasting glucose", "A fasting glucose of 6.1 to 6.9 millimoles per litre", "A prediabetic state that carries both a risk of conversion and a cardiovascular risk of its own"],
          ["Impaired glucose tolerance", "A two-hour glucose of 7.8 to 11.0 millimoles per litre on a tolerance test", "The same significance, and a more powerful predictor of conversion than the fasting value"],
          ["Prediabetes by HbA1c", "A glycated haemoglobin of 42 to 47 millimoles per mole", "Assessed because the value integrates the control over the preceding 8 to 12 weeks, and is unaffected by recent fasting"],
          ["Type 1 diabetes", "An absolute insulin deficiency: autoimmune beta-cell destruction (glutamic acid decarboxylase and islet cell antibodies), with a ketosis-prone patient and a low C-peptide", "Not always childhood: the adult-onset latent autoimmune form (LADA) presents in adulthood and is diagnosed by antibodies and insulin requirement"],
          ["Type 2 diabetes", "Insulin resistance with a progressive beta-cell failure: the onset is later, obesity and acanthosis nigricans are common, and there is no ketosis at presentation", "Accounts for about nine tenths of all cases; a family history in a first-degree relative is present in most"],
          ["Monogenic and secondary", "Maturity-onset diabetes of the young (MODY) in a young non-obese patient with a strong autosomal-dominant family history; and the secondary causes — pancreatitis, pancreatectomy, cystic fibrosis, Cushing's syndrome, acromegaly, thyrotoxicosis, haemochromatosis, glucocorticoid or antipsychotic therapy", "Recognising them changes the treatment: a steroid-induced diabetes is treated by reducing the steroid, and MODY by oral sulphonylureas rather than insulin"],
          ["Gestational diabetes", "A glucose intolerance first recognised in pregnancy, screened with a fasting glucose and a tolerance test", "Resolves after delivery in most, but predicts type 2 diabetes and requires a follow-up test"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "HbA1c is unreliable where the red cell turnover is altered: anaemia, haemoglobinopathy, recent transfusion, pregnancy and chronic kidney disease all make the value falsely low or high. Glucose, or a fructosamine, is used instead in those settings.",
      },

      { type: "heading", level: 2, text: "The natural history of type 2 diabetes" },
      {
        type: "paragraph",
        text: "The disease begins with insulin resistance, usually in the liver, muscle and fat, in a patient with a genetic tendency and excess adipose tissue. The pancreas compensates by secreting more insulin, so the glucose remains normal while the insulin level is high: this is the hyperinsulinaemic phase that precedes the diagnosis. Over years the beta cells, which cannot sustain the output, decline in function — first post-prandially, then fasting — and the glucose rises in that order.",
      },
      {
        type: "table",
        headers: ["Stage", "Glucose", "Insulin", "Clinical implication"],
        rows: [
          ["Compensated resistance", "Normal", "High", "Normal glucose tolerance with a high insulin; a prediabetic patient with features of the metabolic syndrome"],
          ["Failure of first-phase secretion", "Normal fasting, raised post-prandially", "Rising then plateauing", "Prediabetes, detected only on a tolerance test or by an HbA1c in the higher part of the range"],
          ["Beta-cell decline", "Raised", "Falling", "Diabetes, and the point at which therapy escalates: metformin, then the additional classes as the decline continues"],
          ["Established insulin deficiency", "Raised despite oral therapy", "Low", "Insulin is needed, not because of the diagnosis but because the beta cell has failed"],
        ],
      },
      {
        type: "paragraph",
        text: "This natural history is why the type 2 patient is told the diagnosis is progressive, and why each new agent in the pathway buys the beta cell time rather than replacing it. It is also why the initial therapy in a patient presenting with a glucose of 20 and weight loss may be insulin for a period: the glucose toxicity itself suppresses the beta cell, and lowering it can restore function.",
      },

      { type: "heading", level: 2, text: "Treatment of type 2 diabetes" },
      {
        type: "table",
        headers: ["Class", "Drugs", "How it works", "Where it belongs"],
        rows: [
          ["Biguanide", "Metformin", "Reduces hepatic glucose production and improves peripheral insulin sensitivity", "First-line for most patients, and it is weight-neutral; contraindicated at an estimated glomerular filtration rate below 30, and given in a reduced dose below 45; withdrawn in acute illness and before iodinated contrast"],
          ["SGLT2 inhibitor", "Dapagliflozin, empagliflozin", "Blocks glucose reabsorption in the proximal tubule, glycosurising the patient", "For patients with established atherosclerotic disease, heart failure with reduced ejection fraction or chronic kidney disease: it reduces cardiovascular death and renal decline, and it does not cause hypoglycaemia alone"],
          ["GLP-1 receptor agonist", "Semaglutide, liraglutide, dulaglutide", "Glucose-dependent insulin release, suppression of glucagon, slowed gastric emptying, and weight loss", "For patients with atherosclerotic disease, obesity, or where a weight reduction is the target; it reduces events in the highest-risk patients; it causes nausea and, rarely, pancreatitis"],
          ["DPP-4 inhibitor", "Sitagliptin, linagliptin", "Prolongs endogenous GLP-1 activity", "A weight-neutral oral option, well tolerated, with little effect on cardiovascular outcomes"],
          ["Sulphonylurea", "Gliclazide, glimepiride", "Closes the potassium channel of the beta cell and stimulates insulin release irrespective of the glucose", "A cheap and effective option, but it causes hypoglycaemia and weight gain, so it is used where cost or bioavailability dictate"],
          ["Thiazolidinedione", "Pioglitazone", "Improves peripheral insulin sensitivity", "Useful in insulin-resistant patients, but causes weight gain, fluid retention and heart failure, and it increases the fracture risk"],
          ["Insulin", "Basal, then basal-bolus, or a biphasic mixture", "Replaces what the beta cell can no longer produce", "Introduced when the HbA1c is well above the target (usually above 75 millimoles per mole) with symptoms, when there is catabolism, in pregnancy where the oral agents do not control it, or when oral therapy has failed"],
        ],
      },
      {
        type: "paragraph",
        text: "The choice of the second or third agent is no longer simply about the glucose: it is driven by the cardiovascular and renal disease the patient already has. In a patient with heart failure or established atherosclerotic disease the SGLT2 inhibitor or the GLP-1 receptor agonist is added irrespective of the HbA1c, because the outcome benefit is independent of the glucose lowering. In a patient without those conditions, where cost and simplicity dominate, metformin with another oral agent is entirely appropriate.",
      },

      { type: "heading", level: 2, text: "Insulin therapy" },
      {
        type: "table",
        headers: ["Regimen", "How it is constructed", "Indication"],
        rows: [
          ["Basal-bolus", "A long-acting analogue (glargine, detemir, degludec) or isophane insulin at night or twice daily, plus a rapid-acting analogue before each meal", "The physiological regimen for type 1 diabetes and for a type 2 patient needing a flexible regimen; it is the basis of the dose-adjustment technique"],
          ["Twice-daily biphasic (premixed) insulin", "A fixed mixture of a rapid and an intermediate-acting insulin before breakfast and supper", "A simpler, less flexible option for a patient with a routine, who cannot manage four injections"],
          ["Once-daily basal insulin added to metformin", "A long-acting insulin at night, titrated against the fasting glucose", "The usual first step when oral therapy in type 2 diabetes fails"],
          ["Continuous subcutaneous infusion", "A pump delivering a continuous basal rate with mealtime boluses", "For patients with a tight control target, a dawn phenomenon, or recurrent hypoglycaemia, and it requires carbohydrate counting"],
          ["Correction and carbohydrate counting", "The correction dose for a raised glucose, and the meal dose for the carbohydrate to be eaten", "The education that makes the regimen safe, and it is taught before the patient is discharged after a first diagnosis of type 1 diabetes"],
        ],
      },
      {
        type: "paragraph",
        text: "Titration is a self-correcting loop rather than a dose set at the clinic. The fasting glucose tells you the basal dose, and the post-meal glucose tells you the meal doses: increase the basal by two units every three days until the fasting value is in range, unless nocturnal hypoglycaemia intervenes; and increase the meal dose for a specific hyperglycaemic reading after a specific meal. Sick-day rules accompany it: the insulin is never stopped when the patient is ill, and the carbohydrate is replaced if the glucose falls.",
      },

      { type: "heading", level: 2, text: "Acute complications" },
      {
        type: "table",
        headers: ["", "Hypoglycaemia", "Diabetic ketoacidosis", "Hyperosmolar hyperglycaemic state"],
        rows: [
          ["Mechanism", "Insulin or a secretagogue exceeding the glucose available", "Absolute insulin deficiency with counter-regulatory hormone excess", "Relative deficiency, usually precipitated by illness, in a patient who can still secrete enough insulin to prevent ketosis"],
          ["Typical patient", "Any patient on insulin or a sulphonylurea", "Usually type 1, often after an infection, a missed dose or a new diagnosis", "Usually an elderly type 2 patient with an intercurrent infection, a new drug or a missed dose"],
          ["Presentation", "Tremor, sweating, hunger, palpitations, then confusion, behavioural change and seizures if unrelieved", "Slow-onset polyuria, polydipsia, vomiting, abdominal pain, Kussmaul breathing, ketotic breath, dehydration", "Profound dehydration, drowsiness or coma, with a glucose above 33.9 millimoles per litre"],
          ["Glucose", "Below 4.0 millimoles per litre", "Usually 11.0 to 30.0", "Usually very high, above 33.9"],
          ["Ketones and pH", "Normal", "Ketonuria and ketonaemia with a pH below 7.30 and a raised anion gap", "Minimal ketones, pH above 7.30"],
          ["Osmolality", "Normal", "Normal or mildly raised", "Above 320 milliosmoles per kilogram"],
          ["Mortality", "Rare but a cause of death in the young and in the old", "Low with treatment (under 1 percent in the young), high in the elderly", "High, from the dehydration and the precipitating illness (10 percent or more)"],
          ["Immediate treatment", "Oral glucose or a glucose gel if conscious; intramuscular glucagon or intravenous dextrose if not", "Fluid resuscitation with isotonic saline, an insulin infusion, potassium replacement, and treatment of the precipitant", "Very large-volume fluid resuscitation with isotonic saline, a low-dose insulin infusion, and anticoagulation for the thrombosis risk"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "SGLT2 inhibitors cause euglycaemic ketoacidosis: a ketoacidosis with a virtually normal glucose, which is missed because the glucose is not high. It is precipitated by illness, surgery or fasting, so the drug is stopped during those events and in the perioperative period, and it is not licensed for type 1 diabetes.",
      },
      {
        type: "callout",
        variant: "info",
        text: "In treating diabetic ketoacidosis the potassium may fall rapidly as the acid is corrected and insulin drives it into the cells. If the potassium is below 3.3 millimoles per litre, insulin is withheld until it has been replaced — because depriving a hypokalaemic patient of insulin while they are acidotic is dangerous.",
      },

      { type: "heading", level: 2, text: "Chronic complications and their surveillance" },
      {
        type: "table",
        headers: ["Complication", "Mechanism", "Surveillance and treatment"],
        rows: [
          ["Retinopathy", "Microvascular damage to the retinal circulation, with microaneurysms, exudates and neovascularisation", "Annual retinal screening from the point of diagnosis; pan-retinal photocoagulation and anti-vascular endothelial growth factor therapy for the proliferative stage"],
          ["Nephropathy", "Glomerular hyperfiltration and basement-membrane thickening, then glomerulosclerosis: albuminuria preceding a falling filtration rate", "An annual urine albumin-to-creatinine ratio and a serum creatinine; an ACE inhibitor or an angiotensin receptor blocker for albuminuria, plus glycaemic and blood pressure control"],
          ["Neuropathy", "Distal symmetrical sensory loss (the stocking and glove pattern), a mononeuropathy, and an autonomic neuropathy (impotence, postural hypotension, gastroparesis, silent myocardial infarction)", "Annual examination with a 10-gram monofilament and vibration sense; strict feet care, and a review for neuropathic treatment"],
          ["Macrovascular disease", "Accelerated atherosclerosis: myocardial infarction, stroke and peripheral arterial disease — the commonest cause of death in diabetes", "Blood pressure below 130/80, a statin, an antiplatelet in established disease, smoking cessation, and a low threshold for symptoms"],
          ["Foot ulceration", "Neuropathy is combined with vascular disease and infection, so a trivial injury ulcerates and does not heal", "Annual foot examination with a photograph record; a multidisciplinary foot clinic for any ulcer; the patient with a red, hot, swollen foot and fever may have osteomyelitis"],
          ["Infection risk", "Impaired neutrophil function and the vasculature", "Immunisation against influenza, pneumococcus and COVID-19, and rapid treatment of cellulitis and urinary infection"],
        ],
      },
      {
        type: "table",
        headers: ["Target", "Value", "Comment"],
        rows: [
          ["Glycated haemoglobin", "48 millimoles per mole (6.5 percent) for most; 53 (7 percent) where hypoglycaemia is a risk", "Individualised: a tighter target in a young patient with early disease, a looser one in the elderly or with long duration"],
          ["Blood pressure", "Below 130/80 millimetres of mercury", "Treated with an ACE inhibitor or an angiotensin receptor blocker first, for the renal protection as well as the pressure"],
          ["Lipids", "A statin at the highest tolerated dose, or an added ezetimibe if the target is not met", "Almost every patient with type 2 diabetes over 40 is treated, and all type 1 patients with albuminuria or another risk factor"],
          ["Aspirin", "Not primary prevention generally", "Reserved for those with established vascular disease"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Never stop insulin in a type 1 patient who is unwell, and never omit it because the glucose is normal or the patient is not eating. The basal insulin is continued at the usual dose, and the carbohydrate is replaced by fluids or glucose, because a patient on basal insulin who is not eating has enough insulin to become hypoglycaemic.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Diagnosing type 2 diabetes in a lean, young, ketotic patient because the presentation looks like a bad flu. A ketotic, dehydrated, catabolic patient has type 1 diabetes until antibodies and a C-peptide prove otherwise, and insulin is started immediately.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Withholding insulin in diabetic ketoacidosis because the potassium is low. The reverse: insulin drives potassium into the cells and lowers the serum level further, so a potassium below 3.3 millimoles per litre is replaced first and then insulin is started — the acid is still waited on.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Continuing metformin and an SGLT2 inhibitor through acute illness, contrast imaging and surgery. Metformin accumulates in a failing kidney and can cause lactic acidosis, and an SGLT2 inhibitor causes euglycaemic ketoacidosis: both are held at those events with a documented restart date.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating a raised HbA1c in isolation. The cardiovascular and renal outcomes are driven by blood pressure, lipids and smoking as much as by glucose, so all four are managed at every visit.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does the same hyperglycaemia produce ketoacidosis in type 1 diabetes and a hyperosmolar state in type 2 diabetes?",
        answer: "Because in type 1 diabetes the insulin deficiency is absolute, so lipolysis is unchecked and free fatty acids are converted to ketones; in type 2 diabetes enough insulin remains to suppress lipolysis, so the ketogenesis does not occur, but the glucose rises until the osmotic diuresis causes profound dehydration.",
        explanation: "The presence of residual insulin is the hinge, and it explains both the presentation and the very different mortality of the two emergencies.",
      },
      {
        type: "question",
        prompt: "A patient with type 2 diabetes has an estimated glomerular filtration rate of 36 and is taking metformin. What action is required?",
        answer: "Reduce the metformin dose (or warn that the maximum tolerated is 1000 milligrams daily), review renal function more frequently, and stop metformin at an estimated filtration rate below 30, and during acute illness, dehydration or iodinated contrast procedures.",
        explanation: "Metformin accumulates in renal failure and can cause lactic acidosis, and the periodic review of renal function is part of the prescribing.",
      },
      {
        type: "question",
        prompt: "Which drug classes should be considered in a patient with type 2 diabetes, reduced ejection fraction and albuminuria, regardless of the glycated haemoglobin?",
        answer: "An SGLT2 inhibitor (dapagliflozin or empagliflozin), which reduces cardiovascular death and renal decline in this group, and a GLP-1 receptor agonist if the cardiovascular risk is driven by atherosclerotic disease and the weight matters; plus an ACE inhibitor or an angiotensin receptor blocker for the albuminuria.",
        explanation: "In established cardiovascular or renal disease the outcome benefit of these classes is independent of the glucose lowering, so they are selected for the comorbidity rather than for the HbA1c.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which finding confirms a diagnosis of diabetes mellitus in an asymptomatic patient?",
        options: [
          "A random plasma glucose of 8.4 millimoles per litre",
          "A fasting plasma glucose of 7.4 millimoles per litre on two separate occasions",
          "A glycated haemoglobin of 42 millimoles per mole",
          "A two-hour glucose of 8.2 millimoles per litre on a tolerance test",
        ],
        correctIndex: 1,
        explanation: "Diabetes is diagnosed by a fasting glucose of 7.0 or more on two occasions, a random glucose of 11.1 or more with symptoms, an HbA1c of 48 or more, or a two-hour tolerance-test glucose of 11.1 or more. The other values are in the prediabetic or normal range.",
      },
      {
        type: "mcq",
        stem: "A patient with type 2 diabetes and an estimated glomerular filtration rate of 55 develops heart failure with a reduced ejection fraction. Which agent should be added irrespective of the HbA1c?",
        options: ["A sulphonylurea", "Pioglitazone", "An SGLT2 inhibitor", "A DPP-4 inhibitor"],
        correctIndex: 2,
        explanation: "SGLT2 inhibitors reduce cardiovascular death and heart failure events and slow renal decline in type 2 diabetes with heart failure or chronic kidney disease, independent of the glucose lowering. Pioglitazone worsens heart failure, and sulphonylureas cause hypoglycaemia and weight gain.",
      },
      {
        type: "mcq",
        stem: "A 19-year-old with a two-week history of vomiting, rapid weight loss and a glucose of 27 millimoles per litre has a pH of 7.10 with ketonaemia. Which is the immediate priority after an intravenous cannula?",
        options: [
          "A subcutaneous long-acting insulin",
          "Intravenous isotonic fluid resuscitation before or alongside an insulin infusion",
          "Oral rehydration and a repeat glucose in four hours",
          "Intravenous sodium bicarbonate",
        ],
        correctIndex: 1,
        explanation: "Diabetic ketoacidosis is treated by intravascular volume repletion with isotonic saline first, then a variable-rate insulin infusion and potassium replacement. Bicarbonate is reserved for a profound or symptomatic acidosis, and oral rehydration is inappropriate in a vomiting dehydrated patient.",
      },
      {
        type: "mcq",
        stem: "Which combination best describes the hyperosmolar hyperglycaemic state?",
        options: [
          "A glucose above 33.9, an osmolality above 320, minimal ketones and a pH above 7.30",
          "A glucose of 20 with ketonaemia and a pH of 7.05",
          "A glucose of 3.0 with sweating and confusion",
          "A normal glucose with a raised anion gap and a normal osmolality",
        ],
        correctIndex: 0,
        explanation: "The hyperosmolar hyperglycaemic state combines a very high glucose and osmolality with little or no ketosis and no acidosis, because residual insulin prevents ketogenesis. It carries a higher mortality than ketoacidosis because of the dehydration and the precipitating illness.",
      },
      {
        type: "mcq",
        stem: "Which is a recommended annual surveillance test in a patient with type 2 diabetes?",
        options: [
          "A urine albumin-to-creatinine ratio and a retinal screening photograph",
          "A bone density scan",
          "A whole-body computed tomography",
          "A coronary calcium score",
        ],
        correctIndex: 0,
        explanation: "Annual surveillance detects the clinically silent microvascular complications: an albumin-to-creatinine ratio for nephropathy, dilated retinal screening for retinopathy, and a foot examination for neuropathy and vascular disease.",
      },

      { type: "heading", level: 2, text: "Module summary and next" },
      {
        type: "paragraph",
        text: "Diabetes is either an absolute or a relative deficiency of insulin, and that division separates the two commonest forms in the presentation, the treatment and the emergency. Type 1 is managed by insulin replacement and education; type 2 is managed by metformin and by the agent that matches the comorbidity, with insulin added as the beta cell fails. Surveillance is aimed at the complications the patient cannot feel — the retina, the kidney and the foot — because the presence of insulin is what allows glucose into the tissues, and its absence is what destroys them.",
      },
      {
        type: "paragraph",
        text: "Next module: nephrology, haematology and infectious disease, beginning with renal disease and acute kidney injury, which is both a consequence of diabetes and one of its acute emergencies.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 14 — Renal disease & acute kidney injury (fully authored)
// ---------------------------------------------------------------------------
function lesson14() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define acute kidney injury by the creatinine and urine output criteria; classify it into pre-renal, intrinsic and post-renal causes and separate them clinically; use the urine indices to distinguish pre-renal azotaemia from acute tubular necrosis; list the life-threatening complications and the indications for dialysis; classify the glomerulonephritides into nephritic and nephrotic patterns and name a cause of each; stage chronic kidney disease by the filtration rate and albuminuria; and describe its systemic complications and the preparation for renal replacement therapy.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "PHYS 101 (renal blood flow, glomerular filtration and tubular function), MED 301 lesson 3 (potassium, metabolic acidosis and fluid balance, and the anion gap), lesson 4 (sepsis), and PATH 201 (cell injury, necrosis and the inflammatory response), with the drugs and toxins from PHRM 202.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Acute kidney injury",
        text: "An abrupt reduction in kidney function occurring over hours to days, detected by a rise in creatinine or a fall in urine output — defined as an increase in creatinine of 26.5 micromoles per litre or more within 48 hours, or a rise to 1.5 times the baseline within 7 days, or a urine output below 0.5 millilitres per kilogram per hour for 6 hours.",
      },
      {
        type: "paragraph",
        text: "The kidney is a filter fed by about a fifth of the cardiac output, and it fails for only three reasons: the blood supply to it is reduced (pre-renal), the filter itself is damaged (intrinsic), or the flow out of it is obstructed (post-renal). Every case, however acute and however alarming the creatinine, is placed in one of those three boxes by the history, the examination and an ultrasound, because the pre-renal and the post-renal causes are potentially reversible within minutes.",
      },
      {
        type: "definition",
        term: "Post-renal acute kidney injury",
        text: "The failure from an obstruction to urine flow, anywhere from the calyces to the urethra, in which the glomerular filtrate cannot leave the tubule and the structure dilates. It is the commonest cause of acute kidney injury in the elderly man, and it is excluded first in every patient with a rising creatinine because relieving the obstruction restores the function.",
      },

      { type: "heading", level: 2, text: "The three mechanisms" },
      {
        type: "table",
        headers: ["Category", "Cause", "Clues"],
        rows: [
          ["Pre-renal (about 60 percent)", "Hypovolaemia (haemorrhage, vomiting, diarrhoea, burns, inadequate intake), a low cardiac output (heart failure), sepsis, or an intrarenal vasoconstriction (non-steroidal anti-inflammatory drugs, iodinated contrast, hepatorenal syndrome)", "A history of fluid loss or a low blood pressure, a low fractional excretion of sodium, concentrated urine and a rapid response to fluids"],
          ["Intrinsic, vascular and glomerular (about 10 percent)", "Damage to the vessels and the glomeruli — a vasculitis, a thrombotic microangiopathy, an accelerated hypertension, or an acute glomerulonephritis", "A rapidly rising creatinine, hypertension, an active urine sediment with red cell casts and blood, and a systemic illness with fever, rash or arthritis"],
          ["Intrinsic, tubular (about 30 percent)", "Acute tubular necrosis — the commonest intrinsic cause — from prolonged ischaemia (shock, trauma, sepsis), a nephrotoxin (aminoglycosides, iodinated contrast, amphotericin, myoglobin, light chains, cisplatin), or acute interstitial nephritis from a drug allergy", "The phase of oliguria after the pre-renal phase has been left untreated; muddy brown casts, an isosthenuric urine, and a fractional excretion of sodium above 2 percent"],
          ["Intrinsic, interstitial", "Acute interstitial nephritis — a hypersensitivity reaction (penicillins, cephalosporins, non-steroidal anti-inflammatory drugs, proton pump inhibitors, allopurinol, rifampicin)", "A new drug, fever, rash and eosinophilia, with white cells, white cell casts and eosinophils in the urine"],
          ["Post-renal (about 5 percent)", "Obstruction — calculi, retroperitoneal fibrosis, a pelvic mass, prostatic hypertrophy or carcinoma, a urethral stricture, a blocked or missing urinary catheter, an obstructed urinary catheter", "A palpable bladder, anuria alternating with polyuria, a history of stones or prostatic symptoms, and a dilated collecting system on ultrasound"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Pre-renal azotaemia and acute tubular necrosis are a continuum rather than two diseases. If the reduced perfusion persists, the first injury is to the outer medullary tubule, which normally exists at the very edge of hypoxia, and the pre-renal picture converts over hours into the tubule necrosis picture. The earliest consequence of untreated hypovolaemia is therefore the commonest cause of inpatient acute kidney injury.",
      },

      { type: "heading", level: 2, text: "The urine indices" },
      {
        type: "table",
        headers: ["Index", "Pre-renal azotaemia", "Acute tubular necrosis"],
        rows: [
          ["Urine sodium", "Below 20 millimoles per litre", "Above 40 millimoles per litre"],
          ["Fractional excretion of sodium", "Below 1 percent", "Above 2 percent"],
          ["Fractional excretion of urea", "Below 35 percent", "Above 50 percent"],
          ["Urine osmolality", "Above 500 milliosmoles per kilogram", "Below 350, and typically about 300 — an isosthenuric urine"],
          ["Urine to plasma creatinine ratio", "Above 40", "Below 20"],
          ["Urine sediment", "Normal or hyaline casts", "Muddy brown granular casts and free tubular epithelial cells"],
          ["Response to fluids", "A fall in creatinine with intravascular repletion", "No acute response — it recovers over days to weeks as the tubules regenerate"],
        ],
      },
      {
        type: "paragraph",
        text: "Two cautions belong beside the table. The fractional excretion of sodium is falsely low when the tubule is intact and concentrating sodium in a patient on a diuretic — in which case the urea index, which is not affected by the loop of Henle, is the more reliable discriminator. And a low sodium excretion in a patient on a diuretic does not confirm pre-renal failure; it confirms a working tubule.",
      },

      { type: "heading", level: 2, text: "Assessment and immediate actions" },
      {
        type: "table",
        headers: ["Step", "What is done", "Why"],
        rows: [
          ["History", "Volume loss or gain, a drug list, sepsis, surgery, trauma, stones, prostatic symptoms, and the urine output — including whether it is a change from the patient's baseline", "The pre-renal and post-renal causes are identified by the history and the drug list before any test is ordered"],
          ["Examination", "Volume status — jugular venous pressure, capillary refill, postural drop, peripheral oedema, weight; and a palpable bladder and renal angle tenderness", "A palpable bladder is an obstruction until proven otherwise, and the volume status distinguishes the pre-renal from the overloaded"],
          ["Bladder scan or catheter", "Ultrasound of the bladder after voiding, and a catheter if the residual is large", "Relieving a retention is the fastest and the most complete treatment available"],
          ["Renal ultrasonography", "Size, symmetry, echogenicity, hydronephrosis and cysts", "Excludes obstruction in every patient, and small echogenic kidneys indicate chronic rather than acute disease"],
          ["Urine", "Dipstick for blood and protein, microscopy and culture, and a protein quantification (an albumin-to-creatinine ratio)", "The sediment identifies a glomerulonephritis (red cell casts) and an interstitial nephritis (white cells and casts)"],
          ["Bloods", "Electrolytes, urea and creatinine, calcium and phosphate, alkaline phosphatase, albumin, a full blood count, complement, immunoglobulins, electrophoresis and autoimmune serology", "Detects the complications and screens for the glomerulonephritides, myeloma, and the vasculitides"],
          ["Drug review", "Stop the nephrotoxins: non-steroidal anti-inflammatory drugs, aminoglycosides, iodinated contrast, angiotensin blockade in acute illness — and dose-adjust everything cleared by the kidney", "Continuation of a nephrotoxin in renal failure prolongs the injury, and the failure to adjust the dose is the commonest avoidable harm"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Of all the causes of acute kidney injury, only a handful are reversible in the first hour — an obstruction, a hypovolaemia and a hypoperfusion — and they are found by a bladder scan and a volume assessment, not by waiting for the creatinine. Every hour of delays in relieving an obstruction costs function.",
      },

      { type: "heading", level: 2, text: "Complications and the indications for dialysis" },
      {
        type: "table",
        headers: ["Complication", "Mechanism", "Recognition"],
        rows: [
          ["Hyperkalaemia", "The kidney cannot excrete the daily potassium load, compounded by an acidosis, a tissue breakdown or a drug (an angiotensin blockade, a potassium-sparing diuretic, trimethoprim)", "Peaked T waves, a widened QRS, bradycardia and a sine wave; a plasma potassium above 6.5 millimoles per litre with ECG changes"],
          ["Metabolic acidosis", "Failure to excrete the daily acid load and to regenerate bicarbonate", "A low bicarbonate and a raised anion gap; a base deficit with a normal lactate should prompt a search for another cause"],
          ["Pulmonary oedema", "Sodium and water retention that the tubule cannot excrete", "Breathlessness with crackles and a raised venous pressure, and a radiographic picture of the interstitial and alveolar oedema of fluid overload"],
          ["Uraemia", "The retention of the metabolic products that the kidney clears", "Nausea, vomiting, anorexia, pruritus, a pericardial friction rub, encephalopathy with a flapping tremor, and a bleeding tendency"],
          ["Anaemia", "Reduced erythropoietin production and a shortened red cell survival", "A normochromic anaemia that appears over weeks, whereas an anaemia over days is usually blood loss or haemolysis"],
          ["Renal bone disease", "Reduced activation of vitamin D, hypocalcaemia, a raised phosphate, and a secondary hyperparathyroidism", "A raised parathyroid hormone, a low calcium and a high phosphate — this is the chronic picture, not the acute one"],
          ["Bleeding and infection", "A uraemic platelet dysfunction and impaired cell-mediated immunity", "A bleeding time prolonged out of proportion to the platelet count"],
        ],
      },
      {
        type: "definition",
        term: "AEIOU — the indications for dialysis",
        text: "Refractory Acidosis, refractory Electrolyte disturbance (a hyperkalaemia with ECG changes), Intoxication with a dialysable toxin (lithium, methanol, ethylene glycol, salicylate, theophylline), fluid Overload refractory to diuretics causing pulmonary oedema, and Uraemic complications — encephalopathy, pericarditis or a bleeding diathesis.",
      },
      {
        type: "paragraph",
        text: "The decision to dialyse is not made by a creatinine value but by the complications. A patient with a creatinine of 500 and no complications is managed medically, while a patient with a creatinine of 300 and refractory hyperkalaemia with an arrhythmia needs dialysis now. In the acute phase, intermittent haemodialysis is usual, and a temporary venous catheter and a monitored bed are required.",
      },

      { type: "heading", level: 2, text: "The glomerulonephritides" },
      {
        type: "table",
        headers: ["Pattern", "Features", "Causes"],
        rows: [
          ["Nephritic", "Haematuria with red cell casts, oliguria, hypertension, mild proteinuria (under 3 grams per day) and a reduced filtration rate; a presentation of 'acute nephritis'", "Post-infectious glomerulonephritis after a streptococcal infection (in children), IgA nephropathy (Berger's disease, with synpharyngitic haematuria), lupus nephritis, Henoch-Schonlein purpura, anti-glomerular basement membrane disease"],
          ["Rapidly progressive (crescentic)", "A nephritic picture that progresses to failure over weeks, with the crescents of a severe glomerulonephritis on biopsy", "Anti-glomerular basement membrane disease (Goodpasture's with pulmonary haemorrhage), the pauci-immune vasculitides (granulomatosis with polyangiitis, microscopic polyangiitis, renal-limited vasculitis), and a severe immune-complex disease"],
          ["Nephrotic", "Proteinuria above 3.5 grams per day, hypoalbuminaemia, oedema, hyperlipidaemia and a prothrombotic state; a presentation of oedema and a raised clotting risk", "Minimal change disease (the commonest cause in children, steroid-responsive), focal segmental glomerulosclerosis, membranous nephropathy, membranoproliferative disease, and the systemic causes — diabetes, amyloidosis, lupus"],
          ["Chronic tubulo-interstitial", "A slowly rising creatinine with a bland urine, mild proteinuria, tubular leakage (sterile pyuria, glycosuria, a renal tubular acidosis), and often an analgesic or a toxin history", "Chronic interstitial nephritis from analgesics, lithium, reflux nephropathy, chronic obstruction, sickle cell disease and urate nephropathy"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "A patient with haemoptysis and a rapidly rising creatinine has a pulmonary-renal syndrome until proven otherwise — anti-glomerular basement membrane disease or an ANCA-associated vasculitis — and the diagnosis is made on an anti-glomerular basement membrane antibody, an ANCA panel and a renal biopsy, with urgent immunosuppression.",
      },

      { type: "heading", level: 2, text: "Chronic kidney disease" },
      {
        type: "table",
        headers: ["Stage", "Filtration rate (mL/min/1.73m2)", "Note"],
        rows: [
          ["G1", "90 or more, with another marker of kidney damage", "Early damage with a preserved filtration — albuminuria, haematuria or a structural abnormality"],
          ["G2", "60 to 89", "As above"],
          ["G3a", "45 to 59", "Moderate: the cardiac risk rises and the drug dose adjustment begins"],
          ["G3b", "30 to 44", "Moderately severe: anaemia and bone disease begin, and the monitoring is more frequent"],
          ["G4", "15 to 29", "Severe: uraemic symptoms appear, and the preparation for renal replacement begins"],
          ["G5", "Below 15, or on dialysis", "End-stage renal disease: renal replacement therapy, or conservative care for the patient in whom it is not appropriate"],
        ],
      },
      {
        type: "paragraph",
        text: "Each stage is further divided by albuminuria, from A1 to A3, because the albumin is an independent predictor of the progression and of the cardiovascular risk — a patient with a filtration rate of 45 and heavy albuminuria is at greater risk of an event than one at the same rate with no albumin. The commonest causes are diabetes, hypertension, glomerulonephritis, cystic disease, obstruction and drug-induced interstitial disease.",
      },
      {
        type: "table",
        headers: ["System", "Complication", "Treatment"],
        rows: [
          ["Haematological", "Normochromic anaemia from erythropoietin deficiency and iron deficiency", "Oral or intravenous iron to the target, then an erythropoiesis-stimulating agent"],
          ["Bone", "Secondary hyperparathyroidism, osteitis fibrosa, adynamic bone disease, and vascular calcification", "Phosphate restriction and binders, activated vitamin D or a calcimimetic, and avoidance of over-suppression"],
          ["Acid-base", "Metabolic acidosis with a raised anion gap", "Oral sodium bicarbonate to keep the bicarbonate above 22 millimoles per litre"],
          ["Cardiovascular", "Hypertension, accelerated atherosclerosis, left ventricular hypertrophy and sudden death — the commonest cause of death", "Blood pressure control with an angiotensin blockade for albuminuria, a statin, correction of the anaemia, and a salt restriction"],
          ["Nutrition", "Protein-energy wasting and a loss of muscle", "A controlled protein and phosphate intake, with the advice of a renal dietitian"],
          ["Fluid balance", "Volume overload and, later, an oliguria", "A fluid restriction and loop diuretics, escalated to the combination of a loop and a thiazide for the resistant oedema"],
        ],
      },
      {
        type: "paragraph",
        text: "Renal replacement therapy — haemodialysis, peritoneal dialysis or transplantation — is planned rather than improvised, and it begins with education, the vaccination, the preservation of the veins for a fistula, and a written decision about the ceiling of care. Transplantation offers the best survival and rehabilitation, and the referral is made at a filtration rate of around 20 so that a living donor transplant can be timed before dialysis is required.",
      },
      {
        type: "callout",
        variant: "info",
        text: "A patient with chronic kidney disease is between two dangers: a delay in dialysis that allows uraemia and a fluid overload, and an early start that shortens the period without it. The decision is agreed with the patient and it is documented before the crisis, as is the decision to choose conservative care.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Giving fluids to a patient with an acute kidney injury without screening for obstruction or for an overload. A bladder scan and a volume assessment take minutes and change the entire direction of the treatment.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Continuing angiotensin blockade, non-steroidal anti-inflammatory drugs and nephrotoxic antibiotics through an acute illness. The blockade worsens the pre-renal failure, and the non-steroidal drug removes the prostaglandin vasodilation on which the kidney was dependent.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Interpreting a creatinine in isolation. A creatinine of 200 in a 45-kilogram elderly woman is a far greater reduction of function than the same value in a young man of 90 kilograms, because the relationship between creatinine and the filtration rate depends on the muscle mass, the age and the sex.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating a uraemic patient with a potassium binder or a diuretic without addressing the dialysis decision. The indications for dialysis — acidosis, electrolyte, intoxication, overload, uraemia — are complications, not a number, and a patient who meets one needs a dialysis line.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "How are the pre-renal, intrinsic and post-renal causes of acute kidney injury differentiated at the bedside?",
        answer: "By a history and an examination that establish the volume status and the perfusion, a drug list, a bladder scan for obstruction, and a renal ultrasound. The urine then separates the pre-renal picture (low sodium excretion, concentrated urine, a rapid response to fluids) from the tubular picture (a high fractional excretion of sodium, an isosthenuric urine and muddy casts).",
        explanation: "Two of the three are reversible in minutes, which is why the order of the investigation is a clinical assessment first and a laboratory assessment second.",
      },
      {
        type: "question",
        prompt: "Which findings distinguish acute tubular necrosis from pre-renal azotaemia in the urine?",
        answer: "In pre-renal azotaemia the sodium excretion is under 20 millimoles per litre with a fractional excretion of sodium under 1 percent, the urine is concentrated above 500 milliosmoles per kilogram and the urine to plasma creatinine ratio exceeds 40; in tubular necrosis the fractional excretion is above 2 percent, the urine is isosthenuric with a low osmolality, and the sediment contains muddy brown granular casts.",
        explanation: "The tubule is the filter's lining, so the urine indices test whether the tubule is functioning or damaged.",
      },
      {
        type: "question",
        prompt: "What are the indications for dialysis in acute kidney injury, and which is met by a potassium of 7.2 millimoles per litre with a widened QRS?",
        answer: "The indications are acidosis that is refractory, electrolytes that are refractory (a hyperkalaemia with electrocardiographic changes), intoxication with a dialysable toxin, a fluid overload refractory to diuretics, and the uraemic complications of encephalopathy, pericarditis or a bleeding diathesis. A potassium of 7.2 with a widened QRS meets the electrolyte indication, and dialysis is required in addition to the immediate medical treatment of the hyperkalaemia.",
        explanation: "Dialysis is started for a complication rather than a creatinine value, and a hyperkalaemia that recurs after the calcium, the insulin and the dextrose is the usual reason.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A man of 72 has a creatinine of 320 micromoles per litre, a palpable bladder and no urine passed for 10 hours. Which is the immediate action?",
        options: [
          "Start intravenous fluids and reassess in the morning",
          "Insert a urinary catheter and monitor the urine output",
          "Arrange urgent haemodialysis",
          "Begin an ACE inhibitor for the renal protection",
        ],
        correctIndex: 1,
        explanation: "A palpable bladder with anuria is a post-renal obstruction until proven otherwise: catheterisation relieves it, restores the urine flow and is the definitive immediate treatment. Fluids would worsen the distension, and dialysis is reserved for the complications.",
      },
      {
        type: "mcq",
        stem: "Which urine index best distinguishes pre-renal azotaemia from acute tubular necrosis?",
        options: [
          "A urine sodium below 20 millimoles per litre with a fractional excretion of sodium below 1 percent",
          "A urine sodium above 40 with a fractional excretion of sodium above 2 percent",
          "A urine protein above 3.5 grams per litre",
          "A urine osmolality below 300 with a normal urine sodium",
        ],
        correctIndex: 0,
        explanation: "In pre-renal azotaemia the tubules are intact and conserve sodium, so the urine sodium is low and the fractional excretion is under 1 percent, with a concentrated urine. In tubular necrosis those values reverse, with a high sodium excretion and muddy brown casts.",
      },
      {
        type: "mcq",
        stem: "A patient with a creatinine of 480 micromoles per litre, a potassium of 7.4 millimoles per litre with T wave peaking and a bicarbonate of 12 millimoles per litre, requires which intervention first?",
        options: [
          "An oral potassium binder",
          "Intravenous calcium, insulin and dextrose with an urgent dialysis referral",
          "Oral sodium bicarbonate alone",
          "A loop diuretic alone",
        ],
        correctIndex: 1,
        explanation: "A life-threatening hyperkalaemia with ECG changes is treated medically in the first minutes — calcium to stabilise the myocardium, insulin and dextrose to shift the potassium — and dialysis is required because the potassium cannot be excreted. A binder, bicarbonate or a diuretic alone is not sufficient.",
      },
      {
        type: "mcq",
        stem: "A 6-year-old with a facial and leg swelling has 4.5 grams of protein per day, a plasma albumin of 24 grams per litre and a normal blood pressure. Which diagnosis fits best?",
        options: [
          "Post-streptococcal glomerulonephritis",
          "Minimal change disease causing a nephrotic syndrome",
          "Henoch-Schonlein purpura",
          "Anti-glomerular basement membrane disease",
        ],
        correctIndex: 1,
        explanation: "A nephrotic syndrome with heavy proteinuria, hypoalbuminaemia and oedema and a preserved blood pressure, in a child, is the classic presentation of minimal change disease, which responds to corticosteroids. The other options produce a nephritic picture with haematuria and hypertension.",
      },
      {
        type: "mcq",
        stem: "A patient has a haemoptysis and a rapidly rising creatinine over two weeks with an active urine sediment. Which test is most urgent?",
        options: [
          "A renal ultrasound for obstruction",
          "An anti-glomerular basement membrane antibody and an ANCA panel",
          "A 24-hour urinary protein",
          "A serum urate",
        ],
        correctIndex: 1,
        explanation: "Haemoptysis with a rapidly progressive glomerulonephritis is a pulmonary-renal syndrome — anti-glomerular basement membrane disease or an ANCA-associated vasculitis — and the serology and a biopsy are urgent, because the outcome depends on the speed of the immunosuppression.",
      },

      { type: "heading", level: 2, text: "Module summary and next" },
      {
        type: "paragraph",
        text: "The kidney has three ways to fail — reduced supply, a damaged filter and an obstructed outflow — and acute kidney injury is classified by them. The immediate task is the same for every patient: exclude an obstruction, correct the volume, stop the nephrotoxins, and identify the hyperkalaemia, acidosis and overload that make dialysis urgent. In chronic kidney disease the same filtration rate declines over years, and the work is the management of the systemic consequences — anaemia, bone, acidosis and cardiovascular risk — and the planned, negotiated entry into renal replacement therapy.",
      },
      {
        type: "paragraph",
        text: "The remaining lessons of the course build on the same principles in the urinary tract, in haematology, in infectious and tropical disease, and in the rheumatological and neurological problems that arrive on a medical take.",
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
  { title: "Ischaemic heart disease", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Acute and chronic coronary syndromes", slug: "ischaemic-heart-disease", summary: "Atherosclerosis, stable and unstable angina, the acute coronary syndromes, and the treatment of the acute occlusion.", blooms: "apply", minutes: 40, prereq: ["cardiac-approach"] }, content: lesson8() as never },
  { title: "Heart failure", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Heart failure", slug: "heart-failure", summary: "Systolic and diastolic failure, the compensatory mechanisms, the clinical picture of low and high output, and the treatment.", blooms: "apply", minutes: 40, prereq: ["ischaemic-heart-disease"] }, content: lesson7() as never },
  { title: "Arrhythmias & conduction disease", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Arrhythmias and conduction disease", slug: "arrhythmias-conduction", summary: "The mechanisms of tachy- and bradyarrhythmias, the narrow and wide complex tachycardias, and the indications for pacing.", blooms: "apply", minutes: 40, prereq: ["ecg-arrhythmias"] }, content: lesson9() as never },
  { title: "Valvular & structural heart disease", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Valvular and structural heart disease", slug: "valvular-disease", summary: "The murmurs of the principal valve lesions, their consequences, and the indications for surgical intervention.", blooms: "apply", minutes: 40, prereq: ["cardiac-approach"] }, content: { blocks: [] } },

  // --- M3 Respiratory medicine ---
  { title: "Approach to the respiratory patient", module: 3, estimatedMinutes: 30, authored: false, concept: { title: "Approach to the respiratory patient", slug: "respiratory-approach", summary: "The history and examination of the respiratory system, and the interpretation of a chest radiograph.", blooms: "apply", minutes: 30, prereq: ["vital-signs"] }, content: { blocks: [] } },
  { title: "Asthma & chronic obstructive pulmonary disease", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "Asthma and chronic obstructive pulmonary disease", slug: "asthma-copd", summary: "The two obstructive diseases, their triggers, their acute decompensation and the stepwise treatment of each.", blooms: "apply", minutes: 40, prereq: ["respiratory-approach"] }, content: lesson10() as never },
  { title: "Pneumonia & pleural disease", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "Pneumonia and pleural disease", slug: "pneumonia-pleural", summary: "Community and hospital-acquired pneumonia, empyema and effusions, and the criteria for hospitalization.", blooms: "apply", minutes: 40, prereq: ["respiratory-approach"] }, content: lesson11() as never },
  { title: "Thromboembolic disease & pulmonary hypertension", module: 3, estimatedMinutes: 35, authored: true, concept: { title: "Pulmonary embolism and pulmonary hypertension", slug: "pulmonary-embolism", summary: "The pathophysiology of pulmonary embolism, the diagnostic approach to it, and the treatment including thrombolysis.", blooms: "analyze", minutes: 35, prereq: ["fever-sepsis"] }, content: lesson12() as never },
  { title: "Interstitial & neoplastic lung disease", module: 3, estimatedMinutes: 35, authored: false, concept: { title: "Interstitial and neoplastic lung disease", slug: "interstitial-lung-disease", summary: "The interstitial lung diseases, lung cancer by cell type, and the principles of palliative respiratory care.", blooms: "apply", minutes: 35, prereq: ["respiratory-approach"] }, content: { blocks: [] } },

  // --- M4 Gastroenterology & hepatology ---
  { title: "Approach to the GI & abdominal patient", module: 4, estimatedMinutes: 35, authored: false, concept: { title: "Approach to the gastrointestinal patient", slug: "gastroenterology-approach", summary: "Abdominal pain history, the examination of the abdomen, and the functional presentation of dysphagia.", blooms: "apply", minutes: 35, prereq: ["clinical-method"] }, content: { blocks: [] } },
  { title: "Peptic ulcer & upper GI disease", module: 4, estimatedMinutes: 35, authored: false, concept: { title: "Peptic ulcer and upper GI disease", slug: "peptic-ulcer", summary: "Gastric and duodenal ulceration, Helicobacter pylori, gastro-oesophageal reflux and the intestinal bleeding from the upper tract.", blooms: "apply", minutes: 35, prereq: ["gastroenterology-approach"] }, content: { blocks: [] } },
  { title: "Inflammatory bowel disease & the colon", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Inflammatory bowel disease and the colon", slug: "inflammatory-bowel-disease", summary: "Crohn's disease and ulcerative colitis, the small bowel, diverticular disease and colorectal cancer.", blooms: "apply", minutes: 40, prereq: ["gastroenterology-approach"] }, content: { blocks: [] } },
  { title: "Liver disease", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Liver disease", slug: "liver-disease", summary: "Acute liver failure, the chronic hepatitides, cirrhosis and its complications, and the management of ascites.", blooms: "apply", minutes: 40, prereq: ["gastroenterology-approach"] }, content: { blocks: [] } },
  { title: "Pancreas & biliary disease", module: 4, estimatedMinutes: 35, authored: false, concept: { title: "Pancreatic and biliary disease", slug: "pancreatic-biliary-disease", summary: "Acute and chronic pancreatitis, gallstone disease, cholangitis, and carcinoma of the pancreas and gallbladder.", blooms: "apply", minutes: 35, prereq: ["liver-disease"] }, content: { blocks: [] } },

  // --- M5 Endocrinology & metabolic medicine ---
  { title: "Endocrine assessment & the thyroid", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Endocrine assessment and the thyroid", slug: "endocrine-approach", summary: "The interpretation of thyroid function, hypothyroidism and thyrotoxicosis including Graves' disease, and the thyroid eye emergencies.", blooms: "apply", minutes: 35, prereq: ["clinical-method"] }, content: { blocks: [] } },
  { title: "Diabetes mellitus", module: 5, estimatedMinutes: 40, authored: true, concept: { title: "Diabetes mellitus", slug: "diabetes-mellitus", summary: "Type 1 and type 2 diabetes, their acute complication and chronic microvascular and macrovascular complications, and the insulin and oral treatments.", blooms: "apply", minutes: 40, prereq: ["fluid-acid-base"] }, content: lesson13() as never },
  { title: "Adrenal, pituitary & gonadal disorders", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Adrenal, pituitary and gonadal disorders", slug: "adrenal-pituitary-gonadal", summary: "Adrenal failure and excess, the pituitary hormone disorders, the gonadal dysfunctions and the disorders of calcium and phosphate.", blooms: "analyze", minutes: 45, prereq: ["endocrine-approach"] }, content: { blocks: [] } },
  { title: "Lipid disorders & metabolic bone disease", module: 5, estimatedMinutes: 30, authored: false, concept: { title: "Lipids, obesity and bone metabolism", slug: "lipids-obesity-bone", summary: "The classification and management of lipid disorders, obesity and its complications, and the metabolic bone diseases.", blooms: "apply", minutes: 35, prereq: ["endocrine-approach"] }, content: { blocks: [] } },
  { title: "Endocrine emergencies", module: 5, estimatedMinutes: 30, authored: false, concept: { title: "Endocrine emergencies", slug: "endocrine-emergencies", summary: "The diabetic emergencies of DKA and HHS, thyroid storm, myxoedema coma and the Addisonian and adrenal crises.", blooms: "apply", minutes: 30, prereq: ["diabetes-mellitus"] }, content: { blocks: [] } },

  // --- M6 Nephrology, haematology & infectious disease ---
  { title: "Renal disease & acute kidney injury", module: 6, estimatedMinutes: 40, authored: true, concept: { title: "Renal disease and acute kidney injury", slug: "renal-disease-aki", summary: "Acute kidney injury, the glomerulonephritides, chronic kidney disease and its complications, and the indications for dialysis.", blooms: "apply", minutes: 40, prereq: ["fluid-acid-base"] }, content: lesson14() as never },
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
