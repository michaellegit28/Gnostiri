import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Assessment content — Forensic Medicine and Toxicology (AIIMS spine).
 *
 * 16 original SBA items creating the Forensic Medicine bank from 0 to 16,
 * tagged to the existing ConceptNodes (see prisma/seed-university.ts).
 * Spans the whole subject spread: medical jurisprudence, inquests and legal
 * procedure, death and postmortem changes, injuries and wounds, postmortem
 * examination and reporting, clinical forensic medicine, sexual offences
 * examination, forensic psychiatry, DNA/serology/stains, weapons and trace
 * evidence, ethics/consent/negligence, general toxicology, clinical
 * toxicology and poisoning, and environmental/analytical toxicology.
 *
 * Idempotent: upserts on the item slug; safe to re-run. orderIndex starts at
 * 0 because this course has no pre-existing items.
 *
 * Governance: every item ships reviewStatus "needs-human-review" — live rows
 * must never sit at "draft". needsCheck flags the numeric or distractor
 * reasoning a physician should double-check.
 *
 * Content is original, written to match the Indian medico-legal syllabus
 * (CrPC/BNS sections, IPC s.84, MCI professional conduct) at the level of the
 * MBBS exit standard; no source text is reproduced.
 */

const COURSE_SLUG = "forensic-medicine";

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
  // 1 — Medical jurisprudence (easy)
  {
    slug: "fm-medical-jurisprudence-scope",
    concept: "medical-jurisprudence",
    format: "sba",
    stem: "Which statement best describes the scope of medical jurisprudence?",
    options: [
      "The study of law as it applies to medicine, covering the duties and civil and criminal liabilities of doctors, professional conduct and the evidence role of the medical witness",
      "The criminal law dealing exclusively with the punishment of offenders treated in hospitals",
      "The clinical specialty concerned only with the treatment of injuries sustained during the commission of a crime",
      "An administrative code governing the appointment, posting and conduct of hospital consultants",
    ],
    correctAnswer: "The study of law as it applies to medicine, covering the duties and civil and criminal liabilities of doctors, professional conduct and the evidence role of the medical witness",
    explanation: "Medical jurisprudence is the interface of medicine and law: the civil and criminal liability of the doctor, the duties owed to the patient (consent, confidentiality, records), professional misconduct under the Medical Council framework, and the role of the doctor as an expert witness. Its scope is far wider than hospital administration or the treatment of assault victims, so those narrower definitions are wrong. It also includes the medico-legal aspects of death certification, injury reporting and tissue donation.",
    difficulty: "easy",
    marks: 1,
  },

  // 2 — Medical jurisprudence: privileged communication (medium)
  {
    slug: "fm-privileged-communication-limits",
    concept: "medical-jurisprudence",
    format: "sba",
    stem: "A treating doctor is asked by police to disclose clinical information obtained in a therapeutic consultation. In which circumstances may the information be lawfully disclosed?",
    options: [
      "When a court summons or judicial order compels it, or when a statutory duty applies such as reporting notifiable disease, epidemics, or suspicious injuries and deaths",
      "Whenever the investigating officer asks informally, provided the doctor records the request in the case file",
      "Whenever the senior-most doctor of the hospital authorises disclosure for administrative convenience",
      "Never, because the doctor-patient privilege is absolute and cannot be affected by any authority",
    ],
    correctAnswer: "When a court summons or judicial order compels it, or when a statutory duty applies such as reporting notifiable disease, epidemics, or suspicious injuries and deaths",
    explanation: "Privileged communication is a professional duty, not an absolute immunity, and Indian law permits disclosure when compelled by a court, when the patient sues and puts his condition in issue, when a statutory reporting duty applies (notifiable disease, epidemic, injury or death of criminal origin), and where a serious risk to an identifiable person arises. An informal police request without lawful compulsion or consent is a breach of the duty, and no hospital administrator can authorise disclosure that the law does not permit. Only the information required should be released, and the release should be documented.",
    difficulty: "medium",
    marks: 1,
  },

  // 3 — Inquests and legal procedure (medium)
  {
    slug: "fm-police-inquest-section-174",
    concept: "inquests-legal-procedure",
    format: "sba",
    stem: "A body is found outdoors in suspicious circumstances and the investigating officer proceeds to the scene with two local witnesses. Which inquest is legally required in this situation?",
    options: [
      "A police inquest by the officer in charge of the police station, held in the presence of two or more respectable witnesses, to ascertain the apparent cause of death and describe injuries, marks and any weapon or material trace",
      "A magisterial inquest conducted by a magistrate, which is mandatory for every case of suspicious death in India",
      "A coroner's inquest, which remains the standard Indian mechanism for all unnatural deaths",
      "An autopsy performed at the request of the forensic medicine department, which requires no prior inquest",
    ],
    correctAnswer: "A police inquest by the officer in charge of the police station, held in the presence of two or more respectable witnesses, to ascertain the apparent cause of death and describe injuries, marks and any weapon or material trace",
    explanation: "Section 174 CrPC (cognate provision in the BNSS) requires the officer in charge of the police station to proceed to the place where a person has died or where an injured person is found, hold an inquest before two or more respectable inhabitants, record the apparent cause of death, and describe all wounds, weapons, marks and material traces found; the body is then sent for postmortem examination. A magisterial inquest under Section 176 is reserved for defined categories such as death in police or judicial custody, death in prison, lunatic asylum or reformatory, and death of a woman within seven years of marriage or in the context of cruelty, plus other situations the State specifies. India does not use a coroner system.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // CrPC 174/176 structure, preserved in BNSS 2023 equivalents
  },

  // 4 — Death and postmortem changes (medium)
  {
    slug: "fm-algor-mortis-time-of-death",
    concept: "death-postmortem-changes",
    format: "sba",
    stem: "Which postmortem change forms the principal basis of the early estimate of time since death, and what most limits its accuracy?",
    options: [
      "Algor mortis (body cooling), applied with formulae such as the Henssge nomogram or the rule of thumb of about a 1.5 degrees Celsius fall per hour, limited by ambient temperature, air movement, clothing, body habitus and immersion",
      "Rigor mortis, because muscle stiffening follows a fixed temperature-independent timetable after death",
      "Livor mortis, because gravity-dependent blotching gives a precise clock independent of environmental conditions",
      "Adipocere, because the waxy transformation of fat begins within hours and is readable throughout decomposition",
    ],
    correctAnswer: "Algor mortis (body cooling), applied with formulae such as the Henssge nomogram or the rule of thumb of about a 1.5 degrees Celsius fall per hour, limited by ambient temperature, air movement, clothing, body habitus and immersion",
    explanation: "Cooling of the body after death follows the difference between body and environmental temperature, and the classical teaching is a fall of roughly 1.5 degrees Celsius per hour in temperate indoor conditions over the first hours, with weight-corrected nomograms used for greater accuracy. Accuracy is degraded by extreme cold or heat, draughts, immersion, obesity, a thin frame, and clothing, so algor mortis is always combined with other indicators. Rigor and livor give sequence and phase information, not a temperature-corrected clock, and adipocere is a late change requiring weeks to months.",
    difficulty: "medium",
    marks: 1,
  },

  // 5 — Death and postmortem changes (easy)
  {
    slug: "fm-late-postmortem-changes-sequence",
    concept: "death-postmortem-changes",
    format: "sba",
    stem: "A woman is found dead in a room kept at 40 degrees Celsius. Which combination of postmortem findings is most consistent with her having died about 6 hours earlier?",
    options: [
      "Rigor mortis present over the whole body with livor mortis established and blanching but not yet fixed, and a rectal temperature well below 37 degrees Celsius",
      "Complete rigor mortis with fixed non-blanching hypostasis over both sides of the body, indicating more than 24 hours",
      "Primary flaccidity with purple blotching confined to the head, suggesting death within minutes",
      "Greenish putrefaction of the abdomen with skin slippage and marbling of the veins",
    ],
    correctAnswer: "Rigor mortis present over the whole body with livor mortis established and blanching but not yet fixed, and a rectal temperature well below 37 degrees Celsius",
    explanation: "Under hot, dry conditions rigor develops fast: it starts within one to two hours, becomes established by six to twelve hours, and passes off over roughly 24 to 36 hours, so whole-body rigor at six hours is expected. Hypostasis appears within 30 minutes to two hours, becomes fixed at roughly six to eight hours when blood leaks from the vessels, and shifting of the stain after repositioning indicates hypostasis was not fixed. Greenish discolouration of the right iliac fossa, skin slippage and venous marbling are putrefactive changes that appear only after about a day or more.",
    difficulty: "easy",
    marks: 1,
  },

  // 6 — Injuries and wounds (medium)
  {
    slug: "fm-incised-wound-medicolegal-significance",
    concept: "injuries-wounds",
    format: "sba",
    stem: "A body has multiple gaping wounds with clean, regular margins, everted bleeding edges and no bridging of tissue. Which is the most likely injury, and what is its principal medicolegal significance?",
    options: [
      "Incised wounds made by a drawn sharp-edged weapon, indicating deliberate force and therefore strong evidence of intent",
      "Lacerated wounds produced by blunt impact with ragged, undermined margins",
      "Abrasions caused by graze injury against a rough surface",
      "Defence wounds, which are cut injuries limited to the ulnar borders of the forearms and hands while warding off an attack",
    ],
    correctAnswer: "Incised wounds made by a drawn sharp-edged weapon, indicating deliberate force and therefore strong evidence of intent",
    explanation: "Incised wounds are made by drawing a sharp-edged weapon across tissue: they are longer than deep, have regular margins, evert under gravity, bleed freely because vessels are cut cleanly rather than crushed, and contain no tissue bridges. Their significance is that a sharp weapon must be drawn deliberately, so they carry a strong inference of intent in contrast to lacerations from falls or blunt force. Defence wounds are a separate category produced by the same instrument while the victim raises hands or forearms in self-protection, and they support the interpretation of homicide rather than suicide.",
    difficulty: "medium",
    marks: 1,
  },

  // 7 — Postmortem examination and reporting (hard)
  {
    slug: "fm-pm-report-components",
    concept: "postmortem-report-writing",
    format: "sba",
    stem: "A medicolegal postmortem report is being prepared. Which requirement is essential to its legal value?",
    options: [
      "Full identification, an inventory of all internal and external injuries with dimensions and relation to anatomical landmarks, recorded observations kept separate from reasoned opinion, laboratory submissions, and signature with chain of custody for samples",
      "The police case number and station name alone, since the report is a record generated for the police",
      "A gross description of organs only, with histology and toxicology left as an optional addendum at the department's discretion",
      "A single summary paragraph signed by the mortuary attendant who performed the dissection",
    ],
    correctAnswer: "Full identification, an inventory of all internal and external injuries with dimensions and relation to anatomical landmarks, recorded observations kept separate from reasoned opinion, laboratory submissions, and signature with chain of custody for samples",
    explanation: "The medicolegal autopsy report must identify the body, document the chronology of postmortem changes, catalogue every injury with site, dimension and relationship to fixed landmarks, record internal and external findings including negatives, and state a reasoned cause of death with the pathologist's opinion distinguishing fact from inference. It must also record what was preserved, sealed and dispatched for histology and toxicology, signed under chain of custody, because the report may be cross-examined in court and the samples may be tested by the defence. Confusing observation with opinion, or leaving the sampling undocumented, is the commonest cause of a report failing in court.",
    difficulty: "hard",
    marks: 1,
  },

  // 8 — Clinical forensic medicine (medium)
  {
    slug: "fm-clinical-forensic-sample-consent",
    concept: "clinical-forensic-medicine",
    format: "sba",
    stem: "A restrained suspect is brought to casualty by police for a blood alcohol sample. Which approach best conforms to clinical forensic practice?",
    options: [
      "Deal with medical needs first, then take the sample only under valid consent or lawful order, using approved containers and preservative with documented sealing, labelling and chain of custody",
      "Take the sample forcibly, since police custody removes the suspect's right to refuse",
      "Refuse sampling altogether, because the presence of police excludes all forensic duties of the doctor",
      "Accept the officer's own bottle and label it with the case number alone, leaving custody recording to the police",
    ],
    correctAnswer: "Deal with medical needs first, then take the sample only under valid consent or lawful order, using approved containers and preservative with documented sealing, labelling and chain of custody",
    explanation: "Clinical forensic medicine places emergency and therapeutic care ahead of any evidentiary procedure; sampling of a living suspect is a medico-legal procedure that requires consent or a lawful order. Evidence integrity depends on the doctor's own containers and preservatives, unique labelling tied to the patient's identity and the officer's custody record, sealing and signatures at every transfer, and a covering letter recording time, site and chain of custody. Force without order, blanket refusal, or delegating custody to the police compromise both lawfulness and admissibility.",
    difficulty: "medium",
    marks: 1,
  },

  // 9 — Sexual offences examination (medium)
  {
    slug: "fm-sexual-assault-examination-standard",
    concept: "sexual-offences-examination",
    format: "sba",
    stem: "A woman who reports a recent sexual assault consents to examination. Which sequence best reflects the legally and medically appropriate approach?",
    options: [
      "Documented informed consent, privacy and a female examiner where possible, history recorded in her own words, full body and anogenital examination with photographic or diagrammatic documentation, collection and sealing of swabs, clothing and trace evidence, and care including emergency contraception, STI prophylaxis, HIV post-exposure prophylaxis, injury treatment and psychological support",
      "Genital examination and semen sampling only, since genital findings are the sole evidence of value",
      "Examination deferred until 72 hours, because samples are worthless before that interval",
      "A police-style history followed by handing the swabs to the investigating officer without laboratory documentation",
    ],
    correctAnswer: "Documented informed consent, privacy and a female examiner where possible, history recorded in her own words, full body and anogenital examination with photographic or diagrammatic documentation, collection and sealing of swabs, clothing and trace evidence, and care including emergency contraception, STI prophylaxis, HIV post-exposure prophylaxis, injury treatment and psychological support",
    explanation: "The examination of a sexual assault survivor is trauma-informed, consent-based and evidentiary: consent and a clear explanation are prerequisites, privacy and same-sex examination offered, and the history, examination findings, swabs and trace evidence preserved with chain of custody. Samples are collected as early as possible because DNA, semen and trace recovery fall with time, and a later presentation still warrants examination, counselling and testing. Absence of genital injury neither proves nor disproves the allegation, and standard care includes emergency contraception, STI prophylaxis, HIV post-exposure prophylaxis and psychological support.",
    difficulty: "medium",
    marks: 1,
  },

  // 10 — Forensic psychiatry (medium)
  {
    slug: "fm-insanity-mcnaghten-standard",
    concept: "forensic-psychiatry",
    format: "sba",
    stem: "An accused charged with murder argues he is not responsible because, at the time of the act, his mental disease made him incapable of knowing what he was doing or that it was wrong. Which legal standard is being invoked?",
    options: [
      "The M'Naghten rule, codified in India as the unsoundness-of-mind defence of Section 84 IPC: incapacity of knowing the nature of the act, or of knowing that it is wrong or contrary to law",
      "The irresistible impulse test, which asks only whether the accused could control his actions",
      "Diminished responsibility, which mitigates culpability without negating criminal liability",
      "The Durham rule, which asks only whether the offence was the product of mental disease",
    ],
    correctAnswer: "The M'Naghten rule, codified in India as the unsoundness-of-mind defence of Section 84 IPC: incapacity of knowing the nature of the act, or of knowing that it is wrong or contrary to law",
    explanation: "Section 84 IPC (cognate provision in the Bharatiya Nyaya Sanhita 2023) codifies the M'Naghten rule: nothing is an offence if the accused, by reason of unsoundness of mind, was incapable of knowing the nature of the act, or of knowing that it was either wrong or contrary to law, judged as at the time of the offence and on the presumption of sanity. Diminished responsibility reduces culpability rather than negating liability, irresistible impulse is not accepted as a standalone defence in India, and the Durham rule with its product test is an American formulation. Forensic psychiatric assessment informs this test; the court decides it.",
    difficulty: "medium",
    marks: 1,
  },

  // 11 — DNA, serology and stains (easy)
  {
    slug: "fm-semen-stain-screening",
    concept: "dna-serology-stains",
    format: "sba",
    stem: "A dried stain on clothing in a sexual assault case is suspected to be semen. Which presumptive screening test is used, and how is it followed up?",
    options: [
      "Seminal acid phosphatase test as a presumptive screen, followed by microscopy for spermatozoa and DNA typing of the stain and of a reference sample from the complainant and suspect",
      "Teichmann test, a blood-crystal test that is used to confirm the semen",
      "Precipitin test, which confirms the species origin of the stain and its identity as semen",
      "Spectroscopy for haemoglobin derivatives, which is the presumptive screen for seminal stains",
    ],
    correctAnswer: "Seminal acid phosphatase test as a presumptive screen, followed by microscopy for spermatozoa and DNA typing of the stain and of a reference sample from the complainant and suspect",
    explanation: "Seminal acid phosphatase is present in semen at very high concentration and gives a rapid colour reaction, making it the standard presumptive screen for suspected seminal stains; presumptive screening is followed by microscopic identification of sperm heads and tails and, where the donor is azoospermic, by p30 (prostate-specific antigen) immunoassay. Identity is then established by DNA profiling of the stain against reference samples from the complainant and the accused. Teichmann and Takayama are confirmatory tests for blood, and the precipitin test establishes species origin of blood stains, so none of those options identifies semen.",
    difficulty: "easy",
    marks: 1,
  },

  // 12 — Weapons and trace evidence (medium)
  {
    slug: "fm-gunshot-range-interpretation",
    concept: "weapons-examination",
    format: "sba",
    stem: "A body shows a circular entry defect with a circumferential abrasion collar, powder tattooing of the surrounding skin and burning of hair, but no soot deposited in or around the track. What does this pattern indicate?",
    options: [
      "An intermediate-range shot, close enough for powder fragments to strike the skin but far enough that soot was not deposited",
      "A contact wound, which typically leaves muzzle imprint and soot in the wound track",
      "A distant shot, in which no powder residue reaches the skin at any distance",
      "A stab wound from a pointed weapon, since stippling is absent from firearm injury",
    ],
    correctAnswer: "An intermediate-range shot, close enough for powder fragments to strike the skin but far enough that soot was not deposited",
    explanation: "Range is inferred from which gunshot residue elements reach the target: contact wounds show soot and muzzle imprint in and around the track and burning of exposed edges; near to intermediate ranges leave powder tattooing with fragments embedded under the skin; beyond that, only the simple defect with an abrasion collar remains. The distinction between soot deposition and stippling is the diagnostic one, and the distance corresponding to each finding varies with weapon, barrel length and propellant, so the reported range is expressed as a range, not a fixed number. Trace evidence from the weapon and cartridge also supports linkage.",
    difficulty: "medium",
    marks: 1,
  },

  // 13 — Ethics, consent and negligence (medium)
  {
    slug: "fm-informed-consent-material-risk",
    concept: "ethics-consent-negligence",
    format: "sba",
    stem: "A patient undergoes a procedure and suffers a nerve injury that was not disclosed in advance. Which statement best describes the required consent standard?",
    options: [
      "Consent must disclose the material risks a reasonable patient in this patient's position would attach significance to, and any risk the doctor knows matters to this particular patient, in terms the patient understands, and consent may be withdrawn at any time",
      "A signature on a theatre form taken by a trainee, listing bleeding and infection, satisfies the duty of disclosure",
      "The doctor's own clinical judgement about what disclosure would benefit the patient is a sufficient basis for consent",
      "Consent to a named operation automatically extends to any additional procedure the surgeon decides is necessary",
    ],
    correctAnswer: "Consent must disclose the material risks a reasonable patient in this patient's position would attach significance to, and any risk the doctor knows matters to this particular patient, in terms the patient understands, and consent may be withdrawn at any time",
    explanation: "Modern consent is patient-centred: the standard is disclosure of material risks, that is those a reasonable patient in that position would consider significant plus those the clinician knows this particular patient would want to hear, together with the alternatives, including no treatment, and the continuing right to withdraw. Purely paternalistic disclosure is no longer defensible, and a signature alone is evidence of consent only when it follows an adequate explanation by someone able to give that explanation. Negligence requires duty, breach of the standard of care expected of a reasonably competent practitioner, causation and damage, so a non-disclosed injury must be causally linked to the absence of warning to ground liability.",
    difficulty: "medium",
    marks: 1,
  },

  // 14 — General toxicology (hard)
  {
    slug: "fm-forensic-toxicology-interpretation",
    concept: "toxicology-general",
    format: "sba",
    stem: "A postmortem specimen returns a detectable quantity of a drug. Which statement best describes the correct forensic toxicological interpretation?",
    options: [
      "The laboratory establishes identity and quantity, but causality requires interpretation: dose, route, timing, tolerance, postmortem redistribution, synergistic agents and clinical history must be reconciled before the finding is linked to death",
      "Any detected quantity of a poison proves that it caused the death, since detection is diagnostic of poisoning",
      "Toxicology is concerned only with therapy of the poisoned living patient, so analytical findings have no bearing on a medicolegal opinion",
      "A single negative screening result excludes a chemical cause of death and no further analysis is required",
    ],
    correctAnswer: "The laboratory establishes identity and quantity, but causality requires interpretation: dose, route, timing, tolerance, postmortem redistribution, synergistic agents and clinical history must be reconciled before the finding is linked to death",
    explanation: "Forensic toxicology covers detection, identification, quantitation and interpretation of drugs, poisons, alcohol and substances of abuse in biological material, and interpretation is the step that distinguishes a competent report: drug concentrations rise or redistribute after death, therapeutic and toxic ranges overlap, and tolerance varies. Causality therefore depends on the amount, the route and timing of exposure, the co-use of agents such as alcohol or sedatives, and the clinical and scene findings. Clinical and behavioural toxicology are separate branches, and no single screen excludes a chemical cause.",
    difficulty: "hard",
    marks: 1,
  },

  // 15 — Clinical toxicology and poisoning (medium)
  {
    slug: "fm-organophosphate-management",
    concept: "clinical-toxicology-poisoning",
    format: "sba",
    stem: "A farmer arrives breathless with excessive secretions, pinpoint pupils, muscle fasciculations and bradycardia after spraying crops. Which is the correct immediate management?",
    options: [
      "Remove contaminated clothing, wash the skin, secure the airway and give oxygen, titrate atropine to drying of bronchial secretions, and add pralidoxime to reactivate acetylcholinesterase",
      "A single fixed dose of atropine alone, deferring ventilatory support until the secretions settle",
      "Pralidoxime alone, since it reverses the muscarinic syndrome once atropine is stopped",
      "Activated charcoal regardless of airway condition, with observation only thereafter",
    ],
    correctAnswer: "Remove contaminated clothing, wash the skin, secure the airway and give oxygen, titrate atropine to drying of bronchial secretions, and add pralidoxime to reactivate acetylcholinesterase",
    explanation: "Organophosphate poisoning produces a muscarinic, nicotinic and central picture, and treatment begins with decontamination and airway control because secretions cause bronchospasm and respiratory failure. Atropine is given in escalating doses titrated to the endpoint of clear, dry chest rather than to heart rate or pupils, and pralidoxime is given early to regenerate the inhibited enzyme before ageing occurs. Atropine does not reverse fasciculation or respiratory muscle weakness, pralidoxime does not dry secretions, and ventilation is frequently required in severe poisoning; gastric decontamination is only considered once the airway is protected.",
    difficulty: "medium",
    marks: 1,
  },

  // 16 — Environmental and analytical toxicology (hard)
  {
    slug: "fm-viscera-preservation-requirements",
    concept: "environmental-analytical-toxicology",
    format: "sba",
    stem: "A doctor must preserve viscera for chemical analysis in a suspected poisoning death. Which requirement is correct?",
    options: [
      "Chemically clean containers holding a weighed portion of stomach with contents, a portion of liver, one kidney, blood and urine, each sealed, labelled and signed, with a duplicate set and a chain-of-custody letter; saturated saline is the routine preservative and sodium fluoride with potassium oxalate is used when alcohol is suspected",
      "A single clotted 10 mL blood sample preserved in formalin, which is sufficient for the detection of all classes of poison",
      "Viscera preserved in 10% formaldehyde, a preservative that permits both histopathology and toxicology from one jar",
      "Only the tissues the mortuary attendant finds easy to cut at autopsy, with no requirement for sealing so long as the label is legible",
    ],
    correctAnswer: "Chemically clean containers holding a weighed portion of stomach with contents, a portion of liver, one kidney, blood and urine, each sealed, labelled and signed, with a duplicate set and a chain-of-custody letter; saturated saline is the routine preservative and sodium fluoride with potassium oxalate is used when alcohol is suspected",
    explanation: "Postmortem samples for toxicology must be preserved in clean, chemically inert containers, weighed and recorded, sealed and signed, with a duplicate set retained for defence analysis and a covering letter recording time of sampling, custody and any suspicion being tested. Saturated saline is the routine preservative for the usual organophosphorus, heavy metal and drug groups, while alcohol estimation requires sodium fluoride and potassium oxalate and excludes alcohol-containing preservatives. Formalin fixes tissue for histology but interferes with many assays, and inadequate or unsealed sampling is the classic cause of a poisoning case failing at court.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false, // saturated saline routine; NaF/K oxalate for alcohol; duplicate set retained
  },
];

async function seedAssessmentForensicMedicine() {
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
        orderIndex: i,
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
        orderIndex: i,
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

  console.log(`✓ Forensic Medicine assessment items: ${count} items (marks 1, needs-human-review)`);
}

// CLI usage: npx ts-node prisma/seed-assessment-forensic-medicine.ts
if (process.argv[1] && process.argv[1].includes("seed-assessment-forensic-medicine")) {
  seedAssessmentForensicMedicine()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}

export { seedAssessmentForensicMedicine, ITEMS as FORENSIC_MEDICINE_ITEMS };
