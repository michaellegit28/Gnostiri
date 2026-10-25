import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Assessment content — Community Medicine (mbbs-community-medicine).
 *
 * 23 original SBA items establishing the Community Medicine bank on the spine
 * seeded 2026-10-24 (0 items before this file). Each item is tagged to an
 * existing ConceptNode (see prisma/seed-university.ts); no slug is invented.
 * Covers concepts of health/disease, health education, biostatistics,
 * epidemiological methods, screening, environmental health, nutrition,
 * maternal & child health, family welfare, communicable/non-communicable
 * disease control, national health programmes, occupational health, health
 * administration/economics and rural posting.
 *
 * Idempotent: upserts on the item slug; safe to re-run. orderIndex starts at
 * 0 so the bank keeps a contiguous, gap-free ordering.
 *
 * Governance: every item ships reviewStatus "needs-human-review" — the
 * 2026-10-20 repair established that production rows must never sit at
 * "draft" (42 draft rows drifted live before). needsCheck flags the numeric
 * or guideline-dependent reasoning a physician should double-check.
 */

const COURSE_SLUG = "community-medicine";

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
  // 1 — Concepts of health and disease (easy)
  {
    slug: "commed-who-definition-of-health",
    concept: "concepts-health-disease",
    format: "sba",
    stem: "Which statement best reflects the definition of health adopted by the World Health Organization in its Constitution?",
    options: [
      "A state of complete physical, mental and social well-being and not merely the absence of disease or infirmity",
      "The absence of disease, disability or infirmity, as determined by clinical examination and investigations",
      "Adequate housing, nutrition and income, with access to health services when illness occurs",
      "A biological state in which all organ systems function within laboratory reference ranges",
    ],
    correctAnswer: "A state of complete physical, mental and social well-being and not merely the absence of disease or infirmity",
    explanation: "The WHO (1948) definition frames health as a positive, holistic state of complete physical, mental and social well-being, explicitly not just the absence of disease or infirmity. The purely biomedical definition restricts health to the absence of pathology, while socioeconomic conditions and normal laboratory values are determinants and findings rather than the definition itself. Later summations, such as health as the highest attainable standard of functioning, build on this constitutional anchor rather than replace it.",
    difficulty: "easy",
    marks: 1,
    needsCheck: false, // WHO Constitution 1948 wording
  },

  // 2 — Concepts of health and disease (medium)
  {
    slug: "commed-epidemiologic-triad",
    concept: "concepts-health-disease",
    format: "sba",
    stem: "In the epidemiologic triad model of disease causation, disease occurs when which interacting components fall out of balance?",
    options: [
      "Agent, host and environment — control measures target one or more of these three components",
      "Genes, lifestyle and chance — no intervention can alter the outcome",
      "Agent, vector and reservoir only, regardless of host susceptibility",
      "Exposure, symptom onset and outcome, as in the natural history of disease",
    ],
    correctAnswer: "Agent, host and environment — control measures target one or more of these three components",
    explanation: "The classic epidemiologic triad holds that disease results from an imbalance among the agent (microorganism, nutrient deficiency, chemical or physical factor), the host (immunity, genetics, age, behaviour) and the environment (climate, sanitation, housing, vectors). Control programmes attack the agent (vaccines, antimicrobials), the susceptible host (immunisation, nutrition) or the shared environment (safe water, vector control). Modern teaching extends the triad into a web of causation including behavioural, social and policy factors, but the triad remains the basic framework.",
    difficulty: "medium",
    marks: 1,
  },

  // 3 — Health education and planning (medium)
  {
    slug: "commed-health-education-participation",
    concept: "health-education-planning",
    format: "sba",
    stem: "A village health worker discusses families' beliefs about latrines, answers their questions and lets each household observe a working model before use becomes widespread. Which principle does this best illustrate?",
    options: [
      "Learning by doing and participation — planned health education persuades people rather than merely instructing them",
      "Propaganda, because the message originates from an official authority",
      "Passive information transfer, since distributing leaflets would achieve the same change",
      "Legislation, because latrine construction is a legal requirement",
    ],
    correctAnswer: "Learning by doing and participation — planned health education persuades people rather than merely instructing them",
    explanation: "Health education is a voluntary process of behaviour change built on two-way communication, motivation and active participation — demonstration and supervised practice are the most effective methods for adopting a practice like latrine use. Propaganda is one-sided and coercive in intent, information transfer without involvement changes little behaviour, and legislation compels by law rather than persuading. This is why programmes first assess knowledge, attitudes and practices (the KAP gap) before designing the message and channel.",
    difficulty: "medium",
    marks: 1,
  },

  // 4 — Biostatistics (medium)
  {
    slug: "commed-skewed-incomes-median",
    concept: "biostatistics",
    format: "sba",
    stem: "A household survey of monthly incomes finds that most families earn modest amounts while a few earn extremely high salaries. Which measure of central tendency best represents the typical household income?",
    options: [
      "Median, because it is unaffected by a few extreme values in a skewed distribution",
      "Arithmetic mean, because it uses every data point in the sample",
      "Mode, because the most frequently occurring value is always reported for income",
      "Standard deviation, because it measures how values cluster around the centre",
    ],
    correctAnswer: "Median, because it is unaffected by a few extreme values in a skewed distribution",
    explanation: "Income data are typically right-skewed, so a small number of very high values pulls the arithmetic mean above the level experienced by most households; the median, the middle value of ordered data, is resistant to extreme observations and best describes a typical household. The mode is the most frequent value and is not automatically the best summary for a continuous variable like income. The standard deviation measures dispersion around the centre, not central tendency itself.",
    difficulty: "medium",
    marks: 1,
  },

  // 5 — Biostatistics: test evaluation arithmetic (hard)
  {
    slug: "commed-sensitivity-specificity-calculation",
    concept: "biostatistics",
    format: "sba",
    stem: "A screening test is evaluated in 200 people known to have disease and 100 known not to have it. Of the diseased, 180 test positive; of the non-diseased, 60 test negative. Using these figures, what is the specificity of the test?",
    options: [
      "60% — true negatives (60) divided by all non-diseased people (100), i.e. 60/100",
      "90% — true positives (180) divided by all diseased people (200), i.e. 180/200",
      "80% — correctly classified results (180 + 60) divided by all 300 tested, i.e. 240/300",
      "40% — the proportion of non-diseased people who test positive, i.e. 40/100",
    ],
    correctAnswer: "60% — true negatives (60) divided by all non-diseased people (100), i.e. 60/100",
    explanation: "Specificity is the proportion of true negatives among all non-diseased people: 60 true negatives with 100 − 60 = 40 false positives, so 60/(60 + 40) = 60%. The 180/200 = 90% figure is sensitivity (true positives among the diseased), 240/300 = 80% is overall agreement (accuracy), and 40/100 = 40% is the false-positive rate, which equals 1 − specificity and is not itself specificity.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false, // specificity 60/100; sensitivity 90%; accuracy 240/300 = 80%; FPR 40%
  },

  // 6 — Epidemiological methods (medium)
  {
    slug: "commed-incidence-vs-prevalence",
    concept: "epidemiology-methods",
    format: "sba",
    stem: "During one year, 30 new cases of pulmonary tuberculosis are detected in a town of 60,000 residents, and at the end of that year 45 residents still have active disease. Which interpretation is correct?",
    options: [
      "Incidence is the 30 new cases per 60,000 population for the year (50 per 100,000 per year), while prevalence counts all existing cases — 45 of 60,000, or 75 per 100,000 — at that point in time",
      "Incidence is 45/60,000, because all known cases, old and new, are counted when disease occurs",
      "Incidence and prevalence are interchangeable for chronic diseases such as tuberculosis",
      "Incidence requires person-time, so it cannot be calculated for this population in one year",
    ],
    correctAnswer: "Incidence is the 30 new cases per 60,000 population for the year (50 per 100,000 per year), while prevalence counts all existing cases — 45 of 60,000, or 75 per 100,000 — at that point in time",
    explanation: "Incidence measures new cases arising in the population at risk over a defined period (30/60,000 = 50 per 100,000 per year), whereas prevalence measures existing cases, old and new, at a point or period (45/60,000 = 75 per 100,000). The two are related approximately by prevalence ≈ incidence × duration of disease. A cumulative incidence can be expressed as a proportion when the population is followed for the whole year; only the person-time (density) form of incidence needs person-years, so the measure is calculable here.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // 30/60000 = 50/100000/yr; 45/60000 = 75/100000
  },

  // 7 — Epidemiological methods: outbreak arithmetic (hard)
  {
    slug: "commed-outbreak-attack-rate",
    concept: "epidemiology-methods",
    format: "sba",
    stem: "After a community feast, 200 attendees are followed for 48 hours and 60 develop vomiting and diarrhoea. What is the attack rate?",
    options: [
      "30% — new cases (60) divided by the 200 people who were at risk, i.e. 60/200",
      "12% — cases (60) divided by the wider community population of 500",
      "60 per 1,000 — the usual cumulative-incidence notation for a feast outbreak",
      "3% — cases divided by the number of affected households (60/20)",
    ],
    correctAnswer: "30% — new cases (60) divided by the 200 people who were at risk, i.e. 60/200",
    explanation: "The attack rate is a cumulative incidence expressed as a percentage for a defined exposed population during an outbreak: everyone who attended the feast was at risk, so the denominator is all 200 attendees and 60/200 = 30%. Dividing by the surrounding community who were not at risk dilutes the denominator, and dividing by affected households or unrelated units answers a different question. Attack rates are usually reported for exposure-specific subgroups (for example, those who ate a particular dish) alongside the overall rate.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false, // attack rate = cases/at-risk = 60/200 = 30%
  },

  // 8 — Epidemiological methods: study design (medium)
  {
    slug: "commed-study-design-measure-association",
    concept: "epidemiology-methods",
    format: "sba",
    stem: "Which pairing of study design with its principal measure of association is correct?",
    options: [
      "Case-control study — odds ratio; cohort study — relative risk",
      "Case-control study — relative risk; cohort study — odds ratio only",
      "Randomised controlled trial — attributable risk percent as its only measure",
      "Cross-sectional survey — incidence rate",
    ],
    correctAnswer: "Case-control study — odds ratio; cohort study — relative risk",
    explanation: "In a case-control study subjects are sampled by disease status, so the population at risk and true incidence are unknown and the association is expressed as an odds ratio. A cohort study measures incidence in exposed and unexposed groups, giving the relative risk directly. Cross-sectional surveys measure prevalence (and prevalence ratios), not incidence, and randomised trials measure incidence but can report relative risks, risk differences and number needed to treat alongside attributable fractions.",
    difficulty: "medium",
    marks: 1,
  },

  // 9 — Screening and surveillance (easy)
  {
    slug: "commed-screening-test-sensitivity-priority",
    concept: "screening-surveillance",
    format: "sba",
    stem: "A screening programme applies a test to a large apparently healthy population, with any positive result confirmed by a definitive diagnostic test. Which test characteristic should the screening tool prioritise, and why?",
    options: [
      "High sensitivity, so that as few cases as possible are missed; false positives are acceptable because they are later excluded by the confirmatory test",
      "High specificity, because minimising false negatives is the role of specificity",
      "High positive predictive value in the population to be screened",
      "High accuracy, which is independent of the prevalence of disease",
    ],
    correctAnswer: "High sensitivity, so that as few cases as possible are missed; false positives are acceptable because they are later excluded by the confirmatory test",
    explanation: "Screening tests are applied to healthy people where disease prevalence is low, so a missed case loses the programme's main benefit — the screening tool should be highly sensitive. False positives are tolerated because the confirmatory diagnostic test (which should be highly specific) removes them. Positive predictive value falls when prevalence is low and is therefore usually poor in screening regardless of test characteristics, and accuracy itself depends on prevalence.",
    difficulty: "easy",
    marks: 1,
  },

  // 10 — Screening and surveillance: predictive value arithmetic (hard)
  {
    slug: "commed-ppv-prevalence-dependence",
    concept: "screening-surveillance",
    format: "sba",
    stem: "A screening test with 90% sensitivity and 90% specificity is used in two clinics: in clinic A disease prevalence is 50% and in clinic B it is 10%. What positive predictive value should be expected in each clinic?",
    options: [
      "Clinic A 90% and clinic B 50% — predictive value rises as prevalence rises, so the same test performs differently in the two populations",
      "90% in both clinics — positive predictive value depends only on sensitivity and specificity",
      "50% in both clinics — prevalence does not influence predictive value",
      "Clinic A 50% and clinic B 90% — positive predictive value falls as prevalence rises",
    ],
    correctAnswer: "Clinic A 90% and clinic B 50% — predictive value rises as prevalence rises, so the same test performs differently in the two populations",
    explanation: "Predictive value depends on prevalence, while sensitivity and specificity are fixed test properties. In clinic A (50% prevalence, 500 diseased of 1000) sensitivity gives 450 true positives and specificity gives 50 false positives from the 500 non-diseased, so PPV = 450/(450 + 50) = 90%. In clinic B (100 diseased of 1000) there are 90 true positives and 90 false positives from the 900 non-diseased, so PPV = 90/180 = 50% — a 10% false-positive rate applied to a large non-diseased group outweighs the true positives when prevalence is low.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false, // PPV A 450/500=90%; PPV B 90/180=50%; Se=Sp=90%
  },

  // 11 — Environmental health (easy)
  {
    slug: "commed-cholera-safe-water",
    concept: "environmental-health",
    format: "sba",
    stem: "A district faces recurrent cholera outbreaks after monsoon flooding. Which environmental measure most directly interrupts transmission in the community?",
    options: [
      "Chlorination and safe storage of drinking water, with excreta disposal and handwashing",
      "Indoor residual spraying of dwellings against mosquito vectors",
      "Rodent control and sanitation around food stores",
      "Mass chemoprophylaxis with doxycycline for the whole district",
    ],
    correctAnswer: "Chlorination and safe storage of drinking water, with excreta disposal and handwashing",
    explanation: "Cholera is transmitted by the faecal–oral route through water and food contaminated with Vibrio cholerae, so safe water, sanitation and hygiene break the chain at its transmission link. Indoor residual spraying targets mosquito-borne diseases such as malaria and filariasis, rodent control addresses plague and leptospirosis, and mass chemoprophylaxis is not a cholera control measure — management relies on prompt oral rehydration, safe water and reporting of cases.",
    difficulty: "easy",
    marks: 1,
  },

  // 12 — Nutrition assessment (easy)
  {
    slug: "commed-muac-severe-acute-malnutrition",
    concept: "nutrition-assessment",
    format: "sba",
    stem: "During growth monitoring, an 18-month-old child weighing below expectation has a mid-upper arm circumference of 11.0 cm with no oedema. Which interpretation is correct?",
    options: [
      "MUAC below 11.5 cm indicates severe acute malnutrition and warrants referral for therapeutic feeding",
      "MUAC above 10 cm is normal, so malnutrition is excluded",
      "MUAC only classifies moderate acute malnutrition; severe disease requires oedema to be present",
      "MUAC cannot be interpreted in a toddler and applies only to infants under six months",
    ],
    correctAnswer: "MUAC below 11.5 cm indicates severe acute malnutrition and warrants referral for therapeutic feeding",
    explanation: "For children aged 6–59 months, MUAC below 11.5 cm defines severe acute malnutrition, 11.5–12.4 cm defines moderate acute malnutrition, and 12.5 cm or above is normal. MUAC is a simple, rapid field measure of acute wasting used in community screening precisely because it flags high-risk children for assessment and therapeutic feeding referral. Oedematous malnutrition (kwashiorkor) is diagnosed clinically and does not have to accompany wasting.",
    difficulty: "easy",
    marks: 1,
  },

  // 13 — Nutrition assessment: BMI arithmetic (hard)
  {
    slug: "commed-bmi-calculation-classification",
    concept: "nutrition-assessment",
    format: "sba",
    stem: "A 34-year-old man weighs 80 kg and is 1.6 m tall. What is his body mass index and its WHO classification?",
    options: [
      "31.3 kg/m² — weight divided by height squared (80 ÷ 1.6² = 80 ÷ 2.56), classified as obesity class I",
      "50.0 kg/m² — weight divided by height (80 ÷ 1.6), classified as extreme obesity",
      "20.0 kg/m² — height squared divided by weight (1.6² ÷ 80), classified as normal weight",
      "25.0 kg/m² — weight divided by an incorrectly measured height of 1.8 m, classified as overweight",
    ],
    correctAnswer: "31.3 kg/m² — weight divided by height squared (80 ÷ 1.6² = 80 ÷ 2.56), classified as obesity class I",
    explanation: "BMI is weight in kilograms divided by the square of height in metres: 80 ÷ (1.6 × 1.6) = 80 ÷ 2.56 = 31.25, i.e. about 31.3 kg/m², which falls in WHO obesity class I (30.0–34.9). Dividing weight by height without squaring gives 50 and inverts the formula, while dividing height squared by weight reverses the ratio entirely. WHO bands are: underweight below 18.5, normal 18.5–24.9, overweight 25.0–29.9, obesity 30.0 and above.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false, // 80/2.56 = 31.25 → class I obesity (30.0–34.9)
  },

  // 14 — Maternal and child health (easy)
  {
    slug: "commed-exclusive-breastfeeding-six-months",
    concept: "maternal-child-health",
    format: "sba",
    stem: "Which infant feeding practice is recommended for the first six months of life?",
    options: [
      "Exclusive breastfeeding — breast milk alone, with no other food or fluids including water",
      "Breast milk plus water and honey from birth in hot climates",
      "Combined breastfeeding and formula feeding from two weeks of age",
      "Animal milk introduced at three months while breastfeeding continues",
    ],
    correctAnswer: "Exclusive breastfeeding — breast milk alone, with no other food or fluids including water",
    explanation: "WHO and UNICEF recommend initiating breastfeeding within the first hour of birth and exclusive breastfeeding — no other food, liquid or water — for the first six completed months, with continued breastfeeding alongside adequate complementary foods thereafter. Breast milk supplies sufficient fluid even in hot weather, and prelacteal feeds or early water reduce intake and increase infection risk. After six months breast milk alone no longer meets growing energy and iron needs.",
    difficulty: "easy",
    marks: 1,
  },

  // 15 — Maternal and child health (medium)
  {
    slug: "commed-who-eight-anc-contacts",
    concept: "maternal-child-health",
    format: "sba",
    stem: "Under WHO antenatal care guidance, what is the minimum recommended number of antenatal contacts in a normal pregnancy, and when should they begin?",
    options: [
      "Eight contacts, with the first in the first 12 weeks of gestation",
      "Four contacts, beginning after 20 weeks of gestation",
      "Twelve contacts, one for each calendar month regardless of gestation",
      "Two contacts, a booking visit in the first trimester and one at term",
    ],
    correctAnswer: "Eight contacts, with the first in the first 12 weeks of gestation",
    explanation: "The 2016 WHO antenatal care model recommends at least eight contacts starting in the first trimester, replacing the earlier focused-antenatal-care model of four visits so that anaemia, hypertension, infections and fetal problems are detected earlier. National programmes and older texts may still cite four visits, so students should follow the current guidance in force at their institution. Each contact bundles screening, tetanus toxoid, iron and folic acid, and birth preparedness counselling.",
    difficulty: "medium",
    marks: 1,
    needsCheck: true, // WHO 2016 ≥8 contacts; some national guidance cites ≥4
  },

  // 16 — Family welfare and contraception (medium)
  {
    slug: "commed-contraception-spacing-pill",
    concept: "family-welfare-contraception",
    format: "sba",
    stem: "A newly married couple wishes to delay their first child by about two years and hopes to conceive soon afterwards. Which contraceptive approach is most appropriate?",
    options: [
      "Combined oral contraceptive pills during the interval, because fertility returns promptly when the method is stopped",
      "Permanent female sterilisation, because it is completely effective for the interval",
      "Copper-T 380A intrauterine device, because a device lasting up to 10 years suits a two-year need",
      "Lactational amenorrhoea method alone for the whole interval, with no additional contraception",
    ],
    correctAnswer: "Combined oral contraceptive pills during the interval, because fertility returns promptly when the method is stopped",
    explanation: "Planned spacing with a desired pregnancy shortly afterwards calls for a reversible, user-dependent method such as combined oral contraceptives, condoms, or a progestin-only pill, after which fertility returns without delay. Permanent sterilisation is irreversible and unsuitable for a couple who want children. A CuT 380A provides continuous protection for several years (up to about 10 years), far exceeding the desired interval.",
    difficulty: "medium",
    marks: 1,
    needsCheck: true, // CuT 380A duration and choice of spacing method vary by programme
  },

  // 17 — Communicable disease control (medium)
  {
    slug: "commed-chain-of-infection-cholera",
    concept: "communicable-disease-control",
    format: "sba",
    stem: "Which intervention most directly breaks the chain of infection during a cholera epidemic?",
    options: [
      "Safe drinking water, excreta disposal and handwashing — interrupting faecal–oral transmission",
      "Isolating cases and contacts for the incubation period to stop person-to-person spread",
      "Vaccinating only elderly people, since younger people are naturally immune",
      "Eliminating animal reservoirs of Vibrio cholerae from the community",
    ],
    correctAnswer: "Safe drinking water, excreta disposal and handwashing — interrupting faecal–oral transmission",
    explanation: "Cholera spreads almost entirely by the faecal–oral route through water and food contaminated with Vibrio cholerae, so safe water, sanitation and hygiene interrupt the transmission link most directly. Isolation has limited effect because the incubation period is short (hours to five days) and transmission is water-mediated rather than by close contact. Oral cholera vaccine is offered to all age groups during outbreaks, and V. cholerae persists in aquatic environmental reservoirs rather than in an animal host.",
    difficulty: "medium",
    marks: 1,
  },

  // 18 — Non-communicable disease (medium)
  {
    slug: "commed-ncd-shared-risk-tobacco",
    concept: "non-communicable-disease",
    format: "sba",
    stem: "Which behavioural risk factor is shared by the four major non-communicable disease groups: cardiovascular disease, chronic respiratory disease, cancer and type 2 diabetes?",
    options: [
      "Tobacco use — a shared modifiable risk factor addressed by common primary-prevention measures",
      "Physical inactivity, which affects diabetes alone among the four groups",
      "Ageing, which is the most important modifiable risk factor for the four diseases",
      "Low household income, which directly causes chronic lung disease",
    ],
    correctAnswer: "Tobacco use — a shared modifiable risk factor addressed by common primary-prevention measures",
    explanation: "The WHO framework for non-communicable diseases identifies a small set of shared modifiable risks — tobacco, harmful alcohol use, unhealthy diet and physical inactivity — that drive cardiovascular disease, chronic respiratory disease, cancers and type 2 diabetes, which is why integrated 'best-buy' interventions target them together. Tobacco alone causes cardiovascular disease, COPD and lung cancer and also raises type 2 diabetes risk. Physical inactivity contributes across all four groups, while ageing and socioeconomic conditions are non-modifiable drivers rather than direct risk factors.",
    difficulty: "medium",
    marks: 1,
  },

  // 19 — National health programmes (easy)
  {
    slug: "commed-ntep-dots-strategy",
    concept: "national-health-programs",
    format: "sba",
    stem: "Which strategic component is the core of India's national tuberculosis control programme (RNTCP / National Tuberculosis Elimination Programme)?",
    options: [
      "DOTS — directly observed treatment, short-course, with quality diagnosis, assured drug supply and reporting through Nikshay",
      "Isoniazid chemoprophylaxis for all adults irrespective of risk",
      "BCG vaccination of all infants as the sole control strategy",
      "Environmental ventilation of households as the primary intervention",
    ],
    correctAnswer: "DOTS — directly observed treatment, short-course, with quality diagnosis, assured drug supply and reporting through Nikshay",
    explanation: "India's tuberculosis programme is built on the DOTS strategy: political commitment, quality-assured sputum microscopy diagnosis, standardised short-course regimens with assured drug supply, direct observation of treatment, and systematic recording and reporting through the Nikshay platform. BCG immunisation protects children from severe forms of tuberculosis and preventive therapy is targeted to selected contacts and high-risk groups, but neither substitutes for case detection and directly observed treatment.",
    difficulty: "easy",
    marks: 1,
  },

  // 20 — Occupational health (medium)
  {
    slug: "commed-silicosis-stone-crusher",
    concept: "occupational-health",
    format: "sba",
    stem: "A 46-year-old stone-crusher has progressive breathlessness, and chest radiography shows fine reticulonodular opacities predominantly in the upper zones with eggshell calcification of hilar lymph nodes. Which occupational diagnosis is most likely?",
    options: [
      "Silicosis from inhaled crystalline silica dust, which predisposes strongly to tuberculosis",
      "Byssinosis from cotton dust exposure in textile workers",
      "Asbestosis from amphibole asbestos exposure in construction",
      "Berylliosis from beryllium exposure in electronics manufacturing",
    ],
    correctAnswer: "Silicosis from inhaled crystalline silica dust, which predisposes strongly to tuberculosis",
    explanation: "Inhaled crystalline silica in stone crushing and mining causes silicosis, a nodular fibrosis concentrated in the upper lobes, often with eggshell calcification of hilar nodes, and silicosis markedly increases the risk of tuberculosis (silicotuberculosis). Byssinosis affects cotton textile workers and causes Monday-morning fever, asbestosis produces lower-zone fibrosis with pleural plaques and mesothelioma risk, and chronic beryllium disease produces non-caseating granulomas.",
    difficulty: "medium",
    marks: 1,
  },

  // 21 — Health administration and management (medium)
  {
    slug: "commed-phc-population-norm",
    concept: "health-administration-management",
    format: "sba",
    stem: "Under India's primary health care norms, what population does one Primary Health Centre (PHC) serve in the plains, and what does it cover in hilly, tribal and difficult areas?",
    options: [
      "About 30,000 in the plains and 20,000 in hilly, tribal and difficult areas",
      "About 20,000 in the plains and 10,000 in hilly and tribal areas",
      "About 50,000 in the plains and 50,000 in hilly and tribal areas",
      "About 100,000 in the plains and 40,000 in hilly and tribal areas",
    ],
    correctAnswer: "About 30,000 in the plains and 20,000 in hilly, tribal and difficult areas",
    explanation: "India's rural health system is tiered by population norms: a sub-centre covers about 5,000 people (3,000 in difficult terrain), a PHC about 30,000 in the plains or 20,000 in hilly, tribal and difficult areas, and a community health centre about 120,000 or 80,000 as the first referral unit. These norms determine staffing, infrastructure and catchment planning for peripheral services, and they widen for terrain-difficult areas where travel distances are greater.",
    difficulty: "medium",
    marks: 1,
    needsCheck: true, // population norms vary slightly between national plan revisions
  },

  // 22 — Health economics (hard)
  {
    slug: "commed-daly-burden-measure",
    concept: "health-economics-geriatrics",
    format: "sba",
    stem: "A burden-of-disease study ranks conditions by DALYs per 100,000 population. Which definition correctly describes this measure?",
    options: [
      "Years of life lost from premature mortality plus years lived with disability — DALY = YLL + YLD, one DALY being one lost year of healthy life",
      "Survival weighted by health-state quality — QALY, used to rank cost-effectiveness of interventions",
      "Expected years a newborn will live in full health — HALE, a summary of overall population health",
      "Ratio of disease frequency in exposed versus unexposed groups — relative risk",
    ],
    correctAnswer: "Years of life lost from premature mortality plus years lived with disability — DALY = YLL + YLD, one DALY being one lost year of healthy life",
    explanation: "The DALY adds years of life lost to premature death to years lived with disability of given severity, quantifying lost healthy life; larger DALY totals indicate greater burden and guide priority setting. Quality-adjusted life years weight survival by health-state utility and are used in economic evaluation where more QALYs are better. Health-adjusted life expectancy measures expected years lived in full health, and relative risk is an epidemiological measure of association, not a burden metric.",
    difficulty: "hard",
    marks: 1,
  },

  // 23 — Rural posting and field project (easy)
  {
    slug: "commed-community-diagnosis-rural",
    concept: "rural-posting-field-project",
    format: "sba",
    stem: "During a rural posting, a student surveys a defined community to identify, quantify and prioritise its health problems as the first step in planning services. What is this process called?",
    options: [
      "Community diagnosis — applying epidemiological methods to a population to prioritise health problems and their determinants",
      "Case finding — detecting individual patients with disease so they can be treated",
      "Contact tracing — identifying exposed contacts for follow-up",
      "Randomised allocation — assigning individuals to intervention or control groups",
    ],
    correctAnswer: "Community diagnosis — applying epidemiological methods to a population to prioritise health problems and their determinants",
    explanation: "Community diagnosis surveys a defined population to describe its health problems, their determinants and available resources, providing the evidence base for planning, implementing and evaluating rural health services. Case finding and contact tracing are individual-level activities aimed at treating or following up specific people, and randomisation is a method of allocating participants within trials, not of characterising a community's health.",
    difficulty: "easy",
    marks: 1,
  },
];

async function seedAssessmentCommunityMedicine() {
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

  console.log(`✓ Community Medicine assessment items: ${count} items (marks 1, needs-human-review)`);
}

// CLI usage: npx ts-node prisma/seed-assessment-community-medicine.ts
if (process.argv[1] && process.argv[1].includes("seed-assessment-community-medicine")) {
  seedAssessmentCommunityMedicine()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}

export { seedAssessmentCommunityMedicine, ITEMS as COMMUNITY_MEDICINE_ITEMS };
