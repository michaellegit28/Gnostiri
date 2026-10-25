import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Assessment content — Obstetrics & Gynaecology (OBGY 302).
 *
 * 20 original SBA items deepening the OBGY 302 bank from 6 to 26, tagged to
 * the existing ConceptNodes (see prisma/seed-university.ts). Covers the
 * obstetric core (maternal physiology, prenatal diagnosis, hypertensive
 * disorders, GDM, preterm labour/PROM, labour mechanism and monitoring,
 * malpresentation, assisted delivery, obstetric haemorrhage, caesarean
 * birth, puerperium) plus the gynaecological core (abnormal uterine
 * bleeding, fibroids, prolapse/incontinence, cervical screening,
 * endometrial/ovarian cancer).
 *
 * Idempotent: upserts on the item slug; safe to re-run. orderIndex starts at
 * 6 so the six pre-existing items (0-5) keep their slots.
 *
 * Governance: every item ships reviewStatus "needs-human-review" — the
 * 2026-10-20 repair established that production rows must never sit at
 * "draft" (42 draft rows drifted live before). needsCheck flags the numeric
 * or distractor reasoning a clinician should double-check.
 */

const COURSE_SLUG = "obstetrics-gynaecology";

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
  // 1 — Maternal physiology in pregnancy (easy)
  {
    slug: "obg302-plasma-volume-expansion",
    concept: "maternal-physiology",
    format: "sba",
    stem: "A primigravida at 28 weeks has a haemoglobin of 10.8 g/dL on routine booking bloods. Which statement correctly describes the normal cardiovascular and haematological adaptation of pregnancy?",
    options: [
      "Plasma volume expands by about 40-50% while red cell mass rises by only 20-30%, so a mild dilutional (physiological) anaemia is expected",
      "Cardiac output falls by about a third as the gravid uterus enlarges, explaining the drop in haemoglobin",
      "Systemic vascular resistance rises steadily through the second and third trimesters",
      "Minute ventilation falls with a compensated respiratory acidosis caused by the diaphragm being pushed up",
    ],
    correctAnswer: "Plasma volume expands by about 40-50% while red cell mass rises by only 20-30%, so a mild dilutional (physiological) anaemia is expected",
    explanation: "Oestrogen and progesterone drive a 40-50% expansion of plasma volume against a 20-30% rise in red cell mass, so haemoglobin normally falls to around 11-11.5 g/dL at its nadir near 32-34 weeks — this dilutional physiological anaemia is not iron deficiency. Cardiac output rises 30-50% (stroke volume plus heart rate), systemic vascular resistance falls because of vasodilatation and the low-resistance placental bed, and progesterone increases minute ventilation producing a compensated respiratory alkalosis. True iron deficiency is diagnosed with ferritin or transferrin indices, not by the normal dilutional fall.",
    difficulty: "easy",
    marks: 1,
    needsCheck: false, // plasma volume 40-50%, RBC mass 20-30%, physiological anaemia nadir ~32-34 weeks
  },

  // 2 — Multiple pregnancy and antenatal care (medium)
  {
    slug: "obg302-monochorionic-twin-surveillance",
    concept: "antenatal-care",
    format: "sba",
    stem: "A 34-year-old at 13 weeks is scanned and found to have a monochorionic diamniotic twin pregnancy. Which statement about the antenatal management of this pregnancy is most accurate?",
    options: [
      "Vascular anastomoses on the shared placenta create a risk of twin-to-twin transfusion syndrome and growth discordance, so serial ultrasound surveillance of growth and amniotic fluid is required from the second trimester",
      "Monochorionicity removes the need for growth scans because identical twins are genetically matched and therefore grow identically",
      "Once chorionicity is confirmed by placental examination after birth, antenatal monitoring is equivalent to that of a singleton pregnancy",
      "The only risk of a monochorionic pregnancy is preterm labour, so routine low-risk antenatal care and a single anomaly scan are sufficient",
    ],
    correctAnswer: "Vascular anastomoses on the shared placenta create a risk of twin-to-twin transfusion syndrome and growth discordance, so serial ultrasound surveillance of growth and amniotic fluid is required from the second trimester",
    explanation: "Monochorionic placentae almost always contain vascular anastomoses, which permits unbalanced inter-twin transfusion: twin-to-twin transfusion syndrome, selective fetal growth restriction, and twin anaemia-polycythaemia sequence are specific monochorionic complications. They therefore need fortnightly-to-monthly growth and Doppler surveillance from around 16 weeks, rather than the two scans typical of dichorionic twins, which still merit closer growth monitoring than a singleton because of the higher risk of pre-eclampsia and growth restriction. Genetic identity limits discordance for chromosome problems but does not equalise growth, placenta-sharing, or amniotic fluid.",
    difficulty: "medium",
    marks: 1,
    needsCheck: true, // surveillance interval varies by guideline (fortnightly vs monthly) — clinician to confirm local policy
  },

  // 3 — Prenatal diagnosis (medium)
  {
    slug: "obg302-combined-trisomy-screening",
    concept: "prenatal-diagnosis",
    format: "sba",
    stem: "A 36-year-old woman at 11 weeks of gestation asks about screening for trisomy 21 and 18. Which statement best describes how prenatal screening and diagnosis work together?",
    options: [
      "The combined test integrates nuchal translucency, maternal serum PAPP-A and free beta-hCG with maternal age to give a risk estimate, and a high-risk result is taken forward to invasive diagnostic testing such as chorionic villus sampling or amniocentesis",
      "Nuchal translucency alone is diagnostic, so a normal measurement ends all further trisomy assessment",
      "Cell-free fetal DNA testing is a diagnostic test, so a positive result needs no confirmatory invasive procedure",
      "No screening method exists before 15 weeks, so nothing can be offered at this booking visit",
    ],
    correctAnswer: "The combined test integrates nuchal translucency, maternal serum PAPP-A and free beta-hCG with maternal age to give a risk estimate, and a high-risk result is taken forward to invasive diagnostic testing such as chorionic villus sampling or amniocentesis",
    explanation: "Every antenatal test gives a risk, not a diagnosis: the combined first-trimester test achieves high detection rates by combining crown-rump-length-dated nuchal translucency with PAPP-A and free beta-hCG and maternal age. A screen-positive result is reported as a raised chance of trisomy 21 or 18 and is only resolved by karyotyping an invasive sample — chorionic villus sampling from about 11 weeks or amniocentesis from about 15 weeks, both carrying roughly a 0.5-1% procedure-related miscarriage risk. Cell-free fetal DNA has very high sensitivity but a lower positive predictive value in a low-prevalence screening population, so positive findings are still offered invasive confirmation.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // invasive procedure risk ~0.5-1%; cfDNA confirmed by invasive testing
  },

  // 4 — Hypertension in pregnancy and eclampsia (hard)
  {
    slug: "obg302-magnesium-sulfate-eclampsia",
    concept: "pre-eclampsia-eclampsia",
    format: "sba",
    stem: "A nulliparous woman at 34 weeks, known to have severe pre-eclampsia on antihypertensive treatment, is witnessed having a generalised tonic-clonic seizure. Which single intervention is most immediately appropriate?",
    options: [
      "A loading dose of intravenous magnesium sulfate, with maintenance infusion and monitoring of reflexes, respirations and urine output",
      "Intravenous lorazepam as the first-line anticonvulsant in every pregnancy seizure",
      "Emergency caesarean birth under general anaesthesia before any anticonvulsant is given",
      "Immediate delivery of the placenta is curative, so anticonvulsants are not otherwise required",
    ],
    correctAnswer: "A loading dose of intravenous magnesium sulfate, with maintenance infusion and monitoring of reflexes, respirations and urine output",
    explanation: "Eclampsia is the occurrence of generalised tonic-clonic seizures in a woman with pre-eclampsia in the absence of another cause, and magnesium sulfate is the anticonvulsant of choice — the Magpie trial showed it halves the rate of further seizure and reduces maternal death compared with diazepam or phenytoin. It is also given prophylactically in severe pre-eclampsia, typically continued for 24 hours after delivery or after the last seizure, with hourly observation of patellar reflexes, respiratory rate and urine output because magnesium is renally cleared and toxic levels produce respiratory and cardiac depression. Delivery of the fetus and placenta is the definitive treatment for the underlying disease, but the seizure and airway are secured first and blood pressure is controlled with labetalol or hydralazine.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false, // Magpie trial; MgSO4 continues 24h post-partum/post-seizure
  },

  // 5 — Gestational diabetes (medium)
  {
    slug: "obg302-gestational-diabetes-management",
    concept: "medical-disorders-pregnancy",
    format: "sba",
    stem: "A 29-year-old at 26 weeks has an oral glucose tolerance test with a fasting glucose of 5.9 mmol/L and a 2-hour value of 9.2 mmol/L. The scan shows normal fetal growth. Which management plan is most appropriate?",
    options: [
      "Dietetic and lifestyle modification with self-monitoring of capillary glucose, escalating to metformin or insulin if targets are not achieved, and planning for birth between 37 and 40 weeks",
      "Commence insulin immediately because drug therapy is mandatory from diagnosis in gestational diabetes",
      "Reassure and repeat the oral glucose tolerance test at 36 weeks, as diet alone always controls gestational diabetes",
      "Withhold all treatment until the postpartum period, because fetal risk is negligible before birth",
    ],
    correctAnswer: "Dietetic and lifestyle modification with self-monitoring of capillary glucose, escalating to metformin or insulin if targets are not achieved, and planning for birth between 37 and 40 weeks",
    explanation: "Gestational diabetes is diagnosed on the fasting or 2-hour oral glucose tolerance thresholds and managed in a stepwise way: dietary advice, moderate activity and home glucose monitoring against targets (commonly fasting under 5.3 mmol/L and 1-2 hour values under 7.4/6.4 mmol/L), then metformin or insulin if targets or fetal growth are not controlled. Insulin is required for a minority — typically where hyperglycaemia is marked or the fetal abdomen is large — but diet alone fails often enough that surveillance is mandatory. Untreated gestational diabetes drives fetal hyperinsulinaemia, macrosomia, shoulder dystocia, neonatal hypoglycaemia and caesarean birth, and it resolves after delivery, when a fasting glucose at 6-13 weeks and annual follow-up are indicated.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // classic NICE/O'Sullivan targets; birth planned 37-40 weeks if well controlled
  },

  // 6 — Nutrition, medication and lifestyle in pregnancy (easy)
  {
    slug: "obg302-folic-acid-and-foods",
    concept: "pregnancy-nutrition-medication",
    format: "sba",
    stem: "A woman planning pregnancy seeks advice on optimising nutrition and medicines. Which recommendation is correct?",
    options: [
      "Take folic acid 400 micrograms daily before conception and until 12 weeks, avoid vitamin A supplements and liver, and avoid unpasteurised cheeses and pâté because of listeriosis and toxoplasmosis risk",
      "Begin folic acid only once the pregnancy test is positive at 5-6 weeks, by which time the neural tube has formed",
      "Vitamin A supplements are recommended in all pregnant women because they are safe at any dose",
      "Alcohol in moderation, including wine, is considered safe throughout pregnancy and no lower limit is advised",
    ],
    correctAnswer: "Take folic acid 400 micrograms daily before conception and until 12 weeks, avoid vitamin A supplements and liver, and avoid unpasteurised cheeses and pâté because of listeriosis and toxoplasmosis risk",
    explanation: "Folic acid reduces the risk of neural tube defects only if taken periconceptionally — ideally from at least 1-3 months before conception until the end of the embryonic period at 12 weeks — and the dose is raised to 5 mg for women with a previous neural tube defect, BMI 30 or above, diabetes, or on antiepileptics. Retinol is teratogenic, so high-dose vitamin A supplements and liver are avoided, while unpasteurised dairy, soft mould-ripened cheeses, pâté and undercooked meat carry listeriosis and toxoplasmosis risk. No safe threshold for alcohol has been established, so the safest advice is abstinence, and clinically important medicines are reviewed for safety rather than stopped automatically.",
    difficulty: "easy",
    marks: 1,
    needsCheck: false, // 400 mcg routine, 5 mg high risk; retinol teratogenic; no safe alcohol level
  },

  // 7 — Preterm labour and preterm prelabour rupture of membranes (hard)
  {
    slug: "obg302-pprom-management",
    concept: "preterm-labour",
    format: "sba",
    stem: "A woman at 30 weeks and 4 days has confirmed rupture of membranes with clear draining liquor, no contractions, and a cephalic presentation. Which intervention is most appropriate to improve neonatal outcome?",
    options: [
      "Antenatal corticosteroids (betamethasone or dexamethasone) to accelerate fetal lung maturation, with oral erythromycin for 10 days and transfer to a unit with neonatal facilities",
      "Oral nifedipine tocolysis for 48 hours to prolong pregnancy in every case of membrane rupture",
      "Amoxicillin as the prophylactic antibiotic of choice for 10 days, which is the standard regimen",
      "Delay steroids beyond 28 weeks because fetal lung surfactant is already mature enough for survival",
    ],
    correctAnswer: "Antenatal corticosteroids (betamethasone or dexamethasone) to accelerate fetal lung maturation, with oral erythromycin for 10 days and transfer to a unit with neonatal facilities",
    explanation: "Preterm prelabour rupture of membranes is treated expectantly before 34 weeks: a single antenatal course of betamethasone or dexamethasone reduces respiratory distress syndrome, intraventricular haemorrhage and neonatal death, so steroids avoid delay even at 30 weeks. Erythromycin is the prophylactic antibiotic of choice because amoxicillin and co-amoxiclav increase the risk of neonatal necrotising enterocolitis; delivery is expedited for infection, abruption or fetal compromise. Tocolysis is generally withheld after membrane rupture because delaying birth offers no clear benefit and may prolong exposure to intrauterine infection.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false, // steroids <34 weeks; erythromycin 250mg 10 days; tocolysis not indicated in PPROM
  },

  // 8 — Mechanism of normal labour (medium)
  {
    slug: "obg302-cardinal-movements",
    concept: "mechanism-of-labour",
    format: "sba",
    stem: "Which sequence correctly describes the cardinal movements of the fetus during a normal cephalic vaginal birth in the occipito-anterior position?",
    options: [
      "Engagement, descent, flexion, internal rotation, extension, restitution, external rotation and birth of the shoulders",
      "Engagement, extension of the head, internal rotation, descent, flexion, then restitution",
      "Descent, extension of the head, flexion, restitution, external rotation",
      "Engagement, internal rotation, descent, flexion, extension with no restitution of the head",
    ],
    correctAnswer: "Engagement, descent, flexion, internal rotation, extension, restitution, external rotation and birth of the shoulders",
    explanation: "In an occipito-anterior vertex the head enters the brim in an attitude of flexion, descends through the pelvis, and flexes further so that the suboccipitofrontal diameter presents. At the pelvic floor the occiput rotates 45 degrees forward to lie beneath the symphysis (internal rotation) into the occipito-anterior position, then the head extends around the pubic arch and is delivered face to buttocks. Restitution — the head turning back a quarter turn to undo the twist of the neck — precedes external rotation of the head as the shoulders rotate into the anteroposterior diameter, after which the anterior and posterior shoulders are delivered.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // OA sequence: flexion at the brim, internal rotation at the pelvic floor
  },

  // 9 — Labour, delivery and the puerperium (easy)
  {
    slug: "obg302-stages-of-labour",
    concept: "normal-labour-puerperium",
    format: "sba",
    stem: "Which statement correctly defines the stages of labour and the third stage?",
    options: [
      "The first stage runs from the onset of painful regular contractions with cervical change to full dilatation (10 cm); the second stage runs from full dilatation to birth of the baby; the third stage runs from birth of the baby to expulsion of the placenta",
      "The first stage runs from full dilatation to delivery of the placenta, encompassing all the pushing phase",
      "The second stage begins once the cervix is 3 cm dilated, so early pushing may start before full dilatation",
      "The third stage continues until uterine involution is complete at around six weeks after birth",
    ],
    correctAnswer: "The first stage runs from the onset of painful regular contractions with cervical change to full dilatation (10 cm); the second stage runs from full dilatation to birth of the baby; the third stage runs from birth of the baby to expulsion of the placenta",
    explanation: "Labour is divided into three stages by clinical events, not by maternal sensation: the first stage is from established labour to full cervical dilatation and is subdivided into a latent phase (slow painful cervical change to around 6 cm) and an active phase of regular dilatation; the second stage is from full dilatation to delivery of the infant, conventionally passive and active phases; the third stage is from delivery of the baby to delivery of the placenta, managed actively with oxytocin and cord traction to reduce postpartum haemorrhage, and diagnosed as prolonged beyond 30-60 minutes. Involution of the uterus to its pre-pregnancy size takes about 6 weeks but is a puerperal process, not the third stage of labour.",
    difficulty: "easy",
    marks: 1,
    needsCheck: false, // latent phase to ~6 cm; active management of third stage with oxytocin
  },

  // 10 — Monitoring labour and fetal distress (hard)
  {
    slug: "obg302-pathological-ctg",
    concept: "monitoring-labour",
    format: "sba",
    stem: "A labouring woman at term has a cardiotocograph with a baseline of 155 bpm, variability reduced to below 5 bpm for over 45 minutes, and recurring late decelerations after contractions. What is the correct classification and immediate response?",
    options: [
      "A pathological cardiotocograph — perform intrauterine resuscitation (maternal position change, stop oxytocin, intravenous fluids), then fetal blood sampling to quantify the acidosis and expedite the birth if needed",
      "A reassuring trace requiring no further action other than intermittent auscultation",
      "A suspicious trace that only calls for continued intermittent auscultation at 15-minute intervals",
      "A sinusoidal pattern caused by fetal anaemia, for which the treatment is a further course of antenatal steroids",
    ],
    correctAnswer: "A pathological cardiotocograph — perform intrauterine resuscitation (maternal position change, stop oxytocin, intravenous fluids), then fetal blood sampling to quantify the acidosis and expedite the birth if needed",
    explanation: "This trace has three red features — baseline over 160 or under 100 range, reduced variability for over 50 minutes, and featured recurrent late decelerations — which classifies it as pathological because uterine contractions are interrupting placental perfusion and reducing oxygen transfer. The first response is always intrauterine resuscitation: reposition off the aortocaval compression, stop oxytocin, correct hypotension with crystalloid, and consider a tocolytic; then fetal blood sampling (pH under 7.25 is equivocal, under 7.20 indicates urgency) to decide on operative delivery. Continuous electronic monitoring is the standard whenever high-risk features exist, and intermittent auscultation is a plausible course only in low-risk labour.",
    difficulty: "hard",
    marks: 1,
    needsCheck: true, // CTG classification colour bands and FBS cut-offs vary by NICE version — clinician to confirm
  },

  // 11 — Breech, malpresentation and abnormal labour (medium)
  {
    slug: "obg302-breech-external-cephalic-version",
    concept: "malpresentation-abnormal-labour",
    format: "sba",
    stem: "At 36 weeks, a woman is confirmed to have an otherwise uncomplicated singleton breech pregnancy with a normal growth scan and no contraindication to vaginal birth. What is the next most appropriate step?",
    options: [
      "Offer external cephalic version with consent, with awareness of the success rate and the option of planned caesarean birth or an experienced operator for a vaginal breech birth if it fails or is declined",
      "Proceed immediately to category-1 caesarean birth because all breech pregnancies must be delivered abdominally at 36 weeks",
      "Attempt internal version during the second stage of labour as the first-line intervention",
      "Discharge to routine care with no intervention, because breech babies self-correct before term in almost every case",
    ],
    correctAnswer: "Offer external cephalic version with consent, with awareness of the success rate and the option of planned caesarean birth or an experienced operator for a vaginal breech birth if it fails or is declined",
    explanation: "External cephalic version is offered to women with an uncomplicated singleton breech from around 36+0 to 37+0 weeks, converting about half of cases to cephalic and thereby avoiding caesarean-related morbidity, with fetal heart rate assessment afterwards and same-day caesarean readiness. It is avoided with placenta praevia, abruption, severe oligohydramnios, previous uterine surgery of concern, or where vaginal birth is contraindicated. Where breech persists, planned caesarean birth is usually recommended because the Term Breech Trial showed lower perinatal mortality and serious neonatal morbidity; an experienced accoucheur may offer selected vaginal breech birth in a service with the right protocols.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // ECV offered ~36-37 weeks; ~50% success; planned CS usual recommendation
  },

  // 12 — Induction, augmentation and assisted delivery (hard)
  {
    slug: "obg302-ventouse-indications",
    concept: "induction-assisted-delivery",
    format: "sba",
    stem: "A primigravida has had an epidural and pushed for 2 hours in the second stage. The fetus remains at spines+2 in an occipitotransverse position with no descent despite adequate contractions; the cardiotocograph is pathological. Her cervix is fully dilated and the pelvis is adequate. Which option is most appropriate?",
    options: [
      "Instrumental vaginal birth in theatre, with a ventouse or outlet forceps by an experienced operator, the head being at or below the ischial spines, and a neonatal team present",
      "Continue pushing for a further hour, because instrumental delivery is only permissible once the head is visible on the perineum",
      "Continue inpatient observation only, because a cardiotocograph abnormality alone is never a reason for assisted birth",
      "A mid-cavity rotational forceps performed by the most junior available member of the labour team",
    ],
    correctAnswer: "Instrumental vaginal birth in theatre, with a ventouse or outlet forceps by an experienced operator, the head being at or below the ischial spines, and a neonatal team present",
    explanation: "This is an abnormal second stage — prolonged active pushing without descent, plus a pathological trace — so expedited birth is indicated while the cervix is fully dilated, membranes ruptured, head engaged at or below the ischial spines, bladder empty, and the pelvis clinically adequate. Operative vaginal birth belongs in theatre with anaesthetic and neonatal support so that failed ventouse converts to caesarean without delay; rotational (mid-cavity) deliveries demand a senior operator because of the higher risk of deep tears and fetal trauma. At spines+2 with no descent, a ventouse is the usual instrument; forceps is also suitable at this station but carries distinct maternal risks, and either is contraindicated before 34 weeks gestation.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false, // operational criteria; ventouse/forceps contraindicated <34 weeks gestation
  },

  // 13 — Obstetric haemorrhage (hard)
  {
    slug: "obg302-postpartum-haemorrhage-4ts",
    concept: "obstetric-haemorrhage",
    format: "sba",
    stem: "Immediately after a vaginal birth a woman loses approximately 1200 mL of blood. The uterus feels boggy and non-contractile on abdominal examination despite the placenta delivered intact. Which is the most appropriate sequence of management?",
    options: [
      "Call for help, rub the uterus to stimulate contraction, empty the bladder, give uterotonics (oxytocin, ergometrine, carboprost or misoprostol), administer tranexamic acid, and escalate to intrauterine balloon tamponade or surgery if bleeding persists",
      "Wait for fully crossmatched red cells before any uterotonic is administered, since haemodynamic stability currently permits delay",
      "Proceed straight to caesarean section as the first-line step because the uterus has already delivered",
      "Give intramuscular ergometrine as the sole uterotonic and continue abdominal massage for an hour before reviewing",
    ],
    correctAnswer: "Call for help, rub the uterus to stimulate contraction, empty the bladder, give uterotonics (oxytocin, ergometrine, carboprost or misoprostol), administer tranexamic acid, and escalate to intrauterine balloon tamponade or surgery if bleeding persists",
    explanation: "This is primary postpartum haemorrhage — blood loss of 500 mL or more within 24 hours — and the boggy uterus makes atony the cause, the commonest of the four Ts (Tone, Tissue, Trauma, Thrombin). Management is simultaneous resuscitation and stepwise haemostasis: shout for help, uterine massage and bimanual compression, empty the bladder, oxytocin infusion with ergometrine, carboprost or misoprostol as add-ons, and tranexamic acid given early because the WOMAN trial showed reduced death from haemorrhage when given within 3 hours of birth. Continued atony escalates to intrauterine balloon tamponade, then uterine compression sutures, internal iliac artery ligation or hysterectomy, and blood products must not be withheld while waiting for crossmatch.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false, // PPH ≥500 mL in 24 h; WOMAN trial TXA within 3 h
  },

  // 14 — Caesarean section (medium)
  {
    slug: "obg302-vbac-counselling",
    concept: "caesarean-section",
    format: "sba",
    stem: "A woman who has had one previous emergency caesarean for a non-recurring indication through a low transverse incision asks about her choice of birth this time. Her pregnancy is uncomplicated, the fetus is cephalic and there is no scar tenderness or other contraindication. Which statement best reflects the counselling she should receive?",
    options: [
      "A trial of labour after one previous low transverse caesarean is a reasonable option: around 70-75% achieve vaginal birth, and the principal maternal risk is uterine scar rupture at roughly 0.5-1%, so continuous electronic fetal monitoring is advised",
      "Vaginal birth after caesarean is prohibited in every circumstance, so a repeat caesarean is automatic regardless of the previous indication",
      "Prostaglandin induction of labour carries no additional risk after one previous caesarean and may be used routinely to start labour",
      "The uterine scar rupture risk at 3-5% makes a trial of labour more dangerous than either repeat caesarean or instrumental vaginal birth",
    ],
    correctAnswer: "A trial of labour after one previous low transverse caesarean is a reasonable option: around 70-75% achieve vaginal birth, and the principal maternal risk is uterine scar rupture at roughly 0.5-1%, so continuous electronic fetal monitoring is advised",
    explanation: "One previous lower-segment transverse caesarean with an inter-delivery interval of over 18 months, a cephalic fetus and no other risk factor supports a planned vaginal birth after caesarean, which succeeds in about 70-75% of women and has substantially lower maternal morbidity than repeat caesarean. Uterine rupture remains the decisive risk — usually quoted at under 1% for one low transverse scar, higher for two or more previous caesareans, a classical or inverted-T incision, or induction — and it can be catastrophic for the fetus, so continuous monitoring and immediate access to theatre are mandatory. Prostaglandin induction increases rupture risk and is used only after explicit counselling, and rupture typically presents with fetal heart rate abnormalities, scar pain, haematuria or haemodynamic collapse.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // VBAC success ~70-75%; rupture risk <1% for one low transverse scar
  },

  // 15 — Puerperium problems (easy)
  {
    slug: "obg302-puerperium-vte-risk",
    concept: "puerperium-problems",
    format: "sba",
    stem: "Which statement about the puerperium and its problems is most accurate?",
    options: [
      "The puerperium is the six weeks after birth during which the uterus involutes, lochia changes from red to serous to white, and venous thromboembolism risk is highest — so risk-assessed prophylaxis is given and any calf pain or breathlessness is treated urgently",
      "Secondary postpartum haemorrhage within the first 24 hours is nearly always caused by retained placental tissue and requires no infection screen",
      "Lochia that is bright red after a week is expected and never indicates infection or retained products",
      "Postnatal venous thromboembolism risk peaks after six weeks, so prophylaxis can safely be deferred until the postpartum check",
    ],
    correctAnswer: "The puerperium is the six weeks after birth during which the uterus involutes, lochia changes from red to serous to white, and venous thromboembolism risk is highest — so risk-assessed prophylaxis is given and any calf pain or breathlessness is treated urgently",
    explanation: "The puerperium extends for six weeks: the uterus involutes to a non-pregnant size with the fundus descending about a fingerbreadth per day, and lochia progresses from lochia rubra to serosa to alba; secondary postpartum haemorrhage (defined after the first 24 hours up to 12 weeks) is usually caused by infection, retained products or subinvolution and needs ultrasound plus appropriate antibiotics. Pregnancy and delivery produce a hypercoagulable state with stasis and vessel trauma — Virchow's triad — so postnatal VTE risk is greatest in the first six weeks and risk assessment guides low-molecular-weight heparin therapy for at least seven days for those with risk factors. Fever with uterine tenderness and offensive lochia suggests endometritis, which is treated with broad-spectrum antibiotics rather than by observation.",
    difficulty: "easy",
    marks: 1,
    needsCheck: false, // secondary PPH 24 h-12 weeks; LMWH ≥7 days postnatal per risk factors
  },

  // 16 — Abnormal uterine bleeding (medium)
  {
    slug: "obg302-palm-coein-aub",
    concept: "abnormal-uterine-bleeding",
    format: "sba",
    stem: "A 41-year-old attends with intermenstrual and heavy menstrual bleeding. Using the FIGO PALM-COEIN classification, which statement about the causes of abnormal uterine bleeding is correct?",
    options: [
      "The PALM group covers structural causes — Polyp, Adenomyosis, Leiomyoma, Malignancy and hyperplasia — while COEIN covers non-structural causes: Coagulopathy, Ovulatory dysfunction, Endometrial, Iatrogenic and Not otherwise classified",
      "All abnormal uterine bleeding arises from structural pathology, so endometrial sampling is unnecessary if ultrasound is normal",
      "Coagulopathy (Von Willebrand disease) is a structural cause requiring endometrial ablation",
      "Heavy menstrual bleeding in adolescence is most commonly caused by large submucosal fibroids, which are best treated by hysterectomy",
    ],
    correctAnswer: "The PALM group covers structural causes — Polyp, Adenomyosis, Leiomyoma, Malignancy and hyperplasia — while COEIN covers non-structural causes: Coagulopathy, Ovulatory dysfunction, Endometrial, Iatrogenic and Not otherwise classified",
    explanation: "PALM-COEIN was introduced precisely because many women with heavy menstrual bleeding have no structural lesion: PALM entities are visible on imaging or histology, while COEIN causes are systemic, endocrine, endometrial or drug-related (for example anticoagulants, copper intrauterine devices or progestin-only methods). The classification directs investigation — a transvaginal ultrasound first, endometrial biopsy where there is persistent intermenstrual bleeding, risk factors for endometrial cancer, or in women over about 45 with heavier or irregular bleeding. Adolescents with heavy bleeding since menarche warrant a coagulopathy screen, because von Willebrand disease accounts for a significant share of that group.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // PALM-COEIN structure; coagulopathy screened for heavy bleeding since menarche
  },

  // 17 — Benign uterine disease: fibroids (medium)
  {
    slug: "obg302-uterine-leiomyoma",
    concept: "benign-uterine-disease",
    format: "sba",
    stem: "A 38-year-old with heavy menstrual bleeding and pelvic pressure has pelvic ultrasound showing a 7 cm intramural fibroid and a normal-shaped endometrial cavity. Which statement about uterine leiomyomas is most accurate?",
    options: [
      "They are benign, oestrogen-responsive smooth-muscle tumours that regress after menopause; management ranges from tranexamic acid and hormonal suppression to myomectomy, uterine artery embolisation or hysterectomy depending on symptoms, size, location and fertility wishes",
      "Leiomyomas are malignant tumours that require emergency total hysterectomy once they exceed 5 cm in diameter",
      "Leiomyosarcoma is the commonest benign uterine tumour of reproductive life and is diagnosed on ultrasound alone",
      "Fibroids never cause either heavy menstrual bleeding or fertility problems, so imaging is unnecessary unless pain is dominant",
    ],
    correctAnswer: "They are benign, oestrogen-responsive smooth-muscle tumours that regress after menopause; management ranges from tranexamic acid and hormonal suppression to myomectomy, uterine artery embolisation or hysterectomy depending on symptoms, size, location and fertility wishes",
    explanation: "Leiomyomas (fibroids) are monoclonal, steroid-responsive uterine smooth-muscle tumours arising in up to 70% of women, most remain asymptomatic and shrink after menopause as oestrogen falls. They present with heavy menstrual bleeding when submucosal or intracavitary, and with bulk-pressure symptoms (urinary frequency, pelvic pressure, constipation) when large; submucosal and cavity-distorting fibroids also reduce fertility and implantation, and they can complicate pregnancy with red degeneration and malpresentation. Treatment is symptom- and fertility-driven: NSAIDs and tranexamic acid, progestins or levonorgestrel intrauterine systems, GnRH analogues before surgery, and surgical or radiological options including myomectomy, uterine artery embolisation or hysterectomy — with rare leiomyosarcoma needing histology for diagnosis, not serum markers.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // disease biology; symptomatic vs incidental fibroids; fertility-preserving options
  },

  // 18 — Pelvic organ prolapse and incontinence (medium)
  {
    slug: "obg302-stress-incontinence-pfmt",
    concept: "prolapse-incontinence",
    format: "sba",
    stem: "A 48-year-old parous woman complains of leaking urine when she coughs and sneezes, which has been worsening for the last year, with no urgency, frequency or nocturia. Which statement about her condition and its first-line management is correct?",
    options: [
      "This is stress urinary incontinence — involuntary leakage on effort or exertion — and the first-line treatment is a supervised programme of pelvic floor muscle training of at least three months, continuing for at least a year, before considering surgery",
      "This is urge urinary incontinence, best treated initially with an antimuscarinic such as oxybutynin",
      "Overactive bladder is diagnosed only by urodynamics before any conservative treatment is attempted",
      "Every case of urogynaecological symptoms is best resolved definitively by surgery from the outset",
    ],
    correctAnswer: "This is stress urinary incontinence — involuntary leakage on effort or exertion — and the first-line treatment is a supervised programme of pelvic floor muscle training of at least three months, continuing for at least a year, before considering surgery",
    explanation: "The definition of stress urinary incontinence is the complaint of involuntary leakage on effort or exertion or on sneezing or coughing, arising from urethral hypermobility and intrinsic sphincter deficiency; urge or overactive bladder is leakage associated with urgency and frequency and is treated with bladder training and antimuscarinics or beta-3 agonists. NICE recommends a trial of supervised pelvic floor muscle training — commonly three sets of 8-12 contractions held for up to 10 seconds, performed daily for at least three months and maintained — because it is effective and carries no surgical risk, with weight loss, treatment of chronic cough and avoidance of straining. Where it fails, surgical options include the mid-urethral tape, bulking agents or colposuspension, and pessaries support but do not cure prolapse.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // IUGA/ICS definitions; PFMT ≥3 months then continue ≥1 year per NICE
  },

  // 19 — Cervical screening and cancer (medium)
  {
    slug: "obg302-hpv-primary-screening",
    concept: "cervical-screening-cancer",
    format: "sba",
    stem: "Which statement about the cervical screening programme and the disease it prevents is most accurate?",
    options: [
      "Screening tests first for oncogenic human papillomavirus; a positive high-risk HPV result triggers cytology and, where cellular changes are found, colposcopy, because pre-invasive cervical intraepithelial neoplasia arises in the transformation zone and is detectable and treatable before invasion",
      "A positive HPV test alone within the population programme requires immediate hysterectomy",
      "Cervical squamous cell carcinoma usually develops as an invasive tumour with no pre-invasive precursor stage, which is why cytology screening is ineffective",
      "Cytology is unaffected by human papillomavirus status, so the virus has no role in modern screening or colposcopic triage",
    ],
    correctAnswer: "Screening tests first for oncogenic human papillomavirus; a positive high-risk HPV result triggers cytology and, where cellular changes are found, colposcopy, because pre-invasive cervical intraepithelial neoplasia arises in the transformation zone and is detectable and treatable before invasion",
    explanation: "Persistent infection with high-risk HPV types (16 and 18 cause about 70% of cervical cancers) drives squamous cervical carcinogenesis, which passes through a detectable pre-invasive phase — cervical intraepithelial neoplasia 1, 2 and 3 — in the transformation zone where the squamocolumnar junction sits. Primary HPV testing has better sensitivity and a longer screening interval because a negative high-risk HPV result confers substantial reassurance, while HPV-positive women go on to cytology and then colposcopy with directed biopsy, and CIN 2/3 is treated by excision or ablation of the transformation zone. Screening does not prevent endometrial cancer and is targeted to a defined age range, with results interpreted against the woman's screening history.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // HPV 16/18 ≈70% of cervical cancers; high-risk HPV first-line primary screening
  },

  // 20 — Endometrial and ovarian cancer (hard)
  {
    slug: "obg302-endometrial-cancer-risk",
    concept: "endometrial-ovarian-cancer",
    format: "sba",
    stem: "A 63-year-old woman with a BMI of 38, nulliparity and type 2 diabetes presents with postmenopausal bleeding. Which statement about endometrial carcinoma is most accurate?",
    options: [
      "Endometrioid (type 1) carcinoma is the commonest endometrial cancer, typically presents with postmenopausal bleeding, and is driven by chronic unopposed oestrogen from obesity, nulliparity and diabetes; diagnosis is by transvaginal ultrasound endometrial thickness and endometrial sampling, and treatment is primarily surgical",
      "Endometrial carcinoma should not be investigated with ultrasound or biopsy because bleeding after the menopause is always benign",
      "Serous endometrial carcinoma is a low-grade tumour arising in the setting of obesity and treated with progestin therapy alone",
      "Ovarian epithelial cancer characteristically presents with symptoms confined to the pelvis and is therefore diagnosed at an early stage in most patients",
    ],
    correctAnswer: "Endometrioid (type 1) carcinoma is the commonest endometrial cancer, typically presents with postmenopausal bleeding, and is driven by chronic unopposed oestrogen from obesity, nulliparity and diabetes; diagnosis is by transvaginal ultrasound endometrial thickness and endometrial sampling, and treatment is primarily surgical",
    explanation: "Roughly 90% of women with endometrial cancer present with postmenopausal bleeding, which mandates transvaginal ultrasound (an endometrial stripe of 4 mm or less generally excludes significant disease) and pipelle or hysteroscopic biopsy. Type 1 endometrioid adenocarcinoma is an oestrogen-dependent, well-to-moderately differentiated tumour of obese, nulliparous, older patients, and is treated with total hysterectomy, bilateral salpingo-oophorectomy and surgical staging including lymph node assessment when the risk of spread warrants it; stage and grade guide adjuvant radiotherapy or chemotherapy. By contrast, type 2 serous and clear cell tumours arise in atrophic endometrium, are high grade and aggressive, and ovarian epithelial cancers usually present late with abdominal distension, early satiety and peritoneal disease because there is no reliable screening test.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false, // 4 mm endometrial thickness threshold; type 1 oestrogen-driven vs type 2 serous pathology
  },
];

async function seedAssessmentObstetricsGynaecology() {
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

  console.log(`✓ OBGY 302 assessment items: ${count} items (marks 1, needs-human-review)`);
}

// CLI usage: npx ts-node prisma/seed-assessment-obstetrics-gynaecology.ts
if (process.argv[1] && process.argv[1].includes("seed-assessment-obstetrics-gynaecology")) {
  seedAssessmentObstetricsGynaecology()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}

export { seedAssessmentObstetricsGynaecology, ITEMS as OBSTETRICS_GYNAECOLOGY_ITEMS };
