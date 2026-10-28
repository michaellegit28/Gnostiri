import { prisma, seedMbbsCourse, type SubjectSeed } from "./spine";
import type { LessonContent } from "@/types/lesson";

const PLACEHOLDER: LessonContent = { blocks: [] };

export const OPHTHALMOLOGY: SubjectSeed = {
  id: "mbbs-ophthalmology",
  slug: "ophthalmology",
  title: "Ophthalmology",
  code: "OPHT 307",
  department: "Ophthalmology",
  level: 300,
  credits: 2,
  semester: "full",
  description:
    "Diseases of the eye: symptomatology and refraction, anterior and posterior segment disease, glaucoma and retinopathies, ocular emergencies, minor surgery, and the national programme for blindness (AIIMS semesters V, VI, VIII).",
  faculty: "clinical-medicine",
  prereqCourses: ["physiology-cell-and-general", "pathology-cell-injury-repair"],
  modules: [
    { slug: "eye-foundations", title: "M1 — Foundations, refraction & systemic disease" },
    { slug: "anterior-segment", title: "M2 — Anterior segment" },
    { slug: "posterior-segment-neuro", title: "M3 — Posterior segment & neuro-ophthalmology" },
    { slug: "emergencies-programme", title: "M4 — Emergencies, surgery & eye care programmes" },
  ],
  lessons: [
    { title: "Ocular microbiology & pathology", module: 1, estimatedMinutes: 35, authored: true, concept: { title: "Ocular microbiology and pathology", slug: "ocular-microbiology-pathology", summary: "The organisms that infect the eye, host defences, sterile technique and the pathology of common ocular disease.", blooms: "understand", minutes: 35, prereq: [] }, content: lesson1() as never },
    { title: "Symptomatology & refraction", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Symptomatology and refraction", slug: "symptomatology-refraction", summary: "Red eye, painful eye, gradual and sudden visual loss; refractive errors, accommodation and prescribing spectacles.", blooms: "apply", minutes: 40, prereq: ["ocular-microbiology-pathology"] }, content: lesson2() as never },
    { title: "Systemic disease & the eye", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Systemic disease and the eye", slug: "systemic-disease-eye", summary: "Diabetic, hypertensive, haematological and neurological manifestations in the eye, and ocular adverse effects of systemic drugs.", blooms: "analyze", minutes: 40, prereq: ["symptomatology-refraction"] }, content: lesson3() as never },
    { title: "Lids, lacrimal & conjunctiva", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Lids, lacrimal apparatus and conjunctiva", slug: "lids-lacrimal-conjunctiva", summary: "Blepharitis, chalazion, entropion, dacryocystitis and the conjunctivitides — allergic, bacterial, viral and neonatal.", blooms: "apply", minutes: 40, prereq: ["symptomatology-refraction"] }, content: lesson4() as never },
    { title: "Cornea, sclera & uveitis", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Cornea, sclera and uveitis", slug: "cornea-sclera-uveitis", summary: "Corneal ulcer and keratitis, abrasions, scleritis, and anterior, intermediate and posterior uveitis with systemic associations.", blooms: "analyze", minutes: 45, prereq: ["lids-lacrimal-conjunctiva"] }, content: lesson5() as never },
    { title: "Lens & cataract", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "Lens and cataract", slug: "lens-cataract", summary: "Cataract types, age-related and metabolic causes, surgical indications, small-incision and IOL surgery and post-operative care.", blooms: "apply", minutes: 40, prereq: ["symptomatology-refraction"] }, content: lesson6() as never },
    { title: "Glaucoma", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "Glaucoma", slug: "glaucoma", summary: "Aqueous dynamics, open- and angle-closure mechanisms, tonometry, field loss, medical and surgical control of intraocular pressure.", blooms: "analyze", minutes: 40, prereq: ["cornea-sclera-uveitis"] }, content: lesson7() as never },
    { title: "Retinopathies & retinal detachment", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "Retinopathies and retinal detachment", slug: "retinopathies-retinal-detachment", summary: "Diabetic and hypertensive retinopathy, retinal vascular occlusion, macular degeneration, breaks, detachment and their management.", blooms: "analyze", minutes: 45, prereq: ["systemic-disease-eye"] }, content: lesson8() as never },
    { title: "Optic nerve & squint", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "Optic nerve, squint and ocular neoplasms", slug: "optic-nerve-squint", summary: "Optic neuritis, atrophy and papilloedema; ocular motility disorders, amblyopia and retinoblastoma.", blooms: "analyze", minutes: 40, prereq: ["retinopathies-retinal-detachment"] }, content: lesson9() as never },
    { title: "Ocular emergencies & minor surgery", module: 4, estimatedMinutes: 40, authored: true, concept: { title: "Ocular emergencies and minor surgery", slug: "ocular-emergencies-minor-surgery", summary: "Chemical and physical injury, acute angle closure, hyphaema and the minor procedures — foreign body removal, syringing, cautery.", blooms: "apply", minutes: 40, prereq: ["cornea-sclera-uveitis"] }, content: lesson10() as never },
    { title: "Blindness programme & eye banking", module: 4, estimatedMinutes: 30, authored: true, concept: { title: "National blindness programme and eye banking", slug: "national-programme-eye-banking", summary: "Causes and magnitude of blindness, the national programme's delivery, cataract surgical outreach, and eye donation and banking.", blooms: "understand", minutes: 30, prereq: ["lens-cataract"] }, content: lesson11() as never },
  ],
  sbas: [],
}

// ---------------------------------------------------------------------------
// LESSON 1 — Ocular microbiology & pathology (fully authored)
// ---------------------------------------------------------------------------
function lesson1() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: list the organisms that commonly infect the eye and the ocular adnexa, and say which clinical clue points to each; distinguish the organisms of the normal ocular surface flora from true pathogens and explain why the healthy cornea is sterile; recognise the four patterns of ocular infection — conjunctivitis, keratitis, scleritis and endophthalmitis — by their presentation; describe the pathological changes of corneal ulceration, corneal scarring, metastatic endophthalmitis and ocular toxoplasmosis; and apply the sterile-technique rules that stop an eye clinic from transmitting infection between patients.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "None. This is the first lesson of the ophthalmology course and needs no prior medical study beyond the general microbiology and pathology taught in the pre-clinical phase (cell injury, inflammation, bacterial and viral classification).",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Ocular surface and its defences",
        text: "The exposed anterior surface of the eye — cornea, conjunctiva and tear film — protected by the lids and blink reflex, the washing and antimicrobial action of tears (lysozyme, lactoferrin, secretory IgA), the epithelial barrier, and the avascularity of the cornea itself, which limits the pathogens that can survive there.",
      },
      {
        type: "paragraph",
        text: "The eye is a small, exposed, transparent organ with almost no room for error, so infection behaves differently here than on the skin. Two facts drive everything that follows. First, the cornea is avascular and transparent, so it cannot afford the oedema and cellular exudate that fight infection elsewhere — visible inflammation in the cornea is already loss of sight. Second, the blood-ocular barriers (blood-aqueous and blood-retinal) keep systemic antibiotics and immune cells largely out, so an infection inside the eye is hard to treat from the bloodstream and is often diagnosed only by what the clinician can see at the slit lamp. That is why ophthalmology is a specialty of clinical signs: the organism is inferred from the pattern of disease before it is ever cultured.",
      },

      { type: "heading", level: 2, text: "Who lives on the eye, and who invades it" },
      {
        type: "table",
        headers: ["Organism", "Type", "Ocular disease it causes", "The distinguishing clue"],
        rows: [
          ["Staphylococcus aureus and Staph. epidermidis", "Gram-positive cocci", "Blepharitis, bacterial conjunctivitis, corneal ulcer, post-operative endophthalmitis", "The commonest organism of the lid margin; a normal commensal that becomes pathogenic when the surface is damaged"],
          ["Streptococcus pneumoniae", "Gram-positive diplococcus", "Acute bacterial conjunctivitis, corneal ulcer", "Classic cause of a rapidly spreading purulent conjunctivitis with a membrane"],
          ["Haemophilus influenzae", "Gram-negative coccobacillus", "Conjunctivitis, especially in children", "Blood-tinged discharge in a preschool child; often accompanies otitis media"],
          ["Pseudomonas aeruginosa", "Gram-negative rod", "Corneal ulcer in contact lens wearers; keratitis", "Painful grey infiltrate that melts the cornea within 24-48 hours; sinks into soft lenses and their cases"],
          ["Neisseria gonorrhoeae", "Gram-negative diplococcus", "Hyperacute gonococcal conjunctivitis", "Profuse purulent discharge within 12-24 hours of birth, corneal perforation within days — an ophthalmic emergency"],
          ["Chlamydia trachomatis (serotypes A-C and D-K)", "Intracellular bacterium", "Trachoma and inclusion conjunctivitis", "Follicles in the tarsal conjunctiva, superior pannus; the world's leading infective cause of blindness"],
          ["Herpes simplex virus type 1", "DNA virus", "Dendritic epithelial keratitis, disciform keratitis, recurrent disease", "A branching (dendritic) ulcer staining with fluorescein; reduced corneal sensation; recurrence along V1"],
          ["Varicella-zoster virus", "DNA virus", "Herpes zoster ophthalmicus: conjunctivitis, keratitis, uveitis", "Vesicles in the V1 dermatome with Hutchinson sign (lesions on the nose tip); severe neuralgic pain"],
          ["Adenovirus (types 8, 19, 37, 53)", "DNA virus", "Epidemic keratoconjunctivitis (EKC) and pharyngoconjunctival fever", "Watery discharge, follicles, pre-auricular lymphadenopathy; spreads through a clinic via tonometers"],
          ["Acanthamoeba species", "Free-living protozoan", "Acanthamoeba keratitis", "Pain far out of proportion to the signs in a contact lens wearer who rinsed lenses in tap water; a ring infiltrate"],
          ["Fusarium and Aspergillus species", "Filamentous fungi", "Fungal keratitis after vegetable/organic injury", "Dry, fluffy grey-white lesion with feathery margins and satellite infiltrates; indolent over weeks"],
          ["Toxoplasma gondii", "Protozoan", "The commonest cause of focal retinochoroiditis", "A creamy retinal lesion adjacent to an old pigmented scar — headlight in the fog; congenital and acquired"],
          ["Toxocara canis and cati", "Nematode larvae", "Ocular toxocariasis: granuloma, chronic endophthalmitis", "A child with pica and a white retinal granuloma; often mistaken for retinoblastoma"],
          ["Candida, Staphylococcus and Bacillus species", "Fungus and Gram-positive bacteria", "Endophthalmitis — exogenous (post-operative, post-traumatic) or endogenous (metastatic)", "Severely reduced vision with a hypopyon within days; Bacillus after a retained organic foreign body"],
          ["Methicillin-resistant Staph. aureus (MRSA)", "Gram-positive coccus", "Conjunctivitis, keratitis, blepharitis", "The same clinical picture as staphylococcal disease but unresponsive to standard topical antibiotics"],
        ],
      },
      {
        type: "paragraph",
        text: "Read the table as a pattern-recognition exercise rather than a list to memorise. The single most useful discriminator in ocular microbiology is the tempo of the disease. A hyperacute purulent discharge means a gonococcus; a slow, dry, feathery corneal lesion over weeks means a fungus; a dendritic staining ulcer means herpes simplex; and severe pain in a contact lens wearer with an unimpressive-looking cornea raises Acanthamoeba, because the organism tracks along the corneal nerves.",
      },

      { type: "heading", level: 2, text: "The healthy eye is not sterile — and that matters" },
      {
        type: "paragraph",
        text: "The conjunctival sac normally carries Staphylococcus epidermidis, Corynebacterium species, Moraxella and occasional Haemophilus. These are commensals held in check by the tear film. The cornea, by contrast, is effectively sterile: an intact epithelium with its tight junctions and constant renewing sheet of tears will not admit organisms. This is why an epithelial defect is the gateway to corneal infection — abrasion, contact lens overwear, exposure, anaesthesia, herpetic scarring and topical steroids all work by opening that door.",
      },
      {
        type: "question",
        prompt: "Which organisms make up the normal flora of the ocular surface, and what turns Staphylococcus epidermidis from a commensal into a pathogen?",
        answer: "Staphylococcus epidermidis is the commonest organism of the lid margin, alongside Corynebacterium species, Moraxella and occasional Haemophilus. It causes disease only when the barrier fails — an epithelial defect from contact lens overwear, exposure, anaesthesia or herpetic scarring — and it is also the commonest organism of post-operative endophthalmitis, carried from the patient's own lid flora.",
        explanation: "The cornea is effectively sterile while the conjunctival sac is not, so infection always requires a breach of the epithelium or an artificial route into the eye.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Never give a topical corticosteroid to an eye with an unsampled corneal epithelial defect. Steroids suppress the local inflammatory response that is containing the organism, and the classic disasters are a dendritic herpes ulcer that spreads across the cornea (geographic ulcer) and an unsuspected Acanthamoeba or fungal keratitis that perforates. If steroids are needed for immune keratitis, an infective cause must have been excluded first.",
      },

      { type: "heading", level: 2, text: "Worked example 1: the contact lens wearer with a grey spot" },
      {
        type: "paragraph",
        text: "A 22-year-old soft-lens wearer sleeps in her lenses and wakes with a red, painful right eye and poor vision. On the cornea is a small grey-white infiltrate with an overlying epithelial defect. This is a corneal ulcer until proven otherwise, and the organism to assume is Pseudomonas aeruginosa — the organism that lives in lens cases and destroys corneal stroma aggressively.",
      },
      {
        type: "table",
        headers: ["Step", "What is done", "Why"],
        rows: [
          ["Stop the lenses", "Lens wear ceases immediately; the case and remaining lenses are discarded", "The case is the reservoir; the cornea needs the epithelium to heal"],
          ["Scrape the ulcer", "A sterile needle or spatula scrapes the base and edge for Gram stain, KOH and culture (bacterial, fungal, Acanthamoeba)", "Antibiotics before sampling sterilise the culture and blind the treatment"],
          ["Start intensive antibiotics", "Fortified topical therapy — e.g. a fluoroquinolone hourly, or a cephalosporin plus an aminoglycoside in severe cases", "Drops, not tablets: the eye's blood-aqueous barrier keeps systemic drugs out"],
          ["Cycloplegic", "Homatropine or cyclopentolate", "Relieves ciliary spasm and prevents posterior synechiae"],
          ["Review at 24-48 hours", "Slit-lamp reassessment of infiltrate size and hypopyon", "A enlarging infiltrate despite treatment means a resistant or non-bacterial organism"],
        ],
      },
      {
        type: "question",
        prompt: "A farmer has three weeks of progressive pain after a thorn injury, with a dry, grey-white elevated corneal lesion with feathery margins, a small hypopyon and satellite infiltrates. Which organism fits, and what has probably happened to his treatment?",
        answer: "Fungal keratitis, classically from Fusarium or Aspergillus after vegetable injury: the indolent course, the dry elevated lesion with feathery margins and the satellites are the diagnostic triad. The likelihood is that a week of antibacterial drops has been given for nothing, and that any steroid has made the situation worse.",
        explanation: "The pattern of disease and the risk factor identify the organism before any culture result returns.",
      },
      {
        type: "question",
        prompt: "Why are corneal scrapings taken before the first dose of drops, and what happens if they are not?",
        answer: "Because even a single dose of antibiotic can sterilise the ulcer for culture, so the laboratory grows nothing and the diagnosis is made on the stains alone — or is simply missed. Sampling first preserves the microbiology, and the result can be narrowed or switched once it returns.",
        explanation: "Corneal scrapes for Gram stain, KOH and culture (bacterial, fungal and Acanthamoeba where available) are taken at the base and edge of the ulcer before any topical drug is instilled.",
      },

      { type: "heading", level: 2, text: "Worked example 2: a painful red eye after cataract surgery" },
      {
        type: "paragraph",
        text: "Three days after an uneventful phacoemulsification a patient reports increasing pain and vision loss; the eye is injected, there is fibrin in the anterior chamber and a hypopyon is forming. This is acute post-operative endophthalmitis, of which the commonest organism is Staphylococcus epidermidis carried from the patient's own lid flora. Management is urgent: a vitreous tap and intravitreal antibiotics (vancomycin with ceftazidime or amikacin) in the operating theatre, because the blood-retinal barrier prevents systemic antibiotics from reaching a therapeutic level inside the eye.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Any increased pain, redness or falling vision after intraocular surgery is endophthalmitis until proven otherwise. The commonest error is to treat it as post-operative inflammation and give more steroid drops, which accelerates the infection.",
      },

      { type: "heading", level: 2, text: "Pathology of the common ocular lesions" },
      {
        type: "table",
        headers: ["Lesion", "Pathological process", "What the clinician sees", "Consequence if untreated"],
        rows: [
          ["Corneal ulcer", "Neutrophil infiltration and proteolytic digestion of stroma (stromal melting); epithelial defect; hypopyon in severe cases", "Grey stromal infiltrate with fluorescein staining over it; the eye is red and painful with photophobia", "Perforation, scarring (leucoma), vascularisation, and secondary glaucoma"],
          ["Corneal scar (leucoma / macula)", "Irregular collagen laid down by activated keratocytes replacing the ordered stromal lamellae", "A white or grey punctate opacity that blocks vision if central", "Permanent loss of acuity; only a corneal graft can restore clear media"],
          ["Vascularised cornea (pannus)", "Growth of limbal vessels into normally avascular cornea under the influence of VEGF and chronic inflammation", "A fan of vessels advancing across the cornea (trachoma) or inferior pannus in contact lens overwear", "Chronic haze, lipid deposition and progressive opacification"],
          ["Metastatic (endogenous) endophthalmitis", "Haematogenous seeding of the choroid and retina in septicaemia or immunosuppression (Candida, Streptococcus, Staph. aureus)", "White chorioretinal lesions or a vitreous abscess; the eye is white externally", "Rapid loss of the eye unless prompt systemic and intravitreal treatment"],
          ["Ocular toxoplasmosis", "Necrotising retinochoroiditis adjacent to a dormant tissue cyst, with an intense vitreous inflammatory reaction", "A creamy white retinal focus with an overlying vitreous haze, next to an old pigmented scar", "Macular destruction with permanent central visual loss"],
          ["Phthisis bulbi", "End-stage organisation after inflammation, trauma or failed surgery — ciliary body failure, hypotony, shrinkage", "A soft, small, disorganised eye", "Blind, cosmetically poor eye; enucleation may be needed for comfort"],
        ],
      },
      {
        type: "paragraph",
        text: "Notice what these have in common: in every case the tissue that matters is transparent, avascular and non-regenerating. Corneal stroma heals by scar rather than by restoration, so the pathological endpoint of most microbial keratitis is permanent visual impairment rather than recovery. That is the argument for aggressive early treatment and for the referral thresholds that follow in later lessons.",
      },

      { type: "heading", level: 2, text: "Sterile technique in the eye clinic" },
      {
        type: "table",
        headers: ["Risk", "How transmission happens", "Prevention"],
        rows: [
          ["Tonometer transmission", "Applanation prism touched to the cornea or tears; adenovirus survives on the surface", "Wipe the prism with 70 per cent alcohol or dilute bleach, dry it fully, and use a single-use tip where available; break outbreaks by strict disinfection"],
          ["Shared drops and near-patient items", "Bottle tips touching the eye, lids or lashes; reused bottles between patients", "Single-patient bottles only; never let a dropper touch the eye; discard the bottle once opened beyond its expiry"],
          ["Intraocular instruments", "Inadequate autoclaving or chemical sterilisation of cannulas, IOLs and handles", "Validated sterilisation, sterile field, antibiotic prophylaxis into the anterior chamber where used"],
          ["Hands and surfaces", "Epidemic keratoconjunctivitis spreads by fomites from hands to the next patient", "Hand washing or alcohol rub between every patient, especially in adenovirus season"],
          ["Contact lens practice", "Contaminated lens cases and solution", "Rub-and-rinse, fresh solution, never top up old solution, never rinse in tap water"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "An outbreak of epidemic keratoconjunctivitis that closes a clinic is a failure of technique, not of luck: the virus survives on tonometer heads, slit lamps, door handles and clinicians' hands, and survives alcohol poorly but bleach well.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "question",
        prompt: "An outbreak of redness, watering and follicles with pre-auricular lymphadenopathy closes an eye clinic, traced to the tonometer. Which organism causes it and what prevents it?",
        answer: "Adenovirus (types 8, 19, 37 or 53) causing epidemic keratoconjunctivitis — a follicular conjunctivitis with watery discharge, pre-auricular nodes and corneal involvement. Prevention is strict disinfection of tonometer heads and hands between patients, with dilute bleach where alcohol is unreliable, and single-use devices where available.",
        explanation: "An epidemic in a clinic is a failure of technique rather than of luck; the organism survives on fomites and travels on the examiner's hands.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Dismissing any red eye as conjunctivitis. The three features that make an eye dangerous are reduced vision, photophobia and ciliary (circumcorneal) injection; pain that is deep rather than surface-irritation suggests keratitis, uveitis or angle closure. A purulent discharge with normal vision is conjunctivitis until an exam proves otherwise — the reverse assumption is how keratitis is missed.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Starting steroids before an infective cause has been excluded. Topical steroids turn a dendrite into a geographic ulcer, permit fungal and acanthamoebal keratitis to perforate, and can reactivate herpetic disease. If steroid is required for immune keratitis, the epithelium must be intact and infection excluded first.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating a corneal ulcer with tablets. The blood-aqueous and blood-retinal barriers exclude most systemic antibiotics, so the definitive treatment for microbial keratitis is fortified topical drops; systemic therapy is added only for scleral, orbital or intraocular spread, or for gonococcal and chlamydial conjunctivitis.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Missing the organism hidden in the case or the tap water. Ask every lens wearer where they store and rinse their lenses, and whether they sleep in them; ask every farmer or gardener about an organic injury; the history gives the organism more often than any investigation.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does the healthy cornea remain sterile while the conjunctival sac carries commensals?",
        answer: "The conjunctival sac carries Staph. epidermidis, Corynebacterium, Moraxella and occasional Haemophilus, held in check by the tear film (lysozyme, lactoferrin and secretory IgA) and the flushing action of tears and blink. The cornea is kept sterile by an intact epithelium with tight junctions, by constant tear renewal, by its avascularity, and by the absence of a nutrient-rich surface for organisms to colonise.",
        explanation: "The moment the epithelial barrier is breached — abrasion, overwear, exposure, anaesthesia — organisms can attach to exposed stroma and keratitis begins.",
      },
      {
        type: "question",
        prompt: "A contact lens wearer has severe pain with a relatively quiet-looking cornea and a faint ring infiltrate. What is the likely organism and why is the pain disproportionate?",
        answer: "Acanthamoeba, in a patient who rinsed or stored lenses in tap water or swam in them. The pain is out of proportion to the visible signs because the organism invades along the corneal nerves (perineural infiltration), producing a neuritis-like pain, and the visible infiltrate appears late — often as a ring.",
        explanation: "This combination is the classic trap: the quiet-looking eye is dismissed and treatment is delayed until the cornea is unsalvageable. Acanthamoebae are free-living protozoa found in tap water, soil and swimming pools.",
      },
      {
        type: "question",
        prompt: "Why is a topical antibiotic alone inadequate for gonococcal conjunctivitis?",
        answer: "Because gonococcal conjunctivitis is a systemic infection of the ocular surface with a high risk of corneal perforation within days; the organism is also commonly present in the pharynx and genital tract, and topical therapy does not treat the reservoir. Treatment requires a single dose of systemic ceftriaxone with copious saline irrigation and topical antibiotic cover, and the sexual-health implications are followed up.",
        explanation: "Gonococcal and chlamydial conjunctivitis are the two conjunctivitides where systemic therapy is mandatory.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A soft contact lens wearer who sleeps in her lenses presents with a painful red eye and a greyish corneal infiltrate with an overlying epithelial defect. Which organism is most likely and what is the appropriate first management?",
        options: [
          "Pseudomonas aeruginosa — stop lens wear, scrape the ulcer for microscopy and culture, and start intensive topical fluoroquinolone antibiotic every 30-60 minutes",
          "Staphylococcus epidermidis — give topical corticosteroid with a broad-spectrum antibiotic for five days and continue lens wear",
          "Acanthamoeba species — start oral antiprotozoal therapy alone and observe for two weeks",
          "Herpes simplex virus — give topical corticosteroid alone to reduce corneal inflammation",
        ],
        correctIndex: 0,
        explanation: "Overnight soft lens wear is the classic risk factor for Pseudomonas aeruginosa keratitis, which produces a rapidly progressive grey infiltrate and can perforate within days. Lenses are stopped, the ulcer is scraped before treatment, and intensive topical fluoroquinolone is given. Steroids are avoided in suspected infection; Acanthamoeba follows water exposure with pain out of proportion; herpes simplex shows a dendritic stain.",
      },
      {
        type: "mcq",
        stem: "A patient has increasing pain and falling vision three days after cataract surgery, with fibrin in the anterior chamber and a forming hypopyon. Which organism is the most likely cause and what is the correct treatment?",
        options: [
          "Staphylococcus epidermidis — urgent vitreous tap with intravitreal antibiotics (vancomycin plus ceftazidime or amikacin)",
          "Adenovirus — intensive topical steroid and reassurance",
          "Pseudomonas aeruginosa — oral ciprofloxacin for two weeks",
          "Toxoplasma gondii — oral pyrimethamine and sulfonamide",
        ],
        correctIndex: 0,
        explanation: "Acute post-operative endophthalmitis is most often due to Staph. epidermidis from the patient's own lid flora, and the blood-retinal barrier means systemic antibiotics reach inadequate levels — treatment is an urgent vitreous tap and intravitreal antibiotics. More steroid accelerates the infection.",
      },
      {
        type: "mcq",
        stem: "Which statement about topical corticosteroids in ocular infection is correct?",
        options: [
          "They should be started in every red eye to reduce inflammation and scarring",
          "They are safe in bacterial keratitis provided an antibiotic is given first",
          "They can convert a dendritic herpes simplex ulcer into a geographic ulcer and must not be given before an infective cause is excluded",
          "They eliminate Acanthamoeba from the corneal stroma",
        ],
        correctIndex: 2,
        explanation: "Steroids suppress the local inflammatory response containing the organism: in herpetic disease they permit viral replication across the cornea (geographic ulceration), and they worsen fungal and acanthamoebal keratitis. Antibiotics do not neutralise the risk; infection must be excluded first.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The organisms that infect the eye are mostly the same organisms that live on its surface: Staphylococcus and Streptococcus, Haemophilus, Pseudomonas in lens wearers, Neisseria and Chlamydia in the newborn, adenovirus and herpes simplex as the important viruses, and fungi and Acanthamoeba after organic or water exposure. The cornea is avascular and normally sterile, so a breach of the epithelium is the gateway to keratitis, and the eye's blood-ocular barriers mean treatment is topical, fortified and intensive. Infection inside the eye — endophthalmitis — is a surgical emergency, and the hallmarks of the dangerous eye are reduced vision, photophobia and circumcorneal injection.",
      },
      {
        type: "paragraph",
        text: "Next: how patients actually present. You will learn to take an eye history and perform a basic eye examination — visual acuity, the pupils and the swinging-light test, the red reflex, direct ophthalmoscopy — so that every disease in this course can be recognised rather than guessed.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 2 — Symptomatology & refraction (fully authored)
// ---------------------------------------------------------------------------
function lesson2() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: take a structured ophthalmic history covering red eye, painful eye, sudden and gradual loss of vision, floaters, flashes and double vision; separate the causes of the red eye using vision, photophobia and the pattern of injection; describe refraction and accommodation and the three refractive errors that need correction; perform and interpret the pinhole test; record visual acuity in a way another clinician can act on; and recognise the symptom patterns that demand same-day referral.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (Ocular microbiology and pathology). You need to know that a purulent discharge with normal vision is conjunctivitis, while reduced vision and photophobia point at keratitis or intraocular disease.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Refraction",
        text: "The bending of light as it passes from one medium to another. In the eye, refraction occurs at the air-tear-cornea interface and at the lens, and its purpose is to focus a parallel beam of light from a distant object onto the photoreceptors of the macula.",
      },
      {
        type: "paragraph",
        text: "The eye is a camera: a lens system, a diaphragm (the iris), a light-sensitive film (the retina) and a cable to the brain (the optic nerve). Symptoms arise when one of those four parts fails, and every eye complaint maps onto one of them. Blurred vision is a lens (refractive) problem or a film (retina) problem; a curtain across the vision is the film peeling off (retinal detachment); double vision is the pointing system (ocular muscles or nerves) failing; and halos and glare are the optical media losing transparency (corneal oedema or cataract). Learn the camera and the symptoms stop being a list to memorise.",
      },

      { type: "heading", level: 2, text: "The optical system of the eye" },
      {
        type: "table",
        headers: ["Component", "Optical contribution", "Clinical consequence of failure"],
        rows: [
          ["Cornea", "About 43 dioptres — two thirds of the eye's total refractive power, at the air-cornea interface", "Astigmatism if the curvature is irregular; clouding and glare in oedema, scarring or dystrophy"],
          ["Aqueous humour", "Refractive index 1.336; loss of the normal pressure gradient affects optics and perfusion", "Turbidity with cells or blood; raised intraocular pressure damages the optic nerve"],
          ["Lens", "About 15-20 dioptres, variable — provides the change in power needed for near focus", "Cataract when it opacifies; loss of accommodation with age (presbyopia); dislocation in trauma and Marfan syndrome"],
          ["Vitreous gel", "Keeps the retina apposed and the optical path clear", "Opacification from haemorrhage or inflammatory cells; collapse causes floaters, flashes and traction detachment"],
          ["Retina and macula", "The photoreceptor layer; the fovea gives central high-resolution vision", "Loss of central vision in macular disease; field loss in retinal or optic nerve disease"],
          ["Optic nerve", "Carries one million axons per eye to the chiasm and visual cortex", "Field defects and loss of acuity, colour vision and contrast sensitivity"],
        ],
      },

      { type: "heading", level: 2, text: "The symptoms and what they mean" },
      {
        type: "table",
        headers: ["Symptom", "Mechanism", "The conditions that produce it"],
        rows: [
          ["Red eye", "Dilatation of conjunctival, ciliary, episcleral or scleral vessels", "Conjunctivitis, keratitis, uveitis, angle closure, episcleritis, scleritis, trauma, subconjunctival haemorrhage"],
          ["Pain and foreign-body sensation", "Trigeminal (V1) nerve endings in cornea, iris and sclera", "Corneal abrasion, ulcer, keratitis, uveitis, acute angle closure, scleritis, optic neuritis (pain on movement)"],
          ["Photophobia", "Iris and ciliary muscle spasm, or a sensitive exposed corneal nerve ending", "Anterior uveitis, keratitis (including measles and rubella in children), migraine, meningitis"],
          ["Discharge", "Mucus and pus from goblet cells and conjunctival vessels", "Bacterial conjunctivitis (purulent), viral or allergic (watery or stringy), chlamydial (mucopurulent with follicles)"],
          ["Watering (epiphora)", "Reflex lacrimation from surface irritation, or blocked drainage", "Foreign body, entropion with lashes rubbing, blocked nasolacrimal duct, dry eye with overflow"],
          ["Blurred vision, sudden and painless", "Clouding of the media, retinal or optic nerve event", "Vitreous haemorrhage, retinal detachment, retinal vein occlusion, central retinal artery occlusion, wet macular degeneration"],
          ["Blurred vision, sudden and painful", "Corneal, iris or pressure event", "Acute angle closure, keratitis, uveitis, orbital disease"],
          ["Blurred vision, gradual and painless", "Progressive opacification or retinal degeneration", "Cataract, refractive error, open-angle glaucoma, diabetic retinopathy, macular degeneration"],
          ["Floaters", "Degenerating vitreous collagen or blood/inflammatory cells casting shadows", "Physiological collapse of the vitreous, uveitis, vitreous haemorrhage, retinal tear"],
          ["Flashes (photopsia)", "Mechanical traction on the retina producing a false sensation of light", "Posterior vitreous detachment, retinal tear, retinal detachment"],
          ["A curtain or shade across the vision", "A separating retina stops functioning", "Rhegmatogenous retinal detachment — an ophthalmic emergency"],
          ["Distortion (metamorphopsia)", "Distortion of the foveal photoreceptor mosaic by fluid or a membrane", "Wet age-related macular degeneration, diabetic macular oedema, macular hole"],
          ["Halos around lights", "Diffraction by a swollen cornea or a lens with focal opacity", "Acute angle closure (corneal oedema), cataract, corneal oedema"],
          ["Double vision (diplopia)", "Misalignment of the two eyes, or a monocular optical defect", "Cranial nerve palsy (III, IV, VI), thyroid eye disease, myasthenia gravis, uncorrected astigmatism (monocular)"],
          ["Loss of contrast and colour", "Optic nerve disease", "Optic neuritis, compressive and ischaemic optic neuropathy, toxic neuropathy"],
        ],
      },

      { type: "heading", level: 2, text: "The red eye: the differential that matters most" },
      {
        type: "paragraph",
        text: "A red eye is the commonest emergency presentation in ophthalmology and the one most often mismanaged. The diagnosis is made with three questions and two observations: Is the vision reduced? Is there photophobia? Is the redness circumcorneal (ciliary) or diffuse and peripheral (conjunctival)? Is the discharge purulent or watery? What is the pupil doing? A purulent discharge with normal vision and a normal pupil is conjunctivitis; everything else on this table needs a slit lamp or a same-day referral.",
      },
      {
        type: "table",
        headers: ["Diagnosis", "Vision", "Pain", "Injection and pupil", "Discharge", "Immediate action"],
        rows: [
          ["Bacterial conjunctivitis", "Normal", "Gritty, not deep", "Diffuse peripheral injection, normal pupil", "Purulent, lids stuck", "Topical antibiotic, review in 48 hours"],
          ["Viral / adenoviral conjunctivitis", "Normal or mildly reduced", "Gritty, itchy", "Diffuse injection, follicles, pre-auricular node", "Watery", "Hygiene advice, no steroid, analgesia; highly contagious"],
          ["Keratitis / corneal ulcer", "Reduced", "Marked, with photophobia", "Circumcorneal injection; a white infiltrate on the cornea", "Reflex watering", "Slit lamp, scrape and culture, intensive topical antibiotic, same-day referral"],
          ["Anterior uveitis (iritis)", "Reduced", "Deep ache, photophobia", "Circumcorneal injection with a small, sluggish pupil (posterior synechiae)", "Watery", "Urgent: topical steroid with a cycloplegic after excluding infection"],
          ["Acute angle closure", "Markedly reduced", "Severe, with nausea and vomiting", "Circumcorneal injection, mid-dilated fixed oval pupil, cloudy cornea, rock-hard eye", "Watering", "Emergency: pressure lowering, pilocarpine, laser iridotomy"],
          ["Scleritis", "Normal or reduced", "Severe, deep, boring ache waking the patient", "Deep violaceous sectoral redness; tender to touch", "None", "Systemic work-up for vasculitis; systemic anti-inflammatory therapy"],
          ["Episcleritis", "Normal", "Mild or none", "Sectoral salmon-pink injection that blanches with phenylephrine", "None", "Reassurance; topical or oral NSAID if uncomfortable"],
          ["Subconjunctival haemorrhage", "Normal", "None", "A confluent blood-red patch, no injection", "None", "Check blood pressure and clotting; reassure if isolated"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "A red eye with a small, irregular pupil and a deeply aching pain is anterior uveitis until proven otherwise — do not treat it with antibiotics and discharge. A red eye with a mid-dilated fixed pupil, a cloudy cornea and severe pain with vomiting is acute angle closure, and every hour of raised pressure risks permanent optic nerve damage.",
      },

      { type: "heading", level: 2, text: "Sudden versus gradual loss of vision" },
      {
        type: "table",
        headers: ["Pattern", "Causes", "Why it matters"],
        rows: [
          ["Sudden, painless, in seconds", "Central retinal artery occlusion; amaurosis fugax (transient); vitreous haemorrhage", "Artery occlusion is a stroke-equivalent with a 90-minute window for treatment"],
          ["Sudden, painless, over minutes to days", "Retinal detachment, retinal vein occlusion, wet macular degeneration, optic neuritis, ischaemic optic neuropathy", "Detachment and occlusion need same-week referral; neuritis needs MRI and neurology"],
          ["Sudden, painful", "Acute angle closure, keratitis, uveitis, orbital cellulitis, giant cell arteritis with ischaemic optic neuropathy", "Pain with visual loss is an emergency in every case"],
          ["Gradual, over months to years", "Cataract, refractive error, open-angle glaucoma, diabetic retinopathy, dry macular degeneration, corneal dystrophy", "The silent thief: glaucoma produces no early symptom and is found on screening or by accident"],
        ],
      },

      {
        type: "question",
        prompt: "A patient reports three days of flashing lights and floaters, then a shade advancing across the upper field of one eye. Why is this urgent rather than routine?",
        answer: "Because photopsia and new floaters are symptoms of vitreous traction on the retina, and a field defect means the retina has already separated — a rhegmatogenous retinal detachment. A macula-on detachment is surgically repaired within days, because the prognosis falls sharply once the macula detaches; reviewing it in three months converts a treatable eye into a blind one.",
        explanation: "The order of symptoms matters: flashes, floaters, then a curtain. The later the symptom, the more the eye has already done.",
      },
      { type: "heading", level: 2, text: "Refractive errors and their correction" },
      {
        type: "definition",
        term: "Emmetropia",
        text: "The state in which parallel rays from a distant object are focused precisely on the retina with the eye at rest — no refractive error and no correction required.",
      },
      {
        type: "table",
        headers: ["Refractive state", "Mechanism", "Symptom", "Correction"],
        rows: [
          ["Emmetropia", "Refractive power matches axial length; total power about 58-60 dioptres, axial length about 24 mm", "None", "None required"],
          ["Myopia (short-sightedness)", "Axial length too long or corneal/lenticular power too great, so the image focuses in front of the retina", "Distant objects blurred, near vision clear; squinting improves acuity; headache after board work", "Concave (minus, diverging) spherical lenses; contact lenses; refractive surgery"],
          ["Hypermetropia (long-sightedness)", "Axial length too short or power too weak, so the image would focus behind the retina; the patient focuses by accommodating", "Blur worse for near; headache and eyestrain (asthenopia) after reading; in children, accommodative convergent strabismus", "Convex (plus, converging) spherical lenses; the full plus may be withheld if it would break a phoria"],
          ["Astigmatism", "The cornea (or lens) has different curvatures in different meridians, like a rugby ball rather than a football", "Blur and distortion at all distances; ghosting and monocular diplopia; uncorrected astigmatism causes headache", "Toric (cylindrical) lenses with an axis; regular astigmatism is correctable, irregular is not"],
          ["Presbyopia", "Age-related loss of lens elasticity and ciliary muscle strength, so accommodation fails", "Difficulty with near work after age 40-45; the patient holds print further away", "Convex reading addition of +1 to +3 dioptres (bifocals, progressives, reading glasses)"],
          ["Aphakia", "Absence of the crystalline lens after surgery without an intraocular lens", "Total loss of accommodation, a very high plus prescription, and magnification of the image", "Intraocular lens implant at surgery, or aphakic spectacles or contact lenses"],
        ],
      },
      {
        type: "definition",
        term: "Accommodation",
        text: "The increase in the refractive power of the lens that occurs when the ciliary muscle contracts, relaxing the suspensory zonules and allowing the elastic lens to become more convex — the mechanism that brings a near object into focus. Its range collapses with age, producing presbyopia.",
      },
      {
        type: "paragraph",
        text: "Accommodation is why the two refractive errors behave differently. A young hypermetrope can accommodate away their long-sightedness and see clearly at distance and near, at the price of constant ciliary effort and the headache of asthenopia; an elderly hypermetrope cannot, and needs the plus lens. A myope never has to accommodate for distance and so develops presbyopia later in life and reads early in life — the classic reason a myopic patient takes off her glasses to read.",
      },

      { type: "heading", level: 2, text: "The examination: acuity, pinhole, pupils, red reflex" },
      {
        type: "paragraph",
        text: "Visual acuity is the vital sign of the eye and must be recorded for each eye separately, with the patient's own glasses or a pinhole if none are available. A Snellen chart is read at 6 metres and recorded as 6/6 (normal), 6/9, 6/12, and so on down to counting fingers, hand movements, perception of light and no perception of light. Record the pinhole result too: it tells you whether the deficit is optical.",
      },
      {
        type: "table",
        headers: ["Test", "How it is done", "What it tells you"],
        rows: [
          ["Snellen visual acuity", "Chart at 6 m, each eye covered in turn, best correction worn", "Whether vision is normal, and whether the cause is optical or neural"],
          ["Pinhole test", "A 1-2 mm aperture is held before the eye, eliminating the peripheral rays", "Improves acuity in uncorrected refractive error; no improvement implies retinal or optic nerve disease"],
          ["Swinging-light test", "A bright light is alternated between the eyes; the pupil is watched during the direct and consensual response", "Detects a relative afferent pupillary defect — optic nerve or severe retinal disease"],
          ["Red reflex", "Viewed with a direct ophthalmoscope at arm's length in a dim room", "A white or absent reflex means cataract, retinoblastoma or a dense vitreous haemorrhage"],
          ["Direct ophthalmoscopy", "At 15 cm, then close, with the same ophthalmoscope eye as the patient's examining eye", "Disc, vessels and macula — but it is a screening tool; retinal detachment and peripheral disease need dilated indirect examination"],
          ["Confrontation fields", "Fingers in the four quadrants of each eye, patient comparing sides", "Detects the gross field defects of glaucoma, stroke and retinal detachment"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Record vision in each eye separately, in writing, at every visit — before drops, before the patient is dilated, and before any discussion of the diagnosis. Acuity is the only number that allows the next clinician to tell whether the eye is improving or deteriorating.",
      },

      { type: "heading", level: 2, text: "Worked example 1: the schoolchild at the board" },
      {
        type: "paragraph",
        text: "A 10-year-old can see clearly at 20 cm but complains of headache and copying errors at the board. Acuity is 6/6 in each eye with a pinhole, 6/60 unaided. This is simple myopia: the point of clear focus sits in front of the retina, so distance vision is blurred and near vision is perfect. The correction is a concave (minus) spherical lens, prescribed after cycloplegic refraction in a child so that accommodation is not masking the true error. Secondary headache at school is the classic presentation that is otherwise put down to inattention.",
      },
      {
        type: "question",
        prompt: "Why is a pinhole useful in deciding whether a patient's blur is optical?",
        answer: "Because a pinhole blocks the peripheral rays that are defocused by a refractive error, so only the central paraxial rays reach the retina; this increases the depth of focus and improves acuity in uncorrected refractive error. If the blur comes from the retina or optic nerve, the pinhole does not help — which redirects the clinician to a posterior cause.",
        explanation: "Pinhole improvement = optical cause. No improvement with pinhole = look at the retina, optic nerve and visual pathway.",
      },

      { type: "heading", level: 2, text: "Worked example 2: the 48-year-old with the arms extension" },
      {
        type: "paragraph",
        text: "A 48-year-old holds her newspaper at arm's length and reports headache after an evening of reading. Distance acuity is 6/6 with no correction. This is presbyopia — the lens has lost the elasticity that made it more convex for near work, and the near point has receded beyond comfortable reading distance. The correction is a convex reading addition of +1 to +3 dioptres for the near task alone; because distance vision is unaffected, she needs reading glasses, bifocals or a progressive lens, and the addition increases with age every few years.",
      },
      {
        type: "question",
        prompt: "Why does a myope read early and a hypermetrope complain early?",
        answer: "A myope sees clearly at his far point (the far point of a myope is at a finite distance in front of the eye), so near vision needs less accommodation and presbyopic symptoms appear later. A hypermetrope must accommodate even for distance vision, so the sustained ciliary effort of reading produces asthenopia and headache decades earlier.",
        explanation: "The far point of the eye explains the age at which reading fails: the nearer the far point, the better the unaided near vision.",
      },

      { type: "heading", level: 2, text: "Prescribing spectacles: the practical rules" },
      {
        type: "table",
        headers: ["Rule", "Why"],
        rows: [
          ["Minus (concave) lenses correct myopia", "A diverging lens moves the focal point backwards onto the retina"],
          ["Plus (convex) lenses correct hypermetropia and presbyopia", "A converging lens adds power, moving the focal point forwards onto the retina"],
          ["Cylinders carry an axis (0 to 180 degrees)", "The axis is the meridian of no cylinder power; an axis error rotates the correction and blurs vision"],
          ["A child's full hyperopic correction may be reduced deliberately", "Full plus can break a controlled accommodative esotropia and produce diplopia"],
          ["Cycloplegic refraction in children", "Accommodation masks the true refractive error; cyclopentolate or atropine reveals it"],
          ["Refraction is repeated after cataract surgery", "The intraocular lens power calculation determines whether the eye is left myopic, emmetropic or deliberately myopic"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Giving a bottle of chloramphenicol to a red eye with reduced vision and photophobia. Conjunctivitis does not reduce vision and does not cause photophobia; those two findings mean keratitis, uveitis or angle closure, and a topical antibiotic without examination of the cornea and pupil wastes the only safe window for treatment.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Prescribing plus lenses for a myope, or minus lenses for a hypermetrope, because of confusion about the sign convention. Myopia = minus (concave); hypermetropia and presbyopia = plus (convex). The mnemonic is the shape of the lens: a minus lens is thin in the middle like a cave, and it diverges light.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Attributing a sudden loss of vision to a refractive error without doing a pinhole test and examining the fundus. A pinhole that does not improve the vision, or a poor red reflex, means the cause is inside the eye and demands urgent referral.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Recording vision as 'seems better' rather than a measured acuity. Without a recorded number in each eye, a deteriorating cataract or a rising intraocular pressure is invisible to everyone, including the patient.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A patient has a red eye, a purulent discharge, normal vision 6/6 in the affected eye and no photophobia. What is the most likely diagnosis, and what two findings would make you worried?",
        answer: "Bacterial conjunctivitis. The two worrying findings would be any reduction in visual acuity or any photophobia — both imply corneal, uveal or pressure pathology rather than a surface infection; ciliary (circumcorneal) injection rather than diffuse injection is the third warning sign.",
        explanation: "Conjunctivitis is a diagnosis made by exclusion of the features of dangerous red eye, not by the presence of discharge.",
      },
      {
        type: "question",
        prompt: "A 60-year-old has had a week of flashing lights and floaters, then a shade descending from above across the vision of one eye. What has happened and what is the urgency?",
        answer: "Vitreous detachment with a retinal tear has produced a rhegmatogenous retinal detachment. This is an eye emergency: the patient needs urgent (same-day) ophthalmic referral for indirect ophthalmoscopy and surgical repair, because the macula is still attached and can be saved.",
        explanation: "Photopsia and new floaters are the symptoms of traction on the retina; a field defect means the retina has already separated.",
      },
      {
        type: "question",
        prompt: "What does an improved pinhole acuity demonstrate, and what does a failed pinhole test suggest?",
        answer: "An improvement means the blur is optical — uncorrected or wrongly corrected refractive error, or an irregular corneal surface — and can be helped by refraction. No improvement means the deficit lies at the retina, optic nerve or visual pathway, and needs a dilated fundus examination or neurological investigation.",
        explanation: "The pinhole increases depth of focus by eliminating peripheral rays, and only corrects what is an optical problem.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A schoolchild can see clearly at 20 cm but complains of headaches at the board. Which correction is appropriate for myopia, and what does a pinhole test tell you?",
        options: [
          "Concave (minus, diverging) spherical lenses move the focal point back onto the retina, and a pinhole improves vision in uncomplicated refractive blur",
          "Convex (plus, converging) spherical lenses move the focal point back onto the retina, and a pinhole worsens vision in refractive blur",
          "Cylindrical (toric) lenses alone correct spherical refractive error, and a pinhole is contraindicated in children",
          "Myopia is corrected surgically only, and a pinhole distinguishes presbyopia from axial elongation",
        ],
        correctIndex: 0,
        explanation: "Myopia arises from excessive axial length or refractive power, so the image focuses in front of the retina and is corrected with concave (minus) lenses that diverge light before it enters the eye. A pinhole improves acuity in uncorrected refractive blur by increasing depth of focus, but not in retinal or optic nerve disease.",
      },
      {
        type: "mcq",
        stem: "Which combination of findings is most consistent with acute angle-closure glaucoma?",
        options: [
          "Purulent discharge, normal vision, a normal pupil and a soft eye",
          "Severe pain with vomiting, halos around lights, a cloudy cornea, a mid-dilated fixed pupil and a hard eye",
          "Watery discharge, follicles, a pre-auricular node and normal acuity",
          "Deep boring pain that wakes the patient, with a sectoral violaceous redness and a normal pupil",
        ],
        correctIndex: 1,
        explanation: "Acute angle closure presents with severe ocular pain, a sudden fall in vision with halos from corneal oedema, a cloudy cornea, a mid-dilated vertically oval pupil and a high intraocular pressure, often with headache, nausea and vomiting. Purulent discharge with normal vision is bacterial conjunctivitis; follicles with a pre-auricular node are adenoviral conjunctivitis; deep boring pain with a sectoral violaceous redness is scleritis.",
      },
      {
        type: "mcq",
        stem: "A 48-year-old with 6/6 distance vision holds her newspaper at arm's length and gets headache after reading. What is the mechanism and the correction?",
        options: [
          "Myopia — concave lenses for distance use",
          "Astigmatism — a cylindrical lens with an axis at 90 degrees",
          "Presbyopia from loss of lens elasticity and ciliary power — a convex reading addition of +1 to +3 dioptres",
          "Hypermetropic presbyopia — a concave lens for near work",
        ],
        correctIndex: 2,
        explanation: "Presbyopia is the age-related loss of accommodation from reduced lens elasticity and ciliary muscle strength; the near point recedes and near work becomes blurred. The correction is a plus (convex) near addition, increased every few years. Distance vision is unaffected, so the patient needs reading glasses, bifocals or progressive lenses.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Eye symptoms follow the anatomy of the camera: refractive error and cataract blur vision without pain, retinal disease produces floaters, flashes and field defects, and dangerous red eyes are identified by reduced vision, photophobia and circumcorneal injection. Emmetropia is the matched state of power and axial length; myopia is corrected with concave (minus) lenses, hypermetropia and presbyopia with convex (plus) lenses, and regular astigmatism with a cylinder that carries an axis. Visual acuity in each eye, and a pinhole where it is reduced, is the first measurement in every eye patient.",
      },
      {
        type: "paragraph",
        text: "Next: the eye as a window on systemic disease. Diabetes mellitus, hypertension, thyroid disease, haematological disorders and neurological disease all announce themselves in the fundus or the orbit, and the ophthalmologist is often the first clinician to see them.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 3 — Systemic disease & the eye (fully authored)
// ---------------------------------------------------------------------------
function lesson3() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: explain why the eye is examined as part of the assessment of any systemic disease; describe the ocular manifestations of diabetes mellitus, hypertension, thyroid disease, haematological disorders, neurological disease and infection; recognise the ocular adverse effects of the common systemic drugs — corticosteroids, antimalarials, ethambutol, amiodarone and the anticholinergics; and describe what to look for on fundoscopy in a patient with a raised blood pressure, a haemoglobinopathy or an unexplained visual symptom.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 2 (Symptomatology and refraction). You need to be able to record visual acuity in each eye, perform a swinging-light test and interpret a pinhole, because those measurements make an eye symptom attributable to a systemic cause rather than a local one.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "The eye as a window on systemic disease",
        text: "The observation that the retina, optic nerve, orbit and ocular adnexa are supplied by the same small vessels and controlled by the same autonomic pathways as the rest of the body, so systemic vascular, metabolic, endocrine, haematological, neurological and infective disease can be directly observed in the eye and often diagnosed there first.",
      },
      {
        type: "paragraph",
        text: "The retina is the only place in the body where small arteries and veins can be seen directly without an incision, and the optic nerve head is the only part of the central nervous system visible in life. That is why a fundus examination is part of the examination of the diabetic, the hypertensive, the anaemic and the patient with raised intracranial pressure. It also means the ophthalmologist sees the side effects of drugs before anyone else: a patient on chloroquine with a bull's-eye macula, a patient on amiodarone with corneal vortex changes, a patient on ethambutol losing colour vision — all are visible to the clinician who is asked to examine the eyes and who then looks at the drug list.",
      },

      { type: "heading", level: 2, text: "Diabetes mellitus" },
      {
        type: "table",
        headers: ["Ocular problem", "Mechanism", "What is seen"],
        rows: [
          ["Diabetic retinopathy", "Microangiopathy: pericyte loss, microaneurysms, capillary occlusion and leakage, then neovascularisation driven by ischaemia and VEGF", "Microaneurysms, blot haemorrhages, hard exudates and cotton-wool spots in non-proliferative disease; new vessels on the disc or retina and vitreous haemorrhage in proliferative disease"],
          ["Diabetic cataract", "Accumulation of sorbitol in the lens via the aldose reductase pathway, raising its osmotic load and opacifying it", "Cortical and snowflake opacities, typically earlier and faster than senile cataract; poor control accelerates onset"],
          ["Refractive shifts", "Osmotic swelling of the crystalline lens changes its curvature and index", "Transient blurring, often when control is poorly established or improving; spectacles should not be prescribed until control is stable"],
          ["Rubeosis iridis and neovascular glaucoma", "Retinal ischaemia releases VEGF that vessels the anterior segment and obstructs the angle", "Fine new vessels at the pupil margin, then a high intraocular pressure with a hard, painful eye"],
        ],
      },
      {
        type: "paragraph",
        text: "Diabetes is the commonest systemic cause of blindness in working adults, and the eye findings lag behind years of hyperglycaemia — which is exactly why screening works. Every patient with diabetes needs a dilated fundus examination (or validated retinal photography) at diagnosis and at least annually thereafter, because the early stages of retinopathy are asymptomatic. The lesson is not merely ocular: the presence of retinopathy is a marker of the same microangiopathy that is damaging the kidneys and the peripheral nerves, so a patient with proliferative retinopathy needs blood pressure, glucose, lipid and renal assessment regardless of their eye condition.",
      },
      {
        type: "callout",
        variant: "info",
        text: "A diabetic patient with a sudden fall in vision and a red reflex that cannot be seen has a vitreous haemorrhage until proven otherwise — it is the presentation of proliferative retinopathy and needs urgent ophthalmic referral, not new spectacles.",
      },

      { type: "heading", level: 2, text: "Hypertension and renal disease" },
      {
        type: "paragraph",
        text: "The fundus is examined in every patient with a raised blood pressure because it is the only site where the effects of hypertension on arterioles can be seen directly. Chronic hypertension produces arteriolar narrowing, focal changes at arteriovenous crossings (nipping), and changes in the vessel wall that make the arteries appear like copper or silver wire; acute severe hypertension produces leakage — flame-shaped haemorrhages, cotton-wool spots, hard exudates in a macular star and, in accelerated and malignant hypertension, swelling of the optic disc (grade IV changes), which is an ocular emergency.",
      },
      {
        type: "table",
        headers: ["Fundus change", "What it means", "Action"],
        rows: [
          ["Generalised arteriolar narrowing, AV nicking, silver or copper wiring", "Chronic hypertensive damage — the retinal equivalent of years of raised pressure", "Control blood pressure and assess for hypertensive end-organ damage elsewhere"],
          ["Flame haemorrhages, cotton-wool spots, hard exudates and a macular star", "Acute hypertensive leakage — grade III retinopathy", "Urgent blood pressure measurement and referral for inpatient control"],
          ["Disc swelling with the changes above (grade IV)", "Malignant or accelerated hypertension — a medical emergency", "Emergency admission; untreated it causes rapid irreversible visual loss, renal failure and stroke"],
          ["Elschnig spots and Siegrist streaks in a young patient", "Hypertensive choroidopathy — fibrinoid necrosis of the choroidal vasculature, seen in acute hypertension of pregnancy or renal disease", "Urgent obstetric or medical management"],
          ["Retinal vein occlusion in a hypertensive, diabetic or hyperviscosity state", "Haemorrhagic or ischaemic occlusion of a retinal vein", "Cardiovascular risk assessment, glycaemic and lipid control, and ophthalmic review for macular oedema"],
        ],
      },

      { type: "heading", level: 2, text: "Thyroid eye disease" },
      {
        type: "paragraph",
        text: "Thyroid-associated ophthalmopathy is the commonest cause of unilateral or bilateral proptosis in an adult, and it can precede, accompany or follow the biochemical thyroid abnormality. It is autoimmune: thyroid-stimulating immunoglobulins activate fibroblasts in the extraocular muscles and orbital fat, which enlarge and become infiltrated with glycosaminoglycans. The resulting orbital pressure produces the lid signs, the proptosis and — the sight-threatening part — the compressive optic neuropathy.",
      },
      {
        type: "table",
        headers: ["Sign", "What produces it", "Notes"],
        rows: [
          ["Upper lid retraction and upper lid lag", "Fibrosis and overaction of the levator and Muller muscle", "The commonest and earliest lid sign; the patient appears startled and shows a white rim of sclera above the cornea"],
          ["Proptosis and exposure signs", "Enlargement of the orbital muscles and fat", "Restricts venous drainage, producing chemosis, conjunctival injection and a dry eye"],
          ["Restrictive ophthalmoplegia", "Inflammation and fibrosis of the extraocular muscles — the inferior and medial recti first", "Defective elevation of the eye is the classic finding; the patient may have completely normal vision"],
          ["Compressive optic neuropathy", "Apical crowding of the optic nerve at the orbital apex", "The sight-threatening complication; the disc may look normal, so disc pallor with a field defect is the clue"],
          ["Lid lag on downgaze (von Graefe sign)", "Delayed descent of the upper lid when the eye follows the finger down", "A historical but still-quoted examination sign of hyperthyroidism"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Do not confuse thyroid eye disease with myasthenia gravis. Thyroid eye disease is fixed, has lid retraction, is often accompanied by proptosis and typically causes restricted elevation without fatigue; myasthenia is fatigable, causes ptosis rather than lid retraction, never causes proptosis, and is confirmed by an ice-pack test and acetylcholine receptor antibodies.",
      },

      { type: "heading", level: 2, text: "Haematological disease" },
      {
        type: "table",
        headers: ["Condition", "Ocular findings", "Why"],
        rows: [
          ["Anaemia", "Flame-shaped haemorrhages, cotton-wool spots, retinal venous tortuosity, and occasionally disc swelling", "Retinal hypoxia from reduced oxygen-carrying capacity; Roth spots with white centres may also appear"],
          ["Leukaemia", "Roth spots, retinal infiltrates, pseudo-hypopyon of leukaemic cells in the anterior chamber, optic nerve infiltration with visual loss", "Hyperviscosity, anaemia and infiltration of the choroid, retina and optic nerve"],
          ["Polycythaemia and hyperviscosity", "Engorged, dark tortuous retinal veins, disc swelling and haemorrhages", "Sluggish circulation with venous stasis and vessel wall stress"],
          ["Sickle cell disease", "Salmon patches (superficial retinal haemorrhages), black sunbursts (subretinal scarring), sea fans (peripheral neovascularisation), and occlusive retinopathy", "Sickled red cells occlude the peripheral retinal vasculature; ischaemia drives neovascularisation"],
          ["Thrombocytopaenia and clotting disorders", "Retinal haemorrhages, vitreous haemorrhage, subconjunctival haemorrhages and lid haematomas", "Failure of primary or secondary haemostasis with minor vessel damage"],
        ],
      },

      { type: "heading", level: 2, text: "Neurological and other systemic associations" },
      {
        type: "table",
        headers: ["Systemic disease", "Ocular feature", "What it tells you"],
        rows: [
          ["Multiple sclerosis", "Optic neuritis — painful eye movement with subacute unilateral blur, a relative afferent pupillary defect and impaired colour vision", "A first presentation of demyelination in a young adult; MRI brain is indicated"],
          ["Stroke and intracranial tumours", "Homonymous visual field defects (quadrantanopia or hemianopia), optic atrophy from a chronic compressive lesion", "A field defect with a normal fundus means a retrochiasmal lesion"],
          ["Raised intracranial pressure", "Papilloedema with transient visual obscurations and a sixth nerve palsy", "A false localising sign, not a local eye disease; requires urgent neurological assessment"],
          ["Giant cell arteritis", "Anterior ischaemic optic neuropathy with sudden severe visual loss in a patient over 55", "A medical emergency requiring high-dose corticosteroids before investigation, to protect the second eye"],
          ["Myasthenia gravis", "Fatigable ptosis and diplopia with a normal pupil", "An ice-pack test and acetylcholine receptor antibodies confirm the diagnosis"],
          ["Sarcoidosis", "Anterior and posterior uveitis, lacrimal gland enlargement, conjunctival nodules and facial nerve palsy", "A granulomatous uveitis with a chronic systemic course; a serum ACE and chest imaging are indicated"],
          ["Tuberculosis", "Choroidal granulomas, serpiginous choroiditis and Eales disease (retinal vasculitis with vitreous haemorrhage)", "In endemic countries, a choroiditis with vitreous inflammation is investigated for TB"],
          ["HIV and immunosuppression", "Cytomegalovirus retinitis with haemorrhagic necrosis, toxoplasma retinochoroiditis, cotton-wool spots", "The eye can be the first sign of advanced immunosuppression; CMV retinitis requires urgent antiviral therapy"],
          ["Rosacea, Stevens-Johnson syndrome and ocular cicatricial pemphigoid", "Blepharitis and marginal keratitis; symblepharon, keratinisation of the conjunctiva and corneal failure", "The conjunctival surface is the first casualty of cicatrising skin and mucosal disease"],
          ["Congenital rubella, toxoplasmosis, syphilis and cytomegalovirus infection", "Congenital cataracts, chorioretinitis and a salt-and-pepper retinopathy", "The classic congenital infections — the eye findings direct the serological and maternal history"],
        ],
      },

      { type: "heading", level: 2, text: "Iatrogenic ocular disease: the drug list" },
      {
        type: "table",
        headers: ["Drug", "Ocular effect", "Monitoring and action"],
        rows: [
          ["Corticosteroids (topical, systemic, inhaled or intraocular)", "Posterior subcapsular cataract and steroid-induced ocular hypertension progressing to open-angle glaucoma", "Intraocular pressure checks in long-term use; tapering or stopping if the pressure rises; cataract surgery once the visual effect is established"],
          ["Anticholinergics and mydriatics (tricyclics, atropine, some inhalers and antiparkinsonian drugs)", "Precipitation of acute angle closure in patients with narrow angles", "Avoid in known shallow angles; if a red painful eye occurs, treat as angle closure"],
          ["Chloroquine and hydroxychloroquine", "Bull's-eye maculopathy with reduced acuity and a paracentral scotoma, dose- and duration-related", "Screening with visual fields, optical coherence tomography and fundus examination before five years of therapy and annually thereafter; the lowest effective dose"],
          ["Ethambutol", "Dose-related optic neuropathy with red-green colour blindness and central visual loss", "Colour vision and acuity checks during therapy; stop the drug if defect appears — usually reversible if caught early"],
          ["Amiodarone", "Vortex (verticillate) keratopathy in most long-term users; optic neuropathy rarely", "Keratitis usually needs no action and settles on stopping; optic neuropathy requires urgent drug withdrawal"],
          ["Tamoxifen", "Crystalline maculopathy with macular oedema and reduced vision at high cumulative doses", "Macular examination during long-term therapy; discontinue if retinopathy progresses"],
          ["Topiramate and sulfonamides", "Acute myopia and secondary angle closure with sudden bilateral blur", "Stop the drug and use cycloplegia and pressure-lowering therapy; the angle reopens within 48 hours"],
          ["Sildenafil and the phosphodiesterase-5 inhibitors", "Transient cyanopsia (blue tinge to vision) and, rarely, non-arteritic anterior ischaemic optic neuropathy", "Warn the patient about transient colour change; avoid in patients with previous optic neuropathy"],
          ["Phenothiazines such as thioridazine", "Pigmentary retinopathy with field loss", "Dose limits and periodic retinal examination"],
          ["Topical beta-blockers for glaucoma", "Systemic bradycardia, bronchospasm and masking of hypoglycaemia symptoms", "Ask about asthma, heart block and diabetes; a cardio-selective or non-beta-blocker alternative is preferred"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Before prescribing any glaucoma drop, ask about asthma and heart block. Timolol causes bronchospasm in asthmatics and heart block in patients with conduction disease; the pupil-dilating drops cause angle closure; and a steroid drop in a steroid-dependent patient causes a pressure rise.",
      },

      { type: "heading", level: 2, text: "Worked example 1: newly controlled diabetes with blurred vision" },
      {
        type: "paragraph",
        text: "A 55-year-old man has his HbA1c reduced over six weeks and reports blurred vision. Two mechanisms are in play. The osmotic effect of hyperglycaemia made his lens swell and myopic; rapid correction of the glucose reverses that shift, so vision fluctuates and his old spectacles are now wrong. At the same time he has years of undiagnosed retinopathy producing cataract. The management is to wait until glycaemic control is stable, refract him then, and examine the fundus through a dilated pupil to grade the retinopathy — the retinal disease is the part that cannot wait for its own convenience.",
      },
      {
        type: "paragraph",
        text: "The lesson generalises: in the diabetic patient, never blame an unstable refraction without examining the fundus, because the longer-term threat to sight is the retinopathy rather than the prescription.",
      },

      { type: "heading", level: 2, text: "Worked example 2: headache, blood pressure and a swollen disc" },
      {
        type: "paragraph",
        text: "A 35-year-old woman presents with headache and a blood pressure of 200/130. Fundoscopy shows bilateral disc swelling with flame haemorrhages and cotton-wool spots. This is malignant hypertension, and the disc swelling is grade IV retinopathy: the eye has not only diagnosed the systemic disease but announced its severity. Emergency medical admission and controlled pressure reduction are required; the same patient will need renal function assessment, because the pathology in kidney and retinal vessels is identical.",
      },
      {
        type: "question",
        prompt: "Which ocular sign of malignant hypertension separates it from uncomplicated chronic hypertension, and why is it so important?",
        answer: "Bilateral optic disc swelling (papilloedema from hypertension) accompanied by haemorrhages and cotton-wool spots. It is the sign of target-organ damage and marks the transition to a hypertensive emergency requiring immediate treatment, because untreated it leads to disc atrophy and permanent visual loss within days.",
        explanation: "Grades I and II (narrowing, AV nicking, copper and silver wiring) reflect chronicity; grades III and IV (haemorrhages, exudates, disc oedema) reflect acute severity.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Prescribing spectacles for a diabetic patient whose control is changing or recently established. The lens changes its shape and index with glycaemia, so a refraction taken during instability is quickly obsolete; wait until the HbA1c has been stable for several weeks, and refract then.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Diagnosing thyroid eye disease on the basis of the lid signs alone without examining the eye for proptosis, corneal exposure and optic neuropathy. Euthyroid patients and patients with no history of thyroid disease are still at risk of the sight-threatening orbital complications, and apical crowding can occur without any visible proptosis.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Starting an anticholinergic, a tricyclic or a nebulised bronchodilator in an elderly hypermetrope with narrow angles without a word about angle closure. The resulting acute angle closure is diagnosed late because the patient's first complaint is often attributed to the systemic drug's headache or nausea.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Missing the drug history in a patient with unexplained visual loss. Ask specifically about chloroquine, hydroxychloroquine, ethambutol, amiodarone, tamoxifen, vigabatrin and inhaled or systemic steroids; the ocular toxicity of each is dose-related and often reversible if recognised.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A diabetic patient reports improved vision when her control deteriorates and blurring when it is corrected. What is happening?",
        answer: "Hyperglycaemia causes the crystalline lens to swell osmotically, increasing its refractive power and producing a myopic shift, which a presbyopic patient experiences as an ability to read without glasses. Correcting the hyperglycaemia reverses the myopic shift, so the old prescription is wrong and distance and near vision blur.",
        explanation: "This is a refractive shift, not a retinal event — but it must not be used as a reason to skip the dilated fundus examination.",
      },
      {
        type: "question",
        prompt: "A patient on hydroxychloroquine reports difficulty reading. What does the ophthalmologist look for, and at what point does monitoring begin?",
        answer: "Bull's-eye maculopathy — a ring of retinal pigment disturbance around the fovea with a paracentral scotoma and impaired acuity. Because the toxicity is dose- and duration-related, a baseline examination before therapy and annual screening with fields, optical coherence tomography and fundoscopy are performed after five years (or earlier with risk factors), and the lowest effective dose is used.",
        explanation: "The critical point is that the maculopathy is irreversible once established, so screening must precede detectable visual loss.",
      },
      {
        type: "question",
        prompt: "What distinguishes thyroid eye disease from ocular myasthenia in a patient with double vision?",
        answer: "Thyroid eye disease causes lid retraction, proptosis, a hard, firm orbit and restricted elevation without fatigability, and often bilateral eye involvement with conjunctival injection. Myasthenia causes fatigable ptosis (never lid retraction), no proptosis, normal eye pressure, and a pupil that is always spared; the diagnosis is supported by an ice-pack test and antibody testing.",
        explanation: "The single most useful discriminators are lid retraction versus ptosis, the presence or absence of proptosis, and fatigability.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A 45-year-old woman has several months of bilateral proptosis, conjunctival injection, lid retraction with upper lid lag and vertical diplopia on attempted upgaze. There is no diurnal variation and no ptosis. Which diagnosis is most likely?",
        options: [
          "Orbital cellulitis requiring intravenous antibiotics",
          "Thyroid-associated ophthalmopathy from Graves disease",
          "Cavernous sinus thrombosis from a dental abscess",
          "Ocular myasthenia gravis with fatigable ophthalmoplegia",
        ],
        correctIndex: 1,
        explanation: "Bilateral proptosis with lid retraction, upper-lid lag and restricted elevation, in the absence of fatigability and ptosis, is the classic presentation of thyroid eye disease. The absence of diurnal variation and the presence of proptosis and lid retraction argue strongly against myasthenia, and the chronicity and fever-free course exclude infection.",
      },
      {
        type: "mcq",
        stem: "A patient with rheumatoid arthritis has been on long-term systemic corticosteroids and now reports glare, difficulty reading and halos around lights. Which ocular complication is most likely?",
        options: [
          "Bacterial keratitis from immunosuppression",
          "Posterior subcapsular cataract with steroid-induced ocular hypertension",
          "Retinal detachments from vitreous atrophy",
          "Non-arteritic anterior ischaemic optic neuropathy",
        ],
        correctIndex: 1,
        explanation: "Chronic corticosteroid therapy causes a posterior subcapsular cataract (which reads particularly poorly because it sits at the nodal point of the eye) and a steroid-induced rise in intraocular pressure that may progress to glaucoma. Both need ophthalmic assessment, including tonometry.",
      },
      {
        type: "mcq",
        stem: "A patient starting antituberculous therapy with ethambutol reports decreased vision with reduced red-green colour discrimination. What is the ocular mechanism and the correct action?",
        options: [
          "Corneal deposition of the drug; continue therapy and lubricate the eye",
          "Dose-related toxic optic neuropathy; stop the ethambutol and consult the treating physician, because recovery is possible if recognised early",
          "Steroid-induced posterior subcapsular cataract; arrange cataract surgery",
          "Retinal vein occlusion; arrange anticoagulation",
        ],
        correctIndex: 1,
        explanation: "Ethambutol causes a dose-related optic neuropathy presenting with reduced acuity and red-green colour defects; the drug should be stopped promptly under medical supervision, because early recovery is usual but delayed withdrawal leaves permanent visual loss.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The eye is examined in every systemic disease that affects small vessels or the fibroblasts of the orbit. Diabetes produces retinopathy, cataract and refractive shift; hypertension produces the arteriolar and disc changes of retinopathy, with disc swelling marking a medical emergency; thyroid eye disease produces lid retraction, proptosis, restrictive ophthalmoplegia and sight-threatening compressive optic neuropathy; anaemia, leukaemia and sickle cell disease produce recognisable retinal findings; and demyelination, intracranial pressure and vasculitis produce optic nerve disease. Systemic drugs add a further layer: corticosteroids, anticholinergics, antimalarials, ethambutol, amiodarone and tamoxifen all have recognisable ocular toxicities.",
      },
      {
        type: "paragraph",
        text: "Next: the anterior segment from outside in — lids, lacrimal apparatus and conjunctiva — where blepharitis, chalazion, entropion and the conjunctivitides are diagnosed largely from history and simple examination.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 4 — Lids, lacrimal & conjunctiva (fully authored)
// ---------------------------------------------------------------------------
function lesson4() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the anatomy of the lids, lash line, tarsal plates and meibomian glands and state how each produces a characteristic disorder; differentiate a hordeolum from a chalazion and manage both; distinguish entropion, ectropion and ptosis and name the most important cause of each; distinguish obstetric discharge and watering due to a blocked nasolacrimal duct; and classify conjunctivitis by discharge, itching, follicles, papillae and pre-auricular lymphadenopathy, with the cause and treatment of each.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 3 (Systemic disease and the eye). Rosacea, Stevens-Johnson syndrome, thyroid disease and rheumatoid arthritis all produce characteristic lid and conjunctival disease, and lesson 3 establishes the systemic associations used here.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "The ocular adnexa",
        text: "The structures that protect and support the globe but are not part of it — the lids, lashes, meibomian glands, lacrimal apparatus, conjunctiva and orbit. Disease here is usually visible without any instrument, which makes it the most examinable part of ophthalmology.",
      },
      {
        type: "paragraph",
        text: "The lids are the windscreen wipers and the oil glands: the orbicularis oculi closes them, the levator and Muller muscle hold them open, the tarsal plates give them their shape, and the meibomian glands pump the oil that stops the tears evaporating. Every lid disorder is one of those parts failing mechanically. The conjunctiva is a thin, loose mucosal sheet that can scroll, folliculate, swell and discharge — which makes it very good at showing what is irritating it. Between the two sits the lacrimal canal: a plumbed system with a pump, and like any plumbing it leaks or blocks.",
      },

      { type: "heading", level: 2, text: "Lid disorders" },
      {
        type: "table",
        headers: ["Disorder", "What it is", "Clinical picture", "Management"],
        rows: [
          ["Hordeolum (stye)", "Acute bacterial infection of a lash follicle or of a meibomian gland", "A painful, hot, red abscess on the lid margin pointing over 2-3 days", "Warm compresses four times daily; incision and drainage if it points; topical antibiotic if cellulitis spreads"],
          ["Chalazion (meibomian cyst)", "Sterile lipogranulomatous inflammation of a meibomian gland after duct obstruction", "A firm, painless, slowly growing nodule in the tarsal plate, visible as a lump under the conjunctiva when everted", "Warm compresses first; incision and curettage from the conjunctival side if it persists; recurrent or atypical lesions are biopsied to exclude adenoma or carcinoma"],
          ["Blepharitis", "Chronic inflammation of the lid margin: anterior (staphylococcal or seborrhoeic, at the lash line) and posterior (meibomian gland dysfunction)", "Crusting at the lash bases, collarettes, lid margin telangiectasia, oily deposits, chronic red eye with foreign body sensation", "Lifelong lid hygiene with warm compresses and lid scrubs, topical antibiotic and lubricants; oral doxycycline for posterior disease; topical steroids only short-term and never unchecked"],
          ["Entropion", "Inward turning of the lid so the lashes rub the cornea", "Watering, photophobia, corneal staining; in the elderly it is involutional, in burns it is cicatricial", "Epilation, a surgical lid-shortening or everting procedure, and corneal protection meanwhile"],
          ["Ectropion", "Outward turning so the punctum leaves the tears and the cornea is exposed", "Watery eye with a visibly everted lid; causes are involutional (elderly), cicatricial (scarring) or paralytic (facial nerve palsy)", "Lubricants for the cornea and a lid-tightening operation for the mechanical problem"],
          ["Ptosis", "Drooping of the upper lid measured against the normal position of its margin", "Pseudoptosis mimics (dermatochalasis, enophthalmos); true ptosis is aponeurotic (elderly, largest group), myogenic (myotonic dystrophy, myasthenia), neurogenic (third nerve palsy, Horner syndrome) or mechanical", "Treat the cause, and where function is affected, a levator or brow suspension operation"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The marginal reflex distance (the distance from the anterior corneal light reflex to the upper-lid margin) is the clinical measure of ptosis: a value of 4 mm or more is normal, less is abnormal. In Horner syndrome the lid droops without compensatory brow effort, the pupil is small and there may be anhidrosis; in a third nerve palsy the eye is down and out and the pupil may be dilated — the combination is an emergency.",
      },

      { type: "heading", level: 2, text: "The lacrimal apparatus" },
      {
        type: "table",
        headers: ["Condition", "Mechanism and presentation", "Management"],
        rows: [
          ["Dry eye (keratoconjunctivitis sicca)", "Tear film deficiency — aqueous deficient (lacrimal gland failure, Sjogren syndrome, drugs) or evaporative (meibomian disease) — with a foreign body sensation, intermittent blur and reflex watering", "Artificial tears, lid hygiene for evaporative disease, treat the cause; punctal plugs or occlusion for severe aqueous deficiency"],
          ["Congenital nasolacrimal duct obstruction", "Failure of the valve of Hasner at the lower end of the duct to canalise, so tears pool in the sac", "Epiphora with recurrent mucopurulent discharge and reflux over the punctum on sac pressure; the eye is white and quiet"],
          ["Acute dacryocystitis", "Bacterial infection of a blocked sac", "Painful, red, tender swelling below the medial canthal tendon with fever and reflux of pus; treated with systemic antibiotics and drainage, and later with dacryocystorhinostomy"],
          ["Chronic canaliculitis", "Infection of the canaliculus, classically by Actinomyces", "Watering with a gritty sensation and a gritty yellow caststone expressed from the punctum"],
          ["Dacryoadenitis", "Infection or inflammation of the lacrimal gland in the superotemporal fornix", "Swelling and pain at the lateral upper lid; associated with viral illness, sarcoidosis and lymphoma"],
        ],
      },
      {
        type: "paragraph",
        text: "Watering needs a single question answered: is the eye making more tears than it can drain, or is the drainage blocked? Overproduction comes from a surface irritant — entropion, a foreign body, a dry eye (counter-intuitively, the driest eye is often the wettest). Blockage produces a stagnant sac with a recurrent discharge, and it is the blockage that needs surgery: probing for a congenital obstruction, and dacryocystorhinostomy connecting the sac directly to the nose in an adult. Ninety per cent of congenital obstructions clear spontaneously by one year, so massage, hygiene and patience come first.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Never perform syringing on a sac that is acutely infected. Probing or syringing a dacryocystitis forces pus into the orbit and can cause orbital cellulitis; irrigate a blocked duct only after the infection has settled.",
      },

      { type: "heading", level: 2, text: "Conjunctivitis: the differential" },
      {
        type: "paragraph",
        text: "Ask about discharge, itch, the pattern of injection, and whether there is a node in front of the ear. Discharge means bacteria, itch means allergy, follicles with a pre-auricular node mean virus or chlamydia, and a profuse purulent discharge in a newborn is an emergency. Vision is always normal in a conjunctivitis, so any acuity loss takes the diagnosis out of this table entirely.",
      },
      {
        type: "table",
        headers: ["Type", "Discharge", "Surface findings", "Key discriminator", "Treatment"],
        rows: [
          ["Bacterial", "Purulent, lids stuck together on waking", "Diffuse conjunctival injection, papillae over the tarsal plates, membranes in pneumococcal disease", "Purulent discharge with normal vision", "Broad-spectrum topical antibiotic (chloramphenicol, gentamicin, a fluoroquinolone) for 5-7 days"],
          ["Viral (adenovirus)", "Watery, scanty", "Follicles on the tarsal conjunctiva, a pre-auricular node, often with sore throat and fever in epidemic keratoconjunctivitis", "Follicles plus node plus contagion", "No antibiotic; hygiene, cool compresses, artificial tears, isolation of the patient and their surfaces"],
          ["Allergic (vernal and atopic)", "Stringy, mucous", "Intense itch with papillae — cobblestone in vernal disease in children; chemosis in acute allergic reaction", "Itch dominating the history", "Mast cell stabiliser and antihistamine drops, cool compresses, allergen avoidance; oral antihistamine; severe disease needs a short steroid course"],
          ["Chlamydial (adult inclusion conjunctivitis and trachoma)", "Mucopurulent", "Large follicles in the superior fornix, a superior pannus and Herbert pits in trachoma", "Chronic follicular conjunctivitis with pannus", "Systemic azithromycin or doxycycline with contact tracing"],
          ["Gonococcal", "Profuse purulent, copious", "Marked lid oedema, chemosis and a copious discharge; corneal perforation risk is high", "Hyperacute purulence, especially in a newborn", "Emergency systemic ceftriaxone with copious saline lavage and topical antibiotic"],
          ["Chemical or irritative", "Watery", "Diffuse injection with punctate corneal staining and a clear history", "History of exposure", "Copious irrigation, remove any particulate matter, lubricants and analgesia"],
          ["Subconjunctival haemorrhage", "None", "A confluent dark red patch under intact conjunctiva", "A bright red patch with no other sign", "Check blood pressure and coagulation; reassure; re-examine if recurrent"],
        ],
      },

      { type: "heading", level: 2, text: "Vernal keratoconjunctivitis and giant papillary conjunctivitis" },
      {
        type: "definition",
        term: "Vernal keratoconjunctivitis",
        text: "A bilateral, seasonally recurring allergic disease of children and young adults, characterised by severe itching, giant cobblestone papillae on the upper tarsal conjunctiva, and — in the worst cases — Horner-Trantas dots and a shield ulcer of the cornea.",
      },
      {
        type: "paragraph",
        text: "It is worth separating from ordinary allergic conjunctivitis because its corneal complications are sight-threatening. Shield ulceration arises when the thickened tarsal plate abrades the epithelium, and the vigorous rubbing of an intensely itchy child adds to it. The same cobblestone pattern appears in a contact lens wearer as giant papillary conjunctivitis, which settles when the lens is refitted or stopped. Management of both is the ladder — stabilise cells, block histamine, cool compress — with steroid reserved for severe allergic disease under supervision.",
      },

      { type: "heading", level: 2, text: "Trachoma: the infectious cause of blindness" },
      {
        type: "paragraph",
        text: "Trachoma is chronic conjunctival infection with Chlamydia trachomatis (serotypes A, B, Ba and C), spread from eye to eye on the hands, flies and shared towels in conditions of poverty and water scarcity. Repeated infections produce follicles and then progressive conjunctival scarring. The scar contracts the tarsal plates (entropion) and the lashes turn inward (trichiasis), which abrades the cornea, which scars, which blinds.",
      },
      {
        type: "table",
        headers: ["WHO sign", "Definition", "Meaning"],
        rows: [
          ["TF (trachomatous follicles)", "Five or more follicles on the flat tissue of the upper tarsus", "Active infection"],
          ["TI (trachomatous inflammation, intense)", "Pronounced inflammatory thickening of the tarsal conjunctiva obscuring vessels", "Severe active disease"],
          ["TS (trachomatous conjunctival scarring)", "White fibrotic scarring of the tarsal conjunctiva", "Old, healed disease"],
          ["TT (trachomatous trichiasis)", "At least one lash rubbing the cornea", "Risk of corneal ulceration and blindness — needs surgery"],
          ["CO (corneal opacity)", "Corneal opacity over the visual axis", "Blindness from the late effects of trachoma"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The global trachoma programme is the SAFE strategy: Surgery for trichiasis, Antibiotics (azithromycin) to clear the infection, Facial cleanliness, and Environmental improvement (water and latrines). SAFE is the only programme in this course that treats a social problem rather than a patient.",
      },

      { type: "heading", level: 2, text: "Conjunctival tumours and surface lesions" },
      {
        type: "table",
        headers: ["Lesion", "What it is", "What to do"],
        rows: [
          ["Pinguecula", "Degenerative yellow-white conjunctival thickening on the exposed interpalpebral bulbar conjunctiva", "Reassure; lubricants; excise only for cosmetic reasons or recurrent inflammation"],
          ["Pterygium", "A wing of fibrovascular conjunctiva growing across the limbus into the cornea, linked to sunlight and dust", "Excision with conjunctival autograft if it threatens the visual axis or becomes repeatedly inflamed"],
          ["Conjunctival naevus", "A pigmented conjunctival lesion with a cyst on its surface", "Photographic record and referral; excision only for growth or suspicion of malignancy"],
          ["Pyogenic granuloma", "A red, friable vascular mass after surgery, trauma or a retained foreign body", "Topical treatment and excision; always exclude a retained foreign body under the lid"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "A foreign body is the commonest cause of a unilateral watering, red eye with a gritty sensation, and it hides under the upper lid. Evert the lid in every unilateral irritative eye — double eversion in a contact lens wearer — before ordering any investigation.",
      },

      { type: "heading", level: 2, text: "Worked example 1: the 7-month-old with a watering eye" },
      {
        type: "paragraph",
        text: "A baby has persistent watering of the right eye with a recurrent mucoid discharge. There is no photophobia, the eye is white, and pressure over the lacrimal sac expresses pus at the punctum. This is congenital nasolacrimal duct obstruction — the valve of Hasner failed to open — and not conjunctivitis. Ninety per cent resolve by a year, so the management is sac massage (downward, from just below the medial canthus) and hygiene, with probing under anaesthetic reserved for the few who persist past 12-18 months. Antibiotics treat only an infected sac, never the drainage problem.",
      },
      {
        type: "question",
        prompt: "Why is a persistently watering eye in a 6-month-old not treated with chloramphenicol indefinitely?",
        answer: "Because the problem is mechanical — the nasolacrimal duct has not canalised at the valve of Hasner, so tears pool and become infected intermittently. The infection is a consequence of stagnation; antibiotics do not open the duct. Massage, hygiene and time resolve it in most cases, and probing after a year resolves most of the rest.",
        explanation: "This is the distinction between overproduction, obstruction and infection that underlies every watering eye.",
      },

      { type: "heading", level: 2, text: "Worked example 2: the itching child" },
      {
        type: "paragraph",
        text: "A nine-year-old rubs both eyes violently; there is mucus discharge, big cobblestone papillae under the upper lids and no pre-auricular node. This is vernal keratoconjunctivitis. The treatment is a mast cell stabiliser and a topical antihistamine with cold compresses, plus education about the harms of rubbing; steroid drops are reserved for severe cases with corneal involvement under supervision because their risks include cataract and glaucoma. Unlike adenoviral conjunctivitis there is no node, no contagion and no purulent discharge.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Treating a chalazion as acute infection with antibiotics. A chalazion is a lipogranulomatous reaction inside the meibomian gland, not infection; it responds to warmth and time, and to incision and curettage if it persists. Only a tender, pointing, hot lid with surrounding cellulitis needs an antibiotic.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Missing the lid margin in a recurrent red eye. Chronic staphylococcal blepharitis produces a chronically unstable tear film that mimics conjunctivitis and dryness, and it will not settle until lid hygiene, warm compresses and lid-margin antibiotics are used consistently for weeks.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Diagnosing ptosis as a lid disorder without examining the pupil and eye movements. Ptosis with a small pupil is Horner syndrome; with an eye down and out and a dilated pupil it is a third nerve palsy needing urgent neurovascular imaging; with fatigability it is myasthenia; and in the elderly, the vast majority are aponeurotic and benign.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Failing to exclude a retained foreign body under the upper lid in a unilateral gritty red eye. A linear vertical corneal abrasion is the signature of a tarsal foreign body, and it will be missed if the upper lid is not everted.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Dispensing topical steroids for an itchy, cobblestone papillae eye over many months. Steroids accelerate the trachomatous and herpetic corneal catastrophes, and their unsupervised use causes steroid cataract and glaucoma.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A patient has a firm, painless lump in the left tarsal plate that has grown slowly over three months. What is it, and what is the correct management?",
        answer: "A chalazion: a lipogranulomatous reaction to a blocked meibomian gland. Management begins with warm compresses and lid hygiene; if it persists after several weeks it is incised and curetted from the conjunctival side with an everting suture, and a lesion that recurs or looks atypical is sent for histology.",
        explanation: "The painless, slow growth is the key to distinguishing it from a stye (an acute, tender, pointing infection).",
      },
      {
        type: "question",
        prompt: "How do the findings of entropion and ectropion differ, and why does each produce a watering eye?",
        answer: "Entropion turns the lid margin inward so the lashes abrade the cornea, producing reflex watering, photophobia and corneal staining; ectropion turns the margin outward so the punctum leaves the tear lake and tears cannot enter the canal, producing true overflow watering. Entropion threatens the cornea through trichiasis; ectropion threatens it through exposure.",
        explanation: "In both cases the tear film is being wasted, but by blinking lashes in one and by draining nowhere in the other.",
      },
      {
        type: "question",
        prompt: "Differentiate bacterial, viral and allergic conjunctivitis using only the history and the external eye.",
        answer: "Bacterial conjunctivitis gives a purulent discharge that glues the lids on waking with diffuse injection and normal vision; viral (adenovirus) gives watery discharge with follicles on the tarsal conjunctiva, a pre-auricular node and often a recent contact with a similar case; allergic conjunctivitis gives intense itching with stringy mucus, papillae or chemosis, seasonal or exposure-linked symptoms and no node. Vision is normal in all three, and any reduction in acuity rules all three out.",
        explanation: "The triad of discharge, itch and pre-auricular node separates the three in almost every case.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A 7-month-old has persistent watering of the eye with recurrent mucous discharge. There is no photophobia, no blepharospasm and no corneal enlargement, and pressure over the lacrimal sac expresses material at the punctum. What is the most likely diagnosis and the appropriate initial management?",
        options: [
          "Acute dacryocystitis — start intravenous antibiotics and arrange urgent syringing",
          "Congenital nasolacrimal duct obstruction (of the valve of Hasner) — massage over the sac, warm compresses, hygiene and observation, with probing reserved for persistent cases after a year",
          "Bacterial conjunctivitis — topical fluoroquinolone for two weeks",
          "Infantile glaucoma — start oral acetazolamide and arrange goniotomy",
        ],
        correctIndex: 1,
        explanation: "Congenital NLDO presents with epiphora and reflex discharge with a quiet white eye; the sac refluxes on pressure. Most resolve by a year, so massage and hygiene are first-line and probing is deferred to the persistent minority. Syringing is contraindicated in active infection; infantile glaucoma causes photophobia, blepharospasm, tearing with corneal enlargement and a hazy cornea.",
      },
      {
        type: "mcq",
        stem: "A child with intense ocular itching has giant cobblestone papillae on the upper tarsal conjunctiva. Which is the most appropriate initial treatment?",
        options: [
          "Topical corticosteroid drops indefinitely for allergic control",
          "Topical antibiotic drops to prevent secondary infection",
          "Mast cell stabiliser drops with a topical antihistamine, cool compresses and protection from allergens",
          "Topical aciclovir ointment with oral acyclovir",
        ],
        correctIndex: 2,
        explanation: "Vernal keratoconjunctivitis is an allergic disease managed with mast cell stabilisers, antihistamines, cold compresses and allergen avoidance; steroids are reserved for severe corneal involvement under supervision because of the risks of cataract and glaucoma. Antibiotics and antivirals have no role in an uncomplicated allergic disease.",
      },
      {
        type: "mcq",
        stem: "In trachoma, which WHO sign indicates the end-stage consequence that is being targeted by the surgery arm of the SAFE strategy?",
        options: [
          "TF — trachomatous follicles on the upper tarsus",
          "TI — intense trachomatous inflammation",
          "CO — corneal opacity over the visual axis",
          "TS — trachomatous conjunctival scarring",
        ],
        correctIndex: 2,
        explanation: "CO (corneal opacity) is the blindness of late trachoma, while the surgical arm of SAFE (tarsal rotation or lash epilation) targets TT (trichiasis), the stage that immediately precedes and causes the opacity. Antibiotics target TF and TI; facial cleanliness and environment target transmission.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The lids and lacrimal apparatus fail mechanically: styes and chalazia are gland disorders, entropion and ectropion are margin positions, and a watering eye is either overproduction from a dry or irritated surface or obstruction of the nasolacrimal duct — resolved by massage in infancy and dacryocystorhinostomy in adults. Conjunctivitis is classified by discharge, itch, follicles and a pre-auricular node: purulent (bacterial), watery with follicles and a node (viral or chlamydial), intensely itchy with papillae (allergic), and profusely purulent in the newborn (gonococcal, an emergency). Trachoma is the world's leading infective cause of blindness and is controlled by the SAFE strategy.",
      },
      {
        type: "paragraph",
        text: "Next: the cornea and sclera, and uveitis — where keratitis, corneal ulceration, Fuchs and herpes simplex disease, scleritis and anterior, intermediate and posterior uveitis are recognised with the slit lamp and mapped to systemic disease.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 5 — Cornea, sclera & uveitis (fully authored)
// ---------------------------------------------------------------------------
function lesson5() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the five layers of the cornea, the cells that maintain its transparency and the consequences of damage to each layer; distinguish bacterial, viral, fungal and acanthamoebic keratitis by their clinical appearances and state the first-line management of each; recognise the clinical signs of acute anterior uveitis, the disease associations it implies, and its complications; and differentiate scleritis from episcleritis, and know which one threatens sight.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 4 (Lids, lacrimal and conjunctiva). You need to have mastered the conjunctival differential and to be able to tell a foreign-body sensation from a deep, boring pain, because scleritis and keratitis both present as deeply painful red eyes.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "The corneal stroma",
        text: "The middle ninety per cent of the cornea: parallel collagen fibrils of uniform diameter and spacing embedded in a proteoglycan matrix, with keratocytes between them and no blood vessels. Its transparency depends on the endothelial pump removing water and on that perfectly ordered spacing of collagen.",
      },
      {
        type: "paragraph",
        text: "The cornea is transparent because it arranges its collagen in a lattice that cancels light scattering, and it keeps itself dehydrated because a layer of endothelial cells pumps water out of the stroma into the anterior chamber. Damage either of those two properties and the cornea fails differently: break the collagen order and it blinds by scarring (keratitis, trauma); break the pump and it blinds by swelling (endothelial failure, Fuchs dystrophy). That is why every keratitis threatens sight — the healing response itself is the problem, because a scar is a disordered lens.",
      },

      { type: "heading", level: 2, text: "Corneal anatomy and what failing layers look like" },
      {
        type: "table",
        headers: ["Layer", "Role", "Damage seen"],
        rows: [
          ["Epithelium", "A stratified, fast-regenerating barrier with the nerve endings that make the cornea the most sensitive tissue in the body", "Defect staining with fluorescein, punctate keratopathy, abrasions, recurrent erosion"],
          ["Bowman layer", "A tough acellular sheet beneath the epithelium", "When destroyed it is replaced by disorganised stroma, so scarring, scarring-related astigmatism and haze follow"],
          ["Stroma", "The transparent collagen lattice held dehydrated by the endothelium", "Ulceration with stromal thinning, oedema and scarring; infiltrates of inflammatory cells"],
          ["Descemet membrane", "A thick basement membrane that stretches and recoils", "Descemetocoele — the last layer bulging forward before perforation; a break lets aqueous gush out and the iris plug it"],
          ["Endothelium", "A single layer of pump cells that must hold back the aqueous", "Fuchs dystrophy: guttae, morning oedema and haze progressing to a thickened, cloudy cornea; its loss from surgery is the reason a cataract is not always operated on"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The cornea is the most densely innervated tissue in the body, so an epithelial defect is the most painful injury ophthalmology manages — and a reduced corneal sensation is itself a diagnosis: herpetic keratitis, diabetes, acoustic neuroma and leprosy all blunt it, and the anaesthetic eye with a painless ulcer is an emergency.",
      },

      { type: "heading", level: 2, text: "Keratitis: the four infections to tell apart" },
      {
        type: "table",
        headers: ["Organism", "Risk factor", "Appearance", "First-line treatment"],
        rows: [
          ["Bacteria (Pseudomonas, Staph. aureus, Strep. pneumoniae)", "Contact lens wear, an epithelial defect, a compromised surface (diabetes, dry eye, anaesthesia) or cycloplegic use", "A grey, soft stromal infiltrate with an overlying ulcer, deep injection and photophobia; hypopyon in severe cases", "Stop lens wear, scrape for microscopy and culture, intensive topical antibiotic (a fluoroquinolone or fortified combination) with a cycloplegic"],
          ["Herpes simplex virus type 1", "Prior herpetic disease, ultraviolet light, stress, fever and a blunted corneal sensation", "A branching dendritic epithelial ulcer; recurrent disease gives disciform (stromal) keratitis with a central grey disc of oedema", "Topical aciclovir or ganciclovir; no steroid on an active epithelial lesion; oral antiviral for stromal or recurrent disease; avoid steroids alone"],
          ["Varicella-zoster virus", "Shingles in the ophthalmic division (Hutchinson sign — lesions on the tip or side of the nose)", "Pseudodendrites, conjunctivitis, corneal anaesthesia, sectoral iris atrophy and iritis", "Oral aciclovir within 72 hours, topical lubricants, topical steroid for the iritis under supervision"],
          ["Fungi (Fusarium, Aspergillus, Candida)", "Injury with vegetable matter, fungal contamination of a contact lens, chronic topical steroid use", "A dry, fluffy, feathery grey-white lesion with satellite infiltrates, a small hypopyon and a progressive course over weeks", "Topical natamycin or amphotericin B, often for months, plus stopping any steroid; half of these eyes still require surgery"],
          ["Acanthamoeba", "Contact lens wear combined with tap water, sea water or homemade saline", "Severe pain disproportionate to the signs, a ring-shaped stromal infiltrate, perineural dots and late loss of sensation", "Stop lenses, scrape and culture, topical propamidine and polyhexamide for weeks; diagnosis is often late and the outcome poor"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The two drugs that must never be left in a red eye are a corticosteroid and an anaesthetic. Steroids unleash herpetic and fungal disease and permit melting; topical anaesthetic drops stop the epithelium from healing, and repeated use by a patient or a clinic causes a neurotrophic ulcer.",
      },

      { type: "heading", level: 2, text: "Worked example: a red, painful eye after a thorn injury" },
      {
        type: "paragraph",
        text: "A farmer has three weeks of pain and blurring after injury from a thorn. The cornea shows a dry, grey-white, elevated lesion with wispy feathery margins, a small hypopyon and two satellites. This is fungal keratitis: the indolent course, the dry elevated lesion with a feathery margin and the vegetable trauma are the diagnostic triad. Contrary to what a week of antibacterial drops suggests, this is not bacterial keratitis. The next step is to stop the antibiotic, scrape for KOH and fungal culture, and start intensive topical antifungal therapy, and to stop any steroid immediately.",
      },
      {
        type: "question",
        prompt: "Why is the distinction between bacterial and fungal keratitis a matter of hours rather than days?",
        answer: "Because bacteria soften the cornea and melt it rapidly, and a sterile corneal scrape taken after a week of antibacterial drops grows nothing, leaving the fungal infection to progress while the wrong therapy continues. Under steroid cover a fungal ulcer perforates in days; scrapes and fungal culture redirect the treatment.",
        explanation: "The pattern of disease, the risk factor and the tempo all point to the right organism before any laboratory result is available.",
      },

      { type: "heading", level: 2, text: "Keratoconus and corneal dystrophies" },
      {
        type: "definition",
        term: "Keratoconus",
        text: "A progressive, non-inflammatory thinning and forward conical protrusion of the central cornea, usually bilateral and asymmetrical, starting in adolescence and producing irregular astigmatism and eventual scarring.",
      },
      {
        type: "table",
        headers: ["Disease", "Layer affected", "Clinical picture", "Management"],
        rows: [
          ["Keratoconus", "Stroma", "Irregular astigmatism and progressive myopia with high astigmatism on refraction, Munson sign, Vogt striae and Fleischer ring; acute episodes of pain and sudden blurring when the cornea hydrops", "Gas-permeable contact lenses in the early phase; corneal collagen cross-linking to arrest progression; deep anterior lamellar or penetrating keratoplasty for advanced scarring"],
          ["Fuchs endothelial dystrophy", "Endothelium", "Morning haze clearing through the day, guttae on the endothelium, oedema and stromal haze in late phases", "Hypertonic saline for the oedema; endothelial keratoplasty (DSAEK or DMEK) once vision is limited"],
          ["Lattice and granular stromal dystrophies", "Stroma", "Recurrent and progressive cloudy deposits in the stroma with recurrent erosions", "Lubricants, phototherapeutic keratectomy or keratoplasty if vision is limited"],
          ["Map-dot-fingerprint dystrophy", "Epithelium and basement membrane", "Recurrent erosions and irregular astigmatism", "Lubricants, bandage contact lens, excimer laser ablation for recurrent erosions"],
          ["Band keratopathy", "Bowman layer", "A horizontal, opaque, chalky deposit in the interpalpebral cornea", "Chelation with ethylenediaminetetraacetic acid; treat the cause (chronic iritis, hypercalcaemia, uraemia)"],
        ],
      },

      { type: "heading", level: 2, text: "Sclera: two different diseases" },
      {
        type: "table",
        headers: ["Feature", "Episcleritis", "Scleritis"],
        rows: [
          ["Depth of vessels", "Congested episcleral vessels in a superficial layer", "Deep scleral vessels under a violaceous, violet injection"],
          ["Pain", "Usually mild or absent", "Severe, boring pain that wakes the patient from sleep, radiating to the brow and jaw"],
          ["Colour and blanch test", "Salmon-pink, blanches with topical phenylephrine", "Violet or bluish, does not blanch fully"],
          ["Vision", "Normal", "Normal or severely reduced when posterior, necrotising or with uveitis"],
          ["Threat", "Benign and self-limiting", "Sight-threatening: scleral thinning with a staphyloma, scleromalacia perforans, corneal melt and uveitis"],
          ["Associations", "Usually idiopathic, occasionally gout or rosacea", "Rheumatoid arthritis, granulomatosis with polyangiitis, systemic lupus erythematosus, polyarteritis nodosa, herpes zoster, gout, tuberculosis"],
          ["Management", "Reassurance, artificial tears, a short course of topical or oral NSAIDs", "Systemic anti-inflammatory therapy (oral NSAIDs, corticosteroids, immunosuppression) with urgent referral for the necrotising and posterior forms"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "A deeply painful, violet red eye that blanches poorly and wakes the patient at night is scleritis until proven otherwise. It is not pink eye and it is not a simple conjunctivitis: it implies an underlying systemic vasculitis, and both the eye and the patient need systemic treatment.",
      },

      { type: "heading", level: 2, text: "Uveitis: inflammation of the uveal tract" },
      {
        type: "definition",
        term: "Uveitis",
        text: "Inflammation of the uveal tract — iris and ciliary body (anterior), pars plana and vitreous (intermediate), choroid and retina (posterior) — classified anatomically, by course (acute, chronic, recurrent) and by histology (granulomatous versus non-granulomatous).",
      },
      {
        type: "paragraph",
        text: "Anterior uveitis is the commonest and the most examinable: the eye is ciliary-injected, photophobic and painful, with cells and flare in the anterior chamber, keratic precipitates on the endothelium, a small sluggish pupil and posterior synechiae. Its associations are worth learning because half of the answer to a case is the systemic history: the HLA-B27 spondyloarthropathies, sarcoidosis, rheumatoid arthritis, juvenile idiopathic arthritis, Behcet disease, syphilis, tuberculosis and trauma. Recurrent acute anterior uveitis with no obvious cause in a young man is ankylosing spondylitis until proven otherwise.",
      },
      {
        type: "table",
        headers: ["Anatomic site", "Signs", "Associated diseases", "Management"],
        rows: [
          ["Anterior (iritis and iridocyclitis)", "Cells and flare, keratic precipitates (fine or greasy), miotic pupil, posterior synechiae, hypopyon in severe cases", "HLA-B27 (ankylosing spondylitis, reactive arthritis, psoriatic and inflammatory bowel arthropathies), sarcoid, juvenile idiopathic arthritis, Behcet, syphilis, tuberculosis, trauma", "Topical corticosteroid with a cycloplegic, after excluding herpetic disease; treat the systemic disease; mydriatics prevent synechiae"],
          ["Fuchs heterochromic iridocyclitis", "Mild stellate keratic precipitates, heterochromia (the affected eye is lighter), cataract and absence of synechiae", "No systemic association", "Cataract surgery if indicated; no steroid needed; watch for secondary glaucoma"],
          ["Intermediate (pars planitis)", "Snowballs in the inferior vitreous and a snowbank over the pars plana, macular oedema", "Sarcoidosis, multiple sclerosis, Lyme disease; often idiopathic in young adults", "Periocular or systemic corticosteroid for macular oedema; immunosuppression for refractory disease"],
          ["Posterior (retinochoroiditis)", "Focal retinochoroiditis with vitreous haze (a headlight in the fog for toxoplasmosis), serpiginous choroiditis, birdshot or Vogt-Koyanagi-Harada disease", "Toxoplasma, Toxocara, tuberculosis, syphilis, sarcoidosis, viral retinitis (cytomegalovirus, herpes simplex, varicella-zoster)", "Anti-infective where applicable; systemic corticosteroids and immunosuppression for immune posterior uveitis"],
          ["Panuveitis", "Inflammation in both anterior and posterior chambers", "Vogt-Koyanagi-Harada (bilateral granulomatous disease with serous detachments, vitiligo and meningism), sympathetic ophthalmia after penetrating injury, sarcoidosis, Behcet, endophthalmitis", "Systemic corticosteroids and immunosuppression, with urgent referral; sympathetic ophthalmia is prevented by prompt closure of the injured eye"],
        ],
      },
      {
        type: "definition",
        term: "Sympathetic ophthalmia",
        text: "A bilateral granulomatous panuveitis that follows penetrating injury or surgery to one eye, characteristically after a latent interval of weeks to months, and preventable only by prompt repair of the injured eye, or by enucleation within a critical window of severe injury.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Any penetrating injury to one eye threatens the other. Sympathetic ophthalmia is bilateral blindness from an apparently trivial injury, and it is prevented by prompt closure of the wound and by enucleation of a hopeless eye within about two weeks.",
      },

      { type: "heading", level: 2, text: "Complications of uveitis" },
      {
        type: "table",
        headers: ["Complication", "Mechanism"],
        rows: [
          ["Posterior synechiae and iris bombé", "Adhesions of the pupil margin to the lens that block aqueous flow and bow the iris forward, causing secondary angle closure"],
          ["Secondary glaucoma", "Inflammatory debris blocking the trabecular meshwork, steroid response, or synechial closure of the angle"],
          ["Complicated cataract", "Inflammation-induced cataract, or steroid cataract from chronic therapy"],
          ["Cystoid macular oedema", "Breakdown of the blood-retinal barrier with fluid accumulation at the fovea, the commonest cause of visual loss in uveitis"],
          ["Band keratopathy", "Calcium deposition in Bowman layer in chronic anterior uveitis, classically juvenile idiopathic arthritis"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Dispensing topical steroids for a red eye with a dendritic epithelial ulcer. Steroids suppress the antiviral response and enlarge the ulcer across the cornea to a geographic shape, as well as risking secondary infection. Infection is excluded before any steroid is prescribed.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating a newly diagnosed anterior uveitis as a purely ocular disease. Half of the diagnoses hide a systemic disease — back pain and stiffness, bowel or genitourinary symptoms, psoriasis, sarcoid features — and these patients need a targeted history and, when recurrent, systemic investigation.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Calling every red painful eye conjunctivitis. Deep boring pain, a violet hue, a poorly blanching injection and pain at night are scleritis, a systemic vasculitis; the eye is treated with anti-inflammatory therapy and the patient with vasculitis assessment.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting the fellow eye after penetrating trauma. Sympathetic ophthalmia converts a unilateral injury into bilateral blindness, and the prevention is prompt surgical closure of the wound rather than prolonged observation.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A patient with ankylosing spondylitis develops a deeply injected, painful, photophobic eye. What would a slit lamp show and how would you treat it?",
        answer: "Cells and flare in the anterior chamber, keratic precipitates on the inferior corneal endothelium, a small sluggish pupil and a circumcorneal (ciliary) injection — acute anterior uveitis. Treatment is a topical corticosteroid with a cycloplegic (to relieve pain and prevent posterior synechiae), after herpetic disease has been excluded, plus treatment of the systemic disease.",
        explanation: "The association with HLA-B27 spondyloarthropathies is one of the most frequently asked facts in ophthalmic examinations.",
      },
      {
        type: "question",
        prompt: "How does Fuchs heterochromic iridocyclitis differ from other anterior uveitides, and why does this matter?",
        answer: "It causes heterochromia (the affected eye is lighter), mild stellate keratic precipitates, cataract and iris atrophy, with no posterior synechiae and no pain, and it requires no steroid treatment. This matters because the cataract is the treatable part and because over-treatment with steroids causes the side effects (raised pressure and secondary cataract) without benefit.",
        explanation: "The absence of synechiae and the mild, quiet, chronic course distinguish it from typical anterior uveitis.",
      },
      {
        type: "question",
        prompt: "A patient with rheumatoid arthritis has a violet, deeply red, painful eye that wakes them at night and does not blanch fully. What is the diagnosis and the extraocular step that must follow?",
        answer: "Scleritis — deep scleral inflammation with vasodilatation of the deep vessels causing a violaceous hue that blanches poorly and pain at night. It is frequently associated with systemic vasculitis (rheumatoid arthritis, granulomatosis with polyangiitis, systemic lupus, polyarteritis nodosa) and needs systemic anti-inflammatory therapy and a vasculitis work-up, not topical treatment alone.",
        explanation: "Episcleritis, by contrast, is a benign salmon-pink sectoral injection with little or no pain that blanches with phenylephrine.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A patient with known ankylosing spondylitis develops a deeply injected, painful, photophobic eye. Slit-lamp examination shows cells and flare in the anterior chamber, keratic precipitates on the inferior corneal endothelium, and a small, sluggish pupil. What is the diagnosis and how is it treated?",
        options: [
          "Bacterial conjunctivitis — topical fluoroquinolone for a week",
          "Acute anterior uveitis — topical corticosteroid with a cycloplegic, after excluding infective keratitis, plus systemic assessment of the underlying disease",
          "Scleritis — oral non-steroidal anti-inflammatory drugs and topical antifungals",
          "Episcleritis — reassurance and a topical vasoconstrictor",
        ],
        correctIndex: 1,
        explanation: "Cells and flare with keratic precipitates and a miotic pupil in a ciliary-injected eye is acute anterior uveitis, treated with topical steroid and a cycloplegic to prevent synechiae, after infection (particularly herpetic disease) is excluded. Ankylosing spondylitis is the classic HLA-B27 association.",
      },
      {
        type: "mcq",
        stem: "A farmer has had a progressively painful eye for three weeks after injury from a thorn. The cornea shows a dry, grey-white elevated lesion with feathery margins, a small hypopyon and satellite infiltrates. Which diagnosis and management are correct?",
        options: [
          "Bacterial keratitis — continue topical fluoroquinolone for two weeks",
          "Herpes simplex keratitis — topical aciclovir alone",
          "Fungal keratitis — stop any steroid, scrape for KOH and fungal culture, and start intensive topical antifungal therapy such as natamycin",
          "Acanthamoeba keratitis — topical chlorhexidine and no antifungal or antibiotic",
        ],
        correctIndex: 2,
        explanation: "Vegetable injury, an indolent course, a dry elevated lesion with feathery margins and satellite infiltrates are the classic signs of fungal keratitis. Management requires stopping steroid, taking scrapes for KOH and culture, and prolonged topical antifungal therapy; antibiotics and antivirals do not treat it, and Acanthamoeba follows water exposure with pain out of proportion.",
      },
      {
        type: "mcq",
        stem: "Which statement about the difference between episcleritis and scleritis is correct?",
        options: [
          "Episcleritis is the one that threatens sight, because it causes scleral perforation",
          "Scleritis is the one that threatens sight, with pain at night, a violaceous hue, poor blanching and an underlying systemic vasculitis such as rheumatoid arthritis",
          "The two cannot be distinguished clinically and both are treated the same",
          "Scleritis blanches fully with topical phenylephrine and episcleritis does not",
        ],
        correctIndex: 1,
        explanation: "Scleritis causes deep boring pain that wakes the patient, a violaceous injection that blanches poorly, and is associated with connective tissue disease and vasculitis; it is sight-threatening and requires systemic anti-inflammatory treatment. Episcleritis is a benign salmon-pink injection that blanches fully.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The cornea is a transparent, avascular collagen lattice held dehydrated by its endothelium; infection here — bacterial, herpetic, fungal or acanthamoebic — is differentiated by its risk factor and its appearance, and heals by scar. Keratoconus and the endothelial dystrophies deform the cornea or its pump, and scleritis (unlike benign episcleritis) is a sight-threatening manifestation of systemic vasculitis. Uveitis is classified anatomically, and anterior uveitis with keratic precipitates, a miotic pupil and cells and flare is associated with HLA-B27 disease, sarcoidosis, Behcet, syphilis and trauma; its complications — synechiae, glaucoma, cataract and macular oedema — are what destroy vision.",
      },
      {
        type: "paragraph",
        text: "Next: the lens and cataract — the commonest cause of treatable blindness worldwide, and the operation that treats it, with its indications, technique, complications and the situation where the eye is clear but the patient still cannot see.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 6 — Lens & cataract (fully authored)
// ---------------------------------------------------------------------------
function lesson6() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the structure of the crystalline lens, how accommodation works and why the lens opacifies with age, diabetes and steroids; classify cataracts by morphology and cause; state the symptoms of cataract and how they are distinguished from retinal disease; list the absolute indications for cataract surgery and the preoperative assessment that must precede it; describe the modern surgical techniques and the main early and late complications; and define posterior capsule opacification and its management.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 5 (Cornea, sclera and uveitis). Cataract is a complication of uveitis, steroid treatment and corneal disease, and you need the corneal and endothelial evaluation from that lesson before deciding to operate.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Cataract",
        text: "Any opacity of the crystalline lens that degrades the quality of the image projected on the retina. The word means a loss of optical clarity, not a degree of visual failure: a minor cortical spoke may be clinically irrelevant while a posterior subcapsular opacity at the nodal point is devastating.",
      },
      {
        type: "paragraph",
        text: "The lens is a unique organ: it is avascular, it has no nerves (so it does not hurt), it grows throughout life without shedding its cells, and it is entirely dependent on the nutrient flow of the aqueous for its metabolism. Opacification follows from that biology. Old cells cannot be discarded, so they accumulate at the centre and become compressed and yellow (nuclear sclerosis). The cortex swells and scatters light as metabolism fails with age, diabetes or steroid exposure. Because the lens sits at the eye's nodal point, opacities there — posterior subcapsular — do more optical damage per square millimetre than anywhere else.",
      },

      { type: "heading", level: 2, text: "The lens and how accommodation works" },
      {
        type: "table",
        headers: ["Structure", "Function", "Clinical relevance"],
        rows: [
          ["Lens capsule", "A transparent basement membrane enclosing the lens, thickest anteriorly and posteriorly at the periphery", "Preserved in every modern operation; the intraocular lens sits in the bag it forms"],
          ["Lens epithelium", "A single layer of cells under the anterior capsule that generates all new lens fibres", "Their aberrant migration and proliferation produces posterior capsule opacification"],
          ["Cortex and nucleus", "The bulk of the lens; the nucleus is the hard central core, laid down in embryonic life", "Nuclear sclerosis is the yellowish hardening of the nucleus in old age; cortical spokes are the peripheral opacities"],
          ["Zonular fibres (suspensory ligament)", "Hold the lens in tension, transferring ciliary muscle force to the lens", "Weak in pseudoexfoliation and Marfan syndrome, so the lens subluxates; a broken bag complicates cataract surgery"],
          ["Ciliary muscle", "Contracts to relax the zonules, letting the elastic lens become more convex", "Its failure with age produces presbyopia; pilocarpine mimics it to treat angle closure"],
        ],
      },

      { type: "heading", level: 2, text: "Classification of cataract" },
      {
        type: "table",
        headers: ["Type", "Morphology and cause", "Clinical features"],
        rows: [
          ["Age-related (senile)", "Cortical, nuclear or posterior subcapsular; the commonest cause of blindness worldwide and the commonest cataract in India", "Gradual painless blur, worsening glare (driving at night, sunlight), a need for brighter reading light and frequent changes of prescription"],
          ["Cortical", "Spoke-like opacities in the cortex with vacuoles and clefts, often in diabetics", "Glare and light scatter, with blur that changes as the pupil size changes"],
          ["Nuclear", "Sclerosis and yellowing of the nucleus, progressing to brunescent", "A myopic shift so that the patient reads better without glasses (second sight), with progressive haze and colour shift"],
          ["Posterior subcapsular", "A granular opacity beneath the posterior capsule at the nodal point, classically from systemic or inhaled steroids and radiotherapy", "Disproportionate visual loss with severe glare for a small opacity; the most visually disabling type"],
          ["Metabolic — diabetic", "Accumulation of sorbitol from the aldose reductase pathway; worsens and regresses with glucose control", "Snowflake opacities and rapid onset; specific indication for attention in diabetics"],
          ["Traumatic", "Contusion (Vossius ring, rosette), penetrating injury and foreign bodies", "Often unilateral and sectoral; may be complicated by glaucoma, uveitis, dislocation or a retinal injury"],
          ["Complicated", "Secondary to uveitis, high myopia, retinal detachment or glaucoma", "A posterior subcapsular pattern with a poor surgical prognosis"],
          ["Post-surgical", "Steroid response, and secondary opacification after vitrectomy", "Recognised and anticipated; withdrawal of the offending agent where possible"],
        ],
      },

      { type: "heading", level: 2, text: "Symptoms, signs and differential" },
      {
        type: "table",
        headers: ["Feature", "Cataract", "The alternative that must be excluded"],
        rows: [
          ["Mode of visual loss", "Gradual, over months to years, painless, usually bilateral but symmetrical", "Sudden loss in retinal detachment, vein occlusion or vitreous haemorrhage"],
          ["Glare", "Marked, with halos and starbursts, especially at night when the pupil dilates", "Corneal oedema — which also causes glare but is associated with a hazy cornea and a hard or painful eye"],
          ["Monocular diplopia", "Present (multiple blurred images in one eye)", "Refractive astigmatism or corneal irregularity — which the pinhole test corrects"],
          ["Colour vision", "Yellowing and fading, with blue loss in the brunescent lens", "Optic nerve disease — which shows colour loss and a relative afferent pupillary defect"],
          ["Red reflex", "A dim, irregular or absent red reflex", "Vitreous haemorrhage, retinal detachment, retinoblastoma — all invisible fundus"],
          ["Examination of the fundus", "Possible only when the cataract is not dense", "If the fundus cannot be seen, the retina must be assessed ultrasonographically"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The white pupil (leukocoria) of a mature cataract must be differentiated from retinoblastoma in a child, from a retinal detachment or an intraocular tumour in an adult. An absent red reflex is an examination finding that demands an explanation.",
      },

      { type: "heading", level: 2, text: "Worked example: the myope who stops needing her glasses" },
      {
        type: "paragraph",
        text: "A 66-year-old woman who has worn distance spectacles all her life reports that she can now read without them and that everything looks yellow. Her distance vision has, however, blurred. This is nuclear sclerosis: the hardening and yellowing of the nucleus increases its refractive index, producing a myopic shift (second sight), while the loss of transparency degrades contrast and colour. The correction is not a new prescription, because the optical quality of the medium itself is failing — this is the point at which cataract extraction is discussed.",
      },
      {
        type: "question",
        prompt: "Why does nuclear sclerosis cause a myopic shift while posterior subcapsular cataract causes glare without a refractive change?",
        answer: "Nuclear sclerosis increases the refractive index and curvature of the lens nucleus, so its optical power rises and the focal point moves forwards, moving the eye into myopia. A posterior subcapsular opacity lies at the nodal point of the eye, where it scatters light in all directions without meaningfully changing total optical power, so the patient suffers glare and contrast loss rather than a refractive shift.",
        explanation: "Position and refractive effect determine which symptoms an opacity produces — this is why posterior subcapsular cataract is so disproportionately disabling.",
      },

      { type: "heading", level: 2, text: "Indications for surgery" },
      {
        type: "paragraph",
        text: "The old rule — operate when the cataract is mature — has been abandoned. A modern decision is based on visual function, not on the appearance of the lens, and it is made together with the patient's own needs. Two categories exist: indications to improve vision, and indications to treat the eye.",
      },
      {
        type: "table",
        headers: ["Indication", "Rationale"],
        rows: [
          ["Reduced visual acuity not correctable by spectacles, compromising the patient's function", "The modern standard: cataract surgery is offered when the cataract limits the patient's ability to work, read, drive or live independently"],
          ["Glare disability despite good acuity", "The clinical impact of glare is what matters, not the Snellen chart"],
          ["Cataract preventing the management of retinal disease", "The fundus must be visible to treat diabetic retinopathy or glaucoma"],
          ["Cataract causing phacomorphic glaucoma", "An intumescent (swollen) lens closes the angle and obstructs outflow — surgery is the treatment"],
          ["Phacolytic glaucoma", "A hypermature (leaking) lens liberates lens protein that obstructs the trabecular meshwork"],
          ["Traumatic cataract with lens injury or a ruptured capsule", "Inflammation, secondary glaucoma and retinal injury follow unless the lens is managed"],
          ["Congenital cataract obscuring the visual axis", "A dense congenital cataract must be removed within the critical period of visual development or amblyopia becomes irreversible"],
          ["Lens-related disease planning (e.g. before a corneal transplant)", "A cataract would obscure the surgical assessment and outcome of the corneal graft"],
        ],
      },

      { type: "heading", level: 2, text: "Preoperative assessment" },
      {
        type: "table",
        headers: ["Assessment", "Why it matters"],
        rows: [
          ["Best-corrected visual acuity and refraction", "Establishes whether the cataract, rather than retinal or optic nerve disease, is the cause of visual failure"],
          ["Slit-lamp examination", "Grades the cataract, looks for pseudoexfoliation, small pupils, corneal guttae and phacodonesis that would complicate surgery"],
          ["Intraocular pressure and disc examination", "Detects glaucoma, which changes the surgical plan (combined cataract and glaucoma surgery) and the prognosis"],
          ["Corneal examination and endothelial count", "Compromised endothelium in Fuchs dystrophy predicts decompensation if surgery is performed"],
          ["Dilated fundus examination, or B-scan ultrasound if the media are opaque", "Excludes retinal detachment, macular disease and a tumour that would determine the prognosis"],
          ["Biometry — axial length and keratometry", "Determines the intraocular lens power that will be implanted, and therefore the postoperative refractive outcome"],
          ["Medical assessment (glycaemic control, blood pressure, anticoagulation, medication)", "Reduces perioperative risk; anticoagulation is managed by the treating team rather than simply stopped"],
          ["Dilation and the consent process", "The risks (endophthalmitis, retinal detachment, cystoid macular oedema, posterior capsule rupture) are discussed and documented"],
        ],
      },
      {
        type: "definition",
        term: "Intraocular lens (IOL)",
        text: "An artificial lens implanted after cataract removal, made of acrylic or silicone with haptics that hold it in the capsular bag. The power is calculated from the patient's axial length and corneal curvature to target a chosen postoperative refraction.",
      },

      { type: "heading", level: 2, text: "Surgical technique" },
      {
        type: "table",
        headers: ["Technique", "What is done", "Where it is used"],
        rows: [
          ["Phacoemulsification with foldable IOL", "A 2-3 mm incision, capsulorhexis, ultrasonic fragmentation of the nucleus with irrigation and aspiration of the cortex, and a foldable lens implanted in the bag; the incision is self-sealing", "The standard technique in centres with the equipment; the small incision gives faster rehabilitation and less induced astigmatism"],
          ["Manual small-incision cataract surgery (SICS)", "A larger self-sealing tunnel, expression of the nucleus intact, and irrigation-aspiration of the cortex; no machine is required", "The technique preferred for high-volume surgical programmes and hard nuclei in low-resource settings, and the mainstay of large camp programmes"],
          ["Extracapsular cataract extraction", "A larger incision with expression of the nucleus and a rigid IOL", "Superseded but still used for very dense nuclei"],
          ["Intracapsular extraction", "Removal of the entire lens with its capsule", "Largely abandoned; occasionally for a dislocated lens"],
        ],
      },
      {
        type: "paragraph",
        text: "Anaesthesia is topical, regional (peribulbar or retrobulbar block) or general in children and uncooperative patients. Antibiotic prophylaxis is given into the anterior chamber at the end of surgery in some services. Postoperatively the patient uses a topical antibiotic and a short course of steroid, wears a shield at night for the first week, and is instructed to avoid heavy lifting, straining, swimming and rubbing the eye. Refraction is measured after the eye has settled, and a spectacle may be needed for near work.",
      },

      { type: "heading", level: 2, text: "Complications" },
      {
        type: "table",
        headers: ["When", "Complication", "Recognition and management"],
        rows: [
          ["Intraoperative", "Posterior capsule rupture with or without vitreous loss; dropped nucleus", "The red reflex breaks, the nucleus sinks, and anterior vitrectomy is performed with removal of the retained fragments; the IOL is placed in the sulcus or the anterior chamber as appropriate"],
          ["Intraoperative", "Suprachoroidal haemorrhage; descemet detachment; thermal wound burn", "Recognised intraoperatively and managed with closure and tamponade"],
          ["Early postoperative", "Infective endophthalmitis (usually Staphylococcus epidermidis, presenting within days)", "Deep pain and falling vision with hypopyon; emergency vitreous tap and intravitreal antibiotics; the outcome is poor when presentation is delayed"],
          ["Early postoperative", "Corneal oedema and raised intraocular pressure", "May settle with treatment; persistent corneal decompensation may require endothelial keratoplasty"],
          ["Early and late", "Posterior capsule opacification (secondary cataract)", "The commonest late complication: Elschnig pearls and fibrosis reduce vision months to years after surgery, treated by a YAG laser capsulotomy"],
          ["Late", "Cystoid macular oedema (Irvine-Gass syndrome); retinal detachment; malpositioned IOL; dysphotopsia; refractive surprise", "Retinal detachment classically occurs months to years later, and the patient must be told to report floaters, flashes and a curtain"],
          ["Anytime", "Refractive error, including anisometropia and glare", "Refraction and, where appropriate, a secondary IOL or corneal laser correction"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Never assume that a patient whose vision has deteriorated after successful cataract surgery has developed another cataract. An opaque capsule can be opened with a laser, but the causes that most often masquerade as recurrence are macular disease, retinal detachment, glaucoma and, in a diabetic, macular oedema — all of which need a dilated fundus examination.",
      },

      { type: "heading", level: 2, text: "Special situations" },
      {
        type: "table",
        headers: ["Situation", "Considerations"],
        rows: [
          ["Cataract with diabetes", "Higher risk of macular oedema and progression of retinopathy after surgery; the diabetic patient should have stable control and a preoperative retinal assessment; the patient must be told to expect cataract surgery before future retinal surgery is possible"],
          ["Cataract with glaucoma", "Combined cataract and glaucoma surgery may be planned; the presence of a small pupil, pseudoexfoliation or a compromised endothelium changes the operative plan"],
          ["Cataract with uveitis", "Requires prophylaxis against rebound inflammation and preoperative control with steroid; topical NSAIDs after surgery to prevent macular oedema"],
          ["Cataract in high myopia", "A high axial length carries a higher risk of retinal detachment after surgery; the biometry requires different formulae"],
          ["Congenital cataract", "One eye operated before the other; amblyopia therapy with correction and occlusion is the determinant of visual outcome, not the surgery"],
          ["Cataract after intravitreal steroid or in pseudoexfoliation", "A soft nucleus and fragile zonules raise the risk of capsular rupture; the surgeon must be prepared"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Waiting for the cataract to be mature. Modern surgery is offered when the patient can no longer see well enough to do what matters, and mature lenses are harder to operate on, with a higher risk of complications and a longer recovery.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Operating before the retina has been assessed. A dense cataract prevents a view of the fundus, so biometry, pupillary response and B-scan ultrasound are used to predict the visual outcome; a patient whose vision does not improve after a good operation has almost always had macular disease all along.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Doing a YAG capsulotomy for a capsule that has not been central to the problem, or performing one on an eye with a recent haemorrhage or uveitis. The capsulotomy is the correct treatment for posterior capsule opacification, but poor outcome often means retinal disease that needs examination instead of another laser.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Giving a myopic patient new spectacles to overcome a developing nuclear cataract. The myopic shift is the cataract progressing, and the correction is transitory while the lens continues to harden and yellow.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A patient reports that her vision is blurred mainly in bright sunlight and at night, but that she reads well without her usual distance glasses. Which type of cataract is this and why?",
        answer: "Nuclear sclerosis. The hardening and yellowing of the nucleus increases its refractive index and produces a myopic shift, which improves the unaided near vision and blurs the distance; glare and halos are caused by light scatter through the hazy nucleus and are worse when the pupil dilates, so bright light and night driving are the worst situations.",
        explanation: "The combination of improved near vision and progressive glare is the signature of nuclear sclerosis, and it is the classical presentation for the decision to operate.",
      },
      {
        type: "question",
        prompt: "Which two systemic situations complicate cataract surgery most, and what additional step does each require?",
        answer: "Diabetes — which predisposes to endophthalmitis, postoperative macular oedema and progression of retinopathy, requires good glucose control and a retinal assessment before surgery. Glaucoma — where coexisting optic neuropathy limits the postoperative visual outcome and uveitis may rebound after surgery, requires intraocular pressure control, a combined surgical plan and steroid cover respectively.",
        explanation: "Cataract does not occur in isolation; the coexisting disease determines both the surgical plan and the prognosis.",
      },
      {
        type: "question",
        prompt: "What is posterior capsule opacification, why does it occur, and how is it treated?",
        answer: "It is the fibrosis and proliferation of residual lens epithelial cells left behind after cataract extraction, which makes the posterior capsule cloudy and mimics recurrence of the cataract. It occurs because epithelial cells always remain in the capsular bag after surgery. It is treated painlessly by a YAG laser capsulotomy (a posterior capsulotomy), which restores the view of the retina immediately.",
        explanation: "The distinction between posterior capsule opacification (treatable with a laser) and a new media opacity or retinal disease is central to managing the cataract patient long-term.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A 65-year-old has a best-corrected visual acuity of 6/36 with glare and difficulty reading, due to a dense nuclear cataract in an otherwise healthy eye. What is the modern standard surgical treatment?",
        options: [
          "Wait until the cataract is fully mature, then perform intracapsular extraction",
          "Phacoemulsification with irrigation and aspiration and implantation of a monofocal posterior chamber intraocular lens",
          "Prescribe a concave minus lens and annual observation with no operation",
          "Perform a YAG laser capsulotomy to clear the opacity",
        ],
        correctIndex: 1,
        explanation: "The standard surgical treatment for a visually significant cataract is phacoemulsification (a small incision with ultrasonic fragmentation of the nucleus) and implantation of a posterior chamber IOL in the capsular bag. Waiting for maturity is obsolete, spectacles do not treat cataract, and capsulotomy treats posterior capsule opacification after surgery, not cataract.",
      },
      {
        type: "mcq",
        stem: "Which type of cataract is characteristically induced by long-term systemic corticosteroid therapy, and why is it particularly visually disabling?",
        options: [
          "Nuclear sclerosis — because it increases the refractive index of the lens",
          "Posterior subcapsular cataract — because it sits at the nodal point of the eye where it scatters light disproportionately",
          "Cortical spoke cataract — because it obstructs the visual axis from the periphery",
          "Intumescent (swollen) cataract — because it closes the drainage angle",
        ],
        correctIndex: 1,
        explanation: "Corticosteroids classically cause a posterior subcapsular opacity, which lies at the nodal point of the eye and therefore causes severe glare and disproportionate visual loss out of proportion to its size. Nuclear sclerosis is age-related; cortical spokes are age-related and diabetic; an intumescent lens causes phacomorphic angle closure.",
      },
      {
        type: "mcq",
        stem: "A patient reports that vision in one eye has deteriorated two years after successful cataract surgery. What is the most likely cause and the correct first step?",
        options: [
          "A new cataract has regrown — arrange a YAG capsulotomy",
          "Posterior capsule opacification — confirm it as the cause on slit-lamp examination, then treat it with a YAG capsulotomy",
          "Retinal detachment — refer directly for emergency retinal examination without dilated examination",
          "Ignore it — it is the natural ageing of the eye",
        ],
        correctIndex: 1,
        explanation: "Delayed loss of vision after cataract surgery is most commonly posterior capsule opacification, caused by proliferation of residual lens epithelial cells, and it is treated with a YAG capsulotomy. However, the capsule must be examined first, because macular disease, glaucoma, retinal detachment and diabetic macular oedema all mimic it, and retinal detachment in a pseudophakic eye demands the full dilated fundus examination described later.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The lens is avascular, nerveless and grows throughout life, which is why it opacifies: nuclear sclerosis with age, cortical spokes in diabetes, and the disproportionately disabling posterior subcapsular opacity of steroid therapy. Cataract is diagnosed from its symptoms — gradual painless blur, glare, monocular diplopia and a shifting prescription — and surgery is indicated when the patient's function fails or when the eye is threatened (phacomorphic glaucoma, a leaking lens, retinal disease to be treated, or a visually blinding congenital cataract). Phacoemulsification with a posterior chamber IOL is the technique of choice; endophthalmitis is the disaster of the first week and posterior capsule opacification the commonest late event, treated by laser capsulotomy.",
      },
      {
        type: "paragraph",
        text: "Next: glaucoma — the other great cause of irreversible blindness, where the optic nerve is slowly strangled by pressure and the whole art of management is early detection before the field is gone.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 7 — Glaucoma (fully authored)
// ---------------------------------------------------------------------------
function lesson7() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the production and drainage of aqueous humour and name the angle structures through which it leaves the eye; define glaucoma and the difference between an elevated intraocular pressure and glaucomatous optic neuropathy; measure the pressure by applanation tonometry and assess the angle by gonioscopy; recognise the optic disc changes of glaucomatous excavation and the pattern of visual field loss; classify the glaucomas and identify which types are emergencies; and outline the medical, laser and surgical treatment of intraocular pressure.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 6 (Lens and cataract). An intumescent or hypermature lens produces phacomorphic and phacolytic glaucoma, and the swollen lens of age is the anatomical reason many angles are narrow.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Glaucoma",
        text: "An optic neuropathy characterised by the progressive loss of retinal ganglion cells and nerve fibres, producing a characteristic pattern of optic disc excavation and visual field loss; raised intraocular pressure is the principal risk factor, but it is neither sufficient nor necessary for the diagnosis.",
      },
      {
        type: "paragraph",
        text: "The optic nerve head is a mechanical structure under pressure. Every day the ciliary body secretes aqueous, it flows through the pupil into the anterior chamber, and it drains across the trabecular meshwork into Schlemm canal. If secretion continues and drainage is obstructed, pressure rises and the nerve fibres passing through the lamina cribrosa are strangled — first the peripheral fibres (arcuate field loss and a nasal step), then the papillomacular fibres (central vision), and finally the whole disc is a hollow cup. The clinical consequence is devastating and simple: glaucoma is painless, it takes peripheral vision first, and by the time the patient notices that they are bumping into doorframes the damage is irreversible. This is why the eye doctor looks for glaucoma in everyone over forty and in every diabetic, not just in those who complain.",
      },

      { type: "heading", level: 2, text: "Aqueous dynamics" },
      {
        type: "table",
        headers: ["Component", "Role", "Clinical consequence"],
        rows: [
          ["Ciliary body epithelium", "Secretes about 2-3 microlitres of aqueous per minute by active secretion and ultrafiltration", "Uveitis and trauma may suppress secretion, giving hypotony; inflammation blocks the trabecular meshwork and raises pressure"],
          ["Pupillary aperture", "The route between posterior and anterior chambers; a site of block if the lens is swollen or the iris is inflamed", "Pupillary block in angle closure produces iris bombé and angle closure"],
          ["Trabecular meshwork (with juxtacanalicular tissue and Schlemm canal)", "Drains roughly 90 per cent of the aqueous under a pressure gradient", "The outflow resistance point in open-angle glaucoma; obstruction by pigment, exfoliative material, red cells, macrophages or inflammatory debris causes secondary glaucoma"],
          ["Uveoscleral pathway", "Drains about 10 per cent directly through the ciliary muscle and sclera", "The target of prostaglandin analogues, the most potent topical agents"],
          ["Episcleral veins", "Receive aqueous from Schlemm canal and return it to the circulation", "Raised episcleral venous pressure in carotid-cavernous fistula and Sturge-Weber syndrome raises intraocular pressure"],
        ],
      },
      {
        type: "definition",
        term: "Intraocular pressure (IOP)",
        text: "The pressure inside the eye, maintained by the balance of aqueous secretion and drainage, with a normal distribution of roughly 10 to 21 mmHg; it is measured by applanation tonometry and varies with diurnal rhythm, posture, blinking, corneal thickness and the force of measurement itself.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Corneal thickness changes the reading. A thick cornea gives a falsely high and a thin cornea a falsely low tonometry measurement, so the pressure is interpreted together with the pachymetry; and a single reading misses a patient whose pressure peaks overnight, which is why diurnal variation matters in suspicious cases.",
      },

      { type: "heading", level: 2, text: "Classification" },
      {
        type: "table",
        headers: ["Category", "Mechanism", "Examples"],
        rows: [
          ["Primary open-angle glaucoma", "Progressive optic neuropathy with an open angle, raised or normal pressure and a typical field defect", "The commonest glaucoma in most populations, and the cause of a silent, bilateral, irreversible blindness"],
          ["Primary angle-closure glaucoma", "Iris apposition to the trabecular meshwork that closes the angle, usually with a pupillary block", "Acute angle closure (an emergency), chronic angle closure and intermittent (subacute) closure"],
          ["Secondary open-angle glaucoma", "Obstruction or scarring of the trabecular meshwork with an open angle", "Pigmentary glaucoma, pseudoexfoliation, steroid response, ghost cell and haemolytic glaucoma, angle recession, uveitic glaucoma, elevated episcleral venous pressure"],
          ["Secondary angle-closure glaucoma", "Angle closure without a pupillary block", "Neovascular glaucoma (rubeosis from diabetes or vein occlusion), phacomorphic and phacolytic glaucoma, plateau iris, nanophthalmos, posterior segment tumours and retinal surgery"],
          ["Normal-tension glaucoma", "Glaucomatous optic neuropathy with pressures consistently below 21 mmHg", "Relates to vascular dysregulation, disc haemorrhage and nocturnal hypotension; lowering the pressure still helps"],
          ["Congenital and juvenile glaucoma", "A developmental abnormality of the angle (goniodysgenesis)", "Classic signs of photophobia, epiphora, blepharospasm and a buphthalmos (enlarged eye) from scleral stretching in infancy"],
        ],
      },

      { type: "heading", level: 2, text: "Worked example 1: the asymptomatic sixty-year-old" },
      {
        type: "paragraph",
        text: "A 60-year-old has pressures of 24-26 mmHg in both eyes at a routine examination. The optic discs show a vertically enlarged cup-to-disc ratio with superior and inferior polar notching and a flame-shaped haemorrhage at the disc margin, and automated perimetry shows an arcuate (Bjerrum) scotoma and a nasal step respecting the horizontal meridian. This is primary open-angle glaucoma at an early stage of field loss: the diagnosis is the appearance of the disc and the field, and the pressure is the risk factor being treated. No symptom had brought the patient to the clinic.",
      },
      {
        type: "question",
        prompt: "Why does an optic disc with a cup-to-disc ratio of 0.3 in a patient with a heavy family history of glaucoma, and a small nerve fibre haemorrhage, deserve the same suspicion as one with a ratio of 0.8?",
        answer: "Because glaucoma is a disease of nerve fibres, not of discs: a small cup with a nerve fibre haemorrhage and a family history is in the early stage of the same disease, and a delayed diagnosis means irreversible field loss. Glaucoma is diagnosed by the pattern of change over time, not by a single static measurement.",
        explanation: "Disc haemorrhage, notching of the rim and asymmetric cups are the signs of nerve loss that precede measurable field defects.",
      },

      { type: "heading", level: 2, text: "Diagnosis: disc, field, angle and pressure" },
      {
        type: "table",
        headers: ["Investigation", "What it shows", "Interpretation"],
        rows: [
          ["Optic disc evaluation (direct or slit-lamp examination)", "Vertical oval enlargement of the cup, thinning of the neural rim (ISNT rule), polar notching, bayoneting of vessels, splinter haemorrhages, peripapillary atrophy and parapapillary atrophy", "The single most important sign: the diagnosis begins here, and asymmetry of more than 0.2 between the two eyes is suspicious"],
          ["Retinal nerve fibre layer assessment (red-free ophthalmoscopy, OCT)", "Diffuse or wedge-shaped defects in the nerve fibre layer", "Wedge-shaped defects precede visible field loss by years"],
          ["Automated perimetry (Humphrey 24-2 programme)", "Paracentral scotomas, arcuate (Bjerrum) scotoma, nasal step, ring and double arcuate scotoma, and the central island of preserved vision", "The functional definition of progression; loss always respects the horizontal meridian and follows the nerve fibre pattern"],
          ["Gonioscopy (with the indentation technique)", "Schwalbe line, trabecular meshwork with pigment, scleral spur and ciliary body band", "Open-angle versus closed-angle, and the site of synechiae; the standard for deciding surgical approach"],
          ["Applanation tonometry (Goldmann)", "The current intraocular pressure with the central corneal thickness", "The risk factor being treated; serial measurements matter more than a single one"],
          ["Optical coherence tomography of the disc and macula", "Objective measurement of rim area, nerve fibre layer thickness and macular ganglion cell thickness", "Detects change earlier than the field and reduces the reliance on subjective testing"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "A myope, an elderly patient with atrophic discs, and a small, crowded disc with anomalous discs all mimic glaucomatous change — and an untreated real glaucoma is missed while doubt is entertained. The resolution is not one visit: tonometry, disc examination, imaging and perimetry over time distinguish progression from variation.",
      },

      { type: "heading", level: 2, text: "Worked example 2: acute angle closure" },
      {
        type: "paragraph",
        text: "A 60-year-old hypermetrope is brought in after several hours in a darkened cinema with severe unilateral pain, blurred vision with halos around lights, headache, nausea and vomiting. The eye is injected, the cornea is cloudy, the anterior chamber is shallow, the pupil is semi-dilated and fixed, and the pressure is 58 mmHg. This is acute angle closure: the pupil has blocked aqueous flow into the anterior chamber in an eye with a narrow angle, the iris has bowed forward and closed the trabecular meshwork. It is frequently misdiagnosed as migraine, acute abdomen or, worst of all, conjunctivitis — a mistake that costs the eye.",
      },
      {
        type: "table",
        headers: ["Feature", "What it is", "Relevance"],
        rows: [
          ["Predisposition", "Hypermetropes, small eyes, thick anterior lenses, elderly women and people of South-East Asian descent", "Screen with a shallow anterior chamber on penlight examination and refer for gonioscopy"],
          ["Precipitation", "Dim light, after straining, or use of anticholinergic/decongestant drops", "Ask about any new eye drops or allergy medicines"],
          ["Symptoms", "Severe pain with blurred vision, coloured halos from corneal oedema, headache, nausea and vomiting", "Haloes and vomiting are the two clues most often missed"],
          ["Signs", "Circumcorneal injection, cloudy cornea, shallow chamber, semi-dilated fixed oval pupil, high pressure and disc swelling", "An acute ocular emergency requiring same-hour treatment"],
          ["Late signs", "Glaukomflecken, iris atrophy with a spiral pattern, peripheral anterior synechiae and a pale disc", "Evidence of a subacute attack that has already occurred"],
        ],
      },
      {
        type: "paragraph",
        text: "Treatment begins within minutes: intravenous acetazolamide 500 mg plus a topical beta-blocker and an apraclonidine, oral glycerol or intravenous mannitol if needed, and a topical steroid with pilocarpine once the pressure has begun to fall — pilocarpine before the pressure is lowered has no effect because the compromised iris cannot contract. The definitive treatment is a peripheral laser iridotomy in both eyes, which relieves the pupillary block by creating an alternative route for aqueous to enter the anterior chamber. The fellow eye is treated prophylactically because its anatomy is the same.",
      },

      { type: "heading", level: 2, text: "Treatment of glaucoma" },
      {
        type: "table",
        headers: ["Class of treatment", "Mechanism", "Notes"],
        rows: [
          ["Prostaglandin analogues (latanoprost, travoprost, bimatoprost)", "Increase uveoscleral outflow; once at night is enough", "The most potent first-line topical agents, with fewer systemic effects than beta-blockers; caused macular oedema in uveitic eyes and iris darkening"],
          ["Beta-blockers (timolol, betaxolol)", "Reduce aqueous secretion", "Systemic bradycardia, bronchospasm, and masked hypoglycaemia; the commonest drops to be affected by asthma and heart block"],
          ["Alpha-2 agonists (brimonidine)", "Reduce secretion and increase uveoscleral outflow", "Allergic conjunctivitis, fatigue; avoided in young children because of central effects"],
          ["Topical carbonic anhydrase inhibitors (dorzolamide, brinzolamide); oral acetazolamide", "Reduce aqueous secretion", "Paresthesia, taste disturbance and, with oral use, systemic acidosis and the risk of Steven-Johnson reactions"],
          ["Cholinergic agonists (pilocarpine)", "Pull the scleral spur to open the trabecular meshwork; also treat angle closure by breaking pupillary block", "Miosis, brow ache, retinal detachment risk in high myopes; the emergency agent of angle closure"],
          ["Laser trabeculoplasty (SLT and argon)", "Improves trabecular outflow by stimulating the meshwork", "Primary therapy in some services, useful as a steroid-sparing adjunct"],
          ["Laser iridotomy", "Creates an alternative route for aqueous across the iris", "The definitive treatment of pupillary block and the prophylaxis of the fellow eye"],
          ["Trabeculectomy and tube implants", "Create a new outflow pathway from the anterior chamber to a subconjunctival bleb", "For pressure uncontrolled by medical and laser therapy; 5-fluorouracil and mitomycin modulate the fibrotic healing of the bleb"],
          ["Cyclophotocoagulation and cyclocryotherapy", "Reduce aqueous secretion by destroying ciliary body tissue", "For refractory glaucoma and blind painful eyes, and for eyes with poor surgical prognosis"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Adherence is the commonest reason for failing glaucoma treatment: the patient feels nothing and sees nothing, so a five-drug regimen with three bottles and twice-daily drops is quietly abandoned. Ask about drops with the bottle in hand, teach punctal occlusion, and involve the patient in a plan that can actually be followed.",
      },

      { type: "heading", level: 2, text: "Complications of untreated or poorly treated glaucoma" },
      {
        type: "paragraph",
        text: "Glaucomatous field loss is permanent: the peripheral arc, then the ring, then the central island, and finally no perception of light. Acute angle closure can destroy the eye in hours of pressure above 60 mmHg, and repeated subacute attacks exhaust the retina and nerve before the disc is ever cupped. Secondary glaucoma follows uveitis, trauma, lens-related disease and rubeosis, and each requires treatment of the cause as well as of the pressure.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Dispensing chloramphenicol for a red, painful eye with halos, a semi-dilated pupil and vomiting. That is acute angle closure, a same-hour pressure emergency, and every hour of high pressure risks the optic nerve; the history of dim light, and a hypermetrope with a shallow chamber, is the clue.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Equating glaucoma with raised intraocular pressure. Most patients with a moderate pressure rise never develop glaucoma, and patients with normal-tension glaucoma have pressures below 21 mmHg while their discs are excavating — the diagnosis depends on the disc and the field.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Trusting a single tonometry reading. Pressure varies diurnally, rises with posture and squeezing, and is misread by a thick or thin cornea; the clinical decision is based on the trend, the disc, the field and the imaging.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Giving pilocarpine as the first drop in acute angle closure, before the pressure has been lowered. The ischaemic iris cannot contract at a high pressure; pilocarpine follows intravenous acetazolamide, a beta-blocker and an alpha agonist, and only then breaks the block.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "An asymptomatic 60-year-old has pressures of 24-26 mmHg in both eyes, enlarged cup-to-disc ratios with superior and inferior polar notching, and visual field testing showing an arcuate (Bjerrum) scotoma and a nasal step. What is the diagnosis and what is being treated?",
        answer: "Primary open-angle glaucoma. The diagnosis was made from the optic disc (vertical cupping, focal neuroretinal rim thinning and polar notching) and the characteristic field defect; the intraocular pressure is the risk factor that is treated, with the aim of slowing progression of optic neuropathy rather than restoring lost field.",
        explanation: "Field loss is irreversible; all treatment is aimed at preserving the field that remains, and adherence is what determines whether it succeeds.",
      },
      {
        type: "question",
        prompt: "A 60-year-old hypermetrope is brought in after several hours in a darkened cinema with severe unilateral pain, blurred vision with halos around lights, headache, nausea and vomiting. The eye is injected, the cornea is cloudy, the pupil is semi-dilated and fixed, and pressure is 58 mmHg. What has happened and what is the immediate treatment sequence?",
        answer: "Acute angle-closure glaucoma: pupillary block in a narrow-angle eye has closed the trabecular meshwork. Immediate treatment is intravenous acetazolamide 500 mg plus topical beta-blocker and apraclonidine, systemic hyperosmotic therapy as needed, and topical steroid; pilocarpine is given after the pressure begins to fall. The definitive treatment is laser peripheral iridotomy in both eyes.",
        explanation: "Haloes, vomiting and a dark-room history are the textbook clues; pilocarpine first is a classic error.",
      },
      {
        type: "question",
        prompt: "Why is a brawny, hard, painful eye with a shallow chamber after intumescent cataract called secondary glaucoma, and what is its treatment?",
        answer: "It is phacomorphic glaucoma: the swollen intumescent lens has pushed the iris forward and closed the angle, so the pressure is high because of a mechanical obstruction rather than primary angle disease. Treatment is urgent lowering of the pressure followed by cataract extraction, which is the definitive cure.",
        explanation: "Lens removal resolves the mechanism; medical treatment only buys time before surgery.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "An asymptomatic 60-year-old has intraocular pressures of 24-26 mmHg bilaterally, enlarged cup-to-disc ratios with superior and inferior polar notching, and visual field testing showing an arcuate (Bjerrum) scotoma and a nasal step. What is the diagnosis?",
        options: [
          "Ocular hypertension — the pressures are raised but there is no disease",
          "Primary open-angle glaucoma",
          "Normal-tension glaucoma",
          "Acute angle-closure glaucoma",
        ],
        correctIndex: 1,
        explanation: "Raised pressures with characteristic optic disc excavation (vertical cupping, polar notching) and a corresponding field defect is primary open-angle glaucoma. Ocular hypertension would show raised pressures with a normal disc and normal field; the normal-tension diagnosis requires pressures below 21 mmHg; acute angle closure is a painful emergency with a closed angle.",
      },
      {
        type: "mcq",
        stem: "A 60-year-old presents after several hours in a darkened cinema with severe unilateral eye pain, blurred vision with halos around lights, headache, nausea and vomiting. The eye is injected, the cornea is cloudy, the pupil is semi-dilated and fixed, and pressure is 58 mmHg. What is the most likely diagnosis and the immediate management?",
        options: [
          "Bacterial conjunctivitis — topical antibiotic and analgesia",
          "Acute angle-closure glaucoma — lower the pressure with intravenous acetazolamide, a topical beta-blocker and an alpha agonist, then give pilocarpine once the pressure begins to fall, and arrange laser peripheral iridotomy",
          "Anterior uveitis — topical steroid and a cycloplegic",
          "Scleritis — oral non-steroidal anti-inflammatory drugs",
        ],
        correctIndex: 1,
        explanation: "Severe pain with halos from corneal oedema, a cloudy cornea, a shallow chamber, a semi-dilated fixed pupil and a very high pressure is acute angle closure; the emergency sequence lowers pressure first (acetazolamide, beta-blocker, alpha agonist, hyperosmotic as needed) and then uses pilocarpine to break the pupillary block, with laser iridotomy as definitive treatment of both eyes.",
      },
      {
        type: "mcq",
        stem: "Which statement about the treatment of primary open-angle glaucoma is correct?",
        options: [
          "Prostaglandin analogues are first-line topical therapy because they increase uveoscleral outflow and can be given once at night",
          "Timolol must be given four times daily to lower intraocular pressure",
          "Pilocarpine is the drug of choice in every patient with glaucoma",
          "Trabeculectomy is always performed as the first operation of glaucoma management",
        ],
        correctIndex: 0,
        explanation: "Prostaglandin analogues increase uveoscleral outflow, are the most potent topical agents, are effective once at night, and cause fewer systemic effects than beta-blockers. Timolol is twice daily; pilocarpine is second- or third-line and is reserved for the angle-closure situation; trabeculectomy follows medical and laser therapies that fail.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Aqueous humour is secreted by the ciliary body and leaves the eye mainly through the trabecular meshwork into Schlemm canal; glaucoma is an optic neuropathy in which elevated pressure is the principal risk factor, diagnosed by the excavated disc and the arcuate field defect that respects the horizontal meridian. Open-angle glaucoma is silent and bilateral, detected only by disc, field, imaging and tonometry; angle closure presents as a painful red eye with halos, a cloudy cornea, a semi-dilated fixed pupil and a rock-hard eye, and is a same-hour emergency treated by lowering the pressure and a laser iridotomy in both eyes. Secondary glaucomas arise from uveitis, pigment, pseudoexfoliation, trauma, steroids and lens-induced disease, and treatment is a ladder of topical drugs, laser and surgery, whose limiting factor is almost always adherence.",
      },
      {
        type: "paragraph",
        text: "Next: the retina. Diabetic and hypertensive retinopathy, vascular occlusion, macular degeneration and retinal detachment — the group of diseases that account for the bulk of registered blindness, and where a slit-lamp-looking doctor is not enough.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 8 — Retinopathies & retinal detachment (fully authored)
// ---------------------------------------------------------------------------
function lesson8() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: grade diabetic retinopathy into non-proliferative and proliferative stages, recognise clinically significant macular oedema, and describe the management of each stage; describe the retinal signs of hypertension and the urgency of disc swelling; differentiate the common retinal vascular occlusions and their management; classify retinal detachment into rhegmatogenous, exudative and tractional and manage the emergency of a macula-on detachment; and recognise age-related macular degeneration and the retinal findings of prematurity and childhood.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 7 (Glaucoma) and lesson 3 (Systemic disease and the eye). Retinal ischaemia drives neovascular glaucoma, and diabetic, haematological and hypertensive disease produce the retinopathies described here.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Retinopathy",
        text: "Disease of the retina arising from its blood supply: microvascular leakage (oedema and exudates), microvascular occlusion (cotton-wool spots, ischaemia) and the resulting neovascular response, or the direct blockage of vessels in occlusion disease.",
      },
      {
        type: "paragraph",
        text: "The retina is an extension of the brain: a millimetre or two thick, with the highest oxygen consumption per gram of any tissue in the body, and it fails whenever its supply fails. Diabetes attacks the small vessels (microaneurysms, capillary dropout, neovascularisation); hypertension and arteriosclerosis attack the arteries; occlusion disease blocks the veins or artery; and mechanical detachment stops the photoreceptors working entirely. Learn the pattern of each and you can diagnose almost any retinopathy across a consulting room without touching an instrument.",
      },

      { type: "heading", level: 2, text: "Diabetic retinopathy: classification" },
      {
        type: "paragraph",
        text: "The following classification is the one used in clinic, and it has two branches that must be kept separate — the stage of retinopathy (worldwide: non-proliferative or proliferative) and the state of the macula (normal, with exudates, or with oedema), because it is the macula that determines vision and the proliferative stage that determines risk of haemorrhage and rubeosis.",
      },
      {
        type: "table",
        headers: ["Stage", "Fundus findings", "Meaning and management"],
        rows: [
          ["Mild non-proliferative (NPDR)", "At least one microaneurysm", "Evidence of microvascular disease; not usually sight-threatening; annual screening and systemic control"],
          ["Moderate NPDR", "Microaneurysms, blot haemorrhages, hard exudates and cotton-wool spots", "Serious disease requiring 6-12 monthly review; systemic risk-factor control"],
          ["Severe NPDR", "The 4-2-1 rule: severe retinal haemorrhages in 4 quadrants, venous beading in 2 quadrants, or moderate IRMA in 1 quadrant (any one)", "Ischaemia driving neovascularisation; high risk of progression to PDR — close review and possible panretinal photocoagulation"],
          ["Proliferative diabetic retinopathy (PDR)", "Neovascularisation on or within one disc diameter of the disc (NVD) or elsewhere (NVE); preretinal or vitreous haemorrhage; fibrous proliferation", "Sight-threatening; treat with scatter (panretinal) photocoagulation to the ischaemic retina, and vitrectomy for non-clearing vitreous haemorrhage or tractional detachment"],
          ["Clinically significant macular oedema (CSME)", "Retinal thickening within 500 micrometres of the fovea, or hard exudates within 500 micrometres with adjacent thickening, or thickening one disc area or more within one disc diameter of the fovea", "The commonest cause of visual loss in diabetes; treat with macular (focal or grid) laser, or intravitreal anti-VEGF agents for centre-involving oedema"],
          ["Diabetic macular ischaemia", "Extensive capillary non-perfusion with a poor capillary network on fluorescein angiography", "Visual loss that neither laser nor anti-VEGF therapy improves; the sight has already been lost to ischaemia"],
        ],
      },
      {
        type: "table",
        headers: ["Pathological process", "What it produces on the fundus"],
        rows: [
          ["Loss of pericytes and microaneurysms", "Spherical outpouchings of capillaries appearing as tiny red dots"],
          ["Capillary leakage", "Hard exudates (lipid-rich rings) and intraretinal oedema"],
          ["Capillary occlusion", "Cotton-wool spots (nerve fibre infarcts) and blot haemorrhages"],
          ["Neovascularisation with fragile new vessels", "New vessels on the disc and retina, with preretinal and vitreous haemorrhage, and fibrous scarring causing tractional detachment"],
          ["Retinal and anterior segment neovascularisation", "Rubeosis iridis and neovascular glaucoma; painful blind eyes from angle closure"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "A diabetic with a sudden fall in vision and no red reflex has a vitreous haemorrhage from proliferative retinopathy — a referral for retinal examination and laser treatment, not for a new spectacle prescription. The same is true of any diabetic with flashes and a curtain.",
      },

      { type: "heading", level: 2, text: "Worked example: the diabetic with blurred vision" },
      {
        type: "paragraph",
        text: "A patient with type 2 diabetes reports blurred vision in one eye. Fundoscopy shows microaneurysms and blot haemorrhages, with hard exudates and retinal thickening within 500 micrometres of the foveal centre. This is clinically significant macular oedema superimposed on non-proliferative retinopathy: the macula is swollen because capillaries are leaking, and the treatment is macular laser or intravitreal anti-VEGF therapy, together with glycaemic, blood pressure and lipid control — the macular intervention preserves the vision that is still there, and the systemic intervention prevents the eye from needing a second one.",
      },

      { type: "heading", level: 2, text: "Hypertensive retinopathy" },
      {
        type: "table",
        headers: ["Grade (Keith-Wagener-Barker)", "Signs", "Meaning"],
        rows: [
          ["Grade I", "Generalised arteriolar narrowing and tortuosity; occasional arteriovenous nicking", "Chronic hypertension"],
          ["Grade II", "Arteriolar narrowing with focal arteriovenous crossing changes (nipping) and copper or silver wiring", "Chronicity and severity of hypertension"],
          ["Grade III", "Flame-shaped haemorrhages, cotton-wool spots and hard exudates, often in a macular star", "Acute severity — an indication for urgent blood pressure control"],
          ["Grade IV", "Grade III changes plus swelling of the optic disc", "Accelerated or malignant hypertension — a medical emergency with a high risk of irreversible blindness, renal failure and stroke"],
        ],
      },
      {
        type: "paragraph",
        text: "In young patients with acute hypertension (of pregnancy or renal disease) the choroid is also affected: Elschnig spots and Siegrist streaks reflect fibrinoid necrosis of the choroidal vasculature, and the eye must be examined in every patient with pregnancy-associated hypertension with neurological symptoms. In the diabetic patient the two diseases superimpose, and the distinguishing question at the slit lamp is whether the haemorrhages are flame-shaped (hypertensive, in the nerve fibre layer) or blot-shaped (diabetic, deeper).",
      },

      { type: "heading", level: 2, text: "Retinal vascular occlusions" },
      {
        type: "table",
        headers: ["Occlusion", "Presentation", "Fundus appearance", "Management"],
        rows: [
          ["Central retinal artery occlusion (CRAO)", "Sudden, catastrophic, painless loss of vision to counting fingers or hand movements", "Retinal oedema with a cherry-red spot at the macula and very attenuated arteries", "An ophthalmic emergency: lower the pressure by ocular massage, reduce aqueous secretion, and if seen within minutes for anterior chamber paracentesis; investigate the carotid and cardiac source and assess for giant cell arteritis"],
          ["Branch retinal artery occlusion (BRAO)", "A sectoral altitudinal field defect", "Whitening of the affected sector", "Investigate the embolic source; visual prognosis is often good"],
          ["Central retinal vein occlusion (CRVO)", "Sudden or gradual painless blurring in a patient of 50 or older", "Blood-and-thunder: dilated tortuous veins with quadrant-spanning flame haemorrhages and cotton-wool spots", "Risk factors (hypertension, diabetes, hyperviscosity, glaucoma, oral contraceptive pill); treat macular oedema with anti-VEGF therapy; photocoagulate if neovascularisation develops"],
          ["Branch retinal vein occlusion (BRVO)", "Blurring in a sector, often at a superior temporal crossing", "Sectoral haemorrhages distal to the crossing", "The commonest venue of macular oedema; macular laser or anti-VEGF for centre-involving oedema"],
          ["Amaurosis fugax", "Transient monocular blindness lasting minutes — a curtain rising or falling", "The fundus is usually normal between attacks", "Transient ischaemic attack: antiplatelet therapy, carotid imaging, cardiovascular and glycaemic work-up"],
          ["Retinal arterial macroaneurysm", "Sudden blurring with a preretinal bleed", "A saccular arterial dilatation that leaks or bleeds", "Observe or treat with laser for persistent macular involvement"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Amaurosis fugax is a retinal transient ischaemic attack: an embolus seen crossing the retinal arterial tree during the attack (Hollenhorst plaque) is the signature, and the patient needs the same work-up and prevention as any other transient ischaemic attack — the next event may be a completed cerebral stroke.",
      },

      { type: "heading", level: 2, text: "Retinal detachment" },
      {
        type: "paragraph",
        text: "A retinal detachment is a separation of the sensory retina from the pigment epithelium. It is not a single disease: three different mechanisms produce it, and each implies a different operation.",
      },
      {
        type: "table",
        headers: ["Type", "Mechanism", "Causes", "Management"],
        rows: [
          ["Rhegmatogenous", "A full-thickness retinal break allows liquefied vitreous to pass into the subretinal space", "Myopia, pseudophakia and aphakia, trauma, lattice degeneration, family history, Marfan and Stickler syndromes", "Urgent surgery: pneumatic retinopexy, scleral buckle or vitrectomy with laser or cryotherapy to the break"],
          ["Tractional", "Fibrovascular or inflammatory membranes contract and pull the retina off", "Proliferative diabetic retinopathy, retinopathy of prematurity, sickle cell disease, penetrating trauma", "Vitrectomy with membrane removal; the timing depends on the macula; treat the underlying angiogenic drive with laser or anti-VEGF"],
          ["Exudative (serous)", "Fluid accumulates under an intact retina, without a break", "Choroidal tumour, posterior scleritis, uveitis, severe hypertension, toxaemia of pregnancy", "Treat the underlying cause — the retina usually reattaches"],
        ],
      },
      {
        type: "paragraph",
        text: "The symptoms are reliably in this order: new floaters, then flashing lights (photopsia), then a curtain or shade that begins peripherally and advances toward the centre. The signs: a dull, grey, convex retina that folds and oscillates with eye movement, retinal vessels that look darker and shadowed, and a relative afferent pupillary defect when the detachment is extensive; tobacco dust (Shaffer sign) is a fine pigment in the anterior vitreous pathognomonic of a retinal break. A macula-on detachment (the macula has not yet detached) must be repaired urgently — within days — because the prognosis falls sharply once the fovea is detached; macula-off detachments are still repaired but with lower expectations.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Flashes and floaters are not simply a syndrome of ageing to be reassured away. Every patient with sudden floaters and photopsia needs a dilated fundus examination with scleral indentation, and the risk factors that must be sought are myopia, aphakia or pseudophakia, trauma and a detachment of the other eye.",
      },

      { type: "heading", level: 2, text: "Macular disease and other posterior segment disorders" },
      {
        type: "table",
        headers: ["Condition", "Pathology", "Presentation and management"],
        rows: [
          ["Dry (atrophic) age-related macular degeneration", "Accumulation of drusen and geographic atrophy of the retinal pigment epithelium", "Gradual loss of central vision; smoking cessation, diet and antioxidant supplements; low-vision rehabilitation"],
          ["Wet (exudative) macular degeneration", "Choroidal neovascularisation leaking fluid, blood and lipid beneath the retina", "Rapid distortion and loss of central vision (metamorphopsia); treat with intravitreal anti-VEGF agents to preserve and improve vision"],
          ["Central serous retinopathy", "A leak at the level of the retinal pigment epithelium", "Relative scotoma and distortion in a young or middle-aged man, often stress-linked; usually self-limiting, laser if chronic"],
          ["Macular hole", "A full-thickness defect of the fovea by vitreomacular traction", "Sudden distortion and loss of central vision; vitrectomy with internal tamponade"],
          ["Epiretinal membrane", "A fibrocellular membrane on the retinal surface causing puckering", "Distortion and blur; removal by vitrectomy if vision is compromised"],
        ],
      },

      { type: "heading", level: 2, text: "Retinopathy of prematurity and paediatric retinal disease" },
      {
        type: "paragraph",
        text: "Retinopathy of prematurity is a disorder of the developing peripheral retinal vasculature, in which oxygen therapy (among many factors) arrests normal vessel growth and then drives abnormal neovascularisation, scarring and tractional detachment. Premature babies are screened by indirect ophthalmoscopy according to gestational age and birth weight, and severe disease is treated by laser or cryotherapy to the avascular retina — the intervention that has preserved the sight of a generation of premature babies. The differential of a leukocoria in an infant is critical: cataract, retinoblastoma, retinopathy of prematurity and the persistent fetal vasculature all present with a white pupil, and the one that kills is the retinoblastoma.",
      },
      {
        type: "table",
        headers: ["Condition", "Features", "Management"],
        rows: [
          ["Retinopathy of prematurity", "Prematurity with supplemental oxygen; a demarcated ridge of neovascular tissue in the periphery, plus disease and plus disease", "Screening and laser or cryotherapy of the avascular retina; vitrectomy and scleral buckling for tractional detachment"],
          ["Retinoblastoma", "Leukocoria with a white pupillary reflex and strabismus, and sometimes glaucoma; a sporadic (usually unilateral) or familial (often bilateral and earlier) pattern from the Rb tumour suppressor gene", "Enucleation with a long optic nerve for advanced disease, or globe-preserving chemotherapy and focal therapy for earlier disease; urgent referral is critical"],
          ["Persistent fetal vasculature", "A unilateral leukocoria with a retrolental mass and cataract from failure of the primary vitreous to regress", "Surgical removal of the retrolental tissue, with a poor visual prognosis when the presentation is late"],
          ["Coats disease", "Unilateral retinal telangiectasia with massive exudate in boys", "Laser or cryotherapy; drainage of subretinal exudate in advanced disease"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Treating flashes and floaters as harmless ageing without a dilated fundus examination. A retinal break is missed at first presentation, and the difference between a macula-on and macula-off detachment is the difference between useful and blind vision.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Diagnosing diabetic retinopathy by appearance in an undilated pupil. Peripheral neovascularisation, the sign that determines the need for panretinal photocoagulation, is invisible without dilation; a macula cannot be assessed for clinically significant oedema without a dilated examination and biomicroscopy.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Prescribing spectacles or cataract surgery to a diabetic with unexplained blurring. Refractive shifts and cataract are common in diabetes, but macular oedema, ischaemia and vitreous haemorrhage are the causes that destroy vision — and they are missed by an undilated examination.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Mistaking a hypertensive retinopathy of pregnancy for diabetic retinopathy because the patient is both diabetic and hypertensive. Delivery and blood pressure control treat one, and macular laser treats the other; the flame-shaped haemorrhages and the disc swelling are the signs to weigh.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A patient with type 2 diabetes has visual blurring in one eye and fundoscopy showing microaneurysms and blot haemorrhages, with hard exudates and retinal thickening within 500 micrometres of the foveal centre. How should the macular disease be described and managed?",
        answer: "Clinically significant macular oedema, superimposed on non-proliferative diabetic retinopathy; the macula is swollen by leaking capillaries. It is managed with macular laser or intravitreal anti-VEGF therapy, alongside glycaemic, blood pressure, and lipid control, and screening for proliferative disease.",
        explanation: "CSME is the definition that determines macular treatment; the eye also needs screening for proliferative disease because the two can coexist.",
      },
      {
        type: "question",
        prompt: "A patient with high myopia describes a week of flashing lights and new floaters, followed by a shade or curtain advancing across the visual field of one eye. The red reflex is reduced, the detached retina appears grey and billows, and field testing is impossible over the affected area. What has happened and how urgent is it?",
        answer: "A rhegmatogenous retinal detachment. It needs urgent (same-week, ideally within days) ophthalmic referral for indirect ophthalmoscopy and surgical repair, because a macula-on detachment must be repaired before the fovea separates — a macula-off detachment still requires surgery but carries a much worse visual prognosis.",
        explanation: "Tractional and exudative detachments have different causes and different treatments, but the emergency is the same.",
      },
      {
        type: "question",
        prompt: "Why does a central retinal vein occlusion with widespread retinal ischaemia require panretinal photocoagulation rather than macular laser alone?",
        answer: "Because the widespread ischaemia drives neovascularisation of the disc, retina and anterior segment (rubeosis), and panretinal photocoagulation destroys the ischaemic peripheral retina that is producing the vasoproliferative stimulus, preventing neovascular glaucoma and vitreous haemorrhage. Macular laser only treats the centre.",
        explanation: "In CRVO there are two diseases to treat: the macular oedema, which is treated focally or with anti-VEGF, and the ischaemia, which is treated by scatter photocoagulation.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A patient with type 2 diabetes has visual blurring in one eye and fundoscopy showing microaneurysms and blot haemorrhages, with hard exudates and retinal thickening within 500 micrometres of the foveal centre. Which statement about management is correct?",
        options: [
          "The macula is not yet involved because the fovea itself is spared, so no ocular treatment is needed",
          "This is clinically significant macular oedema and requires macular laser or intravitreal anti-VEGF therapy, together with systemic risk-factor control",
          "The patient has proliferative diabetic retinopathy and requires panretinal photocoagulation only",
          "The retinal thickening will reverse with spectacles once glycaemic control is established",
        ],
        correctIndex: 1,
        explanation: "Retinal thickening within 500 micrometres of the fovea (or exudates within 500 micrometres with adjacent thickening, or thickening of a disc area within a disc diameter) defines clinically significant macular oedema, which is treated with macular laser or intravitreal anti-VEGF therapy; systemic control is the long-term prevention. Panretinal photocoagulation is for proliferative disease, and spectacles do not treat oedema.",
      },
      {
        type: "mcq",
        stem: "A patient with high myopia describes a week of flashing lights and new floaters, followed by a shade or curtain advancing across the visual field of one eye. The red reflex is reduced, the detached retina appears grey and billows, and a relative afferent pupillary defect is present. What is the diagnosis and the urgency?",
        options: [
          "Posterior vitreous detachment — reassure and review in six months",
          "Rhegmatogenous retinal detachment — urgent referral for retinal examination and surgery, ideally before the macula detaches",
          "Central retinal artery occlusion — ocular massage and anterior chamber paracentesis as emergencies",
          "Exudative (serous) retinal detachment from a choroidal tumour — radiotherapy",
        ],
        correctIndex: 1,
        explanation: "New floaters and photopsia followed by a field curtain, with a grey convex retina and a relative afferent pupillary defect, is rhegmatogenous retinal detachment; it is an eye emergency requiring surgical repair, ideally while the macula is still attached (macula-on), because the prognosis falls sharply once the fovea detaches.",
      },
      {
        type: "mcq",
        stem: "Which pattern of retinal haemorrhage, with a disc showing flame-shaped haemorrhages, cotton-wool spots and a macular star in a patient with severe hypertension, is the one that marks a hypertensive emergency?",
        options: [
          "Blot haemorrhages with microaneurysms in the deep retina",
          "Scattered cotton-wool spots only, with a normal disc",
          "Grade III changes with grade IV disc swelling (malignant or accelerated hypertension)",
          "A flame-shaped haemorrhage alone with no vessel changes",
        ],
        correctIndex: 2,
        explanation: "Grade III retinopathy (flame-shaped haemorrhages, cotton-wool spots, hard exudates in a macular star) plus disc swelling is grade IV retinopathy — accelerated or malignant hypertension — a medical emergency because it signals target-organ damage and threatens retinal, renal and cerebral function. Blot haemorrhages with microaneurysms indicate diabetic disease.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The retina is the highest oxidative tissue in the body, and its disease is the commonest cause of registered blindness. Diabetic retinopathy is graded as non-proliferative (microaneurysms and haemorrhages) or proliferative (neovascularisation, haemorrhage), with clinically significant macular oedema as the separate threat to central vision requiring macular laser or anti-VEGF therapy. Hypertension produces the arteriolar changes of grades I and II, the leakage of grade III and the disc swelling that marks a hypertensive emergency. Vascular occlusion has its own signature — the cherry-red spot of central retinal artery occlusion, the blood-and-thunder of a vein occlusion, and the transient curtain of amaurosis fugax as a transient ischaemic attack. Retinal detachment is rhegmatogenous, tractional or exudative, and the patient with photopsia, new floaters and an advancing shade must be referred the same day.",
      },
      {
        type: "paragraph",
        text: "Next: the optic nerve and ocular motility. Optic neuritis, atrophy, papilloedema, the nerves and muscles of eye movement, amblyopia and the ocular tumours complete the posterior segment and neurological part of the course.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 9 — Optic nerve & squint (fully authored)
// ---------------------------------------------------------------------------
function lesson9() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the anatomy and blood supply of the optic nerve and the visual pathway and predict the field defect produced by a lesion at each site; perform the swinging-light test and interpret a relative afferent pupillary defect; diagnose optic neuritis, papilloedema and optic atrophy and name their commonest causes; classify squint into concomitant and paralytic and distinguish the signs of third, fourth and sixth nerve palsies; define amblyopia, explain the critical period and state the principles of its treatment; and recognise the presenting features of retinoblastoma.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 8 (Retinopathies and retinal detachment), and lesson 3 (Systemic disease and the eye). A relative afferent pupillary defect, the central scotoma of optic neuritis and the disc swelling of raised intracranial pressure all follow from the retinal and vascular disease taught earlier.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "The optic nerve (cranial nerve II)",
        text: "The bundle of about one million retinal ganglion cell axons that carries the visual signal from the eye to the chiasm, the lateral geniculate body and the visual cortex. It is myelinated only behind the lamina cribrosa, which is why the optic disc is a sensitive site for oedema from both raised intracranial pressure and poor perfusion.",
      },
      {
        type: "paragraph",
        text: "The optic nerve is a cable, and like any cable it fails at the ends or in the middle. At the disc end it swells (papilloedema from raised pressure, disc oedema in ischaemia) or atrophies (pallor after damage). At the brain end it is compressed, inflamed or demyelinated, producing deficits in acuity, colour and field with a normal-looking fundus. And the visual pathway is wired nasal-temporal: fibres from the nasal retina (which see the temporal field) cross in the chiasm, while temporal fibres do not — a rule that lets any field defect be localised to a named structure. Combine the cable with the six muscles that point it, and the whole subject of neuro-ophthalmology becomes the study of where in the pathway the patient's field or eye movement is telling you to look.",
      },

      { type: "heading", level: 2, text: "The visual pathway and its field defects" },
      {
        type: "table",
        headers: ["Site of lesion", "Field defect", "Typical cause"],
        rows: [
          ["Optic nerve (before the chiasm)", "Monocular loss: reduced acuity, a central or cecocentral scotoma, impaired colour vision, and an afferent pupillary defect", "Optic neuritis, ischaemic optic neuropathy, compression, trauma, toxic and nutritional disease"],
          ["Optic chiasm", "Bitemporal hemianopia — loss of the temporal fields", "Pituitary adenoma, craniopharyngioma, meningioma, chiasmal glioma"],
          ["Optic tract", "Incongruent homonymous hemianopia of the contralateral side, with afferent pupillary defect", "Craniopharyngioma, aneurysm, temporal lobe tumour"],
          ["Optic radiation / anterior visual cortex", "Homonymous quadrantanopia (temporal lobe: superior quadrant; parietal lobe: inferior)", "Stroke, tumour, trauma, abscess"],
          ["Occipital cortex", "Congruent homonymous hemianopia, often sparing the macula (macular sparing)", "Posterior cerebral artery occlusion, trauma"],
        ],
      },
      {
        type: "paragraph",
        text: "The rule that fixes all of these is that image inversion: the superior visual field projects to the inferior retina and vice versa, and the nasal half of the retina receives the temporal half of the field. A lesion at the tract or beyond produces homonymous (both eyes) defects that respect the vertical meridian; a lesion at the nerve produces monocular disease. Any lesion that produces a field defect with a normal fundus is behind the globe, and requires imaging.",
      },

      { type: "heading", level: 2, text: "The pupil in neuro-ophthalmology" },
      {
        type: "paragraph",
        text: "The swinging-light test is the single most useful neurological examination of the eye, because it compares the two optic nerves with each other. A light shone in one eye produces a direct constriction in that eye and a consensual constriction in the other. Alternating the light between the eyes, the normal pupil constricts least when the affected eye is illuminated — a relative afferent pupillary defect (Marcus Gunn pupil) — which indicates optic nerve or severe retinal disease of that eye.",
      },
      {
        type: "table",
        headers: ["Pupil finding", "Meaning", "Commonest cause"],
        rows: [
          ["Relative afferent pupillary defect with a normal-looking fundus", "Optic nerve disease behind the globe", "Retrobulbar optic neuritis in multiple sclerosis"],
          ["Relative afferent pupillary defect with a pale disc", "Advanced optic nerve disease", "Ischaemic optic neuropathy, compressive atrophy"],
          ["Small pupil with ptosis and no anhidrosis difference", "Horner syndrome — interruption of the oculosympathetic pathway", "Carotid dissection, Pancoast tumour, cluster headache"],
          ["Dilated pupil with ptosis and the eye down and out", "Third nerve palsy — a medical emergency when the pupil is involved", "Posterior communicating artery aneurysm; ischaemic diabetes when pupil-sparing"],
          ["Light-near dissociation (constricts to convergence, not to light)", "Argyll Robertson pupil (syphilis) or Adie tonic pupil", "Syphilis; ciliary ganglion damage in young women"],
          ["Irregular pupils with synechiae", "Anterior uveitis or trauma", "Posterior uveitis and surgical trauma"],
        ],
      },

      { type: "heading", level: 2, text: "Optic neuritis" },
      {
        type: "definition",
        term: "Optic neuritis",
        text: "Inflammation of the optic nerve, producing subacute, usually monocular loss of vision over days with pain on eye movement, a relative afferent pupillary defect, impaired colour vision (red desaturation) and a central or cecocentral scotoma; the disc looks normal in retrobulbar neuritis and mildly swollen in papillitis.",
      },
      {
        type: "paragraph",
        text: "The typical patient is a young woman, because demyelination is the commonest cause: about a third of patients presenting with optic neuritis develop clinically definite multiple sclerosis, and MRI at presentation predicts the risk. Neuromyelitis optica (Devic disease) presents with severe bilateral sequential attacks, poor recovery and little or no pain. The vision recovers over weeks in most, but colour vision and contrast sensitivity often remain abnormal. Intravenous methylprednisolone speeds recovery; oral corticosteroids alone are avoided because they increase the recurrence of attacks.",
      },
      {
        type: "table",
        headers: ["Type of optic neuropathy", "Presentation", "Key associations"],
        rows: [
          ["Optic neuritis (demyelination)", "Subacute monocular blurred vision with pain on eye movement; central scotoma; relative afferent pupillary defect; red desaturation", "Multiple sclerosis; neuromyelitis optica; viral illness and vaccination rarely"],
          ["Anterior ischaemic optic neuropathy (non-arteritic)", "Sudden altitudinal field loss with a small, crowded disc; disc oedema", "Hypertension, diabetes, hyperlipidaemia, a small cup-to-disc ratio (the disc at risk)"],
          ["Anterior ischaemic optic neuropathy (arteritic)", "Sudden visual loss in a patient over 55 with headache, scalp tenderness, jaw claudication and an elevated erythrocyte sedimentation rate", "Giant cell arteritis — treated with intravenous methylprednisolone to protect the second eye"],
          ["Papilloedema", "Bilateral disc swelling from raised intracranial pressure with transient visual obscurations", "Intracranial mass, cerebral venous sinus thrombosis, idiopathic intracranial hypertension"],
          ["Optic atrophy", "A pale disc with reduced acuity and colour vision; primary (secondary to neuritis or compression), secondary (after disc swelling), glaucomatous (with cupping) and consecutive (after retinal disease)", "The common endpoint of every optic nerve disease"],
          ["Toxic and nutritional optic neuropathy", "Painless, symmetric, bilateral central field loss with dyschromatopsia", "Ethambutol, methanol, tobacco-alcohol amblyopia, vitamin B12 deficiency"],
          ["Leber hereditary optic neuropathy", "Painless, rapid central visual loss in young men, sequential in the two eyes, with permanent loss", "A maternally inherited mitochondrial DNA mutation"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "A sudden loss of vision in a patient over 55 with headache, scalp tenderness and jaw claudication is giant cell arteritis until proven otherwise: take blood for erythrocyte sedimentation rate and C-reactive protein, start high-dose corticosteroid immediately, and temporal artery biopsy afterwards. The second eye can be lost within days.",
      },

      { type: "heading", level: 2, text: "Worked example: a young woman with a painful eye" },
      {
        type: "paragraph",
        text: "A 30-year-old woman develops painful eye movements and progressive blurring of central vision over days in one eye. Examination shows a relative afferent pupillary defect, impaired colour vision, a central scotoma and a mild disc swelling. This is optic neuritis: the subacute monocular central loss, the pain on movement, the colour loss and the afferent defect are diagnostic, and the fundus findings are of secondary importance. Magnetic resonance imaging is arranged to assess the risk of multiple sclerosis, and visual recovery is expected over weeks but with residual colour and contrast loss. Oral steroids alone are avoided.",
      },
      {
        type: "question",
        prompt: "How is papilloedema distinguished from optic neuritis on examination alone?",
        answer: "Papilloedema is usually bilateral, produces transient visual obscurations rather than central loss and usually preserves acuity early, and the field defect is an enlarged blind spot; optic neuritis is usually unilateral, produces pain on eye movement, significant loss of acuity and colour, and a central scotoma. Papilloedema implies raised intracranial pressure and needs urgent neurological assessment; neuritis implies demyelination and needs MRI.",
        explanation: "Both show a swollen disc; the history, the field and the acuity make the distinction.",
      },

      { type: "heading", level: 2, text: "Eye movements and squint" },
      {
        type: "paragraph",
        text: "Six extraocular muscles move each eye, and the eyes must move together for the brain to see one image. Strabismus (squint) is misalignment: the deviating eye is suppressed in childhood, causing amblyopia, and is appreciated as diplopia in adults. The single most important distinction is between a concomitant squint (the deviation is the same in all directions of gaze, and it begins in childhood, where the cortex suppresses one image to avoid diplopia) and an incomitant squint (the deviation varies with the direction of gaze, is of later onset, and produces diplopia with the image separation greatest in the direction of the paralysed muscle).",
      },
      {
        type: "table",
        headers: ["Nerve", "Muscles", "Defect and its signs"],
        rows: [
          ["Oculomotor (third)", "Superior, inferior and medial rectus; inferior oblique; levator; sphincter pupillae", "The eye is down and out, with ptosis and a dilated pupil when the nerve is compressed (aneurysm, tumour) — a surgical emergency; a pupil-sparing palsy in a diabetic is ischaemic and resolves"],
          ["Trochlear (fourth)", "Superior oblique", "Vertical diplopia that worsens on downgaze and adduction, with a compensatory head tilt away from the lesion; congenital or traumatic in most cases"],
          ["Abducens (sixth)", "Lateral rectus", "Esotropia with a failure of abduction, horizontal double vision worse on lateral gaze; the false localising sign of raised intracranial pressure and a sign of increased intracranial pressure in a neurosurgical patient"],
        ],
      },
      {
        type: "definition",
        term: "Amblyopia",
        text: "A reduction of visual acuity in an eye that has not received a clear, aligned retinal image during the critical period of visual development (roughly the first six to eight years of life), not correctable by refraction or by treating the media. It is in large part reversible if treated within that period, and irreversible if treated after it.",
      },
      {
        type: "paragraph",
        text: "The cover tests are the examination. The cover-uncover test of each eye detects a manifest squint (tropia) and the direction of deviation; the alternate cover test, breaking fusion, detects latent deviations (phoria). The Hirschberg test, using the position of the corneal reflex, estimates the deviation in infants. Correct the refractive error, occlude or penalise the sound eye, and re-check; amblyopia treatment must be completed before the critical period closes, and the commonest failure is non-adherence rather than treatment failure.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The commonest cause of a squint with a normal pupil in a toddler is a refractive error (accommodative esotropia from hypermetropia) or infantile esotropia itself; the commonest cause of a squint with an abnormal pupil or a painful, proptosed orbit is neurogenic or restrictive disease, and demands urgent investigation.",
      },

      { type: "heading", level: 2, text: "Ocular neoplasms" },
      {
        type: "table",
        headers: ["Tumour", "Presentation", "Management"],
        rows: [
          ["Retinoblastoma", "A white pupil (leukocoria) or a squint in a child under three, with a calcified intraocular mass; sporadic (usually unilateral) or hereditary and bilateral with a germline Rb1 mutation", "Enucleation for advanced disease; globe-sparing chemotherapy with focal therapy for earlier disease; survivors of hereditary disease need lifelong tumour surveillance"],
          ["Choroidal melanoma", "A pigmented, mushroom-shaped mass with subretinal fluid and orange lipofuscin", "Plaque radiotherapy or proton beam therapy for medium tumours; enucleation for large tumours; liver and haematological surveillance"],
          ["Choroidal naevus", "A flat, pigmented, asymptomatic choroidal lesion", "Photographic monitoring for growth; biopsy and treatment if growth is documented"],
          ["Lid and conjunctival tumours", "Basal cell carcinoma (commonest lid malignancy, a pearly ulcerated nodule with telangiectasia), squamous cell carcinoma, sebaceous gland carcinoma (masquerading as a recurrent chalazion) and conjunctival melanoma", "Surgical excision with margin control; sebaceous gland carcinoma is misdiagnosed for years and demands high suspicion"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Diagnosing a white pupillary reflex as congenital cataract alone. Leukocoria is retinoblastoma, persistent fetal vasculature, retinopathy of prematurity or a cataract, and the retinoblastoma is the one that kills — urgent paediatric ophthalmic referral, and imaging before any surgery, is mandatory.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Assuming a third nerve palsy with a dilated pupil is diabetic and watching it. A pupil-involving third nerve palsy is a posterior communicating artery aneurysm until an emergency computed tomography angiogram proves otherwise; the pupil-sparing ischaemic variety is the one that can be observed.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Prescribing glasses alone for a child with an accommodative esotropia and treating the squint only surgically. The hypermetropic correction eliminates the accommodative convergence, and it must be associated with treatment of any amblyopia — and surgery before refraction risks the wrong operation.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Waiting for a child to grow out of amblyopia. The critical period closes at about six to eight years, and after that the loss of acuity is permanent; every child found to have reduced vision or a squint needs an ophthalmologist within weeks.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "How does the swinging-light test detect a relative afferent pupillary defect, and what does a positive test mean in a patient with a normal-looking fundus?",
        answer: "The light is alternated rapidly between the two eyes while watching the illuminated pupil. In a healthy state both direct and consensual responses are equal; in a relative afferent defect, the pupil of the affected eye dilates when it is illuminated, because the signal from that eye is weaker. A positive test with a normal fundus means disease of the optic nerve behind the globe — classically retrobulbar optic neuritis.",
        explanation: "The test compares two afferent pathways with each other and therefore does not detect symmetric, bilateral damage.",
      },
      {
        type: "question",
        prompt: "A three-year-old has a constant inward deviation of the right eye with reduced visual acuity when the left eye is covered. What is the diagnosis and what must the treatment include?",
        answer: "Squint (convergent esotropia), with amblyopia of the deviating eye. Treatment must correct the refractive error (which in an accommodative esotropia may eliminate the deviation itself) and treat the amblyopia with occlusion or penalisation of the sound eye, with surgery only if the residual deviation persists.",
        explanation: "In a child with a new squint, checking the pupil and the media and looking for a structural cause precedes any conclusion.",
      },
      {
        type: "question",
        prompt: "Why does a lesion of the temporal lobe produce a superior quadrantanopia while a parietal lesion produces an inferior quadrantanopia?",
        answer: "Because the visual field is inverted on the retina: superior field information projects to the inferior retina, and the fibres of the inferior retina (carrying superior field) travel through the temporal lobe (Meyer loop), while those of the superior retina (carrying inferior field) travel through the parietal lobe. Damage to Meyer loop therefore removes the superior contralateral quadrant, and parietal damage the inferior.",
        explanation: "This is the pathway rule that turns a quadrantanopia into a localisation.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A 30-year-old woman develops painful eye movements and progressive blurring of central vision over days in one eye. Examination shows a relative afferent pupillary defect, impaired colour vision, a central scotoma and a mild disc swelling. What is the most likely diagnosis?",
        options: [
          "Optic neuritis, commonly associated with demyelination and warranting MRI of the brain",
          "Papilloedema from raised intracranial pressure",
          "Diabetic macular oedema",
          "Non-arteritic anterior ischaemic optic neuropathy",
        ],
        correctIndex: 0,
        explanation: "Subacute unilateral central visual loss with pain on eye movement, impaired colour vision, a central scotoma and an afferent pupillary defect is optic neuritis; MRI assesses the risk of multiple sclerosis. Papilloedema is usually bilateral with an enlarged blind spot and preserved acuity; diabetic macular oedema causes no afferent defect; non-arteritic ischaemic optic neuropathy is a sudden altitudinal loss in older patients with a small crowded disc.",
      },
      {
        type: "mcq",
        stem: "A 3-year-old has a constant inward (convergent) deviation of the right eye present since infancy, and reduced visual acuity in that eye when tested with each eye covered. The pupils and media are normal. What is the correct first step?",
        options: [
          "Reassure the parents that an infant squint resolves by school age",
          "Refer to an ophthalmologist for full refraction and amblyopia treatment, before any surgical consideration",
          "Prescribe convex lenses to correct the squint without examination",
          "Perform bilateral surgery on the medial rectus muscles immediately",
        ],
        correctIndex: 1,
        explanation: "A childhood squint with reduced vision in the deviating eye is accompanied by amblyopia, which must be treated during the critical period. The first step is a full ophthalmological assessment with refraction (accommodative esotropia is corrected by the full plus correction) and amblyopia therapy with occlusion, with surgery only for a residual deviation. Reassurance wastes the critical period.",
      },
      {
        type: "mcq",
        stem: "A 70-year-old with headache, scalp tenderness and jaw claudication has a sudden, severe loss of vision in one eye, with a pale swollen disc and an altitudinal field defect. What is the diagnosis and the immediate management?",
        options: [
          "Retrobulbar optic neuritis — high-dose intravenous methylprednisolone after MRI",
          "Arteritic anterior ischaemic optic neuropathy from giant cell arteritis — emergency systemic corticosteroid, urgent inflammatory markers, then temporal artery biopsy",
          "Branch retinal vein occlusion — macular laser",
          "Retinal detachment — vitrectomy",
        ],
        correctIndex: 1,
        explanation: "An older patient with headache, scalp tenderness and jaw claudication (giant cell arteritis) can suffer arteritic anterior ischaemic optic neuropathy, presenting as sudden visual loss with a swollen pale disc and an altitudinal field defect. High-dose corticosteroid is started immediately to protect the second eye; inflammatory markers and a temporal artery biopsy follow.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The optic nerve fails as an afferent pathway, and its signs are disc swelling, disc pallor and the relative afferent pupillary defect with its characteristic acuity, colour and field loss. Optic neuritis is the commonest optic nerve disease in young adults and is associated with demyelination; papilloedema is bilateral disc swelling from raised intracranial pressure; and arteritic ischaemic optic neuropathy is an ophthalmic and medical emergency in elderly patients with headache and jaw claudication. The third, fourth and sixth nerves move the eyes: a pupil-involving third nerve palsy is an aneurysm until proven otherwise, a sixth nerve palsy is a false localising sign of raised intracranial pressure, and a squint in a child with reduced vision is amblyopia that must be treated before the critical period closes. Leukocoria in a child is retinoblastoma, cataract and retinopathy of prematurity, and must be referred urgently.",
      },
      {
        type: "paragraph",
        text: "Next: the emergencies and minor surgery — where the lessons above converge into decisions that must be made correctly in the first ten minutes.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 10 — Ocular emergencies & minor surgery (fully authored)
// ---------------------------------------------------------------------------
function lesson10() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: state the immediate management of chemical, thermal and radiation injury to the eye in the first ten minutes; manage a corneal foreign body and an abrasion correctly, including the risks of patching and of contact lens wear; manage blunt and penetrating ocular trauma, including hyphaema and a suspected open globe; distinguish pre-septal from post-septal (orbital) cellulitis and state the management of each; recognise acute angle closure as an ophthalmic emergency and treat it in the right order; and describe the common minor procedures of ophthalmology — foreign body removal, lacrimal syringing, chalazion incision and curettage, cautery and simple lid repair.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 6 and 7 (Lens and cataract; Glaucoma). Phacomorphic glaucoma, traumatic lens subluxation and steroid or steroid-sparing decisions all depend on the aqueous dynamics taught there.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "The ocular emergency paradox",
        text: "The paradox that the eye has almost no capacity for self-repair (it cannot regenerate a scarred cornea or a detached retina) yet is the one organ in which a correct first ten minutes can preserve sight for a lifetime — so ophthalmic emergency care is almost entirely about the prioritisation of simple, immediate acts.",
      },
      {
        type: "paragraph",
        text: "Three situations dominate ocular emergency medicine: chemical injury, which must be irrigated before anything else including history; the red painful eye, which must be recognised as angle closure before chloramphenicol is reached for; and penetrating trauma, where a wrongly applied pressure patch can extrude the contents of a soft eye. In all three, the wrong reflex — the label of conjunctivitis, the pad over a penetrating wound, the alkali neutralised with acid — destroys vision in seconds to hours. Learn the reflexes of irrigation, shield and referral and you will save more sight in a casualty department than in any ophthalmic clinic.",
      },

      { type: "heading", level: 2, text: "Chemical injury" },
      {
        type: "paragraph",
        text: "Alkalis are more dangerous than acids, and this is the single most examinable fact in ocular emergency medicine. Acids coagulate the proteins they meet, creating a barrier that limits their own penetration; alkalis saponify cell membranes and penetrate deeply, continuing to burn the stromal collagen for hours to days. Both cause limbal ischaemia, which predicts the outcome because the limbus holds the corneal stem cells.",
      },
      {
        type: "table",
        headers: ["Step", "Action", "Rationale"],
        rows: [
          ["Irrigate immediately", "Copious irrigation of the eye and both fornices with normal saline or Ringer lactate for at least 30 minutes, checking the pH of the conjunctival fluid before and after, and repeating until neutral", "The commonest error is too little irrigation for too short a time; the clock for visual survival is measured in minutes"],
          ["Do not neutralise", "No acid for an alkali and no alkali for an acid", "Neutralisation is exothermic and adds chemical injury to the burn"],
          ["Remove particulate matter", "Evert the lids and sweep the fornices with a moistened swab; remove any lime particles", "A retained solid continues to burn"],
          ["Assess severity", "Look for limbal ischaemia (blanching) and corneal haze on the slit lamp; grade against the Roper-Hall classification", "Limbal ischaemia predicts corneal failure and the need for limbal stem cell transplantation"],
          ["Treat", "Topical antibiotic, cycloplegic, topical steroid in the first week to limit inflammation, ascorbate and citrate for corneal healing, and amniotic membrane grafting for severe burns", "Steroid after the first week promotes corneal melt and is withdrawn"],
          ["Refer", "All significant chemical injuries are seen by an ophthalmologist the same day", "The eye can look quiet externally while undergoing melting"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Irrigate before you take a history. The commonest cause of avoidable blindness after chemical injury is the delay between injury and first water, and the patient is usually brought in writhing in pain long before anyone asks what the substance was.",
      },

      { type: "heading", level: 2, text: "Thermal, radiation and other surface injuries" },
      {
        type: "table",
        headers: ["Injury", "Mechanism", "Management"],
        rows: [
          ["Thermal burn (flame, steam, hot metal)", "Direct coagulative damage to the lid and corneal epithelium", "Remove any adherent material, topical antibiotic, lid release if there is a contracture, and grafting for severe burns; the cornea itself is less affected than the lids"],
          ["Photokeratitis (welding arc, snow blindness)", "Ultraviolet burns to the corneal epithelium, presenting hours later with pain, photophobia, watering and superficial punctate staining", "Prophylactic topical antibiotic, a cycloplegic for pain, lubricants; recovers in 24-48 hours; protect with welding filters or snow goggles"],
          ["Conjunctival foreign body", "A subtarsal foreign body abrades the cornea with every blink, giving a linear vertical corneal stain", "Remove after topical anaesthetic, evert the lid, sweep the fornices, topical antibiotic and review in 24 hours"],
          ["Corneal foreign body", "A metallic foreign body that leaves a rust ring, or an organic one that risks infection", "Remove under topical anaesthesia with a needle or a rotary burr, remove the rust ring, topical antibiotic, no patch, review daily until healed"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Patching an eye risks two failures and delivers little benefit: it hides a progressing keratitis, and it permits an anaerobic environment. Modern practice is to avoid patching in infective or traumatic corneal abrasion, giving topical antibiotic, a cycloplegic, analgesia and daily review instead — the only common indication now is a bandage contact lens.",
      },

      { type: "heading", level: 2, text: "Blunt and penetrating trauma" },
      {
        type: "paragraph",
        text: "Blunt trauma injures the eye in a characteristic cascade: hyphaema (blood in the anterior chamber), traumatic iritis and, later, angle recession which causes glaucoma years afterwards. Penetrating trauma, in contrast, is a different world: a soft eye, a shallow chamber, a peaked or irregular pupil and a wound can be subtle, and no pressure of any kind may be applied — no pad, no tonometry, no squeezing.",
      },
      {
        type: "table",
        headers: ["Entity", "Presentation", "Management"],
        rows: [
          ["Corneal abrasion", "A painful, watery, photophobic eye with a fluorescein-staining epithelial defect", "Topical anaesthetic for the examination only, then antibiotic, cycloplegic and analgesia; no patch; review in 24 hours; contact lens wearers are treated for Pseudomonas"],
          ["Corneal foreign body", "A visible foreign body on the cornea with a rust ring if metallic", "Removal under topical anaesthesia with topical antibiotic and review; look for a second foreign body under the upper lid"],
          ["Hyphaema", "Blood in the anterior chamber forming a level, following blunt trauma with pain, photophobia and reduced vision", "Bed rest, head elevation, cyclopentolate or atropine, topical steroid, no aspirin and strict avoidance of rebleed; urgent referral for large hyphaemas or a rising pressure"],
          ["Angle recession and traumatic glaucoma", "Months to years after blunt trauma, the pressure rises with a deep chamber and an altered angle", "Gonioscopy after any significant blunt trauma; treat as glaucoma"],
          ["Subluxated or dislocated lens", "Blurring with a lens that trembles (iridodonesis) after trauma, or in Marfan or pseudoexfoliation", "Medical management of the consequent pressure, then surgical removal if indicated"],
          ["Orbital blowout fracture", "Periorbital oedema, restricted elevation, infraorbital anaesthesia and a step in the orbital rim after blunt trauma", "Computed tomography of the orbit, antibiotics, and repair if diplopia or enophthalmos persists"],
          ["Open globe (penetrating injury)", "A soft eye, a shallow chamber, a peaked or irregular pupil, a wound on the cornea or sclera, uveal tissue at the wound, and a relative afferent pupillary defect in severe cases", "Shield (not pad) the eye, no drops except a topical antibiotic and a systemic antibiotic for tetanus and infection, nil by mouth, arrange urgent surgical repair and imaging for a foreign body"],
          ["Intraocular foreign body", "A visible or occult foreign body after high-velocity injury, magnetic or organic", "Orbital radiography or computed tomography; magnetic resonance imaging is contraindicated with a suspected ferrous foreign body; urgent removal"],
          ["Sympathetic ophthalmia", "Bilateral granulomatous uveitis appearing weeks to months after a penetrating injury of the other eye", "Prevention: prompt closure of the wound, and enucleation of a hopeless eye within the critical window"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Never pad an open eye and never perform tonometry on a suspected open globe. A pressure dressing on a soft eye expresses the intraocular contents through the wound; a shield that rests on the globe rather than the brow is the correct protection, and magnetic resonance imaging must be avoided until a metallic foreign body is excluded.",
      },

      { type: "heading", level: 2, text: "Acute angle closure and the red painful eye" },
      {
        type: "paragraph",
        text: "The emergency management is repeated here because it is the endpoint of this course. Acute angle closure presents with severe pain, blurred vision with halos, a cloudy cornea, a semi-dilated fixed pupil, a hard eye, headache, nausea and vomiting, and it is treated within minutes: intravenous acetazolamide 500 mg, a topical beta-blocker, an apraclonidine, and a hyperosmotic (oral glycerol or intravenous mannitol) if the pressure is very high, then topical steroid and — once the pressure has fallen — pilocarpine to break the pupillary block. Definitive treatment is a laser peripheral iridotomy in both eyes.",
      },
      {
        type: "paragraph",
        text: "Two other emergencies complete the list: central retinal artery occlusion (sudden painless catastrophic blindness with a cherry-red spot, treated by lowering ocular pressure, and investigated as a stroke source and for giant cell arteritis) and, in the newborn, ophthalmia neonatorum with a copious purulent discharge needing immediate irrigation and systemic ceftriaxone. A sudden visual loss in a patient over 55 with headache, scalp tenderness and jaw claudication is giant cell arteritis until proven otherwise.",
      },

      { type: "heading", level: 2, text: "Orbital and pre-septal cellulitis" },
      {
        type: "table",
        headers: ["Feature", "Pre-septal cellulitis", "Orbital (post-septal) cellulitis"],
        rows: [
          ["Swelling", "Lid oedema with a normal globe", "Chemosis, proptosis and resistance to retropulsion"],
          ["Eye movements", "Full and painless", "Painful, restricted, with diplopia"],
          ["Vision", "Normal", "Afferent defect with reduced acuity in advanced disease"],
          ["Structures involved", "Anterior to the orbital septum", "Within the orbit (muscles, fat, optic nerve)"],
          ["Commonest causes", "Skin breach, insect bite, hordeolum, dacryocystitis in children", "Sinus disease (ethmoid), trauma, dental spread and haematogenous spread (children: Staph. aureus, Strep. pyogenes, Haemophilus influenzae)"],
          ["Management", "Oral antibiotics and careful review", "Admission, blood cultures and computed tomography, intravenous antibiotics, and drainage if an abscess or a source is found; a complication includes cavernous sinus thrombosis and blindness"],
        ],
      },

      { type: "heading", level: 2, text: "Minor surgery in ophthalmology" },
      {
        type: "table",
        headers: ["Procedure", "Indication", "Key technique points"],
        rows: [
          ["Corneal and subtarsal foreign body removal", "Any corneal or subtarsal foreign body", "Topical anaesthetic, a slit lamp where available, removal of metallic foreign bodies with a needle or a rotary burr and the rust ring, double eversion of the upper lid to find a second body, topical antibiotic and review within 24 hours"],
          ["Lacrimal syringing and probing", "Epiphora; congenital nasolacrimal duct obstruction", "General anaesthesia in children; probe the duct to the floor of the nose, stent or intubation for recurrence, dacryocystorhinostomy for adults with a distal obstruction; never syringe an inflamed sac"],
          ["Chalazion incision and curettage", "Persistent chalazion; recurrent or atypical lesion needing histology", "Under topical or local anaesthesia, a chalazion clamp is applied, a vertical incision is made on the conjunctival side, the lipogranuloma is curetted, and a pressure dressing is applied with antibiotic cover"],
          ["Corneal cautery (chemical or thermal)", "Recurrent corneal erosions and a neurotrophic ulcer, or to sterilise a punctate erosion pattern", "Chemical cautery with dilute iodine or thermal cautery of Bowman layer, applied after debridement to encourage adhesions"],
          ["Electrolysis of eyelashes", "Trichiasis without entropion, and misdirected lashes", "A fine probe is passed along the lash follicle to the root and the current applied, followed by epilation; repeat if regrowth occurs"],
          ["Tarsorrhaphy and lid repair", "Exposure keratopathy (temporary tarsorrhaphy) and lid lacerations (permanent repair)", "Align the lid margin first with a margin suture, repair the tarsus and levator if involved, and repair a canalicular tear over silicone tubes; tetanus and antibiotic cover for all wounds"],
          ["Pterygium excision with conjunctival autograft", "A pterygium threatening the visual axis or repeatedly inflamed", "Dissect the head from the cornea, remove the fibrovascular tissue, and reconstruct the conjunctiva with a graft limbal to limbal"],
          ["Intravitreal injection", "Macular oedema, age-related macular degeneration and acute intravitreal antibiotics in endophthalmitis", "A conjunctival preparation and sterile technique, injection through the pars plana, with post-injection antibiotic cover and monitoring for intraocular pressure rise"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The principles of minor ophthalmic surgery are the same as those of major surgery: a trained operator, anaesthesia of the eye, asepsis of the ocular surface, and the correct follow-up. The most common errors are not technical but follow-up failures: a foreign body that was not found, a repaired lid margin that is not aligned, or an eye that is not seen the day after.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Treating a chemical injury with a buffer rather than with time and saline. There is no shortcut to neutralisation of an alkali; the treatment is prolonged copious irrigation, and the amount of treatment is dictated by the pH, not by the patient's comfort.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Applying a pressure pad to an eye with a suspected penetrating injury. A pad expresses intraocular contents through the wound; the correct protection is a shield resting on the brow, no pressure to the globe, no tonometry, and urgent surgical referral.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Missing hyphaema in a patient with a blunt injury and severe pain. A painful, photophobic, red eye after blunt trauma needs a slit-lamp look for blood in the chamber, and a high-pressure or a total hyphaema needs admission and surgical consideration because of the risk of rebleed and blood staining of the cornea.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Diagnosing pre-septal cellulitis without examining eye movements and acuity. Lid oedema can be the presenting sign of an orbital abscess, especially in a child with sinus disease; any painful or restricted motility, proptosis, chemosis, or an afferent defect makes it orbital cellulitis, and it needs imaging, intravenous antibiotics and drainage.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A worker has his eye splashed with drain cleaner. What is the single most important first action and what is the rationale?",
        answer: "Immediate, copious irrigation of the eye and both fornices with saline or Ringer lactate for at least 30 minutes, checking the pH before starting and continuing until it is neutral, and repeating if the pH rises again. The rationale is that alkalis penetrate deeply and saponify membranes, so the delaying or diluting burn is the only intervention that prevents continued stromal injury; the pH confirms that dilution is complete.",
        explanation: "Irrigation precedes the history, the anaesthetic for the pain, and the contact lens removal, because a chemical burn is the only ocular injury where the first act determines the final result.",
      },
      {
        type: "question",
        prompt: "A welder presents several hours after arc exposure with bilateral pain, photophobia and watering. What has happened and how is it managed?",
        answer: "Photokeratitis from ultraviolet burns to the corneal epithelium, typically presenting 6-12 hours after exposure with superficial punctate staining. Management is topical antibiotic prophylaxis, a cycloplegic for pain, lubricants, oral analgesia, and protective goggles in future work; recovery is complete in 24-48 hours.",
        explanation: "The latency distinguishes this from a mechanical abrasion, and bilateral disease with no history of injury is the clue.",
      },
      {
        type: "question",
        prompt: "A patient with a blunt eye injury has a blood level in the anterior chamber. What is the management and which complications must be watched for?",
        answer: "Hyphaema: bed rest with head elevation, a cycloplegic (atropine or cyclopentolate), topical steroid, avoidance of aspirin and non-steroidal analgesics, and urgent ophthalmic referral, with admission for large or total hyphaemas or raised pressure. The complications are rebleed (which carries a much worse prognosis), corneal blood staining, secondary glaucoma, and late angle-recession glaucoma.",
        explanation: "Hyphaema is both an acute emergency and a long-term follow-up diagnosis, because angle-recession glaucoma may appear years later.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A worker has his eye splashed with drain cleaner. He has intense blepharospasm and pain. What is the single most important first action in the emergency department, and what is the rationale?",
        options: [
          "Neutralise the alkali with a dilute acid solution as soon as possible",
          "Instil a topical corticosteroid first and arrange follow-up after the swelling settles",
          "Instil topical anaesthetic and pad the eye for comfort, then refer the following morning",
          "Irrigate the eye and both fornices with normal saline or Ringer lactate, checking the pH and continuing until the pH is neutral, because alkalis penetrate deeply and continue to burn",
        ],
        correctIndex: 3,
        explanation: "The single most important action is immediate copious irrigation, because alkalis saponify membranes and continue to penetrate and destroy the cornea for hours; only dilution and the measured pH halts the process. Neutralisation is exothermic and worsens the injury, steroids do not treat the burn, and padding delays the treatment that saves sight.",
      },
      {
        type: "mcq",
        stem: "A patient has a small laceration of the upper lid margin after a fall, with a full-thickness defect at the lid margin. Which arrangement of the repair matters most for the functional outcome?",
        options: [
          "Aligning the skin suture line first so the scar is hidden",
          "Exact alignment of the lid margin, followed by repair of the tarsal plate, levator if involved, and the canaliculus over a silicone tube if lacerated",
          "Applying a pressure patch and referring to a plastic surgeon",
          "Leaving the laceration to heal by secondary intention because lids heal well",
        ],
        correctIndex: 1,
        explanation: "The functional outcome of a lid laceration depends on precise margin alignment (a notched margin gives a watering, irritated eye and a permanent notch), with repair of the tarsal plate and levator for a ptosis, and the canaliculus stented if it is cut. Skin closure is comparatively cosmetic; a pad and no repair guarantees a defect.",
      },
      {
        type: "mcq",
        stem: "A child with sinus disease has a swollen, red lid and cannot look up without pain, with proptosis, chemosis and reduced acuity. Which is the correct management?",
        options: [
          "Oral antibiotics and outpatient review in one week",
          "Warm compresses and a topical antibiotic only",
          "Admission, blood cultures, computed tomography of the orbit, and intravenous antibiotics with surgical drainage if an abscess is present",
          "Urgent magnetic resonance imaging and no antibiotics until the result is available",
        ],
        correctIndex: 2,
        explanation: "Painful, restricted eye movements with proptosis, chemosis and reduced acuity are orbital (post-septal) cellulitis, an emergency requiring admission, computed tomography, blood cultures, and intravenous antibiotics with surgical drainage if an abscess is found; the sinister complications are cavernous sinus thrombosis, vision loss and intracranial spread. Oral antibiotics and warmth are the treatment of pre-septal cellulitis only.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Ocular emergency care is dominated by three simple acts: irrigate a chemical injury copiously for thirty minutes without neutralising, shield rather than pad any eye with a suspected open wound, and never treat a deeply painful red eye with a reduced pupil position as conjunctivitis. Blunt trauma produces hyphaema and angle recession; penetrating trauma produces a soft eye, a shield, no pressure, and urgent repair — and it threatens the second eye through sympathetic ophthalmia. Orbital cellulitis is distinguished from pre-septal disease by painful or restricted motility, proptosis and chemosis, and needs imaging and intravenous antibiotics. The common minor procedures — foreign body removal, syringing, chalazion drainage, cautery, electrolysis, lid repair and tarsorrhaphy — are all performed with the same aseptic discipline and follow-up expectations as intraocular surgery.",
      },
      {
        type: "paragraph",
        text: "Next: the national programme for the control of blindness and eye banking, where the clinical knowledge of this course becomes a public-health programme organised around the cataract patient and the eye donor.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 11 — National blindness programme & eye banking (fully authored)
// ---------------------------------------------------------------------------
function lesson11() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define blindness and low vision as used in India and by the World Health Organization, and state the causes and magnitude of blindness; describe the National Programme for Control of Blindness now NPCBVI, its delivery strategy and its achievements; outline the components of the programme's surgical service — cataract surgical out-reach, school screening and district blindness control; define eye banking and the criteria for eye donation, corneal retrieval and storage; and describe the indications, techniques and limitations of corneal transplantation.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 6 (Lens and cataract) for the largest service the programme delivers, and lesson 5 (Cornea, sclera and uveitis) for the corneal disease that transplantation treats.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Avoidable blindness",
        text: "Blindness that could be prevented by effective treatment — the majority of blindness worldwide, led by cataract (the commonest cause in India and the most citable by surgery), as well as trachoma, childhood blindness and diaper conditions such as xerophthalmia — as distinct from blindness from untreatable causes.",
      },
      {
        type: "paragraph",
        text: "Blindness is one of the few diseases for which almost the whole burden is preventable, and every national programme is therefore a logistics problem more than a medical one. The cataract that a village woman cannot have removed is not caused by a gap in medical knowledge but by a gap in transport, funds, surgeon capacity, or in belief that restoration is possible. The National Programme for Control of Blindness is the institutional answer: a delivery system of district blindness units, screening camps, subsidised intraocular lenses, school screening programmes, and the collection of donated corneas. It is also the context in which most Indian ophthalmologists will spend their careers, which is why it is in this course at all.",
      },

      { type: "heading", level: 2, text: "Definitions and magnitude" },
      {
        type: "table",
        headers: ["Term", "Definition", "Relevance"],
        rows: [
          ["Blindness (Indian definition)", "Visual acuity less than 3/60 or a field less than 10 degrees in the better eye on standard refraction (per the National Programme for Control of Blindness; formerly 6/60)", "The standard for registration of blindness in India"],
          ["Economic and social blindness", "Visual acuity less than 3/60 in the better eye with a normal field, where the loss interferes with the person's capacity to function economically and socially", "The practical working definition used for programme planning in India"],
          ["Low vision", "Best-corrected acuity in the better eye of 6/18 to 3/60 (WHO: visual impairment less than 6/18 but not meeting the blindness threshold)", "Managed with low-vision aids, magnification and referral to rehabilitation rather than with medical treatment"],
          ["WHO categories of visual impairment", "Mild (6/18 or worse), moderate (6/60), severe (less than 6/60 to 3/60) and blind (less than 3/60 or central field under 10 degrees), with loss corrected by refraction only", "Used for global and national burden estimates"],
          ["Global magnitude", "About 280 to 300 million people worldwide with visual impairment, of which roughly 40 million are blind; roughly the same number are in India alone despite India having had many decades of programme activity", "The international framing of a preventable public-health problem"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Roughly 80 per cent of blindness worldwide is avoidable, and cataract is the cause in about half of the total. Blindness is also unequally distributed: the overwhelming majority is in low- and middle-income countries, and those affected are disproportionately the elderly, women and the rural poor — precisely the groups least able to reach a hospital.",
      },

      { type: "heading", level: 2, text: "Causes of blindness" },
      {
        type: "table",
        headers: ["Cause", "Proportion and setting", "Programme response"],
        rows: [
          ["Cataract", "The commonest cause of blindness in India and of all blindness that is citable by surgery", "Identified and operated on in screening camps and district hospitals; funded through the programme with IOL implantation"],
          ["Refractive error", "Very common, especially in schoolchildren and the elderly poor", "School screening programmes, refraction services and subsidised spectacles"],
          ["Glaucoma and diabetic retinopathy", "Increasing causes of irreversible blindness as populations age and diabetes rises", "Primary-care detection with intraocular pressure and fundoscopy, and referral for treatment"],
          ["Corneal blindness", "Sequel of injury, keratitis, traditional eye medicines, and xerophthalmia", "Prevention (first aid, vitamin A supplementation), and corneal transplantation"],
          ["Childhood blindness", "Vitamin A deficiency, cataract, retinopathy of prematurity and strabismic amblyopia", "Vitamin A supplementation prophylaxis, detection in school screening, and the treatment of treatable childhood disease"],
          ["Trachoma and other infections", "The historic infective cause, controlled through SAFE", "Antibiotic distribution, surgery and environmental hygiene"],
        ],
      },

      { type: "heading", level: 2, text: "The National Programme for Control of Blindness" },
      {
        type: "paragraph",
        text: "The programme began in 1976 as the National Programme for Control of Blindness and integrated the National Programme for Control of Blindness and Visual Impairment (NPCBVI) from 2017, becoming the only integrated programme of blindness and of non-communicable disease control. Its stated aim has been from the start the reduction of the prevalence of blindness to a level where it no longer is a public-health problem — achieved through services for case detection, and treatment, and through the infrastructure that allows both to happen.",
      },
      {
        type: "table",
        headers: ["Component", "Mechanism", "Notes"],
        rows: [
          ["District blindness control units", "District-level centres providing surgical and diagnostic facilities, administering the programme, and performing eye camps with contractual outreach", "The delivery unit; the foundation of the decentralised structure"],
          ["Screening and surgical outreach (eye camps)", "Patients identified during screening are transported to a camp or hospital where the surgeon operates over a weekend", "High-volume surgery is delivered at low cost, but is criticized for burnout of surgeons, poor outcome auditing and the financial burden on patients who must pay for intracellular lenses or transport"],
          ["Intraocular lens subsidy and financing", "The programme subsidises IOLs and, through the government insurance schemes, the surgical cost for poor patients", "The IOL is now the standard of cataract surgery in programme camps; no-stitch surgery has enabled the camps model"],
          ["School eye screening programmes", "Teachers and health workers screen children for visual acuity, cover tests and vitamin A deficiency, with referrals to district units", "Aims both at refractive correction and at the earlier detection of amblyopia and age-related causes"],
          ["Human resource development and training", "Ophthalmic assistants and technicians trained to allow cataract surgeons and medical officers", "The single most important resource, and the limiting factor in volume services"],
          ["Vision centres and teleophthalmology", "Primary-care vision centres with low-cost imaging and remote reading.", "The newest strategy: screening close to the community and teleconsultation, with the aim of avoiding camps altogether"],
          ["Non-communicable disease integration", "Integration of vision into the National Programme for the Prevention and Control of Cancer, Diabetes, Cardiovascular Diseases and Stroke, and screening for diabetes through retinal screening", "The recognition that diabetic retinopathy and AMD are rising causes of blindness"],
          ["Vitamin A supplementation and measles immunisation", "Megadose vitamin A to children and universal measles immunisation", "Reduces xerophthalmia (a leading cause of retinal blindness in children)"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The dominant critique of a camp-based, high-volume cataract service is the quality gap: without follow-up, an audit of postoperative acuity and a record of visual outcomes, a high surgical output is not the same as restoration of sight. The programme's move towards vision centres, refractive services and audits is a response to exactly this.",
      },

      { type: "heading", level: 2, text: "Eye banking" },
      {
        type: "definition",
        term: "Eye bank",
        text: "A facility that retrieves, evaluates, preserves and distributes human donor corneas (and sclera) for transplantation. In India the retrieval, storage and distribution of eye tissue is governed by the Transplantation of Human Organs Act, and eye donation is an organ donation whose body is restored to the family for funeral because only the cornea is removed.",
      },
      {
        type: "paragraph",
        text: "The cornea is the ideal donated tissue: it is avascular and therefore immunologically privileged, so grafts can be transplanted without the tissue typing or immunosuppression that an organ transplant requires. One donor provides two corneas, ideally retrieved within hours of death (the cornea stays viable for 4 days to about two weeks), stored in preservation medium such as McCarey-Kaufman medium at 4 degrees. The constraints are not surgical but social: pledges that are not communicated to families, and families who refuse at the moment of grief, mean that the majority of retrieved corneas are unused.",
      },
      {
        type: "table",
        headers: ["Step", "What happens", "Notes"],
        rows: [
          ["Pledge and retrieval", "A donor gives a pledge to donate eyes, the family consents after death, and the eye bank retrieves the corneas within hours at the place of death", "The body is returned intact for funeral rites; only the cornea is removed in the eye bank retrieval"],
          ["Evaluation", "Screening of the donor for systemic and ocular infection (HIV, hepatitis, rabies, septicaemia, leukaemia) and assessment of the tissue", "Contraindications: active systemic sepsis, HIV infection, viral encephalitis, and malignancy of the blood; these protect the recipient"],
          ["Storage", "Storage at 4 degrees in McCarey-Kaufman medium (viable for 4-7 days) or organ culture at 31 degrees (up to a month)", "The eye bank is also a laboratory; temperature logs and media dates are the critical quality data"],
          ["Distribution", "Corneas are allocated to surgeons on a registered waiting list, with corneal donor tissue used first for the urgent cases", "Registry and waiting list transparency is a major function of the Eye Bank Association of India and the regulatory framework"],
          ["Transplant outcomes", "Graft clarity is reported back to the eye bank and used for continuous quality improvement", "The feedback loop is what improves both tissue quality and surgical care"],
        ],
      },
      {
        type: "definition",
        term: "Corneal blindness",
        text: "Blindness from loss of corneal clarity: from scarring (trachoma, keratitis), from injury (including the traditional eye medicines common in India), from dystrophy and degeneration, and from keratoconus; treatable only by replacing the cornea with donor tissue or, in some cases, by a keratoprosthesis.",
      },

      { type: "heading", level: 2, text: "Corneal transplantation" },
      {
        type: "table",
        headers: ["Technique", "What is done", "Indication"],
        rows: [
          ["Penetrating keratoplasty", "A full-thickness donor corneal button is sutured into the recipient cornea", "Full-thickness disease: dense central scarring, keratoconus not correctable with contact lenses, and stromal dystrophy"],
          ["Deep anterior lamellar keratoplasty (DALK)", "The recipient's diseased stroma is replaced with donor stroma while the host endothelium is retained", "Stromal disease with a healthy endothelium — keratoconus and stromal scars; avoids endothelial rejection"],
          ["Descemet stripping endothelial keratoplasty (DMEK)", "Only the donor endothelium and Descemet membrane are transplanted", "Endothelial disease such as Fuchs dystrophy: less astigmatism and more rapid visual rehabilitation"],
          ["Descemet stripping automated endothelial keratoplasty (DSAEK)", "A thin donor lamella of stroma and endothelium is transplanted", "Endothelial disease where a mechanically easier technique is preferred; almost universally used"],
          ["Keratoprosthesis", "An artificial corneal device", "For failed grafts or otherwise intractable corneal opacity (chemical injury, Stevens-Johnson syndrome)"],
        ],
      },
      {
        type: "paragraph",
        text: "The commonest late complication is graft rejection — an immune response against donor tissue, presenting as a red eye with reduced vision and an inflammation at the graft margin — which is treated by increasing topical steroid and is prevented by careful suturing, prompt treatment of rejection episodes and, in high-risk grafts, systemic immunosuppression. Graft clarity is not the same as restoration of sight: a graft can be perfectly clear while the retina or optic nerve behind it no longer functions, which is why preoperative assessment of the retina matters more than the corneal disease being replaced.",
      },

      { type: "heading", level: 2, text: "Worked example: the blind villager and the eye bank" },
      {
        type: "paragraph",
        text: "An elderly woman in a village has bilateral mature cataracts and cannot continue to work. The programme approach is layered: identification at a screening camp, referral to a district hospital, financing of the IOL through the programme, and a small-incision cataract extraction with an intraocular lens — restoring her vision in a single operating episode. By contrast, the man next to her with a corneal scar from a traditional eye medicine has no such option unless a donor cornea is available: which is why the eye bank, not the surgeon, is the limiting factor in the treatment of corneal blindness, and why eye-donation public education is a public-health intervention rather than a hospital one.",
      },
      {
        type: "question",
        prompt: "Why is corneal transplantation not performed like organ transplantation with tissue matching and lifelong immunosuppression?",
        answer: "Because the cornea is avascular and therefore immunologically privileged — there are no blood vessels through which the recipient's immune system can meet the donor's antigens, so grafts survive without systemic matching or chronic immunosuppression. This is what makes corneal banking possible at scale, and it is also why the transplant must be performed under topical steroid cover: rejection is still possible (classically against the endothelium), and it responds to steroid if caught early.",
        explanation: "The absence of lymphatics and blood vessels in the cornea is the reason it can be banked, and it is why rejection episodes are rarer and less severe than in other transplants.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Telling a family that eye donation is not possible for a diseased donor. The decision is made by the eye bank against its own criteria, not by the clinician at the bedside; most people are eligible donors, and even people with diabetes and hypertension donate usable corneas.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Assuming that removing the eye is disfiguring. The eye bank removes only the cornea, the contour of the lids is preserved, and the body is returned intact for the funeral — the refusal of consent on this ground is one of the commonest avoidable losses of donated tissue.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating blindness registration as a formality. Registration in India determines access to subsidised travel, pensions and benefits, and the low-vision assessment that often converts an officially blind person into a functioning one with the correct aid.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Focussing only on the number of cataract operations performed and not on the visual outcome. The programme's modern measures include cataract surgical outcome, follow-up, correction of refractive error after surgery and the non-communicable screening that prevents the next generation of blind eyes.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why can a corneal graft be transplanted without tissue matching, and why can the graft still be rejected?",
        answer: "The cornea is avascular and relatively lymphatic-poor, so it is immunologically privileged and does not require systemic matching or chronic immunosuppression. It can still undergo rejection — most commonly endothelial rejection — presenting as reduced vision, a red eye and an endothelial rejection line, treated by intensifying topical steroid, which is why early presentation is stressed to graft recipients.",
        explanation: "The privilege is relative, not absolute, and the steroid prophylaxis given for months after surgery protects it.",
      },
      {
        type: "question",
        prompt: "What is the essential difference between a low-vision service and a medical or surgical service, and whom does it serve?",
        answer: "A low-vision service addresses people whose vision cannot be improved medically or surgically — it provides magnification, telescopic and electronic aids, contrast and illumination improvement, and training in residual vision — whereas medical and surgical services treat the disease. It serves the irreversibly impaired and completes the rehabilitation pathway that begins with screening and treatment.",
        explanation: "In the Indian programme, low-vision assessment, refractive services and visual rehabilitation are integral to delivery, not optional extras.",
      },
      {
        type: "question",
        prompt: "What are the two biggest constraints on corneal transplantation in India, and what does the programme do about them?",
        answer: "The first is the supply of corneas — collection is limited by the small number of people who donate eyes (and the even smaller number who have told their families they intend to), and by the cost of retrieval and storage. The second is access to a transplant surgical service. The programme responds through the Eye Bank Association of India's network, public education campaigns, the law governing eye donation, and training programmes that expand surgical capacity.",
        explanation: "The constraint is not the technical skill of transplantation but the supply of tissue and the equity of access.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "In relation to India's National Programme for Control of Blindness (now NPCBVI) and to eye banking, which statement is correct?",
        options: [
          "Blindness in India is defined as visual acuity less than 6/60 in the better eye and the programme does not include school screening",
          "Cataract is the commonest cause of blindness in India, and the programme delivers surgical treatment through district blindness control units, screening camps, IOL subsidy and school eye screening, while eye donation is voluntary and governed by the Transplantation of Human Organs Act",
          "The programme retrieves whole eyeballs from donors rather than corneas",
          "Corneal transplants require tissue matching and lifelong immunosuppression like renal transplants",
        ],
        correctIndex: 1,
        explanation: "Cataract is the leading cause of blindness in India, and the programme's strategy is decentralised: district blindness control units, screening camps with IOL subsidy, school eye screening, and human resource development. Eye donation is voluntary and governed by the Transplantation of Human Organs Act; only corneas (and sclera) are retrieved, and corneal grafts do not require matching or chronic immunosuppression because the cornea is avascular and immunologically privileged.",
      },
      {
        type: "mcq",
        stem: "Which statement correctly describes the priority in the management of a mass blind population and the concept of avoidable blindness?",
        options: [
          "Most blindness worldwide is untreatable, so the priority is registration and rehabilitation only",
          "About 80 per cent of blindness is avoidable, so the programme's first priority is treating cataract — the commonest cause — and then preventing corneal blindness, childhood blindness and untreatable causes",
          "Avoidable blindness in India is dominated by glaucoma and diabetic retinopathy, which must be solved before cataract",
          "Avoidable blindness refers only to blindness caused by vitamin A deficiency",
        ],
        correctIndex: 1,
        explanation: "The overwhelming burden of blindness worldwide is avoidable: cataract (the commonest cause), uncorrected refractive error, diabetic retinopathy, trachoma and childhood causes. The programme's delivery is therefore weighted towards cataract surgery at high volume and quality, with refractive services and school screening alongside, while rehabilitation serves people who cannot have vision restored.",
      },
      {
        type: "mcq",
        stem: "A family asks whether they can donate the eyes of a relative who died of diabetes and hypertension. Which response is correct?",
        options: [
          "Diabetes and hypertension are contraindications to eye donation and the donation should be refused",
          "Donation is possible; diabetes and hypertension are not absolute contraindications, and the eye bank decides eligibility against its own screening criteria",
          "Only corneas from donors under the age of 60 can be used",
          "The donation must be performed with the family present and the whole globe removed for laboratory assessment",
        ],
        correctIndex: 1,
        explanation: "Eye donation is not precluded by diabetes or hypertension, which are not contraindications. Contraindications are specific: active systemic infection, HIV, viral encephalitis, and certain malignancies. Eligibility is assessed by the eye bank against tissue-screening criteria, and only the cornea is retrieved, with the body returned intact for the funeral.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Blindness is defined in India by a visual acuity of less than 3/60 in the better eye, and roughly 80 per cent of it is avoidable, with cataract as the commonest cause. The National Programme for Control of Blindness (now NPCBVI) is a delivery system built on district blindness control units, screening camps with subsidised intraocular lenses, school screening, human-resource development and, increasingly, vision centres, screening and teleophthalmology. Eye banking supplies the corneas for which there is no other treatment than transplantation, and it is limited not by surgeons but by the supply of consenting donors; the cornea's avascularity is what makes grafting possible without systemic tissue matching and chronic immunosuppression, and graft rejection remains a treatable but urgent postoperative event.",
      },
      {
        type: "paragraph",
        text: "This completes the ophthalmology course. Every concept from the surface flora of lesson 1 through the epidemiology and eye banking of lesson 11 rests on the same anatomy, the same pattern of signs, and the same principle of the whole course: that ophthalmology is one of the few specialties where the examiner's most useful instruments are a torch, a Snellen chart, and the discipline to measure, record and refer.",
      },
    ],
  };
}

export async function seedOphthalmology(): Promise<void> {
  const counts = await seedMbbsCourse(OPHTHALMOLOGY);
  console.log(`✓ ${OPHTHALMOLOGY.code} ${OPHTHALMOLOGY.title}: ${counts.modules} modules · ${counts.concepts} concepts · ${counts.lessons} lessons · ${counts.items} items`);
}

if (process.argv[1] && (process.argv[1].includes("mbbs/ophthalmology") || process.argv[1].includes("seed-assessment-ophthalmology"))) {
  seedOphthalmology()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
}
