import { prisma, seedMbbsCourse, type LessonSeed, type SbaSeed, type SubjectSeed } from "./spine";

/**
 * OBGY 302 — Obstetrics & Gynaecology.
 *
 * Module 1 ("Foundations of women's health") is authored in full: 6 lessons in
 * the pilot-report format with one SBA item per concept. All clinical content
 * is standard, textbook teaching — the anatomy of the female reproductive
 * tract, the 28-day menstrual cycle with its pituitary and ovarian hormones,
 * puberty and menopause, contraception by method and effectiveness, and the
 * causes and initial investigation of subfertility.
 *
 * Modules 2-5 (antenatal care and the physiology of pregnancy, labour and the
 * puerperium, obstetric complications, gynaecological disorders and oncology)
 * ship as a real concept spine and prerequisite DAG with tracked-placeholder
 * lessons (needsCheck true).
 *
 * Requires prisma/seed-university.ts first (faculty, department, programme).
 */

const COURSE_SLUG = "obstetrics-gynaecology";

const MODULES = [
  { slug: "foundations-womens-health", title: "M1 — Foundations of women's health" },
  { slug: "pregnancy-antenatal-care", title: "M2 — Pregnancy & antenatal care" },
  { slug: "labour-delivery-puerperium", title: "M3 — Labour, delivery & puerperium" },
  { slug: "obstetric-complications", title: "M4 — Obstetric complications" },
  { slug: "gynaecology-oncology", title: "M5 — Gynaecological disorders & oncology" },
];

// ---------------------------------------------------------------------------
// LESSON 1 — Anatomy of the female reproductive tract (fully authored)
// ---------------------------------------------------------------------------
function lesson1() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the structure and position of the uterus, the fallopian tubes and the ovaries; state the blood supply and venous and lymphatic drainage of the pelvic organs; name the supporting ligaments of the uterus and say which structure supports the position; describe the pelvic floor and its role in continence; and relate the pelvic anatomy to the common surgical approach.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "ANAT 101, in particular the abdomen and pelvis module, and PHYS 101 for the endocrine physiology that acts on these organs.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Internal genitalia",
        text: "The uterus, the two fallopian tubes, the two ovaries and the vagina, which lie in the pelvic cavity on a sheet of supporting ligaments and are supplied by the uterine and ovarian arteries.",
      },
      {
        type: "paragraph",
        text: "The central point of the anatomy is that the female pelvis is built around a function, not a shape: a cavity wide enough and a floor strong enough to carry a pregnancy and deliver a baby. Everything else — the support ligaments, the pelvic floor, the mobility of the uterus — follows from that requirement, and every failure of that requirement is a gynaecological or obstetric disease.",
      },

      { type: "heading", level: 2, text: "The organs" },
      {
        type: "table",
        headers: ["Organ", "Structure", "Clinical relevance"],
        rows: [
          ["Uterus", "A hollow muscled organ with fundus, body and cervix, lined by the endometrium, which is shed monthly as menstruation", "Its muscle is the myometrium, which contracts in labour and in menstruation, and its lining is the site of implantation"],
          ["Cervix", "The lower part of the uterus, projecting into the vagina, with an internal os into the uterus and an external os into the vagina", "The transformation zone, where the squamous and columnar epithelium meet, is the site of cervical cancer"],
          ["Fallopian tubes", "Four parts: infundibulum with fimbriae, ampulla, isthmus, and the interstitial part within the uterine wall", "The ampulla is the commonest site of ectopic implantation, because fertilisation occurs there"],
          ["Ovaries", "Paired organs on the lateral pelvic wall, held by the mesovarium; the site of the ova and of the steroid hormones", "Ovarian carcinoma presents late, because the pelvic cavity has enough space for it to grow silently"],
          ["Vagina", "A fibromuscular tube running up and back from the introitus to the cervix, lying behind the bladder and in front of the rectum", "Its axis, together with the orientation of the pelvis, determines the direction of a vaginal examination"],
        ],
      },

      { type: "heading", level: 2, text: "Blood supply and drainage" },
      {
        type: "table",
        headers: ["Vessel", "Origin and course", "Significance"],
        rows: [
          ["Uterine artery", "A branch of the internal iliac artery, crossing the ureter above the lateral fornix of the vagina (water under the bridge)", "The relation to the ureter is the one to remember for a hysterectomy: the ureter is the structure most at risk"],
          ["Ovarian artery", "Directly from the abdominal aorta", "A reminder of the ovary's embryonic origin high in the abdomen, and of why ovarian pain refers to the flank"],
          ["Pampiniform plexus", "The venous plexus of the ovary, which forms the ovarian vein", "The right ovarian vein drains into the inferior vena cava, and the left into the left renal vein"],
          ["Lymphatics", "Uterine drainage to the internal, external and common iliac and the obturator nodes", "The basis of the staging in endometrial and cervical cancer"],
        ],
      },

      { type: "heading", level: 2, text: "Worked example: how the uterus is supported" },
      {
        type: "paragraph",
        text: "The uterus is normally anteverted (tipped forward over the bladder) and anteflexed (bent forward on itself), and it is held in that position by the following structures: the uterosacral ligaments pulling the cervix backwards and upwards, the transverse cervical (cardinal) ligaments acting as the lateral supports, the round ligaments passing forward through the inguinal canal to the labia, and the pelvic floor muscles providing a third layer of passive support.",
      },
      {
        type: "paragraph",
        text: "Childbirth injury, congenital weakness and ageing weaken this support, and the result is pelvic organ prolapse, the descent of the uterus or the vagina. Clinical descriptions of prolapse are expressed with reference to the point of descent measured as a prolapse at its specific stage, and the management ranges from pelvic floor physiotherapy and a pessary to surgical repair.",
      },
      {
        type: "question",
        prompt: "In a hysterectomy, which structure crosses the uterine artery and is therefore at risk of injury?",
        answer: "The ureter, which passes below the uterine artery near the lateral fornix of the vagina — the relation that gives the mnemonic 'water under the bridge'.",
        explanation: "Injury to the ureter is one of the classic complications of pelvic surgery, and it is checked for intraoperatively by observing urine output and in some cases by inserting stents.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the round ligaments provide the main support. They are relatively minor supports; the uterosacral and cardinal ligaments and the pelvic floor do most of the work, and the round ligament may be used to suspend a retroverted uterus.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the ovary drains to the iliac nodes. It drains along the ovarian vein to the para-aortic nodes, which is why an ovarian carcinoma spreads high along the aorta.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Locating the commonest site of ectopic pregnancy in the interstitial part. The commonest site is the ampulla; the interstitial part is rare but dangerous because it ruptures late.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Name the four parts of the fallopian tube and say where fertilisation normally occurs.",
        answer: "The infundibulum with fimbriae, the ampulla, the isthmus, and the interstitial part. Fertilisation normally occurs in the ampulla, which is also the commonest site of an ectopic pregnancy.",
        explanation: "The tubal anatomy determines where an ovum and sperm meet, and therefore where implantation occurs when it goes wrong.",
      },
      {
        type: "question",
        prompt: "Where is the transformation zone of the cervix, and why does it matter?",
        answer: "It is the area between the squamous epithelium of the ectocervix and the columnar epithelium of the endocervical canal, which migrates over a lifetime. It matters because almost all cervical cancers arise in this zone, which is why a cervical sample takes cells from it.",
        explanation: "The transformation zone is where the epithelium is most metabolically active, and it is the site screened by the Papanicolaou test and by HPV testing.",
      },
      {
        type: "question",
        prompt: "Why is pelvic organ prolapse a disorder of birth and of the ageing pelvic floor, rather than simply of the uterus?",
        answer: "Because the uterus's position is determined by the supporting ligaments and by the strength of the pelvic floor, both of which are weakened by childbirth injury and by age, and the descent follows the loss of that support.",
        explanation: "The failure of support is a failure of the ligaments and the muscles of the pelvic floor, and its prevention is the management of those same two things.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which artery supplies the uterus, and which structure is at risk during its ligation in a hysterectomy?",
        options: [
          "The internal pudendal artery, with the bladder",
          "The uterine artery from the internal iliac, with the ureter beneath it",
          "The ovarian artery, with the femoral nerve",
          "The inferior mesenteric artery, with the sigmoid colon",
        ],
        correctIndex: 1,
        explanation: "The uterine artery passes over the ureter in its course to the uterus, and the ureter is at risk when the artery is clamped during hysterectomy or caesarean section.",
      },
      {
        type: "mcq",
        stem: "Which is the commonest site of ectopic pregnancy?",
        options: [
          "The interstitial part of the tube", "The ampulla of the fallopian tube", "The fimbriated end", "The cervix",
        ],
        correctIndex: 1,
        explanation: "The ampulla is the commonest site because it is where fertilisation occurs; it is also the site that ruptures at 6 to 8 weeks. Interstitial pregnancies are less common but are dangerous because they rupture later.",
      },
      {
        type: "mcq",
        stem: "Which structure is supplied by the round ligament of the uterus?",
        options: [
          "The uterus, because it holds the uterine fundus to the pelvic wall",
          "The labia, because it passes from the uterus to the inguinal canal",
          "The broad ligament and the little pelvic structures",
          "The pelvic floor, to the introitus of the vagina",
        ],
        correctIndex: 1,
        explanation: "The round ligament runs from the uterine fundus through the inguinal canal to the labia majora. It is a reminder of the ovary's embryological descent, and it can cause the referred pain of early pregnancy or ovarian disease.",
      },
      {
        type: "mcq",
        stem: "Which cells of the endometrium are the ones that proliferate and shed during the menstrual cycle?",
        options: ["The myometrial muscle cells", "The progesterone-sensitive endometrial epithelial and stromal cells", "The ciliated cells of the cervix", "The ovarian surface epithelial cells"],
        correctIndex: 1,
        explanation: "The endometrium proliferates and secretes under the control of oestrogen and progesterone, and its shedding is the menses. The myometrium contracts during both menstruation and labour.",
      },
      {
        type: "mcq",
        stem: "Where do the lymph nodes of the uterus drain?",
        options: [
          "To the para-aortic nodes, like the ovary",
          "To the internal, external and common iliac nodes and to the obturator nodes",
          "To the superficial inguinal nodes",
          "To the axillary nodes",
        ],
        correctIndex: 1,
        explanation: "The uterus drains to the iliac and the obturator nodes, which is the basis of the staging of endometrial and cervical cancer; the ovary drains to the para-aortic nodes.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The female reproductive tract consists of the uterus, tubes, ovaries and vagina, built around the requirement to carry and deliver a pregnancy. The uterine artery from the internal iliac passes over the ureter, making the ureter the structure at risk in pelvic surgery, and the lymphatics drain to the iliac and obturator nodes, with the ovary draining separately to the para-aortic nodes. Support comes from the uterosacral and cardinal ligaments and from the pelvic floor, and prolapse is the failure of that support.",
      },
      {
        type: "paragraph",
        text: "Next: the menstrual cycle, the monthly example of a positive and negative feedback loop that every gynaecological treatment ultimately modifies.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 2 — The menstrual cycle (fully authored)
// ---------------------------------------------------------------------------
function lesson2() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the hormonal sequence of the menstrual cycle from the hypothalamus to the ovaries and back; name the phases of the cycle, say which hormone is dominant in each, and relate them to the histological appearance of the endometrium; explain the mechanism of ovulation and how the luteal phase differs from the follicular phase; define what makes a cycle normal and classify the common abnormalities of bleeding; and use knowledge of the cycle to interpret contraception and fertility.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (Anatomy) and PHYS 101 module 1 (homeostasis and feedback). The menstrual cycle is a textbook example of negative feedback with an added burst of positive feedback.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "The menstrual cycle",
        text: "The cyclical, 28-day (range 21 to 35) preparation of the endometrium for implantation, driven by the hypothalamus, the pituitary and the ovaries, and measured from the first day of menstruation to the day before the next.",
      },
      {
        type: "paragraph",
        text: "The cycle has three interacting loops. The hypothalamus releases gonadotropin-releasing hormone, which causes the pituitary to release follicle-stimulating hormone and luteinizing hormone, which act on the ovary, whose own hormones — oestrogen and progesterone — feed back on both hypothalamus and pituitary. The whole thing is dominated by two phases: the follicular phase, whose dominant hormone is oestrogen and which ends in ovulation, and the luteal phase, whose dominant hormone is progesterone and which ends in either implantation or menstruation.",
      },

      { type: "heading", level: 2, text: "Worked example: the phases, hormone by hormone" },
      {
        type: "table",
        headers: ["Phase", "Days", "Dominant hormone", "Endometrium", "Key event"],
        rows: [
          ["Menstruation", "1 to 5", "Oestrogen and progesterone both low", "Shedding, from the breakdown of the spiral arteries of the secretory endometrium", "The start of the cycle"],
          ["Follicular (proliferative)", "1 to 13", "Oestrogen", "Proliferates and thickens under oestrogen, and the glands become tortuous", "A dominant follicle develops, and its oestrogen rises"],
          ["Ovulation", "14", "A surge of luteinizing hormone", "Late proliferative", "The luteinizing hormone surge ruptures the follicle and releases the ovum"],
          ["Luteal (secretory)", "15 to 28", "Progesterone from the corpus luteum", "Secretory: the glands become coiled, the stroma oedematous, and the endometrium receptive", "If pregnancy does not occur, the corpus luteum regresses, progesterone falls, and menstruation follows"],
        ],
      },
      {
        type: "paragraph",
        text: "Two mechanisms in this table deserve emphasis. The luteinizing hormone surge is the one event in physiology in which positive feedback dominates: rising oestrogen, above a threshold and sustained for about fifty hours, changes the pituitary's response from negative to positive feedback, so that luteinizing hormone release accelerates itself and produces the surge. Second, the corpus luteum is a temporary endocrine organ that lives for about fourteen days unless it is rescued by human chorionic gonadotrophin from an implanting embryo, and its regression at the end of the luteal phase is what causes the fall in progesterone that permits menstruation.",
      },

      { type: "heading", level: 2, text: "What is a normal cycle" },
      {
        type: "table",
        headers: ["Parameter", "Normal"],
        rows: [
          ["Cycle length", "21 to 35 days, with up to a 2 to 3 day variation from cycle to cycle"],
          ["Menstrual duration", "2 to 7 days"],
          ["Blood loss", "20 to 60 millilitres, with less than 80 considered normal"],
          ["First day", "Defined as the day on which bleeding starts, and the day from which the cycle is counted"],
        ],
      },
      {
        type: "paragraph",
        text: "The abnormalities of bleeding that a student must be able to describe are classified by the pattern and by the cause. Heavy menstrual bleeding (formerly menorrhagia) is regular, heavy and prolonged bleeding; intermenstrual bleeding occurs between the periods; dysmenorrhoea is pain with the period and is secondary if it is caused by pathology; and amenorrhoea is the absence of menstruation, primary (no menarche by 16 with secondary sexual development, or by 14 without) or secondary (the cessation of periods for at least six months in a previously cycling woman).",
      },
      {
        type: "callout",
        variant: "info",
        text: "A cycle that begins without ovulation, or in which ovulation is absent, is called an anovulatory cycle, and it is the commonest cause of heavy menstrual bleeding in adolescents and in the late pre-menopausal years — the endometrium proliferates under unopposed oestrogen and outgrows its own blood supply, giving irregular heavy bleeding.",
      },

      { type: "heading", level: 2, text: "Clinical correlation" },
      {
        type: "question",
        prompt: "Why does the understanding of the menstrual cycle change how contraception is explained to a patient?",
        answer: "Because the hormonal methods prevent pregnancy at the top of the same loops: the combined pill prevents the luteinizing hormone surge and therefore ovulation, and it thickens the cervical mucus and thins the endometrium. The coil works differently, in the uterus. So each method acts at a different point in the same loop.",
        explanation: "Every method works at a point in this cycle or in the uterus, and knowing the loops determines which patients can be helped, for example which patient can use a device with hormone.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying progesterone is the dominant hormone of the follicular phase. Oestrogen is; progesterone dominates the luteal phase and is produced by the corpus luteum.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying an anovulatory cycle means no bleeding. It does mean no ovulation, but the bleeding is heavy and irregular because of unopposed oestrogen.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying menstruation is the loss of the whole endometrium. Only the functional layer is shed; the basal layer remains to regenerate.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "When does ovulation occur, and what triggers it?",
        answer: "About day 14 of a 28-day cycle, triggered by a surge of luteinizing hormone, which is itself triggered by a sustained rise in oestrogen that switches the pituitary from negative to positive feedback.",
        explanation: "The luteinizing hormone surge is the one place where positive feedback dominates in this cycle, and it is the event that the combined contraceptive prevents.",
      },
      {
        type: "question",
        prompt: "What happens to the corpus luteum if pregnancy does not occur?",
        answer: "It regresses after about fourteen days, and the fall in progesterone removes the support for the secretory endometrium, so menstruation follows.",
        explanation: "The corpus luteum is a temporary endocrine organ whose survival depends on human chorionic gonadotrophin, produced by an implanting embryo — the principle behind the pregnancy test.",
      },
      {
        type: "question",
        prompt: "What is the normal volume of blood loss during menstruation?",
        answer: "Between about 20 and 60 millilitres, with more than 80 millilitres considered heavy.",
        explanation: "Heavy menstrual bleeding is a common and treatable presentation, and the volume is measured by asking about clots and through the number of pads used.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "What is the dominant hormone of the luteal phase, and where is it produced?",
        options: [
          "Oestrogen, from the theca cells of the dominant follicle",
          "Progesterone, from the corpus luteum",
          "Prolactin, from the anterior pituitary",
          "Luteinizing hormone, from the hypothalamus",
        ],
        correctIndex: 1,
        explanation: "The corpus luteum, formed after ovulation from the granulosa cells of the ruptured follicle, secretes progesterone, which acts on the secretory endometrium.",
      },
      {
        type: "mcq",
        stem: "What triggers the surge of luteinizing hormone that causes ovulation?",
        options: [
          "A fall in oestrogen below a threshold",
          "A sustained rise in oestrogen above a threshold, which switches the pituitary to positive feedback",
          "A rise in progesterone",
          "A fall in follicle-stimulating hormone",
        ],
        correctIndex: 1,
        explanation: "Oestrogen above a threshold and sustained for about 50 hours switches the pituitary's response from negative to positive feedback, accelerating luteinizing hormone release.",
      },
      {
        type: "mcq",
        stem: "In which phase is the endometrium secretory, and in which is it proliferative?",
        options: [
          "Proliferative in the luteal phase, secretory in the follicular phase",
          "Secretory in the luteal phase, proliferative in the follicular phase",
          "Proliferative in both, with the difference in the number of glands",
          "Secretory in both",
        ],
        correctIndex: 1,
        explanation: "The follicular phase is dominated by oestrogen, which proliferates the endometrium, and the luteal phase is dominated by progesterone, which converts the endometrium into a secretory one receptive to implantation.",
      },
      {
        type: "mcq",
        stem: "What is the normal range for the menstrual cycle length?",
        options: ["14 to 21 days", "21 to 35 days", "28 to 28 days, exactly", "35 to 42 days"],
        correctIndex: 1,
        explanation: "The cycle length is measured from the first day of bleeding to the day before the next, and it normally varies between 21 and 35 days, with a variation of 2 to 3 days from cycle to cycle.",
      },
      {
        type: "mcq",
        stem: "Which is the commonest cause of heavy menstrual bleeding in an adolescent?",
        options: [
          "Cervical cancer", "Anovulatory cycles, in which unopposed oestrogen proliferates the endometrium until it outgrows its blood supply", "Endometrial carcinoma", "Ectopic pregnancy",
        ],
        correctIndex: 1,
        explanation: "Anovulatory cycles are the commonest cause of heavy menstrual bleeding in adolescents and in the late premenopausal years, and they respond to hormonal treatment that opposes the oestrogen.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The menstrual cycle is a hormonal loop between hypothalamus, pituitary and ovary, normally counted from the first day of menstruation and lasting 21 to 35 days. The follicular phase is dominated by oestrogen, which proliferates the endometrium, and it ends in the luteinizing hormone surge that is triggered by a sustained rise in oestrogen and that releases the ovum; the luteal phase is dominated by progesterone from the corpus luteum, and its regression causes menstruation. Understanding this loop explains both the abnormalities of menstrual bleeding and the mechanisms of every contraceptive method.",
      },
      {
        type: "paragraph",
        text: "Next: puberty and the menopause, the two ends of the reproductive lifespan, where the same hormonal loop is switched on and then off.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 3 — Puberty, the menopause & assessment in OBGYN (fully authored)
// ---------------------------------------------------------------------------
function lesson3() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: state the normal age ranges of puberty and of the menopause; list the pubertal stages in girls and their hormonal basis; describe the features and the consequences of oestrogen deficiency at the menopause; distinguish the symptoms of the menopause from those that are not; state what an initial assessment in gynaecology comprises and how it is performed; and identify which symptoms require urgent gynaecological assessment.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-2, and PHYS 101 module 1 (feedback loops). The menopause is the switching off of the same loops that puberty switched on.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Menopause",
        text: "The permanent cessation of menstruation following the loss of ovarian follicular activity, confirmed in retrospect after twelve months of amenorrhoea, and occurring naturally at an average age of about 51.",
      },
      {
        type: "paragraph",
        text: "The menopause is a natural event rather than a disease, and the problem is that the fall in oestrogen has consequences: vasomotor symptoms in the short term, and accelerated bone loss and genitourinary and genital atrophy in the long term. Management is a judgement of symptoms against risks, because hormone replacement is effective for the symptoms and slightly increases the risk of venous thromboembolism, stroke and breast cancer in some groups and some durations.",
      },

      { type: "heading", level: 2, text: "Worked example: puberty" },
      {
        type: "table",
        headers: ["Stage", "Age range", "Feature", "Driver"],
        rows: [
          ["Thelarche", "10 to 11", "Breast budding", "Oestrogen from the activating ovaries"],
          ["Pubarche", "10 to 12", "Sexual hair", "Adrenal androgens"],
          ["Growth spurt", "11 to 13", "Accelerated linear growth, which is the earliest pubertal change in boys", "Growth hormone acting with the sex steroids"],
          ["Menarche", "12 to 13 (range 10 to 16)", "The first menstrual period", "The maturation of the hypothalamic-pituitary-gonadal axis"],
        ],
      },
      {
        type: "paragraph",
        text: "Precocious puberty is the appearance of secondary sexual characteristics before the age of 8 in girls and 9 in boys, and delayed puberty is their absence beyond the age of 13. In girls, menarche usually follows the onset of breast development by about two years, and the menstrual cycles in the first one or two years are commonly anovulatory, which explains both the irregular bleeding and the relative infertility of adolescence.",
      },

      { type: "heading", level: 2, text: "Menopause" },
      {
        type: "table",
        headers: ["Feature", "Timing", "Explanation"],
        rows: [
          ["Irregular cycles then amenorrhoea", "Over several years before the final period", "The follicle supply is falling, ovulation becomes rare, and cycles become anovulatory"],
          ["Vasomotor symptoms", "Perimenopause to several years after", "Short-term vasomotor activation (flushing and sweating), which is why hormone replacement is effective"],
          ["Genitourinary atrophy", "Years after the menopause", "The thinning of the vaginal and urinary epithelium causes dryness and recurrent urinary infections"],
          ["Bone loss", "Years after the menopause", "Accelerated loss of bone because oestrogen normally inhibits osteoclast activity, increasing the risk of osteoporosis and fracture"],
          ["Mood changes", "Variable", "A combination of sleep disruption from the flushes, and the direct effect of falling oestrogen"],
        ],
      },
      {
        type: "paragraph",
        text: "Hormone replacement therapy consists of oestrogen (with a progestogen in any woman who still has a uterus, to protect the endometrium from hyperplasia) and it is the most effective treatment for the vasomotor symptoms and the genitourinary atrophy. The benefits and risks are weighed against the age of the patient, her symptom burden, and her risk factors for thromboembolism, stroke, breast cancer and cardiovascular disease, and the treatment is used at the lowest effective dose with regular review.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "The slide that most often catches a student is the uterus. A woman with an intact uterus who is given systemic oestrogen and not a progestogen risks endometrial hyperplasia and carcinoma, so combined therapy is mandatory in that group, and systemic oestrogen alone is reserved for the woman who has had a hysterectomy.",
      },

      { type: "heading", level: 2, text: "Assessment in gynaecology" },
      {
        type: "table",
        headers: ["Aspect", "What is asked or done"],
        rows: [
          ["History", "The presenting complaint, the menstrual history, the obstetric history, the contraception, the sexual history and the cervical screening, and the drug history, including hormonal medication"],
          ["Examination", "A general examination including anaemia and signs of endocrine disease; abdominal palpation for mass and tenderness; and a pelvic examination with a chaperone"],
          ["Pelvic examination", "External inspection; a speculum examination of the cervix (visualisation and sampling if needed); and a bimanual examination to feel the size, the position and the mobility of the uterus and the adnexa"],
          ["Investigation", "Pregnancy test, pelvic ultrasound, cervical sampling, swabs, and blood tests including haemoglobin, thyroid and hormone profile where indicated"],
        ],
      },
      {
        type: "paragraph",
        text: "A chaperone is mandatory, and the offer of one must be made and documented; the examination must be explained and consent obtained; and the examination is performed with the patient's privacy and dignity protected. These are not decoration but a part of the clinical method: a pelvic examination performed without consent is an assault, and a chaperone who is not present is indefensible in any dispute.",
      },

      { type: "heading", level: 2, text: "Red flags" },
      {
        type: "table",
        headers: ["Presentation", "Urgency", "Why"],
        rows: [
          ["Post-coital or post-menopausal bleeding", "Urgent, within two weeks under the cancer pathway", "It is a symptom of cervical and endometrial cancer until proven otherwise"],
          ["Persistent pelvic or abdominal bloating, difficulty eating or feeling full quickly", "Urgent assessment for ovarian cancer", "These are the symptoms with the highest association with ovarian cancer, and the diagnosis is late"],
          ["A vulval or vaginal ulcer or lump, an unexplained discharge with bleeding", "Urgent", "It may be vulval or vaginal cancer"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the menopause is diagnosed by a single raised follicle-stimulating hormone level. It is not: the diagnosis is clinical after twelve months of amenorrhoea, and the follicle-stimulating hormone fluctuates and is not a reliable single value.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying every post-menopausal bleed is atrophic. It must be investigated with an ultrasound and endometrial sampling before it is attributed to atrophy.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Skipping the chaperone because the patient appears comfortable. The chaperone is for the record as much as for the patient, and the offer is documented even if declined.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What are the features of the perimenopause and when does it begin?",
        answer: "The perimenopause begins around the age of 45 with irregular cycles, anovulation and then amenorrhoea, and it ends at the menopause, defined retrospectively after twelve months without a period. Vasomotor symptoms, urogenital atrophy and sleep disturbance are common.",
        explanation: "The perimenopause is the transition that precedes the final menstrual period, and it is the period in which the symptoms are usually most troublesome.",
      },
      {
        type: "question",
        prompt: "Why must a woman with an intact uterus on systemic hormone replacement take a progestogen as well?",
        answer: "Because unopposed systemic oestrogen causes the endometrium to proliferate, with a risk of hyperplasia and of endometrial cancer; the progestogen opposes that and protects the endometrium.",
        explanation: "A hysterectomised woman does not need the progestogen, which is why oestrogen alone is prescribed only in her.",
      },
      {
        type: "question",
        prompt: "Which symptoms suggest that an ovarian cancer should be considered in a post-menopausal woman?",
        answer: "The symptoms of persistent abdominal or pelvic bloating, a feeling of fullness, early satiety, and a change in bowel habit, alongside a family history.",
        explanation: "These symptoms are the features most commonly associated with ovarian cancer, and because it presents late, a low threshold for referral is essential.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "At what average age does the natural menopause occur?",
        options: ["35 to 40", "45 to 50", "50 to 55, with an average of about 51", "60 to 65"],
        correctIndex: 2,
        explanation: "The average age at the menopause is about 51, and it is defined retrospectively by twelve months of amenorrhoea. Menopause before 40 is premature ovarian insufficiency.",
      },
      {
        type: "mcq",
        stem: "Which of these is a symptom of post-menopausal atrophy?",
        options: [
          "A productive cough",
          "Vaginal dryness, dyspareunia and recurrent urinary tract infections",
          "Amenorrhoea",
          "A raised blood pressure",
        ],
        correctIndex: 1,
        explanation: "Vaginal and urinary epithelial thinning follows the menopausal fall in oestrogen and causes dryness and recurrent urinary infections; amenorrhoea is the defining feature of the menopause itself.",
      },
      {
        type: "mcq",
        stem: "Why must systemic hormone replacement therapy include a progestogen in a woman who has a uterus?",
        options: [
          "Because the progestogen potentiates the oestrogen",
          "Because the progestogen protects the endometrium from the hyperplastic effect of unopposed oestrogen",
          "Because the progestogen reduces the vasomotor symptoms",
          "Because the progestogen prevents osteoporosis",
        ],
        correctIndex: 1,
        explanation: "Unopposed systemic oestrogen proliferates the endometrium and increases the risk of endometrial cancer; a progestogen opposes this and is mandatory in a woman with a uterus.",
      },
      {
        type: "mcq",
        stem: "Which presentation requires urgent referral for possible cervical or endometrial cancer?",
        options: [
          "Mild irregular bleeding in the first months of menstruation",
          "Post-coital or post-menopausal bleeding",
          "Fluctuating bloating with a change of bowel habit with diarrhoea and constipation",
          "Intermittent pain during ovulation",
        ],
        correctIndex: 1,
        explanation: "Post-coital or post-menopausal bleeding is investigated under the urgent cancer pathway, because it is one of the cardinal symptoms of cervical and endometrial cancer.",
      },
      {
        type: "mcq",
        stem: "Why is a chaperone offered and documented at every pelvic examination?",
        options: [
          "Because the patient cannot be trusted", "Because the offer is part of consent and protects both patient and doctor in any later dispute", "Because it shares the workload of the examination", "Because it is required by the nurse",
        ],
        correctIndex: 1,
        explanation: "A chaperone is offered for every pelvic examination and the offer and the response are documented, both for the patient's reassurance and as protection for the examining clinician.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Puberty switches on the hypothalamic-pituitary-ovarian loop and the menopause switches it off. The menopause, at an average age of about 51 and defined retrospectively by twelve months of amenorrhoea, is a natural process whose consequences of vasomotor symptoms, genitourinary atrophy and bone loss make hormone replacement a judgement of symptoms against risk — and a woman with a uterus needs a progestogen with her systemic oestrogen. The assessment in gynaecology is a structured history and examination with a chaperone, and post-coital and post-menopausal bleeding and the symptoms of ovarian cancer require urgent assessment.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 4 — Contraception (fully authored)
// ---------------------------------------------------------------------------
function lesson4() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: classify the contraceptive methods by their mechanism and give the typical and perfect-use failure rates of the principal ones; state the absolute contraindications to the combined oral contraceptive pill; name the methods that are long-acting reversible and their durations; describe the mechanisms of emergency contraception and its time windows; and counsel a patient about which method suits her circumstances.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-3. Every contraceptive method acts on the menstrual cycle, the ovary, the tube or the uterus that you have just learned.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Contraception",
        text: "The deliberate prevention of pregnancy by a method that acts to prevent ovulation, to prevent fertilisation, or to prevent implantation, with a failure rate that depends on both the method and the reliability with which it is used.",
      },
      {
        type: "paragraph",
        text: "The gap between typical use and perfect use is the central fact of contraceptive counselling, and it is the reason the long-acting reversible methods are the most effective. A pill taken with the same accuracy every day is over 99 per cent effective, but taken as most people take it, about 7 to 9 women in a hundred become pregnant in a year. An implant or a coil, which requires nothing of the woman after insertion, has a failure rate of well under 1 per cent regardless of adherence.",
      },

      { type: "heading", level: 2, text: "Worked example: the methods" },
      {
        type: "table",
        headers: ["Method", "Mechanism", "Duration", "Typical-use failure rate per year"],
        rows: [
          ["Combined oral contraceptive pill", "Oestrogen and progestogen suppress follicle-stimulating hormone and the luteinizing surge, so ovulation is prevented; the cervical mucus is thickened and the endometrium thinned", "Daily pill", "About 7 per cent"],
          ["Progestogen-only pill", "Thickens the cervical mucus and prevents ovulation, with the window of dose timing to remain 3 hours for the traditional pill", "Daily pill", "About 7 per cent"],
          ["Progestogen implant", "Thickens the cervical mucus, thins the endometrium, and suppresses ovulation in most users", "Three years", "Under 0.1 per cent"],
          ["Depot progestogen injection", "Suppresses ovulation and thickens the cervical mucus", "Every three months", "About 4 per cent (with the return of fertility often delayed by several months)"],
          ["Combined transdermal patch", "Oestrogen and progestogen delivered transdermally", "Weekly patch", "About 7 per cent"],
          ["Combined vaginal ring", "Oestrogen and progestogen delivered vaginally", "Three weeks in, one week out", "About 7 per cent"],
          ["Copper intrauterine device", "The copper is toxic to sperm and prevents fertilisation; it is hormone-free", "Five to ten years", "Under 1 per cent"],
          ["Levonorgestrel intrauterine system", "Thins the endometrium and thickens the cervical mucus; it also reduces menstrual bleeding", "Eight years (or five for the smaller device)", "Under 1 per cent"],
          ["Male and female condom", "A mechanical barrier", "Per act", "About 13 to 21 per cent, but it is the only method that also reduces sexual transmission of infection"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Sterilisation is more than 99 per cent effective but is intended to be permanent, and it is a surgical decision rather than a contraceptive one; the intrauterine methods are therefore the long-acting reversible options, and they are the only methods in which effectiveness does not depend on the patient's adherence.",
      },

      { type: "heading", level: 2, text: "Contraindications to the combined pill" },
      {
        type: "table",
        headers: ["Contraindication", "Reason"],
        rows: [
          ["A personal history of venous thromboembolism", "Oestrogen is prothrombotic"],
          ["Current or historic breast cancer", "Oestrogen-sensitive malignancy"],
          ["Migraine with aura", "An oestrogen-containing method further increases the risk of stroke"],
          ["Smoking over the age of 35", "The combination of oestrogen, smoking and age markedly increases the risk of arterial thrombosis"],
          ["Controlled hypertension", "The oestrogen raises the blood pressure, so it is contraindicated"],
          ["Breastfeeding within six weeks of delivery", "Oestrogen reduces milk supply"],
          ["A history of ischaemic heart disease or stroke", "Prothrombotic and pro-atherogenic risk"],
          ["Known or suspected pregnancy", "The pill has nothing to treat"],
        ],
      },
      {
        type: "paragraph",
        text: "The progestogen-only methods have far fewer contraindications, because they lack the thrombotic effect of oestrogen, and they are the methods of choice in the patient with migraine with aura, a history of venous thromboembolism, and breastfeeding within six weeks. The price of that safety advantage is bleeding irregularity, which is common with progestogen-only contraception.",
      },

      { type: "heading", level: 2, text: "Clinical correlation: emergency contraception" },
      {
        type: "paragraph",
        text: "Two methods of emergency contraception exist, and both must be started as early as possible. The copper intrauterine device is the most effective, and it can be inserted up to five days after unprotected intercourse and can then be retained as the woman's ongoing contraception. Oral levonorgestrel can be taken up to 72 hours after intercourse (and is licensed for up to 120 hours for the ulipristal variant, though it is less effective), and it works mainly by delaying or inhibiting ovulation, and it does not disrupt an established pregnancy.",
      },
      {
        type: "question",
        prompt: "A patient with migraine with aura is asking for contraception. Which methods must be avoided?",
        answer: "The combined hormonal methods (pill, patch, vaginal ring) are unacceptable because oestrogen plus migraine with aura increases the risk of stroke. The progestogen-only methods and the intrauterine devices are safe and effective alternatives.",
        explanation: "The contraindication is a risk of an arterial event, and it is a contraindication to oestrogen rather than to all hormonal contraception.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the pill causes an abortion. The hormonal methods mainly prevent ovulation, and they do not disrupt an established pregnancy.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying condoms are the most effective method because they are the easiest to use. They are not the most effective, but they are the only common method that also reduces sexual transmission of infection — a separate benefit.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying contraception is contraindicated in all smokers. The combined oestrogen-containing method is contraindicated in smokers over 35, and not in younger smokers — where the absolute risk is lower.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why are the long-acting reversible methods more effective than the pill?",
        answer: "Because their effectiveness does not depend on the patient remembering anything: an implant, an injection or an intrauterine device continues to work after it is fitted, unlike a daily pill whose typical-use failure rate is high because of missed doses.",
        explanation: "The difference is adherence, and the counselling of a patient whose priority is maximum effectiveness should reflect it.",
      },
      {
        type: "question",
        prompt: "What are the absolute contraindications to the combined oral contraceptive pill?",
        answer: "A history of venous thromboembolism, ischaemic heart disease or stroke, migraine with aura, current breast cancer, breastfeeding within six weeks, smoking over 35, controlled hypertension, and pregnancy.",
        explanation: "The contraindications are largely the ones that increase the risk of the arterial and venous thrombosis that oestrogen causes.",
      },
      {
        type: "question",
        prompt: "How long after unprotected intercourse can emergency contraception still be used?",
        answer: "A copper device up to five days, and oral levonorgestrel best within 72 hours and licensed up to 120 hours. Both are more effective if used earlier.",
        explanation: "The effectiveness of the pill falls with time after intercourse, which is why the counselling is to use it as soon as possible.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which contraceptive method has the lowest typical-use failure rate?",
        options: [
          "The combined oral contraceptive pill",
          "The progestogen implant",
          "The male condom",
          "The combined patch",
        ],
        correctIndex: 1,
        explanation: "The implant is a long-acting reversible method whose effectiveness does not depend on the patient's adherence, and its failure rate is under 0.1 per cent per year.",
      },
      {
        type: "mcq",
        stem: "Which of the following is an absolute contraindication to the combined oral contraceptive pill?",
        options: [
          "Mild hypertension that has never been treated",
          "Migraine with aura",
          "A mild frontal headache without migraine",
          "A first-degree relative with breast cancer",
        ],
        correctIndex: 1,
        explanation: "The combination of migraine with aura and oestrogen increases the risk of stroke and is contraindicated. The other options are risks to be weighed rather than absolute contraindications.",
      },
      {
        type: "mcq",
        stem: "What is the difference between a copper intrauterine device and a levonorgestrel intrauterine system?",
        options: [
          "The copper device is hormone-free and prevents fertilisation; the levonorgestrel system thins the endometrium and thickens cervical mucus and reduces bleeding",
          "The copper device thickens cervical mucus and the levonorgestrel system prevents fertilisation",
          "Both contain hormones and are clinically equivalent",
          "The levonorgestrel system is hormone-free",
        ],
        correctIndex: 0,
        explanation: "The copper device acts by a sperm-toxic effect without hormones, whereas the levonorgestrel system acts hormonally on the endometrium and the mucus — and it is the one that reduces menstrual bleeding.",
      },
      {
        type: "mcq",
        stem: "For how long is a levonorgestrel intrauterine system effective?",
        options: ["1 year", "3 years", "8 years", "Permanently"],
        correctIndex: 2,
        explanation: "The 52 mg levonorgestrel intrauterine system is licensed for up to eight years of contraception; the smaller 13.5 mg device is used for five years. Copper devices are effective for five to ten years depending on the device.",
      },
      {
        type: "mcq",
        stem: "Which is the most effective form of emergency contraception?",
        options: [
          "Oral levonorgestrel",
          "A copper intrauterine device, which can be inserted up to five days after intercourse",
          "A combined oral contraceptive pill",
          "Ultrasound of the pelvis",
        ],
        correctIndex: 1,
        explanation: "The copper intrauterine device is the most effective emergency method, and it is the only option that can then continue as the woman's ongoing contraception.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Contraception is classified by mechanism — prevention of ovulation, thickening of cervical mucus, thinning of the endometrium, sperm toxicity, or a mechanical barrier — and by duration. The combined hormonal methods are highly effective in perfect use and depend on daily or weekly adherence, while the long-acting reversible methods do not depend on adherence and are therefore the most effective. The combined pill is contraindicated in patients with migraine with aura, a venous thromboembolism, or smoking over the age of 35, and emergency contraception is the copper device or oral levonorgestrel, both acting by delaying ovulation.",
      },
      {
        type: "paragraph",
        text: "Next: infertility — where the same knowledge is used to help a couple conceive, and where the initial assessment is deliberately still within the capability of a generalist.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 5 — Infertility & subfertility (fully authored)
// ---------------------------------------------------------------------------
function lesson5() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define infertility and state the time point at which investigation is offered; name the principal causes of infertility in women and in men; describe the timing and mechanism of the initial investigations; define the meaning and the measurement of ovarian reserve and ovulatory function; outline the initial treatment for anovulation and for a tubal factor; and counsel a couple about when assisted reproduction is indicated.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-4. Infertility is the failure of the same anatomy and physiology that contraception deliberately interrupts.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Infertility",
        text: "The failure to achieve a clinical pregnancy after twelve months or more of regular unprotected sexual intercourse, in a couple who have not used contraception.",
      },
      {
        type: "paragraph",
        text: "The definition is a probability statement, not a diagnosis: it acknowledges that a healthy couple conceives with about a twenty to twenty-five per cent chance each cycle, and that more than half of couples who have not conceived by twelve months will conceive within the following year without intervention. Its purpose is to time the investigation to the moment when further investigation becomes worthwhile, and to avoid treating a couple who would have conceived anyway.",
      },

      { type: "heading", level: 2, text: "Causes" },
      {
        type: "table",
        headers: ["Category", "Proportion of infertility", "Causes"],
        rows: [
          ["Ovulatory dysfunction", "About 25 per cent", "Anovulation, polycystic ovary syndrome, hyperprolactinaemia, thyroid disease, and ovarian insufficiency"],
          ["Tubal and pelvic factors", "About 20 per cent", "Previous pelvic infection or chlamydial infection, endometriosis, appendicitis or surgery that leaves adhesions"],
          ["Male factors", "About 25 per cent", "Reduced count or motility, varicocele, hypogonadism, and erectile dysfunction, with lifestyle factors including heat and smoking"],
          ["Unexplained", "About 25 per cent", "No abnormality found on the basic tests, and the conception rate that remains is still more than a quarter per cycle"],
          ["Uterine, cervical and other", "Smaller contributions", "Fibroids, endometrial polyps, cervical factors, and coital dysfunction"],
        ],
      },
      {
        type: "paragraph",
        text: "Both partners are investigated, and in a substantial proportion of couples both a female and a male factor contribute. A single-factor investigation risks missing the contributing partner, which is why both investigations proceed at once rather than the female partner being investigated first and the man tested only if she is normal.",
      },

      { type: "heading", level: 2, text: "Worked example: the initial investigations" },
      {
        type: "table",
        headers: ["Investigation", "What it looks for", "Interpretation"],
        rows: [
          ["Mid-luteal progesterone", "Whether ovulation has occurred", "Progesterone above about 30 nanomoles per litre seven days before the next period, or on day 21 of a 28-day cycle, indicates ovulation"],
          ["Thyroid function and prolactin", "A treatable cause of anovulation", "Either is raised or suppressed in a woman with anovulation or galactorrhoea"],
          ["Day 3 follicle-stimulating hormone and oestradiol", "Ovarian reserve", "A raised follicle-stimulating hormone with a low oestradiol indicates reduced ovarian reserve"],
          ["Semen analysis", "The male factor", "Count, motility and morphology taken after 2 to 5 days of abstinence, with two samples taken a month apart"],
          ["Ultrasound and hysterosalpingography (or a tubal test with contrast)", "Tubal patency and the uterine cavity", "Contrast passing freely means the tubes are patent; hydrosalpinges or adhesions block the tube"],
          ["Chlamydia serology", "Previous pelvic infection", "The commonest cause of tubal damage in the developed world"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The initial management of a couple whose investigations are normal is the same as the management of the unexplained couple: continued timed intercourse, with a reassurance that a quarter of couples conceive within the first year of investigation. Assisted conception is then considered after the appropriate interval.",
      },

      { type: "heading", level: 2, text: "Clinical correlation: treatment" },
      {
        type: "paragraph",
        text: "Anovulation is treated according to the underlying cause. In polycystic ovary syndrome the first-line treatment is weight loss, metformin to improve insulin sensitivity where appropriate, and ovulation induction with an oral ovulatory agent such as clomifene or letrozole. In hyperprolactinaemia a dopamine agonist such as cabergoline restores ovulation by lowering prolactin. Tubal disease is not treated by drugs: the options are tubal surgery where the disease is limited, or in vitro fertilisation, which bypasses the tubes entirely.",
      },
      {
        type: "paragraph",
        text: "The process of in vitro fertilisation involves superovulation with gonadotrophin stimulation, transvaginal retrieval of the oocytes, fertilisation in the laboratory and replacement of the embryo, and intracytoplasmic sperm injection is the version used where the sperm are unable to fertilise on their own. The main risks are multiple pregnancy, which is reduced by transferring a single embryo, and ovarian hyperstimulation syndrome, which is a serious and potentially fatal complication of the stimulation.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying in vitro fertilisation treats all causes of infertility. It treats the tubal factor, the male factor, the unexplained and the ovulatory factor, but it does not treat a woman whose uterus cannot support a pregnancy, nor a male with no sperm at all without a donor.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying anovulation means ovarian insufficiency. Anovulation may be from polycystic ovary syndrome, thyroid disease or prolactin, and these respond to ovulation induction, whereas the ovarian insufficiency has a much poorer prognosis.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a single semen analysis determines the male factor. A single abnormal sample must be repeated, because semen analysis varies with the interval of abstinence, illness, and laboratory technique.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "How long must a couple have been trying to conceive before they are defined as infertile?",
        answer: "Twelve months of regular, unprotected, timed intercourse, and sooner if the woman is over 35, or if there is an obvious cause such as anovulation or a previous tubal infection.",
        explanation: "The definition is a probability statement, and the point of the definition is to time investigation to when it becomes worthwhile.",
      },
      {
        type: "question",
        prompt: "What is the initial investigation for ovulatory function?",
        answer: "A mid-luteal serum progesterone, taken on day 21 of a 28-day cycle or seven days before the next period, with a value above about 30 nanomoles per litre indicating ovulation.",
        explanation: "The test uses the corpus luteum to confirm that ovulation has occurred, and it is the simplest of the initial investigations.",
      },
      {
        type: "question",
        prompt: "Why are both partners investigated simultaneously?",
        answer: "Because in a substantial proportion of couples both a female and a male factor contribute, and investigating one partner before looking at the other delays the diagnosis and the treatment.",
        explanation: "The male factor accounts for about a quarter of infertility, and it is only found if it is measured.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "How long must a couple have tried to conceive before they are defined as infertile?",
        options: ["6 months", "12 months", "24 months", "36 months"],
        correctIndex: 1,
        explanation: "Infertility is defined by failure to conceive after 12 months of regular, unprotected intercourse, and the interval is shortened if the woman is 35 or older or a cause is obvious.",
      },
      {
        type: "mcq",
        stem: "What is the commonest cause of infertility overall?",
        options: [
          "Tubal blockage",
          "Male factors and ovulatory dysfunction are each about a quarter, with a quarter of couples having no identified cause",
          "Endometriosis",
          "Uterine fibroids",
        ],
        correctIndex: 1,
        explanation: "Male factors and ovulatory dysfunction each account for about a quarter of infertility, and after investigation about a quarter remain unexplained.",
      },
      {
        type: "mcq",
        stem: "Which progesterone value is generally accepted as evidence of ovulation?",
        options: ["10 nmol/L", "30 nmol/L", "100 nmol/L", "5 nmol/L"],
        correctIndex: 1,
        explanation: "A mid-luteal progesterone above about 30 nanomoles per litre, taken seven days before the next period, indicates that the corpus luteum has formed after ovulation.",
      },
      {
        type: "mcq",
        stem: "Which is the principal risk of in vitro fertilisation?",
        options: [
          "Ovarian hyperstimulation and resulting multiple pregnancy",
          "Congenital malformations from the drugs used",
          "Ectopic pregnancy in the tubes",
          "Menopause at 45",
        ],
        correctIndex: 0,
        explanation: "The stimulation can produce ovarian hyperstimulation syndrome, a potentially fatal complication, and multiple pregnancy — now reduced by transferring a single embryo.",
      },
      {
        type: "mcq",
        stem: "What is the treatment of choice for bilateral tubal blockage with a hydrosalpinx?",
        options: [
          "Antibiotic therapy",
          "In vitro fertilisation, which bypasses the tubes",
          "Ovulation induction",
          "Tubal microsurgery in most cases",
        ],
        correctIndex: 1,
        explanation: "A blocked tube cannot be repaired when the tube has been destroyed, and in vitro fertilisation bypasses the tube entirely; tubal surgery has a limited role for adhesions.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Infertility is the failure to conceive after twelve months of regular unprotected intercourse, and the time point is deliberately chosen to catch the minority who will not conceive without intervention. Its causes are distributed among ovulatory dysfunction, tubal and pelvic factors, male factors and the unexplained, and the initial investigations are simple and available to a generalist: a mid-luteal progesterone for ovulation, thyroid and prolactin, a semen analysis, and a tubal test. Anovulation responds to ovulation induction, and the tubal factor is bypassed by in vitro fertilisation.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 6 — Menstrual disorders: dysmenorrhoea, endometriosis & PCOS (fully authored)
// ---------------------------------------------------------------------------
function lesson6() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: distinguish primary from secondary dysmenorrhoea and state the management of each; describe the pathophysiology and diagnosis of endometriosis and its treatment; state the diagnostic criteria, features and long-term consequences of polycystic ovary syndrome; describe the management of heavy menstrual bleeding and the place of a levonorgestrel intrauterine system; and distinguish the red-flag presentations that require gynaecological referral rather than symptomatic management.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-5. Dysmenorrhoea, endometriosis and PCOS are all diseases of the menstrual cycle, and their management uses the mechanism of the cycle that you have learned.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Menstrual disorder",
        text: "A disturbance of the normal pattern of menstruation or of the symptoms that accompany it, whose distinction from a normal variant is made by the pattern, the timing and the red-flag features.",
      },
      {
        type: "paragraph",
        text: "Three disorders account for most of what a gynaecologist sees in the reproductive years: dysmenorrhoea, endometriosis and polycystic ovary syndrome. Each is a different kind of problem: a painful period without pathology, ectopic endometrium that responds to the cycle, and a metabolic and ovulatory disorder that produces the cycle itself. What unifies them is that the treatment of each modifies the menstrual cycle, and the choice of modification is decided by the mechanism.",
      },

      { type: "heading", level: 2, text: "Worked example 1: dysmenorrhoea" },
      {
        type: "table",
        headers: ["Type", "Mechanism", "Management"],
        rows: [
          ["Primary dysmenorrhoea", "Prostaglandins released by the shedding endometrium cause myometrial contraction and ischaemic pain; the uterus is normal and no pathology is present", "A non-steroidal anti-inflammatory drug, which inhibits cyclo-oxygenase and therefore the prostaglandins; and a combined oral contraceptive, which reduces the endometrium"],
          ["Secondary dysmenorrhoea", "Pain caused by pathology — endometriosis, adenomyosis, fibroids or an intrauterine device", "The treatment of the underlying cause, with an ultrasound to look for the pathology"],
        ],
      },
      {
        type: "paragraph",
        text: "The distinction is made by history: primary dysmenorrhoea starts within a year or two of menarche, with the onset of ovulatory cycles, and the pain is in the lower abdomen and back and is worse with the flow. Secondary dysmenorrhoea that appears later, or that changes or worsens, means that something has grown, and the investigation must precede the analgesia.",
      },

      { type: "heading", level: 2, text: "Worked example 2: endometriosis" },
      {
        type: "definition",
        term: "Endometriosis",
        text: "The presence of endometrial glands and stroma at sites outside the uterus, most commonly on the ovaries, the pelvic peritoneum, the uterosacral ligaments and the rectovaginal septum, where they respond to the hormonal cycle by bleeding into the tissue.",
      },
      {
        type: "paragraph",
        text: "The classic features are dysmenorrhoea, dyspareunia and pain with defecation, together with infertility, and the pain is cyclical because the ectopic tissue responds to the hormones of the cycle. Deposits on the uterosacral ligaments and the pouch of Douglas are palpably tender on pelvic examination, and ovarian deposits form the endometriotic cyst (a chocolate cyst). Definitive diagnosis is by laparoscopy, but empirical treatment is started where the clinical suspicion is strong.",
      },
      {
        type: "table",
        headers: ["Treatment", "Mechanism", "Use"],
        rows: [
          ["Non-steroidal anti-inflammatory drugs and simple analgesia", "Inhibit the prostaglandins of the implants", "First-line symptom control"],
          ["Combined hormonal methods or a progestogen", "Suppress the cycle, so the ectopic tissue is not stimulated and not bleed", "Suppression of the pain"],
          ["Gonadotropin-releasing hormone analogues", "Suppress the pituitary drive, producing a reversible hypo-oestrogenic state", "For patients whose pain does not settle, with add-back hormone replacement to reduce the menopausal side effects"],
          ["Laparoscopic excision or ablation", "Removal of the deposits", "Where the pain is refractory or fertility is the priority"],
          ["In vitro fertilisation", "Bypasses the adhesions", "Where the tubal factor is primary"],
        ],
      },

      { type: "heading", level: 2, text: "Worked example 3: polycystic ovary syndrome" },
      {
        type: "paragraph",
        text: "Polycystic ovary syndrome is a disorder of ovulatory function with a metabolic and endocrine background, and it is the commonest endocrine disorder of reproductive women. Its diagnosis needs two of the following three features: ovulatory dysfunction (irregular or absent cycles), clinical or biochemical evidence of androgen excess, and polycystic ovaries on ultrasound, with other causes excluded.",
      },
      {
        type: "table",
        headers: ["Feature", "Explanation"],
        rows: [
          ["Irregular cycles or amenorrhoea", "Anovulatory cycles with unopposed oestrogen"],
          ["Hirsutism, acne and androgen-dependent hair loss", "Androgen excess from the ovary and the adrenal gland"],
          ["Infertility", "The absence of ovulation"],
          ["Obesity and insulin resistance", "Insulin resistance raises insulin, which drives ovarian androgen production and the hyperinsulinaemia of the syndrome"],
          ["Increased risk of endometrial hyperplasia", "Unopposed oestrogen thickens the endometrium, and with the absence of progesterone the lining is not shed, which increases the long-term risk of endometrial cancer"],
          ["Increased risk of type 2 diabetes and cardiovascular disease", "The metabolic consequences of the insulin resistance"],
        ],
      },
      {
        type: "paragraph",
        text: "The treatment is determined by the symptom that is most important to the patient. Weight loss and metformin restore ovulation and improve the metabolic profile, and letrozole (or clomifene) induces ovulation in a patient who wants a pregnancy. Combined hormonal contraception or a levonorgestrel intrauterine system produces regular withdrawal bleeds and protects the endometrium in a patient whose priority is the cycle, and the treatment of hirsutism is a combination of the mechanical and the pharmacological.",
      },
      {
        type: "question",
        prompt: "How does primary dysmenorrhoea differ from the dysmenorrhoea of endometriosis, and how does the difference change the management?",
        answer: "Primary dysmenorrhoea is pain from the prostaglandins of the normal endometrium, so it usually responds to a non-steroidal anti-inflammatory drug and to a hormonal method. Endometriosis is pain from ectopic endometrium, so the pain is often cyclical, and it is treated by suppressing the cycle — with hormonal methods, surgery, or both — and the endometriosis may also cause dyspareunia and infertility, so the management differs.",
        explanation: "The distinction is the presence of pathology, and it changes the purpose of the treatment from symptom control to suppression of the disease.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying every woman with PCOS has polycystic ovaries on ultrasound. One of the three criteria is polycystic ovarian morphology, and the other two (ovulatory dysfunction and androgen excess) may be enough for the diagnosis in a woman whose follicles are not visibly polycystic.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying endometriosis can be diagnosed by ultrasound alone. Deposits and adhesions on the peritoneum are not seen by ultrasound; the definitive diagnosis is laparoscopy, though the endometrioma can be seen by ultrasound.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a levonorgestrel intrauterine system treats all menorrhagia regardless of cause. It treats unexplained and dysfunctional menorrhagia and the bleeding of fibroids and endometriosis, but fibroids that are submucous and cavity-distorting require a surgical treatment.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What are the diagnostic criteria for polycystic ovary syndrome?",
        answer: "Two of three: ovulatory dysfunction with irregular cycles or amenorrhoea, clinical or biochemical androgen excess, and polycystic ovarian morphology on ultrasound, with other causes excluded.",
        explanation: "The diagnosis is a clinical one based on the features, and it is the first step before selecting a mechanism of treatment.",
      },
      {
        type: "question",
        prompt: "Why does polycystic ovary syndrome increase the risk of endometrial cancer?",
        answer: "Because anovulatory cycles produce unopposed oestrogen, which proliferates the endometrium without the cyclic opposition of progesterone, and the resulting hyperplasia carries a long-term risk of malignant change.",
        explanation: "This is why the management of PCOS restores a regular shedding of the endometrium, even in a patient whose priority is not fertility.",
      },
      {
        type: "question",
        prompt: "What is the mechanism of the treatment of primary dysmenorrhoea by a non-steroidal anti-inflammatory drug?",
        answer: "It inhibits cyclo-oxygenase, the enzyme of prostaglandin synthesis, so the myometrial contraction and the uterine ischaemia are reduced.",
        explanation: "This is why a non-steroidal anti-inflammatory drug is the first-line drug for period pain, and why it works only for the pain of prostaglandin origin.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "What is the difference between primary and secondary dysmenorrhoea?",
        options: [
          "Primary begins with menarche and has no uterine pathology; secondary is caused by pathology such as endometriosis, adenomyosis or fibroids",
          "Primary is caused by infection and secondary is caused by endometriosis",
          "Primary requires laparoscopy in every case",
          "Primary is worse than secondary",
        ],
        correctIndex: 0,
        explanation: "Primary dysmenorrhoea is the pain of prostaglandin release in a normal uterus, and secondary dysmenorrhoea is caused by disease — endometriosis, adenomyosis, fibroids or a device.",
      },
      {
        type: "mcq",
        stem: "Which three features are the diagnostic criteria of polycystic ovary syndrome?",
        options: [
          "Hirsutism, obesity and acne only",
          "Ovulatory dysfunction, clinical or biochemical androgen excess, and polycystic ovarian morphology",
          "Amenorrhoea, infertility and raised prolactin only",
          "Obesity, insulin resistance and infertility only",
        ],
        correctIndex: 1,
        explanation: "The diagnosis requires two of three features, with the other causes of anovulation and androgen excess excluded.",
      },
      {
        type: "mcq",
        stem: "What is the mechanism by which polycystic ovary syndrome raises the risk of endometrial cancer?",
        options: [
          "By raising the pituitary gonadotropins, which act directly on the endometrium",
          "By anovulatory cycles of unopposed oestrogen, which proliferate the endometrium without the shed induced by progesterone",
          "By obesity alone, which is not a risk factor for endometrial cancer",
          "By the associated insulin resistance, which has no role",
        ],
        correctIndex: 1,
        explanation: "Unopposed oestrogen thickens the endometrium without the opposing withdrawal, causing hyperplasia, and the risk is reduced by the use of a hormonal method that regularises the cycles.",
      },
      {
        type: "mcq",
        stem: "Which is the first-line treatment of primary dysmenorrhoea?",
        options: [
          "A gonadotropin-releasing hormone analogue",
          "A non-steroidal anti-inflammatory drug, which inhibits prostaglandin synthesis",
          "A levonorgestrel intrauterine system",
          "Empiric antibiotics",
        ],
        correctIndex: 1,
        explanation: "The pain comes from the prostaglandins of the shedding endometrium, so an inhibitor of prostaglandin synthesis is the first-line treatment, with hormonal suppression as the alternative.",
      },
      {
        type: "mcq",
        stem: "Which is the most effective treatment for the pain of endometriosis?",
        options: [
          "Regular non-steroidal anti-inflammatory drugs only",
          "Suppression of the menstrual cycle with hormonal treatment, and laparoscopic excision or ablation of the deposits where the pain is refractory",
          "Ultrasound and reassurance",
          "Uterine artery embolisation",
        ],
        correctIndex: 1,
        explanation: "The ectopic tissue responds to the cycle, so the aim is to suppress it with hormonal methods; surgery removes the deposits when the pain persists.",
      },

      { type: "heading", level: 2, text: "Module summary and next" },
      {
        type: "paragraph",
        text: "The commonest gynaecological disorders of the reproductive years all modify or disturb the menstrual cycle. Primary dysmenorrhoea is the pain of prostaglandins in a normal uterus and responds to an inhibitor of their synthesis; secondary dysmenorrhoea means pathology. Endometriosis is ectopic endometrium responding to the cycle, causing cyclical pain, dyspareunia and infertility, and treated by suppressing the cycle. Polycystic ovary syndrome is the commonest endocrine disorder of reproductive women, with ovulatory, androgenic and metabolic features, and the management restores a regular shedding of the endometrium and treats the symptom that matters most to the patient.",
      },
      {
        type: "paragraph",
        text: "Next module: the physiology of pregnancy and antenatal care — where the anatomy and the cycles you have learned produce the clinical assessment of a pregnant woman.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Module 1 SBA items — one per concept, authored and machine-checked.
// ---------------------------------------------------------------------------
const MODULE_ONE_SBAS: SbaSeed[] = [
  {
    slug: "obstetrics-gynaecology--female-anatomy--sba",
    concept: "female-anatomy",
    stem: "In a hysterectomy, which structure is at risk when the uterine artery is clamped?",
    options: [
      "The ureter, which passes under the uterine artery near the lateral fornix of the vagina",
      "The femoral nerve, which passes under the uterine artery",
      "The inferior mesenteric artery",
      "The obturator nerve, which passes over it",
    ],
    correctAnswer: "The ureter, which passes under the uterine artery near the lateral fornix of the vagina",
    explanation:
      "The uterine artery runs from the internal iliac across the ureter in its course to the uterus, so the ureter is at risk when the artery is ligated during a hysterectomy or a caesarean section.",
    difficulty: "medium",
  },
  {
    slug: "obstetrics-gynaecology--menstrual-cycle--sba",
    concept: "menstrual-cycle",
    stem: "What triggers the surge of luteinizing hormone that causes ovulation?",
    options: [
      "A fall in oestrogen below a threshold",
      "A sustained rise in oestrogen above a threshold, which switches the pituitary to positive feedback",
      "A rise in progesterone from the corpus luteum",
      "A fall in follicle-stimulating hormone",
    ],
    correctAnswer: "A sustained rise in oestrogen above a threshold, which switches the pituitary to positive feedback",
    explanation:
      "Oestrogen sustained above a threshold and for about 50 hours switches the pituitary's response from negative to positive feedback, accelerating luteinizing hormone release and producing the surge that releases the oocyte.",
    difficulty: "medium",
  },
  {
    slug: "obstetrics-gynaecology--puberty-menopause--sba",
    concept: "puberty-menopause",
    stem: "A 52-year-old woman has had amenorrhoea for 14 months, hot flushes and vaginal dryness. Which statement is correct?",
    options: [
      "She is post-menopausal and should be given a single dose of hormone replacement therapy to 'treat' the menopause",
      "She is post-menopausal; the fall in oestrogen causes the vasomotor symptoms and the urogenital atrophy, and treatment is a decision about her symptoms and risk profile",
      "She should have her follicle-stimulating hormone level measured at a single visit to make the diagnosis",
      "She should be advised that her symptoms will stop within a year of the menopause",
    ],
    correctAnswer:
      "She is post-menopausal; the fall in oestrogen causes the vasomotor symptoms and the urogenital atrophy, and treatment is a decision about her symptoms and risk profile",
    explanation:
      "The menopause is defined retrospectively after twelve months of amenorrhoea, and it is the fall in oestrogen that produces the vasomotor and urogenital symptoms. Hormone replacement is a deliberate decision about symptoms against risk, not an automatic treatment of the menopause.",
    difficulty: "hard",
  },
  {
    slug: "obstetrics-gynaecology--contraception--sba",
    concept: "contraception",
    stem: "Which contraceptive method has the lowest typical-use failure rate?",
    options: [
      "The combined oral contraceptive pill",
      "The progestogen implant",
      "The male condom",
      "The contraceptive patch",
    ],
    correctAnswer: "The progestogen implant",
    explanation:
      "The long-acting reversible methods do not depend on the patient's adherence and have a failure rate of well under one per cent per year. A pill, patch or ring depends on daily or weekly adherence, and a condom has a failure rate of about 13 to 21 per cent per year.",
    difficulty: "easy",
  },
  {
    slug: "obstetrics-gynaecology--infertility--sba",
    concept: "infertility",
    stem: "How long must a couple have been trying to conceive before they are defined as infertile?",
    options: ["6 months", "12 months", "24 months", "36 months"],
    correctAnswer: "12 months",
    explanation:
      "Infertility is the failure to conceive after twelve months of regular, unprotected intercourse, and the interval is shortened if the woman is 35 or older or if a cause such as anovulation or previous tubal infection is obvious.",
    difficulty: "easy",
  },
  {
    slug: "obstetrics-gynaecology--menstrual-disorders--sba",
    concept: "menstrual-disorders",
    stem: "Which two of the following are criteria for a diagnosis of polycystic ovary syndrome?",
    options: [
      "Oligo- or anovulation, clinical or biochemical androgen excess, and polycystic ovarian morphology",
      "Obesity, amenorrhoea and a raised prolactin",
      "Hirsutism and galactorrhoea",
      "Endometriosis and dysmenorrhoea",
    ],
    correctAnswer: "Oligo- or anovulation, clinical or biochemical androgen excess, and polycystic ovarian morphology",
    explanation:
      "The diagnosis needs two of three features — ovulatory dysfunction, androgen excess and polycystic ovarian morphology — with other causes of anovulation and androgen excess excluded. Obesity and insulin resistance are common associations but they are not diagnostic criteria.",
    difficulty: "medium",
  },
];

// ---------------------------------------------------------------------------
// Deeper modules 2-5: a real concept spine, tracked-placeholder lessons.
// ---------------------------------------------------------------------------
const DEEPER_LESSONS: LessonSeed[] = [
  // --- M2 Pregnancy & antenatal care ---
  { title: "Fertilisation, implantation & the placenta", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Fertilisation, implantation and the placenta", slug: "fertilisation-placentation", summary: "The processes from fertilisation to implantation in the first two weeks, and the structure and function of the placenta.", blooms: "understand", minutes: 40, prereq: ["menstrual-cycle"] }, content: { blocks: [] } },
  { title: "Physiology of pregnancy", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Maternal physiology in pregnancy", slug: "maternal-physiology", summary: "The cardiovascular, respiratory, haematological, endocrine and renal changes of pregnancy and the reasons for them.", blooms: "analyze", minutes: 40, prereq: ["fertilisation-placentation"] }, content: { blocks: [] } },
  { title: "Antenatal care & assessment", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Antenatal care and assessment of the pregnant woman", slug: "antenatal-care", summary: "The schedule of visits, the assessment of gestational age, the interpretation of the investigations, and the screening programme.", blooms: "apply", minutes: 40, prereq: ["maternal-physiology"] }, content: { blocks: [] } },
  { title: "Nutrition, medication & lifestyle in pregnancy", module: 2, estimatedMinutes: 35, authored: false, concept: { title: "Nutrition, medication and lifestyle in pregnancy", slug: "pregnancy-nutrition-medication", summary: "Folic acid and the supplementation, the teratogenic drugs to avoid, the exercise and alcohol advice, and the weight gain of pregnancy.", blooms: "apply", minutes: 35, prereq: ["antenatal-care"] }, content: { blocks: [] } },
  { title: "Prenatal diagnosis & fetal monitoring", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Prenatal diagnosis and fetal monitoring", slug: "prenatal-diagnosis", summary: "The screening tests and their interpretation, amniocentesis and chorionic villus sampling, and the methods of monitoring the fetus.", blooms: "analyze", minutes: 40, prereq: ["antenatal-care"] }, content: { blocks: [] } },
  { title: "Labour, delivery & the normal puerperium", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Labour, delivery and the puerperium", slug: "normal-labour-puerperium", summary: "The stages of labour, the mechanism of vaginal delivery, the management of the third stage, and the postpartum recovery.", blooms: "apply", minutes: 40, prereq: ["maternal-physiology"] }, content: { blocks: [] } },

  // --- M3 Labour, delivery & puerperium ---
  { title: "The mechanism of normal labour", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Mechanism of normal labour", slug: "mechanism-of-labour", summary: "Engagement, descent, flexion, internal rotation, extension and restitution, and the pelves of labour.", blooms: "apply", minutes: 40, prereq: ["normal-labour-puerperium"] }, content: { blocks: [] } },
  { title: "Monitoring labour & fetal distress", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Monitoring labour and fetal distress", slug: "monitoring-labour", summary: "The assessment of contractions and progress, the interpretation of the CTG, and the management of fetal distress.", blooms: "apply", minutes: 40, prereq: ["mechanism-of-labour"] }, content: { blocks: [] } },
  { title: "Induction, augmentation & assisted delivery", module: 3, estimatedMinutes: 35, authored: false, concept: { title: "Induction, augmentation and assisted delivery", slug: "induction-assisted-delivery", summary: "Indications for induction, the agents used, and the indications and complications of ventouse and forceps.", blooms: "apply", minutes: 35, prereq: ["mechanism-of-labour"] }, content: { blocks: [] } },
  { title: "Caesarean section", module: 3, estimatedMinutes: 35, authored: false, concept: { title: "Caesarean section", slug: "caesarean-section", summary: "Indications, the technique and anaesthesia, and the immediate and longer-term consequences.", blooms: "apply", minutes: 35, prereq: ["induction-assisted-delivery"] }, content: { blocks: [] } },
  { title: "The puerperium & postpartum problems", module: 3, estimatedMinutes: 35, authored: false, concept: { title: "The puerperium and its problems", slug: "puerperium-problems", summary: "The normal recovery, postpartum haemorrhage, infection, thromboembolism and the psychiatric disorders of the puerperium.", blooms: "apply", minutes: 35, prereq: ["normal-labour-puerperium"] }, content: { blocks: [] } },
  { title: "Jaundice & newborn care", module: 3, estimatedMinutes: 30, authored: false, concept: { title: "Breastfeeding and neonatal care of the newborn", slug: "breastfeeding-newborn", summary: "The physiology of breastfeeding, the common problems, the treatment of jaundice, and the first examination of the newborn.", blooms: "apply", minutes: 30, prereq: ["puerperium-problems"] }, content: { blocks: [] } },

  // --- M4 Obstetric complications ---
  { title: "Haemorrhage in obstetrics", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Obstetric haemorrhage", slug: "obstetric-haemorrhage", summary: "Antepartum haemorrhage, placenta praevia and abruption, and postpartum haemorrhage: recognition and management.", blooms: "apply", minutes: 45, prereq: ["normal-labour-puerperium", "maternal-physiology"] }, content: { blocks: [] } },
  { title: "Hypertensive disease & pre-eclampsia", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Hypertension in pregnancy", slug: "pre-eclampsia-eclampsia", summary: "Gestational hypertension, pre-eclampsia and eclampsia, their detection and their management.", blooms: "apply", minutes: 40, prereq: [] }, content: { blocks: [] } },
  { title: "Preterm labour & premature rupture", module: 4, estimatedMinutes: 35, authored: false, concept: { title: "Preterm labour and premature rupture of membranes", slug: "preterm-labour", summary: "The diagnosis and management of threatened and established preterm labour, and the use of corticosteroids and tocolytics.", blooms: "apply", minutes: 35, prereq: [] }, content: { blocks: [] } },
  { title: "Malpresentation & abnormal labour", module: 4, estimatedMinutes: 35, authored: false, concept: { title: "Breech, malpresentation and abnormal labour", slug: "malpresentation-abnormal-labour", summary: "Breech and other malpresentations, breech delivery and external cephalic version, and the disorders of progress.", blooms: "apply", minutes: 35, prereq: ["mechanism-of-labour"] }, content: { blocks: [] } },
  { title: "Medical complications of pregnancy", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Medical disorders in pregnancy", slug: "medical-disorders-pregnancy", summary: "Diabetes, cardiac, renal, hepatic, haematological, infective and endocrine disease in pregnancy.", blooms: "apply", minutes: 45, prereq: ["maternal-physiology"] }, content: { blocks: [] } },
  { title: "Maternal mortality & clinical skills", module: 4, estimatedMinutes: 30, authored: false, concept: { title: "Maternal mortality and clinical skills", slug: "maternal-mortality-skills", summary: "The commonest causes of maternal death, the risk factors, and the management of maternal collapse and the neonatal resuscitation.", blooms: "apply", minutes: 30, prereq: [] }, content: { blocks: [] } },

  // --- M5 Gynaecological disorders & oncology ---
  { title: "Abnormal uterine bleeding", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Abnormal uterine bleeding", slug: "abnormal-uterine-bleeding", summary: "The causes of heavy, irregular and intermenstrual bleeding, the investigation and the medical and surgical treatments.", blooms: "apply", minutes: 35, prereq: ["menstrual-disorders"] }, content: { blocks: [] } },
  { title: "Fibroids, polyps & adenomyosis", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Benign uterine disease", slug: "benign-uterine-disease", summary: "Uterine fibroids, endometrial polyps and adenomyosis, their sites and symptoms, and their treatment options.", blooms: "apply", minutes: 35, prereq: ["abnormal-uterine-bleeding"] }, content: { blocks: [] } },
  { title: "Prolapse & urinary incontinence", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Pelvic organ prolapse and incontinence", slug: "prolapse-incontinence", summary: "The causes and the staging of prolapse, the conservative and surgical treatments, and the types of urinary incontinence.", blooms: "apply", minutes: 35, prereq: ["female-anatomy"] }, content: { blocks: [] } },
  { title: "Cervical cancer & screening", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Cervical screening and cancer", slug: "cervical-screening-cancer", summary: "Human papillomavirus and the natural history of cervical disease, the screening programme, and staging, treatment and prevention.", blooms: "apply", minutes: 40, prereq: ["female-anatomy"] }, content: { blocks: [] } },
  { title: "Endometrial & ovarian cancer", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Endometrial and ovarian cancer", slug: "endometrial-ovarian-cancer", summary: "The epidemiology, presentation, investigation, staging and treatment of the endometrial and the ovarian cancers.", blooms: "apply", minutes: 45, prereq: ["cervical-screening-cancer"] }, content: { blocks: [] } },
  { title: "Vulval & vaginal disease, sexual health", module: 5, estimatedMinutes: 30, authored: false, concept: { title: "Vulval, vaginal and sexual health problems", slug: "vulval-vaginal-sexual-health", summary: "Vulval dermatoses, vaginal discharge and infection, sexual dysfunction, and the gynaecology of a survivor of abuse.", blooms: "apply", minutes: 30, prereq: ["female-anatomy"] }, content: { blocks: [] } },
];

export const OBSTETRICS_GYNAECOLOGY: SubjectSeed = {
  id: "course-obgyn",
  slug: "obstetrics-gynaecology",
  title: "Obstetrics & Gynaecology — Women's Health",
  code: "OBGY 302",
  department: "Obstetrics & Gynaecology",
  level: 300,
  credits: 4,
  semester: "second",
  description:
    "Women's health across the lifespan: the anatomy and physiology of the female reproductive tract, the menstrual cycle, contraception and infertility; the physiology and the course of pregnancy and its complications; and the gynaecological disorders and cancers.",
  faculty: "clinical-medicine",
  modules: MODULES,
  lessons: [
    { title: "Anatomy of the female reproductive tract", module: 1, estimatedMinutes: 35, authored: true, concept: { title: "Anatomy of the female reproductive tract", slug: "female-anatomy", summary: "The uterus, tubes, ovaries and vagina, the vascular and lymphatic relations, the supports of the uterus and the pelvic floor.", blooms: "understand", minutes: 35, prereq: [] }, content: lesson1() as never },
    { title: "The menstrual cycle", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "The menstrual cycle", slug: "menstrual-cycle", summary: "The hormonal sequence from the hypothalamus through the pituitary to the ovaries, the phases of the cycle and the endometrium, and the basis of the abnormalities of bleeding.", blooms: "analyze", minutes: 40, prereq: ["female-anatomy"] }, content: lesson2() as never },
    { title: "Puberty, the menopause & assessment in OBGYN", module: 1, estimatedMinutes: 35, authored: true, concept: { title: "Puberty, the menopause and gynaecological assessment", slug: "puberty-menopause", summary: "The onset and the end of reproductive life, the consequences of oestrogen deficiency, the structured assessment with a chaperone, and the red-flag presentations.", blooms: "apply", minutes: 35, prereq: ["menstrual-cycle"] }, content: lesson3() as never },
    { title: "Contraception", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Contraception", slug: "contraception", summary: "Methods classified by mechanism and by duration, the failure rates, the contraindications to the combined pill, and emergency contraception.", blooms: "apply", minutes: 40, prereq: ["menstrual-cycle"] }, content: lesson4() as never },
    { title: "Infertility & subfertility", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Infertility and subfertility", slug: "infertility", summary: "The definition and its timing, the causes, the initial investigations of both partners, and the place of ovulation induction and assisted reproduction.", blooms: "apply", minutes: 40, prereq: ["contraception", "puberty-menopause"] }, content: lesson5() as never },
    { title: "Menstrual disorders: dysmenorrhoea, endometriosis & PCOS", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Menstrual disorders: dysmenorrhoea, endometriosis and polycystic ovary syndrome", slug: "menstrual-disorders", summary: "Primary and secondary dysmenorrhoea, the endometriotic implantation and its treatment, and the diagnosis and consequences of PCOS.", blooms: "apply", minutes: 40, prereq: ["infertility"] }, content: lesson6() as never },
    ...DEEPER_LESSONS,
  ],
  sbas: MODULE_ONE_SBAS,
  prereqCourses: [
    "gross-anatomy-i",
    "physiology-cell-and-general",
    "medical-biochemistry-i",
  ],
};

export async function seedMbbsObstetricsGynaecology() {
  return seedMbbsCourse(OBSTETRICS_GYNAECOLOGY);
}

/** Idempotent: safe to run repeatedly; upserts on stable keys. */
export async function seedObstetricsGynaecology(): Promise<void> {
  await seedMbbsObstetricsGynaecology();
}

export default OBSTETRICS_GYNAECOLOGY;

// CLI usage: npx ts-node prisma/seed-courses/mbbs/obstetrics-gynecology.ts
if (process.argv[1] && process.argv[1].includes("mbbs/obstetrics-gynecology")) {
  seedObstetricsGynaecology()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}

