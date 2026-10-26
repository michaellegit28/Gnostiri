import { prisma, seedMbbsCourse, type LessonSeed, type SbaSeed, type SubjectSeed } from "./spine";

/**
 * PATH 201 — Pathology.
 *
 * Module 1 ("Cell injury, inflammation & repair") is authored in full: 6
 * lessons in the pilot-report format with one SBA item per concept. Everything
 * follows the standard nomenclature in Robbins and Cotran Pathologic Basis of
 * Disease — the reversible-versus-irreversible boundary, coagulative versus
 * liquefactive versus caseous necrosis, the sequence of acute inflammation,
 * and the labile-stable-permanent regeneration rules — and no classification
 * is asserted that is not in that standard.
 *
 * Modules 2-6 (haemodynamic disorders, neoplasia, genetic and immune
 * pathology, environmental pathology, systemic pathology) ship as a real
 * concept spine and prerequisite DAG with tracked-placeholder lessons
 * (needsCheck true).
 *
 * Requires prisma/seed-university.ts first (faculty, department, programme).
 */

const COURSE_SLUG = "pathology-cell-injury-repair";

const MODULES = [
  { slug: "cell-injury-inflammation-repair", title: "M1 — Cell injury, inflammation & repair" },
  { slug: "haemodynamic-disorders", title: "M2 — Haemodynamic disorders & thrombosis" },
  { slug: "neoplasia", title: "M3 — Neoplasia" },
  { slug: "genetic-immune-pathology", title: "M4 — Genetic & immune-mediated disease" },
  { slug: "environmental-pathology", title: "M5 — Environmental & nutritional pathology" },
  { slug: "systemic-pathology", title: "M6 — Systemic pathology" },
];

// ---------------------------------------------------------------------------
// LESSON 1 — Causes and morphology of cell injury (fully authored)
// ---------------------------------------------------------------------------
function lesson1() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: list the causes of cell injury and identify which are commonest; distinguish reversible from irreversible injury by the ultrastructural changes; explain the role of ATP depletion, calcium influx and reactive oxygen species in the sequence towards death; describe the macroscopic and microscopic appearances of the main patterns of necrosis; contrast necrosis with apoptosis in mechanism and consequences; and predict the pattern of necrosis in a given organ and cause.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "None. This is the first lesson of the pathology course. It assumes no prior medical course, though the physiology of membrane transport (PHYS 101, module 1) deepens the explanation of swelling.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Cell injury",
        text: "The disturbance of a cell's structure or function by a stress that exceeds its adaptive capacity, ranging from mild and reversible through adaptive change, to irreversible injury and death.",
      },
      {
        type: "paragraph",
        text: "Pathology begins here, because every disease is ultimately an injury — to a group of cells, to the tissue they form, or to the organs they build. The most useful thing to internalise at the start is that injury is not a binary event. A cell responds with adaptation first: it may enlarge (hypertrophy), multiply (hyperplasia), shrink (atrophy), or change its type (metaplasia). If the stress persists and exceeds that reserve, injury begins, and it begins reversibly: the cell swells, its membrane blebs, its chromatin clumps, but the damage can still be undone if the stress is removed. Beyond a point that is called the point of no return, injury becomes irreversible and the cell dies.",
      },

      { type: "heading", level: 2, text: "Causes of injury" },
      {
        type: "table",
        headers: ["Cause", "Mechanism", "Example"],
        rows: [
          ["Hypoxia (oxygen deficiency)", "The mitochondrion cannot oxidise substrate, so ATP fails", "Ischaemia, anaemia, carbon monoxide poisoning, high altitude"],
          ["Physical agents", "Direct mechanical destruction of cells and tissue", "Trauma, extremes of temperature, radiation, electric shock"],
          ["Chemical agents and drugs", "Direct toxicity, or reactive metabolites", "Paracetamol in overdose, carbon tetrachloride, chemotherapy agents"],
          ["Microbiological agents", "Direct killing, toxins, or host inflammatory damage", "Viruses, bacteria, fungi, protozoa, prions"],
          ["Immunological reactions", "Excessive or misdirected inflammation", "Autoimmune disease, allergic reactions"],
          ["Genetic factors", "A protein that cannot fold or function correctly", "Sickle cell disease, cystic fibrosis, the inherited enzyme defects"],
          ["Nutritional imbalances", "Deficiency of a required nutrient, or excess", "Protein-energy malnutrition, scurvy, iron overload, obesity"],
        ],
      },
      {
        type: "paragraph",
        text: "Hypoxia is the commonest, and it is worth being precise about the difference between hypoxia and ischaemia. Hypoxia is the absence of oxygen. Ischaemia is the loss of blood supply, which means oxygen is absent and nutrients are not delivered and waste is not removed — so ischaemic injury is worse than equivalent oxygen deficiency alone. This is why a blocked coronary artery damages the heart more severely than the same oxygen tension achieved by simple anaemia.",
      },

      { type: "heading", level: 2, text: "Reversible versus irreversible injury" },
      {
        type: "table",
        headers: ["Feature", "Reversible injury", "Irreversible injury"],
        rows: [
          ["Cell volume", "Swollen, with loss of microvilli and small blebs of membrane", "Swollen, with extensive membrane blebbing and rupture"],
          ["Energy state", "ATP falls, and the sodium-potassium pump fails, so sodium and water enter", "Mitochondria are so damaged that ATP cannot be regenerated at all"],
          ["Calcium", "Begins to accumulate slightly", "Massive accumulation in the cytosol, activating enzymes that digest the cell"],
          ["Nucleus", "Chromatin clumps at the margin", "The nucleus breaks up and disappears (karyolysis, pyknosis, karyorrhexis)"],
          ["Consequence", "The cell recovers when the stress is removed", "The cell dies, and necrosis or apoptosis follows"],
        ],
      },
      {
        type: "paragraph",
        text: "The two hallmarks on the right define the point of no return: severe damage to the mitochondria, and massive calcium entry into the cytosol. Both must be present. That is why ischaemic injury becomes irreversible when reperfusion occurs late — the mitochondria cannot pull calcium out on restoration of blood flow, so the accumulated calcium destroys the cell.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Ischaemia-reperfusion injury deserves its own mention. When blood flow is restored to ischaemic tissue, oxygen returns to damaged mitochondria and generates a burst of reactive oxygen species, which adds to the injury rather than reversing it — a mechanism that is directly relevant when restoring flow to a limb after a prolonged arterial occlusion.",
      },

      { type: "heading", level: 2, text: "Patterns of necrosis" },
      {
        type: "definition",
        term: "Necrosis",
        text: "Death of cells within living tissue, characterised by loss of membrane integrity, swelling of organelles, and an inflammatory response to the released contents.",
      },
      {
        type: "table",
        headers: ["Pattern", "Mechanism and gross appearance", "Typical setting"],
        rows: [
          ["Coagulative", "Protein denaturation preserves the tissue outline of the organ for a while; pale, firm, wedge-shaped infarct", "Ischaemic necrosis of most solid organs — heart, kidney, spleen (but not brain)"],
          ["Liquefactive", "Enzyme digestion liquifies the tissue", "Brain infarction, and abscess formation"],
          ["Caseous", "Nodular, grey-white, cheese-like debris with the tissue architecture entirely lost; a granuloma", "Tuberculosis, syphilis, some fungal infections"],
          ["Fat necrosis", "Saponification — the released fatty acids combine with calcium, forming chalky deposits", "Acute pancreatitis (around the pancreas and in the omentum), and fat necrosis of the breast after trauma"],
          ["Gangrenous", "A clinical term, not a separate microscopic type: dry gangrene is coagulative, wet gangrene adds liquefactive infection", "An ischaemic limb, wet gangrene when infected"],
          ["Fibrinoid", "Deposition of fibrin-like material with antibody and antigen complexes in vessel walls", "Immune vasculitis such as polyarteritis nodosa"],
        ],
      },
      {
        type: "paragraph",
        text: "Why is the brain different, so that its infarcts are liquefactive rather than coagulative? Because brain tissue has essentially no supporting fibrous framework to hold a shape once the cells die, and it is rich in lipids and hydrolytic enzymes that digest themselves. The other solid organs have a collagenous stroma that denatures and stays put — the ghost architecture of a renal infarct you can see in a histology section.",
      },

      { type: "heading", level: 2, text: "Apoptosis versus necrosis" },
      {
        type: "table",
        headers: ["Feature", "Necrosis", "Apoptosis"],
        rows: [
          ["Trigger", "A severe external stress — ischaemia, toxin, trauma", "A physiological signal, or a mild/molecular injury too small to destroy a cell outright"],
          ["Cell volume", "Swelling", "Shrinkage, with compaction of chromatin at the nuclear margin"],
          ["Membrane", "Disrupted, so contents leak into the tissue", "Intact, but the surface changes so that the cell is recognised and eaten"],
          ["Energy", "ATP has failed, so everything is passive", "ATP is required — apoptosis is an active, gene-directed programme"],
          ["Inflammation", "Marked, because the contents spill out", "Absent, because the contents are contained and phagocytosed"],
          ["Molecular mechanism", "Mitochondrial failure and calcium overload", "Caspases — the intrinsic mitochondrial pathway and the extrinsic death-receptor pathway"],
          ["Physiological role", "Almost always pathological", "Embryonic sculpting, immune deletion, and defence against viruses"],
        ],
      },
      {
        type: "paragraph",
        text: "The practical distinction is the one that matters clinically. Apoptosis removes a cell without disturbing its neighbours — which is why the liver clears an apoptotic hepatocyte silently, and why in viral hepatitis you see isolated shrunken acidophil bodies (Councilman bodies) among otherwise healthy hepatocytes. Necrosis cannot avoid a mess, so it always calls in inflammation, and every subsequent chapter of pathology — fever, swelling, a raised C-reactive protein — follows from that inflammatory response to dead tissue.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a cell dies as soon as it swells. Swelling is hydropic change and is fully reversible: it is the pump failing, not the cell dying. The point of no return is mitochondrial failure plus massive calcium entry.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Calling any ischaemic infarct coagulative. The brain is the exception — its infarcts liquefy. If you are asked about a cerebral infarct, the answer is liquefactive.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Using caseous necrosis and granuloma interchangeably. Caseous necrosis is a pattern of dead tissue; a granuloma is a microscopic focus of activated macrophages, which may or may not contain caseous necrosis.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Which two events define the point of no return between reversible and irreversible cell injury?",
        answer: "Severe damage to the mitochondria (so ATP cannot be regenerated) and massive calcium influx into the cytosol (activating hydrolytic enzymes).",
        explanation: "Swelling and blebbing alone are reversible. Once both of these occur, the cell cannot recover even if the original stress is removed.",
      },
      {
        type: "question",
        prompt: "A patient has a myocardial infarction. What pattern of necrosis is expected, and what would be expected after a stroke in the same patient?",
        answer: "Coagulative necrosis in the heart — a wedge-shaped, pale infarct whose tissue outline is preserved by denatured proteins — and liquefactive necrosis in the brain, where there is no collagenous stroma to hold the architecture.",
        explanation: "The pattern depends on the tissue, not only on the cause: ischaemia gives coagulative necrosis in most organs but liquefactive in the brain.",
      },
      {
        type: "question",
        prompt: "Why does apoptosis cause less inflammation than necrosis?",
        answer: "Because the cell membrane stays intact and the contents are not released, and because the cell surface changes so neighbouring cells or macrophages engulf and digest it quietly. Necrosis releases the cellular contents into the tissue, which triggers a marked inflammatory response.",
        explanation: "The absence of inflammation is the point of apoptosis: physiological deletion must not disturb the tissue.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which pattern of necrosis is expected in a cerebral infarct?",
        options: ["Coagulative", "Liquefactive", "Caseous", "Fat necrosis"],
        correctIndex: 1,
        explanation: "The brain has no supporting fibrous stroma and is rich in hydrolytic enzymes, so ischaemic necrosis liquefies. Coagulative necrosis is the pattern in most other solid organs.",
      },
      {
        type: "mcq",
        stem: "Which sequence is correct for ischaemic injury becoming irreversible?",
        options: [
          "Nuclear pyknosis first, then mitochondrial failure, then calcium influx",
          "ATP depletion, sodium and water entry and swelling, then mitochondrial damage and calcium influx, then death",
          "Calcium efflux and ATP overproduction",
          "Membrane blebbing without any energy change",
        ],
        correctIndex: 1,
        explanation: "The sequence begins with ATP depletion and pump failure (reversible), progresses through mitochondrial damage and calcium influx, and only then crosses the point of no return.",
      },
      {
        type: "mcq",
        stem: "Which statement about apoptosis is correct?",
        options: [
          "It always triggers inflammation",
          "It is an active, ATP-dependent programme that removes single cells without spilling their contents",
          "It occurs only after ischaemia",
          "It produces chalky deposits in tissue",
        ],
        correctIndex: 1,
        explanation: "Apoptosis is gene-directed and energy-requiring, contains the cellular contents, and is silent. Chalky deposits are the saponification of fat necrosis.",
      },
      {
        type: "mcq",
        stem: "A patient with acute pancreatitis develops chalky white deposits in the omentum. What pattern of necrosis is this?",
        options: ["Coagulative necrosis", "Liquefactive necrosis", "Fat necrosis with saponification", "Fibrinoid necrosis"],
        correctIndex: 2,
        explanation: "Digestive enzymes reaching the peripancreatic fat liberate fatty acids, which combine with calcium to form insoluble soaps — the chalky white patches of fat necrosis.",
      },
      {
        type: "mcq",
        stem: "Which description characterises coagulative necrosis?",
        options: [
          "Liquefaction of the tissue with loss of all architecture", "Preservation of the tissue outline for a few days in a pale, firm wedge-shaped infarct", "A cheese-like nodule in a granuloma", "Deposition of fibrin-like material in vessel walls",
        ],
        correctIndex: 1,
        explanation: "Coagulative necrosis preserves architecture because proteins denature and coagulate, leaving the ghost of the organ's structure intact. Cheese-like is caseous; fibrin-like is fibrinoid.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Cell injury begins with adaptation and becomes death only when the stress exceeds the cell's reserve. The reversible phase is marked by swelling, blebbing and chromatin clumping; the irreversible phase is defined by severe mitochondrial damage and massive calcium influx. Necrosis — death with membrane rupture and inflammation — appears in six patterns depending on the tissue and the cause, while apoptosis is a quiet, ATP-dependent, single-cell programme. Every later topic in pathology is one of these two processes, or the inflammation that follows them.",
      },
      {
        type: "paragraph",
        text: "Next: inflammation. You will follow the sequence of acute inflammation from the first change in blood flow to the arrival and killing of neutrophils, and see what each of its cardinal signs corresponds to.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 2 — Acute inflammation (fully authored)
// ---------------------------------------------------------------------------
function lesson2() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: arrange the sequence of acute inflammation in order; explain the vascular events and why each cardinal sign occurs; describe the five steps of leukocyte recruitment and the adhesion molecules involved; distinguish exudate from transudate; list the chemical mediators and their salient actions; and predict the outcome of an acute inflammatory process in a given clinical setting.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (Causes and morphology of cell injury). Necrosis is the trigger for acute inflammation, and you need it to know why inflammation follows tissue death.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Acute inflammation",
        text: "A rapid, stereotyped protective response to injury, whose essential events are fluid and protein leakage from blood vessels, and the migration of leukocytes — above all neutrophils — out of the bloodstream and into the tissue.",
      },
      {
        type: "paragraph",
        text: "Inflammation is not a malfunction; it is the body's first response, evolved to deliver two things to a site of injury: fluid, which dilutes any toxin, and neutrophils, which will kill invading organisms and clear the debris. Nearly every local clinical sign you will observe — and a large part of what you measure in a blood test — comes from this one process. Learning it in sequence is learning a great deal of clinical medicine at once.",
      },

      { type: "heading", level: 2, text: "The cardinal signs, explained" },
      {
        type: "table",
        headers: ["Sign (Latin)", "Cause"],
        rows: [
          ["Rubor — redness", "Vasodilation, which increases blood flow through the arterioles and capillaries"],
          ["Calor — heat", "The same increased blood flow, from blood warmed deep in the body to the cooler surface"],
          ["Tumor — swelling", "Fluid (oedema) from the leaky vessels accumulating in the tissue"],
          ["Dolor — pain", "Chemical mediators — bradykinin and prostaglandins — acting on nerve endings, and physical pressure from the oedema"],
          ["Functio laesa — loss of function", "Not part of the original list: added by Virchow, and the practical consequence of pain and swelling"],
        ],
      },
      {
        type: "paragraph",
        text: "The fifth sign was added later, which is why lists differ between textbooks and why you will sometimes be examinated on four and sometimes five.",
      },

      { type: "heading", level: 2, text: "Worked example: the sequence" },
      {
        type: "table",
        headers: ["Step", "What happens", "Timing"],
        rows: [
          ["1. Vasoconstriction", "A brief reflex narrowing of the arterioles at the moment of injury", "Seconds, often clinically invisible"],
          ["2. Vasodilation and increased flow", "Arterioles dilate, so blood flow rises and the tissue becomes red and hot", "Minutes, lasting as long as the stimulus persists"],
          ["3. Increased vascular permeability", "Endothelial cells contract or are damaged, so plasma protein and fluid leave the vessels", "Minutes to hours"],
          ["4. Leukocyte migration", "Leukocytes leave the vessels and move into the tissue", "Hours, continuing over days"],
          ["5. Phagocytosis and killing", "Neutrophils and macrophages engulf and kill bacteria and clear debris", "Hours to days"],
        ],
      },
      {
        type: "paragraph",
        text: "The resulting tissue fluid is called an exudate, and it differs from a transudate — the fluid of a purely hydrostatic oedema — in three measurable ways: a high protein content, a high specific gravity, and the presence of cells. This is the distinction behind one of the most useful tests in clinical practice: the pleural or peritoneal fluid sample classified as transudate or exudate on the basis of those parameters.",
      },
      {
        type: "table",
        headers: ["Property", "Transudate", "Exudate"],
        rows: [
          ["Mechanism", "A hydrostatic or colloid osmotic imbalance", "Increased vascular permeability from inflammation"],
          ["Protein content", "Low", "High"],
          ["Specific gravity", "Below about 1.012", "Above about 1.020"],
          ["Cells", "Few", "Many — neutrophils first, macrophages later"],
          ["Example", "Heart failure, nephrotic syndrome, cirrhosis", "Empyema, pleurisy, an abscess"],
        ],
      },

      { type: "heading", level: 2, text: "Leukocyte recruitment, in five steps" },
      {
        type: "paragraph",
        text: "Neutrophils do not just wander out of blood vessels; they are directed through a sequence of adhesion events, each molecule matched to a counter-molecule. The steps are rolling, activation, firm adhesion, transmigration (diapedesis) and chemotaxis.",
      },
      {
        type: "table",
        headers: ["Step", "Mechanism", "Molecules"],
        rows: [
          ["Rolling", "Cells are marginated to the vessel edge and then tumble along the endothelium", "E-selectin and P-selectin on the endothelium, binding carbohydrate ligands on the leukocyte"],
          ["Activation", "Local mediators stated on the leukocyte surface, making the integrin molecules able to bind", "Chemokines bound to endothelium, activating the leukocyte"],
          ["Firm adhesion", "The leukocyte stops rolling and flattens against the vessel wall", "Leukocyte integrins binding intercellular adhesion molecules (ICAMs) on the endothelium"],
          ["Transmigration", "The cell squeezes between endothelial cells", "Integrins, plus adhesion molecules of the junction itself"],
          ["Chemotaxis", "Directed migration towards the source of the signal", "C5a, leukotriene B4, interleukin-8, and bacterial peptides"],
        ],
      },
      {
        type: "paragraph",
        text: "The molecular detail is worth knowing for one clinical reason: congenital defects in this machinery are rare but instructive. Leukocyte adhesion deficiency is a failure of the beta-integrin molecule, and its patients get recurrent bacterial infections with little pus formation — because neutrophils cannot leave the vessels into the tissues where the organisms are. A lack of pus is not a mild sign in that setting; it is a sign that the cells cannot get out of the blood.",
      },

      { type: "heading", level: 2, text: "Chemical mediators" },
      {
        type: "table",
        headers: ["Mediator", "Source", "Principal action"],
        rows: [
          ["Histamine", "Mast cells and basophils", "The immediate, brief vasodilation and increase in permeability"],
          ["Bradykinin", "Plasma (kallikrein-kinin system)", "Vasodilation, permeability, and pain"],
          ["Prostaglandins", "Cyclo-oxygenase pathway of arachidonic acid", "Vasodilation, pain, and fever"],
          ["Leukotrienes", "Lipoxygenase pathway of arachidonic acid", "The leukotrienes (particularly LTB4) attract neutrophils; the cysteinyl leukotrienes constrict bronchi"],
          ["Nitric oxide", "Endothelium and macrophages", "Sustained vasodilation, and microbial killing inside macrophages"],
          ["Complement C3a, C5a", "Plasma proteins activated by microbes and antibody", "Chemotaxis, opsonisation, and mast cell degranulation"],
          ["Tumor necrosis factor and interleukin-1", "Macrophages", "Endothelial activation, fever, and the acute phase response"],
          ["Interleukin-8", "Macrophages and endothelium", "Recruitment of neutrophils"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The link to treatment is direct. Non-steroidal anti-inflammatory drugs inhibit cyclo-oxygenase and therefore block prostaglandin synthesis — pain, fever and vasodilation all fall. Steroids inhibit the synthesis of both prostaglandins and leukotrienes, which is why they suppress inflammation more broadly but at more cost.",
      },

      { type: "heading", level: 2, text: "Outcomes of acute inflammation" },
      {
        type: "table",
        headers: ["Outcome", "When it happens", "Consequence"],
        rows: [
          ["Resolution", "The injury was mild, the tissue can regenerate", "Full restoration, with nothing left behind"],
          ["Organisation and repair", "The tissue cannot regenerate, or the injury was substantial", "Replacement by granulation tissue and then a scar"],
          ["Suppuration", "The infecting organism is pyogenic, so pus forms", "An abscess, which needs drainage"],
          ["Progression to chronic inflammation", "The stimulus persists — a foreign body, a resistant organism, an autoimmune process", "Lymphocytes and macrophages accumulate, with attempts at repair running alongside"],
          ["Systemic response", "The response is large enough to affect the whole body", "Fever, a raised white cell count, a raised C-reactive protein, and malaise"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the neutrophils are recruited by a single chemokine. Several molecules act as chemotactic agents — C5a, leukotriene B4, interleukin-8 and bacterial peptides — and they act on a common set of receptors.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing exudate with pus. Pus is an exudate rich in dead and dying neutrophils and tissue, and it is the hallmark of pyogenic infection; a pleural exudate of heart-failure-like transudate has almost no cells.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the vascular permeability is due to pressure. It is due to endothelial contraction and injury, mediated by histamine, bradykinin and leukotrienes, not to a hydrostatic gradient.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What are the four cardinal signs of acute inflammation and what causes each?",
        answer: "Rubor and calor are from vasodilation and increased blood flow; tumor from fluid leaking into the tissue; dolor from bradykinin and prostaglandins acting on nerve endings. Loss of function (functio laesa) is the fifth sign.",
        explanation: "Every clinical sign maps onto one of the vascular events — which is why reading a sign tells you what is happening in the vessels.",
      },
      {
        type: "question",
        prompt: "Which adhesion molecules cause a neutrophil to stop rolling and adhere firmly to the endothelium?",
        answer: "The leukocyte integrins binding intercellular adhesion molecules on the activated endothelial surface.",
        explanation: "Selectins cause the rolling; integrins, activated by chemokine signals, cause the firm adhesion that precedes transmigration.",
      },
      {
        type: "question",
        prompt: "A sample of pleural fluid has a protein content of 45 g per litre, a specific gravity of 1.030 and many neutrophils. What is it?",
        answer: "An exudate — high protein, high specific gravity and many cells — consistent with an inflammatory process such as empyema, not the low-protein, low-cell transudate of heart failure.",
        explanation: "The transudate-versus-exudate distinction is the first branch in interpreting any body fluid sample.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which mediator is most responsible for the immediate, transient increase in vascular permeability at the onset of acute inflammation?",
        options: ["Histamine", "Leukotriene B4", "Interleukin-8", "Nitric oxide"],
        correctIndex: 0,
        explanation: "Histamine released from mast cells and basophils causes the early brief vasodilation and endothelial contraction. Leukotriene B4 and interleukin-8 are chemotactic; nitric oxide causes the sustained vasodilation.",
      },
      {
        type: "mcq",
        stem: "Which molecule is responsible for the rolling of leukocytes along the endothelium?",
        options: ["Integrins", "Selectins", "Immunoglobulins", "Complement C3b"],
        correctIndex: 1,
        explanation: "E-selectin and P-selectin on the activated endothelium bind carbohydrate ligands on the leukocyte and mediate rolling. Integrins are responsible for the subsequent firm adhesion.",
      },
      {
        type: "mcq",
        stem: "A pleural fluid sample has a protein content of 20 g per litre, a specific gravity of 1.010 and very few cells. What does it represent?",
        options: ["An exudate", "A transudate", "Pus", "A chylous effusion"],
        correctIndex: 1,
        explanation: "Low protein, low specific gravity and few cells describe a transudate — a fluid produced by a hydrostatic or osmotic imbalance, as in heart failure, and not by inflammation.",
      },
      {
        type: "mcq",
        stem: "Which statement about prostaglandins in inflammation is correct?",
        options: [
          "They are secreted by mast cells and cause the brief permeability phase",
          "They are produced by the cyclo-oxygenase pathway and generate pain, fever and vasodilation",
          "They are produced by the lipoxygenase pathway and attract neutrophils",
          "They inhibit the inflammatory response",
        ],
        correctIndex: 1,
        explanation: "Prostaglandins come from cyclo-oxygenase and mediate pain, fever and vasodilation; the leukotrienes come from lipoxygenase and attract neutrophils and constrict bronchi.",
      },
      {
        type: "mcq",
        stem: "Why does inflammation rarely cause damage in the absence of infection?",
        options: [
          "Because the chemical mediators are not produced", "Because the sequence of resolution and repair is followed once the stimulus is removed", "Because there are no leukocytes involved", "Because vascular permeability never occurs",
        ],
        correctIndex: 1,
        explanation: "Acute inflammation is a short, self-limiting programme: once the stimulus is removed and debris is cleared, the response stops and the tissue either regenerates or is repaired.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Acute inflammation is a protective sequence: transient vasoconstriction, then vasodilation and increased blood flow, then endothelial contraction and plasma leakage, then leukocyte migration through rolling, activation, adhesion, transmigration and chemotaxis, and finally phagocytosis and killing. The resulting exudate is high-protein and cell-rich, unlike a transudate. Its mediators — histamine, bradykinin, prostaglandins, leukotrienes, complement, cytokines and nitric oxide — are the targets of almost every anti-inflammatory drug, and the outcomes range from complete resolution through repair and suppuration to progression into chronic inflammation.",
      },
      {
        type: "paragraph",
        text: "Next: repair and healing. You will learn why some tissues regenerate and others scar, how granulation tissue is built, and what local and systemic factors decide whether a wound heals well.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 3 — Repair, regeneration & wound healing (fully authored)
// ---------------------------------------------------------------------------
function lesson3() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: classify tissues by their regenerative capacity into labile, stable and permanent; describe the stages of wound healing and the order in which they occur; name the cells and extracellular components of granulation tissue; distinguish healing by first intention from healing by second intention; list the local and systemic factors that impair healing; and state what proportion of original tensile strength a scar eventually reaches.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-2. You need cell injury and acute inflammation, because repair is what happens when inflammation has removed the injurious agent.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Repair",
        text: "The restoration of tissue continuity after injury, achieved either by regeneration (replacement by the same kind of cells) or by scar formation (replacement by connective tissue), or by a combination of the two.",
      },
      {
        type: "paragraph",
        text: "Every healing process is a race between two outcomes for the damaged area. If the tissue can still divide, it will regenerate and replace exactly what was lost. If it cannot — because the cells are permanent, or because there is too much damage — then the gap is filled with connective tissue: a scar. The decision is made by the tissue itself, which is why a skin graze heals perfectly and a deep myocardial infarct leaves a permanent scar.",
      },

      { type: "heading", level: 2, text: "Regenerative capacity" },
      {
        type: "table",
        headers: ["Category", "Behaviour", "Examples"],
        rows: [
          ["Labile", "Cells divide continuously throughout life to replace those that are constantly being shed", "Haemopoietic cells in bone marrow, and the surface epithelia of skin, gut and genitourinary tract"],
          ["Stable", "Cells normally divide little but are capable of dividing when stimulated", "Hepatocytes, renal tubular cells, pancreatic beta cells, fibroblasts"],
          ["Permanent", "Cells cannot divide, so damage is always repaired by scar", "Neurons, cardiac muscle, skeletal muscle"],
        ],
      },
      {
        type: "paragraph",
        text: "The boundary is not absolute but practical, and it maps exactly onto clinical experience. Bone marrow and gut regenerate so completely that chemotherapy can be tolerated. The liver regenerates spectacularly: a partial hepatectomy leaves a liver that regrows to near-normal mass within weeks. But a brain infarct, a myocardial infarction and a muscle injury are all repaired by scar, and the resulting functional loss is precisely because of that. A scar has no contractile and no electrical function — which is also why cardiac scar tissue can later cause arrhythmia.",
      },

      { type: "heading", level: 2, text: "Worked example: the sequence of wound healing" },
      {
        type: "table",
        headers: ["Stage", "Timing", "What is happening"],
        rows: [
          ["Haemostasis", "Minutes", "Platelet plug and fibrin clot form, stopping the bleeding"],
          ["Early inflammation", "Hours", "Neutrophils arrive, followed within a day or so by macrophages"],
          ["Epithelial closure", "Hours to days", "Epidermal cells migrate over the fibrin surface and proliferate"],
          ["Granulation tissue formation", "Days 2 to 5", "Fibroblasts and new small blood vessels grow into the wound bed"],
          ["Wound contraction", "Days 3 to 5 onwards", "Myofibroblasts draw the wound margins together"],
          ["Remodelling", "Weeks to months (up to about a year)", "Collagen is remodelled and the scar strengthens"],
        ],
      },
      {
        type: "paragraph",
        text: "Granulation tissue is the hallmark, and its name tells you what it is: soft, pink, granular and friable — a bed of new capillaries and fibroblasts embedded in loose matrix, with myofibroblasts and macrophages. It is fragile, which is why a wound at this stage bleeds at the slightest trauma, and it is also why it heals: the vessels bring the fibroblasts and the fibroblasts make the collagen.",
      },

      { type: "heading", level: 2, text: "First intention versus second intention" },
      {
        type: "table",
        headers: ["", "Healing by first intention", "Healing by second intention"],
        rows: [
          ["Example", "A clean surgical incision with apposed edges", "A large open wound with loss of tissue or edges that cannot be brought together"],
          ["Bridging gap", "Minimal — the surfaces are in contact", "Large — it must be filled from the bottom up"],
          ["Granulation tissue", "Little", "A great deal"],
          ["Wound contraction", "Negligible", "Marked, and the main mechanism of closure"],
          ["Final scar", "Thin linear", "Broad and dented"],
          ["Infection risk", "Low if the closure is clean", "Higher, especially if a foreign body is present"],
        ],
      },
      {
        type: "paragraph",
        text: "The scar strength that follows is the same in both cases and is often asked: a wound has recovered only about ten per cent of its original strength at one to two weeks, about fifty per cent at a month, and it never exceeds about eighty per cent of the strength it had before — which is why an incisional wound is weakest at the moment the sutures come out, and why hernias reopen at old wounds for as long as decades afterwards.",
      },

      { type: "heading", level: 2, text: "Factors that impair healing" },
      {
        type: "table",
        headers: ["Category", "Factor", "Mechanism"],
        rows: [
          ["Local", "Infection", "Bacterial toxins and the inflammatory response prolong tissue breakdown"],
          ["Local", "A foreign body", "Provides a surface for biofilm, and perpetuates inflammation"],
          ["Local", "Poor blood supply", "Oxygen, cells and matrix building blocks cannot reach the wound"],
          ["Local", "Mechanical stress", "Repeated movement pulls fragile granulation tissue apart"],
          ["Local", "Denervation", "Loss of the neurotrophic contribution to repair of skin"],
          ["Systemic", "Protein and vitamin C deficiency", "Collagen synthesis fails, and the wound is weak"],
          ["Systemic", "Diabetes mellitus", "Microangiopathy and impaired neutrophil function"],
          ["Systemic", "Drugs", "Corticosteroids, chemotherapy agents and immunosuppressants all blunt the response"],
          ["Systemic", "Age", "Slower regeneration and thinner dermis"],
        ],
      },
      {
        type: "paragraph",
        text: "The clinical consequence is that the answer to a non-healing wound is rarely a powder or a dressing: it is usually to find and remove the local obstacle (a foreign body, infection, poor blood supply or excess tension) and to fix the systemic ones (diabetes, nutrition, smoking, and the drugs that slow the process). This is the practical value of knowing the list.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the heart regenerates. Cardiac muscle is permanent; an infarction heals by scar. The liver is the classic example of regeneration, and confusing the two is a common error.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a scar reaches full strength. It reaches about eighty per cent at best, and takes months to a year to get there. Weeks and never full strength.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying granulation tissue is a bad sign because it looks inflamed. It is the sign of healthy active repair — it should be pink, moist and granular, not pale, dry or grey.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does an incision across the vertebral column heal better than a similar incision across a large joint?",
        answer: "Because repeated movement at the wound edges pulls the fragile granulation tissue apart, delaying healing; a wound over a bony area with little movement is mechanically stable.",
        explanation: "Mechanical protection of a wound is one of the most effective interventions in surgery — the reason abdominal closures are planned around the tension-bearing direction.",
      },
      {
        type: "question",
        prompt: "Which tissue can regenerate and which cannot, and what is the clinical consequence?",
        answer: "Liver, haemopoietic cells and the surface epithelia regenerate; cardiac muscle, neurons and skeletal muscle cannot and are replaced by scar. A healed myocardial infarction is a scar with no contractile function, and is therefore liable to cause heart failure and arrhythmia.",
        explanation: "The difference between regeneration and scar is the difference between a healed liver biopsy and a healed myocardial infarction.",
      },
      {
        type: "question",
        prompt: "In a patient whose wound has stopped healing, what are the first things to look for?",
        answer: "Local causes — infection, a retained foreign body, poor blood supply, or mechanical tension — and systemic ones such as diabetes, malnutrition, smoking, and drugs that blunt the response.",
        explanation: "Healing failure is a diagnostic problem in its own right, and the cause is almost always a local or systemic obstacle that can be identified and removed.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which tissue has the greatest capacity for regeneration?",
        options: ["Cardiac muscle", "Neurons", "Hepatocytes", "Skeletal muscle"],
        correctIndex: 2,
        explanation: "The liver is stable and regenerates extensively. Neurons and cardiac muscle are permanent, and skeletal muscle regenerates only poorly from satellite cells.",
      },
      {
        type: "mcq",
        stem: "What is the tensile strength of a healed incision at approximately three weeks?",
        options: ["Ten per cent of original", "About fifty per cent of original", "About eighty per cent of original", "Fully restored"],
        correctIndex: 1,
        explanation: "At two weeks a wound has only about ten per cent of its original strength, at one month about fifty, and a scar never exceeds about eighty per cent — a reason that sutures should not be removed too early and that wounds can dehisce months later.",
      },
      {
        type: "mcq",
        stem: "Which cells are the defining feature of granulation tissue?",
        options: [
          "Neutrophils and necrotic cells", "Fibroblasts and new small blood vessels", "Neurons and cartilage", "Platelets and fibrin",
        ],
        correctIndex: 1,
        explanation: "Granulation tissue is fibroblasts plus new capillaries in loose matrix, with macrophages and myofibroblasts — the material that replaces lost tissue and later remodels into a scar.",
      },
      {
        type: "mcq",
        stem: "A wound over a moving joint is slow to heal. What is the most likely explanation?",
        options: [
          "Neutrophils cannot leave the vessels", "Mechanical movement pulls the growing granulation tissue apart", "There is too much collagen already present", "Vitamin C has been supplied in excess",
        ],
        correctIndex: 1,
        explanation: "Repeated motion disrupts the fragile new vessels and matrix, so the wound is torn before it can close. This is why immobilisation is part of standard wound care.",
      },
      {
        type: "mcq",
        stem: "Which is the most important distinction between healing by first and by second intention?",
        options: [
          "First intention occurs only in chronic wounds", "First intention has apposed edges with little granulation, giving a thin linear scar; second intention fills a large gap, contracts, and leaves a broad scar", "They differ only in speed", "Second intention occurs in surgical wounds",
        ],
        correctIndex: 1,
        explanation: "Whether or not the edges can be apposed decides how much granulation tissue is needed, how much contraction occurs, and how the final scar looks.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Repair is either regeneration — which follows the tissue's capacity, with liver, haemopoietic cells and epithelia regenerating well and neurons, cardiac and skeletal muscle not regenerating at all — or scar formation, which is the default for permanent tissues and large defects. A wound passes through haemostasis, inflammation, epithelial closure, granulation tissue formation, contraction and remodelling, and first intention gives a thin linear scar while second intention gives a broad, contracted one. Local obstacles — infection, foreign body, poor blood supply, tension — and systemic ones such as diabetes, malnutrition and drugs are what to look for when healing stalls.",
      },
      {
        type: "paragraph",
        text: "Next: chronic inflammation and granulomas. You will see what happens when a stimulus cannot be cleared, and how the macrophage changes from a killer into a builder.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 4 — Chronic inflammation & granulomas (fully authored)
// ---------------------------------------------------------------------------
function lesson4() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define chronic inflammation and state what distinguishes it from acute inflammation; describe the cell populations involved and their origins; define a granuloma, name its components, and name the four systemic causes; distinguish caseating from non-caseating granulomas; explain the mechanism of foreign-body granuloma; and predict which investigations follow from the finding of a granuloma.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 2 (Acute inflammation). The cell types and the mediators of acute inflammation are the ones that persist when the response becomes chronic.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Chronic inflammation",
        text: "An inflammatory response of prolonged duration, in which active inflammation, tissue destruction and attempts at repair proceed simultaneously, characterised by a mononuclear infiltrate of macrophages, lymphocytes and plasma cells rather than neutrophils.",
      },
      {
        type: "paragraph",
        text: "Chronic inflammation arises in three ways, and knowing which one you are looking at decides the rest of the investigation. It follows a bout of acute inflammation that has failed to clear the cause. It arises as a primary process from the beginning — when the organism is difficult to kill, as in tuberculosis, or when the body is attacking its own tissue, as in autoimmune disease. Or it follows an irritant that the body cannot eliminate — a foreign body, a suture, a splinter, or a metabolite that is deposited, as in gout.",
      },

      { type: "heading", level: 2, text: "The cells of chronic inflammation" },
      {
        type: "table",
        headers: ["Cell", "Origin and role"],
        rows: [
          ["Macrophages", "Derived from blood monocytes, and the defining cell of chronic inflammation; they engulf, kill and process material, and they secrete cytokines that recruit and regulate other cells"],
          ["Lymphocytes", "B and T cells; the T cells direct the macrophage through interferon gamma and activate other arms of the immune response"],
          ["Plasma cells", "Terminally differentiated B cells that produce antibody"],
          ["Eosinophils", "Prominent in allergic inflammation and in parasitic infestation, through the actions of interleukin-5"],
          ["Fibroblasts", "Arrive to lay down collagen as part of the simultaneous repair that accompanies the destruction"],
        ],
      },
      {
        type: "paragraph",
        text: "The macrophage is the pivot. In acute inflammation it is a killer; in chronic inflammation it becomes a regulator and a builder, because the cytokines around it — above all interferon gamma from T cells — change which of its genes are active. It fuses with its neighbours to form giant cells, it secretes factors that recruit fibroblasts, and it becomes the structural centre of the granuloma.",
      },

      { type: "heading", level: 2, text: "The granuloma" },
      {
        type: "definition",
        term: "Granuloma",
        text: "A microscopic, focal, chronic inflammatory lesion composed of aggregated activated macrophages (epithelioid histiocytes), often with giant cells and a surrounding cuff of lymphocytes and fibrosis, formed in an attempt to wall off material that cannot be destroyed.",
      },
      {
        type: "table",
        headers: ["Component", "Description"],
        rows: [
          ["Epithelioid histiocytes", "Activated macrophages that have lost their ability to become motile and sit with abundant granular pale cytoplasm, looking like epithelial cells — hence the name"],
          ["Langhans giant cells", "Multinucleate cells formed by fusion, with the nuclei arranged around the periphery in a horseshoe or ring"],
          ["Caseous necrosis", "A cheese-like necrotic centre, seen in tuberculosis and a few other infections"],
          ["Lymphocytes", "A surrounding cuff, mainly T cells"],
          ["Fibrosis", "A rim of collagen laid down by fibroblasts at the edge"],
        ],
      },
      {
        type: "paragraph",
        text: "The key point is that the granuloma is not simply debris: it is the product of active cellular behaviour, driven by cytokines, and it is a specific response rather than a non-specific collection of debris. Because it is a focal, patterned structure, it is a recognisable microscopic finding — which is why an entire differential diagnosis hangs off the words 'granulomatous inflammation'.",
      },

      { type: "heading", level: 2, text: "Worked example: what causes granulomas" },
      {
        type: "table",
        headers: ["Category", "Examples", "Note"],
        rows: [
          ["Infection, typically with an intracellular organism", "Mycobacterium tuberculosis, atypical mycobacteria, syphilis, leishmaniasis, schistosomiasis, fungal infections such as histoplasmosis, cryptococcosis and coccidioidomycosis", "The commonest cause worldwide; caseation is typical of tuberculosis"],
          ["Foreign body", "Talc in intravenous drug users, sutures, splinters, silica (silicosis), beryllium, asbestos", "Foreign body giant cells with irregular nuclei, and often a polarisable foreign material inside"],
          ["Immune-mediated", "Sarcoidosis, Crohn's disease, primary biliary cholangitis", "Non-caseating; sarcoidosis is the classic 'non-caseating granulomas of unknown cause'"],
          ["Other", "Leprosy (tuberculoid type), cat scratch disease (Bartonella), and a lymph-node reaction of unclear cause", "The clinical context decides the diagnosis"],
        ],
      },
      {
        type: "paragraph",
        text: "The commonest practical question is whether a granuloma is caseating or not. Caseating granulomas point at tuberculosis (or at the deep fungal infections). Non-caseating granulomas suggest sarcoidosis, Crohn's disease or a foreign body — which is also why a chest radiograph with bilateral hilar lymphadenopathy and a raised serum angiotensin-converting enzyme level suggests sarcoidosis, whereas an upper-lobe cavitating lesion with caseating granulomas points to tuberculosis. Culture, molecular testing and biopsy usually settle it.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a granuloma must contain caseation. It does not: sarcoid, Crohn's disease and foreign-body granulomas are non-caseating. Caseating granulomas are characteristic of tuberculosis and some deep fungal infections, not of granulomas generally.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Attributing Langhans giant cells to tuberculosis only. The cell type is a general macrophage fusion product and is found in sarcoid, in foreign-body reactions, and in fungal infection as well.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying chronic inflammation is just prolonged acute inflammation. It is a different process: granulocytes are replaced by mononuclear cells, and both tissue destruction and repair proceed at the same time.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What distinguishes chronic inflammation from acute inflammation?",
        answer: "The duration and the cell type: chronic inflammation lasts weeks to years and is characterised by lymphocytes, macrophages and plasma cells rather than neutrophils, and it is accompanied by attempts at repair.",
        explanation: "The distinction is cellular and functional, not simply chronological — a chronic process can run alongside active tissue destruction.",
      },
      {
        type: "question",
        prompt: "Name the components of a granuloma in order from centre to edge.",
        answer: "Caseous centre (if present), then epithelioid histiocytes with multinucleated giant cells, then a cuff of lymphocytes, then an outer rim of fibrosis.",
        explanation: "The concentric arrangement is the product of the cytokines released by the T cells at the centre deciding the structure of the whole lesion.",
      },
      {
        type: "question",
        prompt: "Why is sarcoidosis described as granulomatous but tuberculosis as caseating?",
        answer: "Because sarcoid granulomas are non-caseating — no caseous necrosis — and of unknown cause, whereas the granulomas of tuberculosis contain caseous necrosis, the cheese-like centre of dead tissue.",
        explanation: "The presence or absence of caseation is the first branch in a histology report on granulomatous disease.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which cell is the defining cell of chronic inflammation?",
        options: ["The neutrophil", "The macrophage", "The eosinophil", "The megakaryocyte"],
        correctIndex: 1,
        explanation: "Macrophages, derived from blood monocytes, are the dominant cell of chronic inflammation, and they become epithelioid cells at the centre of a granuloma. Neutrophils dominate acute inflammation.",
      },
      {
        type: "mcq",
        stem: "Which finding characterises sarcoidosis?",
        options: [
          "Caseating granulomas with central necrosis", "Non-caseating granulomas without necrosis", "Neutrophilic microabscesses", "Fibrinoid vasculitis only",
        ],
        correctIndex: 1,
        explanation: "Sarcoid granulomas are non-caseating and typically occur in lung and thoracic lymph nodes. Caseating granulomas with necrosis are the pattern of tuberculosis.",
      },
      {
        type: "mcq",
        stem: "A patient has granulomas containing polarisable foreign material. What is the likely cause?",
        options: [
          "Mycobacterium tuberculosis", "A foreign body, such as a suture or an inhaled fiber", "Sarcoidosis", "Crohn's disease",
        ],
        correctIndex: 1,
        explanation: "A foreign body granuloma is organised around the material itself, and foreign material may be visible under polarised light. Tuberculosis produces caseating granulomas.",
      },
      {
        type: "mcq",
        stem: "Which cytokine activates macrophages to form epithelioid histiocytes in a granuloma?",
        options: ["Interferon gamma", "Histamine", "Interleukin-10", "Complement C5a"],
        correctIndex: 0,
        explanation: "Interferon gamma released by T cells is the classic macrophage-activating cytokine of cell-mediated immunity, and it is the signal that drives granuloma formation.",
      },
      {
        type: "mcq",
        stem: "Which of the following is a characteristic of Langhans giant cells?",
        options: [
          "Nuclei arranged haphazardly throughout the cytoplasm", "Nuclei arranged around the periphery in a ring or horseshoe", "A single large nucleus", "Granules that stain with eosin",
        ],
        correctIndex: 1,
        explanation: "Langhans giant cells are formed by macrophage fusion and their nuclei are distributed peripherally. Foreign body giant cells in contrast have nuclei scattered through the cytoplasm.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Chronic inflammation is a simultaneous process of active inflammation, tissue destruction and repair, in which the neutrophil is replaced by the macrophage, lymphocyte and plasma cell. The granuloma is its structural hallmark — a focus of epithelioid histiocytes with giant cells, lymphocytes and fibrosis, formed to wall off material that cannot be destroyed — and whether it caseates is the most important single fact in the histology report. Infections (tuberculosis above all), foreign bodies, immune-mediated disease and a few other causes are the whole differential.",
      },
      {
        type: "paragraph",
        text: "Next: haemodynamic disorders. You will look at what happens when the vascular events of inflammation are replaced by clot, or blood stops moving altogether — thrombosis and embolism.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 5 — Haemodynamic disorders: thrombosis & embolism (fully authored)
// ---------------------------------------------------------------------------
function lesson5() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe Virchow's triad and name its three components; outline the sequence of events in thrombosis and describe the layers of a thrombus; distinguish thrombosis from clotting in vitro; define an embolus and list its sources; predict the site of lodgement and the consequence of a pulmonary embolus; and list the available targets for pharmacological prevention.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-4, and the haemostasis concept in the physiology course. You need vascular endothelium, platelets and coagulation to follow everything in this lesson.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Thrombus",
        text: "A solid mass formed within the living circulation from blood elements — platelets, fibrin and trapped cells — in a way that is pathologically inappropriate and obstructs the vessel.",
      },
      {
        type: "paragraph",
        text: "Haemostasis and thrombosis are the same machinery. When a vessel is cut, that machinery saves your life. When it forms a clot inside an intact vessel, it kills. Everything that prevents pathological clotting — antithrombotic drugs, mechanical compression, simply getting a patient up quickly after surgery — is an attempt to shift the balance of Virchow's triad, which is the framework that explains why a given patient thrombosed.",
      },

      { type: "heading", level: 2, text: "Virchow's triad" },
      {
        type: "table",
        headers: ["Component", "Mechanism", "Clinical examples"],
        rows: [
          ["Endothelial injury", "Damage of the inner lining exposes collagen and tissue factor, activates platelets and the clotting cascade", "Myocardial infarction and atheromatous plaque rupture, iatrogenic injury from a catheter or a valve, vasculitis, septic injury of the endothelium"],
          ["Stasis or turbulent flow", "Blood flows more slowly or swirls, so activated clotting factors are not diluted or washed away and platelets marginate", "Immobilisation, long-haul flights, prolonged operations, atrial fibrillation with stasis in the atrium, aneurysms, venous obstruction"],
          ["Hypercoagulability", "The propensity of blood to clot is increased", "The inherited thrombophilias (factor V Leiden, protein C or protein S deficiency, the prothrombin mutation), malignancy, oestrogen therapy and pregnancy, nephrotic syndrome, obesity, smoking"],
        ],
      },
      {
        type: "paragraph",
        text: "Note which component dominates which clinical situation. Arterial and cardiac thrombi form mainly on endothelium injury — a ruptured atheromatous plaque — and are platelet-rich. Venous thrombi form mainly with stasis, and are fibrin-rich with a lot of trapped red cells. That difference is why antiplatelet drugs (aspirin, clopidogrel) prevent arterial events, and why anticoagulants (heparin, warfarin, direct oral anticoagulants) prevent venous thrombosis and thromboembolic stroke from fibrillation.",
      },

      { type: "heading", level: 2, text: "Worked example: the anatomy of a thrombus" },
      {
        type: "paragraph",
        text: "A thrombus in a vein forms in layers, and each layer reflects a phase: a platelet head attached to the damaged endothelium, then a body of alternating platelet and fibrin layers with an appearance called the lines of Zahn, and a tail of red cells that is the part most likely to break off. Those lines of Zahn are the gross and microscopic feature that distinguishes a thrombus from post-mortem clot, which is gelatinous, layered by gravity and not adherent.",
      },
      {
        type: "table",
        headers: ["Feature", "Thrombus", "Post-mortem clot"],
        rows: [
          ["Attachment", "Adherent to the vessel wall", "Not adherent"],
          ["Structure", "Alternating platelet and fibrin lines (lines of Zahn)", "Gelatinous; red cells settled by gravity (chicken fat appearance)"],
          ["Formation", "In the living, flowing circulation", "After death, when flow has stopped"],
        ],
      },
      {
        type: "paragraph",
        text: "The outcome of a thrombus depends on its location and on how it is handled. It may propagate along the vein, occlude, organise and be incorporated into the wall, or recanalise. It may embolise — break off and travel — and that is the dangerous outcome, because the consequences are determined by where the embolus lodges.",
      },
      {
        type: "table",
        headers: ["Outcome", "Description", "Consequence"],
        rows: [
          ["Propagation", "The clot extends along the vessel", "Worsening obstruction of the affected vein or artery"],
          ["Embolisation", "A fragment detaches and travels", "Pulmonary embolism from a deep-vein thrombosis, or stroke from a carotid or cardiac source"],
          ["Organisation and recanalisation", "The clot is replaced by fibroblasts and new channels open through it", "A scarred but eventually patent vein"],
          ["Complete dissolution", "Fibrinolysis clears the clot", "Full restoration, usually only for a small or a recently formed clot"],
        ],
      },

      { type: "heading", level: 2, text: "Clinical correlation: venous thromboembolism" },
      {
        type: "paragraph",
        text: "A post-operative patient, three days after a hip replacement, has a swollen, painful calf, and the following morning collapses with breathlessness, pleuritic chest pain and a raised respiratory rate. The mechanism is a chain. The immobility and the surgical injury to the veins of the leg produced a deep-vein thrombosis. A part of it broke free, entered the venous system, passed through the right heart and lodged in the pulmonary arterial tree — a pulmonary embolism.",
      },
      {
        type: "table",
        headers: ["Clinical feature", "Mechanism"],
        rows: [
          ["Pleuritic chest pain", "The embolus is at the lung periphery, against the pleural surface, and causes inflammation"],
          ["Breathlessness and hypoxia", "Blood flow to part of the lung is obstructed but ventilation continues, and the resulting dead-space ventilation wastes breathing"],
          ["Raised respiratory rate and tachycardia", "The body's compensation for a large gradient of wasted ventilation, and for the strain on the right ventricle"],
          ["Collapse and sudden death", "A large saddle embolus obstructs the outflow of the right ventricle, producing obstructive shock"],
        ],
      },
      {
        type: "paragraph",
        text: "Prevention is therefore a central duty, and it is aimed directly at the triad: mobilise the patient (removes stasis), ensure adequate hydration (removes hyperviscosity), administer mechanical compression (removes stasis), and anticoagulate the patient whose risk is high enough to justify it. The clinical risk groups that warrant it — major orthopaedic surgery, major pelvic or abdominal surgery, acute illness with reduced mobility, active cancer, previous venous thromboembolism and an inherited thrombophilia — are all situations in which the triad is loaded.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a thrombus forms after death. It does not — the post-mortem clot is gelatinous, unattached and layered by gravity. If you see lines of Zahn or adherence to the wall, it is a thrombus and it formed in the living circulation.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a pulmonary embolism comes from the systemic circulation. It comes from the venous system, so it must pass through the right heart first, and it therefore lodges in the pulmonary arteries. Systemic arterial emboli (from the left heart or the aorta) cause strokes, limb ischaemia, mesenteric ischaemia or renal infarction.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting that a patient can have a deep-vein thrombosis without a swollen leg. Many emboli come from silent thrombi, which is why prophylaxis is given on the basis of risk rather than on the basis of local signs alone.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What are the three components of Virchow's triad, and how would you reduce each in a patient after hip surgery?",
        answer: "Endothelial injury, stasis or turbulent flow, and hypercoagulability. After hip surgery: careful surgical technique (less injury), early mobilisation and mechanical compression (less stasis), and appropriate anticoagulation if the risk warrants it (less hypercoagulability).",
        explanation: "Every thromboprophylaxis measure is aimed at one arm of the triad, and no measure addresses all three.",
      },
      {
        type: "question",
        prompt: "Why does an embolus from a leg-vein thrombus cause shortness of breath rather than a stroke?",
        answer: "Because venous return carries it through the right ventricle into the pulmonary arteries, where it obstructs pulmonary blood flow — so it produces the respiratory and right-sided findings of pulmonary embolism. A stroke requires an arterial embolus from the left heart or the carotid and vertebral arteries.",
        explanation: "The chamber of the heart that a clot passes through determines which circulation it reaches, and therefore the whole clinical picture.",
      },
      {
        type: "question",
        prompt: "How would you tell a thrombus from a post-mortem clot?",
        answer: "A thrombus is adherent, has alternating platelet and fibrin layers (lines of Zahn), and formed before death. A post-mortem clot is gelatinous, not adherent, and layered by settled red cells.",
        explanation: "The distinction matters in post-mortem examination interpretation — a thrombus is a disease, a clot after death is not.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which is NOT a component of Virchow's triad?",
        options: ["Endothelial injury", "Stasis of blood flow", "Hypercoagulability", "Reduced oxygen tension"],
        correctIndex: 3,
        explanation: "Virchow's triad is endothelial injury, stasis or turbulence, and hypercoagulability. Reduced oxygen is a cause of ischaemic injury but not of thrombosis.",
      },
      {
        type: "mcq",
        stem: "A mobile patient after hip surgery has a deep-vein thrombosis and then collapses. What is the most likely diagnosis?",
        options: [
          "Stroke", "Myocardial infarction", "Pulmonary embolism", "Ruptured abdominal aortic aneurysm",
        ],
        correctIndex: 2,
        explanation: "A fragment of a leg-vein thrombus travels through the right heart into the pulmonary arteries. Sudden breathlessness, pleuritic pain and collapse is the classic presentation.",
      },
      {
        type: "mcq",
        stem: "Which feature distinguishes a thrombus from a post-mortem clot?",
        options: [
          "A post-mortem clot is attached to the vessel wall", "A thrombus shows lines of Zahn and is adherent", "A thrombus is always white and pale", "A post-mortem clot contains fibrin but a thrombus does not",
        ],
        correctIndex: 1,
        explanation: "Lines of Zahn (alternating platelet and fibrin layers) and adherence are the features of a true thrombus formed in the living circulation.",
      },
      {
        type: "mcq",
        stem: "Why are antiplatelet drugs preferred to anticoagulants for arterial thrombosis?",
        options: [
          "Because arterial thrombi are formed mainly of fibrin",
          "Because arterial thrombi form on injured endothelium and are platelet-rich, so blocking platelet adhesion is the most effective prevention",
          "Because anticoagulants do not reach arteries",
          "Because antiplatelet drugs dissolve existing clot",
        ],
        correctIndex: 1,
        explanation: "Arterial thrombi are initiated by endothelial injury and a platelet head; venous thrombi are fibrin-rich from stasis and require anticoagulation.",
      },
      {
        type: "mcq",
        stem: "Which inheritance pattern is the commonest of the inherited thrombophilias?",
        options: [
          "Protein C deficiency", "Factor V Leiden", "Protein S deficiency", "Antithrombin III deficiency",
        ],
        correctIndex: 1,
        explanation: "Factor V Leiden — a mutation that makes factor V resistant to cleavage by activated protein C — is the commonest inherited thrombophilia.",
      },
      {
        type: "mcq",
        stem: "Which mechanism explains the breathlessness of a pulmonary embolism?",
        options: [
          "Ventilated lung is not perfused, so ventilation is wasted",
          "The alveoli fill with pus",
          "The diaphragm is paralysed by pain",
          "The pulmonary arteries dilate and flood the lungs",
        ],
        correctIndex: 0,
        explanation: "The obstructed vascular bed creates alveolar dead space: the patient ventilates lung that is not perfused, so minute ventilation rises without improving gas exchange. That is why oxygen saturations fall and respiratory rate increases.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Thrombosis is haemostasis in the wrong place, and it is always understood through Virchow's triad: endothelial injury, stasis or turbulence, and hypercoagulability. Arterial and cardiac thrombi arise mainly from endothelial injury and are platelet-rich; venous thrombi arise mainly from stasis and are fibrin-rich. A thrombus may propagate, organise, recanalise, dissolve or embolise, and the embolus from a vein reaches the pulmonary arteries — where the resulting breathlessness and, in a large embolus, obstructive shock make pulmonary embolism one of the commonest preventable causes of post-operative death.",
      },
      {
        type: "paragraph",
        text: "Next: neoplasia. You will see how the same principles — uncontrolled growth, altered blood supply, and response to therapy — describe the most feared group of diseases.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 6 — Oedema & systemic effects of vascular disturbance (fully authored)
// ---------------------------------------------------------------------------
function lesson6() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define oedema and distinguish hydrostatic from oncotic from inflammatory causes; describe the compartment distribution of oedema in heart, kidney and liver failure; define shock and name its four categories with an example of each; describe the microcirculatory and clinical features of septic shock; and identify which laboratory measurements guide the resuscitation of a shocked patient.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-5. You need transudate and exudate, the vascular events of inflammation and the mechanics of thromboembolism, since oedema and shock are both disturbances of the fluid exchange that this module has described.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Oedema",
        text: "The accumulation of excess fluid in the interstitial tissue spaces or in body cavities, caused by a disturbance in the exchange of fluid across the capillary wall.",
      },
      {
        type: "paragraph",
        text: "Recall the physiology lesson: the capillary wall is a filter whose balance is set by four forces — the hydrostatic pressure pushing fluid out, the colloid osmotic pressure of plasma proteins pulling fluid in, the permeability of the wall itself, and the efficiency of the lymphatic drainage. Oedema is what you get when that balance is upset in one of four ways, and the pattern of the oedema tells you which one it is.",
      },

      { type: "heading", level: 2, text: "The four mechanisms, by distribution" },
      {
        type: "table",
        headers: ["Mechanism", "Cause", "Distribution of oedema", "Example"],
        rows: [
          ["Increased hydrostatic pressure", "Raised venous pressure from heart failure, or obstruction of a vein", "Dependent — ankles when upright, sacrum when in bed; bilateral and gravitational", "Right-heart failure, constrictive pericarditis, deep-vein obstruction"],
          ["Plasma colloid osmotic pressure reduced", "Reduced serum albumin, so less fluid is pulled back into the capillary", "Generalised, affecting the face as well as the limbs, with pleural and peritoneal effusions", "Nephrotic syndrome, cirrhosis of the liver, malnutrition (kwashiorkor), protein-losing enteropathy"],
          ["Increased vascular permeability", "Endothelial damage and endothelial contraction", "Localised to the region of inflammation, and with a high protein content", "Acute inflammation, burns, an allergic reaction, sepsis"],
          ["Lymphatic obstruction", "Impaired drainage, so interstitial fluid cannot be returned", "Firm, non-pitting and localised", "Lymph-node clearance or irradiation, filariasis (elephantiasis), tumour obstruction"],
        ],
      },
      {
        type: "paragraph",
        text: "The distinction is examinated constantly, because it is clinically decisive. Cardiac oedema is raised hydrostatic pressure: it is bilateral, dependent and pits on pressure. Nephrotic oedema is a raised permeability plus a low albumin: it is generalised and starts in the eyelids. Hepatic oedema is hypoalbuminaemia plus portal hypertension: it accumulates as ascites. Lymphatic oedema does not pit, because the proteinaceous fluid cannot be redistributed by pressure.",
      },

      { type: "heading", level: 2, text: "Clinical correlation: pitting versus non-pitting" },
      {
        type: "paragraph",
        text: "The bedside test is simple, and its meaning is the lesson of the table. Press over a bony prominence and release: if a dent forms and persists for some seconds, the fluid is mobile, and the oedema is cardiac or renal. If the tissue does not indent — if the swelling is firm and leathery, as in a long-standing lymphoedema — the fluid is trapped in a protein-rich matrix, and you should suspect lymphatic obstruction. A patient with a unilateral swollen leg after a mastectomy with axillary node clearance fits the second pattern; a patient with bilateral ankle swelling and a raised jugular venous pressure fits the first.",
      },

      { type: "heading", level: 2, text: "Shock" },
      {
        type: "definition",
        term: "Shock",
        text: "A state in which tissue perfusion is inadequate for the metabolic needs of the body, so that cellular hypoxia and organ dysfunction follow, even though the blood pressure is not always low in the early stages.",
      },
      {
        type: "table",
        headers: ["Type", "Mechanism", "Example", "Compensatory nervous system response"],
        rows: [
          ["Hypovolaemic", "Reduced volume of blood reaching the heart", "Haemorrhage, burns with plasma loss, vomiting and diarrhoea, diabetes insipidus", "Tachycardia and vasoconstriction"],
          ["Cardiogenic", "The pump fails, so output cannot be maintained despite adequate volume", "Myocardial infarction, arrhythmia, severe valvular disease, myocarditis", "Tachycardia, vasoconstriction, and a raised jugular venous pressure from backward failure"],
          ["Distributive", "Vasodilation increases the capacity of the circulation, so the volume is insufficient", "Septic shock, anaphylaxis, spinal injury with loss of sympathetic tone, overdose of a vasodilator", "Tachycardia with warm peripheries in septic shock, and tachycardia without vasoconstriction in spinal shock"],
          ["Obstructive", "The heart cannot fill, or cannot expel its contents", "Cardiac tamponade, tension pneumothorax, massive pulmonary embolism, severe pulmonary hypertension", "Raised jugular venous pressure and a disturbed pulse in all of them"],
        ],
      },
      {
        type: "paragraph",
        text: "The four types matter because the treatment differs and one treatment may harm. Volume is the answer in hypovolaemic shock and is partly helpful in septic shock; fluids alone will not save a patient whose heart cannot pump (cardiogenic) or whose great veins are kinked (obstructive); and in anaphylaxis the answer is adrenaline, which reverses the vasodilation, plus volume. That is why the classification is worth memorising as categories of treatment rather than as a list of diseases.",
      },

      { type: "heading", level: 2, text: "Septic shock" },
      {
        type: "paragraph",
        text: "Septic shock is the dangerous end of the response to infection. The pathogens and their products provoke a self-damaging host response: widespread endothelial dysfunction and vasodilation, so the vascular capacity expands beyond the available volume; a capillary leak, so fluid leaves the circulation; and mitochondrial dysfunction, so cells cannot use the oxygen that is delivered even when the perfusion is restored. The result is hypotension requiring a vasopressor to maintain an adequate blood pressure, together with evidence of organ dysfunction — a lactate above the level at which the kidney makes it, confusion, oliguria, a prolonged prothrombin time.",
      },
      {
        type: "table",
        headers: ["Investigation", "What it tells you in septic shock"],
        rows: [
          ["Serum lactate", "The degree of cellular hypoperfusion; a rising lactate despite resuscitation is a marker of a bad outcome"],
          ["Blood cultures before antibiotics", "Identifies the organism and the source, and guides the antibiotic"],
          ["Full blood count", "A leukocytosis with a raised neutrophil count, or a leukopenia in the very severe"],
          ["C-reactive protein and procalcitonin", "Markers of the inflammatory response and, for procalcitonin, of bacterial infection"],
          ["Arterial blood gases", "Metabolic acidosis from lactate, and respiratory compensation"],
          ["Coagulation screen", "Disseminated intravascular coagulation — a raised prothrombin time, a low fibrinogen, a raised D-dimer"],
        ],
      },
      {
        type: "question",
        prompt: "A patient with sepsis has a normal blood pressure, a warm periphery and a raised lactate. Are they shocked?",
        answer: "Yes, or at least they are in compensated shock with evidence of tissue hypoperfusion. Shock is defined by tissue perfusion and organ dysfunction, not by low blood pressure alone: compensated shock has a normal pressure, maintained by tachycardia and vasoconstriction, and the raised lactate shows that the cells are already short of oxygen.",
        explanation: "Waiting for hypotension loses the opportunity to treat shock before it becomes irreversible — which is why the sepsis protocols screen for lactate and organ dysfunction rather than for blood pressure.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying shock always means hypotension. Compensated shock has a normal blood pressure; and in the very young and the very old, and in patients on beta-blockers, there may be no tachycardia at all. Pressure is one measurement among several.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying septic shock is caused by the bacteria directly. Much of the organ damage is caused by the host response — cytokines, nitric oxide, endothelial dysfunction — which is why steroids and careful fluid management are used alongside antibiotics.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying lymphoedema pits on pressure. It does not — the fluid is trapped in a protein-rich, fibrotic matrix, and this non-pitting quality is the reason it is distinguished at the bedside.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Where is fluid retained in right-heart failure, and why?",
        answer: "In dependent areas — ankles when standing, sacrum and flanks when in bed — because the raised venous pressure backs up through the venous system and raises capillary hydrostatic pressure.",
        explanation: "The gravitational distribution is a direct readout of the mechanism: a hydrostatic mechanism gives dependent, bilateral, pitting oedema.",
      },
      {
        type: "question",
        prompt: "Which mechanism of oedema does NOT pit on pressure, and why?",
        answer: "Lymphoedema does not pit. The obstructed lymphatics cannot drain the protein-rich interstitial fluid, which stays bound in the tissue and cannot be displaced by pressure.",
        explanation: "The bedside test works because pitting requires mobile, low-protein fluid.",
      },
      {
        type: "question",
        prompt: "Which laboratory measurement best indicates inadequate tissue perfusion in a shocked patient?",
        answer: "The serum lactate, which reflects anaerobic metabolism in the tissues. A lactate that fails to fall with resuscitation is associated with a poor outcome.",
        explanation: "Lactate is the most direct measure of the thing shock is: not a pressure, but cellular hypoxia.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A patient has bilateral ankle swelling that pits on pressure, with a raised jugular venous pressure. What is the mechanism?",
        options: [
          "Increased vascular permeability from acute inflammation",
          "Raised venous pressure raising capillary hydrostatic pressure",
          "Reduced plasma oncotic pressure from hypoalbuminaemia",
          "Lymphatic obstruction",
        ],
        correctIndex: 1,
        explanation: "Dependent bilateral pitting oedema with a raised jugular venous pressure is the signature of raised venous pressure. Inflammatory oedema is localised, and lymphatic oedema does not pit.",
      },
      {
        type: "mcq",
        stem: "Which mechanism produces non-pitting oedema?",
        options: [
          "Raised venous pressure in right-heart failure",
          "Hypoalbuminaemia in nephrotic syndrome",
          "Lymphatic obstruction after an axillary node clearance",
          "Acute inflammation in cellulitis",
        ],
        correctIndex: 2,
        explanation: "Obstructed lymphatics leave protein-rich fluid in the tissue, which cannot be displaced by pressure, so the oedema does not pit. The others produce mobile, low-protein fluid.",
      },
      {
        type: "mcq",
        stem: "Which category of shock is caused by cardiac tamponade?",
        options: ["Hypovolaemic", "Cardiogenic", "Obstructive", "Distributive"],
        correctIndex: 2,
        explanation: "Tamponade obstructs cardiac filling, so despite adequate volume and a functioning myocardium, output falls — an obstructive shock. It is treated by drainage, not by fluids alone.",
      },
      {
        type: "mcq",
        stem: "A patient with sepsis has warm peripheries, a raised lactate and a normal blood pressure. What is the best interpretation?",
        options: [
          "The patient is not shocked because the blood pressure is normal",
          "The patient has compensated shock with evidence of tissue hypoperfusion",
          "The patient has a hypovolaemic shock of purely cardiac origin",
          "The raised lactate indicates hepatic failure rather than shock",
        ],
        correctIndex: 1,
        explanation: "Shock is defined by tissue perfusion, not by pressure alone: warm peripheries reflect vasodilation, and the lactate confirms cellular hypoxia. Waiting for hypotension loses the chance to intervene.",
      },
      {
        type: "mcq",
        stem: "Which best describes the mechanism of septic shock?",
        options: [
          "Reduced circulating volume from a ruptured blood vessel",
          "Widespread vasodilation, capillary leak and cellular inability to use oxygen",
          "Complete failure of the heart to contract",
          "Direct paralysis of the diaphragm",
        ],
        correctIndex: 1,
        explanation: "Septic shock is a distributive shock in which vasodilation increases vascular capacity, capillary leak removes fluid from the circulation, and mitochondrial dysfunction prevents oxidative metabolism even once perfusion is restored.",
      },

      { type: "heading", level: 2, text: "Module summary and next" },
      {
        type: "paragraph",
        text: "This module has followed the disturbance of fluid exchange to its two extreme consequences: oedema, which is a capillary balance problem that reveals its mechanism through its distribution and whether it pits, and shock, which is a state of inadequate perfusion classified into hypovolaemic, cardiogenic, obstructive and distributive types because the treatment differs between them. Septic shock is the distributive type in which the host's own response to infection damages endothelium and mitochondria, and the lactate rather than the blood pressure tells you how badly.",
      },
      {
        type: "paragraph",
        text: "Next module: neoplasia, where the cell's own control of division is lost — and where almost every principle in this module, from disordered perfusion to disordered haemostasis, is applied to a disease grown in the body rather than inflicted on it.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 7 — Embolism: types & fates (fully authored)
// ---------------------------------------------------------------------------
function lesson7() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define an embolus and distinguish it from a thrombus in situ; name the main types of embolus and the clinical setting in which each occurs; predict the vessel in which a given embolus will lodge from where it entered the circulation; grade a pulmonary embolism by its size and predict its presentation; recognise fat embolism syndrome and decompression sickness; and explain why air and amniotic-fluid embolism present with collapse and coagulopathy rather than with simple vascular obstruction.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-6 of this course. You need Virchow's triad and the structure of a thrombus (lesson 5), the patterns of necrosis (lesson 1) and the vascular events of inflammation (lesson 2), because an embolus ends either in one of the patterns of necrosis or in the inflammatory response to it.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Embolus",
        text: "An intravascular mass — solid, liquid or gas — detached from its point of formation and carried by the bloodstream until it lodges in a vessel too small to let it pass.",
      },
      {
        type: "paragraph",
        text: "Almost every embolus is a fragment of a thrombus, so the science of embolism begins exactly where the last lesson ended. The word tells you what the material is and that it is travelling; the pathology of any given embolus is the pathology of its source plus the anatomy of the vessel it ends up in. Ask two questions of every embolus case — where did it come from, and where did it lodge — and the two answers give you the whole clinical picture.",
      },

      { type: "heading", level: 2, text: "The types of embolus" },
      {
        type: "table",
        headers: ["Type", "Source and mechanism", "Where it lodges"],
        rows: [
          ["Thromboembolus", "A fragment of a thrombus that has broken free — a leg-vein thrombosis, a thrombus in a fibrillating atrium, a mural thrombus over a myocardial infarct, or an aneurysmal clot", "Venous side: the pulmonary arteries. Arterial side: brain, lower limb, mesentery, kidney, spleen"],
          ["Fat", "Free fat droplets released from the marrow or adipose tissue after fracture of a long bone, soft-tissue trauma or burn", "The pulmonary arteries; droplets can pass to the systemic circulation in severe cases"],
          ["Gas", "Nitrogen bubbles on decompression (caisson disease); air introduced iatrogenically", "Pulmonary or systemic arteries depending on the portal of entry"],
          ["Amniotic fluid", "Amniotic fluid and fetal squames forced into maternal uterine sinuses during prolonged or forceful labour", "The pulmonary circulation, with a systemic coagulopathy"],
          ["Tumour", "A solid tumour invading a vein, e.g. renal cell carcinoma into the renal vein or hepatocellular carcinoma into the hepatic vein", "The next vascular bed along the route of flow — lung first, then beyond"],
          ["Infective", "A fragment of infected thrombus, or vegetations of infective endocarditis", "Distal vessels, where it seeds a septic infarct or a mycotic aneurysm"],
          ["Bone marrow", "Fragments of marrow released by fracture, cardiac massage or resuscitation", "The pulmonary arteries, usually asymptomatic"],
          ["Foreign body", "Talc or filler particles injected by intravenous drug users", "The lungs and the retinal circulation"],
        ],
      },

      { type: "heading", level: 2, text: "Pulmonary embolism, by size" },
      {
        type: "paragraph",
        text: "Because the pulmonary embolism is the commonest clinically important embolus, it has its own grading, and the grade predicts both the presentation and the urgency. Every venous embolus must pass through the right heart before it lodges — that single anatomical fact explains why leg-vein thrombosis causes breathlessness rather than a stroke.",
      },
      {
        type: "table",
        headers: ["Size", "What is obstructed", "Clinical picture"],
        rows: [
          ["Massive", "The pulmonary trunk and both main arteries (a saddle embolus), or more than half of the pulmonary vascular bed", "Sudden collapse with obstructive shock; the right ventricle cannot empty, so death follows within minutes if untreated"],
          ["Large", "More than two lobar arterial branches", "Marked dyspnoea, pleuritic pain, hypoxaemia and right ventricular strain, often with a raised troponin"],
          ["Medium", "Segmental or subsegmental arteries", "The classic pleuritic chest pain, cough and a slightly raised respiratory rate, with or without haemoptysis"],
          ["Small", "Branches at the lung periphery", "Often silent; may cause a small haemorrhagic infarct, pleuritic pain, or a persisting effusion"],
        ],
      },
      {
        type: "paragraph",
        text: "The pattern of recurrence also matters clinically. Repeated small emboli over months or years progressively obliterate the pulmonary vascular bed, so the patient eventually develops pulmonary hypertension and right heart failure — chronic thromboembolic pulmonary hypertension — in which the embolism itself is far easier to miss because each individual event was small.",
      },

      { type: "heading", level: 2, text: "Worked example: fat embolism syndrome" },
      {
        type: "example",
        text: "A 24-year-old man has a fractured femur fixed surgically on the day of the injury. Thirty-six hours later he is breathless, develops a reddish petechial rash over the chest and shoulders, and becomes drowsy and restless. His platelet count is low, haemoglobin falling, and CT shows diffuse ground-glass shadowing in both lungs.",
      },
      {
        type: "paragraph",
        text: "The mechanism is partly mechanical and partly biochemical: fat droplets released from the marrow occlude pulmonary capillaries, and the free fatty acids they liberate injure the pulmonary endothelium directly and activate platelets. The combination produces respiratory failure, the petechial rash (which is characteristic on the upper body) and cerebral symptoms from hypoxia and microvascular obstruction. The clues are the timing — usually 24 to 72 hours after the injury, a lucid interval after the initial trauma — and the triad of respiratory failure, petechiae and neurological change. Treatment is essentially supportive: oxygen, mechanical ventilation if needed, and no proven benefit for heparin, alcohol or any specific antidote.",
      },

      { type: "heading", level: 2, text: "Gas and air embolism" },
      {
        type: "definition",
        term: "Decompression sickness",
        text: "Bubbles of inert gas (mostly nitrogen) released from solution in blood and tissues when the ambient pressure falls too quickly — the disease of divers and caisson workers.",
      },
      {
        type: "paragraph",
        text: "A diver who ascends without eliminating the nitrogen dissolved at depth forms gas bubbles in the tissues. Type I is milder — joint and muscle pain (the bends) and skin itch. Type II is the pulmonary form (the chokes) and the neurological form with paraesthesiae, confusion and, at worst, spinal and cerebral infarction; it is treated by hyperbaric recompression, which shrinks the bubbles and re-dissolves the gas. The same inert-gas problem explains why oxygen — which the body consumes and can therefore eliminate — is preferred to nitrogen in inspired gas at depth.",
      },
      {
        type: "paragraph",
        text: "Air embolism is a different iatrogenic hazard: air introduced into a vein when a central line is disconnected, during surgery on the head and neck (where the dural sinuses are held open by gravity), during lung biopsy, or during haemodialysis. The risk depends on the rate and volume, and on a position in which the venous pressure is below atmospheric. Patients present with sudden dyspnoea, an audible mill-wheel murmur, hypotension and, if enough air reaches the carotid arteries, neurological deficits. The emergency treatment is to make venous pressure positive again — lay the patient in the left lateral head-down position ( Durant manoeuvre ), aspirate air from the right ventricle if a catheter is present, and give a high inspired oxygen concentration to wash nitrogen out and shrink the bubbles by diffusion.",
      },

      { type: "heading", level: 2, text: "Amniotic fluid and tumour emboli" },
      {
        type: "paragraph",
        text: "Amniotic fluid embolism is the rarest and most lethal of the common emboli. During prolonged labour, amniotic fluid and fetal squames enter the maternal uterine sinuses; the patient develops abrupt hypoxia, circulatory collapse, and disseminated intravascular coagulation. The mechanism appears less a pure obstruction than an anaphylactoid reaction to fetal material, which is why it behaves more like an acute immunological catastrophe than like a blocked pipe, and why it is poorly predicted by the volume of fluid involved.",
      },
      {
        type: "paragraph",
        text: "Tumour emboli are the microscopic correlate of metastasis, which you will study in the neoplasia lessons. A tumour that invades a vein sheds fragments that follow the route of flow — so renal cell carcinoma embolises to the lungs and, from there, through the pulmonary capillaries into the arterial side. Finding tumour cells in the vasculature of a resection specimen is thus not a technical artefact; it is a measurable predictor of subsequent metastasis.",
      },

      { type: "heading", level: 2, text: "Fates of an embolus" },
      {
        type: "paragraph",
        text: "An embolus is usually a one-time event with three possible endings. Small or fresh fragments are lysed by the fibrinolytic system and disappear — a small pulmonary embolus may leave no trace at all. If the vessel dies, the tissue beyond it infarcts, and the infarct then follows the usual inflammatory and repair sequence you learned in lessons 1 to 4. Larger fragments organise and recanalise, sometimes leaving a web or a saddle of scar tissue across the vessel, which is the appearance pathologists see long afterwards in unexplained pulmonary hypertension.",
      },
      {
        type: "table",
        headers: ["Fate", "When it happens", "Long-term consequence"],
        rows: [
          ["Lysis", "The embolus is small or fresh and fibrinolysis succeeds", "None — a small pulmonary embolus often heals completely"],
          ["Organisation and recanalisation", "The embolus is incorporated by fibroblasts and new channels open through it", "A scarred vessel with persistent webs and local stenosis"],
          ["Infarction of the tissue beyond", "The occluded artery supplies tissue without a collateral supply", "A scar, with the functional loss of the dead territory"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "All embolisms are thromboembolisms. They are not — fat, gas, amniotic fluid, tumour and foreign-body emboli have their own sources and their own clinical syndromes, and none of them is a fragment of a thrombus.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "A pulmonary embolism must be large to be lethal. Size does not have to be enormous; and the group most likely to die is the one in which the embolus mechanically obstructs the right ventricular outflow — the saddle embolus — a fraction of the clots lodged at the lung periphery.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Any acute hypoxaemic respiratory collapse with a clotting disorder two days after childbirth is pulmonary oedema. Amniotic fluid embolism should be on the list: the triad of hypoxia, shock and DIC during or shortly after labour is its signature.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A young woman has breathlessness two weeks after starting the combined contraceptive pill, and a CT scan shows a pulmonary embolus. What has happened?",
        answer: "Oestrogen-induced hypercoagulability has promoted a deep-vein thrombosis in the pelvis or leg, and a fragment has embolised through the right heart into the pulmonary arteries — a pulmonary embolism.",
        explanation: "Oestrogen therapy is a listed cause of hypercoagulability in Virchow's triad; the venous embolus then reaches the lung circulation, which is why the presentation is respiratory rather than cerebral.",
      },
      {
        type: "question",
        prompt: "A scuba diver surfaces too quickly and develops joint pain, itching skin and tingling in the feet. What is the pathology, and how is it treated?",
        answer: "Decompression sickness — bubbles of inert nitrogen released from solution in blood and tissues when the ambient pressure falls too quickly, obstructing vessels and distending tissues. It is treated with hyperbaric recompression, which shrinks the bubbles and re-dissolves the gas, and with oxygen, which accelerates the washout of nitrogen.",
        explanation: "The spinal and cerebral forms (Type II) are the emergencies: they can cause paraplegia and cognitive change. Prevention is proper decompression tables and slow ascent.",
      },
      {
        type: "question",
        prompt: "Why does an embolus from a leg-vein thrombosis cause breathlessness, while an embolus from a left-atrial thrombus causes a stroke?",
        answer: "Because the chamber of the heart the embolus passes through determines the circulation it reaches: venous blood is carried through the right heart into the pulmonary arteries, so the leg-vein embolus obstructs the lung circulation; a left-atrial thrombus enters the systemic circulation through the left ventricle and aorta, and most systemic emboli arrest in the cerebral circulation.",
        explanation: "The destination — and therefore the whole clinical picture — is set by the route, not by the embolus itself. A venous embolus can only reach the lungs unless there is a right-to-left shunt.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A patient with a deep-vein thrombosis feels sudden breathlessness while straining at stool. Which vessel will the embolus reach FIRST as it leaves the deep veins?",
        options: [
          "The left ventricle and then the aorta",
          "The right atrium, right ventricle and pulmonary arteries",
          "The portal vein and the liver",
          "The pulmonary vein and the left atrium",
        ],
        correctIndex: 1,
        explanation: "Venous return carries the embolus through the right atrium into the right ventricle and then into the pulmonary arterial tree — which is why a venous embolus causes respiratory symptoms and never a stroke in a patient without a septal defect.",
      },
      {
        type: "mcq",
        stem: "Which pair of findings characterises fat embolism syndrome most strongly?",
        options: [
          "Pleuritic chest pain at 48 hours with a normal respiratory rate",
          "Respiratory failure, petechial rash and cognitive change, 24-72 hours after a long-bone fracture",
          "Haemoptysis from a PE with a clear chest at 48 hours",
          "A raised D-dimer alone after a chest injury",
        ],
        correctIndex: 1,
        explanation: "Fat embolism classically appears 24-72 hours after a long-bone fracture — the lucid interval — with the respiratory, skin and cerebral triad described; a plain pulmonary embolism presents earlier and without the petechial rash and mental change.",
      },
      {
        type: "mcq",
        stem: "Which is the commonest vein-level embolus source of systemic arterial embolism?",
        options: [
          "A mural thrombus in the left ventricle after myocardial infarction",
          "A deep-vein thrombosis in the leg",
          "A thrombus in a jugular vein",
          "A portal vein thrombus",
        ],
        correctIndex: 0,
        explanation: "Systemic (arterial) emboli must come from the left side of the heart, the aorta or the proximal systemic arteries — classically a mural thrombus over an infarct, or thrombus in a fibrillating atrium. Leg-vein thrombi travel to the lungs.",
      },
      {
        type: "mcq",
        stem: "A woman collapses during prolonged labour with hypoxia, shock and bruising, followed by oozing from venepuncture sites. Which embolus explains this picture?",
        options: ["Air embolism", "Tumour embolism", "Amniotic fluid embolism", "Fat embolism"],
        correctIndex: 2,
        explanation: "Amniotic fluid embolism occurs during labour and presents with anaphylactoid respiratory collapse plus a consumptive coagulopathy (DIC), not with simple vascular obstruction — the oozing venepuncture sites are the coagulopathy, not a platelet problem of the embolus itself.",
      },
      {
        type: "mcq",
        stem: "Which of the following is the immediate best response to air embolism from a disconnected central line?",
        options: [
          "Raise the head of the bed and give aspirin",
          "Lay the patient left-lateral head-down, aspirate right ventricular air, give 100% oxygen",
          "Give heparin thrombolysis and observe",
          "Insert a chest drain bilaterally",
        ],
        correctIndex: 2,
        explanation: "The Durant manoeuvre makes venous pressure positive again, keeping air out and keeping the right ventricular air pocket away from the pulmonary outflow; aspiration where possible and a high inspired oxygen (which washes out nitrogen and speeds bubble absorption) complete the emergency management.",
      },
      {
        type: "mcq",
        stem: "What proportion of systemic arterial emboli occlude the cerebral circulation?",
        options: ["About 10%", "About 20%", "About 80%", "About 50% of them lodge in the splenic artery"],
        correctIndex: 2,
        explanation: "Approximately four out of five systemic emboli enter the internal carotid arteries and the cerebral circulation; the rest go to the lower limb, the mesentery, the kidneys, the spleen and the viscera — which is why stroke is the dominant complication of embolism from the left heart.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "An embolus is intravascular material in transit; almost all of them are thromboemboli, and their destination is set by the chamber of the heart they pass through — venous clots go to the lungs, arterial clots go to brain, limb and gut. Fat, gas, amniotic fluid, tumour and infective emboli are each a distinct clinical syndrome with its own source. An embolus may be lysed silently, organise and recanalise, or kill the tissue it lodges in front of — and infarction is that last ending.",
      },
      {
        type: "paragraph",
        text: "Next: what happens when that tissue dies — ischaemia and infarction, including why some infarcts are pale and others red, and why collateral supply changes everything.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 8 — Infarction & ischaemia (fully authored)
// ---------------------------------------------------------------------------
function lesson8() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define ischaemia, infarction and death by time; rank the tissues by their vulnerability to hypoxia; predict the shape, colour and outcome of an infarct in a named organ; distinguish pale from red infarcts and state which organs produce each; list the factors that decide infarct size; and relate the clinical complications of an infarct to its location.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-7, in particular lesson 1 (cell injury and the patterns of necrosis), lesson 5 (thrombosis) and lesson 7 (embolism): an infarct is what happens when a thrombus or embolus stops flow, and the necrosis you see in it is the pattern you have already learned to classify.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Infarction",
        text: "Ischaemic necrosis of tissue caused by obstruction of its arterial supply — infarcts occur in organs whose blood supply is sufficient to keep the tissue alive until the moment it is cut off, and then fails.",
      },
      {
        type: "paragraph",
        text: "Ischaemia and infarction are two different words. Ischaemia is the loss of arterial blood flow; the tissue is in danger. Infarction is the irreversible outcome of prolonged, severe ischaemia — the tissue has actually died. Everything between is a race: the slower the occlusion, the longer the tissue can survive; the richer the collateral supply, the longer still. All the geography of infarction — where it strikes, how big it is, what colour it is — follows from that race.",
      },

      { type: "heading", level: 2, text: "Worked example: the sequence in time" },
      {
        type: "table",
        headers: ["Time after occlusion", "What the tissue is doing", "What can be done"],
        rows: [
          ["Seconds to minutes", "Aerobic metabolism fails and ATP starts to fall", "Restore flow quickly — reperfusion of myocardium and brain is a matter of minutes"],
          ["Minutes to an hour", "Reversible injury: cell swelling, blebs, nuclear chromatin clumping", "Reversible with oxygen and substrate, though some cells (neurons) are already lost"],
          ["Hours", "Irreversible injury: mitochondrial failure and massive calcium entry", "Too late to save this tissue; the aim now is to limit its size and treat complications"],
          ["Days", "Coordinated necrosis and the inflammatory response: swelling, neutrophil infiltration, fever, leucocytosis", "Nothing enzymatic can reverse it — the neutrophil influx is a reaction to death, not its cause"],
          ["Weeks", "Repair: granulation tissue replaces the infarct, then a scar", "Scarring is fixed; the aim is rehabilitation and preventing a second event"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Time is the critical variable in the commonest emergencies, because death accelerates. Neurons lose function after 3 to 5 minutes; myocardium after about 20 to 30 minutes of complete ischaemia — the origin of 'time is brain' in thrombolysis and 'time is muscle' in primary coronary intervention.",
      },

      { type: "heading", level: 2, text: "Why some tissues infarct and others do not" },
      {
        type: "paragraph",
        text: "The answer is anatomical before it is cellular: what collateral circulation does the organ have, and how fast did the occlusion develop? The kidney, spleen and heart have mostly end-arteries, so they infarct when their supply stops abruptly. The lung has a double supply, from pulmonary and bronchial arteries, and the forearm has a rich collateral network, so both tolerate obstruction far better. The brain is the opposite — no functional anastomoses beyond the circle of Willis, so a small occluded artery kills the territory it feeds.",
      },
      {
        type: "table",
        headers: ["Organ", "Collateral protection", "Effect of abrupt arterial occlusion"],
        rows: [
          ["Brain", "Circle of Willis and small leptomeningeal anastomoses, but no functional overlap between adjacent cortical territories", "Infarct (liquefactive necrosis) of the territory supplied"],
          ["Heart", "Coronary anastomoses exist but are not functional at a haemodynamic level", "Myocardial infarct (coagulative necrosis), unless collaterals were developed over months"],
          ["Kidney", "None — end-artery", "Pale infarct, wedge-shaped"],
          ["Spleen", "None — end-artery", "Pale infarct, wedge-shaped"],
          ["Lung", "Dual circulation — pulmonary and bronchial arteries", "Infarcts only if there is also cardiac failure or another predisposing factor"],
          ["Small intestine", "Arches between the jejunal and ileal branches", "Infarcts only in segmental ('marginal artery') occlusion, and then it is haemorrhagic"],
          ["Liver", "Dual circulation — portal vein and hepatic artery", "Infarcts only with combined compromise, unless the circulation is chronically sluggish"],
        ],
      },
      {
        type: "paragraph",
        text: "There are two further determinants. The speed of the occlusion matters because a slowly developed stenosis gives collaterals time to open, so a gradual but severe coronary narrowing may never cause an infarct at all. And the oxygen content of the delivered blood matters: an anaemic, cyanosed or hypotensive patient infarcts tissue more easily, so the same arterial occlusion does more damage in a shocked patient.",
      },

      { type: "heading", level: 2, text: "Pale versus red infarcts" },
      {
        type: "paragraph",
        text: "Two colours of infarct exist, and the difference is not microscopic but anatomical: whether blood can still reach the region after the artery is blocked. A pale (anaemic, white) infarct occurs in an organ with an end-artery supply, where the dead region is dense with no blood entering it — heart, kidney, spleen. A red (haemorrhagic) infarct occurs in a loose tissue where blood still flows in from another source or oozes back through loose tissues — lung, ovary after torsion, testis after torsion, small intestine — and where the dead area is filled with extravasated red cells.",
      },
      {
        type: "table",
        headers: ["", "Pale (anaemic) infarct", "Red (haemorrhagic) infarct"],
        rows: [
          ["Typical organs", "Heart, kidney, spleen, brain (softens and liquefies)", "Lung, ovary, testis, small intestine"],
          ["Why the colour", "The tissue is dense and no blood enters after occlusion", "Blood still reaches or re-enters the area and fills a loose, spongy tissue"],
          ["Gross appearance", "White or grey wedge with its base at the organ surface, apex pointing to the blocked vessel", "Deeply congested, dark and swollen, sharply defined"],
          ["Dual circulation or not", "End-artery supply", "Double supply or venous occlusion"],
        ],
      },
      {
        type: "paragraph",
        text: "Note two grey zones. Red infarcts occur where arterial thrombosis occurs on a background of venous congestion: the notorious splenic infarct is pale in a healthy spleen but haemorrhagic in congestive heart failure. And pulmonary infarcts are red too because of the bronchial arterial supply to lung tissue, which continues to deliver blood into the dead area.",
      },

      { type: "heading", level: 2, text: "The age of an infarct" },
      {
        type: "paragraph",
        text: "Because infarcts pass through the standard necrosis-inflammation-repair sequence, the pathologist can date them, and so can the histologist. It is an everyday question at post-mortem and is asked in examinations because it is the whole of the pathology in miniature.",
      },
      {
        type: "table",
        headers: ["Time", "Gross appearance", "Microscopic appearance"],
        rows: [
          ["Under 24 hours", "Pale and ill-defined, or hard to see at all in the brain; there may be nothing to the naked eye", "Coagulative necrosis at the margins only; on electron microscopy the characteristic isometric contraction bands"],
          ["1-3 days", "The infarct is clearly defined and depressed, with a congested rim; the lung embolus infarct becomes haemorrhagic", "Coagulative necrosis throughout, with a neutrophilic infiltrate at the edge"],
          ["1-2 weeks", "The necrotic centre is yellowish and softened, and the congested margin is wide", "Macrophages and granulation tissue invade the edge; capillaries grow in"],
          ["Weeks to months", "The infarct is replaced by a scar: white, firm, contracted", "A collagenous scar, gradually thinned and contracted"],
        ],
      },

      { type: "heading", level: 2, text: "Worked example: clinical consequences" },
      {
        type: "paragraph",
        text: "An elderly man with atrial fibrillation develops cramping abdominal pain and later passes dark red blood mixed with stool. The clinical picture is the result of an embolus from the left atrium that has occluded a branch of his superior mesenteric artery. The dead segment of bowel is a transmural, haemorrhagic infarction; without surgery and reperfusion within hours it perforates, and the peritoneal cavity is flooded with faecal material — peritonitis, shock and death. Contrast the splenic infarct from the same fibrillation (left hypochondrial pain, sometimes a friction rub, and no other consequence), or the femoral embolus from the same source (a cold, pale, pulseless leg requiring urgent embolectomy). Location decides everything.",
      },
      {
        type: "paragraph",
        text: "The complications of the two commonest infarcts — myocardial and cerebral — follow the same rules. The myocardial infarct leaves a scar that does not contract and does not conduct, so heart failure and arrhythmia follow; the cerebral infarct liquefies, so the area softens into a CSF-filled cavity surrounded by gliosis. Both are irreversible, and both are the reason the words 'time is muscle' and 'time is brain' are the standard slogans of acute care.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying every organ with a pale infarct has no collateral supply at all. The heart has coronary anastomoses; they are simply not functional at flow-demand levels. Saying the lung cannot infarct because it has a dual supply — it can, provided the bronchial circulation is also compromised, as in heart failure, so the pulmonary and bronchial vessels cannot compensate between them.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Giving red infarcts an arterial-type explanation. Red infarcts classically occur in loose tissues with a dual or continuing circulation, or following venous occlusion; they are not due to 'bleeding through' the necrotic area alone.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Defining infarction by a time limit alone. The same hour that saves a myocardium will do nothing for a neuron — the threshold for irreversible injury is a property of the tissue, not of the clock.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does a cerebral infarction injure the brain more severely than the equivalent ischaemia injures skeletal muscle?",
        answer: "Because neurons depend almost entirely on oxidative metabolism: the brain stores essentially no glycogen and has no meaningful anaerobic reserve, and its neurons are among the most hypoxia-sensitive cells in the body, so complete ischaemia causes irreversible injury within about 3 to 5 minutes — whereas skeletal muscle tolerates the injury for far longer.",
        explanation: "Neurons have almost no glycogen stores and cannot carry out meaningful anaerobic glycolysis; cardiac muscle can survive through the first 20-30 minutes, and skeletal muscle is even more resistant.",
      },
      {
        type: "question",
        prompt: "A patient with congestive heart failure develops a splenic infarct, and the infarct is dark red. Why, when the splenic infarct in a healthy person is white?",
        answer: "Because heart failure raises venous pressure throughout the system, so blood continues to enter the spleen through the arterial supply and oozes back into the dead, congested tissue, producing a haemorrhagic (red) infarct rather than a pale one.",
        explanation: "The colour of an infarct mirrors how much blood actually reaches its parenchyma after the occlusion — the congested heart failure bolsters the circulation and turns an anaemic infarct into a haemorrhagic one.",
      },
      {
        type: "question",
        prompt: "A patient has a fresh, clear-cut pale wedge-shaped infarct in the kidney. When, roughly, did the obstruction occur, and what is on the microscope?",
        answer: "Approximately 1 to 3 days ago, from coagulative necrosis with a neutrophilic margin — the outline is sharpest at this age, and earlier than this it would be visible as a pale indistinct area.",
        explanation: "The pathologist dates infarcts from the transition from oedema and neutrophils (day 1-3) to macrophages and granulation tissue (week 2), and finally to a scar (months).",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which pattern of necrosis is expected in a pulmonary infarct caused by an embolus?",
        options: ["Coagulative", "Liquefactive", "Caseous", "Haemorrhagic (red) with coagulative features"],
        correctIndex: 3,
        explanation: "Pulmonary infarcts are classically red (haemorrhagic) — the loose sponge of lung and the continuing bronchial arterial supply fill the dead area with blood, which is why the characteristic features are haemorrhagic necrosis, not the coagulative pattern of most solid organs.",
      },
      {
        type: "mcq",
        stem: "Which of the following tissues is most vulnerable to irreversible ischaemic injury?",
        options: ["Skeletal muscle", "Neurons in the brain", "Renal tubular epithelium", "Myocardium"],
        correctIndex: 1,
        explanation: "Neurons are the most vulnerable — irreversible injury after about 3 to 5 minutes of complete ischaemia, followed by myocardium at 20-30 minutes and skeletal muscle at far longer times. The order explains why stroke cannot be treated after the first hours, whereas a limb may survive much longer.",
      },
      {
        type: "mcq",
        stem: "A patient has a pale, well-defined, wedge-shaped infarct in the spleen. What is the most likely appearance at 2 weeks?",
        options: [
          "It has completely disappeared by normal regeneration",
          "A yellowish softened centre with a wide congested border, with macrophages and new granulation tissue at the edge",
          "It is becoming a caseating granuloma",
          "It has liquefied into a fluid-filled cavity",
        ],
        correctIndex: 1,
        explanation: "At one to two weeks necrosis has been removed by macrophages and the infarct is being replaced by granulation tissue from its margins — the stage that precedes a contracted, permanent scar. Complete disappearance by regeneration does not occur because the spleen has no regenerative reserve.",
      },
      {
        type: "mcq",
        stem: "Which determinant most strongly reduces the size of a myocardial infarct when an artery suddenly occludes?",
        options: [
          "The oxygen content of the patient's blood alone",
          "A rich collateral circulation developed through a gradual previous narrowing",
          "An enlarged heart",
          "A shorter time between ECG and liver enzymes",
        ],
        correctIndex: 1,
        explanation: "Collateral vessels take time to develop; a slowly progressive stenosis recruits them, so the abrupt occlusion of a chronically narrowed artery may infarct far less. Oxygenation and the patient's general state also matter, but collateral supply is the strongest determinant of the size of the dead territory.",
      },
      {
        type: "mcq",
        stem: "Which best explains the pattern of necrosis in a cerebral infarct?",
        options: [
          "Caseous necrosis from a granulomatous reaction",
          "Liquefactive necrosis, because the brain has no supporting stroma and is rich in hydrolytic enzymes",
          "Coagulative necrosis, because brain tissue is vascular",
          "Fat necrosis, because the brain is lipid-rich",
        ],
        correctIndex: 1,
        explanation: "Brain ischaemia liquefies the tissue; the brain has no collagenous framework to retain form, and its cells are rich in lipid and hydrolytic enzymes, so the dead area softens into a fluid-filled cavity rather than a coagulative wedge.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Infarction is the endpoint of prolonged ischaemia. The shape, colour and outcome of the infarct follow anatomy alone: pale wedges from end-arteries, red haemorrhagic infarcts in loose double-circulation organs, and liquefaction in the brain. Timing decides everything — neurons within minutes, myocardium within half an hour — and after death the infarct passes through the familiar cycle of necrosis, inflammation, and scar. The one thing that changes the size of that dead territory is collateral blood supply.",
      },
      {
        type: "paragraph",
        text: "Next: the coagulopathy that converts every one of these events into a bleeding catastrophe — disseminated intravascular coagulation, in which clotting and bleeding are the same process.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 9 — Disseminated intravascular coagulation (fully authored)
// ---------------------------------------------------------------------------
function lesson9() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define disseminated intravascular coagulation and explain how a single process produces both thrombosis and bleeding; list its major acute and chronic causes; interpret the laboratory profile of DIC and explain each abnormality; distinguish DIC from other thrombocytopenia-and-bleeding states; and describe the principles of its management and their rationale.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 5 (thrombosis) and lesson 6 (oedema and shock) from this course, plus the coagulation cascade from physiology. DIC is a derangement of the haemostatic system itself, so Virchow's triad is not the framework here — it is what happens when the whole clotting system is switched on at once.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Disseminated intravascular coagulation",
        text: "A pathological, widespread activation of the coagulation system in which thrombin is generated uncontrollably inside the living circulation, fibrin thrombi plug the microvasculature, and the consumption of platelets and clotting factors then produces a hemorrhagic diathesis.",
      },
      {
        type: "paragraph",
        text: "DIC is never a disease in its own right; it is a complication of something else — usually a catastrophe of obstetric, malignant or septic origin. The apparent paradox is the whole lesson: because the coagulation system is switched on everywhere, fibrin is deposited in every small vessel, which uses up the platelets and clotting factors; the body's fibrinolytic system then breaks the fibrin down, generating fragments that themselves prevent normal clotting. The patient bleeds because the system is exhausted by the clotting it has already done, and the organs fail because the microcirculation of every organ is plugged with fibrin.",
      },

      { type: "heading", level: 2, text: "Consequences on two fronts" },
      {
        type: "table",
        headers: ["Consequence", "Mechanism", "Clinical manifestation"],
        rows: [
          ["Thrombotic", "Microvascular occlusion by fibrin thrombi, platelet aggregates and red cells forced through the narrowed vessels", "Ischaemic injury to skin (petechiae, purpura fulminans and acral necrosis), kidney (acute cortical necrosis), brain, adrenal glands and digits"],
          ["Haemorrhagic", "Consumption of platelets and factors II, V and VIII, plus fibrin degradation products that inhibit fibrin polymerisation", "Oozing from venepuncture sites and lines, epistaxis, haematuria, gastrointestinal haemorrhage, purpura"],
        ],
      },
      {
        type: "paragraph",
        text: "The classic description of the acute form is the bleeding one: the patient who bleeds from every recent puncture, whose surgical sites weep and whose urine and stool contain fresh blood. In the chronic form the balance is different — the bleeding is mild or absent, and the dominant picture is thrombosis: red clots forming in a digital cyanosis, or recurrent venous thromboembolism in a patient with disseminated malignancy.",
      },

      { type: "heading", level: 2, text: "Causes" },
      {
        type: "table",
        headers: ["Category", "Examples", "Mechanism of activation"],
        rows: [
          ["Obstetric", "Abruptio placentae, amniotic fluid embolism, retained dead foetus, septic abortion", "Tissue factor released from the placenta and decidua enters the maternal circulation"],
          ["Infections", "Sepsis from Neisseria meningitidis and other Gram-negative rods; severe sepsis from any organism; viral haemorrhagic fevers", "Endotoxin and cytokines trigger tissue factor expression on monocytes and endothelium"],
          ["Malignancy", "Acute promyelocytic leukaemia (the classic leukaemic form), metastatic adenocarcinoma", "Tumour tissue factor and procoagulant-rich malignant cells (the granules of promyelocytes)"],
          ["Trauma and burns", "Massive soft-tissue trauma, crush injury, burns, extensive surgery", "Tissue factor released from injured tissue and haemorrhagic shock"],
          ["Vascular and haemolytic", "Giant haemangioma (Kasabach-Merritt), aortic aneurysm, haemolytic transfusion reaction, snake bite", "Procoagulant exposure or endothelial injury within an abnormal vessel"],
          ["Other", "Acute pancreatitis, fulminant liver failure, heat stroke, transplantation", "Circulating enzymes, activated cytokines or direct endothelial damage"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Acute promyelocytic leukaemia deserves its own memory: the malignant promyelocyte granules are intensely procoagulant, and its patients are classically found to be bleeding with a DIC profile at presentation. Treating the leukaemia with all-trans retinoic acid corrects the DIC along with the disease.",
      },

      { type: "heading", level: 2, text: "Worked example: the laboratory profile" },
      {
        type: "paragraph",
        text: "A woman in labour with abruptio placentae begins to bleed from her uterine incision and her venepuncture sites. The samples taken before any transfusion show a platelet count of 35 × 10⁹/L, a prothrombin time twice the control, the activated partial thromboplastin time prolonged, a low fibrinogen, and a very high D-dimer. The blood film shows fragmented red cells.",
      },
      {
        type: "table",
        headers: ["Investigation", "Expected in DIC", "Why"],
        rows: [
          ["Platelet count", "Low (thrombocytopenia)", "Consumed in the widespread platelet aggregation"],
          ["Prothrombin time", "Prolonged", "Consumption of factors I, II, V and VIII"],
          ["Activated partial thromboplastin time", "Prolonged", "The same consumption of intrinsic-pathway factors"],
          ["Fibrinogen", "Low", "Consumed by the fibrin generation; a normal fibrinogen does not exclude DIC because it is an acute-phase reactant and often starts high"],
          ["D-dimer and fibrin degradation products", "High", "Fibrinolysis of the microvascular fibrin deposits — the most sensitive clue"],
          ["The blood film", "Schistocytes and helmet cells", "Red cells sheared by fibrin strands in the microcirculation — microangiopathic haemolysis"],
        ],
      },
      {
        type: "paragraph",
        text: "Read the pattern as a story: the D-dimer was generated by clot, so something has clotted; the platelet count, PT and fibrinogen have fallen, so the clotting has consumed the machinery; the schistocytes are the signature of the fibrin mesh inside the microcirculation. The consumption of a factor profile is the picture of a haemostatic system running out of its own parts.",
      },

      { type: "heading", level: 2, text: "Distinguishing DIC from its mimics" },
      {
        type: "table",
        headers: ["Condition", "Platelets", "Coagulation times", "Fibrinogen", "Distinguishing feature"],
        rows: [
          ["DIC", "Low", "Both prolonged", "Low", "Consumption with high D-dimer; fibrinolytic debris present"],
          ["Thrombotic thrombocytopaenic purpura", "Low", "Normal (PT/APTT)", "Normal", "Microangiopathic haemolysis with neurological change, fever and renal failure, but clotting times are normal"],
          ["Heparin-induced thrombocytopenia", "Low", "PT normal; APTT may be prolonged by heparin", "Normal", "Exposure to heparin 5-10 days before, and thrombosis rather than bleeding"],
          ["Severe liver failure", "Low", "Prolonged", "Low", "A clinical history of liver disease, and D-dimer is not raised unless DIC is superimposed"],
        ],
      },
      {
        type: "paragraph",
        text: "The distinction matters for acute medicine, because heparin is the wrong treatment for TTP but is central to the thrombotic forms of DIC. The commonest error in examinations is the platelet count alone; read the coagulation times and the D-dimer together.",
      },

      { type: "heading", level: 2, text: "Management" },
      {
        type: "paragraph",
        text: "There is no single drug for DIC; it is managed by treating the cause and replacing what is missing while giving the system a chance to correct itself. Platelets, fresh frozen plasma and cryoprecipitate are given to a bleeding patient based on the laboratory results and blood loss. In the rare thrombosis-dominated forms — chronic DIC of malignancy, purpura fulminans, or acral ischaemia — low-dose heparin is given deliberately, because the treatment is to halt the consumption. Supportive care of the organ failure follows the shock and acute kidney injury lessons of the course, and the outcome depends almost entirely on the underlying cause.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a low fibrinogen excludes DIC, or that a normal platelet count rules it out. Early DIC can exist with a normal fibrinogen (fibrinogen is an acute-phase protein and often rises before it falls) and the platelet count falls before the coagulation times change.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating a bleeding DIC patient with heparin as a first reflex. In the common haemorrhagic forms, replacement and treating the cause are the answer; heparin is reserved for the thrombotic forms of the disease.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Explaining the purpura as a platelet problem from thrombocytopenia alone. The purpura fulminans of DIC is a thrombotic lesion: fibrin thrombi occlude the skin vessels, and the skin necrosis is a microvascular infarction — bleeding into the skin comes from consumption of factors, not from an immune platelet disorder.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A patient has DIC. Why does the patient bleed, and why does the patient clot at the same time?",
        answer: "The patient clots because thrombin is generated everywhere and fibrin plugs the microcirculation; the patient bleeds because this process consumes platelets and clotting factors and because the fibrin degradation products produced by the body's own lysis of the fibrin further impair normal clotting.",
        explanation: "The single name describes two faces of one process; the treatment reverses the process but the same process causes both sides.",
      },
      {
        type: "question",
        prompt: "Which single laboratory test best points to ongoing microvascular fibrin generation in a suspected DIC?",
        answer: "The D-dimer — because it is generated by degradation of fibrin, so a high level indicates that fibrin has actually been formed and lysed. Platelet count and coagulation times show the consumption, but the D-dimer is the most sensitive signal of the process itself.",
        explanation: "D-dimer is the direct product of fibrin breakdown, which is why it is raised in DIC (fibrinolysis of the microvascular fibre) but can be raised in other clotting states as well.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which best describes the primary defect in disseminated intravascular coagulation?",
        options: [
          "A reduced production of clotting factors in the liver",
          "Widespread intravascular thrombin generation with consumption of clotting factors and platelets",
          "An isolated platelet antibody-mediated thrombocytopenia",
          "An abnormality of the vessel wall alone",
        ],
        correctIndex: 1,
        explanation: "DIC is activation of the coagulation system, not a failure of synthesis: the liver in fact continues to produce factors as best it can; the problem is that the clotting system is consuming its components faster than they can be replaced.",
      },
      {
        type: "mcq",
        stem: "Which set of results is characteristic of acute DIC?",
        options: [
          "Low platelets, prolonged PT and APTT, low fibrinogen, high D-dimer",
          "Low platelets with normal coagulation times",
          "High platelets with prolonged PT",
          "Normal platelets, prolonged APTT, normal D-dimer",
        ],
        correctIndex: 0,
        explanation: "Consumption lowers platelets, factors and fibrinogen; the prolonged times come from the missing factors; the D-dimer is high because fibrin has been formed and broken down. Normal coagulation times with thrombocytopenia are the pattern of TTP instead.",
      },
      {
        type: "mcq",
        stem: "A patient with acute promyelocytic leukaemia is bleeding from venepuncture sites with a low fibrinogen and schistocytes. Which process explains this?",
        options: [
          "A primary liver failure",
          "Procoagulant granules released from malignant promyelocytes triggering DIC",
          "An immune thrombocytopenia",
          "A vitamin K deficiency",
        ],
        correctIndex: 1,
        explanation: "Acute promyelocytic leukaemia is the classic leukaemic cause of DIC: the granules of the malignant promyelocytes are intensely procoagulant, and all-trans retinoic acid therapy rapidly corrects the coagulopathy.",
      },
      {
        type: "mcq",
        stem: "Which is the correct first-line approach in the bleeding patient with acute DIC?",
        options: [
          "Immediate full-dose heparin anticoagulation",
          "Treat the underlying cause and replace platelets, plasma and cryoprecipitate as indicated",
          "Aspirin and steroids only",
          "Kidney-dialysis alone to remove the fibrin fragments",
        ],
        correctIndex: 1,
        explanation: "In the haemorrhagic form, management is replacement of what is consumed plus the urgent treatment of the obstetric, malignant or septic cause. Heparin has a place only in the thrombosis-dominated forms, where the aim is to stop consumption.",
      },
      {
        type: "mcq",
        stem: "A patient has thrombocytopenia, neurological changes, fever, normal coagulation times and a normal fibrinogen. Which is the most likely diagnosis?",
        options: ["DIC", "Thrombotic thrombocytopenic purpura", "Haemolytic transfusion reaction", "Acute liver failure"],
        correctIndex: 1,
        explanation: "The pentad of TTP is thrombocytopenia, microangiopathic haemolysis, neurological signs, renal impairment and fever — with normal coagulation times, because the platelet consumption is driven by microvascular platelet aggregation rather than by activation of the coagulation cascade.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Disseminated intravascular coagulation is one process with two faces: thrombin generated in the microcirculation plugs the smallest vessels and consumes the clotting system, so the patient bleeds from the very factors the clotting has exhausted. It is diagnosed in the laboratory as low platelets, prolonged coagulation times, low fibrinogen and a high D-dimer, and treated by treating its cause and replacing what is missing. The specialty that follows will take the same haemostatic system and show it behaving in a far more controlled way: the haemodynamic disorders you have just finished are now behind you, and the neoplasia module begins.",
      },
      {
        type: "paragraph",
        text: "Next: neoplasia — the disease of the cell's own control of its division, from the benign adenoma to the metastasising carcinoma.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 10 — Neoplasia: definitions & nomenclature (fully authored)
// ---------------------------------------------------------------------------
function lesson10() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define a neoplasm and explain what autonomy of growth means; apply the benign/malignant classification to a named example; derive the correct name of a benign and a malignant tumour from its tissue of origin; apply the exception rules to melanoma, lymphoma and the other names that break the pattern; and explain why a benign tumour can still be clinically dangerous.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (cell injury, cell division and adaptation) from this course. Neoplasia is a disorder of the cell's own growth regulation, so hypertrophy, hyperplasia and the molecular control of the cell cycle are its foundation. The pathways of angiogenesis and haemostasis from modules 1 and 2 are what malignant tumours exploit.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Neoplasm",
        text: "An abnormal mass of tissue whose growth exceeds and is uncoordinated with that of the normal tissues, and which persists after the stimulus that initiated it has been withdrawn.",
      },
      {
        type: "paragraph",
        text: "Three words in that definition separate neoplasia from every other swelling. Growth exceeds the normal tissue — the question is one of relative pace, not of size. Growth is autonomous — remove the stimulus and the tumour keeps growing, unlike the hypertrophy of an exercised muscle or the hyperplasia of a wound. And the tumour is clonal — it descends from one ancestral cell whose gene expression has become abnormal and passed that abnormality on to all its descendants. Inflammation and repair swell and then settle; neoplasia does not settle.",
      },

      { type: "heading", level: 2, text: "Benign versus malignant" },
      {
        type: "table",
        headers: ["Feature", "Benign tumour", "Malignant tumour"],
        rows: [
          ["Differentiation", "Resembles its tissue of origin closely", "Ranges from well differentiated to undifferentiated"],
          ["Rate of growth", "Usually slow and progressive", "Usually rapid, but variable — some malignant tumours exist for years"],
          ["Mode of growth", "Expansile: grows to a cohesive mass, often encapsulated", "Infiltrative: invades through the basement membrane into the surrounding tissue"],
          ["Metastasis", "Does not metastasise", "Metastasises to regional lymph nodes and distant organs"],
          ["Clinical outcome", "Usually curable by excision; may still be dangerous from position, hormones or haemorrhage", "Progressive, drug-resistant and ultimately fatal if untreated"],
          ["Recurrence after removal", "Unusual", "Common, unless the excision is wide"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Benign is not the same as harmless. A benign pituitary adenoma compresses the optic chiasm and blinds, a benign meningioma kills by pressure inside the skull, a leiomyoma of the uterus causes menorrhagia, and a benign phaeochromocytoma secretes adrenaline that kills. Malignancy is defined by invasion and metastasis, not by danger alone.",
      },

      { type: "heading", level: 2, text: "Nomenclature: derive the name from the tissue" },
      {
        type: "paragraph",
        text: "Naming is a two-step rule, not a list to memorise. First identify the basic tissue class — epithelial or mesenchymal — then add the suffix that tells you the behaviour. Benign mesenchymal tumours take the tissue name plus -oma (lipoma, fibroma, chondroma, osteoma). Benign epithelial tumours are named by their surface pattern: papilloma when the surface is raised, adenoma when it forms glands, and cystadenoma when it forms cysts. The malignant counterparts replace -oma with -carcinoma for epithelial tumours and with -sarcoma for mesenchymal tumours.",
      },
      {
        type: "table",
        headers: ["Tissue of origin", "Benign", "Malignant"],
        rows: [
          ["Stratified squamous epithelium", "Squamous papilloma", "Squamous cell carcinoma"],
          ["Glandular epithelium", "Adenoma", "Adenocarcinoma"],
          ["Transitional epithelium", "Transitional cell papilloma", "Transitional cell carcinoma"],
          ["Fat", "Lipoma", "Liposarcoma"],
          ["Fibrous tissue", "Fibroma", "Fibrosarcoma"],
          ["Cartilage", "Chondroma", "Chondrosarcoma"],
          ["Bone", "Osteoma", "Osteosarcoma"],
          ["Blood vessels", "Haemangioma", "Angiosarcoma"],
          ["Lymphoid tissue", "(benign reactivity only)", "Lymphoma"],
          ["Haemopoietic marrow", "(does not occur)", "Leukaemia"],
          ["Melanocyte", "Naevus", "Melanoma"],
        ],
      },

      { type: "heading", level: 2, text: "The exceptions you must memorise" },
      {
        type: "paragraph",
        text: "A handful of tumours break the suffix rule, and these are exactly the ones the examination asks. In every case, the exception has a historical reason and a clinical consequence: a tumour with an innocent -oma suffix that behaves malignantly.",
      },
      {
        type: "definition",
        term: "The malignant -omas",
        text: "Melanoma, lymphoma, seminoma, hepatoma (hepatocellular carcinoma), glioma and mesothelioma are all malignant, despite their benign-looking suffixes.",
      },
      {
        type: "paragraph",
        text: "The corollary is that some -oma tumours are malignant only in some settings: a teratoma is a benign germ cell tumour unless it is immature, and hepatoma is malignant. Mixed tumours obey the rule of their worst component: a cystosarcoma phyllodes with malignant stroma is malignant. And the two lesions that look like tumours but are not are worth separating from the concept entirely — a hamartoma is an excessive but organised growth of tissues normally present in the organ, such as the cartilage of a pulmonary hamartoma; a choristoma is a normal tissue growing at a foreign site, such as gastric mucosa in a Meckel diverticulum.",
      },
      {
        type: "table",
        headers: ["Name", "What it actually is", "Why it is high-yield"],
        rows: [
          ["Melanoma", "Malignant tumour of melanocytes", "The -oma is benign by rule but the tumour kills — an entirely metastatic disease by name"],
          ["Lymphoma", "Malignant tumour of lymphoid cells", "No benign equivalent exists: lymphoid hyperplasia is not a tumour"],
          ["Seminoma", "Malignant germ cell tumour of the testis", "Radiosensitive, and curability is high — name and behaviour go together"],
          ["Hepatoma", "Malignant tumour of hepatocytes", "Derived from cirrhosis and hepatitis virus carriage"],
          ["Glioma", "Malignant tumour of glial cells", "Grades I to IV; the most common primary brain tumour"],
          ["Pleomorphic adenoma", "Benign mixed tumour of salivary gland", "Histologically mixed (epithelial and stromal) but the recurrence rate makes it a surgical problem"],
        ],
      },

      { type: "heading", level: 2, text: "Borderline and intermediate tumours" },
      {
        type: "paragraph",
        text: "Not every tumour is a benign-or-malignant binary. Some are locally aggressive without metastasising — a desmoid-type fibromatosis invades muscle and recurs after excision but never metastasises; a cystosarcoma phyllodes is benign or malignant depending on its stromal component; a carcinoid tumour is neuroendocrine, metastasises only rarely, and may secrete hormones. Establishing that a tumour is borderline or intermediate is a real histology decision, and it is why a report on a fibromatosis or an atypical carcinoid changes management from reassurance to surveillance.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a lymphoma is a benign lymphoid hyperplasia. Lymphoma is a malignant tumour; the word has no benign counterpart, and its behaviour — clonal growth, infiltration, systemic spread — is the behaviour of a cancer.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Calling a melanoma benign because of the -oma ending. Melanoma is malignant; it is the reason the 'all -omas are benign' rule is taught as a rule with exceptions, not as a law of nature.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a benign tumour cannot be dangerous. Position (pituitary, meninges, spinal canal), function (insulinoma, phaeochromocytoma, VIPoma) and haemorrhage (oesophageal leiomyoma) make the benign tumours clinically dangerous without any malignant behaviour.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A 2 cm encapsulated mass of the thyroid is removed and called a follicular adenoma. Why is this tumour not called a carcinoma?",
        answer: "Because it is encapsulated, does not invade the capsule or the surrounding thyroid, and does not metastasise — an adenoma of the thyroid is a benign epithelial tumour. It would only be a carcinoma if it showed capsular or vascular invasion.",
        explanation: "The benign/malignant decision rests on invasion and metastasis; in endocrine organs a capsular breach or vascular invasion is the decisive histological criterion.",
      },
      {
        type: "question",
        prompt: "What does the word autonomy mean when it is said that neoplasms are autonomous?",
        answer: "It means the tumour's growth does not stop when the growth stimulus that started it is removed — a neoplasm persists after the initiating stimulus is withdrawn, unlike physiological hyperplasia, which is stimulus-driven and reverses when the stimulus ends.",
        explanation: "Autonomy of growth is how neoplasia is separated from hypertrophy and hyperplasia: those responses are adaptive; neoplasia is a heritable change in the cell's own regulation.",
      },
      {
        type: "question",
        prompt: "Why is a hamartoma not considered a neoplasm?",
        answer: "Because a hamartoma is a disorganised but non-clonal overgrowth of tissues that are normally present at that site — it is a developmental abnormality whose growth stops with the rest of the body, and it does not persist or progress after the stimulus ends.",
        explanation: "Hamartomas and choristomas are malformations; they are outside the neoplastic process because they are not derived from an abnormal clonal cell population.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A 4 cm mass in the breast is well circumscribed and has never recurred after excision. Histology shows a fibroadenoma. What is it?",
        options: [
          "A malignant tumour because it is large and in the breast",
          "A benign epithelial-mesenchymal (biphasic) tumour of the breast",
          "A carcinoma because the breast is a glandular organ",
          "A hamartoma, because the tissue is mixed",
        ],
        correctIndex: 1,
        explanation: "A fibroadenoma is the benign biphasic tumour of the breast — it mixes epithelial ducts with a stromal stroma in a biphasic pattern — and size in a benign tumour is not a criterion of malignancy.",
      },
      {
        type: "mcq",
        stem: "Which statement about a malignant tumour is correct?",
        options: [
          "It must be fast-growing, because slow growth implies benign",
          "It can be well differentiated, slow-growing and lethal — these features describe grade, not behaviour",
          "It must metastasise by the time of diagnosis",
          "It is always the largest version of the corresponding benign tumour",
        ],
        correctIndex: 1,
        explanation: "Grading (differentiation) and staging (spread) are separate axes: a very well-differentiated follicular thyroid carcinoma is malignant but grows slowly, and metastasis may appear years after the resection — which is why grade is never a synonym for stage.",
      },
      {
        type: "mcq",
        stem: "Which of the following tumours is malignant despite its -oma suffix?",
        options: ["Lipoma", "Chondroma", "Melanoma", "Adenoma"],
        correctIndex: 2,
        explanation: "Melanoma — a malignant tumour of melanocytes — is the high-yield example of the malignant -omas. Lipoma, chondroma and adenoma are all benign.",
      },
      {
        type: "mcq",
        stem: "A benign phaeochromocytoma of the adrenal medulla causes fatal hypertension. Which statement best explains this?",
        options: [
          "Benign tumours are always dangerous, because they are not cancers",
          "A tumour can be benign (non-invasive, non-metastasising) and still dangerous through its position or the hormones it secretes",
          "The phaeochromocytoma must have metastasised, otherwise it would be harmless",
          "Hormonal secretion converts a benign tumour into a malignant one",
        ],
        correctIndex: 1,
        explanation: "Danger is not the definition of malignancy: a phaeochromocytoma secretes catecholamines, which cause the hypertensive crises, while the tumour itself remains benign in the pathological sense — no invasion, no metastasis.",
      },
      {
        type: "mcq",
        stem: "Which feature is the most reliable criterion separating a malignant tumour from a benign one?",
        options: ["Its size", "Its rate of growth", "Local invasion and metastasis", "The same organs it is found in"],
        correctIndex: 2,
        explanation: "Malignancy is defined by behaviour — invasive growth and metastasis. A benign tumour may be very large or occasionally grow fast, but it does not invade and does not metastasise.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "A neoplasm is an autonomous, stimulus-independent, clonal growth. It is benign when it is circumscribed and differentiated, and malignant when it invades and metastasises. Names are derived from the tissue of origin by suffix rules that every student must know and every melan memorise-exception: -oma for benign mesenchymal, adenoma/papilloma for benign epithelial, carcinoma for malignant epithelial, sarcoma for malignant mesenchymal — and melanoma, lymphoma, seminoma, hepatoma and glioma are all malignant despite the -oma.",
      },
      {
        type: "paragraph",
        text: "Next: how cancers actually acquire those behaviours — the hallmarks of cancer and the gene families whose mutation makes a normal cell into a malignant one.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 11 — Hallmarks of cancer & molecular changes (fully authored)
// ---------------------------------------------------------------------------
function lesson11() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: list the hallmarks of cancer and give one molecular example of each; distinguish an oncogene from a tumour suppressor gene by the logic of its mutation; explain how loss of DNA repair accelerates tumour formation; describe the Warburg effect and why it matters clinically; and set out the classic genetic sequence of colorectal cancer as a model of multistep carcinogenesis.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 10 (definitions and nomenclature) and lesson 1 (cell injury). You need the cell cycle, apoptosis and the signalling cascades from physiology and biochemistry (BCHM 101, modules on signal transduction and DNA replication) to follow the molecular detail.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "paragraph",
        text: "A cancer is not a cell that divides faster. A cancer is a cell that has acquired a set of capabilities, one mutation at a time, which together convert a law-abiding cell of a tissue into an autonomous, immortal, invasive, mobile and invisible-to-the-immune-system organism in its own right. Hanahan and Weinberg expressed this as the hallmarks of cancer, and the framework is worth more than any list of genes, because every gene name in the pathology textbooks maps onto one of these capabilities.",
      },
      {
        type: "table",
        headers: ["Hallmark", "What the cell gains", "Example gene or mechanism"],
        rows: [
          ["Sustained proliferative signalling", "It no longer waits for an external growth signal — it makes its own", "KRAS and BRAF mutations, HER2 amplification, autocrine growth factor loops"],
          ["Evading growth suppressors", "It ignores the tissue's stop signals from homeostatic mechanisms", "Loss of RB (retinoblastoma) and TP53"],
          ["Resisting cell death", "Apoptosis is one mechanism by which the body removes an abnormal cell — this fault in its function is lost", "BCL2 overexpression, loss of TP53"],
          ["Enabling replicative immortality", "Normal cells run out of telomeres and senesce; the cancer cell reactivates telomerase", "TERT promoter mutation, telomerase reactivation"],
          ["Inducing angiogenesis", "It recruits and builds its own blood supply", "VEGF secretion and its receptor switching off the anti-angiogenic side"],
          ["Activating invasion and metastasis", "It detaches, crosses the basement membrane, and travels and colonises", "Loss of E-cadherin, matrix metalloproteinase induction, epithelial-to-mesenchymal transition"],
          ["Reprogramming energy metabolism", "It reroutes metabolism to fuel rapid growth", "The Warburg effect — aerobic glycolysis even when oxygen is present"],
          ["Evading immune destruction", "It hides from, suppresses, or exhausts the T cells and natural killer cells that would remove it", "PD-L1 expression, loss of antigen presentation, an immunosuppressive tumour microenvironment"],
          ["Genome instability", "It accumulates mutations at a higher rate than a normal cell, which accelerates all of the above", "BRCA1/2 mismatch repair defects — hereditary non-polyposis colorectal cancer (HNPCC/Lynch)"],
          ["Tumour-promoting inflammation", "It hijacks the inflammatory infiltrate, turning macrophages and neutrophils into suppliers of growth and invasion factors", "IL-6, TNF, chemokines from tumour-associated macrophages"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Three of these hallmarks are drug targets in cancer therapy today: VEGF is the target of bevacizumab, the HER2 receptor is the target of trastuzumab, and the PD-1/PD-L1 interaction is the target of checkpoint inhibitors (pembrolizumab, nivolumab). Knowing the hallmark is how you know what the drug does.",
      },

      { type: "heading", level: 2, text: "The gene families" },
      {
        type: "paragraph",
        text: "The hallmarks are acquired by mutations in four broad classes of gene, and the logic of each class is different. Learn the logic and the examples follow.",
      },
      {
        type: "table",
        headers: ["Class", "Mutation logic", "Representative genes", "Associated tumours"],
        rows: [
          ["Oncogenes", "Gain of function: one mutated allele is enough, and the mutation activates the protein", "KRAS, MYC, HER2, BRAF, TERT", "Pancreatic and colorectal carcinoma (KRAS), breast carcinoma (HER2), Burkitt lymphoma (MYC)"],
          ["Tumour suppressors", "Loss of function: both alleles must be hit, because the normal gene product restrains growth", "TP53, RB, APC, BRCA1, BRCA2", "Li-Fraumeni and most cancers (TP53), retinoblastoma (RB), familial adenomatous polyposis (APC), breast and ovarian carcinoma (BRCA1/2)"],
          ["DNA repair genes", "Loss of function: errors in replication accumulate, so mutation rate rises (a mutator phenotype)", "BRCA1/2, mismatch repair genes (MLH1, MSH2), XP protein genes", "Hereditary breast and ovarian cancer, Lynch syndrome, xeroderma pigmentosum"],
          ["Apoptosis regulators", "Balance between the pro- and anti-apoptotic members is shifted", "BCL2 (anti-apoptotic, amplified in follicular lymphoma), TP53 (pro-apoptotic)", "Follicular lymphoma, many carcinomas"],
        ],
      },
      {
        type: "paragraph",
        text: "This explains why cancer is clonal and why cancer increases with age: each division carries a chance of mutation, and mutations accumulate in the descendants that carry them. It also explains inheritance: inheriting one defective tumour suppressor allele means only a single somatic event in the other allele is needed in any cell — so hereditary cancers appear earlier, and in more than one site, than their sporadic counterparts.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Most cancers are not inherited. Monogenic inherited cancer syndromes account for a small minority; the common cancers are the result of somatic mutations accumulated over decades, modulated by environment. Familial clustering of common cancers, like breast and colorectal, is a mix of shared environment, low-penetrance variants and the rare strong syndromes.",
      },

      { type: "heading", level: 2, text: "Worked example: the Vogelstein sequence" },
      {
        type: "paragraph",
        text: "The colorectal cancer sequence is the textbook model of multistep carcinogenesis, because it shows that each step is a loss of a specific control rather than a single leap to malignancy. It begins in a normal mucosa, and it progresses through a morphologically visible sequence of increasingly abnormal epithelium.",
      },
      {
        type: "table",
        headers: ["Stage", "Morphology", "Genetic event"],
        rows: [
          ["1", "Normal mucosa", "None"],
          ["2", "Hyperplastic epithelium", "Loss of APC (the gatekeeper of the Wnt pathway)"],
          ["3", "Early adenoma", "KRAS activation (gain of function of a growth signalling gene)"],
          ["4", "Intermediate adenoma", "Loss of 18q (the DCC region, a tumour suppressor)"],
          ["5", "Late adenoma", "Loss of TP53 (the guardian of the genome)"],
          ["6", "Invasive carcinoma", "The accumulated hallmarks let it invade and metastasise"],
        ],
      },
      {
        type: "paragraph",
        text: "Read the model as the answer to the question of why cancer takes years. A mutation in a growth suppressor is not enough; a growth-signalling oncogene is not enough; the cell has to lose the machinery of checkpoints and repair before the balance can tip. This is also the biological basis of polyp surveillance in familial adenomatous polyposis: removing the adenomas removes the substrate of the sequence.",
      },

      { type: "heading", level: 2, text: "Invasion and metastasis" },
      {
        type: "paragraph",
        text: "Invasion and metastasis are a sequence, not a property, and each step can fail. The tumour cells lose the adhesion molecules that hold them to their neighbours — classically E-cadherin — and acquire the ability to cross the basement membrane by secreting matrix metalloproteinases that digest the surrounding stroma. They enter lymphatics and blood vessels, survive a circulation that would normally kill them (anchorage-independent survival, evasion of shear forces and of immune cells), arrest in a distant vascular bed, extravasate, and finally grow — in a microenvironment that may or may not support them. The molecular machinery behind this transformation is called epithelial-to-mesenchymal transition, and the cell that executes it gains motility at the cost of its differentiated function.",
      },
      {
        type: "question",
        prompt: "Why are most metastases in the first capillary bed downstream of the tumour — lung for most solid tumours, and liver for gut tumours?",
        answer: "Because the first vascular bed that a shed tumour cell reaches traps it by size: tumour emboli mechanically lodge in the first capillary network they meet, and only there do they extravasate and grow if the soil is right.",
        explanation: "The old 'seed and soil' principle is a real pattern for systemic circulation, but tumours draining directly into the portal venous system reach the liver first, which is why gastrointestinal cancers seed the liver.",
      },

      { type: "heading", level: 2, text: "Tumour heterogeneity" },
      {
        type: "paragraph",
        text: "A tumour is not a uniform population of identical cells. Genomic instability and clonal evolution mean that subclones with different mutations, growth rates, antigen profiles and drug sensitivities coexist within the same mass, and selection under chemotherapy or radiation favours the resistant subclones. This is the molecular explanation of tumour progression (the acquisition of greater malignancy over time), and of the hard problem of drug resistance — a single-agent therapy selecting for a resistant subclone rather than curing the whole. The cancer stem cell hypothesis proposes that only a small subpopulation maintains tumour growth, which is one reason a residual tumour can regrow after an apparently complete microscopic resection.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying an oncogene needs two hits. It needs one — oncogenes act by gain of function, and a single activating mutation in one allele is sufficient. Tumour suppressors need two — the loss is recessive at the level of the gene product.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the Warburg effect is why cancers cannot make ATP. Cancer cells do respire; they simply run glycolysis alongside respiration. It is a metabolic reprogramming, not a respiratory failure, and it is the basis of PET imaging with fluorodeoxyglucose.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying angiogenesis means the tumour simply grows more blood vessels. It means the tumour secretes its own angiogenic factors (VEGF above all) and tilts the balance of the angiogenic regulators, so the vessel supply follows the tumour's own demand rather than the tissue's.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "How is a mutated TP53 different from a mutated KRAS in its contribution to cancer?",
        answer: "KRAS is an oncogene — an activating mutation in one allele turns a growth signal on permanently. TP53 is a tumour suppressor — both alleles must be lost, and the loss removes the checkpoint that would halt division, repair DNA, or trigger apoptosis after damage.",
        explanation: "The logic of gain versus loss determines the inheritance pattern: inherited cancer is usually the dominant inheritance of a defective tumour suppressor allele, because one functional allele still restrains growth, whereas incidentally activated oncogenes are almost always somatic.",
      },
      {
        type: "question",
        prompt: "A patient has a breast cancer that secretes VEGF, which drives its own blood supply. Which hallmark is demonstrated, and what drug targets it?",
        answer: "Angiogenesis — sustained angiogenesis is one of the hallmarks of cancer. The VEGF pathway is targeted by bevacizumab, a monoclonal antibody that blocks VEGF, so the tumour's abnormal vessel supply is deprived.",
        explanation: "The hallmarks map onto modern drug targets: anti-VEGF therapy, anti-HER2 therapy, and checkpoint inhibitors against the immune-evasion hallmark.",
      },
      {
        type: "question",
        prompt: "Why does loss of a DNA repair gene produce many types of tumour over a lifetime, rather than one?",
        answer: "Because the mutator phenotype is not tissue-specific: every dividing cell in the body accumulates replication errors faster, so the probability of hitting the hallmarks somewhere — the breast, ovary, colon — rises in proportion to the number of cells and their divisions.",
        explanation: "Inherited defects in repair (Fanconi anaemia, xeroderma pigmentosum, Lynch syndrome) therefore produce cancers of multiple organ systems, unlike the single-tissue syndromes of a mutation like RET.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which mutation is most likely to require loss of both alleles in the same cell before a tumour develops?",
        options: ["An activating KRAS mutation", "An increased HER2 gene copy number", "A loss of the RB tumour suppressor gene", "A TERT promoter reactivation"],
        correctIndex: 2,
        explanation: "Tumour suppressor genes lose function recessively — two hits are required, as in the sporadic retinoblastoma case of two somatic hits, versus the hereditary case of one inherited and one somatic. KRAS, HER2 and TERT act by gain of function, where one altered allele suffices.",
      },
      {
        type: "mcq",
        stem: "Which hallmark explains how cancer cells obtain ATP despite hypoxia in the tumour mass?",
        options: [
          "Replicative immortality", "Reprogramming of energy metabolism (the Warburg effect)", "Genome instability", "Immunoevasion",
        ],
        correctIndex: 1,
        explanation: "The Warburg effect describes aerobic glycolysis that runs alongside respiration, producing ATP with less oxygen uptake so the tumour cell survives in an acidic, hypoxic mass — the reason PET imaging uses labelled glucose uptake as a signal of tumour tissue.",
      },
      {
        type: "mcq",
        stem: "Which pairing between the hallmark and its representative molecular mechanism is correct?",
        options: [
          "Resisting apoptosis — loss of E-cadherin",
          "Sustained angiogenesis — HER2 amplification",
          "Evading immune destruction — PD-L1 expression by the tumour cells",
          "Genome instability — overexpression of VEGF",
        ],
        correctIndex: 2,
        explanation: "PD-L1 is what stops an anti-tumour T cell, so immune destruction is evaded — it is the target of checkpoint inhibitors. Loss of E-cadherin is invasion, HER2 is proliferative signalling, VEGF is angiogenesis.",
      },
      {
        type: "mcq",
        stem: "Which sequence best describes the progression of colorectal carcinoma according to the Vogelstein model?",
        options: [
          "TP53 loss, then KRAS activation, then APC loss, then metastasis",
          "APC loss, then KRAS activation, then 18q loss, then TP53 loss",
          "KRAS loss, then APC activation, then TP53 loss",
          "BRCA1 loss, then HER2 amplification, then TP53 loss",
        ],
        correctIndex: 1,
        explanation: "The classic sequence begins with APC loss (hyperplastic epithelium), then KRAS activation (early adenoma), then loss of 18q (intermediate), and finally TP53 loss (late adenoma progressing to carcinoma) — each step maps onto a new hallmark.",
      },
      {
        type: "mcq",
        stem: "A chemotherapy regimen selects for a resistant subclone of a tumour. Which property of tumours best explains this?",
        options: [
          "Tumours are monoclonal and chemically stable",
          "Tumours are heterogeneous populations of subclones, and drug selection favours the resistant ones",
          "Chemotherapy enlarges the tumour's blood supply",
          "Tumours suppress immune responses, so resistance is acquired by immune selection",
        ],
        correctIndex: 1,
        explanation: "Genomic instability creates subclones with different mutation profiles; therapy kills the sensitive ones and the resistant subclone expands. This is the basis of resistance to single-agent therapy in a heterogeneous tumour population.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The hallmarks of cancer describe how a cell becomes a tumour: sustained growth signalling, evasion of suppression, escape from apoptosis, immortalisation, angiogenesis, invasion and metastasis, metabolic rewiring, immune evasion, genomic instability and inflammatory hijacking. Under the hallmarks sit the gene families — oncogenes (one activating hit), tumour suppressors (two hits), DNA repair genes and apoptosis regulators. The Vogelstein sequence shows these capabilities accumulating one mutation at a time, and the heterogeneity within any one tumour explains why single-agent therapies fail.",
      },
      {
        type: "paragraph",
        text: "Next: where the mutations come from — chemical, physical and viral carcinogens, the initiator-promoter rules, and the inherited syndromes that predispose.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 12 — Carcinogenesis: mutation & environment (fully authored)
// ---------------------------------------------------------------------------
function lesson12() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: explain multistep carcinogenesis as initiation, promotion and progression; name the main chemical carcinogens with their source and their target tumour; distinguish direct-acting from indirect-acting carcinogens; list the oncogenic viruses and the tumour each causes; describe how radiation causes cancer; and list the principal inherited cancer syndromes and their genes.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 10 and 11. Carcinogenesis is the process by which the gene classes of the previous lesson acquire their mutations — the hallmarks from lesson 11 come to exist because of what happens here.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Carcinogenesis",
        text: "The origin and evolution of a neoplasm by the sequential acquisition of mutations in genes that govern cell growth, survival, differentiation and repair, under the influence of inherited susceptibilities and environmental exposures.",
      },
      {
        type: "paragraph",
        text: "Cancer is a genetic disease of somatic cells. The mutations are acquired during life, they accumulate in a clone, and they are not random in their consequences — each mutation removes a brake or adds an accelerator. The environment supplies most of the mutational pressure, so the geographic epidemiology of cancer is largely a map of exposures: tobacco in the lung, aflatoxin in the liver, sunlight on the skin, hepatitis virus in the liver, schistosoma in the bladder.",
      },

      { type: "heading", level: 2, text: "Initiation, promotion, progression" },
      {
        type: "table",
        headers: ["Phase", "Event", "Reversibility", "Property of the agent"],
        rows: [
          ["Initiation", "A mutation is fixed in the DNA of a cell — not enough for cancer, but enough to confer its permanent potential", "Irreversible at the single-cell level; may never produce a tumour", "Mutagenic; brief exposure is enough"],
          ["Promotion", "The initiated cell divides and its clone expands, under the selective pressure of a stimulus that drives proliferation", "Reversible — withdraw the promoter and the clone regresses", "Usually not mutagenic; needs prolonged exposure"],
          ["Progression", "Subclones accumulate further mutations and the tumour becomes more malignant — invasive, then metastatic", "Irreversible", "Mutagenic, or promoting at a higher level"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The practical message of the initiator-promoter model is that most interventions that reduce cancer risk act by reducing promotion: quitting smoking does not undo a mutation, but it removes the chronic injury and regenerative proliferation that would have expanded the clone of cells already harbouring mutations.",
      },

      { type: "heading", level: 2, text: "Chemical carcinogens" },
      {
        type: "paragraph",
        text: "Most chemical carcinogens are electrophilic — they react with DNA through active metabolites. Direct-acting carcinogens do this in their native form; indirect-acting ones require metabolic activation, typically by the cytochrome P450 system, which is why the liver and the organs it detoxifies are common cancer sites. The pattern of targets is worth memorising because each agent is a one-line cause-of-death entry.",
      },
      {
        type: "table",
        headers: ["Agent", "Source", "Signature tumour"],
        rows: [
          ["Polycyclic aromatic hydrocarbons", "Tobacco smoke, grilled and smoked meat, fossil fuel combustion", "Bronchogenic carcinoma, cancer of the lip and oral cavity"],
          ["Aromatic amines (beta-naphthylamine, benzidine)", "Aniline dye and rubber industry", "Urothelial carcinoma of the bladder"],
          ["Aflatoxin B1", "Aspergillus growing on stored grain and groundnuts", "Hepatocellular carcinoma — a characteristic mutation in codon 249 of TP53"],
          ["Asbestos", "Building, lagging and brake materials", "Malignant mesothelioma, bronchogenic carcinoma, laryngeal carcinoma"],
          ["Arsenic", "Contaminated water, smelting, old pesticides", "Skin, lung and hepatic angiosarcoma and carcinoma"],
          ["Vinyl chloride", "Plastics manufacture", "Angiosarcoma of the liver"],
          ["Benzene", "Petroleum and solvents", "Acute myeloid leukaemia"],
          ["Alkylating drugs", "Cyclophosphamide and other chemotherapy", "Retinoblastoma survivors and others treated with alkylating agents develop AML and myelodysplasia"],
          ["Metals — nickel and chromium", "Smelting and plating", "Lung and sinonasal carcinomas"],
        ],
      },

      { type: "heading", level: 2, text: "Radiation" },
      {
        type: "paragraph",
        text: "Ultraviolet radiation — especially the UVB spectrum — damages keratinocyte DNA by creating pyrimidine dimers, and its pattern tells you the mechanism: sun-exposed skin, the epithelium repair of severe burns (squamous carcinoma in old scars, Marjolin ulcer), and a long latency. DNA repair defects such as xeroderma pigmentosum show the extreme case, where the patient cannot repair the damage. Ionising radiation, by contrast, breaks DNA directly; its carcinogenic dose-response explains the leukaemias and solid tumours among atomic bomb survivors, the thyroid cancers after childhood exposure, the second tumours after radiotherapy, and skin cancers in early radiologists. The latent period after radiation can be decades — radiation protection is a lifetime concern, not an acute one.",
      },

      { type: "heading", level: 2, text: "Oncogenic viruses" },
      {
        type: "table",
        headers: ["Virus", "Mechanism", "Tumour"],
        rows: [
          ["Human papillomavirus types 16 and 18", "E6 protein degrades TP53; E7 inactivates RB", "Cervical carcinoma, anal carcinoma, oropharyngeal squamous carcinoma"],
          ["Hepatitis B and C viruses", "Chronic inflammation and regeneration; HBV integrates into the genome, HCVC acts through repeated injury and cirrhosis", "Hepatocellular carcinoma"],
          ["Epstein-Barr virus", "Immortalises B cells through latent membrane proteins; the tumour emerges where immune control is weak or defective", "Burkitt lymphoma, nasopharyngeal carcinoma, post-transplant lymphoproliferative disease, Hodgkin lymphoma"],
          ["Human herpesvirus 8 (Kaposi sarcoma herpesvirus)", "Latency proteins drive proliferation of the infected endothelial and lymphatic cell", "Kaposi sarcoma, primary effusion lymphoma"],
          ["Human T-cell lymphotropic virus type 1", "The Tax protein drives T-cell proliferation", "Adult T-cell leukaemia/lymphoma"],
          ["Merkel cell polyomavirus", "Integrated into the genome of tumour cells", "Merkel cell carcinoma"],
        ],
      },
      {
        type: "paragraph",
        text: "Helicobacter pylori is worth adding to the list even though it is a bacterium: chronic gastritis with repeated regeneration progresses to gastric intestinal metaplasia and adenocarcinoma, and the organism also drives an MALT lymphoma. Vaccination against HPV, and the eradication of H. pylori in colonised patients, are therefore true cancer prevention — a direct application of this table.",
      },

      { type: "heading", level: 2, text: "Worked example: a smoker's tumours" },
      {
        type: "paragraph",
        text: "A 65-year-old who has smoked 40 cigarettes a day for 50 years now has a mass in the upper lobe of his right lung, a hoarse voice, and one nodule in the liver. The mechanism is a chain: the polycyclic aromatic hydrocarbons and other mutagens in the smoke are activated by the cytochrome P450 system of the bronchial mucosa, and each replication of an initiated bronchial epithelial cell is a chance for a promoter effect from the chronic inflammation. The accumulated hits give the hallmarks from the previous lesson. He also has a raised risk of urothelial carcinoma from the aromatic amines excreted in the urine, of oesophageal carcinoma, of laryngeal carcinoma, and of myocardial infarction (from the non-neoplastic morbidity of smoke) — one exposure, multiple endpoints, because the same DNA-damaging mechanisms act on every epithelium exposed.",
      },

      { type: "heading", level: 2, text: "Inherited susceptibility" },
      {
        type: "table",
        headers: ["Syndrome", "Gene", "What it gives"],
        rows: [
          ["Familial adenomatous polyposis", "APC", "Hundreds to thousands of colonic adenomas and near-certain colorectal carcinoma"],
          ["Retinoblastoma", "RB", "Retinoblastoma and, later, osteosarcoma in survivors"],
          ["Li-Fraumeni syndrome", "TP53", "Breast carcinoma, sarcoma, leukaemia, adrenal cortical carcinoma, brain tumours"],
          ["Hereditary breast and ovarian cancer syndrome", "BRCA1 and BRCA2", "Breast, ovarian, pancreatic and prostate carcinoma"],
          ["Lynch syndrome (HNPCC)", "Mismatch repair genes (MLH1, MSH2, MSH6)", "Colorectal, endometrial, gastric, ovarian carcinomas with microsatellite instability"],
          ["Familial medullary thyroid carcinoma and MEN2", "RET", "Medullary thyroid carcinoma and phaeochromocytoma"],
          ["Neurofibromatosis types 1 and 2", "NF1 and NF2", "Neurofibromas and malignant peripheral nerve sheath tumours, acoustic neuromas, meningiomas"],
        ],
      },
      {
        type: "paragraph",
        text: "Two features run across the list: the cancers appear decades earlier than their sporadic equivalents, and they tend to be multiple or bilateral, because every cell of the patient already carries the first hit. That is why a family history of early breast and ovarian cancer, or of colorectal and endometrial carcinoma, triggers genetic counselling and surveillance — the genes from the last two lessons are not abstractions, they are the reason a patient's mother's cancer changes how she is screened.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying asbestos exposure always gives a short latency. The latency of mesothelioma is 30-40 years, so the disease presents in an elderly patient decades after the exposure ended — which is why the occupational history goes back decades, not weeks.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying all cervical cancers are caused by HPV. HPV 16 and 18 cause a large majority, but not all — a small proportion of cervical carcinomas are unrelated, and vaccination does not remove every case. Saying aflatoxin, not HBV, is the cause of hepatocellular carcinoma worldwide: chronic hepatitis B carriage is the leading global risk factor; aflatoxin adds to it.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the initiator-promoter model is a pathology of viral carcinogenesis only. It is the general logic of solid tumour carcinogenesis, and it explains the reversibility of promotion — which is why smoking cessation reduces cancer risk even after decades.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Which phase of carcinogenesis can be reversed, and why does this make prevention possible?",
        answer: "Promotion is reversible because the clone of initiated cells depends on a continuing proliferative stimulus. Remove the promoter — stop smoking, eradicate H. pylori, control inflammation — and the expanded clone may regress or at least stop growing, so the tumour never arises.",
        explanation: "Initiation is a fixed mutation at the single-cell level, but a cancer requires promotion; intervention is always aimed at promotion, and this is the basis of secondary prevention after an exposure.",
      },
      {
        type: "question",
        prompt: "Why do the aromatic amines of the dye industry cause bladder cancer rather than lung cancer?",
        answer: "Because aromatic amines are absorbed and excreted in the urine, so the urothelium that lines the bladder is exposed to the activated metabolites concentrated in the urine; the lung is not the site of contact for this exposure route.",
        explanation: "Carcinogenesis requires a site of exposure — the same chemical has different target organs through absorption and excretion, which is why the occupational and exposure history is part of every cancer diagnosis.",
      },
      {
        type: "question",
        prompt: "A 3-year-old has bilateral retinoblastoma. Why is the retinoblastoma tumour bilateral, and why is her risk of a second tumour higher than a sporadic case?",
        answer: "Because she inherited one mutated RB allele in every cell of her body, so one somatic second hit in one retinal cell is enough; the same inherited first hit also raises the risk of osteosarcoma and other second tumours after radiation.",
        explanation: "Heredity supplies the first hit — a sporadic retinoblastoma requires two somatic hits and is therefore rare and unilateral, whereas the inherited pattern shows autosomal dominant transmission, earlier onset and bilateral tumours.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A dyestuff worker exposed to aromatic amines for 20 years develops haematuria and a bladder mass. What is the mechanism of chemical carcinogenesis here?",
        options: [
          "Direct alkylation without metabolic activation",
          "The aromatic amines are metabolically activated in the liver and excreted in the urine, where they react with DNA in the urothelium",
          "A direct viral effect on the urothelial cells",
          "An irritant effect that is purely non-genotoxic",
        ],
        correctIndex: 1,
        explanation: "Aromatic amines are indirect-acting carcinogens activated by the hepatic cytochrome system and concentrated in the urine, where they cause mutagenic adducts in bladder epithelium, typically with a long latency of two decades.",
      },
      {
        type: "mcq",
        stem: "Which virus–tumour pairing is correct?",
        options: [
          "HTLV-1 — Burkitt lymphoma",
          "HPV 16 and 18 — hepatocellular carcinoma",
          "Hepatitis B virus — hepatocellular carcinoma",
          "EBV — adult T-cell leukaemia",
        ],
        correctIndex: 2,
        explanation: "Hepatitis B is a cause of hepatocellular carcinoma through a combination of chronic necroinflammation and genomic integration. HTLV-1 causes adult T-cell leukaemia; HPV 16/18 causes cervical and oropharyngeal carcinoma; EBV causes Burkitt lymphoma.",
      },
      {
        type: "mcq",
        stem: "A farmer has stored grain contaminated with a fungus that produces aflatoxin B1. Which tumour is most associated, and through which gene?",
        options: [
          "Urothelial carcinoma — RB mutation",
          "Hepatocellular carcinoma — a characteristic TP53 codon 249 mutation",
          "Mesothelioma — BAP1 mutation",
          "Bronchogenic carcinoma — KRAS mutation",
        ],
        correctIndex: 1,
        explanation: "Aflatoxin B1 is metabolically activated in the liver and produces a signature mutation at codon 249 of TP53, which drives hepatocellular carcinoma — an exposure that acts in synergy with chronic hepatitis B.",
      },
      {
        type: "mcq",
        stem: "Which feature of solid-tumour carcinogenesis explains the typical decades-long latency between an exposure and the appearance of a classic cancer?",
        options: [
          "That the initiator mutation is one of a sequence of required steps, and each step is rare — years to decades are needed for promotion and progression of the clone",
          "That radiation causes tumours only when the patient is elderly",
          "That radiation damage to DNA heals immediately after the exposure ends",
          "That most exposed persons have inherited the causative mutations",
        ],
        correctIndex: 0,
        explanation: "Initiation is a single mutation and promotion takes years of clonal expansion, and progression requires further mutation; each step is a low-probability event and their series in time is the latency — the same is true of solid tumours after chemical and viral exposures.",
      },
      {
        type: "mcq",
        stem: "Which of the following patients best illustrates a promoter effect acting on an initiated cell population?",
        options: [
          "A patient with an inherited RB mutation who receives radiotherapy for the original tumour and later develops a radiation-induced sarcoma",
          "A patient who receives a single mutagenic dose of an alkylating agent and, years later, develops a colorectal carcinoma with a KRAS mutation",
          "A patient whose chronic H. pylori gastritis drives intestinal metaplasia and adenocarcinoma in a mucosa that has acquired mutations",
          "A patient with xeroderma pigmentosum who develops basal cell carcinoma after sun exposure",
        ],
        correctIndex: 2,
        explanation: "Chronic inflammation is the classic promoter: it expands the initiated population by providing a proliferative stimulus, and removing it (eradicating the organism) reduces the cancer risk. The others illustrate inherited susceptibility, direct initiation and repair failure respectively.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Carcinogenesis is a multistep process: irreversible initiation (a fixed mutation), the reversible promotion of a clone of initiated cells, and the progression of that clone into an invasive and eventually metastasising tumour. The mutagenic pressure comes from chemicals (tobacco, aromatic amines, aflatoxin, asbestos, aromatic hydrocarbons), radiation (ultraviolet and ionising), oncogenic viruses (HPV, HBV, HCV, EBV, HHV-8, HTLV-1) and chronic infection and inflammation; the inherited cancer syndromes contribute the first hit. The environment therefore changes the probability, and the mutations in the genes from the previous lesson supply the mechanisms.",
      },
      {
        type: "paragraph",
        text: "Next: how cancers are measured, so that a treatment plan can be made and an outcome predicted — grading, staging, biopsy diagnosis and the honest limits of tumour markers.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 13 — Grading, staging & tumour markers (fully authored)
// ---------------------------------------------------------------------------
function lesson13() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: distinguish grading from staging and state what each predicts; interpret a TNM classification and derive a stage group; describe the major biopsy and cytology techniques with the questions each answers; name the common tumour markers, the tumours they follow, and their limitations; and explain how immunohistochemistry confirms a diagnosis and selects a therapy.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 10-12. Grading and staging describe how far a neoplasm's biology has gone, so the benign/malignant classification and the hallmarks of the previous lessons underpin it. Histological interpretation is applied lesson 1's cell-injury morphology.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Grade versus stage",
        text: "Grading is the assessment of how closely a tumour resembles the tissue it arises from, and stage is the assessment of how far it has anatomically spread. The grade tells you how fast it is likely to behave; the stage tells you how far it has actually got.",
      },
      {
        type: "paragraph",
        text: "The two axes are independent and both matter. A well-differentiated follicular thyroid carcinoma is a low-grade cancer that nevertheless metastasises and is a stage IV disease at diagnosis; a poorly differentiated carcinoma may still be stage I if caught early. The stage, not the grade, decides how far surgery should reach; the grade, not the stage, predicts the aggressiveness that determines the strength of adjuvant treatment. Above all, a grade or stage is only meaningful attached to the tumour's site — a T2 bladder tumour and a T2 lung tumour are different worlds.",
      },

      { type: "heading", level: 2, text: "Grading" },
      {
        type: "table",
        headers: ["Axis", "What is used"],
        rows: [
          ["Differentiation", "How closely the tumour cells and architecture resemble the parent tissue — graded well (G1), moderate (G2), poor (G3) and undifferentiated (G4)"],
          ["Mitotic rate", "Counted mitoses per high-power field; a faster rate is worse"],
          ["Nuclear pleomorphism", "Variation in nuclear size, shape and chromatin"],
          ["Organ-specific scores", "Gleason grade (prostate architecture: patterns 1-5 summed to a score); Nottingham grade (tubule formation + nuclear pleomorphism + mitoses for breast); FIGO grading for some gynaecological tumours"],
        ],
      },
      {
        type: "paragraph",
        text: "Three practical caveats belong here. Grade is sampled from a representative area, because a tumour is heterogeneous — its highest grade may lie in a region the needle missed, or in the deepest part of the mass, so a biopsy grade is often a floor and undergrades more often than it overgrades. Grade is a pathology report, not a blood test, and it is sometimes not assessable after preoperative treatment. And uniformity may be misleading: neuroendocrine tumours look uniform under the microscope but behave aggressively, so architecture is not the whole truth.",
      },

      { type: "heading", level: 2, text: "The TNM staging system" },
      {
        type: "table",
        headers: ["Component", "Classification", "Meaning"],
        rows: [
          ["T — the primary tumour", "T0 to T4 (sometimes Tis for carcinoma in situ)", "Size and/or depth of local invasion, defined per organ"],
          ["N — the regional lymph nodes", "N0 to N3", "Number and site of involved nodes (often the strongest single prognostic factor)"],
          ["M — distant metastasis", "M0 or M1", "Distant metastasis present or absent; M1 is almost always incurable"],
        ],
      },
      {
        type: "paragraph",
        text: "The TNM letters are then combined into stage groups I to IV, which is the shorthand you will see in tumour registries and trials: roughly, stage I is a localised small tumour, stage II a larger local tumour without nodes, stage III node-positive disease, and stage IV metastatic disease. The system is maintained by the AJCC/UICC and updated by organ; the prefix c is added for clinical staging (before resection) and p for pathologists' staging after resection. Pathological stage is more accurate than clinical because it counts actual nodes and the true depth.",
      },
      {
        type: "example",
        text: "A colonoscopy shows a 3 cm tumour in the sigmoid colon. Histology and a CT show it invading the muscularis propria, two of twelve nodes are positive, and CT shows no liver metastases. The classification is T2 N1 M0 — a node-positive disease, stage III. It changes the plan from endoscopic follow-up alone to colectomy with node clearance and consideration of adjuvant chemotherapy; the presence of stage III disease is the reason adjuvant chemotherapy is even discussed.",
      },
      {
        type: "table",
        headers: ["Stage group", "TNM pattern", "General meaning", "Typical treatment implication"],
        rows: [
          ["Stage I", "T1-2 N0 M0, no high-risk features", "Local tumour, no nodes", "Local therapy (surgery alone) is often sufficient"],
          ["Stage II", "Larger local tumour, still N0 M0", "Local disease, higher recurrence risk", "Local therapy plus consideration of adjuvant therapy for high-risk features"],
          ["Stage III", "Any T, N1-3 M0", "Node involvement", "Combination of surgery with node clearance and adjuvant systemic therapy"],
          ["Stage IV", "Any T, any N, M1", "Metastatic disease", "Systemic therapy; local treatment only for symptoms or for control"],
        ],
      },

      { type: "heading", level: 2, text: "Diagnosis: biopsy, cytology, molecular" },
      {
        type: "table",
        headers: ["Method", "What is taken", "What it is used for"],
        rows: [
          ["Fine-needle aspiration", "Cells only, no tissue architecture", "Rapid triage — distinguishing a cyst from a solid lesion; convenient for node, thyroid and breast"],
          ["Core needle biopsy", "A small cylinder preserving architecture", "The technique of choice for breast and prostate diagnosis, and for grading"],
          ["Incisional biopsy", "A piece of a larger tumour", "Diagnosis when the diagnosis requires architecture but complete excision would be disfiguring"],
          ["Excisional biopsy", "The whole lesion", "Melanoma and most small lesions — both diagnosis and treatment"],
          ["Frozen section", "A frozen slice inside theatre", "Decides during surgery whether a margin is clear or a sentinel node is positive"],
          ["Cytology", "Shed or scraped cells", "Cervical screening (Pap smear), urine, effusions"],
          ["Immunohistochemistry", "Stains applied to the histology slide", "Cell of origin, grade markers, and therapeutic targets — ER, PR and HER2 in breast carcinoma; CK and CD45; TTF-1 for lung"],
          ["Molecular testing", "DNA or RNA extracted from the tumour", "Driver mutations that determine targeted therapy — EGFR and ALK in lung adenocarcinoma, BRAF in melanoma, KRAS in colorectal, HER2 in gastric"],
        ],
      },

      { type: "heading", level: 2, text: "Tumour markers" },
      {
        type: "table",
        headers: ["Marker", "Main association", "Real clinical use"],
        rows: [
          ["PSA (prostate-specific antigen)", "Prostate epithelium", "Early detection and follow-up at best; elevated in benign hyperplasia, prostatitis and after instrumentation, so a positive biopsy, not the level, makes the diagnosis"],
          ["CA-125", "Ovarian carcinoma", "Follow-up of a treated ovarian carcinoma; not adequate for population screening"],
          ["Carcinoembryonic antigen (CEA)", "Colorectal carcinoma (and smoking)", "Follow-up after resection of colorectal carcinoma; not for diagnosis"],
          ["Alpha-fetoprotein", "Hepatocellular carcinoma, germ cell tumours", "A level of 500 ng/ml or more with a liver nodule is near-diagnostic of HCC; also used for germ cell follow-up"],
          ["Beta-hCG", "Trophoblastic tumours, germ cell tumours", "Diagnosis and follow-up of hydatidiform mole and choriocarcinoma; elevated AFP in germ cell tumours indicates yolk sac"],
          ["CA 19-9", "Pancreatic adenocarcinoma", "Follow-up; not specific enough for screening and not always elevated in advanced disease"],
          ["Calcitonin", "Medullary thyroid carcinoma", "Baseline measurement and family screening in MEN2, where it is a true genetic screening test"],
          ["HER2", "Breast carcinoma", "Not a blood marker: detected on the tumour; it is essential for prescribing trastuzumab"],
          ["Lactate dehydrogenase", "Lymphoma, germ cell tumours", "Bulk of disease and a prognostic variable in treatment protocols"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The correct use of tumour markers is almost always monitoring a known tumour — after treatment and then for relapse — not detecting a cancer that has not been found. Using CA-125 or PSA to screen an asymptomatic population causes overdiagnosis, false positives and harm, which is why screening protocols use the marker in combination with imaging or not at all.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying grade and stage mean the same thing. Grade = microscopic differentiation; stage = anatomic spread. A low-grade advanced tumour kills; a high-grade early tumour is cured.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating a raised CEA or CA-125 as proof of advanced cancer. Both rise in benign disease, both can be normal in cancer, and neither replaces a scan or a biopsy. The correct statement is that a rising marker after a completed treatment is more informative than a single elevated one.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying immunohistochemistry is a blood test. It is a stain applied to the tissue, and its real power is cell-of-origin classification and the detection of therapeutic targets — HER2, hormone receptors, mismatch repair status — not simply identifying the tumour's name.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A 2 cm breast carcinoma is found in one of three axillary nodes; there are no liver metastases. What is the TNM, and why does it matter surgically?",
        answer: "T2 (a 2-5 cm mass), N1 (one of three nodes involved) and M0 — stage IIB. The node positivity is the decisive point: it converts the plan from breast surgery alone to surgery with axillary clearance and adjuvant systemic therapy, because nodal disease carries a materially worse prognosis.",
        explanation: "Stage answers two things for a surgeon: how far to remove (nodes) and what to plan after (adjuvant). Both are driven by the anatomic spread, not the grade.",
      },
      {
        type: "question",
        prompt: "Why does the biopsy see a more moderate grade of the tumour than the resection specimen in some patients?",
        answer: "Because a tumour is heterogeneous — its highest grade may be in the region the needle missed, or in the deepest part of the mass; the needle grades a sample, the resection grades the worst part.",
        explanation: "Sampling error is the reason a biopsy grade is often a floor, not an exact number; it undergrades more often than it overgrades.",
      },
      {
        type: "question",
        prompt: "Why is a rising AFP a much more useful test than a raised one?",
        answer: "A single raised AFP also occurs in hepatitis, cirrhosis and pregnancy; but after a treated hepatocellular carcinoma the trend is informative, because an increasing concentration means residual or recurrent tumour and a fall after therapy means response.",
        explanation: "Tumour markers are kinetic tests: direction and slope, not an absolute threshold, carries the diagnostic content in follow-up.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which best describes the relationship between grading and staging?",
        options: [
          "They are two names for the same assessment",
          "Grade measures differentiation microscopically; stage measures anatomic spread",
          "Grade is only used for haematological tumours",
          "Stage is decided by the number of mitoses on the biopsy",
        ],
        correctIndex: 1,
        explanation: "Grade and stage are independent axes: the first is histologic differentiation, the second is anatomic extent. Both are needed — grade predicts behaviour, stage decides the treatment.",
      },
      {
        type: "mcq",
        stem: "A patient's colon cancer is 4 cm, invades the pericolic fat, has one node involved, and CT shows a single 1 cm liver metastasis. What is the stage?",
        options: ["Stage I", "Stage II", "Stage III", "Stage IV"],
        correctIndex: 3,
        explanation: "Any metastasis (M1) is stage IV, whatever the T and N — the single metastatic deposit defines the stage, and the presence of stage IV disease moves the plan from curative to palliative, with systemic therapy at its centre.",
      },
      {
        type: "mcq",
        stem: "Which technique would a surgeon most appropriately use to decide the width of breast excision in theatre?",
        options: ["Fine-needle aspiration cytology", "Frozen section of the re-excision margin", "A serum CA-125", "A CT of the chest"],
        correctIndex: 1,
        explanation: "Frozen section gives a same-day microscopic answer on a margin while the patient is still open, enabling immediate wider excision; cytology is too coarse, a serum marker is not useful for margin status, and a CT cannot assess a margin microscopically.",
      },
      {
        type: "mcq",
        stem: "Which tumour marker is best used as a true screening test, because of its mode of inheritance?",
        options: ["PSA for prostate cancer in a 60-year-old man", "Calcitonin for MEN2 carriers who carry a RET mutation", "CEA for colorectal carcinoma screening", "CA-125 for ovarian carcinoma screening"],
        correctIndex: 1,
        explanation: "A raised calcitonin is a specific marker for medullary thyroid carcinoma, and screening MEN2 carriers is driven by the genotype, so an elevated calcitonin in a RET mutation carrier is a direct prompt for prophylactic thyroidectomy. PSA, CEA and CA-125 have false-positive problems that disqualify them as population screens.",
      },
      {
        type: "mcq",
        stem: "Which statement about the interpretation of a raised CA-125 is correct?",
        options: [
          "It confirms ovarian carcinoma and requires no further test",
          "It may be elevated in benign conditions and in other malignancies, so it is most useful as a follow-up in a patient after a known ovarian carcinoma",
          "It is only elevated in men with ovarian cancer",
          "It measures response to treatment but never falls after treatment",
        ],
        correctIndex: 1,
        explanation: "CA-125 is raised in menstruation, pregnancy, cirrhosis, peritonitis and other malignancies, so it lacks diagnostic specificity; its real use is monitoring treatment response and recurrence in an already diagnosed cancer.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Grade and stage answer different questions: grade measures how closely the tumour resembles its tissue of origin, via differentiation, mitoses and organ-specific scores, and predicts behaviour; stage measures anatomical spread, via TNM and the stage groups, and decides the treatment. Biopsy and cytology give the tissue; immunohistochemistry and molecular testing give the cell of origin and the target; and tumour markers are most honest when they are used to monitor treatment and detect recurrence, not to diagnose cancer. A rising marker after therapy is a question asked of the tumour, not a verdict delivered by a number.",
      },
      {
        type: "paragraph",
        text: "Next: the endocrine and haematological aspects are left to the systemic lessons; this module ends with the paraneoplastic syndromes and tumour immunology that connect the neoplasm to the rest of the body.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 14 — Amyloidosis (fully authored)
// ---------------------------------------------------------------------------
function lesson14() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define amyloid and state its universal physical property; link the chemical classification of amyloid to the clinical syndromes; predict the organ consequences of systemic deposition from the physics of a stiff protein gel; list the sites used for diagnosis and explain the role of tissue biopsy with Congo red staining; and outline the treatment targets for the major systemic forms.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-13 of this course, especially lesson 4 (chronic inflammation, because reactive amyloidosis follows chronic inflammatory disease) and lesson 10 (the plasma cell dyscrasias that produce the light-chain form). The chemistry of protein misfolding in BCHM 101 underpins the definition.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Amyloidosis",
        text: "A group of deposition diseases in which abnormally folded proteins form insoluble extracellular fibrils that impair tissue function, with a characteristic cross-beta quaternary structure that binds Congo red and splits polarised light into apple-green birefringence.",
      },
      {
        type: "paragraph",
        text: "Every amyloid deposit is made of three components: the main fibril protein, a serum amyloid P component, and glycosaminoglycans. The pool of fibril protein differs by cause, but the shared beta-pleated structure is what makes all amyloid behave alike — this is why amyloid in heart, kidney or tongue looks identical under the microscope and stains Congo red in the same way, whatever protein went into it. Fifteen or so fibril proteins are recognised, and the clinical course is decided by which one it is, not merely by where it is deposited. The tissue never dies of the deposit mechanically; it dies of the space the deposit takes up and the function it displaces.",
      },

      { type: "heading", level: 2, text: "The chemical classification" },
      {
        type: "table",
        headers: ["Type", "Fibril protein", "Source and setting"],
        rows: [
          ["AL (primary systemic)", "Immunoglobulin light chains", "Plasma cell dyscrasia — multiple myeloma and the light-chain–secreting lymphomas; the commonest form in clinical practice"],
          ["AA (secondary/reactive)", "Serum amyloid A", "Chronic inflammatory disease — tuberculosis, bronchiectasis, rheumatoid arthritis, inflammatory bowel disease, chronic osteomyelitis, familial Mediterranean fever"],
          ["Hereditary ATTR (familial amyloid neuropathy)", "Mutant transthyretin", "Inherited mutations of transthyretin (the transport protein for thyroxine and retinol) producing mixed neuropathy and cardiomyopathy"],
          ["Wild-type ATTR (senile systemic)", "Normal transthyretin", "The elderly patient with restrictive cardiomyopathy — increasingly diagnosed in heart failure with preserved ejection fraction"],
          ["Abeta2M (dialysis-associated)", "Beta-2 microglobulin", "Long-term haemodialysis, the patient on dialysis for a decade or more"],
          ["Localised endocrine", "Calcitonin, islet amyloid polypeptide", "Medullary thyroid carcinoma (calcitonin); type 2 diabetes (islet amyloid polypeptide in the beta cells)"],
          ["Localised neurological", "Beta amyloid", "Alzheimer disease — cortical plaques; the cerebral amyloid angiopathy of the elderly bleed"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "AL is not an old person's disease. It is a neoplasm-related plasma cell dyscrasia, and the cardiac form is the most lethal of all. ATTR in an elderly patient with an infiltrating history of peripheral neuropathy and cardiomyopathy is a different disease needing a different drug (tafamidis), and mistaking it for AL — with its own chemotherapy — does direct harm.",
      },

      { type: "heading", level: 2, text: "Distribution and organ consequences" },
      {
        type: "paragraph",
        text: "The heart failure, nephrotic syndrome, macroglossia and the purpura around the eyes are the clinical patterns, and all four are explained by the same physics: the stiff beta-sheeted fibril occupies tissue space, replaces functional cells, thickens and immobilises basement membranes, and makes the capillary walls brittle so they bleed at minor trauma.",
      },
      {
        type: "table",
        headers: ["Organ", "Consequence", "Mechanism"],
        rows: [
          ["Kidney", "Nephrotic syndrome — proteinuria, hypoalbuminaemia, oedema (the commonest systemic presentation)", "Deposition in the glomerular mesangium and capillary walls"],
          ["Heart", "Restrictive cardiomyopathy with diastolic dysfunction; conduction block; the presentation of heart failure with preserved ejection fraction", "Amyloid infiltrates the myocardium and stiffens the walls without dilatation"],
          ["Liver and spleen", "Hepatomegaly; a hard splenomegaly, sometimes with a 'sago' appearance", "Deposition in the sinusoidal and sinusoidal-lining spaces"],
          ["Gut and tongue", "Macroglossia, dysphagia, malabsorption and weight loss", "Deposition in mucosa, muscularis and tongue"],
          ["Peripheral nerves", "Carpal tunnel, a painful sensory neuropathy, autonomic failure (postural hypotension, impotence, bowel dysmotility)", "Deposition compresses the nerve trunks (carpal tunnel) or destroys the endoneurium"],
          ["Skin", "The pinch purpura of the eyelids, papules, plaques and bullae", "Amyloid in the dermal vessel walls causes fragility"],
          ["Blood", "A bleeding tendency in AL disease", "Amyloid fibrils adsorb clotting factor X and impair platelet function"],
        ],
      },

      { type: "heading", level: 2, text: "Diagnosis" },
      {
        type: "paragraph",
        text: "The diagnosis follows a rule: biopsy a tissue and stain it, then type the fibril by identifying its precursor protein. Lesions are best biopsied where they are easiest to reach: a rectal biopsy or an aspiration of abdominal fat gives an adequate sample in most systemic amyloidosis, and the histology is confirmed by Congo red with apple-green birefringence under polarised light. Once amyloid is found, the type is narrowed by serum and urine protein electrophoresis with immunofixation and free light chain assay (which identifies AL), echocardiography with strain imaging and a technetium pyrophosphate scan (which identifies ATTR without a biopsy), and sometimes laser microdissection with mass spectrometry of the deposited fibril in formalin-fixed tissue.",
      },
      {
        type: "example",
        text: "A 70-year-old with a raised NT-proBNP has a stiff heart on echocardiography, plus a numb and painful foot, carpal tunnel, easy bruising and a large tongue. His free light chains are normal. A technetium pyrophosphate scan shows avid myocardial uptake, and fat-pad biopsy stains negative for light chains. The diagnosis is wild-type transthyretin cardiac amyloidosis — the normal transthyretin protein slowly misfolds and deposits, and the normal free light chains steer the diagnosis away from AL.",
      },

      { type: "heading", level: 2, text: "Treatment" },
      {
        type: "paragraph",
        text: "Therapy is aimed at the fibril precursor rather than at the deposit. In AA amyloidosis, control of the chronic inflammatory disease removes the stimulus — colchicine in familial Mediterranean fever is so effective at prevention that it is a lifelong prescription for affected patients. In AL, the treatment is directed at the plasma cell clone with chemotherapy approaches that include high-dose melphalan and autologous stem cell transplantation, and bortezomib-based regimens; support of the transplanted heart or kidney may follow. In ATTR, tafamidis stabilises the transthyretin tetramer and slows the decline in the cardiac form, and gene-silencing approaches reduce the production of the mutant protein.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying amyloidosis is a single disease. It is a family of deposition diseases unified only by a microscopic appearance, and the treatment of each is different — suppress inflammation, suppress the clone, or stabilise the transthyretin.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying amyloid only deposits in the kidney. The heart is the most lethal target (and a heart that cannot relax can be as fatal as one that cannot pump), and localised deposits need no systemic disease — Alzheimer plaques and medullary thyroid carcinoma deposits are local.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying an elderly stiff heart is 'just hypertensive'. In the elderly patient with heart failure with preserved ejection fraction, wild-type ATTR is an important diagnosis to consider, and the Congo red or the technetium scan, not an assumption, settles it.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What do all amyloid fibrils have in common, whatever protein they are made of, and how is this detected?",
        answer: "A cross-beta pleated sheet structure, seen by electron microscopy as straight non-branching 10-nanometre fibrils, and detected histologically by Congo red staining with apple-green birefringence under polarised light.",
        explanation: "The shared quaternary structure is why all amyloids look and stain alike; the primary structure of the fibril protein is what is typed to determine the treatment.",
      },
      {
        type: "question",
        prompt: "Why does cardiac amyloidosis cause heart failure with a heart of normal size and preserved ejection fraction?",
        answer: "Because the amyloid infiltrates the stiff ventricular wall so that poor diastole — impaired filling during relaxation — dominates, while contraction is preserved; the ventricle is not dilated and its ejection fraction appears normal.",
        explanation: "Restrictive physiology is a filling problem, not a pumping problem — hence the raised filling pressures, the raised NT-proBNP and the normal chamber size in contrast to a dilated cardiomyopathy.",
      },
      {
        type: "question",
        prompt: "Which chronic inflammatory disease is most classically associated with AA amyloidosis, and how is the amyloid prevented?",
        answer: "Familial Mediterranean fever is the cleanest modern association: recurrent bouts of inflammation with a persistently high serum amyloid A precursor lead to renal deposition, and colchicine, which prevents the attacks, prevents the amyloid as well.",
        explanation: "Treating the inflammation removes the supply of the precursor, and treatment must be prophylactic — the AA form is the easiest of the amyloids to prevent and the easiest to be missed.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A 70-year-old presents with a nephrotic syndrome, macroglossia and periorbital purpura. What is the most likely amyloid type?",
        options: ["AA (secondary)", "AL (a light-chain dyscrasia)", "Abeta2M (dialysis-associated)", "ATTR (wild-type transthyretin)"],
        correctIndex: 1,
        explanation: "The triad of nephrotic syndrome, macroglossia and purpura is the classic systemic AL — light-chain–driven deposition from a plasma cell dyscrasia. ATTR gives neuropathy and cardiomyopathy, and dialysis amyloid gives joint and carpal tunnel disease.",
      },
      {
        type: "mcq",
        stem: "Which finding on tissue examination confirms amyloid?",
        options: [
          "Granular immunoglobulin on immunofluorescence",
          "Congo red binding with apple-green birefringence under polarised light",
          "Birefringent urate crystals",
          "Cholesterol clefts in a granuloma",
        ],
        correctIndex: 1,
        explanation: "Congo red binding and the apple-green birefringence is the diagnostic physical property of amyloid fibrils. Immunofluorescence 'granular immunoglobulin' is immune complex disease, needle-shaped crystals are gout, cholesterol clefts suggest a cholesterol granuloma.",
      },
      {
        type: "mcq",
        stem: "Which patient most likely has wild-type transthyretin amyloidosis?",
        options: [
          "A 30-year-old with tuberculosis and a nephrotic syndrome",
          "An 80-year-old man with new carpal tunnel, a peripheral neuropathy, and heart failure with preserved ejection fraction",
          "A 50-year-old on haemodialysis for 12 years with wrist pain",
          "A 70-year-old with multiple myeloma and liver failure",
        ],
        correctIndex: 1,
        explanation: "Wild-type ATTR is a disease of the very elderly, presenting with the carpal tunnel, neuropathy and a restrictive/stiff cardiac picture; it is diagnosed by technetium pyrophosphate scanning and its own drug. The tuberculosis case is AA; dialysis is beta-2 microglobulin; myeloma is AL.",
      },
      {
        type: "mcq",
        stem: "Which treatment mechanism most directly reduces the supply of the fibril protein in AA amyloidosis?",
        options: [
          "High-dose melphalan and autologous stem cell transplantation",
          "Controlling chronic inflammation — colchicine for familial Mediterranean fever",
          "Tafamidis stabilising the transthyretin tetramer",
          "Intravenous heparin",
        ],
        correctIndex: 1,
        explanation: "The fibril protein in AA is serum amyloid A, synthesised as part of the acute phase of inflammation; interrupting the inflammation removes the precursor. Tafamidis works for ATTR, and autologous transplantation for the AL clone.",
      },
      {
        type: "mcq",
        stem: "Which organ manifestation makes amyloidosis fatal fastest in AL disease?",
        options: [
          "Macroglossia",
          "Cardiac deposition causing restrictive cardiomyopathy",
          "Carpal tunnel syndrome",
          "Periorbital purpura",
        ],
        correctIndex: 1,
        explanation: "In AL the cardiac involvement is the main determinant of a poor outcome — stiff diastolic failure — while the macroglossia and purpura are markers of diagnosis, and carpal tunnel is inconvenient rather than lethal.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Amyloidosis is a deposition family, not a single disease: misfolded proteins share one microscopic identity but originate from light chains, acute-phase precursors, transthyretin or beta-2 microglobulin. The consequences follow from the location — nephrotic kidney, stiff heart, bulky tongue, brittle capillaries. Diagnosis is a tissue stained with Congo red plus typing of the fibril precursor, and each type has a distinct treatment: treat the inflammation, the plasma cell clone or the transthyretin.",
      },
      {
        type: "paragraph",
        text: "Next: the cardiovascular system — the most common systemic target for the processes you have studied in this course, from atherosclerosis through infarction to the vasculitides and aneurysms.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 15 — Cardiovascular pathology (fully authored)
// ---------------------------------------------------------------------------
function lesson15() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the development of an atheromatous plaque and its complications; state the major risk factors and distribution of atherosclerosis; distinguish stable angina from the acute coronary syndromes and list their complications; explain the vascular lesions of benign and malignant hypertension; contrast a true aneurysm and a dissection and name their complications; and recognise the category, target vessel and clinical clue of the main vasculitides.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "The whole course: thrombosis and embolism (lesson 5), infarction (lesson 8) and the cell-injury sequence (lesson 1) all combine here. Atherosclerosis is inflammatory, thrombotic and degenerative at once — every mechanism you have studied is visible in a coronary plaque.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "paragraph",
        text: "Cardiovascular pathology is dominated by one process: atherosclerosis, a chronic inflammatory disease of the arterial wall that narrows vessels and then kills catastrophically when a plaque ruptures and thrombosis supervenes. Hypertension accelerates it, diabetes amplifies it, and smoking drives its inflammation. Around that centre stand the secondary diseases of the wall itself — aneurysms, dissection and vasculitis — each of which can rupture or block an artery without any plaque at all.",
      },

      { type: "heading", level: 2, text: "Risk factors and distribution" },
      {
        type: "table",
        headers: ["Category", "Factor", "Mechanism of harm"],
        rows: [
          ["Major, modifiable", "Hypertension", "Shear injury to endothelium and accelerated plaque growth"],
          ["Major, modifiable", "Cigarette smoking", "Endothelial injury, inflammation, and a prothrombotic state"],
          ["Major, modifiable", "Hypercholesterolaemia", "Low-density lipoprotein retention and oxidation in the intima"],
          ["Major, modifiable", "Diabetes mellitus", "Advanced glycation, endothelial dysfunction and smaller-vessel disease"],
          ["Other, modifiable", "Obesity and physical inactivity", "Insulin resistance, dyslipidaemia and inflammation"],
          ["Non-modifiable", "Age and male sex", "The contribution of cumulative injury and hormonal protection"],
          ["Non-modifiable", "Family history and genetic determinants", "Inherited lipid metabolism and inflammatory variants"],
        ],
      },
      {
        type: "paragraph",
        text: "The distribution is worth memorising as a list because a question about stroke, limb or gut ischaemia is asking it in disguise: abdominal aorta, then the coronary arteries, the popliteals, the internal carotids, and the circle of Willis. Each of these is a high-shear, branch-heavy vessel, and it is the narrowing of these vessels that produces the three commonest manifestations of the disease — myocardial infarction, stroke and peripheral arterial disease.",
      },

      { type: "heading", level: 2, text: "From injury to plaque" },
      {
        type: "paragraph",
        text: "The lesion begins with endothelial injury and dysfunction. Low-density lipoprotein enters the intima and becomes oxidised; the oxidised lipid activates the endothelium so it expresses adhesion molecules, and monocytes enter and become macrophages that eat the lipid and turn into foam cells. T lymphocytes arrive, cytokines and growth factors are secreted, and smooth muscle cells migrate from the media to the intima and lay down collagen — which makes the fibrous cap and creates the necrotic lipid core at the plaque's centre. A fibrous plaque, white to yellow and raised into the lumen, is the result.",
      },
      {
        type: "table",
        headers: ["Stage", "Lesion", "Clinical importance"],
        rows: [
          ["Fatty streak", "A yellow streak of lipid-filled foam cells — present in teenagers, fully reversible", "No clinical significance"],
          ["Fibrous plaque", "A raised white plaque with a fibrous cap over a lipid-rich necrotic core, narrowing the lumen", "Causes stable angina if it limits flow"],
          ["Complicated plaque", "Rupture or erosion of the cap with superimposed thrombus, calcification and haemorrhage into the core, sometimes aneurysm formation", "The cause of the acute coronary syndromes, stroke and acute limb ischaemia"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The deadliest plaques are not necessarily the tightest. Expansile remodelling and a large soft lipid core with a thin cap make a stenosis invisible on a coronary angiogram while it is perfectly capable of rupturing — which is why treatment decisions are not made from the degree of narrowing alone, and why statins and antiplatelets are preventive rather than simply 'unclogging' drugs.",
      },

      { type: "heading", level: 2, text: "Ischaemic heart disease" },
      {
        type: "table",
        headers: ["Syndrome", "Mechanism", "Pathology"],
        rows: [
          ["Stable angina", "Exertional demand exceeds fixed supply — a stenosis narrows the coronary lumen", "Ischaemia without necrosis; chest pain on exertion, relieved by rest and nitrates"],
          ["Unstable angina and non-ST elevation myocardial infarction", "A plaque has changed (rupture, erosion, haemorrhage) and a non-occlusive thrombus forms intermittently; injury is subendocardial", "Myocardial necrosis in some (raised troponin) but not through the full wall; may progress"],
          ["ST elevation myocardial infarction", "An occlusive thrombus on a ruptured plaque stops transmural flow", "Transmural coagulative necrosis; Q-wave infarction"],
          ["Sudden cardiac death", "Arrhythmia, most commonly ventricular fibrillation, in a heart with ischaemia", "A normal-looking heart, often a plaque with a fresh thrombus"],
          ["Chronic ischaemic heart disease", "Progressive failure from previous infarcts, often with ventricular dilatation and scar", "Left ventricular failure, from scars that do not contract"],
        ],
      },
      {
        type: "paragraph",
        text: "Location decides the consequence: a right coronary occlusion gives inferoposterior infarction with sinus-node and atrioventricular block; a left anterior descending occlusion gives anterior infarction, the commonest and most lethal; a circumflex gives a lateral infarction. Infarction of the left main produces catastrophic anterolateral necrosis; thrombi in small distal branches produce the miniature infarcts that add up to a cardiomyopathy over years.",
      },
      {
        type: "table",
        headers: ["Complication of infarction", "Mechanism", "Timing"],
        rows: [
          ["Arrhythmia", "Ischaemic cells conduct badly and reperfusion of the injured myocardium triggers irritable foci", "First hours — the commonest cause of pre-hospital death"],
          ["Left ventricular failure and cardiogenic shock", "More than about 40% of the left ventricular muscle is lost", "Any time over the first days"],
          ["Rupture of the free wall", "Coagulative necrosis softens the wall, and the intact pericardium fills — tamponade", "3-7 days, when the wall is weakest"],
          ["Rupture of the interventricular septum or a papillary muscle", "Septal rupture gives an acute shunt; papillary rupture gives severe mitral regurgitation", "3-7 days, same interval"],
          ["Mural thrombus", "The infarcted wall (and an aneurysmal bulge) creates stasis, so a thrombus forms in the ventricle — a source of emboli", "Days to months"],
          ["Pericarditis", "The epicardium over a transmural infarct becomes inflamed", "2-4 days"],
          ["Dressler syndrome", "An autoimmune pericarditis weeks after the event", "Weeks"],
          ["Ventricular aneurysm", "Scar stretched by intraventricular pressure; arrhythmia, failure and persistent bulge", "Months, as a late complication"],
        ],
      },

      { type: "heading", level: 2, text: "Hypertension, aneurysm and vasculitis" },
      {
        type: "paragraph",
        text: "Long-standing hypertension remodells the heart concentrically (hypertrophy of cardiomyocytes) and thickens the arterioles: hyaline arteriolosclerosis in the benign form, a plasma-protein leak into arteriolar walls, and hyperplastic (onion-skin) arteriolosclerosis in the accelerated and malignant form, where massively raised pressures damage kidney and brain as well. The treatment principle is that lowering the pressure reverses the mechanism before it reaches its endpoints: stroke, renal failure and heart failure.",
      },
      {
        type: "table",
        headers: ["Condition", "Mechanism", "Typical patient and consequence"],
        rows: [
          ["Abdominal aortic aneurysm", "Atherosclerosis and inflammation weaken the wall, classically below the origin of the renal arteries", "Older smoker; pulsatile epigastric mass with back pain, and rupture producing fatal retroperitoneal or intraperitoneal haemorrhage"],
          ["Aortic dissection", "Blood splits the media through a tear in the intima; cystic medial degeneration in Marfan and Ehlers-Danlos and in long-standing hypertension", "Sudden tearing chest pain to the back; the type A dissection involves the ascending aorta (tamponade, acute aortic regurgitation, coronary occlusion) and is a surgical emergency; type B is often managed medically"],
          ["Giant cell arteritis", "Granulomatous inflammation of medium-to-large arteries (temporal)", "Older patient with headache, scalp tenderness, jaw claudication, a raised ESR — blindness risk if not treated urgently with steroids"],
          ["Takayasu arteritis", "Granulomatous inflammation of the aortic arch and branches", "Young women, pulseless, with visual and cerebrovascular symptoms"],
          ["Polyarteritis nodosa", "Necrotising inflammation of medium-sized arteries (kidney, gut, nerves; spares the lung)", "Young and middle-aged, with microaneurysms on arteriography, haematuria, abdominal pain and neuropathy — hepatitis-B association"],
          ["Kawasaki disease", "Arteritis of medium and coronary vessels in a child with mucocutaneous lymph node syndrome", "Coronary aneurysm and myocardial infarction in a febrile child — treated with immunoglobulin and aspirin"],
          ["Small-vessel ANCA vasculitides", "Microscopic polyangiitis and granulomatosis with polyangiitis — pauci-immune destruction of small vessels", "Kidney involvement with haematuria; the PR3-ANCA (or MPO-ANCA) pattern; lung and upper-airway disease in granulomatosis"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Calling every myocardial infarction transthoracic-on-a-plaque. Non-atherosclerotic infarction exists — coronary embolism (from atrial fibrillation or endocarditis), artery spasm, vasculitis and dissection can all cause it, particularly in younger patients.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a tight plaque is the dangerous one. A thin-capped, lipid-rich, remodelled plaque can rupture at any degree of stenosis; the conventional 50% and 70% cut-offs describe flow limitation, not rupture risk.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a dissection is an aneurysm. In a dissection there is no dilated segment — blood tracks within the wall, which compromises the true lumen; in an aneurysm the wall itself is dilated but intact. The treatments differ, and confusing them is a clinical error.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What turns a stable plaque into the lesion of an acute coronary syndrome?",
        answer: "Rupture or erosion of its fibrous cap with exposure of the thrombogenic core and collagen, and a superimposed platelet-rich thrombus that occludes (STEMI) or nearly occludes (NSTEMI/unstable angina) the vessel.",
        explanation: "The acute coronary syndromes are plaque-activation events, not plaque-growth events, which is why they can strike with little advance warning from angiographic narrowing.",
      },
      {
        type: "question",
        prompt: "Why did a patient's myocardial infarction give a pericardial rub and, three weeks later, pleuritic pain and fever?",
        answer: "The early rub is pericarditis over the transmural infarct; the later syndrome — fever, pleuritic chest pain and a pericardial rub weeks after the infarct — is Dressler syndrome, an autoimmune post-myocardial-pericarditis, not a new infarction.",
        explanation: "The clinical distinction is the timing: early pericarditis is local injury; Dressler is an autoimmune remote complication, typically at two weeks to several months.",
      },
      {
        type: "question",
        prompt: "A patient with jaw claudication, a new headache, tenderness over the temple and an ESR of 90 is suspected of which condition, and what must be done urgently?",
        answer: "Giant cell arteritis — the site of the temporal artery, the jaw claudication and the high ESR. High-dose corticosteroids must be started immediately, before a biopsy, because of the risk of irreversible blindness from ischaemic optic neuropathy.",
        explanation: "The urgent steroid is the treatment; the temporal artery biopsy then confirms, and steroids are not delayed for the test.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which sequence correctly describes the development of an atheromatous plaque?",
        options: [
          "Endothelial injury, LDL entry and oxidation, monocyte and macrophage foam cells, smooth muscle migration and cap formation, lipid core and finally rupture",
          "Thrombotic occlusion of the lumen first, then lipid deposition after recanalisation",
          "Smooth muscle necrosis first, then lipid accumulation at the wall",
          "A fatty streak that forms first and then progresses directly to aneurysm",
        ],
        correctIndex: 0,
        explanation: "Plaque formation follows one inflammatory sequence — endothelial injury, lipid retention and oxidation, monocyte recruitment and foam cells, smooth muscle migration and collagen cap, a necrotic lipid core — with the stable or complicated plaque as the end result.",
      },
      {
        type: "mcq",
        stem: "Which complication is the most common cause of death in the first hours after myocardial infarction?",
        options: ["Dressler syndrome", "Ventricular arrhythmia (ventricular fibrillation)", "Ventricular aneurysm", "Mural thrombus"],
        correctIndex: 1,
        explanation: "Ventricular fibrillation is the leading cause of sudden death after infarction, arising from the electrically irritable ischaemic and reperfused tissue; Dressler syndrome, aneurysms and mural thrombus are later events.",
      },
      {
        type: "mcq",
        stem: "A patient with Marfan syndrome has sudden tearing chest pain radiating to the back. Which combination of history and investigation is most specific?",
        options: [
          "A widened mediastinum on chest radiograph with an intimal flap on CT angiography",
          "A systolic bruit at the apex with a raised troponin — papillary muscle rupture",
          "A pulsatile epigastric mass with a raised serum urate — an abdominal aortic aneurysm",
          "A raised ESR with jaw claudication — giant cell arteritis",
        ],
        correctIndex: 0,
        explanation: "A young man with Marfan (a connective tissue disorder making dissection likely) presents with tearing chest pain, and CT confirms aortic dissection by the intimal flap. The other options describe mitral rupture, an AAA and temporal arteritis.",
      },
      {
        type: "mcq",
        stem: "Which artery is least likely to be affected by atherosclerosis?",
        options: ["Abdominal aorta", "Coronary artery", "Circle of Willis", "Pulmonary artery"],
        correctIndex: 3,
        explanation: "Atherosclerosis is a systemic arterial disease, and the pulmonary circulation (a low-pressure system) does not develop the same lesions. The distribution follows the high-shear systemic vessels: abdominal aorta, coronaries, carotids, circle of Willis.",
      },
      {
        type: "mcq",
        stem: "Which of the following is NOT a complication of myocardial infarction?",
        options: [
          "Free-wall rupture with tamponade", "Dressler syndrome weeks later", "Pulmonary thromboembolism from a leg-vein thrombus", "Ventricular aneurysm months later",
        ],
        correctIndex: 2,
        explanation: "The complications of myocardial infarction are arrhythmia, failure and shock, rupture, mural thrombus, pericarditis, Dressler syndrome, and aneurysm. Pulmonary embolism arises from deep-vein thrombosis, an independently dangerous clot rather than a direct complication of the infarct.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Cardiovascular pathology is atherosclerosis at the centre — a chronic inflammatory plaque disease of the shear-stressed arteries, accelerated by hypertension, smoking, diabetes and lipidaemia, that narrows and then ruptures. Ischaemic heart disease runs from stable angina through the acute coronary syndromes (thrombus on a ruptured plaque) to the late complications of myocardial infarction — arrhythmia, rupture, pericarditis, Dressler, aneurysm, failure. Around that centre stand hypertension with its arteriolosclerosis and cardiac hypertrophy, aneurysms and dissection, and the vasculitides from giant cell to ANCA — each a different mechanism, each capable of occluding or rupturing the vessel.",
      },
      {
        type: "paragraph",
        text: "This lesson concludes the cardiovascular synthesis: every process of the course — injury, inflammation, repair, clot, embolism, infarct and the immune response — is visible in the wall of one artery.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Module 1 SBA items — one per concept, authored and machine-checked.
// ---------------------------------------------------------------------------
const MODULE_ONE_SBAS: SbaSeed[] = [
  {
    slug: "pathology-cell-injury-repair--cell-injury--sba",
    concept: "cell-injury",
    stem: "Which pattern of necrosis is expected in a cerebral infarct, and why?",
    options: [
      "Coagulative necrosis, because proteins denature and preserve the architecture",
      "Liquefactive necrosis, because the brain has little supporting stroma and is rich in hydrolytic enzymes",
      "Caseous necrosis, because of a granulomatous reaction",
      "Fat necrosis, because of saponification by released fatty acids",
    ],
    correctAnswer:
      "Liquefactive necrosis, because the brain has little supporting stroma and is rich in hydrolytic enzymes",
    explanation:
      "Ischaemia gives coagulative necrosis in most solid organs, where denatured proteins preserve the tissue outline. The brain lacks a collagenous stroma and digests itself, so its infarcts liquefy. Caseous necrosis is a granulomatous reaction, and fat necrosis is saponification.",
    difficulty: "medium",
  },
  {
    slug: "pathology-cell-injury-repair--acute-inflammation--sba",
    concept: "acute-inflammation",
    stem: "Which sequence correctly describes the events of acute inflammation?",
    options: [
      "Vasoconstriction, then vasodilation and increased permeability, then leukocyte migration, then phagocytosis and killing",
      "Vasodilation, then vasoconstriction, then leukocyte migration, then platelet plug",
      "Leukocyte migration, then vasodilation, then phagocytosis, then oedema",
      "Phagocytosis first, then mediator release, then oedema last",
    ],
    correctAnswer:
      "Vasoconstriction, then vasodilation and increased permeability, then leukocyte migration, then phagocytosis and killing",
    explanation:
      "Acute inflammation begins with a transient vasoconstriction, then vasodilation with increased vascular permeability, then migration of leukocytes (rolling, activation, adhesion, transmigration, chemotaxis), and finally phagocytosis and killing.",
    difficulty: "easy",
  },
  {
    slug: "pathology-cell-injury-repair--wound-healing--sba",
    concept: "wound-healing",
    stem: "What is the tensile strength of a well-healed incision at approximately three weeks?",
    options: [
      "Ten per cent of the original tissue",
      "About fifty per cent of the original tissue",
      "About eighty per cent of the original tissue",
      "Fully restored strength",
    ],
    correctAnswer: "About fifty per cent of the original tissue",
    explanation:
      "At two weeks a wound has only about ten per cent of its original strength; at one month about fifty per cent; and a scar never exceeds about eighty per cent — which is why sutures are not removed early and dehisces occur months later.",
    difficulty: "medium",
  },
  {
    slug: "pathology-cell-injury-repair--chronic-inflammation--sba",
    concept: "chronic-inflammation",
    stem: "A lung biopsy shows a granuloma with caseous necrosis, epithelioid histiocytes and Langhans giant cells. Which is the most likely diagnosis?",
    options: [
      "Sarcoidosis", "Tuberculosis", "Crohn's disease", "Silicosis",
    ],
    correctAnswer: "Tuberculosis",
    explanation:
      "Caseating granulomas with a necrotic cheese-like centre are characteristic of tuberculosis. Sarcoidosis, Crohn's disease and silicosis produce non-caseating granulomas.",
    difficulty: "medium",
  },
  {
    slug: "pathology-cell-injury-repair--thrombosis-embolism--sba",
    concept: "thrombosis-embolism",
    stem: "A post-operative patient has a swollen painful calf, then collapses with breathlessness and pleuritic chest pain. What has happened?",
    options: [
      "A deep-vein thrombosis has formed, and a fragment has embolised to the pulmonary arteries",
      "A coronary artery has been occluded by a platelet-rich thrombus",
      "A cerebral artery has been blocked by an embolus from the left heart",
      "An abdominal aortic aneurysm has ruptured",
    ],
    correctAnswer:
      "A deep-vein thrombosis has formed, and a fragment has embolised to the pulmonary arteries",
    explanation:
      "The chain is Virchow's triad (immobility and surgical injury) producing a venous thrombus, then embolisation through the right heart to the pulmonary arterial tree. Arterial emboli from the left heart or aorta cause stroke or limb ischaemia instead.",
    difficulty: "easy",
  },
  {
    slug: "pathology-cell-injury-repair--oedema-shock--sba",
    concept: "oedema-shock",
    stem: "A patient has a unilateral swollen leg that does not pit on pressure, after an axillary node clearance. What is the mechanism?",
    options: [
      "Raised venous hydrostatic pressure in right-heart failure",
      "Hypoalbuminaemia in nephrotic syndrome",
      "Lymphatic obstruction leaving protein-rich interstitial fluid that cannot be displaced",
      "Increased vascular permeability from acute bacterial infection",
    ],
    correctAnswer:
      "Lymphatic obstruction leaving protein-rich interstitial fluid that cannot be displaced",
    explanation:
      "Failure of lymphatic drainage traps protein-rich fluid, which does not pit. Raised venous pressure gives bilateral dependent pitting oedema, and inflammation gives localised pitting oedema.",
    difficulty: "medium",
  },
];

// ---------------------------------------------------------------------------
// Deeper modules 2-6: a real concept spine, tracked-placeholder lessons.
// ---------------------------------------------------------------------------
const DEEPER_LESSONS: LessonSeed[] = [
  // --- M2 Haemodynamic disorders & thrombosis ---
  { title: "Hyperaemia, congestion & haemorrhage", module: 2, estimatedMinutes: 30, authored: false, concept: { title: "Hyperaemia, congestion and haemorrhage", slug: "hyperaemia-congestion", summary: "Active and passive hyperaemia, the effects of chronic venous congestion on liver, lung and spleen, and the consequences of haemorrhage.", blooms: "understand", minutes: 30, prereq: ["acute-inflammation"] }, content: { blocks: [] } },
  { title: "Thrombosis: mechanism & outcomes", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Mechanism and outcomes of thrombosis", slug: "thrombosis-mechanism", summary: "Endothelial injury, stasis and hypercoagulability; the platelet and coagulation phases; and the four possible fates of a thrombus.", blooms: "analyze", minutes: 40, prereq: ["cell-injury"] }, content: { blocks: [] } },
  { title: "Embolism: types & fates", module: 2, estimatedMinutes: 35, authored: true, concept: { title: "Types and fates of embolism", slug: "embolism-types", summary: "Venous, arterial, gas, fat, air, amniotic fluid and tumour emboli, and where each lodges.", blooms: "apply", minutes: 35, prereq: ["thrombosis-mechanism"] }, content: lesson7() as never },
  { title: "Infarction & ischaemia", module: 2, estimatedMinutes: 35, authored: true, concept: { title: "Infarction", slug: "infarction", summary: "The distinction between ischaemia and infarction, the red and pale infarcts, and the influence of collateral supply.", blooms: "apply", minutes: 35, prereq: ["embolism-types"] }, content: lesson8() as never },
  { title: "Disseminated intravascular coagulation", module: 2, estimatedMinutes: 30, authored: true, concept: { title: "Disseminated intravascular coagulation", slug: "dic", summary: "Widespread microvascular coagulation with consumption of platelets and factors, and the bleeding that follows.", blooms: "apply", minutes: 30, prereq: ["thrombosis-mechanism"] }, content: lesson9() as never },

  // --- M3 Neoplasia ---
  { title: "Definitions & nomenclature", module: 3, estimatedMinutes: 30, authored: true, concept: { title: "Neoplasm: definitions and nomenclature", slug: "neoplasia-definitions", summary: "Benign and malignant, the naming rules, the exceptions to those rules, and grading versus staging.", blooms: "remember", minutes: 30, prereq: ["cell-injury"] }, content: lesson10() as never },
  { title: "Hallmarks of cancer & molecular changes", module: 3, estimatedMinutes: 45, authored: true, concept: { title: "Hallmarks of cancer and molecular changes", slug: "cancer-hallmarks", summary: "Self-sufficiency in growth signals, evasion of suppression, immortality, angiogenesis, invasion and metastasis, and the genes that enable them.", blooms: "analyze", minutes: 45, prereq: ["neoplasia-definitions"] }, content: lesson11() as never },
  { title: "Carcinogenesis: mutation & environment", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "Carcinogenesis", slug: "carcinogenesis", summary: "Initiators and promoters, the multistep sequence, oncogenic viruses, chemical carcinogens and the biology of metastasis.", blooms: "analyze", minutes: 45, prereq: ["cancer-hallmarks"] }, content: lesson12() as never },
  { title: "Grading, staging & tumour markers", module: 3, estimatedMinutes: 35, authored: true, concept: { title: "Grading, staging and tumour markers", slug: "grading-staging", summary: "The TNM staging system, grading, biopsy diagnosis, and the use and limitations of tumour markers.", blooms: "apply", minutes: 35, prereq: ["neoplasia-definitions"] }, content: lesson13() as never },
  { title: "Paraneoplastic syndromes & tumour immunology", module: 3, estimatedMinutes: 35, authored: false, concept: { title: "Paraneoplastic syndromes and tumour immunology", slug: "paraneoplastic-tumour-immunity", summary: "The systemic effects of remote hormone-like products, immune surveillance, and current immunotherapy.", blooms: "apply", minutes: 35, prereq: ["grading-staging"] }, content: { blocks: [] } },

  // --- M4 Genetic & immune-mediated disease ---
  { title: "Mendelian, chromosomal & multifactorial disease", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Patterns of genetic disease", slug: "genetic-disease-patterns", summary: "Autosomal and sex-linked inheritance, triplet repeats, imprinting, chromosomal disorders and multifactorial inheritance.", blooms: "understand", minutes: 40,     prereq: ["chronic-inflammation"] }, content: { blocks: [] } },
  { title: "Autoimmune mechanisms", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Mechanisms of autoimmune disease", slug: "autoimmune-mechanisms", summary: "Loss of tolerance, molecular mimicry, and the systemic versus organ-specific autoimmune diseases.", blooms: "analyze", minutes: 40, prereq: ["chronic-inflammation"] }, content: { blocks: [] } },
  { title: "Amyloidosis", module: 4, estimatedMinutes: 30, authored: true, concept: { title: "Amyloidosis", slug: "amyloidosis", summary: "Extracellular deposition of misfolded protein fibrils, its classification, and the organ consequences — an application of the protein-structure chemistry taught in BCHM 101.", blooms: "apply", minutes: 30, prereq: ["chronic-inflammation"] }, content: lesson14() as never },

  // --- M5 Environmental & nutritional pathology ---
  { title: "Environmental & occupational pathology", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Environmental and occupational injury", slug: "environmental-pathology", summary: "Air pollution, tobacco, ionising and non-ionising radiation, occupational dusts and heavy metal toxicity.", blooms: "understand", minutes: 35, prereq: [] }, content: { blocks: [] } },
  { title: "Nutritional disorders", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Nutritional disorders", slug: "nutritional-disorders", summary: "Protein-energy malnutrition, the deficiency diseases, obesity, and the metabolic consequences of overnutrition.", blooms: "apply", minutes: 35, prereq: [] }, content: { blocks: [] } },
  { title: "Toxicology & adverse drug reactions", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Toxicology and adverse drug reactions", slug: "toxicology-adrs", summary: "Dose and exposure, the mechanisms of toxin injury, and the classification of adverse drug reactions.", blooms: "apply", minutes: 35, prereq: [] }, content: { blocks: [] } },
  { title: "Infectious disease pathology", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "General principles of infectious disease", slug: "infectious-disease-principles", summary: "Routes of transmission, mechanisms of microbial injury, the patterns of host response, and the pathology of the major organism groups.", blooms: "apply", minutes: 40, prereq: ["acute-inflammation"] }, content: { blocks: [] } },
  { title: "Ageing & death", module: 5, estimatedMinutes: 25, authored: false, concept: { title: "Ageing and the pathology of dying", slug: "ageing-death", summary: "The cellular and molecular biology of ageing, and the definition and certification of death.", blooms: "remember", minutes: 25, prereq: [] }, content: { blocks: [] } },

  // --- M6 Systemic pathology ---
  { title: "Cardiovascular pathology", module: 6, estimatedMinutes: 45, authored: true, concept: { title: "Cardiovascular pathology", slug: "cardiovascular-pathology", summary: "Atherosclerosis, ischaemic heart disease and its consequences, valvular disease, cardiomyopathies, aneurysms and vasculitides.", blooms: "apply", minutes: 45, prereq: ["thrombosis-mechanism", "infarction"] }, content: lesson15() as never },
  { title: "Respiratory pathology", module: 6, estimatedMinutes: 40, authored: false, concept: { title: "Respiratory pathology", slug: "respiratory-pathology", summary: "Pulmonary infections, obstructive lung disease, interstitial lung disease, vascular disease and lung tumours.", blooms: "apply", minutes: 40, prereq: ["infectious-disease-principles"] }, content: { blocks: [] } },
  { title: "Renal & urinary pathology", module: 6, estimatedMinutes: 40, authored: false, concept: { title: "Renal and urinary pathology", slug: "renal-pathology", summary: "Glomerular disease, tubulointerstitial disease, obstructive uropathy, tumours, and the acute and chronic kidney disease syndromes.", blooms: "apply", minutes: 40, prereq: ["thrombosis-mechanism"] }, content: { blocks: [] } },
  { title: "Gastrointestinal & hepatobiliary pathology", module: 6, estimatedMinutes: 40, authored: false, concept: { title: "Gastrointestinal and hepatobiliary pathology", slug: "gi-hepatobiliary-pathology", summary: "Inflammatory, obstructive, vascular and neoplastic diseases of the gut, liver and pancreas.", blooms: "apply", minutes: 40, prereq: ["infectious-disease-principles"] }, content: { blocks: [] } },
  { title: "Endocrine & haematological pathology", module: 6, estimatedMinutes: 40, authored: false, concept: { title: "Endocrine and haematological pathology", slug: "endocrine-haematological-pathology", summary: "Diseases of the pituitary, thyroid, parathyroid, adrenal, gonads and pancreas, and the anaemias, leukaemias, lymphomas and bleeding disorders.", blooms: "apply", minutes: 40, prereq: ["neoplasia-definitions"] }, content: { blocks: [] } },
  { title: "Nervous system, skin & musculoskeletal pathology", module: 6, estimatedMinutes: 35, authored: false, concept: { title: "Nervous system, skin and musculoskeletal pathology", slug: "cns-skin-msk-pathology", summary: "Demyelination, neurodegeneration, CNS tumours and trauma; inflammatory and neoplastic skin disease; and the disorders of bone, joint and muscle.", blooms: "apply", minutes: 35, prereq: ["cardiovascular-pathology"] }, content: { blocks: [] } },
];

export const PATHOLOGY: SubjectSeed = {
  id: "course-pathology",
  slug: "pathology-cell-injury-repair",
  title: "General & Systemic Pathology — Cell Injury, Inflammation & Disease",
  code: "PATH 201",
  department: "Pathology",
  level: 200,
  credits: 4,
  semester: "first",
  description:
    "The study of disease at the cellular, tissue and system level: how cells are injured and die, how inflammation and repair respond, and how haemodynamic, genetic, environmental and neoplastic processes produce the clinical syndromes that medicine treats. The bridge between basic science and the bedside.",
  faculty: "basic-medical-sciences",
  modules: MODULES,
  lessons: [
    { title: "Causes and morphology of cell injury", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Causes and morphology of cell injury", slug: "cell-injury", summary: "Hypoxia, physical, chemical, infectious, genetic and nutritional injury; the reversible-versus-irreversible boundary; and the six patterns of necrosis contrasted with apoptosis.", blooms: "understand", minutes: 40, prereq: [] }, content: lesson1() as never },
    { title: "Acute inflammation", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Acute inflammation", slug: "acute-inflammation", summary: "The sequence of vascular change and leukocyte recruitment, the chemical mediators, exudate versus transudate, and the outcomes of acute inflammation.", blooms: "understand", minutes: 40, prereq: ["cell-injury"] }, content: lesson2() as never },
    { title: "Repair, regeneration & wound healing", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Repair, regeneration and wound healing", slug: "wound-healing", summary: "Labile, stable and permanent regeneration; the stages of healing; granulation tissue; first versus second intention; and the local and systemic factors that impair it.", blooms: "analyze", minutes: 40, prereq: ["acute-inflammation"] }, content: lesson3() as never },
    { title: "Chronic inflammation & granulomas", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Chronic inflammation and granulomas", slug: "chronic-inflammation", summary: "The mononuclear infiltrate of chronic inflammation, the structure and differential diagnosis of the granuloma, and the caseating versus non-caseating distinction.", blooms: "analyze", minutes: 40, prereq: ["acute-inflammation"] }, content: lesson4() as never },
    { title: "Haemodynamic disorders: thrombosis & embolism", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Haemodynamic disorders: thrombosis and embolism", slug: "thrombosis-embolism", summary: "Virchow's triad, the structure and fate of a thrombus, and the clinical chain from deep-vein thrombosis to pulmonary embolism.", blooms: "apply", minutes: 40, prereq: ["acute-inflammation", "cell-injury"] }, content: lesson5() as never },
    { title: "Oedema & systemic effects of vascular disturbance", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Oedema and shock", slug: "oedema-shock", summary: "The four capillary mechanisms of oedema and their bedside recognition, the four categories of shock, and the laboratory guide to resusitation.", blooms: "apply", minutes: 40, prereq: ["thrombosis-embolism"] }, content: lesson6() as never },
    ...DEEPER_LESSONS,
  ],
  sbas: MODULE_ONE_SBAS,
  prereqCourses: ["gross-anatomy-i", "physiology-cell-and-general", "medical-biochemistry-i"],
};

export async function seedMbbsPathology() {
  return seedMbbsCourse(PATHOLOGY);
}

/** Idempotent: safe to run repeatedly; upserts on stable keys. */
export async function seedPathology(): Promise<void> {
  await seedMbbsPathology();
}

export default PATHOLOGY;

// CLI usage: npx ts-node prisma/seed-courses/mbbs/pathology.ts
if (process.argv[1] && process.argv[1].includes("mbbs/pathology")) {
  seedPathology()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}