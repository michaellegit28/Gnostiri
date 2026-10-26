import { prisma, seedMbbsCourse, type SubjectSeed } from "./spine";
import type { LessonContent } from "@/types/lesson";

const PLACEHOLDER: LessonContent = { blocks: [] };

// ---------------------------------------------------------------------------
// LESSON 1 — Medical jurisprudence (fully authored)
// ---------------------------------------------------------------------------
function lesson1() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define medical jurisprudence and name the branches of law a doctor meets in practice; distinguish criminal, civil and professional liability, and state the different standard of proof each demands; list the medico-legal duties of a registered medical practitioner — to treat, to certify truthfully, to report specified injuries and deaths to the police, to keep records and to keep confidences; identify the certificates a doctor signs and the purpose of each; and explain the role of the doctor as an expert witness, including what an opinion may and may not say.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "None. This is the first lesson of the course and assumes no prior study of law.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Medical jurisprudence",
        text: "The study of the relationship between law and medicine: the duties, liabilities and privileges of the medical practitioner, and the use of medical knowledge in the administration of justice.",
      },
      {
        type: "paragraph",
        text: "Medicine and law look at the same facts and ask different questions. The clinician asks what is wrong with this patient and what will help; the law asks who did this, when, and with what responsibility. The doctor is the permanent bridge between the two, because every prescription, certificate, consent form and operation note is at once a clinical record and a potential legal document. Learn to write each of them as if a court will read it, because one day one might.",
      },

      { type: "heading", level: 2, text: "The branches of law a doctor meets" },
      {
        type: "table",
        headers: ["Branch", "What it governs", "Where the doctor appears"],
        rows: [
          ["Criminal law — the Bharatiya Nyaya Sanhita (BNS), 2023, which replaced the Indian Penal Code on 1 July 2024", "Offences against the body: hurt and grievous hurt, culpable homicide and murder, sexual offences, dowry death, death by negligence", "As examining doctor, postmortem surgeon, expert witness and author of the injury and postmortem reports"],
          ["Civil law — contract and tort, with the Code of Civil Procedure, 1908 governing procedure", "Claims for damages: negligence, absent consent, breach of confidentiality; compensation for injury", "As the defendant in a negligence suit, or as the expert quantifying injury and disability"],
          ["Evidence law — the Bharatiya Sakshya Adhiniyam (BSA), 2023, which replaced the Indian Evidence Act, 1872", "What is admissible, who is an expert, dying declarations, and how documents are proved", "As the keeper of the medical record, the recorder of a dying declaration and the giver of expert opinion"],
          ["Professional regulation — the National Medical Commission Act, 2019 with the professional conduct regulations", "Registration, professional misconduct and disciplinary proceedings before State Medical Councils and the NMC Ethics Board", "As the practitioner whose registration, licence and reputation are at stake"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The branches answer to different standards of proof. Criminal guilt must be proved beyond reasonable doubt; civil liability and professional misconduct need only the balance of probabilities — a preponderance of evidence. One clinical fact can therefore acquit a man in a criminal court and still support a civil award against him.",
      },

      { type: "heading", level: 2, text: "The medico-legal duties of the doctor" },
      {
        type: "paragraph",
        text: "The duties below are not optional courtesies. The first two define the practice of medicine; the rest turn clinical contact into a legally defensible record.",
      },
      {
        type: "table",
        headers: ["Duty", "Content", "The usual failure"],
        rows: [
          ["Duty to treat", "No refusal of an emergency or of a patient brought by police; no conditioning treatment on payment; no refusal on the ground of HIV or any other contagious disease", "Turning away a police case or a patient too poor to pay"],
          ["Duty of reasonable care and skill", "The care a reasonably competent practitioner in the same specialty, with the same resources, would give — the Bolam standard, applied in India through the case law on medical negligence", "Practising beyond one's competence without referral; decisions taken but not documented"],
          ["Duty to inform the police", "A statutory duty to inform the nearest police station without waiting to be asked, in cases of bullet injury, corrosive and burn injury, poisoning, grievous hurt, death and sexual violence — formerly CrPC section 39, now section 33 of the BNSS", "Discharging the patient quietly and reporting only if the police happen to enquire"],
          ["Duty of confidentiality", "Medical information belongs to the patient; disclosure only with consent, under legal compulsion, or where the public interest plainly demands it — notifiable disease, serious danger to identifiable others", "Discussing a case by name in a corridor; releasing records to employers or relatives without consent"],
          ["Duty to keep records", "Contemporaneous, legible, signed and dated notes with the time of each decision; retain clinical records for the regulatory period and medico-legal documents indefinitely", "Late, retrospective entries that read as concealment; unsigned sheets; illegible abbreviations"],
          ["Duty to give evidence", "A doctor summoned is legally bound to attend; refusal is contempt; the evidence must be truthful and must rest on the records made at the time", "Ignoring a summons; improving the opinion after the report was signed"],
        ],
      },
      {
        type: "paragraph",
        text: "The reporting duty deserves emphasis because it is the one most often missed. It is owed by every registered practitioner who examines the patient, whether the injury came from an assault, an accident or a suspected poisoning, and it is not waived because the patient asked for secrecy. The report goes to the police, not to the relatives first, and the examination itself is documented with the care of a post-mortem, because this patient is alive and may be cross-examined about it for years.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Never sign a certificate you have not personally verified by clinical examination. A certificate stating a finding the doctor did not record is professional misconduct under the NMC regulations and, if knowingly false, an offence against the administration of justice.",
      },

      { type: "heading", level: 2, text: "Certificates the doctor signs" },
      {
        type: "paragraph",
        text: "A certificate is a written opinion on the state of a person, addressed to a third party who will act on it. Each is a legal instrument, and one careless certificate costs more than a dozen good consultations earn back.",
      },
      {
        type: "table",
        headers: ["Certificate", "Given when", "Points that keep it defensible"],
        rows: [
          ["Birth certificate", "Live birth in the institution", "Time of birth, sex, weight, mother's name; a stillbirth receives a stillbirth certificate, not a birth certificate"],
          ["Death certificate (cause of death)", "Natural death of a patient under treatment, with a known cause", "Never issued for sudden, unexplained or unnatural deaths — those need police intimation, inquest and post-mortem first"],
          ["Injury certificate (medico-legal)", "Any case reported to, or examined by, the doctor with injury of legal interest", "Record consent, exact site, size, margins and age of the injury; two copies — one for the investigating officer, one for the patient; keep a copy in the record"],
          ["Fitness certificate", "Fitness to stand trial, to remain in detention, or to be discharged from hospital after injury", "Answer the specific question asked — fit, unfit, or fit with a stated restriction — and give a date for reassessment"],
          ["Drunkenness certificate", "Examination of a person alleged to be under the influence of alcohol or drugs", "Objective observations with breath or blood levels and the method used; opine on intoxication, not on driving"],
          ["Age estimation certificate", "Age in dispute before a court, for employment, or for juvenile status", "Give a range with the method used, corroborated by documentary records — radiographs alone decide nothing"],
        ],
      },
      {
        type: "paragraph",
        text: "Two rules guard every certificate. First, issue it only on your own examination, in duplicate, with a copy retained — patients lose certificates and come back years later. Second, write in plain, dated language: an opinion without a time, a method and a signature is a rumour with a letterhead.",
      },

      { type: "heading", level: 2, text: "Expert evidence" },
      {
        type: "paragraph",
        text: "A doctor gives evidence in one of two capacities. As a witness of fact he states what was done, found and recorded — the consultation, the findings, the note. As an expert he is permitted, under the evidence law, to give an opinion on matters beyond ordinary experience: the nature, age and causation of an injury, the cause of death, the compatibility of a wound with a particular weapon. The opinion is evidence, not fact, and it is tested by cross-examination like any other.",
      },
      {
        type: "paragraph",
        text: "The expert's duty is to the court, not to the party that calls or pays him. That sentence decides how the opinion is written: state the material relied on, the reasoning applied and the limits of the conclusion, so that a reader outside the profession can follow it. Where the material is insufficient, the honest answer — that the question cannot be answered on the available evidence — is always better than a guess.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "The doctor never states law or verdict. Whether a wound makes out grievous hurt, whether death is murder, and whether the accused is guilty are decisions for the court; the doctor describes findings and explains their medical significance.",
      },

      { type: "heading", level: 2, text: "Worked example: the casualty stab wound" },
      {
        type: "example",
        text: "A 24-year-old man is brought to casualty at 23:40 with a stab wound of the left upper abdomen after a street assault. The casualty medical officer obtains written consent, records pulse and blood pressure, dresses the wound, prescribes antibiotics and tetanus prophylaxis, and examines the whole body. He documents a single wound 3 cm long over the left hypochondrium with clean margins and no other injury, arranges imaging and surgical referral, and records the times of arrival and examination. Before discharge he issues an injury certificate in duplicate — one copy to the patient, one intimated to the police — stating the nature of the wound and reserving the opinion on severity for follow-up. Six weeks later, asked to say whether the injury was grievous or simple, he reviews the record and opines on the documented duration and degree of suffering.",
      },
      {
        type: "question",
        prompt: "Why is severity certified as provisional in this example and finalised later?",
        answer: "Because grievous hurt carries a legal threshold — fracture or dislocation of a bone or tooth, permanent damage, permanent disfigurement of the head or face, or hurt that endangers life or leaves the person unable to follow ordinary pursuits for a statutory period — and only the course of the injury, seen over days, establishes which side of the line it falls on.",
        explanation: "Certifying severity too early either overstates an injury that healed quickly or understates one that turned septic; a dated provisional opinion followed by a reasoned final opinion is the defensible sequence.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Treating confidentiality as absolute and withholding injury information from the police. The statutory reporting duty overrides the patient's wish for secrecy in the specified cases — a doctor who fails to inform commits an offence himself.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Writing a death certificate for a body nobody examined in life. Sudden, unexplained and unnatural deaths are medico-legal cases: record the death as brought dead, inform the police, and preserve the body and clothing for inquest and post-mortem.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Trying to help the police by volunteering an opinion on guilt or on the law. Describe findings and answer medical questions; leave legal causation to the court. Over-eager opinions are easily dismantled.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "How does medical jurisprudence differ from professional ethics, and where do they overlap?",
        answer: "Jurisprudence is the legal interface — duties, liabilities and evidence, enforceable by courts. Ethics is the profession's own standard, enforced by the State Medical Council and the NMC through disciplinary proceedings. They overlap wherever a breach of ethics is also a breach of a legal duty, such as negligent treatment or a false certificate.",
        explanation: "Keeping the two registers apart explains why a doctor can be acquitted of criminal negligence and still lose his registration on the same facts: different tribunals, different standards, different consequences.",
      },
      {
        type: "question",
        prompt: "A patient with a fractured radius asks you not to record that the injury followed an assault, because the assailant is a relative. What must you do?",
        answer: "Treat, examine fully, record the history as given, and inform the police of the injury without waiting to be asked. The duty to inform is statutory and is not waived by the patient's request.",
        explanation: "The patient controls consent for treatment, not the statutory intimation; the doctor records the history as narrated and notes who gave it.",
      },
      {
        type: "question",
        prompt: "Under what circumstances may a doctor disclose confidential information without the patient's consent?",
        answer: "Where the law compels disclosure — a court order, statutory notification of a communicable disease — or where disclosure is necessary in the public interest, for example warning an identifiable person of a serious and likely harm.",
        explanation: "Discretionary public-interest disclosure is narrow and should be recorded with the reasons at the time; routine disclosure to employers or family is not permitted.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A lawyer argues that because the criminal court acquitted a surgeon of causing death by negligence, the civil court must follow suit. Why is the argument wrong?",
        options: [
          "Because a civil court is bound by every finding of fact in a criminal judgment",
          "Because the two proceedings apply different standards of proof — beyond reasonable doubt in criminal law, and the balance of probabilities in civil law",
          "Because civil courts are not permitted to consider medical evidence",
          "Because negligence is not a civil wrong at all",
        ],
        correctIndex: 1,
        explanation: "Standards of proof differ: criminal guilt beyond reasonable doubt, civil liability on the balance of probabilities. The same clinical facts can therefore produce a criminal acquittal and a civil award.",
      },
      {
        type: "mcq",
        stem: "A casualty medical officer examines a patient with a burn covering 8 percent of the body surface. What is the correct medico-legal course?",
        options: [
          "Treat and discharge; no report is required for a small burn",
          "Treat, document, and inform the police of the burn injury without waiting to be asked",
          "Urgent surgical referral ends the doctor's duty",
          "Inform the police only if the relatives request it",
        ],
        correctIndex: 1,
        explanation: "Burn injury is one of the statutory categories that must be intimated to the police. Reporting is a duty owed by the doctor, independent of what any party asks for.",
      },
      {
        type: "mcq",
        stem: "In the witness box, the correct scope of an expert medical opinion about injuries is which of the following?",
        options: [
          "Whether the accused should be convicted",
          "The nature, site, extent and age of the injuries and the weapon or force that could have produced them",
          "Whether the patient is telling the truth about the assault",
          "The sentence the court ought to impose",
        ],
        correctIndex: 1,
        explanation: "An expert gives opinion on medical fact and causation; guilt, credibility and sentence are for the court to decide.",
      },
      {
        type: "mcq",
        stem: "A patient dies suddenly in the casualty with no attending doctor and no diagnosis. What is the correct first step?",
        options: [
          "Issue a death certificate to the relatives so that the body may be released",
          "Record the death as brought dead, preserve the body and clothing, and inform the police for inquest and post-mortem",
          "Release the body once the relatives give an undertaking to arrange cremation",
          "Perform an academic post-mortem without informing anyone",
        ],
        correctIndex: 1,
        explanation: "A sudden unexplained death is a medico-legal case: police intimation, inquest and post-mortem come before any cause-of-death certificate.",
      },
      {
        type: "mcq",
        stem: "In which proceeding can the doctor himself be the party whose registration is cancelled?",
        options: [
          "A criminal trial for negligence",
          "A civil suit for damages",
          "Professional misconduct proceedings before the State Medical Council or the NMC Ethics Board",
          "A consumer complaint before the district commission",
        ],
        correctIndex: 2,
        explanation: "Registration is cancelled in disciplinary proceedings under the National Medical Commission Act; civil and criminal fora impose compensation or punishment but do not touch registration.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Medical jurisprudence is the interface of law and medicine. The doctor works in three legal systems at once — criminal, civil and professional — each with its own standard of proof, and the duties follow from that interface: treat everyone, examine properly, record contemporaneously, report the statutory injuries to police, keep confidences within their exceptions, and appear when summoned. Certificates and opinions are legal documents, and their author describes findings rather than concluding on guilt or law.",
      },
      {
        type: "paragraph",
        text: "Next: inquests and legal procedures. You will meet the two kinds of death inquiry, the hierarchy of courts, the summons that brings the doctor to the witness box, and the dying declaration — the one piece of evidence in which a doctor's certificate of fitness decides whether a dead man's words can be heard.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 2 — Inquests & legal procedures (fully authored)
// ---------------------------------------------------------------------------
function lesson2() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define an inquest and distinguish a police inquest from a magistrate's inquiry, including the categories of death each covers; describe the hierarchy of criminal courts in India and the class of case each tries; explain what a summons obliges a doctor to do and how a medical witness is examined in court; distinguish a dying declaration from a dying deposition and state the doctor's part in each; and describe the place of the post-mortem in the investigative chain, including the board procedure and exhumation.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (Medical jurisprudence). You need the branches of law, the statutory reporting duty, and the idea that the doctor describes findings while the court decides law.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Inquest",
        text: "A statutory inquiry into the cause and circumstances of a death that was sudden, unnatural, suspicious or unexplained — an investigation that gathers facts for the law, not a trial that decides guilt.",
      },
      {
        type: "paragraph",
        text: "When a death occurs outside a hospital bed, or without a doctor watching, the law cannot simply accept the relatives' account. The inquest is its way of asking questions first: who was the deceased, when did the death occur, and was a crime committed? The doctor sits inside that machinery as the post-mortem surgeon and, where required, the forensic pathologist on a board, and the quality of the inquest determines whether the post-mortem that follows is of any use to a court.",
      },

      { type: "heading", level: 2, text: "Two kinds of inquest" },
      {
        type: "table",
        headers: ["", "Police inquest", "Magistrate's inquiry"],
        rows: [
          ["Legal basis", "Section 194 of the BNSS, 2023 (formerly section 174 of the CrPC)", "Section 196 of the BNSS, 2023 (formerly section 176 of the CrPC)"],
          ["Conducted by", "The officer in charge of a police station, with power under section 195 to summon persons with knowledge of the facts", "A Judicial or Executive Magistrate, independent of the investigating agency"],
          ["Deaths covered", "Suicide, accident and other unnatural or suspicious deaths as a general rule", "Deaths in police custody or in police firing; dowry death; the death of a woman within seven years of marriage in suspicious circumstances, on request"],
          ["Output", "An inquest report sent to the nearest Magistrate within twenty-four hours, and an FIR if the facts disclose an offence", "A record of evidence led before the Magistrate, capable of triggering prosecution"],
          ["Post-mortem", "Conducted by a registered medical practitioner at the request of the investigating officer", "Conducted by a board of doctors that includes the head of the forensic medicine department; video-recorded in custodial deaths"],
        ],
      },
      {
        type: "paragraph",
        text: "The difference is not ceremonial. A police inquest is an internal investigation by the very agency that may itself be the subject of suspicion; a magistrate's inquiry exists precisely for the cases where the police cannot be assumed neutral — custodial deaths, dowry deaths, deaths of married women in suspicious circumstances. In those cases the post-mortem is performed by a board and, in custody cases, on video, so that no later dispute about the body, the doctor or the findings has to be settled by recollection.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Zero FIR (section 173 BNSS): information about a cognizable offence may be given orally or electronically at any police station, irrespective of territorial jurisdiction, and must be registered and transferred. For the doctor this means the nearest station is always the right station — jurisdiction is the police's problem, not yours.",
      },

      { type: "heading", level: 2, text: "The courts a case can reach" },
      {
        type: "table",
        headers: ["Court", "What it does", "Cases it tries"],
        rows: [
          ["Supreme Court", "Apex court of appeal and constitutional interpretation", "Appeals from High Courts; constitutional questions"],
          ["High Court", "Original and appellate jurisdiction within the State; revision of subordinate judgments", "Serious criminal appeals and writ petitions"],
          ["Court of Session", "Presided over by a District and Sessions Judge", "Offences punishable with more than seven years, life imprisonment or death"],
          ["Chief Judicial Magistrate, Judicial Magistrate, Metropolitan Magistrate", "Subordinate criminal courts with graded sentencing powers", "Warrant cases and summons cases; remand decisions; inquest panels"],
          ["Juvenile Justice Board", "Tries a child in conflict with the law", "An accused below eighteen years at the date of the offence"],
        ],
      },
      {
        type: "paragraph",
        text: "What matters to the doctor is the trial court, because it sets the pace and pressure of the evidence he gives. A sessions trial carries counsel on both sides and months of dates; a summons case in a magistrate's court may be over in an afternoon. Either way, the medical record outlives everyone's memory of the event, which is why contemporaneous notes are the doctor's best witness.",
      },

      { type: "heading", level: 2, text: "Summons and the witness box" },
      {
        type: "paragraph",
        text: "A summons is a court order to attend, and disobedience is punishable. The medical witness's procedure is simple and often performed badly: attend on the date with the original records, identify the documents you made, restate your findings, answer medical questions, and stop there. Do not argue, do not volunteer, and do not answer questions about the law or the accused's guilt.",
      },
      {
        type: "table",
        headers: ["Stage of examination", "Who conducts it", "Form of the questions"],
        rows: [
          ["Examination-in-chief", "The party that called the witness", "Open questions; leading not permitted; elicits findings and reasoning"],
          ["Cross-examination", "The opposing party", "Leading questions permitted; tests basis, memory, bias and the limits of the opinion"],
          ["Re-examination", "The party that called the witness, after cross", "Only to clarify what cross-examination raised; new matter is not introduced"],
        ],
      },
      {
        type: "paragraph",
        text: "Cross-examination is where a careless report dies. Counsel reads your words back from the original, asks the basis of every measurement and every adjective, and confronts you with the part of the record you had forgotten. A witness who has read his own report and knows the limits of his method survives it; one who remembers better than his paper does not.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "A summons cannot be ignored, and it cannot be delegated to a junior by the doctor named in it. Only the practitioner who conducted the examination can prove it; the evidence of a substitute is evidence about a conversation, not about a patient.",
      },

      { type: "heading", level: 2, text: "Dying declarations" },
      {
        type: "definition",
        term: "Dying declaration",
        text: "A statement made by a person who is dying, as to the cause of his death or as to the circumstances of the transaction that resulted in it. It is made relevant by section 26(1) of the BSA, 2023 (formerly section 32(1) of the Evidence Act), although the maker cannot be cross-examined.",
      },
      {
        type: "table",
        headers: ["", "Dying declaration", "Dying deposition"],
        rows: [
          ["Recorded by", "A Magistrate, a doctor, a police officer or any person present — on oath is not required, and in urgent cases a doctor may record it", "A Magistrate only"],
          ["Oath", "No oath; the presumption is that a person on the point of death has no motive to lie", "On oath"],
          ["Cross-examination", "None — the declarant is dead", "Full opportunity for cross-examination before the Magistrate"],
          ["Doctor's part", "Examine and certify fitness to make a statement — consciousness, orientation and ability to speak — without certifying the truth of what is said", "If the declarant dies before the deposition is completed, what was recorded before death may be treated as a dying declaration"],
        ],
      },
      {
        type: "paragraph",
        text: "The doctor's certificate of fitness is the hinge of the whole document. A dying declaration signed by a doctor who certified the patient 'fully conscious, oriented and fit to make a statement' is a piece of evidence that rarely fails; the same statement written after the patient lapsed into coma invites the finding that it was never made at all. If the patient cannot speak, the declaration may be taken by nods and gestures recorded verbatim — and the doctor should state in the certificate exactly how the communication was made.",
      },

      { type: "heading", level: 2, text: "The post-mortem in the investigative chain" },
      {
        type: "paragraph",
        text: "The sequence is fixed: information of death to the police; inquest; requisition for post-mortem; examination; report to the investigating officer; viscera and samples to the forensic laboratory; chargesheet; trial. The doctor receives the body only under a requisition, conducts the examination in the presence of a police witness, and signs the report within a reasonable time. The body is normally returned for last rites once the examination and the required samples are complete — retention of viscera, not of the body, is what the law contemplates.",
      },
      {
        type: "paragraph",
        text: "A second post-mortem is possible on the orders of a Magistrate, and in practice requires exhumation: the grave is identified, the coffin and remains are unearthed in the presence of the Magistrate or his nominee, the police and the exhumation team, identity is established by clothing, dental or DNA comparison, and the examination proceeds with fresh samples for a laboratory of the court's choosing. Exhumation is exceptional — it is sought when the first examination is alleged to be defective, and its findings are only as good as the identity evidence that opened the grave.",
      },
      {
        type: "question",
        prompt: "Why must a post-mortem in a magistrate's inquest be conducted by a board and video-recorded in custodial deaths?",
        answer: "Because the magistrate's inquiry exists for deaths where the police cannot be assumed disinterested. A board removes individual error, and the video record lets a court verify what was actually done, instead of relying on a report that a single doctor wrote about himself.",
        explanation: "The safeguards attach to the class of death, not to the doctor's seniority; the same rules apply wherever custody or police action caused the death.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Treating an inquest as a trial. The inquest collects facts; it does not charge, convict or acquit. A doctor who writes 'homicidal death' in a police inquest report has pre-empted the court and damaged the case he meant to assist.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Beginning a post-mortem without receiving the inquest paper and the police requisition, or without verifying identity. Examination without authority and without an identified body is worthless and creates serious liability.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Certifying fitness for a dying declaration from a distance — by telephone, or on a relative's description. The certificate rests on the doctor's own contemporaneous examination, and the words 'conscious and oriented' mean what they say.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Distinguish examination-in-chief from cross-examination and explain why a medical witness fares worse under one than the other.",
        answer: "Chief examination is by the party calling the witness, in open questions, to elicit the findings and the reasoning. Cross-examination is by the opponent, in leading questions, to test the basis, the memory and the limits. A witness fares worse under cross because every assertion is converted into a question he must answer from his own record.",
        explanation: "Preparation is the difference: read the original report the night before and keep answers inside it.",
      },
      {
        type: "question",
        prompt: "What exactly does a doctor certify when a patient wishes to make a dying declaration, and what does he not certify?",
        answer: "He certifies that the patient is conscious, oriented and physically able to make the statement, by his own examination at that time. He does not certify that the contents are true, and he should not interrogate the patient about the facts.",
        explanation: "Truth is weighed by the court; the doctor's contribution is only the condition of the declarant's mind, which is why the certificate is timed and signed.",
      },
      {
        type: "question",
        prompt: "Why does a summons oblige the named doctor personally to attend court?",
        answer: "Because the court requires the testimony of the person who made the record or performed the examination; a substitute can only repeat, not prove, what the patient showed.",
        explanation: "Attendance may be inconvenient and poorly remunerated, but refusal is contempt and the record it was meant to support suffers without the author.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "An inquiry into a sudden unnatural death found near a railway line is commenced by whom, and under which provision?",
        options: [
          "The Executive Magistrate under section 194 BNSS",
          "The officer in charge of the police station under section 194 BNSS",
          "The Sessions Judge under section 196 BNSS",
          "The Superintendent of Police under section 173 BNSS",
        ],
        correctIndex: 1,
        explanation: "A police inquest under section 194 BNSS is the default for unnatural deaths; a magistrate's inquiry under section 196 is reserved for the specified sensitive categories.",
      },
      {
        type: "mcq",
        stem: "Which of these deaths requires a magistrate's inquiry rather than a police inquest?",
        options: [
          "A death in a daytime road collision between two cars",
          "The death of a person while in police custody",
          "The death of an elderly man with known coronary disease at home",
          "A death during elective surgery from a natural cause",
        ],
        correctIndex: 1,
        explanation: "Deaths in police custody and in police firing are the paradigm cases for a magistrate's inquiry under section 196 BNSS, with a board post-mortem and video recording.",
      },
      {
        type: "mcq",
        stem: "Why is a dying declaration admissible in evidence although the maker cannot be cross-examined?",
        options: [
          "Because it is recorded on oath before a magistrate in every case",
          "Because section 26(1) BSA makes a statement as to the cause of one's own death relevant, on the presumption that a dying person has no motive to fabricate",
          "Because the doctor's signature converts hearsay into direct evidence",
          "Because it dispenses with corroboration as a rule of law",
        ],
        correctIndex: 1,
        explanation: "Relevance under section 26(1) BSA rests on the circumstances of death, not on any magistrate's oath; corroboration is prudent but not a condition of admissibility.",
      },
      {
        type: "mcq",
        stem: "In a magistrate's inquest, the post-mortem examination is conducted by whom?",
        options: [
          "Any single registered medical practitioner of the hospital's choice",
          "A board of doctors that includes the head of the forensic medicine department, with video recording in custodial deaths",
          "Only a forensic pathologist practising privately",
          "The magistrate in person, assisted by the police surgeon",
        ],
        correctIndex: 1,
        explanation: "Magistrate's inquests are conducted by a board; in custodial deaths the examination is video-recorded so that the record is independently verifiable.",
      },
      {
        type: "mcq",
        stem: "A doctor is asked in cross-examination whether the accused is guilty of murder. What is the correct response?",
        options: [
          "Give an opinion on guilt, having seen the wounds",
          "State that guilt is for the court to decide, and confine the answer to the medical findings and their significance",
          "Refuse to answer any question put by the defence",
          "Answer only if the court has paid an expert fee",
        ],
        correctIndex: 1,
        explanation: "The expert answers medical questions and no more; a boundary stated politely and early is respected by the court.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "An inquest is an inquiry, not a trial: the police inquest under section 194 BNSS covers unnatural deaths as a rule, while section 196 BNSS brings a magistrate to custodial, dowry and suspicious marital deaths, with a board post-mortem and video recording. Cases travel through magistrate and sessions courts, a doctor attends on summons and answers on his records, and the dying declaration — relevant under section 26(1) BSA — is only as good as the doctor's contemporaneous certificate of fitness.",
      },
      {
        type: "paragraph",
        text: "Next: death and post-mortem changes. You will learn what death is in law, how brain-stem death is certified, and how cooling, staining and rigor turn a body into a clock — with a stated range rather than a single hour.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 3 — Death & postmortem changes (fully authored)
// ---------------------------------------------------------------------------
function lesson3() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: distinguish somatic, cellular and molecular death and name the modes by which somatic death occurs; explain how brain-stem death is certified and why it is treated as death; describe the sequence and approximate timing of cooling, lividity, rigor mortis and decomposition under ordinary Indian conditions; state the factors that accelerate or retard each change; discriminate post-mortem staining from a bruise; and use the post-mortal changes to express a defensible range for time since death.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "None for the core lesson. Lesson 2 (Inquests and legal procedures) supplies the legal context: the inquest and the requisition that produce the body you examine.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Time since death",
        text: "The interval between death and examination, estimated from the combined evidence of post-mortem changes. It is expressed as a range, never as a single hour, because every method carries its own window of reliability.",
      },
      {
        type: "paragraph",
        text: "Dead bodies change, and they change at a rate that heat, cold, moisture, clothing and the manner of death all influence. The forensic task is to read those changes as a clock that runs roughly, not exactly: cooling tells you about the first day, rigor about the first two, staining about the first twelve hours, and decomposition about the days and weeks after. No single sign proves an hour; the combination narrows the window, and the honest answer states the width of that window.",
      },

      { type: "heading", level: 2, text: "Modes of death and brain-stem death" },
      {
        type: "table",
        headers: ["Term", "Meaning", "Forensic and legal relevance"],
        rows: [
          ["Somatic death", "Cessation of the integrated function of the brain, heart and lungs — the end of the person as a whole", "The event that starts the post-mortem clock and triggers the inquest"],
          ["Cellular death", "Death of tissues and organs after the organism as a whole has died; tissues survive unequally", "Explains organ viability for donation after brain-stem death"],
          ["Molecular death", "Death of the last cells, after which no revival is conceivable", "The point beyond which resuscitation is meaningless"],
          ["Brain-stem death", "Irreversible loss of all brain-stem reflexes, with the heart kept beating by a ventilator", "Certified under the Transplantation of Human Organs and Tissues Act, 1994; treated as death for purposes of organ retrieval"],
        ],
      },
      {
        type: "paragraph",
        text: "Brain-stem death is certified by a board of registered medical practitioners that includes a neurologist or neurosurgeon. The board examines the patient twice — commonly with a minimum interval of six hours between the certifications — verifying absent brain-stem reflexes (pupillary, corneal, vestibulo-ocular, gag and cough) and performing an apnoea test that shows no respiratory effort despite a carbon-dioxide drive. The certification is recorded on the prescribed form, the next of kin are informed, and only then may organ retrieval proceed. The distinction matters medicolegally: a ventilator-maintained brain-dead patient is dead even though the chest still rises.",
      },

      { type: "heading", level: 2, text: "The early changes: cooling, lividity, rigor" },
      {
        type: "table",
        headers: ["Change", "Approximate timing (ordinary Indian conditions)", "What it is used for"],
        rows: [
          ["Body cooling (algor mortis)", "Begins within about an hour; the rectal temperature falls roughly 0.5 to 1 degree Celsius per hour under average conditions, more slowly than the classical 1.5 degrees Fahrenheit per hour in extremes", "The first 24 hours; must be corrected for ambient temperature, clothing, body mass and immersion"],
          ["Post-mortem staining (hypostasis)", "Begins within one to three hours as a mottled purple patch, becomes fixed by about six to eight hours, and is maximal around eight to twelve hours", "Confirms the body has not been moved since staining fixed; a floor or bed contact pallor is its mirror image"],
          ["Rigor mortis", "Begins within one to three hours, is well established by six to twelve hours, persists about twelve to twenty-four hours, and passes off as putrefaction begins — earlier in heat, delayed by cold", "Marks the first day or two; its absence or unusual pattern is itself a clue"],
          ["Cadaveric spasm (instantaneous rigor)", "At the moment of death, without a preceding flaccid phase", "Indicates the posture or object held at death — a weapon, weeds, a ligature — and is a sign of antemortem struggle"],
        ],
      },
      {
        type: "paragraph",
        text: "Rigor is a chemical event, not a stiffening of joints: after death the muscle cell can no longer make the ATP needed to detach myosin from actin, so the fibres lock. It appears in the jaw and face, then the neck, trunk and limbs, and passes off in the same order as enzymes digest the contractile proteins. Warmth hastens it, cold delays it, and death after violent muscular exertion or convulsions makes it appear earlier and pass more slowly than a quiet death.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Cadaveric spasm must not be dismissed as a curiosity: a hand still gripping grass or a weapon means those muscles were contracting at the instant of death, which is evidence of life at the moment of immersion or wounding — not of post-mortem dumping.",
      },

      { type: "heading", level: 2, text: "Lividity is not a bruise" },
      {
        type: "table",
        headers: ["Feature", "Post-mortem staining", "Bruise (antemortem contusion)"],
        rows: [
          ["Distribution", "Gravity-dependent, on the lowest surface; absent where the body presses on a surface", "Anywhere; commonly over bony prominences, but unrelated to the lowest surface"],
          ["Shifting", "Shifts with the position of the body until it fixes; fixed staining cannot be shifted by pressure", "Does not shift with position, at any stage"],
          ["On incision", "Blood lies in the vessels and oozes from the cut surface; it can be washed away", "Blood is extravasated into the tissues, clotted where the vessels bled, and cannot be washed away"],
          ["Colour", "Uniform purple-blue; cherry red in carbon monoxide, bright pink in cyanide, dark in asphyxia", "Variable with age; may be patterned by the striking object"],
          ["Surface", "No swelling, no abrasion of the overlying skin", "Often with swelling and sometimes with an abrasion or laceration over it"],
        ],
      },
      {
        type: "paragraph",
        text: "The incision test settles the question in seconds: a cut into stained skin that releases only vessel blood is lividity; a cut into a bruise releases clotted, extravasated blood from the tissue itself. Getting this distinction wrong at a scene contorts the entire interpretation — a body moved before staining fixed will bear staining on surfaces that never touched the ground.",
      },

      { type: "heading", level: 2, text: "The later changes: decomposition and its variants" },
      {
        type: "paragraph",
        text: "Putrefaction is bacterial digestion of the body's own tissues. It classically begins in the caecum, on the right side of the lower abdomen, where a greenish discolouration appears around eighteen to thirty-six hours after death — sooner in a hot climate, later when cold. Marbling follows within a day: blood pigments stain the vessels in a fern-like pattern through the skin. Gases then distend the abdomen and tissues, the tongue is pushed forward, blood-stained fluid is forced from the mouth and nose, and the skin blisters and peels. Hair and nails loosen because the underlying tissues dry and separate, not because they continue to grow.",
      },
      {
        type: "table",
        headers: ["Modification", "Condition required", "Result"],
        rows: [
          ["Mummification", "Dry heat, good ventilation, absence of moisture", "Rapid drying; the body shrinks and preserves, which may keep features and injuries identifiable for a long period"],
          ["Adipocere formation", "Wet, airless environments — damp graves, water, sealed spaces", "Fat saponifies into a waxy, greasy substance over weeks to months; features and injuries may survive long after ordinary decay"],
          ["Skeletonisation", "Time on the surface, or exposure to insects and scavengers", "Soft tissues lost; the bones, teeth and any healed injury remain for identification and cause of death"],
          ["Maceration", "Retention of a dead fetus in utero", "Softening, reddening and peeling of the fetus — a sign of intrauterine death, not of external violence"],
        ],
      },
      {
        type: "paragraph",
        text: "In water the changes run on a different clock. Cooling is faster than in air; the skin of the palms and soles washes into wrinkles within hours; putrefaction proceeds slower than on land, but gases accumulate and the body usually floats within a few days. Drowning itself leaves findings that must be actively looked for: fine white froth, sometimes blood-stained, at the mouth and nostrils; froth in the airways; overinflated lungs; small subpleural and subpleural-pericardial haemorrhages named after Paltauf; and water, algae or debris in the airways and stomach. None of these is obligatory, and their absence does not exclude drowning.",
      },

      { type: "heading", level: 2, text: "Corroborating the clock" },
      {
        type: "table",
        headers: ["Method", "Basis", "Reliability"],
        rows: [
          ["Rectal temperature with a nomogram", "Measured fall in core temperature, corrected for ambient conditions and body mass", "Best within the first day; unreliable after the body reaches ambient temperature"],
          ["Vitreous potassium", "Potassium leaks from the retina after death and rises roughly 0.2 millimoles per litre per hour", "Useful to about four days; increasingly scattered beyond it"],
          ["Gastric contents", "The state of digestion of the last meal", "Weak: emptying varies wildly with the meal, drugs, stress and disease; supportive only"],
          ["Eye changes", "Corneal opacity, clouding of the vitreous, and a dark band across the palpebral fissure if the lids were open", "Rough sequencing in the first day or so, easily distorted by exposure"],
          ["Forensic entomology", "The life cycle stages of flies and beetles colonising the body", "The mainstay beyond about three days, when the other clocks have stopped"],
        ],
      },
      {
        type: "question",
        prompt: "A body lying in a room at 12 degrees has a rectal temperature of 31 degrees Celsius. What does the simple convention suggest, and why must the answer be qualified?",
        answer: "The classical 1.5 degrees Fahrenheit per hour convention gives roughly seven hours (about 10.6 degrees Fahrenheit of loss). But that convention assumes average conditions: the actual estimate must use a nomogram that corrects for ambient temperature, body mass and surface contact, and it must be reported as a range of hours, not as seven o'clock exactly.",
        explanation: "The wider the window, the more honest the answer; an examiner quoted as confident to the hour is an examiner who has not thought about the number he gave.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Forensic entomology reads the insects, not the body: blowflies are usually the first colonisers, and their egg, larval and pupal stages give a minimum interval because they arrive only after death. Temperature, burial, wrapping and scavenging all bias the estimate, so the entomologist's stated range — with the collecting site and weather data — is the evidence.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Quoting a single hour for time since death. Every method carries an uncertainty of hours, and a defended answer is always a range: cooling plus staining plus rigor together, each stated with its own limits.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Reading post-mortem staining as proof of the position in which the person died. Staining shows where the body lay after death; if the body was moved before staining fixed, the staining pattern records the first position, not the place of death.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Relying on stomach contents to time death. Gastric emptying is influenced by the meal, alcohol, drugs, injury and emotion; it corroborates a window at best and cannot be the sole basis of an interval.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does cadaveric spasm carry more evidentiary weight than ordinary rigor?",
        answer: "Because it fixes the muscles at the posture of the instant of death, often preserving a weapon, a lock of hair or weeds clutched during struggle — a record of antemortem muscle activity that no post-mortem change can imitate.",
        explanation: "The classic cases are the drowned body still holding the vegetation that entangled it, and the suicide still clasping the weapon.",
      },
      {
        type: "question",
        prompt: "What does fixation of post-mortem staining establish, and what does it fail to establish?",
        answer: "It establishes a minimum interval of roughly six to eight hours and that the body has lain where found since then. It fails to establish where the person died, because a body moved before fixation bears the staining of its first resting place.",
        explanation: "Minimum intervals are the value of fixed staining; the location interpretation requires the scene and the contact pallor.",
      },
      {
        type: "question",
        prompt: "Which post-mortem change gives the cherry-red colour often quoted in carbon monoxide deaths, and when is it visible?",
        answer: "Post-mortem staining and the blood itself turn cherry red because carbon monoxide binds haemoglobin as carboxyhaemoglobin. The colour is seen in lividity and in the blood at examination, and is reflected also in a pink, unusually fresh appearance of the body.",
        explanation: "Bright pink staining with an intact scene story of a fire or a closed room is the classic pairing; cyanide gives a similar but brighter pink.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Time since death by body cooling is best expressed in which form?",
        options: [
          "A single figure obtained by dividing the temperature loss by 1.5 degrees per hour",
          "A range produced with a nomogram that accounts for ambient temperature and body mass, with an uncertainty of hours",
          "An exact figure read directly from the first rectal temperature",
          "A figure that is unaffected by immersion in water or by obesity",
        ],
        correctIndex: 1,
        explanation: "Nomogram methods are the standard; cooling slows in water differently than in air and is retarded by fat and clothing, so a bare figure misleads.",
      },
      {
        type: "mcq",
        stem: "Cherry-red post-mortem staining with bright-red blood is most suggestive of which poisoning?",
        options: ["Hydrogen sulphide", "Carbon monoxide", "Opium", "Organophosphate pesticide"],
        correctIndex: 1,
        explanation: "Carbon monoxide forms carboxyhaemoglobin, which colours the blood and the staining cherry red; hydrogen sulphide gives a greenish tint, and cyanide a bright pink.",
      },
      {
        type: "mcq",
        stem: "In which sequence does rigor mortis appear, and in which order does it pass off?",
        options: [
          "From the feet upward, passing off in reverse order",
          "From the jaw and face downward, passing off in the same order",
          "In the trunk first, passing off from the limbs first",
          "Throughout the body at once, disappearing all at once",
        ],
        correctIndex: 1,
        explanation: "Rigor begins in the small muscles of the jaw and face and spreads downwards; it then resolves in the same order as proteins are digested.",
      },
      {
        type: "mcq",
        stem: "Brain-stem death in India is certified under the Transplantation of Human Organs and Tissues Act by whom?",
        options: [
          "A single senior surgeon of the retrieving team",
          "A board of registered medical practitioners including a neurologist or neurosurgeon, examining twice with two apnoea tests and a stated interval between certifications",
          "The family and the treating doctor jointly",
          "The coroner of the district",
        ],
        correctIndex: 1,
        explanation: "The statutory board certifies irreversible brain-stem failure by clinical examination on two occasions, with apnoea testing each time, before any organ retrieval.",
      },
      {
        type: "mcq",
        stem: "A drowned body is found still clutching water weeds. Which interpretation is correct?",
        options: [
          "The weeds were placed in the hand after death by the person who disposed of the body",
          "This is cadaveric spasm, indicating that the person was alive at the moment of immersion",
          "It proves ordinary rigor that developed hours after death",
          "It is meaningless, because rigor never fixes small objects",
        ],
        correctIndex: 1,
        explanation: "Instantaneous rigor at death preserves the grasp; such a finding is classic evidence of antemortem drowning rather than disposal of a corpse.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Death is a sequence — somatic, cellular, molecular — and brain-stem death, certified by a statutory board twice with apnoea testing, is treated as death for transplantation. After death the body cools at roughly half to one degree an hour, stains by gravity and fixes by about six to eight hours, stiffens from jaw downwards for a day or so, and then putrefies from the right iliac fossa outwards. These clocks are combined into a stated range, corroborated by vitreous potassium or entomology at their extremes, and never compressed into a single hour.",
      },
      {
        type: "paragraph",
        text: "Next: injuries and wounds. You will learn to read a wound as the record of the force that made it — abrasion, contusion, laceration, incised, stab and firearm — and to separate an antemortem injury from one inflicted after death.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 4 — Injuries & wounds (fully authored)
// ---------------------------------------------------------------------------
function lesson4() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: classify mechanical injuries by the mechanism that produced them and describe the identifying features of each; distinguish an antemortem from a postmortem injury and give the evidence on which the distinction rests; describe the age of a bruise from its colour sequence and the limits of that estimate; interpret the direction, extent and manner of injury from the pattern of wounds; differentiate entry from exit firearm wounds and describe the effect of firing range; classify burns by depth, estimate extent by the rule of nines, and recognise the significance of soot inhalation and cherry-red blood; and state the categories of grievous hurt and how they differ from simple hurt.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 3 (Death and post-mortem changes). You need post-mortem staining, cooling and decomposition to decide whether a wound was inflicted before or after death.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Wound interpretation",
        text: "The reading of an injury as the physical record of a force: the mechanism leaves a signature — margins, depth, direction, pattern — that survives the person and speaks to the court.",
      },
      {
        type: "paragraph",
        text: "Every wound is a sentence written by the force that made it. A blunt force splits, tears and bridges tissue; a sharp edge cuts cleanly and always deeper than it is long; a bullet punches with soot on one side and an everted gap on the other. Read the sentence and you can usually answer what struck, from where, with what strength and how often — which is precisely what the court asks of the examining doctor.",
      },

      { type: "heading", level: 2, text: "Classification of mechanical injuries" },
      {
        type: "table",
        headers: ["Type", "Mechanism", "Distinguishing features"],
        rows: [
          ["Abrasion", "Scraping away of the epidermis by friction or pressure", "Superficial, oozes lymph not blood, heals without scar; a scratch is linear, a graze is broader, an imprint reproduces the shape of the object, a patterned abrasion may reproduce a tyre, sole or ligature"],
          ["Contusion (bruise)", "Blunt force rupturing vessels beneath intact skin", "Swelling, tenderness, colour change; deep bruises may not appear at the surface for days, and a patterned bruise reproduces the striking surface"],
          ["Laceration", "Blunt force tearing the skin", "Ragged margins, undermining of edges, tissue bridges of vessels and nerves across the gap, and often surrounding abrasion — a split, not a cut"],
          ["Incised wound", "A sharp drawn edge — longer than deep", "Clean parallel margins, no tissue bridges, wider at the entry end with a tailing tail at the exit end of the stroke; bleeds freely"],
          ["Stab (puncture) wound", "A sharp pointed instrument thrust — deeper than long", "Depth exceeds length, margins approximate to conceal size, may track through organs and leave an internal wound larger than the skin wound"],
          ["Chop wound", "A heavy sharp-edged weapon", "Combined cut and crush: clean margins with abraded, bruised edges and sometimes underlying fracture"],
        ],
      },
      {
        type: "paragraph",
        text: "Lacerations and incised wounds are the pairing that examinations test. Put simply: a laceration is made by tearing, so it has ragged edges, tissue bridges and surrounding bruising; an incised wound is made by a drawing cut, so its edges are clean and bleed. A stab wound may hide its size completely — an externally small entry with a deep track and a fatal internal haemorrhage.",
      },

      { type: "heading", level: 2, text: "Antemortem versus postmortem injury" },
      {
        type: "table",
        headers: ["Feature", "Antemortem injury", "Postmortem injury"],
        rows: [
          ["Haemorrhage", "Free bleeding into tissues, often extensive and arterial in spurting patterns", "Little or none; only passive ooze from ruptured vessels"],
          ["Clots", "Clotted blood in the wound and on the surface", "No clots, because the blood ceased to be fluid in the ordinary way"],
          ["Wound edges", "Gaping, swollen, retracting; vital reaction with reddening at the margins", "Inverted or sunken, without swelling or vital reaction"],
          ["Microscopy", "Leukocyte migration begins within hours, followed by macrophages and fibroblasts; enzyme and immunohistochemical methods narrow these windows", "No cellular infiltration; stains for vitality fail"],
          ["Healing", "Scab, granulation and scar at intervals measured in days", "None, however old the wound appears"],
        ],
      },
      {
        type: "paragraph",
        text: "The single most reliable field test is the incision test used for staining versus bruising: cut into the wound and look for clotted, extravasated blood within the tissue. A post-mortem cut produces pale ooze. The microscopic vital reaction is what laboratory confirmation rests on, and its limits — hours, not minutes — are stated honestly in any opinion offered.",
      },

      { type: "heading", level: 2, text: "Bruises and their age" },
      {
        type: "paragraph",
        text: "The colour sequence of a healing bruise follows the breakdown of haemoglobin: red to blue-black within the first hours, darkening over one to four days, then greenish-brown as biliverdin forms from about the fourth or fifth day, and yellow as bilirubin predominates in the second week. The sequence is a guide, not a calendar: depth, site, skin tone, age and treatment all disturb it. A bruise that is yellow throughout is old; one that is uniformly deep blue is not necessarily recent.",
      },
      {
        type: "table",
        headers: ["Pattern", "Mechanism and significance"],
        rows: [
          ["Tramline bruise", "Two parallel lines with an unbruised centre — struck by a rod, cane or belt, which crushed the vessels along two lines and spared the middle"],
          ["Sixpence bruise", "A circular discoid bruise from a coin edge — classically a flick of a coin"],
          ["Patterned abrasion or bruise", "Reproduces the striking surface — sole, tyre, buckle, ligature, muzzle — and can be photographed against the object for comparison"],
          ["Defence injuries", "On the ulnar border of the forearms, backs of the hands and palms of a victim raising arms against attack; their presence argues against suicide"],
          ["Self-inflicted bruising", "In accessible sites, of uniform pattern, and usually superficial; the design is to be seen by others"],
        ],
      },
      {
        type: "paragraph",
        text: "Bruises are also the injury most often missed in the living and over-read in the dead. Deep muscle bruising may show nothing at the surface for days and declare itself at autopsy as cavity haemorrhage; conversely, dependent lividity in the dead mimics a bruise until it is incised and rinsed.",
      },

      { type: "heading", level: 2, text: "Firearm wounds" },
      {
        type: "table",
        headers: ["Feature", "Entry wound", "Exit wound"],
        rows: [
          ["Size", "Smaller than the bullet — the skin is punched inwards", "Larger and irregular — the tissue bursts outward"],
          ["Margins", "Inverted, with an abraded collar of rubbed skin around the hole and often a rim of soot", "Everted, with slit-like or star-shaped configuration"],
          ["Bleeding", "Profuse in contact and close wounds", "Less, unless a large vessel is divided"],
          ["Foreign material", "Soot, powder, unburnt flakes and metal in and around the track", "None of these; sometimes bone fragment carried outward"],
          ["Shape", "Round from a distance, oval or keyhole if the bullet strikes obliquely or after yaw", "Irregular"],
        ],
      },
      {
        type: "paragraph",
        text: "Range is read from what surrounds the entry hole. A contact shot drives soot into the track and against the underlying tissue, sears the skin at the muzzle, may stamp a muzzle imprint on the skin, and produces a cherry-red stain where carbon monoxide is carried in with the gases. An intermediate or close-range shot — up to a metre or so, depending on weapon and ammunition — drives powder into the skin as tattooing that cannot be wiped away, with surrounding scorching and singed hair. Beyond that range no soot is deposited at all, and the entrance is a clean punched hole with an abraded collar. Shotgun wounds add a further variable: the pellet spread widens roughly with distance, and a wound full of wads and plastic filler tells of close range.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Direction of fire is reconstructed from the track — a bevelled hole in the skull, an angled wound in soft tissue, and the trajectory of the bullet through the body — while intermediate targets such as a door or a hand leave their own marks. The ammunition, the weapon, the range and the position of firer are laboratory and scene questions; the wound itself answers direction and distance.",
      },

      { type: "heading", level: 2, text: "Burns, scalds and other thermal injury" },
      {
        type: "table",
        headers: ["Degree", "Depth", "Appearance and course"],
        rows: [
          ["First degree", "Epidermis only", "Red, painful, dry; heals in days without scarring"],
          ["Second degree (superficial and deep partial thickness)", "Through the epidermis into the dermis", "Blistered, moist, exquisitely painful; heals with scarring if deep"],
          ["Third degree (full thickness)", "Whole skin and deeper tissue", "White, leathery or charred, insensate because the nerve endings are destroyed; heals only by contraction and grafting"],
          ["Fourth degree", "Muscle, bone or organ", "Charring with exposure of deep structures"],
        ],
      },
      {
        type: "paragraph",
        text: "Extent is estimated by the rule of nines in adults: head and neck nine percent, each upper limb nine, the front of the trunk eighteen, the back eighteen, each lower limb eighteen, and the perineum one. A burn exceeding about fifteen percent of the body surface in an adult, or ten percent in a child, risks the systemic capillary leak that causes shock within the first day, and any inhalation of hot gases or smoke threatens the airway — singed nasal hairs, soot in the mouth and a hoarse voice are the warning signs. Fluids are calculated from the surface area and weight, and the first twenty-four hours decide survival.",
      },
      {
        type: "paragraph",
        text: "In a charred body four findings point to life during the fire: soot in the airways and swallowed into the stomach, carbon monoxide in the blood as carboxyhaemoglobin above the few percent that smokers carry, froth and heat oedema in the lungs, and heat fractures and heat haematomas that must not be mistaken for antemortem injury. The pugilist attitude — arms raised and flexed as the muscles dehydrate and shorten — is a post-mortem artefact of heat, and the split-skin heat ruptures over extensor surfaces likewise. Scalds produce no singeing of hair, no soot in the airway, and a depth that matches the fluid's temperature and the time of contact rather than a flame's intensity.",
      },
      {
        type: "question",
        prompt: "A body is recovered from a burnt house with carboxyhaemoglobin of 22 percent and soot in the trachea. What does that establish?",
        answer: "That the person was breathing during the fire: inhaled smoke deposits soot in the airway and combustion gases form carboxyhaemoglobin in the blood of a living circulation. Death occurred during the fire rather than before it.",
        explanation: "The same reasoning is why a body burned after death shows neither significant carboxyhaemoglobin nor soot in the airway, however charred the surface.",
      },

      { type: "heading", level: 2, text: "Grievous hurt" },
      {
        type: "paragraph",
        text: "The law grades hurt. Simple hurt is bodily pain, disease or infirmity caused by any means; grievous hurt is a defined list of injuries that carry heavier punishment because of their permanence or danger to life, set out in section 116 of the BNS, 2023 (formerly section 320 of the Indian Penal Code). The examining doctor's contribution is factual: which listed category does this injury fall into, and what is its duration and prognosis?",
      },
      {
        type: "table",
        headers: ["Category of grievous hurt", "The medical evidence that supports it"],
        rows: [
          ["Emasculation", "Documented genital injury with examination findings"],
          ["Permanent privation of the sight of either eye", "Ophthalmic assessment with a reasoned prognosis of permanence"],
          ["Permanent privation of the hearing of either ear", "Audiological assessment with prognosis"],
          ["Privation or destruction of any member or joint", "Loss or destruction of a limb, digit or joint with documented function"],
          ["Impairment of the power of any member or joint", "Measured loss of range or strength, with follow-up over the statutory period"],
          ["Permanent disfiguration of the head or face", "Photographed, described scars in a visible area with prognosis"],
          ["Fracture or dislocation of a bone or tooth", "Radiographic confirmation with the clinical findings"],
          ["Any hurt that endangers life, or that causes severe bodily pain or inability to follow ordinary pursuits for a continuing period — now fifteen days rather than the earlier twenty", "Noted duration of suffering, treatment intensity and working capacity over the stated period"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The fifteen-day threshold replaced twenty under the BNS, 2023. It is the reason an injury certificate should record the duration of pain, confinement and inability to work day by day — the court needs the sequence, not the adjective.",
      },

      { type: "heading", level: 2, text: "Manner of injury: suicidal, homicidal, accidental" },
      {
        type: "table",
        headers: ["Pattern", "Suicidal", "Homicidal", "Accidental"],
        rows: [
          ["Sites", "Accessible parts — wrists, neck, front of chest; grouped and parallel", "Any part, including the back; scattered directions", "Compatible with the described mechanism"],
          ["Number", "Multiple similar incisions, often with tentative hesitation cuts at the start", "Any number, from many to one fatal blow", "Usually few"],
          ["Severity", "Superficial to moderate, with a few deep", "Mixed; severe and defensive injuries present", "Depends on energy involved"],
          ["Defence injuries", "Absent", "Common on forearms and hands", "Present only in the grip of the agent"],
          ["Scene", "Weapon in hand or at the side, undisturbed, locks fastened inside", "Disarranged, signs of struggle, weapon absent", "Mechanism visible — fall, crush, machinery"],
        ],
      },
      {
        type: "paragraph",
        text: "Hesitation cuts — multiple superficial, parallel, tentative incisions preceding a deeper decisive wound — are the strongest single sign of self-infliction, because a person who does not wish to die tests the pain first. Their absence in a wrist death does not prove homicide; their presence with no other explanation does much to prevent a wrongful homicide finding. A weapon absent from the scene with wounds in the back is nearly always homicidal, and the reverse — a domestic fall into glass with cuts on the forearms — explains the pattern that photographs of the scene settle.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Calling a laceration an incised wound because the edges look neat. If the wound is longer than deep, has tissue bridges, ragged margins and a surrounding abrasion, it is a laceration made by blunt force — and blunt force makes a different case.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Reading every cherry-red body as carbon monoxide and every pale burn as post-mortem. Confirm with carboxyhaemoglobin measurement and airway soot, and treat the pugilist attitude and heat ruptures as artefacts of the fire.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Grading a bruise to the day by its colour before the follow-up record exists. Colour is a rough guide; write the observed colours, the photographs and the interval, and let the court draw the inference.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "State the four features that distinguish an entry wound from an exit wound in a firearm injury.",
        answer: "An entry wound is smaller than the bullet, with inverted margins, an abraded collar of rubbed skin and often a rim of soot and powder; an exit wound is larger and irregular, with everted margins, slit-like or star-like shape, and no soot or tattooing.",
        explanation: "The keyhole and bevelled patterns in bone and the trajectory of the track supplement the external picture.",
      },
      {
        type: "question",
        prompt: "Which findings in a charred body prove that the person was alive during the fire?",
        answer: "Soot deposited in the trachea and bronchi, soot swallowed into the stomach, and carboxyhaemoglobin in the blood above smoker levels — all of which require a living airway and circulation.",
        explanation: "Burns inflicted on a dead body produce none of these, however extensive the charring.",
      },
      {
        type: "question",
        prompt: "Why do hesitation cuts support a finding of suicide, and what is the counter-argument a court will hear?",
        answer: "They are multiple superficial parallel cuts preceding a deeper one, made while the person tests the act — a sequence rarely staged by an offender. The counter-argument is that deliberate staging is possible and that hesitation cuts are absent in many genuine suicides; the whole scene therefore has to be read together.",
        explanation: "Rarely does one feature decide manner; consistency of site, weapon, scene and absence of defence injuries is what persuades.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A wound on the back of the head has ragged margins, tissue bridges across its floor and a surrounding abrasion. Which interpretation is correct?",
        options: [
          "An incised wound from a sharp-edged weapon",
          "A laceration from blunt force",
          "A stab wound from a pointed instrument",
          "A firearm exit wound",
        ],
        correctIndex: 1,
        explanation: "Ragged margins, tissue bridges and a marginal abrasion are the signature of tearing by blunt force — a laceration, not a cut.",
      },
      {
        type: "mcq",
        stem: "A bruise is yellow and brown at seven days. Which statement is correct?",
        options: [
          "The colour proves the bruise was inflicted in the last twenty-four hours",
          "The colour sequence is consistent with about a week of healing, though depth, site and skin tone affect it",
          "A bruise cannot be more than forty-eight hours old if any colour remains",
          "Colour is irrelevant to the age of a bruise",
        ],
        correctIndex: 1,
        explanation: "Biliverdin and bilirubin give the greenish then yellow tints over roughly four to ten days; the sequence is supportive, not calendar-accurate.",
      },
      {
        type: "mcq",
        stem: "A bullet wound shows soot in the track, a muzzle imprint and a cherry-red rim. What is the true statement?",
        options: [
          "The wound was fired from more than two metres away",
          "The wound was fired in contact with, or very close to, the skin",
          "The hole must be an exit wound",
          "The findings are characteristic of a shotgun",
        ],
        correctIndex: 1,
        explanation: "Soot driven into the track, a muzzle imprint and carbon monoxide staining all require the muzzle to be at or near the skin.",
      },
      {
        type: "mcq",
        stem: "Which finding distinguishes a burn inflicted before death from one after?",
        options: [
          "The pugilist attitude of the limbs",
          "Soot in the trachea and carboxyhaemoglobin above smoker levels",
          "Heat ruptures of the skin over extensor surfaces",
          "Charring of the scalp and singed hair",
        ],
        correctIndex: 1,
        explanation: "Soot in the airway and carboxyhaemoglobin require a living circulation; the other findings are thermal artefacts.",
      },
      {
        type: "mcq",
        stem: "Under the Bharatiya Nyaya Sanhita, which of these makes a hurt grievous?",
        options: [
          "Any pain lasting one day after a fall",
          "Fracture of a bone, permanent disfigurement of the face, or hurt causing inability to follow ordinary pursuits for fifteen days",
          "Any injury requiring a dressing in casualty",
          "Every injury caused by a weapon, irrespective of the outcome",
        ],
        correctIndex: 1,
        explanation: "Section 116 BNS lists the categories; the twenty-day disability threshold of the old law is now fifteen days.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "A wound is the record of its mechanism: abrasions scrape, contusions rupture vessels, lacerations tear with ragged edges and tissue bridges, incisions cut cleanly and longer than deep, stabs go deeper than long, and firearm wounds punch an inverted, soot-marked entry larger than the everted exit. Antemortem injuries bleed, clot and heal; post-mortem ones do not. Burns are graded by depth and counted by the rule of nines, with soot in the airway and carboxyhaemoglobin proving life during the fire, and grievous hurt is a legal list in section 116 BNS that the doctor populates with findings.",
      },
      {
        type: "paragraph",
        text: "Next: the post-mortem examination and its report. You will meet the requisition, the external and internal examination, the viscera that go to the laboratory in poisoning cases, and the structure of a report that survives cross-examination.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 5 — Postmortem examination & reports (fully authored)
// ---------------------------------------------------------------------------
function lesson5() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: state the objectives and the types of post-mortem examination; describe the requisition, the inquest context and the authority under which a medico-legal post-mortem is performed; outline the external examination and the standard incisions and organ removal used internally; list the viscera, the preservatives and the sealing procedure applied in suspected poisoning; describe the components of a complete post-mortem report; and write an opinion on cause of death that distinguishes finding, inference and limitation.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 3 and 4. You need post-mortem changes to estimate time since death and the interpretation of wounds to describe injuries.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Medico-legal post-mortem examination",
        text: "A systematic examination of a dead body, performed under statutory authority, to establish the identity of the deceased, the time and manner of death, the cause of death, and the presence, nature and age of any injury — and to recover evidence for the investigating officer.",
      },
      {
        type: "paragraph",
        text: "The post-mortem is the only examination in medicine whose patient can never complain, correct you or return for follow-up — and the only one whose report will be read by adversaries. That asymmetry is the discipline: examine everything, describe what is found, and separate description from opinion so that a reader who was not present can retrace every step you took.",
      },

      { type: "heading", level: 2, text: "Objectives and types" },
      {
        type: "table",
        headers: ["Objective", "How the examination delivers it"],
        rows: [
          ["Identify the deceased", "Height, weight, sex, age, hair, dental state, scars, birthmarks, tattoos, deformities, personal effects, clothing and fingerprints"],
          ["Time since death", "The sequence of cooling, lividity, rigor and decomposition, corroborated by vitreous chemistry or entomology"],
          ["Cause of death", "The pathological findings — haemorrhage, infarction, infection, poisoning — demonstrated at dissection and confirmed by histology or toxicology"],
          ["Manner of death", "Whether natural, accidental, suicidal or homicidal, from the evidentiary combination of injury pattern, scene and history"],
          ["Nature and age of injuries", "Antemortem versus post-mortem distinction, weapon inference from morphology, and the estimated interval from vital reaction"],
          ["Recovery of evidence", "Bullets, pellets, wads, fragments, hair, fibres, objects in the airway and stomach, and viscera for the laboratory"],
        ],
      },
      {
        type: "table",
        headers: ["Type of examination", "Authority and setting"],
        rows: [
          ["Medico-legal (inquest) post-mortem", "Ordered by police or magistrate in an inquest; conducted by a registered medical practitioner — a board headed by the forensic medicine department in a magistrate's inquiry"],
          ["Clinical or pathological post-mortem", "On a hospital death with consent, to establish the extent of disease or the effect of treatment"],
          ["Academic post-mortem", "For teaching and research on a donated or unclaimed body, never to answer a legal question"],
          ["Second post-mortem", "On a magistrate's order, usually by exhumation, when the first examination is alleged to be defective"],
        ],
      },

      { type: "heading", level: 2, text: "The legal frame" },
      {
        type: "paragraph",
        text: "The body reaches the table through a requisition. In a police inquest the investigating officer sends the body with the inquest papers and, in practice, a police witness remains present until identification is established; in a magistrate's inquiry the board attends under the magistrate's order. The examination should be conducted without avoidable delay — in practice within twenty-four hours where the death is recent — and always in daylight-quality lighting, on a proper table, with a scribe, photographs and a police witness. Consent is not required for a medico-legal post-mortem: the dead body is in the lawful custody of the state for this purpose.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Never begin without the inquest paper, without verified identification, and without recording who identified the body. An unidentifiable body examined as the wrong person produces a report that is worse than useless — it is wrong.",
      },

      { type: "heading", level: 2, text: "The examination itself" },
      {
        type: "paragraph",
        text: "The external examination comes first and is often the decisive part. Record clothing as received, item by item, with position, orientation and any defects; then the body itself: sex, apparent age, height, weight, nutrition, hair colour and length, dental condition, eyes, scars, marks of injection, deformities and signs of tattooing. Every injury is described by its site (measured from anatomical landmarks), dimensions, shape, direction, margins, colour, and its relation to clothing and to other injuries. Photograph each injury with a scale.",
      },
      {
        type: "paragraph",
        text: "Internally, the trunk and skull are opened systematically. The standard abdominal incision runs from the xiphisternum to the pubis with a curve to one side of the umbilicus; the thoracic cage is opened and the abdomen, thorax and neck organs are removed — organ by organ in the Virchow technique, or in one mass in the en-bloc technique — and examined and weighed. The skull is opened by an incision across the vertex from behind one ear to the other, the scalp reflected, the skull sawed and the brain removed after the dura is opened; the spinal cord is examined when injury to the back or neck is suspected. Specimens for histology are taken from every organ, and the chambers of the heart and the great vessels are inspected for thrombi.",
      },
      {
        type: "question",
        prompt: "Why is the external examination performed before any incision is made?",
        answer: "Because the outside of the body carries the pattern evidence — clothing defects, patterned injuries, trace material, ligature marks and injection sites — and any of it can be destroyed by handling, washing or hasty dissection.",
        explanation: "Trace evidence such as hair, fibres and gunshot residue is collected and sealed before the body is moved for dissection.",
      },

      { type: "heading", level: 2, text: "Suspected poisoning: the viscera" },
      {
        type: "table",
        headers: ["Sample", "Preservative", "Reason"],
        rows: [
          ["Stomach and its contents, tied at both ends", "Saturated saline — or sent unaltered in a clean wide-mouth bottle where the poison is suspected to be volatile", "The most informative single sample for an ingested poison"],
          ["About 30 cm of upper small intestine with contents", "Saturated saline", "Detects poisons that have left the stomach"],
          ["Half the liver", "Saturated saline or rectified spirit according to the laboratory's protocol", "Metabolises and stores many poisons; useful when blood is unavailable"],
          ["One half of a kidney", "Saturated saline or rectified spirit per protocol", "Excretory organ; useful for heavy metals"],
          ["Spleen and a sample of blood", "Saturated saline; blood in a container with sodium fluoride and potassium oxalate", "Confirmation and quantification"],
          ["Urine and hair", "Urine plain; hair as a lock with roots", "Screening for drugs and metals; hair gives a timeline"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Where volatile poisons — alcohol, chloroform, kerosene — are suspected, rectified spirit is not used, because it is indistinguishable from the poison in analysis. Follow the forensic laboratory's protocol for the case, and always seal, label and sign every container at the table.",
      },
      {
        type: "paragraph",
        text: "Chain of custody is what converts a sample into evidence. Each jar is labelled with the post-mortem number, the name of the deceased, the organ, the date, the preservative and the doctor's signature; the seals are described in the report and cross-signed; a list accompanies the police officer who carries them to the laboratory; and the laboratory's receipt is filed with the case. A broken seal, an unsigned jar or a gap in the register is what a defence counsel looks for first.",
      },

      { type: "heading", level: 2, text: "The report" },
      {
        type: "table",
        headers: ["Component", "Content"],
        rows: [
          ["Preamble", "Authority and reference number, date and time of examination, place, persons present, and the identity of the deceased as certified by the person who identified the body"],
          ["External examination", "Clothing, person, and every injury with site, dimensions, description and photograph reference"],
          ["Internal examination", "The three cavities in the order opened, each organ's weight, appearance and pathology"],
          ["Histology and laboratory", "Blocks, slides, samples taken, and to whom they were sent"],
          ["Opinion", "Cause of death with interval where applicable; manner; and, where the findings allow, the weapon and the antemortem or postmortem nature of injuries"],
          ["Signature and annexures", "Signature, registration number, and the inventory of viscera, seals and photographs"],
        ],
      },
      {
        type: "paragraph",
        text: "Write the opinion in three registers. Findings are facts: 'the liver weighed 1200 g and showed centrilobular necrosis'. Proximate cause is a medical inference from those findings: 'death was due to acute liver failure, the interval being hours to a day before examination'. Qualification is honesty: 'whether the failure resulted from the alleged paracetamol ingestion can be determined only by the viscera report'. An opinion that mixes these registers — a conclusion dressed as a fact — is demolished in one question from a competent lawyer.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Writing the cause of death before the dissection is finished. The cause follows the findings; when the findings are equivocal, the honest opinion says so and awaits histology and toxicology.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Measuring injuries by eye. Every wound is measured with a scale, in two dimensions, with position referred to landmarks and with photographs — that is the difference between evidence and an impression.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Handing the report or the viscera to a relative or to a junior. The report goes to the requisitioning authority; the viscera go to the laboratory through the police with the seals intact.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What is the difference between cause of death and manner of death, with an example of each?",
        answer: "Cause is the pathological process — for example, haemorrhage from a stab wound of the heart. Manner is the classification of the circumstance — homicide, suicide, accident or natural — decided from the findings together with the scene and the history.",
        explanation: "Cause is medical and narrow; manner is evidential and wider, and it is the manner that a court needs.",
      },
      {
        type: "question",
        prompt: "Why is rectified spirit avoided as a preservative when volatile poisons are suspected?",
        answer: "Because rectified spirit is itself an alcohol; using it would contaminate the sample with the same substance that may be the poison, making quantitative analysis of ethanol or a volatile solvent impossible.",
        explanation: "Protocols therefore specify saturated saline or clean unaltered preservation for such cases, with the reason recorded.",
      },
      {
        type: "question",
        prompt: "A post-mortem report concludes: 'Death due to poisoning; viscera sent for chemical examination.' What is wrong with the wording?",
        answer: "It states a cause that the examination has not demonstrated and conflates suspicion with finding. The report should describe the pathology found — for example, gastric mucosa congestion with a suspicious smell — and record that viscera were preserved and sent, reserving the cause of poisoning for the laboratory report.",
        explanation: "A cause of death asserted before the laboratory acts is an overstatement that a defence will exploit.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A medico-legal post-mortem on a body from a police inquest is properly conducted by whom?",
        options: [
          "Any registered medical practitioner, on the requisition of the investigating officer",
          "Only a forensic medicine specialist in private practice",
          "Only a board of four doctors, in every case",
          "The magistrate who ordered the inquest",
        ],
        correctIndex: 0,
        explanation: "In a police inquest any registered medical practitioner may conduct the examination; boards are required for magistrate's inquiries.",
      },
      {
        type: "mcq",
        stem: "Which of these is the proper sequence of a post-mortem examination?",
        options: [
          "Open the abdomen first, and examine the exterior afterwards",
          "External examination, photographs, then dissection with histology and viscera sampling",
          "Remove viscera first, then photograph the injuries",
          "Examine organs before identification is established",
        ],
        correctIndex: 1,
        explanation: "External findings, trace evidence and photographs come first; destruction by dissection is irreversible.",
      },
      {
        type: "mcq",
        stem: "In a suspected poisoning case, the stomach with its contents is preserved in which of the following?",
        options: [
          "Rectified spirit, always",
          "Saturated saline solution, or clean where a volatile poison is suspected",
          "Formalin for histology",
          "Plain water with a disinfectant tablet",
        ],
        correctIndex: 1,
        explanation: "Saturated saline is the routine preservative for viscera; rectified spirit is avoided where volatile poisons or alcohol are suspected.",
      },
      {
        type: "mcq",
        stem: "What makes a set of viscera admissible rather than merely collected?",
        options: [
          "That the bottles were carried by any hospital attendant",
          "That each container is labelled, sealed and signed, with the seals described in the report and the dispatch receipted in the register",
          "That the family was informed of the contents",
          "That the sample was kept in a refrigerator for a month",
        ],
        correctIndex: 1,
        explanation: "Chain of custody — labelling, sealing, described seals, documented dispatch and receipt — is what a court examines first.",
      },
      {
        type: "mcq",
        stem: "Which statement about a post-mortem opinion is correct?",
        options: [
          "The opinion should state the law that has been broken",
          "The opinion states a cause of death supported by findings, with the interval and manner where the material allows, and records its limitations",
          "The opinion should always name the accused",
          "The opinion may be altered after signing, if the doctor later changes his mind, without a supplementary report",
        ],
        correctIndex: 1,
        explanation: "A revised opinion requires a supplementary, dated report explaining the change — silent alteration destroys the whole document's credibility.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The medico-legal post-mortem answers identity, time, cause and manner under a requisition, with the external examination, photographs and scene evidence preserved before dissection. In poisoning cases the stomach and contents, bowel, liver, kidney, spleen, blood and urine are preserved with the correct preservatives and sealed with a documented chain of custody. The report is built from a preamble, the external and internal findings, the laboratory samples, and an opinion that states its cause, its interval and its limits.",
      },
      {
        type: "paragraph",
        text: "Next: clinical forensic medicine — the same discipline applied to the living: consent before examination, the injury certificate, the examination of the accused, drunkenness reports and age estimation.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 6 — Clinical forensic medicine (fully authored)
// ---------------------------------------------------------------------------
function lesson6() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the sequence of a forensic examination of a living person, beginning with consent and ending with a documentation trail; list the components of a medico-legal injury certificate and the statutory reporting duty that follows it; describe the examination of an accused person under the BNSS, including the procedures for a rape accuse and for intoxication; outline the clinical and radiological methods of age estimation and the range a court may rely on; and state the duties that arise in a pregnant minor, a rape survivor seeking termination, and any suspected child abuse.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (Medical jurisprudence) for consent, certificates and the reporting duty, and Lesson 5 (Post-mortem examination and reports) for the discipline of description that a living-patient examination shares.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Clinical forensic medicine",
        text: "The application of medical knowledge to living persons in legal proceedings: examination of victims and accused, injury documentation, age estimation, assessment of fitness and intoxication, and the preservation of evidence on the living body.",
      },
      {
        type: "paragraph",
        text: "The advantage over the post-mortem is that your patient can speak, consent and be photographed as he lies; the disadvantage is that the same patient can be cross-examined about your findings a year later. The discipline is identical in both rooms: consent first, description before opinion, measurements rather than adjectives, and every conclusion tied to something you recorded at the time.",
      },

      { type: "heading", level: 2, text: "Consent and the sequence of examination" },
      {
        type: "paragraph",
        text: "Consent for a medico-legal examination is separate from consent for treatment, and it must be informed: the person is told the purpose (examination for the court), who will see the findings, and that some findings may be disclosed. A patient may refuse part of the examination and still be treated; treatment is never conditional on consent to be examined for court. For a person in police custody the position is governed by the BNSS: examination of an accused at the request of a police officer is lawful, but only the force reasonably necessary may be used, and the doctor must not become the police's instrument.",
      },
      {
        type: "callout",
        variant: "info",
        text: "A female victim or accused is examined, wherever possible, by a female doctor, in the presence of a female attendant, with curtains drawn and chaperones recorded. Privacy and dignity are not courtesies here; breaches of both are what defense counsel use to suggest a careless examination.",
      },
      {
        type: "table",
        headers: ["Step", "Content"],
        rows: [
          ["Identification", "Name, age, sex, address; brought by whom; with or without a police requisition; date and time"],
          ["History", "The alleged mechanism, in the patient's own words, with who narrated it and when; mark clearly as alleged"],
          ["Consent", "Written, informed, separate from treatment consent; the right to decline stated and recorded"],
          ["General examination", "Build, nutrition, pallor, jaundice, pulse, blood pressure, consciousness, orientation, alcohol or drug signs"],
          ["Local examination", "Every injury: site, size, shape, direction, margins, colour, tenderness, swelling, and estimated age; the whole body is examined, including the back and the scalp"],
          ["Investigations", "X-rays, ultrasound or CT as indicated; photographs with scale; laboratory samples"],
          ["Opinion", "Provisional or final: simple or grievous, with the reasoning and the follow-up interval"],
          ["Disposal", "Copies of the report; the patient retains his copy; the original goes with the register entry"],
        ],
      },

      { type: "heading", level: 2, text: "The injury certificate" },
      {
        type: "paragraph",
        text: "The injury report is the doctor's principal output in clinical forensic medicine. It is written at the time of examination, in duplicate, and the statutory duty to inform the police of specified injuries fills the legal frame around it. Two failures recur: examining the injured part only, and certifying severity on the first day.",
      },
      {
        type: "table",
        headers: ["Component of the certificate", "What it must contain"],
        rows: [
          ["Identification", "Name, age, sex, address, date and time of examination, by whom brought"],
          ["Consent", "The fact and form of consent; refusal if any"],
          ["History", "As narrated, marked as alleged, with the informant's name"],
          ["Description of injuries", "Site with measured landmarks, number, dimensions, shape, direction, margins, surrounding changes, estimated age"],
          ["Findings on the rest of the body", "Explicit statement that the whole body was examined, and defence or old injuries"],
          ["Investigations", "Imaging and reports, with the time performed"],
          ["Opinion", "Simple or grievous, the basis of the opinion, and a follow-up date for the final opinion"],
          ["Certification", "Signature, designation, registration number, and the distribution of copies"],
        ],
      },
      {
        type: "question",
        prompt: "Why is the certificate given in duplicate, and why is a final opinion dated later than the first?",
        answer: "Duplication gives the patient his own copy — which in practice is what the investigating officer and the court rely on — while a copy stays in the record; a later final opinion is needed because severity, and particularly the ability to follow ordinary pursuits, is only assessable over the days that follow.",
        explanation: "Provisional opinions are explicitly labelled provisional; an opinion repeated unchanged after a follow-up interval invites the question why.",
      },

      { type: "heading", level: 2, text: "Examining the accused" },
      {
        type: "table",
        headers: ["Situation", "Provision and procedure"],
        rows: [
          ["Examination of an accused at the request of a police officer", "Section 51 BNSS (formerly section 53 CrPC): examination by a registered medical practitioner, using only such force as is reasonably necessary, on a requisition that records the grounds"],
          ["Examination of a person accused of rape", "Section 52 BNSS (formerly section 53A CrPC): the examination is by a registered medical practitioner, with the consent of the accused, in a government or local-authority hospital wherever practicable, and conducted by a female doctor if the accused is female — samples for DNA and trace evidence are taken with the accused's consent"],
          ["Examination of the victim of rape", "Section 184 BNSS (formerly section 164A CrPC): with the consent of the woman, by a female doctor wherever practicable, and the report is sent to the investigating officer within seven days"],
          ["Examination for intoxication", "At the request of a police officer under the motor vehicles law: objective observations plus a breath test; blood for alcohol estimation drawn with consent and sealed with sodium fluoride or potassium oxalate"],
        ],
      },
      {
        type: "paragraph",
        text: "The examiner of an accused has two jobs that pull in opposite directions: to be clinically fair, and to record truthfully what the accused's body shows. A defence injury on the accused — scratches on the forearms, a bite mark, bruising of the knuckles — is evidence, and its presence or absence is recorded with the same neutrality as a bruise on a victim. The medical report on the accused is evidence, not an interrogation; admissions made during examination are recorded verbatim if volunteered, but the doctor does not question.",
      },

      { type: "heading", level: 2, text: "Intoxication" },
      {
        type: "table",
        headers: ["Observations recorded", "Limits of the examination"],
        rows: [
          ["Breath odour, speech, handwriting, coordination, gait on a straight line, finger-to-nose test, pupils, pulse, blood pressure, reflexes, mental state", "Odour is confounded by ketosis, solvents and other diseases; behaviour is confounded by head injury, hypoglycaemia, drugs and psychiatric illness"],
          ["Breath-alyser reading with the instrument and time", "A screening device is presumptive; the blood alcohol is the measure relied upon in court"],
          ["Blood sample, 10 ml in sodium fluoride and potassium oxalate, sealed and signed, in duplicate where required", "Drawn by a registered medical practitioner with consent; alcohol swabs are avoided on the skin because they contaminate the sample"],
        ],
      },
      {
        type: "paragraph",
        text: "In India the legal threshold for driving offences is thirty milligrams of alcohol per hundred millilitres of blood — 0.03 per cent. Levels below that may still be clinically relevant, and levels above it hardly need demonstration. The report opines on the fact and degree of intoxication; whether the person was 'driving' or 'in charge' is for the law to decide.",
      },

      { type: "heading", level: 2, text: "Age estimation" },
      {
        type: "paragraph",
        text: "Age in dispute is a court question, answered by a range. No radiological or dental method returns a single year; each returns a distribution, and the court combines it with documentary evidence — birth certificate, school records, matriculation — before deciding. The statutory purposes that matter are juvenile status below eighteen, consent to marriage, and employment.",
      },
      {
        type: "table",
        headers: ["Method", "Window and use", "Limitations"],
        rows: [
          ["Dental eruption and root development", "The most useful single method below eighteen; eruption sequences and root-completion stages", "Nutrition and disease alter timing; a range of one to two years is claimed at best"],
          ["Third molar development and root closure", "Late teens into the early twenties", "Wide scatter after eighteen; cannot distinguish eighteen from twenty-five alone"],
          ["Skeletal ossification centres and fusion", "Radiographs of wrist, hand, shoulder, elbow, hip and knee against reference standards", "Standards vary by population; wide ranges, and ionising radiation in a child demands justification"],
          ["Secondary sexual characteristics", "Tanner staging of pubic hair, breast and genital development", "Crude; strongly affected by nutrition and endocrine disease"],
          ["Height and weight", "Supportive against reference growth charts", "Affected by nutrition; near-useless in adults"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The commonest error in age opinions is reporting the mean as the answer. 'Age is more likely than not between seventeen and nineteen at the date of examination' is admissible; 'the age is nineteen' is not, and will not survive a competent cross-examination.",
      },

      { type: "heading", level: 2, text: "Pregnancy termination and child protection" },
      {
        type: "paragraph",
        text: "Under the Medical Termination of Pregnancy Act, 2021, a pregnancy may be terminated up to twenty-four weeks for specified categories of women — including survivors of sexual assault, minors, women with disabilities and other vulnerable groups — and beyond twenty-four weeks only with the approval of a Medical Board on the ground of substantial foetal abnormality. The consent of the pregnant woman is the consent that counts; where a minor is pregnant, the law requires that her own consent be taken and that the case be reported under the child-protection legislation.",
      },
      {
        type: "paragraph",
        text: "Reporting is mandatory and immediate for every suspected offence against a child — sexual contact, child marriage, trafficking, physical abuse — under the Protection of Children from Sexual Offences Act, 2012, and the doctor's duty under that Act is not satisfied by telling a senior colleague. Photograph, describe, preserve clothing, and ensure the child is examined by a paediatrician or a doctor trained in child examination, with a caregiver who is not a suspect.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Examining the injured part and stopping. The whole body is examined head to toe: defence injuries, old injuries and injection marks are exactly what is missed and exactly what a court asks about.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Marking a history as a fact. What the patient or a relative alleges is recorded as alleged, with the informant's name — the difference between a history and a finding is the difference between a witness and a doctor.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Letting the requisitioning officer stand over the examination. The doctor examines for the record, not for the accuser or for the prosecution's theory; a doctor who examines to a brief produces an opinion nobody can defend.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What is the difference between consent to treat and consent to a medico-legal examination?",
        answer: "Consent to treat permits the clinical care needed to save life or health. Consent to a medico-legal examination permits the examination, measurement, photography and sampling whose purpose is a legal proceeding; it must be separately taken, with the purpose explained, and it may be refused without affecting treatment.",
        explanation: "In emergencies, treatment proceeds on implied consent to preserve life; the forensic examination still waits for express consent whenever the patient can give it.",
      },
      {
        type: "question",
        prompt: "State the legal blood-alcohol threshold for a driving offence in India and the sample required to prove it.",
        answer: "Thirty milligrams per hundred millilitres — 0.03 per cent blood alcohol. The admissible evidence is a sealed blood sample drawn by a registered medical practitioner into sodium fluoride and potassium oxalate, with the chain of custody recorded.",
        explanation: "A breath analyser reading is presumptive screening; the blood alcohol is the measure on which a court relies.",
      },
      {
        type: "question",
        prompt: "An accused of a sexual offence refuses consent for the examination. What is the lawful course?",
        answer: "The examination is not conducted: consent of the accused is a condition, and the examining doctor records the refusal. Only the physical examination otherwise permitted by section 51 BNSS at a police request may proceed, using no more than reasonable force — and section 52 itself requires consent.",
        explanation: "Documenting a refusal is itself evidence; an examination forced on an accused without lawful authority transfers the fault to the doctor.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which of these is the mandatory first step of a forensic examination of a living person?",
        options: [
          "Requesting the police requisition",
          "Taking informed consent, separate from consent for treatment",
          "Photographing the injuries",
          "Measuring and describing each injury",
        ],
        correctIndex: 1,
        explanation: "Consent is the threshold act; without it the examination is unlawful even if clinically faultless.",
      },
      {
        type: "mcq",
        stem: "A woman who alleges sexual assault is examined. The correct procedure under the BNSS is which?",
        options: [
          "Examination by any doctor, with the police officer present throughout, without consent because the case is serious",
          "Examination with her consent, by a female doctor wherever practicable, with the report sent to the investigating officer within seven days under section 184 BNSS",
          "Examination only after the trial begins",
          "Examination by the same doctor who examined the accused, to ensure consistency",
        ],
        correctIndex: 1,
        explanation: "Section 184 BNSS requires consent and a female examiner wherever practicable; the report goes to the investigating officer within seven days.",
      },
      {
        type: "mcq",
        stem: "The medico-legal blood alcohol concentration that constitutes the statutory threshold for driving in India is:",
        options: ["0.01 per cent", "0.03 per cent", "0.08 per cent", "0.30 per cent"],
        correctIndex: 1,
        explanation: "The threshold is thirty milligrams per hundred millilitres of blood — 0.03 per cent — and the evidence is the sealed blood sample.",
      },
      {
        type: "mcq",
        stem: "An age-estimation report for a juvenile-court case should conclude in which form?",
        options: [
          "The age is exactly eighteen years",
          "The age is more likely than not between sixteen and eighteen, by dental and radiological assessment, corroborated by the school record",
          "The person is an adult because the third molar has erupted",
          "The court need not be given any range",
        ],
        correctIndex: 1,
        explanation: "Methods yield ranges with stated uncertainty; a court relies on the range plus documentary evidence, not on a single year.",
      },
      {
        type: "mcq",
        stem: "A sixteen-year-old girl is brought by a relative after an assault, and a pregnancy is suspected. Which action is compulsory?",
        options: [
          "Nothing; a relative's presence suffices",
          "Report to the police and the child-protection authorities under POCSO, and take the girl's own consent for her examination",
          "Inform only the school principal",
          "Wait until the parents return from out of town",
        ],
        correctIndex: 1,
        explanation: "Suspected offences against a child must be reported without delay under POCSO, and the child's own consent is taken for her examination.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Clinical forensic medicine applies the post-mortem discipline to the living: consent first, whole-body examination, measurements not adjectives, a certificate in duplicate, and a statutory intimation to police for the specified injuries. The accused is examined under sections 51 and 52 BNSS with consent and only necessary force, the victim of sexual offences under section 184 BNSS within seven days, intoxication is proved by a sealed blood sample against the 0.03 per cent threshold, and age is always a range corroborated by documents.",
      },
      {
        type: "paragraph",
        text: "Next: sexual offences examination — consent law, the examination and evidence-preservation protocol, and the myths about hymen and virginity that courts no longer accept.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 7 — Sexual offences examination (fully authored)
// ---------------------------------------------------------------------------
function lesson7() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: state the elements of rape under the BNS and the age-based aggravations, including the changed marital exception; describe the protocol for examining a survivor of sexual violence, from consent and emergency care to evidence preservation and the seven-day report; explain the purpose and timing of each specimen collected; dismantle the medico-legal myths about the hymen, virginity and pregnancy; and describe the examination of the accused, including the significance of injuries that the survivor's resistance would produce.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1 and 6. You need consent, certificates and the reporting duty, together with the sequence of a forensic examination of the living.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Consent in sexual offences",
        text: "The axis of the offence: penetration is rape where it is against the woman's will or without her consent, and consent is vitiated where it is obtained by fear of harm, by misconception of fact, or where the woman is unable to understand the nature of the act because of unsoundness of mind, intoxication or administration of a stupefying substance.",
      },
      {
        type: "paragraph",
        text: "The law was rewritten in 2023 around a simple axis. Under section 63 of the BNS (formerly section 375 of the Indian Penal Code), rape is penetration of the vagina, mouth, urethra or anus with the penis, or with any object or part of the body, without consent — and the consent of a minor under eighteen years is no consent at all. Proof of penetration does not require proof of injury: the elasticity of the young hymen means that complete penetration can occur without a tear, without bleeding and without pain, and an intact hymen proves nothing either way.",
      },
      {
        type: "table",
        headers: ["Provision", "Offence and punishment"],
        rows: [
          ["Section 63 BNS (formerly 375 IPC)", "Defines rape: penetration, to any extent, without consent or under vitiated consent; the marital exception now applies only to a wife aged eighteen or above"],
          ["Section 64 BNS (formerly 376 IPC)", "Punishment: rigorous imprisonment of not less than ten years, extending to imprisonment for life, and fine"],
          ["Section 65 BNS (formerly 376A IPC)", "Rape causing death, or leaving the woman in a persistent vegetative state: rigorous imprisonment for life, or death"],
          ["Section 70 BNS (formerly 376D IPC)", "Gang rape: rape committed by more than one person acting in furtherance of a common intention"],
          ["POCSO, 2012", "Aggravated punishment where the victim is under eighteen; special courts and special procedures"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Zero FIR (section 173 BNSS) applies with full force: a survivor may complain at any police station, which registers it and transfers it to the competent station. The examining doctor should therefore not delay the examination because the 'right' station has not been reached.",
      },

      { type: "heading", level: 2, text: "Examination and emergency care" },
      {
        type: "paragraph",
        text: "Treatment comes first and the examination serves it. Serious injury, pregnancy and infection are emergencies: emergency contraception, prophylaxis against sexually transmitted infection including HIV, tetanus, hepatitis B vaccination, analgesia, and treatment for the psychological state are offered and recorded. The forensic examination proceeds only after the patient is stable enough to consent to it — and never at the cost of delay where treatment cannot wait.",
      },
      {
        type: "table",
        headers: ["Step", "Detail"],
        rows: [
          ["Consent", "Informed, written, and revisitable: the survivor may decline any part of the examination and still receive treatment; the right to a support person; the right to a female examiner"],
          ["Examiner", "A female doctor wherever practicable, with a female attendant, privacy, and a chaperone recorded in the report"],
          ["History", "The account as narrated, marked as alleged; the time, place and circumstances; whether the survivor bathed, washed, douched, changed clothes, urinated or defecated after the event"],
          ["General examination", "Demeanour, alcohol or drug signs, and any areas of injury — whole body, including mouth, breasts, thighs, buttocks and the back"],
          ["Genital examination", "External first: the labia, fourchette, fossa navicularis and perineum; internal only where indicated and with the woman's consent; a colposcope where available for magnification and documentation"],
          ["Documentation", "Photographs with consent, body diagrams, and a description of each finding with its age"],
        ],
      },
      {
        type: "paragraph",
        text: "Timing is recorded because it governs the evidential value of the specimens, but an examination is never refused for lateness. Semen, saliva and the assailant's DNA are best detected within the first twenty-four to seventy-two hours; spermatozoa may persist in the cervix for several days; bruises and abrasions carry their own window of about a week for visible change. The report therefore states the interval between the alleged assault and the examination, and what the interval means for each expected finding.",
      },

      { type: "heading", level: 2, text: "Specimens and their purpose" },
      {
        type: "table",
        headers: ["Specimen", "Purpose", "Preservation"],
        rows: [
          ["Vaginal, vulval and low vaginal swabs, and a cervical swab", "Spermatozoa, semen components and assailant DNA; the low vaginal swab is the higher-yield specimen in a delayed presentation", "Dried on a labelled swab, or in the preservative the laboratory specifies; sealed and signed"],
          ["Rectal and oral swabs where applicable", "DNA evidence of the acts alleged", "As above, with the site labelled"],
          ["Clothing, unlaundered", "Semen, blood, fibres and trace evidence; the clothes worn at the time are the best source", "Dried, each item separately bagged and labelled, never mixed"],
          ["Pubic hair and head hair combings", "Assailant hair and trace transfer; also for the survivor's own comparison samples", "Dried in separate labelled envelopes"],
          ["Blood and urine", "Drugs of incapacitation, pregnancy test, infection screening, DNA reference sample", "Blood into fluoride or plain tubes as the protocol directs; urine in the bottles provided"],
          ["Fingernail scrapings", "DNA and skin of the assailant from resistance", "Swabbed or clipped into a labelled envelope"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The laboratory confirmation of recent intercourse rests on microscopy for spermatozoa, the detection of seminal components such as acid phosphatase and prostate-specific antigen — which persist longer than sperm — and DNA profiling that can link or exclude an accused. Absence of all of them, after the window, does not exclude the offence.",
      },

      { type: "heading", level: 2, text: "Hymen, virginity and pregnancy: the myths" },
      {
        type: "table",
        headers: ["Claim once made to courts", "The medical evidence"],
        rows: [
          ["An intact hymen proves no intercourse occurred", "The hymen is elastic, its opening varies and it stretches without tearing; an intact hymen is compatible with completed penetration"],
          ["A torn hymen proves intercourse occurred", "Tears arise from tampons, masturbation, sport and medical examination; fresh tears must be aged and interpreted in context"],
          ["Bleeding at first intercourse is expected", "Most first acts do not bleed significantly; absence of bleeding is of no probative value"],
          ["The two-finger test assesses virginity or sexual habit", "The Supreme Court of India rejected the test in Lillu versus State of Haryana (2013) as having no bearing on the offence and being degrading; a lax vagina is not evidence of prior intercourse"],
          ["Pregnancy proves consent and dates the offence", "Pregnancy neither proves nor disproves consent; it establishes only that intercourse occurred sometime before conception, and paternity testing, not the pregnancy, links a man to it"],
          ["Absence of injuries disproves the allegation", "Injuries are frequently absent in genuine cases; injury is neither necessary nor sufficient proof of the offence"],
        ],
      },
      {
        type: "paragraph",
        text: "The doctor's report is a description of findings with their significance stated medically — never a conclusion that a woman was or was not 'virgin', or that she had been 'habituated to sexual intercourse'. Those are phrases from an older jurisprudence; a modern court does not want them, and a doctor who writes them has miscast the medical role.",
      },

      { type: "heading", level: 2, text: "Examination of the accused" },
      {
        type: "paragraph",
        text: "The accused is examined under section 51 BNSS at a police request, and under section 52 BNSS where the charge is rape — the latter requiring the consent of the accused, and a government or local-authority hospital wherever practicable. The purpose is twofold: to record injuries the accused bears, which the survivor's resistance would explain, and to take reference and trace samples from him.",
      },
      {
        type: "table",
        headers: ["Finding on the accused", "Value"],
        rows: [
          ["Scratches on the forearms, backs of the hands, face and neck; bite marks; bruising of the knuckles", "Consistent with resistance by the survivor; their absence does not exclude the offence"],
          ["The accused's DNA in the survivor's swabs or under her fingernails", "Direct evidence linking the two bodies at the time"],
          ["Sexually transmitted infection found in the accused, and subsequently in the survivor", "Circumstantial support, weighed with the timing and the baseline infection rate"],
          ["Injuries the accused attributes to an innocent cause", "The account is recorded and the injury described; consistency with the account is a medical question, guilt is not"],
        ],
      },
      {
        type: "question",
        prompt: "A survivor examined eight hours after the assault has no visible genital injury. What may the report properly say?",
        answer: "That the examination at that interval showed no visible injury; that the absence of injury neither proves nor disproves penetration because the hymen stretches and many penetrative acts leave no mark; and that the specimens taken carry the evidential value that microscopy, seminal markers and DNA can give at that interval.",
        explanation: "The report describes and explains significance; it does not conclude that the allegation is false.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Writing that the hymen was 'torn', that the woman was 'habituated to sexual intercourse', or that she was 'not virgin'. Such phrases are medically meaningless, legally obsolete, and they hand the defence an easy target.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Bathing or changing the survivor's clothing before the samples are taken, or swabbing the vulva after the vagina. The examination follows the order of evidential loss: clothing first, external swabs before internal, and no cleaning until every specimen is collected.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Refusing or delaying the examination because the presentation is late, or because the survivor is intoxicated or dishevelled. Delay and untidy presentation are not grounds for anything; record both factually and examine what the case allows.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does an intact hymen not exclude rape, and what should a report say instead of using the word 'virgin'?",
        answer: "Because the hymen is elastic and its opening varies widely; penetration can occur without tearing, bleeding or pain. The report should describe the hymen's appearance, its opening, any tear and its estimated age, and state the medical significance — never a conclusion about virginity.",
        explanation: "Terms of moral judgement replace observation with opinion; the modern court needs the observation.",
      },
      {
        type: "question",
        prompt: "Which specimens give the highest yield in a survivor presenting seventy-two hours after an assault, and why?",
        answer: "The dried specimens with the longest persistence: clothing, external and low vaginal swabs for seminal markers and DNA, fingernail scrapings, and hair combings. Spermatozoa decline over time, but seminal components such as acid phosphatase and prostate-specific antigen persist longer, and DNA persists longest of all.",
        explanation: "This is why examination is offered at any interval, with the interval and its effect stated in the report.",
      },
      {
        type: "question",
        prompt: "What is the significance of scratches on the forearms of the accused?",
        answer: "They are consistent with the resistance of a survivor who fought with her hands, and are therefore supportive evidence; their absence is not exclusionary, because many assaults involve no prolonged struggle.",
        explanation: "The finding is described medically and weighed by the court; it does not by itself prove guilt.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Under the BNS, 2023, which statement about rape is correct?",
        options: [
          "Rape requires penetration plus proof of physical injury and resistance",
          "Rape is penetration, to any extent, without consent or under vitiated consent; the marital exception now applies only to a wife aged eighteen or above",
          "Rape requires the victim to be younger than eighteen years",
          "Gang rape is punished more leniently than a single-offender rape",
        ],
        correctIndex: 1,
        explanation: "Section 63 BNS centres on consent and penetration to any extent; injury and resistance are not elements, and aggravated gang rape attracts heavier punishment.",
      },
      {
        type: "mcq",
        stem: "The medical examination of a woman who alleges rape is governed by which provision and which rule?",
        options: [
          "Section 51 BNSS — examination without consent, at any time",
          "Section 184 BNSS — examination with her consent, by a female doctor wherever practicable, report to the investigating officer within seven days",
          "Section 196 BNSS — examination by a board in all cases",
          "No specific provision; the doctor exercises discretion",
        ],
        correctIndex: 1,
        explanation: "Section 184 BNSS (formerly 164A CrPC) sets consent, the examiner's gender wherever practicable, and the seven-day reporting timeline.",
      },
      {
        type: "mcq",
        stem: "A survivor has no genital injuries on examination. Which statement is correct?",
        options: [
          "The allegation is thereby disproved",
          "Absence of injury neither proves nor disproves penetration, because the hymen stretches and many penetrative acts leave no mark",
          "Injury is a necessary element of the offence",
          "The hymen must have been absent",
        ],
        correctIndex: 1,
        explanation: "Elasticity of the young hymen means penetration can occur without tearing, and injury is neither necessary nor sufficient for the offence.",
      },
      {
        type: "mcq",
        stem: "Which of these findings on the accused is consistent with the survivor's resistance?",
        options: [
          "Scratches on the backs of the hands and forearms",
          "An old appendicectomy scar",
          "A tattoo on the chest",
          "Bilateral cataract",
        ],
        correctIndex: 0,
        explanation: "Scratches on the backs of the hands and forearms are classic defence injuries on the assailant produced by a resisting victim.",
      },
      {
        type: "mcq",
        stem: "The two-finger test is described in court. What is its status?",
        options: [
          "It is the standard method of assessing virginity",
          "It was rejected by the Supreme Court of India in 2013 as having no bearing on consent or the offence, and as degrading to the woman",
          "It is mandatory in every sexual assault examination",
          "It measures the size of the vagina for sentencing purposes",
        ],
        correctIndex: 1,
        explanation: "Lillu versus State of Haryana (2013) held the test meaningless as evidence and degrading; a lax vagina is not evidence of prior intercourse.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The offence turns on consent, and penetration to any extent without it is rape under section 63 BNS, with section 64 fixing a minimum of ten years of rigorous imprisonment. The examination is consent-based, female-examiner-led wherever practicable, treats emergencies first, and preserves clothing, swabs and DNA in a documented chain; the reported interval is stated with its effect on each specimen. The hymen, virginity and pregnancy carry none of the evidential weight once claimed for them, and phrases of moral judgement have no place in the report.",
      },
      {
        type: "paragraph",
        text: "Next: forensic psychiatry — responsibility, fitness, testamentary capacity and the mental-health framework that governs them.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 8 — Forensic psychiatry (fully authored)
// ---------------------------------------------------------------------------
function lesson8() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define capacity and explain why it is task-specific and time-specific; state the M'Naghten standard of criminal responsibility as preserved in section 22 BNS, and how it differs from fitness to stand trial; describe how testamentary capacity is assessed and how a will made in a lucid interval is judged; outline the mental-health framework that governs admission, consent and treatment under the Mental Healthcare Act, 2017; and describe the process of a forensic psychiatric assessment and report, including the questions that must not be answered.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1 and 6. You need the roles of expert evidence and the discipline of the medico-legal report, because the psychiatric report follows the same rules with a different subject matter.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Capacity",
        text: "The ability to understand the nature of a specific act, to retain the information long enough to decide, to weigh the consequences, and to communicate a decision. Capacity is not a status but a function of the task and of the moment.",
      },
      {
        type: "paragraph",
        text: "The whole of forensic psychiatry rests on that sentence. A patient with delirium tremens may be incapable of consenting to surgery at three in the morning and perfectly capable of selling a house at ten the next day; a woman with dementia may execute a valid will in a lucid interval and an invalid one the week after; a man with schizophrenia may be unfit to stand trial in an acute episode and fit three months later. The expert's task is therefore never 'is this patient of unsound mind' as a general question, but 'was this person able to do this thing, at that time'.",
      },

      { type: "heading", level: 2, text: "Criminal responsibility and fitness" },
      {
        type: "table",
        headers: ["Question", "The legal test", "Some features"],
        rows: [
          ["Criminal responsibility", "The M'Naghten rules, preserved in section 22 BNS (formerly section 84 IPC): nothing is an offence done by a person who, at the time, by reason of unsoundness of mind, was incapable of knowing the nature of the act, or that he was doing what was wrong or contrary to law", "Assessed retrospectively, at the time of the offence; requires that the incapacity arose from unsoundness of mind, and not merely passion or intoxication taken voluntarily"],
          ["Fitness to stand trial", "Whether the accused can understand the proceedings, plead, instruct counsel, and follow the evidence — a present-day functional test", "Assessed now; an unfit accused is dealt with by the magistrate under the BNSS provisions on accused persons of unsound mind, sections 367 to 378"],
          ["Testamentary capacity", "The capacity to make a will: knowing the nature of the act, the extent of the property, and the claims of those who might expect to benefit; a will made during a lucid interval is valid", "Judged at the moment of execution; undue influence and suspicious circumstances are separate questions"],
          ["Capacity to consent to treatment", "The ability to understand, retain, weigh and communicate a decision about the specific treatment", "Capacity fluctuates; where it is absent, the Mental Healthcare Act, 2017 governs who may decide and how"],
        ],
      },
      {
        type: "paragraph",
        text: "The distinction between responsibility and fitness is the one most often collapsed in journalism and in the witness box. Responsibility asks what was in the man's mind when the act was done, and is answered by reconstructing the past; fitness asks what is in his mind today, and is answered by a present examination. An accused may be unfit now though quite sane at the time of the offence, and guilty and sane at the time and unfit now — the two findings travel together or separately, but they are not the same finding.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Voluntary drunkenness is no defence in India, because the person chose to lose his reason; involuntary intoxication is different. The distinction between the two is itself an expert question, decided on the history and any substance found.",
      },

      { type: "heading", level: 2, text: "Testamentary capacity" },
      {
        type: "paragraph",
        text: "A will is executed by a person who must, at the moment of signing, understand its character, recall the property being disposed of, remember those with a natural claim on it, and be free of delusions that bear on the disposal. Dementia does not automatically invalidate: the question is the state at the time of execution, and lucid intervals — hours or days of clarity within a progressive illness — are exactly where valid wills are made. Suspicious circumstances — a will drafted in the last days of life by a beneficiary, a testator who cannot name his own children, secrecy and haste — shift the burden to the propounder of the will to prove capacity and knowledge.",
      },
      {
        type: "question",
        prompt: "A testator with dementia executed a will on a day when she correctly named her children and described her property. Why may the will be valid?",
        answer: "Because capacity is judged at the moment of execution. If, despite dementia, she could understand the act, recall her property and remember the claims of others — a lucid interval — the will stands; the surrounding suspicion, if any, is what the propounder must then dispel.",
        explanation: "This is why the attesting doctor, where one exists, records the mental state at the time of execution rather than a general diagnosis.",
      },

      { type: "heading", level: 2, text: "The Mental Healthcare Act, 2017" },
      {
        type: "table",
        headers: ["Provision", "Effect"],
        rows: [
          ["Rights of persons with mental illness", "Access to affordable mental healthcare, protection from cruel or degrading treatment, and the right to live in the community wherever possible"],
          ["Advance directive and nominated representative", "A person may state in advance how he wishes to be treated and nominate a representative; a doctor may depart from the directive only in the stated circumstances and with review"],
          ["Attempted suicide", "The Act creates a strong presumption that a person who attempted suicide was under severe stress, and requires care and rehabilitation instead of prosecution — the criminal law follows the same presumption"],
          ["Admission", "An independent patient with capacity may seek admission himself; admission with support or without consent is regulated, time-limited and reviewable by a Mental Health Review Board"],
          ["Electro-convulsive therapy and other restrictions", "Modified electro-convulsive therapy is prohibited without anaesthesia and muscle relaxation; the Act also regulates seclusion, restraint and certain psychosurgical procedures"],
        ],
      },
      {
        type: "paragraph",
        text: "For the doctor the practical output is the capacity assessment for admission or treatment: does this person understand what is proposed, can he weigh it, and can he communicate it? Where capacity is present, the decision is his; where it is absent, the Act's supported-admission route and the nominated representative take over, and the record must show which route was used and why.",
      },

      { type: "heading", level: 2, text: "The forensic psychiatric assessment" },
      {
        type: "paragraph",
        text: "A single consultation cannot answer a retrospective question. The assessment is a process: the collateral history from family, employers and previous records; the mental state examination at interview; cognitive testing where indicated; and, where the timeline matters, interviews spread across the period in which the illness waxed and waned. The opinion is written as a reasoned argument from records and findings, not as a label.",
      },
      {
        type: "table",
        headers: ["Source of evidence", "What it supplies"],
        rows: [
          ["Collateral history — family, colleagues, prior admissions", "The baseline before the offence; the change in behaviour; previous episodes and treatments"],
          ["Hospital and clinic records", "Diagnosis, treatment, response and objective notes at intervals"],
          ["Mental state examination", "Appearance, speech, mood, thought form and content, perception, cognition, insight and judgment at the time of interview"],
          ["Cognitive and psychological testing", "Objective, quantified function — useful in dementia and intellectual disability"],
          ["Police and scene material", "The alleged acts, their planning and their aftermath, which the expert interprets but does not adopt"],
        ],
      },
      {
        type: "paragraph",
        text: "The report answers the precise question posed — responsibility, fitness, capacity, or the effect of a mental condition on a specific decision — and refuses the rest. The commonest failure is the diagnosis-instead-of-answer: 'the accused suffers from paranoid schizophrenia' is a finding; whether he knew the nature of his act is the question, and the answer must engage with what the records show of his state at the relevant time.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Treating diagnosis as a verdict. A diagnosis is not legal insanity and legal insanity is not a diagnosis; the opinion must address the functional question that the law asks.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Answering a retrospective question from a present examination alone. Responsibility attaches to the state at the time of the act, and needs the historical material, not a single interview.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Assuming a mental disorder means incapacity for everything. Capacity is task- and time-specific; capacity to consent to treatment, to contract, to marry and to make a will are separate questions, each answered at its own moment.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Distinguish criminal responsibility from fitness to stand trial, and state when each is assessed.",
        answer: "Responsibility is the state of mind at the time of the offence, judged against the M'Naghten test preserved in section 22 BNS, and is retrospective. Fitness is the ability today to understand the proceedings, plead and instruct counsel, and is assessed by a present examination.",
        explanation: "The same accused can be sane at the offence and unfit to be tried now; the two findings answer different questions at different times.",
      },
      {
        type: "question",
        prompt: "Why can a person with dementia execute a valid will?",
        answer: "Because capacity to make a will is judged at the moment of execution; in a lucid interval a person with dementia may understand the nature of the act, the extent of the property and the claims of others, which is all that the law requires.",
        explanation: "The surrounding circumstances of suspicion, where present, shift the burden of proof to the propounder of the will.",
      },
      {
        type: "question",
        prompt: "Under the Mental Healthcare Act, 2017, how is attempted suicide approached?",
        answer: "With a strong presumption that the person was under severe stress: the Act requires care, treatment and rehabilitation, and the same logic runs through the criminal law, so prosecution of a person in that state is not the intended route.",
        explanation: "The provision was designed to move the response from punishment to treatment for a person in acute distress.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "The test of criminal responsibility in India is based on which standard?",
        options: [
          "Whether the accused could control his impulses",
          "Whether, at the time of the act, unsoundness of mind rendered him incapable of knowing the nature of the act or that it was wrong or contrary to law — the M'Naghten test, preserved in section 22 BNS",
          "Whether the accused had any psychiatric diagnosis at all",
          "Whether the act was premeditated",
        ],
        correctIndex: 1,
        explanation: "Section 22 BNS (formerly 84 IPC) requires incapacity of knowing nature or wrongness arising from unsoundness of mind — a cognitive test, not an impulse-control test.",
      },
      {
        type: "mcq",
        stem: "An accused cannot follow the proceedings or instruct his counsel. Which finding is correct?",
        options: [
          "He is legally insane and must be discharged",
          "He is unfit to stand trial, a present-day functional finding addressed by the BNSS provisions on accused persons of unsound mind",
          "He is automatically guilty",
          "The trial continues and he is examined afterwards",
        ],
        correctIndex: 1,
        explanation: "Fitness to stand trial is a current functional question; the BNSS, sections 367 to 378, provides the procedure for such accused, including inquiry and care.",
      },
      {
        type: "mcq",
        stem: "A woman with progressive dementia executes a will naming her children and describing her property. What is the correct statement?",
        options: [
          "The will is void because she has dementia",
          "The will is valid if she had capacity at the moment of execution, dementia notwithstanding",
          "The will must be executed by her children",
          "The diagnosis of dementia is irrelevant in every case",
        ],
        correctIndex: 1,
        explanation: "Testamentary capacity is judged at execution; lucid intervals confer valid capacity, subject to any surrounding suspicion.",
      },
      {
        type: "mcq",
        stem: "Which statement about capacity is correct?",
        options: [
          "It is a single global status attached to a diagnosis",
          "It is task-specific and time-specific, and is assessed separately for treatment, contract, marriage and will-making",
          "It is permanent once assessed",
          "It is decided by the attending psychiatrist's certificate alone",
        ],
        correctIndex: 1,
        explanation: "Capacity fluctuates and refers to a specific decision at a specific time; blanket conclusions are unsound.",
      },
      {
        type: "mcq",
        stem: "A forensic psychiatric report is asked to opine on criminal responsibility. Which report is adequate?",
        options: [
          "The accused has paranoid schizophrenia; therefore he is legally insane",
          "A reasoned opinion engaging with the records of the accused's state at the time of the act, and the collateral history, answering whether he could know the nature or wrongness of the act",
          "A single interview conducted on the morning of the hearing, with a diagnosis",
          "The report should decline to answer, since psychiatry has no bearing",
        ],
        correctIndex: 1,
        explanation: "The retrospective question is answered by historical material and reasoning; a diagnosis alone or a single current interview cannot answer it.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Forensic psychiatry answers capacity questions, each with its own moment and its own test: criminal responsibility under the M'Naghten test preserved in section 22 BNS, judged at the time of the act; fitness to stand trial, judged today under the BNSS sections on the unsound-mind accused; testamentary capacity at execution, where lucid intervals save a will; and capacity to consent to treatment under the Mental Healthcare Act, 2017, which also reframes attempted suicide as a matter of care rather than punishment.",
      },
      {
        type: "paragraph",
        text: "Next: ethics, consent and negligence — the doctrine of consent, the Bolam standard of care, the difference between a bad outcome and negligence, and the three fora — civil, criminal and professional — in which a doctor answers for it.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 9 — Ethics, consent & negligence (fully authored)
// ---------------------------------------------------------------------------
function lesson9() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define consent and distinguish expressed, implied, informed and proxy consent, and say why blanket consent is rejected; state the elements of negligence and the standard of care against which a doctor is judged; distinguish an error of judgment from negligence, and civil from criminal liability; describe the place of medical records in the defence of a claim; state the exceptions to confidentiality and their limits; and describe how consent and confidentiality are handled for minors and for patients who lack capacity.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1 and 6. You need the medico-legal duties, the certificate practice and the consent sequence of the living-patient examination, which this lesson turns into a doctrine.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Consent",
        text: "A voluntary, informed agreement to an examination, treatment or procedure, given by a person with the capacity to make the decision, for a purpose that has been explained to him — including its material risks, its alternatives and its consequences.",
      },
      {
        type: "paragraph",
        text: "Consent is where the doctor's authority over a patient's body legally begins and ends. A battery committed with good intentions is still a battery: the clinical outcome cannot retrospectively license a procedure the patient never permitted. The doctrine has two halves — the giving of information and the taking of agreement — and both must be recorded, because years later the dispute is never about what the doctor remembers explaining.",
      },

      { type: "heading", level: 2, text: "Types of consent" },
      {
        type: "table",
        headers: ["Type", "How given", "Validity"],
        rows: [
          ["Implied consent", "By conduct — the patient offers his arm for an injection, presents for dressing", "Sufficient for routine, low-risk care only; it cannot cover a risky or invasive procedure"],
          ["Expressed consent", "Orally or in writing, for a procedure or a course of treatment", "Written for anything invasive; the form records the explanation, and is only as good as the discussion behind it"],
          ["Informed consent", "Disclosure of the nature of the treatment, its material risks and benefits, the alternatives and the consequences of refusal", "The general standard; a consent taken without disclosure is a signature without a substance"],
          ["Proxy consent", "By a parent, guardian or nominated representative for one who lacks capacity", "Governed by the Mental Healthcare Act, 2017 for patients with mental illness; strictly required for a child"],
          ["Blanket consent", "A general authorisation for 'any procedure the doctors think fit'", "Rejected by the courts: consent must be procedure-specific, because the patient's right is to decide about his own body"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Samira Kohli versus Dr Prabha Manchanda (2008) is the Indian authority most often cited: a consent for one operation cannot be stretched to another, and a consent for diagnostic surgery cannot become consent for a different therapeutic procedure. Consent is not a licence for whatever the surgeon finds convenient.",
      },
      {
        type: "paragraph",
        text: "Capacity is the gate. The patient must be able to understand the information, retain it long enough to decide, weigh it in the balance, and communicate the decision. Intoxication, delirium, dementia and psychiatric disturbance impair it, but no diagnosis automatically removes it — capacity is assessed for the specific decision, at the specific time, and where it is absent the Mental Healthcare Act's route, with a nominated representative, is followed.",
      },

      { type: "heading", level: 2, text: "Emergencies, minors and refusals" },
      {
        type: "paragraph",
        text: "In a genuine emergency where delay to obtain consent would endanger life, treatment proceeds without it — the law recognises an implied consent to save a life, and the record must show the emergency, the reason consent was not obtained and what was done. That exception is narrow and it is not a convenience: it ends when the patient can be informed and asked, and it never authorises non-emergency procedures performed while the surgeon is already inside.",
      },
      {
        type: "paragraph",
        text: "For a child, the consent of the parent or guardian is taken, but a mature minor's own agreement is sought and recorded; for a pregnant minor or a survivor of sexual assault who is below eighteen, the special statutes — the Medical Termination of Pregnancy Act and POCSO — control, and the child's own consent for her care is taken with the statutory reporting. An adult with capacity may refuse treatment, even a life-saving treatment, and the refusal is legal and must be documented with the explanation given; the court, not the doctor, weighs a refusal that would end a life.",
      },

      { type: "heading", level: 2, text: "Negligence: the doctrine" },
      {
        type: "table",
        headers: ["Element", "Content", "Illustration"],
        rows: [
          ["Duty", "A doctor-patient relationship exists, or the doctor has assumed care of the patient", "A casual bystander has no duty; a doctor who attends a casualty does"],
          ["Breach of duty", "The care given fell below the standard of a reasonably competent practitioner in that specialty, with the same resources", "This is the Bolam standard; reasonableness of the practice adopted is itself examined"],
          ["Damage", "The breach caused harm that the law recognises", "An injury follows; the claim is for the injury, not for the breach alone"],
          ["Causation", "The damage resulted from the breach, not from the underlying disease or another cause", "The court asks what would have happened had competent care been given"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Res ipsa loquitur — the thing speaks for itself — applies where the event could not have occurred without negligence: a swab or instrument left in the abdomen, amputation of the wrong limb, a transfusion of mismatched blood. In those cases the burden shifts to the doctor to explain.",
      },
      {
        type: "paragraph",
        text: "An error of judgment is not negligence. The law accepts that reasonable doctors differ, and a treatment adopted by a responsible body of professional opinion is not negligent merely because it failed or because another school would have done differently. Negligence lies where the practice adopted is one that no reasonable body of the profession would defend, or where the doctor failed to do what any doctor would have done — examine, monitor, refer, warn. Jacob Mathew versus State of Punjab (2005) is the Indian authority for the criminal version: liability for a doctor in a criminal case requires a degree of negligence amounting to gross negligence or moral turpitude, not mere want of care.",
      },

      { type: "heading", level: 2, text: "Three fora, three consequences" },
      {
        type: "table",
        headers: ["Forum", "What it decides", "Consequence"],
        rows: [
          ["Civil — courts and consumer commissions", "Whether negligence caused damage, and what compensation is due; a doctor's service is a service under the Consumer Protection Act, 2019", "Compensation; no ceiling fixed in law for the quantum"],
          ["Criminal", "Whether the conduct amounts to an offence — for example causing death by negligence under section 106 BNS (formerly section 304A of the Indian Penal Code), or assault where consent was absent", "Imprisonment and fine, on proof beyond reasonable doubt"],
          ["Professional", "Whether there was misconduct under the professional conduct regulations, before the State Medical Council or the NMC Ethics Board", "Censure, temporary removal from the register, or permanent erasure"],
        ],
      },
      {
        type: "paragraph",
        text: "Indian Medical Association versus V P Shantha (1995) is the anchor for the civil liability of doctors as service providers: a patient who pays for care is a consumer, and deficiency in service is actionable. The decision produced years of claims, and with them the practical wisdom that now governs the hospital side of medicine: take consent, document, escalate, and refer rather than attempt what is beyond the available resources.",
      },

      { type: "heading", level: 2, text: "Records and confidentiality" },
      {
        type: "paragraph",
        text: "Records are the doctor's defence and the patient's property in the sense that he is entitled to a copy of his own notes, within a reasonable time of the request. The record must be contemporaneous, timed, signed and complete: entries added later are marked as later and dated, never overwritten. In a negligence claim, the absence of a record is treated as the absence of care — a court will not infer an examination that was never written down.",
      },
      {
        type: "paragraph",
        text: "Confidentiality protects the clinical record and all that the doctor learns in the consulting room. It yields where the patient consents to disclosure, where the law compels it — a court order, statutory notification, the reporting duties of the medico-legal cases — or where the public interest clearly demands it, for example warning an identifiable person at risk. Disclosure to an employer, an insurer or a relative is not public interest; it requires the patient's consent.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Treating a signed form as consent. The form records a conversation; without an explanation of nature, risks and alternatives, the signature proves only that a pen moved.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Assuming every bad outcome is negligence, and settling or apologising accordingly. Outcome is not the test: breach of the standard of care, causation and damage are the elements, and a disease that kills despite perfect care is not a payable claim.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Recording a criminal conviction's absence as the end of the matter. A doctor acquitted in a criminal trial may still face a consumer claim and a disciplinary proceeding on the same facts, because each forum applies a different standard of proof.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why is blanket consent rejected by the courts, and what does valid consent require instead?",
        answer: "Because consent is the patient's right to decide about his own body, procedure by procedure; a blanket authorisation asks him to surrender the decision in advance. Valid consent requires disclosure of the nature, material risks and alternatives of the specific procedure, capacity, voluntariness and an express agreement, recorded.",
        explanation: "The doctrine protects the decision; the signature is only the evidence of it.",
      },
      {
        type: "question",
        prompt: "Distinguish an error of judgment from negligence, with an example of each.",
        answer: "An error of judgment is a reasonable choice among accepted options that turns out badly — choosing surgery over conservative care where both are defensible. Negligence is a failure to reach the standard of the reasonably competent practitioner: operating without the indicated workup, failing to monitor a deteriorating patient, or not referring beyond one's resources.",
        explanation: "The test is not the outcome but the practice adopted, measured against the specialty's accepted body of opinion.",
      },
      {
        type: "question",
        prompt: "A doctor decides against operating and the patient dies. What must the record show for the decision to be defensible?",
        answer: "The assessment made, the options considered, the reasons for not operating — such as comorbidity, futility or the patient's own refusal — and the consultation, referral and monitoring that followed. A defensible decision is a documented, reasoned and communicated one.",
        explanation: "Courts examine the decision as it was recorded at the time; silence in the record is the most expensive omission a doctor can make.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which of these is a valid consent?",
        options: [
          "A blanket authorisation for any procedure the doctor thinks fit",
          "An informed, voluntary agreement to a specific procedure after explanation of its nature, material risks and alternatives, by a patient with capacity",
          "Consent taken while the patient is under sedation for another procedure",
          "Consent given by the patient's employer",
        ],
        correctIndex: 1,
        explanation: "Consent must be informed, voluntary, capacity-based and procedure-specific; blanket forms, sedated agreements and third-party consents are all defective.",
      },
      {
        type: "mcq",
        stem: "The standard of care against which a doctor's conduct is measured is which of the following?",
        options: [
          "The best possible care in the country",
          "The care of a reasonably competent practitioner in that specialty, with the same resources — the Bolam standard",
          "The care the patient subjectively expected",
          "The standard of a superspecialist referral centre",
        ],
        correctIndex: 1,
        explanation: "The test is the reasonable practitioner in the same field with the same resources, and a practice adopted by a responsible body of professional opinion is not negligent merely for failing.",
      },
      {
        type: "mcq",
        stem: "Which of these situations makes res ipsa loquitur applicable?",
        options: [
          "A wound infection after an uncomplicated appendicectomy",
          "A swab left in the abdomen after surgery",
          "A myocardial infarction during a hernia repair",
          "An anaesthetic reaction reported in the consent form",
        ],
        correctIndex: 1,
        explanation: "A retained swab is an event that does not occur without negligence, so the burden shifts to the doctor; the others are recognised complications or diseases.",
      },
      {
        type: "mcq",
        stem: "A surgeon is acquitted in a criminal trial for causing death by negligence. What is the position?",
        options: [
          "No civil or professional claim can follow",
          "A consumer claim for compensation and a disciplinary proceeding may still follow, because the standards of proof differ",
          "The Medical Council must now erase his registration",
          "The criminal verdict is binding on the consumer forum as to compensation",
        ],
        correctIndex: 1,
        explanation: "Criminal guilt requires proof beyond reasonable doubt; civil compensation and professional misconduct need only the balance of probabilities.",
      },
      {
        type: "mcq",
        stem: "Which statement about medical records is correct?",
        options: [
          "Entries may be completed retrospectively and backdated to the day of treatment",
          "Records are contemporaneous, timed and signed; later entries are dated as they are made, because an absence of a record is treated as an absence of care",
          "Records belong to the hospital and the patient has no access",
          "Only the discharge summary matters in a claim",
        ],
        correctIndex: 1,
        explanation: "Contemporaneous, dated records are the defence of the doctor and the entitlement of the patient; retrospective reconstruction is read against its author.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Consent is informed, capacity-based, procedure-specific and recorded; blanket consents are rejected, emergencies are narrow, and capacity is assessed per decision. Negligence requires duty, breach of the Bolam standard, causation and damage, distinguished from an honest error of judgment, and it is answered in three fora — civil compensation, criminal liability under section 106 BNS for negligent death, and professional discipline — each with its own standard of proof. Records and confidentiality complete the structure: write contemporaneously, disclose only on consent, compulsion or a demonstrable public interest.",
      },
      {
        type: "paragraph",
        text: "Next: general toxicology — the principles that apply to every poisoned patient: toxicokinetics, dose-response, decontamination, enhanced elimination and the antidotes that matter.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 10 — General toxicology (fully authored)
// ---------------------------------------------------------------------------
function lesson10() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define toxicology and describe the absorption, distribution, metabolism and excretion of a poison; explain dose-response, threshold dose, therapeutic index and the LD50 concept; state the mechanisms by which common poisons injure cells; recognise the classic toxidromes from the vital signs, pupils, skin and mental state; apply the general management of the poisoned patient — resuscitation first, then decontamination within its window, with the correct specimen preserved for the laboratory; and use the main antidotes, enhanced-elimination methods and chelating agents, each with its indication.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "None of the pathology modules strictly, though Lesson 5 (Post-mortem examination and reports) supplies the sampling and chain-of-custody discipline used for the toxicology specimen.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Toxicology",
        text: "The science of poisons: their source, chemical and physical properties, their kinetics in the body, the nature of the harm they do, the quantitative relationship between dose and effect, their detection, and the treatment of poisoning.",
      },
      {
        type: "paragraph",
        text: "The maxim that organises the subject is Paracelsus's: the dose makes the poison. Botulinum toxin is the most lethal substance known and a licensed cosmetic agent; oxygen is essential and, in excess, a convulsant. Toxicology is therefore quantitative before it is pharmacological — the questions are always how much, by what route, over what period, and what did the body do with it.",
      },

      { type: "heading", level: 2, text: "Toxicokinetics and toxicodynamics" },
      {
        type: "table",
        headers: ["Stage", "What happens", "Clinical significance"],
        rows: [
          ["Absorption", "Entry into the blood across gut, lung, skin or, rarely, a wound; rate depends on lipid solubility, ionisation and concentration", "Determines the onset — inhaled solvents in minutes, corrosives in seconds, heavy metals over days"],
          ["Distribution", "Transport in plasma bound to albumin and distribution into tissues, especially fat, liver, kidney and bone", "Explains delayed toxicity: a fat-soluble poison mobilises from tissue days after ingestion"],
          ["Metabolism", "Conversion in the liver, classically in two phases — oxidation and conjugation; some metabolites are more toxic than the parent compound", "Paracetamol and methanol are examples of safe parents with poisonous metabolites; microsomal enzyme induction changes tolerance"],
          ["Excretion", "Renal for most, with biliary, pulmonary and cutaneous routes for others; pH determines ion trapping", "The target of enhanced elimination: urinary alkalinisation and dialysis both act on the renal step"],
        ],
      },
      {
        type: "table",
        headers: ["Mechanism of injury", "Example"],
        rows: [
          ["Enzyme inhibition", "Organophosphates inhibit acetylcholinesterase, so acetylcholine accumulates; cyanide blocks cytochrome oxidase"],
          ["Interference with oxygen transport", "Carbon monoxide binds haemoglobin; methaemoglobinaemia from nitrites leaves iron in the ferric state"],
          ["Membrane and receptor action", "Digoxin-like glycosides inhibit the sodium-potassium pump; atropine blocks muscarinic receptors"],
          ["Covalent binding to cellular machinery", "Paracetamol depletes glutathione and its metabolite binds hepatocyte proteins"],
          ["Osmotic and corrosive destruction", "Alcohols and strong acids, alkalis destroy tissue directly"],
        ],
      },

      { type: "heading", level: 2, text: "Dose-response and the toxidromes" },
      {
        type: "table",
        headers: ["Term", "Meaning"],
        rows: [
          ["Threshold dose", "The highest dose that produces no detectable effect — the starting point of the dose-response curve"],
          ["Therapeutic index", "The gap between the toxic and the effective dose; a narrow index means a small overdose is dangerous"],
          ["LD50", "The dose that kills half of a tested population — a crude, animal-derived measure now largely replaced by human risk models"],
          ["Cumulation", "A poison whose elimination is slower than its intake, so that the total body burden rises with each dose — lead in bone, digitalis glycosides"],
        ],
      },
      {
        type: "paragraph",
        text: "The toxidrome is the bedside screen: it names the receptor class the poison acts on, and names the antidote with it. Read the pupils, the skin, the gut, the mental state and the vital signs together.",
      },
      {
        type: "table",
        headers: ["Toxidrome", "Recognition", "Examples"],
        rows: [
          ["Cholinergic", "Salivation, lacrimation, urination, diarrhoea, bronchospasm, miosis, bradycardia, sweating; the mnemonic DUMBELS; nicotinic fasciculations and weakness", "Organophosphates, carbamates, nerve agents"],
          ["Anticholinergic", "Dry skin and mouth, flushed, hot, mydriasis, ileus, urinary retention, delirium and picking at clothes — mad as a hatter, dry as a bone", "Datura, atropine, tricyclic antidepressants"],
          ["Opioid", "Pinpoint pupils, coma, respiratory depression, low bowel sounds", "Morphine, heroin, diphenoxylate"],
          ["Sedative-hypnotic", "Coma with preserved pulse and blood pressure, hypothermia, hyporeflexia", "Benzodiazepines, barbiturates, alcohols"],
          ["Sympathomimetic", "Tachycardia, hypertension, mydriasis, sweating, agitation, hyperthermia", "Amphetamines, cocaine"],
          ["Serotonin excess", "Clonus, hyperreflexia, tremor, fever, diarrhoea", "Serotonin reuptake inhibitor overdoses in combination"],
        ],
      },

      { type: "heading", level: 2, text: "Decontamination" },
      {
        type: "table",
        headers: ["Method", "Window and use", "Cautions"],
        rows: [
          ["Skin and eye decontamination", "Immediately for corrosives, organophosphates and solvents; remove contaminated clothing first and flush with water or saline", "Brush dry powders off before wetting; never scrub with a solvent on skin"],
          ["Activated charcoal", "Within about one to two hours of ingestion, dose one gram per kilogram of body weight; multiple-dose regimens for carbamazepine, theophylline, dapsone, quinine and phenobarbitone", "Ineffective for metals, alcohols, corrosives and hydrocarbons; dangerous if the airway is unprotected; no benefit after the window"],
          ["Gastric lavage", "Rarely, within about one to four hours and with the airway protected", "Contraindicated in corrosives and hydrocarbon ingestion; must never be a reflex in every poisoning"],
          ["Whole bowel irrigation", "Iron, lithium, lead packets and body packers", "Requires a protected airway and close monitoring of fluid balance"],
          ["Emesis and cathartics", "No longer recommended in routine practice", "Syrup of ipecacuanha has been withdrawn from use; cathartics disturb electrolytes without improving outcome"],
        ],
      },

      { type: "heading", level: 2, text: "Enhanced elimination and chelation" },
      {
        type: "table",
        headers: ["Method", "Indications"],
        rows: [
          ["Urinary alkalinisation", "Salicylate and phenobarbitone poisoning — infuse sodium bicarbonate to hold the urine pH near 7.5 to 8.5 and trap the ionised drug in the urine"],
          ["Haemodialysis", "Methanol and ethylene glycol, lithium, salicylate in the severely ill, metformin-associated lactic acidosis, and any water-soluble poison with severe systemic toxicity"],
          ["Haemoperfusion", "Rarely used now; historically theophylline and barbiturates"],
          ["Exchange transfusion", "Neonatal and infant poisoning where dialysis access is impracticable"],
        ],
      },
      {
        type: "table",
        headers: ["Metal", "Chelator", "Notes"],
        rows: [
          ["Lead", "Calcium disodium edetate, succimer (DMSA); dimercaprol in encephalopathy", "Remove the source first; encephalopathy is treated before the chelator to avoid redistribution into the brain"],
          ["Arsenic, inorganic mercury", "Succimer or dimercaprol, D-penicillamine for arsenic", "Organic mercury is not chelated by dimercaprol — the agent matters"],
          ["Iron", "Desferrioxamine", "Titrate to the pink urine; the infusion is continued until the iron is bound"],
          ["Copper", "D-penicillamine", "Wilson disease and ingestion"],
          ["Thallium", "Prussian blue, with multi-dose charcoal", "Binds thallium in the gut and interrupts enterohepatic recycling"],
        ],
      },

      { type: "heading", level: 2, text: "Antidotes worth knowing" },
      {
        type: "table",
        headers: ["Toxin", "Antidote and principle"],
        rows: [
          ["Opioids", "Naloxone, titrated to respiratory rate — a pure antagonist at the mu receptor; repeat in 2-3 minute increments because it is short acting"],
          ["Organophosphates", "Atropine, titrated to drying of the bronchial secretions, plus pralidoxime, which re-activates the cholinesterase"],
          ["Paracetamol", "N-acetylcysteine, which replenishes glutathione; most effective within eight hours"],
          ["Benzodiazepines", "Flumazenil — used sparingly, because in a mixed overdose or a dependent patient it precipitates convulsions"],
          ["Tricyclic antidepressants", "Sodium bicarbonate for a wide QRS, targeting narrowing of the complex"],
          ["Cyanide", "Hydroxocobalamin to bind cyanide, or the nitrite-thiosulphate sequence to induce methaemoglobin and then convert cyanide to thiocyanate"],
          ["Methanol, ethylene glycol", "Fomepizole, or ethanol as a substitute, both competitive inhibitors of alcohol dehydrogenase"],
          ["Beta-blockers", "Glucagon and high-dose insulin euglycaemia, bypassing the blocked receptor"],
          ["Local anaesthetic systemic toxicity", "Twenty per cent lipid emulsion, which partitions the drug out of the myocardium"],
          ["Cardiac glycosides", "Digoxin-specific antibody fragments, and correction of potassium without calcium in the acute overdose"],
          ["Carbon monoxide", "One hundred per cent oxygen; hyperbaric oxygen for the selected severe case"],
          ["Snake venom", "Polyvalent anti-snake venom, dosed to the clinical response"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Antidotes are few, and resuscitation is nearly everything. Airway, breathing, circulation, then glucose and thiamine for the coma of unknown cause, then naloxone, then the decontamination, then the antidote — in that order — while the laboratory sample is being collected and sent.",
      },

      { type: "heading", level: 2, text: "The specimen" },
      {
        type: "paragraph",
        text: "Every poisoned patient, alive or dead, is a potential toxicology case. In the living patient, collect blood and urine at presentation before any antidote or charcoal alters the picture: ten millilitres of blood into sodium fluoride and potassium oxalate, and a clean urine sample, both labelled with the time of collection. In the dead body the protocol of Lesson 5 applies — stomach contents, bowel, liver, kidney, spleen and blood preserved according to the suspected poison. The results are interpreted together with the clinical picture: a concentration alone is not a diagnosis, and a therapeutic concentration does not exclude a death caused by the same drug.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Beginning with an antidote and a lavage while the patient is still hypoxic and hypotensive. Resuscitation precedes everything; a lavage in an unprotected airway kills more patients than poisons do.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Giving charcoal reflexively after the window has closed, or in a corrosive ingestion where it obscures the endoscopy and adds risk. The method has a window and a contraindication list like any other.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Relying on a drug screen to make the diagnosis. Screens detect what they are designed to find and miss newer agents; the toxidrome, the history and the clinical course lead, and the laboratory confirms.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does a fat-soluble poison cause toxicity days after exposure, and which method of elimination exploits ion trapping?",
        answer: "Because it is stored in adipose tissue and mobilises slowly back into the blood after the exposure is over — which is why a fat-soluble poison appears late. Alkalinisation of the urine exploits ion trapping: a weak acid ionised in alkaline urine cannot be reabsorbed and is excreted faster.",
        explanation: "Distribution explains delayed toxicity; elimination engineering explains the treatment of the reversible ones.",
      },
      {
        type: "question",
        prompt: "State the order of priorities in the unconscious poisoned patient.",
        answer: "Airway with cervical spine care, ventilation and oxygenation, circulation, then blood glucose and thiamine, then naloxone where opioid toxidrome is present, then decontamination where the window permits, then the specific antidote and the toxicology episode care.",
        explanation: "The antidote is the last small step; the support is the treatment.",
      },
      {
        type: "question",
        prompt: "Why is activated charcoal useless in an alcohol ingestion?",
        answer: "Because alcohol is a small, rapidly absorbed, water-soluble molecule that is not adsorbed onto charcoal's surface; the same applies to metals and to corrosives, for which charcoal adds risk without benefit.",
        explanation: "Charcoal works by adsorbing larger organic molecules within the gut lumen; size and solubility decide the candidate.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A patient has salivation, lacrimation, urination, diarrhoea, miosis, bronchospasm and sweating. Which toxidrome and which antidote class?",
        options: [
          "Anticholinergic; physostigmine",
          "Cholinergic; atropine with pralidoxime",
          "Opioid; naloxone",
          "Sympathomimetic; benzodiazepines",
        ],
        correctIndex: 1,
        explanation: "The picture is the DUMBELS cholinergic toxidrome of organophosphate poisoning; the treatment is atropine titrated to dry secretions plus an oxime to re-activate cholinesterase.",
      },
      {
        type: "mcq",
        stem: "Activated charcoal is indicated in which of these?",
        options: [
          "A patient who drank a litre of strong hydrochloric acid",
          "A patient who swallowed a tricyclic antidepressant within the last hour",
          "A patient with petroleum distillate aspiration risk",
          "A patient with an iron or a lithium overdose",
        ],
        correctIndex: 1,
        explanation: "Charcoal adsorbs many organic drugs within about one to two hours; corrosives, hydrocarbons and metals such as iron or lithium are not adsorbed.",
      },
      {
        type: "mcq",
        stem: "Which pair matches poison with antidote correctly?",
        options: [
          "Paracetamol and naloxone",
          "Methanol and fomepizole",
          "Opioid and flumazenil",
          "Carbon monoxide and hydroxocobalamin",
        ],
        correctIndex: 1,
        explanation: "Fomepizole inhibits alcohol dehydrogenase and blocks the formation of formic acid in methanol poisoning; the pairings in the other options are mismatched.",
      },
      {
        type: "mcq",
        stem: "Enhanced elimination by urinary alkalinisation is best established for which poison?",
        options: ["Digoxin", "Salicylate", "Iron", "Lead"],
        correctIndex: 1,
        explanation: "Salicylate is a weak acid that becomes ion-trapped in alkaline urine; the others require chelation, digoxin-specific antibodies or dialysis.",
      },
      {
        type: "mcq",
        stem: "In the unconscious poisoned patient, what comes first?",
        options: [
          "Gastric lavage with a wide-bore tube",
          "Airway, breathing and circulation",
          "The specific antidote",
          "The toxicology screen on the blood sample",
        ],
        correctIndex: 1,
        explanation: "The ABC comes before every decontamination or antidote; a lavage on an unprotected airway is the classic lethal error.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Toxicology is quantitative: absorption, distribution, metabolism and excretion decide how much poison reaches which tissue and when, and the dose-response concepts of threshold, therapeutic index and cumulation decide whether a substance is a medicine or a poison. The clinical approach reads the toxidrome, resuscitates on the ABCDE sequence, decontaminates within its window, applies the few genuine antidotes, and enhances elimination where the poison's properties allow — always with the specimen collected and sealed before treatment distorts it.",
      },
      {
        type: "paragraph",
        text: "Next: clinical toxicology — the poisonings actually met in India, from organophosphates and corrosives to aluminium phosphide, snakebite and the metals, each with its recognition pattern and its specific management.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 11 — Clinical toxicology & poisoning (fully authored)
// ---------------------------------------------------------------------------
function lesson11() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: recognise organophosphate and carbamate poisoning by the cholinergic toxidrome and manage it with decontamination, atropine titrated to the secretions, and pralidoxime; distinguish acid from alkali corrosives and manage them without lavage or charcoal, with endoscopy and watch for the late stricture; distinguish the acute features and specific treatments of ethanol, methanol and ethylene glycol poisoning; give the sequence for paracetamol poisoning and the indications for transplant referral; recognise the classic plant and household poisonings of India — oleander, nux vomica, datura, Abrus, aluminium phosphide; and differentiate neurotoxic from haemotoxic snakebite, perform the twenty-minute clotting test, and dose anti-snake venom with readiness for anaphylaxis.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 10 (General toxicology). You need the toxicokinetic principles, the toxidromes and the decontamination and antidote framework that the specific poisonings below instantiate.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "paragraph",
        text: "There are a few hundred poisonings and about a dozen that fill an Indian ward. Each of the common ones has a recognition pattern written in the pupils, the secretions, the breath, the abdomen or the blood count — learn the pattern and the treatment follows. The order is always the same: recognise, resuscitate, decontaminate within the window, antidote, and collect the specimen before the treatment has altered it.",
      },

      { type: "heading", level: 2, text: "Organophosphates and carbamates" },
      {
        type: "paragraph",
        text: "Organophosphate insecticides — malathion, parathion, chlorpyrifos, diazinon, dimethoate — and carbamates such as carbaryl inhibit acetylcholinesterase, so acetylcholine accumulates at muscarinic and nicotinic synapses. They are absorbed through the gut, the lungs and the intact skin; attendants who handle a contaminated patient without protection become poisoned themselves.",
      },
      {
        type: "table",
        headers: ["Receptor group", "Effects"],
        rows: [
          ["Muscarinic", "Salivation, lacrimation, urination, diarrhoea, gastrointestinal cramps, emesis, miosis, bradycardia, bronchorrhoea and bronchospasm, sweating — the DUMBELS mnemonic"],
          ["Nicotinic", "Fasciculations, cramping, weakness and paralysis; tachycardia early and hypertension"],
          ["Central", "Headache, anxiety, confusion, convulsions, coma and respiratory-centre depression"],
        ],
      },
      {
        type: "paragraph",
        text: "Management: remove all clothing, wash the skin with soap and water, protect the attendants, and treat secretions aggressively. Atropine is titrated by bolus — typically two milligrams intravenously every three to five minutes — until the chest is clear and dry, the pupils dilated and the heart rate up; tens or even hundreds of milligrams may be needed in a day. Pralidoxime re-activates the enzyme, given as a loading dose of about thirty milligrams per kilogram over thirty minutes then a continuous infusion, and it works best before the enzyme ages irreversibly, so it is started early. Diazepam controls agitation and convulsions. Two later syndromes follow: the intermediate syndrome, with proximal weakness and respiratory failure twenty-four to ninety-six hours after the acute phase, and a delayed polyneuropathy weeks after exposure. Carbamate poisoning is the shorter illness, and the place of pralidoxime in it is debated.",
      },

      { type: "heading", level: 2, text: "Corrosives" },
      {
        type: "table",
        headers: ["", "Acids", "Alkalis"],
        rows: [
          ["Agents", "Sulphuric acid — charring and blackening; nitric acid — yellow staining; hydrochloric acid", "Sodium and potassium hydroxide, ammonium hydroxide; ammonia in household cleaners"],
          ["Tissue effect", "Coagulative necrosis with an eschar that limits penetration", "Liquefactive necrosis that penetrates deeply; saponification of fat"],
          ["Site", "Stomach — the pylorus and antrum — with a scorched, coagulated mucosa; the oesophagus is relatively spared", "Oesophagus and pharynx predominantly, with the stomach also; alkalis are odourless and tasteless, so they are swallowed in volume"],
          ["Clinical", "Burns of the lips and mouth, drooling, dysphagia, chest and epigastric pain; airway oedema", "The same, with a greater risk of perforation and of later stricture"],
        ],
      },
      {
        type: "paragraph",
        text: "Management is deceptively simple and often done badly. There is no emesis, no lavage and no activated charcoal; neutralisation is not attempted, because the reaction generates heat and gas; nothing is given by mouth until the airway and the extent are known. Airway assessment comes first, then intravenous fluids for the systemic capillary leak, then endoscopy within twelve to twenty-four hours to grade the injury. Deep circumferential burns and high-grade injuries are managed with steroids, antibiotics as indicated, and nutritional support; survivors are followed for the stricture that forms at six to eight weeks. The samples of the vomitus and the container go to the laboratory with the history of the exact agent.",
      },

      { type: "heading", level: 2, text: "Alcohols" },
      {
        type: "table",
        headers: ["Agent", "Acute features", "Specific treatment"],
        rows: [
          ["Ethanol", "Stimulation then depression: smell, flushing, ataxia, coma and respiratory depression; hypoglycaemia in a child or a malnourished drinker; Wernicke encephalopathy and delirium tremens in the chronic drinker", "Supportive care; thiamine before any glucose in the chronic drinker; for chronic dependence, a benzodiazepine regimen against withdrawal seizures"],
          ["Methanol", "A latent period of hours with inebriation, then headache, visual blurring and blindness from formic acid, abdominal pain and a high-anion-gap metabolic acidosis", "Fomepizole or ethanol as competitive inhibitors of alcohol dehydrogenase; sodium bicarbonate for severe acidosis; haemodialysis for visual disturbance, a high formate level or refractory acidosis"],
          ["Ethylene glycol", "Neurological intoxication, then flank pain and acute kidney injury from glycolate and oxalate, with calcium oxalate crystals in the urine", "Fomepizole or ethanol; calcium for symptomatic hypocalcaemia; haemodialysis for acidosis and renal failure"],
        ],
      },

      { type: "heading", level: 2, text: "Common drug overdoses" },
      {
        type: "table",
        headers: ["Drug", "Recognition and treatment"],
        rows: [
          ["Paracetamol", "Silent for the first day; then right-upper-quadrant pain, transaminase rise, jaundice and hepatic failure. A four-hour level on the treatment nomogram and N-acetylcysteine — 150 mg/kg over an hour, then 50 mg/kg over four hours, then 100 mg/kg over sixteen hours — started within eight hours is protective; refer early for transplant where encephalopathy, coagulopathy, acidosis and renal failure declare"],
          ["Salicylate", "Tinnitus, deafness, tachypnoea with a mixed respiratory alkalosis and metabolic acidosis, hyperthermia and hypoglycaemia; treat with urinary alkalinisation and haemodialysis for severe toxicity"],
          ["Iron", "Haematemesis and shock in stage one, an apparent recovery, then shock, acidosis and hepatotoxicity in stage two; tablets are radiopaque on the abdominal film and desferrioxamine is the antidote"],
          ["Metformin", "Lactic acidosis with high lactate and low bicarbonate, especially in renal failure or after contrast; treat with dialysis for severe acidosis"],
          ["Opioids", "Pinpoint pupils, coma, respiratory depression; naloxone titrated to breathing, not to full arousal"],
          ["Benzodiazepines", "Coma with preserved vital signs; supportive care, with flumazenil reserved and used sparingly because it precipitates convulsions in the dependent or mixed overdose"],
          ["Tricyclic antidepressants", "Anticholinergic dryness, wide QRS, seizures, arrhythmias; sodium bicarbonate for a wide complex, and benzodiazepines for convulsions"],
        ],
      },

      { type: "heading", level: 2, text: "Metals and the household poisons of India" },
      {
        type: "table",
        headers: ["Poison", "Recognition"],
        rows: [
          ["Lead", "Abdominal colic, constipation, anaemia with basophilic stippling, a motor wrist drop, a blue line on the gums; chronic exposure in children causes encephalopathy and developmental harm — sources include paint, solder, batteries, kohl and traditional remedies"],
          ["Arsenic", "Acute: profuse watery diarrhoea and vomiting, garlicky breath, shock; chronic: raindrop pigmentation, palmar and plantar keratosis, Mees lines on the nails, neuropathy and skin cancers — the classic homicidal and contaminated-water poison"],
          ["Mercury", "Inorganic: metallic taste, gingivitis, tremor and nephropathy; organic methylmercury: paraesthesiae, ataxia, constricted vision — the Minamata pattern"],
          ["Thallium", "Painful neuropathy followed in weeks by total alopecia, with Mees lines — a slow, dramatic and easily missed poisoning"],
          ["Oleander, the kaner", "Cardiac glycosides in every part of the plant: nausea, hyperkalaemia, bradyarrhythmias and ventricular irritability; managed like digoxin poisoning with antibodies, keeping calcium out of the acute regimen"],
          ["Nux vomica — strychnine", "Convulsions with full consciousness between, risus sardonicus and opisthotonus, triggered by any stimulus; treated with benzodiazepines in a quiet, darkened room — the sensorium stays clear, which distinguishes it"],
          ["Datura", "Anticholinergic delirium with dry mouth, flushed skin, mydriasis and retention; physostigmine in severe cases, and the seeds are found in the vomitus"],
          ["Abrus precatorius — the ratti", "Seeds chewed or injected: severe haemorrhagic gastroenteritis, convulsions, cerebral oedema; abrin is one of the most lethal toxins known and treatment is supportive"],
          ["Aluminium phosphide — celphos", "A tablet that liberates phosphine on contact with moisture: garlic breath, refractory shock, metabolic acidosis and myocardial injury; mortality is high and treatment is early gastric decontamination under protection, magnesium sulphate and aggressive support"],
          ["Kerosene and other hydrocarbons", "Coughing and choking, and hydrocarbon pneumonitis with hypoxaemia hours later; no lavage and no emesis, because aspiration is the danger"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Aluminium phosphide deserves its reputation: it is cheap, freely sold as a grain fumigant, and the exhaled phosphine poisons the staff and the attendants. The first doctor's duty in such a case is to move everyone into fresh air — the patient, the relatives who carried the body, and the ward itself.",
      },

      { type: "heading", level: 2, text: "Snakebite" },
      {
        type: "table",
        headers: ["", "Neurotoxic — cobra, krait", "Haemotoxic — vipers"],
        rows: [
          ["Local signs", "Minimal or none; the krait bite is often painless and nocturnal", "Swelling, pain, ecchymosis and bullae spreading from the site"],
          ["Systemic", "Ptosis, ophthalmoplegia, slurred speech, pooled secretions, respiratory paralysis; the krait causes abdominal pain and no local signs", "Bleeding gums, haematemesis, haematuria, shock, haemolysis and acute kidney injury"],
          ["Test", "No bedside test for venom; the clinical syndrome decides", "The twenty-minute whole blood clotting test: 2 ml of venous blood left in a glass tube for twenty minutes — non-clotting indicates viper envenomation and consumption coagulopathy"],
          ["Treatment", "Antivenom, ventilation where paralysis develops, and neostigmine with atropine as an adjunct in cobra bite", "Antivenom as soon as the clotting test is positive, with blood components for ongoing bleeding and renal support"],
        ],
      },
      {
        type: "paragraph",
        text: "Polyvalent anti-snake venom is given on clinical grounds: a progressive neurotoxic syndrome, or a positive clotting test with systemic bleeding or shock. The usual initial dose is ten vials — one hundred millilitres — infused over about thirty minutes, repeated if the syndrome does not improve; a further dose of five to ten vials follows where the response is incomplete. Anaphylaxis to the antivenom is common and is treated with adrenaline, chlorpheniramine and hydrocortisone, with every vial given in a monitored bed; the older practice of a small test dose has been abandoned. Serum sickness appears one to three weeks later with urticaria, fever and joint pain, and it responds to antihistamines and steroids. Every snakebite death is a medico-legal case, reported to police under the statutory duty.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Stopping atropine when the pupils dilate but the chest is still wet. The end-point is dry, clear secretions — the pupils are the guide, the airway is the target.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Lavage, charcoal or neutralisation in a corrosive ingestion. All three add thermal and mechanical injury, and the endoscopy is the investigation that matters.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Waiting for local swelling to diagnose a krait bite, or for paralysis to confirm a cobra. The krait bites painlessly at night and the abdomen aches; the syndrome, not the fang marks, decides.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "How is the atropine end-point decided in organophosphate poisoning, and why do large cumulative doses matter?",
        answer: "Atropine is titrated until the bronchial secretions are dry, the chest is clear, the pupils are widely dilated and the heart rate is up. Large cumulative doses are safe in organophosphate poisoning because atropine reverses a muscarinic blockade of the respiratory tract before it reaches anticholinergic toxicity — so the usual textbook dose limits do not apply.",
        explanation: "Underdosing atropine to avoid a mydriasis is the classic reason for a preventable death in these cases.",
      },
      {
        type: "question",
        prompt: "Why is the twenty-minute whole blood clotting test decisive in snakebite management?",
        answer: "Because viper venom defibrinates the blood: two millilitres of venous blood in a clean glass tube that fails to clot within twenty minutes establishes consumption coagulopathy and is an indication for antivenom in a haemotoxic bite, while a neurotoxic bite leaves clotting intact.",
        explanation: "The test is cheap, bedside and immediate; a positive test in a shocked or bleeding patient triggers antivenom without waiting for the laboratory.",
      },
      {
        type: "question",
        prompt: "Why does methanol poisoning take hours to declare itself, while ethanol declares itself at once?",
        answer: "Ethanol acts directly and is excreted unchanged in breath and urine; methanol is converted by alcohol dehydrogenase to formaldehyde and formate, which obstruct cytochrome oxidase and cause acidosis and optic-nerve injury only as the metabolite accumulates — hence the latent period and the value of blocking the enzyme with fomepizole.",
        explanation: "Toxicokinetics explains the whole management: block the conversion, correct the acidosis, and remove the metabolite by dialysis.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A farmer is brought frothing, with pinpoint pupils, fasciculations and a garlicky smell. Which treatment sequence is correct?",
        options: [
          "Lavage, then charcoal, then observe",
          "Remove clothing, wash the skin, then atropine titrated to dry secretions with pralidoxime, protecting the attendants",
          "Naloxone titrated to respiratory rate",
          "Physostigmine with benzodiazepines",
        ],
        correctIndex: 1,
        explanation: "This is organophosphate poisoning: decontamination to protect all hands, and atropine titrated to a dry chest plus an oxime.",
      },
      {
        type: "mcq",
        stem: "After drinking a strong alkali, which of these must not be done?",
        options: [
          "Secure the airway and give fluids",
          "Perform endoscopy at twelve to twenty-four hours",
          "Attempt neutralisation and pass a gastric lavage tube",
          "Watch for the stricture at six to eight weeks",
        ],
        correctIndex: 2,
        explanation: "Neutralisation generates heat and lavage risks perforation in a deep, liquefactive burn; both are proscribed.",
      },
      {
        type: "mcq",
        stem: "A patient with methanol poisoning has blurred vision and a high-anion-gap acidosis. Which antidote blocks the formation of formate?",
        options: ["Naloxone", "Fomepizole", "N-acetylcysteine", "Atropine"],
        correctIndex: 1,
        explanation: "Fomepizole — or ethanol as a fallback — competitively inhibits alcohol dehydrogenase, preventing the conversion of methanol to its toxic metabolites.",
      },
      {
        type: "mcq",
        stem: "A nocturnal painless bite, abdominal pain, ptosis and respiratory failure with no local swelling is most consistent with:",
        options: ["A viper", "A krait", "A scorpion", "A bee sting"],
        correctIndex: 1,
        explanation: "The krait bites painlessly at night and causes neurotoxicity with abdominal pain but minimal local signs; vipers cause local swelling and bleeding.",
      },
      {
        type: "mcq",
        stem: "A patient with oleander ingestion has bradycardia, hyperkalaemia and ventricular irritability. Which element must be avoided in the acute regimen?",
        options: ["Intravenous fluids", "Digoxin-specific antibody fragments", "Calcium salts", "Atropine"],
        correctIndex: 2,
        explanation: "Cardiac glycoside poisoning is treated with antibodies; calcium is withheld in acute digitalis toxicity because it worsens intracellular calcium and arrhythmia.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The common Indian poisonings each carry a pattern: the cholinergic toxidrome of organophosphates with atropine titrated to a dry chest and pralidoxime; the deep liquefactive injury of alkalis managed by endoscopy and weeks of stricture watch; the latent acidosis and blindness of methanol blocked by fomepizole; the silent hepatic failure of paracetamol rescued by N-acetylcysteine; the convulsions with a clear sensorium of strychnine; the refractory shock of aluminium phosphide; and the two faces of snakebite — neurotoxic cobra and krait, haemotoxic viper — diagnosed by syndrome and the twenty-minute clotting test and treated with antivenom given in a monitored bed.",
      },
      {
        type: "paragraph",
        text: "Next: environmental and analytical toxicology — how exposure is measured in the community, how a poison is detected in the laboratory, and how a toxicology report is read by a court.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 12 — Environmental & analytical toxicology (fully authored)
// ---------------------------------------------------------------------------
function lesson12() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe environmental and occupational exposure by route — air, water, food and soil — and the diseases each produces; state the public-health thresholds and effects for fluoride, arsenic, nitrate, lead and the criteria air pollutants; recognise the food adulterants that cause outbreaks and how they are detected; describe the occupational dust diseases and the Bhopal gas disaster as a lesson in industrial toxicology; explain the analytical methods used in a forensic toxicology laboratory and the specimen each suits; and interpret a toxicology report in court, including postmortem redistribution, the limits of detection, and the adverse inference that a withheld report attracts.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 10 and 11. You need the toxicokinetic principles and the common poisonings whose residues the analytical laboratory now detects.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Environmental toxicology",
        text: "The study of poisons to which a population is exposed through air, water, food, soil and work — measured as concentrations in the environment and as biomarkers in people, and translated into regulations and public-health action.",
      },
      {
        type: "paragraph",
        text: "The patient in front of the doctor is a sample of the environment he lives in. The same compound may appear as an acute poisoning in one ward, a cluster of peripheral neuropathy in a village, and a raised blood-lead level in a screening programme — and the doctor is the point at which all three are recognised and reported.",
      },

      { type: "heading", level: 2, text: "Air, water and food" },
      {
        type: "table",
        headers: ["Medium", "Exposures of consequence", "Health effects"],
        rows: [
          ["Air", "Particulate matter PM2.5 and PM10, sulphur dioxide, nitrogen oxides, ozone, carbon monoxide, indoor biomass smoke", "Lower respiratory infection in children, aggravated asthma and chronic bronchitis, ischaemic heart disease and stroke, lung cancer; indoor smoke is among the largest single health burdens in the world"],
          ["Water", "Fluoride above about 1.5 milligrams per litre; arsenic in groundwater; nitrate above about 45 milligrams per litre; lead from pipes and solder", "Dental and skeletal fluorosis, with crippling deformity at high doses; arsenicosis with pigmentation, keratosis, neuropathy and skin and internal cancers; methaemoglobinaemia in infants; lead encephalopathy and anaemia"],
          ["Food", "Pesticide residues, argemone oil in mustard oil, lead chromate in turmeric, metanil yellow dyes, melamine in milk, urea and detergent in milk", "Epidemic dropsy — oedema, diarrhoea and cardiac failure from argemone; lead poisoning from colourants; renal injury from melamine; food-borne outbreaks of infection and staphylococcal toxin"],
          ["Soil", "Industrial contamination, untreated effluent, mine tailings", "Groundwater contamination, uptake into crops, and chronic exposure of agricultural communities"],
        ],
      },
      {
        type: "paragraph",
        text: "Two of these are classics of Indian epidemiology. Epidemic dropsy is traced to argemone oil adulterating mustard oil — the sanguinarine alkaloids cause capillary leak, diarrhoea, glaucoma and heart failure, and outbreaks are recognised when a whole family develops pedal oedema after a shared batch of oil. Lead chromate in turmeric colours the spice vividly and quietly delivers lead to whole households — the same metal that in children impairs brain development without any dramatic symptom at all.",
      },
      {
        type: "question",
        prompt: "A whole family in a village develops pedal oedema, diarrhoea and breathlessness after a wedding feast, and the common exposure is mustard oil from one batch. What is the likely adulterant and the mechanism?",
        answer: "Argemone oil: sanguinarine alkaloids cause capillary leakage and systemic oedema, with diarrhoea, glaucoma and high-output cardiac failure. The outbreak pattern is the diagnosis — the shared food, the latency of days and the capillary-leak syndrome.",
        explanation: "Recognition turns an isolated oedematous case into an outbreak investigation, and the sample of oil goes to the food laboratory.",
      },

      { type: "heading", level: 2, text: "Occupational toxicology" },
      {
        type: "table",
        headers: ["Exposure", "Disease", "Regulatory note"],
        rows: [
          ["Silica dust", "Silicosis — nodular fibrosis that progresses even after exposure stops, predisposing to tuberculosis", "Notification and compensation as an occupational disease"],
          ["Asbestos", "Asbestosis, pleural plaques, mesothelioma and bronchial carcinoma — the latency measured in decades", "Import restrictions and safe-removal rules"],
          ["Cotton dust", "Byssinosis — chest tightness on the first day back after the weekend", "Dust control in mills"],
          ["Coal mine dust, iron oxide", "Coal workers' pneumoconiosis and siderosis", "Surveillance with periodic chest films"],
          ["Lead, cadmium, mercury, chromium, arsenic, benzene", "Anaemia and neuropathy; renal tubular disease; cancers including leukaemia from benzene", "Biological monitoring — blood lead, urine arsenic and mercury — against exposure limits"],
          ["Methyl isocyanate", "The Bhopal disaster of December 1984, when a gas release exposed hundreds of thousands and killed thousands acutely, with chronic ocular and respiratory disease in survivors", "The case that taught disaster planning, community right-to-know and medical surveillance around industry"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The Bhopal disaster is the Indian lesson in industrial toxicology: the acute toxidrome was pulmonary and ocular injury from a volatile irritant gas, but the long-term harm was chronic lung and eye disease among exposed residents. Disaster response requires mass triage, decontamination at the gate, and a registry for the surviving cohort — not only casualty treatment.",
      },

      { type: "heading", level: 2, text: "The analytical laboratory" },
      {
        type: "paragraph",
        text: "Forensic toxicology turns tissue into evidence. The chain of custody of Lesson 5 governs every step, the specimen selection decides what can be found, and the method chosen must match the chemistry of the suspected poison.",
      },
      {
        type: "table",
        headers: ["Method", "Principle", "Typical use"],
        rows: [
          ["Colour and spot tests", "A reagent produces a characteristic colour or precipitate", "Presumptive screening — the Reinsch test deposits copper on a foil from a heavy-metal solution; TLC separates and stains drugs"],
          ["Thin-layer chromatography", "Separation on a plate with a comparison of movement to reference compounds", "Qualitative screening for drugs and pesticides"],
          ["Ultraviolet-visible spectrophotometry", "Absorbance at a wavelength characteristic of the analyte", "Paracetamol, salicylate and methaemoglobin levels"],
          ["Gas chromatography", "Volatilisation and separation in a column; an electron-capture detector is highly sensitive to halogenated compounds", "Blood alcohol, volatile solvents, organochlorine pesticides"],
          ["Gas chromatography with mass spectrometry", "The chromatogram is matched against a library of mass spectra", "The confirmatory standard for drugs, pesticides and volatiles"],
          ["High-performance liquid chromatography", "Liquid-phase separation for substances that do not volatilise", "Non-volatile drugs, toxic alcohols and metabolites"],
          ["Atomic absorption and inductively coupled plasma spectroscopy", "Element-specific absorption or emission", "Blood lead, urine and hair arsenic, cadmium and mercury"],
          ["Immunoassay", "Antibody-antigen binding gives a positive or negative screen", "Drugs of abuse and some pharmaceuticals in urine"],
        ],
      },
      {
        type: "paragraph",
        text: "Interpretation is where reports are won and lost. A positive laboratory result is a statement that the substance was present in the specimen at the measured concentration — nothing more. The expert must then combine it with the clinical picture, the timing, the dose of treatment given, and the postmortem redistribution that raises heart-blood concentrations of some drugs above the peripheral levels they were in life. For that reason, the femoral blood drawn from the leg is preferred in a postmortem for drug quantitation, and where the two differ, the peripheral sample is the truer record of the premortem concentration.",
      },

      { type: "heading", level: 2, text: "Reading a toxicology report" },
      {
        type: "table",
        headers: ["Question", "How it is answered"],
        rows: [
          ["What was found, and in which specimen?", "The report names the analyte, the concentration, the specimen and the method — blood, urine, viscera or hair each answers a different time-window"],
          ["Could this concentration have produced the clinical picture?", "Interpreted against published toxic ranges, with age, tolerance, disease and co-ingestants"],
          ["Was it a therapeutic dose, an overdose, or an environmental level?", "The clinical setting decides; a therapeutic paracetamol concentration in a trauma death excludes paracetamol as the cause"],
          ["What can the report not say?", "Detoxified metabolites, gases no longer present, and agents never sought; a negative report excludes only what was tested for"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Detection is not causation. A residue of a pesticide in liver tissue does not explain a death that the autopsy has otherwise accounted for; the first duty of the expert is to read the autopsy and the clinical notes, and then to ask whether the concentration fits the story.",
      },
      {
        type: "paragraph",
        text: "There is also a legal consequence to a withheld report. Where the prosecution does not produce the forensic laboratory's report, or the defence is denied the opportunity to have the sample retested, the court is entitled to draw an adverse inference against the party who withheld it. The sampling discipline of the autopsy table — sealed jars, labelled contents, described seals and receipted dispatch — is what preserves the sample's availability for that retest.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Treating blood taken from the heart at autopsy as an honest premortem concentration. Postmortem redistribution raises drug levels in blood from the great vessels; the leg blood is the more faithful sample, and the report should say which was used.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Concluding from a negative screen that there was no poisoning. Screens are panels, not omniscience; an agent outside the panel, or one already metabolised, is invisible to it.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Filing an environmental exposure as an odd individual case instead of a cluster. Several households with the same symptom and the same water source or the same food batch is an outbreak, and it must be reported to the public-health authority.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why is femoral blood preferred to cardiac blood for postmortem drug measurement?",
        answer: "Because postmortem redistribution from the organs raises concentrations in the blood of the great vessels and heart above the levels that were circulating before death; the leg blood is further from that redistribution and closer to the premortem peripheral concentration.",
        explanation: "The choice of site must be recorded, and where a comparison is possible the peripheral sample is the more conservative one.",
      },
      {
        type: "question",
        prompt: "What is the minimum drinking-water level below which endemic fluorosis is not expected, and what does exceedance produce?",
        answer: "About 1.5 milligrams of fluoride per litre. Above it, dental fluorosis in children and, with higher loads and longer exposure, skeletal fluorosis with joint pain, rigidity and deformity.",
        explanation: "The threshold also marks the intervention — defluoridation or an alternative source — for the affected villages.",
      },
      {
        type: "question",
        prompt: "What inference may a court draw when the chemical examiner's report is not produced?",
        answer: "An adverse inference against the party who suppressed the evidence, and the loss of the opportunity for the defence sample to be independently retested; the seal and custody record is what allows the retest to exist at all.",
        explanation: "The audit trail from the autopsy table is what keeps the evidence available to both sides.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Lead chromate adulteration of a spice is classically associated with which public-health problem?",
        options: ["Epidemic dropsy", "Lead poisoning in a household using the spice daily", "Methaemoglobinaemia in infants", "Fluorosis"],
        correctIndex: 1,
        explanation: "Lead chromate brightens turmeric and delivers lead; infants and children absorb it proportionally more and suffer neurodevelopmental harm at low doses.",
      },
      {
        type: "mcq",
        stem: "Which analytical method is the confirmatory standard for a blood-alcohol estimation?",
        options: ["Breath analyser", "Gas chromatography", "Thin-layer chromatography", "Immunoassay"],
        correctIndex: 1,
        explanation: "Headspace gas chromatography is the reference method; breath analysers are presumptive and immunoassay is a screen only.",
      },
      {
        type: "mcq",
        stem: "A postmortem sample of blood taken from the heart shows a digoxin concentration far above therapeutic. What is the correct interpretation?",
        options: [
          "The concentration proves death from digoxin poisoning",
          "Postmortem redistribution can raise heart-blood concentrations, so the figure must be read with the clinical history and a peripheral sample before any conclusion",
          "Digoxin always redistributes downwards",
          "The heart sample is the only valid specimen",
        ],
        correctIndex: 1,
        explanation: "Heart blood concentrations rise after death as drug leaves the organs; the value must be interpreted against the picture and, where available, a femoral sample.",
      },
      {
        type: "mcq",
        stem: "Endemic skeletal fluorosis is associated with drinking water containing which level of fluoride?",
        options: ["Above about 1.5 milligrams per litre", "Any fluoride at all", "Above 45 milligrams per litre", "Above 100 milligrams per litre"],
        correctIndex: 0,
        explanation: "Dental fluorosis and skeletal disease occur above roughly 1.5 milligrams per litre; the nitrate figure of 45 milligrams per litre is a different limit for a different effect.",
      },
      {
        type: "mcq",
        stem: "The Bhopal disaster of 1984 is best described in which terms?",
        options: [
          "A food-borne outbreak from adulterated oil",
          "An industrial release of a volatile irritant gas causing acute pulmonary and ocular injury with chronic disease in the exposed population",
          "A mining dust disease with decades of latency",
          "A pesticide residue problem in crops",
        ],
        correctIndex: 1,
        explanation: "Methyl isocyanate caused immediate airway and eye injury and a long-term burden in survivors; the disaster drove industrial safety, community information and surveillance laws.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Environmental toxicology follows exposure through air, water, food and work: fluoride, arsenic, nitrate and lead in water; particulates and gases in air; adulterants such as argemone oil and lead chromate in food; and the dust and metal diseases of industry, with Bhopal as the standing lesson in industrial disaster. The laboratory confirms what the clinician suspects through colour and spot tests, chromatography, spectrophotometry, atomic absorption and immunoassay — and the report is read with the autopsy's findings, the specimen's site and redistribution in mind, under a seal that the chain of custody must keep intact for retesting.",
      },
      {
        type: "paragraph",
        text: "This completes the authored lessons for M1 to M3 plus ethics and toxicology. The remaining concepts — DNA and stains, weapons and trace evidence — continue the forensic sciences thread, and the assessment bank carries the whole subject for examination.",
      },
    ],
  };
}

export const FORENSIC_MEDICINE: SubjectSeed = {
  id: "mbbs-forensic-medicine",
  slug: "forensic-medicine",
  title: "Forensic Medicine & Toxicology",
  code: "FOR 202",
  department: "Forensic Medicine & Toxicology",
  level: 200,
  credits: 3,
  semester: "second",
  description:
    "Forensic pathology, clinical forensic medicine, medical jurisprudence, forensic sciences and toxicology — general, clinical, environmental and analytical (AIIMS semesters II, IV, V).",
  faculty: "clinical-medicine",
  prereqCourses: ["pathology-cell-injury-repair"],
  modules: [
    { slug: "foundations-jurisprudence", title: "M1 — Foundations & medical jurisprudence" },
    { slug: "forensic-pathology-death", title: "M2 — Forensic pathology, death & postmortem" },
    { slug: "clinical-forensic-medicine", title: "M3 — Clinical forensic medicine" },
    { slug: "forensic-sciences", title: "M4 — Forensic sciences & procedures" },
    { slug: "toxicology", title: "M5 — Toxicology" },
  ],
  lessons: [
    { title: "Medical jurisprudence", module: 1, estimatedMinutes: 35, authored: true, concept: { title: "Medical jurisprudence", slug: "medical-jurisprudence", summary: "Law and medicine interface: courts, legal procedure, evidence, medical records, certificates and the doctor's legal duties.", blooms: "understand", minutes: 35, prereq: [] }, content: lesson1() as never },
    { title: "Inquests & legal procedures", module: 1, estimatedMinutes: 35, authored: true, concept: { title: "Inquests and legal procedures", slug: "inquests-legal-procedure", summary: "Police inquest, magistrate inquest, summons, witness examination and the doctor's role in court proceedings.", blooms: "understand", minutes: 35, prereq: ["medical-jurisprudence"] }, content: lesson2() as never },
    { title: "Death & postmortem changes", module: 2, estimatedMinutes: 45, authored: true, concept: { title: "Death and postmortem changes", slug: "death-postmortem-changes", summary: "Modes of death, somatic and molecular death, cooling, rigor, lividity and decomposition used to estimate time since death.", blooms: "understand", minutes: 45, prereq: [] }, content: lesson3() as never },
    { title: "Injuries & wounds", module: 2, estimatedMinutes: 45, authored: true, concept: { title: "Injuries and wounds", slug: "injuries-wounds", summary: "Abrasion, contusion, laceration, incised and stab wounds; firearm injuries, burns and the interpretation of wound age and causation.", blooms: "analyze", minutes: 50, prereq: ["death-postmortem-changes"] }, content: lesson4() as never },
    { title: "Postmortem examination & reports", module: 2, estimatedMinutes: 45, authored: true, concept: { title: "Postmortem examination and reporting", slug: "postmortem-report-writing", summary: "Objectives, procedure, viscera preservation, chain of custody and the structure of a defensible postmortem report.", blooms: "apply", minutes: 45, prereq: ["injuries-wounds"] }, content: lesson5() as never },
    { title: "Clinical forensic medicine", module: 3, estimatedMinutes: 45, authored: true, concept: { title: "Clinical forensic medicine", slug: "clinical-forensic-medicine", summary: "Examination and documentation of the living victim and accused, age estimation, and the medico-legal aspects of injury in practice.", blooms: "apply", minutes: 45, prereq: ["medical-jurisprudence"] }, content: lesson6() as never },
    { title: "Sexual offences examination", module: 3, estimatedMinutes: 45, authored: true, concept: { title: "Sexual offences examination", slug: "sexual-offences-examination", summary: "Consent law, examination and evidence preservation in sexual offences, and virginity and pregnancy allegations.", blooms: "apply", minutes: 45, prereq: ["clinical-forensic-medicine"] }, content: lesson7() as never },
    { title: "Forensic psychiatry", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "Forensic psychiatry", slug: "forensic-psychiatry", summary: "Capacity, responsibility, fitness to stand trial, testamentary capacity and the psychiatric assessment in legal contexts.", blooms: "analyze", minutes: 40, prereq: ["clinical-forensic-medicine"] }, content: lesson8() as never },
    { title: "DNA, serology & stains", module: 4, estimatedMinutes: 45, authored: false, concept: { title: "DNA, serology and stains", slug: "dna-serology-stains", summary: "Blood grouping, DNA profiling, semen and other biological stains, and their collection and evidential value.", blooms: "apply", minutes: 45, prereq: [] }, content: PLACEHOLDER },
    { title: "Weapons & trace evidence", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Weapons and trace evidence", slug: "weapons-examination", summary: "Classification and examination of weapons, tool marks, glass, fibres, hair and other trace evidence linking scene and suspect.", blooms: "understand", minutes: 40, prereq: ["dna-serology-stains"] }, content: PLACEHOLDER },
    { title: "Ethics, consent & negligence", module: 4, estimatedMinutes: 40, authored: true, concept: { title: "Ethics, consent and negligence", slug: "ethics-consent-negligence", summary: "Informed consent, confidentiality, medical negligence standards, consumer protection and the duties of care owed to patients.", blooms: "evaluate", minutes: 40, prereq: ["medical-jurisprudence"] }, content: lesson9() as never },
    { title: "General toxicology", module: 5, estimatedMinutes: 45, authored: true, concept: { title: "General toxicology", slug: "toxicology-general", summary: "Toxicokinetics, dose-response, mechanisms of toxicity, decontamination and the general management of the poisoned patient.", blooms: "apply", minutes: 45, prereq: [] }, content: lesson10() as never },
    { title: "Clinical toxicology & poisoning", module: 5, estimatedMinutes: 45, authored: true, concept: { title: "Clinical toxicology and poisoning", slug: "clinical-toxicology-poisoning", summary: "Common poisonings — organophosphates, corrosives, heavy metals, alcohols, drugs of abuse, snake and insect venom — recognition and treatment.", blooms: "analyze", minutes: 50, prereq: ["toxicology-general"] }, content: lesson11() as never },
    { title: "Environmental & analytical toxicology", module: 5, estimatedMinutes: 40, authored: true, concept: { title: "Environmental and analytical toxicology", slug: "environmental-analytical-toxicology", summary: "Pesticide and pollutant exposure in the community, and laboratory methods that detect and quantify poisons.", blooms: "understand", minutes: 40, prereq: ["toxicology-general"] }, content: lesson12() as never },
  ],
  sbas: [],
}

export async function seedForensicMedicine(): Promise<void> {
  const counts = await seedMbbsCourse(FORENSIC_MEDICINE);
  console.log(`✓ ${FORENSIC_MEDICINE.code} ${FORENSIC_MEDICINE.title}: ${counts.modules} modules · ${counts.concepts} concepts · ${counts.lessons} lessons · ${counts.items} items`);
}

if (process.argv[1] && (process.argv[1].includes("mbbs/forensic-medicine") || process.argv[1].includes("seed-assessment-forensic-medicine"))) {
  seedForensicMedicine()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
}
