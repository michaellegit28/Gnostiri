import { prisma, seedMbbsCourse, type LessonSeed, type SbaSeed, type SubjectSeed } from "./spine";

/**
 * SURG 301 — Surgery.
 *
 * Module 1 ("Principles of surgery") is authored in full: 6 lessons in the
 * pilot-report format with one SBA item per concept. Only established surgical
 * teaching is asserted — the four classes of acute haemorrhage, the wound
 * classification system, the ASA grading, the ATLS primary and secondary
 * surveys, and the timing of post-operative fever.
 *
 * Modules 2-5 (gastrointestinal and hepatobiliary, vascular and
 * cardiovascular, urology, orthopaedics and neurosurgery) ship as a real
 * concept spine and prerequisite DAG with tracked-placeholder lessons
 * (needsCheck true).
 *
 * Requires prisma/seed-university.ts first (faculty, department, programme).
 */

const COURSE_SLUG = "surgery-principles";

const MODULES = [
  { slug: "surgery-principles", title: "M1 — Principles of surgery" },
  { slug: "gi-hepatobiliary-surgery", title: "M2 — Gastrointestinal & hepatobiliary surgery" },
  { slug: "vascular-cardiovascular-surgery", title: "M3 — Vascular & cardiovascular surgery" },
  { slug: "urology-renal-surgery", title: "M4 — Urology & renal surgery" },
  { slug: "orthopaedics-neurosurgery-special", title: "M5 — Orthopaedics, neurosurgery & special surgery" },
];

// ---------------------------------------------------------------------------
// LESSON 1 — Assessment, consent & the safe surgical patient (fully authored)
// ---------------------------------------------------------------------------
function lesson1() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: distinguish an emergency from an urgent and from an elective operation; describe the components of a pre-operative assessment and what each is for; state the requirements for a valid consent; name the ASA physical status classes; and list the pre-operative preparations that reduce a patient's risk.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "ANAT 101, PHYS 101, PATH 201, PHRM 202 and MED 301 module 1. Surgery is an application of the whole previous curriculum, and the assessment of a surgical patient uses every one of them.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Surgical risk assessment",
        text: "The process of matching a patient's physiological reserve to the physiological insult of a proposed operation, so that the risks of surgery are properly explained and, where possible, reduced before the patient comes to harm.",
      },
      {
        type: "paragraph",
        text: "Every operation is a balance: the operation will do harm before it does good, and the harm is proportionate to the patient's reserve. A herniorrhaphy in a fit 30-year-old is a minor physiological event; the same operation in a frail 85-year-old with heart failure is a major one. The work of the pre-operative period is to quantify that reserve, to reduce the risk where it can be reduced, and to explain the residual risk honestly to the patient so that the decision is properly theirs.",
      },

      { type: "heading", level: 2, text: "Emergency, urgency, or elective" },
      {
        type: "table",
        headers: ["Category", "Definition", "Example"],
        rows: [
          ["Immediate", "Life-saving operation needed within minutes", "Necklace decompression for a tension pneumothorax; laparotomy for a ruptured aortic aneurysm"],
          ["Urgent", "Needed within hours to save life or limb", "Laparotomy for peritonitis; fasciotomy for a compartment syndrome; reduction of a strangulated hernia"],
          ["Semi-elective", "Needed within days to weeks for a serious condition", "Resection of a symptomatic large bowel cancer; fixation of a fracture"],
          ["Elective", "Planned for a condition that is not immediately threatening", "Hip replacement; hernia repair in a fit patient"],
        ],
      },
      {
        type: "paragraph",
        text: "The category determines what pre-operative preparation is possible and what is not. An emergency leaves time only for an airway, intravenous access, a group-and-save and a consent, whereas an elective patient can be optimised over weeks: anaemia corrected, diabetes controlled, smoking stopped, anticoagulation managed, and the physiological reserve improved by prehabilitation.",
      },

      { type: "heading", level: 2, text: "Worked example: the components of a pre-operative assessment" },
      {
        type: "table",
        headers: ["Component", "What it answers"],
        rows: [
          ["History and examination", "How fit is the patient at baseline, and how far from that baseline are they now?"],
          ["Full blood count", "Is there anaemia, or a leukocytosis that suggests an undiagnosed infection?"],
          ["Urea, electrolytes and creatinine", "Is there an electrolyte disturbance or a reduced renal function, both of which change the drug and fluid prescription?"],
          ["Clotting screen and group-and-save or cross-match", "Can the patient clot, and how much blood should the blood bank prepare?"],
          ["Electrocardiogram", "Is there ischaemia, an arrhythmia or a conduction disease that the anaesthetist must plan for?"],
          ["Chest radiograph", "Is there infection, effusion or cardiomegaly?"],
          ["Capillary blood glucose", "What is the glycaemic control, and does the perioperative insulin plan need to change?"],
          ["Anaesthetic assessment", "Airway, fasting, allergies, previous anaesthetic problems, and the patient's medication that must be continued"],
        ],
      },
      {
        type: "paragraph",
        text: "The rule that governs routine pre-operative investigations is the same rule as in medicine (MED 301, lesson 1): order an investigation only if the result would change your management. A battery of tests that no one will read is not a safety measure; it is a hazard, because an unexpected abnormality in an unplanned test must still be acted upon.",
      },

      { type: "heading", level: 2, text: "Consent" },
      {
        type: "paragraph",
        text: "A valid consent requires that the patient is competent (has capacity, and no condition or drug that prevents them understanding), that they are informed (of the nature and purpose, the benefits, the risks, and the alternatives), that the decision is theirs and is voluntary, and that it is given for the specific procedure that is intended. In an emergency where no ability exists, treatment may proceed in the patient's best interests, with the consent sought as soon as possible.",
      },
      {
        type: "table",
        headers: ["Risk category", "How it is explained"],
        rows: [
          ["Common, minor", "Stated explicitly because they occur in a substantial proportion of patients — pain, wound infection, nausea, bruising"],
          ["Serious but rare", "Stated explicitly because even rare severe consequences must be explained — death, stroke, limb loss, organ injury"],
          ["Anaesthetic risks", "Discussed by the anaesthetist, including airway complications and the risks of the specific technique"],
          ["Alternatives", "The alternatives including no operation, so the patient is choosing rather than accepting a single pathway"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The ASA physical status classification (I healthy; II mild systemic disease; III severe systemic disease; IV a life-threatening condition; V moribund, not expected to survive without operation; VI a declared brain-dead organ donor) is the commonest shorthand used to communicate how fit a patient is, and it maps onto how much physiological reserve they have.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying consent is a signature. A signature documents the conversation; the consent is the informed exchange, and a patient who has not understood the risks has not consented even though a form is signed.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Sending a patient to theatre before the anaesthetist has assessed the airway. The airway is the one risk that cannot be managed by physiology: it is assessed before the patient comes to harm, and it is the reason that anaesthetic assessment is not a routine pre-op test.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Routinely ordering an ECG on every patient for surgery. The ECG is indicated in patients with cardiac risk factors or of advanced age, and not in a fit patient undergoing minor surgery.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why is fitness the determinant of whether an operation is major or minor, rather than the type of operation alone?",
        answer: "Because the physiological insult of an operation is judged against the patient's reserve. The same procedure can be a minor physiological event in a fit patient and a major one in a frail patient, and the risk changes with the reserve rather than with the name of the operation.",
        explanation: "This is why pre-operative assessment is about the patient and not only about the disease, and why the same operation has different indications in different patients.",
      },
      {
        type: "question",
        prompt: "What are the requirements of a valid consent?",
        answer: "The patient must be competent, informed of the nature, purpose, benefits, risks and alternatives, and the decision must be theirs and voluntary, and it must be for the specific procedure.",
        explanation: "The purpose of the standard is that the patient makes a decision with the information a doctor would want in the same position.",
      },
      {
        type: "question",
        prompt: "Which variable is the one most important determinate of an emergency operation being safe?",
        answer: "Whether the patient can be anaesthetised — above all the airway — because the pre-operative preparation is limited, and the anaesthetic and surgical teams must be able to act without further workup.",
        explanation: "The emergency pathway skips most of the elective optimisation, so the risk assessment must be quick and the airway is the one thing that cannot be waited for.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which operation is the most urgent?",
        options: [
          "A hip replacement in a 70-year-old with mild hypertension",
          "A laparotomy for a strangulated hernia with peritonitis",
          "A hernia repair in a fit 40-year-old",
          "A cholecystectomy for symptomatic gallstones",
        ],
        correctIndex: 1,
        explanation: "A strangulated hernia with peritonitis kills within hours unless the compromised bowel is dealt with, so it is urgent. The others can be planned and optimized over days to weeks.",
      },
      {
        type: "mcq",
        stem: "What is required for a valid consent?",
        options: [
          "A signature on the consent form",
          "The patient must be competent, informed of the nature, purpose, benefits and risks, and the decision must be theirs and voluntary",
          "A relative's agreement",
          "The consultant's approval",
        ],
        correctIndex: 1,
        explanation: "A signature documents the exchange but the essence of consent is that an informed and competent patient makes a voluntary decision for that specific procedure.",
      },
      {
        type: "mcq",
        stem: "Which pre-operative test has the greatest bearing on the plan for an anaesthetic?",
        options: [
          "Full blood count", "Airway assessment by the anaesthetist", "Chest radiograph", "Capillary blood glucose",
        ],
        correctIndex: 1,
        explanation: "The airway is the one risk that physiology cannot compensate for, and a difficult airway changes the anaesthetic plan and the equipment rather than merely being recorded as an abnormality.",
      },
      {
        type: "mcq",
        stem: "Which ASA class corresponds to a patient with a severe systemic disease that is a constant threat to life?",
        options: ["ASA I", "ASA II", "ASA III", "ASA IV"],
        correctIndex: 3,
        explanation: "ASA IV means severe systemic disease that is a constant threat to life; ASA III is severe but not constant; ASA I is a healthy patient.",
      },
      {
        type: "mcq",
        stem: "In an emergency operation on an unconscious patient, what governs the decision to operate?",
        options: [
          "The patient's best interests, since the operation cannot wait for consent to be obtained",
          "The wishes of a relative, which override the patient",
          "The team's preference",
          "A court order",
        ],
        correctIndex: 0,
        explanation: "In an emergency without capacity, treatment proceeds in the patient's best interests, and consent is sought as soon as the patient regains capacity.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Surgical risk is a balance between the physiological insult of an operation and the reserve of the patient, and the pre-operative period is where the reserve is measured, the risk is reduced, and the decision is properly made. Operations are classified from immediate to elective by how soon the threat to life or limb demands treatment. A valid consent requires a competent, informed and voluntary decision, and the ASA class is the shorthand that communicates the patient's reserve.",
      },
      {
        type: "paragraph",
        text: "Next: asepsis and the prevention of surgical site infection — the technique that keeps the operation the patient consented to from becoming a source of harm.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 2 — Asepsis & surgical site infection (fully authored)
// ---------------------------------------------------------------------------
function lesson2() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: distinguish antisepsis, asepsis and disinfection, and name the prerequisites for a sterile field; classify the four classes of surgical wound and give an example of each; list the risk factors for surgical site infection; state the principles and the timing of surgical antibiotic prophylaxis; and name the organisms most commonly responsible for surgical site infection and their treatment.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (Assessment and consent). Surgical site infection is one of the risks that a patient must be told about in consent, and prevention is part of the pre-operative period.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Surgical site infection",
        text: "Infection occurring at the site of an operation within thirty days of surgery (or within one year where an implant is left in place), presenting as wound infection, deep infection or organ-space infection.",
      },
      {
        type: "paragraph",
        text: "Prevention depends on disrupting one of the three requirements for infection: a source of bacteria, a route of entry, and a susceptible host. The sterile field closes the route, the prophylaxis kills the bacteria that are inevitably present, and the optimisation of the patient reduces the susceptibility. Each is necessary; no single one is sufficient, which is why the prevention of surgical site infection is a bundle rather than a single measure.",
      },

      { type: "heading", level: 2, text: "Sterile technique" },
      {
        type: "table",
        headers: ["Term", "What it means", "Note"],
        rows: [
          ["Antisepsis", "The chemical destruction of micro-organisms on skin", "The surgical scrub and the preparation of the operative site"],
          ["Asepsis", "The technique that prevents micro-organisms from reaching the operative field", "Sterile drapes, gloves, gowns and instruments, with a person who has gowned and gloved keeping hands above the waist"],
          ["Sterilisation", "The physical or chemical process by which all viable micro-organisms are destroyed", "Autoclaving (steam under pressure), and gas or radiation for heat-sensitive equipment"],
          ["Disinfection", "The destruction of most but not all micro-organisms on a surface", "The use of chlorhexidine or alcohol on skin before a non-operative procedure"],
        ],
      },
      {
        type: "paragraph",
        text: "The sterile field has rules that follow from its purpose. The surgeon and the scrub nurse are sterile from the chest to the level of the sterile field, and their hands stay above the waist and in front of the body. The person who prepares the patient's skin remains non-sterile, and the field is created after that preparation, and any break in the field is acknowledged, replaced and disclosed. This is also why the sequence of the WHO checklist exists: it makes these steps explicit and shared within the team.",
      },

      { type: "heading", level: 2, text: "Classification of surgical wounds" },
      {
        type: "table",
        headers: ["Class", "Contamination", "Examples", "Expected infection rate"],
        rows: [
          ["Class I — clean", "No inflammation, no breach of a organ system, and no break in technique", "Hernia repair, thyroidectomy, joint replacement", "About 1 to 2 per cent"],
          ["Class II — clean-contaminated", "Entry into a colonised organ system (gut, biliary, urinary, respiratory) under controlled conditions", "Elective cholecystectomy, elective bowel resection", "About 5 to 10 per cent"],
          ["Class III — contaminated", "A break in technique, an inflamed but non-purulent field, or a traumatic wound", "Fresh traumatic wound, perforated appendix without established pus", "About 15 per cent"],
          ["Class IV — dirty or infected", "Established infection, a perforated viscus, or retained foreign material", "Abscess drainage, faecal peritonitis", "About 25 to 40 per cent"],
        ],
      },
      {
        type: "paragraph",
        text: "The class is the most important factor in whether you give prophylaxis, and it maps onto the organisms that you are worried about. In a clean case the concern is skin flora — predominantly staphylococci — and prophylaxis is a single dose. In a case that enters the gut, the concern is the gram-negative gut flora and anaerobes, so the antibiotic is chosen accordingly and may be given for a longer period.",
      },

      { type: "heading", level: 2, text: "Prophylaxis" },
      {
        type: "paragraph",
        text: "Prophylaxis is given to cover the period of contamination, and the target is that the tissue concentration must be above the minimal inhibitory concentration at the time of the incision and for the duration of the operation. In practice this means a dose within the sixty minutes before incision, and that is the timing that matters.",
      },
      {
        type: "table",
        headers: ["Principle", "Practice"],
        rows: [
          ["Timing", "Within 60 minutes before incision, so the tissue level is adequate at the time of incision"],
          ["Choice", "Directed at the organisms expected at the site — staphylococci for clean cases, gram-negative and anaerobic cover for bowel cases"],
          ["Duration", "A single dose, or a maximum of 24 hours; continuing prophylaxis after the operation does not reduce infection and increases resistance"],
          ["Indication", "Clean-contaminated and contaminated cases, implantation of a prosthesis, and clean cases in which an infection would be catastrophic"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The patient-related risk factors are the ones that are often modifiable before the operation: diabetes glycaemic control, malnutrition, smoking (which reduces tissue oxygen delivery and healing), immunosuppression and the drugs that cause it, obesity, and a longer operation. Recognising them before the operation is half of the prevention.",
      },
      {
        type: "question",
        prompt: "Why is prophylactic antibiotic stopped after a single dose in most cases?",
        answer: "Because the purpose of prophylaxis is to cover the period of contamination, which ends at closure. Continuing antibiotics after the operation does not reduce surgical site infection and does increase resistance and the risk of a Clostridioides difficile infection.",
        explanation: "Superinfection and resistance are the cost of over-long prophylaxis, and the evidence favours a single dose except where an established infection is being treated.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a wound infection is sterile. Sterility is a standard of technique, not an outcome; a clean class wound carries a residual infection rate, and the class is a risk category rather than a guarantee.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Continuing prophylactic antibiotics for days after an elective cholecystectomy. This is a common and important error: prophylaxis is a single dose or at most 24 hours, and continuing it increases resistance and drug side effects without reducing infection.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Attributing surgical site infection to a failure of technique alone. Host factors — diabetes, malnutrition, smoking, immunosuppression and obesity — are often the largest contributors, and the correction of each one is the work of the pre-operative period.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What is the difference between asepsis and antisepsis?",
        answer: "Antisepsis is the destruction of micro-organisms on the living tissue (the scrub and the skin preparation). Asepsis is the technique of preventing micro-organisms from reaching the operative field, through drapes, gowns, gloves and instruments.",
        explanation: "The first is chemical and applied to skin; the second is behavioural and protects the field. Both are parts of the same prevention.",
      },
      {
        type: "question",
        prompt: "What determines the class of a surgical wound, and why does it matter?",
        answer: "The degree of contamination: clean, clean-contaminated (entering a colonised system), contaminated (a break in technique or inflamed tissue), and dirty (established infection). It matters because it determines the risk of surgical site infection, the antibiotic prophylaxis, and the treatment if infection follows.",
        explanation: "Class is the account of the contamination at the time of surgery rather than a description of the wound at the end.",
      },
      {
        type: "question",
        prompt: "When is antibiotic prophylaxis given and for how long in an elective colectomy?",
        answer: "Within sixty minutes before incision to cover the period of contamination, directed at gram-negative and anaerobic bacteria, and for a single dose or at most 24 hours.",
        explanation: "The colectomy enters the colon (a clean-contaminated wound), so the organism profile includes the gut flora and anaerobes, and the prophylaxis is precise and short.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which factors determine a higher risk of surgical site infection?",
        options: [
          "Patient factors, wound contamination and duration of the operation",
          "Only the antibiotic used",
          "Only the technique",
          "Only the ward the patient stays on",
        ],
        correctIndex: 0,
        explanation: "An elective colectomy entering the colon (a clean-contaminated wound) carries a greater risk than a thyroidectomy (clean), and infection risk is increased by diabetes, immunosuppression, malnutrition, obesity, smoking and a long operation.",
      },
      {
        type: "mcq",
        stem: "What is the standard timing for surgical antibiotic prophylaxis?",
        options: [
          "Within 24 hours after the operation",
          "Within 60 minutes before the incision",
          "At the first sign of a raised temperature",
          "As soon as the patient arrives in hospital",
        ],
        correctIndex: 1,
        explanation: "Antibiotic prophylaxis must be given within 60 minutes before the incision, so the tissue concentration is adequate at the time of the incision and covers the operation.",
      },
      {
        type: "mcq",
        stem: "Which organism is the most frequently responsible for surgical site infection in a clean wound?",
        options: ["Escherichia coli", "Staphylococcus aureus", "Streptococcus pneumoniae", "Clostridium difficile"],
        correctIndex: 1,
        explanation: "The organisms of a clean wound infection are the skin flora, of which the staphylococci are the most frequent. Escherichia coli belongs to the gut flora and appears in clean-contaminated cases.",
      },
      {
        type: "mcq",
        stem: "Why is prophylactic antibiotic generally limited to a single dose?",
        options: [
          "Because antibiotics after surgery are not absorbed",
          "Because the period of contamination ends at wound closure, and prolonged courses increase resistance and infection without reducing infection",
          "Because a single dose is cheaper",
          "Because it prevents all surgical site infection",
        ],
        correctIndex: 1,
        explanation: "Prophylaxis only needs to cover the contamination period; continuation adds the risk of bacterial resistance and antibiotic toxicity, and the evidence for continuing it is lacking.",
      },
      {
        type: "mcq",
        stem: "Which wound class is a faecal peritonitis laparotomy?",
        options: ["Class I — clean", "Class II — clean-contaminated", "Class III — contaminated", "Class IV — dirty or infected"],
        correctIndex: 3,
        explanation: "Established infection or faecal contamination makes a wound of class IV — dirty, with the highest rate of surgical site infection.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Infection prevention is the interruption of three things: the source of bacteria, the route of entry and the susceptibility of the host. The sterile field and the surgical scrub protect the route; antibiotic prophylaxis within sixty minutes of incision covers the contamination that is inevitable, which is why a single dose suffices; and the patient's diabetes, nutrition, smoking and immunosuppression are the risk factors that are reduced before the operation. The wound class (clean, clean-contaminated, contaminated or dirty) records the degree of contamination, and it determines the risk, the prophylaxis and the treatment.",
      },
      {
        type: "paragraph",
        text: "Next: haemostasis, shock and fluid management — where the physiology of the pre-clinical years becomes the decisive factor in whether a bleeding patient survives.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 3 — Haemostasis, shock & fluids (fully authored)
// ---------------------------------------------------------------------------
function lesson3() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the four classes of acute haemorrhage and their recognition; state the features that distinguish haemorrhagic shock from other types; outline the initial management of a bleeding patient; describe what blood products are used for and the thresholds that trigger them; and calculate the maintenance and resuscitation fluid requirements for a surgical patient.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-2, and PATH 201 module 1 (haemodynamic disorders) and PHYS 101 (cardiovascular physiology). Haemorrhagic shock is the disturbance of circulation that you learned about, produced by a surgical loss of volume.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Haemorrhagic shock",
        text: "Shock from loss of blood volume, in which the circulating volume falls faster than the compensatory mechanisms can maintain perfusion, and in which the initial and continued priority is to stop the bleeding and restore the volume.",
      },
      {
        type: "paragraph",
        text: "Bleeding is the commonest cause of shock in a surgical patient and the one in which a delay in the first action is most likely to be fatal. The class of haemorrhage is a shorthand for how far the compensation has gone, and it tells you what the patient will look like and how urgently they need blood.",
      },

      { type: "heading", level: 2, text: "The classes of haemorrhage" },
      {
        type: "table",
        headers: ["Class", "Volume lost", "Clinical picture"],
        rows: [
          ["Class I", "Under 15 per cent of blood volume", "Minimal symptoms; a slight tachycardia; normal pulse pressure and breathing rate"],
          ["Class II", "15 to 30 per cent", "Tachycardia; narrowed pulse pressure; anxiety; breathing rate normal or slightly raised; urine output preserved"],
          ["Class III", "30 to 40 per cent", "Tachycardia with a widened or narrow pulse pressure; hypotension; altered mental state; oliguria; breathing rate raised"],
          ["Class IV", "Over 40 per cent", "Lethargy; marked hypotension; minimal urine output; the patient requires immediate surgery and blood"],
        ],
      },
      {
        type: "paragraph",
        text: "Note that the compensatory tachycardia is the change that appears first, and that a normal heart rate does not exclude a class III haemorrhage in a patient taking a beta-blocker, in whom the compensatory tachycardia is blocked. The pulse pressure narrows before the systolic pressure falls, because the vasoconstriction that compensates raises the diastolic before the systolic has been affected at all. By the time the systolic pressure falls, the patient has exhausted the compensation.",
      },

      { type: "heading", level: 2, text: "Worked example: the initial management of bleeding" },
      {
        type: "table",
        headers: ["Step", "Action", "Purpose"],
        rows: [
          ["Resuscitation", "Give high-flow oxygen, two wide-bore intravenous cannulae, and take blood for cross-matching, full blood count, coagulation and biochemistry", "To maintain oxygenation while the volume is restored, and to know what the patient's starting state was"],
          ["Volume", "Give warmed crystalloid (30 millilitres per kilogram) while waiting for blood", "The initial restoration of the circulating volume, with the risks of over-hydration recognised"],
          ["Blood", "Transfuse red cells for haemodynamic instability with a haemoglobin below 7 to 8 grams per decilitre; use platelets, plasma and cryoprecipitate as the clotting parameters fall", "To restore both the volume and the oxygen-carrying capacity, and to treat the coagulopathy that develops"],
          ["Damage control", "Stop the bleeding by radiological embolisation or surgical control, and keep the patient warm and oxygenated", "To remove the cause, because transfusion alone will not stop the bleeding"],
        ],
      },
      {
        type: "paragraph",
        text: "Massive transfusion — the replacement of one blood volume within twenty-four hours, or the transfusion of ten units of red cells in an adult — carries the risks of dilution of the clotting factors, of hypothermia from cold products, of acidosis from the ongoing shock, and of hyperkalaemia from stored blood. The lethal triad of hypothermia, acidosis and coagulopathy feeds on itself, and this is the cycle that a modern massive transfusion protocol interrupts by giving red cells, plasma and platelets in a fixed ratio of one to one to one rather than transfusing red cells alone and then rebuilding the clotting after.",
      },
      {
        type: "question",
        prompt: "Why does the pulse pressure narrow before the systolic blood pressure falls in haemorrhagic shock?",
        answer: "Because the compensatory vasoconstriction raises the diastolic pressure before the systolic falls: the body constricts the peripheral vessels first, preserving the mean arterial pressure for the organs, and the systolic pressure only falls when the compensation is exhausted.",
        explanation: "The narrowing pulse pressure is therefore an earlier sign than the falling systolic, and it is the reason a normal-looking blood pressure does not exclude class III haemorrhage.",
      },

      { type: "heading", level: 2, text: "Fluids in the surgical patient" },
      {
        type: "table",
        headers: ["Situation", "Approach"],
        rows: [
          ["Maintenance", "Hourly rate from weight (4 ml/kg for the first 10 kg, 2 for the next 10, 1 for the rest), with replacement of measured losses"],
          ["Resuscitation", "Warmed crystalloid 30 ml per kilogram for hypotension or a raised lactate, with a reassessment after each bolus"],
          ["Hypotonic versus isotonic", "0.9% saline is a balanced replacement in most surgical states; balanced crystalloids are often preferred where large volumes are given, because of the chloride load"],
          ["Post-operative", "Replace measured losses (drains, urine, nasogastric output) plus the maintenance, with the electrolytes and acid-base checked rather than assumed"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The most common fluid error in surgery is over-resuscitation with unbalanced crystalloid, which produces a chloride-driven metabolic acidosis that delays recovery and can be misread as a deterioration of the underlying condition. Reassess after each bolus, and let the measured values and the end-points (heartrate, blood pressure, urine output, lactate) define the endpoint.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a normal blood pressure excludes haemorrhagic shock. The compensation (a tachycardia and vasoconstriction) keeps the pressure near-normal until the compensation is exhausted, and a patient on a beta-blocker may not even have the tachycardia.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Transfusing blood to a fixed haemoglobin number regardless of the patient. Transfusion is for instability or symptoms, with a threshold of about 7 grams per decilitre in most stable patients and higher in patients with active coronary disease.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Transfusing red cells alone in a massive transfusion. Coagulopathy, hypothermia and acidosis develop, so red cells, plasma and platelets are given in a fixed ratio rather than sequentially.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "How do you estimate the severity of a haemorrhage at the bedside?",
        answer: "From the pulse rate, the pulse pressure, the breathing rate, the mental state, the urine output and the capillary refill time, because these are the compensatory responses whose exhaustion marks the class.",
        explanation: "The class of haemorrhage is a functional classification rather than an anatomical one, and it predicts the urgency of blood and of the need for surgical control.",
      },
      {
        type: "question",
        prompt: "Why is the lethal triad called the lethal triad?",
        answer: "Because hypothermia (which impairs clotting and platelet function), acidosis (which impairs clotting enzyme activity) and coagulopathy (which worsens bleeding, which worsens the other two) feed on each other, and the cycle can only be broken by stopping the bleeding and correcting the temperature and the acidosis.",
        explanation: "This is why the modern massive transfusion protocol delivers red cells, plasma and platelets together in a one-to-one-to-one ratio, and why the patient is warmed.",
      },
      {
        type: "question",
        prompt: "When is blood given to a bleeding surgical patient?",
        answer: "Transfusion is given for haemodynamic instability or symptoms of anaemia, with a haemoglobin threshold of about 7 to 8 grams per decilitre in most stable patients, and platelets, plasma or cryoprecipitate as the clotting parameters fall.",
        explanation: "The trigger is the effect rather than the number: transfusion is a treatment of the patient's need, not a laboratory target.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which clinical feature appears first in haemorrhagic shock?",
        options: [
          "A falling systolic blood pressure", "A rising heart rate and a narrowing pulse pressure", "Confusion", "Loss of consciousness",
        ],
        correctIndex: 1,
        explanation: "The sympathetic compensation (tachycardia and vasoconstriction) appears before the systolic pressure falls, because the vasoconstriction preserves the diastole and the mean arterial pressure for the organs.",
      },
      {
        type: "mcq",
        stem: "Which is a feature of the compensatory tachycardia in a haemorrhaging patient?",
        options: [
          "It is a marker of the severity of the bleeding itself",
          "It is an early and reliable sign, and it is reduced by a beta-blocker, so a normal heart rate does not exclude haemorrhage",
          "It is only present in class IV haemorrhage",
          "It falls as the bleeding continues",
        ],
        correctIndex: 1,
        explanation: "The heart rate is the first compensatory change, but it is not a precise measurement of the volume lost, and it is absent in patients whose beta-blockers block the sympathetic response.",
      },
      {
        type: "mcq",
        stem: "What is the commonest cause of shock in a surgical patient?",
        options: ["Cardiogenic", "Hypovolaemic from blood loss", "Septic", "Neurogenic"],
        correctIndex: 1,
        explanation: "Hypovolaemic shock from blood loss dominates in surgical practice — most often from trauma or from post-operative bleeding.",
      },
      {
        type: "mcq",
        stem: "What is the target of the fluid resuscitation of a bleeding patient?",
        options: [
          "A haemoglobin of 10 grams per decilitre",
          "A restoration of perfusion — a urine output of at least 0.5 millilitres per kilogram per hour, a mean arterial pressure above 65 mmHg, a falling lactate and a clear mental state",
          "A urine output of 20 millilitres per hour",
          "Any pressure the patient will tolerate",
        ],
        correctIndex: 1,
        explanation: "The goal is the restoration of tissue perfusion, measured as a target of urine output, pressure and lactate, rather than as a single laboratory number.",
      },
      {
        type: "mcq",
        stem: "What is the immediate priority in a bleeding patient?",
        options: [
          "Pain relief", "Stopping the bleeding, which may mean immediate surgery", "Ordering a CT scan", "Reassurance",
        ],
        correctIndex: 1,
        explanation: "The only definitive treatment of haemorrhagic shock is control of the bleeding, and the rest of the resuscitation is supportive while that is achieved.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Haemorrhagic shock is the commonest shock in surgical practice, and the class of haemorrhage is a shorthand for how far the compensation has been driven. The tachycardia and the narrow pulse pressure appear before the systolic falls, so a normal pressure does not exclude a class III bleed. Resuscitation gives oxygen, access, warmed crystalloid and blood in a fixed ratio, and the priority at each step is to restore perfusion and then to stop the bleeding, because transfusion alone will not do it.",
      },
      {
        type: "paragraph",
        text: "Next: wound care and healing, where the principles of the pathology course are applied to the wound you make in theatre, and to the complications of that wound afterwards.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 4 — Wound healing & wound care (fully authored)
// ---------------------------------------------------------------------------
function lesson4() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the stages of surgical wound healing and their sequence; identify the causes of delayed healing and their prevention; define and recognise wound dehiscence and incisional hernia; state the principles of choosing skin closure material and of drain use; and explain the principles of managing a contaminated and of an open wound.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-3, and PATH 201 module 1 (repair and healing). A surgical wound is a clean, controlled example of every process that pathology teaches.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Wound healing",
        text: "The restoration of tissue continuity after the injury of an operation, achieved by the same sequence as any other wound: haemostasis, inflammation, granulation tissue, contraction and remodelling, and with the same dependence on oxygen, nutrition and freedom from infection.",
      },
      {
        type: "paragraph",
        text: "The surgical wound differs from an accidental one in three ways, and all three are the work of the operation. The edges are cut cleanly rather than crushed. They are apposed rather than left apart. And the wound is closed in a way that leaves the cells of the skin dividing to bridge a gap measured in millimetres rather than centimetres. The result is healing by first intention, with a thin linear scar and little contraction.",
      },

      { type: "heading", level: 2, text: "Stages, and the surgical relevance of each" },
      {
        type: "table",
        headers: ["Stage", "Timing", "Surgical relevance"],
        rows: [
          ["Haemostasis", "Minutes", "Haemostasis and the approximation of the dead space: a haematoma between the layers is a portal for infection and delays healing"],
          ["Inflammation", "Hours to days", "The wound is weakest at the point where the inflammatory phase gives way to granulation: around day 5 to 10, when the collagen deposition is only beginning"],
          ["Granulation", "Days 2 to 5", "The visible bed of new vessels, and the phase in which drainage of a contaminated wound allows the surface to heal from the bottom"],
          ["Contraction", "Days 3 onwards", "Minimal in a well-apposed wound, and the principal mechanism of closure in a second-intention wound"],
          ["Remodelling", "Weeks to about a year", "The reason an incision is not fully strong for months, and the reason a scar relaxes and softens for a year"],
        ],
      },
      {
        type: "paragraph",
        text: "The tensile strength curve is the single most useful fact: about ten per cent of the original strength at two weeks, about fifty per cent at a month, and a maximum of about eighty per cent thereafter. The practical consequence is that the sutures are not removed before the wound has enough intrinsic strength to hold itself, and that an abdominal incision remains a point of relative weakness for the rest of the patient's life.",
      },

      { type: "heading", level: 2, text: "Closure materials and drains" },
      {
        type: "table",
        headers: ["Material", "Behaviour", "Use"],
        rows: [
          ["Monofilament non-absorbable (nylon, polypropylene)", "Does not dissolve; the least reactive of the sutures", "Skin closure, and fascial closures where long-term strength is needed"],
          ["Braided absorbable (polyglactin, catgut)", "Dissolves over weeks by hydrolysis; more reactive", "Subcutaneous closure and ligature"],
          ["Absorbable monofilament (polydioxanone)", "Dissolves over months; used for slow-healing tissue", "Fascial closure, whose tensile strength is needed for months"],
          ["Skin staples", "Rapid, and leave less reactive track", "Long incisions, particularly in leg or scalp wounds"],
          ["Tissue glue", "Forms a film over the apposed edges", "Small, clean and dry wounds, and paediatric lacerations"],
          ["Drains", "Remove fluid that would otherwise accumulate", "Contaminated or bleeding sites; but they increase the risk of infection and should be removed early"],
        ],
      },

      { type: "heading", level: 2, text: "Clinical correlation: dehiscence and hernia" },
      {
        type: "paragraph",
        text: "A patient on the seventh day after a laparotomy coughs, feels something give, and develops a wound that is openly separated, with the bowel visible through the opening. The explanation is the tensile strength curve: the wound's own strength at this point is a fraction of its eventual value, and a sudden rise in the intra-abdominal pressure bears on an incision whose collagen deposition is still weak. Dehiscence is an emergency: the wound is covered with a sterile dressing soaked in saline, the patient is given analgesia, antibiotics are started, and the patient returns to theatre for re-closure over a higher-risk system.",
      },
      {
        type: "paragraph",
        text: "An incisional hernia is the delayed consequence of a wound that has failed to develop its full tensile strength or that healed under tension, and its risk factors are the same as those for any wound: infection, obesity, malnutrition, steroid exposure, a wound under tension, and a technical error in the closure. It is prevented by correct closure of the layers under no tension, and by an appropriate technique with an absorbable monofilament, rather than by the strongest single suture.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Removing sutures from a patient whose wound is on the face or on a mobile part of the body too early. The rule is 5 to 7 days for the face and neck, 7 to 10 days for the trunk, 10 to 14 days for the limbs, and 14 days for wounds over joints — differing because the strength of the closure and the mobility of the wound differ.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Closing a grossly contaminated wound primarily. A wound that cannot be closed without burying contamination is left open, packed, and closed later by secondary intention or a delayed primary closure.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying drains reduce infection. They do not, and they increase the risk of an infection and of a drained seroma; a drain is justified by the need to remove blood or fluid, and it is removed as soon as that need ends.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A patient on the seventh day after a laparotomy coughs and develops a burst wound. Why is the wound prone to this, and what must be done first?",
        answer: "Because at one week the wound's tensile strength is only a fraction of its eventual value, so a sudden rise in intra-abdominal pressure can disrupt it. The first action is to cover the wound with a saline-soaked sterile dressing, give analgesia, start antibiotics and return the patient to theatre.",
        explanation: "Dehiscence is a surgical emergency, and the patient's exposure and pain are managed meanwhile.",
      },
      {
        type: "question",
        prompt: "What is the difference between healing by first and by second intention, and which is which?",
        answer: "First intention is a clean, apposed surgical incision healing with minimal contraction and a thin scar. Second intention is a large open wound that fills with granulation tissue from the bottom, contracts markedly, and leaves a broad scar.",
        explanation: "The distinction is made by whether the edges can be approximated, and it decides the contraction, the timing and the final appearance.",
      },
      {
        type: "question",
        prompt: "Why does an over-long drain increase the risk of an infection?",
        answer: "Because the drain acts as a foreign body and provides a retrograde route for bacteria into the wound, so the risk of infection rises with the length of time that it is in place.",
        explanation: "Drains are justified by the need to remove blood or fluid, and they should be removed early once that need is over.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "When is a surgical wound usually strongest, relative to its original strength?",
        options: ["At 5 days", "Never exceeding about 80 per cent of original strength", "At 6 weeks", "Never exceeding about 30 per cent"],
        correctIndex: 1,
        explanation: "A wound is only about ten per cent strong at two weeks and about fifty per cent at one month, and it reaches a maximum of about eighty per cent of the original tissue tensile strength, which is why wounds can dehisce months later.",
      },
      {
        type: "mcq",
        stem: "On which day after an abdominal operation is a wound burst most likely, and why?",
        options: [
          "Day 3, because the inflammation is at its peak", "Day 7 to 10, because the wound's tensile strength is only beginning to be rebuilt", "Day 30, because the scar is mature", "Day 2, because of the haemostasis",
        ],
        correctIndex: 1,
        explanation: "A burst wound occurs when the peak cough or strain coincides with the period when the collagen deposition is only beginning, which is around one week.",
      },
      {
        type: "mcq",
        stem: "What is the appropriate management of a grossly contaminated wound?",
        options: [
          "Close it primary with a monofilament suture",
          "Leave it open, pack it, and plan a delayed closure",
          "Leave it open permanently",
          "Close it immediately and give antibiotics only",
        ],
        correctIndex: 1,
        explanation: "A contaminated wound is left open and packed, and is closed by secondary intention or by a delayed primary closure, because closing contamination in place will produce an abscess.",
      },
      {
        type: "mcq",
        stem: "Which factor does not increase the risk of an incisional hernia?",
        options: ["Obesity", "Wound infection", "A monofilament absorbable suture of the correct size", "Wound closure under tension"],
        correctIndex: 2,
        explanation: "Obesity, infection, tension, steroid use and malnutrition all increase the risk of an incisional hernia; an appropriately chosen monofilament reduces the risk of infection and dehiscence.",
      },
      {
        type: "mcq",
        stem: "When are sutures from a facial wound usually removed?",
        options: ["24 hours", "3 to 5 days", "5 to 7 days", "14 days"],
        correctIndex: 2,
        explanation: "Facial and neck wounds are removed at about 5 to 7 days because the tissue is well vascularised; long wounds can be supported with adhesive strips while the intrinsic strength matures.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "A surgical wound heals by the same five stages as any wound, and its strength at each moment is known: weak early in the first fortnight, half strength at a month, and never more than about eighty per cent of the original. Closure materials are chosen for the tissue and the tension, and drains remove fluid at the cost of an increased infection risk. Dehiscence and incisional hernia are the complications of a wound that has failed to develop tensile strength, and the risk factors that predict them are the ones that predict any wound: infection, tension, obesity, malnutrition and steroids.",
      },
      {
        type: "paragraph",
        text: "Next: trauma, where the principles of the whole module are applied in a single encounter, in a fixed order, at speed.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 5 — Trauma principles (fully authored)
// ---------------------------------------------------------------------------
function lesson5() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: recite the steps of the primary survey and of the secondary survey and say which injuries are looked for in each; explain the principle of anaesthetic and surgical assessment before definitive care; name the immediate interventions of the primary survey; describe the concept of damage control resuscitation and damage control surgery; and apply a triage principle to multiple casualties.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-4. Trauma calls on the airway, the haemorrhage classes, the shock, and the ATLS sequence of assessment in the order in which injuries kill.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Primary survey",
        text: "A rapid, structured, sequential assessment of a trauma patient that identifies and treats the injuries that are killing them at that moment, in the order in which they are killing them, before any injury is defined.",
      },
      {
        type: "paragraph",
        text: "Trauma is the one situation in which the patient's physiology, rather than the anatomical diagnosis, decides the sequence of action. The principle behind the Advanced Trauma Life Support course is that the injury that kills first is treated first, and everything else waits. Nothing in the primary survey is diagnostic; it is an airway, a breathing and a circulation assessment, with the injuries that are found and that would kill treated immediately, before the next step is taken.",
      },

      { type: "heading", level: 2, text: "Primary and secondary survey" },
      {
        type: "table",
        headers: ["Survey", "Sequence", "What it is for"],
        rows: [
          ["Primary", "Airway with cervical spine protection; Breathing; Circulation with haemorrhage control; Disability; Exposure with temperature control", "To treat the injuries that are killing the patient at that moment"],
          ["Secondary", "A full head-to-toe examination, a complete history (ample, medications, allergies, past history, last meal, events), and a brief neurological examination", "To define the injuries that remain, once the patient is stable"],
        ],
      },
      {
        type: "paragraph",
        text: "Three things are constant during the primary survey. The cervical spine is protected until the spine has been cleared, because an unrecognised spinal injury in an unconscious patient is disregarded at their peril. The patient is kept warm, because hypothermia is one of the triad of death. And the sequence returns to the airway after any intervention, because a patient whose condition is deteriorating has usually got an airway or a breathing problem.",
      },

      { type: "heading", level: 2, text: "The immediate interventions" },
      {
        type: "table",
        headers: ["Intervention", "When", "Purpose"],
        rows: [
          ["High-flow oxygen", "All critically ill or injured patients", "To maximise the delivery while hypovolaemia and lung injury are corrected"],
          ["Nasopharyngeal or oropharyngeal airway", "Airway obstruction without a protected airway", "Temporary patency while a definitive airway is prepared"],
          ["Definitive airway", "An airway that will not stay open, a need to ventilate, or a head injury", "The protection of oxygenation and of the airway itself"],
          ["Needle decompression and then a chest drain", "Tension pneumothorax", "Immediate decompression of the pressure before a formal drain is placed"],
          ["Direct pressure, pelvic binder, tourniquet", "Haemorrhage from a limb, or a suspected pelvic fracture", "To stop the bleeding while volume is restored"],
          ["Massive transfusion", "Class III or IV haemorrhage", "The simultaneous treatment of volume, oxygen carriage and coagulopathy"],
          ["Intravenous access and warmed fluid", "All hypovolaemic patients", "The restoration of perfusion while blood is obtained"],
        ],
      },
      {
        type: "paragraph",
        text: "The concept of a tourniquet has changed in the last two decades: it was previously avoided because of ischaemic injury to the limb, and it is now applied early and proximally in uncontrolled limb haemorrhage, because a patient who bleeds to death dies, whereas a limb that is ischaemia for two hours can be salvaged. The pressure that a tourniquet applies is recorded and the limb is kept warm.",
      },

      { type: "heading", level: 2, text: "Damage control" },
      {
        type: "paragraph",
        text: "Damage control resuscitation is the strategy for a bleeding trauma patient whose physiology cannot tolerate the definitive operation: minimal crystalloid with early blood components in a fixed ratio, a permissive hypotension until surgical control is achieved, warming of the patient, and immediate correction of the acidosis and the coagulopathy. The idea of permissive hypotension is important: in an unprepared bleeding patient, restoring the pressure before the bleeding is stopped increases the loss by dislodging clots and diluting the clotting factors.",
      },
      {
        type: "paragraph",
        text: "Damage control surgery applies the same logic to the operation itself: the surgeon does the minimum to stop the bleeding and the contamination — packs the abdomen, ligates vessels, resects the injured segment without anastomosis, closes temporarily — and takes the patient to intensive care to be warmed, resuscitated and re-warmed, with the definitive repair planned for a second operation one or two days later. The recognition of this cycle broke the old dogma that a bleeding patient must be fully repaired in the first operation, which was the cause of a high mortality.",
      },
      {
        type: "question",
        prompt: "Why is a bleeding trauma patient not resuscitated to a normal blood pressure before the bleeding is stopped?",
        answer: "Because raising the pressure before surgical control increases the bleeding, by dislodging the clots that have formed and by diluting the clotting factors. The aim is to maintain perfusion while the bleeding is controlled, and the definitive repair comes second.",
        explanation: "This is the principle of permissive hypotension, and it is why damage control resuscitation is a staged strategy.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Sending an unstable patient to CT before the airway is secured and the haemorrhage is controlled. The unstable patient is not scanned: they go to theatre or to angiotherapy, and the imaging waits until the physiology is stable.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Clearing a cervical spine on the basis of a normal radiograph in an unconscious patient. A normal plain film does not exclude a ligamentous injury, and the spine remains protected until the patient can be examined.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Starting an adrenal line or taking radiographs before the primary survey is complete. Nothing in the primary survey is a diagnostic delay: the airway and the breathing take precedence over any imaging.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why is the cervical spine protected throughout the primary survey?",
        answer: "Because a spinal injury that is not recognised will be disregarded, and the unrecognised injury is converted into permanent cord damage by the very manoeuvres used to manage the airway.",
        explanation: "C-spine protection is an assumption held until the spine has been cleared, and it applies from the first moment of contact with the patient.",
      },
      {
        type: "question",
        prompt: "What is damage control surgery, and when is it used?",
        answer: "It is a staged strategy in which the surgeon does the minimum needed to stop the bleeding and the contamination (packing, ligation, temporary closure) and takes the patient to intensive care to be warmed and resuscitated, with the definitive repair planned for a second operation. It is used in the patient whose physiology cannot tolerate the definitive operation.",
        explanation: "The insight is that the patient survives the operation, and the repair waits for the physiology to recover.",
      },
      {
        type: "question",
        prompt: "Why is a tourniquet used in modern trauma management?",
        answer: "Because an early, proximal tourniquet controls the bleeding from a limb exsanguination, and a limb survives this better than the patient survives exsanguination.",
        explanation: "The reversal of the old teaching reflects a change in the relative value of limb preservation versus life-saving it.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which is included in the primary survey?",
        options: [
          "A full head-to-toe examination", "Airway, Breathing, Circulation, Disability and Exposure", "A complete medical history", "Imaging and laboratory results",
        ],
        correctIndex: 1,
        explanation: "The primary survey is ABCDE, and it treats what kills first. The head-to-toe examination, the history and the imaging are all part of the secondary survey.",
      },
      {
        type: "mcq",
        stem: "What is the immediate management of a tension pneumothorax in a trauma patient?",
        options: [
          "Portable chest radiograph", "Needle decompression of the second intercostal space, mid-clavicular line, then a chest drain", "Insertion of a central line", "Intubation and ventilation",
        ],
        correctIndex: 1,
        explanation: "Tension pneumothorax is a clinical diagnosis decompressed on the spot with a needle, and then a formal chest drain is placed while resuscitation continues.",
      },
      {
        type: "mcq",
        stem: "What is the principle of damage control surgery?",
        options: [
          "Complete repair in the first operation",
          "The minimum intervention to stop bleeding and contamination now, with the definitive repair planned for a second operation",
          "Observation of the patient for 24 hours",
          "Definitive repair regardless of the physiology",
        ],
        correctIndex: 1,
        explanation: "Damage control does the minimum to control the bleeding and the contamination, with the definitive repair planned for the operation one or two days later.",
      },
      {
        type: "mcq",
        stem: "Which is the most urgent priority in a stable trauma patient with a high energy mechanism?",
        options: [
          "Taking a history", "Assessing and protecting the airway with the cervical spine control", "Imaging", "Analgesia and reassurance",
        ],
        correctIndex: 1,
        explanation: "A protected airway, with the spine, is the first priority in the primary survey and is needed before diagnosis and treatment can proceed.",
      },
      {
        type: "mcq",
        stem: "Why is a trauma patient kept warm during resuscitation?",
        options: [
          "Because of comfort only", "Because hypothermia is part of the lethal triad, impairing clotting and platelet function", "Because they usually arrive hot", "To reduce the heart rate",
        ],
        correctIndex: 1,
        explanation: "Hypothermia, acidosis and coagulopathy form the lethal triad, and each worsens the other two; warming is an essential part of the resuscitation.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Trauma is managed by physiology rather than by diagnosis, and the primary survey — airway with c-spine control, breathing, circulation with haemorrhage control, disability, exposure — treats the injuries that kill first. Immediate interventions are the ones that stop the death-in-progress: an airway, a decompression for a tension pneumothorax, a tourniquet or a pelvic binder for haemorrhage, and early blood. Damage control resuscitation and surgery stop the bleeding with the minimum physiological cost, and repair the anatomy later.",
      },
      {
        type: "paragraph",
        text: "Next: post-operative care, which is where the principles of this module are converted into a routine that catches the complications at the moment they appear.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 6 — Post-operative care & complications (fully authored)
// ---------------------------------------------------------------------------
function lesson6() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the routine of post-operative care and what is observed at each stage; list the general complications that follow an operation and the timing of their onset; apply a structured mnemonic to a post-operative fever; recognise and manage a surgical haemorrhage, an anastomotic leak and a deep vein thrombosis; and identify which post-operative findings at what point require escalation.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-5. Post-operative care is the continuation of the surgical management of the patient and the detection of its complications.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Post-operative care",
        text: "The planned monitoring and treatment of the patient after an operation, in which physiological disturbance is detected as early as possible and complications are treated at the point they appear, and in which the plan for it is written before the operation is over.",
      },
      {
        type: "paragraph",
        text: "Post-operative observation is not simply watching. It is a set of parameters recorded at a known frequency — the vital signs, the level of consciousness, the pain score, the urine output and the drain losses — and it is interpreted against the expected trajectory. The art of post-operative care is recognising when the trajectory deviates, and the reasons a patient deteriorates are relatively few if the cause is looked for in the right order and at the right time.",
      },

      { type: "heading", level: 2, text: "Worked example: fever and its timing" },
      {
        type: "table",
        headers: ["Cause", "Timing", "Basis"],
        rows: [
          ["Atelectasis (wind)", "Within the first 24 hours", "Shallow breathing in a painful patient, leading to atelectasis and a low-grade fever"],
          ["Pneumonia", "Day 2 to 3", "The atelectatic segments become infected, with a fever, purulent sputum and hypoxia"],
          ["Urinary tract infection (water)", "Day 3 to 5", "Catheter-related ascending infection"],
          ["Intravenous lines (and catheter bacteraemia)", "Day 3 to 5", "Colonisation of an intravascular device, with fever and a positive line culture"],
          ["Deep vein thrombosis (and pulmonary embolism)", "Day 5 to 10", "Immobility, surgery and hypercoagulability, with fever, calf pain and pleuritic pain"],
          ["Wound infection (and cellulitis)", "Day 4 to 7", "Redness, swelling, discharge and tenderness at the wound"],
          ["Anastomotic leak (and peritonitis or abscess)", "Day 5 to 10", "Abdominal pain, fever, tachycardia, ileus and a change in the drainage output"],
          ["Drug allergy and transfusions", "Any time", "A rash with eosinophilia, and a haemolytic or a febrile transfusion reaction"],
        ],
      },
      {
        type: "paragraph",
        text: "A structured approach to fever after surgery has two advantages over the vague memory of causes. The timing is part of the diagnosis, and the mnemonic wind, water, wound, walking, and wonder drugs gives both a short list and an order of examination. But the most important point is that fever is a symptom and not a diagnosis: the source of the fever must be identified, and a surgical cause — a leak or an abscess — must be excluded before settling for pneumonia or a urinary infection.",
      },
      {
        type: "question",
        prompt: "A patient on day seven after an anterior resection has a fever of 38.6 degrees C, a heart rate of 118 and abdominal tenderness. Which complication takes priority?",
        answer: "Anastomotic leak, because it is the surgical complication that is fatal if missed, and the fever, tachycardia and tenderness are its signature. CT imaging with gastrograffin or an unprepared return to theatre may be needed.",
        explanation: "In a post-operative fever the surgical causes must be actively excluded before settling for a medical source, because the mortality of a missed leak is high.",
      },

      { type: "heading", level: 2, text: "The routine" },
      {
        type: "table",
        headers: ["Aspect", "What is done and why"],
        rows: [
          ["Observations", "Vital signs at a decreasing frequency as the patient recovers, with any deviation from the assumed trajectory escalating to a senior review"],
          ["Fluids and feeding", "Fluid balance recorded meticulously; oral intake resumed as soon as the gut function returns, with the intravenous fluid reduced accordingly"],
          ["Analgesia", "A scheduled oral regimen (with the benefit of the WHO analgesic ladder), with extra doses as needed, and a review of any pain that increases"],
          ["Venous thromboembolism prophylaxis", "Given unless contraindicated: the surgery itself produces hypercoagulability and immobility, and the risk period is the first two weeks"],
          ["Mobilisation", "Early sit-out, deep breathing and physiotherapy — reducing the atelectasis, the venous stasis and the ileus"],
          ["Wound, drains and lines", "Inspected daily: the drain output, its character and the line site are the earliest signs of a leak or an infection"],
          ["Medication review", "The patient's usual medications resumed or explicitly withheld, with caution on anticoagulants, antidiabetic drugs, and the drugs that interact with the anaesthetic agents"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The single most important post-operative monitoring is the early detection of bleeding, and the signs that matter most are a rising pulse, a falling urine output, a rising drain output, a falling blood pressure and a persistent metabolic acidosis — not the haemoglobin, which falls late.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Discharging a patient because the wound is dry. A tachycardia of 110 and a falling urine output on the surgical ward is a postoperative haemorrhage until otherwise explained, and discharge is not appropriate.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Stopping the anaesthetic pain relief too soon. Poor analgesia causes shallow breathing, immobility, ileus and atelectasis, and the regular medication should be scheduled rather than waiting for the pain to return.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Using the haemoglobin as the first indicator of a post-operative bleed. The haemoglobin falls only after a delay of hours, and by then the physiology is already late; the heart rate, the urine output, the drain output and the arterial pressure are the early signs.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "When does an anastomotic leak occur and what are the features?",
        answer: "Day five to seven, with fever, a tachycardia, abdominal pain and tenderness, ileus and a change in the drain output, and the diagnosis is confirmed by imaging.",
        explanation: "The leak is one of the commonest serious complications after bowel surgery, and the pattern of fever with a rising pulse in a post-operative patient should always prompt a look at the operation site.",
      },
      {
        type: "question",
        prompt: "What is the most important risk factor for a post-operative venous thromboembolism, and when does the risk end?",
        answer: "The risk is the combination of immobility and the hypercoagulability of the surgery, which continues for up to two weeks (and longer after major pelvic and orthopaedic surgery), with some patients receiving prophylaxis for a month or longer.",
        explanation: "This is why a discharged patient after a hip replacement continues on an anticoagulant for weeks, and why a patient who develops a swollen calf after discharge must be assessed rather than sent home.",
      },
      {
        type: "question",
        prompt: "Which laboured signs worry you most after non-cardiac surgery?",
        answer: "A hypoxaemic, dyspnoeic, tachycardic patient has a pulmonary embolism until proven otherwise, and a collapsed patient with a deviated trachea and absent breath sounds has a tension pneumothorax until decompressed.",
        explanation: "The severity pattern of the differential matters more than its probability, and both of these are fatal unless treated at the moment of diagnosis.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "What is the most likely cause of a fever within the first 24 hours after an abdominal operation?",
        options: ["Wound infection", "Atelectasis", "Urinary tract infection", "Anastomotic leak"],
        correctIndex: 1,
        explanation: "The fever of atelectasis appears within 24 hours because of shallow breathing from pain; pneumonia follows after a couple of days, wound infection at 4 to 7 days, and an anastomotic leak at day 5 to 10.",
      },
      {
        type: "mcq",
        stem: "What is the combination of findings most suggestive of a post-operative haemorrhage?",
        options: [
          "Normal pulse and normal haematology with normal blood pressure",
          "A rising pulse rate with a falling urine output and a rising drain output",
          "Fever with a rising white cell count",
          "Warm peripheries with a bounding pulse",
        ],
        correctIndex: 1,
        explanation: "A rising heart rate, a falling urine output and rising drain output are the earliest signs of both the bleeding and the compensated shock, and a fall in the haemoglobin comes later.",
      },
      {
        type: "mcq",
        stem: "What does a fever of 38.5 degrees C with a heart rate of 110 and a small bowel output at day 7 after a colectomy suggest?",
        options: [
          "Routine post-operative fever", "An anastomotic leak with peritonitis", "Drug fever", "A transfusion reaction",
        ],
        correctIndex: 1,
        explanation: "The combination of fever, tachycardia and a small bowel output at a week is the description of an anastomotic leak, and the mortality of a missed leak makes it the priority of investigation.",
      },
      {
        type: "mcq",
        stem: "Which is the standard duration of post-operative venous thromboembolism prophylaxis after major abdominal surgery?",
        options: [
          "24 hours", "Until discharge only", "At least 7 days, and for a month or longer after pelvic and orthopaedic surgery", "No prophylaxis is required",
        ],
        correctIndex: 2,
        explanation: "Prophylaxis is continued for at least a week after major abdominal surgery, and for a month or longer after pelvic and orthopaedic surgery, with an extension for the higher-risk patient.",
      },
      {
        type: "mcq",
        stem: "What is the purpose of early mobilisation after surgery?",
        options: [
          "To test the wound", "To reduce the risks of atelectasis, venous stasis, ileus and delirium, and to shorten the hospital stay", "To satisfy the discharge criteria", "To increase the drain losses",
        ],
        correctIndex: 1,
        explanation: "Early mobilisation simultaneously addresses the pulmonary, the venous, the gastrointestinal and the cognitive complications of surgery, which is why it is in the post-operative routine.",
      },

      { type: "heading", level: 2, text: "Module summary and next" },
      {
        type: "paragraph",
        text: "Post-operative care is a set of observations interpreted against a trajectory, and complications are the few things that break that trajectory. The causes of fever are constrained by the timing — atelectasis within the first day, pneumonia and urinary infection and line infection in the middle of the week, wound infection and anastomotic leak at the end — and the surgical causes are actively excluded before settling for the medical ones. Haemorrhage is detected by the pulse, the urine output, the drain output and the pressure, and venous thromboembolism prophylaxis and early mobilisation reduce the commonest cause of post-operative death.",
      },
      {
        type: "paragraph",
        text: "Next modules: the gastrointestinal and hepatobiliary, vascular and cardiovascular, urology and orthopaedic specialties, each of which applies the principles of this module to a region and a disease.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// LESSON 7 — Small bowel surgery & abdominal emergencies
// ---------------------------------------------------------------------------
function lesson7() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the causes and the recognition of small bowel obstruction; distinguish a simple from a strangulating obstruction and state what each demands; classify abdominal and inguinal hernias and state their complications; describe the principles of stoma formation, care and the complications of a high-output stoma; and outline the immediate management of a patient with a suspected obstructed bowel.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-6 and ANAT 101 (the abdominal wall and the inguinal canal). A hernia is a defect in the abdominal wall, and an obstruction is a failure of transit, and both are defined by the anatomy they interrupt.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Small bowel obstruction",
        text: "A failure of the transit of small bowel content past a point of obstruction, producing distension, vomiting, colicky pain and, in a strangulating obstruction, the compromise of the blood supply of the bowel wall itself.",
      },
      {
        type: "paragraph",
        text: "The whole assessment of an obstruction is directed at one question: is the bowel strangulated? A simple obstruction is a mechanical problem managed by decompression, resuscitation and, in many cases, an operation; a strangulation is a vascular problem that kills within hours regardless of the fluid and the analgesia. The distinction is made clinically — a constant rather than a colicky pain, fever, tachycardia, peritonitis and a rising lactate — and it is the only question that changes the urgency from hours to minutes.",
      },

      { type: "heading", level: 2, text: "Causes and recognition" },
      {
        type: "table",
        headers: ["Cause", "Frequency and mechanism", "Note"],
        rows: [
          ["Adhesions", "The commonest cause, from previous abdominal surgery, with bands that kink or compress the bowel", "A patient with a scar and colic is obstructed until proven otherwise"],
          ["Incarcerated hernia", "The commonest cause in a patient without a scar", "The hernial orifices are examined in every obstruction"],
          ["Malignancy", "A stricture from a colon or small bowel carcinoma", "A change in bowel habit precedes the obstruction"],
          ["Volvulus", "A twist of a mobile segment — a sigmoid volvulus, or a midgut volvulus in a child", "A closed-loop obstruction with a rapid strangulation"],
          ["Intussusception", "The telescoping of bowel into bowel, commonest in children aged 6 to 18 months", "A sausage-shaped mass and redcurrant stool"],
          ["Gallstone ileus", "An eroding stone that obstructs the terminal ileum", "Air in the biliary tree in an older patient"],
          ["Crohn stricture", "A fibrotic narrowing of diseased small bowel", "Presents after years of known disease"],
        ],
      },
      {
        type: "table",
        headers: ["Feature", "Simple obstruction", "Strangulating obstruction"],
        rows: [
          ["Pain", "Colicky, with pain-free intervals", "Constant, without relief, and worsening"],
          ["Fever and tachycardia", "Late or absent", "Early and progressive"],
          ["Abdomen", "Distended, tender but soft, with bowel sounds", "Peritonitic, with a silent abdomen and rigidity"],
          ["Lactate", "Normal or mildly raised", "Raised, and rising with the ischaemia"],
          ["Management", "Nil by mouth, nasogastric tube, intravenous fluid, and an operation for a proven or a high risk of strangulation", "Immediate resuscitation and laparotomy"],
        ],
      },

      { type: "heading", level: 2, text: "Hernias" },
      {
        type: "table",
        headers: ["Type", "Site and course", "Risk and note"],
        rows: [
          ["Inguinal (indirect)", "Enters the deep ring and travels through the inguinal canal; commonest overall", "The commonest hernia in children and young men; a congenital process"],
          ["Inguinal (direct)", "Bulges through the posterior wall of the canal", "Commonest in older men with a weak abdominal wall"],
          ["Femoral", "Below and lateral to the pubic tubercle, through the femoral canal", "Commonest in women, and the most likely to strangulate because the neck is narrow"],
          ["Umbilical and epigastric", "At the umbilicus or in the linea alba", "Often asymptomatic and small, and they can incarcerate"],
          ["Incisional", "Through a previous operative scar", "Risk factors are the wound risk factors: infection, obesity, tension"],
        ],
      },
      {
        type: "paragraph",
        text: "The complications of a hernia are the reason every hernia is either repaired or explicitly observed: an irreducible (incarcerated) hernia that becomes obstructed, a strangulation with ischaemia and perforation, and rarely, the content of a Richter hernia with only part of the circumference trapped and no bowel obstruction at all. A femoral hernia in a woman is the classic trap: it is small, it lies below the crease, and it strangulates early with little to find.",
      },
      {
        type: "question",
        prompt: "Why is a femoral hernia more likely to strangulate than an indirect inguinal one?",
        answer: "Because the femoral canal is a narrow, rigid opening bounded by the pubic ramus, the femoral vein and the inguinal ligament, and a hernia through it is compressed early and completely rather than distending. The neck is anatomically unforgiving.",
        explanation: "This is why a small lump below the inguinal ligament in a woman is operated on urgently rather than watched.",
      },

      { type: "heading", level: 2, text: "Stomas" },
      {
        type: "table",
        headers: ["Type", "What it is", "Use and consideration"],
        rows: [
          ["End ileostomy", "The divided ileum brought out to the skin", "The commonest temporary stoma; the effluent is liquid and corrosive"],
          ["Loop ileostomy", "A loop of ileum brought out and supported", "Defunctioning an anastomosis, and usually closed within a year"],
          ["End colostomy", "The divided colon brought out", "The end of a resection, or an unresectable obstruction"],
          ["Loop colostomy", "A loop of colon brought out", "Defunctioning a low rectal lesion"],
          ["Urostomy", "An ileal conduit", "A urinary diversion after a cystectomy"],
        ],
      },
      {
        type: "paragraph",
        text: "A high-output stoma (more than 1500 ml per day) produces dehydration, a hyponatraemia, a metabolic acidosis and a magnesium deficiency, and it is managed with fluid and salt replacement, an antimotility agent and a diet that thickens the effluent. The site is marked before the operation, and the appliance is fitted and taught before the discharge, because the appliance management is what the patient lives with.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The nasogastric tube relieves the vomiting and the distension of an obstruction, but it does not treat it: it is an adjunct to the resuscitation, and the place for a tube is debated in the modern literature. The value of the 'drip and suck' regimen is decompression for the drainage, not the treatment.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Not examining the hernial orifices in a patient with abdominal pain or obstruction. A strangulated femoral hernia is a small lump missed by an incomplete examination, and its consequences are fatal.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Assuming the absence of fever excludes a strangulation early. The fever and the tachycardia are later signs than the constant pain, and the lactate rises before the temperature in the first hours.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Operating on every adhesion without a plan. Many adhesive obstructions settle with decompression, and the decision for an operation is based on a strangulation, a failure to settle or a closed loop.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A patient with a previous appendicectomy has 12 hours of vomiting, colicky central abdominal pain, distension and no flatus. What is the immediate management?",
        answer: "Nil by mouth, a nasogastric tube for the decompression, intravenous fluid and electrolytes, analgesia, a plain abdominal radiograph and the blood tests including a lactate, and an assessment for the strangulation, because the likely diagnosis is an adhesive small bowel obstruction.",
        explanation: "The resuscitation is immediate while the decision for surgery is made on the strangulation and the course.",
      },
      {
        type: "question",
        prompt: "What are the features of a strangulating obstruction, and why does it change the urgency?",
        answer: "A constant unrelenting pain, fever, tachycardia, peritonitis, a silent abdomen and a rising lactate. The urgency changes because the ischaemic bowel progresses to perforation and to sepsis within hours, and the operation is not for the obstruction but for the survival of the bowel.",
        explanation: "The management of a simple obstruction is measured in hours because it is mechanical; the management of a strangulation is measured in minutes.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A patient with a previous laparotomy has colicky pain, vomiting and distension. Which is the most likely cause?",
        options: ["Adhesions", "A carcinoma of the colon", "A gallstone ileus", "Intussusception"],
        correctIndex: 0,
        explanation: "Adhesive obstruction is the commonest cause in a patient with an abdominal scar, and it usually presents within the first years after the operation.",
      },
      {
        type: "mcq",
        stem: "Which finding most strongly suggests a strangulating obstruction?",
        options: ["Colicky central pain", "A constant pain with fever, tachycardia and a raised lactate", "Vomiting with a large volume of bile", "Visible peristalsis"],
        correctIndex: 1,
        explanation: "The transition from a colicky to a constant pain, with a systemic response and a rising lactate, indicates the ischaemia of the bowel wall and demands immediate surgery.",
      },
      {
        type: "mcq",
        stem: "Which hernia is most likely to strangulate?",
        options: ["An indirect inguinal hernia", "A femoral hernia", "An umbilical hernia", "An epigastric hernia"],
        correctIndex: 1,
        explanation: "The femoral canal is narrow and rigid, and the hernia is occluded early; a small lump below the inguinal ligament is a femoral hernia until proven otherwise.",
      },
      {
        type: "mcq",
        stem: "A patient with an ileostomy has an output of 2 litres per day, is lethargic and has sodium of 128. What is the management?",
        options: ["Restrict the fluids", "Fluid and salt replacement, an antimotility agent, and check magnesium", "Taper down the stoma", "Close the stoma urgently"],
        correctIndex: 1,
        explanation: "A high-output ileostomy produces dehydration, hyponatraemia and a metabolic acidosis, and the treatment is replacement, with the magnesium checked too.",
      },
      {
        type: "mcq",
        stem: "What is the role of the nasogastric tube in an obstruction?",
        options: ["It cures the obstruction", "It decompresses the stomach and relieves the vomiting while the cause is treated", "It prevents the operation", "It replaces the fluid"],
        correctIndex: 1,
        explanation: "The tube drains the stomach and relieves the vomiting of the obstruction; it does not relieve the obstruction itself, and it is an adjunct to the resuscitation and the definitive treatment.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Small bowel obstruction is a mechanical problem until it becomes a vascular one, and the entire assessment is directed at the strangulation: a constant pain, fever, tachycardia, peritonitis and a rising lactate. The adhesions from previous surgery and the incarcerated hernias are the commonest causes, and the hernial orifices are examined in every obstruction. A stoma is a planned and marked part of the operation, and a high-output stoma needs the salt and the magnesium replaced. The definitive treatment of a simple obstruction is often an operation, and the definitive treatment of a strangulation is immediate surgery.",
      },
      {
        type: "paragraph",
        text: "Next: colorectal surgery, where the resection of the colon and the rectum is planned for a cancer and for its complications.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 8 — Appendicitis & appendicectomy
// ---------------------------------------------------------------------------
function lesson8() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the presentation of acute appendicitis and its variants; apply a scoring system to a possible diagnosis and state the place of imaging; describe the operative approaches and their differences; recognise and manage a complicated appendicitis; and list the differentials of an acute lower abdominal pain in a young adult.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-7. Appendicitis is the commonest acute abdominal surgical emergency, and it is the model for how a clinical diagnosis is made without a single definitive test.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Acute appendicitis",
        text: "Inflammation of the appendix, producing a characteristically migrating central abdominal pain that becomes a right iliac fossa pain with fever, tenderness and anorexia, and progressing to perforation and peritonitis if untreated.",
      },
      {
        type: "paragraph",
        text: "The appendix is a diverticulum of the caecum with a narrow lumen, and its obstruction — by a faecolith or lymphoid hyperplasia — produces a closed loop of mucosa that became inflamed, ischaemic and finally necrotic. The clinical signature follows that physiology: the visceral peritoneum produces the mid-abdominal, poorly localised pain; the parietal peritoneum produces the sharp, localised right iliac fossa pain of established appendicitis; and once the inflammation is contained by the omentum the presentation is a mass rather than peritonitis.",
      },

      { type: "heading", level: 2, text: "The presentation" },
      {
        type: "table",
        headers: ["Feature", "What is found", "Basis"],
        rows: [
          ["Pain", "Central abdominal pain that migrates to the right iliac fossa within hours", "The visceral referral to the mid-abdomen, and the parietal pain once the appendix inflames"],
          ["Anorexia", "An early and universal feature", "The vagal and inflammatory response"],
          ["Tenderness", "Right iliac fossa, maximal at McBurney's point", "Over the site of the inflamed parietal peritoneum"],
          ["Guarding and rebound", "The sign of parietal peritoneum involvement", "The severity of the localised peritonitis"],
          ["Fever", "Low grade, below 38.5 degrees C", "A higher fever suggests perforation"],
          ["Pelvic signs", "Rectal or pelvic tenderness, and urinary frequency", "A pelvic appendix inflames the bladder and the rectum"],
          ["Rovsing sign", "Left iliac fossa pressure producing right-sided pain", "The indirect pressure of the inflated contents"],
          ["Psoas sign", "Pain on extension of the right hip", "A retrocaecal appendix lies on the muscle"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "A high fever, a tachycardia and a generalised peritonitis indicate perforation, and a perforated appendix is a different disease from the classic presentation. The elderly patient, the very young, the pregnant woman and the immunosuppressed all have an atypical presentation and a delayed diagnosis, and the consequences are more severe.",
      },

      { type: "heading", level: 2, text: "Atypical presentations and the diagnosis" },
      {
        type: "table",
        headers: ["Situation", "Why the presentation is altered", "How to manage"],
        rows: [
          ["The elderly", "A reduced inflammatory response and a less specific pain", "A lower threshold for imaging and an operation"],
          ["The child under 5", "A poor ability to localise the pain, a rapid perforation, and a rising peritoneal irritation", "A careful examination and a low threshold for laparoscopy"],
          ["The pregnant woman", "The appendix is displaced upward by the uterus, and the pain is right upper quadrant", "A low threshold for imaging, especially an MRI without the radiation of CT"],
          ["The immunosuppressed", "A blunted immune response and an unclear fever pattern", "An early CT and an early operation"],
        ],
      },
      {
        type: "paragraph",
        text: "The diagnosis is clinical, and the scoring systems (the Alvarado score) combine the features above into a probability. The place of the score is not to make the diagnosis but to decide who needs imaging and admission: a low score with no pain can be discharged, a moderate score needs an ultrasound, and a high score goes to theatre. An ultrasound is the first imaging test in a child and in a pregnant woman, and a CT is used in the adult when the diagnosis is unclear, with the acknowledged radiation risk.",
      },
      {
        type: "question",
        prompt: "When should a scoring system be used in the diagnosis of appendicitis, and what is it not for?",
        answer: "It is used to stratify the need for admission and imaging in a patient with abdominal pain, and not to make the diagnosis or to replace the examination. A high score is an indication for an operation, a low score permits the discharge, and a moderate score is the group for observation or imaging.",
        explanation: "A score that overrides the clinical judgement is used badly, and the negative appendicectomy rate is a quality measure of the whole team rather than of the score.",
      },

      { type: "heading", level: 2, text: "Complicated appendicitis" },
      {
        type: "table",
        headers: ["Stage", "Features", "Management"],
        rows: [
          ["Uncomplicated", "A right iliac fossa pain with a localised tenderness and no mass", "Appendicectomy, laparoscopic or open"],
          ["Phlegmon", "An inflammatory mass without a drainable abscess", "Antibiotics first and an interval appendicectomy later"],
          ["Appendicular abscess", "A walled collection, with fever and a palpable mass", "Percutaneous drainage and antibiotics, then an interval appendicectomy"],
          ["Free perforation", "Generalised peritonitis with a systemic response", "Laparotomy or laparoscopy and peritoneal washout"],
        ],
      },
      {
        type: "paragraph",
        text: "The interval appendicectomy for a phlegmon or an abscess is a debated operation: it removes the risk of a recurrent appendicitis and it treats the incidental pathological concern of a neoplasm in the older patient. The modern practice is to offer it selectively — in a young patient with a resolved phlegmon it is often not needed, and in a patient over forty, in whom a carcinoma or a Crohn appendix may be found, it is usually performed.",
      },

      { type: "heading", level: 2, text: "The operation and its complications" },
      {
        type: "table",
        headers: ["Aspect", "Laparoscopic", "Open"],
        rows: [
          ["Incision", "Three small ports and a camera", "A gridiron or a Lanz incision over McBurney's point"],
          ["Advantage", "A better diagnostic and therapeutic view, less pain, a faster recovery, and a lower wound infection", "No equipment dependency, and it is quicker in the very unstable patient"],
          ["Wound infection", "Less common", "More common"],
          ["Specific risks", "The trocar injury, the carbon dioxide insufflation", "The wound infection and the incisional hernia"],
        ],
      },
      {
        type: "paragraph",
        text: "The complications after an appendicectomy are the specific ones and the general ones: the wound infection, the intra-abdominal abscess (especially after a perforation), the pelvic abscess, the ileus, the stump leak, and the small bowel obstruction from the adhesions. A patient who does not settle by the third day, with fever and pain, has an intra-abdominal collection until a CT says otherwise.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting the gynaecological differential in a young woman. A ruptured ovarian cyst, an ectopic pregnancy, a pelvic inflammatory disease and a torted ovary all present with a lower abdominal pain, and a pregnancy test and an ultrasound are parts of the assessment of any woman with this presentation.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Calling the pelvic pain of a torted ovary gastroenteritis. A torted ovary presents with a sudden severe pain, a mild fever and a normal bowel habit, and the ultrasound shows an enlarged ovary; the delay in diagnosis costs the ovary.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Discharging a young man with a right testicular pain without examining the testes. A testicular torsion presents with a lower abdominal pain and a retracted, exquisitely tender testis, and it is a surgical emergency in which time is testis.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why did the classic presentation of appendicitis produce the 'migrating' pain?",
        answer: "Because the early inflammation produces a visceral pain referred to the mid-abdomen (the same segment as the small bowel), and only when the appendix inflames the adjacent parietal peritoneum does the pain shift to the right iliac fossa. The sequence is the physiology of the two peritoneal layers.",
        explanation: "The migration is the clinical clue to the diagnosis, and it is why the history is the most useful test.",
      },
      {
        type: "question",
        prompt: "What is the place of the interval appendicectomy after a phlegmon?",
        answer: "To treat the recurrence risk and the possibility of a malignancy in an older patient, and it is offered selectively: it is the standard in a patient over 40, in whom a carcinoma of the caecum may be the cause, and it may be omitted in a young adult with a resolved collection.",
        explanation: "The operative decision is based on the risk of a recurrence and on the pathological concern.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which is the characteristic sequence of pain in appendicitis?",
        options: [
          "A right iliac fossa pain from the onset",
          "Central abdominal pain migrating to the right iliac fossa within hours",
          "Left iliac fossa pain radiating to the right groin",
          "Epigastric pain after meals",
        ],
        correctIndex: 1,
        explanation: "The visceral pain is referred to the mid-abdomen, and the parietal pain localises at the right iliac fossa as the appendix inflames; the anorexia follows.",
      },
      {
        type: "mcq",
        stem: "An 8-year-old boy has a right lower abdominal pain, a mild fever and a swollen tender testis. What is the diagnosis?",
        options: ["Appendicitis", "Testicular torsion", "Intussusception", "Mesenteric adenitis"],
        correctIndex: 1,
        explanation: "A torted testis presents as a lower abdominal pain with a retracted, exquisitely tender testis, and it is a surgical emergency in which the time is testis.",
      },
      {
        type: "mcq",
        stem: "What is the imaging of choice in a pregnant woman with a suspected appendicitis?",
        options: ["CT of the abdomen", "Ultrasound first and then magnetic resonance imaging", "Plain radiograph", "No imaging is ever performed"],
        correctIndex: 1,
        explanation: "Ultrasound avoids ionising radiation, and magnetic resonance imaging is used when the ultrasound is inconclusive; CT is reserved for a situation where the diagnosis is unclear and the pregnancy is at risk.",
      },
      {
        type: "mcq",
        stem: "Which is the standard management of an appendicular abscess in a stable patient?",
        options: [
          "Immediate appendicectomy in all cases",
          "Percutaneous drainage with antibiotics and an interval appendicectomy later",
          "Observation only with no follow-up",
          "Prolonged intravenous antibiotics with no drainage",
        ],
        correctIndex: 1,
        explanation: "A walled abscess is drained percutaneously and the patient is treated with antibiotics; an interval appendicectomy is then considered, especially in an older patient.",
      },
      {
        type: "mcq",
        stem: "Why is the wound infection rate lower after a laparoscopic appendicectomy?",
        options: [
          "Because the wound is never touched",
          "Because the appendix is removed through a port and the incision is smaller and less contaminated",
          "Because the laparoscopic approach sterilises the wound",
          "Because no antibiotic is needed",
        ],
        correctIndex: 1,
        explanation: "The laparoscopic approach uses small ports and no large exposed incision, which reduces the wound infection rate; the intra-abdominal abscess rate is similar.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Appendicitis is a clinical diagnosis with a migrating central to right iliac fossa pain, anorexia and fever, and the complications of perforation are recognised by a high fever, tachycardia and a generalised peritonitis. Imaging — ultrasound in a child or a pregnant woman, CT in an adult — is for the equivocal case, and the operation is a laparoscopy or an open appendicectomy. A phlegmon and an abscess are treated with antibiotics and drainage and then considered for an interval appendicectomy, and the patient who does not settle by the third day has an intra-abdominal collection.",
      },
      {
        type: "paragraph",
        text: "Next: colorectal surgery, where the principles of an elective resection are applied to the colonic and rectal disease.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 9 — The acute abdomen & gastrointestinal bleeding
// ---------------------------------------------------------------------------
function lesson9() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: characterise an acute abdominal pain by its onset, site, radiation, character, severity, progression and associated features; name the commonest causes of an acute abdomen by anatomical region and by the surgical pattern; recognise peritonitis, intestinal obstruction, gastrointestinal bleeding and the signs of an ischaemic bowel; state the initial resuscitation and investigations of an acute abdomen; and identify the patients who need immediate surgery from those who are managed conservatively.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-8 and ANAT 101 (abdominal anatomy and referred pain). The acute abdomen is a regional differential, and the pattern of referral follows the embryonic segments.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Acute abdomen",
        text: "An abrupt, or rapidly worsening, abdominal pain of less than about a week's duration, which usually requires an urgent surgical decision and is distinguished by the pattern of the pain rather than by the pain itself.",
      },
      {
        type: "paragraph",
        text: "The acute abdomen is not one disease but a differential made narrow by the pattern of the pain. Visceral pain is dull, midline and poorly localised; parietal (peritoneal) pain is sharp, localised and worsened by movement; referred pain is felt where the nerve supplies the same embryonic segment, so the diaphragmatic irritation of a perforated ulcer is felt at the shoulder. The first task in any acute abdomen is to decide which of the three patterns is present, because the visceral pattern is treated while the parietal pattern is an emergency.",
      },

      { type: "heading", level: 2, text: "The pattern of the pain" },
      {
        type: "table",
        headers: ["Pattern", "Mechanism", "What it means", "Typical example"],
        rows: [
          ["Visceral", "Stretching of the wall of a hollow viscus", "Colicky, poorly localised, midline, with sweating, nausea and restlessness", "Biliary or ureteric colic; small bowel obstruction"],
          ["Parietal (peritoneal)", "Inflammation of the parietal peritoneum", "Sharp, localised, constant, with guarding and rebound; the patient lies still and refuses to move", "Appendicitis, perforated ulcer, diverticulitis"],
          ["Referred", "Shared spinal segment", "Pain felt remote from the source", "Shoulder tip pain from diaphragmatic irritation; loin-to-groin from ureteric colic"],
          ["Other", "Non-abdominal and referred systemic causes", "A pattern that does not localise to one region", "Basal pneumonia, inferior myocardial infarction, diabetic ketoacidosis, porphyria"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The examination that identifies peritonitis has three components, and they are the earliest signs to go. Tenderness with guarding, rigidity of the abdominal wall, and the absence of bowel sounds; the rebound tenderness is the same peritoneal irritation and is cruel to elicit, so it can be inferred from coughing and moving. Early peritonitis is a quiet abdomen with tenderness, not a dramatic one.",
      },

      { type: "heading", level: 2, text: "Causes by the surgical pattern" },
      {
        type: "table",
        headers: ["Pattern", "Diagnoses", "Management"],
        rows: [
          ["Perforation", "Perforated peptic ulcer, perforated diverticulitis, perforated appendix or colon, ruptured ectopic pregnancy", "Resuscitate and urgent laparotomy or percutaneous drainage"],
          ["Obstruction", "Adhesions, strangulated hernia, volvulus, obstructing carcinoma", "Tube decompression, resuscitation, and surgery for strangulation or obstruction"],
          ["Inflammation", "Appendicitis, cholecystitis, pancreatitis, salpingitis, diverticulitis", "Observation, antibiotics, and timed surgery or drainage"],
          ["Ischaemia or rupture", "Ruptured abdominal aneurysm, ischaemic bowel, torsioned ovary", "Immediate surgery; the mortality is high and rises every hour"],
          ["Bleeding", "Peptic ulcer, variceal haemorrhage, diverticular bleeding, angiodysplasia", "Resuscitate, endoscopy, then radiological or surgical control"],
        ],
      },
      {
        type: "paragraph",
        text: "The order of the exceptions matters more than the list. Ruptured aneurysm presents as a sudden onset abdominal and back pain with a pulsatile mass and shock; a mesenteric ischaemia presents with pain that is out of proportion to the examination; an ectopic pregnancy in a woman of childbearing age; and the third-trimester pregnant patient, in whom the physical signs are unreliable and the differential is widened by pregnancy itself.",
      },

      { type: "heading", level: 2, text: "Worked example: the initial assessment" },
      {
        type: "table",
        headers: ["Action", "What it looks for", "Note"],
        rows: [
          ["History", "Onset, character, migration, timing, the factors that worsen and relieve it, associated vomiting and its timing, the last bowel movement and flatus, urinary and gynaecological history, drug history (especially steroids, anticoagulants and non-steroidal anti-inflammatory drugs)", "The history is the most discriminating part of the assessment"],
          ["Examination", "Pulse, blood pressure, temperature, capillary refill; then the abdomen with inspection, palpation, percussion, auscultation; and the hernial orifices, the scars and the renal angles", "The hernial orifices are a part of every abdominal examination, especially in obstruction"],
          ["Observations", "Fever, tachycardia and hypotension indicate sepsis or bleeding", "The early warning chart is the first evidence of deterioration"],
          ["Fluids and analgesia", "Wide-bore intravenous access, resuscitation, venous thromboembolism prophylaxis, and opioids for the pain", "Analgesia does not obscure the examination and is given early; withholding it is an outdated practice"],
          ["Baseline tests", "Full blood count, urea and electrolytes, liver tests, clotting, group and save or cross-match, amylase or lipase, arterial or capillary lactate, pregnancy test in a woman of childbearing age, and an electrocardiogram in an older patient", "Ordered on the basis of the differential, not as a routine"],
          ["Imaging", "Erect chest radiograph for free gas under the diaphragm; ultrasound for biliary and gynaecological causes; CT for the definitive diagnosis in the stable patient", "An unstable patient goes to theatre, not to the scanner"],
        ],
      },
      {
        type: "question",
        prompt: "Why does an erect chest radiograph detect gas free in the abdomen, and when does it fail?",
        answer: "Because the gas rises to the highest point beneath the diaphragm and appears as a dark crescent under the right or left dome. It fails in small perforations and in a patient too ill to sit up, which is why a CT is used if the suspicion remains and the patient is stable enough.",
        explanation: "The sensitivity of the erect film is about 70 per cent, and a negative film does not exclude a perforation in the right patient.",
      },
      {
        type: "question",
        prompt: "Why is it wrong to withhold analgesia from a patient with an acute abdomen?",
        answer: "Because pain relief is a clinical right and because a careful examination is not obscured by analgesia; the studies show that opioids do not mask the findings but relieve distress and allow a more accurate examination.",
        explanation: "A patient who is rolling in pain cannot localise the tenderness, and analgesia improves the examination while relieving genuine suffering.",
      },

      { type: "heading", level: 2, text: "Gastrointestinal bleeding" },
      {
        type: "table",
        headers: ["Presentation", "Source", "Approach"],
        rows: [
          ["Haematemesis or melaena", "Upper gastrointestinal bleeding — peptic ulcer, varices, Mallory-Weiss tear, malignancy", "Resuscitate, risk-score (such as Rockall), early endoscopy within 24 hours, and band or inject the bleeding point"],
          ["Fresh rectal bleeding with clot", "Lower gastrointestinal bleeding — diverticulosis, angiodysplasia, colorectal cancer, ischaemic colitis", "Resuscitate, and use CT angiography or colonoscopy; embolise if the bleeding localises"],
          ["Occult bleeding", "Chronic loss from a colonic or gastric cancer; iron deficiency anaemia", "Upper and lower endoscopy; the cancer is found or the small bowel is investigated"],
        ],
      },
      {
        type: "paragraph",
        text: "The management of a bleed is resuscitation, the restoration of the perfusion and the correction of the coagulopathy, followed by control. The endoscopic treatment of an upper gastrointestinal bleed is injection with adrenaline, thermal coagulation or a mechanical clip, and the proton pump inhibitor is given before and after; in a variceal bleed the first drug is a vasoactive agent such as terlipressin with an antibiotic, and the endoscopy band the varices. Surgery is needed for a bleeding ulcer that endoscopy cannot control, or a recurrent bleed in a fit patient.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "A melaena stool is not always an upper tract bleed, and a patient with anaemia and a positive faecal occult blood test needs the colon examined rather than treated with iron. Iron deficiency anaemia in a man or a postmenopausal woman is a gastrointestinal cancer until excluded by endoscopy.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Calling pain without a diagnosis gastroenteritis. The diagnosis of gastroenteritis requires a prodrome of vomiting and diarrhoea and an absence of peritoneal signs, and dismissing an acute abdomen as a bug is one of the classic ways a perforation is missed.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Not examining the hernial orifices in an obstructed patient. A strangulated inguinal or femoral hernia is an obstruction that is fixed by a simple examination and a small operation, and it is missed when the groin is not looked at.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Sending an unstable patient with a suspected bleeding ulcer to CT. Resuscitate, transfuse and endoscope; a CT is for the stable patient in whom the source is uncertain.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Missing an ectopic pregnancy in a woman of lower abdominal pain. The pregnancy test is part of the assessment of every woman of childbearing age with abdominal pain, and a ruptured ectopic is a lethal haemorrhage.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What are the features that distinguish a strangulated from a simple intestinal obstruction?",
        answer: "A constant pain rather than colic, fever, tachycardia, peritonitis, a raised lactate and a leukocytosis; the bowel becomes ischaemic and, untreated, perforates. A simple obstruction has colic, distension and vomiting with a soft, non-tender abdomen.",
        explanation: "Strangulation changes the urgency from hours to minutes, and the lactate is the biochemical clue to the ischaemia.",
      },
      {
        type: "question",
        prompt: "Why is pancreatitis rarely a surgical problem while a perforated ulcer is?",
        answer: "Because pancreatitis is managed with fluids, analgesia and the treatment of the cause, and the surgery is for the complications (such as a walled-off collection or a necrosis); a perforated ulcer needs the hole closed and the contamination washed out, and the mortality rises with every hour of delay.",
        explanation: "The division is decided by whether the disease can be stopped by conservative means, and if not, how quickly control must be achieved.",
      },
      {
        type: "question",
        prompt: "What is the initial treatment of a patient who has vomited blood and has a pulse of 120 and a blood pressure of 90 systolic?",
        answer: "Resuscitation with oxygen, wide-bore intravenous access, a fluid bolus and blood, correction of the coagulopathy, and urgent endoscopy after the airway is protected; in a variceal patient, a vasoactive drug and antibiotics. The young fit patient compensates until they decompensate.",
        explanation: "The sequence is airway (a patient vomiting blood needs to be able to protect theirs), access, blood, and then the diagnosis and control.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A patient with a sudden severe abdominal pain lies completely still, has a rigid abdomen and absent bowel sounds. What is the diagnosis?",
        options: ["Biliary colic", "Peritonitis, most likely a perforated viscus", "Small bowel obstruction", "Gastroenteritis"],
        correctIndex: 1,
        explanation: "The rigidity and the absolute stillness are parietal peritoneal irritation from a perforation, and it is an emergency laparotomy in a resuscitated patient.",
      },
      {
        type: "mcq",
        stem: "Which finding in an obstructed patient demands immediate surgery?",
        options: ["Distension and vomiting", "A constant pain with fever, tachycardia and a raised lactate", "Colicky pain with visible peristalsis", "A hemoglobin of 9 grams per decilitre"],
        correctIndex: 1,
        explanation: "Constant pain, fever, tachycardia and a raised lactate are the signs of strangulation and ischaemia, which is the surgical emergency of obstruction.",
      },
      {
        type: "mcq",
        stem: "A man of 45 presents with melaena and anaemia. What is the first investigation after resuscitation?",
        options: ["Barium enema", "Upper gastrointestinal endoscopy", "Plain abdominal radiograph", "Laparotomy"],
        correctIndex: 1,
        explanation: "Melaena is an upper tract bleed until proven otherwise, and endoscopy both diagnoses and treats, so it is performed within 24 hours in an admitted patient.",
      },
      {
        type: "mcq",
        stem: "Which investigation is the most useful initial test in a suspected perforated peptic ulcer?",
        options: ["Erect chest radiograph", "Ultrasound of the abdomen", "Serum amylase", "Barium meal"],
        correctIndex: 0,
        explanation: "An erect chest radiograph detects free gas under the diaphragm in most perforations, and it is the quickest test to perform in a patient who may be going to theatre.",
      },
      {
        type: "mcq",
        stem: "Why is a pregnancy test performed in a woman with acute lower abdominal pain?",
        options: [
          "To estimate the gestational age",
          "To exclude an ectopic pregnancy, which is a lethal cause of a haemoperitoneum",
          "To decide the analgesic prescription",
          "To comply with local policy",
        ],
        correctIndex: 1,
        explanation: "A ruptured ectopic pregnancy is a common cause of an acute abdomen in a woman of childbearing age, and the test is quick and free.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The acute abdomen is a pattern, not a name: visceral colic, parietal peritonitis, referred pain and the non-abdominal mimics. Perforation, obstruction, inflammation, ischaemia and bleeding are the surgical patterns, and each has its urgency and its management. The initial assessment is a history, an examination including the hernial orifices, a resuscitation with analgesia, and investigations tailored to the differential. Gastrointestinal bleeding is resuscitation, then control, with the endoscope used for both diagnosis and treatment.",
      },
      {
        type: "paragraph",
        text: "Next: colorectal surgery, where the commonest elective operation in surgery — the resection of a colon cancer — is planned and its risks are managed.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 10 — Colorectal surgery
// ---------------------------------------------------------------------------
function lesson10() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the anatomy and function of the colon relevant to a resection; state the presentation, investigation and staging of colorectal cancer; describe diverticular disease and its complications; describe the surgical management of inflammatory bowel disease; state the principles of bowel preparation, anastomosis and the defunctioning stoma; and recognise the specific complications of colorectal surgery.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-9, ANAT 101 (abdominal and pelvic anatomy) and PATH 201. Colorectal disease is the commonest general surgical practice and its pathology is dominated by two processes: neoplasia and inflammation.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Colorectal cancer",
        text: "A carcinoma, usually of the ascending, descending, sigmoid or rectal colon, arising through the adenoma-carcinoma sequence over ten or more years, presenting with a change in bowel habit, bleeding, anaemia or obstruction, and treated by resection with lymphadenectomy.",
      },
      {
        type: "paragraph",
        text: "Colorectal surgery is the study of one operation: the removal of a segment of bowel with its mesenteric lymphovascular supply, and the restoration of continuity. Every case — a cancer, an inflamed diverticulum, a stricture, a polyp that cannot be removed endoscopically — uses the same set of decisions: how much bowel to take, where to tie the artery, how to join the ends, and whether the join can be protected by a stoma or must be deferred.",
      },

      { type: "heading", level: 2, text: "Colorectal cancer" },
      {
        type: "table",
        headers: ["Aspect", "Content"],
        rows: [
          ["Pathogenesis", "The adenoma-carcinoma sequence: an adenomatous polyp acquires successive mutations — the APC, KRAS, p53 pathway — and becomes invasive over years"],
          ["Presentation", "A change in bowel habit, bleeding per rectum, iron-deficiency anaemia (right-sided lesion), tenesmus and a narrow stool (rectal lesion), weight loss, and obstruction or perforation in a late case"],
          ["Investigation", "Colonoscopy with biopsy, which is the diagnostic test and also maps synchronous lesions; and CT of the chest, abdomen and pelvis for staging"],
          ["Staging", "A CT for the metastasis and the local extent; an MRI for the rectal tumour and the mesorectal fascia; endoanal ultrasound for an early rectal tumour"],
          ["Treatment", "Surgical resection with a lymphadenectomy, and pre-operative chemoradiotherapy for the locally advanced rectal cancer before surgery"],
          ["Adjuvant", "Chemotherapy for a node-positive or a metastatic colon cancer; and the palliative approach for a late or unfit patient"],
          ["Surveillance", "Colonoscopy, tumour markers and CT at intervals, because a metachronous tumour and a recurrence are both looked for"],
        ],
      },
      {
        type: "paragraph",
        text: "The sigmoid colon cancers usually bleed or obstruct, and the ascending colon cancers present late with anaemia and weight loss because the lumen is wide and the content is liquid. This difference is the reason for a different presentation and for a different urgency, and it is the reason that an iron-deficiency anaemia is a colonoscopy and not a prescription for iron.",
      },

      { type: "heading", level: 2, text: "Worked example: a right hemicolectomy for an ascending colon cancer" },
      {
        type: "table",
        headers: ["Step", "What is done and why"],
        rows: [
          ["Preparation", "Mechanical bowel preparation is now selective; the laparoscopic approach allows a smaller incision and a faster recovery"],
          ["Vessels", "The ileocolic artery is ligated at its origin, so the mesentery and the lymph nodes of the ascending colon are removed with the specimen"],
          ["Resection", "The terminal ileum and the right colon to the mid transverse colon are resected with a clear margin"],
          ["Anastomosis", "A side-to-side or end-to-side anastomosis of the ileum to the transverse colon, using the fact that the ileum is adaptable"],
          ["Principles", "No tension, a good blood supply, no distal obstruction, and a well-perfused proximal end — these are the conditions that prevent an anastomotic leak"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The three principles of anastomotic integrity are the same one: good blood supply, no tension, and no distal obstruction. Where the risk is high — a low rectal anastomosis, a septic or an immunosuppressed patient, a frail patient with a low reserve — a defunctioning stoma is created above the join so that a leak does not become a faecal peritonitis.",
      },

      { type: "heading", level: 2, text: "Diverticular disease" },
      {
        type: "table",
        headers: ["Stage", "Features", "Management"],
        rows: [
          ["Diverticulosis", "Sigmoid pouches, asymptomatic, present in most older adults", "A high-fibre diet and the reduction of the risk factors"],
          ["Acute diverticulitis", "Left iliac fossa pain, fever, constipation; CT shows the pericolic fat stranding", "Antibiotics in the uncomplicated case, a liquid diet, and follow-up"],
          ["Complicated (abscess)", "A pericolic or pelvic abscess with a spiking fever and a raised white cell count", "Percutaneous drainage and antibiotics; surgery if it fails"],
          ["Complicated (perforation)", "Faecal peritonitis, peritonism, shock", "A Hartmann or a resection with a stoma; the immediate priority is control"],
          ["Stricture or fistula", "Obstruction, or a colovesical fistula with faecal urinary infection", "Elective resection in a fit patient"],
        ],
      },
      {
        type: "paragraph",
        text: "The distinction between a simple and a complicated diverticulitis is made by CT, and it is the distinction that decides whether an operation is urgent or elective. The Hinchey classification describes the degree of the perforation, from a pericolic abscess (I) to generalised faecal peritonitis (IV), and the Hartmann resection — the sigmoid colectomy with an end colostomy and a closed rectal stump — is the operation for the unstable or the heavily contaminated patient.",
      },

      { type: "heading", level: 2, text: "Inflammatory bowel disease" },
      {
        type: "table",
        headers: ["Condition", "Pattern", "Surgical role"],
        rows: [
          ["Crohn disease", "Transmural, discontinuous, anywhere from mouth to anus, with strictures, abscesses and fistulae", "Resection of a complicated segment; conservative management of uncomplicated disease; a strictureplasty to preserve the small bowel"],
          ["Ulcerative colitis", "Mucosal, continuous from the rectum backwards, confined to the colon", "A colectomy for a fulminating colitis, a perforation, a toxic megacolon, a dysplasia or a cancer, or for the patient with a chronic course"],
          ["Post-operative", "The pouch is a common later problem", "Proctocolectomy with an ileal pouch-anal anastomosis, or a terminal ileostomy if the sphincter is poor"],
        ],
      },
      {
        type: "paragraph",
        text: "The surgical management of inflammatory bowel disease is the management of the complications rather than of the disease: a fulminating colitis that fails medical therapy is treated by a colectomy; a toxic megacolon is a surgical emergency; a Crohn stricture is bypassed rather than resected where it is possible; and a dysplasia or cancer in ulcerative colitis mandates surgery. The difference between ulcerative colitis and Crohn decides the operation: ulcerative colitis is cured by removing the colon and rectum, Crohn cannot be cured by an operation.",
      },

      { type: "heading", level: 2, text: "Stomas" },
      {
        type: "table",
        headers: ["Stoma", "What it is", "Indication"],
        rows: [
          ["Endicolostomy", "The divided colon brought out to the skin", "A Hartmann, or an end of a resection where the distal part is closed"],
          ["Loop colostomy", "A loop of colon supported on a rod, with a bridge that can be closed later", "To defunction a distal anastomosis or a low rectal tumour"],
          ["End ileostomy", "The divided ileum brought to the skin", "A proctocolectomy, or a functional end of an ileal pouch"],
          ["Loop ileostomy", "A temporary loop, often closed after 6 to 12 weeks", "To defunction a low rectal anastomosis"],
        ],
      },
      {
        type: "paragraph",
        text: "The stoma is planned before the operation — its site is marked by the stoma nurse through the rectus sheath, away from a crease, and within the patient's reach — and the high-output stoma is a cause of dehydration and electrolyte disturbance that must be recognised and treated with fluid and salt replacement. The complications are ischaemia, retraction, prolapse, parastomal hernia and skin breakdown.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Treating iron deficiency anaemia in an older patient with iron and no colonoscopy. A right-sided colon cancer presents with anaemia, and the test that finds it is a colonoscopy.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating every episode of diverticulitis as an emergency. The uncomplicated episode is treated with antibiotics and a liquid diet in a stable patient, and the CT is done to distinguish it from a complicated episode that needs drainage or an operation.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the rectum is part of the colon. The rectum has a different blood supply and a different lymphatic drainage, and its operation (the total mesorectal excision) removes the whole mesorectum with the tumour, because the local recurrence is a lymphatic failure.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Closing a defunctioning stoma without checking the distal anastomosis. The distal anastomosis must be shown to be intact by contrast study or endoscopy before the stoma is reversed.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What is the difference between a right and a left colon cancer in its presentation, and why?",
        answer: "The right-sided cancer presents with anaemia, weight loss and a mass, because the lumen is wide and the content is liquid so it obstructs late; the left-sided cancer presents with a change in bowel habit, bleeding and obstruction, because the lumen is narrower and the content is solid.",
        explanation: "This is the reason an iron deficiency anaemia is the indication for a colonoscopy, and the reason obstruction is commoner on the left side.",
      },
      {
        type: "question",
        prompt: "When is a defunctioning stoma created above a colorectal anastomosis?",
        answer: "When the risk of an anastomotic leak is high — a low rectal join, a patient on steroids or immunosuppression, pelvic sepsis, malnutrition, or a fit patient with a low reserve — because a leak with a stoma is a contained surgical event rather than a fatal faecal peritonitis.",
        explanation: "The stoma does not prevent a leak; it changes the consequence of one, and it is closed later.",
      },
      {
        type: "question",
        prompt: "Why is a colectomy curative in ulcerative colitis but not in Crohn disease?",
        answer: "Because ulcerative colitis is confined to the colon and the rectum and is mucosal, so removing the colon and rectum removes the disease; Crohn disease is transmural and may affect any part of the bowel, and operation does not remove a disease that recurs anywhere.",
        explanation: "The distinction is also why the operation in Crohn is reserved for the complications (obstruction, abscess, fistula) rather than for the diagnosis.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which feature is the most suggestive of a right-sided colon cancer?",
        options: ["Fresh rectal bleeding", "Iron deficiency anaemia and a mass", "Tenesmus", "A narrow ribbon stool"],
        correctIndex: 1,
        explanation: "A right-sided lesion bleeds slowly and obstructs late, so it presents with anaemia and weight loss; tenesmus and a ribbon stool are the signs of a rectal lesion.",
      },
      {
        type: "mcq",
        stem: "A patient has a left iliac fossa pain with fever and constipation, and a CT shows pericolic fat stranding with no abscess. What is the management?",
        options: ["Immediate laparotomy", "Antibiotics and a liquid diet, with a follow-up", "Percutaneous drainage", "No treatment"],
        correctIndex: 1,
        explanation: "Uncomplicated acute diverticulitis is treated with antibiotics and a liquid diet; abscesses are drained, and surgery is for the complicated or the recurrent case.",
      },
      {
        type: "mcq",
        stem: "Which is the standard operation for a mid-rectal cancer?",
        options: ["A right hemicolectomy", "An anterior resection with a total mesorectal excision", "A colostomy", "A local excision"],
        correctIndex: 1,
        explanation: "A mid-rectal cancer is treated by an anterior resection of the upper rectum, and the total mesorectal excision removes the mesorectum as the lymphatic unit to reduce the local recurrence.",
      },
      {
        type: "mcq",
        stem: "Why is the total mesorectal excision performed for a rectal cancer?",
        options: [
          "It removes the tumour margin only",
          "It removes the lymphatic tissue of the mesorectum, where the local recurrence occurs",
          "It reduces the blood loss",
          "It preserves the anal sphincter",
        ],
        correctIndex: 1,
        explanation: "The mesorectum contains the lymphatics of the rectal drainage, and the local recurrence is a lymphatic failure, so the whole mesorectum is excised with the rectum.",
      },
      {
        type: "mcq",
        stem: "What is the role of a defunctioning stoma above a low rectal anastomosis?",
        options: [
          "It prevents the need for a second operation",
          "It converts the consequence of a leak into a contained surgical event rather than a faecal peritonitis",
          "It improves the chance of a leak-free healing",
          "It replaces the need for a good blood supply",
        ],
        correctIndex: 1,
        explanation: "The stoma diverts the faecal stream while the anastomosis heals; a leak behind a stoma is contained, and the stoma is closed after 6 to 12 weeks once a contrast study confirms healing.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Colorectal surgery is the management of the colon and the rectum as one continuous lumen with two pathological processes — neoplasia and inflammation. Colorectal cancer is resected with its lymphovascular supply and staged radiologically; the rectal cancer needs a total mesorectal excision and often pre-operative chemoradiotherapy. Diverticulitis is uncomplicated or complicated, and CT is the test that makes the distinction. Inflammatory bowel disease is treated medically, and surgery is for the complications: a colectomy for a fulminating ulcerative colitis, and a segmental resection or a strictureplasty for Crohn. The stoma is planned before the operation, and the anastomosis is protected where the risk of a leak is high.",
      },
      {
        type: "paragraph",
        text: "Next: hepatobiliary and pancreatic surgery, where the same principles are applied to the liver, the gallbladder and the biliary tree.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 11 — Hepatobiliary & pancreatic surgery
// ---------------------------------------------------------------------------
function lesson11() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the features of obstructive, hepatocellular and haemolytic jaundice and name the investigations that distinguish them; state the causes, presentation and complications of gallstone disease; apply the Tokyo guidelines to acute cholangitis and to acute cholecystitis; describe the presentation and management of acute and chronic pancreatitis and of pancreatic cancer; and name the principles of liver resection and of the management of the complications of biliary surgery.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-10, PATH 201 and PHRM 202. Hepatobiliary disease is a study of obstruction and infection, and its consequences are a model of how a duct changes the function of an organ.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Jaundice",
        text: "A yellow discolouration of the sclerae, the skin and the mucosa produced by a serum bilirubin above about 35 micromoles per litre, divided into pre-hepatic (haemolytic), hepatocellular and obstructive (cholestatic) by the pattern of the liver tests.",
      },
      {
        type: "paragraph",
        text: "The surgical question in a jaundiced patient is whether the bile duct is obstructed, because obstruction is the one cause that can be relieved by an intervention. The pattern of the liver tests separates the groups: an isolated raised unconjugated bilirubin is haemolysis, a predominantly raised transaminase is hepatocellular, and a raised alkaline phosphatase with a conjugated bilirubin is cholestasis. The next step in a cholestatic patient is to see the duct, with an ultrasound first and then magnetic resonance or an endoscopic retrograde cholangiopancreatography.",
      },

      { type: "heading", level: 2, text: "Distinguishing the groups" },
      {
        type: "table",
        headers: ["Group", "Mechanism", "Pattern", "Causes", "Treatment"],
        rows: [
          ["Pre-hepatic (haemolytic)", "Increased bilirubin production", "Unconjugated rise, reticulocytosis and a raised lactate dehydrogenase", "Sickle cell, thalassaemia, auto-immune haemolysis, transfusion reaction", "Treat the haemolysis; the jaundice is mild"],
          ["Hepatocellular", "Failure of the hepatocyte to conjugate and excrete", "A raised transaminase, with a mixed conjugated and unconjugated picture", "Viral hepatitis, alcohol, drugs, cirrhosis", "Supportive care; treat the cause; assess for a transplant"],
          ["Obstructive (cholestatic)", "A block to the flow of bile", "A raised conjugated bilirubin and alkaline phosphatase, with dark urine and pale stool", "Choledocholithiasis, a pancreatic or a biliary cancer, a stricture, cholangiocarcinoma", "Relieve the blockage: endoscopy, stone removal, biliary drainage or resection"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The two specific features of obstructive jaundice are dark urine (the renal excretion of the conjugated bilirubin, which is water soluble) and pale stools (the absence of the bilirubin reaching the duodenum), and a palpable gallbladder in a jaundiced patient suggests a malignant rather than a stone obstruction, because the gallbladder is not diseased and can distend (Courvoisier's law).",
      },

      { type: "heading", level: 2, text: "Gallstone disease" },
      {
        type: "table",
        headers: ["Condition", "Presentation", "Treatment"],
        rows: [
          ["Biliary colic", "Right upper quadrant pain, constant for four to six hours after a fatty meal, with nausea and vomiting, no fever and a negative Murphy", "Analgesia, then an elective laparoscopic cholecystectomy, the definitive treatment"],
          ["Acute cholecystitis", "Right upper quadrant pain with fever, leukocytosis, and a positive Murphy; the ultrasound shows wall thickening and pericholecystic fluid", "Nil by mouth, intravenous antibiotics, analgesia, and a laparoscopic cholecystectomy — early (within a week) rather than delayed"],
          ["Chronic cholecystitis", "Recurrent attacks, a contracted gallbladder on ultrasound", "Elective laparoscopic cholecystectomy"],
          ["Choledocholithiasis", "Jaundice, abnormal liver tests, dilated ducts, a raised bilirubin with a sometimes raised amylase", "Endoscopic retrograde cholangiopancreatography with sphincterotomy and stone extraction, then cholecystectomy"],
          ["Gallstone ileus", "Small bowel obstruction in an older patient with air in the biliary tree", "Removal of the stone (enterolithotomy), usually without the gallbladder surgery"],
        ],
      },
      {
        type: "paragraph",
        text: "The distinction between biliary colic and cholecystitis is the duration and the temperature: colic is a pain that passes, cholecystitis is a pain that persists with fever and a raised white cell count. The timing of the surgery matters: an early laparoscopic cholecystectomy in the same admission, at about 72 hours, is safer than a delayed operation after 6 weeks, because the latter leaves a group of patients waiting to have another attack or a complication.",
      },
      {
        type: "question",
        prompt: "Why is the laparoscopic cholecystectomy usually performed early rather than delayed after a bout of acute cholecystitis?",
        answer: "Because the early operation is technically easier before the inflammation has become dense adhesions, and because about one in five patients waiting for a delayed operation returns with a further attack or a complication. The early operation has a lower conversion rate and a shorter overall stay.",
        explanation: "This is the lesson of a trial that changed the practice, and it is the commonest elective biliary operation.",
      },

      { type: "heading", level: 2, text: "Cholangitis and pancreatitis" },
      {
        type: "table",
        headers: ["Condition", "Diagnosis", "Immediate treatment"],
        rows: [
          ["Acute cholangitis", "Charcot: fever, jaundice and right upper quadrant pain; Reynolds (with confusion and hypotension) means a severe attack", "Resuscitation, intravenous antibiotics, and endoscopic biliary drainage within 24 to 48 hours — the definitive treatment"],
          ["Acute pancreatitis", "A severe epigastric pain radiating to the back, a raised lipase or amylase above three times normal, and the imaging features", "Fluids, analgesia, oxygen, no early feeding in the severe case; intervention for the necrosis or the pseudocyst later"],
          ["Chronic pancreatitis", "Chronic epigastric pain, steatorrhoea, diabetes, calcification", "Pain control, pancreatic enzyme replacement, and drainage for the obstruction or the pseudocyst"],
          ["Pancreatic cancer", "Painless jaundice with weight loss and a dilated duct, or an epigastric mass with a late diagnosis", "CT staging, then a Whipple resection for a resectable head tumour, or biliary drainage and palliation"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The severity of acute pancreatitis is judged by the organ failure, and the persistent organ failure that does not settle within 48 hours defines severe pancreatitis with a mortality of 20 to 30 per cent. The patient needs early fluids, careful monitoring and a multidisciplinary review, and the intervention is delayed until the necrosis has walled off.",
      },
      {
        type: "question",
        prompt: "Why does the treatment of a gallstone that has obstructed the bile duct precede the treatment of the gallbladder?",
        answer: "Because the infection of the obstructed duct is the life-threatening problem (cholangitis), and it is relieved endoscopically by sphincterotomy and stone extraction; the gallbladder is then removed to prevent the stone recurring. Doing the gallbladder first leaves the obstruction untreated.",
        explanation: "The principle is to relieve the emergency first, then prevent the recurrence — the sequence also allows the inflammation to settle before an operation.",
      },

      { type: "heading", level: 2, text: "Liver and biliary tumours" },
      {
        type: "table",
        headers: ["Tumour", "Features", "Management"],
        rows: [
          ["Hepatocellular carcinoma", "In a cirrhotic liver, a raised alpha-fetoprotein, a vascular lesion on imaging", "Resection if the liver reserve allows, ablation, a transplant within the criteria, or palliative treatment"],
          ["Colorectal liver metastasis", "A synchronous liver lesion in a colorectal cancer", "Resection of both if the future liver remnant is enough, often after chemotherapy"],
          ["Cholangiocarcinoma", "A hilar or an intrahepatic tumour presenting with obstructive jaundice", "Resection where possible; otherwise biliary drainage"],
          ["Gallbladder cancer", "Found incidentally at cholecystectomy, or a late presentation", "Re-resection for an early tumour; the prognosis of a late tumour is poor"],
        ],
      },
      {
        type: "paragraph",
        text: "The essential limitation of liver surgery is the future liver remnant: the resection must leave enough functioning liver, and the volume and the function of the remnant are calculated before the operation. A resection that removes more than about 70 per cent is unsafe, which is why the liver is prepared by embolisation or hypertrophy in some patients. The postoperative bleed and the bile leak are the specific complications.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Operating on a jaundiced patient without first defining the obstruction. The first step is to look at the duct, not to cut: an ultrasound defines the dilation and the cause, and the obstruction can then be relieved endoscopically or percutaneously.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Waiting for a transaminase to rise before suspecting a bile duct injury after a cholecystectomy. A bile leak presents in the first days with a bile in a drain, a rising bilirubin and a painful, distended abdomen; and an injured duct presents with early jaundice. Both are investigated by magnetic resonance cholangiopancreatography, and the repair is by a hepatobiliary specialist.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Assuming a palpable gallbladder in a jaundiced patient means a stone. The gallbladder that is distended in a jaundiced patient is usually the consequence of a malignant obstruction, because a gallbladder that is chronically diseased with stones cannot distend (Courvoisier's law).",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Which investigation is the first in a jaundiced patient, and what is it looking for?",
        answer: "An ultrasound, to look for a dilated duct and a gallstone, and for a pancreatic or a biliary mass. If the duct is dilated, the next step is a magnetic resonance cholangiopancreatography or an endoscopic retrograde cholangiopancreatography.",
        explanation: "The ultrasound is safe, portable and immediate, and it answers the surgical question of whether the duct is blocked.",
      },
      {
        type: "question",
        prompt: "Why is the early fluid resuscitation central to the management of severe pancreatitis?",
        answer: "Because the capillary leak produces a large third-space loss and haemoconcentration, which reduces the pancreatic perfusion and worsens the necrosis. The early and adequate fluid replacement is the intervention with the clearest evidence of benefit, at about 5 to 10 ml per kilogram per hour initially.",
        explanation: "The late intervention of the necrotic collection is separate from the early management of the physiology.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A patient with painless jaundice, weight loss and a palpable gallbladder. Which is the most likely diagnosis?",
        options: ["Choledocholithiasis", "A carcinoma of the head of the pancreas", "Acute cholecystitis", "Haemolysis"],
        correctIndex: 1,
        explanation: "A painless progressive jaundice with a palpable gallbladder suggests a malignant obstruction, because a chronically diseased gallbladder cannot distend.",
      },
      {
        type: "mcq",
        stem: "A patient has fever, jaundice, right upper quadrant pain and confusion. What is the definitive treatment?",
        options: ["Antibiotics and observation", "Endoscopic biliary drainage, after antibiotics and resuscitation", "Immediate cholecystectomy", "Percutaneous cholecystostomy"],
        correctIndex: 1,
        explanation: "This is acute cholangitis (Charcot with the added Reynolds signs of confusion and hypotension), and the obstruction must be relieved by endoscopic drainage within 24 to 48 hours.",
      },
      {
        type: "mcq",
        stem: "What is the timing of the surgery in a laparoscopic cholecystectomy for acute cholecystitis?",
        options: ["Within a week of the onset, at about 72 hours", "After 6 to 8 weeks of antibiotics", "Only if the pain recurs", "Immediately on arrival to the emergency department"],
        correctIndex: 0,
        explanation: "Early cholecystectomy in the same admission is favoured, because the inflammation is easier and the waiting patients return with complications.",
      },
      {
        type: "mcq",
        stem: "Which is the main determinant of whether a liver resection is safe?",
        options: ["The size of the tumour", "The volume and function of the future liver remnant", "The type of incision", "The speed of the surgery"],
        correctIndex: 1,
        explanation: "The patient must be left with enough functioning liver, so the future remnant is measured and, where necessary, hypertrophied before the resection.",
      },
      {
        type: "mcq",
        stem: "What is the earliest sign of a bile leak after a cholecystectomy?",
        options: ["Fever on day three", "Bile in a drain with a rising bilirubin and a tender abdomen", "Jaundice at a week", "A palpable mass"],
        correctIndex: 1,
        explanation: "A bile in the drain, a rising bilirubin and a painful distended abdomen in the first few days are the signs of a bile leak, which is investigated by magnetic resonance cholangiopancreatography.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The jaundiced patient is first asked whether the duct is obstructed, and the obstruction is defined by ultrasound and relieved endoscopically or radiologically. Gallstone disease is a spectrum from colic to cholecystitis to cholangitis, and the operation is timed by the severity and the complications. Cholangitis is relieved by drainage; pancreatitis is resuscitated with early fluid and intervened late. Liver resection is limited by the function of the remnant, and the biliary injury or the bile leak is the specific complication of a cholecystectomy that must be recognised early.",
      },
      {
        type: "paragraph",
        text: "Next: trauma, where the principles of the module are applied at speed and in a fixed order.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 12 — Vascular assessment & acute limb ischaemia
// ---------------------------------------------------------------------------
function lesson12() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: take a vascular history and perform a vascular examination; interpret an ankle-brachial index and a duplex result; distinguish acute from chronic limb ischaemia; recognise the six Ps of acute limb ischaemia; state the management of an acutely ischaemic limb; and recognise the immediately life-threatening vascular emergencies.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-11 and PHYS 101 (cardiovascular physiology). Vascular disease is a disorder of flow and of the wall, and the measurements are of both.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Acute limb ischaemia",
        text: "The sudden interruption of the arterial blood supply of a limb, producing the six Ps of pain, pallor, pulselessness, paraesthesia, paralysis and perishing cold, and threatening the limb within hours unless the flow is restored.",
      },
      {
        type: "paragraph",
        text: "The limb threatened by ischaemia is the commonest vascular emergency, and the determinant of survival is the time: a limb that is viable can be salvaged by an embolectomy or a thrombolysis, a limb that is threatened has hours of sensory and then motor loss, and an irreversible limb needs an amputation. The vascular examination is the first act, and its findings — the pulses, the temperature, the sensation, the motor function and the capillary refill — decide which of these situations is present.",
      },

      { type: "heading", level: 2, text: "The vascular examination" },
      {
        type: "table",
        headers: ["Step", "What is done", "What it answers"],
        rows: [
          ["History", "The claudication distance, the rest pain, the tissue loss, the risk factors, the previous operations and the exercise", "Whether the disease is chronic or acute, and what the limb is used for"],
          ["Inspection", "The colour, the temperature, the hair, the trophic changes and the ulceration", "The severity of the perfusion deficit"],
          ["Palpation", "The femoral, popliteal, dorsal pedis and posterior tibial pulses, compared with the other limb", "The level of obstruction, and whether the pulses are absent"],
          ["Auscultation", "The bruits over the carotid, the aorta, the femoral and the renal vessels", "The turbulence that suggests a stenosis"],
          ["Buerger test", "The elevation pallor and the dependency rubor", "Whether a chronically ischaemic limb is present"],
          ["The pulses of all four limbs", "The subclavian, the axillary and the brachial pulses and the blood pressures", "The subclavian steal and the aortic disease"],
        ],
      },
      {
        type: "question",
        prompt: "What is an ankle-brachial index, and what does a value of 0.5 mean?",
        answer: "It is the ratio of the systolic pressure at the ankle (the dorsalis pedis or the posterior tibial) to the systolic pressure at the brachial artery. A value of 0.5 means the ankle pressure is half the brachial, which indicates a moderate to severe arterial obstruction in the leg, and a value below 0.5 corresponds to rest pain and tissue loss.",
        explanation: "The index is a screening and monitoring tool; it is falsely elevated in a diabetic or a calcified vessel, and a value above 1.3 is a reason to measure the toe pressures.",
      },

      { type: "heading", level: 2, text: "The six Ps and their grading" },
      {
        type: "table",
        headers: ["Finding", "Meaning", "Urgency"],
        rows: [
          ["Pain", "The first and the commonest symptom of an occluded limb", "Immediate assessment"],
          ["Pallor", "The empty artery and the emptied capillary bed", "Immediate assessment"],
          ["Pulselessness", "The absence of the distal pulses compared with the other side", "Immediate assessment"],
          ["Paraesthesia", "The sensory nerves are affected before the motor", "The limb is threatened, and the hours have begun"],
          ["Paralysis", "The motor nerves and the muscles are ischaemic", "The limb is severely threatened or irreversible"],
          ["Perishing cold", "The temperature falls below that of the environment", "Confirms the interruption of the flow"],
        ],
      },
      {
        type: "paragraph",
        text: "The distinction between an embolic and a thrombotic occlusion is made by the history and by the examination, and it changes the treatment. An embolic occlusion has a sudden onset, no previous symptoms, a normal contralateral limb and a source (commonly the atrial fibrillation), and it is treated by an embolectomy. A thrombotic occlusion has a preceding claudication, an abnormal contralateral limb and often a known peripheral arterial disease, and it is treated by a bypass or a thrombolysis.",
      },
      {
        type: "table",
        headers: ["Feature", "Embolic", "Thrombotic"],
        rows: [
          ["Onset", "Sudden, in seconds, with a recallable moment", "Gradual, over hours to days"],
          ["Previous symptoms", "None, or unrelated", "Claudication or rest pain"],
          ["Contralateral limb", "Normal pulses", "Reduced pulses and bruits"],
          ["Source", "Atrial fibrillation, a recent myocardial infarction, an aneurysm, a paradoxical embolus", "A stenosis in the atheromatous disease"],
          ["Treatment", "Embolectomy, or a thrombolysis in a viable limb", "Bypass, angioplasty or a thrombolysis"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The two immediate exceptions in the vascular patient are a ruptured abdominal aortic aneurysm and a dissecting thoracic aneurysm, both of which present with a sudden severe pain and shock, and both of which are lethal within hours. A patient with a sudden abdominal and back pain and a pulsatile mass is a ruptured aneurysm, and the treatment is an immediate operation, not a scan.",
      },

      { type: "heading", level: 2, text: "The immediately life-threatening vascular emergencies" },
      {
        type: "table",
        headers: ["Emergency", "Presentation", "Initial management"],
        rows: [
          ["Ruptured abdominal aneurysm", "A sudden abdominal and back pain with a pulsatile mass and shock", "Resuscitation and an immediate operation or an endovascular repair"],
          ["Aortic dissection", "A tearing interscapular or chest pain, with a blood pressure difference between the arms", "Control the heart rate and the blood pressure, and an urgent scan and repair"],
          ["Acute limb ischaemia", "The six Ps with a source", "Heparin, and an embolectomy or a thrombolysis depending on the limb"],
          ["Ruptured thoracic aneurysm", "A chest or back pain with shock", "Emergency repair"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Sending a patient with a threatened limb to thrombolysis when the limb has no motor function. Thrombolysis takes hours to work, and a limb with paralysis needs the surgical restoration of the flow now, or an amputation.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Missing an aneurysm because the abdomen is not palpated. An abdominal aortic aneurysm is a pulsatile mass above the umbilicus, and it is discovered by the hand that palpates, not by the scan.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Interpreting a normal ankle-brachial index as an absence of disease in a diabetic patient. The calcified vessels give a falsely elevated index, and the toe pressures and the waveforms are used instead.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Which features of an acutely ischaemic limb mean it is no longer salvageable?",
        answer: "The paralysis and the fixed mottling of the limb with a complete sensory loss, because these indicate the death of the muscle and the nerves, and the reperfusion of such a limb produces a systemic release of potassium, myoglobin and acid that is lethal.",
        explanation: "The distinction determines whether the treatment is an embolectomy or an amputation, and the irreversible limb is not perfused.",
      },
      {
        type: "question",
        prompt: "What is the initial medical treatment of an acutely ischaemic limb, and why?",
        answer: "Intravenous heparin, to prevent the propagation of the thrombus and the distal microvascular thrombosis while the definitive restoration of the flow is arranged. It buys time and protects the distal bed.",
        explanation: "The anticoagulation is the bridge to the embolectomy, the bypass or the thrombolysis.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A patient with atrial fibrillation has a sudden cold, pale, pulseless leg with paraesthesia but motor power. What is the diagnosis?",
        options: ["Chronic limb ischaemia", "An embolic acute limb ischaemia", "Deep vein thrombosis", "Cellulitis"],
        correctIndex: 1,
        explanation: "The sudden onset in a fibrillating patient is an embolus, and the limb is threatened but viable, and the treatment is heparin and an embolectomy.",
      },
      {
        type: "mcq",
        stem: "Which is the most reliable sign that an acutely ischaemic limb has passed the point of salvage?",
        options: ["Pain", "Pallor", "Paralysis with fixed mottling and a complete sensory loss", "Pulselessness"],
        correctIndex: 2,
        explanation: "Paralysis, fixed mottling and anaesthesia indicate the death of the muscle and the nerve, and the limb is not salvageable; reperfusion would be lethal.",
      },
      {
        type: "mcq",
        stem: "What does an ankle-brachial index below 0.5 indicate?",
        options: ["Normal arteries", "Rest pain and tissue loss from a severe arterial disease", "A venous disease", "A diabetic foot"],
        correctIndex: 1,
        explanation: "An index below 0.5 corresponds to rest pain and tissue loss; an index of 0.5 to 0.8 indicates a claudication, and above 1.3 is falsely elevated by a calcified vessel.",
      },
      {
        type: "mcq",
        stem: "What is the initial management of a ruptured abdominal aortic aneurysm?",
        options: ["CT scan", "Resuscitation and an immediate operation or an endovascular repair", "Angiography", "Thrombolysis"],
        correctIndex: 1,
        explanation: "A ruptured aneurysm is lethal within hours, and the treatment is an immediate operation or an endovascular repair after a minimal resuscitation; the scan is for a stable patient.",
      },
      {
        type: "mcq",
        stem: "Which is the usual difference in the presentation between an embolic and a thrombotic limb ischaemia?",
        options: [
          "The embolic has a sudden onset with no previous symptoms and a normal contralateral limb",
          "The thrombotic has a sudden onset with a claudication history",
          "Both are identical",
          "The thrombotic is always painless",
        ],
        correctIndex: 0,
        explanation: "An embolus is sudden with a normal limb and a cardiac source, and a thrombosis is gradual on a background of atheromatous disease with an abnormal contralateral limb.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The vascular assessment is a history, a four-limb examination of the pulses, an auscultation for the bruits, and the measurement of the ankle-brachial index. Acute limb ischaemia is the six Ps, and the urgency is decided by the sensory and motor loss; heparin is given while the flow is restored by an embolectomy or a thrombolysis. An embolic occlusion is sudden with a cardiac source, and a thrombotic occlusion is gradual on a background of arterial disease. The immediately life-threatening emergencies are the ruptured and the dissected aorta, and they are a hand on the abdomen away.",
      },
      {
        type: "paragraph",
        text: "Next: wound care, fluid management, shock and haemostasis, whose mechanics underpin the success of any vascular or bowel restoration.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 13 — Approach to the urological patient & haematuria
// ---------------------------------------------------------------------------
function lesson13() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the storage and the voiding symptoms and what each suggests; perform a urological examination and urine analysis; investigate haematuria and state the risk factors and the cancers it may indicate; describe the approach to urinary stone disease; and outline the principles of benign prostatic disease and its management.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-12 and ANAT 101 (renal and pelvic anatomy). Urological disease presents through the urinary stream, and its differential is defined by the pattern of the symptoms.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Haematuria",
        text: "The passage of blood in the urine, which must be classified as visible (macroscopic) or non-visible (microscopic) and, in either case, requires investigation to the renal tract, because it is the commonest presentation of a bladder or a kidney cancer.",
      },
      {
        type: "paragraph",
        text: "The urinary symptoms are grouped into storage — frequency, urgency, nocturia and urge incontinence, which indicate an irritative or a bladder cause — and voiding — hesitancy, a poor stream, intermittency, straining, dribbling and retention, which indicate an obstruction. The distinction narrows the differential before any test, because the storage symptoms point to the bladder and the voiding symptoms point to the outlet and the prostate.",
      },

      { type: "heading", level: 2, text: "Storage and voiding symptoms" },
      {
        type: "table",
        headers: ["Group", "Symptom", "What it suggests"],
        rows: [
          ["Storage", "Frequency with small volumes", "A bladder irritability from an infection, a stone or a carcinoma in situ"],
          ["Storage", "Urgency and urge incontinence", "Detrusor overactivity or a bladder outlet problem"],
          ["Storage", "Nocturia", "A bladder outlet problem, a diabetes, a diuretic or a poor concentrating ability"],
          ["Voiding", "Hesitancy and a poor stream", "Bladder outlet obstruction, most often from the prostate"],
          ["Voiding", "Intermittency and straining", "A detrusor that is failing to overcome the outlet"],
          ["Voiding", "Terminal dribbling", "A pooling of urine in the bulbar urethra"],
          ["Voiding", "Acute retention", "A sudden complete obstruction, often precipitated by an anticholinergic or a constipation"],
          ["Either", "Incontinence", "Stress (the sphincter), urge (the detrusor), overflow (a retention) or a continuous (a fistula)"],
        ],
      },
      {
        type: "paragraph",
        text: "The vital distinction in the older man with retention is between the acute and the chronic: an acute retention is a painful distended bladder with a constant urge and inability to void, and a chronic retention is a painless distension with overflow, a residual volume and a risk of a renal impairment. The chronic retention is the one that damages the kidney, and it is the one that is missed because it does not hurt.",
      },

      { type: "heading", level: 2, text: "The examination and the first investigations" },
      {
        type: "table",
        headers: ["Investigation", "What is assessed"],
        rows: [
          ["Urine dipstick", "Blood, protein, glucose, nitrites and leucocytes"],
          ["Urine microscopy and culture", "Infection, the red-cell morphology (a dysmorphic red cell indicates a glomerular source), and the casts"],
          ["Cytology", "The exfoliated malignant cells of the urothelium, used in a carcinoma in situ"],
          ["Renal function and calcium", "The kidney function and the metabolic cause of a stone"],
          ["Prostate-specific antigen", "A screening and staging measure, discussed in the context of the patient's age and the life expectancy"],
          ["Ultrasound of the urinary tract", "The size, the hydronephrosis, the residual volume and the stones"],
          ["Cystoscopy", "The direct view of the bladder, done for a macroscopic haematuria or a risk of a cancer"],
          ["CT urography", "The renal tract from the kidney to the bladder, and the standard for the investigation of haematuria"],
        ],
      },

      { type: "heading", level: 2, text: "Haematuria and the cancers" },
      {
        type: "table",
        headers: ["Presentation", "Cancer", "Notes"],
        rows: [
          ["Painless visible haematuria in an older man", "Transitional cell carcinoma of the bladder, and the commonest cause", "The commonest urological cancer, and smoking is the dominant risk factor"],
          ["Painless visible haematuria with a flank mass", "Renal cell carcinoma", "The classic triad with a flank pain and fever"],
          ["Painless visible haematuria with a clot colic", "Transitional cell carcinoma of the ureter", "A clot that obstructs the ureter causes a colic"],
          ["Microscopic haematuria in a young adult", "Usually a benign cause, but a disease of the glomeruli is excluded", "The dysmorphic red cells and the protein indicate a glomerular source"],
        ],
      },
      {
        type: "paragraph",
        text: "The investigation of a macroscopic haematuria is a CT urography and a cystoscopy, because both must be done: the CT defines the upper tract and the cystoscopy the bladder. A non-visible haematuria is investigated on the basis of the risk factors (age, smoking, previous pelvic radiation, cyclophosphamide exposure, and a family history), and the repeated dipstick is done after an infection has been excluded. The dipstick haematuria is not the same as a haematuria on microscopy, and the false positives from myoglobinuria or from a concentrated urine are excluded first.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "A painless visible haematuria in an older patient is a bladder cancer until the cystoscopy says otherwise, and the diagnosis must not be deferred because the patient is on anticoagulation. The anticoagulation is managed, but the haematuria is investigated.",
      },

      { type: "heading", level: 2, text: "Stone disease and prostatic disease" },
      {
        type: "table",
        headers: ["Condition", "Presentation", "Management"],
        rows: [
          ["Renal colic", "A severe loin to groin pain with vomiting and a microscopic or a visible haematuria", "Non-contrast CT, analgesia, an alpha-blocker for the ureteric stone, and an intervention for a large or an infected stone"],
          ["Ureteric obstruction", "A loin pain, hydronephrosis and a risk of sepsis", "Decompression by a stent or a nephrostomy in an infected obstruction"],
          ["Vesical calculus", "Frequency, a stoppage of the stream and discomfort", "Cystolitholapaxy or a removal"],
          ["Benign prostatic hyperplasia", "Storage and voiding symptoms in an older man, and a palpable smooth prostate", "Alpha-blockers and 5-alpha-reductase inhibitors, a transurethral resection for the refractory case, and the treatment of the acute retention"],
          ["Carcinoma of the prostate", "Asymptomatic in the early stage, with the voiding symptoms, the bone pain and an irregular prostate", "Staging, and the treatment tailored to the tumour, the life expectancy and the patient"],
        ],
      },
      {
        type: "question",
        prompt: "Why is an obstructed and infected urinary tract an emergency?",
        answer: "Because the obstruction prevents the drainage of the infected urine, so the antibiotics cannot reach the source and the infection becomes bacteraemic. The tract must be decompressed with a stent or a nephrostomy, and the stone treated later.",
        explanation: "An obstructed infected system is a urological emergency that is relieved by drainage and not by antibiotics alone.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Attributing a visible haematuria to a urinary infection without a culture and, in an older patient, without a cystoscopy. An infection is treated and the urine is re-tested after it, and no patient with a risk of a cancer is left unexamined.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Telling a patient with a chronic retention that they have no problem because they are not in pain. The chronic retention damages the kidney, and it is discovered by the residual volume.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Not palpating a distended bladder in an acute abdomen. A palpably distended bladder is a cause of suprapubic tenderness and an obstruction that must be relieved before a laparotomy.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "How do you distinguish a glomerular from a urological haematuria on the dipstick and the microscopy?",
        answer: "A glomerular haematuria has dysmorphic red cells (the cells have been distorted by the passage through the nephron), a proteinuria and often a cast, and it is investigated by a renal physician; a urological haematuria has uniform red cells and is investigated by a CT urography and a cystoscopy.",
        explanation: "The distinction separates the medical from the surgical cause of the same sign.",
      },
      {
        type: "question",
        prompt: "What is the standard investigation of a painless visible haematuria in a 65-year-old smoker?",
        answer: "A CT urography of the upper tract and a cystoscopy of the bladder, both done within the same episode, because the presentation is a bladder cancer until the cystoscopy says otherwise.",
        explanation: "Both tests are mandatory: the CT for the kidney and the ureter, and the cystoscopy for the bladder.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which is the commonest urological cancer, and its commonest risk factor?",
        options: ["Renal cell carcinoma and smoking", "Transitional cell carcinoma of the bladder and smoking", "Prostatic cancer and obesity", "Testicular cancer and diet"],
        correctIndex: 1,
        explanation: "Transitional cell carcinoma of the bladder is the commonest urological cancer, and smoking is the dominant risk factor, with the aromatic amines of the industry also.",
      },
      {
        type: "mcq",
        stem: "A man of 70 has a sudden suprapubic pain with an inability to void, and a palpable mass. What is the immediate management?",
        options: ["An alpha-blocker and a discharge", "Immediate catheterisation to relieve the acute retention", "A CT scan of the abdomen", "An intravenous antibiotic alone"],
        correctIndex: 1,
        explanation: "An acute retention is painful and must be relieved by a catheter, and the prostate and the cause are then assessed; the trial of a catheter removal is a later decision.",
      },
      {
        type: "mcq",
        stem: "What is the treatment of the obstructed and infected urinary tract?",
        options: ["Antibiotics alone", "Decompression by a stent or a nephrostomy, with antibiotics", "A cystoscopy and a stone removal", "A nephrectomy"],
        correctIndex: 1,
        explanation: "The antibiotics cannot reach the source through an obstructed tract, so the drainage relieves the sepsis and the stone is treated later.",
      },
      {
        type: "mcq",
        stem: "Which feature of a microhaematuria suggests a glomerular source?",
        options: ["Uniform red cells with a clot", "Dysmorphic red cells with a proteinuria and a cast", "A visible clot", "An alkaline urine"],
        correctIndex: 1,
        explanation: "The dysmorphic red cells, the protein and a cast indicate a glomerular source, and they are found by the microscopy of the urine.",
      },
      {
        type: "mcq",
        stem: "Which is the investigation of a painless visible haematuria in an older patient?",
        options: ["A urine culture alone", "A CT urography and a cystoscopy", "A prostate-specific antigen", "An intravenous urogram only"],
        correctIndex: 1,
        explanation: "A CT urography images the kidney and the ureter and a cystoscopy the bladder, and both are required for a macroscopic haematuria.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The urological symptoms divide into storage (irritative) and voiding (obstructive), and the distinction narrows the differential before a test is ordered. A painless visible haematuria in an older patient is a bladder cancer until the CT urography and the cystoscopy say otherwise, and the glomerular causes are separated by the microscopy of the urine. A renal colic is diagnosed by the CT and managed with an analgesia and the passage of the stone, and an obstructed and infected system is an emergency relieved by drainage.",
      },
      {
        type: "paragraph",
        text: "Next: fluid management and shock, whose recognition is a daily part of the management of any surgical or urological patient.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 14 — Oesophagus, stomach & duodenum surgery
// ---------------------------------------------------------------------------
function lesson14() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the presentation and management of gastro-oesophageal reflux; recognise Barrett oesophagus and the risk of adenocarcinoma; state the causes and management of oesophageal cancer; describe peptic ulceration, its complications and their treatment; and outline the presentation and surgery of gastric cancer.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-13 and ANAT 101 (foregut anatomy and the diaphragmatic hiatus). The gastro-oesophageal junction is a physiological sphincter whose failure is the entry to the whole of foregut surgery.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Gastro-oesophageal reflux disease",
        text: "The reflux of gastric content into the oesophagus producing heartburn and regurgitation, caused by a failure of the anti-reflux barrier — the lower oesophageal sphincter, the diaphragmatic hiatus and the angle of His — and treated by lifestyle measures, acid suppression and, for the resistant case, anti-reflux surgery.",
      },
      {
        type: "paragraph",
        text: "The whole of foregut surgery turns on one junction. The lower oesophageal sphincter is not a true anatomical sphincter but a physiological one, and it fails by a transient relaxation, a hiatal hernia, a raised intra-abdominal pressure or a weak muscle. Reflux is the symptom, but the consequences that matter are the complications: the erosive oesophagitis, the stricture, the Barrett metaplasia and the adenocarcinoma that can follow.",
      },

      { type: "heading", level: 2, text: "Gastro-oesophageal reflux and its surgery" },
      {
        type: "table",
        headers: ["Aspect", "Content"],
        rows: [
          ["Symptoms", "Heartburn (a retrosternal burning, worse lying flat and after meals), regurgitation, water brash, a cough and hoarseness, and a non-cardiac chest pain"],
          ["Diagnosis", "Clinical, then an upper gastrointestinal endoscopy if the presentation is atypical, or if the alarm features are present, or if the treatment fails"],
          ["Medical treatment", "A proton pump inhibitor, weight loss, the elevation of the bed-head, the avoidance of the late meals and the reduction of the alcohol and the smoking"],
          ["Surgery", "A laparoscopic Nissen fundoplication — the wrapping of the fundus around the lower oesophagus — for the patient who is young, who refuses the lifelong medication, or who has a volume reflux that the acid suppression does not control"],
          ["Alarm features", "Dysphagia, odynophagia, weight loss, anaemia, vomiting or an age over 55, each of which is an indication for an endoscopy"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The dysphagia of a reflux stricture is progressive and solid, whereas the dysphagia of a cancer is rapidly progressive and liquid follows. Any new dysphagia is an indication for an upper gastrointestinal endoscopy, and this is the single rule that catches oesophageal cancer early.",
      },

      { type: "heading", level: 2, text: "Barrett oesophagus and oesophageal cancer" },
      {
        type: "table",
        headers: ["Condition", "Features", "Management"],
        rows: [
          ["Barrett oesophagus", "The replacement of the squamous epithelium by a columnar metaplasia in response to the chronic acid exposure", "Acid suppression and a surveillance endoscopy; the risk of a cancer is about 0.5 per cent per year"],
          ["Low-grade dysplasia", "A change confined to the lower epithelium", "Intensified surveillance or an ablation"],
          ["High-grade dysplasia", "The full thickness involvement", "Endoscopic resection or ablation"],
          ["Adenocarcinoma", "The distal oesophageal and the cardia tumour, arising in Barrett", "Staging, then an oesophagectomy or a chemoradiotherapy for the locally advanced disease"],
          ["Squamous cell carcinoma", "The mid and the upper oesophageal tumour, related to the alcohol, the smoking and the dietary deficiency", "Staging, then a chemoradiotherapy or an oesophagectomy"],
        ],
      },
      {
        type: "paragraph",
        text: "Oesophageal cancer is the disease that presents late, because the oesophagus is distensible and the lumen is not narrowed until the tumour is circumferentially advanced. The presenting symptom is a progressive dysphagia, first for the solids and then for the liquids, with the weight loss that follows the inability to swallow. The staging is by a CT, an endoscopic ultrasound and a PET, and the treatment is a chemoradiotherapy for a squamous cell tumour and an oesophagectomy for a resectable adenocarcinoma.",
      },
      {
        type: "question",
        prompt: "Why is the dysphagia of an oesophageal cancer progressive in the way a benign stricture is not?",
        answer: "Because the cancer grows circumferentially and continuously, so the lumen narrows without remission, whereas a benign reflux stricture is fixed and the patient can sometimes swallow soft food for long periods. The history of the progressive solids-to-liquids dysphagia is the diagnostic clue.",
        explanation: "The dysphagia is the symptom that brings the patient to an endoscopy, and the delay is the reason for the late presentation.",
      },

      { type: "heading", level: 2, text: "Peptic ulceration" },
      {
        type: "table",
        headers: ["Aspect", "Content"],
        rows: [
          ["Aetiology", "Helicobacter pylori infection, the non-steroidal anti-inflammatory drugs, the aspirin, the smoking, and (rarely) the Zollinger-Ellison syndrome"],
          ["Symptoms", "Epigastric pain that is related to the meals — a gastric ulcer is worse on eating and a duodenal ulcer is relieved by food and recurs 2 to 3 hours later"],
          ["Diagnosis", "An upper gastrointestinal endoscopy with the biopsy and the testing for the Helicobacter pylori, and the urea breath test or the stool antigen for the non-invasive confirmation"],
          ["Treatment", "Eradication of the Helicobacter pylori with a triple or a quadruple therapy, a proton pump inhibitor, and the cessation of the non-steroidal drug"],
          ["Complications", "Perforation, haemorrhage, penetration into the pancreas and the gastric outlet obstruction"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "A perforated peptic ulcer is a surgical emergency: a sudden severe epigastric pain that spreads across the abdomen, with a rigid board-like abdomen, free gas on the erect chest radiograph, and a mortality that rises with every hour of delay. The treatment is a resuscitation, an antibiotic, and the closure of the perforation — an omental patch for a duodenal ulcer, and a resection for a gastric ulcer that may be malignant.",
      },
      {
        type: "question",
        prompt: "Why is a perforated gastric ulcer treated differently from a perforated duodenal one?",
        answer: "Because a gastric ulcer may be a carcinoma, so the biopsy and a resection are needed, whereas a duodenal ulcer is almost never malignant and is closed with an omental patch. The distinction is made by the biopsy and the site.",
        explanation: "The venereal biopsy of a gastric ulcer is a rule that protects against the missed cancer.",
      },

      { type: "heading", level: 2, text: "Gastric cancer" },
      {
        type: "table",
        headers: ["Aspect", "Content"],
        rows: [
          ["Epidemiology", "The incidence is falling; Helicobacter pylori, the dietary salted and smoked food, and the smoking are the risk factors"],
          ["Presentation", "An early satiety, a weight loss, an epigastric pain, anaemia, and — a Virchow node in the left supraclavicular fossa or a Blumer shelf on the rectal examination — the signs of the advanced disease"],
          ["Spread", "The lymphatic spread to the coeliac and the supraclavicular nodes, a transcoelomic spread to the ovaries (Krukenberg) and the pouch of Douglas, and a haematogenous spread to the liver"],
          ["Treatment", "Staging by a CT and a staging laparoscopy, then a subtotal or a total gastrectomy with a lymphadenectomy for a resectable tumour, and a chemotherapy for the advanced or the node-positive disease"],
          ["Reconstruction", "A Roux-en-Y oesophagojejunostomy after a total gastrectomy, or a Billroth I or a Billroth II anastomosis after a partial gastrectomy"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Attributing a new dysphagia to reflux without an endoscopy. The progressive solids-to-liquids dysphagia is the presentation of oesophageal cancer, and the alarm features are the indication for the investigation rather than the reassurance.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Continuing the non-steroidal anti-inflammatory drug and treating the ulcer with a proton pump inhibitor alone. The Helicobacter pylori and the non-steroidal drug must be addressed, or the ulcer recurs within weeks of the acid suppression being stopped.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Missing the bleeding presentation of a peptic ulcer. A patient with a melaena and a tachycardia is bleeding, and the treatment is a resuscitation, a transfusion and an urgent endoscopy, not a prescription for an iron supplement.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What is the alarm feature that changes the management of a patient with reflux?",
        answer: "Dysphagia, odynophagia, weight loss, anaemia, vomiting or an age over 55, because each of these is an indication for an upper gastrointestinal endoscopy, which is the test that finds the Barrett and the cancer.",
        explanation: "The alarm features are the reason the endoscopy is done, and they are the pathway by which the cancer is found in time to treat it.",
      },
      {
        type: "question",
        prompt: "Which patient with gastro-oesophageal reflux is referred for a fundoplication?",
        answer: "The patient who is young, in whom the reflux is a volume reflux with a large hiatal hernia, who refuses the lifelong proton pump inhibitor, who has the respiratory symptoms of an aspiration, or in whom the acid suppression does not control the symptoms. The Nissen wrap is the standard operation.",
        explanation: "The surgery is a decision for the refractory or the volume reflux, and it is weighed against a well-tolerated lifelong medication.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A man of 70 has a progressive dysphagia, first for solids and now for liquids, with a weight loss. What is the first investigation?",
        options: ["Barium swallow", "Upper gastrointestinal endoscopy with a biopsy", "Plain chest radiograph", "CT scan of the chest"],
        correctIndex: 1,
        explanation: "A progressive solids-to-liquids dysphagia is the presentation of an oesophageal carcinoma, and the endoscopy both sees and biopsies it.",
      },
      {
        type: "mcq",
        stem: "Which is the most common cause of a benign peptic ulcer?",
        options: ["Helicobacter pylori infection", "Alcohol", "Smoking alone", "Dietary salt"],
        correctIndex: 0,
        explanation: "Helicobacter pylori is the commonest cause, with the non-steroidal anti-inflammatory drugs the second, and the eradication is a part of the treatment.",
      },
      {
        type: "mcq",
        stem: "A patient has a sudden severe epigastric pain and a board-like rigid abdomen. What is the diagnosis?",
        options: ["Acute pancreatitis", "A perforated peptic ulcer", "Biliary colic", "Myocardial infarction"],
        correctIndex: 1,
        explanation: "A sudden pain with a generalised rigidity is a perforation, and the erect chest radiograph shows the free gas under the diaphragm; the treatment is a resuscitation and a closure.",
      },
      {
        type: "mcq",
        stem: "Which of the following is a feature of a gastric rather than a duodenal ulcer?",
        options: ["The pain is relieved by food", "The pain is worse on eating", "The pain wakes the patient at 2 am", "The pain is relieved by an antacid at the end of the day"],
        correctIndex: 1,
        explanation: "A gastric ulcer is worse on eating because the food stimulates the acid secretion in the stomach, whereas a duodenal ulcer is relieved by the food and recurs a few hours later.",
      },
      {
        type: "mcq",
        stem: "What is the risk of a cancer in a Barrett oesophagus?",
        options: ["About 0.1 per cent per year", "About 0.5 per cent per year", "About 5 per cent per year", "About 50 per cent per year"],
        correctIndex: 1,
        explanation: "The risk of an adenocarcinoma in a Barrett oesophagus is about 0.5 per cent per year, which is the basis of the surveillance programme and of the treatment of the dysplasia.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Foregut surgery is the surgery of one junction. Reflux is a failure of the physiological sphincter and is treated by the acid suppression and the lifestyle, and by a Nissen fundoplication for the refractory or the volume reflux. The dysphagia is the alarm symptom that must be endoscoped, because the oesophageal cancer presents late with a progressive solids-to-liquids dysphagia. A peptic ulcer is caused by the Helicobacter pylori or the non-steroidal drug, and it is treated by the eradication and the cessation; its perforation and haemorrhage are the emergencies. A gastric cancer presents late and is staged and resected with a lymphadenectomy.",
      },
    ],
  };
}
// Module 1 SBA items — one per concept, authored and machine-checked.
// ---------------------------------------------------------------------------
const MODULE_ONE_SBAS: SbaSeed[] = [
  {
    slug: "surgery-principles--assessment-consent--sba",
    concept: "assessment-consent",
    stem: "A patient is booked for an inguinal hernia repair. Which of the following is required for the consent to be valid?",
    options: [
      "A signature on the consent form by the patient",
      "A competent and informed patient making a voluntary decision after being told the purpose, the benefits and the risks and the alternatives",
      "The agreement of a relative",
      "The consultant authorising the operation",
    ],
    correctAnswer:
      "A competent and informed patient making a voluntary decision after being told the purpose, the benefits and the risks and the alternatives",
    explanation:
      "A signature documents the exchange but does not create it: the essence of consent is that a competent and informed patient voluntarily decides for the specific procedure, having been told the risks and the alternatives.",
    difficulty: "medium",
  },
  {
    slug: "surgery-principles--asepsis-ssi--sba",
    concept: "asepsis-ssi",
    stem: "What is the correct timing for antibiotic prophylaxis before an elective colectomy?",
    options: [
      "Within 60 minutes before the incision",
      "24 hours before the operation",
      "Only if the wound becomes infected",
      "At the first rise in the post-operative temperature",
    ],
    correctAnswer: "Within 60 minutes before the incision",
    explanation:
      "Prophylaxis is given within the 60 minutes before the incision so that the tissue concentration is adequate at the time of the incision, and it is for a single dose or at most 24 hours; continuing it increases resistance and the risk of an intestinal infection without reducing the surgical site infection.",
    difficulty: "easy",
  },
  {
    slug: "surgery-principles--haemostasis-shock-fluids--sba",
    concept: "haemostasis-shock-fluids",
    stem: "A patient two hours after a total hip replacement has a heart rate of 122, a falling urine output, a rising drain output and a widening pulse pressure. What is the most likely diagnosis?",
    options: [
      "Post-operative pain",
      "Post-operative haemorrhage",
      "Wound infection",
      "Pulmonary embolism",
    ],
    correctAnswer: "Post-operative haemorrhage",
    explanation:
      "The combination of a rising heart rate, a falling urine output, and rising drain output are the earliest signs of post-operative bleeding and compensated shock, and the widening pulse pressure reflects vasoconstriction. The haemoglobin falls later, so it is the physiology and not the counts that identify the haemorrhage.",
    difficulty: "medium",
  },
  {
    slug: "surgery-principles--wound-care-healing--sba",
    concept: "wound-care-healing",
    stem: "Approximately what tensile strength does an incisional wound have at two weeks, relative to the original tissue?",
    options: ["Five per cent", "About ten per cent", "About fifty per cent", "About eighty per cent"],
    correctAnswer: "About ten per cent",
    explanation:
      "At two weeks, which is why sutures are not removed early from wounds over joints, and why a wound is only about fifty per cent at a month and never reaches more than about eighty per cent.",
    difficulty: "medium",
  },
  {
    slug: "surgery-principles--trauma-principles--sba",
    concept: "trauma-principles",
    stem: "A trauma patient has a trachea deviated away from the left side, absent breath sounds on the left and a blood pressure of 76. What is the immediate management?",
    options: [
      "Urgent chest radiograph",
      "Needle decompression of the left chest, then a chest drain",
      "Intubation and mechanical ventilation",
      "Insertion of a wide-bore intravenous cannula and blood transfusion only",
    ],
    correctAnswer: "Needle decompression of the left chest, then a chest drain",
    explanation:
      "The clinical features are those of a tension pneumothorax — a one-way valve, rising pressure, mediastinal shift and obstructive shock — and it is a clinical diagnosis decompressed on the spot with a needle, followed by a formal chest drain.",
    difficulty: "easy",
  },
  {
    slug: "surgery-principles--postoperative-care--sba",
    concept: "postoperative-care",
    stem: "A patient is 12 hours after an uneventful open cholecystectomy and has a temperature of 37.9 degrees C with mild tachypnoea. What is the most likely cause?",
    options: [
      "Wound infection", "Atelectasis", "Urinary tract infection", "Anastomotic leak",
    ],
    correctAnswer: "Atelectasis",
    explanation:
      "A fever within the first 24 hours after abdominal surgery is almost always atelectasis from shallow breathing caused by post-operative pain. Pneumonia follows after two to three days, wound infection at four to seven days, and anastomotic leak at five to ten days.",
    difficulty: "medium",
  },
];

// ---------------------------------------------------------------------------
// Deeper modules 2-5: a real concept spine, tracked-placeholder lessons.
// ---------------------------------------------------------------------------
const DEEPER_LESSONS: LessonSeed[] = [
  // --- M2 GI & hepatobiliary surgery ---
  { title: "The acute abdomen & gastrointestinal bleeding", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "The acute abdomen and gastrointestinal bleeding", slug: "acute-abdomen-gi-bleeding", summary: "The causes and the pattern of abdominal pain, the approach to perforation, obstruction and bleeding, and the initial resuscitation.", blooms: "apply", minutes: 40, prereq: ["haemostasis-shock-fluids"] }, content: lesson9() as never },
  { title: "Oesophagus, stomach & duodenum surgery", module: 2, estimatedMinutes: 35, authored: true, concept: { title: "Oesophageal, gastric and duodenal surgery", slug: "oesophagogastric-surgery", summary: "Gastro-oesophageal reflux and its surgical repair, peptic ulceration and its complications, and the gastric cancer operations.", blooms: "apply", minutes: 35, prereq: ["acute-abdomen-gi-bleeding"] }, content: lesson14() as never },
  { title: "Small bowel & emergency surgery", module: 2, estimatedMinutes: 35, authored: true, concept: { title: "Small bowel and emergency surgery", slug: "small-bowel-surgery", summary: "Small bowel obstruction, ischaemia and herniation, the principle of stoma formation, and the complications of bowel surgery.", blooms: "apply", minutes: 35, prereq: ["acute-abdomen-gi-bleeding"] }, content: lesson7() as never },
  { title: "Colorectal surgery", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Colorectal surgery", slug: "colorectal-surgery", summary: "Diverticular disease, inflammatory bowel disease, colorectal cancer, the laparoscopic approach and the principles of the low anterior resection.", blooms: "apply", minutes: 40, prereq: ["small-bowel-surgery"] }, content: lesson10() as never },
  { title: "Appendicectomy & the appendix", module: 2, estimatedMinutes: 30, authored: true, concept: { title: "Appendicitis and appendicectomy", slug: "appendix", summary: "The spectrum from uncomplicated to complicated appendicitis, the scoring tools, open versus laparoscopic, and the post-operative complications.", blooms: "apply", minutes: 30, prereq: ["small-bowel-surgery"] }, content: lesson8() as never },
  { title: "Hepatobiliary & pancreatic surgery", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Hepatobiliary and pancreatic surgery", slug: "hepatobiliary-surgery", summary: "Gallstone disease, the intervention for cholangitis and pancreatitis, the resection of liver and pancreatic tumours, and the principles of jaundice surgery.", blooms: "apply", minutes: 40, prereq: ["colorectal-surgery"] }, content: lesson11() as never },

  // --- M3 Vascular & cardiovascular surgery ---
  { title: "Approach to the vascular patient", module: 3, estimatedMinutes: 35, authored: false, concept: { title: "Approach to the vascular patient", slug: "vascular-approach", summary: "The history and examination of the arterial and venous systems, the interpretation of the investigation results, and the grading of limb ischaemia.", blooms: "apply", minutes: 35, prereq: ["trauma-principles"] }, content: { blocks: [] } },
  { title: "Aneurysmal & occlusive arterial disease", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Aneurysmal and occlusive arterial disease", slug: "aneurysmal-occlusive-disease", summary: "Abdominal and thoracic aneurysm, carotid disease, peripheral arterial disease, and the surgical and endovascular interventions.", blooms: "apply", minutes: 40, prereq: ["vascular-approach"] }, content: { blocks: [] } },
  { title: "Acute limb ischaemia", module: 3, estimatedMinutes: 30, authored: true, concept: { title: "Acute limb ischaemia", slug: "acute-limb-ischaemia", summary: "The 6 Ps of acute limb ischaemia, the discriminating embolic from thrombotic occlusion, and the treatment including thrombolysis.", blooms: "analyze", minutes: 30, prereq: ["vascular-approach"] }, content: lesson12() as never },
  { title: "Venous disease & lymphatics", module: 3, estimatedMinutes: 30, authored: false, concept: { title: "Venous disease and lymphatics", slug: "venous-disease", summary: "Varicose veins and chronic venous disease, the complications of venous stasis, and the treatment of lymphoedema.", blooms: "apply", minutes: 30, prereq: [] }, content: { blocks: [] } },
  { title: "Cardiac surgery", module: 3, estimatedMinutes: 35, authored: false, concept: { title: "Cardiac surgery", slug: "cardiac-surgery", summary: "Coronary artery bypass grafting, valve replacement and repair, the cardiopulmonary bypass, and post-operative complications.", blooms: "apply", minutes: 35, prereq: ["wound-care-healing"] }, content: { blocks: [] } },

  // --- M4 Urology & renal surgery ---
  { title: "Approach to the urological patient", module: 4, estimatedMinutes: 30, authored: true, concept: { title: "Approach to the urological patient", slug: "urological-approach", summary: "The causes of urinary symptoms, the examination and the investigation of a renal transplant, and the approach to haematuria.", blooms: "apply", minutes: 30, prereq: ["assessment-consent"] }, content: lesson13() as never },
  { title: "Stones & obstruction of the urinary tract", module: 4, estimatedMinutes: 35, authored: false, concept: { title: "Urinary stones and obstruction", slug: "urinary-stones", summary: "The composition and causes of urinary stones, the pattern of renal colic, and the incidence of hydronephrosis.", blooms: "apply", minutes: 35, prereq: ["urological-approach"] }, content: { blocks: [] } },
  { title: "Prostate & bladder disease", module: 4, estimatedMinutes: 35, authored: false, concept: { title: "Prostatic and bladder disease", slug: "prostate-bladder", summary: "Benign prostatic enlargement, carcinoma of the prostate with its staging, bladder cancer, and the investigation and management.", blooms: "apply", minutes: 35, prereq: ["urological-approach"] }, content: { blocks: [] } },
  { title: "External genitalia & the scrotum", module: 4, estimatedMinutes: 30, authored: false, concept: { title: "External genitalia and the scrotum", slug: "genital-scrotal-surgery", summary: "Testicular torsion and swellings, hydrocele, varicocele, hypospadias, and the principles of the acute scrotum.", blooms: "apply", minutes: 30, prereq: ["urological-approach"] }, content: { blocks: [] } },
  { title: "Renal transplantation", module: 4, estimatedMinutes: 30, authored: false, concept: { title: "Renal transplantation", slug: "renal-transplantation", summary: "Donor assessment, recipient preparation, immunosuppression, rejection and the complications of transplantation.", blooms: "analyze", minutes: 30, prereq: ["prostate-bladder"] }, content: { blocks: [] } },

  // --- M5 Orthopaedics, neurosurgery & special surgery ---
  { title: "Fractures & dislocations", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Fractures, dislocations and injury classification", slug: "fractures-dislocations", summary: "The principles of the description of a fracture, the healing of a fracture, the complications, and the classification of soft tissue injuries.", blooms: "apply", minutes: 40, prereq: ["wound-care-healing"] }, content: { blocks: [] } },
  { title: "Limb orthopaedics", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Limb orthopaedics", slug: "limb-orthopaedics", summary: "Hip fracture, arthritis and joint replacement, bone and soft tissue tumours, and the paediatric orthopaedic conditions.", blooms: "apply", minutes: 40, prereq: ["fractures-dislocations"] }, content: { blocks: [] } },
  { title: "Spinal orthopaedics", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Spinal orthopaedics", slug: "spinal-orthopaedics", summary: "The spine and cord injury, cauda equina syndrome, disc disease, spinal deformity and the classification of spinal injuries.", blooms: "apply", minutes: 35, prereq: ["fractures-dislocations"] }, content: { blocks: [] } },
  { title: "Paediatric surgery", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Paediatric surgery", slug: "paediatric-surgery", summary: "Congenital surgical conditions, pyloric stenosis, intussusception, inguinal hernia, and the principles of neonatal surgery.", blooms: "apply", minutes: 35, prereq: ["fractures-dislocations"] }, content: { blocks: [] } },
  { title: "Neurosurgery", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Neurosurgery", slug: "neurosurgery", summary: "The management of raised intracranial pressure, the accident and emergency surgery of the head injury, the congenital and neoplastic conditions, and the surgery of the lumbar disc.", blooms: "apply", minutes: 40, prereq: ["spinal-orthopaedics"] }, content: { blocks: [] } },
  { title: "Hand, plastic, reconstructive & transplant surgery", module: 5, estimatedMinutes: 30, authored: false, concept: { title: "Hand, plastic and reconstructive surgery", slug: "hand-plastic-reconstructive", summary: "Tendon injuries, flexor sheath and nerve injuries, the principles of flaps and grafts, and the reconstructive options in the hand.", blooms: "apply", minutes: 30, prereq: ["limb-orthopaedics"] }, content: { blocks: [] } },
];

export const SURGERY: SubjectSeed = {
  id: "course-surgery",
  slug: "surgery-principles",
  title: "Surgery — Principles & General Operation",
  code: "SURG 301",
  department: "Surgery",
  level: 300,
  credits: 8,
  semester: "full",
  description:
    "The discipline of surgical decision-making: assessment and consent, asepsis and the prevention of surgical site infection, haemostasis, shock and fluid therapy, wound care and healing, trauma and post-operative care — and then the gastrointestinal, hepatobiliary, vascular, urological, orthopaedic and neurosurgical specialties that practice them.",
  faculty: "clinical-medicine",
  modules: MODULES,
  lessons: [
    { title: "Assessment, consent & the safe surgical patient", module: 1, estimatedMinutes: 35, authored: true, concept: { title: "Assessment, consent and the safe surgical patient", slug: "assessment-consent", summary: "Emergency, urgent and elective classification; the components of a pre-operative assessment; the requirements of a valid consent; and the ASA classification.", blooms: "apply", minutes: 35, prereq: [] }, content: lesson1() as never },
    { title: "Asepsis & surgical site infection", module: 1, estimatedMinutes: 35, authored: true, concept: { title: "Asepsis and surgical site infection", slug: "asepsis-ssi", summary: "Sterile technique, the four classes of wound, the risk factors for infection, and the timing, choice and duration of antibiotic prophylaxis.", blooms: "apply", minutes: 35, prereq: ["assessment-consent"] }, content: lesson2() as never },
    { title: "Haemostasis, shock & fluids", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Haemostasis, shock and fluids", slug: "haemostasis-shock-fluids", summary: "The four classes of haemorrhage, the recognition of haemorrhagic shock, the initial management and transfusion triggers, and the fluid prescription.", blooms: "apply", minutes: 40, prereq: ["assessment-consent"] }, content: lesson3() as never },
    { title: "Wound healing & wound care", module: 1, estimatedMinutes: 35, authored: true, concept: { title: "Wound healing and wound care", slug: "wound-care-healing", summary: "The stages of wound healing and the tensile strength curve, closure materials and drains, dehiscence and incisional hernia, and open-wound management.", blooms: "analyze", minutes: 35, prereq: ["asepsis-ssi"] }, content: lesson4() as never },
    { title: "Trauma principles", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Trauma principles", slug: "trauma-principles", summary: "The primary and secondary surveys, the immediate interventions, damage control resuscitation and surgery, and triage for multiple casualties.", blooms: "apply", minutes: 40, prereq: ["haemostasis-shock-fluids"] }, content: lesson5() as never },
    { title: "Post-operative care & complications", module: 1, estimatedMinutes: 35, authored: true, concept: { title: "Post-operative care and complications", slug: "postoperative-care", summary: "The routine of post-operative care, the timing of fever causes, the detection of haemorrhage, leak and venous thromboembolism, and when to escalate.", blooms: "apply", minutes: 35, prereq: ["trauma-principles", "wound-care-healing"] }, content: lesson6() as never },
    ...DEEPER_LESSONS,
  ],
  sbas: MODULE_ONE_SBAS,
  prereqCourses: [
    "gross-anatomy-i",
    "physiology-cell-and-general",
    "pathology-cell-injury-repair",
    "pharmacology-foundations",
  ],
};

export async function seedMbbsSurgery() {
  return seedMbbsCourse(SURGERY);
}

/** Idempotent: safe to run repeatedly; upserts on stable keys. */
export async function seedSurgery(): Promise<void> {
  await seedMbbsSurgery();
}

export default SURGERY;

// CLI usage: npx ts-node prisma/seed-courses/mbbs/surgery.ts
if (process.argv[1] && process.argv[1].includes("mbbs/surgery")) {
  seedSurgery()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}