// Gnostiri master curriculum registry — single source of truth for the
// 3-level Study hierarchy (subjects board → subject page → topic page)
// and the global search index. Subtopics mirror international syllabi
// (WAEC/JAMB/NECO, A-Levels, AP, IB) per the approved proposal.

export interface SubjectMeta {
  slug: string;
  name: string;
  icon: string; // lucide icon name
  group: "core" | "vocational";
  topics: TopicMeta[];
}

export interface TopicMeta {
  slug: string;
  title: string;
  subtopics: string[];
}

export const SUBJECTS: SubjectMeta[] = [
  {
    slug: "mathematics",
    name: "Mathematics",
    icon: "Sigma",
    group: "core",
    topics: [
      { slug: "algebra-foundations", title: "Algebra Foundations", subtopics: ["Linear equations & inequalities", "Simultaneous equations", "Quadratics (factorising, formula, completing the square)", "Functions & graphs", "Sequences (AP/GP)", "Indices & logarithms", "Variation"] },
      { slug: "geometry-trigonometry", title: "Geometry & Trigonometry", subtopics: ["Angles & parallel lines", "Triangle congruence", "Polygons & circle theorems", "Pythagoras", "SOHCAHTOA & exact values", "Sine/cosine rules", "Coordinate geometry", "Vectors"] },
      { slug: "calculus", title: "Calculus", subtopics: ["Limits", "Differentiation rules & tangent/normal problems", "Stationary points & optimisation", "Integration & areas under curves", "Kinematics applications", "Growth/decay & differential equations"] },
      { slug: "statistics-probability", title: "Statistics & Probability", subtopics: ["Data representation", "Central tendency & dispersion", "Probability rules (AND/OR/conditional)", "Permutations & combinations", "Binomial & normal distributions", "Sampling, hypothesis testing, regression"] },
      { slug: "further-mathematics", title: "Further Mathematics", subtopics: ["Matrices & determinants", "Complex numbers & Argand diagrams", "Polar coordinates", "Advanced mechanics", "Proof techniques"] },
    ],
  },
  {
    slug: "biology",
    name: "Biology",
    icon: "Dna",
    group: "core",
    topics: [
      { slug: "cell-biology", title: "Cell Biology", subtopics: ["Microscopy & resolution", "Cell theory", "Prokaryote vs eukaryote", "Organelles", "Membranes & transport (diffusion/osmosis/active)", "Cell signalling", "Cell cycle & mitosis", "Meiosis"] },
      { slug: "bioenergetics-biochemistry", title: "Bioenergetics & Biochemistry", subtopics: ["Water, pH & buffers", "Macromolecules (carbs/lipids/proteins/nucleic acids)", "Enzymes & kinetics", "Thermodynamics & ATP", "Respiration (glycolysis→ETC, fermentation)", "Photosynthesis (light reactions, Calvin, C4/CAM)"] },
      { slug: "genetics-molecular-biology", title: "Genetics & Molecular Biology", subtopics: ["DNA structure & replication", "Transcription & translation", "Mutations", "Mendelian genetics & Punnett analysis", "Extensions (codominance, multiple alleles, sex-linkage)", "Biotechnology"] },
      { slug: "human-physiology", title: "Human Physiology", subtopics: ["Digestion", "Circulation", "Gas exchange", "Nervous coordination & reflexes", "Hormonal control", "Homeostasis & excretion"] },
      { slug: "ecology-evolution", title: "Ecology & Evolution", subtopics: ["Evidence & selection modes", "Hardy–Weinberg", "Speciation & phylogenetics", "Population dynamics & behaviour", "Communities & niches", "Energy flow & biogeochemical cycles", "Conservation & HIPPCO"] },
      { slug: "plant-biology", title: "Plant Biology", subtopics: ["Transport (transpiration, translocation)", "Tropisms & hormones", "Pollination & fertilisation", "Germination & seed dispersal"] },
    ],
  },
  {
    slug: "chemistry",
    name: "Chemistry",
    icon: "FlaskConical",
    group: "core",
    topics: [
      { slug: "atomic-structure-periodic-table", title: "Atomic Structure & Periodic Table", subtopics: ["Atomic models", "Isotopes & RAM", "Electron configuration", "Periodic trends", "Group chemistry (I, VII, 0, transition)"] },
      { slug: "chemical-bonding", title: "Chemical Bonding", subtopics: ["Ionic", "Covalent (simple & giant)", "Metallic", "Intermolecular forces", "Molecular shapes", "Polarity"] },
      { slug: "stoichiometry-mole", title: "Stoichiometry & The Mole", subtopics: ["Mole concept", "Empirical/molecular formulae", "Reacting masses & limiting reagents", "Gas volumes", "Solutions & titration", "Yield & atom economy"] },
      { slug: "thermodynamics-kinetics", title: "Thermodynamics & Kinetics", subtopics: ["Exo/endothermic & bond energy", "Collision theory & rate factors", "Catalysts", "Equilibrium & Le Chatelier", "Industrial applications (Haber)"] },
      { slug: "organic-chemistry", title: "Organic Chemistry", subtopics: ["Nomenclature", "Alkanes & combustion", "Alkenes & addition", "Alcohols", "Acids & esters", "Polymers", "Isomerism", "Qualitative analysis"] },
      { slug: "electrochemistry", title: "Electrochemistry", subtopics: ["Redox & oxidation numbers", "Electrolysis (rules, brine, copper refining)", "Electrochemical cells", "Corrosion & protection"] },
    ],
  },
  {
    slug: "physics",
    name: "Physics",
    icon: "Atom",
    group: "core",
    topics: [
      { slug: "mechanics", title: "Mechanics", subtopics: ["Kinematics & motion equations", "Newton's laws", "Work, energy, power", "Momentum & impulse", "Circular motion", "Projectiles"] },
      { slug: "waves-optics", title: "Waves & Optics", subtopics: ["Wave properties (v=fλ)", "Reflection & refraction", "Diffraction & interference", "Sound & echoes", "EM spectrum", "Lenses"] },
      { slug: "electricity-magnetism", title: "Electricity & Magnetism", subtopics: ["Static charge & fields", "Circuits (series/parallel)", "Ohm's law & resistivity", "Magnetism & electromagnets", "Induction & transformers", "Mains safety"] },
      { slug: "thermodynamics", title: "Thermodynamics", subtopics: ["Temperature vs heat & expansion", "Kinetic theory & gas laws", "Three laws of thermodynamics", "Heat transfer"] },
      { slug: "nuclear-quantum-physics", title: "Nuclear & Quantum Physics", subtopics: ["Radioactivity (α/β/γ)", "Half-life & dating", "Fission & fusion", "E=mc²", "Photoelectric effect & photons"] },
      { slug: "further-mechanics-fields", title: "Further Mechanics & Fields", subtopics: ["SHM", "Damping & resonance", "Gravitation & satellites", "Electric fields", "Capacitance"] },
    ],
  },
  {
    slug: "history",
    name: "History",
    icon: "Landmark",
    group: "core",
    topics: [
      { slug: "world-wars", title: "World Wars I & II", subtopics: ["WWI causes (MAIN)", "Trench warfare & Versailles", "Interwar instability", "WWII causes & campaigns", "Holocaust", "Post-war settlement"] },
      { slug: "cold-war-era", title: "Cold War Era", subtopics: ["Origins & containment", "Berlin", "Korea, Cuba, Vietnam", "Détente", "Soviet collapse", "Proxy wars in Africa/Asia"] },
      { slug: "decolonization-independence", title: "Decolonization & Independence", subtopics: ["South Asia", "West Africa (Ghana, Nigeria)", "East & Southern Africa", "Apartheid & its end", "Legacies"] },
      { slug: "regional-compulsory-history", title: "Regional Compulsory History", subtopics: ["Nigerian history (Sokoto Caliphate → civil war)", "Israeli history (Zionism → peace processes)", "Egyptian history (Muhammad Ali → Nasser)"] },
      { slug: "ib-world-history", title: "IB World History", subtopics: ["Move to global war", "Rights & protest", "Conflicts & intervention", "Source analysis"] },
    ],
  },
  {
    slug: "business-economics-accounting",
    name: "Business, Economics & Accounting",
    icon: "Briefcase",
    group: "core",
    topics: [
      { slug: "microeconomics", title: "Microeconomics", subtopics: ["Scarcity & PPC", "Demand & supply", "Elasticity", "Market structures", "Market failure"] },
      { slug: "macroeconomics", title: "Macroeconomics", subtopics: ["GDP & national income", "Inflation & unemployment", "Fiscal & monetary policy", "Trade & exchange rates", "Development"] },
      { slug: "business-studies", title: "Business Studies", subtopics: ["Ownership forms", "Management functions", "Marketing mix", "Operations", "Finance & HR"] },
      { slug: "accounting", title: "Accounting", subtopics: ["Double entry", "Final accounts", "Ratios", "Costing", "Control & reconciliation"] },
      { slug: "commerce", title: "Commerce", subtopics: ["Home & foreign trade", "Distribution channels", "Documents", "Banking & insurance", "Transport & warehousing"] },
    ],
  },
  {
    slug: "humanities-social-sciences",
    name: "Humanities & Social Sciences",
    icon: "Globe2",
    group: "core",
    topics: [
      { slug: "geography", title: "Geography", subtopics: ["Plate tectonics & landforms", "Rivers & coasts", "Weather & climate", "Population & settlement", "Economic geography", "Environmental management & GIS"] },
      { slug: "political-science-government", title: "Political Science / Government", subtopics: ["Constitutions", "Organs of government", "Separation of powers", "Parties & elections", "International organisations"] },
      { slug: "sociology", title: "Sociology", subtopics: ["Perspectives", "Culture & socialisation", "Stratification", "Institutions", "Research methods"] },
      { slug: "psychology", title: "Psychology", subtopics: ["Biological bases", "Memory & cognition", "Development", "Social influence", "Abnormal psychology", "Research methods"] },
      { slug: "philosophy", title: "Philosophy", subtopics: ["Logic", "Epistemology", "Ethics", "Metaphysics", "Key thinkers"] },
      { slug: "religious-studies", title: "Religious Studies", subtopics: ["Christianity", "Islam", "African traditional religion", "World religions overview", "Ethics", "Sacred texts"] },
    ],
  },
  {
    slug: "computer-science-ict",
    name: "Computer Science & ICT",
    icon: "Cpu",
    group: "core",
    topics: [
      { slug: "programming-fundamentals", title: "Programming Fundamentals", subtopics: ["Data types & variables", "Control structures", "Functions", "Arrays & strings", "Files", "Pseudocode & flowcharts"] },
      { slug: "data-structures-algorithms", title: "Data Structures & Algorithms", subtopics: ["Stacks, queues, trees, graphs", "Searching & sorting", "Complexity", "Recursion", "Design strategies"] },
      { slug: "computer-systems", title: "Computer Systems", subtopics: ["CPU & memory", "Operating systems", "Networks & protocols", "Cybersecurity", "Binary & logic gates"] },
      { slug: "databases", title: "Databases", subtopics: ["Relational model & ER diagrams", "SQL", "Normalisation", "Transactions & security"] },
      { slug: "ai-emerging-tech", title: "AI & Emerging Tech", subtopics: ["Machine learning fundamentals", "Neural networks", "NLP & LLMs", "AI ethics", "Robotics & IoT"] },
    ],
  },
  {
    slug: "arts-design",
    name: "Arts & Design",
    icon: "Palette",
    group: "vocational",
    topics: [
      { slug: "visual-arts", title: "Visual Arts", subtopics: ["Elements & principles", "Drawing & colour theory", "Painting media", "Sculpture & ceramics", "Art history", "Digital art"] },
      { slug: "music", title: "Music", subtopics: ["Theory & notation", "Rhythm & harmony", "Instruments", "Genres & history", "Performance & composition"] },
      { slug: "drama-theatre", title: "Drama & Theatre", subtopics: ["Acting technique", "Stagecraft", "Script analysis", "Theatre history", "Directing"] },
      { slug: "design-technology", title: "Design & Technology", subtopics: ["Design process", "Materials & safety", "Graphics & CAD", "Electronics basics", "Prototyping"] },
    ],
  },
  {
    slug: "technical-vocational",
    name: "Technical & Vocational",
    icon: "Wrench",
    group: "vocational",
    topics: [
      { slug: "engineering", title: "Engineering", subtopics: ["Levers, pulleys, gears", "Materials science", "Electrical fundamentals", "Workshop practice & safety"] },
      { slug: "agriculture", title: "Agriculture", subtopics: ["Soil science", "Crop production", "Animal husbandry", "Machinery", "Agribusiness"] },
      { slug: "home-economics-food-nutrition", title: "Home Economics / Food & Nutrition", subtopics: ["Nutrients", "Meal planning & budgeting", "Food hygiene & preservation", "Textiles", "Home management"] },
      { slug: "technical-drawing-egd", title: "Technical Drawing / EGD", subtopics: ["Instruments & standards", "Orthographic projection", "Pictorials", "Dimensioning", "CAD"] },
    ],
  },
  {
    slug: "physical-education-health",
    name: "Physical Education & Health",
    icon: "HeartPulse",
    group: "vocational",
    topics: [
      { slug: "physical-education", title: "Physical Education", subtopics: ["Anatomy & movement", "Fitness & training principles", "Sports skills & rules", "Sports psychology"] },
      { slug: "health-education", title: "Health Education", subtopics: ["Nutrition", "Hygiene", "Disease prevention", "First aid", "Mental health", "Substance abuse"] },
      { slug: "life-orientation", title: "Life Orientation", subtopics: ["Self & values", "Relationships", "Careers & study skills", "Citizenship", "Human rights"] },
    ],
  },
];

export const TOPIC_INDEX: Map<string, { topic: TopicMeta; subject: SubjectMeta }> = (() => {
  const m = new Map<string, { topic: TopicMeta; subject: SubjectMeta }>();
  for (const subject of SUBJECTS) for (const topic of subject.topics) m.set(topic.slug, { topic, subject });
  return m;
})();

export function isSubject(slug: string): boolean {
  return SUBJECTS.some((s) => s.slug === slug);
}

export function subjectBySlug(slug: string): SubjectMeta | undefined {
  return SUBJECTS.find((s) => s.slug === slug);
}

export function topicBySlug(slug: string): { topic: TopicMeta; subject: SubjectMeta } | undefined {
  return TOPIC_INDEX.get(slug);
}

export function allTopicSlugs(): string[] {
  return Array.from(TOPIC_INDEX.keys());
}

export function neighbours(subjectSlug: string, topicSlug: string): { prev?: TopicMeta; next?: TopicMeta } {
  const subject = subjectBySlug(subjectSlug);
  if (!subject) return {};
  const i = subject.topics.findIndex((t) => t.slug === topicSlug);
  if (i < 0) return {};
  return { prev: subject.topics[i - 1], next: subject.topics[i + 1] };
}
