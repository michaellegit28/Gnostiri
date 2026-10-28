import { prisma, seedMbbsCourse, type SubjectSeed } from "./spine";
import type { LessonContent } from "@/types/lesson";

const PLACEHOLDER: LessonContent = { blocks: [] };

/**
 * DERM 307 — Dermatology & Venereology.
 *
 * All four modules are authored in full — 11 lessons in the house
 * pilot-report format: learning outcomes, prerequisites, the big idea,
 * explanation, worked clinical examples, common mistakes, check questions,
 * MCQs and a closing summary. Content is confined to established dermatological
 * and venereological teaching: skin structure and the barrier, the descriptive
 * language of morphology, the bacterial, fungal, viral and infestational
 * dermatoses, leprosy and the sexually transmitted infections, the eczema,
 * papulosquamous, vesicobullous and pigmentary disorders, the genodermatoses
 * and the cutaneous markers of HIV, and the dermatological emergencies.
 *
 * No diagram blocks are used: there is no skin diagram registered in
 * src/components/diagrams, so every relationship a diagram would carry is
 * expressed as a table instead, which the renderer shows in full.
 */
// ---------------------------------------------------------------------------
// LESSON 1 — Skin structure & function (fully authored)
// ---------------------------------------------------------------------------
function lesson1() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the epidermis as a differentiating epithelium and name its layers from the stratum basale to the stratum corneum; name the four resident cell populations of the epidermis and the function of each; describe the dermo-epidermal junction in the terms that predict where a blister forms; name the appendages and state what each contributes to the functions of skin; explain the barrier, thermoregulatory, immune, synthetic, sensory and psychosocial functions of skin as a working organ; and explain how the anatomy of skin predicts the patterns of blistering, of scarring and of wound healing.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "PATH 201 (Pathology — cell injury, inflammation and repair), the pre-clinical course this subject lists as its prerequisite. You also need the histology of epithelia and of connective tissue from ANAT 101.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Skin",
        text: "The largest organ of the body by surface area: in an adult roughly 1.5 to 2 square metres, weighing 3 to 4 kg without its subcutaneous fat. It is a two-compartment organ — an ectodermal epithelium (the epidermis) that renews itself constantly, resting on a mesodermal connective tissue (the dermis) that gives it strength, nutrition and elasticity.",
      },
      {
        type: "paragraph",
        text: "The most useful idea in dermatology is that skin is not a wrapping but an organ with a job list. It keeps water and electrolytes in and the outside world out; it holds a large variable blood reservoir in a surface radiator that can shed or conserve heat; it carries the immune system's largest outer perimeter; it synthesises a vitamin; it feels pressure, pain and temperature; and it is the surface on which a person's health is read by everyone they meet. Almost every dermatological disease you will study can be read as a failure of one of those tasks, which is why this lesson comes first.",
      },

      { type: "heading", level: 2, text: "The epidermis: a conveyor belt of keratinocytes" },
      {
        type: "paragraph",
        text: "The epidermis is about 90 per cent keratinocytes, arranged as a stratified squamous keratinising epithelium. Mitosis happens in the deepest layer only, and each daughter cell is pushed upwards while it differentiates — flattening, manufacturing keratin and lipids, and finally losing its nucleus. The whole journey from basal division to shedding takes about 28 to 40 days, of which roughly 14 are spent crossing the epidermis and the last 14 as a dead corneocyte waiting to be shed. The epidermis has no blood supply: everything diffuses up from the capillary loops of the dermal papillae, which is why a superficial blister heals without a scar and a deep wound does not.",
      },
      {
        type: "table",
        headers: ["Layer", "Appearance", "What it is doing"],
        rows: [
          ["Stratum corneum (horny layer)", "20 to 30 rows of dead, flat, anucleate corneocytes, 10 to 20 micrometres thick", "The barrier. Corneocytes are the bricks; ceramides, cholesterol and free fatty acids are the mortar. Cells are shed invisibly as squames"],
          ["Stratum lucidum (clear layer)", "A thin translucent band of eleidin, present only in thick skin such as palms and soles", "Extra protection where mechanical load is highest; absent from thin skin everywhere else"],
          ["Stratum granulosum (granular layer)", "Two to five rows of flattened cells with dark basophilic keratohyalin granules", "Keratin filament aggregation and secretion of lamellar bodies — the lipids that waterproof the horny layer"],
          ["Stratum spinosum (prickle layer)", "Several rows of polyhedral cells joined by desmosomes, giving a spiny outline on section", "Synthesis of keratin filaments and of the adhesion proteins holding the sheet together; the suprabasal split of pemphigus vulgaris sits here"],
          ["Stratum basale (germinative layer)", "A single row of cuboidal cells on the basement membrane, with mitotic figures and melanin caps above each nucleus", "Cell division, and attachment of the epidermis to the basement membrane through hemidesmosomes"],
        ],
      },
      {
        type: "table",
        headers: ["Resident cell", "Proportion", "Function"],
        rows: [
          ["Keratinocyte", "About 90 per cent", "Barrier formation, keratin and lipid synthesis, cytokine release that drives cutaneous immunity"],
          ["Melanocyte", "One per five to ten basal cells, about 1000 to 2000 per square millimetre", "Synthesises melanin in melanosomes and donates it to surrounding keratinocytes — the epidermal melanin unit — giving photoprotection"],
          ["Langerhans cell", "2 to 8 per cent of epidermal cells", "The major antigen-presenting cell of skin: CD1a and langerin positive, Birbeck granules on electron microscopy, migrates to the regional node"],
          ["Merkel cell", "Sparse, clustered in touch domes", "Slowly adapting mechanoreceptor of the basal layer; the cell of origin of Merkel cell carcinoma"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Melanocyte density is the same in every skin colour — about 2000 per square millimetre. Skin colour depends on how much melanin is made, how large the melanosomes are, how they are distributed inside the keratinocytes (singly in dark skin, membrane-bound clusters in pale skin) and how fast they are degraded. Nobody has more or fewer melanocytes: they differ in output.",
      },

      { type: "heading", level: 2, text: "The dermo-epidermal junction: where blisters form" },
      {
        type: "paragraph",
        text: "The dermo-epidermal junction is a three-part protein sandwich, and both the autoimmune and the inherited blistering diseases are classified by which component the attack falls on. From the basal cell downwards: the hemidesmosome (integrin alpha-6 beta-4 and BP180 in the keratinocyte membrane), the lamina lucida with its anchoring filaments (laminin 332), and the sublamina densa anchoring fibrils of type VII collagen that loop into the dermal collagen. A split above the anchoring fibril regenerates without a scar; a split at or below it scars.",
      },
      {
        type: "table",
        headers: ["Disease", "Target", "Level of the split", "Consequence"],
        rows: [
          ["Pemphigus vulgaris", "Desmoglein 3 (and 1) in the desmosome between keratinocytes", "Suprabasal, intraepidermal", "Flaccid fragile bullae and erosions; heals without scarring"],
          ["Bullous pemphigoid", "BP180 and BP230 of the hemidesmosome", "Subepidermal, at the lamina lucida", "Tense bullae on an urticarial base; usually heals without scarring"],
          ["Epidermolysis bullosa acquisita", "Type VII collagen of the anchoring fibril", "Below the lamina densa", "Trauma-induced blisters that scar and leave milia"],
          ["Dermatitis herpetiformis", "Epidermal transglutaminase — IgA deposited in the dermal papillae", "Microabscesses at the papillary tips", "Excoriated, intensely itchy vesicles on extensor surfaces"],
        ],
      },

      { type: "heading", level: 2, text: "The dermis and its matrix" },
      {
        type: "paragraph",
        text: "The dermis is a fibroelastic connective tissue 1 to 4 mm thick, divided into the papillary dermis just below the junction (thin collagen fibres, capillary loops, free nerve endings, Meissner corpuscles) and the reticular dermis below it (thick type I collagen bundles, elastic fibres, ground substance). Fibroblasts maintain the matrix; mast cells, macrophages and dermal dendritic cells provide the inflammatory cellularity; the appendages, blood vessels, lymphatics and nerves all run through this layer. Collagen is mostly type I with type III around vessels and appendages; elastic fibres give recoil, and their loss is why sun-damaged skin wrinkles instead of springing back.",
      },

      { type: "heading", level: 2, text: "The appendages" },
      {
        type: "table",
        headers: ["Appendage", "Structure", "Function and clinical note"],
        rows: [
          ["Hair follicle", "An invagination of epidermis with a bulb of matrix cells, an inner root sheath and the arrector pili muscle at its acute angle", "Insulation and physical protection; androgen-dependent (androgenetic alopecia, hirsutism). Cycles: anagen 2 to 6 years (85 to 90 per cent), catagen 2 to 3 weeks, telogen about 3 months; scalp growth about 1 cm per month"],
          ["Sebaceous gland", "Holocrine, draining into the follicular canal; most numerous on scalp, face and upper trunk, absent from palms and soles", "Sebum: triglyceride and squalene hydrolysed by bacterial lipases to free fatty acids. The substrate for Cutibacterium acnes in acne, and part of the acid mantle"],
          ["Eccrine sweat gland", "A coiled tubular gland with a cholinergic sympathetic supply; 2 to 5 million, densest on palms, soles and axillae", "Thermoregulation by evaporative cooling, secreting up to 1 to 2 litres per hour; the route of water and electrolyte loss in fever, exercise and thyrotoxicosis"],
          ["Apocrine gland", "A larger gland of axilla and anogenital skin opening into the follicle above the sebaceous duct", "Odourless secretion modified by bacteria into body odour; active only after puberty; involved in hidradenitis suppurativa"],
          ["Nail unit", "Matrix producing the plate, bed, lunula, cuticle and the hyponychial seal", "A protective precision plate; fingernails grow about 3 mm per month with full replacement in about 6 months, toenails 1 mm per month with 12 to 18 months for full regrowth"],
        ],
      },

      { type: "heading", level: 2, text: "The functions of skin, and how they fail" },
      {
        type: "table",
        headers: ["Function", "Mechanism", "Failure in disease"],
        rows: [
          ["Barrier", "Stratum corneum bricks and mortar, acid mantle at pH 4.5 to 5.5, antimicrobial peptides, granular-layer tight junctions", "Atopic dermatitis and aged skin: increased transepidermal water loss, allergen penetration, staphylococcal colonisation"],
          ["Thermoregulation", "A cutaneous vascular reservoir of several litres plus millions of sweat glands under hypothalamic and local control", "Erythroderma and burns: uncontrolled heat and water loss, hypermetabolism, high-output cardiac failure"],
          ["Immune defence", "Langerhans and dermal dendritic cells presenting antigen, keratinocyte cytokines, antimicrobial peptides, mast cells and resident T cells", "Psoriasis and dermatitis: the same system turned against self; UV-induced immunosuppression is why a wart can be treated with light"],
          ["Vitamin D synthesis", "UVB at 290 to 315 nm photolyses 7-dehydrocholesterol in the epidermis to previtamin D3", "Malabsorption, dark skin at high latitude, veil-wearing: rickets and osteomalacia"],
          ["Sensation", "Free nerve endings (pain, temperature), Merkel cells (sustained touch), Meissner and Pacinian corpuscles, hair-follicle receptors", "Leprosy and diabetic neuropathy: anaesthetic limbs that burn, ulcer and are destroyed without pain"],
          ["Wound healing", "Re-epithelialisation from wound edges and surviving appendages, granulation tissue, myofibroblast contraction, collagen remodelling", "Diabetes, venous disease, cytotoxics and pressure: chronic ulceration and hypertrophic scarring"],
          ["Psychosocial", "Appearance, touch and facial expression carry the first impression in every social encounter", "Vitiligo, acne and psoriasis: measurable anxiety, depression and quality-of-life loss out of proportion to physical severity"],
        ],
      },
      {
        type: "question",
        prompt: "Why does a burn that destroys only the epidermis heal perfectly, while a burn into the reticular dermis leaves a permanent scar and a contracted joint?",
        answer: "Because the epidermis regenerates from surviving basal cells and from appendages that remain alive in the dermis, and no dermal collagen has been destroyed. A reticular dermal burn destroys the collagen framework and the appendages, so the wound can only close by contraction and fibrosis — a scar that tightens and limits movement.",
        explanation: "This is why burn depth is estimated clinically and why split-thickness grafts take: the donor dermis keeps its appendages and re-epithelialises from within.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Treating skin as dead wrapping rather than a live organ. The epidermis has no blood supply but is metabolically active, immunologically competent and stem-cell rich, and the dermis can hold a large fraction of the circulating blood volume. That is why fluid losses in a burn or an erythrodermic patient are calculated the way they are.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing the three non-keratinocyte residents. Melanocytes make pigment, Langerhans cells present antigen and are the dendritic cells of the epidermis, Merkel cells are touch receptors. Only the melanocyte is a neural-crest migrant, and only the Langerhans cell is a professional antigen-presenting cell.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Assuming the stratum corneum is inert. It adjusts to humidity and to circadian rhythm, and it is the direct drug target of emollients, keratolytics and topical steroids. Everything you apply to skin is applied to it.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Which dermal component must be destroyed to leave a permanent scar, and why?",
        answer: "The reticular dermal collagen framework (and the appendages within it). Without it the wound cannot regenerate an organised dermis, so healing occurs by contraction and fibrosis, producing a scar that tightens over joints.",
        explanation: "Scarring is a dermal event, not an epidermal one — the rule that classifies burns, and that separates epidermolysis bullosa simplex from dystrophic EB.",
      },
      {
        type: "question",
        prompt: "A patient has widespread burns. Why does infection become the leading threat to life after the first day?",
        answer: "The physical barrier has gone, the normal flora is disrupted, the burned tissue is protein-rich and avascular (so systemic antibiotics cannot reach it), and systemic immunosuppression follows major burns. Colonisation converts to invasive infection and sepsis.",
        explanation: "This is why burns are managed with early wound closure, nutritional support and infection surveillance rather than routine prophylactic antibiotics.",
      },
      {
        type: "question",
        prompt: "Why does ultraviolet light both enable vitamin D synthesis and suppress cutaneous immunity?",
        answer: "UVB photolyses 7-dehydrocholesterol to previtamin D3 in the epidermis, and UV also depletes and functionally impairs Langerhans cells and induces regulatory signals in keratinocytes, so the skin mounts a weaker T-cell response to antigen it encounters at the same time.",
        explanation: "The two effects come from the same exposure; this is the mechanism behind phototherapy for psoriasis and of the photosuppression that reactivates herpes simplex.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which cell is the principal antigen-presenting cell of the epidermis?",
        options: ["Melanocyte", "Langerhans cell", "Merkel cell", "Fibroblast"],
        correctIndex: 1,
        explanation: "Langerhans cells are epidermal dendritic cells: CD1a and langerin positive, Birbeck granules on electron microscopy, and they carry antigen to the regional node. Melanocytes make pigment, Merkel cells are touch receptors, and fibroblasts live in the dermis.",
      },
      {
        type: "mcq",
        stem: "In the bricks-and-mortar model of the stratum corneum, what forms the mortar?",
        options: ["Keratin filaments and keratohyalin", "Ceramides, cholesterol and free fatty acids", "Desmosomes and hemidesmosomes", "Type I collagen and elastin"],
        correctIndex: 1,
        explanation: "The corneocyte is the brick; its intercellular lipid (ceramides, cholesterol and free fatty acids secreted from lamellar bodies) is the mortar. Keratin fills the corneocyte, and collagen and elastin are dermal.",
      },
      {
        type: "mcq",
        stem: "A blister forms beneath the lamina densa. Which clinical feature follows?",
        options: [
          "The blister is tense and the lesion heals without a scar",
          "The blister is flaccid and fragile",
          "The blister scars, because the anchoring fibrils and dermal collagen are involved",
          "The lesion is always intraepidermal",
        ],
        correctIndex: 2,
        explanation: "A split below the lamina densa destroys the anchoring fibrils of type VII collagen, so repair involves fibrosis — scarring and milia, as in dystrophic epidermolysis bullosa and epidermolysis bullosa acquisita.",
      },
      {
        type: "mcq",
        stem: "Which statement about skin function is correct?",
        options: [
          "Eccrine glands are supplied by adrenergic sympathetic fibres",
          "UVB converts 7-dehydrocholesterol to previtamin D3 in the epidermis",
          "Melanocytes are more numerous in dark skin than in pale skin",
          "The epidermis has a rich capillary network in the stratum spinosum",
        ],
        correctIndex: 1,
        explanation: "UVB at 290 to 315 nm photolyses 7-dehydrocholesterol in the epidermis. Eccrine glands are unusual in being cholinergic; melanocyte density is constant across skin colours; and the epidermis is avascular, fed from the dermal papillae.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Skin is a two-compartment organ. The epidermis is an avascular, self-renewing keratinising epithelium whose resident cells give barrier, pigment, antigen presentation and touch; the dermis supplies collagen, elastin, vessels, nerves and appendages. The dermo-epidermal junction decides whether a blister heals cleanly or scars, and the same anatomy predicts burn depth, graft take and the behaviour of the autoimmune blistering diseases.",
      },
      {
        type: "paragraph",
        text: "Next: the language you use to describe what you see. Dermatology is the specialty in which the diagnosis is carried by the description — primary lesion, secondary lesion, configuration, distribution — and this lesson gives you the vocabulary in which every subsequent diagnosis is written.",
      },
    ],
  };
}
// ---------------------------------------------------------------------------
// LESSON 2 — Dermatological examination & morphology (fully authored)
// ---------------------------------------------------------------------------
function lesson2() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define a primary and a secondary lesion and give examples of each; describe any single lesion using type, size, colour, shape, border, surface and consistency; describe the arrangement and the distribution of an eruption and explain why distribution carries as much diagnostic weight as morphology; perform a dermatological examination that includes the scalp, nails, mucosae and lymph nodes; elicit and interpret the Nikolsky sign, the Koebner phenomenon, the Auspitz sign and dermographism; and convert a description into a differential diagnosis.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (Skin structure and function). You need to know the layers of the epidermis and dermis, because every descriptive term — macule, papule, vesicle, ulcer — refers to a change at a particular depth.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Morphology",
        text: "The form of the individual lesion: its type, size, colour, shape, border and surface. Morphology is the most reliable diagnostic tool in dermatology, because it is reproducible — a description written in one clinic allows a dermatologist in another city, or in another decade, to picture exactly the same lesion.",
      },
      {
        type: "paragraph",
        text: "Dermatology is the only specialty in which the patient is allowed to tell you the diagnosis with their eyes. A rash that is described precisely cannot be confused with a different rash: an urticarial wheal lasts hours and leaves no mark, a fixed drug eruption recurs at exactly the same site for years, and a dermatomal band of vesicles is not going to be confused with a generalised exanthem. The clinical skill is not recall of pictures — it is the discipline of describing before interpreting, so that the description, not your first impression, constrains the diagnosis.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Palpation is half the diagnosis. A macule and a papule look similar through the camera and are unambiguous to the fingers: a macule is flush with the surrounding skin, a papule you can feel. Run a gloved finger over every lesion before you classify it.",
      },

      { type: "heading", level: 2, text: "Primary lesions: what the disease first produced" },
      {
        type: "table",
        headers: ["Primary lesion", "Definition", "Typical conditions"],
        rows: [
          ["Macule", "A flat, localised change in colour, less than 1 cm, that you cannot feel", "Freckle, flat naevus, vitiligo, petechia, café-au-lait spot"],
          ["Patch", "A flat area of colour change larger than 1 to 2 cm", "Vitiligo, café-au-lait patch, port-wine stain, pityriasis versicolor"],
          ["Papule", "A solid raised lesion less than 0.5 to 1 cm", "Molluscum contagiosum, lichen planus, wart, insect bite, xanthoma"],
          ["Plaque", "A raised, flat-topped, plateau-like lesion larger than about 1 to 2 cm, often of coalesced papules", "Psoriasis, discoid eczema, lichen planus, Bowen disease"],
          ["Nodule", "A solid lesion deeper in the dermis or subcutis, 0.5 to 2 cm, palpable as a spherical mass", "Erythema nodosum, furuncle, basal cell carcinoma, lymphoma"],
          ["Tumour", "A large mass, greater than about 2 cm — a measurement, not a claim about malignancy", "Cutaneous lymphoma, lipoma, squamous cell carcinoma"],
          ["Vesicle", "A fluid-filled blister less than 0.5 to 1 cm", "Herpes simplex and zoster, acute eczema, pompholyx, dermatitis herpetiformis"],
          ["Bulla", "A fluid-filled blister larger than 1 cm", "Bullous pemphigoid, pemphigus vulgaris, fixed drug eruption, friction blister"],
          ["Pustule", "A raised lesion containing visible pus", "Acne, folliculitis, pustular psoriasis, candidiasis, AGEP"],
          ["Wheal", "A transient, compressible, pink swelling from dermal oedema — the lesion of urticaria", "Urticaria, dermographism, angio-oedema (deeper)"],
          ["Cyst", "A cavity lined by epithelium and containing fluid or semi-solid material", "Epidermoid cyst, pilar cyst, hidradenitis suppurativa"],
          ["Burrow", "A tiny thread-like tunnel in the epidermis made by a mite", "Scabies — look in the finger web spaces and on the penis"],
          ["Comedone", "A plugged follicle: open (blackhead) or closed (whitehead)", "Acne vulgaris, occupational oil exposure"],
          ["Telangiectasia", "A visibly dilated superficial vessel that blanches on pressure", "Rosacea, dermatomyositis, systemic sclerosis, chronic steroid use"],
        ],
      },

      { type: "heading", level: 2, text: "Secondary lesions: what happened to the primary lesion" },
      {
        type: "table",
        headers: ["Secondary lesion", "Definition", "Typical conditions"],
        rows: [
          ["Scale", "A visible flake of shedding stratum corneum", "Psoriasis (silvery), seborrhoeic dermatitis (greasy), pityriasis versicolor (fine), tinea (peripheral scale)"],
          ["Crust", "Dried serum, blood or pus on the surface", "Impetigo (golden), excoriated eczema, scabies"],
          ["Excoriation", "A linear scratch mark from scratching", "Atopic eczema, lichen planus, scabies, dermatitis herpetiformis"],
          ["Erosion", "A superficial loss of epidermis that heals without a scar", "Pemphigus vulgaris, ruptured vesicle, candidal intertrigo"],
          ["Ulcer", "A deeper loss extending into the dermis that heals with a scar", "Venous and arterial leg ulcer, pyoderma gangrenosum, ecthyma, deep fungal infection"],
          ["Fissure", "A linear split through the epidermis into the dermis", "Eczema of fingers and heels, angular cheilitis, candidal intertrigo"],
          ["Lichenification", "Thickened skin with exaggerated skin lines, from chronic rubbing", "Lichen simplex chronicus, chronic atopic eczema"],
          ["Atrophy", "Thinning: epidermal (translucent, wrinkled) or dermal (depressed, shiny)", "Aged and sun-damaged skin, chronic steroid use, morphoea, lichen sclerosus"],
          ["Sclerosis", "Induration and hardness of the dermis from collagen deposition", "Morphoea, systemic sclerosis, scleromyxoedema, chronic lymphoedema"],
          ["Scar", "Fibrous replacement of lost dermis", "Any deep wound, epidermolysis bullosa, lichen planus of scalp"],
          ["Post-inflammatory pigment change", "Hyperpigmentation or hypopigmentation left after inflammation resolves", "Acne, eczema, pityriasis alba, fixed drug eruption, pityriasis versicolor"],
        ],
      },

      { type: "heading", level: 2, text: "Configuration and distribution" },
      {
        type: "paragraph",
        text: "Configuration is the shape of a single lesion or of the group; distribution is where the disease chooses to sit. Distribution is often the most powerful clue in the whole examination, because many skin diseases are not random — they follow dermatomes, flexures, extensor surfaces, sun-exposed sites, sebaceous areas or the sites a garment touches."
      },
      {
        type: "table",
        headers: ["Pattern", "Description", "Conditions it points to"],
        rows: [
          ["Annular / discoid", "A ring with a clear or normal centre", "Tinea corporis, granuloma annulare, discoid eczema, urticaria, subacute cutaneous lupus"],
          ["Nummular", "Coin-shaped, well-demarcated plaques", "Nummular eczema, tinea corporis, psoriasis"],
          ["Arcuate / serpiginous", "Curved, crescentic or migrating", "Erythema migrans, urticaria, cutaneous larva migrans"],
          ["Targetoid / iris", "Three concentric zones — a dusky centre, a pale ring, an erythematous rim", "Erythema multiforme"],
          ["Grouped (herpetiform)", "Clusters of vesicles on an erythematous base", "Herpes simplex, herpes zoster, dermatitis herpetiformis"],
          ["Dermatomal", "A band following one sensory nerve root, stopping at the midline", "Herpes zoster"],
          ["Symmetric and flexural", "Antecubital and popliteal fossae, neck, eyelids", "Atopic dermatitis"],
          ["Extensor", "Elbows, knees, lumbosacral", "Plaque psoriasis, dermatitis herpetiformis"],
          ["Seborrhoeic", "Scalp, nasolabial folds, eyebrows, presternal and intertriginous sites", "Seborrhoeic dermatitis, pityriasis capitis"],
          ["Photosensitive", "Malar area, V of neck, dorsa of hands, sparing the upper lip and the shaded chin", "Cutaneous lupus, dermatomyositis, phototoxic drug eruption, porphyria"],
          ["Acral", "Hands, feet, ears, nose", "Erythema multiforme, chilblains, Raynaud phenomenon, secondary syphilis (palms and soles)"],
          ["Koebner (isomorphic)", "New lesions along a line of trauma — a scratch, a scar, a surgical wound", "Psoriasis, lichen planus, vitiligo"],
          ["Linear / Blaschkoid", "Lines following embryonic cell-migration pathways", "Incontinentia pigmenti, epidermal naevus, lichen striatus"],
          ["Intertriginous", "Opposed skin surfaces — axillae, groin, inframammary, web spaces", "Candidiasis, tinea cruris, erythrasma, hidradenitis suppurativa, inverse psoriasis"],
        ],
      },

      { type: "heading", level: 2, text: "The signs you elicit, not just see" },
      {
        type: "table",
        headers: ["Sign", "How to elicit it", "What a positive means"],
        rows: [
          ["Nikolsky sign", "Push the skin sideways with a firm thumb, or press on a bulla", "The epidermis separates: pemphigus, staphylococcal scalded skin syndrome, toxic epidermal necrolysis. Negative in bullous pemphigoid and erythema multiforme"],
          ["Koebner phenomenon", "Look for lesions along scratch marks, old scars or surgical wounds", "Psoriasis, lichen planus, vitiligo — diseases that reproduce themselves in injured skin"],
          ["Auspitz sign", "Gently scrape the scale off a psoriatic plaque until it bleeds", "Pinpoint bleeding points from the thinned suprapapillary epidermis and its dilated capillaries — psoriasis"],
          ["Dermographism", "Stroke the forearm firmly with a blunt point", "A wealing red line within minutes — symptomatic dermographism, a physical urticaria"],
          ["Diascopy", "Press a glass slide against the lesion and watch it blanch", "Erythema blanches and refills; purpura does not. A translucent apple-jelly nodule is lupus vulgaris"],
          ["Wood lamp (365 nm)", "Examine in a darkened room", "Vitiligo appears chalk-white and sharply demarcated; Microsporum fluoresces green; erythrasma coral-pink; pityriasis versicolor may fluoresce coppery"],
        ],
      },
      {
        type: "question",
        prompt: "A 70-year-old man has widespread tense bullae on the thighs and abdomen, and an urticarial rash that preceded them by weeks. The Nikolsky sign is negative. Explain what those two findings tell you.",
        answer: "Tense bullae on an urticarial base with a negative Nikolsky sign are the classic picture of bullous pemphigoid: the split is subepidermal, so the roof is the full-thickness, robust epidermis and lateral pressure does not detach it. The negative Nikolsky sign separates it from pemphigus and from toxic epidermal necrolysis, where the roof is thin and slides away.",
        explanation: "The Nikolsky sign is a bedside test of the level of the split — intraepidermal splits shear, subepidermal splits hold.",
      },

      { type: "heading", level: 2, text: "Examination method" },
      {
        type: "paragraph",
        text: "Inspect in good natural light, with the patient undressed to underwear, and look at the whole skin surface including the scalp, hairline, nails, palms, soles and the mucosae of the mouth and anogenital region. Palpate for texture, induration and temperature, and use diascopy for any red-purple lesion. Finish with a general examination — lymphadenopathy, hepatosplenomegaly, joint swelling and signs of systemic disease — because a rash may be the presenting sign of malignancy, thyroid disease, diabetes or HIV. Record the eruption in one fixed order: type of lesion, size, colour, shape, border, surface, arrangement, distribution, and whether mucosal surfaces are involved.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Calling everything a rash. A rash is not a diagnosis and it is not a morphology. Name the lesion: papules, vesicles, plaques, pustules, wheals, erosions. If you cannot name what you see, the diagnosis will not follow.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing erythema with purpura. Erythema blanches on pressure and refills; purpura is extravasated blood and does not. A blanching maculopapular rash and a non-blanching purpuric rash are different orders of urgency — the second raises meningococcaemia, vasculitis and disseminated intravascular coagulation.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Missing the nails, the scalp and the mouth. Psoriatic nail pitting, the scarring alopecia of lichen planus, the oral white reticulate pattern of lichen planus and the oral erosions of pemphigus vulgaris are all diagnostic and all routinely overlooked because the examination stopped at the forearm.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Applying the body-site word to the pathology. Tinea cruris describes the site (groin) and not the organism; the same dermatophyte can sit on the trunk, the groin and the feet. Reverse the mistake too: candidal intertrigo is not a tinea, and treating it with terbinafine alone will fail.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Distinguish macule, papule, patch and plaque, and say how you tell them apart at the bedside.",
        answer: "A macule is a flat colour change under 1 cm; a patch is the same over 1 cm; a papule is a raised solid lesion under about 0.5 to 1 cm; a plaque is a raised flat-topped lesion over that size, often of coalesced papules. You tell flat from raised by running a gloved finger over the lesion and, if uncertain, by tangential light.",
        explanation: "Palpation and oblique lighting are the two manoeuvres that separate flat from raised reliably — they are what the camera cannot do.",
      },
      {
        type: "question",
        prompt: "A patient has itchy papules in the finger web spaces, on the wrists and around the umbilicus, and her partner is also itching. Which additional distribution would support one specific diagnosis?",
        answer: "Papules on the male genitalia and on the areolae, and linear burrows between the fingers, point to scabies; the head is spared in adults, but the palms, soles and scalp are involved in infants and in crusted scabies. Itching that worsens at night and affects household contacts is characteristic.",
        explanation: "Scabies is diagnosed by distribution plus contact history and confirmed by microscopy of a burrow scraping for mite, eggs or scybala.",
      },
      {
        type: "question",
        prompt: "Why does a dermatomal distribution settle a diagnosis within seconds, and which two conditions can produce one?",
        answer: "Because nothing else follows a single sensory nerve root and stops at the midline. Herpes zoster is by far the commonest; the differential is a segmental eruption of a unilateral dermatomal disease such as segmental vitiligo or a Blaschkoid dermatosis, which do not respect a nerve root in the same way.",
        explanation: "The dermatomal band is a hard anatomical constraint: a diagnosis that respects it almost has to be a neurotrophic virus.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which of these is a secondary lesion rather than a primary one?",
        options: ["Vesicle", "Wheal", "Erosion", "Papule"],
        correctIndex: 2,
        explanation: "An erosion is a loss of epidermis that has already occurred — the residue of a ruptured vesicle, pustule or bulla. Vesicles, wheals and papules are primary lesions: what the disease created first.",
      },
      {
        type: "mcq",
        stem: "A patient has intensely itchy vesicles on the extensor surfaces of the elbows, knees and buttocks. Which descriptions best fit?",
        options: [
          "Flexural, grouped vesicles with lichenification",
          "Extensor, herpetiform vesicles, excoriated",
          "Photosensitive, annular plaques with silvery scale",
          "Acral, dermatomal, grouped vesicles with crusting",
        ],
        correctIndex: 1,
        explanation: "The extensor distribution with herpetiform (grouped) vesicles on an erythematous base describes dermatitis herpetiformis, which is gluten dependent and associated with granular IgA at the dermal papillae. Silvery scale on extensor plaques is psoriasis; dermatomal lesions are zoster.",
      },
      {
        type: "mcq",
        stem: "Lateral pressure with a thumb separates the epidermis and extends the blister. Which conditions can give this sign?",
        options: [
          "Bullous pemphigoid and dermatitis herpetiformis",
          "Pemphigus vulgaris, staphylococcal scalded skin syndrome and toxic epidermal necrolysis",
          "Erythema multiforme and fixed drug eruption",
          "Bullous impetigo and friction blister",
        ],
        correctIndex: 1,
        explanation: "A positive Nikolsky sign means the split is intraepidermal or above the basement membrane, so the epidermis shears off. Pemphigus vulgaris, SSSS and TEN all split within or just above the epidermis; bullous pemphigoid and dermatitis herpetiformis split below it.",
      },
      {
        type: "mcq",
        stem: "A lesion does not blanch on pressure with a glass slide. What does that indicate?",
        options: [
          "It is an erythema caused by active vasodilation",
          "It is purpura — extravasated red cells in the dermis",
          "It is an urticarial wheal",
          "It is a telangiectasia",
        ],
        correctIndex: 1,
        explanation: "Diascopy fails to blanch purpura because the blood is outside the vessels. Erythema, wheals and telangiectasia are vascular and blanch, refilling when pressure is released.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Morphology is the identification system of dermatology. Primary lesions name what the disease produced (macule, patch, papule, plaque, nodule, vesicle, bulla, pustule, wheal, burrow, cyst); secondary lesions name what has happened to it (scale, crust, erosion, ulcer, lichenification, atrophy, sclerosis, scar, pigment change). Configuration and distribution then narrow the differential, and elicited signs — Nikolsky, Koebner, Auspitz, dermographism, diascopy — test the level of the process rather than its colour. Describe before you diagnose, and the diagnosis follows from the description.",
      },
      {
        type: "paragraph",
        text: "Next: the infective dermatoses. With the language of morphology in hand, you can now separate impetigo from erysipelas, a dermatophyte from a yeast, and scabies from eczema — the four commands that account for most of the skin presenting to any clinic.",
      },
    ],
  };
}
// ---------------------------------------------------------------------------
// LESSON 3 — Bacterial & fungal skin infections (fully authored)
// ---------------------------------------------------------------------------
function lesson3() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define impetigo (non-bullous and bullous), folliculitis, furuncle, carbuncle, erysipelas and cellulitis and state the depth and organism of each; explain the mechanism of staphylococcal exfoliative toxin and its relationship to pemphigus foliaceus; describe how a potassium hydroxide scraping is taken and what it shows in dermatophytosis, candidiasis and Malassezia infection; name the common dermatophyte genera and the tinea they cause at each body site; list the treatments of the common bacterial and fungal skin infections and their durations; and recognise tinea incognito, kerion and erythrasma when you see them.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 2 (examination and morphology) for the language of lesions, and PATH 201 plus MICRO — you need to know what a Gram-positive coccus in clusters is, and how a hypha looks under the microscope.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Depth decides the sign",
        text: "In skin infection the clinical picture is determined by how deep into the skin the organism is living. Folliculitis sits in a follicle, erysipelas in the upper dermis and lymphatics and is sharply marked out, cellulitis spreads through the deeper dermis and subcutis and has an indefinite border — the same staphylococci and streptococci produce completely different pictures at different depths.",
      },
      {
        type: "paragraph",
        text: "The corollary is that the fungus which lives only in dead keratin cannot invade living tissue: dermatophytes digest the stratum corneum, hair and nail keratin but do not cross into the dermis, which is why tinea presents with scale at an advancing edge, why the centre clears, and why an immunocompetent patient does not need systemic antifungal treatment for anything more than hair and nail. In a patient with defective cell-mediated immunity the same organisms invade the dermis and disseminate — so the diagnosis of an unusually severe or spreading dermatophyte infection is a reason to test for immunosuppression, including HIV.",
      },

      { type: "heading", level: 2, text: "Superficial bacterial infection" },
      {
        type: "table",
        headers: ["Condition", "Organism and depth", "Clinical picture", "Treatment"],
        rows: [
          ["Non-bullous impetigo", "Staphylococcus aureus or group A streptococcus, on the epidermis", "Vesicles that rupture to leave honey-coloured golden crusts on the face, especially around the nose and mouth, and on the limbs of children", "Topical mupirocin or fusidic acid for limited disease; oral flucloxacillin if widespread; hand hygiene to stop spread"],
          ["Bullous impetigo", "Staphylococcus aureus phage group II releasing exfoliative toxins A and B", "Flaccid bullae that rupture to leave a collarette of scale or a thin varnish-like crust; any site, mostly infants", "As above; larger lesions need oral antistaphylococcal therapy"],
          ["Ecthyma", "Streptococcus and staphylococcus ulcerating through the epidermis into the dermis", "A punched-out ulcer with a raised rim and a hard crust, usually on the legs of debilitated or immunosuppressed patients; heals with a scar", "Oral flucloxacillin and treat the underlying debility"],
          ["Folliculitis", "Staphylococcus aureus in the hair follicle ostium", "A pustule with a hair through its centre — superficial, painful, common in the beard, thighs and buttocks", "Topical antiseptic or antibiotic; remove the cause (occlusion, oils, plucking, hot-tub exposure)"],
          ["Furuncle (boil)", "Staphylococcus aureus deeper in a follicle", "A tender red firm nodule pointing centrally and discharging pus and a necrotic core", "Warm compresses and drainage; oral flucloxacillin if febrile, extensive or near the nose"],
          ["Carbuncle", "Confluent infection of adjacent follicles", "A lump with multiple discharging sinuses, fever and malaise, typically at the nape of the neck in diabetics", "Drainage plus systemic flucloxacillin; look for diabetes and immunosuppression"],
          ["Erysipelas", "Group A streptococcus in the upper dermis and lymphatics", "A hot, painful, well-demarcated raised erythematous plaque with a sharp advancing border, usually on the face or leg, with fever and rigors", "Penicillin or flucloxacillin; benzylpenicillin intravenously if severe"],
          ["Cellulitis", "Streptococci, staphylococci or Haemophilus in the deeper dermis and subcutis", "A spreading, warm, tender erythema with an indefinite border, sometimes bullae, regional lymphadenopathy and fever", "Oral flucloxacillin plus benzylpenicillin if severe; intravenous if systemically unwell"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Orbital cellulitis is an emergency, not a skin infection. Fever, pain on eye movement, proptosis, ophthalmoplegia or visual loss mean infection has passed the orbital septum and threatens the cavernous sinus — urgent computed tomography, intravenous antibiotics and ear, nose and throat or ophthalmic referral. Periorbital (preseptal) cellulitis in a child is milder and spares eye movements.",
      },

      { type: "heading", level: 2, text: "Staphylococcal toxin disease" },
      {
        type: "paragraph",
        text: "Two syndromes are caused by exfoliative and superantigen toxins rather than by invasion. Staphylococcal scalded skin syndrome (SSSS) is the toxin-related disease of young children: exfoliative toxin A or B acts as a glutamate-specific serine protease and cleaves desmoglein 1, the desmosomal cadherin of the superficial epidermis, producing a split in the granular layer. The child is feverish and irritable, with periorificial erythema and crusting followed by flaccid, rapidly extending bullae and a positive Nikolsky sign — but the mucosae are spared, which is the clinical distinction from toxic epidermal necrolysis. Treatment is with intravenous antistaphylococcal penicillin (flucloxacillin) and the skin heals without scarring because the split is superficial. Toxic shock syndrome is a superantigen illness (TSST-1 or streptococcal pyrogenic exotoxin) with fever, a generalised macular rash, hypotension, multiorgan involvement and late desquamation of the palms and soles; the source — a retained tampon, a wound, a post-partum uterus — must be removed and the patient needs intensive care, beta-lactam with clindamycin to stop toxin production, and intravenous immunoglobulin in refractory cases.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Pemphigus foliaceus is the autoimmune mirror image of SSSS: antibodies against desmoglein 1 produce the same superficial epidermal split, but slowly, with chronic scaly crusted plaques and no fever. The identical mechanism is a standard teaching pairing — an infection showing you the physiology its autoantibody counterpart attacks.",
      },

      { type: "heading", level: 2, text: "Dermatophytosis" },
      {
        type: "paragraph",
        text: "Dermatophytes are fungi that digest keratin and therefore live only in the stratum corneum, hair and nail. Three genera matter: Trichophyton (skin, hair and nail — the common cause of tinea corporis, cruris, pedis and onychomycosis), Microsporum (hair and skin, especially tinea capitis in children) and Epidermophyton (skin and nail only). The clinical picture is an annular, scaly plaque with an active, slightly raised, papulovesicular edge and a clearing centre, because the fungus grows outwards from the point of inoculation and the host reaction wanes centrally. Infections are named for the site: capitis (scalp), corporis (trunk and limbs), cruris (groin), pedis (feet), manuum (hands), unguium (nails), faciei (face) and barbae (beard).",
      },
      {
        type: "table",
        headers: ["Tinea", "Presentation", "Notes on diagnosis and treatment"],
        rows: [
          ["Tinea corporis", "One or more annular scaly plaques with a raised active edge on the trunk or limbs", "KOH scraping shows branching septate hyphae; topical terbinafine or an imidazole for 2 to 4 weeks"],
          ["Tinea cruris", "A sharply demarcated, scaly, erythematous plaque in the groin extending to the inner thigh, with the scrotum spared", "Distinguish from candidal intertrigo by the absence of satellite pustules; topical terbinafine for 2 to 4 weeks, oral if extensive"],
          ["Tinea pedis", "Scaling and maceration between the fourth and fifth toes, often unilateral, or a vesicular or moccasin-type pattern on the sole", "Treat for up to 4 weeks topically; keep feet dry, alternate footwear, treat coexisting onychomycosis or it will recur"],
          ["Tinea capitis", "Scaly patches with broken-off hairs (black dot) in the endothrix infections, or a boggy, painful, purulent swelling (kerion), or a grey patch with ectothrix spores", "Diagnose by microscopy of plucked hairs and fungal culture; oral therapy essential — terbinafine 250 mg daily for 4 weeks or griseofulvin for 6 to 8 weeks, because topical agents cannot reach the hair shaft"],
          ["Tinea unguium (onychomycosis)", "Distal lateral subungual yellow-white crumbling debris, onycholysis, thickened nails", "Confirm by microscopy of clippings before treating; oral terbinafine for 6 to 12 weeks (fingernails) or 3 to 6 months (toenails)"],
          ["Tinea incognito", "An ill-defined, less scaly, pustular or eczematous eruption with little or no active edge, following topical or inhaled steroid use", "A topical steroid applied to a dermatophyte suppresses the inflammation that produces the ring: stop the steroid and give an oral antifungal"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The potassium hydroxide test: scrape scale from the active edge onto a slide, add 10 to 20 per cent KOH to dissolve the keratin, wait 10 to 20 minutes, and examine under reduced light. Dermatophytes show long, branching, septate hyphae; tinea versicolor shows the spaghetti-and-meatballs pattern of hyphae with round yeast; candidiasis shows pseudohyphae with budding yeast cells. Take the scraping from the edge, never from the centre, where the fungus has cleared.",
      },

      { type: "heading", level: 2, text: "Yeast and Malassezia" },
      {
        type: "table",
        headers: ["Condition", "Organism and site", "Clinical picture and treatment"],
        rows: [
          ["Candidal intertrigo", "Candida albicans in moist apposed skin — axilla, groin, inframammary, between toes", "A beefy-red moist rash with satellite pustules and an advancing scaly edge; predisposed by obesity, diabetes, incontinence, antibiotics, pregnancy and immunosuppression; topical azole or nystatin, plus drying measures"],
          ["Oral candidiasis", "Candida albicans on the oropharynx", "White, curd-like plaques that wipe off to leave an erythematous base (pseudomembranous), or a smooth red atrophic mucosa; treat with nystatin suspension or miconazole gel, oral fluconazole if severe or in immunosuppression"],
          ["Tinea (pityriasis) versicolor", "Malassezia species — lipophilic yeast, part of normal skin flora", "Fine, scaly, oval macules, hypopigmented on darker skin or fawn on pale skin, coalescing on the upper trunk and shoulders; topical selenium sulfide or ketoconazole shampoo, oral itraconazole for extensive disease; relapses are common"],
          ["Malassezia folliculitis", "Malassezia inside the follicle", "Monomorphic itchy papules and pustules on the back and shoulders of young patients; oral itraconazole because topical treatment cannot reach the follicle"],
          ["Erythrasma", "Corynebacterium minutissimum in the interdigital web spaces and flexures", "Brown-red patches with fine scale and coral-pink fluorescence under the Wood lamp; topical or oral erythromycin or clindamycin"],
          ["Pitted keratolysis", "Corynebacterium or Kytococcus on weight-bearing sole skin", "Malodorous, punched-out craters on the sole; topical erythromycin, clindamycin or benzoyl peroxide"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Applying a topical corticosteroid alone to an itchy rash on the groin, hands or face. That is how tinea incognito is produced, and how an intertrigo that would have settled in two weeks becomes a widespread eruption. If in doubt, scrape and look for hyphae, or use a combined antifungal with a short steroid course under supervision.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating tinea capitis or onychomycosis with a topical antifungal. The fungus lives inside the hair shaft or the nail plate, and no topical agent reaches it — oral therapy is mandatory, and untreated capitis causes scarring alopecia and spreads to classmates.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Diagnosing a nummular or annular eruption as tinea without microscopy. Discoid eczema, nummular eczema, psoriasis, granuloma annulare, subacute cutaneous lupus and tinea all make coin-shaped lesions; the KOH preparation separates them in five minutes.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting to look for a source in recurrent cellulitis: interdigital tinea pedis, an ulcer, an oedematous limb, lymphoedema, diabetes or intravenous drug use. Recurrent cellulitis also deserves a weight-reduction, oedema-control and prophylaxis discussion (penicillin V or erythromycin twice daily for 6 to 12 months) rather than repeated courses of rescue antibiotics.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A 4-year-old has a fever and periorificial erythema, then flaccid bullae spread across the trunk. The Nikolsky sign is positive but the mouth is normal. What is the diagnosis and the treatment?",
        answer: "Staphylococcal scalded skin syndrome — exfoliative toxin A or B cleaving desmoglein 1 in the superficial epidermis. Treat with intravenous flucloxacillin (or an anti-staphylococcal alternative if MRSA is a risk), careful fluid management and analgesia; recovery is without scarring because the split is above the basal layer.",
        explanation: "The spare mucosa separates SSSS from toxic epidermal necrolysis, where mucosal erosions are present in most patients and the split is at the basement membrane.",
      },
      {
        type: "question",
        prompt: "How do you tell candidal intertrigo from tinea cruris at the bedside?",
        answer: "Candidal intertrigo is a beefy-red, moist, macerated rash with satellite pustules and a scaling advancing edge, and it also involves the scrotum and the folds under the breast; tinea cruris has a dry, annular, scaly plaque with a raised edge and a clearing centre and typically spares the scrotum. Both are aggravated by moisture and are best confirmed by microscopy.",
        explanation: "The organism matters because it changes the drug: both respond to azoles topically, but candidiasis often needs nystatin plus drying, and candida is a marker of diabetes or immunosuppression.",
      },
      {
        type: "question",
        prompt: "A patient returns with a widespread, slightly pustular, less scaly face rash three weeks after using a potent steroid cream for suspected eczema. What has happened and how do you treat it?",
        answer: "Tinea incognito — the steroid suppressed the inflammatory response that produces the ring and the scale, while the dermatophyte spread. Stop the steroid, confirm with a KOH scraping (or treat empirically if extensive) and give an oral antifungal such as terbinafine; the eruption will flare temporarily as the steroid is withdrawn.",
        explanation: "The flare after withdrawal is expected — warn the patient, or they will use the steroid again and the cycle repeats.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A child has flaccid bullae with a positive Nikolsky sign and no mucosal involvement. Which mechanism explains the split?",
        options: [
          "A gain of PTEN leading to Akt activation",
          "Proteolytic cleavage of desmoglein 1 by staphylococcal exfoliative toxin",
          "IgG against the intracellular domain of desmoglein 5",
          "Subepidermal separation at the level of the anchoring fibril",
        ],
        correctIndex: 1,
        explanation: "SSSS is caused by exfoliative toxins A and B, which are glutamate-specific serine proteases that cleave desmoglein 1 in the superficial epidermis, giving a granular-layer split with spared mucosae. Desmoglein 5 links to paraneoplastic pemphigus, and anchoring-fibril splits give scarring lesions.",
      },
      {
        type: "mcq",
        stem: "Which fungal finding on a potassium hydroxide preparation is most characteristic of tinea versicolor?",
        options: [
          "Long branching septate hyphae only",
          "Pseudohyphae with budding yeast cells",
          "Short hyphae with clusters of round yeast — the spaghetti-and-meatballs pattern",
          "Broad, aseptate hyphae with right-angle branching",
        ],
        correctIndex: 2,
        explanation: "Malassezia shows short hyphae with round yeast in the spaghetti-and-meatballs pattern. Dermatophytes give long branched septate hyphae, Candida gives pseudohyphae with budding yeast, and broad aseptate right-angling hyphae are the zygomycetes.",
      },
      {
        type: "mcq",
        stem: "A 7-year-old has a boggy, painful, purulent swelling on the scalp with broken-off hairs. What is the correct management?",
        options: [
          "Topical antifungal cream for 2 weeks",
          "A short course of topical corticosteroid and reassurance",
          "Oral griseofulvin for 6 to 8 weeks (or oral terbinafine), with an antiseptic shampoo",
          "Oral flucloxacillin alone",
        ],
        correctIndex: 2,
        explanation: "Kerion is a severe inflammatory response to a dermatophyte (often Microsporum) in the scalp; oral therapy is required because no topical drug reaches the infected hair shaft, and griseofulvin is effective against Microsporum where terbinafine is preferred for Trichophyton.",
      },
      {
        type: "mcq",
        stem: "Which statement about cellulitis and erysipelas is correct?",
        options: [
          "Erysipelas has an indefinite border and involves the deep dermis",
          "Cellulitis has a sharply demarcated, raised border and involves the upper dermis",
          "Erysipelas is a sharply demarcated, raised plaque from streptococcal infection of the upper dermis and lymphatics; cellulitis has an indefinite advancing border",
          "Both are treated with topical agents alone in most patients",
        ],
        correctIndex: 2,
        explanation: "Depth explains the sign: erysipelas occupies the upper dermis and lymphatics, so it is lifted into a sharply outlined plaque; cellulitis spreads through deeper dermis and subcutaneous tissue with an indefinite margin. Both need systemic antibiotics, not topical treatment.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Bacterial skin infection is classified by depth: impetigo, folliculitis, furuncle and ecthyma are superficial; erysipelas and cellulitis are deep, and the border tells you which. Staphylococcal toxins give two distinct syndromes, scalded skin syndrome in children and toxic shock syndrome, and both need urgent treatment of the source and the toxaemia. Dermatophytes live in keratin only, so the tinea diagnosis requires microscopy of a scraping from the active edge, tinea capitis and nail infection need oral therapy, and steroid use on a dermatophyte produces the pitfall of tinea incognito.",
      },
      {
        type: "paragraph",
        text: "Next: the viruses and the arthropods. Molluscum, warts, herpes simplex and zoster and the childhood exanthems, then scabies and pediculosis — the group in which the diagnosis is most often missed because the morphology is familiar but the contact history is not asked.",
      },
    ],
  };
}
// ---------------------------------------------------------------------------
// LESSON 4 — Viral infections & infestations (fully authored)
// ---------------------------------------------------------------------------
function lesson4() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: recognise molluscum contagiosum, verrucae, herpes simplex, varicella and herpes zoster, and the common childhood exanthems by their morphology and distribution; state the antiviral and topical treatments and their durations; identify ophthalmic and Ramsay Hunt zoster and say why they need urgent referral; recognise eczema herpeticum and describe its immediate management; diagnose scabies clinically, treat the patient and the household, and explain why the itch persists after cure; and recognise pediculosis, myiasis and tungiasis.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 2 (examination and morphology) for the vesicular differential, Lesson 3 (bacterial and fungal infections) for secondary infection, and the DNA virology taught in MICRO.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Viral dermatoses are recognised by pattern, not by organism",
        text: "The viruses of skin produce a small number of repeatable pictures: umbilicated papules (molluscum), hyperkeratotic papules (warts), grouped vesicles on an erythematous base (herpes), a generalised febrile exanthem (the childhood viruses) and a dermatomal vesicular eruption (zoster). Recognising the pattern identifies the virus.",
      },
      {
        type: "paragraph",
        text: "Two clinical rules run through this lesson. First, immune status changes the picture: an adult with widespread facial molluscum, a young adult with multidermatomal zoster, or a patient with giant recalcitrant warts should be offered an HIV test. Second, the viruses that are trivial in the immunocompetent become emergencies in the immunosuppressed — varicella and zoster disseminate, herpes simplex presents as a chronic ulcer, and molluscum becomes widespread and disfiguring. Ask about immune status before deciding how seriously to take a viral rash.",
      },

      { type: "heading", level: 2, text: "Molluscum contagiosum and warts" },
      {
        type: "table",
        headers: ["Infection", "Organism and appearance", "Treatment"],
        rows: [
          ["Molluscum contagiosum", "A DNA poxvirus. Flesh-coloured, dome-shaped, 2 to 5 mm papules with central umbilication, grouped on the face, trunk and flexures of children, on the groin and lower abdomen of adults. Autoinoculation produces crops along scratch lines", "Observation for 6 to 12 months in children; curettage, cryotherapy, topical potassium hydroxide or cantharidin. Extensive, giant or facial molluscum in an adult is a marker of immunosuppression and warrants HIV testing"],
          ["Verruca vulgaris (common wart)", "HPV 1, 2, 4 and 7. A firm hyperkeratotic papule with a rough filiform or cauliflower surface, on the hands, fingers and knees of children", "Salicylic acid paint or plaster for 6 to 12 weeks, cryotherapy, curettage or laser; most resolve within two years without treatment"],
          ["Verruca plana (flat wart)", "HPV 3 and 10. Multiple flat-topped skin-coloured or pink papules on the face, hands, forearms and knees", "Topical salicylic acid, retinoid or imiquimod; resolves spontaneously over months to years"],
          ["Verruca plantaris (plantar wart)", "HPV 1. A tender plaque on the weight-bearing surface of the foot, with thrombosed capillaries showing as black dots, interrupting the dermatoglyphics", "Paring plus salicylic acid, cryotherapy or curettage; overtreatment is as harmful as undertreatment because of pain"],
          ["Filiform and digitate warts", "Thread-like or finger-like projections on the face, lips and neck", "Curettage or cryotherapy"],
          ["Anogenital warts (condylomata acuminata)", "HPV 6 and 11, sexually transmitted. Soft flesh-coloured or pink papillomatous lesions on the penis, vulva, perineum, perianal skin, anal canal and cervix", "Podophyllin or podophyllotoxin, imiquimod, cryotherapy, surgical excision or laser. Screen for other sexually transmitted infections, examine the partner and arrange cervical screening. Genital warts in a young child raise the possibility of sexual abuse"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "HPV types 16 and 18 do not make visible warts — they are the high-risk types that cause cervical, anal, vulval and oropharyngeal carcinoma. Any management plan for anogenital warts that omits screening for other sexually transmitted infections and appropriate cervical cytology is incomplete.",
      },

      { type: "heading", level: 2, text: "Herpes simplex and varicella-zoster" },
      {
        type: "table",
        headers: ["Infection", "Organism and course", "Clinical picture and treatment"],
        rows: [
          ["Primary herpes simplex", "Herpes simplex virus type 1 (or type 2), direct contact or droplets", "Gingivostomatitis in a young child: painful vesicles and shallow ulcers on the tongue, palate and gums, with fever, cervical lymphadenopathy and refusal to eat. Oral aciclovir suspension, fluids, and monitoring for dehydration"],
          ["Recurrent herpes simplex", "Reactivation from the trigeminal ganglion, triggered by fever, sunlight, stress, menstruation or immunosuppression", "A prodrome of tingling, then grouped vesicles on an erythematous base at the vermilion border, crusting and healing in 7 to 10 days without scarring. Aciclovir 400 mg three times daily for 5 days started in the prodrome, or valaciclovir 500 mg twice daily"],
          ["Eczema herpeticum", "Disseminated herpes simplex in atopic or other barrier disease", "An emergency: clustered monomorphic punched-out erosions spreading rapidly over eczematous skin, with fever and malaise. Admit for intravenous aciclovir, treat bacterial superinfection, and keep this diagnosis in mind in any sudden deterioration of eczema"],
          ["Chickenpox (varicella)", "Varicella-zoster virus, airborne, highly infectious from 2 days before the rash until every lesion is crusted", "A centripetal itchy vesicular rash in successive crops so that lesions of all stages coexist, preceded by fever and malaise; adults risk pneumonitis, encephalitis and cerebellitis. Aciclovir within 24 hours in adults, pregnancy and immunosuppression; varicella-zoster immunoglobulin for susceptible pregnant contacts; secondary bacterial infection from scratching is the commonest childhood complication"],
          ["Herpes zoster (shingles)", "Reactivation of latent virus in a dorsal root ganglion, as cell-mediated immunity wanes", "Pain and paraesthesia in one or two dermatomes, then crops of vesicles on an erythematous base that crust over 7 to 10 days. Aciclovir 800 mg five times daily, valaciclovir 1 g three times daily or famciclovir, for 7 days, started within 72 hours (or later while new vesicles form). Post-herpetic neuralgia: amitriptyline, gabapentin, pregabalin, topical lidocaine"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Two zoster variants need specialist referral the same day. Ophthalmic zoster — vesicles on the tip or side of the nose or on the forehead, indicating nasociliary involvement (Hutchinson sign) — threatens the cornea and needs an urgent ophthalmology opinion plus antivirals. Ramsay Hunt syndrome — facial palsy with vesicles on the pinna or in the palate — is geniculate ganglion disease; treat with antivirals and corticosteroids and protect the eye.",
      },

      { type: "heading", level: 2, text: "The childhood exanthems" },
      {
        type: "table",
        headers: ["Disease", "Organism", "Rash and accompanying features"],
        rows: [
          ["Measles", "Measles virus", "Cough, coryza, conjunctivitis and fever, then Koplik spots opposite the molars, then a maculopapular eruption beginning at the hairline and spreading down over 3 to 4 days. Vitamin A reduces mortality; otitis media, pneumonia and encephalitis are real risks"],
          ["Rubella", "Rubella virus", "A pink maculopapular eruption spreading rapidly from the face with post-auricular and suboccipital lymphadenopathy and a mild prodrome. The importance is teratogenicity in pregnancy — cataract, deafness, cardiac defect, microcephaly"],
          ["Roseola infantum", "Human herpesvirus 6", "Three days of high fever in a well infant with no rash, then a pink maculopapular eruption as the fever settles, starting on the trunk. Febrile convulsions are the complication"],
          ["Erythema infectiosum (fifth disease, slapped cheek)", "Parvovirus B19", "Slapped cheeks then a lacy reticular eruption on the limbs and trunk; arthralgia in adults, aplastic crisis in sickle-cell disease, fetal hydrops in pregnancy"],
          ["Hand, foot and mouth disease", "Coxsackie A16 and enterovirus 71", "Painful oral vesicles and ulcers with grey-walled vesicles and macules on the palms, soles and buttocks; enterovirus 71 causes severe neurological disease in outbreaks"],
          ["Scarlet fever", "Group A streptococcus with erythrogenic toxin", "A sandpaper punctate erythema starting on the trunk, with circumoral pallor, strawberry tongue, Pastia lines in the flexures and later desquamation; treat with penicillin"],
        ],
      },

      { type: "heading", level: 2, text: "Infestations" },
      {
        type: "definition",
        term: "Scabies",
        text: "Infestation by the mite Sarcoptes scabiei var. hominis, which burrows in the stratum corneum. It is transmitted by close physical contact, survives only about 24 to 36 hours off the host, and causes a delayed hypersensitivity reaction that explains both the itch and the persistent nodules.",
      },
      {
        type: "table",
        headers: ["Feature", "Detail"],
        rows: [
          ["Incubation and symptoms", "Itch begins 3 to 6 weeks after a first infestation (1 to 3 days on reinfestation), is severe and worse at night, and characteristically affects several members of the household"],
          ["Distribution", "Finger web spaces, flexor wrists, lateral borders of the feet, the waist, periumbilical skin, penis and scrotum, and the areolae in women; the head and neck are spared in adults but involved in infants"],
          ["Signs", "Papules, small vesicles, excoriations, eczema and secondary impetigo; burrows are short, greyish, serpiginous lines ending in a tiny vesicle"],
          ["Diagnosis", "Microscopy of material extracted from an intact burrow in a web space under low power with mineral oil, showing the mite, ova or scybala"],
          ["Treatment", "Permethrin 5 per cent cream over the whole body from the neck down — including web spaces, genitals and under the nails — left overnight and repeated after 7 days; ivermectin 200 micrograms per kg in two doses 7 days apart for extensive or refractory disease; treat all household and sexual contacts on the same day; launder or bag clothing and bedding for 72 hours"],
          ["Crusted (Norwegian) scabies", "Hyperinfested disease in the immunosuppressed, debilitated or neurologically impaired: thick hyperkeratotic crusts containing millions of mites, often with little itch and misleadingly normal nails. Barrier nursing and repeated ivermectin plus a topical scabicide; a classic source of institutional outbreaks"],
          ["Post-scabetic itch", "Itch and nodules persist for 2 to 4 weeks after cure — hypersensitivity, not failure. Emollient plus a moderate topical steroid; do not keep reapplying scabicide"],
        ],
      },
      {
        type: "table",
        headers: ["Infestation", "Organism and picture", "Management"],
        rows: [
          ["Pediculosis capitis (head lice)", "Pediculus humanus capitis, blood-sucking, nits cemented to the hair shaft near the scalp", "Permethrin 1 per cent or malathion 0.5 per cent applied to dry hair for 12 hours and repeated at day 7 to 9; wet-comb detection and removal; treat only those with live lice"],
          ["Pediculosis corporis (body lice)", "Pediculus humanus corporis living in clothing seams", "A marker of deprivation, homelessness and refugee populations; treat by laundering or discarding clothing and washing the body"],
          ["Pediculosis pubis (pubic lice)", "Pthirus pubis — short, broad lice on pubic and axillary hair", "Sexually transmitted in adults; permethrin or malathion to the whole body, screen for other sexually transmitted infections, treat partners. Pubic lice on the eyelashes of a child is a sign to consider sexual abuse"],
          ["Myiasis", "Larvae of Cordylobia anthropophaga (tumbu fly) or Dermatobia hominis (botfly)", "A boil-like painful lesion with a central punctum through which the larva breathes; treat by occlusion with petroleum jelly to force it out, or surgical extraction, with tetanus prophylaxis"],
          ["Tungiasis", "The sand flea Tunga penetrans", "A painful white papule with a dark central punctum on the sole or periungual skin; remove the flea with a sterile needle and give tetanus prophylaxis"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Diagnosing scabies as eczema and treating it with a topical steroid. Steroids damp the inflammation that produces diagnostic papules and prolong the infestation, while imidazole creams do nothing to a mite. Ask about household contacts and night-time itch in every itchy eruption in the finger web spaces.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating one household member. Scabies is a household disease; treating one person guarantees reinfestation and a false label of treatment failure. Treat everyone in close contact, including carers, on the same day.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Missing the immunosuppression hidden behind an unimpressive viral rash. Multiple, large or recurrent molluscum on an adult face, multidermatomal or disseminated zoster, chronic ulcerated herpes simplex and extensive recalcitrant warts are all indications to offer an HIV test.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing recurrent herpes simplex with impetigo. A grouped vesicular eruption recurring at the same site is herpes; golden-crusted lesions on a child's face are impetigo. When both are present, treat the herpes and the bacterial superinfection, because superinfection prolongs the episode.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A patient with severe atopic eczema suddenly deteriorates, with rapidly spreading monomorphic punched-out erosions and fever. What is the diagnosis and the immediate management?",
        answer: "Eczema herpeticum — disseminated herpes simplex infection of eczematous skin. Admit for intravenous aciclovir, swab the lesions for herpes virus and bacteria, treat staphylococcal superinfection, moisten and protect the skin, and consider this diagnosis in every acute deterioration of eczema.",
        explanation: "The monomorphic punched-out erosions and the systemic illness distinguish it from impetiginised eczema, and untreated eczema herpeticum carries a real mortality.",
      },
      {
        type: "question",
        prompt: "Why does the itch of scabies persist for weeks after effective treatment, and how should you respond?",
        answer: "The itch is a delayed hypersensitivity reaction to mite and mite products and outlives the mite by 2 to 4 weeks. Respond with an emollient and a moderate topical steroid, confirm cure (no new burrows, no contact source) and resist further courses of scabicide.",
        explanation: "Repeated pointless scabicide damages the barrier, causes irritant dermatitis and prolongs the itch — an avoidable iatrogenic loop.",
      },
      {
        type: "question",
        prompt: "A traveller returns from West Africa with a painful boil on the buttock with a central punctum. What is the likely diagnosis and its treatment?",
        answer: "Myiasis — larvae of Cordylobia anthropophaga (tumbu fly), laid on laundry dried outdoors. Occlude with petroleum jelly to force the larva out or extract surgically, and give tetanus prophylaxis.",
        explanation: "Recurrent boil-like lesions with a central breathing punctum in a traveller are myiasis until proven otherwise; a staphylococcal abscess has no central hole.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which finding most strongly indicates that a patient with an unusual viral rash should be offered HIV testing?",
        options: [
          "A single herpetic cold sore on the lip of a young adult",
          "Multidermatomal herpes zoster in a 30-year-old",
          "One episode of chickenpox in a 3-year-old",
          "Hand, foot and mouth disease in a 4-year-old",
        ],
        correctIndex: 1,
        explanation: "Zoster involving more than one dermatome, or occurring in a young adult, indicates impaired cell-mediated immunity and is an indication for HIV testing. The others are ordinary presentations of common viral infection.",
      },
      {
        type: "mcq",
        stem: "Which treatment schedule is correct for the first episode of an adult facial herpes simplex?",
        options: [
          "Topical aciclovir cream alone, four times daily for 2 weeks",
          "Oral aciclovir 400 mg three times daily for 5 days, started at the first tingling",
          "Oral valaciclovir 1 g three times daily for 3 months",
          "No treatment, because the episode heals in 7 to 10 days anyway",
        ],
        correctIndex: 1,
        explanation: "Oral aciclovir started in the prodrome shortens the episode and reduces the duration of viral shedding; topical therapy adds little, and indefinite suppressive dosing is reserved for frequent recurrences.",
      },
      {
        type: "mcq",
        stem: "A patient with recurrent cold sores develops monomorphic punched-out erosions over eczematous skin with fever. What is the correct first action?",
        options: [
          "Increase the topical steroid and review in a week",
          "Prescribe oral flucloxacillin alone",
          "Admit for intravenous aciclovir and treat bacterial superinfection",
          "Take a swab and wait for the result before treating",
        ],
        correctIndex: 2,
        explanation: "Eczema herpeticum is disseminated herpes simplex in barrier disease and can be fatal; treatment with intravenous aciclovir must not wait for virology. Bacterial superinfection is common and needs treatment at the same time.",
      },
      {
        type: "mcq",
        stem: "Which statement about scabies management is correct?",
        options: [
          "Treat only the symptomatic patient and review in 2 weeks",
          "Apply permethrin 5 per cent to the whole body from the neck down overnight and repeat after 7 days, treating all close contacts on the same day",
          "Apply topical corticosteroid to control the itch during treatment",
          "Use a single application of permethrin and stop as soon as the itch settles",
        ],
        correctIndex: 1,
        explanation: "Permethrin must cover the whole body below the neck, be repeated at day 7 because it does not kill eggs, and be given to all close contacts simultaneously. Itch persists for weeks after cure, so it is not a marker of treatment failure.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Viral skin disease is read from patterns: umbilicated papules (molluscum), hyperkeratotic papules (warts), grouped vesicles (herpes), febrile exanthems (measles, rubella, roseola, parvovirus, coxsackie) and dermatomal vesicles (zoster). The immunosuppressed patient is the exception to every rule — widespread molluscum, chronic herpetic ulcers and multidermatomal zoster are all reasons to test for HIV. Scabies is a household diagnosis: treat everyone at once, expect the itch to last weeks after the mite is dead, and remember that crusted scabies is an institutional emergency.",
      },
      {
        type: "paragraph",
        text: "Next: leprosy and the sexually transmitted infections — the chronic bacterial infection that disables through nerve damage, and the group of diseases in which the genital ulcer, the syphilitic serology and the partner-notification conversation decide whether a complication develops.",
      },
    ],
  };
}
// ---------------------------------------------------------------------------
// LESSON 5 — Leprosy & STDs (fully authored)
// ---------------------------------------------------------------------------
function lesson5() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: classify leprosy on the Ridley-Jopling spectrum and on the World Health Organization operational classification, and explain why the classification follows cell-mediated immunity; describe the nerve, limb and ocular complications of leprosy; recognise and manage the type 1 reversal and type 2 (erythema nodosum leprosum) reactions; state the multidrug therapy regimens, their durations and their major adverse effects; take a sexual history and examine a patient with a genital ulcer; and diagnose and treat syphilis, chancroid, gonorrhoea, lymphogranuloma venereum, donovanosis, genital herpes and anogenital warts, including contact tracing and partner management.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 3 (bacterial and fungal infections) for chronic granulomatous bacterial infection, Lesson 2 (morphology and distribution) for the genital ulcer differential, and the microbiology of Mycobacterium, Treponema, Neisseria, Haemophilus and Chlamydia from MICRO.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Leprosy",
        text: "A chronic granulomatous infection of skin and peripheral nerve caused by Mycobacterium leprae, an obligate intracellular acid-fast bacillus that cannot be cultured in vitro, replicates best at 30 to 33 degrees Celsius, and preferentially invades skin, nasal mucosa and the Schwann cells of peripheral nerves.",
      },
      {
        type: "paragraph",
        text: "Everything about leprosy follows from one fact: the organism grows inside macrophages and Schwann cells, so the disease is a spectrum determined by how much cell-mediated immunity the host mounts. A strong response contains the infection to a single well-defined anaesthetic patch with almost no bacilli (tuberculoid); a weak response allows diffuse spread with abundant bacilli and symmetric nerve damage (lepromatous). The same spectrum sets the prognosis, the bacteriological index, the reaction type and the risk of disability. Untreated, the damage is done not by the bacillus but by the combination of anaesthesia and immune-mediated nerve inflammation — which is why the clinician's work is nerve examination, reaction recognition and early multidrug therapy.",
      },
      {
        type: "callout",
        variant: "info",
        text: "M. leprae cannot be grown on artificial media. Diagnosis rests on slit-skin smears (bacteriological and morphological indices), histology with an acid-fast stain such as Fite-Faraco, and polymerase chain reaction in reference laboratories. Incubation is long — typically 3 to 8 years, sometimes two decades — so family screening and contact tracing matter far more than in acute infection.",
      },

      { type: "heading", level: 2, text: "The Ridley-Jopling spectrum" },
      {
        type: "table",
        headers: ["Group", "Skin lesions", "Bacilli", "Immunology", "Nerve damage"],
        rows: [
          ["Indeterminate", "One or two poorly defined hypopigmented or slightly erythematous macules, often in a child", "Negative or rare", "Intermediate; may heal or progress either way", "None or minimal"],
          ["Tuberculoid (TT)", "One or a few large, well-defined, dry, hypopigmented or erythematous patches with a raised firm border, loss of sensation and of sweating", "Negative (paucibacillary)", "Strong cell-mediated immunity, lepromin positive, granulomas with lymphocytes", "Early, asymmetric, severe; the nerve to the patch is thickened"],
          ["Borderline tuberculoid (BT)", "A few to several asymmetric lesions with satellite lesions around larger plaques; sensory loss prominent", "Scant (paucibacillary)", "Variable, closer to the tuberculoid pole", "Asymmetric and early"],
          ["Mid-borderline (BB)", "Lesions of both poles, with the characteristic punched-out appearance; the most unstable group", "Moderate", "Unstable, reactions frequent", "Moderate and diffuse"],
          ["Borderline lepromatous (BL)", "Many small, symmetric, less well-defined lesions with some sensory preservation", "Moderate to many (multibacillary)", "Weak cell-mediated immunity", "Symmetric, widespread, late"],
          ["Lepromatous (LL)", "Numerous symmetric ill-defined shiny macules and papules, earlobe infiltration, madarosis (loss of eyebrows), nasal congestion, leonine facies, glove-and-stocking neuropathy", "Abundant, in globi (multibacillary)", "Lepromin negative, high antibody titre, sheets of foamy macrophages", "Symmetric, diffuse, progressive but late"],
        ],
      },
      {
        type: "paragraph",
        text: "Two classifications coexist. Ridley-Jopling is histological and prognostic; the WHO operational classification decides treatment with a lesion count — paucibacillary leprosy is one to five skin lesions with no bacilli on smear, and multibacillary leprosy is more than five lesions, any smear-positive patient, or a patient with a single thickened nerve. Histoid leprosy (firm subcutaneous nodules in a lepromatous patient) and diffuse lepromatous leprosy with Lucio phenomenon are recognized variants of the lepromatous pole.",
      },

      { type: "heading", level: 2, text: "Nerve, limb and ocular complications" },
      {
        type: "table",
        headers: ["Nerve", "Where to palpate it", "Deficit it produces"],
        rows: [
          ["Great auricular", "Posterior triangle behind the angle of the mandible", "Loss of sensation over the cheek and ear lobe; ear-lobe infiltration"],
          ["Ulnar", "At the elbow, behind the medial epicondyle", "Claw hand from intrinsic wasting, sensory loss in the little finger, recurrent hand ulceration"],
          ["Median", "At the wrist, lateral to the palmaris longus", "Thenar wasting, sensory loss in the two radial digits, trophic hand ulceration"],
          ["Common peroneal", "At the neck of the fibula, where it is palpable and vulnerable", "Foot drop, high-stepping gait, abrasion over the dorsum of the foot"],
          ["Posterior tibial", "Behind the medial malleolus", "Plantar anaesthesia and a neuropathic ulcer at the forefoot pressure points"],
          ["Facial (seventh)", "Preauricular region and over the zygoma", "Lagophthalmos, corneal anaesthesia, corneal ulcer and blindness"],
        ],
      },
      {
        type: "paragraph",
        text: "Test sensation systematically in every leprosy patient, using a monofilament or the lightest touch of a cotton wisp at defined points on the palms, soles and limbs. Anaesthesia removes the only early warning system a skin surface has — heat, pressure and friction pass unregistered — so the patient burns, blisters and ulcerates without noticing, and the ulcer becomes infected. Daily self-care (washing and oiling, careful inspection for redness, rest and off-loading footwear) prevents most of the disability for which the disease is remembered, and it is the cheapest effective intervention in medicine.",
      },

      { type: "heading", level: 2, text: "Leprosy reactions" },
      {
        type: "definition",
        term: "Leprosy reaction",
        text: "An acute immunological event during treatment or afterwards in which the patient's immune response to M. leprae abruptly escalates, causing new or newly inflamed lesions and acute neuritis — the main cause of avoidable nerve damage.",
      },
      {
        type: "table",
        headers: ["Feature", "Type 1 (reversal, delayed hypersensitivity)", "Type 2 (erythema nodosum leprosum)"],
        rows: [
          ["Who", "Borderline patients (BT, BB, BL) — the unstable middle of the spectrum", "Lepromatous and borderline lepromatous patients"],
          ["Mechanism", "Cell-mediated hypersensitivity to mycobacterial antigen", "Immune-complex deposition with complement activation and neutrophil response"],
          ["Clinical", "Existing lesions become red, hot, swollen and painful; new lesions and new nerve swelling and tenderness appear", "Cropped painful erythematous nodules, fever, iritis, episcleritis, arthritis, neuritis, dactylitis, orchitis, lymphadenitis, proteinuria"],
          ["Timing", "Usually within the first 6 to 12 months of multidrug therapy", "Any time, often in the first year, and again after stopping treatment"],
          ["Management", "Continue multidrug therapy and start oral prednisolone 40 to 60 mg daily, tapering slowly over 8 to 12 weeks; splint the affected nerve and refer urgently to prevent permanent paralysis", "Continue multidrug therapy, prednisolone 40 mg daily, plus clofazimine 300 mg daily tapered, or thalidomide 400 mg daily in selected patients; analgesia and management of the eye"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "An acute painful tender swollen nerve in a leprosy patient is a medical emergency for that nerve. Nerve damage from a reaction is largely reversible if corticosteroids are started promptly and permanent if they are delayed — always refer the same day, and never treat a nerve abscess with steroids alone if there is a fluctuant collection.",
      },

      { type: "heading", level: 2, text: "Multidrug therapy and its adverse effects" },
      {
        type: "table",
        headers: ["Regimen", "Drugs", "Duration"],
        rows: [
          ["Paucibacillary (classic)", "Rifampicin 600 mg once monthly, supervised, plus dapsone 100 mg daily unsupervised", "6 months"],
          ["Multibacillary (classic)", "Rifampicin 600 mg monthly plus clofazimine 300 mg monthly and 50 mg daily plus dapsone 100 mg daily", "12 months"],
          ["Uniform multidrug therapy (WHO, current)", "All patients receive rifampicin monthly with clofazimine 50 mg daily plus dapsone 100 mg daily — the recommendation to give clofazimine to paucibacillary patients too", "Paucibacillary 6 months; multibacillary 12 months"],
          ["Single-lesion paucibacillary", "Rifampicin 600 mg, ofloxacin 400 mg and minocycline 100 mg as a single supervised dose", "One dose, with follow-up"],
        ],
      },
      {
        type: "table",
        headers: ["Drug", "Adverse effects and counselling"],
        rows: [
          ["Dapsone", "Haemolysis and methaemoglobinaemia (worse with glucose-6-phosphate dehydrogenase deficiency — check the enzyme before starting), peripheral neuropathy, agranulocytosis, a dapsone hypersensitivity syndrome with rash, fever and hepatitis, and nephritis"],
          ["Rifampicin", "Orange-red discoloration of urine, sweat, tears and contact lenses (warn the patient or they will panic), hepatotoxicity, a flu-like intermittent-dosing reaction, and strong induction of cytochrome P450 enzymes — it reduces the efficacy of oral contraceptives, corticosteroids and antiretrovirals"],
          ["Clofazimine", "A dose-related red-brown then black skin pigmentation, dry ichthyotic skin, dry mouth, abdominal cramps and a rare enteropathy; pigmentation fades over months after stopping"],
          ["Corticosteroids for reactions", "Weight gain, hyperglycaemia, hypertension, peptic ulceration, psychiatric disturbance, cataracts and infection; protect the skin of the acutely inflamed nerve and screen for tuberculosis before starting"],
        ],
      },
      {
        type: "paragraph",
        text: "Leprosy is curable — multidrug therapy removes infectiousness within days of the first rifampicin dose, and the global elimination targets relied on it. What is not automatically reversible is established nerve damage: contractures, claw hands, foot drop, lagophthalmos, foot ulcers and blindness. These need physiotherapy, protective footwear, reconstructive or tendon-transfer surgery, and lifelong self-care, and they are what makes the disease a human-rights problem as much as a microbiological one.",
      },

      { type: "heading", level: 2, text: "The genital ulcer differential" },
      {
        type: "paragraph",
        text: "A genital ulcer is a diagnosis of five diseases plus two non-infective mimics, and the first question is whether it hurts. The painful ulcers are chancroid and genital herpes; the painless are the syphilitic chancre, the initial lesion of lymphogranuloma venereum, and donovanosis. Distribution matters too: multiple, grouped and superficial lesions favour herpes; ulcers with scarring or with a bubo behave differently again. Always examine the inguinal nodes and look for other sites of disease, take a full sexual history, and test for syphilis and HIV in everyone.",
      },
      {
        type: "table",
        headers: ["Condition", "Organism", "Ulcer and nodes", "Treatment"],
        rows: [
          ["Syphilitic chancre (primary syphilis)", "Treponema pallidum", "A single painless, indurated, clean-based, punch-edged ulcer, often on the cervix or perianal skin in women, with non-tender regional lymphadenopathy; heals in 3 to 6 weeks", "Benzathine penicillin G 2.4 million units intramuscularly as a single dose (early syphilis)"],
          ["Chancroid", "Haemophilus ducreyi", "Multiple painful, ragged, soft-edged ulcers with a dirty base and tender suppurating inguinal buboes, with a short incubation", "Azithromycin 1 g orally once, or ceftriaxone 250 mg intramuscularly once, or erythromycin to complete 7 days"],
          ["Genital herpes", "Herpes simplex virus types 1 and 2", "Grouped painful vesicles becoming shallow erosions and ulcers, with tender inguinal lymphadenopathy, dysuria and fever at first episode", "Aciclovir 400 mg three times daily or valaciclovir 1 g twice daily for 5 to 10 days; suppressive therapy for frequent recurrences"],
          ["Lymphogranuloma venereum", "Chlamydia trachomatis serovars L1 to L3", "A small painless ulcer or papule that heals unnoticed, followed by painful inguinal and femoral buboes (the groove sign) and later genital elephantiasis and rectal strictures", "Doxycycline 100 mg twice daily for 21 days, with bubo drainage by aspiration rather than incision"],
          ["Donovanosis (granuloma inguinale)", "Klebsiella granulomatis", "A painless, friable, beefy-red granulating ulcer that bleeds easily and spreads by contiguity; there is no lymphadenopathy, but pseudobuboes occur", "Azithromycin 1 g weekly or 500 mg daily for at least 3 weeks and until the ulcer has healed"],
          ["Traumatic, aphthous or Behcet ulcer", "Non-infective", "A painful ulcer with a characteristic history or with simultaneous oral and ocular disease; the latter needs specialist management", "Treat the cause; exclude infection first"],
        ],
      },

      { type: "heading", level: 2, text: "Syphilis: the disease that can imitate any specialty" },
      {
        type: "heading", level: 2, text: "Syphilis: the disease that can imitate any other specialty" },
      {
        type: "table",
        headers: ["Stage", "Incubation and timing", "Clinical features"],
        rows: [
          ["Primary", "About 10 to 90 days after exposure (usually 3 weeks)", "The chancre described above, plus regional non-tender lymphadenopathy; on the cervix, perianal skin or in the mouth it is missed, which is why late syphilis still occurs in women who were never treated"],
          ["Secondary", "6 to 12 weeks after exposure, while the chancre is healing", "A symmetrical maculopapular rash that characteristically involves the palms and soles, condylomata lata (moist flat papules in the anogenital region), mucous patches in the mouth, patchy moth-eaten alopecia, generalised lymphadenopathy, anorexia, fever and malaise"],
          ["Latent", "No clinical signs; early latent is within 2 years of infection, late latent beyond it", "Diagnosis by serology; about one-third of untreated latent patients develop tertiary disease"],
          ["Tertiary", "Years to decades after infection", "Gumma (destructive granulomas of skin, bone and viscera), cardiovascular syphilis (syphilitic aortitis, ascending aortic aneurysm and aortic regurgitation), and late neurosyphilis (meningovascular syphilis, tabes dorsalis with lightning pains and Argyll Robertson pupils, and general paresis with dementia)"],
          ["Congenital", "In utero via the placenta", "Early: snuffles, hepatosplenomegaly, rhagades, maculopapular rash with bullae on palms and soles. Late: interstitial keratitis, Hutchinson teeth, saddle nose, sabre shins, sensorineural deafness and Clutton joints"],
        ],
      },
      {
        type: "paragraph",
        text: "Diagnosis depends on the stage. Primary chancre: dark-ground microscopy or nucleic acid amplification of the lesion, because serology may still be negative. Secondary and latent: serology — non-treponemal tests (VDRL, RPR) are quantified, rise with active disease and fall with treatment, so they are used to monitor response; treponemal tests (TPPA, TPHA, fluorescent treponemal antibody) confirm the organism and usually remain positive for life. Watch for the prozone phenomenon — a very high antibody titre in secondary syphilis can give a false-negative non-treponemal test unless the laboratory dilutes the serum. Late syphilis with neurological signs, or a late latent infection in someone with HIV, needs cerebrospinal fluid examination.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Warn every patient about the Jarisch-Herxheimer reaction: within the first 24 hours of treatment a flu-like illness with fever, rigors, headache, myalgia and worsening rash is common in early syphilis, more so with HIV co-infection. It is spontaneous, not an allergy — paracetamol and, if needed, a short steroid course treat it, and the correct response to a rash that worsens the day after treatment is to continue the syphilis treatment, not to switch antibiotics.",
      },
      {
        type: "table",
        headers: ["Stage", "Treatment"],
        rows: [
          ["Early syphilis (primary, secondary, early latent)", "Benzathine penicillin G 2.4 million units intramuscularly, single dose"],
          ["Late latent and tertiary syphilis without neurological disease", "Benzathine penicillin G 2.4 million units intramuscularly, weekly for 3 doses"],
          ["Neurosyphilis and ocular or otic syphilis", "Aqueous or procaine penicillin for 14 days; dexamethasone is added for acute visual loss"],
          ["Pregnancy", "Penicillin-based regimen in which true allergy is managed by desensitisation, because alternatives do not treat the fetus reliably"],
          ["Penicillin allergy", "Doxycycline 100 mg twice daily for 14 days in early syphilis and 28 days in late latent syphilis, ceftriaxone in selected cases; note that erythromycin does not reliably treat the fetus"],
        ],
      },

      { type: "heading", level: 2, text: "The other sexually transmitted infections" },
      {
        type: "table",
        headers: ["Infection", "Organism and features", "Treatment"],
        rows: [
          ["Gonorrhoea", "Neisseria gonorrhoeae, a Gram-negative diplococcus. Incubation 2 to 5 days in men, who develop dysuria and purulent urethral discharge; women are asymptomatic in about half and risk ascending infection to the endometrium and fallopian tubes — pelvic inflammatory disease, ectopic pregnancy and tubal infertility. Disseminated gonococcal infection gives tenosynovitis, a pustular rash and arthritis", "Ceftriaxone 500 mg intramuscularly as a single dose (1 g if the patient weighs 150 kg or more), plus doxycycline 100 mg twice daily for 7 days when chlamydia has not been excluded; use a nucleic acid test on first-catch urine or a cervical swab, and perform a test of cure only where reinfection is suspected"],
          ["Chlamydia", "Chlamydia trachomatis serovars D to K: the commonest bacterial sexually transmitted infection, often silent, causing urethritis, epididymitis, cervicitis and pelvic inflammatory disease", "Doxycycline 100 mg twice daily for 7 days, or azithromycin 1 g as a single dose in pregnancy"],
          ["Lymphogranuloma venereum", "Chlamydia trachomatis L1 to L3, as described above; an increasing cause of severe proctitis in men who have sex with men", "Doxycycline 100 mg twice daily for 21 days; bubo aspiration, not incision"],
          ["Donovanosis", "Klebsiella granulomatis, as described above; diagnosis is by a crush smear showing Donovan bodies in macrophages", "Azithromycin 1 g weekly or 500 mg daily for at least 3 weeks until the ulcer heals"],
          ["Trichomoniasis", "Trichomonas vaginalis: frothy yellow-green offensive discharge with vulvovaginitis and a strawberry cervix; motile trophozoites on a fresh wet preparation", "Metronidazole 2 g orally as a single dose (or 400 mg twice daily for 7 days), with treatment of the partner and abstention from alcohol"],
          ["Anogenital warts", "HPV 6 and 11 as described in Lesson 4", "Ablative or cytodestructive treatment plus cervical screening and partner examination"],
        ],
      },
      {
        type: "paragraph",
        text: "Every episode of sexually transmitted infection is also an opportunity for prevention. Offer HIV and syphilis testing, hepatitis B testing and vaccination, and human papillomavirus vaccination to eligible patients; discuss contraception and the need for cervical screening; manage partners through notification and treatment; and record everything in a confidential record. Where there is a cluster of cases — for instance in a school, or in an outbreak of LGV proctitis in men who have sex with men — the local public health team needs to be informed.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Believing that a negative syphilis serology rules out the chancre you are looking at. Serology is negative in the first 1 to 2 weeks after a primary chancre appears: examine the partner, perform dark-ground microscopy or nucleic acid testing, and repeat serology at 6 weeks before calling a negative.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating a leprosy reaction as bacterial infection, or the reverse. Type 1 reactions and erythema nodosum leprosum are immune events requiring corticosteroids, not antibiotics — but a swollen tender nerve may be a nerve abscess needing drainage, so get a surgical opinion when there is doubt.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Prescribing only topical therapy for tinea while missing the coexisting sexually transmitted infection, or treating an anogenital complaint without asking about sex partners. The genital problem in front of you may be the presenting sign of syphilis, gonorrhoea, chlamydia or HIV.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting partner notification and test of cure. A single case of gonorrhoea or chlamydia that is treated without treating the partner is reinfection within weeks; and treating gonorrhoea with oral penicillins or macrolides alone leaves a partially treated infection and selects for resistance.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A patient has multiple painful soft-edged genital ulcers with tender suppurating inguinal nodes. Give the likely diagnosis, its organism and its treatment.",
        answer: "Chancroid, caused by Haemophilus ducreyi. Treat with a single dose of azithromycin 1 g orally or ceftriaxone 250 mg intramuscularly (with erythromycin as an oral alternative); drain a fluctuant bubo by aspiration rather than incision, test for syphilis and HIV, and manage partners.",
        explanation: "The three features that separate chancroid from syphilis are pain, multiplicity of ulcers and tender suppurating adenitis.",
      },
      {
        type: "question",
        prompt: "A borderline leprosy patient, six months into multidrug therapy, develops red swollen lesions, fever and a newly painful thickened ulnar nerve. What has happened and what must you do?",
        answer: "A type 1 reversal reaction — a delayed hypersensitivity flare against mycobacterial antigen, with acute neuritis. Continue multidrug therapy and start prednisolone 40 to 60 mg daily, tapering slowly over 8 to 12 weeks, splint the hand, and refer urgently for assessment of the nerve. Untreated, the acute inflammation causes permanent paralysis and contracture.",
        explanation: "Type 1 reactions occur in borderline disease, whereas type 2 erythema nodosum leprosum with crops of painful nodules, iritis and fever occurs in lepromatous disease. Both are managed by continuing treatment and suppressing the inflammation, not by stopping therapy.",
      },
      {
        type: "question",
        prompt: "A woman presents with a painless indurated genital ulcer and a rash on her palms and soles. Which tests do you order and how do you interpret them?",
        answer: "Dark-ground microscopy or nucleic acid test on the ulcer itself, because serology may still be negative in primary syphilis, together with a non-treponemal titre (VDRL or RPR) and a treponemal test (TPPA or TPHA). A rising titre with active disease and a treponemal test that stays positive for life are the classical pattern; the CSF must be examined if there are neurological signs or if late latent syphilis coexists with HIV. Also test for HIV, gonorrhoea and chlamydia, and trace and treat partners.",
        explanation: "The palm and sole rash indicates secondary syphilis, which has passed beyond the stage at which serology is negative, so both serology and a title will confirm it.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A patient has a single painless indurated ulcer on the cervix and non-tender inguinal lymphadenopathy. Which diagnosis must be actively excluded?",
        options: ["Chancroid", "Genital herpes", "Primary syphilis", "Donovanosis"],
        correctIndex: 2,
        explanation: "The painless, indurated ulcer with non-tender nodes is the classic chancre of primary syphilis. Chancroid is painful with suppurating nodes, herpes is grouped and vesicular, and donovanosis is a friable beefy-red ulcer with no lymphadenopathy.",
      },
      {
        type: "mcq",
        stem: "Which statement about leprosy classification is correct?",
        options: [
          "Lepromatous leprosy has few bacilli and strong cell-mediated immunity",
          "Tuberculoid leprosy has a single well-defined anaesthetic patch, few bacilli and strong cell-mediated immunity",
          "Borderline tuberculoid leprosy is the most stable end of the spectrum",
          "The bacteriological index rises towards the tuberculoid pole",
        ],
        correctIndex: 1,
        explanation: "In tuberculoid leprosy strong cell-mediated immunity contains the infection to one or a few lesions with almost no bacilli and prominent nerve damage; in lepromatous leprosy immunity is weak, bacilli are abundant and the disease is symmetric. The borderline groups are the unstable middle and are the group that develops reactions.",
      },
      {
        type: "mcq",
        stem: "A patient with lepromatous leprosy on multidrug therapy develops crops of painful red nodules, fever, iritis and painful dactylitis. What is the management?",
        options: [
          "Stop rifampicin and treat with antibiotics",
          "Continue multidrug therapy and give prednisolone with clofazimine (or thalidomide in selected patients)",
          "Topical corticosteroid alone and review in a month",
          "Increase clofazimine monthly dose only, with no other change",
        ],
        correctIndex: 1,
        explanation: "This is erythema nodosum leprosum, a type 2 reaction from immune-complex deposition. Multidrug therapy continues, and the reaction is controlled with systemic corticosteroids, clofazimine or thalidomide, with attention to the eye and joints.",
      },
      {
        type: "mcq",
        stem: "Which regimen is appropriate for early syphilis in a non-pregnant adult without penicillin allergy?",
        options: [
          "Procaine penicillin 2.4 million units daily for 14 days",
          "Aqueous penicillin intravenously for 14 days",
          "Benzathine penicillin G 2.4 million units intramuscularly as a single dose",
          "Doxycycline 100 mg twice daily for 21 days",
        ],
        correctIndex: 2,
        explanation: "Early syphilis (primary, secondary and early latent) is treated with a single intramuscular dose of benzathine penicillin G. Longer or intravenous regimens are reserved for late and neurosyphilis; doxycycline is the main alternative for the allergic non-pregnant patient.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Leprosy is a spectrum shaped by cell-mediated immunity, from one well-defined anaesthetic patch at the tuberculoid pole to diffuse symmetric disease with abundant bacilli at the lepromatous pole; the practical consequence is nerve examination, nerve protection, and multidrug therapy for 6 months in paucibacillary and 12 months in multibacillary disease, with rifampicin, clofazimine and dapsone and their adverse effects. Reactions — type 1 reversal and type 2 erythema nodosum leprosum — are the main cause of avoidable damage and need urgent corticosteroids while therapy continues. Among the sexually transmitted infections the first decision in a genital ulcer is painful or painless, the serological triad of syphilis is a non-treponemal titre plus a treponemal test, and every diagnosis is an opportunity for HIV and hepatitis testing, partner notification and prevention.",
      },
      {
        type: "paragraph",
        text: "Next: the eczema family. With the infective dermatoses behind you, you meet the group of diseases in which the distribution — flexural, contact, seborrhoeic or stasis — makes the diagnosis, and in which the difference between good and bad care is almost entirely emollient technique and correct use of topical corticosteroids.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------

// LESSON 6 — Eczema & dermatitis (fully authored)
// ---------------------------------------------------------------------------
function lesson6() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define eczema and describe the histology of spongiotic dermatitis; recognise atopic, contact (irritant and allergic), seborrhoeic, stasis, discoid, pompholyx, asteatotic and lichen simplex dermatitis by distribution and history; take a structured history for a contact allergen and describe how patch testing is performed and read; recognise the complications of eczema — impetigo, eczema herpeticum and erythroderma; and construct a treatment plan that includes emollients, correct potent topical steroids with quantity and duration, calcineurin inhibitors, antihistamines, antibiotics and systemic therapy.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 2 (morphology), Lesson 4 (viral infections) for eczema herpeticum, and Lesson 1 for the barrier function that fails in eczema.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Eczema (dermatitis)",
        text: "A superficial inflammatory skin disease characterised by spongiosis — oedema between the epidermal keratinocytes — in which the histology is the same across all subtypes but the distribution, the trigger and the prognosis differ. Clinically it appears as a poorly demarcated, itchy, erythematous eruption with scale, weeping, crusting and, when chronic, lichenification.",
      },
      {
        type: "paragraph",
        text: "Because the microscopic appearance is shared, the clinician separates the eczemas by asking two questions: where is it, and what caused it. Where is it gives you atopic (flexural), contact (the site of contact), seborrhoeic (sebaceous and intertriginous sites), stasis (lower legs with venous disease), discoid (coin-shaped plaques on limbs), asteatotic (dry elderly skin in winter) and lichen simplex (a single plaque where a hand scratches). What caused it gives you allergen or irritant, heat, sweat, alcohol, drug and stress. The distinction between atopic and contact dermatitis is not academic, because contact dermatitis is cured by removing the cause and nothing else, whereas atopic dermatitis is managed by continuous barrier care and anti-inflammatory treatment.",
      },
      {
        type: "callout",
        variant: "info",
        text: "In atopic dermatitis the barrier defect is now understood as primary rather than a consequence of inflammation. Loss-of-function mutations in filaggrin (FLG) — the protein that aggregates keratin and forms the cornified envelope — are the strongest known genetic risk factor, and reduced filaggrin increases transepidermal water loss, raises skin pH, and lets allergen and bacteria in. This is why intensive emollients are a disease-modifying treatment and not a comfort measure.",
      },

      { type: "heading", level: 2, text: "The eczemas" },
      {
        type: "table",
        headers: ["Type", "Distribution", "Diagnostic features and notes"],
        rows: [
          ["Atopic dermatitis", "Infants: face, scalp and extensor surfaces; children and adults: flexures — antecubital and popliteal fossae, neck, eyelids, hands", "A personal or family history of atopy (asthma, allergic rhinitis), xerosis, ichthyosis, keratosis pilaris, Dennie-Morgan infraorbital folds, and atopic cataract in severe cases. The UK diagnostic criteria require an itchy rash plus three of: visible flexural dermatitis, history of flexural dermatitis, history of asthma or hay fever, dry skin in the past year, onset under two years of age"],
          ["Irritant contact dermatitis", "The exposed surface, usually the hands of people in wet work, cleaning, catering, hairdressing, healthcare and metalworking", "The commonest form of contact dermatitis. Cumulative damage from water, detergents, solvents and friction, with a burning or stinging sensation more than itch; appears within hours of a heavy exposure or over years of repeated exposure"],
          ["Allergic contact dermatitis", "Precisely the site of contact — hands in gloves, eyelids from nail polish or cosmetics, feet in leather or rubber, ears or wrists from metal, mouth from dental material", "A delayed type IV hypersensitivity reaction appearing 48 to 72 hours after the skin meets the allergen: intense itch, a sharply bordered vesicular eruption that conforms to the shape of the contact. Common allergens are nickel, chromate in cement, rubber accelerators, paraphenylenediamine in hair dye, fragrance mix and colophony from plasters"],
          ["Seborrhoeic dermatitis", "Scalp, eyebrows, nasolabial folds, retroauricular area, presternal skin, and intertriginous folds", "Greasy yellow scale on an erythematous base rather than the silvery scale of psoriasis, with blepharitis; associated with Malassezia and more severe in Parkinson disease and in HIV. Common cradle cap in infants"],
          ["Stasis (varicose, gravitational) dermatitis", "The gaiter area of the lower legs, with associated ankle oedema, varicosities and haemosiderin pigmentation", "Chronic venous insufficiency with leakage of erythrocytes and haemosiderin deposition. The danger is contact dermatitis to the applied dressing, and the treatment is compression once arterial disease has been excluded"],
          ["Discoid (nummular) eczema", "Coin-shaped plaques on the limbs and trunk of middle-aged and older adults", "Sharply demarcated, intensely itchy, vesicular and weeping plaques 1 to 5 cm across; often in winter, often staphylococcus-colonised. Distinguish from tinea corporis by microscopy"],
          ["Pompholyx (dyshidrotic) eczema", "Palms, lateral fingers and soles", "Recurrent, deeply situated sago-grain vesicles on the sides of the fingers, associated with sweating, atopy, nickel allergy, hot weather and stress; treat with very potent topical steroid and treat the vesicles before they become infected"],
          ["Asteatotic eczema", "The shins and trunk of elderly people in winter, with low-humidity heating", "A cracked, crazy-paving or hexagonal pattern over dry scaly skin, often with inflamed fissures; treated with generous emollient and mild steroid"],
          ["Lichen simplex chronicus", "A single plaque on the nape of the neck, ankles, wrists, vulva or scrotum", "A thickened plaque of accentuated skin lines from an itch-scratch-lichenification loop; treated by breaking the scratching (potent steroid, occlusion, behavioural advice)"],
        ],
      },

      { type: "heading", level: 2, text: "Contact dermatitis and patch testing" },
      {
        type: "paragraph",
        text: "Patch testing is the diagnostic test of allergic contact dermatitis and is not the same as skin-prick testing, which tests immediate IgE-mediated allergy. Small quantities of the standard battery of allergens — plus any suspected occupational or cosmetic allergens — are applied to the patient's upper back under occlusion for 48 hours. The site is read at 48 hours when the patches come off, and again at 96 hours, because a pure positive is often only visible on the second reading. A positive result is only meaningful if it explains the present eruption, so every positive is interpreted against the distribution and the history. Avoid the test during flares, on systemic immunosuppressants, and on recently sun-exposed skin.",
      },
      {
        type: "question",
        prompt: "A hairdresser develops an intensely itchy vesicular eruption on the dorsa of the hands and forearms, spreading to the eyelids and the sides of the face. What are you thinking, and how do you confirm it?",
        answer: "Allergic contact dermatitis to paraphenylenediamine in hair dye (which explains the eyelids and face from airborne contact), or to nickel, rubber accelerators and shampoo resins. Confirm with patch testing to a standard battery plus the hairdressing series, and look at the occupational history in detail.",
        explanation: "Airborne and transfer contact dermatitis on the face and eyelids should always suggest a hair, cosmetic or plant allergen, and patch testing rather than prick testing is the correct investigation.",
      },

      { type: "heading", level: 2, text: "Complications" },
      {
        type: "table",
        headers: ["Complication", "How to recognise it", "Management"],
        rows: [
          ["Impetiginised eczema", "Sudden worsening with weeping, golden crust, pustules and regional lymphadenopathy", "Topical mupirocin for limited disease, oral flucloxacillin for widespread disease; treat the eczema as usual"],
          ["Eczema herpeticum", "Clustered monomorphic punched-out erosions on eczematous skin, with fever and pain", "Admit for intravenous aciclovir and treat bacterial superinfection"],
          ["Erythroderma", "A generalised confluent erythema affecting over 90 per cent of the body surface", "See Lesson 11 — emergency admission, fluid and temperature management"],
          ["Steroid damage", "Striae, atrophy, telangiectasia, perioral or periocular dermatitis, cataracts with prolonged facial use", "Use the lowest effective potency for the site, and choose steroid-sparing agents on the face and folds"],
        ],
      },

      { type: "heading", level: 2, text: "Treatment: the emollient-steroid ladder" },
      {
        type: "table",
        headers: ["Step", "What is used", "Key practical points"],
        rows: [
          ["Barrier repair", "Emollients applied generously and continuously (250 to 500 g per week for an adult), soap substitutes, bath oil, and avoidance of wool and overheating", "Apply down the body in the direction of hair growth, two to three times daily and always after bathing; emollient use reduces the amount of topical steroid needed"],
          ["Topical anti-inflammatory", "Corticosteroid in a potency matched to the site and severity — mild (hydrocortisone 1 per cent) for the face and folds, moderate (clobetasone butyrate) for limbs, potent (betamethasone 0.1 per cent) for the body, very potent (clobetasol propionate) for thick lichenified plaques, palms and soles", "Use a fingertip unit per hand-sized area, once or twice daily until clear, then step down to emollient plus intermittent maintenance; short courses of potent steroid are safe, and undertreatment of flares is the commonest error in eczema care"],
          ["Steroid-sparing on face and folds", "Topical calcineurin inhibitors — tacrolimus ointment and pimecrolimus cream", "Preferred for eyelids, face, flexures and in maintenance therapy; transient burning on application is common and settles; no atrophy"],
          ["Itch and sleep", "A sedative antihistamine at night (hydroxyzine, chlorphenamine), cool compresses, wet wraps for extensive flares", "Antihistamines help sleep and do not treat the underlying dermatitis, and a non-sedating antihistamine is rarely useful"],
          ["Infection control", "Topical mupirocin or oral flucloxacillin for staphylococcal impetiginisation", "Antibiotic only when there is infection — not as routine therapy"],
          ["Second line", "Phototherapy with narrow-band UVB two or three times weekly for 8 to 12 weeks", "Effective for widespread eczema not controlled by topicals, in dermatology day units"],
          ["Systemic therapy", "Short courses of prednisolone for severe flares; ciclosporin, methotrexate, azathioprine or mycophenolate for chronic severe disease; dupilumab (IL-4 receptor alpha blockade) and Janus kinase inhibitors in specialist care", "Monitor renal and liver function, blood pressure, counts and lipids; offer vaccination review and contraception advice"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Topical steroid phobia is a disease in its own right. Undertreated eczema flares become lichenified, infected and intractable; the fear is generally of the wrong drug on the wrong site. Ointments are for dry scaly plaques, creams for flexures and hairy skin, lotions for the scalp; hydrate the skin after application and never put emollient and steroid on at the same moment, because the emollient dilutes the steroid.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Calling every itchy flexural rash atopic dermatitis without asking about contact. Occupational and cosmetic contact dermatitis is cured by allergen avoidance, and it is missed for years when the history is not taken. Ask about hobbies, work, gloves, footwear, jewellery and new cosmetics in every patient with a hand or eyelid dermatitis.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Applying potent topical steroids to the face, eyelids and flexures. These sites absorb more and atrophy faster; use mild steroids or calcineurin inhibitors, and if a periocular or perioral dermatitis appears, suspect the steroid you are prescribing.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating stasis dermatitis with a topical steroid and no compression. The cause is venous hypertension; without compression the rash will not settle. Exclude arterial disease first (absent pulses, rest pain, atrophic toes) because compression is dangerous in ischaemia.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Missing eczema herpeticum because the eczema is upset. Any patient with eczema, fever and a rapidly spreading, painful, monomorphic punched-out eruption should be suspected of disseminated herpes simplex and admitted for intravenous aciclovir, not increased topical therapy.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "How do you distinguish irritant from allergic contact dermatitis at the bedside, and why does the distinction matter?",
        answer: "Irritant dermatitis burns and stings, appears within hours of exposure, is sharply confined to the site, and is cumulative over repeated exposures; allergic dermatitis itches, appears 48 to 72 hours after contact, spreads beyond the point of contact, and can be triggered by minute amounts of allergen. It matters because allergic dermatitis is diagnosed by patch testing and cured by avoiding the specific allergen, whereas irritant dermatitis is managed by protection and barrier repair.",
        explanation: "Irritant reactions are direct chemical injury and can happen to anyone with enough exposure; allergic reactions need prior sensitisation and then respond to tiny amounts.",
      },
      {
        type: "question",
        prompt: "Why are emollients considered a disease-modifying treatment in atopic dermatitis rather than a comfort measure?",
        answer: "Because filaggrin loss and the resulting barrier defect are primary in atopic dermatitis. Emollients restore the lipid barrier, reduce transepidermal water loss and antigen penetration, lower skin pH and reduce flare frequency, so they reduce the amount of topical anti-inflammatory treatment required.",
        explanation: "Barrier repair addresses the upstream defect, which is why emollient quantity is prescribed in grams per week rather than as needed.",
      },
      {
        type: "question",
        prompt: "A patient uses a moderately potent topical steroid twice daily on her eyelids for eight months for a persistent scaly rash. What complications do you expect, and what would you do?",
        answer: "Eyelid skin atrophy, telangiectasia, striae and periorbital dermatitis — a steroid-induced periocular dermatitis. Stop the potent steroid, step down to a mild steroid or a calcineurin inhibitor, use emollient, and consider patch testing, because the eruption that started this may itself have been allergic contact dermatitis to a cosmetic or ophthalmic preparation.",
        explanation: "The eyelids and periorbital skin absorb a high proportion of applied drug, so this is the commonest site of iatrogenic steroid damage.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which distribution best fits allergic contact dermatitis from a nickel watch strap?",
        options: [
          "A symmetric eruption in the antecubital fossae",
          "A sharply bordered eruption on the dorsum of the feet and toes",
          "An eruption on the wrist under the contact point, sharply limited by the area of contact",
          "A greasy scaly eruption of the scalp, nasolabial folds and presternal skin",
        ],
        correctIndex: 2,
        explanation: "Contact dermatitis respects the geometry of the contact — a band across the wrist with a sharp border at the edge of the strap — and appears 48 to 72 hours after exposure. Flexural disease is atopic, and greasy sebaceous distribution is seborrhoeic.",
      },
      {
        type: "mcq",
        stem: "A child with severe atopic eczema develops fever with clustered monomorphic punched-out erosions. What is the correct immediate management?",
        options: [
          "Increase the topical corticosteroid and add oral flucloxacillin",
          "Admit for intravenous aciclovir and treat bacterial superinfection",
          "Change to a very potent topical steroid and wet wraps",
          "Take a swab and wait for the culture before starting treatment",
        ],
        correctIndex: 1,
        explanation: "Eczema herpeticum is disseminated herpes simplex infection of eczematous skin; it needs intravenous aciclovir immediately, and delay increases mortality. A topical steroid increase will worsen it.",
      },
      {
        type: "mcq",
        stem: "Which statement about the treatment of eczema is correct?",
        options: [
          "Fingertip units and the lightest effective steroid for the shortest time should be matched to the site, and emollients used generously alongside",
          "Potent steroids should be avoided entirely because they cause skin thinning in everyone",
          "Calcineurin inhibitors are first-line for extensive trunk and limb eczema",
          "Antihistamines relieve the underlying inflammation and are essential in every patient",
        ],
        correctIndex: 0,
        explanation: "The safe approach is a potency matched to the site and severity, a defined duration, and generous emollient. Potent steroids are safe used correctly and are unsafe misused on the face; calcineurin inhibitors are reserved for face, folds and maintenance; antihistamines only help sleep.",
      },
      {
        type: "mcq",
        stem: "A 25-year-old has coin-shaped, intensely itchy, vesicular plaques on the forearms. Which investigation is most useful before committing to topical steroids?",
        options: ["Skin-prick testing for aeroallergens", "A potassium hydroxide scraping from the edge of a plaque", "Patch testing with the standard battery", "Skin biopsy for direct immunofluorescence"],
        correctIndex: 1,
        explanation: "Coin-shaped plaques are nummular eczema or tinea corporis, and a KOH scraping settles it. If KOH is negative, discoid eczema is treated with topical steroids; patch testing and immunofluorescence address entirely different syndromes.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "All eczema is spongiotic dermatitis; the subdivisions — atopic, contact, seborrhoeic, stasis, discoid, pompholyx, asteatotic and lichen simplex — are made from distribution and trigger, and the useful question is where, then why. Atopic dermatitis follows a filaggrin-mediated barrier defect and is managed with emollients in gram quantities, site-appropriate topical corticosteroids, calcineurin inhibitors for the face and folds, and escalation to phototherapy or systemic immunosuppression. Contact dermatitis is diagnosed by patch testing and cured only by allergen avoidance, and the two emergencies within this family are eczema herpeticum and erythroderma.",
      },
      {
        type: "paragraph",
        text: "Next: the papulosquamous disorders — psoriasis, pityriasis rosea, lichen planus and their relatives, in which a named sign, a distribution and a biopsy each carry diagnostic weight, and in which the psoriasis patient with joint symptoms changes what you must look for.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------

// LESSON 7 — Papulosquamous disorders (fully authored)
// ---------------------------------------------------------------------------
function lesson7() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define the papulosquamous group and name its four common members; recognise plaque, guttate, flexural, pustular and erythrodermic psoriasis by morphology and distribution, and describe the Koebner and Auspitz signs; recognise the nail, joint and systemic associations of psoriasis and explain the need to screen; describe the histology of psoriasis, lichen planus and pityriasis rosea; treat psoriasis in a stepwise ladder from topical vitamin D analogues to biologics and name the monitoring each requires; and recognise lichen planus, pityriasis rosea, lichen sclerosus and pityriasis rubra pilaris.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 2 (morphology), Lesson 4 (exanthems, for the pityriasis rosea differential), and Lesson 8 for the vesicobullous differential of pustular disease.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Papulosquamous disorders",
        text: "A group of diseases in which the primary lesion is a papule or a plaque covered by adherent scale — the technical definition covering psoriasis, pityriasis rosea, lichen planus, seborrhoeic dermatitis (Lesson 6) and their relatives. The diagnosis is made from the quality of the scale, the distribution and a handful of pathognomonic signs.",
      },
      {
        type: "paragraph",
        text: "The four questions that separate the members are: is the scale silvery or greasy (psoriasis versus seborrhoeic dermatitis), does it involve the extensor or the flexural surfaces (psoriasis versus eczema), is the papule purple, polygonal and itchy with a white lacy surface (lichen planus), and did it follow a herald patch in a Christmas-tree distribution (pityriasis rosea). Beneath all of them sits one shared biology: an autoimmune T-cell process against an antigen in the epidermis, with the interleukin-23 and Th17 pathway now the centre of psoriasis therapy.",
      },

      { type: "heading", level: 2, text: "Psoriasis" },
      {
        type: "table",
        headers: ["Type", "Presentation"],
        rows: [
          ["Plaque psoriasis (psoriasis vulgaris)", "Well-demarcated, salmon-pink plaques covered with thick silvery-white scale, symmetrically on the elbows, knees, extensor limbs, lumbosacral region and scalp, where the scale extends beyond the hairline. The herald signs: the Koebner phenomenon, and the Auspitz sign — pinpoint bleeding when the scale is lifted"],
          ["Guttate psoriasis", "A shower of drop-like, 2 to 10 mm, scaly pink papules over the trunk and limbs, typically 2 to 3 weeks after a streptococcal pharyngitis in a child or young adult; often self-limiting over 6 to 12 weeks, but a third go on to plaque disease"],
          ["Flexural (inverse) psoriasis", "Smooth, glazed, well-demarcated, non-scaly erythematous plaques in the axillae, groin, inframammary folds and gluteal cleft; frequently mistaken for candidiasis, but without satellite pustules and with a sharp clean border"],
          ["Pustular psoriasis", "Localised: sterile pustules on the palms and soles with a red base (palmoplantar pustulosis). Generalised (von Zumbusch) — see Lesson 11: sheets of febrile sterile pustules with red skin, often after withdrawal of systemic steroids"],
          ["Erythrodermic psoriasis", "Erythema and scale over more than 90 per cent of the body surface with systemic upset — see Lesson 11"],
          ["Nail disease", "Pitting, onycholysis with a red-brown oil-drop or salmon patch, subungual hyperkeratosis, thickening and splinter haemorrhages; present in half of patients with skin disease and a marker for joint disease"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The three landmark signs of psoriasis: Koebner — lesions arising along a scratch or surgical scar, because injury recruits the psoriatic infiltrate; Auspitz — pinpoint bleeding from the thinned suprapapillary epidermis over dilated capillaries after the scale is removed; and Woronoff — a pale halo left around a resolving plaque. All three are physical signs of the same underlying increased epidermal turnover.",
      },
      {
        type: "table",
        headers: ["Systemic burden", "Detail"],
        rows: [
          ["Psoriatic arthritis", "About 30 per cent of patients: distal interphalangeal joint involvement, dactylitis, enthesitis, axial disease and nail dystrophy. Nail pitting and scalp disease predict it. Ask about early morning stiffness and joint pain in every psoriasis patient, and refer for rheumatology assessment"],
          ["Metabolic and cardiovascular", "The metabolic syndrome, type 2 diabetes, non-alcoholic fatty liver disease, hypertension and raised cardiovascular mortality are all increased; obesity and smoking worsen the disease"],
          ["Psychological", "Anxiety, depression, sexual dysfunction and suicidality are increased out of proportion to visible severity; screen actively"],
          ["Other associations", "Uveitis, inflammatory bowel disease, coeliac disease, chronic kidney disease and the recurrence of the disease after lichen sclerosus-like atrophy is uncommon"],
        ],
      },

      { type: "heading", level: 2, text: "Psoriasis treatment ladder" },
      {
        type: "table",
        headers: ["Step", "Therapy", "Cautions and monitoring"],
        rows: [
          ["Topical for limited disease", "Emollients, plus a vitamin D analogue (calcipotriol, calcitriol or tacalcitol), a corticosteroid or a combined preparation, dithranol short-contact, tar, and salicylic acid for thick scale", "Calcipotriol stings and must be limited by maximum weekly dose; steroids produce relapse on withdrawal and tachyphylaxis"],
          ["Phototherapy", "Narrow-band UVB two or three times a week for 8 to 12 weeks, or PUVA (oral or bath psoralen plus UVA) for resistant disease", "Erythema and burning, nausea, and a cumulative skin-cancer risk with PUVA; shield the eyes and genitalia"],
          ["Conventional systemic", "Methotrexate (10 to 25 mg weekly with folic acid), ciclosporin (rapid control, blood pressure and renal monitoring), acitretin (teratogenic — contraception must continue for 2 to 3 years after stopping, and it raises lipids and transaminases), fumarates", "Liver and renal function, full blood count, blood pressure, lipids, pregnancy prevention"],
          ["Biologic therapy", "Tumour necrosis factor inhibitors (adalimumab, etanercept, infliximab), interleukin-12/23 (ustekinumab), interleukin-17 (secukinumab, ixekizumab) and interleukin-23 (guselkumab, risankizumab)", "Screen for tuberculosis and hepatitis B before starting; live vaccines are contraindicated; response is measured by PASI 75 or 90 with withdrawal rules for failure"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Guttate psoriasis needs a throat swab and antistreptolysin titre; treat the streptococcal infection. Do not start systemic immunosuppression for a self-limiting guttate eruption, and do not treat an obstetric patient with erythrodermic psoriasis by ignoring the obstetric trigger — pregnancy both triggers and is affected by every systemic drug on this page.",
      },

      { type: "heading", level: 2, text: "The other papulosquamous disorders" },
      {
        type: "table",
        headers: ["Disease", "Presentation and histology", "Management"],
        rows: [
          ["Pityriasis rosea", "A herald patch — a single 2 to 5 cm oval scaly plaque on the trunk or proximal limb — followed 1 to 2 weeks later by a generalised eruption of smaller scaly pink macules distributed along the lines of cleavage on the back (a Christmas-tree pattern), usually stopping above the knees. Spares the face, itches mildly and resolves in 6 to 8 weeks. A parakeratotic focus with spongiosis and a perivascular lymphocytic infiltrate on histology. Associated with human herpesviruses 6 and 7", "No treatment is needed for the majority: emollients, topical corticosteroid or UVB for the itch. Exclude secondary syphilis when the rash involves the palms and soles, when the patient has systemic illness or mucosal lesions, or when there is any sexual risk — do a syphilis serology for every atypical pityriasis rosea"],
          ["Lichen planus", "The 6 Ps: pruritic, purple, polygonal, planar papules and plaques, with a fine lacy white network (Wickham striae) on the surface. Classically on the flexor surfaces of the wrists, ankles and lower back, arising in scratch lines (a Koebner reaction), with mucous membrane involvement — a lacy white reticulate pattern on the buccal mucosa, erosive painful oral disease and, uncommonly, scarring scalp and genital disease. Histology: compact hyperkeratosis, wedge-shaped hypergranulosis, irregular saw-tooth acanthosis, a band-like lymphohistiocytic infiltrate at the basement membrane zone, and basal vacuolar change with Civatte bodies", "Potent topical corticosteroid or intralesional triamcinolone for limited disease, topical tacrolimus or pimecrolimus for the mouth, and systemic retinoids, immunosuppressants or phototherapy for severe or erosive disease. Screen for hepatitis C. Nail and scalp involvement cause scarring alopecia and need dermatological care"],
          ["Lichen planus pigmentosus and lichen amyloidosus", "Brown-grey flat papules in the flexures of darker-skinned people (the former) and intensely itchy brown papules on the shins (the latter, with amyloid in the dermis on staining)", "Potent topical steroid with occlusion for lichen amyloidosus, phototherapy, and reassurance; both are chronic and misdiagnosed as eczema"],
          ["Lichen sclerosus", "White, atrophic, porcelain-like plaques in the anogenital region of women and men, with a sclerosis that fuses the labia and hoods the clitoris (balanitis xerotica obliterans in men), and occasional extragenital plaques", "A very potent topical steroid for 3 months then tapering, with regular review for scarring, phimosis and the small risk of squamous cell carcinoma in genital disease"],
          ["Pityriasis rubra pilaris", "Orange-red follicular plaques with islands of sparing within a confluent erythema, palmoplantar keratoderma, and a self-limiting juvenile form; the adult form is refractory", "Emollients, keratolytics, acitretin or methotrexate; distinguish from erythrodermic psoriasis, which it closely resembles"],
          ["Subacute cutaneous lupus erythematosus", "A photosensitive, non-scarring, annular or papulosquamous eruption on the upper trunk and arms, with anti-Ro and anti-La antibodies", "Screen for systemic lupus, check renal function and complement, and involve rheumatology"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Treating pityriasis rosea without considering secondary syphilis. The two are close mimics: if the rash involves the palms and soles, there is a herald-like patch on the penis, the patient has lymphadenopathy or systemic illness, or there is any sexual exposure, take a syphilis serology before you accept the diagnosis.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Using an unopposed topical corticosteroid in flexural psoriasis. The steroid suppresses the plaque temporarily and causes rebound plus atrophy and striae, and flexural psoriasis needs steroid-sparing calcipotriol or calcineurin inhibitors. Flexural disease also needs a differential of candidiasis and tinea, which have satellite lesions.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Missing the arthritis in the psoriasis patient. Ask about early-morning stiffness, dactylitis, enthesitis and nail pitting in every consultation; delayed referral for psoriatic arthritis produces permanent joint damage, and the patient rarely volunteers the complaint.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Prescribing acitretin without a pregnancy-prevention plan. Acitretin is teratogenic for 2 to 3 years after the last dose, requires a reliable method of contraception, avoids alcohol which converts it to etretinate, and requires lipid and liver monitoring.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "How do you distinguish plaque psoriasis from discoid eczema, and what bedside manoeuvre helps most?",
        answer: "Psoriasis plaques are sharply demarcated thick plaques with silvery-white scale on extensor surfaces, the scalp and the lumbosacral region; discoid eczema is coin-shaped, itchy, vesicular or weeping, and less sharply bordered, usually on the limbs. The Auspitz sign is the valuable manoeuvre: scrape the scale gently and pinpoint bleeding appears in psoriasis. Both can be confused with tinea corporis, so a potassium hydroxide scraping is the deciding test.",
        explanation: "Sharpness of border, silvery scale and the site decide the diagnosis at a glance, and the Auspitz sign converts suspicion into near-certainty.",
      },
      {
        type: "question",
        prompt: "A patient has a herald patch and a Christmas-tree eruption on the back, but the palms and soles are also involved and there is generalised lymphadenopathy. What must you do before treatment?",
        answer: "Take a syphilis serology. The classic pityriasis rosea does not involve the palms, soles or lymph nodes, so the presence of those findings raises secondary syphilis, and the history and examination should be directed at sexual exposure. Treatment with topical steroids can proceed only after the diagnosis is settled.",
        explanation: "This is the one situation in which the diagnosis of pityriasis rosea is unsafe to make on morphology alone, because the two diseases share the herald patch and the scaly maculopapular pattern.",
      },
      {
        type: "question",
        prompt: "Why is a moderate topical corticosteroid not the first choice for a flexural psoriasis in the groin of an obese patient, and what would you give?",
        answer: "Occlusion in the flexure increases steroid absorption and atrophy and striae risk; the steroid also suppresses the plaque while the disease persists and rebounds on withdrawal. Instead use a calcipotriol-containing preparation or a calcineurin inhibitor, and if the lesion is satellite-pustular, treat candidiasis instead, which is the real differential.",
        explanation: "Inverse psoriasis is smooth and glazed because scale cannot accumulate at a moist site, and its differential is candidintertrigo, which it must not be treated as.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which feature is most characteristic of plaque psoriasis?",
        options: [
          "Greasy yellow scale on the nasolabial folds and scalp",
          "Sharply demarcated salmon-pink plaques with silvery scale on the extensor surfaces, with pinpoint bleeding when the scale is lifted",
          "Purple, polygonal, itchy flat papules with Wickham striae on the flexor wrists",
          "A herald patch followed by a Christmas-tree eruption on the back",
        ],
        correctIndex: 1,
        explanation: "The extensor distribution, thick silvery scale, demarcated border and the Auspitz sign together identify psoriasis. Greasy sebaceous scale is seborrhoeic dermatitis, purple polygonal papules are lichen planus, and the herald patch is pityriasis rosea.",
      },
      {
        type: "mcq",
        stem: "Which question is most important to ask a patient with newly diagnosed psoriasis at every consultation?",
        options: [
          "Have you had an exacerbation after a respiratory infection?",
          "Do you have early-morning joint stiffness, swollen fingers, heel pain or nail pitting?",
          "Have you used topical steroid on the face in the last year?",
          "Have you travelled to a tropical country in the past year?",
        ],
        correctIndex: 1,
        explanation: "Psoriatic arthritis affects about 30 per cent of patients, and early referral to rheumatology prevents permanent joint damage; nail pitting and scalp disease mark the risk. The other questions are relevant to other diagnoses or to drug safety but not to the yearly joint screen.",
      },
      {
        type: "mcq",
        stem: "A patient with severe psoriasis is started on ciclosporin while a colleague suggests acitretin. Which point applies specifically to acitretin?",
        options: [
          "It is safe in pregnancy",
          "It must be stopped only if liver enzymes rise above three times the normal limit",
          "It is teratogenic, requires contraception for 2 to 3 years after the final dose and must not be taken with alcohol",
          "It requires a routine tuberculosis screen before starting",
        ],
        correctIndex: 2,
        explanation: "Acitretin is teratogenic for years after the last dose, requires a reliable pregnancy-prevention plan and avoids alcohol, which converts it to etretinate. The tuberculosis screen applies to biologics, not to retinoids.",
      },
      {
        type: "mcq",
        stem: "Which statement about lichen planus is correct?",
        options: [
          "It affects the extensor surfaces and leaves silvery scale",
          "It produces purple, polygonal, itchy, flat papules with a lacy white pattern, often in scratch lines, and can ulcerate the mouth",
          "It is a bacterial infection treated with penicillin",
          "It is the same disease as pityriasis rubra pilaris",
        ],
        correctIndex: 1,
        explanation: "Lichen planus is a T-cell-mediated interface dermatitis of flexor surfaces, with a white lacy Wickham striae, Koebner reproduction in scratches, and oral and genital mucosal involvement. Silvery scale is psoriasis, and there is no bacterial cause.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The papulosquamous diseases share a scaly papule or plaque and are separated by scale quality, distribution and named signs. Psoriasis is diagnosed from extensor, sharply demarcated plaques with the Koebner and Auspitz signs, has a nail and a joint association, is screened for metabolic and psychological disease, and is treated along a topical, phototherapy, systemic and biologic ladder with monitoring at each step. Pityriasis rosea needs a syphilis serology when the palms, soles or nodes are involved. Lichen planus is purple, polygonal, pruritic, lacy and flexural, with oral, genital and scarring scalp involvement.",
      },
      {
        type: "paragraph",
        text: "Next: the vesicobullous disorders and drug eruptions. In this group the level of the blister decides the prognosis, a biopsy with direct immunofluorescence decides the diagnosis, and a drug history taken with the last eight weeks in mind decides whether your patient survives.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------

// LESSON 8 — Vesicobullous disease & drug eruptions (fully authored)
// ---------------------------------------------------------------------------
function lesson8() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: classify the autoimmune blistering diseases by the level of the split and by the target antigen; describe pemphigus vulgaris, bullous pemphigoid, dermatitis herpetiformis and mucous membrane pemphigoid, including their direct immunofluorescence patterns and treatment; define erythema multiforme, Stevens-Johnson syndrome and toxic epidermal necrolysis, estimate the body surface area detached and score severity; recognise the drug eruptions that matter — morbilliform, fixed drug, acute generalised exanthematous pustulosis and DRESS — and take a drug history with the correct latency window; and manage toxic epidermal necrolysis in a burns unit, including what not to do.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (the dermo-epidermal junction), Lesson 2 (morphology and the Nikolsky sign), Lesson 4 (herpes as a trigger of erythema multiforme and of eczema herpeticum) and Lesson 7 for pustular psoriasis.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "The level of the split decides the disease",
        text: "In every blistering disease the first question is where the skin separates. An intraepidermal split gives a flaccid, fragile, easily ruptured blister and heals without scarring; a subepidermal split at or below the basement membrane gives a tense, durable blister and may scar or leave milia.",
      },
      {
        type: "paragraph",
        text: "The second question is what antigen has been attacked: desmosomal cadherins between keratinocytes (the pemphigus group), hemidesmosomal and basement membrane proteins (the pemphigoid group), type VII collagen (epidermolysis bullosa acquisita) or epidermal transglutaminase (dermatitis herpetiformis). The first question is answered at the bedside with the Nikolsky sign and by looking at whether the mucosae are involved; the second is answered by a biopsy for H and E and a second biopsy for direct immunofluorescence — and the direct immunofluorescence must be requested on perilesional skin, because an old blister is non-diagnostic.",
      },

      { type: "heading", level: 2, text: "The intraepidermal blistering diseases" },
      {
        type: "table",
        headers: ["Disease", "Antigen and level", "Clinical picture and diagnosis"],
        rows: [
          ["Pemphigus vulgaris", "IgG against desmoglein 3 (with desmoglein 1 when skin is involved); the split is suprabasal, above the basal layer", "Painful oral erosions precede the skin disease in more than half of patients, followed by flaccid, fragile bullae on normal skin and large painful erosions, with a positive Nikolsky sign. Histology shows acantholysis with a row of tombstone basal cells; direct immunofluorescence gives an intercellular chicken-wire pattern of IgG and C3. Serum anti-desmoglein antibodies confirm and are quantified"],
          ["Pemphigus foliaceus", "IgG against desmoglein 1 only; a superficial granular-layer split", "Scaly crusted, erythematous plaques on the scalp, face and upper trunk, with no mucosal involvement and a superficial scale; a superficial autoimmune analogue of staphylococcal scalded skin syndrome"],
          ["Paraneoplastic pemphigus", "Autoantibodies against plakins and desmogleins, associated with lymphoma, leukaemia and Castleman disease", "Severe, intractable, polymorphous mucosal erosions with lichenoid and pemphigoid-like skin lesions, and often ocular and pulmonary disease; the diagnosis is a poor prognostic sign and treatment targets the tumour"],
          ["IgA pemphigus", "IgA against the epidermal cell surface", "Pustules with superficial vesicles, sometimes mimicking subcorneal pustular dermatosis"],
        ],
      },
      {
        type: "paragraph",
        text: "Pemphigus vulgaris is the serious one. High-dose systemic prednisolone is started immediately — 1 to 1.5 mg per kg daily, with a steroid-sparing agent such as azathioprine or mycophenolate, or rituximab as first-line therapy for moderate to severe disease. The patient needs wound care, analgesia, mouth care, nutrition, calcium and vitamin D, gastric protection, glucose monitoring, and early treatment of infection, because mortality is now driven by infection and by steroid complications rather than by the disease itself. Taper the steroids slowly and never abruptly.",
      },

      { type: "heading", level: 2, text: "The subepidermal blistering diseases" },
      {
        type: "table",
        headers: ["Disease", "Antigen and level", "Clinical picture and diagnosis"],
        rows: [
          ["Bullous pemphigoid", "IgG and C3 against BP180 and BP230 of the hemidesmosome; a subepidermal split in the lamina lucida", "The commonest autoimmune bullous disease: itchy urticarial plaques precede tense bullae on the abdomen, thighs and flexures in patients over 70. The Nikolsky sign is negative, eosinophilia is common, and direct immunofluorescence shows a linear band of IgG and C3 at the basement membrane. Treated with very potent topical clobetasol or oral prednisolone; often self-limiting over about 5 years"],
          ["Mucous membrane (cicatricial) pemphigoid", "Antigens of the basement membrane including BP180 and laminin 332", "Scarring erosions of the oral, ocular, pharyngeal, oesophageal and genital mucosae; the eye develops symblepharon and blindness, and needs ophthalmology care while the skin is treated"],
          ["Dermatitis herpetiformis", "Granular IgA in the dermal papillae, with antibodies against epidermal transglutaminase; a coeliac disease of the skin", "Intensely itchy vesicles, always excoriated, symmetrically on the extensor surfaces of the elbows, knees, buttocks and scalp; over 90 per cent have gluten-sensitive enteropathy, usually asymptomatic, and are at risk of thyroid disease and lymphoma. Diagnosed by direct immunofluorescence of perilesional skin. Treated with dapsone for the itch and a gluten-free diet for life — and always check glucose-6-phosphate dehydrogenase and monitor haemolysis on dapsone"],
          ["Linear IgA disease", "IgA along the basement membrane", "Chronic bullous disease of childhood: tense bullae in rosettes and strings of pearls around the genitalia, perioral and on the trunk. Vancomycin-induced in adults. Responds to dapsone and usually resolves"],
          ["Epidermolysis bullosa acquisita", "IgG against type VII collagen of the anchoring fibrils", "Blisters in sites of trauma, scarring, milia, and association with inflammatory bowel disease; an overlap with bullous lupus erythematosus"],
        ],
      },

      { type: "heading", level: 2, text: "Drug eruptions: the history you must take" },
      {
        type: "definition",
        term: "Latency",
        text: "The time between starting a drug and the appearance of the eruption. For the severe delayed reactions this window is narrow and diagnostically crucial: about 4 to 28 days for Stevens-Johnson syndrome, toxic epidermal necrolysis and DRESS, and hours to 2 days for acute generalised exanthematous pustulosis and fixed drug eruption.",
      },
      {
        type: "paragraph",
        text: "Ask about every drug started in the previous 8 weeks, including over-the-counter analgesics and antimalarials taken for fever, and note the exact date of the first symptom. The classic culprits for Stevens-Johnson syndrome and toxic epidermal necrolysis are sulfonamides including co-trimoxazole, the aromatic anticonvulsants (carbamazepine, phenytoin, lamotrigine), allopurinol, nevirapine, oxicam anti-inflammatories and thiacetazone. For DRESS they are the aromatic anticonvulsants, allopurinol and the sulfonamides. A morbilliform exanthem, by contrast, is the commonest of all drug eruptions and is usually benign, but you cannot call it benign until you have excluded those reactive syndromes and the diseases they mimic.",
      },
      {
        type: "table",
        headers: ["Reaction", "Timing and pattern", "Management"],
        rows: [
          ["Morbilliform (maculopapular) exanthem", "4 to 14 days after starting an ampicillin, cephalosporin, anticonvulsant or sulfonamide; the commonest reaction, and the commonest exanthem in infectious mononucleosis", "Treat the itch, watch for progression, and withdraw the drug if it is not essential. Always exclude and manage the infection it may be mimicking"],
          ["Fixed drug eruption", "Hours to 2 days after re-exposure; a well-circumscribed round or oval dusky red or violaceous patch that recurs every time at the same site, then fades with striking post-inflammatory hyperpigmentation. Common on the glans, lips and hands; culprits include non-steroidal anti-inflammatory drugs, paracetamol and codeine, sulfonamides, tetracyclines, barbiturates and phenolphthalein", "Stop the drug and identify it, because re-exposure reproduces the eruption within hours; the lesion resolves with pigmentation over weeks"],
          ["Acute generalised exanthematous pustulosis (AGEP)", "Hours to 2 days (about 24 hours typically) after a beta-lactam or a macrolide, but also from diltiazem, hydroxychloroquine and virus infections; high fever with numerous small, sterile, non-follicular pustules on oedematous erythema, oedema of the face, and a neutrophil leucocytosis", "Withdraw the drug; the eruption resolves with desquamation over 7 to 10 days; topical corticosteroid, fluids, and no systemic immunosuppression in the typical uncomplicated patient"],
          ["DRESS (drug reaction with eosinophilia and systemic symptoms)", "2 to 8 weeks — sometimes as long as 12 — after the first dose of carbamazepine, allopurinol, sulfonamides, abacavir, minocycline or dapsone. A morbilliform rash, facial oedema and fever with eosinophilia, hepatitis, nephritis, pneumonitis, myocarditis and thyroiditis, and reactivation of human herpesviruses 6 and 7", "Withdraw the drug, monitor liver and renal function, haemogram, cardiac enzymes and thyroid function, and treat with prednisolone 0.5 to 1 mg per kg tapered over 8 to 12 weeks. Mortality approaches 5 to 10 per cent, and autoimmune sequelae including thyroiditis and diabetes occur"],
          ["Stevens-Johnson syndrome and toxic epidermal necrolysis", "4 to 28 days after the culprit drug; described below", "Withdraw the culprit, refer to a burns or intensive care unit, and follow the protocol in Lesson 11"],
          ["Serum-sickness-like reaction", "One to three weeks after a heterologous protein or drug, with fever, arthralgia and urticarial rash", "Antihistamines, a short course of non-steroidal anti-inflammatory drugs, and withdrawal"],
        ],
      },

      { type: "heading", level: 2, text: "Erythema multiforme and the spectrum to toxic epidermal necrolysis" },
      {
        type: "table",
        headers: ["Condition", "Clinical picture"],
        rows: [
          ["Erythema multiforme minor", "Target (iris) lesions with three zones — a dusky centre, a pale ring and an erythematous rim — predominantly on the extensor surfaces of the limbs, hands, feet and face, arising in crops over one to two weeks and resolving in about 3 weeks. The mucosae are spared. More than 90 per cent of recurrent cases are triggered by herpes simplex; also by Mycoplasma pneumoniae and by drug exposure. Treat the trigger (long-term aciclovir for herpes, a macrolide for Mycoplasma) and support the skin"],
          ["Erythema multiforme major / Stevens-Johnson syndrome", "Mucosal erosions at two or more sites — mouth, eyes, genitals — with atypical, flat, confluent targetoid macules and limited detachment of skin; this is now understood as one end of a single spectrum with toxic epidermal necrolysis, with the drug triggers above and a delayed cytotoxic mechanism. Treated as described below"],
          ["Toxic epidermal necrolysis", "A prodrome of fever, malaise and sore throat or conjunctival injection, then painful dusky or purplish macules that coalesce and shed the epidermis in large sheets, with a positive Nikolsky sign, and detachment of more than 30 per cent of the body surface area. Mucosal involvement occurs in two-thirds. Histology shows full-thickness epidermal necrosis with a subepidermal split. Mortality is 30 to 50 per cent, and the causes of death are sepsis, multiorgan failure and respiratory involvement"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Taking a drug history that stops at the prescription list in front of you. Severe cutaneous adverse reactions depend on drugs started 2 to 8 weeks ago, and on over-the-counter ones. Ask the patient what they have taken in the last two months and at what date each was started, and mark the first day of symptoms, because that is the only way to identify the culprit.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Requesting direct immunofluorescence from an old blister. Direct immunofluorescence requires perilesional, non-blistered skin — from the edge of a lesion, or from adjacent normal skin. A crusted old blister is an uninterpretable specimen and will report as negative.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Assuming every blistering eruption is an infection. A Bullous eruption in an older adult with an urticarial prodrome is bullous pemphigoid, and in a younger adult with oral erosions it is pemphigus vulgaris; an infected blister is pus-filled and painful, whereas autoimmune bullae are tense and clear. Conversely, an itchy excoriated blistering eruption is scabies until proven otherwise.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Giving blistering skin to topical and systemic steroids as if that were treatment. Pemphigus vulgaris needs high-dose systemic therapy, bullous pemphigoid often very potent topical therapy, and toxic epidermal necrolysis needs supportive care and generally no systemic steroid. Each is different, and applying a single reflex is dangerous.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why must a biopsy for direct immunofluorescence be taken from perilesional skin, and what does a false-negative specimen look like?",
        answer: "A blister contains degraded tissue and loses antigenic structure, so direct immunofluorescence on an old or crusted blister reports as negative. Take the specimen from normal-looking or perilesional skin next to an eruption. The report then describes the real pattern: intercellular chicken-wire IgG and C3 in pemphigus, a linear band in pemphigoid, granular papillary IgA in dermatitis herpetiformis.",
        explanation: "An uninterpretable specimen read as negative is the commonest cause of a missed autoimmune blistering diagnosis.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which statement about the level of the split in autoimmune blistering disease is correct?",
        options: [
          "A positive Nikolsky sign indicates a subepidermal split",
          "Pemphigus vulgaris produces an intraepidermal acantholytic split, so blisters are flaccid and heal without scarring",
          "Bullous pemphigoid produces an intraepidermal split",
          "Dermatitis herpetiformis is an intraepidermal split with acantholysis",
        ],
        correctIndex: 1,
        explanation: "Pemphigus vulgaris loses desmoglein 3, so keratinocytes separate within the suprabasal epidermis (acantholysis) and the roof is thin, giving flaccid bullae and a positive Nikolsky sign. Bullous pemphigoid and dermatitis herpetiformis split below the membrane.",
      },
      {
        type: "mcq",
        stem: "A patient of 74 has intensely itchy excoriated vesicles on the extensor surfaces of the elbows and knees and is anaemic. Which disease is most likely, and what treatment helps both the rash and the underlying enteropathy?",
        options: [
          "Bullous pemphigoid, treated with very potent topical steroid alone",
          "Dermatitis herpetiformis, treated with dapsone for the itch and a gluten-free diet for life",
          "Epidermolysis bullosa acquisita, treated with colchicine",
          "Linear IgA disease, treated with sulfapyridine",
        ],
        correctIndex: 1,
        explanation: "Extensor, excoriated, intensely itchy vesicles with anaemia in an older patient indicate dermatitis herpetiformis, a cutaneous manifestation of coeliac disease; dapsone relieves the itch within days and a gluten-free diet treats the enteropathy.",
      },
      {
        type: "mcq",
        stem: "A patient develops a fever with a widespread rash, facial oedema, eosinophilia and raised transaminases six weeks after starting carbamazepine. Which reaction has occurred, and what is the main risk?",
        options: [
          "Morbilliform exanthem, with no risk beyond itch",
          "DRESS — drug reaction with eosinophilia and systemic symptoms; the risk is visceral involvement including hepatitis, nephritis and myocarditis",
          "Acute generalised exanthematous pustulosis, which resolves in 24 hours",
          "Fixed drug eruption, which will recur at the same site on re-exposure",
        ],
        correctIndex: 1,
        explanation: "The long latency of 2 to 8 weeks with fever, facial oedema, eosinophilia and hepatitis is DRESS; visceral involvement and sequelae such as thyroiditis drive the mortality of 5 to 10 per cent, so prednisolone tapered over weeks is usually required.",
      },
      {
        type: "mcq",
        stem: "Which drug is a recognised cause of Stevens-Johnson syndrome and toxic epidermal necrolysis?",
        options: ["Amoxicillin", "Allopurinol", "Metoclopramide", "Amlodipine"],
        correctIndex: 1,
        explanation: "Allopurinol is among the classic triggers, together with sulfonamides, carbamazepine, phenytoin, lamotrigine, nevirapine and oxicam anti-inflammatory drugs. Amoxicillin commonly causes benign morbilliform eruptions but is a much less frequent cause of these severe reactions.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Blistering disease is classified by the level of the split and by the antigen. Pemphigus vulgaris splits within the epidermis against desmoglein 3, starts with painful oral erosions and needs systemic immunosuppression; bullous pemphigoid splits below the membrane against BP180 in the elderly and is treated with very potent topical steroid; dermatitis herpetiformis is IgA in the papillae, extensor, excoriated and gluten dependent. Drug eruptions are diagnosed from the latency window — 4 to 28 days for Stevens-Johnson syndrome, toxic epidermal necrolysis and DRESS — and drug eruptions distinguish by the treatment they forbid, above all in toxic epidermal necrolysis, where the drug must be stopped, the skin is managed like a major burn, and systemic corticosteroids are avoided.",
      },
      {
        type: "paragraph",
        text: "Next: the pigmentary disorders. Melanocyte biology, vitiligo, melasma and post-inflammatory pigment change, and the difference between the depigmented macule that will not respond and the hypopigmented one that will.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------

// LESSON 9 — Pigmentation disorders (fully authored)
// ---------------------------------------------------------------------------
function lesson9() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe melanogenesis, the transfer of melanin to keratinocytes and the fate of the melanosome; classify the Fitzpatrick skin types and explain sun-protection measures by type; recognise vitiligo, distinguish segmental from non-segmental disease, describe its systemic associations and outline its treatment; recognise melasma, distinguish epidermal, dermal and mixed types on Wood lamp examination, and explain photoprotection and the role of the triple-combination cream; recognise post-inflammatory hyper- and hypopigmentation, pityriasis alba and ash dermatosis; and describe the drug- and metal-induced pigmentary states and exogenous ochronosis.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (the melanocyte and the epidermal melanin unit), Lesson 2 (the Wood lamp) and Lesson 6 for post-inflammatory pigment change after eczema.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Melanogenesis",
        text: "The synthesis of melanin from tyrosine within the melanocyte, by tyrosinase converting tyrosine to DOPA and to dopaquinone, and then polymerising it into eumelanin (brown-black) or pheomelanin (red-yellow) inside the melanosome. The melanosome is transferred to neighbouring keratinocytes and carried upwards to be shed with the corneocyte, which is why colour is a dynamic state rather than a fixed deposit.",
      },
      {
        type: "paragraph",
        text: "Because pigment depends on a chain — production in the melanocyte, transfer to the keratinocyte, transport up the epidermis, and eventual shedding — a disorder at any link produces a colour change. Loss of melanocytes produces depigmentation (vitiligo); reduced production gives hypopigmentation (pityriasis alba); increased production and transfer give hyperpigmentation (melasma, lentigines); pigment left behind after inflammation gives post-inflammatory change; and pigment deposited in the dermis from a drug or from a metal is stubborn, because macrophages have no easy route of exit. Ask where in the chain the problem sits, and you will know which disorders are reversible and which are not.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Fitzpatrick phototypes I to VI classify by response to sun rather than by colour, and they matter for two decisions: sun-protection advice and the risk of post-inflammatory hyperpigmentation after any procedure. Types V and VI — brown and black skin — develop visible post-inflammatory pigment change from lesions that are invisible in type I, which is why they should be managed with the least abrasive methods and why ablative lasers are hazardous in them.",
      },

      { type: "heading", level: 2, text: "Vitiligo" },
      {
        type: "table",
        headers: ["Type", "Features"],
        rows: [
          ["Non-segmental (common) vitiligo", "Acquired, sharply demarcated, chalk-white, completely depigmented macules that enlarge, coalesce and often respect a symmetric or acrofacial distribution (around the eyes, mouth, digits, extensor surfaces); the Koebner phenomenon appears at sites of friction or trauma; hair within a lesion may depigment. Fluorescence sharply demarcated under Wood lamp"],
          ["Segmental vitiligo", "A unilateral band following a dermatome or a Blaschko line, appearing in childhood, progressing for about a year and then remaining stable — the type most suitable for surgical repigmentation"],
          ["Universal vitiligo", "Extensive loss over the whole or nearly the whole body, sometimes with a little pigment left at follicles or in a naevus"],
        ],
      },
      {
        type: "paragraph",
        text: "The pathogenesis is a cell-mediated autoimmune destruction of melanocytes, driven by CD8 T cells through interferon-gamma and the CXCL10 pathway, in a genetically susceptible individual; a convergence theory adds oxidative stress, a neural factor and intrinsic melanocyte fragility as contributing elements. The autoimmune links are the clinical point: screen for thyroid disease (Hashimoto thyroiditis, Graves disease) with thyroid function and antibodies, and for pernicious anaemia, type 1 diabetes, Addison disease and alopecia areata, because they travel together.",
      },
      {
        type: "table",
        headers: ["Treatment", "Indication and expectation"],
        rows: [
          ["Topical corticosteroid or topical calcineurin inhibitor", "First-line for limited disease and for the face; a calcineurin inhibitor is preferred on eyelids and facial skin because it does not atrophy. Repigmentation begins at the follicular openings after 3 to 6 months"],
          ["Narrow-band UVB phototherapy", "Second-line for widespread disease, two to three times weekly for 6 months and more in dark-skinned patients; the most reliable medical repigmentation"],
          ["Oral mini-pulse steroids", "Betamethasone or dexamethasone on two consecutive days a week for rapidly progressing disease"],
          ["Surgical transplantation", "Autologous melanocyte suspensions, suction blister grafts or punch grafts, for stable segmental or stable non-segmental disease of more than a year"],
          ["Depigmentation", "Monobenzone or laser for universal or extensive disease, converting residual pigment to a uniform white"],
          ["Camouflage and counselling", "Cosmetic camouflage, self-tanning creams and tattooing of stable lesions, together with the psychological support that is often the most valuable part of care"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating a hypopigmented patch as vitiligo. Vitiligo is depigmented — milk-white and fluorescent on Wood lamp — and complete depigmentation with a lost scale means an absence of melanocytes. Pityriasis alba, pityriasis versicolor, post-inflammatory hypopigmentation and naevus depigmentosus are hypopigmented, not depigmented, and they behave and respond quite differently.",
      },

      { type: "heading", level: 2, text: "Melasma" },
      {
        type: "table",
        headers: ["Feature", "Detail"],
        rows: [
          ["Presentation", "Symmetric, blotchy, brown or grey-brown hyperpigmentation of the face — the centrofacial pattern (forehead, cheeks, upper lip, nose and chin) is commonest, with malar and mandibular alternatives. Almost entirely women of Fitzpatrick types III to VI between 20 and 40"],
          ["Triggers", "Sunlight (the strongest), pregnancy (chloasma, the mask of pregnancy, fading months after delivery), oestrogen-containing contraception and hormone replacement, and genetics; pigment is produced by increased melanocyte activity and increased melanosome transfer into all epidermal layers plus dermal melanophages"],
          ["Wood lamp typing", "Epidermal melasma is enhanced by Wood lamp and responds to treatment; dermal melasma is not enhanced and is largely resistant; mixed melasma is the commonest type in darker skin; in very dark skin lamp examination is uninformative"],
          ["Treatment", "Strict photoprotection with a broad-spectrum high-SPF sunscreen, reapplied and combined with a tinted product containing iron oxides to block visible light; a triple combination of hydroquinone 4 per cent, tretinoin and a moderate topical steroid for 3 to 4 months, then stepping down to hydroquinone alone or to azelaic acid, kojic acid or vitamin C; oral tranexamic acid in selected cases; chemical peels and lasers only with care, because they can worsen the pigmentation in dark skin"],
          ["Counselling", "Recurrence is the rule after stopping, and the goal is control rather than cure; prolonged or unmonitored hydroquinone causes exogenous ochronosis — paradoxical blue-black hyperpigmentation, particularly on the malar prominences of darker-skinned women"],
        ],
      },

      { type: "heading", level: 2, text: "Other pigmentary disorders" },
      {
        type: "table",
        headers: ["Condition", "Mechanism and picture"],
        rows: [
          ["Post-inflammatory hyperpigmentation", "Inflammation in the epidermis spills melanin into the dermis where it is taken up by macrophages; it follows acne, eczema, lichen planus, fixed drug eruptions, herpes and overly aggressive cosmetic procedures, and is worst in pigmented skin. Treated by treating the inflammation, sun protection, and time; topical retinoids, azelaic acid or hydroquinone help"],
          ["Post-inflammatory hypopigmentation and pityriasis alba", "Reduced melanin in an inflamed patch, with ill-defined scaly patches on the faces and arms of atopic children; emollient, mild topical steroid and sun exposure are beneficial"],
          ["Progressive macular hypomelanosis", "Hypopigmented macules on the trunk of young adults with Propionibacterium acnes producing a factor that suppresses melanogenesis; coral-red fluorescence under Wood lamp; treated by topical or oral antimicrobials and ultraviolet exposure"],
          ["Café-au-lait macule", "Uniform light-brown oval patch. Six or more larger than 5 mm before puberty (15 mm after) points to neurofibromatosis type 1; the irregular coast-of-Maine border with bony disease points to McCune-Albright syndrome"],
          ["Freckles and lentigines", "A freckle (ephelis) is increased melanin in the basal layer without increased melanocyte number, and fades in winter; a lentigo has an elongated rete and increased melanocytes, and does not fade. Solar lentigines of the hands and face respond to cryotherapy, laser or retinoid"],
          ["Ash dermatosis and idiopathic guttate hypomelanosis", "Ashy-grey macules on the trunk of darker-skinned adults (the former) and small porcelain-white macules on the shins of the elderly (the latter)"],
          ["Addison disease (adrenal insufficiency)", "Diffuse hyperpigmentation of sun-exposed and pressured skin, with buccal and palmar crease pigmentation and darkening of scars, from excess adrenocorticotrophic hormone peptides"],
          ["Drug- and metal-induced pigmentation", "Minocycline gives blue-grey discoloration of scars and shins and sometimes the sclerae; amiodarone gives slate-grey pigmentation on exposed skin with phototoxicity; clofazimine gives red-brown skin; chloroquine and hydroxychloroquine give grey pigmentation on the pretibial skin with retinopathy; phenothiazines give blue-grey exposed discoloration; silver gives argyria and gold gives chrysiasis; carotenoids in diet or in hypothyroidism give orange palms and soles with sclera spared — and the sparing of the sclera distinguishes carotenoderma from jaundice"],
          ["Exogenous ochronosis", "Paradoxical blue-black hyperpigmentation of the malar skin after prolonged or unmonitored use of hydroquinone or other phenols, particularly in Fitzpatrick types V and VI; avoidable by limiting hydroquinone to fixed courses"],
          ["Poikiloderma of Civatte", "Reticulate erythema and pigmentation of the sides of the neck and cheeks with sparing of the shaded submental triangle, from chronic photodamage in middle-aged women"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Treating melasma with laser as a first-line treatment. Heat in dark skin stimulates the melanocyte and worsens the pigmentation, so laser is a late and cautious option; strictly protected sunscreen, topical agents and patience are the standard of care.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Prescribing hydroquinone indefinitely. Use it in defined courses of 3 to 4 months, monitor and stop, because prolonged use risks exogenous ochronosis — a hyperpigmentation that is far harder to treat than the melasma it replaced.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Missing a systemic cause. Diffuse hyperpigmentation with buccal and crease pigmentation is Addison disease; photosensitivity with lentigines before the age of two is xeroderma pigmentosum; and pigment change with weight change and fatigue is thyroid disease. Vitiligo is not isolated — screen the thyroid, blood count and glucose.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing carotenoderma with jaundice. In carotenoderma the yellow discoloration is on the palms, soles, knees and nasolabial folds and the sclerae are white, whereas jaundice yellowsthe sclerae first and spares the palms. A skin-fold examination costs nothing and settles it.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A patient has the visceral features of adrenal insufficiency. What cutaneous sign would make you suspect Addison disease, and why does it appear?",
        answer: "Diffuse bronze or brown hyperpigmentation, most marked in sun-exposed and pressured skin, with pigmentation of the palmar creases, the buccal mucosa, old scars and the nipples. It occurs because raised adrenocorticotrophic hormone (and related pro-opiomelanocortin peptides) stimulates melanocytes.",
        explanation: "The sign is a manifestation of the endocrine disease outside the gland, which is why it is concentrated where melanocytes are most responsive.",
      },
      {
        type: "question",
        prompt: "Which light examination distinguishes vitiligo from pityriasis alba, and what does each show?",
        answer: "Wood lamp examination at 365 nm. In vitiligo the depigmented lesion becomes a chalky blue-white with a sharply demarcated border, because no melanin remains; pityriasis alba and post-inflammatory hypopigmentation are merely pale and show no fluorescence or only a faint one.",
        explanation: "The lamp measures the melanin content of the epidermis: absence fluoresces, reduction does not, which is how you tell a depigmented from a hypopigmented lesion.",
      },
      {
        type: "question",
        prompt: "Why is a tinted sunscreen recommended over a plain one in melasma?",
        answer: "Melasma is aggravated by visible light as well as by ultraviolet, and the iron oxide pigment in tinted formulations blocks the visible wavelengths that plain organic and mineral filters transmit less effectively. Tinted sunscreens therefore give better melasma control, particularly in Fitzpatrick types III to VI.",
        explanation: "This is the practical difference between an ultraviolet-only and a broad-optical-spectrum sunscreen, and it is why cosmetic camouflage is a legitimate melasma treatment.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which statement about vitiligo is correct?",
        options: [
          "It is hypopigmented, and therefore not visible under a Wood lamp",
          "It is an acquired depigmentation of autoimmune origin, is often symmetric, and repigmentation begins at follicular openings after months of therapy",
          "It is a scaly eruption that improves with antifungal treatment",
          "It is congenital and non-progressive",
        ],
        correctIndex: 1,
        explanation: "Vitiligo is a CD8-mediated autoimmune destruction of melanocytes producing complete depigmentation, visible as chalk-white under Wood lamp, and treatment repigments from surviving follicular melanocytes over 3 to 6 months.",
      },
      {
        type: "mcq",
        stem: "Which finding best supports a diagnosis of melasma?",
        options: [
          "A unilateral dermatomal band of depigmentation",
          "Symmetric, blotchy, brown hyperpigmentation of the forehead, cheeks and upper lip in a pregnant woman, aggravated by sun",
          "Sharply demarcated achromic macules with leucotrichia",
          "Blue-grey pigmentation of old scars after a course of antibiotics",
        ],
        correctIndex: 1,
        explanation: "The symmetric centrofacial pattern in pregnancy, worsened by sun exposure, is melasma (chloasma). The unilateral depigmented band is segmental vitiligo, the achromic macules are vitiligo, and the blue-grey scars are minocycline pigmentation.",
      },
      {
        type: "mcq",
        stem: "A patient develops a diffuse slate-grey discoloration of her scars and shins after a 6-week course of antibiotics for acne. Which drug is most likely responsible?",
        options: ["Doxycycline", "Minocycline", "Amoxicillin", "Erythromycin"],
        correctIndex: 1,
        explanation: "Minocycline deposits in the skin, producing blue-grey pigmentation of scars, shins and sometimes sclerae. Doxycycline photosensitises rather than pigments, and the beta-lactams do not.",
      },
      {
        type: "mcq",
        stem: "Which statement about the management of melasma is correct?",
        options: [
          "Laser is the first-line treatment in dark-skinned patients",
          "Hydroquinone should be continued indefinitely",
          "Strict broad-spectrum sun protection plus a defined course of a triple-combination cream, with counselling about recurrence",
          "Topical corticosteroids alone resolve the pigmentation",
        ],
        correctIndex: 2,
        explanation: "Photoprotection is the foundation, a triple-combination course of 3 to 4 months is the most effective topical therapy, and recurrence after stopping is expected. Lasers can worsen melasma, indefinite hydroquinone risks ochronosis, and steroids alone do not clear pigment.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Pigment disorders are disorders of a chain: production, transfer, transport and shedding. Vitiligo is autoimmune depigmentation, treated with topical anti-inflammatories, narrow-band UVB and, in stable disease, transplantation, and screened for thyroid and other autoimmune disease. Melasma is sun- and hormone-driven hyperpigmentation, managed by strict photoprotection and topical triple combination therapy with strict time limits. Post-inflammatory pigment change is worst in dark skin, drug and metal pigment deposition is permanent, and exogenous ochronosis is the avoidable consequence of too much hydroquinone.",
      },
      {
        type: "paragraph",
        text: "Next: the genodermatoses and the cutaneous signs of HIV. Here the genes are structural proteins of skin, each defect maps to a layer, and the skin lesions are often the first sign of a systemic disease — which is precisely why they must be recognised.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------

// LESSON 10 — Hereditary disorders & HIV skin disease (fully authored)
// ---------------------------------------------------------------------------
function lesson10() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: recognise ichthyosis vulgaris, X-linked, lamellar, congenital ichthyosiform erythroderma, epidermolytic and Netherton ichthyoses by scale type, distribution and associations; recognise the three major subtypes of epidermolysis bullosa and describe the protective care, nutrition, dental and malignancy surveillance they need; recognise the common neurocutaneous syndromes — tuberous sclerosis, neurofibromatosis type 1, Sturge-Weber, incontinentia pigmenti and Darier and Hailey-Hailey disease — by their skin signs; describe the cutaneous manifestations of HIV from seroconversion to late infection, including the infective, inflammatory, neoplastic and drug-induced; and identify the skin findings that should prompt an HIV test.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 8 for the blistering and drug-reaction framework, Lesson 3 and Lesson 4 for the infections seen in immunosuppression, and Lesson 5 for the sexually transmitted background.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Genodermatosis",
        text: "A skin disease caused by an inherited mutation, usually in a structural protein of the epidermis, the dermo-epidermal junction or the melanocyte. Each defective protein maps to a layer, so the gene predicts the blister level, the scale type and the scarring.",
      },
      {
        type: "paragraph",
        text: "The genodermatoses are taught not because they are common but because reading them teaches the architecture of skin. Filaggrin failure gives ichthyosis vulgaris; keratin 1 and 10 failure gives the blistering then verrucous scale of epidermolytic ichthyosis; type VII collagen failure gives the scarring dystrophic epidermolysis bullosa; laminin 332 failure gives the atrophic junctional form. The second idea in this lesson is different in kind: HIV turns ordinary dermatoses into extraordinary ones, and the skin is where the immunosuppression shows. A seborrhoeic dermatitis that will not settle, crusted scabies, multidermatomal zoster, giant molluscum and a Kaposi sarcoma on the palate are all presentations of the same immunological fact.",
      },

      { type: "heading", level: 2, text: "The ichthyoses" },
      {
        type: "table",
        headers: ["Type", "Inheritance and gene", "Scale and associated features"],
        rows: [
          ["Ichthyosis vulgaris", "Autosomal recessive; loss-of-function mutations of filaggrin (FLG)", "Fine, white, fish-like scale on the extensor lower legs in adults, hyperlinear palms and soles, keratosis pilaris, atopy and asthma; improves in humidity and worsens in dry winter air"],
          ["X-linked recessive ichthyosis", "X-linked; steroid sulfatase (ARSL) deficiency", "Large, dark, plate-like scale on the extensor limbs and trunk of boys, sparing the flexures and face, with asymptomatic corneal opacities, cryptorchidism, and a failure to improve with age; a history of delayed maternal labour because oestrogen sulfates are not metabolised"],
          ["Lamellar ichthyosis", "Autosomal recessive; transglutaminase 1 (TGM1) and others", "Collodion membrane at birth giving way to large, plate-like, dark, adherent scale with ectropion, eclabium, scarring alopecia, heat intolerance and thickened nails; the eye signs need ophthalmology"],
          ["Congenital ichthyosiform erythroderma", "Autosomal recessive; several loci", "A generalised fine white scale on a persistent erythematous background with palmoplantar keratoderma and nail dystrophy"],
          ["Epidermolytic ichthyosis", "Autosomal dominant; keratin 1 and keratin 10", "Blistering at birth, then thick, verrucous, cobblestone yellow-brown scale, a strong odour from bacterial colonisation, and recurrent skin infections; the fragile epidermis must be handled gently in the neonatal period"],
          ["Netherton syndrome", "Autosomal recessive; SPINK5 (LEKTI) deficiency", "Congenital erythroderma with failure to thrive, a hair shaft anomaly called trichorrhexis invaginata (bamboo hair) that can be seen under the microscope, severe atopy and food allergy; needs intensive nutrition and infection care"],
          ["Harlequin ichthyosis", "Autosomal recessive; ABCA12 lipid transporter", "Armour-like plates of keratin with deep fissures, ectropion, eclabium, limb contractures and severe neonatal dehydration and sepsis; an intensive care emergency with a poor prognosis"],
          ["Acquired ichthyosis", "Not inherited; appears in adult life", "Always a clue to systemic disease: Hodgkin lymphoma and other malignancy, drugs (nicotinic acid, clofazimine), HIV, sarcoidosis and hypothyroidism"],
        ],
      },
      {
        type: "paragraph",
        text: "The management of every severe ichthyosis is the same in principle: emollient applied generously and frequently, keratolytic agents such as urea 10 per cent, salicylic acid in limited areas only, propylene glycol and bath oils, humidification, avoidance of heat and friction, treatment of the ectropion and the eye, and treatment of the infection that follows fissures. Oral retinoids such as acitretin are effective for lamellar and epidermolytic disease but must be used in specialised care, particularly in epidermolytic ichthyosis where they can increase blistering. Collodion babies need an incubator with high humidity because transepidermal water loss is catastrophic.",
      },

      { type: "heading", level: 2, text: "Epidermolysis bullosa" },
      {
        type: "table",
        headers: ["Type", "Gene and split", "Features"],
        rows: [
          ["EB simplex (epidermal)", "Keratin 5 or 14; cytolysis of the basal layer", "Blistering from trivial friction, worst in heat and humidity; heals without scarring and without milia. Weber-Cockayne is the common form; the most severe is the Dowling-Meara generalised type with oral involvement. Nails usually survive"],
          ["Junctional EB (lamina lucida)", "Laminin 332 (LAMA3, LAMB3, LAMC2) or collagen XVII (COL17A1)", "Blistering and atrophic healing with exuberant granulation tissue, dental enamel defects, laryngeal and respiratory involvement, anaemia and failure to thrive. The Herlitz form is lethal in infancy; the non-Herlitz intermediate form permits survival"],
          ["Dystrophic EB (sublamina densa)", "Type VII collagen (COL7A1), dominant or recessive", "Deeper blistering that heals with scarring and milia; fusion of the digits into a mitten deformity, flexion contractures, oesophageal strictures, corneal erosions, iron-deficiency anaemia, renal amyloid and chronic pain. Recessive dystrophic EB is the severe form"],
          ["Kindler syndrome", "Kindlin 1 (FERMT1)", "Photosensitivity with poikiloderma plus all three levels of blistering, periodontal disease and mucosal stenosis"],
        ],
      },
      {
        type: "paragraph",
        text: "The day-to-day care of epidermolysis bullosa is nursing, not pharmacology: handle the neonate gently rather than lift, avoid adhesive tapes and bandages, use non-adherent silicone dressings, use soft clothing and padded cradles, keep nails short, take analgesia before dressing changes, and see the dietitian early. Swab and treat superficial infection, but reserve systemic antibiotics for clinical infection because repeated courses select resistance. In recessive dystrophic EB, squamous cell carcinoma in a chronic scar is the leading cause of death after childhood, so any non-healing or hyperkeratotic lesion in a scar is biopsied and the skin is reviewed at least annually.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "A neonate with blisters after minor trauma, and a family history, is epidermolysis bullosa — not impetigo and not scalded skin. The immediate errors are adhesive dressings, tape to the face and limbs, vigorous handling and thermal burns, all of which create new bullae. Genetic counselling and prenatal diagnosis are discussed early with the family.",
      },

      { type: "heading", level: 2, text: "Neurocutaneous and other inherited disorders" },
      {
        type: "table",
        headers: ["Syndrome", "Skin signs", "Systemic disease"],
        rows: [
          ["Tuberous sclerosis complex", "Hypomelanotic ash-leaf macules (three or more), confetti-like macules, facial angiofibromas in a butterfly distribution, periungual fibromas, shagreen patches and forehead fibrous plaques", "Cortical tubers causing infantile spasms and learning difficulty, subependymal giant cell astrocytoma, retinal hamartoma, cardiac rhabdomyoma, renal angiomyolipoma and lymphangioleiomyomatosis; mTOR inhibitors treat the visceral disease"],
          ["Neurofibromatosis type 1", "Six or more café-au-lait macules (more than 5 mm before puberty, more than 15 mm after), axillary and inguinal freckling (Crowe sign), cutaneous neurofibromas, and Lisch nodules on the iris", "Optic glioma, sphenoid wing dysplasia, pseudoarthrosis of the tibia, phaeochromocytoma, and malignant peripheral nerve sheath tumours"],
          ["Sturge-Weber syndrome", "A port-wine stain in the ophthalmic (V1) or trigeminal distribution, which thickens and darkens with age", "Ipsilateral leptomeningeal capillary-venous malformation with seizures and hemiparesis, and glaucoma. Early pulsed-dye laser treatment of a facial capillary malformation is the dermatological opportunity"],
          ["Incontinentia pigmenti", "Four stages in lines of Blaschko: linear erythema and vesicles in the newborn, warty verrucous lines, whorled hyperpigmentation, then pale atrophic streaks. Almost entirely female; male conceptuses usually die in utero (NEMO is X-linked)", "Dental anomalies, retinal vascular disease, seizures and developmental delay"],
          ["Darier disease", "Greasy, scaly, skin-coloured or brown papules coalescing in the seborrhoeic distribution of the scalp, nasolabial folds and trunk, with cobblestone oral and nail changes, V-shaped nicking of the nails, palmar pits, and secondary bacterial or herpetic infection", "Worsens by heat, sweat, sun and lithium; acitretin and topical steroids. Autosomal dominant (ATP2A2)"],
          ["Hailey-Hailey disease", "Flaccid vesicles and painful fissured eroded plaques in the axillae, groin and perianal region, with a positive family history", "Autosomal dominant (ATP2C1); managed with topical steroid and antimicrobials, cooling and laser or surgery in refractory disease"],
          ["Pseudoxanthoma elasticum", "Yellowish, plucked-chicken-skin papules in the flexures, with lax skin", "Angioid streaks in the retina, retinal haemorrhage, gastrointestinal bleeding and premature atherosclerosis; ABCC6 mutations"],
          ["Keratosis pilaris", "Follicular keratotic papules on the outer arms and thighs, with perifollicular erythema", "Associated with atopy, ichthyosis vulgaris and an under-methylated FLG state; emollient, urea and keratolytic treatment"],
        ],
      },

      { type: "heading", level: 2, text: "The cutaneous manifestations of HIV" },
      {
        type: "definition",
        term: "HIV-associated skin disease",
        text: "Skin disease that occurs because of the immunodeficiency (infective, neoplastic or inflammatory), because of immune recovery after antiretroviral therapy, or because of the drugs used to treat the virus. Skin is involved in over 90 per cent of people living with HIV at some point.",
      },
      {
        type: "table",
        headers: ["Group", "Manifestations", "Notes"],
        rows: [
          ["Seroconversion", "An acute febrile illness 2 to 6 weeks after infection with a morbilliform exanthem, sore throat, lymphadenopathy, headache and oral or genital ulcers", "The window period: fourth-generation antigen/antibody testing and nucleic acid testing are required, and the diagnosis is frequently missed because the illness looks like glandular fever"],
          ["Infective — common", "Severe or treatment-resistant seborrhoeic dermatitis; oral hairy leukoplakia — corrugated, white, hairy, fixed plaques on the lateral tongue that cannot be scraped off (Epstein-Barr virus); oral candidiasis in all its forms; recurrent or chronic ulcerated herpes simplex; multidermatomal or recurrent herpes zoster; extensive molluscum and warts; tinea of the nails and body; crusted scabies; disseminated cryptococcosis presenting as molluscum-like papules", "Oral hairy leukoplakia is pathognomonic in the right context; crusted scabies in an immunosuppressed resident is an infection-control problem; disseminated fungal papules in a febrile patient need urgent culture"],
          ["Infective — unusual", "Kaposi sarcoma (human herpesvirus 8), bacillary angiomatosis (Bartonella henselae and quintana), disseminated histoplasmosis, penicilliosis, coccidioidomycosis and sporotrichosis, and cutaneous bacillary vasculitis", "Kaposi sarcoma arises as purple, red or vascular-brown patches, plaques and nodules, often on the hard palate, face, trunk and genitals, sometimes in the viscera; it is an AIDS-defining illness and often regresses on antiretroviral therapy"],
          ["Inflammatory", "Seborrhoeic dermatitis and psoriasis, which are more severe and may flare with immune reconstitution; eosinophilic folliculitis — intensely itchy urticarial papules on the trunk, head and neck; pruritic papular eruption of HIV; xerosis; uveitis; and rectal LGV proctitis", "Eosinophilic folliculitis is common at low CD4 counts and responds to antiretroviral therapy, phototherapy or isotretinoin rather than to acne treatment"],
          ["Neoplastic", "Kaposi sarcoma, human papillomavirus-associated anal and vulval intraepithelial neoplasia and carcinoma, cutaneous lymphoma, and increased non-melanoma skin cancer", "The immune control of oncogenic viruses is lost, so screening for anal intraepithelial neoplasia is increasingly routine"],
          ["Drug-induced", "Morbilliform exanthem from co-trimoxazole (very common, and usually manageable); Stevens-Johnson syndrome and toxic epidermal necrolysis and DRESS from nevirapine, abacavir and sulfonamides; lipodystrophy and lipohypertrophy from older antiretrovirals; and hyperpigmentation from zidovudine and emtricitabine", "Screen HLA-B*5701 before abacavir to avoid the hypersensitivity reaction, and counsel the patient that a rash on nevirapine with fever or mucosal involvement is an emergency"],
        ],
      },
      {
        type: "paragraph",
        text: "Antiretroviral therapy changes this list: seborrhoeic dermatitis, oral hairy leukoplakia, Kaposi sarcoma and pruritic papular eruption improve as the CD4 count rises, while tuberculosis or Kaposi sarcoma may transiently worsen with immune reconstitution inflammatory syndrome. The dermatological decision points are therefore — treat the specific disease, start or adjust antiretroviral therapy, screen for hepatitis and other sexually transmitted infection, and never forget that a patient with one opportunistic infection has AIDS-level immunosuppression until proven otherwise.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Diagnosing seborrhoeic dermatitis as a cosmetic problem. In a young patient with severe, new or treatment-resistant seborrhoeic dermatitis — and particularly with oral hairy leukoplakia, oral candidiasis, eosinophilic folliculitis or multidermatomal zoster — an HIV test is indicated before treatment is dismissed as cosmetic.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating crusted scabies as an ordinary outbreak. Hyperkeratotic scabies in an immunosuppressed, debilitated or neurologically impaired patient contains millions of mites, is highly transmissible and requires barrier nursing, isolation, repeated ivermectin and combined topical therapy; it is the classic cause of an institutional outbreak.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Missing a malignant transformation. A purple vascular papule that is a Kaposi sarcoma, a non-healing ulcer in a chronic scar of recessive dystrophic epidermolysis bullosa, and genital warts with intraepithelial neoplasia are all malignancies disguised as skin lesions, and all are easy to dismiss as ordinary dermatoses.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Handling a neonate or an epidermolysis bullosa patient with standard nursing. Adhesive tape, ordinary dressings, lifting rather than supporting, and thermal injury create new bullae and new scars. Support the fragile skin cradle, do not lift from under the arms, and think about dressing design from the first day.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A 28-year-old has intensely itchy papules on the trunk and face that do not respond to acne treatment, together with a persistent seborrhoeic rash. Which diagnosis and which investigation?",
        answer: "Eosinophilic folliculitis of HIV, in a patient with advanced immunosuppression. Take an HIV test with a CD4 count; the eruption responds to antiretroviral therapy itself, and to phototherapy or isotretinoin, rather than to topical acne treatment.",
        explanation: "Eosinophilic folliculitis presents with itchy papules on the head and trunk in patients with low CD4 counts, and its non-response to acne treatment is the diagnostic prompt.",
      },
      {
        type: "question",
        prompt: "A resident of a care home with dementia has thick, crusted, scaling plaques on the hands and nails with only mild itch, and three carers now have an itchy eruption. What is the diagnosis and how is it controlled?",
        answer: "Crusted (Norwegian) scabies with secondary transmission. Isolate the patient, apply a topical scabicide to the whole body including under the nails and to the scalp, repeat the application, and give repeated doses of ivermectin (for example on days 1, 2, 8, 9 and 15), treating all contacts and the environment. The mildly itchy crusts conceal millions of mites.",
        explanation: "Crusted scabies is a public-health diagnosis as much as a dermatological one, and the mild itch is the trap — the lesions look like hyperkeratotic eczema and the infectivity is not appreciated.",
      },
      {
        type: "question",
        prompt: "What skin finding is pathognomonic of a Blaschkoid adult?",
        answer: "A whorled, linear hyperpigmentation along the lines of Blaschko in a woman, the late stage of incontinentia pigmenti, which is X-linked and almost always female. The earlier vesicular and warty stages occur in infancy, and dental, ocular and neurological sequelae should be sought.",
        explanation: "Lines of Blaschko record the pathways of epidermal cell migration in the embryo, so any Blaschkoid pattern means a mosaic condition.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which skin finding most strongly suggests previously undiagnosed HIV infection?",
        options: [
          "A single episode of herpes zoster in a 75-year-old",
          "Oral hairy leukoplakia — a fixed corrugated white plaque on the lateral tongue",
          "Seborrhoeic dermatitis in a teenager",
          "Psoriasis on the elbows and knees",
        ],
        correctIndex: 1,
        explanation: "Oral hairy leukoplakia is an Epstein-Barr virus disease of the immunosuppressed and is strongly associated with HIV, as it occurs essentially only in patients with impaired cell-mediated immunity. Age and common inflammatory diseases do not make the same point.",
      },
      {
        type: "mcq",
        stem: "Which disorder is caused by loss-of-function of filaggrin and produces fine white scale on the extensor legs with atopy?",
        options: [
          "X-linked recessive ichthyosis",
          "Ichthyosis vulgaris",
          "Lamellar ichthyosis",
          "Netherton syndrome",
        ],
        correctIndex: 1,
        explanation: "Ichthyosis vulgaris is an autosomal recessive filaggrin disorder, and the same gene is the strongest risk factor for atopic dermatitis — the same mutation underlies dry scaly skin and eczema. X-linked ichthyosis is steroid sulfatase deficiency with large dark plates and corneal opacities.",
      },
      {
        type: "mcq",
        stem: "A neonate has blisters after minor trauma, heals with scarring and milia, and has fused digits. Which molecular defect is the most likely explanation?",
        options: [
          "Keratin 5 or keratin 14 mutation causing cytolysis of the basal cell",
          "Laminin 332 or collagen XVII mutation causing a lamina lucida split",
          "Type VII collagen mutation causing a split below the lamina densa",
          "ATP2A2 mutation causing suprabasal acantholysis",
        ],
        correctIndex: 2,
        explanation: "Scarring, milia and the mitten deformity from digital fusion are the hallmarks of recessive dystrophic epidermolysis bullosa, in which type VII collagen of the anchoring fibril is defective and the split lies below the lamina densa.",
      },
      {
        type: "mcq",
        stem: "Which statement about HIV-related skin disease is correct?",
        options: [
          "Kaposi sarcoma worsens when antiretroviral therapy is started",
          "Oral hairy leukoplakia is caused by Candida and responds to antifungals",
          "Eosinophilic folliculitis is an intensely itchy papular eruption that responds poorly to acne treatment",
          "Seborrhoeic dermatitis is unassociated with immune status",
        ],
        correctIndex: 2,
        explanation: "Eosinophilic folliculitis of HIV produces intensely itchy monomorphic papules on the trunk, head and neck, usually at low CD4 counts, and responds to antiretroviral therapy rather than to acne therapy. Kaposi sarcoma usually regresses with effective antiretroviral therapy, oral hairy leukoplakia is Epstein-Barr virus and cannot be scraped off, and seborrhoeic dermatitis is a recognised early marker.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The genodermatoses map gene to layer: filaggrin gives ichthyosis vulgaris, keratin 1 and 10 give epidermolytic ichthyosis, laminin 332 gives junctional epidermolysis bullosa, type VII collagen gives the scarring dystrophic form, and ATP2A2 and ATP2C1 give Darier and Hailey-Hailey disease. Their management is nursing and protection — emollients and keratolytics in the ichthyoses, and trauma avoidance, wound care, nutrition and malignancy surveillance in epidermolysis bullosa. The neurocutaneous syndromes announce themselves with macules, angiofibromas, port-wine stains and Blaschkoid lines, and each carries a systemic list to screen for. HIV turns ordinary skin disease into a checklist of opportunistic infection, immunodeficiency-associated inflammation, virus-driven malignancy and drug reaction — and the skin findings that should prompt an HIV test are severe seborrhoeic dermatitis, oral hairy leukoplakia, multidermatomal zoster, crusted scabies, giant molluscum and Kaposi sarcoma.",
      },
      {
        type: "paragraph",
        text: "Next: dermatological emergencies. Toxic epidermal necrolysis, erythroderma, angio-oedema, necrotising fasciitis and rapidly spreading infection — where the skin is the organ that fails, and where the first hour of care is spent on withdrawal, airway, temperature and fluid rather than on diagnosis.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------

// LESSON 11 — Dermatological emergencies (fully authored)
// ---------------------------------------------------------------------------
function lesson11() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: recognise a dermatological emergency in the first minutes of a consultation and name the ones that kill; manage toxic epidermal necrolysis in the first 24 hours, including estimating the body surface area detached and applying SCORTEN; distinguish histaminergic from bradykinin-mediated angio-oedema and manage each airway; manage erythroderma and its fluid, temperature and cardiac consequences; recognise necrotising fasciitis, toxic shock syndrome, meningococcaemia and acute generalised pustular psoriasis; and apply the same initial framework — airway, breathing, circulation, withdrawal of the cause, temperature and fluids — to any of them.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 8 for the vesicobullous diseases, drug reactions and toxic epidermal necrolysis, Lesson 4 and Lesson 10 for infections in the immunosuppressed, and Lesson 6 for eczema and erythroderma.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Dermatological emergency",
        text: "A disease in which the skin is the failing organ rather than a sign, so that failure of its functions — barrier, thermoregulation, fluid retention and immune containment — causes death. The management is therefore the same in every case: airway first, then withdrawal of the cause, then temperature and fluids, then the underlying disease.",
      },
      {
        type: "paragraph",
        text: "The mechanism of death is shared. A skin that has lost its barrier loses litres of water and protein, cannot hold heat, cannot prevent infection and cannot regulate perfusion. That is why toxic epidermal necrolysis is managed like a major burn, why erythrodermic patients go into high-output cardiac failure and temperature failure, and why the principle for a necrotising soft-tissue infection is source control. In every case the first two actions are the same: stop the cause (the drug, the allergen, the tampon) and call for the right unit — burns, intensive care or surgery.",
      },

      { type: "heading", level: 2, text: "The emergencies and their first actions" },
      {
        type: "table",
        headers: ["Emergency", "Red flag", "First action"],
        rows: [
          ["Toxic epidermal necrolysis", "Dusky or purplish painful macules with sheets of epidermal detachment and a positive Nikolsky sign, and mucosal erosions, days to a few weeks after a new drug", "Withdraw the drug and never re-give it; admit to a burns or intensive care unit; estimate the detached surface area; warm the room; fluids, analgesia, nutrition, eye care and monitoring for sepsis"],
          ["Anaphylaxis and angio-oedema", "Urticaria with tongue, lip or laryngeal swelling, wheeze or hypotension; or bradykinin-type swelling with no urticaria and no itch", "Assess the airway and call for help; intramuscular adrenaline for histamine-mediated reactions; stop the angiotensin-converting enzyme inhibitor permanently and manage the bradykinin pathway with a C1 inhibitor concentrate or icatibant"],
          ["Necrotising fasciitis", "Pain out of proportion to the visible skin, oedema beyond the erythema, crepitus, bullae, dusky skin, a greyish dishwater discharge and systemic toxicity", "Resuscitate, give broad-spectrum antibiotics with clindamycin, and call the surgical team for immediate debridement; imaging must not delay the operation"],
          ["Toxic shock syndrome", "Fever with a generalised rash, hypotension and multiorgan involvement, and desquamation of the palms and soles a week or two later", "Remove the source (a tampon, a surgical pack, a foreign body), give a beta-lactam with clindamycin, treat the shock, and consider intravenous immunoglobulin"],
          ["Meningococcaemia", "Fever with a spreading, non-blanching petechial or purpuric rash, meningism or shock", "Do not delay: give parenteral ceftriaxone or benzylpenicillin immediately and transfer; purpura fulminans will need surgical debridement and grafting"],
          ["Severe cutaneous adverse drug reaction", "Facial oedema with a widespread morbilliform rash, fever and eosinophilia (DRESS); or sterile pustules on erythema within 24 hours of a drug (AGEP)", "Withdraw the drug, check liver and renal function, full blood count and cardiac enzymes, and give prednisolone for DRESS; support the mild AGEP and expect desquamation"],
          ["Erythroderma", "Confluent erythema over more than 90 per cent of the body surface with temperature or haemodynamic instability", "Correct fluids and temperature, treat the cause, screen for infection and exclude a cutaneous T-cell lymphoma"],
          ["Acute generalised pustular psoriasis", "Fever with sheets of sterile pustules on fiery erythema, leucocytosis and sometimes hypocalcaemia", "Give ciclosporin or a fast-acting biologic, supportive care, fluids and electrolytes, and treat the trigger"],
          ["Herpes zoster in the immunosuppressed or in the ophthalmic division", "Vesicles on the tip of the nose or forehead, or a disseminated rash in an immunosuppressed patient", "Start oral or intravenous antivirals immediately, refer to ophthalmology for eye disease, and manage the underlying immunosuppression"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "When in doubt, ask three questions of any acute rash: is the skin painful or peeling, are the mucosae involved, and did the patient start a new drug in the last eight weeks? Pain, mucosal involvement and a recent drug together predict toxic epidermal necrolysis and DRESS, and all three demand immediate escalation.",
      },

      { type: "heading", level: 2, text: "Toxic epidermal necrolysis: the burns-unit disease" },
      {
        type: "paragraph",
        text: "Toxic epidermal necrolysis is the most severe cutaneous adverse drug reaction, defined as detachment of more than 30 per cent of the body surface area with mucosal involvement; Stevens-Johnson syndrome is the same disease at less than 10 per cent, and the intermediate form is called the overlap. Mortality rises with the area detached and with age, and the effective treatment is organised supportive care in a burns or intensive care unit over 3 to 4 weeks.",
      },
      {
        type: "table",
        headers: ["SCORTEN risk factor", "Threshold"],
        rows: [
          ["Age", "Over 40 years"],
          ["Heart rate", "Over 120 beats per minute"],
          ["Malignancy", "Any"],
          ["Body surface area detached at presentation", "More than 10 per cent"],
          ["Serum urea", "More than 10 millimoles per litre"],
          ["Serum glucose", "More than 14 millimoles per litre"],
          ["Serum bicarbonate", "Less than 20 millimoles per litre"],
        ],
      },
      {
        type: "paragraph",
        text: "Each factor scores one point; a score of 0 or 1 predicts low mortality, 2 warrants transfer to a burns unit, and 5 or more predicts a mortality over 90 per cent. Estimate the detached surface area with the rule of nines, or use the patient's palm and fingers together as about 1 per cent. The supportive package is a warm room of 28 to 30 degrees to prevent hypothermia, fluid replacement guided by urine output and perfusion (with a urinary catheter), early enteral nutrition, analgesia, gentle handling and non-adherent dressings, thromboprophylaxis, daily eye examination with preservative-free lubricants and ophthalmology input, monitoring for infection without prophylactic antibiotics, and consideration of ciclosporin 3 to 5 mg per kg, intravenous immunoglobulin 2 to 3 g per kg or a tumour necrosis factor inhibitor. Systemic corticosteroids are avoided because they increase sepsis, and thalidomide is contraindicated because it increases mortality.",
      },

      { type: "heading", level: 2, text: "Angio-oedema: two diseases, one airway" },
      {
        type: "table",
        headers: ["Feature", "Histaminergic (mast cell)", "Bradykinin-mediated"],
        rows: [
          ["Presentation", "Urticarial wheals, itch, flushing, sometimes bronchospasm and hypotension", "Non-pitting swelling of the face, lips, tongue and larynx, and of the bowel wall, with pain and colic but no itch and no wheal"],
          ["Causes", "Allergy (food, drug, latex, venom) and physical triggers; most cases are self-limiting", "Angiotensin-converting enzyme inhibitor (any patient at any time after starting), hereditary C1 inhibitor deficiency, and acquired deficiency in lymphoproliferative disease"],
          ["Investigation", "History, examination and tryptase during the episode", "C4 first (low), then C1 inhibitor level and function; consider whenever there is recurrent swelling, abdominal attacks or a family history"],
          ["Management", "Airway, intramuscular adrenaline, oxygen, intravenous antihistamine and hydrocortisone, and withdrawal of the trigger", "Airway; stop the angiotensin-converting enzyme inhibitor permanently and substitute later with caution; C1 inhibitor concentrate, icatibant or ecallantide for attacks; danazol or tranexamic acid for prophylaxis. Adrenaline, antihistamines and corticosteroids do not work"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "In any swelling of the tongue, floor of the mouth or larynx, assess the airway before the rash. Hoarseness, stridor, difficulty swallowing, tongue swelling or a sensation of the throat closing are indications for immediate anaesthetic and ENT involvement — the airway is the only structure that can kill within minutes, and the diagnosis can wait.",
      },

      { type: "heading", level: 2, text: "Erythroderma" },
      {
        type: "paragraph",
        text: "Erythroderma is total skin failure: more than 90 per cent of the surface is red and scaling, with heat loss, a hypermetabolic state, capillary leak with protein loss and oedema, cardiac strain and the risk of secondary infection. The causes are psoriasis (the commonest in the elderly, often from abrupt withdrawal of systemic steroids or methotrexate), atopic and contact dermatitis, drug reactions, cutaneous T-cell lymphoma (Sezary syndrome, which presents with intense itch, alopecia, lymphadenopathy and atypical cells on the blood smear), pityriasis rubra pilaris, and idiopathic cases. Management is admission: keep the room at 28 to 30 degrees to prevent hypothermia, replace fluid and protein losses, monitor the fluid balance carefully because over-resuscitation causes pulmonary oedema, keep the skin moist with emollient and wet wraps, apply a moderate topical corticosteroid or the systemic agent appropriate to the diagnosis, treat infection, watch for high-output failure and thromboembolism, and biopsy and refer if the cause is not obvious — because Sezary syndrome is diagnosed years late when every erythroderma is called eczema.",
      },

      { type: "heading", level: 2, text: "Necrotising soft tissue infection and toxic shock" },
      {
        type: "paragraph",
        text: "Necrotising fasciitis is a surgical diagnosis. Type I is polymicrobial including anaerobes (and includes Fournier gangrene of the perineum), type II is group A streptococcus with or without staphylococcus, and type III is marine Vibrio in a patient with liver disease. The clinical clue is pain disproportionate to the findings, followed by skin necrosis, bullae, crepitus and a greyish dishwater discharge as the infection tracks along fascial planes, in a patient who becomes disproportionately unwell. Computed tomography supports but must not delay the operating theatre: the treatment is urgent resuscitation, broad-spectrum antibiotics with clindamycin to suppress toxin production, and immediate radical debridement with planned re-exploration. Mortality is high, and intravenous immunoglobulin is used in streptococcal toxic shock syndrome. Toxic shock syndrome presents with fever, a generalised macular rash, hypotension, multiorgan dysfunction and late desquamation of the palms and soles from staphylococcal TSST-1 or streptococcal pyrogenic exotoxin; treatment is removal of the source, antibiotics with clindamycin, shock management and immunoglobulin in refractory cases.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Meningococcaemia is a dermatological emergency in disguise: a spreading purpuric rash that does not blanch on pressure, in a febrile and toxic patient, must be treated with parenteral ceftriaxone or benzylpenicillin before any investigation, and purpura fulminans may need surgical debridement and skin grafting.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Continuing a culprit drug to finish the course. In Stevens-Johnson syndrome and toxic epidermal necrolysis every additional dose increases the area detached and the mortality. Stop the drug, document the allergy prominently, and never re-give it or a chemically related agent.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Sending an angio-oedematous patient home without an airway assessment and without checking for an angiotensin-converting enzyme inhibitor. ACE-inhibitor angio-oedema will not respond to adrenaline or antihistamines, and it can occur years after the drug was started.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Over-resuscitating the erythrodermic patient. Erythrodermic skin loses litres of water and protein, but capillary leak makes uncontrolled fluid replacement dangerous: measure the fluid balance, replace the calculated losses and re-evaluate hourly, because both dehydration and pulmonary oedema kill.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Waiting for a computed tomography scan before sending a suspected necrotising fasciitis to theatre. Imaging confirms the decision after the operation; it is not a permission slip before it. Laboratory scores support the clinical decision but do not replace it.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A patient on ramipril for three years develops sudden painless swelling of the lip and tongue with no urticaria and no itch, and now has a hoarse voice. What is happening and what must you do first?",
        answer: "Bradykinin-mediated angio-oedema from the angiotensin-converting enzyme inhibitor — it can occur at any time after starting and will not respond to adrenaline, antihistamines or corticosteroids. The first action is to assess and secure the airway, with immediate anaesthetic and ENT involvement; then stop ramipril permanently, and treat the attack with a C1 inhibitor concentrate or icatibant where available. Withhold angiotensin receptor blockers until angio-oedema has fully resolved, then substitute with the patient's consent.",
        explanation: "The absence of urticaria and itch points to bradykinin, and the airway is the only immediate threat.",
      },
      {
        type: "question",
        prompt: "A patient has confluent erythema over the whole body with fever and a heart rate of 120. What complications are you watching for?",
        answer: "Hypothermia from uncontrolled heat loss (keep the room at 28 to 30 degrees); high-output cardiac failure; dehydration and electrolyte disturbance; capillary leak with hypoalbuminaemia and oedema; a catabolic state requiring early nutrition; secondary bacterial infection and cellulitis; and the underlying cause — which may be psoriasis, dermatitis, a drug or a cutaneous T-cell lymphoma.",
        explanation: "Erythroderma is treated as skin failure, in the same way as a burn, with the cause sought in parallel rather than afterwards.",
      },
      {
        type: "question",
        prompt: "What are the first three actions in a patient with painful dusky macules, a positive Nikolsky sign and oral erosions four days after starting co-trimoxazole?",
        answer: "Withdraw the co-trimoxazole immediately and document it as an allergy; call the burns or intensive care unit; and estimate the detached surface area and calculate fluid requirements, then place the patient in a warm room with early enteral nutrition, eye care and closeness surveillance for sepsis.",
        explanation: "The drug must be stopped, the surface area measured and the unit called before any specific therapy is considered, because mortality is driven by sepsis and fluid loss.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which of the following is NOT part of the standard management of toxic epidermal necrolysis?",
        options: [
          "Warm room of 28 to 30 degrees Celsius to prevent hypothermia",
          "Early enteral nutrition and thromboprophylaxis",
          "High-dose systemic corticosteroids for every patient",
          "Daily eye examination with preservative-free lubricants",
        ],
        correctIndex: 2,
        explanation: "Systemic corticosteroids are avoided in toxic epidermal necrolysis because they increase sepsis and mortality. Specific therapy (ciclosporin, intravenous immunoglobulin or a tumour necrosis factor inhibitor) is selective; the essential care is supportive.",
      },
      {
        type: "mcq",
        stem: "A patient with no urticaria and no itch has recurrent facial and abdominal swelling, and a brother has the same problem. Which investigation confirms the likely diagnosis?",
        options: [
          "Serum tryptase during an episode",
          "C4 level followed by C1 inhibitor level and function",
          "Skin-prick testing to food allergens",
          "Serum histamine and prostaglandin D2 levels",
        ],
        correctIndex: 1,
        explanation: "Recurrent bradykinin angio-oedema without urticaria in a family suggests hereditary C1 inhibitor deficiency; C4 is consumed and falls, and the diagnosis is confirmed by measuring C1 inhibitor level and function. Tryptase and prick testing address mast-cell disease.",
      },
      {
        type: "mcq",
        stem: "Which clinical feature should most urgently raise the possibility of necrotising fasciitis?",
        options: [
          "A well-demarcated, raised, erythematous plaque on the leg with fever",
          "Pain out of proportion to the visible skin, with crepitus and a greyish discharge",
          "An itchy annular plaque with a raised scaly edge on the thigh",
          "A tense bulla on the lower leg in an elderly diabetic",
        ],
        correctIndex: 1,
        explanation: "Pain disproportionate to the visible findings, oedema beyond the erythema, crepitus and a greyish dishwater discharge point to necrotising fasciitis, which needs immediate surgical debridement. The well-demarcated raised plaque is erysipelas, and the annular scaly lesion is tinea.",
      },
      {
        type: "mcq",
        stem: "A patient with erythroderma, high-output cardiac failure and hypothermia should have which of the following?",
        options: [
          "A cold environment and aggressive fluid restriction alone",
          "A room at 28 to 30 degrees, careful fluid replacement guided by urine output, emollients and wet wraps, and identification of the cause",
          "Intravenous antibiotics as routine prophylaxis",
          "Immediate high-dose topical corticosteroid with no other measure",
        ],
        correctIndex: 1,
        explanation: "Erythrodermic skin loses heat, water and protein and strains the heart, so temperature control, measured fluid replacement and barrier restoration plus treatment of the cause are the essentials. Cold and indiscriminate fluid restriction cause hypothermia and renal failure, and routine antibiotics are not indicated.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "A dermatological emergency is one in which skin fails as an organ: the barrier, thermoregulation, fluid retention and immune containment are lost together, and the first moves are always the same. Toxic epidermal necrolysis needs withdrawal of the culprit drug, transfer to a burns unit, SCORTEN, and careful supportive care without systemic corticosteroids; an antibiotic and surgical source control for necrotising infection; adrenaline for histaminergic angio-oedema and a bradykinin pathway treatment for the ACE-inhibitor and hereditary forms; and warmth, fluids and nutrition for erythroderma. The skin signs that predict them — pain, mucosal involvement, a positive Nikolsky sign, a non-blanching rash and a drug started in the last eight weeks — are the ones you must be able to see from the end of the bed.",
      },
      {
        type: "paragraph",
        text: "This is the last lesson of DERM 307. The eleven concepts of this course — structure and function, examination and morphology, the bacterial, fungal, viral and infestational dermatoses, leprosy and the sexually transmitted infections, eczema, the papulosquamous disorders, vesicobullous disease and drug eruptions, pigmentary disorders, the genodermatoses and HIV-related disease, and the emergencies — form the whole of a general dermatology curriculum, and each is assessable by the SBA items in the assessment bank.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------

export const DERMATOLOGY: SubjectSeed = {
  id: "mbbs-dermatology",
  slug: "dermatology",
  title: "Dermatology & Venereology",
  code: "DERM 307",
  department: "Dermatology & Venereology",
  level: 300,
  credits: 3,
  semester: "full",
  description:
    "Skin and venereal disease: morphology and examination, infective dermatoses and infestations, allergic and immune dermatoses, papulosquamous and vesicobullous disorders, leprosy, STDs, HIV skin signs, hereditary disorders and emergencies (AIIMS semesters III, VI–VIII).",
  faculty: "clinical-medicine",
  prereqCourses: ["pathology-cell-injury-repair"],
  modules: [
    { slug: "skin-foundations", title: "M1 — Skin structure, examination & morphology" },
    { slug: "infective-dermatoses", title: "M2 — Infective dermatoses & infestations" },
    { slug: "immune-inflammatory", title: "M3 — Allergic, immune & inflammatory dermatoses" },
    { slug: "specific-emergencies", title: "M4 — Specific disorders & emergencies" },
  ],
  lessons: [
    { title: "Skin structure & function", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Skin structure and function", slug: "skin-structure-function", summary: "Epidermal differentiation, dermal matrix, appendages and the barrier, thermoregulatory and immune functions of skin.", blooms: "understand", minutes: 35, prereq: [] }, content: lesson1() as never },
    { title: "Examination & morphology", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Dermatological examination and morphology", slug: "dermatological-examination-morphology", summary: "Primary and secondary lesions, configuration and distribution, and the descriptive language that drives dermatological diagnosis.", blooms: "apply", minutes: 40, prereq: ["skin-structure-function"] }, content: lesson2() as never },
    { title: "Bacterial & fungal infections", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Bacterial and fungal skin infections", slug: "bacterial-fungal-infections", summary: "Impetigo, folliculitis, cellulitis, dermatophytes and candidiasis — recognition, microscopy and treatment.", blooms: "apply", minutes: 40, prereq: ["dermatological-examination-morphology"] }, content: lesson3() as never },
    { title: "Viral infections & infestations", module: 2, estimatedMinutes: 35, authored: true, concept: { title: "Viral skin infections and infestations", slug: "viral-infections-infestations", summary: "Molluscum, warts, herpes zoster and exanthems; scabies, pediculosis and other infestations.", blooms: "understand", minutes: 35, prereq: ["bacterial-fungal-infections"] }, content: lesson4() as never },
    { title: "Leprosy & STDs", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Leprosy and sexually transmitted diseases", slug: "leprosy-std", summary: "Ridley-Jopling classification, reactions and nerve involvement in leprosy; syphilis, chancroid, gonorrhoea and warts.", blooms: "analyze", minutes: 45, prereq: ["bacterial-fungal-infections"] }, content: lesson5() as never },
    { title: "Eczema & dermatitis", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "Eczema and dermatitis", slug: "eczema-dermatitis", summary: "Atopic, contact, seborrhoeic and stasis dermatitis — distribution patterns, trigger identification and topical management.", blooms: "apply", minutes: 40, prereq: ["dermatological-examination-morphology"] }, content: lesson6() as never },
    { title: "Papulosquamous disorders", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "Papulosquamous disorders", slug: "papulosquamous-disorders", summary: "Psoriasis, pityriasis, lichen planus and pityriasis rosea — scale morphology, systemic associations and stepwise therapy.", blooms: "analyze", minutes: 40, prereq: ["eczema-dermatitis"] }, content: lesson7() as never },
    { title: "Vesicobullous & drug eruptions", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "Vesicobullous disease and drug eruptions", slug: "vesicobullous-drug-eruptions", summary: "Pemphigus, pemphigoid, dermatitis herpetiformis, erythema multiforme, SJS and TEN — immunopathology, biopsy and urgent management.", blooms: "analyze", minutes: 45, prereq: ["papulosquamous-disorders"] }, content: lesson8() as never },
    { title: "Pigmentation disorders", module: 3, estimatedMinutes: 30, authored: true, concept: { title: "Pigmentation disorders", slug: "pigmentation-disorders", summary: "Vitiligo, melasma, post-inflammatory pigment change and photoaging — mechanisms and management options.", blooms: "understand", minutes: 30, prereq: ["eczema-dermatitis"] }, content: lesson9() as never },
    { title: "Hereditary & HIV skin disease", module: 4, estimatedMinutes: 35, authored: true, concept: { title: "Hereditary disorders and HIV skin manifestations", slug: "hereditary-hiv-skin", summary: "Ichthyoses, epidermolysis bullosa and neurocutaneous syndromes; the cutaneous markers of HIV infection.", blooms: "understand", minutes: 35, prereq: ["papulosquamous-disorders"] }, content: lesson10() as never },
    { title: "Dermatological emergencies", module: 4, estimatedMinutes: 35, authored: true, concept: { title: "Dermatological emergencies", slug: "dermatological-emergencies", summary: "Toxic epidermal necrolysis, erythroderma, angio-oedema and rapidly spreading infection — recognition and emergency care.", blooms: "apply", minutes: 35, prereq: ["vesicobullous-drug-eruptions"] }, content: lesson11() as never },
  ],
  sbas: [],
}

export async function seedDermatology(): Promise<void> {
  const counts = await seedMbbsCourse(DERMATOLOGY);
  console.log(`✓ ${DERMATOLOGY.code} ${DERMATOLOGY.title}: ${counts.modules} modules · ${counts.concepts} concepts · ${counts.lessons} lessons · ${counts.items} items`);
}

if (process.argv[1] && (process.argv[1].includes("mbbs/dermatology") || process.argv[1].includes("seed-assessment-dermatology"))) {
  seedDermatology()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
}
