import { prisma, seedMbbsCourse, type SubjectSeed } from "./spine";
import type { LessonContent } from "@/types/lesson";

const PLACEHOLDER: LessonContent = { blocks: [] };

// ---------------------------------------------------------------------------
// LESSON 1 — Concepts of health & disease (fully authored)
// ---------------------------------------------------------------------------
function lesson1() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: state the WHO definition of health and list the dimensions of health beyond the physical; name the determinants of population health; describe the natural history of disease in its pre-pathogenesis and pathogenesis phases and explain the concept of the iceberg of disease; and apply the four levels of prevention — primordial, primary, secondary and tertiary — to a real disease, which is the framework on which all community medicine practice rests.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "None. This is the first lesson of the Community Medicine course and needs no prior medical study.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Health (WHO 1948)",
        text: "A state of complete physical, mental and social well-being and not merely the absence of disease or infirmity. The definition is deliberately positive — health is something people possess, not a condition they lack — and it is a fundamental resource for everyday life, not the object of living.",
      },
      {
        type: "paragraph",
        text: "Biology gives you one view of a patient: organs, chemistry, genes. Community medicine gives you the other view: the person at home, at work and in a community, and the forces acting on that community. This discipline exists because the pattern of disease in populations does not follow from cells alone — a cholera outbreak is decided by the water supply, thalassaemia by marriage patterns, lung cancer by a tobacco habit, and each of these is invisible in a single patient's blood test. Every idea in the course — epidemiology, biostatistics, nutrition, environment, maternal and child health, national programmes — is an application of one thought: disease is produced by the interaction of an agent, a host and an environment, and prevention means interrupting that interaction at its weakest point.",
      },

      { type: "heading", level: 2, text: "The dimensions of health" },
      {
        type: "paragraph",
        text: "Because health is defined as well-being and not merely the absence of disease, it has several dimensions, and a person can be well in some while unwell in others. A patient in remission from cancer whose mental health is destroyed by that diagnosis is not healthy in the WHO sense, and neither is a physically fit young adult with no meaningful social relationships.",
      },
      {
        type: "table",
        headers: ["Dimension", "What it covers", "How it is threatened", "Who measures it"],
        rows: [
          ["Physical", "Anatomy, physiology, functioning of the body", "Infection, injury, malnutrition, chronic disease, disability", "Clinical examination, biochemistry, growth charts"],
          ["Mental", "Thought, cognition, emotional state", "Depression, anxiety, psychosis, dementia, stress", "Mental state examination, screening scores"],
          ["Social", "Roles, family, work, community participation", "Poverty, discrimination, isolation, displacement", "Family and social history, community surveys"],
          ["Spiritual", "Belief, purpose, the sense that life is coherent", "Loss of faith, hope or meaning, especially in terminal illness", "History-taking, chaplaincy and palliative services"],
          ["Emotional", "The felt quality of daily life", "Chronic stress, bereavement, abuse", "Clinical interview, mental health assessment"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The dimensions are not compartments — they are coupled. Chronic anxiety raises blood pressure and impairs wound healing; poverty worsens tuberculosis both through crowded housing and through delayed diagnosis; and social isolation is an independent predictor of death in old age. Population health programmes succeed or fail on exactly these couplings, which is why the departments that own prevention and the departments that own treatment both stand on the WHO definition.",
      },

      { type: "heading", level: 2, text: "What determines the health of a population" },
      {
        type: "paragraph",
        text: "Health is produced by more than medical care. Modern teaching groups the determinants into five domains, and the ordering matters, because the determinants nearest the top of the list are the ones that medicine touches least directly and needs most help to change.",
      },
      {
        type: "table",
        headers: ["Determinant", "Examples", "Lever for change"],
        rows: [
          ["Biological (endogenous)", "Genes, age, sex, immunity, body habitus", "Screening, genetic counselling, immunisation"],
          ["Behavioural and lifestyle", "Tobacco, alcohol, diet, physical inactivity, sexual behaviour, seat-belt use", "Health education, taxes and legislation, behaviour-change counselling"],
          ["Environment", "Water, air, housing, vector control, workplace exposure, climate", "Sanitary engineering, environmental law, urban planning"],
          ["Socio-economic conditions", "Income, education, occupation, gender, social capital, caste and class inequity", "Education policy, poverty programmes, protective legislation"],
          ["Health services", "Coverage, accessibility, affordability, quality, continuity", "Primary health care, staffing, drug supply, financing"],
        ],
      },
      {
        type: "paragraph",
        text: "The relative weight of the domains is the subject of the famous McKeown thesis: the great decline in mortality from tuberculosis and the water- and food-borne diseases preceded effective medical treatment and tracked improved nutrition and sanitation instead. That is not an argument against medicine; it is an argument that medicine's contribution to population health is only fully realised when the other determinants are addressed.",
      },

      { type: "heading", level: 2, text: "The natural history of disease" },
      {
        type: "paragraph",
        text: "Every disease runs a course, and the course begins before the patient and before the doctor. Dividing that course into a pre-pathogenesis phase and a pathogenesis phase tells you where each preventive act belongs: the first phase is the domain of community medicine, the second is the domain of clinical medicine.",
      },
      {
        type: "table",
        headers: ["Phase", "What is happening", "Clinical visibility", "Where prevention acts"],
        rows: [
          ["Pre-pathogenesis", "Agent, host and environment interact before disease exists (the epidemiological triad)", "Nothing to see", "Primordial and primary prevention"],
          ["Early pathogenesis", "The agent has entered the host; tissue changes begin; no symptoms yet", "Subclinical; laboratory signs may already be positive", "Primary and secondary prevention (screening)"],
          ["Clinically apparent disease", "Signs and symptoms appear; the patient seeks care", "Overt", "Secondary prevention: early diagnosis and prompt treatment"],
          ["Outcome", "Recovery, chronicity, disability or death", "Overt", "Tertiary prevention: disability limitation and rehabilitation"],
        ],
      },
      {
        type: "definition",
        term: "Epidemiological triad",
        text: "The model of disease causation in which an agent (biological, physical, chemical, nutritional or genetic), a host (with age, sex, genetic makeup, nutritional status, immune state and behaviour as its relevant factors) and an environment (physical, biological and social) together determine whether disease occurs. Disease follows when the balance between the three is upset.",
      },
      {
        type: "paragraph",
        text: "For communicable disease the triad works plainly: the tubercle bacillus (agent) entering an under-nourished slum dweller (host) living in a crowded, poorly ventilated room (environment) produces tuberculosis. For non-communicable disease the agent is often multiple — dietary salt, inactivity and genetic risk for hypertension — which is why modern teaching speaks of the web of causation rather than of a single agent.",
      },

      { type: "heading", level: 2, text: "The iceberg of disease" },
      {
        type: "definition",
        term: "Iceberg of disease",
        text: "The model that shows the clinically apparent cases of a disease as the tip above the waterline, while the much larger mass of subclinical, mild, undiagnosed and carrier cases lies hidden below. What a doctor sees in clinic is the tip; what a community actually contains is the whole iceberg.",
      },
      {
        type: "paragraph",
        text: "Poliomyelitis is the textbook illustration: for every paralytic case there are hundreds of infections, and a village with one flaccid paralysis carries a silent infected population. The iceberg is why prevalence surveys find far more hypertension, diabetes, anaemia, cataract and tuberculosis than any clinic will ever register, and it is the logical foundation of screening, which is exactly the technology of looking below the waterline.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The iceberg also warns against judging a community by its clinic. A single positive HIV test in a village is not a reliable measure of village prevalence; a low registration of anaemia at a primary health centre may reflect absent testing rather than absent disease. Community diagnosis needs community data — the household survey, the screening camp, the school examination — not the clinic register alone.",
      },

      { type: "heading", level: 2, text: "Levels of prevention" },
      {
        type: "paragraph",
        text: "Prevention is not one act but four, and the examiners' favourite question is exactly the difference between them. Read the four levels as four moments in the life of a disease: before the risk factor appears (primordial), before the disease appears (primary), at its first silent appearance (secondary), and after it has declared itself (tertiary).",
      },
      {
        type: "table",
        headers: ["Level", "What it interrupts", "Typical acts", "Who delivers it"],
        rows: [
          ["Primordial", "The appearance of risk factors in a population", "National food policy, tobacco and alcohol taxation, urban design that promotes activity", "Governments, legislators, planners"],
          ["Primary", "The onset of disease in a person at risk", "Health promotion (education, lifestyle) and specific protection: immunisation, nutrition, micronutrient supplements, condoms, vector control, safety laws", "Primary care, schools, workplaces, public health programmes"],
          ["Secondary", "Progression of early, silent disease", "Screening (BP, blood sugar, cervical cytology, chest X-ray for TB contacts), early diagnosis, prompt treatment, disability limitation (e.g. treating a leprosy nerve abscess)", "Health services, screening camps, eye and cancer programmes"],
          ["Tertiary", "Disability after disease is established", "Rehabilitation: physiotherapy, prosthesis, vocational training, support groups, disability certification", "Rehabilitation services, community-based rehabilitation, palliative care"],
        ],
      },
      {
        type: "example",
        text: "Worked example — type 2 diabetes across the four levels. Primordial: a state policy that requires front-of-pack labelling of sugar in packaged foods, and safe walking routes in a new township. Primary: a school programme that replaces sweetened drinks with drinking water, and a primary care campaign for weight control. Secondary: opportunistic screening of adults over 30 at every clinic visit for blood glucose and BP, and early treatment of impaired glucose tolerance. Tertiary: foot care education, retinal screening to prevent blindness, and vocational rehabilitation for a labourer who has lost a leg to diabetic gangrene. Each level is a different service with a different owner — a policy maker, a teacher, a physician and a rehabilitation worker — and all four belong to one programme.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing primordial with primary prevention. The dividing line is whether the risk factor already exists in the population. A law taxing tobacco is primordial: it stops the habit spreading. Counselling an individual smoker to stop, or immunising a child, is primary: it acts on a person who is at risk. If an option mentions a law, policy or the design of the environment, it is usually the primordial answer.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Calling every level of treatment secondary prevention. Secondary prevention is defined by earliness — it ends once clinical disease has declared itself. Early diagnosis, prompt treatment and disability limitation (treating a complication to stop it becoming a disability) all sit under secondary; rehabilitation, physical and social, sits under tertiary.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating the iceberg as a rare curiosity. The gap between the tip and the submerged mass is the normal situation in diseases with a long silent phase, and it is the reason a community with one diagnosed case of leprosy or one crippled case of polio is treated as an outbreak: the unseen cases are the ones transmitting.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A state bans the manufacture of gutkha. Which level of prevention is this, and why?",
        answer: "Primordial prevention. The ban removes the exposure before the habit can become established in the population, so it prevents the risk factor itself rather than protecting individuals already at risk.",
        explanation: "The test is always what the intervention is aimed at: the exposure (primordial), the person at risk (primary), the silent disease (secondary), or the disability (tertiary).",
      },
      {
        type: "question",
        prompt: "Why does the iceberg of disease make clinic-based statistics an unreliable measure of how common a disease is in a community?",
        answer: "Because the cases that reach the clinic are only the clinically apparent tip; the subclinical, mild and undiagnosed cases never present and are therefore absent from clinic records, while common diseases with a long silent phase have most of their mass below the waterline.",
        explanation: "This is precisely why community measurement needs surveys and screening rather than clinic data, and why incidence and prevalence are estimated from population studies.",
      },
      {
        type: "question",
        prompt: "Which determinant of health is a village water supply an example of, and which level of prevention does a chlorinated piped supply represent for cholera?",
        answer: "The water supply is an environmental determinant. Chlorinated piped water is primary prevention against cholera: it acts on the transmission route before disease can occur.",
        explanation: "Primary prevention includes specific protection through environmental control of a hazard, alongside the more familiar immunisation.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which of the following is an act of primordial prevention?",
        options: [
          "Immunising an infant against hepatitis B",
          "A national law that bans the manufacture of gutkha",
          "Screening all adults over 30 for hypertension",
          "Physiotherapy after a stroke",
        ],
        correctIndex: 1,
        explanation: "The law removes the exposure from the population before the habit can form, which is the definition of primordial prevention. Immunisation is primary, hypertension screening is secondary, and post-stroke physiotherapy is tertiary.",
      },
      {
        type: "mcq",
        stem: "A district health office finds smear-positive tuberculosis in villagers who have never attended a clinic. Which concept explains why such hidden cases exist?",
        options: [
          "The web of causation",
          "The iceberg of disease",
          "The levels of prevention",
          "The McKeown thesis",
        ],
        correctIndex: 1,
        explanation: "The smear-positive cases that no clinic has found are the submerged part of the iceberg: they are real cases that exist below the level of clinical visibility, which is why community screening finds more disease than clinic registers show.",
      },
      {
        type: "mcq",
        stem: "Disability limitation — for example, draining a nerve abscess in leprosy to prevent a claw hand — belongs to which level of prevention?",
        options: [
          "Primordial prevention",
          "Primary prevention",
          "Secondary prevention",
          "Tertiary prevention",
        ],
        correctIndex: 2,
        explanation: "Disability limitation acts on early disease to stop it progressing into disability, which places it within secondary prevention. Only once the disability exists does prevention become tertiary, and only rehabilitation remains.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 2 — Behavioural sciences & communication (fully authored)
// ---------------------------------------------------------------------------
function lesson2() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: explain why prevention depends on behaviour and what the behavioural sciences contribute to changing it; describe the elements of doctor-patient communication, including the non-verbal channel, and conduct an open-ended interview; state the components of the Health Belief Model and the Stages of Change model and apply them to a patient; and select a counselling framework for a concrete clinical task such as stopping tobacco, starting contraception or supporting adherence.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (Concepts of health and disease). Prevention works on the person and the population, so it needs the levels of prevention and the determinants framework, and every act of counselling is an act of primary prevention.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Behaviour change in clinical practice",
        text: "The process by which a person and a clinician together move a health behaviour — smoking, diet, adherence, contraception, hand-washing, safe sex — from its current state to a healthier one, using the patient's own beliefs, motivation, skills and supports rather than instruction alone.",
      },
      {
        type: "paragraph",
        text: "A drug works whether or not the patient believes in it. A behaviour does not. No public health gain of the last two centuries — immunisation, sanitation, tobacco control, safe delivery — was achieved by telling people what was good for them; each was achieved by changing what people, communities and institutions do. That makes communication the single most-used instrument in community medicine: between the doctor and the patient, and between the programme and the population. The failure this lesson exists to prevent is the lecture: advice delivered without listening produces information without behaviour, and the same obesity, hypertension and adherence problems come back next visit.",
      },

      { type: "heading", level: 2, text: "The doctor-patient consultation" },
      {
        type: "paragraph",
        text: "Communication runs on two channels at once, and only one of them is words. A patient whose words say 'I am fine' while the eyes look away and the hands tremble has told you two things, and the second is usually the true one.",
      },
      {
        type: "table",
        headers: ["Channel", "Elements", "What it carries", "Clinical use"],
        rows: [
          ["Verbal", "Word choice, volume, pace, clarity, jargon level", "Facts, history, explanations", "Open questions first; closed questions to confirm specifics"],
          ["Non-verbal", "Facial expression, eye contact (oculesics), gesture (kinesics), personal space (proxemics), tone and timing of speech (paralanguage), touch", "Emotion, distress, engagement, cultural signals", "Noticing disagreement, pain, fear or low mood that the words hide"],
        ],
      },
      {
        type: "paragraph",
        text: "The interview that works in prevention starts wide and narrows: open questions to find the problem, closed questions for detail, and summary and teach-back to confirm understanding. Teach-back — 'so that I know I have explained it well, tell me in your own words what you are going to do tomorrow' — is the single most effective check that a message has arrived, and it exposes the misunderstanding that a nod conceals.",
      },
      {
        type: "example",
        text: "A 55-year-old man with a blood pressure of 170/100 has been told for the third year to 'reduce salt'. This time the resident asks instead: 'What does a day of eating look like for you?' The answer is pickles with every meal, papad, and salt added at the table. The discussion is now concrete: which item can be dropped first, how the family cooks, what he can carry to work — and the patient, not the doctor, chooses the first step.",
      },

      { type: "heading", level: 2, text: "Barriers to communication — and how each is cleared" },
      {
        type: "table",
        headers: ["Barrier", "How it shows", "How it is cleared"],
        rows: [
          ["Low literacy", "Nods, 'yes' without content, inability to read a prescription", "Plain language, pictorial instructions, teach-back, a family member present"],
          ["Language and dialect", "Bewilderment, monosyllabic replies", "Interpreter, translated material, the community health worker"],
          ["Fear, stigma and mistrust", "Late presentation, missed follow-up, concealment (TB, HIV, mental illness)", "Confidentiality stated up front, non-judgemental phrasing, consistent care"],
          ["Socio-economic constraints", "Advice the patient cannot afford or cannot act on", "Ask about cost, work and travel before advising; choose the feasible option"],
          ["The doctor's own style", "Interruption, jargon, closed questioning, a screen between doctor and patient", "Structured consultation: listen first, then agree the plan with the patient"],
          ["Setting", "No privacy in a crowded OPD or on a ward round", "A quiet room, curtains drawn, time explicitly created"],
        ],
      },

      { type: "heading", level: 2, text: "Why people do what they do: the belief models" },
      {
        type: "paragraph",
        text: "Behaviour is predictable once you know the beliefs behind it, and the two models below are the most useful in clinical work. Neither is a law; both are organisers that tell you what to ask next.",
      },
      {
        type: "table",
        headers: ["Health Belief Model component", "The question it answers", "Example — a woman refusing cervical screening"],
        rows: [
          ["Perceived susceptibility", "Do I believe this could happen to me?", "'My mother never had cancer'"],
          ["Perceived severity", "How bad do I think it would be?", "'Even if it is cancer, it cannot be cured'"],
          ["Perceived benefits", "Do I think the action would help?", "'Even if I have it, what will one test give me?'"],
          ["Perceived barriers", "What does the action cost me?", "'The clinic is far, the queue is long, a man examines women'"],
          ["Cues to action", "What would prompt me to act?", "A reminder from the ASHA worker; the camp held on a working day"],
          ["Self-efficacy", "Do I believe I can do it?", "'I cannot leave the children'"],
        ],
      },
      {
        type: "paragraph",
        text: "The Health Belief Model explains the why of an action; the Stages of Change model explains the when. A person moves from not considering change, to considering it, to preparing to act, to acting, to maintaining — and relapses along the way are the rule rather than the exception. The clinical implication is decisive: advice must fit the stage. Telling someone in pre-contemplation to 'cut down' wastes the visit; asking what they like about smoking, and then what they would not like about their child copying it, moves the stage.",
      },
      {
        type: "table",
        headers: ["Stage", "What the person says", "The clinician's move"],
        rows: [
          ["Pre-contemplation", "'I don't have a problem.'", "Raise awareness; give information without imposing a target"],
          ["Contemplation", "'I know I should, but...'", "Explore ambivalence; weigh the pros and cons with the patient"],
          ["Preparation", "'I will stop from next month.'", "Set a concrete date, plan for triggers, arrange follow-up"],
          ["Action", "'I stopped five weeks ago.'", "Praise, problem-solve the withdrawal, reinforce"],
          ["Maintenance", "'It has been a year and I am still off.'", "Guard against relapse; review the benefits that sustain it"],
        ],
      },

      { type: "heading", level: 2, text: "Counselling frameworks for prevention tasks" },
      {
        type: "table",
        headers: ["Task", "Framework", "The steps"],
        rows: [
          ["Tobacco, alcohol, physical activity, diet", "The 5 A's", "Ask, Advise, Assess, Assist (plan, support, pharmacotherapy), Arrange follow-up"],
          ["Contraception, adherence, newborn care", "GATHER", "Greet, Ask, Tell, Help (choose a method or a plan), Explain, Return (follow-up)"],
          ["Any long-term behaviour", "Motivational interviewing", "Express empathy; develop discrepancy; roll with resistance; support self-efficacy"],
          ["HIV, TB, genetic disease", "Pre- and post-test counselling", "Information before the test; informed consent; support after the result"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "'Roll with resistance' is the part most often done backwards. Arguing with a patient's objection makes them defend the objection; reflecting it — 'so the cigarettes are how you get through your breaks' — lets them argue the other side themselves. The goal of the interview is not to be right but to have the patient argue themselves into change.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Hearing a nod as agreement. In much of South Asia a nod is courtesy, not consent. Agreement is only demonstrated when the patient states the plan in their own words — the teach-back — or when a measurable act follows: the tablet taken, the appointment kept.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Scolding or threatening. Fear appeals work only when the person also believes that change is possible and that they can do it. A fatalistic lecture ('you will lose your leg') with no method and no support raises neither efficacy nor action, and it costs the relationship.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Advising without asking. A prescription of lifestyle change that has never met the patient's budget, kitchen, roster or family meals is advice the patient cannot take. The assessment comes before the advice: what do you eat now, who cooks, what does a kilo of rice cost.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A 40-year-old smoker says: 'I know smoking is bad but I could stop any time I want.' Which Stage of Change is this, and what is your next move?",
        answer: "Pre-contemplation — he has not acknowledged a problem. The move is to raise awareness without forcing a decision: ask permission to discuss it, ask what he enjoys about smoking, and leave the ambivalence open rather than demanding a quit date.",
        explanation: "Staging the patient prevents the commonest waste of a consultation — prescribing action to someone who has not yet considered change.",
      },
      {
        type: "question",
        prompt: "Name the two Health Belief Model components that most often explain a woman's failure to attend a cervical screening camp held 10 km away on a working day.",
        answer: "Perceived barriers — the distance, the travel cost and the day's lost wages — plus a barrier of modesty if the examiner is a man; low perceived benefit compounds it if she believes screening will not change her fate.",
        explanation: "Benefits and barriers are programmatic, not personal, which is why the camp moves to the village and the day is changed.",
      },
      {
        type: "question",
        prompt: "What is teach-back, and why is it more reliable than asking 'do you understand'?",
        answer: "Teach-back asks the patient to restate the plan in their own words. It is more reliable because politeness produces 'yes' with no information, whereas a restatement exposes exactly which step did not land, in time to correct it.",
        explanation: "The method converts feedback from the patient's courtesy into the patient's comprehension, which is what the next dose actually depends on.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A patient with diabetes attends rarely. The best first action in the consultation is to:",
        options: [
          "Repeat the same diet and medicine instructions more slowly",
          "Ask the patient to describe a normal day and what makes following the plan difficult",
          "Warn him about blindness and amputation",
          "Add a second medicine",
        ],
        correctIndex: 1,
        explanation: "The behavioural assessment precedes advice: the barriers are unknown, and each has a different fix (cost, work hours, family meals, literacy). Warning without a method does not change behaviour and costs the relationship.",
      },
      {
        type: "mcq",
        stem: "Which sequence correctly matches the 5 A's used for brief tobacco intervention?",
        options: [
          "Ask, Advise, Assess, Assist, Arrange",
          "Advise, Ask, Arrange, Assess, Assist",
          "Assess, Advise, Ask, Arrange, Assist",
          "Ask, Assess, Advise, Arrange, Assist",
        ],
        correctIndex: 0,
        explanation: "The 5 A's run Ask (about use), Advise (to stop), Assess (willingness), Assist (plan and support) and Arrange (follow-up) — the order is part of the method.",
      },
      {
        type: "mcq",
        stem: "A woman says 'the test will not change anything, so there is no point'. Which component of the Health Belief Model does this statement belong to?",
        options: [
          "Perceived susceptibility",
          "Perceived severity",
          "Perceived benefits",
          "Cues to action",
        ],
        correctIndex: 2,
        explanation: "She does not doubt that she is at risk (susceptibility) or that cancer is serious (severity); she doubts that the action helps, which is perceived benefit — a belief addressed by explaining what early treatment achieves.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 3 — Health education & planning (fully authored)
// ---------------------------------------------------------------------------
function lesson3() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define health education and state its aims; classify the methods of health education as individual, group and mass, and choose the appropriate method for a given task and audience; list the factors that govern the choice of media for a message; describe the steps of planning a community health intervention and write a SMART objective; and distinguish process, impact and outcome evaluation and design each of them.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1 and 2. Health education is the instrument that acts on the behavioural determinants, and planning it needs the communication skills and belief models of the previous lesson.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Health education",
        text: "Any combination of learning experiences designed to facilitate voluntary adaptation of behaviour conducive to health. The operative word is voluntary: the outcome is an informed decision by the person, not a command obeyed.",
      },
      {
        type: "paragraph",
        text: "Health education is how a public health programme changes a population without seeing every patient: a mother who boils water because she understands why, a village that demands a latrine, a teenager who refuses gutkha. Its close relative is health promotion, which goes beyond education to make the healthy choice the easy choice — the salt tax, the cycle lane, the subsidised pulse in the PDS — and the boundaries between the two blur in practice. What separates education from propaganda is consent and information; what separates it from information alone is the attempt to change behaviour.",
      },
      {
        type: "table",
        headers: ["IEC", "Health education", "Health promotion"],
        rows: [
          ["Tells people what is known", "Builds knowledge, skills and a favourable attitude", "Changes the environment so the healthy choice is easy"],
          ["Push media and leaflets", "Counselling, demonstrations, group discussion", "Legislation, taxation, built environment, product standards"],
          ["A means, not an end", "Voluntary adaptation of behaviour", "Population-level behaviour change without persuasion"],
        ],
      },
      {
        type: "paragraph",
        text: "The three are complementary: a tobacco tax works best alongside clear labelling (IEC) and cessation counselling (health education).",
      },

      { type: "heading", level: 2, text: "Methods of health education" },
      {
        type: "paragraph",
        text: "Methods are classified by the size of the audience, and the choice is determined by the message, not by convenience. Anything that must be practised — hand-washing, oral rehydration, preparing ORS — needs a demonstration or a role play, whatever the timetable says.",
      },
      {
        type: "table",
        headers: ["Level", "Methods", "Best suited to", "Limitation"],
        rows: [
          ["Individual", "Personal interview, counselling, home visit by the ASHA or health worker", "Behaviour change in one person: smoking, adherence, contraception", "Expensive per person; reaches one at a time"],
          ["Group", "Lecture, discussion, demonstration, panel, symposium, workshop, role play, buzz group", "Parents' groups, school classes, self-help groups, antenatal classes", "Needs a skilled facilitator; group dynamics can hijack the topic"],
          ["Mass", "Television and radio, newspapers and magazines, posters, hoardings, internet and social media, folk media — jatra, street play, puppetry, folk songs", "Awareness and agenda-setting across a population", "One-way unless interactive; reaches the already-interested"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Demonstration is the highest-yield method for a skill, and it follows a fixed order: show the whole technique at normal speed, show it again slowly step by step, let the audience perform it while you watch, then give feedback. Killing a session by asking an audience to practise in front of the group wastes the demonstration; practising in pairs or quietly at home preserves it.",
      },

      { type: "heading", level: 2, text: "Choosing the medium" },
      {
        type: "paragraph",
        text: "The medium must match the audience: a message about ORS written in ornate Hindi on a poster is invisible to a mother who reads neither. The standard selection factors are reach, frequency, impact and cost, plus literacy, culture, language and the complexity of the message — and a channel that the audience actively distrusts will not be heard regardless of how many people it reaches.",
      },
      {
        type: "table",
        headers: ["Message", "Best channel", "Why"],
        rows: [
          ["Boil drinking water during an outbreak", "Loudspeaker, folk play, house-to-house visit", "Urgent, must reach the illiterate quickly"],
          ["Prepare ORS correctly", "Demonstration with step-by-step practice", "It is a psychomotor skill, not a fact"],
          ["Anti-tobacco law for adolescents", "School discussions plus TV spots", "A norm is set by discussion; mass media reinforces"],
          ["Immunisation schedule", "Mothers' meeting plus a calendar card", "Dates must be retained and recalled"],
        ],
      },

      { type: "heading", level: 2, text: "Planning a community intervention" },
      {
        type: "paragraph",
        text: "A programme that is not planned is a campaign: loud, short and forgettable. Planning turns a good intention into a sequence of acts that can be measured, and the sequence below is the standard in Indian public health practice.",
      },
      {
        type: "table",
        headers: ["Step", "What is done", "The question it answers"],
        rows: [
          ["1. Define the problem", "State the health problem, its size and its distribution", "Who is affected and how many?"],
          ["2. Baseline study", "Survey what the population knows, believes and does (a KAP survey), and what services exist", "Where are we starting from?"],
          ["3. Set objectives", "SMART: specific, measurable, achievable, relevant, time-bound", "What change are we buying with the money?"],
          ["4. Design the intervention", "Segment the audience; choose message, method and channel; recruit partners", "Who will hear what, from whom, how often?"],
          ["5. Pre-test", "Trial on a small, similar group and fix what fails", "Is it comprehensible, acceptable, culturally safe?"],
          ["6. Implement", "Deliver with a written schedule, budgets and responsibilities", "Are the inputs actually in place?"],
          ["7. Monitor", "Check inputs, activities and reach continuously", "Are we on track?"],
          ["8. Evaluate", "Process, impact and outcome evaluation against objectives", "Did it work, and for whom?"],
        ],
      },
      {
        type: "example",
        text: "A poorly written objective is 'improve breastfeeding'. A SMART objective is 'raise the proportion of infants under six months who are exclusively breastfed in three villages from 30% to 60% within 12 months, measured by quarterly household surveys'. The difference is that the second one names the number, the place, the date and the measurement — and the evaluation is now a matter of counting, not of arguing.",
      },

      { type: "heading", level: 2, text: "Evaluation" },
      {
        type: "table",
        headers: ["Type of evaluation", "What it measures", "Examples of measures"],
        rows: [
          ["Process", "Whether the planned activities were delivered", "Classes held, leaflets distributed, camps held, attendance, expenditure against budget"],
          ["Impact", "The immediate change in knowledge, attitude and behaviour", "KAP scores, skills demonstrated, initiation of breastfeeding within one hour, demand for IUCDs"],
          ["Outcome", "The change in health status attributable to the programme", "Infant mortality rate, exclusive breastfeeding rate at six months, anaemia prevalence"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "PRECEDE-PROCEED is the planning-and-evaluation model that makes the logic explicit: predisposing factors (knowledge, attitudes, beliefs), reinforcing factors (family, peers, providers) and enabling factors (skills, access, money) are each mapped to an intervention. If a behaviour has not changed, the model tells you which factor — not the will of the audience — is at fault.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing the method with the message. Choosing a pamphlet because pamphlets are easy is a distribution failure, not an education failure: the medium must fit the skill, the literacy and the culture of the audience. A demonstration beats ten leaflets for any psychomotor task.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Writing objectives nobody can measure. 'Create awareness' cannot be evaluated and cannot be failed; 'increase the proportion of deliveries attended by a skilled birth attendant from 55% to 75% within two years' can. Pre-test on the intended audience rather than on the office staff: the camp audio that plays beautifully in the block office may be silence to the village.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Stopping at impact. Knowledge gained and attitudes changed are evidence the programme was heard, not that it worked; only outcome measures — exclusive breastfeeding, IMR, anaemia — prove the health gain. And outcome change needs the other determinants (food, income, services), which education alone cannot move.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A panchayat wants villagers to switch from an open defecation site to new pit latrines. Which methods of health education would you combine, and why?",
        answer: "Group methods — gram sabha meetings and demonstrations of cleaning and maintenance — to build the norm and answer objections directly, plus mass media (loudspeaker, folk play) for reach, and individual home visits by the ASHA worker for the households that need the latrine demonstrated in their own yard.",
        explanation: "Open defecation is a community norm; the level of the audience and the size of the task decide the mix of methods, and the household visit converts a norm into an individual act.",
      },
      {
        type: "question",
        prompt: "What is a SMART objective? Rewrite 'improve newborn care practices' as one.",
        answer: "SMART means specific, measurable, achievable, relevant and time-bound. For example: 'raise the proportion of newborns put to the breast within one hour of birth in the sub-centre area from 40% to 70% within one year, measured at each delivery'.",
        explanation: "The measurability is what turns an evaluation from an opinion into a comparison, and it forces the programme to define its baseline before it starts.",
      },
      {
        type: "question",
        prompt: "Does a rise in awareness scores after a health education campaign prove that the health of the population improved?",
        answer: "No. Awareness is an impact measure — it shows the message was heard. Health improvement is an outcome measure — breastfeeding, anaemia, mortality — and it depends on the enabling factors (access, income, services) as well as on knowledge.",
        explanation: "This is why evaluation is graded into process, impact and outcome, and why an honest programme reports all three against the objectives it set.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "The most appropriate method of health education to teach mothers how to prepare and give oral rehydration solution is:",
        options: [
          "A wall poster in the clinic corridor",
          "A lecture with slides",
          "A demonstration with step-by-step practice",
          "A television advertisement",
        ],
        correctIndex: 2,
        explanation: "Preparing ORS is a psychomotor skill, and skills are taught by demonstration with supervised practice — not by display or lecture, which inform but do not transfer the technique.",
      },
      {
        type: "mcq",
        stem: "A programme set out to 'create awareness about anaemia among adolescents'. Which criticism of this objective is correct?",
        options: [
          "It is too narrow to be useful",
          "It cannot be measured or evaluated, so success cannot be demonstrated",
          "It does not include the population",
          "It is already achieved by the school curriculum",
        ],
        correctIndex: 1,
        explanation: "Without a baseline, a target, a population and a time frame there is nothing to measure against, so the objective cannot fail or succeed — a SMART objective names all four.",
      },
      {
        type: "mcq",
        stem: "Counting the number of camps held and leaflets distributed during a campaign is which type of evaluation?",
        options: [
          "Process evaluation",
          "Impact evaluation",
          "Outcome evaluation",
          "Cost-effectiveness evaluation",
        ],
        correctIndex: 0,
        explanation: "Inputs and activities delivered define process evaluation; knowledge and attitude change define impact, and change in health status defines outcome.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 4 — Environmental health (fully authored)
// ---------------------------------------------------------------------------
function lesson4() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the water requirement of a community and the steps by which water is made safe; classify the diseases associated with water and judge which sanitation act prevents each; state the permissible limits of the important chemical contaminants and the effects of their excess; describe the sources and health effects of air pollution and noise and the national standards for them; and list the requirements of healthy housing, safe solid and biomedical waste management, and a sanitary latrine.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (Concepts of health and disease). Environmental control is the specific protection of primary prevention acting on the environmental determinant.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Environmental health",
        text: "The branch of community medicine that deals with the physical, chemical and biological factors of the environment — water, air, noise, housing, vectors, waste — and the control of those factors for the benefit of population health.",
      },
      {
        type: "paragraph",
        text: "The environment is the determinant that medicine can most directly engineer away. Two centuries of public health history show that mortality fell fastest where water was separated from sewage, air was cleaned, and children were immunised — not where beds were added. Sanitary engineering and law are, in that sense, the largest-volume clinical instrument in existence, and the five traditional fields of environmental sanitation — safe water, excreta disposal, refuse disposal, drainage and housing — remain the working checklist of every field posting.",
      },

      { type: "heading", level: 2, text: "Water" },
      {
        type: "paragraph",
        text: "A community needs enough water, and water that is safe. Access means a protected source within a reasonable distance; sufficiency in Indian public health practice is reckoned at a minimum of about 20 litres per person per day for basic needs, with 40 litres or more in urban settings where washing and sanitation are counted. Safety is judged chemically (salts, metals, fluoride) and microbiologically (indicator organisms).",
      },
      {
        type: "table",
        headers: ["Contaminant", "Permissible limit (drinking water)", "Health effect above the limit"],
        rows: [
          ["Total coliforms / E. coli", "Nil per 100 ml", "Indicates faecal contamination: risk of cholera, typhoid, hepatitis A and E, giardiasis"],
          ["Fluoride", "Not above 1.5 mg/L; dental benefit stops below about 1.0 mg/L", "Dental mottling above 1.5 mg/L; skeletal fluorosis with chronic high intake"],
          ["Nitrate", "Not above 45-50 mg/L as nitrate", "Methaemoglobinaemia in bottle-fed infants at high levels"],
          ["Arsenic", "WHO guideline 10 micrograms/L", "Skin lesions, peripheral neuropathy, cancers of skin and internal organs"],
          ["Iron", "Not above 0.3 mg/L (aesthetic and staining)", "Objectionable taste and staining; haemochromatosis risk in extreme exposure"],
          ["Total dissolved solids", "Not above about 500 mg/L desirable", "Unpalatable water, osmotic diarrhoea in infants"],
        ],
      },
      {
        type: "paragraph",
        text: "Purification of a municipal supply follows a fixed order — storage (settling of suspended solids), coagulation and sedimentation with alum, filtration, and disinfection with chlorine. The step that matters at the household level is the last: water must reach the consumer with a free residual chlorine of at least 0.5 mg/L after a contact time of at least 30 minutes, which is the number that is actually measured in the field, and it is why a raw-chlorinated bulletin is useless without the residual at the tap.",
      },
      {
        type: "example",
        text: "A hand pump gives clean, cool water and a Gram Sabha votes it 'safe'. The residents nevertheless report diarrhoea every summer. A sanitary survey finds an uncovered soak pit four metres upgrade of the pump and a cracked apron: the water is contaminated at the point of collection. This is why water safety programmes test the sanitary survey — source protection, apron, drainage — alongside the laboratory test; a negative bacteriology on one day proves nothing about September.",
      },

      { type: "heading", level: 2, text: "Water and disease: the four routes" },
      {
        type: "table",
        headers: ["Category", "Mechanism", "Examples", "The controlling act"],
        rows: [
          ["Water-borne (ingested)", "Pathogen carried in the water that is drunk", "Cholera, typhoid, hepatitis A and E, bacterial and amoebic dysentery, giardiasis", "Chlorination, safe storage, protected sources"],
          ["Water-washed (insufficient water)", "Disease prevented by water used for hygiene", "Scabies, impetigo, trachoma, conjunctivitis, diarrhoeal disease from dirty hands", "Quantity of water, hand-washing, sanitation"],
          ["Water-based (contact)", "Pathogen that spends part of its life cycle in water", "Schistosomiasis, guinea worm disease, dracunculiasis", "Snail control, safe step-wells, filtering drinking water"],
          ["Water-related vectors", "Vectors that breed in or near water", "Malaria, dengue, chikungunya, Japanese encephalitis, filariasis", "Source reduction, larvivorous fish, larvicides, bed nets"],
        ],
      },
      {
        type: "definition",
        term: "Breakpoint chlorination",
        text: "The chlorination curve's point beyond which added chlorine is left as free residual instead of being consumed by organic and oxidisable matter. Below the breakpoint, chlorine forms combined (chloramine) compounds and the water is dirty but 'tested'; beyond it, free residual chlorine appears and disinfection is genuinely achieved.",
      },

      { type: "heading", level: 2, text: "Air" },
      {
        type: "paragraph",
        text: "Air pollution is particulate and gaseous, indoor and outdoor. Household air pollution from solid cooking fuel now ranks among the leading risk factors for disease in India, causing pneumonia in children and chronic obstructive lung disease and ischaemic heart disease in women who cook; outdoor pollution adds particulate matter, oxides of sulphur and nitrogen, carbon monoxide, ozone and lead. The standards that fieldwork is measured against are the national ambient air quality standards.",
      },
      {
        type: "table",
        headers: ["Pollutant", "Annual standard", "24-hour standard", "Chief health effect"],
        rows: [
          ["PM10 (coarse particulate)", "60 micrograms per cubic metre", "100 micrograms per cubic metre", "Wheeze, asthma exacerbation, bronchitis, cardiovascular mortality"],
          ["PM2.5 (fine particulate)", "40 micrograms per cubic metre", "60 micrograms per cubic metre", "Alveolar penetration: systemic inflammation, heart disease, lung cancer"],
          ["Sulphur dioxide", "50 micrograms per cubic metre", "80 micrograms per cubic metre", "Bronchoconstriction, acid rain, worsens COPD"],
          ["Nitrogen dioxide", "40 micrograms per cubic metre", "80 micrograms per cubic metre", "Airway inflammation, childhood respiratory illness"],
          ["Carbon monoxide (8-hour)", "2 mg per cubic metre", "4 mg per cubic metre", "Carboxyhaemoglobin: headache, ischaemia, death at high exposure"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Indoor air pollution is controlled at the source: a clean fuel (LPG, biogas), a chimneyed stove, keeping children out of the kitchen, and not drying fuel wood inside. Because exposure hours are highest indoors, a clean stove removes more risk per rupee than almost any other household intervention.",
      },

      { type: "heading", level: 2, text: "Noise, housing and ventilation" },
      {
        type: "table",
        headers: ["Environmental factor", "Standard", "Health effect of the excess"],
        rows: [
          ["Noise — residential area", "55 dB by day, 45 dB at night", "Annoyance, insomnia, hypertension, hearing loss"],
          ["Noise — commercial area", "65 dB by day, 55 dB at night", "Communication interference, sleep loss, stress"],
          ["Noise — industrial area", "75 dB by day, 70 dB at night", "Noise-induced hearing loss, accidents from missed warnings"],
          ["Ventilation", "About 2-3 air changes per hour in occupied rooms; much higher filtered air turnover in theatres", "Accumulation of carbon dioxide and infection risk; discomfort"],
          ["Housing", "Built-up area limited, open space per dwelling kept, cross-ventilation, safe floor space per person", "Overcrowding spreads tuberculosis and meningitis; damp and dark housing worsens respiratory illness"],
        ],
      },
      {
        type: "paragraph",
        text: "Healthy housing is defined as much by what surrounds it as by the house: a site that drains, a floor above flood level, direct daylight on the living space, a safe distance from the refuse dump, and a kitchen where smoke leaves. Those five lines are what a field assessment marks a dwelling against, and they are all cheaper to design in than to retrofit.",
      },

      { type: "heading", level: 2, text: "Waste management and sanitation" },
      {
        type: "table",
        headers: ["Waste stream", "The rule", "Disposal"],
        rows: [
          ["Household refuse", "Segregate wet and dry; reuse and compost", "Composting (Bangalore method) or vermicomposting; incineration only where needed"],
          ["Biomedical waste — sharps", "White container, puncture-proof", "Autoclave or chemical disinfection, then shredding and recycling"],
          ["Biomedical waste — infectious and anatomical", "Yellow bag, lined", "Incineration or deep burial as per protocol"],
          ["Biomedical waste — soiled plastics", "Red bag, lined", "Autoclave, microwave or chemical treatment, then recycling"],
          ["Biomedical waste — glass and metal", "Blue container", "Disinfection, then recycling"],
        ],
      },
      {
        type: "definition",
        term: "Sanitary latrine",
        text: "A latrine that confines excreta from human contact: a water-seal, pour-flush pan over a pit or twin pits (the Sulabh design), or a ventilated improved pit latrine with a screened vent pipe. The two-pit design works because one pit fills and rests while the other is used, and the rested content becomes safe and diggable.",
      },
      {
        type: "callout",
        variant: "info",
        text: "A biogas plant converts cattle dung into usable gas and slurry fertiliser — rural sanitation and energy from one structure. Its health value is indirect: it removes the dung and the firewood smoke, and returns nitrogen to the fields rather than the surface drain.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Thinking a negative bacteriological report settles the question of water safety. The test reports one source on one day; safety is a system — protected source, intact apron, clean storage, treated supply, residual chlorine at the tap. A sanitary survey outranks a single sample.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Classifying malaria as a water-borne disease. The mosquito breeds in water but the pathogen is not swallowed; malaria is a water-related vector disease, and it is controlled by source reduction and larval measures rather than by water treatment.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting household air pollution. The standards above are ambient; a woman cooking over an open biomass stove in a kitchen without a vent spends hours in particulate levels that would fail an ambient standard. The intervention is clean fuel and a chimneyed stove.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why is free residual chlorine, and not total chlorine, the quantity that matters at the consumer's tap?",
        answer: "Free residual chlorine is the chlorine left over after the organic load has been satisfied; only free chlorine is available to kill organisms in stored water. Total chlorine mostly measures the combined chloramines, which are a weaker and slower disinfectant.",
        explanation: "Field chlorination is judged by a residual, not by the dose put in at the plant, which is why the orthotolidine test at the tap is a control measure and not a formality.",
      },
      {
        type: "question",
        prompt: "A district reports fluoride levels of 3 mg/L. What health effects follow, and what is the control?",
        answer: "Above 1.5 mg/L the excess produces dental fluorosis (mottled enamel) and, with long exposure in childhood, skeletal fluorosis with joint deformity and calcification of ligaments. Control is defluoridation (the Nalgonda or activated alumina technique) or sourcing water below the limit; supplementation in water is never used.",
        explanation: "The dose makes the poison: the same ion protects teeth near 1 mg/L and deforms bones at 3 mg/L, which is why fluoride is managed as a contaminant, not as an additive.",
      },
      {
        type: "question",
        prompt: "Trachoma and scabies persist in a village that has a piped supply. Which category of water-related disease explains this, and what is the remedy?",
        answer: "They are water-washed diseases — caused by insufficient water for hygiene rather than by contaminated drinking water. The remedy is quantity plus hygiene education: enough water for hand-washing and bathing, not only a safe source.",
        explanation: "This is why water safety programmes measure both quality and quantity; a safe tap that runs dry twice a day still fails the community.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Schistosomiasis is best described as which kind of water-associated disease?",
        options: [
          "Water-borne disease",
          "Water-washed disease",
          "Water-based disease",
          "Water-related vector disease",
        ],
        correctIndex: 2,
        explanation: "The fluke must spend part of its cycle in a snail in water, which makes the disease water-based; water-borne diseases are swallowed, water-washed diseases are prevented by hygiene, and vector diseases are transmitted by a biting insect.",
      },
      {
        type: "mcq",
        stem: "The minimum free residual chlorine level expected in distributed drinking water after adequate contact is:",
        options: [
          "0.1 mg/L", "0.5 mg/L", "1.5 mg/L", "5 mg/L",
        ],
        correctIndex: 1,
        explanation: "A free residual of at least 0.5 mg/L after at least 30 minutes of contact is the operational safety margin against recontamination; 1.5 mg/L is the fluoride guideline that distracts, and 5 mg/L is a treatment dose, not a residual.",
      },
      {
        type: "mcq",
        stem: "A used needle from an outpatient department should go into:",
        options: [
          "A red bag",
          "A yellow bag",
          "A white puncture-proof container",
          "A blue bag",
        ],
        correctIndex: 2,
        explanation: "Sharps go into the white puncture-proof container, then are autoclaved or chemically disinfected and shredded; red bags take soiled plastics, yellow bags infectious and anatomical waste, and blue bags glass and metal.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 5 — Biostatistics (fully authored)
// ---------------------------------------------------------------------------
function lesson5() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: present health data as tables and graphs and choose the right graph for the data type; compute and interpret the mean, median and mode and the range, standard deviation, quartiles and coefficient of variation on a worked dataset; use the properties of the normal distribution to find the proportion of a population within given limits; describe the methods of sampling and the difference between sampling and non-sampling error; explain the null hypothesis, the p-value and the two types of statistical error; and read the tests of significance, correlation and regression that the journals put in front of you.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "None formally — arithmetic is sufficient for this lesson — but Lesson 4 (environmental health) supplies the kind of data this analysis is used on, and Lesson 6 (epidemiological methods) uses the measures developed here.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Biostatistics",
        text: "The application of statistics to biological and health data — from a blood-pressure survey to a drug trial — in order to summarise what was observed, to estimate the true value in the population and to decide whether an observed difference is likely to be real rather than the product of chance.",
      },
      {
        type: "paragraph",
        text: "Statistics exists because every measurement is imperfect and no sample is the population. You measure the haemoglobin of 200 women, treat 100 anaemic patients and vaccinate 100 others, and a month later the treated group is better: is the vaccine working or did you simply pick the luckier 100? Biostatistics is the discipline that quantifies that uncertainty, and the two questions it answers are 'what is the true value of this measurement' (measurement and estimation) and 'could this difference be a coincidence' (testing). Every one of its methods is a way of putting a number on the word 'probably'.",
      },

      { type: "heading", level: 2, text: "Types of data" },
      {
        type: "table",
        headers: ["Type of data", "Definition", "Examples in medicine", "Summary and analysis"],
        rows: [
          ["Qualitative (categorical)", "Individuals are placed in categories, not measured", "Sex, blood group, disease present or absent, cured or not", "Proportions; chi-square test; tabulation"],
          ["Quantitative — discrete", "Whole-number counts", "Number of children, deaths per week, children per family", "Mean, median; Poisson methods; rates"],
          ["Quantitative — continuous", "A value on a scale that can take any intermediate value", "Height, weight, haemoglobin, blood pressure", "Mean, standard deviation; t-tests, correlation"],
        ],
      },

      { type: "heading", level: 2, text: "Presenting data" },
      {
        type: "paragraph",
        text: "Data must be seen before it is interpreted. A frequency distribution lists every class of values with its count; a histogram draws the frequencies of continuous data as adjacent bars over the class limits; a bar chart is for categorical counts; a pie chart shows the components of a single total; a line chart shows a trend over time; a frequency polygon and its cumulative partner, the ogive, sit over the histogram. For small datasets a stem-and-leaf display keeps the actual values while showing the shape.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The shape of a distribution decides which summary to quote. A symmetrical dataset is described by the mean and the standard deviation; a skewed dataset — income, hospital stay, incubation period — is described by the median and the quartiles, because the mean is dragged toward the tail and no longer describes the typical value.",
      },

      { type: "heading", level: 2, text: "Measures of central tendency — a worked example" },
      {
        type: "definition",
        term: "Mean (arithmetic)",
        text: "The sum of all observations divided by their number. It uses every value, but a single extreme value moves it, which is its strength in an analysis and its weakness in a skewed sample.",
      },
      {
        type: "definition",
        term: "Median",
        text: "The middle value when the observations are arranged in order — the value at position (n+1)/2 for an odd number, the average of the two middle values for an even number. It is unaffected by the tails, which is why it is quoted for skewed data.",
      },
      {
        type: "definition",
        term: "Mode",
        text: "The most frequently occurring value. A dataset can be unimodal, bimodal or have no mode at all, and the mode is the only usable average for categorical data such as the commonest diagnosis in a clinic.",
      },
      {
        type: "example",
        text: "Weights (kg) of 10 children at a growth monitoring session: 10, 11, 12, 12, 13, 14, 14, 15, 16, 17. Sum = 134 kg, so the mean is 134/10 = 13.4 kg. Arranged in order, the 5th and 6th values are 13 and 14, so the median is (13 + 14)/2 = 13.5 kg. The values 12 and 14 each occur twice, so the distribution is bimodal with modes 12 and 14 kg. Note the mean is pulled slightly right of the median, as expected in a mildly right-skewed set.",
      },
      {
        type: "table",
        headers: ["Child", "Weight (kg)", "Deviation from the mean (kg)", "Squared deviation"],
        rows: [
          ["1", "10", "-3.40", "11.56"],
          ["2", "11", "-2.40", "5.76"],
          ["3", "12", "-1.40", "1.96"],
          ["4", "12", "-1.40", "1.96"],
          ["5", "13", "-0.40", "0.16"],
          ["6", "14", "0.60", "0.36"],
          ["7", "14", "0.60", "0.36"],
          ["8", "15", "1.60", "2.56"],
          ["9", "16", "2.60", "6.76"],
          ["10", "17", "3.60", "12.96"],
          ["Total", "134", "0.00", "44.40"],
        ],
      },
      {
        type: "paragraph",
        text: "The last column is the key to the whole lesson: the deviations cancel out (they sum to zero), but the squared deviations add to 44.40 kg squared. Dividing by n-1 = 9 gives the sample variance of 4.93 kg squared, and taking the square root gives a standard deviation of 2.21 kg. The n-1, not n, is deliberate: it corrects the bias of estimating the population spread from a sample, and it is why a sample standard deviation is described as unbiased.",
      },
      {
        type: "table",
        headers: ["Statistic", "Value from the 10 weights"],
        rows: [
          ["Mean", "13.4 kg"],
          ["Median", "13.5 kg"],
          ["Mode", "12 kg and 14 kg (bimodal)"],
          ["Range (max - min)", "17 - 10 = 7 kg"],
          ["First quartile Q1 (middle of the lower half)", "12 kg"],
          ["Third quartile Q3 (middle of the upper half)", "15 kg"],
          ["Interquartile range (Q3 - Q1)", "3 kg"],
          ["Sample standard deviation", "2.21 kg"],
          ["Coefficient of variation (SD/mean x 100)", "2.21/13.4 = 16.5%"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The coefficient of variation lets you compare the variability of two different measurements — 16.5% of variation in these weights against 8% of variation in their heights says the weights are comparatively more scattered. A range of 7 kg and an IQR of 3 kg together show that the spread is gentle rather than extreme.",
      },

      { type: "heading", level: 2, text: "The normal distribution" },
      {
        type: "paragraph",
        text: "Histograms of biological measurements cluster in the middle and thin toward both tails in a bell shape, and the closer the data follow that shape, the more precisely a standard deviation lets you speak. In a perfectly normal distribution, mean = median = mode, and fixed proportions lie within fixed multiples of the standard deviation. Applied to the weights above (mean 13.4, SD 2.21), those limits become concrete.",
      },
      {
        type: "table",
        headers: ["Limits (mean plus/minus SD)", "Range for the ten children (kg)", "Proportion of a normal population within"],
        rows: [
          ["Mean +/- 1 SD (13.4 +/- 2.21)", "11.2 to 15.6", "68.3%"],
          ["Mean +/- 2 SD (13.4 +/- 4.42)", "9.0 to 17.8", "95.4%"],
          ["Mean +/- 3 SD (13.4 +/- 6.63)", "6.8 to 20.0", "99.7%"],
        ],
      },
      {
        type: "paragraph",
        text: "The working convention that follows is a 95% reference interval, mean +/- 2 SD: a child outside it is unusual (the lowest 2.5% or the highest 2.5%) and warrants a second look. This is the same logic behind the reference ranges printed on laboratory reports, and it is why growth charts are built on the standard deviation, not on a fixed cut-off.",
      },

      { type: "heading", level: 2, text: "Probability and sampling" },
      {
        type: "definition",
        term: "Probability",
        text: "The proportion of times an event would occur over many repetitions, from 0 (impossible) to 1 (certain). Overlapping events combine additively only when mutually exclusive; otherwise P(A or B) subtracts the overlap, and independent events combine multiplicatively.",
      },
      {
        type: "table",
        headers: ["Sampling method", "How it works", "When it is used", "Chief risk"],
        rows: [
          ["Simple random", "Every individual has an equal chance (lottery or random numbers)", "A small, listed population", "Impractical for a large population without a list"],
          ["Systematic", "Every k-th person from a starting point", "Large ordered lists, records", "Bias if the list has a hidden periodicity"],
          ["Stratified", "The population is divided into strata, then randomly sampled within each", "Groups that must be represented (sex, urban and rural)", "Wrong strata weights if sampling fractions differ"],
          ["Cluster (multistage)", "Groups (villages, schools) are sampled, then persons within them", "Wide-area surveys that must be affordable", "Clustered people are alike, so the effective sample is smaller than it looks"],
          ["Volunteer and convenience", "Whoever is available", "Not for prevalence estimation", "Selection bias — the people who came are not the population"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Sampling error is the difference between a sample's result and the population's truth — it is inevitable, it shrinks as the square root of the sample size, and it is quantified by the confidence interval. Non-sampling error — selection bias, misclassification, non-response, a miscalibrated instrument — is not reduced by a larger sample and it biases the result in direction. A biased 10,000-person survey is more dangerous than a biased 100-person one, because it reports the same wrong answer with a tighter interval.",
      },

      { type: "heading", level: 2, text: "Testing: the null hypothesis and the p-value" },
      {
        type: "definition",
        term: "Null hypothesis (H0)",
        text: "The statement that any observed difference between groups is due to chance — no difference, no association, no benefit. A test of significance quantifies how surprising the observed data would be if H0 were true.",
      },
      {
        type: "definition",
        term: "p-value",
        text: "The probability of obtaining a result at least as extreme as the one observed, if the null hypothesis were true. A p below the conventional 0.05 means the data would arise by chance fewer than once in twenty trials, and H0 is rejected.",
      },
      {
        type: "table",
        headers: ["Term", "Meaning", "Clinical example"],
        rows: [
          ["Type I error (alpha)", "Rejecting a true H0 — a false positive", "Declaring an ineffective drug useful"],
          ["Type II error (beta)", "Failing to reject a false H0 — a false negative", "Missing a genuinely effective drug"],
          ["Power (1 - beta)", "The chance of detecting a real effect, usually set at 80% or more", "The sample size calculation that justifies a trial"],
          ["95% confidence interval", "The range that would contain the true value in 95% of repeats", "'Risk ratio 4.0 (95% CI 2.1-7.6)' — the interval excludes 1, so the association is real"],
        ],
      },
      {
        type: "table",
        headers: ["Situation", "Appropriate test"],
        rows: [
          ["Compare two independent means (e.g. mean BP in two groups)", "Unpaired t-test"],
          ["Compare means of 3 or more groups", "Analysis of variance (ANOVA)"],
          ["Compare paired means (before and after in the same patients)", "Paired t-test"],
          ["Compare proportions between groups (2x2 tables)", "Chi-square test"],
          ["Small samples or non-normal data, compare medians", "Mann-Whitney or Wilcoxon test"],
          ["Association between two continuous variables", "Pearson correlation coefficient, regression"],
        ],
      },

      { type: "heading", level: 2, text: "Correlation and regression" },
      {
        type: "paragraph",
        text: "Correlation coefficient r measures the strength and direction of a linear association between -1 and +1: r of +0.9 is a strong positive association, r of 0 is none, r of -0.7 a strong negative one. Regression goes one step further and predicts the value of one variable from another, which is how a growth chart predicts a child's weight from age. The rule that keeps both honest: correlation is not causation — an r of 0.9 between ice-cream sales and drowning deaths is a third variable, the summer.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Quoting the mean for skewed data. Income, hospital stay and incubation period have long tails; a mean shifted by a few extreme values is not 'the average patient'. Use the median and the interquartile range whenever a histogram is skewed, and say so.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating p = 0.05 as a truth switch. P below 0.05 means the observed difference is unlikely under the null; it says nothing about the size of the effect or whether it matters clinically. Report the effect size with its confidence interval, not the p-value alone.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Dividing by n instead of n-1 when estimating a population standard deviation from a sample. The n-1 correction (Bessel's correction) is what makes the estimate unbiased, and skipping it systematically underestimates the true spread — an error that compounds into every interval that follows.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "From the worked dataset, compute the sample standard deviation step by step.",
        answer: "The mean is 13.4 kg. The squared deviations sum to 44.40 kg squared. Dividing by n-1 = 9 gives the variance 4.93 kg squared. The square root is 2.21 kg, so the sample standard deviation is 2.21 kg.",
        explanation: "Sum of deviations is always zero, which is why the sum is taken over squared deviations; dividing by n-1 corrects the sample's tendency to underestimate the population spread.",
      },
      {
        type: "question",
        prompt: "In a survey of household incomes in a slum, three households earn ten times the rest. Which average describes the typical household best, and why?",
        answer: "The median, because the distribution is right-skewed by three extreme incomes. The mean is dragged upward and no longer describes the household you would actually meet, and the median (with the interquartile range) is unaffected by those three values.",
        explanation: "The shape of the distribution, not convenience, decides the measure of central tendency.",
      },
      {
        type: "question",
        prompt: "A study reports a risk ratio of 3.0 with a 95% confidence interval of 1.2 to 4.8. What does this tell you?",
        answer: "The point estimate is a three-fold risk, and the interval excludes 1.0, so the association is statistically significant at the 5% level. The interval also shows the plausible range — the true risk ratio could be as low as 1.2 or as high as 4.8 in the population.",
        explanation: "The confidence interval reports both the size and the precision of an association, which is exactly what a p-value alone cannot do.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "From the ten weights above, what is the median?",
        options: ["13.4 kg", "13.5 kg", "14 kg", "12 kg"],
        correctIndex: 1,
        explanation: "With ten ordered values the median is the mean of the 5th and 6th values, 13 and 14 kg, giving 13.5 kg. The mean is 13.4 kg and the modes are 12 and 14 kg.",
      },
      {
        type: "mcq",
        stem: "A new drug is declared better than the old one although the trial found no real difference. This error is best called:",
        options: [
          "Type I error",
          "Type II error",
          "A power error",
          "A sampling error",
        ],
        correctIndex: 0,
        explanation: "Rejecting a true null hypothesis is a type I (alpha) error — a false-positive result. Type II would have missed a real difference; sampling error is the random variation itself, not the conclusion drawn from it.",
      },
      {
        type: "mcq",
        stem: "Which measure of central tendency is the only one appropriate for categorical data such as the commonest diagnosis in a clinic?",
        options: [
          "Mean", "Median", "Mode", "Standard deviation",
        ],
        correctIndex: 2,
        explanation: "Categorical data cannot be ordered into a middle value or averaged arithmetically, so the only usable descriptor is the mode — the most frequent category.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 6 — Epidemiological methods (fully authored)
// ---------------------------------------------------------------------------
function lesson6() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define epidemiology and state its uses; use the vocabulary of disease occurrence — endemic, sporadic, epidemic, pandemic, common-source and propagated outbreaks; compute and interpret the measures of disease frequency (incidence, prevalence, mortality and attack rates) and the measures of association (risk ratio, odds ratio, attributable risk) with their denominators correct; describe the main study designs with their strengths, weaknesses and the measure of association each yields; apply the Bradford Hill criteria to claim causation and name the principal biases and confounding with their controls; and follow the steps of an outbreak investigation.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 5 (Biostatistics): incidence, prevalence and the measures of association are computed here, and interpretation uses the confidence intervals of the previous lesson. Lesson 1 gives the natural-history framework the designs sit on.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Epidemiology (John M. Last)",
        text: "The study of the distribution and determinants of health-related states or events in specified populations, and the application of this study to the control of health problems. Two words carry the definition: distribution — who, where and when, which is pure measurement — and determinants — why, which is pure analysis.",
      },
      {
        type: "paragraph",
        text: "Medicine asks 'why is this patient ill'; epidemiology asks 'why is this population ill, and not that one'. The power of the second question is that it can be answered without a laboratory: John Snow removed the handle of the Broad Street pump in 1854 on nothing more than a map of cholera deaths around the pump, which is why the plotted map remains the founding image of the discipline. Everything that follows — the cohort, the case-control study, the randomised trial, the outbreak investigation — is a formal version of that act of comparing who fell ill among who did not.",
      },

      { type: "heading", level: 2, text: "The vocabulary of occurrence" },
      {
        type: "table",
        headers: ["Term", "Meaning", "Field example"],
        rows: [
          ["Endemic", "The constant, usual level of a disease in an area (hyperendemic, holoendemic: intense transmission by age group)", "Malaria in the Terai; dengue throughout the monsoon"],
          ["Sporadic", "Scattered, occasional cases with no link between them", "An imported case of Lassa fever"],
          ["Epidemic", "The occurrence of more cases than normally expected in an area, from a common source or by propagation", "Hepatitis A after a wedding feast"],
          ["Pandemic", "An epidemic that has crossed continents", "COVID-19; influenza of 1918"],
          ["Common-source outbreak", "A single exposure contaminates many people at once (single exposure: one point in time; continuous: over days)", "Cholera after one contaminated tube well"],
          ["Propagated outbreak", "Person-to-person transmission through serial infections", "Measles spreading through an unvaccinated class, wave after wave"],
        ],
      },

      { type: "heading", level: 2, text: "Measures of frequency" },
      {
        type: "table",
        headers: ["Measure", "Formula", "Units", "Interpretation"],
        rows: [
          ["Incidence (risk)", "New cases in a period / population at risk at the start", "Per 1000 per year", "The chance a risk-free person develops disease; used for cohort studies"],
          ["Incidence density", "New cases / person-time at risk", "Per 100 person-years", "When people are followed for unequal follow-up times"],
          ["Prevalence", "All existing cases (old + new) / total population at a point in time", "Per 1000", "The burden of disease at a moment; prevalence is roughly incidence x duration"],
          ["Attack rate (secondary attack rate)", "Cases among those exposed / number exposed", "Per 100", "Outbreak investigation; the secondary attack rate is among household contacts"],
          ["Case fatality", "Deaths from the disease / cases of the disease", "Per 100", "The deadliness of the disease in the treated population"],
          ["Crude mortality", "All deaths / total population", "Per 1000 per year", "Comparable only between populations with the same age structure, hence age-standardised rates"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Prevalence = incidence x average duration. A disease can be stopped by cure (short duration), or by rapid death (short duration); a chronic disease with low incidence accumulates prevalence. This single identity explains why the commonest diseases in clinic are not the commonest causes of death — a long cold lasts weeks, arthritis lasts decades.",
      },

      { type: "heading", level: 2, text: "Measures of association — the worked tables" },
      {
        type: "paragraph",
        text: "Every measure of association comes from the same skeleton: a 2x2 table of exposure against outcome. Fill it correctly and the formula is trivial; fill it wrongly — which the denominator usually does — and the answer is confidently wrong.",
      },
      {
        type: "paragraph",
        text: "Example A — a cohort study of smoking and lung cancer: 1000 smokers followed for a year produce 50 cases, and 1000 non-smokers produce 10 cases.",
      },
      {
        type: "table",
        headers: ["", "Disease developed", "No disease", "Total", "Incidence"],
        rows: [
          ["Exposed (smokers)", "50", "950", "1000", "50 per 1000 per year (5%)"],
          ["Unexposed (non-smokers)", "10", "990", "1000", "10 per 1000 per year (1%)"],
          ["Total", "60", "1940", "2000", "30 per 1000 per year (3%)"],
        ],
      },
      {
        type: "table",
        headers: ["Measure", "Calculation", "Result"],
        rows: [
          ["Risk ratio (relative risk)", "5% among the exposed / 1% among the unexposed", "5 — a smoker's risk is five times the non-smoker's"],
          ["Attributable risk (risk difference)", "5% - 1%", "4 percentage points (40 per 1000) attributable to the exposure"],
          ["Population attributable risk", "3% total incidence - 1% incidence if unexposed", "2 percentage points (20 per 1000) removable if the exposure stopped"],
          ["Attributable fraction among the exposed", "(5% - 1%) / 5%", "80% of cases among the exposed are attributable"],
        ],
      },
      {
        type: "paragraph",
        text: "Example B — a case-control study of the association between eating the wedding chicken and salmonellosis: 200 affected guests (cases) and 200 unaffected guests (controls) are interviewed about what they ate.",
      },
      {
        type: "table",
        headers: ["", "Ate the chicken", "Did not eat the chicken", "Total"],
        rows: [
          ["Cases (affected)", "150", "50", "200"],
          ["Controls (unaffected)", "60", "140", "200"],
        ],
      },
      {
        type: "table",
        headers: ["Measure", "Calculation", "Result"],
        rows: [
          ["Odds of exposure among cases", "150/50", "3.0"],
          ["Odds of exposure among controls", "60/140", "0.43"],
          ["Odds ratio", "(150 x 140) / (50 x 60)", "21000/3000 = 7.0"],
        ],
      },
      {
        type: "paragraph",
        text: "The cohort gives a risk ratio because the disease is counted after following exposure; the case-control study cannot give a risk, because the investigator fixed the number of cases and controls instead of following a population, and the odds ratio estimates the risk ratio when the disease is rare (under about 10%). This single structural difference between the designs is the most examinable point in the whole lesson.",
      },

      { type: "heading", level: 2, text: "The study designs" },
      {
        type: "table",
        headers: ["Design", "What it does", "Measure it yields", "Chief weakness"],
        rows: [
          ["Ecological (correlational)", "Compares disease rates between populations or over time", "Correlation between a population exposure and a disease rate", "Ecological fallacy — group averages do not describe individuals"],
          ["Cross-sectional", "Snapshots disease and exposure together, once", "Prevalence and prevalence ratios", "Cannot show sequence: the cause may have followed the effect"],
          ["Case-control", "Compares past exposure in cases and in controls", "Odds ratio", "Recall bias, selection of controls; rare disease suits it best"],
          ["Cohort", "Follows exposed and unexposed people forward in time", "Risk ratio, incidence — the strongest observational evidence", "Expensive, loses to follow-up; unsuitable for rare disease"],
          ["Randomised controlled trial", "Randomises people to intervention or control and follows them", "Effectiveness; relative risk reduction", "Ethical constraints, volunteer bias in the population reached"],
          ["Quasi-experimental", "Intervention without randomisation, before-after or non-equivalent control", "Change attributable to the programme", "Secular trend and selection confuse the effect"],
        ],
      },
      {
        type: "example",
        text: "Choosing a design — a district wants the burden of hypertension among adults. Cross-sectional (one BP survey). It wants whether a new diet causes weight loss. Randomised controlled trial. It wants whether a rare cancer was caused by a pesticide at a factory. Case-control, because the disease is too rare to follow a cohort for. It wants whether childhood immunisation coverage predicts adult outcomes. Cohort, if the records can be re-traced, otherwise a cross-sectional snapshot with the known limits.",
      },

      { type: "heading", level: 2, text: "Causality, bias and confounding" },
      {
        type: "table",
        headers: ["Bradford Hill criterion", "The question asked of the association"],
        rows: [
          ["Strength", "Is the risk ratio large (RR of 10) rather than marginal (RR of 1.1)?"],
          ["Consistency", "Do different studies in different populations find it?"],
          ["Specificity", "Does the exposure lead to one effect and the effect follow the exposure?"],
          ["Temporality", "Does the cause precede the effect — the only essential criterion"],
          ["Biological gradient", "Does more exposure produce more disease (a dose-response curve)?"],
          ["Plausibility and coherence", "Does a known mechanism exist, and is it consistent with existing knowledge?"],
          ["Experimental evidence", "Does removing the exposure reduce the disease?"],
          ["Analogy", "Does a comparable cause-and-effect pair exist (as thalidomide informed rubella)?"],
        ],
      },
      {
        type: "table",
        headers: ["Error", "What happens", "Example", "The control"],
        rows: [
          ["Selection bias", "Comparison groups are formed differently from the start", "A volunteer workforce healthier than the population", "Random allocation; same entry criteria; identical sampling frames"],
          ["Information bias (recall, misclassification)", "Disease or exposure is measured differently between groups", "Mothers of leukaemic children remember infections more keenly than control mothers", "Blinding, objective records, identical questioning"],
          ["Loss to follow-up", "Those who drop out differ from those who stay", "The sickest smokers stop attending", "Tracking, intention-to-treat analysis, reporting the fraction lost"],
          ["Confounding", "A third factor causes both the exposure and the disease", "Alcohol appears to cause lung cancer because it travels with smoking", "Randomisation, restriction, matching, stratification, adjustment"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "A confounder must be associated with both the exposure and the disease and must not lie on the causal pathway between them. Smoking confounds the alcohol-lung cancer association; oral cancer itself does not confound anything, because it is a consequence — intervening on it would adjust away the very effect being studied.",
      },

      { type: "heading", level: 2, text: "Outbreak investigation" },
      {
        type: "paragraph",
        text: "An outbreak is an epidemiology experiment staged by nature, and the ten steps below are the standing protocol. Attack rate and the epidemic curve do the investigative work: a single-point epidemic curve implies a common source; wave after wave implies person-to-person spread.",
      },
      {
        type: "table",
        headers: ["Step", "Act", "The instrument"],
        rows: [
          ["1. Verify the diagnosis and confirm the outbreak", "Is it really the disease, and are there really more cases than usual?", "Laboratory confirmation; comparison with baseline"],
          ["2. Define a case and count cases", "Case definition: clinical criteria + place + time", "Line listing"],
          ["3. Describe the epidemic curve", "Plot cases by time of onset", "Histogram of onset dates; see common source or propagated"],
          ["4. Describe by person and place", "Age, sex, food, water source, map of cases", "Spot map; attack rates per food item"],
          ["5. Calculate attack rates and form hypotheses", "Which exposure is shared by the ill and not by the well?", "Food-specific attack rates; relative risks"],
          ["6. Test the hypotheses", "Analyse the 2x2 table", "Chi-square; relative risk or odds ratio"],
          ["7. Consider alternative explanations", "Diagnostic artefacts, reporting changes, denominator errors", "Review the line list carefully"],
          ["8. Implement control", "Stop the exposure — isolate, chlorinate, withdraw the food, recall the vehicle", "The control measure, which cannot wait for analysis"],
          ["9. Communicate", "Report to the authorities and the public, timely and accurate", "Outbreak report"],
          ["10. Follow up and evaluate", "Monitor for new cases; document lessons", "Surveillance and a written evaluation"],
        ],
      },
      {
        type: "example",
        text: "Worked example — a village feast reports 45 ill of 60 who ate the chicken, against 5 ill of 40 who did not. Food-specific attack rates: chicken 45/60 = 75%; everything else under 15%. Relative risk for chicken = 75% / 12.5% = 6. The curve is a single point in time — a common source. The control is immediate: withdraw the remaining chicken, hydrate the ill, and take samples. No inferential test is needed to act.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Using a case-control study to compute a relative risk. The investigator fixed the numbers of cases and controls, so incidence cannot be recovered from the table; the correct measure is the odds ratio. Similarly, quoting 'prevalence' when counting new cases over the past month among a population at risk — that total is a cumulative incidence, and its denominator excludes the existing cases.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Declaring an association causative on a strong p-value alone. A p-value tests only against chance; it cannot exclude confounding, bias or reverse causality. Temporality, dose-response and consistency carry the causal weight, as the Bradford Hill criteria set out.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Reading an ecological comparison as an individual risk. Counties with more storks have more births — the correlation is real at the county level and means nothing for any household. Individual risk needs an individual design.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "In the cohort worked example, what is the attributable fraction among the exposed, and what does it mean in the district?",
        answer: "(5% - 1%) / 5% = 4/5 = 80%. Among the exposed, 80% of the cases would not have occurred without the exposure, so removing the exposure would prevent four of every five cases in that group — the strongest possible case for the intervention.",
        explanation: "The attributable fraction quantifies the preventable share among the exposed, while the population attributable risk quantifies the share removable across the whole population.",
      },
      {
        type: "question",
        prompt: "Why can a case-control study estimate the odds ratio but not the risk ratio?",
        answer: "Because the numbers of cases and controls are fixed by the investigator rather than arising from a followed population, so the incidence in the exposed and unexposed is unknown. The ratio of the odds of exposure between cases and controls can be computed, and it approximates the risk ratio when the disease is rare.",
        explanation: "The measure follows the design: a cohort counts outcomes from exposures, a case-control compares exposures between outcomes.",
      },
      {
        type: "question",
        prompt: "An outbreak curve shows a sharp rise and fall on one day. What kind of outbreak does this imply, and what is the next analytic step?",
        answer: "A common-source (point) outbreak: a single shared exposure, and the mapping of cases by time of onset against the exposure window confirms it. The next step is the food-specific attack rates per item at the event, with the implicated vehicle withdrawn immediately.",
        explanation: "The shape of the curve directs the hypothesis: one peak means common source, serial waves mean propagated spread from person to person.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "In the cohort worked example, what is the risk ratio for disease among the exposed?",
        options: ["2", "4", "5", "50"],
        correctIndex: 2,
        explanation: "Risk ratio = incidence among the exposed / incidence among the unexposed = 5% / 1% = 5. The relative risk compares probabilities; it is not the raw case count.",
      },
      {
        type: "mcq",
        stem: "A case-control study of a rare cancer is most appropriate when:",
        options: [
          "The disease is rare and the investigator needs an odds ratio",
          "The exposure is rare and followed over years",
          "A census of cases is available",
          "Randomisation is ethical and affordable",
        ],
        correctIndex: 0,
        explanation: "The case-control design starts from the disease and works back to the exposure, which is efficient when the disease is rare; it yields an odds ratio. A cohort is chosen when the exposure is rare and needs following in time.",
      },
      {
        type: "mcq",
        stem: "A study of coffee and myocardial infarction finds the association disappears when cigarette smoking is adjusted for. This illustrates:",
        options: [
          "A type I error",
          "Confounding by smoking",
          "A recall bias",
          "An ecological fallacy",
        ],
        correctIndex: 1,
        explanation: "Smoking is associated with coffee drinking and independently causes myocardial infarction, so it confounds the association. Adjustment for the confounder removes the spurious effect — which is a demonstration of good analysis rather than of statistical error.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 7 — Screening & surveillance (fully authored)
// ---------------------------------------------------------------------------
function lesson7() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: distinguish screening from diagnosis and state the ten classic criteria a screening programme must satisfy; compute sensitivity, specificity, predictive values and likelihood ratios from a 2x2 table; explain how prevalence changes the predictive values of a test while sensitivity and specificity stay fixed; describe the types of screening and the biases — lead-time, length-time and overdiagnosis — that make a screened population look better without living longer; and define surveillance, its types, and the sources on which disease surveillance in India runs.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 5 and 6. Screening is evaluated with the 2x2 table and the measures of the epidemiological methods lesson, and the natural history and iceberg of disease from lesson 1 explain why it works at all.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Screening",
        text: "The systematic application of a test to people who are asymptomatic, in order to divide them into those likely and those unlikely to have the disease, so that the likely group can be confirmed and treated earlier. A screening test sorts; it never diagnoses.",
      },
      {
        type: "paragraph",
        text: "A screening test is a filter, not a verdict. Its value rests on one property of the disease: a long pre-clinical phase during which treatment still works — cancer of the cervix, hypertension, congenital hypothyroidism, phenylketonuria. Where the silent phase is long, a cheap filter applied to thousands will find the few diseases that matter in time to change their outcome; where the disease is already incurable at detection, the filter merely labels people earlier. The entire discipline of screening evaluation is the arithmetic of that trade: how many false alarms each programme buys, and whether it changes deaths rather than diagnoses.",
      },
      {
        type: "table",
        headers: ["", "Screening test", "Diagnostic test"],
        rows: [
          ["Population", "Well people, no symptoms", "People with symptoms or a positive screen"],
          ["Aim", "To sort for further testing", "To establish the diagnosis and guide treatment"],
          ["Acceptance", "Applied to thousands; must be cheap, safe, acceptable", "Applied to few; may be invasive and expensive"],
          ["Result", "'At risk' or 'not at risk'", "Disease present or absent"],
          ["Consequence of a mistake", "Anxiety, needless tests — and a false sense of security", "Missed disease and inappropriate treatment"],
        ],
      },

      { type: "heading", level: 2, text: "The Wilson and Jungner criteria" },
      {
        type: "paragraph",
        text: "In 1968 Wilson and Jungner set the standard that still decides whether a screening programme should exist. The examiners ask the list; the real world applies it.",
      },
      {
        type: "table",
        headers: ["Criterion", "What it requires"],
        rows: [
          ["The condition is an important health problem", "It is common, or serious, or both"],
          ["Treatment for the recognised disease exists", "An accepted, effective treatment is available"],
          ["Facilities for diagnosis and treatment are available", "The system can handle the generators"],
          ["A recognisable latent or early symptomatic stage exists", "There is a pre-clinical phase that treatment can benefit from"],
          ["A suitable test or examination exists", "Valid, safe and acceptable to the population"],
          ["The test is acceptable to the population", "Acceptable in cost, discomfort and culture"],
          ["The natural history is adequately understood", "Including how the disease develops"],
          ["Agreement on whom to treat as a patient", "A diagnostic boundary exists after the screen"],
          ["The cost of case-finding is economically balanced", "Cost is balanced against the benefit achieved"],
          ["Case-finding is a continuing process", "Not a one-off campaign"],
        ],
      },

      { type: "heading", level: 2, text: "The performance of a test" },
      {
        type: "table",
        headers: ["Measure", "Formula", "The question it answers"],
        rows: [
          ["Sensitivity", "True positives / all diseased (a/(a+c))", "Of those with disease, what fraction will the test catch?"],
          ["Specificity", "True negatives / all well (d/(b+d))", "Of those well, what fraction will the test clear?"],
          ["Positive predictive value", "True positives / all positives (a/(a+b))", "Of those positive, what fraction truly have disease?"],
          ["Negative predictive value", "True negatives / all negatives (d/(c+d))", "Of those negative, what fraction truly have none?"],
          ["Likelihood ratio positive", "Sensitivity / (1 - specificity)", "How much the odds of disease rise on a positive"],
          ["Likelihood ratio negative", "(1 - sensitivity) / specificity", "How much the odds of disease fall on a negative"],
        ],
      },
      {
        type: "paragraph",
        text: "A validation study screens 300 people and follows each to the reference standard: 100 are diseased and 200 are well; the screen is positive in 90 of the diseased and 20 of the well.",
      },
      {
        type: "table",
        headers: ["", "Disease present", "Disease absent", "Total"],
        rows: [
          ["Screen positive", "90 (true positive)", "20 (false positive)", "110"],
          ["Screen negative", "10 (false negative)", "180 (true negative)", "190"],
          ["Total", "100", "200", "300"],
        ],
      },
      {
        type: "table",
        headers: ["Measure", "Calculation", "Result"],
        rows: [
          ["Sensitivity", "90 / 100", "90%"],
          ["Specificity", "180 / 200", "90%"],
          ["Positive predictive value", "90 / 110", "81.8%"],
          ["Negative predictive value", "180 / 190", "94.7%"],
          ["Prevalence", "100 / 300", "33.3%"],
          ["Likelihood ratio positive", "0.90 / (1 - 0.90)", "9.0"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Repeat the same test where prevalence is 5% instead of 33.3%: sensitivity and specificity stay 90%, but the positive predictive value falls to 32% — roughly two of every three positive screens are false alarms. This is why a screening test that performs beautifully in a hospital (where prevalence is high) can become a false-alarm factory in a community camp, and why screening in low-prevalence populations must choose tests with high specificity.",
      },

      { type: "heading", level: 2, text: "Types of screening and its biases" },
      {
        type: "table",
        headers: ["Type", "Definition", "Example"],
        rows: [
          ["Mass screening", "Screening applied to a whole population group", "Neonatal screening for hypothyroidism and phenylketonuria"],
          ["Multiple screening", "Several tests at one visit", "BP, blood sugar, haemoglobin and vision at a health camp"],
          ["Targeted (high-risk) screening", "Restricted to people above a risk", "Mammography screening for women over 40 with a family history; HIV screening in antenatal women"],
          ["Case-finding (opportunistic)", "Screening who presents for another reason", "Cervical screening at a family planning visit"],
        ],
      },
      {
        type: "table",
        headers: ["Bias", "What makes the screened group look better", "The control"],
        rows: [
          ["Lead-time bias", "Disease is diagnosed earlier without any change in survival, so 'survival from diagnosis' lengthens", "Compare mortality rates between populations, not survival from diagnosis"],
          ["Length-time bias", "Slow-growing, screen-detectable cases are over-represented; the aggressive cases are missed", "A randomised trial of screening with mortality as the endpoint"],
          ["Overdiagnosis", "The screen finds disease that would never have caused symptoms or death", "Autopsy series; cancer incidence that rises while mortality does not"],
          ["Selection (healthy volunteer) bias", "The people who enrol in screening are healthier to start with", "Randomised invitation; compare intention-to-screen populations"],
        ],
      },
      {
        type: "paragraph",
        text: "The single decisive judge of a screening programme is mortality from the disease in the screened population compared with an unscreened population — randomised and unbiased by the lead time or the enthusiasm. Cervical cytology screening reduced cervical cancer mortality in countries where coverage was high; mammography's effect is real but far smaller, because breast cancer in its pre-clinical phase is less often a disease that screening can call forward. This is the honest arithmetic behind a Wilson and Jungner criterion being a judgement, not a slogan.",
      },

      { type: "heading", level: 2, text: "Surveillance" },
      {
        type: "definition",
        term: "Surveillance",
        text: "The systematic, ongoing collection, collation, analysis and interpretation of health data, with prompt feedback to those who need to know — the watch that tells a health system where to move its resources.",
      },
      {
        type: "table",
        headers: ["Type of surveillance", "How it works", "Strength and weakness"],
        rows: [
          ["Passive", "Health workers report routinely to the system", "Cheap and continuous; under-reporting is the rule"],
          ["Active", "The programme goes and seeks cases", "Complete data, expensive; used for elimination programmes"],
          ["Sentinel", "A chosen set of sites report carefully", "Good quality data for those sites; not population-representative"],
          ["Syndromic", "Cases are reported by a syndrome, not a diagnosis", "Fast and cheap; not specific"],
        ],
      },
      {
        type: "paragraph",
        text: "In India, the Integrated Disease Surveillance Project (IDSP) collects syndromic, presumptive and laboratory-confirmed reports from reporting units through the S, P, L surveillance forms; a handful of notifiable diseases must be reported immediately (plague, cholera, polio, meningitis, dengue, SARS-class outbreaks), and the National Centre for Disease Control coordinates the response. Surveillance is also how non-communicable disease is now tracked — stroke and diabetes registries, risk-factor surveys — and it is the reason a new syndrome is noticed within days rather than years.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Quoting a positive predictive value as a fixed property of the test. Sensitivity and specificity travel with the test; predictive values travel with the population, and they rise and fall with its prevalence. Always quote the prevalence alongside the predictive value, and expect the PPV to shrink in a low-prevalence camp.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating increased 'survival after diagnosis' as proof that screening saves lives. Lead-time bias and length-time bias can lengthen survival after diagnosis while no life is saved; only a mortality comparison by randomised invitation settles the question.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Running a screening programme before facilities exist. The Wilson and Jungner criteria demand available diagnosis and treatment; a screen that finds cases the system cannot treat buys anxiety and costs credibility, and it fails the economic criterion as well.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "From the worked validation table, state the sensitivity, specificity and negative predictive value, and interpret each.",
        answer: "Sensitivity 90% — the test catches 90 of the 100 diseased. Specificity 90% — it clears 180 of the 200 well. Negative predictive value 94.7% — of 190 negatives, only 10 were diseased, so a negative result is reassuring in this population.",
        explanation: "Sensitivity is the test's reach among the diseased; specificity its reach among the well; the predictive values describe how much a positive and a negative should be trusted in that population.",
      },
      {
        type: "question",
        prompt: "Why does the positive predictive value collapse when the same screening test moves from a hospital clinic to a community camp?",
        answer: "Because prevalence falls. Sensitivity and specificity are unchanged, but when disease is rare most positives are among the many well, so the false-positive share of all positives rises sharply and the PPV falls.",
        explanation: "This is a design decision, not a defect of the test; in low-prevalence settings one must raise specificity, screen targeted groups, or tier testing.",
      },
      {
        type: "question",
        prompt: "A district reports that five-year survival after breast cancer diagnosis rose after a screening programme. What two biases must be excluded before claiming a benefit?",
        answer: "Lead-time bias — diagnosis is earlier, so measured survival lengthens without any change in the time of death — and length-time bias — slow-growing screen-detectable tumours are over-represented among detected cases. A randomised comparison of mortality between screened and unscreened populations settles the claim.",
        explanation: "Survival from diagnosis is a quantity the screening itself modifies; mortality from the disease is the unbiased endpoint.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "From the worked validation table, the positive predictive value is:",
        options: ["90%", "81.8%", "94.7%", "33.3%"],
        correctIndex: 1,
        explanation: "PPV = true positives / all positive screens = 90/110 = 81.8%. The 94.7% is the negative predictive value and 33.3% is the prevalence.",
      },
      {
        type: "mcq",
        stem: "A screening programme for cervical cancer is planned. Which of the Wilson and Jungner criteria is fulfilled by the availability of colposcopy and treatment facilities?",
        options: [
          "The condition should be an important health problem",
          "Facilities for diagnosis and treatment should be available",
          "The test should be acceptable to the population",
          "Case-finding should be a continuing process",
        ],
        correctIndex: 1,
        explanation: "The diagnostic and treatment capacity criterion is what makes a positive screen actionable; without it the programme generates positives it cannot resolve.",
      },
      {
        type: "mcq",
        stem: "Of all the sources of bias in screening evaluation, which is removed by comparing disease mortality in a randomly invited and an uninvited population?",
        options: [
          "Only the selection bias",
          "Selection, lead-time and length-time bias together",
          "Only length-time bias",
          "None of the biases",
        ],
        correctIndex: 1,
        explanation: "Random invitation makes the two groups comparable at the outset (removing selection bias) and compares true deaths rather than survival from diagnosis (removing lead-time and length-time bias).",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 8 — Nutrition assessment (fully authored)
// ---------------------------------------------------------------------------
function lesson8() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: list the macronutrients and micronutrients, their energy yields and their functions; describe the four methods of nutritional assessment — anthropometry, clinical, dietary and biochemical — with what each can detect; apply the anthropometric cut-offs for adults and children (BMI, weight-for-height, weight-for-age, MUAC) and interpret a growth chart; describe the spectrum of protein-energy malnutrition — marasmus, kwashiorkor and marasmic kwashiorkor — and the classifications used to grade it; and state the clinical features and prevention of the major deficiency disorders: vitamin A, iron, iodine and vitamin D.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1, 3 and 6. Nutrition is primary prevention, it is delivered through health education and community programmes, and its deficiencies are measured with the epidemiological indicators of the earlier lessons.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Nutrition",
        text: "The science of food and its relationship to health: the nutrients a body needs, in what quantity, from what sources, and what happens chronically when it receives too little or too much of any of them.",
      },
      {
        type: "paragraph",
        text: "Nutrition is the determinant that decides a person's entire later health before the health system ever meets them: a child stunted in the first two years has completed a fixed part of its lifetime's physical and cognitive development by the time it reaches school. Under-nutrition remains the largest single contributor to the global burden of disease in children under five, and it operates through two channels — direct deficiency, and the lowered resistance that turns measles into a death. That is why every national programme, from vitamin A to supplementary nutrition, is built on the assessment described here: you cannot correct what you have not measured.",
      },
      {
        type: "table",
        headers: ["Nutrient class", "Energy yield", "Function", "Chief sources"],
        rows: [
          ["Carbohydrate", "4 kcal per gram", "The main energy supply; fibre adds bulk and regularity", "Cereals, millets, roots, sugar"],
          ["Protein", "4 kcal per gram", "Growth, repair, enzymes, hormones, immunity", "Pulses, milk, egg, meat, fish; cereals are incomplete and are complemented by pulses"],
          ["Fat", "9 kcal per gram — the densest energy", "Energy store, cell membranes, carriage of fat-soluble vitamins", "Oils, ghee, nuts, milk, meat"],
          ["Micronutrients (vitamins and minerals)", "No energy", "Cofactors of metabolism; iron in haemoglobin, iodine in thyroid hormone, calcium in bone", "Fruit, vegetables, milk, iodised salt, iron in meat and pulses"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Protein quality is graded by digestibility and amino-acid completeness. Animal proteins (milk, egg, meat) are complete; cereals are low in lysine and pulses low in methionine, so the Indian practice of dal with rice is not a custom but a complementation — the two together give a better amino-acid balance than either alone.",
      },

      { type: "heading", level: 2, text: "Nutritional assessment: four methods" },
      {
        type: "table",
        headers: ["Method", "What is done", "Anchors and cut-offs", "What it finds"],
        rows: [
          ["Anthropometry", "Weight, height, mid-upper arm circumference, skinfold thickness, head circumference", "BMI classes, weight-for-age and height-for-age, WHO growth charts", "Underweight, wasting, stunting, acute and chronic malnutrition"],
          ["Clinical", "History and examination for signs of deficiency", "Hair, skin, eyes, mouth, thyroid, oedema, wasting", "Founded under-nutrition, specific deficiency states, PEM"],
          ["Dietary", "24-hour recall, food frequency questionnaire, weighing method, food balance sheets", "Portion sizes, cooking practices, household food security", "Intake relative to the recommended dietary allowance"],
          ["Biochemical", "Haemoglobin, serum proteins, retinol, ferritin, urinary iodine", "Laboratory reference ranges", "Subclinical deficiency before clinical signs appear"],
        ],
      },
      {
        type: "paragraph",
        text: "The four methods answer different questions, and a community assessment uses them together: anthropometry tells you who is malnourished, clinical examination why, dietary assessment what has to change in the household, and the laboratory how early the problem has to be caught. The 24-hour recall — everything eaten yesterday, meal by meal, with standardised portion measures — is the field tool most often used, and its weakness is the day recalled may be an unusual one, so a weekday and a weekend day are recorded together.",
      },

      { type: "heading", level: 2, text: "Anthropometry: the working cut-offs" },
      {
        type: "table",
        headers: ["Measurement", "Cut-off", "Interpretation"],
        rows: [
          ["BMI of adults (kg per square metre), WHO", "Below 16.0 severe thinness; 16.0 to 16.9 moderate; 17.0 to 18.4 mild; 18.5 to 24.9 normal", "Chronic energy deficiency in adults"],
          ["BMI of adults, Indian cut-offs (lower)", "Below 18.5 underweight; 23.0 to 24.9 overweight; 25.0 and above obese", "Indians develop metabolic risk at a lower BMI"],
          ["Weight-for-height (children)", "Standard deviation score -2 to -3: moderate wasting; below -3 SD: severe wasting", "Acute wasting — the child's recent nutritional disaster"],
          ["Weight-for-age (children)", "Below -2 SD underweight (Grade II of Gomez classification 60 to 74% of standard; below 60% severe)", "Underweight — a composite of wasting and stunting"],
          ["Height-for-age (children)", "Below -2 SD stunted", "Chronic malnutrition — months of cumulative deficit"],
          ["Mid-upper arm circumference, 6-59 months", "Below 11.5 cm severe acute malnutrition; 11.5 to 12.5 cm moderate acute malnutrition", "The field's fast screen for severe wasting"],
        ],
      },
      {
        type: "paragraph",
        text: "A normal term infant roughly triples its birth weight by one year, and gains about 500 g a month in the first half of the year and less thereafter; an infant who gains nothing for two months, or who crosses a faltering channel on the growth chart, is flagged regardless of any single measurement. The growth chart's power is the direction of travel: it converts one weight into a trend.",
      },

      { type: "heading", level: 2, text: "Protein-energy malnutrition" },
      {
        type: "table",
        headers: ["Condition", "What the child looks like", "Mechanism"],
        rows: [
          ["Marasmus", "Grossly wasted — skin and bone, 'old man' face, no oedema, alert and hungry, lanugo hair", "Adequate protein against a severe calorie deficit: the body consumes its own muscle"],
          ["Kwashiorkor", "Generalised oedema, moon face, flaky-paint dermatosis, sparse depigmented hair, flag sign, hepatomegaly, apathetic, anorexic", "Adequate calories against severe protein deficit: hypoalbuminaemia causes the oedema and the fatty liver"],
          ["Marasmic kwashiorkor", "Both: wasted and oedematous, the most dangerous form in field camps", "Both deficits together"],
        ],
      },
      {
        type: "table",
        headers: ["Classification", "The categories it defines"],
        rows: [
          ["Gomez (weight-for-age, percent of standard)", "90-110% normal; 75-89% grade I (mild); 60-74% grade II (moderate); below 60% grade III (severe)"],
          ["Wellcome (uses oedema)", "Kwashiorkor; marasmic kwashiorkor; marasmus; underweight without oedema"],
          ["Waterlow (two axes separately)", "Wasting: low weight-for-height; stunting: low height-for-age"],
          ["WHO current", "Severe acute malnutrition: weight-for-height below -3 SD, MUAC below 11.5 cm, or bilateral oedema"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Weight-for-age alone cannot distinguish a thin child from a short one, and it is therefore a composite, not a diagnosis of acute malnutrition. A short child of normal weight is stunted (chronic); a child of normal height but low weight is wasted (acute). In a camp the first question is MUAC and oedema, and only then the growth chart.",
      },

      { type: "heading", level: 2, text: "The deficiency disorders" },
      {
        type: "table",
        headers: ["Deficiency", "Clinical picture", "Prevention (the programme angle)"],
        rows: [
          ["Vitamin A", "Night blindness, conjunctival xerosis, Bitot spots on the conjunctiva, corneal xerosis and ulceration, keratomalacia and blindness", "Five megal dose scheme for children under five: 200,000 IU at nine months with measles, repeated every six months to five years; dark green leafy vegetables"],
          ["Iron", "Anaemia — pallor, fatigue, koilonychia, angular stomatitis; in India the commonest deficiency", "Iron and folic acid (IFA) tablet programmes, dietary iron, hookworm treatment, cooking in iron utensils; the doses and the schedule are named in the national anaemia programmes"],
          ["Iodine", "Goitre, cretinism, impaired mental development in the child of a deficient mother", "Iodised salt of not less than 15 ppm at retail; universal salt iodisation is the whole programme"],
          ["Vitamin D and calcium", "Rickets — bowed legs, rachitic rosary, wide wrists, delayed dentition; osteomalacia in adults", "Sunlight exposure, fortified foods, supplements in pregnancy and lactation"],
          ["Protein-energy (spoken of above)", "Kwashiorkor, marasmus, growth failure, infection susceptibility", "Supplementary nutrition, breastfeeding, growth monitoring, treatment protocols for severe acute malnutrition"],
        ],
      },
      {
        type: "definition",
        term: "Anaemia in pregnancy (WHO thresholds)",
        text: "Haemoglobin below 11 g/dL in pregnancy and below 12 g/dL in a non-pregnant woman of reproductive age, below 11 g/dL in the older infant and child, below 13 g/dL in adult men. Below 7 g/dL is severe anaemia and requires treatment before delivery, not merely a screening referral.",
      },
      {
        type: "example",
        text: "Worked example — weighing the same 14-month-old by an ASHA worker and by the medical officer. The ASHA's scale reads 6.8 kg, the officer's weighs 6.2 kg. The child has lost 600 g; the difference is a broken or uncalibrated scale, not a change in the child. This is why calibration of the weighing scale is the first field-check on any growth chart — the chart inherits its credibility from the instrument.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing wasting with stunting. Wasting is thin for height (acute, recent); stunting is short for age (chronic, cumulative); weight-for-age is neither — it mixes the two and is a screening indicator, not a diagnosis. The correct pairing for field triage is weight-for-height with MUAC, and oedema once a week.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Applying Western BMI cut-offs to Indian adults. Indians accumulate visceral fat and develop diabetes and cardiovascular disease at a BMI where a European adult is still 'normal'; the national cut-offs are shifted down (overweight from 23, obesity from 25). Using the Western table under-calls the risk.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating vitamin A deficiency as only an eye disease. Keratomalacia is the terminal sign; earlier xerophthalmia already means depleted stores, and night blindness in a child appears long before the corneal scar — and the same depleted child is the one who dies of measles.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A 6-59-month-old child in a nutrition rehabilitation centre weighs 8.4 kg at 80 cm height with bilateral pitting oedema and a MUAC of 11.0 cm. Classify the nutritional status.",
        answer: "Severe acute malnutrition. Two independent criteria are met: MUAC below 11.5 cm and bilateral nutritional oedema; a weight-for-height below -3 SD would be the third. The child enters the therapeutic programme, not advice and follow-up.",
        explanation: "Oedema and MUAC are the field criteria; they identify the child at risk of death within days, which is why they take precedence over charts.",
      },
      {
        type: "question",
        prompt: "How does wt-for-age differ from height-for-age in what they tell you about a child's nutritional history?",
        answer: "Height-for-age (stunting) reflects months of cumulative under-nutrition — it accumulates and cannot be reversed after about two years. Weight-for-age is a moving composite that falls quickly in an acute crisis and recovers with refeeding. A short child is chronically malnourished; a thin child is acutely so.",
        explanation: "This is the practical reason the two Waterlow axes are reported separately, and why height is used as a record of the past, weight as a monitor of the present.",
      },
      {
        type: "question",
        prompt: "Why is an infant's weight recorded on a growth chart rather than weighed once, and what does a falling weight for two consecutive months mean?",
        answer: "Because one weight has no reference without its trend; the chart converts repeated weights into a velocity. A static weight for two consecutive months, or a drop across channels, is faltering growth and requires assessment of intake, infection and feeding practice.",
        explanation: "Growth monitoring uses the direction of change; a single measurement cannot distinguish normal variation from a real decline.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A 2-year-old weighs 7.2 kg, is 78 cm tall, has bilateral pitting oedema and MUAC of 10.8 cm. The best classification is:",
        options: [
          "Grade I malnutrition",
          "Grade II malnutrition",
          "Severe acute malnutrition",
          "Normal underweight",
        ],
        correctIndex: 2,
        explanation: "MUAC below 11.5 cm and bilateral oedema each independently define severe acute malnutrition. The weight-for-height would also be below -3 SD, so this child needs therapeutic feeding rather than counselling and review.",
      },
      {
        type: "mcq",
        stem: "In a child with kwashiorkor, the oedema is best explained by:",
        options: [
          "High serum albumin with fluid overload",
          "Low serum albumin with fluid moving into the tissues",
          "Cardiac failure from thiamine deficiency",
          "Renal salt retention alone",
        ],
        correctIndex: 1,
        explanation: "Protein deficiency lowers plasma oncotic pressure, so fluid leaves the capillaries and collects in the tissues — the same mechanism that produces the hepatomegaly and flaky-paint dermatosis; marasmus has protein adequate to calorie insufficiency and so does not become oedematous.",
      },
      {
        type: "mcq",
        stem: "Which pairing correctly matches a deficiency with the field programme that prevents it?",
        options: [
          "Vitamin A deficiency - universal salt iodisation",
          "Iron deficiency anaemia - iron and folic acid tablets for pregnant women and children",
          "Iodine deficiency disorders - a vitamin A megal dose",
          "Vitamin D deficiency - iron-fortified salt",
        ],
        correctIndex: 1,
        explanation: "Iron and folic acid tablet distribution is the national programme against anaemia; iodised salt goes with iodine deficiency, the vitamin A megal dose with xerophthalmia, and no iron-fortified salt is an anti-rickets measure.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 9 — Maternal & child health (fully authored)
// ---------------------------------------------------------------------------
function lesson9() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the components of maternal and child health care — antenatal, intranatal, postnatal and newborn care — and the schedule of contacts; apply the risk approach to identify the high-risk mother; list the elements of a clean and safe delivery, and the entitlements of the national maternity benefit schemes; state the newborn care practices — warmth, cord care, initiation of breastfeeding, kangaroo mother care — and the rules of infant and young child feeding; and interpret the national indicators of maternal and child health.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1 and 8. MCH is primary and secondary prevention applied to the mother and the child, and its assessments use the anthropometry and nutrition indicators of the previous lesson.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Risk approach in maternal care",
        text: "The strategy of screening every pregnancy for the factors that predict a complication — age, parity, height, weight, haemoglobin, past obstetric history, present danger signs — so that high-risk mothers deliver at a facility with obstetric capability while the remainder deliver safely in the community.",
      },
      {
        type: "paragraph",
        text: "A mother and her newborn are a single unit of risk: the largest single cause of infant death is the death or severe illness of the mother, and the largest single cause of maternal death is haemorrhage and hypertensive disease. That is why MCH is organised as a continuum — the antenatal visit, the delivery, the postnatal visit and the newborn contact are counted as a chain, and the quality of the delivery depends on the antenatal detection of the risk. The 'risk approach' is not a way of rationing care: it concentrates skill where the danger lies while a skilled attendant attends every birth.",
      },
      {
        type: "table",
        headers: ["Component", "Aims", "The instruments"],
        rows: [
          ["Antenatal care", "Confirm pregnancy and progress, detect risk, treat anaemia and give tetanus protection, prepare for birth", "Registration in the first trimester, the minimum contact schedule, risk assessment, IFA tablets, TT, PM-SMA camp"],
          ["Intranatal (delivery) care", "Clean delivery, safe birth, active management of the third stage, management of complications", "The five cleans at home; the skilled birth attendant and institutional delivery; emergency obstetric referral"],
          ["Postnatal care", "Recovery of the mother, contraception, lactation, detection of puerperal sepsis and depression", "Home visits, examination, counselling"],
          ["Newborn care", "Prevent hypothermia and sepsis, establish feeding, detect and refer the sick newborn", "Essential newborn care, warmth and cord care, kangaroo mother care, the postnatal contact schedule"],
        ],
      },

      { type: "heading", level: 2, text: "Antenatal care" },
      {
        type: "paragraph",
        text: "The purpose of the antenatal contact is not a scan; it is the detection and treatment of what kills. WHO's 2016 antenatal model calls for at least eight contacts with a minimum of four, and India's operational target is a minimum of four antenatal visits with first-trimester registration, reinforced by the Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA) clinics held on day nine of every month, where high-risk pregnancies are examined by obstetricians.",
      },
      {
        type: "table",
        headers: ["The contact delivers", "Content"],
        rows: [
          ["Risk assessment at every visit", "Age, parity, height, weight, blood pressure, pallor, oedema, foetal growth, presentation, previous caesarean or stillbirth"],
          ["Tetanus protection", "TT first dose early in pregnancy; a second dose four weeks later; a woman immunised within the last three years takes only a booster"],
          ["Anaemia prophylaxis", "Iron and folic acid tablets daily after the first trimester for at least 100 days, against the pregnancy's compounded iron demand"],
          ["Birth preparedness and complication readiness", "Where she will deliver, who will take her, what money is arranged, and the danger signs that require immediate travel"],
          ["Diagnosis and treatment", "Syphilis, hepatitis B, HIV and gestational diabetes where available; pre-eclampsia by blood pressure and proteinuria"],
        ],
      },
      {
        type: "table",
        headers: ["High-risk factor", "Why it matters"],
        rows: [
          ["Age under 18 or over 35", "The extremes of reproductive age carry obstructed labour and poor outcome"],
          ["Height below 145 cm or weight below 40 kg (a BMI below 18.5)", "A small pelvis and a small nutritional reserve; obstructed labour and low birth weight"],
          ["Parity 5 and above (grand multiparity)", "Multiparity multiplies the risk of haemorrhage and malpresentation"],
          ["Previous caesarean, stillbirth, neonatal death or recurrent abortion", "The obstetric history predicts the next outcome"],
          ["Antepartum haemorrhage, malpresentation, multiple pregnancy", "Danger signs of the present pregnancy requiring facility care"],
          ["Severe anaemia (haemoglobin below 7 g/dL), pre-eclampsia, eclampsia", "The medical complications that make facility birth a necessity today"],
        ],
      },

      { type: "heading", level: 2, text: "A clean and safe delivery" },
      {
        type: "definition",
        term: "The five cleans",
        text: "For a delivery outside a facility: clean hands and surface, a clean cord, a clean tie, a clean blade — the sequence that prevents the neonatal tetanus and puerperal sepsis that make home delivery lethal.",
      },
      {
        type: "paragraph",
        text: "Wherever available the delivery belongs in a facility with a skilled birth attendant — midwife, nurse or doctor — and the active management of the third stage (an oxytocic, controlled cord traction, uterine massage) is the single most effective intervention against postpartum haemorrhage, the largest killer of mothers. The national scheme that pays for this is the Janani Suraksha Yojana, whose cash assistance for institutional delivery and transport targets poor women, and the Janani Shishu Suraksha Karyakram, which entitles pregnant women and sick newborns to free delivery, drugs, diagnostics, diet, blood and caesarean section.",
      },

      { type: "heading", level: 2, text: "The mother and newborn after birth" },
      {
        type: "table",
        headers: ["Contact", "When", "What is done"],
        rows: [
          ["Mother", "Within 48 hours, again on day 7 (or within the first week), and at six weeks", "Check for haemorrhage and infection, involution, feeding, contraception, mood"],
          ["Newborn (facility or by the ASHA)", "Within 48 hours of birth, with home visits in the first week and on the ASHA newborn schedule in the first 42 days", "Weight, warmth, cord, feeding, jaundice, danger signs, immunisation"],
        ],
      },
      {
        type: "table",
        headers: ["Newborn care practice", "The practice", "The rationale"],
        rows: [
          ["Warmth", "Dry immediately, wrap head and body, keep skin-to-skin, delay the bath for 24 hours", "Hypothermia is the first cause of neonatal death; a newborn has three times the body-surface-per-kg of an adult"],
          ["Cord care", "Cut with a clean blade, tie clean, keep dry, apply chlorhexidine where the risk is high", "Prevents neonatal tetanus and umbilical sepsis"],
          ["Breastfeeding", "Initiate within one hour of birth, exclusively to six months, no prelacteal feed", "Early colostrum supplies antibody and the stimulation that contracts the uterus"],
          ["Kangaroo mother care", "Continuous skin-to-skin contact for a stable baby under about 2 kg", "Stabilises temperature, heart rate and breathing and promotes lactation — a proven neonatal mortality intervention"],
          ["Essential newborn care", "Airway, breathing, warmth, cord care and hygiene at every birth, with resuscitation where needed", "It is applied to every delivery, not only to the high-risk"],
        ],
      },

      { type: "heading", level: 2, text: "Infant and young child feeding" },
      {
        type: "table",
        headers: ["Age", "The recommendation"],
        rows: [
          ["Birth to one hour", "Skin-to-skin and putting to the breast; no prelacteal feed, water or honey"],
          ["0-6 months", "Exclusive breastfeeding — nothing else, not even water"],
          ["From 6 months", "Complementary feeding: adequate, safe, responsive, with continued breastfeeding up to 2 years and beyond"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Colostrum is thick and yellow and is often discarded — wrongly. It is the newborn's first immunisation: secretory IgA, lactoferrin and lymphocytes in a small volume, and it also clears meconium. It is the single most discarded protective food in practice.",
      },

      { type: "heading", level: 2, text: "The MCH indicators" },
      {
        type: "table",
        headers: ["Indicator", "Definition", "Roughly where India stands"],
        rows: [
          ["Maternal mortality ratio", "Deaths from pregnancy-related causes per 100,000 live births", "About 100 per 100,000 live births (official surveys)"],
          ["Infant mortality rate", "Deaths under one year per 1,000 live births", "About 30 per 1,000 live births"],
          ["Under-five mortality rate", "Deaths under five years per 1,000 live births", "Close to 40 per 1,000 live births"],
          ["Neonatal mortality rate", "Deaths in the first 28 days per 1,000 live births", "About a quarter of the infant rate — birth asphyxia, prematurity, sepsis and congenital causes"],
          ["Low birth weight rate", "Live births under 2,500 g", "Around a fifth to a quarter of births"],
          ["Perinatal mortality rate", "Stillbirths plus early neonatal deaths per 1,000 births", "Reported to monitor the delivery and newborn care chain"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Read the indicators against the chain they belong to: the maternal mortality ratio tracks the obstetric pathway (haemorrhage, hypertensive disease, sepsis and unsafe abortion are its four great causes); the infant mortality rate is dominated by the neonatal period once the child survives the first month. Intervening at the delivery affects the first; intervening at feeding, immunisation and diarrhoea affects the second — and a programme aimed at the wrong part of the chain spends its money where fewest deaths are.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Calling four antenatal visits enough. The WHO 2016 model specifies at least eight contacts with a minimum of four; the four-visit minimum is the floor, not the target, and it exists so that a system with limited staff can reach the minimum that still detects risk.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Starting iron tablets after the anaemia is diagnosed rather than after the first trimester and continuing them after delivery. The tablets are routine prophylaxis for every pregnant woman, and mild anaemia (haemoglobin 10 to 10.9) is treated by continuing, not by stopping.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Discarding colostrum, or giving water and honey before the first feed. Prelacteal feeds delay lactogenesis and introduce pathogens; the breast within one hour is what protects the newborn's first days.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Name the five cleans that make a home delivery acceptable when a facility is unreachable.",
        answer: "Clean hands, clean surface, clean cord, clean tie and clean blade. Their purpose is to break the faecal-oral route that brings neonatal tetanus and puerperal sepsis.",
        explanation: "The cleans are the low-cost core of safe birth when transport is impossible, which is why they are taught to every birth attendant.",
      },
      {
        type: "question",
        prompt: "A woman completes a normal delivery and asks when to start contraception. What does a risk-based postnatal schedule offer her?",
        answer: "The mother's contacts continue at 48 hours, day 7 and six weeks; the contraception counselling belongs at the postnatal contact, once the birth is safely behind and the risk of pregnancy before the uterus involution is discussed.",
        explanation: "Spacing the next pregnancy is a maternal-survival act — a conception within six months of a birth carries higher risks for both mother and child.",
      },
      {
        type: "question",
        prompt: "Why does the neonatal period dominate the current infant mortality rate?",
        answer: "Because four leading causes are concentrated in the first 28 days: prematurity and low birth weight, intrapartum-related events (birth asphyxia), sepsis and congenital abnormalities. Postneonatal deaths from diarrhoea, pneumonia and malnutrition are now a smaller share, so the remaining infant mortality is largely neonatal.",
        explanation: "This shift of the risk profile toward the first days of life is why India's child-survival investment has moved toward institutional delivery and newborn care.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "The recommended time for a newborn to be put to the breast after birth is:",
        options: [
          "Immediately after the first bath",
          "At two hours",
          "Within one hour of birth",
          "When the mother requests it, after twelve hours",
        ],
        correctIndex: 2,
        explanation: "Initiation within one hour, skin-to-skin, is what supplies colostrum and stimulates lactation; bathing is delayed for 24 hours to prevent hypothermia.",
      },
      {
        type: "mcq",
        stem: "Which of these mothers is the HIGHEST risk for the current pregnancy?",
        options: [
          "A 26-year-old, parity 2, height 155 cm, haemoglobin 11.5 g/dL",
          "A 30-year-old, parity 1, with previous caesarean for cephalopelvic disproportion and anaemia with haemoglobin 7.5 g/dL",
          "A 22-year-old, primigravida, weight 55 kg",
          "A 19-year-old, parity 1, no complaints",
        ],
        correctIndex: 1,
        explanation: "Her severe anaemia and the previous caesarean for obstructed labour make her high-risk; both put her into facility delivery with obstetric backup, whereas the others have no identified danger factor.",
      },
      {
        type: "mcq",
        stem: "Kangaroo mother care is indicated for:",
        options: [
          "All newborns as a routine substitute for an incubator",
          "Stable low birth weight babies, applied as continuous skin-to-skin contact",
          "Babies with suspected sepsis in the intensive care unit",
          "Preterm babies who cannot breathe unaided",
        ],
        correctIndex: 1,
        explanation: "KMC stabilises temperature, breathing and heart rate in a stable baby under about 2 kg; the newborn who is septic or needs ventilation needs the specialised care KMC cannot replace.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 10 — Family welfare & contraception (fully authored)
// ---------------------------------------------------------------------------
function lesson10() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the demographic cycle and place India in it; compute and interpret the fertility indicators (crude birth rate, total fertility rate, net reproduction rate) and the contraceptive prevalence and unmet need; classify contraceptive methods as spacing or terminal and by mechanism, and state the effectiveness, contraindications and side effects of the methods in common use; describe the counselling approaches (GATHER) used in the family welfare programme; and state the elements of India's population policy approach.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 2, 5 and 9. Contraception is counselled with the behavioural frameworks of the earlier lessons, its programme is measured with the indicators of the statistics lesson, and its maternal-survival value rests on the MCH lesson above.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Family welfare",
        text: "The programme that enables every couple to have the children they want when they want them, and to avoid the pregnancy that would harm the mother or exhaust the family — through contraception, spacing and the reproductive health services that surround both.",
      },
      {
        type: "paragraph",
        text: "Family welfare is not population control. The programme's stated target is a target-free approach in which services meet demand, and its health logic is maternal and child: a first pregnancy before 18, or a birth within months of the last, carries more danger to mother and child than the couple's question of family size suggests. Demography sets the frame — a country growing at every denominator, whether it is a school, a bed or a village water source — and contraception is where individual choice and public interest coincide most completely.",
      },

      { type: "heading", level: 2, text: "The demographic cycle" },
      {
        type: "table",
        headers: ["Stage", "Birth rate", "Death rate", "Population growth", "Where it is seen"],
        rows: [
          ["1. High stationary", "High", "High", "Static", "Pre-industrial societies"],
          ["2. Early expanding", "High", "Falling", "Rapid growth", "Countries that have begun public health improvements"],
          ["3. Late expanding", "Falling", "Low", "Growth slows", "India, most of South Asia today"],
          ["4. Low stationary", "Low", "Low", "Static", "Western Europe, Japan"],
          ["5. Declining", "Very low", "Very low", "Shrinking", "A few European countries"],
        ],
      },
      {
        type: "definition",
        term: "Fertility indicators",
        text: "Crude birth rate: live births per 1,000 population per year. General fertility rate: live births per 1,000 women aged 15-49. Total fertility rate (TFR): the average number of children a woman would bear if she lived through all her reproductive years at current age-specific rates. Net reproduction rate: the average number of daughters per woman — 1.0 means each generation exactly replaces itself.",
      },
      {
        type: "table",
        headers: ["Indicator", "Roughly where India stands", "Why it matters"],
        rows: [
          ["Crude birth rate", "Close to 20 per 1,000 population", "The denominator of births for every service"],
          ["Total fertility rate", "Close to the replacement level of about 2.1 children per woman", "The best single index of fertility control"],
          ["Modern contraceptive prevalence", "Over half of women currently using a modern method", "Measures the programme's reach"],
          ["Unmet need for family planning", "About a tenth of married women who wish to delay or stop", "The demand the programme has not yet met"],
        ],
      },

      { type: "heading", level: 2, text: "Methods of contraception" },
      {
        type: "table",
        headers: ["Class", "Methods", "Durability and effectiveness", "Points for counselling"],
        rows: [
          ["Spacing - hormonal", "Oral contraceptive pills (combined oestrogen-progestin, low dose); injectable progestogen (depot medroxyprogesterone acetate every three months); implants", "Over 99% with correct and consistent use; return to fertility is prompt for pills, delayed for injectables", "Oestrogen contraindications: smoking over 35, hypertension, thromboembolism history, breast cancer, migraine with aura"],
          ["Spacing - intrauterine device", "Copper-bearing device (Cu-T 380A), placed within 10 minutes of placental delivery or in the first weeks postpartum, up to ten years' duration", "Over 99% effective without the user remembering a dose", "Protects against ectopic and endometrial cancer; not against sexually transmitted infection"],
          ["Spacing - barrier", "Male and female condoms", "About 85-98% effective in practice — use errors are the whole story", "The only method that also protects against sexually transmitted infection (dual protection)"],
          ["Spacing - other", "Centchroman (the non-steroidal pill taken twice weekly for three months, then weekly); emergency contraception (levonorgestrel within 72 hours of unprotected sex)", "Centchroman is a safe non-hormonal pill; emergency contraception is the rescue, not a routine", "Emergency pills must be taken early to work, and they carry no protection later in the cycle"],
          ["Terminal (permanent)", "Female sterilisation (minilap — the camp approach — or laparoscopic); male sterilisation (no-scalpel vasectomy)", "Over 99% and permanent", "Vasectomy is simpler, safer and cheaper than tubectomy, needs no general anaesthesia and does not carry the surgical site of an abdominal incision — and is never to be presented as affecting virility"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "GATHER is the counselling sequence used in the family welfare programme: Greet, Ask (about children and wishes), Tell (the options and their properties), Help (choose a method), Explain (how to use it), Return (a follow-up visit). 'Return' is the step most often omitted, and it is the one that keeps a woman on a method and returns her for the next spacing decision.",
      },
      {
        type: "example",
        text: "A mother of three delivered yesterday. In GATHER: Greet; Ask — 'you have three daughters, would you like more? when?'; Tell — the spacing methods she can start today, including a post-placental insertion and the pill after three weeks, and the terminal options; Help — she chooses a Cu-T; Explain — the insertion is painless at this point, bleeding may increase at first, and the threads are checked by the ASHA; Return — visit day 3 for bleeding, and day 42 for the postnatal visit.",
      },

      { type: "heading", level: 2, text: "The population policy context" },
      {
        type: "paragraph",
        text: "India's programme has passed through three phases: the clinic-based approach of the 1950s, the target-driven camp approach of the 1970s — discredited by its coercion during the Emergency — and since 1996 the target-free approach, in which the programme measures itself by the demand it meets rather than by the numbers it performs. The National Population Policy 2000 set the goal of TFR at replacement level by 2010 (with unmet need as the priority metric), and the follow-on emphasis is on the quality and coverage of reproductive and child health services — RCH-II — rather than on sterilisation statistics alone.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The modern programme's three practical demands are unmet need, quality of care, and male participation: a programme with a low unmet need but poor service quality has met demand on paper only, and vasectomy — cheap, safe and effective — remains the most under-used method in the basket.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Recommending a combined oral contraceptive to a woman over 35 who smokes, or to one with hypertension, a history of thromboembolism or breast cancer. Those are the oestrogen contraindications; the counsel for her is an intrauterine device, an injectable, centchroman or a barrier.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Quoting condoms as a barrier against pregnancy only. The condom is the only method in the basket that also interrupts sexually transmitted infections, which is why family planning counselling must present dual protection — contraception and the condom — rather than an implicit either/or.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing the crude birth rate with the fertility. The crude birth rate is births per 1,000 of the whole population and is sensitive to the age structure; the total fertility rate is births per woman through her reproductive years and is the figure that determines population replacement.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does a large age structure allow a country's crude birth rate to fall while its total fertility rate stays above replacement?",
        answer: "Because the crude birth rate divides births by the whole population; if many of those births were themselves born in a recent boom, that cohort enters reproductive age and sustains a high TFR even as the rate per thousand population falls. The two measures answer different questions — current population momentum versus current reproductive behaviour.",
        explanation: "Demographic momentum is why a replacement-level TFR takes decades to translate into a stationary population.",
      },
      {
        type: "question",
        prompt: "A woman of 36 who smokes 10 cigarettes a day asks for 'the pill'. What should you counsel?",
        answer: "Avoid the combined oral contraceptive: smoking over 35 is an absolute contraindication (raised risk of myocardial infarction and stroke). Offer an intrauterine device, an injectable progestin, centchroman, or condoms — and add smoking-cessation counselling of her own.",
        explanation: "The contraindication is about oestrogen, so the non-oestrogen methods remain fully available to her.",
      },
      {
        type: "question",
        prompt: "What is the GATHER sequence, and why is 'Return' emphasised in family welfare?",
        answer: "Greet, Ask, Tell, Help, Explain, Return. The Return step schedules the follow-up that confirms the method is continuing and acceptable, treats side effects before they cause discontinuation, and re-opens the conversation when circumstances change — a continuation mechanism, not a courtesy.",
        explanation: "Most contraceptive failure is discontinuation rather than failure of the method itself, and GATHER is designed against exactly that.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which method provides protection against both pregnancy and sexually transmitted infection?",
        options: [
          "Copper-bearing intrauterine device",
          "Combined oral contraceptive",
          "Male condom",
          "Injectable progestogen",
        ],
        correctIndex: 2,
        explanation: "The condom interrupts transmission at the source; every other method prevents pregnancy only, which is why dual protection counsels a condom alongside any method chosen.",
      },
      {
        type: "mcq",
        stem: "A total fertility rate of 2.0 in a country implies:",
        options: [
          "Each generation exactly replaces itself",
          "The country is below replacement level since replacement is about 2.1",
          "The crude birth rate is 2 per 1,000",
          "The population is growing at 2% a year",
        ],
        correctIndex: 1,
        explanation: "Replacement fertility is about 2.1 children per woman, allowing for mortality before reproduction; 2.0 is below replacement. The crude birth rate and the growth rate are separate figures.",
      },
      {
        type: "mcq",
        stem: "Which of the following is an appropriate method for a 40-year-old woman who has completed her family and wants a permanent method?",
        options: [
          "Long-acting combined oral contraception until menopause",
          "Centchroman for the next five years",
          "Female tubal sterilisation, or vasectomy for her husband as the equivalent permanent choice",
          "Emergency contraception if a method fails",
        ],
        correctIndex: 2,
        explanation: "Tubal sterilisation (or vasectomy, which is simpler and safer) is the terminal method for a completed family; pills and centchroman are spacing methods, and emergency contraception is not a family-planning strategy.",
      },
    ],
  };
}

export const COMMUNITY_MEDICINE: SubjectSeed = {
  id: "mbbs-community-medicine",
  slug: "community-medicine",
  title: "Community Medicine",
  code: "CMED 301",
  department: "Community Medicine",
  level: 300,
  credits: 6,
  semester: "full",
  description:
    "Preventive and social medicine: epidemiology, biostatistics, environment, nutrition, maternal and child health, national health programmes and health administration, with urban and rural field postings (AIIMS semesters III–VIII plus rural internship).",
  faculty: "clinical-medicine",
  prereqCourses: ["physiology-cell-and-general", "paediatrics-child-health"],
  modules: [
    { slug: "foundations-health", title: "M1 — Foundations of health & behavioural sciences" },
    { slug: "environment-epidemiology", title: "M2 — Environment, biostatistics & epidemiology" },
    { slug: "nutrition-mch", title: "M3 — Nutrition, maternal & child health" },
    { slug: "disease-control-programmes", title: "M4 — Disease control & national health programmes" },
    { slug: "health-systems", title: "M5 — Health systems, economics & field practice" },
  ],
  lessons: [
    { title: "Concepts of health & disease", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Concepts of health and disease", slug: "concepts-health-disease", summary: "Definitions of health, the natural history and iceberg of disease, levels of prevention and the determinants of population health.", blooms: "understand", minutes: 35, prereq: [] }, content: lesson1() as never },
    { title: "Behavioural sciences & communication", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Behavioural sciences and communication", slug: "behavioural-sciences-communication", summary: "Doctor–patient communication, health beliefs, behaviour change models and counselling skills used in prevention.", blooms: "apply", minutes: 35, prereq: ["concepts-health-disease"] }, content: lesson2() as never },
    { title: "Health education & planning", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Health education and planning", slug: "health-education-planning", summary: "Methods and media of health education, and the steps of planning and evaluating a community health intervention.", blooms: "apply", minutes: 35, prereq: ["behavioural-sciences-communication"] }, content: lesson3() as never },
    { title: "Environmental health", module: 2, estimatedMinutes: 45, authored: true, concept: { title: "Environmental health", slug: "environmental-health", summary: "Water, air, noise, housing, ventilation, sanitation and pollution — their health effects and community-level control.", blooms: "analyze", minutes: 45, prereq: ["concepts-health-disease"] }, content: lesson4() as never },
    { title: "Biostatistics", module: 2, estimatedMinutes: 45, authored: true, concept: { title: "Biostatistics", slug: "biostatistics", summary: "Measures of central tendency and variation, probability, sampling, tests of significance, correlation and the presentation of health data.", blooms: "apply", minutes: 50, prereq: [] }, content: lesson5() as never },
    { title: "Epidemiological methods", module: 2, estimatedMinutes: 45, authored: true, concept: { title: "Epidemiological methods", slug: "epidemiology-methods", summary: "Measures of disease frequency, study designs, causality, bias, confounding, screening test performance and outbreak investigation.", blooms: "analyze", minutes: 45, prereq: ["biostatistics"] }, content: lesson6() as never },
    { title: "Screening & surveillance", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Screening and disease surveillance", slug: "screening-surveillance", summary: "Criteria and evaluation of screening programmes, and the systems that detect and report disease in populations.", blooms: "evaluate", minutes: 35, prereq: ["epidemiology-methods"] }, content: lesson7() as never },
    { title: "Nutrition assessment", module: 3, estimatedMinutes: 45, authored: true, concept: { title: "Nutrition assessment", slug: "nutrition-assessment", summary: "Macronutrients and micronutrients, dietary assessment, growth monitoring, protein-energy malnutrition and nutritional deficiency disorders.", blooms: "apply", minutes: 45, prereq: [] }, content: lesson8() as never },
    { title: "Maternal & child health", module: 3, estimatedMinutes: 45, authored: true, concept: { title: "Maternal and child health", slug: "maternal-child-health", summary: "Antenatal, intranatal and postnatal care, risk approach, low birth weight, breastfeeding and child survival programmes.", blooms: "apply", minutes: 45, prereq: ["nutrition-assessment"] }, content: lesson9() as never },
    { title: "Family welfare & contraception", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "Family welfare and contraception", slug: "family-welfare-contraception", summary: "Demographic cycle, fertility indicators, contraceptive methods, spacing and the population policy context.", blooms: "apply", minutes: 35, prereq: ["maternal-child-health"] }, content: lesson10() as never },
    { title: "Communicable disease control", module: 4, estimatedMinutes: 50, authored: false, concept: { title: "Communicable disease control", slug: "communicable-disease-control", summary: "Chain of infection, contact tracing, quarantine, disinfection and the epidemiology and control of major epidemic-prone diseases.", blooms: "analyze", minutes: 50, prereq: ["epidemiology-methods"] }, content: PLACEHOLDER },
    { title: "Non-communicable disease", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Non-communicable disease", slug: "non-communicable-disease", summary: "Epidemiology and prevention of cardiovascular disease, diabetes, cancer, chronic respiratory disease and mental disorders.", blooms: "analyze", minutes: 40, prereq: ["communicable-disease-control"] }, content: PLACEHOLDER },
    { title: "National health programmes", module: 4, estimatedMinutes: 45, authored: false, concept: { title: "National health programmes", slug: "national-health-programs", summary: "Structure, target groups and delivery of the national programmes for immunisation, tuberculosis, HIV, malaria, reproductive health and disease elimination.", blooms: "understand", minutes: 45, prereq: ["communicable-disease-control"] }, content: PLACEHOLDER },
    { title: "Occupational health", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Occupational health", slug: "occupational-health", summary: "Workplace hazards, dust diseases, pneumoconioses, occupational infections, fitness certification and prevention at work.", blooms: "apply", minutes: 40, prereq: ["environmental-health"] }, content: PLACEHOLDER },
    { title: "Health administration & management", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Health administration and management", slug: "health-administration-management", summary: "Health system levels, primary health care, planning and management of materials, finance and human resources, and health information systems.", blooms: "apply", minutes: 40, prereq: [] }, content: PLACEHOLDER },
    { title: "Health economics & geriatrics", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Health economics and geriatrics", slug: "health-economics-geriatrics", summary: "Cost, cost-effectiveness and health financing, plus the health problems and care of ageing populations.", blooms: "understand", minutes: 35, prereq: ["health-administration-management"] }, content: PLACEHOLDER },
    { title: "Rehabilitation & counselling", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Rehabilitation and counselling", slug: "rehabilitation-counselling", summary: "Disability assessment, community-based rehabilitation, assistive devices and counselling in chronic and terminal illness.", blooms: "apply", minutes: 35, prereq: ["health-economics-geriatrics"] }, content: PLACEHOLDER },
    { title: "Rural posting & field project", module: 5, estimatedMinutes: 60, authored: false, concept: { title: "Rural posting and field project", slug: "rural-posting-field-project", summary: "The rural health centre posting: household surveys, water and sanitation assessment, programme delivery and the community field project report.", blooms: "evaluate", minutes: 60, prereq: ["screening-surveillance"] }, content: PLACEHOLDER },
  ],
  sbas: [],
}

export async function seedCommunityMedicine(): Promise<void> {
  const counts = await seedMbbsCourse(COMMUNITY_MEDICINE);
  console.log(`✓ ${COMMUNITY_MEDICINE.code} ${COMMUNITY_MEDICINE.title}: ${counts.modules} modules · ${counts.concepts} concepts · ${counts.lessons} lessons · ${counts.items} items`);
}

if (process.argv[1] && process.argv[1].includes("mbbs/community-medicine")) {
  seedCommunityMedicine()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
}
