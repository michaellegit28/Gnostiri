import { prisma, seedMbbsCourse, type SubjectSeed } from "./spine";
import type { LessonContent } from "@/types/lesson";

const PLACEHOLDER: LessonContent = { blocks: [] };

// ---------------------------------------------------------------------------
// LESSON 1 — Acute medicine & applied physiology (fully authored)
// ---------------------------------------------------------------------------
function lesson1() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: calculate oxygen delivery from cardiac output, haemoglobin and saturation, and say which of those terms a ward can actually change today; name the four mechanisms of tissue hypoxia and the treatment each demands; classify shock by cause and classify haemorrhage by blood-loss class using physiological signs; explain the compensatory responses that make early shock look deceptively normal; and use an early warning score to escalate a deteriorating patient before cardiac arrest.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Cardiorespiratory physiology: cardiac output as stroke volume times heart rate, the determinants of stroke volume (preload, afterload, contractility), alveolar gas exchange and the oxyhaemoglobin dissociation curve. These are taught in PHYS 101. You also need to read an arterial blood gas and a full blood count without hesitation.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Oxygen delivery (DO2)",
        text: "The volume of oxygen carried from the lungs to the tissues each minute: cardiac output multiplied by arterial oxygen content multiplied by 10. A resting 70 kg adult delivers about 1000 mL/min — 5 L/min of blood carrying roughly 20 mL of oxygen per decilitre.",
      },
      {
        type: "paragraph",
        text: "Every acute deterioration in this lesson is a failure of oxygen delivery, reached by one of four routes: the lungs cannot load oxygen, the blood cannot carry it, the pump cannot move it, or the volume is not there. All four end identically — cells that cannot generate ATP switch to anaerobic metabolism, produce lactate and stop working — which is why the first response to any shocked patient is generic (restore delivery) and the diagnosis comes second. Learn the equation and you can predict what the patient in front of you needs.",
      },

      { type: "heading", level: 2, text: "The delivery equation, term by term" },
      {
        type: "code",
        language: "text",
        code: "DO2 (mL/min) = CO (L/min) x CaO2 (mL/dL) x 10\n\nCaO2 = (Hb g/dL x 1.34 x SaO2) + (PaO2 kPa x 0.003)",
        output: "Worked example: Hb 12, SaO2 0.97, PaO2 13 kPa, CO 5 L/min\nCaO2 = (12 x 1.34 x 0.97) + (13 x 0.003) = 15.6 + 0.04 = 15.6 mL/dL\nDO2 = 5 x 15.6 x 10 = 780 mL/min  -> below the ~1000 mL/min resting target",
        caption: "The oxygen delivery equation, applied to an anaemic patient",
      },
      {
        type: "table",
        headers: ["Term", "Normal value", "How a ward can change it", "What failure looks like"],
        rows: [
          ["Cardiac output", "4–8 L/min", "Fluid bolus, inotrope, treat arrhythmia, reduce afterload", "Cool peripheries, slow capillary refill, oliguria, rising lactate"],
          ["Haemoglobin", "13–17 g/dL (men), 12–15 g/dL (women)", "Transfusion, iron, arrest bleeding", "Pallor, breathlessness on minimal exertion, wide pulse pressure in severe anaemia"],
          ["Arterial saturation", "94–98% on air", "Oxygen, positioning, physiotherapy, non-invasive ventilation", "Tachypnoea, confusion, and cyanosis as a very late sign"],
          ["Dissolved oxygen", "0.3 mL/dL on room air", "High-flow oxygen; hyperbaric therapy in carbon monoxide poisoning", "A normal-looking saturation hiding a lethal carboxyhaemoglobin level"],
        ],
      },
      {
        type: "paragraph",
        text: "Two consequences are worth memorising. First, haemoglobin dominates the content term: 1 g/dL of haemoglobin carries about 1.3 mL/dL of oxygen when saturated, whereas raising the PaO2 from 13 to 60 kPa adds only about 0.14 mL/dL of dissolved oxygen — a patient at 88% saturation with a haemoglobin of 6 g/dL needs transfusion, not more oxygen. Second, extraction compensates: tissues normally extract about 25% of delivered oxygen, and extraction rises as delivery falls, which is why a mixed venous saturation below 65% is an early warning of inadequate delivery rather than a late one.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Oxygen is a drug with a target range, not a comfort blanket. In acutely ill patients the evidence supports targeting 94–98% rather than 100%: hyperoxia vasoconstricts coronary and cerebral beds, raises afterload, and in patients with chronic carbon dioxide retention worsens hypercapnia. Titrate oxygen to saturation and document the target.",
      },

      { type: "heading", level: 2, text: "Four mechanisms of tissue hypoxia" },
      {
        type: "table",
        headers: ["Mechanism", "What is wrong", "Typical situation", "Targeted treatment"],
        rows: [
          ["Hypoxic hypoxia", "The lungs cannot load oxygen (ventilation-perfusion mismatch, shunt, hypoventilation, diffusion failure)", "Pneumonia, COPD, pulmonary oedema, opioid overdose", "Airway support, oxygen, ventilation, treat the lung disease"],
          ["Anaemic hypoxia", "Too little haemoglobin, or haemoglobin that will not bind oxygen", "Haemorrhage, iron deficiency, carbon monoxide poisoning, methaemoglobinaemia", "Arrest bleeding and transfuse; high-flow 100% oxygen to displace carbon monoxide"],
          ["Stagnant (ischaemic) hypoxia", "Flow too low to deliver the oxygen the blood already carries", "Cardiogenic shock, tamponade, tension pneumothorax, hypovolaemia", "Fluid, inotrope, and relieve the obstruction — needle decompression, chest drain, thrombolysis"],
          ["Histotoxic hypoxia", "Cells cannot use the oxygen that arrives", "Cyanide poisoning, sepsis with mitochondrial dysfunction", "Antidotes (hydroxocobalamin, sodium thiosulfate) and source control of sepsis"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Carbon monoxide causes anaemic AND histotoxic hypoxia, and the two-wavelength pulse oximeter cannot distinguish carboxyhaemoglobin from oxyhaemoglobin. In a patient rescued from a house fire, a saturation of 99% with drowsiness and a lactate of 10 mmol/L is not reassurance — check a carboxyhaemoglobin level and give high-flow oxygen.",
      },

      { type: "heading", level: 2, text: "Shock: classifying by cause" },
      {
        type: "definition",
        term: "Shock",
        text: "A state of tissue perfusion and oxygen delivery inadequate for metabolic demand, producing cellular hypoxia and, if uncorrected, multiorgan failure and death. It is a physiological diagnosis, not a blood-pressure diagnosis: compensatory vasoconstriction preserves pressure until late.",
      },
      {
        type: "table",
        headers: ["Category", "Mechanism", "Signature findings", "First-line treatment"],
        rows: [
          ["Hypovolaemic (haemorrhagic)", "Loss of circulating volume — bleeding, vomiting, diarrhoea, burns", "Tachycardia, cold and clammy, slow capillary refill, low urine output, low jugular venous pressure", "Stop the loss; balanced crystalloid bolus, then blood in a 1:1:1 major haemorrhage protocol"],
          ["Distributive (septic, anaphylactic, neurogenic)", "Massive vasodilatation and capillary leak with an initially high cardiac output", "Warm, bounding peripheries, low diastolic pressure, wide pulse pressure, raised lactate", "Cultures and antibiotics, vasopressor (noradrenaline), adrenaline in anaphylaxis"],
          ["Cardiogenic", "Pump failure — myocardial infarction, myocarditis, arrhythmia, valvular failure", "Cool and mottled, raised jugular venous pressure, bibasal crackles, oliguria", "Inotrope, revascularisation or mechanical support, careful volume only if compensated"],
          ["Obstructive", "Mechanical obstruction to flow — tension pneumothorax, tamponade, pulmonary embolism", "Distended neck veins, deviated trachea or absent breath sounds in tension pneumothorax, sudden collapse in embolism", "Needle decompression and chest drain, pericardiocentesis, thrombolysis"],
        ],
      },
      {
        type: "paragraph",
        text: "Note the trap in the distributive row. The septic patient is warm and vasodilated and therefore looks better than the cold, mottled, hypovolaemic patient in the next bed, yet carries a higher mortality. Functional markers — capillary refill, urine output, lactate — detect septic shock before the blood pressure does, which is exactly why they are in the Sepsis Six.",
      },

      { type: "heading", level: 2, text: "Haemorrhagic shock: the ATLS classes" },
      {
        type: "paragraph",
        text: "For blood loss specifically, the American College of Surgeons grades patients into four classes. Grade the physiology first; the volume is inferred, not measured.",
      },
      {
        type: "table",
        headers: ["Class", "Blood lost", "Volume (70 kg)", "Heart rate", "Blood pressure", "Respiratory rate", "Urine output", "Mental state"],
        rows: [
          ["I", "Up to 15%", "Under 750 mL", "Below 100", "Normal", "14–20", "Over 30 mL/h", "Mildly anxious"],
          ["II", "15–30%", "750–1500 mL", "Over 100", "Normal", "20–30", "20–30 mL/h", "Anxious, frightened"],
          ["III", "30–40%", "1500–2000 mL", "Over 120", "Decreased", "30–40", "5–15 mL/h", "Anxious, confused"],
          ["IV", "Over 40%", "Over 2000 mL", "Over 140", "Decreased", "Over 40", "Negligible", "Confused, drowsy, then unresponsive"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Classes I and II are compensated: systolic pressure is maintained by tachycardia and vasoconstriction. Waiting for the pressure to fall loses the window in which haemostasis was achievable. In the young, fit patient, in patients on beta-blockers, and in pregnancy (where plasma volume expands by up to 50%), hypotension is a very late sign.",
      },

      { type: "heading", level: 2, text: "Compensatory physiology: why single numbers lie" },
      {
        type: "paragraph",
        text: "Compensation explains the clinical paradoxes. Baroreceptor unloading raises heart rate and contractility and constricts arterioles, holding pressure at the expense of perfusion. The renin-angiotensin-aldosterone axis and antidiuretic hormone retain sodium and water and mobilise interstitial fluid into the vascular space. The microcirculation closes its own precapillary sphincters, shunting blood away from skin, gut and muscle. In a healthy adult one litre of acute blood loss typically lowers systolic pressure by only 10–15 mmHg; in sepsis the opposite happens — diastolic pressure collapses while systolic holds up, so a diastolic of 40 mmHg with a heart rate of 120 is the true alarm.",
      },
      {
        type: "definition",
        term: "Mean arterial pressure (MAP)",
        text: "Approximately (systolic + 2 x diastolic) / 3: the pressure that actually perfuses organs. The initial target in septic shock is a MAP of at least 65 mmHg, with a higher target (75–80 mmHg) in chronic hypertension; urine output of 0.5 mL/kg/h and a falling lactate are the perfusion endpoints that matter.",
      },

      { type: "heading", level: 2, text: "Recognising deterioration" },
      {
        type: "paragraph",
        text: "Because compensation hides the crisis in any single value, hospitals track trends using an early warning score that aggregates physiology into one escalating number. The UK National Early Warning Score (NEWS2) scores seven variables.",
      },
      {
        type: "table",
        headers: ["NEWS2 component", "Scores 0 (normal)", "Scores 1–2 (moderate)", "Scores 3 (severe)"],
        rows: [
          ["Respiratory rate", "12–20/min", "9–11 or 21–24/min", "8 or less, or 25 or more per minute"],
          ["Oxygen saturation", "96% or above on room air", "94–95% on air, or 88–92% / 93%+ on oxygen", "91% or below on any oxygen"],
          ["Air versus oxygen", "Room air", "Any supplemental oxygen", "Not applicable"],
          ["Systolic blood pressure", "111–219 mmHg", "101–110 or 220–249 mmHg", "100 or less, or 250 mmHg or more"],
          ["Pulse", "51–90/min", "41–50 or 91–110/min", "40 or less, or 111–130 per minute"],
          ["Consciousness (AVPU)", "Alert", "Responds to voice", "Unresponsive — new confusion scores 3 in NEWS2"],
          ["Temperature", "36.1–38.0 °C", "35.1–36.0 or 38.1–39.0 °C", "35.0 °C or below, or 39.1 °C or above"],
        ],
      },
      {
        type: "example",
        text: "A 74-year-old man on a surgical ward has a respiratory rate of 24, heart rate 108, blood pressure 96/54 mmHg, temperature 38.4 °C, saturation 91% on air, and is drowsy but rousable. NEWS2: rate 2, saturation 2, oxygen 2, systolic 3, pulse 2, consciousness 3, temperature 2 = 16. A score of 7 or more mandates an emergency assessment by a team with critical-care competencies. He also meets the criteria for sepsis. Nobody checking only the blood pressure — the number most often taken last and recorded first — would have escalated.",
      },
      {
        type: "question",
        prompt: "A 25-year-old trauma patient has lost an estimated 1200 mL of blood. She is anxious, heart rate 116, blood pressure 108/64, respiratory rate 28, and has passed 15 mL of urine in the last hour. What class of haemorrhage is she, and what does the class not tell you?",
        answer: "Class III haemorrhage (30–40% loss, 1500–2000 mL): heart rate above 120 (she is at the border), respiratory rate 20–40, urine output 5–15 mL/h, anxious. The class describes the physiology she is generating in compensation; it does not tell you the volume that is still bleeding internally, which is the question that decides whether she needs theatre and interventional radiology.",
        explanation: "ATLS class is a physiological snapshot used to trigger a response — activated major haemorrhage protocol, blood products, senior and surgical review. The anatomy of ongoing loss is found by examination, focused ultrasound and computed tomography, not by re-grading the patient.",
      },

      { type: "heading", level: 2, text: "Worked example: one failure reached two ways" },
      {
        type: "paragraph",
        text: "Two ward patients both have a lactate of 4 mmol/L. The first, an 80-year-old with community-acquired pneumonia, has a respiratory rate of 32, saturation 88% on air and a temperature of 38.6 °C: her delivery is failing in the lungs (hypoxic hypoxia plus sepsis-driven vasodilatation), giving DO2 of roughly 450 mL/min, and she needs oxygen, non-invasive ventilation, antibiotics and fluid. The second, a 55-year-old with a bleeding duodenal ulcer, has a heart rate of 128, blood pressure 88/50 and haemoglobin of 5.8 g/dL: his CaO2 is about (5.8 x 1.34 x 0.95) = 7.4 mL/dL, so with a cardiac output of 6 L/min his DO2 is about 440 mL/min — a delivery failure generated in the blood, not the lungs. Same lactate, two diseases, two first treatments. The equation separates them; the lactate only tells you that they are both failing.",
      },
      {
        type: "callout",
        variant: "info",
        text: "A raised lactate is not always hypoxia. It also rises with beta-2 agonists (salbutamol), metformin accumulation, liver failure, thiamine deficiency and seizures. Lactate is a screening signal with a short differential, useful for tracking response to treatment, not a diagnosis in itself.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Believing a normal blood pressure excludes shock. In a fit adult, up to 30–40% of blood volume can be lost before systolic pressure falls. The early cluster is tachycardia, a narrowed pulse pressure, cool skin and delayed capillary refill.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing hypoxaemia (a low arterial oxygen content) with hypoxia (low tissue oxygen tension). A patient with a PaO2 of 8 kPa and a normal haemoglobin and cardiac output still delivers oxygen until the extraction reserve is exhausted; a patient with carbon monoxide poisoning has a normal PaO2 and profound tissue hypoxia.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Giving litres of fluid to a shocked patient before excluding obstruction. In tension pneumothorax, cardiac tamponade and massive pulmonary embolism the problem is outflow obstruction; fluid can worsen right ventricular distension while the definitive intervention is decompression, drainage or thrombolysis.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting the blunted phenotypes: the elderly, the beta-blocked, the pregnant and the athletic all suppress heart-rate and pressure responses. A patient on a beta-blocker cannot mount a tachycardia, and a pregnant patient loses nearly a third of her blood volume before the pressure falls — the fetus loses uteroplacental flow first.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Calculate arterial oxygen content and oxygen delivery for a patient with haemoglobin 8 g/dL, saturation 96%, cardiac output 4 L/min.",
        answer: "CaO2 = (8 x 1.34 x 0.96) + (PaO2 x 0.003) = 10.3 mL/dL, almost entirely from haemoglobin. DO2 = 4 x 10.3 x 10 = 412 mL/min, roughly 40% of the normal 1000 mL/min, at the point at which extraction becomes supply-dependent.",
        explanation: "Halving haemoglobin halves content, and it compounds with a fall in cardiac output. This is why an anaemic patient needs the haemoglobin treated, not just the saturation pushed to 100%.",
      },
      {
        type: "question",
        prompt: "A patient with septic shock has a blood pressure of 105/60 mmHg, warm peripheries, a capillary refill of 4 seconds, urine output of 12 mL/h and a lactate of 5 mmol/L. Is she shocked?",
        answer: "Yes. Her mean arterial pressure of about 75 mmHg looks adequate, but capillary refill, urine output and lactate all show inadequate tissue perfusion, and warm vasodilated peripheries with a low diastolic pressure are the signature of distributive shock.",
        explanation: "Shock is cellular hypoperfusion, not a number. Warm shock fools the eye because the patient is not cold and mottled; only functional markers reveal the failure.",
      },
      {
        type: "question",
        prompt: "A patient from a house fire has a saturation of 99%, is drowsy, and has a lactate of 10 mmol/L. Explain the physiology of the reassuring reading and name two mechanisms of hypoxia that carbon monoxide causes.",
        answer: "The two-wavelength oximeter reads carboxyhaemoglobin as oxyhaemoglobin, so saturation appears normal. Carbon monoxide causes anaemic hypoxia (each carboxyhaemoglobin carries no oxygen) and histotoxic hypoxia (it binds cytochrome oxidase and blocks cellular respiration), and it shifts the dissociation curve left, further impairing release.",
        explanation: "This is the single most important trap in acute medicine: a normal oximeter reading after smoke inhalation is not reassurance. Give high-flow 100% oxygen, measure carboxyhaemoglobin, and consider hyperbaric therapy for loss of consciousness, neurological signs or carboxyhaemoglobin above 25%.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A patient has a haemoglobin of 9 g/dL, cardiac output 5 L/min, arterial saturation 90% and a PaO2 of 8 kPa. Which term contributes least to her oxygen delivery?",
        options: [
          "Oxygen bound to haemoglobin",
          "Dissolved oxygen in plasma",
          "The cardiac output multiplier",
          "None of these — all contribute equally",
        ],
        correctIndex: 1,
        explanation: "Dissolved oxygen contributes PaO2 x 0.003, about 0.024 mL/dL, under 1% of content, whereas haemoglobin-bound oxygen contributes about 10.8 mL/dL and cardiac output is a multiplier of 5. The dissolved term only becomes relevant at hyperbaric pressures.",
      },
      {
        type: "mcq",
        stem: "Which pattern best fits class III haemorrhage in a 70 kg adult?",
        options: [
          "Heart rate 90, blood pressure 124/80, urine output 50 mL/h",
          "Heart rate 125, blood pressure 100/60, respiratory rate 34, urine output 10 mL/h",
          "Heart rate 60, blood pressure 130/85, respiratory rate 12, urine output 40 mL/h",
          "Heart rate 140, blood pressure 80/40, respiratory rate 6, urine output 0 mL/h",
        ],
        correctIndex: 1,
        explanation: "Class III is 30–40% loss (1500–2000 mL): heart rate above 120, falling blood pressure, respiratory rate 30–40 and urine output 5–15 mL/h with an anxious, confused patient. Option A is class I, option C is normal physiology, and option D is class IV.",
      },
      {
        type: "mcq",
        stem: "A trauma patient is hypotensive with distended neck veins, absent left breath sounds and a deviated trachea. Which mechanism of tissue hypoxia predominates before treatment?",
        options: [
          "Anaemic hypoxia from pleural blood loss",
          "Stagnant hypoxia from obstructed venous return",
          "Hypoxic hypoxia from alveolar flooding",
          "Histotoxic hypoxia from mitochondrial blockade",
        ],
        correctIndex: 1,
        explanation: "A tension pneumothorax raises intrathoracic pressure, kinks the great veins and obstructs ventricular filling, so cardiac output collapses while the lungs still partly load oxygen — stagnant hypoxia. Needle decompression in the second intercostal space mid-clavicular line, then a chest drain, restores flow.",
      },
      {
        type: "mcq",
        stem: "Which cluster is the earliest reliable marker of compensated hypovolaemic shock in an adult?",
        options: [
          "A fall in systolic blood pressure",
          "Confusion and drowsiness",
          "Tachycardia with cool peripheries and a narrowing pulse pressure",
          "A bounding pulse with a low diastolic pressure",
        ],
        correctIndex: 2,
        explanation: "Baroreceptor-mediated tachycardia and peripheral vasoconstriction preserve systolic pressure until class III–IV, so the earliest findings are tachycardia, narrowed pulse pressure, delayed capillary refill and cool skin. A fall in pressure is late, confusion is late, and a bounding pulse is distributive shock.",
      },
      {
        type: "mcq",
        stem: "A 70 kg man has heart rate 96, blood pressure 88/52 mmHg, temperature 38.7 °C, respiratory rate 26, saturation 92% on air and is drowsy but rousable. His NEWS2 is 15. What should happen now?",
        options: [
          "Repeat the score in an hour and review on the ward round",
          "Emergency assessment by a team with critical-care competencies and activation of the sepsis pathway",
          "Oral fluids and re-check in the morning",
          "Supplemental oxygen alone, since the blood pressure is the only concerning value",
        ],
        correctIndex: 1,
        explanation: "NEWS2 of 7 or more mandates emergency assessment by clinicians with critical-care competence. Alongside airway and oxygen and intravenous access, the sepsis pathway requires blood cultures, antibiotics within the hour, fluid resuscitation and lactate-guided reassessment.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Oxygen delivery is cardiac output x arterial oxygen content x 10, and the first pass of acute care raises one of those terms: oxygen, fluid, blood, inotropes, relief of obstruction. Tissue hypoxia has four mechanisms (hypoxic, anaemic, stagnant, histotoxic), shock has four categories (hypovolaemic, distributive, cardiogenic, obstructive) and haemorrhage has four classes read off physiology before the pressure falls. Early warning scores exist because compensation hides the crisis from any single measurement.",
      },
      {
        type: "paragraph",
        text: "Next: the drugs. You will take the same physiology and ask what each anaesthetic agent does to cardiac output, systemic vascular resistance, the airway and the neuromuscular junction — and why the ideal drug for a shocked trauma patient is the wrong one for the hypertensive one.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 2 — Applied anaesthetic pharmacology (fully authored)
// ---------------------------------------------------------------------------
function lesson2() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: name the intravenous induction agents with their doses and cardiovascular and respiratory effects, and choose the right one for a shocked, head-injured or asthmatic patient; define minimum alveolar concentration and list the factors that change it; explain context-sensitive half-time and apply it to choosing an opioid for a short versus a long case; describe the mechanism, duration and reversal of depolarising and non-depolarising neuromuscular blockers; and monitor depth of block with a train-of-four stimulator.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (Acute medicine and applied physiology) and the MBBS pharmacology course: receptors, receptor agonists and antagonists, first-pass metabolism, volume of distribution and clearance. You must be comfortable with the idea that the clinical duration of an infused drug is governed by equilibration into and out of peripheral tissue compartments.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Balanced anaesthesia",
        text: "The practice of combining small doses of several agents — hypnosis, analgesia, amnesia and muscle relaxation — instead of relying on one agent given deeply. Each component is titrated to its own endpoint, so the dose of each, and therefore the harm of each (hypotension, respiratory depression, delayed awakening), stays small.",
      },
      {
        type: "paragraph",
        text: "Anaesthesia is not sleep induced by one drug; it is the reversible suspension of awareness, memory, movement and pain, delivered as a combination. The organising concept of this lesson is context sensitivity: where a drug goes after it enters the blood determines how long its effect lasts once the infusion stops. Fentanyl is a short-acting drug for a 20-minute operation and a long-acting one for a four-hour case. The same idea explains why suxamethonium wears off in five minutes while rocuronium takes forty, and why the choice of reversal (neostigmine or sugammadex) depends on which blocker was given.",
      },

      { type: "heading", level: 2, text: "Intravenous induction agents" },
      {
        type: "table",
        headers: ["Agent", "Induction dose (IV)", "Mechanism", "Principal effects and cautions"],
        rows: [
          ["Propofol", "1.5–2.5 mg/kg; reduce to about 1 mg/kg in the frail elderly", "GABA-A receptor agonist", "Hypotension (vasodilatation plus myocardial depression), apnoea, pain on injection; anticonvulsant; lowers intracranial and intraocular pressure. Propofol infusion syndrome with prolonged high-dose infusion: lactic acidosis, rhabdomyolysis, lipaemia"],
          ["Thiopental", "3–5 mg/kg", "GABA-A agonist (barbiturate)", "Rapid reliable induction with profound respiratory depression and negative inotropy; historically the agent for rapid-sequence induction in the shocked patient and still used in status epilepticus in some protocols"],
          ["Etomidate", "0.3 mg/kg", "GABA-A modulation (imidazole)", "Cardiostable — the classic choice in the shocked or elderly patient — but causes adrenocortical suppression (inhibition of 11-beta-hydroxylase) even after one dose, myoclonus, pain on injection and thrombophlebitis"],
          ["Ketamine", "1–2 mg/kg IV, 10 mg/kg IM", "NMDA-receptor antagonist", "Dissociative anaesthesia with sympathomimetic action: preserves blood pressure, bronchodilates (useful in severe asthma), but raises intracranial and intraocular pressure, causes hypersalivation and emergence delirium; a controlled drug"],
          ["Midazolam", "0.05–0.1 mg/kg titrated", "Benzodiazepine acting at GABA-A", "Anxiolysis and antegrade amnesia; synergistic respiratory depression with opioids; prolonged effect in the elderly because of an active metabolite; reversed by flumazenil, which is short-acting so relapse occurs"],
        ],
      },
      {
        type: "paragraph",
        text: "Choose from the physiology, not from habit. The shocked trauma patient needs etomidate or ketamine because propofol will drop the vascular resistance and cardiac output maintaining the pressure. The patient with a head injury needs propofol or thiopental because they lower cerebral metabolic rate and intracranial pressure, and must never receive ketamine. The severe asthmatic needs ketamine for its bronchodilation. Induction doses must also be reduced in the elderly, the premedicated and the recently opioid-dosed patient, because the clinical end point — loss of response to verbal command and loss of the eyelash reflex — arrives earlier than the syringe calculation suggests.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Apnoea on induction is expected, and failure to recognise it in time is a recognised cause of perioperative hypoxic arrest. Preoxygenate for three minutes of tidal breathing (or eight vital-capacity breaths), and have suction, a working bag-mask, a supraglottic airway and an assistant present before giving the first drug. Never induce a patient alone.",
      },

      { type: "heading", level: 2, text: "Inhalational agents and MAC" },
      {
        type: "definition",
        term: "Minimum alveolar concentration (MAC)",
        text: "The alveolar concentration of an inhalational agent, expressed as a percentage at sea level, at which 50% of patients do not move in response to a standard surgical stimulus. It is the potency scale of the volatiles: about 1.3 MAC suppresses movement in 95% of patients, while a patient at 1 MAC may still respond and may retain recall.",
      },
      {
        type: "table",
        headers: ["Agent", "MAC in oxygen", "Blood:gas solubility", "Practical notes"],
        rows: [
          ["Sevoflurane", "About 2.0%", "0.65 (low)", "Pleasant and non-pungent, so the standard agent for inhalational induction; compound A accumulation at low fresh-gas flows"],
          ["Isoflurane", "About 1.15%", "1.4", "Pungent, vasodilator, the workhorse maintenance agent and cheap; coronary steal debate now largely discounted"],
          ["Desflurane", "6.0–6.6%", "0.42 (very low)", "Very fast emergence but pungent and airway-irritant (coughing, laryngospasm, sympathetic surge); needs a heated pressurised vaporiser"],
          ["Nitrous oxide", "About 104% (incomplete at 1 atm)", "0.47", "Good analgesia but weak potency; diffuses into air-filled spaces (contraindicated in bowel obstruction, pneumothorax and middle-ear surgery); oxidises cobalt in vitamin B12 metabolism (megaloblastic change with prolonged exposure); causes diffusion hypoxia on abrupt withdrawal"],
          ["Xenon", "About 0.7%", "0.014", "Rapid, cardiostable and almost no emergence delay; expensive and not widely available"],
        ],
      },
      {
        type: "paragraph",
        text: "Two gas properties govern speed. Solubility governs uptake: an agent with low blood:gas solubility (desflurane, xenon) is taken up slowly from alveolus into blood, so the alveolar fraction rises quickly and induction and emergence are fast. The second is the concentration effect and its companion, the second-gas effect: the higher the inspired concentration of a gas, the faster its alveolar concentration rises, and a rapidly taken-up gas such as nitrous oxide accelerates uptake of concurrently administered agents. This is why nitrous oxide was used to speed induction in the era of halothane.",
      },
      {
        type: "callout",
        variant: "info",
        text: "MAC is a potency measure, not a safety measure. MAC falls with advanced age (up to 30% by age 80), hypothermia, pregnancy, opioids, benzodiazepines, alpha-2 agonists and neuromuscular blockade, and rises with chronic alcohol use and in young children. Movement under anaesthesia may be inadequate paralysis rather than inadequate hypnosis — check the twitch monitor before deepening the volatile.",
      },

      { type: "heading", level: 2, text: "Opioids and context-sensitive half-time" },
      {
        type: "definition",
        term: "Context-sensitive half-time",
        text: "The time for plasma concentration to fall by 50% after stopping a continuous infusion of a given duration (the 'context'). For a short context, redistribution dominates and the half-time is short; as the infusion lengthens, peripheral compartments saturate and the half-time lengthens — steeply for some drugs and hardly at all for others.",
      },
      {
        type: "table",
        headers: ["Opioid", "Typical dosing", "Metabolism and duration", "Context-sensitive half-time"],
        rows: [
          ["Fentanyl", "1–2 mcg/kg IV bolus; repeat 25–50 mcg", "Hepatic CYP3A4 to inactive metabolites", "Short for boluses, then lengthens markedly with infusion as peripheral compartments fill — the classic example of a drug that becomes long-acting"],
          ["Remifentanil", "0.1–0.5 mcg/kg/min titrated to stimulus", "Hydrolysed by non-specific plasma and tissue esterases", "Flat at about 3–4 minutes regardless of infusion length — its defining property; have other analgesia in place before stopping"],
          ["Morphine", "0.1 mg/kg IV; oral 5–10 mg every 4 hours", "Glucuronidation; morphine-6-glucuronide is an active metabolite cleared by the kidney", "Long and not context-sensitive; accumulation in renal impairment gives delayed respiratory depression; histamine release causes hypotension and itch"],
          ["Alfentanil and sufentanil", "Alfentanil 10–30 mcg/kg", "Hepatic, with a smaller volume of distribution than fentanyl", "Shorter half-times than fentanyl at all infusion durations, so suiting infusions for stimulating surgery"],
        ],
      },
      {
        type: "paragraph",
        text: "Opioids are not anaesthetics: they blunt the sympathetic response to pain and reduce the volatile requirement but do not reliably produce unconsciousness. Their predictable adverse effects are dose-dependent respiratory depression (respiratory rate falls before tidal volume), chest-wall rigidity after rapid high-dose fentanyl, nausea and vomiting, sedation, constipation, urinary retention and pruritus. Reverse with naloxone titrated in 100 microgram increments to a respiratory rate of 10–12 rather than to full arousal, because full reversal precipitates withdrawal, severe pain and a catecholamine surge with arrhythmia and pulmonary oedema. Respiratory depression returns if the antagonist is shorter-acting than the agonist — true of every opioid except remifentanil.",
      },

      { type: "heading", level: 2, text: "Neuromuscular blockade and its reversal" },
      {
        type: "paragraph",
        text: "Muscle relaxants are neither anaesthetics nor analgesics: they facilitate intubation and relax the abdominal wall, and they paralyse a patient who may otherwise be fully awake. Peripheral nerve stimulation is mandatory whenever they are used.",
      },
      {
        type: "table",
        headers: ["Agent", "Mechanism", "Dose and duration", "Key clinical points"],
        rows: [
          ["Suxamethonium", "Depolarising — persistent agonist at the nicotinic receptor, causing depolarisation then desensitisation", "1–1.5 mg/kg IV; onset 30–60 s, duration 5–10 min", "The only rapid-onset, short-duration blocker. Fasciculations, myalgia, a transient rise in potassium of about 0.5 mmol/L, raised intracranial and intraocular pressure, bradycardia (especially on a second dose), phase II block with repeated dosing, and it triggers malignant hyperthermia"],
          ["Rocuronium", "Non-depolarising — competitive antagonist at the receptor", "0.6 mg/kg: onset 60–90 s, 30–60 min. 1.2 mg/kg for rapid-sequence induction (onset 45–60 s)", "The alternative to suxamethonium when sux is contraindicated, and reversible at any depth with sugammadex"],
          ["Vecuronium", "Non-depolarising", "0.1 mg/kg, 30–60 min", "Cardiovascularly stable; historically the standard for abdominal surgery"],
          ["Atracurium and cisatracurium", "Non-depolarising", "Atracurium 0.5 mg/kg; cisatracurium 0.15 mg/kg", "Degrade by Hofmann elimination (spontaneous, temperature- and pH-dependent), so suited to renal and hepatic failure; atracurium releases histamine and laudanosine"],
          ["Pancuronium", "Non-depolarising", "0.05–0.1 mg/kg, long-acting", "Vagolytic tachycardia; rarely used now, but a cause of residual paralysis when chosen for speed alone"],
        ],
      },
      {
        type: "definition",
        term: "Train of four and post-operative residual curarisation",
        text: "Four supramaximal stimuli delivered at 2 Hz. With a non-depolarising block the response fades — four twitches, then three, two, one, none — as depth increases. Recovery needs a train-of-four ratio (fourth twitch over first) above 0.9. Post-operative residual curarisation is block persisting into recovery: below a ratio of 0.9 it causes pharyngeal dysfunction, airway obstruction, aspiration and impaired hypoxic ventilatory response, and is prevented by objective monitoring plus adequate reversal.",
      },
      {
        type: "table",
        headers: ["Reversal", "Mechanism", "Dose", "When it works and its limits"],
        rows: [
          ["Neostigmine", "Acetylcholinesterase inhibitor, raising acetylcholine to compete with the blocker at the receptor", "0.05 mg/kg (maximum 5 mg) with glycopyrrolate or atropine against muscarinic effects", "Reverses non-depolarising block only, and only once some recovery has occurred (at least two twitches); its effect plateaus, so a deeply blocked patient stays paralysed"],
          ["Sugammadex", "Gamma-cyclodextrin that encapsulates rocuronium and vecuronium in plasma, forming an inactive complex excreted in urine", "2 mg/kg with two twitches; 4 mg/kg at a post-tetanic count of 1–2; 16 mg/kg for immediate reversal 3 minutes after 1.2 mg/kg rocuronium", "Reverses at any depth, at the receptor-independent level, without muscarinic side effects; does not reverse suxamethonium or non-steroidal blockers, and may reduce hormonal contraceptive efficacy for a week"],
        ],
      },
      {
        type: "question",
        prompt: "A patient received suxamethonium then a rocuronium infusion for a three-hour operation, and the train-of-four count is now zero. Why is sugammadex appropriate and neostigmine not?",
        answer: "Neostigmine works by competing at the nicotinic receptor, so it can only potentiate recovery once receptors are no longer saturated — with zero twitches there is nothing to potentiate. Sugammadex encapsulates rocuronium directly in plasma regardless of depth, so the 16 mg/kg dose reverses even immediate post-intubation block.",
        explanation: "The distinction is mechanistic: neostigmine raises the agonist (acetylcholine) at a partially recovered receptor; sugammadex removes the antagonist (rocuronium) from the plasma. Sugammadex cannot reverse suxamethonium, a depolarising agonist, so it is given only once sux has decayed.",
      },

      { type: "heading", level: 2, text: "Worked example: one plan, one justification per drug" },
      {
        type: "paragraph",
        text: "A 68-year-old on a beta-blocker and a statin needs a laparoscopic cholecystectomy. Preoxygenate; induce with propofol titrated to 1–1.5 mg/kg (reduced for age, fasting and beta-blockade); give fentanyl 1–2 mcg/kg as the analgesic component; intubate with rocuronium 0.6 mg/kg rather than suxamethonium, which would raise potassium and could cause dangerous bradycardia in a beta-blocked patient. Maintain with sevoflurane or a propofol infusion and build multimodal analgesia: paracetamol, local anaesthetic infiltration at the port sites, a non-steroidal anti-inflammatory drug if renal function allows, and further fentanyl guided by heart rate and pressure. Reverse with sugammadex or neostigmine plus glycopyrrolate, confirm a train-of-four ratio above 0.9, and extubate awake. The fallback if induction fails the airway is the failed-intubation drill: call for help, oxygenate with bag-mask and a supraglottic airway, and wake the patient.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Full-dose propofol in a patient who is hypovolaemic, elderly, or has already had an opioid or benzodiazepine. The resulting vasodilatation is the commonest cause of avoidable perioperative hypotension and of peri-operative cardiac arrest in fit patients.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Using ketamine where intracranial or intraocular pressure is raised — head injury, intracranial mass, open globe injury. It raises cerebral metabolic rate and intraocular pressure; equating 'cardiostable' with 'safe in everyone' is the error.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating suxamethonium's short duration as safety. It causes dangerous hyperkalaemia in burns after the first 24 hours (up to 60 days), spinal cord injury, stroke with paresis, prolonged immobility and muscular dystrophy, and it triggers malignant hyperthermia. Rocuronium is the appropriate substitute in every one of these.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Stopping a remifentanil infusion with no other analgesia in place. Its context-insensitive ultra-short action means the analgesia ends within minutes, leaving a patient waking to severe pain and sympathetic surge. Give the non-opioid or regional component before stopping.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Extubating because the patient 'looks comfortable' without monitoring the block. Residual paralysed weakness after arrival in recovery is entirely preventable and is one of the drivers of postoperative respiratory complications; the endpoint is an objective train-of-four ratio above 0.9.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why is remifentanil ideal for a case that could end after ten minutes, but unsuitable as the sole post-operative analgesic plan?",
        answer: "Its plasma and tissue esterase hydrolysis gives a flat context-sensitive half-time of about 3–4 minutes, so it stops working predictably whatever the infusion duration — perfect for titratable intraoperative analgesia. It leaves no residual effect, so analgesia after the infusion must come from another drug or from a block.",
        explanation: "The flat context-sensitive half-time is the pharmacokinetic signature of organ-independent clearance; fentanyl and morphine, whose half-times rise with infusion length, accumulate and provide prolonged analgesia at the price of respiratory depression.",
      },
      {
        type: "question",
        prompt: "Which induction agent would you choose for a shocked patient with a ruptured abdominal aortic aneurysm, and why not the sedating alternative most often used for induction in procedures?",
        answer: "Etomidate or ketamine, because both preserve blood pressure and cardiac output. Propofol, the agent most often used for elective induction, causes vasodilatation and myocardial depression and would deepen the shock.",
        explanation: "The single-dose etomidate adrenal suppression is real but small compared with the haemodynamic collapse caused by propofol in hypovolaemia; this is the standard trade-off in emergency induction.",
      },
      {
        type: "question",
        prompt: "A patient given a large fentanyl dose has a respiratory rate of 6 and is unrousable. Outline your management.",
        answer: "Assist ventilation with bag-mask and oxygen, monitor saturation and capnography, and titrate naloxone in 100 microgram increments until the respiratory rate is about 10–12, not until full arousal. Continue observation for at least 30 minutes, because fentanyl outlasts naloxone and re-narcotisation occurs.",
        explanation: "Full reversal precipitates acute withdrawal, sympathetic surge, arrhythmia, pulmonary oedema and return of severe pain; the therapeutic target is ventilation. Other causes of coma — hypoglycaemia, head injury, other sedatives — must be excluded in parallel.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which induction agent is most appropriate for emergency intubation of a patient with a systolic pressure of 70 mmHg from a ruptured spleen?",
        options: [
          "Propofol 2.5 mg/kg",
          "Etomidate 0.3 mg/kg or ketamine 1–2 mg/kg",
          "Thiopental 4 mg/kg",
          "Sevoflurane 8% inhalational induction",
        ],
        correctIndex: 1,
        explanation: "Etomidate or ketamine preserve blood pressure and cardiac output. Propofol and thiopental are vasodilators and negative inotropes that deepen the shock, and an inhalational induction in a hypovolaemic patient takes an unpredictable time and also vasodilates.",
      },
      {
        type: "mcq",
        stem: "Which statement about minimum alveolar concentration is correct?",
        options: [
          "MAC is the concentration preventing movement in 100% of patients",
          "MAC is lowered by advanced age, hypothermia, pregnancy, opioids and clonidine",
          "MAC measures the cardiovascular safety of an agent",
          "MAC is unaffected by co-administered drugs because it is intrinsic to the volatile",
        ],
        correctIndex: 1,
        explanation: "MAC prevents movement in 50% of patients; about 1.3 MAC suppresses 95%. It falls with age, hypothermia, pregnancy, opioids, benzodiazepines and alpha-2 agonists, and rises with chronic alcohol use and in children. It says nothing about cardiovascular effects, which differ between agents.",
      },
      {
        type: "mcq",
        stem: "Which property most clearly distinguishes remifentanil from fentanyl when given as an infusion?",
        options: [
          "Remifentanil is more potent per microgram",
          "Remifentanil's context-sensitive half-time stays flat at about 3–4 minutes regardless of infusion duration",
          "Remifentanil accumulates in renal failure",
          "Remifentanil is reversed by naloxone with a longer duration of action",
        ],
        correctIndex: 1,
        explanation: "Remifentanil is hydrolysed by plasma and tissue esterases, giving a flat context-sensitive half-time of 3–4 minutes; fentanyl's half-time lengthens with infusion as peripheral compartments saturate. Neither is selectively renal, and naloxone reverses both for a shorter time than most opioids.",
      },
      {
        type: "mcq",
        stem: "A patient given rocuronium 0.6 mg/kg 45 minutes ago has two twitches on train of four with a ratio of 0.4. What is the appropriate pharmacological reversal?",
        options: [
          "Suxamethonium to restore the twitch count",
          "Neostigmine with glycopyrrolate, or sugammadex 2 mg/kg",
          "Sodium bicarbonate",
          "Further rocuronium before extubation",
        ],
        correctIndex: 1,
        explanation: "With a recovering but inadequate non-depolarising block, neostigmine at its maximally effective dose or sugammadex 2 mg/kg (the two-twitch dose) both produce reversal. Suxamethonium cannot reverse a non-depolarising block and would add a depolarising block.",
      },
      {
        type: "mcq",
        stem: "In which patient is suxamethonium contraindicated?",
        options: [
          "A 20-year-old needing rapid-sequence induction for appendicectomy",
          "A 30-year-old with a 40% burn sustained three days ago",
          "A patient with a partial residual rocuronium block",
          "A patient with a full stomach for caesarean section",
        ],
        correctIndex: 1,
        explanation: "After the first 24 hours, burns up-regulate extra-junctional nicotinic receptors, so suxamethonium releases enough potassium to cause arrhythmia or arrest. It remains indicated for rapid-sequence induction with a full stomach and within the first 24 hours after a burn.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Anaesthetic drugs are chosen from the physiology of the patient: etomidate or ketamine for shock, propofol or thiopental for raised intracranial pressure, rocuronium instead of suxamethonium where hyperkalaemia is a risk, remifentanil for titratable short-duration analgesia. MAC is the potency scale of the volatiles; context-sensitive half-time explains why the same fentanyl infusion is short for a 20-minute case and long for a four-hour one; and every block must be reversed to an objectively measured train-of-four ratio above 0.9.",
      },
      {
        type: "paragraph",
        text: "Next: the algorithm that ties the pharmacology together — basic and advanced life support. The same drugs (adrenaline, amiodarone, naloxone) appear again, but in a sequence dictated by rhythm rather than by case, and alongside the four reversible causes the algorithm exists to treat.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 3 — Resuscitation (fully authored)
// ---------------------------------------------------------------------------
function lesson3() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: run the adult basic life support sequence in the correct order with the correct compression rate, depth and ratio; operate a defibrillator and say which rhythms are shockable; recite the four Hs and four Ts and give the drug and dose used in each limb of the algorithm; describe the paediatric modifications (five rescue breaths first, 15:2, weight-based adrenaline, 4 J/kg); and deliver the immediate post-return-of-spontaneous-circulation care that determines neurological outcome.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (oxygen delivery and shock) and Lesson 2 (pharmacology: adrenaline, amiodarone, naloxone). The teaching follows the European Resuscitation Council and Resuscitation Council UK 2021 guidelines; hospital arrest numbers, team structure and local protocols follow your hospital's in-hospital resuscitation policy.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Chain of survival",
        text: "The five linked steps determining survival from cardiac arrest: early recognition and call for help, early cardiopulmonary resuscitation, early defibrillation, early advanced life support, and post-resuscitation care. Survival falls by roughly 10% for every minute that defibrillation is delayed, so the collapse of any single link — most commonly the delay in starting compressions — is what kills.",
      },
      {
        type: "paragraph",
        text: "Resuscitation is the one situation in which the diagnosis is made by the absence of signs and the treatment is delivered in a fixed order rather than a differential-diagnosis order. The patient is unresponsive and not breathing normally, so you act: compressions, shock, and a running list of reversible causes. Basic life support buys time — oxygenated blood reaching the brain and coronary arteries by hand — while advanced life support treats the cause. Ventricular fibrillation is a mechanical problem solved electrically; asystole and pulseless electrical activity are almost never solved electrically, and their treatment is the reversible causes and adrenaline.",
      },

      { type: "heading", level: 2, text: "Adult basic life support" },
      {
        type: "table",
        headers: ["Step", "What you do", "The numbers that matter"],
        rows: [
          ["Danger and response", "Check for hazards, then speak loudly and shake the shoulders", "Any groaning, movement or eye-opening is a response — stop and reassess; no response starts the sequence"],
          ["Shout for help", "Call the resuscitation team (2222 in UK hospitals) and send for the defibrillator without leaving the patient", "The second rescuer fetches equipment while the first starts compressions"],
          ["Airway", "Head-tilt chin-lift; jaw thrust if cervical spine injury is possible, with in-line stabilisation", "Turn the patient onto the back on a firm, flat surface"],
          ["Breathing", "Look for chest movement, listen at the mouth and feel for breath, for no more than 10 seconds", "Agonal gasps are NOT normal breathing — treat as cardiac arrest"],
          ["Chest compressions", "Heel of one hand on the lower half of the sternum, other hand on top, fingers interlaced, arms vertical with shoulders over the hands", "Rate 100–120 per minute, depth 5–6 cm, allow full recoil, minimise pauses, change the compressor every 2 minutes"],
          ["Ratio", "30 compressions to 2 breaths for a single rescuer, with 2 rescue breaths each of about 1 second", "Two or more rescuers: 30:2 still, but the compressor changes every 2 minutes; compression-only CPR is acceptable if you cannot or will not deliver breaths"],
          ["Defibrillation", "Attach pads, analyse, deliver one shock and resume compressions immediately", "Shockable: ventricular fibrillation and pulseless ventricular tachycardia. Continue 2 minutes of CPR before re-analysis whatever the rhythm"],
        ],
      },
      {
        type: "definition",
        term: "Agonal breathing",
        text: "Slow, irregular, gasping or snoring respirations occurring in the first minutes of cardiac arrest. It is a brainstem reflex, not effective ventilation. Recognising it as 'not normal breathing' is one of the commonest failures of both lay and professional rescuers and delays compressions.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Interruptions are what kill coronary and cerebral perfusion pressure, and rebuilding it takes several compressions after every pause. Target a hands-off time under 5 seconds per 2-minute cycle, and never pause for intubation, a pulse check, moving the patient, or attaching the defibrillator if that can be done around compressions.",
      },

      { type: "heading", level: 2, text: "Advanced life support" },
      {
        type: "paragraph",
        text: "The advanced algorithm branches on rhythm, but three actions are common to both branches: high-quality CPR, a shockable-versus-non-shockable decision, and a running list of reversible causes. Adrenaline is the only drug in the algorithm; amiodarone is for refractory shockable rhythms only.",
      },
      {
        type: "table",
        headers: ["Rhythm", "Shockable", "Immediate action", "Drugs during the 2-minute loops"],
        rows: [
          ["Ventricular fibrillation", "Yes", "One shock: 150–200 J biphasic (360 J monophasic), then CPR for 2 minutes", "Adrenaline 1 mg IV or intraosseous after the third shock, then every 3–5 minutes (every other loop); amiodarone 300 mg after the third shock, then 150 mg for further shocks"],
          ["Pulseless ventricular tachycardia", "Yes", "As for ventricular fibrillation", "As for ventricular fibrillation"],
          ["Asystole", "No", "CPR immediately; confirm with a three-lead check and gain, looking for very fine ventricular fibrillation mimicking asystole", "Adrenaline 1 mg IV or IO as soon as access is obtained, then every 3–5 minutes; atropine only for organised P-wave activity, 3 mg maximum"],
          ["Pulseless electrical activity", "No", "CPR immediately — the electrocardiogram is organised but there is no pulse, so hunt the reversible causes", "Adrenaline 1 mg then every 3–5 minutes; fluid for hypovolaemia; no shock and no amiodarone"],
        ],
      },
      {
        type: "paragraph",
        text: "Note the placement of adrenaline: in the shockable branch it comes after the third shock, that is from the second loop, not before the first shock — early adrenaline has not improved outcome and defibrillation takes priority. In the non-shockable branch it is given as soon as vascular access is secured. Amiodarone 300 mg is given after the third shock for refractory ventricular fibrillation or pulseless ventricular tachycardia, with a further 150 mg possible; lidocaine 1 mg/kg is the alternative if amiodarone is unavailable, and magnesium 2 g (8 mmol) is for torsades de pointes or suspected hypomagnesaemia.",
      },
      {
        type: "definition",
        term: "Waveform capnography during cardiac arrest",
        text: "Continuous end-tidal carbon dioxide measurement, the only way to confirm tracheal tube placement without interrupting compressions. A value below about 1.3 kPa with otherwise good-quality CPR suggests very low pulmonary blood flow and that compressions need improving or a reversible cause must be found; a sudden sustained rise to above 4 kPa usually indicates return of spontaneous circulation.",
      },

      { type: "heading", level: 2, text: "The reversible causes: four Hs and four Ts" },
      {
        type: "paragraph",
        text: "Every arrest gets a systematic hunt for the reversible causes, because treating one of them can convert an otherwise fatal rhythm into a survivable one. The mnemonic is the four Hs and the four Ts, and each has a specific, immediately available treatment.",
      },
      {
        type: "table",
        headers: ["Cause", "How it produces arrest", "Bedside clue", "Immediate treatment"],
        rows: [
          ["Hypoxia", "Cells cannot generate ATP without oxygen; the conduction system fails", "Cyanosis, difficult bag-mask ventilation, low saturation", "High-quality airway; 100% oxygen; the definitive airway if the team is skilled"],
          ["Hypovolaemia", "No preload, no cardiac output", "Visible bleeding, empty circulation, poor capillary refill", "Two large-bore cannulae, a balanced crystalloid bolus, activate the major haemorrhage protocol and give blood"],
          ["Hypo- or hyperkalaemia and other metabolic derangements", "Potassium and pH extremes destabilise the myocardium", "Renal failure, dialysis, drugs, diabetic ketoacidosis", "Check the blood gas; calcium chloride for hyperkalaemia, insulin-dextrose, and for hypokalaemia potassium chloride with magnesium"],
          ["Hypothermia", "Below 30 °C the myocardium is irritable and refractory to defibrillation, and drugs accumulate", "Cold environment, exposure, immersion, near-drowning", "Warm the patient: warm intravenous fluids, heated humidified oxygen, forced-air warming, and pleural or peritoneal lavage in refractory cases"],
          ["Tension pneumothorax", "Rising intrathoracic pressure obstructs venous return", "Absent breath sounds, deviated trachea, distended veins, history of trauma or central line", "Needle decompression second intercostal space mid-clavicular line, then a chest drain"],
          ["Cardiac tamponade", "The pericardium constrains filling", "Penetrating chest trauma, distended veins with hypotension after cardiac surgery or a myocardial infarct", "Pericardiocentesis; surgical pericardiotomy if the arrest is witnessed and the team is present"],
          ["Toxins and drugs", "Direct myocardial or metabolic toxicity", "Empty packets, needle marks, pinpoint pupils, poisoning history, poisoning with beta-blockers, calcium-channel blockers, digoxin or tricyclics", "Targeted antidotes: naloxone for opioids, lipid emulsion for local anaesthetic toxicity, digoxin-specific antibody fragments, high-dose insulin euglycaemic therapy; give prolonged resuscitation because survival is reported"],
          ["Thrombosis — pulmonary or coronary", "Massive pulmonary embolism obstructs the right heart; a large coronary thrombosis causes pump failure", "Sudden collapse, pleuritic pain, or preceding chest pain and risk factors", "Thrombolysis (or surgical or catheter embolectomy); percutaneous coronary intervention for a primary cardiac cause"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Hypokalaemia and acidosis are not only consequences of arrest — they are causes of refractory arrest. After prolonged resuscitation, check the blood gas and the electrolytes before concluding the case futile; a potassium of 2.5 mmol/L and a pH of 6.9 will defeat every other intervention until they are corrected.",
      },

      { type: "heading", level: 2, text: "Paediatric modifications" },
      {
        type: "table",
        headers: ["Element", "Adult", "Child (1 year to puberty)", "Infant under 1 year"],
        rows: [
          ["Opening sequence", "30:2 after 30 compressions", "Five initial rescue breaths, then 30:2 single rescuer and 15:2 with two or more", "Five initial rescue breaths, then 15:2 with two or more rescuers"],
          ["Compression depth", "5–6 cm", "At least one third of the chest depth (about 5 cm)", "At least one third of the chest depth (about 4 cm)"],
          ["Defibrillation energy", "150–200 J biphasic", "4 J/kg, escalating to 10 J/kg for later shocks", "4 J/kg"],
          ["Adrenaline", "1 mg every 3–5 minutes", "10 micrograms/kg IV or IO (0.1 mL/kg of 1:10,000)", "10 micrograms/kg IV or IO, ideally umbilical venous or intraosseous"],
          ["Cause emphasis", "Ischaemic heart disease", "Respiratory failure, hypoxia, trauma and drowning", "Respiratory distress and hypoxia, congenital disease, sudden infant death"],
        ],
      },
      {
        type: "paragraph",
        text: "The physiological reason for the paediatric difference is the cause: children arrest through hypoxia, so ventilation belongs first, and their circulation is rate-dependent, so shocks and drugs are weight-based. Newborn resuscitation is a third algorithm: dry, wrap, warm, assess tone and breathing, then inflation breaths, and only 3:1 chest compressions to ventilation if the heart rate remains below 60 despite effective ventilation.",
      },

      { type: "heading", level: 2, text: "After return of spontaneous circulation" },
      {
        type: "paragraph",
        text: "Survival is decided after the pulse returns. The immediate after-care targets the causes of secondary brain injury — hypoxia, hypotension, hypo- and hyperglycaemia, hyperthermia and hyperventilation.",
      },
      {
        type: "table",
        headers: ["Target", "Goal", "Why"],
        rows: [
          ["Oxygen saturation", "94–98%", "Hyperoxia increases oxidative injury and causes coronary vasoconstriction"],
          ["Ventilation", "Normal end-tidal carbon dioxide 4.5–5.0 kPa", "Hypocapnia constricts cerebral vessels and reduces cerebral blood flow"],
          ["Blood pressure", "Systolic at least 100–120 mmHg, or as clinically indicated", "A single hypotensive episode worsens the neurological outcome"],
          ["Temperature", "Controlled cooling at 32–36 °C for at least 24 hours, avoiding fever for 72 hours", "Each degree above 37 °C worsens outcome after arrest"],
          ["Glucose", "7.8–10 mmol/L, avoiding hypoglycaemia", "Hyperglycaemia worsens neuronal injury; hypoglycaemia is worse"],
          ["Coronary reperfusion", "Emergency coronary angiography when the cause is cardiac", "Acute coronary occlusion is the commonest cause and is treatable"],
        ],
      },
      {
        type: "question",
        prompt: "A patient arrives in the emergency department with ventricular fibrillation and receives a shock at 4 minutes. Why is a second bystander with a bag-mask more valuable at this moment than a second doctor with a second defibrillator?",
        answer: "Because the rate-limiting step is not the shock — it is the resumption of chest compressions after the shock and the quality of oxygenation during 2-minute cycles. Defibrillation takes seconds; rebuilding coronary perfusion pressure with compressions takes minutes, and a shock without a preceding and following minute of good compressions is far less likely to succeed.",
        explanation: "Survival falls about 10% per minute without defibrillation, but it also falls with poor-quality compressions. One compressor plus one airway-and-ventilation provider is the highest-yield two-person team, with the defibrillator pads already on the patient.",
      },

      { type: "heading", level: 2, text: "Worked example: the rhythm decides the drug" },
      {
        type: "paragraph",
        text: "Two patients collapse. The first has ventricular fibrillation: shock, 2 minutes of CPR, adrenaline 1 mg after the third shock, amiodarone 300 mg after the third shock, and so on in loops. The second has pulseless electrical activity after a femoral fracture and 2 litres of concealed intra-abdominal blood: no shock, adrenaline 1 mg immediately with vascular access, and the actual treatment is two large-bore cannulae, a balanced crystalloid bolus, activation of the major haemorrhage protocol and surgery. The same checklist, opposite drugs, and the second patient will die if the team spends the first two minutes looking for the defibrillator.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Delaying compressions to look for a pulse or to analyse a rhythm for longer than 10 seconds. The lay and professional error is spending time on diagnosis that basic life support resolves immediately: unresponsive plus not breathing normally equals start compressions.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Missing agonal gasps as cardiac arrest, or conversely starting compressions on a patient who is only having a reflex breath. Agonal gasping is a sign of arrest; regular breathing is a sign to stop the sequence.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Stopping resuscitation in a hypothermic patient too early. Nobody is dead until they are warm and dead: a patient with a core temperature below 30 °C may have a refractory myocardium that responds to defibrillation and drugs only after warming.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Giving naloxone as a reflex in opioid overdose without the rest of the algorithm. Naloxone is a reversible-cause treatment, given titrated in the arrest setting, and it is not a substitute for ventilation: in respiratory arrest the patient needs assisted ventilation first.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "List the four Hs and four Ts, and give the single most immediately reversible of them with its first intervention.",
        answer: "Hypoxia, hypovolaemia, hypo- or hyperkalaemia and other metabolic derangements, hypothermia; tension pneumothorax, cardiac tamponade, toxins, thrombosis (pulmonary and coronary). Hypoxia is the most immediately reversible: open the airway, high-flow oxygen and the definitive airway.",
        explanation: "Every arrest gets a systematic hunt for the reversible causes because treating one can convert an otherwise fatal rhythm into a survivable one; the airway is common to all of them and is the one intervention that cannot wait for a diagnosis.",
      },
      {
        type: "question",
        prompt: "A patient in asystole has a potassium of 6.8 mmol/L on the blood gas. Why does the anaesthetist give calcium before thinking about defibrillation, and what else treats the potassium?",
        answer: "Calcium chloride or gluconate stabilises the myocardium against hyperkalaemia-induced arrhythmia within minutes, without lowering the potassium; the potassium is then lowered by insulin with dextrose, by bicarbonate if acidotic, and removed definitively by dialysis or diuresis.",
        explanation: "Hyperkalaemia stabilisation and potassium lowering are two separate steps of one reversible cause; a rhythm refractory to every other intervention improves only when the potassium is corrected.",
      },
      {
        type: "question",
        prompt: "After return of spontaneous circulation, a patient has a saturation of 100% on 15 L/min via a reservoir mask, an end-tidal carbon dioxide of 3.0 kPa, a temperature of 38.6 °C and a systolic pressure of 80 mmHg. What are the problems?",
        answer: "Hyperoxia (target 94–98%), hypocapnia from over-ventilation (target 4.5–5.0 kPa), fever (target 32–36 °C with fever avoided for 72 hours), and hypotension (target a systolic of at least 100–120 mmHg). Each worsens the neurological outcome independently.",
        explanation: "Post-arrest care is the fifth link of the chain of survival: secondary brain injury is avoided by titrating oxygen, ventilation, temperature, glucose and blood pressure, and by reperfusing a coronary cause.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A patient is unresponsive, is not breathing normally, and the monitor shows coarse ventricular fibrillation. What is the correct sequence?",
        options: [
          "Give adrenaline 1 mg, then deliver one shock, then resume chest compressions",
          "Deliver one shock and resume chest compressions immediately for 2 minutes",
          "Secure the tracheal tube, then deliver three stacked shocks",
          "Check for a carotid pulse for 30 seconds, then deliver one shock",
        ],
        correctIndex: 1,
        explanation: "In a shockable rhythm the priority is defibrillation followed by immediate resumption of compressions for 2 minutes. Adrenaline belongs after the third shock (from the second loop), intubation is secondary to compressions, and pulse checks are limited to 10 seconds.",
      },
      {
        type: "mcq",
        stem: "At what point is adrenaline 1 mg intravenous given in the shockable limb of the adult algorithm?",
        options: [
          "Before the first shock in every case",
          "After the third shock, then every 3–5 minutes",
          "Only after amiodarone has been given",
          "Not at all in ventricular fibrillation",
        ],
        correctIndex: 1,
        explanation: "Adrenaline is given after the third shock (that is from the second 2-minute loop) and then every 3–5 minutes. Early adrenaline does not improve survival and risks delaying defibrillation, which is the single most effective intervention in shockable rhythms.",
      },
      {
        type: "mcq",
        stem: "Which is NOT one of the four reversible causes taught by the mnemonic?",
        options: [
          "Hypoxia",
          "Hypovolaemia",
          "Hyperglycaemia",
          "Tension pneumothorax",
        ],
        correctIndex: 2,
        explanation: "The four Hs are hypoxia, hypovolaemia, hypo- or hyperkalaemia (and other metabolic derangements) and hypothermia; the four Ts are tension pneumothorax, cardiac tamponade, toxins and thrombosis. Hypoglycaemia and hyperglycaemia are important but sit under metabolic derangements, and severe hypoglycaemia is itself a cause of arrest.",
      },
      {
        type: "mcq",
        stem: "An overweight 3-year-old child is in asystole. Which set of parameters is correct?",
        options: [
          "Compressions 30:2 throughout, adrenaline 1 mg, shock at 150 J",
          "Five rescue breaths first, 15:2 with two rescuers, adrenaline 10 micrograms/kg, defibrillation 4 J/kg",
          "Compressions 15:2 single rescuer, adrenaline 1 microgram/kg, shock at 2 J/kg",
          "Five breaths, then compressions only, no adrenaline until the child is intubated",
        ],
        correctIndex: 1,
        explanation: "Paediatric arrest is primarily hypoxic, so oxygen belongs first; the ratio is 15:2 with two rescuers, adrenaline is 10 micrograms/kg (0.1 mL/kg of 1:10,000) and defibrillation starts at 4 J/kg rising to 10 J/kg for later shocks.",
      },
      {
        type: "mcq",
        stem: "A drowned patient has a core temperature of 29 °C and absent brainstem reflexes immediately after return of spontaneous circulation. What is the appropriate conclusion?",
        options: [
          "The patient can be certified dead, because absent brainstem reflexes below 30 °C are expected",
          "Rewarming and continued intensive care are required before any prognostication is made",
          "Death is confirmed once the rhythm is asystole",
          "Brainstem testing is only valid if the patient is normothermic and has had 72 hours of observation",
        ],
        correctIndex: 1,
        explanation: "Hypothermia renders brainstem reflexes and pupillary responses unreliable, and resuscitation should be continued until the patient is warm. Even when normothermic, formal brain death testing in the United Kingdom requires exclusion of sedatives, hypothermia, metabolic and pharmacological causes and referral to clinical teams with defined expertise.",
      },
      {
        type: "mcq",
        stem: "A patient in refractory ventricular fibrillation has an end-tidal carbon dioxide of 0.9 kPa despite good-quality compressions. What is the most appropriate interpretation?",
        options: [
          "The capnograph is faulty and should be ignored",
          "The tube is dislodged and the patient should be intubated",
          "Pulmonary blood flow is very low — continue compressions, re-check the tube, and hunt the reversible causes",
          "Return of spontaneous circulation has occurred",
        ],
        correctIndex: 2,
        explanation: "An end-tidal carbon dioxide below about 1.3 kPa during cardiac arrest reflects very low pulmonary blood flow: it usually means compressions are ineffective or there is an untreated reversible cause (most commonly hypovolaemia, tension pneumothorax or tamponade). A sudden sustained rise above 4 kPa indicates return of spontaneous circulation.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Basic life support is unresponsive plus not breathing normally, then 30 compressions at 100–120 per minute and 5–6 cm deep to 2 breaths, with hands-off time under 5 seconds. The advanced algorithm branches on rhythm: ventricular fibrillation and pulseless ventricular tachycardia are shocked, with adrenaline after the third shock and amiodarone for refractory cases; asystole and pulseless electrical activity receive adrenaline immediately and a systematic hunt of the four Hs and four Ts. Children ventilate first and are dosed by weight. Post-arrest care targets 94–98% saturation, a normal end-tidal carbon dioxide, a systolic of at least 100–120 mmHg and 32–36 °C, because the fifth link of the chain is what determines whether the brain survives.",
      },
      {
        type: "paragraph",
        text: "Next: the airway. Compressions and adrenaline cannot work if the airway is not open, so the next lesson is how to predict a difficult airway, how to ventilate with a bag-mask, when to place a supraglottic device, and what to do when intubation fails.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 4 — Airway assessment & ventilation (fully authored)
// ---------------------------------------------------------------------------
function lesson4() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: perform a structured airway assessment and name the predictors of difficulty with bag-mask ventilation and with intubation; use the LEMON and MOANS mnemonics; explain the management of an obstructed airway including head-tilt, chin-lift, jaw thrust and airway adjuncts; describe the technique and confirmation of tracheal intubation with mandatory waveform capnography; choose and set a basic ventilation mode with lung-protective settings; and recognise the failed-intubation sequence, calling for help and waking the patient.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 3 (Resuscitation) for the DRSABCD sequence, Lesson 1 for the physiology of oxygen delivery, and the anatomy of the pharynx, larynx and the trigeminal and vagal nerves. You need to know the landmarks for cricoid pressure and for the cricothyroid membrane.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Airway patency",
        text: "An open conduit from the atmosphere to the alveoli, maintained actively by the tongue and pharyngeal muscles. In the unconscious patient that tone is lost, so the airway must be opened by positioning, by adjuncts, or by a tracheal tube — and the one universally reliable plan when it cannot be opened is oxygenation with a supraglottic device while waking the patient.",
      },
      {
        type: "paragraph",
        text: "Airway management separates into four decisions made in order: who is going to be difficult to ventilate with a mask, who is going to be difficult to intubate, what device and technique you will use, and what the plan is when both fail. Every anaesthetic is planned with a primary technique and an explicit rescue, because 'unanticipated difficult airway' is the precipitant of most airway-related deaths, together with failure to call for help. Difficulty is predicted, not discovered, and the prediction is a bedside examination, not a scan.",
      },

      { type: "heading", level: 2, text: "Assessing the airway: LEMON and MOANS" },
      {
        type: "table",
        headers: ["LEMON (difficult intubation)", "Finding", "Why it predicts difficulty"],
        rows: [
          ["Look", "Abnormal face shape, receding jaw, obesity, short thick neck, beard, neck masses, previous radiotherapy or surgery", "Anatomy that displaces or hides the laryngeal inlet"],
          ["Evaluate 3-3-2", "Mouth opening under three finger breadths; thyromental distance under three finger breadths (6.5 cm); upper incisor to hyoid under two finger breadths", "The space available in which to align the oral, pharyngeal and laryngeal axes and to displace the tongue"],
          ["Mallampati", "Class I: soft palate and uvula visible; class II: fauces and soft palate; class III: soft palate only; class IV: hard palate only", "A class III or IV tongue (a large or anterior tongue) correlates with a larynx that is high and hard to see"],
          ["Obstruction and obesity", "Obstructive sleep apnoea, snoring, stridor, body mass index over 30, neck circumference over 43 cm in men", "These patients desaturate quickly because of reduced functional residual capacity and obstruct on induction"],
          ["Neck mobility", "Inability to flex the neck or extend the atlanto-occipital joint (ankylosing spondylitis, rheumatoid arthritis, fixed flexion, external fixation)", "The sniffing position aligns the axes; without it direct laryngoscopy is mechanically harder"],
        ],
      },
      {
        type: "table",
        headers: ["MOANS (difficult mask ventilation)", "Finding", "Consequence"],
        rows: [
          ["Mask seal", "Beard, facial deformity, burns, fracture, flat nasal bridge", "Air escapes and the seal is never adequate despite a good technique"],
          ["Obesity or obstruction", "Body mass index over 26, or upper-airway obstruction from tumour, oedema, sleep apnoea", "Expiratory reserve is small and obstruction at the soft palate is the norm, not the exception"],
          ["Age over 55", "Reduced pulmonary compliance and reflex sensitivity", "Lower tolerance of even brief hypoxia"],
          ["No teeth", "Edentulous and the oral cavity collapses", "The tongue falls back into the pharynx without teeth to hold the shape"],
          ["Stiffness or sleep apnoea", "Poor lung compliance, cervical immobility, or strongly apnoeic", "Effective ventilation becomes impossible until the obstruction is relieved"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "A patient who is difficult to ventilate and difficult to intubate is a declared emergency: call for the most senior anaesthetic help available, wake the patient if it is possible, and never attempt the same technique repeatedly. Repeated attempts at direct laryngoscopy cause oedema, bleeding and ultimately the 'cannot intubate, cannot oxygenate' situation, which is one of the few genuine indications for cricothyroidotomy.",
      },

      { type: "heading", level: 2, text: "Opening the airway without a tube" },
      {
        type: "paragraph",
        text: "Basic manoeuvres and adjuncts come first in the unconscious but breathing patient, and in every arrest. The head-tilt, chin-lift or jaw thrust lifts the tongue off the posterior pharyngeal wall; a supraglottic airway (Guedel) holds it forward; and suction clears blood, vomit and secretions. Lifting the tongue is all these manoeuvres do — and it is enough to relieve most obstruction in a normal-weight patient.",
      },
      {
        type: "table",
        headers: ["Adjunct", "How to size and place", "Indication and caveats"],
        rows: [
          ["Oropharyngeal (Guedel) airway", "Size from the incisors to the angle of the jaw; insert with the concavity facing the palate in an adult, then rotate 180 degrees", "Only in an obtunded patient without a gag reflex. In a semiconscious patient it provokes vomiting and laryngospasm"],
          ["Nasopharyngeal airway", "Length from the nostril to the tragus; diameter approximately 6.0 mm in an adult, lubricated, inserted along the floor of the nasal cavity", "Tolerated in semi-conscious patients, better than a Guedel in trismus or a clenched jaw. Avoid in suspected basal skull fracture or severe midface trauma, and in coagulopathy"],
          ["Bag-mask ventilation", "C-E grip holding the mask, jaw thrust with the fourth and fifth fingers, single rescuer if possible; a two-person technique with a second holding the mask and doing the jaw thrust", "The rescue in every failed airway. Watch the chest, listen for leak, use a 50 L/min oxygen flow with a reservoir, and do not deliver large tidal volumes"],
          ["Supraglottic airway (laryngeal mask, i-gel)", "Chosen by weight; inserted blindly until the cuff inflates at the laryngeal inlet, then confirmed by capnography and bilateral air entry", "The primary rescue device for cannot intubate but can oxygenate, and the conduit for flexible bronchoscopy; not a definitive airway for high airway pressures, obesity or laparoscopy, and not a protection against aspiration"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The capnograph is the confirmation device of the airway, in every setting. A sustained end-tidal carbon dioxide waveform after intubation or insertion of a supraglottic device is the only reliable check; auscultation, chest movement and misting can be misleading, and 'no carbon dioxide detected' in a arrested circulation is a trap requiring a second waveform check.",
      },

      { type: "heading", level: 2, text: "Tracheal intubation" },
      {
        type: "paragraph",
        text: "Tracheal intubation secures the airway, protects it from aspiration, permits positive-pressure ventilation and suctioning, and is required for surgery, for any patient with a Glasgow Coma Scale of 8 or less, and for refractory hypoxaemia. Rapid-sequence induction is the technique used when aspiration risk is high.",
      },
      {
        type: "table",
        headers: ["Step", "What is done", "Detail and evidence"],
        rows: [
          ["Position", "Sniffing the morning air: lower cervical flexion with atlanto-occipital extension; in the obese, ramped with the head elevated so the external auditory meatus is level with the sternal notch", "This aligns the oral, pharyngeal and laryngeal axes and is the single most effective change in the obese patient"],
          ["Preoxygenation", "Three minutes of tidal breathing on 100% oxygen, or eight vital-capacity breaths", "Builds an oxygen reservoir that permits apnoea of several minutes; also applies a small amount of positive end-expiratory pressure in the obese"],
          ["Induction and paralysis", "Induction agent plus a relaxant; suxamethonium or rocuronium 1.2 mg/kg for a rapid sequence", "The rate and depth of neuromuscular blockade determine the window, and intubation depth is assessed with the laryngoscope before the drug is chosen"],
          ["Laryngoscopy", "Insert the laryngoscope to the right of the tongue, sweep it to the midline, lift at an angle of 45 degrees along the handle, never levering on the teeth", "The left hand controls the blade; an assistant gives cricoid pressure if used, released if laryngoscopy is difficult"],
          ["Tube", "Cuffed tube, size 8.0–8.5 in men and 7.0–7.5 in women, advanced to a depth of about 21 cm at the incisors in women and 23 cm in men", "Confirm by capnography waveform, bilateral air entry in the mid-axillary lines, and epigastric auscultation; a chest radiograph confirms depth (tip 3–5 cm above the carina)"],
          ["Secure and ventilate", "Tape or tie the tube, insert a bite block or oropharyngeal airway, connect a ventilator or a self-inflating bag", "Obvious but frequently the point of failure: a tube pulled out during positioning is a common cause of hypoxia"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Unplanned failed intubation. Declare it out loud, call for help, keep oxygenating with a supraglottic airway and two-person bag-mask ventilation, and waking the patient is the priority if the airway is rescued. Only in cannot-intubate, cannot-oxygenate (silent airway, active vomiting, complete obstruction or bleeding) is the front-of-neck emergency pathway used: scalpel cricothyroidotomy performed with a scalpel, a bougie and a size 6.0 tube, or needle cricothyroidotomy with a cannula and jet insufflation as an interim in adults only.",
      },

      { type: "heading", level: 2, text: "Mechanical ventilation" },
      {
        type: "definition",
        term: "Positive end-expiratory pressure (PEEP)",
        text: "Pressure maintained in the airway at the end of expiration, keeping alveoli open, increasing functional residual capacity, improving compliance and reducing the work of breathing. Typical PEEP is 5 cmH2O, higher in the obese and in acute respiratory distress syndrome. Excessive PEEP reduces venous return and can cause haemodynamic compromise and barotrauma.",
      },
      {
        type: "table",
        headers: ["Mode", "What the ventilator does", "When it is used", "Cautions"],
        rows: [
          ["Volume control", "Delivers a set tidal volume at a set rate; airway pressure varies with compliance", "The default for most general anaesthesia and initial intensive-care settings", "Peak pressure rises if compliance falls; keep the plateau pressure under 30 cmH2O"],
          ["Pressure control", "Delivers a set pressure over inspiration; tidal volume varies with compliance", "Where limiting pressure matters — laparoscopy, poor compliance, leaks around an uncuffed tube", "Tidal volume must be measured, not assumed; changing compliance changes delivery"],
          ["Synchronised intermittent mandatory ventilation (SIMV)", "Delivers a set number of mandatory breaths, allowing spontaneous breathing between them", "Traditionally the weaning mode", "Increases work of breathing and can cause dyssynchrony if the mandatory rate is too high"],
          ["Pressure support", "Augments each spontaneous breath by a set pressure", "Weaning and spontaneous breathing trials", "Apnoea is not detected by the mode, so the patient must have adequate drive and a back-up rate"],
          ["Continuous positive airway pressure (CPAP)", "Delivers continuous positive pressure without mandatory breaths", "Type 1 and type 2 respiratory failure via mask or helmet, obstructive sleep apnoea, cardiogenic pulmonary oedema", "Not suitable for the obtunded, vomiting or apnoeic patient; the mask must fit or the pressure rises"],
        ],
      },
      {
        type: "paragraph",
        text: "Lung-protective settings are the standard for any ventilated patient with acute respiratory distress syndrome and are a reasonable default elsewhere: tidal volume 6–8 mL/kg of predicted body weight, plateau pressure below 30 cmH2O, and an appropriate positive end-expiratory pressure. Predicted body weight is calculated from height and sex (predicted body weight in kg = 50 + 2.3 for each inch over 5 feet in men; 45.5 + 2.3 for each inch over 5 feet in women) — not actual body weight. The physiological reason is that the lung is not bigger in an obese patient, and the tidal volume scaled to weight distends and injures it.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Ventilator-associated complications are predictable and preventable. Infection is reduced by elevating the head of the bed 30–45 degrees, oral care with chlorhexidine, sub-glottic secretion drainage, avoiding circuit breaks and a daily sedation hold. Barotrauma (pneumothorax, pneumomediastinum) follows excessive pressures or volumes. Oxygen toxicity follows unnecessary high fractions. The patient who cannot be weaned because of diaphragmatic dysfunction may need early tracheostomy and rehabilitation.",
      },

      { type: "heading", level: 2, text: "Worked example: three patients, three airways" },
      {
        type: "paragraph",
        text: "The first patient is an obese, snoring man with a body mass index of 42 and a previous diagnosis of obstructive sleep apnoea for a hernia repair. He is a high-risk mask-ventilation and difficult-intubation profile, so the plan is preoxygenation in the ramped position, two experienced hands for the mask, insertion of a supraglottic device first if the mask is difficult, and extubation fully awake sitting up rather than asleep. The second is a patient with a large tongue and a class IV Mallampati for a diagnostic laparoscopy. Because failed intubation is likely and mask ventilation should be achievable, the primary plan is awake fibre-optic intubation (the gold standard where difficulty is predicted), with the local anaesthetic topicalisation of the airway she tolerates while sitting up and breathing spontaneously. The third is a patient with penetrating neck trauma and stridor who cannot lie flat. No plan involving the ward is safe: the airway is the operating-theatre surgeon's, the difficult-airway trolley is opened, and the team works in the front-of-neck pathway from the start.",
      },
      {
        type: "question",
        prompt: "A patient has a thyromental distance of 5 cm, a class III Mallampati, a neck circumference of 44 cm and a beard. Which predictions can you make, and what would you change about the plan?",
        answer: "He is predicted to be difficult to ventilate with a mask (MOANS: mask seal, obesity, obstruction) and difficult to intubate (mouth opening and thyromental distance under three finger breadths, class III Mallampati). The plan therefore needs an experienced operator, a two-person mask technique, a supraglottic device immediately available, and an awake or video-laryngoscope approach.",
        explanation: "The point of the assessment is a changed plan: more experienced hands, adjuncts ready, and an explicit statement of the rescue (and of the point at which the patient is woken) before induction.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Extending the neck forcibly in a patient with suspected cervical spine injury. Use in-line stabilisation with a jaw thrust; in the trauma patient the collar should be opened during laryngoscopy while manual stabilisation is maintained, because a collar makes the airway harder without protecting the spine.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Inserting an oropharyngeal airway in a semi-conscious patient. The gag reflex triggers vomiting, laryngospasm and aspiration; a nasopharyngeal airway, tolerated at lighter levels, or simply repositioning the head is the safer option.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Believing the tube is in place because the chest moved and air entry is heard. The only acceptable confirmation is a sustained waveform capnography trace, and the tube position must be re-checked after every movement of the patient and any change in oxygen saturation.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Persisting with direct laryngoscopy after a failed first attempt. The rule is a maximum of three attempts (each of no more than 30 seconds), then call for help, maintain oxygenation with a supraglottic airway, and consider waking the patient.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Scaling ventilator tidal volume to actual rather than predicted body weight, and neglecting lung-protective plateau pressures in an obese patient with acute respiratory distress syndrome.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Describe capnography tracing during cardiac arrest and its value as a monitor of compression quality.",
        answer: "End-tidal carbon dioxide during arrest reflects pulmonary blood flow, so it is a real-time measure of perfusion generated by compressions. Above about 1.3 kPa compressions are generating flow; below that, either compressions are ineffective or a reversible cause such as tension pneumothorax, tamponade or hypovolaemia is present.",
        explanation: "Capnography is also the only reliable confirmation of tracheal tube placement and it signals return of spontaneous circulation as a sudden sustained rise above 4 kPa, so it is included in the minimum monitoring set for every intubated patient.",
      },
      {
        type: "question",
        prompt: "Why is a laryngeal mask not a definitive airway for laparoscopic surgery or for a morbidly obese patient, and what is used instead?",
        answer: "The laryngeal mask sits above the glottis and does not seal the trachea, so it does not protect against aspiration and cannot tolerate the high airway pressures of laparoscopy or high PEEP in the obese; positive-pressure ventilation forces gastric insufflation and leaks. A cuffed tracheal tube is the definitive airway in both settings.",
        explanation: "The laryngeal mask remains the rescue device of choice for cannot intubate but can oxygenate, and the conduit for airway endoscopy, but 'adequate for oxygenation' is not the same as 'airway secure'.",
      },
      {
        type: "question",
        prompt: "List the parameters of a basic volume-control ventilator setting for a 170 cm man without lung disease, and state the reason for each.",
        answer: "Tidal volume 6–8 mL/kg of predicted body weight (about 450 mL, since predicted body weight is about 70 kg) with a rate of 10–14 per minute; inspiratory:expiratory ratio 1:2; positive end-expiratory pressure 5 cmH2O; fraction of inspired oxygen titrated to a saturation of 94–98% or an end-tidal carbon dioxide of 4.5–5.0 kPa; plateau pressure below 30 cmH2O.",
        explanation: "The settings keep the lung distended enough to exchange, prevent atelectasis and derecruitment between breaths, and avoid the ventilator-induced injury caused by excessive volumes or pressures.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which combination is most suggestive of a difficult mask ventilation but probably manageable intubation?",
        options: [
          "Edentulous, bearded patient with a body mass index of 34 and a neck circumference of 45 cm",
          "Mallampati I with a thyromental distance of 8 cm and full neck extension",
          "A history of easy intubation and a previous uneventful general anaesthetic",
          "Mouth opening of 6 cm with a receding jaw and a previous radiotherapy to the neck",
        ],
        correctIndex: 0,
        explanation: "The MOANS mask-seal, obesity and no-teeth factors predict difficult bag-mask ventilation without necessarily a difficult intubation. The others predict easy ventilation (option B is a normal airway), and option D predicts a difficult intubation rather than a difficult mask.",
      },
      {
        type: "mcq",
        stem: "Which statement about confirming tracheal intubation is correct?",
        options: [
          "Auscultation in both axillae is the definitive confirmation",
          "Misting in the tube proves an endobronchial intubation",
          "Sustained waveform capnography is the only reliable confirmation, re-checked after movement",
          "A chest radiograph is obtained from the bed before assessing the patient",
        ],
        correctIndex: 2,
        explanation: "Continuous waveform capnography is the international standard and is mandatory after every intubation. Auscultation and misting are unreliable, and a radiograph confirms depth (tip 3–5 cm above the carina) rather than whether the tube is in the trachea at all.",
      },
      {
        type: "mcq",
        stem: "A patient in the operating theatre desaturates to 78% with an absent capnography trace after intubation and a self-inflating bag with high resistance. What is the most likely problem?",
        options: [
          "Right main bronchus intubation",
          "Oesophageal intubation",
          "A blocked filter in the breathing circuit",
          "Pulmonary embolism",
        ],
        correctIndex: 1,
        explanation: "An absent capnography trace with a non-compliant bag is the classic picture of oesophageal intubation, with the stomach inflating instead of the lungs. Re-check the tube position by laryngoscopy or withdraw and re-intubate with oxygenation in between; bronchial intubation would give unilateral air entry but a present trace.",
      },
      {
        type: "mcq",
        stem: "Which ventilator measure is the lung-protective target in a patient with acute respiratory distress syndrome?",
        options: [
          "Tidal volume 10–12 mL/kg of actual body weight",
          "Tidal volume 6–8 mL/kg of predicted body weight with a plateau pressure below 30 cmH2O",
          "High tidal volumes with no positive end-expiratory pressure",
          "Pressure-control ventilation with a target plateau of 45 cmH2O",
        ],
        correctIndex: 1,
        explanation: "The ARDSNet trial established 6 mL/kg of predicted body weight, which reduced mortality; the plateau pressure (a measure of end-inspiratory alveolar distension) is kept below 30 cmH2O. Scaling to actual weight in the obese distends the lung and worsens injury.",
      },
      {
        type: "mcq",
        stem: "After two failed attempts at intubation the patient is still not oxygenating with a bag-mask. What is the next step in the Difficult Airway Society sequence?",
        options: [
          "A third attempt at direct laryngoscopy",
          "Wake the patient if possible, and declare the emergency; maintain oxygenation with a supraglottic device and consider front-of-neck access in cannot-intubate-cannot-oxygenate",
          "Give suxamethonium to relax the patient further",
          "Reduce the inspired oxygen to avoid flow to the stomach",
        ],
        correctIndex: 1,
        explanation: "A maximum of three attempts, oxygenation between attempts, then declare the failed intubation: call for help, maintain oxygenation with a supraglottic airway and wake the patient if possible. Front-of-neck access (scalpel cricothyroidotomy) is the last resort when the patient cannot be oxygenated.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The airway is assessed, not discovered: LEMON predicts difficult intubation (look, evaluate 3-3-2, Mallampati, obstruction/obesity, neck mobility) and MOANS predicts difficult mask ventilation (mask seal, obesity/obstruction, age, no teeth, stiffness). Maneuvres and adjuncts relieve obstruction in the obtunded patient; every intubation is confirmed with waveform capnography and re-checked after movement; ventilation uses lung-protective volumes (6–8 mL/kg predicted body weight, plateau below 30 cmH2O) with positive end-expiratory pressure of 5 cmH2O or more; and a failed intubation is declared, oxygenated, rescued with a supraglottic device, and woken, with front-of-neck access only when the patient cannot be oxygenated.",
      },
      {
        type: "paragraph",
        text: "Next: the unconscious patient. When the airway has been opened and the cause of collapse is not obvious, you need a structured approach to coma — AVPU and the Glasgow Coma Scale, the differential diagnosis, and the immediate actions (glucose, naloxone, oxygen, positioning) that can be taken at the bedside.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 5 — The unconscious patient (fully authored)
// ---------------------------------------------------------------------------
function lesson5() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: assess a patient with AVPU and the Glasgow Coma Scale and record the components; protect the airway and position the unconscious patient safely; run a structured ABCDE assessment and a differential diagnosis of coma; take the immediate bedside actions — oxygen, glucose check, naloxone, thiamine — that treat the commonest reversible causes; and recognise the signs of raised intracranial pressure and impending herniation.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 3 (Resuscitation) and Lesson 4 (Airway assessment and ventilation). You need the DRSABCD sequence and the airway rescue steps, and the cranial-nerve anatomy of the pupil and the oculocephalic and oculovestibular reflexes.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Coma",
        text: "A state of unrousable unresponsiveness in which the patient cannot be roused to consciousness and shows no purposeful response to the environment. It lies on a continuum with drowsiness (easily roused, but poorly sustained attention), stupor (deep unresponsiveness, rousable only by vigorous stimulation) and the persistent vegetative state (wakefulness without awareness, following diffuse cortical injury after weeks).",
      },
      {
        type: "paragraph",
        text: "Consciousness depends on the reticular activating system of the upper brainstem plus both cerebral hemispheres, so coma arises in only two ways: a diffuse insult to the cortex (hypoxia, hypoglycaemia, drugs, sepsis, hepatic or uraemic encephalopathy) or a structural lesion of the brainstem (stroke, haemorrhage, herniation, compression). That division determines the examination: a diffuse, metabolic cause produces a symmetrical examination with reactive pupils and preserved reflexes; a structural cause produces asymmetrical or focal signs, and an abnormal pupil or a neurological deficit that localises. The commonest mistake is to order a computed tomography scan before the glucose, because hypoglycaemia is a diffuse cause that is diagnosed and treated at the bedside in seconds, and which causes permanent brain damage if missed.",
      },

      { type: "heading", level: 2, text: "Assessing the level of consciousness" },
      {
        type: "table",
        headers: ["Scale", "Components", "Interpretation"],
        rows: [
          ["AVPU", "A = alert, V = responds to voice, P = responds to pain, U = unresponsive", "The rapid triage scale in every acute course: any V or below is an immediate bedside concern, and U is a resuscitation call"],
          ["Glasgow Coma Scale", "Eye 4 (spontaneous), 3 (to speech), 2 (to pressure), 1 (none). Verbal 5 (oriented), 4 (confused), 3 (inappropriate words), 2 (incomprehensible sounds), 1 (none). Motor 6 (obeys commands), 5 (localises to pain), 4 (withdraws to pain), 3 (flexion to pain), 2 (extension to pain), 1 (none)", "A total of 15 (E4 V5 M6) down to 3. Record components, not only the sum, because the sum can hide a deteriorating pupil. A GCS of 8 or less means the patient cannot protect their airway and should be intubated"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Always record the three components separately. A patient with E1 V1 M6 has a devastating brainstem lesion with intact motor pathways; a patient with E4 V4 M4 is likely metabolic. The total of 8 conceals completely different diseases and prognoses, which is also why the analgesia and sedation of the intensive-care patient (for example GCS 3 on propofol and opioids) must be excluded before taking the number at face value.",
      },
      {
        type: "paragraph",
        text: "Motor responses to pain are elicited by a standard stimulus — pressure on the supraorbital ridge or the trapezius — never by a sternal rub, which leaves bruises and gives no information beyond reflex flexion. A localising response (hand moves towards the stimulus and removes it) is a purposeful, cortically mediated movement; flexion-internal rotation movements are a decorticate posture (a lesion at or above the midbrain or thalamus) and extension with internal rotation is decerebrate (below the red nucleus, midbrain-pontine). Both are ominous but not, themselves, brain death.",
      },

      { type: "heading", level: 2, text: "The immediate bedside approach" },
      {
        type: "paragraph",
        text: "The sequence at the bedside is ABCDE, with the treatment of the commonest reversible causes running in the first minute. Measure the temperature and the glucose, check for signs of a drug or a track mark, and ask the ambulance crew, the family and the observation chart for the rate of onset.",
      },
      {
        type: "table",
        headers: ["Immediate action", "Detail", "Why it is first"],
        rows: [
          ["Airway and cervical spine", "Head-tilt chin-lift or jaw thrust; suction; airway adjunct; consider trauma", "Obstruction and vomiting are the immediate killers, and the patient with coma cannot protect their own airway"],
          ["Oxygen and ventilation", "High-flow oxygen via reservoir mask; assist ventilation if the respiratory rate or effort is inadequate", "Hypoxia is the commonest treatable cause of coma and the commonest cause of permanent disability"],
          ["Circulation", "Pulse, blood pressure, capillary refill, electrocardiogram, intravenous access", "Shock and arrhythmia both cause and are caused by coma; treat the hypotension"],
          ["Glucose", "Capillary glucose immediately in every unconscious patient; if it is below 4.0 mmol/L or unmeasurable, give 250 mL of 10% glucose or 50 mL of 50% glucose intravenously", "Hypoglycaemia mimics a stroke or intoxication and is reversible in seconds; a delay costs neurones"],
          ["Naloxone", "Titrate 400 micrograms intravenously (or 2 mg intranasally or intramuscularly out of hospital) in any patient with pin-point pupils, respiratory depression and a history of opioid use", "Opioid overdose is common and reversible; give the whole dose in the arrest setting, and titrate to respiratory rate rather than arousal"],
          ["Thiamine", "100–250 mg intravenously before or with glucose in the patient with chronic alcoholism, malnutrition or suspected Wernicke encephalopathy", "A glucose load in thiamine deficiency precipitates or worsens Wernicke encephalopathy (confusion, ataxia, ophthalmoplegia) and Korsakoff psychosis"],
          ["Positioning", "Recovery position if not intubated, head of bed 30 degrees if a head injury or stroke, and log-roll if a cervical injury is suspected", "Prevents aspiration and improves venous drainage"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Flumazenil, the benzodiazepine antagonist, is not used routinely to reverse coma from a mixed overdose. It precipitates seizures in tricyclic antidepressant poisoning and in patients on chronic benzodiazepines, its duration is shorter than many benzodiazepines so relapse occurs, and it does not reverse respiratory depression reliably. The benzodiazepine-poisoned patient needs ventilation support first, not an antagonist.",
      },

      { type: "heading", level: 2, text: "The differential diagnosis of coma" },
      {
        type: "table",
        headers: ["Category", "Causes", "Clues"],
        rows: [
          ["Metabolic and toxic", "Hypoglycaemia, diabetic ketoacidosis and hyperosmolar hyperglycaemic state, uraemia, hepatic encephalopathy, hypercapnia, hyponatraemia, hypercalcaemia, hypothermia, hyperthermia, alcohol, opioids, benzodiazepines, tricyclics, carbon monoxide, salicylates", "Symmetrical examination, reactive pupils, preceding confusion or seizure, a known drug history, a smell of alcohol, needle marks; fever suggests infection"],
          ["Structural, supratentorial", "Haemorrhage, tumour, abscess, hydrocephalus, cerebral oedema", "Progressive rostrocaudal deterioration, a lateralising sign (hemiparesis, aphasia, an up-going toe), a headache, a preceding seizure"],
          ["Structural, infratentorial", "Pontine or medullary haemorrhage, basilar occlusion, cerebellar mass", "Pin-point or absent pupils, an abnormal breathing pattern, cranial-nerve palsies out of proportion to the weakness, sudden onset"],
          ["Infection and inflammation", "Meningitis, encephalitis, cerebral malaria, cerebral abscess, sepsis, status epilepticus", "Fever, meningism, a stiff neck (but absent in the deeply obtunded and the immunosuppressed), petechial rash, seizures, travel or exposure history"],
          ["Non-neurological", "Hypoxia, hypercapnia, severe sepsis, hypovolaemia, anaphylaxis, cardiac arrest with incomplete recovery", "Hypoxaemia or shock, a low cardiac output, abnormal blood gases; always treat before imaging"],
        ],
      },
      {
        type: "example",
        text: "A 62-year-old woman is found unresponsive at home by a neighbour. AVPU is U. She has a normal examination except for a right pupil dilated and unreactive and a left hemiparesis. The onset was abrupt, and there is no history of diabetes, alcoholism or drug use. This is a structural event — a right-sided intracranial haemorrhage with early herniation, or a large right hemispheric infarct — and the immediate management is airway protection, ventilator support, an urgent computed tomography brain and neurosurgical referral, not a glucose-first pathway above the airway.",
      },

      { type: "heading", level: 2, text: "Raised intracranial pressure and herniation" },
      {
        type: "paragraph",
        text: "The skull is a fixed box containing brain, blood and cerebrospinal fluid (the Monro-Kellie doctrine), so any added volume raises pressure. The first compensation is displacement of cerebrospinal fluid into the spinal subarachnoid space and a reduction in venous volume; when those are exhausted, pressure rises steeply and cerebral perfusion falls.",
      },
      {
        type: "table",
        headers: ["Stage", "Signs", "Mechanism"],
        rows: [
          ["Early", "Headache, vomiting, a declining Glasgow Coma Scale, papilloedema (takes hours to days to develop, so its absence does not exclude raised pressure)", "Compensatory mechanisms failing"],
          ["Mid (Cushing's triad)", "Hypertension with a widening pulse pressure, bradycardia and an irregular respiratory pattern", "Sympathetic response to restore cerebral perfusion, with baroreceptor reflex slowing the heart"],
          ["Late (herniation)", "A unilateral dilated pupil with a third-nerve palsy (uncal herniation compressing the third nerve); bilateral fixed dilated pupils with decerebrate posturing (central herniation); or respiratory arrest from tonsillar herniation through the foramen magnum", "Displacement of brain tissue between compartments compressing the brainstem"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The airway, imaging and neurosurgical decision come in parallel with the temporising manoeuvres: elevate the head of the bed to 30 degrees, keep the head midline to avoid venous kinking, maintain oxygenation (saturation of 94–98%), treat hypotension (keep the cerebral perfusion pressure above 60 mmHg), treat hyponatraemia, and avoid hypercapnia. Definitive decompression — a burr hole, an external ventricular drain or a craniectomy — is the treatment for a mass lesion.",
      },

      { type: "heading", level: 2, text: "The reflex examination in coma" },
      {
        type: "paragraph",
        text: "Pupils and eye movements localise the lesion, and they are examined with a bright torch and with the doll's-eye and caloric reflexes. Brainstem death testing in most jurisdictions requires the demonstration of absent brainstem reflexes with a defined cause, but the examination itself is taught here because it is also the diagnostic tool at the bedside.",
      },
      {
        type: "table",
        headers: ["Pupil finding", "Interpretation", "Comment"],
        rows: [
          ["Small, reactive", "Metabolic or toxic, or a diencephalic lesion", "Pin-point but reactive is typical of opioid overdose; a pontine lesion also gives pin-point pupils but they do not react to light"],
          ["Unilateral fixed dilated", "Third-nerve compression from uncal herniation, or a primary eye disease (acute glaucoma, trauma)", "Always the most urgent pupil finding"],
          ["Bilateral fixed dilated", "Severe hypoxia or brainstem death, or anticholinergic drugs (atropine, tricyclics)", "Requires exclusion of drugs, hypothermia and metabolic causes"],
          ["Doll's-eye absent with caloric absent", "Brainstem injury or a deep metabolic coma", "In an awake patient, moving the head does not produce the reflex; it is absent in coma when the brainstem pathways are interrupted"],
        ],
      },
      {
        type: "question",
        prompt: "A 24-year-old man is found unresponsive with pin-point pupils, a respiratory rate of 4, and a fresh needle mark on the forearm. Outline the first minute.",
        answer: "Open the airway and ventilate with a bag-mask and high-flow oxygen; attach monitoring; give naloxone titrated to a respiratory rate above 10; send a capillary glucose; give 250 mL of 10% glucose if it is below 4 mmol/L; and keep the patient in the recovery position with suction to hand, watching for re-narcotisation after the naloxone wears off.",
        explanation: "The priority is ventilation, not the antidote: opioid overdose kills by stopping breathing, and the naloxone is titrated in the patient whose lungs are already supported.",
      },

      { type: "heading", level: 2, text: "Nursing and supportive care" },
      {
        type: "paragraph",
        text: "Beyond the first minutes, coma care is a bundle: head-of-bed elevation at 30 degrees with the head midline, frequent turning and pressure-area care, eye care with lubricants and taping, oral hygiene with chlorhexidine, suction of secretions, a naso-gastric tube for medicines and nutrition (never a blind nasal tube in suspected basal skull fracture), a urinary catheter with output monitoring, deep-vein-thrombosis prophylaxis with thromboembolic deterrent stockings and intermittent pneumatic compression, and communication: explain everything to the relatives even when the patient cannot hear you, because they may still be aware.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Ordering a computed tomography scan before checking the glucose. Hypoglycaemia is a diffuse cause of coma that mimics stroke and intoxication, and the glucose is measured in seconds at the bedside.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Using a sternal rub. It causes bruising and provokes reflex flexion rather than a purposeful response. Use supraorbital or trapezius pressure for the motor score.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Labelling the patient 'just drunk' because there is a smell of alcohol. Alcohol intoxication is a diagnosis of exclusion: a head injury, a subdural from a fall, or hypoglycaemia coexist commonly, and a fall with a smell of alcohol requires a computed tomography brain before the patient is allowed to sleep it off.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Missing a cervical spine injury in the unconscious trauma patient. The collar is opened for airway management, and manual in-line stabilisation is maintained, but the spine is not cleared until the patient is awake and cooperative or imaging is adequate.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Recording only the total Glasgow Coma Scale. The components matter more: a deteriorating motor score, or a new unilateral pupil, is the earliest signal of herniation.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why do diffuse, metabolic causes produce symmetrical findings while structural causes produce asymmetry?",
        answer: "Hypoxia, hypoglycaemia, drugs and hepatic or uraemic encephalopathy affect the whole cortex and the reticular activating system equally, so signs are symmetrical and the pupils remain reactive. A structural lesion compresses or destroys one side, or the brainstem focally, producing a lateralising deficit or a cranial-nerve abnormality.",
        explanation: "The distinction is the first branch in the differential: the symmetrical coma is metabolic until proven otherwise, and the asymmetrical coma is structural until proven otherwise.",
      },
      {
        type: "question",
        prompt: "A patient has a Glasgow Coma Scale of E1 V2 M4 after a witnessed collapse. Are they safe without a definitive airway?",
        answer: "No. A Glasgow Coma Scale of 8 or less means the patient cannot protect their airway from aspiration and cannot maintain ventilation, so the airway must be secured — usually with a cuffed tracheal tube — while ventilation and circulation are supported.",
        explanation: "The threshold of 8 is a practical one derived from the loss of pharyngeal reflexes and the risk of aspiration, and it also applies to the deeply poisoned patient, who may wake with time and ventilation and then no longer need the tube.",
      },
      {
        type: "question",
        prompt: "In a patient with suspected raised intracranial pressure, why is a high inspired oxygen and normal carbon dioxide targeted, and what happens to the pupil?",
        answer: "Hyperoxia causes cerebral vasoconstriction and hypercapnia causes vasodilatation: both raise the intracranial blood volume and therefore the pressure. In early uncal herniation, the third nerve is compressed, so a unilateral pupil becomes fixed and dilated and the patient develops ptosis and a deviated eye.",
        explanation: "The temporising triad is oxygen and ventilation, elevation of the head, and avoidance of hypotension; the definitive treatment of a mass lesion is surgical decompression, so imaging and referral are parallel, not sequential.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A 70-year-old man is found unresponsive at home. Which immediate bedside test is most likely to be diagnostic and reversible?",
        options: [
          "Computed tomography brain",
          "Capillary blood glucose",
          "Serum sodium",
          "Electroencephalogram",
        ],
        correctIndex: 1,
        explanation: "Hypoglycaemia is common, mimics stroke and intoxication, is measured in seconds and is fully reversible with intravenous glucose. Imaging and sodium are slower and are requested after the immediate bedside actions and the ABCDE assessment.",
      },
      {
        type: "mcq",
        stem: "Which combination of findings points to a structural rather than a metabolic cause of coma?",
        options: [
          "Symmetric hyper-reflexia with reactive pupils",
          "A unilateral dilated pupil with a contralateral hemiparesis",
          "Pin-point reactive pupils with a respiratory rate of 4",
          "A fluctuating level of consciousness with asterixis",
        ],
        correctIndex: 1,
        explanation: "Asymmetry localises: a unilateral third-nerve palsy with a contralateral hemiparesis is an uncal herniation syndrome, a structural, neurosurgical emergency. The other three are metabolic or toxic (drugs, hepatic encephalopathy).",
      },
      {
        type: "mcq",
        stem: "A patient arrives with a Glasgow Coma Scale of 6 after being found with heroin. What is the correct sequence?",
        options: [
          "Naloxone first, then check the airway",
          "Airway and ventilation with a bag-mask, then titrated naloxone and glucose",
          "Computed tomography before any drugs",
          "Flumazenil 1 mg intravenously and reassess",
        ],
        correctIndex: 1,
        explanation: "The cause of death in opioid overdose is respiratory failure, so ventilation precedes the antidote; naloxone is titrated to a respiratory rate, not to full arousal, and the glucose is measured. Flumazenil is unsafe in a mixed overdose and does not reverse respiratory depression reliably.",
      },
      {
        type: "mcq",
        stem: "Which is NOT part of Cushing's triad?",
        options: [
          "Systolic hypertension with a widening pulse pressure",
          "Reflex bradycardia",
          "An irregular respiratory pattern",
          "Low-grade fever with a stiff neck",
        ],
        correctIndex: 3,
        explanation: "Cushing's triad is hypertension with a widening pulse pressure, reflex bradycardia and an irregular respiratory pattern, reflecting the response to impending brainstem ischaemia. Fever with neck stiffness points instead to meningitis, which is a separate cause of coma.",
      },
      {
        type: "mcq",
        stem: "A patient with a pulmonary haemorrhage has a Glasgow Coma Scale of 3 on a propofol infusion in the intensive care unit. Which statement about the assessment is correct?",
        options: [
          "The Glasgow Coma Scale of 3 is reliable and indicates brain death",
          "Sedation must be excluded (a sedation hold) before the score is interpreted",
          "The score cannot be used in sedated patients but the pupils can",
          "Mechanical ventilation invalidates the scale",
        ],
        correctIndex: 1,
        explanation: "Propofol and opioids mimic coma, so the Glasgow Coma Scale is only interpretable in an unsedated or lightly sedated patient; many units record a daily off-sedation neurological assessment. Brainstem death requires the exclusion of drugs, hypothermia and metabolic causes in a defined protocol.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Consciousness depends on the reticular activating system and the cortex, so coma is diffuse (metabolic, toxic, hypoxic — symmetrical, reactive pupils) or structural (focal, asymmetric, cranial-nerve signs). The first minute of the unconscious patient is ABCDE plus a capillary glucose, titrated naloxone where the history fits, thiamine before glucose in the alcoholic, and positioning. The Glasgow Coma Scale is recorded by component, a score of 8 or less mandates intubation, and a unilateral dilated pupil or Cushing's triad is herniation until disproved.",
      },
      {
        type: "paragraph",
        text: "Next: fluid and electrolytes. The unconscious patient, the shocked patient and the anaesthetised patient all share a perioperative fluid problem — deficits, the choice of fluid, electrolyte correction and transfusion — and it is the area where judgement most often changes outcome.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 6 — Fluids, electrolytes & metabolism (fully authored)
// ---------------------------------------------------------------------------
function lesson6() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the body fluid compartments with volumes and calculate a maintenance and deficit requirement for a 70 kg adult; choose an appropriate crystalloid or blood product for a given clinical problem and defend the choice; correct sodium, potassium, calcium and magnesium safely with the maximum rates of correction; recognise and treat the perioperative metabolic stresses — the stress response, diabetic ketoacidosis and hyperosmolar hyperglycaemic state; and state the transfusion thresholds for red cells, platelets, plasma and fibrinogen.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (oxygen delivery — haemoglobin appears here as the transfusion target), PHYS 101 for osmotic gradients, PHRM 202 for electrolyte handling by the kidney, and the physiology of plasma oncotic pressure. You must be able to read a basic serum electrolyte panel and an arterial blood gas.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Extracellular fluid (ECF)",
        text: "The solute-rich fluid outside cells — plasma (about 3 L in a 70 kg adult) and interstitial fluid (about 11 L) — separated from the intracellular fluid (about 28 L) by a cell membrane freely permeable to water but not to sodium and chloride. Sodium is the effective osmole of the ECF, potassium that of the intracellular fluid.",
      },
      {
        type: "paragraph",
        text: "The whole subject is governed by where water goes. Sodium determines the volume of the ECF: give a sodium load and water follows it, and the patient gains extracellular volume — and gains it in the interstitium as oedema if the albumin falls, because oncotic pressure determines water distribution between plasma and interstitium within that ECF. Conversely, restricting sodium and water together diureses; restricting sodium alone retains water and dilutes the patient. Perioperative fluid prescribing is therefore an exercise in asking: is this patient short of water (dehydrated, dry mucous membranes, high urea, high haematocrit), short of sodium (a diuretic patient, low chloride, a metabolic alkalosis), or short of plasma volume (haemorrhage — the deficit needs blood, not saltwater)?",
      },

      { type: "heading", level: 2, text: "Fluid compartments and maintenance" },
      {
        type: "table",
        headers: ["Compartment", "Volume in a 70 kg man", "Percentage of body weight", "Composition"],
        rows: [
          ["Total body water", "42 L", "60% (lower in women, the elderly and the obese, since fat holds less water)", "—"],
          ["Intracellular fluid", "28 L", "40%", "High potassium, magnesium, phosphate; low sodium and chloride"],
          ["Extracellular fluid", "14 L", "20%", "High sodium and chloride; low potassium"],
          ["Interstitial fluid", "10.5–11 L", "15%", "Like plasma, but with less protein"],
          ["Plasma", "3 L", "4–5%", "Sodium 140 mmol/L, chloride 100, bicarbonate 24, albumin 40 g/L"],
          ["Transcellular fluid", "About 1 L", "1%", "Cerebrospinal fluid, gut secretions, joints, aqueous humour"],
        ],
      },
      {
        type: "code",
        language: "text",
        code: "4-2-1 rule (maintenance per hour)\n  4 mL/kg for the first 10 kg\n  + 2 mL/kg for the next 10 kg\n  + 1 mL/kg for each kg above 20 kg\n\n70 kg adult: 40 + 20 + 50 = 110 mL/h  ->  about 2500 mL per day\nHolliday-Segar (per day):\n  100 mL/kg for the first 10 kg\n  +  50 mL/kg for the next 10 kg\n  +  20 mL/kg for each kg above 20 kg",
        output: "70 kg adult maintenance: 110 mL/h, reduced in the elderly and in the post-operative patient (where ADH and aldosterone retain water) and increased in fever, burns, vomiting and high-output stomas",
        caption: "Calculating a maintenance fluid rate",
      },
      {
        type: "paragraph",
        text: "Deficits are judged clinically and then calculated by weight, not by recall: a 5% dehydration in a 70 kg patient is about 3.5 L of water (0.05 x 70 kg), and a 10% dehydration about 7 L. Clinical grading uses dry mucous membranes, a sunken eyes appearance, reduced skin turgor, a rising urea and creatinine with a rising urea-to-creatinine ratio, a low jugular venous pressure and a rising haematocrit. The surgical patient also owes maintenance plus ongoing losses: naso-gastric aspirate, biliary and pancreatic drains, stoma output, evaporation from exposed peritoneum, and the insensible loss of fever.",
      },

      { type: "heading", level: 2, text: "Choosing a fluid" },
      {
        type: "table",
        headers: ["Fluid", "Composition", "Use", "Problems"],
        rows: [
          ["0.9% sodium chloride", "Sodium 154 mmol/L, chloride 154 mmol/L", "Volume resuscitation, with potassium-containing chloride; the traditional resuscitation fluid", "Hyperchloraemic metabolic acidosis (chloride load raises plasma chloride, lowering the strong-ion difference and pH); 154 mmol/L chloride is unphysiological, and large-volume use worsens renal perfusion"],
          ["Balanced crystalloid (Ringer's lactate, Hartmann's, Plasma-Lyte)", "Sodium 130–140, potassium 4–5, chloride 98–112, with lactate, acetate or gluconate; sodium 140 with potassium 5 in Plasma-Lyte", "First choice for resuscitation and maintenance; the lactate is not lactic acid, it is a bicarbonate precursor metabolised by the liver", "Do not mix or co-infuse with citrated blood products (calcium in some balanced solutions causes clotting), and avoid in severe liver failure where lactate clearance is impaired"],
          ["Human albumin 4.5–5% or 20%", "Protein 40–50 g/L; a colloid with oncotic pressure", "Large-volume paracentesis (albumin 6–8 g per litre removed), hepatorenal syndrome, hypoalbuminaemic resuscitation in sepsis, nephrotic syndrome", "Expensive, limited by pasteurisation supply, no benefit shown over crystalloid in head injury (SAFE trial)"],
          ["Hypertonic saline 3%", "Sodium 513 mmol/L", "Cerebral oedema, symptomatic severe hyponatraemia, needs a central line and strict monitoring", "Too fast or too much causes osmotic demyelination or central pontine myelinolysis"],
          ["5% or 10% glucose", "Free water with 5 or 10 g/dL glucose", "Correcting plain water deficit and preventing hypoglycaemia in the fasting patient", "Distributes through total body water — only a fraction stays intravascular — so is useless for resuscitation and causes hyponatraemia with excess"],
        ],
      },
      {
        type: "paragraph",
        text: "The modern answer to 'which fluid?' is a balanced crystalloid, titrated to a measurable endpoint, in the smallest volume that achieves it, because fluid overload has a harms list as long as hypovolaemia: interstitial oedema, pulmonary oedema, impaired wound healing, delayed return of bowel function, prolonged ileus, anastomotic breakdown, and in abdominal surgery a directly proportional rise in complications. The endpoint is fluid responsiveness — a rise in stroke volume of more than 10% after a passive leg raise, or a stroke-volume-variation of over 13% in a mechanically ventilated patient — not a blood-pressure number.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "The fasting surgical patient is not the patient who needs litres of salt. A fasted adult loses water by breathing and circulation (approximately 1 mL/kg/h), and the post-operative ADH and aldosterone surge retains sodium and water, so maintenance-only or restricted fluids (or goal-directed fluid) have superseded liberal regimen in elective surgery, particularly in abdominal and thoracic cases.",
      },

      { type: "heading", level: 2, text: "Electrolyte correction" },
      {
        type: "table",
        headers: ["Electrolyte", "Normal range", "Causes of derangement", "Correction and rate limit"],
        rows: [
          ["Sodium", "135–145 mmol/L", "Low: diuretics (thiazides), heart failure, cirrhosis, syndrome of inappropriate antidiuretic hormone, hypothyroidism. High: water deficit, diabetes insipidus, fever, osmotic catharsis", "Severe symptomatic hyponatraemia: 150 mL of 3% saline over 20 minutes, repeat for symptoms. Do not raise sodium by more than 8–10 mmol/L in 24 hours — faster correction causes osmotic demyelination. Chronic hyponatraemia must be corrected slowly (4–6 mmol/L per 24 hours is standard); hypernatraemia corrected at no more than 10–12 mmol/L per 24 hours"],
          ["Potassium", "3.5–5.0 mmol/L", "Low: vomiting, naso-gastric loss, diuretics, alkalosis, insulin and beta-2 agonists, refeeding. High: renal failure, potassium-sparing diuretics, acidosis, tissue breakdown, suxamethonium in the at-risk patient", "Perioperatively do not chase potassium above 3.0 mmol/L if the patient is asymptomatic and on monitoring; correct with potassium chloride at no more than 10–20 mmol/h peripherally and 20–40 mmol/h centrally with continuous electrocardiographic monitoring. Treat the magnesium too, because hypomagnesaemia perpetuates hypokalaemia"],
          ["Magnesium", "0.7–1.0 mmol/L", "Low: diuretics, diarrhoea, refeeding, alcohol, proton-pump inhibitors, torsades de pointes, pre-eclampsia and eclampsia", "Magnesium sulfate 1–2 g (4–8 mmol) intravenously; check reflexes and respiratory rate, because toxicity causes weakness and respiratory depression and is reversed by calcium gluconate"],
          ["Calcium", "2.1–2.6 mmol/L total (1.1–1.3 ionised)", "Low: hypoparathyroidism, citrate toxicity after massive transfusion, hyperventilation (albumin binding), pancreatitis, rhabdomyolysis. High: malignancy, hyperparathyroidism, thiazides, immobility", "Severe symptomatic hypocalcaemia: 10 mL of 10% calcium chloride or gluconate intravenously, then an infusion. Correct for albumin or use the ionised value; hypercalcaemia is treated with intravenous fluid, then bisphosphonates and treatment of the cause"],
          ["Phosphate", "0.8–1.4 mmol/L", "Low: refeeding syndrome, diabetic ketoacidosis treatment, alcohol withdrawal, malabsorption", "Replace intravenously or orally in the intensive care patient remembering that hypophosphataemia causes weakness, respiratory failure and haemolysis"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Refeeding syndrome. Reintroducing carbohydrate to a starved patient (anorexia, prolonged fasting, alcohol, oncology chemotherapy, post-bariatric surgery) triggers insulin release, which shifts phosphate, potassium and magnesium into cells and thiamine consumption. The result is hypophosphataemia, hypokalaemia, hypomagnesaemia, cardiac and respiratory failure within 72 hours. Prevent with thiamine, B vitamins and a multivitamin before feeding, a cautious starting calorie intake, and phosphate, potassium and magnesium monitoring for at least three days.",
      },

      { type: "heading", level: 2, text: "Acid-base and metabolic emergencies" },
      {
        type: "paragraph",
        text: "In the perioperative patient three metabolic emergencies dominate. Use the anion gap — sodium plus potassium minus chloride minus bicarbonate, normally 8–12 mmol/L (or 12 plus or minus 4 without potassium) — to separate the causes of a metabolic acidosis.",
      },
      {
        type: "table",
        headers: ["Emergency", "Pathophysiology", "Diagnostic triad", "First treatment"],
        rows: [
          ["Diabetic ketoacidosis", "Absolute insulin deficiency with lipolysis and ketogenesis, causing hyperglycaemia, ketonaemia and an anion-gap acidosis", "Blood glucose above 11 mmol/L (or known diabetes), a venous pH below 7.3 or bicarbonate below 18 mmol/L, and ketonaemia above 3 mmol/L or ketonuria 2+", "Intravenous 0.9% saline initially with potassium chloride added once the potassium is below 5.5 mmol/L, a fixed-rate insulin infusion at 0.1 units/kg/h, and a long-acting insulin before the infusion is stopped. Potassium falls with treatment and must be monitored hourly"],
          ["Hyperosmolar hyperglycaemic state", "Partial insulin deficiency with profound hyperglycaemia and dehydration, without significant ketonaemia, in an older type 2 patient", "Glucose often above 35 mmol/L, osmolality above 320 mosmol/kg, and profound dehydration without significant ketones", "Large-volume isotonic fluid resuscitation guided by sodium and osmolality, then insulin once the fluids have begun, plus thromboprophylaxis — the mortality is far higher than in diabetic ketoacidosis"],
          ["Lactic acidosis of shock", "Tissue hypoperfusion and anaerobic metabolism, or metformin accumulation, or liver failure, or beta-2 agonists", "A raised lactate with a metabolic acidosis and an anion gap", "Treat the cause: fluid, blood, vasopressors, source control in sepsis, and stop the offending drug; bicarbonate only for severe pH with hyperkalaemia as a temporising measure"],
        ],
      },
      {
        type: "paragraph",
        text: "The perioperative stress response deserves a paragraph of its own, because it explains why fasting, surgery and trauma combine to create a sodium-and-water-retaining, catabolic state. Injury triggers the hypothalamic-pituitary-adrenal axis and the sympathetic nervous system: cortisol, catecholamines and aldosterone rise, causing sodium and water retention, potassium loss, and hyperglycaemia from gluconeogenesis and insulin resistance. Antidiuretic hormone is released by surgery itself and by pain, nausea and opioids, so moderate volumes of hypotonic fluid in this setting produce hyponatraemia (a leading cause of avoidable fluid-related harm, and one reason why glucose in 0.45% saline with added potassium is confined to children). This is also the pharmacological rationale for regional anaesthesia and analgesic blocks: blocking afferent input from the surgical site attenuates the response and reduces the catabolic and sodium-retaining load.",
      },

      { type: "heading", level: 2, text: "Blood products and transfusion" },
      {
        type: "table",
        headers: ["Product", "Transfusion trigger", "Dose and notes", "Risks"],
        rows: [
          ["Red cells", "Haemoglobin below 70 g/L (7 g/dL) in a stable patient; below 80 g/L (8 g/dL) with cardiovascular disease, or in acute anaemia with ongoing bleeding", "One unit raises haemoglobin by about 10 g/L in an adult; transfuse to a target and reassess, one unit at a time", "Transfusion-associated circulatory overload (the commonest cause of death), haemolysis from clerical error, infection, immunisation, transfusion-related acute lung injury"],
          ["Platelets", "Below 10 x 10^9/L prophylactically; below 20 with risk factors (sepsis, antibiotics, coagulopathy); below 50 before surgery or invasive procedures; below 100 with intracranial bleeding or neurosurgery", "One adult therapeutic dose raises the count by about 20–40 x 10^9/L", "Refractoriness (HLA antibodies), transfusion-related acute lung injury, bacterial contamination"],
          ["Fresh frozen plasma", "Bleeding with a prothrombin time or activated partial thromboplastin time over 1.5 times normal, or before invasive procedures with a coagulopathy; vitamin K antagonists with major bleeding", "12–15 mL/kg, aiming for a fibrinogen and factor replacement; must be ABO compatible", "Transfusion-associated circulatory overload, transfusion-related acute lung injury (historically from female donors), allergic reaction"],
          ["Cryoprecipitate and fibrinogen concentrate", "Fibrinogen below 1.5–2.0 g/L in bleeding", "Two pools of cryoprecipitate (about 3–4 g fibrinogen) in the trauma patient", "As for plasma"],
          ["Prothrombin complex concentrate", "Reversal of warfarin (with vitamin K 5–10 mg intravenously) in major bleeding; emergency reversal before urgent surgery", "Weight- and international-normalised-ratio-based dosing", "Thrombotic — myocardial infarction, stroke and venous thromboembolism"],
        ],
      },
      {
        type: "paragraph",
        text: "Major haemorrhage protocol. For exsanguinating haemorrhage the activation is: a predefined infusion of one unit each of red cells, plasma and platelets in a 1:1:1 ratio, with tranexamic acid 1 g over 10 minutes within 3 hours of injury, aiming for a target fibrinogen above 2 g/L, a platelet count above 50 x 10^9/L, a temperature above 35 °C, a pH above 7.2 (calcium above 1.1 mmol/L and haemoglobin above 7 g/dL) — the 'lethal triad' of trauma: hypothermia, acidosis and coagulopathy, each of which worsens the others. Give calcium early, because citrate binding removes ionised calcium in every unit transfused, and look up the drug history for anticoagulants.",
      },
      {
        type: "question",
        prompt: "A 70 kg man is nil by mouth for a colon resection and has been vomiting for two days. Calculate his hourly maintenance and state the additional volume you would prescribe.",
        answer: "Maintenance is about 110 mL/h by the 4-2-1 rule (40 + 20 + 50). Vomiting adds losses of gastric secretions, so add a crystalloid to cover the measured or estimated output (gastric loss is sodium-, chloride- and potassium-rich, so balanced crystalloid with potassium chloride is appropriate), plus a deficit correction for the 5% dehydration typical of two days of vomiting (about 3.5 L) divided over the first 24–48 hours with close monitoring.",
        explanation: "Most perioperative prescribing errors are additive: maintenance plus losses plus deficit, each estimated separately, and reassessed by examination and by the daily electrolyte panel rather than by a fixed prescription carried over for days.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Treating a low concentration of sodium as a sodium deficit. Hyponatraemia is nearly always a water excess (or a solute-rich pseudohyponatraemia), and the treatment is restricting free water or giving hypertonic saline — not a sodium bolus.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Giving 5% glucose as a resuscitation fluid or to a patient with raised intracranial pressure. It distributes into total body water so only about one-tenth stays intravascular, and glucose load worsens hyperglycaemia and neurological outcome after arrest or head injury.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Correcting chronic hyponatraemia too quickly. Raising sodium by more than 8–10 mmol/L in 24 hours risks osmotic demyelination (locked-in syndrome, quadriparesis, dysarthria), which is irreversible; correct the chronic, asymptomatic patient slowly and recheck the sodium every 4–6 hours.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Ignoring the potassium when starting insulin in diabetic ketoacidosis. Treatment drives potassium into cells, so the serum potassium falls rapidly; monitor hourly, and do not start insulin if the potassium is below 3.5 mmol/L until potassium has been replaced.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Transfusing to a haemoglobin of 100 g/L 'to optimise'. The restrictive threshold of 70 g/L (raised to 80 g/L with cardiovascular disease) reduces mortality in the trial evidence, and transfusion carries circulatory-overload, immunomodulatory and inflammatory risks.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does 0.9% saline cause a hyperchloraemic metabolic acidosis, and which clinical settings make balanced crystalloid preferable?",
        answer: "Sodium chloride has a chloride of 154 mmol/L, higher than plasma chloride of about 100, so a large-volume infusion lowers the strong-ion difference and acidaemia follows, with a paradoxical fall in renal perfusion. Balanced crystalloid (lactate or acetate as a bicarbonate precursor) avoids it, so it is preferred in resuscitation, sepsis, and where acidosis is being tracked.",
        explanation: "The acidosis is a laboratory artefact of the strong-ion model, but the physiological consequences (renal vasoconstriction, confused acid-base interpretation in the injured patient, and a falsely alarming base deficit in trauma) are real.",
      },
      {
        type: "question",
        prompt: "Calculate the maintenance fluid rate for a 10 kg child and a 25 kg child by the 4-2-1 rule, and explain the clinical situation in which this rate is deliberately increased.",
        answer: "A 10 kg child needs 40 mL/h; a 25 kg child needs 40 + 10 + 5 = 55 mL/h. The rate is increased for fever, burns, vomiting, diarrhoea, high stoma output, preoperative dehydration and diabetes insipidus, each of which adds to the basic water requirement.",
        explanation: "The 4-2-1 rule estimates just maintenance — for a surgical child you add the deficit correction (typically 50 mL/kg for 5% dehydration) and ongoing losses, then reassess by clinical examination and by weight, which is the most reliable measure of fluid balance.",
      },
      {
        type: "question",
        prompt: "A trauma patient has received 12 units of red cells and is cool, acidotic and bleeding. List the coordinated targets of a major haemorrhage protocol.",
        answer: "Tranexamic acid 1 g over 10 minutes within 3 hours of injury; a 1:1:1 ratio of red cells, plasma and platelets; fibrinogen above 2 g/L; platelets above 50 x 10^9/L; temperature above 35 °C; pH above 7.2; ionised calcium above 1.1 mmol/L; haemoglobin above 7 g/dL. Active control of haemorrhage is the definitive intervention, and stop the bleeding rather than transfusing around it.",
        explanation: "The lethal triad of trauma is hypothermia, acidosis and coagulopathy; each worsens the others, and the ratio-based protocol treats them in parallel while a surgeon ligates the vessel.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "What is the hourly maintenance rate for a 70 kg adult by the 4-2-1 rule?",
        options: [
          "70 mL/h",
          "110 mL/h",
          "250 mL/h",
          "40 mL/h",
        ],
        correctIndex: 1,
        explanation: "4 mL/kg for the first 10 kg (40), 2 mL/kg for the next 10 kg (20) and 1 mL/kg for the remaining 50 kg (50) = 110 mL/h, about 2.5 L per day. It is reduced in the elderly and postoperatively (where ADH and aldosterone retain water) and raised with fever and losses.",
      },
      {
        type: "mcq",
        stem: "A patient with a history of anorexia nervosa is started on enteral feeding and, 48 hours later, has weakness, arrhythmias and a serum phosphate of 0.3 mmol/L. What is the diagnosis?",
        options: [
          "Hyperosmolar hyperglycaemic state",
          "Refeeding syndrome",
          "Diabetic ketoacidosis",
          "Tumor lysis syndrome",
        ],
        correctIndex: 1,
        explanation: "Refeeding syndrome is the intracellular shift of phosphate, potassium and magnesium induced by insulin when carbohydrate is reintroduced to a starving patient, with thiamine depletion. Give thiamine, B vitamins and a multivitamin before feeding, correct the electrolytes, and monitor for at least 72 hours.",
      },
      {
        type: "mcq",
        stem: "Which set of perioperative transfusion targets is correct for major haemorrhage?",
        options: [
          "Fibrinogen above 4 g/L, platelets above 100 x 10^9/L, temperature below 35 °C",
          "Fibrinogen above 2 g/L, platelets above 50 x 10^9/L, temperature above 35 °C, pH above 7.2",
          "Fibrinogen below 1 g/L, pH below 7.0, platelets above 10 x 10^9/L",
          "Haemoglobin above 100 g/L and no tranexamic acid",
        ],
        correctIndex: 1,
        explanation: "Major haemorrhage targets a fibrinogen above 2 g/L, platelets above 50 x 10^9/L, temperature above 35 °C and pH above 7.2, with tranexamic acid within 3 hours of injury and a 1:1:1 replacement ratio. Hypothermia and acidosis worsen the coagulopathy they accompany.",
      },
      {
        type: "mcq",
        stem: "A patient with chronic hyponatraemia from a thiazide diuretic has a serum sodium of 118 mmol/L and is asymptomatic. Which is the safest management?",
        options: [
          "Rapid correction of sodium to 140 mmol/L with hypertonic saline over 6 hours",
          "Stop the thiazide, restrict free water, and correct sodium slowly with re-checking every 4–6 hours",
          "Give 3 litres of 0.9% saline as a bolus",
          "No action, because hyponatraemia is never symptomatic",
        ],
        correctIndex: 1,
        explanation: "Raising the sodium by more than 8–10 mmol/L in 24 hours in chronic hyponatraemia risks osmotic demyelination, so the corrections are slow and monitored. Large sodium chloride volumes are only used when there is genuine volume depletion or severe symptomatic hyponatraemia.",
      },
      {
        type: "mcq",
        stem: "A 60-year-old with myocardial infarction has a haemoglobin of 76 g/L and is haemodynamically stable. What is the appropriate transfusion threshold?",
        options: [
          "Transfuse only if the haemoglobin falls below 60 g/L",
          "Transfuse at 80 g/L in the presence of cardiovascular disease, one unit at a time with reassessment",
          "Transfuse to 100 g/L to optimise myocardial oxygen delivery",
          "Do not transfuse, because myocardial infarction removes the indication",
        ],
        correctIndex: 1,
        explanation: "The restrictive threshold is 70 g/L, raised to 80 g/L with cardiovascular disease or symptomatic anaemia, and single units are given with reassessment of the haemoglobin and of symptoms. Transfusing to 100 g/L has no benefit and adds risk.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Body water is 60% of body weight: two-thirds intracellular, one-third extracellular (interstitial and plasma). Maintenance is calculated by the 4-2-1 rule (110 mL/h in a 70 kg adult) and then modified by deficits and ongoing losses. Balanced crystalloid is the default resuscitation fluid; hyperchloraemic acidosis follows large-volume saline; and goal-directed, fluid-optional practice is the standard in major abdominal surgery. Sodium is corrected slowly (no more than 8–10 mmol/L in 24 hours), potassium is corrected with chloride and magnesium, and the transfusion thresholds are a haemoglobin of 70 g/L (raised to 80 g/L in cardiovascular disease), platelets of 10 x 10^9/L (higher for surgery and sepsis), and fibrinogen of 2 g/L.",
      },
      {
        type: "paragraph",
        text: "Next: pain. Every fluid decision in this lesson is followed by an analgesic question, and the next lesson covers assessment, the multimodal ladder, opioid conversion and the specific dangers of each analgesic class.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 7 — Pain management (fully authored)
// ---------------------------------------------------------------------------
function lesson7() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: assess pain with an appropriate tool, including in the child, the cognitively impaired and the critically ill; construct a multimodal analgesic plan for postoperative pain using the ladder; convert and titrate opioid doses safely with equianalgesic tables; state the maximum daily doses of paracetamol and ibuprofen and the risks of the non-steroidal anti-inflammatory drugs; manage opioid side effects and treat opioid toxicity with naloxone; and outline the pathway for chronic neuropathic pain and for acute-on-chronic pain.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 2 (Applied anaesthetic pharmacology) — opioid pharmacology and naloxone — and the physiology of nociception: transduction, transmission, modulation and perception, with the sympathetic and amplification of the dorsal-horn reflex.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Multimodal analgesia",
        text: "Delivering analgesia from drugs of different classes acting at different points in the pain pathway — paracetamol centrally, a non-steroidal anti-inflammatory drug at the prostaglandin-synthesis site, a regional block at the nerve, and an opioid at the spinal and supraspinal receptors — so that each dose is small, the total effect is additive, and the side effects of each class are minimised.",
      },
      {
        type: "paragraph",
        text: "Unrelieved acute pain has consequences that go far beyond discomfort: it causes tachycardia and hypertension, immobilisation and deep-vein thrombosis, splinting and atelectasis, aortic catecholamine surge, a hypercoagulable state, nausea and vomiting, chronic sensitisation of the spinal cord (converting acute to chronic pain), and delirium. The phrase to structure a plan around is 'treat before the pain becomes uncontrolled' — giving a non-opioid regularly rather than an opioid 'as required', because a request for rescue opioid is a signal the plan failed. Pre-emptive and regular non-opiotic dosing, regional blocks, and a written, stepwise plan are the architecture of acute pain management.",
      },

      { type: "heading", level: 2, text: "Assessing pain" },
      {
        type: "table",
        headers: ["Tool", "For whom", "How it is used"],
        rows: [
          ["Numerical rating scale 0–10", "Adults who can self-report", "0 = no pain, 10 = worst imaginable; record at rest and on movement (on coughing, on mobilising) because movement pain predicts function"],
          ["Visual analogue scale", "Adults and adolescents", "A 100 mm line anchored by 'no pain' and 'worst pain'"],
          ["Wong-Baker faces or Oucher", "Children over about 3 years", "Six faces from smiling to crying, chosen by the child"],
          ["FLACC", "Pre-verbal children and children who cannot self-report", "Face, Legs, Activity, Cry and Consolability, each scored 0–2"],
          ["PAINAD", "Patients with dementia or delirium", "Observing Breathing, Negative vocalisation, Facial expression, Body language and Consolability"],
          ["Behavioural Pain Scale", "Mechanically ventilated or sedated intensive-care patients", "Facial expression, upper-limb movements and compliance with ventilation, each scored 1–4"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Chronic opioid use, dementia, delirium and sedation all blunt the behavioural signs of pain, so a quiet, grimacing patient is not necessarily comfortable. In sedation scores, always pair behavioural scoring with an analgesic trial (a small opioid bolus) and re-score, and remember that analgesia is a separate axis from sedation in critical care.",
      },

      { type: "heading", level: 2, text: "The analgesic ladder and the multimodal plan" },
      {
        type: "paragraph",
        text: "The 1986 World Health Organization ladder was designed for cancer pain and has three steps: paracetamol or a non-steroidal anti-inflammatory drug (with or without an adjuvant) for mild pain; a weak opioid added for moderate pain; a strong opioid for severe pain. Modern acute postoperative practice has simplified and improved on it by giving the non-opioid step 1 and 2 drugs together from the start, adding regional anaesthesia, and reserving opioids for breakthrough pain — better called 'opioid-sparing' rather than 'opioid-free'.",
      },
      {
        type: "table",
        headers: ["Class and drug", "Dose", "Mechanism", "Principal risks and cautions"],
        rows: [
          ["Paracetamol", "1 g every 6 hours, maximum 4 g/day (reduce to 3 g/day in low body weight, malnutrition, age over 75, or hepatic or renal impairment)", "Central action — COX inhibition and descending serotonergic pathways", "Hepatotoxicity in overdose, and drug accumulation and cumulative harms with combination products; take the whole day's dose from all sources into account"],
          ["Non-steroidal anti-inflammatory drug: ibuprofen, diclofenac, naproxen", "Ibuprofen 400 mg three times daily; diclofenac 50 mg three times daily; naproxen 500 mg twice daily", "COX-1 and COX-2 inhibition, reducing prostaglandin-mediated peripheral sensitisation", "Gastric ulceration, renal impairment (avoid if estimated glomerular filtration rate is below 30–45 or with hypovolaemia), bronchospasm in aspirin-sensitive asthma, and impaired bone healing; give the shortest effective course, with a proton-pump inhibitor in higher-risk patients"],
          ["Weak opioid: codeine, tramadol, dihydrocodeine", "Codeine 30–60 mg every 4 hours (maximum 240 mg/day); tramadol 50–100 mg every 4–6 hours (maximum 300 mg/day over 75 years)", "Codeine is 10% morphine after CYP2D6 conversion, hence the 'variable and unpredictable' effect; tramadol inhibits noradrenaline and serotonin reuptake as well as mu receptors", "Codeine causes constipation with no advantage over a small morphine dose; tramadol causes serotonin syndrome (avoid with selective serotonin reuptake inhibitors) and seizures in overdose; both have a short effective duration"],
          ["Strong opioid: morphine (oral, immediate release or modified release), oxycodone, fentanyl", "Oral morphine 5–10 mg every 4 hours as an immediate-release starting dose; intravenous morphine 0.05–0.1 mg/kg titrated in 1–2 mg increments", "Mu-receptor agonism in the dorsal horn, brainstem and cortex", "Respiratory depression, sedation, nausea, constipation, urinary retention, pruritus, tolerance, dependence and (uncommonly) addiction; see conversion below"],
          ["Adjuvants: gabapentinoids, amitriptyline, capsaicin, ketamine", "Gabapentin 100–300 mg at night, titrated to 300 mg three times daily in the postoperative setting; amitriptyline 10–25 mg at night for neuropathic pain", "Gabapentinoids bind the alpha-2-delta subunit of the calcium channel in the dorsal horn; amitriptyline blocks noradrenaline and serotonin reuptake", "Sedation, dizziness, weight gain; renal dose adjustment for gabapentin; in major surgery the combination of gabapentinoids and opioids increases sedation and respiratory depression, so titrate"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Opioids work better as a rescue than as a backbone. Giving regular paracetamol and a non-steroidal anti-inflammatory drug, and local anaesthetic infiltration or a regional block, reduces 24-hour opioid consumption by 30–50% in major surgery, and with it nausea, vomiting, ileus and sedation. The one situation in which opioids are given early and liberally is uncontrolled pain — and even then the first question is whether the underlying cause (a distended bladder, compartment syndrome, an ischaemic limb, an undiagnosed fracture) has been missed.",
      },

      { type: "heading", level: 2, text: "Opioid conversion and titration" },
      {
        type: "table",
        headers: ["Conversion", "Rule", "Caveat"],
        rows: [
          ["Oral morphine to subcutaneous or intravenous morphine", "Divide by 3 (oral bioavailability about 30%)", "Titrate downwards if the patient is frail, elderly or renally impaired; incomplete cross-tolerance requires a 25–50% dose reduction when switching"],
          ["Oral morphine to codeine", "Codeine is roughly one-tenth as potent", "Codeine's effect is genetically variable (CYP2D6 poor and ultra-rapid metabolisers), so a fixed conversion is a poor substitute for titration"],
          ["Oral morphine to a transdermal fentanyl patch", "Roughly 25 micrograms/h per 60 mg per day of oral morphine", "The patch takes 12–24 hours to reach a steady state, so give residual morphine when starting; a patch is never used for unstable or acute pain"],
          ["Morphine to oxycodone", "Oral morphine 10 mg is approximately equivalent to oxycodone 5 mg (a factor of about 2)", "Monitor for oxycodone accumulation in renal impairment"],
          ["Titration in the acute setting", "Titrate 1–2 mg intravenous morphine every 5–10 minutes until the pain is controlled", "Continuous pulse oximetry is not mandatory but respiratory rate and sedation are; prescribers must be confident in managing opioid overdose"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Converting from one opioid to another is never 1:1. Incomplete cross-tolerance means the starting dose should be 50% of the calculated equivalent, then titrated, particularly when changing to methadone, fentanyl or transdermal preparations. The commonest cause of opioid-related death in community and palliative prescribing is a conversion error combined with breakthrough doses added on top.",
      },

      { type: "heading", level: 2, text: "Opioid side effects, toxicity and addiction" },
      {
        type: "paragraph",
        text: "Prescribe the side-effect management at the same time as the opioid, not after the complication: a laxative (stimulant plus softener: senna, docusate, macrogol) for constipation, which is the one effect that never shows tolerance; an anti-emetic (a dopamine antagonist such as ondansetron, or cyclizine, or low-dose naloxone in resistant pruritus after discussion) for nausea; and a bowel-versus-bladder review for urinary retention. Toxicity is recognised by the grading of sedation — a patient who is 'sleepy but rousable' has already passed the safe window, and 'only rousable to pain' is an emergency.",
      },
      {
        type: "table",
        headers: ["Clinical state", "Signs", "Action"],
        rows: [
          ["Effective analgesia", "Pain controlled, alert or normally sleepy, respiratory rate over 10, saturation in target", "Continue and reassess; the plan is working"],
          ["Excessive sedation", "Difficult to rouse, reduced respiratory rate under 8, pin-point pupils", "Stop any further opioid, call an anaesthetist, oxygen, stimulate, prepare naloxone; document the neurological observation"],
          ["Opioid overdose", "Respiratory rate under 8 or apnoea, unresponsive pupils, hypoxia, bradycardia", "Assist ventilation with bag-mask and oxygen immediately; titrate naloxone in 100 micrograms increments intravenously (400 micrograms if respiratory arrest), or a 2 mg intranasal or intramuscular dose; observe for 30 minutes for re-narcotisation"],
          ["Chronic use and dependence", "Tolerance (increasing dose for the same effect), physical dependence (withdrawal on stopping) and opioid-induced hyperalgesia", "Plan weaning and a multidisciplinary approach; distinguish from addiction, which is a separate behavioural disorder involving loss of control and compulsive use"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Take-home naloxone is standard practice for patients on long-term opioids with risk factors (a history of overdose, respiratory disease, concurrent benzodiazepines). Its use with family members is part of the consent conversation, and its education is a legal duty in many countries.",
      },

      { type: "heading", level: 2, text: "Anaesthetic and regional contributions" },
      {
        type: "table",
        headers: ["Technique", "Indication", "Notes and complications"],
        rows: [
          ["Local infiltration and wound catheters", "Most surgical wounds", "Local anaesthetic into the wound at the end of surgery, or a catheter for continuous infusion; inexpensive and safe"],
          ["Peripheral nerve block", "Limb surgery, abdominal wall, thoracotomy, caesarean section", "Ultrasound-guided with a nerve stimulator as backup; gives complete analgesia of the operative area for hours to days; complications are inadvertent intravascular injection, nerve injury and LAST"],
          ["Neuraxial: epidural and spinal", "Major abdominal, thoracic and orthopaedic surgery, labour, fractured neck of femur", "A continuous epidural covers a segmental distribution and enables mobilisation and physiotherapy; hypotension is handled by fluid and vasopressors, and a postoperative epidural requires monitoring of motor and sensory level"],
          ["Ketamine at subanaesthetic doses", "Opioid-resistant pain and severe chronic pain; acute-on-chronic in the opioid-tolerant patient", "0.1–0.3 mg/kg repeated, or an infusion; avoid in hypertension, ischaemic heart disease and psychosis; psychomimetic at higher doses"],
          ["Patient-controlled analgesia (PCA)", "Postoperative pain, sickle cell crisis, burns and palliative care", "A demand dose with a lockout interval (morphine 1 mg with a 5-minute lockout is a common adult prescription) with a 4-hour limit; safe because the patient is the control, but avoid in confusion, respiratory failure and inability to understand the device"],
        ],
      },

      { type: "heading", level: 2, text: "Chronic pain" },
      {
        type: "paragraph",
        text: "Chronic pain — pain persisting beyond three months or beyond expected healing — is managed by a biopsychosocial pathway, not a linear ladder, because persistent pain involves central sensitisation, fear-avoidance beliefs, sleep disturbance and mood. The mainstays are: for neuropathic pain, amitriptyline (10–25 mg at night, titrated to 75 mg) or duloxetine, and a gabapentinoid (gabapentin or pregabalin) as second line, with a capsaicin cream for localised peripheral neuropathic pain; for musculoskeletal pain, structured exercise, weight management, cognitive behavioural therapy and a pain-management programme, with non-steroidal anti-inflammatory drugs in short courses and topical agents first; and for intractable cancer pain, the World Health Organization ladder with a strong opioid, adjuvant analgesics, and interventional procedures (nerve blocks, coeliac plexus block, intrathecal therapy) around the breakthrough symptom. The distinction between opioid dependence, which is expected after prolonged use, and addiction, which is a behavioural disorder, remains central to the ethics and the safety of prescribing.",
      },
      {
        type: "question",
        prompt: "A 68-year-old woman has had a knee replacement and is prescribed paracetamol 1 g four times daily, ibuprofen 400 mg three times daily and oxycodone 10 mg modified release twice daily, with oxycodone 5 mg required for breakthrough. She is opioid-naive. What is the problem and the fix?",
        answer: "The problem is a strong opioid given routinely at an adult dose in an opioid-naive elderly patient, with an additional strong opioid for breakthrough, on top of a potent non-opioid base. The fix is a multimodal base of paracetamol (with the daily total checked) and a non-steroidal anti-inflammatory drug, local infiltration by the surgeon or a femoral nerve block, and a short-acting low-potency opioid (codeine or tramadol in an elderly patient is often poorly tolerated, so a small immediate-release oxycodone dose — 2.5–5 mg — as required) titrated against sedation and respiratory rate.",
        explanation: "The risk is respiratory depression and sedation in a patient who has no tolerance, and whose pain may well be controlled by the non-opioid and regional components alone. Breakthrough opioids should be prescribed at a fraction of the regular dose, with a written ceiling and clear observation parameters.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Prescribing an opioid 'as required' only. An as-required request is a symptom of uncontrolled pain, and a patient who cannot press the call bell, or who is asleep when the rounds come, receives no analgesia at all.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Adding codeine to paracetamol tablets to make a 'stronger' analgesic. Codeine's variable and unpredictable metabolism, a distinct lack of efficacy in trials, and its constipation make it a poor choice compared with a titrated morphine dose.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Prescribing a non-steroidal anti-inflammatory drug in a patient with a reduced glomerular filtration rate, hypovolaemia, a peptic-ulcer history or aspirin-sensitive asthma. Check renal function and the bleeding history, avoid where the estimated glomerular filtration rate is below 45 mL/min or the patient is dehydrated, and use the shortest effective course with a proton-pump inhibitor if the risk is high.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Failing to prescribe a laxative with a new strong opioid, or failing to diagnose a complication that is presenting as pain — a distended bladder, compartment syndrome, an ischaemic limb, an anastomotic leak or a surgical wound haematoma.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Titrating a modified-release opioid in an opioid-naive patient, or converting from another opioid at a 1:1 ratio. Modified-release preparations are for stable pain only, and every conversion has a 25–50% reduction for incomplete cross-tolerance.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why is a multimodal plan more effective than the sum of its parts rather than simply better tolerated?",
        answer: "The drugs act at different points in the pain pathway — prostaglandin synthesis at the periphery, sodium-channel conduction at the nerve, and mu-receptor action in the dorsal horn and brainstem — and pain is amplified by two processes (peripheral sensitisation and central sensitisation) that each class interrupts. The doses needed for each drug to reach its own effect fall, and the ceiling of each individual class is not the ceiling of the combination.",
        explanation: "The single-dose combinatorial effect is usually additive, but persistent pain also recruits descending and ascending facilitation, so each class reduces the 'upstream' inputs that the others have to overcome.",
      },
      {
        type: "question",
        prompt: "List the paracetamol and ibuprofen maximum daily doses for a 70 kg adult, and the dose adjustments for the frail elderly.",
        answer: "Paracetamol 1 g every 6 hours, a maximum of 4 g/day, reduced to 3 g/day in a patient with a body weight under 50 kg, malnutrition, chronic alcohol use, hepatic impairment or age over 75. Ibuprofen 400 mg three times daily with food, for the shortest effective course, and avoided or reduced in renal impairment, dehydration and in patients on anticoagulants or other nephrotoxic drugs.",
        explanation: "Cumulative paracetamol overdose is usually iatrogenic (combination products, multiple sources, and the feverish child whose parents double up on medicines), whereas non-steroidal adverse effects are dose- and duration-related, so a prescribed course and a stop date are part of the prescription.",
      },
      {
        type: "question",
        prompt: "How would you manage a patient who is on morphine 30 mg twice daily and develops breakthrough pain after abdominal surgery that you assess as moderate?",
        answer: "Reassess for a surgical cause (a leak, an ileus, a haematoma), then prescribe regular paracetamol, and a non-steroidal anti-inflammatory if the kidneys allow, and a local or regional component. For breakthrough, give a small immediate-release dose — roughly one-sixth of the total daily dose divided into 4-hourly doses (for 60 mg/day that is about 5–10 mg) — not a modified-release increase, and reduce if the patient is drowsy or has a respiratory rate under 10.",
        explanation: "Breakthrough dosing is conventionally about 10–15% of the total daily oral morphine dose, with the total dose reviewed after 24 hours and the modified-release prescription adjusted only when a stable pattern has emerged.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which statement about codeine is correct?",
        options: [
          "Codeine is a prodrug converted to morphine by CYP2D6, giving variable efficacy",
          "Codeine is more potent than morphine",
          "Codeine is an anti-inflammatory drug and does not cause constipation",
          "Codeine's conversion to morphine is complete in every patient",
        ],
        correctIndex: 0,
        explanation: "Codeine's analgesic effect depends on CYP2D6 conversion to morphine, which is genetically variable — poor metabolisers get little effect and ultra-rapid metabolisers can be overdosed, including through breastfeeding. It causes constipation like every opioid and is not an anti-inflammatory.",
      },
      {
        type: "mcq",
        stem: "A postoperative patient on fentanyl has a respiratory rate of 6 and is unrousable with pin-point pupils. What is the immediate management?",
        options: [
          "Stop the opioid and observe for one hour",
          "Assist ventilation with bag-mask and oxygen, then titrate naloxone in 100 micrograms increments to respiratory rate",
          "Give naloxone 2 mg as a single bolus to full arousal",
          "Give flumazenil and reassess",
        ],
        correctIndex: 1,
        explanation: "Ventilation comes before the antidote, and naloxone is titrated to a respiratory rate rather than to full arousal because a full reversal precipitates withdrawal, sympathetic surge, arrhythmia and acute pain. The patient needs monitoring for at least 30 minutes because fentanyl outlasts naloxone.",
      },
      {
        type: "mcq",
        stem: "Which analgesic has a ceiling that makes a combination of paracetamol and ibuprofen additive but not indefinitely dose-titratable upwards?",
        options: [
          "Morphine",
          "Paracetamol, which has a defined maximum daily dose",
          "Oxycodone",
          "Fentanyl",
        ],
        correctIndex: 1,
        explanation: "Paracetamol has a hard maximum of 4 g/day (3 g/day in the frail) beyond which the metabolite N-acetyl-p-benzoquinone imine accumulates and hepatotoxicity follows; opioids have no dose ceiling, only dose-limiting side effects. Ibuprofen also has dose-limiting renal and gastrointestinal toxicity.",
      },
      {
        type: "mcq",
        stem: "A patient requires oral morphine to codeine conversion. What is the approximate relationship?",
        options: [
          "Codeine is about 10 times as potent as morphine",
          "Codeine is about one-tenth as potent as morphine",
          "They are equipotent",
          "The potency depends only on the weight",
        ],
        correctIndex: 1,
        explanation: "Codeine is approximately one-tenth as potent as morphine (which is why 300 mg of oral morphine corresponds to about 30 mg of codeine), and even that conversion is unreliable because CYP2D6 metabolism is genetically variable — so titrate rather than convert.",
      },
      {
        type: "mcq",
        stem: "Which patient is at greatest risk of harm from a paracetamol-containing combination product?",
        options: [
          "An adult with a normal weight and no hepatic risk factors",
          "A frail 78-year-old with malnutrition and chronic alcohol use, also taking combination analgesics",
          "A 30-year-old post-caesarean patient on one product",
          "A healthy 45-year-old with migraine",
        ],
        correctIndex: 1,
        explanation: "The frail elderly, malnourished and chronically alcohol-using patient has depleted glutathione reserves and a reduced maximum safe daily dose (3 g), and combination products hide the total paracetamol dose, which is the classic mechanism of accidental overdose and hepatocellular injury.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Pain is assessed with a scale appropriate to the patient, treated regularly rather than as required, and delivered by the multimodal route: paracetamol (maximum 4 g/day, 3 g/day in the frail), a short course of a non-steroidal anti-inflammatory drug where the kidneys and stomach allow, a regional or local block wherever the surgery allows it, and opioids titrated to effect with a rescue dose about one-tenth of the total daily morphine dose and a written plan for its side effects. Toxicity is managed by ventilation and titrated naloxone, not by full reversal; chronic pain takes a biopsychosocial pathway with gabapentinoids, amitriptyline and pain programmes.",
      },
      {
        type: "paragraph",
        text: "Next: pre-operative evaluation and monitoring. Before any of the analgesia, fluids or drugs of the previous lessons can be given safely, the patient must be assessed, optimised and consented — and the monitoring that keeps them safe has to be in place from induction to recovery.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 8 — Pre-operative evaluation & monitoring (fully authored)
// ---------------------------------------------------------------------------
function lesson8() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: take a pre-operative history and examination that identifies cardiovascular and respiratory risk; calculate functional capacity in metabolic equivalents and apply the Revised Cardiac Risk Index and the American Society of Anesthesiologists physical status; plan fasting, medication changes and investigations on the basis of an indication rather than routine; and set up the minimum standard of monitoring, including mandatory capnography, temperature and neuromuscular monitoring.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1–7 of this course, especially Lesson 2 (pharmacology) and Lesson 6 (fluid and metabolic management). Anatomy of the neck for the practical skills (jugular vein cannulation and airway assessment) is assumed.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Pre-operative evaluation",
        text: "A structured assessment of the risk that the surgical and anaesthetic plan imposes on the patient, followed by an explicit decision either to proceed, to optimise first, to change the plan (needle cuff, a different site, a regional technique), or to defer and refer. It is a risk-reduction exercise, not a requirement to be 'cleared'.",
      },
      {
        type: "paragraph",
        text: "The purpose of the pre-operative visit is not to certify a normal patient for elective surgery; it is to identify the things that will change the anaesthetic plan. Three facts do most of this work: functional capacity (how much walking on the flat, or climbing stairs, the patient can do before becoming breathless); the presence of specific comorbidity that changes anaesthetic management; and the medication list, because some drugs are stopped, some are continued and a few are actively dangerous. Investigations follow from this history — a routine 'pre-operative bloods' panel in a fit 30-year-old is a habit, not a risk assessment, and it changes nothing.",
      },

      { type: "heading", level: 2, text: "Risk stratification" },
      {
        type: "table",
        headers: ["Tool", "What it measures", "How it is used"],
        rows: [
          ["Functional capacity in metabolic equivalents (METs)", "Less than 4 METs = cannot climb a single flight of stairs or walk up a hill; 4–10 METs = moderate; over 10 METs = excellent", "Under 4 METs predicts postoperative complications independently, and if the surgery is high risk and the capacity is poor, further cardiac assessment or a change of plan (needle cuff, a regional technique) is indicated"],
          ["ASA physical status I-VI", "I: healthy; II: mild systemic disease; III: severe systemic disease limiting activity; IV: constant threat to life; V: moribund; VI: brain dead (organ donor). An E is added for emergency", "A simple, universal shorthand for the anaesthetic risk, and the definition used in outcome data and in consent"],
          ["Revised Cardiac Risk Index", "High-risk type of surgery, history of ischaemic heart disease, heart failure, stroke or transient ischaemic attack, insulin-dependent diabetes, and serum creatinine above 2 mg/dL", "Each factor adds roughly 1.5–2% to the major cardiac complication rate; three or more factors means the risks and benefits must be discussed frankly and the case reconsidered"],
          ["Metabolic exercise testing (CPET, DASI)", "Oxygen uptake at the anaerobic threshold", "The most reliable pre-operative tool in the uncertain patient, though not available everywhere; considered in the high-risk high-complexity operation with poor functional capacity"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The commonest cause of an avoidable peri-operative death in the high-risk patient is a failure of punctual recognition, not of exotic intervention. A patient with poor functional capacity and who is breathless at rest should have their surgery deferred for a reason, with a documented plan for optimisation, rather than being 'cleared' on the day.",
      },

      { type: "heading", level: 2, text: "Optimising the comorbidity" },
      {
        type: "table",
        headers: ["Comorbidity", "Pre-operative target", "Action"],
        rows: [
          ["Hypertension", "Systolic under 180 and diastolic under 110 in clinic; lower if the surgery is elective and time permits", "Continue most antihypertensives; hold angiotensin-converting enzyme inhibitors and angiotensin-receptor blockers on the morning of surgery in the hypotensive-prone patient (a vasodilatory source of hypotension on induction)"],
          ["Ischaemic heart disease", "Stable symptoms, and no recent infarction (elective surgery is deferred at least 6 months if possible; if it must proceed, ensure the cardiology plan is current)", "Adequate anti-anginal therapy; a cardiology review for unstable symptoms or a recent stent — the antiplatelet plan is decided with the cardiologist and the surgeon"],
          ["Heart failure", "Euvolemic, no orthopnoea, a normal chest radiograph if imaged", "Optimise diuresis and continue heart-failure therapy echocardiographic review; a newly decompensated patient is cancelled"],
          ["Asthma and COPD", "Peak expiratory flow or forced expiratory volume within 20% of the patient's best; no wheeze at examination; no recent exacerbation or antibiotic course without an interval", "Continue inhalers; a short preoperative course of steroids (prednisolone 30 mg or hydrocortisone intravenously at induction) if steroid-dependent; regional anaesthesia where possible; a physiotherapy plan for the high risk"],
          ["Diabetes", "Glucose 6–10 mmol/L (chloride-corrected); avoid ketones; a target that the ward can achieve with a modified insulin or oral regimen", "Variable-rate intravenous insulin infusion and glucose-potassium-insulin protocol in the theatre period for patients with long-duration insulin use, type 1 diabetes, or emergency surgery; monitor for possible DKA and HHS; hold SGLT2 inhibitors to prevent euglycaemic ketoacidosis"],
          ["Obesity and obstructive sleep apnoea", "Document the sleep apnoea status and the baseline saturation; an anaesthetic and extubation plan", "Ramped positioning, a supraglottic device to hand, extubation awake and sitting up, and a continuous positive airway pressure device in the post-operative period"],
          ["Anaemia", "Haemoglobin above the local target, ideally over 100 g/L for high-risk surgery with oral or intravenous iron", "Do not transfuse to 'optimise' — use iron and stop the bleeding source; avoid unnecessary blood transfusion"],
          ["Anticoagulants", "No active anticoagulation at the time of surgery where the anticoagulant's effect is not needed for the operation", "Continue aspirin for cardiac indications; warfarin is stopped 5 days preoperatively with bridging only for high-thrombotic-risk patients (mechanical mitral valve, recent venous thromboembolism); direct oral anticoagulants are held 24–72 hours depending on the agent and renal function; clopidogrel is stopped 5–7 days"],
        ],
      },

      { type: "heading", level: 2, text: "Fasting and the day of surgery" },
      {
        type: "table",
        headers: ["Item", "Fasting rule", "Comment"],
        rows: [
          ["Clear fluids", "2 hours", "Water, clear squash, black tea or coffee without milk; a patient with slow gastric emptying (diabetes, opiates, obesity) may need longer"],
          ["Breast milk", "4 hours", "Standard for the infant"],
          ["Light meal / formula milk / cow's milk", "6 hours", "Milk is treated as a solid"],
          ["Fried or fatty food / solids generally", "8 hours", "Gastric emptying is calorie- and fat-dependent, hence the longer rule"],
          ["Chewing gum and sweets", "6 hours", "Treated as solids"],
          ["Carbohydrate loading", "A preoperative clear carbohydrate drink 2–3 hours before surgery, per local protocol", "Reduces postoperative insulin resistance and thirst and may reduce length of stay; used in the enhanced recovery programme"],
          ["Smoking", "Abstain for at least 8–12 hours if possible; a 6–8 week cessation gives the maximum benefit", "Even 12 hours reduces carboxyhaemoglobin and nicotine effects; any short cessation is better than none"],
        ],
      },
      {
        type: "paragraph",
        text: "Consent for the anaesthetic must be specific and honest: the technique (general, regional, spinal, sedation), its alternatives, the material risks in that patient — airway or dental damage, awareness, nerve injury, a post-dural puncture headache, anaphylaxis, sore throat, nausea, damage from positioning — the fasting and medication instructions, the possibility of a regional or intensive-care intervention, and a plan for postoperative pain. In the UK the anaesthetist is responsible for the anaesthetic consent, not the surgeon, and the documented plan is available to the receiving team.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The WHO Surgical Safety Checklist structures the day: Sign in (before induction — identity, site, consent, allergy, airway, blood loss available); Time out (before incision — the team introduces itself, the patient, procedure and site are confirmed, anticipated critical events and antibiotic prophylaxis and imaging are stated); Sign out (before leaving — the instrument, swab and needle counts, specimen labelling, recovery plan, postoperative instructions and concerns). The evidence for the checklist in reducing mortality and complications is one of the strongest in patient safety.",
      },

      { type: "heading", level: 2, text: "Monitoring" },
      {
        type: "paragraph",
        text: "The minimum standard of monitoring for any patient receiving general, regional or monitored-anaesthesia-care sedation is continuous electrocardiography, pulse oximetry, non-invasive blood pressure at prescribed intervals (at least every 5 minutes), and — mandatory for any intubated, sedated or anaesthetised patient — waveform capnography. Add temperature, an oxygen analyser with inspired oxygen monitoring, volatile agent concentration, a ventilator disconnect alarm, and, whenever a neuromuscular blocking drug is used, an objective neuromuscular monitor.",
      },
      {
        type: "table",
        headers: ["Monitor", "What it gives you", "Clinical value and pitfalls"],
        rows: [
          ["Electrocardiography", "Rate, rhythm and continuous ST-segment monitoring", "Leads II and V5 detect ischaemia best; standard lead II alone misses lateral changes; artefact from shivering, diathermy or movement is common"],
          ["Non-invasive blood pressure", "Systolic, diastolic and mean pressure", "Too-large a cuff over-reads; site (upper-arm versus calf) has to be consistent; low perfusion or a cold limb gives inaccurate readings"],
          ["Pulse oximetry", "Oxygen saturation and the pulse rate", "Unreliable in nil-oxygen-carrying carbon monoxide poisoning, in severe anaemia, in movement and in a vasoconstricted limb; the response is 30+ seconds slow, so desaturation is late"],
          ["Waveform capnography", "End-tidal carbon dioxide and the shape of the capnogram", "The only reliable confirmation of airway placement and the earliest indication of malignant hyperthermia (a rising end-tidal carbon dioxide) and of inadequate ventilation; obesity and a V/Q shift raise the gradient"],
          ["Neuromuscular monitor", "Train-of-four ratio, post-tetanic count", "Mandatory whenever a relaxant is used; a ratio of 0.9 or above is the extubation requirement and clinical judgement is not adequate"],
          ["Temperature", "Core temperature at two sites where a central neuraxial or long case", "Prevents and detects malignant hyperthermia and identifies the hypothermia that worsens coagulopathy and increases wound infection"],
          ["Invasive arterial or central venous pressure", "Beat-to-beat pressure, sampling of gases and glucose, central venous oxygen saturation", "Reserved for the high-risk patient: haemodynamic instability, planned inotropes, long case, and cardiac and neurosurgery"],
          ["Depth-of-anaesthesia monitor (bispectral index)", "Processed EEG-based sedation level", "Has a role in reducing awareness in high-risk patients and in titrating titratable total intravenous anaesthesia, but it does not replace the standard set and is affected by muscle relaxants"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Awareness (unintended intraoperative consciousness) has a real incidence — roughly 1 in 19,000 general anaesthetics in the United Kingdom (NAP5), but 1 in 6700 for obstetric anaesthesia and 1 in 330 in the resuscitation setting where muscle relaxants are used for intubation. Risk factors are a neuromuscular-blockade technique, a long case, cardiac, obstetric and emergency surgery, female sex, difficult-airway or emergency induction and a history of awareness. Prevent by checking that a patient is not paralysed with a visible sedation depth, by giving a supramaximal induction dose and an anaesthetic before the relaxant, and by using a depth monitor in the high-risk patient.",
      },

      { type: "heading", level: 2, text: "Worked example: one high-risk patient" },
      {
        type: "paragraph",
        text: "A 78-year-old with ischaemic heart disease requires an emergency laparotomy for a perforated diverticulum. Functional capacity is 2 METs (breathless climbing one flight of stairs); the Revised Cardiac Risk Index is 2 (age over 65 with ischaemic heart disease, and emergency surgery). The plan is: senior anaesthesia and surgery involvement, an arterial line and a central line before induction, a rapid-sequence induction with etomidate (or ketamine) and rocuronium 1.2 mg/kg, an arterial blood gas, blood-group save and cross-match, a goal-directed fluid and haemodynamic plan with a noradrenaline infusion if needed, tranexamic acid if significant blood loss is anticipated, and a documented postoperative destination (a high-dependency or intensive-care bed arranged before the surgery starts). What is written down is the plan, and the plan starts with the patient's physiology rather than with the theatre list.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Ordering 'routine pre-operative tests' without an indication. Normal results in a fit 25-year-old do not change anything, and abnormal results in an untested patient (a mild anaemia of no consequence, a slightly raised creatinine that is chronic) delay surgery without benefit. Investigations follow from history and examination.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Holding a beta-blocker or a statin before a major operation. Beta-blockers that are chronic are continued (acute initiation of a beta-blocker increases stroke and mortality), and stopping statins has been associated with an increased postoperative cardiac event rate.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Holding clopidogrel without a plan, or continuing it in a patient booked for intracranial or spinal surgery. The decision is a joint one with the surgeon and cardiologist and has to be documented.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting the plan for the recovery period: who observes, who receives the oxygen, the analgesia, the fluids and the drain, what are the emergence-and-extubation criteria, and what the escalation criteria are.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Which elements of the minimum monitoring set are mandatory for a patient undergoing general anaesthesia with a muscle relaxant, and why?",
        answer: "Electrocardiography, pulse oximetry, non-invasive blood pressure with a pressure trace at least every 5 minutes, waveform capnography (to confirm airway placement and detect hypo- and hyperventilation), temperature (to detect malignant hyperthermia and hypothermia), an inspired oxygen analyser, and an objective neuromuscular monitor whenever a relaxant has been given.",
        explanation: "The list is defined by the standards of national anaesthetic bodies; the capnography and neuromuscular monitoring are the two that most often prevent catastrophic hypoxic and obstructive events, and the thermometer is the priority when a volatile agent has been given.",
      },
      {
        type: "question",
        prompt: "A 70-year-old with type 2 diabetes is listed for a laparoscopic hernia repair. What fasting instructions and perioperative medication plan would you give?",
        answer: "Clear fluids are permitted until 2 hours and a light meal until 6 hours before surgery (usually 6 hours for food and 2 hours for clear fluids by local policy), with a clear carbohydrate drink 2–3 hours before induction per the enhanced-recovery protocol. Diabetes drugs: hold metformin on the day; hold SGLT2 inhibitors 2–3 days before the operation to prevent euglycaemic ketoacidosis; other oral agents are usually omitted on the morning of surgery and restarted with eating; long-acting insulin is continued and short-acting insulin omitted.",
        explanation: "The fasting rules balance gastric-emptying physiology against the thirst and insulin resistance of prolonged starvation; the medication plan prevents the DKA of omitted insulin and the euglycaemic ketoacidosis of a continued SGLT2 inhibitor during the catabolic stress of surgery.",
      },
      {
        type: "question",
        prompt: "Why is unintended intraoperative awareness more common during emergency intubation in the resuscitation room, and how is it reduced?",
        answer: "Awareness is more common where the induction dose is reduced for cardiovascular instability, where a relaxant means the patient cannot move or show distress, and where speed and emergency environment contribute. It is reduced by a sufficient sedative-anaesthetic dose before the relaxant, appropriate clinical monitoring, a discussion of the possibility in the consent, and use of a depth-of-anaesthesia monitor in the high-risk patient.",
        explanation: "Awareness with explicit recall is rare, but patients with awareness develop post-traumatic stress disorder; the report and a structured postoperative conversation are part of the management, not optional extras.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which is a component of the Revised Cardiac Risk Index?",
        options: [
          "Serum creatinine above 2 mg/dL",
          "A mild allergy to penicillin",
          "A previous appendicectomy",
          "A current smoker status",
        ],
        correctIndex: 0,
        explanation: "The Revised Cardiac Risk Index factors are high-risk surgery, ischaemic heart disease, heart failure, cerebrovascular disease, insulin-dependent diabetes and a serum creatinine above 2 mg/dL. Smoking, allergy and an unrelated surgical history are not scored components.",
      },
      {
        type: "mcq",
        stem: "What is the correct fasting rule for clear fluids before elective general anaesthesia?",
        options: [
          "2 hours",
          "6 hours",
          "8 hours",
          "No fasting for fluids",
        ],
        correctIndex: 0,
        explanation: "Clear fluids are permitted up to 2 hours before general anaesthesia; breast milk 4 hours, a light meal or formula milk 6 hours, and fatty or fried food 8 hours. A carbohydrate drink given 2–3 hours before surgery follows the same clear-fluid rule and reduces postoperative insulin resistance.",
      },
      {
        type: "mcq",
        stem: "A patient with a full stomach requires rapid-sequence induction. Which combination is appropriate?",
        options: [
          "Thiopental and suxamethonium",
          "Etomidate or ketamine and rocuronium 1.2 mg/kg",
          "Propofol and vecuronium 0.1 mg/kg",
          "Sevoflurane alone",
        ],
        correctIndex: 1,
        explanation: "Rapid-sequence induction uses a fast-onset cardiovascular-stable agent with either suxamethonium or 1.2 mg/kg of rocuronium; in the haemodynamically unstable or hyperkalaemia-risk patient the rocuronium-sugammadex combination is preferable. Vecuronium has too slow an onset for a rapid sequence and propofol risks hypotension.",
      },
      {
        type: "mcq",
        stem: "Which monitoring element is the earliest reliable indicator of malignant hyperthermia in an anaesthetised patient?",
        options: [
          "A rising end-tidal carbon dioxide",
          "A fall in blood pressure",
          "A change in the electrocardiographic baseline",
          "A decreasing core temperature",
        ],
        correctIndex: 0,
        explanation: "An unexplained rising end-tidal carbon dioxide with tachycardia is the earliest reliable sign of malignant hyperthermia; hyperthermia, rigidity, arrhythmia and hyperkalaemia follow later, so only continuous capnography makes early recognition possible.",
      },
      {
        type: "mcq",
        stem: "Which medication plan is correct for the morning of surgery in a patient on a beta-blocker, a statin, aspirin and an angiotensin-converting enzyme inhibitor?",
        options: [
          "Stop all four",
          "Continue the beta-blocker, statin and aspirin, and hold the angiotensin-converting enzyme inhibitor",
          "Stop the beta-blocker and statin",
          "Stop the aspirin and continue the inhibitor",
        ],
        correctIndex: 1,
        explanation: "Chronic beta-blockers, statins and aspirin for cardiac indications are continued through the perioperative period; stopping a beta-blocker abruptly risks rebound tachycardia and ischaemia and stopping a statin increases cardiac events. Angiotensin-converting enzyme inhibitors are withheld on the morning of surgery in the hypotensive-prone patient because of vasodilatation at induction.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Pre-operative evaluation is a risk-reduction conversation: functional capacity in metabolic equivalents, the ASA physical status and the Revised Cardiac Risk Index; an optimisation plan for the comorbidity (blood pressure, heart failure, asthma, diabetes, anaemia); fasting of 2 hours for clear fluids, 4 for breast milk, 6 for a light meal and 8 for fatty food; and a specific medication plan. The minimum monitoring set is electrocardiography, pulse oximetry, non-invasive blood pressure and mandatory waveform capnography, with temperature and an objective neuromuscular monitor whenever a relaxant is given, and the day is structured by the WHO checklist.",
      },
      {
        type: "paragraph",
        text: "Next: anaesthetic technique and muscle relaxants in detail, including malignant hyperthermia — the complication whose first sign is the capnography trace you have just learned to read.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 9 — Anaesthetic techniques & muscle relaxants (fully authored)
// ---------------------------------------------------------------------------
function lesson9() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the four components of general anaesthesia and the levels of sedation; contrast suxamethonium with the non-depolarising blockers in mechanism, onset, duration and hazards; state the contraindications to suxamethonium and the alternatives; recognise malignant hyperthermia and manage it, including dantrolene dosing; choose between neostigmine and sugammadex for reversal; and describe the indications and complications of regional anaesthesia.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 2 (Applied anaesthetic pharmacology) for the neuromuscular blockers and reversal, Lesson 8 (pre-operative evaluation and monitoring) for the monitoring that detects the complications, and cardiac physiology for the conduction effects of hyperkalaemia.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Components of anaesthesia",
        text: "Anaesthesia is delivered as four separable components: hypnosis (unconsciousness), analgesia (blunting of the pain response), amnesia (absence of recall) and muscle relaxation. Each is provided by its own drug and titrated to its own endpoint, which is the meaning of balanced anaesthesia.",
      },
      {
        type: "paragraph",
        text: "The clinical logic of muscle relaxation follows from the components. Paralysis provides intubating conditions and surgical access to rigid cavities; it buys nothing for hypnosis, so a paralysed patient who is awake cannot move or call out, which is why relaxants are never given without a working anaesthetic. The depolarising blocker suxamethonium gives intubating conditions in 45 seconds and wears off in 10 minutes, which no non-depolarising blocker can match; its account of hazards — hyperkalaemia in the denervated patient, raised intracranial and intraocular pressure, and malignant hyperthermia — is equally unique, and the account is what you are examined on. Finally, every block must be reversed, and the reversal agent depends on the blocker: sugammadex encapsulates rocuronium and vecuronium, neostigmine competes at the receptor, and neither reverses suxamethonium.",
      },

      { type: "heading", level: 2, text: "Technique choices" },
      {
        type: "table",
        headers: ["Technique", "What it is", "Indications", "Key points"],
        rows: [
          ["General anaesthesia", "Induction, maintenance with a volatile or intravenous agent, airway control, ventilation", "Any surgery, surgery where a regional block is impossible, and patient preference", "Gives unconsciousness and immobility, with the risks of airway instrumentation and postoperative nausea; requires full monitoring"],
          ["Regional anaesthesia (spinal, epidural, caudal, plexus and peripheral nerve blocks)", "Local anaesthetic deposited at the nerve roots or peripheral nerve, alone or combined with general anaesthesia", "Lower-limb and lower-abdominal surgery, fractured neck of femur, caesarean section, postoperative analgesia, and patients with respiratory comorbidity", "Avoids airway instrumentation and systemic opioid effects; requires anticoagulant assessment, and is contraindicated at the site of infection or with raised intracranial pressure"],
          ["Monitored anaesthesia care (sedation)", "Sedation with retained responsiveness, alone or with a local block", "Cataract surgery, endoscopy, minor procedures, and the patient in whom general anaesthesia is undesirable", "The patient must remain able to maintain their own airway and respond to commands; deep sedation is general anaesthesia with half the monitoring, so the monitor set is the same"],
          ["Combined techniques", "General plus a regional block, or a combined spinal-epidural", "Major abdominal, thoracic and orthopaedic surgery, and labour pain relief", "Regional blocks reduce opioid use and nausea, speed mobilisation and physiotherapy, and improve pain scores"],
          ["Awake fibre-optic intubation", "Intubation performed with the patient breathing spontaneously after topicalisation", "Predicted difficult intubation or mask ventilation where induction would compromise the airway", "The gold standard for predicted difficulty; requires an experienced operator, topical anaesthesia, an antisialagogue, and a clear plan for failure"],
        ],
      },

      { type: "heading", level: 2, text: "Suxamethonium" },
      {
        type: "definition",
        term: "Depolarising block (phase I)",
        text: "Suxamethonium is two acetylcholine molecules joined: it binds the nicotinic receptor, opens the channel and depolarises the membrane, which produces an initial wave of fasciculations as all muscle fibres depolarise together, followed by a period in which the receptor is refractory and further acetylcholine cannot repolarise the fibre. The block is therefore non-competitive and produces a sustained contraction before flaccid paralysis.",
      },
      {
        type: "table",
        headers: ["Property", "Detail"],
        rows: [
          ["Dose and timing", "1–1.5 mg/kg intravenously (onset 30–60 seconds) or 3–4 mg/kg intramuscularly; duration 5–10 minutes, ended by hydrolysis by plasma cholinesterase"],
          ["Indications", "Rapid-sequence induction where a fast onset and a short duration are needed: a full stomach, a potential difficult airway in which early return of muscle tone is desirable"],
          ["Fasciculations and myalgia", "Visible fasciculations precede paralysis; postoperative myalgia is common 24–72 hours later, reduced by a small pre-treatment dose of a non-depolarising blocker, an NSAID, or a non-depolarising technique"],
          ["Potassium rise", "Serum potassium rises by about 0.5 mmol/L normally — harmless in a normal patient but lethal in one with pre-existing hyperkalaemia or an up-regulated receptor population"],
          ["Intracranial and intraocular pressure", "Transiently raised (a transient rise in venous pressure and cerebral blood flow); avoid in penetrating eye injury and in raised intracranial pressure"],
          ["Bradyarrhythmia", "Stimulation of cardiac muscarinic receptors (the acetylcholine-like structure of suxamethonium), particularly with a second dose, in children, and in patients on beta-blockers"],
          ["Phase II block", "Repeated or large doses produce a block that resembles a non-depolarising block — fade with train of four, reversal with neostigmine"],
          ["Prolonged action (sux apnoea)", "Plasma cholinesterase deficiency (inherited or acquired: liver disease, pregnancy, malignancy, echothiophate, glycopyrrolate) prolongs the block; the dibucaine number distinguishes normal from atypical enzyme. Management: sedation, ventilation and wait — not an anticholinesterase"],
          ["Contraindications", "Hyperkalaemia of any cause (renal failure, burns after 24 hours to about 60 days, spinal cord injury, stroke with paresis, immobility, muscular dystrophy), malignant hyperthermia susceptibility, hypersensitivity, and a personal or family history of prolonged apnoea"],
          ["Anaphylaxis", "Anaphylaxis to suxamethonium and to rocuronium is the commonest cause of intraoperative anaphylaxis; suxamethonium accounts for a substantial share of cases even without previous exposure, so treat with adrenaline, fluids, and referral for follow-up"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Why does a denervated muscle develop extra receptors? When a neuromuscular junction is silent — after denervation, immobilisation, burns or prolonged disease — acetylcholine receptors proliferate and spread over the whole muscle membrane (up-regulation), so a depolarising agonist suddenly occupies a vastly larger population of receptors and releases a flood of potassium. That single mechanism explains every one of the suxamethonium contraindications on the list.",
      },

      { type: "heading", level: 2, text: "Non-depolarising blockers" },
      {
        type: "table",
        headers: ["Agent", "Dose and kinetics", "Clinical features"],
        rows: [
          ["Rocuronium", "0.6 mg/kg: onset 60–90 s, 30–60 min; 1.2 mg/kg: onset 45–60 s", "The fastest non-depolarising blocker; the alternative to suxamethonium for a rapid-sequence induction, reversible at any depth by sugammadex; mild vagolytic tachycardia at higher doses"],
          ["Vecuronium", "0.1 mg/kg: onset 60–90 s, 30–60 min", "Long-acting and cardiovascularly stable, but long; a common source of residual paralysis when used with short procedures"],
          ["Atracurium", "0.5 mg/kg: onset 2–3 min, 25–40 min", "Degrades by Hofmann elimination, so suits renal and hepatic failure; histamine release causes hypotension, flushing and bronchospasm at high speed"],
          ["Cisatracurium", "0.15 mg/kg: onset 2–3 min, 25–45 min", "An atracurium isomer with less histamine release and greater potency; the standard intensive-care blocker because of organ-independent elimination"],
          ["Pancuronium", "0.05–0.1 mg/kg: 2–3 min onset, very long", "Vagolytic tachycardia; rarely used now but still a cause of residual block when a long-acting drug is used for a short operation"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Residual paralysis is preventable, and preventing it requires measuring. Common contributors are a long-acting drug for a brief operation, hypomagnesaemia (magnesium antagonises acetylcholine release and potentiates the block), acidosis, hypothermia, volatile agents, aminoglycosides and other antibiotics, calcium-channel antagonists, and failure to use reversal with a check of the train-of-four ratio afterwards. It causes airway obstruction, aspiration, respiratory failure and an increased risk of postoperative pulmonary complications, and is one of the commonest avoidable anaesthetic complications.",
      },

      { type: "heading", level: 2, text: "Malignant hyperthermia" },
      {
        type: "definition",
        term: "Malignant hyperthermia",
        text: "A pharmacogenetic, life-threatening hypermetabolic crisis triggered by volatile anaesthetic agents and suxamethonium in a susceptible patient, caused by uncontrolled calcium release from the sarcoplasmic reticulum of skeletal muscle through an abnormal ryanodine receptor (RYR1). It is autosomal dominant, with an incidence of roughly 1 in 10,000 to 1 in 250,000 anaesthetics, and is 10 times more common in men and in children.",
      },
      {
        type: "table",
        headers: ["Stage", "Signs", "Interpretation"],
        rows: [
          ["Earliest", "An unexplained rise in end-tidal carbon dioxide (the only universally reliable early sign), with tachycardia and a rising minute ventilation requirement", "Hypermetabolism and carbon dioxide production rise before temperature does, so capnography is the detection tool"],
          ["Muscle", "Masseter spasm after suxamethonium (a warning in the child), generalised rigidity, and hyperthermia (rate of rise up to 1 °C every 5 minutes)", "Rigidity and fever are late; hyperthermia alone is a late sign and should never be awaited"],
          ["Metabolic", "Metabolic acidosis, hyperkalaemia, raised creatine kinase, hyperphosphataemia, myoglobinuria (dark urine), and disseminated intravascular coagulation", "Muscle breakdown and cell death, and the point at which renal failure becomes a threat"],
          ["Late", "Arrhythmia, cardiac arrest, and (rarely) compartment syndrome from muscle necrosis", "Untreated mortality is over 80%; with treatment it is under 5%"],
        ],
      },
      {
        type: "table",
        headers: ["Step", "Action", "Detail"],
        rows: [
          ["1", "Stop the trigger and get help", "Stop the volatile and suxamethonium, increase oxygen to 100% at 10 L/min or more, hyperventilate to wash out the agent, call the MH hotline and the senior anaesthetist, and abort surgery if it can be done quickly"],
          ["2", "Give dantrolene", "2.5 mg/kg intravenously, repeated every 5 minutes to a maximum of 10 mg/kg; it binds the ryanodine receptor and blocks calcium release. Reconstitute each vial in 60 mL of sterile water, use multiple people and warmed water, and continue until the heart rate, end-tidal carbon dioxide and temperature fall"],
          ["3", "Cool", "Cold intravenous crystalloid (not Hartmann's if the lactate is being monitored), ice packs to the axillae, neck and groin, gastric, peritoneal and bladder lavage, a forced-air cooler in reverse, and stop at 38 °C to avoid hypothermia"],
          ["4", "Treat hyperkalaemia and acidosis", "Calcium gluconate or chloride for myocardial stabilisation, insulin with dextrose, sodium bicarbonate for the acidosis, and ventricular arrhythmia managed with a beta-blocker-free protocol; avoid calcium-channel blockers"],
          ["5", "Protect the kidneys and monitor", "Maintain a urine output above 1 mL/kg/h with fluid and furosemide or mannitol, monitor creatine kinase, potassium, glucose, coagulation, temperature and arterial gases, and transfer to intensive care. Watch for recrudescence in the first 24–72 hours"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Susceptibility is confirmed by an in-vitro contracture test on muscle biopsy or by genetic testing, and the family needs counselling. Dantrolene is available in the UK hospitals that use volatile agents and suxamethonium, and the recovery of the susceptible patient is uneventful once the trigger has been removed and the patient cooled — a remove-trigger-and-wait strategy is the fallback where dantrolene is delayed, but dantrolene is the only specific treatment. Family members and the patient should be told, and the diagnosis recorded prominently in the notes and on a Medic Alert device.",
      },

      { type: "heading", level: 2, text: "Reversal" },
      {
        type: "table",
        headers: ["Agent", "For which blockers", "Dose and endpoint", "Drawbacks"],
        rows: [
          ["Neostigmine", "Non-depolarising only (rocuronium, vecuronium, atracurium)", "0.05 mg/kg (maximum 5 mg) with glycopyrrolate 0.01 mg/kg or atropine 0.02 mg/kg, titrated to a train-of-four ratio above 0.9", "Increases salivation, bronchial secretions, gut motility, bradycardia and the risk of bronchospasm; has a maximum effect, so a deeply blocked patient is not fully reversed; risk of residual paralysis if the block has not recovered enough"],
          ["Sugammadex", "Rocuronium and vecuronium only", "2 mg/kg with two twitches; 4 mg/kg for post-tetanic count of 1–2; 16 mg/kg for immediate reversal 3 minutes after 1.2 mg/kg rocuronium", "Rapid reversal without muscarinic side effects; cannot reverse suxamethonium or non-steroidal agents; reduces the efficacy of hormonal contraception for a week; rare recurrent paralysis from under-dosing"],
          ["Dantrolene", "Malignant hyperthermia", "2.5 mg/kg every 5 minutes to 10 mg/kg total", "The specific treatment for malignant hyperthermia; it is not a neuromuscular reversal and its own toxicity is muscle weakness prolonged when combined with calcium-channel blockers"],
        ],
      },
      {
        type: "question",
        prompt: "A 20-year-old with a partial thickness flame burn sustained 48 hours ago requires surgery. Which paralytic, and why?",
        answer: "Rocuronium rather than suxamethonium, because the burn is past the first 24 hours, the denervated area will up-regulate acetylcholine receptors, and suxamethonium would release a lethal quantity of potassium. Rocuronium's duration can also be reversed with sugammadex if the operation ends early, or if a difficult airway develops.",
        explanation: "The up-regulation begins within hours and persists for months; the period of risk from 24 hours after the burn to about 60 days is a classic examination point. Suxamethonium is safe only within the first 24 hours after a burn, and this patient is outside that window.",
      },

      { type: "heading", level: 2, text: "Worked example: masseter spasm" },
      {
        type: "paragraph",
        text: "A 6-year-old boy receives sevoflurane and suxamethonium for insertion of a grommet, and his mouth cannot be opened because the jaw is in spasm. The end-tidal carbon dioxide has risen from 4.8 to 6.2 kPa without any change in the ventilation, and the heart rate has gone from 100 to 130. This is malignant hyperthermia until proven otherwise, and the correct response is immediate: stop the volatile, switch to 100% oxygen at maximum flow and hyperventilate, call for senior and MH team help, give dantrolene 2.5 mg/kg, cool the child actively, check potassium and arterial gases, and continue monitoring in intensive care. Waiting for a temperature rise to confirm the diagnosis, or for the potassium to be reported, is the classic fatal delay — masseter spasm in a child with a rising end-tidal carbon dioxide is a positive sign, not a nuisance.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Giving suxamethonium in the burn, spinal cord injury, stroke with paresis, immobile or muscular-dystrophy patient on the principle that 'it's only sux'. The potassium release is lethal, and rocuronium with sugammadex reversal is the standard alternative.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Awaiting hyperthermia in malignant hyperthermia. Temperature is a late and often absent sign; a rising end-tidal carbon dioxide with unexplained tachycardia, rigidity or masseter spasm, in a patient on a volatile or suxamethonium, is the diagnostic trigger.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Reversing a deep block with neostigmine and extubating. Neostigmine reaches a ceiling effect; with two or fewer twitches, or a train-of-four ratio below 0.3, the block cannot be adequately reversed and the patient must be woken with ventilation support or reversed with sugammadex.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Giving a muscle relaxant without ensuring hypnosis. A paralysed, awake patient cannot move, breathe out, or tell anyone, so the relaxant is given only after a working sedative-hypnotic and analgesic, and the monitor is set up so the end-tidal agent and the neuromuscular train of four are visible.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Explain the mechanism by which burns, spinal cord injury and stroke with paresis make suxamethonium dangerous, and the mechanism by which suxamethonium causes a 'phase II block'.",
        answer: "Denervation, immobilisation and burns up-regulate and spread the nicotinic receptor across the muscle membrane, so a depolarising agonist releases a flood of potassium and can arrest the heart. A phase II block arises when repeated or large suxamethonium doses desensitise the junction and it begins to behave like a non-depolarising block (fade on train of four, reversible by neostigmine).",
        explanation: "The up-regulation mechanism explains every contraindication; the phase II mechanism explains why neostigmine after a large dose of suxamethonium sometimes works — a rare and grey clinical situation where the diagnosis needs a nerve stimulator and senior input.",
      },
      {
        type: "question",
        prompt: "Give the dantrolene dose and the cooling targets in a malignant hyperthermia crisis.",
        answer: "Dantrolen is 2.5 mg/kg intravenously, repeated every 5 minutes to a maximum of 10 mg/kg, reconstituted with sterile water (60 mL per vial) by several people, and given until the end-tidal carbon dioxide, heart rate and temperature fall. Active cooling (cold fluids, ice packs, cavity lavage, forced-air cooling) is continued but stopped at a core temperature of about 38 °C to avoid hypothermia.",
        explanation: "Dantrolene is the only specific treatment: it blocks calcium release through the ryanodine receptor. The pH and potassium are treated in parallel, with calcium to stabilise the myocardium and insulin-dextrose to lower the potassium, while avoiding calcium-channel blockers and dantrolene's own risk of muscle weakness in combination with them.",
      },
      {
        type: "question",
        prompt: "A patient received neostigmine and glycopyrrolate for reversal 20 minutes ago and now has a train-of-four ratio of 0.6 with poor respiratory effort. What is wrong and what is the fix?",
        answer: "The block was too deep for neostigmine to reverse to a train-of-fourth ratio above 0.9 (the block had probably not recovered to at least two twitches, or the dose was inadequate and a ceiling effect was reached), so the patient has residual paralysis. Support ventilation with a bag-mask and oxygen, give a further small dose of neostigmine only if at least two twitches are present, or give sugammadex if the block was rocuronium or vecuronium, and admit to a monitored recovery area until the ratio exceeds 0.9.",
        explanation: "Residual paralysis after neostigmine is one of the commonest anaesthetic complications and is entirely preventable with objective train-of-four monitoring and reversal guided by it, rather than by clinical impression.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which is a contraindication to suxamethonium?",
        options: [
          "A full stomach requiring rapid-sequence induction in a 20-year-old",
          "A 40% flame burn sustained three days ago",
          "Reversal of a partial rocuronium block",
          "A patient with a body mass index of 55 and functional residual capacity reduction",
        ],
        correctIndex: 1,
        explanation: "Burns from 24 hours to about 60 days up-regulate extra-junctional receptors, so suxamethonium releases lethal potassium and is contraindicated. It remains the standard rapid-sequence agent in a full stomach, and it can be reversed with sugammadex after a rocuronium block.",
      },
      {
        type: "mcq",
        stem: "Which is the earliest reliable sign of malignant hyperthermia?",
        options: [
          "Hyperthermia with a core temperature above 39 °C",
          "An unexplained rise in end-tidal carbon dioxide",
          "Hyperkalaemia of 6.2 mmol/L",
          "Skin mottling and cyanosis",
        ],
        correctIndex: 1,
        explanation: "The hypermetabolic crisis produces carbon dioxide before it produces heat; a rising end-tidal carbon dioxide with tachycardia and rigidity is the earliest detectable sign, and hyperthermia, hyperkalaemia and arrhythmia are later.",
      },
      {
        type: "mcq",
        stem: "What is the correct initial dose of dantrolene in malignant hyperthermia?",
        options: [
          "1 mg/kg up to a total of 2 mg/kg",
          "2.5 mg/kg repeated every 5 minutes to a total of 10 mg/kg",
          "0.5 mg/kg once only",
          "50 mg total, then stop when the temperature normalises",
        ],
        correctIndex: 1,
        explanation: "Dantrolen is 2.5 mg/kg intravenously, repeated every 5 minutes up to 10 mg/kg, continued until the end-tidal carbon dioxide, heart rate and temperature fall. Under-dosing is a common error because each 20 mg vial must be reconstituted with 60 mL of sterile water and several people are needed.",
      },
      {
        type: "mcq",
        stem: "Which statement about reversal of neuromuscular blockade is correct?",
        options: [
          "Neostigmine reverses rocuronium at any depth",
          "Sugammadex reverses rocuronium and vecuronium but not suxamethonium",
          "Sugammadex reverses all neuromuscular blockers",
          "Neostigmine reverses suxamethonium more effectively than rocuronium",
        ],
        correctIndex: 1,
        explanation: "Sugammadex encapsulates rocuronium and vecuronium specifically; it has no activity against suxamethonium (a depolarising agonist) or against non-steroidal blockers such as atracurium. Neostigmine can only non-competitively potentiate a recovering block, and its effect has a ceiling.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Anaesthesia has four components — hypnosis, analgesia, amnesia and muscle relaxation — each titrated to its own endpoint. Suxamethonium is fast and short but carries the hyperkalaemia contraindications (burns, spinal cord injury, stroke with paresis, immobility), the risk of raised intracranial and intraocular pressure and malignant hyperthermia; rocuronium at 1.2 mg/kg substitutes when suxamethonium is contraindicated and is reversible at any depth with sugammadex. Malignant hyperthermia is detected by a rising end-tidal carbon dioxide and treated by stopping the trigger, hyperventilating with 100% oxygen, dantrolene 2.5 mg/kg repeatedly to 10 mg/kg, active cooling and intensive care.",
      },
      {
        type: "paragraph",
        text: "Next and last: local anaesthesia and the core procedural skills. Local anaesthetic maximum doses and the treatment of local anaesthetic systemic toxicity are the practical content that every anaesthetist, every emergency physician and every surgeon needs at the bedside.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 10 — Local anaesthesia & core skills (fully authored)
// ---------------------------------------------------------------------------
function lesson10() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: distinguish ester from amide local anaesthetics and explain how pKa and protein binding determine onset and duration; state the maximum safe dose of lidocaine, bupivacaine, levobupivacaine, ropivacaine and prilocaine and calculate a dose for a patient's weight; recognise and treat local anaesthetic systemic toxicity, including the intralipid regimen; describe the techniques of infiltration, nerve block, Bier's block, spinal and epidural anaesthesia; and perform the core procedural skills of intravenous cannulation, bag-mask ventilation, chest compressions and lumbar puncture.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 2 (applied pharmacology) and Lesson 9 (techniques). You need the physiology of the nerve action potential, the sodium channel and pH, and the anatomy of the peripheral nerves and the lumbar spine.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Local anaesthetic systemic toxicity (LAST)",
        text: "The dose- or absorption-related toxicity of local anaesthetics, starting with central nervous system excitation (perioral tingling, tinnitus, metallic taste, agitation, seizures) and progressing to central nervous system depression and cardiovascular collapse — arrhythmia, conduction block, cardiac arrest and asystole. The risk is highest with the long-acting, highly protein-bound agents (bupivacaine) and with inadvertent intravascular injection.",
      },
      {
        type: "paragraph",
        text: "Local anaesthetics work by binding the intracellular side of the voltage-gated sodium channel and preventing depolarisation. Two chemical properties predict everything about their clinical behaviour. pKa governs onset: a drug with a low pKa has a larger fraction un-ionised at physiological pH, so it crosses the nerve membrane faster. Protein binding governs duration: a highly protein-bound drug (bupivacaine, 95%) stays bound at the receptor for longer than a lightly bound one (lidocaine 65%). And toxicity follows the same properties — the more protein-bound, the longer-acting and the more cardiotoxic. The practical consequence is a simple arithmetic that every prescriber learns at the bedside: dose = mg/kg limit multiplied by body weight, and the numbers for the common agents.",
      },

      { type: "heading", level: 2, text: "Pharmacology and maximum doses" },
      {
        type: "table",
        headers: ["Agent", "Class", "Properties", "Maximum dose", "Uses"],
        rows: [
          ["Lidocaine (lignocaine)", "Amide", "pKa 7.9, protein binding 65%, onset 2–5 min, duration 60–120 min", "3 mg/kg plain, 7 mg/kg with adrenaline (many services use 4.5–7 mg/kg with adrenaline)", "Infiltration, peripheral nerve block, intravenous regional anaesthesia, surface and mucous membrane; also the antiarrhythmic"],
          ["Bupivacaine", "Amide", "pKa 8.1, protein binding 95%, slow onset (5–10 min), duration 4–12 hours", "2 mg/kg (some services 2.5–3 mg/kg with adrenaline), typically capped at 150 mg per dose", "Spinal and epidural anaesthesia, peripheral blocks, wound infiltration; the most cardiotoxic, and a source of nuisance because it binds to myocardial sodium channels and resists resuscitation"],
          ["Levobupivacaine", "Amide (S-enantiomer)", "Pharmacologically similar to bupivacaine with less cardiac toxicity", "2–3 mg/kg", "Epidural, spinal, peripheral block — safer cardiotoxicity but not immune"],
          ["Ropivacaine", "Amide (S-enantiomer)", "pKa 8.1, protein binding 94%, less motor block (differential block useful in obstetrics)", "2–3 mg/kg (commonly 3 mg/kg in practice for infiltration), cap 200–250 mg per dose", "Epidural, peripheral block, infiltration — a more selective sensory block and less cardiotoxic than bupivacaine"],
          ["Prilocaine", "Amide", "pKa 7.9, protein binding 55%, fast onset, short duration", "6 mg/kg (9 mg/kg with adrenaline)", "Intravenous regional anaesthesia (Bier's block) and dental; the least toxic of the amides, but methaemoglobinaemia above 8 mg/kg in children"],
          ["Procaine, chloroprocaine, tetracaine, cocaine, amethocaine", "Ester", "Hydrolysed by plasma cholinesterase (metabolite para-aminobenzoic acid), so a higher allergy potential and a shorter duration", "Procaine up to 500 mg topically", "Historical and specialist use; cocaine remains a contraindicated agent in co-administered adrenaline or in cardiovascular disease due to cardiotoxicity and vasoconstriction"],
        ],
      },
      {
        type: "code",
        language: "text",
        code: "Maximum dose (mg) = dose (mg/kg) x body weight (kg)\nVolume permitted (mL) = maximum dose (mg) / concentration (mg/mL)\n\nExample: bupivacaine 0.25% = 2.5 mg/mL\nFor a 70 kg adult the cap is 2 mg/kg = 140 mg\nPermitted volume = 140 / 2.5 = 56 mL",
        output: "Example: lidocaine 1% = 10 mg/mL; plain cap 3 mg/kg\nFor a 60 kg adult the cap is 180 mg = 18 mL of 1%",
        caption: "Calculating a safe local anaesthetic dose",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Always calculate the dose in milligrams, not in millilitres. '20 mL of 1% lidocaine' is 200 mg, which is the full daily allowance for a 70 kg adult and an overdose for a 50 kg one — and the same millilitre number means a different dose at every percentage strength. Record the drug, the concentration, the volume and the total milligrams on the chart.",
      },

      { type: "heading", level: 2, text: "LAST: recognition and treatment" },
      {
        type: "table",
        headers: ["System", "Early", "Late"],
        rows: [
          ["Central nervous system", "Perioral and tongue tingling, numbness, metallic taste, tinnitus, slurred speech, agitation and light-headedness", "Tremor, seizures, then coma and central nervous system depression"],
          ["Cardiovascular", "Hypertension, tachycardia, ventricular arrhythmia", "Bradycardia, conduction block, ventricular fibrillation and cardiac arrest (often refractory to resuscitation with bupivacaine), or asystole"],
        ],
      },
      {
        type: "table",
        headers: ["Step", "Action"],
        rows: [
          ["Recognise and stop", "Stop injecting the local anaesthetic, call for help, and maintain or restore the airway. Do not be falsely reassured by the absence of cardiac symptoms — seizures precede arrest"],
          ["Seizure control", "Small doses of a benzodiazepine (midazolam 2–4 mg) or propofol; avoid large doses because of cardiovascular collapse; if the seizures continue, intubate"],
          ["Ventilation and circulation", "100% oxygen, hyperventilation (which helps correct the acidosis and thus the channel binding), and cardiopulmonary resuscitation with a prolonged duration of at least 60 minutes if arrest occurs, until lipid rescue has been effective"],
          ["Lipid emulsion 20%", "Bolus 1.5 mL/kg intravenously over 1 minute (about 100 mL in an adult), then an infusion of 0.25 mL/kg/min (up to 12 mL/kg maximum total in the first 30 minutes); repeat the bolus if cardiovascular stability is not achieved. This is Intralipid 20% or Lipofundin, taken from the emergency lipid shelf"],
          ["Arrhythmia management", "Avoid local anaesthetics as antiarrhythmics (lidocaine, procainamide); use amiodarone. Avoid calcium-channel blockers and beta-blockers. Use vasopressors (adrenaline) in small escalating doses, and treat hyperkalaemia and acidosis"],
          ["Escalation", "Continued resuscitation with cardiopulmonary bypass or extracorporeal support if lipide therapy fails; report the event, rechallenge and allergy testing later as directed"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Prevention is the whole treatment. Aspirate before every injection; inject incrementally with frequent aspiration; use the smallest effective dose, ideally with the maximum dose posted on the syringe and the rule of cumulative addition of all local anaesthetic doses in a case; an ultrasound-guided block reduces the risk of intravascular injection; and the highest-risk moment is a nerve block with a large volume of bupivacaine, so a test dose, an ultrasound image and a capable assistant are mandatory.",
      },

      { type: "heading", level: 2, text: "Techniques" },
      {
        type: "table",
        headers: ["Technique", "How it works", "Complications and cautions"],
        rows: [
          ["Local infiltration", "Local anaesthetic injected into the wound or planned incision, often with adrenaline to reduce bleeding and slow absorption", "Toxicity if the volume or concentration is miscalculated; infection at the site; and effective within minutes but short-lived"],
          ["Peripheral nerve block", "Local anaesthetic deposited around a named nerve under ultrasound guidance (with a nerve stimulator as backup), producing a dense block of the distribution", "LAST, nerve injury (usually transient), haematoma, pneumothorax in the supra-, para- and interscalene approaches, and blocks with a defined motor effect (a femoral block causes quadriceps weakness and falls risk)"],
          ["Intravenous regional anaesthesia (Bier's block)", "An exsanguinated limb isolated by a tourniquet; local anaesthetic injected into the venous system of the limb and diffuses to the peripheral nerves", "Use a dilute agent without adrenaline (not bupivacaine, because a cuff failure releases a large cardiotoxic dose), 0.5% prilocaine 3–4 mg/kg up to 40 mL; cuff must remain inflated for at least 20 minutes, the release is staged and observed, and monitored because reperfusion causes systemic toxicity and cardiovascular collapse"],
          ["Spinal (subarachnoid) anaesthesia", "Local anaesthetic injected into the cerebrospinal fluid at the L2–L3 or L3–L4 interspace, giving a dense block below the level", "Hypotension from sympathetic blockade (treated with fluid and vasopressor), post-dural puncture headache (treat with hydration, caffeine, and an epidural blood patch if persistent), urinary retention, transient neurological syndrome with lidocaine (hence 0.5% heavy bupivacaine 10–15 mg is used), and total spinal or cauda equina syndrome from an excess dose or malposition"],
          ["Epidural and caudal anaesthesia", "Local anaesthetic with or without an opioid into the epidural space through a catheter, giving segmental and prolonged block", "Dural puncture, post-dural puncture headache, hypotension, accidental subarachnoid or subdural injection, epidural haematoma and abscess (contraindicated with anticoagulation not stopped), and local anaesthetic spread resulting in an unexpected high block"],
          ["Topical and mucosal anaesthesia", "Amethocaine (EMLA), benzocaine, cocaine and lidocaine gel to skin and mucous membranes", "Affects intact skin, mucous membranes and the eye; use only on the intended surface, and be careful of methaemoglobinaemia with the ester prilocaine and benzocaine in children"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Neuraxial blocks are contraindicated with coagulopathy or anticoagulation that is not stopped and timed (epidural and spinal haematoma is catastrophic and irreversible), infection at the puncture site, uncontrolled sepsis, hypovolaemia, raised intracranial pressure, and patient refusal. Check the platelet count and clotting before a spinal, and never perform one in a patient who cannot be monitored.",
      },

      { type: "heading", level: 2, text: "Core procedural skills" },
      {
        type: "table",
        headers: ["Skill", "Key steps", "Complications"],
        rows: [
          ["Intravenous cannulation", "Apply the tourniquet, identify the vein (avoid the antecubital fossa for a working line), clean with 70% alcohol, insert a cannula bevel-up at 10–15 degrees, watch for a flashback, advance and secure, then flush and dress", "Haematoma, phlebitis, extravasation, cellulitis, air embolism, arterial puncture and nerve injury; change the cannula at 72 hours or at the first sign of infection"],
          ["Bag-mask ventilation", "Two-person technique with a head-tilt and jaw thrust; a clear mask with a 50 L/min oxygen flow and a reservoir; watch the chest, feel for resistance and auscultate for air entry", "Gastric insufflation, aspiration, inadequate seal in a bearded or edentulous patient, and inadequate ventilation in an obese or pregnant patient — use a supraglottic device if there is difficulty"],
          ["Chest compressions", "Locked elbows, shoulders over the hands, hands over the lower sternum; depth 5–6 cm, rate 100–120 per minute, full recoil, minimal interruptions", "Rib and sternal fractures, organ injury and ineffective compressions from fatigue (change the compressor every 2 minutes)"],
          ["Lumbar puncture", "Position the patient in the left lateral or sitting position with the knees drawn to the chest; identify the L3–L4 interspace at the line between the iliac crests; use an aseptic technique with a 22–25 gauge atraumatic needle; collect cerebrospinal fluid for cell count, protein, glucose, culture and xanthochromia or oligoclonal bands as indicated", "Post-dural puncture headache, back pain, infection, epidural haematoma (contraindicated with a raised intracranial pressure, a local infection, anticoagulation or a platelet count below 50), and cerebral herniation if a mass lesion is present"],
          ["ECG and defibrillation", "Apply the pads correctly, analyse, shock for shockable rhythms, and resume compressions immediately after a shock", "Self-injury if hands are left on the patient, and failed defibrillation from poor pad contact"],
        ],
      },
      {
        type: "question",
        prompt: "A 60 kg patient requires infiltration of 0.5% bupivacaine with adrenaline for an open inguinal hernia repair. What is the maximum volume permitted?",
        answer: "0.5% bupivacaine is 5 mg/mL. The limit with adrenaline is usually 2–2.5 mg/kg, so a conservative calculation is 2 mg/kg x 60 kg = 120 mg, which divided by 5 mg/mL is 24 mL. The safe practice is to inject incrementally with aspiration and to keep the total under this figure, and to add any other local anaesthetic administered (a field block, a pudendal block) to the same budget.",
        explanation: "The calculation converts the weight-based dose to a volume at the stated concentration, and the cumulative addition of all sources is the commonest point of failure, because different conventions quote different maximum doses with adrenaline and the bupivacaine cardiotoxicity leaves no margin for error.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Prescribing local anaesthetic in millilitres rather than milligrams, and forgetting that a concentration is a percentage: 1% is 10 mg/mL, 0.5% is 5 mg/mL, 0.25% is 2.5 mg/mL, and 0.1% is 1 mg/mL.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Giving bupivacaine for intravenous regional anaesthesia. A tourniquet failure or premature release discharges the entire cardiotoxic dose into the systemic circulation; only a preparation intended for the technique (prilocaine 0.5% without adrenaline) is used.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Missing the prodromal symptoms of LAST. Perioral tingling, tinnitus and a metallic taste precede seizures, and a patient who reports them during a block has already reached a toxic level — stop injecting, monitor and be ready to treat.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Performing a lumbar puncture in a patient with a compromised neurological examination, papilloedema or a focal deficit, or with a raised intracranial pressure, anticoagulation or a platelet count under 50 — all cause catastrophic herniation or spinal haematoma. Obtain imaging first.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Failing to plan anaesthesia for a block that fails or extends: a spinal planned for a hernia that extends to T4 will cause respiratory embarrassment, and a limb block in a patient who cannot tolerate the motor block (a fragile elderly patient) needs a decision in advance.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does adrenaline-containing local anaesthetic carry a higher maximum dose, and what are its risks?",
        answer: "Adrenaline constricts local vessels, reducing the systemic absorption of the local anaesthetic, so the permitted dose increases. The risks are vasoconstriction in an end-arterial territory (digits, ear, nose, penis — although modern evidence supports judicious use in fingers), tachycardia, hypertension and arrhythmia, and masking the warning signs of intravascular injection because the symptoms change; it is also never given in intravenous regional anaesthesia or with cocaine.",
        explanation: "The principle is absorption-limited toxicity, and the practical rule is that the maximum does not double, that adrenaline reduces the pain of infiltration by reducing the tissue pH, and that it must not be used near an end-artery without careful consideration.",
      },
      {
        type: "question",
        prompt: "Outline the management of a patient who, during a supraclavicular block, reports tingling around the mouth and then has a seizure.",
        answer: "Stop the injection, call for help, protect the airway, give 100% oxygen, and control the seizure with a small dose of midazolam (or propofol) while monitoring the electrocardiogram and blood pressure. If cardiovascular instability develops, give 20% lipid emulsion as a 1.5 mL/kg bolus followed by a 0.25 mL/kg/min infusion, institute advanced life support, and continue resuscitation for a prolonged period because bupivacaine toxicity is resistant and lipid rescue takes minutes to work.",
        explanation: "The central nervous system symptoms precede the cardiac ones, so the airway, seizure control and lipid rescue in sequence, with a low threshold for arrest care, is the algorithm taught by the Association of Anaesthetists LAST checklist.",
      },
      {
        type: "question",
        prompt: "What is the correct dose and duration for the cuff inflation in a Bier's block, and why is bupivacaine never used?",
        answer: "Prilocaine 0.5% at 3–4 mg/kg (a maximum of about 40 mL) is injected into the venous system of an exsanguinated limb, and the cuff is kept inflated for at least 20 minutes and then released in staged increments with monitoring. Bupivacaine is never used because a cuff failure or early release would discharge the whole cardiotoxic dose systemically, with no opportunity for titration.",
        explanation: "Intravenous regional anaesthesia is safe only if the total dose is in a preparation whose systemic release is survivable (prilocaine) and if the observations and resuscitation equipment are immediately to hand.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "What is the plain maximum dose of lidocaine in a 50 kg patient, and the equivalent volume of 1% lidocaine?",
        options: [
          "150 mg and 15 mL",
          "300 mg and 30 mL",
          "150 mg and 30 mL",
          "300 mg and 150 mL",
        ],
        correctIndex: 0,
        explanation: "The plain maximum is 3 mg/kg, so 150 mg in a 50 kg patient, and 1% lidocaine is 10 mg/mL, so 15 mL. Hospital practice commonly reduces this further, and adrenaline permits a higher limit, but 3 mg/kg is the safe default taught for calculation.",
      },
      {
        type: "mcq",
        stem: "Which statement about bupivacaine versus lidocaine is correct?",
        options: [
          "Bupivacaine has a faster onset and shorter duration than lidocaine",
          "Bupivacaine has greater protein binding, a longer duration, and greater cardiotoxicity than lidocaine",
          "Bupivacaine has a lower protein binding and is less cardiotoxic",
          "Bupivacaine and lidocaine are chemically identical in effect",
        ],
        correctIndex: 1,
        explanation: "Bupivacaine is about 95% protein bound (lidocaine about 65%), which gives its long duration and its high cardiotoxicity, as it binds tightly to myocardial sodium channels and resists defibrillation and conventional resuscitation.",
      },
      {
        type: "mcq",
        stem: "A patient having a brachial plexus block becomes agitated, reports tingling around the mouth and has a seizure, then becomes hypotensive and bradycardic. What is the next step after stopping the injection and calling for help?",
        options: [
          "A further bolus of 2% lidocaine for the seizure",
          "Intralipid 20%: 1.5 mL/kg bolus over 1 minute, then 0.25 mL/kg/min infusion",
          "Amiodarone 300 mg as a bolus",
          "Intubation without other interventions",
        ],
        correctIndex: 1,
        explanation: "Lipid emulsion is the specific treatment for local anaesthetic systemic toxicity, and it is given alongside airway support and seizure control; local anaesthetic antiarrhythmics are contraindicated, and amiodarone is used for arrhythmia only after lipid has been started.",
      },
      {
        type: "mcq",
        stem: "Which preparation and dose are appropriate for intravenous regional anaesthesia (Bier's block) in a 70 kg adult?",
        options: [
          "0.5% bupivacaine 3 mg/kg, no adrenaline",
          "0.5% prilocaine 3–4 mg/kg without adrenaline, with the cuff inflated at least 20 minutes",
          "2% lidocaine with adrenaline 1:1000",
          "0.25% bupivacaine with adrenaline, maximum 100 mL",
        ],
        correctIndex: 1,
        explanation: "Bier's block uses a dilute agent without adrenaline whose systemic release would be survivable: prilocaine 0.5% at 3–4 mg/kg, up to about 40 mL, with the tourniquet kept inflated at least 20 minutes and a staged release under observation. Bupivacaine is avoided because of cardiotoxicity.",
      },
      {
        type: "mcq",
        stem: "Which is a contraindication to lumbar puncture?",
        options: [
          "A platelet count of 180 x 10^9/L",
          "A focal neurological deficit with papilloedema",
          "A normal computed tomography brain",
          "A patient with suspected meningitis",
        ],
        correctIndex: 1,
        explanation: "Focal neurological signs with papilloedema suggest a mass lesion with raised intracranial pressure; lumbar puncture risks transtentorial herniation, so imaging (or an anaesthetic and neurosurgical discussion) comes first. A platelet count above 50, and a normal computed tomography, are not contraindications; suspected meningitis is the classic indication.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Local anaesthetics block the intracellular side of the sodium channel; pKa governs onset and protein binding governs duration. Maximum doses are calculated in milligrams per kilogram: lidocaine 3 mg/kg plain and 7 mg/kg with adrenaline, bupivacaine 2 mg/kg, ropivacaine and levobupivacaine 2–3 mg/kg, prilocaine 6 mg/kg. Local anaesthetic systemic toxicity presents with perioral tingling, tinnitus and seizures before arrhythmia and refractory cardiac arrest, and it is treated by stopping the injection, airway support, benzodiazepine for seizures, prolonged resuscitation and 20% lipid emulsion as a 1.5 mL/kg bolus then 0.25 mL/kg/min infusion. Neuraxial and regional blocks require an anticoagulant and coagulation assessment, and Bier's block uses prilocaine, not bupivacaine.",
      },
      {
        type: "paragraph",
        text: "This completes ANAES 307. The course has travelled from the physiology of oxygen delivery and shock, through the drugs of anaesthesia, resuscitation, airway management, coma, fluid and metabolic care, pain, preoperative assessment, technique and local anaesthetic safety, to the procedural skills at the bedside — a two-week rotation in which the same patient is at the centre of every lesson.",
      },
    ],
  };
}


export const ANAESTHESIOLOGY: SubjectSeed = {
  id: "mbbs-anaesthesiology",
  slug: "anaesthesiology",
  title: "Anaesthesiology",
  code: "ANAES 307",
  department: "Anaesthesiology",
  level: 300,
  credits: 2,
  semester: "second",
  description:
    "Principles of acute medicine and anaesthesia: applied physiology and pharmacology, resuscitation, airway and ventilation, fluids and metabolic management, pain, pre-operative evaluation and core skills (AIIMS semester VII, two-week rotation).",
  faculty: "clinical-medicine",
  prereqCourses: ["pharmacology-foundations", "physiology-cell-and-general"],
  modules: [
    { slug: "principles", title: "M1 — Principles of acute medicine" },
    { slug: "airway-ventilation", title: "M2 — Airway & ventilation" },
    { slug: "fluids-metabolism-pain", title: "M3 — Fluids, metabolism & pain" },
    { slug: "perioperative-techniques", title: "M4 — Perioperative care & techniques" },
  ],
  lessons: [
    { title: "Acute medicine & applied physiology", module: 1, estimatedMinutes: 35, authored: true, concept: { title: "Acute medicine and applied physiology", slug: "acute-medicine-applied-physiology", summary: "The physiological basis of acute deterioration — oxygen delivery, shock physiology and the recognition of the crashing patient.", blooms: "understand", minutes: 40, prereq: [] }, content: lesson1() as never },
    { title: "Applied anaesthetic pharmacology", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Applied anaesthetic pharmacology", slug: "applied-pharmacology-anaesthesia", summary: "Intravenous and inhalational agents, opioids, neuromuscular blockers and reversal — pharmacokinetics applied to the anaesthetised patient.", blooms: "apply", minutes: 45, prereq: ["acute-medicine-applied-physiology"] }, content: lesson2() as never },
    { title: "Resuscitation", module: 2, estimatedMinutes: 35, authored: true, concept: { title: "Resuscitation", slug: "resuscitation", summary: "Basic and advanced life support algorithms, airway-breathing-circulation sequence, defibrillation and the reversible causes of arrest.", blooms: "apply", minutes: 40, prereq: ["acute-medicine-applied-physiology"] }, content: lesson3() as never },
    { title: "Airway assessment & ventilation", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Airway assessment and ventilation", slug: "airway-assessment-ventilation", summary: "Prediction of the difficult airway, mask ventilation, supraglottic devices, tracheal intubation and mechanical ventilation modes.", blooms: "apply", minutes: 45, prereq: ["resuscitation"] }, content: lesson4() as never },
    { title: "The unconscious patient", module: 2, estimatedMinutes: 35, authored: true, concept: { title: "The unconscious patient", slug: "unconscious-patient-care", summary: "AVPU and GCS assessment, airway protection, positioning and the differential diagnosis and immediate management of coma.", blooms: "apply", minutes: 35, prereq: ["airway-assessment-ventilation"] }, content: lesson5() as never },
    { title: "Fluids, electrolytes & metabolism", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "Fluid, electrolyte and metabolic management", slug: "fluid-electrolyte-metabolic", summary: "Perioperative fluid compartments and deficits, electrolyte and acid-base correction, blood products and transfusion triggers.", blooms: "apply", minutes: 45, prereq: [] }, content: lesson6() as never },
    { title: "Pain management", module: 3, estimatedMinutes: 35, authored: true, concept: { title: "Pain management", slug: "pain-management", summary: "Assessment and the multimodal ladder — paracetamol, NSAIDs, opioids, regional blocks — and acute versus chronic pathways.", blooms: "apply", minutes: 40, prereq: ["applied-pharmacology-anaesthesia"] }, content: lesson7() as never },
    { title: "Pre-operative evaluation", module: 4, estimatedMinutes: 40, authored: true, concept: { title: "Pre-operative evaluation and monitoring", slug: "preop-evaluation-monitoring", summary: "Risk scoring, comorbidity optimisation, fasting rules, consent, and the standard monitoring used from induction to recovery.", blooms: "apply", minutes: 45, prereq: [] }, content: lesson8() as never },
    { title: "Anaesthetic techniques & muscle relaxants", module: 4, estimatedMinutes: 40, authored: true, concept: { title: "Anaesthetic techniques and muscle relaxants", slug: "techniques-muscle-relaxants", summary: "General, regional and combined techniques; depolarising and non-depolarising relaxants, sugammadex reversal and their complications.", blooms: "apply", minutes: 45, prereq: ["applied-pharmacology-anaesthesia"] }, content: lesson9() as never },
    { title: "Local anaesthesia & core skills", module: 4, estimatedMinutes: 35, authored: true, concept: { title: "Local anaesthesia and core skills", slug: "local-anaesthesia-skills", summary: "Local anaesthetic pharmacology, toxicity and maximum doses, infiltration and nerve blocks, and the logbook skills: IV access, bag-mask, CPR, lumbar puncture.", blooms: "apply", minutes: 40, prereq: ["techniques-muscle-relaxants"] }, content: lesson10() as never },
  ],
  sbas: [],
}

export async function seedAnaesthesiology(): Promise<void> {
  const counts = await seedMbbsCourse(ANAESTHESIOLOGY);
  console.log(`✓ ${ANAESTHESIOLOGY.code} ${ANAESTHESIOLOGY.title}: ${counts.modules} modules · ${counts.concepts} concepts · ${counts.lessons} lessons · ${counts.items} items`);
}

if (process.argv[1] && (process.argv[1].includes("mbbs/anaesthesiology") || process.argv[1].includes("seed-assessment-anaesthesiology"))) {
  seedAnaesthesiology()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
}
