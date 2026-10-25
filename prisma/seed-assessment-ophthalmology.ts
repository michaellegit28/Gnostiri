import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Assessment content — Ophthalmology.
 *
 * 16 original SBA items seeding the Ophthalmology bank from 0 to 16,
 * tagged to the existing ConceptNodes (see prisma/seed-university.ts).
 * Spans the whole spine: ocular microbiology/pathology, symptomatology
 * and refraction, systemic disease and the eye, lids/lacrimal/conjunctiva,
 * cornea/sclera/uveitis, lens and cataract, glaucoma, retinopathies and
 * retinal detachment, optic nerve and squint, ocular emergencies/minor
 * surgery, and the national blindness programme / eye banking.
 *
 * Idempotent: upserts on the item slug; safe to re-run. orderIndex starts
 * at 0 because the course had no assessment items before this file.
 *
 * Governance: every item ships reviewStatus "needs-human-review" — the
 * 2026-10-20 repair established that production rows must never sit at
 * "draft" (42 draft rows drifted live before). needsCheck flags the numeric
 * or distractor reasoning a clinician should double-check.
 */

const COURSE_SLUG = "ophthalmology";

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
  // 1 — Ocular microbiology and pathology (easy)
  {
    slug: "oph201-bacterial-keratitis-contact-lens",
    concept: "ocular-microbiology-pathology",
    format: "sba",
    stem: "A soft contact lens wearer who slept in her lenses overnight presents with a painful red eye and a greyish corneal infiltrate with an overlying ulcer. Which organism is the most likely cause and what is the appropriate management?",
    options: [
      "Pseudomonas aeruginosa — stop lens wear, scrape the ulcer for microscopy and culture, and start intensive topical fluoroquinolone antibiotic every 30-60 minutes",
      "Staphylococcus epidermidis — topical corticosteroid with a broad-spectrum antibiotic for five days, continuing lens wear",
      "Acanthamoeba species — oral antiprotozoal therapy alone with observation for two weeks",
      "Herpes simplex virus — topical corticosteroid to reduce corneal inflammation, with no antibiotic cover",
    ],
    correctAnswer: "Pseudomonas aeruginosa — stop lens wear, scrape the ulcer for microscopy and culture, and start intensive topical fluoroquinolone antibiotic every 30-60 minutes",
    explanation: "Overnight wear of soft lenses is the classic risk factor for Pseudomonas aeruginosa bacterial keratitis, which produces a rapidly progressing grey infiltrate and can perforate within days. Management is to discontinue lens use immediately, obtain corneal scrapings for Gram stain and culture, and give intensive topical fluoroquinolone (fortified aminoglycoside/cephalosporin in severe cases). Steroids are avoided initially in suspected infection; Acanthamoeba follows water exposure with severe out-of-proportion pain; herpes keratitis shows a dendritic stain.",
    difficulty: "easy",
    marks: 1,
    needsCheck: false,
  },

  // 2 — Symptomatology and refraction (easy)
  {
    slug: "oph201-myopia-concave-lenses",
    concept: "symptomatology-refraction",
    format: "sba",
    stem: "A schoolchild can see clearly at 20 cm but complains of headaches at the board. Which correction is appropriate for myopia, and what does a pinhole test tell you?",
    options: [
      "Concave (minus, diverging) spherical lenses move the focal point back onto the retina, and a pinhole improves vision in uncomplicated refractive blur",
      "Convex (plus, converging) spherical lenses move the focal point back onto the retina, and a pinhole worsens vision in refractive blur",
      "Cylindrical (toric) lenses alone correct spherical refractive error, and a pinhole is contraindicated in children",
      "Myopia is corrected surgically only, and a pinhole distinguishes presbyopia from axial elongation",
    ],
    correctAnswer: "Concave (minus, diverging) spherical lenses move the focal point back onto the retina, and a pinhole improves vision in uncomplicated refractive blur",
    explanation: "Myopia arises from excessive axial length or refractive power, so the image focuses in front of the retina and is corrected with concave (minus) spherical lenses that diverge light before it enters the eye. A pinhole improves acuity in uncorrected or poorly corrected refractive blur by increasing depth of focus, but it does not improve vision from retinal or optic nerve disease. Plus lenses converge light for hypermetropia, and toric lenses only correct regular astigmatism.",
    difficulty: "easy",
    marks: 1,
  },

  // 3 — Systemic disease and the eye (medium)
  {
    slug: "oph201-thyroid-eye-disease",
    concept: "systemic-disease-eye",
    format: "sba",
    stem: "A 45-year-old woman has several months of bilateral proptosis, conjunctival injection, lid retraction with upper lid lag, and vertical diplopia on attempted upgaze. There is no diurnal variation and no ptosis. Which diagnosis fits best?",
    options: [
      "Thyroid eye disease (Graves' orbitopathy) — an autoimmune restrictive ophthalmopathy caused by TSH-receptor antibody-mediated orbital inflammation and fibrosis",
      "Myasthenia gravis — fatigable ophthalmoplegia with ptosis that typically worsens towards the evening",
      "Carotid-cavernous fistula — pulsatile proptosis with an orbital bruit and arterialised conjunctival vessels",
      "Orbital cellulitis — acute painful febrile proptosis with impaired ocular movements in a single eye",
    ],
    correctAnswer: "Thyroid eye disease (Graves' orbitopathy) — an autoimmune restrictive ophthalmopathy caused by TSH-receptor antibody-mediated orbital inflammation and fibrosis",
    explanation: "Thyroid eye disease is the commonest cause of both unilateral and bilateral proptosis in adults, driven by TSH-receptor antibodies that stimulate orbital fibroblasts and expand the orbital fat and extraocular muscles. It produces proptosis, lid retraction, lid lag, conjunctival injection and a restrictive ophthalmoplegia — elevation and abduction are classically limited. Myasthenia gives fatigable ptosis and ophthalmoplegia without proptosis; carotid-cavernous fistula gives pulsatile proptosis with a bruit; orbital cellulitis is acute, febrile and painful.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false,
  },

  // 4 — Lids, lacrimal system and conjunctiva (medium)
  {
    slug: "oph201-congenital-nldo",
    concept: "lids-lacrimal-conjunctiva",
    format: "sba",
    stem: "A 7-month-old has persistent watering of the eye with recurrent tears but no photophobia, no blepharospasm and no corneal enlargement. Both puncta overflow when pressure is applied over the lacrimal sac. What is the most likely diagnosis and correct initial management?",
    options: [
      "Congenital nasolacrimal duct obstruction from failure of canalisation — manage initially with lacrimal sac massage, deferring syringing/probing until about 12 months if symptoms persist",
      "Congenital glaucoma — measure intraocular pressure under anaesthesia and perform urgent goniotomy",
      "Bacterial conjunctivitis — topical antibiotics together with nasolacrimal duct probing",
      "Microphthalmos with a corneal opacity — urgent penetrating keratoplasty",
    ],
    correctAnswer: "Congenital nasolacrimal duct obstruction from failure of canalisation — manage initially with lacrimal sac massage, deferring syringing/probing until about 12 months if symptoms persist",
    explanation: "Congenital nasolacrimal duct obstruction is caused by failure of the distal duct to canalise, and presents in the first weeks of life with epiphora and reflux of tears or mucopus on pressure over the sac, sparing the cornea. Most cases resolve spontaneously within the first year, so treatment begins with lacrimal sac (Crigler) massage and hygiene, moving to probing when epiphora persists beyond about 12 months. Absence of photophobia, blepharospasm, corneal enlargement or photophobia makes congenital glaucoma — a true ocular emergency — unlikely.",
    difficulty: "medium",
    marks: 1,
  },

  // 5 — Cornea, sclera and uveitis (medium)
  {
    slug: "oph201-acute-anterior-uveitis",
    concept: "cornea-sclera-uveitis",
    format: "sba",
    stem: "A patient with known ankylosing spondylitis develops a deeply injected, painful, photophobic eye. Slit-lamp examination shows cells and flare in the anterior chamber, keratic precipitates on the inferior corneal endothelium, and a small irregularly shaped pupil that responds sluggishly. What is the most appropriate treatment?",
    options: [
      "Topical corticosteroid plus a cycloplegic agent such as homatropine or atropine — dilatation relieves ciliary spasm and prevents posterior synechiae",
      "Topical corticosteroid alone with pilocarpine to constrict the pupil and rest the iris",
      "Acyclovir ointment five times daily with a topical fluoroquinolone",
      "Oral acetazolamide and topical pilocarpine, as for an acute pressure rise",
    ],
    correctAnswer: "Topical corticosteroid plus a cycloplegic agent such as homatropine or atropine — dilatation relieves ciliary spasm and prevents posterior synechiae",
    explanation: "The findings are those of acute anterior uveitis (iritis): ciliary flush, cells and flare, keratic precipitates and a small sluggish pupil, strongly associated with HLA-B27 spondyloarthropathies. Treatment is intensive topical corticosteroid to suppress the inflammation, combined with a mydriatic/cycloplegic (homatropine, atropine) that relieves pain, prevents posterior synechiae and reduces complications. Pilocarpine is avoided because it worsens synechiae and ciliary spasm; antivirals treat herpetic keratitis and acetazolamide treats angle closure.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false,
  },

  // 6 — Cornea, sclera and uveitis (medium)
  {
    slug: "oph201-fungal-keratitis",
    concept: "cornea-sclera-uveitis",
    format: "sba",
    stem: "A farmer has had a progressively painful eye for three weeks after injury from a thorn. The cornea has a dry, grey-white elevated lesion with feathery margins, a small hypopyon, and satellite infiltrates. Which diagnosis and treatment are correct?",
    options: [
      "Filamentous fungal keratitis (commonly Fusarium or Aspergillus) — send a corneal scraping for KOH wet mount and culture and start intensive topical natamycin 5%",
      "Bacterial contact lens keratitis — fortified topical cefazolin and gentamicin hourly for 48 hours",
      "Herpes simplex dendritic keratitis — topical aciclovir with debridement of the epithelium",
      "Acanthamoeba keratitis — topical chlorhexidine and polyhexamethylene biguanide, after fresh water exposure",
    ],
    correctAnswer: "Filamentous fungal keratitis (commonly Fusarium or Aspergillus) — send a corneal scraping for KOH wet mount and culture and start intensive topical natamycin 5%",
    explanation: "Fungal keratitis typically follows trauma with vegetable matter or sticks, and its classic signs are a dry grey elevated plaque with feathery margins, satellite lesions and a hypopyon that is often disproportionately large. Diagnosis rests on corneal scrapings stained with KOH (or calcofluor white) and culture, and the first-line therapy for filamentous fungi is topical natamycin 5%; topical amphotericin B is preferred for yeast keratitis. Steroids must be avoided. Unlike Acanthamoeba, the history is not contaminated water and the pain is not out of proportion to signs.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false,
  },

  // 7 — Lens and cataract (easy)
  {
    slug: "oph201-phacoemulsification-iol",
    concept: "lens-cataract",
    format: "sba",
    stem: "A 65-year-old has a best-corrected visual acuity of 6/36 with glare and difficulty reading, due to a dense nuclear cataract in an otherwise healthy eye. What is the modern standard surgical treatment?",
    options: [
      "Small-incision cataract extraction with phacoemulsification (ultrasound emulsification) and implantation of an intraocular lens into the capsular bag",
      "Intracapsular removal of the entire lens with an anterior chamber intraocular lens sutured to the angle",
      "Topical antioxidants and eye drops to dissolve the lens opacity, with review only when vision reaches 6/60",
      "Laser iridotomy to restore the visual axis without lens extraction",
    ],
    correctAnswer: "Small-incision cataract extraction with phacoemulsification (ultrasound emulsification) and implantation of an intraocular lens into the capsular bag",
    explanation: "Cataract surgery no longer waits for maturity: the indication is visual impairment affecting the patient's life. The standard technique is phacoemulsification, in which an ultrasonic probe emulsifies the nucleus through a small self-sealing incision and a foldable intraocular lens is placed in the capsular bag, giving rapid visual rehabilitation with sutures usually unnecessary. Intracapsular extraction with anterior chamber lenses is historical and carries greater complications; medical therapy does not dissolve a cataract, and iridotomy treats angle closure rather than cataract.",
    difficulty: "easy",
    marks: 1,
  },

  // 8 — Lens and cataract (medium)
  {
    slug: "oph201-steroid-subcapsular-cataract",
    concept: "lens-cataract",
    format: "sba",
    stem: "Which type of cataract is characteristically induced by long-term systemic corticosteroid therapy, and why is it particularly visually disabling?",
    options: [
      "A posterior subcapsular cataract — it lies at the nodal point of the eye close to the pupil, so it scatters light and produces marked glare and loss of near vision early",
      "Nuclear sclerosis — it produces a myopic shift and colour change that responds well to plus lenses",
      "Cortical spoke-like opacification — posterior subcapsular change only occurs with diabetic disease",
      "Anterior polar cataract — steroid deposits appear at the anterior capsule and are present at birth",
    ],
    correctAnswer: "A posterior subcapsular cataract — it lies at the nodal point of the eye close to the pupil, so it scatters light and produces marked glare and loss of near vision early",
    explanation: "Corticosteroids — systemic, inhaled, or topical ocular — classically produce a posterior subcapsular cataract, a granular opacity just in front of the posterior capsule. Because it sits directly at the nodal point of the eye behind the pupil, it scatters light heavily and causes disproportionate glare and loss of near vision even when Snellen acuity looks tolerable. Nuclear sclerosis is an age-related change producing myopic shift, cortical opacities give spoke-like spoke wedge changes, and anterior polar cataract is congenital.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false,
  },

  // 9 — Glaucoma (medium)
  {
    slug: "oph201-poag-perimetry",
    concept: "glaucoma",
    format: "sba",
    stem: "An asymptomatic 60-year-old has intraocular pressures of 24-26 mmHg bilaterally, enlarged cup-to-disc ratios with superior and inferior polar notching, and visual field testing showing an arcuate (Bjerrum) scotoma and a nasal step. Which diagnosis does this pattern indicate?",
    options: [
      "Primary open-angle glaucoma — painless progressive optic neuropathy with characteristic cupping, retinal nerve fibre layer loss and arcuate field defects",
      "Acute angle-closure glaucoma — a painful, rock-hard eye with a mid-dilated oval pupil and a peripheral field loss fixed from the outset",
      "Age-related macular degeneration — painless central vision loss with drusen and normal intraocular pressure",
      "Anterior ischaemic optic neuropathy — an altitudinal field loss with sudden onset, a swollen disc, and vasculitic risk factors",
    ],
    correctAnswer: "Primary open-angle glaucoma — painless progressive optic neuropathy with characteristic cupping, retinal nerve fibre layer loss and arcuate field defects",
    explanation: "Primary open-angle glaucoma is an insidious optic neuropathy causing peripheral field loss before central vision is affected, with raised intraocular pressure, vertical cup enlargement, disc notching, retinal nerve fibre layer defects and glaucomatous perimetry defects (arcuate scotoma, nasal step, Seidel). The contrast is with acute angle closure, which is painful with corneal oedema and a semi-dilated pupil, with macular degeneration, which spares the peripheral field until late, and with AION, which is sudden and altitudinal with disc swelling.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false,
  },

  // 10 — Glaucoma (hard)
  {
    slug: "oph201-acute-angle-closure",
    concept: "glaucoma",
    format: "sba",
    stem: "A 60-year-old presents after several hours in a darkened cinema with severe unilateral eye pain, blurred vision with halos around lights, headache, nausea and vomiting. The eye is injected, the cornea is cloudy, the anterior chamber is shallow and the globe feels rock-hard, with a mid-dilated oval pupil that reacts poorly. What is the immediate management?",
    options: [
      "Start with urgent systemic acetazolamide and topical pressure-lowering drops (beta-blocker, alpha-agonist), then pilocarpine and definitive laser peripheral iridotomy once the eye settles",
      "Give topical atropine to dilate the pupil and open the angle, and admit for overnight observation",
      "Give topical corticosteroid alone and discharge with a review in one week",
      "Give oral metoclopramide for the vomiting and defer ophthalmic review until the symptoms resolve",
    ],
    correctAnswer: "Start with urgent systemic acetazolamide and topical pressure-lowering drops (beta-blocker, alpha-agonist), then pilocarpine and definitive laser peripheral iridotomy once the eye settles",
    explanation: "This is acute angle-closure glaucoma — a pupillary block emergency with a rock-hard globe, cloudy cornea, halos, and a tender semi-dilated oval pupil, made likelier by dark environments and by dilating drugs. Medical therapy must start immediately: systemic acetazolamide (or IV Mannitol if extreme), a topical beta-blocker, an alpha-2 agonist, then pilocarpine once the pressure falls to constrict the sphincter and pull the peripheral iris off the trabecular meshwork, followed by laser peripheral iridotomy (or surgical iridectomy) in both eyes. Drops alone without definitive peripheral iridotomy, and corticosteroids, do not address the pupillary block.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false,
  },

  // 11 — Retinopathies and retinal detachment (medium)
  {
    slug: "oph201-csme-management",
    concept: "retinopathies-retinal-detachment",
    format: "sba",
    stem: "A patient with type 2 diabetes has visual blurring in one eye and fundoscopy showing microaneurysms and blot haemorrhages, with hard exudates and retinal thickening within 500 micrometres of the foveal centre. Which statement is correct?",
    options: [
      "This is clinically significant macular oedema, treated with focal/grid laser photocoagulation or intravitreal anti-VEGF therapy to preserve central vision",
      "This is high-risk proliferative retinopathy requiring urgent panretinal photocoagulation in both eyes regardless of neovascularisation",
      "This is background retinopathy requiring only lifestyle control and review in three years, because laser is only for vitreous haemorrhage",
      "This is a central retinal vein occlusion requiring anticoagulation with warfarin",
    ],
    correctAnswer: "This is clinically significant macular oedema, treated with focal/grid laser photocoagulation or intravitreal anti-VEGF therapy to preserve central vision",
    explanation: "Diabetic macular oedema becomes 'clinically significant' when retinal thickening or hard exudates lie within 500 micrometres of the foveal centre, or involve a disc area of thickening within one disc diameter of the centre — it threatens central vision and is treated with focal/grid photocoagulation or intravitreal anti-VEGF agents. Panretinal photocoagulation is instead indicated for neovascularisation (high-risk PDR) to prevent the complications of vitreous haemorrhage and tractional detachment. Background retinopathy without macular oedema needs glycaemic and blood pressure control with regular retinal surveillance rather than three-yearly review.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false,
  },

  // 12 — Retinopathies and retinal detachment (medium)
  {
    slug: "oph201-rhegmatogenous-detachment",
    concept: "retinopathies-retinal-detachment",
    format: "sba",
    stem: "A patient with high myopia describes a week of flashing lights and new floaters, followed by a shade or curtain advancing across the visual field of one eye. The red reflex is reduced, the detached retina appears grey and billowing, and a retinal tear is seen. What is the correct management?",
    options: [
      "Urgent vitreoretinal surgery — scleral buckling, pneumatic retinopexy, or pars plana vitrectomy to seal the retinal break and reattach the retina",
      "Ocular massage and anterior chamber paracentesis, on the assumption that a retinal embolus has lodged distally",
      "Observation alone for six months, since most detachments reattach spontaneously once the vitreous re-adheres",
      "Intravitreal anti-VEGF injection to regress the neovascular tuft that caused the detachment",
    ],
    correctAnswer: "Urgent vitreoretinal surgery — scleral buckling, pneumatic retinopexy, or pars plana vitrectomy to seal the retinal break and reattach the retina",
    explanation: "Photopsia and floaters from a posterior vitreous detachment followed by a progressive visual field 'curtain' indicate a rhegmatogenous retinal detachment, where vitreous passes through a retinal break (risk factors: high myopia, aphakia, trauma). It is a surgical emergency — scleral buckling, pneumatic retinopexy with cryotherapy or laser, or pars plana vitrectomy reattach the retina, and outcome depends on whether the macula is still attached (macular-on). Without surgery the detachment does not reattach spontaneously; embolic disease causes transient monocular visual loss without a curtain, and anti-VEGF treats proliferative neovascular disease.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false,
  },

  // 13 — Optic nerve and squint (medium)
  {
    slug: "oph201-optic-neuritis",
    concept: "optic-nerve-squint",
    format: "sba",
    stem: "A 30-year-old woman develops painful eye movements and progressive blurring of central vision over days in one eye. Examination shows a relative afferent pupillary defect, impaired colour vision, a central scotoma, and a mildly swollen disc. What is the most appropriate next step in management?",
    options: [
      "MRI brain and orbits with gadolinium, and intravenous methylprednisolone for severe cases, recognising demyelinating optic neuritis as the likely diagnosis",
      "Urgent laser peripheral iridotomy, because a swollen disc with pain indicates acute angle closure",
      "Observation and topical antibiotics, since the disc swelling is infective and will resolve with no systemic therapy",
      "Oral acetazolamide to lower intracranial pressure for presumed papilloedema",
    ],
    correctAnswer: "MRI brain and orbits with gadolinium, and intravenous methylprednisolone for severe cases, recognising demyelinating optic neuritis as the likely diagnosis",
    explanation: "Pain on eye movement with subacute central visual loss, impaired colour vision, a central scotoma and a relative afferent pupillary defect in a young adult is classic demyelinating optic neuritis, often the first episode of multiple sclerosis. MRI with gadolinium is used to define the optic nerve and assess the brain for demyelinating lesions; intravenous methylprednisolone speeds recovery in severe cases though it does not alter final visual outcome. Compressive, ischaemic and infiltrative causes must be excluded by the MRI, and neither iridotomy nor antibiotics addresses this mechanism.",
    difficulty: "medium",
    marks: 1,
    needsCheck: false,
  },

  // 14 — Ocular emergencies and minor surgery (hard)
  {
    slug: "oph201-alkali-chemical-injury",
    concept: "ocular-emergencies-minor-surgery",
    format: "sba",
    stem: "A worker has his eye splashed with drain cleaner. He has intense blepharospasm and pain. What is the single most important first action in the emergency department, and what is the rationale?",
    options: [
      "Immediately irrigate the eye and conjunctival sac copiously with normal saline or Ringer's lactate for at least 30 minutes and until the pH is neutral, before detailed examination",
      "Neutralise the alkali by irrigating with a weak acid such as dilute vinegar, which converts the base to a salt",
      "Instil topical anaesthetic and arrange ophthalmology review the following day, then irrigate in clinic",
      "Apply topical corticosteroids and a pressure pad without irrigation, since irrigation spreads the chemical to the fellow eye",
    ],
    correctAnswer: "Immediately irrigate the eye and conjunctival sac copiously with normal saline or Ringer's lactate for at least 30 minutes and until the pH is neutral, before detailed examination",
    explanation: "Chemical eye injury is the one ocular emergency where irrigation must precede everything else — every minute of delay allows deeper penetration. Alkali burns are more dangerous than acid because saponification of membranes causes liquefactive necrosis and progressive penetration through the cornea into the anterior chamber. Copious neutral irrigation (not neutralising acids/bases, which generates heat and toxic by-products) continues for at least 30 minutes and until the pH returns to normal; steroids, cycloplegics and surgical debridement follow.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false,
  },

  // 15 — National blindness programme and eye banking (easy)
  {
    slug: "oph201-npcb-eye-banking",
    concept: "national-programme-eye-banking",
    format: "sba",
    stem: "In relation to India's National Programme for Control of Blindness (now NPCBVI) and to eye banking, which statement is correct?",
    options: [
      "Cataract remains the priority target disease of the national blindness programme, and corneal transplantation depends on eye banks retrieving donor eyes ideally within about 6 hours of death and preserving them in suitable nutrient medium",
      "Trachoma is the largest single cause of blindness addressed by the programme, and donor eyes may be retrieved at any time within 7 days of death",
      "Glaucoma screening is the principal activity of the programme, and corneal tissue is best used fresh without any storage medium",
      "Refractive error is the target disease, and eye banks harvest donor lenses rather than corneas",
    ],
    correctAnswer: "Cataract remains the priority target disease of the national blindness programme, and corneal transplantation depends on eye banks retrieving donor eyes ideally within about 6 hours of death and preserving them in suitable nutrient medium",
    explanation: "The National Programme for Control of Blindness and Visual Impairment targets the avoidable causes of blindness in India, of which cataract remains the dominant surgical burden alongside refractive error, diabetic retinopathy, childhood blindness and glaucoma. Eye banking supports corneal grafting by counselling and retrieving donor eyes, generally as early as possible and conventionally within about 6 hours of death, with corneas preserved in nutrient media (or stored in organ culture) before transplantation into eyes with opaque or diseased corneas. Trachoma is a target in hyperendemic regions rather than the largest cause, and donor corneas require storage medium.",
    difficulty: "easy",
    marks: 1,
    needsCheck: false,
  },

  // 16 — Optic nerve and squint (easy)
  {
    slug: "oph201-childhood-squint-amblyopia",
    concept: "optic-nerve-squint",
    format: "sba",
    stem: "A 3-year-old has a constant inward (convergent) deviation of the right eye present since infancy, and reduced visual acuity in that eye when tested with each eye covered. The pupils and media are normal. What is the correct first-line management?",
    options: [
      "Cycloplegic refraction to correct any refractive error, then occlusion of the sound eye to treat the amblyopia, with surgical realignment deferred until vision improves",
      "Immediate surgical realignment of the extraocular muscles, since operating on the deviation first restores vision",
      "Patching the deviating eye to strengthen its muscles",
      "No treatment until the age of eight, because childhood squint resolves spontaneously in most children",
    ],
    correctAnswer: "Cycloplegic refraction to correct any refractive error, then occlusion of the sound eye to treat the amblyopia, with surgical realignment deferred until vision improves",
    explanation: "A constant childhood convergent squint causes suppression of the deviating eye and hence amblyopia — a reversible loss of acuity whose treatment window closes around 6-8 years of age. The first-line steps are full cycloplegic refraction and correction of refractive error (spectacles for the hypermetropic refractive imbalance underlying many accommodative esotropias), followed by occlusion (or penalisation) of the sound eye to force use of the amblyopic eye; muscle surgery is planned afterwards for the residual deviation and to restore binocular potential. Patching the sound eye strengthens its visual function, and untreated squint does not reliably resolve spontaneously.",
    difficulty: "easy",
    marks: 1,
  },
];

async function seedAssessmentOphthalmology() {
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

  console.log(`✓ Ophthalmology assessment items: ${count} items (marks 1, needs-human-review)`);
}

// CLI usage: npx ts-node prisma/seed-assessment-ophthalmology.ts
if (process.argv[1] && process.argv[1].includes("seed-assessment-ophthalmology")) {
  seedAssessmentOphthalmology()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}

export { seedAssessmentOphthalmology, ITEMS as OPHTHALMOLOGY_ITEMS };
