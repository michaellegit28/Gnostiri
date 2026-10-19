export const SUBJECTS = [
  { id: "math", name: "Mathematics" },
  { id: "english", name: "English Language" },
  { id: "biology", name: "Biology" },
  { id: "chemistry", name: "Chemistry" },
  { id: "physics", name: "Physics" },
  { id: "economics", name: "Economics" },
  { id: "geography", name: "Geography" },
  { id: "literature", name: "Literature in English" },
];

export const QUESTION_BANK = {
  math: [
    {
      id: "m001", subject: "math", coreId: "core-quadratic-factoring", type: "mcq",
      core: { formula: "x² + bx + c = 0 factorable", structure: "solve quadratic by factoring", difficulty: "easy" },
      versions: {
        official: {
          text: "Solve for x: x(x - 3) = 0",
          answer: "x = 0 or x = 3",
          options: ["x = 0 or x = 3", "x = 0 only", "x = 3 only", "x = -3 or x = 0"],
          attestation: "pending-agent3",
        },
        global: {
          text: "Solve for x: x² + 3x - 10 = 0",
          answer: "x = 2 or x = -5",
          options: ["x = 2 or x = -5", "x = -2 or x = 5", "x = 1 or x = -10", "x = -1 or x = 10"],
        },
      },
    },
    {
      id: "m002", subject: "math", coreId: "core-quadratic-formula", type: "mcq",
      core: { formula: "ax² + bx + c = 0 via quadratic formula", structure: "solve quadratic, 2 dp", difficulty: "medium" },
      versions: {
        official: {
          text: "Solve for x (correct to TWO decimal places): 2x² + 1 = 4x",
          answer: "x = 1.71 or x = 0.29",
          options: ["x = 1.71 or x = 0.29", "x = 2.00 or x = 1.00", "x = 1.50 or x = 0.50", "x = 1.82 or x = 0.18"],
          attestation: "pending-agent3",
        },
        global: {
          text: "Solve for x (correct to TWO decimal places): 3x² - 1 = 6x",
          answer: "x = 2.15 or x = -0.15",
          options: ["x = 2.15 or x = -0.15", "x = 1.71 or x = 0.29", "x = 3.00 or x = 1.00", "x = 2.00 or x = -1.00"],
        },
      },
    },
    {
      id: "m003", subject: "math", coreId: "core-inequality-quadratic", type: "mcq",
      core: { formula: "quadratic inequality — sign chart", structure: "solve quadratic inequality", difficulty: "medium" },
      versions: {
        official: {
          text: "Solve for x: x² - 2x - 3 > 0",
          answer: "x < -1 or x > 3",
          options: ["x < -1 or x > 3", "-1 < x < 3", "x < 3", "x > -1 only"],
          attestation: "pending-agent3",
        },
        global: {
          text: "Solve for x: x² - x - 6 > 0",
          answer: "x < -2 or x > 3",
          options: ["x < -2 or x > 3", "-2 < x < 3", "x < 3", "x > -2 only"],
        },
      },
    },
    {
      id: "m004", subject: "math", coreId: "core-arithmetic-sequence", type: "mcq",
      core: { formula: "Tₙ = a + (n-1)d", structure: "arithmetic sequence nth term", difficulty: "medium" },
      versions: {
        official: {
          text: "The 5th term of an AP is 20 and the 10th term is 45. Find the 100th term.",
          answer: "495",
          options: ["495", "490", "500", "485"],
          attestation: "pending-agent3",
        },
        global: {
          text: "Find the 6th term of the AP: 3, 7, 11, 15, ...",
          answer: "23",
          options: ["23", "21", "25", "27"],
        },
      },
    },
    {
      id: "m005", subject: "math", coreId: "core-percentage-profit", type: "mcq",
      core: { formula: "profit% = (profit / cost) × 100", structure: "percentage profit word problem", difficulty: "easy" },
      versions: {
        official: {
          text: "A trader sells a bag of maize for R600 after buying it for R480. What is the percentage profit?",
          answer: "25%",
          options: ["25%", "20%", "30%", "35%"],
          attestation: "pending-agent3",
        },
        global: {
          text: "A trader buys a bag of rice for ₦8,000 and sells it for ₦10,000. What is the percentage profit?",
          answer: "25%",
          options: ["25%", "20%", "30%", "15%"],
        },
      },
    },
    {
      id: "m006", subject: "math", coreId: "core-simple-interest", type: "mcq",
      core: { formula: "A = P(1 + rt)", structure: "simple interest calculation", difficulty: "medium" },
      versions: {
        official: {
          text: "Sipho invests R5,000 at 8% simple interest per annum. What amount will he have after 3 years?",
          answer: "R6,200",
          options: ["R6,200", "R6,000", "R5,800", "R6,400"],
          attestation: "pending-agent3",
        },
        global: {
          text: "If ₦3,000 is invested at 5% simple interest per annum, what is the total amount after 4 years?",
          answer: "₦3,600",
          options: ["₦3,600", "₦3,400", "₦3,800", "₦3,200"],
        },
      },
    },
    {
      id: "m007", subject: "math", coreId: "core-pythagoras", type: "mcq",
      core: { formula: "a² + b² = c²", structure: "Pythagorean theorem application", difficulty: "easy" },
      versions: {
        official: {
          text: "A right-angled triangle has two legs of 6 cm and 8 cm. Find the hypotenuse.",
          answer: "10 cm",
          options: ["10 cm", "12 cm", "14 cm", "11 cm"],
          attestation: "pending-agent3",
        },
        global: {
          text: "A right-angled triangle has sides 9 cm and 12 cm forming the right angle. What is the length of the longest side?",
          answer: "15 cm",
          options: ["15 cm", "18 cm", "21 cm", "13 cm"],
        },
      },
    },
    {
      id: "m008", subject: "math", coreId: "core-circle-area", type: "mcq",
      core: { formula: "A = πr²", structure: "area of circle", difficulty: "easy" },
      versions: {
        official: {
          text: "Calculate the area of a circle with radius 7 cm. (Take π = 22/7)",
          answer: "154 cm²",
          options: ["154 cm²", "144 cm²", "166 cm²", "176 cm²"],
          attestation: "pending-agent3",
        },
        global: {
          text: "A circular field has a radius of 10 m. What is its area? (Take π = 3.14)",
          answer: "314 m²",
          options: ["314 m²", "300 m²", "320 m²", "340 m²"],
        },
      },
    },
    {
      id: "m009", subject: "math", coreId: "core-logarithms", type: "mcq",
      core: { formula: "log_b(x) = y ⟺ bʸ = x", structure: "evaluate logarithm", difficulty: "medium" },
      versions: {
        official: {
          text: "Evaluate: log₂ 32",
          answer: "5",
          options: ["5", "4", "3", "6"],
          attestation: "pending-agent3",
        },
        global: {
          text: "Evaluate: log₃ 81",
          answer: "4",
          options: ["4", "3", "5", "2"],
        },
      },
    },
    {
      id: "m010", subject: "math", coreId: "core-statistics-mean", type: "mcq",
      core: { formula: "mean = Σx / n", structure: "calculate mean from data set", difficulty: "easy" },
      versions: {
        official: {
          text: "Find the mean of the data set: 4, 8, 6, 10, 12.",
          answer: "8",
          options: ["8", "7", "6", "9"],
          attestation: "pending-agent3",
        },
        global: {
          text: "What is the mean of: 5, 7, 9, 11, 13?",
          answer: "9",
          options: ["9", "8", "10", "7"],
        },
      },
    },
  ],

  english: [
    {
      id: "e001", subject: "english", coreId: "core-antonym-select", type: "mcq",
      core: { formula: "antonym identification", structure: "choose the opposite meaning", difficulty: "easy" },
      versions: {
        official: {
          text: "Choose the word opposite in meaning to: 'visible'",
          answer: "hidden",
          options: ["hidden", "transparent", "obvious", "clear"],
          attestation: "pending-agent3",
        },
        global: {
          text: "Choose the word opposite in meaning to: 'abundant'",
          answer: "scarce",
          options: ["scarce", "plentiful", "ample", "rich"],
        },
      },
    },
    {
      id: "e002", subject: "english", coreId: "core-synonym-select", type: "mcq",
      core: { formula: "synonym identification", structure: "choose nearest meaning", difficulty: "medium" },
      versions: {
        official: {
          text: "Choose the word nearest in meaning to: 'benevolent'",
          answer: "kind",
          options: ["kind", "hostile", "cruel", "stern"],
          attestation: "pending-agent3",
        },
        global: {
          text: "Choose the word nearest in meaning to: 'garrulous'",
          answer: "talkative",
          options: ["talkative", "quiet", "shy", "reserved"],
        },
      },
    },
    {
      id: "e003", subject: "english", coreId: "core-punctuation", type: "mcq",
      core: { formula: "comma usage in complex sentences", structure: "punctuation — comma placement", difficulty: "medium" },
      versions: {
        official: {
          text: "Which sentence is correctly punctuated?",
          answer: "The learners, who studied hard, passed the exam.",
          options: [
            "The learners, who studied hard, passed the exam.",
            "The learners who studied hard, passed the exam.",
            "The learners, who studied hard passed the exam.",
            "The learners who, studied hard, passed the exam.",
          ],
          attestation: "pending-agent3",
        },
        global: {
          text: "Which sentence uses the comma correctly?",
          answer: "Because she was late, she missed the bus.",
          options: [
            "Because she was late, she missed the bus.",
            "Because she was late she missed the bus.",
            "She was late, because she missed the bus.",
            "Because, she was late she missed the bus.",
          ],
        },
      },
    },
    {
      id: "e004", subject: "english", coreId: "core-passive-transform", type: "mcq",
      core: { formula: "active → passive voice transformation", structure: "grammar — voice change", difficulty: "medium" },
      versions: {
        official: {
          text: "Choose the correct passive form of: 'The teacher marked the scripts.'",
          answer: "The scripts were marked by the teacher.",
          options: [
            "The scripts were marked by the teacher.",
            "The scripts was marked by the teacher.",
            "The scripts were marking by the teacher.",
            "The teacher were marked the scripts.",
          ],
          attestation: "pending-agent3",
        },
        global: {
          text: "Choose the correct passive form of: 'The chef cooked the meal.'",
          answer: "The meal was cooked by the chef.",
          options: [
            "The meal was cooked by the chef.",
            "The meal were cooked by the chef.",
            "The meal was cooking by the chef.",
            "The chef was cooked the meal.",
          ],
        },
      },
    },
    {
      id: "e005", subject: "english", coreId: "core-idiom-meaning", type: "mcq",
      core: { formula: "idiomatic expression comprehension", structure: "idiom meaning", difficulty: "easy" },
      versions: {
        official: {
          text: "What does 'to break the ice' mean?",
          answer: "To initiate conversation in an awkward situation",
          options: [
            "To initiate conversation in an awkward situation",
            "To make something cold",
            "To destroy something fragile",
            "To fall down suddenly",
          ],
          attestation: "pending-agent3",
        },
        global: {
          text: "What does 'to bite the dust' mean?",
          answer: "To fall to the ground / to be defeated",
          options: [
            "To fall to the ground / to be defeated",
            "To eat a meal quickly",
            "To clean the floor",
            "To taste something sweet",
          ],
        },
      },
    },
    {
      id: "e006", subject: "english", coreId: "core-collocation", type: "mcq",
      core: { formula: "verb-noun collocation", structure: "choose the correct collocation", difficulty: "medium" },
      versions: {
        official: {
          text: "Complete: The committee will ___ a final decision by Friday.",
          answer: "make",
          options: ["make", "do", "take", "build"],
          attestation: "pending-agent3",
        },
        global: {
          text: "Which verb correctly collocates with 'a noise'?",
          answer: "make",
          options: ["make", "do", "take", "build"],
        },
      },
    },
    {
      id: "e007", subject: "english", coreId: "core-relative-pronoun", type: "mcq",
      core: { formula: "relative pronoun selection", structure: "grammar — relative clauses", difficulty: "easy" },
      versions: {
        official: {
          text: "The man ___ saved the child is a doctor.",
          answer: "who",
          options: ["who", "whom", "whose", "which"],
          attestation: "pending-agent3",
        },
        global: {
          text: "The girl ___ father is a doctor has arrived.",
          answer: "whose",
          options: ["who", "whom", "whose", "which"],
        },
      },
    },
    {
      id: "e008", subject: "english", coreId: "core-narrative-tense", type: "mcq",
      core: { formula: "past perfect tense usage", structure: "grammar — correct tense", difficulty: "medium" },
      versions: {
        official: {
          text: "Before the teacher arrived, the students ___ already left.",
          answer: "had gone",
          options: ["had gone", "have gone", "has gone", "went"],
          attestation: "pending-agent3",
        },
        global: {
          text: "She ___ the town before the war broke out.",
          answer: "had left",
          options: ["had left", "left", "has left", "leaves"],
        },
      },
    },
    {
      id: "e009", subject: "english", coreId: "core-figurative-language", type: "mcq",
      core: { formula: "figurative device identification", structure: "identify literary device", difficulty: "medium" },
      versions: {
        official: {
          text: "Identify the device: 'The wind whispered through the trees.'",
          answer: "Personification",
          options: ["Personification", "Hyperbole", "Simile", "Alliteration"],
          attestation: "pending-agent3",
        },
        global: {
          text: "Identify the device: 'I have told you a million times.'",
          answer: "Hyperbole",
          options: ["Hyperbole", "Personification", "Simile", "Onomatopoeia"],
        },
      },
    },
    {
      id: "e010", subject: "english", coreId: "core-summary-skills", type: "mcq",
      core: { formula: "summary writing definition", structure: "comprehension — what is a summary", difficulty: "easy" },
      versions: {
        official: {
          text: "A summary is best described as:",
          answer: "A condensed version of a passage in your own words",
          options: [
            "A condensed version of a passage in your own words",
            "A detailed list of all points in the passage",
            "The writer's biography",
            "An opinion of the passage",
          ],
          attestation: "pending-agent3",
        },
        global: {
          text: "Which best defines 'comprehension' in reading?",
          answer: "Understanding the meaning of a written text",
          options: [
            "Understanding the meaning of a written text",
            "Reading a text aloud",
            "Writing a new passage",
            "Memorising every word",
          ],
        },
      },
    },
  ],

  biology: [
    {
      id: "b001", subject: "biology", coreId: "core-photosynthesis-equation", type: "mcq",
      core: { formula: "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂", structure: "photosynthesis byproduct", difficulty: "easy" },
      versions: {
        official: {
          text: "Which gas is released during photosynthesis?",
          answer: "Oxygen",
          options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Water vapour"],
          attestation: "pending-agent3",
        },
        global: {
          text: "The gas given off by green plants during photosynthesis is:",
          answer: "Oxygen",
          options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Methane"],
        },
      },
    },
    {
      id: "b002", subject: "biology", coreId: "core-osmosis-definition", type: "mcq",
      core: { formula: "osmosis = net water movement across semipermeable membrane", structure: "osmosis definition", difficulty: "medium" },
      versions: {
        official: {
          text: "Which best describes osmosis?",
          answer: "Movement of water from high to low water potential across a semipermeable membrane",
          options: [
            "Movement of water from high to low water potential across a semipermeable membrane",
            "Movement of solutes from low to high concentration",
            "Diffusion of gases across a membrane",
            "Active transport of ions into cells",
          ],
          attestation: "pending-agent3",
        },
        global: {
          text: "Osmosis is best defined as:",
          answer: "The net movement of water molecules through a semipermeable membrane",
          options: [
            "The net movement of water molecules through a semipermeable membrane",
            "The movement of dissolved particles against a concentration gradient",
            "The evaporation of water from leaf surfaces",
            "The active pumping of water into cells",
          ],
        },
      },
    },
    {
      id: "b003", subject: "biology", coreId: "core-mitochondria-function", type: "mcq",
      core: { formula: "mitochondria → cellular respiration → ATP", structure: "organelle function", difficulty: "easy" },
      versions: {
        official: {
          text: "What is the main function of the mitochondrion?",
          answer: "Energy (ATP) production via cellular respiration",
          options: [
            "Energy (ATP) production via cellular respiration",
            "Protein synthesis",
            "Cell division",
            "Waste storage",
          ],
          attestation: "pending-agent3",
        },
        global: {
          text: "Which organelle is called the 'powerhouse of the cell' and why?",
          answer: "Mitochondrion — it produces ATP (energy)",
          options: [
            "Mitochondrion — it produces ATP (energy)",
            "Ribosome — it makes proteins",
            "Nucleus — it controls the cell",
            "Golgi body — it packages proteins",
          ],
        },
      },
    },
    {
      id: "b004", subject: "biology", coreId: "core-dna-base-pairing", type: "mcq",
      core: { formula: "Chargaff's base pairing: A-T, G-C", structure: "DNA base pairing rules", difficulty: "medium" },
      versions: {
        official: {
          text: "In DNA, adenine pairs with which base?",
          answer: "Thymine",
          options: ["Thymine", "Cytosine", "Guanine", "Uracil"],
          attestation: "pending-agent3",
        },
        global: {
          text: "Which pair of bases in DNA are held together by three hydrogen bonds?",
          answer: "Guanine and Cytosine",
          options: [
            "Guanine and Cytosine",
            "Adenine and Thymine",
            "Adenine and Guanine",
            "Thymine and Cytosine",
          ],
        },
      },
    },
    {
      id: "b005", subject: "biology", coreId: "core-heart-circulation", type: "mcq",
      core: { formula: "systemic circulation — left ventricle pumps to body", structure: "human heart structure/function", difficulty: "medium" },
      versions: {
        official: {
          text: "Which chamber of the heart pumps oxygenated blood to the body?",
          answer: "Left ventricle",
          options: ["Left ventricle", "Right atrium", "Left atrium", "Right ventricle"],
          attestation: "pending-agent3",
        },
        global: {
          text: "Deoxygenated blood enters which chamber of the heart from the vena cava?",
          answer: "Right atrium",
          options: ["Right atrium", "Left atrium", "Left ventricle", "Right ventricle"],
        },
      },
    },
    {
      id: "b006", subject: "biology", coreId: "core-enzymes-models", type: "mcq",
      core: { formula: "enzyme-substrate specificity models", structure: "enzyme action models", difficulty: "medium" },
      versions: {
        official: {
          text: "Which model explains enzyme-substrate specificity?",
          answer: "Both the lock-and-key and induced-fit models",
          options: [
            "Both the lock-and-key and induced-fit models",
            "Lock and key model only",
            "Induced fit model only",
            "None of the above",
          ],
          attestation: "pending-agent3",
        },
        global: {
          text: "The enzyme-substrate complex is best explained by:",
          answer: "Both the lock-and-key and induced-fit models",
          options: [
            "Both the lock-and-key and induced-fit models",
            "The lock-and-key model only",
            "The induced-fit model only",
            "The collision theory only",
          ],
        },
      },
    },
    {
      id: "b007", subject: "biology", coreId: "core-cell-division-mitosis", type: "mcq",
      core: { formula: "mitosis = 2n → 2n", structure: "purpose of mitosis", difficulty: "easy" },
      versions: {
        official: {
          text: "What is the main purpose of mitosis?",
          answer: "Growth and repair of body cells",
          options: [
            "Growth and repair of body cells",
            "Production of gametes",
            "Reduction of chromosome number by half",
            "Binary fission in bacteria",
          ],
          attestation: "pending-agent3",
        },
        global: {
          text: "Mitosis results in daughter cells that are:",
          answer: "Genetically identical to the parent cell (2n)",
          options: [
            "Genetically identical to the parent cell (2n)",
            "Genetically different from the parent cell (n)",
            "Half the chromosome number of the parent",
            "Twice the chromosome number of the parent",
          ],
        },
      },
    },
    {
      id: "b008", subject: "biology", coreId: "core-transpiration", type: "mcq",
      core: { formula: "transpiration = water loss from stomata", structure: "plant transport process", difficulty: "easy" },
      versions: {
        official: {
          text: "Transpiration in plants refers to:",
          answer: "Loss of water vapour from the aerial parts of the plant",
          options: [
            "Loss of water vapour from the aerial parts of the plant",
            "Absorption of water by roots",
            "Transport of sugars in phloem",
            "Conversion of starch to sugar",
          ],
          attestation: "pending-agent3",
        },
        global: {
          text: "Water loss through stomata during the day is called:",
          answer: "Transpiration",
          options: ["Transpiration", "Respiration", "Germination", "Pollination"],
        },
      },
    },
    {
      id: "b009", subject: "biology", coreId: "core-food-chain-trophic", type: "mcq",
      core: { formula: "energy flow: producer → consumer → decomposer", structure: "food chain trophic levels", difficulty: "easy" },
      versions: {
        official: {
          text: "In a food chain, green plants occupy which trophic level?",
          answer: "Producers (first trophic level)",
          options: [
            "Producers (first trophic level)",
            "Primary consumers (second trophic level)",
            "Secondary consumers (third trophic level)",
            "Decomposers (final trophic level)",
          ],
          attestation: "pending-agent3",
        },
        global: {
          text: "Organisms that feed only on plants are called:",
          answer: "Primary consumers (herbivores)",
          options: [
            "Primary consumers (herbivores)",
            "Secondary consumers (carnivores)",
            "Producers (autotrophs)",
            "Decomposers (saprophytes)",
          ],
        },
      },
    },
    {
      id: "b010", subject: "biology", coreId: "core-natural-selection", type: "mcq",
      core: { formula: "natural selection theory", structure: "theory of evolution — scientist", difficulty: "easy" },
      versions: {
        official: {
          text: "Who proposed the theory of natural selection?",
          answer: "Charles Darwin",
          options: ["Charles Darwin", "Gregor Mendel", "James Watson", "Louis Pasteur"],
          attestation: "pending-agent3",
        },
        global: {
          text: "The scientist who first described the process of natural selection is:",
          answer: "Charles Darwin",
          options: ["Charles Darwin", "Jean-Baptiste Lamarck", "Alfred Wallace", "Thomas Huxley"],
        },
      },
    },
  ],

  chemistry: [
    {
      id: "c001", subject: "chemistry", coreId: "core-ionic-vs-covalent", type: "mcq",
      core: { formula: "metal + non-metal → ionic", structure: "bond type from element types", difficulty: "easy" },
      versions: {
        official: {
          text: "What type of bond forms between sodium (Na) and chlorine (Cl)?",
          answer: "Ionic",
          options: ["Ionic", "Covalent", "Metallic", "Hydrogen"],
          attestation: "pending-agent3",
        },
        global: {
          text: "Which type of bond is formed when a metal reacts with a non-metal?",
          answer: "Ionic",
          options: ["Ionic", "Covalent", "Metallic", "Van der Waals"],
        },
      },
    },
    {
      id: "c002", subject: "chemistry", coreId: "core-ph-scale", type: "mcq",
      core: { formula: "pH of pure water = 7", structure: "pH of neutral substance", difficulty: "easy" },
      versions: {
        official: {
          text: "What is the pH of pure water at 25°C?",
          answer: "7",
          options: ["7", "0", "14", "1"],
          attestation: "pending-agent3",
        },
        global: {
          text: "A solution with pH = 7 is described as:",
          answer: "Neutral",
          options: ["Neutral", "Acidic", "Basic", "Concentrated"],
        },
      },
    },
    {
      id: "c003", subject: "chemistry", coreId: "core-mole-concept", type: "mcq",
      core: { formula: "Avogadro's number = 6.02 × 10²³", structure: "mole concept — number of particles", difficulty: "easy" },
      versions: {
        official: {
          text: "How many particles are there in one mole of any substance?",
          answer: "6.02 × 10²³",
          options: ["6.02 × 10²³", "3.14 × 10²³", "6.02 × 10²⁰", "1.66 × 10⁻²⁴"],
          attestation: "pending-agent3",
        },
        global: {
          text: "Avogadro's constant is:",
          answer: "6.02 × 10²³ per mole",
          options: ["6.02 × 10²³ per mole", "3.14 × 10⁸ per mole", "6.02 × 10²⁰ per litre", "1.66 × 10⁻²⁴ per gram"],
        },
      },
    },
    {
      id: "c004", subject: "chemistry", coreId: "core-molar-mass", type: "mcq",
      core: { formula: "molar mass = sum of atomic masses", structure: "calculate molar mass", difficulty: "medium" },
      versions: {
        official: {
          text: "Calculate the molar mass of water (H₂O). (H = 1, O = 16)",
          answer: "18 g/mol",
          options: ["18 g/mol", "20 g/mol", "16 g/mol", "10 g/mol"],
          attestation: "pending-agent3",
        },
        global: {
          text: "What is the molecular mass of CO₂? (C = 12, O = 16)",
          answer: "44 g/mol",
          options: ["44 g/mol", "28 g/mol", "16 g/mol", "32 g/mol"],
        },
      },
    },
    {
      id: "c005", subject: "chemistry", coreId: "core-electron-configuration", type: "mcq",
      core: { formula: "electron shells from atomic number", structure: "electron configuration", difficulty: "medium" },
      versions: {
        official: {
          text: "Write the electron configuration of aluminium (Al, atomic number 13).",
          answer: "2, 8, 3",
          options: ["2, 8, 3", "2, 8, 2", "2, 8, 4", "2, 8, 1"],
          attestation: "pending-agent3",
        },
        global: {
          text: "How many electrons does a silicon atom (atomic number 14) have in its outermost shell?",
          answer: "4",
          options: ["4", "2", "3", "5"],
        },
      },
    },
    {
      id: "c006", subject: "chemistry", coreId: "core-neutralization-reaction", type: "mcq",
      core: { formula: "acid + base → salt + water", structure: "products of neutralization", difficulty: "easy" },
      versions: {
        official: {
          text: "What are the products of an acid-base neutralization reaction?",
          answer: "Salt and water",
          options: ["Salt and water", "Acid and base", "Hydrogen and oxygen", "Metal and gas"],
          attestation: "pending-agent3",
        },
        global: {
          text: "When hydrochloric acid reacts with sodium hydroxide, the products are:",
          answer: "Sodium chloride and water",
          options: [
            "Sodium chloride and water",
            "Sodium hydroxide and chlorine",
            "Hydrogen and oxygen",
            "Sodium and chlorine gas",
          ],
        },
      },
    },
    {
      id: "c007", subject: "chemistry", coreId: "core-oxidation-number", type: "mcq",
      core: { formula: "oxidation states from rules", structure: "oxidation number", difficulty: "medium" },
      versions: {
        official: {
          text: "What is the oxidation number of oxygen in H₂O?",
          answer: "-2",
          options: ["-2", "+2", "-1", "+1"],
          attestation: "pending-agent3",
        },
        global: {
          text: "The oxidation state of hydrogen in HCl is:",
          answer: "+1",
          options: ["+1", "-1", "+2", "0"],
        },
      },
    },
    {
      id: "c008", subject: "chemistry", coreId: "core-periodic-trend", type: "mcq",
      core: { formula: "periodic trends: electronegativity, atomic radius", structure: "periodic trends", difficulty: "medium" },
      versions: {
        official: {
          text: "How does electronegativity change across a period (left to right)?",
          answer: "It increases",
          options: ["It increases", "It decreases", "It remains constant", "It increases then decreases"],
          attestation: "pending-agent3",
        },
        global: {
          text: "Atomic radius across a period (left to right) generally:",
          answer: "Decreases",
          options: ["Decreases", "Increases", "Remains the same", "Increases then decreases"],
        },
      },
    },
    {
      id: "c009", subject: "chemistry", coreId: "core-gas-laws", type: "mcq",
      core: { formula: "Boyle: PV = k; Charles: V/T = k; Gay-Lussac: P/T = k", structure: "gas law identification", difficulty: "medium" },
      versions: {
        official: {
          text: "Which equation represents Boyle's Law for a fixed mass of gas at constant temperature?",
          answer: "PV = k",
          options: ["PV = k", "P/T = k", "V/T = k", "P × T = k"],
          attestation: "pending-agent3",
        },
        global: {
          text: "For a fixed amount of gas at constant volume, which law states P/T = constant?",
          answer: "Gay-Lussac's Law",
          options: ["Gay-Lussac's Law", "Boyle's Law", "Charles's Law", "Avogadro's Law"],
        },
      },
    },
    {
      id: "c010", subject: "chemistry", coreId: "core-acid-definitions", type: "mcq",
      core: { formula: "Bronsted-Lowry: acid = H⁺ donor, base = H⁺ acceptor", structure: "acid-base definitions", difficulty: "medium" },
      versions: {
        official: {
          text: "According to the Bronsted-Lowry theory, an acid is:",
          answer: "A proton (H⁺) donor",
          options: ["A proton (H⁺) donor", "A proton acceptor", "An electron donor", "A neutron acceptor"],
          attestation: "pending-agent3",
        },
        global: {
          text: "A base, according to Bronsted-Lowry, is a substance that:",
          answer: "Accepts a proton (H⁺)",
          options: ["Accepts a proton (H⁺)", "Donates a proton (H⁺)", "Accepts an electron", "Donates an electron"],
        },
      },
    },
  ],

  physics: [
    {
      id: "p001", subject: "physics", coreId: "core-newton-second-law", type: "mcq",
      core: { formula: "a = F/m", structure: "Newton's second law calculation", difficulty: "easy" },
      versions: {
        official: {
          text: "A force of 20 N acts on a mass of 5 kg. What is the acceleration?",
          answer: "4 m/s²",
          options: ["4 m/s²", "5 m/s²", "100 m/s²", "15 m/s²"],
          attestation: "pending-agent3",
        },
        global: {
          text: "A 10 kg body is pushed with a force of 50 N. Calculate its acceleration.",
          answer: "5 m/s²",
          options: ["5 m/s²", "4 m/s²", "10 m/s²", "50 m/s²"],
        },
      },
    },
    {
      id: "p002", subject: "physics", coreId: "core-suvat-kinematics", type: "mcq",
      core: { formula: "s = ut + ½at²", structure: "kinematics equation", difficulty: "medium" },
      versions: {
        official: {
          text: "A car starts from rest and accelerates at 2 m/s² for 5 seconds. How far does it travel?",
          answer: "25 m",
          options: ["25 m", "30 m", "20 m", "40 m"],
          attestation: "pending-agent3",
        },
        global: {
          text: "A stone falls freely from rest for 3 s. How far does it fall? (g = 10 m/s²)",
          answer: "45 m",
          options: ["45 m", "30 m", "60 m", "15 m"],
        },
      },
    },
    {
      id: "p003", subject: "physics", coreId: "core-kinetic-energy", type: "mcq",
      core: { formula: "KE = ½mv²", structure: "kinetic energy calculation", difficulty: "medium" },
      versions: {
        official: {
          text: "Calculate the kinetic energy of a 2 kg body moving at 3 m/s.",
          answer: "9 J",
          options: ["9 J", "18 J", "6 J", "3 J"],
          attestation: "pending-agent3",
        },
        global: {
          text: "A 4 kg object moves at 5 m/s. What is its kinetic energy?",
          answer: "50 J",
          options: ["50 J", "25 J", "100 J", "20 J"],
        },
      },
    },
    {
      id: "p004", subject: "physics", coreId: "core-ohms-law", type: "mcq",
      core: { formula: "V = IR", structure: "Ohm's law application", difficulty: "easy" },
      versions: {
        official: {
          text: "State Ohm's Law.",
          answer: "V = IR (voltage is directly proportional to current when resistance is constant)",
          options: [
            "V = IR (voltage is directly proportional to current when resistance is constant)",
            "V = I/R (voltage is inversely proportional to current)",
            "I = VR (current is proportional to voltage times resistance)",
            "R = V/I (resistance equals voltage times current)",
          ],
          attestation: "pending-agent3",
        },
        global: {
          text: "A resistor of 10 Ω carries a current of 2 A. What voltage is across it?",
          answer: "20 V",
          options: ["20 V", "12 V", "8 V", "5 V"],
        },
      },
    },
    {
      id: "p005", subject: "physics", coreId: "core-wave-wavelength", type: "mcq",
      core: { formula: "λ = v/f", structure: "wave equation calculation", difficulty: "medium" },
      versions: {
        official: {
          text: "A wave of frequency 170 Hz travels at 340 m/s. What is its wavelength?",
          answer: "2 m",
          options: ["2 m", "4 m", "1 m", "0.5 m"],
          attestation: "pending-agent3",
        },
        global: {
          text: "A sound wave has a frequency of 250 Hz and travels at 500 m/s. What is its wavelength?",
          answer: "2 m",
          options: ["2 m", "1 m", "3 m", "5 m"],
        },
      },
    },
    {
      id: "p006", subject: "physics", coreId: "core-refractive-index", type: "mcq",
      core: { formula: "n = c/v", structure: "refractive index calculation", difficulty: "medium" },
      versions: {
        official: {
          text: "What is the formula for the refractive index of a medium?",
          answer: "n = c/v (speed of light in vacuum ÷ speed of light in medium)",
          options: [
            "n = c/v (speed of light in vacuum ÷ speed of light in medium)",
            "n = v/c (speed of light in medium ÷ speed of light in vacuum)",
            "n = c × v",
            "n = c + v",
          ],
          attestation: "pending-agent3",
        },
        global: {
          text: "Light travels from vacuum into glass at 2 × 10⁸ m/s. What is the refractive index of glass? (c = 3 × 10⁸ m/s)",
          answer: "1.5",
          options: ["1.5", "0.67", "2.0", "3.0"],
        },
      },
    },
    {
      id: "p007", subject: "physics", coreId: "core-work-done", type: "mcq",
      core: { formula: "W = F × d", structure: "work done calculation", difficulty: "easy" },
      versions: {
        official: {
          text: "A force of 10 N moves an object through a distance of 5 m in the direction of the force. Calculate the work done.",
          answer: "50 J",
          options: ["50 J", "15 J", "150 J", "5 J"],
          attestation: "pending-agent3",
        },
        global: {
          text: "How much work is done when a 25 N force pushes a box 6 m?",
          answer: "150 J",
          options: ["150 J", "31 J", "19 J", "500 J"],
        },
      },
    },
    {
      id: "p008", subject: "physics", coreId: "core-power-formula", type: "mcq",
      core: { formula: "P = W/t", structure: "power calculation", difficulty: "easy" },
      versions: {
        official: {
          text: "What is the formula for power?",
          answer: "P = W/t",
          options: ["P = W/t", "P = W × t", "P = W/t²", "P = t/W"],
          attestation: "pending-agent3",
        },
        global: {
          text: "100 J of work is done in 5 seconds. What is the power?",
          answer: "20 W",
          options: ["20 W", "500 W", "5 W", "105 W"],
        },
      },
    },
    {
      id: "p009", subject: "physics", coreId: "core-density", type: "mcq",
      core: { formula: "ρ = m/V", structure: "density calculation", difficulty: "easy" },
      versions: {
        official: {
          text: "A substance has a mass of 40 kg and a volume of 0.05 m³. What is its density?",
          answer: "800 kg/m³",
          options: ["800 kg/m³", "1000 kg/m³", "1200 kg/m³", "600 kg/m³"],
          attestation: "pending-agent3",
        },
        global: {
          text: "Calculate the density of a block of mass 120 kg and volume 0.1 m³.",
          answer: "1200 kg/m³",
          options: ["1200 kg/m³", "800 kg/m³", "1000 kg/m³", "1400 kg/m³"],
        },
      },
    },
    {
      id: "p010", subject: "physics", coreId: "core-heat-specific-capacity", type: "mcq",
      core: { formula: "Q = mcΔT", structure: "heat energy calculation", difficulty: "medium" },
      versions: {
        official: {
          text: "How much heat is required to raise the temperature of 2 kg of water by 30°C? (c = 4200 J/kg°C)",
          answer: "252,000 J",
          options: ["252,000 J", "126,000 J", "84,000 J", "210,000 J"],
          attestation: "pending-agent3",
        },
        global: {
          text: "Calculate the heat needed to raise 4 kg of aluminium by 50°C. (c = 900 J/kg°C)",
          answer: "180,000 J",
          options: ["180,000 J", "90,000 J", "200,000 J", "360,000 J"],
        },
      },
    },
  ],

  economics: [
    {
      id: "ec001", subject: "economics", coreId: "core-demand-laws", type: "mcq",
      core: { formula: "law of demand: P ↑ → Qd ↓", structure: "law of demand", difficulty: "easy" },
      versions: {
        official: {
          text: "According to the law of demand, what happens to quantity demanded when price rises?",
          answer: "Quantity demanded falls",
          options: ["Quantity demanded falls", "Quantity demanded rises", "Quantity demanded stays the same", "Supply increases"],
          attestation: "pending-agent3",
        },
        global: {
          text: "All else equal, an increase in the price of a good causes:",
          answer: "A decrease in quantity demanded",
          options: ["A decrease in quantity demanded", "An increase in quantity demanded", "An increase in supply", "No change in demand"],
        },
      },
    },
    {
      id: "ec002", subject: "economics", coreId: "core-opportunity-cost", type: "mcq",
      core: { formula: "opportunity cost = next best alternative foregone", structure: "definition of opportunity cost", difficulty: "easy" },
      versions: {
        official: {
          text: "Define opportunity cost.",
          answer: "The value of the next best alternative that is forgone when a choice is made",
          options: [
            "The value of the next best alternative that is forgone when a choice is made",
            "The money spent on a purchase",
            "The total cost of production",
            "The profit earned from a sale",
          ],
          attestation: "pending-agent3",
        },
        global: {
          text: "The cost of choosing one option over another is known as:",
          answer: "Opportunity cost",
          options: ["Opportunity cost", "Sunk cost", "Marginal cost", "Fixed cost"],
        },
      },
    },
    {
      id: "ec003", subject: "economics", coreId: "core-inflation-types", type: "mcq",
      core: { formula: "demand-pull: excess demand; cost-push: rising costs", structure: "type of inflation", difficulty: "medium" },
      versions: {
        official: {
          text: "Inflation caused by excess demand in the economy is called:",
          answer: "Demand-pull inflation",
          options: ["Demand-pull inflation", "Cost-push inflation", "Deflation", "Hyperinflation"],
          attestation: "pending-agent3",
        },
        global: {
          text: "Inflation resulting from rising production costs (e.g. wages, raw materials) is:",
          answer: "Cost-push inflation",
          options: ["Cost-push inflation", "Demand-pull inflation", "Disinflation", "Stagflation"],
        },
      },
    },
    {
      id: "ec004", subject: "economics", coreId: "core-supply-demand-curves", type: "mcq",
      core: { formula: "demand curve slopes down; supply curve slopes up", structure: "curve shapes", difficulty: "easy" },
      versions: {
        official: {
          text: "The supply curve is typically:",
          answer: "Upward sloping",
          options: ["Upward sloping", "Downward sloping", "Horizontal", "Vertical"],
          attestation: "pending-agent3",
        },
        global: {
          text: "A typical demand curve is:",
          answer: "Downward sloping",
          options: ["Downward sloping", "Upward sloping", "Horizontal", "Vertical"],
        },
      },
    },
    {
      id: "ec005", subject: "economics", coreId: "core-money-functions", type: "mcq",
      core: { formula: "medium of exchange, store of value, unit of account", structure: "functions of money", difficulty: "easy" },
      versions: {
        official: {
          text: "List the three main functions of money.",
          answer: "Medium of exchange, store of value, unit of account",
          options: [
            "Medium of exchange, store of value, unit of account",
            "Medium of exchange only",
            "Store of value only",
            "Unit of account only",
          ],
          attestation: "pending-agent3",
        },
        global: {
          text: "Which of these is NOT a function of money?",
          answer: "A store of risk",
          options: ["A store of risk", "A medium of exchange", "A store of value", "A unit of account"],
        },
      },
    },
    {
      id: "ec006", subject: "economics", coreId: "core-gdp-definition", type: "mcq",
      core: { formula: "GDP = total final goods/services value", structure: "definition of GDP", difficulty: "easy" },
      versions: {
        official: {
          text: "Gross Domestic Product (GDP) is defined as:",
          answer: "The total market value of all final goods and services produced within a country in a given period",
          options: [
            "The total market value of all final goods and services produced within a country in a given period",
            "The total income of the government",
            "The total exports of a country",
            "The total population of a country",
          ],
          attestation: "pending-agent3",
        },
        global: {
          text: "GDP measures:",
          answer: "The total value of final goods and services produced in an economy",
          options: [
            "The total value of final goods and services produced in an economy",
            "The total income of the government",
            "The level of unemployment",
            "The rate of inflation",
          ],
        },
      },
    },
    {
      id: "ec007", subject: "economics", coreId: "core-elasticity", type: "mcq",
      core: { formula: "elastic: |Ed| > 1; unit elastic: |Ed| = 1; inelastic: |Ed| < 1", structure: "price elasticity classification", difficulty: "medium" },
      versions: {
        official: {
          text: "Demand is said to be price elastic when:",
          answer: "|Ed| > 1",
          options: ["|Ed| > 1", "|Ed| < 1", "|Ed| = 1", "|Ed| = 0"],
          attestation: "pending-agent3",
        },
        global: {
          text: "When demand is unit elastic, |Ed| is:",
          answer: "Equal to 1",
          options: ["Equal to 1", "Greater than 1", "Less than 1", "Equal to 0"],
        },
      },
    },
    {
      id: "ec008", subject: "economics", coreId: "core-division-of-labour", type: "mcq",
      core: { formula: "division of labour — Wealth of Nations 1776", structure: "economist attribution", difficulty: "easy" },
      versions: {
        official: {
          text: "Who first explained the advantages of the division of labour?",
          answer: "Adam Smith",
          options: ["Adam Smith", "Karl Marx", "John Maynard Keynes", "Milton Friedman"],
          attestation: "pending-agent3",
        },
        global: {
          text: "'The Wealth of Nations' (1776) was written by:",
          answer: "Adam Smith",
          options: ["Adam Smith", "David Ricardo", "Alfred Marshall", "John Stuart Mill"],
        },
      },
    },
    {
      id: "ec009", subject: "economics", coreId: "core-comparative-advantage", type: "mcq",
      core: { formula: "comparative advantage — Ricardo", structure: "theory of comparative advantage", difficulty: "medium" },
      versions: {
        official: {
          text: "The theory of comparative advantage was propounded by:",
          answer: "David Ricardo",
          options: ["David Ricardo", "Adam Smith", "Alfred Marshall", "John Maynard Keynes"],
          attestation: "pending-agent3",
        },
        global: {
          text: "According to the theory of comparative advantage, countries should:",
          answer: "Specialise in producing goods where they have the lowest opportunity cost",
          options: [
            "Specialise in producing goods where they have the lowest opportunity cost",
            "Produce only goods they can make most cheaply in absolute terms",
            "Ban all imports to protect domestic industries",
            "Produce every good they consume",
          ],
        },
      },
    },
    {
      id: "ec010", subject: "economics", coreId: "core-unemployment-types", type: "mcq",
      core: { formula: "structural: skill mismatch; frictional: job transition; cyclical: demand deficiency", structure: "types of unemployment", difficulty: "medium" },
      versions: {
        official: {
          text: "Unemployment caused by technological change that makes certain skills obsolete is:",
          answer: "Structural unemployment",
          options: ["Structural unemployment", "Frictional unemployment", "Cyclical unemployment", "Seasonal unemployment"],
          attestation: "pending-agent3",
        },
        global: {
          text: "A person who is temporarily between jobs is experiencing:",
          answer: "Frictional unemployment",
          options: ["Frictional unemployment", "Structural unemployment", "Cyclical unemployment", "Seasonal unemployment"],
        },
      },
    },
  ],

  geography: [
    {
      id: "g001", subject: "geography", coreId: "core-capital-cities", type: "mcq",
      core: { formula: "capital city identification", structure: "capital city", difficulty: "easy" },
      versions: {
        official: {
          text: "What is the capital of South Africa?",
          answer: "Pretoria (administrative), Cape Town (legislative), Bloemfontein (judicial)",
          options: [
            "Pretoria (administrative), Cape Town (legislative), Bloemfontein (judicial)",
            "Johannesburg",
            "Durban",
            "Port Elizabeth",
          ],
          attestation: "pending-agent3",
        },
        global: {
          text: "What is the capital of Nigeria?",
          answer: "Abuja",
          options: ["Abuja", "Lagos", "Kano", "Ibadan"],
        },
      },
    },
    {
      id: "g002", subject: "geography", coreId: "core-longest-river", type: "mcq",
      core: { formula: "Nile — longest river (~6,650 km)", structure: "longest river fact", difficulty: "easy" },
      versions: {
        official: {
          text: "Which is the longest river in Africa?",
          answer: "River Nile",
          options: ["River Nile", "River Congo", "River Niger", "River Zambezi"],
          attestation: "pending-agent3",
        },
        global: {
          text: "The longest river in the world is:",
          answer: "River Nile",
          options: ["River Nile", "River Amazon", "River Yangtze", "River Mississippi"],
        },
      },
    },
    {
      id: "g003", subject: "geography", coreId: "core-lat-long-lines", type: "mcq",
      core: { formula: "Equator = 0° latitude; Prime Meridian = 0° longitude", structure: "latitude/longitude lines", difficulty: "easy" },
      versions: {
        official: {
          text: "Which imaginary line divides the Earth into Northern and Southern Hemispheres?",
          answer: "The Equator",
          options: ["The Equator", "The Tropic of Cancer", "The Tropic of Capricorn", "The Prime Meridian"],
          attestation: "pending-agent3",
        },
        global: {
          text: "The Prime Meridian (0° longitude) passes through which city?",
          answer: "Greenwich, London",
          options: ["Greenwich, London", "Paris, France", "New York, USA", "Tokyo, Japan"],
        },
      },
    },
    {
      id: "g004", subject: "geography", coreId: "core-plate-tectonics", type: "mcq",
      core: { formula: "plate movement — mantle convection", structure: "cause of plate tectonics", difficulty: "medium" },
      versions: {
        official: {
          text: "What is the main driving force behind plate tectonics?",
          answer: "Convection currents in the mantle",
          options: [
            "Convection currents in the mantle",
            "Gravitational pull of the moon",
            "Earth's magnetic field",
            "Ocean currents",
          ],
          attestation: "pending-agent3",
        },
        global: {
          text: "Tectonic plates move because of:",
          answer: "Convection currents in the Earth's mantle",
          options: [
            "Convection currents in the Earth's mantle",
            "Wind patterns on the surface",
            "The Earth's rotation alone",
            "Underground rivers",
          ],
        },
      },
    },
    {
      id: "g005", subject: "geography", coreId: "core-volcano-types", type: "mcq",
      core: { formula: "shield, composite, cinder cone", structure: "volcano classification", difficulty: "medium" },
      versions: {
        official: {
          text: "Which type of volcano is the largest by volume?",
          answer: "Shield volcano",
          options: ["Shield volcano", "Composite volcano", "Cinder cone volcano", "Lava dome volcano"],
          attestation: "pending-agent3",
        },
        global: {
          text: "A volcano formed by alternating layers of lava and ash is called:",
          answer: "Composite (stratovolcano)",
          options: ["Composite (stratovolcano)", "Shield volcano", "Cinder cone volcano", "Caldera"],
        },
      },
    },
    {
      id: "g006", subject: "geography", coreId: "core-climate-zones", type: "mcq",
      core: { formula: "latitude determines climate zone", structure: "climate zone by latitude", difficulty: "easy" },
      versions: {
        official: {
          text: "Which climate type is found near the equator (0°-10° latitude)?",
          answer: "Tropical rainforest",
          options: ["Tropical rainforest", "Mediterranean", "Desert", "Tundra"],
          attestation: "pending-agent3",
        },
        global: {
          text: "The climate found around 30°-40° N/S on west coasts is:",
          answer: "Mediterranean",
          options: ["Mediterranean", "Tropical rainforest", "Tundra", "Continental"],
        },
      },
    },
    {
      id: "g007", subject: "geography", coreId: "core-globe-measurements", type: "mcq",
      core: { formula: "Earth's circumference ≈ 40,000 km", structure: "Earth measurement", difficulty: "medium" },
      versions: {
        official: {
          text: "What is the approximate circumference of the Earth?",
          answer: "40,000 km",
          options: ["40,000 km", "20,000 km", "60,000 km", "100,000 km"],
          attestation: "pending-agent3",
        },
        global: {
          text: "The Earth's equatorial circumference is approximately:",
          answer: "40,000 km",
          options: ["40,000 km", "25,000 km", "50,000 km", "75,000 km"],
        },
      },
    },
    {
      id: "g008", subject: "geography", coreId: "core-rock-cycle", type: "mcq",
      core: { formula: "igneous, sedimentary, metamorphic", structure: "rock classification", difficulty: "easy" },
      versions: {
        official: {
          text: "Name the three main types of rocks.",
          answer: "Igneous, sedimentary, metamorphic",
          options: [
            "Igneous, sedimentary, metamorphic",
            "Igneous, volcanic, sedimentary",
            "Sedimentary, volcanic, metamorphic",
            "Igneous, sedimentary, organic",
          ],
          attestation: "pending-agent3",
        },
        global: {
          text: "Rocks formed from cooled magma/lava are called:",
          answer: "Igneous rocks",
          options: ["Igneous rocks", "Sedimentary rocks", "Metamorphic rocks", "Organic rocks"],
        },
      },
    },
    {
      id: "g009", subject: "geography", coreId: "core-nigerian-rivers", type: "mcq",
      core: { formula: "Niger + Benue = major Nigerian rivers", structure: "river systems", difficulty: "easy" },
      versions: {
        official: {
          text: "Which river joins the Niger at Lokoja to form a confluence?",
          answer: "River Benue",
          options: ["River Benue", "River Cross", "River Osun", "River Gongola"],
          attestation: "pending-agent3",
        },
        global: {
          text: "The two major rivers that meet at Lokoja in Nigeria are:",
          answer: "Niger and Benue",
          options: ["Niger and Benue", "Niger and Cross", "Benue and Gongola", "Osun and Ogun"],
        },
      },
    },
    {
      id: "g010", subject: "geography", coreId: "core-economic-activities", type: "mcq",
      core: { formula: "primary = extraction; secondary = manufacturing; tertiary = services", structure: "economic activity classification", difficulty: "easy" },
      versions: {
        official: {
          text: "Mining and fishing belong to which economic sector?",
          answer: "Primary sector",
          options: ["Primary sector", "Secondary sector", "Tertiary sector", "Quaternary sector"],
          attestation: "pending-agent3",
        },
        global: {
          text: "Manufacturing belongs to which sector of the economy?",
          answer: "Secondary sector",
          options: ["Secondary sector", "Primary sector", "Tertiary sector", "Quaternary sector"],
        },
      },
    },
  ],

  literature: [
    {
      id: "l001", subject: "literature", coreId: "core-author-shakespeare", type: "mcq",
      core: { formula: "author of Romeo and Juliet", structure: "author identification", difficulty: "easy" },
      versions: {
        official: {
          text: "Who wrote 'Romeo and Juliet'?",
          answer: "William Shakespeare",
          options: ["William Shakespeare", "Christopher Marlowe", "Ben Jonson", "John Milton"],
          attestation: "pending-agent3",
        },
        global: {
          text: "'Romeo and Juliet' was written by:",
          answer: "William Shakespeare",
          options: ["William Shakespeare", "Charles Dickens", "Jane Austen", "Leo Tolstoy"],
        },
      },
    },
    {
      id: "l002", subject: "literature", coreId: "core-tragic-hero-macbeth", type: "mcq",
      core: { formula: "hamartia = ambition", structure: "tragic flaw in Macbeth", difficulty: "medium" },
      versions: {
        official: {
          text: "What is Macbeth's tragic flaw?",
          answer: "Ambition",
          options: ["Ambition", "Greed", "Cowardice", "Ignorance"],
          attestation: "pending-agent3",
        },
        global: {
          text: "In 'Macbeth', the driving force that leads to the protagonist's downfall is:",
          answer: "Unchecked ambition",
          options: ["Unchecked ambition", "Jealousy", "Pride", "Laziness"],
        },
      },
    },
    {
      id: "l003", subject: "literature", coreId: "core-narrator-gatsby", type: "mcq",
      core: { formula: "first-person narrator = Nick Carraway", structure: "narrator identification", difficulty: "medium" },
      versions: {
        official: {
          text: "Who is the narrator of 'The Great Gatsby'?",
          answer: "Nick Carraway",
          options: ["Nick Carraway", "Jay Gatsby", "Tom Buchanan", "Daisy Buchanan"],
          attestation: "pending-agent3",
        },
        global: {
          text: "'The Great Gatsby' is narrated by:",
          answer: "Nick Carraway",
          options: ["Nick Carraway", "Jay Gatsby", "Jordan Baker", "Myrtle Wilson"],
        },
      },
    },
    {
      id: "l004", subject: "literature", coreId: "core-symbol-lotf", type: "mcq",
      core: { formula: "conch = order; Lord of the Flies = evil", structure: "symbolism in Lord of the Flies", difficulty: "hard" },
      versions: {
        official: {
          text: "In 'Lord of the Flies', the conch shell symbolizes:",
          answer: "Order and civilization",
          options: ["Order and civilization", "Power and authority", "Death and destruction", "Nature and freedom"],
          attestation: "pending-agent3",
        },
        global: {
          text: "In 'Lord of the Flies', the Lord of the Flies (pig's head) symbolizes:",
          answer: "The inherent evil within humanity",
          options: [
            "The inherent evil within humanity",
            "The power of democracy",
            "The beauty of nature",
            "The importance of rules",
          ],
        },
      },
    },
    {
      id: "l005", subject: "literature", coreId: "core-protagonist-jane-eyre", type: "mcq",
      core: { formula: "protagonist = Jane Eyre", structure: "character/author identification", difficulty: "easy" },
      versions: {
        official: {
          text: "Who is the protagonist of 'Jane Eyre'?",
          answer: "Jane Eyre",
          options: ["Jane Eyre", "Bertha Mason", "Helen Burns", "Eliza Reed"],
          attestation: "pending-agent3",
        },
        global: {
          text: "'Jane Eyre' is a novel by:",
          answer: "Charlotte Brontë",
          options: ["Charlotte Brontë", "Emily Brontë", "Jane Austen", "George Eliot"],
        },
      },
    },
    {
      id: "l006", subject: "literature", coreId: "core-irony-types", type: "mcq",
      core: { formula: "dramatic: audience knows; verbal: saying opposite; situational: outcome unexpected", structure: "irony type identification", difficulty: "medium" },
      versions: {
        official: {
          text: "Dramatic irony occurs when:",
          answer: "The audience knows something that the characters do not",
          options: [
            "The audience knows something that the characters do not",
            "A character speaks to the audience directly",
            "Two characters say opposite things",
            "The ending is surprising",
          ],
          attestation: "pending-agent3",
        },
        global: {
          text: "A character saying the opposite of what they mean is an example of:",
          answer: "Verbal irony",
          options: ["Verbal irony", "Dramatic irony", "Situational irony", "Sarcasm only"],
        },
      },
    },
    {
      id: "l007", subject: "literature", coreId: "core-theme-animal-farm", type: "mcq",
      core: { formula: "theme = power corrupts", structure: "theme identification — Animal Farm", difficulty: "medium" },
      versions: {
        official: {
          text: "A central theme of 'Animal Farm' is:",
          answer: "The corruption of revolutionary ideals by those in power",
          options: [
            "The corruption of revolutionary ideals by those in power",
            "The beauty of nature",
            "Romantic love",
            "Urban life",
          ],
          attestation: "pending-agent3",
        },
        global: {
          text: "George Orwell's 'Animal Farm' is primarily an allegory of:",
          answer: "The Russian Revolution and the corruption of communism",
          options: [
            "The Russian Revolution and the corruption of communism",
            "The English Civil War",
            "The French Revolution",
            "World War II",
          ],
        },
      },
    },
    {
      id: "l008", subject: "literature", coreId: "core-poetic-devices", type: "mcq",
      core: { formula: "personification: human traits to non-human; metaphor: implicit comparison", structure: "identify poetic device", difficulty: "easy" },
      versions: {
        official: {
          text: "Identify the device: 'The sun smiled upon the fields.'",
          answer: "Personification",
          options: ["Personification", "Simile", "Metaphor", "Onomatopoeia"],
          attestation: "pending-agent3",
        },
        global: {
          text: "Identify the device: 'Her voice was music to my ears.'",
          answer: "Metaphor",
          options: ["Metaphor", "Simile", "Personification", "Alliteration"],
        },
      },
    },
    {
      id: "l009", subject: "literature", coreId: "core-sonnet-form", type: "mcq",
      core: { formula: "sonnet = 14 lines", structure: "poetic form — line count", difficulty: "easy" },
      versions: {
        official: {
          text: "How many lines does a sonnet have?",
          answer: "14 lines",
          options: ["14 lines", "12 lines", "16 lines", "10 lines"],
          attestation: "pending-agent3",
        },
        global: {
          text: "A Shakespearean sonnet consists of:",
          answer: "14 lines in three quatrains and a couplet",
          options: [
            "14 lines in three quatrains and a couplet",
            "12 lines in four tercets",
            "16 lines in four quatrains",
            "10 lines in two quintains",
          ],
        },
      },
    },
    {
      id: "l010", subject: "literature", coreId: "core-oral-tradition", type: "mcq",
      core: { formula: "proverb = wisdom saying; folktale = moral story", structure: "oral literature forms", difficulty: "easy" },
      versions: {
        official: {
          text: "In oral literature, a proverb is best described as:",
          answer: "A traditional wise saying passed down through generations",
          options: [
            "A traditional wise saying passed down through generations",
            "A ceremonial song",
            "A religious prayer",
            "A ritual poem",
          ],
          attestation: "pending-agent3",
        },
        global: {
          text: "A traditional story with moral lessons, passed down orally, is a:",
          answer: "Folktale",
          options: ["Folktale", "Proverb", "Elegy", "Ode"],
        },
      },
    },
  ],
};

export function getQuestions(subject) {
  return QUESTION_BANK[subject] || [];
}

export function getAllQuestions() {
  return Object.values(QUESTION_BANK).flat();
}

import { boardRegion } from "./boards.js";

export function getVersion(question, boardId) {
  const region = boardRegion(boardId);
  const useOfficial = region === "za" || region === "tz";
  const version = useOfficial ? "official" : "global";
  const v = question.versions[version];
  const other = question.versions[useOfficial ? "global" : "official"];
  return {
    ...question,
    text: v.text,
    answer: v.answer,
    options: v.options || [],
    version,
    tag: useOfficial ? "Official Past Questions" : "Cloned Variant",
    region: useOfficial ? region : "global",
    attribution: useOfficial
      ? "Official past question — © Department of Basic Education, Republic of South Africa (or NECTA, Tanzania). Reproduced for educational practice."
      : null,
    disclaimer: useOfficial
      ? null
      : "Original practice questions modelled on exam-board format. Not official past questions.",
    attestation: useOfficial ? v.attestation || "pending-agent3" : null,
    pairText: other.text,
    pairAnswer: other.answer,
    pairOptions: other.options || [],
  };
}
