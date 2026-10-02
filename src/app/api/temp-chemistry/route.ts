import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][] };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// TEMPORARY full-chemistry batch seeder — DELETE after confirmed. Use ?only=<slug>.
const ATOMIC_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Inside the atom" },
  { type: "paragraph", text: "Atoms are mostly empty space: a tiny dense nucleus (protons + neutrons) with electrons flying in shells around it. The numbers define everything — proton number is identity, mass number is weight." },
  { type: "definition", term: "Key numbers", text: "Proton (atomic) number Z = protons = electrons in a neutral atom. Nucleon (mass) number A = protons + neutrons. Neutrons = A − Z." },
  { type: "example", text: "Sodium-23 (₁₁Na): 11 protons, 11 electrons, 12 neutrons. Lose one electron → Na⁺, the ion that salts your food and fires your nerves." },
  { type: "heading", level: 2, text: "2. Isotopes" },
  { type: "paragraph", text: "Same protons, different neutrons: carbon-12 and carbon-14 behave identically in chemistry but differ in mass and stability. Relative atomic mass is the weighted average of isotopic masses — which is why chlorine reads 35.5." },
  { type: "example", text: "Chlorine: 75% Cl-35 + 25% Cl-37 → (0.75×35) + (0.25×37) = 35.5. Show this working line and the mark is yours." },
  { type: "heading", level: 2, text: "3. Electron arrangement" },
  { type: "table", headers: ["Shell", "Max electrons", "Example"], rows: [["1", "2", "Helium 2"], ["2", "8", "Neon 2,8"], ["3", "8 (first 20 elements)", "Calcium 2,8,8,2"]] },
  { type: "paragraph", text: "Electrons fill inner shells first. The outer shell decides chemistry: 1–3 outer electrons → metals that lose them; 5–7 → non-metals that gain or share; 8 → noble, content, unreactive." },
  { type: "heading", level: 2, text: "4. The periodic table as a map" },
  { type: "paragraph", text: "Mendeleev ordered by mass and left gaps for undiscovered elements; the modern table orders by proton number. Groups (columns) share outer electrons and therefore behaviour; periods (rows) add shells." },
  { type: "table", headers: ["Trend →", "Across a period", "Down a group"], rows: [["Atomic size", "Shrinks (stronger pull)", "Grows (new shell)"], ["Reactivity (metals)", "Falls", "Rises (electron lost easily)"], ["Reactivity (non-metals)", "Rises", "Falls"]] },
  { type: "callout", variant: "warning", text: "Exam trap: state the trend AND the reason (proton pull vs shell shielding). Trend alone scores half." },
];
const ATOMIC_QS: Q[] = [
      { q: "An atom has 12 protons and 12 neutrons. Its nucleon number is", o: ["12", "14", "24", "26"], a: "24", e: "A = protons + neutrons = 12 + 12 = 24 (magnesium).", d: "easy" },
  { q: "Isotopes of an element differ in", o: ["proton number", "electron number", "neutron number", "chemical behaviour"], a: "neutron number", e: "Same Z, different neutrons; chemistry identical.", d: "easy" },
  { q: "The electronic configuration of calcium (Z=20) is", o: ["2,8,8,2", "2,8,10", "2,10,8", "2,8,2,8"], a: "2,8,8,2", e: "Fill shells: 2, 8, then 8, then 2.", d: "medium" },
  { q: "Chlorine's relative atomic mass is 35.5 because", o: ["it gains electrons easily", "it is a mixture of isotopes", "it has 35 protons", "it is diatomic"], a: "it is a mixture of isotopes", e: "Weighted average of Cl-35 and Cl-37.", d: "medium" },
  { q: "Elements in the same group have similar chemistry because they have the same", o: ["mass number", "number of shells", "number of outer electrons", "density"], a: "number of outer electrons", e: "Outer electrons govern bonding behaviour.", d: "medium" },
  { q: "Which particle has negligible mass?", o: ["Proton", "Neutron", "Electron", "Nucleus"], a: "Electron", e: "1/1840 of a proton — ignored in mass number.", d: "easy" },
  { q: "Reactivity of Group I metals increases down the group because", o: ["atoms get smaller", "outer electron is lost more easily", "protons decrease", "melting point rises"], a: "outer electron is lost more easily", e: "More shells = more shielding, weaker hold.", d: "medium" },
  { q: "Mendeleev's table left gaps for", o: ["isotopes", "undiscovered elements", "noble gases", "electrons"], a: "undiscovered elements", e: "He predicted their properties — later confirmed.", d: "medium" },
  { q: "An ion X²⁺ with electronic structure 2,8,8 comes from an atom with proton number", o: ["18", "20", "16", "22"], a: "20", e: "Lost 2 electrons from 2,8,8,2 → Z=20 (calcium).", d: "hard" },
  { q: "The mass spectrometer measures", o: ["electron shells", "isotopic masses and abundances", "melting points", "valency"], a: "isotopic masses and abundances", e: "Peak heights give the weighted average.", d: "hard" },
];

const BONDING_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Why atoms bond — the octet drive" },
  { type: "paragraph", text: "Atoms trade or share electrons to reach noble-gas stability: eight outer electrons (or two, for hydrogen and helium). How they get there decides the bond — and the bond decides every property of the substance." },
  { type: "heading", level: 2, text: "2. Ionic bonding — electron transfer" },
  { type: "paragraph", text: "Metal meets non-metal: sodium gives its outer electron to chlorine → Na⁺ and Cl⁻, oppositely charged, locked in a giant lattice. Result: high melting points, conduction only when molten or dissolved (ions free to move), brittleness." },
  { type: "example", text: "Magnesium oxide (MgO): Mg loses 2, O gains 2 → Mg²⁺O²⁻. Doubly charged ions grip harder — MgO melts near 2800°C, far above NaCl's 801°C." },
  { type: "heading", level: 2, text: "3. Covalent bonding — electron sharing" },
  { type: "paragraph", text: "Non-metals share pairs: single (H₂, Cl₂), double (O₂), triple (N₂). Sharing builds molecules — small ones (water, methane: low melting, no conduction) or giant networks (diamond, graphite, silica: rock-hard, sky-high melting)." },
  { type: "table", headers: ["", "Diamond", "Graphite"], rows: [["Bonding", "Each C bonded to 4 others, 3D network", "Layers of hexagons, weak forces between"], ["Properties", "Hardest natural material, insulator", "Soft, slippery, conducts along layers (delocalised electrons)"], ["Uses", "Cutting tools", "Pencils, electrodes, lubricants"]] },
  { type: "heading", level: 2, text: "4. Metallic bonding — the electron sea" },
  { type: "paragraph", text: "Metal ions sit in a sea of delocalised electrons: the sea carries current and heat, and lets layers slide (malleable, ductile) without shattering. Alloys (steel, brass) disrupt the layers — harder, less malleable." },
  { type: "heading", level: 2, text: "5. Between molecules — weak forces, big effects" },
  { type: "paragraph", text: "Intermolecular forces (including hydrogen bonding in water, ethanol, ammonia) are weak beside real bonds — yet they set boiling points and solubility. Small molecules melt easily because only these weak forces break; giant structures need real bonds broken." },
  { type: "callout", variant: "warning", text: "Exam trap: melting NaCl breaks the IONIC LATTICE (strong); melting ice breaks only INTERMOLECULAR forces (weak). Name the right forces." },
];
const BONDING_QS: Q[] = [
  { q: "Ionic compounds conduct electricity when", o: ["solid only", "molten or dissolved", "never", "in all states"], a: "molten or dissolved", e: "Ions must be free to move to electrodes.", d: "easy" },
  { q: "A triple covalent bond is found in", o: ["oxygen", "nitrogen", "methane", "water"], a: "nitrogen", e: "N≡N shares three pairs.", d: "easy" },
  { q: "Diamond is hard because of its", o: ["ionic lattice", "3D covalent network", "hydrogen bonds", "electron sea"], a: "3D covalent network", e: "Every carbon locked to four neighbours.", d: "medium" },
  { q: "Graphite conducts electricity due to", o: ["free ions", "delocalised electrons between layers", "protons", "neutrons"], a: "delocalised electrons between layers", e: "One electron per carbon roams each layer.", d: "medium" },
  { q: "MgO has a higher melting point than NaCl because its ions are", o: ["larger", "more highly charged", "covalent", "heavier"], a: "more highly charged", e: "2+/2− attraction dwarfs 1+/1−.", d: "medium" },
  { q: "Metals are malleable because", o: ["ions repel", "layers slide in the electron sea", "bonds break easily", "they melt low"], a: "layers slide in the electron sea", e: "Delocalised electrons re-bond instantly.", d: "medium" },
  { q: "Water has a high boiling point for its size due to", o: ["ionic bonds", "hydrogen bonding", "metallic bonds", "nuclear forces"], a: "hydrogen bonding", e: "Strong intermolecular attraction needs heat to break.", d: "medium" },
  { q: "Which pair shares the same structure type?", o: ["NaCl and diamond", "CO₂ and SiO₂", "Graphite and diamond (both carbon networks)", "Mg and water"], a: "Graphite and diamond (both carbon networks)", e: "Both giant covalent — arranged differently.", d: "hard" },
  { q: "Alloys are harder than pure metals because foreign atoms", o: ["add electrons", "disrupt sliding layers", "remove ions", "cool the metal"], a: "disrupt sliding layers", e: "Different sizes jam the slip planes.", d: "medium" },
  { q: "Iodine sublimes easily because it consists of", o: ["giant ions", "small molecules with weak forces", "free electrons", "network atoms"], a: "small molecules with weak forces", e: "Only intermolecular forces break on heating.", d: "hard" },
];

const STOICH_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. The mole — chemistry's dozen" },
  { type: "definition", term: "Mole", text: "6.02 × 10²³ particles (Avogadro's number). One mole of any substance weighs its relative formula mass in grams — the bridge between counting atoms and weighing powders." },
  { type: "example", text: "1 mole of water = 18 g = 6.02 × 10²³ molecules. 2 moles of NaOH = 80 g (Mr = 40). Moles = mass ÷ Mr — tattoo this triangle on your brain." },
  { type: "heading", level: 2, text: "2. Empirical vs molecular formulae" },
  { type: "paragraph", text: "Find % composition → divide by atomic masses → divide by smallest → whole-number ratio. That gives the empirical (simplest) formula; multiply up using the molecular mass for the true formula." },
  { type: "example", text: "A compound is 40% C, 6.7% H, 53.3% O: ÷ masses → 3.33 : 6.7 : 3.33 → ÷ smallest → 1:2:1 → CH₂O. Mr = 180 → C₆H₁₂O₆, glucose." },
  { type: "heading", level: 2, text: "3. Equations and reacting masses" },
  { type: "paragraph", text: "Balance first — moles only work on balanced equations. Convert every given mass to moles, use the equation ratio, convert back. The limiting reactant (runs out first) caps the yield." },
  { type: "example", text: "2Mg + O₂ → 2MgO. 12 g Mg = 0.5 mol → needs 0.25 mol O₂ → makes 0.5 mol MgO = 20 g. Ratio thinking, every time." },
  { type: "heading", level: 2, text: "4. Gases, solutions, titration" },
  { type: "paragraph", text: "One mole of any gas = 24 dm³ at room temperature and pressure. Solutions: moles = concentration × volume(dm³). Titrations find unknown concentrations drop by drop — indicator's first permanent colour change is the end point; repeat for concordant titres (±0.10 cm³)." },
  { type: "definition", term: "Yields", text: "Percentage yield = actual ÷ theoretical × 100 (losses in transfer, side reactions). Atom economy = useful product mass ÷ total reactant mass × 100 (green chemistry scores high)." },
  { type: "callout", variant: "warning", text: "Exam trap: convert cm³ to dm³ (÷1000) BEFORE multiplying by concentration. The single most dropped mark in titration maths." },
];
const STOICH_QS: Q[] = [
  { q: "The number of particles in one mole is", o: ["1.6 × 10⁻¹⁹", "6.02 × 10²³", "24", "12"], a: "6.02 × 10²³", e: "Avogadro's number.", d: "easy" },
  { q: "2 moles of NaOH (Mr=40) weigh", o: ["20 g", "40 g", "80 g", "42 g"], a: "80 g", e: "mass = moles × Mr = 2 × 40.", d: "easy" },
  { q: "A compound of 40% C, 6.7% H, 53.3% O has empirical formula", o: ["CHO", "CH₂O", "C₂H₄O", "CO₂"], a: "CH₂O", e: "Mole ratio 1:2:1.", d: "medium" },
  { q: "One mole of gas at r.t.p. occupies", o: ["1 dm³", "12 dm³", "24 dm³", "100 cm³"], a: "24 dm³", e: "Molar gas volume at room temp/pressure.", d: "easy" },
  { q: "25 cm³ of 2 mol/dm³ solution contains", o: ["50 mol", "0.05 mol", "0.5 mol", "5 mol"], a: "0.05 mol", e: "2 × 0.025 dm³ = 0.05.", d: "medium" },
  { q: "In 2Mg + O₂ → 2MgO, 12 g Mg (Ar=24) needs oxygen mass", o: ["8 g", "16 g", "32 g", "4 g"], a: "8 g", e: "0.5 mol Mg needs 0.25 mol O₂ = 8 g.", d: "medium" },
  { q: "Titre values are concordant when within", o: ["1.00 cm³", "0.10 cm³", "5.00 cm³", "0.01 cm³"], a: "0.10 cm³", e: "Average the concordant titres only.", d: "medium" },
  { q: "Percentage yield can exceed 100% only if", o: ["never — it indicates error or impurity", "with excess reactant", "at high temperature", "with a catalyst"], a: "never — it indicates error or impurity", e: "Actual cannot beat theoretical.", d: "medium" },
  { q: "Atom economy measures", o: ["reaction speed", "useful product mass share", "energy released", "catalyst cost"], a: "useful product mass share", e: "Green processes score high.", d: "hard" },
  { q: "The limiting reactant is the one that", o: ["costs most", "runs out first", "has biggest Mr", "is a gas"], a: "runs out first", e: "It caps the product formed.", d: "easy" },
];

const THERMO_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Energy in, energy out" },
  { type: "paragraph", text: "Breaking bonds costs energy; making bonds releases it. The balance decides everything: net release → exothermic (combustion, neutralisation, respiration); net absorb → endothermic (thermal decomposition, photosynthesis)." },
  { type: "definition", term: "Enthalpy change (ΔH)", text: "Heat change at constant pressure. Exothermic: negative ΔH (products lower). Endothermic: positive ΔH. Sign first, number second." },
  { type: "example", text: "CH₄ + 2O₂ → CO₂ + 2H₂O, ΔH = −890 kJ/mol. Burning 8 g of methane (0.5 mol) releases 445 kJ — enough to boil about 1.4 litres of water." },
  { type: "heading", level: 2, text: "2. How fast? Rates and collision" },
  { type: "paragraph", text: "Reactions need particles colliding with enough energy (activation energy). Rate rises with concentration, pressure (gases), surface area, and temperature — more frequent, harder collisions." },
  { type: "table", headers: ["Factor", "Why faster"], rows: [["Concentration/pressure", "More particles per volume → more collisions"], ["Surface area", "More exposed particles (powder beats lumps)"], ["Temperature", "More energy → more collisions beat activation energy"], ["Catalyst", "New route, lower activation energy — unused up"]] },
  { type: "example", text: "Collecting gas in a syringe over time: steep early curve flattening as reactants run out. The tangent's slope at any point IS the rate." },
  { type: "heading", level: 2, text: "3. Equilibrium — the tug of war" },
  { type: "paragraph", text: "In closed systems reversible reactions settle where forward and back rates match — concentrations steady, not equal. Disturb it and Le Chatelier predicts the shift: oppose the change." },
  { type: "table", headers: ["Disturbance", "Shift"], rows: [["↑ temperature", "Toward endothermic side"], ["↑ pressure (gases)", "Toward fewer molecules"], ["↑ concentration", "Away — consumes the added substance"], ["Catalyst", "No shift — equilibrium reached faster"]] },
  { type: "example", text: "Haber process N₂ + 3H₂ ⇌ 2NH₃ (exothermic): 450°C compromise (rate vs yield), 200 atm (fewer molecules side), iron catalyst. Every condition justified — learn the reasoning, not the numbers." },
  { type: "callout", variant: "warning", text: "Exam trap: catalysts NEVER move equilibrium or change yield — only speed. Claiming otherwise is an instant mark lost." },
];
const THERMO_QS: Q[] = [
  { q: "An exothermic reaction has ΔH that is", o: ["positive", "negative", "zero", "infinite"], a: "negative", e: "Products at lower enthalpy than reactants.", d: "easy" },
  { q: "Which is endothermic?", o: ["Combustion", "Neutralisation", "Thermal decomposition", "Respiration"], a: "Thermal decomposition", e: "Breaking down carbonates absorbs heat.", d: "easy" },
  { q: "Increasing surface area speeds reactions because", o: ["activation energy falls", "more particles exposed to collide", "temperature rises", "catalyst forms"], a: "more particles exposed to collide", e: "Powder beats lumps on collision frequency.", d: "medium" },
  { q: "A catalyst works by", o: ["raising temperature", "providing a lower-activation-energy route", "increasing concentration", "shifting equilibrium"], a: "providing a lower-activation-energy route", e: "More collisions succeed; catalyst unchanged.", d: "medium" },
  { q: "For N₂ + 3H₂ ⇌ 2NH₃, raising pressure", o: ["favours reactants", "favours ammonia", "has no effect", "stops reaction"], a: "favours ammonia", e: "4 gas molecules → 2: fewer-molecule side.", d: "medium" },
  { q: "Adding a catalyst to an equilibrium mixture", o: ["increases yield", "decreases yield", "reaches equilibrium faster, same yield", "removes products"], a: "reaches equilibrium faster, same yield", e: "Both directions speed equally.", d: "medium" },
  { q: "Burning 8 g methane (ΔH=−890 kJ/mol, Mr=16) releases", o: ["890 kJ", "445 kJ", "1780 kJ", "222 kJ"], a: "445 kJ", e: "0.5 mol × 890.", d: "medium" },
  { q: "Rate from a gas-collection graph is found from the", o: ["final volume", "slope of the tangent", "intercept", "colour change"], a: "slope of the tangent", e: "Steeper = faster at that instant.", d: "medium" },
  { q: "Haber uses 450°C rather than lower because", o: ["yield is highest", "compromise between rate and yield", "catalyst melts", "ammonia boils"], a: "compromise between rate and yield", e: "Lower favours yield but too slow.", d: "hard" },
  { q: "Raising temperature of an exothermic equilibrium", o: ["favours products", "favours reactants", "no change", "kills catalyst"], a: "favours reactants", e: "Shifts toward the endothermic (reverse) side.", d: "hard" },
];

const ORGANIC_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Carbon's superpower — catenation" },
  { type: "paragraph", text: "Carbon bonds to itself in chains, branches, and rings, with single, double, or triple bonds — so a handful of atoms builds millions of compounds. Every family shares a functional group that dictates its chemistry: the homologous series." },
  { type: "table", headers: ["Family", "Group", "Example"], rows: [["Alkanes", "C–C single", "Methane CH₄"], ["Alkenes", "C=C double", "Ethene C₂H₄"], ["Alcohols", "–OH", "Ethanol C₂H₅OH"], ["Carboxylic acids", "–COOH", "Ethanoic acid CH₃COOH"]] },
  { type: "heading", level: 2, text: "2. Alkanes — fuels" },
  { type: "paragraph", text: "Saturated (all single bonds), generally unreactive — but they burn beautifully: complete combustion → CO₂ + H₂O. Fractional distillation of crude oil sorts them by chain length: gases, petrol, diesel, bitumen." },
  { type: "callout", variant: "warning", text: "Incomplete combustion makes carbon monoxide — odourless, binds haemoglobin, kills. Every fuel-safety question wants this." },
  { type: "heading", level: 2, text: "3. Alkenes — the reactive ones" },
  { type: "paragraph", text: "The C=C double bond opens to addition reactions: bromine water decolourises (the test for unsaturation), hydrogen makes alkanes (margarine), steam makes ethanol, and self-addition makes polymers." },
  { type: "definition", term: "Polymerisation", text: "Thousands of ethene → poly(ethene): Ps (carrier bags); propene → poly(propene); chloroethene → PVC. Long chains, new properties, disposal headaches." },
  { type: "heading", level: 2, text: "4. Alcohols and acids — everyday chemistry" },
  { type: "paragraph", text: "Ethanol from fermentation (yeast, sugar, warm, no oxygen) or ethene + steam; fuels, solvents, drinks. Ethanoic acid (vinegar) reacts with alcohols → sweet-smelling esters (perfumes, flavourings) plus water." },
  { type: "example", text: "Bromine water test: orange → colourless with alkenes, stays orange with alkanes. One drop settles saturated vs unsaturated — a guaranteed practical." },
  { type: "heading", level: 2, text: "5. Isomerism — same atoms, different shape" },
  { type: "paragraph", text: "Butane vs methylpropane: same C₄H₁₀, different skeletons, different boiling points. Structural isomers multiply as chains grow — by C₆ there are five hexanes, and examiners love asking you to draw them." },
];
const ORGANIC_QS: Q[] = [
  { q: "The functional group of alcohols is", o: ["–COOH", "–OH", "C=C", "C–Cl"], a: "–OH", e: "Hydroxyl group defines the family.", d: "easy" },
  { q: "Bromine water decolourises with", o: ["alkanes", "alkenes", "water", "acids"], a: "alkenes", e: "Addition across C=C consumes bromine.", d: "easy" },
  { q: "Incomplete combustion of fuels produces", o: ["oxygen", "carbon monoxide", "hydrogen", "nitrogen"], a: "carbon monoxide", e: "Toxic, binds haemoglobin.", d: "easy" },
  { q: "Poly(ethene) is made from ethene by", o: ["combustion", "addition polymerisation", "fermentation", " cracking"], a: "addition polymerisation", e: "Double bonds open and join chains.", d: "medium" },
  { q: "Ethanol is made industrially from ethene and", o: ["oxygen", "steam", "hydrogen", "bromine"], a: "steam", e: "Hydration over a catalyst.", d: "medium" },
  { q: "Esters are formed from alcohol plus", o: ["alkane", "carboxylic acid", "alkene", "water"], a: "carboxylic acid", e: "Esterification gives sweet smells + water.", d: "medium" },
  { q: "Butane and methylpropane are", o: ["isotopes", "isomers", "polymers", "allotropes"], a: "isomers", e: "Same formula C₄H₁₀, different structure.", d: "medium" },
  { q: "Fractional distillation separates crude oil by", o: ["reactivity", "boiling point/chain length", "colour", "density only"], a: "boiling point/chain length", e: "Short chains rise highest as gases.", d: "medium" },
  { q: "Which is unsaturated?", o: ["C₃H₈", "C₂H₆", "C₂H₄", "CH₄"], a: "C₂H₄", e: "CnH2n pattern with C=C.", d: "hard" },
  { q: "Fermentation needs yeast, sugar, warmth and", o: ["oxygen", "absence of oxygen", "light", "acid"], a: "absence of oxygen", e: "Anaerobic conditions yield ethanol + CO₂.", d: "medium" },
];

const ELECTRO_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Redox — OILRIG" },
  { type: "definition", term: "OILRIG", text: "Oxidation Is Loss (of electrons); Reduction Is Gain. Oxidising agents take electrons; reducing agents give them. Track electrons and redox unravels." },
  { type: "example", text: "Mg + Cu²⁺ → Mg²⁺ + Cu: magnesium oxidised (loses 2e⁻), copper ions reduced (gain 2e⁻). Displacement is redox in disguise." },
  { type: "heading", level: 2, text: "2. Electrolysis — splitting with electricity" },
  { type: "paragraph", text: "Direct current through molten or dissolved ionic compounds: positive cations march to the cathode (gain electrons → discharged), negative anions to the anode (lose electrons). Molten lead bromide gives brown bromine at the anode, grey lead below the cathode." },
  { type: "table", headers: ["Solution electrolysed", "Cathode product", "Anode product"], rows: [["Concentrated brine", "Hydrogen", "Chlorine"], ["Dilute brine / sulfate solutions", "Hydrogen", "Oxygen"], ["Copper sulfate (Cu electrodes)", "Copper deposits", "Anode dissolves (refining copper)"]] },
  { type: "paragraph", text: "Rules of thumb: at the cathode, less-reactive metals (or hydrogen from water) discharge; at the anode, concentrated halides beat oxygen, else oxygen wins." },
  { type: "heading", level: 2, text: "3. Cells — electricity from chemistry" },
  { type: "paragraph", text: "Flip electrolysis around: a reactive metal gives electrons to a less-reactive ion and the flow IS the current. Zinc–copper cells, dry cells, and rechargeable batteries all run on reactivity gaps — bigger gap, bigger voltage." },
  { type: "example", text: "Sacrificial protection: magnesium blocks bolted to ship hulls corrode instead of the steel — deliberate, replaceable rusting that saves the ship." },
  { type: "callout", variant: "warning", text: "Exam trap: in electrolysis the ANODE is positive; in cells the signs flip by convention. Always label by electron flow, never by memorised sign." },
];
const ELECTRO_QS: Q[] = [
  { q: "OILRIG means oxidation is", o: ["gain of oxygen only", "loss of electrons", "gain of electrons", "loss of protons"], a: "loss of electrons", e: "Oxidation Is Loss; Reduction Is Gain.", d: "easy" },
  { q: "In Mg + Cu²⁺ → Mg²⁺ + Cu, copper ions are", o: ["oxidised", "reduced", "neutralised", "precipitated"], a: "reduced", e: "Cu²⁺ gains 2 electrons to Cu.", d: "easy" },
  { q: "During electrolysis, cations move to the", o: ["anode", "cathode", "battery", "beaker wall"], a: "cathode", e: "Positive ions seek the negative electrode.", d: "easy" },
  { q: "Electrolysis of concentrated brine gives at the anode", o: ["hydrogen", "oxygen", "chlorine", "sodium"], a: "chlorine", e: "Concentrated halides discharge over oxygen.", d: "medium" },
  { q: "Copper is refined using copper electrodes in copper sulfate: at the cathode", o: ["oxygen forms", "pure copper deposits", "anode dissolves", "acid forms"], a: "pure copper deposits", e: "Cu²⁺ discharges as 99.99% metal.", d: "medium" },
  { q: "A bigger voltage comes from metals with", o: ["similar reactivity", "big reactivity gap", "same mass", "bright colour"], a: "big reactivity gap", e: "Electron push grows with the gap.", d: "medium" },
  { q: "Sacrificial magnesium protects steel ships because magnesium", o: ["is waterproof", "corrodes instead of iron", "is cheaper paint", "conducts heat"], a: "corrodes instead of iron", e: "More reactive metal oxidises preferentially.", d: "medium" },
  { q: "Molten lead bromide electrolysis gives bromine at the", o: ["cathode", "anode", "furnace", "thermometer"], a: "anode", e: "Br⁻ loses electrons (oxidised) there.", d: "easy" },
  { q: "Which is a reducing agent?", o: ["Oxygen", "Chlorine", "Carbon (coke)", "Concentrated acid"], a: "Carbon (coke)", e: "Blast furnaces reduce iron ore with coke.", d: "hard" },
  { q: "Discharging hydrogen instead of sodium at the cathode happens because", o: ["sodium is very reactive", "hydrogen is a gas", "water boils", "sodium melts"], a: "sodium is very reactive", e: "Reactive metals stay dissolved; water discharges H₂.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  const only = req.nextUrl.searchParams.get("only");
  try {
    const today = new Date();
    const boards = await prisma.curriculumBoard.findMany({ select: { id: true } });
    if (!boards.length) throw new Error("No boards found");
    const topics: { slug: string; title: string; note: string; blocks: B[]; qs: Q[] }[] = [
      { slug: "atomic-structure-periodic-table", title: "Atomic Structure & Periodic Table", note: "CORE: atoms, periodicity in all 20 regions.", blocks: ATOMIC_BLOCKS, qs: ATOMIC_QS },
      { slug: "chemical-bonding", title: "Chemical Bonding", note: "CORE: bonding and structure in all 20 regions.", blocks: BONDING_BLOCKS, qs: BONDING_QS },
      { slug: "stoichiometry-mole", title: "Stoichiometry & The Mole", note: "CORE: mole calculations in all 20 regions.", blocks: STOICH_BLOCKS, qs: STOICH_QS },
      { slug: "thermodynamics-kinetics", title: "Thermodynamics & Kinetics", note: "CORE: energetics, rates, equilibrium in all 20 regions.", blocks: THERMO_BLOCKS, qs: THERMO_QS },
      { slug: "organic-chemistry", title: "Organic Chemistry", note: "CORE: homologous series in all 20 regions.", blocks: ORGANIC_BLOCKS, qs: ORGANIC_QS },
      { slug: "electrochemistry", title: "Electrochemistry", note: "CORE: redox and electrolysis in all 20 regions.", blocks: ELECTRO_BLOCKS, qs: ELECTRO_QS },
    ].filter((t) => !only || t.slug === only || t.slug.startsWith(only));
    if (!topics.length) return NextResponse.json({ error: "Unknown only=. Use atomic-structure-periodic-table|chemical-bonding|stoichiometry-mole|thermodynamics-kinetics|organic-chemistry|electrochemistry" }, { status: 400 });
    const done: Record<string, number> = {};
    for (const t of topics) {
      const topic = await prisma.topic.findFirst({ where: { slug: t.slug } });
      if (!topic) throw new Error(`Topic missing: ${t.slug}`);
      const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id } });
      if (lesson) await prisma.lesson.update({ where: { id: lesson.id }, data: { title: `${t.title} — Complete`, content: { blocks: t.blocks } as object, estimatedMinutes: 45 } });
      else await prisma.lesson.create({ data: { domain: "highschool", topicId: topic.id, title: `${t.title} — Complete`, content: { blocks: t.blocks } as object, orderIndex: 0, estimatedMinutes: 45 } });
      for (let i = 0; i < t.qs.length; i++) {
        const item = t.qs[i];
        await prisma.question.upsert({
          where: { id: `master-${t.slug}-q${i + 1}` },
          update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
          create: { id: `master-${t.slug}-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        });
      }
      for (const board of boards) {
        const existing = await prisma.topicBoardAlignment.findFirst({ where: { topicId: topic.id, boardId: board.id, trackId: null } });
        if (existing) await prisma.topicBoardAlignment.update({ where: { id: existing.id }, data: { tier: "core", verifiedDate: today, weightNotes: t.note } });
        else await prisma.topicBoardAlignment.create({ data: { topicId: topic.id, boardId: board.id, trackId: null, tier: "core", verifiedDate: today, weightNotes: t.note } });
      }
      await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today, needsVerification: false } });
      done[t.slug] = t.blocks.length;
    }
    return NextResponse.json({ ok: true, topics: done, questionsPerTopic: 10, boards: boards.length });
  } catch (e) {
    console.error("temp chemistry failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
