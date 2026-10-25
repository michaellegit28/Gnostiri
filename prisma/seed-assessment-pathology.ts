import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Assessment content — General & Systemic Pathology (course "pathology-cell-injury-repair").
 *
 * 20 original SBA items deepening the Pathology bank from 6 to 26, tagged to the
 * existing ConceptNodes for this course (see prisma/seed-university.ts).
 * Covers haemodynamic disorders (infarction, embolism, thrombosis, congestion),
 * neoplasia (definitions/nomenclature, hallmarks, carcinogenesis, grading and
 * staging, paraneoplastic syndromes), immunopathology (autoimmunity, amyloidosis,
 * DIC), infection, genetics, nutrition/toxicology, and CVS / respiratory / GI-
 * hepatobiliary / renal / endocrine-haematological / CNS-skin-MSK pathology.
 *
 * Idempotent: upserts on the item slug; safe to re-run. orderIndex starts at
 * 6 so the six pre-existing items (0-5) keep their slots.
 *
 * Governance: every item ships reviewStatus "needs-human-review" — the
 * 2026-10-20 repair established that production rows must never sit at
 * "draft" (42 draft rows drifted live before). needsCheck flags the numeric
 * or distractor reasoning a pathologist should double-check.
 */

const COURSE_SLUG = "pathology-cell-injury-repair";

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
  // 1 — Infarction: pale vs haemorrhagic infarcts (medium)
  {
    slug: "path-infarction-red-versus-white-morphology",
    concept: "infarction",
    format: "sba",
    stem: "Two patients are compared: one with pulmonary artery thrombosis and one with a renal infarct from an embolised left atrial mural thrombus. Which statement correctly explains the typical difference in gross appearance of these infarcts?",
    options: [
      "Pulmonary infarcts are usually red (haemorrhagic) because the lung has a dual circulation and spongy parenchyma, letting bronchial arterial blood seep into the necrotic zone, whereas renal, splenic and myocardial infarcts are pale because they are end-arterial organs with dense parenchyma",
      "Both infarcts are invariably red, because every embolus carries red cells and pallor only reflects anaemia in the patient",
      "Renal infarcts are red because the kidney has a dual blood supply, while pulmonary infarcts are pale because pulmonary capillaries cannot leak blood",
      "Infarct colour is determined by the organ's lymphatic drainage and is therefore identical in lung and kidney",
    ],
    correctAnswer: "Pulmonary infarcts are usually red (haemorrhagic) because the lung has a dual circulation and spongy parenchyma, letting bronchial arterial blood seep into the necrotic zone, whereas renal, splenic and myocardial infarcts are pale because they are end-arterial organs with dense parenchyma",
    explanation: "Infarct appearance depends on the organ's blood supply and the texture of its parenchyma. Organs supplied by end arteries with solid tissue (kidney, spleen, heart, brain) produce pale anaemic infarcts, because blood cannot re-enter the necrotic area and compact tissue compresses the capillaries. The lung has a dual circulation (pulmonary and bronchial arteries) with loose, air-filled parenchyma, so red cells extravasate from bronchial vessels into the necrotic zone, giving a red, haemorrhagic infarct; venous occlusion in loose or torsion-prone tissue (testis, ovary, gut) behaves similarly.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false, // classic red/haemorrhagic infarcts: lung, gut, testis, ovary
  },

  // 2 — Fat embolism after skeletal trauma (medium)
  {
    slug: "path-embolism-fat-embolism-after-fracture",
    concept: "embolism-types",
    format: "sba",
    stem: "A 23-year-old man is admitted after a femoral shaft fracture. Thirty-six hours later he develops dyspnoea, hypoxaemia, a petechial rash over the chest and shoulders, and drowsiness. Which embolic phenomenon best accounts for this presentation?",
    options: [
      "Fat embolism released from marrow after skeletal trauma, classically appearing after a latent period of 24-72 hours with respiratory, neurological and cutaneous features",
      "Thromboembolism from a calf deep vein thrombosis, which produces the identical delayed triad within hours of injury",
      "Amniotic fluid embolism, which causes dyspnoea and coagulopathy after any tissue trauma",
      "Venous air embolism from a peripheral cannula, which explains the petechiae and confusion",
    ],
    correctAnswer: "Fat embolism released from marrow after skeletal trauma, classically appearing after a latent period of 24-72 hours with respiratory, neurological and cutaneous features",
    explanation: "Fat embolism syndrome follows long-bone and pelvic fractures (and rarely soft tissue trauma or lipid infusion), when marrow fat enters torn venous sinusoids and mechanically obstructs pulmonary and, via a patent foramen ovale or microvascular shunting, cerebral vessels; free fatty acids add a chemical pneumonitis. The 24-72 hour delay separates it from instantaneous haemodynamic embolisation, and petechiae, hypoxaemia and encephalopathy form the classic triad. Amniotic fluid embolism is confined to obstetric settings, air embolism requires large-volume venous gas, and calf thromboembolism causes sudden dyspnoea without a latent petechial syndrome.",
    difficulty: "medium",
    marks: 1,
  },

  // 3 — Lines of Zahn: antemortem thrombus vs postmortem clot (medium)
  {
    slug: "path-thrombosis-mechanism-lines-of-zahn",
    concept: "thrombosis-mechanism",
    format: "sba",
    stem: "A firm, tan, grey mass adherent to the left atrial appendage of a patient in atrial fibrillation shows grossly visible alternating pale and dark layers. Which statement about this finding is correct?",
    options: [
      "Alternating pale platelet-and-fibrin layers with dark erythrocyte-rich layers are the lines of Zahn; they are laid down in moving blood and are therefore proof of an antemortem thrombus rather than a postmortem clot",
      "Alternating pale and dark layers are characteristic of postmortem clots and therefore exclude thrombosis entirely",
      "Lines of Zahn can only form in veins, because arterial flow is too rapid to stratify red cells",
      "Lines of Zahn are alternating deposits of haemosiderin and fibrin, indicating an embolic origin for the mass",
    ],
    correctAnswer: "Alternating pale platelet-and-fibrin layers with dark erythrocyte-rich layers are the lines of Zahn; they are laid down in moving blood and are therefore proof of an antemortem thrombus rather than a postmortem clot",
    explanation: "Lines of Zahn are the gross and microscopic alternating bands of platelets and fibrin (pale) with red cells (dark) laid down as a thrombus propagates in flowing blood, so they distinguish an antemortem thrombus from a postmortem clot, which is gelatinous, non-adherent, shows 'chicken fat over currant jelly' and lacks lamination. They form wherever flow persists — arteries, cardiac chambers and venous valve pockets alike. Haemosiderin (not fibrin) is the iron-positive pigment of old haemorrhage and indicates a prior bleed rather than a laminating thrombus.",
    difficulty: "medium",
    marks: 1,
  },

  // 4 — Chronic venous congestion of the liver (medium)
  {
    slug: "path-congestion-nutmeg-liver-acinar-zones",
    concept: "hyperaemia-congestion",
    format: "sba",
    stem: "In right-sided cardiac failure the cut surface of the liver has a 'nutmeg' pattern of dark central spots against paler surrounding tissue. Which microscopic finding best explains this appearance?",
    options: [
      "Centrilobular (Zone 3) sinusoidal dilatation with centrilobular hepatocyte atrophy and degeneration, while periportal Zone 1 hepatocytes remain relatively preserved",
      "Massive pan-lobular collapse of reticulin with bridging fibrosis distributed evenly through every zone",
      "Swollen portal tracts packed with neutrophils surrounding an entirely normal centrilobular zone",
      "Ischaemic necrosis confined to the middle (Zone 2) hepatocytes with no sinusoidal change at all",
    ],
    correctAnswer: "Centrilobular (Zone 3) sinusoidal dilatation with centrilobular hepatocyte atrophy and degeneration, while periportal Zone 1 hepatocytes remain relatively preserved",
    explanation: "The nutmeg liver of chronic passive venous congestion reflects the hepatic acinar oxygen gradient: blood leaving the portal tract flows to the central vein, so Zone 3 centrilobular hepatocytes receive the least oxygenated blood and are the most vulnerable to congestion and hypoxia. Sinuses dilate around the central vein, centrilobular hepatocytes atrophy and degenerate, and periportal Zone 1 cells survive, producing the alternating dark and pale gross pattern. Prolonged severe congestion extends pericellular fibrosis into bridging and cardiac cirrhosis, but that is a late change beyond simple nutmeg congestion.",
    difficulty: "medium",
    marks: 1,
  },

  // 5 — Benign vs malignant mesenchymal nomenclature (easy)
  {
    slug: "path-neoplasia-nomenclature-chondroma",
    concept: "neoplasia-definitions",
    format: "sba",
    stem: "A well-circumscribed, slow-growing cartilaginous tumour of the femoral metaphysis in a 40-year-old consists of mature chondrocytes forming abundant cartilage matrix, does not infiltrate the surrounding bone and shows no mitoses. What is this tumour best called?",
    options: [
      "Chondroma — a benign neoplasm of mature chondrocytes",
      "Chondrosarcoma, because every cartilage-forming bone tumour is malignant",
      "Osteoma, because the lesion arises within bone",
      "Osteosarcoma, because the lesion produces cartilage matrix",
    ],
    correctAnswer: "Chondroma — a benign neoplasm of mature chondrocytes",
    explanation: "Nomenclature pairs tissue of origin with behaviour: benign mesenchymal tumours are named for the tissue with the suffix -oma (chondroma, lipoma, leiomyoma), while malignant mesenchymal tumours carry -sarcoma (chondrosarcoma, liposarcoma). Benign glandular epithelial tumours are adenomas and their malignant counterparts adenocarcinomas. What actually separates the two groups in practice is growth rate, encapsulation, degree of differentiation, local invasion and metastasis — this lesion's circumscription, mature chondrocytes and absent mitoses make it unambiguously benign.",
    difficulty: "easy",
    marks: 1,
  },

  // 6 — The angiogenic switch (medium)
  {
    slug: "path-hallmarks-angiogenesis-hif1a-vegf",
    concept: "cancer-hallmarks",
    format: "sba",
    stem: "A tumour nodule has grown beyond 1-2 mm but has not yet recruited its own blood supply. Which mechanism best explains how the angiogenic switch is triggered and how the resulting new vessels form?",
    options: [
      "Hypoxia stabilises HIF-1alpha, which transcriptionally upregulates VEGF and other pro-angiogenic factors, tipping the balance from inhibitory signals toward VEGF-driven sprouting from existing capillaries",
      "Telomerase activation supplies the surface receptors that allow endothelial cells to migrate into the tumour",
      "Loss of E-cadherin directly drives endothelial proliferation by releasing cells from contact inhibition",
      "Restoration of p53 allows the tumour to secrete thrombospondin, which stabilises new vessels",
    ],
    correctAnswer: "Hypoxia stabilises HIF-1alpha, which transcriptionally upregulates VEGF and other pro-angiogenic factors, tipping the balance from inhibitory signals toward VEGF-driven sprouting from existing capillaries",
    explanation: "Nodules beyond the 1-2 mm diffusion limit become hypoxic, and hypoxia stabilises hypoxia-inducible factor 1-alpha, which induces VEGF; the resulting excess of pro-angiogenic signals over inhibitors such as thrombospondin and endostatin constitutes the angiogenic switch. VEGF acts on endothelial VEGF receptors to drive sprouting, permeability and in-growth of new but architecturally abnormal, leaky vessels. Telomerase and E-cadherin loss address replicative immortality and invasion respectively, while intact p53 promotes the inhibitor thrombospondin rather than new vessel growth.",
    difficulty: "medium",
    marks: 1,
  },

  // 7 — Multistep carcinogenesis in colorectal cancer (hard)
  {
    slug: "path-carcinogenesis-vogelstein-sequence",
    concept: "carcinogenesis",
    format: "sba",
    stem: "Which sequence best describes the adenoma-carcinoma (Vogelstein) multistep progression in sporadic colorectal cancer?",
    options: [
      "Loss of APC on chromosome 5q, activation of KRAS on 12q, then loss of TP53 on 17p and DCC on 18q, accumulating stepwise with increasing dysplasia and eventually invasiveness",
      "Loss of TP53 first, then KRAS activation, then APC loss, ending in squamous metaplasia and carcinoma",
      "Activation of the retinoblastoma protein first, then APC loss, then p53 inactivation by methylation alone",
      "A single simultaneous infection-driven mutation of both APC and TP53 converting normal mucosa directly to carcinoma",
    ],
    correctAnswer: "Loss of APC on chromosome 5q, activation of KRAS on 12q, then loss of TP53 on 17p and DCC on 18q, accumulating stepwise with increasing dysplasia and eventually invasiveness",
    explanation: "Colorectal cancer is the textbook model of multistep carcinogenesis: loss of the APC tumour suppressor (inherited in familial adenomatous polyposis) drives the hyperproliferative adenoma, KRAS oncogene activation promotes clonal growth, and late loss of TP53 and DCC permits invasion and loss of differentiation. Each step is histologically recognisable, so the sequence correlates with the visible progression from hyperplasia to adenoma to carcinoma. The retinoblastoma protein is inactivated, not activated, and sporadic colorectal cancer is a stepwise accumulation of mutations rather than a single hit.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false, // APC 5q, KRAS 12q, TP53 17p, DCC 18q — standard Vogelstein model
  },

  // 8 — Grading versus staging (easy)
  {
    slug: "path-grading-versus-staging",
    concept: "grading-staging",
    format: "sba",
    stem: "Which statement correctly distinguishes tumour grading from tumour staging?",
    options: [
      "Grading is a histologic assessment of how closely tumour cells resemble the parent tissue (differentiation and cytologic abnormality); staging describes anatomical extent — size, nodal involvement and distant metastasis — and is the stronger determinant of prognosis and treatment",
      "Grading and staging are synonyms, both based on the size of the resected specimen",
      "Staging is determined microscopically from mitotic count and differentiation, while grading is based on cross-sectional imaging",
      "Grading measures metastatic spread while staging measures only which molecular mutations are present",
    ],
    correctAnswer: "Grading is a histologic assessment of how closely tumour cells resemble the parent tissue (differentiation and cytologic abnormality); staging describes anatomical extent — size, nodal involvement and distant metastasis — and is the stronger determinant of prognosis and treatment",
    explanation: "Grade reflects differentiation and cytologic atypia — low grade is well differentiated, high grade is poorly differentiated — and is scored on tubule or acinar formation, nuclear pleomorphism and mitotic activity (for example the Nottingham score and the Gleason score). Stage quantifies anatomic spread, using T for primary tumour size, N for nodes and M for distant metastasis, and is the dominant prognostic influence and the basis for treatment selection. The two measures are independent: a node-negative high-grade tumour has a favourable stage but an aggressive biology, whereas a large well-differentiated node-negative tumour has the reverse.",
    difficulty: "easy",
    marks: 1,
  },

  // 9 — Lambert-Eaton myasthenic syndrome (hard)
  {
    slug: "path-paraneoplastic-lambert-eaton-scclc",
    concept: "paraneoplastic-tumour-immunity",
    format: "sba",
    stem: "A 58-year-old smoker with small cell lung cancer has three months of dry mouth, absent reflexes and proximal muscle weakness that transiently improves with sustained effort. Which mechanism best explains the neuromuscular problem?",
    options: [
      "Autoantibodies against P/Q-type voltage-gated calcium channels on the presynaptic motor nerve terminal, reducing acetylcholine release and producing Lambert-Eaton myasthenic syndrome",
      "Autoantibodies against the postsynaptic acetylcholine receptor, producing myasthenia gravis that worsens with repeated use",
      "Direct metastatic infiltration of anterior horn cells by the lung tumour, producing a lower motor neurone pattern",
      "A pure humoral myositis with anti-Jo-1 antibodies, destroying muscle fibres by macrophage phagocytosis",
    ],
    correctAnswer: "Autoantibodies against P/Q-type voltage-gated calcium channels on the presynaptic motor nerve terminal, reducing acetylcholine release and producing Lambert-Eaton myasthenic syndrome",
    explanation: "Lambert-Eaton myasthenic syndrome is a classic paraneoplastic syndrome of small cell lung cancer, seen in about 60% of cases: antibodies against presynaptic P/Q-type voltage-gated calcium channels reduce calcium influx and acetylcholine release, giving proximal weakness with autonomic features (dry mouth, constipation) and reduced reflexes that characteristically improve after brief exercise. Myasthenia gravis instead targets postsynaptic acetylcholine receptors, fatigues with use, and is associated with thymoma rather than small cell lung carcinoma. Anti-Jo-1 causes an inflammatory myopathy, and the non-metastatic, antibody-mediated course here is not explained by tumour infiltration.",
    difficulty: "hard",
    marks: 1,
  },

  // 10 — Lupus nephritis as type III hypersensitivity (medium)
  {
    slug: "path-autoimmune-sle-type-iii-immune-complex",
    concept: "autoimmune-mechanisms",
    format: "sba",
    stem: "A 19-year-old woman has a malar rash, oral ulcers and polyarthritis; urinalysis shows haematuria and proteinuria. She is ANA positive with high anti-double-stranded DNA antibodies, low C3 and C4, and renal biopsy shows granular 'lumpy-bumpy' capillary wall and mesangial staining for IgG, C3 and C1q. Which mechanism best explains her renal lesion?",
    options: [
      "Type III hypersensitivity: circulating DNA-anti-dsDNA immune complexes deposit in glomeruli and activate complement, recruiting neutrophils and producing proliferative lupus nephritis",
      "Type II hypersensitivity: antibodies directed directly against the glomerular basement membrane, giving smooth linear IgG staining",
      "Type I hypersensitivity: mast-cell degranulation with an eosinophil-rich interstitial nephritis",
      "Type IV hypersensitivity: CD8+ cytotoxic T-cell destruction of glomerular endothelial cells with no antibody or complement deposition",
    ],
    correctAnswer: "Type III hypersensitivity: circulating DNA-anti-dsDNA immune complexes deposit in glomeruli and activate complement, recruiting neutrophils and producing proliferative lupus nephritis",
    explanation: "Systemic lupus erythematosus is a systemic immune-complex disease in which autoantibodies to nuclear antigens, especially dsDNA, form circulating complexes that lodge in glomeruli, skin, joints and serosa and fix complement — the mechanism of type III hypersensitivity. Granular 'lumpy-bumpy' immunofluorescence is the hallmark of immune-complex deposition, in contrast to anti-GBM disease (Goodpasture syndrome), which gives smooth linear IgG along the capillary wall. Complement consumption explains the low C3 and C4, and a 'full-house' pattern with C1q on immunofluorescence is typical of lupus nephritis.",
    difficulty: "medium",
    marks: 1,
  },

  // 11 — Disseminated intravascular coagulation (medium)
  {
    slug: "path-dic-consumption-and-hyperfibrinolysis",
    concept: "dic",
    format: "sba",
    stem: "A 62-year-old with gram-negative septic shock bleeds from venepuncture sites and mucosal surfaces. Platelet count is 42 x 10^9/L, PT and aPTT are prolonged, fibrinogen is low, D-dimer is markedly raised and the blood film shows fragmented red cells. What is the unifying mechanism?",
    options: [
      "Systemic activation of coagulation with consumption of platelets, fibrinogen and clotting factors plus secondary hyperfibrinolysis, producing simultaneous microvascular thrombosis and haemorrhage",
      "Isolated primary hyperfibrinolysis destroying clotting factors without any intravascular thrombosis",
      "Her heterozygous protein C deficiency unmasked by the infection",
      "Heparin-induced thrombocytopenia alone, since a low platelet count in sepsis always indicates a drug reaction",
    ],
    correctAnswer: "Systemic activation of coagulation with consumption of platelets, fibrinogen and clotting factors plus secondary hyperfibrinolysis, producing simultaneous microvascular thrombosis and haemorrhage",
    explanation: "Disseminated intravascular coagulation is not primarily a bleeding disorder: tissue factor released or expressed by injured endothelium and monocytes, amplified by inflammatory cytokines, drives widespread intravascular coagulation; microthrombi shear red cells into schistocytes, while consumption depletes platelets, fibrinogen, prothrombin and factors V and VIII. Secondary fibrinolysis then generates D-dimers and fibrin degradation products that themselves inhibit clotting, giving the diagnostic paradox of thrombosis and haemorrhage together. The cornerstone of management is treating the trigger, with blood-product support guided by repeated coagulation testing.",
    difficulty: "medium",
    marks: 1,
  },

  // 12 — Amyloid and Congo red (easy)
  {
    slug: "path-amyloidosis-congo-red-birefringence",
    concept: "amyloidosis",
    format: "sba",
    stem: "A 65-year-old with progressive nephrotic syndrome has a renal biopsy showing amorphous eosinophilic extracellular deposits in glomeruli and vessel walls. The deposits stain brick-red with Congo red and show apple-green birefringence under polarised light. What is the diagnosis and the molecular basis of the staining?",
    options: [
      "Amyloidosis — deposits of misfolded protein fibrils rich in cross-beta-pleated-sheet conformation, the structure that binds Congo red and rotates light to give apple-green birefringence",
      "Hyaline change — accumulated denatured plasma protein that stains with Congo red but without birefringence",
      "Fibrinoid necrosis — immune-complex deposition that shows a Maltese-cross pattern under polarised light",
      "Metastatic calcification — calcium-phosphate deposition that shows apple-green birefringence with von Kossa",
    ],
    correctAnswer: "Amyloidosis — deposits of misfolded protein fibrils rich in cross-beta-pleated-sheet conformation, the structure that binds Congo red and rotates light to give apple-green birefringence",
    explanation: "Amyloid is the extracellular accumulation of insoluble, misfolded fibrillar protein, usually with serum amyloid P component and glycosaminoglycans; the shared cross-beta-pleated-sheet conformation is what binds Congo red and produces the diagnostic apple-green birefringence. About 15 fibril proteins are recognised, including AL in myeloma and lymphoma, AA in chronic inflammation, ATTR in ageing and hereditary transthyretin disease, and beta-2 microglobulin in dialysis patients, so typing follows the clinical diagnosis. Hyaline and fibrinoid necrosis do not show apple-green birefringence, and calcium is demonstrated by von Kossa or Alizarin red rather than Congo red.",
    difficulty: "easy",
    marks: 1,
  },

  // 13 — HIV, CD4 count and Pneumocystis (medium)
  {
    slug: "path-hiv-cd4-pneumocystis-prophylaxis",
    concept: "infectious-disease-principles",
    format: "sba",
    stem: "A 35-year-old man with previously untreated HIV has three weeks of dry cough, exertional dyspnoea and fever, a CD4 count of 90 cells/microlitre, and diffuse bilateral perihilar ground-glass shadowing on chest radiograph. Which statement is most correct?",
    options: [
      "Pneumocystis jirovecii pneumonia rarely causes disease until the CD4 count falls below 200 cells/microlitre, so co-trimoxazole prophylaxis is given below that threshold and diagnosis rests on induced sputum or bronchoalveolar lavage staining",
      "Cytomegalovirus pneumonitis is the commonest cause of this subacute interstitial picture in HIV and typically presents when the CD4 count is above 200 cells/microlitre",
      "Tuberculosis produces all subacute perihilar shadowing in HIV, occurs at the same CD4 threshold as Pneumocystis jirovecii and never coexists with it",
      "Because Pneumocystis jirovecii colonises healthy adults, co-trimoxazole prophylaxis has no role in HIV care",
    ],
    correctAnswer: "Pneumocystis jirovecii pneumonia rarely causes disease until the CD4 count falls below 200 cells/microlitre, so co-trimoxazole prophylaxis is given below that threshold and diagnosis rests on induced sputum or bronchoalveolar lavage staining",
    explanation: "Pneumocystis jirovecii pneumonia is the classic AIDS-defining respiratory infection, with subacute progressive dyspnoea, dry cough, hypoxaemia and diffuse bilateral perihilar ground-glass change; it emerges as the CD4 count falls below 200 cells/microlitre, which is the threshold for co-trimoxazole prophylaxis, and it is diagnosed by staining induced sputum or lavage fluid (silver methenamine or immunofluorescence) because the organism cannot be cultured. Cytomegalovirus tends to cause retinitis, colitis or encephalitis at CD4 counts below 50. Tuberculosis may occur at higher CD4 counts and frequently coexists with other opportunistic infections, so the CD4 count remains central to predicting which pathogens appear.",
    difficulty: "medium",
    marks: 1,
  },

  // 14 — Trisomy 21 and nondisjunction (easy)
  {
    slug: "path-genetic-nondisjunction-trisomy-21",
    concept: "genetic-disease-patterns",
    format: "sba",
    stem: "A newborn has hypotonia, a flat facial profile with upslanting palpebral fissures, a single palmar crease, a systolic murmur and duodenal atresia. Karyotype shows 47,XX,+21. What is the mechanism of this abnormality?",
    options: [
      "Meiotic nondisjunction of chromosome 21 producing a whole-chromosome numerical trisomy rather than a single-gene defect",
      "Expansion of a trinucleotide repeat within an autosomal dominant gene on chromosome 21",
      "Deletion of the long arm of chromosome 5 causing cri-du-chat, with uniparental disomy for chromosome 21",
      "An X-linked recessive mutation with skewed lyonisation affecting chromosome 21",
    ],
    correctAnswer: "Meiotic nondisjunction of chromosome 21 producing a whole-chromosome numerical trisomy rather than a single-gene defect",
    explanation: "Down syndrome is a chromosomal disorder: the great majority of cases (about 95%) are full trisomy 21 from meiotic nondisjunction, most often in maternal meiosis I with advancing maternal age the main risk factor, while Robertsonian translocations account for about 4% and mosaicism for about 1-2%. Because the extra chromosome is present in every cell, the phenotype is a multi-system developmental syndrome — short stature, characteristic facies, congenital cardiac defects, duodenal atresia, intellectual disability, early-onset Alzheimer disease and an increased leukaemia risk — quite unlike a single-gene disorder. Trinucleotide repeat expansion, deletions and X-linked disorders cause their own characteristic syndromes, not a trisomy.",
    difficulty: "easy",
    marks: 1,
  },

  // 15 — Reed-Sternberg cells in Hodgkin lymphoma (hard)
  {
    slug: "path-haematology-hodgkin-reed-sternberg",
    concept: "endocrine-haematological-pathology",
    format: "sba",
    stem: "A 22-year-old man has painless rubbery cervical lymphadenopathy, a mediastinal mass and drenching night sweats with 8 kg weight loss. Lymph node biopsy shows large binucleate cells with prominent eosinophilic, inclusion-like nucleoli set in a mixed background of small lymphocytes, eosinophils and fibroblasts. Which cell is diagnostic?",
    options: [
      "The Reed-Sternberg cell — a large binucleate CD30 and CD15 positive B-cell-derived tumour cell on a polymorphous reactive background, diagnostic of classical Hodgkin lymphoma",
      "The plasma cell — a CD138-positive cell with a clock-face chromatin pattern, diagnostic of multiple myeloma",
      "The small cleaved cell — a CD10 and BCL6 positive germinal centre cell, diagnostic of follicular lymphoma",
      "The Langerhans histiocyte — a CD1a and S100 positive cell with Birbeck granules, diagnostic of Langerhans cell histiocytosis",
    ],
    correctAnswer: "The Reed-Sternberg cell — a large binucleate CD30 and CD15 positive B-cell-derived tumour cell on a polymorphous reactive background, diagnostic of classical Hodgkin lymphoma",
    explanation: "Classical Hodgkin lymphoma is defined by rare malignant Reed-Sternberg cells with binucleate 'owl-eye' nuclei, prominent eosinophilic nucleoli and immunophenotype CD30 positive, CD15 positive, with weak PAX5 reflecting crippled germinal centre B-cell origin. Crucially, these tumour cells sit within an abundant non-neoplastic inflammatory background of lymphocytes, eosinophils, histiocytes and fibrosis, and that inflammatory microenvironment is what produces the systemic B symptoms — fever, night sweats and weight loss exceeding 10% over six months — which also make this an advanced-stage disease. The other cell types belong to multiple myeloma, follicular lymphoma and Langerhans cell histiocytosis respectively.",
    difficulty: "hard",
    marks: 1,
  },

  // 16 — Timing of post-infarction rupture (hard)
  {
    slug: "path-cardiovascular-mi-free-wall-rupture-window",
    concept: "cardiovascular-pathology",
    format: "sba",
    stem: "A 68-year-old man has a large anterior transmural myocardial infarction and on day 6 develops severe chest pain with electromechanical dissociation and dies. Post mortem shows a ragged left ventricular free-wall rupture with haemopericardium. Which mechanism best explains why this complication occurs at this point in the infarct time course?",
    options: [
      "Neutrophilic enzymatic digestion and liquefactive necrosis of the infarcted wall peak between day 3 and day 7, the interval in which the wall is weakest and before collagen deposition begins to strengthen it",
      "Collagen synthesis is maximal between day 1 and day 2, so the wall cannot yet resist systolic stress by day 6",
      "Rupture results from re-occlusion of the infarct-related artery by fresh platelet thrombus on day 6",
      "Early subendothelial organisation begins within 12 hours of infarction and mechanically splits the wall",
    ],
    correctAnswer: "Neutrophilic enzymatic digestion and liquefactive necrosis of the infarcted wall peak between day 3 and day 7, the interval in which the wall is weakest and before collagen deposition begins to strengthen it",
    explanation: "Infarct healing follows a stereotyped timetable: coagulative necrosis is established within 24 hours, neutrophils and then macrophages infiltrate and digest the dead muscle, softening the wall so that rupture — free wall, interventricular septum or papillary muscle — clusters between days 3 and 7, and granulation tissue with early collagen appears from about day 7, with a firm grey scar by 6-8 weeks. Free-wall rupture of an extensive anterior transmural infarct causes tamponade and is usually fatal. Earlier deaths are predominantly arrhythmic, and reperfusion with primary PCI has made rupture much less common than in the pre-reperfusion era.",
    difficulty: "hard",
    marks: 1,
  },

  // 17 — Squamous cell carcinoma of the lung (medium)
  {
    slug: "path-respiratory-squamous-cell-carcinoma-pthrp",
    concept: "respiratory-pathology",
    format: "sba",
    stem: "A 70-year-old man with a 50 pack-year history has a large central hilar mass with cavitation. Histology shows sheets of polygonal cells with keratin pearls and intercellular bridges, and he has hypercalcaemia, hypophosphataemia and a raised parathyroid hormone-related peptide. Which statement is most accurate?",
    options: [
      "Squamous cell carcinoma of the lung — strongly related to smoking, typically central and cavitating, and a recognised cause of paraneoplastic hypercalcaemia through PTH-related peptide secretion",
      "Small cell carcinoma — a central neuroendocrine tumour that causes Cushing syndrome and SIADH rather than hypercalcaemia",
      "Adenocarcinoma — a peripheral TTF-1 positive tumour arising in scar tissue that characteristically produces hypercalcaemia",
      "Malignant mesothelioma — an asbestos-related pleural tumour that cavitates centrally and secretes PTH-related peptide",
    ],
    correctAnswer: "Squamous cell carcinoma of the lung — strongly related to smoking, typically central and cavitating, and a recognised cause of paraneoplastic hypercalcaemia through PTH-related peptide secretion",
    explanation: "Squamous cell carcinoma of the lung arises centrally from bronchial epithelium after smoking-related squamous metaplasia, dysplasia and carcinoma in situ, and it keratinises — keratin pearls and intercellular bridges — and cavitates because of central necrosis. It is the lung carcinoma classically associated with paraneoplastic hypercalcaemia from PTHrP and with hypertrophic pulmonary osteoarthropathy. Small cell carcinoma is central and neuroendocrine but grows rapidly, metastasises early and causes SIADH and ectopic ACTH (Cushing syndrome); adenocarcinoma is usually peripheral, TTF-1 positive and linked to scar, EGFR and ALK changes; mesothelioma is pleural and asbestos-related and does not cavitate.",
    difficulty: "medium",
    marks: 1,
  },

  // 18 — Barrett oesophagus and adenocarcinoma (medium)
  {
    slug: "path-git-barrett-oesophagus-adenocarcinoma-sequence",
    concept: "gi-hepatobiliary-pathology",
    format: "sba",
    stem: "A 60-year-old man with 15 years of severe reflux has endoscopy showing salmon-pink tongues extending 5 cm proximally from the gastro-oesophageal junction; biopsy shows columnar epithelium containing goblet cells. Which statement is correct?",
    options: [
      "Barrett oesophagus — reflux-induced metaplasia from squamous to specialised intestinal-type columnar epithelium, the principal precursor of oesophageal adenocarcinoma and an indication for endoscopic surveillance",
      "Oesophageal squamous cell carcinoma, arising in a field of reflux-induced squamous metaplasia",
      "Achalasia with columnar metaplasia driven by failure of the lower oesophageal sphincter",
      "Peptic stricture in which the presence of goblet cells is irrelevant to cancer risk",
    ],
    correctAnswer: "Barrett oesophagus — reflux-induced metaplasia from squamous to specialised intestinal-type columnar epithelium, the principal precursor of oesophageal adenocarcinoma and an indication for endoscopic surveillance",
    explanation: "Chronic gastro-oesophageal reflux injures squamous epithelium, which is replaced by columnar intestinal-type metaplasia containing goblet cells — Barrett oesophagus — and this is the main precursor lesion of oesophageal adenocarcinoma, progressing through the metaplasia-dysplasia (low grade, high grade) to intramucosal and then invasive carcinoma sequence. Detection of dysplasia drives endoscopic eradication therapy or intensive surveillance, so documenting goblet cell metaplasia matters clinically. Squamous cell carcinoma relates to tobacco, alcohol, nitrosamine exposure and hot beverages rather than reflux metaplasia, and achalasia causes aperistalsis with a dilated oesophagus rather than intestinal metaplasia.",
    difficulty: "medium",
    marks: 1,
  },

  // 19 — Childhood nephrotic syndrome (easy)
  {
    slug: "path-renal-minimal-change-disease-child",
    concept: "renal-pathology",
    format: "sba",
    stem: "A 5-year-old boy has periorbital oedema and frothy urine. Serum albumin is 22 g/L with raised cholesterol; urine shows 4+ protein with fatty casts. Light microscopy of a biopsy shows normal glomeruli and immunofluorescence is negative. Which lesion is most likely?",
    options: [
      "Minimal change disease — podocyte foot-process effacement that is invisible on light microscopy and accounts for most childhood nephrotic syndrome, responding to corticosteroids",
      "Post-streptococcal glomerulonephritis — a nephritic syndrome with subepithelial 'humps' and low serum C3",
      "Membranous nephropathy — the commonest cause of nephrotic syndrome in adults, with subepithelial immune deposits and thickened capillary walls",
      "Goodpasture syndrome — a rapidly progressive nephritic syndrome with linear anti-GBM antibody staining",
    ],
    correctAnswer: "Minimal change disease — podocyte foot-process effacement that is invisible on light microscopy and accounts for most childhood nephrotic syndrome, responding to corticosteroids",
    explanation: "Nephrotic syndrome — heavy proteinuria above 3.5 g/day with hypoalbuminaemia, oedema and hyperlipidaemia — in a young child is most often minimal change disease, in which glomeruli appear normal by light microscopy, immunofluorescence is negative, and electron microscopy shows diffuse podocyte foot-process effacement. The proteinuria is driven by a T-cell and cytokine-mediated podocyte injury rather than immune deposition, which is why immunoglobulin and complement staining are absent, and it responds promptly to corticosteroids. Post-streptococcal glomerulonephritis is nephritic (haematuria, oliguria, hypertension, low complement), membranous nephropathy is the leading adult cause of nephrotic syndrome, and anti-GBM disease is a rapidly progressive nephritic syndrome.",
    difficulty: "easy",
    marks: 1,
  },

  // 20 — Breslow thickness in melanoma (hard)
  {
    slug: "path-skin-melanoma-breslow-thickness",
    concept: "cns-skin-msk-pathology",
    format: "sba",
    stem: "A 45-year-old woman has a changing pigmented lesion on her back; biopsy shows atypical melanocytes forming nests within the dermis, ulceration of the overlying epidermis and a Breslow thickness of 2.1 mm. Which statement is most correct?",
    options: [
      "Breslow thickness, measured in millimetres from the top of the granular layer to the deepest invasive cell, is the dominant prognostic factor in cutaneous melanoma and guides excision margins and sentinel lymph node assessment",
      "Clark level, counting the number of dermal papillae involved, remains the strongest predictor of survival for all melanomas",
      "A Breslow thickness of 2.1 mm predicts benign behaviour and requires no nodal assessment",
      "Seborrhoeic keratosis may show identical dermal melanocytes, so Breslow thickness cannot be applied",
    ],
    correctAnswer: "Breslow thickness, measured in millimetres from the top of the granular layer to the deepest invasive cell, is the dominant prognostic factor in cutaneous melanoma and guides excision margins and sentinel lymph node assessment",
    explanation: "Microscopic depth drives melanoma prognosis: Breslow thickness in millimetres is the single most powerful prognostic variable, and its strata (under 1 mm, 1-2 mm, over 2 mm) determine excision margin, whether sentinel lymph node biopsy is performed, and follow-up intensity. Clark level, which records the anatomical layer of invasion, is now supplementary and mainly relevant to very thin lesions. Ulceration and high mitotic rate further worsen prognosis, and the presence of atypical dermal melanocytes with Breslow measurement is precisely what separates melanoma from a benign naevus, dysplastic naevus or seborrhoeic keratosis.",
    difficulty: "hard",
    marks: 1,
  },
];

async function seedAssessmentPathology() {
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
    if (new Set(it.options).size !== it.options.length) {
      throw new Error(`Duplicate options for ${it.slug}`);
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

  console.log(`✓ Pathology assessment items: ${count} items (marks 1, needs-human-review)`);
}

// CLI usage: npx ts-node prisma/seed-assessment-pathology.ts
if (process.argv[1] && process.argv[1].includes("seed-assessment-pathology")) {
  seedAssessmentPathology()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}

export { seedAssessmentPathology, ITEMS as PATHOLOGY_ITEMS };
