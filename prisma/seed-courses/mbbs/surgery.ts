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
  { title: "The acute abdomen & gastrointestinal bleeding", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "The acute abdomen and gastrointestinal bleeding", slug: "acute-abdomen-gi-bleeding", summary: "The causes and the pattern of abdominal pain, the approach to perforation, obstruction and bleeding, and the initial resuscitation.", blooms: "apply", minutes: 40, prereq: ["haemostasis-shock-fluids"] }, content: { blocks: [] } },
  { title: "Oesophagus, stomach & duodenum surgery", module: 2, estimatedMinutes: 35, authored: false, concept: { title: "Oesophageal, gastric and duodenal surgery", slug: "oesophagogastric-surgery", summary: "Gastro-oesophageal reflux and its surgical repair, peptic ulceration and its complications, and the gastric cancer operations.", blooms: "apply", minutes: 35, prereq: ["acute-abdomen-gi-bleeding"] }, content: { blocks: [] } },
  { title: "Small bowel & emergency surgery", module: 2, estimatedMinutes: 35, authored: false, concept: { title: "Small bowel and emergency surgery", slug: "small-bowel-surgery", summary: "Small bowel obstruction, ischaemia and herniation, the principle of stoma formation, and the complications of bowel surgery.", blooms: "apply", minutes: 35, prereq: ["acute-abdomen-gi-bleeding"] }, content: { blocks: [] } },
  { title: "Colorectal surgery", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Colorectal surgery", slug: "colorectal-surgery", summary: "Diverticular disease, inflammatory bowel disease, colorectal cancer, the laparoscopic approach and the principles of the low anterior resection.", blooms: "apply", minutes: 40, prereq: ["small-bowel-surgery"] }, content: { blocks: [] } },
  { title: "Appendicectomy & the appendix", module: 2, estimatedMinutes: 30, authored: false, concept: { title: "Appendicitis and appendicectomy", slug: "appendix", summary: "The spectrum from uncomplicated to complicated appendicitis, the scoring tools, open versus laparoscopic, and the post-operative complications.", blooms: "apply", minutes: 30, prereq: ["small-bowel-surgery"] }, content: { blocks: [] } },
  { title: "Hepatobiliary & pancreatic surgery", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Hepatobiliary and pancreatic surgery", slug: "hepatobiliary-surgery", summary: "Gallstone disease, the intervention for cholangitis and pancreatitis, the resection of liver and pancreatic tumours, and the principles of jaundice surgery.", blooms: "apply", minutes: 40, prereq: ["colorectal-surgery"] }, content: { blocks: [] } },

  // --- M3 Vascular & cardiovascular surgery ---
  { title: "Approach to the vascular patient", module: 3, estimatedMinutes: 35, authored: false, concept: { title: "Approach to the vascular patient", slug: "vascular-approach", summary: "The history and examination of the arterial and venous systems, the interpretation of the investigation results, and the grading of limb ischaemia.", blooms: "apply", minutes: 35, prereq: ["trauma-principles"] }, content: { blocks: [] } },
  { title: "Aneurysmal & occlusive arterial disease", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Aneurysmal and occlusive arterial disease", slug: "aneurysmal-occlusive-disease", summary: "Abdominal and thoracic aneurysm, carotid disease, peripheral arterial disease, and the surgical and endovascular interventions.", blooms: "apply", minutes: 40, prereq: ["vascular-approach"] }, content: { blocks: [] } },
  { title: "Acute limb ischaemia", module: 3, estimatedMinutes: 30, authored: false, concept: { title: "Acute limb ischaemia", slug: "acute-limb-ischaemia", summary: "The 6 Ps of acute limb ischaemia, the discriminating embolic from thrombotic occlusion, and the treatment including thrombolysis.", blooms: "analyze", minutes: 30, prereq: ["vascular-approach"] }, content: { blocks: [] } },
  { title: "Venous disease & lymphatics", module: 3, estimatedMinutes: 30, authored: false, concept: { title: "Venous disease and lymphatics", slug: "venous-disease", summary: "Varicose veins and chronic venous disease, the complications of venous stasis, and the treatment of lymphoedema.", blooms: "apply", minutes: 30, prereq: [] }, content: { blocks: [] } },
  { title: "Cardiac surgery", module: 3, estimatedMinutes: 35, authored: false, concept: { title: "Cardiac surgery", slug: "cardiac-surgery", summary: "Coronary artery bypass grafting, valve replacement and repair, the cardiopulmonary bypass, and post-operative complications.", blooms: "apply", minutes: 35, prereq: ["wound-care-healing"] }, content: { blocks: [] } },

  // --- M4 Urology & renal surgery ---
  { title: "Approach to the urological patient", module: 4, estimatedMinutes: 30, authored: false, concept: { title: "Approach to the urological patient", slug: "urological-approach", summary: "The causes of urinary symptoms, the examination and the investigation of a renal transplant, and the approach to haematuria.", blooms: "apply", minutes: 30, prereq: ["assessment-consent"] }, content: { blocks: [] } },
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