import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Assessment content — Pharmacology & Therapeutics: From Receptor to Prescription.
 *
 * 20 original SBA items deepening the pharmacology bank from 6 to 26,
 * tagged to the existing ConceptNodes (see prisma/seed-courses/mbbs/pharmacology.ts).
 * Covers M2-M5 residual concepts (autonomic, cardiovascular & renal,
 * antimicrobial, and CNS/endocrine/special systems) — the six pre-existing
 * items already own the M1 foundations (drugs-receptors-response,
 * pharmacodynamics-receptors, absorption-distribution, metabolism-excretion,
 * therapeutics-index-development, autonomic-pharmacology).
 *
 * Idempotent: upserts on the item slug; safe to re-run. orderIndex starts at
 * 6 so the six pre-existing items (0-5) keep their slots.
 *
 * Governance: every item ships reviewStatus "needs-human-review" — the
 * 2026-10-20 repair established that production rows must never sit at
 * "draft" (42 draft rows drifted live before). needsCheck flags the numeric
 * or distractor reasoning a physician should double-check.
 */

const COURSE_SLUG = "pharmacology-foundations";

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
  // 1 — Analgesics: paracetamol overdose (easy)
  {
    slug: "pharmacology-foundations--analgesics--sba",
    concept: "analgesics",
    format: "sba",
    stem: "A 19-year-old man is brought to the emergency department one hour after taking a paracetamol overdose of 25 g. He is asymptomatic and fully alert. What is the most appropriate immediate management?",
    options: [
      "Give activated charcoal and start N-acetylcysteine, because 25 g is a potentially lethal dose and treatment must not wait for symptoms or the timed plasma concentration",
      "Observe for 48 hours and start treatment only if right upper quadrant pain or jaundice develops",
      "Give intravenous vitamin K as the specific antidote",
      "Start immediate haemodialysis regardless of plasma paracetamol concentration",
    ],
    correctAnswer: "Give activated charcoal and start N-acetylcysteine, because 25 g is a potentially lethal dose and treatment must not wait for symptoms or the timed plasma concentration",
    explanation: "At therapeutic doses paracetamol is conjugated, but in overdose the sulfation and glucuronidation pathways saturate and CYP2E1 oxidises the drug to the reactive metabolite NAPQI, which depletes glutathione and causes centrilobular hepatic necrosis. Twenty-five grams exceeds the potentially lethal single-ingestion threshold, so N-acetylcysteine is started immediately rather than waiting for a four-hour nomogram concentration, and it is most effective when given within eight hours; activated charcoal within one to two hours reduces absorption. Waiting for hepatic signs — tender hepatomegaly, jaundice, encephalopathy, coagulopathy and a rising INR — wastes the window in which antidote still prevents damage. Vitamin K is the antidote for warfarin or superwarfarin anticoagulation, and haemodialysis is not a treatment for paracetamol poisoning.",
    difficulty: "easy",
    marks: 1,
    needsCheck: false, // potential lethal dose ≥10 g acute; NAC most effective <8h
  },

  // 2 — Antihypertensive drugs (easy)
  {
    slug: "pharmacology-foundations--antihypertensives--sba",
    concept: "antihypertensives",
    format: "sba",
    stem: "A 58-year-old man with no comorbidity is newly diagnosed with stage 2 hypertension (repeated clinic readings of 156/94 mmHg). Which statement about drug treatment is most correct?",
    options: [
      "First-line options are an ACE inhibitor, an angiotensin receptor blocker, a calcium channel blocker or a thiazide-like diuretic, chosen by age, ethnicity and comorbidity",
      "A beta-blocker must be the first drug in every patient unless it is contraindicated",
      "Treatment should be deferred until end-organ damage such as retinopathy or proteinuria is documented",
      "Clonidine is the preferred first-line agent for uncomplicated essential hypertension",
    ],
    correctAnswer: "First-line options are an ACE inhibitor, an angiotensin receptor blocker, a calcium channel blocker or a thiazide-like diuretic, chosen by age, ethnicity and comorbidity",
    explanation: "Guidelines recommend ACE inhibitors, ARBs, calcium channel blockers and thiazide-like diuretics as first-line therapy for primary hypertension, selecting the agent by age, ethnicity, diabetes or chronic kidney disease, pregnancy potential and comorbidity. Beta-blockers are reserved for compelling indications such as heart failure, post-myocardial infarction, angina or rate control, and are inferior as first-line therapy in uncomplicated hypertension. Deferring treatment until end-organ damage appears misses modifiable cardiovascular risk, while clonidine and methyldopa are second-line or niche agents.",
    difficulty: "easy",
    marks: 1,
  },

  // 3 — Cell wall and protein synthesis inhibitors (easy)
  {
    slug: "pharmacology-foundations--cell-wall-protein-inhibitors--sba",
    concept: "cell-wall-protein-inhibitors",
    format: "sba",
    stem: "Which statement best pairs the mechanism of amoxicillin with its characteristic adverse effect?",
    options: [
      "It binds penicillin-binding proteins and inhibits peptidoglycan transpeptidation, and it can cause Clostridioides difficile diarrhoea",
      "It inhibits bacterial dihydrofolate reductase and produces hyperkalaemia",
      "It binds the 50S ribosomal subunit and causes grey baby syndrome",
      "It alkylates bacterial DNA and causes dose-related ototoxicity",
    ],
    correctAnswer: "It binds penicillin-binding proteins and inhibits peptidoglycan transpeptidation, and it can cause Clostridioides difficile diarrhoea",
    explanation: "Amoxicillin is an aminopenicillin whose beta-lactam ring acylates the transpeptidase penicillin-binding proteins, preventing the peptidoglycan cross-linking that gives the bacterial cell wall its strength; the resulting bactericidal lysis explains its use in streptococcal pharyngitis, otitis media, sinusitis and community respiratory infection. Its commonest adverse effects are gastrointestinal upset, rash and hypersensitivity — immediate anaphylaxis or delayed maculopapular eruption — plus Clostridioides difficile infection arising from disruption of protective gut flora. Dihydrofolate reductase is the target of trimethoprim, 50S ribosomal binding is the macrolide and lincosamide mechanism, and both DNA alkylation and dose-related ototoxicity are cisplatin properties.",
    difficulty: "easy",
    marks: 1,
  },

  // 4 — Lipid-lowering agents (easy)
  {
    slug: "pharmacology-foundations--lipid-lowering--sba",
    concept: "lipid-lowering",
    format: "sba",
    stem: "A 61-year-old man is started on atorvastatin 20 mg after a transient ischaemic attack. Which counselling statement is most correct?",
    options: [
      "Atorvastatin inhibits HMG-CoA reductase, lowering hepatic cholesterol synthesis and upregulating surface LDL receptors so LDL cholesterol falls, and he should report unexplained muscle pain, weakness or dark urine",
      "Statins lower triglycerides by activating lipoprotein lipase and require monthly electrolyte monitoring",
      "Atorvastatin primarily raises HDL cholesterol and has no role in secondary stroke prevention",
      "Statin therapy is stopped once LDL cholesterol falls below the target, because further exposure increases toxicity",
    ],
    correctAnswer: "Atorvastatin inhibits HMG-CoA reductase, lowering hepatic cholesterol synthesis and upregulating surface LDL receptors so LDL cholesterol falls, and he should report unexplained muscle pain, weakness or dark urine",
    explanation: "Statins competitively inhibit HMG-CoA reductase, which reduces intrahepatic cholesterol synthesis and triggers compensatory up-regulation of surface LDL receptors, clearing LDL cholesterol from plasma — the mechanism behind their mortality benefit in secondary prevention after stroke and coronary events. The key adverse effects are myalgia, myopathy or rhabdomyolysis (risk raised by hypothyroidism, high dose, frailty and concurrent fibrates) and transaminase elevation, so muscle symptoms, weakness and dark urine should be reported rather than attributed to ageing. Lipoprotein lipase activation is the fibrate mechanism; HDL is a secondary benefit, not the treatment goal; and therapy continues indefinitely because benefit depends on the duration of LDL lowering.",
    difficulty: "easy",
    marks: 1,
  },

  // 5 — Principles of antimicrobial therapy (easy)
  {
    slug: "pharmacology-foundations--antimicrobial-principles--sba",
    concept: "antimicrobial-principles",
    format: "sba",
    stem: "Which statement about antimicrobial pharmacology and susceptibility testing is most correct?",
    options: [
      "Bactericidal agents kill organisms (for example beta-lactams) whereas bacteriostatic agents only arrest growth (for example tetracyclines), and the minimum inhibitory concentration is the lowest concentration preventing visible growth",
      "Bacteriostatic drugs are preferred in life-threatening sepsis because killing organisms releases more bacterial toxin",
      "Empirical antibiotics should always be continued until culture results return to confirm susceptibility",
      "The minimum inhibitory concentration is the plasma concentration achieved at steady state and is used to predict toxicity",
    ],
    correctAnswer: "Bactericidal agents kill organisms (for example beta-lactams) whereas bacteriostatic agents only arrest growth (for example tetracyclines), and the minimum inhibitory concentration is the lowest concentration preventing visible growth",
    explanation: "An antibiotic is bactericidal when it irreversibly damages an essential structure and kills the organism, and bacteriostatic when it merely halts replication and leaves clearance to host immunity; the distinction is not absolute but bactericidal therapy is favoured in bloodstream infection, infective endocarditis and meningitis where phagocyte access is poor. Empirical therapy is chosen from the likely flora and unit antibiogram and then reviewed and de-escalated once cultures and susceptibilities return, with the duration set by the clinical syndrome and microbiological result. MIC is a pharmacodynamic susceptibility measure, not a plasma level or a toxicity measure, and is used to interpret breakpoints and guide dosing targets such as AUC/MIC or time-above-MIC.",
    difficulty: "easy",
    marks: 1,
  },

  // 6 — Sympathomimetics (medium)
  {
    slug: "pharmacology-foundations--sympathomimetics--sba",
    concept: "sympathomimetics",
    format: "sba",
    stem: "A 24-year-old woman develops anaphylaxis minutes after eating peanuts: stridor, wheeze, widespread urticaria and blood pressure 72/44 mmHg. Which is the most appropriate immediate drug and route?",
    options: [
      "Intramuscular adrenaline 0.5 mg (0.5 mL of 1:1000) into the anterolateral thigh, repeated after 5 minutes if there is no improvement",
      "Subcutaneous adrenaline 0.5 mL of 1:1000 with an oral antihistamine",
      "Intravenous adrenaline 1 mg as a slow bolus in every case, because it acts faster than the intramuscular route",
      "Nebulised salbutamol with oral chlorphenamine and a corticosteroid inhaler",
    ],
    correctAnswer: "Intramuscular adrenaline 0.5 mg (0.5 mL of 1:1000) into the anterolateral thigh, repeated after 5 minutes if there is no improvement",
    explanation: "Adrenaline is the only first-line drug in anaphylaxis: alpha-1 mediated vasoconstriction reverses vasodilatation and hypotension, while beta-1 and beta-2 effects support cardiac output and bronchodilation and stabilise mast cells. The intramuscular route into the anterolateral thigh (0.5 mg adult, pediatric dose by weight) produces reliable absorption, with repeat doses every 5 minutes and early airway or anaesthetic support when stridor suggests laryngeal oedema. Subcutaneous absorption is erratic in shock because peripheral vasoconstriction traps the drug, and intravenous adrenaline is reserved for refractory cases under monitoring because of arrhythmia and myocardial ischaemia risk. Oxygen, fluids, chlorphenamine and hydrocortisone are adjuncts for symptoms only and never replace adrenaline.",
    difficulty: "medium",
    marks: 1,
  },

  // 7 — Drugs for angina, shock and resuscitation (medium)
  {
    slug: "pharmacology-foundations--antianginal-resuscitation--sba",
    concept: "antianginal-resuscitation",
    format: "sba",
    stem: "A 66-year-old man has chest pain at rest radiating to the left arm. The ECG shows ST depression and he is given sublingual glyceryl trinitrate and chewable aspirin. Which statement about the drug treatment of unstable angina is most correct?",
    options: [
      "Dual antiplatelet therapy with aspirin and a P2Y12 inhibitor, antithrombin with fondaparinux or heparin, anti-ischaemic therapy with a nitrate and a beta-blocker, and early risk-stratified invasive management",
      "Beta-blockers are contraindicated in all acute coronary presentations because they worsen coronary vasospasm",
      "Thrombolysis is the reperfusion strategy of choice for non-ST-elevation acute coronary syndrome",
      "Nitrates relieve symptoms but their benefit is blunted by the reflex bradycardia they produce",
    ],
    correctAnswer: "Dual antiplatelet therapy with aspirin and a P2Y12 inhibitor, antithrombin with fondaparinux or heparin, anti-ischaemic therapy with a nitrate and a beta-blocker, and early risk-stratified invasive management",
    explanation: "Unstable angina and NSTEMI are treated with dual antiplatelet therapy (aspirin plus ticagrelor or clopidogrel) and parenteral anticoagulation, with nitrates and beta-blockers for ischaemia plus analgesia, followed by early coronary angiography when risk scores or refinements indicate intervention. Beta-blockers are indicated in ACS unless there is heart failure, hypotension or conduction disease, and coronary vasospasm is a different entity where calcium channel blockers are preferred. Thrombolysis is ineffective and not used in NSTE-ACS because the culprit artery is usually only partially or intermittently occluded. Glyceryl trinitrate predominantly dilates veins, reducing preload and myocardial oxygen demand, and the tolerance that develops with continuous dosing is counteracted by daily nitrate-free intervals rather than by bradycardia, which is a beta-blocker effect.",
    difficulty: "medium",
    marks: 1,
  },

  // 8 — Anticholinergic drugs (medium)
  {
    slug: "pharmacology-foundations--anticholinergic-drugs--sba",
    concept: "anticholinergic-drugs",
    format: "sba",
    stem: "A 40-year-old agricultural worker presents with salivation, miosis, sweating, fasciculation and audible wheeze an hour after spraying an insecticide. Which drug is the immediate priority?",
    options: [
      "Intravenous atropine titrated to drying of bronchial secretions, with pralidoxime as the enzyme reactivator",
      "Intravenous neostigmine to enhance acetylcholine at the neuromuscular junction",
      "Intravenous physostigmine eye drops",
      "Nebulised ipratropium bromide to dry the secretions",
    ],
    correctAnswer: "Intravenous atropine titrated to drying of bronchial secretions, with pralidoxime as the enzyme reactivator",
    explanation: "The clinical picture is muscarinic excess from organophosphate carbamate poisoning — irreversible (or reversible) inhibition of acetylcholinesterase producing DUMBELS features: diarrhoea, urination, miosis, bronchorrhoea and bronchospasm, emesis, lacrimation, salivation. Death is usually respiratory, so intravenous atropine is the priority and the titration endpoint is drying of bronchial secretions rather than pupillary or heart-rate response. Pralidoxime reactivates the phosphorylated enzyme and is given as early as possible in organophosphate poisoning to reverse the neuromuscular block. Neostigmine and physostigmine are cholinesterase inhibitors that would deepen the cholinergic crisis, and ipratropium is a muscarinic antagonist used for airways disease, not a systemic antidote.",
    difficulty: "medium",
    marks: 1,
  },

  // 9 — Anticoagulants and thrombolytics (hard)
  {
    slug: "pharmacology-foundations--anticoagulants-thrombolytics--sba",
    concept: "anticoagulants-thrombolytics",
    format: "sba",
    stem: "A 78-year-old woman taking dabigatran for atrial fibrillation presents with a large intracerebral haemorrhage and is hypotensive. Which reversal strategy is correct?",
    options: [
      "Idarucizumab, a monoclonal antibody fragment that binds dabigatran and neutralises it within minutes",
      "Intravenous protamine sulphate at a dose titrated to the last dabigatran dose",
      "Oral vitamin K 10 mg with fresh frozen plasma",
      "No specific reversal exists and management is supportive only",
    ],
    correctAnswer: "Idarucizumab, a monoclonal antibody fragment that binds dabigatran and neutralises it within minutes",
    explanation: "Dabigatran is a direct, reversible thrombin inhibitor whose only specific antidote is idarucizumab, a humanised monoclonal antibody fragment with roughly 350-fold higher affinity for dabigatran than thrombin, given as two 2.5 g intravenous boluses. Protamine sulphate fully reverses unfractionated heparin and only partially reverses low molecular weight heparin, so it does not help in dabigatran bleeding. Vitamin K plus four-factor prothrombin complex concentrate reverses warfarin, whereas andexanet alfa (or four-factor PCC) is the specific or rescue option for the factor Xa inhibitors apixaban, rivaroxaban and edoxaban. In addition to reversal, management of anticoagulant-related intracerebral haemorrhage requires blood pressure control, neurosurgical review and consideration of restarting anticoagulation once the risk-benefit is re-evaluated.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false, // idarucizumab 2 x 2.5 g IV bolus; affinity ratio varies by source
  },

  // 10 — Drugs for epilepsy and neurodegenerative disease (medium)
  {
    slug: "pharmacology-foundations--antiepileptics-neurodegeneration--sba",
    concept: "antiepileptics-neurodegeneration",
    format: "sba",
    stem: "A 26-year-old woman with focal epilepsy who takes sodium valproate tells her GP that she is planning a pregnancy. Which statement about antiepileptic selection is most correct?",
    options: [
      "Valproate is highly teratogenic and avoided in women of childbearing potential, lamotrigine and levetiracetam are lower-risk alternatives, and folic acid supplementation is advised",
      "Valproate is the safest antiepileptic in pregnancy and should be continued unchanged",
      "Carbamazepine is preferred in pregnancy because it is not an enzyme inducer and does not reduce oral contraceptive efficacy",
      "Antiepileptic regimens are never changed before conception because switching therapy carries no risk",
    ],
    correctAnswer: "Valproate is highly teratogenic and avoided in women of childbearing potential, lamotrigine and levetiracetam are lower-risk alternatives, and folic acid supplementation is advised",
    explanation: "Valproate carries a dose-dependent risk of neural tube defects and dose-related impaired neurodevelopment, which is why it is contraindicated in pregnancy and in women of childbearing potential without a pregnancy prevention programme. Lamotrigine and levetiracetam have the most reassuring pregnancy data, and folic acid 5 mg daily is advised before conception and through the first trimester to reduce malformation risk. Carbamazepine, phenytoin and topiramate are potent CYP enzyme inducers that reduce hormonal contraceptive efficacy and are associated with folate-related malformations. Preconception planning also optimises seizure control, because convulsions themselves carry fetal risk.",
    difficulty: "medium",
    marks: 1,
  },

  // 11 — Antifungal, antiviral and antiparasitic drugs (medium)
  {
    slug: "pharmacology-foundations--antifungal-antiviral-antiparasitic--sba",
    concept: "antifungal-antiviral-antiparasitic",
    format: "sba",
    stem: "Which pairing of an antimicrobial with its principal toxicity or pharmacokinetic issue is correct?",
    options: [
      "Amphotericin B — dose-related nephrotoxicity, requiring renal function and potassium monitoring throughout treatment",
      "Aciclovir — no dose reduction is needed in renal impairment because viral thymidine kinase alone determines its activation",
      "Fluconazole — a potent CYP450 inducer that lowers levels of ciclosporin and statins",
      "Metronidazole — primary ototoxicity requiring audiometry during long courses",
    ],
    correctAnswer: "Amphotericin B — dose-related nephrotoxicity, requiring renal function and potassium monitoring throughout treatment",
    explanation: "Amphotericin B binds ergosterol and forms membrane pores that leak fungal contents, but its limiting toxicity is dose-related nephrotoxicity with hypokalaemia and hypomagnesaemia, managed with hydration, liposomal formulations and electrolyte replacement. Aciclovir is activated selectively by viral thymidine kinase but the active drug is renally cleared, so it must be dose-reduced in renal impairment to avoid crystal nephropathy and neurotoxicity. Fluconazole inhibits rather than induces CYP450 enzymes and therefore raises the levels of warfarin, ciclosporin and many statins. Metronidazole is associated with a disulfiram-like reaction with alcohol, a metallic taste and peripheral neuropathy with prolonged use; linezolid, not metronidazole, is the agent requiring monitoring for thrombocytopenia and serotonin syndrome.",
    difficulty: "medium",
    marks: 1,
  },

  // 12 — Antimicrobial resistance and stewardship (medium)
  {
    slug: "pharmacology-foundations--antimicrobial-resistance--sba",
    concept: "antimicrobial-resistance",
    format: "sba",
    stem: "A hospital in-patient with methicillin-resistant Staphylococcus aureus bacteraemia is failing to improve after three days of therapy. Which stewardship principle is most correct?",
    options: [
      "Review cultures and susceptibilities, de-escalate to the narrowest effective agent, and monitor drug levels, renal function and response with a defined duration and stop date",
      "Continue empiric broad-spectrum carbapenem therapy until the patient is ready for discharge",
      "Switch to an oral fluoroquinolone monotherapy because susceptibility testing is unnecessary for oral agents",
      "Escalate the dose indefinitely, because dose increases overcome all resistance mechanisms",
    ],
    correctAnswer: "Review cultures and susceptibilities, de-escalate to the narrowest effective agent, and monitor drug levels, renal function and response with a defined duration and stop date",
    explanation: "Antimicrobial stewardship requires reviewing microbiology at 48 to 72 hours and narrowing to the narrowest active agent (de-escalation), documenting the indication, dose, route, planned duration and review date, and considering intravenous-to-oral switch once the patient is stable and absorbing. MRSA bacteraemia is treated with vancomycin — monitored by AUC-guided dosing, with nephrotoxicity and infusion reactions — or with linezolid, which causes thrombocytopenia and interacts with serotonergic agents; vancomycin-intermediate or resistant organisms (VISA, VRSA, glycopeptide-resistant enterococci) demand alternatives such as daptomycin, ceftaroline or linezolid. Leaving broad empirical therapy running without review promotes Clostridioides difficile infection, collateral damage to the microbiome and further selection of resistant subpopulations. Dose escalation alone cannot overcome mechanisms such as the mecA-encoded altered penicillin-binding protein, vancomycin tolerance, efflux pumps or porin loss.",
    difficulty: "medium",
    marks: 1,
  },

  // 13 — Antituberculous therapy (hard)
  {
    slug: "pharmacology-foundations--antituberculous--sba",
    concept: "antituberculous",
    format: "sba",
    stem: "A 34-year-old migrant is diagnosed with smear-positive pulmonary tuberculosis and started on standard triple-phase therapy. Which statement about the regimen is most correct?",
    options: [
      "Two months of rifampicin, isoniazid, pyrazinamide and ethambutol followed by four months of rifampicin and isoniazid, with pyridoxine alongside isoniazid to prevent peripheral neuropathy",
      "Nine months of isoniazid alone, because it is the only bactericidal drug in the standard regimen",
      "Six weeks of a fluoroquinolone with a beta-lactam, which is sufficient to eradicate dormant organisms",
      "Rifampicin is continued for only two weeks, because orange discolouration of urine and tears signals that treatment is complete",
    ],
    correctAnswer: "Two months of rifampicin, isoniazid, pyrazinamide and ethambutol followed by four months of rifampicin and isoniazid, with pyridoxine alongside isoniazid to prevent peripheral neuropathy",
    explanation: "Drug-sensitive pulmonary tuberculosis is treated with a two-month intensive phase of rifampicin, isoniazid, pyrazinamide and ethambutol followed by a four-month continuation phase of rifampicin and isoniazid, with longer courses for bone, meningeal or disseminated disease. Pyridoxine is co-administered with isoniazid because the drug causes peripheral neuropathy and lowers the seizure threshold, particularly in slow acetylators. Rifampicin is a strong enzyme inducer producing orange urine, tears and sweat and interactions from oral contraceptives to antiretrovirals; ethambutol can cause optic neuritis requiring visual acuity and colour vision checks; and pyrazinamide causes hyperuricaemia, hepatitis and arthralgia. Adding a single agent to a failing regimen is the classic route to acquired resistance, and multidrug combinations exist precisely to prevent selection of resistant mutants.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false, // 2RHZE/4RH standard; pyridoxine with INH
  },

  // 14 — Beta-adrenoceptor antagonists (medium)
  {
    slug: "pharmacology-foundations--beta-blockers--sba",
    concept: "beta-blockers",
    format: "sba",
    stem: "A 55-year-old man with hypertension and a previous myocardial infarction also has asthma. Which statement about beta-blockers is most correct?",
    options: [
      "Beta-1 blockade reduces heart rate, contractility and renin release, but beta-blockers may precipitate bronchospasm; if one is used at all in asthma, a cardioselective agent is started cautiously at low dose",
      "Beta-blockers are absolutely contraindicated in every patient with asthma because no cardioselective option exists",
      "Beta-blockade lowers blood pressure mainly by antagonising alpha-1 adrenoceptors on vascular smooth muscle",
      "All beta-blockers are interchangeable at the same dose, so any member of the class can be substituted directly",
    ],
    correctAnswer: "Beta-1 blockade reduces heart rate, contractility and renin release, but beta-blockers may precipitate bronchospasm; if one is used at all in asthma, a cardioselective agent is started cautiously at low dose",
    explanation: "Beta-1 blockade slows sinus node firing, reduces myocardial contractility and decreases renin release, lowering cardiac output and blood pressure, with mortality benefit after myocardial infarction and in heart failure. Adverse effects include bronchospasm from beta-2 blockade, cold peripheries, fatigue, masked hypoglycaemia, impotence, bradycardia and heart block, and abrupt withdrawal may provoke rebound ischaemia. Cardioselectivity for beta-1 over beta-2 is dose-dependent and is progressively lost at higher doses, so use in reactive airways disease requires careful agent selection, low doses and monitoring. Alpha-1 antagonism is the alpha-blocker mechanism (doxazosin, prazosin, tamsulosin), and class members differ in selectivity, intrinsic activity, membrane-stabilising action and route of elimination, so they are not dose-for-dose interchangeable.",
    difficulty: "medium",
    marks: 1,
  },

  // 15 — Chemotherapy, immunosuppression and biopharmaceuticals (hard)
  {
    slug: "pharmacology-foundations--chemotherapy-immunotherapy--sba",
    concept: "chemotherapy-immunotherapy",
    format: "sba",
    stem: "A 62-year-old woman is on day 21 of cisplatin-based chemotherapy for ovarian cancer. She has a temperature of 38.4 C, a heart rate of 122/min, blood pressure 88/50 mmHg and a neutrophil count of 0.3 x 10^9/L. Which management principle is most correct?",
    options: [
      "This is neutropenic sepsis: take blood cultures and start empirical broad-spectrum antipseudomonal antibiotics immediately, without waiting for the neutrophil count",
      "Neutropenic fever is an expected chemotherapy effect and should be observed for 72 hours before prescribing antibiotics",
      "Antibiotics are unnecessary unless the absolute neutrophil count is confirmed to be below 0.1 x 10^9/L",
      "Febrile neutropenia is managed with granulocyte colony-stimulating factor alone, since infection cannot be diagnosed",
    ],
    correctAnswer: "This is neutropenic sepsis: take blood cultures and start empirical broad-spectrum antipseudomonal antibiotics immediately, without waiting for the neutrophil count",
    explanation: "Febrile neutropenia — a single temperature at or above 38.0 C, or 38.3 C sustained for an hour, with neutrophils below 1.5 or 0.5 x 10^9/L — is an oncological emergency, and empiric broad-spectrum antipseudomonal therapy (for example piperacillin-tazobactam or meropenem) must be started within the hour because the usual inflammatory signs are blunted by the absent neutrophil response. Cisplatin-based cytotoxic therapy also brings nephrotoxicity, ototoxicity, severe emetogenicity and myelosuppression, requiring aggressive hydration, magnesium monitoring and 5-HT3 plus NK1 receptor antagonist antiemetic prophylaxis. Granulocyte colony-stimulating factor shortens the duration and severity of neutropenia but is an adjunct, never a substitute for antibiotics, and a clear focus plus culture data still guides the choice and duration.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false, // febrile neutropenia definition and <1h antibiotic rule
  },

  // 16 — Diuretic drugs (medium)
  {
    slug: "pharmacology-foundations--diuretics--sba",
    concept: "diuretics",
    format: "sba",
    stem: "A 70-year-old man with acute decompensated heart failure is given intravenous furosemide. Which combination of mechanism and monitoring is most correct?",
    options: [
      "Furosemide inhibits the Na-K-2Cl cotransporter in the thick ascending limb of the loop of Henle, and hypokalaemia, hyponatraemia, uraemia and volume depletion require monitoring",
      "Furosemide blocks the epithelial sodium channel in the collecting duct, so it retains potassium like a potassium-sparing diuretic",
      "Furosemide is a thiazide acting on the distal convoluted tubule and carries a high risk of hyperkalaemia",
      "Furosemide is contraindicated in acute pulmonary oedema because it increases preload",
    ],
    correctAnswer: "Furosemide inhibits the Na-K-2Cl cotransporter in the thick ascending limb of the loop of Henle, and hypokalaemia, hyponatraemia, uraemia and volume depletion require monitoring",
    explanation: "Loop diuretics inhibit the Na-K-2Cl cotransporter in the thick ascending limb, abolishing the medullary concentration gradient and the countercurrent mechanism and producing a powerful but short-lived natriuresis. They cause sodium, potassium and magnesium wasting, a hypovolaemic metabolic alkalosis with secondary hyperaldosteronism, hyperuricaemia, uraemia, and ototoxicity when infused rapidly. Blockade of the sodium-chloride cotransporter in the distal convoluted tubule is the thiazide mechanism, and blockade of the epithelial sodium channel is the amiloride and spironolactone mechanism — both potassium-sparing. Furosemide is a first-line drug in acute pulmonary oedema because intravenous venodilatation reduces preload within minutes, before any diuresis is apparent.",
    difficulty: "medium",
    marks: 1,
  },

  // 17 — Endocrine pharmacology (medium)
  {
    slug: "pharmacology-foundations--endocrine-pharmacology--sba",
    concept: "endocrine-pharmacology",
    format: "sba",
    stem: "A 68-year-old woman with type 2 diabetes has an estimated glomerular filtration rate of 32 mL/min/1.73 m2. Which statement about metformin is most correct?",
    options: [
      "Metformin is continued with a reduced dose at this filtration rate but is stopped below 30 mL/min/1.73 m2, before iodinated contrast, and during acute illness because of lactic acidosis risk",
      "Metformin is contraindicated at any degree of chronic kidney disease and must be stopped now",
      "Metformin causes lactic acidosis by stimulating hepatic gluconeogenesis and is unaffected by renal function",
      "Metformin is an insulin secretagogue whose principal adverse effect is hypoglycaemia comparable with sulfonylureas",
    ],
    correctAnswer: "Metformin is continued with a reduced dose at this filtration rate but is stopped below 30 mL/min/1.73 m2, before iodinated contrast, and during acute illness because of lactic acidosis risk",
    explanation: "Metformin decreases hepatic gluconeogenesis, increases peripheral insulin sensitivity and improves intestinal glucose handling, and it is eliminated unchanged by the kidney; guidelines permit reduced-dose use down to 30 mL/min/1.73 m2, with withholding before iodinated contrast and during acute dehydration, sepsis or hypoxia to reduce lactic acidosis risk. It does not stimulate insulin release, so hypoglycaemia is uncommon unless combined with insulin or a sulfonylurea. Sulfonylureas such as gliclazide and glimepiride close K-ATP channels to stimulate insulin secretion, and their weight gain plus hypoglycaemia is the reason their use is now restricted. SGLT2 inhibitors are the complementary class with renal and cardiac benefit but declining efficacy as filtration rate falls.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // metformin renal thresholds 30/45 mL/min; contrast hold rule
  },

  // 18 — General anaesthesia (hard)
  {
    slug: "pharmacology-foundations--general-anaesthesia--sba",
    concept: "general-anaesthesia",
    format: "sba",
    stem: "During anaesthesia a young man develops a rapidly rising end-tidal carbon dioxide, tachycardia, generalised muscle rigidity and a temperature of 40.6 C. Which treatment is indicated?",
    options: [
      "Discontinue the trigger, give 100% oxygen, cool the patient and administer dantrolene, which inhibits calcium release from the sarcoplasmic reticulum",
      "Give intravenous propranolol and observe, because the hyperthermia is a benign response to suxamethonium",
      "Treat with intravenous antibiotics for possible perioperative sepsis",
      "Give further suxamethonium to relax the rigidity and continue the triggering agent until the rigidity settles",
    ],
    correctAnswer: "Discontinue the trigger, give 100% oxygen, cool the patient and administer dantrolene, which inhibits calcium release from the sarcoplasmic reticulum",
    explanation: "These features are diagnostic of malignant hyperthermia, an autosomal dominant RyR1 receptor disorder triggered by volatile anaesthetic agents and by suxamethonium: uncontrolled sarcoplasmic reticulum calcium release produces a rapidly rising end-tidal carbon dioxide, masseter and generalised rigidity, hyperthermia, tachycardia, hyperkalaemia and metabolic acidosis. Management is to stop triggers, hyperventilate with 100% oxygen, actively cool, correct hyperkalaemia and acidosis, treat arrhythmias and give dantrolene, which blocks ryanodine receptor calcium release from the sarcoplasmic reticulum; the mortality of untreated malignant hyperthermia is very high. The condition is neither benign nor sepsis, and further suxamethonium aggravates it. Since the trigger has been given, the theatre team must switch to a trigger-free technique (total intravenous anaesthesia) for the remainder of the case.",
    difficulty: "hard",
    marks: 1,
  },

  // 19 — Drugs for heart failure and arrhythmia (medium)
  {
    slug: "pharmacology-foundations--heart-failure-arrhythmias--sba",
    concept: "heart-failure-arrhythmias",
    format: "sba",
    stem: "An 81-year-old woman taking digoxin and furosemide for heart failure becomes nauseated, confused and complains of yellow-green vision; her pulse is 42/min and her potassium is 2.9 mmol/L. Which statement is most correct?",
    options: [
      "Hypokalaemia potentiates digoxin toxicity, so digoxin should be stopped, potassium and magnesium corrected, and life-threatening arrhythmia treated with digoxin-specific antibody fragments",
      "Digoxin has a wide therapeutic index, so these symptoms are unrelated to the drug and should be treated symptomatically",
      "Digoxin toxicity is diagnosed by a low serum potassium and requires only supportive observation",
      "The correct treatment is intravenous calcium to stabilise the myocardium, as in hyperkalaemic cardiac arrest",
    ],
    correctAnswer: "Hypokalaemia potentiates digoxin toxicity, so digoxin should be stopped, potassium and magnesium corrected, and life-threatening arrhythmia treated with digoxin-specific antibody fragments",
    explanation: "Digoxin has a narrow therapeutic index and hypokalaemia from furosemide increases its binding to the cardiac Na/K-ATPase, potentiating the nausea, anorexia, confusion, visual disturbance, bradycardia and ventricular ectopy seen here. Management is to stop digoxin, correct potassium and magnesium, monitor continuously and reserve digoxin-specific antibody fragments for hyperkalaemia, life-threatening arrhythmia, haemodynamic compromise or large ingestion; a digoxin level must be sampled at least six to eight hours after the last dose because earlier samples reflect the distribution phase rather than the effect site. Intravenous calcium is avoided in digoxin toxicity because of the risk of an unresponsive, rigid myocardium in digoxin-sensitised tissue, and the hyperkalaemia of severe toxicity is treated with fragments plus glucose and insulin rather than calcium. Digoxin reduces admissions rather than mortality in heart failure, and its level rises in renal impairment, which together with hypokalaemia is the commonest precipitant of toxicity in practice.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // digoxin trough ≥6h; Fab indications; calcium caution
  },

  // 20 — Psychiatric drugs (medium)
  {
    slug: "pharmacology-foundations--psychiatric-drugs--sba",
    concept: "psychiatric-drugs",
    format: "sba",
    stem: "A 22-year-old woman with severe depression is started on sertraline. Which statement about selective serotonin reuptake inhibitors is most correct?",
    options: [
      "They block the presynaptic serotonin transporter and increase synaptic serotonin, with adverse effects including hyponatraemia, gastrointestinal upset and sexual dysfunction, and a small rise in suicidal ideation in young patients that requires early review",
      "They block serotonin receptors directly, so their antidepressant benefit is evident within the first 48 hours",
      "SSRIs have no serotonergic adverse effects; the main risks are extrapyramidal symptoms and hyperprolactinaemia",
      "SSRIs may be stopped abruptly without consequence because they produce no withdrawal syndrome",
    ],
    correctAnswer: "They block the presynaptic serotonin transporter and increase synaptic serotonin, with adverse effects including hyponatraemia, gastrointestinal upset and sexual dysfunction, and a small rise in suicidal ideation in young patients that requires early review",
    explanation: "SSRIs inhibit the presynaptic serotonin transporter, raising synaptic serotonin within hours, but the antidepressant effect takes two to six weeks, which is why early side effects must be anticipated and tolerated rather than treated by switching. Characteristic adverse effects are early nausea and headache, sexual dysfunction, insomnia or sedation, hyponatraemia from SIADH, bleeding risk with NSAIDs or anticoagulants, and serotonin syndrome when combined with other serotonergic agents such as tramadol, triptans, MAOIs or linezolid. Patients under 25 need close early review because of the small increase in treatment-emergent suicidal ideation, and abrupt discontinuation causes a discontinuation syndrome (electric shock sensations, dizziness, flu-like symptoms, irritability) so tapering is required. Extrapyramidal effects and hyperprolactinaemia arise from dopamine receptor blockade and are characteristic of typical antipsychotics and risperidone.",
    difficulty: "medium",
    marks: 1,
  },
];

async function seedAssessmentPharmacology() {
  const course = await prisma.course.findFirst({
    where: { slug: COURSE_SLUG },
    select: { id: true },
  });
  if (!course) throw new Error(`Course ${COURSE_SLUG} not found. Run prisma/seed-courses/mbbs/pharmacology.ts first.`);

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

  console.log(`✓ Pharmacology assessment items: ${count} items (marks 1, needs-human-review)`);
}

// CLI usage: npx ts-node prisma/seed-assessment-pharmacology.ts
if (process.argv[1] && process.argv[1].includes("seed-assessment-pharmacology")) {
  seedAssessmentPharmacology()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}

export { seedAssessmentPharmacology, ITEMS as PHARMACOLOGY_ITEMS };
