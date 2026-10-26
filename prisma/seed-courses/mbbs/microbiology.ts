import { prisma, seedMbbsCourse, type SubjectSeed } from "./spine";
import type { LessonContent } from "@/types/lesson";

/**
 * MIC 201 — Medical Microbiology (AIIMS para-clinical, semesters III–V).
 *
 * Modules 1–3 are authored in full in the pilot-report format — outcomes,
 * prerequisites, big idea, explanation with tables, worked examples, common
 * mistakes, check questions, MCQs and summary:
 *
 *   M1 General bacteriology & genetic: bacterial cell structure, growth and
 *     cultivation, bacterial genetics and mutation, and antimicrobial
 *     susceptibility testing (4 lessons)
 *   M2 Immunity & immunodiagnosis: innate immunity, humoral adaptive immunity,
 *     cell-mediated adaptive immunity, antigen–antibody reactions, and vaccines
 *     and immunisation (5 lessons)
 *   M3 Virology, mycology & parasitology: general virology, DNA viruses, RNA
 *     viruses, medical mycology, protozoan and helminth parasites (6 lessons)
 *
 * Modules 4–5 (sterilisation & hospital infection control, system-based
 * infections) ship as a real concept spine and prerequisite DAG with
 * tracked-placeholder lessons — the structure a human author needs, not thin
 * stubs pretending to be a course. Only authored lessons reach the database;
 * placeholders stay in the seed source as the authoring queue.
 */

const PLACEHOLDER: LessonContent = { blocks: [] };

// ---------------------------------------------------------------------------
// LESSON 1 — Bacterial cell structure (fully authored)
// ---------------------------------------------------------------------------
function lesson1() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: distinguish Gram-positive from Gram-negative envelope architecture and predict how a given organism will stain; describe peptidoglycan, the outer membrane and lipopolysaccharide, and name the drug classes that target each; list the surface structures (capsule, flagella, pili, biofilm) with their contribution to virulence; explain why endospores survive sterilisation and what that means for hospital practice; and recognise the exceptions — Mycoplasma has no wall, mycobacteria are acid-fast — that change both staining and treatment.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "None. This is the opening lesson of the course and assumes only the cell biology taught in the preceding semester: membranes, ribosomes, nucleic acids, and the principle that a drug can be selectively toxic to a bacterium because it attacks a structure the human cell does not have.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Bacterial cell envelope",
        text: "The layered barrier that encloses a bacterial cell: from inside out, the cytoplasmic (cell) membrane, the peptidoglycan cell wall, and — in Gram-negative organisms only — an outer membrane. Everything that decides how a bacterium stains, where it can live in the body, and which antibiotics will kill it is a property of this envelope.",
      },
      {
        type: "paragraph",
        text: "A human cell is a floppy lipid bag with no wall, so it can protect itself only behind skin or mucosa. A bacterium faces a hostile world with no such cover, and its answer is a rigid exoskeleton. That exoskeleton does two jobs at once: it holds the cell shape against a turgor pressure several times atmospheric, and it lets the cell keep a concentrated internal chemistry while sitting in dilute fluid. The trade-off is exposure — a wall is a surface, and every surface is something an antibiotic or a bacteriophage can attack.",
      },
      {
        type: "paragraph",
        text: "Gram stain behaviour is not a labelling convention dreamt up to torment students; it is a direct readout of the envelope. The moment a bacterium takes crystal violet and iodine differently from its neighbour, it is telling you whether it has an outer membrane. That single architectural fact is why vancomycin cannot cross the outer membrane of Escherichia coli, why polymyxins spare Gram-positive cocci, and why Neisseria meningitidis bleeds endotoxin as it is killed.",
      },

      { type: "heading", level: 2, text: "The Gram stain is a physical test" },
      {
        type: "paragraph",
        text: "The stain is a four-step experiment in permeability and retention. Crystal violet penetrates every cell; iodine binds it inside the cell into a large crystal violet–iodine complex; the decolouriser — acetone–alcohol — is a lipid solvent; and safranin stains everything a dull red so that decolourised cells stay visible. Whether a cell keeps the purple complex depends on whether the decolouriser can get in and wash it out again.",
      },
      {
        type: "table",
        headers: ["Feature", "Gram-positive (e.g. Staph aureus, Streptococcus pyogenes)", "Gram-negative (e.g. E. coli, Klebsiella, Neisseria, Pseudomonas)"],
        rows: [
          ["Peptidoglycan thickness", "Thick, 20–80 nm, up to 40 interlinked layers", "Thin, 2–7 nm, 1–2 layers"],
          ["Outer membrane", "Absent", "Present, with lipopolysaccharide in the outer leaflet"],
          ["Teichoic and lipoteichoic acids", "Present, up to half the wall dry weight", "Absent"],
          ["Periplasm", "Little or none", "Prominent, with enzymes and nutrient-binding proteins"],
          ["Decolouriser effect", "Dehydrates and shrinks the thick wall, trapping the crystal violet–iodine complex", "Dissolves the outer membrane and strips the thin wall, so the complex leaches out"],
          ["Final appearance", "Purple / blue", "Pink / red, counterstained with safranin"],
          ["Typical examples", "Staphylococci, streptococci, enterococci, Bacillus, Clostridium, Listeria", "Enterobacteriaceae, Neisseria, Haemophilus, Pseudomonas, Vibrio, Bacteroides"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Gram stains have traps. Organisms that are old, over-decolourised, or antibiotic-treated lose the crystal violet and stain pink even when they are truly Gram-positive; Gram-negatives that are under-decolourised can look Gram-positive. Mycobacteria will not hold either stain at all, and Neisseria gonorrhoeae — a Gram-negative diplococcus — is so fastidious that the smear is often reported before a culture grows.",
      },

      { type: "heading", level: 2, text: "Peptidoglycan: the wall as an antibiotic target" },
      {
        type: "paragraph",
        text: "Peptidoglycan is one enormous molecule per cell — a chain-mail of alternating N-acetylglucosamine and N-acetylmuramic sugars cross-linked by short peptide stems. Each stem ends in D-alanyl-D-alanine, and the cross-link is made by a transpeptidase, the penicillin-binding protein (PBP). Because human cells make no peptidoglycan at all, the whole pathway is selectively toxic, which is why it is the richest seam in antibacterial pharmacology.",
      },
      {
        type: "table",
        headers: ["Drug class", "Step of wall synthesis attacked", "Consequence"],
        rows: [
          ["Beta-lactams (penicillins, cephalosporins, carbapenems, monobactams)", "Transpeptidation: PBP-mediated cross-linking of peptide stems", "The wall loses tensile strength, autolysins finish the job, and the cell lyses in a hypotonic environment"],
          ["Glycopeptides (vancomycin, teicoplanin)", "Binding of the terminal D-Ala-D-Ala substrate", "Stems cannot be laid down; the molecule is too large to cross the outer membrane, so activity is essentially confined to Gram-positives"],
          ["Fosfomycin, cycloserine, bacitracin", "Early cytoplasmic steps of muramyl-peptide assembly", "Precursor supply fails; bacitracin is topical only because of systemic toxicity"],
          ["Polymyxins (colistin, polymyxin B)", "The outer membrane of Gram-negatives — disrupts lipid A", "A leaky membrane; no useful Gram-positive activity"],
        ],
      },
      {
        type: "paragraph",
        text: "This is why a Gram-negative cell resists vancomycin: the drug cannot reach its target. The porin channels of the outer membrane admit molecules below roughly 600 Da, and vancomycin is about 1,450 Da. Conversely, polymyxins attack a structure that Gram-positive organisms do not possess. Beta-lactams act on both groups, because their target lies beneath the outer membrane and they enter through the porins.",
      },

      { type: "heading", level: 2, text: "The Gram-negative outer membrane" },
      {
        type: "paragraph",
        text: "The outer membrane is an asymmetric lipid bilayer: phospholipid in the inner leaflet, lipopolysaccharide exclusively in the outer one. Nutrients and most antibiotics diffuse through porin channels — OmpF and OmpC in E. coli — which sit as trimers; loss of a specific porin is a respectable resistance mechanism. The integrity of the layer depends on divalent cations bridging adjacent LPS molecules, which is why the chelator EDTA destabilises it and why magnesium is added to some media.",
      },
      {
        type: "definition",
        term: "Lipopolysaccharide (endotoxin)",
        text: "A three-part molecule: the lipid A anchor, which is the toxic portion; a core oligosaccharide; and repeating O-antigen side chains. Lipid A is a potent macrophage activator and pyrogen, and is responsible for the fever, hypotension, disseminated intravascular coagulation and multi-organ failure of septic shock.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Endotoxin, not the bacterium itself, is what kills in Gram-negative sepsis. When ceftriaxone lyses Neisseria meningitidis in cerebrospinal fluid, the released lipid A can worsen the clinical picture within the hour — the empirical reason adrenaline-ready resuscitation accompanies the antibiotics rather than trailing them. Endotoxin in injectables is detected with the limulus amoebocyte lysate test, whose reagent is derived from horseshoe crab amoebocytes.",
      },
      {
        type: "paragraph",
        text: "The O-antigen also gives the patient's immune system something to hold. Antibodies against it are protective — the basis of some vaccines — and O-antigen serotyping is the classical epidemiological fingerprint of Salmonella: serovar Typhi is 9,12:d:- in the Kauffmann–White scheme. A smooth-to-rough mutation deletes the O-antigen, makes colonies visibly rough on agar, and removes a vaccine target.",
      },

      { type: "heading", level: 2, text: "The cytoplasmic membrane" },
      {
        type: "paragraph",
        text: "Beneath the wall sits a fluid bilayer of phospholipids containing no sterols — unlike the human membrane, which is rich in cholesterol. It carries the respiratory chain, ATP synthase, the carrier lipid that delivers peptidoglycan precursors, the permeases, and the sensor kinases of two-component signal systems. This is the layer whose proton gradient every aminoglycoside and fluoroquinolone ultimately perturbs.",
      },
      {
        type: "table",
        headers: ["Property", "Bacterium", "Human cell", "Drug class that exploits the difference"],
        rows: [
          ["Membrane sterols", "None, except Mycoplasma which incorporates host cholesterol", "Cholesterol abundant", "Amphotericin B and the azoles — antifungals that attack sterol synthesis, so they are useless against bacteria"],
          ["Ribosome size", "70S, built of 30S and 50S subunits", "80S, built of 40S and 60S", "Macrolides, tetracyclines, aminoglycosides, chloramphenicol, clindamycin, oxazolidinones"],
          ["Peptidoglycan cell wall", "Present", "Absent", "Every beta-lactam and glycopeptide"],
          ["Folic acid synthesis", "Synthesises its own folate", "Depends on dietary folate", "Sulphonamides and trimethoprim"],
        ],
      },

      { type: "heading", level: 2, text: "Surface structures and virulence" },
      {
        type: "paragraph",
        text: "The envelope is decorated, and the decorations are what turn a bacterium into a pathogen. The capsule is the single most important: a hydrated polysaccharide layer outside the wall that is poorly antigenic, weakly complement-fixing and, above all, antiphagocytic — the encapsulated organism slides past a neutrophil that would otherwise have engulfed it.",
      },
      {
        type: "table",
        headers: ["Structure", "Composition and location", "Function", "Clinical example"],
        rows: [
          ["Capsule / glycocalyx", "Polysaccharide, occasionally polypeptide, outside the wall", "Antiphagocytosis, adherence, resistance to desiccation, complement evasion", "The Quellung test is positive in Streptococcus pneumoniae, Neisseria meningitidis (serogroups A, B, C, W, Y), Klebsiella and Cryptococcus — a fungus with a capsule"],
          ["Flagellum", "Flagellin filament rotated by a basal-body motor in the envelope; absent from cocci", "Motility and chemotaxis", "Vibrio cholerae and Proteus dart through mucus to reach the epithelium; Salmonella uses flagella to cross the gut wall"],
          ["Fimbriae / pili", "Pilin protein; conjugative sex pili are plasmid-encoded", "Adherence; sex pili transfer DNA during conjugation", "Type I fimbriae of E. coli cause urinary tract infection, while P-piliated strains ascend to cause pyelonephritis"],
          ["Biofilm", "Polysaccharide matrix holding a community on a surface", "Shields cells from phagocytes and antibiotics, and slows growth", "Staphylococcus epidermidis on prosthetic joints and central lines; Pseudomonas in cystic fibrosis airways; dental plaque"],
          ["Endospore", "Dehydrated core with dipicolinic acid and small acid-soluble proteins under keratin-like coats", "Dormancy and resistance — not reproduction", "Clostridioides difficile and Clostridium tetani spores survive months on a hospital ward"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The Quellung test — literally 'swelling' — types an encapsulated organism in minutes: antisera against the capsule make it visibly swell under the microscope. Latex agglutination and PCR have largely replaced it, but it remains the classic answer when a question asks about pneumococcal or meningococcal serotyping.",
      },

      { type: "heading", level: 2, text: "Endospores: why sterilisation is defined by them" },
      {
        type: "paragraph",
        text: "Endospores are made by Gram-positive rods, chiefly Bacillus and Clostridium, when nutrients run out. The cell divides asymmetrically, engulfs one copy of its chromosome and encases it in a dehydrated core with dipicolinic acid, small acid-soluble proteins and multilayered protein coats. The result is metabolically inert: it survives boiling for hours, resists desiccation, ultraviolet light and chemical disinfectants, and germinates within minutes when conditions return — a round trip through heat that would pasteurise a kitchen.",
      },
      {
        type: "paragraph",
        text: "Because Bacillus stearothermophilus spores are extraordinarily heat-resistant, they are the biological indicator that an autoclave actually worked. Autoclaving is validated as the combination of temperature, time and pressure that reliably destroys those spores: 121°C for 15 minutes, or 134°C for 3 minutes. When a textbook says sterility is judged against spores, this is the reason.",
      },

      { type: "heading", level: 2, text: "Inside the cell: no organelles, one circular chromosome" },
      {
        type: "paragraph",
        text: "Bacteria have no nucleus, no mitochondria, no endoplasmic reticulum. The chromosome is a single closed circle of double-stranded DNA lying in an irregular nucleoid — the E. coli genome is about 4.6 million base pairs carrying roughly 4,300 genes, attached to the membrane and replicated bidirectionally from one origin. Beside it sit plasmids, small extrachromosomal circles carrying accessory genes such as antibiotic resistance and toxin production, and transposons that jump between chromosome, plasmid and even between cells. There is no meiosis, so advantageous genes are swapped horizontally — the subject of the genetics lesson.",
      },
      {
        type: "table",
        headers: ["Genetic element", "Size and form", "What it carries", "Why it matters"],
        rows: [
          ["Chromosome", "Closed circular dsDNA, roughly 1–9 Mb", "Essential housekeeping genes and core virulence determinants", "Mutation here is heritable and is the engine of strain evolution"],
          ["Plasmid", "Small circular dsDNA, often multiple copies", "Resistance (R plasmids), toxins, the fertility factor F, bacteriocins", "Moves between cells by conjugation and crosses species barriers"],
          ["Transposon / insertion sequence", "A few hundred bp to many kb, mobile", "Resistance gene cassettes, integrons", "Jumps between plasmid and chromosome, making a resistance gene permanent"],
          ["Integron", "A gene-capture platform with an integrase", "Arrays of resistance cassettes in tandem", "One recombination event can add several resistance determinants at once"],
        ],
      },

      { type: "heading", level: 2, text: "Bacteria that break the rules" },
      {
        type: "definition",
        term: "Acid-fast organism",
        text: "A bacterium whose wall contains mycolic acids — long waxy fatty acids that make it impermeable to ordinary aqueous stains. Such an organism resists decolourisation by acid–alcohol after carbol fuchsin uptake, and so appears red against a blue background: it is acid-fast.",
      },
      {
        type: "paragraph",
        text: "Mycobacterium tuberculosis is the important case. The Ziehl–Neelsen method uses heat to drive carbol fuchin into the wax, then 20 per cent sulphuric acid as the decolouriser because a stronger one dissolves the stain; auramine–rhodamine fluorescence microscopy is faster and is now the screening method. That waxy wall also explains the slow growth (15–20 hours per generation) and therefore the intrinsic resistance to antibiotics that only work on dividing cells — which is why tuberculosis needs months of multiple drugs. Mycobacteria do not hold the Gram stain and cannot be reported by it.",
      },
      {
        type: "definition",
        term: "Mycoplasma",
        text: "A bacterium that naturally lacks a cell wall and is bounded only by a sterol-containing membrane. It therefore does not Gram-stain, forms no spores, is osmotically fragile, and is intrinsically resistant to every beta-lactam and glycopeptide.",
      },
      {
        type: "paragraph",
        text: "Mycoplasma pneumoniae causes atypical or 'walking' pneumonia and is diagnosed by cold agglutinins and PCR; Ureaplasma urealyticum causes non-gonococcal urethritis and chorioamnionitis. Treatment is a macrolide, tetracycline or fluoroquinolone — never a penicillin, and that is a direct consequence of wall architecture rather than a clinical preference.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Believing the Gram stain identifies the species. It narrows the field to 'Gram-positive cocci in clusters' or 'Gram-negative intracellular diplococci', but that morphology is shared by many species; identification needs culture, biochemistry, MALDI-TOF spectrometry or nucleic acid amplification. Calling a red Gram-positive coccus a pneumococcus without a Quellung or antigen test is over-calling.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying that Gram-negative bacteria have endotoxin and Gram-positive bacteria do not. Gram-positives carry lipoteichoic acid and peptidoglycan, which are also inflammatory, and toxic shock syndrome toxin-1 is a superantigen. The precise statement is that lipid A endotoxin is a property of the Gram-negative outer membrane, and septic-shock teaching refers to that.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating spores as either a reproductive form or a Gram-negative one. Sporulation is survival, not multiplication — one spore germinates into one vegetative cell. And spores are formed only by Gram-positive rods, chiefly Bacillus and Clostridium, so any Gram-negative answer to 'which organism forms spores?' is wrong.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does vancomycin fail against Escherichia coli even though peptidoglycan is its target?",
        answer: "Because E. coli's peptidoglycan lies behind an outer membrane. Vancomycin is about 1,450 Da, far too large to pass through the porin channels, so it never reaches the D-Ala-D-Ala substrate it binds.",
        explanation:
          "Outer membranes are permeability barriers, not decoration. This is the single most clinically important consequence of Gram-negative architecture, and it also explains why the smaller carbapenems still work.",
      },
      {
        type: "question",
        prompt: "A CSF Gram film reports 'Gram-negative intracellular diplococci'. Why does the word intracellular matter?",
        answer: "Because diplococci seen inside neutrophils point to Neisseria meningitidis or Neisseria gonorrhoeae; their presence within phagocytes is a hallmark that separates them from commensal flora and from other Gram-negative cocci.",
        explanation:
          "Morphology plus intracellular location plus clinical context is the classical triad that generated a diagnosis before molecular tests existed — CSF with intraneutrophilic Gram-negative diplococci is treated as meningococcal disease immediately.",
      },
      {
        type: "question",
        prompt: "Why is autoclave validation performed with Bacillus stearothermophilus spores rather than with E. coli?",
        answer: "Because spores are the most heat-resistant biological form. A cycle that kills B. stearothermophilus spores has necessarily killed every vegetative organism, including E. coli, so the indicator tests the process at the level of its hardest target.",
        explanation:
          "Sterility is defined against spores, which is why 121°C for 15 minutes at 15 psi is the standard cycle: it is the minimum combination that reliably achieves spore death.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which statement correctly distinguishes the two Gram groups?",
        options: [
          "Gram-positive cells have a thin peptidoglycan layer and no teichoic acid; Gram-negative cells have a thick layer rich in teichoic acid.",
          "Gram-positive cells have a thick peptidoglycan layer with teichoic acids and no outer membrane; Gram-negative cells have a thin layer, no teichoic acid, and an outer membrane containing lipopolysaccharide.",
          "Both groups bear an outer membrane, but only the Gram-positive one contains lipopolysaccharide.",
          "Gram-positive cells lack peptidoglycan and are bounded by a sterol-containing membrane, which is why they retain crystal violet.",
        ],
        correctIndex: 1,
        explanation:
          "The Gram-positive wall is thick (20–80 nm) and carries teichoic and lipoteichoic acids with no outer membrane outside it; the Gram-negative wall is thin (2–7 nm), sits in a periplasm, and is covered by an LPS-bearing outer membrane. Option D describes Mycoplasma, not Gram-positive organisms.",
      },
      {
        type: "mcq",
        stem: "An isolate from a sterile body fluid fails to stain by Gram's method, is not killed by penicillin, and grows into 'fried-egg' colonies on agar. What is the explanation?",
        options: [
          "It is a spore-forming Gram-positive rod that escaped the stain because the decolouriser was applied too briefly.",
          "It is an acid-fast mycobacterium whose wall is too waxy for crystal violet.",
          "It is a Mycoplasma, which has no peptidoglycan wall and therefore cannot retain crystal violet or bind beta-lactams.",
          "It is a Gram-negative organism with a defective outer membrane, so it lost the crystal violet complex.",
        ],
        correctIndex: 2,
        explanation:
          "Absence of a wall abolishes both Gram staining (nothing retains the complex) and beta-lactam susceptibility (no cross-links to attack), and Mycoplasma colonies have the classic fried-egg appearance. Mycobacteria, by contrast, are acid-fast and do retain carbol fuchin.",
      },
      {
        type: "mcq",
        stem: "Which feature of Gram-negative sepsis is a direct consequence of lipopolysaccharide?",
        options: [
          "The absence of teichoic acid, so the organism cannot be typed serologically.",
          "Release of lipid A, which activates macrophages to produce tumour necrosis factor and interleukin-1, driving fever, hypotension and disseminated intravascular coagulation.",
          "Retention of crystal violet, which makes infected blood appear dark on the Gram film.",
          "Inability to grow on MacConkey agar, so blood cultures stay negative for 72 hours.",
        ],
        correctIndex: 1,
        explanation:
          "Lipid A is the endotoxin: it engages Toll-like receptor 4 and unleashes the cytokine cascade of septic shock. The other options are unrelated — teichoic acids are a Gram-positive structure, and Gram staining has no bearing on blood-culture growth.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The envelope decides the Gram reaction, the antibiotic spectrum and much of the virulence: thick peptidoglycan with teichoic acids, no outer membrane, means Gram-positive and purple; thin peptidoglycan in a periplasm beneath an LPS-bearing outer membrane means Gram-negative and pink. Peptidoglycan synthesis is selectively vulnerable and gives us the beta-lactams and glycopeptides, while the outer membrane gives us the polymyxins and explains vancomycin resistance in Gram-negatives. Capsules, flagella, pili and biofilms turn a stained cell into a pathogen, and endospores make sterility an activity measured in minutes at 121°C.",
      },
      {
        type: "paragraph",
        text: "Next: growth, nutrition and cultivation. You will learn how one cell doubles every twenty minutes in exponential phase, why M. tuberculosis needs weeks of incubation on Löwenstein–Jensen medium, and how oxygen requirement and fastidiousness are read off a culture to point at a pathogen before any biochemical test is performed.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 2 — Growth, nutrition & cultivation (fully authored)
// ---------------------------------------------------------------------------
function lesson2() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the four phases of the bacterial growth curve and state what limits each transition; quote generation times for the organisms you will meet in the laboratory and explain why slow-growing mycobacteria need weeks of incubation; classify organisms by oxygen requirement and predict the atmosphere each needs; distinguish selective from differential from enrichment media and name examples of each; interpret a blood agar plate by its haemolysis pattern; and design the sampling and transport conditions that allow a fastidious pathogen to be isolated from a site carrying normal flora.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 — Bacterial cell structure. The envelope explains why some organisms are fastidious, why obligate anaerobes are poisoned by oxygen, and why media must be buffered and supplemented.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Bacterial growth",
        text: "An increase in cell number, not in cell size. Under ideal conditions a bacterium grows by binary fission — it elongates, replicates its chromosome and divides at a septum into two identical daughters — so the growth is exponential and is described by a generation (doubling) time.",
      },
      {
        type: "paragraph",
        text: "A culture is a population, and like every population it traces a curve: slow while the cells retool, then vertiginous, then flat, then falling. Knowing where a culture sits on that curve is not pedantry. It decides whether an antibiotic that only kills dividing cells will work, whether a culture is at the density a susceptibility test specifies, and whether a laboratory's 'no growth at 48 hours' means anything at all.",
      },
      {
        type: "paragraph",
        text: "The second half of this lesson is practical craft: an organism must be persuaded to grow outside the body, and most pathogens will not grow on plain nutrient agar. Media therefore do more than feed — they suppress competitors, reveal metabolism by colour change, and supply growth factors that the patient's tissues once provided free.",
      },

      { type: "heading", level: 2, text: "The growth curve" },
      {
        type: "paragraph",
        text: "Inoculate a small number of cells into broth, hold the temperature, and sample the viable count at intervals. The semilogarithmic plot of viable cells against time gives four phases whose boundaries are causes, not just labels.",
      },
      {
        type: "table",
        headers: ["Phase", "What the cells are doing", "Why it ends", "What it means in practice"],
        rows: [
          ["Lag", "Not dividing, but enlarging and synthesising enzymes, ribosomes and ATP", "The inoculum comprised resting stationary-phase cells that must adapt to the new medium; a larger inoculum shortens the phase", "Antibiotics that require active growth work poorly on a culture still in lag phase"],
          ["Log (exponential)", "Dividing at a constant maximum rate, doubling every fixed interval; cells are uniform and most vulnerable to antibiotics", "Nothing is limiting — nutrients are in excess and waste has not accumulated", "Every susceptibility test inoculum is taken here, at the 0.5 McFarland standard density"],
          ["Stationary", "Division slows until new deaths balance new births", "A nutrient is exhausted, or an acid or alcohol by-product accumulates, or oxygen runs out", "Spores form in Bacillus and Clostridium, and many toxins and secondary metabolites are produced here"],
          ["Death (decline)", "The viable count falls exponentially", "Starvation and accumulated toxic products continue after division has stopped", "A small fraction survives indefinitely — 'viable but non-culturable' cells are one cause of culture-negative infection"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Linearity on a semilog plot means the rate of increase is proportional to the number of cells — that is what exponential means. Hold on to the arithmetic: E. coli at 20 minutes per generation achieves 40 doublings in 13 hours, which is roughly 10^12 cells, about 1 g wet weight, from a single cell overnight. That is why an untreated wound can become septic inside a day.",
      },
      {
        type: "table",
        headers: ["Organism", "Generation (doubling) time", "Consequence for the laboratory"],
        rows: [
          ["Escherichia coli", "About 20 minutes", "Colonies are visible in 18–24 hours"],
          ["Staphylococcus aureus", "About 30 minutes", "Plates are read overnight"],
          ["Pseudomonas aeruginosa", "About 30–40 minutes", "Grows fast enough to overrun weaker organisms in mixed culture"],
          ["Streptococcus pneumoniae", "20–30 minutes, but fastidious", "Needs blood-enriched media; autolysis makes colonies look umbilicated or 'draughtsman'-shaped"],
          ["Mycobacterium tuberculosis", "15–20 hours — about 20 days to visible colonies", "Cultures are held 6–8 weeks before being reported negative; drug susceptibility testing takes weeks"],
          ["Mycobacterium leprae", "12–13 days", "Cannot be cultured on artificial media; diagnosis is smear, histopathology, PCR or mouse footpad"],
          ["Treponema pallidum", "30–33 hours", "Not cultivable in vitro; diagnosis is dark-ground microscopy or serology"],
        ],
      },

      { type: "heading", level: 2, text: "Oxygen requirement is a spectrum, not a switch" },
      {
        type: "paragraph",
        text: "Oxygen is a double agent: it makes respiration fifteen to twenty times more efficient, and it generates hydrogen peroxide, superoxide and singlet oxygen, which are lethal unless the cell owns catalase, superoxide dismutase and peroxidase. Where an organism sits on the oxygen curve is therefore a statement about which enzymes it possesses, and it determines the atmosphere the laboratory must provide.",
      },
      {
        type: "table",
        headers: ["Class", "Relationship to oxygen", "Representative organisms", "Cultivation"],
        rows: [
          ["Obligate aerobe", "Requires oxygen to grow — the cell cannot ferment enough energy", "Mycobacterium tuberculosis, Pseudomonas aeruginosa, Nocardia, Bacillus subtilis", "Incubate in ordinary air"],
          ["Facultative anaerobe", "Grows with or without oxygen; prefers respiration for its higher yield but ferments anaerobically", "Most Enterobacteriaceae including E. coli and Salmonella; Staphylococcus aureus; yeasts", "Grows in air, in a candle jar and under anaerobic conditions alike"],
          ["Obligate anaerobe", "Killed by oxygen — lacks catalase and superoxide dismutase", "Clostridium tetani, Clostridium botulinum, Clostridium perfringens, Clostridioides difficile, Bacteroides fragilis", "Anaerobic jar or cabinet, GasPak, reducing agents in the medium"],
          ["Microaerophile", "Needs oxygen but at reduced concentration, about 5 per cent", "Campylobacter jejuni, Helicobacter pylori", "Microaerophilic jar: 5 per cent O2, 10 per cent CO2, 85 per cent N2"],
          ["Capnophile", "Needs elevated carbon dioxide", "Neisseria gonorrhoeae, Streptococcus pneumoniae, Brucella", "Candle jar or CO2 incubator at 3–5 per cent CO2"],
          ["Aerotolerant anaerobe", "Does not use oxygen but is not killed by it", "Lactobacilli, many streptococci", "Grows in either atmosphere"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "An organism can be missed purely because nobody thought about the atmosphere. Campylobacter is cultured at 42°C in 5 per cent oxygen, which suppresses competing flora, and is the reason Campylobacter plates are incubated hot and microaerophilic. Bacteroides and Fusobacterium never grow on an aerobic plate, so a mixed-wound swab plated only in air simply does not contain them.",
      },
      {
        type: "paragraph",
        text: "Anaerobes dominate the human microbiota: more than 99 per cent of the faecal flora is anaerobic, and Bacteroides fragilis outnumbers E. coli a thousand to one per gram of stool. Aspirates of abscesses, deep-wound specimens and pleural fluid must therefore be transported under anaerobic conditions, because a swab left exposed to air kills the very organism you are trying to recover.",
      },

      { type: "heading", level: 2, text: "Nutrition and fastidiousness" },
      {
        type: "paragraph",
        text: "Most bacteria need only a carbon source, a nitrogen source, a few salts, water and the right pH. Fastidious organisms have lost the ability to synthesise some essential molecule and must be supplied it — Haemophilus influenzae, for instance, requires both haemin (factor X) and nicotinamide adenine dinucleotide (factor V). That single fact drives both its medium and its pharmacology.",
      },
      {
        type: "table",
        headers: ["Growth requirement", "Organisms that need it", "How it is supplied"],
        rows: [
          ["Factor X (haemin)", "Haemophilus influenzae, Haemophilus ducreyi", "Heated or lysed blood releases haemin from red cells — hence chocolate agar"],
          ["Factor V (NAD)", "Haemophilus influenzae, Neisseria", "Released by heating blood, which destroys the V-inactivating enzymes in serum"],
          ["Enriched blood", "Streptococci, pneumococci, Bordetella pertussis (needs it, plus charcoal)", "Blood agar — sheep or horse blood added to molten agar before it sets"],
          ["Lipid and sterol", "Mycoplasma pneumoniae", "Serum enrichment of the medium, because Mycoplasma cannot synthesise sterols"],
          ["Selective pressure plus indicator", "Enterobacteriaceae", "Bile salts and crystal violet inhibit Gram-positives, while lactose fermentation turns colonies pink"],
          ["Egg-glycerol base with malachite green", "Mycobacterium tuberculosis", "Löwenstein–Jensen medium, whose malachite green suppresses other flora"],
          ["Charcoal–yeast extract with antibiotics", "Legionella pneumophila", "Buffered charcoal-yeast extract agar, because Legionella needs cysteine and iron"],
        ],
      },
      {
        type: "definition",
        term: "Chocolate agar",
        text: "Blood agar heated to about 80°C, which lyses the red cells and releases factor X and factor V while giving the medium its characteristic brown colour. It is the medium on which Haemophilus influenzae and Neisseria species are grown, and it is also required to grow Haemophilus ducreyi, the agent of chancroid.",
      },
      {
        type: "paragraph",
        text: "Culture media are classified by what they do, not by what they contain. A basic medium grows the non-fastidious organisms. An enriched medium adds blood, serum or egg. A selective medium contains an inhibitor — bile salts, crystal violet, tellurite, antibiotics, a high pH, a high temperature — that suppresses competitors. A differential medium lets visible chemistry separate what grows: lactose fermentation with a pH indicator on MacConkey, haemolysis on blood agar. Most media in daily use do two or three of these jobs at once.",
      },
      {
        type: "table",
        headers: ["Medium", "Type", "Key agents", "What it is used for"],
        rows: [
          ["Nutrient agar", "Basic", "Peptone, meat extract, sodium chloride", "Routine growth of non-fastidious organisms such as E. coli and Staphylococcus"],
          ["Blood agar", "Enriched, differential", "5–10 per cent sheep or horse blood", "Haemolysis pattern, and growth of streptococci and pneumococci"],
          ["Chocolate agar", "Enriched", "Heated blood", "Haemophilus influenzae, Neisseria, and other fastidious respiratory organisms"],
          ["MacConkey agar", "Selective and differential", "Bile salts and crystal violet select; lactose with neutral red differentiates", "Enterobacteriaceae: lactose fermenters such as E. coli are pink, non-fermenters such as Salmonella and Shigella are pale"],
          ["CLED agar", "Elective and differential", "Bromothymol blue, low electrolyte", "Urine cultures — supports both E. coli and Gram-positive cocci; lactose fermentation turns colonies yellow"],
          ["Tellurite blood agar", "Selective", "Potassium tellurite", "Corynebacterium diphtheriae — grey-black colonies with a grey halo"],
          ["Löwenstein–Jensen", "Selective, enriched", "Egg-glycerol, malachite green", "Mycobacterium tuberculosis and atypical mycobacteria"],
          ["Sabouraud dextrose agar", "Selective for fungi", "pH 5.6 and chloramphenicol or cycloheximide", "Fungi, because they tolerate the acidity and the antibiotics suppress bacteria"],
        ],
      },

      { type: "heading", level: 2, text: "Reading a plate: colony morphology and haemolysis" },
      {
        type: "paragraph",
        text: "An experienced bacteriologist identifies a great deal by eye. Colony colour, size, consistency and opacity, pigment production and the type of haemolysis on blood agar narrow a differential diagnosis before any reagent is opened.",
      },
      {
        type: "table",
        headers: ["Haemolysis pattern", "Definition", "Classic producers"],
        rows: [
          ["Alpha (partial, green)", "Incomplete lysis of red cells leaves a greenish discolouration around the colony", "Streptococcus pneumoniae, Streptococcus viridans group, many enterococci"],
          ["Beta (complete)", "A clear zone of complete lysis around the colony", "Streptococcus pyogenes (group A beta-haemolytic strep), Staphylococcus aureus, Listeria monocytogenes"],
          ["Gamma (none)", "No change in the medium around the colony", "Enterococcus faecalis, many coagulase-negative staphylococci"],
          ["Alpha-prime (wide-zone alpha)", "A narrow band of intact cells with a wider zone of incomplete lysis", "Clostridium perfringens — seen on anaerobic blood agar"],
        ],
      },
      {
        type: "paragraph",
        text: "Other visual clues carry real weight. Golden-yellow pigment in Staphylococcus aureus (carotenoid staphyloxanthin) with beta-haemolysis and coagulase positivity; a swarming film across the plate in Proteus mirabilis (the 'fishy' smell and motile swarm); metallic green sheen in Pseudomonas aeruginosa with a grape-like odour; umbilicated 'draughtsman' colonies in pneumococcus because the autolysin dissolves the centre of the colony; and stringy, sticky mucoid colonies in heavily encapsulated Klebsiella pneumoniae.",
      },
      {
        type: "example",
        text: "A sputum sample from a patient with pneumonia is plated on blood and chocolate agar. The blood agar shows small, umbilicated alpha-haemolytic colonies, and the chocolate agar shows the same growth plus tiny colonies next to Staphylococcus aureus — satellites around the staphylococcal colony because the staphylococcus lyse the red cells and released the factor V that Haemophilus needs. The satellite test is thus both a plate-reading and a diagnostic observation.",
      },

      { type: "heading", level: 2, text: "Cultivating organisms that resist culture" },
      {
        type: "paragraph",
        text: "Some organisms cannot be grown on artifical media at all and the laboratory reaches for other systems: tissue culture cells for viruses, embryonated hen's eggs for influenza and rabies virus, living animals for some rickettsiae and for Mycobacterium leprae (mouse footpad), and xenodiagnosis — feeding an uninfected triatomine bug on a patient's blood — for Chagas disease. In the modern era most of these have given way to nucleic acid detection, which can diagnose the uncultivable directly.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Mycobacterium tuberculosis is cultivated at 35–37°C in 5–10 per cent carbon dioxide on Löwenstein–Jensen or Middlebrook media, and the tubes are held for eight weeks. Automated liquid systems such as BACTEC MGIT detect growth earlier through oxygen consumption and fluorescence, which shortens a report from weeks to as little as a fortnight.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Assuming 'no growth' means 'no infection'. A negative culture can mean the specimen was taken after antibiotics, the organism is fastidious or anaerobic and was not provided for, the wrong temperature or atmosphere was used, the transport medium was unsuitable, or the organism simply cannot be cultured. Culture-negative endocarditis and culture-negative pyogenic arthritis are well-recognised entities, and serology or molecular methods rescue them.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing selective and differential. Selective media suppress some organisms so others can grow; differential media allow growth but make species look different. MacConkey does both, which is why it is the standard answer to 'name a selective and differential medium'.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting that the lag phase is a phase, not a fixed clock. A culture diluted from stationary phase into fresh medium has a lag proportional to the physiological age of the inoculum; a culture already in exponential phase transferred to fresh medium shows essentially no lag. Questions about 'why is there no growth in the first two hours' are usually about this.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A broth culture shows a two-hour period with no increase in cell number immediately after inoculation, then a steep thirty-fold rise in the next hour. Account for the two observations.",
        answer:
          "The initial flat period is the lag phase, in which cells synthesise the enzymes, ribosomes and ATP needed to divide in the new medium. The steep rise that follows is the exponential or log phase, in which the cells double at a fixed interval.",
        explanation:
          "The length of the lag phase depends on the physiological state of the inoculum — stationary-phase cells lag longer than exponential-phase cells — and on how different the new medium is from the old one.",
      },
      {
        type: "question",
        prompt: "Why must cerebrospinal fluid, a normally sterile fluid, be plated on chocolate agar rather than ordinary blood agar?",
        answer:
          "Because the pathogens that cause meningitis — Neisseria meningitidis, Haemophilus influenzae and Streptococcus pneumoniae — are fastidious, and chocolate agar supplies the factor X and factor V that heating releases from red cells while inhibiting almost nothing the specimen could contain.",
        explanation:
          "Chocolate agar is heated blood, so the released NAD survives the V-inactivating enzymes of serum. It is the standard medium for CSF, for respiratory secretions and for any site where fastidious respiratory pathogens are suspected.",
      },
      {
        type: "question",
        prompt: "A wound swab is plated aerobically and only grows Enterococcus faecalis, but the tissue aspirate taken alongside grows Bacteroides fragilis and Prevotella. Why did the swab fail?",
        answer:
          "Because a surface swab exposed to air kills obligate anaerobes through oxidation and loses the anaerobic population before it ever reaches a plate; an aspirate retained in anaerobic transport preserves them.",
        explanation:
          "Obligate anaerobes dominate deep-wound and abscess flora, so the correct specimen is aspirated fluid or a tissue biopsy, transported anaerobically, and plated on blood agar incubated anaerobically. Swabs are simply the wrong specimen.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which statement about the bacterial growth curve is correct?",
        options: [
          "The stationary phase is reached when the cells run out of oxygen and switch to fermentation.",
          "Cells in the log phase are physiologically uniform and are the most susceptible to antibiotics that act on growth.",
          "The lag phase lasts the same time regardless of the physiological state of the inoculum.",
          "Cell numbers fall during the stationary phase because the autolysins destroy the cell walls.",
        ],
        correctIndex: 1,
        explanation:
          "Exponential-phase cells are synchronised in their physiology and are dividing at maximum rate, which is why susceptibility test inocula are taken there. Stationary phase can be caused by exhaustion of any nutrient, accumulation of acid, or lack of oxygen; the lag phase varies with inoculum age.",
      },
      {
        type: "mcq",
        stem: "An organism needs 5 per cent oxygen, 10 per cent carbon dioxide and grows at 42°C. Which is the most likely identification?",
        options: [
          "Mycobacterium tuberculosis — an obligate aerobe cultured at 37°C",
          "Bacteroides fragilis — an obligate anaerobe cultured in an anaerobic jar",
          "Campylobacter jejuni — a microaerophile cultured at 42°C",
          "Streptococcus pneumoniae — a capnophile cultured at 37°C in a candle jar",
        ],
        correctIndex: 2,
        explanation:
          "Campylobacter jejuni is the classic microaerophile cultured at 42°C, and the elevated temperature is itself selective because it suppresses much of the faecal flora. M. tuberculosis is an obligate aerobe growing far more slowly; Bacteroides cannot tolerate any oxygen; and pneumococcus needs enrichment rather than microaerophilic conditions.",
      },
      {
        type: "mcq",
        stem: "A urine culture plate supports the growth of both E. coli and Enterococcus, and turns lactose-fermenting colonies yellow. Which medium is in use?",
        options: ["MacConkey agar", "CLED agar", "Tellurite blood agar", "Sabouraud dextrose agar"],
        correctIndex: 1,
        explanation:
          "CLED (cysteine-lactose-electrolyte-deficient) agar supports both Gram-negative and Gram-positive urinary pathogens and uses bromothymol blue so lactose fermentation turns colonies yellow; its low electrolyte content prevents the swarming of Proteus. MacConkey's bile salts and crystal violet inhibit Enterococcus.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Bacterial growth is an exponential increase in cell number described by a four-phase curve — lag, log, stationary, death — and generation times range from twenty minutes for E. coli to twenty days for M. tuberculosis, which is why slow-growing organisms need long incubation and slow-growing organisms are treated for months. Oxygen requirement and nutritional fastidiousness dictate atmosphere, temperature and medium, and the media used daily are classified as basic, enriched, selective and differential, often combining several roles. Colony morphology and haemolysis on blood agar give a first identification before biochemistry is opened.",
      },
      {
        type: "paragraph",
        text: "Next: bacterial genetics and mutation. You will see how the same exponential growth, combined with a high mutation rate and no need for meiosis, lets bacteria acquire antibiotic resistance by transformation, transduction, conjugation and transposition — and why that is a clinical problem rather than a laboratory curiosity.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 3 — Bacterial genetics & mutation (fully authored)
// ---------------------------------------------------------------------------
function lesson3() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: distinguish vertical from horizontal gene transfer and explain why only the second spreads resistance across species; describe the three classical mechanisms of horizontal transfer — transformation, transduction and conjugation — with a named example of each; explain the structure of the F plasmid and how it produces Hfr strains; describe transposons, integrons and insertion sequences and their role in assembling resistance; state the spontaneous mutation rate and explain why mutation never produces resistance 'on demand'; and interpret the clinical genetics of MRSA, ESBL producers and vancomycin-resistant enterococci.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1 and 2. You need the envelope architecture (from lesson 2, the growth curve and the idea that generation time is short) to see why a per-generation mutation rate becomes a population-level problem within hours.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Horizontal gene transfer",
        text: "The movement of genetic material between unrelated organisms — usually by conjugation, transduction or transformation — rather than from parent to offspring. It is the mechanism by which a resistance determinant can leave a harmless soil organism and arrive in a pathogen within a few decades.",
      },
      {
        type: "paragraph",
        text: "A bacterial genome has two channels of inheritance. Vertically, the chromosome is copied and each daughter cell receives a copy; this is stable, slow and confined to a lineage. Horizontally, genes arrive on plasmids, bacteriophages or naked DNA and may be accepted even from a different species. That distinction is the whole of this lesson: mutation is how a single lineage becomes different, whereas horizontal transfer is how resistance becomes an epidemic phenomenon.",
      },
      {
        type: "paragraph",
        text: "The numbers make the problem concrete. E. coli doubles every twenty minutes, so a mutation occurring once per 10^6 divisions produces thousands of mutants within a single afternoon in a culture of 10^9 cells. In a patient on a fluoroquinolone, the antibiotic is a filter: it kills the susceptible majority and leaves the rare resistant mutant to fill the space. The drug does not create the mutant — it selects it, and understanding the difference is the difference between a correct clinical decision and a dangerous misunderstanding.",
      },

      { type: "heading", level: 2, text: "Mutation: the simplest engine of change" },
      {
        type: "paragraph",
        text: "Spontaneous mutations arise from replication errors and DNA damage at a rate of roughly 10^-6 to 10^-9 per base pair per generation, and are random with respect to their usefulness. Selection then decides which of them matters. Bacteria have no special pathway that increases mutation rate at a useful gene; there are only mutagenic stress responses (SOS repair, error-prone polymerases) that raise the whole-genome rate under stress, which is why fluoroquinolones can accelerate the appearance of resistance.",
      },
      {
        type: "table",
        headers: ["Type of genetic change", "What happens", "Resistance consequence"],
        rows: [
          ["Base substitution", "A single nucleotide is misread during replication and paired incorrectly", "A single amino acid change in the target enzyme — for example a gyrA mutation giving quinolone resistance"],
          ["Frame-shift (insertion or deletion)", "The reading frame downstream is displaced", "Commonly abolishes a protein, such as an outer membrane porin, which can alter the antimicrobial's route in"],
          ["Missense in a regulatory gene", "A promoter or a repressor is altered", "Enzyme over-expression: more beta-lactamase, more efflux pump"],
          ["Large deletion", "A segment is lost", "Loss of porins or of the O-antigen; loss of porin OmpF contributes to carbapenem resistance"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The classic error — in examinations and in clinical reasoning alike — is saying that bacteria 'develop resistance in response to' an antibiotic. Variation is random and pre-existing; the antibiotic merely selects the variants that already had it. A resistant subpopulation exists before the first dose, which is why combination therapy in tuberculosis is not optional: the probability of a spontaneously double-resistant mutant is the product of the two rates, and the culture of 10^10 organisms in a cavitary lesion makes single-drug treatment a resistance factory.",
      },

      { type: "heading", level: 2, text: "Transformation: naked DNA taken up" },
      {
        type: "definition",
        term: "Transformation",
        text: "The uptake of free (naked) DNA from the environment by a competent bacterial cell, followed by its incorporation into the recipient chromosome by homologous recombination.",
      },
      {
        type: "paragraph",
        text: "Griffith's 1928 experiment is the founding observation of molecular biology. He injected mice with live avirulent rough (non-encapsulated) Streptococcus pneumoniae mixed with heat-killed smooth (encapsulated) pneumococci, and the mice died of virulent infection: something from the dead smooth cells had transformed the live rough ones into encapsulated organisms. Avery, MacLeod and McCarty later showed that substance was DNA.",
      },
      {
        type: "paragraph",
        text: "Competence is physiological, not universal. Neisseria gonorrhoeae, Neisseria meningitidis, Streptococcus pneumoniae, Haemophilus influenzae and several other species become naturally competent and take up DNA that is species-typical — which is one route by which penicillin-resistant pneumococci acquire mosaic pbp genes encoding altered penicillin-binding proteins from related oral streptococci. In the laboratory, competence is induced artificially with calcium chloride and heat shock, which is how plasmids are introduced into E. coli for cloning.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Mosaic penicillin-binding protein genes in Streptococcus pneumoniae are the textbook example of transformation creating clinical resistance. Portions of pbp2b and pbp2x are replaced by sequences from commensal oral streptococci, the resulting PBPs bind penicillin poorly, and the strain is no longer inhibited by achievable drug concentrations while its peptidoglycan synthesis still functions.",
      },

      { type: "heading", level: 2, text: "Transduction: DNA delivered by a phage" },
      {
        type: "definition",
        term: "Transduction",
        text: "The transfer of bacterial DNA from a donor to a recipient cell inside a bacteriophage particle. If the packaged DNA is stably inherited, the recipient acquires the genes it carries.",
      },
      {
        type: "paragraph",
        text: "Generalized transduction happens when a phage in lytic growth mistakenly packages a fragment of host chromosome instead of phage DNA, then injects it into the next cell it infects — possibly anywhere on the chromosome. Specialized transduction is a consequence of faulty excision of a temperate (lysogenic) phage: only the genes adjacent to the prophage attachment site are carried, and the best-studied examples involve bacteriophage lambda in E. coli.",
      },
      {
        type: "table",
        headers: ["Mechanism", "Vector", "Which host genes move", "Clinical significance"],
        rows: [
          ["Generalized transduction", "Virulent phage in the lytic cycle, packaging error", "Any bacterial gene — random fragment", "Moves chromosomal resistance determinants such as mutations in gyrase or porin genes between strains"],
          ["Specialized transduction", "Temperate phage such as lambda, defective excision", "Only genes flanking the prophage integration site", "The classic source of tox genes: phage beta carries the streptococcal pyrogenic exotoxin gene, and phage C1 carries the cholera toxin gene"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Bacteriophages and their gene cargo are why some organisms are only sometimes dangerous. Non-toxigenic strains of Vibrio cholerae become epidemic ones by acquiring the CTX phage, which encodes cholera toxin; non-toxigenic Corynebacterium diphtheriae becomes diphtheria only when lysogenised by the phage carrying the tox gene — the toxin is encoded by phage DNA, not by the bacterium's chromosome.",
      },

      { type: "heading", level: 2, text: "Conjugation: DNA transferred cell to cell" },
      {
        type: "definition",
        term: "Conjugation",
        text: "Transfer of DNA from a donor to a recipient through direct cell-to-cell contact, usually mediated by a plasmid-encoded sex pilus. It is the most important mechanism for spreading antibiotic resistance in the hospital and the community.",
      },
      {
        type: "paragraph",
        text: "The paradigm is the F (fertility) plasmid of E. coli. It carries the tra operon, which builds the sex pilus and the transfer apparatus, and it replicates by rolling-circle replication — a nick at oriT is made, one strand is transferred into the recipient, and both cells synthesise the complementary strand. F+ cells convert F− recipients into F+ cells. When F integrates into the chromosome, the cell becomes an Hfr (high-frequency recombination) strain: it still transfers DNA, but chromosome genes are transferred first and in a fixed order, which is how the circular E. coli chromosome was originally mapped.",
      },
      {
        type: "table",
        headers: ["Element", "Genes carried", "Effect on transfer"],
        rows: [
          ["F plasmid (plasmid F)", "tra operon, oriT, insertion sequences", "Converts a recipient F− cell into F+; transfers only itself"],
          ["F integrated into chromosome", "Chromosome plus F", "Hfr strain: transfers chromosomal genes in order, but rarely completes F transfer"],
          ["R plasmid", "Resistance genes plus transfer genes", "Moves multiple resistance determinants in one event"],
          ["F' (F-prime)", "F carrying a piece of adjacent chromosomal DNA", "Moves a specific chromosomal gene along with fertility"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Conjugation is not confined to laboratory E. coli. Vancomycin resistance in Enterococcus faecium is carried on the vanA operon, usually on a transposon on a conjugative plasmid, and it has moved between enterococcal strains and, more worryingly, been transferred into Staphylococcus aureus — producing vancomycin-resistant Staphylococcus aureus (VRSA), first reported in 1997. This is horizontal transfer happening in patients.",
      },

      { type: "heading", level: 2, text: "Transposons, integrons and the assembly of resistance" },
      {
        type: "paragraph",
        text: "Genes do not only travel between cells; they also move within a cell. An insertion sequence is a short, self-transposing segment carrying only the gene for its own transposase and inverted terminal repeats. Two insertion sequences flanking a gene form a composite transposon, which can jump from chromosome to plasmid. Integrons are more sophisticated: they carry an integrase that captures resistance gene cassettes from the environment and lines them up in tandem behind a single promoter, so one recombination event can add several determinants at once.",
      },
      {
        type: "table",
        headers: ["Mobile element", "Signature structure", "Resistance genes typically carried", "Organism"],
        rows: [
          ["Tn3-family transposon", "Resolvase and transposase genes, flanked by inverted repeats", "bla genes encoding beta-lactamases, including extended-spectrum and carbapenem-hydrolysing variants", "Enterobacteriaceae, Pseudomonas"],
          ["SCCmec cassette", "A staphylococcal cassette chromosome inserting at a specific att site", "mecA (altered PBP2a) plus ccr recombinases", "MRSA"],
          ["Class 1 integron", "intI1 integrase, attI site, promoter, cassette array", "dfr, aadA (sulphonamide and aminoglycoside resistance), qac (antiseptic tolerance)", "Proteus, Pseudomonas, Acinetobacter"],
          ["Composite transposon Tn5", "Two insertion sequences flanking a resistance region", "kan (kanamycin) and npt (neomycin/streptomycin) genes", "E. coli, Pseudomonas, the standard molecular-biology transposon"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Transposition within a cell is what converts an unstable plasmid-borne resistance into a permanent chromosomal trait. A bla gene carried on a transposon can hop into the chromosome, so the strain remains resistant even if every plasmid is cured. That is one reason a 'plasmid-free' revertant is not necessarily an antibiotic-susceptible revertant.",
      },

      { type: "heading", level: 2, text: "From genes to bedside: reading resistance genetics" },
      {
        type: "table",
        headers: ["Resistance phenotype", "Genetic basis", "Laboratory appearance", "What it changes clinically"],
        rows: [
          ["MRSA", "mecA on SCCmec, encoding PBP2a (PBP2a has low affinity for all beta-lactams)", "Cefoxitin disc resistant, or positive mecA/ PBP2a latex agglutination", "Use a glycopeptide, linezolid or daptomycin; never a beta-lactam, whatever the oxacillin disc seems to say"],
          ["ESBL producer", "blaCTX-M, blaTEM, blaSHV variants on plasmids, hydrolysing third-generation cephalosporins", "Synergy between ceftazidime and clavulanate; susceptible to a carbapenem", "Carbapenem for serious infection; avoid the cephalosporins"],
          ["Carbapenemase producer (KPC, NDM, OXA-48, VIM, IMP)", "Very broad beta-lactamases on plasmids, often with aminoglycoside and quinolone co-resistance", "Meropenem resistant, modified carbapenem inactivation test positive", "Colistin, tigecycline, newer combinations such as ceftazidime–avibactam"],
          ["Vancomycin-resistant Enterococcus (VRE)", "vanA (inducible resistance to both vancomycin and teicoplanin) or vanB (vancomycin only)", "Resistant to both agents in a MIC test or E-test", "Linezolid; and strict contact isolation, because the plasmid is transmissible"],
          ["Inducible clindamycin resistance", "erm gene, methylating the 50S ribosome", "Erythromycin resistant, clindamycin 'susceptible' by disc but flattened (positive D-test)", "Use erythromycin instead — clindamycin resistance is inducible and can emerge on therapy"],
        ],
      },
      {
        type: "example",
        text: "A surgical wound swab grows Staphylococcus aureus that is resistant to cefoxitin. The laboratory reports 'MRSA' and a susceptibility panel showing vancomycin MIC 1 mg/L (susceptible). The patient has a repeat culture three weeks later that grows the same strain, now with a vancomycin MIC of 4 mg/L and thickened colonies on vancomycin-containing agar. That is vancomycin-intermediate S. aureus (VISA), arising not by acquisition but by chromosomal mutation — a thickened cell wall that binds more drug. The lesson is that resistance is cumulative: mutation first, then transfer.",
      },

      { type: "heading", level: 2, text: "Genetic tools built on these same systems" },
      {
        type: "paragraph",
        text: "The very machinery of resistance is the machinery of molecular microbiology. Restriction enzymes cut DNA at defined sequences, DNA ligase joins fragments, plasmids act as vectors into which a gene is inserted, and selectable markers — antibiotic resistance genes — identify the cells that took the plasmid up. That is why a cloning plasmid carries ampicillin resistance: it is a selection device, not a clinical problem, and it is also why resistance markers are now designed to be confined to the laboratory.",
      },
      {
        type: "code",
        language: "text",
        code: "Genotype to phenotype: acquire a gene that changes a target or degrades a drug\n\n  blaCTX-M  (plasmid, transmissible)      ->  extended-spectrum beta-lactamase  ->  ceftriaxone resistant\n  mecA      (SCCmec cassette)             ->  altered PBP2a                      ->  methicillin-resistant S. aureus\n  gyrA S83L (chromosomal, heritable)     ->  DNA gyrase target change         ->  ciprofloxacin resistant\n  vanA      (transposon on plasmid)       ->  altered peptidoglycan terminus     ->  vancomycin and teicoplanin resistant\n  rpoB H526Y(chromosomal)                 ->  altered RNA polymerase beta       ->  rifampicin resistant M. tuberculosis",
        caption:
          "Note the first, fourth and fifth rows: a horizontally acquired gene and two chromosomal substitutions. Both routes produce the same clinical outcome, but only the first is transmissible between organisms.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Mixing up the mechanisms. Transformation is naked DNA with no vector. Transduction is DNA inside a phage. Conjugation is cell-to-cell contact with plasmid transfer. A question asking which mechanism relies on a bacteriophage is transduction, and one describing uptake of DNA from a lysed cell is transformation.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying that plasmids carry essential genes. Plasmids are accessory: a cell can be cured of them and survive, though often with a reduction in fitness and in resistance. Chromosomes carry the essential genome — mutation there is heritable and permanent, and recombination into the chromosome is the end state of a transferred gene.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Believing a spontaneous mutation rate of 10^-9 means resistance is unlikely. In a bacterial population of 10^9, a mutant at that rate is certain to exist. Selection pressure then supplies it with a world cleared of competitors. This is why monotherapy of a large bacterial burden is the classic way to generate resistance.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A patient with isoniazid-resistant tuberculosis receives rifampicin alone for nine months. Explain mechanistically why the bacilli are likely to emerge resistant.",
        answer:
          "A rifampicin-resistant mutant (rpoB substitution) exists in the population at roughly one per 10^8 divisions before treatment begins; the single drug kills the susceptible majority and leaves the pre-existing mutant to multiply unimpeded.",
        explanation:
          "This is the whole argument for combination therapy: two drugs simultaneously require two independent mutations, the probability of which is the product of the two rates and therefore vanishingly small in the same cell.",
      },
      {
        type: "question",
        prompt: "Which horizontal mechanism would be most likely to move a penicillin-binding protein gene from an oral commensal streptococcus into Streptococcus pneumoniae, and why?",
        answer:
          "Transformation, because pneumococci are naturally competent and take up species-typical naked DNA released by lysed neighbours, and the recipient recombines it into its own PBP genes to produce mosaic proteins.",
        explanation:
          "Conjugation requires plasmids carrying transfer machinery, and transduction requires a phage; the natural competence of pneumococci and the mosaic structure of their pbp genes are the classical evidence for transformation.",
      },
      {
        type: "question",
        prompt: "Why does the acquisition of a beta-lactamase transposon by a plasmid make resistance more durable than a plasmid alone?",
        answer:
          "Because a transposon can hop from the plasmid into the chromosome, where it is heritable without the plasmid; curing the cell of the plasmid then does not restore susceptibility.",
        explanation:
          "Integrated cassettes such as SCCmec and class 1 integrons behave similarly, which is why the gene — not the vector — is the real unit of persistence in resistance surveillance.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which statement about the three classical mechanisms of horizontal gene transfer is correct?",
        options: [
          "Transformation needs a bacteriophage vector; transduction needs naked DNA; conjugation needs a sex pilus.",
          "Transformation is uptake of naked DNA; transduction transfers DNA in a phage particle; conjugation transfers plasmid DNA through cell-to-cell contact.",
          "All three require a plasmid carrying a transfer (tra) operon.",
          "Conjugation moves chromosomal genes only, while transformation moves plasmid genes only.",
        ],
        correctIndex: 1,
        explanation:
          "Transformation is naked DNA taken up by a competent cell; transduction is phage-mediated; conjugation is pilus-mediated plasmid transfer. Hfr strains transfer chromosomal genes by conjugation, which shows that the plasmid is a vehicle, not a restriction on the cargo.",
      },
      {
        type: "mcq",
        stem: "Which is the most accurate account of how resistance to a new antibiotic arises in a bacterial population?",
        options: [
          "The antibiotic induces a mutation at the resistance gene, so all treated bacteria become resistant.",
          "Resistant cells arise randomly and pre-exist at low frequency; treatment kills the susceptible majority and selects the resistant subpopulation.",
          "Bacteria acquire resistance only when they are co-infected by a bacteriophage carrying the resistance gene.",
          "Resistance arises in the chromosomes but never on plasmids, so it cannot be transferred between species.",
        ],
        correctIndex: 1,
        explanation:
          "Mutation and transfer are random with respect to the selective event; the antibiotic selects rather than directs. Plasmids are, in fact, the dominant vehicle for inter-species resistory transfer, which is why resistance genes can cross species barriers.",
      },
      {
        type: "mcq",
        stem: "A Staphylococcus aureus isolate is resistant to cefoxitin but its oxacillin disc shows a 20 mm zone. What is the best interpretation?",
        options: [
          "The isolate is methicillin-susceptible MSSA and the cefoxitin result is a laboratory error.",
          "Heterogeneous resistance may be concealed in the oxacillin test; cefoxitin resistance, or a mecA/PBP2a test, is the more reliable indicator and the strain should be treated as MRSA.",
          "Cefoxitin is hydrolysed by the beta-lactamase, so the isolate is resistant only to cefoxitin.",
          "The isolate should be called intermediate irrespective of the cefoxitin result.",
        ],
        correctIndex: 1,
        explanation:
          "Heteroresistant MRSA can read susceptible on oxacillin disc diffusion at the standard incubation because only a small subpopulation expresses resistance; cefoxitin, or a mecA or PBP2a assay, is the recommended surrogate. Treating it as MSSA would be a serious therapeutic error.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Bacteria change their genomes vertically by mutation and horizontally by transformation, transduction and conjugation. Mutation is random and provides the raw variation; horizontal transfer is what turns a rare determinant into a population-wide and cross-species phenomenon. Plasmids, transposons and integrons assemble those determinants into compact cassettes, and integration into the chromosome makes them permanent — which is why MRSA, ESBL producers, carbapenemase producers and VRE are each, at root, one gene-cargo problem.",
      },
      {
        type: "paragraph",
        text: "Next: antimicrobial susceptibility testing. You will see how the laboratory converts the genetics you have just met — the beta-lactamase, the altered PBP, the inducible erm — into a zone diameter or a minimum inhibitory concentration that a clinician can act on.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 4 — Antimicrobial susceptibility (fully authored)
// ---------------------------------------------------------------------------
function lesson4() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define minimum inhibitory concentration and minimum bactericidal concentration and explain which one a clinician needs in endovascular infection; describe how disc diffusion, MIC determination and gradient strips are performed and standardised; interpret a susceptibility report using susceptible, intermediate and resistant categories; recognise the phenotypic signatures of MRSA, ESBL producers, carbapenemase producers and inducible clindamycin resistance; explain how breakpoints are set from microbiology, pharmacokinetics and clinical outcome data; and apply pharmacokinetic–pharmacodynamic principles to explain why a larger dose of a time-dependent drug is not the answer.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1 to 3. You need Gram stain behaviour, the envelope mechanisms of drug action and the genetic basis of resistance — otherwise a susceptibility report is a list of letters with no mechanism behind them.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Antimicrobial susceptibility testing (AST)",
        text: "The in-vitro measurement of a bacterium's response to an antibiotic, reported either as a zone of inhibition (disc diffusion) or as a minimum inhibitory concentration. The purpose is to predict the clinical outcome of treatment, not merely to describe the organism.",
      },
      {
        type: "paragraph",
        text: "AST is the translation layer between the test tube and the patient. A susceptibility report answers one question: if I give this drug to this patient at a standard dose, is the drug likely to reach a concentration at the site of infection that exceeds what the organism needs. Everything about how the test is set up — the medium, the inoculum, the incubation, the interpretation — exists to make that prediction reliable.",
      },
      {
        type: "paragraph",
        text: "Two facts bound the science, and both matter. First, 'susceptible' is not a property of the organism alone: it is a property of the organism, the drug, the dose, the route and the site. A MIC of 2 mg/L may be treatable in a urine with a highly concentrated drug, but not in cerebrospinal fluid with a poorly penetrating one. Second, the laboratory cannot individualise the dose — it reports against standard exposure, so the clinician must still adjust for organ function, renal replacement and source control.",
      },

      { type: "heading", level: 2, text: "The two quantitative parameters" },
      {
        type: "definition",
        term: "Minimum inhibitory concentration (MIC)",
        text: "The lowest concentration of an antibiotic, in mg/L, that inhibits visible growth of a standardised inoculum after a standard incubation. It is the number that most automated systems report and the number on which breakpoints are set.",
      },
      {
        type: "definition",
        term: "Minimum bactericidal concentration (MBC)",
        text: "The lowest concentration that kills 99.9 per cent of the original inoculum on subculture to drug-free medium. It is determined by subculturing every clear MIC dilution, and it defines the difference between a bacteriostatic and a bactericidal effect against that isolate.",
      },
      {
        type: "paragraph",
        text: "The MIC is reported for the drug, not for the patient, and the adjacent figure that determines whether it is achievable is the drug's pharmacokinetics. A cephalosporin with a lung-tissue concentration fifty times its serum concentration can treat a pneumonia caused by an organism whose MIC would be unacceptable in endocarditis. This is why a report showing 'intermediate' is not a rejection of the drug — it is a statement that the drug may work if exposure can be increased, by dose, by frequency, or by treating a site where the drug concentrates.",
      },

      { type: "heading", level: 2, text: "How the tests are performed" },
      {
        type: "table",
        headers: ["Method", "Principle", "Standardisation that must be honoured", "What it reports"],
        rows: [
          ["Disc diffusion (Kirby–Bauer)", "A filter disc impregnated with one antibiotic concentration is placed on an inoculated agar plate; antibiotic diffuses radially and a zone of inhibition forms", "Mueller–Hinton agar, a 0.5 McFarland inoculum, 35±2°C, 16–18 hours, and a CLSI- or EUCAST-defined disc content", "A zone diameter in millimetres, converted to a category"],
          ["Broth microdilution (MIC)", "Two-fold dilutions of drug in broth are inoculated with a fixed density; the last clear well is the MIC", "Mueller–Hinton broth, 0.5 McFarland, 35±2°C, 16–20 hours; controls each run", "An MIC in mg/L, paired with a breakpoint"],
          ["Agar dilution", "The same dilutions, but poured as plates, so many isolates can be tested against one concentration", "Same conditions; used for reference and for fastidious organisms", "An MIC in mg/L"],
          ["E-test and gradient strips", "A strip carries a continuous exponential gradient of antibiotic; the ellipse of inhibition is read where its edge crosses the strip", "Standard agar and inoculum; used for fastidious organisms and for research", "An MIC read directly against the strip, in mg/L"],
          ["Automated systems (Vitek, Phoenix, BD Phoenix)", "Instrumented broth microdilution cards with rapid colourimetric or fluorometric readout", "Same incubation and density logic, with instrument-specific algorithms", "MICs and categories in 4–12 hours"],
          ["Molecular detection (mecA, vanA, blaCTX-M, blaNDM)", "PCR or hybridisation probes for the resistance determinant itself", "Validated targets and controls; independent of growth", "The gene, and therefore a phenotype, before culture is available"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Standardisation is the whole reason AST can be compared between laboratories in London and Lagos. Mueller–Hinton agar is specified because it is low in inhibitors and free of the para-aminobenzoic acid that would neutralise sulphonamides; its batch is controlled for calcium and magnesium because cation content alters aminoglycoside activity against Pseudomonas; and a 0.5 McFarland inoculum — about 1.5 x 10^8 colony-forming units per millilitre — is specified because a heavier inoculum can make a susceptible organism read falsely resistant.",
      },
      {
        type: "table",
        headers: ["Control strain", "Why it is used", "What an out-of-range result means"],
        rows: [
          ["Escherichia coli ATCC 25922", "A defined wild-type susceptibility profile for a broad drug range", "Disc content, medium or technique has drifted; the batch is void"],
          ["Staphylococcus aureus ATCC 25923", "A wild-type Gram-positive profile, essential for beta-lactam discs", "The medium's thymidine content or inoculum density is wrong"],
          ["Pseudomonas aeruginosa ATCC 27853", "Tests susceptibility of a difficult Gram-negative aerobe", "Cation content or incubation atmosphere is out of specification"],
          ["Enterococcus faecalis ATCC 29212", "Controls glycopeptide and aminoglycoside MICs", "The dilution series or the reading time is wrong"],
        ],
      },

      { type: "heading", level: 2, text: "Reading the report: categories, not absolutes" },
      {
        type: "table",
        headers: ["Category", "Definition", "Clinical action", "Common example"],
        rows: [
          ["Susceptible (S)", "The organism is inhibited at a concentration achievable with a normal dose at the site of infection", "Standard therapy is expected to succeed", "E. coli UTI with amoxicillin–clavulanate MIC 2 mg/L"],
          ["Intermediate (I)", "Inhibited only at a concentration achievable with a maximum tolerated dose, or with poor margin of error; or close to the breakpoint in a technically borderline range", "Clinically usable if exposure can be increased (higher dose, longer infusion, site where the drug concentrates)", "Ceftazidime MIC 8 mg/L in Pseudomonas, treating a urinary infection where the drug concentrates 50-fold"],
          ["Resistant (R)", "Inhibited only at a concentration not achievable by a safe dose at the site", "Do not use; therapy failure is expected", "MRSA reported resistant to all beta-lactams"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "'Intermediate' is not a synonym for 'nearly works' — it is an explicit instruction to think about exposure. The old 'moderately susceptible' label was retired precisely because it invited inaction. An intermediate result demands a decision: increase exposure, treat a site where concentration is favourable, or change drug.",
      },
      {
        type: "paragraph",
        text: "Breakpoints are derived from three converging data sets: the MIC distribution of the target species (the wild-type population must be above the cut-off, resistance mechanisms below it); pharmacokinetic–pharmacodynamic targets — what exposure the drug achieves in blood and tissue and what multiple of MIC is needed; and clinical outcome data from well-characterised patients. Standards bodies (CLSI in the United States, EUCAST in Europe) publish the resulting breakpoints, and each revision is a new clinical judgement, not merely a fresh arithmetic mean.",
      },

      { type: "heading", level: 2, text: "Phenotypic resistance signatures you must recognise" },
      {
        type: "table",
        headers: ["Phenotype", "How the laboratory shows it", "What is happening genetically", "Therapeutic consequence"],
        rows: [
          ["MRSA", "Cefoxitin disc resistant (or a mecA/PBP2a-positive result), whatever the oxacillin disc reads", "mecA on the SCCmec cassette encoding PBP2a, with low affinity for all beta-lactams", "No beta-lactam is usable; treat with a glycopeptide, linezolid, daptomycin or ceftaroline"],
          ["ESBL producer", "Clavulanate synergy — the zone expands towards a clavulanate-containing disc", "Plasmid blaCTX-M hydrolyses third-generation cephalosporins and aztreonam", "Avoid cephalosporins; a carbapenem is standard for serious infection"],
          ["AmpC over-producer", "Chromosomally encoded beta-lactamase inducible by clavulanate; susceptible to cefepime only marginally", "Promoter or attenuator mutation producing constitutive AmpC", "Cefepime with caution; carbapenem for invasive infection"],
          ["Carbapenemase producer", "Meropenem resistant; modified carbapenem inactivation test or a carbapenem disc enhancement positive", "KPC, NDM, VIM, IMP or OXA-48 enzymes, frequently with co-resistance", "Ceftazidime–avibactam or colistin; contact isolation and epidemiological investigation"],
          ["MDR / XDR / PDR (Magiorakos definitions)", "Non-susceptible to at least one, three or all agents in three or more classes", "Accumulation of multiple acquired mechanisms", "Combination therapy and expert consultation mandatory"],
          ["Inducible clindamycin resistance", "Erythromycin resistant, clindamycin appears susceptible in the standard disc test, but the D-test shows flattening of the clindamycin zone", "erm gene methylating 50S ribosomal target, switched on by erythromycin", "Never report clindamycin as usable on the disc test alone — use a D-test or report both resistant"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The modified Hodge test and the carbapenem inactivation test for carbapenemases have largely replaced the modified Hodge test in modern laboratories, and both exist because a carbapenem-resistant organism cannot be assumed to be the only resistance problem — many carbapenemase producers are simultaneously resistant to aminoglycosides and fluoroquinolones, so the full panel, not the single drug, determines therapy.",
      },

      { type: "heading", level: 2, text: "Pharmacokinetics and pharmacodynamics explain the MIC" },
      {
        type: "paragraph",
        text: "Why does one drug need a high peak and another a long time above the MIC? Because the kill pattern differs. Time-dependent drugs (beta-lactams) kill by how long the concentration stays above the MIC, so the target is the percentage of the dosing interval above it; concentration-dependent drugs (aminoglycosides) kill by the peak achieved, so the target is a peak-to-MIC ratio; and exposure-dependent drugs (fluoroquinolones, vancomycin) are best predicted by the area under the curve divided by the MIC.",
      },
      {
        type: "table",
        headers: ["Class", "Kill pattern", "PD target", "Why simply raising a single dose does not help"],
        rows: [
          ["Beta-lactams (penicillins, cephalosporins, carbapenems, monobactams)", "Time-dependent", "Free drug above the MIC for 40–70 per cent of the interval", "A larger dose raises the concentration, but the kinetics already clear the drug below the MIC quickly; prolonged or continuous infusion, or shorter intervals, is the effective strategy"],
          ["Aminoglycosides", "Concentration-dependent, with a post-antibiotic effect", "Peak/MIC ratio of 8–10", "Dividing the dose destroys the peak; the target is a single high daily dose with a trough near zero to protect the kidney"],
          ["Fluoroquinolones", "Exposure-dependent, concentration-augmented", "AUC/MIC ratio above 125 for Gram-negatives", "Raising the dose raises resistance selection pressure at the same time as AUC; toxicity at the tendon and QT interval limits it"],
          ["Vancomycin", "Exposure-dependent against Gram-positives", "AUC/MIC of 400–600 (mg·h/L per MIC)", "Peak-guided dosing has been replaced by AUC-guided dosing because a target peak correlates poorly with nephrotoxicity and outcome"],
        ],
      },
      {
        type: "example",
        text: "A patient with bacteraemia has a Pseudomonas aeruginosa isolate with a ceftazidime MIC of 4 mg/L, just above the susceptible breakpoint and 'intermediate' by the report. The intensive care team changes from bolus dosing to an extended infusion over three hours, so the concentration stays above the MIC for far more of the dosing interval. The organism was never changed; only the exposure was, and the conjugate pharmacology made an 'intermediate' result clinically workable.",
      },

      { type: "heading", level: 2, text: "Special situations the test cannot answer" },
      {
        type: "table",
        headers: ["Situation", "Why routine AST gives a wrong answer", "What to do"],
        rows: [
          ["Meticillin resistance reported as susceptible", "Heteroresistant MRSA expresses PBP2a in a small subpopulation, so the standard incubation reads susceptible", "Use cefoxitin or mecA/PBP2a detection; treat as MRSA"],
          ["Biofilm-associated infection on a prosthetic joint", "Organisms in a biofilm are 10–1000 times less susceptible than planktonic cells", "AST is not interpretable; treatment is device removal plus prolonged combination therapy"],
          ["Bactericidal therapy in endocarditis", "A static MIC result gives no MBC, and some agents (for example a macrolide against pneumococcus) are bacteriostatic", "Determine the MBC, or deliberately choose a combination that is reliably bactericidal"],
          ["Polymicrobial infection", "Each isolate is reported separately, and the drug chosen must work against all of them", "Test every isolate and target the least susceptible member of the group"],
          ["Slow-growing organism", "The organism may not have reached log phase within the standard incubation", "Extend incubation, or use a concentration-independent molecular test"],
          ["Obligate anaerobe", "Standardised methods for anaerobes are technically demanding and less widely validated", "Agar dilution in an anaerobic atmosphere, with reference laboratory confirmation"],
        ],
      },
      {
        type: "code",
        language: "text",
        code: "Susceptibility report -- worked reading\n\n  Organism: Escherichia coli (blood culture)\n  Amoxicillin-clavulanate   MIC 4 mg/L    S\n  Ceftriaxone              MIC <= 1 mg/L S\n  Piperacillin-tazobactam  MIC 4 mg/L    S\n  Gentamicin               MIC 2 mg/L    S\n  Ciprofloxacin            MIC 4 mg/L    R\n  Trimethoprim             MIC > 4 mg/L  R\n\n  Interpretation: empiric ciprofloxacin must be stopped; the beta-lactam classes\n  above remain active and any of them can treat a urinary source at adequate\n  concentration.  Gentamicin synergy with a beta-lactam is available if a\n  bactericidal effect is required.",
        caption:
          "The report gives categories, but the clinician supplies the site, the dose, the source and the patient's organ function — none of which the laboratory knows.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Treating a bigger zone as 'better'. The test compares one isolate against one drug under standardised conditions; a larger zone only means a lower MIC relative to the breakpoint, and it cannot be compared between different discs or different drugs, because disk contents, diffusion properties and breakpoints all differ.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Believing the MIC is the minimum concentration that kills. It is the minimum concentration that inhibits visible growth. The MBC, which is measured by subculturing to drug-free medium, is the number that speaks of killing — and only that number is interpretable in endocarditis or in a neutropenic patient.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Choosing a drug purely because the report says 'S'. The report ignores allergy, renal function, pregnancy, route of administration, penetration into the site and cost. A susceptible aminoglycoside for meningitis is useless because it does not cross the blood–brain barrier; a susceptible macrolide for typhoid is useless because Salmonella is an intracellular organism that the drug cannot reach effectively.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A meningitis isolate reports an 'intermediate' result for ceftriaxone. Why is this result more worrying than the same wording on a urinary isolate?",
        answer:
          "Because ceftriaxone achieves far lower concentrations in cerebrospinal fluid than in urine, so the achievable exposure is the limiting factor. A drug that must cross the blood–brain barrier cannot be rescued by dose escalation in the way a renally concentrated drug can.",
        explanation:
          "The category encodes 'inhibited only at a concentration achievable with a maximum tolerated dose'. When the site of infection limits exposure, the maximum tolerated dose may never be relevant — the concentration at the site is what matters.",
      },
      {
        type: "question",
        prompt: "Why is a 0.5 McFarland inoculum specified for disc diffusion rather than simply 'a visible amount of growth'?",
        answer:
          "Because the inoculum density changes the apparent result: too heavy an inoculum makes a susceptible organism read falsely resistant and artificially shrinks zones; too light inflates them.",
        explanation:
          "Standardisation exists so that the zone diameter has one meaning across thousands of laboratories, and every deviation from the specified density, medium or incubation voids the comparison to the published breakpoint tables.",
      },
      {
        type: "question",
        prompt: "A Staphylococcus aureus isolate is erythromycin resistant but clindamycin susceptible on the routine disc test. What must the laboratory do before reporting clindamycin as usable?",
        answer:
          "Perform a D-test, placing the erythromycin and clindamycin discs adjacent; if the clindamycin zone is flattened towards erythromycin, clindamycin resistance is inducible and the drug must be reported as resistant despite the disc result.",
        explanation:
          "The erm gene encodes a methylase that alters the 50S ribosomal target; it is inducible by erythromycin and constitutive expression can emerge during therapy, converting a 'susceptible' report into clinical failure.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which definition is correct?",
        options: [
          "The MIC is the lowest concentration that kills the organism, and the MBC is the lowest that inhibits visible growth.",
          "The MIC is the lowest concentration that inhibits visible growth, and the MBC is the lowest that kills 99.9 per cent of the inoculum on subculture.",
          "The MIC and MBC are the same value, differing only in the medium used to measure them.",
          "The MIC is measured by disc diffusion and the MBC by gradient strip.",
        ],
        correctIndex: 1,
        explanation:
          "MIC is the inhibition endpoint and MBC is the killing endpoint, determined by subculturing every clear broth dilution onto drug-free agar. Gradient strips and disc diffusion both estimate the MIC; only a subculture method measures the MBC.",
      },
      {
        type: "mcq",
        stem: "An enterococcus isolated from a heart valve shows an MIC of 8 mg/L to ampicillin. Why does the laboratory determine the MBC rather than simply reporting the MIC?",
        options: [
          "Because endovascular infection requires a bactericidal endpoint, and an ampicillin MIC alone cannot tell whether the drug kills.",
          "Because the MBC is needed to classify the result as susceptible or intermediate.",
          "Because enterococci do not form readable zones in disc diffusion.",
          "Because the MBC predicts the post-antibiotic effect of beta-lactams.",
        ],
        correctIndex: 0,
        explanation:
          "Bactericidal therapy is required in endocarditis, and the MBC is what distinguishes inhibition from killing. Categories derive from MIC and breakpoints; enterococci give perfectly readable disc zones; and the post-antibiotic effect is a pharmacodynamic property, not an MBC readout.",
      },
      {
        type: "mcq",
        stem: "Why is a cephalosporin given as a prolonged or continuous infusion rather than as a larger bolus in a seriously ill patient?",
        options: [
          "Because the bolus is rapidly excreted, and the kill is time-dependent, so the target is the percentage of the dosing interval during which free drug stays above the MIC.",
          "Because the bolus increases the risk of nephrotoxicity, which is the dose-limiting effect.",
          "Because the bolus has a higher peak-to-MIC ratio, which selects resistance.",
          "Because cephalosporins have no post-antibiotic effect, which the infusion supplies.",
        ],
        correctIndex: 0,
        explanation:
          "Beta-lactams are time-dependent agents: their effect depends on the time above the MIC, not on the peak. Extending the infusion lengthens that time without raising nephrotoxicity, whereas a larger bolus produces a short high peak that adds little and can increase selection pressure.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Susceptibility testing converts bacterial genotype into a clinically usable prediction: the MIC says at what concentration growth is inhibited, the MBC whether it is killed, and the categories — susceptible, intermediate, resistant — what that means for a standard dose. The methods are standardised to the millimetre and the McFarland unit because a zone diameter is only meaningful against published breakpoints, and breakpoints are derived from MIC distributions, pharmacokinetics and clinical outcomes together. Recognising the phenotypes — MRSA, ESBL, carbapenemase, inducible clindamycin — is reading the same resistance genetics you met in the previous lesson.",
      },
      {
        type: "paragraph",
        text: "Next: the first lesson of module 2, innate immunity. You have been studying the bacteria; now you meet the host — the barriers, the phagocytes, complement and pattern-recognition receptors that respond within minutes and need no previous encounter with the organism.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 5 — Innate immunity (fully authored)
// ---------------------------------------------------------------------------
function lesson5() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the three classes of innate barrier — anatomical, chemical and microbiological — with named examples of each; explain how pattern-recognition receptors distinguish conserved microbial structures from self, and name the ligands of Toll-like receptors 2, 3, 4 and 5; describe the complement cascade by its entry route, its three effectors of elimination and its regulator CR1; describe phagocytosis and killing, including the respiratory burst and the defect that causes chronic granulomatous disease; describe natural killer cell killing and the 'missing self' principle; and explain inflammation as a local response and the acute-phase response as its systemic counterpart.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Module 1 — bacterial cell structure and genetics. Innate immunity recognises exactly the structures you have studied: lipopolysaccharide, peptidoglycan, flagellin and double-stranded RNA are the signatures of the walls and genomes you have already met.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Innate immunity",
        text: "The form of host defence that is present at birth, acts within minutes, is encoded by germline genes so it needs no prior exposure, is specific for conserved molecular patterns that microbes cannot change, and generates no memory of the encounter.",
      },
      {
        type: "paragraph",
        text: "Adaptive immunity is extraordinary, but it is slow: days to build a receptor and more days to expand it. Innate immunity is what keeps you alive in the meantime, and it works by recognising the category of the invader rather than the identity of the strain. Its receptors have been hard-wired by evolution to notice things that no microbe can afford to lose — lipopolysaccharide on the Gram-negative envelope, peptidoglycan shared by nearly all bacteria, double-stranded RNA made only in viral replication — so the pathogen cannot simply mutate to escape, as it can from a single antibody.",
      },
      {
        type: "paragraph",
        text: "Innate immunity is therefore not the crude 'first line' of a textbook diagram; it is the determinant of whether adaptive immunity ever gets started. The receptor that triggers a dendritic cell to mature also enables it to present antigen and release the cytokines that decide whether a T-cell response becomes Th1 or Th2. An innate response that fails to fire gives no adaptive response either — which is why some immune deficiencies present as repeated infection despite normal antibody counts.",
      },

      { type: "heading", level: 2, text: "Barriers: the first line" },
      {
        type: "table",
        headers: ["Class", "Examples", "Mechanism of defence", "What loss looks like"],
        rows: [
          ["Anatomical", "Skin, mucosae of gut, respiratory and genitourinary tracts, conjunctiva, gut epithelium", "A mechanical wall of keratinised cells and tight junctions that microbes cannot cross; mucus traps them; cilia sweep them out", "Burns, indwelling catheters and cystic fibrosis all defeat this layer, and infection follows"],
          ["Chemical", "Fatty acids and sweat, saliva lysozyme, gastric acid, surfactant proteins, defensins, lactoferrin", "Direct killing or growth inhibition — gastric acid kills most swallowed bacteria, lactoferrin starves iron-dependent organisms, defensins punch holes in membranes", "Achlorhydria, proton-pump inhibitors and antibiotics all disturb the ecology and permit colonisation"],
          ["Microbiological", "Commensal flora of skin, mouth, gut and vagina", "Competition for nutrients and adhesion sites, and production of bacteriocins and volatile acids that suppress pathogens", "Broad-spectrum antibiotics destroy the flora and allow Candida and Clostridioides difficile to fill the vacuum"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The stomach alone demonstrates the value of a chemical barrier: gastric acid at pH 2 kills most ingested bacteria within minutes, which is why Vibrio cholerae needs a large inoculum and why persons taking proton-pump inhibitors have measurably more enteric infections. Helical and flagellated organisms such as Helicobacter pylori survive it by burrowing into mucus and secreting urease.",
      },

      { type: "heading", level: 2, text: "Pattern recognition: how innate immunity sees a microbe" },
      {
        type: "definition",
        term: "Pathogen-associated molecular pattern (PAMP)",
        text: "A conserved, repetitive molecular structure found in whole classes of microbes and absent from the host — lipopolysaccharide, peptidoglycan, lipoteichoic acid, flagellin, unmethylated CpG DNA, and double-stranded RNA. It is a signature, not an antigen.",
      },
      {
        type: "paragraph",
        text: "The receptors that read these signatures are germline-encoded pattern-recognition receptors: Toll-like receptors on the cell surface and in endosomes, C-type lectins that recognise fungal mannans, NOD-like receptors that read peptidoglycan fragments in the cytosol, and RIG-I-like receptors that read viral RNA. Their ligands are the envelope components of module 1 and the nucleic acids of module 3.",
      },
      {
        type: "table",
        headers: ["Receptor", "Location", "Recognises", "Signalling result", "Clinical consequence of defect"],
        rows: [
          ["TLR1/2 (heterodimer)", "Cell surface", "Lipopeptides, peptidoglycan, lipoteichoic acid", "NF-kB activation and inflammatory cytokines", "Increased susceptibility to Gram-positive infection"],
          ["TLR4", "Cell surface", "Lipopolysaccharide, with CD14 and MD-2 as co-receptors", "A very strong inflammatory cascade; the receptor for endotoxin", "TLR4 mutations give blunted responses to endotoxin and altered sepsis risk"],
          ["TLR5", "Cell surface", "Flagellin", "NF-kB and chemokine production", "Increased risk of Legionella pneumonia, since flagellin drives the response"],
          ["TLR3", "Endosome", "Double-stranded RNA, made during viral replication", "Type I interferon production via TRIF", "Impaired antiviral response, notably to herpes simplex encephalitis"],
          ["TLR7 and TLR8", "Endosome", "Single-stranded RNA and guanosine analogues", "Type I interferon and interleukin-12; the target of imiquimod and hydroxychloroquine", "Defects predispose to severe influenza and COVID-19"],
          ["TLR9", "Endosome", "Unmethylated CpG dinucleotides characteristic of bacterial DNA", "Interleukin-12 and interferon-alpha; the adjuvant effect of CpG oligonucleotides", "Altered response to DNA-adjuvanted vaccines"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Endosomal location is a deliberate safeguard. By placing TLR3, 7 and 9 inside the cell rather than on the surface, the innate system only encounters nucleic acids after the microbe has been engulfed and digested, which prevents a harmless self-nucleic acid in serum from triggering autoimmunity. The price is a disease: TLR7/9 defects, and the systemic lupus-like disease of TREX1 deficiency, follow from failure to distinguish self nucleic acids properly.",
      },

      { type: "heading", level: 2, text: "Complement: an innate cascade with wide consequences" },
      {
        type: "definition",
        term: "Complement",
        text: "A system of over thirty plasma and membrane proteins that are activated in sequence, mainly by the liver, and act as an innate effector of inflammation, opsonisation and direct lysis — and are also a bridge to adaptive immunity.",
      },
      {
        type: "paragraph",
        text: "The complement cascade has three entry routes. The classical route is triggered by antibody (C1q binding to the Fc region of IgM or aggregated IgG), so it belongs to adaptive immunity but is mediated by an innate protein. The lectin route is triggered by mannose-binding lectin or ficolins binding microbial carbohydrate, with MASP enzymes activating C4 and C2. The alternative route is spontaneous and continuous: C3 thioester hydrolysis ('tick-over') deposits C3b on any nearby surface, and microbial surfaces lack the complement regulators that would destroy it, so amplification continues there.",
      },
      {
        type: "table",
        headers: ["Pathway", "Trigger", "First component activated", "Roles"],
        rows: [
          ["Classical", "Antigen–antibody complex: C1q binds IgM or IgG Fc", "C1q, then C1r, C1s, C4, C2", "Effector of the adaptive response; measured in CH50 functional assays"],
          ["Lectin", "Mannose-binding lectin or ficolin bound to microbial sugars", "MASP-1 and MASP-2, then C4, C2", "Independent of antibody, and impaired by the common MBP gene mutation"],
          ["Alternative", "Spontaneous C3 hydrolysis and microbial surface binding", "C3b, factor B, factor D", "The amplification loop — it generates most of the C3b and C5b"],
          ["Terminal (common)", "C3 convertase activity and C5 cleavage", "C5, C6, C7, C8, C9", "The membrane attack complex, which lyses bacteria by drilling holes in the membrane"],
        ],
      },
      {
        type: "paragraph",
        text: "Once activated, complement eliminates in three ways. C3b is an opsonin that coats the microbe and is eaten by phagocytes bearing complement receptors; C3a and C5a are anaphylatoxins that degranulate mast cells and recruit neutrophils (and, at C5a levels, cause the shock picture of meningococcaemia); and C5b–C9 form the membrane attack complex, a cylinder of several complement components inserted into the membrane, which kills Gram-negative bacteria but which cannot easily attack Gram-positive ones because their wall is too thick.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Complement deficiency is the counterintuitive exception to 'immune deficiency means repeated infection'. Deficiencies of the early components — C1q, C2, C4 — cause systemic lupus erythematosus, because the complement system normally clears immune complexes. Deficiencies of the late components (C5–C9) cause recurrent Neisseria infection, because only the membrane attack complex reliably destroys Neisseria meningitidis and Neisseria gonorrhoeae. A patient with recurrent meningococcal sepsis must be screened for terminal complement deficiency.",
      },

      { type: "heading", level: 2, text: "Phagocytes and killing" },
      {
        type: "paragraph",
        text: "Phagocytes are the cell-bound arm of innate immunity. Neutrophils arrive first — within six to eight hours — and are short-lived; macrophages follow later, persist in tissues and do the clearing up; dendritic cells interrogate antigen and carry it to lymph nodes to start the adaptive response. All three engulf an opsonised particle into a phagosome, which fuses with lysosomal granules to make a phagolysosome, and all three kill with oxygen-dependent and oxygen-independent mechanisms.",
      },
      {
        type: "table",
        headers: ["Killing mechanism", "How it works", "Consequence of failure"],
        rows: [
          ["Respiratory burst", "NADPH oxidase transfers electrons to oxygen to make superoxide, which dismutates to hydrogen peroxide", "Chronic granulomatous disease (X-linked) — recurrent catalase-positive infections and granulomas"],
          ["Myeloperoxidase", "Uses hydrogen peroxide and chloride to make hypochlorous acid, the most efficient neutrophil bactericide", "Blunted killing, but usually clinically silent because other pathways compensate"],
          ["Defensins and lactoferrin", "Antimicrobial peptide damage and iron sequestration", "Rare single-gene defects with mild phenotypes"],
          ["Low pH and lysosomal enzymes", "Proteases and hydrolases digest the engulfed and killed organism", "Chédiak–Higashi syndrome: giant granules and defective degranulation"],
        ],
      },
      {
        type: "definition",
        term: "Opsonisation",
        text: "The coating of a microbe with molecules — antibody, C3b, or both — that are recognised by phagocyte receptors, which makes phagocytosis markedly more efficient. Opsonisation is the bridge between humoral immunity and the innate cell that does the eating.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Neutrophil extracellular traps explain a puzzle: how does a neutrophil kill organisms it cannot engulf, such as a fungal hypha that is many times its own diameter? It decondenses its chromatin, mixes it with granule enzymes and extrudes it as a web that traps and kills the filament. DNase treatment dissolves these traps, which is why DNase is an inhaled therapy in cystic fibrosis.",
      },

      { type: "heading", level: 2, text: "Natural killer cells and the missing self" },
      {
        type: "paragraph",
        text: "Natural killer cells are large granular lymphocytes that kill without prior sensitisation, using the same perforin–granzyme and Fas-FasL machinery that cytotoxic T cells use. Their specificity comes from a negative rule: they express inhibitory receptors for MHC class I, and any cell that displays normal MHC class I is spared. A cell that has lost MHC class I — a virally infected cell or a tumour cell — loses the inhibitory signal and is killed.",
      },
      {
        type: "paragraph",
        text: "This is why NK cells matter in herpesvirus infection specifically. Cytomegalovirus and others encode proteins that downregulate MHC class I to hide from CD8 T cells — a strategy that works for cytotoxic T cells but leaves the cell exposed to natural killing, because the missing MHC class I is exactly the signal the NK inhibitory receptor was looking for. Viral decoy mechanisms such as MHC-I homologues that engage inhibitory receptors are the counter-countermeasure.",
      },

      { type: "heading", level: 2, text: "Inflammation and the acute-phase response" },
      {
        type: "definition",
        term: "Inflammation",
        text: "The vascular and cellular response to tissue injury or infection, characterised by vasodilation, increased permeability, leukocyte recruitment and — if resolution fails — fibrosis. Its four classical signs are rubor, calor, tumor and dolor: redness, heat, swelling and pain.",
      },
      {
        type: "table",
        headers: ["Event", "Mediator", "Effect", "Clinical reading"],
        rows: [
          ["Vasodilation", "Histamine, prostaglandins, nitric oxide", "Redness and heat of the inflamed tissue", "Erythema — the cardinal bedside sign"],
          ["Increased permeability", "Histamine, bradykinin, leukotrienes", "Exudate of protein-rich fluid into tissue", "Swelling and pain from tissue tension"],
          ["Neutrophil recruitment", "C5a and leukotriene B4 chemotaxis, selectin and integrin adhesion", "Leukocyte margination, rolling, and exit through vessel wall", "Neutrophils predominate in the first six hours, pus is their residue"],
          ["Fever", "Interleukin-1, interleukin-6 and tumour necrosis factor acting on the hypothalamus", "Prostaglandin E2 raises the thermostatic set-point", "Fever responds to aspirin and ibuprofen by blocking cyclo-oxygenase"],
          ["Acute-phase response", "Hepatic C-reactive protein, serum amyloid A, fibrinogen and hepcidin", "Complement activation and iron sequestration; a raised erythrocyte sedimentation rate from fibrinogen", "A CRP and ESR rise is the laboratory signature of innate activation"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Fever is not a failure of temperature regulation — it is a raised set-point, and the chills that follow are thermogenesis at work. Fever is therefore a sign to investigate, not automatically a symptom to suppress, and the commonest bedside error is to give an antipyretic before a blood culture is drawn, because paracetamol can transiently sterilise culture yield and conceal bacteraemia.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Describing innate immunity as 'non-specific'. It is specific in the sense that a receptor binds a defined molecular structure; it is indiscriminate in the sense that it cannot distinguish between members of a species — any LPS is recognised by TLR4, whatever the organism. The accurate statement is 'specific for conserved molecular patterns, not for antigenic determinants'.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Locating natural killer cells inside adaptive immunity because they are effector cells. They are innate lymphocytes: they need no prior antigen exposure, they do not rearrange antigen-receptor genes, and they respond to a missing-self signal rather than a presented antigen.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Thinking complement always works by lysis. For most Gram-positive organisms, opsonisation by C3b and inflammation from C5a matter far more than the membrane attack complex, which cannot pass through a thick peptidoglycan wall. Deficiency of C5, C6, C7, C8 or C9 produces a narrow phenotype — recurrent Neisseria — precisely because other routes do the rest of the work.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why is lipopolysaccharide an ideal signature for innate immunity to detect?",
        answer:
          "Because it is a structure every Gram-negative bacterium must build, it is absent from human cells, and the lipid A portion is chemically invariable, so TLR4 can safely recognise it across the whole class.",
        explanation:
          "Innate receptors are chosen precisely by this logic: the ligand must be conserved, essential to the microbe, and absent from the host. Mutating lipid A is lethal for the bacterium, so the receptor cannot be escaped.",
      },
      {
        type: "question",
        prompt: "A patient has recurrent episodes of meningococcal septicaemia. Complement screening shows low CH50. Which components should be measured and why?",
        answer:
          "Terminal components C5, C6, C7, C8 and C9, because the membrane attack complex is the only defence that reliably clears Neisseria meningitidis, and deficiency of any of them predisposes specifically to recurrent meningococcal disease.",
        explanation:
          "A low CH50 indicates a defect anywhere in the classical pathway, so component-specific assays then localise it. Early-component defects present as lupus-like disease rather than as Neisseria infection.",
      },
      {
        type: "question",
        prompt: "Why do viruses that downregulate MHC class I become vulnerable to natural killer cells?",
        answer:
          "Because NK cells carry inhibitory receptors for MHC class I; a cell displaying normal MHC class I is spared, but a cell that has lost it triggers NK killing. Hiding from CD8 T cells therefore exposes the cell to natural killer cells.",
        explanation:
          "Cytomegalovirus carries decoy MHC-I homologues that engage the inhibitory receptors, which is the viral countermeasure and the reason 'missing self' is a rule rather than an absolute.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which pairing of Toll-like receptor and ligand is correct?",
        options: [
          "TLR4 with flagellin, TLR3 with double-stranded RNA, TLR5 with lipopolysaccharide",
          "TLR4 with lipopolysaccharide, TLR5 with flagellin, TLR3 with double-stranded RNA",
          "TLR2 with unmethylated CpG DNA, TLR9 with peptidoglycan",
          "TLR7 with double-stranded DNA, TLR3 with single-stranded RNA",
        ],
        correctIndex: 1,
        explanation:
          "TLR4–lipopolysaccharide is the endotoxin receptor; TLR5 reads flagellin; TLR3, located in endosomes, reads double-stranded RNA made during viral replication. TLR9 reads unmethylated CpG, and TLR7 and TLR8 read single-stranded RNA.",
      },
      {
        type: "mcq",
        stem: "A patient has recurrent Neisseria meningitidis sepsis, a low CH50, and normal C3 and C4. Which defect is most likely?",
        options: [
          "C1q deficiency", "C2 deficiency", "A terminal complement component (C5–C9) deficiency", "A factor B deficiency"],
        correctIndex: 2,
        explanation:
          "Terminal component deficiency spares C3 and C4 but prevents membrane attack complex formation, which is the mechanism that clears Neisseria. C1q or C2 deficiency causes lupus-like disease with normal or low CH50, but not the characteristic Neisseria susceptibility.",
      },
      {
        type: "mcq",
        stem: "A child with X-linked chronic granulomatous disease is infected with a catalase-negative organism. Which mechanism is defective, and why may the infection be less severe than with a catalase-positive one?",
        options: [
          "The NADPH oxidase complex fails, so no respiratory burst occurs; catalase-negative organisms generate their own hydrogen peroxide that myeloperoxidase can use, but catalase-positive organisms destroy it and so survive better.",
          "Myeloperoxidase is absent, so hypochlorous acid is not made; catalase-positive organisms supply their own chloride.",
          "The vesicle fusion step fails, so phagolysosomes form but phagosomes do not.",
          "Complement C3 cannot be deposited on microbial surfaces, so opsonisation fails at the receptor.",
        ],
        correctIndex: 0,
        explanation:
          "NADPH oxidase failure is the primary defect in chronic granulomatous disease; the residual killing from the organism's own hydrogen peroxide only works if the organism cannot destroy it, so catalase-positive organisms such as Staphylococcus aureus are the classic severe pathogens there.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Innate immunity responds in minutes, is encoded by germline genes, and is specific for conserved microbial patterns rather than antigenic determinants: TLR4 for lipopolysaccharide, TLR5 for flagellin, TLR3 for double-stranded RNA, NOD for peptidoglycan. It acts through the complement cascade — classical, lectin and alternative entry to a common terminal — by opsonisation, anaphylatoxin inflammation and the membrane attack complex; through neutrophil, macrophage and dendritic-cell phagocytosis; and through natural killer cell killing on the missing-self principle. Failure of the late complement pathway gives recurrent Neisseria disease, which is one of the most useful facts in clinical immunology.",
      },
      {
        type: "paragraph",
        text: "Next: humoral adaptive immunity. You will move from the innate system that sees a category to the one that sees a molecule: B-cell activation, the five antibody classes with their very different distributions and functions, affinity maturation, and how to read a serology report.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 6 — Humoral adaptive immunity (fully authored)
// ---------------------------------------------------------------------------
function lesson6() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe B-cell development and the receptor-rearrangement that creates antibody diversity; distinguish T-dependent from T-independent antigens and explain which vaccine types follow which route; describe B-cell activation, the germinal-centre reaction, somatic hypermutation and affinity maturation; describe the five classes of immunoglobulin with their structure, distribution and dominant function; explain the primary and secondary antibody responses and how serology reports them; and interpret a serology report in a specific clinical scenario, including the window period.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 5 — Innate immunity. You need complement, opsonisation and the dendritic cell that presents antigen to the T cell which in turn helps the B cell.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Humoral adaptive immunity",
        text: "The antibody-mediated arm of adaptive immunity. B lymphocytes recognise antigen directly through surface immunoglobulin, and after activation differentiate into plasma cells that secrete soluble antibody, which neutralises toxin and virus, opsonises bacteria and activates complement.",
      },
      {
        type: "paragraph",
        text: "Each B cell carries one antibody of one specificity on its surface, and the population as a whole carries millions of specificities. Activation of a clone expands it enormously, so a tiny precursor frequency becomes a large effector response — and the same machinery produces memory cells, whose expanded clone gives the second response its speed and its volume.",
      },
      {
        type: "paragraph",
        text: "The defining property of humoral immunity is that it acts on the extracellular world. It cannot see an organism once it is inside a cell, which is why intracellular pathogens — mycobacteria, Salmonella, chlamydiae, viruses — are controlled by cell-mediated immunity and stalled by antibodies. Where a patient has lost all antibody production, they get encapsulated pus-forming bacteria; where they have lost T cells, they get intracellular organisms and viruses.",
      },

      { type: "heading", level: 2, text: "B-cell development" },
      {
        type: "paragraph",
        text: "B cells are made in the bone marrow. In the pro-B-cell stage, the immunoglobulin heavy-chain gene is assembled by somatic recombination: RAG-1 and RAG-2 cut and rejoin a D segment to a J segment and then to a V segment. In the pre-B-cell stage the light-chain locus undergoes the same recombination, and a functional light chain pairs with the mu heavy chain to make surface IgM. Because each recombination is imprecise, and because terminal deoxynucleotidyl transferase inserts random nucleotides at the junctions, the joining itself creates diversity before any antigen is met.",
      },
      {
        type: "table",
        headers: ["Stage", "What is happening", "Checkpoint"],
        rows: [
          ["Pro-B", "Heavy-chain D to J, then V to DJ recombination", "Whether a heavy chain can be made at all"],
          ["Pre-B", "Light-chain V to J recombination; heavy chain pairs with surrogate light chain", "Whether the mu chain and the surrogate make a signalling-competent pre-B receptor"],
          ["Immature B", "Full surface IgM is expressed and one light chain is in place", "Negative selection in the bone marrow — a strongly self-reactive receptor is deleted"],
          ["Transitional B in spleen", "Co-expression of IgD begins alongside IgM", "Escape from central tolerance"],
          ["Mature naive B", "Surface IgM and IgD; recirculating between blood and lymphoid follicles", "Ready to meet antigen"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "One in every three B cells in a healthy adult is autoreactive at the time it leaves the marrow, and peripheral mechanisms — receptor editing, anergy, and regulatory T-cell suppression — eliminate or neutralise the rest. The failure of those peripheral mechanisms, not the bone marrow, is where most autoimmune disease begins.",
      },

      { type: "heading", level: 2, text: "Antigen types: why this matters for vaccines" },
      {
        type: "table",
        headers: ["Antigen class", "Examples", "Response without T help?", "Ig classes made", "Vaccine significance"],
        rows: [
          ["T-dependent", "Proteins, peptides, glycoproteins, toxoids", "No — needs a T follicular helper cell", "IgM, then class-switched IgG, IgA or IgE; affinity maturation and memory", "The strongest, most durable vaccines — toxoid, subunit and mRNA vaccines"],
          ["T-independent type 1", "Lipopolysaccharide, other mitogenic structures", "Yes, at high dose", "Mostly IgM, weak class switch", "Poor vaccine antigens; used as adjuvants and carriers"],
          ["T-independent type 2", "Repeating polysaccharides, capsular polymers", "Yes — cross-link the B-cell receptor directly", "IgM, limited switched memory", "Plain polysaccharide vaccines are poorly immunogenic below age two and give short-lived immunity"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The conjugate vaccines are the answer to the T-independent problem. By linking the capsular polysaccharide of Haemophilus influenzae type b, Streptococcus pneumoniae or Neisseria meningitidis to a carrier protein, the vaccine converts a T-independent response into a T-dependent one: T cells that recognise the protein provide help, so the B cell makes IgG, undergoes affinity maturation and produces memory. This is why Hib conjugate works in infants when plain polysaccharide did not, and it is the most important design lesson in vaccine immunology.",
      },

      { type: "heading", level: 2, text: "B-cell activation and the germinal centre" },
      {
        type: "paragraph",
        text: "Activation requires two signals. The first is antigen cross-linking the B-cell receptor — the surface immunoglobulin — which delivers a primary signal through Ig-alpha and Ig-beta. The second comes from the T follicular helper cell: CD40 ligand engages CD40 on the B cell and interleukins 4, 21 and 10 direct class switching. A second, early pathway activates the B cell through TLRs receiving microbial PAMP, which is how an innate signal answers the question of whether the antigen is also dangerous.",
      },
      {
        type: "paragraph",
        text: "After activation, the clone B cells enter a primary follicle and form a germinal centre. In the dark zone the cells proliferate rapidly and their variable-region genes are mutated by activation-induced cytidine deaminase, at roughly one mutation per cell per division — a thousand times the normal somatic mutation rate. In the light zone, selection decides which mutations survive: follicular dendritic cells display intact antigen on their processes, and only a cell whose mutated receptor binds that antigen more avidly is permitted to recapture it and present peptide to the T helper cell.",
      },
      {
        type: "definition",
        term: "Affinity maturation",
        text: "The progressive increase in average antibody affinity during an immune response, produced by the combined action of somatic hypermutation and antigen-driven selection in the germinal centre. It is the reason the IgG made late in an infection is chemically different from the IgM made earlier — the same clone, improved.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Germinal centres are measurable at work. After vaccination, a lymph node enlarges and high-endothelial venules permit the entry that the response needs; the somatic hypermutation rate is so high that the response can be followed by sequencing the variable genes of individual responding B cells — and those sequences are the basis of research into next-generation vaccines.",
      },

      { type: "heading", level: 2, text: "The immunoglobulins" },
      {
        type: "table",
        headers: ["Class", "Structure", "Concentration in serum", "Distribution and half-life", "Dominant functions"],
        rows: [
          ["IgM", "Pentamer of five basic units, with a J chain; largest antibody at 900 kDa", "About 0.5–2 g/L", "Confined to intravascular space because of its size; half-life about 5 days", "The first antibody made; the most efficient complement activator; the anti-blood-group and anti-bacterial antibodies; IgM cannot cross the placenta"],
          ["IgG", "Monomer, 150 kDa; four subclasses IgG1, IgG2, IgG3, IgG4", "About 8–16 g/L, roughly 75 per cent of serum immunoglobulin", "Distributed intra- and extra-vascularly; half-life about 23 days", "The workhorse: neutralisation, opsonisation, complement activation (IgG1 and IgG3 best), and the only class that crosses the placenta"],
          ["IgA", "Monomer in serum, dimer with a secretory component at mucosal surfaces; half-life about 6 days", "About 2–3 g/L in serum, and the dominant class on mucosal surfaces", "Secretory IgA is produced by lamina propria plasma cells and transported across epithelium by the polymeric immunoglobulin receptor", "Mucosal immunity: neutralises viruses and bacteria at the gut, respiratory and genitourinary surfaces before they cross"],
          ["IgD", "Monomer; serum concentration very low and half-life about 3 days", "Mainly as surface IgD on naive B cells", "Functions as a B-cell receptor and a component of regulatory signalling"],
          ["IgE", "Monomer, 190 kDa; the lowest serum concentration of the classes", "Bound to mast cells and basophils through the high-affinity Fc epsilon receptor I", "Type I hypersensitivity and defence against helminths — mast cell degranulation releases histamine and eosinophil-recruiting factors"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Two facts about IgA are worth memorising. First, secretory IgA is made as a dimer and carried across the epithelium by the poly-Ig receptor, which leaves the secretory component still attached after cleavage — that is why gut IgA contains the protective component that resists proteolysis. Second, breast milk is rich in secretory IgA, and the first colostrum is the single most important passive protection a newborn receives for the first weeks of life.",
      },

      { type: "heading", level: 2, text: "Class switching changes the constant region, not the specificity" },
      {
        type: "paragraph",
        text: "Each antibody class has the same variable region once a clone has been selected — the same antigen-binding site — and differs only in its constant region, which determines its tissue distribution and its effector functions. Switching is mediated by switch recombination upstream of the constant-region genes, directed by cytokines: interleukin-4 and interleukin-13 drive IgE and IgG4 switching, interferon-gamma drives IgG1 and IgG3, and transforming growth factor-beta and interleukin-5 drive IgA in the gut.",
      },
      {
        type: "table",
        headers: ["Cytokine", "Switches toward", "Immunological context"],
        rows: [
          ["Interleukin-4 (and interleukin-13)", "IgE and IgG4", "A Th2-dominated response — helminths, allergy, asthma"],
          ["Interferon-gamma", "IgG1 and IgG3 (in humans), which fix complement well", "A Th1-dominated response to intracellular organisms"],
          ["Transforming growth factor-beta, interleukin-5, interleukin-10", "IgA", "Mucosal immune response in gut and respiratory lamina propria"],
        ],
      },

      { type: "heading", level: 2, text: "Primary and secondary responses, and what serology means" },
      {
        type: "table",
        headers: ["Feature", "Primary response", "Secondary response"],
        rows: [
          ["Lag after exposure", "About 3–5 days before antibody is detectable", "About 1–2 days"],
          ["Class made first", "IgM, then IgG after class switching", "IgG immediately, with only a brief IgM tail"],
          ["Peak titre", "Low and short-lived", "High and sustained for months to years"],
          ["Affinity", "Low, improving through maturation", "High — the memory cell has already matured"],
          ["Cells responsible", "Naive B cells", "Memory B cells, already expanded and switched"],
        ],
      },
      {
        type: "paragraph",
        text: "This is why serology reports carry a class label. IgM suggests recent infection — but with an important caveat, because IgM persists for weeks to months, is made again on re-exposure, and gives false positives with rheumatoid factor and Epstein–Barr virus. A single IgG titre is only evidence of past exposure. The strongest serological argument for recent infection is a pair: a fourfold or greater rise in IgG titre between an acute and a convalescent sample, two to three weeks apart.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "The window period defeats single-sample serology. In HIV, viral RNA is detectable within about ten days and p24 antigen within about two weeks, but antibody may not be detectable for three to twelve weeks — so an early negative HIV test in a patient with a clear exposure must be repeated, and a fourth-generation combination test, or a nucleic acid test, is the answer.",
      },
      {
        type: "example",
        text: "A pregnant woman has rubella IgG positive at 320 IU/mL and IgM negative. The report is evidence of past vaccination or past infection, not of current infection. Her immunity protects the fetus, so no action is needed. Were her IgM positive and IgG borderline, the correct response is a repeat sample two weeks later and comparison of titres, plus specialist advice — because rubella in early pregnancy threatens the fetus.",
      },

      { type: "heading", level: 2, text: "Therapeutic antibodies" },
      {
        type: "paragraph",
        text: "The same machinery that natural specificity provides is the basis of monoclonal antibody therapy. A mouse antibody is humanised to reduce immunogenicity, retaining only the complementary-determining regions that bind antigen. Rituximab removes CD20-positive B cells and depletes humoral immunity, which is why pre-treatment hepatitis B screening is mandatory before it is given; infliximab neutralises tumour necrosis factor; and bevacizumab binds vascular endothelial growth factor. These drugs are humoral immunity applied deliberately — and their complication is precisely the loss of antibody function that depletes humoral immunity.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying IgG means 'old infection' and IgM means 'new infection'. IgM persists for some months and may be re-elicited on re-exposure; IgG appears early in a strong secondary response. The stronger statement is that IgM in a single sample suggests recent infection, and IgG requires a fourfold rise or a documented seroconversion.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Thinking class switching changes what the antibody binds. It changes the constant region — the effector tail — and therefore the tissue distribution and the complement-fixing ability, but the variable region, and therefore the antigen-binding site, is unchanged.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing humoral with cellular immunity by disease. Antibody deficiency gives repeated sinopulmonary infection with encapsulated organisms: the killed-virus vaccine immunogenicity is lost, and live vaccines of any kind can be given because cell-mediated immunity is intact. T-cell deficiency gives opportunistic intracellular infection: Pneumocystis, chronic cryptosporidiosis, disseminated BCG after live vaccination — and live vaccines are dangerous.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why do plain polysaccharide vaccines fail in children under two years of age, and how does a conjugate vaccine solve the problem?",
        answer:
          "Because a plain repeating polysaccharide makes a T-independent response of short-lived IgM and limited memory, and infants cannot generate it appreciably. A conjugate bonds the polysaccharide to a protein carrier, so protein-specific T follicular helper cells provide CD40 help, the B cell class-switches to IgG, affinity maturation occurs and memory is produced.",
        explanation:
          "The conjugate conversion is the reason Hib, pneumococcal and meningococcal vaccines are now all conjugates in infant schedules, and why booster doses protect for years rather than months.",
      },
      {
        type: "question",
        prompt: "A laboratory reports a single sample positive for rubella IgG and negative for rubella IgM in a woman at 10 weeks of pregnancy. What does it mean and what action follows?",
        answer:
          "It means she is immune from past vaccination or past infection, and her fetus is protected; no further investigation is required. IgM negativity in a single sample is the correct read only alongside IgG positivity, because IgM would be the recent-infection signal.",
        explanation:
          "The IgM/IgG pair is read together: a positive IgG alone is evidence of past exposure, while an isolated IgM or rising IgG needs a convalescent sample to confirm.",
      },
      {
        type: "question",
        prompt: "Why does a second dose of a protein vaccine give a higher and faster antibody response than the first?",
        answer:
          "Because the first dose expanded memory B cells with high-affinity receptors already switched to IgG, so the second dose encounters a far larger and better-tuned clone, which responds within days and at higher titre.",
        explanation:
          "The primary response comes from naive cells and starts with IgM and a 3–5 day lag; the secondary response uses memory cells that have already been through affinity maturation, which is why booster schedules work.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which statement about IgG and IgM is correct?",
        options: [
          "IgG crosses the placenta while IgM cannot, and IgM is the more efficient complement activator.",
          "IgM crosses the placenta while IgG cannot, and IgG is the more efficient complement activator.",
          "Both cross the placenta, and both are pentameric.",
          "Neither crosses the placenta, and both fix complement equally well.",
        ],
        correctIndex: 0,
        explanation:
          "IgG is a monomer transported across the placenta by the neonatal Fc receptor, which is why maternal IgG protects the newborn; IgM is a pentamer confined to the intravascular compartment whose size makes it the most efficient complement activator in the classical pathway.",
      },
      {
        type: "mcq",
        stem: "A vaccine containing only purified bacterial capsular polysaccharide gives weaker and shorter-lived immunity than expected. What is the mechanism, and what is the remedy?",
        options: [
          "Polysaccharide is degraded before it reaches the lymph node; add a depot adjuvant such as aluminium hydroxide.",
          "Polysaccharide makes a T-independent response without class switching, affinity maturation or memory; conjugate it to a protein carrier so that T follicular helper cells provide help.",
          "Polysaccharide does not bind the B-cell receptor; convert it into a peptide vaccine by partial hydrolysis.",
          "Polysaccharide is presented on MHC class I and so fails to activate CD4 T cells; use a live attenuated strain instead.",
        ],
        correctIndex: 1,
        explanation:
          "Repeating polysaccharide cross-links the B-cell receptor directly and drives a T-independent type 2 response of IgM with limited memory, which is why plain Hib vaccine was abandoned in infancy. Conjugation converts it into a T-dependent response with IgG, memory and affinity maturation.",
      },
      {
        type: "mcq",
        stem: "Which immunoglobulin is found in highest concentration in mucosal secretions?",
        options: ["IgM", "IgG", "Secretory IgA", "IgE"],
        correctIndex: 2,
        explanation:
          "Secretory IgA is a dimer transported across the epithelium by the poly-Ig receptor, whose residual secretory component protects it from proteolytic cleavage at the mucosa. IgG is the highest class in serum but not at mucosal surfaces.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Humoral adaptive immunity is antibody. B-cell receptors are generated by RAG-mediated V(D)J recombination, and each clone is selected by antigen, expanded in germinal centres, hypermutated and affinity-matured, with class switching directed by cytokines to produce IgM, the subclasses of IgG, IgA or IgE — the same variable region throughout. Antibody works by neutralisation, opsonisation and complement activation; secretory IgA guards the mucosa; maternal IgG protects the fetus and the neonate; and serology works on the asymmetric timing of primary and secondary responses, with a fourfold IgG rise or a documented seroconversion as the strongest evidence of infection.",
      },
      {
        type: "paragraph",
        text: "Next: cell-mediated adaptive immunity. The half of the story that antibody cannot reach: antigen presentation, T-cell subsets, cytotoxic killing, and the delayed-type hypersensitivity that makes the tuberculin reaction read a week later rather than an hour later.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 7 — Cell-mediated adaptive immunity (fully authored)
// ---------------------------------------------------------------------------
function lesson7() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: contrast MHC class I and class II antigen presentation and say which CD4 or CD8 subset each addresses; explain the two-signal model of T-cell activation and what happens when the second signal is absent; describe T-cell development and the selection that produces self-tolerance; describe the four CD4 helper subsets and one clinical setting in which each dominates; describe cytotoxic T-cell killing and the apoptosis it induces; explain delayed-type hypersensitivity and the granuloma; and interpret the CD4 count in HIV and the risk it predicts.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 5 and 6 — innate immunity and humoral adaptive immunity. Dendritic cells and the T follicular helper cells from those two lessons supply the context, and the vocabulary of antigen presentation is introduced here.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Cell-mediated adaptive immunity",
        text: "The arm of adaptive immunity executed by T lymphocytes: CD4 helper cells that coordinate other cells, CD8 cytotoxic cells that kill infected cells, and CD4 cells that suppress or regulate the response. It acts on the intracellular world, where antibody cannot reach.",
      },
      {
        type: "paragraph",
        text: "An antibody can bind a virus in the bloodstream brilliantly, but it cannot enter a cell to reach a virus that has already infected one. Cell-mediated immunity solves this by looking at the surface of every cell in the body: proteins synthesised inside a cell are chopped up, loaded onto MHC molecules and displayed on the membrane, and a T cell inspects the display. A bacterium hiding in a macrophage is visible too — the macrophage itself has swallowed it and is presenting its peptides.",
      },
      {
        type: "paragraph",
        text: "This explains the immunological split you meet in the clinical wards. A patient with agammaglobulinaemia cannot neutralise organisms in the extracellular fluid and gets bacterial sinusitis and bronchitis — viral infections are handled normally, because the T cells are intact. A patient with AIDS cannot clear intracellular pathogens, so they get Pneumocystis pneumonia, cryptococcal meningitis, cytomegalovirus retinitis, disseminated mycobacteria — the extracellular bacterial world is largely intact. The pattern of infection is a direct readout of which arm is missing.",
      },

      { type: "heading", level: 2, text: "Antigen presentation: the two MHC pathways" },
      {
        type: "definition",
        term: "Major histocompatibility complex (MHC)",
        text: "The gene cluster encoding the molecules that present peptide antigen to T cells. In humans it is the HLA complex: class I (HLA-A, B, C) is expressed on all nucleated cells, and class II (HLA-DR, DQ, DP) is expressed constitutively on professional antigen-presenting cells.",
      },
      {
        type: "table",
        headers: ["Feature", "MHC class I", "MHC class II"],
        rows: [
          ["Expressed on", "All nucleated cells", "Dendritic cells, macrophages, B cells, and thymic epithelium; induced on others by interferon-gamma"],
          ["Source of peptide", "Proteins synthesised inside the cell — endogenous, including viral and tumour antigens", "Proteins phagocytosed from outside — exogenous, including bacteria that have been engulfed"],
          ["Peptide length and binding", "Peptides of about 8–10 amino acids, binding the closed groove", "Peptides of about 13–25 amino acids, in an open groove"],
          ["Which T cell reads it", "CD8 cytotoxic T cells, because CD8 binds the alpha-3 domain of class I", "CD4 helper T cells, because CD4 binds a conserved region on class II"],
          ["Function", "Kill the infected or malignant cell", "Direct the immune response — activating macrophages, helping B cells, recruiting cells"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Cross-presentation is the exception that makes it work: dendritic cells can also load material they have engulfed extracellularly onto MHC class I, so a virus produced elsewhere can still reach CD8 T cells. This is essential for defence against viruses that do not infect dendritic cells themselves, and it is the basis on which cancer vaccines are designed.",
      },
      {
        type: "paragraph",
        text: "The contrast with immunoglobulin is worth stating. An antibody sees an antigen in three dimensions, in any conformation. A T cell sees only a peptide, in a groove, of a fixed length, presented on a defined molecule — which is why a virus can escape both arms by mutating a peptide anchor residue, and why HLA type determines which epitopes a person can see.",
      },

      { type: "heading", level: 2, text: "T-cell development: positive and negative selection" },
      {
        type: "paragraph",
        text: "T-cell precursors mature in the thymus. The beta locus rearranges first, then the alpha; if a cell survives, it expresses both CD4 and CD8 before choosing a lineage. Selection happens in two directions. In positive selection, thymic epithelial cells display self-MHC molecules and cells that cannot engage any of them die of neglect — so the mature repertoire is restricted to cells that can read self-MHC. In negative selection, medullary epithelial cells and dendritic cells display self-peptides, and cells that recognise them too strongly are deleted — the origin of central tolerance.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Failure of positive selection deletes nearly the whole repertoire, which is why DiGeorge syndrome — 22q11.2 deletion, thymic hypoplasia and hypoparathyroidism from the same branchial arch field — produces recurrent infections and infant hypocalcaemic tetany together. Failure of negative selection is the origin of autoimmune polyendocrine syndrome type 1, where the AIRE transcription factor that lets thymic cells display tissue-specific proteins is defective.",
      },

      { type: "heading", level: 2, text: "Activation: two signals, and the tolerance that follows without one" },
      {
        type: "table",
        headers: ["Signal", "What delivers it", "What happens if it is missing"],
        rows: [
          ["Signal 1", "The T-cell receptor engaging peptide–MHC, with CD4 or CD8 as co-receptor", "The cell does nothing — it simply cannot respond"],
          ["Signal 2", "B7 (CD80 and CD86) on the professional antigen-presenting cell engaging CD28 on the T cell", "The cell becomes anergic or tolerant rather than activated"],
          ["Cytokine signal 3", "Interleukin-2 in particular, autocrine and paracrine", "Activation is weaker and the T helper subset differentiation is altered"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The two-signal model is why resting tissues do not turn every minor self-antigen into autoimmunity: they present peptide in MHC class II but usually without B7, so a self-reactive T cell receives signal 1 and becomes anergic. This is also why Abatacept, a fusion protein that blocks B7-CD28, is a therapy for rheumatoid arthritis — it withholds the second signal.",
      },

      { type: "heading", level: 2, text: "The CD4 helper subsets" },
      {
        type: "paragraph",
        text: "Once activated, a naive CD4 cell differentiates into a lineage directed by the cytokines present at the moment of activation. The four classic subsets each recruit a different cell to the response, and the pattern of infection in a patient on a monoclonal antibody that blocks one of them follows directly.",
      },
      {
        type: "table",
        headers: ["Subset", "Master transcription factor", "Signature cytokine", "What it recruits", "Disease where it dominates"],
        rows: [
          ["Th1", "T-bet", "Interferon-gamma", "Macrophages — the classical macrophage activation pathway", "Tuberculosis, tuberculoid leprosy, granulomatous inflammation"],
          ["Th2", "GATA-3", "Interleukin-4, interleukin-5, interleukin-13", "Eosinophils, mast cells, IgE class switching", "Helminth infection, allergy, asthma"],
          ["Th17", "ROR-gamma-t", "Interleukin-17 (and interleukin-22)", "Neutrophils — the mucosal defence against fungi and extracellular bacteria", "Mucosal candidiasis, pustular psoriasis; deficient when interleukin-17 pathway is blocked"],
          ["Treg (regulatory)", "FoxP3", "Interleukin-10 and transforming growth factor-beta", "Suppression of other T cells", "Prevents autoimmunity; loss causes IPEX (immune dysregulation, polyendocrinopathy, enteropathy, X-linked) syndrome"],
        ],
      },
      {
        type: "paragraph",
        text: "T follicular helper cells, the fifth and biologically distinct subset, are the T cells that move into the germinal centre and supply CD40 help to B cells. Without them, class switching and affinity maturation fail, so a patient with a Tfh defect has recurrent bacterial infection and cannot make good antibody despite normal B-cell numbers — which is why hyper-IgM syndrome from a CD40L defect looks clinically like an antibody deficiency.",
      },

      { type: "heading", level: 2, text: "Cytotoxic T-cell killing" },
      {
        type: "paragraph",
        text: "A CD8 cytotoxic T cell that recognises its peptide on MHC class I kills by two routes. The primary route is directed secretion: perforin forms a pore in the target membrane and granzymes enter and activate the caspase cascade, producing apoptosis of the target cell. The secondary route exploits a surface molecule: Fas ligand on the T cell engages Fas on the target, triggering the extrinsic apoptotic pathway.",
      },
      {
        type: "table",
        headers: ["Mechanism", "Molecules", "Effect on the target"],
        rows: [
          ["Perforin–granzyme exocytosis", "Perforin pore and granzyme B entering the cytosol", "Caspase-9 and caspase-3 activation, DNA fragmentation, apoptosis — one cell kills in a targeted way without spilling virions into the neighbourhood"],
          ["Fas–FasL", "Fas ligand engaging CD95 on the target membrane", "Apoptosis through caspase-8"],
          ["Cytokines", "Interferon-gamma and tumour necrosis factor", "Inhibition of viral replication and activation of nearby macrophages"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Apoptosis rather than lysis is the deliberate choice. Killing by membrane rupture would release intact virions to infect neighbours; apoptosis packages the contents into membrane-bound bodies that a phagocyte removes cleanly. Viruses that block caspase activation — adenovirus and herpesvirus both encode inhibitors — are able to survive for precisely this reason.",
      },

      { type: "heading", level: 2, text: "Delayed-type hypersensitivity and the granuloma" },
      {
        type: "definition",
        term: "Delayed-type (type IV) hypersensitivity",
        text: "A cell-mediated hypersensitivity reaction that appears 24–72 hours after exposure to the antigen, mediated by CD4 Th1 cells releasing interferon-gamma and tumour necrosis factor, which recruit and activate macrophages. The tuberculin skin test is the paradigm.",
      },
      {
        type: "paragraph",
        text: "A person previously infected by Mycobacterium tuberculosis carries CD4 T cells primed against mycobacterial peptides. When purified protein derivative is injected intradermally, dendritic cells present it, the recalled Th1 cells release interferon-gamma, macrophages accumulate and cause a raised induration that must be read at 48–72 hours. Reading it at 24 hours or at one week gives a false answer.",
      },
      {
        type: "paragraph",
        text: "The same machinery generates the granuloma when the antigen cannot be cleared: macrophages activated and transformed into epithelioid cells fuse into Langhans giant cells, surrounded by a rim of lymphocytes, with caseous necrosis inside in tuberculosis. The granuloma is a strategy of containment, and it explains why typhoid, sarcoid, tuberculosis and foreign-body reactions all share the word 'granuloma' despite very different causes.",
      },
      {
        type: "table",
        headers: ["Setting", "Cell-mediated event", "Clinical readout"],
        rows: [
          ["Tuberculin test (PPD)", "Recall of mycobacterial peptide-specific Th1 cells", "Induration read at 48–72 hours; positive in latent tuberculosis but also in BCG-vaccinated and non-tuberculous mycobacteria contacts"],
          ["Contact dermatitis", "Hapten-specific CD4 and CD8 T cells in skin", "Poison ivy and nickel dermatitis, peaking at 48–72 hours"],
          ["Tuberculous pleural effusion", "Pleural CD4 recruitment and interferon-gamma", "A lymphocytic pleural fluid with high adenosine deaminase"],
          ["Leprosy", "Th1 or Th2 dominance along the disease spectrum", "Tuberculoid leprosy (Th1, few bacilli, granulomas) versus lepromatous leprosy (Th2, many bacilli, no efficient granulomas)"],
        ],
      },

      { type: "heading", level: 2, text: "Clinical consequences of a failing cell-mediated arm" },
      {
        type: "table",
        headers: ["Condition", "Mechanism", "Infection pattern seen"],
        rows: [
          ["HIV with a CD4 count falling below 200", "Progressive loss of CD4 T cells by productive infection and apoptosis", "Pneumocystis pneumonia, cryptococcal meningitis, oesophageal candidiasis, toxoplasmosis, cytomegalovirus retinitis, disseminated mycobacterial disease"],
          ["DiGeorge syndrome", "22q11.2 deletion, thymic hypoplasia — impaired T-cell development", "Recurrent viral and fungal infection, plus hypocalcaemic tetany and a cardiac murmur from conotruncal defect"],
          ["Chronic granulomatous disease", "Defective NADPH oxidase, so macrophages cannot kill the organisms they have engulfed", "Catalase-positive infections and granulomas — the T cells are intact, the macrophages are not"],
          ["Mendelian susceptibility to mycobacteria", "Defects in interferon-gamma and interleukin-12 signalling", "Disseminated BCG and environmental mycobacteria"],
          ["Drug-induced immunosuppression", "Calcineurin inhibitors, corticosteroids, antiproliferative agents", "Cytomegalovirus, BK polyomavirus, fungal infection — a dose-dependent erosion of cell-mediated response"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Severe combined immunodeficiency is the archetype of total failure. It arises from defects of the shared cytokine receptor chain (X-linked SCID), adenosine deaminase deficiency, or RAG defects that abolish receptor rearrangement altogether, and it presents in the first months of life with failure to thrive, oral candidiasis and Pneumocystis, with low lymphocytes and absent thymic shadow. Live vaccines are contraindicated and the treatment is haematopoietic stem-cell transplantation or gene therapy.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Thinking CD8 T cells need help from CD4 to kill. They need help to be primed — CD4 T cells license the dendritic cell — but once a cytotoxic cell exists, it kills a presenting target cell directly, without any CD4 involvement.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Reading a tuberculin test before 48 hours or at seven days. The reaction is a delayed-type hypersensitivity and matures at 48–72 hours; a reading at 24 hours may be an immediate pseudo-reaction, and a reading after a week may be an immune complex reaction from prior sensitisation.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Calling type IV hypersensitivity 'delayed' because it is slow in starting and slow in stopping. It is slow in starting — the cells must be recruited from blood — and the readout is measured in days, whereas type I reactions are measured in minutes to hours and type III in hours to days.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A patient with AIDS has a CD4 count of 120 cells per microlitre and then develops Pneumocystis pneumonia. What is the mechanistic relationship?",
        answer:
          "Pneumocystis pneumonia has been a CD4-dependent infection: CD4 T cells must activate alveolar macrophages to clear the organism, and once the CD4 count falls below about 200, macrophage activation fails and the organism proliferates in the alveolar spaces.",
        explanation:
          "The CD4 count is the single best guide to opportunistic infection risk, and the thresholds for Pneumocystis and toxoplasmosis are roughly the same: below 200 for PCP, below 100 for toxoplasmosis and cryptococcosis, below 50 for cytomegalovirus and Mycobacterium avium.",
      },
      {
        type: "question",
        prompt: "Why does an intranasal herpes simplex infection resolve through cell-mediated rather than humoral immunity?",
        answer:
          "Because herpesvirus replicates inside epithelial and neuronal cells, where antibody cannot reach it. CD8 cytotoxic T cells recognise viral peptide on MHC class I of the infected cell and kill it, and interferon-gamma from CD4 cells suppresses replication in neighbouring uninfected cells.",
        explanation:
          "The same logic explains why recurrent herpes simplex is heralded by a drop in cell-mediated immunity rather than a drop in antibody, and why immunosuppressed transplant recipients get disseminated disease despite high antibody titres.",
      },
      {
        type: "question",
        prompt: "A patient with a CD40 ligand deficiency has normal B-cell numbers but only IgM, and recurrent bacterial infection. Explain.",
        answer:
          "CD40 ligand on T cells engages CD40 on B cells to make class switching and the germinal centre reaction possible; without it, B cells make IgM that cannot class-switch, and affinity maturation and memory fail, so the patient has a functional antibody deficiency despite intact humoral numbers.",
        explanation:
          "Hyper-IgM syndrome is therefore a T-cell defect that presents as a B-cell disease — the clinical phenotype mirrors antibody deficiency, because the B cell cannot execute the switch without its T-cell partner.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which statement about MHC presentation is correct?",
        options: [
          "MHC class II presents endogenous peptides to CD4 T cells; MHC class I presents exogenous peptides to CD8 T cells.",
          "MHC class I presents endogenous peptides to CD8 T cells; MHC class II presents exogenous peptides to CD4 T cells.",
          "MHC class I is expressed only on antigen-presenting cells; MHC class II is expressed on all nucleated cells.",
          "MHC class I binds long peptides of 13–25 amino acids; MHC class II binds short peptides of 8–10 amino acids.",
        ],
        correctIndex: 1,
        explanation:
          "The class I pathway reads proteins made inside the cell and addresses CD8; the class II pathway reads proteins engulfed from outside and addresses CD4. Class I is on all nucleated cells, class II is restricted to professional antigen-presenting cells and interferon-gamma-inducible cells; class I grooves bind short peptides and class II grooves bind longer ones.",
      },
      {
        type: "mcq",
        stem: "A kidney transplant recipient on cyclosporine develops fever, malaise and a rising plasma cytomegalovirus load. Which alteration in immune function does this illustrate?",
        options: [
          "Selective loss of CD8 cytotoxic T-cell killing, so the virus is not cleared from infected cells.",
          "Loss of B-cell class switching and antibody production, so neutralisation fails.",
          "Impaired complement activation through the classical pathway, so lysis of infected cells fails.",
          "Loss of Toll-like receptor 4 responses, so innate activation fails.",
        ],
        correctIndex: 0,
        explanation:
          "Cyclosporine and tacrolimus block calcineurin and therefore interleukin-2 transcription, which suppresses T-cell proliferation — the effector CD8 cytotoxic pool for cytomegalovirus is eroded, and the virus replicates in monocytes and endothelial cells unchecked.",
      },
      {
        type: "mcq",
        stem: "A 25-year-old with a positive interferon-gamma release assay and no symptoms has a normal chest radiograph. What does this pattern imply?",
        options: [
          "Active pulmonary tuberculosis requiring four-drug therapy.",
          "Latent tuberculosis infection — cell-mediated immunity has contained the organism without radiological disease, and treatment reduces later reactivation.",
          "Prior BCG vaccination only, with no latent infection.",
          "Disseminated mycobacterial disease with negative cultures.",
        ],
        correctIndex: 1,
        explanation:
          "An interferon-gamma release assay detects cell-mediated immunity sensitised to mycobacterial peptides; with no clinical or radiological disease it indicates latent infection. Treatment of latent infection with isoniazid or a shorter rifampicin-containing regimen reduces the lifetime reactivation risk.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Cell-mediated adaptive immunity is the intracellular arm. Endogenous proteins are presented on MHC class I to CD8 cytotoxic T cells, which kill by perforin–granzyme apoptosis; exogenous proteins are presented on MHC class II to CD4 T cells, which differentiate into Th1, Th2, Th17, Tfh or regulatory lineages depending on the cytokine signal. Activation needs a second signal — B7 engaging CD28 — and its absence produces anergy. The same machinery, when it targets an organism that cannot be cleared, drives delayed-type hypersensitivity and the granuloma, which is why the tuberculin test is read at 48 to 72 hours and why a falling CD4 count converts Pneumocystis from commensal to pathogen.",
      },
      {
        type: "paragraph",
        text: "Next: antigen–antibody reactions. You will take the specificity and affinity you have met here into the diagnostic laboratory, and see how precipitation, agglutination, ELISA and immunofluorescence turn an antibody response into a number on a report.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 8 — Antigen–antibody reactions (fully authored)
// ---------------------------------------------------------------------------
function lesson8() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: state the general features of an antigen–antibody reaction and define affinity and avidity; explain the prozone phenomenon and recognise the false negative it causes; describe precipitation, agglutination and complement fixation tests and name one clinical use of each; describe the four ELISA configurations and say which is used for a diagnostic antibody screen; interpret a rapid lateral-flow test and its limitations; distinguish direct from indirect immunofluorescence and give an example of each; and decide, for a given clinical scenario, whether serology or nucleic acid detection is the better test.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 6 and 7 — humoral and cell-mediated adaptive immunity. The antigen-binding site, class switching, affinity maturation and the primary and secondary antibody response are all used here to interpret the results.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Antigen–antibody reaction",
        text: "A specific non-covalent binding between an antigenic determinant (epitope) and the antigen-binding site of an antibody, driven by hydrogen bonds, ionic attraction, van der Waals forces and hydrophobic interaction, and detectable by precipitation, agglutination, complement fixation or a labelled signal.",
      },
      {
        type: "paragraph",
        text: "Every diagnostic test in clinical microbiology is a way of turning that invisible binding event into something a machine or an eye can see. The antigen must be presented so that a single binding event is amplified: many antibody molecules cross-linking a particulate antigen (agglutination), or a lattice of soluble antigen and antibody falling out of solution (precipitation), or an enzyme label producing colour at a rate proportional to the antibody present (ELISA), or a fluorescent tag exciting a defined emission wavelength (immunofluorescence).",
      },
      {
        type: "paragraph",
        text: "The rules that govern the reaction also govern its failure modes. Specificity depends on the closeness of fit, so cross-reactivity is common among related organisms; the zone of equivalence is where lattice formation is maximal, and outside it — in antibody excess or antigen excess — lattice formation is poor, which is the prozone phenomenon. Understanding the chemistry is what lets a laboratory read an unexpected result correctly.",
      },

      { type: "heading", level: 2, text: "General features of the reaction" },
      {
        type: "table",
        headers: ["Property", "Description", "Laboratory consequence"],
        rows: [
          ["Specificity", "Antibody binds one epitope, but a polyclonal serum may recognise several related antigens", "Cross-reactions with related organisms (Leptospira with syphilis, dengue with Zika) must be controlled for with confirmatory assays"],
          ["Affinity", "Strength of binding of a single antigen-binding site to a single epitope", "A high-affinity antibody binds lower concentrations, so affinity maturation during infection changes the titre"],
          ["Avidity", "Combined strength of all binding sites of an antibody for a multivalent antigen", "IgM has low intrinsic affinity but high avidity because it is a pentamer, which is why it appears early"],
          ["Sensitivity", "The smallest amount of antigen or antibody the test can detect", "A fourth-generation HIV test detects p24 antigen as well as antibody, so it shortens the window period"],
          ["Zone of equivalence", "The ratio at which antigen and antibody cross-link most completely", "Outside equivalence, lattice formation fails — the basis of the prozone effect"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The prozone phenomenon is a trap in syphilis serology. In secondary syphilis, high antibody concentrations can block lattice formation, and the VDRL test reads falsely negative in undiluted serum. Diluting the sample into the zone of equivalence restores the reaction, and that is why every syphilis serology protocol includes a dilution series and why a negative test in a suspicious clinical setting must be re-examined rather than reported with confidence.",
      },

      { type: "heading", level: 2, text: "Precipitation tests" },
      {
        type: "paragraph",
        text: "Precipitation happens when soluble antigen and antibody combine at equivalence to form a lattice that becomes insoluble and visible. It requires multivalent antigen and bivalent antibody, and the turbidity can be measured optically.",
      },
      {
        type: "table",
        headers: ["Test", "Format", "Clinical application"],
        rows: [
          ["Single immunodiffusion (Oudin)", "Antibody in agar, antigen in a well; a ring of precipitation forms", "IgG subclass quantification in a research setting"],
          ["Double immunodiffusion (Ouchterlony)", "Antigen and antibody wells in agar; precipitin lines form where they meet at equivalence", "Identity of antigens, and the classical Elek test for Corynebacterium diphtheriae toxigenicity"],
          ["Rocket immunoelectrophoresis", "Antigen driven into antibody-containing gel by electrophoresis", "Quantitative measurement of a serum protein"],
          ["Nephelometry and turbidimetry", "Light scattering by antigen–antibody complexes in solution", "Automated measurement of complement components and specific proteins such as antistreptolysin O"],
          ["Flocculation (VDRL and RPR)", "Antigen bound to cholesterol crystals gives a visible clump", "Non-treponemal screening for syphilis and its titre for disease monitoring"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The Elek test answers a question with life attached: is this strain of Corynebacterium diphtheriae actually producing toxin? C. diphtheriae can be toxigenic or not depending on lysogeny by the beta-phage, and only toxigenic strains make a patient require antitoxin. The test places a diphtheria antitoxin-impregnated strip on an agar plate at right angles to the streak of the organism, and a precipitin line forms only where toxin meets antitoxin — a precipitation reaction reporting toxin production directly.",
      },

      { type: "heading", level: 2, text: "Agglutination tests" },
      {
        type: "definition",
        term: "Agglutination",
        text: "The clumping of a particulate antigen — a bacterium, a red cell, or latex beads coated with antigen — when cross-linked by antibody. It is visible to the naked eye and is therefore the basis of rapid diagnostic tests.",
      },
      {
        type: "table",
        headers: ["Variant", "What is particulate", "Clinical application"],
        rows: [
          ["Slide agglutination", "Whole bacterial cells against specific antisera", "Rapid serotyping of Salmonella and Shigella in the laboratory, and pneumococcal serogrouping from CSF"],
          ["Tube agglutination (Widal)", "Salmonella O and H antigens against patient serum", "Enteric fever in the second week of illness — fourfold rise in titre is the diagnostic criterion"],
          ["Latex agglutination", "Latex beads coated with antigen or antibody", "Rapid detection of HBsAg, CRP, rheumatoid factor, and meningococcal antigens in CSF"],
          ["Co-agglutination (the CAMP test)", "Protein A-bearing Staphylococcus aureus as the carrier", "The CAMP test: a CAMP-factor-producing group B streptococcus gives an arrowhead of haemolysis against a staphylococcal beta-lysin — a positive indirect haemolysis that is really an agglutination-like phenomenon, and the standard identification"],
          ["Passive haemagglutination (TPHA)", "T. pallidum antigen bound to red cells", "Treponemal-specific syphilis test, more specific than VDRL as a confirmatory"],
          ["Blood grouping", "Red cells of known antigen type against patient serum", "ABO and Rh typing in transfusion"],
        ],
      },
      {
        type: "example",
        text: "A fourfold rise in Widal titre — from 1:40 to 1:160 between samples taken in week 1 and week 3 — is diagnostic of enteric fever, whereas a single 1:80 titre in a vaccinated patient is not. Salmonella typhi antigen (TO) and flagellar antigen (TH) are reported separately, and the H-antibody rise is the more specific, because prior typhoid vaccination raises the H titre without indicating current infection.",
      },

      { type: "heading", level: 2, text: "Complement fixation" },
      {
        type: "paragraph",
        text: "The complement fixation test is now largely historical, but the principle is worth knowing because it explains a diagnostic idea. Antigen, patient serum and complement are incubated together; if the serum contains specific antibody, the antigen–antibody complex fixes the complement. Sheep red cells coated with antibody are then added, and the complement is already consumed, so the indicator cells are not lysed. A positive test is a cloudy tube rather than a haemolysed one.",
      },
      {
        type: "table",
        headers: ["Reading", "Interpretation"],
        rows: [
          ["No haemolysis of the indicator cells", "Positive — complement was consumed by the test reaction"],
          ["Haemolysis of the indicator cells", "Negative — the test antibody was absent and free complement remained to lyse the indicator cells"],
        ],
      },

      { type: "heading", level: 2, text: "Labelled immunoassays: ELISA, RIA and immunoblot" },
      {
        type: "paragraph",
        text: "A labelled immunoassay attaches a detectable molecule to either the antigen or the antibody, and measures the amount of binding rather than a visible lattice. The enzyme-linked immunosorbent assay uses an enzyme whose substrate gives a colour change, and the optical density is proportional to the antibody or antigen present.",
      },
      {
        type: "table",
        headers: ["Configuration", "Solid phase carries", "What is added", "What it measures", "Example"],
        rows: [
          ["Indirect ELISA", "Antigen", "Patient serum, then enzyme-labelled anti-human immunoglobulin", "Antibody to that antigen — a screening test", "HIV antibody screening, hepatitis C screening"],
          ["Sandwich ELISA", "Capture antibody", "Patient serum, then enzyme-labelled detection antibody", "Antigen, captured between two antibodies", "HBsAg, HIV p24 antigen, hepatitis B e antigen"],
          ["Competitive ELISA", "Antigen on the plate with a fixed labelled antibody", "Patient serum competes with the labelled antibody for the antigen", "Antibody whose presence inversely reduces the signal", "Tests where too much antibody would otherwise saturate the assay"],
          ["Direct ELISA", "Antigen", "Enzyme-labelled known antibody", "Antibody of defined specificity", "Research use and immunoglobulin isotyping"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The fourth-generation HIV test is the practical outcome of these designs. It is a sandwich plus indirect combination: it detects p24 antigen, which appears about two weeks after infection, and HIV-1 and HIV-2 antibodies, which appear at three to twelve weeks. The combination shortens the window period by roughly a week over antibody-only tests and has become the standard of care.",
      },
      {
        type: "paragraph",
        text: "Enzyme immunoassays are read against a cut-off value defined as a multiple of the mean negative control. A value above the cut-off is reactive, but reactivity is not diagnosis: a low reactive index may be a false positive, and a screen-positive result must be confirmed by a more specific method — a western blot, a line immunoassay, or nucleic acid detection — before it is reported as a diagnosis.",
      },

      { type: "heading", level: 2, text: "Immunofluorescence" },
      {
        type: "table",
        headers: ["Variant", "How it works", "Use"],
        rows: [
          ["Direct immunofluorescence", "Fluorophore is bound directly to the specific antibody, which is applied to the patient's tissue or smear", "Respiratory virus antigen detection — antigen detection in nasopharyngeal aspirates"],
          ["Indirect immunofluorescence", "Unlabelled antibody binds patient antigen, and a labelled anti-human immunoglobulin detects it", "Antinuclear antibody testing, FTA-Abs for syphilis, and most autoantibody screens"],
        ],
      },
      {
        type: "paragraph",
        text: "The fluorescence microscope provides one of the most elegant diagnostic stains in microbiology. Auramine–rhodamine stain makes mycobacteria fluoresce yellow-orange against a dark background, which is far easier than scanning a Ziehl–Neelsen film at high power, and is why fluorescence microscopy has replaced light microscopy for the initial screen of sputum smears.",
      },

      { type: "heading", level: 2, text: "Rapid tests and molecular confirmation" },
      {
        type: "table",
        headers: ["Format", "Principle", "Strengths", "Limitations"],
        rows: [
          ["Lateral flow / immunochromatographic test", "Antigen–antibody complex migrating along a nitrocellulose strip generates a visible test line", "Point-of-care, no equipment, and result in 15–20 minutes", "Lower sensitivity than ELISA; a negative result in a high-probability patient must be confirmed"],
          ["Malaria rapid diagnostic test", "Detects Plasmodium histidine-rich protein 2 or pan-plasmodium lactate dehydrogenase", "Field diagnosis and speciation between falciparum and non-falciparum", "HRP-2 gene deletion gives false negatives, and the test cannot quantify parasitaemia"],
          ["Nucleic acid amplification test (NAAT/PCR)", "Amplifies pathogen DNA or RNA", "Highest sensitivity, detects uncultivable and non-viable organisms, and works during the window period", "Cost, contamination risk, and a positive result may mean past as well as present infection"],
          ["Western blot", "Separated viral proteins transferred to a membrane, probed with patient serum", "Used as confirmatory for HIV and Lyme testing in some settings", "Indeterminate patterns are common, which is why it is being replaced by combination assays"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Do not interpret a rapid negative as a definitive exclusion. A lateral-flow malaria antigen test in a heavily parasitaemic but recently treated patient can be negative if the HRP-2 target is cleared or deleted, and a rapid influenza negative during a high-prevalence season should be confirmed by PCR. The rule is simple: a rapid test guides a decision, and where the clinical probability is high and the test negative, confirm or re-test.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Reading a syphilis serology without considering dilution. The prozone in secondary syphilis makes undiluted serum falsely negative; VDRL results are read from a dilution series and the endpoint titre — not the neatest-looking tube — is reported.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating reactive ELISA as a diagnosis. A screen is meant to have high sensitivity, and a positive result is a prompt for confirmation. The classic disasters are a false-positive HIV screen in a low-risk patient, a cross-reactive dengue IgM read as evidence of dengue, and a non-specific hepatitis A IgM read as acute hepatitis.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing indirect with direct immunofluorescence. In direct, the fluorescent molecule is attached to the antibody that recognises the patient's antigen. In indirect, the fluorescent molecule is attached to an anti-human immunoglobulin, which detects the patient's antibody. Direct is antigen detection; indirect is usually antibody detection.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A patient with suspected secondary syphilis has a repeatedly non-reactive VDRL but a positive treponemal test. How can this be explained?",
        answer:
          "It is the prozone phenomenon: very high antibody titre blocks lattice formation in antibody excess, so the flocculation test reads falsely negative. Diluting the serum into the zone of equivalence restores the reaction and gives a reactive result with a high titre.",
        explanation:
          "The treponemal test is a specific antibody test that does not behave as a flocculation test, so it stays positive. Any non-reactive screening result in a patient with strongly suggestive clinical findings must be re-examined in dilution.",
      },
      {
        type: "question",
        prompt: "A 22-year-old man has a reactive HIV screening ELISA and a negative result on a differentiating confirmatory assay. What are the possibilities?",
        answer:
          "Either a false-positive screen (specimen interference, cross-reacting antibody, or a very low-signal reactive result), an early infection in the window period, or a rare true infection with an atypical serological profile.",
        explanation:
          "The correct response is to repeat the screen with a different platform and to test plasma for viral RNA, which resolves the window period question and confirms the diagnosis before treatment or counselling.",
      },
      {
        type: "question",
        prompt: "Why does the CAMP test need a staphylococcal streak at right angles to the suspected group B streptococcus?",
        answer:
          "Because Staphylococcus aureus secretes a sphingomyelinase, the beta-lysin, and the CAMP factor produced by Streptococcus agalactiae interacts synergistically with it to lyse red cells; the arrowhead-shaped zone of enhanced haemolysis only forms where the two products overlap.",
        explanation:
          "The synergy is the readout, so the two streaks must be close enough for their products to meet but not touching, and the direction and shape of the arrowhead identify the CAMP-positive organism.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A CSF sample is tested for Neisseria meningitidis capsular antigen by an immunoassay that captures antigen between two antibody layers. Which format is this, and what is detected?",
        options: [
          "Indirect ELISA, detecting patient antibody to the meningococcal antigen.",
          "Sandwich ELISA, detecting capsular antigen in the cerebrospinal fluid.",
          "Competitive ELISA, detecting low-avidity antibody that has not matured.",
          "Direct immunofluorescence, detecting antibody bound to meningococcal outer membrane.",
        ],
        correctIndex: 1,
        explanation:
          "Two antibody layers with antigen trapped between them is the sandwich format, and it measures antigen. Latex agglutination was the classical rapid form of this test for CSF; both are antigen-detection assays rather than serology.",
      },
      {
        type: "mcq",
        stem: "A negative VDRL in a patient with a chancre and condylomata lata is reported as non-reactive. What is the most appropriate next step?",
        options: [
          "Accept the negative result and rule out syphilis.",
          "Repeat the test on diluted serum, because secondary syphilis can produce a prozone that gives a false negative in undiluted specimens.",
          "Report the sample as expired and request a fresh specimen.",
          "Substitute a non-treponemal flocculation test with an indirect ELISA for treponemal IgM.",
        ],
        correctIndex: 1,
        explanation:
          "In the prozone, antibody excess prevents lattice formation; diluting into the zone of equivalence restores reactivity and yields a high titre, which is also useful for monitoring treatment response.",
      },
      {
        type: "mcq",
        stem: "Which statement about an immunochromatographic (lateral flow) diagnostic test is correct?",
        options: [
          "It requires an incubated enzyme substrate and a plate reader, which limits it to reference laboratories.",
          "It uses gold or coloured latex particles conjugated to antibody, giving a visible line when antigen–antibody complexes migrate along a nitrocellulose strip.",
          "It measures antibody affinity by the height of the visible line relative to the control line.",
          "It is always more sensitive than an ELISA because the whole sample is assayed rather than a fixed volume.",
        ],
        correctIndex: 1,
        explanation:
          "Lateral flow tests use antibody-conjugated coloured particles on a nitrocellulose strip; the line appears without any equipment. They are generally less sensitive than a quantitative ELISA, and line intensity is only qualitative.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Antigen–antibody reactions turn a specific binding event into a signal: precipitation when a soluble lattice forms, agglutination when a particulate antigen is cross-linked, complement fixation when antibody consumes it, ELISA when an enzyme label quantifies the binding, immunofluorescence when a fluorophore marks the complex, and lateral flow when a coloured particle reaches a capture line on a strip. The chemistry dictates the failure modes — specificity gives cross-reactivity, and the zone of equivalence gives the prozone. Serology reads the antibody response; nucleic acid tests read the organism itself, and the choice between them is the subject of the next lesson's practical reasoning.",
      },
      {
        type: "paragraph",
        text: "Next: vaccines and immunisation. You will meet the artificial manipulation of the humoral and cell-mediated responses you have studied, and the national schedule that applies them to a population.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 9 — Vaccines & immunisation (fully authored)
// ---------------------------------------------------------------------------
function lesson9() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the four classical vaccine types and give a named example of each; explain why live and killed vaccines differ in immune response, contraindication and dosage; state what an adjuvant does and why aluminium salts and oil emulsions are used; calculate and interpret a herd immunity threshold for a given basic reproduction number; list the vaccines of the national immunisation schedule with their ages; enumerate the contraindications to vaccination; and explain cold-chain maintenance and vaccine-associated adverse events.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 6, 7 and 8. A vaccine works by generating the humoral and cell-mediated responses you have studied, and its assay is a labelled immunoassay read of the antibody produced.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Vaccination",
        text: "The deliberate induction of an adaptive immune response against a pathogen, or its components, without producing disease — so that a later encounter of the real organism is met by an accelerated secondary response rather than a primary one.",
      },
      {
        type: "paragraph",
        text: "Everything you learned about primary and secondary responses is the design specification for a vaccine. The primary response is slow and makes IgM; the secondary is fast, makes IgG and is high-affinity. A vaccine is therefore an attempt to buy the first encounter early, deliberately and without the risk of disease, so that the real encounter is a secondary response. Since Edward Jenner's 1796 experiment with cowpox, everything else has been engineering: how to present antigen safely, how to make it elicit both arms, and how to deliver it to enough of a population.",
      },
      {
        type: "paragraph",
        text: "There are two parameters a vaccine must satisfy. Efficacy is the reduction in disease in a vaccinated person under ideal conditions; effectiveness is what happens in the real world, where cold chains break and doses are missed. Neither matters if population coverage fails: herd immunity is what protects the vaccinated and unvaccinated alike, and its threshold is set by how transmissible the organism is.",
      },

      { type: "heading", level: 2, text: "Vaccine types" },
      {
        type: "table",
        headers: ["Type", "Composition", "Immune response", "Named examples", "Advantages and drawbacks"],
        rows: [
          ["Live attenuated", "A weakened organism that still replicates but does not cause disease in the immunocompetent host", "Both humoral and cell-mediated; long-lasting, often lifelong immunity", "BCG, measles–mumps–rubella, varicella, yellow fever, oral typhoid Ty21a, rotavirus", "Strong response with usually one or two doses; contraindicated in pregnancy and immunodeficiency; needs a cold chain; can rarely revert (vaccine-associated paralytic poliomyelitis)"],
          ["Killed or inactivated", "Whole organism rendered non-replicating", "Mainly humoral; boosting required", "Inactivated poliovirus (Salk), Japanese encephalitis, inactivated influenza, inactivated hepatitis A, whole-cell pertussis", "Safe in immunocompromised hosts; needs several doses and boosters"],
          ["Subunit, toxoid and polysaccharide", "A purified component rather than the whole organism", "Humoral only", "Acellular pertussis, tetanus and diphtheria toxoids, pneumococcal polysaccharide, meningococcal polysaccharide", "Very safe and well tolerated; weaker immunogenicity, so polysaccharides need conjugation"],
          ["Conjugate", "A polysaccharide chemically bonded to a carrier protein", "T-dependent humoral response with memory", "Hib (Haemophilus influenzae type b), pneumococcal conjugate, meningococcal C and ACWY conjugates", "Works in infants, memory, and herd protection; expensive"],
          ["Recombinant protein / virus-like particle", "Antigen produced in yeast or another cell; empty shells of capsid protein", "Strong humoral response", "Hepatitis B (HBsAg from yeast), human papillomavirus L1 virus-like particles", "No risk of infection, cannot replicate; needs adjuvant and multiple doses"],
          ["Viral vector", "A harmless virus engineered to carry the gene for the antigen", "Strong humoral and cellular response", "Ebola vaccine (VSV Ebola Zaire), the Oxford–AstraZeneca and Janssen COVID-19 vaccines", "Efficient gene delivery; pre-existing immunity to the vector can blunt the response"],
          ["Messenger RNA", "Nucleic acid encoding the antigen, in a lipid nanoparticle", "Humoral and cellular, with a strong interferon response", "The Pfizer–BioNTech and Moderna COVID-19 vaccines", "Fast design and manufacture; requires very cold storage and multiple doses"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "BCG is the exception to everything and is worth understanding on its own terms. It is live attenuated Mycobacterium bovis, obtained by 230 serial passages on glycerinated potato bile medium over 13 years — attenuation by culture, not by engineering. It protects infants against disseminated and meningeal tuberculosis, gives little protection against adult pulmonary disease, leaves a small scarred tuberculin response that complicates later interpretation, and is the standard example of a live bacterial vaccine.",
      },

      { type: "heading", level: 2, text: "Adjuvants and delivery" },
      {
        type: "definition",
        term: "Adjuvant",
        text: "A substance that increases the immune response to a vaccine antigen, either by creating a depot, by maturing the antigen-presenting cell, or by providing a danger signal that the purified antigen alone cannot supply.",
      },
      {
        type: "table",
        headers: ["Adjuvant", "Mechanism", "Used in"],
        rows: [
          ["Aluminium salts (alum)", "Depot formation and NLRP3 inflammasome activation, favouring a Th2 antibody response", "Diphtheria, tetanus, pertussis and hepatitis B vaccines"],
          ["MF59 (oil-in-water emulsion)", "Recruits myeloid cells and enhances antigen uptake", "Seasonal influenza vaccine for the elderly"],
          ["AS01 (liposome with a TLR4 and TLR7 agonist)", "Strong innate activation producing both humoral and cellular response", "Shingles (Zoster) and malaria RTS,S vaccines"],
          ["CpG oligonucleotides (TLR9 agonists)", "Direct innate stimulation favouring a Th1 response", "Hepatitis B recombinant vaccine"],
        ],
      },
      {
        type: "paragraph",
        text: "A purified recombinant antigen with no PAMP is, to the innate system, indistinguishable from any harmless protein. An adjuvant supplies the missing danger signal, so the dendritic cell matures and the T-cell help that drives class switching and memory becomes available. This is also why subunit and mRNA vaccines, which are otherwise beautifully safe, could not have worked without adjuvants.",
      },

      { type: "heading", level: 2, text: "Herd immunity" },
      {
        type: "definition",
        term: "Herd immunity threshold",
        text: "The proportion of a population that must be immune for the effective reproduction number to fall below one, so that each case generates fewer than one secondary case and the outbreak dies out. It is calculated as 1 − 1/R0, where R0 is the average number of secondary cases generated by one case in a fully susceptible population.",
      },
      {
        type: "table",
        headers: ["Disease", "Basic reproduction number R0", "Herd immunity threshold", "Practical implication"],
        rows: [
          ["Measles", "About 12–18, the highest known for a vaccine-preventable human disease", "92–95 per cent", "Coverage below 95 per cent produces outbreaks — the reason for the second MMR dose and for the summer campaigns"],
          ["Polio", "About 5–7", "80–86 per cent", "Eradication is feasible but requires near-complete coverage in the last reservoirs"],
          ["Diphtheria", "About 6–7", "85 per cent", "The historical benefit of routine infant immunisation"],
          ["Pertussis", "About 12–17", "92–94 per cent", "A high threshold and waning immunity explain the resurgence where coverage drops"],
          ["COVID-19", "Estimated around 2–3 in early variants", "50–67 per cent", "A moving target, raised by variants and waning immunity"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Herd immunity is a population property, not an individual one, and it is destroyed by clusters of unvaccinated people. A coverage rate of 97 per cent nationally can still permit a measles outbreak in a community with 70 per cent coverage, because transmission needs contacts rather than a national average. Outbreak control therefore means finding the under-immunised, not counting the national tally.",
      },

      { type: "heading", level: 2, text: "The national immunisation schedule" },
      {
        type: "paragraph",
        text: "In India the Universal Immunisation Programme delivers a defined schedule to every child, with the timing set by the epidemiology of each organism: BCG at birth because tuberculosis is endemic and the benefit is greatest against disseminated infant disease; oral polio at birth to interrupt faecal-oral transmission early; and hepatitis B at birth because there is currently a window of time before any other protection. The diphtheria, pertussis, tetanus, Haemophilus influenzae type b and hepatitis B pentavalent vaccine is given at 6, 10 and 14 weeks, matching the infant's ability to make a T-dependent response while the window of pertussis lethality is open.",
      },
      {
        type: "table",
        headers: ["Age", "Vaccine", "Notes"],
        rows: [
          ["Birth", "BCG, oral polio vaccine, hepatitis B birth dose", "BCG given intradermally in the left upper arm; hepatitis B within 24 hours where possible"],
          ["6 weeks", "Pentavalent 1, inactivated polio 1, rotavirus 1, pneumococcal conjugate 1, influenza in some states", "Pentavalent covers diphtheria, pertussis, tetanus, Hib and hepatitis B"],
          ["10 weeks", "Pentavalent 2, polio 2, rotavirus 2, pneumococcal 2", "Complete the primary series in the first three months"],
          ["14 weeks", "Pentavalent 3, polio 3, rotavirus 3, pneumococcal 3", "The last primary dose — continuing past 14 weeks does not eliminate the need to complete"],
          ["9 months", "Measles-containing vaccine 1, Japanese encephalitis in endemic districts, vitamin A", "Measles at 9 months balances maternal antibody decay against the lethality of infant measles"],
          ["16–24 months", "DPT booster 1, polio booster, measles-containing vaccine 2", "The second MR restores primary vaccine failures"],
          ["5 years", "DPT booster 2", "Maintains diphtheria and pertussis protection"],
          ["10 years", "Tetanus and adult diphtheria (Td)", "A toxoid booster, thereafter every 10 years"],
          ["16 years", "Td booster", "Protects through the child-bearing years"],
          ["Pregnant women", "Tetanus and diphtheria (Td), and rubella where included", "Protects the neonate through transplacental antibody and prevents neonatal tetanus"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The cold chain runs at 2–8°C from manufacture to point of use, with temperature monitoring every step and control of freezing for the freeze-sensitive vaccines. A vaccine vial monitor on a messenger RNA vaccine, and the visible loss of potency in one that has frozen, are the practical answer to the observation that the last kilometre of the supply chain is where vaccines most often die.",
      },

      { type: "heading", level: 2, text: "Contraindications and precautions" },
      {
        type: "table",
        headers: ["Situation", "Which vaccine is implicated", "Action"],
        rows: [
          ["Anaphylaxis to a previous dose or a component", "Any vaccine", "Do not give that vaccine again; assessment by an allergist before further doses"],
          ["Severe combined immunodeficiency", "All live vaccines (BCG, MMR, oral polio, varicella)", "Withhold; risk of disseminated infection from the vaccine strain"],
          ["Pregnancy", "All live vaccines", "Withhold routine live vaccines; give inactivated vaccines such as Td and inactivated influenza where indicated"],
          ["HIV with advanced immunosuppression", "Live vaccines, particularly BCG and varicella", "BCG is contraindicated in symptomatic HIV; MMR is given if CD4 is adequate"],
          ["Egg allergy", "Influenza vaccine grown in eggs (and yellow fever)", "Modern guidance permits vaccination under supervision; true anaphylaxis to egg requires a specialist setting"],
          ["Acute febrile illness", "Any vaccine temporarily", "Delay until recovery; a mild illness with low-grade fever is not a contraindication"],
          ["Antibiotics and low-dose steroids", "Live vaccines", "Not a contraindication; only immunosuppressive doses of steroids are"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The most common real-world error is postponing vaccination for a trivial reason — a runny nose, a mild cough, the child teething, a previously decided 'rest day'. Each deferral is a further window of susceptibility, and the lost dose disproportionately affects the children who need it most. Vaccinate a child who is well, and only a moderate or severe acute illness genuinely warrants delay.",
      },

      { type: "heading", level: 2, text: "Adverse events and surveillance" },
      {
        type: "paragraph",
        text: "Most vaccine reactions are local and self-limiting: pain, swelling at the injection site, low-grade fever, and irritability. Serious adverse events are rare but must be recognised, and they are classified as an adverse event following immunisation, which is a temporal association requiring investigation rather than a proven causal relationship.",
      },
      {
        type: "table",
        headers: ["Event", "Vaccine and mechanism", "Frequency and management"],
        rows: [
          ["Febrile seizure", "MMR, by the febrile response", "About 1 in 3,000 doses; children recover without sequelae, and antipyretic management is available"],
          ["Anaphylaxis", "Any vaccine, rare", "About 1 in a million doses; treated immediately with adrenaline, and the reason for a 15-minute observation period"],
          ["Vaccine-associated paralytic poliomyelitis", "Oral live polio vaccine, from reversion of the vaccine strain", "About 1 case per 2.4 million doses; the reason inactivated polio vaccine replaced oral vaccine in most schedules"],
          ["Intussusception", "Rotavirus vaccine, historically rhesus-human reassortant strains", "Low absolute excess risk; the current vaccines carry a much smaller attributable risk"],
          ["Syncope", "Any vaccine in adolescents", "Preventable by vaccination in a seated position; managed by observation"],
        ],
      },
      {
        type: "paragraph",
        text: "Surveillance systems monitor these signals continuously and can act on them — withdrawal of a rotavirus product in 1999, the switch of oral to inactivated polio, and monitoring of rare thrombotic events after adenoviral-vector COVID-19 vaccines are all examples of the system working. The regulatory answer to the question 'is the vaccine safe?' is: safety is a continuous, monitored property, not a single pre-licence result.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Believing a live vaccine can be given to an immunocompromised patient. BCG given to a symptomatic HIV-positive infant can disseminate and kill, and varicella vaccine in a T-cell-deficient child can cause progressive disease. Live vaccines are withheld in significant immunodeficiency and in pregnancy, and inactivated vaccines are used instead.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Thinking adults are finished with immunisation. Tetanus needs a booster every ten years, and the acellular pertussis-containing booster exists because pertussis protection wanes. Adult schedules offer influenza annually, pneumococcal vaccination above 65, hepatitis B, and the shingles vaccine — each of which answers a waning immune response in an ageing population.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing herd immunity with individual immunity and treating a vaccination rate as evidence that a particular patient is protected. An unvaccinated child in an outbreak is exposed whenever a case walks into the classroom, and the protection given by herd immunity lasts exactly as long as nobody's coverage slips.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Calculate the herd immunity threshold for measles, given a basic reproduction number of 15, and explain what coverage rate that implies.",
        answer:
          "1 − 1/15 = 0.933, so at least 93.3 per cent of the population must be immune. In practice, because vaccine efficacy is not 100 per cent, the target coverage is set at about 95 per cent for two measles-containing doses.",
        explanation:
          "The formula is 1 − 1/R0; the high measles R0 makes it the most demanding of the routine targets, and coverage below it permits sustained transmission.",
      },
      {
        type: "question",
        prompt: "Why can a live attenuated vaccine usually give strong immunity with one dose while a killed vaccine requires several?",
        answer:
          "Because the live organism replicates and so presents antigen continuously, in the correct intracellular context, generating a broader humoral and cellular response; a killed organism presents a fixed amount of antigen that is cleared within days, so boosting is needed to reach the second-response threshold.",
        explanation:
          "Replication also carries a small risk: a mutated strain could revert, or disseminate in an immunocompromised recipient. That risk is the reason live vaccine contraindications exist.",
      },
      {
        type: "question",
        prompt: "A 6-week-old infant has a mild runny nose and a temperature of 37.6°C, and is due for the second pentavalent dose. What should be done and why?",
        answer:
          "Vaccinate now. A minor illness without moderate or severe systemic signs is not a contraindication, and deferral adds a window of susceptibility without benefit.",
        explanation:
          "Only a moderate or severe acute illness warrants delay, because the response to the vaccine may be impaired and because the febrile illness may be confused with a vaccine adverse event.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which is a defining property of a live attenuated vaccine?",
        options: [
          "It contains only a purified surface protein and cannot replicate.",
          "It contains an organism that still replicates but has lost virulence, and it is contraindicated in an immunodeficient patient.",
          "It contains inactivated whole organisms and therefore never needs a booster dose.",
          "It is made by recombinant DNA technology and always requires an adjuvant.",
        ],
        correctIndex: 1,
        explanation:
          "Live vaccines replicate in the recipient, which is why they give a strong dual response, and the same replicating ability is why they are dangerous in significant immunodeficiency. Purified protein is a subunit vaccine; whole inactivated organisms still require boosting, and recombinant vaccines usually need an adjuvant but are not, by definition, live.",
      },
      {
        type: "mcq",
        stem: "A basic reproduction number of 12 for pertussis gives a herd immunity threshold closest to which figure?",
        options: ["About 50 per cent", "About 75 per cent", "About 92 per cent", "About 99 per cent"],
        correctIndex: 2,
        explanation:
          "1 − 1/12 = 0.917, so about 92 per cent — and because immunity wanes, repeated boosting is needed to sustain coverage above the threshold. This is why a pertussis resurgence follows even a modest fall in vaccination rates.",
      },
      {
        type: "mcq",
        stem: "Which statement about BCG is correct?",
        options: [
          "It is a killed vaccine prepared from Mycobacterium tuberculosis H37Rv.",
          "It is a live attenuated vaccine derived from Mycobacterium bovis by serial passage in culture, and it gives infant protection against disseminated and meningeal tuberculosis.",
          "It is a recombinant protein vaccine based on the secreted antigen 85 complex.",
          "It is a conjugate vaccine linking mycobacterial polysaccharide to tetanus toxoid.",
        ],
        correctIndex: 1,
        explanation:
          "BCG is live attenuated M. bovis, attenuated by 230 passages over 13 years — the original demonstration of attenuation by repeated subculture. Its infant protection against miliary and meningeal tuberculosis is the reason it stays in routine national schedules.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Vaccines apply the primary and secondary antibody and T-cell responses you have studied, and are classified as live attenuated, killed inactivated, subunit or toxoid, conjugate, recombinant, viral-vector and messenger RNA. Adjuvants supply the danger signal that a purified antigen lacks; coverage above the herd immunity threshold of 1 − 1/R0 protects even the unvaccinated; and the national schedule delivers a defined set of vaccines at ages matched to each organism's epidemiology and the infant's ability to respond. Live vaccines are withheld in immunodeficiency and in pregnancy, and safety is a continuously monitored property rather than a single pre-licence result.",
      },
      {
        type: "paragraph",
        text: "Module 2 ends here. Module 3 opens with general virology: virion structure and replication, the cultivation of viruses in cells and eggs, and laboratory diagnosis of an obligate intracellular parasite that cannot be grown on agar.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 10 — General virology (fully authored)
// ---------------------------------------------------------------------------
function lesson10() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the structure of a virion and explain what an envelope does and does not do; apply the Baltimore classification to viral genomes and predict the replication strategy implied by each class; describe the sequence of the replication cycle and identify the step a drug can block; explain how viruses are cultivated and how cytopathic effect, haemadsorption and inclusion bodies are read; describe the four approaches to laboratory diagnosis of a viral infection and state when each is appropriate; and state the size range of viruses and the significance of filterability.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Module 1 — bacterial genetics and cell structure, for nucleic acid replication and envelope biology; module 2 — humoral and cell-mediated immunity, for serology and cytotoxic clearance of the infected cell.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Virion",
        text: "The complete, extracellular, infectious particle of a virus: a genome of DNA or RNA enclosed in a protein capsid, and in many viruses surrounded by a lipid envelope bearing viral glycoproteins.",
      },
      {
        type: "paragraph",
        text: "A virus is not a small bacterium. It has no ribosome, no membrane of its own metabolism, no way to make ATP, and no cell wall. It is a set of instructions for taking over a cell's biosynthetic apparatus. That single structural fact — obligate intracellular parasitism — drives every consequence of virology: viruses cannot be grown on agar, they are not killed by antibiotics that target bacterial walls or ribosomes, and antiviral drugs must target steps unique to the viral replication cycle rather than a wall that does not exist.",
      },
      {
        type: "paragraph",
        text: "Viruses are also the smallest infectious agents: at 20 to 300 nanometres they pass through filters that hold every bacterium. That filterability, established in the 1890s when tobacco mosaic disease passed through a Chamberland filter, was the first evidence that a new class of agent existed, and it remains the reason filterable is a word that appears in examination questions about the nature of viruses.",
      },

      { type: "heading", level: 2, text: "Structure" },
      {
        type: "table",
        headers: ["Component", "What it is", "Function", "How it is attacked"],
        rows: [
          ["Genome", "Double-stranded or single-stranded DNA or RNA, in linear or circular form", "Carries the information for the next generation; defines the replication strategy", "Nucleic acid is the target of polymerase inhibitors and nucleoside analogues"],
          ["Capsid", "A shell of protein subunits (capsomeres) in a helical, icosahedral or complex arrangement", "Protects the genome and is the vehicle that delivers it into the cell", "Capsid assembly and uncoating are the target of pleconaril and of the M2 ion-channel blockers of influenza"],
          ["Envelope", "A host-derived lipid bilayer into which viral glycoproteins are inserted", "Carries the attachment proteins and, being lipid, makes the virion susceptible to drying, detergents and solvents", "Detergent-susceptible — so handwashing and surface disinfectant inactivate enveloped viruses far more easily than naked ones"],
          ["Tegument (herpesviruses)", "A layer of proteins between capsid and envelope", "Carries regulatory proteins that begin transcription immediately on entry", "The site of action of the herpesvirus protease inhibitors"],
          ["Enzymes carried in the particle", "Polymerases, neuraminidase, integrase", "Perform the first steps of replication before any host machinery can be mobilised", "Neuraminidase inhibitors (oseltamivir) and integrase inhibitors block these directly"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The presence or absence of an envelope is a fact with a direct public health consequence. Enveloped viruses — influenza, HIV, Ebola, coronaviruses, all herpesviruses — are inactivated by soap and by alcohol, because detergent and solvent dissolve the lipid envelope. Naked viruses — poliovirus, norovirus, adenovirus, hepatitis A — survive drying, detergent, the acidic stomach and many disinfectants, which is why norovirus outbreaks persist on hard surfaces and why hepatitis A travels in food and water.",
      },

      { type: "heading", level: 2, text: "Genome classification and replication strategy" },
      {
        type: "paragraph",
        text: "David Baltimore's classification sorts viruses by the route their genome must take to yield messenger RNA, because messenger RNA is the only nucleic acid a ribosome can read. That route predicts everything about how the virus replicates, how it interacts with the nucleus, and how it can be treated.",
      },
      {
        type: "table",
        headers: ["Baltimore class", "Genome", "route to messenger RNA", "Named examples", "Where replication occurs"],
        rows: [
          ["I", "Double-stranded DNA", "Transcribed directly by host or viral polymerase", "Herpesviruses, adenoviruses, poxviruses, hepatitis B (uniquely)", "Mostly in the nucleus; poxviruses replicate in the cytoplasm"],
          ["II", "Single-stranded DNA", "Synthesised into double-stranded replicative form, then transcribed", "Parvovirus B19", "Nucleus"],
          ["III", "Double-stranded RNA", "Viral RNA polymerase transcribes the negative strand", "Rotavirus", "Cytoplasmic, in capsid-bound factories"],
          ["IV", "Positive-sense single-stranded RNA", "The genome itself is infectious messenger RNA and is translated directly on arrival", "Poliovirus, hepatitis C, SARS-CoV-2, dengue", "Cytoplasm"],
          ["V", "Negative-sense single-stranded RNA", "A virion-carried polymerase transcribes the genome into positive-sense messenger RNA", "Influenza, measles, rabies, Ebola", "Cytoplasm"],
          ["VI", "Single-stranded RNA with a DNA intermediate", "Reverse transcriptase makes DNA, which integrates and is transcribed", "HIV", "Nucleus, after integration"],
          ["VII", "Double-stranded DNA with an RNA intermediate", "Reverse transcription inside the virion before transcription", "Hepatitis B, a DNA virus that replicates through an RNA intermediate", "Nucleus and cytoplasm"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The classification is the key to antiviral therapy. A negative-sense RNA virus must carry its own polymerase into the cell, because the host has no enzyme that can read a negative-sense RNA — and that polymerase is a drug target. A positive-sense RNA virus such as poliovirus needs no virion polymerase at all, because its genome is itself the message, and so its naked RNA is infectious if injected into a cell.",
      },

      { type: "heading", level: 2, text: "The replication cycle" },
      {
        type: "table",
        headers: ["Stage", "What happens", "Step that can be blocked"],
        rows: [
          ["Attachment (adsorption)", "Viral glycoproteins bind specific cell receptors — CD4 and CCR5 for HIV, ICAM-1 for rhinovirus, sialic acid for influenza", "Attachment inhibitors; receptor decoys"],
          ["Penetration", "Enveloped viruses fuse with the plasma or endosomal membrane; naked viruses enter by endocytosis", "Fusion inhibitors such as enfuvirtide"],
          ["Uncoating", "Release of genome from the capsid in the cytoplasm or nucleus", "Ion-channel blockers (amantadine for influenza A), pleconaril for enteroviruses"],
          ["Eclipse phase", "No infectious virus can be recovered from the cell; all input has been uncoated and replication is under way", "This is the phase a plaque assay measures, because yield rises only after it ends"],
          ["Replication and transcription", "Viral polymerases, and sometimes host ones, make genome copies and messenger RNAs", "Nucleoside and non-nucleoside reverse-transcriptase inhibitors, polymerase inhibitors, protease inhibitors"],
          ["Assembly", "New genomes are packaged into capsids", "Assembly inhibitors"],
          ["Release", "Naked viruses usually lyse the cell; enveloped viruses bud through the host membrane", "Neuraminidase inhibitors that prevent influenza release"],
        ],
      },
      {
        type: "definition",
        term: "Cytopathic effect (CPE)",
        text: "The visible morphological change a virus produces in a cell culture: rounding up, detachment, syncytium formation, cell fusion, or cell lysis. Its pattern and speed are an early clue to the identity of the virus.",
      },
      {
        type: "paragraph",
        text: "Measles and herpesviruses cause cell fusion and multinucleated giant cells (syncytia); adenovirus causes cell rounding into grape-like clusters; enteroviruses destroy the monolayer entirely within a day. Haemadsorption, the ability of infected cells to bind red cells added to the culture, identifies influenza and parainfluenza, because their envelope carries haemagglutinin. Inclusion bodies — aggregates of viral protein or nucleic acid within the nucleus or cytoplasm — are further identifying clues.",
      },
      {
        type: "table",
        headers: ["Inclusion body", "Organism", "Site", "Appearance"],
        rows: [
          ["Negri bodies", "Rabies virus", "Cytoplasm of hippocampal neurons", "Eosinophilic, sharply demarcated"],
          ["Owl's eye", "Cytomegalovirus", "Nucleus of enlarged cells", "A large basophilic intranuclear inclusion with a halo"],
          ["Cowdry type A", "Herpes simplex and varicella", "Nucleus", "Eosinophilic, with marginated chromatin"],
          ["Guarnieri bodies", "Smallpox (vaccinia)", "Cytoplasm of epidermal cells", "Eosinophilic, perinuclear"],
          ["Molluscum bodies", "Molluscum contagiosum", "Cytoplasm", "Large eosinophilic bodies that push the nucleus aside"],
          ["Councilman bodies", "Hepatitis B and yellow fever", "Liver", " apoptotic hepatocytes with eosinophilic cytoplasm"],
        ],
      },

      { type: "heading", level: 2, text: "Cultivation of viruses" },
      {
        type: "table",
        headers: ["System", "What it is", "Used for"],
        rows: [
          ["Tissue culture cells", "Primary cells (monkey kidney, human amnion), diploid fibroblast lines, or continuous lines (HeLa, HEp-2, Vero)", "Diagnostic isolation and vaccine production"],
          ["Embryonated hen's eggs", "Fertile eggs inoculated onto chorioallantoic membrane, into amniotic cavity, allantoic cavity or yolk sac", "Influenza and rabies virus growth; the classical route for influenza vaccines"],
          ["Laboratory animals", "Suckling mice, rabbits, ferrets", "Coxsackie A (mice), rabies (mouse brain), experimental pathogenesis"],
          ["Organ culture", "Nasal and tracheal epithelium", "Coronavirus and rhinovirus research"],
        ],
      },
      {
        type: "paragraph",
        text: "Isolation is confirmed and quantified by plaque assay: a monolayer infected with limiting dilutions forms a clear zone where virus has lysed cells, and a single infectious unit in a plaque is counted as one plaque-forming unit. The titre is the number of plaque-forming units per millilitre, and TCID50 — the dose infecting half of a set of cultures — is the alternative when plaques do not form.",
      },

      { type: "heading", level: 2, text: "Laboratory diagnosis" },
      {
        type: "table",
        headers: ["Approach", "What it detects", "Turnaround", "Best used when"],
        rows: [
          ["Antigen detection", "Viral protein in the sample — for example a respiratory antigen test or a rapid dengue NS1 test", "Minutes to hours", "Rapid decisions are needed at the point of care, and when molecular testing is unavailable"],
          ["Nucleic acid detection (NAAT, RT-PCR)", "Viral RNA or DNA, often quantified as a load", "Hours to a day", "Acute infection is suspected in a window period, the organism is uncultivable, or a viral load guides treatment (HIV, hepatitis B and C, cytomegalovirus)"],
          ["Serology", "IgM for recent infection, or a fourfold IgG rise between acute and convalescent sera", "Days for a pair", "Diagnosis is retrospective, the sample was taken too early or too late for a nucleic acid test, or a consequence must be shown (rubella in pregnancy)"],
          ["Electron microscopy", "Viral particles by morphology", "Hours, with a specialist laboratory", "Identifying an unknown virus from faeces or vesicle fluid — classic for the herpesviruses and the gastroenteritis viruses"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "A positive result means different things in different assays. A positive nucleic acid test means the genome is present — a present or a recent infection, not necessarily a live one. A positive IgM can persist for months and can be a cross-reaction. Only a paired serum with a fourfold rise is strong serological evidence of current infection.",
      },

      { type: "heading", level: 2, text: "Subviral agents and why they are not viruses" },
      {
        type: "table",
        headers: ["Agent", "Composition", "Relation to viruses", "Disease"],
        rows: [
          ["Prion", "Protein only, no nucleic acid", "Not a virus and not a living agent; a misfolded protein that converts normal protein into the misfolded form", "Creutzfeldt–Jakob disease, variant CJD from bovine spongiform encephalopathy, kuru, Gerstmann–Sträussler–Scheinker"],
          ["Viroid", "Circular RNA only, no capsid", "Much smaller than a virus; a plant pathogen", "Potato spindle tuber and coconut cadang-cadang disease"],
          ["Bacteriophage", "Nucleic acid in a protein capsid", "A virus of bacteria; the original model of viral replication and the basis of phage therapy", "Determines toxin production in diphtheria and cholera via lysogeny"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Prions explain a set of clinical facts no other agent explains: a long incubation of years to decades, a relentlessly progressive spongiform encephalopathy without fever or inflammation, and absolute resistance to radiation, boiling and conventional sterilisation — because the agent is protein, and decontamination requires sodium hydroxide, sodium hypochlorite at high concentration, or autoclaving at 134°C for 18 minutes.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying viruses are killed by antibiotics. Antibiotics target bacterial walls, ribosomes, folate synthesis and DNA gyrase — none of which a virus has. A cyclic antibiotic course for a viral cold does nothing to the virus, selects resistant flora, and exposes the patient to adverse effects for no benefit.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing the positive-sense and negative-sense genome with positive and negative strand of DNA. The signs refer to whether the genome is itself infectious as messenger RNA (positive sense) or must be transcribed first by a virion-carried polymerase (negative sense). It is the virus's answer to the question of how it gets its proteins made, not a chemical property.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Assuming every virus grows in every cell. Viruses are receptor-limited: influenza binds sialic acid on respiratory epithelium, HIV binds CD4 on T cells and macrophages, and hepatitis B binds a hepatocyte bile acid transporter. Cell tropism, not technology, is the reason a given virus can be isolated only from a given specimen.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why must a negative-sense RNA virus carry an RNA polymerase inside its virion, and why does a positive-sense virus need none?",
        answer:
          "Because a ribosome can read only messenger-sense RNA; a negative-sense genome is the complement of messenger RNA, so the polymerase must travel with it to transcribe it. A positive-sense genome is itself the message, so it is translated directly on release into the cytoplasm.",
        explanation:
          "This is the basis of the Baltimore classification and it is also a drug target: the virion polymerase of influenza and of the rhabdoviruses is what favipiravir-like agents and nucleoside analogues must attack.",
      },
      {
        type: "question",
        prompt: "A vesicle fluid from a patient with a pox-like rash is examined by electron microscopy. What is being looked for, and what is the advantage of this method over culture?",
        answer:
          "The brick-shaped poxvirus or the round herpesvirus particles visible by morphology. Electron microscopy gives an immediate answer without needing culture, so it can identify a virus even when it cannot be grown in the cells available.",
        explanation:
          "Electron microscopy retains a role for slow-growing, uncultivable and novel viruses, and it distinguishes the brick-shaped poxviruses, the bullet-shaped rhabdoviruses and the icosahedral adenoviruses on shape alone.",
      },
      {
        type: "question",
        prompt: "Why is norovirus more resistant to environmental control than influenza?",
        answer:
          "Because norovirus is a naked (non-enveloped) calicivirus, whereas influenza is enveloped. Soap and alcohol dissolve the envelope of influenza but do not attack the capsid of norovirus, so norovirus survives on hard surfaces, resists dilute bleach, and requires stronger disinfectants for outbreak control.",
        explanation:
          "Envelope presence is the single most practical predictor of vulnerability to detergents and drying — a fact used daily in infection-control decisions and in the choice of surface disinfectant.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which statement about virion structure is correct?",
        options: [
          "A naked virus is more susceptible to drying and detergents than an enveloped one, because it lacks a lipid envelope.",
          "An enveloped virus is more susceptible to drying, detergents and solvents than a naked one, because its envelope is a lipid bilayer.",
          "Naked and enveloped viruses are equally susceptible to detergents, because both depend on capsid integrity.",
          "Only naked viruses carry enzymes in the virion, because envelope glycoproteins interfere with packaging.",
        ],
        correctIndex: 1,
        explanation:
          "The envelope is a host-derived lipid bilayer, so detergent, soap, alcohol and drying destroy it. Naked viruses protected by their capsid resist those measures, which is why norovirus and hepatitis A persist on surfaces and in food.",
      },
      {
        type: "mcq",
        stem: "Which combination of genome type and required virion enzyme is correct?",
        options: [
          "Positive-sense RNA virus — carries a polymerase, because the genome is not messenger sense.",
          "Negative-sense RNA virus — carries an RNA polymerase, because the host cannot read a negative-sense template.",
          "Double-stranded DNA virus — carries a reverse transcriptase, because RNA is needed first.",
          "Single-stranded DNA virus — carries only a proteasome, because transcription is not needed.",
        ],
        correctIndex: 1,
        explanation:
          "Negative-sense RNA cannot be read by any host ribosome, so the virus must supply its own polymerase in the particle; positive-sense RNA is the message itself, and retroviruses — not ordinary DNA viruses — are the ones that carry reverse transcriptase.",
      },
      {
        type: "mcq",
        stem: "A laboratory isolates a virus that causes cell fusion and multinucleated giant cells in a tissue culture. Which finding in the culture best identifies influenza?",
        options: [
          "Haemadsorption of added guinea-pig red cells onto the infected monolayer.",
          "Formation of intranuclear owl's eye inclusion bodies.",
          "A clear plaque lysis of the monolayer within six hours.",
          "Syncytium formation in the absence of any cytopathic effect.",
        ],
        correctIndex: 0,
        explanation:
          "Influenza and parainfluenza carry haemagglutinin in their envelope, so infected cells adsorb added red cells — the haemadsorption test. Owl's eye inclusions indicate cytomegalovirus, and rapid plaque lysis without haemadsorption points to an enterovirus.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "A virion is a genome in a capsid, sometimes in a lipid envelope, and nothing else: no ribosome, no wall, no independent metabolism. That is why viruses are filterable at 20 to 300 nanometres, why they cannot be grown on agar, and why every antiviral must attack a step unique to the viral cycle. The Baltimore classification sorts viruses by how their genome reaches messenger RNA, and that route — especially whether a virion polymerase is required — predicts both tropism and therapy. Diagnosis uses antigen detection, nucleic acid amplification, serology and electron microscopy, and each carries a different meaning for the same clinical question.",
      },
      {
        type: "paragraph",
        text: "Next: DNA viruses. You will meet the herpesviruses with their latency, the poxviruses with their unique cytoplasmic replication, the oncogenic papillomaviruses and polyomaviruses, and hepatitis B — the DNA virus that replicates through an RNA intermediate.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 11 — DNA viruses (fully authored)
// ---------------------------------------------------------------------------
function lesson11() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the eight human herpesviruses, their primary disease, their site of latency and their reactivation; explain the clinical distinction between primary simplex infection and recurrent herpes labialis, and how acyclovir works; describe varicella–zoster, its dermatomal reactivation and the two vaccines against it; describe the poxviruses, smallpox eradication, and molluscum contagiosum; describe adenoviruses and their role in epidemic keratoconjunctivitis and pharyngitis; describe human papillomavirus and the E6–p53 and E7–pRb mechanism of oncogenesis; describe polyomaviruses, parvovirus B19 and hepatitis B, including the serological markers that define its life cycle.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 10 — General virology. The Baltimore classification and the notion of latency established there are used throughout; lesson 2 for culture-based diagnosis.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Latency",
        text: "A state in which the viral genome persists in a non-replicating form in the host cell — often as an episome — with limited or no gene expression and no production of infectious particles, until reactivation restores the lytic cycle.",
      },
      {
        type: "paragraph",
        text: "The DNA viruses are the master class of latency, and that fact shapes all eight herpesvirus diseases. Primary infection often passes unnoticed; the genome then persists for life in neurons or lymphocytes in a latent state; and immunosuppression, fever, ultraviolet light or stress reactivates it into a productive infection. The recurrent cold sore is not a reinfection — it is the same virus, dormant in the trigeminal ganglion, travelling down the nerve to the lip.",
      },
      {
        type: "paragraph",
        text: "Latency carries a second consequence: because the virus persists for life in the host, a person with long-past infection still carries it, so infectious mononucleosis is diagnosed by a serological pattern, and an immunosuppressed transplant patient must be watched for cytomegalovirus reactivation long after the original infection.",
      },

      { type: "heading", level: 2, text: "Herpesviridae: the eight human herpesviruses" },
      {
        type: "table",
        headers: ["Virus", "Subfamily", "Primary disease", "Site of latency", "Reactivation and salient facts"],
        rows: [
          ["Herpes simplex virus 1 (HSV-1)", "Alpha", "Gingivostomatitis, keratitis, encephalitis in children and young adults", "Sensory and autonomic nerve ganglia — the trigeminal ganglion", "Recurrent herpes labialis; the most common sporadic encephalitis, with a predilection for the temporal lobe"],
          ["Herpes simplex virus 2 (HSV-2)", "Alpha", "Genital herpes, neonatal herpes acquired in the birth canal", "Sacral nerve root ganglia", "Recurrent genital ulceration; a leading cause of neonatal encephalitis, and the reason for acute caesarean section with active lesions"],
          ["Varicella–zoster virus (VZV, HHV-3)", "Alpha", "Chickenpox (varicella) — a generalised vesicular rash after respiratory transmission", "Dorsal root ganglion of a single dermatome", "Herpes zoster: painful vesicles confined to one dermatome, from reactivation in the dorsal root ganglion"],
          ["Epstein–Barr virus (EBV, HHV-4)", "Gamma", "Infectious mononucleosis, and Burkitt lymphoma in African children", "B lymphocytes", "Reactivates in immunosuppression; causes nasopharyngeal carcinoma, post-transplant lymphoproliferative disease and oral hairy leukoplakia"],
          ["Cytomegalovirus (CMV, HHV-5)", "Beta", "Infectious mononucleosis with a negative heterophile test", "Monocytes and macrophages", "The major opportunistic virus of transplant and AIDS; congenital CMV causes sensorineural deafness and microcephaly; ganciclovir is the drug of choice"],
          ["Human herpesvirus 6 (HHV-6)", "Beta", "Roseola infantum (exanthem subitum) — the commonest cause of fever and rash in infants", "T lymphocytes and monocytes", "Febrile convulsions in infancy, and reactivation encephalitis after transplant"],
          ["Human herpesvirus 7 (HHV-7)", "Beta", "Roseola-like illness in some children", "T lymphocytes", "Similar in kind, usually milder; diagnosed by PCR"],
          ["Human herpesvirus 8 (HHV-8)", "Gamma", "Kaposi sarcoma, primary effusion lymphoma, Castleman disease", "B lymphocytes and endothelial cells", "The cause of Kaposi sarcoma in HIV, treated with highly active antiretroviral therapy plus chemotherapy"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Heterophile antibody testing is the classical way to separate the two causes of mononucleosis. The Paul–Bunnell test detects a sheep-cell-agglutinin antibody produced by polyclonal B-cell activation by EBV, and the Monospot is its rapid form. CMV mononucleosis has an identical clinical picture but a negative heterophile test, which is the first clue to the correct diagnosis.",
      },
      {
        type: "definition",
        term: "Acyclovir and its analogues",
        text: "A synthetic nucleoside analogue activated only by virus-encoded thymidine kinase, then phosphorylated by host enzymes to a triphosphate that terminates the growing viral DNA chain. Its selective toxicity is the double requirement of viral kinase and viral DNA polymerase.",
      },
      {
        type: "paragraph",
        text: "That selectivity is the clinical answer to 'why is acyclovir so safe?'. It does nothing in an uninfected cell because there is no viral thymidine kinase to activate it, and it stops the herpesvirus polymerase that it targets. The consequence of the same mechanism is resistance: acyclovir-resistant HSV, seen in immunocompromised patients with persistent ulcers, usually carries a mutation in the thymidine kinase gene, and is treated with foscarnet, which acts directly on the polymerase without needing activation.",
      },

      { type: "heading", level: 2, text: "Varicella–zoster" },
      {
        type: "paragraph",
        text: "Varicella is a respiratory acquisition that disseminates, and is one of the most contagious human infections: the secondary attack rate in a susceptible household is about 90 per cent. It causes crops of vesicles at successive stages in different areas of the body — the rash is pleomorphic because each crop is a day later than the last. In the immunocompromised it produces progressive varicella with pneumonia, encephalitis and hepatitis; in pregnancy it causes congenital varicella syndrome.",
      },
      {
        type: "paragraph",
        text: "Reactivation gives herpes zoster: a painful vesicular eruption in a single sensory dermatome, because the virus travels down the nerve from the dorsal root ganglion where it was silent. It is a disease of advancing age and cell-mediated immunosuppression, and its treatment is acyclovir or valacyclovir started within 72 hours, with amitriptyline and gabapentin for the post-herpetic neuralgia that follows.",
      },
      {
        type: "table",
        headers: ["Vaccine", "Type", "Dose", "Purpose"],
        rows: [
          ["Varicella vaccine", "Live attenuated Oka strain", "Two doses", "Prevent chickenpox in children and in seronegative adults"],
          ["Zoster vaccine", "Recombinant glycoprotein E with adjuvant, or a high-titre live vaccine", "Two doses (recombinant)", "Prevent shingles and post-herpetic neuralgia in older adults by boosting cell-mediated immunity"],
        ],
      },

      { type: "heading", level: 2, text: "Poxviridae" },
      {
        type: "paragraph",
        text: "Poxviruses are the largest and most complex viruses: a brick or ovoid shape with a biconcave core, a lateral body, and a lipoprotein envelope, carrying a genome of 130–375 kilobase pairs of double-stranded DNA and encoding its own transcription machinery. Their replication in the cytoplasm is unique among DNA viruses, and is the reason they do not need the host nucleus at all.",
      },
      {
        type: "table",
        headers: ["Virus", "Disease", "Key facts"],
        rows: [
          ["Variola (smallpox)", "A systemic febrile illness with a centrifugal vesicular rash that becomes pustular and scarring", "Eradicated in 1980 by a global vaccination campaign — the only human disease ever eliminated; declared eradicated after a global verification by the World Health Organization"],
          ["Vaccinia", "The vaccine virus used against smallpox, a laboratory-derived poxvirus of uncertain origin", "Too dangerous for routine use now, but retained for research and biodefence"],
          ["Molluscum contagiosum", "Umbilicated pearly papules with large eosinophilic molluscum bodies in the cytoplasm", "A common childhood and sexually transmitted skin infection; intracytoplasmic molluscum bodies are the diagnostic pathognomonic finding"],
          ["Monkeypox (mpox)", "A febrile vesicular disease acquired from animal contacts, with lymphadenopathy", "Now a global outbreak threat, prevented by cross-protection from smallpox vaccination and treated with tecovirimat"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The epidemiology of smallpox eradication is a study in virus biology. No animal reservoir, a short and identifiable incubation, and a vaccine that produced a visible scar that could be checked at the door — ring vaccination of contacts then brought the last case in 1977 and global certification in 1980. Monkeypox, by contrast, has a rodent and primate reservoir, so it cannot be eradicated by vaccination alone.",
      },

      { type: "heading", level: 2, text: "Adenoviridae" },
      {
        type: "paragraph",
        text: "Adenoviruses are non-enveloped, icosahedral, with a double-stranded DNA genome and a characteristic fibre protein that attaches to the cell surface. There are more than 50 serotypes and they cause disease mostly in children and in closed communities.",
      },
      {
        type: "table",
        headers: ["Serotype", "Disease", "Epidemiological setting"],
        rows: [
          ["1, 2, 5 and 6", "Endemic respiratory infection and pharyngitis, most in young children", "Households and nurseries year-round"],
          ["3, 4, 7 and 21", "Pharyngoconjunctival fever and acute respiratory disease", "Swimming pools and military recruits — a classic 'closed community' outbreak"],
          ["8, 19, 37 and 53", "Epidemic keratoconjunctivitis", "Ophthalmic clinics, from a contaminated tonometer"],
          ["40 and 41", "Gastroenteritis in young children", "The second commonest viral cause of childhood gastroenteritis after rotavirus"],
          ["Any serotype", "Disseminated adenovirus pneumonia and hepatitis", "Stem-cell transplant recipients and other severe immunosuppression"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Adenovirus vectors are, paradoxically, most valuable for what they do not cause. Replication-deficient adenoviruses, and now their helpers, carry therapeutic genes into cells in gene therapy and were the delivery vehicle for several COVID-19 vaccines — because the adenovirus capsid enters target cells efficiently while allowing an inserted transgene to be expressed without replicating.",
      },

      { type: "heading", level: 2, text: "Human papillomavirus: the oncogenic DNA virus" },
      {
        type: "definition",
        term: "Oncogenic HPV types",
        text: "About a dozen sexually transmitted HPV types, principally 16 and 18, whose E6 and E7 oncoproteins inactivate the p53 and retinoblastoma tumour suppressors, so the infected epithelial cell loses its cell-cycle checkpoints and progresses to carcinoma.",
      },
      {
        type: "table",
        headers: ["Type", "Disease", "Oncogenicity"],
        rows: [
          ["HPV 16 and 18", "High-grade cervical intra-epithelial neoplasia and invasive carcinoma of the cervix, and an increasing fraction of oropharyngeal carcinoma", "Cause about 70 per cent of cervical cancers; fully preventable by vaccination"],
          ["HPV 6 and 11", "Condylomata acuminata (genital warts) and recurrent respiratory papillomatosis", "Low risk — these are the types included for wart prevention"],
          ["HPV 1, 2 and 4", "Plantar and palmar warts", "No malignant potential"],
          ["HPV 5 and 8", "Cutaneous squamous cell carcinoma in epidermodysplasia verruciformis", "Rare, in the genetically predisposed"],
        ],
      },
      {
        type: "paragraph",
        text: "The mechanism is a clean example of viral oncogenesis. E6 binds p53 and directs it to cellular ubiquitination and degradation, so a cell with DNA damage no longer arrests in G1 or undergoes apoptosis; E7 binds the retinoblastoma protein and releases the transcription factor E2F that it normally holds back, so the cell enters S phase without permission. The two together disable the two principal tumour suppressor pathways, which is why HPV-induced cancer takes years of persistent infection to develop, and why HPV vaccination before sexual debut is a primary prevention of cancer, not merely of warts.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The HPV vaccine is a virus-like particle vaccine: self-assembling L1 capsid protein with no DNA inside, produced in yeast. It therefore cannot replicate, cannot cause infection, and generates a high-titre neutralising antibody response that is more effective than the antibody response from natural infection. The nine-valent vaccine covers 6, 11, 16, 18 and five further oncogenic types.",
      },

      { type: "heading", level: 2, text: "Polyomaviridae, Parvoviridae and Hepadnaviridae" },
      {
        type: "table",
        headers: ["Virus", "Genome", "Disease", "Diagnosis"],
        rows: [
          ["JC polyomavirus", "Circular double-stranded DNA", "Progressive multifocal leukoencephalopathy — demyelination in advanced HIV and in natalizumab-treated patients", "PCR on cerebrospinal fluid, with a characteristic MRI and bilateral asymmetrical white-matter lesions"],
          ["BK polyomavirus", "Circular double-stranded DNA", "Nephropathy in renal transplant recipients and haemorrhagic cystitis in stem-cell transplants", "Plasma and urine PCR, with decoy cells in urine cytology"],
          ["Parvovirus B19", "Small single-stranded DNA of about 5.6 kb", "Slapped-cheek disease (erythema infectiosum), aplastic crisis in sickle cell disease, hydrops fetalis in pregnancy, arthropathy", "Serology for IgM and IgG; viral PCR in a pregnant or immunosuppressed patient"],
          ["Hepatitis B (Dane particle)", "Partially double-stranded circular DNA, replicating through an RNA intermediate by reverse transcription", "Acute hepatitis, chronic hepatitis, cirrhosis, hepatocellular carcinoma; a vaccine-preventable cause of all three", "HBsAg is the infection marker, HBeAg is the replication marker, and anti-HBs is the protective antibody"],
        ],
      },
      {
        type: "paragraph",
        text: "The hepatitis B serological profile is a compact test of everything you know about viral replication. HBsAg appears early and is the first marker of infection; HBeAg and high viral DNA mark high infectivity and replication; IgG anti-HBc appears later and persists for life; and the development of anti-HBs — with the loss of HBsAg — marks resolution and immunity. A vaccinated person has anti-HBs without anti-HBc, whereas a person who resolved natural infection has both, and that difference distinguishes immunised from naturally immune patients.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The hepatitis B vaccine is a classic biotechnological product: HBsAg is expressed in Saccharomyces cerevisiae, assembles into 22-nanometre particles, and carries no viral nucleic acid, so it cannot cause infection. Three doses protect, and the vaccine was the first vaccine shown to prevent a human cancer — hepatocellular carcinoma.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Treating all herpesviruses as behaving the same way. They differ in latency site and in consequence: HSV and VZV hide in dorsal root ganglia and come back as skin lesions, CMV hides in monocytes and comes back as invasive disease in transplant, and EBV hides in B cells and comes back as a lymphoproliferative disorder.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Thinking HPV only causes cervical cancer. HPV 16 is a major cause of oropharyngeal squamous cell carcinoma in sexually active men and women, and the incidence of that cancer now exceeds that of cervical cancer in some high-income countries — which is the reason for the extension of HPV vaccination to boys.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing HBsAg and anti-HBs. HBsAg is the antigen, and its presence with no anti-HBs means active infection; anti-HBs is the antibody, and its presence with no HBsAg means immunity, whether from vaccination or from resolved infection — the difference being the presence of anti-HBc, which is present only after natural infection.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A patient with advanced HIV develops painful vesicles in a single left thoracic dermatome. Explain the mechanism and the treatment.",
        answer:
          "Reactivation of varicella–zoster virus latent in the dorsal root ganglion, with the virus travelling down the sensory nerve to the skin of one dermatome, now unopposed because the cell-mediated response that suppresses it has collapsed. Treatment is acyclovir or valacyclovir for seven days.",
        explanation:
          "Shingles is a marker of impaired cell-mediated immunity; an HIV patient with multi-dermatomal or disseminated zoster needs both antiviral therapy and a review of their immune status.",
      },
      {
        type: "question",
        prompt: "How does acyclovir achieve selective toxicity, and how does acyclovir-resistant HSV usually arise?",
        answer:
          "It is activated by the virus-encoded thymidine kinase and then inhibits the viral DNA polymerase, so an uninfected cell does not activate it. Resistance usually comes from a mutation that deletes or alters the thymidine kinase, so the prodrug is never phosphorylated.",
        explanation:
          "Foscarnet bypasses the requirement for activation by acting directly on the viral polymerase, which is why it is used against acyclovir-resistant HSV.",
      },
      {
        type: "question",
        prompt: "A serology shows HBsAg negative, anti-HBc positive and anti-HBs positive. What is the interpretation?",
        answer:
          "Resolved past hepatitis B infection, with immunity. Anti-HBc positivity indicates that the patient had a natural infection rather than vaccination, and the anti-HBs indicates that it resolved with protective antibody present.",
        explanation:
          "A vaccinated patient would be anti-HBs positive and anti-HBc negative. The distinction matters clinically because persons with resolved infection donate differently, and it defines whether anti-HBc-positive organs are suitable for a naive recipient.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which pairing of herpesvirus with its site of latency is correct?",
        options: [
          "Herpes simplex 1 in B lymphocytes; cytomegalovirus in the trigeminal ganglion.",
          "Herpes simplex 1 in the trigeminal ganglion; Epstein–Barr virus in B lymphocytes.",
          "Varicella–zoster in B lymphocytes; cytomegalovirus in the dorsal root ganglion.",
          "Epstein–Barr virus in dorsal root ganglia; cytomegalovirus in respiratory epithelium.",
        ],
        correctIndex: 1,
        explanation:
          "HSV and VZV are alpha-herpesviruses that hide in sensory nerve ganglia and reactivate as dermatomal eruptions; EBV is a gamma-herpesvirus that persists in B lymphocytes, and CMV hides in monocytes and macrophages.",
      },
      {
        type: "mcq",
        stem: "Which statement about human papillomavirus is correct?",
        options: [
          "The vaccine is a live attenuated virus and is contraindicated in pregnancy for that reason.",
          "HPV is a DNA virus whose E6 and E7 oncoproteins inactivate p53 and the retinoblastoma protein, and the vaccine is a DNA-free virus-like particle.",
          "HPV 6 and 11 are the principal cause of cervical carcinoma.",
          "HPV infects only cervical epithelium, so vaccination has no effect on oropharyngeal cancer.",
        ],
        correctIndex: 1,
        explanation:
          "E6 degrades p53 and E7 binds the retinoblastoma protein, disabling the two central tumour suppressor pathways; the vaccine is an L1 capsid virus-like particle with no genome, and HPV 16 causes oropharyngeal as well as cervical carcinoma.",
      },
      {
        type: "mcq",
        stem: "A child with sickle cell disease develops a sudden drop in haemoglobin after a febrile illness with a slapped-cheek rash. Which virus, and which mechanism?",
        options: [
          "Influenza virus, by direct suppression of the bone marrow.",
          "Parvovirus B19, by infecting erythroid progenitors through the P antigen and halting red cell production, so the shortened survival of sickle red cells becomes apparent.",
          "Adenovirus 7 and 21, by direct haemolysis of the red cells.",
          "Epstein–Barr virus, by immune haemolysis of opsonised red cells.",
        ],
        correctIndex: 1,
        explanation:
          "Parvovirus B19 infects erythroid progenitors through the P blood group antigen and produces an aplastic crisis in any patient with shortened red-cell survival. The slapped-cheek rash of erythema infectiosum is the clinical signature.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The DNA viruses are latency specialists: eight herpesviruses hiding in neurons and lymphocytes, poxviruses replicating uniquely in the cytoplasm and being eradicated in the case of smallpox, adenoviruses causing respiratory and gastroenteric disease and serving as vectors, papillomaviruses driving cancer through E6 and E7 and preventable by virus-like particle vaccination, polyomaviruses causing leukoencephalopathy and nephropathy in the immunosuppressed, parvovirus B19 halting erythropoiesis, and hepatitis B — the only DNA virus replicating through reverse transcription, with a serological pattern that records its life cycle.",
      },
      {
        type: "paragraph",
        text: "Next: RNA viruses. You will meet the segmented antigenically drifting orthomyxoviruses, the paramyxoviruses, the arboviruses and flaviviruses, the enteroviruses with their eradication programme, and HIV with its reverse transcription and its treatment targets.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 12 — RNA viruses (fully authored)
// ---------------------------------------------------------------------------
function lesson12() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: distinguish antigenic drift from antigenic shift in influenza and explain why a new subtype produces a pandemic; describe the paramyxoviruses and the clinical signature of measles, mumps and respiratory syncytial virus; describe the arboviruses and flaviviruses and their vectors, and the clinical patterns of dengue, Japanese encephalitis and chikungunya; describe the enteroviruses, the two poliovirus vaccines and the elimination programme; describe retroviruses, the replication of HIV and the drug classes that target it; and name the clinical syndromes of norovirus, rotavirus, and the coronaviruses.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 10 and 11. The Baltimore classification, the envelope and the notion of a segmented genome from general virology are the keys to this lesson.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Antigenic drift",
        text: "The slow accumulation of point mutations in the genes encoding the viral surface antigens, which gradually changes the antigenic character of the virus and allows seasonal reinfection of a partially immune population.",
      },
      {
        type: "definition",
        term: "Antigenic shift",
        text: "A sudden and complete change in the surface antigen, caused by reassortment of segmented viral genomes when two influenza strains co-infect the same cell — producing a subtype to which nobody has prior immunity.",
      },
      {
        type: "paragraph",
        text: "The RNA viruses are the most variable of human pathogens, because RNA-dependent RNA polymerases have no proof-reading, so they make an error with every replication round. That inaccuracy produces antigenic drift, permits escape from immunity and vaccination, and makes surveillance an annual exercise. Where the genome is segmented — influenza has eight RNA segments on its own — a second phenomenon adds: co-infection of a cell by two strains can shuffle the segments and produce a radically new virus.",
      },
      {
        type: "paragraph",
        text: "The clinical consequence is a division of the RNA viruses into those we can control (the vaccine types, polio and measles) and those we cannot (the seasonal influenza types, the coronaviruses, and HIV). The dividing line is mutation rate, host range, and whether a single stable antigen can be targeted by long-lived antibody.",
      },

      { type: "heading", level: 2, text: "Orthomyxoviridae: influenza" },
      {
        type: "table",
        headers: ["Type", "Subtypes", "Human disease", "Key facts"],
        rows: [
          ["Influenza A", "Haemagglutinin H1–H16 with neuraminidase N1–N9; the human-adapted subtypes include H1N1 and H3N2", "Seasonal epidemics, and all four pandemics of the modern era", "Reservoir in aquatic birds; co-infection of pigs can mix human, avian and swine segments; H5N1 and H7N9 are zoonotic"],
          ["Influenza B", "Victoria and Yamagata lineages", "Seasonal epidemics in children and older adults", "Only a human virus; contributes to disease each winter but does not cause pandemics"],
          ["Influenza C", "One subtype", "Mild upper respiratory infection", "Rarely diagnosed and not epidemic"],
          ["Influenza D", "Cattle reservoir", "Not a human pathogen of note", "Worth mentioning because it shows how host range constrains emergence"],
        ],
      },
      {
        type: "paragraph",
        text: "Influenza A replication is a masterclass in anti-viral design. Haemagglutinin binds sialic acid and fuses the envelope to the endosomal membrane; neuraminidase cleaves sialic acid to release budding virions from the cell surface and to let the virus move through mucus; the trimeric polymerase, carried in the particle, transcribes the negative-sense segments; and the whole cycle is accelerated by the segment-8 gene that produces NS1, a protein that suppresses the interferon response.",
      },
      {
        type: "table",
        headers: ["Drug", "Target", "Effect", "Place"],
        rows: [
          ["Oseltamivir (oral), zanamivir (inhaled)", "Neuraminidase", "Prevents release and spread", "Treatment begun within 48 hours, and for prophylaxis in outbreaks"],
          ["Baloxavir marboxil", "Cap-dependent endonuclease of the polymerase", "Halts transcription early in the cycle", "A single oral dose, but mutation of the polymerase reduces susceptibility"],
          ["Amantadine and rimantadine", "The M2 ion channel", "Prevents uncoating", "Withdrawn from routine use because of widespread resistance"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The great influenza pandemic of 1918 was caused by an H1N1 virus of avian-like genome that killed an estimated 50 million people, with a mortality concentrated in young adults — plausibly because their immune systems had not seen any influenza A before and mounted an overwhelming cytokine response. It was not drift but the introduction of an entirely new subtype, and the 2009 pandemic was caused by a triple-reassortant H1N1 drawn from human, avian and swine segments.",
      },

      { type: "heading", level: 2, text: "Paramyxoviridae" },
      {
        type: "table",
        headers: ["Virus", "Disease", "Signature clinical features", "Vaccine and control"],
        rows: [
          ["Measles virus", "Measles — a highly contagious systemic illness", "Fever, cough, coryza and conjunctivitis, then a maculopapular rash spreading cephalocaudally, with Koplik spots on the buccal mucosa; complications include pneumonia, and subacute sclerosing panencephalitis years later", "Live attenuated measles-containing vaccine in two doses, given at 9 and 16 months in the national schedule, with a second dose to catch primary vaccine failures"],
          ["Mumps virus", "Mumps — painful parotitis", "Parotid swelling with fever; complications include orchitis in post-pubertal boys, meningitis, pancreatitis and sensorineural deafness", "Live attenuated vaccine in MMR"],
          ["Respiratory syncytial virus (RSV)", "Bronchiolitis in infants, pneumonia in the elderly", "Wheezing and respiratory distress with copious secretions; diagnosed by antigen or nucleic acid test on a nasopharyngeal aspirate", "Palivizumab monoclonal prophylaxis in high-risk infants; adult vaccines and maternal immunisation are now available"],
          ["Parainfluenza viruses 1–4", "Croup, pharyngitis, bronchiolitis", "The barking cough and steeple sign of laryngotracheobronchitis", "No vaccine"],
          ["Nipah and Hendra viruses", "Zoonotic encephalitis, spread by fruit bats and pigs", "Encephalitis with relapsing symptoms and very high mortality", "No licensed human vaccine; control depends on avoiding fruit-bat and pig contact"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Measles is not a mild rash: it transiently suppresses the whole immune system, including cellular recall responses, and leaves the child vulnerable to bacterial pneumonia and to measles-induced immune amnesia. That is why measles mortality in low-income settings is a childhood killer, and why vitamin A supplementation is standard, because the epithelium of the cornea and respiratory tract depend on it.",
      },

      { type: "heading", level: 2, text: "Arboviruses and flaviviruses" },
      {
        type: "definition",
        term: "Arbovirus",
        text: "A virus transmitted to humans by the bite of an arthropod vector — mosquitoes, ticks, sandflies or midges — with a defined animal reservoir. The word is an ecological category, not a taxonomic one.",
      },
      {
        type: "table",
        headers: ["Virus", "Vector and reservoir", "Disease", "Clinical and diagnostic notes"],
        rows: [
          ["Dengue virus (4 serotypes)", "Aedes aegypti and Aedes albopictus, from infected humans; the principal reservoir in the city cycle", "Classic dengue fever, dengue haemorrhagic fever, dengue shock syndrome", "Severe disease is usually associated with secondary infection by a different serotype; NS1 antigen and IgM in the first week, RT-PCR for confirmation"],
          ["Chikungunya (alphavirus)", "Aedes mosquitoes", "Sudden fever with severe symmetric polyarthralgia and a rash", "Arthralgia may persist for months; distinguished from dengue by the intensity of joint pain and by serology or RT-PCR"],
          ["Japanese encephalitis (flavivirus)", "Culex mosquitoes, with pigs and wading birds as amplifying reservoirs", "Encephalitis with seizures and a characteristic low-density thalamic lesion on imaging", "A killed vaccine given to children in endemic districts; childhood vaccination has been the single most effective control"],
          ["West Nile virus (flavivirus)", "Culex mosquitoes, with birds as reservoir", "Asymptomatic infection, West Nile fever, or neuroinvasive disease", "A cause of flaccid paralysis and encephalitis in older adults"],
          ["Zika virus (flavivirus)", "Aedes mosquitoes, with human and primate reservoirs", "Mild febrile illness, Guillain–Barré syndrome, and congenital Zika syndrome", "Maternal infection causes microcephaly and fetal demise, so pregnancy advice on travel matters"],
          ["Yellow fever (flavivirus)", "Aedes and Haemagogus mosquitoes, with a monkey reservoir", "Febrile illness with jaundice, haemorrhage and a high mortality", "A live attenuated vaccine given to travellers and endemic populations; a vaccine certificate is required for entry to some countries"],
          ["KFD and Alkhurma (tick-borne flaviviruses)", "Ticks", "Haemorrhagic fever", "Regional in South Asia and the Arabian peninsula; managed supportively"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The vector decides the epidemiology, not the virology. Aedes aegypti breeds in clean standing water in urban containers and bites by day, so control is source reduction, larvicide and daytime personal protection. Culex tritaeniorhynchus breeds in rice paddies and bites at dusk, so control is outdoor spraying and bedtime nets. An arbovirus disease cannot be planned for on the basis of its agent alone — the vector's behaviour determines the season and the place.",
      },

      { type: "heading", level: 2, text: "Picornaviridae and the polio programme" },
      {
        type: "paragraph",
        text: "Picornaviruses are small, naked, positive-sense RNA viruses with an icosahedral capsid. Because they are naked, they are stable, they resist gastric acid, and they travel by the faecal–oral route — which is the whole reason poliovirus spreads so effectively before anyone is paralysed.",
      },
      {
        type: "table",
        headers: ["Virus", "Disease", "Notes"],
        rows: [
          ["Poliovirus types 1, 2 and 3", "Poliomyelitis: abortive illness, aseptic meningitis, and flaccid paralysis from anterior horn destruction", "Type 2 was declared eradicated in 2015 and type 3 in 2019, leaving type 1 as the only circulating wild virus"],
          ["Coxsackie A and B", "Hand, foot and mouth disease; herpangina; acute haemorrhagic conjunctivitis; and myocarditis in neonatal infection", "Type A16 is the usual cause of hand, foot and mouth disease; type B is the classic cause of viral myocarditis"],
          ["Echovirus", "Aseptic meningitis, febrile exanthem, and gastroenteritis", "A common cause of summer meningitis"],
          ["Enterovirus 71", "Severe hand, foot and mouth disease with neurological complications", "The cause of large outbreaks in Asia"],
          ["Hepatitis A (a picornavirus)", "Enterically transmitted hepatitis, most severe in adults", "Prevented by a killed vaccine; the presence of anti-HAV IgM indicates recent infection"],
        ],
      },
      {
        type: "paragraph",
        text: "The two polio vaccines illustrate every vaccine principle at once. The oral (Sabin) vaccine is live attenuated, cheap, given by mouth, induces intestinal IgA that stops wild-virus spread, and is the reason eradication was achievable — but it can revert and cause vaccine-associated paralytic poliomyelitis, and it cannot be given in immunodeficiency. The injectable (Salk) vaccine is killed, induces serum IgG that prevents paralysis, cannot cause disease, and does not stop intestinal transmission, so it suppresses paralysis but not circulation.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Surveillance for poliomyelitis rests on a single sign: acute flaccid paralysis in a child under 15, reported within 14 days of onset, with two stool samples collected 24–48 hours apart within 14 days of onset. A case of flaccid paralysis with a confirmed wild or vaccine-derived poliovirus confirms circulation; the absence of confirmed cases is the basis on which a region is certified polio-free.",
      },

      { type: "heading", level: 2, text: "Retroviridae and HIV" },
      {
        type: "definition",
        term: "Retrovirus",
        text: "A positive-sense RNA virus that replicates through a DNA intermediate: reverse transcriptase makes double-stranded DNA, which is integrated into the host chromosome by the viral integrase, and host RNA polymerase transcribes it.",
      },
      {
        type: "table",
        headers: ["Stage of the HIV cycle", "Enzyme or structure involved", "Drug class that blocks it"],
        rows: [
          ["Attachment and entry", "gp120 binds CD4 and then CCR5 or CXCR4; gp41 mediates fusion", "CCR5 antagonist maraviroc; fusion inhibitor enfuvirtide; broadly neutralising monoclonal antibodies"],
          ["Reverse transcription", "Reverse transcriptase, an error-prone enzyme with no proof-reading", "Nucleoside reverse transcriptase inhibitors (zidovudine, tenofovir) and non-nucleoside inhibitors (efavirenz, rilpivirine)"],
          ["Integration", "Integrase inserts the viral DNA into host chromosome", "Integrase strand transfer inhibitors (dolutegravir, bictegravir) — the backbone of modern regimens"],
          ["Transcription and translation", "Host polymerase and ribosome, and the Tat and Rev regulatory proteins", "No directly exploited step — the machinery is too similar to the host's own"],
          ["Proteolytic maturation", "Viral protease cleaves the gag-pol polyprotein", "Protease inhibitors (atazanavir, darunavir)"],
          ["Assembly and budding", "Gag assembly at the cell membrane; gp41 fusion of the envelope", "Maturation inhibitors remain investigational"],
        ],
      },
      {
        type: "paragraph",
        text: "The error-prone reverse transcriptase is why HIV generates resistant mutants continuously and why monotherapy fails. A regimen of two nucleoside reverse transcriptase inhibitors plus an integrase inhibitor therefore attacks three steps at once, so the probability of a single genome simultaneously acquiring mutations to all three is negligible. The same error rate is why HIV exists as a quasispecies — a swarm of related variants within one patient — and why the treatment of a resistant virus requires genotypic testing before a regimen is changed.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Laboratory monitoring in HIV rests on two numbers. The CD4 count reflects the level of immune damage and predicts which opportunistic infections will appear: Pneumocystis below 200, toxoplasmosis and cryptococcosis below 100, cytomegalovirus retinitis and disseminated Mycobacterium avium below 50. The plasma viral load reflects the amount of virus and the success or failure of therapy, with an undetectable viral load meaning both that the regimen works and that the patient cannot transmit sexually.",
      },
      {
        type: "example",
        text: "HTLV-1 is the second major human retrovirus. It causes adult T-cell leukaemia/lymphoma, with hypercalcaemia and flower-shaped lymphocytes on blood film, and HTLV-1-associated myelopathy (tropical spastic paraparesis) in endemic areas of southern Japan, the Caribbean, West Africa and South America. Unlike HIV, it is weakly transmissible and there is no treatment that clears it — so management is surveillance of the leukaemia and counselling regarding sexual and needle transmission.",
      },

      { type: "heading", level: 2, text: "Other RNA viruses of daily clinical importance" },
      {
        type: "table",
        headers: ["Virus and family", "Transmission", "Disease", "Distinguishing feature"],
        rows: [
          ["Norovirus (Caliciviridae)", "Faecal–oral, aerosolised vomitus, contaminated surfaces", "Acute gastroenteritis with vomiting, explosive diarrhoea and cramping", "A naked virus that survives chlorine and drying, so it causes cruise-ship and ward outbreaks; no vaccine"],
          ["Rotavirus (Reoviridae)", "Faecal–oral", "Severe infantile gastroenteritis with dehydration", "A segmented double-stranded RNA virus, now largely controlled by the oral live vaccine; before vaccination it was the leading infectious cause of infant death"],
          ["SARS-CoV-2 and other coronaviruses", "Respiratory droplet and aerosol", "COVID-19: asymptomatic infection, pneumonia, multisystem inflammatory syndrome, and long COVID", "A positive-sense RNA virus with the largest RNA genome, proof-reading machinery, and a spike protein whose antigenic drift drives variant waves"],
          ["Hepatitis C (Flaviviridae)", "Blood-borne, including unsafe injection and transfusion", "Chronic hepatitis in most who are infected, cirrhosis and hepatocellular carcinoma", "Prevailing cure with 12 weeks of a direct-acting antiviral regimen in more than 95 per cent; no vaccine yet"],
          ["Rabies virus (Rhabdoviridae)", "Bite of an infected mammal", "Furious rabies with spasms on attempting to drink and hydrophobic spasms, then paralysis and death", "A bullet-shaped negative-sense RNA virus with Negri bodies in hippocampal neurons; 100 per cent fatal once symptomatic, and prevented only by immediate post-exposure vaccination and immunoglobulin"],
          ["Ebola and Marburg (Filoviridae)", "Direct contact with body fluids of an infected patient", "Viral haemorrhagic fever with a high mortality", "Disrupts the clotting cascade and the immune response itself; a recombinant vaccine is now in use for outbreak control"],
          ["Rubella virus (Togaviridae)", "Respiratory droplet", "Rubella and congenital rubella syndrome", "A mild exanthem of no consequence to the patient, but a teratogen to the fetus in the first trimester"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Rabies is the clearest example in the whole of microbiology of a window that closes. Once the virus reaches the central nervous system there is no effective treatment and mortality is essentially 100 per cent. Before that, thorough wound washing, rabies immunoglobulin infiltrated around the wound where feasible, and a series of vaccine doses are highly effective. 'Rabies is the only infection that is treated after it is clinically inevitable' is the paradox that makes the window worth memorising.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing influenza's drift with its shift. Drift is gradual point mutation, causing seasonal epidemics and requiring a vaccine reformulation each year. Shift is abrupt reassortment of the eight segments in a co-infected cell, causing a pandemic and an entirely new H subtype to which nobody is immune.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Calling dengue vaccine-inducible disease the same as dengue in a non-immune host. Dengue haemorrhagic fever and shock are typically diseases of secondary infection by a different serotype, because non-neutralising antibody from the first infection enhances entry of the second into macrophages — antibody-dependent enhancement. This is why the dengue vaccine is restricted to seropositive recipients in most schedules.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Assuming a positive IgM means active infection in every arbovirus. Flaviviral IgM tests cross-react extensively between dengue, Zika, West Nile and Japanese encephalitis, so a positive IgM from one arbitrarily selected virus must be confirmed by neutralisation or by nucleic acid detection before it is used to name the virus.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does a child with hand, foot and mouth disease spread enterovirus 71 in the classroom before anyone falls ill, and why is quarantine after symptoms appear ineffective?",
        answer:
          "Because enteroviruses are naked, acid-stable, faecal–oral viruses that shed in stool for weeks, so the index case is infectious well before the rash and continues to shed after recovery. Contacts are already infected before any isolation starts.",
        explanation:
          "Naked picornaviruses survive gastric acid and environmental drying; their transmission is faecal–oral and their incubation is a few days, which is what makes control by isolation impractical and control by hygiene partial.",
      },
      {
        type: "question",
        prompt: "A patient on antiretroviral therapy has a persistently detectable viral load despite good adherence. What is the most likely mechanism and the next step?",
        answer:
          "The virus has acquired resistance mutations to one or more drugs in the regimen, because the reverse transcriptase makes errors continuously and a partly suppressive regimen selects resistant variants. The next step is a genotypic resistance test and a regimen change guided by the result.",
        explanation:
          "Integrase inhibitor regimens fail primarily through mutations in integrase rather than protease or reverse transcriptase, which is why resistance testing distinguishes the drug class and changes the rebuild of the regimen.",
      },
      {
        type: "question",
        prompt: "Why is dengue in a second, different serotype more dangerous than a first infection?",
        answer:
          "Because antibody from the first infection is cross-reactive but non-neutralising, so it binds the new serotype and enhances its entry into Fc-receptor-bearing macrophages — antibody-dependent enhancement — increasing the viral load and the risk of haemorrhagic fever and shock.",
        explanation:
          "The same mechanism conditions the deployment of the dengue vaccine, which should generally be given only to people with evidence of previous infection.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which statement about influenza is correct?",
        options: [
          "Antigenic drift is caused by reassortment of the eight RNA segments when two viruses co-infect a cell, and produces a pandemic.",
          "Antigenic shift is caused by reassortment of the segmented genome in a co-infected cell and produces a pandemic; antigenic drift is caused by point mutation and produces seasonal epidemics.",
          "Antigenic drift requires a pig intermediate host, whereas shift occurs in aquatic birds.",
          "Both drift and shift occur only in influenza B, because influenza A has a DNA genome.",
        ],
        correctIndex: 1,
        explanation:
          "Drift is gradual mutation in haemagglutinin and neuraminidase, causing the yearly reformulation of the vaccine; shift is abrupt reassortment in a co-infected cell, generating an H subtype to which nobody is immune — the mechanism of the 1918 and 2009 pandemics.",
      },
      {
        type: "mcq",
        stem: "A vaccinated, unvaccinated sibling and an unvaccinated child in the same house are exposed to measles, and the vaccinated child does not become ill. Which vaccine property explains the household pattern?",
        options: [
          "Killed measles vaccine induces sterilising immunity that stops transmission, so the third child never meets the virus.",
          "Live attenuated measles vaccine induces a strong cellular and humoral response in the vaccinated child, and the unvaccinated child is protected by the vaccinated child's failure to transmit — herd immunity — but is nonetheless at risk if exposed.",
          "Subunit measles vaccine generates mucosal IgA in the throat, blocking the whole chain.",
          "Live and killed measles vaccines are equally protective and equally unable to reduce transmission.",
        ],
        correctIndex: 1,
        explanation:
          "The measles vaccine is live attenuated and produces durable antibody and cell-mediated immunity; household herd protection follows only while contacts are vaccinated, and it disappears if coverage falls below the 95 per cent measles threshold.",
      },
      {
        type: "mcq",
        stem: "A liver transplant recipient on antiretroviral therapy has a rising cytomegalovirus viral load, and the regimen contains only integrase inhibitors. Why is the rising load most likely to be a resistance problem rather than a break in the viral replication cycle?",
        options: [
          "Integrase inhibitors do not enter hepatic cells, so the liver volume produces a false signal.",
          "The virus replicates through reverse transcription and integrates; integrase inhibitors block integration but not polymerase or protease, so single-class therapy selects mutations in the integrase gene.",
          "Cytomegalovirus is not covered by any antiretroviral drug.",
          "The viral load rises because of co-infection with EBV, which is a DNA virus and is not affected by antiretrovirals.",
        ],
        correctIndex: 1,
        explanation:
          "Antiretroviral therapy targets HIV's replication cycle, not cytomegalovirus; a rising cytomegalovirus load in a transplant recipient is treated with ganciclovir or valganciclovir and a reduction in immunosuppression, and reflects reactivated latent virus in monocytes rather than an antiretroviral-resistance problem.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The RNA viruses are the most variable of human pathogens, because their polymerases have no proof-reading: influenza develops antigenic drift by mutation and antigenic shift by reassortment of its eight segments; arboviruses and flaviviruses spread by specific vectors whose behaviour dictates their season and their place; enteroviruses survive acid and travel by the faecal oral route, which is what polio eradication exploited and what makes quarantine after symptoms futile; and HIV replicates through a DNA intermediate whose error-prone reverse transcriptase demands multi-class therapy. Other agents — rabies with its absolute fatality after symptoms, norovirus with its detergent resistance, rotavirus with its vaccine, and hepatitis C with its curable direct-acting antivirals — complete the picture of RNA virus disease in daily practice.",
      },
      {
        type: "paragraph",
        text: "Next: medical mycology. You move from viruses to eukaryotes: the dermatophytes, Candida, Cryptococcus, Aspergillus and Mucor, the dimorphic fungi, and the antifungal drug classes that attack the cell-wall chitin and membrane sterols they possess and human cells do not.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 13 — Medical mycology (fully authored)
// ---------------------------------------------------------------------------
function lesson13() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: classify fungal disease as superficial, subcutaneous and systemic, and identify which are opportunistic; describe the three dermatophyte genera and how tinea infections are named and confirmed; describe Candida species, the germ-tube and chlamydospore tests, and the difference between mucosal and invasive candidiasis; describe Cryptococcus, the India ink preparation and the latex agglutination test, and the treatment of meningitis; describe Aspergillus and mucormycosis and the morphological features that distinguish them; describe the dimorphic systemic fungi; and name the antifungal classes with the mechanism and principal toxicity of each.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Module 2 — innate immunity, for the neutrophil as the principal defence against filamentous fungi; module 3 — general virology, for the contrast between obligate intracellular and free-living eukaryotes.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Medical mycology",
        text: "The study of fungal infections. Fungi are eukaryotes: they have a chitinous cell wall, ergosterol in their membrane, sterol-containing nuclei, and a form that may be a unicellular yeast or a filamentous mould, sometimes switching between the two.",
      },
      {
        type: "paragraph",
        text: "Fungal disease is a story of two kinds of organism. The dermatophytes and the subcutaneous fungi infect an intact host without needing any defect; Candida and Aspergillus and Cryptococcus are opportunists, and their serious disease is almost always a disease of impaired immunity — neutropenia, corticosteroids, transplant immunosuppression, HIV, or an in-dwelling line. That is the single organising fact of this subject: an otherwise healthy person may be troubled by a ringworm, but a neutropenic patient dies of an Aspergillus.",
      },
      {
        type: "paragraph",
        text: "The therapeutic consequence follows the taxonomy. Because fungi are eukaryotes, the target space is narrower than for bacteria, and antifungal drug choice must exploit the two differences: the ergosterol-rich membrane (amphotericin B and the azoles) and the chitinous wall (echinocandins). The price paid for being a eukaryote is toxicity in parallel — amphotericin B is nephrotoxic precisely because it binds the cholesterol of human cells as well as fungal sterols.",
      },

      { type: "heading", level: 2, text: "Superficial and cutaneous mycoses" },
      {
        type: "paragraph",
        text: "Dermatophytoses are infections of keratinised tissue — skin, hair and nails — by three genera of mould that digest keratin and grow only on dead tissue. They are named by the site, which is why the same organism produces tinea capitis on the scalp, tinea corporis on the trunk, tinea pedis (athlete's foot) on the foot, tinea cruris in the groin, tinea unguium in the nails, and a kerion when the inflammation is intense.",
      },
      {
        type: "table",
        headers: ["Genus", "Species", "Morphology", "Clinical signature", "Treatment"],
        rows: [
          ["Trichophyton", "T. rubrum, T. tonsurans, T. mentagrophytes", "Microconidia arranged along the hypha, with spiral hyphae; occasional macroconidia of a cigar shape", "Tinea pedis, onychomycosis and tinea corporis — the most common dermatophyte worldwide", "Topical terbinafine or clotrimazole for skin; oral terbinafine for hair and nail"],
          ["Microsporum", "M. canis (from cats and dogs), M. audouinii", "Large spindle-shaped macroconidia with more than six cells", "Tinea capitis in children, with a characteristic green fluorescence under Wood's lamp for some species", "Oral griseofulvin, because topical agents cannot reach the hair shaft"],
          ["Epidermophyton", "E. floccosum", "Smooth club-shaped macroconidia, no microconidia", "Tinea cruris in the groin and tinea pedis", "Topical terbinafine"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The KOH preparation is the point-of-care test for dermatophytosis: scrapings of skin or nail are dissolved in potassium hydroxide, and the resistant refractile branching septate hyphae remain visible under the microscope. Culture on Sabouraud dextrose agar confirms the species and allows susceptibility testing where needed.",
      },
      {
        type: "table",
        headers: ["Other superficial fungi", "Disease", "Identifying feature"],
        rows: [
          ["Malassezia furfur", "Pityriasis versicolor — hypo- or hyper-pigmented scaly patches on the chest", "A lipophilic yeast with spaghetti-and-meatballs appearance on KOH; needs lipid supplementation in culture"],
          ["Piedraia hortae", "Black piedra — hard nodules on hair shafts", "Black nodules containing asci, mostly in the humid tropics"],
          ["Trichosporon beigelii", "White piedra and invasive trichosporonosis in immunocompromised patients", "White nodules, and an emerging pathogen now resistant to echinocandins"],
        ],
      },

      { type: "heading", level: 2, text: "Candida: yeast, pseudohyphae and disease" },
      {
        type: "definition",
        term: "Candida albicans",
        text: "A polymorphic commensal yeast of the human gut and mucosa that exists as budding yeast cells, as pseudohyphae, and as true hyphae, and causes disease only when the host's barriers, flora or immunity are disturbed.",
      },
      {
        type: "table",
        headers: ["Presentation", "Setting", "Diagnosis", "Treatment"],
        rows: [
          ["Oral thrush", "Infancy, inhaled corticosteroids, HIV, dentures, antibiotic use", "Creamy plaques removable to leave an erythematous base; microscopy for pseudohyphae", "Topical nystatin or oral fluconazole"],
          ["Vulvovaginal candidiasis", "Pregnancy, diabetes, broad-spectrum antibiotics, immunosuppression", "Curd-like discharge with an acidic pH and hyphae on microscopy", "Topical imidazole or single-dose oral fluconazole"],
          ["Intertrigo and napkin dermatitis", "Warm moist folds of an infant or an obese adult", "Beefy red erythema with satellite lesions", "Keep dry, topical nystatin"],
          ["Chronic mucocutaneous candidiasis", "A T-cell defect with recurrent mucosal and cutaneous disease", "Hyphae on repeated microscopy, and an underlying immune defect to define", "Long-term azole therapy"],
          ["Oesophageal candidiasis", "AIDS with a low CD4 count", "Odynophagia and plaques seen on endoscopy", "Fluconazole"],
          ["Invasive candidiasis and candidaemia", "Intensive care, total parenteral nutrition, central lines, abdominal surgery, neutropenia", "Blood cultures and the beta-D-glucan test; the mortality is high despite therapy", "Echinocandin first-line, then fluconazole once the isolate is tested"],
          ["Ocular and renal candidiasis", "Dissemination from a line infection", "Funduscopy for white chorioretinal plaques", "Prolonged systemic therapy plus device removal"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The germ-tube test is the fastest way to identify Candida albicans: serum is incubated at 37°C for two to three hours, and C. albicans alone of the common species produces a rudimentary hypha — a germ tube — from the budding cell. The chlamydospore test on cornmeal agar confirms it. Candida glabrata, Candida krusei, Candida tropicalis and Candida parapsilosis are identified by their assimilation profiles, and the species changes the treatment because C. glabrata is less fluconazole-susceptible and C. krusei is intrinsically resistant.",
      },

      { type: "heading", level: 2, text: "Cryptococcus neoformans" },
      {
        type: "paragraph",
        text: "Cryptococcus neoformans is an encapsulated yeast whose natural habitat is soil contaminated with pigeon droppings, and whose infection begins in the lungs after the inhalation of desiccated yeast cells. In a person with intact T-cell immunity it stays a pulmonary infection; in a person with advanced HIV it haematogenously seeds the central nervous system and produces a subacute meningitis with headache, fever and, later, cranial nerve deficits.",
      },
      {
        type: "table",
        headers: ["Diagnostic method", "What is seen", "Use"],
        rows: [
          ["India ink preparation", "The polysaccharide capsule appears as a clear halo around the budding yeast against the black background", "The classical rapid CSF test, though sensitivity is modest and antigen detection is preferred"],
          ["Latex agglutination / lateral flow", "Cryptococcal antigen detected in CSF and serum", "The most sensitive and specific test, quantifying the antigen titre for follow-up"],
          ["Culture on bird-seed agar (niger seed)", "Brown-pigmented colonies", "Confirmation and speciation"],
          ["Histology", "Encapsated budding yeasts on mucicarmine stain", "Tissue diagnosis and the assay of pathogen burden"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treatment of cryptococcal meningitis is induction with amphotericin B plus flucytosine, followed by a prolonged consolidation course of fluconazole — and intracranial pressure must be managed at the same time, because raised pressure is a major cause of death in this disease. Flucytosine is a nucleotide analogue with marrow toxicity, so full blood counts must be monitored; this is the same drug class antagonism that makes amphotericin now frequently reformulated as a lipid formulation to spare the kidney.",
      },

      { type: "heading", level: 2, text: "Aspergillus and the moulds that kill the neutropenic patient" },
      {
        type: "table",
        headers: ["Feature", "Aspergillus fumigatus", "Mucorales (Rhizopus, Mucor, Rhizomucor)"],
        rows: [
          ["Hyphal morphology", "Septate hyphae that branch dichotomously at an acute angle of about 45 degrees", "Broad, ribbon-like aseptate hyphae that branch at right angles"],
          ["Histology on silver stain", "Narrow uniform septate filaments", "Wide twisted ribbons without septa"],
          ["Classical disease", "Allergic bronchopulmonary aspergillosis, aspergilloma in an old cavity, invasive aspergillosis in neutropenia or transplant", "Rhinocerebral zygomycosis in diabetic ketoacidosis, and necrotising cutaneous infection in burns"],
          ["Diagnosis", "Galactomannan enzyme immunoassay on serum or bronchoalveolar lavage, and PCR; culture", "Culture is often sterile because the organism is fragile; diagnosis rests on histology of a biopsy"],
          ["Treatment", "Voriconazole first-line (or isavuconazole); surgical resection for an aspergilloma and debridement in invasive disease", "Prompt surgical debridement plus high-dose lipid amphotericin B, and reversal of ketoacidosis"],
          ["Key fact", "Aflatoxin B1 produced by A. flavus is a potent hepatocellular carcinogen and a cause of food contamination", "Angioinvasion causes tissue infarction, which is why the disease runs a necrotising course"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The morphology decides the drug and the prognosis, and it is read from a biopsy rather than a culture. In a patient with neutropenia and a dense pulmonary opacity, narrow septate 45-degree hyphae means invasive aspergillosis and voriconazole, whereas broad aseptate right-angled hyphae means mucormycosis and a request for immediate surgical debridement plus amphotericin B. Mucor is intrinsically resistant to voriconazole, so the wrong morphological read costs the patient several days and their life.",
      },

      { type: "heading", level: 2, text: "Dimorphic systemic fungi" },
      {
        type: "definition",
        term: "Dimorphic fungus",
        text: "A fungus that grows as a mould in the environment at 25°C and as a yeast in the host at 37°C, and that therefore exists in two distinct morphological forms depending on temperature.",
      },
      {
        type: "table",
        headers: ["Organism", "Geography", "Disease", "Diagnosis and treatment"],
        rows: [
          ["Histoplasma capsulatum", "Ohio and Mississippi valleys; the soil contaminated by bat and bird droppings", "Histoplasmosis: a self-limiting febrile illness after exposure, then disseminated disease with hepatosplenomegaly and pancytopenia in the immunosuppressed", "Small yeast cells within macrophages on bone marrow; antigen detection; itraconazole for chronic and disseminated disease, amphotericin B for severe"],
          ["Blastomyces dermatitidis", "Southeastern United States and Ohio valley", "Blastomycosis: pulmonary disease with skin and bone lesions, and verrucous or ulcerated skin lesions", "Broad-based budding yeasts on histology; itraconazole, amphotericin B for severe disease"],
          ["Coccidioides immitis", "Southwestern United States and Latin America", "Coccidioidomycosis: valley fever, with arthralgia, erythema nodosum and pulmonary cavities", "Large spherules with endospores on histology; itraconazole for chronic cavitary disease"],
          ["Paracoccidioides brasiliensis", "Latin America", "Paracoccidioidomycosis: mucosal ulcers and destructive pulmonary disease", "Pilot-wheel or mariner's wheel budding yeast with multiple buds; itraconazole or amphotericin B"],
          ["Sporothrix schenckii", "Worldwide in soil and on plants, classically on rose thorns", "Sporotrichosis: subcutaneous nodule tracking along lymphatics after a prick", "Cigar-shaped yeast on culture; itraconazole"],
          ["Talaromyces marneffei (formerly Penicillium marneffei)", "Southeast Asia and southern China", "Disseminated infection in advanced AIDS, with umbilicated skin lesions", "A dimorphic fungus that is a useful differential in AIDS patients from the region; amphotericin B then itraconazole"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Pneumocystis jirovecii is no longer classified as a fungus, but it is cemented into every mycological answer by habit. It is an obligate extracellular organism that cannot be cultured, its diagnosis rests on staining the foamy material from bronchoalveolar lavage or on the beta-D-glucan blood test, and its treatment is high-dose trimethoprim–sulfamethoxazole with adjunctive corticosteroids when the patient is hypoxaemic — the prototypal opportunistic pneumonia of the CD4-count-below-200 patient.",
      },

      { type: "heading", level: 2, text: "Antifungal pharmacology: attacking the eukaryotic differences" },
      {
        type: "table",
        headers: ["Class", "Target", "Agents", "Principal toxicity"],
        rows: [
          ["Polyene", "Ergosterol in the fungal membrane — the drug physically complexes it", "Amphotericin B (including lipid formulations), nystatin", "Nephrotoxicity, hypokalaemia, hypomagnesaemia, and infusion reactions; lipid formulations reduce renal toxicity"],
          ["Azole", "Fungal CYP51, blocking lanosterol demethylation and therefore ergosterol synthesis", "Fluconazole, itraconazole, voriconazole, posaconazole, isavuconazole", "Hepatotoxicity, QT prolongation, CYP interactions, and in pregnancy a teratogenic risk"],
          ["Echinocandin", "Beta-1,3-glucan synthase, so the wall cannot be built", "Caspofungin, micafungin, anidulafungin", "Very well tolerated; no cross-resistance with azoles or polyenes; first-line for invasive candidiasis"],
          ["Allylamine", "Squalene epoxidase, blocking ergosterol synthesis earlier", "Terbinafine", "Gastrointestinal upset, taste disturbance, rare hepatotoxicity; the standard for onychomycosis"],
          ["Nucleotide analogue", "Cytosine deaminase converts to 5-fluorouracil, inhibiting nucleic acid synthesis", "Flucytosine", "Bone marrow suppression, so it is always used in combination"],
          ["Topical agents", "Various", "Nystatin, clotrimazole, ciclopirox", "Local irritation only"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Antifungal resistance is growing and comes with predictable mechanisms. Candida glabrata acquires ergosterol-pathway mutations and efflux pump over-expression that lower fluconazole susceptibility; Aspergillus develops CYP51 mutations conferring voriconazole resistance, particularly after agricultural azole exposure; and the echinocandins fail against Cryptococcus and against all Mucorales, which have little of the target they attack.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Calling all hyphae the same. Aspergillus is septate and branches at about 45 degrees; Mucorales is aseptate, wide and branches at right angles. The two diseases differ in drug choice, in the need for surgery, and in outcome, and the distinction is made by looking at the hyphae in tissue, not by reading the culture plate.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Diagnosing oral thrush in someone with dentures and wiping it off with a spatula. Thrush is a creamy plaqued membrane that leaves an erythematous bleeding base; a denture ulcer does not scrape off, and leukoplakia cannot be scraped at all. If it does not come off, it is not thrush.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Believing HIV is the only immunodeficiency that matters in mycology. Neutropenia, high-dose corticosteroids, transplant immunosuppression and the newer therapies targeting interleukin-17 and Janus kinases all create fungal susceptibility, and the newest mucormycosis outbreaks in diabetic ketoacidosis and after COVID-19 pneumonia have nothing to do with HIV.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A neutropenic chemotherapy patient has a necrotising pneumonia, and a lung biopsy shows broad, aseptate, right-angle branching hyphae. What is the organism, the drug, and why is the culture likely to be negative?",
        answer:
          "Mucormycosis (Rhizopus, Mucor or Rhizomucor), treated with high-dose lipid amphotericin B plus urgent surgical debridement, because the organism angioinvasive and necrosis needs removal. Culture is often negative because the fragile thin-walled hyphae of Mucorales are destroyed by homogenisation and rarely survive to grow on culture.",
        explanation:
          "This is the classic situation where the morphology on the biopsy slide, and not the culture result, makes the diagnosis and dictates the therapy — voriconazole would be active against Aspergillus and useless against Mucorales.",
      },
      {
        type: "question",
        prompt: "Why is amphotericin B toxic to human kidneys when it was designed for a fungus?",
        answer:
          "Because fungi and human cells are both eukaryotes whose membranes contain sterols. Amphotericin B complexes sterols and binds cholesterol in the human tubular cells as well as ergosterol in the fungus, so the same membrane attack damages the renal tubule.",
        explanation:
          "Lipid formulations of amphotericin B bind the drug in a carrier and reduce its exposure to human cholesterol, which is the reason the nephrotoxicity of modern use is lower than that of the old deoxycholate form.",
      },
      {
        type: "question",
        prompt: "A patient with AIDS and a CD4 count of 40 has headache, fever and neck stiffness. The CSF shows capsulated budding yeasts on India ink. Outline the treatment and the reason for its phases.",
        answer:
          "Induction with amphotericin B plus flucytosine for two weeks to achieve rapid sterilisation of the CSF, followed by a consolidation phase of fluconazole for at least eight weeks, then maintenance fluconazole until immune recovery on antiretroviral therapy.",
        explanation:
          "Relapse is common after a short course, so the maintenance phase is continued until the CD4 count is restored. Intracranial pressure must be monitored and relieved where raised, because it is a leading cause of death.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which statement about Aspergillus and Mucorales is correct?",
        options: [
          "Both are aseptate, but Aspergillus branches at right angles and Mucorales at 45 degrees.",
          "Aspergillus has septate hyphae branching at about 45 degrees and is treated with voriconazole; Mucorales are broad, aseptate and branch at right angles, and are treated with amphotericin B plus surgery.",
          "Aspergillus is treated with an echinocandin, and Mucorales are treated with fluconazole.",
          "Aspergillus is a dimorphic fungus, and Mucorales are encapsulated yeasts.",
        ],
        correctIndex: 1,
        explanation:
          "The hyphal morphology and the drug choice are the two facts to hold together: voriconazole for aspergillosis, and surgical debridement plus amphotericin B for mucormycosis. Echinocandins have no activity against either, and fluconazole is inactive against Mucorales.",
      },
      {
        type: "mcq",
        stem: "A KOH scrape of a scaly interdigital foot lesion shows refractile branching septate hyphae. Which genera cause this disease, and how is the tinea named?",
        options: [
          "Aspergillus and Penicillium, and the disease is named tinea nigra.",
          "Trichophyton, Microsporum and Epidermophyton, and the disease of the foot is named tinea pedis.",
          "Malassezia and Cryptococcus, and the disease is named pityriasis versicolor.",
          "Candida and Rhodotorula, and the disease is named candidal intertrigo.",
        ],
        correctIndex: 1,
        explanation:
          "Dermatophytoses of keratinised tissue are caused by the three dermatophyte genera, and the site supplies the name — tinea pedis between the toes, tinea corporis on the trunk, tinea capitis on the scalp. Malassezia causes pityriasis versicolor and Candida causes intertrigo, but neither is a dermatophyte producing this hyphal pattern.",
      },
      {
        type: "mcq",
        stem: "Which pairing of antifungal agent with its mechanism is correct?",
        options: [
          "Caspofungin binds ergosterol in the fungal membrane.",
          "Voriconazole blocks lanosterol 14-alpha-demethylase (CYP51) and therefore ergosterol synthesis.",
          "Terbinafine inhibits beta-1,3-glucan synthase.",
          "Amphotericin B inhibits squalene epoxidase.",
        ],
        correctIndex: 1,
        explanation:
          "Voriconazole is an azole that blocks ergosterol synthesis at CYP51. Caspofungin is an echinocandin blocking beta-1,3-glucan, amphotericin B binds ergosterol in the membrane, and terbinafine inhibits squalene epoxidase earlier in the ergosterol pathway.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Fungal disease divides into the dermatophyte infections of keratinised tissue, and the opportunists that require a defect in host defence. Candida, the polymorphic commensal, is identified by germ tube and by chlamydospores and is treated with an echinocandin or fluconazole depending on whether the disease is mucosal or invasive. Cryptococcus is diagnosed by the India ink halo and cryptococcal antigen, and treated with amphotericin B plus flucytosine. Aspergillus and Mucorales are separated by hyphal geometry — septate at an acute angle versus aseptate at right angles — and the difference decides the drug and the need for surgery. The therapeutic space is narrow because fungi are eukaryotes, and the polyenes, azoles, echinocandins and allylamines attack the ergosterol-rich membrane or the chitinous wall.",
      },
      {
        type: "paragraph",
        text: "Next: protozoan parasites. You will meet Plasmodium, Entamoeba, Leishmania, Giardia, Toxoplasma and Trichomonas — their life cycles, their vectors, and the microscopic findings that identify them.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 14 — Protozoan parasites (fully authored)
// ---------------------------------------------------------------------------
function lesson14() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the four Plasmodium species, their characteristic parasites on a blood film, and the mechanism of the tertian, quartan and malignant fevers; explain the malaria life cycle and the stage that is transmitted, the stage that relapses, and the stage that is killed by primaquine; describe Entamoeba histolytica and the flask-shaped ulcer, and the anchovy-sauce liver abscess; describe Giardia and its pear-shaped trophozoite with two nuclei; describe Leishmania donovani, its sandfly vector and the kala-azar syndrome; describe Toxoplasma gondii and its congenital syndrome; and describe Trichomonas vaginalis, its absence of a cyst form, and the significance of treating both partners.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Module 2 — cell-mediated adaptive immunity, for Toxoplasma and Leishmania, both of which are intracellular pathogens controlled by Th1 immunity; module 1 — bacterial culture theory, for the culture and microscopy methods of diagnosis.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Protozoan parasite",
        text: "A unicellular eukaryote that lives in or on a host organism. Medically important protozoa are classified in four groups — Sarcodina (amoebae), Mastigophora (flagellates), Ciliophora (ciliates) and Apicomplexa (sporozoa) — and the classification predicts the transmission route, the diagnostic specimen, and the drug.",
      },
      {
        type: "paragraph",
        text: "Parasitology is life-cycle science. Unlike a bacterium, which has a simple division into two, a protozoan alternates between hosts, tissues and morphological forms, and the form that matters clinically — the one the laboratory finds in the blood, the stool or the CSF — is only one of several. The Plasmodium in the blood film is the stage that causes the fever; the sporozoite in the mosquito is the stage that delivers the disease; the hypnozoite in the liver is the stage that relapses months later.",
      },
      {
        type: "paragraph",
        text: "The clinical consequence is that a single drug often cannot clear an infection, because each stage has its own biology. Primaquine kills the hypnozoite and prevents relapse in vivax and ovale; chloroquine and artemisinin combination therapy clear the blood stages; and only a stage-specific drug clears a stage that survives in tissue. The pattern recurs: primaquine for hypnozoites, chloroquine for blood, and primaquine also to sterilise the gametocyte that infects the mosquito.",
      },

      { type: "heading", level: 2, text: "Plasmodium species" },
      {
        type: "table",
        headers: ["Species", "Fever period", "Key appearances on the blood film", "Life-cycle peculiarity", "Clinical danger"],
        rows: [
          ["Plasmodium falciparum", "Tertian, every 48 hours", "Small delicate rings, often multiple per red cell, and appliqué forms; crescent-shaped banana gametocytes", "No hypnozoites, so no relapses; infects red cells of all ages and sequesters them in deep capillaries", "Malignant (cerebral) malaria, blackwater fever, severe anaemia, hypoglycaemia and acute respiratory distress — the species that kills"],
          ["Plasmodium vivax", "Tertian, every 48 hours", "Large amoeboid rings in enlarged red cells; Schüffner's dots", "Dormant hypnozoites in the liver, with relapses up to 2–5 years", "Chronic relapsing illness with splenomegaly, but rarely fatal"],
          ["Plasmodium ovale", "Tertian, every 48 hours", "Oval red cells with ragged margins and James's dots", "Hypnozoites as in vivax", "Mild disease, uncommon"],
          ["Plasmodium malariae", "Quartan, every 72 hours", "Band forms across the red cell; rosette or daisy arrangements; no enlargement of the cell", "No hypnozoites; a long asymptomatic infection possible", "Nephrotic syndrome from immune complex deposition, and a parasitaemia that persists for years"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The ring stage is the answer to a favourite question about why falciparum is the killer. It infects red cells of every age, so parasitaemia rises high; and it expresses knobs of protein on the red cell surface that make the cell adhere to vascular endothelium, sequestering parasitised cells in the brain, kidney and placenta. The obstruction of those vessels is what produces cerebral malaria, and it is also why a peripheral blood film underestimate the true parasite burden in a severe case.",
      },
      {
        type: "paragraph",
        text: "Diagnosis is the examination of thick and thin films. The thick film lyses red cells and concentrates parasites, and is the sensitive screen; the thin film preserves the morphology and is the specimen used to identify the species. Rapid diagnostic tests detect Plasmodium-specific histidine-rich protein 2 or pan-Plasmodium lactate dehydrogenase and give an answer in minutes in a field setting, and PCR is the definitive tool for low-parasitaemia and mixed infection.",
      },
      {
        type: "table",
        headers: ["Stage of the cycle", "Where it occurs", "What it causes", "What kills it"],
        rows: [
          ["Sporozoite", "Injected by the Anopheles mosquito", "The initiating stage; travels to the liver within 30 minutes", "No clinically used drug targets it, though a pre-erythrocytic vaccine is in use"],
          ["Exo-erythrocytic (liver) schizogony", "Hepatocytes, 7–10 days after infection", "The clinically silent prepatent period", "Atovaquone-proguanil and primaquine have activity against the liver stage"],
          ["Hypnozoite", "Dormant in hepatocytes, in vivax and ovale only", "Relapse weeks to years later", "Primaquine — the only drug that eradicates it, and the reason for a G6PD test first"],
          ["Asexual erythrocytic cycle", "Red cells, causing the paroxysm", "The fever, the anaemia and the cytoadherence of severe falciparum disease", "Chloroquine, artemisinin derivatives, quinine, atovaquone, pyrimethamine"],
          ["Gametocyte", "Red cells, after about 10 days", "Infects the mosquito; the transmissible form", "Primaquine sterilises it, and so interrupts transmission"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "A febrile traveller returning from an endemic area with a film that is negative must be re-examined during a paroxysm, because falciparum parasitaemia is cyclic and may be missed between peaks. Three negative films taken 12 hours apart exclude the diagnosis; the danger of a false negative is that the patient then progresses to cerebral malaria before anyone thinks of malaria again.",
      },

      { type: "heading", level: 2, text: "Entamoeba histolytica" },
      {
        type: "paragraph",
        text: "Entamoeba histolytica is a facultative anaerobic amoeba transmitted by a mature cyst in contaminated food and water. Excystation in the small bowel releases trophozoites, which invade the colonic mucosa by a contact-dependent mechanism using a galactose/N-acetylgalactosamine lectin, and which destroy tissue with a cysteine proteinase. The characteristic lesion is the flask-shaped ulcer — narrow at the surface, wide in the submucosa, like the base of a wine glass — and the trophozoites reach the portal vessels and travel to the liver.",
      },
      {
        type: "table",
        headers: ["Diagnostic or pathological feature", "What it is", "Significance"],
        rows: [
          ["Mature quadrinucleate cyst", "A spherical cyst with four nuclei in saline preparation of stool", "The infective stage and the finding that confirms the transmission route"],
          ["Trophozoite with ingested red cells", "An amoeba containing erythrocytes within its cytoplasm", "The single most useful microscopic distinction from the commensal Entamoeba dispar, which cannot ingest red cells"],
          ["Flask-shaped colonic ulcer", "Narrow neck at the mucosa, wide base in the submucosa", "The pathognomonic lesion seen at sigmoidoscopy and histopathology"],
          ["Anchovy-sauce liver abscess", "A sterile, brown, odourless, wall-limited hepatic abscess", "Metronidazole is effective against the tissue stages and a luminal agent follows to clear cysts and prevent relapse"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Amoebic liver abscess is sterile — trophozoites do not survive at the abscess centre — so a culture of the aspirate is usually negative, and searching for trophozoites has to be done in the wall. Serology is therefore the more useful test, and microscopy for cysts in the stool is present in only about a third of cases. The mistake is to expect pus with organisms, as in a pyogenic abscess.",
      },

      { type: "heading", level: 2, text: "Giardia, Leishmania, Toxoplasma and Trichomonas" },
      {
        type: "table",
        headers: ["Organism", "Form and site", "Transmission", "Disease", "Diagnosis"],
        rows: [
          ["Giardia lamblia (G. intestinalis)", "Pear-shaped trophozoite with two nuclei and a sucking disc; oval four-nucleate cyst; attaches to the duodenal and jejunal epithelium", "Ingestion of cysts in contaminated water — a classic hiker and traveller disease", "Steatorrhoea, bloating, and malabsorption without dysentery", "Trophozoites or cysts in several stool specimens, duodenal aspirate or string test; antigen detection in stool"],
          ["Leishmania donovani", "Amastigote form inside macrophages, with no flagellum and a dark nucleus and kinetoplast", "Bite of an infected female Phlebotomus sandfly", "Visceral leishmaniasis (kala-azar): fever, hepatosplenomegaly, pancytopenia and dark skin; post-kala-azar dermal leishmanoid after treatment", "Amastigotes (LD bodies) in bone marrow, spleen or lymph node aspirate; serology and PCR; treated with amphotericin B or miltefosine"],
          ["Toxoplasma gondii", "Crescentic trophozoites (tachyzoites) in acute infection; bradyzoites in tissue cysts persisting for life", "Ingestion of cysts in undercooked meat, oocysts from cat faeces, or transplacental transmission", "Asymptomatic or mononucleosis-like illness in the immunocompetent; encephalitis with ring-enhancing lesions in AIDS; congenital toxoplasmosis with hydrocephalus, intracranial calcification and chorioretinitis", "IgM and IgG serology, PCR on amniotic fluid or CSF; treated with pyrimethamine plus sulphadiazine and folinic acid"],
          ["Trichomonas vaginalis", "A pear-shaped flagellated trophozoite with an undulating membrane; no cyst form exists", "Sexual transmission; it survives poorly outside the body", "Frothy, yellow-green vaginitis with a raised pH and a strawberry cervix; male urethritis is usually carriage", "Wet preparation showing motile flagellated trophozoites, nucleic acid test, or culture; treated with metronidazole or tinidazole, and the partner must always be treated"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The absence of a cyst form has two consequences that appear in examinations. First, the diagnosis is made from a fresh wet preparation of a vaginal swab, because the trophozoite dies quickly if the specimen dries — a urine sample or a culture is required if the patient has recently urinated. Second, sexual transmission explains the persistence of the infection, and the relapse rate unless the asymptomatic partner is treated; reinfection, not treatment failure, is the usual recurrence.",
      },

      { type: "heading", level: 2, text: "Opportunistic protozoa and free-living amoebae" },
      {
        type: "table",
        headers: ["Organism", "Setting", "Disease", "Treatment"],
        rows: [
          ["Cryptosporidium parvum / hominis", "AIDS and waterborne outbreaks; resistant to chlorine", "Profuse watery diarrhoea with a short illness in the immunocompetent, and chronic severe disease with a low CD4 count", "Nitazoxanide, and antiretroviral therapy to restore the CD4 count; water filtration matters for control"],
          ["Isospora belli", "AIDS in the tropics", "Chronic watery diarrhoea with eosinophilia", "Trimethoprim–sulfamethoxazole"],
          ["Cyclospora cayetanensis", "Contaminated fresh produce", "Prolonged watery diarrhoea", "Trimethoprim–sulfamethoxazole"],
          ["Microsporidia", "AIDS and transplant", "Diarrhoea, keratoconjunctivitis and disseminated disease", "Albendazole; fumagillin for ocular disease"],
          ["Acanthamoeba species", "Contact lens wearers and immunosuppressed", "Acanthamoeba keratitis, and granulomatous amoebic encephalitis", "Topical chlorhexidine and polyhexamethylene biguanide for keratitis; rarely responds once disseminated"],
          ["Naegleria fowleri", "Warm fresh water entering the nose", "Primary amoebic meningoencephalitis, fulminant and lethal", "Amphotericin B, rarely successful; prevention is nasal protection and pool disinfection"],
          ["Babesia microti", "Tick-bite and transfusion", "Febrile haemolytic anaemia in the asplenic and elderly", "Atovaquone plus azithromycin, or clindamycin and quinine"],
          ["Trypanosoma brucei", "Tsetse-fly bite", "Sleeping sickness: a chancre, lymphadenopathy, then somnolence and coma", "Pentamidine or suramin for early, and melarsoprol or eflornithine for CNS disease"],
          ["Trypanosoma cruzi", "Reduviid bug faeces entering the bite", "Chagas disease: Romaña's sign, megaoesophagus and megacolon years later", "Benznidazole or nifurtimox, effective only in the acute phase"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying that vivax and falciparum both relapse. Only vivax and ovale form hypnozoites and relapse; falciparum has no hepatic dormancy and its recrudescence is a failure of blood-stage treatment, not a true relapse. This distinction decides whether primaquine is indicated, and whether a G6PD assay is needed before it is given.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Describing trophozoites in a pyogenic liver abscess. The amoebic abscess is sterile, and the trophozoites are confined to the wall — so aspirating the centre yields sterile pus and a negative culture. The suspicion of 'pus that culture does not grow' is itself the diagnostic clue.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating the index case of trichomoniasis alone. The organism has no cyst form, persists as asymptomatic carriage in partners, and is sexually transmitted; the partner must be treated to prevent re-infection, and the standard regimen is a single oral dose of metronidazole or tinidazole to both.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A patient with falciparum malaria is treated with chloroquine, the fever settles for three weeks, and then a fever returns. Explain the two possible mechanisms and how they are distinguished.",
        answer:
          "Either recrudescence — a failure of the chloroquine to clear the blood stages completely, with the surviving parasitaemia expanding again — or reinfection from a mosquito bite. They are distinguished by the drug-susceptibility of the returning parasites and, at a public-health level, by whether reinfection is plausible in the area.",
        explanation:
          "Falciparum does not relapse from hypnozoites, so a return of fever three weeks after chloroquine is unlikely to be dormancy; it is a persistence or new infection, and chloroquine resistance is the usual explanation in its endemic range.",
      },
      {
        type: "question",
        prompt: "Why is primaquine prescribed for vivax but is dangerous in a patient deficient in G6PD?",
        answer:
          "Because primaquine is the only drug that eradicates the dormant hypnozoites of vivax and so prevents relapse, but it is an oxidant drug that produces haemolysis in red cells unable to maintain glutathione because of glucose-6-phosphate dehydrogenase deficiency.",
        explanation:
          "The G6PD assay is performed before primaquine, and in a deficient patient the alternatives are a weekly primaquine dose over a longer period, or tafenoquine monitoring; the therapy that prevents relapse cannot simply be withheld in an endemic area.",
      },
      {
        type: "question",
        prompt: "A woman has a positive Toxoplasma IgM and IgG in early pregnancy. What is done, and why?",
        answer:
          "The serology is repeated in a reference laboratory to confirm, amniocentesis PCR on amniotic fluid is used to determine fetal infection, and serial ultrasound looks for hydrocephalus and intracranial calcification. If fetal infection is confirmed, spiramycin is given, changing to pyrimethamine plus sulphadiazine later in the pregnancy.",
        explanation:
          "Congenital toxoplasmosis is the consequence the test exists to prevent: the organism crosses the placenta, and the fetal risk is highest in the first trimester, declining progressively thereafter.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which pairing of Plasmodium species with its blood-film appearance and fever periodicities is correct?",
        options: [
          "P. vivax — Schüffner's dots and tertian fever; P. malariae — band forms and quartan fever.",
          "P. falciparum — banana gametocytes and quartan fever; P. vivax — no enlargement and tertian fever.",
          "P. ovale — multiple rings per red cell and tertian fever; P. malariae — Schüffner's dots and quartan fever.",
          "P. falciparum — quarantine and tertian fever; P. vivax — banana gametocytes and quartan fever.",
        ],
        correctIndex: 0,
        explanation:
          "Vivax enlarges the red cell and shows Schüffner's dots with a 48-hour tertian fever; malariae gives band forms with a 72-hour quartan fever. Falciparum gives banana gametocytes with tertian fever, not quartan, and multiple rings per cell is also falciparum.",
      },
      {
        type: "mcq",
        stem: "A patient with AIDS and a CD4 count of 30 has a solitary ring-enhancing lesion in the brain on MRI. Serology is positive for IgG against Toxoplasma gondii. Which is the most likely diagnosis and the empirical treatment?",
        options: [
          "Primary central nervous system lymphoma, for whom stereotactic biopsy is the immediate next step.",
          "Toxoplasma encephalitis, treated empirically with pyrimethamine, sulphadiazine and folinic acid.",
          "Cryptococcal meningitis, for whom a CSF India ink preparation is the diagnostic step.",
          "Progressive multifocal leukoencephalopathy, for whom there is no effective treatment.",
        ],
        correctIndex: 1,
        explanation:
          "Multiple, or a solitary, ring-enhancing lesion with serological evidence of toxoplasmosis in advanced HIV is treated empirically as toxoplasmosis, and clinical and radiological response is the diagnostic confirmation. Failure to respond prompts biopsy to exclude lymphoma.",
      },
      {
        type: "mcq",
        stem: "A patient has a liver abscess and an anchovy-sauce-coloured aspirate that grows nothing on culture. Which is the most likely organism and the appropriate therapy?",
        options: [
          "Entamoeba histolytica, treated with metronidazole followed by a luminal agent such as diloxanide furoate or paromomycin.",
          "Staphylococcus aureus, treated with flucloxacillin alone and percutaneous drainage.",
          "Klebsiella pneumoniae, treated with ceftriaxone and surgical drainage.",
          "Fasciola hepatica, treated with triclabendazole and no drainage.",
        ],
        correctIndex: 0,
        explanation:
          "The sterile 'anchovy sauce' aspirate is the classical finding of an amoebic liver abscess, because trophozoites live in the wall and the centre is necrotic and sterile. A pyogenic abscess grows organisms and is treated with antibacterial therapy plus drainage.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Protozoan parasites are defined by their life cycles. Plasmodium presents four species whose blood-film appearances — rings with multiple infection and banana gametocytes in falciparum, Schüffner's dots and amoeboid rings in vivax, band forms in malariae, oval cells in ovale — identify the species, and it is the hypnozoite of vivax and ovale that makes primaquine necessary. Entamoeba histolytica makes flask-shaped ulcers and a sterile anchovy-sauce liver abscess, and its trophozoite with ingested red cells distinguishes it from the commensal Entamoeba dispar. Giardia, Leishmania, Toxoplasma and Trichomonas each carry a characteristic diagnostic form, and the opportunistic and free-living protozoa summarise the infections of the immunocompromised and the contact-lens wearer.",
      },
      {
        type: "paragraph",
        text: "Next: helminth parasites. You will meet the nematodes, cestodes and trematodes, and the argument for community control that a parasite with a life cycle outside the human host demands.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 15 — Helminth parasites (fully authored)
// ---------------------------------------------------------------------------
function lesson15() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: classify helminths as nematodes, cestodes and trematodes and state the morphological difference between them; describe the life cycles, pathogenesis and diagnosis of the important intestinal nematodes; describe lymphatic filariasis, its nocturnally periodic microfilariae and its chronic elephantiasis; describe Taenia solium, the significance of cysticercosis and the reason neurocysticercosis is treated with an antiseizure and an antiparasitic; describe hydatid disease, its anaphylaxis risk and the principles of aspiration; describe the schistosomes, their species, their target vessels and their diagnostic eggs; and name the laboratory findings — eosinophilia, egg microscopy, serology — that identify helminth infection.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 14 — Protozoan parasites, for the same life-cycle logic and the Th2 immune response that helminths elicit; module 2 — cell-mediated immunity, for the eosinophil as the signature cell of helminth infection.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Helminth",
        text: "A parasitic worm. Three groups matter medically: Nematoda (roundworms, with a complete gut and separate sexes), Cestoda (tapeworms, flat, segmented, with no gut and hermaphrodite proglottids) and Trematoda (flukes, flat, unsegmented, with a gut and hermaphrodite or bisexual forms).",
      },
      {
        type: "paragraph",
        text: "Helminths are, biologically, complex animals living inside another animal, and their clinical behaviour follows from that. They do not multiply inside the definitive human host — an adult worm produces eggs or larvae, but no new adult worms — so the intensity of infection depends on how many eggs you swallowed, inhaled or had penetrate the skin, and not on how long you have been infected. That single principle explains why disease is proportional to worm burden, and why one heavy exposure in a child can produce a fatal intestinal obstruction.",
      },
      {
        type: "paragraph",
        text: "They also do not replicate inside a host, so they are not cleared by the immune response that works on protozoa; the Th2 response with eosinophilia, IgE and mast cells that they elicit contains rather than eliminates them. The clinical consequence is chronic disease — anaemia, intestinal obstruction, elephantiasis, epilepsy — and control by sanitation, vector control and mass drug administration rather than by individual treatment alone.",
      },

      { type: "heading", level: 2, text: "Nematodes: the intestinal roundworms" },
      {
        type: "table",
        headers: ["Worm", "Route of infection", "Pathogenesis", "Diagnosis"],
        rows: [
          ["Ascaris lumbricoides", "Swallowing of an infective egg in contaminated food or soil", "Usually asymptomatic; a heavy burden causes intestinal obstruction, and migration causes biliary colic, pancreatic duct obstruction and Löffler syndrome from lung transit", "A fertile, mammillated egg in stool, or an adult worm emerging at the mouth, anus or during surgery"],
          ["Ancylostoma duodenale and Necator americanus (hookworm)", "Filariform larvae in soil penetrate the skin", "Chronic intestinal blood loss from adult worms in the duodenum, producing iron-deficiency anaemia; ground itch at the skin entry site and transient pneumonitis", "Thin-shelled ovate eggs with a clear segmentation in stool; larvae may be cultured"],
          ["Strongyloides stercoralis", "Filariform larvae penetrate the skin", "A self-perpetuating cycle of autoinfection, so infection persists for decades; hyperinfection syndrome with disseminated larvae and Gram-negative sepsis in a patient on corticosteroids", "Rhabditiform larvae with a short buccal cavity in stool or duodenal fluid; a single stool may miss it, so concentration or agar culture is used"],
          ["Trichuris trichiura (whipworm)", "Swallowing of an embryonated egg", "Caecal and colonic inflammation; heavy infection causes bloody mucoid diarrhoea and rectal prolapse, especially in a child", "A barrel-shaped brown egg with a clear plug at each pole"],
          ["Enterobius vermicularis (threadworm)", "Direct ingestion of eggs from the perianal area or aerosolised in bedding", "Nocturnal perianal itching; vulvovaginitis in girls; appendiceal inflammation from a luminal worm", "Not by a routine stool examination — the adhesive tape (cellophane swab) test on the perianal skin in the morning before bathing finds the eggs"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Strongyloides is the nematode that kills the patient on steroids. Because the cycle is autoinfective, the infection persists for decades unrecognised; a dose of corticosteroids blocks the Th2 eosinophil response that contains it, and accelerated autoinfection produces hyperinfection with larvae in the lungs and gut, carried a Gram-negative sepsis from bacteria the larvae transport across the bowel wall. Screening is advisable before immunosuppression in anyone who has lived in the tropics.",
      },

      { type: "heading", level: 2, text: "Nematodes transmitted by arthropods and vector control" },
      {
        type: "table",
        headers: ["Worm", "Vector", "Pathogenesis", "Control and diagnosis"],
        rows: [
          ["Wuchereria bancrofti and Brugia malayi", "Culex, Anopheles and Mansonia mosquitoes", "Adult worms in the lymphatics cause lymphangitis, hydrocoele and, after years of lymphatic damage, elephantiasis of the leg, arm or genitalia", "Nocturnal periodic microfilariae in a thick blood film taken between 10 pm and 2 am; treated with diethylcarbamazine, with ivermectin and albendazole in combination, and with vector control"],
          ["Onchocerca volvulus", "Blackflies of the genus Simulium breeding in fast rivers", "Microfilariae in the skin cause intense itching, lichenification and hanging groin, and in the eye cause keratitis, chorioretinitis and river blindness", "Skin snip microscopy for microfilariae; ivermectin given annually, and vector control along rivers; the Mazotti reaction after treatment is allergic"],
          ["Loa loa", "Deer flies of the genus Chrysops", "Calabar swellings in the subcutaneous tissue and the adult worm crossing the conjunctiva — the eyeworm", "Midday periodic microfilariae in blood; surgical removal of the worm, diethylcarbamazine with care for heavy infections"],
          ["Dracunculus medinensis (Guinea worm)", "Ingestion of water containing the copepod intermediate host", "A painful blister on a limb, a metre-long adult worm emerges over weeks, and secondary infection and disability follow", "Rolling the worm onto a stick; on the verge of eradication because transmission is interrupted by filtering drinking water — no drug and no vaccine do the work"],
          ["Trichinella spiralis", "Ingestion of larvae in undercooked pork or wild game", "Larvae encyst in muscle, causing myalgia, periorbital oedema and eosinophilia", "Muscle biopsy, serology and clinical history; treated with albendazole plus a steroid for symptomatic inflammation"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Larva migrans shows the rule that a worm in the wrong host is not harmless but is permanently lost. Toxocara canis in a human produces visceral larva migrans, because the larva cannot mature and wanders through liver, lung and eye provoking a granulomatous response; and Ancylostoma braziliense in the skin produces cutaneous larva migrans with its characteristic creeping eruption. In both, the diagnosis rests on the pattern of migration rather than on finding the adult worm.",
      },

      { type: "heading", level: 2, text: "Cestodes: the tapeworms" },
      {
        type: "table",
        headers: ["Worm", "Route of infection", "Pathogenesis", "Diagnosis and treatment"],
        rows: [
          ["Taenia solium (pork tapeworm)", "Eating undercooked pork containing a cysticercus", "The adult worm in the gut is generally benign; the danger is that the patient sheds eggs, which on ingestion produce human cysticercosis — larvae in muscle, eye and, most dangerously, brain", "Proglottids and eggs in stool; neurocysticercosis is diagnosed by CT or MRI ring-enhancing cysts with serology; treated with an antiseizure to prevent fitting, then albendazole or praziquantel under steroid cover to limit inflammation"],
          ["Taenia saginata (beef tapeworm)", "Eating undercooked beef containing a cysticercus", "A long, often asymptomatic adult worm; the proglottid actively crawls out of the anus, which is the classic complaint", "Proglottids and eggs in stool; praziquantel"],
          ["Echinococcus granulosus", "Ingestion of eggs from the faeces of an infected dog", "A slowly expanding hepatic hydatid cyst that may reach 20 cm, rupture causing anaphylaxis and dissemination of daughter cysts, and pressure symptoms on adjacent structures", "Ultrasound with characteristic floating membranes and daughter cysts, serology, and CT; treatment is PAIR — puncture, aspiration, injection of a scolicidal agent and re-aspiration — or surgical resection, and albendazole to cover the procedure"],
          ["Echinococcus multilocularis", "Eggs from the faeces of foxes and canids", "An infiltrative alveolar hydatid disease of the liver that behaves like a malignant tumour", "Imaging and serology; radical surgical resection with prolonged albendazole"],
          ["Diphyllobothrium latum (fish tapeworm)", "Eating raw or undercooked freshwater fish", "Usually asymptomatic; competes for vitamin B12 and can cause megaloblastic anaemia in a long-standing infection", "Operculated eggs in stool; praziquantel"],
          ["Hymenolepis nana (dwarf tapeworm)", "Ingestion of eggs, and also autoinfection", "The one cestode that can complete its cycle in a human; a light infection is asymptomatic", "Eggs in stool; praziquantel"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The distinction between Taenia solium and Taenia saginata carries the most frightful clinical consequence in parasitology. A person colonised by T. saginata is a nuisance; a person infected with T. solium is a potential source of neurocysticercosis in their household, because ingestion of the eggs they shed — by faecal-oral contamination rather than by pork — produces cysts in the human brain. Treating the intestinal worm therefore also protects the people around the patient, and the reasoneradication of human cysticercosis requires both sanitation and pig husbandry.",
      },

      { type: "heading", level: 2, text: "Trematodes: the flukes" },
      {
        type: "paragraph",
        text: "Trematodes need a snail intermediate host, and the free-swimming cercariae that emerges from it either penetrate skin directly, as the schistosomes do, or encyst on aquatic plants or in fish and crabs before being eaten. The site into which the adult settles determines the pathology: vesical, intestinal or hepatic.",
      },
      {
        type: "table",
        headers: ["Worm", "Transmission", "Pathogenesis", "Diagnosis and treatment"],
        rows: [
          ["Schistosoma haematobium", "Cercariae of the snail Bulinus penetrate skin while wading", "Adults in the vesical venous plexus cause haematuria, dysuria, bladder wall fibrosis, squamous bladder carcinoma and obstructive uropathy", "Terminal-spined eggs in a midday urine sample examined after sedimentation; praziquantel"],
          ["Schistosoma mansoni", "Cercariae of Biomphalaria penetrate skin", "Adults in the mesenteric veins; eggs reaching the liver cause periportal fibrosis, portal hypertension and haematemesis, and the downstream disease is hepatosplenic schistosomiasis", "Lateral-spined eggs in stool; praziquantel"],
          ["Schistosoma japonicum", "Cercariae of Oncomelania penetrate skin", "The most prolific egg producer, so the heaviest hepatic and intestinal disease, and it also has a large-animal reservoir that frustrates elimination", "Small lateral-spined eggs in stool; praziquantel"],
          ["Fasciola hepatica", "Eating metacercariae on aquatic plants such as watercress", "Migration through the liver causes pain, eosinophilia and the triad of fever, hepatomegaly and right upper quadrant pain, and chronic biliary disease", "Eggs in stool or bile, and serology; triclabendazole is the drug of choice"],
          ["Fasciolopsis buski", "Eating metacercariae on aquatic plants", "Attachment to the duodenal and jejunal mucosa causing inflammation and malabsorption", "Large operculated eggs in stool; praziquantel"],
          ["Clonorchis sinensis", "Eating raw freshwater fish containing metacercariae", "Adults in the biliary tree cause cholangitis, cholelithiasis and, over years, cholangiocarcinoma", "Small operculated eggs in stool; praziquantel, and avoidance of raw fish"],
          ["Paragonimus westermani", "Eating raw or pickled freshwater crabs or crayfish", "Adult flukes in the lung cause chronic cough, brown sputum and haemoptysis, mimicking tuberculosis", "Operculated eggs in sputum or stool; praziquantel"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Katayama fever is the acute syndrome of heavy Schistosoma infection: four to eight weeks after exposure a febrile illness with urticaria, cough and abdominal pain, driven by circulating immune complexes and by the onset of egg laying. It is commoner in the non-immune traveller than in a continuously exposed local population, and it must be distinguished from the chronic disease, for which the treatment is the same drug and the prognosis is very different.",
      },

      { type: "heading", level: 2, text: "Diagnosis, eosinophilia and community control" },
      {
        type: "table",
        headers: ["Approach", "What it finds", "When to use it"],
        rows: [
          ["Stool microscopy for ova and parasites", "Eggs of nematodes, cestodes and trematodes", "The routine screen for intestinal infection; a periodicity must be respected — Strongyloides requires concentration"],
          ["Perianal adhesive tape (Scotch tape) test", "Eggs of Enterobius", "The only reliable test for threadworm, taken in the morning before washing"],
          ["Thick blood film at the correct hour", "Nocturnal or midday periodic microfilariae", "Filariasis; timing decides a negative and a positive result"],
          ["Skin snip", "Microfilariae of Onchocerca", "River blindness; painless and repeatable"],
          ["Serology and antigen detection", "Specific antibodies or circulating antigens", "Hydatid disease, strongyloidiasis, and schistosomiasis where egg output is low"],
          ["Imaging", "Worm burden, cysts and their complications", "Hydatid disease, neurocysticercosis, and the biliary and vesical complications of trematodes"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Eosinophilia is the signature of the tissue-invasive helminth and the reason it appears in the differential of any unexplained eosinophilia. It is greatest with the migratory tissue phases — Ascaris lung transit, Strongyloides hyperinfection, filarial disease, schistosome Katayama fever — and is usually absent in a purely intestinal adult-worm infection, which is why an eosinophil count is often normal in a heavy Ascaris burden.",
      },
      {
        type: "paragraph",
        text: "Community control rests on the parasite's life cycle outside the human host. Sanitation interrupts faecal–oral transmission of Ascaris, Trichuris, Enterobius and the cyst-passing cestodes. Footwear prevents hookworm larvae entering the skin. Vector control interrupts lymphatic filariasis and onchocerciasis. Water filtration interrupts Guinea worm and dracunculiasis, and safe handling of dog and fox faeces interrupts hydatid disease. Mass drug administration — albendazole or ivermectin to whole endemic communities on a schedule — reduces the worm reservoir, and for the helminthiases that are better tolerated this is the model that has worked.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Believing a helminth multiplies inside the human host. A worm does not make new adult worms inside the definitive host; disease severity is proportional to the number of worms acquired, and clearance of one burden is permanent unless new exposure occurs. This is what distinguishes helminth infection from almost every bacterial and protozoal infection.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating neurocysticercosis with an antiparasitic alone. Killing viable intracranial cysts causes a violent inflammatory reaction with cerebral oedema and seizures, so therapy always combines an antiseizure and a corticosteroid with the albendazole or praziquantel, and the drug is often withheld until the intracranial pressure and the seizure risk are managed.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Aspirating a hydatid cyst casually. Rupture scatters daughter cysts and protoscolices through the peritoneal cavity and can cause fatal anaphylaxis, so aspiration is performed only under cover of albendazole and with a scolicidal agent injected into the cyst at the end of the procedure.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A child with a heavy worm burden has colicky abdominal pain and bilious vomiting, and an adult worm is seen in the stool. Which worm, and what two life-cycle stages are being met?",
        answer:
          "Ascaris lumbricoides, whose adult forms the mass that obstructs the small bowel and whose swallowed egg is the infective stage that established the infection in the first place.",
        explanation:
          "The adult worm in the gut produces the fertilised mammillated eggs found in stool; no multiplication occurs inside the child, so the single fertilised-egg exposure is the origin of all of the worms present, and a heavy obstruction usually follows one heavy exposure in a child with a low worm count.",
      },
      {
        type: "question",
        prompt: "A man with a first-ever seizure has an imaging showing a ring-enhancing cyst with a scolex. Which worm, which dietary exposure caused its intestinal stage, and which process produced the brain cyst?",
        answer:
          "Taenia solium. The intestinal tapeworm was acquired by eating undercooked pork, and the brain cyst resulted from ingestion of eggs shed in human faeces — faecal–oral transmission producing human cysticercosis, not from eating pork.",
        explanation:
          "This is the most important fact in tapeworm biology: the intestinal disease and the tissue disease have different routes of acquisition, so the treatment of the person with the worm also protects the people they live with.",
      },
      {
        type: "question",
        prompt: "A woman wading in a tropical river has a febrile illness with urticaria eight weeks later. What is the syndrome and the drug?",
        answer:
          "Katayama fever, the acute syndrome of heavy schistosome infection at the start of egg laying, driven by immune complex deposition; the drug is praziquantel, given when the acute response settles.",
        explanation:
          "Katayama is commonest in non-immune travellers with heavy exposure; the chronic disease it precedes is hepatosplenic or vesical, and the fact that both stages are caused by the same worm explains why the same drug treats both.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which statement correctly distinguishes the three helminth groups?",
        options: [
          "Nematodes are flat and segmented; cestodes have a complete gut; trematodes are round with separate sexes.",
          "Nematodes are round with a complete gut and separate sexes; cestodes are flat, segmented, with no gut and hermaphrodite; trematodes are flat and unsegmented with a gut and hermaphrodite or bisexual.",
          "All three have no gut and reproduce sexually by cross-fertilisation.",
          "Nematodes are segmented with a gut; cestodes are round; trematodes are round with a gut.",
        ],
        correctIndex: 1,
        explanation:
          "The nematode is a cylindrical worm with both mouth and anus and separate sexes; the cestode is a flat segmented tape with proglottids and no alimentary canal; and the trematode is a flat unsegmented fluke with a branched gut.",
      },
      {
        type: "mcq",
        stem: "Which pairing of helminth with its diagnostic specimen and method is correct?",
        options: [
          "Enterobius vermicularis — a routine saline stool preparation for eggs.",
          "Wuchereria bancrofti — a thick blood film taken between 10 pm and 2 am for periodic microfilariae.",
          "Schistosoma haematobium — lateral-spined eggs in a midday stool sample.",
          "Onchocerca volvulus — midday periodic microfilariae in a thick blood film.",
        ],
        correctIndex: 1,
        explanation:
          "Lymphatic filarial microfilariae are nocturnally periodic and must be sought in a night film; Enterobius eggs need the perianal tape test, Schistosoma haematobium eggs are terminal-spined and found in urine, and Onchocerca microfilariae lie in a skin snip rather than blood.",
      },
      {
        type: "mcq",
        stem: "A patient with epilepsy and a ring-enhancing cyst containing a scolex comes from a region where pork is eaten undercooked. Which worm, and why must an antiparasitic never be given first?",
        options: [
          "Echinococcus granulosus, because killing the parasite releases hydatid sand and causes anaphylaxis.",
          "Taenia solium, because killing the intracranial cyst causes inflammation, cerebral oedema and seizures, so antiseizure and steroid cover must precede the treatment.",
          "Taenia saginata, because killing the intestinal worm releases eggs into the bloodstream.",
          "Spirometra, because killing the larva causes a massive cytoplasmic eosinophilic reaction.",
        ],
        correctIndex: 1,
        explanation:
          "The ring-enhancing cyst with a scolex in a pork-eating region is neurocysticercosis from Taenia solium. Treatment of viable cysts kills the parasite and causes a violent inflammatory reaction, so an antiseizure and a corticosteroid are given first; hydatid disease also carries an anaphylaxis risk but has no scolex within a ring-enhancing brain cyst of this kind.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Helminths are nematodes with a complete gut, cestodes that are flat and segmented with no gut, and trematodes that are flat and unsegmented with a gut and a snail intermediate host. None multiplies inside the human host, so disease is proportional to the burden acquired, and diagnosis rests on the egg, the larva or the fragment found in the correct specimen at the correct hour — stool for the intestinal worms, a tape swab for Enterobius, a night film for the nocturnal microfilariae, a skin snip for Onchocerca. Their control is the interruption of a life cycle outside the human, by sanitation, footwear, vector control and mass drug administration.",
      },
      {
        type: "paragraph",
        text: "Modules 1 to 3 are complete. Module 4, sterilisation and hospital infection control, applies everything: the autoclave that kills the spores of lesson 1, the hand hygiene that interrupts the transmission of every organism you have studied, and the waste segregation that keeps all of them out of the next patient's wound.",
      },
    ],
  };
}


export const MICROBIOLOGY: SubjectSeed = {
  id: "mbbs-microbiology",
  slug: "medical-microbiology",
  title: "Medical Microbiology",
  code: "MIC 201",
  department: "Medical Microbiology",
  level: 200,
  credits: 4,
  semester: "second",
  description:
    "Bacteriology, virology, mycology and parasitology with immunology, sterilisation and hospital infection control, and the system-based infections a clinician must recognise (AIIMS para-clinical, semesters III–V).",
  faculty: "basic-medical-sciences",
  prereqCourses: ["medical-biochemistry-i", "physiology-cell-and-general"],
  modules: [
    { slug: "general-bacteriology-genetics", title: "M1 — General bacteriology & bacterial genetics" },
    { slug: "immunity-immunodiagnosis", title: "M2 — Immunity & immunodiagnosis" },
    { slug: "virology-mycology-parasitology", title: "M3 — Virology, mycology & parasitology" },
    { slug: "sterilisation-infection-control", title: "M4 — Sterilisation & hospital infection control" },
    { slug: "system-based-infections", title: "M5 — System-based infections" },
  ],
  lessons: [
    { title: "Bacterial cell structure", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Bacterial cell structure", slug: "bacterial-cell-structure", summary: "The bacterial cell wall, membrane, capsules, flagella, spores and Gram stain behaviour that classify bacteria and dictate antibiotic targets.", blooms: "understand", minutes: 40, prereq: [] }, content: lesson1() as never },
    { title: "Growth, nutrition & cultivation", module: 1, estimatedMinutes: 35, authored: true, concept: { title: "Bacterial growth and culture", slug: "bacterial-growth-culture", summary: "Growth curves, oxygen and nutritional requirements, culture media and colony morphology used to isolate and identify pathogens.", blooms: "understand", minutes: 35, prereq: ["bacterial-cell-structure"] }, content: lesson2() as never },
    { title: "Bacterial genetics & mutation", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Bacterial genetics and mutation", slug: "bacterial-genetics-mutation", summary: "Mutation, transformation, transduction, conjugation and transposons — the mechanisms behind resistance spread.", blooms: "analyze", minutes: 40, prereq: ["bacterial-growth-culture"] }, content: lesson3() as never },
    { title: "Antimicrobial susceptibility", module: 1, estimatedMinutes: 35, authored: true, concept: { title: "Antimicrobial susceptibility testing", slug: "antimicrobial-susceptibility", summary: "Disc diffusion, MIC determination, MIC breakpoints and resistance phenotypes that guide rational antibiotic choice.", blooms: "apply", minutes: 35, prereq: ["bacterial-genetics-mutation"] }, content: lesson4() as never },
    { title: "Innate immunity", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Innate immunity", slug: "innate-immunity", summary: "Barriers, phagocytes, complement, pattern-recognition receptors and inflammation as the first-line host defence.", blooms: "understand", minutes: 40, prereq: ["bacterial-cell-structure"] }, content: lesson5() as never },
    { title: "Humoral adaptive immunity", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Humoral adaptive immunity", slug: "adaptive-humoral-immunity", summary: "B-cell activation, antibody classes and affinities, somatic hypermutation and the serological readout of infection.", blooms: "understand", minutes: 40, prereq: ["innate-immunity"] }, content: lesson6() as never },
    { title: "Cell-mediated adaptive immunity", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Cell-mediated adaptive immunity", slug: "adaptive-cellular-immunity", summary: "Antigen presentation, T-cell subsets, cytotoxic responses and the delayed hypersensitivity reactions seen in tuberculosis and granulomatous disease.", blooms: "understand", minutes: 40, prereq: ["innate-immunity"] }, content: lesson7() as never },
    { title: "Antigen–antibody reactions", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Antigen-antibody reactions", slug: "antigen-antibody-reactions", summary: "Agglutination, precipitation, ELISA, immunofluorescence and rapid tests — the diagnostic laboratory applied to infection.", blooms: "apply", minutes: 40, prereq: ["adaptive-humoral-immunity", "adaptive-cellular-immunity"] }, content: lesson8() as never },
    { title: "Vaccines & immunisation", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Vaccines and immunisation", slug: "vaccines-immunisation", summary: "Live, killed, subunit and mRNA vaccines, adjuvants, cold chain and the national immunisation schedule.", blooms: "apply", minutes: 40, prereq: ["antigen-antibody-reactions"] }, content: lesson9() as never },
    { title: "General virology", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "General virology", slug: "general-virology", summary: "Virion structure, replication strategies, cultivation and laboratory diagnosis of viral infection.", blooms: "understand", minutes: 40, prereq: ["bacterial-cell-structure"] }, content: lesson10() as never },
    { title: "DNA viruses", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "DNA viruses", slug: "dna-viruses", summary: "Herpesviruses, poxviruses, adenoviruses, papillomaviruses and hepatitis B — diseases, latency and oncogenic potential.", blooms: "understand", minutes: 40, prereq: ["general-virology"] }, content: lesson11() as never },
    { title: "RNA viruses", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "RNA viruses", slug: "rna-viruses", summary: "Orthomyxoviruses, paramyxoviruses, arboviruses, enteroviruses, retroviruses and hepatitis C — transmission, epidemics and prevention.", blooms: "understand", minutes: 40, prereq: ["general-virology"] }, content: lesson12() as never },
    { title: "Medical mycology", module: 3, estimatedMinutes: 35, authored: true, concept: { title: "Medical mycology", slug: "medical-mycology", summary: "Superficial, subcutaneous and systemic mycoses, opportunistic fungi in the immunocompromised, and antifungal pharmacology basics.", blooms: "understand", minutes: 35, prereq: ["general-virology"] }, content: lesson13() as never },
    { title: "Protozoan parasites", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "Protozoan parasites", slug: "protozoan-parasites", summary: "Plasmodium, Entamoeba, Leishmania, Giardia, Toxoplasma and Trichomonas — life cycles, vectors, disease and diagnosis.", blooms: "understand", minutes: 40, prereq: ["general-virology"] }, content: lesson14() as never },
    { title: "Helminth parasites", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "Helminth parasites", slug: "helminth-parasites", summary: "Nematodes, cestodes and trematodes including hydatid disease and filariasis — transmission, pathology and community control.", blooms: "understand", minutes: 40, prereq: ["protozoan-parasites"] }, content: lesson15() as never },
    { title: "Sterilisation & disinfection", module: 4, estimatedMinutes: 35, authored: false, concept: { title: "Sterilisation and disinfection", slug: "sterilisation-disinfection", summary: "Autoclaving, chemical disinfectants, antiseptics and sterility testing that keep instruments and wards safe.", blooms: "apply", minutes: 35, prereq: ["bacterial-cell-structure"] }, content: PLACEHOLDER },
    { title: "Hospital-acquired infection", module: 4, estimatedMinutes: 35, authored: false, concept: { title: "Hospital-acquired infection", slug: "hospital-acquired-infection", summary: "Sources, transmission routes, outbreak investigation, device-associated infection and bundle prevention in hospitals.", blooms: "analyze", minutes: 35, prereq: ["sterilisation-disinfection"] }, content: PLACEHOLDER },
    { title: "Biomedical waste management", module: 4, estimatedMinutes: 25, authored: false, concept: { title: "Biomedical waste management", slug: "biomedical-waste", summary: "Segregation, colour-coding, treatment and disposal of biomedical waste under standard practice and regulation.", blooms: "apply", minutes: 25, prereq: ["hospital-acquired-infection"] }, content: PLACEHOLDER },
    { title: "Respiratory & systemic infections", module: 5, estimatedMinutes: 45, authored: false, concept: { title: "Respiratory and systemic infections", slug: "respiratory-infections", summary: "Streptococcal and staphylococcal disease, tuberculosis, pertussis, diphtheria, pneumonia and PUO as systemic presentations.", blooms: "analyze", minutes: 45, prereq: ["antigen-antibody-reactions"] }, content: PLACEHOLDER },
    { title: "Gastrointestinal & hepatic infections", module: 5, estimatedMinutes: 45, authored: false, concept: { title: "Gastrointestinal and hepatic infections", slug: "gastrointestinal-hepatic-infections", summary: "Enteric fever, cholera, dysentery, food poisoning, viral hepatitis and clostridial disease — pathogens, pathogenesis and laboratory diagnosis.", blooms: "analyze", minutes: 45, prereq: ["respiratory-infections"] }, content: PLACEHOLDER },
    { title: "Urinary, CNS & wound infections", module: 5, estimatedMinutes: 45, authored: false, concept: { title: "Urinary, CNS and wound infections", slug: "urinary-cns-infections", summary: "UTI pathogens, meningitis and encephalitis, anaerobes, tetanus, gas gangrene and surgical-site infection.", blooms: "analyze", minutes: 45, prereq: ["respiratory-infections"] }, content: PLACEHOLDER },
    { title: "STDs, HIV & congenital infection", module: 5, estimatedMinutes: 45, authored: false, concept: { title: "STDs, HIV and congenital infections", slug: "std-hiv-congenital", summary: "Syphilis, gonorrhoea, chancroid, HIV virology and natural history, laboratory diagnosis, prevention and TORCH congenital infections.", blooms: "analyze", minutes: 45, prereq: ["rna-viruses"] }, content: PLACEHOLDER },
    { title: "Zoonoses & entomology", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Zoonoses and entomology", slug: "zoonoses-entomology", summary: "Rabies, leptospirosis, brucellosis, plague, arboviruses and the vectors and arthropods that transmit them.", blooms: "understand", minutes: 35, prereq: ["protozoan-parasites", "helminth-parasites"] }, content: PLACEHOLDER },
  ],
  sbas: [],
}

export async function seedMicrobiology(): Promise<void> {
  const counts = await seedMbbsCourse(MICROBIOLOGY);
  console.log(`✓ ${MICROBIOLOGY.code} ${MICROBIOLOGY.title}: ${counts.modules} modules · ${counts.concepts} concepts · ${counts.lessons} lessons · ${counts.items} items`);
}

if (process.argv[1] && process.argv[1].includes("mbbs/microbiology")) {
  seedMicrobiology()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
}
