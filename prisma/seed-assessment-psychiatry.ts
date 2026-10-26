import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Assessment content — Psychiatry (PSYT 306).
 *
 * 18 original SBA items creating the Psychiatry bank from zero, tagged to the
 * existing ConceptNodes of the MBBS psychiatry spine (see
 * prisma/seed-courses/mbbs/allied-specialities.ts).
 *
 * Covers classification and assessment, aetiology (stress-vulnerability), the
 * schizophrenia spectrum, bipolar disorder, depressive disorders (including
 * responsible enquiry about self-harm), anxiety/phobia/OCD, somatoform and
 * dissociative disorders, stress-related and personality disorders, alcohol
 * and drug dependence, child and adolescent disorders, psychological
 * therapies, and rating scales with psychiatric emergencies.
 *
 * Idempotent: upserts on the item slug; safe to re-run. orderIndex starts at
 * 0 because the course has no pre-existing assessment items.
 *
 * Governance: every item ships reviewStatus "needs-human-review" and nothing
 * is marked "verified". Language is deliberately non-stigmatising —
 * person-first phrasing, no disorders as nouns, no "committed suicide" — and
 * safety questions about self-harm are tested as direct, compassionate
 * enquiry, consistent with the evidence that asking does not increase risk.
 */

const COURSE_SLUG = "psychiatry";

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
  // 1 — Classification and assessment (easy)
  {
    slug: "psyt306-icd-dsm-classification-purpose",
    concept: "classification-assessment",
    format: "sba",
    stem: "Which statement best describes the purpose of the ICD-11 and DSM-5 classification systems in psychiatry?",
    options: [
      "They describe syndromes by symptom pattern, course and functional impact so that clinicians, services and researchers share a common language, without yet being able to assign a proven cause to each disorder",
      "They identify a single proven biological cause for every disorder, so that treatment follows inevitably from the label",
      "They rank patients by severity so that those with milder conditions can be discharged without any treatment",
      "They are legal instruments that determine a person's capacity and responsibility in court",
    ],
    correctAnswer: "They describe syndromes by symptom pattern, course and functional impact so that clinicians, services and researchers share a common language, without yet being able to assign a proven cause to each disorder",
    explanation: "ICD-11 and DSM-5 are descriptive, largely polythetic classifications: a diagnosis is made from a defined symptom pattern plus duration and functional impact, not from a laboratory test or a proven mechanism. This shared language is what makes reliable diagnosis, audit and research possible, and it deliberately avoids claiming an aetiology that psychiatry cannot yet demonstrate. Classification records what a person is experiencing and informs planning of care; it is not a moral judgement, and the legal questions of capacity and responsibility are decided separately in law.",
    difficulty: "easy",
    marks: 1,
    needsCheck: false, // ICD-11/DSM-5 are symptom-based, atheoretical classifications
  },

  // 2 — Aetiology and the biopsychosocial model (medium)
  {
    slug: "psyt306-stress-vulnerability-psychosis",
    concept: "aetiology-biopsychosocial",
    format: "sba",
    stem: "A 22-year-old man whose father had schizophrenia develops persecutory delusions and auditory hallucinations after months of sleep loss during examinations and daily cannabis use. Which explanation best fits the biopsychosocial (stress-vulnerability) model?",
    options: [
      "A latent vulnerability carried by family history lowered his threshold, and psychological and social stressors — sleep deprivation, cannabis and examination pressure — combined to push him over it, so no single factor is sufficient",
      "Cannabis alone caused the episode, because psychotic illness is always directly and completely substance-induced",
      "Family history is deterministic, so environmental stress and sleep loss could not have contributed",
      "The episode reflects weak character, which is the primary psychiatric explanation for vulnerability to psychosis",
    ],
    correctAnswer: "A latent vulnerability carried by family history lowered his threshold, and psychological and social stressors — sleep deprivation, cannabis and examination pressure — combined to push him over it, so no single factor is sufficient",
    explanation: "The diathesis-stress or stress-vulnerability model holds that a genetically carried vulnerability (schizophrenia is highly heritable) interacts with environmental stress to produce illness. Heavy cannabis use and sleep deprivation are recognised risk modifiers that raise risk and can precipitate a first episode, but they are neither necessary nor sufficient on their own. The model is deliberately neutral about blame: mental disorders arise from interacting biological, psychological and social factors, which is also why management addresses all three.",
    difficulty: "medium",
    marks: 1,
  },

  // 3 — Schizophrenia spectrum: criteria (medium)
  {
    slug: "psyt306-schizophrenia-duration-criteria",
    concept: "schizophrenia-spectrum",
    format: "sba",
    stem: "Which pattern, including its required duration, best satisfies DSM-5 criteria for schizophrenia?",
    options: [
      "At least 6 months of continuous signs of the disturbance, including at least 1 month of active-phase symptoms such as delusions, hallucinations or disorganised speech, with marked functional decline",
      "Two weeks of auditory hallucinations that resolve entirely once a depressive episode is adequately treated",
      "Six months of social withdrawal with anhedonia, but no delusions, hallucinations or disorganised speech",
      "One day of persecutory beliefs with confusion and fever that clear completely after antibiotics",
    ],
    correctAnswer: "At least 6 months of continuous signs of the disturbance, including at least 1 month of active-phase symptoms such as delusions, hallucinations or disorganised speech, with marked functional decline",
    explanation: "DSM-5 requires continuous signs of the disturbance for at least six months, with at least one month of active-phase symptoms: two or more of delusions, hallucinations, disorganised speech, grossly disorganised or catatonic behaviour, and negative symptoms. Schizoaffective disorder, depressive or bipolar disorder with psychotic features, substance-induced psychosis and psychosis due to another medical condition must be excluded before the diagnosis is settled. Shorter psychotic courses carry their own labels — under one month is brief psychotic disorder and one to six months is schizophreniform disorder.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // DSM-5: continuous signs ≥6 months, active phase ≥1 month
  },

  // 4 — Schizophrenia spectrum: first episode workup (hard)
  {
    slug: "psyt306-first-episode-psychosis-organic-workup",
    concept: "schizophrenia-spectrum",
    format: "sba",
    stem: "A 25-year-old woman presents with a first episode of persecutory delusions and complex visual hallucinations. Which first-line assessment best reflects the principle of excluding an organic cause before confirming a primary psychotic disorder?",
    options: [
      "Full history and collateral, mental state examination, substance use history, physical examination, and baseline tests — full blood count, urea and electrolytes, glucose, thyroid function, calcium, liver function, inflammatory markers, urinalysis, urine drug screen and ECG — with neuroimaging if focal signs or atypical features are present",
      "Start an antipsychotic immediately and forgo investigations, because no test can alter the diagnosis",
      "Prescribe an antidepressant first, since hallucinations in a young woman indicate depressive psychosis",
      "No examination or blood tests are required, because delusions are by definition psychiatric",
    ],
    correctAnswer: "Full history and collateral, mental state examination, substance use history, physical examination, and baseline tests — full blood count, urea and electrolytes, glucose, thyroid function, calcium, liver function, inflammatory markers, urinalysis, urine drug screen and ECG — with neuroimaging if focal signs or atypical features are present",
    explanation: "A first psychotic episode demands a search for a physical substrate: delirium, alcohol or drug intoxication and withdrawal, CNS infection or structural lesion, autoimmune encephalitis, and endocrine or metabolic disturbance such as thyroid disease, hypercalcaemia or hypoglycaemia. Hallucinations in a non-auditory modality, new onset in later life, clouded consciousness, confusion or focal neurology are red flags for an organic cause. Physical investigation is therefore routine at first presentation while the person's distress is treated actively and without stigma.",
    difficulty: "hard",
    marks: 1,
  },

  // 5 — Bipolar disorder: mania versus hypomania (medium)
  {
    slug: "psyt306-mania-versus-hypomania",
    concept: "bipolar-disorder",
    format: "sba",
    stem: "Which distinction correctly separates a hypomanic episode from a manic episode?",
    options: [
      "Hypomania lasts at least 4 consecutive days and is an observable change in functioning without marked impairment or psychosis; mania lasts at least 1 week (or any duration if hospitalisation is required) and causes marked impairment or psychotic features",
      "Hypomania always persists for more than a week and includes grandiose delusions, which are never seen in mania",
      "The two are distinguished by how many previous depressive episodes the person has experienced",
      "Hypomania is simply a normal period of high productivity that carries no clinical significance",
    ],
    correctAnswer: "Hypomania lasts at least 4 consecutive days and is an observable change in functioning without marked impairment or psychosis; mania lasts at least 1 week (or any duration if hospitalisation is required) and causes marked impairment or psychotic features",
    explanation: "Both are elevated or irritable mood episodes with increased energy and the associated features of reduced need for sleep, grandiosity, pressured speech and overspending. The separators are duration, severity and consequence: hypomania is at least four days, noticeable to others, and stops short of marked impairment, hospitalisation or psychosis, whereas mania crosses that line. Recognising hypomanic episodes is what separates bipolar from unipolar depression and matters clinically because antidepressant monotherapy can destabilise bipolar disorder.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // DSM-5: hypomania ≥4 days, mania ≥1 week or any duration if hospitalised
  },

  // 6 — Depressive disorders: criteria (easy)
  {
    slug: "psyt306-major-depressive-episode-criteria",
    concept: "depressive-disorders",
    format: "sba",
    stem: "Which combination of criteria is required for a DSM-5 major depressive episode?",
    options: [
      "Five or more symptoms over the same 2-week period, representing a change from previous functioning, and including at least depressed mood or loss of interest or pleasure, with clinically significant distress or impairment",
      "Low mood for at least 2 days following a stressful event with a full return to baseline",
      "Three symptoms over 2 weeks, none of which need be depressed mood or loss of interest",
      "Two years of low-grade symptoms with no period of complete remission",
    ],
    correctAnswer: "Five or more symptoms over the same 2-week period, representing a change from previous functioning, and including at least depressed mood or loss of interest or pleasure, with clinically significant distress or impairment",
    explanation: "The nine symptoms are depressed mood, markedly diminished interest or pleasure, significant weight or appetite change, insomnia or hypersomnia, psychomotor agitation or retardation, fatigue, worthlessness or excessive guilt, poor concentration, and recurrent thoughts of death. At least five must be present for two weeks, and at least one must be depressed mood or anhedonia — the two gate symptoms. A short adjustment reaction is subthreshold, while persistent depressive disorder is the chronic low-grade course lasting two years or more.",
    difficulty: "easy",
    marks: 1,
    needsCheck: false, // DSM-5: 5 of 9 symptoms, ≥2 weeks, ≥1 gate symptom
  },

  // 7 — Depressive disorders: grief versus depression (medium)
  {
    slug: "psyt306-grief-versus-depression",
    concept: "depressive-disorders",
    format: "sba",
    stem: "Eight weeks after his wife's death, a 60-year-old man describes waves of tearfulness triggered by reminders of her, a feeling of missing her, preserved self-esteem and talk of being with her again one day. Which pattern most suggests grief rather than a major depressive episode?",
    options: [
      "Emotion comes in waves and is triggered by reminders, self-esteem is preserved, and thoughts of death centre on reunion with the deceased — in contrast to the pervasive low mood, worthlessness and global loss of pleasure of depression",
      "Grief is a disorder whenever it lasts more than one month, and always requires antidepressant treatment",
      "Grief never involves tearfulness or sleep disturbance, so their presence proves depression",
      "Grief is by definition milder than depression and never needs any assessment or support",
    ],
    correctAnswer: "Emotion comes in waves and is triggered by reminders, self-esteem is preserved, and thoughts of death centre on reunion with the deceased — in contrast to the pervasive low mood, worthlessness and global loss of pleasure of depression",
    explanation: "Grief and depression share dysphoria, sleep and appetite disturbance and reduced functioning, so the differentiators are qualitative rather than numerical. In grief the affect comes in pangs triggered by reminders, self-worth is intact, and the yearning is to be with the person again; depression is a persistent emptiness, self-criticism, and pervasive anhedonia with thoughts of worthlessness or of not deserving to live. DSM-5 no longer treats bereavement as an exclusion, so grief and depression can coexist and clinical judgement, not the calendar, decides whether treatment is needed.",
    difficulty: "medium",
    marks: 1,
  },

  // 8 — Depressive disorders: responsible risk assessment (hard)
  {
    slug: "psyt306-suicide-risk-direct-enquiry",
    concept: "depressive-disorders",
    format: "sba",
    stem: "A patient with severe depression tells you that 'life is not worth living'. Which approach to assessing risk of self-harm is most appropriate?",
    options: [
      "Ask directly and calmly about thoughts of suicide, then explore intent, plan, access to means, preparatory acts, previous attempts and protective factors, and arrange proportionate follow-up and support",
      "Avoid the subject of suicide entirely, since raising it might put the idea into the patient's mind",
      "Enquire only if the patient already has a plan, because thoughts alone carry no weight",
      "Record a risk score and discharge the patient the same day with no follow-up or safety planning",
    ],
    correctAnswer: "Ask directly and calmly about thoughts of suicide, then explore intent, plan, access to means, preparatory acts, previous attempts and protective factors, and arrange proportionate follow-up and support",
    explanation: "Direct, compassionate enquiry does not increase suicidal thinking — evidence shows it lowers distress and opens an honest conversation, and it is the only way to assess intent, plan, access to means and preparatory behaviour. Risk is dynamic rather than a fixed trait, so assessment combines clinical interview with structured tools while remembering that no score on its own predicts behaviour; hopelessness, previous attempt, substance misuse, isolation and access to means are the important modifiers. Management includes safety planning, restricting access to means of harm, treating the underlying disorder, and same-day follow-up or crisis services when risk is high — never discharge on a score alone.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false, // direct enquiry does not confer/add to risk; no tool predicts behaviour
  },

  // 9 — Anxiety, phobia and OCD: panic disorder (medium)
  {
    slug: "psyt306-panic-disorder-recognition",
    concept: "anxiety-phobia-ocd",
    format: "sba",
    stem: "A 34-year-old woman reports sudden surges of fear with palpitations, sweating, dizziness and a fear of dying, now worries constantly about further attacks, and has stopped using public transport. Which pattern best fits panic disorder with agoraphobia?",
    options: [
      "Recurrent unexpected panic attacks followed by at least a month of persistent worry about further attacks or their consequences, or maladaptive behaviour change such as avoidance",
      "Attacks that occur only when speaking in public, with no spontaneous attacks and no anxiety between them",
      "A single panic attack with no further symptoms, which confirms the diagnosis",
      "Breathlessness that appears only on exertion and settles with rest, unaccompanied by fear",
    ],
    correctAnswer: "Recurrent unexpected panic attacks followed by at least a month of persistent worry about further attacks or their consequences, or maladaptive behaviour change such as avoidance",
    explanation: "A panic attack is the common substrate of panic disorder, social anxiety disorder, specific phobia and PTSD, so it is the pattern around the attacks that decides the diagnosis. Panic disorder requires recurrent unexpected attacks plus at least a month of anticipatory worry or behavioural change, and agoraphobia is the fear or avoidance of situations where escape or help might be difficult. Attacks cued only by performance situations suggest social anxiety disorder, a single attack is not a diagnosis, and exertional breathlessness relieved by rest warrants cardiac assessment.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // DSM-5: recurrent unexpected attacks + ≥1 month of worry/behaviour change
  },

  // 10 — Anxiety, phobia and OCD: OCD versus OCPD (medium)
  {
    slug: "psyt306-ocd-versus-ocpd",
    concept: "anxiety-phobia-ocd",
    format: "sba",
    stem: "Which pattern distinguishes obsessive-compulsive disorder from obsessive-compulsive personality disorder?",
    options: [
      "Obsessions and compulsions in OCD are ego-dystonic — resisted, time-consuming and unwanted — whereas the rigid perfectionism and control of obsessive-compulsive personality disorder are ego-syntonic and experienced as part of the self",
      "OCD is ego-syntonic and experienced as pleasant, while obsessive-compulsive personality traits are distressing and resisted",
      "Both require obsessions and compulsions, and the only difference is the patient's age",
      "Neither involves repetitive behaviour, so they are separated by the absence of any rituals",
    ],
    correctAnswer: "Obsessions and compulsions in OCD are ego-dystonic — resisted, time-consuming and unwanted — whereas the rigid perfectionism and control of obsessive-compulsive personality disorder are ego-syntonic and experienced as part of the self",
    explanation: "In OCD the obsessions (intrusive, unwanted thoughts, images or urges) and the compulsions performed to neutralise anxiety are resisted rather than enjoyed, are time-consuming (often more than an hour a day), and are usually accompanied by insight that they are excessive. In obsessive-compulsive personality disorder the rigid perfectionism, orderliness and need for control are consistent with the person's values and self-image, and cause distress primarily through their consequences. First-line treatment for OCD is exposure and response prevention, combined with an SSRI in moderate to severe illness, whereas obsessive-compulsive personality disorder is not simply a milder OCD and calls for different psychological work.",
    difficulty: "medium",
    marks: 1,
  },

  // 11 — Somatoform and dissociative disorders (medium)
  {
    slug: "psyt306-functional-neurological-symptom-disorder",
    concept: "somatoform-dissociative",
    format: "sba",
    stem: "A 30-year-old woman develops sudden left-sided leg weakness. Examination shows normal tone and reflexes, weakness that varies with attention, a positive Hoover's sign, and extensive investigations are normal. Which management is most appropriate?",
    options: [
      "Give a positive diagnosis of functional neurological symptom disorder, explain the rule-in signs, avoid repeated negative investigations, and refer for specialist physiotherapy and psychological therapy",
      "Tell the patient that 'nothing is wrong' and keep repeating investigations until an organic cause emerges",
      "Explain that the symptoms are deliberately feigned and withdraw further treatment",
      "Start high-dose long-term opioids for the pain while awaiting an organic diagnosis",
    ],
    correctAnswer: "Give a positive diagnosis of functional neurological symptom disorder, explain the rule-in signs, avoid repeated negative investigations, and refer for specialist physiotherapy and psychological therapy",
    explanation: "Functional neurological symptom disorder (conversion disorder) is a genuine and common neuropsychiatric condition, diagnosed by positive, internally inconsistent signs such as Hoover's sign, give-way weakness that varies with attention, and distractibility — not simply by excluding disease. An explanation that names the diagnosis, shows the person the positive findings and validates the reality of the symptoms reduces distress and improves outcome; repeated negative testing and 'nothing is wrong' messaging reinforce worry and disability. Management is multidisciplinary specialist physiotherapy and psychological therapy, usually CBT, and older features such as la belle indifference are neither sensitive nor specific and are not relied upon.",
    difficulty: "medium",
    marks: 1,
  },

  // 12 — Stress-related disorders (medium)
  {
    slug: "psyt306-ptsd-versus-acute-stress-disorder",
    concept: "stress-personality-disorders",
    format: "sba",
    stem: "Which pattern correctly separates acute stress disorder from post-traumatic stress disorder?",
    options: [
      "Acute stress disorder begins within 3 days of the trauma and lasts up to 1 month, whereas PTSD requires symptoms persisting beyond 1 month and may have delayed onset",
      "Acute stress disorder lasts more than 3 months, whereas PTSD always resolves within a month",
      "Both require the same minimum duration and are separated only by the type of trauma experienced",
      "PTSD requires a single catastrophic event and cannot follow abuse, serious illness or repeated adversity",
    ],
    correctAnswer: "Acute stress disorder begins within 3 days of the trauma and lasts up to 1 month, whereas PTSD requires symptoms persisting beyond 1 month and may have delayed onset",
    explanation: "Both follow exposure to actual or threatened death, serious injury or sexual violence and share intrusion, avoidance of trauma reminders, negative alterations in cognition and mood, and marked hyperarousal; the distinction is the time course. DSM-5 places acute stress disorder between three days and one month, and PTSD at more than one month, with the full syndrome sometimes expressed later. Trauma-focused CBT and EMDR are the first-line psychological treatments, and most people exposed to trauma do not develop PTSD — social support, early care and treatment of acute symptoms shape that course.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // DSM-5: ASD 3 days–1 month, PTSD >1 month
  },

  // 13 — Personality disorders (medium)
  {
    slug: "psyt306-emotionally-unstable-personality-recognition",
    concept: "stress-personality-disorders",
    format: "sba",
    stem: "A 25-year-old woman presents after cutting her forearm. She describes long-standing frantic efforts to avoid abandonment, intense but unstable relationships, a rapidly shifting sense of self, and rapid emotional swings from idealisation to contempt, present across many contexts since her late teens. Which diagnosis best fits?",
    options: [
      "Emotionally unstable (borderline) personality disorder — a persistent pattern of emotional dysregulation, unstable relationships and self-image, impulsivity and recurrent self-harm present across contexts from early adulthood",
      "Bipolar affective disorder, because all rapid mood changes are manic episodes",
      "Paranoid personality disorder, driven by a pervasive mistrust and suspicion of others' motives",
      "A depressive episode that began abruptly in later life following a bereavement, with no prior pattern",
    ],
    correctAnswer: "Emotionally unstable (borderline) personality disorder — a persistent pattern of emotional dysregulation, unstable relationships and self-image, impulsivity and recurrent self-harm present across contexts from early adulthood",
    explanation: "Emotionally unstable (borderline) personality disorder is defined by five or more of a persistent pattern of abandonment fears, intense and unstable relationships, identity disturbance, impulsivity in at least two potentially damaging areas, recurrent suicidal behaviour or self-harm, affective instability, chronic emptiness, difficulty controlling anger, and transient paranoid or dissociative symptoms. These are enduring traits present in many contexts from early adulthood, not discrete episodes: bipolar shifts last days to weeks and include mania or depression, while paranoid personality disorder is dominated by pervasive distrust. First-line treatment is a structured psychological therapy such as dialectical behaviour therapy or mentalisation-based therapy, with medication reserved for comorbid symptoms. Self-harm in this context is most often an attempt to regulate intolerable emotion rather than to die.",
    difficulty: "medium",
    marks: 1,
  },

  // 14 — Alcohol and drug dependence: withdrawal (medium)
  {
    slug: "psyt306-alcohol-withdrawal-management",
    concept: "alcohol-drug-dependence",
    format: "sba",
    stem: "A man with long-standing alcohol dependence stops drinking and 48 hours later is tremulous, anxious, sweating and tachycardic, with fluctuating disorientation and misperceptions. Which management is most appropriate?",
    options: [
      "Assess withdrawal severity with a symptom-triggered protocol such as CIWA-Ar, give benzodiazepines, correct dehydration and electrolytes, and give parenteral thiamine before carbohydrate to prevent Wernicke's encephalopathy",
      "Withhold benzodiazepines because they share cross-tolerance with alcohol, and treat with fluids alone",
      "Give intravenous glucose first and add thiamine only if the confusion worsens",
      "Prescribe a beta-blocker as the definitive treatment and discharge him with no follow-up",
    ],
    correctAnswer: "Assess withdrawal severity with a symptom-triggered protocol such as CIWA-Ar, give benzodiazepines, correct dehydration and electrolytes, and give parenteral thiamine before carbohydrate to prevent Wernicke's encephalopathy",
    explanation: "Tremor and anxiety begin within 6 to 24 hours of the last drink, withdrawal seizures typically occur around 12 to 48 hours, and delirium tremens arises at 48 to 96 hours with a real mortality when untreated. Benzodiazepines are first-line because they act at the same GABA-A receptor as alcohol, and symptom-triggered dosing reduces both total dose and duration compared with fixed regimens. Parenteral thiamine must precede carbohydrate because a glucose load can precipitate Wernicke's encephalopathy in a thiamine-deficient patient, with magnesium and potassium corrected alongside fluids. Discharge should be linked to relapse-prevention support rather than left to chance.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // tremors 6-24h, seizures 12-48h, delirium tremens 48-96h; thiamine before glucose
  },

  // 15 — Alcohol and drug dependence: opioid overdose (hard)
  {
    slug: "psyt306-opioid-overdose-naloxone",
    concept: "alcohol-drug-dependence",
    format: "sba",
    stem: "A person with opioid dependence is found unresponsive with a respiratory rate of 6/min and pinpoint pupils. Which sequence is most appropriate?",
    options: [
      "Support ventilation and give naloxone intranasally or intramuscularly titrated to restore breathing rather than full arousal, then link to treatment of opioid dependence with methadone or buprenorphine plus psychosocial support",
      "Give naloxone and stop there, since the withdrawal it precipitates shows the person no longer needs treatment",
      "Start methadone immediately during the overdose episode itself",
      "Give flumazenil, the specific antidote for opioid overdose",
    ],
    correctAnswer: "Support ventilation and give naloxone intranasally or intramuscularly titrated to restore breathing rather than full arousal, then link to treatment of opioid dependence with methadone or buprenorphine plus psychosocial support",
    explanation: "Naloxone is a competitive opioid antagonist that reverses the respiratory depression of opioid overdose; it is titrated to restore adequate breathing because a full bolus can precipitate severe withdrawal, and because it is shorter-acting than most opioids the person must be observed for recurrence. Flumazenil reverses benzodiazepines, not opioids. Naloxone saves lives but is not a treatment for dependence: opioid substitution therapy with methadone or buprenorphine, alongside psychosocial treatment and take-home naloxone, is the evidence-based path that reduces mortality, overdose and transmission of blood-borne infection.",
    difficulty: "hard",
    marks: 1,
  },

  // 16 — Child and adolescent disorders (easy)
  {
    slug: "psyt306-adhd-recognition",
    concept: "child-adolescent-disorders",
    format: "sba",
    stem: "Which pattern is most consistent with attention-deficit/hyperactivity disorder in a school-age child?",
    options: [
      "Several inattentive and/or hyperactive-impulsive symptoms present before age 12, persisting for at least 6 months, evident in at least two settings such as home and school, and reducing functioning relative to developmental level",
      "Restlessness seen only in the classroom that disappears by the evening, with entirely normal behaviour at home",
      "Deliberate defiance of adult instructions beginning in adolescence, with no earlier difficulty",
      "A short period of poor attention after changing schools that resolves within a few weeks",
    ],
    correctAnswer: "Several inattentive and/or hyperactive-impulsive symptoms present before age 12, persisting for at least 6 months, evident in at least two settings such as home and school, and reducing functioning relative to developmental level",
    explanation: "ADHD is a neurodevelopmental disorder: symptoms must be present for at least six months, in two or more settings, before the age of 12, and must impair academic, social or family functioning. Symptoms confined to one setting more often reflect anxiety, a specific learning difficulty or the classroom environment itself, and conduct disorder is a separate pattern of violating rights and rules rather than inattention. Management is stepped — psychoeducation, parent training and classroom accommodations first, with a stimulant such as methylphenidate for severe or refractory impairment.",
    difficulty: "easy",
    marks: 1,
    needsCheck: false, // DSM-5: onset <12 years, ≥6 months, ≥2 settings
  },

  // 17 — Psychological therapies and counselling (easy)
  {
    slug: "psyt306-cbt-first-line-indications",
    concept: "therapies-counselling",
    format: "sba",
    stem: "Which statement best describes the evidence-based use of cognitive behavioural therapy?",
    options: [
      "A structured, time-limited, collaborative therapy working on the links between thoughts, feelings, physiology and behaviour, and first-line for depression, anxiety disorders and PTSD, and the core of OCD treatment as exposure and response prevention",
      "A therapy reserved only for patients who have already failed at least three antidepressants",
      "A treatment that changes behaviour only and deliberately ignores thoughts and bodily symptoms",
      "A form of hypnosis that accesses unconscious conflict in order to resolve symptoms",
    ],
    correctAnswer: "A structured, time-limited, collaborative therapy working on the links between thoughts, feelings, physiology and behaviour, and first-line for depression, anxiety disorders and PTSD, and the core of OCD treatment as exposure and response prevention",
    explanation: "CBT is a present-focused, goal-directed and evidence-based therapy in which therapist and patient test and modify unhelpful thinking and behaviour patterns; it works face-to-face and in guided digital form. It is recommended first-line, alone or combined with medication, for depression, generalised anxiety disorder, panic disorder, phobias, PTSD (as trauma-focused CBT) and OCD, where it is delivered as exposure and response prevention, while CBT for insomnia is the first-line treatment for chronic insomnia. Other modalities fill specific roles — motivational interviewing for substance-use behaviour, behavioural parent training in ADHD — but a person should never have to fail three antidepressants before being offered psychological therapy.",
    difficulty: "easy",
    marks: 1,
  },

  // 18 — Psychological testing and psychiatric emergencies (medium)
  {
    slug: "psyt306-rating-scales-and-agitation",
    concept: "psychological-testing-emergencies",
    format: "sba",
    stem: "Which statement about psychiatric rating scales and the acute management of agitation is most accurate?",
    options: [
      "Validated scales such as the PHQ-9, GAD-7 and MMSE quantify severity and track change but do not make the diagnosis, and acute agitation is managed first through engagement and verbal de-escalation, with medication offered orally where possible and physical monitoring regardless of route",
      "A PHQ-9 score of 15 is diagnostic of depression, so clinical interviewing adds nothing further",
      "Rating scales must never be repeated, because the score is a fixed measurement of severity",
      "Intramuscular rapid tranquillisation is always the first and preferred step in managing agitation",
    ],
    correctAnswer: "Validated scales such as the PHQ-9, GAD-7 and MMSE quantify severity and track change but do not make the diagnosis, and acute agitation is managed first through engagement and verbal de-escalation, with medication offered orally where possible and physical monitoring regardless of route",
    explanation: "Screening and rating instruments such as PHQ-9, GAD-7, YBOCS and MMSE standardise assessment, quantify severity and allow change to be tracked, but diagnosis is still made clinically from history and mental state examination, and scales are repeated precisely because severity changes over time. For agitation the priorities are to look for physical causes such as hypoxia, hypoglycaemia, head injury, intoxication, withdrawal or delirium, to reduce stimulation, to keep one member of staff leading the communication, and to offer oral treatment before parenteral as part of a graded response. Whichever route is used, physical observations, capacity and the least restrictive effective option must inform the decision, and projective personality tests have no role in the acute assessment.",
    difficulty: "medium",
    marks: 1,
  },
];

async function seedAssessmentPsychiatry() {
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
        // Post-repair convention: production rows never sit at "draft".
        reviewStatus: "needs-human-review",
        needsCheck: it.needsCheck ?? false,
      },
    });
    count++;
  }

  console.log(`✓ PSYT 306 assessment items: ${count} items (marks 1, needs-human-review)`);
}

// CLI usage: npx ts-node prisma/seed-assessment-psychiatry.ts
if (process.argv[1] && process.argv[1].includes("seed-assessment-psychiatry")) {
  seedAssessmentPsychiatry()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}

export { seedAssessmentPsychiatry, ITEMS as PSYCHIATRY_ITEMS };
