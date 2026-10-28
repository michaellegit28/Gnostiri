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
// LESSON 7 — Antenatal care and assessment of the pregnant woman
// ---------------------------------------------------------------------------
function lesson7() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the schedule of antenatal appointments and what is assessed at each one; calculate gestational age from the last menstrual period and from ultrasound, and define preterm, term and post-term birth; list the investigations offered at booking and say what each detects; interpret the routine screening tests for fetal abnormality; describe how fetal growth and well-being are monitored in the third trimester; and recognise the symptoms in pregnancy that demand urgent rather than routine review.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-6 for the anatomy and endocrinology of reproduction, and PHYS 101 for the cardiovascular physiology that underlies the blood pressure. Antenatal care applies the physiology of pregnancy, which is developed in the next lesson.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Antenatal care",
        text: "The structured, repeated assessment of a pregnant woman and her fetus from booking to delivery: a schedule of visits that screens for disease, monitors the growth and well-being of the fetus, offers diagnostic testing, and prepares the woman physically and psychologically for birth and for parenthood.",
      },
      {
        type: "paragraph",
        text: "The unifying idea is that antenatal care is screening, not treatment. A healthy pregnancy is the rule and complications are rare, so the whole schedule exists to detect the few deviations that change the outcome — hypertension, fetal growth restriction, malpresentation, anaemia, infection, gestational diabetes and fetal abnormality — at the point when acting on them still helps.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Antenatal care is a programme of shared decision making: the woman chooses which tests she accepts, and every screening test needs an explanation of what a positive result means, what happens next, and what choice it creates.",
      },

      { type: "heading", level: 2, text: "The schedule of appointments" },
      {
        type: "table",
        headers: ["Appointment", "What is done"],
        rows: [
          ["8+0 to 10+0 — booking", "Full history, risk assessment and plan of care; the booking blood tests; folic acid and vitamin D advice; information about the screening programme"],
          ["10 to 13+6 — the dating scan", "Crown-rump length for gestational age, viability and the number of fetuses, with nuchal translucency for the screening test"],
          ["16 weeks", "Blood pressure, urinalysis, fundal height and fetal heart; review of the booking results; assessment for anaemia"],
          ["18+0 to 20+6", "The fetal anomaly scan; blood pressure, urinalysis and fundal height"],
          ["25 to 28 weeks", "Blood pressure, urinalysis, fundal height and fetal heart; testing for diabetes in women with risk factors; anti-D immunoglobulin after any sensitising event"],
          ["31 to 34 weeks", "Routine checks; an ultrasound to assess growth where the fetus is at risk; abdominal palpation for presentation; the plan for labour, analgesia and the place of birth"],
          ["36 weeks", "Presentation confirmed; blood pressure, urinalysis and fetal heart; the blood group and antibodies reviewed; discussion of induction where indicated"],
          ["38 to 41 weeks", "Weekly review; blood pressure, urinalysis, fetal movements and growth; membrane sweeping offered; induction planned for 40 to 41 weeks"],
          ["Postnatal, 6 to 8 weeks", "Maternal recovery, feeding, contraception, and the baby's growth and development"],
        ],
      },
      {
        type: "paragraph",
        text: "The pattern behind the dates is what to remember rather than the list itself: every four weeks to 28 weeks, every two weeks to 36 weeks, then weekly to delivery, with a primigravida seen more often than a parous woman. Two periods are not negotiable — booking, because almost every screening decision is made then, and the third trimester, because hypertension and fetal growth restriction appear for the first time late.",
      },

      { type: "heading", level: 2, text: "What is checked at every visit" },
      {
        type: "table",
        headers: ["Assessment", "How it is done", "What it is looking for"],
        rows: [
          ["Blood pressure", "Measured and recorded at every appointment", "Pregnancy-induced and pre-existing hypertension; a rise after 20 weeks is often the first sign of pre-eclampsia"],
          ["Urinalysis", "Dipstick for protein, glucose and blood, with culture if there are symptoms or the dipstick is abnormal", "Proteinuria with hypertension is pre-eclampsia; glycosuria prompts testing for gestational diabetes; culture detects bacteriuria"],
          ["Symphysis-fundal height", "The distance from the pubic symphysis to the uterine fundus, measured and plotted from 24 weeks", "A measurement 3 cm or more from the expected suggests fetal growth restriction, macrosomia, multiple pregnancy or wrong dates, and prompts a scan"],
          ["Fetal heart", "Auscultated or detected with a handheld Doppler", "Fetal well-being; a rate persistently outside 110 to 160 beats per minute needs assessment"],
          ["Presentation", "Abdominal palpation from 36 weeks", "Breech or transverse lie, which may need external version or a planned caesarean section"],
          ["Fetal movements", "Asked about from 24 weeks", "Reduced movements can precede fetal death and demand same-day assessment"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Symphysis-fundal height is a screen, not a diagnostic test. A normal measurement does not exclude fetal growth restriction, and an abnormal one only prompts an ultrasound — the diagnosis is made by measuring the abdominal circumference and the estimated weight.",
      },

      { type: "heading", level: 2, text: "Worked example: gestational age" },
      {
        type: "paragraph",
        text: "Gestational age is calculated as 280 days (40 weeks) from the first day of the last normal menstrual period — the rule known as Naegele's: add one year and seven days, then subtract three months. It assumes a regular 28-day cycle with ovulation on day 14, and it is unreliable when cycles are irregular, when conception occurred during lactation or within three months of a previous pregnancy, and after recent hormonal contraception. Ultrasound is the reliable method: the crown-rump length between 8 and 13+6 weeks dates the pregnancy to within five to seven days, and a scan at 18 to 20 weeks agrees within seven to ten days.",
      },
      {
        type: "table",
        headers: ["Term used", "Definition", "Why it matters"],
        rows: [
          ["Preterm birth", "Birth before 37+0 weeks", "Almost all of the morbidity of neonatal medicine lies here; labour is managed with corticosteroids and, where appropriate, tocolysis"],
          ["Early term", "37+0 to 38+6", "Elective birth before 39 weeks is avoided unless there is an obstetric indication"],
          ["Full term", "39+0 to 40+6", "The optimal window for birth"],
          ["Late term", "41+0 to 41+6", "Induction of labour is offered to reduce perinatal mortality"],
          ["Post-term", "42+0 weeks and later", "Perinatal mortality rises: membranes are swept and induction is offered"],
        ],
      },
      {
        type: "paragraph",
        text: "Correct gestational age is not bookkeeping. Every later decision — whether to give corticosteroids, whether to arrest labour, whether a liquor volume is low, whether a growth measurement means growth restriction — depends on the age from which it is made, and a wrongly dated pregnancy causes the wrong obstetric decision.",
      },

      { type: "heading", level: 2, text: "Booking investigations" },
      {
        type: "table",
        headers: ["Investigation", "What it detects", "Action if abnormal"],
        rows: [
          ["Full blood count", "Anaemia: haemoglobin below about 105 g/L in the first trimester and below 110 g/L in the second and third", "Dietary advice and iron; transfusion only when symptomatic or profoundly anaemic"],
          ["ABO and rhesus group with an antibody screen", "Rhesus-negative women, atypical antibodies, and any existing sensitisation", "Anti-D immunoglobulin after a sensitising event and after the birth of a rhesus-positive baby; specialist referral if antibodies are present"],
          ["Haemoglobinopathy screen", "Sickle cell disease and thalassaemia trait", "Partner testing, referral for genetic counselling, and diagnostic testing of the fetus"],
          ["Rubella immunity", "Non-immune women", "Avoid contact with a rash illness and vaccinate after the birth; the risk is congenital rubella syndrome in the first trimester"],
          ["Hepatitis B, HIV and syphilis serology", "Maternal infection with a risk of vertical transmission", "Antiviral treatment in pregnancy, planned neonatal immunisation and specialist referral; HIV treatment reduces transmission to under one per cent"],
          ["Urine culture", "Asymptomatic bacteriuria", "Treat, to prevent pyelonephritis and preterm birth"],
          ["Oral glucose tolerance test where indicated", "Gestational diabetes", "Diet, metformin or insulin, and increased surveillance of growth and fetal well-being"],
          ["Cervical screening status", "An overdue smear", "Deferred until after the birth unless there is a clinical indication"],
        ],
      },

      { type: "heading", level: 2, text: "Screening and diagnosis for fetal abnormality" },
      {
        type: "table",
        headers: ["Test", "Gestational age", "What it screens"],
        rows: [
          ["Combined test: nuchal translucency, free beta-hCG, PAPP-A and maternal age", "11+0 to 13+6", "Down's syndrome and trisomy 18, with about an 85 per cent detection rate; a positive result is a risk, not a diagnosis"],
          ["Cell-free DNA screening", "From 10 weeks", "Down's syndrome, with a detection rate of about 99 per cent; still a screening test, confirmed by amniocentesis or chorionic villus sampling"],
          ["Fetal anomaly scan", "18+0 to 20+6", "Anencephaly, open spina bifida, cleft lip, diaphragmatic hernia, gastroschisis, exomphalos, serious cardiac abnormalities, bilateral renal agenesis, lethal skeletal dysplasia, and Edwards' and Patau's syndromes"],
          ["Fetal growth scan", "24 weeks onwards where indicated", "Estimated weight, abdominal circumference, amniotic fluid volume and umbilical artery Doppler"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "A screening test does not diagnose; it sorts women into high and low risk so that a much smaller group receives a diagnostic test. Because the prevalence is low, most positive screens are false positives, and what happens next depends on the counselling given before the blood was taken.",
      },

      { type: "heading", level: 2, text: "Clinical correlation: what to judge urgently" },
      {
        type: "table",
        headers: ["Presentation", "Concern", "First action"],
        rows: [
          ["Bleeding from the genital tract", "Placenta praevia, abruption or cervical disease", "Assess maternal circulation and the fetal heart, and localise the placenta by ultrasound before any vaginal examination"],
          ["Reduced fetal movements", "Fetal compromise", "Cardiotocography and assessment of growth and amniotic fluid, the same day"],
          ["Severe or persistent headache with visual disturbance", "Pre-eclampsia with cerebral involvement", "Blood pressure, urinalysis and full blood count; same-day assessment"],
          ["Persistent abdominal pain", "Abruption, a degenerating fibroid, or a non-obstetric cause", "Site of pain and uterine tenderness, the fetal heart, and ultrasound"],
          ["Fluid leaking from the vagina", "Rupture of the membranes, preterm or at term", "Sterile speculum examination and cardiotocography"],
          ["Itching without a rash, especially on the palms and soles", "Intrahepatic cholestasis of pregnancy", "Bile acids and liver function"],
        ],
      },
      {
        type: "question",
        prompt: "Why is the dating measurement the most important number on the booking report?",
        answer: "Because it is the reference against which every later obstetric decision is made: whether corticosteroids are indicated, whether tocolysis is safe, whether a growth measurement is small, and whether a birth is preterm, term or post-term. A wrongly dated pregnancy therefore produces the wrong decision.",
        explanation: "The crown-rump length at 11 to 13+6 weeks is accepted as the best estimate, and where it differs from the menstrual dates by more than a week the scan dates are used.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the dating scan uses the biparietal diameter. The crown-rump length is used between 8 and 13+6 weeks and is the most accurate; the biparietal diameter afterwards and the femur length later still, are progressively less so.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying proteinuria must be present to diagnose pre-eclampsia. It is no longer required: hypertension after 20 weeks plus any maternal organ dysfunction is enough, and many women with pre-eclampsia have no urinary protein at all.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "How is gestational age calculated, and which method is the most accurate?",
        answer: "By adding 280 days to the first day of the last menstrual period, assuming a regular 28-day cycle. The crown-rump length on ultrasound between 8 and 13+6 weeks is the most accurate measurement, agreeing within five to seven days, and it supersedes the menstrual dates when the two disagree.",
        explanation: "Menstrual dating depends on the exact day of ovulation, which is only known in a perfectly regular cycle; ultrasound dates the pregnancy from the size of the fetus.",
      },
      {
        type: "question",
        prompt: "Which investigations are offered at booking, and what do they detect?",
        answer: "Full blood count for anaemia; ABO and rhesus group with an antibody screen; haemoglobinopathy screen; rubella, hepatitis B, HIV and syphilis serology; urine culture; and a glucose tolerance test where indicated.",
        explanation: "The list is dominated by two categories of disease: the anaemic and inherited disorders of the mother, and the infections that reach the fetus.",
      },
      {
        type: "question",
        prompt: "What does an abnormal symphysis-fundal height measurement mean, and what follows it?",
        answer: "A measurement 3 cm or more different from the expected for the gestational age prompts a growth ultrasound to measure the abdominal circumference and the estimated weight. On its own the measurement is a screen and does not diagnose fetal growth restriction.",
        explanation: "The fundus advances at roughly one centimetre a week from 24 weeks; a measurement that lags or exceeds suggests growth restriction, macrosomia, multiple pregnancy or wrong dates.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which measurement is used to date a pregnancy at the first antenatal visit?",
        options: [
          "The crown-rump length, which dates the pregnancy to within five to seven days",
          "The biparietal diameter, which is accurate to within two days",
          "The femur length, which dates the pregnancy to within ten days",
          "The head circumference, which is used at all gestations",
        ],
        correctIndex: 0,
        explanation: "The crown-rump length between 8 and 13+6 weeks is the most accurate dating measurement, agreeing to within about five to seven days of true gestational age; the other measurements come later and are progressively less precise.",
      },
      {
        type: "mcq",
        stem: "A birth at 38+2 weeks is best described as which of the following?",
        options: ["Preterm birth", "Early term", "Full term", "Post-term"],
        correctIndex: 2,
        explanation: "Full term is 39+0 to 40+6 weeks. Preterm is before 37+0, early term is 37+0 to 38+6, late term is 41+0 to 41+6, and post-term is 42+0 weeks or later.",
      },
      {
        type: "mcq",
        stem: "Which booking blood test identifies the women who require anti-D immunoglobulin?",
        options: [
          "The full blood count",
          "The ABO and rhesus group with an antibody screen",
          "Rubella serology",
          "Hepatitis B surface antigen",
        ],
        correctIndex: 1,
        explanation: "Anti-D is given to rhesus-negative women, and the group and antibody screen identifies both them and the women who are already sensitised; it is administered after any sensitising event and after the birth of a rhesus-positive baby.",
      },
      {
        type: "mcq",
        stem: "A woman at 34 weeks reports that the baby has not moved as much today. What is the correct response?",
        options: [
          "Reassure her that fetal movements reduce in the third trimester",
          "Assess her with cardiotocography and an ultrasound the same day",
          "Ask her to return at her next routine appointment in two weeks",
          "Admit her for immediate induction of labour",
        ],
        correctIndex: 1,
        explanation: "Reduced fetal movements can precede fetal death and are investigated the same day with a cardiotocograph and an assessment of growth and liquor. Movements do not normally reduce in the third trimester in a well fetus.",
      },
      {
        type: "mcq",
        stem: "At how many weeks of gestation is the fetal anomaly scan performed?",
        options: ["10 to 12+6", "14 to 16", "18 to 20+6", "24 to 26"],
        correctIndex: 2,
        explanation: "The anomaly scan is performed between 18+0 and 20+6 weeks, when the fetal anatomy is large enough to see and there is still enough amniotic fluid and room to image it.",
      },
      {
        type: "mcq",
        stem: "From what gestational age is symphysis-fundal height measured and plotted?",
        options: ["12 weeks", "18 weeks", "24 weeks", "32 weeks"],
        correctIndex: 2,
        explanation: "The fundus reaches the umbilicus at about 24 weeks and is measured and plotted from then, with a measurement 3 cm or more from the expected prompting an ultrasound assessment of growth.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Antenatal care is a screening schedule: appointments every four weeks to 28 weeks, every two weeks to 36, then weekly, with blood pressure, urinalysis, fundal height and the fetal heart checked at each one. Gestational age is dated by the crown-rump length in the first trimester and defines preterm, term and post-term birth. Booking investigations detect anaemia, rhesus status, haemoglobinopathy and the infections that reach the fetus; screening sorts women by risk and only a diagnostic test diagnoses; and the symptoms that demand urgent review are bleeding, reduced movements, headache with visual disturbance, abdominal pain and fluid loss.",
      },
      {
        type: "paragraph",
        text: "Next: the physiology of pregnancy — the changes that make the blood pressure, the blood volume and the renal function what they are, and the reason a pregnant woman can be well while carrying a fetus that depends on her for oxygen.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 8 — Labour, delivery and the normal puerperium
// ---------------------------------------------------------------------------
function lesson8() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define labour and describe the three stages with their duration; identify the latent and active phases of the first stage and the expected rate of cervical dilatation; describe the management and the duration of the second stage, including delivery of the head and shoulders; describe active and expectant management of the third stage and the signs of placental separation; describe the physiological changes of the puerperium; and recognise the point at which abnormal progress demands senior obstetric review.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (anatomy) and lesson 7 (antenatal care). The pelvic brim, the plane of least dimensions and the outlet are the fixed spaces through which the fetus must pass, and antenatal assessment is what identifies the fetus that will have difficulty passing through them.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Labour",
        text: "The physiological process by which the products of conception are expelled from the uterus: regular painful uterine contractions producing progressive cervical effacement and dilatation, with descent of the presenting part.",
      },
      {
        type: "paragraph",
        text: "Labour is defined by its effect, not by its symptoms, because a contraction is not labour. Painless tightenings without cervical change are Braxton Hicks contractions, and a show happens without labour. The definition matters because the first stage is a mechanical event that can be measured — how far the cervix has opened and how fast it is opening — and the rate of that measurement, not the intensity of the pain, defines progress.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Parturition is the transition from a uterus held quiescent by the progesterone block to one that contracts: a rising oestrogen-to-progesterone ratio, the increased expression of myometrial oxytocin receptors and gap junctions, and the release of fetal and placental corticotropin-releasing hormone.",
      },

      { type: "heading", level: 2, text: "The three stages" },
      {
        type: "table",
        headers: ["Stage", "Definition", "Features"],
        rows: [
          ["First stage", "Onset of labour to full dilatation of the cervix", "A latent phase of effacement and dilatation to 4 cm, which may last many hours, especially in a primigravida; then an active phase from 4 to 10 cm at roughly 0.5 to 1 cm per hour"],
          ["Second stage", "Full dilatation to the birth of the baby", "Passive (bearing down without pushing) then active (pushing); a primigravida may push for up to two hours and a parous woman for up to one, with an hour added if there is an epidural"],
          ["Third stage", "The birth of the baby to the delivery of the placenta", "The interval in which the placenta separates and is expelled, up to 30 to 60 minutes, and the uterus contracts to control the placental-site blood flow"],
        ],
      },
      {
        type: "paragraph",
        text: "The commonest error in this table is to treat the latent phase as a fixed interval of time. Its length varies enormously: the woman who is 2 cm dilated after twelve hours and who feels well is not in obstructed labour, whereas the woman who is 4 cm and not dilating after four hours is. The other is to confuse the phases of the first stage — cervical dilatation of 4 cm, not 10 cm, is the boundary between them, and only from 4 cm is the rate of about 0.5 to 1 cm per hour used to judge progress.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Progress is plotted on a partograph from the start of the active phase, and cervical dilatation of less than 2 cm in four hours in a primigravida, or less than 1 cm in four hours in a woman who has had a baby before, means delay in the first stage and a call for senior obstetric review.",
      },

      { type: "heading", level: 2, text: "Worked example: the second stage" },
      {
        type: "paragraph",
        text: "At full dilatation the mother is encouraged to bear down with each contraction as she feels the urge. The head flexes, descends and rotates to lie transversely in the pelvic cavity, then anteriorly under the pubic symphysis, and extends out through the introitus. With the next contraction the head restitutes — rotates back — as the shoulders rotate into the anteroposterior diameter of the outlet; the anterior shoulder is delivered first by directing the head downwards, and the posterior shoulder follows by lifting the head upwards. The baby is then dried, kept warm, and placed in skin-to-skin contact, and the cord is clamped and cut when it is safe to do so.",
      },
      {
        type: "table",
        headers: ["Event", "How it is managed"],
        rows: [
          ["The head distending the perineum", "Warm compresses and a hand on the head to control flexion and extension, so that the head is not born suddenly"],
          ["Impending perineal tear", "An episiotomy is cut, after infiltration of the perineum with local anaesthetic, where there is fetal distress, shoulder dystocia, a prolonged second stage, an instrumental delivery or a scarred perineum"],
          ["The first breath", "Assessment of tone, breathing, colour and heart rate, with the baby dried and placed on the mother's abdomen"],
          ["The shoulders", "Delivered with the next contraction: the anterior shoulder first, by directing the head downwards, then the posterior by lifting the head upwards"],
        ],
      },
      {
        type: "question",
        prompt: "Why does progress from full dilatation with pushing for more than two hours in a primigravida require review?",
        answer: "Because a second stage of that length in a nulliparous woman means the head has failed to descend and to rotate as expected, and the cause may be inadequate uterine power, inadequate pelvic dimensions, malposition of the head or fetal-pelvic disproportion. Senior obstetric review, an assessment of position and station, and a decision about operative delivery follow.",
        explanation: "The second stage is the stage of descent; if descent fails within the time available, the fetal head is compressed against the pelvis and fetal distress and maternal exhaustion follow.",
      },

      { type: "heading", level: 2, text: "Worked example: the third stage" },
      {
        type: "table",
        headers: ["Method", "What happens", "Notes"],
        rows: [
          ["Active management", "An intramuscular uterotonic (10 international units of oxytocin) is given as the anterior shoulder is delivered or immediately after the baby is born, the cord is clamped and cut, and the placenta is delivered by controlled cord traction while the uterus is supported from above", "It reduces the risk of postpartum haemorrhage from about 17 per cent to about 5 per cent and shortens the third stage"],
          ["Expectant management", "The signs of placental separation are awaited and the placenta is expelled by maternal effort, without a uterotonic", "Considered only where the risk of bleeding is low and the woman has been offered a choice"],
        ],
      },
      {
        type: "paragraph",
        text: "The three signs of placental separation are: the cord lengthens outside the vagina, a small gush of blood appears, and the uterus becomes firm and globular and rises above the umbilicus. After delivery the placenta is inspected and weighed, and its completeness and retroplacental surface are checked for a missing cotyledon or a succenturiate lobe, and the uterus is palpated to ensure that it stays firm.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Controlled cord traction is not traction on the cord. If the placenta has not separated, pulling the cord inverts the uterus; the manoeuvre is applied only after the cord has visibly lengthened, and always with counter-pressure above the symphysis.",
      },

      { type: "heading", level: 2, text: "The puerperium" },
      {
        type: "definition",
        term: "Puerperium",
        text: "The six to eight weeks after delivery, during which the reproductive tract returns to the non-pregnant state and, in the woman who breastfeeds, lactation is established.",
      },
      {
        type: "table",
        headers: ["Change", "What happens"],
        rows: [
          ["Involution of the uterus", "The fundus, at about the umbilicus immediately after delivery, falls at about a centimetre a day and cannot be palpated abdominally by 10 to 14 days"],
          ["Lochia", "Rubra (red, days 1 to 4), then serosa (pinkish, to about day 10), then alba (yellow-white, until about three weeks); a foul smell, a return of red lochia, or persisting bleeding beyond three weeks suggests infection or retained tissue"],
          ["Cervix and vagina", "The cervical os closes, the vaginal wall and vulva regain their tone, and the vagina takes several weeks to involute"],
          ["Lactation", "Colostrum for the first two to three days, then mature milk under prolactin, with ejection by oxytocin released by the infant's suckling"],
          ["Ovulation", "In the woman who does not breastfeed, ovulation returns by about 6 to 10 weeks; during lactation, prolactin suppresses gonadotropin-releasing hormone and anovulation is the rule while milk output is high"],
          ["Postnatal check", "At 6 to 8 weeks: maternal blood pressure and haemoglobin where indicated, perineal healing, mood, the baby's feeding and growth, and contraception"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The distinction between normal lochia rubra and a secondary postpartum haemorrhage or endometritis is made by the odour, the duration, and the presence of fever, uterine tenderness or a fundus that is tender and fails to fall.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the first stage begins at 4 cm. It begins with the onset of regular contractions producing cervical change; the latent phase precedes 4 cm and the active phase starts there. Conflating the two turns normal labour into obstructed labour.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the third stage can be indefinitely awaited. Where the third stage is prolonged beyond 30 minutes, or bleeding occurs, manual removal of the placenta by an experienced operator under anaesthesia is required.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a soft, boggy uterus after delivery of the placenta can be corrected by massaging the fundus alone. It needs a uterotonic as well, and if atony persists after the first drug the cause is more likely to be retained tissue, trauma or a coagulopathy than a harder rub.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What defines the first stage of labour, and what are its two phases?",
        answer: "It is the interval from the onset of labour to full dilatation of the cervix. The latent phase covers effacement and dilatation up to 4 cm, and the active phase runs from 4 to 10 cm at about 0.5 to 1 cm per hour.",
        explanation: "The first stage is the stage of dilatation, and its measurement — cervical dilatation and its rate — is what defines whether labour is normal.",
      },
      {
        type: "question",
        prompt: "What are the three signs of placental separation, and what is active management of the third stage?",
        answer: "The cord lengthens outside the vagina, a small gush of blood appears, and the uterus becomes firm, globular and rises above the umbilicus. Active management is the intramuscular uterotonic (10 international units of oxytocin) as the anterior shoulder is delivered, controlled cord traction, and clamping of the cord.",
        explanation: "Active management reduces the risk of postpartum haemorrhage from about 17 per cent to about 5 per cent, which is why it is offered for every woman unless the risk of bleeding is low and she chooses otherwise.",
      },
      {
        type: "question",
        prompt: "How long may a primigravida push in the second stage, and how does an epidural change this?",
        answer: "Up to two hours of active pushing, extended by an hour to three when she has an epidural; beyond those limits, a review of position, station and uterine power is required and operative delivery may be needed.",
        explanation: "The limitations exist because a second stage that is too long carries risks of fetal distress, maternal exhaustion and a difficult instrumental delivery.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which interval defines the second stage of labour?",
        options: [
          "From the onset of regular contractions to full dilatation of the cervix",
          "From full dilatation of the cervix to the birth of the baby",
          "From the birth of the baby to the delivery of the placenta",
          "From delivery of the placenta to the end of the first postnatal hour",
        ],
        correctIndex: 1,
        explanation: "The three stages are dilatation, expulsion of the fetus, and separation and delivery of the placenta. The second stage runs from full dilatation of the cervix to the birth of the baby.",
      },
      {
        type: "mcq",
        stem: "Which of the following is the active management of the third stage?",
        options: [
          "Waiting for the cord to lengthen and for the gush of blood before applying any traction",
          "An intramuscular uterotonic as the anterior shoulder is delivered, controlled cord traction, and clamping of the cord",
          "Rubbing up the fundus until the placenta is expelled without any drug",
          "An intravenous oxytocin infusion given as the head is born, then waiting for an hour",
        ],
        correctIndex: 1,
        explanation: "Active management consists of a uterotonic (10 international units of intramuscular oxytocin), controlled cord traction and clamping of the cord, and it reduces the risk of postpartum haemorrhage from about 17 per cent to about 5 per cent.",
      },
      {
        type: "mcq",
        stem: "Which set of signs indicates that the placenta has separated?",
        options: [
          "A sudden return of contractions, a bright loss, and the uterus rising in the abdomen",
          "Lengthening of the cord outside the vagina, a small gush of blood, and the uterus becoming firm and globular",
          "The fundus becoming soft above the symphysis and the bleeding stopping",
          "A sudden dull abdominal pain with a fundus at the umbilicus",
        ],
        correctIndex: 1,
        explanation: "The three classic signs are lengthening of the cord, a gush of blood, and a firm globular uterus that rises above the umbilicus. A soft fundus with continued bleeding is atony, not separation.",
      },
      {
        type: "mcq",
        stem: "At what rate does the postpartum uterus involute?",
        options: [
          "Immediately, so that it cannot be palpated at the end of labour",
          "About one centimetre a day, becoming impalpable abdominally by 10 to 14 days",
          "About one centimetre a week, returning to normal by ten weeks",
          "Only once lactation is established at one month",
        ],
        correctIndex: 1,
        explanation: "The fundus sits at about the umbilicus after delivery, falls roughly a centimetre a day, and cannot be felt abdominally by 10 to 14 days. A fundus that fails to fall, or that is tender, suggests retained tissue or infection.",
      },
      {
        type: "mcq",
        stem: "A primigravida in the active phase has progressed from 5 to 6 cm in four hours. What does this mean?",
        options: [
          "Normal progress, because one centimetre in four hours is the expected rate in a first labour",
          "Delay in the first stage, because less than two centimetres in four hours in a primigravida means slow labour and requires review",
          "Arrested labour, which can only be diagnosed once the cervix is fully dilated",
          "A normal latent phase, because the active phase only begins at eight centimetres",
        ],
        correctIndex: 1,
        explanation: "The expected rate of cervical dilatation in the active phase is about 0.5 to 1 cm per hour, so less than 2 cm in four hours in a nulliparous woman is delay in the first stage and an indication for amniotomy, oxytocin and senior review.",
      },
      {
        type: "mcq",
        stem: "What is lochia alba?",
        options: [
          "The red loss of the first four days after delivery",
          "The yellowish-white loss that follows the pinkish loss and lasts up to three weeks",
          "A purulent discharge that suggests endometritis",
          "The mucus loss mixed with blood that signals placental separation",
        ],
        correctIndex: 1,
        explanation: "Lochia passes through rubra (red, days 1 to 4), serosa (pinkish, to about day 10) and alba (yellow-white, up to three weeks). Foul-smelling lochia with fever suggests infection.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Labour is defined by progressive cervical change and is divided into dilatation, expulsion and separation of the placenta. The first stage passes through a latent phase to 4 cm and then an active phase at about 0.5 to 1 cm per hour; the second stage is the descent of the head and the delivery of shoulders; and the third stage is managed actively with a uterotonic and controlled cord traction once the signs of separation appear. The puerperium is a period of rapid involution, of lochial loss and, in the breastfeeding woman, of lactation.",
      },
      {
        type: "paragraph",
        text: "Next: the measurement of labour — the cardiotocograph, the fetal blood sample, and the interpretation of a trace, which is how the fetus tells the labour room that it is not coping.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 9 — Monitoring labour and fetal distress
// ---------------------------------------------------------------------------
function lesson9() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: choose between intermittent auscultation and continuous electronic monitoring for an individual woman; describe the four features of the cardiotocograph and their normal ranges; classify a trace as normal, suspicious or pathological; define early, variable and late decelerations and state what each implies; interpret a fetal blood sample and act on its result; and describe the immediate management of fetal distress, cord prolapse and uterine hyperstimulation.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 7 and 8. The fetus cannot speak, so this lesson is about reading the two signals it can send: the rate of its heart and the liquor it passes.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Fetal monitoring in labour",
        text: "The intermittent or continuous assessment of the fetal heart rate and of uterine contractions, used to detect hypoxia and to decide whether the fetus can tolerate continued labour or whether delivery must be expedited.",
      },
      {
        type: "paragraph",
        text: "The central idea is that fetal hypoxia is diagnosed indirectly, and that indirect measurement has a cost: the cardiotocograph is an imperfect test. It is abnormal for reasons that are not hypoxia — fetal sleep, prematurity, maternal opioids, congenital heart block — and it is normal in some fetuses that are hypoxic. The consequence is that an abnormal cardiotocograph must be refined by a fetal blood sample or by a clinical assessment, and that the interpretation of a trace leads to only one of three decisions: continue and observe, confirm with a fetal blood sample, or expedite delivery.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Intermittent auscultation is the correct method for a healthy woman with an uncomplicated labour, because it is as safe as a cardiotocograph for that group without triggering the cascade of intervention that follows continuous monitoring.",
      },

      { type: "heading", level: 2, text: "Worked example: the cardiotocograph and its four features" },
      {
        type: "table",
        headers: ["Feature", "Definition", "Normal", "Concerning"],
        rows: [
          ["Baseline rate", "The mean rate over five to ten minutes, excluding accelerations, decelerations and periods of markedly increased variability", "110 to 160 beats per minute", "Below 100 or above 180; a baseline drifting from 140 to 170 is an early warning"],
          ["Variability", "The beat-to-beat variation, best seen between contractions", "5 to 25 beats per minute", "Under 5 beats per minute for more than 90 minutes, or a sinusoidal pattern"],
          ["Accelerations", "Transient rises of 15 beats per minute lasting 15 seconds or more, usually with fetal movement", "Reassuring, and expected in a well fetus", "Their absence for more than 40 minutes before 40 weeks, or 90 minutes after, is a non-reassuring feature"],
          ["Decelerations", "Transient falls below the baseline", "Early and shallow decelerations with contractions are common and benign", "Late decelerations, variable decelerations lasting more than 60 seconds, or any prolonged deceleration over three minutes"],
        ],
      },
      {
        type: "paragraph",
        text: "The baseline rate, its variability, its accelerations and the shape and timing of its decelerations are read together, never separately. A baseline of 150 with a variability of 10 and accelerations is a normal trace in a sleeping fetus; a baseline of 150 with a variability under 5 and late decelerations is a hypoxic one, and the difference lies in the pattern around the number.",
      },

      { type: "heading", level: 2, text: "Decelerations" },
      {
        type: "table",
        headers: ["Type", "Shape and timing", "Meaning", "First action"],
        rows: [
          ["Early", "A mirror image of the contraction: it begins with the contraction and returns before the contraction is over, and it is shallow", "Head compression slowing the fetal heart through the vagus; common as the head descends", "Continue labour and observe"],
          ["Variable", "Abrupt and V-shaped, occurring with contractions but varying in shape, depth and timing", "Umbilical cord compression, from a short cord, a nuchal cord or cord prolapse", "Change the maternal position, give intravenous fluid, and examine for a prolapsed cord if the membranes are ruptured"],
          ["Late", "Begins after the contraction has started and does not return until the contraction has finished, typically shallow and U-shaped", "Uteroplacental insufficiency: the blood flow falls before the fetal heart responds", "Stop any oxytocin, lie the woman on her left side, give oxygen, and take a fetal blood sample or expedite delivery"],
          ["Prolonged", "A single deceleration lasting longer than three minutes", "Acute hypoxia: cord prolapse, abruption, uterine hyperstimulation or maternal hypotension", "Immediate obstetric review, examination for a prolapsed cord, and preparation for delivery"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "A tachysystolic uterus with decelerations after oxytocin is iatrogenic, and the first action is not a fetal blood sample: stop or reduce the infusion, correct the contraction frequency and re-evaluate. A similar trace after an epidural is usually the hypotension the block has produced, and the treatment is fluid and not delivery.",
      },

      { type: "heading", level: 2, text: "Classification and the fetal blood sample" },
      {
        type: "table",
        headers: ["Category", "Features", "Action"],
        rows: [
          ["Normal (white)", "Baseline 110 to 160, variability 5 to 25, no late or variable decelerations, no prolonged decelerations", "Continue routine care; no action beyond observation in a woman with no risk factor"],
          ["Suspicious (amber)", "One non-reassuring feature with the rest normal, such as a baseline of 100 to 109 or of 161 to 180, or a variability of 5 for 40 to 90 minutes", "Correct the modifiable causes, observe, and take a fetal blood sample if unchanged or if further features appear"],
          ["Pathological (red)", "Baseline below 100 or above 180, a sinusoidal rate, reduced variability for more than 90 minutes, late decelerations, repeated variable decelerations, or a prolonged deceleration", "Correct the modifiable causes, take a fetal blood sample, and prepare for urgent delivery if it is abnormal or cannot be obtained"],
        ],
      },
      {
        type: "table",
        headers: ["Fetal blood sample", "Interpretation", "Action"],
        rows: [
          ["pH 7.30 or above (lactate below 4.2 mmol/L)", "No evidence of acidosis", "Continue labour and re-evaluate only if the trace deteriorates further"],
          ["pH 7.21 to 7.29 (lactate 4.2 to 4.8 mmol/L)", "Borderline", "Repeat the sample after 30 minutes while the trace remains pathological"],
          ["pH 7.20 or below (lactate above 4.8 mmol/L)", "Acidosis", "Prepare for immediate delivery, usually by category 1 caesarean section"],
        ],
      },
      {
        type: "paragraph",
        text: "The fetal blood sample is taken through a dilated cervix with direct vision of the fetal scalp, and it measures scalp pH, which reflects the blood pH of the scalp tissue, which in turn reflects the metabolic state of the fetus. It is the only bedside test that separates an abnormal fetal heart rate caused by hypoxia from an abnormal rate with another cause, and its limitation is that it samples a single moment in time.",
      },
      {
        type: "question",
        prompt: "A fetal blood sample taken in the first stage returns a pH of 7.16. What follows?",
        answer: "The sample indicates fetal acidosis, so delivery must be expedited immediately, usually by a category 1 caesarean section, with the anaesthetic, theatre and neonatal teams informed. The woman is counselled about the need for delivery, and the trace, the sample and the decisions are documented.",
        explanation: "A pH of 7.20 or below is the threshold for immediate delivery; the purpose of the sample was to answer the question the trace could not, and it has now answered it.",
      },

      { type: "heading", level: 2, text: "Clinical correlation: the two emergencies" },
      {
        type: "table",
        headers: ["Emergency", "Recognition", "Immediate management"],
        rows: [
          ["Cord prolapse", "A fetal bradycardia after spontaneous or artificial rupture of the membranes, with the cord palpable on vaginal examination", "Call for help but do not leave the mother: keep the fingers in the vagina lifting the presenting part off the cord, position her in the knee-chest or steep head-down position, and proceed to delivery"],
          ["Uterine hyperstimulation", "More than five contractions in ten minutes or a contraction lasting more than two minutes, with decelerations on the trace", "Stop the oxytocin infusion, give oxygen, lie her on her left side, and give a tocolytic if the bradycardia persists"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Meconium alone is not evidence of fetal compromise. Meconium staining is common and does not by itself mandate a caesarean section; it matters when the heart rate is abnormal as well, when the liquor is thick, or when the fetus is bradycardic, in which case a fetal blood sample and experienced paediatric airway support are needed.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the cardiotocograph diagnoses fetal hypoxia. It detects an abnormal fetal heart rate pattern; the diagnosis of hypoxia is made by a fetal blood sample or by the response to intervention, and many abnormal traces are not hypoxia.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing early and late decelerations. Early decelerations mirror the contraction and reflect head compression; late decelerations begin after the contraction and reflect uteroplacental insufficiency, and only the latter require a fetal blood sample or expedited delivery.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying reduced variability always means the fetus is hypoxic. It also occurs in fetal sleep, which lasts up to 40 minutes, in prematurity, after maternal opioids, in fetal anaemia and in fetal heart block.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What are the four features of a cardiotocograph, and what is the normal baseline rate?",
        answer: "The baseline rate, the variability, the accelerations and the decelerations. The normal baseline rate is 110 to 160 beats per minute; a baseline below 100 or above 180 is a pathological feature.",
        explanation: "The features are read together as a pattern, and no single number describes a trace.",
      },
      {
        type: "question",
        prompt: "Which pH thresholds are used to act on a fetal blood sample, and which action follows each?",
        answer: "A pH of 7.30 or above is normal and needs no action; 7.21 to 7.29 is borderline and the sample is repeated if the trace remains pathological; 7.20 or below indicates acidosis and requires immediate delivery.",
        explanation: "The sample converts an abnormal rate pattern into a decision the pattern alone could not give, and it is taken only when the trace is pathological.",
      },
      {
        type: "question",
        prompt: "How is intermittent auscultation performed, and which women receive continuous monitoring instead?",
        answer: "The fetal heart is listened to immediately after a contraction for one minute every 15 minutes in the first stage and every five minutes in the second stage in a low-risk woman. Continuous monitoring is used where there is a risk factor such as prematurity, an epidural, oxytocin, meconium, previous caesarean section, multiple pregnancy or hypertension.",
        explanation: "Intermittent auscultation is the method of choice for low-risk labour, and the reason is that it avoids the intervention cascade that a continuous trace produces.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "What is the normal baseline fetal heart rate in labour?",
        options: [
          "90 to 130 beats per minute",
          "110 to 160 beats per minute",
          "120 to 180 beats per minute",
          "100 to 110 beats per minute",
        ],
        correctIndex: 1,
        explanation: "The normal baseline fetal heart rate is 110 to 160 beats per minute. A baseline below 100 or above 180 is pathological, and a baseline of 100 to 109 or 161 to 180 is non-reassuring.",
      },
      {
        type: "mcq",
        stem: "Which deceleration pattern is most consistent with fetal hypoxia from uteroplacental insufficiency?",
        options: [
          "Shallow, V-shaped decelerations that vary in shape and start with each contraction",
          "U-shaped decelerations that begin after the contraction has started and return after it has finished",
          "Decelerations that mirror the contraction exactly, beginning and ending with it",
          "Transient rises of 15 beats per minute lasting fifteen seconds",
        ],
        correctIndex: 1,
        explanation: "Late decelerations begin after the contraction and do not return until it has finished, reflecting uteroplacental blood flow that only fails when the contraction peaks. Variable decelerations are caused by cord compression and early decelerations by head compression.",
      },
      {
        type: "mcq",
        stem: "A fetal blood sample taken during a pathological trace returns a pH of 7.12. Which action is indicated?",
        options: [
          "Repeat the sample after 30 minutes while continuing to observe the cardiotocograph",
          "Prepare for immediate delivery, usually by a category 1 caesarean section",
          "Continue labour and reassess the trace after the next contraction",
          "Give oxygen, change the maternal position and observe for an hour",
        ],
        correctIndex: 1,
        explanation: "A pH of 7.20 or below indicates fetal acidosis and is the threshold for immediate delivery. Borderline results of 7.21 to 7.29 are repeated only while the trace remains unchanged.",
      },
      {
        type: "mcq",
        stem: "Which method of fetal monitoring is appropriate for a healthy woman in uncomplicated labour?",
        options: [
          "Continuous cardiotocography from the onset of labour",
          "Intermittent auscultation for one minute after each contraction, every 15 minutes in the first stage",
          "Cardiotocography only after the membranes rupture",
          "Fetal blood sampling every hour",
        ],
        correctIndex: 1,
        explanation: "Intermittent auscultation is the method of choice for a low-risk labour and is as safe as continuous monitoring in that group, without the intervention cascade the cardiotocograph produces.",
      },
      {
        type: "mcq",
        stem: "Immediately after artificial rupture of the membranes the fetal heart falls to 80 beats per minute and the cord is palpable on examination. What is the first action?",
        options: [
          "Prepare caesarean section and transfer the woman to theatre",
          "Call for help, keep the fingers in the vagina to lift the presenting part off the cord, and prepare for immediate delivery",
          "Give oxygen, stop any oxytocin infusion and reassess in fifteen minutes",
          "Take a fetal scalp blood sample to confirm fetal hypoxia",
        ],
        correctIndex: 1,
        explanation: "This is cord prolapse, and the first action is manual elevation of the presenting part, which is maintained until the baby is delivered. A fetal blood sample is not indicated and the woman should not be moved before the cord has been relieved.",
      },
      {
        type: "mcq",
        stem: "What is an acceleration on a cardiotocograph?",
        options: [
          "A transient fall of 15 beats per minute lasting 15 seconds",
          "A transient rise of 15 beats per minute lasting 15 seconds or more",
          "A sinusoidal pattern lasting 10 minutes",
          "A rise in variability between contractions",
        ],
        correctIndex: 1,
        explanation: "An acceleration is a transient rise of 15 beats per minute lasting 15 seconds or more, usually with fetal movement, and it is a reassuring feature that indicates a fetus that is not acidotic.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Fetal monitoring in labour is a screening process using the baseline rate, variability, accelerations and decelerations, read together, with intermittent auscultation for low-risk labour and continuous monitoring where there is a risk factor. A pathological trace is refined by a fetal blood sample: 7.30 or above is normal, 7.21 to 7.29 is borderline and repeated, and 7.20 or below demands immediate delivery. Cord prolapse and hyperstimulation are the two emergencies whose management begins by relieving the hypoxia, and meconium alone is not a sign of compromise.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 10 — Obstetric haemorrhage
// ---------------------------------------------------------------------------
function lesson10() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define antepartum and postpartum haemorrhage and grade its severity; describe the presentation and the management of placenta praevia and of placental abruption; classify the causes of postpartum haemorrhage by the four Ts; describe the resuscitation and the stepwise management of major obstetric haemorrhage; name the uterotonic drugs, their doses and their contraindications; and describe the mechanical and surgical interventions available when the drugs fail.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 4, 7, 8 and 9, and PHYS 101 for the physiology of blood loss and transfusion. Haemorrhage is the obstetric emergency that tests every one of those skills at once.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Obstetric haemorrhage",
        text: "Bleeding from the genital tract. Antepartum haemorrhage is bleeding from 28 weeks of pregnancy before the birth of the baby; postpartum haemorrhage is blood loss of 500 millilitres or more within 24 hours of birth, graded minor between 500 and 1000 millilitres and major above 1000.",
      },
      {
        type: "paragraph",
        text: "The idea that must be attached to the definition is that the obstetric patient hides bleeding well. Term pregnancy is a state of expanded blood volume, so a young woman can lose a litre of blood from a concealed abruption before her pulse rises and her blood pressure falls, and the visible loss is not the loss. Antepartum, therefore, the assessment is of shock measured against the visible blood loss; postpartum, it is of the firmness of the uterus and its response to the first uterotonic, rather than of the volume on the pad.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "A maternal tachycardia with a falling systolic pressure has already followed a substantial blood loss in obstetrics, because a healthy woman compensates until she suddenly does not. The woman who has lost 1500 millilitres concealed has a hard, tender uterus and needs delivery, not observation.",
      },

      { type: "heading", level: 2, text: "Worked example: antepartum haemorrhage" },
      {
        type: "table",
        headers: ["Cause", "Presentation", "Distinguishing feature"],
        rows: [
          ["Placenta praevia", "Sudden, painless, bright red bleeding, often after coitus, which recurs and increases", "The uterus is soft and not tender, the presenting part is high or abnormal, and no vaginal examination is performed before the placenta has been localised"],
          ["Placental abruption", "Painful, dark red bleeding with a hard, tender, woody feel to the uterus", "Blood loss is often concealed, the mother may be shocked out of proportion to the visible loss, and the fetal parts are difficult to feel"],
          ["Vasa praevia", "Fresh bleeding immediately after rupture of the membranes, with fetal tachycardia and continuing blood loss", "Fetal vessels run unsupported across the membranes over the internal os: the fetus is the one bleeding, so the volume is small and the fetal loss can be catastrophic"],
          ["Cervical or vaginal lesion", "Bleeding after coitus, with a visible ectropion, polyp or, rarely, a cancer", "The source is seen on speculum examination and the loss is limited"],
          ["Unknown cause", "No cause found on examination or on ultrasound", "The commonest of all, a diagnosis of exclusion; bleeding after 28 weeks with no cause still demands observation and fetal monitoring"],
        ],
      },
      {
        type: "paragraph",
        text: "Two rules protect the patient. Any bleeding after 28 weeks in a woman whose placenta is low-lying or unsited must have the placenta localised by ultrasound and never by a vaginal examination, because a finger through a praevia causes catastrophic haemorrhage. And an abruption with a live fetus of viable gestation is an obstetric emergency, because the abruption is both a shrunken placental site and a source of fibrinolysis that rapidly consumes fibrinogen and produces disseminated intravascular coagulation.",
      },

      { type: "heading", level: 2, text: "Worked example: postpartum haemorrhage and the four Ts" },
      {
        type: "table",
        headers: ["T", "Cause", "Share of cases", "Recognition and first action"],
        rows: [
          ["Tone", "Uterine atony: the uterus fails to contract after the placenta has separated", "About 70 per cent", "A soft, boggy uterus rising above the umbilicus with continuing bleeding; rub up the fundus, empty the bladder and give a uterotonic"],
          ["Tissue", "Retained placental fragments, an accessory lobe, or an abnormally adherent placenta", "About 10 per cent", "The placenta appears incomplete; remove it, under ultrasound guidance where an accreta is suspected, and refer for the risk factor of a previous caesarean"],
          ["Trauma", "Lacerations of the perineum, vagina or cervix, rupture of the uterus, or inversion", "About 20 per cent", "Bleeding from a uterus that is firm, or from a laceration found on inspection of the vulva, vagina and cervix with adequate lighting and assistance"],
          ["Thrombin", "Coagulopathy: abruption, amniotic fluid embolism, pre-existing clotting disorders or anticoagulation", "Under 1 per cent", "Diffuse oozing that will not stop and a low fibrinogen; give blood components and treat the underlying cause"],
        ],
      },
      {
        type: "paragraph",
        text: "The four Ts are not a differential to be consulted in turn; they are a checklist to be passed through rapidly, and in the order given. Tone comes first because it is both the commonest cause and the one that responds to the first drug; tissue second, trauma third, and thrombin when the bleeding does not stop and the clot will not form — a woman who is still bleeding with a uterus that has received the drugs has a cause those drugs cannot correct.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The risk factors for atony are recognisable in advance: a uterus over-distended by multiple pregnancy or polyhydramnios, a prolonged or augmented labour, prolonged oxytocin exposure, caesarean section, uterine fibroids, a maternal body mass index over 40, and a previous postpartum haemorrhage.",
      },

      { type: "heading", level: 2, text: "Clinical correlation: the sequence of management" },
      {
        type: "table",
        headers: ["Step", "What is done"],
        rows: [
          ["Call for help", "The senior obstetrician, the anaesthetist, the midwife in charge, the haematologist and the porters; a woman who is bleeding must never be left alone, and the process begins with a shout"],
          ["Resuscitate", "High-flow oxygen, two large-bore intravenous cannulae, warmed crystalloid, and tranexamic acid 1 gram intravenously over 10 minutes, given within three hours of birth; a urinary catheter to empty the bladder and to monitor output"],
          ["Investigate", "Full blood count, coagulation screen with fibrinogen, cross-match of 4 to 6 units, and a blood gas with lactate; fibrinogen falls first and a level below 2 grams per litre predicts a major haemorrhage"],
          ["Stop the bleeding", "Rub up the fundus and administer a uterotonic, then apply bimanual uterine compression, identifying and treating the cause"],
          ["Escalate", "An intrauterine balloon, a uterine compression suture, uterine artery or internal iliac artery ligation, and uterine artery embolisation; peripartum hysterectomy is the last resort, performed by a senior gynaecologist"],
        ],
      },
      {
        type: "table",
        headers: ["Uterotonic", "Dose and route", "Contraindications and notes"],
        rows: [
          ["Oxytocin", "5 international units intravenously slowly, repeated, then an infusion of 40 international units over four hours", "The first-line drug; given before delivery in excess it causes uterine hyperstimulation and fetal distress"],
          ["Ergometrine", "500 micrograms intramuscularly", "Avoid in hypertension, pre-eclampsia and cardiac disease, because it is a powerful vasoconstrictor and raises the blood pressure"],
          ["Carboprost", "250 micrograms intramuscularly, repeated to a maximum of 8 doses", "Avoid in asthma; it causes bronchospasm, and it is the prostaglandin F2-alpha analogue"],
          ["Misoprostol", "800 micrograms rectally or sublingually", "The drug of last resort and the one that can be given without a doctor; it causes shivering and pyrexia"],
        ],
      },
      {
        type: "question",
        prompt: "A woman is bleeding heavily 10 minutes after a normal delivery and her uterus is soft and boggy despite 5 international units of oxytocin and bimanual massage. What is the next step?",
        answer: "The cause is uterine atony, so the uterotonics are escalated (ergometrine, carboprost or misoprostol, according to contraindications), tranexamic acid is given, blood is cross-matched and components are prepared, and if the uterus still does not contract an intrauterine balloon or a compression suture is placed. The placenta is re-checked for completeness and the cervix, vagina and perineum are inspected for trauma, because more than one cause may be present.",
        explanation: "The four Ts are checked in order and in parallel; a woman who remains atonic after the first two drugs is one in whom the haemorrhage has become major and the senior team must be present.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a vaginal examination is the correct first step in antepartum haemorrhage. Until the placenta has been localised by ultrasound, a vaginal examination in an unknown antepartum haemorrhage can cause a fatal haemorrhage through a praevia.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the volume of blood loss is the measure of severity in obstetrics. A young woman can have a concealed litre of blood and a stable blood pressure, and a major haemorrhage is recognised by maternal condition, uterine response, and the rate of ongoing bleeding rather than by the volume on the pad.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying ergometrine is the drug of choice in every atonic uterus. It is contraindicated in the woman with pre-eclampsia or hypertension, who is exactly the woman most likely to have been transferred and to be bleeding; carboprost is used with caution in asthma, and misoprostol is the drug that does not need a doctor.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What is the definition and the grading of postpartum haemorrhage?",
        answer: "Blood loss of 500 millilitres or more within 24 hours of birth. It is minor between 500 and 1000 millilitres and major above 1000, and it occurs after about 5 per cent of deliveries in high-income practice.",
        explanation: "The volume threshold is easy, but severity is judged by the rate of bleeding, the maternal condition and the response to the first uterine massage and uterotonic.",
      },
      {
        type: "question",
        prompt: "What are the four Ts, and which is the commonest?",
        answer: "Tone, tissue, trauma and thrombin. Tone (uterine atony) is the commonest, at about 70 per cent of cases, with trauma at about 20 per cent and tissue at about 10 per cent.",
        explanation: "The list is remembered in order and worked through in order, and it is also the reason that the first line of management in most cases is a uterotonic and massage.",
      },
      {
        type: "question",
        prompt: "What are the immediate actions in a major obstetric haemorrhage?",
        answer: "Call for help and resuscitate: high-flow oxygen, two large-bore intravenous cannulae, warmed crystalloid, tranexamic acid 1 gram over 10 minutes within three hours, and a urinary catheter. Cross-match is sent, the four Ts are assessed and treated, and the uterotonics are escalated with mechanical or surgical measures if the bleeding continues.",
        explanation: "Resuscitation and the arrest of bleeding are simultaneous and are done by a team, and the documentation of the timeline is part of the management, both for the patient's care and for the governance review that follows every major haemorrhage.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "What is the definition of postpartum haemorrhage?",
        options: [
          "Any bleeding from the genital tract after 28 weeks of pregnancy",
          "Blood loss of 500 millilitres or more within 24 hours of birth",
          "Blood loss of more than 1000 millilitres within 24 hours of birth",
          "Bleeding from the uterus more than 24 hours and less than 12 weeks after birth",
        ],
        correctIndex: 1,
        explanation: "Postpartum haemorrhage is blood loss of 500 millilitres or more within 24 hours of birth, minor between 500 and 1000 millilitres and major above 1000. Bleeding from 28 weeks is an antepartum haemorrhage; bleeding after 24 hours is secondary.",
      },
      {
        type: "mcq",
        stem: "Which is the commonest cause of postpartum haemorrhage?",
        options: ["Placental abruption", "Retained products of conception", "Uterine atony", "Genital tract trauma"],
        correctIndex: 2,
        explanation: "Tone, meaning uterine atony, accounts for about 70 per cent of cases; trauma about 20 per cent, tissue about 10 per cent, and coagulopathy (thrombin) under 1 per cent.",
      },
      {
        type: "mcq",
        stem: "A woman at 30 weeks has painless, bright red bleeding. Which two actions are correct?",
        options: [
          "Perform a vaginal examination to assess the cervix and localise the placenta",
          "Localise the placenta by ultrasound, and avoid any vaginal examination until this is done",
          "Discharge her with reassurance if the bleeding stops",
          "Give ergometrine to stop the bleeding",
        ],
        correctIndex: 1,
        explanation: "Painless bright red bleeding is placenta praevia until excluded, and a finger through a praevia can cause a fatal haemorrhage. The placenta is localised by ultrasound first, and the fetal heart and maternal circulation are assessed.",
      },
      {
        type: "mcq",
        stem: "Which uterotonic is contraindicated in a woman with severe hypertension?",
        options: ["Oxytocin", "Ergometrine", "Carboprost", "Misoprostol"],
        correctIndex: 1,
        explanation: "Ergometrine is a powerful vasoconstrictor that raises blood pressure and is contraindicated in hypertension and pre-eclampsia; carboprost is the drug to avoid in asthma, because it causes bronchospasm.",
      },
      {
        type: "mcq",
        stem: "Which drug reduces death from haemorrhage when given to a woman with postpartum haemorrhage?",
        options: [
          "Tranexamic acid, one gram intravenously given within three hours of birth",
          "Ceftriaxone intravenously",
          "Magnesium sulfate intravenously",
          "Absorbable gelatin applied to the placental site",
        ],
        correctIndex: 0,
        explanation: "The WOMAN trial showed that one gram of intravenous tranexamic acid given within three hours of birth reduces death from haemorrhage, and it is given to every woman with a postpartum haemorrhage in parallel with the uterotonics.",
      },
      {
        type: "mcq",
        stem: "Which feature best distinguishes a placental abruption from a placenta praevia?",
        options: [
          "Abruption presents with painless red bleeding and a soft uterus",
          "Abruption presents with painful dark bleeding and a hard, tender uterus",
          "Abruption presents with a high presenting part and bleeding after coitus",
          "Abruption presents with a normal ultrasound and no abdominal pain",
        ],
        correctIndex: 1,
        explanation: "Abruption is painful, the blood is darker, and the uterus is hard and tender with concealed loss, whereas praevia bleeding is painless and bright, with a soft uterus and a high or abnormal presenting part.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Antepartum haemorrhage is bleeding from 28 weeks, and its commonest causes are placenta praevia, which is painless, bright and diagnosed by ultrasound, and placental abruption, which is painful, dark and associated with a hard uterus and coagulopathy. Postpartum haemorrhage is blood loss of 500 millilitres or more within 24 hours, and its causes are remembered as the four Ts, of which atony accounts for about 70 per cent. Management is resuscitation and arrest of bleeding at the same time, with tranexamic acid, uterotonics, and mechanical or surgical measures reserved for when the drugs fail.",
      },
      {
        type: "paragraph",
        text: "Next: hypertension in pregnancy — the disorder that is detected by the blood pressure at every antenatal visit, whose definitive treatment is delivery, and whose seizure is one of the few genuine obstetrological emergencies.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 11 — Hypertension in pregnancy: pre-eclampsia and eclampsia
// ---------------------------------------------------------------------------
function lesson11() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define gestational hypertension, pre-eclampsia, severe pre-eclampsia, eclampsia and HELLP syndrome; describe the pathophysiology of pre-eclampsia and the risk factors that predict it; list the assessment and the investigations of a woman with suspected pre-eclampsia; describe the prevention and the pharmacological management, including magnesium sulfate; describe the definitive treatment and the timing of delivery; and recognise the complications that make pre-eclampsia a cause of maternal death.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 7 and 8, and PHYS 102 for the physiology of the vasculature. Pre-eclampsia is a disorder of the placenta's vasculature that expresses itself as disease of the mother's.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Pre-eclampsia",
        text: "Hypertension of 140/90 millimetres of mercury or more that arises for the first time after 20 weeks of pregnancy, accompanied by one or more manifestations of maternal organ dysfunction: proteinuria, acute kidney injury, liver involvement, haematological complications, neurological features, or uteroplacental dysfunction.",
      },
      {
        type: "paragraph",
        text: "The definitions are easier to remember if they are read as a sequence of the same disease. Gestational hypertension is the blood pressure alone. Pre-eclampsia is the blood pressure plus an organ that is not working normally. Severe pre-eclampsia is the same disease at a rate that makes it dangerous — a systolic of 160 or a diastolic of 110. And eclampsia is a seizure that the disease has caused, breaking the only rule that had kept the woman safe.",
      },

      { type: "heading", level: 2, text: "The definitions, in a table" },
      {
        type: "table",
        headers: ["Term", "Definition"],
        rows: [
          ["Gestational hypertension", "New-onset hypertension of 140/90 mm Hg or more after 20 weeks of pregnancy, without proteinuria or organ dysfunction, returning to normal by 12 weeks postpartum"],
          ["Pre-eclampsia", "New-onset hypertension after 20 weeks with proteinuria of 300 milligrams or more in 24 hours, or a protein to creatinine ratio of 30 milligrams per millimole or more, or any other maternal organ dysfunction"],
          ["Severe pre-eclampsia", "Pre-eclampsia with hypertension of 160/110 mm Hg or more, proteinuria of 5 grams or more, or with acute kidney injury, raised transaminases, thrombocytopenia, cerebral or visual symptoms, or pulmonary oedema"],
          ["Eclampsia", "The occurrence of generalised tonic-clonic seizures in a woman with pre-eclampsia, in the absence of any other cause"],
          ["HELLP syndrome", "Haemolysis, elevated liver enzymes and a low platelet count — a severe variant, often with epigastric or right upper quadrant pain"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Proteinuria is no longer required for the diagnosis of pre-eclampsia: hypertension after 20 weeks with either renal, liver, haematological, neurological or uteroplacental involvement is pre-eclampsia, and about a fifth of women with the disease have no urinary protein at all.",
      },

      { type: "heading", level: 2, text: "Worked example: why pre-eclampsia happens" },
      {
        type: "paragraph",
        text: "The disease starts in the first trimester, in the placenta. In a normal pregnancy the cytotrophoblast invades the spiral arteries of the uterus and converts them from small, muscular, high-resistance vessels into large, low-resistance channels that can carry the blood the placenta needs at term. In pre-eclampsia that invasion fails, the arteries remain narrow and high-resistance, and the placenta is perfused at a level it cannot sustain. The ischaemic placenta then releases anti-angiogenic factors, principally soluble fms-like tyrosine kinase 1, that antagonise vascular endothelial growth factor and placental growth factor, and the maternal endothelium — kidney, liver, brain, lungs and the clotting system — stops behaving normally.",
      },
      {
        type: "table",
        headers: ["Organ", "Consequence of endothelial dysfunction", "How it presents"],
        rows: [
          ["Kidney", "Glomerular endotheliosis reduces filtration and produces proteinuria", "Oedema, proteinuria, a rising creatinine and oliguria"],
          ["Liver", "Periportal haemorrhage and hepatocellular swelling stretch the liver capsule", "Epigastric or right upper quadrant pain, raised transaminases, and HELLP"],
          ["Blood", "Platelet activation and haemolysis at the site of fibrin deposition", "Thrombocytopenia, haemolysis and disseminated intravascular coagulation"],
          ["Brain", "Vasospasm, cerebral oedema and hyperperfusion", "Headache, visual disturbance, hyperreflexia with clonus, and in the extreme a seizure"],
          ["Lung", "Increased capillary permeability with left ventricular filling pressures that are often normal", "Pulmonary oedema, which is the commonest cause of death"],
          ["Placenta", "Reduced perfusion and maternal vascular malperfusion", "Fetal growth restriction, oligohydramnios, abruption and perinatal death"],
        ],
      },

      { type: "heading", level: 2, text: "Risk factors, prevention and screening" },
      {
        type: "table",
        headers: ["Risk factors", "Why it matters"],
        rows: [
          ["Nulliparity, a first pregnancy by the same partner, and previous pre-eclampsia", "The strongest historical risk factor is a previous affected pregnancy, in which the risk rises to about a fifth or more"],
          ["Age of 40 or more, a body mass index of 35 or more", "The most modifiable risk factors, and the ones that counselling addresses"],
          ["A family history of pre-eclampsia", "A shared genetic susceptibility to the abnormal placentation"],
          ["Multiple pregnancy, and a long interpregnancy interval of more than 10 years", "Both represent a large placenta for which the uterine vasculature is not adequately developed"],
          ["Pre-existing hypertension, chronic kidney disease, diabetes, and antiphospholipid syndrome", "Pre-existing disease of the vasculature that the pregnancy then reveals"],
        ],
      },
      {
        type: "paragraph",
        text: "Prevention is limited but real. A woman with one high-risk or two moderate-risk factors is offered low-dose aspirin of 75 to 150 milligrams daily from 12 weeks to delivery, which reduces pre-eclampsia by about a quarter, and calcium supplementation is advised in populations with a low dietary calcium intake. The rest of the strategy is the blood pressure measured at every antenatal visit, which is why the simple measurement is the most valuable part of the whole antenatal schedule.",
      },

      { type: "heading", level: 2, text: "Clinical correlation: management" },
      {
        type: "table",
        headers: ["Problem", "Management"],
        rows: [
          ["Control of severe hypertension", "Labetalol intravenously first, then oral nifedipine or hydralazine, to bring the blood pressure below 140/90 and prevent a cerebral haemorrhage; angiotensin-converting enzyme inhibitors, angiotensin receptor blockers and atenolol are avoided"],
          ["Prevention and treatment of eclampsia", "Magnesium sulfate, 4 grams intravenously over 5 to 10 minutes followed by an infusion of 1 gram per hour for 24 hours after delivery, for eclampsia and for severe pre-eclampsia in labour"],
          ["Definitive treatment", "Delivery. At term a woman with pre-eclampsia is delivered; before 34 weeks the pregnancy is often prolonged by days, with antihypertensives and magnesium, for the benefit of the fetus, provided the mother remains stable"],
          ["Fetal lung maturity", "Betamethasone before 34+6 weeks where preterm delivery is anticipated"],
          ["Fluid balance", "Restricted to about 80 millilitres per hour with careful input-output and daily weights, because pulmonary oedema is the commonest cause of death in this disease"],
          ["Postpartum", "Blood pressure and proteinuria are re-checked at 6 to 8 weeks and at 13 weeks postpartum; a woman whose blood pressure has not normalised has chronic hypertension and future cardiovascular risk"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Magnesium sulfate is monitored clinically: patellar reflexes, respiratory rate above 12 per minute, urine output above 30 millilitres per hour, and the antidote calcium gluconate at hand. Reflexes disappear before respiration fails, and that order is the safeguard.",
      },
      {
        type: "question",
        prompt: "A woman at 33 weeks has a blood pressure of 170/115 with headache and visual disturbance and the reflexes are brisk with ankle clonus. What is the immediate management?",
        answer: "She has severe pre-eclampsia with cerebral involvement and is at risk of eclampsia. A senior and an anaesthetist are involved immediately: magnesium sulfate is started for seizure prophylaxis (4 grams intravenously over 5 to 10 minutes then 1 gram per hour), an intravenous antihypertensive such as labetalol is given to bring the blood pressure below 140/90, fluid intake is restricted, the fetus is assessed with cardiotocography and a growth scan, betamethasone is given if preterm delivery is anticipated, and delivery is planned once she is stable.",
        explanation: "The two immediate risks are cerebrovascular haemorrhage, which the antihypertensive prevents, and eclampsia, which the magnesium prevents; delivery is the only definitive treatment and it follows stabilisation.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying proteinuria is required for the diagnosis. It is a feature, not a criterion: hypertension after 20 weeks with any maternal organ dysfunction is pre-eclampsia, and many women with the disease have no protein in the urine.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the treatment of pre-eclampsia is the treatment of the blood pressure. The blood pressure is treated to prevent a cerebral haemorrhage, but the disease only resolves after delivery, and the temporising management of the hypertension must not delay delivery in the woman whose mother or fetus is at risk.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing eclampsia and epilepsy. A seizure in a woman with pre-eclampsia after 20 weeks is eclampsia until proven otherwise, and the management is magnesium and delivery, not antiepileptic drugs.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What is the definition of pre-eclampsia, and how does it differ from gestational hypertension?",
        answer: "Gestational hypertension is hypertension arising after 20 weeks with no organ dysfunction. Pre-eclampsia is hypertension after 20 weeks with proteinuria or any other maternal organ dysfunction — renal, liver, haematological, neurological or uteroplacental.",
        explanation: "The distinction matters because pre-eclampsia carries the risk of eclampsia, of HELLP and of fetal growth restriction, while gestational hypertension alone does not carry the same risk.",
      },
      {
        type: "question",
        prompt: "What are the components of HELLP syndrome, and how does it present?",
        answer: "Haemolysis, elevated liver enzymes and a low platelet count. It presents with malaise, epigastric or right upper quadrant pain, nausea, and sometimes jaundice, and it is a severe variant of pre-eclampsia that requires delivery and blood component support.",
        explanation: "The liver involvement is the feature that differentiates it from an ordinary pre-eclampsia, and the platelet count falling below 50 is the feature that makes epidural anaesthesia and caesarean section hazardous.",
      },
      {
        type: "question",
        prompt: "How is magnesium sulfate monitored, and which drug is its antidote?",
        answer: "By the patellar reflexes, a respiratory rate of more than 12 per minute, and urine output of more than 30 millilitres per hour; the antidote is calcium gluconate. The reflexes are lost before respiration, and that order is the clinical safeguard.",
        explanation: "Magnesium is excreted by the kidney, so oliguria and fluid restriction are the situations in which toxicity appears, and monitoring is a part of the prescription.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which finding is sufficient, together with hypertension after 20 weeks, to diagnose pre-eclampsia?",
        options: [
          "Proteinuria of 300 milligrams or more in a 24-hour collection",
          "Proteinuria, or thrombocytopenia, or a raised transaminase, or a headache with visual disturbance",
          "Oedema of both ankles",
          "A body mass index of 35 or more",
        ],
        correctIndex: 1,
        explanation: "Pre-eclampsia is hypertension after 20 weeks with any maternal organ dysfunction: proteinuria, renal, liver, haematological, neurological or uteroplacental. Oedema and obesity are features of many pregnant women and are not criteria.",
      },
      {
        type: "mcq",
        stem: "Which drug is first line for acute control of severe hypertension in pregnancy?",
        options: ["Enalapril", "Labetalol, given intravenously", "Atenolol", "Hydrochlorothiazide"],
        correctIndex: 1,
        explanation: "Labetalol is the first-line intravenous antihypertensive, with nifedipine or hydralazine as alternatives. Angiotensin-converting enzyme inhibitors, angiotensin receptor blockers and atenolol are avoided in pregnancy.",
      },
      {
        type: "mcq",
        stem: "Which regimen of magnesium sulfate is used to prevent eclampsia?",
        options: [
          "A 4 gram intravenous bolus followed by an infusion of 1 gram per hour for 24 hours",
          "A 1 gram intravenous bolus followed by an infusion of 1 gram per hour for 7 days",
          "A single 1 gram intramuscular dose",
          "A 4 gram oral dose repeated twice daily",
        ],
        correctIndex: 0,
        explanation: "Magnesium sulfate is given as a 4 gram intravenous loading dose over 5 to 10 minutes, followed by an infusion of 1 gram per hour, continued for 24 hours after delivery or after the last seizure.",
      },
      {
        type: "mcq",
        stem: "Which feature is the earliest clinical sign of magnesium toxicity, and which drug is the antidote?",
        options: [
          "A rising respiratory rate, and calcium gluconate",
          "Loss of the patellar reflexes, and calcium gluconate",
          "A reduction in urine output, and naloxone",
          "Flushing and headache, and magnesium sulfate has no antidote",
        ],
        correctIndex: 1,
        explanation: "Toxicity follows a stereotyped order: reflexes are lost first, then the respiratory rate falls, then respiration stops. The antidote is calcium gluconate, held ready while the infusion runs.",
      },
      {
        type: "mcq",
        stem: "What is the definitive treatment of pre-eclampsia?",
        options: [
          "Antihypertensive therapy until the blood pressure is below 120/80",
          "Delivery of the fetus and the placenta",
          "Low-dose aspirin for the remainder of the pregnancy",
          "Bed rest and the treatment of the oedema",
        ],
        correctIndex: 1,
        explanation: "The disease originates in the placenta and resolves only once the placenta is delivered. Blood pressure is controlled and eclampsia is prevented while delivery is arranged, but delivery is the cure.",
      },
      {
        type: "mcq",
        stem: "Which prophylactic measure is offered to a woman at high risk of pre-eclampsia?",
        options: [
          "Low-dose aspirin from 12 weeks of pregnancy",
          "Magnesium sulfate from 20 weeks",
          "Vitamin C and vitamin E supplementation",
          "Bed rest from 28 weeks",
        ],
        correctIndex: 0,
        explanation: "Low-dose aspirin of 75 to 150 milligrams daily, started at 12 weeks, reduces the risk of pre-eclampsia by about a quarter in a woman with a high or two moderate risk factors. Vitamin C and E are not of benefit.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Hypertension arising after 20 weeks is gestational hypertension until an organ is involved, and pre-eclampsia once it is. The disease is a failure of placental spiral artery remodelling that produces maternal endothelial dysfunction, whose clinical extremes are eclampsia, HELLP syndrome and pulmonary oedema, and whose definitive treatment is delivery. The clinical triad is a blood pressure at every visit, aspirin for prevention, and magnesium sulfate with an antihypertensive for the severe disease, with fluids restricted because oedema of the lung kills more women than the seizure does.",
      },
      {
        type: "paragraph",
        text: "Next: preterm labour and the rupture of membranes before term, where the same two instruments — corticosteroids and magnesium — are used, but for a fetus whose survival is at stake rather than a mother whose blood pressure is.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 12 — Preterm labour and premature rupture of membranes
// ---------------------------------------------------------------------------
function lesson12() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define threatened and established preterm labour, and preterm birth; describe the assessment and the diagnosis of preterm labour; state the indications, risks and contraindications of tocolysis; describe the use, timing and benefits of antenatal corticosteroids; describe the use of magnesium sulfate for fetal neuroprotection; define preterm prelabour rupture of membranes and describe its assessment and management; and recognise chorioamnionitis and the point at which the labour must be allowed to proceed.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 8 and 9. Preterm labour is the same physiology of labour, occurring at a gestation at which the fetus cannot survive outside the uterus.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Preterm labour",
        text: "Regular uterine contractions producing cervical effacement and dilatation between 20 and 37 weeks of gestation. Threatened preterm labour is contractions without cervical change, and established preterm labour is contractions with both effacement and dilatation.",
      },
      {
        type: "paragraph",
        text: "The key concept is that preterm labour cannot be stopped for its own sake. Tocolysis is not a treatment: it is a short postponement, of 48 hours, for two reasons — so that a course of corticosteroids can be given and so that a woman can be transferred to a unit with a neonatal intensive care cot before she gives birth. Once the steroids are in and the mother is in the right place, a woman who is still in labour is delivered, not arrested further.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Preterm birth affects about 7 per cent of deliveries and accounts for almost three quarters of perinatal mortality and for a large share of long-term neurological handicap, which is why nothing else in obstetrics has a better cost-to-benefit ratio than the antenatal corticosteroid.",
      },

      { type: "heading", level: 2, text: "Worked example: assessment of preterm contractions" },
      {
        type: "table",
        headers: ["Assessment", "Finding", "Meaning"],
        rows: [
          ["Gestational age confirmed", "Confirmed by the first-trimester scan, not by the dates", "Every subsequent decision depends on it, and a wrongly dated pregnancy is wrongly treated"],
          ["Contraction frequency", "Regular, painful contractions, usually four or more in ten minutes", "Painless or irregular tightenings are Braxton Hicks contractions and are not labour"],
          ["Cervical change", "Effacement and dilatation of the cervix on inspection or on a gentle examination", "Cervical change is what converts threatened labour into established labour, and it is the finding that justifies treating"],
          ["Fetal assessments", "Cardiotocography, the presentation, and the placenta and membranes", "Fetal distress, abruption or a prolapsed cord changes everything, and the fetus of a breech presentation is delivered differently"],
          ["Infection", "Fever, maternal or fetal tachycardia, uterine tenderness, offensive liquor", "Chorioamnionitis is a contraindication to tocolysis and an indication for delivery"],
          ["Quantitative fetal fibronectin where available", "A low level in a woman with intact membranes", "Refines the risk of birth within the next days and avoids admitting a woman who will not deliver"],
        ],
      },
      {
        type: "paragraph",
        text: "The causes of preterm birth divide into spontaneous onset (about half), which is often the consequence of infection or haemorrhage, and provider-initiated delivery (a third), which is the consequence of pre-eclampsia, growth restriction or placental bleeding; and the remainder are premature rupture of the membranes and multiple pregnancy.",
      },

      { type: "heading", level: 2, text: "The three interventions" },
      {
        type: "table",
        headers: ["Intervention", "Dose and timing", "Purpose and effect"],
        rows: [
          ["Antenatal corticosteroids", "Betamethasone 12 milligrams intramuscularly, two doses 24 hours apart; or dexamethasone", "Reduces neonatal respiratory distress syndrome, intraventricular haemorrhage, necrotising enterocolitis and neonatal death by about a third; benefit begins 24 hours after the first dose and is greatest before a birth between 24 and 34+6 weeks"],
          ["Tocolysis", "Nifedipine orally, or atosiban by intravenous infusion, for up to 48 hours", "To buy the two days the steroids need, and to buy time for transfer to a unit with a neonatal cot. It is not continued beyond 48 hours"],
          ["Magnesium sulfate", "A 4 gram intravenous loading dose then an infusion of 1 gram per hour, given before 32 weeks", "For fetal neuroprotection: it reduces the risk of cerebral palsy when the birth is certain to be preterm"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Tocolysis is contraindicated where continuing the pregnancy would harm the mother or the fetus: chorioamnionitis, abruption, fetal distress, fetal death, a lethal fetal abnormality, severe pre-eclampsia, advanced labour with a cervical dilatation of more than 4 centimetres, or a need to deliver for maternal reasons.",
      },
      {
        type: "paragraph",
        text: "The woman is also transferred before she gives birth, where a neonatal cot is not available, and an additional measure is prophylaxis against group B streptococcal infection with penicillin: a woman in preterm labour with ruptured membranes is at risk, and the prophylaxis protects the newborn.",
      },
      {
        type: "question",
        prompt: "A woman at 29 weeks is contracting every three minutes, is 3 cm dilated, and her cervix is effaced. What are the three priorities?",
        answer: "Antenatal corticosteroids to reduce neonatal respiratory distress and death, magnesium sulfate for fetal neuroprotection before 32 weeks, and tocolysis with nifedipine or atosiban for up to 48 hours to allow the steroids to work and to permit transfer to a unit with a neonatal intensive care cot. She is monitored for infection and for fetal well-being throughout.",
        explanation: "The purpose of each is different: the corticosteroids protect the fetus's lungs, the magnesium protects the brain, and the tocolysis buys the time for both and for the transfer.",
      },

      { type: "heading", level: 2, text: "Worked example: preterm prelabour rupture of the membranes" },
      {
        type: "definition",
        term: "Preterm prelabour rupture of the membranes",
        text: "The rupture of the membranes before the onset of labour and before 37 weeks of gestation, which affects about 2 to 3 per cent of pregnancies.",
      },
      {
        type: "paragraph",
        text: "The diagnosis is clinical, and it is made without putting a finger in the cervix. A history of a sudden gush of fluid is followed by a sterile speculum examination: fluid is seen pooling in the posterior fornix, the liquor can be seen running from the os when the woman coughs, and a swab or microscope examination of the fluid on a slide shows ferning as it dries. Digital examination is avoided because it increases the risk of infection and shortens the latency to birth.",
      },
      {
        type: "table",
        headers: ["Issue", "Management"],
        rows: [
          ["Antibiotics", "Oral erythromycin 250 milligrams twice daily for 10 days, which delays birth and reduces neonatal infection; co-amoxiclav is not used in women with ruptured membranes"],
          ["Corticosteroids", "Given where delivery before 34 weeks is anticipated, for the same respiratory benefit as in preterm labour"],
          ["Expectant management", "Admission with maternal temperature, pulse and uterine tenderness checked, and a cardiotocograph, until the decision to deliver; labour tends to begin within a week, and the risk is that of infection"],
          ["Timing of birth", "From 37 weeks, induction of labour is offered; before that, expectant management is usual in the UK, weighing prematurity against the risk of chorioamnionitis"],
          ["Very early rupture, before 24 weeks", "The loss of liquor for weeks causes pulmonary hypoplasia, limb contractures and skeletal deformity; counselling is with a specialist in fetal medicine"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Chorioamnionitis is the diagnosis that changes the management: maternal fever, a maternal and fetal tachycardia, uterine tenderness, and offensive or cloudy liquor. It is treated with delivery and intravenous antibiotics, and it is no longer a pregnancy that can be prolonged.",
      },
      {
        type: "paragraph",
        text: "The latency between rupture and birth is prolonged by each week of gestation at which the rupture occurs: the later it happens, the shorter the interval before labour begins. That is the reason expectant management is offered before 37 weeks but delivery is induced at and beyond it.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying preterm labour should be arrested until term. Tocolysis is used for 48 hours only, to give the steroids time to work and to allow transfer; prolonged tocolysis increases the risk of infection and does not delay the eventual birth.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a digital vaginal examination is the correct way to confirm rupture of the membranes. It should be avoided in suspected preterm rupture; a sterile speculum examination is the method, with observation of pooling liquor and, where needed, ferning.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying antibiotics are contraindicated in preterm rupture. Erythromycin is recommended for 10 days to prolong pregnancy and reduce neonatal infection; it is co-amoxiclav that is avoided in this situation.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What are the indications, duration and purpose of tocolysis in preterm labour?",
        answer: "It is indicated in established preterm labour before 35 weeks without a contraindication, and it is used for up to 48 hours with nifedipine or atosiban. Its purpose is to allow the corticosteroids to work and to allow transfer to a unit with a neonatal unit; it is not continued beyond 48 hours.",
        explanation: "Tocolysis has no proven benefit beyond the first two days, and beyond that the risks of continued treatment are greater than the benefits.",
      },
      {
        type: "question",
        prompt: "What is the dose and the benefit of the antenatal corticosteroid, and for which gestations is it used?",
        answer: "Betamethasone 12 milligrams intramuscularly in two doses 24 hours apart, used where delivery is anticipated before 34+6 weeks. It reduces neonatal respiratory distress syndrome, intraventricular haemorrhage and neonatal death by about a third, with benefit beginning about 24 hours after the first dose.",
        explanation: "The benefit of the first course is well evidenced; a single repeat course is given only where the risk of birth persists and the woman remains below 34 weeks, after a specialist decision.",
      },
      {
        type: "question",
        prompt: "How is preterm prelabour rupture of the membranes assessed, and what is given?",
        answer: "By a history of fluid loss and a sterile speculum examination demonstrating pooling of liquor, fluid running from the os, or ferning of the liquor on a slide; no digital examination. Management is erythromycin 250 milligrams twice daily for 10 days, corticosteroids where delivery before 34 weeks is anticipated, cardiotocography and maternal observation, and induction from 37 weeks.",
        explanation: "The purpose of the antibiotics is to delay birth and to reduce the risk of neonatal infection, and the purpose of avoiding the digital examination is the same.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which finding distinguishes established preterm labour from threatened preterm labour?",
        options: [
          "Four or more painful contractions in ten minutes",
          "Regular contractions with effacement and dilatation of the cervix",
          "A cervical length below 25 millimetres on ultrasound",
          "Rupture of the membranes before a contraction",
        ],
        correctIndex: 1,
        explanation: "Threatened preterm labour is contractions without cervical change; established preterm labour is contractions with effacement and dilatation, and cervical change is the finding that decides the diagnosis and the treatment.",
      },
      {
        type: "mcq",
        stem: "Which drug is given to accelerate fetal lung maturity in preterm labour?",
        options: [
          "Betamethasone, 12 milligrams intramuscularly in two doses 24 hours apart",
          "Nifedipine, 20 milligrams orally",
          "Magnesium sulfate, 4 grams intravenously",
          "Erythromycin, 250 milligrams twice daily",
        ],
        correctIndex: 0,
        explanation: "Antenatal corticosteroids reduce neonatal respiratory distress syndrome, intraventricular haemorrhage and neonatal death by about a third, and benefit begins about 24 hours after the first dose. Nifedipine and magnesium are used for different purposes — tocolysis and neuroprotection.",
      },
      {
        type: "mcq",
        stem: "Which tocolytics are preferred in the United Kingdom?",
        options: [
          "Ritodrine and salbutamol, because they are beta-agonists",
          "Nifedipine and atosiban, because they have fewer maternal adverse effects",
          "Indomethacin in every case, regardless of gestation",
          "Alcohol and bed rest",
        ],
        correctIndex: 1,
        explanation: "Nifedipine, a calcium-channel blocker, and atosiban, an oxytocin receptor antagonist, are the drugs of choice. Beta-agonists are used where the alternatives are unsuitable, and they have a high burden of maternal pulmonary oedema, tachycardia and hypotension.",
      },
      {
        type: "mcq",
        stem: "For what purpose is magnesium sulfate given before a preterm birth?",
        options: [
          "To relax the uterus and arrest the labour",
          "Fetal neuroprotection, reducing the risk of cerebral palsy when birth is expected before 32 weeks",
          "To accelerate fetal lung maturity",
          "To prevent chorioamnionitis",
        ],
        correctIndex: 1,
        explanation: "Magnesium sulfate given to women at risk of birth before 32 weeks reduces the risk of cerebral palsy in the child. Its use for tocolysis is a misconception; that is the role of nifedipine and atosiban.",
      },
      {
        type: "mcq",
        stem: "A woman at 31 weeks reports a sudden gush of fluid. Which is the correct assessment?",
        options: [
          "A digital vaginal examination to confirm the dilatation",
          "A sterile speculum examination to identify pooling liquor, followed by cardiotocography",
          "An ultrasound to diagnose the rupture",
          "Discharge home with a follow-up in one week",
        ],
        correctIndex: 1,
        explanation: "Preterm rupture is diagnosed by the history and a sterile speculum examination, looking for pooling of liquor in the posterior fornix, fluid running from the os, and ferning. Digital examination is avoided because it increases the risk of infection and shortens the latency to birth.",
      },
      {
        type: "mcq",
        stem: "Which antibiotic is recommended for 10 days in preterm prelabour rupture of the membranes?",
        options: ["Amoxicillin", "Erythromycin", "Metronidazole", "Ceftriaxone"],
        correctIndex: 1,
        explanation: "Oral erythromycin 250 milligrams twice daily for 10 days prolongs pregnancy and reduces neonatal infection; co-amoxiclav is not used in women with prolonged rupture of the membranes.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Preterm labour is contractions with cervical change before 37 weeks, and the woman is treated not to stop the birth but to buy 48 hours: corticosteroids to mature the fetus's lungs, magnesium sulfate to protect the fetus's brain, and tocolysis with nifedipine or atosiban to allow both and a transfer to a neonatal unit. Preterm rupture of the membranes is diagnosed by speculum examination without a finger, treated with erythromycin for 10 days, and managed expectantly until induction is offered at 37 weeks, unless chorioamnionitis, abruption or fetal distress ends the decision early.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 13 — Abnormal uterine bleeding
// ---------------------------------------------------------------------------
function lesson13() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: classify the causes of abnormal uterine bleeding by the PALM-COEIN system and by the pattern of bleeding; describe the appropriate investigation of heavy, intermenstrual and post-menopausal bleeding; state the medical, hormonal and surgical treatments of heavy menstrual bleeding and their place; distinguish the red-flag presentations that require urgent referral; and identify the causes of post-menopausal bleeding and the pathway that follows it.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 2 and 6 (the menstrual cycle and menstrual disorders), and lesson 1 (anatomy) for the uterus that bleeds. Abnormal uterine bleeding is the commonest gynaecological presentation, and every treatment modifies the cycle.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Abnormal uterine bleeding",
        text: "Any deviation from the normal pattern of menstruation — in frequency, regularity, duration or volume — that is heavy enough or irregular enough to interfere with a woman's life, and that demands a cause be identified rather than assumed.",
      },
      {
        type: "paragraph",
        text: "Two distinctions drive everything in this lesson. The first is structural versus non-structural, which is exactly what the PALM-COEIN system expresses: a polyp, adenomyosis, a leiomyoma or a malignancy can be seen and removed, while a coagulopathy, ovulatory dysfunction, an endometrial disorder or an iatrogenic cause is treated by different means altogether. The second is by pattern: heavy regular bleeding, bleeding between periods, and bleeding after the menopause are three different questions with three different causes and three different investigations.",
      },

      { type: "heading", level: 2, text: "Worked example: PALM-COEIN" },
      {
        type: "table",
        headers: ["Class", "Cause", "Comment"],
        rows: [
          ["P — Polyp", "Endometrial or cervical polyp", "Presents with intermenstrual and post-coital bleeding; seen on ultrasound and removed at hysteroscopy"],
          ["A — Adenomyosis", "Endometrium within the myometrium", "The commonest cause of heavy and painful menstrual bleeding in a parous woman aged 40 to 50, with a bulky, tender uterus"],
          ["L — Leiomyoma", "Uterine fibroids", "Heavy and prolonged bleeding, pressure on the bladder and bowel, and subfertility; submucous fibroids distort the cavity and are the group that causes bleeding"],
          ["M — Malignancy and hyperplasia", "Endometrial and cervical carcinoma", "The reason that persistent bleeding must be investigated rather than treated empirically; the endpoint of the pathway"],
          ["Co — Coagulopathy", "Von Willebrand disease, thrombocytopenia and anticoagulation", "Should be considered when heavy bleeding has been present since menarche, or where there is bruising or epistaxis"],
          ["O — Ovulatory dysfunction", "Anovulatory cycles, polycystic ovary syndrome, perimenopause, hypothyroidism", "Unopposed oestrogen thickens the endometrium, which then breaks down unpredictably and gives irregular heavy bleeding"],
          ["E — Endometrial", "An endometrial cause with no other explanation", "Often after oestrogen priming with no progestogenic opposition, and treated by a hormonal method"],
          ["I — Iatrogenic", "Hormonal contraception, anticoagulants, an intrauterine device", "The levonorgestrel intrauterine device both causes and treats bleeding, and its diagnosis is made by the timing of the onset"],
          ["N — Not yet classified", "Chorio-decidual changes, arteriovenous malformation", "A small residual group, including rare causes such as uterine arteriovenous malformation"],
        ],
      },
      {
        type: "paragraph",
        text: "The pattern of bleeding further narrows the cause. Heavy regular bleeding is heavy menstrual bleeding and is usually ovulatory, and it is caused by structural disease or by endometrial factors; intermenstrual bleeding suggests a polyp, a fibroid, infection, hormonal contraception or cervical disease; and post-coital bleeding suggests a cervical ectropion, a polyp, cervicitis or a malignancy, which is why a woman with post-coital bleeding is examined and her cervix is examined and sampled rather than reassured.",
      },

      { type: "heading", level: 2, text: "Clinical correlation: investigation" },
      {
        type: "table",
        headers: ["Investigation", "Purpose"],
        rows: [
          ["Full blood count", "Anaemia; a haemoglobin below 120 g/L is the finding that converts the treatment from symptomatic to urgent"],
          ["Transvaginal ultrasound", "The first-line imaging: the endometrial thickness, the presence of fibroids, polyps and adenomyosis, and the ovaries"],
          ["Endometrial biopsy", "To exclude hyperplasia and carcinoma: indicated in all women with bleeding at 45 years or more, and at any age where there are risk factors, persistent bleeding, or an endometrial thickness above the cut-off on ultrasound"],
          ["Hysteroscopy and biopsy", "The diagnostic test for a focal lesion such as a polyp or submucous fibroid, and the test where the ultrasound is abnormal or inconclusive"],
          ["Coagulation screen", "Where bleeding has been heavy since menarche or where there is a personal or family history of bleeding or bruising"],
          ["Cervical examination and sampling", "Where the bleeding is post-coital, intermenstrual, or where the screening is overdue, and to visualise the ectropion, polyp or lesion"],
          ["Thyroid function and prolactin", "In the woman with oligomenorrhoea, galactorrhoea or a raised body mass index"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The cut-off for post-menopausal bleeding is an endometrial thickness of 4 millimetres or less on transvaginal ultrasound, below which cancer is unlikely. A thickness of more than 4 millimetres, persistent bleeding, or bleeding because of tamoxifen or because of a persistent problem means sampling, whatever the ultrasound says.",
      },

      { type: "heading", level: 2, text: "Treatment of heavy menstrual bleeding" },
      {
        type: "table",
        headers: ["Treatment", "Mechanism and effect"],
        rows: [
          ["Levonorgestrel intrauterine system", "The first-line treatment: it thins the endometrium and reduces menstrual blood loss by about 90 per cent within a year; it also provides contraception and reduces dysmenorrhoea"],
          ["Tranexamic acid", "An antifibrinolytic taken on the days of the heaviest bleeding, which reduces blood loss by about half and may be combined with a hormonal method"],
          ["Non-steroidal anti-inflammatory drugs", "Mefenamic acid during the period, which reduces the prostaglandin-driven bleeding and also the dysmenorrhoea"],
          ["Combined hormonal contraception", "Suppresses the endometrium and gives a regular, light withdrawal bleed, where contraception is also wanted and there is no contraindication"],
          ["Oral progestogens or an injectable progestogen", "Thin the endometrium and are used in the woman with anovulatory bleeding and where the oestrogen-containing options are contraindicated"],
          ["Gonadotropin-releasing hormone analogues", "Produce a reversible hypo-oestrogenic state that suppress the bleeding entirely, for the woman awaiting surgery or where a prolonged treatment is not an option; add-back hormone replacement is used to prevent bone loss"],
          ["Iron replacement and, where severe, transfusion", "For the anaemia, which is often the reason that a woman presents and the thing that must actually be corrected"],
          ["Endometrial ablation", "Destroys the endometrium and reduces bleeding to a light or absent flow; offered where the uterus is not large, the woman does not want a pregnancy and no malignancy has been excluded"],
          ["Myomectomy, uterine artery embolisation or hysterectomy", "Surgical, for fibroids or where the medical treatments fail; the hysterectomy is definitive and is reserved for the woman whose family is complete"],
        ],
      },
      {
        type: "question",
        prompt: "Why is the levonorgestrel intrauterine system the first-line treatment of heavy menstrual bleeding, and when is it not suitable?",
        answer: "Because it acts locally on the endometrium, reduces blood loss by about 90 per cent over a year, provides contraception and treats dysmenorrhoea at the same time, with no systemic oestrogen and therefore few contraindications. It is unsuitable for the woman who wants a pregnancy, whose bleeding is caused by a cavity-distorting submucous fibroid or another focal lesion, or in whom a malignancy has not been excluded.",
        explanation: "The bleeding of a focal lesion is a mechanical problem, so thinning the endometrium around it does not help; the lesion must be removed by hysteroscopic surgery.",
      },

      { type: "heading", level: 2, text: "Red flags" },
      {
        type: "table",
        headers: ["Presentation", "Concern", "Action"],
        rows: [
          ["Post-menopausal bleeding of any amount", "Endometrial carcinoma in about 10 per cent of such women", "Urgent transvaginal ultrasound and endometrial sampling; a two-week cancer pathway referral"],
          ["Post-coital bleeding", "Cervical carcinoma until excluded", "Cervical examination and sampling, urgent referral if a lesion is seen"],
          ["Persistent intermenstrual bleeding of new onset", "Structural lesion or endometrial pathology", "Ultrasound and hysteroscopy"],
          ["Heavy bleeding with a raised body mass index, hypertension, diabetes or polycystic ovary syndrome", "Chronic unopposed oestrogen with endometrial hyperplasia and carcinoma", "Endometrial biopsy before starting treatment"],
          ["Bleeding with severe anaemia or with symptoms requiring transfusion", "The severity of the blood loss itself", "Urgent admission and haemoglobin correction"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Every post-menopausal bleeding must be investigated, and atrophic change is a diagnosis made after a normal examination, a normal ultrasound and a negative endometrial sample — not before them. Attributing the bleeding to atrophy is the commonest way that endometrial carcinoma is missed."
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying an endometrial biopsy is only needed above the age of 55. It is needed at 45 and above, and at any age where bleeding persists, where there are risk factors, or where a hormonal treatment has not worked — the younger woman with polycystic ovary syndrome is a woman with endometrial cancer risk."
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing heavy menstrual bleeding with anovulatory bleeding. Heavy menstrual bleeding is cyclical, often painful, and ovulatory; anovulatory bleeding is irregular, unpredictable, and caused by unopposed oestrogen, and it is treated with a progestogen rather than an antifibrinolytic."
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying tranexamic acid or a non-steroidal anti-inflammatory drug treats the cause of the bleeding. They reduce the volume of the loss; treating the cause means treating the fibroid, the polyp, the endometrium or the anovulation, and reserving surgery for the cause that will not otherwise stop."
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What does PALM-COEIN stand for, and how does it differ from the classification of normal bleeding?",
        answer: "PALM are the structural causes — polyp, adenomyosis, leiomyoma and malignancy with hyperplasia — and COEIN are the non-structural ones: coagulopathy, ovulatory dysfunction, endometrial, iatrogenic and not yet classified. Abnormal uterine bleeding is defined by its effect on the woman's life, not by a fixed volume, because a loss of 30 millilitres may incapacitate one woman while a loss of 100 millilitres is tolerated by another.",
        explanation: "The system is used because it separates what is seen on imaging from what is a disorder of the cycle, and that separation decides whether the treatment is surgical or pharmacological.",
      },
      {
        type: "question",
        prompt: "How is post-menopausal bleeding investigated, and what cut-off is used?",
        answer: "By history and examination including the cervix, a transvaginal ultrasound for endometrial thickness, and endometrial sampling where the thickness is more than 4 millimetres, the bleeding persists, or there is bleeding on tamoxifen. A thickness of 4 millilitres or less makes cancer unlikely.",
        explanation: "Post-menopausal bleeding is cancer until excluded, and the diagnosis of atrophic change is a diagnosis made after those tests, not before them.",
      },
      {
        type: "question",
        prompt: "Which treatments reduce menstrual blood loss, and by how much?",
        answer: "The levonorgestrel intrauterine system reduces blood loss by about 90 per cent within a year and is first-line; tranexamic acid reduces it by about half and can be combined with a hormonal method; and non-steroidal anti-inflammatory drugs, used during the period, reduce both the bleeding and the dysmenorrhoea.",
        explanation: "The choice among them is decided by the woman's desire for contraception, the presence of dysmenorrhoea, and the need to avoid systemic hormones.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which cervical appearances suggest that a woman's heavy menstrual bleeding is caused by a structural cause?",
        options: [
          "A regular cycle with a normal endometrial thickness on ultrasound",
          "A submucous fibroid or an endometrial polyp distorting the cavity",
          "A haemoglobin of 130 grams per litre and a body mass index of 28",
          "Anovulatory cycles at 48 years",
        ],
        correctIndex: 1,
        explanation: "PALM names the structural causes of abnormal uterine bleeding: polyp, adenomyosis, leiomyoma and malignancy or hyperplasia. A cavity-distorting fibroid or polyp is a mechanical bleeding source and is treated by removal, not by thinning the endometrium.",
      },
      {
        type: "mcq",
        stem: "Which is the first-line treatment of heavy menstrual bleeding in a woman who needs contraception?",
        options: [
          "Tranexamic acid during the period",
          "A levonorgestrel intrauterine system",
          "Endometrial ablation",
          "A combined oral contraceptive pill",
        ],
        correctIndex: 1,
        explanation: "The levonorgestrel intrauterine system is first-line: it reduces blood loss by about 90 per cent within a year, provides contraception and treats dysmenorrhoea, with no systemic oestrogen. Tranexamic acid is an adjunct, and ablation only after the malignancy has been excluded and fertility is not wanted.",
      },
      {
        type: "mcq",
        stem: "What is the endometrial thickness cut-off on transvaginal ultrasound below which endometrial cancer is unlikely in post-menopausal bleeding?",
        options: ["2 millimetres", "4 millimetres", "8 millimetres", "There is no cut-off"],
        correctIndex: 1,
        explanation: "With an endometrial thickness of 4 millimetres or less on transvaginal ultrasound, endometrial cancer is unlikely, and unless the bleeding persists or the woman is taking tamoxifen the endometrium is not sampled.",
      },
      {
        type: "mcq",
        stem: "A 36-year-old woman with polycystic ovary syndrome has heavy irregular bleeding. Which endometrial risk should be considered before treating the bleeding?",
        options: [
          "No risk is increased in polycystic ovary syndrome",
          "Endometrial hyperplasia and carcinoma from chronic unopposed oestrogen, and the endometrium must be sampled",
          "The risk is of endometrial cancer only above the age of 50",
          "The risk is of a coagulopathy, and a coagulation screen must be taken first",
        ],
        correctIndex: 1,
        explanation: "Anovulatory cycles expose the endometrium to unopposed oestrogen, which produces hyperplasia and long-term carcinoma risk, so the endometrium is sampled in a woman with polycystic ovary syndrome and persistent irregular bleeding regardless of her age.",
      },
      {
        type: "mcq",
        stem: "Which intervention is reserved for the woman whose family is complete and whose bleeding has not responded to medical treatment?",
        options: [
          "A levonorgestrel intrauterine system",
          "A hysterectomy, after the pathology has been excluded",
          "An oral progestogen",
          "A transfusion of packed red cells",
        ],
        correctIndex: 1,
        explanation: "The hysterectomy is definitive and is reserved for the woman with no further fertility wish in whom the medical treatments have failed and the cause has been established. Ablation is the alternative for a woman whose uterus is not large and who does not want children.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Abnormal uterine bleeding is classified by the structural causes (polyp, adenomyosis, leiomyoma, malignancy) and the non-structural ones (coagulopathy, ovulatory dysfunction, endometrial, iatrogenic, not yet classified), and by the pattern of bleeding, which is the first thing to ask about. Investigation is a full blood count, a transvaginal ultrasound, endometrial sampling where indicated, and hysteroscopy for focal lesions. The levonorgestrel intrauterine system is the first-line treatment of heavy menstrual bleeding, tranexamic acid and non-steroidal anti-inflammatory drugs reduce the flow, and surgery treats the structural cause. Post-menopausal and post-coital bleeding are cancer until excluded, with a 4 millimetre endometrial thickness as the threshold for sampling.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 14 — Pelvic organ prolapse and urinary incontinence
// ---------------------------------------------------------------------------
function lesson14() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the supports of the pelvic organs and the mechanism of their failure; classify prolapse by compartment and by stage using the POP-Q system; describe the conservative and surgical management of prolapse; distinguish stress, urge and mixed urinary incontinence and the other types; outline the investigation of incontinence; and describe the first-line and second-line treatments for each type, recognising the presentations that must not be treated as a prolapse or as incontinence.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (the supports of the uterus and the pelvic floor) and lesson 3 (the consequences of the menopausal fall in oestrogen). Prolapse and incontinence are the two disorders of the supportive tissues of the pelvic floor.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Pelvic organ prolapse",
        text: "The descent of the pelvic organs — the uterus, the vaginal walls, the bladder or the rectum — through the vaginal opening, caused by the weakening of the supporting ligaments and of the pelvic floor muscles.",
      },
      {
        type: "paragraph",
        text: "The single idea is that the support of the pelvic organs has three levels, and prolapse is a failure of all three, or of any combination: the connective tissue of the uterosacral and cardinal ligaments suspends the uterus at the apex, the endopelvic fascial attachments support the anterior and posterior vaginal walls, and the levator ani muscles of the pelvic floor provide the active floor. Childbirth, ageing, and the menopausal fall in oestrogen attack all three, and every successful treatment — of support, or of its loss — works by restoring one of them.",
      },

      { type: "heading", level: 2, text: "Worked example: classification and presentation" },
      {
        type: "table",
        headers: ["Site of descent", "Name", "Symptom"],
        rows: [
          ["Anterior vaginal wall", "Anterior prolapse, a cystourethrocele (and a cystocele if the bladder descends)", "A vaginal bulge, incomplete emptying of the bladder, and frequency; the prolapse may kink the urethra and so cause retention"],
          ["Posterior vaginal wall", "Posterior prolapse, a rectocele", "A vaginal bulge, incomplete emptying of the rectum, and the need to support or press on the back of the vagina to open the bowel (splinting)"],
          ["Uterus or vaginal vault", "Uterine prolapse, or a vault prolapse after a hysterectomy", "A bulge, dragging pain, and a difficulty walking or sitting, and at its worst an ulcerated, protruding cervix"],
          ["Small bowel in the posterior wall", "Enterocele", "Usually found at surgery and rarely diagnosed clinically; a cause of an apparently persistent bulge after a repair"],
        ],
      },
      {
        type: "table",
        headers: ["POP-Q stage", "Definition"],
        rows: [
          ["Stage 0", "No prolapse: the most distal part of the vaginal wall lies above the hymen"],
          ["Stage I", "The most distal part is more than one centimetre above the hymen"],
          ["Stage II", "The most distal part lies within one centimetre of the hymen (above or below it)"],
          ["Stage III", "The most distal part protrudes more than one centimetre beyond the hymen, but no farther than two centimetres less than the total vaginal length"],
          ["Stage IV", "Complete eversion of the vagina, with the most distal point beyond two centimetres less than the total vaginal length"],
        ],
      },
      {
        type: "paragraph",
        text: "The symptoms are the patient's, and the staging is the examiner's: they correlate poorly, and the first question is what the woman wants changed. The most disabling symptom is usually the bulge and the awareness of the descent, and a woman with a stage II descent whose only symptom is a bulge responds well to conservative treatment.",
      },

      { type: "heading", level: 2, text: "Management of prolapse" },
      {
        type: "table",
        headers: ["Treatment", "Details and use"],
        rows: [
          ["Pelvic floor muscle training", "Supervised training of the levator ani muscles for at least three months; it is the first-line treatment of a symptomatic stage I or II prolapse, and it is also the treatment for coexisting stress incontinence"],
          ["Lifestyle", "Weight loss where the body mass index is raised, treating constipation with fibre and fluid, and avoiding straining and heavy lifting, which are the factors that worsen the descent"],
          ["Vaginal oestrogen", "A topical oestrogen cream or pessary for the woman with atrophy, which improves the epithelium and helps pessary use; it may be used in every post-menopausal woman with a prolapse"],
          ["A pessary", "A ring, shelf or other device that holds the prolapse inside the vagina; particularly useful where the woman wants to avoid or is unfit for surgery, during pregnancy, or while awaiting an operation; changed every four to six months, and complications are discharge, bleeding if neglected, and ulceration"],
          ["Reconstructive surgery", "An anterior repair, a posterior repair, or a Manchester repair, or for a vault prolapse a sacrospinous fixation; the operation is chosen by the compartment that is prolapsing and is combined with a hysterectomy or without one"],
          ["Sacrocolpopexy and colpocleisis", "An abdominal mesh suspension is reserved for the recurrent or high vault prolapse where a vaginal route is unsuitable; colpocleisis, the closure of the vagina, is reserved for the very frail woman with no wish for future intercourse"],
          ["Hysterectomy", "For a uterine prolapse, by the vaginal route, where the woman's family is complete and a uterine-preserving option is not preferred; it does not treat the compartment unless the surgery is designed to do so"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The risks to be counseled about before a prolapse repair are: the recurrence of the prolapse (about one in three), the new onset of stress incontinence or the worsening of the urgency that was there before, the risk of dyspareunia after a posterior repair, and the possibility of needing mesh where a native-tissue repair fails.",
      },

      { type: "heading", level: 2, text: "Worked example: urinary incontinence" },
      {
        type: "table",
        headers: ["Type", "Definition", "Mechanism"],
        rows: [
          ["Stress incontinence", "Involuntary leakage of urine on effort or exertion, or on sneezing or coughing", "The urethra is not supported, and the pressure rise is transmitted to the bladder rather than the urethra, so the urethral sphincter cannot resist"],
          ["Urge incontinence", "Involuntary leakage accompanied by or immediately preceded by urgency", "Detrusor overactivity, usually with no neurological disease; the bladder contracts when it should not"],
          ["Mixed", "Both stress and urge leakage", "The commonest type in older women, and the symptom of urgency usually decides the outcome of treatment"],
          ["Overflow incontinence", "Leakage from a chronically full bladder", "Chronic retention from an underactive detrusor or bladder outlet obstruction, with continuous dribbling, a distended palpable bladder and a large post-void residual urine"],
          ["Continuous leakage", "Loss of urine all the time", "A vesicovaginal or ureterovaginal fistula, until excluded by examination and studies"],
          ["Insensible and nocturnal enuresis", "Leakage without awareness, or during sleep", "A neurological lesion, or a severe detrusor overactivity, and a gynaecological and urological assessment is needed"],
        ],
      },
      {
        type: "paragraph",
        text: "The first assessment of incontinence is the simple one: the diary of the leakage over three days, the urinalysis to exclude infection, the post-void residual urine to exclude retention, and the examination to look for atrophy, a prolapse and a pelvic mass. Cystometry, the measurement of bladder pressures during filling and voiding, is used where the type is unclear, where surgery is considered, or where the treatment has failed.",
      },
      {
        type: "table",
        headers: ["Treatment", "Indication and use"],
        rows: [
          ["Supervised pelvic floor muscle training", "Stress incontinence: at least three months of supervised training, with more than 90 per cent of women able to perform it correctly only with instruction; the first-line treatment"],
          ["Duloxetine", "Stress incontinence that has not responded to training, and where surgery is not wanted; it increases urethral striated muscle tone"],
          ["Mid-urethral tape or a fascial sling", "Surgery for persistent stress incontinence: a tape that supports the mid-urethra; the retropubic mid-urethral tape is the commonest, and complications include voiding difficulty, urgency and, rarely, erosion of the tape"],
          ["Colposuspension", "An alternative operation for the woman who is having an abdominal procedure at the same time"],
          ["Bladder training", "Urge incontinence: a scheduled voiding programme with progressively increasing intervals, for at least six weeks; the first-line treatment"],
          ["Antimuscarinic drugs (oxybutynin, solifenacin, tolterodine)", "Urge incontinence, with the caveats of dry mouth, constipation, blurred vision and confusion in older women"],
          ["Mirabegron, a beta-3 agonist", "Urge incontinence where the antimuscarinics are not tolerated; it has fewer cognitive effects and may raise blood pressure"],
          ["Onabotulinumtoxin A injected into the detrusor", "Refractory urge incontinence; the price is the risk of retention and the need for intermittent self-catheterisation"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Red flags in a woman with incontinence: haematuria, recurrent urinary tract infection, palpable bladder, continuous leakage, new-onset leakage with neurological symptoms and a prolapse that has ulcerated or that cannot be reduced. These are not prolapse and not ordinary incontinence, and they are investigated accordingly.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying stress incontinence and urge incontinence are treated in the same way. The stress leakage is the failure of support and is treated by supporting the urethra — by training and then by surgery; the urge leakage is the bladder contracting and is treated by training the bladder and by antimuscarinic drugs, which make stress leakage worse rather than better.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a pessary is a permanent alternative to surgery. It is a supportive device with complications — discharge, bleeding, ulceration and neglect — and it must be changed every four to six months, and vaginal oestrogen improves the woman's tolerance of it.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying prolapse can be treated by a hysterectomy alone. The hysterectomy removes the uterus but does not restore the supports of the anterior and posterior walls, and a prolapse repair has to address the compartment that has descended.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What are the three levels of support that fail in pelvic organ prolapse?",
        answer: "The connective tissue suspending the apex — the uterosacral and cardinal ligaments; the endopelvic fascial attachments of the anterior and posterior vaginal walls; and the levator ani muscles of the pelvic floor. A failure of any of them produces a prolapse of the corresponding compartment, and the management restores one of the three.",
        explanation: "The three levels of the Enders description explain why a woman with a cystocele and a woman with a vault prolapse need different operations.",
      },
      {
        type: "question",
        prompt: "How is the POP-Q classification used, and how are the stages defined?",
        answer: "By measuring the position of the most distal part of the prolapse against the hymen. Stage 0 is no descent, stage I is more than one centimetre above the hymen, stage II lies within one centimetre of the hymen, stage III protrudes more than one centimetre beyond it, and stage IV is complete eversion of the vagina.",
        explanation: "The system exists because a woman's symptoms do not correlate with the anatomy, and the surgery is chosen by the compartment and the extent of the descent.",
      },
      {
        type: "question",
        prompt: "What are the first-line treatments of stress and urge incontinence?",
        answer: "Stress incontinence: at least three months of supervised pelvic floor muscle training. Urge incontinence: at least six weeks of bladder training, with a fluid and caffeine review. Drug treatment — duloxetine for stress and antimuscarinic drugs or mirabegron for urge — is the second line.",
        explanation: "The first line in both is behavioural, and the drugs act on the muscle of the urethra in the former and the muscle of the bladder in the latter, which is why they are not interchangeable.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which structure is most responsible for the active support of the pelvic floor?",
        options: [
          "The round ligaments of the uterus",
          "The levator ani muscles of the pelvic floor",
          "The broad ligaments",
          "The uterine artery",
        ],
        correctIndex: 1,
        explanation: "The active support is the levator ani muscle, and the passive support is the uterosacral and cardinal ligaments and the endopelvic fascia. The round ligament and the broad ligament are surgical landmarks rather than supports.",
      },
      {
        type: "mcq",
        stem: "A woman has a bulge that protrudes beyond the hymen on straining, with incomplete emptying of the bladder. Which is the commonest specific finding on examination?",
        options: [
          "A posterior wall prolapse with the bulging of the rectum",
          "An anterior wall prolapse, a cystourethrocele",
          "A vault prolapse after a previous hysterectomy",
          "A normal examination, because the prolapse only appears under anaesthesia",
        ],
        correctIndex: 1,
        explanation: "The anterior compartment is the commonest, and the woman presents with a bulge, frequency and incomplete emptying of the bladder. Posterior prolapse produces the rectal symptoms of splinting and incomplete emptying.",
      },
      {
        type: "mcq",
        stem: "What is the first-line treatment of a symptomatic stage II uterine prolapse in a woman who does not wish to have surgery?",
        options: [
          "A hysterectomy with a Manchester repair",
          "Pelvic floor muscle training, weight loss, the treatment of constipation, and a ring pessary",
          "Colpocleisis",
          "Abdominal sacrocolpopexy with mesh",
        ],
        correctIndex: 1,
        explanation: "Conservative management — pelvic floor training, the treatment of the factors that raise the intra-abdominal pressure, and a pessary — is offered first and is effective for a large proportion of women; the surgical options are reserved for when it fails or is not wanted.",
      },
      {
        type: "mcq",
        stem: "How often should a ring pessary be changed?",
        options: ["Every month", "Every four to six months", "Every two years", "It never needs changing"],
        correctIndex: 1,
        explanation: "A ring pessary is changed every four to six months, with the vagina inspected for ulceration and pressure effects and topical oestrogen offered to the woman with atrophy; neglect causes discharge, ulceration, bleeding and fistula.",
      },
      {
        type: "mcq",
        stem: "A 55-year-old woman leaks urine when she coughs and sneezes. Which treatment is first-line?",
        options: [
          "Antimuscarinic drugs such as oxybutynin",
          "Supervised pelvic floor muscle training for at least three months",
          "A mid-urethral tape as the initial treatment",
          "A duloxetine tablet and no other intervention",
        ],
        correctIndex: 1,
        explanation: "Supervised pelvic floor muscle training for at least three months is the first-line treatment of stress incontinence; antimuscarinic drugs are for urge incontinence and would make stress leakage worse, and the tape is the second line.",
      },
      {
        type: "mcq",
        stem: "Which presentation in a woman with urinary incontinence must be investigated urgently rather than treated as an ordinary incontinence?",
        options: [
          "Leakage on coughing and sneezing, of gradual onset since the menopause",
          "Continuous leakage day and night in a woman who has had pelvic surgery",
          "Leakage with urgency and frequency for ten years",
          "Leakage of a few drops on running",
        ],
        correctIndex: 1,
        explanation: "Continuous leakage suggests a fistula, particularly in a woman who has had pelvic surgery or radiotherapy, and it is investigated by examination, dye studies and urological referral; the gradual stress and the long-standing urge patterns are the ordinary types.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Prolapse is a failure of the three levels of support — the apical connective tissue, the endopelvic fascia and the levator ani — classified by compartment and by the POP-Q stage, and treated first by pelvic floor training, weight loss, the treatment of constipation, vaginal oestrogen and a pessary, with the surgery chosen by the compartment that has descended. Incontinence is classified by the mechanism: stress from a urethra that is unsupported, urge from a detrusor that contracts prematurely, and the mixed, overflow and continuous types, and the first-line treatments are behavioural — pelvic floor training and bladder training — with the drugs and surgery as the second line. Haematuria, continuous leakage and a palpable bladder are the findings that must not be treated as either.",
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
  { title: "Antenatal care & assessment", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Antenatal care and assessment of the pregnant woman", slug: "antenatal-care", summary: "The schedule of visits, the assessment of gestational age, the interpretation of the investigations, and the screening programme.", blooms: "apply", minutes: 40, prereq: ["maternal-physiology"] }, content: lesson7() as never },
  { title: "Nutrition, medication & lifestyle in pregnancy", module: 2, estimatedMinutes: 35, authored: false, concept: { title: "Nutrition, medication and lifestyle in pregnancy", slug: "pregnancy-nutrition-medication", summary: "Folic acid and the supplementation, the teratogenic drugs to avoid, the exercise and alcohol advice, and the weight gain of pregnancy.", blooms: "apply", minutes: 35, prereq: ["antenatal-care"] }, content: { blocks: [] } },
  { title: "Prenatal diagnosis & fetal monitoring", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Prenatal diagnosis and fetal monitoring", slug: "prenatal-diagnosis", summary: "The screening tests and their interpretation, amniocentesis and chorionic villus sampling, and the methods of monitoring the fetus.", blooms: "analyze", minutes: 40, prereq: ["antenatal-care"] }, content: { blocks: [] } },
  { title: "Labour, delivery & the normal puerperium", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Labour, delivery and the puerperium", slug: "normal-labour-puerperium", summary: "The stages of labour, the mechanism of vaginal delivery, the management of the third stage, and the postpartum recovery.", blooms: "apply", minutes: 40, prereq: ["maternal-physiology"] }, content: lesson8() as never },

  // --- M3 Labour, delivery & puerperium ---
  { title: "The mechanism of normal labour", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Mechanism of normal labour", slug: "mechanism-of-labour", summary: "Engagement, descent, flexion, internal rotation, extension and restitution, and the pelves of labour.", blooms: "apply", minutes: 40, prereq: ["normal-labour-puerperium"] }, content: { blocks: [] } },
  { title: "Monitoring labour & fetal distress", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "Monitoring labour and fetal distress", slug: "monitoring-labour", summary: "The assessment of contractions and progress, the interpretation of the CTG, and the management of fetal distress.", blooms: "apply", minutes: 40, prereq: ["mechanism-of-labour"] }, content: lesson9() as never },
  { title: "Induction, augmentation & assisted delivery", module: 3, estimatedMinutes: 35, authored: false, concept: { title: "Induction, augmentation and assisted delivery", slug: "induction-assisted-delivery", summary: "Indications for induction, the agents used, and the indications and complications of ventouse and forceps.", blooms: "apply", minutes: 35, prereq: ["mechanism-of-labour"] }, content: { blocks: [] } },
  { title: "Caesarean section", module: 3, estimatedMinutes: 35, authored: false, concept: { title: "Caesarean section", slug: "caesarean-section", summary: "Indications, the technique and anaesthesia, and the immediate and longer-term consequences.", blooms: "apply", minutes: 35, prereq: ["induction-assisted-delivery"] }, content: { blocks: [] } },
  { title: "The puerperium & postpartum problems", module: 3, estimatedMinutes: 35, authored: false, concept: { title: "The puerperium and its problems", slug: "puerperium-problems", summary: "The normal recovery, postpartum haemorrhage, infection, thromboembolism and the psychiatric disorders of the puerperium.", blooms: "apply", minutes: 35, prereq: ["normal-labour-puerperium"] }, content: { blocks: [] } },
  { title: "Jaundice & newborn care", module: 3, estimatedMinutes: 30, authored: false, concept: { title: "Breastfeeding and neonatal care of the newborn", slug: "breastfeeding-newborn", summary: "The physiology of breastfeeding, the common problems, the treatment of jaundice, and the first examination of the newborn.", blooms: "apply", minutes: 30, prereq: ["puerperium-problems"] }, content: { blocks: [] } },

  // --- M4 Obstetric complications ---
  { title: "Haemorrhage in obstetrics", module: 4, estimatedMinutes: 40, authored: true, concept: { title: "Obstetric haemorrhage", slug: "obstetric-haemorrhage", summary: "Antepartum haemorrhage, placenta praevia and abruption, and postpartum haemorrhage: recognition and management.", blooms: "apply", minutes: 45, prereq: ["normal-labour-puerperium", "maternal-physiology"] }, content: lesson10() as never },
  { title: "Hypertensive disease & pre-eclampsia", module: 4, estimatedMinutes: 40, authored: true, concept: { title: "Hypertension in pregnancy", slug: "pre-eclampsia-eclampsia", summary: "Gestational hypertension, pre-eclampsia and eclampsia, their detection and their management.", blooms: "apply", minutes: 40, prereq: [] }, content: lesson11() as never },
  { title: "Preterm labour & premature rupture", module: 4, estimatedMinutes: 35, authored: true, concept: { title: "Preterm labour and premature rupture of membranes", slug: "preterm-labour", summary: "The diagnosis and management of threatened and established preterm labour, and the use of corticosteroids and tocolytics.", blooms: "apply", minutes: 35, prereq: [] }, content: lesson12() as never },
  { title: "Malpresentation & abnormal labour", module: 4, estimatedMinutes: 35, authored: false, concept: { title: "Breech, malpresentation and abnormal labour", slug: "malpresentation-abnormal-labour", summary: "Breech and other malpresentations, breech delivery and external cephalic version, and the disorders of progress.", blooms: "apply", minutes: 35, prereq: ["mechanism-of-labour"] }, content: { blocks: [] } },
  { title: "Medical complications of pregnancy", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Medical disorders in pregnancy", slug: "medical-disorders-pregnancy", summary: "Diabetes, cardiac, renal, hepatic, haematological, infective and endocrine disease in pregnancy.", blooms: "apply", minutes: 45, prereq: ["maternal-physiology"] }, content: { blocks: [] } },
  { title: "Maternal mortality & clinical skills", module: 4, estimatedMinutes: 30, authored: false, concept: { title: "Maternal mortality and clinical skills", slug: "maternal-mortality-skills", summary: "The commonest causes of maternal death, the risk factors, and the management of maternal collapse and the neonatal resuscitation.", blooms: "apply", minutes: 30, prereq: [] }, content: { blocks: [] } },

  // --- M5 Gynaecological disorders & oncology ---
  { title: "Abnormal uterine bleeding", module: 5, estimatedMinutes: 35, authored: true, concept: { title: "Abnormal uterine bleeding", slug: "abnormal-uterine-bleeding", summary: "The causes of heavy, irregular and intermenstrual bleeding, the investigation and the medical and surgical treatments.", blooms: "apply", minutes: 35, prereq: ["menstrual-disorders"] }, content: lesson13() as never },
  { title: "Fibroids, polyps & adenomyosis", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Benign uterine disease", slug: "benign-uterine-disease", summary: "Uterine fibroids, endometrial polyps and adenomyosis, their sites and symptoms, and their treatment options.", blooms: "apply", minutes: 35, prereq: ["abnormal-uterine-bleeding"] }, content: { blocks: [] } },
  { title: "Prolapse & urinary incontinence", module: 5, estimatedMinutes: 35, authored: true, concept: { title: "Pelvic organ prolapse and incontinence", slug: "prolapse-incontinence", summary: "The causes and the staging of prolapse, the conservative and surgical treatments, and the types of urinary incontinence.", blooms: "apply", minutes: 35, prereq: ["female-anatomy"] }, content: lesson14() as never },
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

