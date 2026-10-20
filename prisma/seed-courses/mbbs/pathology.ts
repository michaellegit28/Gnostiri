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
  { title: "Embolism: types & fates", module: 2, estimatedMinutes: 35, authored: false, concept: { title: "Types and fates of embolism", slug: "embolism-types", summary: "Venous, arterial, gas, fat, air, amniotic fluid and tumour emboli, and where each lodges.", blooms: "apply", minutes: 35, prereq: ["thrombosis-mechanism"] }, content: { blocks: [] } },
  { title: "Infarction & ischaemia", module: 2, estimatedMinutes: 35, authored: false, concept: { title: "Infarction", slug: "infarction", summary: "The distinction between ischaemia and infarction, the red and pale infarcts, and the influence of collateral supply.", blooms: "apply", minutes: 35, prereq: ["embolism-types"] }, content: { blocks: [] } },
  { title: "Disseminated intravascular coagulation", module: 2, estimatedMinutes: 30, authored: false, concept: { title: "Disseminated intravascular coagulation", slug: "dic", summary: "Widespread microvascular coagulation with consumption of platelets and factors, and the bleeding that follows.", blooms: "apply", minutes: 30, prereq: ["thrombosis-mechanism"] }, content: { blocks: [] } },

  // --- M3 Neoplasia ---
  { title: "Definitions & nomenclature", module: 3, estimatedMinutes: 30, authored: false, concept: { title: "Neoplasm: definitions and nomenclature", slug: "neoplasia-definitions", summary: "Benign and malignant, the naming rules, the exceptions to those rules, and grading versus staging.", blooms: "remember", minutes: 30, prereq: ["cell-injury"] }, content: { blocks: [] } },
  { title: "Hallmarks of cancer & molecular changes", module: 3, estimatedMinutes: 45, authored: false, concept: { title: "Hallmarks of cancer and molecular changes", slug: "cancer-hallmarks", summary: "Self-sufficiency in growth signals, evasion of suppression, immortality, angiogenesis, invasion and metastasis, and the genes that enable them.", blooms: "analyze", minutes: 45, prereq: ["neoplasia-definitions"] }, content: { blocks: [] } },
  { title: "Carcinogenesis: mutation & environment", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Carcinogenesis", slug: "carcinogenesis", summary: "Initiators and promoters, the multistep sequence, oncogenic viruses, chemical carcinogens and the biology of metastasis.", blooms: "analyze", minutes: 45, prereq: ["cancer-hallmarks"] }, content: { blocks: [] } },
  { title: "Grading, staging & tumour markers", module: 3, estimatedMinutes: 35, authored: false, concept: { title: "Grading, staging and tumour markers", slug: "grading-staging", summary: "The TNM staging system, grading, biopsy diagnosis, and the use and limitations of tumour markers.", blooms: "apply", minutes: 35, prereq: ["neoplasia-definitions"] }, content: { blocks: [] } },
  { title: "Paraneoplastic syndromes & tumour immunology", module: 3, estimatedMinutes: 35, authored: false, concept: { title: "Paraneoplastic syndromes and tumour immunology", slug: "paraneoplastic-tumour-immunity", summary: "The systemic effects of remote hormone-like products, immune surveillance, and current immunotherapy.", blooms: "apply", minutes: 35, prereq: ["grading-staging"] }, content: { blocks: [] } },

  // --- M4 Genetic & immune-mediated disease ---
  { title: "Mendelian, chromosomal & multifactorial disease", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Patterns of genetic disease", slug: "genetic-disease-patterns", summary: "Autosomal and sex-linked inheritance, triplet repeats, imprinting, chromosomal disorders and multifactorial inheritance.", blooms: "understand", minutes: 40,     prereq: ["chronic-inflammation"] }, content: { blocks: [] } },
  { title: "Autoimmune mechanisms", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Mechanisms of autoimmune disease", slug: "autoimmune-mechanisms", summary: "Loss of tolerance, molecular mimicry, and the systemic versus organ-specific autoimmune diseases.", blooms: "analyze", minutes: 40, prereq: ["chronic-inflammation"] }, content: { blocks: [] } },
  { title: "Amyloidosis", module: 4, estimatedMinutes: 30, authored: false, concept: { title: "Amyloidosis", slug: "amyloidosis", summary: "Extracellular deposition of misfolded protein fibrils, its classification, and the organ consequences — an application of the protein-structure chemistry taught in BCHM 101.", blooms: "apply", minutes: 30, prereq: ["chronic-inflammation"] }, content: { blocks: [] } },

  // --- M5 Environmental & nutritional pathology ---
  { title: "Environmental & occupational pathology", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Environmental and occupational injury", slug: "environmental-pathology", summary: "Air pollution, tobacco, ionising and non-ionising radiation, occupational dusts and heavy metal toxicity.", blooms: "understand", minutes: 35, prereq: [] }, content: { blocks: [] } },
  { title: "Nutritional disorders", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Nutritional disorders", slug: "nutritional-disorders", summary: "Protein-energy malnutrition, the deficiency diseases, obesity, and the metabolic consequences of overnutrition.", blooms: "apply", minutes: 35, prereq: [] }, content: { blocks: [] } },
  { title: "Toxicology & adverse drug reactions", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Toxicology and adverse drug reactions", slug: "toxicology-adrs", summary: "Dose and exposure, the mechanisms of toxin injury, and the classification of adverse drug reactions.", blooms: "apply", minutes: 35, prereq: [] }, content: { blocks: [] } },
  { title: "Infectious disease pathology", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "General principles of infectious disease", slug: "infectious-disease-principles", summary: "Routes of transmission, mechanisms of microbial injury, the patterns of host response, and the pathology of the major organism groups.", blooms: "apply", minutes: 40, prereq: ["acute-inflammation"] }, content: { blocks: [] } },
  { title: "Ageing & death", module: 5, estimatedMinutes: 25, authored: false, concept: { title: "Ageing and the pathology of dying", slug: "ageing-death", summary: "The cellular and molecular biology of ageing, and the definition and certification of death.", blooms: "remember", minutes: 25, prereq: [] }, content: { blocks: [] } },

  // --- M6 Systemic pathology ---
  { title: "Cardiovascular pathology", module: 6, estimatedMinutes: 45, authored: false, concept: { title: "Cardiovascular pathology", slug: "cardiovascular-pathology", summary: "Atherosclerosis, ischaemic heart disease and its consequences, valvular disease, cardiomyopathies, aneurysms and vasculitides.", blooms: "apply", minutes: 45, prereq: ["thrombosis-mechanism", "infarction"] }, content: { blocks: [] } },
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