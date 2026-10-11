import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };

// HIGH-YIELD SUMMARIES — Phase A of the active-recall mandate (A2, Study Expert).
// Prepends a "Rapid revision" heading + spine table to the FIRST lesson of every
// master topic (55 topics, 11 departments). Master layer = board-agnostic ("all"
// boards) — per-board deltas come in a later phase via QuestionBoardTag/TagTier.
// Idempotent: strips any previous Rapid-Revision heading/table before prepending.
// Self-healing: creates a summary-only lesson if the topic has none (flagged for
// future deep rebuild), mirroring the seeder self-heal convention.

const REV_HEAD = "⚡ Rapid revision — the 20-minute version";

const HY: Record<string, string[][]> = {
  "algebra-foundations": [
    ["Linear equations", "Balance both sides — same operation to each side, always"],
    ["Inequalities", "Solve like equations — FLIP the sign when dividing by a negative"],
    ["Quadratics", "Factor, complete the square, or the formula — discriminant decides the roots"],
    ["Functions", "f(x) notation: domain in, range out — substitute carefully"],
    ["Sequences", "nth term from the pattern; arithmetic adds, geometric multiplies"],
    ["Logarithms", "The inverse of exponentials — log rules come from index rules"],
  ],
  "geometry-trigonometry": [
    ["Coordinate geometry", "Gradient, distance, midpoint — from the two points, every time"],
    ["Circle theorems", "Angle at centre = 2× at circumference; angles in same segment equal"],
    ["SOHCAHTOA", "Label opposite/adjacent/hypotenuse FIRST — then pick the ratio"],
    ["Sine and cosine laws", "Sine law: pairs (side/angle). Cosine law: two sides + included angle"],
    ["Exact values", "30/45/60 triangles — derive them, never memorise blind"],
    ["Vectors", "Component form; magnitude by Pythagoras; parallels are scalar multiples"],
  ],
  calculus: [
    ["Derivative", "Gradient of the curve = rate of change — the limit of the gradient"],
    ["Rules", "Power rule first; chain (outside×inside′), product, quotient as needed"],
    ["Stationary points", "dy/dx = 0, then second derivative: positive = min, negative = max"],
    ["Integration", "Reverse differentiation +c; definite integral = area under the curve"],
    ["Optimisation", "Model → differentiate → set to zero → justify max/min"],
  ],
  "statistics-probability": [
    ["Averages", "Mean uses all data; median resists outliers; mode for categories"],
    ["Spread", "Range is crude; IQR resists outliers; SD uses every value"],
    ["Probability rules", "AND multiply (independent), OR add (mutually exclusive), P(not) = 1 − P"],
    ["Permutations vs combinations", "Order matters → permute; order irrelevant → combine"],
    ["Hypothesis testing", "Null until evidence: test statistic vs critical value — then conclude in CONTEXT"],
    ["Correlation", "Association is NOT causation — the third variable lurks"],
  ],
  "further-mathematics": [
    ["Matrices", "Row × column to multiply — order matters; determinant gates the inverse"],
    ["Complex numbers", "a + bi: add real/imaginary separately; multiply with i² = −1"],
    ["Modulus–argument", "Distance and direction — the complex plane view"],
    ["Polar coordinates", "(r, θ) instead of (x, y) — convert with cos/sin"],
    ["Advanced mechanics", "SHM: a is proportional to −x; projectiles split horizontal/vertical"],
  ],
  "cell-biology": [
    ["Organelles", "Nucleus = DNA; mitochondria = respiration; ribosomes = protein; chloroplasts = photosynthesis"],
    ["Membrane", "Fluid mosaic — selectively permeable, that is the whole point"],
    ["Transport", "Diffusion (down gradient), osmosis (water), active transport (ATP, against)"],
    ["Mitosis", "Growth and repair — two IDENTICAL diploid cells"],
    ["Meiosis", "Gametes — four haploid cells, variation via crossing over"],
  ],
  "bioenergetics-biochemistry": [
    ["Respiration", "Glucose + oxygen → CO₂ + water + ATP — glycolysis, Krebs, ETC"],
    ["ATP", "The energy currency — released by hydrolysis, spent by every process"],
    ["Photosynthesis", "Light reactions (ATP + NADPH) power the Calvin cycle (sugar)"],
    ["Limiting factors", "Light, CO₂, temperature — the graph flattens at the limiting one"],
    ["Enzymes", "Induced fit, optimum conditions, denaturation beyond — shape is function"],
  ],
  "genetics-molecular-biology": [
    ["DNA", "Double helix — A-T, G-C pairing; antiparallel strands"],
    ["Replication", "Semi-conservative — each new double helix keeps one parent strand"],
    ["Protein synthesis", "Transcription (DNA→mRNA) then translation (codon→amino acid)"],
    ["Inheritance", "Dominant/recessive, Punnett squares, 9:3:3:1 for dihybrids"],
    ["Mutations", "Substitution mild; insertion/deletion = frameshift — everything after shifts"],
  ],
  "human-physiology": [
    ["Digestion", "One enzyme class per food group; absorption at the villi — surface area"],
    ["Circulation", "Double loop; valves stop backflow; capillaries are the exchange point"],
    ["Breathing", "Alveoli: thin, moist, huge surface — gas exchange by diffusion"],
    ["Nervous system", "Reflex arc: receptor → sensory → relay → motor → effector; synapses chemical"],
    ["Endocrine", "Hormones in blood, slower but lasting; insulin/glucagon hold glucose at ~90"],
  ],
  "ecology-evolution": [
    ["Natural selection", "Variation → selection pressure → the adapted reproduce — populations shift"],
    ["Food chains", "Energy is LOST at each trophic level — that is why chains stay short"],
    ["Nutrient cycles", "Carbon, nitrogen, water — matter cycles, energy flows one way"],
    ["Biodiversity", "Variety = resilience; conservation protects the gene pool"],
    ["Populations", "Carrying capacity caps growth — limiting factors bite"],
  ],
  "plant-biology": [
    ["Xylem", "Water + minerals UP — the transpiration stream, powered by evaporation"],
    ["Phloem", "Sugars BOTH ways — translocation from source to sink"],
    ["Stomata", "Guard cells open/close — gas exchange vs water loss trade-off"],
    ["Auxin", "Phototropism: cells elongate on the shaded side — the shoot bends to light"],
    ["Reproduction", "Pollination → fertilisation → seed and fruit — the flower parts in order"],
  ],
  "atomic-structure-periodic-table": [
    ["The atom", "Protons + neutrons in the nucleus, electrons in shells — isotopes differ by neutrons"],
    ["Configuration", "2, 8, 8 — the outer shell decides the chemistry"],
    ["Groups", "Same valence electrons = same reactions; down a group metals get MORE reactive"],
    ["Group 1 vs 7 vs 0", "Alkali metals lose 1; halogens gain 1; noble gases need nothing"],
    ["Periodicity", "Trends across a period: atomic radius falls, ionisation energy rises"],
  ],
  "chemical-bonding": [
    ["Ionic", "Metal + non-metal, electron transfer, giant lattice — high melting point, conducts when molten"],
    ["Covalent", "Shared pairs; simple molecules low melting, no conduction — IMF weak, bonds strong"],
    ["Metallic", "Sea of delocalised electrons — conducts, malleable"],
    ["Intermolecular forces", "Always weaker than the covalent bond — hydrogen bonds are the strongest IMF"],
    ["Shapes", "VSEPR: electron pairs repel — lone pairs compress angles more"],
  ],
  "stoichiometry-mole": [
    ["The mole", "6.02 × 10²³ particles — n = mass ÷ Mr"],
    ["Gas volume", "n = volume ÷ 24 dm³ at RTP"],
    ["Concentration", "n = c × V — watch the dm³ conversion"],
    ["Empirical → molecular", "Simplest ratio first; multiply by (Mr ÷ empirical Mr)"],
    ["Limiting reagent", "The reactant that runs out first — it caps the yield"],
    ["Yield", "Actual ÷ theoretical × 100 — losses are the exam's story"],
  ],
  "thermodynamics-kinetics": [
    ["Enthalpy", "ΔH negative = exothermic (heat OUT); positive = endothermic"],
    ["Hess's law", "Route does not matter — enthalpy is a state function"],
    ["Entropy", "ΔS: disorder — gases beat liquids beat solids"],
    ["Spontaneity", "ΔG = ΔH − TΔS — negative means it goes"],
    ["Rates", "Collision theory: more energy + more frequent = faster; catalysts LOWER Ea"],
    ["Equilibrium", "Dynamic, equal rates; Le Chatelier — the system opposes the change"],
  ],
  "organic-chemistry": [
    ["Functional groups", "The group IS the chemistry: alkane, alkene, alcohol, acid, ester"],
    ["Homologous series", "Same general formula, same reactions, graded physical properties"],
    ["Isomerism", "Same formula, different structure; geometric needs the C=C lock"],
    ["Key reactions", "Combustion, substitution (alkanes), addition (alkenes), esterification"],
    ["Polymers", "Addition (C=C opens) vs condensation (small molecule expelled)"],
    ["Crude oil", "Fractional distillation by boiling point; cracking feeds the demand gap"],
  ],
  electrochemistry: [
    ["Redox", "OIL RIG — Oxidation Is Loss, Reduction Is Gain of electrons"],
    ["Oxidation numbers", "The bookkeeping that names what was oxidised"],
    ["Electrolysis", "Cathode − reduction, anode + oxidation; molten vs aqueous changes products"],
    ["Cells", "Chemical → electrical; electrons flow anode to cathode through the WIRE"],
    ["Electrode potentials", "More negative = stronger reductant — the table predicts reactions"],
  ],
  mechanics: [
    ["SUVAT", "Five equations for constant acceleration — list knowns, pick the equation"],
    ["Graphs", "Gradient = velocity (s-t) or acceleration (v-t); AREA under v-t = distance"],
    ["Newton's laws", "Inertia; F = ma; equal-opposite pairs on DIFFERENT bodies"],
    ["Energy", "W = Fd; KE = ½mv², PE = mgh — conserved minus friction"],
    ["Momentum", "p = mv, conserved in collisions — explosions too"],
    ["Circular motion", "Centripetal force = mv²/r — always TOWARD the centre"],
  ],
  "waves-optics": [
    ["Wave basics", "v = fλ; transverse oscillates perpendicular, longitudinal along"],
    ["Reflection", "Angle in = angle out; the image in a plane mirror is virtual, laterally inverted"],
    ["Refraction", "Light bends entering a denser medium (toward normal); TIR drives fibre optics"],
    ["Diffraction", "Spreading when the gap ≈ wavelength — why long waves bend round hills"],
    ["EM spectrum", "Radio → gamma by increasing frequency; uses and dangers per band"],
  ],
  "electricity-magnetism": [
    ["Current", "I = Q/t — charge flow rate; same everywhere in a series loop"],
    ["Circuits", "V = IR; series adds R, parallel: 1/R adds — share current, same V"],
    ["Power", "P = VI = I²R — the energy per second"],
    ["Magnetism", "Field lines N→S; solenoid = bar magnet you can switch"],
    ["Induction", "Changing flux induces EMF (Faraday) — generators and transformers"],
    ["Transformer", "AC only; Vp/Vs = Np/Ns; ideal: VpIp = VsIs"],
  ],
  thermodynamics: [
    ["Heat vs temperature", "Heat is energy transferred; temperature is the average kinetic energy"],
    ["Transfer", "Conduction (contact), convection (currents), radiation (no medium)"],
    ["Specific heat capacity", "Q = mcΔT — water's high c moderates climate"],
    ["Latent heat", "State changes take energy WITHOUT temperature change"],
    ["Gas laws", "Boyle (pV), Charles (V-T), pressure law → ideal gas pV = nRT"],
    ["Laws of thermodynamics", "ΔU = Q − W; entropy of an isolated system never falls"],
  ],
  "nuclear-quantum-physics": [
    ["Radiation", "Alpha (stopped by paper), beta (aluminium), gamma (lead) — charge and mass differ"],
    ["Decay equations", "Nucleon and proton numbers BALANCE — alpha loses 2p2n, beta neutron→proton"],
    ["Half-life", "Time for half to decay — repeated halving, never linear"],
    ["Fission vs fusion", "Big splits (reactors), small joins (stars) — both release E = mc²"],
    ["Photoelectric effect", "Light below threshold frequency ejects nothing — photons are quanta, E = hf"],
  ],
  "further-mechanics-fields": [
    ["SHM", "a ∝ −x, toward equilibrium; pendulum and mass-spring have fixed period formulas"],
    ["Resonance", "Driving at natural frequency maximises amplitude — damping tames it"],
    ["Gravitational fields", "g = GM/r² — inverse square; orbits are perpetual free-fall"],
    ["Electric fields", "Same inverse-square shape, but repulsion exists — compare and contrast"],
    ["Capacitance", "C = Q/V; energy stored ½CV²; charge and discharge are exponential"],
  ],
  "world-wars": [
    ["WWI causes", "MAIN: militarism, alliances, imperialism, nationalism — triggered at Sarajevo"],
    ["Trench stalemate", "Defence dominated; attrition not movement — until 1918"],
    ["Versailles", "War guilt + reparations — the resentment Hitler harvested"],
    ["WWII causes", "Appeasement failed; invasion of Poland 1939 started it"],
    ["Turning points", "Stalingrad, El Alamein, Midway, D-Day — the tide map"],
    ["Consequences", "UN founded, Europe divided — the Cold War's starting line"],
  ],
  "cold-war-era": [
    ["The divide", "Capitalism vs communism — two systems, one divided Europe"],
    ["Containment", "Truman Doctrine + Marshall Plan — stop the spread, fund the recovery"],
    ["Flashpoints", "Berlin blockade and wall; Korea; Cuba 1962 — closest to the edge"],
    ["Proxy wars", "Vietnam, Africa, Afghanistan — the superpowers never fought directly"],
    ["The end", "Gorbachev's reforms → 1989 walls fall → USSR dissolves 1991"],
  ],
  "decolonization-independence": [
    ["Why it accelerated", "WWII weakened empires; colonies had fought; UN and superpowers pressed"],
    ["Methods", "Non-violence (Gandhi, Nkrumah) and armed struggle (Mau Mau, FLN) — both worked, at different costs"],
    ["Landmarks", "India 1947; Ghana 1957 — the first sub-Saharan state; the 1960 wave"],
    ["Key figures", "Nkrumah, Kenyatta, Mandela, Lumumba — names tied to nations"],
    ["After independence", "Border problems, single-crop economies, neocolonialism — freedom was the start"],
  ],
  "regional-compulsory-history": [
    ["This topic is board-scoped", "Nigerian History (WAEC), Israeli History (Bagrut), Egyptian History (Thanaweya) — study YOUR board's track"],
    ["Nigeria (WAEC)", "Amalgamation 1914, nationalist movement, independence 1960, First Republic"],
    ["Israel (Bagrut)", "Mandate period, 1948 independence, state-building decades"],
    ["Egypt (Thanaweya)", "1952 revolution, Suez 1956, Nasser era"],
    ["Method", "Dates + causes + consequences in sequence — regional papers pay for the national story told accurately"],
  ],
  "ib-world-history": [
    ["Structure", "Prescribed topics (move to global war, rights and protest) + world history themes"],
    ["Method", "Comparative and multi-perspective — case studies from more than one region"],
    ["Essays", "Thesis first, evidence per paragraph, evaluation of perspectives throughout"],
    ["Sources", "Origin, purpose, content, value, limitation — the OPCVL discipline"],
  ],
  microeconomics: [
    ["Demand and supply", "Shifts vs movements — price moves ALONG, everything else SHIFTS"],
    ["Elasticity", "PED = %ΔQ ÷ %ΔP; inelastic → price rise raises revenue"],
    ["Market structures", "Perfect competition = price-taker; monopoly = price-maker; oligopoly interdependence"],
    ["Market failure", "Externalities misprice — government intervenes with tax, subsidy, regulation"],
    ["Surplus", "Consumer + producer surplus measure welfare — interventions shrink both"],
  ],
  macroeconomics: [
    ["GDP", "C + I + G + (X − M) — output, income and expenditure are the same flow"],
    ["Inflation", "Demand-pull vs cost-push; measured by CPI; erodes savings, hurts fixed incomes"],
    ["Unemployment", "Structural, frictional, cyclical — each needs a different cure"],
    ["Policy toolkit", "Fiscal = government spending/tax; monetary = interest rates — lean against the cycle"],
    ["Trade", "Comparative advantage; exchange rates move imports/exports — AD/AS ties it together"],
  ],
  "business-studies": [
    ["Business forms", "Sole trader → partnership → Ltd → PLC — liability and capital grow together"],
    ["Functions", "HR, marketing, operations, finance — one business, four engines"],
    ["Marketing mix", "4Ps: product, price, place, promotion — matched to the target market"],
    ["Motivation", "Taylor pays, Maslow satisfies, Herzberg maintains and motivates — theory beats guesswork"],
    ["Finance", "Cash flow ≠ profit — profitable firms die of cash starvation"],
    ["Growth", "Organic vs merger/takeover — control vs speed trade-off"],
  ],
  accounting: [
    ["The equation", "Assets = Liabilities + Capital — every transaction posts twice"],
    ["Double entry", "DEALER: debits raise expenses/assets/losses — credits the reverse"],
    ["Trial balance", "Proves arithmetic, NOT correctness — errors of principle escape"],
    ["Income statement", "Cost of sales = opening + purchases − closing stock — the subtraction is the trap"],
    ["Depreciation", "Straight-line or reducing balance — a NON-cash expense"],
    ["Adjustments", "Consumed, not paid — accruals up, prepayments down"],
    ["Ratios", "Margin on REVENUE, markup on COST; quick ratio strips stock"],
  ],
  commerce: [
    ["Definition", "Trade PLUS the aids to trade — transport, insurance, banking, warehousing, advertising"],
    ["Channels", "Each middleman adds margin AND service — bulk-breaking is the job"],
    ["Documents", "Credit note corrects; debit note challenges; bill of lading = title at sea"],
    ["Transport", "Cargo traits choose the mode — value per weight decides"],
    ["Insurance", "Indemnity: restored, never profited — average clause halves under-insured claims"],
    ["Banking", "Crossed cheques are traceable; standing orders: payer fixes the amount"],
  ],
  geography: [
    ["Four strands", "Physical, human, environmental, skills — linked, never isolated"],
    ["Landforms", "Built endogenic, worn exogenic — name the plate boundary"],
    ["Climate", "Latitude, altitude, continentality — match driver to observation"],
    ["Rivers", "Upper: vertical erosion; middle: meanders; lower: deposition — process changes downstream"],
    ["Population", "Push AND pull factors, physical AND human"],
    ["Hazards", "Cause → MATCHED management, never a generic list"],
    ["Map skills", "Convert the scale FIRST; closer contours = steeper"],
  ],
  "political-science-government": [
    ["The state", "Population, territory, government, sovereignty — state ≠ government (permanence)"],
    ["Three branches", "Legislature makes, executive implements, judiciary interprets — name the check and its target"],
    ["Rule of law", "Dicey: supremacy, equality, rights via courts — rule of law ≠ rule BY law"],
    ["Constitutions", "Written/rigid/federal axes — nominal ≠ effective"],
    ["Federalism", "Each tier supreme in its sphere — courts arbitrate disputes"],
    ["Elections", "FPTP winner-takes-seat vs PR proportional — name the trade-off"],
    ["Parties vs groups", "Parties seek power; pressure groups seek influence"],
  ],
  sociology: [
    ["The imagination", "Personal troubles → public issues — biography meets structure"],
    ["Culture", "Material + non-material; cultural lag: technology runs ahead of norms"],
    ["Socialisation", "Primary (family) then secondary (school) — particularistic → universalistic standards"],
    ["Status", "Ascribed at birth, achieved by effort; role conflict = two roles, one person"],
    ["Perspectives", "Functionalist = cohesion, Marx = conflict, interactionist = meanings, feminist = gender"],
    ["Stratification", "Caste closed, class open — mobility is the test"],
    ["Methods", "Reliable = repeatable; valid = measures the claim — correlation is not causation"],
  ],
  psychology: [
    ["Approaches", "Match claim to lens: Skinner = consequences, Freud = unconscious, biological = brain"],
    ["Learning", "Classical = association; operant = consequences — negative reinforcement RAISES behaviour"],
    ["Memory", "Sensory → STM (7±2) → LTM; retroactive interference: NEW disrupts OLD"],
    ["Development", "Piaget: stage diagnosed by the task failed — conservation marks concrete operations"],
    ["Social", "Asch = conformity, Milgram = obedience; FAE over-credits character"],
    ["Methods", "Experiments give causality; correlation never does — ethics: consent + debriefing"],
  ],
  philosophy: [
    ["Knowledge", "Justified TRUE belief — Gettier breaks the fourth condition"],
    ["Rationalism vs empiricism", "Reason vs the senses as the source — name it"],
    ["Logic", "Valid ≠ sound: structure vs truth; ad hominem attacks the person"],
    ["Ethics", "Utilitarian = outcome, Kant = duty, virtue = character — run the case through both"],
    ["Social contract", "Hobbes order, Locke rights, Rousseau general will; Rawls: the veil of ignorance"],
    ["Philosophy of religion", "Cosmological/ontological/teleological — each has its named objection; evil meets the free-will defence"],
  ],
  "religious-studies": [
    ["Method", "Phenomenological: describe each faith as its believers hold it — neutrality"],
    ["World religions", "Text + central belief + practice paired — five pillars, Four Noble Truths"],
    ["Texts", "Authority plus interpretive range — literal vs contextual"],
    ["Rites", "Rites of passage mark STATUS change — the function is the mark"],
    ["Ethics", "Source of authority: scripture, tradition, reason, conscience — the golden rule everywhere"],
    ["Society", "Durkheim cohesion, Marx opium, Weber engine — theorist with claim"],
    ["African tradition", "Supreme Being above divinities and ancestors — venerated, not worshipped as God"],
  ],
  "programming-fundamentals": [
    ["The pattern", "INPUT → PROCESS → OUTPUT — every program, every time"],
    ["Types", "Integer, real, string, boolean — '5' is TEXT, 5 is a NUMBER"],
    ["Three structures", "Sequence, selection, iteration — WHILE may run zero times"],
    ["Operators", "MOD = remainder, DIV = whole part — even/odd tests use MOD"],
    ["Functions", "Parameters in, RETURN out; locals die with the call"],
    ["Errors", "Syntax: translator refuses; runtime: crashes; logic: wrong answer — trace tables find it"],
  ],
  "data-structures-algorithms": [
    ["Choose by operations", "Array = O(1) access; linked list = O(1) insert — the access pattern decides"],
    ["Stack vs queue", "LIFO reverses; FIFO preserves — the order question"],
    ["Trees", "Balanced BST: lookup/insert/delete O(log n) — halves every step"],
    ["Hash tables", "O(1) average; collisions chained or probed"],
    ["Binary search", "Halving — ONLY on sorted data"],
    ["Big-O", "Growth rate, not machine speed — nested loops multiply: n²"],
  ],
  "computer-systems": [
    ["CPU cycle", "Fetch → decode → execute; the program counter holds the ADDRESS"],
    ["Memory hierarchy", "Fast and small at the top; RAM volatile, ROM/SSD persistent"],
    ["The OS", "Processes, memory, files, I/O — the manager between hardware and apps"],
    ["Networks", "Star topology; DNS names→IPs; HTTPS encrypts with TLS"],
    ["Security", "CIA triad — confidentiality, integrity, availability; phishing attacks people"],
    ["Binary", "Place values 128…1 — 1101₂ = 13; convert before answering"],
  ],
  databases: [
    ["Keys", "Primary: unique, never null; foreign: references a parent — junction tables solve M:N"],
    ["Queries", "SELECT-FROM-WHERE-ORDER BY — a missing WHERE on UPDATE changes EVERYTHING"],
    ["Joins", "INNER keeps matches; LEFT keeps ALL left rows — 'all customers' demands LEFT"],
    ["Aggregation", "WHERE filters rows, HAVING filters groups — aggregates live in HAVING"],
    ["Normalisation", "1NF atomic, 2NF whole-key, 3NF no transitive chains — name the dependency, then split"],
    ["ACID", "Transfer = atomicity: both legs or neither; FKs guard referential integrity"],
  ],
  "ai-emerging-tech": [
    ["Narrow vs general", "Everything today is narrow — impressive surface, one domain"],
    ["ML paradigms", "Labels? supervised. No labels? unsupervised. Rewards? reinforcement"],
    ["The pipeline", "Collect → clean → train → evaluate on UNSEEN data → deploy → monitor"],
    ["Overfitting", "Train score high, test low — memorised the noise, not the pattern"],
    ["Ethics", "Bias flows from data; confident output is not true output — verify"],
    ["Emerging tech", "Blockchain = tamper-EVIDENT; quantum = experimental; IoT's weak link = device security"],
  ],
  "visual-arts": [
    ["Elements", "Line, shape, form, colour, texture, space, value — name them where they appear"],
    ["Colour", "Complementary = opposites, analogous = neighbours — locate hues on the wheel"],
    ["Principles", "Emphasis needs its mechanism — usually contrast or isolation"],
    ["Media", "Watercolour reserves the white; prints reverse; carving is subtractive"],
    ["Perspective", "One-point linear for front-facing depth; aerial = pale and blue with distance"],
    ["Analysis", "Describe → analyse → interpret → judge — in that order, evidence throughout"],
  ],
  music: [
    ["Note values", "Each step halves; dot adds half — dotted crotchet = 1½ beats"],
    ["Time signatures", "Top = beats per bar, bottom = which value; 6/8 vs 3/4 is GROUPING"],
    ["Scales", "Major: T-T-S-T-T-T-S from the tonic — the signature is the maths"],
    ["Chords", "Major triad 4+3 semitones; minor 3+4 — the order flips the colour"],
    ["Texture", "Lines could stand alone = polyphonic; melody + chords = homophonic"],
    ["Form", "Label + bar numbers — the returns are the evidence; polyrhythm and call-and-response carry African traditions"],
  ],
  "drama-theatre": [
    ["The arc", "Climax = the irreversible turn — not the loudest scene"],
    ["Theme", "A statement, never a topic word — 'ambition destroys' not 'ambition'"],
    ["Devices", "Soliloquy = alone; dramatic irony = the audience knows more — name the knowledge gap"],
    ["Staging", "In-the-round for intimacy; proscenium for spectacle — match to demand"],
    ["Acting", "Objective → obstacle → tactic — play the subtext, not the punctuation"],
    ["Traditions", "African performance is communal and functional — it judges, teaches, celebrates"],
  ],
  "design-technology": [
    ["The cycle", "Iterative — test findings feed the next iteration; a straight line is a failed story"],
    ["Specification", "Measurable and testable — 'attractive' is not a criterion"],
    ["Research", "Percentiles, not averages — the average fits nobody at the extremes"],
    ["Materials", "Property + justification for THIS use — acrylic for rigidity, aluminium for light"],
    ["Manufacturing", "Scale decides tooling — batch uses jigs; mass automates"],
    ["Evaluation", "Criterion → result → cause → change — a to-do list for version two"],
  ],
  engineering: [
    ["Force types", "Tension pulls, compression squashes, bending does BOTH — cracks start underneath"],
    ["Levers", "Class by position: 1 fulcrum between, 2 load between, 3 effort between"],
    ["Moments", "Effort × arm = load × arm — arms measured from the FULCRUM"],
    ["Machines", "Gain force, lose distance — gear ratio = teeth ratio"],
    ["Structures", "Triangles are inherently rigid — name struts (compression) and ties (tension)"],
    ["Failure", "Fatigue kills below normal strength — cycles, corrosion, wear"],
  ],
  agriculture: [
    ["Soil", "A horizon = the fertility bank; erosion steals it first — slow the runoff"],
    ["NPK", "N leaves, P roots/flowers, K quality — high-N delays fruiting"],
    ["Rotation", "Legumes fix nitrogen AND break pest cycles — two reasons, both marks"],
    ["Propagation", "Grafting = scion fruit on rootstock roots — clones repeat the parent"],
    ["IPM", "Cultural, biological, THEN chemical — blanket spray kills the helpers"],
    ["Livestock", "Ruminants digest roughage; monogastrics need concentrates"],
    ["Gross margin", "Output − variable costs — ranks enterprises, positive ≠ profit"],
  ],
  "home-economics-food-nutrition": [
    ["Nutrients", "Seven, each with a job — the deficiency table learned cold (C scurvy, D rickets, iron anaemia)"],
    ["Balanced plate", "Half protective, quarter energy, quarter protein — over the DAY"],
    ["Cooking", "Long boiling leaches vitamins C and B — steam retains"],
    ["Safety", "Danger zone 5–60°C; cross-contamination is the classic chain"],
    ["Preservation", "Deny water, warmth, or access — one principle, many methods"],
    ["Management", "The menu plan controls nutrition AND money — plan before you buy"],
  ],
  "technical-drawing-egd": [
    ["Line types", "Thick visible, thin dimension, dashed hidden, chain centre — the alphabet"],
    ["Orthographic", "Three aligned views: front/top share width, front/side share height"],
    ["Angles", "First angle: top BELOW front; third: ABOVE — read the symbol"],
    ["Pictorial", "Isometric 30° axes communicates; orthographic defines"],
    ["Dimensioning", "Once, outside, true size — scale shrinks the drawing, never the number"],
    ["Sections", "Hatch the cut faces, drop the dashes — clarity is the point"],
  ],
  "physical-education": [
    ["Components", "Health-related (cardio, strength, endurance, flexibility) vs skill-related (agility, reaction)"],
    ["Principles", "Progressive overload, specificity, reversibility — use it or lose it"],
    ["Zones", "Max HR = 220 − age; vigorous ≈ 70–85% — compute, don't guess"],
    ["Bookends", "Warm-up DYNAMIC, cool-down STATIC — skipping trades minutes for injury"],
    ["Methods", "Interval = work with designed rest; match the method to the goal"],
    ["Injuries", "Sprain = ligament, strain = muscle; concussion: sit them out — no same-day return"],
  ],
  "health-education": [
    ["Definition", "WHO triad: physical + mental + social — one dimension is a third of it"],
    ["Hygiene", "Handwashing breaks more chains than any drug — the highest-value behaviour"],
    ["Classification", "Communicable = pathogen; NCD = lifestyle — the cause decides the prevention"],
    ["Chain of infection", "Six links — break ANY one: nets break transmission, soap breaks entry, vaccines shield the host"],
    ["NCDs", "Hypertension is SILENT — screening finds what you cannot feel"],
    ["First aid", "DRABC in order; burns get cool RUNNING water — scene safety first"],
  ],
  "life-orientation": [
    ["Goals", "SMART: specific, measurable, achievable, relevant, time-bound — 'do better' is a wish"],
    ["Refusal", "Rehearsed before needed: firm no, broken record, exit with an ally"],
    ["Relationships", "Consent: freely given, informed, reversible, specific — every time"],
    ["Rights", "Every right pairs with a responsibility — the coin has two faces"],
    ["Democracy", "Participation beyond voting — accountability is the verb; rule of law binds everyone"],
    ["Careers", "Read the qualification requirements BEFORE choosing subjects — the CV is one page, evidence-backed"],
  ],
};

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const updated: string[] = [];
    const created: string[] = [];
    const skipped: { slug: string; reason: string }[] = [];
    for (const [slug, rows] of Object.entries(HY)) {
      const topic = await prisma.topic.findFirst({ where: { slug } });
      if (!topic) {
        skipped.push({ slug, reason: "topic missing" });
        continue;
      }
      const summaryBlocks: B[] = [
        { type: "heading", level: 2, text: REV_HEAD },
        { type: "table", headers: ["Spine", "The mark"], rows },
      ];
      let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
      if (!lesson) {
        await prisma.lesson.create({
          data: { domain: "highschool", topicId: topic.id, title: "Rapid Revision", orderIndex: 0, estimatedMinutes: 20, content: { blocks: summaryBlocks } as object },
        });
        created.push(slug);
        continue;
      }
      const blocks = ((lesson.content as { blocks?: B[] } | null)?.blocks || []) as B[];
      const cleaned = blocks.filter((b) => b.type !== "heading" || b.text !== REV_HEAD).filter((b) => !(b.type === "table" && b.headers?.[0] === "Spine"));
      const newBlocks = [...summaryBlocks, ...cleaned];
      await prisma.lesson.update({ where: { id: lesson.id }, data: { content: { blocks: newBlocks } as object } });
      updated.push(slug);
    }
    return NextResponse.json({ ok: true, topic: "highyield-summaries", updated: updated.length, created: created.length, skipped });
  } catch (e) {
    console.error("seed highyield failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
