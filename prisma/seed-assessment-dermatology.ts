import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Assessment content — Dermatology (MED 305).
 *
 * 16 original SBA items establishing the Dermatology assessment bank
 * (the spine was seeded 2026-10-24 with zero assessment items), tagged to
 * the existing ConceptNodes (see prisma/seed-university.ts).
 * Covers: skin structure, examination/morphology, bacterial and fungal
 * infection, viral infections and infestations, leprosy and STDs, eczema,
 * papulosquamous disorders, vesicobullous disease and drug eruptions,
 * pigmentation, HIV skin manifestations, dermatological emergencies.
 *
 * Idempotent: upserts on the item slug; safe to re-run. orderIndex starts
 * at 0 because the bank is empty.
 *
 * Governance: every item ships reviewStatus "needs-human-review" — the
 * 2026-10-20 repair established that production rows must never sit at
 * "draft" (42 draft rows drifted live before). needsCheck flags the
 * numeric or distractor reasoning a physician should double-check.
 */

const COURSE_SLUG = "dermatology";

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
  // 1 — Skin structure and function (easy)
  {
    slug: "derm305-stratum-corneum-barrier",
    concept: "skin-structure-function",
    format: "sba",
    stem: "The stratum corneum is the principal permeability barrier of the skin. Which description of its structure and function is correct?",
    options: [
      "It is a bricks-and-mortar layer of anucleate corneocytes embedded in a lipid-rich matrix of ceramides, cholesterol and free fatty acids, with thickness and lipid content varying by body site",
      "It is a single layer of nucleated keratinocytes that divides continuously to generate the remaining epidermal layers",
      "It is composed principally of dermal collagen and elastin with an overlying lipid film secreted by sebaceous glands",
      "It houses the melanocytes that transfer melanin to keratinocytes and therefore determines skin colour and photoprotection",
    ],
    correctAnswer: "It is a bricks-and-mortar layer of anucleate corneocytes embedded in a lipid-rich matrix of ceramides, cholesterol and free fatty acids, with thickness and lipid content varying by body site",
    explanation: "The stratum corneum consists of layers of terminally differentiated, anucleate corneocytes (the bricks) held in a lamellar matrix of ceramides, cholesterol and free fatty acids (the mortar); this combination limits transepidermal water loss and the entry of microbes, allergens and drugs. Because its thickness and lipid composition vary by body site, so does percutaneous penetration — which is why palmar and plantar skin is impermeable while scrotal and eyelid skin absorb agents readily. Continuous mitotic activity occurs in the basal and spinous layers, not in the stratum corneum. Collagen and elastin are dermal constituents, and melanocytes sit at the dermo-epidermal junction rather than in the stratum corneum.",
    difficulty: "easy",
    marks: 1,
  },

  // 2 — Examination and morphology (easy)
  {
    slug: "derm305-macule-versus-papule",
    concept: "dermatological-examination-morphology",
    format: "sba",
    stem: "A patient has a flat, non-palpable circumscribed colour change under 1 cm across, together with a small solid elevated lesion under 1 cm. Which pairing of primary lesion terms is correct?",
    options: [
      "Macule — flat, non-palpable colour change under 1 cm; papule — solid elevated lesion under 1 cm",
      "Macule — flat colour change larger than 1 cm; papule — solid elevated lesion larger than 1 cm",
      "Patch — flat non-palpable change under 1 cm; plaque — any elevated lesion of any size",
      "Macule — fluid-filled cavity under 1 cm; vesicle — palpable solid elevation",
    ],
    correctAnswer: "Macule — flat, non-palpable colour change under 1 cm; papule — solid elevated lesion under 1 cm",
    explanation: "Primary lesion vocabulary is size-defined: a macule is a flat, non-palpable colour change under 1 cm (a patch is the same lesion at 1 cm or larger), and a papule is a solid, elevated lesion under 1 cm (a plaque is a plateau-like elevation over 1 cm, and a nodule a deeper solid mass). Vesicles and bullae are fluid-filled cavities, not solid elevations. Precise description of primary lesions is the first step in generating a differential diagnosis and in communicating findings accurately.",
    difficulty: "easy",
    marks: 1,
  },

  // 3 — Examination and morphology (hard)
  {
    slug: "derm305-nikolsky-sign-interpretation",
    concept: "dermatological-examination-morphology",
    format: "sba",
    stem: "Lateral pressure applied with a finger to normal-appearing skin produces detachment and shearing of the epidermis. Which interpretation of this bedside sign is correct?",
    options: [
      "A positive Nikolsky sign, reflecting intraepidermal loss of adhesion as in pemphigus vulgaris, where blisters are flaccid and rupture easily",
      "A negative Nikolsky sign, which is the expected finding in bullous pemphigoid and therefore the diagnosis must be bullous pemphigoid",
      "A dermal collagen defect, so the sign confirms Ehlers-Danlos syndrome in any patient who is positive",
      "Nikolsky sign has no diagnostic value in the assessment of blistering disease and should be abandoned",
    ],
    correctAnswer: "A positive Nikolsky sign, reflecting intraepidermal loss of adhesion as in pemphigus vulgaris, where blisters are flaccid and rupture easily",
    explanation: "A positive Nikolsky sign (epidermal detachment under lateral shear) indicates loss of adhesion within the epidermis — acantholysis in pemphigus vulgaris produces flaccid, fragile blisters and extensive erosions. In bullous pemphigoid the split is subepidermal at the hemidesmosome, so blisters are tense and the sign is usually negative; the sign localises the level of the split rather than naming a specific disease. A positive sign is not a marker of connective tissue disease, and it remains one of the most useful bedside discriminators between intraepidermal and subepidermal blistering.",
    difficulty: "hard",
    marks: 1,
  },

  // 4 — Bacterial and fungal infections (medium)
  {
    slug: "derm305-impetigo-management",
    concept: "bacterial-fungal-infections",
    format: "sba",
    stem: "A 5-year-old has honey-coloured crusted erosions around the nose and mouth with little surrounding erythema and no systemic upset. Which statement about management is correct?",
    options: [
      "Limited disease is treated with a topical antibiotic such as mupirocin or fusidic acid; extensive, bullous or systemic disease needs an oral antistaphylococcal agent active against Staphylococcus aureus and Streptococcus pyogenes",
      "Oral aciclovir is first-line, because the golden crust indicates herpetic superinfection",
      "Topical corticosteroids alone are sufficient to settle the inflammation and crusting",
      "No antimicrobial treatment is indicated; impetigo always resolves without therapy and antibiotics confer no benefit",
    ],
    correctAnswer: "Limited disease is treated with a topical antibiotic such as mupirocin or fusidic acid; extensive, bullous or systemic disease needs an oral antistaphylococcal agent active against Staphylococcus aureus and Streptococcus pyogenes",
    explanation: "Non-bullous impetigo is a superficial infection with Staphylococcus aureus and/or Streptococcus pyogenes producing golden-crusted erosions, classically on the face of young children; topical mupirocin or fusidic acid treats localised disease while oral flucloxacillin (or a macrolide if penicillin-sensitive) is used when disease is extensive or bullous. Treatment matters because impetigo is highly contagious by direct contact and can spread through households and nurseries, and because it can rarely be followed by cellulitis or post-streptococcal glomerulonephritis. Herpetic lesions are grouped vesicles on an erythematous base and are not crust-limited, and topical steroids alone would worsen an active infection.",
    difficulty: "medium",
    marks: 1,
  },

  // 5 — Bacterial and fungal infections (medium)
  {
    slug: "derm305-tinea-corporis-diagnosis",
    concept: "bacterial-fungal-infections",
    format: "sba",
    stem: "A farmer has an annular, scaly, erythematous plaque with central clearing and a raised, actively scaling advancing edge on the forearm. Which statement is most correct?",
    options: [
      "Tinea corporis — confirmed by potassium hydroxide microscopy of scale from the active edge showing branching septate hyphae",
      "Granuloma annulare — the annular morphology is diagnostic on its own and microscopy is unnecessary",
      "Erythema migrans — treat empirically with 10 days of oral penicillin and test for nothing else",
      "Psoriasis — the scale establishes the diagnosis and the annular shape is coincidental",
    ],
    correctAnswer: "Tinea corporis — confirmed by potassium hydroxide microscopy of scale from the active edge showing branching septate hyphae",
    explanation: "An annular scaly plaque with central clearing and an active, raised scaly border is typical of dermatophyte infection (tinea corporis), and potassium hydroxide microscopy of scale taken from the advancing edge demonstrates branching septate hyphae. The appearance differs from granuloma annulare, which is smooth and non-scaly, and from erythema migrans, which expands rapidly after a tick bite and is not scaly. Oral or topical azoles treat tinea, and inadvertent topical corticosteroids (tinea incognito) suppress inflammation, alter morphology and prolong the infection.",
    difficulty: "medium",
    marks: 1,
  },

  // 6 — Viral infections and infestations (easy)
  {
    slug: "derm305-molluscum-contagiosum",
    concept: "viral-infections-infestations",
    format: "sba",
    stem: "A 6-year-old has multiple discrete 2-4 mm dome-shaped, pearly, umbilicated papules on the trunk, spread over three weeks. Which statement is correct?",
    options: [
      "Molluscum contagiosum — a self-limiting poxvirus infection whose central core shows intracytoplasmic molluscum bodies",
      "Varicella-zoster infection requiring immediate systemic aciclovir even in an immunocompetent child",
      "Scabies, best confirmed by superficial skin biopsy and treated with oral ivermectin alone",
      "A drug eruption requiring immediate withdrawal of the offending agent",
    ],
    correctAnswer: "Molluscum contagiosum — a self-limiting poxvirus infection whose central core shows intracytoplasmic molluscum bodies",
    explanation: "Molluscum contagiosum is a benign, self-limiting poxvirus infection of childhood, presenting as pearly, dome-shaped papules with central umbilication; the diagnosis is clinical, or by expressing the central caseous core which shows large intracytoplasmic (intranuclear is not seen) molluscum bodies. Infection resolves over months as cell-mediated immunity develops, and treatment is optional — cryotherapy, curettage, or topical irritants are used for persistent, extensive or cosmetically significant disease. It is not varicella, which gives a febrile polymorphic vesicular eruption, nor scabies, which is intensely itchy with burrows in web spaces and affects contacts.",
    difficulty: "easy",
    marks: 1,
  },

  // 7 — Viral infections and infestations (medium)
  {
    slug: "derm305-scabies-diagnosis-treatment",
    concept: "viral-infections-infestations",
    format: "sba",
    stem: "A care-home resident has intense nocturnal itch with excoriated papules and linear burrows in the finger web spaces, wrists and genitalia; two household members have also developed itch. Which statement is most correct?",
    options: [
      "Scabies due to Sarcoptes scabiei — confirm by microscopy of mineral-oil burrow scrapings showing mite, ova or scybala, and treat the patient and all close contacts simultaneously with topical permethrin",
      "Atopic eczema — treat with emollients and a potent topical corticosteroid alone",
      "Pediculosis corporis — treat with permethrin applied to clothing and bedding only",
      "Dermatitis herpetiformis — treat with dapsone and a gluten-free diet",
    ],
    correctAnswer: "Scabies due to Sarcoptes scabiei — confirm by microscopy of mineral-oil burrow scrapings showing mite, ova or scybala, and treat the patient and all close contacts simultaneously with topical permethrin",
    explanation: "Intense nocturnal pruritus with papules and linear burrows in web spaces, wrists, waistline and genitalia, plus itching household members, is classic scabies caused by Sarcoptes scabiei var. hominis. Confirmation is by microscopy of scrapings from an intact burrow in mineral oil showing the adult mite, ova or faecal pellets, and management requires whole-body permethrin 5% (or oral ivermectin in crusted or refractory disease) applied to the patient and all close contacts at the same time, with hot laundering of bed linen, because untreated contacts cause reinfestation. Eczema does not transmit between household contacts, and dermatitis herpetiformis gives grouped excoriated vesicles on extensor surfaces.",
    difficulty: "medium",
    marks: 1,
  },

  // 8 — Leprosy and STDs (medium)
  {
    slug: "derm305-tuberculoid-leprosy-patch",
    concept: "leprosy-std",
    format: "sba",
    stem: "A migrant from an endemic region has a single well-defined, hypopigmented, scaly patch with a raised erythematous border that is anaesthetic, plus an enlarged cutaneous nerve nearby. Which statement is most correct?",
    options: [
      "Tuberculoid (paucibacillary) leprosy — few asymmetric, well-defined lesions with early sensory loss, with biopsy showing granulomas and few or no acid-fast bacilli on slit-skin smear",
      "Lepromatous (multibacillary) leprosy — the heavy bacillary load explains the single lesion and demands 24 months of therapy without steroids",
      "Borderline lepromatous leprosy, which by definition always has strongly positive lepromin testing",
      "A type 1 reversal reaction, which is diagnosed when a single patch loses sensation",
    ],
    correctAnswer: "Tuberculoid (paucibacillary) leprosy — few asymmetric, well-defined lesions with early sensory loss, with biopsy showing granulomas and few or no acid-fast bacilli on slit-skin smear",
    explanation: "A single, well-defined, hypopigmented patch with an active raised border, sensory loss and a thickened regional nerve is the pattern of tuberculoid (paucibacillary) leprosy, in which vigorous cell-mediated immunity confines the organism so that slit-skin smears and biopsy show granulomas with few or absent acid-fast bacilli. Lepromatous leprosy is the opposite pole, with symmetric papules, nodules and diffuse infiltration and a heavy bacillary load; the Ridley-Jopling spectrum runs from tuberculoid through borderline forms to lepromatous. Loss of sensation within a skin lesion in a patient from an endemic area is the cardinal clue that separates leprosy from most other hypopigmented patches, and treatment is with WHO multidrug therapy (rifampicin, dapsone and clofazimine).",
    difficulty: "medium",
    marks: 1,
  },

  // 9 — Leprosy and STDs (hard)
  {
    slug: "derm305-primary-syphilis-chancre",
    concept: "leprosy-std",
    format: "sba",
    stem: "A 25-year-old has a painless, indurated, clean-based ulcer on the genitalia with painless rubbery inguinal lymphadenopathy, three weeks after unprotected sex. Which is the most appropriate next step?",
    options: [
      "Dark-ground microscopy of ulcer exudate for Treponema pallidum plus serology, and treat with a single intramuscular dose of benzathine penicillin G 2.4 million units",
      "Empirical oral aciclovir, since most genital ulcers in young adults are herpetic",
      "A urethral swab for Chlamydia trachomatis and azithromycin alone",
      "Oral fluconazole for candidal balanitis and advice on genital hygiene",
    ],
    correctAnswer: "Dark-ground microscopy of ulcer exudate for Treponema pallidum plus serology, and treat with a single intramuscular dose of benzathine penicillin G 2.4 million units",
    explanation: "A painless indurated ulcer (chancre) with non-tender regional lymphadenopathy roughly three weeks after exposure is primary syphilis, caused by the spirochaete Treponema pallidum; dark-ground microscopy of lesion exudate demonstrates motile spirochaetes, with nucleic acid amplification and serology used where microscopy is unavailable. A single intramuscular dose of benzathine penicillin G 2.4 million units is first-line for primary, secondary and early latent syphilis, with doxycycline as the usual alternative in penicillin allergy. Herpetic ulcers are painful grouped vesicles that ulcerate and must be excluded by testing rather than assumed, and all patients with genital ulceration require testing for syphilis, HIV and other sexually transmitted infections.",
    difficulty: "hard",
    marks: 1,
  },

  // 10 — Eczema and dermatitis (medium)
  {
    slug: "derm305-atopic-dermatitis-core-therapy",
    concept: "eczema-dermatitis",
    format: "sba",
    stem: "A child with atopic dermatitis has widespread dry skin, excoriated flexural papules and itch disturbing sleep. Which statement about management is correct?",
    options: [
      "Liberal regular emollients plus short courses of the lowest effective potency topical corticosteroid for flares, with trigger avoidance and education on quantity and technique",
      "Prolonged high-potency topical corticosteroid monotherapy with no emollient use",
      "Oral aciclovir as first-line therapy for the excoriated papules",
      "Systemic corticosteroids for every flare regardless of severity",
    ],
    correctAnswer: "Liberal regular emollients plus short courses of the lowest effective potency topical corticosteroid for flares, with trigger avoidance and education on quantity and technique",
    explanation: "Atopic dermatitis management rests on generous, frequent emollients to restore the defective epidermal barrier, combined with short courses of topical corticosteroids matched to the site, severity and body habitus, using topical calcineurin inhibitors as steroid-sparing agents for the face and flexures. Potent topical steroids should be used for limited periods on thin-skinned areas because of atrophy, striae and systemic absorption risk, and systemic corticosteroids are reserved for exceptional severe flares because of rebound. Sedating antihistamines may help sleep but do not treat the inflammation, and antibiotics are indicated only for clinical infection such as weeping, pustules or crusting.",
    difficulty: "medium",
    marks: 1,
  },

  // 11 — Papulosquamous disorders (medium)
  {
    slug: "derm305-plaque-psoriasis-features",
    concept: "papulosquamous-disorders",
    format: "sba",
    stem: "A patient has well-demarcated salmon-pink plaques with thick silvery scale on extensor surfaces and the scalp, with nail pitting and onycholysis. Which statement best describes the disease and its pathophysiology?",
    options: [
      "Plaque psoriasis — a T-cell mediated inflammatory dermatosis with markedly accelerated epidermal turnover, treated with topical vitamin D analogues and corticosteroids, phototherapy, methotrexate, ciclosporin or biologics for moderate-to-severe disease",
      "Seborrhoeic dermatitis — a Malassezia-driven dermatosis that is confined to seborrhoeic areas and never affects nails",
      "Pityriasis rosea — a self-limiting post-viral exanthem with a herald patch and collarette of scale",
      "Tinea corporis — a dermatophyte infection that potassium hydroxide microscopy would confirm",
    ],
    correctAnswer: "Plaque psoriasis — a T-cell mediated inflammatory dermatosis with markedly accelerated epidermal turnover, treated with topical vitamin D analogues and corticosteroids, phototherapy, methotrexate, ciclosporin or biologics for moderate-to-severe disease",
    explanation: "Well-demarcated, salmon-pink plaques with thick silvery scale on extensor surfaces, the scalp and the nails (pitting, oil-drop discolouration, onycholysis) are characteristic of plaque psoriasis, an immune-mediated disease driven by IL-23/Th17 inflammation with abnormally rapid epidermal turnover. Treatment is graded by extent and impact: emollients with topical corticosteroids and vitamin D analogues, phototherapy, and systemic agents such as methotrexate, ciclosporin or acitretin, with biologics (TNF, IL-17, IL-23 inhibitors) for moderate-to-severe disease. Auspitz sign (pinpoint bleeding when scale is lifted) and the Koebner phenomenon support the diagnosis, whereas seborrhoeic dermatitis produces greasy scale on seborrhoeic areas without nail pitting.",
    difficulty: "medium",
    marks: 1,
  },

  // 12 — Vesicobullous disease and drug eruptions (hard)
  {
    slug: "derm305-pemphigus-vulgaris-autoantigen",
    concept: "vesicobullous-drug-eruptions",
    format: "sba",
    stem: "A 55-year-old has painful oral erosions followed by flaccid bullae that rupture to leave large denuded areas, and pressure on the blister edge extends the erosion. Which diagnosis and immunopathological mechanism are correct?",
    options: [
      "Pemphigus vulgaris — IgG autoantibodies against desmoglein 3 (with desmoglein 1 in mucocutaneous disease) causing intraepidermal acantholysis and a positive Nikolsky sign",
      "Bullous pemphigoid — IgG against hemidesmosomal BP180 and BP230 producing tense subepidermal blisters",
      "Dermatitis herpetiformis — granular IgA deposition in the dermal papillae producing excoriated pruritic vesicles",
      "Epidermolysis bullosa acquisita — IgG against type VII collagen giving mechanobullous subepidermal blisters",
    ],
    correctAnswer: "Pemphigus vulgaris — IgG autoantibodies against desmoglein 3 (with desmoglein 1 in mucocutaneous disease) causing intraepidermal acantholysis and a positive Nikolsky sign",
    explanation: "Painful mucosal erosions with flaccid, easily ruptured bullae, widespread denudation and a positive Nikolsky sign indicate pemphigus vulgaris, in which IgG autoantibodies to desmoglein 3 (and desmoglein 1 when there is mucocutaneous involvement) disrupt desmosomal adhesion and cause intraepidermal acantholysis. Direct immunofluorescence of perilesional skin shows intercellular IgG and C3 in a fish-net pattern, distinguishing it from the linear basement-membrane staining of bullous pemphigoid, in which blisters are tense and Nikolsky sign is usually negative. Both are autoimmune blistering diseases requiring high-dose systemic immunosuppression with corticosteroids plus steroid-sparing agents.",
    difficulty: "hard",
    marks: 1,
    needsCheck: true, // desmoglein 3/1 distribution by mucosal vs mucocutaneous disease
  },

  // 13 — Vesicobullous disease and drug eruptions (hard)
  {
    slug: "derm305-sjs-ten-management",
    concept: "vesicobullous-drug-eruptions",
    format: "sba",
    stem: "Ten days after starting carbamazepine, a patient develops painful dusky macules, blistering and sheet-like epidermal detachment with erosions of the lips, eyes and genitalia, involving about 25% of body surface area. Which statement is correct?",
    options: [
      "Stevens-Johnson syndrome/toxic epidermal necrolysis spectrum — withdraw the culprit drug immediately and admit to a specialist burns or intensive care unit for supportive care",
      "Continue the culprit drug at a lower dose with oral antihistamines, since the eruption is only a hypersensitivity rash",
      "Staphylococcal scalded skin syndrome — treat with intravenous flucloxacillin and topical fusidic acid",
      "Rechallenge with the drug after topical corticosteroids to confirm the diagnosis",
    ],
    correctAnswer: "Stevens-Johnson syndrome/toxic epidermal necrolysis spectrum — withdraw the culprit drug immediately and admit to a specialist burns or intensive care unit for supportive care",
    explanation: "A febrile morbilliform eruption progressing to dusky targetoid lesions, blistering, sheet-like epidermal detachment and two-site mucosal involvement after starting a high-risk drug (aromatic anticonvulsants, allopurinol, sulfonamides) is the SJS/TEN spectrum, with SJS involving less than 10% of body surface area, SJS-TEN overlap 10-30% and TEN above 30%. The essential steps are immediate withdrawal of the culprit drug and transfer to a burns or intensive care unit for fluid, wound, airway and eye management, with consideration of immunomodulating therapy; mortality is substantial and delay in withdrawal is the main modifiable factor. Staphylococcal scalded skin syndrome is a superficial staphylococcal disease of young children with periorificial blistering and no mucosal involvement, and rechallenge with the culprit drug is absolutely contraindicated.",
    difficulty: "hard",
    marks: 1,
    needsCheck: true, // BSA cut-offs: SJS <10%, overlap 10-30%, TEN >30%
  },

  // 14 — Pigmentation disorders (easy)
  {
    slug: "derm305-vitiligo-wood-lamp",
    concept: "pigmentation-disorders",
    format: "sba",
    stem: "A 25-year-old has well-demarcated, non-scaly depigmented macules and patches on the hands and periorificial skin that fluoresce bright blue-white under Wood's lamp examination. Which is the most likely diagnosis?",
    options: [
      "Vitiligo — acquired autoimmune loss of melanocytes producing sharply defined depigmented patches that are accentuated under Wood's lamp",
      "Pityriasis versicolor — a Malassezia infection that fluoresces yellow-green and has fine scale",
      "Pityriasis alba — ill-defined, slightly scaly hypopigmented patches in children",
      "Tinea corporis — a dermatophyte infection with an active scaly advancing border",
    ],
    correctAnswer: "Vitiligo — acquired autoimmune loss of melanocytes producing sharply defined depigmented patches that are accentuated under Wood's lamp",
    explanation: "Sharply demarcated, completely depigmented (not merely hypopigmented), non-scaly patches in a young adult indicate vitiligo, an autoimmune destruction of melanocytes that is frequently associated with thyroid and other autoimmune disease. Wood's lamp examination accentuates the chalk-white patches and is the standard bedside method for distinguishing vitiligo from hypopigmented mimics such as pityriasis alba (ill-defined, slightly scaly, in children) and tinea versicolor (fine scale with yellow-green fluorescence and hyphae and spores on potassium hydroxide microscopy). Management aims at repigmentation with potent topical corticosteroids or calcineurin inhibitors for limited disease and phototherapy for extensive disease.",
    difficulty: "easy",
    marks: 1,
  },

  // 15 — Hereditary disorders and HIV skin manifestations (medium)
  {
    slug: "derm305-kaposi-sarcoma-hiv",
    concept: "hereditary-hiv-skin",
    format: "sba",
    stem: "A patient with newly diagnosed HIV has painless violaceous to brown macules, papules and nodules on the hard palate, trunk and lower legs. Which statement is most correct?",
    options: [
      "Kaposi sarcoma — a vascular tumour driven by human herpesvirus 8 in the setting of immunosuppression, and an AIDS-defining illness",
      "Bacillary angiomatosis — a Bartonella infection that would respond dramatically to erythromycin",
      "Molluscum contagiosum — a poxvirus infection that is also common in HIV but never involves the palate",
      "Cutaneous cryptococcosis — should be confirmed by India ink staining and treated with amphotericin B",
    ],
    correctAnswer: "Kaposi sarcoma — a vascular tumour driven by human herpesvirus 8 in the setting of immunosuppression, and an AIDS-defining illness",
    explanation: "Violaceous or brown macules, papules and nodules on mucocutaneous sites in an immunosuppressed patient are characteristic of Kaposi sarcoma, a vascular tumour caused by human herpesvirus 8 (HHV-8) that is an AIDS-defining condition and also occurs in transplant recipients and other immunosuppressed states. Diagnosis is confirmed by biopsy showing a spindle-cell proliferation with slit-like vascular spaces and HHV-8 (LANA-1) positivity, and treatment is antiretroviral therapy together with local or systemic therapy depending on extent. Bacillary angiomatosis also produces vascular lesions in advanced HIV but is a Bartonella infection with organisms on Warthin-Starry staining, and molluscum lesions are pearly and umbilicated rather than violaceous.",
    difficulty: "medium",
    marks: 1,
  },

  // 16 — Dermatological emergencies (hard)
  {
    slug: "derm305-ace-inhibitor-angioedema",
    concept: "dermatological-emergencies",
    format: "sba",
    stem: "A patient taking ramipril develops sudden swelling of the lips, tongue and floor of the mouth with voice change and drooling, without urticaria and without any response to antihistamines. What is the priority?",
    options: [
      "ACE-inhibitor induced bradykinin-mediated angioedema — assess and protect the airway, stop the ACE inhibitor permanently, and escalate to emergency airway management if there is any progression",
      "Histaminergic allergic angioedema — give intramuscular adrenaline and antihistamines, then continue the drug with cover",
      "Facial cellulitis — start intravenous flucloxacillin and reassess in the morning",
      "Hypothyroidism causing macroglossia — start levothyroxine and observe overnight",
    ],
    correctAnswer: "ACE-inhibitor induced bradykinin-mediated angioedema — assess and protect the airway, stop the ACE inhibitor permanently, and escalate to emergency airway management if there is any progression",
    explanation: "ACE inhibitors raise bradykinin levels and produce angioedema that is classically non-urticarial, without itch, and unresponsive to antihistamines, corticosteroids or adrenaline, most often affecting the lips, tongue and upper airway. Because obstruction can progress rapidly, the priority is immediate airway assessment with early involvement of anaesthesia or ENT for difficult airway, together with permanent withdrawal of the ACE inhibitor and avoidance of the whole class. This distinguishes it from histaminergic angioedema, which carries urticaria and responds to adrenaline and antihistamines, and from facial cellulitis, which is febrile and tender with advancing erythema.",
    difficulty: "hard",
    marks: 1,
  },
];

async function seedAssessmentDermatology() {
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
        orderIndex: 0 + i,
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
        orderIndex: 0 + i,
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

  console.log(`✓ Dermatology assessment items: ${count} items (marks 1, needs-human-review)`);
}

// CLI usage: npx ts-node prisma/seed-assessment-dermatology.ts
if (process.argv[1] && process.argv[1].includes("seed-assessment-dermatology")) {
  seedAssessmentDermatology()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}

export { seedAssessmentDermatology, ITEMS as DERMATOLOGY_ITEMS };
