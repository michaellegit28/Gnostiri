import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Assessment content — Medical Microbiology (para-clinical core).
 *
 * 22 original SBA items seeding the medical-microbiology course, tagged to
 * the concept spine seeded on 2026-10-24 (prisma/seed-university.ts). The
 * course previously had ZERO assessment items.
 *
 * Covers general bacteriology (cell structure, culture, genetics,
 * susceptibility), innate and adaptive immunity, antigen-antibody methods,
 * vaccines, virology (general, DNA, RNA), mycology, protozoan and helminth
 * parasitology, sterilisation and hospital infection control, and the
 * system-based infection clusters (respiratory, GI/hepatic, urinary/CNS,
 * STD/HIV/congenital, zoonoses).
 *
 * Idempotent: upserts on the item slug; safe to re-run. orderIndex starts
 * at 0 because no pre-existing items occupy the sequence.
 *
 * Governance: every item ships reviewStatus "needs-human-review" — the
 * live platform convention is marks 1 with negativeMarks 0.25 and never
 * "draft" or "verified" straight out of content seeding.
 */

const COURSE_SLUG = "medical-microbiology";

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
  // 1 — Bacterial cell structure / Gram stain (easy)
  {
    slug: "microb-gram-stain-peptidoglycan",
    concept: "bacterial-cell-structure",
    format: "sba",
    stem: "A Gram stain of purulent sputum from a patient with lobar pneumonia shows Gram-positive diplococci. Which structural feature explains why these organisms retain the crystal violet-iodine complex after the decolourisation step?",
    options: [
      "A thick peptidoglycan layer (20-80 nm) that resists alcohol decolourisation and retains the crystal violet-iodine complex",
      "An outer membrane containing lipopolysaccharide, which irreversibly absorbs the crystal violet",
      "Mycolic acid in the cell wall, which resists decolourisation by acid-alcohol",
      "A thin peptidoglycan layer with an outer membrane, which loses the complex on decolourisation",
    ],
    correctAnswer: "A thick peptidoglycan layer (20-80 nm) that resists alcohol decolourisation and retains the crystal violet-iodine complex",
    explanation:
      "Gram-positive organisms retain the crystal violet-iodine complex because their thick, extensively cross-linked peptidoglycan layer (20-80 nm) physically resists the alcohol decolourisation step. Gram-negative organisms have a thin peptidoglycan layer plus an outer membrane containing lipopolysaccharide, so the complex is washed out and they take up the counterstain (safranin or fuchsine). Mycolic acid is a separate property: it confers acid-fastness in mycobacteria, which is tested with acid-alcohol rather than alcohol.",
    difficulty: "easy",
    marks: 1,
  },

  // 2 — Growth and culture (medium)
  {
    slug: "microb-macconkey-stool-culture",
    concept: "bacterial-growth-culture",
    format: "sba",
    stem: "A stool specimen from a patient with bloody diarrhoea is sent for culture. Which medium and expected colonial behaviour correctly describes the isolation of enteric Gram-negative pathogens?",
    options: [
      "MacConkey agar — a selective and differential medium in which lactose fermenters such as E. coli form pink colonies while Salmonella and Shigella appear colourless",
      "Blood agar with optochin — selective for Gram-positive organisms and it inhibits all members of the Enterobacterales",
      "Chocolate agar — blood heated to 80 °C, used to isolate obligate anaerobes such as Bacteroides from stool",
      "Thayer-Martin medium — vancomycin and colistin inhibit Gram-negatives, so it selects for Salmonella species",
    ],
    correctAnswer: "MacConkey agar — a selective and differential medium in which lactose fermenters such as E. coli form pink colonies while Salmonella and Shigella appear colourless",
    explanation:
      "MacConkey agar contains bile salts and crystal violet, which suppress Gram-positive organisms, and lactose with neutral red as the differential system — lactose fermenters produce acid and form pink colonies whereas non-fermenters such as Salmonella and Shigella stay colourless. Blood agar (with optochin for testing pneumococci) supports fastidious Gram-positives rather than anaerobes; chocolate agar is blood heated to release haemin (factor X) and NAD (factor V) for Haemophilus and Neisseria; Thayer-Martin medium contains vancomycin, colistin and nystatin specifically to select for pathogenic Neisseria from mixed flora.",
    difficulty: "medium",
    marks: 1,
  },

  // 3 — Bacterial genetics and mutation (medium)
  {
    slug: "microb-mrsa-meca-pbp2a",
    concept: "bacterial-genetics-mutation",
    format: "sba",
    stem: "A Staphylococcus aureus isolate from a skin abscess is resistant to every beta-lactam tested but remains susceptible to vancomycin. Which genetic mechanism best explains this phenotype?",
    options: [
      "Acquisition of the mecA gene on the staphylococcal cassette chromosome mec, encoding penicillin-binding protein 2a with low beta-lactam affinity",
      "A point mutation in gyrA that alters DNA gyrase and blocks fluoroquinolone binding",
      "Production of a 16S rRNA methyltransferase that confers high-level aminoglycoside resistance",
      "A mutation in rpoB that changes the beta-lactam transpeptidase target",
    ],
    correctAnswer: "Acquisition of the mecA gene on the staphylococcal cassette chromosome mec, encoding penicillin-binding protein 2a with low beta-lactam affinity",
    explanation:
      "Methicillin resistance arises from horizontal transfer of the mecA (or mecC) gene carried on the staphylococcal cassette chromosome mec. The gene encodes PBP2a (PBP2'), a transpeptidase with very low affinity for virtually all beta-lactams — including flucloxacillin, most cephalosporins and the carbapenems — while retaining the ability to maintain the cell wall. gyrA mutations cause fluoroquinolone resistance, 16S rRNA methyltransferases (armA, rmt) confer high-level aminoglycoside resistance, and rpoB mutations produce rifampicin resistance. Vancomycin targets the D-Ala-D-Ala substrate upstream of PBP2a, which is why vancomycin-intermediate and -resistant S. aureus are so concerning.",
    difficulty: "medium",
    marks: 1,
  },

  // 4 — Antimicrobial susceptibility testing (medium)
  {
    slug: "microb-mic-breakpoints",
    concept: "antimicrobial-susceptibility",
    format: "sba",
    stem: "A laboratory reports a minimum inhibitory concentration (MIC) of 0.5 mg/L for a blood culture isolate. Which statement correctly describes how this value should be interpreted?",
    options: [
      "The MIC is compared against organism-specific and infection-site clinical breakpoints to classify the isolate as susceptible, susceptible-increased-exposure or resistant",
      "The MIC is a direct measurement of the drug concentration achieved in the patient's serum, so the dose must always exceed it",
      "The MIC applies only to bacteriostatic agents and cannot be determined for beta-lactams",
      "The MIC is the lowest dose that will eradicate the infection in vivo, regardless of the organism",
    ],
    correctAnswer: "The MIC is compared against organism-specific and infection-site clinical breakpoints to classify the isolate as susceptible, susceptible-increased-exposure or resistant",
    explanation:
      "MIC testing (broth or agar dilution) determines the lowest concentration that inhibits visible growth; interpretation is meaningless without a breakpoint. EUCAST and CLSI breakpoints are organism- and sometimes infection-site-specific and integrate MIC distributions, dosing regimens, pharmacokinetics/pharmacodynamics and clinical outcome. A single MIC value cannot be equated with a serum concentration, and MICs are routinely determined for beta-lactams (they remain the agents of choice for many Gram-positive infections). Modern EUCAST categories are susceptible, susceptible/increased exposure (formerly intermediate) and resistant — reflecting that a low MIC may still fail if exposure at the infection site is poor.",
    difficulty: "medium",
    marks: 1,
  },

  // 5 — Innate immunity (easy)
  {
    slug: "microb-tlr4-lps",
    concept: "innate-immunity",
    format: "sba",
    stem: "Which innate immune receptor-ligand pairing is correct?",
    options: [
      "Toll-like receptor 4 (TLR4) — lipopolysaccharide of Gram-negative bacteria",
      "Toll-like receptor 3 — bacterial lipoteichoic acid of Gram-positive organisms",
      "Toll-like receptor 9 — single-stranded viral RNA",
      "Mannose-binding lectin — peptidoglycan of Gram-positive bacteria",
    ],
    correctAnswer: "Toll-like receptor 4 (TLR4) — lipopolysaccharide of Gram-negative bacteria",
    explanation:
      "TLR4, in concert with MD-2 and CD14, recognises lipopolysaccharide of the Gram-negative outer membrane and triggers NF-kB-dependent cytokine release (TNF-alpha, IL-1, IL-6) — the basis of septic shock. TLR2 with TLR1/TLR6 recognises triacylated and diacylated lipopeptides including lipoteichoic acid; TLR3 recognises double-stranded viral RNA; TLR7/8 recognise single-stranded RNA; TLR9 recognises unmethylated CpG DNA; mannose-binding lectin binds mannose residues on microbial surfaces and activates the lectin complement pathway.",
    difficulty: "easy",
    marks: 1,
  },

  // 6 — Cell-mediated adaptive immunity (medium)
  {
    slug: "microb-th1-cd4-macrophage",
    concept: "adaptive-cellular-immunity",
    format: "sba",
    stem: "A patient with a CD4 count of 0.05 x 10^9/L develops disseminated Mycobacterium avium complex infection, invasive mucocutaneous candidiasis and CMV retinitis. Which immunological defect best explains this pattern of infection?",
    options: [
      "Profound loss of CD4+ T-helper cells, particularly Th1 cells, removing interferon-gamma-driven macrophage activation and help for CD8+ and humoral responses",
      "Failure of B-cell class switching producing a low IgG and absent memory",
      "Isolated deficiency of the terminal complement components C5-C9",
      "Defective neutrophil oxidative burst due to NADPH oxidase deficiency",
    ],
    correctAnswer: "Profound loss of CD4+ T-helper cells, particularly Th1 cells, removing interferon-gamma-driven macrophage activation and help for CD8+ and humoral responses",
    explanation:
      "Advanced HIV destroys CD4+ helper T cells, and the Th1 subset is the principal activator of macrophages through interferon-gamma. Their loss classically unmasks intracellular and opportunist pathogens — Mycobacterium avium complex, disseminated Salmonella, CMV, Candida and Cryptococcus — that healthy Th1 immunity restrains. Defective class switching is a humoral problem predisposing to encapsulated bacteria; C5-C9 deficiency (and properdin deficiency) causes recurrent Neisseria meningitidis infection; chronic granulomatous disease (NADPH oxidase defect) causes catalase-positive infections such as S. aureus, Serratia marcescens and Aspergillus.",
    difficulty: "medium",
    marks: 1,
  },

  // 7 — Humoral adaptive immunity (medium)
  {
    slug: "microb-affinity-maturation",
    concept: "adaptive-humoral-immunity",
    format: "sba",
    stem: "A booster dose of tetanus toxoid produces an IgG response of far higher affinity than that generated after the primary course. Which process explains this improvement?",
    options: [
      "Affinity maturation through somatic hypermutation followed by selection of higher-affinity B cells in germinal centres, alongside class switch recombination from IgM to IgG",
      "Clonal deletion of low-affinity B cells in the thymus",
      "Positive selection of IgG-producing plasma cells in the bone marrow independent of antigen",
      "Repeated V(D)J recombination in mature plasma cells to raise antibody affinity",
    ],
    correctAnswer: "Affinity maturation through somatic hypermutation followed by selection of higher-affinity B cells in germinal centres, alongside class switch recombination from IgM to IgG",
    explanation:
      "Within germinal centres, activation-induced cytidine deaminase introduces point mutations (somatic hypermutation) into immunoglobulin variable-region genes. B cells whose mutated receptors bind antigen with higher affinity are preferentially rescued by follicular dendritic cells and T follicular helper cells, so the antibody pool improves with each exposure. Class switch recombination changes only the constant region (mu to gamma, alpha or epsilon), converting IgM to IgG/IgA/IgE without altering affinity. V(D)J recombination is completed during antigen-independent development in the bone marrow and is not repeated in mature plasma cells, while clonal deletion is a central tolerance mechanism.",
    difficulty: "medium",
    marks: 1,
  },

  // 8 — Antigen-antibody reactions (medium)
  {
    slug: "microb-agglutination-readout",
    concept: "antigen-antibody-reactions",
    format: "sba",
    stem: "Which technique and readout pairing is correct for antigen-antibody reactions used in diagnostic microbiology?",
    options: [
      "Agglutination — visible clumping of particulate antigen-antibody complexes",
      "Western blot — a quantitative colorimetric readout of soluble antigen measured by optical density",
      "Immunofluorescence — an enzyme-substrate colour change detected by a plate reader",
      "Complement fixation — direct precipitation of antibody by radiolabelled antigen",
    ],
    correctAnswer: "Agglutination — visible clumping of particulate antigen-antibody complexes",
    explanation:
      "Agglutination is the visible clumping that occurs when antibody cross-links a particulate antigen, such as red cells in ABO grouping or latex beads coated with antigen in rapid antigen tests and Salmonella serotyping. Western blot (immunoblot) separates proteins by electrophoresis onto a membrane and visualises discrete bands with an enzyme-conjugated antibody. ELISA is the technique that yields a soluble antigen colorimetric readout measured by optical density; immunofluorescence uses fluorochrome-labelled antibody examined by fluorescence microscopy; complement fixation is an indirect assay where absence of haemolysis signals a positive reaction.",
    difficulty: "medium",
    marks: 1,
  },

  // 9 — Vaccines and immunisation (easy)
  {
    slug: "microb-mmr-live-attenuated",
    concept: "vaccines-immunisation",
    format: "sba",
    stem: "Which vaccine is a live attenuated viral vaccine that is routinely contraindicated in severe primary or acquired immunodeficiency?",
    options: [
      "MMR — a live attenuated viral vaccine that must not be given with severe immunosuppression",
      "Inactivated poliovirus vaccine (IPV), which carries no risk of vaccine-derived disease",
      "Recombinant hepatitis B vaccine, containing only purified HBsAg",
      "Conjugate Haemophilus influenzae type b vaccine",
    ],
    correctAnswer: "MMR — a live attenuated viral vaccine that must not be given with severe immunosuppression",
    explanation:
      "MMR contains live attenuated measles, mumps and rubella viruses; replication in profoundly immunodeficient hosts can produce disseminated vaccine-strain disease, so it is contraindicated with severe primary immunodeficiency, HIV with a CD4 count below 200 cells/microL, high-dose systemic corticosteroids and most biologic immunosuppressants (noting that inactivated vaccines may be given but often respond poorly). IPV is fully inactivated, hepatitis B vaccine is a recombinant subunit vaccine (HBsAg expressed in yeast), and the Hib vaccine is a polysaccharide-protein conjugate — none of these can replicate.",
    difficulty: "easy",
    marks: 1,
  },

  // 10 — General virology (medium)
  {
    slug: "microb-positive-sense-ssrna",
    concept: "general-virology",
    format: "sba",
    stem: "Which statement correctly describes the replication strategy of an enveloped, positive-sense single-stranded RNA virus?",
    options: [
      "The genome itself acts as messenger RNA and is translated directly into a polyprotein that is subsequently cleaved into functional viral proteins",
      "The genome must first be transcribed by a virion-carried polymerase into messenger RNA before any translation can occur",
      "Reverse transcription produces a DNA intermediate that is integrated into the host genome before transcription",
      "Viral messenger RNA is produced from a negative-sense genome that is already packaged in the mature virion",
    ],
    correctAnswer: "The genome itself acts as messenger RNA and is translated directly into a polyprotein that is subsequently cleaved into functional viral proteins",
    explanation:
      "In positive-sense ssRNA viruses (picornaviruses, flaviviruses such as hepatitis C, coronaviruses) the purified genome is itself infectious because host ribosomes translate it directly, usually as one polyprotein that viral proteases then cleave. Negative-sense ssRNA viruses (influenza, measles, rabies, RSV) must carry their own RNA-dependent RNA polymerase in the virion, since host machinery cannot read a negative-sense genome. Reverse transcription with integration is the retroviral strategy, and envelopment is acquired by budding through host membranes during assembly rather than being encoded by polarity.",
    difficulty: "medium",
    marks: 1,
  },

  // 11 — DNA viruses (medium)
  {
    slug: "microb-herpesvirus-latency",
    concept: "dna-viruses",
    format: "sba",
    stem: "Which family and characteristic pairing is correct for human DNA viruses?",
    options: [
      "Herpesviridae — enveloped linear double-stranded DNA viruses that replicate in the nucleus and establish lifelong latency in sensory ganglia or mononuclear cells",
      "Parvoviridae — enveloped viruses with segmented double-stranded DNA that carry a DNA polymerase in the virion",
      "Poxviridae — small non-enveloped viruses that replicate exclusively in the host cell nucleus",
      "Adenoviridae — partially single-stranded DNA viruses that replicate via a reverse transcription step",
    ],
    correctAnswer: "Herpesviridae — enveloped linear double-stranded DNA viruses that replicate in the nucleus and establish lifelong latency in sensory ganglia or mononuclear cells",
    explanation:
      "Herpesviruses (HSV-1, HSV-2, VZV, CMV, EBV) share an enveloped icosahedral virion containing linear double-stranded DNA; they replicate in the nucleus and establish latency — HSV and VZV in sensory ganglia, CMV and EBV in mononuclear cells — with reactivation under immunosuppression. Parvovirus B19 is small, non-enveloped and linear single-stranded DNA. Poxviruses (variola, vaccinia, molluscum contagiosum) are large enveloped viruses that replicate in the cytoplasm and encode their own transcription machinery. Adenoviruses are non-enveloped double-stranded DNA viruses replicating in the nucleus; the partially single-stranded virus that replicates through reverse transcription is hepadnavirus (hepatitis B).",
    difficulty: "medium",
    marks: 1,
  },

  // 12 — RNA viruses (medium)
  {
    slug: "microb-influenza-antigenic-shift",
    concept: "rna-viruses",
    format: "sba",
    stem: "Which mechanism best explains the abrupt emergence of a novel influenza A subtype against which the human population has little pre-existing immunity?",
    options: [
      "Antigenic shift — reassortment of the segmented genome between human and avian or swine influenza viruses during co-infection of a single host cell",
      "Antigenic drift — gradual point mutations in haemagglutinin and neuraminidase accumulating over successive seasons",
      "A single nucleotide substitution in the M2 ion channel conferring adamantane resistance",
      "Recombination between the haemagglutinin gene and a retroviral reverse transcriptase",
    ],
    correctAnswer: "Antigenic shift — reassortment of the segmented genome between human and avian or swine influenza viruses during co-infection of a single host cell",
    explanation:
      "Influenza A carries eight separate RNA genome segments. When a single cell is co-infected by human and avian or swine strains, segments can be exchanged (reassortment), producing a progeny virus with an antigenically novel haemagglutinin or neuraminidase subtype — antigenic shift — and the pandemic potential that follows from a population lacking cross-reactive antibodies. Antigenic drift is the slower accumulation of point mutations that drives seasonal epidemics and the need for annual vaccine updates; M2 mutations confer adamantane resistance alone.",
    difficulty: "medium",
    marks: 1,
  },

  // 13 — Medical mycology (medium)
  {
    slug: "microb-coccidioides-spherules",
    concept: "medical-mycology",
    format: "sba",
    stem: "A farm labourer in Arizona presents with a self-limiting febrile illness with arthralgia and erythema nodosum. Histopathology of tissue shows large spherules containing endospores. Which organism and its tissue form does this indicate?",
    options: [
      "Coccidioides immitis/C. posadasii — a dimorphic fungus forming large spherules with endospores in tissue and an arthroconidia-producing mould at 25 °C",
      "Histoplasma capsulatum — narrow-based budding yeast cells found within macrophages, acquired from bird and bat droppings",
      "Cryptococcus neoformans — a heavily encapsulated, narrow-based budding yeast associated with pigeon droppings",
      "Aspergillus fumigatus — dichotomously branching septate hyphae with acute-angle branching in tissue",
    ],
    correctAnswer: "Coccidioides immitis/C. posadasii — a dimorphic fungus forming large spherules with endospores in tissue and an arthroconidia-producing mould at 25 °C",
    explanation:
      "Coccidioides species are dimorphic fungi endemic to the southwestern USA, Mexico and parts of Central and South America. In tissue they appear as distinctive large spherules (20-80 micrometre) packed with endospores; in culture at 25 °C they grow as a mould producing alternating arthroconidia, which are extremely infectious and a recognised laboratory hazard. Histoplasma capsulatum of the Ohio and Mississippi valleys shows small intracellular narrow-based budding yeasts; Cryptococcus neoformans is an encapsulated yeast causing meningitis in the immunosuppressed; Aspergillus fumigatus appears as septate hyphae branching at 45 degrees and is linked to allergic bronchopulmonary aspergillosis rather than spherules.",
    difficulty: "medium",
    marks: 1,
  },

  // 14 — Protozoan parasites (medium)
  {
    slug: "microb-cerebral-toxoplasmosis",
    concept: "protozoan-parasites",
    format: "sba",
    stem: "A patient with a CD4 count of 0.09 x 10^9/L and positive Toxoplasma serology develops headache, fever and multiple ring-enhancing lesions in the basal ganglia on MRI. What is the most likely diagnosis?",
    options: [
      "Cerebral toxoplasmosis from reactivation of latent Toxoplasma gondii cysts, typically producing multiple ring-enhancing basal ganglia lesions",
      "Progressive multifocal leukoencephalopathy caused by JC polyomavirus, which classically ring-enhances",
      "Cryptococcal meningoencephalitis, which typically produces multiple ring-enhancing lesions",
      "Cerebral malaria due to Plasmodium falciparum, the commonest space-occupying lesion in advanced HIV",
    ],
    correctAnswer: "Cerebral toxoplasmosis from reactivation of latent Toxoplasma gondii cysts, typically producing multiple ring-enhancing basal ganglia lesions",
    explanation:
      "AIDS patients with CD4 counts below 0.1 x 10^9/L reactivate latent T. gondii bradyzoites, producing multiple ring-enhancing lesions with a predilection for the basal ganglia and corticomedullary junction; positive Toxoplasma IgG and a clinical-radiological response to pyrimethamine-sulfadiazine support the diagnosis. PML from JC polyomavirus causes non-enhancing white-matter lesions without mass effect; cryptococcal disease is usually diagnosed by CSF India ink, cryptococcal antigen or culture, and mass lesions are less typical; cerebral malaria is a travel-associated diagnosis producing diffuse cerebral oedema rather than discrete ring-enhancing lesions.",
    difficulty: "medium",
    marks: 1,
  },

  // 15 — Helminth parasites (medium)
  {
    slug: "microb-wuchereria-culex",
    concept: "helminth-parasites",
    format: "sba",
    stem: "Which helminth, mode of transmission and diagnostic finding pairing is correct?",
    options: [
      "Wuchereria bancrofti — acquired from the bite of infected Culex mosquitoes; microfilariae demonstrated on a night blood film",
      "Schistosoma haematobium — acquired by the faecal-oral route; eggs detected in the stool",
      "Taenia solium — acquired by skin penetration of infective cercariae in freshwater; larvae detected in muscle biopsy",
      "Onchocerca volvulus — carried in the bite of Culex mosquitoes; causes elephantiasis",
    ],
    correctAnswer: "Wuchereria bancrofti — acquired from the bite of infected Culex mosquitoes; microfilariae demonstrated on a night blood film",
    explanation:
      "Wuchereria bancrofti is transmitted by mosquito vectors (Culex, Anopheles, Aedes) and causes lymphatic filariasis, with microfilaremia showing nocturnal periodicity — hence night blood films are the classic diagnostic sample. Schistosoma haematobium is acquired when free-swimming cercariae penetrate skin in contact with infested freshwater, and its terminal-spined eggs are found in urine, causing haematuria and predisposing to squamous cell carcinoma of the bladder. Taenia solium results from ingesting cysticerci in undercooked pork; human cysticercosis (from ingesting eggs) yields calcified cysticerci in muscle or brain. Onchocerca volvulus is transmitted by blackflies of the genus Simulium and causes river blindness with subcutaneous nodules, not elephantiasis.",
    difficulty: "medium",
    marks: 1,
  },

  // 16 — Sterilisation and disinfection (easy)
  {
    slug: "microb-autoclave-spores",
    concept: "sterilisation-disinfection",
    format: "sba",
    stem: "Which statement correctly describes the principle and validation of steam sterilisation?",
    options: [
      "Saturated steam under pressure (121 °C for 15 minutes or 134 °C for 3 minutes) destroys bacterial spores, monitored with chemical indicators and confirmed with biological indicators of Geobacillus stearothermophilus spores",
      "Dry heat at 100 °C for 10 minutes achieves an equivalent sterility assurance level, verified using Bacillus subtilis spores",
      "Boiling water at 100 °C for 5 minutes reliably destroys spores and prions",
      "Ethylene oxide is the preferred method for heat-stable surgical instruments and is verified with autoclave tape",
    ],
    correctAnswer: "Saturated steam under pressure (121 °C for 15 minutes or 134 °C for 3 minutes) destroys bacterial spores, monitored with chemical indicators and confirmed with biological indicators of Geobacillus stearothermophilus spores",
    explanation:
      "Autoclaving uses saturated steam under pressure to denature microbial proteins and destroy the most resistant forms, including Bacillus and Clostridium spores, with standard cycles of 121 °C for 15 minutes or 134 °C for 3 minutes. Chemical indicators (autoclave tape, Browne's tubes, integrator strips) check that each cycle reached target conditions, while biological indicators of highly heat-resistant Geobacillus stearothermophilus spores are the gold standard for validation. Boiling does not reliably kill spores; prions require dedicated protocols such as prolonged 134 °C cycles with sodium hydroxide or incineration; and ethylene oxide is reserved for heat- and moisture-sensitive items such as plastics and delicate endoscopes because it is slow and toxic.",
    difficulty: "easy",
    marks: 1,
  },

  // 17 — Hospital-acquired infection (medium)
  {
    slug: "microb-cdiff-hospital",
    concept: "hospital-acquired-infection",
    format: "sba",
    stem: "Four days after broad-spectrum antibiotics, a ventilated ICU patient develops watery diarrhoea, abdominal cramping, fever and a rising white cell count. Which organism and confirmatory strategy is most appropriate?",
    options: [
      "Clostridioides difficile — detect glutamate dehydrogenase antigen and toxin, with nucleic acid amplification testing on an unformed stool sample",
      "Norovirus — isolate the virus by culture on routine blood agar",
      "Klebsiella pneumoniae — culture the organism from stool on MacConkey agar",
      "Candida albicans — confirm with a germ tube test alone",
    ],
    correctAnswer: "Clostridioides difficile — detect glutamate dehydrogenase antigen and toxin, with nucleic acid amplification testing on an unformed stool sample",
    explanation:
      "Broad-spectrum antibiotic use in hospital disrupts protective gut flora and permits Clostridioides difficile proliferation; toxin A and B cause the characteristic watery diarrhoea, cramping, fever and leucocytosis, with pseudomembranous colitis in severe cases. Diagnosis requires an unformed stool sample and combines detection of the glutamate dehydrogenase enzyme (a sensitive screen) with toxin EIA or nucleic acid amplification testing for the toxin B gene. Norovirus is diagnosed by RT-PCR and is associated with closed-community and ward outbreaks, while C. difficile spores resist alcohol hand gels, so soap-and-water handwashing and contact precautions are essential infection-control measures.",
    difficulty: "medium",
    marks: 1,
  },

  // 18 — Respiratory infections (hard)
  {
    slug: "microb-mycoplasma-no-cell-wall",
    concept: "respiratory-infections",
    format: "sba",
    stem: "A 22-year-old student has a dry cough, low-grade fever, headache and patchy peribronchial interstitial infiltrates on chest radiograph. Cold agglutinins are positive, and no organism grows on routine blood agar after 48 hours. Which organism best fits?",
    options: [
      "Mycoplasma pneumoniae — a bacterium lacking a cell wall, so it does not Gram-stain and requires specialised culture or serology/PCR",
      "Chlamydia trachomatis — an obligate intracellular bacterium that lacks peptidoglycan and grows on routine blood agar",
      "Streptococcus pneumoniae — a Gram-positive diplococcus that fails to grow on blood agar",
      "Legionella pneumophila — a Gram-negative environmental rod that grows on blood agar within 24 hours",
    ],
    correctAnswer: "Mycoplasma pneumoniae — a bacterium lacking a cell wall, so it does not Gram-stain and requires specialised culture or serology/PCR",
    explanation:
      "Mycoplasma pneumoniae is the classic cause of atypical (primary atypical) pneumonia in young adults: dry cough, low-grade fever, headache and interstitial or patchy bronchopneumonic infiltrates, often with positive cold agglutinins — IgM autoantibody against the red cell I antigen that can cause haemolysis. Having no cell wall, it does not Gram-stain and is intrinsically resistant to beta-lactams; diagnosis rests on serology or PCR, since culture needs specialised enriched media and is rarely performed. Chlamydia is also cell-wall-less but is obligately intracellular and cannot grow on blood agar; S. pneumoniae grows well on blood agar and is optochin-sensitive; Legionella requires buffered charcoal yeast extract agar supplemented with cysteine and iron and grows slowly.",
    difficulty: "hard",
    marks: 1,
  },

  // 19 — Gastrointestinal and hepatic infections (medium)
  {
    slug: "microb-hepatitis-b-serology-acute",
    concept: "gastrointestinal-hepatic-infections",
    format: "sba",
    stem: "A returned traveller with jaundice has serology: HBsAg positive, IgM anti-HBc positive, HBeAg positive and anti-HBs negative. How should these results be interpreted?",
    options: [
      "Acute hepatitis B infection with active viral replication and high infectivity — IgM anti-HBc marks acute infection and HBeAg indicates replication",
      "Past resolved hepatitis B infection, since HBsAg positivity indicates immunity",
      "Chronic hepatitis B with low-level viral replication, since HBeAg positivity indicates inactivity",
      "Acute hepatitis A infection, confirmed by the HBsAg pattern",
    ],
    correctAnswer: "Acute hepatitis B infection with active viral replication and high infectivity — IgM anti-HBc marks acute infection and HBeAg indicates replication",
    explanation:
      "HBsAg positivity indicates current hepatitis B infection; IgM anti-HBc is the marker that identifies acute infection (it appears before HBsAg and wanes over months), while IgG anti-HBc persists after past or chronic infection. HBeAg, together with high HBV DNA, reflects active replication and high infectivity, and seroconversion to anti-HBe marks falling replication. Resolution is indicated by loss of HBsAg with the appearance of anti-HBs, whereas persistence of HBsAg beyond six months defines chronic hepatitis B; anti-HBs alone (anti-HBc negative) is the pattern after successful vaccination.",
    difficulty: "medium",
    marks: 1,
  },

  // 20 — Urinary, CNS and wound infections (medium)
  {
    slug: "microb-csf-bacterial-meningitis",
    concept: "urinary-cns-infections",
    format: "sba",
    stem: "Which cerebrospinal fluid profile correctly matches the stated diagnosis?",
    options: [
      "Bacterial meningitis — turbid fluid with a raised neutrophil count, protein elevated (typically 1-5 g/L) and reduced glucose with a CSF:serum ratio below 0.4",
      "Viral meningitis — a raised neutrophil count with markedly reduced glucose and high protein",
      "Tuberculous meningitis — lymphocytosis with markedly raised glucose and normal protein",
      "Subarachnoid haemorrhage — fluid that clears of blood across successive collection tubes",
    ],
    correctAnswer: "Bacterial meningitis — turbid fluid with a raised neutrophil count, protein elevated (typically 1-5 g/L) and reduced glucose with a CSF:serum ratio below 0.4",
    explanation:
      "Bacterial meningitis produces turbid CSF with hundreds to tens of thousands of neutrophils, a markedly raised protein, and low glucose (CSF:serum glucose ratio usually below 0.4) because neutrophils and bacteria consume glucose. Viral meningitis typically gives a clear, lymphocytic picture with normal or mildly elevated protein and normal glucose. Tuberculous and fungal meningitis are lymphocytic but with very high protein and low glucose — cryptococcal disease is confirmed by India ink or cryptococcal antigen. Subarachnoid haemorrhage yields uniformly blood-stained CSF with xanthochromia (the yellow supernatant after centrifugation) in all collected tubes, whereas a traumatic tap progressively clears between tubes.",
    difficulty: "medium",
    marks: 1,
  },

  // 21 — STDs, HIV and congenital infections (hard)
  {
    slug: "microb-hiv-mtct-art",
    concept: "std-hiv-congenital",
    format: "sba",
    stem: "A pregnant woman with untreated HIV has a viral load above 100,000 copies/mL near term. Which intervention best reduces mother-to-child transmission?",
    options: [
      "Antiretroviral therapy to suppress maternal viral load below the limit of detection, with intrapartum zidovudine where indicated and infant post-exposure prophylaxis",
      "Elective caesarean section alone, which reliably reduces transmission without antiretrovirals",
      "Breastfeeding with passive protection of the infant through antibodies in maternal colostrum",
      "Immediate neonatal immunoglobulin alone, since antiretrovirals are contraindicated in pregnancy",
    ],
    correctAnswer: "Antiretroviral therapy to suppress maternal viral load below the limit of detection, with intrapartum zidovudine where indicated and infant post-exposure prophylaxis",
    explanation:
      "Without intervention, mother-to-child transmission of HIV runs at 15-45%; combination maternal antiretroviral therapy that maintains viral load below the limit of detection reduces intrapartum transmission to under 1-2%. Additional measures include intravenous zidovudine during delivery when the viral load is not fully suppressed near term, and infant post-exposure prophylaxis — commonly zidovudine monotherapy for low-risk infants or combination prophylaxis for high-risk infants. Where safe, sustainable formula feeding is available, avoiding breastfeeding eliminates postnatal transmission; caesarean section is an adjunct used only when the viral load remains high near term, and antiretrovirals are central to, not contraindicated in, modern pregnancy care.",
    difficulty: "hard",
    marks: 1,
  },

  // 22 — Zoonoses and entomology (medium)
  {
    slug: "microb-typhus-body-louse",
    concept: "zoonoses-entomology",
    format: "sba",
    stem: "Which vector, pathogen and disease pairing is correct?",
    options: [
      "Pediculus humanus (human body louse) — Rickettsia prowazekii — epidemic typhus",
      "Anopheles mosquito — Yersinia pestis — bubonic plague with inguinal buboes",
      "Ixodes tick — Borrelia recurrentis — Lyme disease with erythema chronicum migrans",
      "Xenopsylla flea — Leishmania donovani — visceral leishmaniasis (kala-azar)",
    ],
    correctAnswer: "Pediculus humanus (human body louse) — Rickettsia prowazekii — epidemic typhus",
    explanation:
      "Epidemic typhus is caused by Rickettsia prowazekii, an obligately intracellular organism transmitted by the human body louse, Pediculus humanus corporis, whose infected faeces enter through scratched skin or the respiratory tract; it presents with sustained high fever, severe headache and a rash spreading outward from the trunk, and can recrudesce years later as Brill-Zinsser disease. Plague is a flea-borne zoonosis (Xenopsylla cheopis) of Yersinia pestis; Lyme disease is transmitted by Ixodes ticks carrying Borrelia burgdorferi (B. recurrentis is the louse-borne cause of relapsing fever); and visceral leishmaniasis is transmitted by phlebotomine sandflies.",
    difficulty: "medium",
    marks: 1,
  },
];

async function seedAssessmentMicrobiology() {
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
        isPublished: true,
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

  console.log(`✓ Medical Microbiology assessment items: ${count} items (marks 1, negativeMarks 0.25, needs-human-review)`);
}

// CLI usage: npx ts-node prisma/seed-assessment-microbiology.ts
if (process.argv[1] && process.argv[1].includes("seed-assessment-microbiology")) {
  seedAssessmentMicrobiology()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}

export { seedAssessmentMicrobiology, ITEMS as MICROBIOLOGY_ITEMS };
